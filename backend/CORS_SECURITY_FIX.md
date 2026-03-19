# CORS Security Fix Documentation

## Problem

**CRITICAL SECURITY VULNERABILITY**: The Cloudflare Worker backend was using a wildcard CORS policy:

```javascript
// ❌ VULNERABLE CODE (BEFORE)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',  // ANY website can access our API!
  // ... other headers
};
```

### Security Risks

1. **Data Exfiltration**: Any malicious website could make requests to our API and steal user data
2. **CSRF Attacks**: Attackers could trick users into making unwanted API calls
3. **Privacy Violation**: User subscription data, email addresses, and payment info could be accessed from unauthorized domains
4. **Phishing**: Attackers could clone the frontend and point it to our backend

### Attack Scenario Example

```javascript
// Attacker's website: https://evil.com
fetch('https://worker.nexus-alert.com/api/subscribers', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer stolen-token' }
})
.then(r => r.json())
.then(data => {
  // Attacker now has all subscriber emails!
  console.log('Stolen subscriber list:', data);
  sendToAttackerServer(data);
});
```

With wildcard CORS (`*`), the browser would **allow** this request, and the attacker could steal data.

---

## Solution

### 1. Origin Whitelist

Created an explicit whitelist of allowed origins:

```javascript
// ✅ SECURE CODE (AFTER)
const ALLOWED_ORIGINS = [
  'https://nexus-alert.com',
  'https://www.nexus-alert.com',
  // TODO: Add actual Chrome extension ID once published
  // 'chrome-extension://YOUR_ACTUAL_EXTENSION_ID'
];
```

### 2. Origin Validation

Validate incoming Origin header against whitelist:

```javascript
const requestOrigin = request.headers.get('Origin');
const allowedOrigin = ALLOWED_ORIGINS.includes(requestOrigin)
  ? requestOrigin  // If whitelisted, echo back their origin
  : ALLOWED_ORIGINS[0];  // Otherwise, return default origin
```

### 3. Dynamic CORS Headers

```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,  // SPECIFIC origin, never '*'
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Stripe-Signature',
  'Access-Control-Max-Age': '86400', // 24 hours cache for preflight
};
```

### 4. Preflight Handling

OPTIONS requests properly handled:

```javascript
if (request.method === 'OPTIONS') {
  return new Response(null, { headers: corsHeaders });
}
```

### 5. All Responses Include CORS

- ✅ Success responses: `json({ ... }, 200, corsHeaders)`
- ✅ Error responses: `json({ error: '...' }, 401, corsHeaders)`
- ✅ 404/500 responses: All include `corsHeaders`
- ✅ Handler functions: Receive and use `corsHeaders` parameter

---

## Testing

### Automated Tests

Run the test suite:

```bash
cd backend
npm test -- cors-security.test.js
```

**Test Coverage:**
- ✅ Whitelisted origins accepted (nexus-alert.com, www.nexus-alert.com)
- ✅ Unauthorized origins rejected (evil.com, localhost, etc.)
- ✅ No Origin header falls back to default
- ✅ Never returns wildcard `*`
- ✅ OPTIONS preflight handled
- ✅ Phishing domain attacks blocked
- ✅ Data exfiltration attempts blocked

### Manual Testing

```bash
cd backend
./test-cors-security.sh
```

This script tests:
1. Allowed origins (should echo origin back)
2. Unauthorized origins (should fall back to default)
3. No wildcard in any response
4. OPTIONS preflight works

### Local Development Testing

```bash
# Terminal 1: Start worker
cd backend
wrangler dev

# Terminal 2: Test with curl
curl -H "Origin: https://evil.com" http://localhost:8787/api/health -i
# Should see: Access-Control-Allow-Origin: https://nexus-alert.com (NOT evil.com)

curl -H "Origin: https://nexus-alert.com" http://localhost:8787/api/health -i
# Should see: Access-Control-Allow-Origin: https://nexus-alert.com
```

### Browser Console Testing

Try to make a request from unauthorized domain:

```javascript
// Open https://example.com in browser, then run in console:
fetch('https://worker.nexus-alert.com/api/health')
  .then(r => r.json())
  .catch(err => console.log('BLOCKED:', err));

// Expected result: CORS error (blocked by browser)
// Console: "Access to fetch at '...' from origin 'https://example.com'
//           has been blocked by CORS policy"
```

---

## Security Validation

### Before (VULNERABLE)

```http
GET /api/subscribers HTTP/1.1
Origin: https://evil.com

HTTP/1.1 200 OK
Access-Control-Allow-Origin: *  ❌ DANGEROUS
Content-Type: application/json

{"subscribers": [...]}  # Attacker can read this!
```

### After (SECURE)

```http
GET /api/subscribers HTTP/1.1
Origin: https://evil.com

HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://nexus-alert.com  ✅ SECURE
Content-Type: application/json

{"subscribers": [...]}  # Browser blocks this response!
```

Browser sees mismatch:
- Request Origin: `https://evil.com`
- Response CORS: `https://nexus-alert.com`
- Result: **Browser blocks the response** → Attack fails

---

## Chrome Extension Support

When the Chrome extension is published, update the whitelist:

```javascript
const ALLOWED_ORIGINS = [
  'https://nexus-alert.com',
  'https://www.nexus-alert.com',
  'chrome-extension://abcdefghijklmnopqrstuvwxyz123456', // Real extension ID
];
```

Get the extension ID from Chrome Web Store after publishing.

---

## Production Deployment

### Checklist

- ✅ Code updated in `/backend/src/worker.js`
- ✅ All tests pass (`npm test`)
- ✅ CORS test suite passes
- ✅ Manual testing completed
- ✅ No wildcard `*` in codebase
- ✅ Committed to Git
- 🔲 Deployed to Cloudflare (manual deployment by Michael)

### Post-Deployment Verification

After deployment, verify in production:

```bash
# Should return nexus-alert.com (NOT evil.com)
curl -H "Origin: https://evil.com" https://worker.nexus-alert.com/api/health -i | grep -i "access-control"

# Should return nexus-alert.com
curl -H "Origin: https://nexus-alert.com" https://worker.nexus-alert.com/api/health -i | grep -i "access-control"
```

---

## Impact

### Security Improvements

- 🔒 **Prevents data theft** from unauthorized domains
- 🛡️ **Blocks CSRF attacks** via CORS enforcement
- 🚫 **Stops phishing attempts** that point to our API
- ✅ **Zero trust model**: Only explicitly whitelisted origins allowed

### User Impact

- ✅ **No breaking changes** for legitimate users
- ✅ Website (nexus-alert.com) works normally
- ✅ Chrome extension (when published) will work after adding ID
- ✅ Legitimate API access unchanged

### Performance

- ⚡ **Minimal overhead**: Single array lookup per request
- 📦 **Caching**: 24-hour preflight cache reduces OPTIONS requests
- 🚀 **No latency impact**: Origin check is O(1) operation

---

## Files Modified

### Core Implementation

- `/backend/src/worker.js`
  - Lines 77-84: ALLOWED_ORIGINS whitelist
  - Lines 108-119: Origin validation and CORS headers
  - Line 122: OPTIONS preflight handler

### Testing

- `/backend/tests/cors-security.test.js` (NEW)
  - 12 automated tests
  - Attack scenario validation
  - Phishing protection tests

- `/backend/test-cors-security.sh` (NEW)
  - Manual testing script
  - curl-based validation
  - Production verification tool

### Documentation

- `CORS_SECURITY_FIX.md` (this file)

---

## References

### CORS Security Best Practices

- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OWASP: CORS Misconfiguration](https://owasp.org/www-community/attacks/CORS_Misconfiguration)
- [Cloudflare: CORS Headers](https://developers.cloudflare.com/workers/examples/cors-header-proxy/)

### Cloudflare Workers

- [Workers CORS Example](https://developers.cloudflare.com/workers/examples/cors-header-proxy/)
- [Workers Security](https://developers.cloudflare.com/workers/platform/security/)

---

## Rollback Plan

If issues arise post-deployment:

```bash
# Revert to previous version (NOT RECOMMENDED - security risk)
git revert <commit-hash>
git push origin main

# Then redeploy:
cd backend
wrangler deploy
```

**WARNING**: Reverting reintroduces the security vulnerability. Only do this as a last resort.

---

## Questions & Answers

**Q: Why not use wildcard for development?**
A: Security policies should be consistent across all environments. Use localhost in whitelist if needed for development.

**Q: What if we need to support multiple subdomains?**
A: Add each subdomain explicitly to ALLOWED_ORIGINS array. Never use regex or wildcard matching.

**Q: Will this break the Chrome extension?**
A: No, there's a TODO comment placeholder. Add the real extension ID before extension launch.

**Q: What if a request has no Origin header?**
A: The code falls back to the first allowed origin (nexus-alert.com). This is safe.

**Q: Can attackers bypass this by spoofing the Origin header?**
A: No. The Origin header is set by the browser and cannot be modified by JavaScript. Server-side spoofing is irrelevant because CORS only applies to browser requests.

---

## Monitoring

### Sentry Alerts

If Sentry is configured, monitor for:
- Unusual CORS error patterns
- Requests from unexpected origins
- Failed authentication attempts

### Cloudflare Analytics

Watch for:
- Spike in OPTIONS requests (could indicate attack attempts)
- 401/403 errors from unauthorized origins
- Unusual geographic request patterns

---

**Security Status**: ✅ **RESOLVED**
**Priority**: P0 - Critical Security Fix
**Deployed**: 🔲 Pending manual deployment
**Tested**: ✅ All tests passing
