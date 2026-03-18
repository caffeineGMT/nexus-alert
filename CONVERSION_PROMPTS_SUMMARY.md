# Contextual Upgrade Prompts — Implementation Summary

## Overview
Added UTM tracking and event analytics to the three existing conversion triggers to optimize free-to-paid conversion rates.

## Implementation

### 1. Modal After Manual "Check Now" (✅ Complete)
**Trigger**: User clicks "Check Now" button on Monitor tab
**Condition**: Free tier users only
**Location**: `popup.js:386-393`

**Features**:
- Shows modal with premium value proposition
- Displays stat: "Premium checks every 2 minutes"
- Highlights urgency: "Slots fill in <5 min on average"
- Stat card: "87% faster slot discovery • Premium: 4.2 days avg • Free: 12.1 days avg"
- UTM tracking: `utm_source=extension&utm_medium=modal&utm_campaign=manual_check`
- Event tracking: `upgrade_modal_shown` (impression), `upgrade_modal_clicked` (conversion)

**User Flow**:
1. User clicks "Check Now" → extension checks for slots
2. If user is on free tier → modal appears
3. User clicks "Upgrade Now" → opens pricing page with UTM params
4. Event logged to backend analytics API

### 2. Persistent Banner After 3 Days (✅ Complete)
**Trigger**: Extension installed for 3+ days, banner not dismissed
**Condition**: Free tier users only, `installDate` > 3 days
**Location**: `popup.js:334-345`, `popup.html:608-614`

**Features**:
- Banner text: "You've been monitoring for 3+ days. Upgrade to 2-min checks to find slots 87% faster."
- Positioned below status bar (top of popup)
- Dismissible with "×" button (sets `bannerDismissed` flag)
- UTM tracking: `utm_source=extension&utm_medium=banner&utm_campaign=3day_persistent`
- Event tracking: `upgrade_banner_shown` (with daysSinceInstall), `upgrade_banner_clicked`

**User Flow**:
1. Extension checks `installDate` on popup load
2. If >3 days, not premium, not dismissed → show banner
3. User clicks "Upgrade" → opens pricing page with UTM params
4. User can dismiss with "×" → banner won't show again

### 3. Settings Tab Performance Stats (✅ Complete)
**Location**: `popup.html:812-830` (Settings tab)
**Visibility**: Always visible (all users)

**Content**:
- Section title: "Premium Performance"
- Stat comparison card:
  - **Premium**: 4.2 days average
  - **Free**: 12.1 days average
- Supporting text: "Premium users find slots **87% faster** on average due to 2-minute check intervals vs. 30-minute intervals on the free plan."

**Purpose**: Social proof stat that reinforces value prop without being intrusive. Always visible in Settings tab for reference.

## Technical Architecture

### Event Tracking System
**Backend API Endpoint**: `POST https://api.nexus-alert.com/api/analytics/event`

**Tracked Events**:
1. `upgrade_modal_shown` — Modal impression (includes trigger: "manual_check")
2. `upgrade_modal_clicked` — Modal CTA clicked (includes source: "manual_check")
3. `upgrade_banner_shown` — Banner impression (includes daysSinceInstall)
4. `upgrade_banner_clicked` — Banner CTA clicked (includes source: "3day_persistent")

**Event Payload**:
```json
{
  "event": "upgrade_modal_clicked",
  "data": {
    "source": "manual_check"
  },
  "timestamp": 1710787200000
}
```

### UTM Parameters
All upgrade click-throughs use consistent UTM structure:
- `utm_source=extension` — All clicks originate from extension
- `utm_medium=modal|banner` — Conversion trigger type
- `utm_campaign=manual_check|3day_persistent` — Specific campaign

**Examples**:
- Modal: `https://nexusalert.app/pricing?utm_source=extension&utm_medium=modal&utm_campaign=manual_check`
- Banner: `https://nexusalert.app/pricing?utm_source=extension&utm_medium=banner&utm_campaign=3day_persistent`

### Storage Schema
```javascript
chrome.storage.local = {
  installDate: 1710700000000,  // Set on first install
  bannerDismissed: false,      // True if user clicked dismiss
  config: {
    tier: 'free' | 'premium',  // Determines visibility
    email: 'user@example.com'
  }
}
```

## Files Modified

1. **popup.js** (4 edits)
   - Added UTM params to banner upgrade button (line 350)
   - Added UTM params to modal upgrade button (line 363)
   - Added impression tracking for modal (line 391)
   - Added impression tracking for banner (line 342)

2. **background.js** (1 addition)
   - Added `trackEvent` message handler (lines 399-418)
   - Forwards events to backend analytics API
   - Graceful fallback on network errors

3. **popup.html** (no changes needed)
   - Modal markup already exists (lines 917-930)
   - Banner markup already exists (lines 608-614)
   - Premium stats card already exists (lines 812-830)

## Acceptance Criteria — Status

✅ **Modal appears after manual check for free users**
- Trigger: Line 386-393 in popup.js
- Shows value prop, stat, and CTA
- Tracks impression and click events
- Opens pricing page with UTM: `utm_campaign=manual_check`

✅ **Banner shows after 3 days**
- Trigger: Lines 334-345 in popup.js
- Checks installDate (set in background.js:46)
- Only shows if >3 days, free tier, not dismissed
- Tracks impression and click events
- Opens pricing page with UTM: `utm_campaign=3day_persistent`

✅ **Click-through opens pricing page with UTM tracking**
- All upgrade CTAs include UTM parameters
- Unique campaigns for attribution: `manual_check`, `3day_persistent`
- Analytics events sent to backend for funnel analysis

## Analytics & Conversion Tracking

### Conversion Funnel Metrics
Backend can now track:
1. **Impression Rate**: % of free users who see modal/banner
2. **Click-Through Rate**: % of impressions that result in clicks
3. **Conversion Rate**: % of clicks that result in upgrades (via Stripe webhook + UTM params)

### Attribution Flow
1. User clicks upgrade prompt → UTM params attached
2. User lands on pricing page → UTM logged in session
3. User completes Stripe checkout → webhook includes UTM
4. Backend links conversion to original campaign

### Expected Impact
- **Baseline**: 5% free-to-paid conversion (assumption)
- **Target**: 15% conversion (3x improvement)
- **Key Drivers**:
  - Contextual timing (after manual check = high intent)
  - Social proof (87% faster stat)
  - Urgency messaging (slots fill in <5 min)
  - Persistent reminder (3-day banner)

## Testing

### Manual Test Cases

1. **Modal Trigger Test**
   - Install extension (or set tier to 'free')
   - Click "Check Now" button
   - ✅ Modal should appear
   - ✅ Click "Upgrade Now" → opens `https://nexusalert.app/pricing?utm_source=extension&utm_medium=modal&utm_campaign=manual_check`
   - ✅ Console shows: `Event tracked: upgrade_modal_shown` and `upgrade_modal_clicked`

2. **Banner Trigger Test**
   - Set installDate to 4 days ago: `chrome.storage.local.set({ installDate: Date.now() - (4 * 24 * 60 * 60 * 1000) })`
   - Set tier to 'free'
   - Reload popup
   - ✅ Banner should appear at top
   - ✅ Click "Upgrade" → opens `https://nexusalert.app/pricing?utm_source=extension&utm_medium=banner&utm_campaign=3day_persistent`
   - ✅ Console shows: `Event tracked: upgrade_banner_shown` and `upgrade_banner_clicked`

3. **Banner Dismiss Test**
   - Show banner (as above)
   - Click "×" dismiss button
   - Reload popup
   - ✅ Banner should NOT appear
   - ✅ `chrome.storage.local.bannerDismissed === true`

4. **Premium User Test**
   - Set tier to 'premium': `chrome.storage.local.get('config', d => chrome.storage.local.set({ config: { ...d.config, tier: 'premium' } }))`
   - Click "Check Now"
   - ✅ Modal should NOT appear
   - ✅ Banner should NOT appear (even if >3 days)

5. **Stats Card Test**
   - Navigate to Settings tab
   - Scroll to "Premium Performance" section
   - ✅ Should show stat card: "4.2 days (Premium)" vs "12.1 days (Free)"
   - ✅ Text: "Premium users find slots 87% faster"

### Backend Analytics Test
```bash
# Check backend receives events
curl -X POST https://api.nexus-alert.com/api/analytics/event \
  -H "Content-Type: application/json" \
  -d '{
    "event": "upgrade_modal_clicked",
    "data": { "source": "manual_check" },
    "timestamp": 1710787200000
  }'
```

## Revenue Impact Projection

### Assumptions
- 1,000 free users install extension per month
- 50% see modal at least once (500 impressions)
- 30% see 3-day banner (300 impressions)
- Combined reach: 800 unique users exposed to upgrade prompts

### Conversion Scenarios

**Conservative (5% CTR, 20% conversion)**:
- 800 users × 5% CTR = 40 clicks to pricing page
- 40 clicks × 20% conversion = 8 new premium users/month
- 8 users × $4.99/mo = **$39.92 MRR** (or $479/year)

**Target (10% CTR, 25% conversion)**:
- 800 users × 10% CTR = 80 clicks
- 80 clicks × 25% conversion = 20 new premium users/month
- 20 users × $4.99/mo = **$99.80 MRR** (or $1,198/year)

**Optimistic (15% CTR, 30% conversion)**:
- 800 users × 15% CTR = 120 clicks
- 120 clicks × 30% conversion = 36 new premium users/month
- 36 users × $4.99/mo = **$179.64 MRR** (or $2,156/year)

### Next Optimizations
1. A/B test modal copy (urgency vs. value prop)
2. Add countdown timer to banner ("Upgrade within 24h for X% off")
3. Personalize stats based on user's selected locations (e.g., "Slots in Blaine fill in 3.2 min avg")
4. Add testimonial quotes to modal
5. Show "2 slots found in last hour" live feed to create FOMO

## Deployment Checklist

- [x] UTM tracking added to all upgrade CTAs
- [x] Event tracking implemented (impressions + clicks)
- [x] Backend event handler added to background.js
- [x] Premium stats card visible in Settings tab
- [x] Banner respects 3-day threshold and dismiss state
- [x] Modal only shows for free tier after manual check
- [ ] Backend API endpoint `/api/analytics/event` implemented (backend team)
- [ ] Analytics dashboard to visualize funnel metrics (backend team)
- [ ] Stripe webhook updated to capture UTM params (backend team)

## Completion Status

✅ **All frontend implementation complete**
✅ **All acceptance criteria met**
⏳ **Backend analytics API pending** (required for full tracking)

Extension is ready for production deployment. Backend analytics endpoint should be implemented to capture event data and measure conversion funnel performance.
