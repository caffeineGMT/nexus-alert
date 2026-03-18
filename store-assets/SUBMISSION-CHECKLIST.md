# Chrome Web Store Submission Checklist

Complete this checklist step-by-step to successfully submit NEXUS Alert to the Chrome Web Store.

---

## Pre-Submission Requirements

### 1. Developer Account Setup

- [ ] Google account created/available
- [ ] Paid $5 one-time Chrome Web Store developer registration fee
- [ ] Access to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)

### 2. Legal Requirements

- [ ] Privacy policy published at public URL
- [ ] Terms of service created (optional but recommended)
- [ ] Support email set up: `support@nexus-alert.com` (or similar)
- [ ] Extension does not violate Chrome Web Store policies

**Privacy Policy URL:** `https://nexus-alert.com/privacy` (or GitHub Pages)

**Terms of Service URL:** `https://nexus-alert.com/terms` (optional)

**Support Email:** `support@nexus-alert.com`

---

## Package Preparation

### 3. Extension Files

- [ ] All code tested and working
- [ ] No console errors or warnings
- [ ] Manifest version updated: `2.0.0`
- [ ] Icons included (16, 48, 128 px)
- [ ] All features functional in unpacked mode

### 4. Create Submission Package

Run:
```bash
npm run package
```

This creates `nexus-alert-submission.zip` with:
- [ ] `manifest.json`
- [ ] `background.js`, `popup.js`, `popup.html`
- [ ] `offscreen.js`, `offscreen.html`
- [ ] `onboarding.js`, `onboarding.html`
- [ ] `icons/` folder (all 4 files)
- [ ] `src/slotFilters.js`

**Excludes** (verify not in zip):
- [ ] No `node_modules/`
- [ ] No `backend/` or `web/`
- [ ] No `.git/`, `.gitignore`, `.vercel/`
- [ ] No `tests/`, `vitest.config.js`
- [ ] No `README.md`, `docs/`, `store-assets/`
- [ ] No development files

### 5. Test Packaged Extension

- [ ] Unzip the package to test folder
- [ ] Load unpacked in `chrome://extensions`
- [ ] Extension loads without errors
- [ ] Test core functionality:
  - [ ] Popup opens correctly
  - [ ] Onboarding flow works
  - [ ] Location selection works
  - [ ] "Check Now" button works
  - [ ] Notifications appear
  - [ ] Settings save properly
  - [ ] Sound alerts play
  - [ ] Slot history displays

---

## Visual Assets

### 6. Screenshots (5 required, 1280x800 or 640x400)

Follow instructions in `SCREENSHOT-INSTRUCTIONS.md`

- [ ] Screenshot 1: Monitor tab with location selection
- [ ] Screenshot 2: Available slots found with slot cards
- [ ] Screenshot 3: Settings tab showing premium plan
- [ ] Screenshot 4: Onboarding step 2 (location selection)
- [ ] Screenshot 5: Desktop notification

**File format:** PNG
**Size:** Under 5 MB each
**Resolution:** 1280x800 or 640x400

### 7. Promotional Images

- [ ] Small tile (440x280 px) — created from HTML template
- [ ] Marquee (1400x560 px) — created from HTML template

**How to generate:**
1. Open `small-tile-440x280.html` in browser
2. Set window to exact size (440x280)
3. Take screenshot
4. Repeat for `marquee-1400x560.html` (1400x560)

### 8. Icon

- [ ] Extension icon (128x128) — already in `icons/icon128.png`

---

## Listing Information

### 9. Basic Info

**Item Title (max 30 chars):**
```
NEXUS Alert
```
(11 characters — OK)

**Item Summary (max 132 chars):**
```
Get instant alerts when NEXUS, Global Entry & SENTRI appointment slots open. Free monitoring every 30min, premium every 2min.
```
(132 characters exactly — OK)

**Detailed Description:**
- [ ] Copy from `DETAILED-DESCRIPTION.txt`
- [ ] Review for accuracy
- [ ] Ensure all features are mentioned
- [ ] Highlight free vs. premium tiers

**Category:**
```
Productivity
```

**Language:**
```
English
```

### 10. Contact & Support

**Official website:**
```
https://nexus-alert.com
```
(Or GitHub Pages: `https://yourusername.github.io/nexus-alert`)

**Support URL:**
```
https://github.com/yourusername/nexus-alert/issues
```

**Support email:**
```
support@nexus-alert.com
```

---

## Privacy & Permissions

### 11. Privacy Practices

**Does this extension collect user data?**
- [ ] YES (if premium tier is enabled — collects email)
- [ ] NO (if only free tier)

**If YES, complete privacy disclosure:**

**What user data does the extension collect?**
- Email address (premium tier only)
- Location preferences (stored locally)

**How is the data used?**
- Email: Send slot notifications
- Location preferences: Monitor selected enrollment centers

**Is data sold to third parties?**
- [ ] NO

**Is data shared with third parties?**
- [ ] NO (unless using Resend for email — declare transactional email provider)

**Privacy policy URL:**
```
https://nexus-alert.com/privacy
```

### 12. Permissions Justification

Declare why each permission is needed:

| Permission | Justification |
|------------|---------------|
| `alarms` | Schedule periodic slot checks |
| `notifications` | Alert users when slots are found |
| `storage` | Save user preferences and configuration |
| `offscreen` | Play audio alerts (MV3 requirement) |
| `tabs` | Open booking page when slots found |
| `https://ttp.cbp.dhs.gov/*` | Access CBP API to check slot availability |
| `https://api.nexus-alert.com/*` | Premium tier backend for email alerts |

---

## Pricing & Distribution

### 13. Pricing

**Is this a paid extension?**
- [ ] NO (free with optional in-app purchases)

**In-app purchases?**
- [x] YES — Premium subscription via Stripe ($4.99/month)

**Free trial available?**
- [x] YES — Free tier is permanent, premium is optional upgrade

### 14. Distribution

**Visibility:**
- [x] Public

**Regions:**
- [x] All regions (or select specific countries)

---

## Submission

### 15. Upload & Review

- [ ] Log in to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [ ] Click **New Item**
- [ ] Upload `nexus-alert-submission.zip`
- [ ] Fill in all listing information
- [ ] Upload all 5 screenshots
- [ ] Upload promotional images (small tile, marquee)
- [ ] Set extension icon (128x128)
- [ ] Declare privacy practices
- [ ] Set pricing (Free with IAP)
- [ ] Set distribution regions
- [ ] Save as draft

### 16. Pre-Publication Review

- [ ] Preview the listing in "Preview" mode
- [ ] Verify all screenshots display correctly
- [ ] Check description formatting
- [ ] Ensure no typos in title/summary
- [ ] Verify support links work
- [ ] Test privacy policy URL is accessible

### 17. Submit for Review

- [ ] Click **Submit for Review**
- [ ] Confirm submission
- [ ] Wait for Chrome Web Store team to review (typically 1-3 business days)

---

## Post-Submission

### 18. After Approval

- [ ] Extension appears in Chrome Web Store
- [ ] Test installation from store
- [ ] Share store URL with users
- [ ] Add Chrome Web Store badge to website
- [ ] Update README with store link

**Store URL format:**
```
https://chrome.google.com/webstore/detail/[extension-id]
```

### 19. Monitoring

- [ ] Check Chrome Web Store Developer Dashboard regularly
- [ ] Respond to user reviews
- [ ] Monitor crash reports
- [ ] Track installation stats

---

## Rejection Handling

If the extension is rejected:

1. **Read the rejection email carefully** — it will specify the policy violation
2. **Common rejection reasons:**
   - Misleading description
   - Missing privacy policy
   - Excessive permissions
   - Poor quality screenshots
   - Functionality doesn't match description
   - Keyword stuffing
3. **Fix the issue**
4. **Re-submit**

---

## Common Policy Violations to Avoid

- [ ] No misleading claims ("guaranteed appointments", "official CBP tool")
- [ ] No keyword stuffing in title/description
- [ ] No broken links (privacy policy, support)
- [ ] No excessive permissions (only request what's needed)
- [ ] No obfuscated code
- [ ] No malware or deceptive behavior
- [ ] Clearly state affiliation (or lack thereof) with CBP/DHS

---

## Timeline Expectations

- **Developer registration:** Instant (after $5 payment)
- **Package preparation:** 1-2 hours
- **Screenshot creation:** 1 hour
- **Listing info setup:** 30 minutes
- **Initial review:** 1-3 business days
- **Updates (after approval):** Usually <24 hours

Total time from start to publish: **2-5 business days**

---

## Final Pre-Submit Checklist

- [ ] Zip package tested and working
- [ ] All 5 screenshots ready
- [ ] Promotional images ready (small tile, marquee)
- [ ] Description under character limits
- [ ] Privacy policy live and accessible
- [ ] Support email set up
- [ ] Extension complies with all policies
- [ ] No misleading claims
- [ ] All links work
- [ ] Stripe integration tested (if premium tier enabled)

**Ready to submit?** ✓

Go to: https://chrome.google.com/webstore/devconsole

---

## Post-Launch Marketing

After approval:

- [ ] Announce on social media (Twitter, Reddit, LinkedIn)
- [ ] Post in r/nexus, r/GlobalEntry, r/chrome_extensions
- [ ] Add Chrome Web Store badge to landing page
- [ ] Email leads from `leads.json`
- [ ] Submit to Product Hunt
- [ ] Create demo video for YouTube
- [ ] Write blog post about the launch

---

## Support Resources

- **Chrome Web Store Policies:** https://developer.chrome.com/docs/webstore/program-policies/
- **Best Practices:** https://developer.chrome.com/docs/webstore/best_practices/
- **Developer Dashboard:** https://chrome.google.com/webstore/devconsole
- **Review Process FAQ:** https://developer.chrome.com/docs/webstore/review-process/
