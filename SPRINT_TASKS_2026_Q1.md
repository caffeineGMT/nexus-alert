# NEXUS Alert - Sprint Tasks 2026 Q1
## Product Quality & Growth Initiative

**Generated**: 2026-03-18
**Objective**: Continuous self-improvement focused on quality, UX, and customer retention
**Status**: Ready for execution

---

## 🚨 TIER 1: SHIP BLOCKERS (2-3 days)
*Must fix before public launch or risk legal/security incidents*

### Task 1.1: Fix Chrome Web Store Install Link
**Priority**: CRITICAL
**Impact**: Primary CTA is broken → Zero conversions
**Files**: `web/src/app/page.tsx`, `web/src/app/components/InstallButton.tsx`
**Action**:
- Replace all `EXTENSION_ID` placeholders with actual Chrome Web Store ID
- Add environment variable: `NEXT_PUBLIC_EXTENSION_ID`
- Add fallback URL to /install-guide if ID not set
- Verify links work on production

**Test**: Click "Add to Chrome" button → should open Chrome Web Store listing

---

### Task 1.2: Implement GDPR/CCPA Analytics Consent
**Priority**: CRITICAL
**Impact**: Currently ILLEGAL in EU/CA → €20M fine risk
**Files**: `web/src/app/layout.tsx`, `popup.js`, `background.js`
**Action**:
- Add cookie consent banner (use react-cookie-consent)
- Store consent preference in localStorage + chrome.storage.local
- Only load Facebook Pixel, Google Ads, Plausible AFTER consent
- Add "Privacy Settings" link in footer
- Update privacy policy with cookie disclosure

**Test**: Visit site → should see consent banner. Decline → no tracking scripts loaded.

---

### Task 1.3: Fix CORS Wildcard Security Vulnerability
**Priority**: CRITICAL
**Impact**: Malicious sites can steal user data
**Files**: `backend/src/worker.js`
**Action**:
```javascript
const allowedOrigins = [
  'https://nexus-alert.com',
  'https://www.nexus-alert.com',
  'chrome-extension://EXTENSION_ID_HERE'
];
const origin = request.headers.get('Origin');
const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
const corsHeaders = {
  'Access-Control-Allow-Origin': corsOrigin,
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization'
};
```

**Test**: Try API call from random domain → should be blocked

---

### Task 1.4: Add API Rate Limiting
**Priority**: CRITICAL
**Impact**: Currently vulnerable to DDoS, spam signups
**Files**: `backend/src/worker.js`, `backend/src/rateLimit.js` (new)
**Action**:
- Use Cloudflare KV to track request counts per IP
- Limit: 10 requests/minute per IP for `/api/subscribe`, `/api/checkout`
- Limit: 60 requests/hour per IP for all endpoints combined
- Return 429 with Retry-After header
- Log rate limit violations for monitoring

**Test**: Make 11 rapid requests to /api/subscribe → should get 429 error

---

### Task 1.5: Replace Hardcoded Sentry DSN
**Priority**: HIGH
**Impact**: All production errors are invisible
**Files**: `background.js`
**Action**:
- Sign up for Sentry.io account (free tier fine for start)
- Create "NEXUS Alert Extension" project
- Copy DSN to environment variable
- Replace placeholder at line 9 with actual DSN
- Test by triggering error: `throw new Error('Test error')`
- Verify error appears in Sentry dashboard

**Test**: Force an error → should appear in Sentry within 30s

---

## 💰 TIER 2: REVENUE CRITICAL (1 week)
*Direct impact on customer acquisition and retention*

### Task 2.1: Build User Onboarding Email Sequence
**Priority**: HIGH
**Impact**: 40% of installs never complete setup → wasted CAC
**Files**: `backend/src/handlers/emailDrip.js`, ConvertKit/Resend
**Action**:
- Day 0 (immediate): Welcome email with setup video + direct link to extension
- Day 1: "Haven't set up yet? Here's what you're missing" + case study
- Day 3: "How NEXUS Alert works" + FAQ
- Day 7: "Upgrade for 2-min checks" + social proof
- Day 14: "Users find slots in 4.2 days on average" + testimonial
- Trigger on `/api/subscribe` call
- Add unsubscribe link (required by CAN-SPAM)

**KPI**: Increase Day-7 active users from ~30% to 50%

---

### Task 2.2: Implement Churn Prevention System
**Priority**: HIGH
**Impact**: Users cancel immediately after booking → LTV < $10
**Files**: `backend/src/handlers/churn.js` (exists but not integrated)
**Action**:
- Detect "appointment booked" event (user stops monitoring for 3+ days)
- Send email: "Found your appointment? Help a friend!" + referral CTA
- Offer 50% off next 2 months to stay subscribed for family alerts
- Add "pause subscription" option (instead of cancel)
- Track: % of churners who convert 1+ referrals

**KPI**: Reduce churn rate from 60% to 35% post-appointment

---

### Task 2.3: Add Input Validation & XSS Protection
**Priority**: HIGH
**Impact**: Security vulnerability + poor data quality
**Files**: `popup.js:209-212`, `onboarding.js:258`, `backend/src/worker.js`
**Action**:
```javascript
// Frontend validation
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const noXSS = !/<|>|script|javascript:/i.test(email);
  return regex.test(email) && noXSS;
}

// Backend validation (belt-and-suspenders)
if (!isValidEmail(body.email)) {
  return json({ error: 'Invalid email format' }, 400, corsHeaders);
}
```
- Sanitize all user inputs before storage
- Add CSP header to manifest.json
- Test with: `<script>alert(1)</script>@test.com`

**Test**: Try to submit malicious email → should be rejected with clear error

---

### Task 2.4: Create OG Image for Social Sharing
**Priority**: MEDIUM
**Impact**: Broken social previews → 40% lower CTR
**Files**: `web/public/og-image.png`, `web/src/app/layout.tsx`
**Action**:
- Design 1200x630px image with:
  - NEXUS Alert logo
  - Value prop: "Get alerted instantly when NEXUS/Global Entry slots open"
  - Social proof: "Join 10,000+ travelers"
  - Trust badge: Chrome Web Store rating
- Use Figma or Canva
- Save as /web/public/og-image.png
- Update layout.tsx metadata:
```tsx
openGraph: {
  images: [{
    url: 'https://nexus-alert.com/og-image.png',
    width: 1200,
    height: 630,
    alt: 'NEXUS Alert - Appointment Slot Finder'
  }]
}
```

**Test**: Share URL on Twitter/Facebook → should show image preview

---

### Task 2.5: Add SEO Essentials (robots.txt + sitemap)
**Priority**: HIGH
**Impact**: Poor search visibility → lost organic traffic
**Files**: `web/public/robots.txt`, `web/src/app/sitemap.ts`
**Action**:
- Create `/web/public/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://nexus-alert.com/sitemap.xml
```
- Verify sitemap.ts generates all pages (already exists, just verify)
- Submit sitemap to Google Search Console
- Add structured data for FAQ and Reviews

**Test**: Visit /robots.txt and /sitemap.xml → should load correctly

---

## ♿ TIER 3: ACCESSIBILITY & UX (1.5 weeks)
*WCAG compliance + better user experience*

### Task 3.1: Add Keyboard Navigation to Extension Popup
**Priority**: HIGH
**Impact**: Violates WCAG Level A, excludes disabled users
**Files**: `popup.html`, `popup.js`
**Action**:
- Make all checkboxes, buttons, tabs keyboard accessible
- Add tabindex="0" to location items
- Handle Enter/Space key on custom elements:
```javascript
item.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    checkbox.checked = !checkbox.checked;
    checkbox.dispatchEvent(new Event('change'));
  }
});
```
- Test with Tab, Shift+Tab, Enter, Space

**Test**: Navigate entire popup using only keyboard → all features work

---

### Task 3.2: Add ARIA Labels for Screen Readers
**Priority**: HIGH
**Impact**: Screen reader users cannot use extension
**Files**: `popup.html`, `onboarding.html`
**Action**:
- Add role, aria-label, aria-checked to all toggles:
```html
<label class="toggle-switch" role="switch" aria-label="Enable monitoring" aria-checked="true">
  <input type="checkbox" id="enableToggle" checked>
  <span class="toggle-slider"></span>
</label>
```
- Add aria-live="polite" to status messages
- Add aria-describedby for form hints
- Test with VoiceOver (Mac) or NVDA (Windows)

**Test**: Use screen reader → all controls announced correctly

---

### Task 3.3: Fix Color Contrast Issues
**Priority**: MEDIUM
**Impact**: Fails WCAG AA, hard to read for vision-impaired
**Files**: `popup.html:16` (CSS variables)
**Action**:
- Change `--text-muted: #888` → `--text-muted: #999` (7.8:1 ratio)
- Add outline to all interactive elements:
```css
button:focus, input:focus, .tab-item:focus, .location-item:focus {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```
- Test with Chrome DevTools Color Contrast checker

**Test**: Use Lighthouse accessibility audit → should pass all contrast checks

---

### Task 3.4: Improve Mobile Responsiveness
**Priority**: MEDIUM
**Impact**: Poor mobile experience on landing page
**Files**: `web/src/app/page.tsx`, `web/tailwind.config.js`
**Action**:
- Add hamburger menu for mobile nav (<768px)
- Fix popup width: change `width: 380px` → `width: 100%; max-width: 380px; min-width: 280px`
- Test on iPhone SE (375px), iPhone 14 (390px), Android (360px)
- Add viewport meta tag if missing
- Use Next.js `<Image>` with responsive sizes

**Test**: Open on mobile device → all content visible without horizontal scroll

---

### Task 3.5: Add Loading States and Skeletons
**Priority**: LOW
**Impact**: Jarring UX during location load
**Files**: `popup.js:90-94`, `onboarding.js:67`
**Action**:
- Replace spinner with skeleton loader:
```html
<div class="skeleton-locations">
  <div class="skeleton-item"></div>
  <div class="skeleton-item"></div>
  <div class="skeleton-item"></div>
</div>
```
```css
.skeleton-item {
  height: 60px;
  background: linear-gradient(90deg, #141414 25%, #1a1a1a 50%, #141414 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 6px;
  margin-bottom: 8px;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

**Test**: Switch programs → should see smooth skeleton animation

---

## 🛠️ TIER 4: TECHNICAL DEBT (3-4 weeks)
*Foundation for long-term scalability*

### Task 4.1: Add Comprehensive Error Handling
**Priority**: MEDIUM
**Files**: `background.js`, `popup.js`, `backend/src/worker.js`
**Action**:
- Differentiate error types (network, 404, 500, timeout)
- Show user-friendly messages:
  - Network error: "Check your internet connection"
  - 404: "Enrollment center not found"
  - 500: "Service temporarily unavailable"
- Add retry logic with exponential backoff
- Send critical errors to Sentry

---

### Task 4.2: Implement Stripe Webhook Idempotency
**Priority**: HIGH
**Files**: `backend/src/worker.js` (webhook handler)
**Action**:
- Add idempotency key to all Stripe API calls:
```javascript
await stripe.subscriptions.update(subId, { ... }, {
  idempotencyKey: `webhook_${event.id}`
});
```
- Store processed webhook IDs in KV (expire after 24h)
- Skip processing if already seen

---

### Task 4.3: Add Security Headers
**Priority**: MEDIUM
**Files**: `backend/src/worker.js`, `web/next.config.js`
**Action**:
- Add to worker responses:
```javascript
'X-Content-Type-Options': 'nosniff',
'X-Frame-Options': 'DENY',
'X-XSS-Protection': '1; mode=block',
'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
```
- Add CSP to Next.js:
```javascript
headers: async () => [{
  source: '/:path*',
  headers: [{
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; ..."
  }]
}]
```

---

### Task 4.4: Build Testing Infrastructure
**Priority**: MEDIUM
**Files**: `tests/`, `vitest.config.js`
**Action**:
- Add unit tests for critical functions:
  - `filterSlots` (date ranges, location matching)
  - `hashEmail` (referral code generation)
  - `validatePromoCode`
- Add integration tests for API endpoints:
  - `/api/subscribe` (success, validation errors)
  - `/api/checkout` (Stripe session creation)
  - Webhook handler (signature verification)
- Add Playwright E2E tests:
  - Install extension → setup → receive notification
  - Landing page → click CTA → redirects to store
- Target: 70% coverage for business logic
- Run in CI on every commit

---

### Task 4.5: Add Performance Monitoring
**Priority**: MEDIUM
**Files**: `web/src/app/layout.tsx`, `backend/src/worker.js`
**Action**:
- Add Vercel Speed Insights to web app
- Add Cloudflare Analytics to worker
- Track Core Web Vitals (LCP, FID, CLS)
- Set up alerts for:
  - Page load time > 3s
  - API response time > 500ms
  - Error rate > 1%
- Add `/api/metrics` endpoint for health dashboard

---

### Task 4.6: Implement Data Encryption for PII
**Priority**: HIGH
**Files**: `backend/src/worker.js`, `backend/src/crypto.js` (new)
**Action**:
- Encrypt email addresses in KV storage
- Use Web Crypto API:
```javascript
async function encryptEmail(email, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(email)
  );
  return { encrypted: arrayBufferToBase64(encrypted), iv: arrayBufferToBase64(iv) };
}
```
- Store encryption key in Cloudflare Secret
- Decrypt only when needed (sending emails)

---

### Task 4.7: Add Monitoring Dashboard
**Priority**: MEDIUM
**Files**: `web/src/app/admin/metrics/page.tsx` (already exists, needs data)
**Action**:
- Display real-time metrics:
  - Total subscribers (free vs paid)
  - MRR and ARR
  - Daily active users (last 7 days)
  - Conversion rate (install → paid)
  - Churn rate by cohort
  - Top enrollment centers by activity
  - Referral conversion rate
- Require admin authentication
- Auto-refresh every 30s
- Add export to CSV button

---

### Task 4.8: Implement Feature Flags
**Priority**: LOW
**Files**: `backend/src/featureFlags.js`, `web/src/hooks/useFeatureFlag.ts`
**Action**:
- Store flags in Cloudflare KV:
```json
{
  "sms_alerts_enabled": true,
  "referral_program_active": true,
  "annual_plan_discount": 0.2
}
```
- Add admin UI to toggle flags
- Use in code:
```javascript
if (await getFeatureFlag('sms_alerts_enabled', env)) {
  // send SMS
}
```

---

### Task 4.9: Add Localization (i18n)
**Priority**: LOW
**Files**: `web/src/i18n/`, `popup/_locales/`
**Action**:
- Add Spanish and French translations
- Use next-intl for web app
- Use Chrome i18n API for extension
- Translate:
  - Landing page (all copy)
  - Extension popup UI
  - Email templates
  - Error messages
- Test with native speakers

---

### Task 4.10: Create Incident Response Runbook
**Priority**: MEDIUM
**Files**: `docs/RUNBOOK.md`
**Action**:
Document procedures for:
- CBP API outage → switch to polling fallback, notify users
- Stripe webhook failures → manual subscription activation
- Email delivery failures → switch to backup provider (Mailgun)
- Extension store rejection → appeal process + backup distribution plan
- Security incident → user notification timeline, data breach protocol
- Include on-call rotation schedule
- Add status page URL (e.g., status.nexus-alert.com)

---

## 📊 SUCCESS METRICS

Track these KPIs to measure impact:

### User Acquisition
- **Install Rate**: Click-to-install conversion (target: 25%)
- **Setup Completion**: % who configure location within 24h (target: 60%)
- **Activation**: % who enable monitoring (target: 80%)

### Engagement
- **DAU/MAU Ratio**: Daily active / Monthly active users (target: 40%)
- **Avg Time to First Slot**: Days between install and first notification (target: <5)
- **Notification CTR**: % who click notification to book (target: 85%)

### Revenue
- **Free→Paid Conversion**: % who upgrade within 30 days (target: 8%)
- **MRR Growth**: Month-over-month (target: +30%)
- **LTV/CAC Ratio**: Lifetime value / Customer acquisition cost (target: >3)
- **Churn Rate**: Monthly cancellations (target: <5%)

### Quality
- **Error Rate**: Sentry errors per 1000 sessions (target: <10)
- **Lighthouse Score**: Performance + Accessibility (target: 90+)
- **Uptime**: API availability (target: 99.9%)

---

## 🚀 EXECUTION PLAN

### Week 1: Ship Blockers
- Fix install links
- GDPR consent
- CORS security
- Rate limiting
- Sentry setup

### Week 2: Revenue Critical
- Onboarding emails
- Churn prevention
- XSS fixes
- OG image
- SEO basics

### Week 3: Accessibility
- Keyboard nav
- ARIA labels
- Color contrast
- Mobile responsive
- Loading states

### Week 4-6: Technical Debt
- Error handling
- Webhook idempotency
- Testing infrastructure
- Monitoring
- Encryption
- Feature flags

---

## 📝 NOTES

- All tasks include test requirements — don't mark complete without testing
- Focus on user-facing improvements over internal refactoring
- Revenue tasks have highest ROI — prioritize those after ship blockers
- Get external accessibility audit after Tier 3 complete
- Consider hiring contractor for i18n (Tier 4.9) to save time

**Next Review**: 2026-04-15 (reassess priorities based on metrics)
