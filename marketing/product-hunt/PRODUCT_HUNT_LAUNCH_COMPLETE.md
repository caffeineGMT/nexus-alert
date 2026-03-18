# Product Hunt Launch — Complete Execution System

**Status:** ✅ Ready for Launch
**Launch Date:** Tuesday, 12:01 AM PT
**Goal:** Top 5 in Productivity Category, 500+ Upvotes, 500+ Chrome Installs

---

## 🎯 Launch Strategy Overview

### Pre-Launch (24 Hours Before)

1. **Build Hunter List** (20 supporters)
   - Meta coworkers (InfraX team, bootcamp cohort)
   - Personal friends (Harvard, UT Austin, LA startup)
   - Immigration communities (FlyerTalk, Reddit power users)
   - NEXUS beta users

2. **Teaser Tweets** (5 tweets on Monday)
   - 9:00 AM: Morning announcement
   - 12:00 PM: Founder story thread
   - 3:00 PM: Social proof + early access
   - 6:00 PM: Product demo video
   - 9:00 PM: Final countdown (3 hours before launch)

3. **Chrome Web Store Verification**
   - Status must be APPROVED before launch
   - Copy Extension ID (32 characters)
   - Update all marketing materials with ID

### Launch Day (Tuesday)

**12:01 AM PT — Product Hunt**
- Submit to Product Hunt
- Post founder comment within 1 minute
- Tweet launch announcement
- Set hourly engagement alarms

**8:00 AM PT — Email Blast**
- ConvertKit broadcast to waitlist
- Include Chrome Web Store link
- Include Product Hunt link
- Promo code: PRODUCTHUNT

**9:00 AM PT — Reddit Launch**
- 9:00 AM: r/Nexus (12K members)
- 9:10 AM: r/GlobalEntry (8K members)
- 9:20 AM: r/PersonalFinanceCanada (900K members)
- **CRITICAL:** Reply to EVERY comment within 15 min (first 2 hours)

---

## 📁 Launch Automation Scripts

All scripts are located in `marketing/product-hunt/launch-automation/` and are executable.

### 1. Pre-Launch Checklist
```bash
./marketing/product-hunt/launch-automation/pre-launch-checklist.sh
```

**What it does:**
- Verifies Chrome Web Store status = APPROVED
- Collects Extension ID
- Creates Stripe promo code PRODUCTHUNT
- Updates landing pages with Extension ID
- Verifies Product Hunt assets (gallery images, thumbnail)
- Launches hunter list builder
- Launches tweet scheduler
- Prepares ConvertKit email
- Reviews Reddit posts
- Tests all URLs

**Output:** `marketing/product-hunt/launch-config.env`

---

### 2. Hunter List Builder
```bash
./marketing/product-hunt/launch-automation/hunter-list-builder.sh
```

**What it does:**
- Interactive hunter addition (20 supporters)
- Generates email template for launch support
- Creates hunter list CSV
- Generates reminder email script

**Output:**
- `marketing/product-hunt/hunter-list.csv`
- `marketing/product-hunt/hunter-email-template.txt`
- `marketing/product-hunt/launch-automation/send-hunter-reminders.sh`

**Email Template:**
```
Subject: Quick favor - upvote my Product Hunt launch Tuesday?

Hey [Name],

I'm launching my side project NEXUS Alert on Product Hunt this Tuesday at 12:01 AM PT, and I'd love your support!

**What is it?**
Chrome extension that monitors NEXUS/Global Entry appointment slots 24/7 and sends instant alerts when cancellations appear.

**The ask:**
Could you upvote it on Product Hunt? Takes 30 seconds.

**When:** Tuesday, March 25, 12:01 AM PT

Thanks!
Michael
```

---

### 3. Tweet Scheduler
```bash
./marketing/product-hunt/launch-automation/tweet-scheduler.sh
```

**What it does:**
- Generates 5 teaser tweets for Monday
- Generates launch tweet for Tuesday 12:01 AM
- Creates media checklist (screenshots, GIFs, videos)
- Creates analytics tracking template

**Output:**
- `marketing/product-hunt/teaser-tweets.md` (tweet content)
- `marketing/product-hunt/tweet-media-checklist.md` (required media)
- `marketing/product-hunt/tweet-analytics.csv` (metrics tracking)

**Tweet Schedule:**
1. **9:00 AM** — Morning announcement
2. **12:00 PM** — Founder story thread
3. **3:00 PM** — Social proof + early access
4. **6:00 PM** — Product demo
5. **9:00 PM** — Final countdown
6. **12:01 AM** — Launch tweet

---

### 4. Launch Day Script
```bash
./marketing/product-hunt/launch-automation/launch-day-script.sh
```

**What it does:**
- Loads launch configuration
- Opens Product Hunt submission page
- Displays submission details (name, tagline, description, images)
- Prompts for founder comment posting
- Generates launch tweet
- Sets hourly engagement reminders
- Opens monitoring dashboard tabs
- Creates metrics tracking file

**Output:**
- `marketing/product-hunt/launch-metrics.csv` (hourly metrics)

**Monitoring Dashboard:**
- Product Hunt: [PH_URL]
- Chrome Web Store: [Extension Console]
- Google Analytics
- Stripe Dashboard
- Twitter Analytics
- Reddit (3 subreddits)

---

## 💳 Stripe Promo Code

### Create PRODUCTHUNT Promo Code
```bash
./backend/scripts/create-stripe-promo-code.sh
```

**Configuration:**
- Code: `PRODUCTHUNT`
- Discount: 100% off first month
- Duration: Repeating (1 month)
- Max Redemptions: 200
- Expiration: 7 days from launch

**Requirements:**
- Stripe CLI installed: `brew install stripe/stripe-cli/stripe`
- Logged in: `stripe login`

**Manual Creation (if CLI fails):**
1. Go to https://dashboard.stripe.com/coupons
2. Click "Create coupon"
3. Settings:
   - Name: Product Hunt Launch Special
   - Code: PRODUCTHUNT
   - Type: Percentage discount (100%)
   - Duration: Repeating
   - Duration in months: 1
   - Max redemptions: 200
   - Expiration: 7 days from launch
4. Click "Create coupon"

---

## 🖼️ Product Hunt Assets

### Gallery Images & Thumbnail

All images created and verified:
- ✅ `ph-gallery-01.png` (1270×760) — Main interface
- ✅ `ph-gallery-02.png` (1270×760) — Notification alert
- ✅ `ph-gallery-03.png` (1270×760) — Premium features
- ✅ `ph-thumbnail.png` (240×240) — Square thumbnail

**Preview:** `open store-assets/ph-preview.html`

**Regenerate if needed:**
```bash
./marketing/product-hunt/create-ph-images.sh
```

---

## 📧 Email Template (ConvertKit)

### Waitlist Launch Email

**Platform:** https://app.convertkit.com/broadcasts
**Schedule:** Tuesday 8:00 AM PT
**Segment:** All waitlist subscribers

**Subject:** 🚀 NEXUS Alert is live - Never miss an appointment slot again
**Preview:** Install free in 30 seconds. Start monitoring today.

**Body:**
```
Hey [First Name],

You signed up to be notified when NEXUS Alert launched.

**It's live now.**

👉 Install the extension: [Chrome Web Store Link]

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

👉 Install now: [Chrome Web Store Link]

Questions? Reply to this email.

Thanks for your support,
Michael
NEXUS Alert Team

---

P.S. We're launching on Product Hunt today! If you find NEXUS Alert helpful, we'd love your upvote: [Product Hunt Link]
```

---

## 📱 Reddit Launch Posts

All Reddit posts are ready in: `marketing/community-seeding/REDDIT_POSTS_READY_TO_USE.md`

### Post Schedule

**9:00 AM PT** — r/Nexus (12K members)
- **Title:** I was stuck checking ttp.cbp.dhs.gov for 8 weeks. Built a Chrome extension that checks every 30min. Got my appointment in 3 days.
- **UTM:** ?utm_source=reddit&utm_campaign=nexus_launch&utm_content=r_nexus
- **Target:** 75 installs

**9:10 AM PT** — r/GlobalEntry (8K members)
- **Title:** Automated Global Entry appointment monitoring → booked 8 weeks earlier than my original slot
- **UTM:** ?utm_source=reddit&utm_campaign=nexus_launch&utm_content=r_globalentry
- **Target:** 150 installs

**9:20 AM PT** — r/PersonalFinanceCanada (900K members)
- **Title:** Free Chrome extension that monitors NEXUS appointments saved me 8 weeks and $0 - worth it for frequent US travelers
- **UTM:** ?utm_source=reddit&utm_campaign=nexus_launch&utm_content=r_pfc
- **Target:** 300 installs

### Engagement Rules (CRITICAL)

**9:00 AM - 11:00 AM PT:**
- ✅ Respond to EVERY comment within 15 minutes
- ✅ First 2 hours determine Reddit algorithm ranking
- ✅ Fast engagement = higher visibility = more upvotes = more installs

**Response Templates:** See `marketing/community-seeding/REDDIT_POSTS_READY_TO_USE.md` lines 346-452

---

## 📊 Success Metrics (Day 1)

| Metric | Minimum | Target | Stretch |
|--------|---------|--------|---------|
| Chrome Installs | 200+ | 500+ | 1,000+ |
| Premium Signups | 20+ | 50+ | 100+ |
| Product Hunt Upvotes | 200+ | 500+ | 1,000+ |
| Product Hunt Ranking | Top 10 | #3-5 | #1 |
| Reddit Combined Upvotes | 100+ | 300+ | 500+ |
| Email Open Rate | 30%+ | 40%+ | 50%+ |
| PRODUCTHUNT Code Uses | 50+ | 100+ | 200 (max) |

### Hourly Tracking

Track metrics in `marketing/product-hunt/launch-metrics.csv`:
- 12:00 AM (launch)
- Every hour until 11:59 PM

---

## 🚨 Emergency Protocols

### Promo Code Not Working
1. Check Stripe Dashboard → Coupons
2. Verify code is active, not expired
3. Post apology on Product Hunt
4. Manually issue credits to affected users
5. Fix within 30 minutes

### Extension Crashes
1. Check Chrome Web Store Developer Console
2. Read user error reports
3. Push hotfix if critical
4. Communicate transparently on PH

### Website Down
1. Check Vercel deployment status
2. Roll back if needed
3. Post update on Product Hunt
4. Fix within 1 hour

---

## ✅ Final Pre-Launch Checklist

Run `./marketing/product-hunt/launch-automation/pre-launch-checklist.sh` or verify manually:

- [ ] Chrome Web Store status = APPROVED ✅
- [ ] Extension ID copied and saved
- [ ] Stripe promo code PRODUCTHUNT created and tested
- [ ] Landing pages updated with Extension ID
- [ ] ConvertKit email scheduled for 8:00 AM PT
- [ ] Reddit posts saved as drafts with correct Extension ID
- [ ] Product Hunt submission drafted with all assets
- [ ] Founder comment ready to copy-paste
- [ ] Hunter list complete (20 supporters)
- [ ] Teaser tweets scheduled (5 tweets Monday)
- [ ] Calendar blocked: Tuesday 12:01 AM - 10:00 PM
- [ ] Metrics dashboard set up
- [ ] All links tested and working
- [ ] Phone fully charged 🔋
- [ ] Notifications ON 🔔

---

## 📂 File Structure

```
marketing/product-hunt/
├── launch-automation/
│   ├── pre-launch-checklist.sh          # Main pre-launch workflow
│   ├── hunter-list-builder.sh           # Build 20-person support list
│   ├── tweet-scheduler.sh               # Generate 5 teaser tweets
│   ├── launch-day-script.sh             # Launch day execution
│   └── send-hunter-reminders.sh         # (Generated by hunter-list-builder)
├── PH_FOUNDER_COMMENT.md                # Founder comment template
├── PH_LAUNCH_EXECUTION_GUIDE.md         # Original execution guide
├── PH_TAGLINE.txt                       # Product Hunt tagline
├── teaser-tweets.md                     # (Generated) Tweet content
├── tweet-media-checklist.md             # (Generated) Required media
├── tweet-analytics.csv                  # (Generated) Metrics tracking
├── hunter-list.csv                      # (Generated) 20 supporters
├── hunter-email-template.txt            # (Generated) Email template
├── launch-config.env                    # (Generated) Launch configuration
├── launch-metrics.csv                   # (Generated) Hourly metrics
└── PRODUCT_HUNT_LAUNCH_COMPLETE.md      # This file

store-assets/
├── ph-gallery-01.png                    # Gallery image 1 (1270×760)
├── ph-gallery-02.png                    # Gallery image 2 (1270×760)
├── ph-gallery-03.png                    # Gallery image 3 (1270×760)
├── ph-thumbnail.png                     # Thumbnail (240×240)
└── ph-preview.html                      # Image preview page

backend/scripts/
└── create-stripe-promo-code.sh          # Stripe promo code creation

marketing/community-seeding/
└── REDDIT_POSTS_READY_TO_USE.md         # Reddit posts with UTM links
```

---

## 🚀 Launch Execution Flow

### Pre-Launch (24 Hours Before)
```bash
# Run complete pre-launch checklist
./marketing/product-hunt/launch-automation/pre-launch-checklist.sh
```

This will:
1. ✅ Verify Chrome Web Store status
2. ✅ Collect Extension ID
3. ✅ Create Stripe promo code
4. ✅ Update landing pages
5. ✅ Build hunter list
6. ✅ Schedule teaser tweets
7. ✅ Prepare ConvertKit email
8. ✅ Review Reddit posts
9. ✅ Verify all links

### Launch Day (Tuesday 12:01 AM PT)
```bash
# Run launch day script
./marketing/product-hunt/launch-automation/launch-day-script.sh
```

This will:
1. 🚀 Open Product Hunt submission page
2. 📝 Display submission details
3. 💬 Prompt for founder comment
4. 🐦 Generate launch tweet
5. ⏰ Set engagement reminders
6. 📊 Open monitoring dashboard
7. 📈 Create metrics tracking file

### Throughout Launch Day

**Engagement Rules:**
- Reply to EVERY Product Hunt comment within 10 minutes
- Reply to EVERY Reddit comment within 15 minutes (9-11 AM critical)
- Monitor metrics hourly
- Celebrate milestones on Twitter
- Stay positive and helpful

**Metrics to Track:**
- Product Hunt upvotes & ranking
- Chrome installs & active users
- Premium signups
- PRODUCTHUNT promo code uses
- Reddit upvotes & comments
- Email open rate & click-through
- Website traffic (UTM sources)

---

## 💡 Pro Tips

1. **Engagement is Everything**
   - First 8 hours determine Product Hunt ranking
   - Reply to comments FAST (within 10-15 minutes)
   - Be helpful, not salesy

2. **Reddit Algorithm**
   - First 2 hours are CRITICAL
   - Fast engagement = higher ranking
   - Upvotes + comments + engagement time all matter

3. **Hunter List**
   - 20 early upvotes can get you to front page
   - Ask supporters to upvote within first hour
   - Thank everyone personally

4. **Promo Code Strategy**
   - PRODUCTHUNT code = exclusive Product Hunt offer
   - Creates urgency (expires in 7 days)
   - Max 200 redemptions = scarcity

5. **Cross-Promotion**
   - Tweet → Product Hunt
   - Email → Product Hunt + Chrome Web Store
   - Reddit → Chrome Web Store
   - All channels reinforce each other

---

## 📞 Support & Questions

**Creator:** Michael Guo
**Email:** [your-email]@nexusalert.app
**Twitter:** [@your-handle]

**Emergency Contacts:**
- Stripe Support: https://support.stripe.com
- Chrome Web Store Support: https://support.google.com/chrome_webstore
- Vercel Support: https://vercel.com/help

---

## 🎉 Post-Launch (Day 2)

1. **Send Thank You Emails**
   - Thank all 20 hunters who supported
   - Thank top commenters on Product Hunt
   - Thank active Reddit community members

2. **Share Results**
   - Tweet final ranking & metrics
   - LinkedIn post with launch story
   - Reddit follow-up posts

3. **Collect Testimonials**
   - Ask early users for feedback
   - Screenshot positive comments
   - Use for future marketing

4. **Analyze Metrics**
   - Which channel drove most installs?
   - What was conversion rate by source?
   - Which messaging resonated most?

5. **Write Retrospective**
   - What worked?
   - What didn't?
   - Lessons for next launch

---

**Status:** ✅ Ready for Launch
**Last Updated:** March 18, 2026
**Owner:** Michael Guo

**Good luck! 🚀 You've got this!**
