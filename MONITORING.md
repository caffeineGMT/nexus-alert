# Uptime Monitoring & Observability Configuration

## NEXUS Alert Monitoring Stack

This document describes the comprehensive monitoring and observability setup for NEXUS Alert across all components.

---

## 📊 Monitoring Architecture

### Components Being Monitored

1. **Cloudflare Worker API** (`https://api.nexus-alert.com`)
   - Health check endpoint: `/health`
   - Critical paths: `/api/subscribe`, `/api/checkout`, `/api/webhook`
   - Cron job execution monitoring

2. **Chrome Extension** (Client-side)
   - Error tracking via Sentry
   - Analytics via Plausible
   - User interaction monitoring

3. **Web Landing Page** (`https://nexus-alert.com`)
   - Performance monitoring via Sentry
   - Analytics via Plausible
   - Core Web Vitals tracking

---

## 🚨 Error Tracking (Sentry)

### Deployed Instances

| Component | DSN Environment Variable | Sample Rate |
|-----------|-------------------------|-------------|
| Cloudflare Worker | `SENTRY_DSN` | 20% (errors), 10% (traces) |
| Chrome Extension | Hardcoded in `src/sentry.js` | 20% (errors) |
| Next.js Web App | `NEXT_PUBLIC_SENTRY_DSN` | 20% (client), 50% (server) |

### Sentry Project Structure

```
Organization: nexus-alert
├── worker (Cloudflare Worker backend)
├── extension (Chrome Extension)
└── web (Next.js landing page)
```

### Key Sentry Features Enabled

- ✅ **Session Replay** (web only) - 10% of sessions, 100% of error sessions
- ✅ **Performance Monitoring** - 10% transaction sampling
- ✅ **Error Filtering** - Ignores bot traffic, known benign errors
- ✅ **Source Maps** - Uploaded during build (hidden from clients)
- ✅ **User Context** - Email and tier attached to errors when available

### Error Alert Policies

Configure these alerts in Sentry dashboard:

1. **Critical Error Spike** - >10 errors/minute
2. **Performance Degradation** - P95 latency >3s
3. **High Error Rate** - >5% error rate over 5min window
4. **New Error Pattern** - First seen error with >3 occurrences

---

## 📈 User Analytics (Plausible)

Privacy-friendly, GDPR-compliant analytics without cookies.

### Deployment

- **Domain**: `nexus-alert.com`
- **Dashboard**: https://plausible.io/nexus-alert.com
- **Data Retention**: 12 months

### Tracked Events

#### Chrome Extension

```javascript
// Tracked in background.js
trackEvent('slot_found', { location_id, date, program });
trackEvent('notification_sent', { type: 'browser' | 'email' });
trackEvent('upgrade_clicked', { source: 'banner' | 'modal' });
```

#### Web App

```javascript
// Tracked via Plausible script tag
- Pageviews (automatic)
- Outbound link clicks (automatic)
- Custom events via: plausible('event_name', { props })
```

### Key Metrics to Monitor

- Daily Active Users (DAU)
- Extension Install -> Activation rate
- Free -> Premium conversion rate
- Slot discovery success rate
- Geographic distribution (US/Canada split)

---

## ⏱️ Uptime Monitoring

### Recommended Service: BetterUptime

**Why BetterUptime?**
- Free tier: 10 monitors, 30s check interval
- Status page included
- Incident management built-in
- Integrates with Slack, PagerDuty, email

### Monitor Configuration

#### Monitor 1: Cloudflare Worker Health Check

```yaml
URL: https://api.nexus-alert.com/health
Method: GET
Expected Status: 200
Check Interval: 60 seconds
Timeout: 10 seconds
Regions: US-East, US-West, EU-West

Expected Response:
{
  "status": "healthy",
  "checks": {
    "kv_accessible": { "status": "pass" },
    "cron_execution": { "status": "pass" }
  }
}

Alert Conditions:
- Status != "healthy" (Critical)
- Response time > 3000ms (Warning)
- Any 5xx status code (Critical)
- 3 consecutive failures (Critical)
```

#### Monitor 2: Landing Page Availability

```yaml
URL: https://nexus-alert.com
Method: GET
Expected Status: 200
Check Interval: 120 seconds
Keyword Check: "NEXUS Alert"
Regions: Multi-region

Alert Conditions:
- Status != 200 (Critical)
- Response time > 5000ms (Warning)
- Keyword not found (Critical)
```

#### Monitor 3: Stripe Webhook Endpoint

```yaml
URL: https://api.nexus-alert.com/api/webhook
Method: POST
Headers: Stripe-Signature: test
Expected Status: 400 (signature validation fails, but endpoint is up)
Check Interval: 300 seconds

Alert Conditions:
- Status 5xx (Critical)
- Status 404 (Critical)
```

#### Monitor 4: Chrome Web Store Listing

```yaml
URL: https://chromewebstore.google.com/detail/nexus-alert/[EXTENSION_ID]
Method: GET
Expected Status: 200
Check Interval: 3600 seconds (hourly)

Alert Conditions:
- Status != 200 (Critical - extension may be delisted)
```

---

## 📡 Alternative Uptime Monitoring Options

### Option 1: UptimeRobot (Free Alternative)

```yaml
Free Tier: 50 monitors, 5-minute interval
Dashboard: https://uptimerobot.com

Monitor Setup:
1. HTTP(s) monitor for /health endpoint
2. Keyword monitoring for "healthy"
3. Email + Slack notifications
4. Public status page: status.nexus-alert.com
```

### Option 2: Cloudflare Workers Analytics (Built-in)

```yaml
Dashboard: Cloudflare Dashboard > Workers > Analytics
Metrics:
- Requests per second
- CPU time
- Errors (4xx, 5xx)
- Success rate

GraphQL API:
query {
  viewer {
    accounts(filter: { accountTag: $accountId }) {
      workersInvocationsAdaptive(limit: 10000, filter: { datetime_geq: "2024-01-01" }) {
        sum { requests, errors, subrequests }
      }
    }
  }
}
```

### Option 3: Datadog Synthetics (Enterprise)

Premium option with advanced features:
- Multi-step user journey monitoring
- RUM (Real User Monitoring) integration
- APM (Application Performance Monitoring)
- Cost: ~$5/check/month

---

## 🔔 Alerting Channels

### Slack Integration (Recommended)

1. Create Slack channel: `#nexus-alert-monitoring`
2. Configure Sentry Slack app
3. Configure BetterUptime Slack notifications
4. Alert routing:
   - **Critical** → Immediate ping to on-call
   - **Warning** → Post to channel, no ping
   - **Info** → Log only

### PagerDuty Integration (For 24/7 Coverage)

```yaml
Service: NEXUS Alert Production
Escalation Policy:
  1. On-call engineer (immediate)
  2. Escalate to engineering manager after 15min
  3. Escalate to CTO after 30min

Alert Routing:
- Sentry Critical Errors → PagerDuty
- BetterUptime downtime → PagerDuty
- Stripe webhook failures → PagerDuty
```

---

## 🎯 SLOs (Service Level Objectives)

### Availability Targets

| Component | Uptime SLO | Monthly Downtime Budget |
|-----------|-----------|-------------------------|
| Cloudflare Worker | 99.9% | 43 minutes |
| Landing Page | 99.95% | 22 minutes |
| Chrome Extension | N/A (client-side) | - |

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time (p95) | <500ms | Sentry Performance |
| Health Check Response | <200ms | BetterUptime |
| Web LCP (Largest Contentful Paint) | <2.5s | Sentry Web Vitals |
| Web FID (First Input Delay) | <100ms | Sentry Web Vitals |
| Web CLS (Cumulative Layout Shift) | <0.1 | Sentry Web Vitals |

### Error Rate Targets

| Component | Error Rate Target | Measurement |
|-----------|-------------------|-------------|
| API Endpoints | <1% | Sentry |
| Chrome Extension | <0.5% | Sentry |
| Web App | <0.3% | Sentry |

---

## 📋 Health Check Response Format

The `/health` endpoint returns comprehensive diagnostics:

```json
{
  "timestamp": "2026-03-18T12:34:56.789Z",
  "status": "healthy" | "degraded" | "unhealthy",
  "checks": {
    "kv_accessible": {
      "status": "pass",
      "latency_ms": 45,
      "message": "KV namespace accessible"
    },
    "cron_execution": {
      "status": "pass",
      "last_run": "2026-03-18T12:30:00.000Z",
      "elapsed_minutes": 4,
      "message": "Cron executing normally"
    },
    "cbp_api_reachable": {
      "status": "pass",
      "latency_ms": 234,
      "message": "CBP API responding"
    },
    "stripe_configured": {
      "status": "pass",
      "message": "Stripe keys configured"
    },
    "resend_configured": {
      "status": "pass",
      "message": "Resend API key configured"
    }
  },
  "metrics": {
    "active_subscribers": 1247,
    "premium_users": 89,
    "queue_depth": 0,
    "recent_errors": 0
  },
  "alerts": []
}
```

---

## 🛠️ Setup Instructions

### 1. Sentry Setup

```bash
# Install Sentry CLI
npm install -g @sentry/cli

# Login to Sentry
sentry-cli login

# Create projects
sentry-cli projects create --team nexus-alert worker
sentry-cli projects create --team nexus-alert extension
sentry-cli projects create --team nexus-alert web

# Configure environment variables
# Cloudflare Worker: Add SENTRY_DSN to wrangler.toml
# Chrome Extension: Update src/sentry.js with DSN
# Next.js: Add NEXT_PUBLIC_SENTRY_DSN to .env.local

# Test error reporting
curl -X POST https://api.nexus-alert.com/api/test-error
```

### 2. BetterUptime Setup

```bash
# 1. Sign up at https://betteruptime.com
# 2. Create team "NEXUS Alert"
# 3. Add monitors (see configurations above)
# 4. Create status page: status.nexus-alert.com
# 5. Configure Slack webhook
# 6. Set on-call schedule
```

### 3. Plausible Setup

```bash
# Already configured! Just ensure script tag is present:
<Script
  defer
  data-domain="nexus-alert.com"
  src="https://plausible.io/js/script.js"
  strategy="afterInteractive"
/>
```

---

## 📊 Monitoring Dashboard

Create a custom dashboard combining all data sources:

### Recommended Tools

1. **Grafana Cloud** (Free tier)
   - Connect Sentry data source
   - Connect Cloudflare Analytics API
   - Create unified dashboard

2. **Google Data Studio**
   - Plausible connector
   - BetterUptime connector
   - Custom metrics visualization

### Key Dashboard Panels

```
┌─────────────────────────────────────────┐
│  System Health Overview                 │
│  ✓ API Uptime: 99.97% (7d)              │
│  ✓ Avg Response Time: 234ms             │
│  ⚠ Error Rate: 0.4% (target: <1%)       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  User Metrics (24h)                     │
│  👥 Active Users: 1,247                 │
│  📥 New Installs: 89                    │
│  💎 Conversions: 4                      │
│  🔔 Slots Found: 342                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Recent Errors (1h)                     │
│  🐛 Extension: 0                        │
│  🐛 API: 2 (filtered: bot traffic)      │
│  🐛 Web: 0                              │
└─────────────────────────────────────────┘
```

---

## 🚀 Production Readiness Checklist

- [ ] Sentry configured for all 3 components
- [ ] Plausible script added to web app
- [ ] BetterUptime monitors created (4 monitors)
- [ ] Slack channel #nexus-alert-monitoring created
- [ ] Slack integrations configured (Sentry + BetterUptime)
- [ ] PagerDuty service created (optional but recommended)
- [ ] Status page published: status.nexus-alert.com
- [ ] On-call rotation schedule defined
- [ ] Incident response runbook created
- [ ] Monthly monitoring review scheduled
- [ ] SLO targets defined and baseline measured

---

## 📞 On-Call Runbook

### Incident: API Health Check Failing

**Symptom**: BetterUptime alerts `/health` returning 500 or timing out

**Diagnosis**:
```bash
# 1. Check worker logs
wrangler tail --env production

# 2. Check KV namespace
curl https://api.nexus-alert.com/health | jq .

# 3. Check Cloudflare dashboard
# - Workers > Analytics > Errors
# - Account > Audit Log > Recent changes

# 4. Check CBP API
curl https://ttp.cbp.dhs.gov/schedulerapi/slots?locationId=5020&minimum=1
```

**Resolution**:
- If KV inaccessible: Check Cloudflare status page
- If Cron not running: Check wrangler.toml cron config
- If CBP API down: Normal - ignore, auto-recovers
- If Stripe/Resend unconfigured: Check environment variables

### Incident: High Error Rate in Extension

**Symptom**: Sentry shows spike in extension errors

**Diagnosis**:
```bash
# 1. Check Sentry breadcrumbs for user actions
# 2. Check if errors are Chrome version specific
# 3. Check if errors are location/config specific
# 4. Review recent Chrome extension updates
```

**Resolution**:
- If Chrome API errors: Update manifest permissions
- If specific to Chrome version: Add version guard
- If CBP API errors: Known issue, filter in Sentry
- If user config issue: Add validation before save

---

## 📅 Regular Maintenance

### Daily
- Review Sentry errors (5min)
- Check BetterUptime status (automated)

### Weekly
- Review analytics trends (15min)
- Check SLO compliance (10min)
- Clear false-positive Sentry issues (10min)

### Monthly
- Generate uptime report
- Review and update SLOs
- Analyze user growth metrics
- Update on-call rotation
- Review and optimize monitoring costs

---

**Last Updated**: 2026-03-18
**Owner**: Engineering Team
**Contact**: engineering@nexus-alert.com
