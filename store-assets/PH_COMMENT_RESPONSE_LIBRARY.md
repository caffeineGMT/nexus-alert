# Product Hunt Comment Response Library

**Goal:** Respond to ALL comments within 30 minutes
**Tone:** Friendly, helpful, authentic, not overly promotional
**Strategy:** Engage, thank, answer, invite feedback

---

## First Comment — Founder Introduction

**Post this within 5 minutes of launching**

```
Hey Product Hunt! 👋

I'm Michael, the maker of NEXUS Alert.

**The story:**

My wife and I applied for NEXUS in November 2024. The next available appointment? April 2025. Four months away.

But we knew that cancellations create earlier openings. So we started checking the GOES website manually — every morning, every night, during lunch breaks.

After two weeks of this exhausting routine, I realized: *this is a perfect problem for automation*.

So I built NEXUS Alert.

**What it does:**

NEXUS Alert monitors Global Entry/NEXUS/SENTRI appointment slots 24/7 and sends instant alerts when openings appear:

✅ Desktop notifications with sound alerts
✅ Email notifications (Premium)
✅ SMS notifications (Premium)
✅ Multi-location tracking
✅ Smart filters (date range, time of day)
✅ Privacy-first (free tier runs 100% locally)

**The result:**

We found an appointment in 3 days. What would have been a 4-month wait turned into less than a week.

500+ travelers are now using NEXUS Alert. The feedback has been incredible:
- "Life-changing"
- "Found a slot in 2 days after checking manually for a month"
- "This should be built into the GOES website"

**Product Hunt Special:**

First month of Premium completely free with code `PRODUCTHUNT` (limited to 500 redemptions, expires in 7 days).

**I'm here all day to answer questions, hear feedback, and improve the product based on your input.**

Thanks for checking it out!

Michael
```

---

## Response Templates by Question Type

### Q: "How does this work?"

**Response:**
```
Great question!

NEXUS Alert runs as a Chrome Extension with a background service worker that periodically queries the official GOES API (the same data you'd see if you manually checked the website).

**Free tier:** Checks every 30 minutes, runs 100% locally in your browser
**Premium tier:** Checks every 2 minutes via our Cloudflare Workers backend

When a slot matching your criteria appears (location, date range, time of day), you get:
- Desktop notification with sound
- Email alert (Premium)
- SMS alert (Premium)

One click takes you straight to the booking page. The faster you act, the better your chances of grabbing the slot.

No automation of the booking itself — that would violate GOES ToS. We just notify you so you can book manually.

Does that help?
```

### Q: "Is this against GOES Terms of Service?"

**Response:**
```
Great question — we're very careful about this.

NEXUS Alert simply queries the publicly available GOES appointment API — the same data you'd see if you manually refreshed the website. We're not:

❌ Circumventing any security measures
❌ Automating the booking process
❌ Creating unfair advantages
❌ Violating rate limits

We're just saving you the time of manually refreshing. Think of it like setting a Google Alert for news articles, but for appointment slots.

That said, I'm not a lawyer! If you have concerns, I'd recommend reviewing the GOES ToS yourself. The extension is open source so you can see exactly what it does: github.com/caffeineGMT/nexus-alert

Hope that helps!
```

### Q: "Is my data safe?"

**Response:**
```
Absolutely! Privacy was a top priority from day one.

**Free tier:**
- Runs 100% locally in your browser
- ZERO data sent to our servers
- No tracking, no analytics on your searches
- You can use it completely offline

**Premium tier:**
- We only collect your email address (for notifications)
- We don't store your GOES credentials (you book directly on ttp.cbp.dhs.gov)
- We don't track your search patterns or sell your data
- Encrypted communication (TLS)

The extension is fully open source on GitHub so you can audit the code yourself: github.com/caffeineGMT/nexus-alert

If you have specific security questions, happy to answer them!
```

### Q: "What's the difference between Free and Premium?"

**Response:**
```
Great question! Here's the breakdown:

**Free Tier (Forever Free):**
- Checks every 30 minutes
- Desktop notifications with sound
- Multi-location tracking
- Privacy-first (runs locally in your browser)
- No credit card required

**Premium Tier ($4.99/mo):**
- Checks every 2 minutes (15x faster)
- Email notifications even when browser is closed
- SMS notifications (optional)
- Priority support
- Slot history and analytics

**Product Hunt Special:**
First month of Premium completely free with code `PRODUCTHUNT` (limited to 500 redemptions)

The free tier is genuinely useful — I used it myself to find our appointment. But if you want the fastest possible notifications, Premium gives you a significant edge.

Does that help?
```

### Q: "Does this work for [other country/program]?"

**Response:**
```
Currently, NEXUS Alert supports all Trusted Traveler Programs managed through the GOES system:

✅ NEXUS (US-Canada border)
✅ Global Entry (US customs fast-track)
✅ SENTRI (US-Mexico border)

Unfortunately, it doesn't work for programs outside the GOES system (like UK's Registered Traveller or Canada's NEXUS Card separately).

That said, if there's demand for other programs and they have a public API, I'm open to adding support! Let me know if you'd use it for a specific program.
```

### Q: "Why not just use [competitor]?"

**Response:**
```
Great question! There are a few other tools out there, and I respect them all.

What makes NEXUS Alert different:

**Privacy:** Free tier runs 100% locally — no data sent to servers
**Transparency:** Fully open source on GitHub
**Speed:** Premium checks every 2 minutes (faster than most competitors)
**Pricing:** Simple freemium model, no hidden fees or upsells
**User experience:** Clean UI, smart filters, no bloat

I built this for myself first, then realized others might find it useful. My goal isn't to dominate the market — it's to help travelers find appointments faster.

If another tool works better for you, that's great! Competition makes everyone better.
```

### Q: "Can I self-host this?"

**Response:**
```
Yes! The extension is fully open source: github.com/caffeineGMT/nexus-alert

**For the free tier:**
Just install from source and run it locally. No backend needed.

**For the Premium tier:**
The backend code (Cloudflare Workers) is also open source. You can run your own instance if you prefer:
- Deploy to Cloudflare Workers
- Configure your own email/SMS providers (Resend + Twilio)
- Modify check intervals

I believe in open source. You're free to self-host, fork, and modify the code under the MIT license.

That said, the hosted Premium tier is only $4.99/mo, which covers email/SMS costs and keeps the project sustainable. But the choice is yours!
```

### Q: "How did you build this?"

**Response:**
```
Great question! I love talking about the tech stack:

**Frontend (Chrome Extension):**
- Vanilla JavaScript (no frameworks — keep it lightweight)
- Background service worker for monitoring
- Chrome Storage API for settings/state
- Notifications API for alerts

**Backend (Premium tier):**
- Cloudflare Workers (serverless, global edge network)
- Cloudflare KV (key-value storage)
- Stripe for payments
- Resend for email notifications
- Twilio for SMS notifications

**Deployment:**
- Chrome Web Store for extension
- Vercel for landing page (Next.js)
- GitHub for source code

**Why Cloudflare?**
Global edge network = low latency checks from anywhere. Plus generous free tier for bootstrapped projects.

Happy to answer specific technical questions if you have them!
```

### Q: "What's your tech stack?"

**Response:**
```
Love this question!

**Chrome Extension:**
- Vanilla JS (no bloat)
- Background service worker
- Chrome APIs (Storage, Notifications, Alarms)

**Backend:**
- Cloudflare Workers (serverless edge)
- Cloudflare KV (storage)
- Stripe (payments)
- Resend (email)
- Twilio (SMS)

**Landing Page:**
- Next.js 14
- Tailwind CSS
- Deployed on Vercel

**Why this stack?**
Wanted global low-latency for monitoring, minimal costs for bootstrapped project, and simple deployment.

Cloudflare Workers + KV has been perfect for this use case. The entire backend fits in one Worker.

Open source: github.com/caffeineGMT/nexus-alert
```

### Q: "How much does this cost?"

**Response:**
```
**Free tier:** $0/month (forever free)
- Checks every 30 minutes
- Desktop notifications
- Full feature access

**Premium tier:** $4.99/month
- Checks every 2 minutes
- Email + SMS notifications
- Cancel anytime, no contracts

**Product Hunt Special:**
First month of Premium FREE with code `PRODUCTHUNT` (limited to 500 redemptions, expires in 7 days)

No hidden fees, no upsells, no credit card required for free tier.

I wanted to keep it simple and affordable. $4.99/mo covers email/SMS costs and keeps the project sustainable.
```

### Q: "Will you add [feature request]?"

**Response:**
```
Love the suggestion!

I'm keeping a list of all feature requests to prioritize for the roadmap. [Feature] is definitely something I've thought about.

A few questions to help me prioritize:
1. How would you use this feature?
2. How often would you need it?
3. Are there workarounds you're using now?

In the meantime, feel free to open an issue on GitHub (github.com/caffeineGMT/nexus-alert) so others can upvote it!

Thanks for the feedback — this is exactly the kind of input that makes the product better.
```

### Q: "Do you have an affiliate program?"

**Response:**
```
Not yet, but that's a great idea!

Right now I'm focused on making sure the core product works great and provides value.

If there's demand for an affiliate/referral program, I'm open to adding it. Would you be interested in promoting it to your audience?

Feel free to shoot me an email (michael@nexusalert.app) and we can chat!
```

### Q: "What's next for the product?"

**Response:**
```
Great question! Here's what's on the roadmap (in rough priority order):

**Short-term (1-2 months):**
- Slot prediction (ML model to predict when slots are most likely to appear)
- Browser extension for Firefox/Edge
- Advanced filters (interview duration, specific dates)
- Notification sound customization

**Medium-term (3-6 months):**
- Mobile app (iOS/Android)
- Appointment booking assistant (prep checklist, required docs)
- Multi-account support for families

**Long-term (6-12 months):**
- Support for other appointment systems (DMV, passport offices, visa centers)
- API for developers
- White-label solution for B2B

That said, I'm building based on user feedback! If there's a feature you desperately need, let me know and I'll prioritize it.
```

---

## Response to Common Comments

### "This is genius!"

**Response:**
```
Thank you so much! 🙏

Means a lot to hear that. It started as a frustration-driven side project and turned into something that's helping hundreds of people.

If you know anyone waiting for NEXUS/Global Entry, feel free to share!
```

### "I wish this existed when I was waiting for my appointment!"

**Response:**
```
Ugh, sorry you had to go through the manual checking pain!

The good news: if you ever need to renew or if friends/family need appointments, NEXUS Alert will be here. 😊

Thanks for the support!
```

### "Just installed, this is amazing!"

**Response:**
```
Awesome! 🎉

Let me know how it goes. If you find a slot using NEXUS Alert, I'd love to hear about it!

And if you run into any issues or have suggestions, feel free to reach out anytime.
```

### "Upvoted! This solves a real problem."

**Response:**
```
Thank you for the upvote! 🙏

That's exactly why I built it — real problem, real solution, no fluff.

Appreciate the support!
```

### "How are you making money from this?"

**Response:**
```
Great question!

**Free tier:** 100% free, no ads, no data selling
**Premium tier:** $4.99/mo for faster checks (every 2 min) + email/SMS alerts

The premium tier covers infrastructure costs (email/SMS providers) and keeps the project sustainable.

My goal isn't to get rich — it's to build a useful tool and maybe make enough to justify the time I spend maintaining it.

Product Hunt users get first month free with code `PRODUCTHUNT`!
```

### "Is this legal?"

**Response:**
```
Yes! NEXUS Alert queries the publicly available GOES API — the same data you'd see if you manually checked the website.

We're not circumventing security, automating bookings, or doing anything sketchy. Just saving you time.

That said, I'm not a lawyer. If you have concerns, feel free to review the GOES ToS and our open source code: github.com/caffeineGMT/nexus-alert
```

### "I have a bug report..."

**Response:**
```
Thanks for flagging this!

Can you provide some details so I can debug?
- What version of Chrome?
- What step did the error occur?
- Any error messages in the console? (right-click extension icon → Inspect → Console tab)

Feel free to also open an issue on GitHub (github.com/caffeineGMT/nexus-alert) with screenshots if possible.

I'll get this fixed ASAP!
```

---

## Engagement Tips

### DO:
✅ Respond within 30 minutes (faster is better)
✅ Use the person's name if available
✅ Thank people for upvotes, comments, and feedback
✅ Be authentic and conversational
✅ Share your founder story when relevant
✅ Ask clarifying questions to understand feedback
✅ Admit when you don't know something
✅ Link to GitHub for technical questions
✅ Celebrate milestones publicly

### DON'T:
❌ Copy-paste generic responses
❌ Argue with critics (acknowledge, learn, move on)
❌ Oversell or be pushy
❌ Ignore negative feedback
❌ Take criticism personally
❌ Spam your promo code in every response
❌ Respond defensively
❌ Make promises you can't keep

---

## Handling Negative Comments

### "This is a terrible idea" / "This will never work"

**Response:**
```
Thanks for the feedback!

Can I ask what specifically concerns you? I'm genuinely curious to understand.

The product is already being used by 500+ people with positive results, but I'm always open to hearing different perspectives.
```

### "You're just scraping their website, this will get shut down"

**Response:**
```
I appreciate the concern!

NEXUS Alert uses the official GOES API (the same one that powers their website). We're not scraping HTML or bypassing any access controls.

That said, you're right to be cautious. I've designed the extension to respect rate limits and only query the API at reasonable intervals.

If GOES ever explicitly prohibits this kind of monitoring (which would be unfortunate for users), we'll adapt. But for now, we're operating within the publicly available API guidelines.
```

### "Why would I pay for this when I can just check manually?"

**Response:**
```
Totally fair question!

You absolutely can check manually — that's what I did for 2 weeks before building this.

The value proposition:
- Save time (no more refreshing 20+ times per day)
- Catch slots while you sleep or work
- Get notified within 2 minutes (vs hours/days manually)

The free tier is 100% free — try it and see if it saves you time. If it doesn't, no harm done.

But for people who value their time or have been checking for weeks/months, the automation is worth it.
```

---

## Success Metrics

- [ ] Respond to ALL comments within 30 minutes
- [ ] Maintain positive, helpful tone throughout
- [ ] Convert at least 10% of commenters to installers
- [ ] Collect feature requests for roadmap
- [ ] Build relationships with power users

---

**Last Updated:** 2026-03-18
**Status:** Ready to deploy
**Next Action:** Monitor Product Hunt comments every 15-30 minutes on launch day
