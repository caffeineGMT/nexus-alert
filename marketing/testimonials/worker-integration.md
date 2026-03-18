# Worker Integration Guide

## Add Testimonial Endpoints to Cloudflare Worker

### 1. Import testimonial handlers

Add this to the top of `backend/src/worker.js`:

```javascript
import {
  handleTestimonialSubmission,
  handleGetTestimonials,
  handleApproveTestimonial,
  handleRejectTestimonial,
} from './testimonials.js';
```

### 2. Add public endpoint (before auth check)

Add this around line 95-100, in the **public endpoints section** (before the auth check):

```javascript
// Testimonial submission (public)
if (url.pathname === '/api/testimonials' && request.method === 'POST') {
  return await handleTestimonialSubmission(request, env, corsHeaders);
}
```

### 3. Add admin endpoints (after auth check)

Add this around line 130-140, in the **authenticated endpoints section**:

```javascript
// Admin: Get all testimonials
if (url.pathname === '/api/admin/testimonials' && request.method === 'GET') {
  const status = url.searchParams.get('status');
  return await handleGetTestimonials(env, corsHeaders, status);
}

// Admin: Approve testimonial
if (url.pathname === '/api/admin/testimonials/approve' && request.method === 'POST') {
  return await handleApproveTestimonial(request, env, corsHeaders);
}

// Admin: Reject testimonial
if (url.pathname === '/api/admin/testimonials/reject' && request.method === 'POST') {
  return await handleRejectTestimonial(request, env, corsHeaders);
}
```

### 4. Add KV namespace to wrangler.toml

Add this to `backend/wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "TESTIMONIALS"
id = "YOUR_KV_NAMESPACE_ID"  # Create this with: wrangler kv:namespace create "TESTIMONIALS"
```

### 5. Create KV namespace

Run these commands in the `backend/` directory:

```bash
# Production namespace
wrangler kv:namespace create "TESTIMONIALS"

# Dev namespace (optional)
wrangler kv:namespace create "TESTIMONIALS" --preview
```

Copy the namespace IDs into `wrangler.toml`.

### 6. Deploy

```bash
cd backend
npm run deploy
```

### 7. Test the endpoints

**Submit a test testimonial:**
```bash
curl -X POST https://YOUR-WORKER.workers.dev/api/testimonials \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "location": "Vancouver, BC",
    "program": "NEXUS",
    "timeToFind": "3 days",
    "story": "This is a test testimonial",
    "permissionToShare": true
  }'
```

**Get testimonials (admin):**
```bash
curl https://YOUR-WORKER.workers.dev/api/admin/testimonials \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET"
```

**Approve testimonial (admin):**
```bash
curl -X POST https://YOUR-WORKER.workers.dev/api/admin/testimonials/approve \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"id": "testimonial_123", "premiumMonths": 3}'
```

---

## Complete Integration Checklist

- [ ] Import testimonial handlers in worker.js
- [ ] Add public `/api/testimonials` POST endpoint
- [ ] Add admin GET endpoint `/api/admin/testimonials`
- [ ] Add admin POST endpoint `/api/admin/testimonials/approve`
- [ ] Add admin POST endpoint `/api/admin/testimonials/reject`
- [ ] Create TESTIMONIALS KV namespace
- [ ] Add KV binding to wrangler.toml
- [ ] Deploy worker
- [ ] Test testimonial submission
- [ ] Test admin review interface
- [ ] Update form URL in `/submit-testimonial` page
- [ ] Update admin page API URL

---

## Environment Variables

Make sure these are set in your Cloudflare Worker:

- `RESEND_API_KEY` - For sending email notifications
- `WEBHOOK_SECRET` - For admin authentication

Check with:
```bash
wrangler secret list
```

Set with:
```bash
wrangler secret put RESEND_API_KEY
wrangler secret put WEBHOOK_SECRET
```
