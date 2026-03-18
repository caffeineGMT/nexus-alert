# NEXUS Alert Monitoring

Centralized monitoring and observability for production NEXUS Alert infrastructure.

## Quick Start

### 1. Check System Health

```bash
curl https://api.nexus-alert.com/health | jq .
```

### 2. Run Monitoring Dashboard

```bash
cd ../backend

# Health monitoring
export HEALTH_URL="https://api.nexus-alert.com/health"
export SLACK_WEBHOOK_URL="your_webhook_url"
./scripts/monitor-health.sh

# Analytics dashboard
export CLOUDFLARE_API_TOKEN="your_token"
export CLOUDFLARE_ACCOUNT_ID="your_account_id"
./scripts/analytics-dashboard.js
```

## Files

### `cloudflare-dashboard.graphql`

GraphQL query for fetching Cloudflare Workers analytics:

- Worker invocation metrics (requests, errors, latency)
- Performance percentiles (P50, P75, P95, P99)
- KV namespace operations

**Usage**:

```bash
curl -X POST https://api.cloudflare.com/client/v4/graphql \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$(cat cloudflare-dashboard.graphql)"
```

## Monitoring Endpoints

### Health Check: `/health`

Public endpoint (no auth) for external monitoring tools.

**Returns**:
- System status (healthy/degraded/unhealthy)
- Component health checks (KV, cron, API, errors)
- Metrics (subscribers, checks, notifications)
- Active alerts

### Status: `/api/status`

Authenticated endpoint for operational metrics.

**Requires**: `Authorization: Bearer $WEBHOOK_SECRET`

**Returns**:
- Last run timestamp
- Total checks & notifications
- Subscriber count

## Monitoring Tools

All monitoring scripts are in `../backend/scripts/`:

- **`monitor-health.sh`** — Continuous health monitoring with Slack alerts
- **`analytics-dashboard.js`** — Real-time Cloudflare Analytics dashboard
- **`test-alerts.sh`** — Test Slack webhook integration

See `../backend/MONITORING_GUIDE.md` for complete setup instructions.

## Architecture

```
┌──────────────────┐
│  Health Monitor  │──> Polls /health every 60s
│  (monitor-health │──> Sends Slack alerts on failures
│   .sh)           │──> Tracks consecutive failures
└──────────────────┘

┌──────────────────┐
│  Analytics       │──> Queries Cloudflare GraphQL API
│  Dashboard       │──> Displays performance metrics
│  (analytics-     │──> Shows error rates & latency
│   dashboard.js)  │──> Auto-refreshes every 30s
└──────────────────┘

┌──────────────────┐
│  Worker          │──> /health endpoint (5 checks)
│  (nexus-alert-   │──> Enhanced Slack alerts
│   backend)       │──> Error tracking (1h window)
└──────────────────┘
```

## Alert Severity Levels

- **Critical** 🚨 — Immediate action required (cron stopped, system unhealthy)
- **Error** ❌ — Significant issues (webhook failures, high error rate)
- **Warning** ⚠️ — Potential problems (API failures, degraded performance)
- **Info** ℹ️ — Informational (recovery, status changes)

## Production Deployment

**Recommended**: Run monitoring scripts as systemd services or Docker containers.

See `../backend/MONITORING_GUIDE.md` for:
- systemd service configuration
- Docker container setup
- Cron job configuration
- Best practices

## Troubleshooting

### Health check returns 503

System is degraded. Check the `alerts` array in the response:

```bash
curl https://api.nexus-alert.com/health | jq '.alerts'
```

### No Slack alerts

1. Verify webhook URL: `wrangler secret list --env production`
2. Test webhook: `../backend/scripts/test-alerts.sh`
3. Check alert cooldown (5 minutes between repeats)

### Analytics dashboard shows no data

1. Verify API token permissions (Analytics:Read)
2. Wait 5-10 minutes after first deployment
3. Check worker name matches: `echo $WORKER_NAME`

## Links

- **Health Endpoint**: https://api.nexus-alert.com/health
- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Complete Guide**: `../backend/MONITORING_GUIDE.md`
- **GraphQL API Docs**: https://developers.cloudflare.com/analytics/graphql-api/
