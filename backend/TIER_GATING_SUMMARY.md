# Tier-Gated Polling Implementation Summary

## Overview
Implemented tier-based rate limiting for NEXUS Alert backend to differentiate between free and premium users.

## Changes Made

### 1. Cron Schedule Update (`wrangler.toml`)
- **Changed:** Cron trigger from `*/3 * * * *` to `*/2 * * * *`
- **Result:** Worker now runs every 2 minutes instead of 3

### 2. Subscriber Schema Updates (`worker.js`)
All subscriber records now conform to the updated schema:
```javascript
{
  email: string,
  locations: string[],
  program: 'NEXUS' | 'GOES' | 'SENTRI',
  dateRange: { start: string, end: string } | null,
  timeRange: { start: string, end: string } | null,
  tier: 'free' | 'premium',           // NEW: Default 'free', upgraded via Stripe
  last_checked_at: string | null,     // NEW: ISO timestamp of last check
  phone: string | null,               // NEW: E.164 format (e.g., +16045551234)
  createdAt: string,
  notifiedSlots: {}
}
```

**Migration Note:** No backfill required - missing fields handled with nullish coalescing at read time.

### 3. Tier-Based Rate Limiting (`checkAllSubscribers()`)

#### License Lookup
For each subscriber, the effective tier is determined by:
```javascript
const licenseData = await env.NEXUS_ALERTS_KV.get(`license:${email}`);
const license = licenseData ? JSON.parse(licenseData) : {};
const tier = license.tier ?? sub.tier ?? 'free';
```

#### Free User Rate Limiting
Free tier users are skipped if checked within the last 30 minutes:
```javascript
if (tier === 'free') {
  const lastCheckedAt = sub.last_checked_at;
  if (lastCheckedAt) {
    const lastChecked = new Date(lastCheckedAt).getTime();
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;

    if (now - lastChecked < thirtyMinutes) {
      console.log(`[NEXUS Alert] Skipping free user ${email} (last checked ${Math.round((now - lastChecked) / 60000)} min ago)`);
      continue; // Skip this subscriber
    }
  }
}
```

#### Premium Users
Premium tier users are **always** checked on every cron run (every 2 minutes).

#### Timestamp Update
After processing (whether or not new slots were found), `last_checked_at` is updated for **all** subscribers:
```javascript
sub.last_checked_at = new Date().toISOString();
await env.NEXUS_ALERTS_KV.put(`sub:${sub.email}`, JSON.stringify(sub));
```

### 4. New API Endpoint: PUT /api/subscriber

Allows users to update their subscription preferences without changing tier (tier changes only via Stripe webhook).

**Request:**
```json
PUT /api/subscriber
Authorization: Bearer <WEBHOOK_SECRET>

{
  "email": "user@example.com",
  "locations": [5020, 5021],
  "program": "NEXUS",
  "dateRange": { "start": "2026-04-01", "end": "2026-06-30" },
  "timeRange": { "start": "08:00", "end": "17:00" },
  "phone": "+16045551234"
}
```

**Response:**
```json
{
  "success": true
}
```

**Error Cases:**
- `400 Bad Request` - Missing email
- `404 Not Found` - Subscriber not found

**Security:** Tier field is **not** user-modifiable via this endpoint. Only Stripe webhooks can change tier.

### 5. CORS Headers Update
Added `PUT` method to CORS allowed methods:
```javascript
'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
```

## Effective Polling Intervals

| Tier | Cron Schedule | Rate Limit | Effective Check Frequency |
|------|---------------|------------|---------------------------|
| Free | Every 2 min   | 30 min cooldown | **Once per 30 minutes** |
| Premium | Every 2 min | No cooldown | **Every 2 minutes** |

## Testing

### Manual Trigger via API
```bash
curl -X POST https://your-worker.workers.dev/api/check \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET"
```

### Test Scheduled Trigger (Wrangler Dev)
```bash
cd backend
wrangler dev --test-scheduled
```

Then in another terminal:
```bash
curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"
```

### Verify Free User Rate Limiting
1. Create a free subscriber
2. Trigger check manually (sets `last_checked_at`)
3. Trigger check again immediately
4. Check logs - should see: `Skipping free user ... (last checked X min ago)`
5. Wait 30+ minutes
6. Trigger check again - should process normally

### Verify Premium User Always Checked
1. Create a subscriber with `tier: 'premium'`
2. Trigger check multiple times within 30 minutes
3. Check logs - should see processing every time (no skipping)

## Deployment

```bash
cd backend
wrangler deploy
```

## Notes

- **License records** are stored separately at `license:{email}` and take precedence over subscriber tier
- **Stripe webhook** will update license records to set `tier: 'premium'` on subscription creation
- **Phone numbers** must be in E.164 format (e.g., `+16045551234`)
- **SMS notifications** only sent to premium subscribers with phone numbers
- **KV namespace binding** updated from `NEXUS_KV` to `NEXUS_ALERTS_KV` for consistency

## Key Files Modified

1. `wrangler.toml` - Cron schedule (2min), KV binding
2. `src/worker.js` - Schema, rate limiting, PUT endpoint, HMAC helpers, SMS support
