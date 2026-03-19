#!/bin/bash
# Manual CORS Security Test
# Tests CORS behavior with different origins

echo "🔒 CORS Security Verification Test"
echo "===================================="
echo ""
echo "⚠️  Prerequisites:"
echo "   1. Start the worker: cd backend && wrangler dev"
echo "   2. Worker should be running on http://localhost:8787"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:8787/api/status"

echo "Testing CORS with different origins:"
echo ""

# Test 1: Allowed origin - nexus-alert.com
echo "1. ✅ Testing allowed origin: https://nexus-alert.com"
RESPONSE=$(curl -s -H "Origin: https://nexus-alert.com" -H "Authorization: Bearer ${WEBHOOK_SECRET:-test-secret}" "$API_URL" -i)
CORS_HEADER=$(echo "$RESPONSE" | grep -i "access-control-allow-origin")
echo "   Response: $CORS_HEADER"

if [[ "$CORS_HEADER" == *"https://nexus-alert.com"* ]]; then
  echo -e "   ${GREEN}✓ PASS: Allowed origin accepted${NC}"
else
  echo -e "   ${RED}✗ FAIL: Should allow nexus-alert.com${NC}"
fi
echo ""

# Test 2: Allowed origin - www.nexus-alert.com
echo "2. ✅ Testing allowed origin: https://www.nexus-alert.com"
RESPONSE=$(curl -s -H "Origin: https://www.nexus-alert.com" -H "Authorization: Bearer ${WEBHOOK_SECRET:-test-secret}" "$API_URL" -i)
CORS_HEADER=$(echo "$RESPONSE" | grep -i "access-control-allow-origin")
echo "   Response: $CORS_HEADER"

if [[ "$CORS_HEADER" == *"https://www.nexus-alert.com"* ]]; then
  echo -e "   ${GREEN}✓ PASS: Allowed origin accepted${NC}"
else
  echo -e "   ${RED}✗ FAIL: Should allow www.nexus-alert.com${NC}"
fi
echo ""

# Test 3: Unauthorized origin - evil.com
echo "3. 🚫 Testing unauthorized origin: https://evil.com"
RESPONSE=$(curl -s -H "Origin: https://evil.com" -H "Authorization: Bearer ${WEBHOOK_SECRET:-test-secret}" "$API_URL" -i)
CORS_HEADER=$(echo "$RESPONSE" | grep -i "access-control-allow-origin")
echo "   Response: $CORS_HEADER"

if [[ "$CORS_HEADER" == *"https://evil.com"* ]]; then
  echo -e "   ${RED}✗ FAIL: Should NOT allow evil.com${NC}"
elif [[ "$CORS_HEADER" == *"https://nexus-alert.com"* ]]; then
  echo -e "   ${GREEN}✓ PASS: Falls back to default origin (not evil origin)${NC}"
else
  echo -e "   ${YELLOW}⚠ WARNING: Unexpected CORS header${NC}"
fi
echo ""

# Test 4: No origin header
echo "4. 🔍 Testing with no Origin header"
RESPONSE=$(curl -s -H "Authorization: Bearer ${WEBHOOK_SECRET:-test-secret}" "$API_URL" -i)
CORS_HEADER=$(echo "$RESPONSE" | grep -i "access-control-allow-origin")
echo "   Response: $CORS_HEADER"

if [[ "$CORS_HEADER" == *"https://nexus-alert.com"* ]]; then
  echo -e "   ${GREEN}✓ PASS: Returns default origin${NC}"
else
  echo -e "   ${RED}✗ FAIL: Should return default origin${NC}"
fi
echo ""

# Test 5: Verify NO wildcard
echo "5. 🔒 Verifying NO wildcard (*) in CORS headers"
RESPONSE=$(curl -s -H "Origin: https://random-site.com" -H "Authorization: Bearer ${WEBHOOK_SECRET:-test-secret}" "$API_URL" -i)
CORS_HEADER=$(echo "$RESPONSE" | grep -i "access-control-allow-origin")
echo "   Response: $CORS_HEADER"

if [[ "$CORS_HEADER" == *"*"* ]]; then
  echo -e "   ${RED}✗ CRITICAL FAIL: Wildcard detected! Security vulnerability!${NC}"
else
  echo -e "   ${GREEN}✓ PASS: No wildcard - secure${NC}"
fi
echo ""

# Test 6: OPTIONS preflight
echo "6. ✈️  Testing OPTIONS preflight request"
RESPONSE=$(curl -s -X OPTIONS -H "Origin: https://nexus-alert.com" "$API_URL" -i)
STATUS_CODE=$(echo "$RESPONSE" | grep -i "HTTP" | head -1)
CORS_HEADER=$(echo "$RESPONSE" | grep -i "access-control-allow-origin")
echo "   Status: $STATUS_CODE"
echo "   CORS Header: $CORS_HEADER"

if [[ "$CORS_HEADER" == *"https://nexus-alert.com"* ]] && [[ "$STATUS_CODE" == *"200"* ]]; then
  echo -e "   ${GREEN}✓ PASS: Preflight handled correctly${NC}"
else
  echo -e "   ${RED}✗ FAIL: Preflight should return 200 with CORS headers${NC}"
fi
echo ""

echo "===================================="
echo "🏁 CORS Security Test Complete"
echo ""
echo "Summary:"
echo "  - ✅ Only whitelisted origins allowed"
echo "  - 🚫 Random origins blocked (fall back to default)"
echo "  - 🔒 NO wildcard (*) vulnerability"
echo "  - ✈️  OPTIONS preflight works"
echo ""
echo "Note: In production, browser will enforce CORS policy."
echo "      Unauthorized origins will receive CORS error in console."
