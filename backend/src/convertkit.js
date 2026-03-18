// ConvertKit API Integration for NEXUS Alert
// Handles email list management and automation sequences

const CONVERTKIT_API_BASE = 'https://api.convertkit.com/v3';

/**
 * Add subscriber to ConvertKit form and tag them
 * @param {string} email - Subscriber email
 * @param {object} fields - Custom fields (program, locations, etc.)
 * @param {string} apiKey - ConvertKit API key
 * @param {string} apiSecret - ConvertKit API secret
 * @param {string} formId - ConvertKit form ID for the main list
 * @returns {Promise<object>} ConvertKit subscriber object
 */
export async function addSubscriber(email, fields, apiKey, apiSecret, formId) {
  try {
    // Add to form (triggers automation sequence)
    const formResponse = await fetch(`${CONVERTKIT_API_BASE}/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        email,
        fields: {
          program: fields.program || 'NEXUS',
          locations: JSON.stringify(fields.locations || []),
          tier: fields.tier || 'free',
          signup_date: new Date().toISOString(),
        },
        tags: [fields.tier === 'premium' ? 'premium' : 'free'],
      }),
    });

    if (!formResponse.ok) {
      const error = await formResponse.text();
      console.error('ConvertKit form subscribe failed:', error);
      throw new Error(`ConvertKit API error: ${error}`);
    }

    const data = await formResponse.json();
    console.log(`Added ${email} to ConvertKit form ${formId}`);
    return data.subscription;
  } catch (err) {
    console.error('Error adding subscriber to ConvertKit:', err);
    throw err;
  }
}

/**
 * Tag a subscriber (for segmentation and automation triggers)
 * @param {string} email - Subscriber email
 * @param {string} tagId - ConvertKit tag ID
 * @param {string} apiKey - ConvertKit API key
 */
export async function tagSubscriber(email, tagId, apiKey) {
  try {
    const response = await fetch(`${CONVERTKIT_API_BASE}/tags/${tagId}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        email,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('ConvertKit tag failed:', error);
      return false;
    }

    console.log(`Tagged ${email} with tag ${tagId}`);
    return true;
  } catch (err) {
    console.error('Error tagging subscriber:', err);
    return false;
  }
}

/**
 * Remove subscriber from ConvertKit
 * @param {string} email - Subscriber email
 * @param {string} apiSecret - ConvertKit API secret
 */
export async function unsubscribe(email, apiSecret) {
  try {
    const response = await fetch(`${CONVERTKIT_API_BASE}/unsubscribe`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_secret: apiSecret,
        email,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('ConvertKit unsubscribe failed:', error);
      return false;
    }

    console.log(`Unsubscribed ${email} from ConvertKit`);
    return true;
  } catch (err) {
    console.error('Error unsubscribing from ConvertKit:', err);
    return false;
  }
}

/**
 * Get subscriber details from ConvertKit
 * @param {string} subscriberId - ConvertKit subscriber ID
 * @param {string} apiSecret - ConvertKit API secret
 */
export async function getSubscriber(subscriberId, apiSecret) {
  try {
    const response = await fetch(
      `${CONVERTKIT_API_BASE}/subscribers/${subscriberId}?api_secret=${apiSecret}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.subscriber;
  } catch (err) {
    console.error('Error fetching subscriber:', err);
    return null;
  }
}

/**
 * Add subscriber to a specific sequence (drip campaign)
 * @param {string} email - Subscriber email
 * @param {string} sequenceId - ConvertKit sequence ID
 * @param {string} apiKey - ConvertKit API key
 */
export async function addToSequence(email, sequenceId, apiKey) {
  try {
    const response = await fetch(`${CONVERTKIT_API_BASE}/sequences/${sequenceId}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        email,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('ConvertKit sequence subscribe failed:', error);
      return false;
    }

    console.log(`Added ${email} to sequence ${sequenceId}`);
    return true;
  } catch (err) {
    console.error('Error adding to sequence:', err);
    return false;
  }
}

/**
 * Handle ConvertKit webhook events
 * @param {object} event - Webhook event payload
 * @param {object} env - Cloudflare environment
 */
export async function handleWebhookEvent(event, env) {
  const { subscriber, type } = event;

  switch (type) {
    case 'subscriber.subscriber_activate':
      console.log(`Subscriber activated: ${subscriber.email_address}`);
      // Track in KV
      await env.NEXUS_ALERTS_KV.put(
        `ck:${subscriber.email_address}`,
        JSON.stringify({
          subscriberId: subscriber.id,
          state: subscriber.state,
          createdAt: subscriber.created_at,
        })
      );
      break;

    case 'subscriber.subscriber_unsubscribe':
      console.log(`Subscriber unsubscribed: ${subscriber.email_address}`);
      // Update KV state
      await env.NEXUS_ALERTS_KV.delete(`ck:${subscriber.email_address}`);
      break;

    case 'subscriber.subscriber_bounce':
      console.log(`Email bounced: ${subscriber.email_address}`);
      // Mark as bounced in KV
      const sub = await env.NEXUS_ALERTS_KV.get(`sub:${subscriber.email_address}`);
      if (sub) {
        const data = JSON.parse(sub);
        data.email_bounced = true;
        await env.NEXUS_ALERTS_KV.put(`sub:${subscriber.email_address}`, JSON.stringify(data));
      }
      break;

    case 'subscriber.subscriber_complain':
      console.log(`Spam complaint: ${subscriber.email_address}`);
      // Auto-unsubscribe from our system
      await env.NEXUS_ALERTS_KV.delete(`sub:${subscriber.email_address}`);
      const list = JSON.parse(await env.NEXUS_ALERTS_KV.get('subscriber_list') || '[]');
      const filtered = list.filter(e => e !== subscriber.email_address);
      await env.NEXUS_ALERTS_KV.put('subscriber_list', JSON.stringify(filtered));
      break;
  }
}
