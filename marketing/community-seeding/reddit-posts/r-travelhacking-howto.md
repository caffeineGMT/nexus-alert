# r/TravelHacking - How-To Guide Post

**Title:** How I automated Trusted Traveler appointment hunting and got my Global Entry interview 2 months sooner [Guide]

**Body:**

**TL;DR:** Built a free Chrome extension to monitor GOES appointment slots automatically. Got my interview 8 weeks earlier. Sharing my approach + tool for anyone stuck in appointment limbo.

---

## The Problem

If you've applied for Global Entry, NEXUS, or SENTRI recently, you know the interview appointment wait times are brutal right now. My nearest enrollment center (SFO) showed 16 weeks out.

But appointments DO open up regularly when people cancel — they just get booked within 2-3 minutes of appearing. Manually refreshing is exhausting and ineffective.

## The Solution: Automated Monitoring

After wasting 2 weeks refreshing manually, I automated the process. Here's the approach:

### Step 1: Understand How GOES Works
The CBP appointment system has a public API at `ttp.cbp.dhs.gov/schedulerapi`. It returns available slots as JSON. No authentication needed.

### Step 2: Automate the Checks
Instead of manually refreshing, set up automated polling:
- Check every N minutes (30 min = free, 2 min = faster)
- Parse the API response for your target dates/locations
- Trigger immediate notification when slot appears

### Step 3: Act Fast
When notified:
- Open the booking page instantly (one-click from notification)
- Complete booking within 60 seconds if possible
- Slots can disappear while you're filling out the form

## My Implementation

I built a Chrome extension to handle this (called **NEXUS Alert**). It runs silently in the background and monitors the GOES API on your behalf.

**Features:**
- Monitor multiple enrollment centers simultaneously
- Filter by date range and time of day
- Desktop + sound notifications
- Slot history tracking (see when cancellations happen most)
- Optional premium tier for 2-minute checks + SMS alerts

**Link:** https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID?utm_source=reddit&utm_medium=organic&utm_campaign=community_seeding&utm_content=r_travelhacking

## Results

Started monitoring on Feb 15. Got notified of an opening on Feb 18 (3 days). Booked interview for March 12 — **8 weeks sooner** than my original slot.

## Tips for Success

**Best enrollment centers for openings:**
- Large metro airports (SFO, LAX, JFK, ORD) have most turnover
- Land border crossings can be less competitive
- Consider driving 1-2 hours for faster availability

**When cancellations happen:**
- Early mornings (6-8am EST) when CBP processes cancellations
- Sunday evenings when people change weekend plans
- 24-48 hours before existing appointments (last-minute cancellations)

**Optimize your chances:**
- Monitor 3-5 enrollment centers, not just one
- Set filters for dates you're actually available
- Enable SMS alerts if you want to catch slots immediately
- Keep GOES website logged in so booking is one click

## Alternative Approaches

If you don't want to use an extension:
- Write a Python script using `requests` to poll the API
- Set up a cron job on a VPS to check hourly
- Use IFTTT or Zapier to hit the API and email you

The Chrome extension approach is just easier for non-technical folks.

---

**Disclosure:** I built NEXUS Alert, so I'm biased. But it's free and open-source. I'm sharing this because appointment hunting sucks and automation helps.

Questions welcome!

---

## Posting Guidelines

**Best time to post:** Tuesday or Wednesday, 11am-1pm EST (peak r/TravelHacking activity)

**Flair:** "Guide" or "Tools" if available

**Follow-up strategy:**
- This is a high-value subreddit (300K members) — be extra helpful
- Respond to technical questions thoroughly
- Share GitHub link if people want to inspect code
- Emphasize the free tier — this community is optimization-focused
- Mention you're open to feature requests

**Expected engagement:**
- 50-150 upvotes (quality content = traction)
- 20-50 comments
- Target: 80-120 installs from this post (largest reach)

**Common questions:**
- "Is this against TOS?" → Clarify it's just API polling, no scraping/abuse
- "Can I use this for [other program]?" → Confirm all GOES programs work
- "What's the catch?" → Genuinely free, premium optional for faster checks
- "How do I know you're not stealing data?" → Link to privacy policy, explain permissions

**Engagement tips:**
- Offer to help debug if someone has issues
- Thank people who share their success stories
- Be transparent about being the developer
- Engage with critical feedback positively
- Share technical details if people are curious

**Red flags:**
- Mods removing for self-promotion (message them first if unsure)
- Community thinking it's too sales-y (pivot to technical discussion)
- Negative karma in first 2 hours (consider deleting and revising)
