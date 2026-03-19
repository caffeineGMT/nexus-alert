// Rate Limiting Middleware
// Protects against DDoS attacks and spam abuse using Cloudflare KV

/**
 * Rate limit configuration for different endpoint types
 */
const RATE_LIMITS = {
  // Critical endpoints: checkout and subscribe
  CRITICAL: {
    maxRequests: 10,
    windowSeconds: 60,
    retryAfter: 60,
  },
  // Global limit: all endpoints combined per IP
  GLOBAL: {
    maxRequests: 60,
    windowSeconds: 3600, // 1 hour
    retryAfter: 3600,
  },
};

/**
 * Check if request exceeds rate limit
 * @param {Request} request - Incoming request
 * @param {Object} env - Environment bindings
 * @param {string} endpoint - Endpoint path (e.g., '/api/subscribe', '/api/checkout')
 * @param {string} limitType - 'CRITICAL' or 'GLOBAL'
 * @returns {Promise<Response|null>} - Returns 429 Response if limit exceeded, null otherwise
 */
async function checkRateLimit(request, env, endpoint, limitType = 'CRITICAL') {
  // Get client IP from Cloudflare header
  const clientIP = request.headers.get('CF-Connecting-IP') ||
                   request.headers.get('X-Real-IP') ||
                   request.headers.get('X-Forwarded-For')?.split(',')[0] ||
                   'unknown';

  const limit = RATE_LIMITS[limitType];
  const rateLimitKey = `ratelimit:${clientIP}:${endpoint}:${limitType}`;

  try {
    // Get current count from KV
    const currentCount = await env.NEXUS_ALERTS_KV.get(rateLimitKey);
    const count = parseInt(currentCount) || 0;

    // Check if limit exceeded
    if (count >= limit.maxRequests) {
      // Log violation for monitoring
      console.warn(`[RATE_LIMIT] IP ${clientIP} exceeded ${limitType} limit on ${endpoint}. Count: ${count}/${limit.maxRequests}`);

      // Send Slack alert for critical violations
      if (limitType === 'CRITICAL') {
        await sendSlackAlert(
          `🚨 Rate limit violation: IP ${clientIP} exceeded ${limit.maxRequests} requests on ${endpoint}`,
          env
        ).catch(err => console.error('[RATE_LIMIT] Slack alert failed:', err));
      }

      // Return 429 Too Many Requests
      return new Response(JSON.stringify({
        error: {
          message: `Rate limit exceeded. Please wait ${limit.retryAfter} seconds.`,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: limit.retryAfter,
          limit: limit.maxRequests,
          window: limit.windowSeconds,
        }
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(limit.retryAfter),
          'X-RateLimit-Limit': String(limit.maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Date.now() + (limit.retryAfter * 1000)),
        }
      });
    }

    // Increment counter with TTL
    await env.NEXUS_ALERTS_KV.put(
      rateLimitKey,
      String(count + 1),
      { expirationTtl: limit.windowSeconds }
    );

    // Add rate limit headers to track usage
    const remaining = limit.maxRequests - count - 1;
    return {
      headers: {
        'X-RateLimit-Limit': String(limit.maxRequests),
        'X-RateLimit-Remaining': String(Math.max(0, remaining)),
        'X-RateLimit-Reset': String(Date.now() + (limit.windowSeconds * 1000)),
      }
    };

  } catch (error) {
    // If rate limiting fails, log error but allow request through
    // (fail open to prevent KV issues from blocking all traffic)
    console.error('[RATE_LIMIT] Error checking rate limit:', error);
    return null;
  }
}

/**
 * Rate limit middleware for critical endpoints
 * Applies both endpoint-specific and global rate limits
 * @param {Request} request - Incoming request
 * @param {Object} env - Environment bindings
 * @param {string} endpoint - Endpoint path
 * @returns {Promise<Response|null>} - Returns 429 if exceeded, null otherwise
 */
export async function rateLimit(request, env, endpoint) {
  // Check critical endpoint limit (10 req/min)
  const criticalCheck = await checkRateLimit(request, env, endpoint, 'CRITICAL');
  if (criticalCheck && criticalCheck.status === 429) {
    return criticalCheck;
  }

  // Check global limit (60 req/hour across all endpoints)
  const globalCheck = await checkRateLimit(request, env, 'global', 'GLOBAL');
  if (globalCheck && globalCheck.status === 429) {
    return globalCheck;
  }

  // Return headers to be merged into response
  return {
    headers: {
      ...(criticalCheck?.headers || {}),
      ...(globalCheck?.headers || {}),
    }
  };
}

/**
 * Send Slack alert for rate limit violations
 * @param {string} message - Alert message
 * @param {Object} env - Environment bindings
 */
async function sendSlackAlert(message, env) {
  if (!env.SLACK_WEBHOOK_URL) return;

  try {
    await fetch(env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: message,
        username: 'Rate Limiter',
        icon_emoji: ':shield:',
      }),
    });
  } catch (error) {
    console.error('[RATE_LIMIT] Failed to send Slack alert:', error);
  }
}
