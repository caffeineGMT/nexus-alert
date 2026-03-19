# SPRINT PLAN - ITERATION 2: Critical Bug Fixes & Production Readiness
**Created:** March 19, 2026
**Target Revenue:** $1M ARR
**Focus:** Fix production blockers, improve UX/performance, ship to Chrome Web Store

---

## 🔴 CRITICAL PRODUCTION BLOCKERS (P0)

### **1. Fix Turbopack Build Failure**
**Status:** 🔴 BLOCKING DEPLOYMENT
**Impact:** Cannot deploy to production
**Issue:** `server-reference-manifest.json` panic during Next.js build
**Root Cause:** Turbopack bug with API routes + testimonials/submit endpoint
**Fix:**
- Remove/relocate `/api/testimonials/submit/route.ts` causing the panic
- Migrate to Cloudflare Worker endpoint instead
- OR downgrade to webpack build config temporarily
- Verify build passes with `npm run build`

**Files:**
- `/web/src/app/api/testimonials/submit/route.ts` (remove)
- `/backend/src/worker.js` (add testimonials endpoint)
- `/web/next.config.ts` (add webpack fallback if needed)

**Testing:**
```bash
cd web && npm run build
# Must complete with 0 errors
```

**Priority:** P0 - Complete by EOD
**Estimate:** 2 hours

---

### **2. Replace EXTENSION_ID Placeholder**
**Status:** 🔴 BLOCKS CHROME WEB STORE LAUNCH
**Impact:** All CTA buttons broken, cannot launch
**Occurrences:** 10 files, 15+ instances

**Files to update:**
- `/web/src/app/page.tsx` (3 instances)
- `/web/src/app/global-entry/page.tsx` (3 instances)
- `/web/src/app/sentri/page.tsx` (3 instances)
- `/web/src/app/nexus/page.tsx` (3 instances)
- `/web/src/app/ph/page.tsx` (2 instances)
- `/web/src/app/components/PricingSection.tsx` (1 instance)

**Implementation:**
1. Get real Chrome Web Store extension ID after publishing
2. Create env var `NEXT_PUBLIC_CWS_EXTENSION_ID`
3. Replace all hardcoded TODOs with `process.env.NEXT_PUBLIC_CWS_EXTENSION_ID`
4. Add fallback for development mode

**Priority:** P0 - Required before Chrome Web Store launch
**Estimate:** 1 hour

---

### **3. Fix Next.js Config Warnings**
**Status:** 🟠 DEGRADED PERFORMANCE
**Impact:** Security headers not applied, middleware deprecated warning

**Issues:**
1. `headers` ignored with `output: export`
2. `middleware.ts` deprecated → rename to `proxy.ts`
3. Multiple lockfiles warning

**Fixes:**
```typescript
// next.config.ts
export default withSentryConfig(withNextIntl({
  output: "export",
  images: { unoptimized: true },
  // Remove headers (doesn't work with static export)
  // Add Cloudflare Workers for headers instead
  turbopack: {
    root: process.cwd() // Fix lockfile warning
  }
}));
```

**Priority:** P0
**Estimate:** 1 hour

---

## 🟠 HIGH-IMPACT UX IMPROVEMENTS (P1)

### **4. Add Loading & Not-Found States**
**Status:** 🟠 MISSING
**Impact:** Poor UX during navigation, broken pages show blank screen

**Missing files:**
- `/web/src/app/loading.tsx` (global loading)
- `/web/src/app/not-found.tsx` (404 page)
- `/web/src/app/blog/loading.tsx`
- `/web/src/app/blog/[slug]/not-found.tsx`

**Implementation:**
```tsx
// app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3b82f6]" />
    </div>
  );
}

// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#3b82f6] mb-4">404</h1>
        <p className="text-xl text-[#888] mb-8">Page not found</p>
        <a href="/" className="px-6 py-3 bg-[#3b82f6] text-white rounded-lg">
          Back to Home
        </a>
      </div>
    </div>
  );
}
```

**Priority:** P1
**Estimate:** 1.5 hours

---

### **5. Fix Testimonial Submission Flow**
**Status:** 🟠 INCOMPLETE FEATURE
**Impact:** User submissions lost, no feedback, no Premium rewards sent

**Current state:**
- `console.log()` only, no persistence
- No user feedback after submit
- No Premium code generation
- No email notifications

**Implementation:**
1. Move endpoint to Cloudflare Worker (fixes build issue too)
2. Store in Cloudflare D1 database
3. Send confirmation email via Resend
4. Generate Premium reward code
5. Add success toast notification

**Files:**
- `/backend/src/worker.js` (add `/testimonials` endpoint)
- `/backend/wrangler.toml` (add D1 binding)
- `/web/src/app/components/TestimonialForm.tsx` (add toast)

**Priority:** P1 - Required for social proof
**Estimate:** 3 hours

---

### **6. Add PWA Manifest**
**Status:** 🟠 MISSING
**Impact:** Cannot "Add to Home Screen", poor mobile UX

**Create:** `/web/public/manifest.json`
```json
{
  "name": "NEXUS Alert - Appointment Tracker",
  "short_name": "NEXUS Alert",
  "description": "Monitor NEXUS, Global Entry, and SENTRI appointment slots 24/7",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**Also add:**
- `<link rel="manifest" href="/manifest.json">` to layout
- Generate 192x192 and 512x512 icons
- Add service worker for offline support (optional)

**Priority:** P1
**Estimate:** 2 hours

---

## 🔵 PERFORMANCE OPTIMIZATIONS (P2)

### **7. Bundle Size Reduction & Code Splitting**
**Status:** 🔵 NEEDS OPTIMIZATION
**Impact:** Slow initial load, poor Lighthouse scores

**Current state:**
- 634MB `node_modules` in web
- No bundle analyzer
- No lazy loading for below-fold
- Recharts library is 200KB

**Optimizations:**
1. Add Next.js Bundle Analyzer
```bash
npm install @next/bundle-analyzer
```

2. Lazy load heavy components
```tsx
// Already done:
const ActivityFeed = dynamic(() => import('./components/ActivityFeed'));
const Testimonials = dynamic(() => import('./components/Testimonials'));

// Add more:
const PricingSection = dynamic(() => import('./components/PricingSection'));
const Leaflet = dynamic(() => import('react-leaflet'), { ssr: false });
```

3. Replace Recharts with lightweight alternative
4. Enable SWC minification
5. Tree-shake unused Next-Intl locales

**Target:**
- Initial JS bundle: < 150KB gzipped
- Lighthouse Performance: > 90
- First Contentful Paint: < 1.2s

**Priority:** P2
**Estimate:** 4 hours

---

### **8. Add Performance Monitoring**
**Status:** 🔵 MISSING
**Impact:** Cannot measure/improve Core Web Vitals

**Implementation:**
1. Enable Vercel Analytics
```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

2. Add custom performance tracking
3. Track Largest Contentful Paint (LCP)
4. Track Cumulative Layout Shift (CLS)
5. Track First Input Delay (FID)

**Priority:** P2
**Estimate:** 2 hours

---

## 🟣 ACCESSIBILITY FIXES (P2)

### **9. WCAG 2.1 AA Compliance Audit**
**Status:** 🔵 PARTIAL COMPLIANCE
**Impact:** Legal risk, excludes users with disabilities

**Issues found:**
1. Skip-to-content link only on homepage (not blog, pricing pages)
2. Comparison table missing `<th scope="row">` for row headers
3. Form validation errors not announced to screen readers
4. Color contrast may be insufficient (need audit)
5. No focus indicators on custom components
6. SVG icons missing `aria-label` or `aria-hidden`

**Fixes:**
1. Add skip links to all pages
2. Fix table semantics
```tsx
<th scope="row" className="text-left">{feature}</th>
```
3. Add ARIA live regions for form errors
```tsx
<div role="alert" aria-live="polite">
  {error && <p className="text-red-500">{error}</p>}
</div>
```
4. Run axe-core automated tests
5. Manual keyboard navigation testing

**Priority:** P2
**Estimate:** 3 hours

---

### **10. Add Comprehensive Test Coverage**
**Status:** 🔵 MINIMAL TESTING
**Impact:** Regressions slip to production, low confidence

**Current coverage:**
- Extension: 1 test file (background.test.js)
- Backend: 4 test files
- Landing page: 0 tests
- Total: ~5% coverage

**Add tests:**
1. Extension E2E tests
```javascript
// tests/popup.test.js - Test popup UI
// tests/notifications.test.js - Test notification flow
// tests/slot-filtering.test.js - Test date/time filtering
```

2. Landing page tests
```typescript
// web/src/app/__tests__/page.test.tsx
// web/src/app/components/__tests__/PricingSection.test.tsx
```

3. API integration tests
```javascript
// backend/tests/testimonials.test.js
// backend/tests/stripe-webhooks.test.js
```

4. Accessibility tests
```javascript
// web/src/__tests__/accessibility.test.ts - Run axe-core
```

**Target:** 60%+ code coverage
**Priority:** P2
**Estimate:** 6 hours

---

## 📊 TASK SUMMARY

| Priority | Task | Estimate | Impact |
|----------|------|----------|--------|
| P0 | Fix Turbopack Build | 2h | 🔴 CRITICAL |
| P0 | Replace EXTENSION_ID | 1h | 🔴 CRITICAL |
| P0 | Fix Next.js Warnings | 1h | 🔴 CRITICAL |
| P1 | Loading/404 States | 1.5h | 🟠 HIGH |
| P1 | Testimonial Flow | 3h | 🟠 HIGH |
| P1 | PWA Manifest | 2h | 🟠 HIGH |
| P2 | Bundle Optimization | 4h | 🔵 MEDIUM |
| P2 | Performance Monitoring | 2h | 🔵 MEDIUM |
| P2 | Accessibility Fixes | 3h | 🔵 MEDIUM |
| P2 | Test Coverage | 6h | 🔵 MEDIUM |

**Total Effort:** ~25.5 hours (3-4 days)
**Team Size:** 4 engineers
**Timeline:** Complete within 2 days with parallel execution

---

## 🚀 EXECUTION PLAN

**Day 1 - Critical Path (P0)**
- Engineer A: Fix Turbopack build failure
- Engineer B: Replace EXTENSION_ID placeholders
- Engineer C: Fix Next.js config warnings
- Engineer D: Start testimonial flow implementation

**Day 2 - High-Impact UX (P1)**
- Engineer A: Add loading/404 states
- Engineer B: Complete testimonial flow
- Engineer C: Add PWA manifest
- Engineer D: Start bundle optimization

**Day 3 - Performance & Quality (P2)**
- All engineers: Divide remaining P2 tasks
- Run comprehensive testing
- Deploy to staging
- Final QA round

---

## 🎯 SUCCESS METRICS

- [ ] Build completes with 0 errors
- [ ] All CTA buttons link to real Chrome Web Store listing
- [ ] Lighthouse Performance score > 90
- [ ] Lighthouse Accessibility score > 95
- [ ] Test coverage > 60%
- [ ] No console errors on production
- [ ] Core Web Vitals in "Good" range
- [ ] PWA installable on mobile devices

---

## 🔗 DEPENDENCIES

1. **Chrome Web Store Listing** - Required before replacing EXTENSION_ID
2. **Cloudflare D1 Database** - Required for testimonials endpoint
3. **Vercel Analytics** - Requires Vercel Pro plan ($20/mo)
4. **Bundle Analyzer** - New npm package

---

## 📝 NOTES

- All P0 tasks are BLOCKING for revenue launch
- P1 tasks significantly improve conversion rates
- P2 tasks reduce churn and improve retention
- Focus on shipping working features over perfect code
- Run `npm run build` after every change to catch regressions early
