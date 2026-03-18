# NEXUS Alert Monitoring & Analytics Setup

This document outlines the complete monitoring, error tracking, analytics, and customer support infrastructure integrated into NEXUS Alert.

## 🎯 Overview

We've integrated:
- **Sentry Error Tracking** for extension and backend
- **Cloudflare Analytics** with custom metrics
- **Slack Alerts** for critical failures
- **Crisp.chat** live customer support
- **Help Center** with 10 knowledge base articles

---

## 1. Sentry Error Tracking

### Extension Setup (Chrome Extension)

**Package**: `@sentry/browser` (v10.44.0)

**Integration**: Added to `background.js` (lines 4-15)

```javascript
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'https://REPLACE_WITH_YOUR_SENTRY_DSN@sentry.io/PROJECT_ID',
  environment: 'production',
  tracesSampleRate: 0.1,
});
```

**Error Capture Points**:
- `fetchAndCacheLocations()` - API failures when fetching location data
- `checkAllLocations()` - Slot checking failures with failure count tracking
- `playAlertSound()` - Audio playback issues

**Setup Steps**:
1. Create a Sentry project at [sentry.io](https://sentry.io) (free tier: 5k events/month)
2. Copy the DSN from Project Settings → Client Keys
3. Replace `REPLACE_WITH_YOUR_SENTRY_DSN` in `background.js`
4. Deploy extension: `npm run package`

---

### Backend Setup (Cloudflare Workers)

**Package**: `@sentry/cloudflare` (installed via npm)

**Integration**: Added to `backend/src/worker.js` (lines 5, 16-25, 108-113)

```javascript
import { Toucan } from '@sentry/cloudflare';

// In fetch handler:
const sentry = new Toucan({
  dsn: env.SENTRY_DSN,
  context: ctx,
  request,
  environment: env.ENVIRONMENT || 'production',
});
```

**Error Capture Points**:
- HTTP request errors in `fetch()` handler
- Cron job failures in `scheduled()` handler
- All uncaught exceptions

**Configuration**: Added to `backend/wrangler.toml` (line 29)

```toml
[vars]
SENTRY_DSN = "" # Set your Sentry DSN here
```

**Setup Steps**:
1. Create a separate Sentry project for the backend (or use the same one)
2. Add DSN to `backend/wrangler.toml`
3. Deploy: `cd backend && npm run deploy`

---

## 2. Cloudflare Workers Analytics

### Custom Metrics

We log structured JSON to `console.log()` which Cloudflare parses into custom metrics:

**Metric**: `cbp_api_latency_ms`
- **Where**: `fetchSlots()` function
- **Tracks**: CBP API response time per location
- **Format**: `{"metric":"cbp_api_latency_ms","value":123,"locationId":5020}`

**Metric**: `kv_read_latency_ms`
- **Where**: `checkAllSubscribers()` function
- **Tracks**: KV storage read performance
- **Format**: `{"metric":"kv_read_latency_ms","value":45,"operation":"subscriber_list"}`

**Metric**: `cron_duration_ms`
- **Where**: End of `checkAllSubscribers()` function
- **Tracks**: Total cron job duration, subscribers checked, notifications sent
- **Format**: `{"metric":"cron_duration_ms","value":2340,"subscribers_checked":50,"notifications_sent":3,"locations_checked":5}`

### Accessing Analytics

**Cloudflare Dashboard**:
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Navigate to Workers → `nexus-alert-backend` → Metrics
3. View requests, errors, CPU time, and KV operations

**GraphQL API**:
- Use the query in `monitoring/cloudflare-dashboard.graphql`
- Requires Cloudflare API token with Analytics:Read permission
- Get account ID: `wrangler whoami`

**Example**:
```bash
curl -X POST https://api.cloudflare.com/client/v4/graphql \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d @monitoring/cloudflare-dashboard.graphql
```

### Viewing Custom Metrics

Custom metrics are available via `wrangler tail`:

```bash
cd backend
wrangler tail --format json | grep "metric"
```

Output:
```json
{"metric":"cbp_api_latency_ms","value":234,"locationId":5020}
{"metric":"kv_read_latency_ms","value":12,"operation":"subscriber_list"}
{"metric":"cron_duration_ms","value":1523,"subscribers_checked":45,"notifications_sent":2}
```

---

## 3. Slack Alerts

### Setup

**Function**: `sendSlackAlert()` in `backend/src/worker.js` (lines 1050-1069)

**Configuration**:
1. Create Slack incoming webhook:
   - Go to [slack.com/apps](https://slack.com/apps)
   - Search for "Incoming Webhooks"
   - Click "Add to Slack" and select channel
   - Copy webhook URL

2. Add to Cloudflare Workers:
```bash
cd backend
wrangler secret put SLACK_WEBHOOK_URL
# Paste your webhook URL when prompted
```

### Alert Triggers

**1. Cron Job Failures**
- **When**: Cron execution throws uncaught error
- **Where**: `scheduled()` handler catch block
- **Message**: `"Cron job failed: {error message}"`

**2. Stripe Webhook Signature Verification Failures**
- **When**: Invalid Stripe webhook signature
- **Where**: `handleStripeWebhook()` catch block
- **Message**: `"Stripe webhook signature verification failed: {error}"`

**3. CBP API 5xx Errors**
- **When**: CBP API returns 500-599 status for 5+ minutes (3+ consecutive failures)
- **Where**: `fetchSlots()` function
- **Message**: `"CBP API returning 500 errors for X minutes (Y consecutive failures)"`

### Testing Alerts

Trigger a test alert:
```bash
# In backend directory
wrangler dev

# In another terminal, trigger an error:
curl -X POST http://localhost:8787/api/check \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET"
```

---

## 4. Crisp.chat Live Customer Support

### Integration

**Added to**: `web/src/app/layout.tsx` (lines 48-60)

```tsx
<Script id="crisp-chat" strategy="lazyOnload">
  {`
    window.$crisp=[];
    window.CRISP_WEBSITE_ID="REPLACE_WITH_YOUR_CRISP_WEBSITE_ID";
    (function(){
      var d=document;
      var s=d.createElement("script");
      s.src="https://client.crisp.chat/l.js";
      s.async=1;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();
  `}
</Script>
```

### Setup Steps

1. **Create Crisp Account**:
   - Go to [crisp.chat](https://crisp.chat)
   - Sign up (free tier: unlimited conversations, 2 seats)
   - Create a website

2. **Get Website ID**:
   - In Crisp dashboard: Settings → Setup Instructions
   - Copy your `CRISP_WEBSITE_ID` (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

3. **Update Code**:
   - Replace `REPLACE_WITH_YOUR_CRISP_WEBSITE_ID` in `web/src/app/layout.tsx`

4. **Deploy**:
```bash
cd web
npm run build
# Deploy to Vercel or your hosting provider
```

### Features

- Live chat widget in bottom-right corner
- "Live Chat" buttons in Help Center trigger chat programmatically
- Visitor info (page viewed, country, browser) automatically captured
- Chat history and canned responses available

---

## 5. Help Center / Knowledge Base

### Structure

**Main Page**: `/web/src/app/help/page.tsx`
- Lists all 10 articles grouped by category
- Search-friendly with categories: Getting Started, Setup, Premium, Troubleshooting, Privacy, Features, Settings

**Article Pages**: `/web/src/app/help/[slug]/page.tsx`
- Dynamic routes for each article
- SEO-optimized with metadata
- Related articles section
- Email support and live chat CTAs

### Articles

1. **how-to-install** - Extension installation guide
2. **select-enrollment-centers** - Choosing locations to monitor
3. **upgrade-to-premium** - Premium upgrade process
4. **cancel-subscription** - Cancellation instructions
5. **why-no-notifications** - Troubleshooting notifications
6. **data-privacy** - Data collection and privacy practices
7. **check-frequency** - Free vs Premium check intervals
8. **monitor-multiple-locations** - Multi-location monitoring
9. **free-vs-premium** - Tier comparison
10. **change-notification-preferences** - Notification settings

### URLs

- Help Center: `https://nexus-alert.com/help`
- Individual articles: `https://nexus-alert.com/help/{slug}`

### Email Forwarding

Set up email forwarding for `help@nexus-alert.com`:

1. **Cloudflare Email Routing** (free):
   - Go to Cloudflare dashboard → Email → Email Routing
   - Add custom address: `help@nexus-alert.com`
   - Forward to your personal email

2. **Alternative** (Gmail):
   - Set up Google Workspace (paid) or use alias

---

## 6. Testing Acceptance Criteria

### Sentry Integration

**Test**: Trigger an error in background.js
```javascript
// Add to background.js temporarily:
throw new Error('Sentry test error');
```

**Expected**: Error appears in Sentry dashboard within 1 minute

---

### Slack Alerts

**Test**: Simulate CBP API failure
1. Modify `fetchSlots()` to force 500 error
2. Wait 5 minutes (3 consecutive checks)

**Expected**: Slack channel receives alert: `"CBP API returning 500 errors for 5 minutes (3 consecutive failures)"`

---

### Crisp Chat Widget

**Test**: Open landing page
```bash
cd web
npm run dev
# Open http://localhost:3000
```

**Expected**: Blue chat widget appears in bottom-right corner

---

### Help Center

**Test**: Navigate to help pages
```bash
cd web
npm run dev
# Visit http://localhost:3000/help
```

**Expected**:
- 10 articles listed and grouped by category
- Each article link works
- Related articles shown at bottom
- Email/chat buttons functional

---

### Cloudflare Analytics

**Test**: Check metrics in dashboard
1. Trigger slot checks: `curl -X POST http://localhost:8787/api/check -H "Authorization: Bearer SECRET"`
2. Wait 2 minutes
3. Check Workers Analytics dashboard

**Expected**: Metrics show requests, CPU time, KV reads

**Test Custom Metrics**:
```bash
cd backend
wrangler tail --format json | grep metric
```

**Expected**: JSON logs with `cbp_api_latency_ms`, `kv_read_latency_ms`, `cron_duration_ms`

---

## 7. Production Deployment Checklist

### Before Deploying

- [ ] Create Sentry project and copy DSN
- [ ] Replace Sentry DSNs in `background.js` and `wrangler.toml`
- [ ] Create Slack incoming webhook
- [ ] Set `SLACK_WEBHOOK_URL` secret: `wrangler secret put SLACK_WEBHOOK_URL`
- [ ] Create Crisp account and get Website ID
- [ ] Replace `CRISP_WEBSITE_ID` in `web/src/app/layout.tsx`
- [ ] Set up email forwarding for `help@nexus-alert.com`
- [ ] Enable Cloudflare Workers Analytics in dashboard

### Deploy

```bash
# Extension
npm run package
# Upload to Chrome Web Store

# Backend
cd backend
npm install
npm run deploy

# Web
cd ../web
npm install
npm run build
# Deploy to Vercel or hosting provider
```

### Post-Deployment

- [ ] Test Sentry by triggering an error
- [ ] Test Slack alerts by simulating CBP API failure
- [ ] Verify Crisp chat widget loads on production site
- [ ] Check all 10 help articles are accessible
- [ ] Monitor Cloudflare Analytics dashboard for custom metrics
- [ ] Send test email to `help@nexus-alert.com` to verify forwarding

---

## 8. Monitoring Dashboard Setup

### Recommended Tools

1. **Sentry Dashboard** - Real-time error monitoring
   - Set up alerts for high error rates
   - Configure issue assignment to team members

2. **Cloudflare Analytics** - Performance metrics
   - Create custom dashboard with GraphQL query
   - Track API latency, cron duration, KV performance

3. **Slack Channel** - Real-time alerts
   - Create `#nexus-alert-errors` channel
   - Configure webhook notifications
   - Set up mobile push for critical alerts

4. **Crisp Dashboard** - Customer support
   - Monitor unread messages
   - Set up email notifications for new chats
   - Configure auto-replies for common questions

---

## 9. Cost Breakdown

| Service | Free Tier | Paid Tier | Cost |
|---------|-----------|-----------|------|
| **Sentry** | 5,000 events/month | 50,000 events/month | $26/mo |
| **Cloudflare Workers Analytics** | Included | Included | Free |
| **Slack Incoming Webhooks** | Unlimited | Unlimited | Free |
| **Crisp.chat** | Unlimited conversations, 2 seats | Unlimited conversations, unlimited seats | Free / $25/mo |
| **Cloudflare Email Routing** | 100 forwarded emails/day | Unlimited | Free |

**Total**: $0-51/month depending on scale

---

## 10. Next Steps

### Additional Monitoring (Optional)

1. **Uptime Monitoring**
   - Use UptimeRobot (free) or Pingdom
   - Monitor `https://api.nexus-alert.com/api/status` endpoint
   - Alert if backend is down for >5 minutes

2. **RUM (Real User Monitoring)**
   - Integrate Sentry's performance monitoring
   - Track extension load time, API latency from user perspective

3. **A/B Testing**
   - Add PostHog or Amplitude
   - Test different onboarding flows
   - Measure Premium conversion rate

4. **Log Aggregation**
   - Use Cloudflare Logpush to send logs to S3
   - Analyze with tools like Grafana Loki

---

## 11. Troubleshooting

### Sentry Not Receiving Events

- Check DSN is correct in code
- Verify environment is "production" (Sentry filters development events)
- Check Sentry project quota (free tier = 5k events/month)

### Slack Alerts Not Sending

- Verify webhook URL is set: `wrangler secret list`
- Test webhook manually: `curl -X POST $SLACK_WEBHOOK_URL -d '{"text":"test"}'`
- Check Slack channel permissions

### Crisp Chat Widget Not Loading

- Check `CRISP_WEBSITE_ID` is correct
- Verify domain is whitelisted in Crisp dashboard
- Check browser console for JavaScript errors

### Custom Metrics Not Appearing

- Metrics are only in Worker logs, not Cloudflare Analytics UI
- Use `wrangler tail --format json` to view live logs
- Parse logs with tools like `jq` for analysis

---

## 12. Maintenance

### Weekly

- [ ] Review Sentry errors and fix critical issues
- [ ] Check Slack alerts for patterns (repeated CBP API failures)
- [ ] Respond to Crisp chat messages within 24 hours

### Monthly

- [ ] Analyze Cloudflare Analytics trends (API latency increase?)
- [ ] Review help center articles for accuracy
- [ ] Check Sentry quota usage (upgrade if near limit)

### Quarterly

- [ ] Update help articles based on common support questions
- [ ] Review and optimize custom metrics
- [ ] Audit error handling and add missing Sentry captures

---

## Support

For questions about this setup:
- Email: help@nexus-alert.com
- Repository: https://github.com/yourusername/nexus-alert
- Documentation: This file

---

**Last Updated**: March 18, 2026
**Version**: 1.0.0
