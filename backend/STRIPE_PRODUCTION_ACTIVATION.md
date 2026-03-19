# 🚀 Stripe Production Activation — Step-by-Step Guide

**Status:** ⏳ PENDING ACTIVATION
**Created:** March 19, 2026
**Revenue Target:** $1M ARR

---

## 📋 Pre-Activation Checklist

Before activating Stripe production mode, verify:

- [ ] Stripe account fully activated (business verification complete)
- [ ] Bank account connected for payouts
- [ ] Live mode enabled in Stripe Dashboard
- [ ] Cloudflare Worker deployed and accessible
- [ ] Custom domain configured: `api.nexus-alert.com`
- [ ] Testing complete in Stripe test mode
- [ ] Webhook endpoint accessible: `https://api.nexus-alert.com/api/webhook`

---

## ⚡ Quick Start (15 minutes)

### Option A: Automated Script (Recommended)

```bash
cd /Users/michaelguo/nexus-alert/backend
./scripts/stripe-production-migration.sh
```

The script will guide you through:
1. Creating products in Stripe
2. Collecting price IDs and API keys
3. Setting Cloudflare Worker secrets
4. Deploying the backend
5. Testing the payment flow

---

### Option B: Manual Setup

#### Step 1: Create Stripe Products (5 min)

1. Go to https://dashboard.stripe.com
2. **Toggle to Live Mode** (top-right switcher)
3. Navigate to: **Products** → **Add product**

**Product 1: Monthly Subscription**
- Name: `NEXUS Alert Premium Monthly`
- Description: `Get instant alerts for new NEXUS appointment slots`
- Pricing model: `Recurring`
- Price: `$4.99 USD / month`
- Billing period: `Monthly`
- Click **Save product**
- **Copy Price ID** (starts with `price_`) ✅

**Product 2: Annual Subscription**
- Name: `NEXUS Alert Premium Annual`
- Description: `Get instant alerts for new NEXUS appointment slots (annual billing)`
- Pricing model: `Recurring`
- Price: `$49.99 USD / year`
- Billing period: `Yearly`
- Click **Save product**
- **Copy Price ID** (starts with `price_`) ✅

**Optional: A/B Test Variants**
- Monthly Test: `$9.99 USD / month`
- Annual Test: `$79.99 USD / year`

---

#### Step 2: Get Live API Keys (2 min)

1. Go to https://dashboard.stripe.com/apikeys
2. Ensure you're in **Live Mode**
3. Click **Reveal live key** for Secret key
4. **Copy** the secret key (starts with `sk_live_`) ✅

---

#### Step 3: Configure Cloudflare Worker Secrets (3 min)

```bash
cd /Users/michaelguo/nexus-alert/backend

# Set Stripe live secret key
npx wrangler secret put STRIPE_SECRET_KEY
# Paste: sk_live_... (from Step 2)

# Set monthly price ID
npx wrangler secret put STRIPE_MONTHLY_PRICE_ID
# Paste: price_... (from Step 1, monthly product)

# Set annual price ID
npx wrangler secret put STRIPE_ANNUAL_PRICE_ID
# Paste: price_... (from Step 1, annual product)

# Optional: A/B test price IDs
npx wrangler secret put STRIPE_MONTHLY_PRICE_TEST
# Paste: price_... (test variant monthly)

npx wrangler secret put STRIPE_ANNUAL_PRICE_TEST
# Paste: price_... (test variant annual)
```

---

#### Step 4: Configure Webhook (3 min)

1. Go to https://dashboard.stripe.com/webhooks
2. Click **Add endpoint**
3. Enter endpoint URL: `https://api.nexus-alert.com/api/webhook`
4. Select events to listen for:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
   - ✅ `invoice.payment_action_required`
5. Click **Add endpoint**
6. **Copy Signing Secret** (starts with `whsec_`) ✅
7. Set secret in Cloudflare Worker:

```bash
npx wrangler secret put STRIPE_WEBHOOK_SECRET
# Paste: whsec_... (from step 6)
```

---

#### Step 5: Deploy Backend (1 min)

```bash
npx wrangler deploy
```

Wait for deployment to complete. You should see:
```
✅ Published nexus-alert-backend (X.XX sec)
   https://nexus-alert-backend.ACCOUNT.workers.dev
   https://api.nexus-alert.com
```

---

#### Step 6: Verify Production Setup (1 min)

```bash
./scripts/verify-production-setup.sh
```

**Expected output:**
```
✓ PRODUCTION READY

Passed:   12+
Warnings: 2-3 (optional features)
Failed:   0
```

If any checks fail, review the error messages and fix before proceeding.

---

## 🧪 Testing & Verification

### Test 1: Create Checkout Session

```bash
curl -X POST https://api.nexus-alert.com/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"email":"test@yourdomain.com","plan":"monthly"}'
```

**Expected response:**
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_live_..."
}
```

**Critical check:** Session ID must start with `cs_live_` (NOT `cs_test_`)

---

### Test 2: Complete End-to-End Payment

Run comprehensive E2E test:

```bash
./scripts/test-subscription-flow.sh
```

This script will:
1. ✅ Create checkout session
2. ✅ Guide you through test payment
3. ✅ Verify webhook delivery
4. ✅ Confirm license activation
5. ✅ Test subscription cancellation
6. ✅ Verify license deactivation

**Use Stripe test card in Live Mode:**
- Card: `4242 4242 4242 4242`
- Expiry: `12/28` (any future date)
- CVC: `123`
- ZIP: `12345`

---

### Test 3: Verify Webhook Delivery

1. Complete a test payment (Test 2 above)
2. Go to https://dashboard.stripe.com/webhooks
3. Click on your endpoint: `https://api.nexus-alert.com/api/webhook`
4. Check **Recent deliveries** tab
5. Find `checkout.session.completed` event

**Expected:**
- ✅ Response code: `200`
- ✅ Response time: `<1 second`
- ✅ No retry attempts
- ✅ Payload shows correct customer data

---

### Test 4: Run Automated Test Suite

```bash
cd /Users/michaelguo/nexus-alert/backend
npm test -- tests/production-payment-e2e.test.js
npm test -- tests/webhook-verification.test.js
```

These tests verify:
- ✅ API endpoints respond correctly
- ✅ Checkout sessions use live mode
- ✅ License activation works
- ✅ Webhook signature validation
- ✅ Error handling

---

## 🔍 Monitoring & Observability

### Real-time Logs

```bash
npx wrangler tail
```

Watch for:
- `[CHECKOUT]` - Checkout session created
- `[WEBHOOK]` - Webhook received
- `[LICENSE]` - License activated/deactivated
- `[ERROR]` - Any errors

---

### Stripe Dashboard Monitoring

**Key Metrics to Watch (First 24 Hours):**

1. **Webhooks → Overview**
   - Success rate: Must be 100%
   - Failed deliveries: Must be 0

2. **Payments**
   - Total revenue
   - Payment success rate (target: >95%)
   - Decline rate (target: <5%)

3. **Subscriptions**
   - Active subscriptions
   - MRR (Monthly Recurring Revenue)
   - Churn rate (target: <2%)

4. **Customers**
   - New customers today
   - Customer lifetime value

---

### Health Check Endpoints

```bash
# API health
curl https://api.nexus-alert.com/health

# License check (test customer)
curl "https://api.nexus-alert.com/api/license?email=test@yourdomain.com"
```

---

## 🚨 Troubleshooting

### Issue: Checkout session is still in test mode

**Symptom:** Session ID starts with `cs_test_`

**Fix:**
```bash
# Verify you're using live secret key
npx wrangler secret put STRIPE_SECRET_KEY
# Paste: sk_live_... (NOT sk_test_...)

# Redeploy
npx wrangler deploy
```

---

### Issue: Webhook not firing

**Symptom:** Payment succeeds but license not activated

**Debug steps:**
1. Check Stripe Dashboard → Webhooks → Recent deliveries
2. Look for failed attempts (red indicators)
3. Click failed event to see error details
4. Common causes:
   - Endpoint URL incorrect
   - Webhook secret mismatch
   - Worker not deployed
   - CORS issues

**Fix:**
```bash
# Update webhook secret
npx wrangler secret put STRIPE_WEBHOOK_SECRET
# Paste: whsec_... (from Stripe Dashboard)

# Redeploy
npx wrangler deploy
```

---

### Issue: Price ID not found

**Symptom:** Error creating checkout: "No such price"

**Fix:**
```bash
# Verify price IDs are from LIVE mode (not test mode)
npx wrangler secret put STRIPE_MONTHLY_PRICE_ID
# Paste: price_... (ensure it's from Live Mode products)

npx wrangler secret put STRIPE_ANNUAL_PRICE_ID
# Paste: price_... (ensure it's from Live Mode products)
```

---

### Issue: Worker deployment fails

**Symptom:** `wrangler deploy` returns error

**Debug:**
```bash
# Check wrangler configuration
cat wrangler.toml

# Verify KV namespace ID is set
# Should NOT be all zeros
```

**Fix:** Update KV namespace ID:
```bash
# Create production KV namespace
npx wrangler kv:namespace create NEXUS_ALERTS_KV --env production

# Copy ID from output and update wrangler.toml line 11
```

---

## 📊 Success Metrics

### Technical Success ✅
- [ ] Checkout sessions use `cs_live_` session IDs
- [ ] Webhook success rate: 100%
- [ ] API response time: <500ms p95
- [ ] No failed deployments
- [ ] All tests passing

### Business Success 💰
- [ ] First real payment processed
- [ ] Customer receives premium features
- [ ] Webhook confirmed license activation
- [ ] No support tickets for broken payments
- [ ] Stripe payout scheduled

---

## 🎯 Post-Activation Checklist

After first real payment:

- [ ] Verify customer received confirmation email
- [ ] Check extension unlocks premium features
- [ ] Monitor webhook delivery (next 24 hours)
- [ ] Set up Stripe email receipts (Settings → Emails)
- [ ] Configure revenue alerts (Stripe → Alerts)
- [ ] Add payment badges to landing page
- [ ] Update extension with "1,000+ paying customers" (aspirational)
- [ ] Set up revenue dashboard tracking

---

## 🛡️ Safety & Rollback

### Rollback to Test Mode (Emergency Only)

If production payments are failing:

```bash
# Switch back to test mode
npx wrangler secret put STRIPE_SECRET_KEY
# Paste: sk_test_... (your test key)

npx wrangler secret put STRIPE_MONTHLY_PRICE_ID
# Paste: price_... (test mode monthly price)

npx wrangler secret put STRIPE_ANNUAL_PRICE_ID
# Paste: price_... (test mode annual price)

# Redeploy
npx wrangler deploy
```

**Impact:**
- ❌ No real revenue collected
- ✅ Existing customers unaffected
- ✅ Test payments work
- ✅ Time to debug safely

**Duration:** Rollback in <2 minutes

---

## 📁 File Reference

| File | Purpose |
|------|---------|
| `scripts/stripe-production-migration.sh` | Automated setup script |
| `scripts/verify-production-setup.sh` | Health check verification |
| `scripts/test-subscription-flow.sh` | E2E subscription test |
| `tests/production-payment-e2e.test.js` | Automated payment tests |
| `tests/webhook-verification.test.js` | Webhook delivery tests |
| `STRIPE_PRODUCTION_ACTIVATION.md` | This guide |

---

## 🚀 Final Step

Once all checks pass:

```bash
./scripts/verify-production-setup.sh && echo "🎉 READY FOR REVENUE!"
```

**Expected:**
```
✓ PRODUCTION READY

🎉 READY FOR REVENUE!
```

---

## 💰 Revenue Milestone Tracker

| Milestone | Target | Date Achieved |
|-----------|--------|---------------|
| First $1 | Day 1 | __________ |
| $100 MRR | Week 1 | __________ |
| $500 MRR | Month 1 | __________ |
| $1,000 MRR | Month 2 | __________ |
| $5,000 MRR | Month 6 | __________ |
| $10,000 MRR | Year 1 | __________ |

**Annual Target:** $1M ARR = $83,333 MRR

---

**Questions?** Check troubleshooting section above or review Stripe Dashboard logs.

**Status:** Ready to activate → Run `./scripts/stripe-production-migration.sh`
