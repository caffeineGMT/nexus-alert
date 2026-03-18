# Email Drip Campaign Implementation Summary

## Overview
Implemented automated email drip campaigns via Resend with KV-based sequence state tracking. The system manages conversion-focused email sequences for free and premium users, churn prevention, and win-back campaigns.

## Components Implemented

### 1. Email Templates (`backend/src/email-templates/index.js`)
Created 7 professional email templates with inline CSS:

**Free User Sequence:**
- `welcome` - Day 0: Welcome email with feature overview
- `premium_case_study` - Day 3: Success story showcasing premium value
- `upgrade_offer` - Day 7: Limited-time 20% off offer

**Premium User Sequence:**
- `premium_welcome` - Day 0: Premium activation confirmation
- `tips` - Day 7: Pro tips for faster appointment booking

**Churn Prevention & Win-Back:**
- `pause_offer` - Immediate: Sent on subscription cancellation
- `win_back` - Day 30 after churn: 50% off reactivation offer

### 2. Email Sequence Logic (`backend/src/worker.js`)

**`sendEmailSequences()` Function:**
- Runs every 12 hours (rate-limited via KV timestamp)
- Processes all subscribers with KV-based sequence state
- Sends emails based on:
  - Days since registration
  - User tier (free vs premium)
  - Current sequence stage
  - Time since last email (min 12 hours)

**Sequence Flow:**

*Free Users:*
```
Day 0 (< 12 hours) → Welcome email (stage 0 → 1)
Day 3+ → Premium case study (stage 1 → 2)
Day 7+ → Upgrade offer with 20% discount (stage 2 → 3)
```

*Premium Users:*
```
Day 0 (< 12 hours) → Premium welcome (stage 0 → 1)
Day 7+ → Pro tips (stage 1 → 2)
```

*Churned Users:*
```
Immediate → Pause offer (subscription.deleted webhook)
Day 30+ → Win-back email with 50% off (stage: winBackSent flag)
```

### 3. Email Open Tracking

**`handleResendWebhook()` Function:**
- Receives `email.opened` events from Resend
- Stores open data in KV: `email_opened:{email}`
- Tracks email ID, timestamp, total opens
- Keeps last 100 opens per user

### 4. Stripe Webhook Enhancement

Updated `customer.subscription.deleted` handler to:
- Downgrade user to free tier
- Create churn record in KV: `churn:{email}`
- Send immediate `pause_offer` email
- Track cancellation timestamp for win-back timing

### 5. Worker Configuration

**Cron Triggers:**
- Existing: `*/2 * * * *` (every 2 minutes) - slot checks
- Email sequences: Rate-limited to every 12 hours via KV check

**Scheduled Handler:**
```javascript
async scheduled(event, env, ctx) {
  ctx.waitUntil(Promise.all([
    checkAllSubscribers(env),
    sendEmailSequences(env),
  ]));
}
```

## KV Data Structure

### Email Sequence State
```javascript
Key: email_sequence:{email}
Value: {
  stage: 0-3,           // Current sequence stage
  lastSent: timestamp   // Last email sent time (ms)
}
```

### Churn Tracking
```javascript
Key: churn:{email}
Value: {
  canceledAt: timestamp,
  email: string,
  winBackSent: boolean  // Flag to prevent duplicate win-back emails
}
```

### Email Open Tracking
```javascript
Key: email_opened:{email}
Value: {
  opens: [
    { emailId: string, timestamp: number }
  ],
  totalOpens: number
}
```

## Acceptance Criteria ✅

1. ✅ Cron runs every 12 hours (rate-limited via KV)
2. ✅ Free users receive Day 0/3/7 emails
3. ✅ Premium users receive onboarding emails (Day 0, Day 7)
4. ✅ Churn webhook triggers pause offer immediately
5. ✅ Win-back sends after 30 days
6. ✅ Email open rates tracked in KV
7. ✅ No duplicate sends (sequence state prevents re-send with stage tracking and hoursSinceLastEmail check)

## Email Preview Features

All emails include:
- Mobile-responsive design (max-width: 600px)
- Inline CSS for email client compatibility
- Brand colors (#1e3a5f, #22c55e, #3b82f6)
- Clear CTAs with button styling
- Professional gradients and visual hierarchy
- Privacy-first unsubscribe handling

## Deployment Checklist

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install resend
   ```

2. **Set Resend API Key:**
   ```bash
   wrangler secret put RESEND_API_KEY
   ```
   Enter your Resend API key when prompted.

3. **Configure Resend Webhooks:**
   - Go to Resend dashboard → Webhooks
   - Add endpoint: `https://api.nexus-alert.com/api/webhooks/resend`
   - Select event: `email.opened`

4. **Deploy Worker:**
   ```bash
   wrangler deploy
   ```

## Email Sending Decisions

### Template Design
- Used professional, conversion-focused copy
- Included social proof in upgrade emails (Sarah's case study)
- Added scarcity/urgency (48-hour offers, "slots disappear in 3-10 minutes")
- Clear value propositions with feature comparison tables

### Timing Strategy
- Day 0 welcome: Immediate engagement
- Day 3 case study: After user experiences free tier limitations
- Day 7 upgrade offer: Optimal conversion window
- 30-day win-back: Standard retention period

### From Address
All drip emails sent from: `NEXUS Alert <alerts@nexus-alert.com>`

## Testing

Manual testing steps:
1. Create test subscriber with `createdAt` timestamp in past
2. Trigger email sequence: `POST /api/check` (will run sendEmailSequences)
3. Verify email received and sequence state updated in KV
4. Test churn flow by canceling subscription in Stripe test mode
5. Verify Resend webhook by sending test email and checking KV

## Performance Considerations

- Rate limiting prevents excessive KV reads (12-hour interval)
- Individual email failures don't block sequence processing (try-catch per user)
- Email open tracking limited to last 100 opens (prevents KV bloat)
- Sequence state updated only on successful send

## Future Enhancements

Potential additions:
1. A/B testing for email subject lines
2. Click tracking for CTA buttons
3. Personalized send times based on user timezone
4. Engagement scoring (open rate + click rate)
5. Re-engagement emails for inactive free users
6. Referral program integration in email footers
