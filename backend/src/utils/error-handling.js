/**
 * API Error Handling Utilities
 *
 * Provides structured error types and user-friendly error messages
 * for production error handling in NEXUS Alert.
 */

/**
 * Base API Error class
 */
export class APIError extends Error {
  constructor(message, statusCode, context = {}) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.context = context;
    this.timestamp = new Date().toISOString();
    this.userMessage = this.generateUserMessage();
  }

  generateUserMessage() {
    return this.message;
  }

  toJSON() {
    return {
      error: this.name,
      message: this.message,
      userMessage: this.userMessage,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: this.timestamp
    };
  }
}

/**
 * CBP/NEXUS API specific errors
 */
export class CBPAPIError extends APIError {
  constructor(statusCode, context = {}) {
    super(`CBP API error: HTTP ${statusCode}`, statusCode, context);
    this.name = 'CBPAPIError';
  }

  generateUserMessage() {
    const { locationId, attempt } = this.context;

    switch (this.statusCode) {
      case 400:
        return 'Invalid request to NEXUS appointment system. Please contact support.';

      case 401:
      case 403:
        return 'Unable to access NEXUS appointment data. The service may have changed authentication. Our team has been notified.';

      case 404:
        return locationId
          ? `Location ${locationId} not found in NEXUS system. This location may no longer offer appointments.`
          : 'NEXUS appointment data not found.';

      case 408:
        return 'NEXUS appointment system timed out. We\'ll retry automatically.';

      case 429:
        return 'NEXUS appointment system is rate limiting requests. Monitoring will resume shortly with reduced frequency.';

      case 500:
        return 'NEXUS appointment system is experiencing internal errors. We\'re monitoring the situation.';

      case 502:
      case 503:
      case 504:
        return 'NEXUS appointment system is temporarily unavailable. This is typically brief. We\'ll keep trying.';

      default:
        if (this.statusCode >= 500) {
          return 'NEXUS appointment system is experiencing technical difficulties. Your alerts will resume automatically when service is restored.';
        }
        return `Unable to check NEXUS appointments (Error ${this.statusCode}). We\'re working to resolve this.`;
    }
  }
}

/**
 * Network/timeout errors
 */
export class NetworkError extends APIError {
  constructor(originalError, context = {}) {
    super(originalError.message, 0, { ...context, code: originalError.code });
    this.name = 'NetworkError';
    this.code = originalError.code;
  }

  generateUserMessage() {
    switch (this.code) {
      case 'ECONNRESET':
        return 'Connection to NEXUS appointment system was reset. We\'ll retry automatically.';

      case 'ETIMEDOUT':
        return 'Connection to NEXUS appointment system timed out. This is usually temporary.';

      case 'ENOTFOUND':
        return 'Unable to reach NEXUS appointment system. This may indicate a service outage.';

      case 'ECONNREFUSED':
        return 'NEXUS appointment system refused connection. The service may be down for maintenance.';

      default:
        return `Network error connecting to NEXUS appointment system: ${this.message}`;
    }
  }
}

/**
 * Rate limiting error
 */
export class RateLimitError extends APIError {
  constructor(retryAfter = 60, context = {}) {
    super(`Rate limit exceeded. Retry after ${retryAfter}s`, 429, { ...context, retryAfter });
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }

  generateUserMessage() {
    const minutes = Math.ceil(this.retryAfter / 60);
    return `NEXUS appointment checks are temporarily paused to avoid rate limits. Monitoring will resume in ~${minutes} minute${minutes > 1 ? 's' : ''}.`;
  }
}

/**
 * Service degradation (not total failure)
 */
export class ServiceDegradedError extends APIError {
  constructor(message, context = {}) {
    super(message, 503, context);
    this.name = 'ServiceDegradedError';
  }

  generateUserMessage() {
    return 'NEXUS appointment monitoring is running in degraded mode. Some features may be limited.';
  }
}

/**
 * Validation errors
 */
export class ValidationError extends APIError {
  constructor(field, message, context = {}) {
    super(`Validation failed for ${field}: ${message}`, 400, { ...context, field });
    this.name = 'ValidationError';
    this.field = field;
  }

  generateUserMessage() {
    return `Invalid ${this.field}: ${this.message}`;
  }
}

/**
 * Parse and classify errors from various sources
 */
export function parseAPIError(error, context = {}) {
  // Already classified
  if (error instanceof APIError) {
    return error;
  }

  // Network errors
  if (error.code && ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNREFUSED'].includes(error.code)) {
    return new NetworkError(error, context);
  }

  // HTTP Response errors
  if (error.status || error.statusCode) {
    const status = error.status || error.statusCode;

    if (status === 429) {
      const retryAfter = error.headers?.get?.('retry-after') || 60;
      return new RateLimitError(parseInt(retryAfter), context);
    }

    return new CBPAPIError(status, context);
  }

  // Circuit breaker errors - preserve as-is
  if (error.name === 'CircuitBreakerOpenError') {
    return error;
  }

  // Retry errors - unwrap to get original
  if (error.name === 'RetryError' && error.lastError) {
    return parseAPIError(error.lastError, context);
  }

  // Generic error
  return new APIError(error.message || 'Unknown error', 500, context);
}

/**
 * Format error response for API endpoints
 */
export function formatErrorResponse(error, options = {}) {
  const parsed = parseAPIError(error, options.context);

  const response = {
    success: false,
    error: {
      type: parsed.name,
      message: options.includeUserMessage !== false ? parsed.userMessage : parsed.message,
      code: parsed.statusCode || 500
    }
  };

  // Include details in development/debug mode
  if (options.includeDetails) {
    response.error.details = {
      originalMessage: parsed.message,
      context: parsed.context,
      timestamp: parsed.timestamp
    };
  }

  // Include retry information if available
  if (parsed.retryAfter) {
    response.error.retryAfter = parsed.retryAfter;
  }

  return response;
}

/**
 * Log error with structured context
 */
export function logError(error, context = {}, level = 'error') {
  const parsed = parseAPIError(error, context);

  const logEntry = {
    level,
    event: 'api_error',
    error: parsed.name,
    message: parsed.message,
    userMessage: parsed.userMessage,
    statusCode: parsed.statusCode,
    ...parsed.context,
    ...context,
    timestamp: parsed.timestamp
  };

  console[level](JSON.stringify(logEntry));

  return logEntry;
}

/**
 * Graceful degradation wrapper
 *
 * Try primary function, fall back to secondary with degraded functionality
 */
export async function withGracefulDegradation(primaryFn, fallbackFn, context = {}) {
  try {
    return await primaryFn();
  } catch (error) {
    logError(error, { ...context, degraded: true }, 'warn');

    if (fallbackFn) {
      console.warn(JSON.stringify({
        event: 'graceful_degradation',
        ...context
      }));

      return await fallbackFn();
    }

    throw new ServiceDegradedError('Primary service failed with no fallback', { ...context, originalError: error.message });
  }
}
