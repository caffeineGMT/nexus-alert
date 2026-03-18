# Chrome Web Store Screenshot Instructions

The Chrome Web Store requires **1-5 screenshots** at either **1280x800** or **640x400** pixels.

You must capture these screenshots from the actual running extension to show real functionality.

## How to Capture Screenshots

### Method 1: Using Chrome DevTools (Recommended)

1. Load the extension in Chrome (`chrome://extensions` → Load unpacked)
2. Click the extension icon to open the popup
3. Right-click inside the popup and select **Inspect**
4. In DevTools, click the **Device Toolbar** icon (or press `Cmd+Shift+M`)
5. Set dimensions to **1280x800**
6. Click the **⋮** menu → **Capture screenshot**

### Method 2: Using macOS Screenshot Tool

1. Open the extension popup
2. Press `Cmd+Shift+5` to open screenshot tool
3. Select "Capture Selected Portion"
4. Drag to select the popup area
5. Click **Capture**

### Method 3: Using Third-Party Tools

- **Cleanshot X** (macOS)
- **Snagit** (Windows/macOS)
- **ShareX** (Windows)

---

## Required Screenshots (5 total)

### Screenshot 1: Monitor Tab — Location Selection
**Filename:** `1-monitor-locations.png`

**What to show:**
- Monitor tab active
- NEXUS program selected
- At least 3 enrollment centers checked (Blaine, Pacific Highway, Niagara Falls)
- Status bar showing "Monitoring" with green dot
- Date filters optionally set

**Caption for Web Store:**
```
Monitor multiple enrollment centers in real time
```

---

### Screenshot 2: Available Slots Found
**Filename:** `2-slots-found.png`

**What to show:**
- Monitor tab with 2-3 live slot cards visible
- Green-bordered slot cards showing dates and times
- "Book" buttons on each slot
- Different location names visible
- Badge showing slot count (e.g., "3" on extension icon)

**How to generate slots:**
- Run `npm run dev` in backend/ to start local API
- OR temporarily modify `checkLocation()` in background.js to return mock slots

**Caption for Web Store:**
```
See available slots instantly and book with one click
```

---

### Screenshot 3: Settings Tab — Premium Plan
**Filename:** `3-settings-premium.png`

**What to show:**
- Settings tab active
- Check interval options displayed (1, 3, 5, 10 min)
- Free tier notice visible: "Free plan checks every 30 min. Upgrade to unlock."
- Premium upgrade card showing:
  - Email input field
  - "Upgrade — $4.99/mo" button
  - Benefit list (✓ Check every 2 minutes, ✓ Email notifications, ✓ SMS alerts)
- Sound alert toggle ON
- Auto-open booking toggle

**Caption for Web Store:**
```
Free tier: 30-min checks. Premium: 2-min checks + email alerts.
```

---

### Screenshot 4: Onboarding — Location Selection (Step 2)
**Filename:** `4-onboarding-step2.png`

**What to show:**
- Onboarding page (onboarding.html) open in full browser tab
- Step 2/3 active (step indicator dots at top)
- Program tabs showing NEXUS selected
- Location list with checkboxes
- At least 3 locations visible
- "Next" and "Back" buttons at bottom

**How to capture:**
1. Uninstall extension (or clear storage)
2. Reinstall to trigger onboarding
3. Click through to Step 2
4. Resize browser to 1280x800
5. Capture screenshot

**Caption for Web Store:**
```
Quick 3-step onboarding — choose locations and notification preferences
```

---

### Screenshot 5: Desktop Notification
**Filename:** `5-notification.png`

**What to show:**
- Chrome desktop notification visible on screen
- Notification shows:
  - Title: "NEXUS Slot Available!"
  - Body: Location name and date/time
  - "Book Now" button
  - Extension icon (bell)

**How to trigger:**
1. Open extension popup
2. Click "Check Now"
3. Modify `notifyNewSlots()` in background.js to force a notification:
   ```js
   chrome.notifications.create('demo-slot', {
     type: 'basic',
     iconUrl: 'icons/icon128.png',
     title: 'NEXUS Slot Available!',
     message: 'Blaine, WA\nWed, Mar 20 at 10:30 AM',
     priority: 2,
     requireInteraction: true,
     buttons: [{ title: 'Book Now' }],
   });
   ```
4. Capture the notification on your screen

**Caption for Web Store:**
```
Get instant desktop notifications with sound when slots open up
```

---

## Additional Assets

### Promotional Images

#### Small Tile (440x280)
**Filename:** `small-tile-440x280.png`

**How to generate:**
1. Open `store-assets/small-tile-440x280.html` in Chrome
2. Set browser window to exactly 440x280 pixels
3. Capture screenshot (Cmd+Shift+5 on macOS)
4. Save as PNG

#### Marquee (1400x560)
**Filename:** `marquee-1400x560.png`

**How to generate:**
1. Open `store-assets/marquee-1400x560.html` in Chrome
2. Set browser window to exactly 1400x560 pixels
3. Capture screenshot
4. Save as PNG

---

## Final Checklist

- [ ] All 5 screenshots captured at 1280x800 or 640x400
- [ ] Screenshots show real functionality (not mockups)
- [ ] Small tile image (440x280) generated
- [ ] Marquee image (1400x560) generated
- [ ] All images are PNG format
- [ ] File sizes under 5MB each
- [ ] Images are clear, well-lit, and readable

---

## Image Optimization

Before uploading, optimize images:

```bash
# Install imagemagick (macOS)
brew install imagemagick

# Optimize screenshots (reduce file size without quality loss)
convert 1-monitor-locations.png -quality 85 1-monitor-locations.png
convert 2-slots-found.png -quality 85 2-slots-found.png
convert 3-settings-premium.png -quality 85 3-settings-premium.png
convert 4-onboarding-step2.png -quality 85 4-onboarding-step2.png
convert 5-notification.png -quality 85 5-notification.png
convert small-tile-440x280.png -quality 85 small-tile-440x280.png
convert marquee-1400x560.png -quality 85 marquee-1400x560.png
```

Or use online tools:
- https://tinypng.com/
- https://squoosh.app/
