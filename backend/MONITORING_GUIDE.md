# NEXUS Alert — Production Monitoring Guide

Complete monitoring setup for catching production issues faster with Cloudflare Analytics, health checks, and Slack alerts.

## 📊 Overview

This monitoring system provides:

- **Health Check Endpoint**: `/health` — Comprehensive system status checks
- **Slack Alerts**: Rich formatted alerts for critical errors and system degradation
- **Cloudflare Analytics**: Real-time performance metrics via GraphQL API
- **Error Tracking**: Automatic error counting and alerting
- **Continuous Monitoring**: Scripts for 24/7 health and performance monitoring

## 🚀 Quick Start

### 1. Set Up Slack Alerts

Create a Slack incoming webhook:

1. Go to https://api.slack.com/messaging/webhooks
2. Click "Create New App" → "From scratch"
3. Name: "NEXUS Alert Monitor", select your workspace
4. Go to "Incoming Webhooks" → Enable → "Add New Webhook to Workspace"
5. Select a channel (e.g., `#nexus-alerts`) → "Allow"
6. Copy the webhook URL (starts with `https://hooks.slack.com/services/...`)

Set the webhook secret in your worker:

```bash
cd backend
wrangler secret put SLACK_WEBHOOK_URL --env production
# Paste your webhook URL when prompted
```

### 2. Configure Cloudflare Analytics

Get your Cloudflare credentials:

```bash
# Get your account ID
wrangler whoami

# Create API token at: https://dash.cloudflare.com/profile/api-tokens
# Permissions needed:
# - Account.Analytics:Read
# - Account.Workers Scripts:Read
```

Set environment variables:

```bash
export CLOUDFLARE_API_TOKEN="your_api_token"
export CLOUDFLARE_ACCOUNT_ID="your_account_id"
export WORKER_NAME="nexus-alert-backend"
```

### 3. Run Monitoring Scripts

#### Health Check Monitor (Recommended for Production)

Continuously monitors the `/health` endpoint and sends Slack alerts on issues:

```bash
# Set variables
export HEALTH_URL="https://api.nexus-alert.com/health"
export SLACK_WEBHOOK_URL="your_slack_webhook_url"
export CHECK_INTERVAL=60  # seconds
export ALERT_THRESHOLD=3  # consecutive failures before alert

# Run monitor
./scripts/monitor-health.sh
```

**Production deployment**: Run as a systemd service (see below) or in a tmux/screen session.

#### Analytics Dashboard

Real-time Cloudflare Analytics dashboard:

```bash
# Set credentials (from step 2)
export CLOUDFLARE_API_TOKEN="your_api_token"
export CLOUDFLARE_ACCOUNT_ID="your_account_id"

# Run dashboard
./scripts/analytics-dashboard.js
```

## 🏥 Health Check Endpoint

### Endpoint: `GET /health`

Returns comprehensive system status with zero authentication (public endpoint).

**Response format:**

```json
{
  "timestamp": "2026-03-18T20:30:00.000Z",
  "status": "healthy",  // "healthy" | "degraded" | "unhealthy"
  "checks": {
    "kv_accessible": {
      "status": "pass",
      "latency_ms": 45,
      "message": "KV namespace accessible"
    },
    "cron_execution": {
      "status": "pass",
      "last_run": "2026-03-18T20:28:15.000Z",
      "elapsed_minutes": 2,
      "message": "Cron executing normally"
    },
    "subscriber_system": {
      "status": "pass",
      "count": 247,
      "message": "247 subscribers registered"
    },
    "cbp_api": {
      "status": "pass",
      "consecutive_failures": 0,
      "message": "CBP API responding normally"
    },
    "error_rate": {
      "status": "pass",
      "errors_last_hour": 2,
      "message": "Low error rate"
    }
  },
  "metrics": {
    "total_checks": 15234,
    "total_notifications": 823,
    "subscribers": 247,
    "notification_rate": "5.40%",
    "uptime_indicator": "99.9%"
  },
  "alerts": []
}
```

### Health Status Codes

- **200 OK**: System is `healthy` — all checks passing
- **503 Service Unavailable**: System is `degraded` or `unhealthy` — some checks failing

### Alert Severity

Alerts are included in the response when issues are detected:

```json
{
  "alerts": [
    {
      "severity": "critical",  // "critical" | "warning" | "info"
      "message": "Cron has not run for 15 minutes"
    }
  ]
}
```

## 🔔 Slack Alert System

### Alert Types

The enhanced Slack alert system sends rich formatted messages with:

- **Severity-based formatting**: Critical (🚨), Error (❌), Warning (⚠️), Info (ℹ️)
- **Structured metadata**: Error details, system state, timestamps
- **Quick action buttons**: Links to dashboard and logs (for critical alerts)
- **System metrics**: Optional inclusion of current metrics

### Sending Alerts

Alerts are sent automatically for:

1. **Cron failures** (critical)
2. **Stripe webhook errors** (error)
3. **CBP API failures** (warning after 3 consecutive failures)
4. **High error rates** (critical when >10 errors/hour)
5. **System degradation** (from health checks)

### Manual Alert Testing

```bash
# Test via worker (requires auth)
curl -X POST https://api.nexus-alert.com/api/test-alert \
  -H "Authorization: Bearer $WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"message": "Test alert", "severity": "info"}'
```

## 📈 Cloudflare Analytics

### Metrics Available

The analytics dashboard shows:

**Worker Performance (Last Hour)**
- Total requests
- Error count and error rate
- Subrequests (API calls to CBP, Stripe, etc.)
- Average wall time (total execution time)
- Average CPU time

**Response Time Percentiles**
- P50 (median)
- P75
- P95
- P99

**KV Namespace Operations**
- Reads
- Writes
- Deletes
- Lists

### Custom Queries

Use the GraphQL query in `monitoring/cloudflare-dashboard.graphql` to build custom dashboards:

```bash
curl -X POST https://api.cloudflare.com/client/v4/graphql \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d @- <<EOF
{
  "query": "$(cat ../monitoring/cloudflare-dashboard.graphql | tr '\n' ' ')",
  "variables": {
    "accountId": "$CLOUDFLARE_ACCOUNT_ID"
  }
}
EOF
```

## 🔍 Error Tracking

### Automatic Error Tracking

All errors are automatically:

1. **Logged** with structured JSON format
2. **Counted** in a 1-hour rolling window (KV key: `error_count_1h`)
3. **Sent to Sentry** (if `SENTRY_DSN` is configured)
4. **Alerted to Slack** (if error count ≥ 10/hour or severity is critical)

### Error Context

Errors include:

```json
{
  "type": "error",
  "message": "Error message",
  "stack": "Stack trace...",
  "context": {
    "location": "checkAllSubscribers",
    "severity": "critical"
  },
  "timestamp": "2026-03-18T20:30:00.000Z"
}
```

### Viewing Errors

```bash
# Real-time error stream
wrangler tail --env production --format pretty | grep -i error

# Or use the monitoring dashboard (auto-refreshes)
./monitoring-dashboard.sh
```

## 🏭 Production Deployment

### Option 1: Systemd Service (Recommended)

Create `/etc/systemd/system/nexus-health-monitor.service`:

```ini
[Unit]
Description=NEXUS Alert Health Monitor
After=network.target

[Service]
Type=simple
User=nexus
WorkingDirectory=/opt/nexus-alert/backend
Environment="HEALTH_URL=https://api.nexus-alert.com/health"
Environment="SLACK_WEBHOOK_URL=your_webhook_url"
Environment="CHECK_INTERVAL=60"
Environment="ALERT_THRESHOLD=3"
ExecStart=/opt/nexus-alert/backend/scripts/monitor-health.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable nexus-health-monitor
sudo systemctl start nexus-health-monitor
sudo systemctl status nexus-health-monitor
```

### Option 2: Docker Container

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY backend/scripts/ ./scripts/
RUN apk add --no-cache bash curl jq

ENV HEALTH_URL=https://api.nexus-alert.com/health
ENV CHECK_INTERVAL=60
ENV ALERT_THRESHOLD=3

CMD ["./scripts/monitor-health.sh"]
```

Run:

```bash
docker build -t nexus-health-monitor .
docker run -d \
  --name nexus-health-monitor \
  --restart unless-stopped \
  -e SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL \
  nexus-health-monitor
```

### Option 3: Cron Job

Add to crontab (runs every 5 minutes):

```bash
*/5 * * * * cd /opt/nexus-alert/backend && HEALTH_URL=https://api.nexus-alert.com/health SLACK_WEBHOOK_URL=your_webhook scripts/monitor-health.sh > /tmp/nexus-health.log 2>&1
```

## 🔧 Troubleshooting

### Health Check Returns 503

**System is degraded or unhealthy**

1. Check the `alerts` array in the response for specific issues
2. View detailed status: `curl https://api.nexus-alert.com/health | jq .`
3. Check worker logs: `wrangler tail --env production`
4. Verify cron is running: Check Cloudflare dashboard → Workers → Triggers

### No Slack Alerts

1. Verify webhook URL is set: `wrangler secret list --env production`
2. Test webhook manually:
   ```bash
   curl -X POST $SLACK_WEBHOOK_URL \
     -H 'Content-Type: application/json' \
     -d '{"text": "Test from NEXUS Alert"}'
   ```
3. Check worker logs for `[Slack Alert]` messages
4. Verify alert cooldown (5 minutes between repeat alerts)

### Analytics Dashboard Shows No Data

1. Verify API token permissions (Analytics:Read, Workers Scripts:Read)
2. Check account ID: `wrangler whoami`
3. Verify worker name matches: `echo $WORKER_NAME`
4. Check for recent worker invocations in Cloudflare dashboard
5. Wait 5-10 minutes after first deployment for analytics to populate

### High Error Rate

1. Check health endpoint: `/health` → `checks.error_rate`
2. View error logs: `wrangler tail --env production --format json | jq 'select(.type == "error")'`
3. Check Sentry dashboard (if configured)
4. Review recent code changes or deployments

## 📊 Monitoring Best Practices

1. **Set up all three monitoring layers**:
   - Health check monitor (catches system degradation)
   - Analytics dashboard (performance trends)
   - Existing monitoring-dashboard.sh (business metrics)

2. **Alert on anomalies, not noise**:
   - Use alert thresholds (e.g., 3 consecutive failures)
   - Implement alert cooldowns (5 minutes)
   - Only critical/error alerts ping Slack

3. **Regular checks**:
   - Daily: Review analytics dashboard
   - Weekly: Check notification rates, error trends
   - Monthly: Review alert history, adjust thresholds

4. **Incident response**:
   - Health endpoint provides first diagnostic data
   - Analytics show if issue is performance or availability
   - Worker logs provide detailed error context

## 🔗 Related Documentation

- [Cloudflare Workers Analytics](https://developers.cloudflare.com/analytics/graphql-api/)
- [Sentry Integration](https://docs.sentry.io/platforms/javascript/guides/cloudflare-workers/)
- [Slack Incoming Webhooks](https://api.slack.com/messaging/webhooks)
- [Production Deployment Guide](./PRODUCTION_DEPLOYMENT.md)

## 📞 Quick Links

- **Health Check**: https://api.nexus-alert.com/health
- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Sentry Dashboard**: https://sentry.io
- **Slack Webhooks**: https://api.slack.com/apps
