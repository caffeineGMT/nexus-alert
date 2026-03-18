# Analytics Tracking Setup for Product Hunt Launch

## 🎯 Tracking Goals

Track the full funnel from Product Hunt visit → Landing page → Chrome install → Premium conversion.

**Key Questions to Answer**:
1. How much traffic came from Product Hunt?
2. What's the conversion rate from PH → Chrome install?
3. How many people used the PRODUCTHUNT promo code?
4. Which landing page sections drove the most conversions?
5. What's the retention rate of PH users vs organic users?

---

## 📊 Analytics Stack

### Tools Needed
1. **Google Analytics 4** (GA4) - Free, primary analytics
2. **Stripe Dashboard** - Revenue and conversion tracking
3. **Chrome Web Store Developer Dashboard** - Install metrics
4. **Vercel Analytics** (if using Vercel) - Real-time traffic

---

## 🔗 UTM Parameter Structure

### Base Parameters
```
utm_source=producthunt
utm_medium=referral
utm_campaign=ph_launch
utm_content=[specific_cta]
```

### Specific CTAs (utm_content values)

**Landing Page CTAs**:
- `hero_install` - Hero section "Add to Chrome" button
- `nav_install` - Navigation bar install button
- `pricing_upgrade` - Pricing section upgrade CTA
- `cta_install` - Bottom CTA section
- `chrome_store_badge` - Chrome Web Store badge/link

**External Links**:
- `github` - GitHub repo link
- `privacy` - Privacy policy link
- `terms` - Terms of service link

### URL Examples

**Chrome Web Store Link** (from /ph page):
```
https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID?utm_source=producthunt&utm_medium=referral&utm_campaign=ph_launch&utm_content=hero_install
```

**Landing Page Link** (for Product Hunt post):
```
https://nexusalert.com/ph?utm_source=producthunt&utm_medium=referral&utm_campaign=ph_launch
```

**Social Media Shares** (Twitter, LinkedIn):
```
https://nexusalert.com/ph?utm_source=twitter&utm_medium=social&utm_campaign=ph_launch
```

---

## 📈 Google Analytics 4 Setup

### 1. Create Custom Events

**Event: chrome_store_click**
- Fires when user clicks Chrome Web Store link
- Parameters:
  - `source`: producthunt
  - `cta_location`: hero | nav | pricing | cta
  - `page_url`: /ph

**Event: email_signup**
- Fires when user submits email capture form
- Parameters:
  - `source`: producthunt
  - `page_url`: /ph

**Event: checkout_start**
- Fires when user initiates Stripe checkout
- Parameters:
  - `source`: producthunt
  - `tier`: premium
  - `promo_code`: PRODUCTHUNT (if used)

**Event: premium_conversion**
- Fires when Stripe checkout completes
- Parameters:
  - `source`: producthunt
  - `revenue`: 0.00 (first month free) or 4.99
  - `promo_code`: PRODUCTHUNT

### 2. Implementation Code (Next.js)

**File**: `web/src/app/ph/page.tsx`

Add Google Analytics tracking to CTAs:

```typescript
// Add to Chrome Web Store link
onClick={() => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'chrome_store_click', {
      source: 'producthunt',
      cta_location: 'hero',
      page_url: '/ph'
    });
  }
}}
```

**File**: `web/src/app/components/EmailCaptureForm.tsx`

```typescript
// After successful email submission
window.gtag('event', 'email_signup', {
  source: 'producthunt',
  page_url: window.location.pathname
});
```

**File**: `web/src/app/api/checkout/route.ts`

```typescript
// In Stripe checkout session creation
metadata: {
  source: 'producthunt',
  campaign: 'ph_launch',
  promo_code: body.promoCode || ''
}
```

### 3. Create Custom Dimensions

**User-scoped Dimensions**:
- `acquisition_source` - First touchpoint (producthunt, organic, etc.)
- `has_premium` - Whether user has premium subscription

**Event-scoped Dimensions**:
- `cta_location` - Where user clicked CTA
- `promo_code_used` - Which promo code was applied

### 4. Create Custom Reports

**Product Hunt Funnel Report**:
1. Landing page views (/ph)
2. Chrome Store clicks
3. Email signups
4. Checkout starts
5. Premium conversions

**Product Hunt Conversion Report**:
- Columns: Source, Sessions, Chrome Clicks, Conversion Rate, Revenue
- Filter: utm_source = producthunt

---

## 💰 Stripe Tracking

### 1. Promo Code Setup

**Code**: `PRODUCTHUNT`
**Discount**: 100% off first month
**Duration**: Repeating (1 month)
**Redemption Limit**: 500 uses
**Expiration**: Launch day + 7 days

**Stripe Dashboard Setup**:
1. Go to Products → Coupons
2. Create coupon: `PRODUCTHUNT`
3. Set 100% off for 1 month duration
4. Set max redemptions: 500
5. Set expiration date

### 2. Checkout Session Metadata

Add metadata to every Stripe checkout session:

```typescript
const session = await stripe.checkout.sessions.create({
  // ... other params
  metadata: {
    source: 'producthunt',
    campaign: 'ph_launch',
    utm_source: searchParams.get('utm_source') || '',
    utm_campaign: searchParams.get('utm_campaign') || '',
    promo_code: body.promoCode || '',
    user_email: body.email
  },
  // ...
});
```

### 3. Webhook Tracking

Listen for `checkout.session.completed` webhook:

```typescript
// Log to analytics
if (session.metadata.source === 'producthunt') {
  // Track PH conversion
  analytics.track('premium_conversion', {
    source: 'producthunt',
    revenue: session.amount_total / 100,
    promo_code: session.metadata.promo_code,
    customer_email: session.customer_email
  });
}
```

### 4. Revenue Attribution

**Metrics to Track**:
- Total PH revenue (day 1, week 1, month 1)
- LTV of PH users vs organic users
- Churn rate: PH users vs organic
- PRODUCTHUNT code usage (total redemptions)

---

## 🌐 Chrome Web Store Analytics

### Dashboard Metrics (Manual Tracking)

Track daily from Chrome Web Store Developer Dashboard:

**Day 1 (Launch Day)**:
- Installs: ___
- Uninstalls: ___
- Active users: ___
- Average rating: ___
- Reviews: ___

**Week 1**:
- Total installs: ___
- Weekly active users: ___
- Retention (D1, D7): ___
- Rating distribution: ___

### Linking CWS to GA4

**Challenge**: Chrome Web Store doesn't pass referrer data

**Solution**: Use UTM parameters in Chrome Store link:
```
https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID?utm_source=producthunt&utm_medium=referral&utm_campaign=ph_launch&utm_content=hero_install
```

When user installs, track in extension:
```javascript
// In background.js or onboarding.js
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Get referrer from storage (if set)
    chrome.storage.local.get(['install_source'], (result) => {
      const source = result.install_source || 'organic';

      // Send to analytics
      fetch('https://your-backend.com/api/track-install', {
        method: 'POST',
        body: JSON.stringify({
          event: 'extension_install',
          source: source,
          timestamp: new Date().toISOString()
        })
      });
    });
  }
});
```

---

## 📱 Real-Time Tracking Dashboard

### Metrics to Monitor Live on Launch Day

**Google Analytics 4 Real-Time Report**:
- Active users on site
- Traffic source breakdown
- Conversions (Chrome clicks, email signups)
- Geographic location

**Stripe Dashboard**:
- Successful payments
- PRODUCTHUNT code redemptions
- Failed payments (investigate why)

**Chrome Web Store**:
- Install count (updates hourly)
- User reviews (respond to all)
- Rating changes

**Product Hunt**:
- Upvote count
- Ranking position
- Comment count

### Dashboard Setup (Google Sheets or Notion)

**Tracking Sheet Columns**:
| Time | PH Upvotes | PH Rank | Site Visitors | Chrome Clicks | Installs | Premium Signups | Revenue | Notes |
|------|------------|---------|---------------|---------------|----------|-----------------|---------|-------|
| 12 AM | 5 | 15 | 50 | 10 | 2 | 0 | $0 | Launch! |
| 1 AM | 15 | 12 | 120 | 30 | 8 | 1 | $0 | First premium signup |
| 8 AM | 100 | 5 | 1,200 | 250 | 50 | 5 | $0 | Social amplification working |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

**Update Frequency**: Hourly on launch day

---

## 🎯 Conversion Funnel Tracking

### Funnel Steps

1. **Product Hunt Visit** → Land on /ph page
2. **Landing Page View** → View /ph page
3. **Chrome Store Click** → Click "Add to Chrome" CTA
4. **Extension Install** → Install from Chrome Web Store
5. **Extension Open** → Open extension popup
6. **Premium Click** → Click "Upgrade to Premium"
7. **Checkout Start** → Initiate Stripe checkout
8. **Premium Conversion** → Complete payment

### Expected Conversion Rates (Benchmarks)

| Step | Conversion | Industry Benchmark |
|------|------------|-------------------|
| PH Click → Landing View | 80-90% | Varies by PH ranking |
| Landing View → Chrome Click | 20-30% | Good product-market fit |
| Chrome Click → Install | 50-70% | Good Chrome Store listing |
| Install → Extension Open | 80-90% | Good onboarding |
| Open → Premium Click | 5-10% | Freemium SaaS average |
| Premium Click → Checkout | 60-80% | Well-designed checkout |
| Checkout → Conversion | 70-90% | Low friction payment |

### Goal Setting

**Conservative** (500 PH visits):
- Landing views: 400 (80%)
- Chrome clicks: 100 (25%)
- Installs: 60 (60%)
- Premium conversions: 3 (5% of installs)

**Target** (2,000 PH visits):
- Landing views: 1,600 (80%)
- Chrome clicks: 400 (25%)
- Installs: 240 (60%)
- Premium conversions: 12 (5% of installs)

**Stretch** (5,000 PH visits, #1 product):
- Landing views: 4,000 (80%)
- Chrome clicks: 1,000 (25%)
- Installs: 600 (60%)
- Premium conversions: 30 (5% of installs)

---

## 📊 Post-Launch Analysis

### Week 1 Report (Due: 7 days after launch)

**Traffic Sources**:
- Product Hunt: ___ visitors, ___% of total
- Twitter: ___ visitors, ___% of total
- Hacker News: ___ visitors, ___% of total
- Direct: ___ visitors, ___% of total
- Organic search: ___ visitors, ___% of total

**Conversion Metrics**:
- PH visitors → Chrome installs: ___%
- PH visitors → Premium signups: ___%
- PRODUCTHUNT code redemptions: ___
- Revenue from PH users: $___

**User Behavior**:
- Average session duration: ___
- Bounce rate on /ph: ___%
- Most viewed sections: ___
- Exit pages: ___

**Retention** (if trackable):
- Day 1 retention: ___%
- Day 7 retention: ___%

### Month 1 Report (Due: 30 days after launch)

**Long-Term Impact**:
- Total installs from PH cohort: ___
- Active users from PH cohort: ___
- Premium conversion rate (PH vs organic): ___% vs ___%
- Churn rate (PH vs organic): ___% vs ___%
- LTV (PH vs organic): $___ vs $___

**ROI Calculation**:
- Total PH marketing cost: $___ (time + assets + promo code discount)
- Total revenue from PH cohort: $___
- ROI: ___%

---

## 🛠️ Implementation Checklist

### Pre-Launch (1 Week Before)
- [ ] Google Analytics 4 installed on website
- [ ] Custom events created (chrome_store_click, email_signup, etc.)
- [ ] UTM parameters added to all /ph page CTAs
- [ ] Stripe metadata configured
- [ ] PRODUCTHUNT promo code created
- [ ] Test all tracking (submit test conversions)
- [ ] Create real-time tracking dashboard (Google Sheets)

### Launch Day
- [ ] Verify GA4 real-time tracking is working
- [ ] Monitor Stripe dashboard for conversions
- [ ] Update tracking sheet hourly
- [ ] Check Chrome Web Store installs (hourly)
- [ ] Verify promo code is working (test checkout)

### Post-Launch (Week 1)
- [ ] Export GA4 data to spreadsheet
- [ ] Calculate conversion rates at each funnel step
- [ ] Identify drop-off points
- [ ] Compare PH vs other sources
- [ ] Write Week 1 report

### Post-Launch (Month 1)
- [ ] Track retention metrics
- [ ] Calculate LTV by cohort
- [ ] Analyze churn rate
- [ ] Write Month 1 report
- [ ] Share insights with team

---

## 🔍 Key Metrics Dashboard (Quick Reference)

### Product Hunt Day 1
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| PH Upvotes | 500+ | ___ | ⏳ |
| PH Ranking | #1-3 | ___ | ⏳ |
| Landing Page Views | 4,000+ | ___ | ⏳ |
| Chrome Store Clicks | 1,000+ | ___ | ⏳ |
| Chrome Installs | 200+ | ___ | ⏳ |
| Email Signups | 100+ | ___ | ⏳ |
| Premium Signups | 20+ | ___ | ⏳ |
| PRODUCTHUNT Code Uses | 50+ | ___ | ⏳ |
| Revenue | $100+ | $___ | ⏳ |

### Week 1
| Metric | Target | Actual |
|--------|--------|--------|
| Total Installs (PH source) | 1,000+ | ___ |
| Premium Conversions (PH) | 50+ | ___ |
| MRR from PH | $250+ | $___ |
| D7 Retention | 40%+ | ___% |

---

## 📞 Troubleshooting

### Issue: GA4 Not Tracking PH Traffic
**Diagnosis**: Check if utm_source=producthunt is in URL
**Fix**: Verify UTM parameters in all PH post links

### Issue: Stripe Conversions Not Attributed to PH
**Diagnosis**: Metadata not passing through to checkout
**Fix**: Update checkout session creation to include metadata

### Issue: Can't Track Chrome Store Installs by Source
**Diagnosis**: Chrome Web Store doesn't pass referrer
**Fix**: Use extension onboarding to ask "How did you hear about us?"

### Issue: Conversion Rate Seems Low
**Diagnosis**: Identify drop-off point in funnel
**Fix**: A/B test landing page, simplify checkout, improve messaging

---

## 🎓 Resources

**Google Analytics 4**:
- GA4 Setup Guide: https://support.google.com/analytics/answer/9304153
- Custom Events: https://support.google.com/analytics/answer/9267735

**Stripe Analytics**:
- Dashboard Overview: https://stripe.com/docs/dashboard
- Metadata: https://stripe.com/docs/api/metadata

**UTM Parameters**:
- UTM Builder: https://ga-dev-tools.google/campaign-url-builder/
- Best Practices: https://support.google.com/analytics/answer/1033863

---

**Last Updated**: Pre-launch week
**Questions?** Open issue in GitHub or email support@nexusalert.com
