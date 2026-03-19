# 🎯 NEXUS Alert Task Dispatch — Immediate Action Required

**Sprint Start:** March 18, 2026, 9:27 PM
**Sprint End:** March 25, 2026, 11:59 PM
**Status:** 🔴 ACTIVE — ALL HANDS ON DECK

---

## 🚨 URGENT: Deploy These Engineers NOW

### **Engineer 1: DevOps/Infrastructure Lead**
**Tasks Assigned:** Task 1 (Production Blockers) + Task 5 (Health Checks)
**Total Time:** 4 hours
**Status:** 🔴 START IMMEDIATELY

**Your Mission:**
Make this product production-ready in the next 4 hours. Revenue is blocked until you complete Task 1.

**Execute in this order:**
1. Open terminal, navigate to `/Users/michaelguo/nexus-alert`
2. Run: `cd backend && wrangler kv:namespace create NEXUS_ALERTS_KV --env production`
3. Run: `wrangler kv:namespace create TESTIMONIALS --env production`
4. Copy the namespace IDs from output
5. Edit `backend/wrangler.toml` lines 11, 12, 71, 72 with real IDs
6. Create Sentry account at https://sentry.io/signup/
7. Create new project "nexus-alert-extension"
8. Copy DSN (looks like: `https://abc123@o123.ingest.sentry.io/456`)
9. Edit `background.js` line 9, replace placeholder with real DSN
10. Edit `backend/wrangler.toml` line 33, add Sentry DSN
11. Deploy: `cd backend && wrangler deploy --env production`
12. Test: `curl -I https://api.nexus-alert.com/api/health`
13. If 404, implement health check endpoint (see sprint plan Task 5)
14. Set up UptimeRobot monitor on `/api/health`
15. Add Slack webhook alerts for failures

**Files You'll Modify:**
- `backend/wrangler.toml`
- `background.js`
- `backend/src/worker.js`

**Success Criteria:**
✅ Backend deploys without errors
✅ Sentry dashboard shows test events
✅ `/api/health` returns JSON {"status": "healthy"}
✅ UptimeRobot pings every 5 minutes

**Blocked By:** Nothing — START NOW
**Blocking:** All revenue, Task 2, Task 6

---

### **Engineer 2: Backend/Security Engineer**
**Tasks Assigned:** Task 2 (Rate Limiting) + Task 6 (Error Handling)
**Total Time:** 6 hours
**Status:** 🟡 BLOCKED — Wait for Task 1 to deploy, then START

**Your Mission:**
Secure the API and make errors user-friendly. We're vulnerable to abuse without rate limiting.

**Phase 1: Rate Limiting (3 hours)**
1. Wait for Engineer 1 to deploy backend
2. Create `backend/src/middleware/rateLimit.js`:
```javascript
export async function rateLimit(request, env, endpoint) {
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
  const key = `ratelimit:${clientIP}:${endpoint}`;
  const count = await env.NEXUS_ALERTS_KV.get(key);

  if (count && parseInt(count) >= 10) {
    return new Response(JSON.stringify({
      error: { message: 'Too many requests. Please wait 1 minute.', code: 'RATE_LIMIT' }
    }), { status: 429, headers: { 'Content-Type': 'application/json' } });
  }

  await env.NEXUS_ALERTS_KV.put(key, String((parseInt(count) || 0) + 1), { expirationTtl: 60 });
  return null; // No error, proceed
}
```

3. Create `backend/src/middleware/securityHeaders.js`:
```javascript
export function addSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://plausible.io");
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return new Response(response.body, { status: response.status, headers });
}
```

4. Apply middleware to all endpoints in `backend/src/worker.js`
5. Test: Send 11 rapid requests, verify 11th returns 429

**Phase 2: Error Handling (3 hours)**
6. Create `backend/src/utils/errorResponse.js` (see sprint plan Task 6)
7. Replace all `throw new Error()` with `return errorResponse(message, code)`
8. Add retry logic to `background.js` (fetchWithRetry function)
9. Add error toast to `popup.js`
10. Test: Disconnect WiFi, verify "CBP API unavailable" message appears

**Files You'll Modify:**
- Create: `backend/src/middleware/rateLimit.js`
- Create: `backend/src/middleware/securityHeaders.js`
- Create: `backend/src/utils/errorResponse.js`
- `backend/src/worker.js`
- `background.js`
- `popup.js`
- `popup.html`

**Success Criteria:**
✅ 11th request in 60 seconds returns 429
✅ All responses have CSP header
✅ Extension retries CBP API 3 times before showing error
✅ Error messages are user-friendly (no stack traces)

**Blocked By:** Task 1 (backend deployment)
**Blocking:** Nothing (can work in parallel with others after Task 1)

---

### **Engineer 3: Frontend/UX Lead**
**Tasks Assigned:** Task 3 (Onboarding) + Task 4 (Mobile Responsive)
**Total Time:** 7 hours
**Status:** 🟢 START NOW (not blocked)

**Your Mission:**
Make onboarding delightful and mobile users happy. 40% of installs never complete setup — your job is to fix that.

**Phase 1: Onboarding Tutorial (4 hours)**
1. Install Shepherd.js: `npm install shepherd.js`
2. Edit `onboarding.html`, replace content with 4-step wizard:
   - Step 1: "Welcome to NEXUS Alert! Find appointments 87% faster"
   - Step 2: "Choose your program" (3 cards: NEXUS, Global Entry, SENTRI)
   - Step 3: "Select enrollment centers" (map + checkboxes)
   - Step 4: "Set your preferences" (date range, notifications)
3. Add progress bar: `<div class="progress">Step 1 of 4</div>`
4. Add "Skip" button that tracks `onboarding_skipped` event
5. Edit `popup.js`, add first-launch tooltips using Shepherd.js:
```javascript
if (!localStorage.getItem('tooltipsShown')) {
  const tour = new Shepherd.Tour({ defaultStepOptions: { ... } });
  tour.addStep({ title: 'Check Now', text: 'Click here to scan for slots', attachTo: { element: '#checkNowBtn', on: 'bottom' } });
  tour.start();
  localStorage.setItem('tooltipsShown', 'true');
}
```
6. Save completion: `chrome.storage.local.set({ onboardingCompleted: true })`
7. Test: Fresh install → see 4 steps → complete → see tooltips on popup

**Phase 2: Mobile Responsive (3 hours)**
8. Open Chrome DevTools, toggle Device Mode (iPhone SE 375px width)
9. Audit every page: `/`, `/pricing`, `/blog`, etc.
10. Fix all touch targets <44px (see sprint plan)
11. Fix horizontal scroll in pricing table:
```css
@media (max-width: 768px) {
  .pricing-table { flex-direction: column; }
  .pricing-card { width: 100%; margin-bottom: 16px; }
}
```
12. Install react-swipeable: `cd web && npm install react-swipeable`
13. Make testimonials swipeable on mobile
14. Test on real iPhone (borrow if needed)
15. Run Lighthouse mobile audit, achieve score ≥90

**Files You'll Modify:**
- `onboarding.html`
- `onboarding.js`
- `popup.js`
- `web/src/app/globals.css`
- `web/src/app/components/Testimonials.tsx`
- `web/src/app/components/PricingTable.tsx`
- `web/package.json`

**Success Criteria:**
✅ 4-step onboarding shows on fresh install
✅ Tooltips appear on first popup open
✅ All touch targets ≥44px on mobile
✅ No horizontal scroll on 320px viewport
✅ Lighthouse mobile score ≥90

**Blocked By:** Nothing — START NOW
**Blocking:** Nothing

---

### **Engineer 4: Growth/Analytics Engineer**
**Tasks Assigned:** Task 7 (Analytics Tracking)
**Total Time:** 2 hours
**Status:** 🟢 START NOW (not blocked)

**Your Mission:**
We're flying blind without data. Track every user action so we can optimize the funnel.

**Execute:**
1. Edit `background.js`, add tracking calls:
```javascript
// After install
trackEvent('extension_installed', { source: 'chrome_web_store' });

// After first check
trackEvent('first_check_run', { program: config.program, location_count: config.locations.length });

// When slot found
trackEvent('slot_found', { location_id, date, time });
```

2. Edit `onboarding.js`, track step completion:
```javascript
trackEvent('onboarding_step_completed', { step: 1, program: selectedProgram });
trackEvent('onboarding_completed', { duration_seconds: Math.floor((Date.now() - startTime) / 1000) });
```

3. Edit `popup.js`, track upgrade clicks:
```javascript
document.getElementById('upgradeBtn').addEventListener('click', () => {
  trackEvent('upgrade_clicked', { source: 'settings_tab', plan: selectedPlan });
});
```

4. Add UTM parameters to all external links in `web/src/app/components/CTAButton.tsx`:
```typescript
<a href={`https://nexus-alert.com?utm_source=chrome_extension&utm_medium=popup&utm_campaign=${campaign}`}>
```

5. Create Plausible funnel:
   - Step 1: extension_installed
   - Step 2: onboarding_completed
   - Step 3: first_check_run
   - Step 4: upgrade_clicked
   - Step 5: payment_succeeded

6. Test: Install extension → complete onboarding → click upgrade → verify events in Plausible dashboard

**Files You'll Modify:**
- `background.js`
- `onboarding.js`
- `popup.js`
- `web/src/app/components/CTAButton.tsx`

**Success Criteria:**
✅ All 9 events appear in Plausible dashboard
✅ Can see funnel: 100 installs → 60 onboarded → 5 paid
✅ UTM parameters visible in Plausible sources

**Blocked By:** Nothing — START NOW
**Blocking:** Nothing

---

### **Engineer 5: Accessibility Specialist**
**Tasks Assigned:** Task 8 (Accessibility)
**Total Time:** 3 hours
**Status:** 🟡 CAN START (not urgent, but important)

**Your Mission:**
Make NEXUS Alert usable for everyone, including screen reader users and keyboard-only navigators.

**Execute:**
1. Install axe DevTools Chrome extension
2. Run audit on `popup.html` → fix all critical issues
3. Add ARIA labels to all buttons/inputs (see sprint plan)
4. Fix keyboard navigation:
   - Tab through all interactive elements
   - Enter/Space activates buttons
   - Escape closes modals
5. Update color contrast in `popup.html`:
```css
--text-muted: #999; /* Was #888, now 5.1:1 contrast */
```
6. Add screen reader announcements when slots found:
```javascript
announceToScreenReader('3 new appointment slots found at Blaine, WA');
```
7. Test with macOS VoiceOver: Cmd+F5 to enable
8. Test with keyboard only (unplug mouse)
9. Re-run axe DevTools, verify 0 critical issues

**Files You'll Modify:**
- `popup.html`
- `popup.css`
- `popup.js`
- `web/src/app/globals.css`

**Success Criteria:**
✅ axe DevTools: 0 critical issues
✅ Can navigate entire popup with Tab+Enter
✅ All color contrasts ≥4.5:1
✅ VoiceOver announces slot discoveries

**Blocked By:** Nothing — START NOW (low priority, can do after higher priority tasks)
**Blocking:** Nothing

---

## 📊 Real-Time Progress Dashboard

Track progress here: https://github.com/yourusername/nexus-alert/projects/1

| Task | Engineer | Status | Progress | ETA |
|------|----------|--------|----------|-----|
| Task 1: Production Blockers | DevOps Lead | 🔴 Not Started | 0% | 4 hours |
| Task 2: Rate Limiting | Backend Engineer | 🟡 Blocked | 0% | 6 hours |
| Task 3: Onboarding | Frontend Lead | 🟢 Ready | 0% | 4 hours |
| Task 4: Mobile Responsive | Frontend Lead | 🟢 Ready | 0% | 3 hours |
| Task 5: Health Checks | DevOps Lead | 🔴 Not Started | 0% | 2 hours |
| Task 6: Error Handling | Backend Engineer | 🟡 Blocked | 0% | 3 hours |
| Task 7: Analytics | Growth Engineer | 🟢 Ready | 0% | 2 hours |
| Task 8: Accessibility | Accessibility Specialist | 🟢 Ready | 0% | 3 hours |
| Task 9: Error Dashboard | Backend Engineer | ⚪ Optional | 0% | 2 hours |
| Task 10: PWA Caching | Frontend Lead | ⚪ Optional | 0% | 2 hours |

---

## 🚀 Daily Standup Schedule

**Time:** 9:00 AM Pacific, every day for 7 days
**Format:** 15 minutes, async in Slack or sync on Zoom

**Each engineer reports:**
1. What I shipped yesterday
2. What I'm shipping today
3. Any blockers

**Example:**
> **Engineer 3 (Frontend):** Yesterday: Completed onboarding wizard (Task 3). Today: Starting mobile responsive fixes (Task 4). Blockers: None.

---

## ✅ Deployment Checklist (Copy to Each PR)

Before merging ANY pull request:
- [ ] Tests pass locally (`npm test`)
- [ ] Code reviewed by 1+ engineer
- [ ] No console errors in browser DevTools
- [ ] Lighthouse score didn't decrease
- [ ] Changes documented in CHANGELOG.md
- [ ] Deployed to staging and tested
- [ ] Product owner approved
- [ ] Merged to `main` branch
- [ ] Deployed to production
- [ ] Monitored for 1 hour (no errors in Sentry)
- [ ] Task marked as ✅ DONE in dashboard

---

## 🎉 When You're Done

**Each engineer:**
1. Create PR: `git checkout -b task-N-description`
2. Commit: `git commit -m "Fix: [Task N] Description of changes"`
3. Push: `git push origin task-N-description`
4. Open PR on GitHub
5. Tag `@michaelguo` for review
6. After merge, update progress dashboard
7. Notify team in Slack: "✅ Task N complete! [link to PR]"

---

## 🆘 Need Help?

**Stuck? Blocked? Confused?**
- Slack: #nexus-alert-sprint channel
- Email: michaelguo@example.com
- Emergency: Text Michael (XXX) XXX-XXXX

**Common Issues:**
- **"Wrangler deploy fails"**: Check KV namespace IDs are correct
- **"Tests failing"**: Run `npm ci` to reinstall dependencies
- **"Lighthouse score dropped"**: Check for large images, unminified CSS
- **"Can't test on iPhone"**: Use BrowserStack or ask teammate to test

---

**🚀 LET'S SHIP THIS! The company runs 24/7 and must continuously self-improve. GO GO GO!**
