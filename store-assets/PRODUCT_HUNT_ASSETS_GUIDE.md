# Product Hunt Launch Assets — Creation Guide

**Status**: Ready for asset creation
**Deadline**: Before Product Hunt submission
**Estimated Time**: 4-6 hours total

---

## Overview

This guide walks through creating all visual assets required for Product Hunt launch:
1. **3 Gallery Images** (1270x760px PNG) — screenshots with browser chrome
2. **1 Promo Video** (60s MP4/MOV) — Loom recording with captions
3. **1 Thumbnail** (240x240px PNG) — Product Hunt card image

All specs align with Product Hunt requirements and the design system.

---

## 🖼️ Gallery Images (Priority 1)

Product Hunt requires 1-5 gallery images. We'll create **3 high-impact images**.

### Technical Specifications

- **Dimensions**: 1270x760px (exact)
- **Format**: PNG
- **File size**: <5MB each (ideally <1MB)
- **Naming**: `ph-gallery-01.png`, `ph-gallery-02.png`, `ph-gallery-03.png`
- **Location**: `/Users/michaelguo/nexus-alert/store-assets/`

### Design Requirements

**All images must include**:
- Realistic browser chrome (Chrome window frame, tabs, URL bar)
- URL bar showing `ttp.cbp.dhs.gov` (the GOES website)
- Subtle shadow/depth for professional look
- Dark theme matching landing page (#0a0a0a background)
- Brand colors: Primary #3b82f6 (blue), Success #22c55e (green)

### Image 1: Extension Dashboard (Hero Shot)

**Purpose**: Show the main extension interface in action
**Filename**: `ph-gallery-01.png`

**Content**:
- Chrome browser window (realistic window chrome)
- URL bar: `ttp.cbp.dhs.gov/schedulerui/schedule-interview/location`
- Extension popup open showing:
  - **Location selection**: 3 enrollment centers checked (Detroit, Buffalo, Niagara Falls)
  - **Date range filter**: March 1-31, 2026
  - **Time filter**: Any time (dropdown)
  - **Check frequency**: Every 5 minutes (dropdown)
  - **Status indicator**: "Monitoring 3 locations" with green pulse dot
  - **Start/Stop button**: Blue "Monitoring..." button (active state)
  - **Recent slots table**: 2-3 rows showing found appointments
- Clean UI with proper spacing
- Extension icon visible in toolbar

**Annotations** (add with arrows/labels):
- Arrow pointing to location checkboxes: "Monitor multiple centers"
- Arrow pointing to check frequency: "Check every 2-15 minutes"
- Arrow pointing to recent slots: "Track found appointments"

**Tools**: Figma or screenshot + Photoshop
**Estimated time**: 90 minutes

---

### Image 2: Desktop Notification Alert

**Purpose**: Show the notification experience
**Filename**: `ph-gallery-02.png`

**Content**:
- macOS or Windows desktop environment
- Browser window in background (blurred slightly)
- Large desktop notification in foreground:
  - **Icon**: NEXUS Alert logo (from icons/icon48.png)
  - **Title**: "🎉 NEXUS appointment found!"
  - **Body**: "Detroit enrollment center"
  - **Subtext**: "March 15, 2026 at 2:00 PM"
  - **Action buttons**: "Book Now" (blue) | "Dismiss" (gray)
- Sound wave icon/animation overlay to indicate audio alert
- Timestamp: "Just now"

**Visual emphasis**:
- Notification should be prominent and eye-catching
- Use green accent color (#22c55e) for success state
- Show notification shadow/elevation

**Tools**: Screenshot + Figma/Photoshop for composition
**Estimated time**: 60 minutes

---

### Image 3: Free vs Premium Comparison

**Purpose**: Clearly show upgrade value proposition
**Filename**: `ph-gallery-03.png`

**Content**:
- Split-screen layout (50/50)
- **Left side — Free tier**:
  - Icon: 🆓 or computer monitor
  - Heading: "Free"
  - Features list:
    - ✅ Checks every 30 minutes
    - ✅ Desktop notifications
    - ✅ Sound alerts
    - ✅ Multi-location tracking
    - ✅ Slot history
  - Price: "$0/month"
  - Background: Dark gray (#111)

- **Right side — Premium tier** (highlighted):
  - Icon: ⚡ or crown
  - Heading: "Premium"
  - Features list:
    - ✅ Checks every 2 minutes (15x faster!)
    - ✅ Desktop notifications
    - ✅ Sound alerts
    - ✅ Email alerts (browser closed)
    - ✅ SMS alerts
    - ✅ Priority support
  - Price: ~~$4.99/month~~ **$0 first month** (strikethrough + bold)
  - Badge: "🎉 Product Hunt Special"
  - Promo code box: `PRODUCTHUNT` (copyable appearance)
  - Background: Green gradient (#22c55e with 10% opacity)
  - Border: 2px solid green (#22c55e)

**Visual hierarchy**:
- Premium side should be visually dominant
- Use green accent color for premium border/background
- Make promo code stand out

**Tools**: Figma (recommended for clean layout)
**Estimated time**: 60 minutes

---

## 🎬 Promo Video (Priority 1)

Product Hunt auto-plays the first video in gallery. This is critical for conversion.

### Technical Specifications

- **Length**: 60 seconds (max)
- **Resolution**: 1920x1080 (1080p) or 1280x720 (720p)
- **Format**: MP4 (H.264 codec) or MOV
- **File size**: <50MB (Product Hunt limit)
- **Aspect ratio**: 16:9
- **Audio**: Background music (low volume) + voiceover
- **Captions**: Embedded (hardcoded subtitles)
- **Filename**: `ph-demo-video.mp4`
- **Location**: Upload to YouTube (unlisted) or Loom, then embed

### Video Script (60 seconds)

**[0:00-0:08] Hook — The Problem**
- Visual: Frustrated person staring at GOES website
- Text overlay: "Waiting 6 months for a NEXUS appointment?"
- Show GOES calendar with distant appointment date
- Voiceover: "Tired of waiting months for a NEXUS appointment?"

**[0:09-0:15] Problem Context**
- Visual: Person manually clicking refresh button repeatedly
- Text overlay: "Slots appear randomly... and disappear in minutes"
- Voiceover: "Cancelled appointments open up randomly, but they're gone in seconds."

**[0:16-0:25] Solution Intro**
- Visual: Chrome Web Store page for NEXUS Alert
- Click "Add to Chrome" button
- Extension icon appears in toolbar
- Text overlay: "NEXUS Alert monitors 24/7"
- Voiceover: "NEXUS Alert monitors the appointment system around the clock."

**[0:26-0:35] Setup Demo**
- Visual: Click extension icon → popup opens
- Show selecting enrollment centers (Detroit, Buffalo checked)
- Show setting date range
- Show setting check frequency (5 minutes)
- Click "Start Monitoring"
- Text overlay: "Pick locations and start monitoring"
- Voiceover: "Just pick your locations and preferences, then start monitoring."

**[0:36-0:45] Notification Demo**
- Visual: User working on laptop
- Desktop notification pops up with sound: "🎉 NEXUS appointment found!"
- Show notification details: "Detroit - March 15 at 2:00 PM"
- User clicks notification
- Text overlay: "Get instant alerts when slots appear"
- Voiceover: "The moment a slot opens, you get an instant notification with sound."

**[0:46-0:53] Booking Action**
- Visual: Browser tab opens to GOES booking page
- Appointment slot is highlighted/selected
- Click "Book Appointment" button
- Text overlay: "One click to book"
- Voiceover: "One click takes you straight to booking."

**[0:54-0:60] CTA + Promo**
- Visual: Landing page with promo code
- Show "PRODUCTHUNT" code being copied
- Chrome Web Store install button
- Text overlay: "Install free • First month Premium FREE"
- Voiceover: "Install free today. Product Hunt users get the first month of Premium free with code PRODUCTHUNT."

### Recording Workflow

**Tools**:
- **Loom** (recommended — easy, auto-captions, browser-based)
- **ScreenFlow** (Mac — professional editing)
- **OBS Studio** (free, all platforms)

**Pre-recording checklist**:
- [ ] Clean browser (close extra tabs, hide bookmarks)
- [ ] Test extension fully functional
- [ ] Prepare test data (make sure extension finds slots)
- [ ] Write voiceover script on paper
- [ ] Test microphone audio levels
- [ ] Full screen recording mode
- [ ] Disable desktop notifications (except NEXUS Alert demo)

**Recording tips**:
- Record in 4K if possible (downscale to 1080p for quality)
- Use smooth, deliberate mouse movements
- Pause 2 seconds between scenes
- Record 2-3 takes for each section
- Record voiceover separately for better audio quality

**Post-production**:
- [ ] Add captions (hardcoded, not auto-generated)
- [ ] Add background music (royalty-free: Epidemic Sound, Artlist)
- [ ] Color correct (increase saturation slightly for vibrant look)
- [ ] Add text overlays for key messages
- [ ] Export at 1080p, H.264, <50MB
- [ ] Upload to YouTube (unlisted) or Loom
- [ ] Test embed on `/ph` page

**Estimated time**: 3-4 hours (including revisions)

---

## 📐 Thumbnail Image (Priority 2)

Product Hunt uses this for the card preview on homepage.

### Technical Specifications

- **Dimensions**: 240x240px (exact, square)
- **Format**: PNG
- **File size**: <500KB
- **Filename**: `ph-thumbnail.png`
- **Location**: `/Users/michaelguo/nexus-alert/store-assets/`

### Design

**Content**:
- NEXUS Alert icon (from `icons/icon128.png`)
- Notification badge (red dot with "1" or green checkmark)
- Clean background (solid color or subtle gradient)
- Text optional (if included, keep minimal: "NEXUS Alert")

**Style**:
- Simple and recognizable at small sizes
- High contrast for visibility
- Matches brand colors

**Tools**: Figma, Photoshop, or Canva
**Estimated time**: 20 minutes

---

## 📋 Asset Creation Timeline

### Day 1 (4 hours)
- [ ] Create Image 1: Extension Dashboard (90 min)
- [ ] Create Image 2: Notification Alert (60 min)
- [ ] Create Image 3: Free vs Premium (60 min)
- [ ] Create Thumbnail (20 min)

### Day 2 (4 hours)
- [ ] Record video (2 hours)
- [ ] Edit video + add captions (90 min)
- [ ] Export and upload video (30 min)

### Day 3 (1 hour)
- [ ] Final review of all assets
- [ ] Compress images (<1MB each)
- [ ] Test video embed on `/ph` page
- [ ] Create backup copies

**Total time**: 8-10 hours spread across 3 days

---

## ✅ Final Checklist Before Upload

### Gallery Images
- [ ] All 3 images exactly 1270x760px
- [ ] PNG format, <5MB each (ideally <1MB)
- [ ] Realistic browser chrome on all images
- [ ] Consistent dark theme (#0a0a0a)
- [ ] High-resolution, no pixelation
- [ ] Text is readable and high-contrast
- [ ] Compressed (use TinyPNG or ImageOptim)
- [ ] Tested on both light/dark backgrounds

### Video
- [ ] 60 seconds or less
- [ ] 1080p resolution (1920x1080)
- [ ] MP4 format, H.264 codec
- [ ] <50MB file size
- [ ] Captions embedded (hardcoded)
- [ ] Audio levels balanced
- [ ] Uploaded to YouTube (unlisted) or Loom
- [ ] Embed URL tested on `/ph` page

### Thumbnail
- [ ] Exactly 240x240px
- [ ] PNG format, <500KB
- [ ] Recognizable at small sizes
- [ ] High contrast

---

## 🎨 Design Resources

### Browser Mockup Tools
- **Figma Plugin**: "Browser Mockups" by Pixelbuddha
- **Website**: Screely.com (free browser mockup generator)
- **Sketch Plugin**: "Angle" (3D device mockups)
- **Photoshop**: Manual chrome creation (more control)

### Screen Recording
- **Loom**: loom.com (easiest, browser-based, auto-captions)
- **ScreenFlow**: telestream.net/screenflow (Mac only, professional)
- **OBS Studio**: obsproject.com (free, all platforms)

### Royalty-Free Music
- **Epidemic Sound**: epidemicsound.com ($15/month)
- **Artlist**: artlist.io ($199/year)
- **YouTube Audio Library**: Free, limited selection

### Image Compression
- **TinyPNG**: tinypng.com (free, lossless compression)
- **ImageOptim**: imageoptim.com (Mac app, free)
- **Squoosh**: squoosh.app (Google web app, free)

---

## 📊 Success Metrics

After uploading assets to Product Hunt:

**Gallery Images**:
- Click-through rate from homepage card to post
- Time spent viewing images (Product Hunt analytics)
- Upvote conversion rate

**Video**:
- Play rate (% of visitors who click play)
- Average watch time (target: 45+ seconds)
- Conversion rate (watch video → upvote/install)

**Target engagement**:
- 80%+ of visitors view at least 1 gallery image
- 40%+ of visitors play the video
- 60%+ of video viewers watch >30 seconds

---

## 🚨 Common Mistakes to Avoid

1. **Low resolution images**: Product Hunt users zoom in. Use 2x resolution.
2. **No browser chrome**: Looks unprofessional. Always add realistic window frames.
3. **Video too long**: Attention drops after 60 seconds. Keep it tight.
4. **No captions**: Many users watch on mute. Captions are essential.
5. **Generic screenshots**: Show real data, real notifications, real value.
6. **File size too large**: Images >5MB may fail to upload. Compress first.
7. **Aspect ratio wrong**: Product Hunt is strict. Use exact dimensions.

---

## 🎯 Assignment Decision

**This task requires BOTH roles**:

### Engineer Responsibilities (2 hours)
- [x] Create this asset specification guide
- [ ] Set up file structure and naming conventions
- [ ] Configure video embed on `/ph` page (replace `YOUR_VIDEO_ID`)
- [ ] Test asset loading and performance
- [ ] Verify all UTM tracking on PH landing page

### CMO/Marketing Responsibilities (8-10 hours)
- [ ] Design 3 gallery images (1270x760px)
- [ ] Record and edit promo video (60s)
- [ ] Create thumbnail (240x240px)
- [ ] Write video voiceover script
- [ ] Source royalty-free music
- [ ] Review assets for brand consistency

**Recommendation**: If solo founder, block 2 full days for asset creation (engineering + marketing). Prioritize gallery images and video — these drive conversions.

---

## 📅 Urgent Next Steps

1. **Today**: Review this guide, decide on timeline
2. **Day 1**: Create all 3 gallery images + thumbnail
3. **Day 2**: Record and edit video
4. **Day 3**: Upload assets, test embeds, final polish
5. **Day 4**: Submit to Product Hunt

**Deadline**: Complete ALL assets 24 hours before Product Hunt submission to allow for revisions.

---

**Questions?** See `PRODUCT_HUNT_LAUNCH_PLAN.md` for full launch strategy.
