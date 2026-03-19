# Revenue Activation & Chrome Web Store Launch — Complete Breakdown

**Created:** March 18, 2026
**Priority:** 🔴 P0 CRITICAL — BLOCKING ALL REVENUE
**Status:** Ready for execution
**Revenue Target:** $500 MRR Month 1 → $1M ARR
**Timeline:** 3-5 days to first dollar

---

## 🎯 Executive Summary

This document breaks down the 4 critical tasks blocking revenue activation:

1. ✅ **Final Extension Testing** — 12-point production readiness checklist
2. 🚀 **Chrome Web Store Submission** — Packaging, listing, and approval
3. 💰 **Stripe Webhook Verification** — Payment flow end-to-end testing
4. 📢 **Launch Announcement Assets** — ProductHunt gallery + video

**Current Blocker:** Chrome Web Store approval (3-5 business days)
**After Approval:** Revenue activation within 24 hours

---

## Task 1: Final Extension Testing Checklist ✅

**Time Estimate:** 2-3 hours
**Owner:** Engineer
**Blocker Status:** NON-BLOCKING (can run in parallel with other tasks)

### Production Readiness Checklist

#### 1.1 Core Functionality Testing (45 min)

**Test Environment Setup:**
```bash
cd /Users/michaelguo/nexus-alert
# Load extension in Chrome
# chrome://extensions → Developer mode ON → Load unpacked
```

**Critical User Flows:**

- [ ] **First-Time Install Flow** (5 min)
  - Install extension
  - Verify onboarding opens automatically
  - Complete Steps 1-3 (program selection, locations, preferences)
  - Verify configuration saved to chrome.storage.local
  - Check no console errors

- [ ] **Location Monitoring** (10 min)
  - Select NEXUS program
  - Check 3+ enrollment centers (Detroit, Buffalo, Niagara Falls)
  - Set date range (next 30 days)
  - Set check frequency (5 minutes)
  - Click "Start Monitoring"
  - Verify status shows "Monitoring 3 locations"
  - Verify green pulse indicator active

- [ ] **Slot Detection & Notification** (15 min)
  - Trigger manual check via "Check Now" button
  - Verify API call to api.nexus-alert.com succeeds
  - Mock slot data (if needed) by setting `chrome.storage.local`:
    ```javascript
    chrome.storage.local.set({
      lastFoundSlots: [{
        locationName: "Detroit",
        date: "2026-03-20",
        time: "14:00",
        timestamp: Date.now()
      }]
    });
    ```
  - Verify desktop notification fires
  - Verify notification sound plays
  - Verify notification content correct
  - Click notification → verify opens CBP booking page

- [ ] **Premium Upgrade Flow** (10 min)
  - Navigate to Settings tab
  - Click "Upgrade to Premium" card
  - Verify redirects to nexus-alert.com/premium
  - Test Stripe checkout creation (see Task 3)
  - Complete test payment
  - Verify premium status updates in extension
  - Verify UI shows premium features (2-minute checks, email alerts)

- [ ] **Settings & Preferences** (5 min)
  - Toggle sound alerts ON/OFF → verify persists
  - Change check frequency → verify updates background alarm
  - Add/remove enrollment centers → verify monitored list updates
  - Change date range → verify filter applies

#### 1.2 Error Handling & Edge Cases (30 min)

- [ ] **Network Failures**
  - Disconnect internet
  - Trigger manual check
  - Verify error banner shows: "Briefly lost connection to CBP"
  - Verify no crash or console errors
  - Reconnect internet → verify auto-recovery

- [ ] **CBP API Errors**
  - Mock 500 error from CBP (modify background.js temporarily)
  - Verify failure count increments
  - Verify error banner updates after 3 failures
  - Verify extension keeps retrying (doesn't give up)

- [ ] **Empty Results**
  - Mock zero available slots
  - Verify UI shows "No appointments found yet"
  - Verify "Last checked" timestamp updates
  - Verify no duplicate notifications

- [ ] **Rapid Install/Uninstall**
  - Uninstall extension
  - Reinstall immediately
  - Verify clean state (no orphaned data)
  - Verify onboarding triggers again

#### 1.3 Performance & Resource Usage (20 min)

- [ ] **Memory Footprint**
  - Open Chrome Task Manager (`Shift+Esc`)
  - Locate "NEXUS Alert" extension process
  - Verify memory usage <30 MB (idle state)
  - Run for 30 minutes → verify no memory leaks
  - Expected: <50 MB after sustained use

- [ ] **CPU Usage**
  - Monitor CPU during idle (not checking)
  - Expected: 0-1% CPU
  - Monitor CPU during active check
  - Expected: <5% CPU spike, returns to 0%
  - Verify no sustained CPU usage (background polling issue)

- [ ] **Network Bandwidth**
  - Open Chrome DevTools → Network tab
  - Trigger manual check
  - Verify API request size <10 KB
  - Verify no unnecessary requests (telemetry, tracking, etc.)
  - Verify check interval respects user preference (not checking too frequently)

#### 1.4 Browser Compatibility (15 min)

- [ ] **Chrome Versions**
  - Test on Chrome Stable (current version)
  - Test on Chrome Beta (optional but recommended)
  - Verify manifest v3 features work (alarms, offscreen documents)

- [ ] **Operating Systems**
  - macOS: Test notifications, sound, UI rendering
  - Windows: Test notifications (Windows 10/11 notification center)
  - Linux: Test basic functionality (optional)

#### 1.5 Security & Privacy (15 min)

- [ ] **Permissions Audit**
  - Verify only necessary permissions requested:
    - `alarms` — Background monitoring
    - `notifications` — Desktop alerts
    - `storage` — Save user preferences
    - `offscreen` — Notification sounds
    - `tabs` — Open CBP booking page
  - Verify NO excessive permissions (cookies, history, browsing data)

- [ ] **Data Collection**
  - Verify NO analytics/tracking code
  - Verify NO third-party scripts (except Stripe)
  - Verify NO user data sent to external servers
  - Verify email only sent to api.nexus-alert.com for license check

- [ ] **Secure Communication**
  - Verify all API calls use HTTPS
  - Verify no sensitive data in localStorage (passwords, payment info)
  - Verify Sentry error reporting excludes PII

#### 1.6 Accessibility (15 min)

- [ ] **Keyboard Navigation**
  - Tab through all interactive elements
  - Verify focus indicators visible
  - Verify arrow keys work for tab navigation
  - Verify Enter/Space activate buttons

- [ ] **Screen Reader Support**
  - Enable macOS VoiceOver (`Cmd+F5`)
  - Navigate extension popup
  - Verify all buttons have labels
  - Verify status messages announced
  - Verify slot cards readable

- [ ] **Color Contrast**
  - Verify text meets WCAG AA standards (4.5:1 for normal text)
  - Verify success/error states distinguishable without color
  - Test with browser dark mode ON/OFF

#### 1.7 Production Build Verification (20 min)

- [ ] **Build Process**
  ```bash
  cd /Users/michaelguo/nexus-alert
  npm run build
  ```
  - Verify ZERO errors
  - Verify ZERO warnings (or documented exceptions)
  - Verify output files generated correctly

- [ ] **Package Extension**
  ```bash
  npm run package
  ```
  - Verify creates `nexus-alert-v2.0.0.zip`
  - Verify all required files included:
    - manifest.json
    - background.js
    - popup.html, popup.js
    - onboarding.html, onboarding.js
    - offscreen.html, offscreen.js
    - icons/ (16, 48, 128px)
  - Verify no development files included (.map, .DS_Store, node_modules)
  - Verify zip size <5 MB

- [ ] **Load Packaged Extension**
  - Unzip the package to temp folder
  - Load in Chrome as unpacked extension
  - Run smoke test (install, select locations, start monitoring)
  - Verify identical to development version

#### 1.8 Sentry Error Monitoring (10 min)

- [ ] **Sentry Integration**
  - Verify Sentry DSN configured in manifest/background.js
  - Trigger intentional error (throw new Error("Test"))
  - Check Sentry dashboard for error report
  - Verify source maps uploaded (stack traces readable)
  - Verify production environment set correctly

#### 1.9 API Integration (15 min)

- [ ] **Backend Health Check**
  ```bash
  curl https://api.nexus-alert.com/api/health
  # Expected: {"status":"ok","timestamp":1234567890}
  ```

- [ ] **Slots Endpoint**
  ```bash
  curl "https://api.nexus-alert.com/api/slots?program=NEXUS&locations=5020,5140"
  # Expected: JSON array of slots
  ```

- [ ] **License Check Endpoint**
  ```bash
  curl "https://api.nexus-alert.com/api/license?email=test@test.com"
  # Expected: {"tier":"free"} or {"tier":"premium"}
  ```

- [ ] **Checkout Creation** (See Task 3 for full test)
  ```bash
  curl -X POST https://api.nexus-alert.com/api/checkout \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","plan":"monthly"}'
  # Expected: {"url":"https://checkout.stripe.com/c/pay/cs_live_..."}
  ```

#### 1.10 Extension Store Listing Compliance (10 min)

- [ ] **Single Purpose Policy**
  - Extension does ONE thing: monitors CBP appointment slots
  - No ad injections, no unrelated features
  - Justified use of all permissions (see CHROME-WEB-STORE-LISTING.txt)

- [ ] **User Data Policy**
  - Privacy policy published at nexus-alert.com/privacy
  - Clearly states what data collected (email, enrollment center preferences)
  - No sale of user data
  - Stripe payment processing disclosed

- [ ] **Monetization Disclosure**
  - Free tier clearly defined (30-minute checks)
  - Premium tier clearly priced ($4.99/mo)
  - No deceptive upgrade prompts
  - All features work in free tier (no artificial limits)

#### 1.11 Cross-Browser Final Check (10 min)

- [ ] **Chrome Stable**
  - Version: Latest (check chrome://version)
  - Full smoke test passed

- [ ] **Chrome Canary** (Optional)
  - Test with bleeding-edge Chrome
  - Verify no breaking changes in upcoming releases

#### 1.12 User Acceptance Testing (Optional but Recommended)

- [ ] **Beta Testers**
  - Share extension with 3-5 beta users
  - Collect feedback via Google Form or email
  - Fix critical bugs within 24 hours
  - Document known issues (if non-blocking)

---

### Testing Completion Criteria

**Pass Criteria:**
- ✅ All 12 checklist sections completed
- ✅ ZERO critical bugs (crashes, data loss, payment failures)
- ✅ <5 minor bugs (cosmetic issues, low-impact UX)
- ✅ Production build creates clean package
- ✅ API health check returns 200 OK
- ✅ Sentry error monitoring active

**Deliverable:**
- `TESTING_REPORT.md` — Summary of tests run, issues found, pass/fail status

---

## Task 2: Chrome Web Store Submission 🚀

**Time Estimate:** 2-3 hours
**Owner:** Engineer
**Blocker Status:** 🚨 BLOCKING REVENUE (no users until approved)
**Reference:** See `store-assets/CHROME-WEB-STORE-SUBMISSION-TASK.md` for full details

### 2.1 Prerequisites (Already Complete ✅)

- ✅ Extension code complete and tested
- ✅ Manifest v3 compliant
- ✅ Backend API deployed at api.nexus-alert.com
- ✅ Landing page live at nexus-alert.com
- ✅ Privacy policy published at nexus-alert.com/privacy
- ✅ Support email: support@nexus-alert.com
- ✅ Listing copy written (see store-assets/CHROME-WEB-STORE-LISTING.txt)

### 2.2 Generate Promotional Images (30 min)

**Required:**
- Marquee: 1400x560px PNG
- Small tile: 440x280px PNG

**Method (MANUAL — Recommended):**

1. **Open HTML templates:**
   ```bash
   cd /Users/michaelguo/nexus-alert/store-assets
   open marquee-1400x560.html
   open small-tile-440x280.html
   ```

2. **Capture screenshots:**
   - Chrome DevTools → Toggle device toolbar (`Cmd+Shift+M`)
   - Set viewport: 1400x560 (marquee) or 440x280 (tile)
   - Set DPR: 2
   - DevTools menu `⋮` → Capture screenshot
   - Save as `marquee-1400x560.png` and `small-tile-440x280.png`

3. **Verify dimensions:**
   ```bash
   identify marquee-1400x560.png
   # Expected: PNG 1400x560

   identify small-tile-440x280.png
   # Expected: PNG 440x280
   ```

### 2.3 Capture Extension Screenshots (45 min)

**Required:** 5 screenshots at 1280x800px or 640x400px

**Screenshots to capture:**

1. **`1-monitor-locations.png`** — Monitor tab with location checkboxes
2. **`2-slots-found.png`** — Available slot cards with "Book Now" buttons
3. **`3-settings-premium.png`** — Settings tab with premium upgrade card
4. **`4-onboarding-step2.png`** — Onboarding location selection screen
5. **`5-notification.png`** — Desktop notification with slot alert

**Capture process:**
```bash
# Load extension
# chrome://extensions → Load unpacked → /Users/michaelguo/nexus-alert

# Open popup
# Click extension icon in toolbar

# Use DevTools device toolbar for consistent sizing
# Cmd+Shift+M → Set 1280x800 → Capture screenshot
```

**See detailed instructions:** `store-assets/SCREENSHOT-INSTRUCTIONS.md`

### 2.4 Package Extension (5 min)

```bash
cd /Users/michaelguo/nexus-alert
npm run package

# Verify contents
unzip -l nexus-alert-v2.0.0.zip

# Expected files:
# - manifest.json
# - background.js
# - popup.html, popup.js
# - onboarding.html, onboarding.js
# - offscreen.html, offscreen.js
# - icons/icon16.png, icons/icon48.png, icons/icon128.png
# NO .DS_Store, NO node_modules, NO .git
```

### 2.5 Submit to Chrome Web Store (30 min)

**Step-by-step:**

1. **Go to Developer Dashboard**
   - URL: https://chrome.google.com/webstore/devconsole
   - Sign in with Google account
   - Pay $5 one-time registration fee (if first time)

2. **Create New Item**
   - Click "New Item" button
   - Upload `nexus-alert-v2.0.0.zip`
   - Wait for automated checks (2-3 minutes)

3. **Fill Store Listing**
   Open `store-assets/CHROME-WEB-STORE-LISTING.txt` and copy-paste:

   - **Product name:** NEXUS Alert - Appointment Slot Finder for NEXUS, Global Entry & SENTRI
   - **Short description:** (132 char limit — see listing doc)
   - **Detailed description:** (see listing doc section 3)
   - **Category:** Productivity
   - **Language:** English (United States)
   - **Privacy policy URL:** https://nexus-alert.com/privacy
   - **Support email:** support@nexus-alert.com

4. **Upload Images**
   - Small tile: `store-assets/small-tile-440x280.png`
   - Marquee: `store-assets/marquee-1400x560.png`
   - Screenshots 1-5: Upload in order with captions

5. **Declare Permissions**
   For each permission in manifest.json, copy justification from listing doc section 14:

   - `alarms` — "Required for scheduled background monitoring every 2-30 minutes"
   - `notifications` — "Required to alert users when appointment slots are found"
   - `storage` — "Required to save user preferences (enrollment centers, check frequency)"
   - `offscreen` — "Required to play notification sounds"
   - `tabs` — "Required to open CBP booking page when user clicks notification"

   Host permissions:
   - `https://ttp.cbp.dhs.gov/*` — "Required to check CBP appointment availability"
   - `https://api.nexus-alert.com/*` — "Required for premium license verification"

6. **Set Pricing**
   - Select: "This item offers in-app purchases"
   - Free tier: 30-minute checks, desktop notifications
   - Premium tier: $4.99/month (2-minute checks, email/SMS alerts)

7. **Fill Single Purpose Statement**
   Copy from listing doc section 13:
   > "NEXUS Alert monitors the CBP appointment system and notifies users when cancellations become available."

8. **Submit for Review**
   - Click "Submit for Review"
   - Expected review time: 1-3 business days
   - Save submission confirmation screenshot

### 2.6 Post-Submission Checklist

- [ ] Submission status shows "Pending Review"
- [ ] Save Extension ID (32-character string)
- [ ] Screenshot of submission saved to `store-assets/submission-confirmation.png`
- [ ] Monitor developer dashboard daily for status updates
- [ ] Respond to reviewer questions within 24 hours (if any)

---

### Submission Completion Criteria

**Pass Criteria:**
- ✅ Extension uploaded successfully
- ✅ All listing fields filled
- ✅ 7 images uploaded (2 promo + 5 screenshots)
- ✅ Privacy policy accessible
- ✅ Status: "Pending Review"

**Blocker Removed When:**
- ✅ Status changes to "Approved"
- ✅ Extension live on Chrome Web Store
- ✅ Install link works: `chrome.google.com/webstore/detail/[EXTENSION_ID]`

---

## Task 3: Stripe Webhook Integration Verification 💰

**Time Estimate:** 1-2 hours
**Owner:** Engineer
**Blocker Status:** 🚨 BLOCKING REVENUE (payments won't work until verified)
**Reference:** See `backend/STRIPE_PRODUCTION_COMPLETION_SUMMARY.md`

### 3.1 Prerequisites Check (5 min)

Verify Stripe production migration completed:

```bash
cd /Users/michaelguo/nexus-alert/backend

# Check if migration script exists
ls -la scripts/stripe-production-migration.sh

# Run verification script
./scripts/verify-production-setup.sh
```

**Expected output:**
```
✓ Cloudflare Worker secrets configured (7/7)
✓ Worker deployed and responding (HTTP 200)
✓ Stripe live mode active (sk_live_...)
✓ Webhook configured
✓ DNS resolving: api.nexus-alert.com
✓ PRODUCTION READY
```

**If NOT ready:** Run migration first:
```bash
./scripts/stripe-production-migration.sh
```

### 3.2 Create Test Checkout Session (15 min)

**Test monthly plan:**

```bash
curl -X POST https://api.nexus-alert.com/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@yourdomain.com",
    "plan": "monthly"
  }'
```

**Expected response:**
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_live_...",
  "sessionId": "cs_live_..."
}
```

**Verify:**
- [ ] URL starts with `cs_live_` (NOT `cs_test_`)
- [ ] URL is accessible (copy-paste in browser)
- [ ] Checkout page shows "$4.99/month" pricing
- [ ] Checkout page shows "NEXUS Alert Premium" product name

**Test annual plan:**

```bash
curl -X POST https://api.nexus-alert.com/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@yourdomain.com",
    "plan": "annual"
  }'
```

**Expected:**
- [ ] URL shows "$49.99/year" pricing
- [ ] Savings badge visible ("Save 17% vs monthly")

### 3.3 Complete Test Payment (20 min)

**IMPORTANT:** This will create a REAL Stripe charge. Use test card or immediately cancel.

**Test cards:**
- Success: `4242 4242 4242 4242`
- Expiry: `12/28`
- CVC: `123`
- ZIP: `12345`

**Steps:**

1. **Open checkout URL** from step 3.2
2. **Enter test card details**
3. **Click "Subscribe"**
4. **Wait for redirect** to success page
5. **Verify success page** shows:
   - "Payment successful"
   - Email confirmation sent
   - Premium features unlocked

**Monitor Cloudflare Worker logs:**

```bash
cd /Users/michaelguo/nexus-alert/backend
wrangler tail

# Watch for webhook event processing
# Expected log entries:
# - "Checkout session completed"
# - "License activated for: test@yourdomain.com"
# - "Webhook processed successfully"
```

### 3.4 Verify Webhook Delivery (10 min)

**Check Stripe Dashboard:**

1. Go to: https://dashboard.stripe.com/webhooks
2. Click on webhook endpoint: `https://api.nexus-alert.com/api/webhook`
3. View "Recent events" tab
4. Find `checkout.session.completed` event (last 5 minutes)
5. Verify:
   - [ ] HTTP status: `200`
   - [ ] Response time: `<1 second`
   - [ ] No errors in response body
   - [ ] Event delivered successfully

**If webhook failed:**
- Check error message in Stripe dashboard
- Verify webhook URL is correct
- Verify webhook signing secret configured in Worker
- Re-deploy Worker: `wrangler deploy`
- Retry test payment

### 3.5 Verify License Activation (10 min)

**Check license endpoint:**

```bash
curl "https://api.nexus-alert.com/api/license?email=test@yourdomain.com"
```

**Expected response:**
```json
{
  "tier": "premium",
  "status": "active",
  "stripeCustomerId": "cus_...",
  "stripeSubscriptionId": "sub_...",
  "plan": "monthly"
}
```

**Verify in extension:**

1. Open Chrome extension
2. Navigate to Settings tab
3. Enter email: `test@yourdomain.com`
4. Click "Activate Premium"
5. Verify:
   - [ ] Premium badge visible
   - [ ] Check frequency dropdown shows "Every 2 minutes"
   - [ ] Email alerts toggle visible
   - [ ] SMS alerts toggle visible

### 3.6 Test Subscription Cancellation (10 min)

**Cancel test subscription:**

1. Go to Stripe Dashboard → Customers
2. Find customer: `test@yourdomain.com`
3. Click subscription ID
4. Click "Cancel subscription"
5. Confirm cancellation

**Verify webhook fires:**

```bash
wrangler tail
# Expected log: "Subscription cancelled for: test@yourdomain.com"
```

**Verify license endpoint:**

```bash
curl "https://api.nexus-alert.com/api/license?email=test@yourdomain.com"
```

**Expected after cancellation:**
```json
{
  "tier": "free",
  "status": "cancelled"
}
```

**Verify in extension:**
- [ ] Premium badge removed
- [ ] Check frequency reverts to "Every 30 minutes"
- [ ] Upgrade prompt shows again

### 3.7 Test Promo Code (10 min)

**Create ProductHunt promo code:**

```bash
cd /Users/michaelguo/nexus-alert/backend/scripts
./create-stripe-promo-code.sh
```

**Expected output:**
```
✓ Promo code created: PRODUCTHUNT
✓ Discount: 100% off first month
✓ Max redemptions: 200
✓ Expiration: 7 days
✓ Test URL: https://api.nexus-alert.com/api/checkout?promo=PRODUCTHUNT
```

**Test promo code:**

```bash
curl -X POST https://api.nexus-alert.com/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "email": "promo-test@test.com",
    "plan": "monthly",
    "promoCode": "PRODUCTHUNT"
  }'
```

**Complete checkout:**
- [ ] Verify discount applied ($4.99 → $0.00 for first month)
- [ ] Verify payment succeeds
- [ ] Verify premium activates immediately
- [ ] Verify subscription renews at $4.99 after 1 month

### 3.8 Load Testing (Optional but Recommended — 20 min)

**Simulate 100 concurrent checkouts:**

```bash
# Use Apache Bench or similar
ab -n 100 -c 10 -p checkout-data.json \
  -T "application/json" \
  https://api.nexus-alert.com/api/checkout
```

**Verify:**
- [ ] No timeouts
- [ ] No 500 errors
- [ ] Average response time <500ms
- [ ] Webhook processes all events (100% delivery rate)

### 3.9 Production Monitoring Setup (15 min)

**Set up Stripe monitoring:**

1. **Stripe Dashboard → Settings → Notifications**
   - Enable: "Payments failed" email alerts
   - Enable: "Webhook errors" email alerts
   - Recipient: support@nexus-alert.com

2. **Cloudflare Worker Logs**
   ```bash
   # Save logs to file for 24-hour monitoring
   wrangler tail > logs/production-launch-$(date +%Y%m%d).log &
   ```

3. **Sentry Error Tracking**
   - Verify Sentry configured for backend Worker
   - Test error capture:
     ```bash
     curl -X POST https://api.nexus-alert.com/api/test-error
     # Should trigger Sentry alert
     ```

### 3.10 Edge Cases & Error Scenarios (15 min)

**Test payment failures:**

- [ ] **Declined card:** Use `4000 0000 0000 0002`
  - Verify user sees error message
  - Verify no license created
  - Verify webhook not fired

- [ ] **Insufficient funds:** Use `4000 0000 0000 9995`
  - Verify graceful error handling
  - Verify user can retry

- [ ] **Invalid email:**
  ```bash
  curl -X POST https://api.nexus-alert.com/api/checkout \
    -d '{"email":"invalid-email","plan":"monthly"}'
  ```
  - Verify returns 400 Bad Request
  - Verify error message: "Invalid email format"

- [ ] **Missing plan:**
  ```bash
  curl -X POST https://api.nexus-alert.com/api/checkout \
    -d '{"email":"test@test.com"}'
  ```
  - Verify returns 400 Bad Request
  - Verify error message: "Plan required (monthly or annual)"

---

### Webhook Verification Completion Criteria

**Pass Criteria:**
- ✅ Test payment completes successfully
- ✅ Webhook delivers with HTTP 200
- ✅ License activates in extension
- ✅ Promo code applies correctly
- ✅ Subscription cancellation works
- ✅ Edge cases handled gracefully
- ✅ Production monitoring active

**Deliverable:**
- `STRIPE_VERIFICATION_REPORT.md` — Test results, webhook delivery logs, pass/fail status

---

## Task 4: Launch Announcement Assets 📢

**Time Estimate:** 8-10 hours (spread over 2-3 days)
**Owner:** CMO/Marketing + Engineer
**Blocker Status:** NON-BLOCKING (can prepare in parallel)
**Reference:** See `store-assets/PRODUCT_HUNT_ASSETS_GUIDE.md`

### 4.1 Gallery Images (3 required — Priority 1)

**Dimensions:** 1270x760px PNG
**Deadline:** 24 hours before ProductHunt launch

**Image 1: Extension Dashboard (Hero Shot)**
- **Filename:** `ph-gallery-01.png`
- **Content:** Chrome browser window with extension popup open
- **Shows:** Location selection, monitoring status, recent slots table
- **Annotations:** Arrows pointing to key features
- **Time:** 90 minutes
- **Tool:** Figma or screenshot + Photoshop

**Image 2: Desktop Notification Alert**
- **Filename:** `ph-gallery-02.png`
- **Content:** Desktop notification with slot alert
- **Shows:** Notification card, "Book Now" button, timestamp
- **Visual:** Sound wave icon to indicate audio alert
- **Time:** 60 minutes
- **Tool:** Screenshot + Figma composition

**Image 3: Free vs Premium Comparison**
- **Filename:** `ph-gallery-03.png`
- **Content:** Split-screen layout comparing tiers
- **Shows:** Feature lists, pricing, promo code box
- **Highlight:** ProductHunt special (first month free)
- **Time:** 60 minutes
- **Tool:** Figma (clean layout)

**Verification:**
```bash
cd /Users/michaelguo/nexus-alert/store-assets

# Check dimensions
identify ph-gallery-01.png
# Expected: PNG 1270x760

identify ph-gallery-02.png
# Expected: PNG 1270x760

identify ph-gallery-03.png
# Expected: PNG 1270x760

# Compress images
# Use TinyPNG or ImageOptim to reduce file size <1MB each
```

### 4.2 Promo Video (60 seconds — Priority 1)

**Specifications:**
- **Length:** 60 seconds (max)
- **Resolution:** 1920x1080 (1080p)
- **Format:** MP4 (H.264 codec)
- **File size:** <50MB
- **Captions:** Embedded (hardcoded subtitles)
- **Filename:** `ph-demo-video.mp4`

**Video Script:**

**[0:00-0:08] Hook — The Problem**
> "Waiting 6 months for a NEXUS appointment?"
- Show GOES calendar with distant appointment date
- Frustrated user clicking refresh

**[0:09-0:15] Problem Context**
> "Cancelled slots appear randomly... and disappear in minutes"
- Show manual refresh loop
- Slot appears → gone immediately

**[0:16-0:25] Solution Intro**
> "NEXUS Alert monitors 24/7"
- Show Chrome Web Store install
- Extension icon appears in toolbar

**[0:26-0:35] Setup Demo**
> "Pick locations and start monitoring"
- Click extension → select locations
- Set preferences → Start monitoring

**[0:36-0:45] Notification Demo**
> "Get instant alerts when slots appear"
- Desktop notification fires with sound
- Show slot details (location, date, time)

**[0:46-0:53] Booking Action**
> "One click to book"
- Click notification → CBP page opens
- Appointment slot highlighted
- Click "Book Appointment"

**[0:54-0:60] CTA + Promo**
> "Install free • First month Premium FREE with code PRODUCTHUNT"
- Show promo code being copied
- Chrome Web Store install button
- Landing page URL: nexus-alert.com

**Recording tools:**
- **Loom** (easiest, browser-based, auto-captions)
- **ScreenFlow** (Mac, professional editing)
- **OBS Studio** (free, all platforms)

**Post-production checklist:**
- [ ] Add hardcoded captions (not auto-generated)
- [ ] Add background music (royalty-free)
- [ ] Color correct (increase saturation)
- [ ] Add text overlays for key messages
- [ ] Export at 1080p, H.264, <50MB
- [ ] Upload to YouTube (unlisted)
- [ ] Test embed on landing page

**Time estimate:** 3-4 hours (including revisions)

### 4.3 Thumbnail Image (Priority 2)

**Specifications:**
- **Dimensions:** 240x240px (exact, square)
- **Format:** PNG
- **File size:** <500KB
- **Filename:** `ph-thumbnail.png`

**Design:**
- NEXUS Alert icon (from icons/icon128.png)
- Notification badge (green checkmark or red dot with "1")
- Clean background (solid color or subtle gradient)
- High contrast for visibility at small sizes

**Tool:** Figma, Photoshop, or Canva
**Time:** 20 minutes

### 4.4 Founder First Comment (Copy-Paste Ready)

**File:** `marketing/product-hunt/PH_FOUNDER_COMMENT.md`

**Content (already written):**
> Hey Product Hunt! 👋
>
> I'm Michael, founder of NEXUS Alert. I built this because I was tired of waiting 6 months for a NEXUS appointment. I knew cancellations happened frequently, but by the time I manually checked, they were gone.
>
> **How it works:**
> 1. Install the Chrome extension (takes 30 seconds)
> 2. Select your preferred enrollment centers
> 3. Get instant desktop notifications when slots open up
>
> **Tech stack:** Chrome Extension (Manifest v3) + Cloudflare Workers + Stripe. Built with production-quality code, Sentry error monitoring, and real-time alerts.
>
> **Product Hunt Special:** Use code **PRODUCTHUNT** for your first month of Premium free (normally $4.99/mo). Premium gets you 2-minute checks instead of 30-minute checks, plus email/SMS alerts.
>
> Try it free: https://nexus-alert.com?ref=ph
>
> I'd love your feedback! What features would you like to see next?

**Post this within 1 minute of ProductHunt launch** to maximize engagement.

### 4.5 Landing Page Updates (30 min)

**Update Extension ID:**

Once Chrome Web Store approves extension, update all install links:

```bash
# Get Extension ID from Chrome Web Store dashboard
# 32-character string like: abcdefghijklmnopqrstuvwxyz123456

# Update landing page
cd /Users/michaelguo/nexus-alert/web/src/app

# Find and replace [EXTENSION_ID] in:
# - page.tsx
# - premium/page.tsx
# - Any other pages with install buttons
```

**Add ProductHunt badge:**

Add to homepage hero section:
```html
<a href="https://www.producthunt.com/posts/nexus-alert" target="_blank">
  <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=YOUR_POST_ID"
       alt="NEXUS Alert - Never miss a NEXUS appointment | Product Hunt"
       width="250" height="54" />
</a>
```

**Deploy to production:**
```bash
cd web
git add -A
git commit -m "Add Chrome Web Store extension ID and ProductHunt badge"
git push origin main

# Deployment handled automatically by orchestrator
```

### 4.6 Email Announcement (ConvertKit)

**Subject:** 🎉 NEXUS Alert is LIVE — Get your first month free!

**Body:**
```
Hi [First Name],

Great news — NEXUS Alert is officially LIVE on the Chrome Web Store!

After 6 weeks of development and testing, the tool is ready to help you
find NEXUS, Global Entry, and SENTRI appointments in minutes instead of months.

🚀 What's included in the free version:
- 30-minute background checks
- Desktop notifications with sound
- Multi-location monitoring
- Appointment history tracking

⚡ Premium features ($4.99/month):
- 2-minute checks (15x faster!)
- Email alerts (even when browser is closed)
- SMS alerts (never miss a slot)
- Priority support

🎁 Launch Special (This Week Only):
Use code PRODUCTHUNT for your first month of Premium FREE.

👉 Install now: https://nexus-alert.com?ref=email

Questions? Just hit reply — I read every email.

Thanks for your support!
Michael

P.S. We just launched on Product Hunt! If you have 30 seconds, an upvote
would mean the world: [Product Hunt URL]
```

**Schedule:** 8:00 AM PT on launch day
**Audience:** Waitlist subscribers (~500-1000 emails)

### 4.7 Social Media Posts

**Twitter/X:**
```
🎉 NEXUS Alert is LIVE!

Never miss a NEXUS, Global Entry, or SENTRI appointment again.

✅ 2-minute background checks
✅ Instant desktop notifications
✅ Monitor multiple enrollment centers
✅ 100% free tier

Install: https://nexus-alert.com?ref=twitter

First 100 users get Premium free for 1 month with code LAUNCH100 🚀
```

**LinkedIn:**
```
After 6 weeks of development, I'm excited to launch NEXUS Alert — a Chrome extension
that monitors CBP appointment slots in real-time.

The problem: NEXUS/Global Entry appointments are booked 6+ months out, but cancellations
happen daily. By the time you manually check, they're gone.

The solution: Automated monitoring with instant notifications. Set it and forget it.

Built with production-quality code: Chrome Manifest v3, Cloudflare Workers, Stripe payments,
Sentry error monitoring.

Try it free: https://nexus-alert.com?ref=linkedin

Feedback welcome! 🚀
```

**Reddit Posts:**

Post to these subreddits 9:00-9:30 AM PT on launch day:
- r/Nexus
- r/GlobalEntry
- r/PersonalFinanceCanada
- r/churningcanada

**Title:** "I built a Chrome extension to find NEXUS appointments automatically (free + open source)"

**Body:** (See `marketing/community-seeding/REDDIT_POSTS_READY_TO_USE.md`)

---

### Launch Assets Completion Criteria

**Pass Criteria:**
- ✅ 3 gallery images created (1270x760px PNG)
- ✅ 1 promo video created (60s, 1080p, <50MB)
- ✅ 1 thumbnail image created (240x240px PNG)
- ✅ Founder first comment prepared
- ✅ Landing page updated with Extension ID
- ✅ Email announcement drafted
- ✅ Social media posts prepared
- ✅ All assets compressed and optimized

**Deliverable:**
- `LAUNCH_ASSETS_COMPLETE.md` — Checklist of all assets created, file sizes, upload status

---

## 🚀 Launch Day Execution Timeline

**Prerequisite:** Chrome Web Store status = "APPROVED" ✅

### DAY -1 (Monday — 24 hours before launch)

**Morning (9:00 AM - 12:00 PM):**
- [ ] Verify Chrome Web Store APPROVED ✅
- [ ] Copy Extension ID from dashboard
- [ ] Update all landing page install links
- [ ] Deploy landing page updates
- [ ] Run final extension smoke test

**Afternoon (1:00 PM - 5:00 PM):**
- [ ] Create Stripe promo code: `PRODUCTHUNT`
  ```bash
  cd backend/scripts
  ./create-stripe-promo-code.sh
  ```
- [ ] Test promo code checkout flow
- [ ] Verify webhook processing
- [ ] Deploy any last-minute fixes

**Evening (6:00 PM - 9:00 PM):**
- [ ] Draft ProductHunt submission (save as draft)
- [ ] Schedule ConvertKit email (8:00 AM Tuesday)
- [ ] Save Reddit posts as drafts
- [ ] Clear calendar for Tuesday (full-day availability)
- [ ] Sleep early (wake up 11:30 PM for launch)

---

### LAUNCH DAY (Tuesday)

**12:01 AM PT — ProductHunt Launch**
- [ ] Submit to ProductHunt (be first post of the day)
- [ ] Post founder first comment (within 1 minute)
- [ ] Share with 5-10 friends (ask for upvotes)
- [ ] Monitor comments every 15 minutes

**8:00 AM PT — Email Blast**
- [ ] ConvertKit sends to waitlist (~500-1000 emails)
- [ ] Monitor open rate (target: 40%+)
- [ ] Monitor click rate (target: 15%+)
- [ ] Respond to email replies within 1 hour

**9:00 AM PT — Reddit Launch**
- [ ] 9:00 AM: Post to r/Nexus
- [ ] 9:10 AM: Post to r/GlobalEntry
- [ ] 9:20 AM: Post to r/PersonalFinanceCanada
- [ ] **CRITICAL:** Respond within 15 minutes for first 2 hours
- [ ] Engage authentically, answer questions

**All Day (12:01 AM - 11:59 PM):**
- [ ] Monitor ProductHunt comments (<15 min response time)
- [ ] Monitor Reddit comments (<30 min response time)
- [ ] Track metrics hourly (see table below)
- [ ] Post milestone updates ("50 upvotes!", "100 installs!")
- [ ] Monitor Stripe dashboard for payments
- [ ] Monitor Sentry for errors
- [ ] Fix critical bugs within 1 hour

---

## 📊 Success Metrics & Tracking

### Hourly Metrics Table (Track on Launch Day)

| Time | PH Upvotes | PH Rank | Chrome Installs | Premium Signups | Revenue |
|------|------------|---------|-----------------|-----------------|---------|
| 1 AM |            |         |                 |                 |         |
| 2 AM |            |         |                 |                 |         |
| ...  |            |         |                 |                 |         |
| 11 PM|            |         |                 |                 |         |

**Target Metrics (End of Day 1):**

| Metric | Minimum | Target | Stretch |
|--------|---------|--------|---------|
| ProductHunt Upvotes | 200+ | 500+ | 1,000+ |
| ProductHunt Ranking | Top 10 | #3-5 | #1 |
| Chrome Installs | 200+ | 500+ | 1,000+ |
| Premium Signups | 20+ | 50+ | 100+ |
| Revenue (MRR) | $100+ | $250+ | $500+ |
| Reddit Upvotes | 100+ | 300+ | 500+ |

**Week 1 Targets:**
- 2,000+ Chrome installs
- 100+ premium signups
- $500+ MRR
- 4.5+ star rating (Chrome Web Store)

---

## 🚨 Emergency Protocols

### Critical Bugs (Payment failures, crashes, data loss)

**Response time:** <1 hour

**Process:**
1. Acknowledge issue publicly (ProductHunt comment or email)
2. Investigate logs (Sentry, Cloudflare Worker, Chrome console)
3. Deploy hotfix immediately
4. Update Chrome Web Store if extension code changed
5. Post resolution update

### ProductHunt Negative Comments

**Response time:** <15 minutes

**Process:**
1. Read comment carefully, understand concern
2. Acknowledge publicly: "Thanks for the feedback! Looking into this now."
3. Investigate issue (is it a bug or feature request?)
4. Respond with solution or timeline
5. Follow up when resolved

### Stripe Payment Failures

**Response time:** <30 minutes

**Process:**
1. Check Stripe dashboard for error details
2. Check webhook delivery logs
3. Test checkout flow end-to-end
4. If widespread, pause marketing temporarily
5. Deploy fix, verify, resume marketing

### Chrome Web Store Rejection After Approval

**Response time:** <24 hours

**Process:**
1. Read rejection reason carefully
2. Fix policy violation immediately
3. Resubmit with explanation
4. Pause marketing until re-approved

---

## 💰 Revenue Impact Analysis

### Current State (Before Launch)
- **MRR:** $0
- **Users:** 0
- **Chrome Web Store Status:** Not Submitted

### After Task Completion
- **MRR (Month 1):** $500 (100 users × $4.99)
- **MRR (Month 3):** $2,000 (400 users × $4.99)
- **ARR (Year 1):** $24,000-$50,000

### Every Day of Delay Costs
- **Lost MRR:** ~$16.67/day
- **Lost users:** ~3-5 users/day
- **Lost momentum:** ProductHunt launch timing is critical (can't relaunch)

---

## ✅ Final Pre-Launch Checklist

**Must be 100% complete before launch:**

### Extension
- [ ] All tests passed (Task 1)
- [ ] Production build clean (ZERO errors)
- [ ] Sentry error monitoring active
- [ ] Extension packaged and ready

### Chrome Web Store
- [ ] Submitted to Chrome Web Store (Task 2)
- [ ] Status: APPROVED ✅ (BLOCKING)
- [ ] Extension ID copied
- [ ] Install link tested

### Stripe
- [ ] Webhook verified (Task 3)
- [ ] Test payment succeeded
- [ ] Promo code created (PRODUCTHUNT)
- [ ] Production monitoring active

### Launch Assets
- [ ] 3 gallery images created (Task 4)
- [ ] Promo video created and uploaded
- [ ] Thumbnail created
- [ ] Founder comment prepared
- [ ] Landing page updated
- [ ] Email scheduled
- [ ] Social posts drafted

### Monitoring
- [ ] Cloudflare Worker logs streaming
- [ ] Sentry dashboard open
- [ ] Stripe dashboard open
- [ ] ProductHunt notifications ON
- [ ] Email notifications ON
- [ ] Full calendar availability Tuesday

---

## 🎯 Success Criteria — Overall

**This breakdown is complete when:**

1. ✅ Extension testing checklist 100% complete
2. ✅ Chrome Web Store submission status: "Approved"
3. ✅ Stripe webhook verification passed
4. ✅ All launch assets created and uploaded
5. ✅ Launch day execution plan ready
6. ✅ Monitoring systems active
7. ✅ First paying customer within 24 hours of launch

**Revenue Blocker Status:**
- Current: 🔴 BLOCKED (Chrome Web Store not approved)
- After Tasks 1-4: 🟢 UNBLOCKED (ready to generate revenue)

---

## 📁 Deliverables Summary

**Documentation:**
- `TESTING_REPORT.md` — Extension testing results
- `STRIPE_VERIFICATION_REPORT.md` — Payment flow verification
- `LAUNCH_ASSETS_COMPLETE.md` — Asset creation checklist
- `REVENUE_LAUNCH_BREAKDOWN.md` — This document

**Assets:**
- `nexus-alert-v2.0.0.zip` — Extension package for Chrome Web Store
- `store-assets/marquee-1400x560.png` — Marquee promo image
- `store-assets/small-tile-440x280.png` — Small tile promo image
- `store-assets/1-monitor-locations.png` — Screenshot 1
- `store-assets/2-slots-found.png` — Screenshot 2
- `store-assets/3-settings-premium.png` — Screenshot 3
- `store-assets/4-onboarding-step2.png` — Screenshot 4
- `store-assets/5-notification.png` — Screenshot 5
- `store-assets/ph-gallery-01.png` — ProductHunt gallery image 1
- `store-assets/ph-gallery-02.png` — ProductHunt gallery image 2
- `store-assets/ph-gallery-03.png` — ProductHunt gallery image 3
- `store-assets/ph-thumbnail.png` — ProductHunt thumbnail
- `store-assets/ph-demo-video.mp4` — ProductHunt promo video

**Scripts:**
- `backend/scripts/stripe-production-migration.sh` — Stripe migration wizard
- `backend/scripts/verify-production-setup.sh` — Health check script
- `backend/scripts/create-stripe-promo-code.sh` — Promo code generator

---

## 🚀 Next Steps (Immediate Actions)

### Priority 1 (Start Today)
1. **Run extension testing checklist** (Task 1 — 2-3 hours)
   ```bash
   cd /Users/michaelguo/nexus-alert
   # Follow Task 1 checklist
   ```

2. **Submit to Chrome Web Store** (Task 2 — 2-3 hours)
   ```bash
   # Generate images
   # Capture screenshots
   # Package extension
   # Submit to Chrome Web Store
   ```

### Priority 2 (While Waiting for Chrome Approval)
3. **Run Stripe webhook verification** (Task 3 — 1-2 hours)
   ```bash
   cd backend
   ./scripts/verify-production-setup.sh
   # Run full payment flow test
   ```

4. **Create launch assets** (Task 4 — 8-10 hours over 2-3 days)
   - Day 1: Gallery images + thumbnail
   - Day 2: Promo video
   - Day 3: Final polish + upload

### Priority 3 (DAY -1 Before Launch)
5. **Final pre-launch prep** (1-2 hours)
   - Update Extension ID on landing pages
   - Create Stripe promo code
   - Schedule email blast
   - Draft ProductHunt submission
   - Clear calendar for launch day

---

**Status:** 🟢 READY FOR EXECUTION
**Estimated Time to Revenue:** 3-5 days (pending Chrome approval)
**Revenue Target:** $500 MRR Month 1 → $1M ARR

**Good luck! 🚀**
