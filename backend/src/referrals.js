// Referral System for NEXUS Alert
// Handles referral code generation, tracking, and rewards

import { Resend } from 'resend';

// Generate a unique referral code from email
export function generateReferralCode(email) {
  // Create a deterministic 8-character code from email
  const hash = hashString(email);
  const code = hash.toString(36).substring(0, 8).toUpperCase();
  return code;
}

// Simple string hash function
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Initialize referral record for a new user
export async function initReferral(email, env) {
  const code = generateReferralCode(email);

  const referralData = {
    email,
    code,
    referrals: [], // Array of {email, convertedAt, subscriptionId}
    totalReferrals: 0,
    successfulReferrals: 0, // Paid subscribers
    freeMonthsEarned: 0,
    createdAt: Date.now(),
  };

  await env.NEXUS_ALERTS_KV.put(`referral:${email}`, JSON.stringify(referralData));

  // Also index by code for lookups
  await env.NEXUS_ALERTS_KV.put(`referral_code:${code}`, email);

  return referralData;
}

// Track a referral click (someone visited with ref param)
export async function trackReferralClick(referralCode, referredEmail, env) {
  try {
    // Look up referrer by code
    const referrerEmail = await env.NEXUS_ALERTS_KV.get(`referral_code:${referralCode}`);
    if (!referrerEmail) {
      console.log(`Referral code ${referralCode} not found`);
      return null;
    }

    // Store pending referral
    await env.NEXUS_ALERTS_KV.put(
      `pending_referral:${referredEmail}`,
      JSON.stringify({ referrerEmail, referralCode, clickedAt: Date.now() })
    );

    // Track click count for analytics
    const clickKey = `referral_clicks:${referralCode}`;
    const clicks = parseInt(await env.NEXUS_ALERTS_KV.get(clickKey) || '0');
    await env.NEXUS_ALERTS_KV.put(clickKey, String(clicks + 1));

    return { referrerEmail, referralCode };
  } catch (err) {
    console.error('Error tracking referral click:', err);
    return null;
  }
}

// Handle successful referral conversion (payment completed)
export async function handleReferralConversion(referralCode, referredEmail, subscriptionId, env) {
  try {
    // Look up referrer by code
    const referrerEmail = await env.NEXUS_ALERTS_KV.get(`referral_code:${referralCode}`);
    if (!referrerEmail) {
      console.log(`Referral code ${referralCode} not found`);
      return;
    }

    // Get referrer's referral data
    const referralDataStr = await env.NEXUS_ALERTS_KV.get(`referral:${referrerEmail}`);
    let referralData = referralDataStr ? JSON.parse(referralDataStr) : await initReferral(referrerEmail, env);

    // Check for duplicates
    const alreadyReferred = referralData.referrals.some(r => r.email === referredEmail);
    if (alreadyReferred) {
      console.log(`${referredEmail} already referred by ${referrerEmail}`);
      return;
    }

    // Add referral
    referralData.referrals.push({
      email: referredEmail,
      convertedAt: Date.now(),
      subscriptionId,
    });
    referralData.totalReferrals = referralData.referrals.length;
    referralData.successfulReferrals++;
    referralData.freeMonthsEarned++;

    // Save updated referral data
    await env.NEXUS_ALERTS_KV.put(`referral:${referrerEmail}`, JSON.stringify(referralData));

    // Credit the referrer with 1 free month
    await creditFreeMonth(referrerEmail, env);

    // Clean up pending referral
    await env.NEXUS_ALERTS_KV.delete(`pending_referral:${referredEmail}`);

    // Send thank you email to referrer
    await sendReferralRewardEmail(referrerEmail, referredEmail, referralData.freeMonthsEarned, env);

    // Track conversion for analytics
    await trackActivity('referral_conversion', {
      referrer: referrerEmail,
      referred: referredEmail,
      code: referralCode,
    }, env);

    console.log(`Referral conversion: ${referredEmail} → ${referrerEmail} (${referralData.freeMonthsEarned} free months earned)`);
  } catch (err) {
    console.error('Error handling referral conversion:', err);
  }
}

// Credit a user with 1 free month
async function creditFreeMonth(email, env) {
  const creditKey = `free_months:${email}`;
  const currentCredits = parseInt(await env.NEXUS_ALERTS_KV.get(creditKey) || '0');
  await env.NEXUS_ALERTS_KV.put(creditKey, String(currentCredits + 1));

  console.log(`Credited ${email} with 1 free month (total: ${currentCredits + 1})`);
}

// Get referral stats for a user
export async function getReferralStats(email, env) {
  const referralDataStr = await env.NEXUS_ALERTS_KV.get(`referral:${email}`);

  if (!referralDataStr) {
    // Initialize if doesn't exist
    return await initReferral(email, env);
  }

  const referralData = JSON.parse(referralDataStr);
  const code = referralData.code || generateReferralCode(email);
  const clicks = parseInt(await env.NEXUS_ALERTS_KV.get(`referral_clicks:${code}`) || '0');
  const freeMonths = parseInt(await env.NEXUS_ALERTS_KV.get(`free_months:${email}`) || '0');

  return {
    ...referralData,
    code,
    clicks,
    freeMonthsEarned: freeMonths,
    conversionRate: clicks > 0 ? ((referralData.successfulReferrals / clicks) * 100).toFixed(1) : 0,
  };
}

// Send referral reward email
async function sendReferralRewardEmail(referrerEmail, referredEmail, totalFreeMonths, env) {
  try {
    const resend = new Resend(env.RESEND_API_KEY);

    const referralCode = generateReferralCode(referrerEmail);
    const shareUrl = `https://nexus-alert.com?ref=${referralCode}`;

    await resend.emails.send({
      from: 'NEXUS Alert <alerts@nexus-alert.com>',
      to: referrerEmail,
      subject: '🎉 You earned 1 free month of NEXUS Alert Premium!',
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #22c55e;">Thank you for spreading the word! 🎉</h1>

          <p>Great news! Your friend <strong>${referredEmail}</strong> just signed up for NEXUS Alert Premium using your referral link.</p>

          <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; font-size: 18px; font-weight: bold;">You've earned 1 free month! 🎁</p>
            <p style="margin: 8px 0 0 0; color: #666;">Total free months earned: ${totalFreeMonths}</p>
          </div>

          <p>Want to earn more free months? Keep sharing!</p>

          <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p style="font-weight: bold; margin: 0 0 12px 0;">Your referral link:</p>
            <a href="${shareUrl}" style="color: #3b82f6; word-break: break-all;">${shareUrl}</a>

            <div style="margin-top: 20px; display: flex; gap: 12px;">
              <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(`I found my NEXUS appointment in 3 days with @NexusAlert 🎉 ${shareUrl}`)}"
                 style="display: inline-block; padding: 10px 20px; background: #1da1f2; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Share on Twitter
              </a>
            </div>
          </div>

          <p style="color: #666; font-size: 14px;">
            For every friend who becomes a Premium subscriber, you get another free month. There's no limit!
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />

          <p style="color: #999; font-size: 12px;">
            NEXUS Alert - Never miss an appointment opening<br />
            <a href="https://nexus-alert.com/unsubscribe?email=${encodeURIComponent(referrerEmail)}" style="color: #999;">Unsubscribe</a>
          </p>
        </div>
      `,
    });

    console.log(`Sent referral reward email to ${referrerEmail}`);
  } catch (err) {
    console.error('Error sending referral reward email:', err);
  }
}

// Track activity for social proof
async function trackActivity(type, data, env) {
  try {
    const activity = {
      type,
      data,
      timestamp: Date.now(),
    };

    // Get recent activity log
    const activityLogStr = await env.NEXUS_ALERTS_KV.get('activity_log');
    const activityLog = activityLogStr ? JSON.parse(activityLogStr) : [];

    // Add new activity
    activityLog.unshift(activity);

    // Keep only last 100 activities
    const trimmed = activityLog.slice(0, 100);

    await env.NEXUS_ALERTS_KV.put('activity_log', JSON.stringify(trimmed));
  } catch (err) {
    console.error('Error tracking activity:', err);
  }
}

// Calculate viral coefficient (K-factor)
export async function calculateViralCoefficient(env) {
  try {
    // Get all referral records
    const list = await env.NEXUS_ALERTS_KV.list({ prefix: 'referral:' });

    let totalUsers = 0;
    let totalReferrals = 0;
    let totalSuccessfulReferrals = 0;

    for (const key of list.keys) {
      const referralDataStr = await env.NEXUS_ALERTS_KV.get(key.name);
      if (referralDataStr) {
        const referralData = JSON.parse(referralDataStr);
        totalUsers++;
        totalReferrals += referralData.totalReferrals || 0;
        totalSuccessfulReferrals += referralData.successfulReferrals || 0;
      }
    }

    const kFactor = totalUsers > 0 ? totalSuccessfulReferrals / totalUsers : 0;
    const referralRate = totalUsers > 0 ? (totalSuccessfulReferrals / totalUsers) * 100 : 0;

    return {
      totalUsers,
      totalReferrals,
      totalSuccessfulReferrals,
      kFactor: kFactor.toFixed(2),
      referralRate: referralRate.toFixed(1),
      target: 0.4, // Target K-factor
      onTrack: kFactor >= 0.4,
    };
  } catch (err) {
    console.error('Error calculating viral coefficient:', err);
    return null;
  }
}
