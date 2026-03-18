# Product Hunt Assets — Quick Start Checklist

**Goal**: Create all visual assets for Product Hunt launch ASAP
**Status**: 🔴 Assets needed before PH submission
**Owner**: CMO (asset creation) + Engineer (integration)

---

## 🚨 Critical Path (2 Days)

### Today (Day 1) — Gallery Images [4 hours]
- [ ] **9:00 AM - 10:30 AM**: Create Image 1 (Extension Dashboard)
  - File: `store-assets/ph-gallery-01.png` (1270x760px)
  - Show extension popup with locations, filters, monitoring active
  - Add browser chrome (Chrome window, tabs, URL bar: ttp.cbp.dhs.gov)
  - See spec: `PRODUCT_HUNT_ASSETS_GUIDE.md` → Image 1

- [ ] **10:30 AM - 11:30 AM**: Create Image 2 (Notification Alert)
  - File: `store-assets/ph-gallery-02.png` (1270x760px)
  - Show desktop notification with "NEXUS appointment found!"
  - Add sound wave overlay
  - See spec: `PRODUCT_HUNT_ASSETS_GUIDE.md` → Image 2

- [ ] **11:30 AM - 12:30 PM**: Create Image 3 (Free vs Premium)
  - File: `store-assets/ph-gallery-03.png` (1270x760px)
  - Split-screen comparison table
  - Highlight Premium tier with green border + "Product Hunt Special" badge
  - See spec: `PRODUCT_HUNT_ASSETS_GUIDE.md` → Image 3

- [ ] **12:30 PM - 1:00 PM**: Create Thumbnail
  - File: `store-assets/ph-thumbnail.png` (240x240px)
  - NEXUS Alert icon + notification badge
  - Simple, recognizable at small sizes

### Tomorrow (Day 2) — Video Demo [4 hours]
- [ ] **9:00 AM - 11:00 AM**: Record video (60 seconds)
  - Use Loom (easiest) or ScreenFlow/OBS
  - Follow video script in `PRODUCT_HUNT_ASSETS_GUIDE.md`
  - Show: Problem → Solution → Setup → Notification → Booking → CTA
  - Record voiceover separately for better audio

- [ ] **11:00 AM - 12:30 PM**: Edit video
  - Add captions (hardcoded subtitles)
  - Add background music (low volume, royalty-free)
  - Add text overlays for key messages
  - Export: 1080p MP4, H.264, <50MB

- [ ] **12:30 PM - 1:00 PM**: Upload & integrate
  - Upload to YouTube (unlisted) or Loom
  - Update `/ph` page: replace `YOUR_VIDEO_ID` with actual ID
  - Test embed works on staging/production

---

## 📁 File Structure

```
nexus-alert/
└── store-assets/
    ├── ph-gallery-01.png          # Image 1: Extension Dashboard (1270x760)
    ├── ph-gallery-02.png          # Image 2: Notification Alert (1270x760)
    ├── ph-gallery-03.png          # Image 3: Free vs Premium (1270x760)
    ├── ph-thumbnail.png           # Thumbnail for PH card (240x240)
    ├── ph-demo-video.mp4          # Local copy of video (backup)
    └── PRODUCT_HUNT_ASSETS_GUIDE.md  # Full specifications (this guide)
```

---

## 🎨 Tools Needed

### For Gallery Images
- **Figma** (recommended — free, collaborative)
  - Use "Browser Mockups" plugin for realistic chrome
  - Export at 2x resolution, then scale to 1270x760
- **Alternative**: Photoshop, Sketch, or Canva Pro

### For Video
- **Loom** (easiest — loom.com)
  - Browser-based, auto-captions, free for <5 min videos
  - Pro plan: $12.50/month (if needed for editing)
- **Alternative**: ScreenFlow (Mac, $169), OBS Studio (free)

### For Music
- **Epidemic Sound** ($15/month — epidemicsound.com)
- **Artlist** ($199/year — artlist.io)
- **YouTube Audio Library** (free, limited)

### For Compression
- **TinyPNG** (tinypng.com — free, lossless)
- **ImageOptim** (Mac app — free)

---

## ✅ Approval Checklist

Before uploading to Product Hunt:

### Images (all 3)
- [ ] Exactly 1270x760px (verify in Preview/Photoshop)
- [ ] PNG format
- [ ] File size <1MB each (use TinyPNG)
- [ ] Browser chrome looks realistic
- [ ] Text is readable at full size
- [ ] Consistent dark theme (#0a0a0a background)
- [ ] Brand colors used (blue #3b82f6, green #22c55e)

### Video
- [ ] 60 seconds or less
- [ ] 1080p (1920x1080) or 720p (1280x720)
- [ ] MP4 or MOV format
- [ ] File size <50MB
- [ ] Captions embedded (not auto-generated)
- [ ] Audio levels balanced
- [ ] YouTube/Loom embed URL ready

### Thumbnail
- [ ] Exactly 240x240px
- [ ] PNG format
- [ ] File size <500KB
- [ ] Recognizable at small sizes

---

## 🎯 Quality Standards

### Gallery Images Must Show:
1. **Real functionality** — no fake mockups, use actual extension UI
2. **Clear value prop** — viewer should understand what it does in 3 seconds
3. **Professional polish** — realistic browser chrome, proper spacing, shadows
4. **Brand consistency** — colors, fonts, tone match landing page

### Video Must Have:
1. **Hook in first 5 seconds** — grab attention immediately
2. **Clear problem/solution** — viewer understands the pain and fix
3. **Real demo** — show actual extension working, not slides
4. **Strong CTA** — end with promo code and install link
5. **Captions** — many watch on mute, captions are essential

---

## 🚨 Red Flags to Avoid

❌ **Low-quality screenshots** → Use 2x resolution, compress after
❌ **No browser chrome** → Looks amateur, add realistic window frames
❌ **Generic stock photos** → Show real extension, real data
❌ **Video too long** → >60 sec loses attention, keep tight
❌ **No captions** → 85% watch on mute, captions are critical
❌ **Wrong dimensions** → Product Hunt strict on aspect ratios
❌ **File size too large** → May fail upload, compress first

---

## 📊 Success Metrics

After upload, track in Product Hunt analytics:

**Gallery Images**:
- Target: 80%+ of visitors view at least 1 image
- Target: 50%+ view all 3 images

**Video**:
- Target: 40%+ play rate (click play)
- Target: 60%+ watch >30 seconds
- Target: 30%+ watch to completion

**Overall Conversion**:
- Target: 10%+ of PH visitors click "Install Free" CTA
- Target: 5%+ of PH visitors sign up for Premium

---

## 🔗 Integration Steps

After assets created:

### 1. Upload Images to Product Hunt
- During PH post creation, upload all 3 gallery images
- Add captions:
  - Image 1: "Monitor multiple enrollment centers with smart filters"
  - Image 2: "Instant alerts when slots appear"
  - Image 3: "Free tier + Premium with Product Hunt special offer"

### 2. Embed Video
- Upload to YouTube (unlisted) or Loom
- Copy video ID from URL
- Update `/ph` page line 124: replace `YOUR_VIDEO_ID` with actual ID
- Test embed loads correctly

### 3. Update PH Badge
- After PH post goes live, get the `post_id` from URL
- Update `/ph` page line 55: replace `YOUR_POST_ID` with actual ID
- Badge will show live upvote count

---

## 📅 Timeline

| Day | Task | Time | Status |
|-----|------|------|--------|
| Today | Gallery Image 1 | 90 min | ⏸️ Not started |
| Today | Gallery Image 2 | 60 min | ⏸️ Not started |
| Today | Gallery Image 3 | 60 min | ⏸️ Not started |
| Today | Thumbnail | 20 min | ⏸️ Not started |
| Tomorrow | Record video | 2 hours | ⏸️ Not started |
| Tomorrow | Edit + caption video | 90 min | ⏸️ Not started |
| Tomorrow | Upload & integrate | 30 min | ⏸️ Not started |
| **TOTAL** | | **8-10 hours** | **0% complete** |

---

## 🎬 Next Actions

**Right now** (15 minutes):
1. [ ] Read full spec: `PRODUCT_HUNT_ASSETS_GUIDE.md`
2. [ ] Install Figma or open Photoshop
3. [ ] Download browser mockup template (Screely.com or Figma plugin)
4. [ ] Block calendar: 4 hours today, 4 hours tomorrow

**This morning** (4 hours):
1. [ ] Create all 3 gallery images
2. [ ] Create thumbnail
3. [ ] Compress images with TinyPNG
4. [ ] Save to `store-assets/` folder

**Tomorrow morning** (4 hours):
1. [ ] Record video demo
2. [ ] Edit + add captions
3. [ ] Upload to YouTube/Loom
4. [ ] Update `/ph` page with video ID

**After assets complete**:
1. [ ] Review with team/friend for feedback
2. [ ] Make any final tweaks
3. [ ] Submit Product Hunt post
4. [ ] Celebrate! 🎉

---

## 📞 Questions?

- **Full specifications**: See `PRODUCT_HUNT_ASSETS_GUIDE.md`
- **Launch strategy**: See `PRODUCT_HUNT_LAUNCH_PLAN.md`
- **Technical issues**: Check `/ph` page code at `web/src/app/ph/page.tsx`

---

**Status**: Assets are the final blocker before Product Hunt submission. Prioritize this above everything else. Good luck! 🚀
