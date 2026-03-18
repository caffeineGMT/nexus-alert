#!/usr/bin/env node

/**
 * Google Maps Immigration Lawyer Scraper
 *
 * Scrapes immigration lawyer contact info from Google Maps
 * Target cities: Vancouver, Seattle, Toronto, Buffalo, Blaine, Detroit, San Diego
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_CITIES = [
  'Vancouver, BC',
  'Seattle, WA',
  'Toronto, ON',
  'Buffalo, NY',
  'Blaine, WA',
  'Detroit, MI',
  'San Diego, CA',
  'Niagara Falls, NY',
  'Sweetgrass, MT',
  'Portal, ND'
];

const SEARCH_QUERIES = [
  'immigration lawyer',
  'immigration attorney',
  'immigration law firm'
];

async function scrapeGoogleMaps(city, query, maxResults = 50) {
  console.log(`\n🔍 Scraping: "${query}" in ${city}...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Search Google Maps
    const searchTerm = `${query} ${city}`;
    const encodedSearch = encodeURIComponent(searchTerm);
    const url = `https://www.google.com/maps/search/${encodedSearch}`;

    console.log(`📍 Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Wait for results to load
    await page.waitForSelector('[role="feed"]', { timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Scroll to load more results
    const feedSelector = '[role="feed"]';
    let previousHeight = 0;
    let scrollAttempts = 0;
    const maxScrolls = 10;

    while (scrollAttempts < maxScrolls) {
      const feed = await page.$(feedSelector);
      if (!feed) break;

      // Scroll the feed
      await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        if (element) {
          element.scrollTop = element.scrollHeight;
        }
      }, feedSelector);

      await new Promise(resolve => setTimeout(resolve, 2000));

      const currentHeight = await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        return element ? element.scrollHeight : 0;
      }, feedSelector);

      if (currentHeight === previousHeight) {
        break;
      }

      previousHeight = currentHeight;
      scrollAttempts++;
    }

    console.log('📋 Extracting business data...');

    // Extract business information
    const businesses = await page.evaluate(() => {
      const results = [];
      const items = document.querySelectorAll('[role="feed"] > div > div > a');

      items.forEach((item, index) => {
        try {
          const titleElement = item.querySelector('[role="img"]');
          const name = titleElement?.getAttribute('aria-label') || '';

          // Get the href for detailed page link
          const href = item.getAttribute('href') || '';

          // Extract rating and review count from nearby elements
          const parentDiv = item.closest('div[role="article"]') || item.parentElement;
          const spans = Array.from(parentDiv?.querySelectorAll('span') || []);

          let rating = null;
          let reviewCount = null;
          let address = null;
          let phone = null;
          let website = null;

          // Try to find rating (typically looks like "4.5")
          for (const span of spans) {
            const text = span.textContent?.trim() || '';
            if (/^\d+\.\d+$/.test(text)) {
              rating = text;
            } else if (/\(\d+\)/.test(text)) {
              reviewCount = text.replace(/[()]/g, '');
            }
          }

          if (name) {
            results.push({
              name: name.trim(),
              rating,
              reviewCount,
              googleMapsUrl: href,
              city: '',
              query: '',
              phone: null,
              website: null,
              email: null,
              scrapedAt: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error parsing item:', error.message);
        }
      });

      return results;
    });

    console.log(`✅ Found ${businesses.length} businesses`);

    // Enhance with city and query info
    const enhancedBusinesses = businesses.slice(0, maxResults).map(biz => ({
      ...biz,
      city,
      query
    }));

    return enhancedBusinesses;

  } catch (error) {
    console.error(`❌ Error scraping ${city}:`, error.message);
    return [];
  } finally {
    await browser.close();
  }
}

async function extractDetailsFromBusinessPage(browser, googleMapsUrl) {
  // This would open individual business pages to extract website, phone, etc.
  // Skipping for now to avoid rate limiting - can be done in a second pass
  return {};
}

async function main() {
  console.log('🚀 Starting Google Maps Immigration Lawyer Scraper\n');
  console.log(`📊 Targeting ${TARGET_CITIES.length} cities`);
  console.log(`🔎 Using ${SEARCH_QUERIES.length} search queries\n`);

  const allLeads = [];

  for (const city of TARGET_CITIES) {
    for (const query of SEARCH_QUERIES) {
      const results = await scrapeGoogleMaps(city, query, 30);
      allLeads.push(...results);

      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Deduplicate by business name
  const uniqueLeads = Array.from(
    new Map(allLeads.map(lead => [lead.name.toLowerCase(), lead])).values()
  );

  console.log(`\n📈 Total unique businesses found: ${uniqueLeads.length}`);

  // Save to file
  const outputDir = path.join(__dirname, '..', 'lead-data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().split('T')[0];
  const outputFile = path.join(outputDir, `google-maps-leads-${timestamp}.json`);

  fs.writeFileSync(outputFile, JSON.stringify(uniqueLeads, null, 2));
  console.log(`\n💾 Saved to: ${outputFile}`);

  // Also save as CSV
  const csvFile = path.join(outputDir, `google-maps-leads-${timestamp}.csv`);
  const csvHeader = 'Name,City,Query,Rating,Review Count,Google Maps URL,Scraped At\n';
  const csvRows = uniqueLeads.map(lead =>
    `"${lead.name}","${lead.city}","${lead.query}","${lead.rating || ''}","${lead.reviewCount || ''}","${lead.googleMapsUrl}","${lead.scrapedAt}"`
  ).join('\n');

  fs.writeFileSync(csvFile, csvHeader + csvRows);
  console.log(`💾 Saved to: ${csvFile}`);

  console.log('\n✅ Scraping complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Run scrape-avvo.js to get more leads');
  console.log('   2. Run enrich-leads.js to find websites and emails');
  console.log('   3. Run verify-emails.js to validate email addresses');
}

main().catch(console.error);
