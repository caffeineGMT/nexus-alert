# Production Deployment Checklist

**Last Updated:** March 18, 2026
**Target Go-Live Date:** Within 2 weeks
**First Revenue Goal:** $500 MRR in Month 1

---

## Pre-Deployment (Complete First)

### 1. Stripe Account Setup

- [ ] Switch Stripe to **Live Mode**
- [ ] Complete Stripe account verification
  - [ ] Business information submitted
  - [ ] Bank account linked for payouts
  - [ ] Tax information provided
- [ ] Create product: **NEXUS Alert Premium**
  - Price: $4.99/month recurring
  - Copy Price ID: `price_________________`
- [ ] Copy Stripe Secret Key: `sk_live_________________`
- [ ] Configure webhook endpoint: `https://api.nexus-alert.com/api/webhook`
  - Events: `checkout.session.completed`, `customer.subscription.deleted`
  - Copy Webhook Secret: `whsec_________________`

**Verification:**
```bash
# List products (should show NEXUS Alert Premium)
stripe products list --limit 1
```

---

### 2. Third-Party Services

- [ ] **Resend.com** (Email notifications)
  - [ ] Sign up at https://resend.com
  - [ ] Verify domain: `nexus-alert.com`
  - [ ] Copy API key: `re_________________`

- [ ] **Twilio** (SMS notifications — OPTIONAL)
  - [ ] Sign up at https://twilio.com
  - [ ] Purchase phone number
  - [ ] Copy Account SID: `AC________________`
  - [ ] Copy Auth Token: `________________`
  - [ ] Copy Phone Number: `+1__________`

**Verification:**
```bash
# Test Resend API
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer re_XXXXX" \
  -H "Content-Type: application/json" \
  -d '{"from":"test@nexus-alert.com","to":"your@email.com","subject":"Test","html":"Test"}'
```

---

### 3. Cloudflare Workers Setup

- [ ] Create KV namespace (if not exists)
  ```bash
  cd backend
  npx wrangler kv:namespace create NEXUS_ALERTS_KV
  ```
- [ ] Update `wrangler.toml` with KV namespace ID
- [ ] Generate internal webhook secret
  ```bash
  openssl rand -hex 32
  ```
- [ ] Set all production secrets (see step 4)

---

## Deployment Day

### 4. Set Cloudflare Secrets

Run these commands in `/backend` directory:

```bash
cd /Users/michaelguo/nexus-alert/backend

# Stripe secrets
npx wrangler secret put STRIPE_SECRET_KEY
# Paste: sk_live_...

npx wrangler secret put STRIPE_PRICE_ID
# Paste: price_...

npx wrangler secret put STRIPE_WEBHOOK_SECRET
# Paste: whsec_...

# Email notifications
npx wrangler secret put RESEND_API_KEY
# Paste: re_...

# Internal security
npx wrangler secret put WEBHOOK_SECRET
# Paste: output from openssl rand -hex 32

# SMS notifications (OPTIONAL)
npx wrangler secret put TWILIO_ACCOUNT_SID
npx wrangler secret put TWILIO_AUTH_TOKEN
npx wrangler secret put TWILIO_FROM_NUMBER
```

**Verification:**
```bash
npx wrangler secret list
# Should show all 8 secrets (or 5 if skipping Twilio)
```

---

### 5. Deploy Backend

```bash
cd /Users/michaelguo/nexus-alert/backend
npm run deploy
```

**Expected Output:**
```
✨ Built successfully
✨ Successfully published your script to
   https://nexus-alert-backend.YOUR_SUBDOMAIN.workers.dev
```

---

### 6. Configure Custom Domain

- [ ] Go to Cloudflare Dashboard
- [ ] Select worker: `nexus-alert-backend`
- [ ] **Settings** → **Triggers** → **Custom Domains**
- [ ] Add custom domain: `api.nexus-alert.com`
- [ ] Wait for DNS propagation (~5 minutes)

**Verification:**
```bash
curl https://api.nexus-alert.com/api/status
# Should return JSON with status: "running"
```

---

### 7. Test Payment Flow

```bash
cd /Users/michaelguo/nexus-alert/backend

# Run automated test
./test-payment-flow.sh

# Follow prompts to complete test payment
```

**Manual Verification:**

1. **Create checkout session:**
   ```bash
   curl -X POST https://api.nexus-alert.com/api/checkout \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

2. **Complete payment in browser** (use test card: 4242 4242 4242 4242)

3. **Verify webhook fired:**
   - Check Stripe Dashboard → Webhooks
   - Event should show "Succeeded"

4. **Verify license activated:**
   ```bash
   curl "https://api.nexus-alert.com/api/license?email=test@example.com"
   # Should return: {"tier":"premium"}
   ```

---

### 8. Chrome Web Store Submission

- [ ] Create ZIP package:
  ```bash
  cd /Users/michaelguo/nexus-alert
  zip -r nexus-alert-v2.0.0.zip manifest.json background.js popup.html popup.js onboarding.html onboarding.js offscreen.html offscreen.js icons/ src/ -x "*.DS_Store"
  ```

- [ ] Upload to Chrome Web Store Developer Dashboard
- [ ] Fill in store listing (see `/store-assets/`)
- [ ] Submit for review (1-3 business days)

**Checklist:**
- [ ] Privacy Policy URL: `https://nexus-alert.com/privacy`
- [ ] Terms of Service URL: `https://nexus-alert.com/terms`
- [ ] Screenshots uploaded (5 images)
- [ ] Store description complete
- [ ] Category: Productivity

---

## Post-Deployment (First 48 Hours)

### 9. Enable Monitoring

**Real-Time Dashboard:**
```bash
cd /Users/michaelguo/nexus-alert/backend

# Set Stripe API key for monitoring
export STRIPE_API_KEY=sk_live_XXXXXXXXX

# Start monitoring dashboard
./monitoring-dashboard.sh
```

**Cloudflare Logs:**
```bash
# Terminal 2
npx wrangler tail
```

**Stripe Dashboard:**
- [ ] Bookmark: https://dashboard.stripe.com/webhooks
- [ ] Check every 2-4 hours for failed webhooks

---

### 10. First Customer Test

**Your own purchase:**

1. Install extension from Chrome Web Store
2. Complete onboarding
3. Click **Upgrade to Premium**
4. Use **real credit card** (charge will be $4.99)
5. Verify:
   - [ ] Payment succeeded in Stripe
   - [ ] Webhook delivered successfully
   - [ ] License activated in KV
   - [ ] Polling interval changed to 2 minutes
   - [ ] Email notification works (trigger manual check)

**If successful:**
```bash
# Mark in monitoring
echo "✅ First real customer: $(date)" >> LAUNCH_LOG.md
```

---

### 11. Marketing Launch

- [ ] Announce on Reddit:
  - r/NEXUS
  - r/GlobalEntry
  - r/travel
- [ ] Post on Twitter/X
- [ ] Email existing email leads (`/leads.json`)
- [ ] Facebook groups (travel/NEXUS)

**Email Template:**
```
Subject: NEXUS Alert is Live — Never Miss an Appointment Again

Hi [Name],

NEXUS Alert is now live on the Chrome Web Store!

🔔 Get instant notifications when NEXUS appointment slots open up
⚡ Premium users get checks every 2 minutes + SMS alerts
🎯 Filter by location, date, and time

Install now: [Chrome Web Store Link]

First 100 users get 20% off with code: EARLYBIRD

Thanks for your interest!
```

---

## Troubleshooting Guide

### Issue: Webhook Not Firing

**Symptoms:** Payment succeeds but tier doesn't upgrade

**Fix:**
```bash
# 1. Check webhook URL in Stripe Dashboard
# Should be: https://api.nexus-alert.com/api/webhook

# 2. Test webhook manually
stripe trigger checkout.session.completed

# 3. Check Cloudflare logs
npx wrangler tail
```

---

### Issue: Polling Interval Not Changing

**Symptoms:** Premium user still has 30-minute polling

**Fix:**
```bash
# 1. Verify license lookup
curl "https://api.nexus-alert.com/api/license?email=USER_EMAIL"

# 2. Check extension console (chrome://extensions/)
# Should show: interval=2min (premium) or interval=30min (free)

# 3. Restart service worker
# Go to chrome://serviceworker-internals/ and stop/start
```

---

### Issue: Email Not Sending

**Symptoms:** Slots found but no email received

**Fix:**
```bash
# 1. Check Resend API key is set
npx wrangler secret list | grep RESEND

# 2. Check Resend dashboard for delivery status
# https://resend.com/emails

# 3. Verify domain is verified in Resend
```

---

## Success Metrics

Track these daily for the first week:

| Metric | Day 1 | Day 2 | Day 3 | Day 7 |
|--------|-------|-------|-------|-------|
| Installs | | | | |
| Upgrades | | | | |
| MRR | | | | |
| Failed Payments | | | | |
| Webhook Errors | | | | |
| Support Emails | | | | |

**Goal:** 10+ paying customers in Week 1 ($50 MRR)

---

## Emergency Rollback

If critical issues arise:

```bash
# 1. Disable cron job temporarily
# Edit wrangler.toml, comment out:
# [triggers]
# crons = ["*/2 * * * *"]

# 2. Deploy with cron disabled
npm run deploy

# 3. Investigate issue

# 4. Fix and re-deploy

# 5. Re-enable cron job
```

**Emergency Contact:**
- Stripe Support: https://support.stripe.com
- Cloudflare Support: https://dash.cloudflare.com/support

---

## Done!

Once all checkboxes are complete:

```bash
# Commit deployment notes
git add DEPLOYMENT_CHECKLIST.md
git commit -m "Production deployment complete — accepting first customers"
git push origin main

# Celebrate! 🎉
echo "🚀 NEXUS Alert is LIVE and accepting payments!"
```

**Next Steps:**
1. Monitor dashboard for 48 hours
2. Respond to Chrome Web Store reviews
3. Answer support emails within 24 hours
4. Collect user feedback
5. Plan next features based on revenue impact
