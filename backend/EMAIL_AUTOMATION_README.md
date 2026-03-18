# Email Capture & Automation System

Complete guide for the email capture form, ConvertKit integration, and automated welcome sequences.

## System Overview

**Landing Page → Cloudflare Worker → ConvertKit → Email Sequences**

1. User submits email on landing page
2. Form POSTs to `/api/subscribe` (public endpoint, no auth)
3. Worker stores subscriber in KV and adds to ConvertKit
4. ConvertKit triggers welcome sequence automation
5. User receives welcome email immediately
6. Subsequent emails sent based on tier and actions

## Architecture

```
┌─────────────────┐
│  Landing Page   │
│  Email Form     │
└────────┬────────┘
         │ POST /api/subscribe
         ▼
┌─────────────────┐
│ Cloudflare      │
│ Worker          │◄──────┐
│ (Public API)    │       │ Webhooks
└────┬───┬────────┘       │
     │   │                │
     │   │    ┌───────────┴─────┐
     │   └────► ConvertKit API  │
     │        │ (Email Marketing)│
     │        └──────────────────┘
     │                │
     ▼                ▼
┌────────────┐  ┌─────────────┐
│ KV Storage │  │ Email       │
│ (Backup)   │  │ Sequences   │
└────────────┘  └─────────────┘
```

## Files

- `src/worker.js` - Main worker with public subscribe endpoint
- `src/convertkit.js` - ConvertKit API integration functions
- `src/email-templates/index.js` - Resend email templates (fallback)
- `web/src/app/components/EmailCaptureForm.tsx` - React form component
- `CONVERTKIT_SETUP.md` - Detailed ConvertKit configuration guide

## API Endpoints

### Public Endpoints (No Auth Required)

#### `POST /api/subscribe`

Email capture from landing page.

**Request:**
```json
{
  "email": "user@example.com",
  "program": "NEXUS",           // Optional: NEXUS, Global Entry, SENTRI
  "locations": [12, 34, 56],    // Optional: array of location IDs
  "dateRange": {                // Optional
    "start": "2025-04-01",
    "end": "2025-06-30"
  },
  "timeRange": {                // Optional
    "start": "09:00",
    "end": "17:00"
  }
}
```

**Response:**
```json
{
  "success": true,
  "subscriber": {
    "email": "user@example.com",
    "program": "NEXUS"
  }
}
```

**What Happens:**
1. Subscriber stored in KV (`sub:email@example.com`)
2. Added to ConvertKit form (triggers automation)
3. Tagged with `free` in ConvertKit
4. Welcome email sent via Resend (immediate)
5. ConvertKit welcome sequence starts

#### `POST /api/webhooks/convertkit`

Webhook endpoint for ConvertKit events.

**Events Handled:**
- `subscriber.subscriber_activate` - Track activation in KV
- `subscriber.subscriber_unsubscribe` - Remove from KV
- `subscriber.subscriber_bounce` - Mark as bounced
- `subscriber.subscriber_complain` - Auto-unsubscribe

## Email Sequences

### Free Tier Sequence

| Day | Email | Subject | Goal |
|-----|-------|---------|------|
| 0 | Welcome | "👋 Welcome to NEXUS Alert!" | Set expectations, add to contacts |
| 3 | Case Study | "📊 How Sarah Got Her NEXUS Appointment in 48 Hours" | Show premium value |
| 7 | Discount | "🎁 Special Offer: First Month 20% Off" | Convert with urgency |

**Metrics Target:**
- Open rate: 30-40% (welcome), 25-30% (promo)
- Click rate: 8-12%
- Free→Premium conversion: 5-10%

### Premium Tier Sequence

| Day | Email | Subject | Goal |
|-----|-------|---------|------|
| 0 | Premium Welcome | "🎉 Welcome to Premium! Here's What to Expect" | Onboarding, reduce churn |
| 7 | Pro Tips | "💡 5 Pro Tips to Get Your Appointment Faster" | Engagement, retention |

**Metrics Target:**
- Open rate: 40-50%
- Click rate: 15-20%
- 7-day retention: >90%

### Churn Prevention Sequence

| Day | Email | Subject | Goal |
|-----|-------|---------|------|
| 0 | Pause Offer | "⏸️ We'd Love to Keep You — Here's a Pause Option" | Win-back |
| 30 | Win-Back | "🎁 We Miss You — Come Back for 50% Off" | Re-activation |

**Metrics Target:**
- Win-back rate: 10-15%
- Re-activation within 60 days: 5-8%

## ConvertKit Automation Rules

### 1. New Subscriber Flow

**Trigger:** Subscribes to Form (landing page form)

**Actions:**
1. Add tag `free`
2. Subscribe to sequence "Free User Welcome"
3. Set custom field `tier` = "free"
4. Set custom field `signup_date` = today

### 2. Free → Premium Upgrade

**Trigger:** Tag `premium` is added

**Actions:**
1. Remove tag `free`
2. Unsubscribe from "Free User Welcome" sequence
3. Subscribe to "Premium Welcome" sequence
4. Set custom field `tier` = "premium"
5. Set custom field `upgrade_date` = today

### 3. Churn Prevention

**Trigger:** Tag `churned` is added

**Actions:**
1. Remove tag `premium`
2. Send email "Pause Offer" immediately
3. Wait 30 days
4. Send email "Win-Back Offer"
5. Add tag `win_back_sent`

### 4. Bounce/Complaint Handling

**Trigger:** Email bounces or spam complaint

**Actions:**
1. Remove all tags
2. Unsubscribe from all sequences
3. Mark as unsubscribed in system

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

Required variables:
- `RESEND_API_KEY` - For sending transactional emails
- `CONVERTKIT_API_KEY` - ConvertKit API key
- `CONVERTKIT_API_SECRET` - ConvertKit API secret
- `CONVERTKIT_FORM_ID` - Landing page form ID

### 3. Set Cloudflare Secrets

```bash
# Resend
wrangler secret put RESEND_API_KEY
# Enter: re_abc123...

# ConvertKit
wrangler secret put CONVERTKIT_API_KEY
wrangler secret put CONVERTKIT_API_SECRET
wrangler secret put CONVERTKIT_FORM_ID
wrangler secret put CONVERTKIT_TAG_FREE
wrangler secret put CONVERTKIT_TAG_PREMIUM
wrangler secret put CONVERTKIT_TAG_CHURNED
wrangler secret put CONVERTKIT_TAG_CONVERTED
```

### 4. Create ConvertKit Assets

Follow `CONVERTKIT_SETUP.md` to create:
- Forms
- Tags
- Email sequences
- Automation rules
- Webhooks

### 5. Test Locally

```bash
# Start local dev server
npm run dev

# Test email capture
curl -X POST http://localhost:8787/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","program":"NEXUS"}'

# Expected response:
# {"success":true,"subscriber":{"email":"test@example.com","program":"NEXUS"}}
```

### 6. Deploy to Production

```bash
# Deploy worker
npm run deploy

# Verify deployment
curl -X POST https://api.nexus-alert.com/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### 7. Configure Webhooks

Add webhook in ConvertKit settings:
- URL: `https://api.nexus-alert.com/api/webhooks/convertkit`
- Events: All subscriber events

## Frontend Integration

The email form is at `web/src/app/components/EmailCaptureForm.tsx`:

```tsx
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setStatus('loading');

  const res = await fetch('https://api.nexus-alert.com/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      program: 'NEXUS',
      locations: [],
      dateRange: {},
      timeRange: {},
    }),
  });

  if (!res.ok) throw new Error('Request failed');
  setStatus('success');

  // Track in Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    const source = new URLSearchParams(window.location.search).get('utm_source') || 'direct';
    (window as any).gtag('event', 'email_signup', {
      source: source,
      page_url: window.location.pathname,
    });
  }
}
```

## Monitoring & Analytics

### KV Storage Keys

- `sub:{email}` - Full subscriber object
- `subscriber_list` - Array of all email addresses
- `ck:{email}` - ConvertKit metadata (subscriber ID, state)

### Cloudflare Analytics

Monitor in Cloudflare dashboard:
- `/api/subscribe` request rate
- Success/error rates
- Response times

### ConvertKit Analytics

Track in ConvertKit dashboard:
- Total subscribers
- Sequence open/click rates
- Tag-based segmentation
- Automation conversion rates

### Google Analytics Events

Track these events:
- `email_signup` - Email captured
- `upgrade_click` - Clicked upgrade link in email
- `checkout_start` - Started Stripe checkout from email link

## Troubleshooting

### Email Not Received

1. Check spam folder
2. Verify Resend API key is valid
3. Check Cloudflare Worker logs for errors
4. Verify ConvertKit subscriber was created

### ConvertKit Integration Failed

1. Verify API key and secret are correct
2. Check form ID is valid
3. Verify custom fields exist on form
4. Check Cloudflare Worker logs for API errors

### Sequence Not Triggered

1. Verify automation rule is active in ConvertKit
2. Check subscriber has correct tag
3. Verify sequence is published
4. Check automation rule trigger conditions

### High Unsubscribe Rate

- Review email content for value
- Check send frequency (too many emails?)
- Verify targeting (right audience?)
- A/B test subject lines and content

## Performance Targets

### Email Deliverability

- Bounce rate: <2%
- Spam complaint rate: <0.1%
- Open rate: >25%
- Click rate: >5%

### Conversion Funnel

- Landing page → Email signup: 15-25%
- Email signup → Premium: 5-10%
- Free trial → Paid: 40-60%
- Monthly retention: >85%

### Support Load

- Support emails per 1,000 subscribers: <5
- Avg response time: <24 hours
- Unsubscribe rate: <2% per month

## Cost Estimates

### ConvertKit Pricing

- 0-1,000 subscribers: Free
- 1,001-3,000: $29/mo
- 3,001-5,000: $49/mo
- 5,001-10,000: $79/mo

### Resend Pricing

- 0-3,000 emails/mo: Free
- 3,001-50,000: $20/mo
- 50,001-100,000: $40/mo

### Total Email Stack Cost

| Subscribers | Emails/mo | ConvertKit | Resend | Total |
|-------------|-----------|------------|--------|-------|
| 500 | 2,000 | $0 | $0 | $0 |
| 2,000 | 8,000 | $29 | $20 | $49 |
| 5,000 | 20,000 | $49 | $20 | $69 |
| 10,000 | 40,000 | $79 | $40 | $119 |

## Next Steps

1. [ ] Complete ConvertKit setup (forms, sequences, automations)
2. [ ] Configure all environment variables
3. [ ] Deploy worker to production
4. [ ] Test email flow end-to-end
5. [ ] Set up ConvertKit webhooks
6. [ ] Configure Google Analytics events
7. [ ] Monitor first 100 signups
8. [ ] A/B test email subject lines
9. [ ] Optimize conversion funnel
10. [ ] Scale to 1,000+ subscribers
