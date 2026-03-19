#!/bin/bash

# Rate Limiting Test Script
# Tests that critical endpoints (/api/subscribe, /api/checkout) are properly rate limited

set -e

API_URL="${API_URL:-http://localhost:8787}"
ENDPOINT="${1:-/api/subscribe}"

echo "🧪 Testing Rate Limiting for ${ENDPOINT}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test /api/subscribe rate limiting
if [ "$ENDPOINT" = "/api/subscribe" ]; then
  echo "Testing /api/subscribe endpoint (limit: 10 req/min)"
  echo ""

  SUCCESS_COUNT=0
  RATE_LIMITED_COUNT=0

  for i in {1..12}; do
    echo -n "Request $i: "

    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/api/subscribe" \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"test-ratelimit-$RANDOM@example.com\",\"locations\":[5140]}" \
      2>/dev/null)

    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" = "200" ]; then
      SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
      echo "✅ Success (200)"
    elif [ "$HTTP_CODE" = "429" ]; then
      RATE_LIMITED_COUNT=$((RATE_LIMITED_COUNT + 1))
      RETRY_AFTER=$(echo "$BODY" | grep -o '"retryAfter":[0-9]*' | cut -d: -f2)
      echo "🚫 Rate Limited (429) - Retry after ${RETRY_AFTER}s"

      # Verify error structure
      if echo "$BODY" | grep -q '"code":"RATE_LIMIT_EXCEEDED"'; then
        echo "   ✓ Error code correct"
      else
        echo "   ✗ Error code missing or incorrect"
      fi
    else
      echo "❌ Unexpected status: $HTTP_CODE"
      echo "   Response: $BODY"
    fi

    # Small delay between requests
    sleep 0.1
  done

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📊 Results:"
  echo "   Successful requests: $SUCCESS_COUNT"
  echo "   Rate limited requests: $RATE_LIMITED_COUNT"
  echo ""

  if [ $SUCCESS_COUNT -le 10 ] && [ $RATE_LIMITED_COUNT -ge 1 ]; then
    echo "✅ PASS: Rate limiting is working correctly!"
  else
    echo "❌ FAIL: Rate limiting may not be working as expected"
    exit 1
  fi

# Test /api/checkout rate limiting
elif [ "$ENDPOINT" = "/api/checkout" ]; then
  echo "Testing /api/checkout endpoint (limit: 10 req/min)"
  echo ""

  SUCCESS_COUNT=0
  RATE_LIMITED_COUNT=0

  for i in {1..12}; do
    echo -n "Request $i: "

    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/api/checkout" \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"test-checkout-$RANDOM@example.com\",\"plan\":\"premium\"}" \
      2>/dev/null)

    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" = "200" ]; then
      SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
      echo "✅ Success (200)"
    elif [ "$HTTP_CODE" = "429" ]; then
      RATE_LIMITED_COUNT=$((RATE_LIMITED_COUNT + 1))
      echo "🚫 Rate Limited (429)"

      # Verify Retry-After header presence
      if echo "$BODY" | grep -q '"retryAfter"'; then
        echo "   ✓ Retry-After present"
      else
        echo "   ✗ Retry-After missing"
      fi
    else
      echo "⚠️  Status: $HTTP_CODE (may be expected if Stripe not configured)"
    fi

    sleep 0.1
  done

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📊 Results:"
  echo "   Successful/Other requests: $SUCCESS_COUNT"
  echo "   Rate limited requests: $RATE_LIMITED_COUNT"
  echo ""

  if [ $RATE_LIMITED_COUNT -ge 1 ]; then
    echo "✅ PASS: Rate limiting is working correctly!"
  else
    echo "❌ FAIL: Rate limiting may not be working as expected"
    exit 1
  fi

else
  echo "❌ Unknown endpoint: $ENDPOINT"
  echo "Usage: $0 [/api/subscribe|/api/checkout]"
  exit 1
fi

echo ""
echo "💡 Tip: Wait 60 seconds and run again to verify rate limits reset"
