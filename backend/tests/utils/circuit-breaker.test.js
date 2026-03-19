/**
 * Tests for Circuit Breaker Pattern
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  CircuitBreaker,
  CircuitBreakerConfig,
  CircuitBreakerOpenError,
  createCircuitBreaker
} from '../src/utils/circuit-breaker.js';

// Mock KV store
class MockKVStore {
  constructor() {
    this.store = new Map();
  }

  async get(key) {
    return this.store.get(key) || null;
  }

  async put(key, value) {
    this.store.set(key, value);
  }

  clear() {
    this.store.clear();
  }
}

describe('CircuitBreakerConfig', () => {
  it('should use default configuration', () => {
    const config = new CircuitBreakerConfig();
    expect(config.failureThreshold).toBe(5);
    expect(config.successThreshold).toBe(2);
    expect(config.resetTimeoutMs).toBe(60000);
    expect(config.name).toBe('default');
  });

  it('should allow custom configuration', () => {
    const config = new CircuitBreakerConfig({
      name: 'test-api',
      failureThreshold: 3,
      successThreshold: 1,
      resetTimeoutMs: 30000
    });

    expect(config.name).toBe('test-api');
    expect(config.failureThreshold).toBe(3);
    expect(config.successThreshold).toBe(1);
    expect(config.resetTimeoutMs).toBe(30000);
  });
});

describe('CircuitBreaker', () => {
  let kv;
  let breaker;

  beforeEach(() => {
    kv = new MockKVStore();
    const config = new CircuitBreakerConfig({
      name: 'test',
      failureThreshold: 3,
      successThreshold: 2,
      resetTimeoutMs: 1000
    });
    breaker = new CircuitBreaker(config, kv);
  });

  describe('CLOSED state (normal operation)', () => {
    it('should execute function successfully', async () => {
      const fn = vi.fn().mockResolvedValue('success');
      const result = await breaker.execute(fn);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should track failures without opening', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('Failure'));

      await expect(breaker.execute(fn)).rejects.toThrow('Failure');

      const state = await breaker.getState();
      expect(state.state).toBe('CLOSED');
      expect(state.failures).toBe(1);
    });

    it('should reset failures on success after partial failures', async () => {
      const config = new CircuitBreakerConfig({ name: 'test', failureThreshold: 3, windowMs: 1000 });
      const breaker = new CircuitBreaker(config, kv);

      const failFn = vi.fn().mockRejectedValue(new Error('Failure'));
      const successFn = vi.fn().mockResolvedValue('success');

      // Fail twice
      await expect(breaker.execute(failFn)).rejects.toThrow();
      await expect(breaker.execute(failFn)).rejects.toThrow();

      // Wait for window to expire
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Success should reset counter
      await breaker.execute(successFn);

      const state = await breaker.getState();
      expect(state.failures).toBe(0);
    });

    it('should open circuit after threshold failures', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('Failure'));

      // Fail 3 times (threshold)
      await expect(breaker.execute(fn)).rejects.toThrow('Failure');
      await expect(breaker.execute(fn)).rejects.toThrow('Failure');
      await expect(breaker.execute(fn)).rejects.toThrow('Failure');

      const state = await breaker.getState();
      expect(state.state).toBe('OPEN');
      expect(state.failures).toBe(3);
    });
  });

  describe('OPEN state (circuit breaker tripped)', () => {
    beforeEach(async () => {
      // Trip the circuit breaker
      const fn = vi.fn().mockRejectedValue(new Error('Failure'));
      for (let i = 0; i < 3; i++) {
        await expect(breaker.execute(fn)).rejects.toThrow();
      }
    });

    it('should reject requests immediately without calling function', async () => {
      const fn = vi.fn().mockResolvedValue('success');

      await expect(breaker.execute(fn)).rejects.toThrow(CircuitBreakerOpenError);
      expect(fn).not.toHaveBeenCalled();
    });

    it('should include retry-after information in error', async () => {
      const fn = vi.fn().mockResolvedValue('success');

      try {
        await breaker.execute(fn);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(CircuitBreakerOpenError);
        expect(error.retryAfter).toBeGreaterThan(0);
      }
    });

    it('should transition to HALF_OPEN after timeout', async () => {
      // Wait for reset timeout
      await new Promise(resolve => setTimeout(resolve, 1100));

      const fn = vi.fn().mockResolvedValue('success');
      await breaker.execute(fn);

      const state = await breaker.getState();
      expect(state.state).toBe('CLOSED'); // Should close after successful HALF_OPEN test
    });
  });

  describe('HALF_OPEN state (testing recovery)', () => {
    beforeEach(async () => {
      // Trip the circuit breaker
      const failFn = vi.fn().mockRejectedValue(new Error('Failure'));
      for (let i = 0; i < 3; i++) {
        await expect(breaker.execute(failFn)).rejects.toThrow();
      }

      // Wait for reset timeout to reach HALF_OPEN
      await new Promise(resolve => setTimeout(resolve, 1100));
    });

    it('should close circuit after success threshold met', async () => {
      const fn = vi.fn().mockResolvedValue('success');

      // Need 2 successes to close (successThreshold = 2)
      await breaker.execute(fn);
      let state = await breaker.getState();
      expect(state.state).toBe('HALF_OPEN');
      expect(state.successes).toBe(1);

      await breaker.execute(fn);
      state = await breaker.getState();
      expect(state.state).toBe('CLOSED');
      expect(state.successes).toBe(0);
      expect(state.failures).toBe(0);
    });

    it('should reopen circuit on failure during recovery', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('Still failing'));

      await expect(breaker.execute(fn)).rejects.toThrow('Still failing');

      const state = await breaker.getState();
      expect(state.state).toBe('OPEN');
    });
  });

  describe('reset()', () => {
    it('should reset circuit to CLOSED state', async () => {
      // Trip the circuit
      const failFn = vi.fn().mockRejectedValue(new Error('Failure'));
      for (let i = 0; i < 3; i++) {
        await expect(breaker.execute(failFn)).rejects.toThrow();
      }

      await breaker.reset();

      const state = await breaker.getState();
      expect(state.state).toBe('CLOSED');
      expect(state.failures).toBe(0);
      expect(state.successes).toBe(0);
    });
  });

  describe('getHealthStatus()', () => {
    it('should return health status for CLOSED circuit', async () => {
      const health = await breaker.getHealthStatus();

      expect(health.name).toBe('test');
      expect(health.state).toBe('CLOSED');
      expect(health.healthy).toBe(true);
      expect(health.failures).toBe(0);
    });

    it('should return unhealthy status for OPEN circuit', async () => {
      // Trip the circuit
      const failFn = vi.fn().mockRejectedValue(new Error('Failure'));
      for (let i = 0; i < 3; i++) {
        await expect(breaker.execute(failFn)).rejects.toThrow();
      }

      const health = await breaker.getHealthStatus();

      expect(health.state).toBe('OPEN');
      expect(health.healthy).toBe(false);
      expect(health.failures).toBe(3);
    });
  });
});

describe('createCircuitBreaker', () => {
  it('should create a circuit breaker with custom config', () => {
    const kv = new MockKVStore();
    const breaker = createCircuitBreaker('my-api', kv, {
      failureThreshold: 10,
      resetTimeoutMs: 30000
    });

    expect(breaker).toBeInstanceOf(CircuitBreaker);
    expect(breaker.config.name).toBe('my-api');
    expect(breaker.config.failureThreshold).toBe(10);
    expect(breaker.config.resetTimeoutMs).toBe(30000);
  });
});

describe('without KV store', () => {
  it('should work without KV store (in-memory only)', async () => {
    const config = new CircuitBreakerConfig({ name: 'test', failureThreshold: 2 });
    const breaker = new CircuitBreaker(config, null);

    const fn = vi.fn().mockResolvedValue('success');
    const result = await breaker.execute(fn);

    expect(result).toBe('success');
  });
});
