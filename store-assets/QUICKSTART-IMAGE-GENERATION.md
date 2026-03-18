# Quick Start: Generate Chrome Web Store Images

**Total time: 5 minutes**

The automated puppeteer script is having issues, so use this manual method instead. It's actually faster and more reliable.

## Method 1: Chrome DevTools Screenshot (RECOMMENDED)

### Marquee Image (1400x560)

1. **Open the HTML file**
   ```bash
   open store-assets/marquee-1400x560.html
   ```

2. **Open Chrome DevTools**
   - Press `Cmd+Option+I` (Mac) or `F12` (Windows)

3. **Enable Device Toolbar**
   - Click the device icon or press `Cmd+Shift+M`
   - Set dimensions: `1400 x 560`
   - Set DPR (Device Pixel Ratio): `2` for retina quality

4. **Capture Screenshot**
   - Click the `⋮` menu in DevTools
   - Select **Capture screenshot**
   - File auto-downloads as `screenshot.png`
   - Rename to `marquee-1400x560.png`

5. **Move to store-assets folder**
   ```bash
   mv ~/Downloads/screenshot.png store-assets/marquee-1400x560.png
   ```

### Small Tile Image (440x280)

1. **Open the HTML file**
   ```bash
   open store-assets/small-tile-440x280.html
   ```

2. **Open DevTools and enable Device Toolbar**
   - Press `Cmd+Option+I` then `Cmd+Shift+M`
   - Set dimensions: `440 x 280`
   - Set DPR: `2`

3. **Capture screenshot** → Rename to `small-tile-440x280.png`

4. **Move to folder**
   ```bash
   mv ~/Downloads/screenshot.png store-assets/small-tile-440x280.png
   ```

---

## Method 2: macOS Screenshot Tool

1. **Open HTML file in browser**
   ```bash
   open store-assets/marquee-1400x560.html
   ```

2. **Resize browser window**
   - Manually resize Chrome to exact dimensions
   - Or use Rectangle app: `brew install --cask rectangle`

3. **Take screenshot**
   - Press `Cmd+Shift+4`
   - Press `Space` to capture full window
   - Or drag to select area

4. **Rename and move**
   ```bash
   mv ~/Desktop/Screen\ Shot*.png store-assets/marquee-1400x560.png
   ```

---

## Method 3: Firefox (Alternative)

Firefox has a built-in full-page screenshot tool:

1. **Open HTML in Firefox**
2. **Right-click** → **Take Screenshot**
3. **Download** → Rename to correct filename

---

## Verify Image Dimensions

After generating, verify dimensions:

```bash
# Install imagemagick if needed
brew install imagemagick

# Check dimensions
identify store-assets/marquee-1400x560.png
identify store-assets/small-tile-440x280.png

# Should output:
# marquee-1400x560.png PNG 1400x560 ...
# small-tile-440x280.png PNG 440x280 ...
```

---

## Optimize File Size (Optional)

Chrome Web Store has a 5MB limit per image, but smaller is better:

```bash
# Optimize without quality loss
convert store-assets/marquee-1400x560.png -quality 85 store-assets/marquee-1400x560.png
convert store-assets/small-tile-440x280.png -quality 85 store-assets/small-tile-440x280.png

# Or use online tool:
# https://tinypng.com/
```

---

## Next Steps

After generating both images:

1. Generate 5 screenshots (see `SCREENSHOT-INSTRUCTIONS.md`)
2. Complete submission checklist (`SUBMISSION-CHECKLIST.md`)
3. Upload to Chrome Web Store Developer Dashboard

---

## Troubleshooting

**Images are blurry**
- Set Device Pixel Ratio (DPR) to `2` in DevTools
- Or capture at 2x dimensions then scale down:
  ```bash
  convert input.png -resize 1400x560 output.png
  ```

**Wrong dimensions**
- Use `identify` command to check actual size
- Re-capture with exact viewport dimensions in DevTools

**File too large**
- Compress with TinyPNG or ImageMagick
- Chrome Web Store limit is 5MB per image
