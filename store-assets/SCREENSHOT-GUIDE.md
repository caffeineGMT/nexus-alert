# Screenshot Guide for Chrome Web Store

Complete guide to capturing all required screenshots for the Chrome Web Store submission.

---

## Required Screenshots

Chrome Web Store requires **1-5 screenshots** at either:
- **1280×800 pixels** (recommended), OR
- **640×400 pixels** (minimum)

We'll capture **5 screenshots** to maximize visual impact.

---

## Quick Start: Generate Promotional Images First

### Step 1: Open the Image Generator

```bash
open store-assets/GENERATE-IMAGES-SIMPLE.html
```

Or manually: Open Chrome → File → Open File → Select `GENERATE-IMAGES-SIMPLE.html`

### Step 2: Capture Images Using Chrome DevTools

1. Click **"Show Marquee (1400×560)"**
2. Press **Cmd+Shift+M** (Mac) or **F12** (Windows) to open DevTools
3. Press **Cmd+Shift+M** again to toggle Device Toolbar
4. Click the **⋮** menu (three vertical dots) at the top of the page
5. Select **"Capture screenshot"**
6. File saves to Downloads as `screenshot-YYYY-MM-DD-HHMMSS.png`
7. Rename to `marquee-1400x560.png` and move to `store-assets/`

Repeat for **"Show Small Tile (440×280)"**:
- Save as `small-tile-440x280.png`

**You now have your promotional images!** ✅

---

## Extension Screenshots (5 Required)

### Setup: Load the Extension

1. Open Chrome
2. Go to `chrome://extensions`
3. Enable **Developer mode** (toggle top-right)
4. Click **Load unpacked**
5. Select the `/Users/michaelguo/nexus-alert` directory
6. Extension loads successfully

### Screenshot Tool Options

**Option A: Chrome DevTools (Recommended)**
- Most precise
- Exact dimensions guaranteed
- Built-in screenshot tool

**Option B: macOS Screenshot (Cmd+Shift+5)**
- Quick and easy
- Requires manual cropping to exact size

**Option C: Browser Extension Screenshot Tool**
- Install "GoFullPage" or "Awesome Screenshot"
- Capture visible area

---

## Screenshot 1: Monitor Tab — Location Selection

**What to show:**
- Extension popup open
- Monitor tab active
- NEXUS program selected
- 2-3 enrollment centers checked (e.g., Blaine, Pacific Highway)
- Status showing "Monitoring" with green dot
- Check interval visible (e.g., "Every 5 minutes")

**How to capture:**

1. Click the NEXUS Alert extension icon in Chrome toolbar
2. Ensure you're on the **Monitor** tab
3. Check 2-3 locations
4. Make sure status shows "Monitoring"
5. Right-click the popup → **Inspect**
6. DevTools opens — dock it to the side or bottom
7. In DevTools, press **Cmd+Shift+P** (Mac) or **Ctrl+Shift+P** (Windows)
8. Type "screenshot" and select **"Capture node screenshot"**
9. Click the popup `<html>` element in the Elements panel
10. Save as `screenshot-1-monitor.png`

**Alternative method:**
1. Open popup
2. Press **Cmd+Shift+M** to enable Device Toolbar
3. Set dimensions to 1280×800
4. Click **⋮** → "Capture screenshot"

**Caption for Chrome Web Store:**
```
Monitor multiple enrollment centers in real time
```

---

## Screenshot 2: Live Slots Found

**What to show:**
- Extension popup open
- 2-3 available slot cards visible
- Each card showing:
  - Date (e.g., "Wed, Mar 20")
  - Time (e.g., "10:30 AM")
  - Location (e.g., "Blaine, WA")
  - Green "Book" button
- Cards have green left border

**How to capture:**

If you don't have live slots currently, you can **simulate** them:

1. Open `popup.js` in your editor
2. Add test slot data at the top of `displaySlots()` function:
   ```javascript
   // TEST DATA - Remove before production
   slots = [
     {
       locationId: 5020,
       locationName: 'Blaine, WA',
       date: '2025-03-20',
       time: '10:30 AM'
     },
     {
       locationId: 5183,
       locationName: 'Pacific Highway, BC',
       date: '2025-03-21',
       time: '2:15 PM'
     }
   ];
   ```
3. Reload extension (chrome://extensions → reload button)
4. Open popup
5. Capture screenshot (same method as Screenshot 1)
6. Save as `screenshot-2-slots-found.png`
7. **Remove test data before deploying**

**Caption for Chrome Web Store:**
```
See available slots instantly and book with one click
```

---

## Screenshot 3: Slots Tab — History & Statistics

**What to show:**
- Extension popup open
- **Slots** tab active
- Stats cards at top showing:
  - Total slots seen
  - Slots seen today
  - Number of locations monitored
- Slot history list below with dates/times

**How to capture:**

1. Click the NEXUS Alert extension icon
2. Click the **Slots** tab
3. If no history, add test data to `chrome.storage.local`:
   - Open DevTools Console
   - Run:
     ```javascript
     chrome.storage.local.set({
       slotHistory: [
         { locationName: 'Blaine, WA', date: '2025-03-20', time: '10:30 AM', timestamp: Date.now() - 3600000 },
         { locationName: 'Pacific Highway, BC', date: '2025-03-21', time: '2:15 PM', timestamp: Date.now() - 7200000 },
         { locationName: 'Blaine, WA', date: '2025-03-22', time: '9:00 AM', timestamp: Date.now() - 10800000 }
       ]
     }, () => console.log('Test data added'));
     ```
   - Reload popup
4. Capture screenshot
5. Save as `screenshot-3-slots-history.png`

**Caption for Chrome Web Store:**
```
Track slot history and spot patterns
```

---

## Screenshot 4: Settings Tab

**What to show:**
- Extension popup open
- **Settings** tab active
- Check interval selector (1, 3, 5, 10 minutes)
- Sound alert toggle (ON)
- Auto-open booking page toggle
- Premium upgrade section visible (if implemented)

**How to capture:**

1. Click the NEXUS Alert extension icon
2. Click the **Settings** tab
3. Ensure toggles are in a readable state (some ON, some OFF)
4. Capture screenshot
5. Save as `screenshot-4-settings.png`

**Caption for Chrome Web Store:**
```
Customize alerts, sounds, and check frequency
```

---

## Screenshot 5: Desktop Notification

**What to show:**
- Chrome desktop notification showing:
  - Title: "NEXUS Slot Available!"
  - Body: Location name, date, and time
  - Action button: "Book Now"

**How to capture:**

1. Trigger a test notification from the extension:
   - Open DevTools Console
   - Run:
     ```javascript
     chrome.notifications.create('test-notification', {
       type: 'basic',
       iconUrl: 'icons/icon128.png',
       title: 'NEXUS Slot Available!',
       message: 'Blaine, WA - Wed, Mar 20 at 10:30 AM',
       buttons: [{ title: 'Book Now' }],
       requireInteraction: true
     });
     ```
2. Notification appears in top-right corner (macOS) or system tray (Windows)
3. Take screenshot quickly:
   - **macOS:** Press **Cmd+Shift+5** → Capture Selected Portion
   - **Windows:** Press **Win+Shift+S** → Snip notification area
4. Crop to include only the notification box
5. Save as `screenshot-5-notification.png`

**Caption for Chrome Web Store:**
```
Get notified the instant a slot opens up
```

---

## Post-Capture: Resize & Optimize

### Resize to Exact Dimensions

If screenshots are not exactly 1280×800 or 640×400:

**Using ImageMagick (Mac/Linux):**
```bash
brew install imagemagick

# Resize to 1280×800
convert screenshot-1-monitor.png -resize 1280x800! screenshot-1-monitor-resized.png
```

**Using Preview (macOS):**
1. Open image in Preview
2. Tools → Adjust Size
3. Width: 1280, Height: 800
4. Uncheck "Scale proportionally"
5. Click OK
6. Save

**Using GIMP (Free, cross-platform):**
1. Open image in GIMP
2. Image → Scale Image
3. Width: 1280, Height: 800
4. Click "Scale"
5. File → Export As → PNG

### Optimize File Size

Chrome Web Store has a **5 MB per image** limit, but smaller is better:

```bash
# Using ImageMagick
convert screenshot.png -quality 85 screenshot-optimized.png

# Or use online tools:
# - https://tinypng.com/
# - https://squoosh.app/
```

---

## Final Checklist

Before uploading to Chrome Web Store:

- [ ] All 5 screenshots captured
- [ ] All screenshots are exactly **1280×800** or **640×400** pixels
- [ ] File format is **PNG**
- [ ] File size is under **5 MB** each
- [ ] Images are clear and readable
- [ ] No sensitive data visible (email addresses, personal info)
- [ ] Screenshots are in order (1-5)
- [ ] Captions match the content
- [ ] Test data removed from code

---

## Screenshot File Names (Final)

Rename your screenshots for organization:

```
store-assets/
├── marquee-1400x560.png          (Promotional — Large)
├── small-tile-440x280.png        (Promotional — Small)
├── screenshot-1-monitor.png       (Extension — Monitor tab)
├── screenshot-2-slots-found.png   (Extension — Live slots)
├── screenshot-3-slots-history.png (Extension — History)
├── screenshot-4-settings.png      (Extension — Settings)
└── screenshot-5-notification.png  (Extension — Notification)
```

---

## Uploading to Chrome Web Store

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click your extension item
3. Scroll to **"Product media"**
4. Click **"Add item"** under Screenshots
5. Upload screenshots **in order** (1-5)
6. Add captions (copy from this guide)
7. Upload promotional images:
   - Small tile: `small-tile-440x280.png`
   - Marquee: `marquee-1400x560.png`
8. Click **"Save draft"**

---

## Troubleshooting

**Problem:** Screenshots are blurry or pixelated
**Solution:** Use Chrome DevTools capture method, ensure deviceScaleFactor is 1 or 2

**Problem:** Can't capture notification screenshot fast enough
**Solution:** Use `requireInteraction: true` in notification options to keep it visible

**Problem:** Extension popup is too small/large
**Solution:** Use Chrome DevTools Device Toolbar to set exact dimensions

**Problem:** Colors look different in screenshots
**Solution:** Use PNG format (not JPEG), ensure color profile is sRGB

---

## Need Help?

- Chrome Web Store screenshot requirements: https://developer.chrome.com/docs/webstore/images/
- Chrome DevTools screenshot guide: https://developer.chrome.com/docs/devtools/device-mode/

---

**Ready to submit!** Follow `SUBMISSION-CHECKLIST.md` for the complete process.
