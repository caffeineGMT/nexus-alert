#!/usr/bin/env bash
set -euo pipefail

echo '==> Creating KV namespace...'
KV_OUTPUT=$(npx wrangler kv:namespace create NEXUS_ALERTS_KV 2>&1)
KV_ID=$(echo "$KV_OUTPUT" | grep -oP 'id = "\K[^"]+' | head -1)
if [ -z "$KV_ID" ]; then echo 'ERROR: Could not extract KV ID'; echo "$KV_OUTPUT"; exit 1; fi
echo "KV namespace ID: $KV_ID"

echo '==> Patching wrangler.toml...'
sed -i.bak "s/YOUR_KV_NAMESPACE_ID/$KV_ID/" wrangler.toml
rm wrangler.toml.bak

echo '==> Setting secrets (follow prompts)...'
for SECRET in WEBHOOK_SECRET RESEND_API_KEY STRIPE_SECRET_KEY STRIPE_WEBHOOK_SECRET STRIPE_PRICE_ID TWILIO_ACCOUNT_SID TWILIO_AUTH_TOKEN TWILIO_FROM_NUMBER; do
  echo "--- Setting $SECRET ---"
  npx wrangler secret put "$SECRET"
done

echo '==> Deploying...'
npm run deploy
echo 'Done.'
