# Chrome Web Store Submission Assets — Summary

All Chrome Web Store submission assets have been created and are ready for use.

---

## ✅ What's Ready

### 1. Package (Automated)
- ✅ `npm run package` script created and tested
- ✅ Generates `nexus-alert-submission.zip` (22.5 KB)
- ✅ Contains exactly 15 files (9 root + 4 icons + src/slotFilters.js)
- ✅ Excludes all unnecessary files (backend, web, node_modules, etc.)

### 2. Promotional Image Templates
- ✅ `marquee-1400x560.html` — Large promotional banner template
- ✅ `small-tile-440x280.html` — Small tile template
- ✅ Both templates ready to screenshot at exact dimensions

### 3. Listing Copy
- ✅ `SHORT-DESCRIPTION.txt` — 132 characters exactly
- ✅ `DETAILED-DESCRIPTION.txt` — Complete store listing description
- ✅ Features free vs. premium tiers clearly explained

### 4. Privacy Policy
- ✅ `privacy-policy-updated.md` — Updated for premium tier (collects email)
- ✅ Complies with GDPR, CCPA, PIPEDA
- ✅ Clearly states data usage and third-party services

### 5. Documentation
- ✅ `SUBMISSION-CHECKLIST.md` — Complete step-by-step guide
- ✅ `SCREENSHOT-INSTRUCTIONS.md` — How to capture 5 required screenshots
- ✅ `PACKAGING-INSTRUCTIONS.md` — Manual packaging fallback
- ✅ `GENERATE-IMAGES.md` — How to create promotional images
- ✅ `README.md` — Overview of all assets

---

## ⏳ What You Need to Do

### 1. Generate Promotional Images (15-30 minutes)

Open the HTML templates in Chrome and screenshot:

```bash
# Open in Chrome
open store-assets/marquee-1400x560.html
open store-assets/small-tile-440x280.html
```

Then:
1. Resize browser to exact dimensions (1400x560 or 440x280)
2. Take screenshot (Cmd+Shift+5 on macOS)
3. Save as PNG: `marquee-1400x560.png` and `small-tile-440x280.png`

See `GENERATE-IMAGES.md` for detailed instructions.

### 2. Capture 5 Screenshots (30-60 minutes)

From the running extension, capture:

1. **Monitor tab** — Location selection view
2. **Slots found** — Live slot cards displayed
3. **Settings tab** — Premium plan upgrade section
4. **Onboarding step 2** — Location selection during setup
5. **Desktop notification** — Chrome notification popup

See `SCREENSHOT-INSTRUCTIONS.md` for detailed instructions.

### 3. Publish Privacy Policy (5 minutes)

Upload `privacy-policy-updated.md` to a public URL:

**Option A: GitHub Pages**
```bash
# Create gh-pages branch
git checkout -b gh-pages
cp store-assets/privacy-policy-updated.md privacy.md
git add privacy.md
git commit -m "Add privacy policy"
git push origin gh-pages
```

Privacy policy will be at: `https://[your-username].github.io/nexus-alert/privacy`

**Option B: Landing Page**
- Add privacy policy to `web/src/app/privacy/page.tsx`
- Deploy to Vercel
- Privacy policy at: `https://nexus-alert.com/privacy`

### 4. Set Up Support Email (5 minutes)

Create a support email address:
- `support@nexus-alert.com` (if you own the domain)
- Or use: `nexus-alert-support@gmail.com`

### 5. Submit to Chrome Web Store (30 minutes)

1. Log in to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Pay $5 one-time developer fee (if first submission)
3. Click **New Item**
4. Upload `nexus-alert-submission.zip`
5. Upload screenshots and promotional images
6. Fill in listing details (use provided copy)
7. Set privacy policy URL
8. Submit for review

Follow `SUBMISSION-CHECKLIST.md` for the complete process.

---

## 📊 File Inventory

### In `store-assets/` Directory

| File | Purpose | Status |
|------|---------|--------|
| `README.md` | Overview of submission assets | ✅ Ready |
| `SUMMARY.md` | This file — what's done and what's next | ✅ Ready |
| `SUBMISSION-CHECKLIST.md` | Step-by-step submission guide | ✅ Ready |
| `SCREENSHOT-INSTRUCTIONS.md` | How to capture screenshots | ✅ Ready |
| `PACKAGING-INSTRUCTIONS.md` | Manual packaging guide | ✅ Ready |
| `GENERATE-IMAGES.md` | How to create promotional images | ✅ Ready |
| `SHORT-DESCRIPTION.txt` | 132-char summary | ✅ Ready |
| `DETAILED-DESCRIPTION.txt` | Full listing description | ✅ Ready |
| `privacy-policy-updated.md` | Updated privacy policy | ✅ Ready |
| `marquee-1400x560.html` | Marquee image template | ✅ Ready |
| `small-tile-440x280.html` | Small tile template | ✅ Ready |

### Legacy Files (for reference, not needed for submission)

| File | Purpose |
|------|---------|
| `description.txt` | Old description (replaced) |
| `listing-metadata.txt` | Old metadata (info now in checklist) |
| `screenshot-guide.txt` | Old guide (replaced) |
| `privacy-policy.md` | Old policy (replaced with updated version) |

---

## 🚀 Quick Start

To submit NEXUS Alert to the Chrome Web Store TODAY:

```bash
# 1. Create the package
npm run package

# 2. Generate promotional images
# - Open marquee-1400x560.html in Chrome
# - Screenshot at 1400x560
# - Open small-tile-440x280.html in Chrome
# - Screenshot at 440x280

# 3. Capture 5 screenshots from running extension
# - See SCREENSHOT-INSTRUCTIONS.md

# 4. Publish privacy policy to public URL

# 5. Go to Chrome Web Store Dashboard
# - https://chrome.google.com/webstore/devconsole
# - Upload package
# - Upload images
# - Fill in listing details
# - Submit!
```

**Estimated time:** 2-3 hours total

**Review time:** 1-3 business days

---

## 📝 Listing Details (Copy-Paste Ready)

### Title
```
NEXUS Alert
```

### Short Description (132 chars)
```
Get instant alerts when NEXUS, Global Entry & SENTRI appointment slots open. Free monitoring every 30min, premium every 2min.
```

### Category
```
Productivity
```

### Language
```
English
```

### Keywords
```
nexus, global entry, sentri, trusted traveler, appointment, ttp, goes, cbp, slot monitor, notification
```

### Privacy Policy URL
```
https://[your-domain]/privacy
```
(Replace after publishing)

### Support Email
```
support@nexus-alert.com
```
(Or your chosen email)

### Support URL
```
https://github.com/[your-username]/nexus-alert/issues
```

---

## 🎯 Success Criteria

Before submitting, verify:

- [x] Package created and tested (`npm run package`)
- [ ] Promotional images generated (marquee + small tile)
- [ ] 5 screenshots captured at correct size
- [ ] Privacy policy published at public URL
- [ ] Support email set up
- [ ] All listing copy reviewed for typos
- [ ] Extension tested as unpacked in Chrome
- [ ] Developer account created ($5 paid)

Once all checked: **Ready to submit!** 🚀

---

## 💡 Tips

### To Speed Things Up

1. **Use Chrome DevTools for screenshots** — Set exact dimensions (Cmd+Shift+M)
2. **Test the package first** — Unzip and load as unpacked extension
3. **Save as draft** — Fill in listing details, save, then review later
4. **Preview before submitting** — Use Dashboard's preview mode

### Common Pitfalls to Avoid

- ❌ Screenshots wrong size (use 1280x800 or 640x400)
- ❌ Privacy policy not accessible (publish to public URL first)
- ❌ Package contains `node_modules/` or `backend/` (use `npm run package`)
- ❌ Description has typos (review `DETAILED-DESCRIPTION.txt`)
- ❌ Missing support email (set up first)

---

## 📞 Support

If you encounter issues:

1. Check the detailed guides in this directory
2. Review Chrome Web Store policies: https://developer.chrome.com/docs/webstore/program-policies/
3. Test locally before submitting
4. Use the preview mode in the Dashboard to catch errors

---

## 🎉 After Approval

Once approved:

1. **Announce:**
   - Post on r/nexus, r/GlobalEntry
   - Tweet the Chrome Web Store link
   - Email leads from `leads.json`

2. **Update:**
   - Add Chrome Web Store badge to landing page
   - Update README with store link

3. **Monitor:**
   - Check user reviews
   - Respond to questions
   - Fix bugs

4. **Promote:**
   - Submit to Product Hunt
   - Create demo video
   - Write launch blog post

---

**Ready to launch?** Follow `SUBMISSION-CHECKLIST.md` for the complete walkthrough. Good luck! 🚀
