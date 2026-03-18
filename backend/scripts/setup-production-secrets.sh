#!/bin/bash

# Production Secrets Setup Script for NEXUS Alert
# This script helps you set all required secrets for the production environment

set -e

echo "════════════════════════════════════════════════════════════════"
echo "  NEXUS Alert Production Secrets Setup"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "This script will guide you through setting all required secrets"
echo "for the production environment using wrangler."
echo ""
echo "Prerequisites:"
echo "  - You must be logged in to Cloudflare (run: npx wrangler login)"
echo "  - You must have all API keys ready from Stripe, Resend, and Twilio"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."
echo ""

# Function to set a secret
set_secret() {
    local secret_name=$1
    local description=$2
    local example=$3

    echo "────────────────────────────────────────────────────────────────"
    echo "Setting: $secret_name"
    echo "Description: $description"
    if [ -n "$example" ]; then
        echo "Example: $example"
    fi
    echo "────────────────────────────────────────────────────────────────"

    npx wrangler secret put "$secret_name" --env production

    if [ $? -eq 0 ]; then
        echo "✅ $secret_name set successfully"
    else
        echo "❌ Failed to set $secret_name"
        return 1
    fi
    echo ""
}

# Function to generate a secure webhook secret
generate_webhook_secret() {
    if command -v openssl &> /dev/null; then
        echo "$(openssl rand -hex 32)"
    else
        # Fallback if openssl not available
        echo "$(head -c 32 /dev/urandom | base64 | tr -d '/+=' | cut -c1-64)"
    fi
}

echo "════════════════════════════════════════════════════════════════"
echo "  STRIPE SECRETS"
echo "════════════════════════════════════════════════════════════════"
echo ""

set_secret "STRIPE_SECRET_KEY" \
    "Stripe API secret key for payment processing" \
    "sk_live_..."

set_secret "STRIPE_WEBHOOK_SECRET" \
    "Stripe webhook signing secret for verifying webhook events" \
    "whsec_..."

set_secret "STRIPE_PRICE_ID" \
    "Stripe price ID for the premium tier subscription" \
    "price_..."

echo "════════════════════════════════════════════════════════════════"
echo "  EMAIL NOTIFICATIONS (RESEND)"
echo "════════════════════════════════════════════════════════════════"
echo ""

set_secret "RESEND_API_KEY" \
    "Resend.com API key for sending email notifications" \
    "re_..."

echo "════════════════════════════════════════════════════════════════"
echo "  SMS NOTIFICATIONS (TWILIO)"
echo "════════════════════════════════════════════════════════════════"
echo ""

set_secret "TWILIO_ACCOUNT_SID" \
    "Twilio Account SID" \
    "AC..."

set_secret "TWILIO_AUTH_TOKEN" \
    "Twilio authentication token" \
    ""

set_secret "TWILIO_FROM_NUMBER" \
    "Twilio phone number in E.164 format" \
    "+15551234567"

echo "════════════════════════════════════════════════════════════════"
echo "  INTERNAL API SECURITY"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Generate a webhook secret
WEBHOOK_SECRET=$(generate_webhook_secret)
echo "A secure webhook secret has been generated for you:"
echo "  $WEBHOOK_SECRET"
echo ""
echo "You can use this value or provide your own."
echo ""

read -p "Press Enter to use the generated secret, or Ctrl+C to cancel and set manually: "

echo "$WEBHOOK_SECRET" | npx wrangler secret put WEBHOOK_SECRET --env production

if [ $? -eq 0 ]; then
    echo "✅ WEBHOOK_SECRET set successfully"
    echo ""
    echo "⚠️  IMPORTANT: Save this webhook secret securely!"
    echo "   You'll need it to configure your Chrome extension and landing page."
    echo "   Webhook Secret: $WEBHOOK_SECRET"
else
    echo "❌ Failed to set WEBHOOK_SECRET"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  ✅ SECRET SETUP COMPLETE"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "All secrets have been configured for production."
echo ""
echo "Next steps:"
echo "  1. Verify secrets: npx wrangler secret list --env production"
echo "  2. Deploy to production: npm run deploy -- --env production"
echo "  3. Configure custom domain: https://dash.cloudflare.com"
echo "  4. Test status endpoint: curl https://api.nexus-alert.com/api/status"
echo ""
echo "For detailed deployment instructions, see PRODUCTION_DEPLOYMENT.md"
echo ""
