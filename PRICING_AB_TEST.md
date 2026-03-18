# Pricing A/B Test Implementation

## Overview

This A/B test evaluates optimal pricing for NEXUS Alert Premium tier by testing a **100% price increase** ($4.99 → $9.99) to maximize revenue per visitor while maintaining healthy conversion rates.

**Hypothesis**: Current $4.99/mo price point undervalues the product (solves 6-month wait time). A $9.99 price point should maintain >70% of control conversion rate, resulting in higher net revenue.

## Test Variants

| Variant | Monthly Price | Annual Price | Annual Discount | Annual Savings |
|---------|--------------|--------------|-----------------|----------------|
| **Control** | $4.99/mo | $49.99/yr | 16% | $10/year |
| **Test** | $9.99/mo | $79.99/yr | 33% | $40/year |

### Pricing Rationale

- **Control ($4.99)**: Current baseline pricing
- **Test ($9.99)**: 100% increase, still well below enterprise/pro monitoring tools ($20-50/mo)
- **Annual discount increased to 33%**: More compelling value proposition for higher price point
- Annual pricing: $79.99/year = $6.66/mo (vs. $9.99 monthly)

## Implementation

### 1. Frontend (PricingSection.tsx)

✅ **Variant Assignment**
- 50/50 random split on first page load
- Persisted in localStorage (`nexus_price_variant`)
- Tracked in Plausible with custom property

✅ **Dynamic Pricing Display**
- Shows variant-specific prices ($4.99 vs $9.99)
- Updates annual savings banner ($10 vs $40)
- Updates billing toggle badge (33% discount)

✅ **Checkout Tracking**
- Passes `priceVariant` to backend
- Tracks variant in Plausible checkout events
- Tracks variant in Google Analytics

### 2. Backend (worker.js)

✅ **Price Selection Logic**
- Reads `priceVariant` from checkout request
- Uses test Stripe price IDs when `priceVariant === 'test'`
- Stores variant in Stripe metadata for analysis

✅ **Metadata Tracking**
```javascript
metadata: {
  priceVariant: 'control' | 'test',
  abTest: 'pricing_optimization_2026',
  billingCycle: 'monthly' | 'annual',
  // ... other metadata
}
```

### 3. Stripe Environment Variables

**New Secrets Required:**
```bash
# Development
wrangler secret put STRIPE_MONTHLY_PRICE_TEST
wrangler secret put STRIPE_ANNUAL_PRICE_TEST

# Production
wrangler secret put STRIPE_MONTHLY_PRICE_TEST --env production
wrangler secret put STRIPE_ANNUAL_PRICE_TEST --env production
```

## Stripe Dashboard Setup

### Step 1: Create Test Price IDs

1. Go to Stripe Dashboard → Products → NEXUS Alert Premium
2. Create new prices:

**Monthly Test Price ($9.99)**
- Billing period: Monthly
- Price: $9.99 USD
- Description: "Premium - Monthly (A/B Test)"
- Copy Price ID (starts with `price_...`)

**Annual Test Price ($79.99)**
- Billing period: Yearly
- Price: $79.99 USD
- Description: "Premium - Annual (A/B Test)"
- Copy Price ID (starts with `price_...`)

### Step 2: Set Environment Variables

```bash
# Development
cd backend
wrangler secret put STRIPE_MONTHLY_PRICE_TEST
# Paste: price_1XXXXXXXX (your $9.99/mo price ID)

wrangler secret put STRIPE_ANNUAL_PRICE_TEST
# Paste: price_1YYYYYYYY (your $79.99/yr price ID)

# Production
wrangler secret put STRIPE_MONTHLY_PRICE_TEST --env production
wrangler secret put STRIPE_ANNUAL_PRICE_TEST --env production
```

### Step 3: Verify Secrets

```bash
# List secrets (values are hidden)
wrangler secret list
wrangler secret list --env production
```

## Test Execution Plan

### Success Criteria

**Primary Metric**: Revenue per 100 visitors
- Control: 100 visitors × 12% conversion × $4.99 = $59.88
- Test: 100 visitors × 8.4% conversion × $9.99 = $83.92
- **Target**: Test variant > $60/100 visitors (break-even)

**Secondary Metrics**:
- Conversion rate (test should be >70% of control)
- Annual vs. monthly mix (test should drive more annual with 33% discount)
- Cohort LTV (track first 30 days)

### Test Duration

**Run until one of:**
1. **500 total premium conversions** (250 per variant)
2. **14 days** elapsed
3. **Statistical significance** reached (95% confidence)

**Early stopping**: If test variant has <50% conversion rate of control after 100 conversions, stop and revert.

### Monitoring

**Daily Checks:**
```bash
# Check Plausible Analytics
# Custom property: price_variant
# Events: "Checkout - Monthly", "Checkout - Annual"

# Check Stripe Dashboard
# Filter subscriptions by metadata.priceVariant
# Compare conversion rates and MRR
```

**Key Metrics to Track:**
- Impressions per variant (should be ~50/50)
- Checkout starts per variant
- Completed subscriptions per variant
- Conversion rate (subscriptions / impressions)
- Revenue per visitor (MRR / impressions)

## Analysis & Decision Framework

### After Test Completion

1. **Export Stripe data** filtered by `metadata.abTest = 'pricing_optimization_2026'`
2. **Calculate metrics**:
   ```
   Control Conversion Rate = Control Subs / Control Impressions
   Test Conversion Rate = Test Subs / Test Impressions

   Control RPV = Control MRR / Control Impressions
   Test RPV = Test MRR / Test Impressions

   Relative Conversion = Test CR / Control CR
   Revenue Lift = (Test RPV - Control RPV) / Control RPV
   ```

3. **Decision Matrix**:

| Scenario | Test Conversion vs Control | Revenue Lift | Decision |
|----------|---------------------------|--------------|----------|
| A | >70% | Positive | **Adopt $9.99** |
| B | 50-70% | Positive | **Adopt $9.99** (monitor churn) |
| C | >70% | Negative | Keep $4.99 (pricing sweet spot) |
| D | <50% | Any | Keep $4.99 (price resistance) |

4. **Recommended Action**:
   - If Test RPV > Control RPV by **10%+**: Switch to $9.99 permanently
   - If Test CR > 70% of Control: Consider middle ground ($7.99)
   - If inconclusive: Extend test or try $7.99 variant

## Middle Ground Test ($7.99)

If results are inconclusive, test a middle price point:

1. Create $7.99/mo and $59.99/yr prices in Stripe
2. Update `PRICE_CONFIGS` in PricingSection.tsx:
   ```typescript
   middle: {
     monthly: 7.99,
     annual: 59.99,
     annualMonthly: 4.99,
     annualSavings: 35.88,
   }
   ```
3. Adjust variant assignment to 33/33/33 split
4. Run for another 500 conversions

## Rollout Plan

### If Test Wins ($9.99)

1. **Stop new variant assignments**:
   ```typescript
   // In PricingSection.tsx
   return 'test'; // Force all new users to winning variant
   ```

2. **Update all pricing references** in:
   - Landing page copy
   - Help docs (`/help/*`)
   - FAQ pages
   - Blog posts
   - Terms of service

3. **Grandfather existing control users**:
   - Keep existing $4.99 subscribers at current price
   - Option: Offer annual upgrade at $79.99 (still saves vs. $9.99/mo)

4. **Remove A/B test code** after 30 days:
   - Hard-code $9.99 prices
   - Remove variant logic
   - Archive test price IDs in Stripe

### If Control Wins ($4.99)

1. **Remove test variant** from code
2. **Consider alternative optimizations**:
   - Improve conversion funnel (reduce friction)
   - Add annual discount urgency
   - Test quarterly billing ($12.99/quarter)
   - Test feature-gated tiers (Basic/Pro split)

## Reporting Template

### Weekly Update Format

```
NEXUS Alert Pricing A/B Test - Week X
────────────────────────────────────
Test Period: Mar 18 - Apr 1, 2026
Total Conversions: XXX / 500

Control ($4.99/mo):
• Impressions: XXX
• Conversions: XXX
• Conversion Rate: X.X%
• MRR: $X,XXX
• Revenue per 100 visitors: $XX

Test ($9.99/mo):
• Impressions: XXX
• Conversions: XXX
• Conversion Rate: X.X%
• MRR: $X,XXX
• Revenue per 100 visitors: $XX

Metrics:
• Relative Conversion: XX% (Target: >70%)
• Revenue Lift: +XX% (Target: >10%)
• Annual Mix: XX% control, XX% test

Status: On track / Needs attention
Next Action: Continue / Early stop / Extend
```

## Technical Notes

### Variant Consistency

- Variant is assigned once per browser (localStorage)
- Survives page refreshes and browser restarts
- Users who clear cookies get re-assigned (edge case, <1%)

### Analytics Tracking

**Plausible Events:**
- `Price Variant Assigned` (props: variant, monthly_price, annual_price)
- `Checkout - Monthly` (props: price_variant, price)
- `Checkout - Annual` (props: price_variant, price)

**Stripe Metadata:**
```javascript
{
  priceVariant: 'control' | 'test',
  abTest: 'pricing_optimization_2026',
  billingCycle: 'monthly' | 'annual',
  email: 'user@example.com',
  // ... other fields
}
```

### Rollback Procedure

If test causes severe conversion drop:

1. **Immediate**: Set `STRIPE_MONTHLY_PRICE_TEST` and `STRIPE_ANNUAL_PRICE_TEST` to same values as control prices
2. **Within 1 hour**: Deploy code change to force `priceVariant = 'control'`
3. **Within 24 hours**: Remove A/B test code entirely

## Success Metrics Dashboard

Track in Plausible + Stripe:

| Metric | Control Target | Test Target | Actual |
|--------|---------------|-------------|---------|
| Conversion Rate | 12% | >8.4% | TBD |
| Revenue per 100 visitors | $59.88 | >$60 | TBD |
| Annual adoption rate | 35% | >40% | TBD |
| First-month churn | <5% | <5% | TBD |

## Files Modified

- ✅ `web/src/app/components/PricingSection.tsx` - A/B test logic
- ✅ `web/src/app/api/checkout/route.ts` - Forward priceVariant
- ✅ `backend/src/worker.js` - Price selection + metadata
- ✅ `backend/wrangler.toml` - Document new secrets
- ✅ `PRICING_AB_TEST.md` - This file (test documentation)

## Next Steps

1. ☐ **Create Stripe prices** ($9.99/mo and $79.99/yr)
2. ☐ **Set secrets** (dev + production environments)
3. ☐ **Deploy backend** with updated worker.js
4. ☐ **Deploy frontend** with PricingSection changes
5. ☐ **Verify A/B test** is live (check localStorage + Plausible)
6. ☐ **Monitor daily** conversion rates and revenue
7. ☐ **Analyze results** after 500 conversions or 14 days
8. ☐ **Make decision** and roll out winning variant

---

**Questions?** Review this doc or check Stripe metadata for live test performance.
