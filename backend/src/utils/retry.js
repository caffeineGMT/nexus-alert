/**
 * Exponential Backoff Retry Utility
 *
 * Implements retry logic with exponential backoff and jitter to prevent thundering herd.
 * Production-ready for handling transient API failures.
 */

export class RetryConfig {
  constructor(options = {}) {
    this.maxAttempts = options.maxAttempts || 3;
    this.initialDelayMs = options.initialDelayMs || 1000;
    this.maxDelayMs = options.maxDelayMs || 30000;
    this.backoffMultiplier = options.backoffMultiplier || 2;
    this.jitterFactor = options.jitterFactor || 0.1; // 10% jitter
    this.retryableStatusCodes = options.retryableStatusCodes || [408, 429, 500, 502, 503, 504];
    this.retryableErrors = options.retryableErrors || ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND'];
  }
}

export class RetryError extends Error {
  constructor(message, attempts, lastError) {
    super(message);
    this.name = 'RetryError';
    this.attempts = attempts;
    this.lastError = lastError;
  }
}

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateDelay(attempt, config) {
  const baseDelay = Math.min(
    config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt - 1),
    config.maxDelayMs
  );

  // Add jitter: randomize ±jitterFactor of base delay
  const jitter = baseDelay * config.jitterFactor * (Math.random() * 2 - 1);
  return Math.max(0, baseDelay + jitter);
}

/**
 * Sleep utility
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if error is retryable
 */
function isRetryable(error, response, config) {
  // Network/timeout errors
  if (error && config.retryableErrors.some(code => error.code === code || error.message?.includes(code))) {
    return true;
  }

  // HTTP status codes
  if (response && config.retryableStatusCodes.includes(response.status)) {
    return true;
  }

  return false;
}

/**
 * Retry a function with exponential backoff
 *
 * @param {Function} fn - Async function that returns a Response or throws
 * @param {RetryConfig} config - Retry configuration
 * @param {Object} context - Optional context for logging (e.g., { operation: 'fetchSlots', locationId: 5020 })
 * @returns {Promise<any>} - Result from successful execution
 * @throws {RetryError} - If all retries exhausted
 */
export async function withRetry(fn, config = new RetryConfig(), context = {}) {
  let lastError = null;
  let lastResponse = null;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      const result = await fn();

      // If result is a Response object, check if we should retry
      if (result && typeof result.status === 'number') {
        lastResponse = result;

        if (!result.ok && isRetryable(null, result, config)) {
          const delayMs = calculateDelay(attempt, config);

          console.warn(JSON.stringify({
            event: 'retry_attempt',
            attempt,
            maxAttempts: config.maxAttempts,
            status: result.status,
            delayMs: Math.round(delayMs),
            ...context
          }));

          if (attempt < config.maxAttempts) {
            await sleep(delayMs);
            continue;
          }
        }
      }

      // Success or non-retryable response
      if (attempt > 1) {
        console.log(JSON.stringify({
          event: 'retry_success',
          attempt,
          ...context
        }));
      }

      return result;

    } catch (error) {
      lastError = error;

      if (isRetryable(error, null, config) && attempt < config.maxAttempts) {
        const delayMs = calculateDelay(attempt, config);

        console.warn(JSON.stringify({
          event: 'retry_attempt',
          attempt,
          maxAttempts: config.maxAttempts,
          error: error.message,
          errorCode: error.code,
          delayMs: Math.round(delayMs),
          ...context
        }));

        await sleep(delayMs);
        continue;
      }

      // Non-retryable or exhausted retries
      break;
    }
  }

  // All retries exhausted
  console.error(JSON.stringify({
    event: 'retry_exhausted',
    attempts: config.maxAttempts,
    lastError: lastError?.message,
    lastStatus: lastResponse?.status,
    ...context
  }));

  throw new RetryError(
    `Failed after ${config.maxAttempts} attempts`,
    config.maxAttempts,
    lastError || new Error(`HTTP ${lastResponse?.status}`)
  );
}

/**
 * Shorthand for retrying fetch calls with sensible defaults
 */
export async function fetchWithRetry(url, options = {}, retryConfig = new RetryConfig(), context = {}) {
  return withRetry(
    () => fetch(url, options),
    retryConfig,
    { operation: 'fetch', url, ...context }
  );
}
