#!/bin/bash

###############################################################################
# Product Hunt Pre-Launch Verification Script
#
# Verifies all technical requirements are met before Product Hunt launch.
# Run this 24 hours before launch to catch issues early.
#
# Usage:
#   chmod +x scripts/ph-pre-launch-verify.sh
#   ./scripts/ph-pre-launch-verify.sh
###############################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_WARNING=0

###############################################################################
# Helper Functions
###############################################################################

print_header() {
  echo ""
  echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}  $1${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
  echo ""
}

print_section() {
  echo ""
  echo -e "${BLUE}─── $1${NC}"
  echo ""
}

check_pass() {
  echo -e "${GREEN}✓ PASS${NC} - $1"
  ((CHECKS_PASSED++))
}

check_fail() {
  echo -e "${RED}✗ FAIL${NC} - $1"
  echo -e "${RED}       $2${NC}"
  ((CHECKS_FAILED++))
}

check_warn() {
  echo -e "${YELLOW}⚠ WARN${NC} - $1"
  echo -e "${YELLOW}       $2${NC}"
  ((CHECKS_WARNING++))
}

###############################################################################
# Verification Checks
###############################################################################

print_header "PRODUCT HUNT PRE-LAUNCH VERIFICATION"

# ───────────────────────────────────────────────────────────
# 1. Landing Page Checks
# ───────────────────────────────────────────────────────────

print_section "1. Landing Page (/ph)"

# Check if /ph page exists
if [ -f "web/src/app/ph/page.tsx" ]; then
  check_pass "Landing page file exists (web/src/app/ph/page.tsx)"
else
  check_fail "Landing page file not found" "Create web/src/app/ph/page.tsx"
fi

# Check for EXTENSION_ID placeholder
if grep -q "EXTENSION_ID" web/src/app/ph/page.tsx 2>/dev/null; then
  check_fail "EXTENSION_ID placeholder still present in /ph page" "Replace all instances with actual Chrome Extension ID"
else
  check_pass "Chrome Extension ID updated (no EXTENSION_ID placeholders)"
fi

# Check for YOUR_POST_ID placeholder
if grep -q "YOUR_POST_ID" web/src/app/ph/page.tsx 2>/dev/null; then
  check_warn "YOUR_POST_ID placeholder still present" "Update after Product Hunt submission"
else
  check_pass "Product Hunt post ID updated (no YOUR_POST_ID placeholders)"
fi

# Check for YOUR_VIDEO_ID placeholder
if grep -q "YOUR_VIDEO_ID" web/src/app/ph/page.tsx 2>/dev/null; then
  check_warn "YOUR_VIDEO_ID placeholder still present" "Update with YouTube/Loom video ID"
else
  check_pass "Video ID updated (no YOUR_VIDEO_ID placeholders)"
fi

# Check for PRODUCTHUNT promo code mention
if grep -q "PRODUCTHUNT" web/src/app/ph/page.tsx 2>/dev/null; then
  check_pass "PRODUCTHUNT promo code mentioned in landing page"
else
  check_fail "PRODUCTHUNT promo code not found in landing page" "Add promo code banner/section"
fi

# ───────────────────────────────────────────────────────────
# 2. Backend Checks
# ───────────────────────────────────────────────────────────

print_section "2. Backend (Cloudflare Worker)"

# Check if worker.js exists
if [ -f "backend/src/worker.js" ]; then
  check_pass "Backend worker file exists (backend/src/worker.js)"
else
  check_fail "Backend worker file not found" "Ensure backend/src/worker.js exists"
fi

# Check for promo code handling in backend
if grep -q "promoCode" backend/src/worker.js 2>/dev/null; then
  check_pass "Promo code handling implemented in backend"
else
  check_fail "Promo code handling not found in backend" "Add promoCode parameter to checkout handler"
fi

# Check for PRODUCTHUNT-specific logic
if grep -q "PRODUCTHUNT" backend/src/worker.js 2>/dev/null; then
  check_pass "PRODUCTHUNT promo code logic present in backend"
else
  check_warn "PRODUCTHUNT promo code not found in backend" "Verify promo code validation logic"
fi

# Check for allow_promotion_codes in Stripe session
if grep -q "allow_promotion_codes" backend/src/worker.js 2>/dev/null; then
  check_pass "Stripe checkout allows promotion codes"
else
  check_fail "allow_promotion_codes not enabled in Stripe checkout" "Add allow_promotion_codes: true to session config"
fi

# ───────────────────────────────────────────────────────────
# 3. Visual Assets
# ───────────────────────────────────────────────────────────

print_section "3. Visual Assets (Gallery Images, Video)"

# Check for gallery images in store-assets
GALLERY_COUNT=$(ls store-assets/ph-gallery-*.png 2>/dev/null | wc -l | tr -d ' ')
if [ "$GALLERY_COUNT" -ge 3 ]; then
  check_pass "Gallery images found ($GALLERY_COUNT files)"
else
  check_warn "Gallery images not found (expected 3)" "Create gallery images: ph-gallery-01.png, ph-gallery-02.png, ph-gallery-03.png"
fi

# Check for thumbnail
if [ -f "store-assets/ph-thumbnail.png" ]; then
  check_pass "Thumbnail image found (store-assets/ph-thumbnail.png)"
else
  check_warn "Thumbnail not found" "Create store-assets/ph-thumbnail.png (240x240px)"
fi

# Check image dimensions (requires imagemagick)
if command -v identify &> /dev/null; then
  for img in store-assets/ph-gallery-*.png; do
    if [ -f "$img" ]; then
      DIMS=$(identify -format "%wx%h" "$img" 2>/dev/null)
      if [ "$DIMS" = "1270x760" ]; then
        check_pass "Image dimensions correct: $(basename $img) ($DIMS)"
      else
        check_warn "Image dimensions incorrect: $(basename $img) ($DIMS)" "Expected 1270x760px"
      fi
    fi
  done

  if [ -f "store-assets/ph-thumbnail.png" ]; then
    THUMB_DIMS=$(identify -format "%wx%h" "store-assets/ph-thumbnail.png" 2>/dev/null)
    if [ "$THUMB_DIMS" = "240x240" ]; then
      check_pass "Thumbnail dimensions correct ($THUMB_DIMS)"
    else
      check_warn "Thumbnail dimensions incorrect ($THUMB_DIMS)" "Expected 240x240px"
    fi
  fi
else
  check_warn "ImageMagick not installed, skipping dimension checks" "Install with: brew install imagemagick"
fi

# ───────────────────────────────────────────────────────────
# 4. Stripe Configuration
# ───────────────────────────────────────────────────────────

print_section "4. Stripe Promo Code (Manual Check Required)"

echo "Please verify in Stripe Dashboard (https://dashboard.stripe.com/coupons):"
echo ""
echo "  ✓ Promo code 'PRODUCTHUNT' exists"
echo "  ✓ Discount: 100% off first month"
echo "  ✓ Duration: Repeating for 1 month"
echo "  ✓ Max redemptions: 500"
echo "  ✓ Expiration: Launch day + 7 days"
echo ""
read -p "Have you verified the Stripe promo code? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  check_pass "Stripe PRODUCTHUNT promo code verified"
else
  check_fail "Stripe promo code not verified" "Create promo code in Stripe Dashboard"
fi

# ───────────────────────────────────────────────────────────
# 5. Chrome Web Store
# ───────────────────────────────────────────────────────────

print_section "5. Chrome Web Store Extension"

echo "Please verify in Chrome Web Store Developer Dashboard:"
echo ""
echo "  ✓ Extension published and live"
echo "  ✓ Extension ID copied for landing page"
echo "  ✓ Screenshots updated"
echo "  ✓ Description optimized"
echo ""
read -p "Is the Chrome Extension live on the Web Store? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  check_pass "Chrome Extension published and live"
else
  check_fail "Chrome Extension not live" "Submit to Chrome Web Store and wait for approval"
fi

# ───────────────────────────────────────────────────────────
# 6. Documentation
# ───────────────────────────────────────────────────────────

print_section "6. Launch Documentation"

# Check for key documentation files
DOC_FILES=(
  "store-assets/PH_LAUNCH_MASTER_INDEX.md"
  "store-assets/PH_LAUNCH_DAY_SCRIPT.md"
  "store-assets/PH_FINAL_LAUNCH_CHECKLIST.md"
  "store-assets/PH_COMMENT_RESPONSE_LIBRARY.md"
  "store-assets/PH_SOCIAL_MEDIA_TEMPLATES.md"
)

for doc in "${DOC_FILES[@]}"; do
  if [ -f "$doc" ]; then
    check_pass "Documentation exists: $(basename $doc)"
  else
    check_warn "Documentation missing: $(basename $doc)" "Create this file for launch guidance"
  fi
done

# ───────────────────────────────────────────────────────────
# 7. Deployment
# ───────────────────────────────────────────────────────────

print_section "7. Deployment Status"

# Check if Vercel is configured
if [ -f "vercel.json" ]; then
  check_pass "Vercel configuration found (vercel.json)"
else
  check_warn "Vercel configuration not found" "Ensure vercel.json is configured"
fi

# Check if backend is deployed
echo ""
echo "Please verify backend deployment:"
echo "  Test URL: https://your-worker.workers.dev/health"
echo ""
read -p "Is the backend deployed and responding? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  check_pass "Backend deployed and operational"
else
  check_fail "Backend not deployed" "Deploy backend to Cloudflare Workers"
fi

# Check if landing page is deployed
echo ""
echo "Please verify landing page deployment:"
echo "  Test URL: https://nexusalert.app/ph"
echo ""
read -p "Is the /ph landing page live and accessible? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  check_pass "Landing page deployed and accessible"
else
  check_fail "Landing page not deployed" "Deploy to Vercel"
fi

# ───────────────────────────────────────────────────────────
# 8. Email Templates
# ───────────────────────────────────────────────────────────

print_section "8. Email & Social Prep"

# Check for social media templates
if [ -f "store-assets/PH_SOCIAL_MEDIA_TEMPLATES.md" ]; then
  check_pass "Social media templates ready"
else
  check_warn "Social media templates not found" "Create PH_SOCIAL_MEDIA_TEMPLATES.md"
fi

# Check for email templates
if [ -f "store-assets/PH_PRE_LAUNCH_EMAILS.md" ]; then
  check_pass "Pre-launch email templates ready"
else
  check_warn "Email templates not found" "Create PH_PRE_LAUNCH_EMAILS.md"
fi

###############################################################################
# Summary
###############################################################################

print_header "VERIFICATION SUMMARY"

echo ""
echo -e "${GREEN}✓ Passed:  $CHECKS_PASSED${NC}"
echo -e "${YELLOW}⚠ Warnings: $CHECKS_WARNING${NC}"
echo -e "${RED}✗ Failed:  $CHECKS_FAILED${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
  echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}  🚀 ALL CRITICAL CHECKS PASSED!${NC}"
  echo -e "${GREEN}  You are ready for Product Hunt launch.${NC}"
  echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
  echo ""

  if [ $CHECKS_WARNING -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Note: $CHECKS_WARNING warnings detected. Review above for details.${NC}"
    echo ""
  fi

  echo "Next steps:"
  echo "  1. Create visual assets (if not done): PH_VISUAL_ASSETS_CREATION.md"
  echo "  2. Review launch checklist: store-assets/PH_FINAL_LAUNCH_CHECKLIST.md"
  echo "  3. Schedule launch for Tuesday 12:01 AM PT"
  echo "  4. Have team ready for launch day engagement"
  echo ""

  exit 0
else
  echo -e "${RED}════════════════════════════════════════════════════════════${NC}"
  echo -e "${RED}  ✗ CRITICAL ISSUES DETECTED${NC}"
  echo -e "${RED}  Fix the $CHECKS_FAILED failed checks before launch.${NC}"
  echo -e "${RED}════════════════════════════════════════════════════════════${NC}"
  echo ""
  echo "Review the failed checks above and resolve them before launch day."
  echo ""

  exit 1
fi
