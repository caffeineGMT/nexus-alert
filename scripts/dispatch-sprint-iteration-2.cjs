#!/usr/bin/env node

/**
 * NEXUS Alert - Sprint Iteration 2 Task Dispatch
 * CEO Task Assignment & Engineer Coordination
 *
 * Dispatches 10 high-priority tasks across 4 engineers
 * Focus: Fix production blockers, improve UX, optimize performance
 */

const tasks = [
  {
    id: 'TASK-001',
    title: 'Fix Turbopack Build Failure - CRITICAL BLOCKER',
    priority: 'P0',
    status: 'pending',
    description: `
      Build fails with Turbopack panic on server-reference-manifest.json.
      Root cause: /api/testimonials/submit/route.ts conflicts with build process.

      SOLUTION:
      1. Remove /web/src/app/api/testimonials/submit/route.ts
      2. Migrate endpoint to Cloudflare Worker (/backend/src/worker.js)
      3. Update testimonial form to POST to worker endpoint
      4. Verify build passes: cd web && npm run build

      ACCEPTANCE CRITERIA:
      - npm run build completes with 0 errors
      - No Turbopack panics
      - Testimonial submission still works via worker endpoint
    `,
    files: [
      '/web/src/app/api/testimonials/submit/route.ts',
      '/backend/src/worker.js',
      '/web/src/app/components/TestimonialForm.tsx',
    ],
    estimate: '2 hours',
    assignedTo: 'Engineer-A',
    blockedBy: [],
    blocks: ['TASK-005'],
    impact: 'CRITICAL - Cannot deploy without this fix',
  },

  {
    id: 'TASK-002',
    title: 'Replace EXTENSION_ID Placeholder - Chrome Web Store Blocker',
    priority: 'P0',
    status: 'pending',
    description: `
      All CTA buttons have placeholder text "EXTENSION_ID" instead of real Chrome Web Store ID.
      Blocks product launch.

      SOLUTION:
      1. Get Chrome Web Store extension ID after publishing
      2. Create env var NEXT_PUBLIC_CWS_EXTENSION_ID in .env.local
      3. Replace 15 instances across 10 files with process.env.NEXT_PUBLIC_CWS_EXTENSION_ID
      4. Add fallback for dev mode

      FILES TO UPDATE:
      - /web/src/app/page.tsx (3 instances)
      - /web/src/app/global-entry/page.tsx (3 instances)
      - /web/src/app/sentri/page.tsx (3 instances)
      - /web/src/app/nexus/page.tsx (3 instances)
      - /web/src/app/ph/page.tsx (2 instances)
      - /web/src/app/components/PricingSection.tsx (1 instance)

      ACCEPTANCE CRITERIA:
      - All "Install Extension" buttons work
      - Links point to real Chrome Web Store listing
      - No TODO comments remain
    `,
    files: [
      '/web/src/app/page.tsx',
      '/web/src/app/global-entry/page.tsx',
      '/web/src/app/sentri/page.tsx',
      '/web/src/app/nexus/page.tsx',
      '/web/src/app/ph/page.tsx',
      '/web/src/app/components/PricingSection.tsx',
      '/web/.env.local',
    ],
    estimate: '1 hour',
    assignedTo: 'Engineer-B',
    blockedBy: ['Chrome Web Store listing published'],
    blocks: [],
    impact: 'CRITICAL - Blocks revenue launch',
  },

  {
    id: 'TASK-003',
    title: 'Fix Next.js Config Warnings - Production Quality',
    priority: 'P0',
    status: 'pending',
    description: `
      Multiple Next.js warnings degrading production quality:
      1. "headers" ignored with output: export
      2. middleware.ts deprecated → use proxy.ts
      3. Multiple lockfiles warning
      4. experimentalInstrumentationHook deprecated

      SOLUTION:
      1. Remove headers config (doesn't work with static export)
      2. Add Cloudflare Workers headers instead
      3. Rename middleware.ts to proxy.ts
      4. Add turbopack.root config
      5. Remove deprecated experimental flags

      ACCEPTANCE CRITERIA:
      - npm run build shows 0 warnings
      - Security headers applied via Cloudflare
      - Clean build output
    `,
    files: [
      '/web/next.config.ts',
      '/web/src/middleware.ts',
      '/web/src/proxy.ts',
      '/backend/src/worker.js',
    ],
    estimate: '1 hour',
    assignedTo: 'Engineer-C',
    blockedBy: [],
    blocks: [],
    impact: 'HIGH - Improves production stability',
  },

  {
    id: 'TASK-004',
    title: 'Add Loading & Not-Found States - UX Polish',
    priority: 'P1',
    status: 'pending',
    description: `
      Missing loading states and 404 pages = poor UX during navigation.

      CREATE FILES:
      1. /web/src/app/loading.tsx (global loading spinner)
      2. /web/src/app/not-found.tsx (branded 404 page)
      3. /web/src/app/blog/loading.tsx (blog loading)
      4. /web/src/app/blog/[slug]/not-found.tsx (article not found)

      DESIGN:
      - Match NEXUS Alert dark theme (#0a0a0a bg, #3b82f6 accent)
      - Smooth spinner animation
      - Clear messaging
      - CTA to return home

      ACCEPTANCE CRITERIA:
      - Navigation shows loading state
      - Invalid URLs show branded 404
      - No blank screens
    `,
    files: [
      '/web/src/app/loading.tsx',
      '/web/src/app/not-found.tsx',
      '/web/src/app/blog/loading.tsx',
      '/web/src/app/blog/[slug]/not-found.tsx',
    ],
    estimate: '1.5 hours',
    assignedTo: 'Engineer-D',
    blockedBy: [],
    blocks: [],
    impact: 'HIGH - Improves perceived performance',
  },

  {
    id: 'TASK-005',
    title: 'Complete Testimonial Submission Flow - Social Proof',
    priority: 'P1',
    status: 'pending',
    description: `
      Testimonials currently console.log() only - no persistence, no user feedback.

      IMPLEMENTATION:
      1. Create /backend/src/testimonials.js endpoint
      2. Add Cloudflare D1 table for testimonials
      3. Store submission data (name, email, story, program, wait time)
      4. Send confirmation email via Resend
      5. Generate Premium reward code
      6. Add success toast to form component
      7. Create admin view for testimonial moderation

      ACCEPTANCE CRITERIA:
      - Submissions stored in D1
      - User receives confirmation email
      - Premium code delivered
      - Toast notification shows success
      - No data loss
    `,
    files: [
      '/backend/src/worker.js',
      '/backend/src/testimonials.js',
      '/backend/wrangler.toml',
      '/web/src/app/components/TestimonialForm.tsx',
    ],
    estimate: '3 hours',
    assignedTo: 'Engineer-A',
    blockedBy: ['TASK-001'],
    blocks: [],
    impact: 'HIGH - Increases conversions via social proof',
  },

  {
    id: 'TASK-006',
    title: 'Add PWA Manifest - Mobile UX',
    priority: 'P1',
    status: 'pending',
    description: `
      No PWA manifest = cannot "Add to Home Screen" on mobile.

      CREATE:
      1. /web/public/manifest.json with app metadata
      2. Generate 192x192 and 512x512 icons
      3. Add manifest link to layout.tsx
      4. Add theme-color meta tags
      5. Test on iOS Safari and Android Chrome

      OPTIONAL:
      - Add service worker for offline support
      - Cache static assets

      ACCEPTANCE CRITERIA:
      - "Add to Home Screen" prompt appears on mobile
      - App installs successfully
      - Icon and name display correctly
      - Lighthouse PWA score > 80
    `,
    files: [
      '/web/public/manifest.json',
      '/web/public/icon-192.png',
      '/web/public/icon-512.png',
      '/web/src/app/layout.tsx',
    ],
    estimate: '2 hours',
    assignedTo: 'Engineer-B',
    blockedBy: [],
    blocks: [],
    impact: 'HIGH - Improves mobile retention',
  },

  {
    id: 'TASK-007',
    title: 'Bundle Size Reduction & Code Splitting - Performance',
    priority: 'P2',
    status: 'pending',
    description: `
      Large bundle size slows initial load. Target: <150KB gzipped.

      OPTIMIZATIONS:
      1. Install @next/bundle-analyzer
      2. Analyze bundle composition
      3. Lazy load PricingSection, FAQ, Testimonials
      4. Replace Recharts (200KB) with lightweight chart library
      5. Tree-shake unused next-intl locales
      6. Enable SWC minification
      7. Remove duplicate dependencies

      TARGETS:
      - Initial JS bundle: < 150KB gzipped
      - Lighthouse Performance: > 90
      - First Contentful Paint: < 1.2s
      - Largest Contentful Paint: < 2.5s

      ACCEPTANCE CRITERIA:
      - Bundle size reduced by 40%+
      - Lighthouse score improved
      - No regressions
    `,
    files: [
      '/web/next.config.ts',
      '/web/src/app/page.tsx',
      '/web/src/app/components/PricingSection.tsx',
      '/web/package.json',
    ],
    estimate: '4 hours',
    assignedTo: 'Engineer-C',
    blockedBy: [],
    blocks: [],
    impact: 'MEDIUM - Improves conversion via speed',
  },

  {
    id: 'TASK-008',
    title: 'Add Performance Monitoring - Analytics',
    priority: 'P2',
    status: 'pending',
    description: `
      No visibility into Core Web Vitals or performance regressions.

      IMPLEMENTATION:
      1. Install @vercel/analytics and @vercel/speed-insights
      2. Add to layout.tsx
      3. Track custom metrics (CLS, LCP, FID, TTFB)
      4. Create performance dashboard
      5. Set up alerts for regressions

      METRICS TO TRACK:
      - Largest Contentful Paint (LCP)
      - Cumulative Layout Shift (CLS)
      - First Input Delay (FID)
      - Time to First Byte (TTFB)
      - Route change performance

      ACCEPTANCE CRITERIA:
      - Real User Monitoring (RUM) active
      - Dashboard shows Core Web Vitals
      - Alerts configured for p95 regressions
    `,
    files: [
      '/web/package.json',
      '/web/src/app/layout.tsx',
      '/web/src/lib/analytics.ts',
    ],
    estimate: '2 hours',
    assignedTo: 'Engineer-D',
    blockedBy: [],
    blocks: [],
    impact: 'MEDIUM - Prevents performance regressions',
  },

  {
    id: 'TASK-009',
    title: 'WCAG 2.1 AA Compliance - Accessibility',
    priority: 'P2',
    status: 'pending',
    description: `
      Accessibility issues found during audit.

      FIXES:
      1. Add skip-to-content links on all pages (not just homepage)
      2. Fix table semantics: <th scope="row"> for row headers
      3. Add ARIA live regions for form validation errors
      4. Run color contrast audit (target: 4.5:1 minimum)
      5. Add focus indicators on all interactive elements
      6. Add aria-label or aria-hidden to decorative SVGs
      7. Test keyboard navigation flow
      8. Run axe-core automated tests

      ACCEPTANCE CRITERIA:
      - 0 critical axe-core violations
      - Lighthouse Accessibility score > 95
      - Full keyboard navigation support
      - Screen reader testing passes
    `,
    files: [
      '/web/src/app/page.tsx',
      '/web/src/app/components/PricingSection.tsx',
      '/web/src/app/global-entry/page.tsx',
      '/web/src/styles/globals.css',
    ],
    estimate: '3 hours',
    assignedTo: 'Engineer-A',
    blockedBy: [],
    blocks: [],
    impact: 'MEDIUM - Legal compliance, inclusive design',
  },

  {
    id: 'TASK-010',
    title: 'Comprehensive Test Coverage - Quality',
    priority: 'P2',
    status: 'pending',
    description: `
      Test coverage < 5%. Target: 60%+.

      ADD TESTS:
      1. Extension E2E:
         - tests/popup.test.js (UI interactions)
         - tests/notifications.test.js (notification flow)
         - tests/slot-filtering.test.js (date/time filtering)

      2. Landing page unit tests:
         - web/src/app/__tests__/page.test.tsx
         - web/src/app/components/__tests__/PricingSection.test.tsx

      3. Backend integration:
         - backend/tests/testimonials.test.js
         - backend/tests/stripe-webhooks.test.js

      4. Accessibility:
         - web/src/__tests__/accessibility.test.ts (axe-core)

      ACCEPTANCE CRITERIA:
      - 60%+ code coverage
      - All critical paths tested
      - CI/CD integration
      - Tests pass on every commit
    `,
    files: [
      '/tests/popup.test.js',
      '/tests/notifications.test.js',
      '/web/src/app/__tests__/page.test.tsx',
      '/backend/tests/testimonials.test.js',
    ],
    estimate: '6 hours',
    assignedTo: 'Engineer-B',
    blockedBy: [],
    blocks: [],
    impact: 'MEDIUM - Prevents regressions',
  },
];

// ─── DISPATCH TASKS ──────────────────────────────────────────────────

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║   NEXUS Alert - Sprint Iteration 2 Task Dispatch              ║');
console.log('║   CEO: Michael Guo                                             ║');
console.log('║   Target: Fix blockers, ship to Chrome Web Store              ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// Group by priority
const p0Tasks = tasks.filter(t => t.priority === 'P0');
const p1Tasks = tasks.filter(t => t.priority === 'P1');
const p2Tasks = tasks.filter(t => t.priority === 'P2');

console.log('📊 SPRINT SUMMARY\n');
console.log(`  Total Tasks: ${tasks.length}`);
console.log(`  🔴 P0 (Critical): ${p0Tasks.length}`);
console.log(`  🟠 P1 (High): ${p1Tasks.length}`);
console.log(`  🔵 P2 (Medium): ${p2Tasks.length}`);
console.log(`  Total Effort: ${tasks.reduce((sum, t) => sum + parseFloat(t.estimate), 0).toFixed(1)} hours\n`);

// Group by engineer
const engineerA = tasks.filter(t => t.assignedTo === 'Engineer-A');
const engineerB = tasks.filter(t => t.assignedTo === 'Engineer-B');
const engineerC = tasks.filter(t => t.assignedTo === 'Engineer-C');
const engineerD = tasks.filter(t => t.assignedTo === 'Engineer-D');

console.log('👥 ENGINEER ASSIGNMENTS\n');
console.log(`  Engineer-A: ${engineerA.length} tasks (${engineerA.reduce((s, t) => s + parseFloat(t.estimate), 0).toFixed(1)}h)`);
console.log(`  Engineer-B: ${engineerB.length} tasks (${engineerB.reduce((s, t) => s + parseFloat(t.estimate), 0).toFixed(1)}h)`);
console.log(`  Engineer-C: ${engineerC.length} tasks (${engineerC.reduce((s, t) => s + parseFloat(t.estimate), 0).toFixed(1)}h)`);
console.log(`  Engineer-D: ${engineerD.length} tasks (${engineerD.reduce((s, t) => s + parseFloat(t.estimate), 0).toFixed(1)}h)\n`);

console.log('═══════════════════════════════════════════════════════════════\n');

// Print tasks by priority
console.log('🔴 P0 CRITICAL BLOCKERS (Day 1)\n');
p0Tasks.forEach(task => {
  console.log(`  ${task.id} - ${task.title}`);
  console.log(`    Assigned: ${task.assignedTo} | Estimate: ${task.estimate} | Impact: ${task.impact}`);
  if (task.blockedBy.length > 0) {
    console.log(`    ⚠️  Blocked by: ${task.blockedBy.join(', ')}`);
  }
  if (task.blocks.length > 0) {
    console.log(`    🚧 Blocks: ${task.blocks.join(', ')}`);
  }
  console.log('');
});

console.log('🟠 P1 HIGH-IMPACT UX (Day 2)\n');
p1Tasks.forEach(task => {
  console.log(`  ${task.id} - ${task.title}`);
  console.log(`    Assigned: ${task.assignedTo} | Estimate: ${task.estimate} | Impact: ${task.impact}`);
  if (task.blockedBy.length > 0) {
    console.log(`    ⚠️  Blocked by: ${task.blockedBy.join(', ')}`);
  }
  console.log('');
});

console.log('🔵 P2 PERFORMANCE & QUALITY (Day 3)\n');
p2Tasks.forEach(task => {
  console.log(`  ${task.id} - ${task.title}`);
  console.log(`    Assigned: ${task.assignedTo} | Estimate: ${task.estimate} | Impact: ${task.impact}`);
  console.log('');
});

console.log('═══════════════════════════════════════════════════════════════\n');
console.log('🎯 CRITICAL PATH\n');
console.log('  1. Fix Turbopack build (TASK-001) → Blocks deployment');
console.log('  2. Replace EXTENSION_ID (TASK-002) → Blocks revenue');
console.log('  3. Fix Next.js warnings (TASK-003) → Production quality');
console.log('  4. Complete testimonials (TASK-005) → Social proof');
console.log('  5. Add PWA manifest (TASK-006) → Mobile retention\n');

console.log('📅 TIMELINE\n');
console.log('  Day 1: All P0 tasks complete (4 hours total)');
console.log('  Day 2: All P1 tasks complete (6.5 hours total)');
console.log('  Day 3: All P2 tasks complete (15 hours total)');
console.log('  Day 4: QA, staging deployment, final review\n');

console.log('✅ SUCCESS CRITERIA\n');
console.log('  • Build completes with 0 errors/warnings');
console.log('  • All CTAs link to Chrome Web Store');
console.log('  • Lighthouse Performance > 90');
console.log('  • Lighthouse Accessibility > 95');
console.log('  • Test coverage > 60%');
console.log('  • Ready for revenue launch\n');

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║   Engineers: Start with your P0 task immediately              ║');
console.log('║   Report blockers in #eng-nexus-alert Slack channel           ║');
console.log('║   Daily standup: 9am PT, 15min max                             ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// Export tasks for tracking
const fs = require('fs');
fs.writeFileSync(
  'sprint-tasks.json',
  JSON.stringify(tasks, null, 2)
);
console.log('📝 Task manifest saved to: sprint-tasks.json\n');
