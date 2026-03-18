// NEXUS Alert — Cloudflare Worker Backend
// Server-side monitoring with email notifications via Resend

import Stripe from 'stripe';

const API_BASE = 'https://ttp.cbp.dhs.gov/schedulerapi';
const SLOTS_URL = `${API_BASE}/slots`;

export default {
  // Handle HTTP requests (subscriber management API)
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Stripe-Signature',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Public endpoints (no auth required)
    if (url.pathname === '/api/unsubscribe' && request.method === 'GET') {
      return await handleSignedUnsubscribe(request, env);
    }
    if (url.pathname === '/api/checkout' && request.method === 'POST') {
      return await handleCheckout(request, env, corsHeaders);
    }
    if (url.pathname === '/api/webhook' && request.method === 'POST') {
      return await handleStripeWebhook(request, env, corsHeaders);
    }
    if (url.pathname === '/api/license' && request.method === 'GET') {
      return await handleGetLicense(request, env, corsHeaders);
    }

    // Auth check for all other endpoints
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${env.WEBHOOK_SECRET}`) {
      return json({ error: 'Unauthorized' }, 401, corsHeaders);
    }

    try {
      if (url.pathname === '/api/subscribe' && request.method === 'POST') {
        return await handleSubscribe(request, env, corsHeaders);
      }
      if (url.pathname === '/api/unsubscribe' && request.method === 'POST') {
        return await handleUnsubscribe(request, env, corsHeaders);
      }
      if (url.pathname === '/api/subscribers' && request.method === 'GET') {
        return await handleListSubscribers(env, corsHeaders);
      }
      if (url.pathname === '/api/check' && request.method === 'POST') {
        // Manual trigger
        await checkAllSubscribers(env);
        return json({ success: true, message: 'Check completed' }, 200, corsHeaders);
      }
      if (url.pathname === '/api/status' && request.method === 'GET') {
        return await handleStatus(env, corsHeaders);
      }
      return json({ error: 'Not found' }, 404, corsHeaders);
    } catch (err) {
      return json({ error: err.message }, 500, corsHeaders);
    }
  },

  // Handle cron triggers
  async scheduled(event, env, ctx) {
    ctx.waitUntil(checkAllSubscribers(env));
  },
};

// ─── Stripe Payment Integration ──────────────────────────────────────

async function handleCheckout(request, env, corsHeaders) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return json({ error: 'email is required' }, 400, corsHeaders);
    }

    // Initialize Stripe with fetch-based HTTP client (required for Cloudflare Workers)
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: 'https://nexus-alert.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://nexus-alert.com/pricing',
      metadata: {
        email: email,
      },
    });

    return json({ url: session.url }, 200, corsHeaders);
  } catch (err) {
    console.error('Checkout error:', err);
    return json({ error: err.message }, 500, corsHeaders);
  }
}

async function handleStripeWebhook(request, env, corsHeaders) {
  try {
    // Read raw body as text BEFORE any JSON parsing (required for signature verification)
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return json({ error: 'Missing stripe-signature header' }, 400, corsHeaders);
    }

    // Initialize Stripe
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Verify webhook signature
    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        rawBody,
        signature,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return json({ error: 'Invalid signature' }, 400, corsHeaders);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const email = session.metadata.email;

        if (email) {
          // Store license record in KV
          const licenseData = {
            status: 'premium',
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            activatedAt: new Date().toISOString(),
            tier: 'premium',
          };

          await env.NEXUS_ALERTS_KV.put(`license:${email}`, JSON.stringify(licenseData));
          console.log(`Premium license activated for ${email}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;

        // Look up email via customer ID
        const customer = await stripe.customers.retrieve(subscription.customer);
        const email = customer.email;

        if (email) {
          // Downgrade to free tier
          const licenseData = {
            status: 'free',
            stripeCustomerId: subscription.customer,
            canceledAt: new Date().toISOString(),
            tier: 'free',
          };

          await env.NEXUS_ALERTS_KV.put(`license:${email}`, JSON.stringify(licenseData));
          console.log(`Subscription canceled for ${email}, downgraded to free`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return json({ received: true }, 200, corsHeaders);
  } catch (err) {
    console.error('Webhook error:', err);
    return json({ error: err.message }, 500, corsHeaders);
  }
}

async function handleGetLicense(request, env, corsHeaders) {
  try {
    const url = new URL(request.url);
    const email = decodeURIComponent(url.searchParams.get('email') || '');

    if (!email) {
      return json({ error: 'email parameter is required' }, 400, corsHeaders);
    }

    // Look up license in KV
    const licenseDataStr = await env.NEXUS_ALERTS_KV.get(`license:${email}`);
    const licenseData = licenseDataStr ? JSON.parse(licenseDataStr) : null;

    return json({
      tier: licenseData?.tier ?? 'free',
    }, 200, corsHeaders);
  } catch (err) {
    console.error('License lookup error:', err);
    return json({ error: err.message }, 500, corsHeaders);
  }
}

// ─── Subscriber Management ────────────────────────────────────────

async function handleSubscribe(request, env, corsHeaders) {
  const body = await request.json();
  const { email, locations, program, dateRange, timeRange, phone, tier } = body;

  if (!email || !locations?.length) {
    return json({ error: 'email and locations are required' }, 400, corsHeaders);
  }

  const subscriber = {
    email,
    locations,
    program: program || 'NEXUS',
    dateRange: dateRange || { start: null, end: null },
    timeRange: timeRange || { start: null, end: null },
    phone: phone || null, // E.164 format (e.g., +16045551234)
    tier: tier || 'free', // 'free' or 'premium'
    createdAt: new Date().toISOString(),
    notifiedSlots: {},
  };

  await env.NEXUS_ALERTS_KV.put(`sub:${email}`, JSON.stringify(subscriber));

  // Track subscriber list
  const list = JSON.parse(await env.NEXUS_ALERTS_KV.get('subscriber_list') || '[]');
  if (!list.includes(email)) {
    list.push(email);
    await env.NEXUS_ALERTS_KV.put('subscriber_list', JSON.stringify(list));
  }

  return json({ success: true, subscriber: { email, locations, program, tier } }, 200, corsHeaders);
}

async function handleUnsubscribe(request, env, corsHeaders) {
  const { email } = await request.json();
  if (!email) {
    return json({ error: 'email is required' }, 400, corsHeaders);
  }

  await env.NEXUS_ALERTS_KV.delete(`sub:${email}`);

  const list = JSON.parse(await env.NEXUS_ALERTS_KV.get('subscriber_list') || '[]');
  const filtered = list.filter(e => e !== email);
  await env.NEXUS_ALERTS_KV.put('subscriber_list', JSON.stringify(filtered));

  return json({ success: true }, 200, corsHeaders);
}

// Handle signed unsubscribe link (no auth required)
async function handleSignedUnsubscribe(request, env) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  const token = url.searchParams.get('token');

  if (!email || !token) {
    return new Response('<html><body><p>Invalid unsubscribe link.</p></body></html>', {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  // Verify HMAC signature
  const isValid = await verifyHmacToken(email, decodeURIComponent(token), env.WEBHOOK_SECRET);

  if (!isValid) {
    return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Delete subscriber
  await env.NEXUS_ALERTS_KV.delete(`sub:${email}`);

  const list = JSON.parse(await env.NEXUS_ALERTS_KV.get('subscriber_list') || '[]');
  const filtered = list.filter(e => e !== email);
  await env.NEXUS_ALERTS_KV.put('subscriber_list', JSON.stringify(filtered));

  return new Response('<html><body><p>You have been unsubscribed.</p></body></html>', {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}

async function handleListSubscribers(env, corsHeaders) {
  const list = JSON.parse(await env.NEXUS_ALERTS_KV.get('subscriber_list') || '[]');
  const subscribers = [];
  for (const email of list) {
    const data = await env.NEXUS_ALERTS_KV.get(`sub:${email}`);
    if (data) {
      const sub = JSON.parse(data);
      subscribers.push({ email: sub.email, locations: sub.locations, program: sub.program });
    }
  }
  return json({ subscribers }, 200, corsHeaders);
}

async function handleStatus(env, corsHeaders) {
  const lastRun = await env.NEXUS_ALERTS_KV.get('last_run');
  const totalChecks = parseInt(await env.NEXUS_ALERTS_KV.get('total_checks') || '0');
  const totalNotifications = parseInt(await env.NEXUS_ALERTS_KV.get('total_notifications') || '0');
  const list = JSON.parse(await env.NEXUS_ALERTS_KV.get('subscriber_list') || '[]');

  return json({
    status: 'running',
    lastRun,
    totalChecks,
    totalNotifications,
    subscriberCount: list.length,
  }, 200, corsHeaders);
}

// ─── Slot Checking ────────────────────────────────────────────────

async function checkAllSubscribers(env) {
  const list = JSON.parse(await env.NEXUS_ALERTS_KV.get('subscriber_list') || '[]');

  // Collect all unique locations across subscribers
  const locationSet = new Set();
  const subscribers = [];

  for (const email of list) {
    const data = await env.NEXUS_ALERTS_KV.get(`sub:${email}`);
    if (!data) continue;
    const sub = JSON.parse(data);
    subscribers.push(sub);
    sub.locations.forEach(l => locationSet.add(l));
  }

  // Fetch slots for all unique locations
  const slotsByLocation = {};
  for (const locationId of locationSet) {
    try {
      const slots = await fetchSlots(locationId);
      if (slots.length > 0) {
        slotsByLocation[locationId] = slots;
      }
    } catch (err) {
      console.error(`Error checking location ${locationId}:`, err);
    }
    // Rate limit
    await sleep(500);
  }

  // Match slots to subscribers and send notifications
  let totalNotifs = 0;
  for (const sub of subscribers) {
    const newSlots = [];

    for (const locId of sub.locations) {
      const slots = slotsByLocation[locId] || [];
      const filtered = filterSlots(slots, sub);

      for (const slot of filtered) {
        const key = `${locId}-${slot.startTimestamp}`;
        if (!sub.notifiedSlots[key]) {
          newSlots.push({ ...slot, locationId: locId });
          sub.notifiedSlots[key] = Date.now();
        }
      }
    }

    if (newSlots.length > 0) {
      await sendEmailNotification(sub.email, newSlots, env);
      totalNotifs++;

      // Send SMS for premium subscribers
      if (sub.phone && sub.tier === 'premium') {
        await sendSmsNotification(sub.email, sub.phone, newSlots, env);
      }

      // Clean old entries
      const cutoff = Date.now() - 24 * 60 * 60 * 1000;
      for (const [key, ts] of Object.entries(sub.notifiedSlots)) {
        if (ts < cutoff) delete sub.notifiedSlots[key];
      }

      await env.NEXUS_ALERTS_KV.put(`sub:${sub.email}`, JSON.stringify(sub));
    }
  }

  // Update stats
  const totalChecks = parseInt(await env.NEXUS_ALERTS_KV.get('total_checks') || '0') + 1;
  const totalNotifications = parseInt(await env.NEXUS_ALERTS_KV.get('total_notifications') || '0') + totalNotifs;
  await env.NEXUS_ALERTS_KV.put('last_run', new Date().toISOString());
  await env.NEXUS_ALERTS_KV.put('total_checks', String(totalChecks));
  await env.NEXUS_ALERTS_KV.put('total_notifications', String(totalNotifications));

  console.log(`[NEXUS Alert] Checked ${locationSet.size} locations, sent ${totalNotifs} notification(s)`);
}

async function fetchSlots(locationId) {
  const params = new URLSearchParams({
    orderBy: 'soonest',
    limit: '500',
    locationId: String(locationId),
    minimum: '1',
  });

  const resp = await fetch(`${SLOTS_URL}?${params}`);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

function filterSlots(slots, sub) {
  let filtered = slots;

  if (sub.dateRange?.start) {
    filtered = filtered.filter(s => s.startTimestamp >= sub.dateRange.start);
  }
  if (sub.dateRange?.end) {
    filtered = filtered.filter(s => s.startTimestamp <= sub.dateRange.end);
  }
  if (sub.timeRange?.start || sub.timeRange?.end) {
    filtered = filtered.filter(s => {
      const time = s.startTimestamp.split('T')[1];
      if (sub.timeRange.start && time < sub.timeRange.start) return false;
      if (sub.timeRange.end && time > sub.timeRange.end) return false;
      return true;
    });
  }

  return filtered;
}

// ─── Email Notifications ──────────────────────────────────────────

async function sendEmailNotification(email, slots, env) {
  const slotRows = slots.map(slot => {
    const date = new Date(slot.startTimestamp);
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
    return `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee">${dateStr}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee">${timeStr}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee">Location ${slot.locationId}</td>
    </tr>`;
  }).join('');

  // Generate signed unsubscribe URL
  const unsubscribeToken = await generateHmacToken(email, env.WEBHOOK_SECRET);
  const unsubscribeUrl = `https://api.nexus-alert.com/api/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(unsubscribeToken)}`;

  const html = `
    <div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#1e3a5f;color:white;padding:20px;border-radius:8px 8px 0 0">
        <h1 style="margin:0;font-size:20px">NEXUS Alert — Slots Available!</h1>
      </div>
      <div style="background:#f9f9f9;padding:20px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px">
        <p>New appointment slots have been found:</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead>
            <tr style="background:#e8e8e8">
              <th style="padding:8px 12px;text-align:left">Date</th>
              <th style="padding:8px 12px;text-align:left">Time</th>
              <th style="padding:8px 12px;text-align:left">Location</th>
            </tr>
          </thead>
          <tbody>${slotRows}</tbody>
        </table>
        <a href="https://ttp.cbp.dhs.gov/" style="display:inline-block;background:#22c55e;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin-top:12px">
          Book Now on GOES
        </a>
        <p style="color:#888;font-size:12px;margin-top:20px">
          Slots disappear quickly — book as soon as possible!<br>
          <a href="${unsubscribeUrl}">Unsubscribe</a>
        </p>
      </div>
    </div>
  `;

  // Send via Resend API
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'NEXUS Alert <notifications@nexus-alert.com>',
      to: [email],
      subject: `NEXUS Alert: ${slots.length} New Slot${slots.length > 1 ? 's' : ''} Available!`,
      html,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    console.error(`Failed to send email to ${email}:`, err);
  }
}

// ─── SMS Notifications ────────────────────────────────────────────

async function sendSmsNotification(email, phone, slots, env) {
  // Only send SMS if Twilio is configured
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_FROM_NUMBER) {
    console.log(`Skipping SMS for ${email}: Twilio not configured`);
    return;
  }

  const locationName = slots[0]?.locationId ? `Location ${slots[0].locationId}` : 'your selected location';
  const message = `NEXUS Alert: ${slots.length} slot(s) found at ${locationName}. Book now: https://ttp.cbp.dhs.gov`;

  const params = new URLSearchParams({
    From: env.TWILIO_FROM_NUMBER,
    To: phone,
    Body: message,
  });

  try {
    const resp = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    if (!resp.ok) {
      const error = await resp.text();
      console.error(`Failed to send SMS to ${phone}:`, error);
      // Don't throw - let email delivery continue
    } else {
      console.log(`SMS sent to ${phone} for ${email}`);
    }
  } catch (err) {
    console.error(`Error sending SMS to ${phone}:`, err.message);
    // Don't throw - let email delivery continue
  }
}

// ─── HMAC Signing for Unsubscribe Links ──────────────────────────

async function generateHmacToken(email, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(email));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

async function verifyHmacToken(email, token, secret) {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Decode the base64 token
    const signature = Uint8Array.from(atob(token), c => c.charCodeAt(0));

    // Verify using constant-time comparison
    return await crypto.subtle.verify('HMAC', key, signature, encoder.encode(email));
  } catch (err) {
    console.error('Token verification error:', err);
    return false;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
