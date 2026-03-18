# Product Hunt Visual Assets Creation Guide

**Complete step-by-step guide to create all required visual assets for Product Hunt launch**

---

## 📋 Asset Checklist

- [ ] Gallery Image 1: Hero Shot (1270×760px)
- [ ] Gallery Image 2: Notification Demo (1270×760px)
- [ ] Gallery Image 3: Features Grid (1270×760px)
- [ ] Thumbnail: Extension Icon (240×240px)
- [ ] Demo Video: 60-second walkthrough (1080p MP4)

---

## 🎨 Gallery Images (1270×760px PNG)

### Specifications
- **Dimensions**: 1270×760 pixels (exact)
- **Format**: PNG
- **File size**: Under 1MB each
- **Background**: Dark theme (#0a0a0a) matching brand
- **Text**: High contrast, readable at small sizes

### Tools Needed
- **Figma** (free): https://figma.com
- **TinyPNG** (compression): https://tinypng.com
- **CloudApp/CleanShot X** (screenshots): For macOS screen captures

---

## 🖼️ Gallery Image 1: Hero Shot

**Purpose**: Show the extension in action with a live notification

### What to Include:
1. **Main Element**: Extension popup interface
   - Status: "Monitoring 3 locations"
   - Recent slots found (if any)
   - Clean UI with dark theme

2. **Overlays/Annotations**:
   - Arrow pointing to "Add to Chrome" button
   - Badge: "FREE" or "24/7 Monitoring"
   - Highlight key features

3. **Background**:
   - Subtle gradient (#0a0a0a to #111111)
   - Optional: Blurred GOES website in background

### Figma Template Structure:
```
Frame: 1270×760px
├── Background (gradient: #0a0a0a → #111111)
├── Extension Screenshot (centered, ~800px wide)
├── Annotation Layer
│   ├── Arrow (pointing to key feature)
│   ├── Label: "Real-time monitoring"
│   └── Badge: "FREE TIER AVAILABLE"
└── Product Name (top-left): "NEXUS Alert"
```

### Creation Steps:
1. Open extension in Chrome
2. Take screenshot (Cmd+Shift+4 on Mac)
3. Import to Figma
4. Add dark gradient background
5. Position screenshot in center
6. Add annotations with arrows/labels
7. Export as PNG
8. Compress with TinyPNG

---

## 🖼️ Gallery Image 2: Notification Demo

**Purpose**: Show the desktop notification in action

### What to Include:
1. **Main Element**: macOS/Windows notification
   - Title: "NEXUS Appointment Found!"
   - Body: "Niagara Falls - March 25, 2025 at 2:00 PM"
   - Chrome icon + NEXUS Alert icon

2. **Context**:
   - Partial browser window in background
   - Time/date visible (shows it's real-time)

3. **Visual Emphasis**:
   - Highlight notification with glow effect
   - Sound wave icon (indicating alert fired)

### Figma Template Structure:
```
Frame: 1270×760px
├── Background (screenshot of desktop)
├── Notification Card (positioned top-right)
│   ├── Icon (NEXUS Alert logo)
│   ├── Title: "NEXUS Appointment Found!"
│   ├── Body: "Niagara Falls - March 25, 2025 at 2:00 PM"
│   └── Actions: "Book Now" | "Dismiss"
├── Glow Effect (around notification)
└── Sound Icon (animated waves)
```

### Creation Steps:
1. Trigger test notification from extension
2. Screenshot when notification appears
3. Import to Figma
4. Add glow/highlight effect
5. Add sound wave animation icon
6. Export as PNG
7. Compress with TinyPNG

---

## 🖼️ Gallery Image 3: Features Grid

**Purpose**: Visual comparison of Free vs Premium tiers

### What to Include:
1. **Layout**: Side-by-side comparison
   - Left: FREE tier
   - Right: PREMIUM tier

2. **Features Listed**:
   - Check frequency (30 min vs 2 min)
   - Notification types (desktop vs desktop + email + SMS)
   - Slot history (7 days vs unlimited)
   - Support (community vs priority)

3. **Visual Style**:
   - Icons for each feature
   - Checkmarks vs X marks
   - Pricing callout: "$0" vs "$4.99/mo"
   - Highlight Premium benefits

### Figma Template Structure:
```
Frame: 1270×760px
├── Background (#0a0a0a)
├── Title (centered): "Choose Your Plan"
├── Left Column: FREE
│   ├── Icon (basic notification)
│   ├── Feature 1: ✓ Check every 30 min
│   ├── Feature 2: ✓ Desktop notifications
│   ├── Feature 3: ✓ 7-day slot history
│   ├── Feature 4: ✗ Email/SMS alerts
│   └── Price: "$0"
└── Right Column: PREMIUM
    ├── Icon (premium badge)
    ├── Feature 1: ✓ Check every 2 min
    ├── Feature 2: ✓ Desktop + Email + SMS
    ├── Feature 3: ✓ Unlimited history
    ├── Feature 4: ✓ Priority support
    └── Price: "$4.99/mo"
```

### Creation Steps:
1. Create grid layout in Figma
2. Add icons for each feature
3. Use brand colors (#3b82f6 for Premium)
4. Add checkmarks/X marks
5. Highlight Premium column slightly
6. Export as PNG
7. Compress with TinyPNG

---

## 🎯 Thumbnail (240×240px PNG)

**Purpose**: Small icon shown next to product name on Product Hunt

### What to Include:
- NEXUS Alert logo (clean, simple)
- High contrast (readable at small size)
- No text (logo only)

### Specifications:
- **Dimensions**: 240×240 pixels (exact)
- **Format**: PNG with transparency
- **File size**: Under 500KB
- **Background**: Transparent OR solid color

### Creation Steps:
1. Open logo file in Figma
2. Create 240×240px frame
3. Center logo
4. Ensure high contrast
5. Export as PNG (with transparency)
6. Test visibility at small size
7. Compress with TinyPNG

---

## 🎥 Demo Video (60 seconds)

**Purpose**: Show extension in action from install to notification

### Specifications:
- **Length**: 30-60 seconds
- **Resolution**: 1920×1080 (1080p) or 1280×720 (720p)
- **Format**: MP4 (H.264 codec)
- **File size**: Under 50MB
- **Captions**: Embedded subtitles (hardcoded)
- **Audio**: Background music (low volume) + sound effects

### Tools Needed:
- **Loom** (easiest): https://loom.com
- **OBS Studio** (free): https://obsproject.com
- **iMovie/Final Cut Pro** (Mac): For editing
- **Kapwing** (web-based): https://kapwing.com

### Script Outline (60 seconds):

```
[0:00-0:05] Problem
Visual: Frustrated person refreshing GOES website
Text: "NEXUS appointments booked 6 months out?"
Voiceover: "Tired of waiting months for your NEXUS appointment?"

[0:06-0:10] Problem cont'd
Visual: Calendar showing August appointment
Text: "Cancelled slots disappear in minutes"
Voiceover: "Slots open up randomly but disappear fast."

[0:11-0:20] Solution
Visual: Install extension from Chrome Web Store
Text: "NEXUS Alert monitors 24/7"
Voiceover: "NEXUS Alert watches for you, 24/7."
Show: Extension popup interface, select locations

[0:21-0:30] Demo
Visual: Slot appears on GOES website
Notification fires (desktop + sound)
Text: "Instant alerts when slots open"
Voiceover: "Get instant alerts the moment a slot appears."

[0:31-0:40] Features
Visual: Quick cuts showing:
- Multi-location tracking
- Smart date filters
- Slot history
Voiceover: "Track multiple locations. Set date filters. See history."

[0:41-0:50] Booking
Visual: Click notification → GOES booking page opens
Text: "One click to book"
Show: Appointment successfully booked
Voiceover: "One click to book before it's gone."

[0:51-0:60] CTA
Text: "Install free. Upgrade for faster checks."
Logo + "nexusalert.app"
Text: "Product Hunt Special: First month free"
Voiceover: "Install free today. Premium users get first month free with code PRODUCTHUNT."
```

### Recording Steps (Using Loom):

1. **Preparation**:
   - Clear browser history/bookmarks
   - Disable other extensions
   - Prepare GOES website in tab
   - Have test notification ready

2. **Record Segments**:
   - Segment 1: Install extension (10 sec)
   - Segment 2: Configure locations (10 sec)
   - Segment 3: Notification fires (10 sec)
   - Segment 4: Click to book (10 sec)
   - Segment 5: Success screen (10 sec)

3. **Editing** (in Loom or Kapwing):
   - Trim to 60 seconds
   - Add text overlays
   - Add background music (royalty-free)
   - Add subtitles (auto-generate in Loom)
   - Add fade-in/fade-out

4. **Export**:
   - Download as MP4
   - Ensure file size < 50MB
   - Test playback

5. **Upload**:
   - Upload to YouTube (unlisted)
   - OR: Upload directly to Product Hunt
   - Copy embed URL

### Royalty-Free Music Sources:
- **YouTube Audio Library**: Free, no attribution required
- **Epidemic Sound**: Paid, high quality
- **Artlist**: Paid, unlimited downloads

**Recommended Track Style**: Upbeat, tech-focused, instrumental

---

## 🎨 Design Tips

### Color Palette (from NEXUS Alert brand):
```
Primary: #3b82f6 (blue)
Secondary: #22c55e (green)
Background: #0a0a0a (dark)
Surface: #111111 (slightly lighter)
Text: #ffffff (white)
Text Muted: #888888 (gray)
```

### Typography:
- **Headings**: Inter Bold, 48-72px
- **Body**: Inter Regular, 18-24px
- **Captions**: Inter Medium, 14-16px

### Spacing:
- Use 4px grid system (4, 8, 12, 16, 20, 24, 32, 40, 48, 64)
- Generous whitespace (don't cram)
- Consistent padding/margins

### Accessibility:
- High contrast text (WCAG AA minimum)
- Large clickable areas (44px minimum)
- Clear visual hierarchy
- Readable at small sizes

---

## ✅ Quality Checklist

Before uploading to Product Hunt, verify:

### Gallery Images:
- [ ] Exactly 1270×760 pixels
- [ ] Under 1MB file size
- [ ] PNG format
- [ ] High contrast, readable at small sizes
- [ ] No spelling errors in text
- [ ] Brand colors consistent
- [ ] Dark theme throughout
- [ ] Compressed with TinyPNG

### Thumbnail:
- [ ] Exactly 240×240 pixels
- [ ] Under 500KB file size
- [ ] PNG format with transparency
- [ ] Logo clear and recognizable
- [ ] High contrast

### Demo Video:
- [ ] 30-60 seconds length
- [ ] 1080p or 720p resolution
- [ ] Under 50MB file size
- [ ] MP4 format (H.264)
- [ ] Captions embedded
- [ ] Audio clear (music + voiceover)
- [ ] No lag or stuttering
- [ ] Branding visible throughout
- [ ] CTA at end ("Install free")

---

## 📤 Upload to Product Hunt

### When submitting your product:

1. **Gallery Images** (3 images):
   - Upload in order: Hero → Notification → Features
   - Each under 1MB
   - PNG format

2. **Thumbnail** (1 image):
   - 240×240px
   - Represents your brand

3. **Video** (optional but HIGHLY recommended):
   - Upload directly to PH
   - OR: Embed YouTube/Loom URL

### Upload Flow:
```
Product Hunt → Submit Product
├── Name: "NEXUS Alert"
├── Tagline: "Never miss a NEXUS appointment slot"
├── Description: (260 chars max)
├── Gallery: Upload 3 images
├── Thumbnail: Upload 1 image
├── Video: Paste YouTube/Loom URL
├── Topics: Travel, Productivity, Chrome Extensions
└── Links: Website, Chrome Store, GitHub
```

---

## 🎯 Asset Examples (Inspiration)

### Top Product Hunt Launches with Great Visuals:
1. **Superhuman** - Clean screenshots with annotations
2. **Loom** - Demo video showing value immediately
3. **Notion** - Beautiful feature comparison grids
4. **Figma** - Simple, clear UI screenshots

### Study These:
- https://www.producthunt.com/posts/superhuman
- https://www.producthunt.com/posts/loom
- https://www.producthunt.com/posts/notion-2-0

---

## ⏱️ Time Estimate

**Total time to create all assets**: 4-6 hours

- Gallery Image 1 (Hero): 1 hour
- Gallery Image 2 (Notification): 45 min
- Gallery Image 3 (Features): 1 hour
- Thumbnail: 30 min
- Demo Video: 2-3 hours (recording + editing)

**Tip**: Start with demo video first — you can extract screenshots for gallery images!

---

## 🚀 Next Steps

1. [ ] Create Figma account (if needed)
2. [ ] Download extension screenshots
3. [ ] Create 3 gallery images using templates above
4. [ ] Create thumbnail
5. [ ] Record demo video (Loom is easiest)
6. [ ] Compress all images with TinyPNG
7. [ ] Upload to Product Hunt submission form

---

**Ready to create amazing visuals? Use this guide step-by-step and you'll have professional Product Hunt assets in a few hours!**

**Questions?** Re-read the relevant section or check Product Hunt's official guidelines: https://help.producthunt.com/en/articles/2911750-guidelines-for-product-gallery
