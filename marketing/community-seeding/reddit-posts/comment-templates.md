# Reddit Comment Templates

Use these templates when responding to relevant threads. Customize for context — never copy-paste exactly.

---

## Template 1: "Can't Find Appointments" Thread

**Context:** Someone posts frustrated about no available slots

**Template:**
```
I totally get the frustration. Slots do appear when people cancel, but they vanish in 2-3 minutes — basically impossible to catch manually.

A few things that helped me:

1. **Check early mornings** (6-8am EST) — CBP processes cancellations overnight
2. **Expand your radius** — if you're near [City], check [nearby cities] too
3. **Monitor multiple enrollment centers** — increases your chances

I was refreshing manually for 2 weeks before I automated it with a Chrome extension I built. Checks every 30 min and sends a desktop notification when slots open. Got my appointment 6 weeks earlier than my original slot.

Happy to share the link if that's helpful, or feel free to DM me.
```

**When to use:**
- Posts titled "No appointments available"
- Comments saying "been checking for weeks"
- Frustration about wait times

**Follow-up if they ask for link:**
```
Sure! It's called NEXUS Alert: [CWS link with UTM]

Free tier checks every 30 min (plenty fast for most people). Premium is $4.99/mo if you want 2-min checks + SMS alerts, but I used the free version myself and it worked great.

Let me know if you have any questions!
```

---

## Template 2: "Which Enrollment Center" Thread

**Context:** Someone asking which location to choose

**Template:**
```
Great question. I've been tracking appointment availability patterns for a few months (built a monitoring tool for this), and here's what I've observed:

**High turnover (easier to get):**
- [List 2-3 specific centers based on actual data]
- These tend to have more cancellations, especially [days/times]

**Lower turnover (harder):**
- [List 2-3 centers]
- Still worth monitoring if they're convenient for you

**Pro tip:** Don't limit yourself to one center. Monitor 3-5 simultaneously and grab the first available. The enrollment location doesn't matter for your NEXUS benefits.

If you want to track multiple centers automatically, I built a free Chrome extension that does this: [CWS link with UTM]

Happy to share data for specific locations if you want.
```

**When to use:**
- Posts asking about best enrollment centers
- Comparing locations
- First-time applicants asking where to interview

**Follow-up:**
- Share actual data if you have it
- Mention seasonal patterns if relevant
- Offer to check their specific centers

---

## Template 3: "Success Story" Thread

**Context:** Someone posts they got an appointment

**Template:**
```
Congrats! 🎉 How long were you monitoring before you caught this slot?

I found that [enrollment center] tends to release slots around [time pattern]. Your success story will help others know what to expect.

For anyone still hunting: I built a tool that automates the monitoring so you don't have to refresh constantly: [CWS link with UTM]

It's how I got mine 8 weeks sooner.
```

**When to use:**
- Posts celebrating getting an appointment
- Comments saying "finally booked!"
- Success stories

**Follow-up:**
- Ask what method they used (to learn from them)
- Congratulate genuinely
- Offer tips if they ask

---

## Template 4: "First Time Applicant" Thread

**Context:** Someone asking general NEXUS questions

**Template:**
```
Welcome! Quick tips from someone who just went through this:

**Application:**
- Takes 2-4 weeks for conditional approval
- Be thorough with addresses/employment history

**Interview:**
- Next available slots can be months out
- BUT slots open up constantly when people cancel
- Most people wait weeks refreshing manually

**Pro tip:** Automate the slot checking. I built a free Chrome extension that monitors for you and alerts when slots open: [CWS link with UTM]

Got my appointment 6 weeks earlier than the original slot.

Other questions? Happy to help!
```

**When to use:**
- "First time applying" posts
- General NEXUS questions
- Timeline questions

**Follow-up:**
- Answer specific questions thoroughly
- Share your own application timeline
- Be encouraging

---

## Template 5: "How Long to Get Appointment" Thread

**Context:** Someone asking about wait times

**Template:**
```
It varies a lot by location. Right now I'm seeing:

**Without monitoring:** 8-16 weeks depending on center
**With active monitoring:** 3-10 days typically

The key is catching cancellations. They happen daily but get booked within minutes. I tried refreshing manually for 2 weeks and missed every single one.

I ended up building a Chrome extension to check automatically (every 30 min, free). Got notified after 3 days of monitoring and booked a slot 6 weeks sooner: [CWS link with UTM]

Which enrollment center are you targeting? I can share what I've seen for that location.
```

**When to use:**
- Posts asking about timelines
- "How long did it take" threads
- Wait time frustration

**Follow-up:**
- Share specific data for their center
- Acknowledge their frustration
- Offer realistic expectations

---

## Template 6: Technical/API Discussion

**Context:** Technical users asking about GOES API

**Template:**
```
The GOES API is actually pretty straightforward: `ttp.cbp.dhs.gov/schedulerapi/locations/{id}/slots?startTimestamp=X&endTimestamp=Y`

Returns JSON with available slots. No auth required (public API).

I built a Chrome extension around this for monitoring: [CWS link with UTM]

It polls the API every 30 min (configurable) and sends notifications when slots match your filters (date range, time of day, etc.).

Code is on GitHub if you want to inspect: [GitHub link]

Are you building something too? Happy to share technical details.
```

**When to use:**
- Technical discussions about automation
- API questions
- Developer threads

**Follow-up:**
- Share technical implementation details
- Offer to collaborate if they're building something
- Be open about challenges you faced

---

## Template 7: Privacy/Security Concerns

**Context:** Someone asks if tools are safe

**Template:**
```
Totally valid concern. Here's how NEXUS Alert handles privacy:

**What it accesses:**
- Only the public GOES API (no login, no personal data)
- Browser notifications permission (to alert you)
- Storage permission (to save your center preferences)

**What it does NOT do:**
- Never accesses your GOES account/login
- Doesn't track your browsing
- Doesn't send data to external servers (free tier)
- No analytics, no ads

Code is open source on GitHub: [GitHub link]

Privacy policy: [Privacy policy link]

For the free tier, everything runs locally in your browser. Premium tier (optional) sends your email to our server for email alerts, but nothing else.

Happy to answer specific security questions!
```

**When to use:**
- Privacy concerns
- "Is this safe" questions
- Security discussions

**Follow-up:**
- Be extremely transparent
- Acknowledge their concerns are valid
- Provide proof (GitHub, privacy policy, Chrome Web Store reviews)

---

## General Comment Guidelines

**DO:**
✅ Give value first (tips, data, insights)
✅ Mention the tool last, casually
✅ Respond to follow-ups within 24 hours
✅ Be humble ("it's a simple tool but it works")
✅ Thank people who try it

**DON'T:**
❌ Lead with the tool link
❌ Copy-paste template exactly
❌ Ignore context of the thread
❌ Be defensive if criticized
❌ Spam every thread (2-3 per day max)

**Tone:**
- Helpful peer, not salesperson
- "I built this because I had the same problem"
- "Happy to share if helpful" not "You should use this"
- Genuine enthusiasm, not hype

**Tracking:**
- Log every comment in TRACKING.csv
- Note which template performed best
- Track upvotes on comments (social proof)
- Monitor which threads drive installs
