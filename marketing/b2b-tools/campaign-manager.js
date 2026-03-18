/**
 * B2B Campaign Manager
 * Orchestrates the complete cold outreach campaign
 * - 200 emails to immigration lawyers
 * - 3-email sequence with 3-day intervals
 * - Tracking for opens, clicks, replies, demos, conversions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Campaign configuration
const CAMPAIGN_CONFIG = {
  name: 'B2B Pro Tier Launch',
  target: 200,
  pricing: 99,
  goalCustomers: 1,
  goalDemoCalls: 3,
  targetOpenRate: 0.40,
  sequenceDelayDays: 3,
  emails: [
    {
      id: 1,
      name: 'Pain Point',
      subject: 'Appointment bottleneck solution for your NEXUS clients',
      delay: 0
    },
    {
      id: 2,
      name: 'Social Proof',
      subject: 'Case study: How {{firmName}} books 10x more appointments',
      delay: 3
    },
    {
      id: 3,
      name: 'Trial Offer',
      subject: '60-day free trial for your practice',
      delay: 7
    }
  ]
};

class CampaignManager {
  constructor() {
    this.stateFile = path.join(__dirname, '..', 'lead-data', 'campaign-state.json');
    this.leadsFile = path.join(__dirname, '..', 'lead-data', 'outreach-ready-latest.json');
    this.trackerFile = path.join(__dirname, 'outreach-tracker.csv');
    this.state = this.loadState();
  }

  loadState() {
    if (fs.existsSync(this.stateFile)) {
      return JSON.parse(fs.readFileSync(this.stateFile, 'utf-8'));
    }

    return {
      campaignId: `CAMPAIGN-${Date.now()}`,
      startDate: new Date().toISOString(),
      leads: [],
      stats: {
        email1Sent: 0,
        email2Sent: 0,
        email3Sent: 0,
        totalSent: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
        demoCalls: 0,
        trialsStarted: 0,
        paidConversions: 0,
        failed: 0
      }
    };
  }

  saveState() {
    const leadDataDir = path.dirname(this.stateFile);
    if (!fs.existsSync(leadDataDir)) {
      fs.mkdirSync(leadDataDir, { recursive: true });
    }
    fs.writeFileSync(this.stateFile, JSON.stringify(this.state, null, 2));
  }

  loadLeads() {
    if (!fs.existsSync(this.leadsFile)) {
      console.error(`❌ Leads file not found: ${this.leadsFile}`);
      console.log('\n📋 Run the scraping pipeline first:');
      console.log('   npm run pipeline\n');
      process.exit(1);
    }

    return JSON.parse(fs.readFileSync(this.leadsFile, 'utf-8'));
  }

  async start(options = {}) {
    console.log('🚀 B2B Campaign Manager');
    console.log(`   Campaign: ${CAMPAIGN_CONFIG.name}`);
    console.log(`   Target: ${CAMPAIGN_CONFIG.target} emails`);
    console.log(`   Goal: ${CAMPAIGN_CONFIG.goalCustomers}+ paying customers ($${CAMPAIGN_CONFIG.pricing}/mo)\n`);

    const leads = this.loadLeads();
    console.log(`📊 Loaded ${leads.length} verified leads`);

    // Filter leads not yet contacted
    const uncontacted = leads.filter(lead => {
      const existingLead = this.state.leads.find(l => l.email === lead.email);
      return !existingLead || !existingLead.email1Sent;
    });

    console.log(`   ${uncontacted.length} leads not yet contacted`);
    console.log(`   ${leads.length - uncontacted.length} leads already in sequence\n`);

    // Determine batch size
    const batchSize = options.batch || Math.min(uncontacted.length, CAMPAIGN_CONFIG.target - this.state.stats.totalSent);

    if (batchSize === 0) {
      console.log('✅ All leads have been contacted. Running follow-up sequence...\n');
      await this.runFollowUpSequence();
      return;
    }

    console.log(`📧 Sending Email 1 to ${batchSize} leads...\n`);

    // Send Email 1
    for (let i = 0; i < batchSize; i++) {
      const lead = uncontacted[i];
      await this.sendEmail1(lead, options.live);

      // Progress update
      if ((i + 1) % 10 === 0) {
        console.log(`   Sent ${i + 1}/${batchSize}...`);
      }
    }

    this.saveState();
    this.printStats();
  }

  async sendEmail1(lead, live = false) {
    const email = {
      to: lead.email,
      from: 'NEXUS Alert Team <hello@nexus-alert.com>',
      subject: CAMPAIGN_CONFIG.emails[0].subject,
      html: this.generateEmailHTML(1, lead),
      trackingId: `${this.state.campaignId}-${lead.email}-E1`
    };

    if (live) {
      // Actually send via Resend API
      const success = await this.sendViaResend(email);
      if (!success) {
        this.state.stats.failed++;
        return;
      }
    } else {
      console.log(`[TEST MODE] Would send to: ${lead.email} (${lead.firmName})`);
    }

    // Update state
    const leadState = {
      ...lead,
      email1Sent: new Date().toISOString(),
      email1TrackingId: email.trackingId,
      nextEmailDue: this.addDays(new Date(), CAMPAIGN_CONFIG.emails[1].delay).toISOString(),
      status: 'email1-sent'
    };

    const existingIndex = this.state.leads.findIndex(l => l.email === lead.email);
    if (existingIndex >= 0) {
      this.state.leads[existingIndex] = leadState;
    } else {
      this.state.leads.push(leadState);
    }

    this.state.stats.email1Sent++;
    this.state.stats.totalSent++;
  }

  async runFollowUpSequence() {
    console.log('🔄 Checking for leads due for Email 2 or Email 3...\n');

    const today = new Date();

    for (const lead of this.state.leads) {
      // Skip if already replied or converted
      if (lead.status === 'replied' || lead.status === 'trial' || lead.status === 'paid') {
        continue;
      }

      // Check if Email 2 is due
      if (lead.email1Sent && !lead.email2Sent && lead.nextEmailDue) {
        const dueDate = new Date(lead.nextEmailDue);
        if (today >= dueDate) {
          await this.sendEmail2(lead);
        }
      }

      // Check if Email 3 is due
      if (lead.email2Sent && !lead.email3Sent && lead.nextEmailDue) {
        const dueDate = new Date(lead.nextEmailDue);
        if (today >= dueDate) {
          await this.sendEmail3(lead);
        }
      }
    }

    this.saveState();
    this.printStats();
  }

  async sendEmail2(lead) {
    const email = {
      to: lead.email,
      from: 'NEXUS Alert Team <hello@nexus-alert.com>',
      subject: this.personalize(CAMPAIGN_CONFIG.emails[1].subject, lead),
      html: this.generateEmailHTML(2, lead),
      trackingId: `${this.state.campaignId}-${lead.email}-E2`,
      replyTo: lead.email1TrackingId // Thread with Email 1
    };

    console.log(`📧 Sending Email 2 to: ${lead.firmName} (${lead.email})`);

    const success = await this.sendViaResend(email);
    if (!success) {
      this.state.stats.failed++;
      return;
    }

    // Update state
    lead.email2Sent = new Date().toISOString();
    lead.email2TrackingId = email.trackingId;
    lead.nextEmailDue = this.addDays(new Date(), CAMPAIGN_CONFIG.emails[2].delay - CAMPAIGN_CONFIG.emails[1].delay).toISOString();
    lead.status = 'email2-sent';

    this.state.stats.email2Sent++;
  }

  async sendEmail3(lead) {
    const email = {
      to: lead.email,
      from: 'NEXUS Alert Team <hello@nexus-alert.com>',
      subject: CAMPAIGN_CONFIG.emails[2].subject,
      html: this.generateEmailHTML(3, lead),
      trackingId: `${this.state.campaignId}-${lead.email}-E3`,
      replyTo: lead.email2TrackingId // Thread with Email 2
    };

    console.log(`📧 Sending Email 3 to: ${lead.firmName} (${lead.email})`);

    const success = await this.sendViaResend(email);
    if (!success) {
      this.state.stats.failed++;
      return;
    }

    // Update state
    lead.email3Sent = new Date().toISOString();
    lead.email3TrackingId = email.trackingId;
    lead.status = 'email3-sent';

    this.state.stats.email3Sent++;
  }

  async sendViaResend(email) {
    // Integration with Resend API
    // Requires RESEND_API_KEY in .env

    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not found in .env');
      return false;
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: email.from,
          to: email.to,
          subject: email.subject,
          html: email.html,
          tags: [
            { name: 'campaign', value: this.state.campaignId },
            { name: 'tracking_id', value: email.trackingId }
          ]
        })
      });

      if (!response.ok) {
        console.error(`❌ Resend API error: ${response.statusText}`);
        return false;
      }

      return true;
    } catch (err) {
      console.error(`❌ Failed to send email: ${err.message}`);
      return false;
    }
  }

  generateEmailHTML(emailNumber, lead) {
    // Load email templates from email-sequence-v2.md
    // For now, return placeholder
    const templates = {
      1: `
        <p>Hi ${lead.contactName || 'there'},</p>
        <p>I noticed ${lead.firmName} handles immigration cases in ${lead.city}...</p>
        <p>[Full Email 1 content from email-sequence-v2.md]</p>
      `,
      2: `
        <p>Hi ${lead.contactName || 'there'},</p>
        <p>Following up on my email about NEXUS appointment bottleneck...</p>
        <p>[Full Email 2 content from email-sequence-v2.md]</p>
      `,
      3: `
        <p>Hi ${lead.contactName || 'there'},</p>
        <p>One last email - 60-day free trial for ${lead.firmName}...</p>
        <p>[Full Email 3 content from email-sequence-v2.md]</p>
      `
    };

    return templates[emailNumber] || '';
  }

  personalize(text, lead) {
    return text
      .replace(/\{\{firstName\}\}/g, lead.contactName || 'there')
      .replace(/\{\{firmName\}\}/g, lead.firmName)
      .replace(/\{\{city\}\}/g, lead.city)
      .replace(/\{\{leadId\}\}/g, lead.leadId || '');
  }

  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  printStats() {
    console.log('\n📊 Campaign Stats:');
    console.log(`   Email 1 sent: ${this.state.stats.email1Sent}`);
    console.log(`   Email 2 sent: ${this.state.stats.email2Sent}`);
    console.log(`   Email 3 sent: ${this.state.stats.email3Sent}`);
    console.log(`   Total sent: ${this.state.stats.totalSent}/${CAMPAIGN_CONFIG.target}`);
    console.log(`   Opens: ${this.state.stats.opened} (${this.calculateRate(this.state.stats.opened, this.state.stats.totalSent)}%)`);
    console.log(`   Clicks: ${this.state.stats.clicked} (${this.calculateRate(this.state.stats.clicked, this.state.stats.totalSent)}%)`);
    console.log(`   Replies: ${this.state.stats.replied} (${this.calculateRate(this.state.stats.replied, this.state.stats.totalSent)}%)`);
    console.log(`   Demo calls: ${this.state.stats.demoCalls}`);
    console.log(`   Trials started: ${this.state.stats.trialsStarted}`);
    console.log(`   Paid conversions: ${this.state.stats.paidConversions}`);
    console.log(`   Failed: ${this.state.stats.failed}\n`);

    // Goal tracking
    const openRate = this.calculateRate(this.state.stats.opened, this.state.stats.totalSent) / 100;
    console.log('🎯 Goal Progress:');
    console.log(`   Target open rate: ${CAMPAIGN_CONFIG.targetOpenRate * 100}% | Current: ${(openRate * 100).toFixed(1)}% ${openRate >= CAMPAIGN_CONFIG.targetOpenRate ? '✅' : '⚠️'}`);
    console.log(`   Target demo calls: ${CAMPAIGN_CONFIG.goalDemoCalls} | Current: ${this.state.stats.demoCalls} ${this.state.stats.demoCalls >= CAMPAIGN_CONFIG.goalDemoCalls ? '✅' : '⏳'}`);
    console.log(`   Target customers: ${CAMPAIGN_CONFIG.goalCustomers} | Current: ${this.state.stats.paidConversions} ${this.state.stats.paidConversions >= CAMPAIGN_CONFIG.goalCustomers ? '✅' : '⏳'}`);
    console.log('');
  }

  calculateRate(numerator, denominator) {
    if (denominator === 0) return 0;
    return ((numerator / denominator) * 100).toFixed(1);
  }

  exportToCSV() {
    console.log('📄 Exporting to CSV...');

    const headers = [
      'Lead ID',
      'Firm Name',
      'Contact Name',
      'Email',
      'City',
      'Priority',
      'Email 1 Sent',
      'Email 2 Sent',
      'Email 3 Sent',
      'Status',
      'Opened',
      'Clicked',
      'Replied',
      'Demo Scheduled',
      'Trial Started',
      'Paid Conversion',
      'Notes'
    ];

    const rows = this.state.leads.map(lead => [
      lead.leadId || '',
      lead.firmName || '',
      lead.contactName || '',
      lead.email || '',
      lead.city || '',
      lead.priority || '',
      lead.email1Sent ? new Date(lead.email1Sent).toLocaleDateString() : '',
      lead.email2Sent ? new Date(lead.email2Sent).toLocaleDateString() : '',
      lead.email3Sent ? new Date(lead.email3Sent).toLocaleDateString() : '',
      lead.status || '',
      lead.opened ? 'Yes' : 'No',
      lead.clicked ? 'Yes' : 'No',
      lead.replied ? 'Yes' : 'No',
      lead.demoScheduled || '',
      lead.trialStarted || '',
      lead.paidConversion || '',
      lead.notes || ''
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    fs.writeFileSync(this.trackerFile, csv);
    console.log(`   Saved to: ${this.trackerFile}\n`);
  }
}

// CLI interface
const args = process.argv.slice(2);
const command = args[0];
const options = {
  live: args.includes('--live'),
  batch: args.find(arg => arg.startsWith('--batch='))?.split('=')[1] || null
};

const manager = new CampaignManager();

if (command === 'start') {
  manager.start(options);
} else if (command === 'follow-up') {
  manager.runFollowUpSequence();
} else if (command === 'export') {
  manager.exportToCSV();
} else if (command === 'stats') {
  manager.printStats();
} else {
  console.log('B2B Campaign Manager\n');
  console.log('Usage:');
  console.log('  node campaign-manager.js start [--live] [--batch=50]  Start campaign');
  console.log('  node campaign-manager.js follow-up                    Send Email 2/3');
  console.log('  node campaign-manager.js stats                        Show stats');
  console.log('  node campaign-manager.js export                       Export CSV');
  console.log('');
}
