/**
 * Resilient API Client for CBP/NEXUS
 *
 * Integrates retry logic, circuit breaker, rate limiting, and error handling
 * into a production-ready API client.
 */

import { RetryConfig, fetchWithRetry, RetryError } from './retry.js';
import { CircuitBreaker, CircuitBreakerConfig, CircuitBreakerOpenError, createCircuitBreaker } from './circuit-breaker.js';
import { createCBPRateLimiter, AdaptiveRateLimiter } from './rate-limiting.js';
import {
  parseAPIError,
  formatErrorResponse,
  logError,
  withGracefulDegradation,
  CBPAPIError,
  RateLimitError,
  ServiceDegradedError
} from './error-handling.js';

const API_BASE = 'https://ttp.cbp.dhs.gov/schedulerapi';
const SLOTS_URL = `${API_BASE}/slots`;

/**
 * Resilient CBP API Client
 */
export class ResilientCBPClient {
  constructor(env) {
    this.env = env;
    this.kv = env?.NEXUS_ALERTS_KV;

    // Initialize circuit breaker
    this.circuitBreaker = createCircuitBreaker('cbp_api', this.kv, {
      failureThreshold: 5,      // Open after 5 failures
      successThreshold: 2,      // Close after 2 successes in half-open
      resetTimeoutMs: 60000,    // Try recovery after 1 minute
      windowMs: 120000          // 2-minute failure window
    });

    // Initialize adaptive rate limiter
    this.rateLimiter = createCBPRateLimiter(this.kv);

    // Retry configuration
    this.retryConfig = new RetryConfig({
      maxAttempts: 3,
      initialDelayMs: 1000,
      maxDelayMs: 10000,
      backoffMultiplier: 2,
      jitterFactor: 0.1,
      retryableStatusCodes: [408, 429, 500, 502, 503, 504]
    });
  }

  /**
   * Fetch appointment slots with full resilience
   *
   * @param {number} locationId - NEXUS location ID
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} - Array of slots
   */
  async fetchSlots(locationId, options = {}) {
    const startTime = Date.now();
    const context = {
      operation: 'fetchSlots',
      locationId,
      ...options.context
    };

    try {
      // Rate limiting
      const rateLimitAllowed = await this.rateLimiter.tryConsume(1);
      if (!rateLimitAllowed) {
        throw new RateLimitError(60, context);
      }

      // Circuit breaker + retry wrapper
      const result = await this.circuitBreaker.execute(async () => {
        return await this._fetchSlotsWithRetry(locationId, context);
      }, context);

      // Success - report to rate limiter
      await this.rateLimiter.reportSuccess();

      // Log success metric
      const duration = Date.now() - startTime;
      console.log(JSON.stringify({
        metric: 'cbp_api_request_success',
        duration,
        locationId
      }));

      return result;

    } catch (error) {
      // Handle different error types
      await this._handleError(error, context);

      // Log error metric
      const duration = Date.now() - startTime;
      console.error(JSON.stringify({
        metric: 'cbp_api_request_failure',
        duration,
        locationId,
        error: error.message
      }));

      throw error;
    }
  }

  /**
   * Internal: Fetch with retry logic
   */
  async _fetchSlotsWithRetry(locationId, context) {
    const params = new URLSearchParams({
      orderBy: 'soonest',
      limit: '500',
      locationId: String(locationId),
      minimum: '1'
    });

    const url = `${SLOTS_URL}?${params}`;

    const response = await fetchWithRetry(
      url,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'NEXUS-Alert/2.0',
          'Accept': 'application/json'
        }
      },
      this.retryConfig,
      context
    );

    // Check response
    if (!response.ok) {
      throw new CBPAPIError(response.status, context);
    }

    // Parse JSON
    const data = await response.json();
    return data;
  }

  /**
   * Handle errors and update rate limiter
   */
  async _handleError(error, context) {
    const parsed = parseAPIError(error, context);

    // Update rate limiter based on error type
    if (parsed.statusCode === 429 || parsed.name === 'RateLimitError') {
      await this.rateLimiter.reportRateLimit();
    } else if (parsed.statusCode >= 500) {
      await this.rateLimiter.reportServerError();
    }

    // Log structured error
    logError(parsed, context);

    // Send Slack alert for severe errors
    if (this.shouldAlertOnError(parsed)) {
      await this.sendErrorAlert(parsed, context);
    }
  }

  /**
   * Determine if error warrants Slack alert
   */
  shouldAlertOnError(error) {
    // Circuit breaker opened
    if (error.name === 'CircuitBreakerOpenError') {
      return true;
    }

    // Sustained 5xx errors
    if (error.statusCode >= 500) {
      return true;
    }

    // Auth failures
    if (error.statusCode === 401 || error.statusCode === 403) {
      return true;
    }

    return false;
  }

  /**
   * Send Slack alert for critical errors
   */
  async sendErrorAlert(error, context) {
    if (!this.env?.SLACK_WEBHOOK_URL) return;

    try {
      const payload = {
        text: `🚨 CBP API Error: ${error.name}`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*CBP API Error*\n${error.userMessage}`
            }
          },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*Error Type:*\n${error.name}` },
              { type: 'mrkdwn', text: `*Status Code:*\n${error.statusCode || 'N/A'}` },
              { type: 'mrkdwn', text: `*Location ID:*\n${context.locationId || 'N/A'}` },
              { type: 'mrkdwn', text: `*Time:*\n${new Date().toISOString()}` }
            ]
          }
        ]
      };

      await fetch(this.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

    } catch (slackError) {
      console.error('Failed to send Slack alert:', slackError);
    }
  }

  /**
   * Get health status for all resilience components
   */
  async getHealthStatus() {
    const [circuitBreakerHealth, rateLimiterTokens] = await Promise.all([
      this.circuitBreaker.getHealthStatus(),
      this.rateLimiter.getTokens()
    ]);

    return {
      circuitBreaker: circuitBreakerHealth,
      rateLimiter: {
        name: this.rateLimiter.name,
        availableTokens: Math.floor(rateLimiterTokens),
        maxTokens: this.rateLimiter.maxTokens,
        refillRate: this.rateLimiter.refillRate,
        healthy: rateLimiterTokens > 0
      },
      overall: {
        healthy: circuitBreakerHealth.healthy && rateLimiterTokens > 0,
        status: circuitBreakerHealth.healthy
          ? 'operational'
          : circuitBreakerHealth.state === 'HALF_OPEN'
          ? 'degraded'
          : 'down'
      }
    };
  }

  /**
   * Reset all resilience components (admin operation)
   */
  async resetResilience() {
    await Promise.all([
      this.circuitBreaker.reset(),
      this.rateLimiter.reset()
    ]);

    console.log(JSON.stringify({
      event: 'resilience_reset',
      timestamp: new Date().toISOString()
    }));
  }

  /**
   * Graceful degradation: Try to fetch slots, fall back to cached data
   */
  async fetchSlotsWithFallback(locationId, options = {}) {
    return await withGracefulDegradation(
      // Primary: Live API call
      () => this.fetchSlots(locationId, options),

      // Fallback: Return cached slots if available
      async () => {
        if (!this.kv) {
          throw new ServiceDegradedError('No cache available for degraded mode');
        }

        const cacheKey = `slots_cache:${locationId}`;
        const cachedData = await this.kv.get(cacheKey, 'json');

        if (!cachedData) {
          throw new ServiceDegradedError('No cached slots available');
        }

        console.warn(JSON.stringify({
          event: 'serving_cached_slots',
          locationId,
          cacheAge: Date.now() - cachedData.timestamp
        }));

        return cachedData.slots;
      },

      { operation: 'fetchSlotsWithFallback', locationId }
    );
  }

  /**
   * Update cache after successful fetch (for fallback)
   */
  async updateCache(locationId, slots) {
    if (!this.kv) return;

    const cacheKey = `slots_cache:${locationId}`;
    await this.kv.put(cacheKey, JSON.stringify({
      slots,
      timestamp: Date.now()
    }), {
      expirationTtl: 300 // 5 minutes
    });
  }
}

/**
 * Factory function for creating resilient client
 */
export function createResilientClient(env) {
  return new ResilientCBPClient(env);
}

/**
 * Backwards-compatible wrapper for existing code
 */
export async function fetchSlots(locationId, env) {
  const client = createResilientClient(env);

  try {
    const slots = await client.fetchSlots(locationId);

    // Update cache on success
    await client.updateCache(locationId, slots);

    return slots;
  } catch (error) {
    // If circuit is open or severe error, try fallback
    if (error.name === 'CircuitBreakerOpenError' || error.statusCode >= 500) {
      try {
        return await client.fetchSlotsWithFallback(locationId);
      } catch (fallbackError) {
        // No fallback available - throw original error
        throw error;
      }
    }

    throw error;
  }
}
