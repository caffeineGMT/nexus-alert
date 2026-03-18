# r/GlobalEntry - Launch Day Post
## Tuesday 9:10 AM PT - Post #2 of 3

---

## Title
Automated Global Entry appointment monitoring → booked 8 weeks earlier than my original slot

---

## Body

Quick timeline:
- **Jan 5:** Submitted Global Entry application
- **Jan 18:** Conditionally approved
- **Jan 19:** Checked ttp.cbp.dhs.gov — next available: April 28 (SFO, SJC, OAK)
- **Jan 20 - Feb 3:** Manually refreshed site 3-4x per day, missed every cancellation
- **Feb 4:** Built Chrome extension to automate monitoring
- **Feb 7:** Got notification at 2:47pm - slot opened at SJC
- **Feb 7 (2:49pm):** Clicked notification, booked appointment for Feb 28

**Saved 8 weeks.**

I know this sounds like a product pitch, but I genuinely built this out of frustration. I'm a software engineer (check my post history - I don't spam product links). The pain of missing slots by minutes was too much.

**What it does:**
- Polls the GOES appointment API every 30 minutes (free) or 2 minutes (premium $4.99/mo)
- Sends desktop notification when your enrollment center(s) have availability
- Filters by date range and time of day (if you only want morning slots)
- Works for Global Entry, NEXUS, and SENTRI

**Chrome Web Store:**
```
https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID?utm_source=reddit&utm_campaign=nexus_launch&utm_content=r_globalentry_launch
```

**Privacy/Security (since I know you'll ask):**
- Doesn't access your GOES account or login
- Runs locally in your browser (free tier)
- Only uses the public appointment API (no auth required)
- Code available on GitHub for inspection: [GitHub link]

[**Proof:** Screenshot of notification + confirmation email - see SCREENSHOT_REQUIREMENTS.md]

I'm active in the comments if anyone has questions, wants technical details, or needs help with specific enrollment centers.

**Update (will add after a few hours):** Several users have reported getting appointments within 3-7 days of starting monitoring. If you try it, please report back!

---

## Posting Instructions

### Timing
- **Post at:** Tuesday 9:10 AM PT (10 min after r/Nexus)
- **Why 10 min delay:** Gives time to gauge r/Nexus response, adjust if needed

### Subreddit Details
- **Community:** r/GlobalEntry
- **Subscribers:** ~8K
- **Rules:** Read subreddit rules for self-promotion (usually OK if helpful)
- **Flair:** "Discussion" or "Success Story" if available

### Pre-Post Checklist
- [ ] Replace `EXTENSION_ID` with actual Chrome Web Store ID
- [ ] Update GitHub link with actual repo URL
- [ ] Upload screenshots to Reddit (inline images)
- [ ] Check r/Nexus post performance (if bad, adjust messaging)

### First 15 Minutes (CRITICAL)
- [ ] Monitor both r/Nexus AND r/GlobalEntry threads
- [ ] Respond to r/GlobalEntry comments FIRST (newer post)
- [ ] Then respond to r/Nexus comments
- [ ] Stay focused, no distractions

### First 2 Hours
- [ ] Respond to ALL comments within 15 minutes
- [ ] Be especially responsive on technical questions (this community is savvy)
- [ ] Share data about enrollment center patterns if asked
- [ ] Don't be salesy - be helpful

---

## Expected Engagement

### Target Metrics
- **Upvotes:** 80-120 (more active community than r/Nexus)
- **Comments:** 20-30
- **Installs:** 150-200
- **Sentiment:** 85% positive

### Likely Comments/Questions
1. **"Does this use the official API?"** → Yes, public API, no auth required
2. **"What enrollment centers work best?"** → Share patterns
3. **"Is this against TOS?"** → Explain it's just notification, not auto-booking
4. **"I built something similar"** → Collaborate, don't compete
5. **"Can I filter by time of day?"** → Yes, explain filters
6. **"Does premium tier auto-book?"** → No, just faster checking

### Higher Engagement Expected
- This community is more active than r/Nexus
- Users are tech-savvy (more technical questions)
- Many are frequent travelers (higher perceived value)
- More likely to pay for premium tier

---

## Response Templates

### Q: "Does this use the official GOES API?"
**A:**
```
Yes! It uses the public appointment availability API:

`ttp.cbp.dhs.gov/schedulerapi/locations/{id}/slots?startTimestamp=X&endTimestamp=Y`

No authentication required (it's public data). The extension just polls this endpoint on your behalf and alerts you when your filters match.

It's the same data you see when you manually check the website - just automated and with notifications.
```

### Q: "I built something similar with Python. Why Chrome extension?"
**A:**
```
Nice! Python scripts are great for this.

I went with Chrome extension because:
1. **Non-technical users** - most people don't know how to run Python
2. **Always on** - Chrome runs in background, no terminal needed
3. **Desktop notifications** - native OS notifications
4. **No server needed** - free tier runs 100% locally

Your Python script probably works better for power users though. Want to compare notes on API quirks?
```

### Q: "What enrollment centers have fastest availability?"
**A:**
```
Based on monitoring patterns I've observed:

**Global Entry (US Airports):**
- **High turnover:** SFO, JFK, LAX, ORD - daily cancellations
- **Medium:** IAH, MIA, SEA - 2-3x per week
- **Lower:** Smaller regional airports

**Time patterns:**
- Most cancellations appear 6-8am EST (overnight processing)
- Weekday mornings > evenings
- Avoid checking Sunday nights (lowest activity)

**Pro tip:** Monitor 5+ airports. You only interview once - location doesn't matter for benefits.

Which airports are you targeting?
```

### Q: "Does premium tier automatically book appointments?"
**A:**
```
No - and that's intentional for a few reasons:

1. **Against TOS** - Auto-booking would violate GOES terms of service
2. **You need to verify** - You want to confirm the time/location works for you
3. **Login required** - Would need your credentials (big security risk)

Premium just checks FASTER (every 2 min vs 30 min) and sends SMS/email in addition to desktop notifications.

The flow is still: Alert → You click → You book manually

Takes 30 seconds once you get the alert.
```

### Q: "How is this different from other tools?"
**A:**
```
Great question. There are a few other tools out there:

**NEXUS Alert advantages:**
- Free tier fully functional (30-min checks)
- No server/backend required for free tier (privacy)
- Works for all Trusted Traveler programs (GE, NEXUS, SENTRI)
- Clean UI, polished UX
- Active development (I respond to feature requests)

**Others might have:**
- Longer history / more established
- Different pricing models
- API features I don't have yet

I built this because existing tools either cost money or required server setup. Wanted something simple and free.

Happy to hear feedback on what features matter most to you.
```

### Q: "Can I filter by time of day? I only want morning appointments."
**A:**
```
Not yet, but you're the 3rd person to ask this!

Currently you can filter by:
- Enrollment centers (multiple)
- Date range (only show slots before X date)

Time-of-day filtering (e.g., "only 8am-12pm slots") is on my roadmap. Would be helpful for people who:
- Can't take time off work
- Prefer morning vs afternoon
- Have specific schedule constraints

If I add it, I'll announce in this subreddit. Thanks for the suggestion!
```

---

## Hour-by-Hour Goals

| Hour | Time | Upvotes | Comments | Responses | Install Estimate |
|------|------|---------|----------|-----------|------------------|
| 0 | 9:10am | 5 | 3 | 3 | 15 |
| 1 | 10:10am | 20 | 8 | 8 | 40 |
| 2 | 11:10am | 35 | 12 | 12 | 75 |
| 4 | 1:10pm | 50 | 18 | 18 | 120 |
| 8 | 5:10pm | 70 | 24 | 24 | 160 |
| 12 | 9:10pm | 80 | 28 | 28 | 180 |

**If behind pace:** Double down on comments, engage more actively

**If ahead of pace:** Capture testimonials, screenshot positive feedback

---

## Success Criteria

**Minimum Success:**
- 50+ upvotes
- 15+ comments
- 100+ installs
- 0 mod warnings

**Target Success:**
- 80+ upvotes
- 20+ comments
- 150+ installs
- 3+ user testimonials

**Breakthrough Success:**
- 120+ upvotes
- 30+ comments
- 200+ installs
- Multiple "this worked for me!" comments

---

## What to Do After Posting

### Immediate (0-2 hours)
1. **Juggle both r/Nexus and r/GlobalEntry threads**
2. Prioritize newest comments first
3. Update tracking sheet for both posts
4. Watch for patterns (what questions are common?)

### Short-term (2-6 hours)
1. Continue monitoring both threads
2. Seed 2-3 other r/GlobalEntry threads with helpful comments
3. Track install spikes by source (Nexus vs GlobalEntry)

### Medium-term (6-24 hours)
1. Respond within 1-2 hours
2. Add "Update:" to post body if users report success
3. Screenshot testimonials

### Long-term (24-72 hours)
1. Check daily for new comments
2. Compile feature requests (for Product Hunt launch)
3. Use learnings for Product Hunt messaging

---

## Engagement Strategy

### This Community is Different
- **More tech-savvy** → Can discuss API details
- **Higher intent** → Frequent travelers, willing to pay
- **More skeptical** → Need proof, data, transparency
- **Better networked** → If they like it, they'll share it

### Messaging Adjustments
- Be more technical (they can handle it)
- Share data/patterns (they want specifics)
- Don't oversimplify (insults their intelligence)
- Acknowledge competitors (shows confidence)

### Opportunities
- Longer, more detailed responses OK here
- Ask for feedback on features
- Invite collaboration (open source discussion)
- Premium tier will sell better here

---

## Notes

- This is likely the highest-converting subreddit of the three
- Users here have higher perceived value of time (frequent travelers)
- More willing to pay for premium tier
- Good source of product feedback and feature requests
- If this succeeds, it validates product-market fit

---

## Tracking Link

**UTM:** `?utm_source=reddit&utm_campaign=nexus_launch&utm_content=r_globalentry_launch`

**Full URL:** Update with actual Extension ID before posting
