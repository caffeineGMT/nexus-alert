# Product Hunt Final Launch Checklist

**Use this checklist 24 hours before submitting to Product Hunt**

---

## ✅ Assets Complete

### Gallery Images
- [ ] `ph-gallery-01.png` created (1270x760px, <1MB)
- [ ] `ph-gallery-02.png` created (1270x760px, <1MB)
- [ ] `ph-gallery-03.png` created (1270x760px, <1MB)
- [ ] `ph-thumbnail.png` created (240x240px, <500KB)
- [ ] All images compressed with TinyPNG
- [ ] All images reviewed for quality and branding

### Video
- [ ] 60-second demo video recorded
- [ ] Captions embedded (hardcoded subtitles)
- [ ] Background music added (royalty-free)
- [ ] Video exported (1080p MP4, <50MB)
- [ ] Video uploaded to YouTube (unlisted) or Loom
- [ ] Video URL ready for embed

---

## ✅ Landing Page Updates

### Required Updates in `/ph` Page

1. **Chrome Extension ID** (3 locations)
   - [ ] Line 34: Nav "Install Free" link
   - [ ] Line 98: Hero "Add to Chrome" link
   - [ ] Line 340: CTA "Install NEXUS Alert" link
   - Replace: `EXTENSION_ID`
   - With: Your actual Chrome Web Store extension ID (from URL)
   - Format: `https://chrome.google.com/webstore/detail/nexus-alert/[YOUR_ID]`

2. **Product Hunt Post ID** (1 location)
   - [ ] Line 55: Product Hunt badge embed
   - Replace: `YOUR_POST_ID`
   - With: Your actual Product Hunt post ID (from URL after submission)
   - Format: `https://www.producthunt.com/posts/nexus-alert`

3. **Video Embed URL** (1 location)
   - [ ] Line 125: YouTube/Loom iframe src
   - Replace: `YOUR_VIDEO_ID`
   - With: Your actual YouTube video ID or Loom share URL
   - Format YouTube: `https://www.youtube.com/embed/[VIDEO_ID]`
   - Format Loom: `https://www.loom.com/embed/[VIDEO_ID]`

### Optional Enhancements
- [ ] Add countdown timer for promo expiration (7 days from launch)
- [ ] Update social proof numbers if beta stats changed
- [ ] Test all UTM tracking links fire correctly in Google Analytics
- [ ] Verify promo code `PRODUCTHUNT` works in Stripe checkout

---

## ✅ Stripe Configuration

### Promo Code Setup
- [ ] Create promo code in Stripe Dashboard
- [ ] Code: `PRODUCTHUNT`
- [ ] Discount: 100% off
- [ ] Duration: 1 month (repeating)
- [ ] Max redemptions: 500
- [ ] Expiration: Launch day + 7 days
- [ ] Test promo code applies correctly at checkout

### Checkout Session Metadata
- [ ] Verify metadata includes:
  - `source: producthunt`
  - `campaign: ph_launch`
  - `utm_source: producthunt`
  - `promo_code: PRODUCTHUNT`

---

## ✅ Chrome Web Store Listing

### Extension Published
- [ ] Extension submitted to Chrome Web Store
- [ ] Extension approved and live
- [ ] Extension ID copied for landing page links
- [ ] Screenshots updated in CWS listing (same as PH gallery?)
- [ ] Description optimized for CWS search

### Version Check
- [ ] Manifest version matches CWS listing (e.g., 2.0.0)
- [ ] No console errors when extension loads
- [ ] All features working in production

---

## ✅ Product Hunt Submission

### Profile Setup
- [ ] Product Hunt maker profile complete
- [ ] Professional headshot uploaded
- [ ] Bio written with credibility signals
- [ ] Twitter, LinkedIn, GitHub linked
- [ ] Past activity (comments, upvotes) for reputation

### Post Content Ready
- [ ] Tagline finalized: "Never miss a NEXUS appointment slot"
- [ ] Description written (260 char): See `PRODUCT_HUNT_LAUNCH.md`
- [ ] Topics selected: Travel, Productivity, Chrome Extensions
- [ ] First comment drafted (founder story)
- [ ] Gallery images ready to upload (3 images)
- [ ] Video ready to embed
- [ ] Thumbnail ready to upload

### Scheduling
- [ ] Launch date chosen: **Tuesday at 12:01 AM PT** (recommended)
- [ ] Post scheduled or ready to publish manually
- [ ] Team notified of launch time
- [ ] Calendar blocked for engagement (8 AM - 8 PM PT)

---

## ✅ Marketing Amplification

### Social Media Prepared
- [ ] Twitter thread drafted (7 tweets)
- [ ] LinkedIn post written
- [ ] Reddit posts ready (r/NEXUS, r/GlobalEntry, r/SideProject)
- [ ] Email to subscribers drafted
- [ ] Social media images created (1200x630 for Twitter cards)

### Community Outreach
- [ ] Beta users notified of launch (email)
- [ ] Maker friends messaged for support
- [ ] Relevant communities identified for sharing

### Press Kit (Optional)
- [ ] Press release written
- [ ] Media kit with assets (logos, screenshots)
- [ ] Contact info for press inquiries

---

## ✅ Analytics & Tracking

### Google Analytics
- [ ] GA4 configured on `/ph` page
- [ ] Custom events firing correctly:
  - `email_signup`
  - `chrome_store_click`
  - `checkout_start`
  - `premium_conversion`
- [ ] UTM parameters tracked:
  - `utm_source=producthunt`
  - `utm_medium=referral`
  - `utm_campaign=ph_launch`
  - `utm_content=[cta_location]`
- [ ] Real-time dashboard set up for launch day monitoring

### Conversion Tracking
- [ ] Stripe webhook configured for conversion events
- [ ] Email capture form submits to database/CRM
- [ ] Chrome Web Store install counts tracked

---

## ✅ Technical Readiness

### Backend
- [ ] Cloudflare Workers deployed to production
- [ ] Premium tier email/SMS notifications tested
- [ ] Database (KV) queries optimized
- [ ] Error logging enabled (Sentry or similar)
- [ ] Load testing complete (500 concurrent users)

### Frontend
- [ ] Landing page deployed to production (Vercel)
- [ ] All links working (Chrome Store, GitHub, privacy)
- [ ] Mobile responsive (test on iPhone and Android)
- [ ] Page load speed <2 seconds (test with Lighthouse)
- [ ] No console errors in browser

### Extension
- [ ] Latest version submitted to Chrome Web Store
- [ ] All features working in production
- [ ] No bugs reported by beta users
- [ ] Notification permissions work correctly
- [ ] Sound alerts play correctly

---

## ✅ Launch Day Preparation

### Response Templates Ready
- [ ] FAQ responses written (see `PRODUCT_HUNT_LAUNCH_PLAN.md`)
- [ ] Common questions prepared:
  - "Does this work for Global Entry too?"
  - "Is this against GOES ToS?"
  - "How fast are notifications?"
  - "How do you make money?"
- [ ] Technical questions prepared
- [ ] Feature requests response template

### Team Coordination
- [ ] Launch day roles assigned (if team)
- [ ] Notification alerts set up (Slack/Discord/email)
- [ ] Real-time tracking dashboard shared
- [ ] Backup contacts identified

### Personal Prep
- [ ] Calendar blocked: 8 AM - 8 PM PT on launch day
- [ ] Sleep well night before
- [ ] Coffee/snacks ready for long day
- [ ] Comfortable workspace set up

---

## ✅ Post-Launch (24 Hours After)

### Engagement
- [ ] Responded to ALL Product Hunt comments (<1 hour)
- [ ] Thanked all supporters publicly
- [ ] Engaged with other launches (support fellow makers)
- [ ] Posted upvote milestones on Twitter

### Metrics Collected
- [ ] Total upvotes
- [ ] Product Hunt ranking (#X of the day)
- [ ] Chrome Extension installs
- [ ] Premium signups
- [ ] Email signups
- [ ] Website traffic (unique visitors)
- [ ] Conversion rate (visitor → install)
- [ ] Promo code redemptions

### Retrospective
- [ ] Screenshot Product Hunt post for portfolio
- [ ] Write launch recap blog post
- [ ] Share results on Twitter/LinkedIn
- [ ] Thank team and supporters
- [ ] Identify what worked / what didn't

---

## 🎯 Success Criteria

### Minimum Viable Success
- [ ] 200+ upvotes
- [ ] Top 10 Product of the Day
- [ ] 100+ Chrome installs
- [ ] 20+ Premium signups
- [ ] 50+ email signups

### Target Success
- [ ] 500+ upvotes
- [ ] Top 5 Product of the Day
- [ ] 500+ Chrome installs
- [ ] 50+ Premium signups
- [ ] 200+ email signups

### Stretch Success
- [ ] 1,000+ upvotes
- [ ] #1 Product of the Day
- [ ] 1,000+ Chrome installs
- [ ] 100+ Premium signups
- [ ] 500+ email signups
- [ ] Featured badge on Product Hunt

---

## 🚨 Emergency Contacts

### Technical Issues
- **Backend down**: Check Cloudflare Workers status
- **Extension broken**: Rollback to previous version in CWS
- **Payment failing**: Check Stripe dashboard, API keys
- **Website down**: Check Vercel deployment status

### Communication
- **Negative comments**: Respond professionally, address concerns
- **Press inquiry**: Direct to press@nexusalert.com (or your email)
- **User support**: Direct to support@nexusalert.com

---

## 📞 Final Reminders

1. **Launch on Tuesday at 12:01 AM PT** (highest Product Hunt traffic)
2. **Post first comment within 5 minutes** (founder story)
3. **Respond to ALL comments within 1 hour** (shows you care)
4. **Don't ask for upvotes explicitly** (against PH rules)
5. **Engage authentically** (support other launches, build community)
6. **Track metrics in real-time** (Google Analytics, Stripe, PH analytics)
7. **Celebrate milestones publicly** (Twitter: 100 upvotes, 500 upvotes, etc.)

---

**You're ready! All assets prepared, landing page polished, strategy documented. Execute with confidence. Good luck! 🚀**

---

**Last Updated**: 2026-03-18
**Status**: Ready for asset creation → launch
**Next Action**: Complete assets using `PH_ASSETS_QUICK_START.md`
