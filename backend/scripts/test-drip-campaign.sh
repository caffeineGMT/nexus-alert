#!/bin/bash
# Test script for email drip campaign
# Usage: ./scripts/test-drip-campaign.sh

set -e

API_URL="https://api.nexus-alert.com"
TEST_EMAIL="test-drip-$(date +%s)@example.com"

echo "🧪 Testing Email Drip Campaign"
echo "================================"
echo ""

# Step 1: Create test subscriber
echo "1️⃣ Creating test subscriber..."
SIGNUP_RESPONSE=$(curl -s -X POST "$API_URL/api/subscribe" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"locations\": [5140],
    \"program\": \"NEXUS\"
  }")

echo "✅ Test subscriber created: $TEST_EMAIL"
echo "$SIGNUP_RESPONSE" | jq '.'
echo ""

# Step 2: Verify email sequence state
echo "2️⃣ Checking email sequence state..."
echo "   (In production, use: wrangler kv:key get \"email_sequence:$TEST_EMAIL\" --binding=NEXUS_ALERTS_KV)"
echo ""

# Step 3: Test analytics endpoint
echo "3️⃣ Fetching email analytics..."
ANALYTICS=$(curl -s "$API_URL/api/email-analytics")
echo "$ANALYTICS" | jq '.summary'
echo ""

# Step 4: Simulate conversion with UTM tracking
echo "4️⃣ Simulating conversion (checkout with UTM params)..."
CHECKOUT_RESPONSE=$(curl -s -X POST "$API_URL/api/checkout" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"plan\": \"monthly\",
    \"promoCode\": \"CASE20\",
    \"utm_source\": \"email\",
    \"utm_medium\": \"drip\",
    \"utm_campaign\": \"day_7_case_study\",
    \"utm_content\": \"cta_button\"
  }")

echo "✅ Checkout session created"
echo "$CHECKOUT_RESPONSE" | jq '.url'
echo ""

# Step 5: Instructions
echo "📋 Next Steps:"
echo "   1. Wait for cron to run (every 2 minutes)"
echo "   2. Day 0 welcome email should send within 12 hours"
echo "   3. Monitor sequence progression:"
echo "      wrangler kv:key get \"email_sequence:$TEST_EMAIL\" --binding=NEXUS_ALERTS_KV"
echo ""
echo "   4. Check activity tracking:"
echo "      wrangler kv:key list --prefix=\"activity:\" --binding=NEXUS_ALERTS_KV | grep drip_email"
echo ""
echo "   5. View analytics dashboard:"
echo "      curl $API_URL/api/email-analytics | jq '.summary'"
echo ""

echo "✨ Test setup complete!"
echo "   Test email: $TEST_EMAIL"
