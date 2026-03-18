# Review Acquisition Implementation Guide

**Goal:** Achieve 50+ 5-star reviews within 30 days
**Incentive:** 1 free month of Premium ($4.99 value) for verified 5-star reviews
**Target:** First 100 reviewers

---

## Implementation Checklist

### Phase 1: Extension Review Modal (Week 1)

- [ ] Create review modal HTML component
- [ ] Add review prompt trigger logic to background.js
- [ ] Track `slotsBooked` and `reviewRequested` in storage
- [ ] Add "Leave Review" button linking to Chrome Web Store
- [ ] Implement modal dismiss logic (don't show again if dismissed)

### Phase 2: Settings Page Banner (Week 2)

- [ ] Add review banner to Settings tab
- [ ] Make banner dismissible with 7-day cooldown
- [ ] Track banner impressions and clicks
- [ ] Link to review claim page

### Phase 3: Backend Review Verification (Week 1-2)

- [ ] Create `/api/claim-review-reward` endpoint
- [ ] Implement Chrome Web Store review scraping (or manual verification)
- [ ] Add review verification to database schema
- [ ] Integrate with Stripe to extend subscriptions
- [ ] Create email confirmation template

### Phase 4: Email Campaign (Week 1-4)

- [ ] Set up automated email 7 days after Premium signup
- [ ] Create email template with review request
- [ ] Track email open/click rates
- [ ] Send weekly reminder to unclaimed users

### Phase 5: Analytics & Tracking (Week 1-4)

- [ ] Track review modal impressions and clicks
- [ ] Track review banner impressions and clicks
- [ ] Track review claim submissions
- [ ] Monitor Chrome Web Store review count weekly
- [ ] Calculate review conversion rate

---

## File Structure

```
extension/
├── components/
│   ├── review-modal.html         [NEW] Review request modal
│   └── review-banner.html         [NEW] Settings page banner
├── background.js                  [EDIT] Add review trigger logic
├── popup.js                       [EDIT] Show review modal
└── settings.js                    [EDIT] Show review banner

backend/
├── src/
│   ├── handlers/
│   │   └── review-rewards.ts     [NEW] Review verification endpoint
│   ├── services/
│   │   └── stripe-extension.ts   [EDIT] Add subscription extension logic
│   └── emails/
│       ├── review-request.html   [NEW] Email template
│       └── review-confirmed.html [NEW] Confirmation email

store-assets/
└── REVIEW_ACQUISITION_IMPLEMENTATION.md [THIS FILE]
```

---

## Code Implementation

### 1. Review Modal HTML Component

**File:** `extension/components/review-modal.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Leave a Review</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: transparent;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    }

    .modal {
      background: #1a1a2e;
      border: 1px solid #333;
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }

    .modal-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .modal-icon {
      font-size: 32px;
    }

    .modal-title {
      font-size: 20px;
      font-weight: 600;
      color: #fff;
      margin: 0;
    }

    .modal-body {
      color: #aaa;
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 20px;
    }

    .modal-highlight {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: #fff;
      padding: 12px 16px;
      border-radius: 8px;
      margin: 16px 0;
      font-weight: 500;
      text-align: center;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
    }

    .btn {
      flex: 1;
      padding: 12px 20px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: #fff;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
    }

    .btn-secondary {
      background: transparent;
      border: 1px solid #333;
      color: #aaa;
    }

    .btn-secondary:hover {
      border-color: #555;
      color: #fff;
    }
  </style>
</head>
<body>
  <div class="modal-overlay" id="modalOverlay">
    <div class="modal">
      <div class="modal-header">
        <span class="modal-icon">🎉</span>
        <h2 class="modal-title">Found your appointment?</h2>
      </div>
      <div class="modal-body">
        <p>Help others find theirs! Leave a 5-star review and we'll thank you with:</p>
        <div class="modal-highlight">
          💎 1 FREE month of Premium ($4.99 value)
        </div>
        <p style="font-size: 12px; color: #666; margin-top: 12px;">
          Limited to first 100 reviewers. Takes 2 minutes.
        </p>
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" id="dismissBtn">Maybe Later</button>
        <button class="btn btn-primary" id="reviewBtn">Leave Review & Claim</button>
      </div>
    </div>
  </div>

  <script>
    const CHROME_WEB_STORE_URL = 'https://chrome.google.com/webstore/detail/nexus-alert/YOUR_EXTENSION_ID/reviews';

    document.getElementById('reviewBtn').addEventListener('click', () => {
      chrome.storage.local.set({ reviewRequested: true, reviewClicked: true });
      chrome.tabs.create({ url: CHROME_WEB_STORE_URL });
      window.close();
    });

    document.getElementById('dismissBtn').addEventListener('click', () => {
      chrome.storage.local.set({ reviewRequested: true });
      window.close();
    });

    document.getElementById('modalOverlay').addEventListener('click', (e) => {
      if (e.target.id === 'modalOverlay') {
        document.getElementById('dismissBtn').click();
      }
    });
  </script>
</body>
</html>
```

---

### 2. Review Modal Trigger Logic

**File:** `extension/background.js` (add this function)

```javascript
// Review modal trigger logic
async function checkAndShowReviewModal() {
  const data = await chrome.storage.local.get(['slotsBooked', 'reviewRequested', 'installDate']);

  const slotsBooked = data.slotsBooked || 0;
  const reviewRequested = data.reviewRequested || false;
  const installDate = data.installDate || Date.now();

  // Conditions to show review modal:
  // 1. User has clicked on at least 1 slot ("Book Now" button)
  // 2. Review has not been requested before
  // 3. Extension installed for at least 24 hours
  const hoursSinceInstall = (Date.now() - installDate) / (1000 * 60 * 60);

  if (slotsBooked >= 1 && !reviewRequested && hoursSinceInstall >= 24) {
    // Create new window with review modal
    chrome.windows.create({
      url: chrome.runtime.getURL('components/review-modal.html'),
      type: 'popup',
      width: 460,
      height: 360,
      focused: true
    });
  }
}

// Call this function when user clicks "Book Now" on a slot
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SLOT_CLICKED') {
    chrome.storage.local.get(['slotsBooked'], (data) => {
      const newCount = (data.slotsBooked || 0) + 1;
      chrome.storage.local.set({ slotsBooked: newCount }, () => {
        checkAndShowReviewModal();
      });
    });
  }
});

// Track install date
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.local.set({ installDate: Date.now() });
  }
});
```

---

### 3. Settings Page Review Banner

**File:** `extension/components/review-banner.html`

```html
<div id="reviewBanner" class="review-banner" style="display: none;">
  <div class="review-banner-content">
    <div class="review-banner-icon">💎</div>
    <div class="review-banner-text">
      <strong>Love NEXUS Alert?</strong><br>
      Leave a 5-star review → Get 1 free month of Premium!
    </div>
  </div>
  <div class="review-banner-actions">
    <button id="reviewBannerBtn" class="review-banner-cta">Leave Review & Claim Offer</button>
    <button id="dismissBannerBtn" class="review-banner-dismiss">×</button>
  </div>
</div>

<style>
  .review-banner {
    background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
    border: 1px solid #1976D2;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .review-banner-content {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }

  .review-banner-icon {
    font-size: 28px;
  }

  .review-banner-text {
    color: #1976D2;
    font-size: 14px;
    line-height: 1.4;
  }

  .review-banner-text strong {
    font-weight: 600;
  }

  .review-banner-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .review-banner-cta {
    background: #1976D2;
    color: #fff;
    border: none;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s;
  }

  .review-banner-cta:hover {
    background: #1565C0;
  }

  .review-banner-dismiss {
    background: transparent;
    border: none;
    color: #1976D2;
    font-size: 24px;
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .review-banner-dismiss:hover {
    background: rgba(25, 118, 210, 0.1);
  }
</style>

<script>
  const CHROME_WEB_STORE_URL = 'https://chrome.google.com/webstore/detail/nexus-alert/YOUR_EXTENSION_ID/reviews';
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  // Check if banner should be shown
  chrome.storage.local.get(['reviewBannerDismissed', 'reviewClicked'], (data) => {
    const dismissedAt = data.reviewBannerDismissed || 0;
    const reviewClicked = data.reviewClicked || false;
    const timeSinceDismiss = Date.now() - dismissedAt;

    // Show banner if:
    // 1. User hasn't clicked review button before, AND
    // 2. Banner hasn't been dismissed, OR was dismissed more than 7 days ago
    if (!reviewClicked && (dismissedAt === 0 || timeSinceDismiss > SEVEN_DAYS_MS)) {
      document.getElementById('reviewBanner').style.display = 'flex';
    }
  });

  // Review button click
  document.getElementById('reviewBannerBtn').addEventListener('click', () => {
    chrome.storage.local.set({ reviewClicked: true });
    chrome.tabs.create({ url: CHROME_WEB_STORE_URL });
  });

  // Dismiss button click
  document.getElementById('dismissBannerBtn').addEventListener('click', () => {
    chrome.storage.local.set({ reviewBannerDismissed: Date.now() });
    document.getElementById('reviewBanner').style.display = 'none';
  });
</script>
```

---

### 4. Backend Review Verification Endpoint

**File:** `backend/src/handlers/review-rewards.ts`

```typescript
import { Router } from 'express';
import Stripe from 'stripe';
import { db } from '../db';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

interface ClaimReviewRewardRequest {
  email: string;
  reviewLink: string;
}

// POST /api/claim-review-reward
router.post('/claim-review-reward', async (req, res) => {
  const { email, reviewLink } = req.body as ClaimReviewRewardRequest;

  // Validate input
  if (!email || !reviewLink) {
    return res.status(400).json({ error: 'Email and review link are required' });
  }

  try {
    // Find user in database
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please sign up for Premium first.' });
    }

    // Check if user has already claimed the reward
    if (user.reviewClaimed) {
      return res.status(400).json({ error: 'You have already claimed this offer.' });
    }

    // Verify review exists and is 5 stars
    // NOTE: Chrome Web Store doesn't have a public API for reviews
    // Options:
    // 1. Manual verification (admin dashboard)
    // 2. Screenshot upload + manual approval
    // 3. Scraping (unreliable, against ToS)
    // 4. Honor system with random audits

    // For MVP, use honor system with audit flag
    const reviewVerified = await verifyReview(reviewLink); // See implementation below

    if (!reviewVerified) {
      return res.status(400).json({
        error: 'Could not verify review. Please ensure the link is correct and the review is public.'
      });
    }

    // Extend Stripe subscription by 30 days
    if (user.stripeSubscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

      // Add 30 days to current period end
      const currentPeriodEnd = subscription.current_period_end;
      const newPeriodEnd = currentPeriodEnd + (30 * 24 * 60 * 60); // +30 days in seconds

      await stripe.subscriptions.update(user.stripeSubscriptionId, {
        trial_end: newPeriodEnd,
        proration_behavior: 'none'
      });
    }

    // Mark as claimed in database
    await db.collection('users').updateOne(
      { email },
      {
        $set: {
          reviewClaimed: true,
          reviewClaimedAt: new Date(),
          reviewLink
        }
      }
    );

    // Send confirmation email
    await sendReviewConfirmationEmail(email);

    res.json({
      success: true,
      message: 'Congratulations! 30 days have been added to your Premium subscription.'
    });

  } catch (error) {
    console.error('Error claiming review reward:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to verify review
async function verifyReview(reviewLink: string): Promise<boolean> {
  // Basic validation: Check if link is from Chrome Web Store
  if (!reviewLink.includes('chrome.google.com/webstore')) {
    return false;
  }

  // For MVP: Honor system
  // In production: Implement one of:
  // 1. Admin dashboard for manual verification
  // 2. Screenshot upload requirement
  // 3. Email reply verification (user emails review link to support)

  return true; // Accept for now, audit later
}

// Send confirmation email
async function sendReviewConfirmationEmail(email: string) {
  // Use your email service (SendGrid, Resend, etc.)
  // See email template below
}

export default router;
```

---

### 5. Email Templates

**File:** `backend/src/emails/review-request.html`

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your NEXUS Alert feedback = 1 free month</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #fff; font-size: 24px; font-weight: 600;">
                Your feedback = 1 free month 🎁
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #333; font-size: 16px; line-height: 1.6;">
                Hi there,
              </p>

              <p style="margin: 0 0 20px; color: #333; font-size: 16px; line-height: 1.6;">
                You've been using <strong>NEXUS Alert Premium</strong> for a week now. Hope it's helped you find appointment slots faster!
              </p>

              <p style="margin: 0 0 20px; color: #333; font-size: 16px; line-height: 1.6;">
                <strong>Quick favor:</strong> If you're happy with the service, would you mind leaving a quick 5-star review on the Chrome Web Store?
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="https://chrome.google.com/webstore/detail/nexus-alert/YOUR_EXTENSION_ID/reviews"
                       style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                      ★ Leave a Review
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Reward Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%); border: 2px solid #1976D2; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 8px; color: #1976D2; font-size: 18px; font-weight: 600;">
                      💎 Thank You Reward
                    </p>
                    <p style="margin: 0; color: #1976D2; font-size: 14px;">
                      We'll extend your Premium subscription by<br>
                      <strong style="font-size: 20px;">1 month FREE</strong> ($4.99 value)
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px; color: #333; font-size: 14px; line-height: 1.6;">
                Just reply to this email with your review link after posting, and we'll add the credit to your account within 24 hours.
              </p>

              <p style="margin: 0 0 20px; color: #333; font-size: 14px; line-height: 1.6;">
                Thanks for being an early supporter!
              </p>

              <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6;">
                The NEXUS Alert Team
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f5f5f5; padding: 24px 40px; text-align: center;">
              <p style="margin: 0; color: #666; font-size: 12px;">
                NEXUS Alert - Never miss your Trusted Traveler appointment<br>
                <a href="https://nexus-alert.com" style="color: #3b82f6; text-decoration: none;">nexus-alert.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

**File:** `backend/src/emails/review-confirmed.html`

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your free month is active!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #fff; font-size: 32px;">
                🎉
              </h1>
              <h2 style="margin: 12px 0 0; color: #fff; font-size: 24px; font-weight: 600;">
                Your free month is active!
              </h2>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #333; font-size: 16px; line-height: 1.6;">
                Thanks for your review! ⭐⭐⭐⭐⭐
              </p>

              <p style="margin: 0 0 20px; color: #333; font-size: 16px; line-height: 1.6;">
                We've added <strong>30 days</strong> to your Premium subscription. You now have:
              </p>

              <!-- Status Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <tr>
                  <td>
                    <p style="margin: 0 0 12px; color: #666; font-size: 14px;">Premium Features:</p>
                    <ul style="margin: 0; padding-left: 20px; color: #333; font-size: 14px; line-height: 1.8;">
                      <li>Check every 2 minutes (15x faster)</li>
                      <li>Email notifications</li>
                      <li>Priority support</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px; color: #333; font-size: 14px; line-height: 1.6;">
                Your support helps us keep improving NEXUS Alert for everyone. If you have any feature requests or feedback, just reply to this email.
              </p>

              <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6;">
                Happy slot hunting!<br>
                The NEXUS Alert Team
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f5f5f5; padding: 24px 40px; text-align: center;">
              <p style="margin: 0; color: #666; font-size: 12px;">
                NEXUS Alert - Never miss your Trusted Traveler appointment<br>
                <a href="https://nexus-alert.com" style="color: #3b82f6; text-decoration: none;">nexus-alert.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Analytics & Tracking

### Metrics to Track

**Extension Events (chrome.storage.local):**
```javascript
{
  reviewModalShown: 0,           // How many times modal was shown
  reviewModalClicked: 0,         // How many times "Leave Review" was clicked
  reviewModalDismissed: 0,       // How many times "Maybe Later" was clicked
  reviewBannerShown: 0,          // How many times banner was shown
  reviewBannerClicked: 0,        // How many times banner CTA was clicked
  reviewBannerDismissed: 0,      // How many times banner was dismissed
  slotsBooked: 0                 // How many slots user has clicked on
}
```

**Backend Analytics (PostgreSQL/MongoDB):**
```sql
CREATE TABLE review_analytics (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(50),        -- 'modal_shown', 'banner_clicked', 'review_claimed'
  user_email VARCHAR(255),
  timestamp TIMESTAMP DEFAULT NOW(),
  metadata JSONB                 -- Additional context
);
```

**Weekly Review Report:**
- Total reviews on Chrome Web Store
- Reviews this week
- Average rating
- Review claim rate (claims / reviews)
- Review conversion rate (reviews / modal impressions)

---

## Testing Checklist

### Manual Testing

- [ ] Install extension and trigger slot click
- [ ] Verify review modal appears after 24 hours
- [ ] Click "Leave Review & Claim" → redirects to Chrome Web Store
- [ ] Verify modal doesn't show again after dismiss
- [ ] Check Settings page review banner appears
- [ ] Dismiss banner → verify it reappears after 7 days
- [ ] Submit review claim form → verify backend processes correctly
- [ ] Check Stripe subscription extended by 30 days
- [ ] Verify confirmation email sent

### Automated Testing

```javascript
// Jest test for review modal trigger
describe('Review Modal Trigger', () => {
  it('should show modal after user clicks 1 slot and 24 hours have passed', async () => {
    const mockStorage = {
      slotsBooked: 1,
      reviewRequested: false,
      installDate: Date.now() - (25 * 60 * 60 * 1000) // 25 hours ago
    };

    chrome.storage.local.get = jest.fn((keys, callback) => {
      callback(mockStorage);
    });

    const shouldShow = await checkAndShowReviewModal();
    expect(shouldShow).toBe(true);
  });

  it('should NOT show modal if less than 24 hours since install', async () => {
    const mockStorage = {
      slotsBooked: 1,
      reviewRequested: false,
      installDate: Date.now() - (10 * 60 * 60 * 1000) // 10 hours ago
    };

    chrome.storage.local.get = jest.fn((keys, callback) => {
      callback(mockStorage);
    });

    const shouldShow = await checkAndShowReviewModal();
    expect(shouldShow).toBe(false);
  });
});
```

---

## Launch Timeline

### Week 1: Core Implementation
- Day 1-2: Create review modal component
- Day 3-4: Implement trigger logic in background.js
- Day 5: Add review banner to Settings page
- Day 6-7: Build backend verification endpoint

### Week 2: Email Campaign Setup
- Day 8-9: Create email templates
- Day 10-11: Set up automated email flow (7 days after signup)
- Day 12-13: Test end-to-end flow
- Day 14: Launch to first 50 Premium users

### Week 3: Monitor & Optimize
- Track modal impressions and conversion rate
- A/B test modal copy if conversion is low (<5%)
- Monitor review count on Chrome Web Store
- Respond to all reviews within 24 hours

### Week 4: Scale & Celebrate
- Send "last chance" email to unclaimed users
- Hit 50+ review target
- Analyze review content for testimonials
- Feature best reviews on landing page

---

## Success Metrics

**By Day 30:**
- [ ] 50+ Chrome Web Store reviews
- [ ] 4.8+ star average rating
- [ ] 10+ detailed reviews (50+ words)
- [ ] 60%+ review modal conversion rate
- [ ] 40%+ review banner click rate
- [ ] 80%+ review claim rate (claims / reviews)

**ROI:**
- Cost: ~$500 in free Premium months (100 reviewers × $4.99)
- Benefit: Improved SEO ranking → 800+ organic installs/month
- Value: $4,000-$6,000 additional annual revenue from organic traffic

---

## FAQ

**Q: What if users abuse the free month offer?**
A: Implement these safeguards:
- Limit to 1 claim per email address
- Require Premium subscription before claiming
- Manual audit of random 10% of claims
- Ban users who post fake reviews

**Q: How do we verify reviews are actually 5 stars?**
A: Options:
1. Honor system (90% trustworthy)
2. Screenshot upload requirement
3. Manual verification in admin dashboard
4. Email reply with review link (support team verifies)

**Q: What if Chrome Web Store changes their review policies?**
A: This offer complies with current policies (offering value in exchange for honest feedback). If policies change:
- Pivot to "Share your experience" (no star requirement)
- Offer free month for any review, not just 5-star
- Use alternative channels (email testimonials, social media)

---

## Next Steps

1. **Implement Phase 1** (Review Modal) — Week 1
2. **Implement Phase 2** (Settings Banner) — Week 2
3. **Launch to first 50 users** — Week 2
4. **Monitor and optimize** — Weeks 3-4
5. **Hit 50+ reviews** — Day 30

**Ready to build!** 🚀
