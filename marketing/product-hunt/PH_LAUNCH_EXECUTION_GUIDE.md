# Product Hunt Launch — Complete Execution Guide

**Launch Target:** Tuesday 12:01 AM PT
**Goal:** #1-5 Product of the Day, 500+ upvotes, 500+ Chrome installs, 50+ premium signups

---

## ⚠️ CRITICAL PREREQUISITE

**DO NOT EXECUTE LAUNCH UNTIL CHROME WEB STORE STATUS = APPROVED**

### Step 1: Check Chrome Web Store Status RIGHT NOW

Visit: https://chrome.google.com/webstore/devconsole

**Possible Statuses:**
- ❌ **NOT SUBMITTED** → Submit immediately (see Section A in LAUNCH_DAY_EXECUTION_STATUS.md)
- ⏳ **PENDING REVIEW** → Wait for approval, prepare materials
- ✅ **APPROVED** → Proceed with launch execution below
- 🚫 **REJECTED** → Fix issues and resubmit (see Section D in LAUNCH_DAY_EXECUTION_STATUS.md)

**Only proceed when status = APPROVED ✅**

---

## DAY -1: Pre-Launch Setup (Monday, day before launch)

### 1. Get Chrome Extension ID

**Action:**
1. Go to Chrome Web Store Developer Dashboard
2. Click on your extension
3. Copy the Extension ID (32-character string)
4. Save it — you'll need it in multiple places

**Extension ID:** `[PASTE HERE ONCE YOU HAVE IT]`

---

### 2. Create Stripe Promo Code 'PRODUCTHUNT'

**Run this script:**

```bash
cd /Users/michaelguo/nexus-alert/backend/scripts
chmod +x create-stripe-promo-code.sh
./create-stripe-promo-code.sh
```

**Or create manually in Stripe Dashboard:**

1. Go to: https://dashboard.stripe.com/coupons
2. Click "Create coupon"
3. Settings:
   - **Name:** Product Hunt Launch Special
   - **Code:** PRODUCTHUNT
   - **Type:** Percentage discount
   - **Percentage:** 100% off
   - **Duration:** Repeating
   - **Duration in months:** 1
   - **Max redemptions:** 200
   - **Expiration date:** 7 days from launch day
4. Click "Create coupon"

**Test the promo code:**
```bash
# Test checkout with promo code
curl -X POST https://api.nexus-alert.com/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"promo_code": "PRODUCTHUNT", "test": true}'
```

---

### 3. Update Landing Pages with Extension ID

**Files to update:**

1. **README.md** (line 184)
   - Replace: `Status: Stripe integration is not yet implemented`
   - With: Chrome Web Store installation link

2. **web/src/app/page.tsx**
   - Search and replace all instances of `EXTENSION_ID`

3. **web/src/app/ph/page.tsx**
   - Update Extension ID (3 locations)
   - Update promo code banner

**Run this command:**
```bash
cd /Users/michaelguo/nexus-alert
grep -r "EXTENSION_ID" web/ marketing/ README.md
# Replace all instances with actual Extension ID
```

---

### 4. Verify All Assets Ready

**Product Hunt Submission Assets:**
- [ ] Gallery Image 1: `store-assets/ph-gallery-01.png` (1270×760)
- [ ] Gallery Image 2: `store-assets/ph-gallery-02.png` (1270×760)
- [ ] Gallery Image 3: `store-assets/ph-gallery-03.png` (1270×760)
- [ ] Thumbnail: `store-assets/ph-thumbnail.png` (240×240)
- [ ] Tagline: `marketing/product-hunt/PH_TAGLINE.txt`
- [ ] Founder Comment: `marketing/product-hunt/PH_FOUNDER_COMMENT.md`

**Reddit Posts:**
- [ ] r/Nexus post: `marketing/community-seeding/REDDIT_POSTS_READY_TO_USE.md` (lines 10-56)
- [ ] r/GlobalEntry post: `marketing/community-seeding/REDDIT_POSTS_READY_TO_USE.md` (lines 59-106)
- [ ] r/PersonalFinanceCanada post: `marketing/community-seeding/REDDIT_POSTS_READY_TO_USE.md` (lines 110-167)

**Email Template:**
- [ ] ConvertKit broadcast ready
- [ ] Subject: "🚀 NEXUS Alert is live - Never miss an appointment slot again"
- [ ] Content: See LAUNCH_DAY_EXECUTION_STATUS.md lines 309-362

---

## LAUNCH DAY: Tuesday Execution Timeline

### 12:01 AM PT — Product Hunt Launch

**Action Steps:**

1. **Submit to Product Hunt**
   - Go to: https://www.producthunt.com/posts/new
   - Name: **NEXUS Alert**
   - Tagline: **Never miss a NEXUS appointment slot again**
   - Description:
     ```
     24/7 monitoring for NEXUS, Global Entry, and SENTRI appointment openings.
     Get instant desktop + sound alerts when slots appear at your enrollment centers.
     Free tier checks every 30 minutes. Premium tier ($4.99/mo) adds 2-minute checks + SMS/email alerts.
     ```
   - Topics: **Productivity, Travel, Chrome Extensions, Notifications, SaaS**
   - Website: `https://nexusalert.app/ph`
   - Upload gallery images (3 screenshots from store-assets/)
   - Upload thumbnail
   - Embed demo video (if available)

2. **Post Founder Comment IMMEDIATELY** (within 1 minute)
   - Copy from: `marketing/product-hunt/PH_FOUNDER_COMMENT.md`
   - Replace `[EXTENSION_ID]` with actual ID
   - Post as first comment

3. **Verify Links Work**
   - Chrome Web Store link
   - Landing page `/ph` route
   - Promo code PRODUCTHUNT
   - All CTAs functional

4. **Set Calendar Reminder**
   - Engage every hour for 8 hours
   - Respond to comments within 15 minutes

---

### 8:00 AM PT — Email Blast to Waitlist

**Platform:** ConvertKit (https://app.convertkit.com/)

**Action:**
1. Log in to ConvertKit
2. Go to **Broadcasts** → **Create Broadcast**
3. Select segment: **NEXUS Waitlist** (all subscribers)
4. Subject: `🚀 NEXUS Alert is live - Never miss an appointment slot again`
5. Preview: `Install free in 30 seconds. Start monitoring today.`
6. Body:

```
Hey [First Name],

You signed up to be notified when NEXUS Alert launched.

**It's live now.**

👉 Install the extension: https://chromewebstore.google.com/detail/nexus-alert/[EXTENSION_ID]?utm_source=email&utm_campaign=waitlist_launch

**What is NEXUS Alert?**

Stop manually refreshing ttp.cbp.dhs.gov hoping to catch appointment cancellations.

NEXUS Alert monitors the CBP appointment API 24/7 and sends desktop + sound notifications the moment slots open at your enrollment centers.

**How it works:**
1. Install the Chrome extension (30 seconds)
2. Select your enrollment centers (NEXUS, Global Entry, or SENTRI)
3. Get notified when slots appear
4. Click notification → book immediately

**Pricing:**
- Free tier: Check every 30 minutes (fully functional)
- Premium tier: Check every 2 minutes + SMS/email alerts ($4.99/mo)

**Launch Special:**
First 100 users get 1 month of Premium free with code **PRODUCTHUNT**

👉 Install now: https://chromewebstore.google.com/detail/nexus-alert/[EXTENSION_ID]?utm_source=email&utm_campaign=waitlist_launch

Questions? Reply to this email.

Thanks for your support,
Michael
NEXUS Alert Team

---

P.S. We're launching on Product Hunt today! If you find NEXUS Alert helpful, we'd love your upvote: [PRODUCT_HUNT_LINK]
```

7. **Schedule Send:** 8:00 AM PT Tuesday
8. **Send test email to yourself first**
9. **Review and send**

---

### 9:00 AM PT — Reddit Launch Posts

**CRITICAL:** Replace `[EXTENSION_ID]` with actual Chrome Web Store ID in ALL posts before posting

#### 9:00 AM — r/Nexus (12K members)

**Title:**
```
I was stuck checking ttp.cbp.dhs.gov for 8 weeks. Built a Chrome extension that checks every 30min. Got my appointment in 3 days.
```

**Body:** Copy from `marketing/community-seeding/REDDIT_POSTS_READY_TO_USE.md` lines 18-50

**UTM Link:**
```
https://chromewebstore.google.com/detail/nexus-alert/[EXTENSION_ID]?utm_source=reddit&utm_campaign=nexus_launch&utm_content=r_nexus_launch
```

**Target:** 75 installs

---

#### 9:10 AM — r/GlobalEntry (8K members)

**Title:**
```
Automated Global Entry appointment monitoring → booked 8 weeks earlier than my original slot
```

**Body:** Copy from `marketing/community-seeding/REDDIT_POSTS_READY_TO_USE.md` lines 67-101

**UTM Link:**
```
https://chromewebstore.google.com/detail/nexus-alert/[EXTENSION_ID]?utm_source=reddit&utm_campaign=nexus_launch&utm_content=r_globalentry_launch
```

**Target:** 150 installs

---

#### 9:20 AM — r/PersonalFinanceCanada (900K members)

**Title:**
```
Free Chrome extension that monitors NEXUS appointments saved me 8 weeks and $0 - worth it for frequent US travelers
```

**Body:** Copy from `marketing/community-seeding/REDDIT_POSTS_READY_TO_USE.md` lines 119-162

**UTM Link:**
```
https://chromewebstore.google.com/detail/nexus-alert/[EXTENSION_ID]?utm_source=reddit&utm_campaign=nexus_launch&utm_content=r_pfc_launch
```

**Target:** 300 installs

---

### Reddit Engagement Rules (First 2 Hours CRITICAL)

**9:00 AM - 11:00 AM PT:**
- ✅ Respond to EVERY comment within 15 minutes
- ✅ First 2 hours determine Reddit algorithm ranking
- ✅ Fast engagement = higher visibility = more upvotes = more installs

**Response Templates:**
See `marketing/community-seeding/REDDIT_POSTS_READY_TO_USE.md` lines 346-452

---

## Hourly Monitoring (All Day)

### Metrics to Track

**Product Hunt:**
- Upvotes (hourly)
- Ranking position
- Comments
- Response rate

**Chrome Web Store:**
- Installs (real-time)
- Weekly active users
- Ratings and reviews

**Stripe:**
- Premium signups
- PRODUCTHUNT promo code redemptions
- MRR growth

**Landing Page (Google Analytics):**
- Traffic sources
- UTM campaign performance
- Conversion rate (visit → install)

---

## Success Metrics (Day 1)

### Targets

| Metric | Minimum | Target | Stretch |
|--------|---------|--------|---------|
| Chrome Installs | 200+ | 500+ | 1,000+ |
| Premium Signups | 20+ | 50+ | 100+ |
| Product Hunt Upvotes | 200+ | 500+ | 1,000+ |
| Product Hunt Ranking | Top 10 | #3-5 | #1 |
| Reddit Combined Upvotes | 100+ | 300+ | 500+ |
| Email Open Rate | 30%+ | 40%+ | 50%+ |
| PRODUCTHUNT Code Uses | 50+ | 100+ | 200 (max) |

---

## Emergency Protocols

### Promo Code Not Working
1. Check Stripe dashboard → Coupons
2. Verify code is active, not expired
3. Post apology on Product Hunt
4. Manually issue credits
5. Fix within 30 minutes

### Extension Crashes
1. Check Chrome Web Store developer console
2. Read user error reports
3. Push hotfix if critical
4. Communicate transparently

### Website Down
1. Check Vercel deployment status
2. Roll back if needed
3. Post update on Product Hunt
4. Fix within 1 hour

---

## Critical Files Reference

**Marketing Materials:**
- Product Hunt tagline: `marketing/product-hunt/PH_TAGLINE.txt`
- Founder comment: `marketing/product-hunt/PH_FOUNDER_COMMENT.md`
- Reddit posts: `marketing/community-seeding/REDDIT_POSTS_READY_TO_USE.md`
- Email template: `LAUNCH_DAY_EXECUTION_STATUS.md` (lines 309-362)

**Visual Assets:**
- Gallery images: `store-assets/ph-gallery-*.png`
- Thumbnail: `store-assets/ph-thumbnail.png`
- Screenshots: `store-assets/[1-5]-*.png`

**Execution Guides:**
- Master index: `store-assets/PH_LAUNCH_MASTER_INDEX.md`
- Hour-by-hour script: `store-assets/PH_LAUNCH_DAY_SCRIPT.md`
- Comment responses: `store-assets/PH_COMMENT_RESPONSE_LIBRARY.md`

---

## Post-Launch Actions (Day 2)

1. Send "Thank You" email to all supporters
2. Post results on Twitter/LinkedIn
3. Screenshot final ranking for portfolio
4. Collect testimonials from new users
5. Write retrospective blog post

---

## Final Checklist Before Launch

- [ ] Chrome Web Store status = APPROVED ✅
- [ ] Extension ID copied and saved
- [ ] Stripe promo code PRODUCTHUNT created and tested
- [ ] Landing pages updated with Extension ID
- [ ] ConvertKit email scheduled for 8:00 AM PT
- [ ] Reddit posts saved as drafts with correct Extension ID
- [ ] Product Hunt submission drafted with all assets
- [ ] Founder comment ready to copy-paste
- [ ] Calendar blocked: Tuesday 12:01 AM - 10:00 PM
- [ ] Metrics dashboard set up
- [ ] All links tested and working

---

**Status:** Ready for execution once Chrome Web Store status = APPROVED
**Owner:** Michael Guo
**Last Updated:** March 18, 2026

**Good luck! 🚀**
