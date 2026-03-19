# API Error Handling & Resilience System

Production-grade error handling and resilience for the NEXUS Alert Cloudflare Worker backend.

## Overview

This system implements multiple layers of resilience to ensure reliable operation when calling the CBP/NEXUS API:

- **Exponential Backoff Retry** - Automatically retry transient failures
- **Circuit Breaker Pattern** - Prevent cascading failures by failing fast when service is down
- **Adaptive Rate Limiting** - Respect API quotas and prevent overwhelming the service
- **Graceful Degradation** - Fall back to cached data when API is unavailable
- **User-Friendly Error Messages** - Clear, actionable messages for users
- **Comprehensive Monitoring** - Detailed metrics and health checks

## Architecture

```
Request → Rate Limiter → Circuit Breaker → Retry Logic → CBP API
                                                ↓
                                            Success
                                                ↓
                                          Update Cache
                                                ↓
                                            Response

On Failure:
Circuit Breaker OPEN → Return Cached Data (if available)
```

## Components

### 1. Exponential Backoff Retry (`utils/retry.js`)

Retries failed requests with increasing delays to avoid overwhelming a recovering service.

**Features:**
- Configurable retry attempts (default: 3)
- Exponential backoff with jitter (prevents thundering herd)
- Retryable status codes: 408, 429, 500, 502, 503, 504
- Retryable network errors: ECONNRESET, ETIMEDOUT, ENOTFOUND

**Usage:**
```javascript
import { fetchWithRetry, RetryConfig } from './utils/retry.js';

const config = new RetryConfig({
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2
});

const response = await fetchWithRetry(
  'https://api.example.com',
  { method: 'GET' },
  config
);
```

**Example Retry Timeline:**
```
Attempt 1: Immediate          → Fails
Attempt 2: Wait ~1000ms       → Fails
Attempt 3: Wait ~2000ms       → Success
```

### 2. Circuit Breaker Pattern (`utils/circuit-breaker.js`)

Prevents repeated calls to a failing service by "opening" the circuit after a threshold of failures.

**States:**
- **CLOSED** - Normal operation, requests pass through
- **OPEN** - Service is failing, reject requests immediately (fail fast)
- **HALF_OPEN** - Testing recovery, allow limited requests

**Configuration:**
```javascript
import { createCircuitBreaker } from './utils/circuit-breaker.js';

const breaker = createCircuitBreaker('cbp_api', kvStore, {
  failureThreshold: 5,      // Open after 5 consecutive failures
  successThreshold: 2,      // Close after 2 successes in HALF_OPEN
  resetTimeoutMs: 60000,    // Try recovery after 1 minute
  windowMs: 120000          // 2-minute failure window
});

await breaker.execute(async () => {
  return await fetch('https://api.example.com');
});
```

**State Transitions:**
```
CLOSED → (5 failures) → OPEN
OPEN → (wait 1 min) → HALF_OPEN
HALF_OPEN → (2 successes) → CLOSED
HALF_OPEN → (1 failure) → OPEN
```

### 3. Adaptive Rate Limiting (`utils/rate-limiting.js`)

Token bucket algorithm with adaptive rate adjustment based on API responses.

**Features:**
- Token bucket with configurable capacity and refill rate
- Automatic backoff on 429 (rate limit) responses
- Gradual recovery on success
- Distributed state via Cloudflare KV

**Configuration:**
```javascript
import { createCBPRateLimiter } from './utils/rate-limiting.js';

const limiter = createCBPRateLimiter(kvStore);

// Try to consume 1 token
const allowed = await limiter.tryConsume(1);
if (!allowed) {
  throw new RateLimitError(60);
}

// Make API call...
await limiter.reportSuccess(); // Increase rate
// or
await limiter.reportRateLimit(); // Decrease rate
```

**Rate Adjustment:**
```
Start: 10 req/sec
429 error → 5 req/sec (backoff)
429 error → 2.5 req/sec (backoff)
Success → 2.625 req/sec (gradual recovery)
Success → 2.75 req/sec
...gradually recover to max 20 req/sec
```

### 4. Enhanced Error Handling (`utils/error-handling.js`)

Structured error types with user-friendly messages.

**Error Types:**
- `APIError` - Base error class
- `CBPAPIError` - CBP/NEXUS API specific errors (with status-specific messages)
- `NetworkError` - Network/connection errors
- `RateLimitError` - Rate limiting errors (includes retry-after)
- `ServiceDegradedError` - Degraded service operation
- `ValidationError` - Request validation errors

**User-Friendly Messages:**
```javascript
// Technical message
throw new Error('HTTP 503');

// User-friendly message
const error = new CBPAPIError(503);
// error.userMessage = "NEXUS appointment system is temporarily unavailable.
//                      This is typically brief. We'll keep trying."
```

**Error Parsing:**
```javascript
import { parseAPIError, formatErrorResponse } from './utils/error-handling.js';

try {
  await fetchSlots();
} catch (error) {
  const parsed = parseAPIError(error, { locationId: 5020 });
  const response = formatErrorResponse(parsed);
  return json(response, parsed.statusCode);
}
```

### 5. Resilient API Client (`utils/resilient-api.js`)

High-level client that integrates all resilience components.

**Features:**
- Combines retry + circuit breaker + rate limiting
- Automatic caching of successful results
- Graceful fallback to cached data
- Slack alerts for critical errors
- Health status monitoring

**Usage:**
```javascript
import { createResilientClient } from './utils/resilient-api.js';

const client = createResilientClient(env);

// Fetch with full resilience
const slots = await client.fetchSlots(locationId);

// Fetch with fallback to cache
const slots = await client.fetchSlotsWithFallback(locationId);

// Get health status
const health = await client.getHealthStatus();
```

## Integration with Worker

The resilient client is integrated into the main worker:

```javascript
// Old implementation (worker.js line ~1393)
async function fetchSlots(locationId, env) {
  const resp = await fetch(`${SLOTS_URL}?${params}`);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

// New implementation
async function fetchSlots(locationId, env) {
  const client = createResilientClient(env);

  try {
    const slots = await client.fetchSlots(locationId);
    await client.updateCache(locationId, slots);
    return slots;
  } catch (error) {
    // Graceful degradation
    if (error.name === 'CircuitBreakerOpenError' || error.statusCode >= 500) {
      return await client.fetchSlotsWithFallback(locationId);
    }
    throw error;
  }
}
```

## Health Check Integration

Enhanced `/health` endpoint includes resilience metrics:

```json
{
  "timestamp": "2026-03-19T12:00:00.000Z",
  "status": "healthy",
  "checks": {
    "resilience": {
      "status": "pass",
      "circuit_breaker": {
        "state": "CLOSED",
        "failures": 0,
        "threshold": 5
      },
      "rate_limiter": {
        "available_tokens": 95,
        "max_tokens": 100,
        "refill_rate": 10
      },
      "message": "Circuit breaker: CLOSED, Rate limit: 95/100 tokens"
    }
  }
}
```

## Monitoring & Observability

All resilience components emit structured JSON logs:

**Retry Events:**
```json
{
  "event": "retry_attempt",
  "attempt": 2,
  "maxAttempts": 3,
  "status": 503,
  "delayMs": 2000,
  "operation": "fetchSlots",
  "locationId": 5020
}
```

**Circuit Breaker Events:**
```json
{
  "event": "circuit_breaker_opened",
  "name": "cbp_api",
  "failures": 5,
  "threshold": 5,
  "error": "HTTP 503"
}
```

**Rate Limiter Events:**
```json
{
  "event": "rate_limit_backoff",
  "name": "cbp_api",
  "refillRate": "5.00"
}
```

## Testing

Comprehensive test suites for all components:

```bash
# Run all resilience tests
npm test -- tests/utils/

# Test specific component
npm test -- tests/utils/retry.test.js
npm test -- tests/utils/circuit-breaker.test.js
npm test -- tests/utils/error-handling.test.js
```

## Configuration

### Environment Variables

- `NEXUS_ALERTS_KV` - KV namespace for distributed state
- `SLACK_WEBHOOK_URL` - Slack webhook for critical error alerts

### Tuning Parameters

**For High-Traffic (Production):**
```javascript
// More aggressive rate limiting
const limiter = new AdaptiveRateLimiter({
  maxTokens: 100,
  refillRate: 20,       // Start high
  minRefillRate: 5,     // Don't go too low
  maxRefillRate: 50
});

// Tighter circuit breaker
const breaker = new CircuitBreaker({
  failureThreshold: 3,  // Open quickly
  resetTimeoutMs: 30000 // Recover quickly
});
```

**For Low-Traffic (Development):**
```javascript
// Relaxed rate limiting
const limiter = new AdaptiveRateLimiter({
  maxTokens: 50,
  refillRate: 5,
  minRefillRate: 1,
  maxRefillRate: 10
});

// Patient circuit breaker
const breaker = new CircuitBreaker({
  failureThreshold: 10,
  resetTimeoutMs: 120000
});
```

## Error Scenarios

### Scenario 1: Transient Network Glitch

```
Request 1: ETIMEDOUT
  → Retry after 1s
  → Success
Result: Transparent recovery, no user impact
```

### Scenario 2: CBP API Slowdown (503 errors)

```
Request 1: 503 → Retry after 1s → 503 → Retry after 2s → 503
Request 2: 503 → Retry...
Request 3: 503 → Retry...
Request 4: 503 → Retry...
Request 5: 503 → Circuit breaker OPENS
Request 6-N: CircuitBreakerOpenError (instant, no retry)
  → Return cached data (if available)
After 60s: Circuit → HALF_OPEN
Next request: Success → Circuit CLOSED
```

### Scenario 3: Rate Limiting (429)

```
Request: 429 with Retry-After: 60
  → Rate limiter backoff (10 → 5 req/sec)
  → Wait 60s
  → Retry
  → Success
  → Gradual recovery (5 → 5.5 → 6 → ... → 10 req/sec)
```

## Best Practices

1. **Always use the resilient client** - Don't make raw `fetch()` calls to external APIs
2. **Configure appropriate thresholds** - Balance between reliability and responsiveness
3. **Monitor health endpoint** - Set up alerts on circuit breaker state changes
4. **Review Slack alerts** - Critical errors trigger Slack notifications
5. **Leverage cached data** - Always implement cache for graceful degradation
6. **Test failure scenarios** - Use tests to verify behavior under various failure modes

## Performance Impact

- **Retry logic**: Adds latency only on failures (1-3s for typical retry)
- **Circuit breaker**: Minimal overhead (~1ms) when CLOSED, instant rejection when OPEN
- **Rate limiter**: ~2-5ms per request for token bucket check
- **Overall**: < 10ms added latency for successful requests

## Future Enhancements

- [ ] Distributed tracing integration (OpenTelemetry)
- [ ] Advanced metrics (P50, P95, P99 latencies)
- [ ] Adaptive timeout adjustment based on API latency
- [ ] Multi-region fallback for geo-distributed deployments
- [ ] Bulkhead pattern for resource isolation
- [ ] Load shedding during extreme load

## References

- [Circuit Breaker Pattern - Microsoft](https://docs.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)
- [Retry Pattern - AWS](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
- [Token Bucket Algorithm](https://en.wikipedia.org/wiki/Token_bucket)
- [Cloudflare Workers KV](https://developers.cloudflare.com/workers/runtime-apis/kv/)

---

**Built for NEXUS Alert** - Production-ready resilience for monitoring NEXUS appointment slots.
