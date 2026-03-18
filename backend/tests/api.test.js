/**
 * Integration tests for NEXUS Alert Cloudflare Worker API
 *
 * Routes under test:
 *   GET  /api/status
 *   POST /api/subscribe
 *   POST /api/unsubscribe
 *   GET  /api/subscribers
 *
 * Auth: all protected routes require `Authorization: Bearer test-secret`
 * (WEBHOOK_SECRET is injected as 'test-secret' via miniflare binding in vitest.config.js)
 */

import { SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';

const BASE = 'http://localhost';

const AUTH = {
  'Authorization': 'Bearer test-secret',
  'Content-Type': 'application/json',
};

const WRONG_AUTH = {
  'Authorization': 'Bearer wrong-token',
  'Content-Type': 'application/json',
};

// ─── Auth Guard ───────────────────────────────────────────────────────────────

describe('Auth guard', () => {
  it('rejects requests with wrong bearer token', async () => {
    const res = await SELF.fetch(`${BASE}/api/status`, { headers: WRONG_AUTH });
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data).toHaveProperty('error');
  });

  it('accepts requests with correct bearer token', async () => {
    const res = await SELF.fetch(`${BASE}/api/status`, { headers: AUTH });
    expect(res.status).toBe(200);
  });

  it('returns 404 for unknown routes (not 401)', async () => {
    const res = await SELF.fetch(`${BASE}/api/nonexistent`, { headers: AUTH });
    expect(res.status).toBe(404);
  });
});

// ─── GET /api/status ──────────────────────────────────────────────────────────

describe('GET /api/status', () => {
  it('returns 200 with expected response shape', async () => {
    const res = await SELF.fetch(`${BASE}/api/status`, { headers: AUTH });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('status', 'running');
    expect(data).toHaveProperty('subscriberCount');
    expect(data).toHaveProperty('totalChecks');
    expect(data).toHaveProperty('totalNotifications');
    expect(typeof data.subscriberCount).toBe('number');
  });

  it('subscriberCount is a non-negative integer', async () => {
    const res = await SELF.fetch(`${BASE}/api/status`, { headers: AUTH });
    const data = await res.json();
    expect(data.subscriberCount).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(data.subscriberCount)).toBe(true);
  });
});

// ─── POST /api/subscribe ──────────────────────────────────────────────────────

describe('POST /api/subscribe', () => {
  it('returns 400 when email is missing', async () => {
    const res = await SELF.fetch(`${BASE}/api/subscribe`, {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ locations: [5020], program: 'NEXUS' }),
    });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data).toHaveProperty('error');
  });

  it('returns 400 when locations are missing', async () => {
    const res = await SELF.fetch(`${BASE}/api/subscribe`, {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ email: 'noloc@example.com' }),
    });
    expect(res.status).toBe(400);
  });

  it('stores a new subscriber and returns 200', async () => {
    const email = 'subscriber-store@example.com';
    const body = { email, locations: [5020], program: 'NEXUS' };

    const res = await SELF.fetch(`${BASE}/api/subscribe`, {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify(body),
    });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.subscriber.email).toBe(email);
    expect(data.subscriber.locations).toEqual([5020]);
  });

  it('subscriber appears in /api/subscribers after subscribe', async () => {
    const email = 'subscriber-list@example.com';

    await SELF.fetch(`${BASE}/api/subscribe`, {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ email, locations: [5021], program: 'NEXUS' }),
    });

    const subsRes = await SELF.fetch(`${BASE}/api/subscribers`, { headers: AUTH });
    expect(subsRes.status).toBe(200);
    const data = await subsRes.json();
    expect(Array.isArray(data.subscribers)).toBe(true);
    expect(data.subscribers.some(s => s.email === email)).toBe(true);
  });

  it('is idempotent — subscribing twice does not duplicate the entry', async () => {
    const email = 'idempotent@example.com';
    const body = { email, locations: [5022], program: 'NEXUS' };

    // Subscribe twice
    await SELF.fetch(`${BASE}/api/subscribe`, {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify(body),
    });
    const res2 = await SELF.fetch(`${BASE}/api/subscribe`, {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify(body),
    });
    expect(res2.status).toBe(200);

    // Only one entry in subscriber list
    const subsRes = await SELF.fetch(`${BASE}/api/subscribers`, { headers: AUTH });
    const data = await subsRes.json();
    const matches = data.subscribers.filter(s => s.email === email);
    expect(matches.length).toBe(1);
  });
});

// ─── POST /api/unsubscribe ────────────────────────────────────────────────────

describe('POST /api/unsubscribe', () => {
  it('removes a previously subscribed email from KV', async () => {
    const email = 'to-remove@example.com';

    // Subscribe first
    await SELF.fetch(`${BASE}/api/subscribe`, {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ email, locations: [5030], program: 'NEXUS' }),
    });

    // Unsubscribe
    const res = await SELF.fetch(`${BASE}/api/unsubscribe`, {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ email }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    // Verify removed from subscriber list
    const subsRes = await SELF.fetch(`${BASE}/api/subscribers`, { headers: AUTH });
    const subs = await subsRes.json();
    expect(subs.subscribers.some(s => s.email === email)).toBe(false);
  });

  it('returns 200 gracefully for a non-existent email (no-op)', async () => {
    const res = await SELF.fetch(`${BASE}/api/unsubscribe`, {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ email: 'ghost@example.com' }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it('returns 400 when email is missing from body', async () => {
    const res = await SELF.fetch(`${BASE}/api/unsubscribe`, {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });
});

// ─── GET /api/subscribers ─────────────────────────────────────────────────────

describe('GET /api/subscribers', () => {
  it('returns 200 with a subscribers array', async () => {
    const res = await SELF.fetch(`${BASE}/api/subscribers`, { headers: AUTH });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('subscribers');
    expect(Array.isArray(data.subscribers)).toBe(true);
  });
});

// ─── Signed unsubscribe (public GET — no auth) ────────────────────────────────

describe('GET /api/unsubscribe (public signed link)', () => {
  it('returns 400 when token and email params are missing', async () => {
    const res = await SELF.fetch(`${BASE}/api/unsubscribe`, { method: 'GET' });
    expect(res.status).toBe(400);
  });

  it('returns 403 for an invalid HMAC token', async () => {
    const res = await SELF.fetch(
      `${BASE}/api/unsubscribe?email=test@example.com&token=badsignature`
    );
    expect(res.status).toBe(403);
  });
});

// ─── Stripe webhook placeholder ───────────────────────────────────────────────
// NOTE: POST /api/webhook (Stripe) is not yet implemented in worker.js.
// This placeholder test documents the intended behavior.
// Uncomment and implement once the route exists.
//
// describe('POST /api/webhook (Stripe — future)', () => {
//   it('returns 400 for missing Stripe signature', async () => {
//     const res = await SELF.fetch(`${BASE}/api/webhook`, {
//       method: 'POST',
//       body: JSON.stringify({ type: 'checkout.session.completed' }),
//     });
//     expect(res.status).toBe(400);
//   });
// });
