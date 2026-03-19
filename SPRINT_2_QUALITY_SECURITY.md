# SPRINT 2: Quality & Security (Week 2)
**Goal:** Production-ready quality and comprehensive testing
**Duration:** 3 days (~21 hours)
**Depends On:** Sprint 1 complete + deployed

---

## Task 1: Set Up Playwright E2E Tests
**Priority:** P1 🟠
**Time:** 8 hours
**Impact:** Prevent regressions in critical flows

### Steps
1. **Install Playwright:**
   ```bash
   cd /Users/michaelguo/nexus-alert
   npm install -D @playwright/test playwright-chromium
   npx playwright install chromium
   ```

2. **Create test structure:**
   ```
   /tests/e2e/
   ├── extension.spec.ts       # Extension flows
   ├── landing-page.spec.ts    # Landing page flows
   ├── checkout.spec.ts        # Payment flows
   └── helpers/
       └── fixtures.ts         # Reusable test data
   ```

3. **Write critical path tests:**

   **`/tests/e2e/extension.spec.ts`:**
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Extension Install Flow', () => {
     test('should complete onboarding successfully', async ({ page, context }) => {
       // Load extension
       const pathToExtension = './dist/';
       const extensionContext = await context.newPage();

       // Navigate to onboarding
       await extensionContext.goto('chrome-extension://[ID]/onboarding.html');

       // Step 1: Select location
       await extensionContext.click('[data-testid="location-blaine"]');
       await extensionContext.click('[data-testid="add-location-btn"]');

       // Step 2: Set date range
       await extensionContext.fill('[data-testid="date-start"]', '2026-04-01');
       await extensionContext.fill('[data-testid="date-end"]', '2026-06-30');

       // Step 3: Complete onboarding
       await extensionContext.click('[data-testid="finish-onboarding"]');

       // Verify redirect to popup
       await expect(extensionContext).toHaveURL(/popup\.html/);
       await expect(extensionContext.locator('text=Blaine')).toBeVisible();
     });

     test('should trigger notification when slot found', async ({ page }) => {
       // Mock CBP API to return a slot
       await page.route('**/schedulerapi/slots*', route => {
         route.fulfill({
           status: 200,
           body: JSON.stringify([{
             locationId: 5020,
             startTimestamp: '2026-04-15T10:00',
             endTimestamp: '2026-04-15T10:30',
             active: true
           }])
         });
       });

       // Trigger check
       await page.click('[data-testid="check-now-btn"]');

       // Wait for notification (browser permission must be granted)
       // Note: Playwright can't test actual browser notifications,
       // but we can verify the notification API was called
       const notificationCalls = await page.evaluate(() => {
         return window.__notificationCalls || [];
       });

       expect(notificationCalls.length).toBeGreaterThan(0);
     });
   });
   ```

   **`/tests/e2e/landing-page.spec.ts`:**
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Landing Page Conversion Flow', () => {
     test('should load landing page in < 3s', async ({ page }) => {
       const startTime = Date.now();
       await page.goto('https://nexus-alert.com');
       const loadTime = Date.now() - startTime;

       expect(loadTime).toBeLessThan(3000);
       await expect(page.locator('h1')).toContainText('NEXUS Appointment Tracker');
     });

     test('should navigate to Chrome Web Store on CTA click', async ({ page, context }) => {
       await page.goto('https://nexus-alert.com');

       // Click primary CTA
       const [newPage] = await Promise.all([
         context.waitForEvent('page'),
         page.click('text=Add to Chrome — Free')
       ]);

       // Verify Chrome Web Store URL
       expect(newPage.url()).toContain('chrome.google.com/webstore');
     });

     test('should show email capture form', async ({ page }) => {
       await page.goto('https://nexus-alert.com');

       const emailInput = page.locator('input[type="email"]');
       await emailInput.fill('test@example.com');
       await page.click('button:has-text("Notify Me")');

       // Verify success message
       await expect(page.locator('text=Thanks for subscribing')).toBeVisible();
     });
   });
   ```

   **`/tests/e2e/checkout.spec.ts`:**
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Premium Checkout Flow', () => {
     test('should complete Stripe checkout (test mode)', async ({ page }) => {
       await page.goto('https://nexus-alert.com/#pricing');

       // Click "Upgrade to Premium"
       await page.click('[data-testid="premium-cta"]');

       // Wait for Stripe Checkout redirect
       await page.waitForURL(/checkout\.stripe\.com/);

       // Fill Stripe test card
       const cardInput = page.frameLocator('iframe').locator('[name="cardnumber"]');
       await cardInput.fill('4242424242424242');

       const expiryInput = page.frameLocator('iframe').locator('[name="exp-date"]');
       await expiryInput.fill('12/30');

       const cvcInput = page.frameLocator('iframe').locator('[name="cvc"]');
       await cvcInput.fill('123');

       // Submit payment
       await page.click('button:has-text("Subscribe")');

       // Verify success redirect
       await page.waitForURL(/nexus-alert\.com.*success/);
       await expect(page.locator('text=Welcome to Premium')).toBeVisible();
     });
   });
   ```

4. **Configure Playwright** (`playwright.config.ts`):
   ```typescript
   import { defineConfig, devices } from '@playwright/test';

   export default defineConfig({
     testDir: './tests/e2e',
     fullyParallel: true,
     retries: process.env.CI ? 2 : 0,
     workers: process.env.CI ? 1 : undefined,
     reporter: 'html',
     use: {
       baseURL: 'http://localhost:3000',
       trace: 'on-first-retry',
       screenshot: 'only-on-failure',
     },

     projects: [
       {
         name: 'chromium',
         use: { ...devices['Desktop Chrome'] },
       },
       {
         name: 'mobile',
         use: { ...devices['iPhone 13'] },
       },
     ],

     webServer: {
       command: 'npm run dev',
       url: 'http://localhost:3000',
       reuseExistingServer: !process.env.CI,
     },
   });
   ```

5. **Add npm scripts** (`package.json`):
   ```json
   "scripts": {
     "test:e2e": "playwright test",
     "test:e2e:ui": "playwright test --ui",
     "test:e2e:debug": "playwright test --debug"
   }
   ```

6. **Run tests:**
   ```bash
   npm run test:e2e
   ```

### Success Criteria
- ✅ All 5+ critical flows tested
- ✅ Tests pass on both desktop and mobile
- ✅ Test coverage > 80% for critical paths
- ✅ CI/CD integration ready

---

## Task 2: Add Lighthouse CI
**Priority:** P1 🟠
**Time:** 3 hours
**Impact:** Catch performance regressions early

### Steps
1. **Install Lighthouse CI:**
   ```bash
   cd /Users/michaelguo/nexus-alert
   npm install -D @lhci/cli
   ```

2. **Create config** (`lighthouserc.json`):
   ```json
   {
     "ci": {
       "collect": {
         "url": [
           "http://localhost:3000/",
           "http://localhost:3000/how-it-works",
           "http://localhost:3000/blog"
         ],
         "numberOfRuns": 3,
         "settings": {
           "preset": "desktop",
           "onlyCategories": ["performance", "accessibility", "best-practices", "seo"]
         }
       },
       "assert": {
         "preset": "lighthouse:recommended",
         "assertions": {
           "categories:performance": ["error", {"minScore": 0.9}],
           "categories:accessibility": ["error", {"minScore": 0.95}],
           "categories:best-practices": ["error", {"minScore": 0.9}],
           "categories:seo": ["error", {"minScore": 0.95}],
           "first-contentful-paint": ["error", {"maxNumericValue": 1500}],
           "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
           "interactive": ["error", {"maxNumericValue": 3500}],
           "total-blocking-time": ["error", {"maxNumericValue": 300}]
         }
       },
       "upload": {
         "target": "temporary-public-storage"
       }
     }
   }
   ```

3. **Create GitHub Action** (`.github/workflows/lighthouse.yml`):
   ```yaml
   name: Lighthouse CI
   on:
     push:
       branches: [main]
     pull_request:
       branches: [main]

   jobs:
     lighthouse:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3

         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '20'
             cache: 'npm'

         - name: Install dependencies
           run: |
             cd web
             npm ci

         - name: Build Next.js
           run: |
             cd web
             npm run build

         - name: Run Lighthouse CI
           run: |
             cd web
             npm install -g @lhci/cli
             lhci autorun
           env:
             LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

         - name: Upload Lighthouse results
           uses: actions/upload-artifact@v3
           if: always()
           with:
             name: lighthouse-results
             path: web/.lighthouseci
   ```

4. **Add npm script:**
   ```json
   "scripts": {
     "lighthouse": "lhci autorun"
   }
   ```

5. **Run locally:**
   ```bash
   cd /Users/michaelguo/nexus-alert/web
   npm run build
   npm run lighthouse
   ```

### Success Criteria
- ✅ Performance score > 90
- ✅ Accessibility score > 95
- ✅ SEO score > 95
- ✅ LCP < 2.5s, FCP < 1.5s, TBT < 300ms

---

## Task 3: Fix Sentry Config Deprecations
**Priority:** P2 🔵
**Time:** 1 hour
**Technical Debt:** Low

### Steps
1. **Update `web/next.config.ts`** (from Sprint 1 Task 1 if not done):
   ```typescript
   export default withSentryConfig(withNextIntl(nextConfig), {
     silent: true,
     org: "nexus-alert",
     project: "web",

     // NEW: Webpack-specific options
     webpack: {
       widenClientFileUpload: true,
       hideSourceMaps: true,
       automaticVercelMonitors: true,
       treeshake: {
         removeDebugLogging: true
       }
     }

     // REMOVE: Top-level deprecated options
     // widenClientFileUpload: true,
     // disableLogger: true,
     // hideSourceMaps: true,
     // automaticVercelMonitors: true,
   });
   ```

2. **Verify no warnings:**
   ```bash
   cd /Users/michaelguo/nexus-alert/web
   npm run build 2>&1 | grep -i "DEPRECATION"
   # Should return nothing
   ```

### Success Criteria
- ✅ Zero Sentry deprecation warnings
- ✅ Build completes successfully
- ✅ Source maps still uploaded to Sentry

---

## Task 4: Add Request Timeout Protection
**Priority:** P1 🟠
**Time:** 2 hours
**Risk:** Worker timeout (10s Cloudflare limit)

### Steps
1. **Create timeout wrapper** (`/backend/src/utils/timeout.js`):
   ```javascript
   export async function withTimeout(promise, timeoutMs, errorMessage) {
     let timeoutHandle;

     const timeoutPromise = new Promise((_, reject) => {
       timeoutHandle = setTimeout(() => {
         reject(new Error(errorMessage || `Operation timed out after ${timeoutMs}ms`));
       }, timeoutMs);
     });

     try {
       const result = await Promise.race([promise, timeoutPromise]);
       clearTimeout(timeoutHandle);
       return result;
     } catch (err) {
       clearTimeout(timeoutHandle);
       throw err;
     }
   }
   ```

2. **Apply to CBP API calls** (`/backend/src/worker.js`):
   ```javascript
   import { withTimeout } from './utils/timeout.js';

   async function checkLocation(locationId, config) {
     const url = `${SLOTS_ENDPOINT}?locationId=${locationId}&limit=500`;

     try {
       const response = await withTimeout(
         fetch(url),
         8000, // 8 second timeout (leave 2s for processing)
         `CBP API timeout for location ${locationId}`
       );

       if (!response.ok) {
         throw new Error(`CBP API error: ${response.status}`);
       }

       return await response.json();
     } catch (err) {
       if (err.message.includes('timeout')) {
         // Log timeout but don't crash - just skip this location
         console.warn(`Timeout checking location ${locationId}, will retry next cycle`);
         return [];
       }
       throw err;
     }
   }
   ```

3. **Add timeout to email sending:**
   ```javascript
   async function sendEmailNotification(email, slots, env) {
     await withTimeout(
       sendEmail(email, slots, env),
       5000,
       'Email send timeout'
     );
   }
   ```

4. **Test timeout handling:**
   ```javascript
   // Add to tests/backend/timeout.test.js
   test('should timeout slow CBP API calls', async () => {
     // Mock slow API
     const slowFetch = () => new Promise(resolve =>
       setTimeout(() => resolve({ ok: true, json: () => [] }), 10000)
     );

     await expect(
       withTimeout(slowFetch(), 1000, 'Test timeout')
     ).rejects.toThrow('Test timeout');
   });
   ```

### Success Criteria
- ✅ All external API calls have timeouts
- ✅ Timeouts set below Cloudflare Worker limit (< 10s)
- ✅ Timeout errors logged but don't crash worker
- ✅ Tests verify timeout behavior

---

## Task 5: Implement CSP Headers
**Priority:** P1 🟠
**Time:** 2 hours
**Security:** XSS prevention

### Steps
1. **Update `web/next.config.ts` headers:**
   ```typescript
   headers: async () => [
     {
       source: '/(.*)',
       headers: [
         { key: 'X-Content-Type-Options', value: 'nosniff' },
         { key: 'X-Frame-Options', value: 'DENY' },
         { key: 'X-XSS-Protection', value: '1; mode=block' },
         { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
         { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },

         // NEW: Content Security Policy
         {
           key: 'Content-Security-Policy',
           value: [
             "default-src 'self'",
             "script-src 'self' 'unsafe-inline' 'unsafe-eval' plausible.io connect.facebook.net www.googletagmanager.com client.crisp.chat",
             "style-src 'self' 'unsafe-inline'",
             "img-src 'self' data: https:",
             "font-src 'self' data:",
             "connect-src 'self' plausible.io api.nexus-alert.com www.facebook.com *.sentry.io client.crisp.chat",
             "frame-src checkout.stripe.com",
             "media-src 'self'",
             "object-src 'none'",
             "base-uri 'self'",
             "form-action 'self' checkout.stripe.com",
             "frame-ancestors 'none'",
             "upgrade-insecure-requests"
           ].join('; ')
         }
       ],
     },
   ],
   ```

2. **Test CSP doesn't break functionality:**
   ```bash
   # After deploying
   # Open DevTools → Console → Should see NO CSP violations
   # If violations appear, add domains to whitelist
   ```

3. **Add CSP reporting** (optional but recommended):
   ```typescript
   // Add to CSP header
   "report-uri https://api.nexus-alert.com/api/csp-report"

   // Add handler in backend/src/worker.js
   'POST /api/csp-report': async (req, env, cors, sentry) => {
     const report = await req.json();
     sentry.captureMessage('CSP Violation', {
       level: 'warning',
       extra: report
     });
     return new Response(null, { status: 204 });
   }
   ```

### Success Criteria
- ✅ CSP header set on all pages
- ✅ No console errors from CSP violations
- ✅ All third-party scripts whitelisted
- ✅ CSP report endpoint receives violations (if implemented)

---

## Task 6: Set Up Bundle Size Monitoring
**Priority:** P2 🔵
**Time:** 2 hours
**Impact:** Prevent bundle bloat

### Steps
1. **Configure Bundle Analyzer** (`web/next.config.ts`):
   ```typescript
   import bundleAnalyzer from '@next/bundle-analyzer';

   const withBundleAnalyzer = bundleAnalyzer({
     enabled: process.env.ANALYZE === 'true',
   });

   export default withSentryConfig(
     withBundleAnalyzer(withNextIntl(nextConfig)),
     sentryOptions
   );
   ```

2. **Add npm script:**
   ```json
   "scripts": {
     "analyze": "ANALYZE=true npm run build"
   }
   ```

3. **Create bundle size budget** (`web/.bundlesizerc.json`):
   ```json
   {
     "files": [
       {
         "path": ".next/static/chunks/**/*.js",
         "maxSize": "200kb"
       },
       {
         "path": ".next/static/css/**/*.css",
         "maxSize": "50kb"
       }
     ]
   }
   ```

4. **Install bundlesize:**
   ```bash
   cd /Users/michaelguo/nexus-alert/web
   npm install -D bundlesize
   ```

5. **Add to CI** (`.github/workflows/bundle-size.yml`):
   ```yaml
   name: Bundle Size Check
   on: [pull_request]

   jobs:
     bundlesize:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Setup Node
           uses: actions/setup-node@v3
           with:
             node-version: '20'
         - name: Install dependencies
           run: cd web && npm ci
         - name: Build
           run: cd web && npm run build
         - name: Check bundle size
           run: cd web && npx bundlesize
   ```

6. **Run analyzer locally:**
   ```bash
   cd /Users/michaelguo/nexus-alert/web
   npm run analyze
   # Opens browser with bundle visualization
   ```

### Success Criteria
- ✅ Bundle analyzer configured
- ✅ Bundle size budgets defined
- ✅ CI fails if bundle size exceeds budget
- ✅ Can visualize bundle composition

---

## Task 7: Add Automated Accessibility Tests
**Priority:** P2 🔵
**Time:** 3 hours
**Compliance:** WCAG 2.1 AA

### Steps
1. **Install axe-core:**
   ```bash
   cd /Users/michaelguo/nexus-alert
   npm install -D @axe-core/playwright
   ```

2. **Create accessibility test** (`tests/e2e/accessibility.spec.ts`):
   ```typescript
   import { test, expect } from '@playwright/test';
   import AxeBuilder from '@axe-core/playwright';

   test.describe('Accessibility Audit', () => {
     test('landing page should have no a11y violations', async ({ page }) => {
       await page.goto('https://nexus-alert.com');

       const accessibilityScanResults = await new AxeBuilder({ page })
         .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
         .analyze();

       expect(accessibilityScanResults.violations).toEqual([]);
     });

     test('pricing page should have no a11y violations', async ({ page }) => {
       await page.goto('https://nexus-alert.com/#pricing');

       const accessibilityScanResults = await new AxeBuilder({ page })
         .withTags(['wcag2a', 'wcag2aa'])
         .analyze();

       expect(accessibilityScanResults.violations).toEqual([]);
     });

     test('blog pages should have no a11y violations', async ({ page }) => {
       await page.goto('https://nexus-alert.com/blog');

       const accessibilityScanResults = await new AxeBuilder({ page })
         .withTags(['wcag2a', 'wcag2aa'])
         .analyze();

       expect(accessibilityScanResults.violations).toEqual([]);
     });
   });
   ```

3. **Add to Lighthouse config** (already checks a11y, but verify):
   ```json
   "settings": {
     "onlyCategories": ["accessibility"],
     "emulatedFormFactor": "desktop"
   }
   ```

4. **Run accessibility tests:**
   ```bash
   npm run test:e2e -- accessibility.spec.ts
   ```

5. **Fix any violations** that appear.

### Success Criteria
- ✅ Zero axe-core violations on all pages
- ✅ Lighthouse accessibility score > 95
- ✅ Automated tests run on every PR
- ✅ WCAG 2.1 AA compliant

---

## Sprint 2 Completion Checklist

- [ ] Task 1: Playwright E2E tests (5+ critical flows) ✅
- [ ] Task 2: Lighthouse CI configured (scores > 90/95) 📊
- [ ] Task 3: Sentry config updated (no deprecations) 🛠️
- [ ] Task 4: Request timeouts implemented (< 10s) ⏱️
- [ ] Task 5: CSP headers set (no violations) 🔒
- [ ] Task 6: Bundle size monitoring (budgets enforced) 📦
- [ ] Task 7: Accessibility tests (zero violations) ♿

---

*Sprint 2 Tasks Generated: March 19, 2026*
*Estimated Completion: 3 days*
*Next Sprint: Sprint 3 - Conversion Optimization*
