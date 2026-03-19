# SPRINT 3: Conversion Optimization (Week 3)
**Goal:** Increase conversion rate and user retention
**Duration:** 3 days (~24 hours)
**Depends On:** Sprint 1 & 2 complete

---

## Task 1: Set Up A/B Testing Infrastructure
**Priority:** P2 🔵
**Time:** 6 hours
**Impact:** Data-driven optimization

### Steps
1. **Choose A/B testing platform:**

   **Option A: PostHog (Recommended - privacy-friendly, self-hostable)**
   ```bash
   cd /Users/michaelguo/nexus-alert/web
   npm install posthog-js
   ```

   **Option B: GrowthBook (Open source)**
   ```bash
   npm install @growthbook/growthbook-react
   ```

2. **Implement PostHog** (`web/src/lib/posthog.ts`):
   ```typescript
   import posthog from 'posthog-js';

   if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
     posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
       api_host: 'https://app.posthog.com',
       loaded: (posthog) => {
         if (process.env.NODE_ENV === 'development') posthog.debug();
       },
     });
   }

   export default posthog;
   ```

3. **Add PostHog Provider** (`web/src/app/providers.tsx`):
   ```typescript
   'use client';

   import posthog from 'posthog-js';
   import { PostHogProvider } from 'posthog-js/react';
   import { useEffect } from 'react';

   export function PHProvider({ children }: { children: React.ReactNode }) {
     useEffect(() => {
       if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
         posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
           api_host: 'https://app.posthog.com',
         });
       }
     }, []);

     return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
   }
   ```

4. **Wrap layout** (`web/src/app/layout.tsx`):
   ```tsx
   import { PHProvider } from './providers';

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           <PHProvider>
             {children}
           </PHProvider>
         </body>
       </html>
     );
   }
   ```

5. **Create first A/B test** - Hero CTA Copy:

   ```tsx
   'use client';

   import { useFeatureFlagVariantKey } from 'posthog-js/react';

   export function HeroCTA() {
     const ctaVariant = useFeatureFlagVariantKey('hero-cta-test');

     const ctaText = {
       'control': 'Install Free',
       'variant-a': 'Get Started Free',
       'variant-b': 'Try It Free',
       'variant-c': 'Add to Chrome — It's Free'
     }[ctaVariant || 'control'];

     return (
       <a href="https://chrome.google.com/webstore/..." className="cta-btn">
         {ctaText}
       </a>
     );
   }
   ```

6. **Create experiment in PostHog dashboard:**
   - Go to posthog.com → Experiments
   - Create "hero-cta-test" with 4 variants (control, variant-a, variant-b, variant-c)
   - Traffic split: 25% each
   - Goal metric: "chrome_webstore_click"
   - Run for 2 weeks or until statistical significance

7. **Track conversion events:**
   ```tsx
   import posthog from '@/lib/posthog';

   function handleCTAClick() {
     posthog.capture('chrome_webstore_click', {
       variant: ctaVariant,
       location: 'hero'
     });
   }
   ```

### Success Criteria
- ✅ PostHog integrated and tracking pageviews
- ✅ First A/B test created (Hero CTA)
- ✅ Conversion events tracked
- ✅ Can view results in PostHog dashboard

---

## Task 2: Mobile Comparison Table Redesign
**Priority:** P2 🔵
**Time:** 4 hours
**UX Issue:** Horizontal scroll on mobile

### Problem
Current comparison table requires horizontal scroll on mobile, poor UX.

### Solution
Card-based layout for mobile, table for desktop.

### Steps
1. **Create mobile comparison cards** (`web/src/app/components/ComparisonCards.tsx`):
   ```tsx
   'use client';

   import { useState } from 'react';

   export function ComparisonCards() {
     const [selectedPlan, setSelectedPlan] = useState('premium');

     const features = [
       { name: 'Check Frequency', free: 'Every 30 min', premium: 'Every 2 min', manual: 'When you remember', other: 'Every 5-15 min' },
       { name: '24/7 Monitoring', free: true, premium: true, manual: false, other: true },
       { name: 'Desktop Notifications', free: true, premium: true, manual: false, other: 'Limited' },
       // ... all features
     ];

     return (
       <div className="md:hidden"> {/* Only show on mobile */}
         {/* Plan selector tabs */}
         <div className="flex gap-2 mb-6 overflow-x-auto">
           {['free', 'premium', 'manual', 'other'].map(plan => (
             <button
               key={plan}
               onClick={() => setSelectedPlan(plan)}
               className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                 selectedPlan === plan ? 'bg-[#3b82f6] text-white' : 'bg-[#222] text-[#888]'
               }`}
             >
               {plan === 'free' && 'Free'}
               {plan === 'premium' && 'Premium ⭐'}
               {plan === 'manual' && 'Manual'}
               {plan === 'other' && 'Other Tools'}
             </button>
           ))}
         </div>

         {/* Feature cards */}
         <div className="space-y-3">
           {features.map(feature => (
             <div key={feature.name} className="bg-[#111] border border-[#222] rounded-lg p-4">
               <div className="font-semibold text-sm mb-2">{feature.name}</div>
               <div className="text-lg">
                 {renderFeatureValue(feature[selectedPlan])}
               </div>
             </div>
           ))}
         </div>

         {/* CTA */}
         {selectedPlan === 'premium' && (
           <div className="mt-6">
             <a href="#pricing" className="block w-full py-3 bg-[#3b82f6] text-white text-center rounded-lg font-semibold">
               Upgrade to Premium
             </a>
           </div>
         )}
       </div>
     );
   }

   function renderFeatureValue(value: any) {
     if (typeof value === 'boolean') {
       return value ? (
         <span className="text-[#22c55e]">✓ Yes</span>
       ) : (
         <span className="text-[#555]">✗ No</span>
       );
     }
     return <span className="text-[#ccc]">{value}</span>;
   }
   ```

2. **Update page.tsx** to use cards on mobile:
   ```tsx
   import ComparisonCards from './components/ComparisonCards';

   // In the comparison section
   <section>
     {/* Desktop: table (hidden on mobile) */}
     <div className="hidden md:block">
       <table>...</table>
     </div>

     {/* Mobile: cards (hidden on desktop) */}
     <ComparisonCards />
   </section>
   ```

3. **Test on mobile:**
   - Open DevTools → Toggle device toolbar
   - Test on iPhone 13, Galaxy S21
   - Verify no horizontal scroll

### Success Criteria
- ✅ No horizontal scroll on mobile
- ✅ All features visible in card layout
- ✅ Easy to compare plans with tab switcher
- ✅ Desktop table unchanged

---

## Task 3: Exit-Intent Analytics Tracking
**Priority:** P2 🔵
**Time:** 2 hours
**Impact:** Understand drop-off behavior

### Steps
1. **Enhance exit-intent popup** (`web/src/app/client-components.tsx`):

   Add tracking when exit-intent fires:
   ```tsx
   const [exitIntentShown, setExitIntentShown] = useState(false);

   const handleExitIntent = (e: MouseEvent) => {
     if (!exitIntentShown && e.clientY <= 0) {
       setExitIntentShown(true);

       // Track exit-intent trigger
       posthog?.capture('exit_intent_triggered', {
         timeOnPage: Date.now() - sessionStartTime,
         scrollDepth: window.scrollY / document.body.scrollHeight,
         currentSection: getCurrentSection()
       });

       // Show popup
       setShowExitIntent(true);
     }
   };
   ```

2. **Track popup interactions:**
   ```tsx
   // Track dismiss
   const handleDismiss = () => {
     posthog?.capture('exit_intent_dismissed', {
       timeVisible: Date.now() - popupShownTime
     });
     setShowExitIntent(false);
   };

   // Track email submit
   const handleEmailSubmit = (email: string) => {
     posthog?.capture('exit_intent_converted', {
       email,
       timeVisible: Date.now() - popupShownTime
     });
   };
   ```

3. **Create PostHog funnel:**
   - Go to PostHog → Insights → Funnels
   - Create funnel:
     1. `pageview` (homepage)
     2. `exit_intent_triggered`
     3. `exit_intent_converted`
   - View conversion rate at each step

4. **A/B test exit-intent offers:**

   Create variants:
   ```tsx
   const exitIntentVariant = useFeatureFlagVariantKey('exit-intent-test');

   const offers = {
     'control': {
       title: 'Wait! Get notified when slots open',
       cta: 'Notify Me'
     },
     'discount': {
       title: 'Get 20% off Premium for 3 months',
       cta: 'Claim Discount'
     },
     'urgency': {
       title: 'Only 12 slots left this week at Blaine!',
       cta: 'Install Extension'
     }
   };

   const offer = offers[exitIntentVariant || 'control'];
   ```

5. **Track which variant converts best:**
   - Run test for 2 weeks
   - Analyze in PostHog: Experiments → exit-intent-test
   - Choose winning variant

### Success Criteria
- ✅ Exit-intent trigger rate tracked
- ✅ Conversion rate tracked
- ✅ A/B test configured
- ✅ Can identify winning variant

---

## Task 4: Onboarding Funnel Analytics
**Priority:** P2 🔵
**Time:** 3 hours
**Impact:** Reduce drop-off during onboarding

### Steps
1. **Add tracking to extension onboarding** (`/onboarding.js`):

   ```javascript
   // Track onboarding start
   chrome.runtime.sendMessage({
     action: 'trackEvent',
     event: 'onboarding_started',
     data: { timestamp: Date.now() }
   });

   // Track step progression
   function trackStep(stepName) {
     chrome.runtime.sendMessage({
       action: 'trackEvent',
       event: 'onboarding_step',
       data: { step: stepName, timestamp: Date.now() }
     });
   }

   // Track location selection
   addLocationBtn.addEventListener('click', () => {
     trackStep('location_selected');
     // ... existing logic
   });

   // Track date range
   dateRangeForm.addEventListener('submit', () => {
     trackStep('date_range_set');
     // ... existing logic
   });

   // Track completion
   function completeOnboarding() {
     trackStep('onboarding_completed');
     chrome.runtime.sendMessage({
       action: 'trackEvent',
       event: 'onboarding_completed',
       data: {
         timeToComplete: Date.now() - onboardingStartTime,
         locationsAdded: selectedLocations.length,
         dateRangeSet: !!dateRange.start
       }
     });
   }
   ```

2. **Send events to backend** (`/background.js`):
   ```javascript
   chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
     if (msg.action === 'trackEvent') {
       // Send to PostHog via backend
       fetch('https://api.nexus-alert.com/api/analytics/event', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           event: msg.event,
           data: msg.data,
           timestamp: Date.now(),
           userId: getUserId(), // Anonymous ID
         }),
       });
       sendResponse({ success: true });
     }
   });
   ```

3. **Create backend proxy** to PostHog (`/backend/src/worker.js`):
   ```javascript
   async function handleAnalyticsEvent(req, env, cors) {
     const { event, data, timestamp, userId } = await req.json();

     // Forward to PostHog
     await fetch('https://app.posthog.com/capture/', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         api_key: env.POSTHOG_API_KEY,
         event,
         properties: {
           ...data,
           timestamp,
           distinct_id: userId,
           $set: { product: 'extension' }
         }
       })
     });

     return json({ success: true }, 200, cors);
   }
   ```

4. **Create onboarding funnel in PostHog:**
   - Funnel steps:
     1. `onboarding_started`
     2. `onboarding_step` (step=location_selected)
     3. `onboarding_step` (step=date_range_set)
     4. `onboarding_completed`
   - View drop-off rate at each step

5. **Identify and fix drop-off points:**
   - If 40% drop off at location selection → improve UI, add search
   - If 20% drop off at date range → make optional or simplify

### Success Criteria
- ✅ All onboarding steps tracked
- ✅ Funnel created in PostHog
- ✅ Drop-off rate < 20% per step
- ✅ 80%+ complete onboarding

---

## Task 5: Notification Fatigue Protection
**Priority:** P2 🔵
**Time:** 4 hours
**UX Issue:** Users can get spammed if many slots appear

### Steps
1. **Add notification grouping** (`/background.js`):

   ```javascript
   async function notifyNewSlots(results, config) {
     const totalSlots = results.reduce((sum, r) => sum + r.slots.length, 0);
     const uniqueLocations = new Set(results.map(r => r.locationId)).size;

     // If more than 5 slots, group into single notification
     if (totalSlots >= 5) {
       chrome.notifications.create('slots-batch', {
         type: 'basic',
         iconUrl: 'icons/icon128.png',
         title: `🎯 ${totalSlots} New ${config.program} Appointments!`,
         message: `Found ${totalSlots} slots at ${uniqueLocations} location(s). Tap to see all slots and book!`,
         priority: 2,
         requireInteraction: true,
         buttons: [{ title: 'View All Slots →' }],
       });

       // Track grouped notification
       trackEvent('notification_grouped', {
         totalSlots,
         uniqueLocations,
         tier: config.tier
       });

       return; // Don't send individual notifications
     }

     // Otherwise, send individual notifications (existing logic)
     // ...
   }
   ```

2. **Add snooze functionality:**

   ```javascript
   // In popup.html, add snooze button
   <button id="snoozeBtn" class="btn-secondary">
     ⏸ Snooze Notifications (1 hour)
   </button>

   // In popup.js
   document.getElementById('snoozeBtn').addEventListener('click', async () => {
     const snoozedUntil = Date.now() + (60 * 60 * 1000); // 1 hour
     await chrome.storage.local.set({ snoozedUntil });

     showToast('Notifications snoozed for 1 hour');
   });

   // In background.js
   async function checkAllLocations() {
     const { snoozedUntil } = await chrome.storage.local.get('snoozedUntil');

     if (snoozedUntil && Date.now() < snoozedUntil) {
       console.log('[NEXUS Alert] Notifications snoozed');
       return;
     }

     // ... existing check logic
   }
   ```

3. **Add notification summary in popup:**

   ```javascript
   // In popup.js
   async function updateNotificationSummary() {
     const { notificationHistory } = await chrome.storage.local.get('notificationHistory');
     const history = notificationHistory || [];

     // Count today's notifications
     const today = new Date().setHours(0, 0, 0, 0);
     const todayCount = history.filter(n => n.timestamp >= today).length;

     // Show summary
     document.getElementById('notif-summary').textContent =
       `You've been notified ${todayCount} time${todayCount === 1 ? '' : 's'} today`;
   }

   // Track notification history
   async function recordNotification(locationId, slotTime) {
     const { notificationHistory = [] } = await chrome.storage.local.get('notificationHistory');

     notificationHistory.push({
       locationId,
       slotTime,
       timestamp: Date.now()
     });

     // Keep last 100 notifications
     const trimmed = notificationHistory.slice(-100);
     await chrome.storage.local.set({ notificationHistory: trimmed });
   }
   ```

4. **Add notification frequency preference:**

   ```html
   <!-- In popup settings -->
   <label>
     Maximum notifications per hour:
     <select id="maxNotifPerHour">
       <option value="unlimited">Unlimited</option>
       <option value="10">10</option>
       <option value="5" selected>5</option>
       <option value="3">3</option>
       <option value="1">1</option>
     </select>
   </label>
   ```

   ```javascript
   // Enforce limit in background.js
   async function canSendNotification() {
     const { config, notificationHistory = [] } = await chrome.storage.local.get(['config', 'notificationHistory']);

     if (config.maxNotifPerHour === 'unlimited') return true;

     const hourAgo = Date.now() - (60 * 60 * 1000);
     const recentNotifs = notificationHistory.filter(n => n.timestamp >= hourAgo);

     return recentNotifs.length < parseInt(config.maxNotifPerHour);
   }
   ```

### Success Criteria
- ✅ Notifications grouped when > 5 slots
- ✅ Snooze functionality works
- ✅ Notification summary shown in popup
- ✅ Max notifications per hour enforced

---

## Task 6: Email Deliverability Monitoring
**Priority:** P2 🔵
**Time:** 2 hours
**Risk:** Emails going to spam

### Steps
1. **Check Resend deliverability dashboard:**
   - Go to resend.com → Deliverability
   - Check bounce rate (target: < 2%)
   - Check spam complaint rate (target: < 0.1%)
   - Check open rate (target: > 25%)

2. **Verify DNS records:**

   ```bash
   # Check SPF record
   dig TXT nexus-alert.com | grep spf

   # Check DKIM record
   dig TXT resend._domainkey.nexus-alert.com

   # Check DMARC record
   dig TXT _dmarc.nexus-alert.com
   ```

   **If missing, add these DNS records:**

   ```txt
   # SPF
   nexus-alert.com. TXT "v=spf1 include:_spf.resend.com ~all"

   # DKIM (get from Resend dashboard)
   resend._domainkey.nexus-alert.com. TXT "v=DKIM1; k=rsa; p=MIGfMA0GCS..."

   # DMARC
   _dmarc.nexus-alert.com. TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@nexus-alert.com"
   ```

3. **Add email open tracking** (Resend supports this):

   ```javascript
   // In backend/src/email-templates/index.js
   export async function sendEmail(to, slots, env, { trackOpens = true } = {}) {
     const response = await fetch('https://api.resend.com/emails', {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${env.RESEND_API_KEY}`,
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         from: 'NEXUS Alert <alerts@nexus-alert.com>',
         to,
         subject: `🎯 NEXUS Appointment Found!`,
         html: getEmailTemplate(slots),
         tags: [
           { name: 'category', value: 'slot_notification' },
           { name: 'tier', value: 'premium' }
         ],
         // Enable tracking
         tracking: {
           opens: trackOpens,
           clicks: true
         }
       }),
     });

     return response.json();
   }
   ```

4. **Monitor email metrics** in Resend webhook:

   ```javascript
   // In backend/src/worker.js
   async function handleResendWebhook(req, env, cors) {
     const event = await req.json();

     // Track email events in PostHog
     if (event.type === 'email.opened') {
       posthog.capture('email_opened', {
         email: event.data.to,
         subject: event.data.subject,
         emailId: event.data.id
       });
     } else if (event.type === 'email.bounced') {
       posthog.capture('email_bounced', {
         email: event.data.to,
         reason: event.data.bounce_type
       });

       // Remove from subscriber list if hard bounce
       if (event.data.bounce_type === 'hard') {
         await removeSubscriber(event.data.to, env);
       }
     } else if (event.type === 'email.spam_reported') {
       posthog.capture('email_spam_reported', {
         email: event.data.to
       });

       // Immediately unsubscribe
       await removeSubscriber(event.data.to, env);
     }

     return json({ success: true }, 200, cors);
   }
   ```

5. **Create email health dashboard** in PostHog:
   - Open rate: `email_opened` / `email_sent`
   - Click rate: `email_clicked` / `email_sent`
   - Bounce rate: `email_bounced` / `email_sent`
   - Spam rate: `email_spam_reported` / `email_sent`

### Success Criteria
- ✅ SPF, DKIM, DMARC records configured
- ✅ Email open/click tracking enabled
- ✅ Bounce/spam webhooks handled
- ✅ Email health dashboard created
- ✅ Deliverability rate > 98%

---

## Task 7: Real User Monitoring (RUM) Setup
**Priority:** P2 🔵
**Time:** 3 hours
**Impact:** Understand actual user performance

### Steps
1. **Enable Sentry Performance Monitoring:**

   Update `web/src/instrumentation.ts` (or create if missing):
   ```typescript
   import * as Sentry from '@sentry/nextjs';

   export function register() {
     if (process.env.NEXT_RUNTIME === 'nodejs') {
       Sentry.init({
         dsn: process.env.SENTRY_DSN,
         tracesSampleRate: 0.1, // Sample 10% of transactions

         // Performance monitoring
         integrations: [
           new Sentry.BrowserTracing({
             tracePropagationTargets: ['nexus-alert.com', 'api.nexus-alert.com'],
           }),
         ],
       });
     }
   }
   ```

2. **Track critical user flows:**

   ```typescript
   import * as Sentry from '@sentry/nextjs';

   // Track Chrome Web Store click flow
   export function trackChromeWebStoreClick() {
     const transaction = Sentry.startTransaction({
       name: 'Chrome Web Store Click',
       op: 'navigation',
     });

     // Track CTA click → Chrome Web Store load
     const span = transaction.startChild({
       op: 'http.client',
       description: 'Load Chrome Web Store listing',
     });

     // When user returns, finish span
     window.addEventListener('focus', () => {
       span.finish();
       transaction.finish();
     }, { once: true });
   }

   // Track premium checkout flow
   export function trackCheckoutFlow() {
     const transaction = Sentry.startTransaction({
       name: 'Premium Checkout Flow',
       op: 'navigation',
     });

     // Track each step
     transaction.startChild({ op: 'click', description: 'Upgrade button click' });
     // ... more steps
   }
   ```

3. **Add custom performance metrics:**

   ```typescript
   // Track landing page LCP
   import { onLCP, onFID, onCLS } from 'web-vitals';

   export function reportWebVitals(metric: any) {
     Sentry.setMeasurement(metric.name, metric.value, metric.unit);

     // Also send to PostHog
     posthog?.capture('web_vital', {
       name: metric.name,
       value: metric.value,
       rating: metric.rating,
       delta: metric.delta,
     });
   }

   // In app/layout.tsx
   export { reportWebVitals };
   ```

4. **Create Sentry dashboard:**
   - Go to Sentry → Performance → Dashboards
   - Create "User Performance" dashboard
   - Add widgets:
     - Average LCP by page
     - Average FID by page
     - Average CLS by page
     - Transaction duration histogram
     - Slowest transactions

5. **Set performance budgets:**

   In Sentry → Performance → Thresholds:
   ```json
   {
     "transactions": [
       {
         "name": "Landing Page Load",
         "thresholds": {
           "lcp": 2500,
           "fid": 100,
           "cls": 0.1
         }
       }
     ]
   }
   ```

6. **Alert on performance regression:**

   In Sentry → Alerts → Create Alert:
   - Condition: "Transaction duration > 3s"
   - Frequency: "More than 100 events in 1 hour"
   - Action: "Send to Slack #engineering-alerts"

### Success Criteria
- ✅ Sentry Performance enabled (10% sample rate)
- ✅ Web Vitals tracked (LCP, FID, CLS)
- ✅ Custom transactions tracked
- ✅ Performance dashboard created
- ✅ Alerts configured for regressions

---

## Sprint 3 Completion Checklist

- [ ] Task 1: A/B testing infrastructure (PostHog) 🧪
- [ ] Task 2: Mobile comparison table redesign 📱
- [ ] Task 3: Exit-intent analytics tracking 📊
- [ ] Task 4: Onboarding funnel analytics 🎯
- [ ] Task 5: Notification fatigue protection 🔕
- [ ] Task 6: Email deliverability monitoring 📧
- [ ] Task 7: Real User Monitoring (Sentry Performance) 🚀

---

## Post-Sprint 3: Conversion Optimization Loop

After Sprint 3, you now have data-driven optimization infrastructure. Run this loop continuously:

1. **Week 1-2:** Run A/B test (e.g., hero CTA copy)
2. **Week 3:** Analyze results, choose winner
3. **Week 4:** Implement winner, design next test

**Test ideas queue:**
- Hero headline variants
- Pricing page layout (table vs cards)
- Free vs Premium feature emphasis
- Email capture form placement
- Testimonial section variants
- FAQ order optimization
- Trust badge prominence

**Goal:** Increase conversion rate by 20% over 3 months through systematic testing.

---

*Sprint 3 Tasks Generated: March 19, 2026*
*Estimated Completion: 3 days*
*Total Sprint Time: 8 days (2 weeks) for all 3 sprints*
