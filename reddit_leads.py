#!/usr/bin/env python3
"""
NEXUS Alert — Reddit Lead Finder

Searches Reddit for posts about NEXUS/Global Entry appointment scheduling
frustrations, ranks them by engagement potential, and generates ready-to-paste
comments promoting NEXUS Alert.

Usage:
    python3 reddit_leads.py
    python3 reddit_leads.py --limit 50 --days 90
    python3 reddit_leads.py --output leads.json
"""

import json
import re
import sys
import time
import urllib.request
import urllib.parse
from datetime import datetime, timezone
from argparse import ArgumentParser

# ─── Config ────────────────────────────────────────────────────────

PRODUCT_URL = "https://github.com/caffeineGMT/nexus-alert"
LANDING_URL = "https://caffeinegmt.github.io/nexus-alert/"

SEARCH_QUERIES = [
    "nexus appointment slot",
    "nexus interview appointment",
    "nexus enrollment center wait",
    "nexus appointment cancellation",
    "nexus card appointment booking",
    "global entry appointment slot",
    "global entry interview wait",
    "global entry appointment impossible",
    "global entry enrollment center full",
    "trusted traveler appointment",
    "ttp appointment slot",
    "goes appointment nexus",
    "sentri appointment wait",
    "nexus renewal appointment",
    "global entry renewal slot",
    "nexus appointment months away",
    "nexus appointment checker",
    "nexus slot monitor",
]

SUBREDDITS = [
    "nexus",
    "GlobalEntry",
    "TrustedTraveler",
    "travel",
    "canadatravel",
    "immigration",
    "vancouver",
    "canada",
    "uscis",
    "awardtravel",
    "churningcanada",
    "PersonalFinanceCanada",
]

# Keywords that signal high intent (frustrated user looking for help)
HIGH_INTENT_KEYWORDS = [
    "no slots", "no appointments", "can't find", "impossible",
    "months away", "so frustrating", "refreshing", "keep checking",
    "any tips", "how do you", "does anyone know", "is there a way",
    "tool", "bot", "monitor", "notification", "alert",
    "cancellation", "cancelled slot", "how to get",
    "waited months", "3 months", "6 months", "earliest available",
    "keeps refreshing", "f5", "manual", "tedious",
    "help me", "advice", "recommendation",
]

# ─── Reddit API ────────────────────────────────────────────────────

HEADERS = {
    "User-Agent": "NexusAlertLeadFinder/1.0 (research tool)",
}


def reddit_search(query, sort="relevance", limit=25, time_filter="year"):
    """Search Reddit via public JSON API."""
    params = urllib.parse.urlencode({
        "q": query,
        "sort": sort,
        "t": time_filter,
        "limit": limit,
        "type": "link",
    })
    url = f"https://www.reddit.com/search.json?{params}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())
            return data.get("data", {}).get("children", [])
    except Exception as e:
        print(f"  [warn] Search failed for '{query}': {e}", file=sys.stderr)
        return []


def reddit_subreddit_search(subreddit, query, limit=25):
    """Search within a specific subreddit."""
    params = urllib.parse.urlencode({
        "q": query,
        "restrict_sr": "on",
        "sort": "relevance",
        "t": "year",
        "limit": limit,
    })
    url = f"https://www.reddit.com/r/{subreddit}/search.json?{params}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())
            return data.get("data", {}).get("children", [])
    except Exception as e:
        print(f"  [warn] Subreddit search failed r/{subreddit}: {e}", file=sys.stderr)
        return []


# ─── Scoring ───────────────────────────────────────────────────────

def is_relevant(post):
    """
    Hard filter: is this post actually about NEXUS/Global Entry/SENTRI appointments?
    Returns False for irrelevant posts (wrong kind of 'nexus', off-topic, etc.)
    """
    title = (post.get("title") or "").lower()
    body = (post.get("selftext") or "").lower()
    text = f"{title} {body}"
    subreddit = (post.get("subreddit") or "").lower()

    # Must contain at least one appointment-related term
    appointment_terms = [
        "appointment", "interview", "enrollment", "enrolment",
        "goes", "ttp", "trusted traveler", "cbp",
        "slot", "schedule", "booking", "booked",
        "renewal", "conditionally approved", "conditional approval",
    ]
    has_appointment = any(t in text for t in appointment_terms)

    # Must contain at least one program term
    program_terms = [
        "nexus card", "nexus program", "nexus interview", "nexus appointment",
        "nexus renewal", "nexus enrol", "nexus slot", "nexus application",
        "global entry", "globalentry", "sentri",
        "trusted traveler", "ttp.cbp", "goes system",
    ]
    # Special handling: "nexus" alone is too ambiguous (phones, games, etc.)
    # Only count bare "nexus" if it's in a relevant subreddit
    relevant_subs = [
        "nexus", "globalentry", "trustedtraveler", "travel",
        "canadatravel", "awardtravel", "churningcanada", "vancouver",
        "canada", "immigration", "uscis", "personalfinancecanada",
    ]
    has_program = any(t in text for t in program_terms)
    if not has_program and "nexus" in text and subreddit in relevant_subs:
        has_program = True

    return has_appointment and has_program


def score_post(post, max_days=365):
    """
    Score a post 0-100 based on how good a lead it is.
    Higher = better target for a comment.
    """
    score = 0
    title = (post.get("title") or "").lower()
    body = (post.get("selftext") or "").lower()
    text = f"{title} {body}"
    subreddit = (post.get("subreddit") or "").lower()
    ups = post.get("ups", 0)
    num_comments = post.get("num_comments", 0)
    created = post.get("created_utc", 0)

    # ── Relevance keywords (0-35 pts)
    keyword_hits = sum(1 for kw in HIGH_INTENT_KEYWORDS if kw in text)
    score += min(keyword_hits * 5, 35)

    # ── Recency (0-25 pts) — newer posts are more actionable
    age_days = (time.time() - created) / 86400
    if age_days <= 7:
        score += 25
    elif age_days <= 30:
        score += 20
    elif age_days <= 90:
        score += 12
    elif age_days <= 180:
        score += 5

    # ── Engagement (0-10 pts)
    if ups >= 50:
        score += 10
    elif ups >= 20:
        score += 8
    elif ups >= 10:
        score += 6
    elif ups >= 3:
        score += 3
    elif ups >= 1:
        score += 1

    # ── Active discussion (0-10 pts)
    if num_comments >= 20:
        score += 10
    elif num_comments >= 10:
        score += 7
    elif num_comments >= 5:
        score += 4
    elif num_comments >= 2:
        score += 2

    # ── Subreddit relevance (0-15 pts)
    top_subs = ["nexus", "globalentry", "trustedtraveler"]
    mid_subs = ["travel", "canadatravel", "awardtravel", "churningcanada", "vancouver"]
    if subreddit in top_subs:
        score += 15
    elif subreddit in mid_subs:
        score += 10
    else:
        score += 3

    # ── Question / help-seeking bonus (0-5 pts)
    if any(w in text for w in ["?", "any tips", "does anyone", "how do", "help", "advice"]):
        score += 5

    # ── Penalty: locked or archived (can't comment)
    if post.get("locked") or post.get("archived"):
        score -= 30

    return max(0, min(100, score))


def rank_label(score):
    if score >= 70:
        return "HOT"
    elif score >= 50:
        return "WARM"
    elif score >= 30:
        return "COOL"
    else:
        return "LOW"


# ─── Comment Generator ────────────────────────────────────────────

def generate_comments(post):
    """Generate 3 comment variants for a post, tailored to context."""
    title = post.get("title", "")
    body = post.get("selftext", "")
    text = f"{title} {body}".lower()

    # Detect context
    is_frustrated = any(w in text for w in ["frustrat", "impossible", "can't find", "no slots", "months away"])
    is_asking = any(w in text for w in ["?", "any tips", "how do", "does anyone", "advice", "help"])
    is_tool_seeking = any(w in text for w in ["tool", "bot", "monitor", "checker", "notification", "alert", "app"])

    comments = []

    # ── Comment 1: Empathetic + solution
    if is_frustrated:
        comments.append(
            f"I went through the exact same thing — refreshing the GOES site "
            f"over and over was brutal. I ended up using a free Chrome extension "
            f"called NEXUS Alert that monitors for cancellation slots and sends "
            f"you a desktop notification the instant one opens. Got my appointment "
            f"within a week after months of nothing. {PRODUCT_URL}"
        )
    else:
        comments.append(
            f"If you're having trouble finding slots, there's a free Chrome "
            f"extension called NEXUS Alert that monitors the appointment system "
            f"and notifies you when a cancellation opens up. Saved me from "
            f"having to manually refresh. {PRODUCT_URL}"
        )

    # ── Comment 2: Casual / short
    if is_tool_seeking:
        comments.append(
            f"Check out NEXUS Alert — it's a free Chrome extension that does "
            f"exactly this. Monitors slots every few minutes and pings you when "
            f"one opens. Open source too. {PRODUCT_URL}"
        )
    else:
        comments.append(
            f"Pro tip: install NEXUS Alert (free Chrome extension). It watches "
            f"for cancellation slots and alerts you instantly. Way better than "
            f"manually refreshing. {PRODUCT_URL}"
        )

    # ── Comment 3: Detailed / helpful
    if is_asking:
        comments.append(
            f"The trick is catching cancellation slots — they pop up randomly "
            f"and disappear within minutes. Manually checking doesn't really work.\n\n"
            f"I use a free extension called NEXUS Alert that checks the GOES system "
            f"every 1-10 minutes (you choose) and sends a notification with sound "
            f"when a slot opens. It supports NEXUS, Global Entry, and SENTRI, and "
            f"you can filter by date/time so you only get notified for slots that "
            f"actually work for you.\n\n"
            f"It's open source and free: {PRODUCT_URL}"
        )
    else:
        comments.append(
            f"Slots from cancellations show up randomly and get booked fast. "
            f"I found an open source Chrome extension called NEXUS Alert that "
            f"monitors the system in the background and alerts you with a sound "
            f"notification the second a slot appears. Supports multiple locations "
            f"and date/time filters. Free: {PRODUCT_URL}"
        )

    return comments


# ─── Main ──────────────────────────────────────────────────────────

def main():
    parser = ArgumentParser(description="Find Reddit leads for NEXUS Alert")
    parser.add_argument("--limit", type=int, default=25, help="Results per query (default: 25)")
    parser.add_argument("--days", type=int, default=365, help="Max age in days (default: 365)")
    parser.add_argument("--output", type=str, help="Save results to JSON file")
    parser.add_argument("--top", type=int, default=20, help="Show top N results (default: 20)")
    args = parser.parse_args()

    print("=" * 70)
    print("  NEXUS Alert — Reddit Lead Finder")
    print("=" * 70)
    print()

    # Collect posts
    seen_ids = set()
    all_posts = []

    # Global search
    print(f"Searching Reddit ({len(SEARCH_QUERIES)} queries)...")
    for i, query in enumerate(SEARCH_QUERIES):
        results = reddit_search(query, limit=args.limit)
        for item in results:
            post = item.get("data", {})
            pid = post.get("id")
            if pid and pid not in seen_ids:
                seen_ids.add(pid)
                all_posts.append(post)
        print(f"  [{i+1}/{len(SEARCH_QUERIES)}] '{query}' → {len(results)} results")
        time.sleep(1.5)  # Rate limit

    # Subreddit-specific search
    print(f"\nSearching {len(SUBREDDITS)} subreddits...")
    sub_queries = ["nexus appointment", "global entry appointment", "appointment slot"]
    for sub in SUBREDDITS:
        for q in sub_queries:
            results = reddit_subreddit_search(sub, q, limit=10)
            for item in results:
                post = item.get("data", {})
                pid = post.get("id")
                if pid and pid not in seen_ids:
                    seen_ids.add(pid)
                    all_posts.append(post)
            time.sleep(1.0)
        print(f"  r/{sub} — done")

    print(f"\nTotal unique posts found: {len(all_posts)}")

    # Filter by age
    cutoff = time.time() - (args.days * 86400)
    all_posts = [p for p in all_posts if p.get("created_utc", 0) >= cutoff]
    print(f"After age filter ({args.days} days): {len(all_posts)}")

    # Filter by relevance — must actually be about appointments
    all_posts = [p for p in all_posts if is_relevant(p)]
    print(f"After relevance filter: {len(all_posts)}")

    # Score and rank
    scored = []
    for post in all_posts:
        s = score_post(post, args.days)
        scored.append((s, post))
    scored.sort(key=lambda x: -x[0])

    # Display top results
    top_n = scored[:args.top]
    print(f"\n{'=' * 70}")
    print(f"  TOP {len(top_n)} LEADS (ranked by engagement potential)")
    print(f"{'=' * 70}\n")

    output_data = []

    for rank, (score, post) in enumerate(top_n, 1):
        label = rank_label(score)
        title = post.get("title", "(no title)")
        subreddit = post.get("subreddit", "?")
        ups = post.get("ups", 0)
        num_comments = post.get("num_comments", 0)
        permalink = f"https://reddit.com{post.get('permalink', '')}"
        created = datetime.fromtimestamp(post.get("created_utc", 0), tz=timezone.utc)
        age_days = (time.time() - post.get("created_utc", 0)) / 86400

        comments = generate_comments(post)

        print(f"{'─' * 70}")
        print(f"  #{rank}  [{label}]  Score: {score}/100")
        print(f"  r/{subreddit} · {ups} upvotes · {num_comments} comments · {int(age_days)}d ago")
        print(f"  {title}")
        print(f"  {permalink}")
        print()
        for ci, comment in enumerate(comments, 1):
            print(f"  💬 Comment Option {ci}:")
            for line in comment.split("\n"):
                print(f"     {line}")
            print()

        output_data.append({
            "rank": rank,
            "score": score,
            "label": label,
            "title": title,
            "subreddit": subreddit,
            "upvotes": ups,
            "num_comments": num_comments,
            "age_days": round(age_days, 1),
            "url": permalink,
            "created": created.isoformat(),
            "comments": comments,
            "body_preview": (post.get("selftext") or "")[:200],
        })

    print(f"{'─' * 70}")
    print(f"\nSummary: {len(top_n)} leads ranked")
    print(f"  HOT  (70+): {sum(1 for s, _ in top_n if s >= 70)}")
    print(f"  WARM (50+): {sum(1 for s, _ in top_n if 50 <= s < 70)}")
    print(f"  COOL (30+): {sum(1 for s, _ in top_n if 30 <= s < 50)}")
    print(f"  LOW  (<30): {sum(1 for s, _ in top_n if s < 30)}")

    # Save to file
    if args.output:
        with open(args.output, "w") as f:
            json.dump(output_data, f, indent=2)
        print(f"\nResults saved to {args.output}")

    return output_data


if __name__ == "__main__":
    main()
