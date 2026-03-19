/**
 * Tests for Error Handling Utilities
 */

import { describe, it, expect } from 'vitest';
import {
  APIError,
  CBPAPIError,
  NetworkError,
  RateLimitError,
  ServiceDegradedError,
  ValidationError,
  parseAPIError,
  formatErrorResponse,
  logError
} from '../src/utils/error-handling.js';

describe('APIError', () => {
  it('should create error with all properties', () => {
    const error = new APIError('Test error', 500, { locationId: 123 });

    expect(error.name).toBe('APIError');
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(500);
    expect(error.context.locationId).toBe(123);
    expect(error.timestamp).toBeDefined();
  });

  it('should convert to JSON', () => {
    const error = new APIError('Test error', 500);
    const json = error.toJSON();

    expect(json.error).toBe('APIError');
    expect(json.message).toBe('Test error');
    expect(json.statusCode).toBe(500);
    expect(json.userMessage).toBeDefined();
    expect(json.timestamp).toBeDefined();
  });
});

describe('CBPAPIError', () => {
  it('should generate user-friendly message for 400', () => {
    const error = new CBPAPIError(400);
    expect(error.userMessage).toContain('Invalid request');
  });

  it('should generate user-friendly message for 401/403', () => {
    const error = new CBPAPIError(401);
    expect(error.userMessage).toContain('Unable to access NEXUS appointment data');
  });

  it('should generate user-friendly message for 404', () => {
    const error = new CBPAPIError(404);
    expect(error.userMessage).toContain('not found');
  });

  it('should include location in 404 message when provided', () => {
    const error = new CBPAPIError(404, { locationId: 5020 });
    expect(error.userMessage).toContain('5020');
  });

  it('should generate user-friendly message for 429', () => {
    const error = new CBPAPIError(429);
    expect(error.userMessage).toContain('rate limiting');
  });

  it('should generate user-friendly message for 500', () => {
    const error = new CBPAPIError(500);
    expect(error.userMessage).toContain('internal errors');
  });

  it('should generate user-friendly message for 502/503/504', () => {
    const error = new CBPAPIError(503);
    expect(error.userMessage).toContain('temporarily unavailable');
  });

  it('should have generic message for unknown status codes', () => {
    const error = new CBPAPIError(418); // I'm a teapot
    expect(error.userMessage).toContain('Error 418');
  });
});

describe('NetworkError', () => {
  it('should create from original error', () => {
    const original = { code: 'ETIMEDOUT', message: 'Connection timed out' };
    const error = new NetworkError(original, { locationId: 123 });

    expect(error.name).toBe('NetworkError');
    expect(error.code).toBe('ETIMEDOUT');
    expect(error.context.locationId).toBe(123);
  });

  it('should generate user-friendly message for ECONNRESET', () => {
    const original = { code: 'ECONNRESET', message: 'Connection reset' };
    const error = new NetworkError(original);
    expect(error.userMessage).toContain('reset');
  });

  it('should generate user-friendly message for ETIMEDOUT', () => {
    const original = { code: 'ETIMEDOUT', message: 'Timeout' };
    const error = new NetworkError(original);
    expect(error.userMessage).toContain('timed out');
  });

  it('should generate user-friendly message for ENOTFOUND', () => {
    const original = { code: 'ENOTFOUND', message: 'Not found' };
    const error = new NetworkError(original);
    expect(error.userMessage).toContain('Unable to reach');
  });

  it('should generate user-friendly message for ECONNREFUSED', () => {
    const original = { code: 'ECONNREFUSED', message: 'Connection refused' };
    const error = new NetworkError(original);
    expect(error.userMessage).toContain('refused connection');
  });
});

describe('RateLimitError', () => {
  it('should create with retry-after', () => {
    const error = new RateLimitError(120);

    expect(error.name).toBe('RateLimitError');
    expect(error.statusCode).toBe(429);
    expect(error.retryAfter).toBe(120);
  });

  it('should generate user-friendly message', () => {
    const error = new RateLimitError(120);
    expect(error.userMessage).toContain('paused');
    expect(error.userMessage).toContain('2 minute');
  });

  it('should pluralize minutes correctly', () => {
    const error1 = new RateLimitError(60);
    expect(error1.userMessage).toContain('1 minute');
    expect(error1.userMessage).not.toContain('minutes');

    const error2 = new RateLimitError(180);
    expect(error2.userMessage).toContain('3 minutes');
  });
});

describe('ValidationError', () => {
  it('should create with field information', () => {
    const error = new ValidationError('email', 'Invalid format', { value: 'bad-email' });

    expect(error.name).toBe('ValidationError');
    expect(error.field).toBe('email');
    expect(error.statusCode).toBe(400);
    expect(error.context.value).toBe('bad-email');
  });

  it('should generate user-friendly message', () => {
    const error = new ValidationError('locationId', 'Must be a number');
    expect(error.userMessage).toContain('Invalid locationId');
  });
});

describe('ServiceDegradedError', () => {
  it('should create degraded error', () => {
    const error = new ServiceDegradedError('Cache miss');

    expect(error.name).toBe('ServiceDegradedError');
    expect(error.statusCode).toBe(503);
  });

  it('should generate user-friendly message', () => {
    const error = new ServiceDegradedError('Test');
    expect(error.userMessage).toContain('degraded mode');
  });
});

describe('parseAPIError', () => {
  it('should return APIError as-is', () => {
    const original = new CBPAPIError(500);
    const parsed = parseAPIError(original);

    expect(parsed).toBe(original);
  });

  it('should parse network errors', () => {
    const original = { code: 'ETIMEDOUT', message: 'Timeout' };
    const parsed = parseAPIError(original);

    expect(parsed).toBeInstanceOf(NetworkError);
    expect(parsed.code).toBe('ETIMEDOUT');
  });

  it('should parse HTTP status errors', () => {
    const original = { status: 503, message: 'Service unavailable' };
    const parsed = parseAPIError(original);

    expect(parsed).toBeInstanceOf(CBPAPIError);
    expect(parsed.statusCode).toBe(503);
  });

  it('should parse rate limit errors', () => {
    const original = { status: 429, headers: { get: () => '60' } };
    const parsed = parseAPIError(original);

    expect(parsed).toBeInstanceOf(RateLimitError);
    expect(parsed.retryAfter).toBe(60);
  });

  it('should preserve CircuitBreakerOpenError', () => {
    const original = new Error('Circuit open');
    original.name = 'CircuitBreakerOpenError';
    const parsed = parseAPIError(original);

    expect(parsed.name).toBe('CircuitBreakerOpenError');
  });

  it('should unwrap RetryError to get original', () => {
    const lastError = { status: 500, message: 'Server error' };
    const retryError = new Error('Failed after retries');
    retryError.name = 'RetryError';
    retryError.lastError = lastError;

    const parsed = parseAPIError(retryError);

    expect(parsed).toBeInstanceOf(CBPAPIError);
    expect(parsed.statusCode).toBe(500);
  });

  it('should create generic APIError for unknown errors', () => {
    const original = new Error('Unknown error');
    const parsed = parseAPIError(original);

    expect(parsed).toBeInstanceOf(APIError);
    expect(parsed.statusCode).toBe(500);
  });

  it('should include context in parsed error', () => {
    const original = { status: 404 };
    const context = { locationId: 123, operation: 'fetchSlots' };
    const parsed = parseAPIError(original, context);

    expect(parsed.context.locationId).toBe(123);
    expect(parsed.context.operation).toBe('fetchSlots');
  });
});

describe('formatErrorResponse', () => {
  it('should format error response with user message', () => {
    const error = new CBPAPIError(503);
    const response = formatErrorResponse(error);

    expect(response.success).toBe(false);
    expect(response.error.type).toBe('CBPAPIError');
    expect(response.error.message).toBe(error.userMessage);
    expect(response.error.code).toBe(503);
  });

  it('should include technical message when includeUserMessage is false', () => {
    const error = new CBPAPIError(503);
    const response = formatErrorResponse(error, { includeUserMessage: false });

    expect(response.error.message).toBe(error.message);
    expect(response.error.message).not.toBe(error.userMessage);
  });

  it('should include details when includeDetails is true', () => {
    const error = new CBPAPIError(503, { locationId: 123 });
    const response = formatErrorResponse(error, { includeDetails: true });

    expect(response.error.details).toBeDefined();
    expect(response.error.details.originalMessage).toBeDefined();
    expect(response.error.details.context).toBeDefined();
    expect(response.error.details.timestamp).toBeDefined();
  });

  it('should include retryAfter for rate limit errors', () => {
    const error = new RateLimitError(120);
    const response = formatErrorResponse(error);

    expect(response.error.retryAfter).toBe(120);
  });

  it('should parse non-APIError instances', () => {
    const error = new Error('Generic error');
    const response = formatErrorResponse(error);

    expect(response.success).toBe(false);
    expect(response.error.type).toBe('APIError');
  });
});

describe('logError', () => {
  it('should return log entry with structured data', () => {
    const error = new CBPAPIError(500, { locationId: 123 });
    const context = { operation: 'test' };

    const logEntry = logError(error, context, 'warn');

    expect(logEntry.level).toBe('warn');
    expect(logEntry.event).toBe('api_error');
    expect(logEntry.error).toBe('CBPAPIError');
    expect(logEntry.statusCode).toBe(500);
    expect(logEntry.locationId).toBe(123);
    expect(logEntry.operation).toBe('test');
    expect(logEntry.timestamp).toBeDefined();
  });

  it('should default to error level', () => {
    const error = new APIError('Test', 500);
    const logEntry = logError(error);

    expect(logEntry.level).toBe('error');
  });
});
