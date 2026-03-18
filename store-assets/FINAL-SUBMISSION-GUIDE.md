# Chrome Web Store Submission — Final Guide

**Complete step-by-step guide to submit NEXUS Alert to the Chrome Web Store.**

Estimated time: **2-3 hours**
Chrome review time: **1-3 business days**

---

## Prerequisites

Before starting, ensure you have:

- [ ] Google account (for Chrome Web Store Developer Dashboard)
- [ ] $5 USD (one-time Chrome Web Store developer registration fee)
- [ ] Credit/debit card for payment
- [ ] Domain for privacy policy (or use GitHub Pages)
- [ ] Email address for support (e.g., support@nexus-alert.com)

---

## Phase 1: Prepare Assets (60-90 minutes)

### 1.1 Generate Promotional Images

**Time: 15 minutes**

```bash
# Open the image generator
open store-assets/GENERATE-IMAGES-SIMPLE.html
```

1. Click **"Show Marquee (1400×560)"**
2. Press **Cmd+Shift+M** to open DevTools
3. Toggle Device Toolbar again (**Cmd+Shift+M**)
4. Click **⋮** menu → **"Capture screenshot"**
5. Rename to `marquee-1400x560.png` and save to `store-assets/`

Repeat for **"Show Small Tile (440×280)"**:
- Save as `small-tile-440x280.png`

**Verify:**
- [ ] `marquee-1400x560.png` exists and is exactly 1400×560 px
- [ ] `small-tile-440x280.png` exists and is exactly 440×280 px
- [ ] Both are PNG format, under 5 MB

---

### 1.2 Capture Extension Screenshots

**Time: 45 minutes**

Follow the detailed guide: **`SCREENSHOT-GUIDE.md`**

**Quick checklist:**

1. **Screenshot 1** — Monitor tab with locations selected
2. **Screenshot 2** — Live slots displayed (use test data if needed)
3. **Screenshot 3** — Slots history tab
4. **Screenshot 4** — Settings tab
5. **Screenshot 5** — Desktop notification

**Verify:**
- [ ] 5 screenshots captured
- [ ] All are 1280×800 or 640×400 px
- [ ] PNG format, under 5 MB each
- [ ] Clear and readable

---

### 1.3 Package the Extension

**Time: 5 minutes**

```bash
# Create the submission ZIP
npm run package
```

This creates `nexus-alert-submission.zip` containing:
- `manifest.json`
- `background.js`
- `popup.html`, `popup.js`, `popup.css`
- `offscreen.html`, `offscreen.js`
- `onboarding.html`
- `icons/` directory (4 files)
- `src/slotFilters.js`

**Verify:**
- [ ] `nexus-alert-submission.zip` created
- [ ] File size is reasonable (should be ~20-30 KB)
- [ ] Unzip and inspect contents to ensure correct files included

Test the package:
```bash
# Unzip to temp directory
unzip nexus-alert-submission.zip -d /tmp/nexus-alert-test

# Load in Chrome
# 1. Go to chrome://extensions
# 2. Remove existing NEXUS Alert (if loaded)
# 3. Load unpacked: /tmp/nexus-alert-test
# 4. Test basic functionality
```

---

### 1.4 Publish Privacy Policy

**Time: 15 minutes**

Chrome Web Store requires a **publicly accessible** privacy policy URL.

**Option A: GitHub Pages (Free, Fast)**

```bash
cd /Users/michaelguo/nexus-alert

# Create gh-pages branch
git checkout -b gh-pages

# Copy privacy policy
cp store-assets/privacy-policy-updated.md privacy.md

# Add HTML wrapper for better formatting
cat > privacy.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NEXUS Alert — Privacy Policy</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
      line-height: 1.6;
      color: #333;
    }
    h1 { font-size: 32px; margin-bottom: 8px; }
    h2 { font-size: 24px; margin-top: 32px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
    h3 { font-size: 18px; margin-top: 24px; }
    p { margin: 16px 0; }
    ul { margin: 16px 0; padding-left: 24px; }
    code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
  </style>
</head>
<body>
EOF

# Convert markdown to HTML (or paste manually)
# For now, just use markdown as-is
cat privacy.md >> privacy.html

echo '</body></html>' >> privacy.html

# Commit and push
git add privacy.html
git commit -m "Add privacy policy for Chrome Web Store"
git push origin gh-pages
```

**Privacy policy will be available at:**
```
https://[your-github-username].github.io/nexus-alert/privacy.html
```

**Option B: Deploy to Vercel/Netlify (Web Subdomain)**

If you have a landing page at `nexus-alert.com`:
- Add `privacy.html` to your web project
- Deploy
- Privacy policy at: `https://nexus-alert.com/privacy`

**Verify:**
- [ ] Privacy policy is publicly accessible
- [ ] URL works in incognito mode
- [ ] Content matches `privacy-policy-updated.md`
- [ ] Page loads quickly

---

### 1.5 Set Up Support Email

**Time: 10 minutes**

**Option A: Custom Domain Email**

If you own `nexus-alert.com`:
- Create `support@nexus-alert.com` via your domain registrar
- Forward to your personal email

**Option B: Gmail Alias**

Create a new Gmail account:
- Email: `nexusalert.support@gmail.com`
- Or use Gmail+ alias: `youremail+nexusalert@gmail.com`

**Verify:**
- [ ] Email address created
- [ ] Can receive emails
- [ ] Auto-responder set up (optional but recommended)

---

## Phase 2: Chrome Web Store Submission (30-45 minutes)

### 2.1 Register as Chrome Web Store Developer

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Sign in with your Google account
3. Pay **$5 USD** one-time developer registration fee
4. Agree to Developer Agreement
5. Complete publisher account setup

**Verify:**
- [ ] Developer account active
- [ ] Payment confirmed
- [ ] Can access dashboard

---

### 2.2 Create New Item

1. Click **"New Item"** button
2. Upload `nexus-alert-submission.zip`
3. Wait for upload to complete
4. Click **"Start filling in details"** or **"Edit draft"**

---

### 2.3 Fill in Store Listing

**All copy is in:** `CHROME-WEB-STORE-LISTING.txt`

Open that file and **copy-paste** each section:

#### Product Details

**Name:**
```
NEXUS Alert
```

**Summary:** (132 characters max)
```
Get instant alerts when NEXUS, Global Entry & SENTRI appointment slots open. Free monitoring every 30min, premium every 2min.
```

**Category:**
```
Productivity
```

**Language:**
```
English (United States)
```

---

#### Detailed Description

Copy the **entire detailed description** from `CHROME-WEB-STORE-LISTING.txt` (Section 3).

**Formatting tips:**
- Use plain text, no HTML
- Chrome Web Store auto-formats line breaks
- Keep paragraphs separated by blank lines

---

#### Product Media

**Screenshots:**

Upload in this order:

1. `screenshot-1-monitor.png`
   Caption: `Monitor multiple enrollment centers in real time`

2. `screenshot-2-slots-found.png`
   Caption: `See available slots instantly and book with one click`

3. `screenshot-3-slots-history.png`
   Caption: `Track slot history and spot patterns`

4. `screenshot-4-settings.png`
   Caption: `Customize alerts, sounds, and check frequency`

5. `screenshot-5-notification.png`
   Caption: `Get notified the instant a slot opens up`

**Promotional Images:**

- **Small promotional tile:** Upload `small-tile-440x280.png`
- **Marquee promotional tile:** Upload `marquee-1400x560.png`

---

#### Privacy & Legal

**Privacy Policy URL:**
```
https://[your-github-username].github.io/nexus-alert/privacy.html
```
(Or your custom domain)

**Terms of Service:** (Optional, leave blank or add URL)

---

#### Distribution

**Regions:**
- Select **All regions** (or choose specific countries)

**Pricing:**
```
This item offers in-app purchases
```

---

#### Support

**Support Email:**
```
support@nexus-alert.com
```
(Or your chosen email)

**Support URL:** (Optional)
```
https://github.com/[your-username]/nexus-alert/issues
```

**Homepage URL:** (Optional)
```
https://nexus-alert.com
```

---

### 2.4 Permissions Justification

Chrome will ask you to justify each permission. Copy from `CHROME-WEB-STORE-LISTING.txt` (Section 14):

**alarms:**
```
Required to schedule periodic background checks for appointment slot availability at user-configured intervals (every 1-30 minutes).
```

**notifications:**
```
Required to notify users via desktop notifications when NEXUS/Global Entry/SENTRI appointment slots become available at their selected enrollment centers.
```

**storage:**
```
Required to store user preferences including selected enrollment centers, notification settings, check frequency, and slot history locally in the browser.
```

**offscreen:**
```
Required to play audio notification sounds when appointment slots are found, as Chrome service workers cannot access the Web Audio API directly.
```

**tabs:**
```
Required to open the CBP booking page in a new tab when users click "Book Now" on available appointment slots.
```

**Host permission: https://ttp.cbp.dhs.gov/***
```
Required to access the official CBP Trusted Traveler Programs Scheduler API to check for appointment availability. This is the sole purpose of the extension.
```

**Host permission: https://api.nexus-alert.com/***
```
Required for premium tier users to receive email and SMS notifications via our backend service when appointment slots become available.
```

---

### 2.5 Single Purpose & Additional Information

**Single Purpose Description:**
```
Monitor NEXUS, Global Entry, and SENTRI appointment availability on ttp.cbp.dhs.gov and notify users when slots become available.
```

**Why does your extension require this permission?**

Chrome may ask specific questions about each permission. Refer to Section 14 in `CHROME-WEB-STORE-LISTING.txt` for detailed justifications.

---

### 2.6 Final Review

Before submitting:

- [ ] All text fields filled in
- [ ] 5 screenshots uploaded with captions
- [ ] 2 promotional images uploaded
- [ ] Privacy policy URL works
- [ ] Support email is valid
- [ ] Permissions justified
- [ ] No typos in description
- [ ] Product name is correct: "NEXUS Alert"
- [ ] Version matches manifest.json (2.0.0)

---

### 2.7 Submit for Review

1. Click **"Save draft"** to save your progress
2. Review everything one last time
3. Click **"Submit for review"**
4. Confirm submission

**What happens next:**
- Chrome team reviews your extension (1-3 business days)
- You'll receive email updates on review status
- If approved: Extension goes live immediately
- If rejected: You'll get feedback on what to fix

---

## Phase 3: Post-Submission (15 minutes)

### 3.1 Monitor Review Status

Check your email and the Developer Dashboard daily for updates.

**Common rejection reasons:**
- Privacy policy not accessible
- Permissions not justified properly
- Screenshots unclear or misleading
- Description violates policies

If rejected, read the feedback carefully, fix the issues, and resubmit.

---

### 3.2 Prepare Launch Materials (While Waiting)

**Update README:**
```bash
# Add Chrome Web Store badge
# (Get the badge URL after approval)
```

**Prepare social media posts:**
- Twitter/X announcement
- Reddit posts (r/nexus, r/GlobalEntry, r/productivity)
- Product Hunt submission

**Set up analytics:**
- Google Analytics for landing page
- Chrome Web Store analytics (built-in)

---

## Phase 4: After Approval (15 minutes)

### 4.1 Verify Live Extension

1. Go to Chrome Web Store and search "NEXUS Alert"
2. Install your own extension from the store
3. Test all features
4. Check that version number is correct

---

### 4.2 Update Marketing Materials

**Add Chrome Web Store badge to:**
- Landing page (`web/`)
- GitHub README
- Social media profiles

**Badge code:**
```html
<a href="https://chrome.google.com/webstore/detail/[YOUR-EXTENSION-ID]">
  <img src="https://storage.googleapis.com/web-dev-uploads/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/UV4C4ybeBTsZt43U4xis.png" alt="Available in the Chrome Web Store">
</a>
```

---

### 4.3 Launch Announcement

**Post on:**
- Reddit: r/nexus, r/GlobalEntry, r/TravelHacks
- Twitter/X with hashtags: #NEXUS #GlobalEntry #Travel
- Product Hunt (submit as a product)
- Hacker News Show HN thread

**Email beta testers:**
If you collected email addresses during development, send them a launch email.

---

## Troubleshooting

### Extension Rejected: "Privacy Policy Not Accessible"

**Fix:**
- Ensure URL is publicly accessible (test in incognito)
- Use HTTPS (not HTTP)
- Privacy policy must load quickly (<3 seconds)
- No login required to view

---

### Extension Rejected: "Permissions Not Justified"

**Fix:**
- Be more specific in justifications
- Explain exactly **why** each permission is necessary
- Provide examples of features that use the permission
- Reference sections of your code (if asked)

---

### Extension Rejected: "Misleading Functionality"

**Fix:**
- Screenshots must accurately represent the extension
- Don't show features that don't exist
- Description must match what the extension actually does

---

### Extension Rejected: "Violates User Data Policy"

**Fix:**
- Clearly state what data is collected
- Privacy policy must be comprehensive
- Don't collect more data than necessary
- Explain how data is used

---

## Success Metrics to Track

After launch:

- **Installs:** Target 100 in first week, 1,000 in first month
- **Active users:** Track daily/weekly active users
- **Reviews:** Aim for 4+ star average
- **Premium conversions:** Track upgrade rate (target 5-10%)
- **Support tickets:** Respond within 24 hours

---

## Final Checklist

**Before clicking "Submit for Review":**

- [ ] Extension tested thoroughly
- [ ] All screenshots are clear and accurate
- [ ] Promotional images look professional
- [ ] Privacy policy is live and accessible
- [ ] Support email is set up and monitored
- [ ] All listing copy is proofread
- [ ] Permissions are properly justified
- [ ] Version number matches manifest.json
- [ ] Package contains correct files (no sensitive data)
- [ ] Landing page is ready (optional but recommended)

---

## Timeline

| Task | Time |
|------|------|
| Generate promotional images | 15 min |
| Capture extension screenshots | 45 min |
| Package extension | 5 min |
| Publish privacy policy | 15 min |
| Set up support email | 10 min |
| Register developer account | 10 min |
| Fill in store listing | 30 min |
| Final review and submit | 10 min |
| **Total** | **2-3 hours** |

Chrome review: **1-3 business days**

---

## Support

**Questions during submission?**
- Chrome Web Store Help: https://support.google.com/chrome_webstore/
- Developer Policies: https://developer.chrome.com/docs/webstore/program-policies/
- This project's issues: https://github.com/[your-username]/nexus-alert/issues

---

## After Approval: Marketing Checklist

- [ ] Post on Reddit (r/nexus, r/GlobalEntry, r/TravelHacks)
- [ ] Tweet announcement with #NEXUS #GlobalEntry
- [ ] Submit to Product Hunt
- [ ] Add Chrome Web Store badge to landing page
- [ ] Update GitHub README with store link
- [ ] Email beta testers/waitlist
- [ ] Post in relevant Facebook groups
- [ ] Create demo video (YouTube/Vimeo)
- [ ] Write launch blog post
- [ ] Set up Google Analytics

---

**You're ready to submit! Good luck!** 🚀

For detailed instructions on specific sections, refer to:
- `CHROME-WEB-STORE-LISTING.txt` — All listing copy
- `SCREENSHOT-GUIDE.md` — Screenshot capture guide
- `SUBMISSION-CHECKLIST.md` — Original submission checklist
