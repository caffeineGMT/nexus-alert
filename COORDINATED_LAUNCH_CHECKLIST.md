# NEXUS Alert — Coordinated Multi-Channel Launch Checklist

**Goal:** Execute synchronized launch across Product Hunt, Reddit, Email
**Target:** 500+ Chrome installs Day 1, 50+ premium signups Week 1, Product Hunt Top 5

---

## ⚠️ CRITICAL PREREQUISITE

**DO NOT EXECUTE LAUNCH UNTIL:**
- [ ] Chrome Web Store extension status = **APPROVED** ✅

**Check status now:** https://chrome.google.com/webstore/devconsole

---

## DAY -1: Monday (Day Before Launch)

### Morning (9:00 AM - 12:00 PM)

- [ ] **Verify Chrome Web Store Status**
  - Go to: https://chrome.google.com/webstore/devconsole
  - Status must be: APPROVED ✅
  - If not approved: STOP and address issues first

- [ ] **Get Chrome Extension ID**
  - Copy 32-character Extension ID from dashboard
  - Save to: `EXTENSION_ID.txt`
  - Extension ID: `____________________________________`

- [ ] **Update All Links with Extension ID**
  ```bash
  cd /Users/michaelguo/nexus-alert

  # Find all placeholders
  grep -r "EXTENSION_ID" web/ marketing/ README.md

  # Update manually:
  # - README.md (line 184)
  # - web/src/app/page.tsx
  # - web/src/app/ph/page.tsx (3 locations)
  # - marketing/product-hunt/PH_FOUNDER_COMMENT.md
  # - marketing/community-seeding/REDDIT_POSTS_READY_TO_USE.md (all posts)
  ```

### Afternoon (1:00 PM - 5:00 PM)

- [ ] **Create Stripe Promo Code 'PRODUCTHUNT'**
  ```bash
  cd /Users/michaelguo/nexus-alert/backend/scripts
  chmod +x create-stripe-promo-code.sh
  ./create-stripe-promo-code.sh
  ```

  **Or create manually:**
  - Go to: https://dashboard.stripe.com/coupons
  - Code: `PRODUCTHUNT`
  - Discount: 100% off
  - Duration: Repeating, 1 month
  - Max redemptions: 200
  - Expires: 7 days from launch

- [ ] **Test Promo Code**
  - Visit: https://nexusalert.app/upgrade?promo=PRODUCTHUNT
  - Verify discount applies correctly
  - Complete test checkout

- [ ] **Deploy Updated Landing Pages**
  ```bash
  cd /Users/michaelguo/nexus-alert/web
  npm run build
  git add -A
  git commit -m "Update landing pages with Chrome Extension ID for launch"
  git push origin main
  # Wait for Vercel deployment
  ```

- [ ] **Verify Deployment**
  - Visit: https://nexusalert.app/ph
  - Check: All links have correct Extension ID
  - Check: Promo code banner displays
  - Check: Mobile responsive
  - Check: All CTAs functional

### Evening (6:00 PM - 10:00 PM)

- [ ] **Prepare Product Hunt Submission**
  - Draft in Product Hunt: https://www.producthunt.com/posts/new
  - Name: **NEXUS Alert**
  - Tagline: Copy from `marketing/product-hunt/PH_TAGLINE.txt`
  - Description: 260 characters (see PH_LAUNCH_EXECUTION_GUIDE.md)
  - Upload 3 gallery images from `store-assets/`
  - Upload thumbnail from `store-assets/`
  - Add video (if available)
  - Topics: Productivity, Travel, Chrome Extensions, Notifications, SaaS
  - Website: https://nexusalert.app/ph
  - Chrome Store: https://chromewebstore.google.com/detail/nexus-alert/[EXTENSION_ID]
  - **Save as draft, DO NOT PUBLISH YET**

- [ ] **Prepare ConvertKit Email Broadcast**
  - Go to: https://app.convertkit.com/broadcasts
  - Create broadcast to: NEXUS Waitlist segment
  - Subject: `🚀 NEXUS Alert is live - Never miss an appointment slot again`
  - Body: Copy from `marketing/product-hunt/PH_LAUNCH_EXECUTION_GUIDE.md`
  - Replace all `[EXTENSION_ID]` with actual ID
  - Schedule send: **Tuesday 8:00 AM PT**
  - Send test email to yourself first
  - **Save but do NOT send yet**

- [ ] **Prepare Reddit Posts (Save as Drafts)**
  - Log into Reddit
  - Open 3 browser tabs:
    - Tab 1: r/Nexus
    - Tab 2: r/GlobalEntry
    - Tab 3: r/PersonalFinanceCanada
  - Copy posts from `marketing/community-seeding/REDDIT_POSTS_READY_TO_USE.md`
  - Replace `[EXTENSION_ID]` in all posts
  - Save as drafts in each subreddit
  - **DO NOT POST YET**

- [ ] **Final Asset Verification**
  - [ ] Gallery images: `store-assets/ph-gallery-*.png` (3 files)
  - [ ] Thumbnail: `store-assets/ph-thumbnail.png`
  - [ ] Tagline: `marketing/product-hunt/PH_TAGLINE.txt`
  - [ ] Founder comment: `marketing/product-hunt/PH_FOUNDER_COMMENT.md`
  - [ ] Reddit posts: `marketing/community-seeding/REDDIT_POSTS_READY_TO_USE.md`
  - [ ] All `[EXTENSION_ID]` placeholders replaced

- [ ] **Personal Prep**
  - [ ] Clear calendar: Tuesday 12:01 AM - 10:00 PM PT
  - [ ] Set 3 alarms for 11:45 PM Monday (final check)
  - [ ] Set alarm for 8:45 AM Tuesday (Reddit posts)
  - [ ] Prepare workspace (coffee, snacks, phone charged)
  - [ ] Sleep early (7-8 hours minimum)

---

## LAUNCH DAY: Tuesday

### 11:45 PM Monday — Final Check

- [ ] All assets uploaded to Product Hunt draft
- [ ] All links tested (Chrome Store, landing page, promo code)
- [ ] ConvertKit email scheduled for 8:00 AM PT
- [ ] Reddit posts drafted and ready
- [ ] Metrics dashboard open (Chrome Web Store, Stripe, Analytics)
- [ ] Product Hunt submission page open

---

### 12:01 AM Tuesday — PRODUCT HUNT LAUNCH 🚀

**Timeline:**

**12:01 AM:**
- [ ] Click **Publish** on Product Hunt submission
- [ ] Verify product appears on homepage

**12:02 AM (Within 1 minute):**
- [ ] Post first comment (founder story)
- [ ] Copy from `marketing/product-hunt/PH_FOUNDER_COMMENT.md`
- [ ] Replace `[EXTENSION_ID]` with actual ID
- [ ] Mention PRODUCTHUNT promo code

**12:05 AM:**
- [ ] Verify all links work:
  - [ ] Chrome Web Store link
  - [ ] Landing page /ph
  - [ ] Promo code checkout
  - [ ] Video plays (if embedded)

**12:10 AM:**
- [ ] Share Product Hunt link with close friends (WhatsApp, text)
- [ ] Ask for upvote + comment (personal message, not spam)

**12:30 AM:**
- [ ] Post on Twitter (launch thread)
- [ ] Post on LinkedIn (launch announcement)
- [ ] Monitor Product Hunt comments
- [ ] Respond to all comments within 30 minutes

**Hourly (1:00 AM - 7:00 AM):**
- [ ] Check Product Hunt every hour
- [ ] Respond to all comments within 30 minutes
- [ ] Track upvotes and ranking
- [ ] Get some rest between checks

---

### 8:00 AM Tuesday — EMAIL BLAST

- [ ] Verify ConvertKit email sent automatically
- [ ] Check open rate after 30 minutes
- [ ] Monitor click-through rate
- [ ] Reply to any email responses

---

### 9:00 AM Tuesday — REDDIT LAUNCH

**CRITICAL:** First 2 hours determine Reddit ranking. Engage actively.

**9:00 AM:**
- [ ] Post to r/Nexus
- [ ] Title and body from `REDDIT_POSTS_READY_TO_USE.md`
- [ ] Verify link has correct Extension ID
- [ ] Start 15-minute response timer

**9:10 AM:**
- [ ] Post to r/GlobalEntry
- [ ] Title and body from `REDDIT_POSTS_READY_TO_USE.md`
- [ ] Verify link has correct Extension ID

**9:20 AM:**
- [ ] Post to r/PersonalFinanceCanada
- [ ] Title and body from `REDDIT_POSTS_READY_TO_USE.md`
- [ ] Verify link has correct Extension ID

**9:00 AM - 11:00 AM (CRITICAL WINDOW):**
- [ ] Respond to EVERY Reddit comment within 15 minutes
- [ ] Monitor Product Hunt simultaneously
- [ ] Track Chrome Web Store installs
- [ ] Fast engagement = higher Reddit visibility

---

### All Day (8:00 AM - 8:00 PM)

**Hourly Monitoring:**
- [ ] Product Hunt upvotes and ranking
- [ ] Product Hunt comments (respond <15 min)
- [ ] Reddit comments (respond <30 min)
- [ ] Chrome Web Store installs
- [ ] Stripe premium signups
- [ ] PRODUCTHUNT promo code uses

**Engagement:**
- [ ] Upvote and comment on 5 other Product Hunt launches
- [ ] Thank supporters on Twitter
- [ ] Post milestone updates (50, 100, 200, 500 upvotes)
- [ ] Share user testimonials

---

## Metrics Tracking (Update Hourly)

| Time | PH Upvotes | PH Rank | CWS Installs | Premium | Promo Uses | Reddit Upvotes |
|------|-----------|---------|--------------|---------|------------|----------------|
| 12:30 AM | | | | | | N/A |
| 8:00 AM | | | | | | N/A |
| 9:00 AM | | | | | | 0 |
| 10:00 AM | | | | | | |
| 12:00 PM | | | | | | |
| 2:00 PM | | | | | | |
| 4:00 PM | | | | | | |
| 6:00 PM | | | | | | |
| 8:00 PM | | | | | | |
| FINAL | | | | | | |

---

## Success Targets (Day 1)

### Minimum Success ✅
- [ ] 200+ Chrome installs
- [ ] 20+ Premium signups
- [ ] 200+ Product Hunt upvotes
- [ ] Product Hunt Top 10
- [ ] 100+ Reddit combined upvotes

### Target Success 🎯
- [ ] 500+ Chrome installs
- [ ] 50+ Premium signups
- [ ] 500+ Product Hunt upvotes
- [ ] Product Hunt Top 5
- [ ] 300+ Reddit combined upvotes
- [ ] 100+ PRODUCTHUNT promo uses

### Stretch Success 🚀
- [ ] 1,000+ Chrome installs
- [ ] 100+ Premium signups
- [ ] 1,000+ Product Hunt upvotes
- [ ] Product Hunt #1
- [ ] 500+ Reddit combined upvotes
- [ ] 200 PRODUCTHUNT promo uses (max)

---

## Emergency Protocols

### Promo Code Not Working
1. Check Stripe dashboard: https://dashboard.stripe.com/coupons
2. Verify code is active, not expired
3. Post apology on Product Hunt immediately
4. Manually issue credits to affected users
5. Fix within 30 minutes

### Extension Crashes
1. Check Chrome Web Store developer console
2. Read user error reports
3. Push hotfix if critical
4. Communicate transparently on all channels

### Website Down
1. Check Vercel deployment: https://vercel.com/dashboard
2. Roll back to previous version if needed
3. Post update on Product Hunt
4. Fix within 1 hour

### Negative Comments
1. Stay calm, don't take personally
2. Acknowledge concern professionally
3. Address issue if valid
4. Don't argue or get defensive
5. Take conversation private if needed

---

## Response Templates (Copy-Paste)

**Product Hunt Comment Response:**
```
Thanks for checking out NEXUS Alert! [Answer their specific question]

The free tier checks every 30 minutes and is fully functional.
Premium adds 2-min checks + SMS if you want to be more aggressive.

I used the free tier myself and got an appointment in 3 days.

Let me know if you have any questions!
```

**Reddit "Does this work?" Response:**
```
Yes! I used it myself. Here's exactly what happened:
- Original appointment: May 15 (4 months out)
- Started monitoring: Feb 10
- Got notification: Feb 13 (3 days later)
- New appointment: March 8 (8 weeks earlier)

Three friends have used it since — all got appointments within 5-7 days.

Which enrollment center are you looking at? I can share patterns I've noticed.
```

**Reddit "Is this spam?" Response:**
```
I totally understand why this looks promotional, and I apologize if it came across that way.

Context: I built this 3 weeks ago out of personal frustration. I'm a solo developer, not a company. Friends suggested I share it publicly.

If this violates community guidelines, I'm happy to delete. Just wanted to help others with the same problem I had.

Would it be better to post in [format/day/thread]? I genuinely want to be helpful, not spammy.
```

---

## Key Files Reference

**Launch Guides:**
- This checklist: `COORDINATED_LAUNCH_CHECKLIST.md`
- Product Hunt execution: `marketing/product-hunt/PH_LAUNCH_EXECUTION_GUIDE.md`
- Hour-by-hour script: `store-assets/PH_LAUNCH_DAY_SCRIPT.md`
- Reddit posts: `marketing/community-seeding/REDDIT_POSTS_READY_TO_USE.md`

**Marketing Assets:**
- Tagline: `marketing/product-hunt/PH_TAGLINE.txt`
- Founder comment: `marketing/product-hunt/PH_FOUNDER_COMMENT.md`
- Gallery images: `store-assets/ph-gallery-*.png`
- Thumbnail: `store-assets/ph-thumbnail.png`

**Scripts:**
- Stripe promo: `backend/scripts/create-stripe-promo-code.sh`

---

## Post-Launch (Day 2)

- [ ] Send "Thank You" email to all supporters
- [ ] Post results on Twitter/LinkedIn
- [ ] Screenshot final Product Hunt ranking
- [ ] Collect testimonials from new users
- [ ] Write retrospective blog post
- [ ] Fix critical bugs reported
- [ ] Plan next marketing push

---

## FINAL GO/NO-GO CHECKLIST

**Execute launch ONLY if ALL of these are TRUE:**

- [ ] Chrome Web Store status = APPROVED ✅
- [ ] Extension ID copied and saved
- [ ] All `[EXTENSION_ID]` placeholders replaced
- [ ] Stripe promo code PRODUCTHUNT created and tested
- [ ] Landing pages deployed with correct links
- [ ] Product Hunt draft ready (all assets uploaded)
- [ ] ConvertKit email scheduled for 8:00 AM PT
- [ ] Reddit posts drafted and ready
- [ ] Founder comment ready to copy-paste
- [ ] Calendar cleared Tuesday 12:01 AM - 10:00 PM PT
- [ ] Metrics dashboard set up
- [ ] Got 7-8 hours of sleep

**If ANY item is unchecked: DO NOT LAUNCH. Fix it first.**

---

**Status:** Ready for execution pending Chrome Web Store approval
**Owner:** Michael Guo
**Created:** March 18, 2026
**Launch Target:** Next Tuesday 12:01 AM PT after CWS approval

**Good luck! 🚀**
