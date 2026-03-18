#!/usr/bin/env node

/**
 * LinkedIn Sales Navigator Import
 *
 * Imports leads from LinkedIn Sales Navigator CSV export
 * Usage: node linkedin-import.js path/to/export.csv
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseLinkedInCSV(csvPath) {
  console.log('📥 Importing LinkedIn Sales Navigator export...\n');

  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.split('\n').filter(l => l.trim());

  if (lines.length < 2) {
    throw new Error('CSV file is empty or invalid');
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const leads = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    // LinkedIn Sales Navigator typically exports these columns:
    // First Name, Last Name, Title, Company, Location, LinkedIn URL, Email (if available)

    const lead = {
      source: 'LinkedIn Sales Navigator',
      name: `${row['First Name'] || ''} ${row['Last Name'] || ''}`.trim(),
      firmName: row['Company'] || row['Current Company'] || '',
      title: row['Title'] || row['Current Title'] || '',
      location: row['Location'] || '',
      linkedInUrl: row['LinkedIn URL'] || row['Profile URL'] || '',
      email: row['Email'] || null,
      phone: row['Phone'] || null,
      scrapedAt: new Date().toISOString(),
      priority: 'MEDIUM'
    };

    // Parse location into city/state
    if (lead.location) {
      const parts = lead.location.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        lead.city = parts[0];
        lead.state = parts[1];
      }
    }

    // Set priority based on title
    if (lead.title) {
      const title = lead.title.toLowerCase();
      if (title.includes('partner') || title.includes('owner') || title.includes('founder')) {
        lead.priority = 'VERY HIGH';
      } else if (title.includes('attorney') || title.includes('lawyer')) {
        lead.priority = 'HIGH';
      }
    }

    leads.push(lead);
  }

  console.log(`✅ Imported ${leads.length} leads from LinkedIn\n`);

  // Stats
  const withEmail = leads.filter(l => l.email).length;
  const partners = leads.filter(l => l.title?.toLowerCase().includes('partner')).length;

  console.log('📊 LinkedIn Import Summary:');
  console.log(`   Total leads: ${leads.length}`);
  console.log(`   With email: ${withEmail} (${Math.round(withEmail/leads.length*100)}%)`);
  console.log(`   Partners/Owners: ${partners}\n`);

  return leads;
}

function main() {
  const csvPath = process.argv[2];

  if (!csvPath) {
    console.error('❌ Error: No CSV file specified\n');
    console.log('Usage: node linkedin-import.js path/to/export.csv\n');
    console.log('Steps to export from LinkedIn Sales Navigator:');
    console.log('  1. Go to Sales Navigator: https://www.linkedin.com/sales/');
    console.log('  2. Search: "Immigration Lawyer" OR "Immigration Attorney"');
    console.log('  3. Location filter: Add your target cities');
    console.log('  4. Click "Save search" → "Export" → Download CSV');
    console.log('  5. Run this script with the downloaded CSV path\n');
    process.exit(1);
  }

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ Error: File not found: ${csvPath}\n`);
    process.exit(1);
  }

  try {
    const leads = parseLinkedInCSV(csvPath);

    // Merge with existing lead data
    const leadDataDir = path.join(__dirname, '..', 'lead-data');
    if (!fs.existsSync(leadDataDir)) {
      fs.mkdirSync(leadDataDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const outputPath = path.join(leadDataDir, `linkedin-leads-${timestamp}.json`);

    fs.writeFileSync(outputPath, JSON.stringify(leads, null, 2));

    console.log(`💾 Saved to: ${outputPath}`);
    console.log('\n📝 Next Steps:');
    console.log('   1. Run: node lead-gen-pipeline.js (will merge all lead sources)');
    console.log('   2. Or run: node enrich-leads.js (add emails and websites)\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
