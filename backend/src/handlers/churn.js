// Churn Handler for NEXUS Alert
// Handles subscription cancellations with win-back campaigns

import { tagSubscriber, addToSequence } from '../convertkit.js';
import { sendEmail } from '../email-templates/index.js';

/**
 * Handle customer churn (subscription cancellation)
 * Triggers exit survey + win-back drip campaign
 *
 * @param {string} email - Customer email
 * @param {object} env - Cloudflare environment
 */
export async function handleChurn(email, env) {
  try {
    console.log(`[Churn Handler] Processing churn for ${email}`);

    // 1. Tag subscriber as churned in ConvertKit
    if (env.CONVERTKIT_TAG_CHURNED && env.CONVERTKIT_API_KEY) {
      await tagSubscriber(email, env.CONVERTKIT_TAG_CHURNED, env.CONVERTKIT_API_KEY);
      console.log(`[Churn Handler] Tagged ${email} as churned in ConvertKit`);
    }

    // 2. Store churn event in KV with timestamp for win-back timing
    const churnData = {
      email,
      churned_at: Date.now(),
      reason: null, // Will be populated from exit survey
      survey_sent: false,
      winback_sequence_added: false,
    };
    await env.NEXUS_ALERTS_KV.put(`churn:${email}`, JSON.stringify(churnData));
    console.log(`[Churn Handler] Stored churn event for ${email}`);

    // 3. Send immediate exit survey email via Resend
    const surveyLink = `https://nexus-alert.com/exit-survey?email=${encodeURIComponent(email)}`;
    const emailSent = await sendEmail('exit_survey', email, env, {
      email,
      survey_link: surveyLink,
    });

    if (emailSent) {
      // Update churn data to mark survey as sent
      churnData.survey_sent = true;
      await env.NEXUS_ALERTS_KV.put(`churn:${email}`, JSON.stringify(churnData));
      console.log(`[Churn Handler] Exit survey email sent to ${email}`);
    }

    // 4. Schedule win-back emails (Day 7, Day 30) via ConvertKit sequence
    if (env.CONVERTKIT_WINBACK_SEQUENCE_ID && env.CONVERTKIT_API_KEY) {
      const sequenceAdded = await addToSequence(
        email,
        env.CONVERTKIT_WINBACK_SEQUENCE_ID,
        env.CONVERTKIT_API_KEY
      );

      if (sequenceAdded) {
        churnData.winback_sequence_added = true;
        await env.NEXUS_ALERTS_KV.put(`churn:${email}`, JSON.stringify(churnData));
        console.log(`[Churn Handler] Added ${email} to win-back sequence`);
      }
    }

    console.log(`[Churn Handler] Successfully processed churn for ${email}`);
    return true;
  } catch (err) {
    console.error(`[Churn Handler] Error handling churn for ${email}:`, err);
    return false;
  }
}

/**
 * Store exit survey response
 *
 * @param {string} email - Customer email
 * @param {string} reason - Cancellation reason
 * @param {string} feedback - Optional additional feedback
 * @param {object} env - Cloudflare environment
 */
export async function storeExitSurveyResponse(email, reason, feedback, env) {
  try {
    // Get existing churn data
    const churnDataStr = await env.NEXUS_ALERTS_KV.get(`churn:${email}`);
    if (!churnDataStr) {
      console.error(`[Exit Survey] No churn data found for ${email}`);
      return false;
    }

    const churnData = JSON.parse(churnDataStr);
    churnData.reason = reason;
    churnData.feedback = feedback || null;
    churnData.survey_completed_at = Date.now();

    // Store updated churn data
    await env.NEXUS_ALERTS_KV.put(`churn:${email}`, JSON.stringify(churnData));
    console.log(`[Exit Survey] Stored response for ${email}: ${reason}`);

    // Track in analytics for reporting
    await trackChurnReason(reason, env);

    return true;
  } catch (err) {
    console.error(`[Exit Survey] Error storing response for ${email}:`, err);
    return false;
  }
}

/**
 * Track churn reasons for analytics
 * Aggregates cancellation reasons to identify patterns
 */
async function trackChurnReason(reason, env) {
  try {
    const key = 'churn_reasons_aggregate';
    const dataStr = await env.NEXUS_ALERTS_KV.get(key);
    const data = dataStr ? JSON.parse(dataStr) : {};

    data[reason] = (data[reason] || 0) + 1;
    data.last_updated = new Date().toISOString();

    await env.NEXUS_ALERTS_KV.put(key, JSON.stringify(data));
  } catch (err) {
    console.error('[Churn Analytics] Error tracking reason:', err);
  }
}
