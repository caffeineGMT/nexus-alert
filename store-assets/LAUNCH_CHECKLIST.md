# Product Hunt Launch - Quick Reference Checklist

**NEXUS Alert - Product Hunt Launch**
**Target Date:** Within 48 hours of Chrome Web Store approval
**Goal:** Top 5 Product of the Day, 500+ upvotes, 100+ Premium signups

---

## 📋 48 Hours Before Launch

### Content Assets
- [ ] Video demo recorded (60 seconds, 1080p, captions)
- [ ] Video uploaded to YouTube (unlisted)
- [ ] Gallery images created (3 images, 1270×760px each)
- [ ] Gallery images compressed (<500KB each)
- [ ] Testimonials collected (10+ quotes from beta users)
- [ ] Launch copy finalized (tagline, description, first comment)
- [ ] FAQ responses prepared (8 common questions)

### Product Hunt Profile
- [ ] Maker profile complete (bio, avatar, Twitter linked)
- [ ] Company logo uploaded (square, high-res)
- [ ] Product name confirmed: "NEXUS Alert"
- [ ] Topics selected: Productivity, Chrome Extensions, Travel
- [ ] Team members added (if applicable)

### Landing Page (/ph)
- [ ] Video embed working (YouTube iframe)
- [ ] Benefits callouts added (3 sections with icons)
- [ ] Promo code PRODUCTHUNT tested in Stripe
- [ ] UTM tracking on all PH links (?utm_source=producthunt)
- [ ] Google Analytics events firing (install_click, checkout_start)
- [ ] Mobile responsive verified (iPhone, Android)
- [ ] Page load speed <2 seconds

### Backend & Extension
- [ ] Stripe promo code active (PRODUCTHUNT, 100% off first month)
- [ ] Email notifications working (Resend API)
- [ ] SMS notifications working (Twilio API, if enabled)
- [ ] Chrome Web Store listing live and approved
- [ ] Extension tested in Chrome, Edge, Brave
- [ ] Error logging enabled (Sentry or similar)
- [ ] Load testing completed (500 concurrent users)

### Social Media
- [ ] Twitter thread drafted (7 tweets)
- [ ] LinkedIn post written
- [ ] Reddit posts prepared (r/NEXUS, r/GlobalEntry, r/SideProject)
- [ ] Email to subscribers drafted
- [ ] Social media images created (1200×630 for Twitter cards)
- [ ] Launch announcement scheduled

---

## 📅 24 Hours Before Launch

### Final Checks
- [ ] All gallery images uploaded to PH draft
- [ ] Video embed tested on PH draft
- [ ] Launch copy proofread (no typos)
- [ ] Promo code redemption limit set (500 max)
- [ ] Backup plan if Chrome Web Store approval delayed
- [ ] Support email monitored (hello@nexusalert.app)
- [ ] Team briefed on launch day activities (if applicable)

### Pre-Notifications
- [ ] Email beta users: "We're launching on PH tomorrow!"
- [ ] Tweet teaser: "Launching on Product Hunt tomorrow 🚀"
- [ ] Post in relevant Slack/Discord communities
- [ ] Notify friends/supporters for day-of upvotes

### Sleep Well
- [ ] Get 7-8 hours of sleep (need energy for launch day!)
- [ ] Set alarm for 6:00 AM PT
- [ ] Prepare coffee/tea/fuel for the day

---

## 🚀 Launch Day (Hour-by-Hour)

### 6:00 AM PT — Submission
- [ ] Submit to Product Hunt (launches at 12:01 AM PT daily)
- [ ] Upload gallery images (3)
- [ ] Embed video demo
- [ ] Paste tagline and description
- [ ] Add topics and makers
- [ ] Publish

### 6:05 AM PT — First Comment
- [ ] Post maker introduction (first comment)
- [ ] Share PH link to team/friends for initial upvotes
- [ ] Pin first comment if possible

### 6:30 AM PT — Social Blitz
- [ ] Tweet launch announcement (with PH link)
- [ ] Post to LinkedIn (personal story + PH link)
- [ ] Post to Reddit: r/NEXUS, r/GlobalEntry, r/SideProject
- [ ] Email subscribers (launch announcement)
- [ ] Post in relevant Facebook groups (if member)

### 7:00-10:00 AM PT — Engage
- [ ] Monitor PH comments (respond within 30 min)
- [ ] Thank supporters who upvote/comment
- [ ] Engage with other PH launches (support fellow makers)
- [ ] Share early milestones on Twitter (50 upvotes, 100 upvotes)

### 10:00 AM-1:00 PM PT — Peak Hours
- [ ] Continue monitoring comments every 30-60 min
- [ ] Respond to all questions (use pre-written FAQ responses)
- [ ] Tweet updates (user testimonials, upvote milestones)
- [ ] Monitor analytics (installs, signups, conversions)

### 1:00-5:00 PM PT — Afternoon Push
- [ ] Post testimonial screenshots to Twitter/LinkedIn
- [ ] Engage with PH community (upvote other launches)
- [ ] Share PH link in additional communities
- [ ] Monitor for any technical issues (errors, bugs)

### 5:00-10:00 PM PT — Evening Engagement
- [ ] Continue responding to PH comments
- [ ] Share day-end stats on Twitter ("We're at 300 upvotes!")
- [ ] Thank top supporters publicly
- [ ] Prepare for next day follow-up

### 10:00 PM PT — End of Day
- [ ] Post thank-you comment on PH
- [ ] Tweet final stats (upvotes, ranking, signups)
- [ ] Review analytics dashboard
- [ ] Plan Day 2 activities

---

## 📊 Metrics Dashboard (Track Live)

| Metric | Goal | Current | Status |
|--------|------|---------|--------|
| PH Upvotes | 500+ | — | — |
| PH Ranking | Top 5 | — | — |
| PH Comments | 50+ | — | — |
| CWS Installs | 2,000+ | — | — |
| Premium Signups | 100+ | — | — |
| PRODUCTHUNT Code Uses | 500 max | — | — |
| Email Signups | 500+ | — | — |
| Website Traffic | 10,000+ | — | — |
| Conversion Rate (Install) | 5%+ | — | — |

**Refresh hourly on launch day.**

---

## 🎯 Milestones to Tweet About

- [ ] 50 upvotes: "🎉 50 upvotes in the first hour!"
- [ ] 100 upvotes: "100 upvotes! Thank you PH community!"
- [ ] 200 upvotes: "200 upvotes! 🚀 We're trending!"
- [ ] Top 10: "We're in the Top 10!"
- [ ] Top 5: "Top 5 Product of the Day! 🏆"
- [ ] 500 upvotes: "500 upvotes! You all are amazing!"
- [ ] Featured badge: "Featured on Product Hunt! 🎖️"
- [ ] 100 installs: "100 installs in the first 6 hours!"
- [ ] First Premium signup: "Our first Premium subscriber! 🎊"

---

## 💬 Pre-Written Responses (Copy-Paste Ready)

### "How does this work?"
> NEXUS Alert runs as a Chrome Extension that periodically queries the GOES appointment system for available slots. When it detects an opening at your selected enrollment centers, it fires a desktop notification and an audible alert so you can act immediately. Free tier checks every 30 min, Premium checks every 2 min.

### "Is my data safe?"
> Your data stays on your device. The free extension never sends your information to any server — all monitoring happens locally in your browser. Premium users share only their email address for account management and notifications. Open source on GitHub for full transparency.

### "What's the promo code?"
> Product Hunt users get the first month of Premium FREE with code **PRODUCTHUNT** (limited to 500 redemptions, expires in 7 days). Just install the free extension, then upgrade and enter the code at checkout.

### "Does this work for Global Entry too?"
> Yes! NEXUS Alert monitors all Trusted Traveler Programs managed through the GOES system: NEXUS (US-Canada border), Global Entry (US customs fast-track), and SENTRI (US-Mexico border). You can monitor multiple programs simultaneously.

### "Is this against the GOES TOS?"
> Nope! NEXUS Alert simply queries the publicly available GOES appointment API — the same data you'd see if you manually checked the website. We're not circumventing security, automating bookings, or creating unfair advantages. We're just saving you the time of manually refreshing.

### "Tech stack?"
> Chrome Extension (vanilla JS), Cloudflare Workers (backend), Stripe (payments), Resend (email), Twilio (SMS), Cloudflare KV (database). Chose Cloudflare for global edge network and serverless scalability.

### "Why not just use [competitor]?"
> NEXUS Alert focuses on three things: privacy (local-only processing for free tier), user experience (clean UI, smart filters), and reliability (Cloudflare-backed infrastructure). We also offer transparent pricing with no hidden fees.

### "Can I self-host?"
> Yes! The extension is open source on GitHub. The backend for Premium features is also open source — you can run your own Cloudflare Worker if you prefer. We believe in open source while building a sustainable business.

---

## 🚨 Emergency Contacts

**If something breaks:**
- Backend issues: Check Cloudflare Workers dashboard
- Payment issues: Stripe dashboard → Webhooks
- Chrome Web Store: Developer Dashboard → Support
- Product Hunt: Contact PH support (support@producthunt.com)

**Backup plan if CWS approval delayed:**
- Launch with landing page + waitlist
- Update PH post when extension goes live
- Offer early access via email signup

**If promo code doesn't work:**
- Manually apply credits to affected users
- Post apology on PH
- Fix Stripe webhook immediately

**If server overload:**
- Cloudflare Workers auto-scales
- Monitor error rates in dashboard
- Queue Premium signups if needed

---

## 📧 Day 2-3 Follow-Up

### Day 2 (T+24 hours)
- [ ] Continue monitoring PH comments (slower pace)
- [ ] Respond to all remaining questions
- [ ] Send welcome email to new Premium subscribers
- [ ] Collect testimonials from launch day users
- [ ] Share "Day 2" update on social media
- [ ] Monitor analytics for any issues

### Day 3 (T+48 hours)
- [ ] Final PH engagement (respond to comments)
- [ ] Compile launch metrics (upvotes, ranking, signups)
- [ ] Write launch recap (optional blog post)
- [ ] Thank everyone publicly (Twitter thread)
- [ ] Plan next features based on feedback

---

## ✅ Success Criteria

**Minimum Success:**
- [ ] Top 10 Product of the Day
- [ ] 250+ upvotes
- [ ] 50+ Premium signups
- [ ] 1,000+ Chrome Extension installs

**Target Success:**
- [ ] Top 5 Product of the Day
- [ ] 500+ upvotes
- [ ] 100+ Premium signups
- [ ] 2,000+ Chrome Extension installs
- [ ] Featured badge on Product Hunt

**Stretch Goals:**
- [ ] #1 Product of the Day
- [ ] 1,000+ upvotes
- [ ] 200+ Premium signups
- [ ] Press mention (TechCrunch, The Verge)

---

## 🎊 Post-Launch Celebration

**If Top 5:**
- [ ] Tweet celebration + screenshot
- [ ] Update landing page with "Featured on Product Hunt" badge
- [ ] Email subscribers announcing milestone
- [ ] Treat yourself (you earned it!)

**If Top 1:**
- [ ] Pop champagne (or sparkling cider)
- [ ] Frame PH screenshot
- [ ] Write "How we got #1 on Product Hunt" blog post
- [ ] Share on all social channels

---

## 📂 File Locations

**Launch Assets:**
- Full launch plan: `/store-assets/PRODUCT_HUNT_LAUNCH.md`
- Gallery image specs: `/store-assets/GALLERY_IMAGES_SPECS.md`
- Video demo guide: `/store-assets/VIDEO_DEMO_GUIDE.md`
- Testimonials: `/store-assets/TESTIMONIALS.md`
- This checklist: `/store-assets/LAUNCH_CHECKLIST.md`

**Landing Page:**
- Product Hunt page: `/web/src/app/ph/page.tsx`

**Analytics:**
- Google Analytics: nexusalert.app
- Stripe Dashboard: stripe.com/dashboard
- Chrome Web Store: chrome.google.com/webstore/devconsole

---

## 🔗 Quick Links

- [ ] Product Hunt draft: [Add after creating]
- [ ] Chrome Web Store listing: [Add CWS URL]
- [ ] YouTube video (unlisted): [Add after uploading]
- [ ] Landing page: nexusalert.app/ph
- [ ] Twitter launch thread: [Draft in Twitter]
- [ ] Google Analytics: [Add GA dashboard link]
- [ ] Stripe dashboard: stripe.com/dashboard

---

## 📝 Final Pre-Launch Note

**You've got this!** You've prepared thoroughly:
- ✅ Comprehensive launch plan
- ✅ Video demo script
- ✅ Gallery images spec
- ✅ Testimonials ready
- ✅ Landing page polished
- ✅ Promo code configured
- ✅ Social posts drafted
- ✅ FAQ responses prepared

**Remember:**
1. **Engage authentically** — Product Hunt values genuine interaction
2. **Be helpful** — Answer all questions thoroughly
3. **Stay positive** — Even if feedback is critical
4. **Thank supporters** — Gratitude goes a long way
5. **Have fun** — This is a big moment, enjoy it!

**The goal isn't just to rank high — it's to connect with users who genuinely need this product. Focus on helping travelers find appointments faster. The upvotes will follow.**

Good luck! 🚀

---

**Launch Date:** __________________
**Final Ranking:** __________________
**Total Upvotes:** __________________
**Premium Signups:** __________________
**Lessons Learned:** __________________
