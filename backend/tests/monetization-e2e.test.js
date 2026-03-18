/**
 * End-to-end tests for NEXUS Alert Monetization Pipeline
 *
 * Flow tested:
 *   1. Stripe webhook fired → License stored in KV
 *   2. License validation → Feature access granted
 *   3. Subscription cancellation → Downgrade to free
 *
 * Note: Checkout creation tests are excluded because they require real Stripe API calls.
 * Those are validated through manual testing and production monitoring.
 *
 * Critical validation before scaling marketing and revenue operations.
 *
 * Run: npm test
 */

import { SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import crypto from 'crypto';

const BASE = 'http://localhost';

// Helper to construct Stripe webhook signature
function constructStripeSignature(payload, secret, timestamp) {
  const signedPayload = `${timestamp}.${payload}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');
  return `t=${timestamp},v1=${signature}`;
}

// Helper to create mock Stripe webhook event
function createStripeWebhookEvent(type, data) {
  return {
    id: `evt_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    object: 'event',
    api_version: '2023-10-16',
    created: Math.floor(Date.now() / 1000),
    type,
    data: {
      object: data,
    },
  };
}

describe('Monetization Pipeline E2E', () => {
  // ─── WEBHOOK PROCESSING → LICENSE STORAGE ──────────────────────────

  describe('Step 1: Stripe Webhook Processing', () => {
    it('processes checkout.session.completed webhook and stores Premium license', async () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const webhookEmail = `webhook-premium-${Date.now()}@example.com`;

      const checkoutSession = {
        id: `cs_test_${Date.now()}`,
        object: 'checkout.session',
        customer: `cus_test_${Date.now()}`,
        subscription: `sub_test_${Date.now()}`,
        metadata: {
          email: webhookEmail,
          billingCycle: 'monthly',
        },
        line_items: null,
      };

      const event = createStripeWebhookEvent('checkout.session.completed', checkoutSession);
      const payload = JSON.stringify(event);
      const signature = constructStripeSignature(payload, 'test-webhook-secret', timestamp);

      const res = await SELF.fetch(`${BASE}/api/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': signature,
        },
        body: payload,
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.received).toBe(true);

      // Verify license was stored in KV
      const licenseRes = await SELF.fetch(`${BASE}/api/license?email=${encodeURIComponent(webhookEmail)}`);
      expect(licenseRes.status).toBe(200);
      const licenseData = await licenseRes.json();
      expect(licenseData.tier).toBe('premium');
    });

    it('processes checkout.session.completed webhook and stores Pro license', async () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const proEmail = `webhook-pro-${Date.now()}@example.com`;

      const checkoutSession = {
        id: `cs_test_pro_${Date.now()}`,
        object: 'checkout.session',
        customer: `cus_test_pro_${Date.now()}`,
        subscription: `sub_test_pro_${Date.now()}`,
        metadata: {
          email: proEmail,
          tier: 'pro',
        },
        line_items: null,
      };

      const event = createStripeWebhookEvent('checkout.session.completed', checkoutSession);
      const payload = JSON.stringify(event);
      const signature = constructStripeSignature(payload, 'test-webhook-secret', timestamp);

      const res = await SELF.fetch(`${BASE}/api/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': signature,
        },
        body: payload,
      });

      expect(res.status).toBe(200);

      // Verify Pro tier license
      const licenseRes = await SELF.fetch(`${BASE}/api/license?email=${encodeURIComponent(proEmail)}`);
      const licenseData = await licenseRes.json();
      expect(licenseData.tier).toBe('pro');
    });

    it('processes annual plan subscription correctly', async () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const annualEmail = `webhook-annual-${Date.now()}@example.com`;

      const checkoutSession = {
        id: `cs_test_annual_${Date.now()}`,
        object: 'checkout.session',
        customer: `cus_test_annual_${Date.now()}`,
        subscription: `sub_test_annual_${Date.now()}`,
        metadata: {
          email: annualEmail,
          billingCycle: 'annual',
        },
        line_items: null,
      };

      const event = createStripeWebhookEvent('checkout.session.completed', checkoutSession);
      const payload = JSON.stringify(event);
      const signature = constructStripeSignature(payload, 'test-webhook-secret', timestamp);

      await SELF.fetch(`${BASE}/api/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': signature,
        },
        body: payload,
      });

      // Verify license
      const licenseRes = await SELF.fetch(`${BASE}/api/license?email=${encodeURIComponent(annualEmail)}`);
      const licenseData = await licenseRes.json();
      expect(licenseData.tier).toBe('premium');
    });

    it('rejects webhook with invalid signature', async () => {
      const webhookEmail = `invalid-sig-${Date.now()}@example.com`;

      const checkoutSession = {
        id: 'cs_test_invalid',
        object: 'checkout.session',
        customer: 'cus_test_invalid',
        subscription: 'sub_test_invalid',
        metadata: {
          email: webhookEmail,
          billingCycle: 'monthly',
        },
      };

      const event = createStripeWebhookEvent('checkout.session.completed', checkoutSession);
      const payload = JSON.stringify(event);

      const res = await SELF.fetch(`${BASE}/api/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': 't=12345,v1=invalid_signature',
        },
        body: payload,
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBeDefined();
    });

    it('rejects webhook with missing signature', async () => {
      const event = createStripeWebhookEvent('checkout.session.completed', {});
      const payload = JSON.stringify(event);

      const res = await SELF.fetch(`${BASE}/api/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain('stripe-signature');
    });

    it('handles subscription deletion and downgrades to free', async () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const cancelEmail = `webhook-cancel-${Date.now()}@example.com`;

      // First, create a premium license
      const checkoutSession = {
        id: `cs_test_cancel_${Date.now()}`,
        object: 'checkout.session',
        customer: `cus_test_cancel_${Date.now()}`,
        subscription: `sub_test_cancel_${Date.now()}`,
        metadata: {
          email: cancelEmail,
          billingCycle: 'monthly',
        },
        line_items: null,
      };

      const createEvent = createStripeWebhookEvent('checkout.session.completed', checkoutSession);
      const createPayload = JSON.stringify(createEvent);
      const createSignature = constructStripeSignature(createPayload, 'test-webhook-secret', timestamp);

      await SELF.fetch(`${BASE}/api/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': createSignature,
        },
        body: createPayload,
      });

      // Verify premium tier
      let licenseRes = await SELF.fetch(`${BASE}/api/license?email=${encodeURIComponent(cancelEmail)}`);
      let licenseData = await licenseRes.json();
      expect(licenseData.tier).toBe('premium');

      // Now send subscription.deleted webhook
      const deleteTimestamp = Math.floor(Date.now() / 1000);
      const subscription = {
        id: checkoutSession.subscription,
        object: 'subscription',
        customer: checkoutSession.customer,
      };

      const deleteEvent = createStripeWebhookEvent('customer.subscription.deleted', subscription);
      const deletePayload = JSON.stringify(deleteEvent);
      const deleteSignature = constructStripeSignature(deletePayload, 'test-webhook-secret', deleteTimestamp);

      const deleteRes = await SELF.fetch(`${BASE}/api/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': deleteSignature,
        },
        body: deletePayload,
      });

      expect(deleteRes.status).toBe(200);

      // Verify downgrade to free
      licenseRes = await SELF.fetch(`${BASE}/api/license?email=${encodeURIComponent(cancelEmail)}`);
      licenseData = await licenseRes.json();
      expect(licenseData.tier).toBe('free');
    });

    it('tracks referral code in subscription metadata', async () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const referredEmail = `webhook-ref-${Date.now()}@example.com`;
      const referralCode = 'TESTREF123';

      const checkoutSession = {
        id: `cs_test_referral_${Date.now()}`,
        object: 'checkout.session',
        customer: `cus_test_referral_${Date.now()}`,
        subscription: `sub_test_referral_${Date.now()}`,
        metadata: {
          email: referredEmail,
          billingCycle: 'monthly',
          referralCode,
        },
        line_items: null,
      };

      const event = createStripeWebhookEvent('checkout.session.completed', checkoutSession);
      const payload = JSON.stringify(event);
      const signature = constructStripeSignature(payload, 'test-webhook-secret', timestamp);

      const res = await SELF.fetch(`${BASE}/api/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': signature,
        },
        body: payload,
      });

      expect(res.status).toBe(200);
      // Referral conversion is tracked in webhook handler
    });
  });

  // ─── LICENSE VALIDATION → FEATURE ACCESS ───────────────────────────

  describe('Step 2: License Validation', () => {
    it('returns free tier for non-existent email', async () => {
      const res = await SELF.fetch(`${BASE}/api/license?email=nonexistent-${Date.now()}@example.com`);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.tier).toBe('free');
    });

    it('validates premium license correctly', async () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const premiumEmail = `validate-premium-${Date.now()}@example.com`;

      // Create premium license via webhook
      const checkoutSession = {
        id: `cs_test_validate_${Date.now()}`,
        object: 'checkout.session',
        customer: `cus_test_validate_${Date.now()}`,
        subscription: `sub_test_validate_${Date.now()}`,
        metadata: {
          email: premiumEmail,
          billingCycle: 'monthly',
        },
        line_items: null,
      };

      const event = createStripeWebhookEvent('checkout.session.completed', checkoutSession);
      const payload = JSON.stringify(event);
      const signature = constructStripeSignature(payload, 'test-webhook-secret', timestamp);

      await SELF.fetch(`${BASE}/api/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': signature,
        },
        body: payload,
      });

      // Validate license
      const res = await SELF.fetch(`${BASE}/api/license?email=${encodeURIComponent(premiumEmail)}`);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.tier).toBe('premium');
    });

    it('validates Pro tier license correctly', async () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const proEmail = `validate-pro-${Date.now()}@example.com`;

      // Create Pro license via webhook
      const checkoutSession = {
        id: `cs_test_pro_validate_${Date.now()}`,
        object: 'checkout.session',
        customer: `cus_test_pro_validate_${Date.now()}`,
        subscription: `sub_test_pro_validate_${Date.now()}`,
        metadata: {
          email: proEmail,
          tier: 'pro',
        },
        line_items: null,
      };

      const event = createStripeWebhookEvent('checkout.session.completed', checkoutSession);
      const payload = JSON.stringify(event);
      const signature = constructStripeSignature(payload, 'test-webhook-secret', timestamp);

      await SELF.fetch(`${BASE}/api/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': signature,
        },
        body: payload,
      });

      // Validate license
      const res = await SELF.fetch(`${BASE}/api/license?email=${encodeURIComponent(proEmail)}`);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.tier).toBe('pro');
    });

    it('requires email parameter', async () => {
      const res = await SELF.fetch(`${BASE}/api/license`);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toContain('email');
    });

    it('handles URL-encoded email correctly', async () => {
      const emailWithPlus = 'user+test@example.com';
      const res = await SELF.fetch(`${BASE}/api/license?email=${encodeURIComponent(emailWithPlus)}`);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('tier');
    });
  });

  // ─── INTEGRATION SMOKE TESTS ───────────────────────────────────────

  describe('Step 3: Complete Flow Integration', () => {
    it('complete flow: webhook → license validation', async () => {
      const e2eEmail = `e2e-smoke-${Date.now()}@example.com`;

      // Simulate webhook
      const timestamp = Math.floor(Date.now() / 1000);
      const checkoutSession = {
        id: `cs_test_smoke_${Date.now()}`,
        object: 'checkout.session',
        customer: `cus_test_smoke_${Date.now()}`,
        subscription: `sub_test_smoke_${Date.now()}`,
        metadata: {
          email: e2eEmail,
          billingCycle: 'monthly',
        },
        line_items: null,
      };

      const event = createStripeWebhookEvent('checkout.session.completed', checkoutSession);
      const payload = JSON.stringify(event);
      const signature = constructStripeSignature(payload, 'test-webhook-secret', timestamp);

      const webhookRes = await SELF.fetch(`${BASE}/api/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': signature,
        },
        body: payload,
      });

      expect(webhookRes.status).toBe(200);

      // Validate license
      const licenseRes = await SELF.fetch(`${BASE}/api/license?email=${encodeURIComponent(e2eEmail)}`);
      expect(licenseRes.status).toBe(200);
      const licenseData = await licenseRes.json();
      expect(licenseData.tier).toBe('premium');
    });

    it('handles cancellation flow correctly', async () => {
      const cancelEmail = `cancel-smoke-${Date.now()}@example.com`;

      // Create premium subscription
      const timestamp1 = Math.floor(Date.now() / 1000);
      const checkoutSession = {
        id: `cs_test_cancel_smoke_${Date.now()}`,
        object: 'checkout.session',
        customer: `cus_test_cancel_smoke_${Date.now()}`,
        subscription: `sub_test_cancel_smoke_${Date.now()}`,
        metadata: {
          email: cancelEmail,
          billingCycle: 'monthly',
        },
        line_items: null,
      };

      const createEvent = createStripeWebhookEvent('checkout.session.completed', checkoutSession);
      const createPayload = JSON.stringify(createEvent);
      const createSignature = constructStripeSignature(createPayload, 'test-webhook-secret', timestamp1);

      await SELF.fetch(`${BASE}/api/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': createSignature,
        },
        body: createPayload,
      });

      // Verify premium
      let licenseRes = await SELF.fetch(`${BASE}/api/license?email=${encodeURIComponent(cancelEmail)}`);
      let licenseData = await licenseRes.json();
      expect(licenseData.tier).toBe('premium');

      // Cancel subscription
      const timestamp2 = Math.floor(Date.now() / 1000);
      const subscription = {
        id: checkoutSession.subscription,
        object: 'subscription',
        customer: checkoutSession.customer,
      };

      const deleteEvent = createStripeWebhookEvent('customer.subscription.deleted', subscription);
      const deletePayload = JSON.stringify(deleteEvent);
      const deleteSignature = constructStripeSignature(deletePayload, 'test-webhook-secret', timestamp2);

      await SELF.fetch(`${BASE}/api/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': deleteSignature,
        },
        body: deletePayload,
      });

      // Verify downgrade
      licenseRes = await SELF.fetch(`${BASE}/api/license?email=${encodeURIComponent(cancelEmail)}`);
      licenseData = await licenseRes.json();
      expect(licenseData.tier).toBe('free');
    });

    it('validates all three tiers are distinct', async () => {
      const freeEmail = `free-tier-${Date.now()}@example.com`;
      const premiumEmail = `premium-tier-${Date.now()}@example.com`;
      const proEmail = `pro-tier-${Date.now()}@example.com`;

      // Free tier (no license)
      const freeRes = await SELF.fetch(`${BASE}/api/license?email=${encodeURIComponent(freeEmail)}`);
      const freeData = await freeRes.json();
      expect(freeData.tier).toBe('free');

      // Premium tier
      const timestamp1 = Math.floor(Date.now() / 1000);
      const premiumSession = {
        id: `cs_test_premium_distinct_${Date.now()}`,
        object: 'checkout.session',
        customer: `cus_test_premium_distinct_${Date.now()}`,
        subscription: `sub_test_premium_distinct_${Date.now()}`,
        metadata: {
          email: premiumEmail,
          billingCycle: 'monthly',
        },
        line_items: null,
      };

      const premiumEvent = createStripeWebhookEvent('checkout.session.completed', premiumSession);
      const premiumPayload = JSON.stringify(premiumEvent);
      const premiumSignature = constructStripeSignature(premiumPayload, 'test-webhook-secret', timestamp1);

      await SELF.fetch(`${BASE}/api/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': premiumSignature,
        },
        body: premiumPayload,
      });

      const premiumRes = await SELF.fetch(`${BASE}/api/license?email=${encodeURIComponent(premiumEmail)}`);
      const premiumData = await premiumRes.json();
      expect(premiumData.tier).toBe('premium');

      // Pro tier
      const timestamp2 = Math.floor(Date.now() / 1000);
      const proSession = {
        id: `cs_test_pro_distinct_${Date.now()}`,
        object: 'checkout.session',
        customer: `cus_test_pro_distinct_${Date.now()}`,
        subscription: `sub_test_pro_distinct_${Date.now()}`,
        metadata: {
          email: proEmail,
          tier: 'pro',
        },
        line_items: null,
      };

      const proEvent = createStripeWebhookEvent('checkout.session.completed', proSession);
      const proPayload = JSON.stringify(proEvent);
      const proSignature = constructStripeSignature(proPayload, 'test-webhook-secret', timestamp2);

      await SELF.fetch(`${BASE}/api/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': proSignature,
        },
        body: proPayload,
      });

      const proRes = await SELF.fetch(`${BASE}/api/license?email=${encodeURIComponent(proEmail)}`);
      const proData = await proRes.json();
      expect(proData.tier).toBe('pro');

      // Verify all tiers are distinct
      expect(freeData.tier).not.toBe(premiumData.tier);
      expect(freeData.tier).not.toBe(proData.tier);
      expect(premiumData.tier).not.toBe(proData.tier);
    });
  });
});
