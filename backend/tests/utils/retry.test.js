/**
 * Tests for Exponential Backoff Retry Utility
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { withRetry, fetchWithRetry, RetryConfig, RetryError } from '../src/utils/retry.js';

describe('RetryConfig', () => {
  it('should use default configuration', () => {
    const config = new RetryConfig();
    expect(config.maxAttempts).toBe(3);
    expect(config.initialDelayMs).toBe(1000);
    expect(config.maxDelayMs).toBe(30000);
    expect(config.backoffMultiplier).toBe(2);
  });

  it('should allow custom configuration', () => {
    const config = new RetryConfig({
      maxAttempts: 5,
      initialDelayMs: 500,
      maxDelayMs: 10000
    });
    expect(config.maxAttempts).toBe(5);
    expect(config.initialDelayMs).toBe(500);
    expect(config.maxDelayMs).toBe(10000);
  });
});

describe('withRetry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should succeed on first attempt', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const result = await withRetry(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on retryable errors', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce({ code: 'ETIMEDOUT', message: 'Timeout' })
      .mockResolvedValue('success');

    const config = new RetryConfig({ maxAttempts: 2, initialDelayMs: 10 });
    const result = await withRetry(fn, config);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should retry on retryable HTTP status codes', async () => {
    const response1 = { ok: false, status: 503 };
    const response2 = { ok: true, status: 200 };

    const fn = vi.fn()
      .mockResolvedValueOnce(response1)
      .mockResolvedValueOnce(response2);

    const config = new RetryConfig({ maxAttempts: 2, initialDelayMs: 10 });
    const result = await withRetry(fn, config);

    expect(result).toBe(response2);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should not retry on non-retryable status codes', async () => {
    const response = { ok: false, status: 404 };
    const fn = vi.fn().mockResolvedValue(response);

    const result = await withRetry(fn);

    expect(result).toBe(response);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should throw RetryError after max attempts', async () => {
    const fn = vi.fn().mockRejectedValue({ code: 'ETIMEDOUT', message: 'Timeout' });

    const config = new RetryConfig({ maxAttempts: 3, initialDelayMs: 10 });

    await expect(withRetry(fn, config)).rejects.toThrow(RetryError);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should implement exponential backoff', async () => {
    const delays = [];
    const originalSetTimeout = global.setTimeout;

    // Mock setTimeout to track delays
    global.setTimeout = vi.fn((fn, delay) => {
      delays.push(delay);
      return originalSetTimeout(fn, 0); // Execute immediately for test
    });

    const fn = vi.fn()
      .mockRejectedValueOnce({ code: 'ETIMEDOUT', message: 'Timeout' })
      .mockRejectedValueOnce({ code: 'ETIMEDOUT', message: 'Timeout' })
      .mockResolvedValue('success');

    const config = new RetryConfig({
      maxAttempts: 3,
      initialDelayMs: 1000,
      backoffMultiplier: 2,
      jitterFactor: 0 // No jitter for predictable test
    });

    await withRetry(fn, config);

    // First retry: ~1000ms, Second retry: ~2000ms
    expect(delays[0]).toBeGreaterThanOrEqual(900);
    expect(delays[0]).toBeLessThanOrEqual(1100);
    expect(delays[1]).toBeGreaterThanOrEqual(1900);
    expect(delays[1]).toBeLessThanOrEqual(2100);

    global.setTimeout = originalSetTimeout;
  });

  it('should respect maxDelayMs cap', async () => {
    const delays = [];
    const originalSetTimeout = global.setTimeout;

    global.setTimeout = vi.fn((fn, delay) => {
      delays.push(delay);
      return originalSetTimeout(fn, 0);
    });

    const fn = vi.fn()
      .mockRejectedValueOnce({ code: 'ETIMEDOUT', message: 'Timeout' })
      .mockRejectedValueOnce({ code: 'ETIMEDOUT', message: 'Timeout' })
      .mockResolvedValue('success');

    const config = new RetryConfig({
      maxAttempts: 3,
      initialDelayMs: 10000,
      maxDelayMs: 5000,
      backoffMultiplier: 2,
      jitterFactor: 0
    });

    await withRetry(fn, config);

    // Both retries should be capped at maxDelayMs
    expect(delays[0]).toBeLessThanOrEqual(5000);
    expect(delays[1]).toBeLessThanOrEqual(5000);

    global.setTimeout = originalSetTimeout;
  });
});

describe('fetchWithRetry', () => {
  it('should retry fetch on network errors', async () => {
    const mockFetch = vi.fn()
      .mockRejectedValueOnce({ code: 'ECONNRESET', message: 'Connection reset' })
      .mockResolvedValue({ ok: true, status: 200 });

    global.fetch = mockFetch;

    const config = new RetryConfig({ maxAttempts: 2, initialDelayMs: 10 });
    await fetchWithRetry('https://api.example.com', {}, config);

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should pass through fetch options', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    global.fetch = mockFetch;

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data' })
    };

    await fetchWithRetry('https://api.example.com', options);

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com', options);
  });
});

describe('RetryError', () => {
  it('should contain attempt count and last error', () => {
    const lastError = new Error('Original error');
    const retryError = new RetryError('Failed after retries', 3, lastError);

    expect(retryError.name).toBe('RetryError');
    expect(retryError.attempts).toBe(3);
    expect(retryError.lastError).toBe(lastError);
  });
});
