# NEXUS Alert Backend — Setup Guide

## Overview
Cloudflare Worker backend for NEXUS Alert with server-side slot checking, user registration, email/SMS notifications, and Stripe payment integration for freemium model.

**Freemium Model:**
- **Free tier:** Check every 30 minutes, email notifications only
- **Premium tier ($4.99/mo):** Check every 2 minutes, email + SMS alerts

## Prerequisites
- **Node.js 20+** with npm
- **Cloudflare account** (free tier works)
- **Wrangler CLI:** `npm install -g wrangler` and authenticate with `wrangler login`
- **Stripe account** for payment processing
- **Stripe CLI** for webhook testing: [Install guide](https://stripe.com/docs/stripe-cli)
- **Twilio account** for SMS notifications (premium tier)
- **Resend account** for email delivery (free: 100 emails/day)

## 🚀 Production Migration (Ready to Accept Payments)

**NEW:** Automated Stripe production setup and migration tools!

### Quick Production Setup (15 minutes)

```bash
cd backend

# Option 1: Automated migration (Recommended)
./scripts/stripe-production-migration.sh

# Option 2: Verify existing setup
./scripts/verify-production-setup.sh
```

**What This Does:**
- ✓ Switches Stripe from test to live mode
- ✓ Creates production price IDs (monthly $4.99 + annual $49.99)
- ✓ Updates Cloudflare Worker secrets
- ✓ Deploys backend with live credentials
- ✓ Tests end-to-end payment flow

**Documentation:**
- **Quick Reference:** [STRIPE_PRODUCTION_QUICK_REF.md](STRIPE_PRODUCTION_QUICK_REF.md) — One-page cheat sheet
- **Full Guide:** [STRIPE_PRODUCTION_MIGRATION.md](STRIPE_PRODUCTION_MIGRATION.md) — Comprehensive walkthrough
- **Summary:** [STRIPE_PRODUCTION_COMPLETION_SUMMARY.md](STRIPE_PRODUCTION_COMPLETION_SUMMARY.md) — What's included

---

## Quick Deploy (Development/Testing)

### Step 1: Install dependencies
```bash
cd backend
npm install
```

### Step 2: Run the deployment script
```bash
bash deploy.sh
```

The script will:
1. Create the KV namespace and patch `wrangler.toml` with the ID
2. Prompt you to set all required secrets (see below for values)
3. Deploy the worker to Cloudflare

### Step 3: Configure external services (see sections below)
- Set up Stripe Product, Price, and Webhook
- Set up Resend API key and verify domain
- Set up Twilio account and phone number (premium tier)

## External Service Setup

### Stripe Setup

**🚀 For Production:** Use the [automated migration script](#-production-migration-ready-to-accept-payments) instead!

**For Development/Testing:**

1. **Create Product and Price**
   - Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
   - Toggle to **Test Mode** (top-right)
   - Click "Add Product"
   - Name: "NEXUS Alert Premium"
   - Pricing model: **Recurring**
   - Price: **$4.99/month**
   - Click "Save product"
   - Copy the **Price ID** (starts with `price_...`)

2. **Configure Webhook Endpoint**
   - Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
   - Click "Add endpoint"
   - Endpoint URL: `https://nexus-alert-backend.<your-account>.workers.dev/api/webhook`
     - (Or use your custom domain: `https://api.nexus-alert.com/api/webhook`)
   - Select events to listen to:
     - ✓ `checkout.session.completed`
     - ✓ `customer.subscription.deleted`
     - ✓ `customer.subscription.updated`
     - ✓ `invoice.payment_succeeded`
     - ✓ `invoice.payment_failed`
   - Click "Add endpoint"
   - Copy the **Webhook signing secret** (starts with `whsec_...`)

3. **Set Stripe secrets**
   ```bash
   # For monthly/annual pricing (current model)
   npx wrangler secret put STRIPE_SECRET_KEY
   # Paste your secret key from https://dashboard.stripe.com/apikeys (starts with sk_test_ for testing)

   npx wrangler secret put STRIPE_MONTHLY_PRICE_ID
   # Paste the monthly Price ID ($4.99/month)

   npx wrangler secret put STRIPE_ANNUAL_PRICE_ID
   # Paste the annual Price ID ($49.99/year)

   npx wrangler secret put STRIPE_WEBHOOK_SECRET
   # Paste the webhook signing secret from step 2
   ```

### Resend Setup

1. **Verify Domain**
   - Go to [Resend Dashboard → Domains](https://resend.com/domains)
   - Add your domain (e.g., `nexus-alert.com`)
   - Add the DNS records (SPF, DKIM, DMARC) to your DNS provider
   - Wait for verification (usually <5 minutes)

2. **Create API Key**
   - Go to [Resend Dashboard → API Keys](https://resend.com/api-keys)
   - Click "Create API Key"
   - Name: "NEXUS Alert Backend"
   - Permission: **Sending access**
   - Click "Create"
   - Copy the API key (starts with `re_...`)

3. **Set Resend secret**
   ```bash
   npx wrangler secret put RESEND_API_KEY
   # Paste your Resend API key
   ```

### Twilio Setup (Premium Tier Only)

1. **Create Account**
   - Sign up at [Twilio](https://www.twilio.com/try-twilio)
   - Verify your phone number
   - Complete the onboarding

2. **Get a Phone Number**
   - Go to [Phone Numbers → Buy a Number](https://console.twilio.com/us1/develop/phone-numbers/manage/search)
   - Select country: United States
   - Capabilities: ✓ SMS
   - Buy a number (~$1/month)
   - Copy the phone number in **E.164 format** (e.g., `+12345678900`)

3. **Get API Credentials**
   - Go to [Console Dashboard](https://console.twilio.com/)
   - Copy **Account SID** (starts with `AC...`)
   - Copy **Auth Token** (click "View" to reveal)

4. **Set Twilio secrets**
   ```bash
   npx wrangler secret put TWILIO_ACCOUNT_SID
   # Paste your Account SID

   npx wrangler secret put TWILIO_AUTH_TOKEN
   # Paste your Auth Token

   npx wrangler secret put TWILIO_FROM_NUMBER
   # Paste your phone number in E.164 format (e.g., +12345678900)
   ```

### Other Secrets

Set a strong webhook secret for API authentication:
```bash
npx wrangler secret put WEBHOOK_SECRET
# Enter a random string (e.g., generate with: openssl rand -hex 32)
```

## Local Development

### Run the worker locally
```bash
npm run dev
```

### Test scheduled cron triggers
```bash
wrangler dev --test-scheduled
```
Then trigger manually:
```bash
curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"
```

### Test Stripe webhooks locally
1. Start the Stripe CLI listener:
   ```bash
   stripe listen --forward-to localhost:8787/api/webhook
   ```
2. Copy the webhook signing secret from the output
3. Set it temporarily in your local environment

## API Reference

All endpoints require `Authorization: Bearer <WEBHOOK_SECRET>` header.

### GET `/api/license?email=<email>`
Check user's subscription tier.

**Response:**
```json
{
  "tier": "free" | "premium",
  "email": "user@example.com",
  "stripeCustomerId": "cus_...", // premium only
  "stripeSubscriptionId": "sub_..." // premium only
}
```

### POST `/api/subscribe`
Register or update a user's monitoring preferences.

**Request:**
```json
{
  "email": "you@example.com",
  "locations": [5020],
  "program": "NEXUS",
  "dateRange": { "start": null, "end": null },
  "timeRange": { "start": "08:00", "end": "17:00" }
}
```

### POST `/api/unsubscribe`
Unsubscribe a user from all alerts.

**Request:**
```json
{
  "email": "you@example.com"
}
```

### GET `/api/status`
Get worker status and metrics.

### POST `/api/check`
Manually trigger slot checking for all subscribers.

### POST `/api/webhook`
Stripe webhook endpoint (handles `checkout.session.completed`, `customer.subscription.deleted`).

## Architecture

```
┌─────────────────┐
│ Chrome Extension│
│    (Frontend)   │
└────────┬────────┘
         │
         │ HTTPS
         │
         ▼
┌─────────────────────────────────────────┐
│      Cloudflare Worker (Backend)        │
│  ┌─────────────────────────────────┐   │
│  │  HTTP Handlers                  │   │
│  │  - /api/subscribe               │   │
│  │  - /api/unsubscribe             │   │
│  │  - /api/license                 │   │
│  │  - /api/webhook (Stripe)        │   │
│  └─────────────┬───────────────────┘   │
│                │                         │
│  ┌─────────────▼───────────────────┐   │
│  │  Scheduled Handler (Cron)       │   │
│  │  - Runs every 2 min (premium)   │   │
│  │  - Runs every 30 min (free)     │   │
│  │  - Fetches CBP slots            │   │
│  │  - Filters by preferences       │   │
│  │  - Sends notifications          │   │
│  └─────────────┬───────────────────┘   │
│                │                         │
│  ┌─────────────▼───────────────────┐   │
│  │  KV Store (NEXUS_ALERTS_KV)     │   │
│  │  - User subscriptions           │   │
│  │  - Notification history         │   │
│  │  - Stripe customer data         │   │
│  └─────────────────────────────────┘   │
└───────────┬─────────────────────────────┘
            │
            ├─────────────────────┐
            │                     │
            ▼                     ▼
    ┌──────────────┐      ┌─────────────┐
    │    Resend    │      │   Twilio    │
    │   (Email)    │      │   (SMS)     │
    └──────────────┘      └─────────────┘
                                  │
                                  │ Webhooks
                                  ▼
                          ┌──────────────┐
                          │    Stripe    │
                          │  (Payments)  │
                          └──────────────┘
```

## How It Works

1. **Subscription Management**
   - Extension calls `/api/subscribe` with user preferences
   - Worker stores config in KV with tier info

2. **Scheduled Monitoring**
   - Cron trigger fires every 2 minutes (premium) or 30 minutes (free)
   - Worker fetches all active subscriptions from KV
   - Groups by tier and checks CBP API for available slots
   - Filters slots by each user's date/time/location preferences
   - Deduplicates against previously sent notifications

3. **Notifications**
   - **Free tier:** Email via Resend
   - **Premium tier:** Email via Resend + SMS via Twilio
   - Updates KV with notification history to prevent duplicates

4. **Payment Processing**
   - Extension redirects to Stripe Checkout for upgrades
   - `checkout.session.completed` webhook updates user to premium tier
   - `customer.subscription.deleted` webhook downgrades user to free tier

## Verification

After deploying, verify everything works:

```bash
# Check license endpoint (should return free tier)
curl https://nexus-alert-backend.<your-account>.workers.dev/api/license?email=test@test.com

# Expected response:
# {"tier":"free"}
```

Check the Cloudflare dashboard for:
- ✓ Worker deployed successfully
- ✓ KV namespace created and bound
- ✓ Cron trigger scheduled (*/2 * * * *)
- ✓ All secrets set (8 total)

## Costs

- **Cloudflare Workers:** Free tier (100,000 requests/day)
- **Cloudflare KV:** Free tier (100,000 reads/day, 1,000 writes/day)
- **Resend:** Free tier (100 emails/day, 3,000/month) → $0/mo for personal use
- **Twilio SMS:** ~$0.0079/message (USA) → ~$0.79 for 100 messages
- **Stripe:** 2.9% + $0.30 per transaction → $0.44 per $4.99 subscription

**Total for personal use (free tier):** $0/month
**Total for 100 premium subscribers:** $499/month revenue - $44 Stripe fees - ~$80 Twilio = **~$375/month profit**

## Production Deployment

For complete production setup with custom domain and all secrets:

📋 **[PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)** - Step-by-step deployment checklist

📖 **[PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)** - Comprehensive deployment guide

🌐 **[DNS_SETUP.md](./DNS_SETUP.md)** - Custom domain configuration

### Quick Production Deploy

```bash
# 1. Login to Cloudflare
npx wrangler login

# 2. Create production KV namespace
npx wrangler kv:namespace create NEXUS_ALERTS_KV --env production

# 3. Copy namespace ID from output and update wrangler.toml
# Edit: [env.production.kv_namespaces] → id = "YOUR_NAMESPACE_ID"

# 4. Set all secrets
./scripts/setup-production-secrets.sh

# 5. Deploy to production
npm run deploy -- --env production

# 6. Add custom domain (via Cloudflare Dashboard)
# Workers → nexus-alert-backend → Triggers → Add Custom Domain
# → api.nexus-alert.com

# 7. Verify deployment
curl https://api.nexus-alert.com/api/status
```

### Production Environment

The production environment includes:
- Custom domain: `api.nexus-alert.com`
- Environment: `production`
- Cron: Every 2 minutes (`*/2 * * * *`)
- Separate KV namespace for production data
- All secrets managed via `wrangler secret put --env production`

### Production Secrets

Set these via the helper script or manually:

```bash
npx wrangler secret put STRIPE_SECRET_KEY --env production
npx wrangler secret put STRIPE_WEBHOOK_SECRET --env production
npx wrangler secret put STRIPE_PRICE_ID --env production
npx wrangler secret put RESEND_API_KEY --env production
npx wrangler secret put TWILIO_ACCOUNT_SID --env production
npx wrangler secret put TWILIO_AUTH_TOKEN --env production
npx wrangler secret put TWILIO_FROM_NUMBER --env production
npx wrangler secret put WEBHOOK_SECRET --env production
```

### Production Monitoring

```bash
# Real-time logs
npx wrangler tail --env production --format pretty

# View deployments
npx wrangler deployments list --env production

# Rollback if needed
npx wrangler rollback --env production

# Check KV data
npx wrangler kv:key list --binding=NEXUS_ALERTS_KV --env production --preview false
```

### Production URLs

- **API Base:** https://api.nexus-alert.com
- **Status Check:** https://api.nexus-alert.com/api/status
- **Stripe Webhook:** https://api.nexus-alert.com/api/webhooks/stripe

### Security Checklist

- [ ] All secrets set via `wrangler secret put` (not in code)
- [ ] Stripe webhook signature verification enabled
- [ ] Custom domain has SSL certificate
- [ ] CORS configured for production Chrome extension origin
- [ ] Rate limiting enabled on critical endpoints
- [ ] Cloudflare WAF rules configured
- [ ] Monitoring and alerts set up

### Post-Deployment

After deploying to production:
1. Update Chrome extension to use `https://api.nexus-alert.com`
2. Configure Stripe webhook to point to production URL
3. Test full payment flow end-to-end
4. Monitor logs for 24 hours
5. Set up uptime monitoring (e.g., UptimeRobot)
