/**
 * Rate Limiting Utilities
 *
 * Implements adaptive rate limiting to respect API quotas
 * and prevent overwhelming external services.
 */

/**
 * Token Bucket Rate Limiter (KV-backed for distributed workers)
 *
 * Classic algorithm: tokens refill at constant rate, requests consume tokens.
 * When bucket empty, requests are rejected or delayed.
 */
export class RateLimiter {
  constructor(config = {}) {
    this.name = config.name || 'default';
    this.maxTokens = config.maxTokens || 100; // Bucket capacity
    this.refillRate = config.refillRate || 10; // Tokens per second
    this.refillIntervalMs = config.refillIntervalMs || 1000; // How often to refill
    this.kvPrefix = `rate_limit:${this.name}:`;
  }

  /**
   * Initialize rate limiter with KV store
   */
  async init(kv) {
    this.kv = kv;

    // Initialize bucket if not exists
    const tokens = await this.kv.get(`${this.kvPrefix}tokens`);
    if (tokens === null) {
      await this.kv.put(`${this.kvPrefix}tokens`, String(this.maxTokens));
      await this.kv.put(`${this.kvPrefix}last_refill`, String(Date.now()));
    }
  }

  /**
   * Refill tokens based on time elapsed
   */
  async refill() {
    if (!this.kv) return this.maxTokens;

    const now = Date.now();
    const [tokensStr, lastRefillStr] = await Promise.all([
      this.kv.get(`${this.kvPrefix}tokens`),
      this.kv.get(`${this.kvPrefix}last_refill`)
    ]);

    let tokens = parseFloat(tokensStr || this.maxTokens);
    const lastRefill = parseInt(lastRefillStr || now);

    const elapsedMs = now - lastRefill;
    const tokensToAdd = (elapsedMs / this.refillIntervalMs) * this.refillRate;

    if (tokensToAdd > 0) {
      tokens = Math.min(this.maxTokens, tokens + tokensToAdd);
      await Promise.all([
        this.kv.put(`${this.kvPrefix}tokens`, String(tokens)),
        this.kv.put(`${this.kvPrefix}last_refill`, String(now))
      ]);
    }

    return tokens;
  }

  /**
   * Try to consume tokens
   *
   * @param {number} cost - Number of tokens to consume (default 1)
   * @returns {Promise<boolean>} - True if tokens available, false otherwise
   */
  async tryConsume(cost = 1) {
    if (!this.kv) return true; // No-op if KV not initialized

    const tokens = await this.refill();

    if (tokens >= cost) {
      const remaining = tokens - cost;
      await this.kv.put(`${this.kvPrefix}tokens`, String(remaining));

      console.log(JSON.stringify({
        event: 'rate_limit_consume',
        name: this.name,
        cost,
        remaining: Math.floor(remaining),
        maxTokens: this.maxTokens
      }));

      return true;
    }

    console.warn(JSON.stringify({
      event: 'rate_limit_exceeded',
      name: this.name,
      cost,
      available: Math.floor(tokens),
      maxTokens: this.maxTokens
    }));

    return false;
  }

  /**
   * Consume tokens or wait until available
   *
   * @param {number} cost - Number of tokens to consume
   * @param {number} maxWaitMs - Maximum time to wait (default 30s)
   * @returns {Promise<void>}
   * @throws {Error} - If max wait time exceeded
   */
  async consume(cost = 1, maxWaitMs = 30000) {
    const startTime = Date.now();

    while (true) {
      const available = await this.tryConsume(cost);
      if (available) return;

      const elapsed = Date.now() - startTime;
      if (elapsed >= maxWaitMs) {
        throw new Error(`Rate limit: could not acquire ${cost} tokens within ${maxWaitMs}ms`);
      }

      // Wait before retry (with jitter)
      const waitMs = 100 + Math.random() * 100;
      await new Promise(resolve => setTimeout(resolve, waitMs));
    }
  }

  /**
   * Get current token count (for monitoring)
   */
  async getTokens() {
    if (!this.kv) return this.maxTokens;
    return await this.refill();
  }

  /**
   * Reset rate limiter
   */
  async reset() {
    if (!this.kv) return;

    await Promise.all([
      this.kv.put(`${this.kvPrefix}tokens`, String(this.maxTokens)),
      this.kv.put(`${this.kvPrefix}last_refill`, String(Date.now()))
    ]);

    console.log(JSON.stringify({ event: 'rate_limit_reset', name: this.name }));
  }
}

/**
 * Adaptive Rate Limiter
 *
 * Automatically adjusts rate based on API responses (429, 503, etc.)
 */
export class AdaptiveRateLimiter extends RateLimiter {
  constructor(config = {}) {
    super(config);
    this.minRefillRate = config.minRefillRate || 1; // tokens/sec minimum
    this.maxRefillRate = config.maxRefillRate || this.refillRate;
    this.backoffMultiplier = config.backoffMultiplier || 0.5;
    this.recoveryMultiplier = config.recoveryMultiplier || 1.1;
  }

  /**
   * Report successful API call (increase rate)
   */
  async reportSuccess() {
    if (!this.kv) return;

    // Gradually increase refill rate on success
    if (this.refillRate < this.maxRefillRate) {
      this.refillRate = Math.min(
        this.maxRefillRate,
        this.refillRate * this.recoveryMultiplier
      );

      await this.kv.put(`${this.kvPrefix}refill_rate`, String(this.refillRate));

      console.log(JSON.stringify({
        event: 'rate_limit_recovery',
        name: this.name,
        refillRate: this.refillRate.toFixed(2)
      }));
    }
  }

  /**
   * Report rate limit hit (decrease rate)
   */
  async reportRateLimit() {
    if (!this.kv) return;

    // Decrease refill rate on rate limit
    this.refillRate = Math.max(
      this.minRefillRate,
      this.refillRate * this.backoffMultiplier
    );

    await this.kv.put(`${this.kvPrefix}refill_rate`, String(this.refillRate));

    console.warn(JSON.stringify({
      event: 'rate_limit_backoff',
      name: this.name,
      refillRate: this.refillRate.toFixed(2)
    }));
  }

  /**
   * Report server error (slight decrease)
   */
  async reportServerError() {
    if (!this.kv) return;

    // Slight decrease on server errors
    this.refillRate = Math.max(
      this.minRefillRate,
      this.refillRate * 0.9
    );

    await this.kv.put(`${this.kvPrefix}refill_rate`, String(this.refillRate));
  }
}

/**
 * Factory for CBP API rate limiter with sensible defaults
 */
export function createCBPRateLimiter(kv) {
  const limiter = new AdaptiveRateLimiter({
    name: 'cbp_api',
    maxTokens: 100,        // 100 requests bucket
    refillRate: 10,        // Start at 10 requests/second
    minRefillRate: 1,      // Slow down to 1 req/sec under pressure
    maxRefillRate: 20,     // Max 20 req/sec when healthy
    backoffMultiplier: 0.5,
    recoveryMultiplier: 1.05 // Gradual recovery
  });

  if (kv) {
    limiter.init(kv).catch(err => {
      console.error('Failed to initialize CBP rate limiter:', err);
    });
  }

  return limiter;
}

/**
 * Sliding window rate limiter (simpler, less smooth than token bucket)
 */
export class SlidingWindowRateLimiter {
  constructor(config = {}) {
    this.name = config.name || 'default';
    this.maxRequests = config.maxRequests || 100;
    this.windowMs = config.windowMs || 60000; // 1 minute
    this.kvPrefix = `rate_limit_window:${this.name}:`;
  }

  async init(kv) {
    this.kv = kv;
  }

  /**
   * Check if request is allowed
   */
  async isAllowed() {
    if (!this.kv) return true;

    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get request timestamps in current window
    const key = `${this.kvPrefix}requests`;
    const requestsJson = await this.kv.get(key);
    let requests = requestsJson ? JSON.parse(requestsJson) : [];

    // Filter to current window
    requests = requests.filter(ts => ts > windowStart);

    if (requests.length >= this.maxRequests) {
      console.warn(JSON.stringify({
        event: 'rate_limit_exceeded_window',
        name: this.name,
        count: requests.length,
        maxRequests: this.maxRequests,
        windowMs: this.windowMs
      }));
      return false;
    }

    // Add current request
    requests.push(now);
    await this.kv.put(key, JSON.stringify(requests), {
      expirationTtl: Math.ceil(this.windowMs / 1000) + 10 // TTL with buffer
    });

    return true;
  }
}
