#!/bin/bash

# Create Stripe Promo Code for Product Hunt Launch
# Code: PRODUCTHUNT
# Discount: 100% off first month
# Max Redemptions: 200
# Expires: 7 days from launch

set -e

echo "========================================"
echo "Stripe Promo Code Creation Script"
echo "Code: PRODUCTHUNT"
echo "========================================"
echo ""

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo "❌ Stripe CLI not found. Install it first:"
    echo "   brew install stripe/stripe-cli/stripe"
    echo "   or visit: https://stripe.com/docs/stripe-cli"
    exit 1
fi

echo "✅ Stripe CLI found"
echo ""

# Check if logged in
if ! stripe config --list &> /dev/null; then
    echo "⚠️  Not logged in to Stripe. Running login..."
    stripe login
fi

echo "📋 Getting Stripe account info..."
ACCOUNT_NAME=$(stripe config --list | grep "account_id" | awk '{print $3}' || echo "Unknown")
echo "   Account: $ACCOUNT_NAME"
echo ""

# Calculate expiration date (7 days from now)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    EXPIRATION_DATE=$(date -v+7d +%s)
else
    # Linux
    EXPIRATION_DATE=$(date -d "+7 days" +%s)
fi

echo "🎫 Creating coupon..."
echo "   - Discount: 100% off"
echo "   - Duration: 1 month"
echo "   - Max Redemptions: 200"
echo "   - Expires: $(date -r $EXPIRATION_DATE '+%Y-%m-%d %H:%M:%S')"
echo ""

# Create the coupon
COUPON_ID=$(stripe coupons create \
  --percent-off=100 \
  --duration=repeating \
  --duration-in-months=1 \
  --max-redemptions=200 \
  --redeem-by=$EXPIRATION_DATE \
  --name="Product Hunt Launch Special" \
  --id="producthunt_launch_$(date +%Y%m%d)" \
  --format=json | jq -r '.id')

if [ -z "$COUPON_ID" ]; then
    echo "❌ Failed to create coupon"
    exit 1
fi

echo "✅ Coupon created: $COUPON_ID"
echo ""

# Create the promotion code
echo "🏷️  Creating promotion code PRODUCTHUNT..."

PROMO_CODE=$(stripe promotion_codes create \
  --coupon="$COUPON_ID" \
  --code="PRODUCTHUNT" \
  --max-redemptions=200 \
  --format=json | jq -r '.code')

if [ "$PROMO_CODE" != "PRODUCTHUNT" ]; then
    echo "❌ Failed to create promotion code"
    exit 1
fi

echo "✅ Promotion code created: $PROMO_CODE"
echo ""

# Test the promo code
echo "🧪 Testing promo code..."
echo ""

TEST_RESULT=$(stripe promotion_codes list --code="PRODUCTHUNT" --format=json)
ACTIVE=$(echo "$TEST_RESULT" | jq -r '.data[0].active')
MAX_REDEMPTIONS=$(echo "$TEST_RESULT" | jq -r '.data[0].max_redemptions')
TIMES_REDEEMED=$(echo "$TEST_RESULT" | jq -r '.data[0].times_redeemed')

if [ "$ACTIVE" == "true" ]; then
    echo "✅ Promo code is ACTIVE"
    echo "   - Max Redemptions: $MAX_REDEMPTIONS"
    echo "   - Times Redeemed: $TIMES_REDEEMED"
    echo "   - Remaining: $((MAX_REDEMPTIONS - TIMES_REDEEMED))"
else
    echo "❌ Promo code is INACTIVE"
    exit 1
fi

echo ""
echo "========================================"
echo "✅ SUCCESS!"
echo "========================================"
echo ""
echo "Promo Code: PRODUCTHUNT"
echo "Status: Active"
echo "Max Redemptions: 200"
echo "Discount: 100% off first month"
echo ""
echo "Next Steps:"
echo "1. Test the checkout flow with this promo code"
echo "2. Update Product Hunt landing page (/ph)"
echo "3. Include promo code in founder comment"
echo "4. Mention in email blast and Reddit posts"
echo ""
echo "Test checkout:"
echo "  https://nexusalert.app/upgrade?promo=PRODUCTHUNT"
echo ""
echo "View in Stripe Dashboard:"
echo "  https://dashboard.stripe.com/coupons/$COUPON_ID"
echo ""
