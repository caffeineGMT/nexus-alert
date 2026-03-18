#!/usr/bin/env node

/**
 * LinkedIn Outreach Tracker
 *
 * Manages LinkedIn connection requests and follow-up messages
 * Target: 100 immigration lawyers on LinkedIn
 *
 * NOTE: LinkedIn doesn't have a public API for sending connection requests.
 * This tool helps you TRACK your manual outreach efforts.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MESSAGE_TEMPLATES = {
  connectionRequest: (lead) => {
    const firstName = lead.name.split(' ')[0];
    return `Hi ${firstName}, I help immigration lawyers save 10+ hours/week on NEXUS appointment monitoring for clients. Would love to connect and share how we're helping firms in ${lead.city || 'your area'} streamline this process.`;
  },

  followUpMessage: (lead) => {
    const firstName = lead.name.split(' ')[0];
    return `Thanks for connecting, ${firstName}!

I noticed you work in immigration law. Quick question: are you currently managing NEXUS or Global Entry appointments for your clients?

We built NEXUS Alert Pro specifically for immigration lawyers — it monitors all your clients' appointments in one dashboard and sends white-label notifications (branded with your firm name).

Most firms save 10+ hours/week and can handle 3x more NEXUS clients.

Would you be open to a quick 15-min demo? Or feel free to try the 60-day free trial: https://nexus-alert.com/pro

Let me know if you'd like to chat!`;
  }
};

function loadLinkedInState() {
  const stateFile = path.join(__dirname, '..', 'lead-data', 'linkedin-state.json');

  if (fs.existsSync(stateFile)) {
    return JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  }

  return {
    prospects: {},
    stats: {
      connectionsSent: 0,
      connectionsAccepted: 0,
      messagesSent: 0,
      responses: 0,
      demos: 0
    }
  };
}

function saveLinkedInState(state) {
  const stateFile = path.join(__dirname, '..', 'lead-data', 'linkedin-state.json');
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
}

function generateOutreachScript(leads, limit = 20) {
  console.log('📋 LinkedIn Outreach Script\n');
  console.log('=' .repeat(60));
  console.log('\n🎯 DAILY OUTREACH PLAN\n');

  const state = loadLinkedInState();
  const leadsToOutreach = leads.slice(0, limit);

  leadsToOutreach.forEach((lead, index) => {
    const leadKey = lead.email || lead.name.toLowerCase().replace(/\s/g, '-');

    if (!state.prospects[leadKey]) {
      state.prospects[leadKey] = {
        name: lead.name,
        firmName: lead.firmName,
        city: lead.city || lead.location,
        email: lead.email,
        status: 'identified',
        linkedInUrl: null,
        connectionSentAt: null,
        connectionAcceptedAt: null,
        messageSentAt: null,
        notes: []
      };
    }

    const prospect = state.prospects[leadKey];

    console.log(`\n${index + 1}. ${lead.name}`);
    console.log(`   Firm: ${lead.firmName || 'N/A'}`);
    console.log(`   Location: ${lead.city || lead.location || 'N/A'}`);
    console.log(`   Status: ${prospect.status}`);
    console.log('\n   📝 STEPS:');

    if (!prospect.linkedInUrl) {
      console.log(`   [ ] 1. Search LinkedIn: "${lead.name} ${lead.firmName || ''} immigration lawyer"`);
      console.log(`   [ ] 2. Copy profile URL and paste below`);
    } else {
      console.log(`   [✓] 1. Profile found: ${prospect.linkedInUrl}`);
    }

    if (!prospect.connectionSentAt) {
      console.log(`   [ ] 3. Send connection request with note:`);
      console.log(`\n   "${MESSAGE_TEMPLATES.connectionRequest(lead)}"\n`);
    } else {
      console.log(`   [✓] 3. Connection sent on ${prospect.connectionSentAt}`);
    }

    if (prospect.connectionAcceptedAt && !prospect.messageSentAt) {
      console.log(`   [ ] 4. Send follow-up message:`);
      console.log(`\n   "${MESSAGE_TEMPLATES.followUpMessage(lead)}"\n`);
    }

    console.log(`   ---`);
  });

  console.log('\n\n🎯 TRACKING INSTRUCTIONS:\n');
  console.log('After completing outreach, update the status:');
  console.log('   node linkedin-outreach.js update <name> --status=<status> --url=<linkedInUrl>\n');
  console.log('Status options:');
  console.log('   - identified: Found on LinkedIn but not contacted');
  console.log('   - connection-sent: Connection request sent');
  console.log('   - connected: Connection accepted');
  console.log('   - messaged: Follow-up message sent');
  console.log('   - responded: They replied');
  console.log('   - demo-scheduled: Demo call scheduled');
  console.log('   - trial-started: They started free trial');
  console.log('   - customer: Converted to paying customer');

  saveLinkedInState(state);

  // Export CSV for tracking
  const csvFile = path.join(__dirname, '..', 'lead-data', 'linkedin-outreach-tracker.csv');
  const csvHeader = 'Name,Firm,City,Status,LinkedIn URL,Connection Sent,Connected,Messaged\n';
  const csvRows = Object.values(state.prospects).map(p =>
    `"${p.name}","${p.firmName || ''}","${p.city || ''}","${p.status}","${p.linkedInUrl || ''}","${p.connectionSentAt || ''}","${p.connectionAcceptedAt || ''}","${p.messageSentAt || ''}"`
  ).join('\n');

  fs.writeFileSync(csvFile, csvHeader + csvRows);
  console.log(`\n💾 Tracker saved to: ${csvFile}`);
}

function updateProspect(name, updates) {
  const state = loadLinkedInState();

  // Find prospect by name
  const leadKey = Object.keys(state.prospects).find(key =>
    state.prospects[key].name.toLowerCase().includes(name.toLowerCase())
  );

  if (!leadKey) {
    console.error(`❌ Prospect not found: ${name}`);
    process.exit(1);
  }

  const prospect = state.prospects[leadKey];

  // Apply updates
  if (updates.status) {
    prospect.status = updates.status;

    // Auto-set timestamps based on status
    const now = new Date().toISOString();
    if (updates.status === 'connection-sent' && !prospect.connectionSentAt) {
      prospect.connectionSentAt = now;
      state.stats.connectionsSent++;
    } else if (updates.status === 'connected' && !prospect.connectionAcceptedAt) {
      prospect.connectionAcceptedAt = now;
      state.stats.connectionsAccepted++;
    } else if (updates.status === 'messaged' && !prospect.messageSentAt) {
      prospect.messageSentAt = now;
      state.stats.messagesSent++;
    } else if (updates.status === 'responded') {
      state.stats.responses++;
    } else if (updates.status === 'demo-scheduled') {
      state.stats.demos++;
    }
  }

  if (updates.url) {
    prospect.linkedInUrl = updates.url;
  }

  if (updates.note) {
    prospect.notes.push({
      text: updates.note,
      addedAt: new Date().toISOString()
    });
  }

  saveLinkedInState(state);

  console.log(`✅ Updated: ${prospect.name}`);
  console.log(`   Status: ${prospect.status}`);
  if (updates.url) console.log(`   LinkedIn: ${updates.url}`);

  // Show stats
  console.log('\n📊 Campaign Stats:');
  console.log(`   Connections sent: ${state.stats.connectionsSent}`);
  console.log(`   Connections accepted: ${state.stats.connectionsAccepted}`);
  console.log(`   Messages sent: ${state.stats.messagesSent}`);
  console.log(`   Responses: ${state.stats.responses}`);
  console.log(`   Demos scheduled: ${state.stats.demos}`);
}

function showStats() {
  const state = loadLinkedInState();

  console.log('\n📊 LinkedIn Outreach Stats\n');
  console.log(`Total prospects tracked: ${Object.keys(state.prospects).length}`);
  console.log(`Connections sent: ${state.stats.connectionsSent}`);
  console.log(`Connections accepted: ${state.stats.connectionsAccepted} (${Math.round(state.stats.connectionsAccepted/state.stats.connectionsSent*100)}% acceptance rate)`);
  console.log(`Follow-up messages sent: ${state.stats.messagesSent}`);
  console.log(`Responses received: ${state.stats.responses} (${Math.round(state.stats.responses/state.stats.messagesSent*100)}% response rate)`);
  console.log(`Demos scheduled: ${state.stats.demos}`);

  console.log('\n📋 Prospects by Status:');
  const byStatus = {};
  Object.values(state.prospects).forEach(p => {
    byStatus[p.status] = (byStatus[p.status] || 0) + 1;
  });

  Object.entries(byStatus).sort((a, b) => b[1] - a[1]).forEach(([status, count]) => {
    console.log(`   ${status}: ${count}`);
  });
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'update') {
    const name = args[1];
    const updates = {};

    args.slice(2).forEach(arg => {
      if (arg.startsWith('--status=')) {
        updates.status = arg.split('=')[1];
      } else if (arg.startsWith('--url=')) {
        updates.url = arg.split('=')[1];
      } else if (arg.startsWith('--note=')) {
        updates.note = arg.split('=')[1];
      }
    });

    updateProspect(name, updates);

  } else if (command === 'stats') {
    showStats();

  } else {
    // Generate outreach script
    const limit = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1]) || 20;

    // Load leads
    const leadDataDir = path.join(__dirname, '..', 'lead-data');
    const files = fs.readdirSync(leadDataDir)
      .filter(f => f.startsWith('enriched-leads-') && f.endsWith('.json'))
      .sort()
      .reverse();

    if (files.length === 0) {
      console.error('❌ No leads file found. Run enrich-leads.js first.');
      process.exit(1);
    }

    const leads = JSON.parse(fs.readFileSync(path.join(leadDataDir, files[0]), 'utf8'));
    generateOutreachScript(leads, limit);
  }
}

main().catch(console.error);
