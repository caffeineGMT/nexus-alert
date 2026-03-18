# Backend Implementation Notes

## Signed Unsubscribe URLs

### Overview
Secure unsubscribe links using HMAC-SHA256 signatures to prevent unauthorized unsubscriptions.

### Implementation Details

**Token Generation** (in `sendEmailNotification`):
- Uses Web Crypto API (available in Cloudflare Workers runtime)
- HMAC-SHA256 with `WEBHOOK_SECRET` as the signing key
- Base64-encoded signature of the email address
- URL-safe encoding via `encodeURIComponent`

**Token Verification** (in `handleSignedUnsubscribe`):
- Constant-time verification using `crypto.subtle.verify()` to prevent timing attacks
- Rejects invalid or tampered tokens with 403 status
- Returns HTML response on success/failure (no JSON for user-facing endpoint)

**Security Features**:
- No replay attack protection needed (unsubscribe is idempotent)
- Constant-time comparison prevents timing side-channel attacks
- Token is derived from email, so can't be used for different email

### Example Unsubscribe URL
```
https://api.nexus-alert.com/api/unsubscribe?email=user%40example.com&token=uQR%2FkrF6s0kFDPWo%2BknyYPqAzzrfKmj5vdRLVY3owwk%3D
```

### API Endpoint
```
GET /api/unsubscribe?email={email}&token={token}

Success (200):
<html><body><p>You have been unsubscribed.</p></body></html>

Invalid Token (403):
{"error": "Invalid or expired token"}

Missing Parameters (400):
<html><body><p>Invalid unsubscribe link.</p></body></html>
```

---

## Twilio SMS Notifications

### Overview
Premium tier subscribers receive SMS alerts in addition to email notifications.

### Subscriber Schema Updates
```json
{
  "email": "user@example.com",
  "locations": [5020],
  "program": "NEXUS",
  "dateRange": { "start": null, "end": null },
  "timeRange": { "start": null, "end": null },
  "phone": "+16045551234",  // NEW: E.164 format
  "tier": "premium",         // NEW: 'free' or 'premium'
  "createdAt": "2025-01-15T10:00:00Z",
  "notifiedSlots": {}
}
```

### SMS Flow
1. After email notification is sent successfully
2. Check if `sub.phone` exists AND `sub.tier === 'premium'`
3. Call `sendSmsNotification()` via Twilio API
4. Non-blocking: SMS failures are logged but don't stop email delivery

### Twilio Integration

**API Endpoint**: `POST https://api.twilio.com/2010-04-01/Accounts/{SID}/Messages.json`

**Authentication**: HTTP Basic Auth with `TWILIO_ACCOUNT_SID:TWILIO_AUTH_TOKEN`

**Message Format**:
```
NEXUS Alert: 3 slot(s) found at Location 5020. Book now: https://ttp.cbp.dhs.gov
```

**Error Handling**:
- Silently logs errors to console
- Does NOT throw exceptions (prevents blocking email delivery)
- Gracefully handles missing Twilio credentials (skips SMS)

### Required Secrets (wrangler.toml)
```bash
wrangler secret put TWILIO_ACCOUNT_SID     # Your Twilio Account SID
wrangler secret put TWILIO_AUTH_TOKEN      # Your Twilio Auth Token
wrangler secret put TWILIO_FROM_NUMBER     # Your Twilio phone number (E.164)
```

### Testing with Twilio Test Credentials
For development/testing without real SMS:
- Account SID: `ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- Auth Token: Test credentials from Twilio console
- From Number: Twilio test number
- To Number: Your verified number

---

## Deployment Checklist

- [ ] Set KV namespace ID in wrangler.toml
- [ ] Configure secrets via `wrangler secret put`:
  - `WEBHOOK_SECRET`
  - `RESEND_API_KEY`
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_FROM_NUMBER`
- [ ] Deploy: `npm run deploy`
- [ ] Test unsubscribe link in email
- [ ] Test SMS delivery with premium subscriber

## Testing

### Test HMAC Implementation
```bash
node test-unsubscribe.js
```

### Manual API Tests

**Create Premium Subscriber**:
```bash
curl -X POST https://api.nexus-alert.com/api/subscribe \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "locations": [5020],
    "phone": "+16045551234",
    "tier": "premium"
  }'
```

**Trigger Manual Check**:
```bash
curl -X POST https://api.nexus-alert.com/api/check \
  -H "Authorization: Bearer YOUR_SECRET"
```

**Test Unsubscribe** (GET in browser):
```
https://api.nexus-alert.com/api/unsubscribe?email=test%40example.com&token=VALID_TOKEN
```
