# Email Drip Campaign Setup Guide

This document explains how to set up and monitor the automated email drip campaign for free-to-paid conversion.

## 📧 Campaign Overview

The drip campaign sends 4 emails on a schedule:

1. **Day 0**: Welcome email with setup guide
2. **Day 3**: Educational content - "Best Times to Find NEXUS Appointment Cancellations"
3. **Day 7**: Case study with 20% discount code (CASE20)
4. **Day 14**: Flash sale urgency offer with 48-hour countdown (FLASH48)

### Acceptance Criteria
- ✅ 4 emails send on schedule
- ✅ Day 7 email targets 15%+ conversion rate
- ✅ Unsubscribe rate < 2%

## 🚀 Setup Instructions

### 1. Create Stripe Promo Codes

The campaign uses two promo codes that must be created in Stripe:

```bash
cd backend
STRIPE_SECRET_KEY=sk_... node scripts/setup-promo-codes.js
```

This creates:
- **CASE20**: 20% off first month (Day 7 email)
- **FLASH48**: 20% off first month (Day 14 flash sale, expires 60 days)

### 2. Verify Email Templates

Email templates are in `src/email-templates/index.js`:

- `welcome` - Day 0
- `educational` - Day 3
- `upgrade_offer` - Day 7 (with CASE20 promo)
- `flash_sale` - Day 14 (with FLASH48 promo)

### 3. Deploy Backend

```bash
wrangler deploy --env production
```

### 4. Test the Campaign

**Manual Test (Simulate User Signup):**

```bash
# Create a test subscriber
curl -X POST https://api.nexus-alert.com/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "locations": [5140],
    "program": "NEXUS"
  }'

# Wait for cron to run (every 2 minutes)
# Or manually trigger sequence for testing
```

**Check Sequence State:**

```bash
# View email sequence state for a user
wrangler kv:key get "email_sequence:test@example.com" --binding=NEXUS_ALERTS_KV
```

## 📊 Monitoring & Analytics

### Email Campaign Dashboard

**Endpoint**: `GET /api/email-analytics`

Returns:
```json
{
  "emailsSent": {
    "day0_welcome": 234,
    "day3_educational": 198,
    "day7_case_study": 156,
    "day14_flash_sale": 89,
    "total": 677
  },
  "conversions": {
    "day7_case_study": 24,
    "day14_flash_sale": 12,
    "total": 36
  },
  "conversionRates": {
    "day7_case_study": "15.38%",
    "day14_flash_sale": "13.48%",
    "overall": "5.32%"
  },
  "unsubscribeCount": 8,
  "unsubscribeRate": "1.18%",
  "summary": {
    "day7Performance": {
      "sent": 156,
      "conversions": 24,
      "rate": "15.38%",
      "targetMet": true
    },
    "unsubscribeTargetMet": true
  }
}
```

### Stripe Conversion Tracking

Conversions are tracked via Stripe metadata:

```javascript
{
  email: "user@example.com",
  billingCycle: "monthly",
  utm_campaign: "day_7_case_study",
  utm_source: "email",
  utm_medium: "drip",
  utm_content: "cta_button",
  converted_from_email: "day_7_case_study"
}
```

**Query conversions by campaign:**

```bash
# In Stripe Dashboard → Subscriptions → Filter by metadata
# Or use Stripe API:
stripe subscriptions list --limit 100 | grep "converted_from_email"
```

### Activity Tracking

All email events are tracked in KV:

```bash
# View all drip email activity
wrangler kv:key list --prefix="activity:" --binding=NEXUS_ALERTS_KV

# Example activity event:
{
  "type": "drip_email_sent",
  "timestamp": "2026-03-18T10:30:00.000Z",
  "metadata": {
    "email": "user@example.com",
    "type": "case_study",
    "day": 7,
    "promo": "CASE20"
  }
}
```

## 🔧 How It Works

### Cron Schedule

The worker runs every 2 minutes via Cloudflare Cron Triggers:

```toml
[triggers]
crons = ["*/2 * * * *"]
```

Each run:
1. Processes slot checks (batch of 100 users)
2. Runs `sendEmailSequences()` to check for drip emails (every 12 hours)

### Email Sequence Logic

Located in `src/worker.js` → `sendEmailSequences()`:

```javascript
// Rate limit: runs every 12 hours
if (lastRun && (now - parseInt(lastRun)) < 12 * 60 * 60 * 1000) {
  return; // Skip
}

// For each free user:
if (daysSinceReg >= 0 && sequence.stage === 0) {
  // Day 0: Send welcome
  await sendEmail('welcome', email, env);
  sequence = { stage: 1, lastSent: now };
}
else if (daysSinceReg >= 3 && sequence.stage === 1) {
  // Day 3: Send educational
  await sendEmail('educational', email, env);
  sequence = { stage: 2, lastSent: now };
}
// ... and so on
```

### UTM Tracking

All upgrade links include UTM parameters:

```
https://nexus-alert.com/pricing?utm_source=email&utm_medium=drip&utm_campaign=day7_case_study&utm_content=cta_button&promo=CASE20
```

These are captured in the checkout handler and stored in Stripe metadata.

## 🎯 Optimization Tips

### Improving Conversion Rate

If Day 7 conversion < 15%:

1. **A/B test subject lines**
   - Current: "📊 How Sarah Got Her NEXUS Appointment in 3 Days (20% Off Inside)"
   - Test: "⚡ I found my NEXUS slot in 3 days. Here's how."

2. **Increase discount**
   - Try 30% or 50% for Day 14 flash sale

3. **Add social proof**
   - Include more testimonials in Day 7 email
   - Add success rate stats

4. **Shorten sequence**
   - Move Day 7 case study to Day 5
   - Add Day 10 reminder

### Reducing Unsubscribe Rate

If unsubscribe > 2%:

1. **Reduce email frequency**
   - Increase gaps: 0, 5, 10, 15 days

2. **Improve relevance**
   - Segment by user activity (active vs. inactive)
   - Personalize based on location preferences

3. **Add value**
   - Include actual slot availability data
   - Share cancellation trends for their locations

## 🐛 Troubleshooting

### Emails Not Sending

```bash
# Check cron execution
wrangler tail --env production | grep "Email Sequences"

# Verify Resend API key
wrangler secret list --env production | grep RESEND

# Check last run timestamp
wrangler kv:key get "email_sequences_last_run" --binding=NEXUS_ALERTS_KV
```

### Wrong Email Sent

```bash
# Check user's sequence state
wrangler kv:key get "email_sequence:user@example.com" --binding=NEXUS_ALERTS_KV

# Reset sequence to restart from Day 0
wrangler kv:key delete "email_sequence:user@example.com" --binding=NEXUS_ALERTS_KV
```

### Promo Code Not Working

```bash
# Verify promo code exists in Stripe
stripe promotion_codes list | grep CASE20

# Check redemption count
stripe promotion_codes retrieve promo_... | grep redemptions
```

## 📈 Success Metrics

Track these KPIs weekly:

- **Email Delivery Rate**: Should be > 98%
- **Day 7 Conversion Rate**: Target 15%+
- **Overall Conversion Rate**: Target 5-10%
- **Unsubscribe Rate**: Keep < 2%
- **Revenue Impact**: Track MRR from drip-attributed conversions

## 🔐 Security

- Unsubscribe links use HMAC tokens (no auth required)
- Stripe webhook validates signatures
- UTM parameters sanitized before storage
- Email addresses validated before sending

## 📝 Future Enhancements

- [ ] Add SMS drip for premium users
- [ ] Segment by location (Canada vs. US)
- [ ] Personalize based on user activity level
- [ ] A/B test email send times
- [ ] Add re-engagement campaign for inactive users
- [ ] Trigger emails based on behavior (e.g., slot found but not booked)

## 🆘 Support

For issues:
1. Check logs: `wrangler tail --env production`
2. View KV data: `wrangler kv:key list --binding=NEXUS_ALERTS_KV`
3. Test endpoint: `curl https://api.nexus-alert.com/api/email-analytics`
