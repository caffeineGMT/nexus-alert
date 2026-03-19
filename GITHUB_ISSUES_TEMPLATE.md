# GitHub Issues - NEXUS Alert Critical Improvements

Copy each section below into a new GitHub issue.

---

## Issue #1: 🔴 P0 - Replace EXTENSION_ID Placeholder in All Install Links

**Priority:** P0 - CRITICAL
**Assignee:** Team Alpha
**Estimated Time:** 2 hours
**Labels:** `bug`, `critical`, `p0`, `revenue-blocker`

### Problem
All "Install" CTA buttons link to `https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID` which returns 404. This blocks 100% of conversions.

### Files Affected
- `web/src/app/page.tsx` (lines 69, 99)
- `web/src/app/global-entry/page.tsx` (3 instances)
- `web/src/app/sentri/page.tsx` (3 instances)
- `web/src/app/nexus/page.tsx`
- All blog posts (15+ files)

### Solution
1. Get actual Chrome Web Store extension ID from published listing
2. Run global find/replace:
```bash
find web/src/app -type f -name "*.tsx" -exec sed -i '' 's|EXTENSION_ID|ACTUAL_CHROME_STORE_ID_HERE|g' {} +
```
3. Verify all links work
4. Deploy to production immediately

### Success Criteria
- [ ] All install links redirect to live Chrome Web Store listing
- [ ] Plausible analytics shows >0 install clicks
- [ ] No 404 errors in Sentry

---

## Issue #2: 🔴 P0 - Configure Sentry Error Tracking

**Priority:** P0 - CRITICAL
**Assignee:** Team Alpha
**Estimated Time:** 1 hour
**Labels:** `bug`, `critical`, `p0`, `monitoring`

### Problem
Sentry DSN is hardcoded placeholder in `background.js:9`:
```javascript
dsn: 'https://REPLACE_WITH_YOUR_SENTRY_DSN@sentry.io/PROJECT_ID'
```
This means ZERO production errors are being tracked.

### Solution
1. Sign up for Sentry.io (free tier)
2. Create project "NEXUS Alert - Chrome Extension"
3. Get real DSN from Sentry dashboard
4. Replace placeholder in:
   - `background.js:9`
   - `backend/src/worker.js` (if Sentry.cloudflare is initialized)
5. Test by throwing intentional error
6. Verify error appears in Sentry dashboard

### Environment Variables Needed
```bash
# Add to Cloudflare Workers secrets
wrangler secret put SENTRY_DSN
```

### Success Criteria
- [ ] Real Sentry DSN configured in all files
- [ ] Test error captured in Sentry dashboard
- [ ] Error rate baseline established

---

## Issue #3: 🔴 P0 - Design and Replace Social Media OG Image

**Priority:** P0 - CRITICAL
**Assignee:** Team Alpha
**Estimated Time:** 3 hours
**Labels:** `design`, `critical`, `p0`, `seo`

### Problem
`web/src/app/layout.tsx:32` has TODO comment - using placeholder OG image. Social shares look unprofessional.

### Requirements
- **Dimensions:** 1200x630px (Facebook/Twitter standard)
- **Format:** PNG or JPEG
- **Content:**
  - NEXUS Alert logo
  - Tagline: "Find NEXUS Appointments in Days, Not Months"
  - Visual: Chrome extension icon or appointment calendar mockup
  - Brand colors: #3b82f6 (blue), #22c55e (green), #0a0a0a (dark bg)

### Solution
1. Design OG image in Figma or Canva
2. Export as `/web/public/og-image.png`
3. Optimize with TinyPNG (<100KB)
4. Update `layout.tsx:33` (already points to `/og-image.png`)
5. Test with:
   - Facebook Debugger: https://developers.facebook.com/tools/debug/
   - Twitter Card Validator: https://cards-dev.twitter.com/validator

### Success Criteria
- [ ] Professional OG image live at /og-image.png
- [ ] Facebook preview shows image correctly
- [ ] Twitter card shows image correctly
- [ ] LinkedIn preview shows image correctly

---

## Issue #4: 🟠 P1 - Accessibility Audit: Add 100+ ARIA Labels

**Priority:** P1 - HIGH
**Assignee:** Team Bravo
**Estimated Time:** 8 hours
**Labels:** `accessibility`, `a11y`, `p1`, `legal-risk`

### Problem
Only 3 ARIA/role/alt attributes in entire codebase. Fails WCAG 2.1 AA standards. ADA lawsuit risk.

### Current State
```bash
$ grep -r "aria-\|role=\|alt=" web/src/app/components/ | wc -l
3
```

### Requirements (WCAG 2.1 AA)
- All images need `alt` text
- All buttons need `aria-label`
- All forms need `aria-describedby` for errors
- All interactive elements need keyboard focus
- All icons need `aria-hidden="true"` or descriptive label

### Files to Fix
- `popup.html` - all buttons, toggles, tabs
- `web/src/app/components/PricingSection.tsx`
- `web/src/app/components/EmailCaptureForm.tsx`
- All blog posts (image alt text)

### Success Criteria
- [ ] 100+ accessibility attributes added
- [ ] Test with VoiceOver (macOS): `Cmd+F5`
- [ ] Test with NVDA (Windows)
- [ ] axe DevTools shows 0 critical issues
- [ ] Lighthouse accessibility score >90

---

## Issue #5: 🟠 P1 - Remove Debug Code from Production

**Priority:** P1 - HIGH
**Assignee:** Team Bravo
**Estimated Time:** 1 hour
**Labels:** `bug`, `performance`, `p1`, `security`

### Problem
6 `console.log()` statements in production code expose internal logic.

### Solution
```bash
# Remove all console.log statements
grep -rn "console\.log\|console\.warn\|debugger" background.js popup.js
# Manually review and remove each one
```

### Alternative: Use Build-Time Stripping
```javascript
// In build script
if (process.env.NODE_ENV === 'production') {
  // Strip all console.* calls
}
```

### Success Criteria
- [ ] Zero console.log in background.js
- [ ] Zero console.log in popup.js
- [ ] Chrome DevTools console clean when extension loaded

---

## Issue #6: 🟠 P1 - Add Error Handling to All Async Operations

**Priority:** P1 - HIGH
**Assignee:** Team Bravo
**Estimated Time:** 4 hours
**Labels:** `bug`, `reliability`, `p1`

### Problem
Only 4 try/catch blocks in critical code. Unhandled exceptions crash the extension.

### Requirements
Wrap ALL async operations:
- `chrome.storage.local.get()` - could fail if quota exceeded
- `fetch()` to CBP API - could timeout or return 500
- `chrome.notifications.create()` - could fail if permissions revoked
- `chrome.alarms.create()` - could fail silently

### Example Pattern
```javascript
// Before (crashes on error)
const data = await chrome.storage.local.get('config');

// After (graceful degradation)
try {
  const data = await chrome.storage.local.get('config');
  if (!data.config) throw new Error('Config missing');
  // Use data
} catch (err) {
  console.error('Failed to load config:', err);
  Sentry.captureException(err);
  // Fall back to defaults
  return DEFAULT_CONFIG;
}
```

### Success Criteria
- [ ] 20+ try/catch blocks added
- [ ] All error states show user-friendly messages
- [ ] Sentry captures all errors with context
- [ ] Extension never shows blank popup

---

## Issue #7: 🟠 P1 - Convert Images to WebP and Add Lazy Loading

**Priority:** P1 - HIGH
**Assignee:** Team Bravo
**Estimated Time:** 6 hours
**Labels:** `performance`, `seo`, `p1`

### Problem
- Zero WebP/AVIF images (using PNG/JPEG)
- Zero lazy loading attributes
- Page load LCP >3s on 3G

### Solution
1. Convert all images to WebP:
```bash
for img in web/public/**/*.{png,jpg}; do
  cwebp "$img" -o "${img%.*}.webp"
done
```

2. Use Next.js Image component:
```tsx
// Before
<img src="/hero.png" alt="NEXUS Alert" />

// After
import Image from 'next/image'
<Image
  src="/hero.webp"
  alt="NEXUS Alert"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

3. Add `fetchPriority="high"` to hero image

### Success Criteria
- [ ] All images converted to WebP with fallbacks
- [ ] Lazy loading on all below-fold images
- [ ] Lighthouse performance score >90
- [ ] LCP <2.5s on 3G

---

## Issue #8: 🟠 P1 - Optimize Bundle Sizes (Worker + CSS)

**Priority:** P1 - HIGH
**Assignee:** Team Bravo
**Estimated Time:** 6 hours
**Labels:** `performance`, `p1`, `cost-optimization`

### Problem
- `backend/src/worker.js` = 119KB (should be <100KB)
- CSS bundle = 65KB (should be <20KB)

### Solution: Worker.js Code Splitting
```javascript
// Split into modules
import { handleStripeWebhook } from './handlers/stripe.js';
import { handleEmailWebhook } from './handlers/email.js';

// Only import what's needed per route
if (url.pathname === '/api/webhook') {
  return await handleStripeWebhook(request, env);
}
```

### Solution: CSS Optimization
1. Run PurgeCSS to remove unused styles
2. Enable Brotli compression in Cloudflare
3. Inline critical CSS for above-fold content

### Success Criteria
- [ ] Worker.js <100KB
- [ ] CSS bundle <20KB
- [ ] Cloudflare cold start <50ms
- [ ] Time to First Byte <200ms

---

## Issue #9: 🟠 P1 - Fix Mobile Onboarding Responsive Breakpoints

**Priority:** P1 - HIGH
**Assignee:** Team Bravo
**Estimated Time:** 2 hours
**Labels:** `bug`, `mobile`, `p1`, `ux`

### Problem
`onboarding.html:24` has `min-width: 480px` - breaks on iPhone SE (375px width).

### Solution
```css
/* Change from */
body {
  min-width: 480px;
  max-width: 640px;
}

/* To */
body {
  min-width: 320px; /* Support iPhone SE */
  max-width: 640px;
  padding: 20px 16px;
}

@media (max-width: 480px) {
  .container {
    padding: 24px 16px;
  }
  h1 {
    font-size: 24px; /* Smaller on mobile */
  }
}
```

### Test Devices
- iPhone SE (375x667)
- iPhone 12 Pro (390x844)
- Samsung Galaxy S21 (360x800)

### Success Criteria
- [ ] No horizontal scroll on any device
- [ ] All buttons tappable (min 44x44px)
- [ ] Text readable without zoom
- [ ] Chrome DevTools mobile emulation passes

---

## Issue #10: 🟡 P2 - Add PWA Manifest and Service Worker

**Priority:** P2 - MEDIUM
**Assignee:** Team Charlie
**Estimated Time:** 8 hours
**Labels:** `feature`, `mobile`, `p2`, `retention`

### Problem
Missing `manifest.json` - mobile users can't "Add to Home Screen".

### Requirements
Create `/web/public/manifest.json`:
```json
{
  "name": "NEXUS Alert - Appointment Tracker",
  "short_name": "NEXUS Alert",
  "description": "Find NEXUS, Global Entry & SENTRI appointments fast",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker Features
- Cache landing page for offline viewing
- Pre-cache blog posts
- Network-first strategy for API calls

### Success Criteria
- [ ] manifest.json validates on https://web.dev/manifest/
- [ ] "Add to Home Screen" prompt appears on mobile
- [ ] Offline page works when disconnected
- [ ] Lighthouse PWA score >90

---

**(Continue with Issues #11-20 following same template...)**

---

## Deployment Checklist

After implementing all fixes:

- [ ] All P0 issues merged and deployed
- [ ] Smoke tests pass on production
- [ ] Sentry shows <1% error rate
- [ ] Lighthouse scores: Performance >90, Accessibility >95, SEO >95
- [ ] Mobile responsiveness tested on 5 devices
- [ ] Conversion funnel tested end-to-end
- [ ] Stripe payment flow tested with test cards
- [ ] Referral tracking verified
- [ ] Email drip campaigns triggered correctly

**Ship Date:** March 25, 2026
**Success Metric:** Conversion rate >5%, Error rate <1%, NPS >40
