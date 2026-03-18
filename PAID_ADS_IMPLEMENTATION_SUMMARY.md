# Paid Ads Pilot - Implementation Summary

## ✅ Completed Features

### 1. Landing Pages Created
- **`/nexus`** - Program-specific landing page for NEXUS appointments
  - Optimized for keyword: "nexus appointment finder"
  - UTM tracking: `?utm_source=nexus-page`
  - Conversion tracking for install clicks
  - File: `/web/src/app/nexus/page.tsx`
  - Metadata: `/web/src/app/nexus/metadata.ts`

- **`/global-entry`** - Already exists, reviewed and verified
- **`/sentri`** - Already exists, reviewed and verified

### 2. Tracking Infrastructure

#### Facebook Pixel Integration
- ✅ Added Facebook Pixel base code to `layout.tsx`
- ✅ Auto-fires `PageView` on all page loads
- ✅ Fires `Lead` event on install button clicks
- ✅ Fires `CompleteRegistration` on email captures
- ✅ Environment variable setup: `NEXT_PUBLIC_FB_PIXEL_ID`

**Location**: `/web/src/app/layout.tsx` (lines 43-65)

#### Google Ads Conversion Tracking
- ✅ Added Google Ads gtag.js script to `layout.tsx`
- ✅ Auto-loads on all pages with conversion tracking
- ✅ Environment variable setup: `NEXT_PUBLIC_GOOGLE_ADS_ID`
- ✅ Conversion events ready for install clicks, email captures, premium signups

**Location**: `/web/src/app/layout.tsx` (lines 67-82)

#### Analytics Utility Library
- ✅ Centralized tracking functions for all conversion events
- ✅ UTM parameter capture and storage in localStorage
- ✅ First-touch attribution persistence across sessions
- ✅ Combined tracking (fires both Google Ads + Facebook Pixel)
- ✅ Debug mode for testing: `?debug_tracking=1`

**Location**: `/web/src/app/utils/analytics.ts`

**Key Functions**:
```typescript
- trackConversion(event, source, options)
- trackEmailCapture(email, source, referrer)
- trackPremiumSignup(userId, plan, revenue, source)
- storeUTMParams()
- getStoredUTMParams()
```

#### Page Tracking Integration
- ✅ Auto-tracks all page views with UTM parameters
- ✅ Stores UTM params for attribution
- ✅ Integrates with PageWrapper component

**Location**: `/web/src/app/page-wrapper.tsx`

#### Email Form Tracking
- ✅ Updated EmailCaptureForm to use centralized analytics
- ✅ Fires conversion events on successful submission
- ✅ Includes source page attribution

**Location**: `/web/src/app/components/EmailCaptureForm.tsx`

### 3. Environment Configuration

#### Updated `.env.example` and `.env.local`
```bash
# Facebook Pixel ID for retargeting ads
NEXT_PUBLIC_FB_PIXEL_ID=your-fb-pixel-id-here

# Google Ads Conversion ID
NEXT_PUBLIC_GOOGLE_ADS_ID=your-google-ads-id-here
```

**Files**:
- `/web/.env.example` - Template with all required variables
- `/web/.env.local` - Local environment (not committed to git)

### 4. Campaign Documentation

#### PAID_ADS_CAMPAIGN.md
**Comprehensive $500 test budget campaign plan**:
- Budget allocation: $350 Google Ads, $150 Facebook Retargeting
- Keyword strategy with bid amounts
- Ad copy templates (3 programs × 3 variations)
- Landing page mapping
- Success metrics (CAC < $5, ROAS > 3x)
- 30-day testing timeline
- Scaling decision matrix

**Location**: `/PAID_ADS_CAMPAIGN.md`

#### AD_CREATIVE_SPECS.md
**Complete creative asset specifications**:
- Google Search Ads copy bank (9 variations)
- Facebook/Instagram ad templates (carousel, single image, video)
- Image specifications for all placements
- Ad writing guidelines and brand voice
- A/B testing strategy
- Legal compliance checklist

**Location**: `/AD_CREATIVE_SPECS.md`

#### CAMPAIGN_TRACKING.md
**Technical implementation guide**:
- Step-by-step Google Ads conversion setup
- Step-by-step Facebook Pixel setup
- UTM parameter standards for all campaigns
- Metrics dashboard setup
- Troubleshooting guide
- Weekly reporting template
- Testing checklist

**Location**: `/CAMPAIGN_TRACKING.md`

---

## 📊 Campaign Structure

### Google Search Ads ($350/30 days = $11.67/day)

| Keyword | Bid | Match Type | Landing Page |
|---------|-----|------------|--------------|
| nexus appointment finder | $0.50 | Phrase | /nexus |
| global entry appointment alert | $0.80 | Phrase | /global-entry |
| sentri appointment checker | $0.40 | Phrase | /sentri |

**Ad Copy Example (NEXUS)**:
```
Headline: Find NEXUS Slots Instantly | Free Chrome Extension | 500+ Users
Description: Get notified the instant a NEXUS appointment opens. Monitors 24/7 so you don't have to refresh manually. Install free.
URL: nexus-alert.com/nexus?utm_source=google&utm_medium=cpc&utm_campaign=nexus_search
```

### Facebook Retargeting ($150/30 days = $5/day)

**Audiences**:
1. **Custom Audience**: Website visitors (30 days) who didn't click install
2. **Email List**: Uploaded customer list
3. **Lookalike**: 1% lookalike from email list

**Creative Formats**:
1. Carousel Ad: 3-card testimonial carousel
2. Single Image: Product screenshot with value prop
3. Video: 15-second demo showing problem → solution

---

## 🎯 Key Metrics & Targets

### Success Criteria (30-Day Test)
- ✅ CAC < $5 per install click
- ✅ CTR > 3% on Google Ads
- ✅ Conversion rate > 10% (landing page → install)
- ✅ Email capture rate > 5%
- ✅ Total installs > 70 (from $500 at $5 CAC)

### Scaling Decision
| CAC | ROAS (90 days) | Decision |
|-----|----------------|----------|
| $3-5 | 3x+ | Scale to $2K/month |
| $5-7 | 2-3x | Continue testing |
| $8+ | <2x | Pause & pivot to organic |

---

## 🚀 Deployment Status

### ✅ Completed
- [x] Created /nexus landing page with conversion tracking
- [x] Added Facebook Pixel to layout.tsx
- [x] Added Google Ads conversion tracking to layout.tsx
- [x] Created analytics utility library
- [x] Integrated UTM tracking in PageWrapper
- [x] Updated email form with conversion tracking
- [x] Updated environment variable templates
- [x] Created comprehensive campaign documentation
- [x] Pushed all code to GitHub (commit: 4ea96ce)

### ⏸️ Deployment Blocked (Vercel Limit)
- [ ] Deploy to production (blocked by Vercel free tier limit: 100 deployments/day)
- **Error**: "Resource is limited - try again in 24 hours"
- **Resolution**: Deployment will auto-trigger on next git push, or manually deploy after limit resets

### ⏳ Pending (Requires Manual Setup)
- [ ] Create Google Ads account
- [ ] Set up Google Ads conversion actions (3 conversions: install, email, premium)
- [ ] Get Google Ads conversion ID and labels
- [ ] Update `NEXT_PUBLIC_GOOGLE_ADS_ID` in Vercel environment variables
- [ ] Update conversion labels in `/web/src/app/utils/analytics.ts`
- [ ] Create Facebook Business Manager account
- [ ] Create Facebook Pixel
- [ ] Get Facebook Pixel ID
- [ ] Update `NEXT_PUBLIC_FB_PIXEL_ID` in Vercel environment variables
- [ ] Verify tracking with Facebook Pixel Helper extension
- [ ] Create Facebook custom audiences (website visitors, email list)
- [ ] Launch Google Search campaigns (3 ad groups)
- [ ] Launch Facebook Retargeting campaigns (3 ad sets)

---

## 📋 Next Steps (Week 1)

### 1. Google Ads Setup (2 hours)
1. Create Google Ads account at ads.google.com
2. Set up billing
3. Create 3 conversion actions:
   - Chrome Extension Install Click (Lead, $5 value)
   - Email Capture (Lead, $3 value)
   - Premium Signup (Purchase, transaction value)
4. Copy conversion ID (format: `AW-XXXXXXXXXX`)
5. Copy conversion labels for each action
6. Update `analytics.ts` with actual labels (line 28-34)
7. Add `NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX` to Vercel env vars

### 2. Facebook Pixel Setup (1 hour)
1. Go to business.facebook.com/events_manager
2. Create new pixel: "NEXUS Alert Retargeting Pixel"
3. Copy Pixel ID (15-16 digits)
4. Add `NEXT_PUBLIC_FB_PIXEL_ID=YOUR_ID` to Vercel env vars
5. Deploy to production (after Vercel limit resets)
6. Verify with Facebook Pixel Helper Chrome extension
7. Create custom audience: "Website Visitors - No Install"

### 3. Launch Campaigns (Week 1-2)
1. **Google Ads** (Day 1):
   - Create 3 campaigns (NEXUS, Global Entry, SENTRI)
   - Add keywords from PAID_ADS_CAMPAIGN.md
   - Write ad copy using templates from AD_CREATIVE_SPECS.md
   - Set daily budget: $11.67
   - Enable conversion tracking
   - Launch

2. **Facebook Ads** (Day 3-5):
   - Create carousel ad with 3 testimonial cards
   - Create single image ad with extension screenshot
   - Target custom audience: "Website Visitors - No Install"
   - Set daily budget: $5
   - Launch

### 4. Monitor & Optimize (Week 2-4)
- Check Google Ads daily for CTR, CPC, conversions
- Check Facebook Ads daily for CTR, CPM, conversions
- Pause keywords with CTR <1.5%
- Increase bids on winners (CTR >5%, CAC <$4)
- A/B test ad copy variations
- Calculate weekly CAC and conversion rate

---

## 🔧 Technical Details

### URL Structure
All paid ads use UTM parameters for tracking:

```
Google Ads NEXUS:
https://nexus-alert.com/nexus?utm_source=google&utm_medium=cpc&utm_campaign=nexus_search&utm_term={keyword}&utm_content={creative}

Facebook Retargeting:
https://nexus-alert.com?utm_source=facebook&utm_medium=cpc&utm_campaign=retargeting_carousel&utm_content={{ad.name}}
```

### Conversion Events

| Event | Google Ads | Facebook Pixel | Trigger |
|-------|------------|----------------|---------|
| Install Click | `conversion` | `Lead` | Click "Install Free" button |
| Email Capture | `conversion` | `CompleteRegistration` | Submit email form |
| Premium Signup | `conversion` | `Purchase` | Stripe checkout completion |
| Page View | `page_view` | `PageView` | Auto on all pages |

### Attribution Flow
```
User clicks ad
  ↓
Lands on page with UTM params
  ↓
UTM stored in localStorage (nexus_alert_utm)
  ↓
User converts (install click / email / purchase)
  ↓
Conversion fires with:
  - Google Ads conversion tag
  - Facebook Pixel event
  - Original UTM source from localStorage
```

---

## 📁 File Manifest

### New Files Created
```
web/
  src/app/
    nexus/
      page.tsx          ← NEXUS landing page
      metadata.ts       ← SEO metadata
    utils/
      analytics.ts      ← Centralized tracking utility

  .env.example          ← Updated with tracking IDs

docs/
  PAID_ADS_CAMPAIGN.md      ← Campaign strategy & budget
  AD_CREATIVE_SPECS.md      ← Creative templates
  CAMPAIGN_TRACKING.md      ← Technical setup guide
```

### Modified Files
```
web/
  src/app/
    layout.tsx                    ← Added Facebook Pixel + Google Ads tags
    page-wrapper.tsx              ← Added UTM tracking
    components/
      EmailCaptureForm.tsx        ← Integrated analytics utility

  .env.local                      ← Added NEXT_PUBLIC_FB_PIXEL_ID, NEXT_PUBLIC_GOOGLE_ADS_ID
```

---

## 💰 Budget Breakdown

| Item | Amount | % of Total |
|------|--------|------------|
| **Google Search Ads** | $350 | 70% |
| - NEXUS keywords | $120 | 24% |
| - Global Entry keywords | $150 | 30% |
| - SENTRI keywords | $80 | 16% |
| **Facebook Retargeting** | $150 | 30% |
| - Carousel ads | $75 | 15% |
| - Single image ads | $50 | 10% |
| - Video ads | $25 | 5% |
| **Total** | $500 | 100% |

**Duration**: 30 days
**Daily Spend**: ~$16.67
**Target Conversions**: 70-100 install clicks (at $5-7 CAC)

---

## ✨ Key Features Built

### 1. Conversion Tracking
- ✅ Google Ads conversion tracking (install, email, purchase)
- ✅ Facebook Pixel events (PageView, Lead, CompleteRegistration, Purchase)
- ✅ UTM parameter capture and persistence
- ✅ First-touch attribution across sessions

### 2. Analytics Utility
- ✅ Single function call for all tracking: `trackConversion(event, source)`
- ✅ Auto-attribution with stored UTM params
- ✅ Debug mode for testing: `?debug_tracking=1`
- ✅ Type-safe event definitions

### 3. Landing Pages
- ✅ Program-specific pages optimized for keywords
- ✅ Conversion tracking on all CTA buttons
- ✅ UTM-tagged install links
- ✅ SEO-optimized metadata

### 4. Documentation
- ✅ Step-by-step setup guides
- ✅ Ad copy templates (18+ variations)
- ✅ Creative specifications
- ✅ Troubleshooting guides
- ✅ Weekly reporting templates

---

## 🎯 Campaign Goals Recap

**Primary Goal**: Test paid acquisition at $500 budget
**Target CAC**: $3-5 per install click
**Target ROAS**: 3x within 90 days
**Success Metric**: If CAC < $5, scale to $2K/month

**Channels**:
1. Google Search Ads (70% of budget) - Intent-based targeting
2. Facebook Retargeting (30% of budget) - Warm audience nurturing

**Timeline**:
- Week 1: Setup & launch
- Week 2-3: Monitor & optimize
- Week 4: Analyze & decide on scaling

---

## 🚨 Important Notes

1. **Vercel Deployment**: Currently blocked by free tier limit (100 deploys/day). Will auto-deploy on next push or manual deploy after 24 hours.

2. **Environment Variables**: Must update production environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_FB_PIXEL_ID`
   - `NEXT_PUBLIC_GOOGLE_ADS_ID`

3. **Conversion Labels**: After creating Google Ads conversions, update actual labels in `/web/src/app/utils/analytics.ts` (currently placeholder: `AW-CONVERSION_ID/LABEL`)

4. **Testing**: Use `?debug_tracking=1` URL parameter to see all tracking events in browser console

5. **Privacy**: No GDPR cookie consent required for US/Canada campaigns. If expanding to EU, add cookie consent banner.

---

## 📞 Support Resources

**Documentation**:
- [PAID_ADS_CAMPAIGN.md](/PAID_ADS_CAMPAIGN.md) - Campaign strategy
- [AD_CREATIVE_SPECS.md](/AD_CREATIVE_SPECS.md) - Creative templates
- [CAMPAIGN_TRACKING.md](/CAMPAIGN_TRACKING.md) - Technical setup

**External Resources**:
- [Google Ads Conversion Tracking](https://support.google.com/google-ads/answer/1722022)
- [Facebook Pixel Setup](https://www.facebook.com/business/help/952192354843755)
- [Facebook Pixel Helper Extension](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
- [Google Tag Assistant](https://tagassistant.google.com/)

---

## ✅ Final Checklist

**Code (Completed)**:
- [x] /nexus landing page created
- [x] Facebook Pixel integrated
- [x] Google Ads tracking integrated
- [x] Analytics utility built
- [x] UTM tracking implemented
- [x] Email form tracking updated
- [x] Environment variables documented
- [x] All code pushed to GitHub

**Setup (Pending)**:
- [ ] Create Google Ads account
- [ ] Set up conversions in Google Ads
- [ ] Get conversion IDs/labels
- [ ] Create Facebook Pixel
- [ ] Get Pixel ID
- [ ] Update Vercel env vars
- [ ] Deploy to production
- [ ] Verify tracking works

**Launch (Week 1-2)**:
- [ ] Launch Google Search campaigns
- [ ] Launch Facebook Retargeting
- [ ] Monitor daily metrics
- [ ] Optimize based on performance

---

**Status**: ✅ **READY FOR LAUNCH** (pending Vercel deployment + env var setup)

All code and infrastructure is complete. Once environment variables are configured and tracking IDs are added, campaigns can launch immediately.
