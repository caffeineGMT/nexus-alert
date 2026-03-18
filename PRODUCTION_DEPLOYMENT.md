# NEXUS Alert — Production Deployment Guide

**Target:** Accept first paying customers within 2 weeks
**Revenue Goal:** $1M annual revenue
**Status:** Ready for production deployment

---

## Table of Contents

1. [Stripe Live Mode Setup](#stripe-live-mode-setup)
2. [Cloudflare Workers Production Deployment](#cloudflare-workers-production-deployment)
3. [End-to-End Payment Flow Testing](#end-to-end-payment-flow-testing)
4. [Chrome Web Store Submission](#chrome-web-store-submission)
5. [Monitoring & Troubleshooting](#monitoring--troubleshooting)
6. [Post-Launch Checklist](#post-launch-checklist)

---

## Stripe Live Mode Setup

### Step 1: Switch to Live Mode

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Toggle from **Test Mode** to **Live Mode** (top-right corner)
3. Complete Stripe account verification if not already done:
   - Business details
   - Bank account for payouts
   - Tax information

### Step 2: Create Product & Price

1. Navigate to **Products** → **Add Product**
2. Fill in product details:
   - **Name:** `NEXUS Alert Premium`
   - **Description:** `Premium tier with 2-minute polling and SMS/email notifications`
   - **Pricing:**
     - Type: **Recurring**
     - Amount: **$4.99 USD**
     - Billing period: **Monthly**
   - Click **Save product**

3. **Copy the Price ID** (starts with `price_`)
   - Example: `price_1AbCdEfGhIjKlMnO`
   - You'll need this for the `STRIPE_PRICE_ID` secret

### Step 3: Get API Keys

1. Navigate to **Developers** → **API Keys**
2. **Copy the Secret Key** (starts with `sk_live_`)
   - ⚠️ **CRITICAL:** Never commit this to Git
   - Store securely — you'll need this for `STRIPE_SECRET_KEY`

### Step 4: Configure Webhook Endpoint

1. Navigate to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Configure endpoint:
   - **Endpoint URL:** `https://api.nexus-alert.com/api/webhook`
   - **Description:** `NEXUS Alert Payment Events`
   - **Events to send:** Select these two events:
     - ✅ `checkout.session.completed`
     - ✅ `customer.subscription.deleted`
4. Click **Add endpoint**
5. **Copy the Signing Secret** (starts with `whsec_`)
   - You'll need this for `STRIPE_WEBHOOK_SECRET`

---

## Cloudflare Workers Production Deployment

### Prerequisites

```bash
cd /Users/michaelguo/nexus-alert/backend
npm install
```

### Step 1: Create/Verify KV Namespace

If you haven't already created the production KV namespace:

```bash
npx wrangler kv:namespace create NEXUS_ALERTS_KV
```

Copy the namespace ID and update `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "NEXUS_ALERTS_KV"
id = "YOUR_ACTUAL_KV_ID"  # Replace with the ID from the command above
```

### Step 2: Set Production Secrets

Run these commands **one at a time** and paste the values when prompted:

```bash
# Stripe Live Mode Secrets
npx wrangler secret put STRIPE_SECRET_KEY
# Paste: sk_live_xxxxxxxxxxxxxxxxxxxxx

npx wrangler secret put STRIPE_PRICE_ID
# Paste: price_xxxxxxxxxxxxxxxxxxxxx

npx wrangler secret put STRIPE_WEBHOOK_SECRET
# Paste: whsec_xxxxxxxxxxxxxxxxxxxxx

# Email Notifications (Resend.com)
npx wrangler secret put RESEND_API_KEY
# Paste: re_xxxxxxxxxxxxxxxxxxxxx

# SMS Notifications (Twilio - Optional)
npx wrangler secret put TWILIO_ACCOUNT_SID
# Paste: ACxxxxxxxxxxxxxxxxxxxxx

npx wrangler secret put TWILIO_AUTH_TOKEN
# Paste: your_twilio_auth_token

npx wrangler secret put TWILIO_FROM_NUMBER
# Paste: +16045551234 (E.164 format)

# Internal API Authentication
npx wrangler secret put WEBHOOK_SECRET
# Paste: Generate a random 32-character string
# Example: openssl rand -hex 32
```

### Step 3: Deploy to Production

```bash
npm run deploy
```

Expected output:
```
✨  Built successfully, built project size is 23.45 KiB.
✨  Successfully published your script to
   https://nexus-alert-backend.YOUR_SUBDOMAIN.workers.dev
```

### Step 4: Set Up Custom Domain (Production API)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your worker: **nexus-alert-backend**
3. Go to **Settings** → **Triggers** → **Custom Domains**
4. Click **Add Custom Domain**
5. Enter: `api.nexus-alert.com`
6. Click **Add Custom Domain**
7. Wait for DNS propagation (usually < 5 minutes)

### Step 5: Verify Deployment

Test the health endpoint:

```bash
curl https://api.nexus-alert.com/api/status
```

Expected response:
```json
{
  "status": "running",
  "lastRun": "2026-03-18T12:00:00.000Z",
  "totalChecks": 0,
  "totalNotifications": 0,
  "subscriberCount": 0
}
```

---

## End-to-End Payment Flow Testing

### Test Environment Setup

1. **Install Extension from Chrome Web Store**
   - Once published, install from: `https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID`
   - Alternatively, load unpacked for testing: `chrome://extensions/`

2. **Configure Test Card in Stripe Live Mode**
   - Stripe provides test cards that work in Live Mode for testing
   - **DO NOT** use real payment cards for testing

### Test Flow 1: New Premium Subscription

**Steps:**

1. **Open Extension Popup**
   - Click NEXUS Alert icon in Chrome toolbar
   - Navigate to **Settings** tab

2. **Initiate Upgrade**
   - Scroll to "Upgrade to Premium" section
   - Enter test email: `test+premium@yourdomain.com`
   - Click **Upgrade to Premium** button

3. **Complete Stripe Checkout**
   - You'll be redirected to Stripe Checkout page
   - Use Stripe test card (Live Mode testing):
     - Card: `4242 4242 4242 4242`
     - Expiry: Any future date (e.g., `12/28`)
     - CVC: Any 3 digits (e.g., `123`)
     - ZIP: Any 5 digits (e.g., `12345`)
   - Click **Subscribe**

4. **Verify Success Page**
   - After payment, you should be redirected to: `https://nexus-alert.com/success?session_id=cs_xxx`
   - Check that success page displays confirmation message

5. **Verify Webhook Processing**
   - Go to Stripe Dashboard → **Developers** → **Webhooks**
   - Click on your webhook endpoint
   - Verify `checkout.session.completed` event shows **Succeeded**
   - Check response: `{"received": true}`

6. **Verify License in KV Storage**

   ```bash
   npx wrangler kv:key get "license:test+premium@yourdomain.com" --namespace-id=YOUR_KV_ID
   ```

   Expected output:
   ```json
   {
     "status": "premium",
     "stripeCustomerId": "cus_xxxxx",
     "stripeSubscriptionId": "sub_xxxxx",
     "activatedAt": "2026-03-18T12:00:00.000Z",
     "tier": "premium"
   }
   ```

7. **Verify Polling Interval Change**
   - Open extension popup
   - Go to **Settings** tab
   - Verify "Premium" badge is displayed
   - Check Chrome DevTools → Console:
     ```
     [NEXUS Alert] Backoff: failureCount=0, interval=2min
     ```
   - Free users show: `interval=30min`
   - Premium users show: `interval=2min` or `interval=3min` (based on settings)

8. **Verify Email Notification**
   - Trigger a test slot notification (manual backend check)
   - Check inbox for `test+premium@yourdomain.com`
   - Verify email from `notifications@nexus-alert.com`

### Test Flow 2: License Restore (Existing Customer)

**Steps:**

1. **Open New Browser Profile** (or clear extension storage)
   - This simulates a user reinstalling the extension

2. **Restore License**
   - Install extension
   - Go to Settings → "Restore Premium License"
   - Enter: `test+premium@yourdomain.com`
   - Click **Restore License**

3. **Verify License Lookup**

   Check browser console for API call:
   ```
   GET https://api.nexus-alert.com/api/license?email=test%2Bpremium%40yourdomain.com
   ```

   Response:
   ```json
   {
     "tier": "premium"
   }
   ```

4. **Verify Premium Features Activated**
   - Premium badge displayed
   - Polling interval set to 2 minutes
   - Email notifications enabled

### Test Flow 3: Subscription Cancellation

**Steps:**

1. **Cancel Subscription in Stripe**
   - Go to Stripe Dashboard → **Customers**
   - Find customer: `test+premium@yourdomain.com`
   - Click on customer → **Subscriptions** tab
   - Click **Cancel subscription** → **Cancel subscription** (immediate)

2. **Verify Webhook Received**
   - Go to **Developers** → **Webhooks**
   - Verify `customer.subscription.deleted` event shows **Succeeded**

3. **Verify Downgrade in KV**

   ```bash
   npx wrangler kv:key get "license:test+premium@yourdomain.com" --namespace-id=YOUR_KV_ID
   ```

   Expected:
   ```json
   {
     "status": "free",
     "stripeCustomerId": "cus_xxxxx",
     "canceledAt": "2026-03-18T13:00:00.000Z",
     "tier": "free"
   }
   ```

4. **Verify Polling Interval Reverted**
   - Restart extension (reload service worker)
   - Check console: `interval=30min` (free tier)

---

## Chrome Web Store Submission

### Prerequisites

- [ ] Chrome Developer Account ($5 one-time fee)
- [ ] Privacy Policy URL: `https://nexus-alert.com/privacy`
- [ ] Terms of Service URL: `https://nexus-alert.com/terms`
- [ ] Store assets ready (see `/store-assets/`)

### Submission Steps

1. **Create ZIP Package**

   ```bash
   cd /Users/michaelguo/nexus-alert
   zip -r nexus-alert-chrome.zip manifest.json background.js popup.html popup.js onboarding.html onboarding.js offscreen.html offscreen.js icons/ src/ -x "*.DS_Store" "node_modules/*" ".git/*"
   ```

2. **Upload to Chrome Web Store**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Click **New Item**
   - Upload `nexus-alert-chrome.zip`

3. **Fill in Store Listing**
   - **Product Name:** NEXUS Alert
   - **Summary:** Monitor NEXUS, Global Entry, SENTRI appointment slots and get instant notifications
   - **Description:** (Use content from `/store-assets/description.txt`)
   - **Category:** Productivity
   - **Language:** English (United States)

4. **Upload Assets**
   - **Icon:** 128x128 from `/icons/icon128.png`
   - **Promotional Images:**
     - Small tile: 440x280
     - Marquee: 1400x560
     - Screenshots: 1280x800 (5 images from `/store-assets/`)

5. **Privacy Practices**
   - Select: **Yes, this extension collects user data**
   - Data collected: Email address
   - Purpose: Email notifications
   - Link to Privacy Policy: `https://nexus-alert.com/privacy`

6. **Submit for Review**
   - Review period: 1-3 business days
   - Monitor email for approval/rejection

---

## Monitoring & Troubleshooting

### Cloudflare Logs

View real-time logs:

```bash
npx wrangler tail
```

Monitor for errors:
- Webhook signature verification failures
- Stripe API errors
- KV write failures
- Email delivery failures

### Stripe Dashboard Monitoring

**Key Metrics to Watch:**

1. **Payments** → **All Payments**
   - Monitor successful/failed charges
   - Watch for disputes/chargebacks

2. **Webhooks** → Event logs
   - Ensure all events show "Succeeded"
   - Failed webhooks require manual investigation

3. **Customers** → **Subscriptions**
   - Track MRR (Monthly Recurring Revenue)
   - Monitor churn rate

### Extension Error Reporting

Check Chrome extension logs:

1. Go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **service worker** (under NEXUS Alert)
4. View console errors

### Common Issues & Fixes

#### Issue: Webhook Not Firing

**Symptoms:**
- Payment completes but license not activated
- No `checkout.session.completed` event in Stripe logs

**Fix:**
1. Verify webhook URL: `https://api.nexus-alert.com/api/webhook`
2. Check Cloudflare Worker is deployed and healthy
3. Test webhook manually:
   ```bash
   stripe trigger checkout.session.completed
   ```

#### Issue: Polling Interval Not Changing

**Symptoms:**
- Premium user still polling every 30 minutes
- Free user polling too frequently

**Fix:**
1. Verify license lookup works:
   ```bash
   curl "https://api.nexus-alert.com/api/license?email=user@example.com"
   ```
2. Check service worker console for tier value
3. Restart service worker: `chrome://serviceworker-internals/`

#### Issue: Email Notifications Not Sending

**Symptoms:**
- Slots found but no email received
- Resend API errors in logs

**Fix:**
1. Verify Resend API key is set:
   ```bash
   npx wrangler secret list
   ```
2. Check Resend dashboard for delivery status
3. Verify email domain is verified in Resend

---

## Post-Launch Checklist

### First 48 Hours

- [ ] **Monitor Cloudflare Logs** (`npx wrangler tail`)
  - Watch for errors every 2-4 hours
  - Set up error notifications (Cloudflare Email Workers)

- [ ] **Check Stripe Webhooks**
  - Go to Webhooks tab every 6 hours
  - Verify 100% success rate

- [ ] **Verify First Payment**
  - Test with your own credit card
  - Confirm license activation
  - Test full notification flow

- [ ] **Customer Support Readiness**
  - Set up support email: `support@nexus-alert.com`
  - Create FAQ page: `https://nexus-alert.com/faq`
  - Prepare refund policy

### First Week

- [ ] **Analytics Setup**
  - Install Google Analytics on landing page
  - Track conversion funnel: Install → Upgrade → Payment
  - Monitor Chrome Web Store impressions/installs

- [ ] **Performance Monitoring**
  - Check Cloudflare Worker metrics (requests, errors, duration)
  - Monitor KV storage usage
  - Track email delivery rate (Resend dashboard)

- [ ] **Financial Tracking**
  - Connect Stripe to accounting software (QuickBooks, Xero)
  - Track MRR daily
  - Calculate CAC (Customer Acquisition Cost)

### First Month

- [ ] **User Feedback Collection**
  - Add in-app feedback button
  - Monitor Chrome Web Store reviews
  - Send survey to first 50 users

- [ ] **Feature Requests**
  - Track top 3 requested features
  - Prioritize roadmap based on revenue impact

- [ ] **Optimization**
  - A/B test pricing ($4.99 vs $6.99 vs $9.99)
  - Test email notification copy
  - Improve onboarding flow based on drop-off data

---

## Revenue Projections

**Target:** $1M annual revenue

**Path to $1M:**

- **$4.99/month subscription**
- **Target customers:** 16,700 paying subscribers
- **Monthly MRR needed:** ~$83,000
- **Growth rate:** 25% month-over-month

**Realistic Milestones:**

- **Month 1:** 100 subscribers → $500 MRR
- **Month 3:** 500 subscribers → $2,500 MRR
- **Month 6:** 2,000 subscribers → $10,000 MRR
- **Month 12:** 8,000 subscribers → $40,000 MRR
- **Month 24:** 16,700+ subscribers → $83,000+ MRR → **$1M ARR**

**Key Levers:**
1. Chrome Web Store SEO (keyword: "NEXUS appointment alert")
2. Reddit/Facebook NEXUS communities
3. Referral program (give 1 month free for each referral)
4. Content marketing (blog posts about NEXUS tips)

---

## Security & Compliance

### Data Privacy

- [ ] Collect **minimum data** (email only)
- [ ] Encrypt all customer data in transit (HTTPS)
- [ ] GDPR compliance (EU users can request data deletion)
- [ ] CCPA compliance (California users have opt-out rights)

### PCI Compliance

✅ **Stripe handles all card data** — no PCI compliance needed on your end

### Terms & Privacy

- [ ] Privacy Policy published at `https://nexus-alert.com/privacy`
- [ ] Terms of Service published at `https://nexus-alert.com/terms`
- [ ] Refund policy: 30-day money-back guarantee

---

## Emergency Contacts

**Stripe Support:** https://support.stripe.com
**Cloudflare Support:** https://dash.cloudflare.com/?to=/:account/support
**Chrome Web Store Support:** https://support.google.com/chrome_webstore/
**Resend Support:** support@resend.com

---

## Next Steps

1. ✅ Complete Stripe Live Mode setup (this guide)
2. ✅ Deploy Cloudflare Worker to production
3. ✅ Test end-to-end payment flow
4. ⏳ Submit to Chrome Web Store
5. ⏳ Launch marketing campaign
6. ⏳ Monitor first 48 hours closely
7. ⏳ Collect feedback and iterate

**You're ready to accept your first paying customer!** 🚀
