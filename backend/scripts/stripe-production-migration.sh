#!/bin/bash
set -e

# ═══════════════════════════════════════════════════════════════════════
# NEXUS Alert — Stripe Production Migration Script
# ═══════════════════════════════════════════════════════════════════════
#
# This script guides you through:
# 1. Creating production products in Stripe
# 2. Updating Cloudflare Worker secrets
# 3. Deploying the updated backend
# 4. Testing end-to-end payment flow
#
# Prerequisites:
# - Stripe account with Live Mode enabled
# - Cloudflare Wrangler CLI authenticated
# - Backend code deployed to Cloudflare Workers
# ═══════════════════════════════════════════════════════════════════════

BOLD="\033[1m"
GREEN="\033[0;32m"
BLUE="\033[0;34m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
RESET="\033[0m"

echo -e "${BOLD}╔════════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║   NEXUS Alert — Stripe Production Migration                   ║${RESET}"
echo -e "${BOLD}╚════════════════════════════════════════════════════════════════╝${RESET}"
echo ""

# ─────────────────────────────────────────────────────────────────
# Step 1: Verify Prerequisites
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}Step 1: Verifying Prerequisites${RESET}"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}✗ Wrangler CLI not found${RESET}"
    echo "Install: npm install -g wrangler"
    exit 1
fi
echo -e "${GREEN}✓ Wrangler CLI installed${RESET}"

# Check if in backend directory
if [ ! -f "wrangler.toml" ]; then
    echo -e "${RED}✗ Not in backend directory${RESET}"
    echo "Run this script from: /Users/michaelguo/nexus-alert/backend"
    exit 1
fi
echo -e "${GREEN}✓ Running in backend directory${RESET}"

echo ""

# ─────────────────────────────────────────────────────────────────
# Step 2: Stripe Dashboard Instructions
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}Step 2: Create Stripe Products (Live Mode)${RESET}"
echo ""
echo -e "${YELLOW}Follow these steps in Stripe Dashboard:${RESET}"
echo ""
echo "1. Open: https://dashboard.stripe.com"
echo "2. Toggle to ${BOLD}Live Mode${RESET} (top-right switcher)"
echo ""
echo -e "${BOLD}Create Product 1: NEXUS Alert Premium Monthly${RESET}"
echo "   - Navigate to: Products → Create Product"
echo "   - Name: NEXUS Alert Premium Monthly"
echo "   - Pricing: \$4.99 USD/month (recurring)"
echo "   - Click 'Save Product'"
echo "   - Copy the Price ID (starts with price_)"
echo ""
echo -e "${BOLD}Create Product 2: NEXUS Alert Premium Annual${RESET}"
echo "   - Navigate to: Products → Create Product"
echo "   - Name: NEXUS Alert Premium Annual"
echo "   - Pricing: \$49.99 USD/year (recurring)"
echo "   - Click 'Save Product'"
echo "   - Copy the Price ID (starts with price_)"
echo ""
echo -e "${BOLD}Optional: Create A/B Test Price Variants${RESET}"
echo "   - Product 3: NEXUS Alert Premium Monthly (Test)"
echo "     Price: \$9.99 USD/month"
echo "   - Product 4: NEXUS Alert Premium Annual (Test)"
echo "     Price: \$79.99 USD/year"
echo ""

read -p "Press ENTER when you've created the products in Stripe..."
echo ""

# ─────────────────────────────────────────────────────────────────
# Step 3: Collect Price IDs
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}Step 3: Enter Stripe Price IDs${RESET}"
echo ""

read -p "Monthly Price ID (Control - \$4.99): " MONTHLY_PRICE_ID
if [[ ! $MONTHLY_PRICE_ID =~ ^price_ ]]; then
    echo -e "${RED}Error: Price ID must start with 'price_'${RESET}"
    exit 1
fi

read -p "Annual Price ID (Control - \$49.99): " ANNUAL_PRICE_ID
if [[ ! $ANNUAL_PRICE_ID =~ ^price_ ]]; then
    echo -e "${RED}Error: Price ID must start with 'price_'${RESET}"
    exit 1
fi

echo ""
echo -e "${YELLOW}A/B Test Price IDs (optional - press ENTER to skip):${RESET}"
read -p "Monthly Test Price ID (\$9.99) [optional]: " MONTHLY_TEST_PRICE_ID
read -p "Annual Test Price ID (\$79.99) [optional]: " ANNUAL_TEST_PRICE_ID

echo ""
echo -e "${GREEN}Price IDs collected:${RESET}"
echo "  Monthly (Control): $MONTHLY_PRICE_ID"
echo "  Annual (Control):  $ANNUAL_PRICE_ID"
if [ -n "$MONTHLY_TEST_PRICE_ID" ]; then
    echo "  Monthly (Test):    $MONTHLY_TEST_PRICE_ID"
fi
if [ -n "$ANNUAL_TEST_PRICE_ID" ]; then
    echo "  Annual (Test):     $ANNUAL_TEST_PRICE_ID"
fi
echo ""

# ─────────────────────────────────────────────────────────────────
# Step 4: Get Live Stripe Secret Key
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}Step 4: Get Stripe Live Secret Key${RESET}"
echo ""
echo "1. Go to: https://dashboard.stripe.com/apikeys"
echo "2. In ${BOLD}Live Mode${RESET}, reveal and copy 'Secret key'"
echo "   (starts with sk_live_)"
echo ""

read -s -p "Stripe Live Secret Key: " STRIPE_SECRET_KEY
echo ""
if [[ ! $STRIPE_SECRET_KEY =~ ^sk_live_ ]]; then
    echo -e "${RED}Error: Live secret key must start with 'sk_live_'${RESET}"
    exit 1
fi

echo -e "${GREEN}✓ Live secret key validated${RESET}"
echo ""

# ─────────────────────────────────────────────────────────────────
# Step 5: Update Cloudflare Worker Secrets
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}Step 5: Updating Cloudflare Worker Secrets${RESET}"
echo ""

# Update Stripe secret key
echo "Setting STRIPE_SECRET_KEY..."
echo "$STRIPE_SECRET_KEY" | wrangler secret put STRIPE_SECRET_KEY
echo -e "${GREEN}✓ STRIPE_SECRET_KEY updated${RESET}"

# Update monthly price ID
echo "Setting STRIPE_MONTHLY_PRICE_ID..."
echo "$MONTHLY_PRICE_ID" | wrangler secret put STRIPE_MONTHLY_PRICE_ID
echo -e "${GREEN}✓ STRIPE_MONTHLY_PRICE_ID updated${RESET}"

# Update annual price ID
echo "Setting STRIPE_ANNUAL_PRICE_ID..."
echo "$ANNUAL_PRICE_ID" | wrangler secret put STRIPE_ANNUAL_PRICE_ID
echo -e "${GREEN}✓ STRIPE_ANNUAL_PRICE_ID updated${RESET}"

# Update test price IDs if provided
if [ -n "$MONTHLY_TEST_PRICE_ID" ]; then
    echo "Setting STRIPE_MONTHLY_PRICE_TEST..."
    echo "$MONTHLY_TEST_PRICE_ID" | wrangler secret put STRIPE_MONTHLY_PRICE_TEST
    echo -e "${GREEN}✓ STRIPE_MONTHLY_PRICE_TEST updated${RESET}"
fi

if [ -n "$ANNUAL_TEST_PRICE_ID" ]; then
    echo "Setting STRIPE_ANNUAL_PRICE_TEST..."
    echo "$ANNUAL_TEST_PRICE_ID" | wrangler secret put STRIPE_ANNUAL_PRICE_TEST
    echo -e "${GREEN}✓ STRIPE_ANNUAL_PRICE_TEST updated${RESET}"
fi

echo ""

# ─────────────────────────────────────────────────────────────────
# Step 6: Deploy Backend
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}Step 6: Deploying Backend to Cloudflare${RESET}"
echo ""

echo "Running: wrangler deploy"
wrangler deploy

echo ""
echo -e "${GREEN}✓ Backend deployed successfully${RESET}"
echo ""

# ─────────────────────────────────────────────────────────────────
# Step 7: Test Payment Flow
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}Step 7: Testing Payment Flow${RESET}"
echo ""
echo -e "${YELLOW}IMPORTANT: This will create a REAL Stripe checkout session${RESET}"
echo -e "${YELLOW}Use a test email address, but DO NOT complete payment unless you want to test with a real card${RESET}"
echo ""

read -p "Test email address: " TEST_EMAIL

echo ""
echo "Creating checkout session for monthly plan..."
CHECKOUT_RESPONSE=$(curl -s -X POST https://api.nexus-alert.com/api/checkout \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"plan\":\"monthly\"}")

CHECKOUT_URL=$(echo "$CHECKOUT_RESPONSE" | grep -o '"url":"[^"]*"' | sed 's/"url":"\(.*\)"/\1/')

if [ -n "$CHECKOUT_URL" ]; then
    echo -e "${GREEN}✓ Checkout session created${RESET}"
    echo ""
    echo -e "${BOLD}Test checkout URL:${RESET}"
    echo "$CHECKOUT_URL"
    echo ""
    echo -e "${YELLOW}Test cards (Stripe Live Mode):${RESET}"
    echo "  Success: 4242 4242 4242 4242"
    echo "  Decline: 4000 0000 0000 0002"
    echo "  Expiry: Any future date (e.g., 12/28)"
    echo "  CVC: Any 3 digits (e.g., 123)"
    echo ""
else
    echo -e "${RED}✗ Failed to create checkout session${RESET}"
    echo "Response: $CHECKOUT_RESPONSE"
    exit 1
fi

echo ""
echo -e "${BOLD}To complete end-to-end testing:${RESET}"
echo "1. Open the checkout URL above in your browser"
echo "2. Complete payment with test card: 4242 4242 4242 4242"
echo "3. Verify webhook receives payment.succeeded event"
echo "4. Check that premium features are unlocked in extension"
echo ""

# ─────────────────────────────────────────────────────────────────
# Step 8: Webhook Verification
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}Step 8: Verify Webhook Configuration${RESET}"
echo ""
echo "Ensure your Stripe webhook is configured:"
echo ""
echo "1. Go to: https://dashboard.stripe.com/webhooks"
echo "2. Verify endpoint exists: https://api.nexus-alert.com/api/webhook"
echo "3. Events to listen for:"
echo "   - checkout.session.completed"
echo "   - customer.subscription.deleted"
echo "   - customer.subscription.updated"
echo "   - invoice.payment_succeeded"
echo "   - invoice.payment_failed"
echo ""

read -p "Is webhook configured? (y/n): " WEBHOOK_CONFIGURED

if [ "$WEBHOOK_CONFIGURED" != "y" ]; then
    echo ""
    echo -e "${YELLOW}Configure webhook now:${RESET}"
    echo "1. Click 'Add endpoint' in Stripe Dashboard"
    echo "2. Endpoint URL: https://api.nexus-alert.com/api/webhook"
    echo "3. Select events listed above"
    echo "4. Click 'Add endpoint'"
    echo "5. Copy the 'Signing secret' (starts with whsec_)"
    echo ""
    read -s -p "Webhook Signing Secret: " WEBHOOK_SECRET
    echo ""
    echo "$WEBHOOK_SECRET" | wrangler secret put STRIPE_WEBHOOK_SECRET
    echo -e "${GREEN}✓ Webhook secret updated${RESET}"
fi

echo ""

# ─────────────────────────────────────────────────────────────────
# Success Summary
# ─────────────────────────────────────────────────────────────────

echo ""
echo -e "${GREEN}${BOLD}╔════════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${GREEN}${BOLD}║   ✓ STRIPE PRODUCTION MIGRATION COMPLETE                      ║${RESET}"
echo -e "${GREEN}${BOLD}╚════════════════════════════════════════════════════════════════╝${RESET}"
echo ""
echo -e "${BOLD}Summary:${RESET}"
echo "  ✓ Stripe products created in Live Mode"
echo "  ✓ Price IDs configured in Cloudflare Workers"
echo "  ✓ Live secret key activated"
echo "  ✓ Backend deployed"
echo "  ✓ Payment flow ready for testing"
echo ""
echo -e "${BOLD}Next Steps:${RESET}"
echo "  1. Complete a real payment test using the checkout URL above"
echo "  2. Verify webhook logs in Stripe Dashboard → Webhooks"
echo "  3. Monitor Cloudflare Worker logs: wrangler tail"
echo "  4. Test annual plan checkout"
echo "  5. Update extension with production backend URL (if needed)"
echo ""
echo -e "${YELLOW}Revenue Status: LIVE — Ready to accept real customers 💰${RESET}"
echo ""
