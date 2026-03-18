# Chrome Extension ID Propagation Guide

## Quick Start

Once you receive your Chrome Extension ID after submission:

```bash
# Run this single command with your actual Extension ID
./scripts/update-extension-id.sh abcdefghijklmnopqrstuvwxyz123456
```

This will automatically update all 40+ placeholder links throughout the codebase.

---

## What Gets Updated

### README.md
- Line ~184: Main install link in deployment checklist

### Web App Pages (web/src/app/)

**Main Pages:**
- `page.tsx` - Homepage hero CTA and footer links
- `ph/page.tsx` - Product Hunt landing page (3 CTAs with UTM tracking)
- `nexus/page.tsx` - NEXUS program landing page
- `global-entry/page.tsx` - Global Entry program landing page
- `sentri/page.tsx` - SENTRI program landing page
- `pro/page.tsx` - Premium tier upgrade page

**Blog Posts (10 articles):**
- `blog/page.tsx` - Blog index page
- `blog/nexus-interview-tips/page.tsx`
- `blog/nexus-interview-locations/page.tsx`
- `blog/global-entry-appointment-tips/page.tsx`
- `blog/is-global-entry-worth-it/page.tsx`
- `blog/how-to-get-nexus-appointment-fast/page.tsx`
- `blog/global-entry-vs-nexus-vs-sentri/page.tsx`
- `blog/best-times-to-check-nexus-appointments/page.tsx`
- `blog/success-story-sarah-nexus-3-days/page.tsx`
- `blog/success-story-family-global-entry/page.tsx`
- `blog/layout.tsx` - Blog sidebar CTA

**Components:**
- `components/HeroVariants.tsx` - Hero section variants

**Other Pages:**
- `help/page.tsx` - Help center
- `help/[slug]/page.tsx` - Individual help articles
- `partners/page.tsx` - Partner program page
- `webinar/page.tsx` - Webinar landing page
- `submit-testimonial/page.tsx` - Testimonial submission

---

## Manual Verification After Script

The script includes automatic verification, but you can manually check:

```bash
# Search for any remaining placeholders
grep -r "EXTENSION_ID" web/src/app README.md

# Should return: (empty result)
# If it returns matches, those files need manual updating
```

---

## Critical Files to Verify

After running the script, manually verify these high-traffic pages:

### 1. Homepage (/)
```bash
# Check web/src/app/page.tsx
grep "chrome.google.com/webstore" web/src/app/page.tsx
```
Should show your actual extension ID, not `EXTENSION_ID`

### 2. Product Hunt Landing (/ph)
```bash
# Check web/src/app/ph/page.tsx
grep "chrome.google.com/webstore" web/src/app/ph/page.tsx | head -3
```
Should show 3 install links with UTM tracking:
- `utm_content=nav_install`
- `utm_content=hero_install`
- `utm_content=cta_install`

### 3. README Install Link
```bash
# Check README.md
grep "chrome.google.com/webstore" README.md
```
Should show: `https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID`

---

## Testing Locally

Before deploying, test the links locally:

```bash
cd web
npm run dev
```

Visit `http://localhost:3000` and:
1. Click "Install Extension" button
2. Verify it redirects to Chrome Web Store (will 404 until extension is approved)
3. Check that URL contains your extension ID
4. Test Product Hunt page: `http://localhost:3000/ph`
5. Verify all CTAs have correct UTM parameters

---

## Deployment

After verification:

```bash
# Build for production
cd web
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to GitHub Pages
npm run deploy

# Commit changes
cd ..
git add -A
git commit -m "Update Chrome Extension ID after Web Store approval"
git push origin main
```

---

## URL Format Reference

All install links follow this format:

```
https://chrome.google.com/webstore/detail/[EXTENSION_ID]?utm_source=X&utm_medium=Y&utm_campaign=Z
```

**Example with actual Extension ID:**
```
https://chrome.google.com/webstore/detail/abcdefghijklmnopqrstuvwxyz123456?utm_source=homepage&utm_medium=cta&utm_campaign=launch
```

### UTM Parameters Used

| Page | utm_source | utm_medium | utm_campaign | utm_content |
|------|-----------|-----------|--------------|-------------|
| Homepage | homepage | cta | launch | hero_install |
| Product Hunt | producthunt | referral | ph_launch | hero_install |
| NEXUS page | nexus-page | cta | launch | - |
| Global Entry | global-entry-page | cta | launch | - |
| SENTRI | sentri-page | cta | launch | - |
| Blog | blog | cta | content | article_name |

---

## Files Modified by Script

Total: 40+ files across:

```
README.md (1 file)
web/src/app/*.tsx (26 files)
web/src/app/components/*.tsx (1 file)
web/src/app/blog/**/*.tsx (11 files)
web/src/app/help/**/*.tsx (2 files)
```

---

## Rollback

If you need to rollback to placeholder links:

```bash
# Revert all changes
git checkout HEAD -- README.md web/

# Or restore from specific commit
git checkout COMMIT_HASH -- README.md web/
```

---

## Post-Deployment Verification

After deploying to production:

```bash
# Test live homepage
curl -I https://nexus-alert.com

# Check that install link exists
curl -s https://nexus-alert.com | grep "chrome.google.com/webstore"

# Verify Product Hunt page
curl -s https://nexus-alert.com/ph | grep "utm_source=producthunt"
```

Expected: All links should contain your actual extension ID.

---

## Troubleshooting

### Issue: Script says "0 files updated"

**Cause:** Placeholders already replaced, or wrong working directory

**Solution:**
```bash
# Ensure you're in repo root
cd /Users/michaelguo/nexus-alert

# Check if placeholders exist
grep -r "EXTENSION_ID" web/src/app README.md

# If no matches, extension ID already updated
```

### Issue: Some files still have EXTENSION_ID

**Cause:** File was created after script ran, or manual editing needed

**Solution:**
```bash
# Find remaining placeholders
grep -r "EXTENSION_ID" web/

# Manually replace in those files
# Format: s/EXTENSION_ID/your_actual_id/g
```

### Issue: Links redirect to 404 on Chrome Web Store

**Cause:** Extension not yet approved, or wrong extension ID

**Solution:**
```bash
# Verify your extension ID from Developer Console
# URL format: chrome.google.com/webstore/detail/NAME/ID
# The ID is the 32-character string after the last slash

# Check current ID in codebase
grep -o "chrome.google.com/webstore/detail/[a-z]\{32\}" web/src/app/page.tsx
```

---

## Analytics Tracking

With UTM parameters in place, you can track install attribution in:

**Google Analytics:**
- Source/Medium: producthunt / referral
- Campaign: ph_launch
- Content: hero_install

**Plausible Analytics:**
- All UTM parameters automatically tracked
- Goal: "Install Extension" click events
- Filter by utm_source to compare channels

**Stripe Dashboard:**
- Premium conversions by source
- Track which landing pages convert best

---

## Summary

**Before Script:**
- 40+ files with placeholder `EXTENSION_ID`
- No working install links
- Cannot launch marketing campaigns

**After Script:**
- All placeholders replaced with actual extension ID
- Working install links across entire site
- UTM tracking enabled for attribution
- Ready for Product Hunt, ads, content marketing

**One command. 40+ files updated. Zero manual edits.**

```bash
./scripts/update-extension-id.sh YOUR_EXTENSION_ID
```
