#!/usr/bin/env node

/**
 * NEXUS Alert - Monitoring Dashboard (CLI)
 * Quick health check for all services
 *
 * Usage: node scripts/monitoring-dashboard.js
 */

const https = require('https');

const CHECKS = [
  {
    name: 'Cloudflare Worker Health',
    url: 'https://api.nexus-alert.com/health',
    critical: true,
    validate: (data) => {
      if (data.status !== 'healthy') {
        return { ok: false, message: `Status: ${data.status}` };
      }
      const failedChecks = Object.entries(data.checks || {})
        .filter(([_, check]) => check.status === 'fail')
        .map(([name, _]) => name);
      if (failedChecks.length > 0) {
        return { ok: false, message: `Failed checks: ${failedChecks.join(', ')}` };
      }
      return { ok: true, message: `All systems operational` };
    },
  },
  {
    name: 'Landing Page',
    url: 'https://nexus-alert.com',
    critical: true,
    validate: (html) => {
      if (typeof html === 'string' && html.includes('NEXUS Alert')) {
        return { ok: true, message: 'Page loads correctly' };
      }
      return { ok: false, message: 'Keyword not found' };
    },
  },
  {
    name: 'CBP API Reachability',
    url: 'https://ttp.cbp.dhs.gov/schedulerapi/locations?serviceName=NEXUS',
    critical: false,
    validate: (data) => {
      if (Array.isArray(data) && data.length > 0) {
        return { ok: true, message: `${data.length} locations available` };
      }
      return { ok: false, message: 'No locations returned' };
    },
  },
];

async function httpGet(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    https.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        const latency = Date.now() - startTime;
        const contentType = res.headers['content-type'] || '';

        let parsed = data;
        if (contentType.includes('application/json')) {
          try {
            parsed = JSON.parse(data);
          } catch (err) {
            // Keep as string
          }
        }

        resolve({ status: res.statusCode, data: parsed, latency });
      });
    }).on('error', reject).on('timeout', () => {
      reject(new Error('Request timeout'));
    });
  });
}

function colorize(text, color) {
  const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    gray: '\x1b[90m',
    reset: '\x1b[0m',
  };
  return `${colors[color]}${text}${colors.reset}`;
}

async function runChecks() {
  console.log(colorize('\n🚀 NEXUS Alert Monitoring Dashboard\n', 'blue'));
  console.log(colorize(`Checking ${CHECKS.length} services...\n`, 'gray'));

  let allOk = true;
  const results = [];

  for (const check of CHECKS) {
    process.stdout.write(colorize(`⏳ ${check.name}... `, 'gray'));

    try {
      const { status, data, latency } = await httpGet(check.url);

      if (status !== 200) {
        allOk = false;
        console.log(colorize(`❌ FAIL (HTTP ${status})`, 'red'));
        results.push({ name: check.name, ok: false, message: `HTTP ${status}`, latency });
        continue;
      }

      const result = check.validate(data);
      results.push({ ...result, name: check.name, latency });

      if (result.ok) {
        console.log(colorize(`✅ OK (${latency}ms) - ${result.message}`, 'green'));
      } else {
        allOk = check.critical ? false : allOk;
        const severity = check.critical ? '❌ CRITICAL' : '⚠️  WARNING';
        console.log(colorize(`${severity} (${latency}ms) - ${result.message}`, check.critical ? 'red' : 'yellow'));
      }
    } catch (err) {
      allOk = false;
      console.log(colorize(`❌ ERROR - ${err.message}`, 'red'));
      results.push({ name: check.name, ok: false, message: err.message, latency: null });
    }
  }

  console.log(colorize('\n─────────────────────────────────────────────────────', 'gray'));

  // Summary
  const okCount = results.filter((r) => r.ok).length;
  const failCount = results.filter((r) => !r.ok).length;
  const avgLatency = Math.round(
    results.filter((r) => r.latency).reduce((sum, r) => sum + r.latency, 0) /
    results.filter((r) => r.latency).length
  );

  console.log(colorize(`\n📊 Summary: ${okCount}/${CHECKS.length} checks passed`, 'blue'));
  console.log(colorize(`⏱️  Average latency: ${avgLatency}ms\n`, 'gray'));

  if (allOk) {
    console.log(colorize('✅ All critical systems operational!\n', 'green'));
    process.exit(0);
  } else {
    console.log(colorize(`❌ ${failCount} check(s) failed\n`, 'red'));
    process.exit(1);
  }
}

runChecks().catch((err) => {
  console.error(colorize(`\n❌ Fatal error: ${err.message}\n`, 'red'));
  process.exit(1);
});
