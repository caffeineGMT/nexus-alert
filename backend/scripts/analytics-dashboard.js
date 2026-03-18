#!/usr/bin/env node
// NEXUS Alert — Cloudflare Analytics Dashboard
// Fetches and displays real-time worker analytics

const CLOUDFLARE_API_URL = 'https://api.cloudflare.com/client/v4/graphql';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const WORKER_NAME = process.env.WORKER_NAME || 'nexus-alert-backend';
const REFRESH_INTERVAL = parseInt(process.env.REFRESH_INTERVAL || '30') * 1000;

// Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// GraphQL query for worker analytics
const ANALYTICS_QUERY = `
query WorkerAnalytics($accountId: String!, $workerName: String!, $since: Time!, $until: Time!) {
  viewer {
    accounts(filter: { accountTag: $accountId }) {
      workersInvocationsAdaptive(
        filter: {
          scriptName: $workerName
          datetime_geq: $since
          datetime_leq: $until
        }
        limit: 10000
        orderBy: [datetime_DESC]
      ) {
        sum {
          requests
          errors
          subrequests
        }
        avg {
          wallTime
          cpuTime
        }
        quantiles {
          cpuTimeP50
          cpuTimeP75
          cpuTimeP95
          cpuTimeP99
          wallTimeP50
          wallTimeP75
          wallTimeP95
          wallTimeP99
        }
        dimensions {
          datetime
          status
        }
      }
      workersKVOperationsAdaptive(
        filter: {
          scriptName: $workerName
          datetime_geq: $since
          datetime_leq: $until
        }
        limit: 10000
        orderBy: [datetime_DESC]
      ) {
        sum {
          reads
          writes
          deletes
          lists
        }
        dimensions {
          datetime
        }
      }
    }
  }
}
`;

// Check configuration
function checkConfig() {
  const missing = [];
  if (!CLOUDFLARE_API_TOKEN) missing.push('CLOUDFLARE_API_TOKEN');
  if (!CLOUDFLARE_ACCOUNT_ID) missing.push('CLOUDFLARE_ACCOUNT_ID');

  if (missing.length > 0) {
    console.error(`${colors.red}Missing required environment variables:${colors.reset}`);
    missing.forEach(v => console.error(`  - ${v}`));
    console.error('\nGet your credentials:');
    console.error('  Account ID: Run `wrangler whoami` or check https://dash.cloudflare.com');
    console.error('  API Token: Create at https://dash.cloudflare.com/profile/api-tokens');
    console.error('    Required permissions: Account.Analytics:Read, Account.Workers Scripts:Read');
    process.exit(1);
  }
}

// Fetch analytics from Cloudflare
async function fetchAnalytics() {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  const variables = {
    accountId: CLOUDFLARE_ACCOUNT_ID,
    workerName: WORKER_NAME,
    since: oneHourAgo.toISOString(),
    until: now.toISOString(),
  };

  try {
    const response = await fetch(CLOUDFLARE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: ANALYTICS_QUERY,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    return data.data.viewer.accounts[0];
  } catch (err) {
    console.error(`${colors.red}Failed to fetch analytics:${colors.reset}`, err.message);
    return null;
  }
}

// Format number with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Format duration (ms to human readable)
function formatDuration(ms) {
  if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

// Display dashboard
function displayDashboard(analytics, healthData) {
  console.clear();

  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  console.log('');
  console.log(`${colors.bright}╔═══════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}║      NEXUS Alert — Cloudflare Analytics Dashboard            ║${colors.reset}`);
  console.log(`${colors.bright}╚═══════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log('');
  console.log(`${colors.cyan}Last updated:${colors.reset} ${timestamp} UTC`);
  console.log(`${colors.cyan}Worker:${colors.reset} ${WORKER_NAME}`);
  console.log(`${colors.cyan}Refresh:${colors.reset} ${REFRESH_INTERVAL / 1000}s (Press Ctrl+C to exit)`);
  console.log('');

  if (!analytics) {
    console.log(`${colors.red}Analytics data unavailable${colors.reset}`);
    console.log('');
    return;
  }

  // Worker Invocations
  const invocations = analytics.workersInvocationsAdaptive || [];
  const kvOps = analytics.workersKVOperationsAdaptive || [];

  let totalRequests = 0;
  let totalErrors = 0;
  let totalSubrequests = 0;
  let avgWallTime = 0;
  let avgCpuTime = 0;

  if (invocations.length > 0) {
    const latest = invocations[0];
    totalRequests = latest.sum?.requests || 0;
    totalErrors = latest.sum?.errors || 0;
    totalSubrequests = latest.sum?.subrequests || 0;
    avgWallTime = latest.avg?.wallTime || 0;
    avgCpuTime = latest.avg?.cpuTime || 0;
  }

  const errorRate = totalRequests > 0 ? ((totalErrors / totalRequests) * 100).toFixed(2) : 0;

  console.log(`${colors.bright}━━━ Worker Performance (Last Hour) ━━━${colors.reset}`);
  console.log('');
  console.log(`  ${colors.cyan}Requests:${colors.reset} ${formatNumber(totalRequests)}`);

  if (totalErrors > 0) {
    console.log(`  ${colors.red}Errors:${colors.reset} ${colors.red}${formatNumber(totalErrors)}${colors.reset} (${errorRate}%)`);
  } else {
    console.log(`  ${colors.green}Errors:${colors.reset} ${colors.green}0${colors.reset} (0%)`);
  }

  console.log(`  ${colors.cyan}Subrequests:${colors.reset} ${formatNumber(totalSubrequests)}`);
  console.log(`  ${colors.cyan}Avg Wall Time:${colors.reset} ${formatDuration(avgWallTime)}`);
  console.log(`  ${colors.cyan}Avg CPU Time:${colors.reset} ${formatDuration(avgCpuTime)}`);
  console.log('');

  // Performance Percentiles
  if (invocations.length > 0 && invocations[0].quantiles) {
    const q = invocations[0].quantiles;

    console.log(`${colors.bright}━━━ Response Time Percentiles ━━━${colors.reset}`);
    console.log('');
    console.log(`  ${colors.cyan}P50 (median):${colors.reset} ${formatDuration(q.wallTimeP50 || 0)}`);
    console.log(`  ${colors.cyan}P75:${colors.reset} ${formatDuration(q.wallTimeP75 || 0)}`);
    console.log(`  ${colors.cyan}P95:${colors.reset} ${formatDuration(q.wallTimeP95 || 0)}`);
    console.log(`  ${colors.cyan}P99:${colors.reset} ${formatDuration(q.wallTimeP99 || 0)}`);
    console.log('');
  }

  // KV Operations
  if (kvOps.length > 0) {
    const latest = kvOps[0];
    const reads = latest.sum?.reads || 0;
    const writes = latest.sum?.writes || 0;
    const deletes = latest.sum?.deletes || 0;
    const lists = latest.sum?.lists || 0;

    console.log(`${colors.bright}━━━ KV Namespace Operations (Last Hour) ━━━${colors.reset}`);
    console.log('');
    console.log(`  ${colors.cyan}Reads:${colors.reset} ${formatNumber(reads)}`);
    console.log(`  ${colors.cyan}Writes:${colors.reset} ${formatNumber(writes)}`);
    console.log(`  ${colors.cyan}Deletes:${colors.reset} ${formatNumber(deletes)}`);
    console.log(`  ${colors.cyan}Lists:${colors.reset} ${formatNumber(lists)}`);
    console.log('');
  }

  // Health Check Data
  if (healthData) {
    console.log(`${colors.bright}━━━ System Health ━━━${colors.reset}`);
    console.log('');

    const status = healthData.status || 'unknown';
    const statusColor = status === 'healthy' ? colors.green : status === 'degraded' ? colors.yellow : colors.red;
    console.log(`  ${statusColor}●${colors.reset} Status: ${statusColor}${status.toUpperCase()}${colors.reset}`);

    if (healthData.metrics) {
      const m = healthData.metrics;
      console.log(`  ${colors.cyan}Subscribers:${colors.reset} ${formatNumber(m.subscribers || 0)}`);
      console.log(`  ${colors.cyan}Total Checks:${colors.reset} ${formatNumber(m.total_checks || 0)}`);
      console.log(`  ${colors.cyan}Total Notifications:${colors.reset} ${formatNumber(m.total_notifications || 0)}`);
      console.log(`  ${colors.cyan}Notification Rate:${colors.reset} ${m.notification_rate || '0%'}`);
    }

    if (healthData.alerts && healthData.alerts.length > 0) {
      console.log('');
      console.log(`  ${colors.red}Active Alerts (${healthData.alerts.length}):${colors.reset}`);
      healthData.alerts.forEach(alert => {
        const severityColor = alert.severity === 'critical' ? colors.red : colors.yellow;
        console.log(`    ${severityColor}• [${alert.severity.toUpperCase()}]${colors.reset} ${alert.message}`);
      });
    }

    console.log('');
  }

  // Health Indicators
  console.log(`${colors.bright}━━━ Health Indicators ━━━${colors.reset}`);
  console.log('');

  const checks = [];

  // Error rate check
  if (parseFloat(errorRate) > 5) {
    checks.push({ status: 'fail', message: `High error rate: ${errorRate}%` });
  } else if (parseFloat(errorRate) > 1) {
    checks.push({ status: 'warn', message: `Elevated error rate: ${errorRate}%` });
  } else {
    checks.push({ status: 'pass', message: `Error rate normal: ${errorRate}%` });
  }

  // Response time check
  if (avgWallTime > 1000) {
    checks.push({ status: 'warn', message: `Slow response time: ${formatDuration(avgWallTime)}` });
  } else {
    checks.push({ status: 'pass', message: `Response time good: ${formatDuration(avgWallTime)}` });
  }

  // Display checks
  checks.forEach(check => {
    const icon = check.status === 'pass' ? `${colors.green}✓${colors.reset}` :
                 check.status === 'warn' ? `${colors.yellow}⚠${colors.reset}` :
                 `${colors.red}✗${colors.reset}`;
    console.log(`  ${icon} ${check.message}`);
  });

  console.log('');
}

// Fetch health check data
async function fetchHealthCheck() {
  try {
    const response = await fetch('https://api.nexus-alert.com/health');
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    return null;
  }
}

// Main monitoring loop
async function main() {
  checkConfig();

  console.log('Starting analytics dashboard...');
  await new Promise(resolve => setTimeout(resolve, 1000));

  while (true) {
    const [analytics, healthData] = await Promise.all([
      fetchAnalytics(),
      fetchHealthCheck(),
    ]);

    displayDashboard(analytics, healthData);

    await new Promise(resolve => setTimeout(resolve, REFRESH_INTERVAL));
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log(`\n${colors.cyan}Analytics dashboard stopped.${colors.reset}`);
  process.exit(0);
});

main().catch(err => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, err);
  process.exit(1);
});
