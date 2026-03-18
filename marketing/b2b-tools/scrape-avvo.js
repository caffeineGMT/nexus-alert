#!/usr/bin/env node

/**
 * Avvo Immigration Lawyer Scraper
 *
 * Scrapes immigration lawyer profiles from Avvo.com
 * Avvo is a legal directory with detailed attorney profiles
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_LOCATIONS = [
  'vancouver-bc',
  'seattle-wa',
  'toronto-on',
  'buffalo-ny',
  'blaine-wa',
  'detroit-mi',
  'san-diego-ca',
  'niagara-falls-ny'
];

async function scrapeAvvoLocation(location, maxPages = 5) {
  console.log(`\n🔍 Scraping Avvo: ${location}...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const allLawyers = [];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const url = `https://www.avvo.com/immigration-lawyer/${location}.html?page=${pageNum}`;
      console.log(`📄 Page ${pageNum}: ${url}`);

      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Extract lawyer data
        const lawyers = await page.evaluate(() => {
          const results = [];

          // Avvo typically shows lawyer cards in search results
          const lawyerCards = document.querySelectorAll('[data-testid="search-result-lawyer-card"], .search-result-lawyer-card, .lawyer-card');

          lawyerCards.forEach(card => {
            try {
              const nameElement = card.querySelector('a[data-testid="lawyer-name"], .lawyer-name a, h3 a, h2 a');
              const name = nameElement?.textContent?.trim() || '';
              const profileUrl = nameElement?.getAttribute('href') || '';

              const firmElement = card.querySelector('[data-testid="law-firm-name"], .law-firm-name');
              const firmName = firmElement?.textContent?.trim() || '';

              const ratingElement = card.querySelector('[data-testid="rating"], .rating');
              const rating = ratingElement?.textContent?.trim() || '';

              const locationElement = card.querySelector('[data-testid="location"], .location');
              const address = locationElement?.textContent?.trim() || '';

              const phoneElement = card.querySelector('[data-testid="phone"], .phone, a[href^="tel:"]');
              const phone = phoneElement?.textContent?.trim() || phoneElement?.getAttribute('href')?.replace('tel:', '') || null;

              const websiteElement = card.querySelector('[data-testid="website"], a[href*="website"]');
              const website = websiteElement?.getAttribute('href') || null;

              if (name) {
                results.push({
                  name,
                  firmName,
                  rating,
                  address,
                  phone,
                  website,
                  avvoProfileUrl: profileUrl ? `https://www.avvo.com${profileUrl}` : null,
                  scrapedAt: new Date().toISOString()
                });
              }
            } catch (error) {
              console.error('Error parsing lawyer card:', error.message);
            }
          });

          return results;
        });

        console.log(`   ✅ Found ${lawyers.length} lawyers on page ${pageNum}`);
        allLawyers.push(...lawyers.map(lawyer => ({ ...lawyer, location })));

        // Check if there's a next page
        const hasNextPage = await page.evaluate(() => {
          const nextButton = document.querySelector('a[rel="next"], .pagination-next, button:has-text("Next")');
          return nextButton && !nextButton.hasAttribute('disabled');
        });

        if (!hasNextPage && lawyers.length === 0) {
          console.log('   ℹ️  No more results, stopping...');
          break;
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 3000));

      } catch (error) {
        console.error(`   ❌ Error on page ${pageNum}:`, error.message);
        break;
      }
    }

  } catch (error) {
    console.error(`❌ Error scraping ${location}:`, error.message);
  } finally {
    await browser.close();
  }

  return allLawyers;
}

async function main() {
  console.log('🚀 Starting Avvo Immigration Lawyer Scraper\n');
  console.log(`📊 Targeting ${TARGET_LOCATIONS.length} locations\n`);

  const allLeads = [];

  for (const location of TARGET_LOCATIONS) {
    const results = await scrapeAvvoLocation(location, 3);
    allLeads.push(...results);

    // Delay between locations
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  // Deduplicate by name
  const uniqueLeads = Array.from(
    new Map(allLeads.map(lead => [lead.name.toLowerCase(), lead])).values()
  );

  console.log(`\n📈 Total unique lawyers found: ${uniqueLeads.length}`);

  // Save to file
  const outputDir = path.join(__dirname, '..', 'lead-data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().split('T')[0];
  const outputFile = path.join(outputDir, `avvo-leads-${timestamp}.json`);

  fs.writeFileSync(outputFile, JSON.stringify(uniqueLeads, null, 2));
  console.log(`\n💾 Saved to: ${outputFile}`);

  // Also save as CSV
  const csvFile = path.join(outputDir, `avvo-leads-${timestamp}.csv`);
  const csvHeader = 'Name,Firm Name,Location,Rating,Address,Phone,Website,Avvo Profile,Scraped At\n';
  const csvRows = uniqueLeads.map(lead =>
    `"${lead.name}","${lead.firmName || ''}","${lead.location}","${lead.rating || ''}","${lead.address || ''}","${lead.phone || ''}","${lead.website || ''}","${lead.avvoProfileUrl || ''}","${lead.scrapedAt}"`
  ).join('\n');

  fs.writeFileSync(csvFile, csvHeader + csvRows);
  console.log(`💾 Saved to: ${csvFile}`);

  console.log('\n✅ Scraping complete!');
}

main().catch(console.error);
