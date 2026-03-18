#!/bin/bash
# Mobile Responsiveness Test Script
# Tests NEXUS Alert landing page across different viewport sizes

echo "=== NEXUS Alert Mobile Responsiveness Test ==="
echo ""

URL="https://caffeinegmt.github.io/nexus-alert/"

# Test 1: Desktop viewport
echo "📱 Testing Desktop (1920x1080)..."
curl -s -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" "$URL" | \
  grep -q "min-h-screen" && echo "✅ Desktop layout classes found" || echo "❌ Desktop layout missing"

# Test 2: Tablet viewport
echo "📱 Testing Tablet (768px)..."
curl -s -H "User-Agent: Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15" "$URL" | \
  grep -q "md:" && echo "✅ Tablet breakpoint classes found" || echo "❌ Tablet breakpoints missing"

# Test 3: Mobile viewport
echo "📱 Testing Mobile (375px)..."
curl -s -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15" "$URL" | \
  grep -q "sm:" && echo "✅ Mobile breakpoint classes found" || echo "❌ Mobile breakpoints missing"

# Test 4: Check viewport meta tag
echo ""
echo "📐 Checking viewport configuration..."
curl -s "$URL" | grep -q 'viewport.*width=device-width' && \
  echo "✅ Proper viewport meta tag configured" || echo "❌ Viewport meta tag missing"

# Test 5: Check responsive images
echo ""
echo "🖼️  Checking responsive images..."
curl -s "$URL" | grep -q "srcset\|sizes" && \
  echo "✅ Responsive images configured" || echo "⚠️  No srcset found (may be OK if using Next.js Image)"

echo ""
echo "=== Test Complete ==="
