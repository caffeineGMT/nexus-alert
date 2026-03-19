#!/bin/bash

# Cross-Browser Compatibility Test Suite
# Tests NEXUS Alert extension across Chrome, Firefox, Edge

set -e

echo "🧪 NEXUS Alert - Cross-Browser Compatibility Test Suite"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS_COUNT=0
FAIL_COUNT=0

# Test results
pass() {
  echo -e "${GREEN}✓${NC} $1"
  ((PASS_COUNT++))
}

fail() {
  echo -e "${RED}✗${NC} $1"
  ((FAIL_COUNT++))
}

warn() {
  echo -e "${YELLOW}⚠${NC} $1"
}

# ─── 1. Build Verification ────────────────────────────────────

echo "📦 Step 1: Build Verification"
echo ""

# Build all browsers
if node scripts/build-cross-browser.js > /dev/null 2>&1; then
  pass "All browser builds completed successfully"
else
  fail "Build failed"
  exit 1
fi

# Check Chrome build
if [ -d "dist/chrome" ] && [ -f "dist/chrome/manifest.json" ]; then
  pass "Chrome build exists"
else
  fail "Chrome build missing"
fi

# Check Firefox build
if [ -d "dist/firefox" ] && [ -f "dist/firefox/manifest.json" ]; then
  pass "Firefox build exists"
else
  fail "Firefox build missing"
fi

# Check Edge build
if [ -d "dist/edge" ] && [ -f "dist/edge/manifest.json" ]; then
  pass "Edge build exists"
else
  fail "Edge build missing"
fi

# Check Safari build
if [ -d "dist/safari" ] && [ -f "dist/safari/manifest.json" ]; then
  pass "Safari build exists"
else
  fail "Safari build missing"
fi

echo ""

# ─── 2. Manifest Validation ───────────────────────────────────

echo "📋 Step 2: Manifest Validation"
echo ""

# Chrome manifest
CHROME_VERSION=$(jq -r '.version' dist/chrome/manifest.json)
if [ "$CHROME_VERSION" == "2.0.0" ]; then
  pass "Chrome manifest version correct"
else
  fail "Chrome manifest version incorrect: $CHROME_VERSION"
fi

# Firefox manifest
FIREFOX_VERSION=$(jq -r '.version' dist/firefox/manifest.json)
if [ "$FIREFOX_VERSION" == "2.0.0" ]; then
  pass "Firefox manifest version correct"
else
  fail "Firefox manifest version incorrect: $FIREFOX_VERSION"
fi

# Check Firefox uses background.scripts (not service_worker)
FF_BG_TYPE=$(jq -r '.background.scripts' dist/firefox/manifest.json)
if [ "$FF_BG_TYPE" != "null" ]; then
  pass "Firefox uses background.scripts (correct for MV3)"
else
  fail "Firefox should use background.scripts, not service_worker"
fi

# Check Chrome uses service_worker
CHROME_SW=$(jq -r '.background.service_worker' dist/chrome/manifest.json)
if [ "$CHROME_SW" == "background.js" ]; then
  pass "Chrome uses service_worker (correct)"
else
  fail "Chrome should use service_worker"
fi

# Check browser_specific_settings for Firefox
FF_ADDON_ID=$(jq -r '.browser_specific_settings.gecko.id' dist/firefox/manifest.json)
if [ "$FF_ADDON_ID" != "null" ]; then
  pass "Firefox has addon ID configured"
else
  warn "Firefox addon ID missing (required for AMO)"
fi

echo ""

# ─── 3. File Size Analysis ─────────────────────────────────────

echo "📊 Step 3: File Size Analysis"
echo ""

CHROME_SIZE=$(stat -f%z nexus-alert-chrome.zip 2>/dev/null || stat -c%s nexus-alert-chrome.zip)
FIREFOX_SIZE=$(stat -f%z nexus-alert-firefox.zip 2>/dev/null || stat -c%s nexus-alert-firefox.zip)

CHROME_SIZE_KB=$((CHROME_SIZE / 1024))
FIREFOX_SIZE_KB=$((FIREFOX_SIZE / 1024))

echo "Chrome package: ${CHROME_SIZE_KB} KB"
echo "Firefox package: ${FIREFOX_SIZE_KB} KB"

if [ $CHROME_SIZE_KB -lt 500 ]; then
  pass "Chrome package size under 500KB"
else
  warn "Chrome package is large: ${CHROME_SIZE_KB} KB"
fi

if [ $FIREFOX_SIZE_KB -lt 500 ]; then
  pass "Firefox package size under 500KB"
else
  warn "Firefox package is large: ${FIREFOX_SIZE_KB} KB"
fi

echo ""

# ─── 4. JavaScript Validation ──────────────────────────────────

echo "🔍 Step 4: JavaScript Validation"
echo ""

# Check for browser polyfill in builds
if grep -q "browser-polyfill" dist/chrome/background.js; then
  pass "Chrome build includes browser polyfill"
else
  warn "Chrome build missing browser polyfill (may cause Firefox issues)"
fi

# Check for console.log removal in production builds
LOG_COUNT=$(grep -c "console.log" dist/chrome/background.js || true)
if [ $LOG_COUNT -lt 5 ]; then
  pass "Production build has minimal console.log calls"
else
  warn "Found $LOG_COUNT console.log calls in production build"
fi

echo ""

# ─── 5. Asset Verification ─────────────────────────────────────

echo "🖼️  Step 5: Asset Verification"
echo ""

# Check icons in Chrome build
for size in 16 48 128; do
  if [ -f "dist/chrome/icons/icon${size}.png" ]; then
    pass "Chrome icon${size}.png exists"
  else
    fail "Chrome icon${size}.png missing"
  fi
done

# Check icons in Firefox build
for size in 16 48 128; do
  if [ -f "dist/firefox/icons/icon${size}.png" ]; then
    pass "Firefox icon${size}.png exists"
  else
    fail "Firefox icon${size}.png missing"
  fi
done

# Check locales
if [ -d "dist/chrome/_locales/en" ]; then
  pass "Chrome locales exist"
else
  fail "Chrome locales missing"
fi

echo ""

# ─── 6. Permission Analysis ────────────────────────────────────

echo "🔐 Step 6: Permission Analysis"
echo ""

# Check Chrome permissions
CHROME_PERMS=$(jq -r '.permissions[]' dist/chrome/manifest.json | tr '\n' ' ')
echo "Chrome permissions: $CHROME_PERMS"

# Check Firefox permissions
FIREFOX_PERMS=$(jq -r '.permissions[]' dist/firefox/manifest.json | tr '\n' ' ')
echo "Firefox permissions: $FIREFOX_PERMS"

# Verify critical permissions
if echo "$CHROME_PERMS" | grep -q "storage"; then
  pass "Chrome has storage permission"
else
  fail "Chrome missing storage permission"
fi

if echo "$CHROME_PERMS" | grep -q "alarms"; then
  pass "Chrome has alarms permission"
else
  fail "Chrome missing alarms permission"
fi

if echo "$CHROME_PERMS" | grep -q "notifications"; then
  pass "Chrome has notifications permission"
else
  fail "Chrome missing notifications permission"
fi

echo ""

# ─── 7. Security Validation ────────────────────────────────────

echo "🔒 Step 7: Security Validation"
echo ""

# Check for eval() usage (forbidden in CSP)
if grep -r "eval(" dist/chrome/*.js > /dev/null 2>&1; then
  fail "Found eval() in Chrome build (CSP violation)"
else
  pass "No eval() usage in Chrome build"
fi

# Check for inline scripts in HTML
if grep -r "onclick=" dist/chrome/*.html > /dev/null 2>&1; then
  warn "Found inline event handlers in HTML (consider moving to JS)"
else
  pass "No inline event handlers in HTML"
fi

# Check for external script sources
if grep -r "http://" dist/chrome/manifest.json > /dev/null 2>&1; then
  fail "Found http:// URLs in manifest (use https://)"
else
  pass "All URLs use https://"
fi

echo ""

# ─── Summary ───────────────────────────────────────────────────

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Test Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ Passed:${NC} $PASS_COUNT"
echo -e "${RED}✗ Failed:${NC} $FAIL_COUNT"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed! Extension is cross-browser compatible.${NC}"
  exit 0
else
  echo -e "${RED}❌ $FAIL_COUNT test(s) failed. Please fix issues before release.${NC}"
  exit 1
fi
