#!/usr/bin/env node

/**
 * Testimonial Collection Script
 *
 * This script identifies users who found slots within the last 7 days
 * and sends them an email offering a free month of Premium in exchange
 * for a video testimonial.
 *
 * Usage:
 *   node scripts/collect-testimonials.js
 *
 * Environment variables required:
 *   - CLOUDFLARE_ACCOUNT_ID
 *   - CLOUDFLARE_API_TOKEN
 *   - RESEND_API_KEY
 */

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const KV_NAMESPACE_ID = process.env.KV_NAMESPACE_ID;

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

async function fetchKVKeys(prefix) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE_ID}/keys?prefix=${prefix}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch KV keys: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result || [];
}

async function getKVValue(key) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE_ID}/values/${key}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

async function sendTestimonialRequest(userEmail, userName, slotDetails) {
  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6 0%, #22c55e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .cta-button { display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .offer-box { background: #fff; border: 2px solid #22c55e; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; color: #888; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 You Found Your Slot!</h1>
    </div>
    <div class="content">
      <p>Hi ${userName || 'there'},</p>

      <p><strong>Congratulations!</strong> Our records show you successfully found a ${slotDetails.program || 'NEXUS/Global Entry'} appointment slot using NEXUS Alert. We're thrilled we could help!</p>

      <p>We're building a collection of success stories to help other travelers discover NEXUS Alert, and we'd love to feature yours.</p>

      <div class="offer-box">
        <h3 style="margin-top: 0; color: #22c55e;">📹 Share Your Story = 3 Months Premium FREE</h3>
        <p>If you're willing to record a quick 30-60 second video testimonial sharing:</p>
        <ul>
          <li>How long you were searching before using NEXUS Alert</li>
          <li>How quickly you found your slot after installing</li>
          <li>Why you'd recommend it to other travelers</li>
        </ul>
        <p><strong>We'll give you 3 months of Premium access absolutely free</strong> (worth $14.97).</p>
      </div>

      <p>If you're camera-shy, we'd also love a written testimonial! Just reply to this email with 2-3 sentences about your experience, and we'll send you <strong>1 month free</strong>.</p>

      <center>
        <a href="mailto:hello@nexus-alert.com?subject=Video Testimonial - ${encodeURIComponent(userName || userEmail)}" class="cta-button">
          I'm Interested in Sharing My Story
        </a>
      </center>

      <p>Either way, thanks for being part of the NEXUS Alert community. We're genuinely happy you got your appointment!</p>

      <p>Best regards,<br>
      The NEXUS Alert Team</p>

      <div class="footer">
        <p>Not interested? No worries — you won't hear from us again about this.</p>
        <p>NEXUS Alert · <a href="https://nexus-alert.com">nexus-alert.com</a></p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'NEXUS Alert <hello@nexus-alert.com>',
      to: [userEmail],
      subject: '🎉 You found your slot! Share your story?',
      html: emailHtml,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }

  return response.json();
}

async function main() {
  console.log('🔍 Finding users who found slots in the last 7 days...\n');

  // Fetch all activity events
  const activityKeys = await fetchKVKeys('activity:');
  console.log(`Found ${activityKeys.length} activity events\n`);

  const recentSuccesses = [];
  const now = Date.now();

  for (const key of activityKeys) {
    const activity = await getKVValue(key.name);

    if (!activity) continue;

    // Check if it's a slot_found event within the last 7 days
    if (
      activity.type === 'slot_found' &&
      activity.timestamp &&
      (now - activity.timestamp) <= SEVEN_DAYS_MS
    ) {
      recentSuccesses.push({
        email: activity.email || `${activity.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        name: activity.name,
        location: activity.location,
        timestamp: activity.timestamp,
        daysAgo: Math.floor((now - activity.timestamp) / (24 * 60 * 60 * 1000)),
      });
    }
  }

  console.log(`✅ Found ${recentSuccesses.length} users who found slots in the last 7 days:\n`);

  if (recentSuccesses.length === 0) {
    console.log('No recent successes to contact. Try again later!');
    return;
  }

  // Sort by most recent first
  recentSuccesses.sort((a, b) => b.timestamp - a.timestamp);

  // Display candidates
  recentSuccesses.forEach((user, idx) => {
    console.log(`${idx + 1}. ${user.name} (${user.email})`);
    console.log(`   Location: ${user.location}`);
    console.log(`   Found slot: ${user.daysAgo} days ago\n`);
  });

  // Send emails (with confirmation)
  console.log('📧 Ready to send testimonial requests?\n');
  console.log('Set DRY_RUN=false to actually send emails.\n');

  const DRY_RUN = process.env.DRY_RUN !== 'false';

  if (DRY_RUN) {
    console.log('🔸 DRY RUN MODE - No emails will be sent');
    console.log('   Run with DRY_RUN=false to send for real\n');
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const user of recentSuccesses) {
    try {
      console.log(`Sending to ${user.name} (${user.email})...`);
      await sendTestimonialRequest(user.email, user.name, {
        program: 'NEXUS/Global Entry',
        location: user.location,
      });
      successCount++;
      console.log('  ✅ Sent\n');
    } catch (err) {
      errorCount++;
      console.error(`  ❌ Failed: ${err.message}\n`);
    }
  }

  console.log(`\n📊 Results:`);
  console.log(`   ✅ Sent: ${successCount}`);
  console.log(`   ❌ Failed: ${errorCount}`);
  console.log(`\nDone!`);
}

// Validate environment variables
if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN || !RESEND_API_KEY || !KV_NAMESPACE_ID) {
  console.error('❌ Missing required environment variables:');
  console.error('   - CLOUDFLARE_ACCOUNT_ID');
  console.error('   - CLOUDFLARE_API_TOKEN');
  console.error('   - RESEND_API_KEY');
  console.error('   - KV_NAMESPACE_ID');
  console.error('\nSet these in your environment or .env file.');
  process.exit(1);
}

main().catch(console.error);
