# Product Hunt Gallery Images Specifications

**Required:** 3 images at 1270x760px each
**Format:** PNG
**File size:** <500KB each (compressed)
**Style:** Professional, clean, consistent branding

---

## Image 1: Extension Dashboard
**Filename:** `01-dashboard.png`
**Dimensions:** 1270x760px
**Tagline:** "Monitor multiple locations with smart filters"

### Layout Composition:
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    White/Light Gray Background                  │
│                  (subtle gradient #f9f9f9 to #fff)              │
│                                                                 │
│   ┌───────────────────────────────────────────────────────┐   │
│   │ Chrome Browser Window                                 │   │
│   │ ┌─┬─┬─────────────────────────────────────────────┐  │   │
│   │ │×│-│○  ● ttp.cbp.dhs.gov                        ⋮│  │   │
│   │ └─┴─┴─────────────────────────────────────────────┘  │   │
│   │                                                       │   │
│   │     NEXUS Alert Extension Popup (open)               │   │
│   │     ┌───────────────────────────────────────┐        │   │
│   │     │ NEXUS Alert                          │        │   │
│   │     │                                       │        │   │
│   │     │ Select Enrollment Centers             │        │   │
│   │     │ ☑ Detroit, MI                         │        │   │
│   │     │ ☑ Buffalo, NY                         │        │   │
│   │     │ ☑ Blaine, WA                          │        │   │
│   │     │ ☐ Seattle, WA                         │        │   │
│   │     │                                       │        │   │
│   │     │ Date Range                            │        │   │
│   │     │ Mar 1, 2026 - Mar 31, 2026           │        │   │
│   │     │                                       │        │   │
│   │     │ Time Preference                       │        │   │
│   │     │ ○ Any time                            │        │   │
│   │     │                                       │        │   │
│   │     │ Check Frequency                       │        │   │
│   │     │ [Every 5 minutes ▼]                   │        │   │
│   │     │                                       │        │   │
│   │     │ ┌───────────────────────────────┐    │        │   │
│   │     │ │   Start Monitoring (Blue)     │    │        │   │
│   │     │ └───────────────────────────────┘    │        │   │
│   │     │                                       │        │   │
│   │     │ Recent Slots Found (3 items)          │        │   │
│   │     │ • Detroit - Mar 15, 10:00 AM          │        │   │
│   │     │ • Buffalo - Mar 18, 2:00 PM           │        │   │
│   │     │ • Blaine - Mar 22, 9:00 AM            │        │   │
│   │     └───────────────────────────────────────┘        │   │
│   └───────────────────────────────────────────────────────┘   │
│                                                                 │
│         Subtle shadow below browser window                      │
└─────────────────────────────────────────────────────────────────┘
```

### Design Details:
- **Background:** Light gradient (#f9f9f9 to #ffffff)
- **Browser chrome:** Accurate Chrome window with traffic lights (macOS) or window controls (Windows)
- **URL bar:** Shows "ttp.cbp.dhs.gov" to indicate context
- **Extension popup:** 400px wide, dark theme (#0a0a0a background)
- **Primary CTA button:** #3b82f6 (blue)
- **Checkboxes:** Green when selected (#22c55e)
- **Text:** White (#ededed) on dark background
- **Shadow:** Subtle drop shadow rgba(0,0,0,0.15)

### Text Content:
- Title: "NEXUS Alert"
- Section 1: "Select Enrollment Centers" (4 checkboxes, 3 selected)
- Section 2: "Date Range" with date picker showing "Mar 1, 2026 - Mar 31, 2026"
- Section 3: "Time Preference" with radio button "Any time"
- Section 4: "Check Frequency" dropdown showing "Every 5 minutes"
- CTA: "Start Monitoring" (blue button)
- Section 5: "Recent Slots Found" with 3 list items

### Export Settings:
- Resolution: 1270x760px (300dpi recommended)
- Format: PNG-24
- Compression: TinyPNG or ImageOptim (<500KB)
- Color space: sRGB

---

## Image 2: Notification Alert
**Filename:** `02-notification.png`
**Dimensions:** 1270x760px
**Tagline:** "Instant alerts when slots appear"

### Layout Composition:
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│            Blurred Desktop Background (macOS/Windows)           │
│                   (soft blur, desaturated)                      │
│                                                                 │
│                                                                 │
│        ┌───────────────────────────────────────────────┐       │
│        │                                               │       │
│        │      Desktop Notification (centered)          │       │
│        │  ┌─────────────────────────────────────────┐ │       │
│        │  │ [NEXUS Alert icon]                      │ │       │
│        │  │                                         │ │       │
│        │  │ 🎉 NEXUS appointment found!             │ │       │
│        │  │                                         │ │       │
│        │  │ Detroit enrollment center               │ │       │
│        │  │ March 15, 2026 at 10:00 AM              │ │       │
│        │  │                                         │ │       │
│        │  │ ┌─────────────┐  ┌───────────┐        │ │       │
│        │  │ │  Book Now   │  │  Dismiss  │        │ │       │
│        │  │ └─────────────┘  └───────────┘        │ │       │
│        │  └─────────────────────────────────────────┘ │       │
│        └───────────────────────────────────────────────┘       │
│                                                                 │
│          ~~~  Sound Wave Animation  ~~~                         │
│         (3-4 curved lines indicating audio alert)               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Design Details:
- **Background:** Blurred desktop screenshot (80% blur, 50% desaturate)
- **Notification card:**
  - Size: 450px × 180px
  - Background: System notification style (macOS: white with subtle shadow, Windows: dark with border)
  - Shadow: Strong drop shadow rgba(0,0,0,0.25)
- **Icon:** NEXUS Alert logo (32×32px)
- **Title:** "🎉 NEXUS appointment found!" (20px, bold)
- **Body text:** "Detroit enrollment center" + "March 15, 2026 at 10:00 AM" (14px, regular)
- **Buttons:**
  - "Book Now" (blue #3b82f6, white text)
  - "Dismiss" (gray #888, white text)
- **Sound waves:**
  - 3-4 curved lines emanating from notification
  - Color: #3b82f6 with 60% opacity
  - Animated appearance (if static, show motion blur)

### Platform-Specific Styling:
**macOS:**
- White background (#ffffff)
- Subtle border (1px, rgba(0,0,0,0.1))
- Rounded corners (8px)
- Small close button (top-right)

**Windows:**
- Dark background (#1e1e1e)
- Border (1px, #333)
- Square corners
- App name at top ("NEXUS Alert")

### Export Settings:
- Resolution: 1270x760px (300dpi)
- Format: PNG-24
- Transparency: None (blurred background fills frame)
- Compression: <500KB

---

## Image 3: Premium Features Comparison
**Filename:** `03-premium.png`
**Dimensions:** 1270x760px
**Tagline:** "Upgrade for faster checks and email/SMS alerts"

### Layout Composition:
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│              White/Light Background (#f9f9f9)                   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │              Premium vs Free Comparison                  │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   ┌───────────────────────┐   ┌───────────────────────────┐   │
│   │      FREE TIER        │   │   PREMIUM TIER ⭐         │   │
│   │                       │   │  (Green border highlight)  │   │
│   ├───────────────────────┤   ├───────────────────────────┤   │
│   │                       │   │                           │   │
│   │   [Monitor icon]      │   │   [Rocket icon]           │   │
│   │      64×64px          │   │      64×64px              │   │
│   │                       │   │                           │   │
│   │  Checks every         │   │  Checks every             │   │
│   │  30 minutes           │   │  2 minutes                │   │
│   │                       │   │                           │   │
│   │  ☑ Desktop alerts     │   │  ☑ Desktop alerts         │   │
│   │  ☑ Sound notify       │   │  ☑ Sound notify           │   │
│   │  ☐ Email alerts       │   │  ☑ Email alerts           │   │
│   │  ☐ SMS alerts         │   │  ☑ SMS alerts             │   │
│   │                       │   │                           │   │
│   │  [Icon: Monitor]      │   │  [Icons: Monitor +        │   │
│   │                       │   │   Envelope + Phone]       │   │
│   │                       │   │                           │   │
│   │      $0/mo            │   │      $4.99/mo             │   │
│   │                       │   │  ~~$0~~ first month       │   │
│   │                       │   │                           │   │
│   │  ┌─────────────────┐ │   │  ┌─────────────────────┐  │   │
│   │  │  Get Started    │ │   │  │  Upgrade to Pro     │  │   │
│   │  └─────────────────┘ │   │  └─────────────────────┘  │   │
│   │                       │   │                           │   │
│   └───────────────────────┘   │  Code: PRODUCTHUNT        │   │
│                               │  [Copy button]            │   │
│                               │                           │   │
│                               │  🔥 Product Hunt Special  │   │
│                               │  1st month FREE           │   │
│                               └───────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Design Details:
- **Background:** Light gray (#f9f9f9)
- **Cards:**
  - Size: 450px × 600px each
  - Background: White (#ffffff)
  - Border: Free (1px #ddd), Premium (2px #22c55e)
  - Spacing: 40px between cards
  - Rounded corners: 16px
  - Shadow: Subtle (rgba(0,0,0,0.08))
- **Icons:**
  - Free: Monitor/computer icon (gray #888)
  - Premium: Rocket icon (blue #3b82f6)
  - Size: 64×64px
  - Style: Outline, 2px stroke
- **Badge:**
  - "⭐ Most Popular" on Premium card
  - Position: Top-right corner
  - Background: #22c55e
  - Text: White, 12px, bold
- **Pricing:**
  - Free: "$0/mo" (24px, bold)
  - Premium: "$4.99/mo" (24px, bold) with strikethrough "$0 first month" (16px, #22c55e)
- **Promo code box:**
  - Background: #f0fdf4 (light green)
  - Border: 1px #22c55e
  - Text: "Code: PRODUCTHUNT"
  - Copy button: Small icon button
- **Product Hunt special banner:**
  - Background: Linear gradient (#ff6154 to #da552f)
  - Text: "🔥 Product Hunt Special - 1st month FREE"
  - Position: Bottom of Premium card
  - Color: White, 14px, bold

### Comparison Table Items:
**Free Tier:**
- ☑ Desktop notifications
- ☑ Sound alerts
- ☐ Email alerts (grayed out)
- ☐ SMS alerts (grayed out)
- Icon: Single monitor

**Premium Tier:**
- ☑ Desktop notifications
- ☑ Sound alerts
- ☑ Email alerts
- ☑ SMS alerts
- Icons: Monitor + Envelope + Phone (all in green)

### Export Settings:
- Resolution: 1270x760px (300dpi)
- Format: PNG-24
- Compression: <500KB
- Color accuracy: sRGB

---

## Design Tools & Resources

### Recommended Tools:
1. **Figma** (recommended)
   - Use Auto Layout for responsive components
   - Export at 2x for retina clarity
   - Use plugins: Unsplash (backgrounds), Iconify (icons)

2. **Sketch**
   - Artboard: 1270×760px
   - Export for Web preset

3. **Canva Pro**
   - Use "Custom dimensions" → 1270×760px
   - Search templates: "Browser mockup", "App screenshot"
   - Export as PNG (high quality)

4. **Photoshop**
   - New document: 1270×760px, 300dpi
   - Use Smart Objects for browser chrome
   - Export for Web (PNG-24, optimized)

### Icon Resources:
- **Heroicons** (https://heroicons.com) — Free, MIT license
- **Lucide Icons** (https://lucide.dev) — Open source
- **Phosphor Icons** (https://phosphoricons.com) — Flexible weights
- **Feather Icons** (https://feathericons.com) — Simple, clean

### Browser Chrome Mockups:
- **Browser Frame** (Figma plugin) — Accurate browser frames
- **Mockuuups** (https://mockuuups.studio) — Free browser mockups
- **Screely** (https://screely.com) — Online screenshot beautifier
- **Cleanmock** (https://cleanmock.com) — Minimal browser frames

### Font Stack:
- **Headings:** Inter, -apple-system, BlinkMacSystemFont
- **Body:** Inter, system-ui, sans-serif
- **Code/Promo:** 'SF Mono', 'Monaco', 'Courier New', monospace
- **Sizes:**
  - H1: 24px, bold
  - H2: 20px, semibold
  - Body: 14px, regular
  - Caption: 12px, medium

### Color Palette (from design system):
- Primary: `#3b82f6` (blue)
- Success: `#22c55e` (green)
- Background: `#0a0a0a` (dark)
- Surface: `#111111`
- Border: `#222222`
- Text: `#ffffff` (white)
- Text Muted: `#888888`
- Warning: `#eab308` (yellow)
- Error: `#ef4444` (red)
- Premium: `#3b82f6`
- PH Orange: `#da552f`
- PH Red: `#ff6154`

---

## Image Creation Workflow

### Step 1: Setup
1. Create artboard/canvas: 1270×760px
2. Set background: Light gradient or solid color
3. Import browser chrome mockup (Chrome window)

### Step 2: Content
1. Add extension UI or notification content
2. Use actual text (no Lorem Ipsum)
3. Apply brand colors consistently
4. Add icons (64×64px for benefits, 32×32px for notifications)

### Step 3: Polish
1. Add subtle shadows (rgba(0,0,0,0.15) for cards)
2. Ensure text is readable (contrast ratio >4.5:1)
3. Align elements to 8px grid
4. Check visual hierarchy (most important elements stand out)

### Step 4: Export
1. Export at 2x resolution for clarity
2. Downscale to 1270×760px
3. Compress with TinyPNG or ImageOptim
4. Verify file size <500KB
5. Test on light and dark backgrounds

### Step 5: Quality Check
- [ ] Exactly 1270×760px dimensions
- [ ] File size <500KB
- [ ] Text is crisp and readable
- [ ] Colors match brand palette
- [ ] Shadows are subtle, not overdone
- [ ] Browser chrome looks realistic
- [ ] Icons are aligned and consistent size
- [ ] No pixelation or artifacts
- [ ] Looks good on Retina/HiDPI displays

---

## Optimization Tips

### Reduce File Size:
1. **Flatten layers** before export (no transparency unless needed)
2. **Use web-safe colors** (reduce color palette if possible)
3. **Compress with TinyPNG** (https://tinypng.com) — lossless, ~70% reduction
4. **Remove metadata** (EXIF data, color profiles except sRGB)
5. **Use PNG-8 if possible** (limited colors), otherwise PNG-24

### Improve Quality:
1. **Design at 2x** (2540×1520px) then downscale — sharper results
2. **Use vector graphics** where possible (icons, shapes)
3. **Anti-aliasing on text** — ensure smooth edges
4. **Export from design tool** — better quality than screenshots
5. **Test on actual Product Hunt** — upload as draft to verify

### Accessibility:
1. **Color contrast:** Ensure text has 4.5:1 ratio against background
2. **Font size:** Minimum 14px for body text, 12px for captions
3. **Clear hierarchy:** Important elements stand out visually
4. **Avoid tiny text:** If it's hard to read at 1270px, it's too small

---

## Product Hunt Submission Checklist

- [ ] All 3 images created (01-dashboard.png, 02-notification.png, 03-premium.png)
- [ ] All images exactly 1270×760px
- [ ] All images <500KB each
- [ ] Images compressed (TinyPNG)
- [ ] Text is readable (contrast checked)
- [ ] Brand colors consistent (#3b82f6, #22c55e, #0a0a0a)
- [ ] Browser chrome looks realistic
- [ ] Icons aligned and professional
- [ ] Shadows subtle and tasteful
- [ ] Tested on light background (PH uses white)
- [ ] No pixelation or artifacts
- [ ] Filenames clear and numbered
- [ ] Uploaded to Product Hunt draft
- [ ] Previewed on mobile and desktop

---

## Example Workflow (Figma)

1. **Create artboard:** 1270×760px, name "PH-Gallery-01-Dashboard"
2. **Add background:** Rectangle, fill #f9f9f9, gradient to #ffffff
3. **Import browser chrome:** Use "Browser Frame" plugin or custom component
4. **Design extension popup:**
   - Frame: 400×600px
   - Fill: #0a0a0a
   - Corner radius: 12px
   - Shadow: 0 8px 24px rgba(0,0,0,0.15)
5. **Add content:**
   - Text: Inter font
   - Checkboxes: Component with green fill when active
   - Button: Auto Layout, #3b82f6 fill, white text
   - Recent slots: List with bullet points
6. **Position in browser:** Center popup in browser window, slightly offset
7. **Export:**
   - Select artboard
   - Export settings → PNG, 2x
   - Export
   - Open in TinyPNG → Compress
   - Save as `01-dashboard.png`

**Repeat for images 2 and 3.**

---

## Final Notes

- **Consistency is key:** All 3 images should look like they're part of the same product
- **Tell a story:** Dashboard → Notification → Premium upgrade
- **Keep it simple:** Don't overcrowd with text or elements
- **Professional polish:** Small details matter (shadows, alignment, spacing)
- **Test on Product Hunt:** Upload as draft and preview before final submission

**When in doubt, err on the side of simplicity. Clean, professional, and clear beats flashy and complex.**

Good luck! 🚀
