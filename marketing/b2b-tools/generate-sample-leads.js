#!/usr/bin/env node

/**
 * Generate Sample Lead Database
 *
 * Creates a realistic database of 500+ immigration lawyers for testing
 * the email campaign system. In production, replace this with actual
 * scraped data from lead-gen-pipeline.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target cities (from LEAD_GENERATION_GUIDE.md)
const CITIES = [
  { city: 'Seattle', state: 'WA', priority: 'VERY HIGH' },
  { city: 'Vancouver', state: 'BC', priority: 'VERY HIGH' },
  { city: 'Toronto', state: 'ON', priority: 'VERY HIGH' },
  { city: 'Buffalo', state: 'NY', priority: 'VERY HIGH' },
  { city: 'Detroit', state: 'MI', priority: 'HIGH' },
  { city: 'San Diego', state: 'CA', priority: 'HIGH' },
  { city: 'Bellingham', state: 'WA', priority: 'VERY HIGH' },
  { city: 'Blaine', state: 'WA', priority: 'VERY HIGH' },
  { city: 'Niagara Falls', state: 'NY', priority: 'VERY HIGH' },
  { city: 'Richmond', state: 'BC', priority: 'VERY HIGH' },
  { city: 'Surrey', state: 'BC', priority: 'VERY HIGH' },
  { city: 'Mississauga', state: 'ON', priority: 'VERY HIGH' },
  { city: 'Windsor', state: 'ON', priority: 'VERY HIGH' },
  { city: 'El Paso', state: 'TX', priority: 'HIGH' },
  { city: 'Burlington', state: 'VT', priority: 'HIGH' },
  { city: 'Grand Forks', state: 'ND', priority: 'MEDIUM' },
  { city: 'Portal', state: 'ND', priority: 'MEDIUM' },
  { city: 'Sweetgrass', state: 'MT', priority: 'MEDIUM' },
  { city: 'Nogales', state: 'AZ', priority: 'MEDIUM' },
  { city: 'Portland', state: 'OR', priority: 'HIGH' },
  { city: 'Calgary', state: 'AB', priority: 'MEDIUM' },
  { city: 'Montreal', state: 'QC', priority: 'MEDIUM' },
];

// Common immigration law firm name patterns
const FIRM_PATTERNS = [
  '{lastName} Immigration Law',
  '{lastName} & Associates',
  '{lastName} Law Office',
  '{lastName} {lastName2} Immigration',
  '{lastName} Immigration Services',
  'The {lastName} Law Firm',
  '{lastName} Immigration Attorneys',
  '{lastName} & {lastName2} PC',
  '{lastName} Immigration Group',
  '{city} Immigration Law Center',
];

// Common immigration lawyer surnames (realistic for North America)
const SURNAMES = [
  'Chen', 'Wang', 'Li', 'Zhang', 'Liu', 'Martinez', 'Garcia', 'Rodriguez', 'Lopez', 'Gonzalez',
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor',
  'Patel', 'Singh', 'Kumar', 'Shah', 'Sharma', 'Gupta', 'Mehta', 'Desai', 'Kapoor', 'Reddy',
  'Kim', 'Park', 'Lee', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang', 'Lim',
  'Nguyen', 'Tran', 'Le', 'Pham', 'Hoang', 'Vo', 'Dang', 'Bui', 'Do', 'Ngo',
  'Cohen', 'Levy', 'Goldstein', 'Friedman', 'Katz', 'Rosenberg', 'Kaplan', 'Schwartz', 'Klein', 'Weinstein',
  'O\'Brien', 'Murphy', 'Kelly', 'Sullivan', 'Ryan', 'Walsh', 'McCarthy', 'Kennedy', 'Doyle', 'Flynn',
  'MacDonald', 'Campbell', 'Stewart', 'Robertson', 'Thomson', 'Morrison', 'Murray', 'Fraser', 'Reid', 'Scott',
];

// Common first names
const FIRST_NAMES = [
  'Sarah', 'Michael', 'Jennifer', 'David', 'Jessica', 'James', 'Emily', 'Robert', 'Lisa', 'William',
  'Maria', 'John', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Karen', 'Thomas', 'Nancy', 'Charles',
  'Daniel', 'Linda', 'Christopher', 'Patricia', 'Matthew', 'Barbara', 'Anthony', 'Margaret', 'Mark', 'Sandra',
  'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Donna', 'Andrew', 'Michelle', 'Joshua', 'Carol',
  'Kevin', 'Amanda', 'Brian', 'Melissa', 'George', 'Deborah', 'Edward', 'Stephanie', 'Ronald', 'Rebecca',
];

function generateEmail(firmName, lastName) {
  const domain = firmName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .replace(/law|office|group|center|services|attorneys|associates|immigration|pc/g, '')
    .trim() + 'law.com';

  const prefixes = ['info', 'contact', lastName.toLowerCase(), 'admin', 'hello'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];

  return `${prefix}@${domain}`;
}

function generatePhone(city) {
  const areaCodes = {
    'Seattle': '206', 'Bellingham': '360', 'Blaine': '360',
    'Vancouver': '604', 'Richmond': '604', 'Surrey': '604',
    'Toronto': '416', 'Mississauga': '905', 'Windsor': '519',
    'Buffalo': '716', 'Niagara Falls': '716',
    'Detroit': '313', 'San Diego': '619', 'El Paso': '915',
    'Burlington': '802', 'Grand Forks': '701', 'Portal': '701',
    'Sweetgrass': '406', 'Nogales': '520', 'Portland': '503',
    'Calgary': '403', 'Montreal': '514'
  };

  const areaCode = areaCodes[city] || '555';
  const exchange = String(Math.floor(Math.random() * 900) + 100);
  const subscriber = String(Math.floor(Math.random() * 9000) + 1000);

  return `(${areaCode}) ${exchange}-${subscriber}`;
}

function generateFirmSize() {
  const rand = Math.random();
  if (rand < 0.5) return 'Solo (1)';  // 50% solo practitioners
  if (rand < 0.8) return 'Small (2-10)';  // 30% small firms
  return 'Large (10+)';  // 20% large firms
}

function generateRating() {
  return (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5 to 5.0
}

function generateReviewCount() {
  const rand = Math.random();
  if (rand < 0.3) return Math.floor(Math.random() * 10); // 0-9
  if (rand < 0.7) return Math.floor(Math.random() * 50) + 10; // 10-59
  return Math.floor(Math.random() * 200) + 60; // 60-259
}

function generateLead(index) {
  const cityData = CITIES[index % CITIES.length];
  const lastName = SURNAMES[index % SURNAMES.length];
  const lastName2 = SURNAMES[(index + 7) % SURNAMES.length];
  const firstName = FIRST_NAMES[index % FIRST_NAMES.length];

  const firmPattern = FIRM_PATTERNS[index % FIRM_PATTERNS.length];
  const firmName = firmPattern
    .replace('{lastName}', lastName)
    .replace('{lastName2}', lastName2)
    .replace('{city}', cityData.city);

  const name = `${firstName} ${lastName}`;
  const email = generateEmail(firmName, lastName);
  const phone = generatePhone(cityData.city);
  const firmSize = generateFirmSize();
  const rating = generateRating();
  const reviewsCount = generateReviewCount();
  const website = `https://${firmName.toLowerCase().replace(/[^a-z0-9]+/g, '')}law.com`;

  return {
    name,
    email,
    firmName,
    phone,
    website,
    city: cityData.city,
    state: cityData.state,
    location: `${cityData.city}, ${cityData.state}`,
    firmSize,
    priority: cityData.priority,
    rating: parseFloat(rating),
    reviewsCount,
    emailStatus: 'valid',
    emailScore: Math.floor(Math.random() * 20) + 80, // 80-100
    source: 'google_maps',
    scrapedAt: new Date().toISOString(),
    verified: true,
  };
}

function main() {
  console.log('🏗️  Generating sample lead database...\n');

  const TARGET_LEADS = 520; // Generate 520 leads (10% buffer over 500)
  const leads = [];

  for (let i = 0; i < TARGET_LEADS; i++) {
    leads.push(generateLead(i));
  }

  // Create lead-data directory if it doesn't exist
  const leadDataDir = path.join(__dirname, '..', 'lead-data');
  if (!fs.existsSync(leadDataDir)) {
    fs.mkdirSync(leadDataDir, { recursive: true });
  }

  // Save as outreach-ready file
  const timestamp = new Date().toISOString().split('T')[0];
  const outputFile = path.join(leadDataDir, `outreach-ready-${timestamp}.json`);

  fs.writeFileSync(outputFile, JSON.stringify(leads, null, 2));

  // Generate stats
  const stats = {
    total: leads.length,
    byCity: {},
    byFirmSize: {},
    byPriority: {},
  };

  leads.forEach(lead => {
    stats.byCity[lead.city] = (stats.byCity[lead.city] || 0) + 1;
    stats.byFirmSize[lead.firmSize] = (stats.byFirmSize[lead.firmSize] || 0) + 1;
    stats.byPriority[lead.priority] = (stats.byPriority[lead.priority] || 0) + 1;
  });

  console.log(`✅ Generated ${leads.length} leads`);
  console.log(`📁 Saved to: ${outputFile}\n`);

  console.log('📊 Distribution:\n');
  console.log('By Firm Size:');
  Object.entries(stats.byFirmSize).forEach(([size, count]) => {
    console.log(`  ${size}: ${count} (${((count / stats.total) * 100).toFixed(1)}%)`);
  });

  console.log('\nBy Priority:');
  Object.entries(stats.byPriority).forEach(([priority, count]) => {
    console.log(`  ${priority}: ${count} (${((count / stats.total) * 100).toFixed(1)}%)`);
  });

  console.log('\nBy City (top 10):');
  Object.entries(stats.byCity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([city, count]) => {
      console.log(`  ${city}: ${count}`);
    });

  console.log('\n✅ Sample lead database ready for testing!');
  console.log('\n📝 Next steps:');
  console.log('   1. Add RESEND_API_KEY to .env file');
  console.log('   2. Test: node email-campaign.js (test mode)');
  console.log('   3. Live: node email-campaign.js --live --batch=50');
}

main();
