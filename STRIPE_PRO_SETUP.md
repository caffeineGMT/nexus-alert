# Stripe Pro Tier Setup Guide

This guide walks through creating the NEXUS Alert Pro tier product in Stripe and configuring the backend.

## Step 1: Create Product in Stripe Dashboard

1. Log in to https://dashboard.stripe.com
2. Navigate to **Products** → **Add product**
3. Fill in product details:
   - **Name:** NEXUS Alert Pro
   - **Description:** Multi-client appointment monitoring for immigration lawyers (up to 20 clients)
   - **Pricing:**
     - **Price:** $49
     - **Billing period:** Monthly
     - **Currency:** USD
4. Click **Save product**

## Step 2: Copy Price ID

After creating the product:

1. Click on the product you just created
2. Under **Pricing**, you'll see a price entry with an ID starting with `price_`
3. Copy this Price ID (example: `price_1AbC2DeF3GhI4JkL5MnO6PqR`)

## Step 3: Add Price ID to Backend Config

### Option A: Environment Variable (Recommended for Production)

Set the Stripe secret via Wrangler CLI:

```bash
cd backend
wrangler secret put STRIPE_PRO_PRICE_ID --env production
# Paste the price_ ID when prompted
```

### Option B: wrangler.toml (Development Only)

Edit `backend/wrangler.toml`:

```toml
[vars]
STRIPE_PRO_PRICE_ID = "price_1AbC2DeF3GhI4JkL5MnO6PqR"  # Replace with your actual Price ID
```

**⚠️ Warning:** Do NOT commit real Price IDs to version control. Use environment variables in production.

## Step 4: Verify Webhook Integration

The Pro tier uses the same Stripe webhook as the standard Premium tier. Ensure your webhook endpoint is configured:

1. Go to **Developers** → **Webhooks** in Stripe Dashboard
2. Verify webhook URL is set to: `https://api.nexus-alert.com/api/webhook`
3. Ensure these events are enabled:
   - `checkout.session.completed`
   - `customer.subscription.deleted`

## Step 5: Test Pro Checkout Flow

### Test in Development

1. Start the backend worker:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the web app:
   ```bash
   cd web
   npm run dev
   ```

3. Navigate to `http://localhost:3000/pro`

4. Enter a test email and click "Start 60-Day Free Trial"

5. Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any ZIP code

6. Verify in Stripe Dashboard:
   - New subscription created with 60-day trial
   - Price ID matches Pro tier
   - Metadata includes `tier: 'pro'`

### Test Pro Client Management

After completing test checkout:

1. Navigate to `http://localhost:3000/pro/dashboard`
2. Click "Add Client"
3. Enter test client email and location IDs (e.g., `5020, 5402`)
4. Verify client appears in dashboard
5. Check KV storage:
   ```bash
   wrangler kv:key get "pro:your-email@test.com:clients" --namespace-id YOUR_KV_ID
   ```

## Step 6: Deploy to Production

1. Deploy backend with Pro tier support:
   ```bash
   cd backend
   wrangler deploy --env production
   ```

2. Deploy web app with Pro pages:
   ```bash
   cd web
   npm run build
   # Deploy to your hosting provider (Vercel, Netlify, etc.)
   ```

## Step 7: Monitor Pro Subscriptions

### View Active Pro Customers

Check KV for all licenses with `tier: 'pro'`:

```bash
wrangler kv:key list --prefix "license:" --namespace-id YOUR_KV_ID
```

Then inspect individual keys:

```bash
wrangler kv:key get "license:customer@example.com" --namespace-id YOUR_KV_ID
```

Expected output for Pro customer:

```json
{
  "status": "pro",
  "stripeCustomerId": "cus_...",
  "stripeSubscriptionId": "sub_...",
  "activatedAt": "2026-03-18T...",
  "tier": "pro",
  "billingCycle": "pro"
}
```

### Monitor Client Lists

Check how many clients a Pro customer has:

```bash
wrangler kv:key get "pro:lawyer@lawfirm.com:clients" --namespace-id YOUR_KV_ID
```

Expected output:

```json
[
  "client1@example.com",
  "client2@example.com",
  "client3@example.com"
]
```

## Troubleshooting

### Issue: "Pro tier Price ID not configured" error

**Solution:** Ensure `STRIPE_PRO_PRICE_ID` is set correctly:

```bash
wrangler secret put STRIPE_PRO_PRICE_ID --env production
```

### Issue: White-label emails not sending

**Solution:** Check that:
1. `RESEND_API_KEY` is configured
2. Client subscriber record has `lawFirmEmail` field set
3. Client tier is `'pro_client'`

Debug by checking logs:

```bash
wrangler tail --env production
```

### Issue: Client limit not enforced

**Solution:** The limit is set to 20 clients in `handleAddProClient()`. To change:

Edit `backend/src/worker.js` line ~1187:

```javascript
if (clients.length >= 20 && !clients.includes(clientEmail)) {
  // Change 20 to your desired limit
}
```

## Analytics

### Track Pro Conversions

Query KV for billing cycle analytics:

```bash
# Total Pro subscriptions
wrangler kv:key list --prefix "license:" --namespace-id YOUR_KV_ID | grep '"tier":"pro"' | wc -l
```

### Calculate Pro MRR

```javascript
// In backend/src/worker.js, add to handleGetStats():
const proLicenseKeys = await env.NEXUS_ALERTS_KV.list({ prefix: 'license:' });
const proCount = await Promise.all(
  proLicenseKeys.keys.map(async (key) => {
    const data = await env.NEXUS_ALERTS_KV.get(key.name);
    if (!data) return false;
    const license = JSON.parse(data);
    return license.tier === 'pro';
  })
).then(results => results.filter(Boolean).length);

const proMRR = proCount * 49; // $49/month per Pro customer
```

## Next Steps

1. ✅ Create Stripe Product
2. ✅ Configure Price ID in backend
3. ✅ Test checkout flow
4. ✅ Test client management
5. ✅ Deploy to production
6. ✅ Launch B2B outreach (see `marketing/b2b-outreach.md`)

For B2B cold email strategy, see: `marketing/b2b-outreach.md`
