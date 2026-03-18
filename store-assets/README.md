# Chrome Web Store Submission Assets

This directory contains all assets and documentation needed to submit NEXUS Alert to the Chrome Web Store.

---

## Quick Start

1. **Create the package:**
   ```bash
   npm run package
   ```

2. **Generate promotional images:**
   - Open `marquee-1400x560.html` in Chrome
   - Screenshot at exact size (1400x560)
   - Repeat for `small-tile-440x280.html` (440x280)
   - See `GENERATE-IMAGES.md` for detailed instructions

3. **Capture screenshots:**
   - Follow instructions in `SCREENSHOT-INSTRUCTIONS.md`
   - Need 5 screenshots at 1280x800 or 640x400

4. **Submit to Chrome Web Store:**
   - Follow checklist in `SUBMISSION-CHECKLIST.md`
   - Upload package, images, and screenshots
   - Fill in listing details

---

## Files in This Directory

### 📝 Documentation

| File | Purpose |
|------|---------|
| `README.md` | This file — overview of submission assets |
| `SUBMISSION-CHECKLIST.md` | Complete step-by-step submission guide |
| `SCREENSHOT-INSTRUCTIONS.md` | How to capture the 5 required screenshots |
| `PACKAGING-INSTRUCTIONS.md` | How to create the submission zip file |
| `GENERATE-IMAGES.md` | How to create promotional images |

### 🖼️ Templates

| File | Purpose |
|------|---------|
| `marquee-1400x560.html` | Template for large promotional image (1400x560) |
| `small-tile-440x280.html` | Template for small tile image (440x280) |

### ✍️ Copy

| File | Purpose |
|------|---------|
| `SHORT-DESCRIPTION.txt` | 132-character store listing summary |
| `DETAILED-DESCRIPTION.txt` | Full store listing description |
| `privacy-policy-updated.md` | Updated privacy policy (includes premium tier) |

### 📋 Legacy Files (for reference)

| File | Purpose |
|------|---------|
| `description.txt` | Old description (replaced by DETAILED-DESCRIPTION.txt) |
| `listing-metadata.txt` | Old metadata (info now in SUBMISSION-CHECKLIST.md) |
| `screenshot-guide.txt` | Old guide (replaced by SCREENSHOT-INSTRUCTIONS.md) |
| `privacy-policy.md` | Old privacy policy (replaced by privacy-policy-updated.md) |

---

## Submission Workflow

### Phase 1: Preparation (1-2 hours)

- [ ] Create package with `npm run package`
- [ ] Generate promotional images (marquee + small tile)
- [ ] Capture 5 screenshots from running extension
- [ ] Verify all images are correct size and format
- [ ] Review descriptions for typos

### Phase 2: Submission (30 minutes)

- [ ] Log in to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [ ] Create new item
- [ ] Upload `nexus-alert-submission.zip`
- [ ] Fill in listing details (title, description, category)
- [ ] Upload promotional images and screenshots
- [ ] Set privacy practices and permissions
- [ ] Save draft and preview

### Phase 3: Review (1-3 business days)

- [ ] Submit for review
- [ ] Wait for Chrome Web Store team to review
- [ ] Respond to any feedback
- [ ] Once approved, extension goes live

---

## Required Assets Checklist

### Package
- [ ] `nexus-alert-submission.zip` (created by `npm run package`)

### Promotional Images
- [ ] `marquee-1400x560.png` (1400x560 px)
- [ ] `small-tile-440x280.png` (440x280 px)

### Screenshots (5 required, 1280x800 or 640x400)
- [ ] Screenshot 1: Monitor tab with location selection
- [ ] Screenshot 2: Available slots found
- [ ] Screenshot 3: Settings tab showing premium plan
- [ ] Screenshot 4: Onboarding step 2
- [ ] Screenshot 5: Desktop notification

### Listing Copy
- [ ] Title: "NEXUS Alert" (30 chars max)
- [ ] Short description: 132 chars (from `SHORT-DESCRIPTION.txt`)
- [ ] Detailed description: (from `DETAILED-DESCRIPTION.txt`)
- [ ] Category: Productivity
- [ ] Language: English

### Legal
- [ ] Privacy policy URL: `https://nexus-alert.com/privacy`
- [ ] Support email: `support@nexus-alert.com`
- [ ] Terms of service URL (optional): `https://nexus-alert.com/terms`

---

## Key Dimensions & Limits

| Asset | Dimensions | Format | Max Size | Required |
|-------|------------|--------|----------|----------|
| Package | N/A | ZIP | 100 MB | ✅ Yes |
| Marquee | 1400x560 | PNG | 5 MB | ❌ Optional |
| Small Tile | 440x280 | PNG | 5 MB | ❌ Optional |
| Screenshots | 1280x800 or 640x400 | PNG/JPG | 5 MB each | ✅ Yes (1-5) |
| Title | N/A | Text | 30 chars | ✅ Yes |
| Summary | N/A | Text | 132 chars | ✅ Yes |
| Description | N/A | Text | 16,000 chars | ✅ Yes |

---

## Testing Before Submission

Always test the packaged extension before submitting:

```bash
# 1. Create package
npm run package

# 2. Unzip to test directory
unzip nexus-alert-submission.zip -d /tmp/nexus-alert-test

# 3. Load in Chrome
# - Go to chrome://extensions
# - Enable Developer mode
# - Click "Load unpacked"
# - Select /tmp/nexus-alert-test

# 4. Test all features
# - Popup opens correctly
# - Onboarding works
# - Location selection works
# - "Check Now" button works
# - Settings save properly
# - Notifications appear

# 5. Clean up
rm -rf /tmp/nexus-alert-test
```

---

## Common Issues

### Issue: Package contains excluded files

**Cause:** Packaging script not working correctly

**Fix:**
```bash
# Manually verify zip contents
unzip -l nexus-alert-submission.zip

# Should contain ONLY:
# - manifest.json
# - background.js, popup.html/js, offscreen.html/js, onboarding.html/js
# - icons/ (4 files)
# - src/slotFilters.js
```

### Issue: Screenshots wrong size

**Cause:** Not using exact dimensions

**Fix:** Use Chrome DevTools Device Toolbar (Cmd+Shift+M) to set exact dimensions (1280x800 or 640x400) before capturing

### Issue: Privacy policy URL not accessible

**Cause:** Privacy policy not published yet

**Fix:** Publish privacy policy to public URL first:
- GitHub Pages: `https://yourusername.github.io/nexus-alert/privacy.html`
- Landing page: `https://nexus-alert.com/privacy`
- Vercel: Deploy web/ directory with privacy route

### Issue: Rejection for misleading description

**Cause:** Claims like "guaranteed appointments" or "official CBP tool"

**Fix:** Use the provided `DETAILED-DESCRIPTION.txt` which clearly states "not affiliated with CBP" and makes no guarantees

---

## Support Resources

- **Chrome Web Store Policies:** https://developer.chrome.com/docs/webstore/program-policies/
- **Developer Dashboard:** https://chrome.google.com/webstore/devconsole
- **Review Process:** https://developer.chrome.com/docs/webstore/review-process/
- **Best Practices:** https://developer.chrome.com/docs/webstore/best_practices/

---

## Timeline

| Phase | Duration |
|-------|----------|
| Asset preparation | 1-2 hours |
| Submission form | 30 minutes |
| Initial review | 1-3 business days |
| Revisions (if needed) | 1-2 days |
| **Total** | **2-5 business days** |

---

## Next Steps After Approval

Once the extension is approved and live:

1. **Announce the launch:**
   - Post on r/nexus, r/GlobalEntry, r/chrome_extensions
   - Share on Twitter, LinkedIn
   - Email leads from `leads.json`

2. **Update landing page:**
   - Add Chrome Web Store badge
   - Link to live extension URL
   - Show installation count

3. **Monitor:**
   - Check user reviews daily
   - Respond to questions
   - Fix reported bugs
   - Track installations

4. **Promote:**
   - Submit to Product Hunt
   - Create demo video
   - Write blog post

---

## Questions?

If you run into issues during submission:

1. Check `SUBMISSION-CHECKLIST.md` for detailed steps
2. Review Chrome Web Store policies
3. Test the package locally first
4. Ensure all assets meet size/format requirements

Good luck! 🚀
