# Deployment Guide: Batched Processing + Queues

## Prerequisites

- Cloudflare account with Workers enabled
- Wrangler CLI installed (`npm install -g wrangler`)
- Logged in to Cloudflare (`wrangler login`)

## Step 1: Create KV Namespace (if not already created)

```bash
# Development
wrangler kv:namespace create NEXUS_ALERTS_KV

# Production
wrangler kv:namespace create NEXUS_ALERTS_KV --env production
```

Update `wrangler.toml` with the returned IDs.

## Step 2: Create Cloudflare Queues

### Development Queue

```bash
# Create main queue
wrangler queues create email-notifications

# Create dead letter queue (for failed messages)
wrangler queues create email-notifications-dlq
```

**Expected output:**
```
✅ Created queue email-notifications
✅ Created queue email-notifications-dlq
```

### Production Queue

```bash
# Create production main queue
wrangler queues create email-notifications-prod

# Create production DLQ
wrangler queues create email-notifications-prod-dlq
```

**Verify queues exist:**
```bash
wrangler queues list
```

## Step 3: Configure Secrets

Set all required secrets for production:

```bash
# Stripe
wrangler secret put STRIPE_SECRET_KEY --env production
wrangler secret put STRIPE_WEBHOOK_SECRET --env production
wrangler secret put STRIPE_MONTHLY_PRICE_ID --env production
wrangler secret put STRIPE_ANNUAL_PRICE_ID --env production

# Email (Resend)
wrangler secret put RESEND_API_KEY --env production

# SMS (Twilio)
wrangler secret put TWILIO_ACCOUNT_SID --env production
wrangler secret put TWILIO_AUTH_TOKEN --env production

# Internal API auth
wrangler secret put WEBHOOK_SECRET --env production

# Slack alerts
wrangler secret put SLACK_WEBHOOK_URL --env production
```

## Step 4: Update wrangler.toml

Ensure your `wrangler.toml` has the correct queue bindings:

```toml
# Development
[[queues.producers]]
queue = "email-notifications"
binding = "EMAIL_QUEUE"

[[queues.consumers]]
queue = "email-notifications"
max_batch_size = 10
max_batch_timeout = 30
max_retries = 3
dead_letter_queue = "email-notifications-dlq"

# Production
[env.production]
[[env.production.queues.producers]]
queue = "email-notifications-prod"
binding = "EMAIL_QUEUE"

[[env.production.queues.consumers]]
queue = "email-notifications-prod"
max_batch_size = 10
max_batch_timeout = 30
max_retries = 3
dead_letter_queue = "email-notifications-prod-dlq"
```

## Step 5: Deploy Worker

### Development Deployment
```bash
wrangler deploy
```

### Production Deployment
```bash
wrangler deploy --env production
```

**Expected output:**
```
✨ Built successfully
✨ Uploading worker bundle
✨ Deployment complete! 🎉
https://nexus-alert-backend.your-subdomain.workers.dev
```

## Step 6: Initialize KV Data

### Create Initial Subscriber List
```bash
# Empty list to start
wrangler kv:key put --binding=NEXUS_ALERTS_KV "subscriber_list" "[]" --env production

# Initialize cursor
wrangler kv:key put --binding=NEXUS_ALERTS_KV "cron_cursor" "0" --env production

# Initialize stats
wrangler kv:key put --binding=NEXUS_ALERTS_KV "total_checks" "0" --env production
wrangler kv:key put --binding=NEXUS_ALERTS_KV "total_notifications" "0" --env production
```

## Step 7: Test Cron Trigger

### Manual Cron Trigger (Development)
```bash
# Trigger scheduled handler locally
wrangler dev --test-scheduled
```

### Manual Cron Trigger (Production)
```bash
# Via internal API (requires WEBHOOK_SECRET)
curl -X POST https://nexus-alert-backend.your-subdomain.workers.dev/api/check \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET"
```

### Verify Cron Execution
```bash
# Check cursor value (should increment by 100 after each run)
wrangler kv:key get --binding=NEXUS_ALERTS_KV "cron_cursor" --env production

# Check last run time
wrangler kv:key get --binding=NEXUS_ALERTS_KV "last_run" --env production
```

## Step 8: Monitor Queue Processing

### View Queue Metrics (Cloudflare Dashboard)
1. Go to: Cloudflare Dashboard → Workers & Pages → Queues
2. Select: `email-notifications-prod`
3. View: Message throughput, Processing time, Failed messages

### Check Dead Letter Queue
```bash
# List messages in DLQ (should be empty if all working)
wrangler queues consumer list email-notifications-prod-dlq
```

### Manual Queue Testing
```bash
# Publish test message to queue
wrangler queues send email-notifications-prod \
  '{"type":"email","email":"test@example.com","slots":[{"startTimestamp":"2026-03-20T10:00:00","locationId":5020}]}'
```

## Step 9: Load Testing (Staging/Dev Only)

### Quick Configuration Test
```bash
npm run load-test
```

### Full Integration Test (Creates 1000 test subscribers)
```bash
# Run against preview/dev environment ONLY
npm run load-test:full
```

**⚠️ WARNING:** Do NOT run full load test against production!

### Stripe Webhook Load Test
```bash
# Requires Stripe CLI
npm run load-test:stripe
```

## Step 10: Monitoring Setup

### Cloudflare Analytics
1. Navigate to: Workers & Pages → nexus-alert-backend → Metrics
2. Monitor:
   - Invocations (should spike every 2 minutes)
   - Errors (should be 0%)
   - CPU time (should be <50ms/request)

### Sentry Error Tracking
Ensure `SENTRY_DSN` is set in `wrangler.toml` vars:
```toml
[env.production.vars]
SENTRY_DSN = "https://YOUR_PROJECT_ID.ingest.sentry.io/YOUR_KEY"
```

### KV Operation Monitoring
1. Navigate to: Workers & Pages → KV → NEXUS_ALERTS_KV → Metrics
2. Watch: Read operations, Write operations
3. Alert if: ops/sec approaches 1000 (free tier limit)

### Slack Alerts
- Already configured in code (`sendSlackAlert()`)
- Fires on: Cron failures, consecutive CBP API failures

## Troubleshooting

### Queue Messages Not Processing
```bash
# Check queue consumer status
wrangler queues consumer list email-notifications-prod

# Check for messages in DLQ
wrangler queues consumer http email-notifications-prod-dlq

# View worker logs
wrangler tail --env production
```

### Cursor Not Advancing
```bash
# Check current cursor
wrangler kv:key get --binding=NEXUS_ALERTS_KV "cron_cursor" --env production

# Check subscriber list
wrangler kv:key get --binding=NEXUS_ALERTS_KV "subscriber_list" --env production

# Manually reset cursor
wrangler kv:key put --binding=NEXUS_ALERTS_KV "cron_cursor" "0" --env production
```

### Cron Not Firing
```bash
# Check cron trigger configuration
wrangler deployments list --env production

# Verify cron schedule in wrangler.toml
# Should be: crons = ["*/2 * * * *"]

# Check Cloudflare dashboard: Workers & Pages → nexus-alert-backend → Triggers
```

### High KV Operation Rate
```bash
# View current KV metrics
# Cloudflare Dashboard → KV → NEXUS_ALERTS_KV → Metrics

# If approaching limit:
# Option 1: Reduce batch size (edit BATCH_SIZE in worker.js)
# Option 2: Upgrade to Workers Paid ($5/mo for 10M ops)
```

## Rollback Procedure

If deployment causes issues:

1. **Immediate rollback:**
```bash
wrangler rollback --env production
```

2. **Disable cron temporarily:**
```toml
# In wrangler.toml, comment out cron:
# [env.production.triggers]
# crons = [] # Disabled
```

3. **Drain queue:**
```bash
# Wait for queue to process remaining messages
# Monitor: Cloudflare Dashboard → Queues → email-notifications-prod
```

4. **Revert to previous version:**
```bash
git revert HEAD
wrangler deploy --env production
```

## Performance Benchmarks

After deployment, verify these metrics:

| Metric | Target | How to Check |
|--------|--------|--------------|
| Batch duration | <2 min | Worker logs (batch_duration_ms) |
| KV ops/sec | <10 | Cloudflare KV Metrics |
| Queue processing | <30s | Queue metrics (processing time) |
| Cron success rate | >99% | Sentry (cron_failed events) |
| Email delivery | >95% | Resend dashboard |

## Scaling Checklist

Before scaling to 10,000+ subscribers:

- [ ] Monitor KV ops/sec for 1 week at current load
- [ ] Test with 1,000 subscribers first
- [ ] Verify queue DLQ is empty
- [ ] Confirm Resend API key has sufficient quota
- [ ] Consider Workers Paid plan ($5/mo)
- [ ] Set up PagerDuty/Slack alerts for critical failures
- [ ] Document peak load times (likely after CBP releases new slots)

## Cost Estimate

### Free Tier (Current)
- Workers: 100,000 requests/day (unlimited with $5 Workers Paid)
- KV: 100,000 reads/day, 1,000 writes/day
- Queues: 1,000,000 messages/month
- **Est. cost:** $0/month (within free limits for <1,000 users)

### Workers Paid (10,000+ users)
- Workers: $5/month (unlimited requests)
- KV: $0.50/million ops (beyond free tier)
- Queues: $0.40/million messages
- **Est. cost:** $5-10/month for 10,000 users

## Post-Deployment Checklist

- [ ] Cron running every 2 minutes (check logs)
- [ ] Cursor advancing correctly (0 → 100 → 200 → ...)
- [ ] Queue processing emails (check Resend sent emails)
- [ ] No errors in Sentry
- [ ] KV ops/sec <10 (Cloudflare dashboard)
- [ ] Dead letter queue empty
- [ ] Slack alerts configured and tested
- [ ] Load test passed (development)
- [ ] Documentation updated with production URLs

## Support

For issues:
1. Check worker logs: `wrangler tail --env production`
2. Check Sentry for exceptions
3. Check Cloudflare dashboard for queue/KV metrics
4. Review BATCHED_PROCESSING.md for architecture details
