# Customer Support Troubleshooting Flowchart

Quick-reference decision tree for common support issues.

---

## 🔍 Issue Identification

**User says:** "Extension not working"

### STEP 1: Clarify the Problem

Ask: **What specifically isn't working?**

```
├─ Not receiving notifications → Go to [NOTIFICATIONS FLOW]
├─ Extension icon missing → Go to [INSTALLATION FLOW]
├─ Extension won't install → Go to [INSTALLATION FLOW]
├─ Slots showing but not real → Go to [SLOT DETECTION FLOW]
├─ Premium features not working → Go to [PREMIUM FLOW]
├─ Extension is slow/crashing → Go to [PERFORMANCE FLOW]
└─ Other → Gather details and escalate
```

---

## 🔔 NOTIFICATIONS FLOW

**Issue:** User not receiving notifications when slots are found

### Diagnostic Questions:
1. Is monitoring enabled? (Check extension popup)
2. Are browser permissions granted? (chrome://settings/content/notifications)
3. Is the user Free or Premium tier?
4. Did any slots actually become available during monitoring?

### Resolution Path:

```
START: User not getting notifications
│
├─ Step 1: Verify Monitoring is ON
│  │
│  ├─ OFF → Instruct: "Click extension icon → toggle ON"
│  └─ ON → Continue to Step 2
│
├─ Step 2: Check Browser Permissions
│  │
│  ├─ Blocked → Instruct: "chrome://settings/content/notifications → Allow nexus-alert.com"
│  └─ Allowed → Continue to Step 3
│
├─ Step 3: Check Notification Settings in Extension
│  │
│  ├─ Desktop notifications OFF → Instruct: "Settings → Enable Desktop Notifications"
│  └─ ON → Continue to Step 4
│
├─ Step 4: Verify Slots Were Actually Found
│  │
│  ├─ No slots in history → EXPLAIN: "No slots have appeared yet. Keep monitoring!"
│  └─ Slots in history → Continue to Step 5
│
├─ Step 5: Check Tier-Specific Issues
│  │
│  ├─ FREE USER:
│  │  └─ EXPLAIN: "Checks every 30 min. Slots may appear/disappear between checks. Upgrade to Premium (2-min checks)."
│  │
│  └─ PREMIUM USER:
│     │
│     ├─ Email notifications not working → Verify email address in Settings
│     ├─ SMS not working → Verify phone number format (+1XXXXXXXXXX)
│     └─ All notifications failing → ESCALATE (likely backend issue)
│
└─ RESOLVED or ESCALATED
```

**Quick Fix Command:**
```
/notifications canned response + https://nexus-alert.com/help/why-no-notifications
```

---

## 🔧 INSTALLATION FLOW

**Issue:** Extension won't install or icon not appearing

### Resolution Path:

```
START: Installation Issue
│
├─ Step 1: Verify Browser Compatibility
│  │
│  ├─ NOT Chrome/Edge/Brave → EXPLAIN: "Only Chromium browsers supported. Firefox/Safari not compatible."
│  └─ Chromium browser → Continue to Step 2
│
├─ Step 2: Check Browser Version
│  │
│  ├─ Version < 88 → Instruct: "Update Chrome to latest version (Settings → About Chrome)"
│  └─ Version ≥ 88 → Continue to Step 3
│
├─ Step 3: Installation Method
│  │
│  ├─ Trying to sideload → EXPLAIN: "Install from Chrome Web Store only for security"
│  └─ From Chrome Web Store → Continue to Step 4
│
├─ Step 4: Extension Installed but Icon Missing?
│  │
│  ├─ YES → Instruct: "Click puzzle icon → find NEXUS Alert → click pin icon"
│  └─ NO (won't install) → Continue to Step 5
│
├─ Step 5: Check Installation Errors
│  │
│  ├─ Error message shown → Google error + provide fix or ESCALATE
│  ├─ No error but not installing → Clear Chrome cache, restart browser, retry
│  └─ Corporate/school device → EXPLAIN: "Admin may block extensions. Contact IT."
│
└─ RESOLVED or ESCALATED
```

**Quick Fix Command:**
```
/install canned response + https://nexus-alert.com/help/how-to-install
```

---

## 🎯 SLOT DETECTION FLOW

**Issue:** "Extension says no slots, but I see appointments on the website"

### Resolution Path:

```
START: Slot Detection Mismatch
│
├─ Step 1: Verify Location Match
│  │
│  └─ Ask: "Which enrollment center are you viewing on ttp.cbp.dhs.gov?"
│     │
│     ├─ Different from selected → Instruct: "Select that location in Settings"
│     └─ Same location → Continue to Step 2
│
├─ Step 2: Check Date Range Filters
│  │
│  └─ Ask: "Do you have date range filters enabled in Settings?"
│     │
│     ├─ YES → Verify slot date falls within range
│     └─ NO → Continue to Step 3
│
├─ Step 3: Check Last Update Time
│  │
│  └─ Ask: "When was the last check?" (visible in extension popup)
│     │
│     ├─ > 30 min ago (Free) → Instruct: "Click 'Check Now' to force immediate check"
│     ├─ > 2 min ago (Premium) → Same as above
│     └─ Recent check → Continue to Step 4
│
├─ Step 4: Verify Website vs Extension Data
│  │
│  ├─ Website data may be stale/cached → Instruct: "Refresh CBP page. Extension checks API directly."
│  ├─ Slot just appeared → EXPLAIN: "Click 'Check Now' to sync. Auto-check in [X] minutes."
│  └─ Slot confirmed but extension doesn't detect → ESCALATE (bug)
│
└─ RESOLVED or ESCALATED
```

**Quick Fix Command:**
```
https://nexus-alert.com/help/slots-not-found
```

---

## 💳 PREMIUM FLOW

**Issue:** Premium features not working after payment

### Resolution Path:

```
START: Premium Not Activated
│
├─ Step 1: Verify Payment Success
│  │
│  └─ Check Stripe Dashboard with customer email
│     │
│     ├─ Payment failed → Instruct: "Update payment method in Stripe portal"
│     ├─ Payment pending → Wait 5-10 min, refresh
│     └─ Payment succeeded → Continue to Step 2
│
├─ Step 2: Verify License Key (if applicable)
│  │
│  └─ Check if extension has license key entered
│     │
│     ├─ No key → Provide key from Stripe metadata
│     └─ Key entered → Continue to Step 3
│
├─ Step 3: Check Feature Activation
│  │
│  ├─ Check frequency still 30 min → ESCALATE (backend issue)
│  ├─ Email/SMS not sending → Verify email/phone in Settings
│  │  │
│  │  ├─ Email typo → Correct in Settings
│  │  ├─ Phone format wrong → Fix format (+1XXXXXXXXXX)
│  │  └─ Correct but not sending → ESCALATE (backend)
│  │
│  └─ All features working → RESOLVED
│
└─ RESOLVED or ESCALATED
```

**Quick Fix Command:**
```
Check Stripe: https://dashboard.stripe.com/customers
/premium canned response
```

---

## ⚡ PERFORMANCE FLOW

**Issue:** Extension slow or using too much memory

### Resolution Path:

```
START: Performance Issue
│
├─ Step 1: Check Monitored Locations Count
│  │
│  └─ How many locations are being monitored?
│     │
│     ├─ > 10 locations → Instruct: "Reduce to 3-5 most relevant locations"
│     └─ ≤ 10 locations → Continue to Step 2
│
├─ Step 2: Check Slot History Size
│  │
│  └─ Settings → View History
│     │
│     ├─ Large history (100+ slots) → Instruct: "Clear old history (Settings)"
│     └─ Small history → Continue to Step 3
│
├─ Step 3: Check Chrome Resource Usage
│  │
│  └─ Instruct: "Press Shift+Esc to open Task Manager. Find NEXUS Alert."
│     │
│     ├─ Memory > 100MB → Instruct: "Restart Chrome or reinstall extension"
│     ├─ CPU > 10% constantly → ESCALATE (likely bug)
│     └─ Normal usage → Continue to Step 4
│
├─ Step 4: Check Other Extensions Conflict
│  │
│  └─ Ask: "Do you have many other extensions installed?"
│     │
│     ├─ YES (20+) → Instruct: "Disable unused extensions to free resources"
│     └─ NO → Continue to Step 5
│
├─ Step 5: Nuclear Option - Reinstall
│  │
│  └─ Instruct: "Uninstall extension, restart Chrome, reinstall from Web Store"
│     │
│     ├─ Still slow → ESCALATE (device issue or bug)
│     └─ Fixed → RESOLVED
│
└─ RESOLVED or ESCALATED
```

**Quick Fix Command:**
```
https://nexus-alert.com/help/performance-issues
```

---

## 💰 BILLING FLOW

**Issue:** Billing, refund, or cancellation requests

### Refund Request:

```
START: Refund Request
│
├─ Step 1: Check Purchase Date
│  │
│  ├─ Within 30 days → APPROVE (30-day guarantee)
│  └─ > 30 days → Evaluate case-by-case
│
├─ Step 2: Gather Feedback (Optional)
│  │
│  └─ Ask: "What went wrong? We'd love to improve!"
│
├─ Step 3: Process Refund
│  │
│  └─ Stripe Dashboard → Find customer → Refund payment
│     │
│     └─ Confirm: "Refund processed. Appears in 5-10 business days."
│
└─ RESOLVED
```

### Cancellation Request:

```
START: Cancellation Request
│
├─ Step 1: Confirm Cancellation Intent
│  │
│  └─ Ask: "Are you sure? You'll lose Premium features (2-min checks, email/SMS)."
│     │
│     ├─ Wants to cancel → Continue to Step 2
│     └─ Unsure → Offer to troubleshoot issue instead
│
├─ Step 2: Cancellation Method
│  │
│  ├─ Self-service → Provide Stripe Customer Portal link
│  └─ Needs help → Walk through portal steps
│
├─ Step 3: Set Expectations
│  │
│  └─ EXPLAIN: "Premium access until [end of billing period]. Then auto-downgrade to Free."
│
└─ RESOLVED
```

**Quick Fix Command:**
```
/refund or /cancel canned response
```

---

## 🚨 ESCALATION TRIGGERS

**Immediately escalate if:**

1. **Security vulnerability reported**
   - User can access others' data
   - XSS/injection attacks
   - Extension behaving maliciously

2. **Widespread outage**
   - Multiple users reporting same issue
   - Backend API down
   - Chrome Web Store delisting

3. **Payment processing failure**
   - Stripe webhook not firing
   - Subscriptions not activating after payment
   - Unauthorized charges

4. **Legal request**
   - GDPR deletion request
   - Subpoena
   - Copyright complaint

5. **Abusive behavior**
   - Threats, harassment
   - Repeated refund fraud
   - Spam

**Escalation Contact:**
- **Tech Lead:** [email/Slack]
- **Finance/Billing:** [email]
- **Legal:** [email]

---

## 📋 Quick Response Checklist

Before responding to ANY ticket:

- [ ] Read the user's message fully (don't skim)
- [ ] Identify their tier (Free vs Premium)
- [ ] Check if it's a known issue (FAQ exists?)
- [ ] Gather necessary info (browser version, error messages, etc.)
- [ ] Provide clear, step-by-step solution
- [ ] Link to relevant help article
- [ ] Set expectations (timeline if escalating)
- [ ] Follow up if unresolved

**Average resolution times:**
- Simple (notifications, settings): **5 minutes**
- Medium (installation, upgrade): **15 minutes**
- Complex (bugs, billing): **1-4 hours** (may require escalation)

---

**Last Updated:** March 18, 2026
