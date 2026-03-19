/**
 * Circuit Breaker Pattern Implementation
 *
 * Prevents cascading failures by stopping requests to a failing service.
 * States: CLOSED (normal) → OPEN (failing, reject fast) → HALF_OPEN (testing recovery)
 *
 * Production-ready for Cloudflare Workers with KV-backed state for distributed workers.
 */

const STATES = {
  CLOSED: 'CLOSED',       // Normal operation
  OPEN: 'OPEN',           // Failing - reject immediately
  HALF_OPEN: 'HALF_OPEN'  // Testing if service recovered
};

export class CircuitBreakerConfig {
  constructor(options = {}) {
    // Failure threshold before opening circuit
    this.failureThreshold = options.failureThreshold || 5;

    // Success threshold in HALF_OPEN before closing
    this.successThreshold = options.successThreshold || 2;

    // Time to wait before attempting recovery (ms)
    this.resetTimeoutMs = options.resetTimeoutMs || 60000; // 1 minute

    // Time window for counting failures (ms)
    this.windowMs = options.windowMs || 120000; // 2 minutes

    // Name for this circuit breaker (used for KV keys)
    this.name = options.name || 'default';
  }
}

export class CircuitBreakerOpenError extends Error {
  constructor(message, retryAfter) {
    super(message);
    this.name = 'CircuitBreakerOpenError';
    this.retryAfter = retryAfter; // seconds until retry
  }
}

export class CircuitBreaker {
  constructor(config = new CircuitBreakerConfig(), kvStore = null) {
    this.config = config;
    this.kv = kvStore;
    this.kvPrefix = `circuit_breaker:${config.name}:`;
  }

  /**
   * Get current state from KV (distributed state across workers)
   */
  async getState() {
    if (!this.kv) {
      return { state: STATES.CLOSED, failures: 0, successes: 0, lastFailureTime: 0, lastStateChange: 0 };
    }

    const stateKey = `${this.kvPrefix}state`;
    const failuresKey = `${this.kvPrefix}failures`;
    const successesKey = `${this.kvPrefix}successes`;
    const lastFailureKey = `${this.kvPrefix}last_failure_time`;
    const lastStateChangeKey = `${this.kvPrefix}last_state_change`;

    const [state, failures, successes, lastFailureTime, lastStateChange] = await Promise.all([
      this.kv.get(stateKey),
      this.kv.get(failuresKey),
      this.kv.get(successesKey),
      this.kv.get(lastFailureKey),
      this.kv.get(lastStateChangeKey)
    ]);

    return {
      state: state || STATES.CLOSED,
      failures: parseInt(failures || '0'),
      successes: parseInt(successes || '0'),
      lastFailureTime: parseInt(lastFailureTime || '0'),
      lastStateChange: parseInt(lastStateChangeKey || '0')
    };
  }

  /**
   * Update state in KV
   */
  async setState(state, updates = {}) {
    if (!this.kv) return;

    const now = Date.now();
    const promises = [];

    promises.push(this.kv.put(`${this.kvPrefix}state`, state));
    promises.push(this.kv.put(`${this.kvPrefix}last_state_change`, String(now)));

    if (updates.failures !== undefined) {
      promises.push(this.kv.put(`${this.kvPrefix}failures`, String(updates.failures)));
    }
    if (updates.successes !== undefined) {
      promises.push(this.kv.put(`${this.kvPrefix}successes`, String(updates.successes)));
    }
    if (updates.lastFailureTime !== undefined) {
      promises.push(this.kv.put(`${this.kvPrefix}last_failure_time`, String(updates.lastFailureTime)));
    }

    await Promise.all(promises);
  }

  /**
   * Reset circuit to CLOSED state
   */
  async reset() {
    await this.setState(STATES.CLOSED, { failures: 0, successes: 0, lastFailureTime: 0 });
    console.log(JSON.stringify({ event: 'circuit_breaker_reset', name: this.config.name }));
  }

  /**
   * Determine if failure window has expired
   */
  isWindowExpired(lastFailureTime) {
    return (Date.now() - lastFailureTime) > this.config.windowMs;
  }

  /**
   * Execute function with circuit breaker protection
   *
   * @param {Function} fn - Async function to execute
   * @param {Object} context - Context for logging
   * @returns {Promise<any>} - Result from fn
   * @throws {CircuitBreakerOpenError} - If circuit is OPEN
   */
  async execute(fn, context = {}) {
    const state = await this.getState();
    const now = Date.now();

    // Check if we should transition from OPEN → HALF_OPEN
    if (state.state === STATES.OPEN) {
      const timeSinceStateChange = now - state.lastStateChange;

      if (timeSinceStateChange >= this.config.resetTimeoutMs) {
        // Transition to HALF_OPEN to test recovery
        await this.setState(STATES.HALF_OPEN, { successes: 0 });
        console.log(JSON.stringify({
          event: 'circuit_breaker_half_open',
          name: this.config.name,
          ...context
        }));
      } else {
        // Circuit still open - reject fast
        const retryAfter = Math.ceil((this.config.resetTimeoutMs - timeSinceStateChange) / 1000);
        console.warn(JSON.stringify({
          event: 'circuit_breaker_reject',
          name: this.config.name,
          state: STATES.OPEN,
          retryAfter,
          ...context
        }));
        throw new CircuitBreakerOpenError(
          `Circuit breaker is OPEN. Service appears down. Try again in ${retryAfter}s.`,
          retryAfter
        );
      }
    }

    // Execute the function
    try {
      const result = await fn();

      // Record success
      await this.recordSuccess(state);

      return result;

    } catch (error) {
      // Record failure
      await this.recordFailure(state, error);

      throw error;
    }
  }

  /**
   * Record successful execution
   */
  async recordSuccess(state) {
    if (state.state === STATES.HALF_OPEN) {
      const newSuccesses = state.successes + 1;

      if (newSuccesses >= this.config.successThreshold) {
        // Recovered! Close circuit
        await this.setState(STATES.CLOSED, { failures: 0, successes: 0 });
        console.log(JSON.stringify({
          event: 'circuit_breaker_closed',
          name: this.config.name,
          message: 'Service recovered'
        }));
      } else {
        // Still testing recovery
        await this.setState(STATES.HALF_OPEN, { successes: newSuccesses });
      }
    } else if (state.state === STATES.CLOSED) {
      // Reset failure count on success in CLOSED state if window expired
      if (state.failures > 0 && this.isWindowExpired(state.lastFailureTime)) {
        await this.setState(STATES.CLOSED, { failures: 0 });
      }
    }
  }

  /**
   * Record failed execution
   */
  async recordFailure(state, error) {
    const now = Date.now();

    if (state.state === STATES.HALF_OPEN) {
      // Failed during recovery test - reopen circuit
      await this.setState(STATES.OPEN, { failures: 0, successes: 0, lastFailureTime: now });
      console.error(JSON.stringify({
        event: 'circuit_breaker_reopened',
        name: this.config.name,
        error: error.message
      }));
      return;
    }

    if (state.state === STATES.CLOSED) {
      // Reset failures if window expired
      const failures = this.isWindowExpired(state.lastFailureTime) ? 1 : state.failures + 1;

      if (failures >= this.config.failureThreshold) {
        // Threshold breached - open circuit
        await this.setState(STATES.OPEN, { failures, lastFailureTime: now });
        console.error(JSON.stringify({
          event: 'circuit_breaker_opened',
          name: this.config.name,
          failures,
          threshold: this.config.failureThreshold,
          error: error.message
        }));
      } else {
        // Update failure count
        await this.setState(STATES.CLOSED, { failures, lastFailureTime: now });
      }
    }
  }

  /**
   * Get health status for monitoring
   */
  async getHealthStatus() {
    const state = await this.getState();
    return {
      name: this.config.name,
      state: state.state,
      healthy: state.state === STATES.CLOSED,
      failures: state.failures,
      failureThreshold: this.config.failureThreshold,
      lastFailureTime: state.lastFailureTime,
      resetTimeoutMs: this.config.resetTimeoutMs
    };
  }
}

/**
 * Factory for creating circuit breakers for different services
 */
export function createCircuitBreaker(serviceName, kv, options = {}) {
  const config = new CircuitBreakerConfig({
    name: serviceName,
    ...options
  });

  return new CircuitBreaker(config, kv);
}
