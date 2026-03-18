#!/usr/bin/env node

/**
 * Lead Enrichment Tool
 *
 * Takes scraped lawyer data and enriches it with:
 * - Website URLs (by visiting Google Maps listing or searching)
 * - Email addresses (pattern matching from website)
 * - Social media profiles
 */

import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Common email patterns for law firms
const EMAIL_PATTERNS = [
  '{first}.{last}@{domain}',
  '{first}{last}@{domain}',
  '{first}@{domain}',
  '{last}@{domain}',
  'info@{domain}',
  'contact@{domain}',
  'admin@{domain}'
];

function extractDomainFromUrl(url) {
  if (!url) return null;
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return domain;
  } catch {
    return null;
  }
}

function generateEmailCandidates(name, domain) {
  if (!name || !domain) return [];

  const parts = name.toLowerCase().split(' ').filter(Boolean);
  if (parts.length < 2) return [`info@${domain}`, `contact@${domain}`];

  const first = parts[0];
  const last = parts[parts.length - 1];

  return EMAIL_PATTERNS.map(pattern =>
    pattern
      .replace('{first}', first)
      .replace('{last}', last)
      .replace('{domain}', domain)
  );
}

async function scrapeWebsiteForEmails(websiteUrl) {
  try {
    console.log(`   🔎 Checking website: ${websiteUrl}`);

    const response = await fetch(websiteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // Look for email addresses in the HTML
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const bodyText = $('body').text();
    const foundEmails = bodyText.match(emailRegex) || [];

    // Filter out common false positives
    const validEmails = foundEmails.filter(email =>
      !email.includes('example.com') &&
      !email.includes('domain.com') &&
      !email.includes('wix.com') &&
      !email.includes('wordpress.com') &&
      !email.includes('gmail.com') &&
      !email.includes('@2x.png')
    );

    // Look for contact page links
    const contactLinks = [];
    $('a[href*="contact"]').each((i, el) => {
      const href = $(el).attr('href');
      if (href) contactLinks.push(href);
    });

    return {
      emails: [...new Set(validEmails)],
      contactLinks,
      hasContactPage: contactLinks.length > 0
    };

  } catch (error) {
    console.log(`   ⚠️  Failed to fetch website: ${error.message}`);
    return { emails: [], contactLinks: [], hasContactPage: false };
  }
}

async function enrichLead(lead, browser) {
  console.log(`\n📝 Enriching: ${lead.name}`);

  const enriched = { ...lead };

  // If we have a Google Maps URL, try to extract website from there
  if (lead.googleMapsUrl && !lead.website) {
    try {
      const page = await browser.newPage();
      await page.goto(lead.googleMapsUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Extract website from Google Maps page
      const websiteUrl = await page.evaluate(() => {
        const websiteButton = Array.from(document.querySelectorAll('a')).find(a =>
          a.getAttribute('data-item-id') === 'authority' ||
          a.textContent?.includes('Website') ||
          a.href?.includes('maps/url')
        );
        return websiteButton?.getAttribute('href') || null;
      });

      if (websiteUrl) {
        enriched.website = websiteUrl;
        console.log(`   ✅ Found website: ${websiteUrl}`);
      }

      // Extract phone if not already present
      if (!enriched.phone) {
        const phone = await page.evaluate(() => {
          const phoneButton = Array.from(document.querySelectorAll('button, div')).find(el =>
            el.textContent?.match(/\(\d{3}\)\s?\d{3}-\d{4}/)
          );
          return phoneButton?.textContent?.trim() || null;
        });

        if (phone) {
          enriched.phone = phone;
          console.log(`   ✅ Found phone: ${phone}`);
        }
      }

      await page.close();

    } catch (error) {
      console.log(`   ⚠️  Couldn't extract from Google Maps: ${error.message}`);
    }
  }

  // Scrape website for emails
  if (enriched.website) {
    const { emails, hasContactPage } = await scrapeWebsiteForEmails(enriched.website);

    if (emails.length > 0) {
      enriched.email = emails[0]; // Take the first one
      enriched.allEmailsFound = emails;
      console.log(`   ✅ Found email: ${enriched.email}`);
    }

    // Generate email candidates based on name + domain
    const domain = extractDomainFromUrl(enriched.website);
    if (domain && !enriched.email) {
      enriched.emailCandidates = generateEmailCandidates(lead.name, domain);
      console.log(`   💡 Generated ${enriched.emailCandidates.length} email candidates`);
    }
  }

  // Add enrichment metadata
  enriched.enrichedAt = new Date().toISOString();
  enriched.enrichmentComplete = !!(enriched.website && (enriched.email || enriched.emailCandidates));

  return enriched;
}

async function main() {
  console.log('🚀 Starting Lead Enrichment Tool\n');

  // Find most recent scraped data files
  const leadDataDir = path.join(__dirname, '..', 'lead-data');
  const files = fs.readdirSync(leadDataDir).filter(f => f.endsWith('.json'));

  if (files.length === 0) {
    console.error('❌ No lead files found. Run scrape-google-maps.js or scrape-avvo.js first.');
    process.exit(1);
  }

  console.log(`📂 Found ${files.length} lead file(s)`);

  // Merge all leads
  const allLeads = [];
  files.forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(leadDataDir, file), 'utf8'));
    allLeads.push(...data);
  });

  console.log(`📊 Total leads to enrich: ${allLeads.length}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const enrichedLeads = [];

  for (let i = 0; i < allLeads.length; i++) {
    const lead = allLeads[i];
    console.log(`[${i + 1}/${allLeads.length}]`);

    const enriched = await enrichLead(lead, browser);
    enrichedLeads.push(enriched);

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Save progress every 10 leads
    if ((i + 1) % 10 === 0) {
      const progressFile = path.join(leadDataDir, 'enriched-leads-progress.json');
      fs.writeFileSync(progressFile, JSON.stringify(enrichedLeads, null, 2));
      console.log(`\n💾 Progress saved (${i + 1}/${allLeads.length})\n`);
    }
  }

  await browser.close();

  // Stats
  const withWebsite = enrichedLeads.filter(l => l.website).length;
  const withEmail = enrichedLeads.filter(l => l.email).length;
  const withCandidates = enrichedLeads.filter(l => l.emailCandidates?.length > 0).length;

  console.log('\n📈 Enrichment Stats:');
  console.log(`   Total leads: ${enrichedLeads.length}`);
  console.log(`   With website: ${withWebsite} (${Math.round(withWebsite/enrichedLeads.length*100)}%)`);
  console.log(`   With verified email: ${withEmail} (${Math.round(withEmail/enrichedLeads.length*100)}%)`);
  console.log(`   With email candidates: ${withCandidates} (${Math.round(withCandidates/enrichedLeads.length*100)}%)`);

  // Save final results
  const timestamp = new Date().toISOString().split('T')[0];
  const outputFile = path.join(leadDataDir, `enriched-leads-${timestamp}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(enrichedLeads, null, 2));

  console.log(`\n💾 Saved to: ${outputFile}`);

  // Save ready-to-email list (leads with email or candidates)
  const readyToEmail = enrichedLeads.filter(l => l.email || l.emailCandidates?.length > 0);
  const emailListFile = path.join(leadDataDir, `email-list-${timestamp}.csv`);

  const csvHeader = 'Name,Firm,City,Email,Email Candidates,Website,Phone,Source\n';
  const csvRows = readyToEmail.map(lead => {
    const source = lead.avvoProfileUrl ? 'Avvo' : 'Google Maps';
    const candidates = (lead.emailCandidates || []).join('; ');
    return `"${lead.name}","${lead.firmName || ''}","${lead.city || lead.location || ''}","${lead.email || ''}","${candidates}","${lead.website || ''}","${lead.phone || ''}","${source}"`;
  }).join('\n');

  fs.writeFileSync(emailListFile, csvHeader + csvRows);
  console.log(`💾 Email list saved to: ${emailListFile}`);
  console.log(`\n✅ Enrichment complete! ${readyToEmail.length} leads ready for outreach.`);

  console.log('\n📝 Next steps:');
  console.log('   1. Run verify-emails.js to validate email addresses with Hunter.io');
  console.log('   2. Run email-campaign.js to start the cold email sequence');
}

main().catch(console.error);
