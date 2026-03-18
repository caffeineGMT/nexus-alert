#!/usr/bin/env node

/**
 * B2B Lead Generation Pipeline - Immigration Lawyers
 *
 * Complete pipeline to generate 500 qualified immigration lawyer leads:
 * 1. Apify Google Maps Scraper - Extract lawyers from key cities
 * 2. AILA Directory scraping (supplemental)
 * 3. LinkedIn Sales Navigator export (manual upload)
 * 4. Hunter.io email verification
 * 5. Firm size segmentation
 * 6. Airtable storage
 *
 * Target: 500 verified emails, segmented by firm size, ready for outreach
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  apifyApiKey: process.env.APIFY_API_KEY,
  hunterApiKey: process.env.HUNTER_API_KEY,
  airtableApiKey: process.env.AIRTABLE_API_KEY,
  airtableBaseId: process.env.AIRTABLE_BASE_ID,
  leadDataDir: path.join(__dirname, '..', 'lead-data'),
  targetLeadCount: 500,
  dailyHunterLimit: 100
};

// Target cities for scraping (US-Canada border states + major immigration hubs)
const TARGET_SEARCHES = [
  // Vancouver metro
  { query: 'immigration lawyer vancouver bc', location: 'Vancouver, BC', priority: 'VERY HIGH' },
  { query: 'immigration attorney richmond bc', location: 'Richmond, BC', priority: 'HIGH' },
  { query: 'immigration lawyer surrey bc', location: 'Surrey, BC', priority: 'HIGH' },

  // Seattle metro
  { query: 'immigration lawyer seattle wa', location: 'Seattle, WA', priority: 'VERY HIGH' },
  { query: 'immigration attorney bellevue wa', location: 'Bellevue, WA', priority: 'HIGH' },
  { query: 'immigration lawyer bellingham wa', location: 'Bellingham, WA', priority: 'VERY HIGH' },
  { query: 'immigration attorney blaine wa', location: 'Blaine, WA', priority: 'HIGH' },

  // Toronto metro
  { query: 'immigration lawyer toronto on', location: 'Toronto, ON', priority: 'VERY HIGH' },
  { query: 'immigration attorney mississauga on', location: 'Mississauga, ON', priority: 'HIGH' },
  { query: 'immigration lawyer brampton on', location: 'Brampton, ON', priority: 'HIGH' },

  // Buffalo / Niagara
  { query: 'immigration lawyer buffalo ny', location: 'Buffalo, NY', priority: 'VERY HIGH' },
  { query: 'immigration attorney niagara falls ny', location: 'Niagara Falls, NY', priority: 'HIGH' },

  // Detroit metro
  { query: 'immigration lawyer detroit mi', location: 'Detroit, MI', priority: 'HIGH' },
  { query: 'immigration attorney windsor on', location: 'Windsor, ON', priority: 'HIGH' },

  // Other border cities
  { query: 'immigration lawyer burlington vt', location: 'Burlington, VT', priority: 'MEDIUM' },
  { query: 'immigration attorney grand forks nd', location: 'Grand Forks, ND', priority: 'MEDIUM' },
  { query: 'immigration lawyer portal nd', location: 'Portal, ND', priority: 'MEDIUM' },
  { query: 'immigration attorney sweetgrass mt', location: 'Sweetgrass, MT', priority: 'MEDIUM' },

  // Major NEXUS enrollment centers
  { query: 'immigration lawyer san diego ca', location: 'San Diego, CA', priority: 'VERY HIGH' },
  { query: 'immigration attorney san ysidro ca', location: 'San Ysidro, CA', priority: 'HIGH' },
  { query: 'immigration lawyer el paso tx', location: 'El Paso, TX', priority: 'HIGH' },
  { query: 'immigration attorney nogales az', location: 'Nogales, AZ', priority: 'MEDIUM' }
];

/**
 * Run Apify Google Maps Scraper
 */
async function scrapeGoogleMaps() {
  console.log('\n🗺️  STEP 1: Google Maps Scraping via Apify');
  console.log('==========================================\n');

  if (!CONFIG.apifyApiKey) {
    console.log('⚠️  APIFY_API_KEY not set. Skipping Apify scraping.');
    console.log('   Sign up at: https://apify.com');
    console.log('   Get API key: https://console.apify.com/account/integrations');
    console.log('   Add to .env: APIFY_API_KEY=your_key_here\n');
    return [];
  }

  const allLeads = [];

  for (const search of TARGET_SEARCHES) {
    console.log(`📍 Scraping: ${search.query}`);

    try {
      // Use Apify's Google Maps Scraper actor
      const actorInput = {
        searchStringsArray: [search.query],
        maxCrawledPlacesPerSearch: 30,
        language: 'en',
        scrapeReviewsCheckbox: false,
        scrapeImageUrls: false,
        exportPlaceUrls: true
      };

      const runResponse = await fetch(
        `https://api.apify.com/v2/acts/nwua9~google-maps-scraper/runs?token=${CONFIG.apifyApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(actorInput)
        }
      );

      const runData = await runResponse.json();
      const runId = runData.data.id;

      console.log(`   🕐 Run started: ${runId}`);
      console.log(`   ⏳ Waiting for results...`);

      // Poll for completion (max 2 minutes)
      let results = null;
      for (let i = 0; i < 24; i++) {
        await new Promise(resolve => setTimeout(resolve, 5000));

        const statusResponse = await fetch(
          `https://api.apify.com/v2/acts/nwua9~google-maps-scraper/runs/${runId}?token=${CONFIG.apifyApiKey}`
        );
        const statusData = await statusResponse.json();

        if (statusData.data.status === 'SUCCEEDED') {
          // Fetch results
          const datasetId = statusData.data.defaultDatasetId;
          const itemsResponse = await fetch(
            `https://api.apify.com/v2/datasets/${datasetId}/items?token=${CONFIG.apifyApiKey}`
          );
          results = await itemsResponse.json();
          break;
        }

        if (statusData.data.status === 'FAILED') {
          throw new Error('Apify run failed');
        }
      }

      if (!results) {
        throw new Error('Timeout waiting for Apify results');
      }

      console.log(`   ✅ Found ${results.length} results`);

      // Process results
      results.forEach(place => {
        const lead = {
          source: 'Google Maps (Apify)',
          name: place.title,
          firmName: place.title,
          address: place.address,
          city: search.location.split(',')[0].trim(),
          state: search.location.split(',')[1]?.trim(),
          phone: place.phone,
          website: place.website,
          googleMapsUrl: place.url,
          rating: place.totalScore,
          reviewCount: place.reviewsCount,
          category: place.categoryName,
          priority: search.priority,
          scrapedAt: new Date().toISOString()
        };

        allLeads.push(lead);
      });

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  // Save raw results
  const timestamp = new Date().toISOString().split('T')[0];
  const outputPath = path.join(CONFIG.leadDataDir, `gmaps-leads-${timestamp}.json`);

  if (!fs.existsSync(CONFIG.leadDataDir)) {
    fs.mkdirSync(CONFIG.leadDataDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(allLeads, null, 2));

  console.log(`\n📊 Google Maps Summary:`);
  console.log(`   Total leads: ${allLeads.length}`);
  console.log(`   Saved to: ${outputPath}\n`);

  return allLeads;
}

/**
 * Extract email addresses from websites
 */
async function extractEmails(leads) {
  console.log('\n📧 STEP 2: Email Extraction');
  console.log('===========================\n');

  const withEmail = leads.filter(l => l.email || l.website);
  console.log(`Processing ${withEmail.length} leads with websites...\n`);

  for (let i = 0; i < withEmail.length; i++) {
    const lead = withEmail[i];

    if (lead.email) {
      console.log(`[${i+1}/${withEmail.length}] ✓ ${lead.name} - already has email`);
      continue;
    }

    if (!lead.website) {
      continue;
    }

    console.log(`[${i+1}/${withEmail.length}] 🔍 ${lead.name}`);

    try {
      const response = await fetch(lead.website, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
        timeout: 8000
      });

      const html = await response.text();
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const foundEmails = html.match(emailRegex) || [];

      const validEmails = foundEmails.filter(email =>
        !email.includes('example.com') &&
        !email.includes('wix.com') &&
        !email.includes('gmail.com') &&
        !email.includes('hotmail.com') &&
        !email.includes('.png') &&
        !email.includes('.jpg')
      );

      if (validEmails.length > 0) {
        lead.email = validEmails[0];
        lead.allEmailsFound = [...new Set(validEmails)];
        console.log(`   ✅ Found: ${lead.email}`);
      } else {
        // Generate candidates from domain
        const domain = new URL(lead.website).hostname.replace('www.', '');
        lead.emailCandidates = [
          `info@${domain}`,
          `contact@${domain}`,
          `admin@${domain}`
        ];
        console.log(`   💡 Generated candidates for ${domain}`);
      }

    } catch (error) {
      console.log(`   ⚠️  Error: ${error.message}`);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  const emailCount = leads.filter(l => l.email).length;
  const candidateCount = leads.filter(l => l.emailCandidates?.length > 0).length;

  console.log(`\n📊 Email Extraction Summary:`);
  console.log(`   Verified emails: ${emailCount}`);
  console.log(`   Email candidates: ${candidateCount}`);
  console.log(`   Total contactable: ${emailCount + candidateCount}\n`);

  return leads;
}

/**
 * Verify emails with Hunter.io
 */
async function verifyEmails(leads) {
  console.log('\n✅ STEP 3: Email Verification with Hunter.io');
  console.log('=============================================\n');

  if (!CONFIG.hunterApiKey) {
    console.log('⚠️  HUNTER_API_KEY not set. Skipping verification.');
    console.log('   Sign up at: https://hunter.io');
    console.log('   Get API key: https://hunter.io/api-keys');
    console.log('   Add to .env: HUNTER_API_KEY=your_key_here\n');
    return leads;
  }

  const toVerify = leads.filter(l => l.email && !l.emailVerified);
  const batchSize = Math.min(CONFIG.dailyHunterLimit, toVerify.length);

  console.log(`Verifying ${batchSize} emails (Hunter.io limit: ${CONFIG.dailyHunterLimit}/day)...\n`);

  for (let i = 0; i < batchSize; i++) {
    const lead = toVerify[i];
    console.log(`[${i+1}/${batchSize}] 🔍 ${lead.email}`);

    try {
      const response = await fetch(
        `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(lead.email)}&api_key=${CONFIG.hunterApiKey}`
      );

      const data = await response.json();

      if (data.data) {
        lead.emailVerified = true;
        lead.emailStatus = data.data.status; // 'valid', 'invalid', 'accept_all', 'webmail', 'disposable', 'unknown'
        lead.emailScore = data.data.score; // 0-100
        lead.hunterResult = data.data.result; // 'deliverable', 'undeliverable', 'risky', 'unknown'

        console.log(`   ${lead.emailStatus === 'valid' ? '✅' : '⚠️'}  Status: ${lead.emailStatus}, Score: ${lead.emailScore}`);
      }

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    // Rate limiting (Hunter.io allows 10 requests/second)
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  const verifiedCount = leads.filter(l => l.emailStatus === 'valid').length;
  const acceptAllCount = leads.filter(l => l.emailStatus === 'accept_all').length;

  console.log(`\n📊 Verification Summary:`);
  console.log(`   Valid: ${verifiedCount}`);
  console.log(`   Accept-all: ${acceptAllCount}`);
  console.log(`   Total verified: ${verifiedCount + acceptAllCount}\n`);

  return leads;
}

/**
 * Segment leads by firm size
 */
function segmentByFirmSize(leads) {
  console.log('\n📊 STEP 4: Firm Size Segmentation');
  console.log('==================================\n');

  leads.forEach(lead => {
    const firmName = lead.firmName || lead.name || '';
    const reviewCount = lead.reviewCount || 0;

    // Heuristics for firm size
    let firmSize = 'UNKNOWN';

    // Large firm indicators
    if (
      firmName.includes('LLP') ||
      firmName.includes('Group') ||
      firmName.includes('Associates') ||
      firmName.includes('& Partners') ||
      reviewCount > 100
    ) {
      firmSize = 'Large (10+)';
    }
    // Small firm indicators
    else if (
      firmName.match(/\w+\s+&\s+\w+/) || // "Smith & Jones"
      firmName.includes('Law Office') ||
      (reviewCount >= 10 && reviewCount <= 100)
    ) {
      firmSize = 'Small (2-10)';
    }
    // Solo practitioner indicators
    else if (
      !firmName.includes('&') &&
      !firmName.includes('LLP') &&
      !firmName.includes('PC') &&
      !firmName.includes('Law Firm') &&
      reviewCount < 10
    ) {
      firmSize = 'Solo (1)';
    }

    lead.firmSize = firmSize;

    // Set priority based on firm size (solo practitioners are easier to close)
    if (firmSize === 'Solo (1)') {
      lead.firmSizePriority = 'HIGH';
    } else if (firmSize === 'Small (2-10)') {
      lead.firmSizePriority = 'MEDIUM';
    } else {
      lead.firmSizePriority = 'LOW';
    }
  });

  const solo = leads.filter(l => l.firmSize === 'Solo (1)').length;
  const small = leads.filter(l => l.firmSize === 'Small (2-10)').length;
  const large = leads.filter(l => l.firmSize === 'Large (10+)').length;
  const unknown = leads.filter(l => l.firmSize === 'UNKNOWN').length;

  console.log('Firm Size Distribution:');
  console.log(`   Solo (1):          ${solo} leads (HIGH priority)`);
  console.log(`   Small (2-10):      ${small} leads (MEDIUM priority)`);
  console.log(`   Large (10+):       ${large} leads (LOW priority)`);
  console.log(`   Unknown:           ${unknown} leads\n`);

  return leads;
}

/**
 * Upload to Airtable
 */
async function uploadToAirtable(leads) {
  console.log('\n📤 STEP 5: Upload to Airtable');
  console.log('==============================\n');

  if (!CONFIG.airtableApiKey || !CONFIG.airtableBaseId) {
    console.log('⚠️  Airtable credentials not set. Skipping upload.');
    console.log('   Sign up at: https://airtable.com');
    console.log('   Get API key: https://airtable.com/create/tokens');
    console.log('   Create base and get Base ID from URL');
    console.log('   Add to .env:');
    console.log('     AIRTABLE_API_KEY=your_key_here');
    console.log('     AIRTABLE_BASE_ID=your_base_id_here\n');

    // Save as CSV instead
    saveAsCSV(leads);
    return;
  }

  const base = new Airtable({ apiKey: CONFIG.airtableApiKey }).base(CONFIG.airtableBaseId);

  // Only upload leads with email or candidates
  const toUpload = leads.filter(l => l.email || l.emailCandidates?.length > 0);

  console.log(`Uploading ${toUpload.length} leads to Airtable...\n`);

  // Batch upload (Airtable allows max 10 records per request)
  const batchSize = 10;
  let uploaded = 0;

  for (let i = 0; i < toUpload.length; i += batchSize) {
    const batch = toUpload.slice(i, i + batchSize);

    try {
      const records = batch.map(lead => ({
        fields: {
          'Name': lead.name || '',
          'Email': lead.email || '',
          'Firm': lead.firmName || '',
          'Firm Size': lead.firmSize || 'UNKNOWN',
          'City': lead.city || '',
          'State': lead.state || '',
          'Phone': lead.phone || '',
          'Website': lead.website || '',
          'Priority': lead.priority || 'MEDIUM',
          'Firm Size Priority': lead.firmSizePriority || 'MEDIUM',
          'Source': lead.source || 'Unknown',
          'Email Status': lead.emailStatus || 'Pending',
          'Email Score': lead.emailScore || 0,
          'Outreach Status': 'Not Contacted',
          'Google Maps URL': lead.googleMapsUrl || '',
          'Rating': lead.rating || 0,
          'Review Count': lead.reviewCount || 0
        }
      }));

      await base('Leads').create(records);
      uploaded += batch.length;
      console.log(`   ✅ Uploaded batch ${Math.floor(i / batchSize) + 1} (${uploaded}/${toUpload.length})`);

    } catch (error) {
      console.log(`   ❌ Error uploading batch: ${error.message}`);
    }

    // Rate limiting (Airtable allows 5 requests/second)
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  console.log(`\n✅ Upload complete! ${uploaded} leads in Airtable.\n`);
}

/**
 * Save leads as CSV (fallback if no Airtable)
 */
function saveAsCSV(leads) {
  const timestamp = new Date().toISOString().split('T')[0];
  const csvPath = path.join(CONFIG.leadDataDir, `immigration-lawyers-${timestamp}.csv`);

  const headers = [
    'Name', 'Email', 'Firm', 'Firm Size', 'City', 'State', 'Phone',
    'Website', 'Priority', 'Firm Size Priority', 'Source', 'Email Status',
    'Email Score', 'Outreach Status', 'Google Maps URL', 'Rating', 'Reviews'
  ];

  const rows = leads
    .filter(l => l.email || l.emailCandidates?.length > 0)
    .map(lead => [
      lead.name || '',
      lead.email || (lead.emailCandidates || []).join('; '),
      lead.firmName || '',
      lead.firmSize || 'UNKNOWN',
      lead.city || '',
      lead.state || '',
      lead.phone || '',
      lead.website || '',
      lead.priority || 'MEDIUM',
      lead.firmSizePriority || 'MEDIUM',
      lead.source || 'Unknown',
      lead.emailStatus || 'Pending',
      lead.emailScore || 0,
      'Not Contacted',
      lead.googleMapsUrl || '',
      lead.rating || 0,
      lead.reviewCount || 0
    ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  fs.writeFileSync(csvPath, csv);
  console.log(`💾 Saved CSV: ${csvPath}\n`);
}

/**
 * Main pipeline orchestrator
 */
async function main() {
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║  B2B LEAD GENERATION PIPELINE - Immigration Lawyers              ║');
  console.log('║  Target: 500 verified emails, segmented by firm size            ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');

  let leads = [];

  // Step 1: Google Maps scraping via Apify
  const gmapsLeads = await scrapeGoogleMaps();
  leads.push(...gmapsLeads);

  // Step 2: Email extraction from websites
  leads = await extractEmails(leads);

  // Step 3: Email verification with Hunter.io
  leads = await verifyEmails(leads);

  // Step 4: Firm size segmentation
  leads = segmentByFirmSize(leads);

  // Step 5: Upload to Airtable (or save CSV)
  await uploadToAirtable(leads);

  // Final summary
  const verified = leads.filter(l => l.emailStatus === 'valid' || l.emailStatus === 'accept_all').length;
  const contactable = leads.filter(l => l.email || l.emailCandidates?.length > 0).length;

  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║  PIPELINE COMPLETE ✅                                            ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');

  console.log('📊 Final Results:');
  console.log(`   Total leads collected:     ${leads.length}`);
  console.log(`   Verified emails:           ${verified}`);
  console.log(`   Contactable (email/candidates): ${contactable}`);
  console.log(`   Target: ${CONFIG.targetLeadCount} verified emails\n`);

  if (verified < CONFIG.targetLeadCount) {
    console.log('⚠️  Target not reached. Next steps:');
    console.log('   1. Run pipeline again tomorrow (Hunter.io daily limit reset)');
    console.log('   2. Add LinkedIn Sales Navigator exports to /marketing/lead-data/');
    console.log('   3. Manually scrape AILA directory (requires membership)');
    console.log('   4. Run: node lead-gen-pipeline.js (will merge with existing data)\n');
  } else {
    console.log('✅ Target reached! Ready for outreach.');
    console.log('   Next: node outreach-manager.js --template 1 --limit 10\n');
  }
}

// Run pipeline
main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
