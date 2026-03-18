# Chrome Web Store Assets - Complete Package

This directory contains everything needed to submit NEXUS Alert to the Chrome Web Store.

---

## Quick Start

**Engineer assigned to this task:**

1. **Start here:** [`TASK-HANDOFF.md`](./TASK-HANDOFF.md) - Executive summary and quick start
2. **Full task details:** [`CHROME-WEB-STORE-SUBMISSION-TASK.md`](./CHROME-WEB-STORE-SUBMISSION-TASK.md)
3. **Listing copy:** [`CHROME-WEB-STORE-LISTING.txt`](./CHROME-WEB-STORE-LISTING.txt) - Copy-paste ready

**Estimated time:** 2-3 hours total

---

## Directory Structure

### Primary Task Documents

| File | Purpose | Time |
|------|---------|------|
| [`TASK-HANDOFF.md`](./TASK-HANDOFF.md) | Executive summary, quick start, task overview | 5 min read |
| [`CHROME-WEB-STORE-SUBMISSION-TASK.md`](./CHROME-WEB-STORE-SUBMISSION-TASK.md) | Complete step-by-step submission guide | 10 min read |
| [`SUBMISSION-CHECKLIST.md`](./SUBMISSION-CHECKLIST.md) | Final verification before submitting | 5 min |

### Copy-Paste Ready Content

| File | Purpose |
|------|---------|
| [`CHROME-WEB-STORE-LISTING.txt`](./CHROME-WEB-STORE-LISTING.txt) | All text for store listing (name, descriptions, keywords, etc.) |
| [`privacy-policy-updated.md`](./privacy-policy-updated.md) | Privacy policy text (needs deployment to public URL) |

### Image Generation Guides

| File | Purpose | Method |
|------|---------|--------|
| [`QUICKSTART-IMAGE-GENERATION.md`](./QUICKSTART-IMAGE-GENERATION.md) | Manual screenshot guide using Chrome DevTools | Manual (recommended) |
| [`../scripts/open-for-screenshots.sh`](../scripts/open-for-screenshots.sh) | Automated helper script | Semi-automated |
| [`generate-images.html`](./generate-images.html) | Browser-based image generator | Browser tool |

### Screenshot Guides

| File | Purpose |
|------|---------|
| [`SCREENSHOT-INSTRUCTIONS.md`](./SCREENSHOT-INSTRUCTIONS.md) | Detailed guide for capturing all 5 extension screenshots |

### Promotional Image Sources (HTML)

| File | Dimensions | Output |
|------|-----------|--------|
| [`marquee-1400x560.html`](./marquee-1400x560.html) | 1400x560 | `marquee-1400x560.png` |
| [`small-tile-440x280.html`](./small-tile-440x280.html) | 440x280 | `small-tile-440x280.png` |

### Supporting Documents

| File | Purpose |
|------|---------|
| [`README.md`](./README.md) | Overview of store assets |
| [`SUMMARY.md`](./SUMMARY.md) | Summary of what's been prepared |
| [`PACKAGING-INSTRUCTIONS.md`](./PACKAGING-INSTRUCTIONS.md) | How to package the extension |
| [`GENERATE-IMAGES.md`](./GENERATE-IMAGES.md) | Alternative image generation methods |

---

## Required Deliverables

### Images (7 total)

**Promotional Images (2):**
- [ ] `marquee-1400x560.png` - Large promotional banner
- [ ] `small-tile-440x280.png` - Small promotional tile

**Extension Screenshots (5):**
- [ ] `1-monitor-locations.png` - Location selection interface
- [ ] `2-slots-found.png` - Available appointment slots
- [ ] `3-settings-premium.png` - Premium upgrade settings
- [ ] `4-onboarding-step2.png` - Onboarding flow
- [ ] `5-notification.png` - Desktop notification

### Infrastructure

- [ ] Privacy policy published at `https://nexus-alert.com/privacy`
- [ ] Support email `support@nexus-alert.com` configured
- [ ] Extension package created (`.zip` file)

### Submission

- [ ] Chrome Web Store Developer account ($5 fee paid)
- [ ] All listing fields filled
- [ ] All images uploaded
- [ ] Submission status: "Pending Review"

---

## Workflow

### Phase 1: Image Generation (1 hour)

1. Generate promotional images:
   ```bash
   ../scripts/open-for-screenshots.sh
   ```
   Or follow manual guide: [`QUICKSTART-IMAGE-GENERATION.md`](./QUICKSTART-IMAGE-GENERATION.md)

2. Capture extension screenshots:
   - Load extension in Chrome (`chrome://extensions` → Load unpacked)
   - Follow guide: [`SCREENSHOT-INSTRUCTIONS.md`](./SCREENSHOT-INSTRUCTIONS.md)
   - Capture all 5 required screenshots

### Phase 2: Infrastructure Setup (30 min)

1. Publish privacy policy:
   ```bash
   mkdir -p ../web/src/app/privacy
   cp privacy-policy-updated.md ../web/src/app/privacy/page.mdx
   cd ../web && vercel --prod
   ```

2. Set up support email:
   - Create `support@nexus-alert.com`
   - Test with a test email

### Phase 3: Submission (30 min)

1. Package extension:
   ```bash
   cd .. && npm run package
   ```

2. Go to Chrome Web Store Developer Dashboard:
   https://chrome.google.com/webstore/devconsole

3. Fill all fields using content from [`CHROME-WEB-STORE-LISTING.txt`](./CHROME-WEB-STORE-LISTING.txt)

4. Upload all 7 images

5. Submit for review

---

## Image Dimensions Reference

| Image Type | Dimensions | Format | File Size |
|-----------|-----------|--------|-----------|
| Marquee (required) | 1400 x 560 | PNG | < 5MB |
| Small Tile (optional but recommended) | 440 x 280 | PNG | < 5MB |
| Screenshots (required 1-5) | 1280 x 800 OR 640 x 400 | PNG/JPG | < 5MB each |

---

## Chrome Web Store Requirements Checklist

### Technical Requirements

- ✅ Manifest Version 3 (using v3)
- ✅ No prohibited content (clean extension)
- ✅ Single purpose clearly defined
- ✅ All permissions justified
- ✅ No obfuscated code
- ✅ Privacy policy URL (pending deployment)

### Listing Requirements

- ✅ Product name (132 chars max)
- ✅ Short description (132 chars)
- ✅ Detailed description (16,000 chars max)
- ✅ Category selected (Productivity)
- ✅ Language specified (English US)
- ✅ At least 1 screenshot (we have 5)
- ✅ Icon (128x128, included in extension)
- ⏳ Privacy policy live URL
- ⏳ Support email configured

### Developer Account

- ⏳ Google account verified
- ⏳ $5 one-time registration fee paid
- ⏳ Developer agreement accepted

---

## Verification Commands

Before submitting, run these checks:

```bash
# Check promotional images exist and have correct dimensions
identify marquee-1400x560.png
# Expected: PNG 1400x560

identify small-tile-440x280.png
# Expected: PNG 440x280

# Check all screenshots exist
ls -1 {1,2,3,4,5}-*.png
# Should list 5 files

# Verify privacy policy is accessible
curl -I https://nexus-alert.com/privacy
# Expected: HTTP 200 OK

# Test extension package is valid
cd .. && npm run package
unzip -l nexus-alert-submission.zip
# Should contain: manifest.json, background.js, popup.html, etc.

# Verify support email
echo "Test" | mail -s "Test" support@nexus-alert.com
# Check inbox
```

---

## Common Issues & Solutions

### Issue: Puppeteer crashes during image generation

**Solution:** Use manual screenshot method with Chrome DevTools instead. It's equally fast and more reliable.

**Guide:** [`QUICKSTART-IMAGE-GENERATION.md`](./QUICKSTART-IMAGE-GENERATION.md)

### Issue: Screenshot dimensions are wrong

**Solution:** Use Chrome DevTools device toolbar to set exact viewport:
1. Open DevTools (`Cmd+Option+I`)
2. Toggle device toolbar (`Cmd+Shift+M`)
3. Set exact dimensions (e.g., `1280 x 800`)
4. Capture screenshot from DevTools menu

### Issue: Extension doesn't load

**Solution:**
1. Check `chrome://extensions` for error messages
2. Verify manifest.json is valid JSON
3. Check console for JavaScript errors
4. Ensure all file paths in manifest are correct

### Issue: Privacy policy deployment fails

**Solution:** Use GitHub Pages as fallback:
1. Convert markdown to HTML
2. Push to GitHub repository
3. Enable GitHub Pages in settings
4. Use URL: `https://[username].github.io/nexus-alert/privacy`

---

## Timeline Estimate

| Phase | Tasks | Time |
|-------|-------|------|
| **Image Generation** | Promotional images (2) + Screenshots (5) | 60 min |
| **Infrastructure** | Privacy policy + Support email | 30 min |
| **Submission** | Package + Upload + Fill forms | 30 min |
| **Buffer** | Troubleshooting, verification | 30 min |
| **TOTAL** | | **2.5 hours** |

Add 30-45 minutes for first-time submission (reading docs, understanding interface).

---

## Post-Submission

After clicking "Submit for Review":

1. **Monitor status** in developer dashboard (check daily)
2. **Review time:** Usually 1-3 business days
3. **Respond quickly** to reviewer questions (< 24 hours)
4. **Common rejection reasons:**
   - Permissions not fully justified
   - Privacy policy missing or inadequate
   - Screenshots don't show actual functionality
   - Single purpose unclear

5. **Once approved:**
   - Verify extension is live on Chrome Web Store
   - Update landing page with install link
   - Begin marketing (Product Hunt, social media)
   - Monitor reviews and ratings

---

## Revenue Impact

**Current state:** $0 MRR (no users can install extension)

**After approval:**
- Month 1 target: 100 paid users × $4.99 = $500 MRR
- Year 1 target: $6,000 ARR
- Each day of delay costs ~$17 in potential revenue

**This is the #1 blocker to revenue.**

---

## Support

**Chrome Web Store Documentation:**
- Developer guide: https://developer.chrome.com/docs/webstore/
- Submission checklist: https://developer.chrome.com/docs/webstore/publish/

**Extension Documentation:**
- Manifest V3: https://developer.chrome.com/docs/extensions/mv3/intro/
- Publishing: https://developer.chrome.com/docs/webstore/publish/

**Need help?**
- All task instructions are in this directory
- Listing copy is 100% ready to use
- Screenshot guides include examples
- Privacy policy is pre-written

---

## File Versions

Last updated: 2026-03-18

- Extension version: 2.0.0
- Manifest version: 3
- Listing copy: Final (ready for submission)
- Privacy policy: Updated for GDPR/CCPA compliance
- Screenshots: Pending generation

---

## Success Criteria

This task is **COMPLETE** when all of the following are true:

1. ✅ Extension submitted to Chrome Web Store
2. ✅ Submission status shows "Pending Review"
3. ✅ All 7 images uploaded and verified in dashboard
4. ✅ Privacy policy accessible at public URL
5. ✅ Support email configured and tested
6. ✅ Screenshot of submission confirmation saved
7. ✅ Stakeholders notified of submission

**Then we wait 1-3 days for Google review.**

---

## Next Task

After submission is complete and pending review:

**Prepare for launch:**
1. Set up Google Analytics conversion tracking
2. Prepare Product Hunt launch (2 days after approval)
3. Draft social media announcements
4. Set up customer support email templates
5. Create FAQ page on landing site

**But none of that matters until this submission is complete.**

This is the most important task in the entire project.
