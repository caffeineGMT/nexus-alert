# Chrome Web Store Submission - NEXUS Alert

**Status:** Ready for immediate submission
**Extension Version:** 2.0.0
**Package:** `dist/nexus-alert-v2.0.0.zip` (28 KB)

---

## Pre-Submission Verification

All assets verified and ready:

```bash
# Extension package
✓ dist/nexus-alert-v2.0.0.zip (28 KB)

# Promotional images
✓ store-assets/marquee-1400x560.png (1400x560)
✓ store-assets/small-tile-440x280.png (440x280)

# Screenshots (1280x800)
✓ store-assets/1-monitor-locations.png
✓ store-assets/2-slots-found.png
✓ store-assets/3-settings-premium.png
✓ store-assets/4-onboarding-step2.png
✓ store-assets/5-notification.png

# Live URLs
✓ https://nexus-alert.com (landing page)
✓ https://nexus-alert.com/privacy (privacy policy)
✓ https://nexus-alert.com/terms (terms of service)
✓ https://api.nexus-alert.com (backend API)
```

---

## Step-by-Step Submission Process

### STEP 1: Access Developer Console (3 minutes)

1. Open Chrome browser
2. Navigate to: **https://chrome.google.com/webstore/devconsole**
3. Sign in with your Google account
4. **First time only:** Pay $5 one-time developer registration fee
5. Click **"New Item"** button (top-right)

### STEP 2: Upload Extension Package (2 minutes)

1. Click **"Choose file"** or drag-and-drop zone
2. Upload: `dist/nexus-alert-v2.0.0.zip`
3. Wait for validation (15-30 seconds)
4. Verify: Green checkmark, no errors
   - Warnings are OK (typically about permissions)
   - Errors must be fixed before proceeding

### STEP 3: Store Listing - Product Details (10 minutes)

**All content is copy-paste ready from `store-assets/CHROME-WEB-STORE-LISTING.txt`**

#### Product Name
```
NEXUS Alert - Appointment Slot Finder for NEXUS, Global Entry & SENTRI
```

#### Short Description (132 characters)
```
NEXUS appointment finder & Global Entry appointment alert. Get instant notifications when NEXUS, Global Entry & SENTRI slots open.
```

#### Detailed Description
Copy the entire detailed description from `store-assets/CHROME-WEB-STORE-LISTING.txt` lines 26-119.

**Key sections included:**
- Why you need this
- How it works
- Free tier features
- Premium tier features ($4.99/month)
- Supported programs (NEXUS, Global Entry, SENTRI)
- FAQ
- Privacy & Security
- Support info

#### Category
```
Productivity
```

#### Language
```
English (United States)
```

### STEP 4: Store Listing - Links & Contact (3 minutes)

#### Homepage URL
```
https://nexus-alert.com
```

#### Privacy Policy URL
```
https://nexus-alert.com/privacy
```

#### Support Email
```
support@nexus-alert.com
```
**Note:** Ensure this email is configured and monitored.

#### Support URL (optional)
```
https://github.com/michaelguo/nexus-alert/issues
```
Or your actual GitHub repository issues page.

### STEP 5: Store Listing - Images (8 minutes)

#### Promotional Images

**Marquee Promo Tile (1400x560):**
- Upload: `store-assets/marquee-1400x560.png`
- Used in: Chrome Web Store search results, featured listings

**Small Promo Tile (440x280):**
- Upload: `store-assets/small-tile-440x280.png`
- Used in: Extension details page sidebar

#### Screenshots (Upload in this exact order)

**Screenshot 1:**
- File: `store-assets/1-monitor-locations.png`
- Caption: `Monitor NEXUS appointment slots across multiple enrollment centers in real time`

**Screenshot 2:**
- File: `store-assets/2-slots-found.png`
- Caption: `Global Entry appointment finder - See available slots instantly and book with one click`

**Screenshot 3:**
- File: `store-assets/3-settings-premium.png`
- Caption: `Track NEXUS & Global Entry appointment history and spot slot availability patterns`

**Screenshot 4:**
- File: `store-assets/4-onboarding-step2.png`
- Caption: `SENTRI appointment alert settings - Customize notifications, sounds, and check frequency`

**Screenshot 5:**
- File: `store-assets/5-notification.png`
- Caption: `Get instant NEXUS appointment alerts the moment a slot opens up`

### STEP 6: Privacy Practices (5 minutes)

#### Single Purpose Description
```
Monitor NEXUS, Global Entry, and SENTRI appointment availability on ttp.cbp.dhs.gov and notify users when slots become available.
```

#### Permission Justifications

For each permission listed, copy the exact justification:

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

**Host Permission: https://ttp.cbp.dhs.gov/\*:**
```
Required to access the official CBP Trusted Traveler Programs Scheduler API to check for appointment availability. This is the sole purpose of the extension.
```

**Host Permission: https://api.nexus-alert.com/\*:**
```
Required for premium tier users to receive email and SMS notifications via our backend service when appointment slots become available.
```

#### Data Usage Certification

**Does this extension collect user data?**
- Select: **Yes** (for premium tier email collection)

**What user data does it collect?**
- Email address (premium tier only)
- User preferences (stored locally)

**Why does it collect this data?**
- Purpose: Email notifications for premium tier users
- Certification: Data is not sold to third parties
- Certification: Data is not used for purposes unrelated to functionality
- Certification: Data is transmitted securely (HTTPS)

### STEP 7: Distribution Settings (2 minutes)

#### Pricing
- Select: **"This item offers in-app purchases"**
- In-app purchase details:
  - Free tier: Monitor slots every 30 minutes
  - Premium tier: $4.99/month for 2-minute checks + email alerts

#### Visibility
- Select: **"Public"**
- Available to all users on Chrome Web Store

#### Regions
- Select: **"All regions"**
- Or focus on: United States, Canada (primary target markets)

### STEP 8: Final Review & Submit (3 minutes)

1. Click **"Preview"** to see how listing appears to users
2. Review all sections for typos/errors
3. Verify all 7 images are uploaded and displaying correctly
4. Test privacy policy link: Click to ensure it loads
5. Scroll to bottom and review **"Publisher Information"**
6. Click **"Submit for Review"**
7. **CRITICAL:** Screenshot the confirmation page
8. **CRITICAL:** Copy the Extension ID (32-character string)
   - Format: `abcdefghijklmnopqrstuvwxyz123456`
   - You'll need this for the next step

---

## IMMEDIATELY AFTER SUBMISSION

### Save Extension ID

Once submitted, you'll see a confirmation page with your Extension ID.

**Example Extension ID:** `abcdefghijklmnopqrstuvwxyz123456`

**Save it immediately:**
```bash
# Run this command with YOUR actual extension ID:
echo "EXTENSION_ID=abcdefghijklmnopqrstuvwxyz123456" > .extension-id
```

### Update All Links Automatically

Run the automated propagation script:

```bash
# This will update README.md, all web pages, and Product Hunt landing page
./scripts/update-extension-id.sh YOUR_EXTENSION_ID_HERE

# Example:
./scripts/update-extension-id.sh abcdefghijklmnopqrstuvwxyz123456
```

The script updates:
- `README.md` line 184 (install link)
- All `web/src/app/**/*.tsx` files (40+ placeholder replacements)
- Product Hunt landing page CTAs
- Blog post CTAs
- Program-specific landing pages (NEXUS, Global Entry, SENTRI)

### Deploy Updated Web App

```bash
cd web
npm run build
vercel --prod
# Or: git push (if using GitHub Pages auto-deploy)
```

### Commit & Push

```bash
git add -A
git commit -m "Update extension ID after Chrome Web Store submission"
git push origin main
```

---

## Expected Review Timeline

| Event | Timeline | Action Required |
|-------|----------|-----------------|
| Submission confirmation | Immediate | Save extension ID |
| Email confirmation | Within 1 hour | None |
| Initial automated review | 1-2 hours | None |
| Manual review starts | 1-3 business days | None |
| Questions from reviewer | Variable | Respond within 24 hours |
| Approval | 3-5 business days total | None |
| Extension goes live | Immediately after approval | Update marketing |

**Most extensions are approved within 3 business days.**

---

## Common Rejection Reasons (And How We Avoided Them)

| Issue | How We Avoided It |
|-------|-------------------|
| Missing permission justifications | All permissions justified in Step 6 |
| Broken privacy policy link | Verified live at nexus-alert.com/privacy |
| Screenshots don't match extension | All screenshots from actual v2.0.0 UI |
| Unclear single purpose | Clearly defined: appointment monitoring |
| Misleading functionality claims | Accurate description, no guarantees |
| Insufficient data usage disclosure | Full disclosure in Step 6 |

**Our submission is compliant with all Chrome Web Store policies.**

---

## Post-Approval Checklist

### Day 1 (Approval Day)

- [ ] Verify extension is live on Chrome Web Store
- [ ] Test installation flow from store
- [ ] Verify in-app purchase (Stripe checkout) works
- [ ] Update social media profiles with install link
- [ ] Post announcement on Twitter, LinkedIn
- [ ] Email existing beta users with install link

### Week 1

- [ ] Launch on Product Hunt (see `store-assets/PH_LAUNCH_MASTER_INDEX.md`)
- [ ] Post to Reddit: r/nexus, r/GlobalEntry, r/chrome_extensions
- [ ] Submit to Hacker News (Show HN)
- [ ] Reach out to travel bloggers/influencers
- [ ] Monitor reviews and respond to feedback
- [ ] Track analytics: installs, conversions, MRR

### Week 2-4

- [ ] Run Google Ads campaign (keywords: "nexus appointment finder")
- [ ] Optimize based on user feedback
- [ ] A/B test premium conversion prompts
- [ ] Collect testimonials from successful users
- [ ] Build email drip campaign for free users

---

## Troubleshooting

### Issue: Extension validation fails during upload

**Error:** "Manifest file is invalid"
- **Solution:** Verify `manifest.json` has correct structure
- **Check:** Version field is "2.0.0"
- **Check:** All required fields present (name, version, manifest_version)

**Error:** "Package is too large"
- **Solution:** Max size is 128 MB. Our package is 28 KB, so this shouldn't occur.
- **If it does:** Remove `node_modules/`, `.git/`, unnecessary assets

### Issue: Privacy policy link returns 404

**Solution:**
```bash
# Verify privacy policy is accessible
curl -I https://nexus-alert.com/privacy
# Should return: HTTP/2 200

# If not, redeploy web app:
cd web && npm run build && vercel --prod
```

### Issue: "Your item does not comply with program policies"

**Common causes:**
1. **Misleading description:** Review and tone down claims
2. **Insufficient permission justification:** Expand explanations in Step 6
3. **Data collection not disclosed:** Ensure Step 6 data usage is complete
4. **Keyword stuffing:** Remove repetitive keywords from description

**Action:** Respond to reviewer feedback within 24 hours and resubmit

### Issue: Extension ID not appearing

**When it appears:**
- Immediately after submission confirmation
- Also visible in Developer Dashboard → Your Listings

**Where to find it:**
- URL format: `https://chrome.google.com/webstore/detail/EXTENSION_NAME/EXTENSION_ID`
- 32-character lowercase alphanumeric string

---

## Support & Resources

**Chrome Web Store Documentation:**
- Developer Dashboard: https://chrome.google.com/webstore/devconsole
- Publishing Guide: https://developer.chrome.com/docs/webstore/publish/
- Program Policies: https://developer.chrome.com/docs/webstore/program-policies/
- Review Process: https://developer.chrome.com/docs/webstore/review-process/

**NEXUS Alert Assets:**
- Extension package: `dist/nexus-alert-v2.0.0.zip`
- Listing copy: `store-assets/CHROME-WEB-STORE-LISTING.txt`
- Images: `store-assets/*.png`
- Submission guide: This document

**Questions?**
- Email: support@nexus-alert.com
- GitHub: https://github.com/michaelguo/nexus-alert/issues

---

## Revenue Impact

**Current State (Before Submission):**
- Installs: 0
- MRR: $0
- Public availability: None

**Target State (30 days post-approval):**
- Installs: 1,000+
- Paid conversions: 2% (20 users)
- MRR: $99.80
- ARR projection: $1,197.60

**This submission unlocks 100% of your revenue pathway.**

---

**You are ready to submit. Good luck!**

**Estimated time to complete submission: 30 minutes**

**Next step:** Go to https://chrome.google.com/webstore/devconsole
