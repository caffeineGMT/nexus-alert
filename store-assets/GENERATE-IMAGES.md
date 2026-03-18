# How to Generate Promotional Images

This guide shows how to create the promotional images (marquee and small tile) for the Chrome Web Store.

---

## Required Images

1. **Marquee** (1400x560 px) — Large promotional banner
2. **Small Tile** (440x280 px) — Small promotional tile

---

## Option 1: Screenshot from HTML Templates (Recommended)

### Step 1: Open the HTML Templates

We've created HTML templates that render at the exact sizes needed:

- `marquee-1400x560.html` — Opens at 1400x560 px
- `small-tile-440x280.html` — Opens at 440x280 px

### Step 2: Open in Chrome

```bash
# From the project root
open store-assets/marquee-1400x560.html
open store-assets/small-tile-440x280.html
```

Or manually:
1. Open Chrome
2. File → Open File
3. Select `marquee-1400x560.html`

### Step 3: Resize Browser Window

**For macOS:**
1. Open the HTML file in Chrome
2. Press `Cmd+Option+I` to open DevTools
3. Press `Cmd+Shift+M` to enable Device Toolbar
4. At the top of the page, change "Responsive" to "Edit..."
5. Add a custom device:
   - Name: "Chrome Web Store Marquee"
   - Width: 1400
   - Height: 560
   - Device pixel ratio: 1
6. Click "Add"
7. Select your new device
8. Click the **⋮** menu (3 dots) → "Capture screenshot"

**Alternative (simpler):**
1. Open `marquee-1400x560.html` in Chrome
2. Make browser fullscreen
3. Open Web Inspector (Cmd+Option+I)
4. In Console, run:
   ```javascript
   window.resizeTo(1400, 560);
   ```
5. Take screenshot (Cmd+Shift+5 → Capture Selected Portion)

### Step 4: Take Screenshot

**macOS:**
1. Press `Cmd+Shift+5`
2. Select "Capture Selected Portion"
3. Drag to select the entire rendered HTML (1400x560 or 440x280)
4. Click "Capture"
5. Screenshot saves to Desktop

**Windows:**
1. Press `Win+Shift+S` (Snipping Tool)
2. Drag to select the rendered HTML
3. Save as PNG

**Chrome DevTools (best method):**
1. Open DevTools (F12 or Cmd+Option+I)
2. Press `Cmd+Shift+M` to enable Device Toolbar
3. Set custom dimensions (1400x560 or 440x280)
4. Click **⋮** menu → "Capture screenshot"

### Step 5: Save Files

Save as:
- `marquee-1400x560.png`
- `small-tile-440x280.png`

Place in `store-assets/` directory.

---

## Option 2: Use Online Screenshot Tool

If resizing the browser window is difficult, use an online tool:

### Recommended Tools

1. **Screely** (https://screely.com)
   - Upload HTML file
   - Set custom dimensions
   - Download PNG

2. **ScreenshotAPI** (https://screenshotapi.net)
   - Enter local file path
   - Set viewport size
   - Download

3. **Puppeteer** (Node.js script)
   ```bash
   npm install -g puppeteer
   ```

   Then create `generate-images.js`:
   ```javascript
   const puppeteer = require('puppeteer');

   (async () => {
     const browser = await puppeteer.launch();
     const page = await browser.newPage();

     // Marquee
     await page.setViewport({ width: 1400, height: 560 });
     await page.goto('file:///Users/michaelguo/nexus-alert/store-assets/marquee-1400x560.html');
     await page.screenshot({ path: 'marquee-1400x560.png' });

     // Small tile
     await page.setViewport({ width: 440, height: 280 });
     await page.goto('file:///Users/michaelguo/nexus-alert/store-assets/small-tile-440x280.html');
     await page.screenshot({ path: 'small-tile-440x280.png' });

     await browser.close();
   })();
   ```

   Run: `node generate-images.js`

---

## Option 3: Design in Figma/Canva

If you prefer to design from scratch:

### Figma

1. Create new file
2. Frame size: 1400x560 (marquee) or 440x280 (small tile)
3. Design with dark background (#0a0a0a to #1a1a2e gradient)
4. Add text: "Never Miss Your NEXUS Appointment"
5. Add mockup of extension popup
6. Export as PNG (2x resolution for clarity)

### Canva

1. Go to Canva.com
2. Create custom size: 1400x560 or 440x280
3. Design with dark theme
4. Download as PNG

---

## Verification Checklist

Before uploading to Chrome Web Store:

- [ ] Marquee is exactly **1400x560 px**
- [ ] Small tile is exactly **440x280 px**
- [ ] Images are **PNG format**
- [ ] File size is under **5 MB** each
- [ ] Text is readable and clear
- [ ] Colors match brand (blue #3b82f6, green #22c55e)
- [ ] No pixelation or blur
- [ ] Images preview correctly in Chrome

---

## Image Optimization (Optional)

Reduce file size without losing quality:

```bash
# Install ImageMagick
brew install imagemagick

# Optimize PNG
convert marquee-1400x560.png -quality 85 marquee-1400x560-optimized.png
convert small-tile-440x280.png -quality 85 small-tile-440x280-optimized.png
```

Or use online tools:
- https://tinypng.com/
- https://squoosh.app/

---

## Expected Results

**Marquee (1400x560):**
- Dark gradient background
- "Never Miss Your NEXUS Appointment" headline
- Extension popup mockup on right side
- Feature list with checkmarks
- "Add to Chrome — Free" CTA button

**Small Tile (440x280):**
- Dark gradient background
- Bell icon in gradient circle
- "NEXUS Alert" title
- "Never miss an appointment slot" tagline
- "Free • Instant Notifications" badge

---

## Troubleshooting

**Problem:** Browser won't resize to exact dimensions
**Solution:** Use Chrome DevTools Device Toolbar (Cmd+Shift+M)

**Problem:** Screenshot is blurry
**Solution:** Ensure device pixel ratio is 1.0 (not 2.0 or 3.0)

**Problem:** Colors look different
**Solution:** Use PNG format (not JPEG) to preserve exact colors

**Problem:** File size too large (>5MB)
**Solution:** Optimize with TinyPNG or ImageMagick

---

## Final Step

Once generated, place images in `store-assets/`:

```
store-assets/
├── marquee-1400x560.png
└── small-tile-440x280.png
```

You're ready to upload to Chrome Web Store! 🚀
