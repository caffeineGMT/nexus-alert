# Email Marketing Setup Guide

This guide walks you through setting up the complete email capture and welcome sequence system for NEXUS Alert using ConvertKit for email automation.

## Overview

The email marketing flow:

1. **Landing page** → User enters email in `EmailCaptureForm`
2. **Backend API** → Stores subscriber in Cloudflare KV + adds to ConvertKit
3. **ConvertKit** → Triggers automated welcome sequence
4. **Welcome email** → Sent immediately via Resend
5. **Drip campaign** → ConvertKit sends timed follow-up emails to nurture leads

## Why ConvertKit?

- **Visual automation builder** — Easy to create email sequences without code
- **Tagging & segmentation** — Track user behavior (free vs premium, engaged vs inactive)
- **High deliverability** — Better inbox placement than self-hosted solutions
- **Reporting** — Track open rates, click rates, conversion funnel
- **Scalable pricing** — Starts at $29/mo for up to 1,000 subscribers

## Setup Steps

### 1. Create ConvertKit Account

1. Go to [ConvertKit.com](https://convertkit.com) and sign up
2. Choose the Creator plan ($29/mo for 1,000 subscribers)
3. Complete the onboarding wizard

### 2. Create Your Main Email List (Form)

1. In ConvertKit dashboard, go to **Grow** → **Landing Pages & Forms**
2. Click **Create New** → **Form** → **Inline** (we'll use the API, not the embed)
3. Name it: "NEXUS Alert Main List"
4. **Customize settings:**
   - **Success message:** "Thanks for signing up! Check your inbox."
   - **Incentive delivery:** None (we handle emails via API)
5. Click **Save**
6. Copy the **Form ID** from the URL (e.g., `forms/1234567` → Form ID is `1234567`)

### 3. Create Tags for Segmentation

Tags help you segment users and trigger specific automation sequences.

1. Go to **Grow** → **Tags**
2. Create these tags:
   - **free** — Free tier users (applied on signup)
   - **premium** — Premium subscribers ($4.99/mo)
   - **pro** — Pro tier users ($99/mo for immigration lawyers)
   - **churned** — Users who downgraded or cancelled
   - **converted** — Users who upgraded from free to paid

3. For each tag, copy the **Tag ID** (click the tag, check the URL)

### 4. Create Welcome Email Sequence

1. Go to **Automate** → **Visual Automations**
2. Click **Create Automation**
3. Name it: "NEXUS Alert Welcome Sequence"
4. **Build the sequence:**

**Trigger:** Subscribes to form "NEXUS Alert Main List"

**Email 1 — Welcome (Day 0, immediate):**
- Subject: "👋 Welcome to NEXUS Alert!"
- Content: Welcome message, explain how it works, encourage them to add our email to contacts
- CTA: "Install Chrome Extension" (link to Chrome Web Store)

**Email 2 — Case Study (Day 3):**
- Subject: "📊 How Sarah Got Her NEXUS Appointment in 48 Hours"
- Content: Real success story, emphasize Premium benefits (2-min checks vs 30-min)
- CTA: "Upgrade to Premium — $4.99/mo"

**Email 3 — Discount Offer (Day 7):**
- Subject: "🎁 Special Offer: First Month 20% Off"
- Content: Limited-time offer, create urgency
- CTA: "Claim 20% Off" (link to pricing page with promo code)

**Email 4 — Social Proof (Day 14):**
- Subject: "Join 10,000+ travelers who found their appointments"
- Content: User testimonials, stats, urgency ("slots get booked fast")
- CTA: "Upgrade Now"

**Email 5 — Last Chance (Day 21):**
- Subject: "Still searching? Here's what you're missing"
- Content: Feature comparison table (free vs premium), final push
- CTA: "Upgrade to Premium"

5. **Save & Publish** the automation

### 5. Get API Credentials

1. Go to **Settings** → **Advanced** → **API**
2. Copy your **API Key** (starts with a long string)
3. Copy your **API Secret** (different from API Key)
4. Keep these secure — never commit to git

### 6. Configure Cloudflare Worker Secrets

Set the ConvertKit credentials as Cloudflare Worker secrets:

```bash
cd backend

# Set API credentials
wrangler secret put CONVERTKIT_API_KEY
# Paste your ConvertKit API Key when prompted

wrangler secret put CONVERTKIT_API_SECRET
# Paste your ConvertKit API Secret when prompted

# Set Form ID (this is NOT a secret, but we store it as one for consistency)
wrangler secret put CONVERTKIT_FORM_ID
# Enter your form ID (e.g., 1234567)

# Set Tag IDs for segmentation
wrangler secret put CONVERTKIT_TAG_FREE
wrangler secret put CONVERTKIT_TAG_PREMIUM
wrangler secret put CONVERTKIT_TAG_PRO
wrangler secret put CONVERTKIT_TAG_CHURNED
wrangler secret put CONVERTKIT_TAG_CONVERTED
```

**For production environment:**

```bash
wrangler secret put CONVERTKIT_API_KEY --env production
wrangler secret put CONVERTKIT_API_SECRET --env production
wrangler secret put CONVERTKIT_FORM_ID --env production
wrangler secret put CONVERTKIT_TAG_FREE --env production
wrangler secret put CONVERTKIT_TAG_PREMIUM --env production
wrangler secret put CONVERTKIT_TAG_PRO --env production
wrangler secret put CONVERTKIT_TAG_CHURNED --env production
wrangler secret put CONVERTKIT_TAG_CONVERTED --env production
```

### 7. Set Up ConvertKit Webhook (Optional)

Webhooks let ConvertKit notify your backend when events happen (e.g., user unsubscribes, spam complaint).

1. In ConvertKit, go to **Settings** → **Advanced** → **Webhooks**
2. Click **Add Webhook**
3. **Webhook URL:** `https://api.nexus-alert.com/api/webhooks/convertkit`
4. **Events to subscribe:**
   - `subscriber.subscriber_activate`
   - `subscriber.subscriber_unsubscribe`
   - `subscriber.subscriber_bounce`
   - `subscriber.subscriber_complain`
5. Click **Save**

This allows the backend to sync user state between ConvertKit and Cloudflare KV.

### 8. Test the Integration

1. **Deploy the backend:**
   ```bash
   cd backend
   npm run deploy
   ```

2. **Test email signup:**
   - Go to your landing page: `https://nexus-alert.com`
   - Enter a test email address in the email capture form
   - Click "Get Early Access"

3. **Verify the flow:**
   - ✅ Check Cloudflare KV: subscriber should be stored under `sub:{email}`
   - ✅ Check ConvertKit dashboard: subscriber should appear in "NEXUS Alert Main List"
   - ✅ Check your inbox: you should receive the welcome email
   - ✅ Wait 30 seconds: ConvertKit should send the first automated email

4. **Check logs:**
   ```bash
   wrangler tail
   ```
   Look for: "Added {email} to ConvertKit"

### 9. Monitor & Optimize

**Key metrics to track in ConvertKit:**

- **Subscriber growth rate** — New signups per day/week
- **Email open rate** — Target >30% (adjust subject lines if lower)
- **Click-through rate (CTR)** — Target >5% (improve CTAs if lower)
- **Conversion rate** — % of free users who upgrade to premium
- **Unsubscribe rate** — Keep <1% (if higher, review email frequency/content)

**A/B test ideas:**

- Subject lines (emoji vs plain text, urgency vs value)
- Email send times (morning vs evening)
- CTA copy ("Upgrade Now" vs "Get Premium")
- Discount offers (20% off vs $1 first month)

### 10. Alternative: Mailchimp Setup

If you prefer Mailchimp over ConvertKit:

1. Create a Mailchimp account
2. Create an audience (list)
3. Get your API key and Audience ID
4. Update `backend/src/worker.js`:
   - Replace `addToConvertKit()` calls with Mailchimp API calls
   - Use `https://api.mailchimp.com/3.0/lists/{AUDIENCE_ID}/members`
5. Create automation sequences in Mailchimp dashboard

**Mailchimp API example:**

```javascript
await fetch(`https://${DC}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email_address: email,
    status: 'subscribed',
    merge_fields: {
      FNAME: firstName,
      PROGRAM: program,
    },
    tags: ['free'],
  }),
});
```

## Email Best Practices

1. **Subject lines:**
   - Keep under 50 characters
   - Use emojis sparingly (1 per subject max)
   - Create curiosity or urgency
   - Avoid spam trigger words ("FREE!", "ACT NOW!")

2. **Content:**
   - Start with a personal greeting
   - One clear CTA per email
   - Use social proof (testimonials, user counts)
   - Mobile-friendly design (60% of emails opened on mobile)

3. **Frequency:**
   - Welcome sequence: 5 emails over 21 days
   - Regular newsletters: 1-2x per week max
   - Transactional emails: immediate (slot alerts, purchase confirmations)

4. **Deliverability:**
   - Use a custom sending domain (e.g., mail.nexus-alert.com)
   - Authenticate with SPF, DKIM, DMARC
   - Keep unsubscribe rate <0.5%
   - Monitor sender reputation via [mail-tester.com](https://www.mail-tester.com)

## Troubleshooting

**Subscribers not appearing in ConvertKit:**
- Check `wrangler tail` for errors
- Verify `CONVERTKIT_API_KEY` and `CONVERTKIT_FORM_ID` are set correctly
- Test API credentials with curl:
  ```bash
  curl -X POST https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe \
    -H "Content-Type: application/json" \
    -d '{"api_key":"YOUR_API_KEY","email":"test@example.com"}'
  ```

**Welcome email not sending:**
- Check that automation is published (not draft)
- Verify trigger condition matches (subscribes to correct form)
- Check ConvertKit automation logs for errors

**High unsubscribe rate:**
- Review email frequency (reduce to 2-3x per week)
- Improve email content quality
- Segment your list (don't send premium upsells to recent signups)

**Low open rates (<20%):**
- Improve subject lines (use A/B testing)
- Check sender reputation (avoid spam folder)
- Clean your list (remove inactive subscribers after 90 days)

## Cost Analysis

**ConvertKit pricing:**
- 0-1,000 subscribers: $29/mo
- 1,001-3,000: $49/mo
- 3,001-5,000: $79/mo
- 5,001-10,000: $99/mo

**Expected ROI:**
- If 5% of free users convert to premium ($4.99/mo)
- 1,000 subscribers → 50 premium → $249/mo revenue → **8x ROI**

## Next Steps

1. ✅ Set up ConvertKit account and form
2. ✅ Create welcome sequence automation
3. ✅ Configure Cloudflare Worker secrets
4. ✅ Deploy backend and test flow
5. ⏭️ Write compelling email copy
6. ⏭️ Set up A/B tests for subject lines
7. ⏭️ Monitor analytics and optimize

---

**Questions?** Email help@nexus-alert.com or check the [ConvertKit documentation](https://help.convertkit.com).
