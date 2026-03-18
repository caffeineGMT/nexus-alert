# ConvertKit Integration Setup

This guide explains how to set up ConvertKit for NEXUS Alert email automation and welcome sequences.

## Prerequisites

- ConvertKit account (free tier works for up to 1,000 subscribers)
- ConvertKit API credentials

## Step 1: Get ConvertKit API Credentials

1. Log in to [ConvertKit](https://app.convertkit.com/)
2. Go to **Settings** → **Advanced** → **API & Webhooks**
3. Copy your **API Key** and **API Secret**
4. Add them to your Cloudflare Worker secrets:

```bash
wrangler secret put CONVERTKIT_API_KEY
wrangler secret put CONVERTKIT_API_SECRET
```

## Step 2: Create a Form

1. In ConvertKit, go to **Grow** → **Landing Pages & Forms**
2. Click **Create New Form**
3. Choose "Embed" form type
4. Name it "NEXUS Alert - Landing Page Signup"
5. Add custom fields:
   - `program` (text)
   - `locations` (text)
   - `tier` (text)
   - `signup_date` (date)
6. Copy the **Form ID** from the URL (e.g., `12345678`)
7. Add it to your Worker secrets:

```bash
wrangler secret put CONVERTKIT_FORM_ID
# Enter: 12345678
```

## Step 3: Create Tags

Tags are used for segmentation and automation triggers.

1. Go to **Subscribers** → **Tags**
2. Create these tags:
   - `free` - Free tier users
   - `premium` - Premium tier users
   - `churned` - Cancelled premium users
   - `converted` - Upgraded from free to premium

3. Copy each tag ID and add them to your secrets:

```bash
wrangler secret put CONVERTKIT_TAG_FREE
wrangler secret put CONVERTKIT_TAG_PREMIUM
wrangler secret put CONVERTKIT_TAG_CHURNED
wrangler secret put CONVERTKIT_TAG_CONVERTED
```

## Step 4: Create Email Sequences

### Free User Sequence

1. Go to **Automate** → **Sequences**
2. Create a new sequence: "Free User Welcome"
3. Add emails with delays:

**Email 1: Welcome** (immediate)
- Subject: "👋 Welcome to NEXUS Alert!"
- Content: Explain what they signed up for, set expectations (30-min checks), encourage adding to contacts

**Email 2: Premium Case Study** (3 days later)
- Subject: "📊 How Sarah Got Her NEXUS Appointment in 48 Hours"
- Content: Success story, comparison table, soft upgrade CTA

**Email 3: Discount Offer** (7 days later)
- Subject: "🎁 Special Offer: First Month 20% Off"
- Content: Limited-time discount (use promo code), feature highlights, urgency

### Premium User Sequence

1. Create sequence: "Premium Welcome"
2. Add emails:

**Email 1: Premium Welcome** (immediate)
- Subject: "🎉 Welcome to Premium! Here's What to Expect"
- Content: Activation confirmation, feature list, next steps

**Email 2: Pro Tips** (7 days later)
- Subject: "💡 5 Pro Tips to Get Your Appointment Faster"
- Content: Best practices, insider tips, success stats

## Step 5: Set Up Automation Rules

1. Go to **Automate** → **Visual Automations**
2. Create automation: "NEXUS Alert Signup Flow"

### Trigger
- **Event**: Subscribes to form (select your form)

### Actions
1. **Tag subscriber**: Add tag `free`
2. **Subscribe to sequence**: "Free User Welcome"

### Additional Automations

**Free → Premium Upgrade**
- Trigger: Tag `premium` is added
- Actions:
  1. Remove tag `free`
  2. Unsubscribe from "Free User Welcome"
  3. Subscribe to "Premium Welcome"

**Churn Prevention**
- Trigger: Tag `churned` is added
- Actions:
  1. Remove tag `premium`
  2. Send email "⏸️ We'd Love to Keep You — Here's a Pause Option"
  3. Wait 30 days
  4. Send email "🎁 We Miss You — Come Back for 50% Off"

## Step 6: Configure Webhooks

1. In ConvertKit, go to **Settings** → **Advanced** → **API & Webhooks**
2. Add webhook URL: `https://api.nexus-alert.com/api/webhooks/convertkit`
3. Select events to send:
   - `subscriber.subscriber_activate`
   - `subscriber.subscriber_unsubscribe`
   - `subscriber.subscriber_bounce`
   - `subscriber.subscriber_complain`

## Step 7: Test the Integration

1. Submit the email form on your landing page
2. Check ConvertKit dashboard to confirm:
   - Subscriber was added
   - Tag `free` was applied
   - Welcome sequence started
3. Check Cloudflare Worker logs for ConvertKit API calls

## Environment Variables Summary

Add these to `wrangler.toml` or as secrets:

```toml
[vars]
CONVERTKIT_API_KEY = "your_api_key_here"
CONVERTKIT_API_SECRET = "your_api_secret_here"
CONVERTKIT_FORM_ID = "12345678"
CONVERTKIT_TAG_FREE = "123456"
CONVERTKIT_TAG_PREMIUM = "123457"
CONVERTKIT_TAG_CHURNED = "123458"
CONVERTKIT_TAG_CONVERTED = "123459"
```

## Alternative: Mailchimp

If you prefer Mailchimp instead:

1. Use Mailchimp API v3 instead of ConvertKit
2. Create similar automation workflows in Mailchimp
3. Replace `convertkit.js` functions with Mailchimp equivalents
4. Update environment variables accordingly

## Email Sequence Timing

| Email | Segment | Delay | Goal |
|-------|---------|-------|------|
| Welcome | Free | 0 days | Set expectations |
| Case Study | Free | 3 days | Show value of premium |
| Discount | Free | 7 days | Convert with urgency |
| Premium Welcome | Premium | 0 days | Onboard, reduce churn |
| Pro Tips | Premium | 7 days | Engagement, retention |
| Pause Offer | Churned | 0 days | Win-back, reduce churn |
| 50% Off | Churned | 30 days | Win-back, re-activation |

## Metrics to Track

- **Email open rate**: Target 25-35%
- **Click-through rate**: Target 5-10%
- **Free → Premium conversion**: Target 5-10%
- **Churn rate**: Target <10% monthly
- **Win-back rate**: Target 10-15%

## Support

For ConvertKit support: https://help.convertkit.com/
For integration issues: check Cloudflare Worker logs and Sentry error tracking
