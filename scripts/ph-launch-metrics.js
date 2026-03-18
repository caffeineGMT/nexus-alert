#!/usr/bin/env node

/**
 * Product Hunt Launch Metrics Tracker
 *
 * Real-time metrics dashboard for Product Hunt launch day.
 * Tracks upvotes, ranking, installs, and conversions.
 *
 * Usage:
 *   node scripts/ph-launch-metrics.js
 *
 * Environment Variables:
 *   STRIPE_SECRET_KEY - Stripe API key for conversion tracking
 *   PRODUCT_HUNT_POST_ID - PH post ID (e.g., "nexus-alert")
 */

const https = require('https');

// ─────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────

const CONFIG = {
  PRODUCT_HUNT_POST_ID: process.env.PRODUCT_HUNT_POST_ID || 'nexus-alert',
  CHROME_EXTENSION_ID: process.env.CHROME_EXTENSION_ID || 'YOUR_EXTENSION_ID',
  REFRESH_INTERVAL: 10 * 60 * 1000, // 10 minutes

  // Target metrics
  TARGETS: {
    upvotes: 500,
    ranking: 5,
    chromeInstalls: 500,
    premiumSignups: 50,
    emailSignups: 200,
  },
};

// ─────────────────────────────────────────────────────────
// Metrics Storage
// ─────────────────────────────────────────────────────────

let metrics = {
  timestamp: new Date().toISOString(),
  productHunt: {
    upvotes: 0,
    ranking: 0,
    comments: 0,
  },
  chrome: {
    installs: 0,
  },
  stripe: {
    premiumSignups: 0,
    promoCodeRedemptions: 0,
    revenue: 0,
  },
  website: {
    emailSignups: 0,
    pageViews: 0,
  },
};

// ─────────────────────────────────────────────────────────
// Console Formatting
// ─────────────────────────────────────────────────────────

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function clearScreen() {
  process.stdout.write('\x1Bc');
}

// ─────────────────────────────────────────────────────────
// Data Fetchers
// ─────────────────────────────────────────────────────────

async function fetchProductHuntMetrics() {
  // NOTE: Product Hunt doesn't have a public API for real-time upvotes
  // You'll need to manually update these or use a scraper

  log('⚠️  Product Hunt metrics require manual entry (no public API)', 'yellow');
  log('   Update metrics.productHunt manually in this script', 'yellow');

  return {
    upvotes: metrics.productHunt.upvotes, // Update manually
    ranking: metrics.productHunt.ranking, // Update manually
    comments: metrics.productHunt.comments, // Update manually
  };
}

async function fetchChromeWebStoreInstalls() {
  // NOTE: Chrome Web Store doesn't expose install counts via API
  // Check Developer Dashboard manually

  log('⚠️  Chrome installs require Developer Dashboard check', 'yellow');
  log('   Visit: https://chrome.google.com/webstore/developer/dashboard', 'yellow');

  return {
    installs: metrics.chrome.installs, // Update manually
  };
}

async function fetchStripeMetrics() {
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    log('⚠️  STRIPE_SECRET_KEY not set, skipping Stripe metrics', 'yellow');
    return metrics.stripe;
  }

  try {
    // Fetch recent subscriptions from last 24 hours
    const now = Math.floor(Date.now() / 1000);
    const oneDayAgo = now - (24 * 60 * 60);

    // Use Stripe API to fetch subscriptions
    // NOTE: This is a simplified example - implement full Stripe API call

    return {
      premiumSignups: 0, // Fetch from Stripe
      promoCodeRedemptions: 0, // Count subscriptions with "PRODUCTHUNT" metadata
      revenue: 0, // Sum of subscription amounts
    };
  } catch (error) {
    log(`Error fetching Stripe metrics: ${error.message}`, 'red');
    return metrics.stripe;
  }
}

async function fetchWebsiteMetrics() {
  // NOTE: Requires Google Analytics API or backend API
  log('⚠️  Website metrics require Google Analytics API', 'yellow');

  return {
    emailSignups: metrics.website.emailSignups,
    pageViews: metrics.website.pageViews,
  };
}

// ─────────────────────────────────────────────────────────
// Dashboard Display
// ─────────────────────────────────────────────────────────

function displayDashboard() {
  clearScreen();

  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour12: false });

  log('═══════════════════════════════════════════════════════════', 'cyan');
  log('     NEXUS ALERT — PRODUCT HUNT LAUNCH METRICS', 'bright');
  log(`     Last Updated: ${time}`, 'cyan');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  log('');

  // Product Hunt Section
  log('📊 PRODUCT HUNT', 'bright');
  log('───────────────────────────────────────────────────────────', 'cyan');
  displayMetric('Upvotes', metrics.productHunt.upvotes, CONFIG.TARGETS.upvotes);
  displayMetric('Ranking', metrics.productHunt.ranking, CONFIG.TARGETS.ranking, true);
  displayMetric('Comments', metrics.productHunt.comments, 50);
  log('');

  // Chrome Web Store Section
  log('🌐 CHROME WEB STORE', 'bright');
  log('───────────────────────────────────────────────────────────', 'cyan');
  displayMetric('Installs', metrics.chrome.installs, CONFIG.TARGETS.chromeInstalls);
  log('');

  // Revenue Section
  log('💰 REVENUE (STRIPE)', 'bright');
  log('───────────────────────────────────────────────────────────', 'cyan');
  displayMetric('Premium Signups', metrics.stripe.premiumSignups, CONFIG.TARGETS.premiumSignups);
  displayMetric('PRODUCTHUNT Codes', metrics.stripe.promoCodeRedemptions, 500);
  displayMetric('Revenue', `$${metrics.stripe.revenue.toFixed(2)}`, '$250');
  log('');

  // Website Section
  log('📧 WEBSITE', 'bright');
  log('───────────────────────────────────────────────────────────', 'cyan');
  displayMetric('Email Signups', metrics.website.emailSignups, CONFIG.TARGETS.emailSignups);
  displayMetric('Page Views (/ph)', metrics.website.pageViews, 5000);
  log('');

  // Overall Progress
  const progress = calculateProgress();
  log('═══════════════════════════════════════════════════════════', 'cyan');
  log(`Overall Progress: ${progress}%`, progress >= 70 ? 'green' : progress >= 40 ? 'yellow' : 'red');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  log('');

  // Next Actions
  log('📋 NEXT ACTIONS', 'bright');
  log('───────────────────────────────────────────────────────────', 'cyan');

  if (metrics.productHunt.upvotes < 100) {
    log('   • Share on Twitter (target: 100 upvotes)', 'yellow');
  }
  if (metrics.productHunt.upvotes < 300 && metrics.productHunt.upvotes >= 100) {
    log('   • Post to Reddit communities', 'yellow');
  }
  if (metrics.productHunt.ranking > 5) {
    log('   • Engage more in PH comments (boost visibility)', 'red');
  }
  if (metrics.chrome.installs < 100) {
    log('   • Send email blast to waitlist', 'yellow');
  }

  log('');
  log(`Refreshing in ${CONFIG.REFRESH_INTERVAL / 60000} minutes...`, 'cyan');
  log('Press Ctrl+C to exit', 'cyan');
}

function displayMetric(label, current, target, inverse = false) {
  const currentStr = String(current).padEnd(10);
  const targetStr = String(target);

  let color = 'yellow';
  let icon = '●';

  if (inverse) {
    // For ranking, lower is better
    if (current > 0 && current <= target) {
      color = 'green';
      icon = '✓';
    } else if (current === 0) {
      color = 'yellow';
      icon = '○';
    } else {
      color = 'red';
      icon = '✗';
    }
  } else {
    // For most metrics, higher is better
    const percentage = (current / parseFloat(target)) * 100;

    if (percentage >= 100) {
      color = 'green';
      icon = '✓';
    } else if (percentage >= 50) {
      color = 'yellow';
      icon = '●';
    } else {
      color = 'red';
      icon = '○';
    }
  }

  log(`   ${icon} ${label.padEnd(20)} ${currentStr} / ${targetStr}`, color);
}

function calculateProgress() {
  const weights = {
    upvotes: 0.3,
    ranking: 0.2,
    chromeInstalls: 0.25,
    premiumSignups: 0.15,
    emailSignups: 0.1,
  };

  let totalProgress = 0;

  totalProgress += Math.min(metrics.productHunt.upvotes / CONFIG.TARGETS.upvotes, 1) * weights.upvotes * 100;
  totalProgress += (metrics.productHunt.ranking > 0 && metrics.productHunt.ranking <= CONFIG.TARGETS.ranking ? 1 : 0) * weights.ranking * 100;
  totalProgress += Math.min(metrics.chrome.installs / CONFIG.TARGETS.chromeInstalls, 1) * weights.chromeInstalls * 100;
  totalProgress += Math.min(metrics.stripe.premiumSignups / CONFIG.TARGETS.premiumSignups, 1) * weights.premiumSignups * 100;
  totalProgress += Math.min(metrics.website.emailSignups / CONFIG.TARGETS.emailSignups, 1) * weights.emailSignups * 100;

  return Math.round(totalProgress);
}

// ─────────────────────────────────────────────────────────
// Manual Update Prompts
// ─────────────────────────────────────────────────────────

function promptManualUpdates() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  log('\n📝 MANUAL METRIC UPDATE', 'bright');
  log('───────────────────────────────────────────────────────────', 'cyan');

  rl.question('Product Hunt Upvotes: ', (upvotes) => {
    if (upvotes) metrics.productHunt.upvotes = parseInt(upvotes);

    rl.question('Product Hunt Ranking (1-10): ', (ranking) => {
      if (ranking) metrics.productHunt.ranking = parseInt(ranking);

      rl.question('Chrome Installs: ', (installs) => {
        if (installs) metrics.chrome.installs = parseInt(installs);

        rl.question('Premium Signups: ', (signups) => {
          if (signups) metrics.stripe.premiumSignups = parseInt(signups);

          rl.question('Email Signups: ', (emails) => {
            if (emails) metrics.website.emailSignups = parseInt(emails);

            rl.close();
            displayDashboard();
          });
        });
      });
    });
  });
}

// ─────────────────────────────────────────────────────────
// Main Loop
// ─────────────────────────────────────────────────────────

async function refresh() {
  try {
    metrics.timestamp = new Date().toISOString();

    // Fetch all metrics
    metrics.productHunt = await fetchProductHuntMetrics();
    metrics.chrome = await fetchChromeWebStoreInstalls();
    metrics.stripe = await fetchStripeMetrics();
    metrics.website = await fetchWebsiteMetrics();

    // Display dashboard
    displayDashboard();
  } catch (error) {
    log(`Error refreshing metrics: ${error.message}`, 'red');
  }
}

async function main() {
  log('Starting Product Hunt Launch Metrics Tracker...', 'green');
  log('');

  // Initial display
  await refresh();

  // Set up auto-refresh
  setInterval(refresh, CONFIG.REFRESH_INTERVAL);

  // Listen for manual update command
  process.stdin.on('data', (key) => {
    if (key.toString() === 'u\n' || key.toString() === 'u\r') {
      promptManualUpdates();
    }
  });

  log('');
  log('💡 TIP: Press "u" + Enter to manually update metrics', 'cyan');
}

// ─────────────────────────────────────────────────────────
// Start
// ─────────────────────────────────────────────────────────

main().catch(console.error);
