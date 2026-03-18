# Stripe Annual Pricing Setup Guide

This guide walks you through setting up annual pricing in Stripe for NEXUS Alert Premium.

## Overview

NEXUS Alert now supports two billing cycles:
- **Monthly**: $4.99/month
- **Annual**: $49.99/year ($4.16/month effective rate, 16% savings)

## Step 1: Create Annual Price in Stripe Dashboard

1. **Log in to Stripe Dashboard**
   - Navigate to https://dashboard.stripe.com/
   - Select your account (Test or Live mode)

2. **Navigate to Products**
   - Click **Products** in the left sidebar
   - Find your existing "NEXUS Alert Premium" product
   - Click on it to view details

3. **Add Annual Price**
   - Click **Add another price**
   - Set the following:
     - **Pricing model**: Standard pricing
     - **Price**: $49.99 USD
     - **Billing period**: Yearly
     - **Usage type**: Licensed (for per-user pricing)
   - Click **Add price**

4. **Copy the Price ID**
   - Once created, you'll see a new price entry like `price_1Abc123xyz...`
   - Copy this Price ID — you'll need it for environment variables

## Step 2: Update Environment Variables

### Backend (Cloudflare Worker)

Add the following to your `wrangler.toml` or Cloudflare Worker environment variables:

```toml
[vars]
STRIPE_MONTHLY_PRICE_ID = "price_1Abc123xyz..."  # Your existing monthly price ID
STRIPE_ANNUAL_PRICE_ID = "price_1Def456uvw..."   # Your new annual price ID
```

**Note**: Replace the legacy `STRIPE_PRICE_ID` variable with both `STRIPE_MONTHLY_PRICE_ID` and `STRIPE_ANNUAL_PRICE_ID`.

### Web App (Next.js)

Update your `.env.local` file:

```bash
# Existing variables
NEXT_PUBLIC_API_URL=https://api.nexus-alert.com

# No additional variables needed — pricing is handled by backend
```

## Step 3: Test Checkout Flow

### Test Mode

1. Use Stripe's test mode to verify both plans:
   - Monthly: Test with `4242 4242 4242 4242` (Visa)
   - Annual: Test with `5555 5555 5555 4444` (Mastercard)

2. Verify checkout sessions:
   - Go to Stripe Dashboard → **Payments** → **Checkout sessions**
   - Confirm both monthly and annual sessions are created correctly

3. Check metadata:
   - Each session should include:
     - `email`: Customer email
     - `billingCycle`: `monthly` or `annual`
     - `referralCode`: (if applicable)

### Live Mode

1. Switch to Live mode in Stripe Dashboard
2. Repeat the annual price creation process
3. Update production environment variables in Cloudflare Workers

## Step 4: Deploy

### Backend

```bash
cd backend
npm run deploy
```

### Web

```bash
cd web
npm run build
vercel --prod
```

## Analytics Tracking

The backend automatically tracks billing cycle conversions in KV:

- `analytics:billing_cycle:monthly` — Monthly plan count
- `analytics:billing_cycle:annual` — Annual plan count
- `analytics:billing_cycle:total` — Total conversions

### View Analytics

Use `wrangler kv:key get` to check stats:

```bash
wrangler kv:key get analytics:billing_cycle:annual --namespace-id=YOUR_KV_NAMESPACE_ID
wrangler kv:key get analytics:billing_cycle:monthly --namespace-id=YOUR_KV_NAMESPACE_ID
wrangler kv:key get analytics:billing_cycle:total --namespace-id=YOUR_KV_NAMESPACE_ID
```

## Conversion Goals

Target metrics (within 3 months of launch):
- **Annual adoption rate**: 40% of new premium users
- **LTV increase**: 2.5x (from $59.88 to $150+ per customer)
- **Churn reduction**: Annual users have ~60% lower churn than monthly

## Urgency Messaging

The platform displays limited-time urgency messaging:
- "🔥 Limited time: Annual plan at launch price — lock in $49.99/year before it increases to $59.99"

**Action**: After 3 months or reaching 500 annual subscribers, increase annual price to $59.99/year and update messaging accordingly.

## Testing Checklist

- [ ] Stripe product has both monthly and annual prices
- [ ] Environment variables set in both test and live modes
- [ ] Monthly checkout works ($4.99/month)
- [ ] Annual checkout works ($49.99/year)
- [ ] Webhook correctly stores `billingCycle` metadata
- [ ] Analytics tracking increments properly
- [ ] Extension popup shows toggle and correct prices
- [ ] Landing page shows toggle with "Save 16%" badge
- [ ] Urgency banner displays on both surfaces
- [ ] Success page shows correct billing info

## Rollback Plan

If issues arise, revert to monthly-only by:
1. Removing billing toggle from frontend (set `billingCycle` state to always `'monthly'`)
2. Commenting out annual price logic in backend
3. Reverting to single `STRIPE_PRICE_ID` environment variable

## Future Price Adjustments

To update pricing:
1. Create new price in Stripe (never edit existing prices)
2. Update environment variables to point to new price IDs
3. Deploy backend and frontend changes
4. Archive old prices in Stripe (don't delete — existing subscriptions need them)
