# SPRINT PLAN — March 19-26, 2026
**Goal:** Fix production blockers, unblock B2B revenue, enable data-driven optimization

**Sprint Theme:** "Make It Ship, Make It Sell, Make It Scale"

---

## 📋 Sprint Backlog (10 High-Priority Tasks)

### **TASK 1: Fix Build System & Deploy to Production** ⚠️ P0
**Status:** ✅ COMPLETED
**Assigned:** Already fixed
**Deliverable:**
- ✅ Remove deprecated `experimental.instrumentationHook` from `next.config.ts`
- ✅ Update Sentry webpack config (replace `disableLogger` with `webpack.treeshake.removeDebugLogging`)
- ✅ Verify `npm run build` passes with zero errors
- 🔲 Commit & push to GitHub
- 🔲 Verify GitHub Pages staging deployment succeeds

**Acceptance Criteria:**
- Build completes in < 30 seconds
- Zero TypeScript errors
- Zero webpack warnings
- Lighthouse score > 90

**Estimated Time:** 1 hour
**Actual Time:** 30 minutes (completed)

---

### **TASK 2: Add Global Error Boundaries to Extension** 🐛 P0
**Status:** READY
**Assigned:** Dispatch engineer now
**Deliverable:**
1. Add try/catch wrapper to `popup.js` main initialization
2. Add global `window.onerror` handler in popup
3. Create error UI component (show friendly error message + reload button)
4. Add Sentry integration to popup (currently only in background.js)
5. Test error recovery flow (force crash, verify UI shows)

**Files to Modify:**
- `popup.js` (add error boundary)
- `popup.html` (add error UI div)
- `popup.css` (style error UI)
- `src/sentry.js` (export Sentry for popup)

**Acceptance Criteria:**
- Popup shows error UI instead of white screen when crash occurs
- User can click "Reload Extension" button to recover
- Errors logged to Sentry with user context (email, tier)
- Error rate < 0.5% in production

**Estimated Time:** 4 hours

---

### **TASK 3: Replace Chrome Web Store Placeholder URLs** 🚫 P0
**Status:** BLOCKED (need actual extension ID)
**Assigned:** CEO decision needed
**Deliverable:**
1. Publish extension to Chrome Web Store (if not done)
2. Get actual extension ID (format: `abcdefghijklmnopqrstuvwxyzabcdef`)
3. Replace all instances of `EXTENSION_ID` placeholder
4. Add environment variable `NEXT_PUBLIC_CHROME_EXTENSION_ID`
5. Update build script to validate extension ID is set

**Files to Modify:**
- `web/src/app/page.tsx` (4 instances on lines 119, 151, 394, 502)
- `web/.env.local` (add `NEXT_PUBLIC_CHROME_EXTENSION_ID`)
- `web/src/app/components/ChromeWebStoreButton.tsx` (create reusable component)

**Acceptance Criteria:**
- All Chrome Web Store links functional
- Clicking "Install Free" opens correct extension page
- No "EXTENSION_ID" text visible anywhere on site
- Google Search Console shows no 404 errors for extension links

**Estimated Time:** 2 hours (1 hour publish + 1 hour replace)

---

### **TASK 4: Implement API Rate Limiting** 💸 P0
**Status:** READY
**Assigned:** Dispatch engineer now
**Deliverable:**
1. Create KV-based rate limiter utility (IP-based)
2. Add rate limiting to public endpoints:
   - `POST /api/subscribe` → 5 requests/hour per IP
   - `POST /api/checkout` → 3 requests/hour per IP
   - `POST /api/activity` → 60 requests/hour per IP
   - `POST /api/waitlist` → 10 requests/hour per IP
3. Return 429 status with `Retry-After` header
4. Add rate limit monitoring (log to Sentry when limits hit)
5. Add bypass for known IPs (production backend, testing)

**Files to Create:**
- `backend/src/utils/rate-limiter.js`

**Files to Modify:**
- `backend/src/worker.js` (add rate limiting middleware)

**Implementation:**
```javascript
// backend/src/utils/rate-limiter.js
export async function checkRateLimit(ip, endpoint, limit, windowSeconds, env) {
  const key = `rate_limit:${endpoint}:${ip}`;
  const current = await env.NEXUS_ALERTS_KV.get(key);
  const count = current ? parseInt(current) : 0;

  if (count >= limit) {
    const ttl = await env.NEXUS_ALERTS_KV.getWithMetadata(key);
    const retryAfter = ttl.metadata?.expiresAt - Date.now();
    return { allowed: false, retryAfter: Math.ceil(retryAfter / 1000) };
  }

  await env.NEXUS_ALERTS_KV.put(key, String(count + 1), {
    expirationTtl: windowSeconds,
    metadata: { expiresAt: Date.now() + windowSeconds * 1000 }
  });

  return { allowed: true, remaining: limit - count - 1 };
}
```

**Acceptance Criteria:**
- Rate limits enforced on all public endpoints
- 429 responses include `Retry-After` header
- Sentry alert fires when rate limit abuse detected (> 1000 429s/hour)
- Costs do not spike under attack (verified via load test)

**Estimated Time:** 6 hours

---

### **TASK 5: Implement Analytics Event Tracking** 📊 P1
**Status:** READY
**Assigned:** Dispatch engineer now
**Deliverable:**
1. Configure Plausible custom events (no code changes needed in Plausible dashboard)
2. Add event tracking to frontend (using `next-plausible`)
3. Add event tracking to extension (using `background.js` trackEvent)
4. Track key conversion funnel events:
   - `extension_installed`
   - `email_captured`
   - `notification_received`
   - `booking_clicked`
   - `upgrade_clicked`
   - `checkout_started`
   - `checkout_completed`
   - `subscription_cancelled`
5. Add custom properties to events (tier, location_count, program)
6. Create Plausible dashboard with funnel visualization

**Events to Track:**
| Event | Location | Properties |
|-------|----------|------------|
| `extension_installed` | `background.js` onInstalled | `install_date` |
| `email_captured` | Landing page form | `source: hero/footer/popup` |
| `notification_sent` | `background.js` | `tier, program, location_count` |
| `booking_clicked` | Extension notification | `tier, slot_date` |
| `upgrade_viewed` | Popup | `trigger: banner/settings` |
| `checkout_started` | Website | `tier: premium/annual` |
| `checkout_completed` | Stripe webhook | `tier, amount` |
| `subscription_cancelled` | Stripe webhook | `tier, days_active` |

**Files to Modify:**
- `web/src/app/components/EmailCaptureForm.tsx` (add event on submit)
- `web/src/app/components/PricingSection.tsx` (add event on upgrade click)
- `background.js` (already has trackEvent, just needs more events)
- `popup.js` (add upgrade banner click tracking)

**Acceptance Criteria:**
- All 8 key events tracked in Plausible
- Events include custom properties
- Plausible funnel shows: Install → Email → Notification → Upgrade → Checkout
- Conversion rates calculated for each step
- Dashboard accessible to CEO

**Estimated Time:** 8 hours

---

### **TASK 6: Build B2B Lawyer Dashboard (MVP)** 🏢 P0 (Revenue Blocker)
**Status:** READY
**Assigned:** Dispatch engineer now
**Deliverable:**
1. Create lawyer authentication flow (separate from user auth)
2. Build lawyer dashboard page (`/lawyers/dashboard`)
3. Implement client management:
   - Add client (name, email, phone, NEXUS enrollment centers, date range)
   - View client list
   - Remove client
   - Bulk import (CSV upload)
4. Monitor all clients' appointment slots in one view
5. Send white-label notifications (from lawyer's email domain)
6. Basic analytics (clients monitored, notifications sent, bookings confirmed)
7. Create Stripe product for lawyer tier ($199/mo)
8. Add lawyer signup flow from `/lawyers` landing page

**Pages to Create:**
- `/lawyers/dashboard` (client overview)
- `/lawyers/clients/add` (add client form)
- `/lawyers/clients/[id]` (client detail view)
- `/lawyers/analytics` (reporting dashboard)
- `/lawyers/settings` (notification preferences, white-label config)

**Backend API Endpoints:**
- `POST /api/pro/clients` (add client) ✅ EXISTS
- `GET /api/pro/clients` (list clients) ✅ EXISTS
- `DELETE /api/pro/clients` (remove client) ✅ EXISTS
- `POST /api/pro/bulk-import` (CSV upload) → NEW
- `GET /api/pro/analytics` → NEW

**Database Schema (Cloudflare D1 or KV):**
```typescript
interface LawyerAccount {
  id: string;
  email: string;
  firmName: string;
  stripeCustomerId: string;
  whitelabelDomain?: string; // Optional: custom email domain
  clients: Client[];
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  programs: string[]; // ['NEXUS', 'Global Entry']
  locations: number[]; // CBP location IDs
  dateRange: { start: string; end: string };
  addedAt: number;
  lastNotificationAt?: number;
  bookingConfirmed?: boolean;
  bookingDate?: string;
}
```

**Acceptance Criteria:**
- Lawyer can sign up, pay $199/mo, access dashboard
- Lawyer can add up to 50 clients
- System monitors all clients' locations
- White-label email notifications sent when slots found
- Analytics show: Total clients, Active monitors, Notifications sent (last 30 days), Confirmed bookings
- Lawyer can export client list as CSV
- Stripe subscription creates automatically on signup

**Estimated Time:** 40 hours (1 week sprint)

**Subtasks:**
1. Frontend dashboard UI (16 hours)
2. Backend API endpoints (8 hours)
3. Authentication & authorization (4 hours)
4. Stripe product setup (2 hours)
5. White-label email templates (4 hours)
6. CSV import/export (4 hours)
7. Testing & bug fixes (2 hours)

---

### **TASK 7: Add Stripe Annual Plan** 💰 P1
**Status:** READY
**Assigned:** Dispatch engineer now
**Deliverable:**
1. Create annual plan in Stripe Dashboard
   - Price: $49/year (saves $10 vs monthly)
   - Product: "NEXUS Alert Premium (Annual)"
   - Billing interval: yearly
2. Update pricing page to show monthly vs annual toggle
3. Modify checkout flow to accept plan selection
4. Update Stripe webhook to handle annual subscriptions
5. Add "Switch to Annual & Save $10" banner for existing monthly subscribers

**Files to Modify:**
- `web/src/app/components/PricingSection.tsx` (add annual toggle)
- `backend/src/worker.js` handleCheckout (accept `plan` parameter)
- `backend/src/worker.js` handleStripeWebhook (handle annual renewals)

**UI Design:**
```
[ Monthly: $4.99/mo ]  [ Annual: $49/yr (Save $10) ] ← Toggle
```

**Acceptance Criteria:**
- Users can select annual plan on pricing page
- Stripe Checkout shows $49 charge with "Annual" label
- Existing monthly users see "Upgrade to Annual" banner
- Switching monthly → annual prorates correctly
- Annual renewals processed automatically

**Estimated Time:** 4 hours

---

### **TASK 8: Optimize Chrome Web Store Listing** 📢 P1
**Status:** READY
**Assigned:** Dispatch engineer + marketing
**Deliverable:**
1. Record 60-second demo video (Loom or ScreenFlow)
   - Show: Install → Setup locations → Get notification → Book slot
   - Voiceover: "Never miss a NEXUS appointment again"
   - Music: Upbeat, professional
2. Upload 5 screenshots (already created in `/store-assets/`)
3. Write optimized description (already drafted in `/store-assets/CHROME-WEB-STORE-LISTING-OPTIMIZED-2026.txt`)
4. Set category: Productivity
5. Add keywords: nexus appointment tracker, global entry alert, sentri notification, cbp scheduler
6. Submit for review
7. After approval: Incentivize 10 early users to leave 5-star reviews

**Acceptance Criteria:**
- Extension published to Chrome Web Store
- Demo video uploaded
- All 5 screenshots uploaded
- Description optimized for SEO keywords
- Extension appears in search results for "nexus appointment"
- 10+ reviews with 4.8+ average rating within 2 weeks

**Estimated Time:** 6 hours (2 hours video + 2 hours upload + 2 hours review collection)

---

### **TASK 9: Fix Accessibility (WCAG AA Compliance)** ♿ P1
**Status:** READY
**Assigned:** Dispatch engineer now
**Deliverable:**
1. Run Lighthouse accessibility audit on landing page
2. Fix color contrast violations:
   - Change `#888` text to `#a0a0a0` (meets 4.5:1 ratio on #0a0a0a)
   - Ensure all text meets WCAG AA contrast requirements
3. Add missing ARIA labels:
   - Settings icon button: `aria-label="Settings"`
   - Close button modals: `aria-label="Close"`
   - Notification frequency select: `<label for="notif-freq">Notification Frequency</label>`
4. Improve keyboard navigation:
   - All interactive elements focusable via Tab
   - Focus visible styles (already present: 2px outline)
   - Modal traps focus when open
5. Test with screen reader (VoiceOver on Mac or NVDA on Windows)

**Files to Modify:**
- `web/src/app/page.tsx` (fix contrast)
- `web/src/app/globals.css` (update color variables)
- `popup.html` (add ARIA labels)
- `popup.css` (ensure focus-visible styles)

**Acceptance Criteria:**
- Lighthouse accessibility score > 95
- Zero WCAG AA violations
- All interactive elements keyboard accessible
- Screen reader can navigate entire site
- Focus indicators visible on all elements

**Estimated Time:** 8 hours

---

### **TASK 10: Add Performance Optimizations** 🐌 P2
**Status:** READY
**Assigned:** Dispatch engineer now
**Deliverable:**
1. Bundle size analysis (run `npm run build` with bundle analyzer)
2. Code split Recharts library (move to separate chunk)
3. Lazy load below-fold components:
   - Testimonials section
   - FAQ section
   - Footer
4. Optimize images:
   - Convert PNGs to WebP
   - Add responsive srcset
   - Add lazy loading (`loading="lazy"`)
5. Preload critical fonts
6. Add service worker for offline support
7. Implement caching headers (already present in next.config.ts)

**Target Metrics:**
- Initial JS bundle: < 200KB (currently ~400KB)
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Lighthouse Performance score: > 90

**Files to Modify:**
- `web/package.json` (add @next/bundle-analyzer) ✅ ALREADY ADDED
- `web/next.config.ts` (enable bundle analyzer conditionally)
- `web/src/app/page.tsx` (lazy load components)

**Acceptance Criteria:**
- Bundle size reduced by 50%
- Lighthouse Performance score > 90
- Mobile load time < 3 seconds on 3G
- Core Web Vitals all green in Google Search Console

**Estimated Time:** 12 hours

---

## 📊 Sprint Metrics

**Velocity Target:** 80 hours (2 engineers × 40 hours)

**Task Breakdown:**
| Task | Priority | Hours | Status |
|------|----------|-------|--------|
| 1. Fix Build System | P0 | 1 | ✅ DONE |
| 2. Error Boundaries | P0 | 4 | READY |
| 3. Replace Placeholders | P0 | 2 | BLOCKED |
| 4. Rate Limiting | P0 | 6 | READY |
| 5. Analytics Tracking | P1 | 8 | READY |
| 6. Lawyer Dashboard | P0 | 40 | READY |
| 7. Annual Plan | P1 | 4 | READY |
| 8. Chrome Web Store | P1 | 6 | READY |
| 9. Accessibility | P1 | 8 | READY |
| 10. Performance | P2 | 12 | READY |
| **TOTAL** | | **91 hours** | |

**Engineer Allocation:**
- **Engineer A:** Tasks 2, 4, 5, 9 (26 hours)
- **Engineer B:** Tasks 6, 7, 8, 10 (62 hours)
- **CEO:** Task 3 (publish extension, 2 hours)

**Critical Path:**
1. Fix Build (DONE) → Deploy staging
2. Replace Placeholders → Launch Chrome Web Store
3. Lawyer Dashboard → Unlock B2B revenue
4. Analytics → Optimize funnel
5. Rate Limiting → Scale safely

---

## 🎯 Sprint Goal Success Criteria

**Must Ship by Friday:**
1. ✅ Build passes (DONE)
2. 🔲 Extension published to Chrome Web Store
3. 🔲 Error boundaries added to popup
4. 🔲 Rate limiting live on all endpoints
5. 🔲 Analytics tracking all conversion events

**Stretch Goals (if time):**
6. Lawyer dashboard MVP live
7. Annual plan available
8. WCAG AA compliant
9. Performance optimized

**Sprint Review (Friday 3pm):**
- Demo lawyer dashboard
- Review analytics dashboard (conversion funnel)
- Show Chrome Web Store listing
- Lighthouse score comparison (before/after)

---

## 🚀 Post-Sprint Roadmap

**Next Sprint (March 26 - April 2):**
1. Launch paid marketing campaigns (Google Ads + Facebook)
2. Build enterprise tier (Corporate HR teams, $999/mo)
3. Implement automated testing (Jest + Playwright)
4. Add referral leaderboard + rewards
5. Expand to 20 more enrollment centers (international)

**Q2 2026 Goals:**
- 10,000 extension installs
- $20K MRR ($240K ARR)
- 50 law firms signed
- Launch API for partners

---

## 📢 Communication Plan

**Daily Standups:** 9am PT on Slack
- What I shipped yesterday
- What I'm shipping today
- Any blockers

**Mid-Sprint Check-in:** Wednesday 2pm PT
- Review progress on lawyer dashboard
- Unblock any stuck engineers
- Adjust priorities if needed

**Sprint Review:** Friday 3pm PT
- Demo all shipped features
- Review metrics (installs, conversions, revenue)
- Retrospective: What went well, what to improve

---

**Sprint Start:** March 19, 2026 (TODAY)
**Sprint End:** March 26, 2026
**Next Sprint Planning:** March 26, 2026 @ 4pm PT

**LET'S SHIP IT! 🚀**
