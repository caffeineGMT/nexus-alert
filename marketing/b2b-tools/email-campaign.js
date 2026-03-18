#!/usr/bin/env node

/**
 * B2B Cold Email Campaign Automation
 *
 * Sends 3-email drip sequence to immigration lawyers:
 * - Email 1: Initial outreach (value proposition)
 * - Email 2: Follow-up with cost comparison (Day 3)
 * - Email 3: Case study + final CTA (Day 7)
 *
 * Uses Resend API for sending
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'hello@nexus-alert.com';
const SENDER_NAME = process.env.SENDER_NAME || 'NEXUS Alert Team';

// Email templates
const EMAIL_TEMPLATES = {
  email1: {
    subject: (name) => 'Save 10 hours/week managing NEXUS appointments',
    body: (lead) => {
      const firstName = lead.name.split(' ')[0];
      const firmName = lead.firmName || lead.name;
      const city = lead.city || lead.location || 'your area';

      return `Hi ${firstName},

I noticed ${firmName} handles immigration cases in ${city}. Quick question: are you currently managing NEXUS or Global Entry appointments for your clients?

If so, you're probably spending 10+ hours/week manually checking ttp.cbp.dhs.gov for cancellations across all your clients.

We built NEXUS Alert Pro specifically for immigration lawyers:
• Monitor up to 20 clients simultaneously in one dashboard
• White-label email notifications (branded with your firm name, not ours)
• 2-minute slot checking (vs 30-minute free tier)
• $99/month flat rate

For a typical firm with 10+ NEXUS clients, that's 10 hours/week saved and faster appointment bookings for your clients.

Would you be open to a 60-day free trial? No credit card required.

Start trial: https://nexus-alert.com/pro

Best,
Michael
NEXUS Alert

P.S. Vancouver immigration attorney Sarah Chen says it saves her "10 hours/week" — clients think the monitoring is provided by her firm directly.`;
    }
  },

  email2: {
    subject: (name) => 'Re: Save 10 hours/week managing NEXUS appointments',
    body: (lead) => {
      const firstName = lead.name.split(' ')[0];

      return `Hi ${firstName},

Just following up on my email from a few days ago about NEXUS Alert Pro.

I know your inbox is busy, so I'll keep this short:

**The problem:** You're manually checking GOES for each client, refreshing over and over hoping to catch cancellations.

**The solution:** We monitor all your clients 24/7 and send white-label email notifications the instant slots open.

**The math:**
• 10 clients × $4.99/mo (individual plans) = $49.90/mo
• NEXUS Alert Pro (20 clients max) = $99/mo flat
• ROI: Save 10+ hours/week (worth $500-1000 in billable time)

Try it free for 60 days: https://nexus-alert.com/pro

Happy to answer any questions you have.

Best,
Michael`;
    }
  },

  email3: {
    subject: (name) => 'How Sarah Chen (Vancouver immigration attorney) saves 10 hrs/week',
    body: (lead) => {
      const firstName = lead.name.split(' ')[0];

      return `Hi ${firstName},

One last email from me — wanted to share how Sarah Chen uses NEXUS Alert Pro in her practice:

**Before:** Manually checked GOES for 30+ clients, missed most cancellations, frustrated clients waiting 6+ months

**After:** Dashboard monitors all 30 clients simultaneously, catches slots within 2 minutes, clients get interviews 2-3 months sooner

**Her feedback:** "The white-label emails make it seamless — clients think we're running the monitoring ourselves."

**Her time savings:** 10 hours/week (now spent on billable work instead of refreshing websites)

If you're managing 5+ NEXUS clients, this could be the highest ROI tool you add this year.

60-day free trial (no credit card): https://nexus-alert.com/pro

Best,
Michael

P.S. API access included if you want to integrate with Clio/MyCase.`;
    }
  }
};

async function sendEmail(to, subject, body) {
  if (!RESEND_API_KEY) {
    console.log(`   ⚠️  RESEND_API_KEY not set, email not sent (would send to: ${to})`);
    return { success: false, skipped: true };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
        to: [to],
        subject,
        text: body,
        tags: [
          { name: 'campaign', value: 'b2b-pro-tier' },
          { name: 'sequence', value: 'cold-outreach' }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Email send failed');
    }

    return {
      success: true,
      id: data.id,
      sentAt: new Date().toISOString()
    };

  } catch (error) {
    console.error(`   ❌ Send failed: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

function loadCampaignState() {
  const stateFile = path.join(__dirname, '..', 'lead-data', 'campaign-state.json');

  if (fs.existsSync(stateFile)) {
    return JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  }

  return {
    leads: {},
    stats: {
      email1Sent: 0,
      email2Sent: 0,
      email3Sent: 0,
      totalSent: 0,
      failed: 0
    }
  };
}

function saveCampaignState(state) {
  const stateFile = path.join(__dirname, '..', 'lead-data', 'campaign-state.json');
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
}

async function runCampaign(mode = 'send', batchSize = 50) {
  console.log('🚀 Starting B2B Cold Email Campaign\n');
  console.log(`📧 Mode: ${mode === 'test' ? 'TEST (no emails sent)' : 'LIVE (emails will be sent)'}\n`);

  if (!RESEND_API_KEY && mode === 'send') {
    console.error('❌ RESEND_API_KEY not set. Set it in .env file or run in test mode.');
    process.exit(1);
  }

  // Load outreach-ready leads
  const leadDataDir = path.join(__dirname, '..', 'lead-data');
  const files = fs.readdirSync(leadDataDir)
    .filter(f => f.startsWith('outreach-ready-') && f.endsWith('.json'))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.error('❌ No outreach-ready leads file found. Run verify-emails.js first.');
    process.exit(1);
  }

  const inputFile = path.join(leadDataDir, files[0]);
  console.log(`📂 Loading: ${files[0]}`);

  const leads = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  console.log(`📊 Total leads: ${leads.length}\n`);

  // Load campaign state
  const state = loadCampaignState();

  const today = new Date();
  let sent = 0;

  for (const lead of leads.slice(0, batchSize)) {
    if (!lead.email) continue;

    const leadKey = lead.email.toLowerCase();

    // Initialize lead state if not exists
    if (!state.leads[leadKey]) {
      state.leads[leadKey] = {
        email: lead.email,
        name: lead.name,
        firmName: lead.firmName,
        city: lead.city || lead.location,
        emailsSent: [],
        status: 'new'
      };
    }

    const leadState = state.leads[leadKey];

    // Determine which email to send
    let emailToSend = null;

    if (leadState.emailsSent.length === 0) {
      // Send email 1
      emailToSend = 'email1';
    } else if (leadState.emailsSent.length === 1) {
      // Send email 2 (3 days after email 1)
      const lastSent = new Date(leadState.emailsSent[0].sentAt);
      const daysSince = (today - lastSent) / (1000 * 60 * 60 * 24);

      if (daysSince >= 3) {
        emailToSend = 'email2';
      }
    } else if (leadState.emailsSent.length === 2) {
      // Send email 3 (7 days after email 1)
      const firstSent = new Date(leadState.emailsSent[0].sentAt);
      const daysSinceFirst = (today - firstSent) / (1000 * 60 * 60 * 24);

      if (daysSinceFirst >= 7) {
        emailToSend = 'email3';
      }
    }

    if (!emailToSend) {
      continue; // Skip this lead for now
    }

    // Send the email
    const template = EMAIL_TEMPLATES[emailToSend];
    const subject = template.subject(lead.name);
    const body = template.body(lead);

    console.log(`📧 [${emailToSend.toUpperCase()}] ${lead.name} <${lead.email}>`);
    console.log(`   Subject: ${subject}`);

    if (mode === 'send') {
      const result = await sendEmail(lead.email, subject, body);

      if (result.success) {
        console.log(`   ✅ Sent successfully`);

        leadState.emailsSent.push({
          type: emailToSend,
          sentAt: result.sentAt,
          subject,
          id: result.id
        });

        leadState.status = emailToSend === 'email3' ? 'sequence-complete' : 'in-sequence';

        state.stats[`${emailToSend}Sent`]++;
        state.stats.totalSent++;
        sent++;

      } else if (result.skipped) {
        console.log(`   ⏭️  Skipped (test mode)`);
      } else {
        console.log(`   ❌ Failed: ${result.error}`);
        state.stats.failed++;
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));

    } else {
      console.log(`   📝 Would send (test mode)\n`);
      console.log(body);
      console.log('\n---\n');
    }
  }

  // Save state
  saveCampaignState(state);

  // Print stats
  console.log('\n📈 Campaign Stats:');
  console.log(`   Email 1 sent: ${state.stats.email1Sent}`);
  console.log(`   Email 2 sent: ${state.stats.email2Sent}`);
  console.log(`   Email 3 sent: ${state.stats.email3Sent}`);
  console.log(`   Total sent: ${state.stats.totalSent}`);
  console.log(`   Failed: ${state.stats.failed}`);
  console.log(`\n   This run: ${sent} emails sent`);

  console.log('\n✅ Campaign run complete!');

  if (mode === 'send') {
    console.log('\n📝 Schedule this script to run daily to automatically send follow-ups:');
    console.log('   crontab -e');
    console.log('   0 9 * * * cd /path/to/b2b-tools && node email-campaign.js');
  }
}

// Parse command line args
const args = process.argv.slice(2);
const mode = args.includes('--live') ? 'send' : 'test';
const batchSize = parseInt(args.find(a => a.startsWith('--batch='))?.split('=')[1]) || 50;

runCampaign(mode, batchSize).catch(console.error);
