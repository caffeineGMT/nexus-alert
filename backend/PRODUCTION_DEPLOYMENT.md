# Production Deployment Guide

This guide walks through setting up the production environment for NEXUS Alert backend on Cloudflare Workers.

## Prerequisites

- Cloudflare account with Workers enabled
- Stripe account with API keys
- Resend.com account with API key
- Twilio account with phone number, SID, and auth token
- Domain `nexus-alert.com` configured in Cloudflare

## Step 1: Authenticate with Cloudflare

```bash
cd backend
npx wrangler login
```

This will open a browser window for OAuth authentication with Cloudflare.

## Step 2: Create Production KV Namespace

```bash
npx wrangler kv:namespace create NEXUS_ALERTS_KV --env production
```

**Expected output:**
```
🌀 Creating namespace with title "nexus-alert-backend-NEXUS_ALERTS_KV-production"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "NEXUS_ALERTS_KV", id = "abc123..." }
```

**Copy the namespace ID from the output** and update `wrangler.toml` (see Step 3).

## Step 3: Update wrangler.toml

Update the `[env.production.kv_namespaces]` section with the namespace ID from Step 2:

```toml
[env.production]
[[env.production.kv_namespaces]]
binding = "NEXUS_ALERTS_KV"
id = "YOUR_PRODUCTION_NAMESPACE_ID_HERE"  # Replace with ID from Step 2
```

## Step 4: Set Production Secrets

Run each command below and paste the corresponding value when prompted:

### Stripe Secrets
```bash
npx wrangler secret put STRIPE_SECRET_KEY --env production
# Paste your Stripe secret key (starts with sk_live_...)

npx wrangler secret put STRIPE_WEBHOOK_SECRET --env production
# Paste your Stripe webhook signing secret (starts with whsec_...)

npx wrangler secret put STRIPE_PRICE_ID --env production
# Paste your Stripe price ID for the premium tier (starts with price_...)
```

### Email Notifications (Resend)
```bash
npx wrangler secret put RESEND_API_KEY --env production
# Paste your Resend.com API key (starts with re_...)
```

### SMS Notifications (Twilio)
```bash
npx wrangler secret put TWILIO_ACCOUNT_SID --env production
# Paste your Twilio Account SID (starts with AC...)

npx wrangler secret put TWILIO_AUTH_TOKEN --env production
# Paste your Twilio Auth Token

npx wrangler secret put TWILIO_FROM_NUMBER --env production
# Paste your Twilio phone number in E.164 format (e.g., +15551234567)
```

### Internal API Security
```bash
npx wrangler secret put WEBHOOK_SECRET --env production
# Paste a secure random string for webhook authentication
# Generate one with: openssl rand -hex 32
```

## Step 5: Deploy to Production

```bash
npm run deploy -- --env production
```

**Expected output:**
```
✨ Built successfully
⛅️ wrangler 3.x.x
-------------------------------------------------------
Total Upload: xxx KiB / gzip: xxx KiB
Uploaded nexus-alert-backend (x.xx sec)
Published nexus-alert-backend (x.xx sec)
  https://nexus-alert-backend.YOURSUBDOMAIN.workers.dev
```

Note the deployed URL for testing in Step 7.

## Step 6: Configure Custom Domain

### Via Cloudflare Dashboard:
1. Go to **Workers & Pages** → **nexus-alert-backend** → **Triggers**
2. Click **Add Custom Domain**
3. Enter: `api.nexus-alert.com`
4. Click **Add Custom Domain**

Cloudflare will automatically create the necessary DNS records and provision an SSL certificate.

### Verify DNS:
```bash
dig api.nexus-alert.com
# Should show CNAME or A record pointing to Cloudflare Workers
```

## Step 7: Verify Deployment

### Check Status Endpoint
```bash
curl https://api.nexus-alert.com/api/status
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-18T12:00:00Z"
}
```

### Verify Cron Schedule
1. Go to **Cloudflare Dashboard** → **Workers & Pages** → **nexus-alert-backend**
2. Click **Triggers** tab
3. Verify **Cron Triggers** shows: `*/2 * * * *` (every 2 minutes)
4. Check **Past Cron Invocations** to see recent runs

### Check Logs
```bash
npx wrangler tail --env production
```

Wait 2 minutes to see the cron trigger fire and watch the logs in real-time.

## Step 8: Configure Stripe Webhook

1. Go to **Stripe Dashboard** → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://api.nexus-alert.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Update the secret (if different from Step 4):
   ```bash
   npx wrangler secret put STRIPE_WEBHOOK_SECRET --env production
   ```

## Step 9: Test Premium Flow End-to-End

### Create Test Payment
```bash
curl -X POST https://api.nexus-alert.com/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "priceId": "YOUR_STRIPE_PRICE_ID"
  }'
```

**Expected response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

### Verify User Registration
After completing Stripe checkout, verify the user was created:
```bash
npx wrangler kv:key get "user:test@example.com" --binding=NEXUS_ALERTS_KV --env production --preview false
```

## Step 10: Monitor Production

### View Real-time Logs
```bash
npx wrangler tail --env production --format pretty
```

### Check KV Storage
```bash
# List all keys
npx wrangler kv:key list --binding=NEXUS_ALERTS_KV --env production --preview false

# Get specific user
npx wrangler kv:key get "user:EMAIL" --binding=NEXUS_ALERTS_KV --env production --preview false
```

### Analytics
View analytics in Cloudflare Dashboard:
- **Workers & Pages** → **nexus-alert-backend** → **Analytics**
- Monitor: requests, errors, CPU time, duration

## Rollback Procedure

If deployment fails or issues arise:

```bash
# View deployment history
npx wrangler deployments list --env production

# Rollback to previous deployment
npx wrangler rollback --env production
```

## Environment Variables Summary

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `STRIPE_SECRET_KEY` | Secret | Stripe API secret key | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Secret | Stripe webhook signing secret | `whsec_...` |
| `STRIPE_PRICE_ID` | Secret | Stripe price ID for premium tier | `price_...` |
| `RESEND_API_KEY` | Secret | Resend.com API key for emails | `re_...` |
| `TWILIO_ACCOUNT_SID` | Secret | Twilio account SID | `AC...` |
| `TWILIO_AUTH_TOKEN` | Secret | Twilio authentication token | (secret) |
| `TWILIO_FROM_NUMBER` | Secret | Twilio phone number | `+15551234567` |
| `WEBHOOK_SECRET` | Secret | Internal API auth secret | (random hex string) |

## Troubleshooting

### Issue: "You are not authenticated"
**Solution:** Run `npx wrangler login` and complete OAuth flow

### Issue: Cron not firing
**Solution:**
- Check Cloudflare Dashboard → Workers → Triggers → Cron Triggers
- Verify cron syntax in `wrangler.toml`
- Check logs with `npx wrangler tail --env production`

### Issue: Stripe webhook failing
**Solution:**
- Verify webhook secret matches Stripe Dashboard
- Check webhook URL is exactly: `https://api.nexus-alert.com/api/webhooks/stripe`
- Review Stripe Dashboard → Webhooks → Recent deliveries for error details

### Issue: KV namespace not found
**Solution:**
- Verify namespace ID in `wrangler.toml` matches output from Step 2
- Run `npx wrangler kv:namespace list` to see all namespaces
- Ensure `--env production` flag is included in all commands

### Issue: Custom domain not resolving
**Solution:**
- Wait 5-10 minutes for DNS propagation
- Verify domain is added in Cloudflare Dashboard → Workers → Triggers
- Check DNS: `dig api.nexus-alert.com`
- Ensure domain is on Cloudflare DNS (not external nameservers)

## Security Checklist

- [ ] All secrets set via `wrangler secret put` (not in `wrangler.toml`)
- [ ] Stripe webhook secret configured and matching Stripe Dashboard
- [ ] WEBHOOK_SECRET is a cryptographically random string (32+ bytes)
- [ ] Custom domain has SSL certificate (automatically provisioned by Cloudflare)
- [ ] Stripe in live mode (not test mode)
- [ ] Cron schedule appropriate for production load (every 2 minutes for premium)
- [ ] Error logging and monitoring configured

## Post-Deployment Tasks

1. **Update Chrome Extension** to use `https://api.nexus-alert.com` instead of local/dev URLs
2. **Update Landing Page** with production API endpoint
3. **Configure monitoring alerts** in Cloudflare for error rates
4. **Set up Sentry or error tracking** for production error monitoring
5. **Enable rate limiting** if needed for /api/register endpoint
6. **Document incident response** procedures
7. **Schedule regular backups** of KV data

---

**Production URL:** https://api.nexus-alert.com
**Status Endpoint:** https://api.nexus-alert.com/api/status
**Cron Schedule:** Every 2 minutes (`*/2 * * * *`)
