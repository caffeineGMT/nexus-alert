#!/bin/bash
# Backend API Testing Script
# Tests Cloudflare Worker endpoints for NEXUS Alert

echo "=== NEXUS Alert Backend API Tests ==="
echo ""

# Check if backend is deployed
BACKEND_URL="https://nexus-alert-backend.YOURNAME.workers.dev"  # Update with actual URL

echo "📡 Testing Backend Endpoints..."
echo ""

# Test 1: Health/Status endpoint
echo "1️⃣ Testing /api/status..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/status" 2>/dev/null || echo "000")
if [ "$STATUS" = "200" ]; then
  echo "✅ Status endpoint responding"
elif [ "$STATUS" = "000" ]; then
  echo "❌ Backend not reachable (DNS/deployment issue)"
else
  echo "⚠️  Status endpoint returned: $STATUS"
fi

# Test 2: Subscriber endpoint (should require auth)
echo ""
echo "2️⃣ Testing /api/subscribers..."
SUBS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/subscribers" 2>/dev/null || echo "000")
if [ "$SUBS" = "401" ] || [ "$SUBS" = "403" ]; then
  echo "✅ Subscribers endpoint properly protected"
elif [ "$SUBS" = "200" ]; then
  echo "⚠️  Subscribers endpoint accessible without auth (security issue!)"
else
  echo "⚠️  Subscribers endpoint returned: $SUBS"
fi

# Test 3: Checkout endpoint
echo ""
echo "3️⃣ Testing /api/checkout..."
CHECKOUT=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","plan":"monthly"}' \
  -o /dev/null -w "%{http_code}" \
  "$BACKEND_URL/api/checkout" 2>/dev/null || echo "000")
if [ "$CHECKOUT" = "200" ] || [ "$CHECKOUT" = "303" ]; then
  echo "✅ Checkout endpoint responding"
elif [ "$CHECKOUT" = "000" ]; then
  echo "❌ Checkout endpoint not reachable"
else
  echo "⚠️  Checkout endpoint returned: $CHECKOUT"
fi

# Test 4: Check for CORS headers
echo ""
echo "4️⃣ Testing CORS configuration..."
CORS=$(curl -s -I -H "Origin: https://caffeinegmt.github.io" "$BACKEND_URL/api/status" 2>/dev/null | grep -i "access-control-allow-origin" || echo "NONE")
if [ "$CORS" != "NONE" ]; then
  echo "✅ CORS headers configured"
else
  echo "⚠️  No CORS headers found (frontend may have issues)"
fi

echo ""
echo "=== Backend Test Summary ==="
echo ""
echo "📝 Note: If all tests show 000/not reachable, backend needs deployment:"
echo "   cd backend && wrangler deploy"
echo ""
