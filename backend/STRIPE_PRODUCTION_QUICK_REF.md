# Stripe Production Migration — Quick Reference Card

**⏱️ Time:** 15-20 minutes | **🎯 Goal:** Enable real payment processing

---

## 🚀 Fastest Path (Automated)

```bash
cd /Users/michaelguo/nexus-alert/backend
./scripts/stripe-production-migration.sh
```

Follow the prompts. Done!

---

## 📋 Manual Steps (5-Step Checklist)

### ✅ Step 1: Create Stripe Products (5 min)

**Dashboard:** https://dashboard.stripe.com

1. Toggle to **Live Mode** (top-right)
2. **Products** → **Create Product**

**Product 1:** NEXUS Alert Premium Monthly
- Price: **$4.99/month** (recurring)
- Copy Price ID: `price_________________`

**Product 2:** NEXUS Alert Premium Annual
- Price: **$49.99/year** (recurring)
- Copy Price ID: `price_________________`

---

### ✅ Step 2: Get Live API Key (2 min)

**Dashboard:** https://dashboard.stripe.com/apikeys

1. In **Live Mode**, reveal **Secret key**
2. Copy: `sk_live_________________`

---

### ✅ Step 3: Update Worker Secrets (3 min)

```bash
# Required
echo "sk_live_XXXXX" | wrangler secret put STRIPE_SECRET_KEY
echo "price_XXXXX" | wrangler secret put STRIPE_MONTHLY_PRICE_ID
echo "price_XXXXX" | wrangler secret put STRIPE_ANNUAL_PRICE_ID
```

---

### ✅ Step 4: Configure Webhook (3 min)

**Dashboard:** https://dashboard.stripe.com/webhooks

1. **Add endpoint** → URL: `https://api.nexus-alert.com/api/webhook`
2. Select events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
3. Copy signing secret: `whsec_________________`

```bash
echo "whsec_XXXXX" | wrangler secret put STRIPE_WEBHOOK_SECRET
```

---

### ✅ Step 5: Deploy & Test (2 min)

```bash
# Deploy
wrangler deploy

# Test
curl -X POST https://api.nexus-alert.com/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","plan":"monthly"}'
```

Open checkout URL → Use test card: **4242 4242 4242 4242**

---

## 🔍 Verification

```bash
./scripts/verify-production-setup.sh
```

**Must Pass:**
- ✓ All secrets configured
- ✓ Worker deployed (HTTP 200)
- ✓ Checkout creates live sessions (not `cs_test_`)
- ✓ Webhook configured

---

## 🧪 Test Cards (Live Mode Only)

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | ✅ Success |
| `4000 0000 0000 0002` | ❌ Decline |

**Expiry:** Any future date (e.g., 12/28)
**CVC:** Any 3 digits (e.g., 123)

⚠️ **Live mode = real charges!** Test carefully.

---

## 🐛 Troubleshooting

### Checkout URL starts with `cs_test_`

**Fix:** Using test key instead of live key
```bash
# Verify key starts with sk_live_
wrangler secret list
```

### Webhook not firing

**Check:** Stripe Dashboard → Webhooks → Attempts
**Fix:** Verify URL and events selected

### "Price ID not configured" error

**Fix:** Set monthly/annual price IDs
```bash
wrangler secret put STRIPE_MONTHLY_PRICE_ID
wrangler secret put STRIPE_ANNUAL_PRICE_ID
```

---

## 📊 Post-Launch Monitoring

**First 48 Hours:**

```bash
# Watch logs
wrangler tail

# Monitor webhooks
# https://dashboard.stripe.com/webhooks

# Check payments
# https://dashboard.stripe.com/payments
```

**Key Metrics:**
- Webhook success rate: 100%
- Payment success rate: >95%
- License activation: <30 sec

---

## 🆘 Emergency Rollback

```bash
# Revert to test mode (breaks real payments!)
echo "sk_test_XXXXX" | wrangler secret put STRIPE_SECRET_KEY
wrangler deploy
```

---

## 📚 Full Documentation

- **Detailed Guide:** `STRIPE_PRODUCTION_MIGRATION.md`
- **Verification:** `./scripts/verify-production-setup.sh`
- **Interactive:** `./scripts/stripe-production-migration.sh`

---

## ✅ Launch Checklist

Before accepting real customers:

- [ ] Stripe in Live Mode
- [ ] Products created (monthly + annual)
- [ ] Price IDs configured in Worker
- [ ] Live secret key set
- [ ] Webhook configured with signing secret
- [ ] Backend deployed
- [ ] Test payment completed successfully
- [ ] Webhook received event (200 status)
- [ ] Verification script passes

---

**Status:** 🟢 Ready to accept paying customers

**Revenue Target:** $1M ARR | **First Goal:** $500 MRR Month 1

🚀 Let's go!
