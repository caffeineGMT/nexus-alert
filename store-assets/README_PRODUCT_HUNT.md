# Product Hunt Launch Assets — Quick Navigation

**Status**: 🔴 Assets needed urgently
**Deadline**: Before Product Hunt submission
**Owner**: CMO (creation) + Engineer (integration)

---

## 🚨 Start Here

You're preparing for Product Hunt launch. This directory has everything you need.

### Immediate Next Steps (Now)

1. **Read the quick-start guide**: `PH_ASSETS_QUICK_START.md` (5 min)
2. **Review full specifications**: `PRODUCT_HUNT_ASSETS_GUIDE.md` (15 min)
3. **Block your calendar**: 4 hours today + 4 hours tomorrow
4. **Start creating assets**: Follow checklist below

---

## 📁 Product Hunt Files

| File | Purpose | Time to Read |
|------|---------|--------------|
| `PH_ASSETS_QUICK_START.md` | 📌 **Start here** — 2-day timeline | 5 min |
| `PRODUCT_HUNT_ASSETS_GUIDE.md` | Full asset specifications | 15 min |
| `PH_FINAL_LAUNCH_CHECKLIST.md` | Pre-launch verification | 10 min |
| `PRODUCT_HUNT_LAUNCH.md` | Original launch plan (short) | 10 min |

### Root Directory Files
- `/PRODUCT_HUNT_LAUNCH_PLAN.md` — Complete launch strategy (13,000 words)
- `/PRODUCT_HUNT_LAUNCH_SUMMARY.md` — Implementation overview
- `/web/src/app/ph/page.tsx` — Product Hunt landing page

---

## ✅ Asset Creation Checklist

### Gallery Images (Today — 4 hours)

- [ ] **Image 1**: Extension Dashboard (90 min)
  - File: `ph-gallery-01.png` (1270x760px PNG, <1MB)
  - Content: Extension popup showing monitoring active, locations selected
  - Must include: Realistic browser chrome (Chrome window, URL bar)
  - Spec: `PRODUCT_HUNT_ASSETS_GUIDE.md` → "Image 1: Extension Dashboard"

- [ ] **Image 2**: Notification Alert (60 min)
  - File: `ph-gallery-02.png` (1270x760px PNG, <1MB)
  - Content: Desktop notification "🎉 NEXUS appointment found!"
  - Must include: Sound wave overlay, timestamp
  - Spec: `PRODUCT_HUNT_ASSETS_GUIDE.md` → "Image 2: Desktop Notification Alert"

- [ ] **Image 3**: Free vs Premium Comparison (60 min)
  - File: `ph-gallery-03.png` (1270x760px PNG, <1MB)
  - Content: Split-screen comparison table with promo code
  - Must include: "Product Hunt Special" badge, `PRODUCTHUNT` code
  - Spec: `PRODUCT_HUNT_ASSETS_GUIDE.md` → "Image 3: Free vs Premium Comparison"

- [ ] **Thumbnail**: Product Hunt Card (20 min)
  - File: `ph-thumbnail.png` (240x240px PNG, <500KB)
  - Content: NEXUS Alert icon + notification badge
  - Simple and recognizable at small sizes

### Video Demo (Tomorrow — 4 hours)

- [ ] **Record video** (2 hours)
  - File: `ph-demo-video.mp4` (1080p MP4, <50MB)
  - Length: 60 seconds max
  - Tool: Loom (recommended) or ScreenFlow/OBS
  - Script: `PRODUCT_HUNT_ASSETS_GUIDE.md` → "Video Script (60 seconds)"

- [ ] **Edit video** (90 min)
  - Add captions (hardcoded subtitles)
  - Add background music (royalty-free)
  - Add text overlays for key messages
  - Export at 1080p, H.264, <50MB

- [ ] **Upload & integrate** (30 min)
  - Upload to YouTube (unlisted) or Loom
  - Update `/ph` page line 125: replace `YOUR_VIDEO_ID`
  - Test embed loads correctly

---

## 🎨 Tools You'll Need

### For Images
- **Figma** (recommended) — figma.com
  - Free account works
  - Use "Browser Mockups" plugin for realistic chrome
- **Alternative**: Photoshop, Sketch, Canva Pro

### For Video
- **Loom** (easiest) — loom.com
  - Browser-based recording
  - Auto-captions available
  - Free for <5 min videos
- **Alternative**: ScreenFlow (Mac, $169), OBS Studio (free)

### For Compression
- **TinyPNG** — tinypng.com (compress images)
- **ImageOptim** — imageoptim.com (Mac app)

### For Music
- **Epidemic Sound** — $15/month (royalty-free)
- **YouTube Audio Library** — Free (limited selection)

---

## 📋 After Assets Complete

### Update Landing Page

1. **Replace Extension ID** (3 locations in `/ph` page)
   - Lines 34, 98, 340
   - Replace: `EXTENSION_ID`
   - With: Your Chrome Web Store extension ID

2. **Replace Video ID** (1 location)
   - Line 125
   - Replace: `YOUR_VIDEO_ID`
   - With: YouTube or Loom video ID

3. **Replace Post ID** (after PH submission)
   - Line 55
   - Replace: `YOUR_POST_ID`
   - With: Product Hunt post ID from URL

### Test Everything

- [ ] All 3 gallery images compressed (<1MB each)
- [ ] Video embed works on `/ph` page
- [ ] Promo code `PRODUCTHUNT` works in Stripe checkout
- [ ] All UTM tracking links fire correctly

### Submit to Product Hunt

- [ ] Upload gallery images (3)
- [ ] Embed video (YouTube/Loom URL)
- [ ] Upload thumbnail (240x240)
- [ ] Fill in tagline: "Never miss a NEXUS appointment slot"
- [ ] Fill in description (see `PRODUCT_HUNT_LAUNCH_PLAN.md`)
- [ ] Select topics: Travel, Productivity, Chrome Extensions
- [ ] Post first comment (founder story)
- [ ] Schedule for Tuesday 12:01 AM PT

---

## 🎯 Success Criteria

### Minimum Viable Success
- 200+ upvotes
- Top 10 Product of the Day
- 100+ Chrome installs

### Target Success
- 500+ upvotes
- Top 5 Product of the Day
- 500+ Chrome installs
- 50+ Premium signups

### Stretch Success
- 1,000+ upvotes
- #1 Product of the Day
- 1,000+ Chrome installs
- 100+ Premium signups

---

## ⏰ Timeline

| Day | Task | Time | Status |
|-----|------|------|--------|
| **Today** | Gallery Image 1 | 90 min | ⏸️ Not started |
| **Today** | Gallery Image 2 | 60 min | ⏸️ Not started |
| **Today** | Gallery Image 3 | 60 min | ⏸️ Not started |
| **Today** | Thumbnail | 20 min | ⏸️ Not started |
| **Tomorrow** | Record video | 2 hours | ⏸️ Not started |
| **Tomorrow** | Edit video | 90 min | ⏸️ Not started |
| **Tomorrow** | Upload & integrate | 30 min | ⏸️ Not started |
| **Day After** | Final review & submit | 1 hour | ⏸️ Not started |

**Total time**: 8-10 hours spread across 2-3 days

---

## 🚨 Assignment Decision

**This task requires BOTH roles**:

### Engineer Responsibilities ✅ (Completed)
- [x] Create asset specification guides
- [x] Set up file structure
- [x] Build `/ph` landing page
- [x] Configure UTM tracking
- [x] Document integration steps

### CMO/Marketing Responsibilities ⏸️ (Urgent)
- [ ] Design 3 gallery images (4 hours)
- [ ] Record and edit video (4 hours)
- [ ] Create thumbnail (20 min)
- [ ] Review for brand consistency

**Recommendation**: If solo founder, block 2 full days. Hire on Fiverr ($50-100) if needed to expedite.

---

## 📞 Questions?

### "What should I do right now?"
→ Read `PH_ASSETS_QUICK_START.md` (5 min) then start Image 1.

### "I'm not a designer, can I hire someone?"
→ Yes! Fiverr: $50-100 for all 3 images + video. Search "Product Hunt assets design".

### "When should I launch?"
→ Tuesday at 12:01 AM PT (highest traffic). Complete assets 24 hours before.

### "What if I don't finish in time?"
→ Delay launch. Assets are CRITICAL for Product Hunt success. Don't rush.

---

**Status**: Assets are the final blocker. All documentation complete. Ready to execute! 🚀

**Next Action**: Read `PH_ASSETS_QUICK_START.md` and start creating images today.
