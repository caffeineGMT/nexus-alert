# Churn Prevention & Win-Back Campaign Setup

This document details the complete setup for the automated churn reduction system targeting 10%+ reactivation rate.

## System Overview

When a customer cancels their subscription:
1. **Immediate**: Exit survey email sent via Resend
2. **Day 7**: Win-back email with 50% off promo code (COMEBACK50)
3. **Day 30**: Feature update email with reactivation link

## Architecture

```
Stripe Webhook (customer.subscription.deleted)
    ↓
Cloudflare Worker (handleStripeWebhook)
    ↓
Churn Handler (handleChurn)
    ├── Tag in ConvertKit (churned)
    ├── Store in KV (churn data)
    ├── Send exit survey email (Resend)
    └── Add to ConvertKit sequence (win-back)
```

## Files Created/Modified

### Backend (Cloudflare Worker)
- ✅ `backend/src/handlers/churn.js` - Core churn handling logic
- ✅ `backend/src/worker.js` - Webhook handler updated, new API routes added
- ✅ `backend/src/email-templates/index.js` - 3 new templates added

### Frontend (Next.js)
- ✅ `web/src/app/exit-survey/page.tsx` - Exit survey form
- ✅ `web/src/app/api/exit-survey/route.ts` - Survey API proxy
- ✅ `web/src/app/api/reactivate/route.ts` - Reactivation API proxy

## Setup Instructions

### 1. Stripe Setup

#### Create Promo Code (COMEBACK50)

1. Go to Stripe Dashboard → Products → Coupons
2. Click "Create Coupon"
3. Configure:
   - **Name**: Win-Back 50% Off
   - **ID**: `comeback50` (or auto-generated)
   - **Discount**: 50% off
   - **Duration**: Repeating (3 months)
   - **Max redemptions**: 100
4. Copy the Coupon ID (e.g., `promo_1xxxxx`)
5. Add to `wrangler.toml`:
   ```toml
   [vars]
   STRIPE_WINBACK_COUPON_ID = "promo_1xxxxx"
   ```

#### Verify Webhook Events

Ensure your Stripe webhook (already configured at `/api/webhook`) includes:
- `customer.subscription.deleted` ✅
- `checkout.session.completed` (already exists) ✅

### 2. ConvertKit Setup

#### Create Tags

1. Login to ConvertKit dashboard
2. Navigate to **Grow** → **Tags**
3. Create two new tags:
   - **churned** - For users who canceled
   - **reactivated** - For users who came back
4. Note the Tag IDs (found in URL when editing tag, e.g., `https://app.convertkit.com/tags/123456`)

#### Create Win-Back Sequence

1. Navigate to **Automate** → **Sequences**
2. Click "Create Sequence"
3. Name: **Win-Back Campaign**
4. Add 3 emails:

**Email 1: Immediate (handled by Resend)**
- Skip this in ConvertKit - handled by `exit_survey` template via Resend

**Email 2: Day 7 - 50% Off Offer**
- **Delay**: Wait 7 days after subscriber added
- **Subject**: Come back for 50% off — Limited time offer
- **Content**: Use the `win_back_day7` template content from `email-templates/index.js`
- Key elements:
  - Large "50% OFF" badge
  - Promo code COMEBACK50 in yellow highlight
  - "Reactivate Now" CTA button → `https://nexus-alert.com/pricing?promo=COMEBACK50`

**Email 3: Day 30 - Feature Updates**
- **Delay**: Wait 30 days after subscriber added (23 days after Email 2)
- **Subject**: New features since you left + special offer
- **Content**: Use the `win_back_day30` template content from `email-templates/index.js`
- Key elements:
  - 3 feature cards with icons (faster notifications, new locations, smart filters)
  - "Reactivate Your Account" CTA → `https://nexus-alert.com/pricing`

5. Copy the Sequence ID (found in URL, e.g., `https://app.convertkit.com/sequences/123456`)

#### Add Secrets to Cloudflare

```bash
cd backend
wrangler secret put CONVERTKIT_TAG_CHURNED
# Paste tag ID for "churned" tag

wrangler secret put CONVERTKIT_TAG_REACTIVATED
# Paste tag ID for "reactivated" tag

wrangler secret put CONVERTKIT_WINBACK_SEQUENCE_ID
# Paste sequence ID for win-back campaign

wrangler secret put CONVERTKIT_API_KEY
# Paste your ConvertKit API key (Settings → Account → API Key)
```

### 3. Environment Variables Summary

#### wrangler.toml (vars section)
```toml
[vars]
STRIPE_WINBACK_COUPON_ID = "promo_1xxxxx"  # From Step 1
```

#### Cloudflare Secrets (via wrangler secret put)
```
CONVERTKIT_TAG_CHURNED           # Tag ID for churned users
CONVERTKIT_TAG_REACTIVATED       # Tag ID for reactivated users
CONVERTKIT_WINBACK_SEQUENCE_ID   # Sequence ID for drip campaign
CONVERTKIT_API_KEY               # ConvertKit API key
STRIPE_SECRET_KEY                # Already configured
RESEND_API_KEY                   # Already configured
```

### 4. Deploy

```bash
# Backend
cd backend
npm run deploy

# Frontend (auto-deploys via Vercel)
git add -A
git commit -m "Add churn prevention system with exit survey and win-back campaign"
git push origin main
```

## User Flow

### Cancellation Flow
1. User cancels subscription in Stripe
2. Stripe fires `customer.subscription.deleted` webhook
3. Worker receives webhook → calls `handleChurn(email, env)`
4. User immediately receives exit survey email
5. User clicks survey link → fills out form at `/exit-survey`
6. Response stored in KV (`churn:{email}`)
7. User tagged as "churned" in ConvertKit
8. User added to win-back sequence

### Win-Back Flow (Day 7)
1. ConvertKit sends 50% off email (Email 2 in sequence)
2. User clicks "Reactivate Now" → lands on `/pricing?promo=COMEBACK50`
3. User proceeds to checkout
4. Frontend calls `/api/reactivate` with email + promo code
5. Backend creates Stripe checkout session with COMEBACK50 coupon applied
6. User completes payment → subscription reactivated
7. User tagged as "reactivated" in ConvertKit

### Win-Back Flow (Day 30)
1. ConvertKit sends feature update email (Email 3 in sequence)
2. User clicks "Reactivate Your Account" → lands on `/pricing`
3. User proceeds to checkout at regular price
4. Standard checkout flow (no promo code)

## Exit Survey Form Design

### Layout
- Centered card (max 480px width)
- Vertical form layout
- Header: "We're sorry to see you go"
- Radio button list (5 options)
- Optional textarea
- Submit button
- Thank you state (replaces form after submit)

### Cancellation Reasons
1. Too expensive
2. Already found an appointment
3. Didn't see enough value
4. Technical issues
5. Other

### Thank You State
- Green checkmark icon (48px)
- "Thanks for your feedback"
- "Change your mind? [Reactivate]" link → `/pricing?email={email}`

## Analytics & Monitoring

### KV Storage Schema

**Churn Event** (`churn:{email}`)
```json
{
  "email": "user@example.com",
  "churned_at": 1710801234567,
  "reason": "too_expensive",
  "feedback": "Optional user feedback text",
  "survey_sent": true,
  "survey_completed_at": 1710801456789,
  "winback_sequence_added": true,
  "reactivation_attempted": true,
  "reactivation_at": 1711405678901,
  "promo_code_used": "COMEBACK50"
}
```

**Churn Reasons Aggregate** (`churn_reasons_aggregate`)
```json
{
  "too_expensive": 45,
  "found_appointment": 32,
  "no_value": 18,
  "technical_issues": 5,
  "other": 12,
  "last_updated": "2026-03-18T12:00:00Z"
}
```

### Metrics to Track

1. **Churn Rate**: `churned_users / total_premium_users`
2. **Survey Completion Rate**: `surveys_completed / exit_surveys_sent`
3. **Day 7 Win-Back Rate**: `reactivations_within_7days / churned_users`
4. **Day 30 Win-Back Rate**: `reactivations_within_30days / churned_users`
5. **Overall Reactivation Rate**: `total_reactivations / churned_users` (Target: 10%+)
6. **Promo Code Usage**: `COMEBACK50_redemptions / total_reactivations`

### Dashboard Queries

```javascript
// Get all churn events from last 30 days
const churnList = await env.NEXUS_ALERTS_KV.list({ prefix: 'churn:' });

// Calculate reactivation rate
const reactivated = churnList.keys.filter(async (key) => {
  const data = JSON.parse(await env.NEXUS_ALERTS_KV.get(key.name));
  return data.reactivation_attempted === true;
}).length;

const reactivationRate = (reactivated / churnList.keys.length) * 100;
console.log(`Reactivation Rate: ${reactivationRate.toFixed(2)}%`);
```

## Testing

### Test Subscription Cancellation

1. Create test subscription in Stripe Test Mode
2. Cancel subscription via Stripe Dashboard
3. Verify webhook fires → check Cloudflare Worker logs
4. Check email inbox for exit survey
5. Click link → verify survey form loads
6. Submit survey → check KV storage
7. Wait for Day 7 email (or manually trigger via ConvertKit)
8. Click reactivation link → verify checkout with 50% discount

### Manual Testing Commands

```bash
# Check churn data in KV
wrangler kv:key get --binding=NEXUS_ALERTS_KV "churn:test@example.com"

# View churn reasons aggregate
wrangler kv:key get --binding=NEXUS_ALERTS_KV "churn_reasons_aggregate"

# List all churn events
wrangler kv:key list --binding=NEXUS_ALERTS_KV --prefix="churn:"
```

## Success Criteria

✅ When user cancels subscription, Stripe webhook fires `customer.subscription.deleted`
✅ Exit survey email sent immediately via Resend
✅ User tagged as 'churned' in ConvertKit
✅ Churn event stored in KV with timestamp
✅ Win-back emails sent automatically at Day 7 (50% off) and Day 30 (feature updates)
✅ Exit survey form captures cancellation reason, stored in KV
✅ Reactivation link creates new checkout session with COMEBACK50 coupon applied
✅ After 30 days, measure: `reactivation_rate = reactivated_count / churned_count` (target: 10%+)

## Troubleshooting

### Exit Survey Email Not Sending
- Check Resend API key is valid: `wrangler secret list`
- Check Worker logs for errors
- Verify `RESEND_API_KEY` is set

### ConvertKit Sequence Not Triggering
- Verify sequence ID is correct
- Check that user was successfully added to sequence (ConvertKit dashboard)
- Ensure API key has permissions

### Promo Code Not Applying
- Check `STRIPE_WINBACK_COUPON_ID` in wrangler.toml
- Verify coupon exists in Stripe Dashboard
- Check coupon hasn't reached max redemptions

### Survey Form Not Loading
- Verify Next.js deployment succeeded on Vercel
- Check browser console for errors
- Verify email parameter is passed in URL

## Future Enhancements

1. **A/B Testing**: Test different discount amounts (40% vs 50%)
2. **Personalized Timing**: Send win-back at optimal time based on user behavior
3. **Targeted Offers**: Different discounts based on cancellation reason
4. **Lifecycle Emails**: Additional nurture emails at 60, 90 days
5. **Re-engagement Survey**: Follow-up survey for non-reactivated users
6. **Slack Notifications**: Alert team when high-value customers churn

## Revenue Impact Projection

Assumptions:
- Monthly churn rate: 5% (industry average)
- Average LTV per customer: $60 (12 months × $4.99)
- Current monthly premium users: 500
- Churned users per month: 25 (500 × 5%)

**Without Win-Back System:**
- Monthly lost revenue: $124.75 (25 × $4.99)
- Annual lost revenue: $1,497

**With 10% Win-Back Rate:**
- Reactivated users per month: 2.5 (25 × 10%)
- Recovered monthly revenue: $12.48 (2.5 × $4.99)
- Recovered annual revenue: $149.70
- **ROI**: 10:1 (minimal dev cost vs recovered revenue)

**With 20% Win-Back Rate (stretch goal):**
- Reactivated users per month: 5 (25 × 20%)
- Recovered monthly revenue: $24.95
- Recovered annual revenue: $299.40
- Additional lifetime value: ~$300 (5 users × $60 LTV)
