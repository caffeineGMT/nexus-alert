# TASK: Complete Chrome Web Store Submission

**Priority:** P0 - BLOCKING REVENUE
**Estimated Time:** 2-3 hours
**Assigned To:** [ENGINEER NAME]
**Status:** NOT STARTED

---

## Context

NEXUS Alert is a production-ready Chrome Extension that monitors NEXUS, Global Entry, and SENTRI appointment slots. The extension code is complete and tested. We need to submit it to the Chrome Web Store to start acquiring users and generating revenue ($4.99/mo premium tier).

**This task is blocking all revenue** because we cannot acquire users until the extension is approved and published on the Chrome Web Store.

---

## Deliverables

1. ✅ 2 promotional images generated (marquee + small tile)
2. ✅ 5 screenshots captured from running extension
3. ✅ Privacy policy published at public URL
4. ✅ Support email configured (support@nexus-alert.com)
5. ✅ Extension submitted to Chrome Web Store
6. ✅ $5 developer fee paid
7. ✅ Submission status: "Pending Review"

---

## Prerequisites (Already Complete)

- ✅ Extension code complete and tested
- ✅ Manifest v3 compliant
- ✅ All listing copy written (see `CHROME-WEB-STORE-LISTING.txt`)
- ✅ Backend API deployed at api.nexus-alert.com
- ✅ Landing page live at nexus-alert.com
- ✅ Stripe integration complete ($4.99/mo premium tier)

---

## Task Breakdown

### Part 1: Generate Promotional Images (30 min)

#### Option A: Manual (RECOMMENDED - 100% reliable)

Follow the detailed guide:
```bash
open store-assets/QUICKSTART-IMAGE-GENERATION.md
```

**Quick version:**
1. Open `marquee-1400x560.html` in Chrome
2. Press `Cmd+Option+I` → Toggle device toolbar (`Cmd+Shift+M`)
3. Set viewport: `1400 x 560`, DPR: `2`
4. DevTools menu `⋮` → **Capture screenshot**
5. Rename to `marquee-1400x560.png`, move to `store-assets/`

Repeat for `small-tile-440x280.html` (440x280 dimensions).

#### Option B: Automated (if you fix puppeteer)

```bash
npm install
node scripts/generate-promotional-images.js
```

Currently failing with puppeteer crash. Fix if you prefer automation over manual.

---

### Part 2: Capture Extension Screenshots (45 min)

You need **5 screenshots** at 1280x800 or 640x400 pixels showing real extension functionality.

See detailed instructions:
```bash
open store-assets/SCREENSHOT-INSTRUCTIONS.md
```

**Required screenshots:**

1. **`1-monitor-locations.png`** - Monitor tab showing location selection
   - Load extension in Chrome (`chrome://extensions` → Load unpacked → select `/Users/michaelguo/nexus-alert`)
   - Open popup, select NEXUS program, check 3+ locations
   - Capture at 1280x800 using DevTools device toolbar

2. **`2-slots-found.png`** - Available slot cards with "Book" buttons
   - Modify `background.js` to return mock slots, or
   - Run local backend: `cd backend && npm run dev`
   - Capture popup showing 2-3 green slot cards

3. **`3-settings-premium.png`** - Settings tab showing premium upgrade card
   - Navigate to Settings tab in popup
   - Show check interval options and premium upgrade prompt
   - Capture at 1280x800

4. **`4-onboarding-step2.png`** - Onboarding location selection screen
   - Clear extension storage to trigger onboarding
   - Navigate to Step 2/3 (location selection)
   - Capture full browser tab at 1280x800

5. **`5-notification.png`** - Desktop notification
   - Trigger a notification (click "Check Now" or force via code)
   - Use macOS Screenshot tool (`Cmd+Shift+4`) to capture notification on screen
   - Or composite notification mockup over desktop background

---

### Part 3: Publish Privacy Policy (15 min)

**Option A: Use existing Next.js site**

The privacy policy is already written: `store-assets/privacy-policy-updated.md`

1. Copy to web app:
   ```bash
   mkdir -p web/src/app/privacy
   cp store-assets/privacy-policy-updated.md web/src/app/privacy/page.mdx
   ```

2. Deploy to Vercel:
   ```bash
   cd web
   vercel --prod
   ```

3. Verify live at: `https://nexus-alert.com/privacy`

**Option B: GitHub Pages (faster)**

1. Create `privacy.html` from the markdown
2. Push to GitHub repo
3. Enable GitHub Pages in repo settings
4. Use URL: `https://[username].github.io/nexus-alert/privacy.html`

---

### Part 4: Set Up Support Email (10 min)

Create `support@nexus-alert.com` email address.

**Options:**
- Google Workspace ($6/mo per user)
- Zoho Mail (free tier for 1 domain)
- Email forwarding via domain registrar → forward to personal email

Update `CHROME-WEB-STORE-LISTING.txt` with actual email once configured.

---

### Part 5: Create Extension Package (5 min)

Generate the `.zip` file for upload:

```bash
# Option A: Use existing script
npm run package

# Option B: Manual zip
zip -r nexus-alert-v2.0.0.zip \
  manifest.json \
  background.js \
  popup.html \
  popup.js \
  onboarding.html \
  onboarding.js \
  offscreen.html \
  offscreen.js \
  icons/ \
  -x "*.DS_Store" "*.git*"
```

Verify contents:
```bash
unzip -l nexus-alert-v2.0.0.zip
```

---

### Part 6: Submit to Chrome Web Store (30 min)

1. **Go to Chrome Web Store Developer Dashboard**
   - Visit: https://chrome.google.com/webstore/devconsole
   - Sign in with Google account
   - Pay $5 one-time developer registration fee (if first time)

2. **Create New Item**
   - Click **New Item** button
   - Upload `nexus-alert-v2.0.0.zip`
   - Wait for automatic checks to complete

3. **Fill in Store Listing**
   - Open `store-assets/CHROME-WEB-STORE-LISTING.txt`
   - Copy-paste each section into the corresponding field:
     - Product name
     - Short description (132 char limit)
     - Detailed description
     - Category: Productivity
     - Language: English (United States)
     - Privacy policy URL
     - Support email
     - Keywords

4. **Upload Images**
   - Small tile: `store-assets/small-tile-440x280.png`
   - Marquee: `store-assets/marquee-1400x560.png`
   - Screenshots 1-5: Upload in order with captions from listing doc

5. **Declare Permissions**
   - For each permission, copy justification from `CHROME-WEB-STORE-LISTING.txt` section 14
   - Permissions: alarms, notifications, storage, offscreen, tabs
   - Host permissions: `https://ttp.cbp.dhs.gov/*`, `https://api.nexus-alert.com/*`

6. **Set Pricing**
   - Select: "This item offers in-app purchases"
   - Add free tier description
   - Add premium tier: $4.99/month

7. **Fill Single Purpose Description**
   - Copy from listing doc section 13

8. **Submit for Review**
   - Click **Submit for Review**
   - Estimated review time: 1-3 business days

---

## Verification Checklist

Before submitting, verify:

```bash
# Check image dimensions
identify store-assets/marquee-1400x560.png
# Expected: PNG 1400x560

identify store-assets/small-tile-440x280.png
# Expected: PNG 440x280

# Check screenshot dimensions (any of these)
identify store-assets/1-monitor-locations.png
# Expected: PNG 1280x800 OR 640x400

# Verify privacy policy is live
curl -I https://nexus-alert.com/privacy
# Expected: HTTP 200 OK

# Test support email
echo "Test" | mail -s "Test" support@nexus-alert.com
# Check inbox

# Verify extension loads without errors
# Load in chrome://extensions, check console for errors
```

---

## Files Reference

All files are in `store-assets/`:

- `CHROME-WEB-STORE-LISTING.txt` - All copy-paste ready text
- `QUICKSTART-IMAGE-GENERATION.md` - Promotional image generation guide
- `SCREENSHOT-INSTRUCTIONS.md` - Extension screenshot capture guide
- `SUBMISSION-CHECKLIST.md` - Final verification checklist
- `marquee-1400x560.html` - Large promo tile source
- `small-tile-440x280.html` - Small promo tile source

---

## Expected Timeline

- **Part 1** (Promotional images): 30 min
- **Part 2** (Screenshots): 45 min
- **Part 3** (Privacy policy): 15 min
- **Part 4** (Support email): 10 min
- **Part 5** (Package extension): 5 min
- **Part 6** (Submit to store): 30 min

**Total: 2 hours 15 minutes**

Add 30-45 min buffer for troubleshooting = **3 hours total**

---

## Post-Submission

After submission:

1. Monitor review status in developer dashboard
2. Respond to any reviewer questions within 24 hours
3. Once approved, verify extension is live on Chrome Web Store
4. Update `web/` landing page with live Chrome Web Store install link
5. Begin marketing push (Product Hunt, Reddit, social media)

---

## Support

**Questions?**
- Chrome Web Store Docs: https://developer.chrome.com/docs/webstore/
- Extension is at: `/Users/michaelguo/nexus-alert`
- All listing materials are in: `store-assets/`

**Blocked?**
- If puppeteer fails: Use manual screenshot method (equally fast)
- If privacy policy deployment fails: Use GitHub Pages as fallback
- If support email setup is slow: Use personal email temporarily with note in listing

---

## Success Criteria

Task is complete when:

1. Extension package uploaded to Chrome Web Store ✓
2. All listing fields filled with provided copy ✓
3. All 7 images uploaded (2 promotional + 5 screenshots) ✓
4. Privacy policy live and accessible ✓
5. Support email configured and tested ✓
6. Submission status shows "Pending Review" ✓
7. Screenshot of submission confirmation saved ✓

---

## Revenue Impact

**Why this is P0:**

- Current MRR: $0
- Target MRR: $500 in first month (100 paid users × $4.99)
- Blocked until: Extension is live on Chrome Web Store
- Time to revenue: ~3-5 days after approval (review time)
- Total revenue blocked: $6,000/year ($500/mo × 12)

Every day of delay costs ~$16.67 in potential revenue.

---

## Next Task After This

Once submitted and in "Pending Review" status:

1. Set up conversion tracking (Google Analytics on landing page)
2. Prepare Product Hunt launch (scheduled 2 days after CWS approval)
3. Begin outbound marketing (Reddit communities, Facebook groups)
4. Set up customer support workflow (email templates, FAQ)
