# Paid Ads Pilot Campaign - $500 Test Budget

## Campaign Overview

**Objective**: Test paid acquisition channels with $500 budget over 30 days
**Target CAC**: $3-5 per install
**Target ROAS**: 3x within 90 days (LTV > $30 from 6 months premium retention)
**Channels**: Google Search Ads + Facebook Retargeting

---

## Google Search Ads Campaign

### Budget Allocation
- **Total Google Ads Budget**: $350 (70% of test budget)
- **Daily Budget**: ~$11.67/day
- **Campaign Duration**: 30 days

### Keyword Strategy

#### Keyword 1: "nexus appointment finder"
- **Bid**: $0.50 CPC
- **Match Type**: Phrase match
- **Expected Daily Clicks**: ~8-10
- **Landing Page**: https://nexus-alert.com/nexus

#### Keyword 2: "global entry appointment alert"
- **Bid**: $0.80 CPC
- **Match Type**: Phrase match
- **Expected Daily Clicks**: ~5-7
- **Landing Page**: https://nexus-alert.com/global-entry

#### Keyword 3: "sentri appointment checker"
- **Bid**: $0.40 CPC
- **Match Type**: Phrase match
- **Expected Daily Clicks**: ~10-12
- **Landing Page**: https://nexus-alert.com/sentri

#### Additional Recommended Keywords (Lower Priority)
- "nexus appointment slots" - $0.45 CPC
- "global entry appointment tool" - $0.70 CPC
- "how to find nexus appointments" - $0.30 CPC
- "nexus appointment notification" - $0.55 CPC
- "sentri appointment availability" - $0.35 CPC

### Ad Copy Templates

#### Ad Group 1: NEXUS Appointment Finder
```
Headline 1: Find NEXUS Slots Instantly
Headline 2: Free Chrome Extension
Headline 3: 500+ Users | Never Miss Slots

Description 1: Get notified the instant a NEXUS appointment opens. Monitors 24/7 so you don't have to refresh manually. Install free.
Description 2: Smart alerts, multi-location tracking, one-click booking. Works with NEXUS, Global Entry & SENTRI.

Display Path: nexus-alert.com/nexus
Final URL: https://nexus-alert.com/nexus?utm_source=google&utm_medium=cpc&utm_campaign=nexus_search
```

#### Ad Group 2: Global Entry Appointment Alert
```
Headline 1: Global Entry Slot Alerts
Headline 2: Never Miss Appointments
Headline 3: Free Chrome Extension

Description 1: Stop refreshing manually. Get instant alerts when Global Entry slots open at your preferred locations. 100% free to start.
Description 2: Real-time monitoring, sound alerts, email notifications. 500+ users already booking faster.

Display Path: nexus-alert.com/global-entry
Final URL: https://nexus-alert.com/global-entry?utm_source=google&utm_medium=cpc&utm_campaign=ge_search
```

#### Ad Group 3: SENTRI Appointment Checker
```
Headline 1: SENTRI Appointment Finder
Headline 2: Instant Slot Notifications
Headline 3: Book Weeks Sooner

Description 1: Automatic SENTRI appointment monitoring. Get alerted the second slots open at US-Mexico border locations.
Description 2: Free Chrome extension. Set preferences once, get notified automatically. 500+ active users.

Display Path: nexus-alert.com/sentri
Final URL: https://nexus-alert.com/sentri?utm_source=google&utm_medium=cpc&utm_campaign=sentri_search
```

### Google Ads Setup Checklist

- [ ] Create Google Ads account at ads.google.com
- [ ] Set up conversion tracking:
  - [ ] Add Conversion Action: "Chrome Extension Install Click"
  - [ ] Category: Lead
  - [ ] Value: $5 (estimated based on LTV)
  - [ ] Count: One per click
  - [ ] Install Google Ads conversion tag (already added to layout.tsx)
  - [ ] Copy conversion ID/label from Google Ads and update `.env.local`:
    ```
    NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX
    ```
  - [ ] Update conversion tracking code in `/nexus/page.tsx`, `/global-entry/page.tsx`, `/sentri/page.tsx`:
    - Replace `AW-CONVERSION_ID/CONVERSION_LABEL` with actual values
- [ ] Create 3 Ad Groups (one per program: NEXUS, Global Entry, SENTRI)
- [ ] Add keywords with phrase match to each ad group
- [ ] Write ad copy using templates above
- [ ] Set up ad extensions:
  - [ ] Sitelink Extension: "How It Works", "Pricing", "FAQ", "Install Free"
  - [ ] Callout Extension: "Free Chrome Extension", "500+ Users", "Instant Alerts"
  - [ ] Structured Snippet: Programs: NEXUS, Global Entry, SENTRI
- [ ] Enable auto-bidding: Target CPA = $5
- [ ] Set geographic targeting: USA, Canada
- [ ] Set ad schedule: All days, all hours (appointments open randomly)
- [ ] Link Google Analytics for deeper tracking

---

## Facebook Retargeting Campaign

### Budget Allocation
- **Total Facebook Budget**: $150 (30% of test budget)
- **Daily Budget**: $5/day
- **Campaign Duration**: 30 days

### Audience Strategy

#### Custom Audience 1: Website Visitors (Warm)
- **Source**: Facebook Pixel on nexus-alert.com
- **Criteria**: Visited landing page but didn't install (no click on Chrome Web Store button)
- **Retention**: 30 days
- **Expected Size**: 500-1,000 users over 30 days

#### Custom Audience 2: Email List (Hot)
- **Source**: Email capture form submissions
- **Upload Method**: Customer list upload to Facebook
- **Retention**: 180 days
- **Expected Size**: 100-200 users

#### Lookalike Audience (Scale)
- **Source**: Email list + Chrome extension installers
- **Size**: 1% lookalike (USA + Canada)
- **Purpose**: Expand reach after proving conversion

### Facebook Pixel Setup

1. **Create Facebook Pixel**:
   - Go to https://business.facebook.com/events_manager
   - Create new pixel: "NEXUS Alert Retargeting Pixel"
   - Copy Pixel ID

2. **Install Pixel** (already done in `layout.tsx`):
   - Update `.env.local`:
     ```
     NEXT_PUBLIC_FB_PIXEL_ID=YOUR_PIXEL_ID_HERE
     ```
   - Pixel will auto-fire on all pages

3. **Configure Events**:
   - `PageView` - Auto-tracked (already configured)
   - `Lead` - Fired on install button click (already added to page.tsx files)
   - `ViewContent` - Track landing page views
   - Custom Event: `EmailCapture` - Track email form submissions

### Ad Creative Templates

#### Carousel Ad: Testimonial Format
```
Format: Carousel (3 cards)

Card 1:
Image: User testimonial screenshot
Headline: "I got my NEXUS appointment in 3 days"
Description: Stop refreshing manually. Get instant alerts.
CTA: Learn More

Card 2:
Image: Chrome extension screenshot showing notification
Headline: "500+ users booking appointments faster"
Description: Free Chrome extension. Works 24/7 in background.
CTA: Learn More

Card 3:
Image: Happy user with passport at border
Headline: "Never miss a cancellation again"
Description: Real-time monitoring for NEXUS, Global Entry & SENTRI.
CTA: Install Free

Destination URL: https://nexus-alert.com?utm_source=facebook&utm_medium=cpc&utm_campaign=retargeting_carousel
```

#### Single Image Ad: Direct Response
```
Format: Single Image

Image: Chrome extension popup showing available slot notification
Headline: Missed your NEXUS appointment slot?
Description: Get instant alerts when slots open. Free Chrome extension used by 500+ people. Install now and book weeks sooner.
CTA: Download

Destination URL: https://nexus-alert.com?utm_source=facebook&utm_medium=cpc&utm_campaign=retargeting_single
```

#### Video Ad: Product Demo (15s)
```
Format: Video (15 seconds)

Script:
0-3s: Show user frustrated refreshing GOES website
4-7s: Show NEXUS Alert extension popup notification
8-12s: Show user clicking notification → booking page
13-15s: Show "Install Free - NEXUS Alert" CTA

Text Overlay: "Stop refreshing. Start booking. - Free Chrome Extension"
CTA: Learn More

Destination URL: https://nexus-alert.com?utm_source=facebook&utm_medium=video&utm_campaign=retargeting_demo
```

### Facebook Campaign Setup Checklist

- [ ] Create Facebook Business Manager account
- [ ] Set up Facebook Pixel (ID in `.env.local`)
- [ ] Verify pixel is firing with Facebook Pixel Helper Chrome extension
- [ ] Create Custom Audience: "Website Visitors - No Install"
  - Criteria: `PageView` AND NOT `Lead` in last 30 days
- [ ] Create Custom Audience: "Email List"
  - Upload CSV with emails from capture form
- [ ] Create Lookalike Audience (1%) from Email List
- [ ] Create Campaign: "NEXUS Alert - Retargeting Pilot"
  - Objective: Traffic (optimize for landing page views)
  - Budget: $5/day
  - Duration: 30 days
- [ ] Create Ad Set 1: Website Retargeting
  - Audience: "Website Visitors - No Install"
  - Placement: Facebook Feed, Instagram Feed
  - Age: 25-65
  - Interests: Travel, International Travel, Border Crossing
- [ ] Create Ad Set 2: Email List Nurture
  - Audience: "Email List"
  - Placement: Facebook Feed, Instagram Feed, Stories
- [ ] Upload ad creatives (carousel, single image, video)
- [ ] Set up conversion tracking for `Lead` event
- [ ] Enable automatic placements
- [ ] Enable Campaign Budget Optimization (CBO)

---

## Analytics & Tracking Setup

### UTM Parameter Standards

**Google Ads URLs**:
- NEXUS: `?utm_source=google&utm_medium=cpc&utm_campaign=nexus_search&utm_term={keyword}&utm_content={creative}`
- Global Entry: `?utm_source=google&utm_medium=cpc&utm_campaign=ge_search&utm_term={keyword}&utm_content={creative}`
- SENTRI: `?utm_source=google&utm_medium=cpc&utm_campaign=sentri_search&utm_term={keyword}&utm_content={creative}`

**Facebook Ads URLs**:
- Carousel: `?utm_source=facebook&utm_medium=cpc&utm_campaign=retargeting_carousel&utm_content={ad.name}`
- Single Image: `?utm_source=facebook&utm_medium=cpc&utm_campaign=retargeting_single&utm_content={ad.name}`
- Video: `?utm_source=facebook&utm_medium=video&utm_campaign=retargeting_demo&utm_content={ad.name}`

### Key Metrics to Track

#### Acquisition Metrics
- **Impressions**: Total ad views
- **Clicks**: Total clicks to landing page
- **CTR**: Click-through rate (clicks / impressions)
- **CPC**: Cost per click
- **Landing Page Views**: Unique users landing on site
- **Bounce Rate**: % who leave immediately

#### Conversion Metrics
- **Install Button Clicks**: Chrome Web Store clicks
- **Email Captures**: Form submissions
- **Conversion Rate**: Install clicks / landing page views
- **CAC**: Total spend / install clicks
- **Email Capture Rate**: Email submits / landing page views

#### Revenue Metrics (Track after 30-90 days)
- **Premium Signups**: Stripe checkout completions
- **MRR**: Monthly recurring revenue
- **LTV**: Customer lifetime value (avg 6 months = $29.94)
- **ROAS**: Revenue / ad spend
- **Payback Period**: Months to recover CAC

### Success Criteria (30-Day Test)

✅ **PASS** if:
- CAC < $5 per install click
- CTR > 3% on Google Ads
- Conversion rate > 10% (landing page → install click)
- Email capture rate > 5%
- Total installs > 70 (from $500 budget at $5 CAC)

❌ **FAIL** if:
- CAC > $8 per install click
- CTR < 1% on Google Ads
- Conversion rate < 5%
- Bounce rate > 70%

### Scaling Decision Matrix

| CAC | LTV | ROAS (90 days) | Decision |
|-----|-----|----------------|----------|
| $3 | $30 | 3x+ | Scale to $2K/month immediately |
| $5 | $30 | 2-3x | Scale to $1K/month, optimize ads |
| $7 | $30 | 1.5-2x | Continue testing, reduce bids |
| $8+ | $30 | <1.5x | Pause campaign, pivot strategy |

---

## Implementation Timeline

### Week 1: Setup
- [ ] Create Google Ads account
- [ ] Create Facebook Business Manager + Pixel
- [ ] Update `.env.local` with pixel IDs
- [ ] Deploy changes to Vercel
- [ ] Verify tracking with browser extensions
- [ ] Create ad copy and creatives

### Week 2: Launch
- [ ] Launch Google Search campaign
- [ ] Monitor performance daily
- [ ] Install Facebook Pixel on site
- [ ] Begin collecting retargeting audience

### Week 3: Optimize
- [ ] Launch Facebook Retargeting campaign
- [ ] Pause underperforming keywords
- [ ] Adjust bids based on CTR
- [ ] Test ad copy variations (A/B test headlines)

### Week 4: Analyze
- [ ] Calculate CAC, CTR, conversion rate
- [ ] Analyze which keywords/audiences performed best
- [ ] Calculate preliminary LTV (if premium signups started)
- [ ] Make scaling decision based on metrics

### Week 5+: Scale or Pivot
- If successful (CAC < $5, ROAS > 2x):
  - Increase budget to $2K/month
  - Expand keyword list
  - Create lookalike audiences on Facebook
  - Test Instagram Reels ads
- If unsuccessful (CAC > $8, ROAS < 1.5x):
  - Pause campaigns
  - Analyze what went wrong (low CTR? High bounce? Poor conversion?)
  - Pivot to organic channels (SEO, Product Hunt, Reddit)

---

## Creative Assets Needed

### For Google Ads
- [x] Landing pages: /nexus, /global-entry, /sentri (DONE)
- [ ] Sitelink landing pages: /pricing, /faq, /how-it-works
- [x] Logo for ad extensions
- [x] Ad copy variations (DONE)

### For Facebook Ads
- [ ] Testimonial screenshots (create 3-5 user testimonials)
- [ ] Chrome extension screenshot showing notification popup
- [ ] Stock photo: Happy user with passport at border crossing
- [ ] 15-second demo video showing:
  - Problem: Manual refreshing
  - Solution: NEXUS Alert notification
  - CTA: Install free
- [ ] Carousel images (1200x628px each):
  - Card 1: Testimonial quote on colored background
  - Card 2: Extension screenshot
  - Card 3: Happy user or "Install Free" CTA graphic

### Image Specs
- **Facebook Feed**: 1200x628px (1.91:1)
- **Instagram Feed**: 1080x1080px (1:1)
- **Facebook/Instagram Stories**: 1080x1920px (9:16)
- **Video**: 1080x1080px or 1920x1080px, 15-60 seconds, MP4

---

## Contact & Support

**Campaign Manager**: Michael Guo
**Ad Spend Alerts**: If daily spend exceeds $20 (2x target), pause campaigns
**Reporting Frequency**: Daily for first week, then weekly
**Dashboard**: Google Ads + Facebook Ads Manager + Plausible Analytics

---

## Next Steps

1. Set up Google Ads account and conversion tracking
2. Create Facebook Pixel and install on site
3. Update environment variables with tracking IDs
4. Create ad creatives (images, video, copy)
5. Launch campaigns with $500 test budget
6. Monitor performance daily for first week
7. Optimize based on metrics (pause low performers, boost winners)
8. Make scaling decision after 30 days based on CAC and conversion rate

**Target Go-Live Date**: Within 7 days of approval
