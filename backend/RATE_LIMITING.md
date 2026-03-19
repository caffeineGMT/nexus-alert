# API Rate Limiting Implementation

## Overview

This document describes the rate limiting system implemented to protect Nexus Alert API endpoints from DDoS attacks and spam abuse.

## Implementation Details

### Rate Limit Tiers

Two-tier rate limiting is implemented:

#### 1. Critical Endpoints (Per-Endpoint Limit)
- **Endpoints**: `/api/subscribe`, `/api/checkout`
- **Limit**: 10 requests per minute per IP
- **Window**: 60 seconds
- **Retry-After**: 60 seconds

#### 2. Global Limit (All Endpoints Combined)
- **Scope**: All API endpoints combined
- **Limit**: 60 requests per hour per IP
- **Window**: 3600 seconds (1 hour)
- **Retry-After**: 3600 seconds

### Technical Architecture

**Storage**: Cloudflare KV (key-value store)
- Keys: `ratelimit:{IP}:{endpoint}:{limitType}`
- TTL: Automatic expiration matching the window duration
- Values: Current request count as string

**IP Detection Priority**:
1. `CF-Connecting-IP` (Cloudflare header - most reliable)
2. `X-Real-IP`
3. `X-Forwarded-For` (first IP in chain)
4. `'unknown'` (fallback)

### Response Format

#### Success Response (Within Limit)
```json
Status: 200 OK
Headers:
  X-RateLimit-Limit: 10
  X-RateLimit-Remaining: 7
  X-RateLimit-Reset: 1710864120000
```

#### Rate Limit Exceeded Response
```json
Status: 429 Too Many Requests
Headers:
  Retry-After: 60
  X-RateLimit-Limit: 10
  X-RateLimit-Remaining: 0
  X-RateLimit-Reset: 1710864120000

Body:
{
  "error": {
    "message": "Rate limit exceeded. Please wait 60 seconds.",
    "code": "RATE_LIMIT_EXCEEDED",
    "retryAfter": 60,
    "limit": 10,
    "window": 60
  }
}
```

## Files Modified

### Created
- `/backend/src/middleware/rateLimit.js` - Core rate limiting logic
- `/backend/scripts/test-rate-limiting.sh` - Test script

### Modified
- `/backend/src/worker.js` - Integrated rate limiting into critical endpoints

## Configuration

### KV Namespace Binding
Already configured in `wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "NEXUS_ALERTS_KV"
id = "00000000000000000000000000000000"
```

**IMPORTANT**: Before deploying to production, replace the KV namespace ID with the actual production ID:
```bash
wrangler kv:namespace create NEXUS_ALERTS_KV --env production
```

### Slack Alerts
Rate limit violations on critical endpoints trigger Slack alerts if `SLACK_WEBHOOK_URL` is configured:
```bash
wrangler secret put SLACK_WEBHOOK_URL --env production
```

## Testing

### Local Testing

1. **Start local worker**:
```bash
cd backend
npm run dev
```

2. **Run rate limit test** (in separate terminal):
```bash
# Test /api/subscribe endpoint
./scripts/test-rate-limiting.sh /api/subscribe

# Test /api/checkout endpoint
./scripts/test-rate-limiting.sh /api/checkout
```

3. **Expected results**:
   - First 10 requests: 200 OK
   - 11th+ requests: 429 Too Many Requests
   - Wait 60 seconds, limits reset

### Manual Testing
```bash
# Send 11 rapid requests to subscribe endpoint
for i in {1..11}; do
  curl -X POST http://localhost:8787/api/subscribe \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"test$i@example.com\",\"locations\":[5140]}" \
    -w "\nStatus: %{http_code}\n\n"
done
```

### Production Testing
```bash
# Use production URL
API_URL=https://nexus-alert-backend.your-domain.workers.dev \
  ./scripts/test-rate-limiting.sh /api/subscribe
```

## Monitoring

### Log Messages

**Within Limits**:
```
[RATE_LIMIT] IP 192.168.1.100 - /api/checkout - 5/10 requests used
```

**Limit Exceeded**:
```
[RATE_LIMIT] IP 192.168.1.100 exceeded CRITICAL limit on /api/subscribe. Count: 11/10
```

**KV Errors** (fail-open behavior):
```
[RATE_LIMIT] Error checking rate limit: [error details]
```

### Slack Alerts

Critical endpoint violations send Slack notifications:
```
🚨 Rate limit violation: IP 192.168.1.100 exceeded 10 requests on /api/subscribe
```

### Dashboard Queries

**Cloudflare Analytics**:
- Filter by status code: `429`
- Filter by endpoint: `/api/subscribe`, `/api/checkout`
- Check `X-RateLimit-*` headers in responses

**KV Insights**:
- Monitor read/write operations
- Check key expiration patterns
- Review storage usage

## Security Considerations

### Fail-Open Design
If KV is unavailable, requests are **allowed through** to prevent false outages:
```javascript
catch (error) {
  console.error('[RATE_LIMIT] Error checking rate limit:', error);
  return null; // Allow request
}
```

### IP Spoofing Protection
- Cloudflare's `CF-Connecting-IP` header is trusted (cannot be spoofed)
- Other headers (`X-Real-IP`, `X-Forwarded-For`) are fallbacks only
- All requests go through Cloudflare's network first

### DDoS Mitigation Layers
1. **Cloudflare DDoS Protection** (L3/L4)
2. **Rate Limiting** (L7, this implementation)
3. **Circuit Breaker** (Backend API protection)

## Performance Impact

### Latency
- **KV Read**: ~2-5ms per request
- **KV Write**: ~2-5ms per request
- **Total Overhead**: ~10ms per request

### Storage
- **Key Size**: ~50 bytes per IP+endpoint combination
- **Value Size**: ~5 bytes (count as string)
- **Expiration**: Automatic (TTL-based)
- **Estimated Usage**: <1 MB for 10,000 unique IP+endpoint combinations

## Tuning Recommendations

### Adjust Limits
Edit `/backend/src/middleware/rateLimit.js`:
```javascript
const RATE_LIMITS = {
  CRITICAL: {
    maxRequests: 10,  // Increase for higher traffic
    windowSeconds: 60,
  },
  GLOBAL: {
    maxRequests: 60,   // Adjust based on usage patterns
    windowSeconds: 3600,
  },
};
```

### Add More Protected Endpoints
In `/backend/src/worker.js`:
```javascript
'POST /api/your-endpoint': async (req, env, cors) => {
  const rateLimitResult = await rateLimit(req, env, '/api/your-endpoint');
  if (rateLimitResult && rateLimitResult.status === 429) {
    return rateLimitResult;
  }
  return handleYourEndpoint(req, env, cors);
},
```

## Troubleshooting

### Issue: All requests getting 429
**Cause**: KV namespace ID not set correctly
**Fix**:
```bash
# List namespaces
wrangler kv:namespace list

# Update wrangler.toml with correct ID
```

### Issue: Rate limits not resetting
**Cause**: TTL not working correctly
**Fix**: Verify KV write includes TTL:
```javascript
await env.NEXUS_ALERTS_KV.put(key, value, { expirationTtl: 60 });
```

### Issue: Same IP bypassing limits
**Cause**: IP detection not working
**Fix**: Check Cloudflare proxy settings are enabled (orange cloud in DNS)

### Issue: Too many false positives
**Cause**: Limits too strict for legitimate traffic
**Fix**: Increase `maxRequests` or `windowSeconds` values

## Future Enhancements

### Potential Improvements
1. **Dynamic rate limiting** based on user tier (free vs. premium)
2. **Whitelist** for trusted IPs (partners, monitoring services)
3. **Redis-based** distributed rate limiting for multi-region deployments
4. **Rate limit by user email** in addition to IP
5. **Exponential backoff** for repeated violations
6. **CAPTCHA challenge** after rate limit violation

### Metrics to Track
- Rate limit hit rate (%)
- False positive rate
- Blocked attack attempts
- Legitimate traffic impact

## Compliance

### GDPR
IP addresses are:
- Stored temporarily (max 1 hour)
- Automatically deleted via TTL
- Used only for security purposes
- Not shared with third parties

### Rate Limit Standards
Follows [RFC 6585](https://tools.ietf.org/html/rfc6585#section-4) for 429 responses and [IETF Draft](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers) for `X-RateLimit-*` headers.

## References

- [Cloudflare KV Documentation](https://developers.cloudflare.com/kv/)
- [Rate Limiting Patterns](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)
- [RFC 6585 - 429 Status Code](https://tools.ietf.org/html/rfc6585#section-4)
- [HTTP Rate Limit Headers](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers)
