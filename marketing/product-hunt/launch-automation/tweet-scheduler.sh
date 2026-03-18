#!/bin/bash

# Product Hunt Teaser Tweet Scheduler
# 5 tweets on Monday (day before Tuesday launch)

PROJECT_ROOT="/Users/michaelguo/nexus-alert"
LAUNCH_DATE="${LAUNCH_DATE:-2026-03-25}" # Tuesday
TEASER_DATE=$(date -v-1d -jf "%Y-%m-%d" "$LAUNCH_DATE" "+%Y-%m-%d") # Monday

echo "🐦 Product Hunt Teaser Tweet Scheduler"
echo "======================================"
echo ""
echo "Launch Date: $LAUNCH_DATE (Tuesday)"
echo "Teaser Date: $TEASER_DATE (Monday)"
echo ""
echo "Goal: Build anticipation + drive early upvotes"
echo ""

# Tweet schedule
cat > "$PROJECT_ROOT/marketing/product-hunt/teaser-tweets.md" << 'EOF'
# Product Hunt Teaser Tweets — Day Before Launch

**Schedule for Monday (day before Tuesday 12:01 AM launch)**

---

## Tweet 1 — 9:00 AM PT (Morning Announcement)

```
🚀 Big news: I'm launching NEXUS Alert on @ProductHunt TOMORROW!

What is it? Chrome extension that monitors NEXUS/Global Entry appointments 24/7 and alerts you the second slots open.

No more manual refreshing. No more missed cancellations.

Launching Tuesday 12:01 AM PT. Set your alarm ⏰

#ProductHunt
```

**Call to action:** Build awareness
**Hashtags:** #ProductHunt
**Media:** Preview image (store-assets/ph-gallery-01.png)

---

## Tweet 2 — 12:00 PM PT (Founder Story)

```
I spent 8 weeks manually refreshing ttp.cbp.dhs.gov trying to find a NEXUS appointment.

Slots would appear and vanish in 60 seconds.

So I built NEXUS Alert to monitor 24/7 for me.

Launching on Product Hunt tomorrow. Here's how it works: 🧵

[Thread continues with 3-4 tweets explaining the problem, solution, results]
```

**Call to action:** Build narrative
**Format:** Thread (3-4 tweets)
**Media:** Screenshots showing before/after

---

## Tweet 3 — 3:00 PM PT (Social Proof)

```
Early users of NEXUS Alert have booked appointments 4-12 weeks earlier than their original slots.

Launching on @ProductHunt tomorrow at 12:01 AM PT.

Want to try it? Drop a 👋 and I'll send you early access before launch.

#NEXUS #GlobalEntry #TravelHack
```

**Call to action:** Build waitlist + engagement
**Engagement bait:** Drop emoji for early access
**Hashtags:** #NEXUS #GlobalEntry #TravelHack

---

## Tweet 4 — 6:00 PM PT (Product Demo)

```
NEXUS Alert in action:

1️⃣ Select your enrollment centers
2️⃣ Extension monitors every 2 minutes
3️⃣ Instant notification when slots appear
4️⃣ Click → book immediately

Launching tomorrow on @ProductHunt.

Here's a quick demo: [video/gif]

#ProductHunt #ChromeExtension
```

**Call to action:** Show product value
**Media:** Demo video or GIF
**Hashtags:** #ProductHunt #ChromeExtension

---

## Tweet 5 — 9:00 PM PT (Final Countdown)

```
3 hours until NEXUS Alert launches on @ProductHunt! 🚀

Launching at 12:01 AM PT (Tuesday).

If you've ever struggled to find NEXUS/Global Entry appointments, you'll love this.

Drop a ⏰ if you want me to remind you when we're live.

Link coming at midnight 👇
```

**Call to action:** Final push for anticipation
**Engagement bait:** Drop ⏰ for reminder
**Timing:** 3 hours before launch

---

# Launch Day Tweet — 12:01 AM PT (Tuesday)

```
🚀 NEXUS Alert is LIVE on Product Hunt!

Never miss a NEXUS, Global Entry, or SENTRI appointment slot again.

Free Chrome extension. Instant notifications. Works 24/7.

First month of Premium FREE with code PRODUCTHUNT.

👉 https://www.producthunt.com/posts/nexus-alert

Help us get to #1! 🙏
```

**Call to action:** Direct call to upvote
**Media:** Product Hunt featured image
**Promo code:** PRODUCTHUNT

---

# Engagement Strategy

**Monday:**
- Respond to EVERY comment within 15 minutes
- Like and retweet supportive tweets
- DM people who engage asking for early access
- Build hype and anticipation

**Tuesday (Launch Day):**
- Post launch tweet at 12:01 AM PT
- Pin tweet to profile
- Cross-post to LinkedIn
- Share in relevant Slack/Discord communities
- Email hunter list with Product Hunt link

---

# Hashtags to Use

Primary:
- #ProductHunt
- #ChromeExtension
- #NEXUS
- #GlobalEntry

Secondary:
- #TravelHack
- #Immigration
- #Productivity
- #SaaS

---

# Accounts to Tag

- @ProductHunt (on launch tweet)
- Immigration influencers (if they engage)
- Tech Twitter accounts who cover launches

---

# Analytics to Track

- Impressions per tweet
- Engagement rate
- Click-through rate to Product Hunt
- Email signups from Twitter traffic

Goal: 10,000+ impressions, 500+ engagements, 100+ clicks to Product Hunt

EOF

echo "✓ Teaser tweet content saved to: marketing/product-hunt/teaser-tweets.md"
echo ""

# Show tweets
cat "$PROJECT_ROOT/marketing/product-hunt/teaser-tweets.md"

echo ""
echo "================================================"
echo "Next Steps:"
echo "================================================"
echo ""
echo "1. Review and customize tweets above"
echo "2. Schedule using Twitter/X scheduler or Buffer"
echo "3. Prepare media assets (screenshots, GIFs, videos)"
echo "4. Set phone reminders to engage with replies"
echo "5. Track metrics in Twitter Analytics"
echo ""

# Create media checklist
cat > "$PROJECT_ROOT/marketing/product-hunt/tweet-media-checklist.md" << 'EOF'
# Tweet Media Checklist

Required media for teaser tweets:

- [ ] Tweet 1: Preview image (store-assets/ph-gallery-01.png)
- [ ] Tweet 2: Before/after screenshots (2-3 images)
- [ ] Tweet 3: User testimonial screenshots (if available)
- [ ] Tweet 4: Product demo video/GIF (30-60 seconds)
- [ ] Tweet 5: Countdown graphic or meme
- [ ] Launch tweet: Product Hunt featured image

Optional:
- [ ] Founder photo for personal touch
- [ ] Team photo if applicable
- [ ] Custom graphics with brand colors (#2563EB)

Tools:
- Video: Loom, Screen Studio, or iPhone screen recording
- GIF: Gifox, LICEcap, or CloudApp
- Images: Figma or Canva
- Compression: TinyPNG, ImageOptim

Specs:
- Images: Max 5MB, 1200x675px optimal
- Videos: Max 512MB, max 2:20 duration
- GIFs: Max 15MB, keep under 10 seconds
EOF

echo "✓ Media checklist saved to: marketing/product-hunt/tweet-media-checklist.md"
echo ""

# Create engagement tracking template
cat > "$PROJECT_ROOT/marketing/product-hunt/tweet-analytics.csv" << 'EOF'
tweet_number,time,impressions,engagements,link_clicks,retweets,likes,replies,notes
1,9:00 AM,0,0,0,0,0,0,
2,12:00 PM,0,0,0,0,0,0,
3,3:00 PM,0,0,0,0,0,0,
4,6:00 PM,0,0,0,0,0,0,
5,9:00 PM,0,0,0,0,0,0,
launch,12:01 AM,0,0,0,0,0,0,
EOF

echo "✓ Analytics template saved to: marketing/product-hunt/tweet-analytics.csv"
echo ""

echo "All tweet content and templates generated!"
echo ""
echo "Files created:"
echo "  1. marketing/product-hunt/teaser-tweets.md (tweet content)"
echo "  2. marketing/product-hunt/tweet-media-checklist.md (required media)"
echo "  3. marketing/product-hunt/tweet-analytics.csv (metrics tracking)"
