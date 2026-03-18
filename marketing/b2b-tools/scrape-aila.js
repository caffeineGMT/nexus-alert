/**
 * AILA Directory Scraper
 * Scrapes American Immigration Lawyers Association member directory
 * Target: 200+ immigration lawyers near NEXUS enrollment centers
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target cities near major NEXUS enrollment centers
const TARGET_CITIES = [
  { city: 'Vancouver', state: 'BC', country: 'Canada' },
  { city: 'Seattle', state: 'WA', country: 'USA' },
  { city: 'Bellingham', state: 'WA', country: 'USA' },
  { city: 'Blaine', state: 'WA', country: 'USA' },
  { city: 'Toronto', state: 'ON', country: 'Canada' },
  { city: 'Buffalo', state: 'NY', country: 'USA' },
  { city: 'Detroit', state: 'MI', country: 'USA' },
  { city: 'San Diego', state: 'CA', country: 'USA' },
  { city: 'Niagara Falls', state: 'NY', country: 'USA' },
  { city: 'Burlington', state: 'VT', country: 'USA' }
];

const DELAY_MS = 2000;
const MAX_LEADS_PER_CITY = 25;

async function scrapeAILA() {
  console.log('🚀 Starting AILA Directory Scraper');
  console.log(`Target: ${TARGET_CITIES.length} cities × ~${MAX_LEADS_PER_CITY} lawyers = ~${TARGET_CITIES.length * MAX_LEADS_PER_CITY} leads\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const allLeads = [];

  try {
    for (const location of TARGET_CITIES) {
      console.log(`\n📍 Scraping ${location.city}, ${location.state}...`);

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');

      try {
        // AILA Lawyer Referral Service search
        // Note: AILA requires membership to access full directory
        // Alternative approach: Use public profiles and Google search
        const searchQuery = `immigration lawyer ${location.city} ${location.state} AILA member`;
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&num=50`;

        await page.goto(googleSearchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        await page.waitForTimeout(DELAY_MS);

        // Extract search results
        const searchResults = await page.evaluate(() => {
          const results = [];
          const searchItems = document.querySelectorAll('div.g');

          searchItems.forEach(item => {
            const titleElement = item.querySelector('h3');
            const linkElement = item.querySelector('a');
            const snippetElement = item.querySelector('.VwiC3b, .yXK7lf');

            if (titleElement && linkElement) {
              const title = titleElement.textContent;
              const url = linkElement.href;
              const snippet = snippetElement ? snippetElement.textContent : '';

              // Filter for relevant results (law firms, lawyers)
              if (
                (title.toLowerCase().includes('immigration') ||
                 snippet.toLowerCase().includes('immigration')) &&
                (title.toLowerCase().includes('law') ||
                 title.toLowerCase().includes('attorney') ||
                 title.toLowerCase().includes('lawyer'))
              ) {
                results.push({ title, url, snippet });
              }
            }
          });

          return results;
        });

        console.log(`  Found ${searchResults.length} potential leads`);

        // Process each result to extract firm details
        for (let i = 0; i < Math.min(searchResults.length, MAX_LEADS_PER_CITY); i++) {
          const result = searchResults[i];

          try {
            // Extract firm name from title
            const firmName = result.title
              .replace(/\s*-\s*Immigration.*$/i, '')
              .replace(/\s*\|.*$/i, '')
              .trim();

            // Try to extract contact info from snippet
            const emailMatch = result.snippet.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
            const phoneMatch = result.snippet.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);

            const lead = {
              source: 'AILA',
              firmName: firmName,
              website: result.url,
              city: location.city,
              state: location.state,
              country: location.country,
              email: emailMatch ? emailMatch[0] : null,
              phone: phoneMatch ? phoneMatch[0] : null,
              snippet: result.snippet,
              scrapedAt: new Date().toISOString(),
              priority: calculatePriority(location.city, firmName)
            };

            allLeads.push(lead);
          } catch (err) {
            console.log(`    ⚠️  Error processing result: ${err.message}`);
          }

          await page.waitForTimeout(500); // Avoid rate limiting
        }

      } catch (err) {
        console.log(`  ❌ Error scraping ${location.city}: ${err.message}`);
      } finally {
        await page.close();
      }

      // Delay between cities
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }

  } finally {
    await browser.close();
  }

  // Save results
  const timestamp = new Date().toISOString().split('T')[0];
  const outputPath = path.join(__dirname, '..', 'lead-data', `aila-leads-${timestamp}.json`);

  // Create lead-data directory if it doesn't exist
  const leadDataDir = path.join(__dirname, '..', 'lead-data');
  if (!fs.existsSync(leadDataDir)) {
    fs.mkdirSync(leadDataDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(allLeads, null, 2));

  console.log('\n✅ AILA Scraping Complete!');
  console.log(`   Total leads: ${allLeads.length}`);
  console.log(`   Output: ${outputPath}`);
  console.log(`\n📊 Next Steps:`);
  console.log(`   1. Run: node enrich-leads.js (add email addresses)`);
  console.log(`   2. Run: node verify-emails.js (validate emails)`);
  console.log(`   3. Run: node email-campaign.js --live (start outreach)\n`);

  return allLeads;
}

function calculatePriority(city, firmName) {
  // Higher priority for major cities and larger firms
  const majorCities = ['Vancouver', 'Toronto', 'Seattle', 'San Diego'];
  const largefirmKeywords = ['LLP', 'PC', 'Group', 'Associates'];

  let priority = 'MEDIUM';

  if (majorCities.includes(city)) {
    priority = 'HIGH';
  }

  if (largefirmKeywords.some(keyword => firmName.includes(keyword))) {
    priority = priority === 'HIGH' ? 'VERY HIGH' : 'HIGH';
  }

  return priority;
}

// Run scraper
scrapeAILA().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
