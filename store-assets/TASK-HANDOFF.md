# Chrome Web Store Submission - Task Handoff

**Date:** 2026-03-18
**Priority:** P0 - BLOCKING ALL REVENUE
**Estimated Completion:** 2-3 hours
**Assigned To:** [ENGINEER TO BE ASSIGNED]

---

## Executive Summary

The NEXUS Alert Chrome Extension is **production-ready** and **fully tested**. All code is complete. The only blocker to revenue is getting the extension approved and published on the Chrome Web Store.

**Current State:**
- Extension code: ✅ Complete
- Backend API: ✅ Deployed at api.nexus-alert.com
- Landing page: ✅ Live at nexus-alert.com
- Stripe payments: ✅ Configured ($4.99/mo premium tier)
- Listing copy: ✅ Written and ready to paste
- Promotional HTML: ✅ Created (needs screenshot capture)

**What's Missing:**
- 2 promotional images (PNG screenshots from HTML)
- 5 extension screenshots (captured from running extension)
- Privacy policy published at public URL
- Support email configured
- Extension submitted to Chrome Web Store

---

## Revenue Impact

| Metric | Value |
|--------|-------|
| Current MRR | $0 |
| Target Month 1 MRR | $500 (100 paid users) |
| Target Year 1 Revenue | $6,000 |
| Days Blocked | Every day costs ~$17 in potential revenue |
| Estimated Approval Time | 1-3 business days after submission |
| Time to First Revenue | ~5-7 days from NOW |

**This is the #1 priority task** because nothing else matters until users can install the extension.

---

## Task Overview

### Complete Deliverables

1. **Promotional Images**
   - ✅ HTML templates created
   - ⏳ Need PNG screenshots (30 min)

2. **Extension Screenshots**
   - ✅ Extension fully functional
   - ✅ Detailed capture instructions written
   - ⏳ Need 5 screenshots (45 min)

3. **Privacy Policy**
   - ✅ Policy written
   - ⏳ Needs deployment to public URL (15 min)

4. **Support Infrastructure**
   - ⏳ support@nexus-alert.com email setup (10 min)

5. **Chrome Web Store Submission**
   - ✅ All copy written and ready to paste
   - ✅ Extension packaged and tested
   - ⏳ Needs manual submission (30 min)

**Total Time: ~2.5 hours**

---

## Quick Start (10-Second Version)

```bash
# 1. Generate promotional images
./scripts/open-for-screenshots.sh

# 2. Follow screenshot instructions
open store-assets/SCREENSHOT-INSTRUCTIONS.md

# 3. Follow full submission task
open store-assets/CHROME-WEB-STORE-SUBMISSION-TASK.md

# 4. Submit to Chrome Web Store
# All copy is in: store-assets/CHROME-WEB-STORE-LISTING.txt
```

---

## Detailed Instructions

### Step 1: Generate Promotional Images (30 min)

Two options:

**Option A: Automated Helper Script (RECOMMENDED)**
```bash
./scripts/open-for-screenshots.sh
```
This script opens each HTML file in Chrome and guides you through capturing screenshots at exact dimensions.

**Option B: Manual**
```bash
open store-assets/QUICKSTART-IMAGE-GENERATION.md
```
Follow the manual DevTools screenshot guide.

**Deliverables:**
- `store-assets/marquee-1400x560.png` (1400x560 PNG)
- `store-assets/small-tile-440x280.png` (440x280 PNG)

---

### Step 2: Capture Extension Screenshots (45 min)

```bash
open store-assets/SCREENSHOT-INSTRUCTIONS.md
```

You need 5 screenshots showing:
1. Location monitoring interface
2. Available slots found
3. Premium upgrade settings
4. Onboarding flow
5. Desktop notification

**How to load extension:**
1. Open Chrome
2. Go to `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select `/Users/michaelguo/nexus-alert`

**Deliverables:**
- `store-assets/1-monitor-locations.png`
- `store-assets/2-slots-found.png`
- `store-assets/3-settings-premium.png`
- `store-assets/4-onboarding-step2.png`
- `store-assets/5-notification.png`

---

### Step 3: Publish Privacy Policy (15 min)

**Option A: Deploy to nexus-alert.com**
```bash
mkdir -p web/src/app/privacy
cp store-assets/privacy-policy-updated.md web/src/app/privacy/page.mdx
cd web
vercel --prod
```
Privacy policy will be live at: `https://nexus-alert.com/privacy`

**Option B: GitHub Pages (fallback)**
Convert markdown to HTML and publish via GitHub Pages.

---

### Step 4: Configure Support Email (10 min)

Set up `support@nexus-alert.com`

**Options:**
- **Google Workspace:** $6/mo, professional, includes Gmail interface
- **Zoho Mail:** Free tier available for custom domains
- **Email Forwarding:** Forward to personal email (cheapest)

Test by sending a test email to verify delivery.

---

### Step 5: Submit to Chrome Web Store (30 min)

**Detailed task document:**
```bash
open store-assets/CHROME-WEB-STORE-SUBMISSION-TASK.md
```

**Quick version:**
1. Go to: https://chrome.google.com/webstore/devconsole
2. Pay $5 one-time developer fee (if first submission)
3. Click "New Item"
4. Upload extension package
5. Copy-paste all fields from `CHROME-WEB-STORE-LISTING.txt`
6. Upload all 7 images (2 promotional + 5 screenshots)
7. Submit for review

---

## Files You Need

All files are in `store-assets/`:

| File | Purpose |
|------|---------|
| `CHROME-WEB-STORE-SUBMISSION-TASK.md` | Complete step-by-step task guide |
| `CHROME-WEB-STORE-LISTING.txt` | All copy-paste ready text for submission |
| `QUICKSTART-IMAGE-GENERATION.md` | Promotional image generation guide |
| `SCREENSHOT-INSTRUCTIONS.md` | Extension screenshot capture guide |
| `SUBMISSION-CHECKLIST.md` | Final verification before submission |
| `marquee-1400x560.html` | Large promotional tile source |
| `small-tile-440x280.html` | Small promotional tile source |
| `privacy-policy-updated.md` | Privacy policy text |

---

## Verification Checklist

Before submitting, ensure:

```bash
# Promotional images exist and are correct dimensions
ls -lh store-assets/marquee-1400x560.png
ls -lh store-assets/small-tile-440x280.png

# All 5 screenshots exist
ls -lh store-assets/{1,2,3,4,5}-*.png

# Privacy policy is live
curl -I https://nexus-alert.com/privacy

# Support email works
echo "Test" | mail -s "Test" support@nexus-alert.com

# Extension loads without errors
# Load in chrome://extensions, check console
```

---

## Success Criteria

Task is **COMPLETE** when:

1. ✅ Extension submitted to Chrome Web Store
2. ✅ Submission status shows "Pending Review"
3. ✅ All 7 images uploaded (verified in dashboard)
4. ✅ Privacy policy URL accessible
5. ✅ Support email configured and tested
6. ✅ Screenshot of submission confirmation saved

---

## Troubleshooting

**Puppeteer crashes when generating images**
→ Use manual screenshot method with DevTools (equally fast, more reliable)

**Extension doesn't load in Chrome**
→ Check console for errors, verify manifest.json is valid

**Screenshot dimensions are wrong**
→ Use DevTools device toolbar to set exact viewport dimensions

**Privacy policy deployment fails**
→ Use GitHub Pages as fallback

**Don't have $5 for developer fee**
→ This is required, no workaround. Consider it a business expense.

---

## Post-Submission

After you click "Submit for Review":

1. **Monitor dashboard** for review status (usually 1-3 business days)
2. **Respond quickly** to any reviewer questions (within 24 hours)
3. **Notify stakeholders** when approved
4. **Update landing page** with live Chrome Web Store link
5. **Begin marketing** (Product Hunt launch scheduled 2 days after approval)

---

## Questions?

**Blocked on something?**
- Chrome Web Store Docs: https://developer.chrome.com/docs/webstore/
- Extension Developer Guide: https://developer.chrome.com/docs/extensions/

**Need clarification?**
- All task details are in `CHROME-WEB-STORE-SUBMISSION-TASK.md`
- Screenshot guides are comprehensive with examples
- Listing copy is 100% ready to paste, no editing needed

**Can't complete part of the task?**
- Document blocker and move to next step
- Most steps are independent (can do out of order)
- Minimum viable submission: extension + images + privacy + email

---

## Timeline

| Task | Time | Status |
|------|------|--------|
| Generate promotional images | 30 min | ⏳ Not started |
| Capture extension screenshots | 45 min | ⏳ Not started |
| Publish privacy policy | 15 min | ⏳ Not started |
| Configure support email | 10 min | ⏳ Not started |
| Submit to Chrome Web Store | 30 min | ⏳ Not started |
| **TOTAL** | **2h 10min** | **⏳ Not started** |

**Expected completion:** Same day if started now
**Expected approval:** 1-3 business days after submission
**Expected first revenue:** 5-7 days from now

---

## Next Steps After This Task

Once extension is **submitted and pending review**:

1. Set up conversion analytics (Google Analytics on landing page)
2. Prepare Product Hunt launch materials
3. Draft outbound marketing messages (Reddit, Facebook groups)
4. Set up customer support workflow (email templates)
5. Plan social media launch announcements

But **NONE of that matters** until this task is complete.

---

## Priority Justification

Why is this P0?

- **Blocks all revenue:** Can't get users without Chrome Web Store presence
- **Time-sensitive:** Each day of delay costs ~$17 in lost potential revenue
- **Ready to go:** Extension is production-ready, just needs submission
- **High leverage:** 2-3 hours of work unlocks entire revenue stream
- **No dependencies:** Everything needed is already complete

This is the most important task in the entire project right now.

**Assign immediately. Complete within 24 hours.**
