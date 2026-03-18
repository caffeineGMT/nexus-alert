# Chrome Web Store Submission - Quick Start Guide

**Time Required:** 30 minutes
**Status:** Ready to submit NOW

---

## Pre-Flight Check

All assets verified and ready:

```bash
✓ Extension package: dist/nexus-alert-v2.0.0.zip (28 KB)
✓ Promotional images: 2 files (marquee + small tile)
✓ Screenshots: 5 files (1280x800)
✓ Store listing copy: store-assets/CHROME-WEB-STORE-LISTING.txt
✓ Privacy policy: https://nexus-alert.com/privacy (LIVE)
✓ Landing page: https://nexus-alert.com (LIVE)
✓ Backend API: https://api.nexus-alert.com (LIVE)
```

---

## Step 1: Submit to Chrome Web Store (30 min)

### A. Access Developer Console
1. Go to: https://chrome.google.com/webstore/devconsole
2. Sign in with Google account
3. Pay $5 developer fee (first time only)
4. Click "New Item"

### B. Upload Extension
1. Upload: `dist/nexus-alert-v2.0.0.zip`
2. Wait for validation
3. Verify: No errors (warnings OK)

### C. Fill Store Listing
**Copy-paste all content from:** `store-assets/CHROME-WEB-STORE-LISTING.txt`

**Product Details:**
- Name: NEXUS Alert - Appointment Slot Finder for NEXUS, Global Entry & SENTRI
- Short description: (132 chars - in listing file)
- Detailed description: (Full description - in listing file)
- Category: Productivity
- Language: English (United States)

**Links:**
- Homepage: https://nexus-alert.com
- Privacy: https://nexus-alert.com/privacy
- Support: support@nexus-alert.com

**Images:** Upload from `store-assets/`
- Marquee: marquee-1400x560.png
- Small tile: small-tile-440x280.png
- Screenshots: 1-monitor-locations.png through 5-notification.png

**Permissions:** Copy justifications from listing file
- alarms, notifications, storage, offscreen, tabs
- Host permissions: ttp.cbp.dhs.gov, api.nexus-alert.com

**Distribution:**
- Pricing: In-app purchases (Free + $4.99/mo Premium)
- Visibility: Public
- Regions: All regions

### D. Submit for Review
1. Click "Preview" to verify
2. Click "Submit for Review"
3. **SAVE EXTENSION ID** (32-character string)

**Example ID:** `abcdefghijklmnopqrstuvwxyz123456`

---

## Step 2: Propagate Extension ID (2 min)

Once you have your Extension ID:

```bash
# Run this ONE command
./scripts/update-extension-id.sh YOUR_EXTENSION_ID_HERE

# Example:
./scripts/update-extension-id.sh abcdefghijklmnopqrstuvwxyz123456
```

This updates:
- README.md install link
- 40+ web app pages and components
- Product Hunt landing page CTAs
- Blog post CTAs
- Program-specific pages (NEXUS, Global Entry, SENTRI)

---

## Step 3: Deploy Updates (5 min)

```bash
# Build and deploy web app
cd web
npm run build
vercel --prod

# Commit changes
cd ..
git add -A
git commit -m "Update Chrome Extension ID after Web Store submission"
git push origin main
```

---

## Step 4: Verify Deployment (2 min)

```bash
# Test homepage install link
curl -s https://nexus-alert.com | grep "chrome.google.com/webstore"

# Should show your actual extension ID, not EXTENSION_ID placeholder
```

Visit https://nexus-alert.com and verify:
- "Install Extension" button exists
- Clicking it redirects to Chrome Web Store (will 404 until approved)
- URL contains your extension ID

---

## Expected Timeline

| Event | Timeline |
|-------|----------|
| Submission confirmation | Immediate |
| Email confirmation | Within 1 hour |
| Automated review | 1-2 hours |
| Manual review | 1-3 business days |
| Approval | 3-5 business days total |

**Most extensions approved in 3 business days.**

---

## After Approval

### Immediate Actions (Day 1)

1. **Verify extension is live:**
   ```bash
   # Visit your store listing
   open "https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID"
   ```

2. **Test installation flow:**
   - Install from Chrome Web Store
   - Complete onboarding
   - Verify premium checkout works (Stripe)
   - Test appointment monitoring

3. **Update marketing:**
   - Verify homepage install link works
   - Post to Twitter/LinkedIn
   - Email beta users

### Week 1 Marketing

- [ ] Launch on Product Hunt (guide: `store-assets/PH_LAUNCH_MASTER_INDEX.md`)
- [ ] Post to Reddit: r/nexus, r/GlobalEntry, r/chrome_extensions
- [ ] Submit to Hacker News (Show HN)
- [ ] Share in travel/expat communities
- [ ] Monitor reviews, respond to feedback

### Ongoing

- [ ] Track metrics: installs, conversions, MRR
- [ ] Collect testimonials
- [ ] A/B test premium conversion
- [ ] Run Google Ads campaign
- [ ] Build email drip campaign

---

## Files Reference

| File | Purpose |
|------|---------|
| `CHROME_WEB_STORE_SUBMISSION.md` | Detailed submission guide (8 steps) |
| `EXTENSION_ID_PROPAGATION.md` | Extension ID update reference |
| `store-assets/CHROME-WEB-STORE-LISTING.txt` | Copy-paste ready listing content |
| `scripts/update-extension-id.sh` | Automated ID propagation script |
| `dist/nexus-alert-v2.0.0.zip` | Extension package (28 KB) |
| `store-assets/*.png` | Promotional images (7 files) |

---

## Revenue Impact

**Before Submission:**
- Public installs: 0
- MRR: $0
- Revenue: Blocked

**30 Days After Approval:**
- Target installs: 1,000+
- Target conversions: 2% (20 users)
- Target MRR: $99.80
- Projected ARR: $1,197.60

**12 Months After Approval:**
- Target installs: 10,000+
- Target conversions: 5% (500 users)
- Target MRR: $2,495
- Projected ARR: $29,940

**This submission unlocks the entire revenue stream.**

---

## Troubleshooting

**Extension validation fails:**
- Check `manifest.json` version is "2.0.0"
- Verify package size <128 MB (ours is 28 KB)
- Review error message and fix manifest

**Privacy policy link 404:**
```bash
curl -I https://nexus-alert.com/privacy
# Should return: HTTP/2 200
# If not: cd web && npm run build && vercel --prod
```

**Extension ID script reports errors:**
```bash
# Verify you're in repo root
cd /Users/michaelguo/nexus-alert

# Check that placeholders exist
grep -r "EXTENSION_ID" web/src/app README.md

# Re-run script with correct ID format (32 lowercase letters)
./scripts/update-extension-id.sh YOUR_ID_HERE
```

**Install links still show EXTENSION_ID:**
- Clear browser cache
- Hard refresh (Cmd+Shift+R)
- Check web app deployed: `curl https://nexus-alert.com`

---

## Support

**Chrome Web Store:**
- Developer Console: https://chrome.google.com/webstore/devconsole
- Documentation: https://developer.chrome.com/docs/webstore/
- Policies: https://developer.chrome.com/docs/webstore/program-policies/

**NEXUS Alert:**
- Detailed guide: `CHROME_WEB_STORE_SUBMISSION.md`
- Extension ID guide: `EXTENSION_ID_PROPAGATION.md`
- Email: support@nexus-alert.com

---

## TL;DR

```bash
# 1. Submit extension (30 min)
Go to: https://chrome.google.com/webstore/devconsole
Upload: dist/nexus-alert-v2.0.0.zip
Copy-paste from: store-assets/CHROME-WEB-STORE-LISTING.txt
Save: Extension ID

# 2. Update links (2 min)
./scripts/update-extension-id.sh YOUR_EXTENSION_ID

# 3. Deploy (5 min)
cd web && npm run build && vercel --prod
git add -A && git commit -m "Update extension ID" && git push

# 4. Wait for approval (3-5 days)
Check email for approval notification

# 5. Launch marketing (Week 1)
Product Hunt, Reddit, Twitter, Hacker News
```

**You are ready to submit NOW.**

**Next action:** https://chrome.google.com/webstore/devconsole
