#!/usr/bin/env node

/**
 * Email Verification Tool using Hunter.io API
 *
 * Verifies email addresses before sending cold emails
 * Hunter.io free tier: 100 verifications/month
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const HUNTER_API_KEY = process.env.HUNTER_API_KEY;

async function verifyEmail(email) {
  if (!HUNTER_API_KEY) {
    console.warn('⚠️  HUNTER_API_KEY not set, skipping verification');
    return { email, valid: null, score: null, verificationSkipped: true };
  }

  try {
    const url = `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${HUNTER_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.errors) {
      console.error(`   ❌ Hunter.io error: ${data.errors[0].details}`);
      return { email, valid: false, error: data.errors[0].details };
    }

    const { result, accept_all, block, disposable, webmail, mx_records, smtp_server, smtp_check, score } = data.data;

    return {
      email,
      valid: result === 'deliverable',
      score,
      acceptAll: accept_all,
      blocked: block,
      disposable,
      webmail,
      hasMX: mx_records,
      smtpValid: smtp_check,
      result
    };

  } catch (error) {
    console.error(`   ❌ Verification failed: ${error.message}`);
    return { email, valid: false, error: error.message };
  }
}

async function findEmail(domain, firstName, lastName) {
  if (!HUNTER_API_KEY) {
    return null;
  }

  try {
    const url = `https://api.hunter.io/v2/email-finder?domain=${domain}&first_name=${firstName}&last_name=${lastName}&api_key=${HUNTER_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.data?.email) {
      return {
        email: data.data.email,
        score: data.data.score,
        source: 'hunter-finder'
      };
    }

    return null;

  } catch (error) {
    console.error(`   ❌ Email finder failed: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting Email Verification Tool\n');

  if (!HUNTER_API_KEY) {
    console.log('⚠️  Warning: HUNTER_API_KEY not set in .env file');
    console.log('   Email verification will be skipped.');
    console.log('   Get your free API key at: https://hunter.io/api\n');
  }

  // Find most recent enriched leads file
  const leadDataDir = path.join(__dirname, '..', 'lead-data');
  const files = fs.readdirSync(leadDataDir)
    .filter(f => f.startsWith('enriched-leads-') && f.endsWith('.json'))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.error('❌ No enriched leads file found. Run enrich-leads.js first.');
    process.exit(1);
  }

  const inputFile = path.join(leadDataDir, files[0]);
  console.log(`📂 Loading: ${files[0]}\n`);

  const leads = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

  // Filter leads that need verification
  const leadsToVerify = leads.filter(lead => lead.email || lead.emailCandidates?.length > 0);

  console.log(`📊 Total leads: ${leads.length}`);
  console.log(`📧 Leads with email data: ${leadsToVerify.length}\n`);

  const verifiedLeads = [];
  let verified = 0;
  let found = 0;

  for (let i = 0; i < leadsToVerify.length; i++) {
    const lead = leadsToVerify[i];
    console.log(`[${i + 1}/${leadsToVerify.length}] ${lead.name}`);

    const verifiedLead = { ...lead };

    // If no direct email, try Hunter.io email finder
    if (!lead.email && lead.website && HUNTER_API_KEY) {
      const domain = new URL(lead.website).hostname.replace('www.', '');
      const nameParts = lead.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];

      console.log(`   🔎 Searching for email on ${domain}...`);
      const foundEmail = await findEmail(domain, firstName, lastName);

      if (foundEmail) {
        verifiedLead.email = foundEmail.email;
        verifiedLead.emailScore = foundEmail.score;
        verifiedLead.emailSource = 'hunter-finder';
        console.log(`   ✅ Found: ${foundEmail.email} (score: ${foundEmail.score})`);
        found++;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Verify the email if we have one
    if (verifiedLead.email && HUNTER_API_KEY) {
      console.log(`   🔍 Verifying: ${verifiedLead.email}...`);
      const verification = await verifyEmail(verifiedLead.email);

      verifiedLead.emailVerification = verification;
      verifiedLead.emailValid = verification.valid;

      if (verification.valid) {
        console.log(`   ✅ Valid (score: ${verification.score})`);
        verified++;
      } else {
        console.log(`   ❌ Invalid or undeliverable`);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    verifiedLeads.push(verifiedLead);

    // Save progress every 20 leads (Hunter.io has rate limits)
    if ((i + 1) % 20 === 0) {
      const progressFile = path.join(leadDataDir, 'verified-leads-progress.json');
      fs.writeFileSync(progressFile, JSON.stringify(verifiedLeads, null, 2));
      console.log(`\n💾 Progress saved (${i + 1}/${leadsToVerify.length})\n`);
    }
  }

  // Stats
  const withValidEmail = verifiedLeads.filter(l => l.emailValid === true).length;
  const withInvalidEmail = verifiedLeads.filter(l => l.emailValid === false).length;
  const withUnverifiedEmail = verifiedLeads.filter(l => l.email && l.emailValid === null).length;

  console.log('\n📈 Verification Stats:');
  console.log(`   Emails found via Hunter: ${found}`);
  console.log(`   Emails verified: ${verified}`);
  console.log(`   Valid deliverable emails: ${withValidEmail}`);
  console.log(`   Invalid/undeliverable: ${withInvalidEmail}`);
  console.log(`   Unverified: ${withUnverifiedEmail}`);

  // Save final results
  const timestamp = new Date().toISOString().split('T')[0];
  const outputFile = path.join(leadDataDir, `verified-leads-${timestamp}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(verifiedLeads, null, 2));

  console.log(`\n💾 Saved to: ${outputFile}`);

  // Create outreach-ready list (valid emails only)
  const outreachReady = verifiedLeads.filter(l => l.emailValid === true || (l.email && !HUNTER_API_KEY));
  const outreachFile = path.join(leadDataDir, `outreach-ready-${timestamp}.json`);
  fs.writeFileSync(outreachFile, JSON.stringify(outreachReady, null, 2));

  console.log(`💾 Outreach-ready list: ${outreachFile}`);
  console.log(`\n✅ Verification complete! ${outreachReady.length} leads ready for cold email campaign.`);

  console.log('\n📝 Next step:');
  console.log('   Run email-campaign.js to start the 3-email sequence');
}

main().catch(console.error);
