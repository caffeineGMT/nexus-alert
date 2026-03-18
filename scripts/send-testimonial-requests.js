#!/usr/bin/env node

/**
 * Testimonial Request Email Sender
 *
 * Sends personalized testimonial request emails to users
 * Uses Resend API for email delivery
 *
 * Usage:
 *   node scripts/send-testimonial-requests.js --email user@example.com --name "John Doe"
 *   node scripts/send-testimonial-requests.js --batch recipients.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'Michael from NEXUS Alert <hello@nexus-alert.com>';
const TEMPLATE_PATH = path.join(__dirname, '../backend/src/email-templates/testimonial-request.html');

// Parse command line arguments
const args = process.argv.slice(2);
const flags = {};
for (let i = 0; i < args.length; i += 2) {
  const key = args[i].replace('--', '');
  const value = args[i + 1];
  flags[key] = value;
}

/**
 * Send single testimonial request email
 */
async function sendTestimonialRequest(email, name) {
  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY environment variable not set');
    console.log('Set it with: export RESEND_API_KEY=re_xxx');
    process.exit(1);
  }

  // Read template
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

  // Replace placeholders
  const firstName = name.split(' ')[0];
  const personalizedTemplate = template
    .replace(/{{firstName}}/g, firstName)
    .replace(/{{email}}/g, email)
    .replace(/{{unsubscribe_url}}/g, `https://nexus-alert.com/unsubscribe?email=${encodeURIComponent(email)}`);

  // Send via Resend API
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: 'Share your NEXUS Alert story and get 6 months Premium free 🎁',
        html: personalizedTemplate,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`✅ Sent to ${name} (${email})`);
      console.log(`   Email ID: ${data.id}`);
      return { success: true, emailId: data.id };
    } else {
      console.error(`❌ Failed to send to ${email}:`, data);
      return { success: false, error: data };
    }
  } catch (error) {
    console.error(`❌ Error sending to ${email}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Send batch testimonial requests from JSON file
 */
async function sendBatchRequests(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const recipients = data.recipients || data;

    console.log(`📧 Sending testimonial requests to ${recipients.length} recipients...\n`);

    const results = [];
    for (const recipient of recipients) {
      const result = await sendTestimonialRequest(recipient.email, recipient.name);
      results.push({ ...recipient, ...result });

      // Wait 1 second between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Save results
    const resultsPath = filePath.replace('.json', '-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

    console.log(`\n📊 Results saved to ${resultsPath}`);
    console.log(`✅ Sent: ${results.filter(r => r.success).length}`);
    console.log(`❌ Failed: ${results.filter(r => !r.success).length}`);

  } catch (error) {
    console.error('❌ Error reading batch file:', error);
    process.exit(1);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 NEXUS Alert Testimonial Request Sender\n');

  if (flags.batch) {
    // Batch mode
    await sendBatchRequests(flags.batch);
  } else if (flags.email && flags.name) {
    // Single email mode
    await sendTestimonialRequest(flags.email, flags.name);
  } else {
    // Show usage
    console.log('Usage:');
    console.log('  Single email:');
    console.log('    node send-testimonial-requests.js --email user@example.com --name "John Doe"');
    console.log('');
    console.log('  Batch emails:');
    console.log('    node send-testimonial-requests.js --batch recipients.json');
    console.log('');
    console.log('Batch JSON format:');
    console.log(JSON.stringify({
      recipients: [
        { email: 'user1@example.com', name: 'John Doe' },
        { email: 'user2@example.com', name: 'Jane Smith' }
      ]
    }, null, 2));
    process.exit(1);
  }
}

main();
