# Product Hunt Launch - Complete Execution Guide

**Your step-by-step playbook to execute a successful Product Hunt launch**

Launch Target: **Tuesday, March 25, 2026 at 12:01 AM PT**

---

## 🎯 Success Targets

- **#5 Product of the Day** (stretch: #1)
- **500+ upvotes**
- **500+ Chrome installs**
- **50+ Premium signups**
- **200+ email signups**

---

## 📅 Timeline Overview

### 14 Days Before Launch
- Create visual assets (gallery images, video)
- Start building email list (target: 200+)
- Reach out to Product Hunt hunters (optional)

### 7 Days Before Launch
- Send pre-launch emails to beta users
- Finalize all assets and documentation
- Test Stripe PRODUCTHUNT promo code

### 3 Days Before Launch
- Send "We're launching!" emails
- Final technical verification
- Prepare all social media posts

### 24 Hours Before Launch
- Update landing page with Extension ID
- Verify all systems operational
- Get 7-8 hours of sleep

### Launch Day (12:01 AM - 11:59 PM PT)
- Execute hour-by-hour engagement plan
- Respond to ALL comments within 30 minutes
- Track metrics in real-time

---

## 📋 Complete Pre-Launch Checklist

### Assets Created ✅

**Visual Assets:**
- [ ] Gallery Image 1: Hero shot (1270×760px PNG)
- [ ] Gallery Image 2: Notification demo (1270×760px PNG)
- [ ] Gallery Image 3: Features comparison (1270×760px PNG)
- [ ] Thumbnail: Extension icon (240×240px PNG)
- [ ] Demo video: 60-second walkthrough (MP4, 1080p)
- [ ] All images compressed with TinyPNG (<1MB each)

**Guide:** See `PH_VISUAL_ASSETS_CREATION.md`

### Landing Page Updated ✅

**File:** `web/src/app/ph/page.tsx`

- [ ] Replace `EXTENSION_ID` with actual Chrome Extension ID (3 locations)
- [ ] Replace `YOUR_POST_ID` with Product Hunt post ID (1 location)
- [ ] Replace `YOUR_VIDEO_ID` with YouTube/Loom video ID (1 location)
- [ ] Verify PRODUCTHUNT promo code banner displays
- [ ] Test all links (Chrome Store, pricing, email capture)
- [ ] Deploy to production (Vercel)
- [ ] Test on mobile (iPhone and Android)

### Backend Configuration ✅

**File:** `backend/src/worker.js`

- [ ] PRODUCTHUNT promo code logic implemented
- [ ] `allow_promotion_codes: true` in checkout session
- [ ] Metadata includes `promoCode` and `source: producthunt`
- [ ] Deploy to Cloudflare Workers
- [ ] Test `/api/checkout` endpoint with promo code

### Stripe Setup ✅

**Dashboard:** https://dashboard.stripe.com/coupons

- [ ] Create PRODUCTHUNT promo code
  - Code: `PRODUCTHUNT`
  - Discount: 100% off
  - Duration: Repeating for 1 month
  - Max redemptions: 500
  - Expiry: Launch day + 7 days
- [ ] Test promo code in checkout flow
- [ ] Verify discount applies correctly

**Guide:** Run `./scripts/create-ph-promo-code.sh`

### Chrome Web Store ✅

- [ ] Extension submitted to Chrome Web Store
- [ ] Extension approved and live
- [ ] Extension ID copied for landing page
- [ ] Screenshots updated in listing
- [ ] Description optimized for search

### Email & Social Prep ✅

- [ ] Email list built (target: 200+ supporters)
  - Beta users: 100
  - BetaList signups: 50
  - Personal network: 30
  - Reddit community: 20
- [ ] Pre-launch emails drafted and ready to send
- [ ] Twitter thread drafted (7 tweets)
- [ ] LinkedIn post written
- [ ] Reddit posts prepared (r/NEXUS, r/GlobalEntry, r/SideProject)
- [ ] Hacker News post ready (optional)

**Templates:** See `store-assets/PH_SOCIAL_MEDIA_TEMPLATES.md`

### Documentation Ready ✅

- [ ] `PH_LAUNCH_MASTER_INDEX.md` reviewed
- [ ] `PH_LAUNCH_DAY_SCRIPT.md` printed or open
- [ ] `PH_COMMENT_RESPONSE_LIBRARY.md` bookmarked
- [ ] `PH_FINAL_LAUNCH_CHECKLIST.md` completed

---

## 🚀 Launch Day Execution (Hour-by-Hour)

### 11:30 PM (Night Before)
- [ ] Final system check (all services operational)
- [ ] Product Hunt submission ready
- [ ] First comment (founder story) copied
- [ ] Team online and ready
- [ ] Notifications enabled (PH, email, Slack)

### 12:01 AM PT — GO LIVE
- [ ] Submit product to Product Hunt
- [ ] **Post first comment IMMEDIATELY** (founder introduction)
- [ ] Verify product appears on PH homepage
- [ ] Verify all links work (Chrome Store, website, video)
- [ ] Share link in team Slack/Discord

### 12:30 AM — Early Engagement
- [ ] Respond to any early comments (<5 min)
- [ ] Check ranking position
- [ ] Monitor for technical issues

### 8:00 AM — Social Media Blitz
- [ ] **Post Twitter launch thread** (7 tweets)
- [ ] Post LinkedIn announcement
- [ ] Email 200+ supporters: "We're LIVE on PH!"
- [ ] Share in Slack communities (Indie Hackers, Makerpad)
- [ ] Share in Reddit communities (helpful, not promotional)

### 9:00 AM — Hacker News (If Momentum is Strong)
- [ ] If 100+ upvotes: Post to Hacker News Show HN
- [ ] Title: "Show HN: NEXUS Alert – Never miss a NEXUS appointment"
- [ ] Link to: `nexusalert.app/ph?utm_source=hackernews`

### 10:00 AM — Midday Check-In
- [ ] Current upvotes: ___ (target: 150+)
- [ ] Current ranking: ___ (target: Top 10)
- [ ] Chrome installs: ___ (target: 50+)
- [ ] Premium signups: ___ (target: 5+)
- [ ] Respond to ALL comments (<30 min response time)

### 12:00 PM — Progress Update
- [ ] Tweet update: "We're #___ on PH today! 🚀"
- [ ] Thank supporters publicly
- [ ] Engage with anyone who shared
- [ ] Check for negative feedback (address immediately)

### 3:00 PM — Afternoon Push
- [ ] Share milestone updates (100 upvotes, 200 upvotes, etc.)
- [ ] Respond to remaining comments
- [ ] Engage with other PH launches (build karma)

### 6:00 PM — Final Ranking Push
- [ ] If close to #1: "Help us reach #1 on PH!"
- [ ] Respond to last-minute comments
- [ ] Thank top engagers personally

### 8:00 PM — Day End Wrap-Up
- [ ] Post thank you thread on Twitter
- [ ] Take screenshots for case study:
  - Full Product Hunt page
  - Ranking position
  - Top comments
  - Analytics dashboard
- [ ] Log final metrics
- [ ] Send thank you email to supporters

---

## 📊 Metrics Tracking

Use the real-time dashboard:

```bash
node scripts/ph-launch-metrics.js
```

Press "u" + Enter to manually update metrics during the day.

**Track hourly:**
- Product Hunt upvotes
- Product Hunt ranking
- Chrome Web Store installs
- Premium signups (Stripe dashboard)
- Email signups (ConvertKit/database)
- PRODUCTHUNT promo code redemptions

---

## 💬 Comment Response Strategy

**Response Time Targets:**
- Peak hours (6 AM - 6 PM PT): <15 minutes
- Off-peak hours: <30 minutes
- Overnight: <1 hour

**Use Pre-Written Responses:**
See `store-assets/PH_COMMENT_RESPONSE_LIBRARY.md` for 20+ copy-paste responses to common questions.

**Top Questions to Prepare For:**
1. "Is this against GOES ToS?"
2. "How is this different from [competitor]?"
3. "Does it work for Global Entry too?"
4. "Is my data safe?"
5. "Can you add [feature]?"

**Engagement Guidelines:**
- ✅ Be genuine, helpful, and transparent
- ✅ Thank everyone for feedback
- ✅ Engage with other launches (build community)
- ✅ Upvote helpful comments
- ❌ Don't ask for upvotes (against PH rules)
- ❌ Don't bash competitors
- ❌ Don't use copy-paste responses without personalizing

---

## 🎨 Visual Assets Upload

When submitting to Product Hunt:

1. **Gallery Images** (upload 3):
   - `store-assets/ph-gallery-01.png`
   - `store-assets/ph-gallery-02.png`
   - `store-assets/ph-gallery-03.png`

2. **Thumbnail** (upload 1):
   - `store-assets/ph-thumbnail.png`

3. **Video** (embed URL):
   - YouTube unlisted link OR
   - Loom share link OR
   - Upload directly to Product Hunt

---

## 🔗 Links to Include in PH Submission

**Product Hunt Submission Form:**

- **Name:** NEXUS Alert
- **Tagline:** Never miss a NEXUS appointment slot
- **Description (260 chars):**
  ```
  24/7 monitoring for NEXUS, Global Entry, and SENTRI appointment openings. Get instant desktop + sound alerts when slots appear. Free with premium upgrades.
  ```
- **Topics:** Travel, Productivity, Chrome Extensions, Notifications, SaaS
- **Website:** https://nexusalert.app/ph
- **Chrome Store:** https://chrome.google.com/webstore/detail/nexus-alert/[YOUR_ID]
- **GitHub:** https://github.com/caffeineGMT/nexus-alert (if public)
- **Twitter:** @nexusalert (if exists)

---

## 📧 Email Blasts (Launch Day)

### Email 1: Beta Users (Send at 12:01 AM)

**Subject:** We're LIVE on Product Hunt! 🚀

**Body:**
```
Hey [Name],

Big news! NEXUS Alert is live on Product Hunt TODAY!

As a beta user, you've been instrumental in making this happen.
I'd love your support:

→ Check it out: [PH Link]
→ Leave a comment if you found it useful
→ Share with anyone who needs NEXUS/Global Entry

Special Product Hunt offer: Use code PRODUCTHUNT for
first month free on Premium tier.

Thank you for being an early supporter!

— Michael
```

### Email 2: Waitlist (Send at 8:00 AM)

**Subject:** NEXUS Alert is LIVE — First month free! 🎉

**Body:**
```
You signed up to be notified when NEXUS Alert launched.

Today's the day! We're live on Product Hunt.

Install the Chrome extension free:
→ [Chrome Store Link]

Want Premium (2-min checks + SMS alerts)?
Use code PRODUCTHUNT for first month FREE.

We're featured on Product Hunt today:
→ [PH Link]

Would love your feedback!

— Michael
```

---

## 🚨 Emergency Protocols

### Issue: Extension Crashes
- Post transparent update in PH comments
- Provide timeline for fix
- Roll back to previous version if needed
- Update when resolved

### Issue: Negative Comments About ToS
- Respond immediately (see response template)
- Emphasize: Only reads public data, no automation
- Offer to discuss privately
- Stay professional

### Issue: Low Upvotes (< 50 in first hour)
- Share more actively on Twitter
- Alert beta users (don't ask for upvotes directly)
- Engage in PH comments on other products
- Check if hunter posted (if using hunter)

### Issue: Stripe Checkout Broken
- Check Stripe dashboard for errors
- Verify API keys are correct
- Test checkout flow manually
- Post update in PH comments if affecting users

---

## 📝 Post-Launch (Day 2+)

### Day 2 (Next Morning)
- [ ] Send thank you email to all supporters
- [ ] Post results on Twitter/LinkedIn
- [ ] Screenshot final ranking for portfolio
- [ ] Respond to remaining comments

### Day 3
- [ ] Write and publish launch retrospective blog post
- [ ] Share lessons learned on Twitter (thread)
- [ ] Collect testimonials from new users
- [ ] Plan next marketing push

### Week 1
- [ ] Analyze metrics (what worked, what didn't)
- [ ] Identify drop-off points in funnel
- [ ] Fix critical bugs reported
- [ ] Ship quick wins from feedback

**Retrospective Template:** See `store-assets/PH_POST_LAUNCH_RETROSPECTIVE.md`

---

## ✅ Final Pre-Flight Verification

**Run this 24 hours before launch:**

```bash
chmod +x scripts/ph-pre-launch-verify.sh
./scripts/ph-pre-launch-verify.sh
```

This script checks:
- ✓ Landing page updated (no placeholders)
- ✓ Backend promo code logic working
- ✓ Visual assets ready
- ✓ Stripe promo code created
- ✓ Chrome Extension live
- ✓ Documentation complete
- ✓ Deployment operational

**All checks must pass before launch.**

---

## 🎯 Key Success Factors

### What Drives Upvotes:
1. **Early momentum** (first 6 hours critical)
2. **Fast response time** (<15 min during peak)
3. **Email list support** (200+ instant upvotes)
4. **Genuine engagement** (not spammy)
5. **Authentic founder story** (personal connection)
6. **Visual quality** (professional assets)
7. **Clear value prop** (solve a real problem)

### Common Mistakes to Avoid:
- ❌ Launching without email list (no initial momentum)
- ❌ Slow response time (looks unengaged)
- ❌ Generic copy-paste responses (feels robotic)
- ❌ Launching on wrong day (Monday/Friday = lower traffic)
- ❌ Not testing promo code (angry users)
- ❌ Forgetting first comment (no context)
- ❌ Ignoring other launches (missed networking)

---

## 📞 Support & Resources

**Documentation:**
- Master index: `store-assets/PH_LAUNCH_MASTER_INDEX.md`
- Day script: `store-assets/PH_LAUNCH_DAY_SCRIPT.md`
- Response library: `store-assets/PH_COMMENT_RESPONSE_LIBRARY.md`
- Social templates: `store-assets/PH_SOCIAL_MEDIA_TEMPLATES.md`

**Scripts:**
- Metrics tracker: `node scripts/ph-launch-metrics.js`
- Pre-launch verify: `./scripts/ph-pre-launch-verify.sh`
- Promo code setup: `./scripts/create-ph-promo-code.sh`

**External Resources:**
- Product Hunt Launch Guide: https://www.producthunt.com/launch
- PH Gallery Specs: https://help.producthunt.com/en/articles/2911750
- Stripe Coupons: https://dashboard.stripe.com/coupons

---

## 🚀 You're Ready to Launch!

**Everything is prepared:**
- ✅ Comprehensive documentation (11 files, 50K+ words)
- ✅ Backend promo code support
- ✅ Landing page with PH special offer
- ✅ Email templates, social templates, response library
- ✅ Launch automation scripts
- ✅ Visual assets creation guide
- ✅ Hour-by-hour execution plan

**Next Steps:**
1. Create visual assets (4-6 hours)
2. Run pre-launch verification script
3. Schedule launch for Tuesday 12:01 AM PT
4. Get good sleep the night before
5. Execute with confidence!

---

**Good luck! 🚀**

You've prepared thoroughly. Now execute with confidence and engage authentically. The Product Hunt community rewards genuine builders solving real problems — and that's exactly what you've built.

**Questions during launch?** Reference this guide + the detailed docs in `store-assets/`.

**Let's make NEXUS Alert a Product Hunt success! 🎉**

---

**Last Updated:** March 18, 2026
**Status:** ✅ Ready for Execution
**Launch Date:** Tuesday, March 25, 2026 at 12:01 AM PT
