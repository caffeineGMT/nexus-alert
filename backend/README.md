# NEXUS Alert Backend — Setup Guide

## Overview
Cloudflare Worker that monitors CBP appointment slots server-side and sends email notifications via Resend.

## Prerequisites
- Cloudflare account (free tier works)
- [Resend](https://resend.com) account for email delivery (free: 100 emails/day)
- Node.js 18+

## Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Create KV namespace
```bash
npx wrangler kv:namespace create "NEXUS_KV"
```
Copy the `id` output into `wrangler.toml`.

### 3. Set secrets
```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put WEBHOOK_SECRET
```

### 4. Deploy
```bash
npm run deploy
```

## API

All endpoints require `Authorization: Bearer <WEBHOOK_SECRET>` header.

### Subscribe
```bash
curl -X POST https://your-worker.workers.dev/api/subscribe \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "you@example.com",
    "locations": [5020],
    "program": "NEXUS",
    "dateRange": { "start": null, "end": null },
    "timeRange": { "start": "08:00", "end": "17:00" }
  }'
```

### Unsubscribe
```bash
curl -X POST https://your-worker.workers.dev/api/unsubscribe \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{ "email": "you@example.com" }'
```

### Status
```bash
curl https://your-worker.workers.dev/api/status \
  -H "Authorization: Bearer YOUR_SECRET"
```

### Manual Check
```bash
curl -X POST https://your-worker.workers.dev/api/check \
  -H "Authorization: Bearer YOUR_SECRET"
```

## How It Works
1. Cron trigger fires every 3 minutes
2. Fetches all unique locations across subscribers
3. Queries CBP scheduler API for available slots
4. Filters by each subscriber's date/time preferences
5. Deduplicates against previously notified slots
6. Sends formatted HTML emails via Resend
7. Tracks notification state in KV

## Costs
- Cloudflare Workers free tier: 100,000 requests/day
- Resend free tier: 100 emails/day, 3,000/month
- Total: $0/month for personal use
