# Production Deployment Checklist

Use this checklist to ensure all steps are completed for production deployment.

## Pre-Deployment

- [ ] Cloudflare account created and Workers enabled
- [ ] Stripe account set up with live mode API keys
- [ ] Resend.com account created with verified domain
- [ ] Twilio account created with phone number purchased
- [ ] Domain `nexus-alert.com` added to Cloudflare DNS
- [ ] All API keys and secrets gathered

## Authentication & Setup

- [ ] Run `npx wrangler login` and complete OAuth
- [ ] Verify login: `npx wrangler whoami`

## KV Namespace Creation

- [ ] Run: `npx wrangler kv:namespace create NEXUS_ALERTS_KV --env production`
- [ ] Copy namespace ID from output
- [ ] Update `wrangler.toml` with production namespace ID
- [ ] Commit updated `wrangler.toml`

## Secrets Configuration

**Option 1: Use Helper Script (Recommended)**
- [ ] Run: `./scripts/setup-production-secrets.sh`
- [ ] Follow prompts and paste each secret when requested
- [ ] Save the generated WEBHOOK_SECRET securely

**Option 2: Manual Setup**
- [ ] Set STRIPE_SECRET_KEY: `npx wrangler secret put STRIPE_SECRET_KEY --env production`
- [ ] Set STRIPE_WEBHOOK_SECRET: `npx wrangler secret put STRIPE_WEBHOOK_SECRET --env production`
- [ ] Set STRIPE_PRICE_ID: `npx wrangler secret put STRIPE_PRICE_ID --env production`
- [ ] Set RESEND_API_KEY: `npx wrangler secret put RESEND_API_KEY --env production`
- [ ] Set TWILIO_ACCOUNT_SID: `npx wrangler secret put TWILIO_ACCOUNT_SID --env production`
- [ ] Set TWILIO_AUTH_TOKEN: `npx wrangler secret put TWILIO_AUTH_TOKEN --env production`
- [ ] Set TWILIO_FROM_NUMBER: `npx wrangler secret put TWILIO_FROM_NUMBER --env production`
- [ ] Set WEBHOOK_SECRET: `npx wrangler secret put WEBHOOK_SECRET --env production`

**Verification**
- [ ] Verify all secrets: `npx wrangler secret list --env production`
- [ ] Should see 8 secrets listed

## Deployment

- [ ] Ensure `backend/src/worker.js` exists and is complete
- [ ] Run tests: `npm test` (all passing)
- [ ] Deploy: `npm run deploy -- --env production`
- [ ] Note the deployed Workers URL from output
- [ ] Test Workers URL: `curl https://nexus-alert-backend.YOURSUBDOMAIN.workers.dev/api/status`

## Custom Domain Setup

**Via Cloudflare Dashboard**
- [ ] Navigate to Workers & Pages → nexus-alert-backend → Triggers
- [ ] Click "Add Custom Domain"
- [ ] Enter: `api.nexus-alert.com`
- [ ] Wait for SSL certificate provisioning (1-5 minutes)
- [ ] Verify DNS: `dig api.nexus-alert.com`
- [ ] Test custom domain: `curl https://api.nexus-alert.com/api/status`

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-18T12:00:00Z"
}
```

## Cron Verification

- [ ] Go to Cloudflare Dashboard → Workers → nexus-alert-backend → Triggers
- [ ] Verify "Cron Triggers" shows: `*/2 * * * *`
- [ ] Wait 2 minutes and check "Past Cron Invocations"
- [ ] Watch real-time logs: `npx wrangler tail --env production`
- [ ] Confirm cron fires every 2 minutes

## Stripe Webhook Configuration

- [ ] Go to Stripe Dashboard → Developers → Webhooks
- [ ] Click "Add endpoint"
- [ ] Endpoint URL: `https://api.nexus-alert.com/api/webhooks/stripe`
- [ ] Select events:
  - [ ] `checkout.session.completed`
  - [ ] `customer.subscription.deleted`
  - [ ] `customer.subscription.updated`
- [ ] Copy signing secret (starts with `whsec_`)
- [ ] Verify STRIPE_WEBHOOK_SECRET matches (or update it)
- [ ] Save webhook endpoint

## End-to-End Testing

**Test Status Endpoint**
- [ ] `curl https://api.nexus-alert.com/api/status` returns 200 OK

**Test User Registration**
```bash
curl -X POST https://api.nexus-alert.com/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "tier": "free",
    "locations": [5140]
  }'
```
- [ ] Returns success response with user data
- [ ] Verify in KV: `npx wrangler kv:key get "user:test@example.com" --binding=NEXUS_ALERTS_KV --env production --preview false`

**Test Stripe Checkout**
```bash
curl -X POST https://api.nexus-alert.com/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "priceId": "YOUR_STRIPE_PRICE_ID"
  }'
```
- [ ] Returns checkout session URL
- [ ] Complete test checkout in browser
- [ ] Verify webhook fires in Stripe Dashboard → Webhooks → Recent Deliveries
- [ ] Verify user upgraded in KV storage

**Test Slot Checking**
- [ ] Monitor logs during cron run: `npx wrangler tail --env production`
- [ ] Verify appointment checking logic executes
- [ ] Check for any errors or warnings

## Monitoring & Alerts

- [ ] Set up Cloudflare Analytics alerts for error rates
- [ ] Configure log retention settings
- [ ] Set up external uptime monitoring (e.g., UptimeRobot, Pingdom)
- [ ] Create runbook for incident response
- [ ] Document rollback procedure

## Documentation Updates

- [ ] Update Chrome extension to use `https://api.nexus-alert.com`
- [ ] Update landing page API endpoint
- [ ] Update README with production deployment info
- [ ] Document environment variables in .env.example
- [ ] Create architecture diagram showing production setup

## Security Audit

- [ ] All secrets stored via `wrangler secret put` (not in code)
- [ ] No hardcoded API keys in repository
- [ ] CORS configured properly for production domain
- [ ] Rate limiting implemented on critical endpoints
- [ ] Stripe in live mode (not test mode)
- [ ] SSL certificate valid on custom domain
- [ ] Webhook signature verification enabled

## Performance Validation

- [ ] Test API response times under load
- [ ] Verify KV read/write latency is acceptable
- [ ] Check cron execution doesn't timeout
- [ ] Monitor cold start times
- [ ] Optimize bundle size if needed

## Legal & Compliance

- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Cookie consent implemented (if applicable)
- [ ] GDPR compliance reviewed (if serving EU users)
- [ ] Data retention policy documented

## Post-Deployment

- [ ] Announce production launch to users
- [ ] Monitor error rates for first 24 hours
- [ ] Set up weekly KV backup script
- [ ] Schedule monthly security review
- [ ] Plan capacity scaling strategy
- [ ] Document lessons learned

---

## Quick Commands Reference

```bash
# Login
npx wrangler login

# Create KV namespace
npx wrangler kv:namespace create NEXUS_ALERTS_KV --env production

# Set a secret
npx wrangler secret put SECRET_NAME --env production

# List all secrets
npx wrangler secret list --env production

# Deploy
npm run deploy -- --env production

# View logs
npx wrangler tail --env production

# List KV keys
npx wrangler kv:key list --binding=NEXUS_ALERTS_KV --env production --preview false

# Get KV value
npx wrangler kv:key get "KEY" --binding=NEXUS_ALERTS_KV --env production --preview false

# Rollback
npx wrangler rollback --env production
```

---

**Status:** 🔴 Not Started | 🟡 In Progress | 🟢 Complete

Mark sections complete as you go!
