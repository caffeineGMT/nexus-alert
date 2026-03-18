# Campaign Tracking & Analytics Setup

## Overview

This document outlines the tracking infrastructure for the $500 paid ads pilot campaign, including conversion tracking, attribution, and ROI measurement.

---

## Tracking Stack

### Core Technologies
1. **Google Ads Conversion Tracking** - Tracks install clicks, email captures, premium signups
2. **Facebook Pixel** - Tracks page views, leads, purchases for retargeting
3. **UTM Parameters** - Source attribution for all campaigns
4. **LocalStorage** - First-touch attribution persistence
5. **Analytics Utility** - Centralized tracking functions (`/web/src/app/utils/analytics.ts`)

### Data Flow
```
User clicks ad → Lands on page (UTM captured) → Takes action (install/email/purchase) → Event fires → Google Ads + Facebook Pixel + localStorage
```

---

## Environment Variables Setup

### Required Variables

Add these to `/web/.env.local`:

```bash
# Facebook Pixel ID
# Get from: https://business.facebook.com/events_manager
NEXT_PUBLIC_FB_PIXEL_ID=123456789012345

# Google Ads Conversion ID
# Get from: Google Ads → Tools → Conversions → Set up conversion tracking
# Format: AW-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-1234567890
```

### Verification

After updating `.env.local`:
1. Restart Next.js dev server: `npm run dev`
2. Open browser console
3. Check for tracking script loads: `window.gtag` and `window.fbq` should be defined
4. Use Facebook Pixel Helper Chrome extension to verify pixel fires
5. Use Google Tag Assistant to verify Google Ads tag fires

---

## Google Ads Conversion Tracking Setup

### Step 1: Create Conversion Actions

Go to Google Ads → Tools & Settings → Measurement → Conversions → New Conversion Action

#### Conversion 1: Chrome Extension Install Click
```
Goal: Lead
Conversion Name: Chrome Extension Install Click
Category: Lead
Value: $5 (estimated LTV of free tier user)
Count: One (only count first click per user)
Click-through conversion window: 30 days
Engagement conversion window: 90 days
Attribution model: Last click
```

#### Conversion 2: Email Capture
```
Goal: Lead
Conversion Name: Email Capture Form Submit
Category: Lead
Value: $3
Count: One
Click-through conversion window: 30 days
Engagement conversion window: 90 days
Attribution model: Last click
```

#### Conversion 3: Premium Signup
```
Goal: Purchase
Conversion Name: Premium Subscription Signup
Category: Purchase
Value: Use transaction-specific value (will pass actual $4.99/mo)
Count: Every
Click-through conversion window: 30 days
Engagement conversion window: 90 days
Attribution model: Last click
```

### Step 2: Get Conversion IDs/Labels

After creating each conversion:
1. Click on the conversion name
2. Note the **Conversion ID** (format: `AW-XXXXXXXXXX`)
3. Note the **Conversion Label** (format: `AbCdEfGhIj1KlMnOpQr`)

### Step 3: Update Tracking Code

Edit `/web/src/app/utils/analytics.ts`:

```typescript
const conversionMap: Record<ConversionEvent, string> = {
  install_click: 'AW-XXXXXXXXXX/AbCdEfGhIj1KlMnOpQr', // Replace with actual
  email_capture: 'AW-XXXXXXXXXX/XyZaBcDeFg2HiJkLmNo', // Replace with actual
  premium_signup: 'AW-XXXXXXXXXX/PqRsTuVwXy3ZaBcDeFg', // Replace with actual
  page_view: 'AW-XXXXXXXXXX/PAGEVIEW_LABEL',
  pricing_view: 'AW-XXXXXXXXXX/PRICING_LABEL',
};
```

### Step 4: Test Conversions

1. Open landing page: `http://localhost:3000/nexus?utm_source=google&utm_medium=cpc&utm_campaign=test`
2. Click "Install Free" button
3. Check Google Ads → Tools → Conversions → See recent conversions
4. Should see test conversion appear within 3 hours

---

## Facebook Pixel Setup

### Step 1: Create Facebook Pixel

1. Go to https://business.facebook.com/events_manager
2. Click "Connect Data Sources" → "Web" → "Facebook Pixel"
3. Name: "NEXUS Alert Retargeting Pixel"
4. Enter website URL: `https://nexus-alert.com`
5. Click "Continue" → "Install Pixel Now"
6. Copy the Pixel ID (15-16 digit number)

### Step 2: Add Pixel ID to Environment

Update `/web/.env.local`:
```bash
NEXT_PUBLIC_FB_PIXEL_ID=123456789012345
```

Restart dev server.

### Step 3: Verify Pixel Installation

1. Install [Facebook Pixel Helper Chrome Extension](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
2. Visit `http://localhost:3000`
3. Click extension icon → Should show green checkmark + "PageView" event
4. Click "Install Free" button → Should show "Lead" event

### Step 4: Configure Standard Events

Events are already configured in `analytics.ts`:
- `PageView` - Fires on all page loads (automatic)
- `Lead` - Fires on install button click
- `CompleteRegistration` - Fires on email capture
- `Purchase` - Fires on premium signup

### Step 5: Create Custom Audiences

In Facebook Events Manager:
1. Click "Audiences" → "Create Audience" → "Custom Audience"
2. Source: "Website"
3. Events: "PageView" (All website visitors)
4. Retention: 30 days
5. Name: "Website Visitors - Last 30 Days"

Exclude audience:
1. Create another custom audience
2. Events: "Lead" (Install button clicks)
3. Retention: 180 days
4. Name: "Install Clickers - Last 180 Days"

Final retargeting audience:
1. **Include**: "Website Visitors - Last 30 Days"
2. **Exclude**: "Install Clickers - Last 180 Days"
3. Name: "Warm Visitors - No Install Yet"

---

## UTM Parameter Strategy

### Standard UTM Format

All paid ads should use this structure:

```
https://nexus-alert.com/PAGE?utm_source=SOURCE&utm_medium=MEDIUM&utm_campaign=CAMPAIGN&utm_term=KEYWORD&utm_content=CREATIVE
```

### Google Ads URLs

**NEXUS Search Campaign**:
```
https://nexus-alert.com/nexus?utm_source=google&utm_medium=cpc&utm_campaign=nexus_search&utm_term={keyword}&utm_content={creative}
```

**Global Entry Search Campaign**:
```
https://nexus-alert.com/global-entry?utm_source=google&utm_medium=cpc&utm_campaign=ge_search&utm_term={keyword}&utm_content={creative}
```

**SENTRI Search Campaign**:
```
https://nexus-alert.com/sentri?utm_source=google&utm_medium=cpc&utm_campaign=sentri_search&utm_term={keyword}&utm_content={creative}
```

**How to Add in Google Ads**:
1. Go to campaign → Ad group → Ads
2. Click "+" to create new ad
3. In "Final URL" field, paste the URL above
4. Google automatically replaces `{keyword}` and `{creative}` with actual values

### Facebook Ads URLs

**Carousel Retargeting**:
```
https://nexus-alert.com?utm_source=facebook&utm_medium=cpc&utm_campaign=retargeting_carousel&utm_content={{ad.name}}
```

**Single Image Retargeting**:
```
https://nexus-alert.com?utm_source=facebook&utm_medium=cpc&utm_campaign=retargeting_single&utm_content={{ad.name}}
```

**Video Demo**:
```
https://nexus-alert.com?utm_source=facebook&utm_medium=video&utm_campaign=retargeting_demo&utm_content={{ad.name}}
```

**How to Add in Facebook Ads**:
1. Create ad → Choose creative
2. Click "Build a URL parameter"
3. Paste UTM string above
4. Facebook automatically replaces `{{ad.name}}` with actual ad name

---

## Attribution Logic

### First-Touch Attribution

When a user first lands on the site with UTM parameters:
1. UTM params are captured in `analytics.ts` → `storeUTMParams()`
2. Stored in localStorage: `nexus_alert_utm`
3. Timestamp saved: `nexus_alert_utm_timestamp`
4. Persists across sessions until conversion

### Conversion Attribution

When user converts (install click, email, premium):
1. System retrieves stored UTM params from localStorage
2. Sends to Google Ads + Facebook with original source
3. Calculates time-to-conversion: `getTimeSinceFirstVisit()`
4. Sends metadata to analytics platforms

### Multi-Touch Handling

If user arrives via multiple sources (e.g., Google Ad → returns via Facebook Ad):
- **Google Ads**: Uses last-click attribution (default)
- **Facebook Pixel**: Tracks all touches, reports on 1-day, 7-day, 28-day windows
- **Our System**: Preserves first-touch UTM for internal analysis

---

## Key Metrics Dashboard

### Where to View Metrics

**Google Ads Dashboard**:
- Metrics: Impressions, Clicks, CTR, CPC, Conversions, Cost per Conversion
- URL: ads.google.com → Campaigns → Overview

**Facebook Ads Manager**:
- Metrics: Impressions, Clicks, CTR, CPM, CPC, Conversions, ROAS
- URL: business.facebook.com/adsmanager

**Plausible Analytics** (if installed):
- Metrics: Page views, Unique visitors, Bounce rate, Top sources
- URL: plausible.io/nexus-alert.com

### Critical Metrics to Monitor Daily (Week 1-2)

| Metric | Target | Alert If |
|--------|--------|----------|
| **Google Ads CTR** | >3% | <1.5% |
| **Google Ads CPC** | $0.40-0.80 | >$1.20 |
| **Facebook CTR** | >1.5% | <0.8% |
| **Facebook CPM** | $10-20 | >$30 |
| **Landing Page Conversion** | >10% | <5% |
| **Daily Spend** | ~$16.67 | >$25 |
| **Email Captures/Day** | >3 | <1 |
| **Install Clicks/Day** | >5 | <2 |

### Metric Formulas

**CAC (Customer Acquisition Cost)**:
```
CAC = Total Ad Spend / Install Clicks
Target: $3-5
```

**Conversion Rate**:
```
Conversion Rate = Install Clicks / Landing Page Views
Target: >10%
```

**ROAS (Return on Ad Spend)** - Calculate after 30-90 days:
```
ROAS = Revenue from Conversions / Total Ad Spend
Target: >3x (within 90 days)
```

**LTV (Lifetime Value)** - Estimated:
```
Free Tier LTV = $0 (but increases brand awareness)
Premium LTV = $4.99/mo × 6 months avg retention = $29.94
```

**Break-Even CAC**:
```
Max CAC = LTV / 3 = $29.94 / 3 = $9.98
Comfortable CAC = $5 (50% margin)
```

---

## Tracking Implementation Checklist

### Pre-Launch (Week 1)
- [x] Create analytics utility (`/web/src/app/utils/analytics.ts`)
- [x] Add Facebook Pixel to layout.tsx
- [x] Add Google Ads conversion tracking to layout.tsx
- [ ] Create Google Ads conversion actions (install, email, premium)
- [ ] Create Facebook Pixel in Business Manager
- [ ] Update `.env.local` with Pixel ID and Ads ID
- [ ] Update conversion labels in `analytics.ts`
- [ ] Test tracking with Pixel Helper + Tag Assistant
- [ ] Deploy to Vercel with new env vars

### Launch Day (Week 2)
- [ ] Verify all tracking fires correctly on production
- [ ] Create UTM-tagged URLs for all campaigns
- [ ] Set up Google Ads conversion import (if using GA4)
- [ ] Enable "Offline Conversions" API for premium signups (optional)
- [ ] Create Facebook custom audiences
- [ ] Take screenshots of baseline metrics (pre-campaign)

### Daily Monitoring (Week 2-5)
- [ ] Check Google Ads dashboard for CTR, CPC, conversions
- [ ] Check Facebook Ads dashboard for CTR, CPM, conversions
- [ ] Verify conversion attribution (Test Mode shows source)
- [ ] Monitor daily spend vs. budget ($16.67/day target)
- [ ] Log any tracking issues or discrepancies

### Weekly Analysis (Week 2-5)
- [ ] Calculate CAC: Total spend / install clicks
- [ ] Calculate conversion rate: Install clicks / page views
- [ ] Identify best performing keywords (Google) and audiences (Facebook)
- [ ] Pause underperformers (CTR <1.5%, CAC >$8)
- [ ] Increase bids on winners (CTR >5%, CAC <$4)
- [ ] A/B test new ad copy variations

---

## Troubleshooting

### Facebook Pixel Not Firing

**Check**:
1. Is `NEXT_PUBLIC_FB_PIXEL_ID` set in `.env.local`?
2. Did you restart the dev server after updating `.env.local`?
3. Open console → Check for errors loading `fbevents.js`
4. Use Facebook Pixel Helper extension → Should show green checkmark

**Fix**:
- Clear browser cache
- Verify Pixel ID is correct (no extra spaces/characters)
- Check browser's Content Security Policy (CSP) isn't blocking script

### Google Ads Conversions Not Tracking

**Check**:
1. Is `NEXT_PUBLIC_GOOGLE_ADS_ID` set in `.env.local`?
2. Did you update conversion labels in `analytics.ts`?
3. Open Google Ads → Tools → Conversions → Check "Recent conversions"
4. Wait 3 hours (conversions can be delayed)

**Fix**:
- Use Google Tag Assistant Chrome extension
- Verify `window.gtag` is defined in console
- Check if ad blockers are interfering
- Verify conversion label format is correct: `AW-XXXXXXXXXX/AbCdEfGhIj1`

### UTM Parameters Not Captured

**Check**:
1. URL has `?utm_source=...` parameters
2. Open console → Run `localStorage.getItem('nexus_alert_utm')`
3. Should return JSON object with UTM params

**Fix**:
- Ensure `storeUTMParams()` is called on page load
- Check browser's localStorage is enabled (not disabled in private mode)
- Verify no errors in `page-wrapper.tsx` ReferralTracker component

### Conversions Attributed to Wrong Source

**Explanation**:
- Google Ads uses **last-click** attribution by default
- Facebook uses **multi-touch** attribution (1-day, 7-day, 28-day windows)
- Both platforms will claim credit for the same conversion if user clicked both ads

**Solution**:
- Accept that attribution will overlap (industry standard)
- Use internal analytics (UTM + localStorage) for source-of-truth
- Focus on **incrementality**: Does total conversions increase when ads are on?

---

## Testing Checklist

### Manual Testing Procedure

1. **Clear Tracking Data**:
   ```javascript
   localStorage.clear()
   document.cookie = ''
   ```

2. **Simulate Google Ad Click**:
   ```
   http://localhost:3000/nexus?utm_source=google&utm_medium=cpc&utm_campaign=nexus_search&utm_term=nexus+appointment+finder
   ```

3. **Verify UTM Storage**:
   - Open console → Run `localStorage.getItem('nexus_alert_utm')`
   - Should show stored UTM parameters

4. **Test Install Click Conversion**:
   - Click "Install Free" button
   - Open console → Should see "[Analytics] Google Ads conversion tracked"
   - Check Facebook Pixel Helper → Should show "Lead" event

5. **Test Email Capture**:
   - Enter email in capture form
   - Submit
   - Should fire `CompleteRegistration` event on Facebook
   - Should fire `email_capture` conversion on Google

6. **Verify in Dashboards** (wait 3 hours):
   - Google Ads → Conversions → Should show test conversion
   - Facebook Events Manager → Should show "Lead" and "CompleteRegistration"

### Automated Testing (Optional - Week 3+)

Create Playwright test:
```typescript
// tests/tracking.spec.ts
test('install click fires conversions', async ({ page }) => {
  await page.goto('/?utm_source=google&utm_medium=cpc');

  // Track network requests
  const gtagCalls = [];
  const fbqCalls = [];

  page.on('console', msg => {
    if (msg.text().includes('[Analytics]')) {
      console.log(msg.text());
    }
  });

  await page.click('text=Install Free');

  // Assertions
  expect(localStorage.getItem('nexus_alert_utm')).toContain('google');
  // Check console logs for conversion tracking
});
```

---

## Data Privacy & Compliance

### GDPR Compliance (EU Users)

If running ads in EU:
- [ ] Add cookie consent banner (use [CookieYes](https://www.cookieyes.com/) or similar)
- [ ] Only load Facebook Pixel after consent
- [ ] Provide opt-out mechanism in Privacy Policy
- [ ] Update Privacy Policy with tracking disclosure

### CCPA Compliance (California)

- [ ] Add "Do Not Sell My Info" link to footer
- [ ] Respect "Global Privacy Control" browser signal
- [ ] Disclose data sharing with Facebook/Google in Privacy Policy

### Tracking Disclosure

Add to Privacy Policy (`/privacy`):
> We use Google Ads conversion tracking and Facebook Pixel to measure ad performance. These services may use cookies to track your interaction with our ads. You can opt out of personalized ads at [aboutads.info](http://www.aboutads.info/choices/).

---

## Campaign Optimization Playbook

### Week 1: Gather Data
- Run all campaigns with no changes
- Let conversions accumulate (minimum 50 clicks per campaign)
- Note which keywords/audiences have best CTR

### Week 2: Pause Losers
- Pause keywords with CTR <1.5% or CPC >$1.20
- Pause Facebook ads with CTR <0.8%
- Reallocate budget to winners

### Week 3: Test Variations
- Create 2-3 new ad copy variations for top performers
- Test different headlines/descriptions
- Test different Facebook creative (image vs. carousel)

### Week 4: Scale Winners
- Increase daily budget by 20% for campaigns with CAC <$5
- Add more related keywords to winning campaigns
- Create lookalike audiences on Facebook

### Week 5+: Decision Point
- If CAC <$5 and conversion rate >10%: **Scale to $2K/month**
- If CAC $5-8 and conversion rate 7-10%: **Continue testing**
- If CAC >$8 or conversion rate <5%: **Pause and pivot to organic**

---

## Export & Reporting

### Weekly Report Template

```
NEXUS Alert - Paid Ads Performance Week X

GOOGLE ADS
Impressions: X,XXX
Clicks: XXX
CTR: X.X%
CPC: $X.XX
Conversions (Install Clicks): XX
Cost per Conversion: $X.XX

FACEBOOK ADS
Impressions: X,XXX
Clicks: XXX
CTR: X.X%
CPM: $XX.XX
Conversions (Leads): XX
Cost per Lead: $X.XX

OVERALL
Total Spend: $XXX
Total Install Clicks: XX
Overall CAC: $X.XX
Email Captures: XX
Landing Page Conversion Rate: X.X%

INSIGHTS
- Best performing keyword: "KEYWORD" (CTR X.X%, CAC $X.XX)
- Best performing audience: Facebook retargeting (CTR X.X%)
- Next steps: [Actions based on data]
```

### Data Export

**Google Ads**:
1. Reports → Predefined Reports → Campaigns
2. Download → Google Sheets or CSV
3. Export weekly

**Facebook Ads**:
1. Ads Manager → Export → Table Data
2. Choose columns: Impressions, Clicks, CTR, Conversions, Cost
3. Date range: Last 7 days
4. Download CSV

---

## Support & Resources

**Google Ads Help**:
- [Conversion Tracking Guide](https://support.google.com/google-ads/answer/1722022)
- [Troubleshooting Conversions](https://support.google.com/google-ads/answer/2404182)

**Facebook Pixel Help**:
- [Pixel Setup Guide](https://www.facebook.com/business/help/952192354843755)
- [Pixel Helper Extension](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)

**Testing Tools**:
- [Google Tag Assistant](https://tagassistant.google.com/)
- [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
- [UTM Builder](https://ga-dev-tools.google/campaign-url-builder/)

**Questions**: help@nexus-alert.com
