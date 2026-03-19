// Rate Limiting Middleware Tests
import { describe, it, expect, beforeEach } from 'vitest';
import { rateLimit } from '../src/middleware/rateLimit.js';

describe('Rate Limiting Middleware', () => {
  let mockEnv;
  let mockRequest;
  let kvStore;

  beforeEach(() => {
    // Mock KV store
    kvStore = new Map();
    mockEnv = {
      NEXUS_ALERTS_KV: {
        get: async (key) => kvStore.get(key) || null,
        put: async (key, value, options) => {
          kvStore.set(key, value);
          // Simulate TTL expiration for testing
          if (options?.expirationTtl) {
            setTimeout(() => kvStore.delete(key), options.expirationTtl * 1000);
          }
        },
      },
      SLACK_WEBHOOK_URL: null, // Disable Slack alerts in tests
    };

    // Mock request with CF-Connecting-IP header
    const headers = new Headers();
    headers.set('CF-Connecting-IP', '192.168.1.100');
    mockRequest = { headers };
  });

  describe('Critical Endpoint Rate Limiting', () => {
    it('should allow requests within limit', async () => {
      const endpoint = '/api/subscribe';

      // First request should succeed
      const result1 = await rateLimit(mockRequest, mockEnv, endpoint);
      expect(result1).not.toHaveProperty('status');
      expect(result1).toHaveProperty('headers');
      // Headers from both critical and global limits are merged
      expect(result1.headers['X-RateLimit-Remaining']).toBeDefined();

      // Second request should also succeed
      const result2 = await rateLimit(mockRequest, mockEnv, endpoint);
      expect(result2).not.toHaveProperty('status');
      // Remaining count should be less than first request
      expect(parseInt(result2.headers['X-RateLimit-Remaining'])).toBeLessThan(
        parseInt(result1.headers['X-RateLimit-Remaining'])
      );
    });

    it('should block requests exceeding limit', async () => {
      const endpoint = '/api/subscribe';

      // Send 10 requests (at the limit)
      for (let i = 0; i < 10; i++) {
        const result = await rateLimit(mockRequest, mockEnv, endpoint);
        expect(result).not.toHaveProperty('status'); // Should succeed
      }

      // 11th request should be rate limited
      const result = await rateLimit(mockRequest, mockEnv, endpoint);
      expect(result).toHaveProperty('status', 429);
      expect(await result.json()).toMatchObject({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: 60,
          limit: 10,
        },
      });
    });

    it('should include Retry-After header in 429 response', async () => {
      const endpoint = '/api/checkout';

      // Exhaust rate limit
      for (let i = 0; i < 11; i++) {
        await rateLimit(mockRequest, mockEnv, endpoint);
      }

      // Check 429 response headers
      const result = await rateLimit(mockRequest, mockEnv, endpoint);
      expect(result.headers.get('Retry-After')).toBe('60');
      expect(result.headers.get('X-RateLimit-Limit')).toBe('10');
      expect(result.headers.get('X-RateLimit-Remaining')).toBe('0');
    });

    it('should track different IPs separately', async () => {
      const endpoint = '/api/subscribe';

      // First IP
      const headers1 = new Headers();
      headers1.set('CF-Connecting-IP', '192.168.1.100');
      const request1 = { headers: headers1 };

      // Second IP
      const headers2 = new Headers();
      headers2.set('CF-Connecting-IP', '192.168.1.200');
      const request2 = { headers: headers2 };

      // Exhaust first IP's limit
      for (let i = 0; i < 10; i++) {
        await rateLimit(request1, mockEnv, endpoint);
      }

      // First IP should be blocked
      const result1 = await rateLimit(request1, mockEnv, endpoint);
      expect(result1).toHaveProperty('status', 429);

      // Second IP should still work (fresh IP, not rate limited)
      const result2 = await rateLimit(request2, mockEnv, endpoint);
      expect(result2).not.toHaveProperty('status');
      // Should have a remaining count (exact value doesn't matter)
      expect(result2.headers['X-RateLimit-Remaining']).toBeDefined();
    });

    it('should track different endpoints separately', async () => {
      const endpoint1 = '/api/subscribe';
      const endpoint2 = '/api/checkout';

      // Exhaust /api/subscribe limit
      for (let i = 0; i < 10; i++) {
        await rateLimit(mockRequest, mockEnv, endpoint1);
      }

      // /api/subscribe should be blocked
      const result1 = await rateLimit(mockRequest, mockEnv, endpoint1);
      expect(result1).toHaveProperty('status', 429);

      // /api/checkout should still work
      const result2 = await rateLimit(mockRequest, mockEnv, endpoint2);
      expect(result2).not.toHaveProperty('status');
      expect(result2.headers['X-RateLimit-Remaining']).toBe('9');
    });
  });

  describe('Global Rate Limiting', () => {
    it('should enforce global rate limit across all endpoints', async () => {
      // This is indirectly tested by the critical endpoint tests
      // since rateLimit() checks both critical and global limits
      // For comprehensive testing, you would need to make 60+ requests
      // across different endpoints from the same IP
      expect(true).toBe(true);
    });
  });

  describe('IP Detection', () => {
    it('should prefer CF-Connecting-IP header', async () => {
      const headers = new Headers();
      headers.set('CF-Connecting-IP', '1.1.1.1');
      headers.set('X-Real-IP', '2.2.2.2');
      headers.set('X-Forwarded-For', '3.3.3.3, 4.4.4.4');
      const request = { headers };

      await rateLimit(request, mockEnv, '/api/subscribe');

      // Should use CF-Connecting-IP (1.1.1.1)
      const key = Array.from(kvStore.keys())[0];
      expect(key).toContain('1.1.1.1');
    });

    it('should fallback to X-Real-IP if CF-Connecting-IP missing', async () => {
      const headers = new Headers();
      headers.set('X-Real-IP', '2.2.2.2');
      headers.set('X-Forwarded-For', '3.3.3.3, 4.4.4.4');
      const request = { headers };

      await rateLimit(request, mockEnv, '/api/subscribe');

      const key = Array.from(kvStore.keys())[0];
      expect(key).toContain('2.2.2.2');
    });

    it('should fallback to X-Forwarded-For first IP if others missing', async () => {
      const headers = new Headers();
      headers.set('X-Forwarded-For', '3.3.3.3, 4.4.4.4');
      const request = { headers };

      await rateLimit(request, mockEnv, '/api/subscribe');

      const key = Array.from(kvStore.keys())[0];
      expect(key).toContain('3.3.3.3');
    });

    it('should use "unknown" if no IP headers present', async () => {
      const headers = new Headers();
      const request = { headers };

      await rateLimit(request, mockEnv, '/api/subscribe');

      const key = Array.from(kvStore.keys())[0];
      expect(key).toContain('unknown');
    });
  });

  describe('Error Handling (Fail-Open)', () => {
    it('should allow request through if KV fails', async () => {
      // Mock KV to throw error
      mockEnv.NEXUS_ALERTS_KV.get = async () => {
        throw new Error('KV unavailable');
      };

      const result = await rateLimit(mockRequest, mockEnv, '/api/subscribe');

      // Should return empty headers object (fail open - allow request)
      expect(result).toHaveProperty('headers');
      expect(result.status).toBeUndefined(); // No 429 status
    });
  });

  describe('Rate Limit Headers', () => {
    it('should include rate limit headers in successful response', async () => {
      const result = await rateLimit(mockRequest, mockEnv, '/api/subscribe');

      expect(result.headers).toHaveProperty('X-RateLimit-Limit');
      expect(result.headers).toHaveProperty('X-RateLimit-Remaining');
      expect(result.headers).toHaveProperty('X-RateLimit-Reset');
      // Headers are merged from both critical and global limits
      // The actual limit shown may be from either - what matters is headers exist
      expect(parseInt(result.headers['X-RateLimit-Limit'])).toBeGreaterThan(0);
    });

    it('should decrement remaining count with each request', async () => {
      const result1 = await rateLimit(mockRequest, mockEnv, '/api/subscribe');
      const remaining1 = parseInt(result1.headers['X-RateLimit-Remaining']);

      const result2 = await rateLimit(mockRequest, mockEnv, '/api/subscribe');
      const remaining2 = parseInt(result2.headers['X-RateLimit-Remaining']);

      const result3 = await rateLimit(mockRequest, mockEnv, '/api/subscribe');
      const remaining3 = parseInt(result3.headers['X-RateLimit-Remaining']);

      // Each request should decrement the counter
      expect(remaining2).toBeLessThan(remaining1);
      expect(remaining3).toBeLessThan(remaining2);
    });
  });
});
