# Cross-Browser Compatibility Testing Guide

## Overview

NEXUS Alert extension has been optimized for cross-browser compatibility with Chrome, Firefox, Safari, and Edge. This guide covers testing procedures, known differences, and troubleshooting.

---

## Supported Browsers

| Browser | Version | Manifest V3 | Status |
|---------|---------|-------------|---------|
| **Chrome** | 109+ | ✅ Full support | Primary |
| **Edge** | 109+ | ✅ Full support | Primary |
| **Firefox** | 109+ | ✅ Full support | Primary |
| **Safari** | 16.4+ | ⚠️  Partial | Limited |

---

## Build Instructions

### Build for All Browsers

```bash
node scripts/build-cross-browser.js
```

This generates:
- `dist/chrome/` + `nexus-alert-chrome.zip`
- `dist/firefox/` + `nexus-alert-firefox.zip`
- `dist/edge/` + `nexus-alert-edge.zip`
- `dist/safari/` + `nexus-alert-safari.zip`

### Build for Specific Browser

```bash
node scripts/build-cross-browser.js firefox
node scripts/build-cross-browser.js safari
```

---

## Testing Procedures

### 1. Chrome Testing

**Load unpacked extension:**
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `dist/chrome/` directory

**Test checklist:**
- ✅ Extension installs without errors
- ✅ Background service worker starts
- ✅ Popup opens and displays correctly
- ✅ Notifications work (desktop + sound)
- ✅ Alarms fire correctly
- ✅ Storage persists across restarts
- ✅ Offscreen audio playback works
- ✅ Badge updates correctly
- ✅ Onboarding flow works

---

### 2. Firefox Testing

**Load temporary add-on:**
1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Navigate to `dist/firefox/` and select `manifest.json`

**Known Firefox differences:**
- ⚠️  Background uses `scripts` instead of `service_worker`
- ⚠️  No offscreen API (audio plays in background directly)
- ⚠️  Notification buttons not supported
- ⚠️  `requireInteraction` not supported
- ⚠️  Minimum alarm interval: 1 minute (vs 0.1 min in Chrome)

**Test checklist:**
- ✅ Extension installs without errors
- ✅ Background script starts
- ✅ Popup opens and displays correctly
- ✅ Notifications work (basic, no buttons)
- ✅ Alarms fire correctly (≥ 1 min intervals)
- ✅ Storage persists across restarts
- ✅ Audio playback works (background Audio element)
- ✅ Badge updates correctly
- ✅ Onboarding flow works

**Firefox-specific testing:**
```bash
# Install web-ext for better testing
npm install -g web-ext

# Run in Firefox with auto-reload
cd dist/firefox
web-ext run --firefox-binary="/Applications/Firefox.app/Contents/MacOS/firefox"

# Lint the extension
web-ext lint
```

---

### 3. Edge Testing

**Load unpacked extension:**
1. Open `edge://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `dist/edge/` directory

**Edge compatibility:**
- ✅ Uses same manifest as Chrome (Chromium-based)
- ✅ All Chrome features work identically
- ✅ May have different sync storage if user uses Microsoft account

**Test checklist:** Same as Chrome

---

### 4. Safari Testing

**Convert to Safari extension:**

Safari requires additional conversion steps using Xcode:

```bash
# 1. Convert web extension to Safari format
xcrun safari-web-extension-converter dist/safari --app-name "NEXUS Alert"

# 2. Open the generated Xcode project
open "NEXUS Alert/NEXUS Alert.xcodeproj"

# 3. Build and run from Xcode
```

**Known Safari limitations:**
- ⚠️  No offscreen API
- ⚠️  More restrictive storage quotas (5MB vs 10MB)
- ⚠️  Extension must be signed for distribution
- ⚠️  Requires macOS/iOS Developer Program membership ($99/year)
- ⚠️  Different update mechanism (App Store)

**Test checklist:**
- ✅ Extension installs via Xcode
- ✅ Background script starts
- ✅ Popup opens and displays correctly
- ✅ Notifications work
- ✅ Storage persists
- ✅ Audio playback works
- ⚠️  Test storage limits (5MB cap)

---

## API Compatibility Matrix

| Feature | Chrome | Firefox | Edge | Safari |
|---------|--------|---------|------|--------|
| Service Worker | ✅ | ❌ | ✅ | ❌ |
| Background Scripts | ❌ | ✅ | ❌ | ✅ |
| Offscreen API | ✅ | ❌ | ✅ | ❌ |
| Notification Buttons | ✅ | ❌ | ✅ | ✅ |
| Require Interaction | ✅ | ❌ | ✅ | ✅ |
| Alarms (< 1 min) | ✅ | ❌ | ✅ | ✅ |
| Badge | ✅ | ✅ | ✅ | ✅ |
| Storage Quota | 10MB | 10MB | 10MB | 5MB |
| Audio Playback | Offscreen | Background | Offscreen | Background |

---

## CSS Rendering Tests

Test these visual elements across all browsers:

### Layout Tests
- ✅ Popup dimensions: 380px wide, 500px+ height
- ✅ Scrolling works smoothly
- ✅ Flexbox layouts render correctly
- ✅ Grid layouts (if any) render correctly

### Typography Tests
- ✅ Fonts load correctly (`-apple-system`, `Inter`, `Segoe UI`)
- ✅ Font smoothing applied
- ✅ Line heights consistent
- ✅ Text truncation works (ellipsis)

### Form Element Tests
- ✅ Input fields styled consistently
- ✅ Checkboxes render correctly
- ✅ Radio buttons render correctly
- ✅ Select dropdowns work
- ✅ Date/time pickers work (native or polyfill)
- ✅ Focus states visible

### Animation Tests
- ✅ Transitions smooth
- ✅ Loading spinners work
- ✅ Hover effects work
- ✅ Respects `prefers-reduced-motion`

### Color Tests
- ✅ Dark mode colors consistent
- ✅ Contrast ratios meet WCAG AA
- ✅ Borders visible
- ✅ Badge colors correct

---

## Automated Testing

### Visual Regression Tests

```bash
# Install dependencies
npm install -D puppeteer playwright

# Run visual tests across browsers
npm run test:visual
```

### Functional Tests

```bash
# Run cross-browser functional tests
npm run test:browsers
```

---

## Troubleshooting

### Firefox: Alarms not firing frequently enough
**Issue:** Firefox enforces 1-minute minimum alarm interval
**Fix:** Applied in `browser-polyfill.js` — premium users on Firefox get 1-min minimum instead of Chrome's sub-minute polling

### Firefox: Notifications don't have buttons
**Issue:** Firefox doesn't support notification buttons or `requireInteraction`
**Fix:** Applied in `background.js` — buttons only shown on Chrome/Edge

### Safari: Storage quota exceeded
**Issue:** Safari has 5MB limit (vs 10MB on other browsers)
**Fix:** Monitor storage usage and implement cleanup for Safari builds

### Safari: Audio doesn't play
**Issue:** Offscreen API not available
**Fix:** Use `Audio` element in background script (applied in `audio-player.js`)

### Edge: Sync storage conflicts
**Issue:** Edge users may have different sync data than Chrome
**Fix:** Use local storage for critical data, sync for preferences only

---

## Distribution Channels

### Chrome Web Store
- Upload: `nexus-alert-chrome.zip`
- Review time: ~1-3 days
- Auto-updates: Yes

### Firefox Add-ons (AMO)
- Upload: `nexus-alert-firefox.zip`
- Review time: ~1-7 days
- Auto-updates: Yes
- Command: `web-ext sign --api-key=... --api-secret=...`

### Edge Add-ons
- Upload: `nexus-alert-edge.zip` (or reuse Chrome zip)
- Review time: ~1-3 days
- Auto-updates: Yes

### Safari App Store
- Requires Xcode project
- Review time: ~1-7 days
- Requires Developer Program membership
- Manual updates via App Store releases

---

## Browser-Specific Analytics

Track browser usage via analytics:

```javascript
// Send browser info with events
trackEvent('extension_loaded', {
  browser: BROWSER,
  version: chrome.runtime.getManifest().version
});
```

Monitor which browsers users prefer to prioritize compatibility work.

---

## Continuous Testing

### Pre-release Checklist
- [ ] Build all browser packages
- [ ] Load test in Chrome
- [ ] Load test in Firefox
- [ ] Load test in Edge
- [ ] Visual regression tests pass
- [ ] Functional tests pass
- [ ] No console errors in any browser
- [ ] Performance benchmarks meet targets
- [ ] Storage usage under limits
- [ ] Notifications work
- [ ] Audio playback works

### Post-release Monitoring
- Monitor error rates by browser (Sentry)
- Track feature usage by browser (analytics)
- Monitor store reviews for browser-specific complaints
- Check for new browser version incompatibilities

---

## Resources

- [Chrome Extensions Docs](https://developer.chrome.com/docs/extensions/)
- [Firefox Extensions Docs](https://extensionworkshop.com/)
- [Safari Extensions Docs](https://developer.apple.com/documentation/safariservices/safari_web_extensions)
- [Edge Extensions Docs](https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/)
- [web-ext CLI](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/)
- [Browser Extension API Compatibility](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs)
