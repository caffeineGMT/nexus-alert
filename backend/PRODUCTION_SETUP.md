# Production Setup — Quick Start Guide

This guide gets you from development to production in 30 minutes.

---

## Prerequisites

- [ ] Stripe account with Live Mode access
- [ ] Cloudflare account with Workers enabled
- [ ] Resend.com account (email notifications)
- [ ] (Optional) Twilio account (SMS notifications)

---

## 1. Configure Stripe Live Mode (10 minutes)

### Switch to Live Mode
1. Open [Stripe Dashboard](https://dashboard.stripe.com)
2. Toggle to **Live Mode** (top right)
3. Complete account verification if needed

### Create Product & Price
1. **Products** → **Add Product**
   - Name: `NEXUS Alert Premium`
   - Price: `$4.99 USD/month` (recurring)
2. **Copy Price ID:** `price_________________`

### Get API Keys
1. **Developers** → **API Keys**
2. **Copy Secret Key:** `sk_live_________________`

### Configure Webhook
1. **Developers** → **Webhooks** → **Add endpoint**
2. URL: `https://api.nexus-alert.com/api/webhook`
3. Events: `checkout.session.completed`, `customer.subscription.deleted`
4. **Copy Signing Secret:** `whsec_________________`

---

## 2. Set Up Third-Party Services (5 minutes)

### Resend (Email)
1. Sign up: https://resend.com
2. Verify domain: `nexus-alert.com`
3. **Copy API Key:** `re_________________`

### Twilio (SMS — Optional)
1. Sign up: https://twilio.com
2. Purchase phone number
3. **Copy credentials:**
   - Account SID: `AC________________`
   - Auth Token: `________________`
   - Phone: `+1__________`

---

## 3. Deploy Backend (10 minutes)

### Install Dependencies
```bash
cd /Users/michaelguo/nexus-alert/backend
npm install
```

### Create KV Namespace
```bash
npx wrangler kv:namespace create NEXUS_ALERTS_KV
```

**Copy the namespace ID** and update `wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "NEXUS_ALERTS_KV"
id = "YOUR_KV_ID_HERE"  # Replace this
```

### Set Production Secrets
```bash
# Stripe
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_PRICE_ID
npx wrangler secret put STRIPE_WEBHOOK_SECRET

# Email
npx wrangler secret put RESEND_API_KEY

# Security (generate: openssl rand -hex 32)
npx wrangler secret put WEBHOOK_SECRET

# SMS (optional)
npx wrangler secret put TWILIO_ACCOUNT_SID
npx wrangler secret put TWILIO_AUTH_TOKEN
npx wrangler secret put TWILIO_FROM_NUMBER
```

### Deploy
```bash
npm run deploy
```

### Configure Custom Domain
1. Cloudflare Dashboard → Select worker
2. **Settings** → **Triggers** → **Custom Domains**
3. Add: `api.nexus-alert.com`

---

## 4. Test Payment Flow (5 minutes)

### Automated Test
```bash
./test-payment-flow.sh
```

Follow prompts to complete test checkout with:
- Card: `4242 4242 4242 4242`
- Expiry: `12/28`
- CVC: `123`

### Manual Verification
```bash
# 1. Create checkout
curl -X POST https://api.nexus-alert.com/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 2. Complete payment in browser

# 3. Verify license
curl "https://api.nexus-alert.com/api/license?email=test@example.com"
# Should return: {"tier":"premium"}
```

---

## 5. Monitor Production

### Real-Time Dashboard
```bash
export STRIPE_API_KEY=sk_live_XXXXXX
./monitoring-dashboard.sh
```

### View Logs
```bash
npx wrangler tail
```

### Check Webhooks
https://dashboard.stripe.com/webhooks

---

## Files Reference

| File | Purpose |
|------|---------|
| `PRODUCTION_DEPLOYMENT.md` | Comprehensive deployment guide (all details) |
| `DEPLOYMENT_CHECKLIST.md` | Step-by-step checklist with checkboxes |
| `PRODUCTION_SETUP.md` | This file — quick start (30 min) |
| `production.env.template` | Environment variable template |
| `test-payment-flow.sh` | Automated payment testing script |
| `monitoring-dashboard.sh` | Real-time monitoring dashboard |
| `deploy.sh` | Legacy deployment script (use `npm run deploy` instead) |

---

## Common Issues

### Webhook Not Firing
```bash
# Test manually
stripe trigger checkout.session.completed

# Check Cloudflare logs
npx wrangler tail
```

### Polling Interval Not Changing
```bash
# Verify license
curl "https://api.nexus-alert.com/api/license?email=USER_EMAIL"

# Check extension console (chrome://extensions/)
```

### Email Not Sending
```bash
# Verify Resend API key
npx wrangler secret list | grep RESEND

# Check Resend dashboard
# https://resend.com/emails
```

---

## Success!

Once deployed, you're ready to accept paying customers.

**First 48 Hours:**
- Monitor dashboard continuously
- Check webhook success rate (should be 100%)
- Verify first real payment works end-to-end

**Next Steps:**
1. Submit extension to Chrome Web Store
2. Launch marketing campaign
3. Monitor metrics daily
4. Respond to user feedback

---

## Emergency Support

- **Stripe:** https://support.stripe.com
- **Cloudflare:** https://dash.cloudflare.com/support
- **Resend:** support@resend.com
- **Twilio:** https://www.twilio.com/help

---

**Target:** $1M ARR within 24 months
**First Milestone:** $500 MRR in Month 1

You've got this! 🚀
