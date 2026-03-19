# SPRINT 1: Production Blockers (Week 1)
**Goal:** Fix critical issues preventing deployment
**Duration:** 2 days (~15 hours)
**Priority:** CRITICAL - MUST COMPLETE BEFORE ANY OTHER WORK

---

## Task 1: Fix Web Build (BLOCKING)
**Priority:** P0 🔴
**Time:** 2 hours
**Blocking:** All web deployments

### Problem
Next.js 16 deprecated `middleware.ts` → `proxy.ts`. Build currently fails with Turbopack error.

### Steps
1. Rename `/web/src/middleware.ts` → `/web/src/proxy.ts`
2. Update `next.config.ts`:
   - Remove `experimental.instrumentationHook` (line 12-14)
   - Add `turbopack.root: '/Users/michaelguo/nexus-alert/web'` to silence lockfile warning
3. Update Sentry config in `next.config.ts`:
   - Replace `disableLogger: true` → `webpack: { treeshake: { removeDebugLogging: true } }`
   - Replace `automaticVercelMonitors: true` → `webpack: { automaticVercelMonitors: true }`
4. Test build:
   ```bash
   cd /Users/michaelguo/nexus-alert/web
   npm run build
   ```
5. Verify build completes with ZERO errors

### Success Criteria
- ✅ Build completes successfully
- ✅ No Turbopack errors
- ✅ No deprecation warnings
- ✅ Output bundle size < 2MB

---

## Task 2: Chrome Web Store Submission
**Priority:** P0 🔴
**Time:** 4 hours
**Blocking:** Organic user acquisition

### Problem
Extension not published to Chrome Web Store. All CTAs link to placeholder URL.

### Steps
1. **Prepare submission package:**
   ```bash
   cd /Users/michaelguo/nexus-alert
   npm run package
   ```
   Upload `nexus-alert-chrome.zip`

2. **Use optimized store assets** from `/store-assets/`:
   - Screenshots: `chrome-web-store-screenshot-*.png` (1280x800)
   - Promo tiles: `marquee-promo-tile.png` (1400x560), `small-promo-tile.png` (440x280)
   - Store icon: `store-icon-128.png`

3. **Store listing copy** (use `/store-assets/CHROME-WEB-STORE-LISTING-OPTIMIZED-2026.txt`):
   - Copy optimized title, description, and feature bullets
   - Verify character limits: Title < 75 chars, Short description < 132 chars

4. **Submit to Chrome Web Store:**
   - Go to https://chrome.google.com/webstore/devconsole
   - Create new item, upload ZIP
   - Fill in all metadata fields
   - Submit for review (expect 1-3 day review time)

5. **Once approved**, copy the extension ID from the store URL:
   ```
   https://chrome.google.com/webstore/detail/nexus-alert/[EXTENSION_ID]
   ```

### Success Criteria
- ✅ Extension submitted to Chrome Web Store
- ✅ All required fields completed
- ✅ Screenshots and graphics uploaded
- ✅ Review process initiated

---

## Task 3: Replace EXTENSION_ID Placeholders
**Priority:** P0 🔴
**Time:** 1 hour
**Depends On:** Task 2 (need actual extension ID)

### Problem
All landing page CTAs link to placeholder URL with `EXTENSION_ID`.

### Steps
1. **Find all instances:**
   ```bash
   cd /Users/michaelguo/nexus-alert
   grep -r "EXTENSION_ID" web/src/
   ```

2. **Replace in these files:**
   - `/web/src/app/page.tsx` (4 instances - lines 119, 151, 394, 502)
   - Any other files found in grep results

3. **Replace with actual extension ID:**
   ```tsx
   // OLD
   href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID"

   // NEW
   href="https://chrome.google.com/webstore/detail/nexus-alert/abcdefghijklmnop"
   ```

4. **Update manifest.json** `externally_connectable`:
   ```json
   "externally_connectable": {
     "matches": [
       "https://nexus-alert.com/*"
     ],
     "ids": ["abcdefghijklmnop"]
   }
   ```

### Success Criteria
- ✅ Zero instances of `EXTENSION_ID` remain
- ✅ All links point to actual Chrome Web Store listing
- ✅ Extension ID added to manifest.json

---

## Task 4: Add API Rate Limiting
**Priority:** P1 🟠
**Time:** 3 hours
**Security:** DoS vulnerability

### Problem
Backend API has no rate limiting. Vulnerable to abuse and DoS attacks.

### Steps
1. **Install rate limiting package:**
   ```bash
   cd /Users/michaelguo/nexus-alert/backend
   npm install toucan-js@3
   ```

2. **Create rate limiter helper** (`/backend/src/rate-limiter.js`):
   ```javascript
   export class RateLimiter {
     constructor(env) {
       this.env = env;
     }

     async checkLimit(ip, endpoint, limit = 10, windowMs = 60000) {
       const key = `ratelimit:${endpoint}:${ip}`;
       const current = parseInt(await this.env.NEXUS_ALERTS_KV.get(key) || '0');

       if (current >= limit) {
         throw new Error('Rate limit exceeded');
       }

       await this.env.NEXUS_ALERTS_KV.put(
         key,
         String(current + 1),
         { expirationTtl: Math.floor(windowMs / 1000) }
       );
     }
   }
   ```

3. **Apply to sensitive endpoints** in `/backend/src/worker.js`:
   ```javascript
   // Before handling request
   const ip = request.headers.get('CF-Connecting-IP');
   const limiter = new RateLimiter(env);

   // Different limits per endpoint
   if (url.pathname === '/api/subscribe') {
     await limiter.checkLimit(ip, 'subscribe', 5, 60000); // 5/min
   } else if (url.pathname === '/api/checkout') {
     await limiter.checkLimit(ip, 'checkout', 3, 60000); // 3/min
   } else if (url.pathname.startsWith('/api/')) {
     await limiter.checkLimit(ip, 'general', 30, 60000); // 30/min
   }
   ```

4. **Test rate limiting:**
   ```bash
   # Should succeed
   curl -X POST https://api.nexus-alert.com/api/activity \
     -H "Content-Type: application/json" \
     -d '{"type":"test"}'

   # Run 31 times rapidly - last request should fail with 429
   ```

### Success Criteria
- ✅ Rate limiter implemented and tested
- ✅ Sensitive endpoints protected
- ✅ Returns 429 status with clear error message
- ✅ No impact on normal users (limits are generous)

---

## Task 5: Fix CORS to Whitelist Origins
**Priority:** P1 🟠
**Time:** 1 hour
**Security:** CSRF vulnerability

### Problem
Backend allows requests from any origin (`Access-Control-Allow-Origin: *`).

### Steps
1. **Update CORS logic** in `/backend/src/worker.js`:
   ```javascript
   // BEFORE (line 100)
   const corsHeaders = {
     'Access-Control-Allow-Origin': '*',
     ...
   };

   // AFTER
   const origin = request.headers.get('Origin');
   const ALLOWED_ORIGINS = [
     'https://nexus-alert.com',
     'https://www.nexus-alert.com',
     'https://staging.nexus-alert.com', // If you have staging
     `chrome-extension://YOUR_EXTENSION_ID_HERE` // From Task 3
   ];

   const corsHeaders = {
     'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin)
       ? origin
       : 'https://nexus-alert.com',
     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
     'Access-Control-Allow-Headers': 'Content-Type, Authorization, Stripe-Signature',
     'Access-Control-Allow-Credentials': 'true',
   };
   ```

2. **Test from allowed origin:**
   ```bash
   curl -X POST https://api.nexus-alert.com/api/activity \
     -H "Origin: https://nexus-alert.com" \
     -H "Content-Type: application/json" \
     -d '{"type":"test"}'

   # Should succeed and return CORS header with nexus-alert.com
   ```

3. **Test from disallowed origin:**
   ```bash
   curl -X POST https://api.nexus-alert.com/api/activity \
     -H "Origin: https://evil.com" \
     -H "Content-Type: application/json" \
     -d '{"type":"test"}'

   # Should still work but return default origin (not evil.com)
   ```

### Success Criteria
- ✅ Only whitelisted origins allowed
- ✅ Extension can make requests (after adding extension ID)
- ✅ Landing page can make requests
- ✅ Random domains cannot make requests

---

## Task 6: Add robots.txt and sitemap.xml
**Priority:** P1 🟠
**Time:** 2 hours
**SEO Impact:** High

### Problem
No robots.txt or sitemap.xml. Search engines may not index pages correctly.

### Steps
1. **Create `/web/public/robots.txt`:**
   ```txt
   # Allow all crawlers
   User-agent: *
   Allow: /

   # Sitemap location
   Sitemap: https://nexus-alert.com/sitemap.xml

   # Crawl delay (be nice to servers)
   Crawl-delay: 1
   ```

2. **Generate sitemap.xml** dynamically (or static if no blog):

   **Option A: Static sitemap** (`/web/public/sitemap.xml`):
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://nexus-alert.com/</loc>
       <lastmod>2026-03-19</lastmod>
       <changefreq>weekly</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>https://nexus-alert.com/how-it-works</loc>
       <lastmod>2026-03-19</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>https://nexus-alert.com/privacy</loc>
       <lastmod>2026-03-19</lastmod>
       <changefreq>yearly</changefreq>
       <priority>0.3</priority>
     </url>
     <url>
       <loc>https://nexus-alert.com/terms</loc>
       <lastmod>2026-03-19</lastmod>
       <changefreq>yearly</changefreq>
       <priority>0.3</priority>
     </url>
     <!-- Add all blog posts from /web/src/app/blog/* -->
   </urlset>
   ```

   **Option B: Dynamic sitemap** (better for blogs) - create `/web/src/app/sitemap.ts`:
   ```typescript
   import { MetadataRoute } from 'next';

   export default function sitemap(): MetadataRoute.Sitemap {
     return [
       {
         url: 'https://nexus-alert.com',
         lastModified: new Date(),
         changeFrequency: 'weekly',
         priority: 1,
       },
       {
         url: 'https://nexus-alert.com/how-it-works',
         lastModified: new Date(),
         changeFrequency: 'monthly',
         priority: 0.8,
       },
       // Auto-generate from blog directory
       // TODO: read /web/src/app/blog/* and add entries
     ];
   }
   ```

3. **Verify files are accessible:**
   ```bash
   # After deployment
   curl https://nexus-alert.com/robots.txt
   curl https://nexus-alert.com/sitemap.xml
   ```

4. **Submit sitemap to Google Search Console:**
   - Go to https://search.google.com/search-console
   - Add property: nexus-alert.com
   - Submit sitemap: https://nexus-alert.com/sitemap.xml

### Success Criteria
- ✅ robots.txt accessible at root
- ✅ sitemap.xml accessible at root
- ✅ Sitemap submitted to Google Search Console
- ✅ All pages included in sitemap

---

## Task 7: Create PWA Manifest
**Priority:** P1 🟠
**Time:** 2 hours
**UX Impact:** Installability, offline support

### Problem
No PWA manifest. Users cannot "Add to Home Screen" on mobile.

### Steps
1. **Create `/web/public/manifest.json`:**
   ```json
   {
     "name": "NEXUS Alert - Appointment Tracker",
     "short_name": "NEXUS Alert",
     "description": "Find NEXUS and Global Entry appointment slots fast",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#0a0a0a",
     "theme_color": "#3b82f6",
     "orientation": "portrait-primary",
     "icons": [
       {
         "src": "/icons/icon-72.png",
         "sizes": "72x72",
         "type": "image/png",
         "purpose": "any"
       },
       {
         "src": "/icons/icon-96.png",
         "sizes": "96x96",
         "type": "image/png",
         "purpose": "any"
       },
       {
         "src": "/icons/icon-128.png",
         "sizes": "128x128",
         "type": "image/png",
         "purpose": "any"
       },
       {
         "src": "/icons/icon-144.png",
         "sizes": "144x144",
         "type": "image/png",
         "purpose": "any"
       },
       {
         "src": "/icons/icon-192.png",
         "sizes": "192x192",
         "type": "image/png",
         "purpose": "any maskable"
       },
       {
         "src": "/icons/icon-512.png",
         "sizes": "512x512",
         "type": "image/png",
         "purpose": "any maskable"
       }
     ]
   }
   ```

2. **Generate icon sizes** (if not already in `/web/public/icons/`):
   ```bash
   # Use existing icon from extension
   cp /Users/michaelguo/nexus-alert/icons/icon128.png /Users/michaelguo/nexus-alert/web/public/icons/icon-128.png

   # Generate other sizes (requires imagemagick)
   cd /Users/michaelguo/nexus-alert/web/public/icons
   convert icon-128.png -resize 72x72 icon-72.png
   convert icon-128.png -resize 96x96 icon-96.png
   convert icon-128.png -resize 144x144 icon-144.png
   convert icon-128.png -resize 192x192 icon-192.png
   convert icon-128.png -resize 512x512 icon-512.png
   ```

3. **Link manifest in layout** (`/web/src/app/layout.tsx`):
   ```tsx
   <head>
     {/* Add after line 107 */}
     <link rel="manifest" href="/manifest.json" />
     <meta name="theme-color" content="#3b82f6" />
     <meta name="mobile-web-app-capable" content="yes" />
     <meta name="apple-mobile-web-app-capable" content="yes" />
     <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
     <meta name="apple-mobile-web-app-title" content="NEXUS Alert" />
     <link rel="apple-touch-icon" href="/icons/icon-192.png" />
   </head>
   ```

4. **Test PWA installability:**
   - Open https://nexus-alert.com in Chrome DevTools
   - Application tab → Manifest → Verify all fields load
   - Lighthouse audit → PWA section → Should pass installability checks

### Success Criteria
- ✅ Manifest loads without errors
- ✅ All icons load correctly
- ✅ Lighthouse PWA audit passes
- ✅ "Add to Home Screen" prompt appears on mobile

---

## Sprint 1 Completion Checklist

- [ ] Task 1: Web build fixed ✅
- [ ] Task 2: Chrome Web Store submission complete 📤
- [ ] Task 3: All EXTENSION_ID placeholders replaced 🔗
- [ ] Task 4: API rate limiting implemented 🛡️
- [ ] Task 5: CORS whitelisted 🔒
- [ ] Task 6: robots.txt + sitemap.xml added 🗺️
- [ ] Task 7: PWA manifest created 📱

**Deployment Gate:**
Only proceed to production deployment after ALL Sprint 1 tasks are complete.

---

## Post-Sprint 1 Deployment

Once all tasks complete:

1. **Deploy to Vercel:**
   ```bash
   cd /Users/michaelguo/nexus-alert/web
   npm run build
   # Manually deploy to Vercel (as per CLAUDE.md workflow)
   ```

2. **Deploy backend:**
   ```bash
   cd /Users/michaelguo/nexus-alert/backend
   wrangler deploy
   ```

3. **Verify production:**
   - [ ] Landing page loads: https://nexus-alert.com
   - [ ] Extension installs from Chrome Web Store
   - [ ] API endpoints return 200 (health check)
   - [ ] Rate limiting works (test with 31 rapid requests)
   - [ ] CORS blocks non-whitelisted origins
   - [ ] robots.txt and sitemap.xml accessible
   - [ ] PWA manifest loads

---

*Sprint 1 Tasks Generated: March 19, 2026*
*Estimated Completion: 2 days*
*Next Sprint: Sprint 2 - Quality & Security*
