#!/bin/bash

###############################################################################
# Create PRODUCTHUNT Promo Code in Stripe
#
# Creates the PRODUCTHUNT promo code in Stripe Dashboard with correct settings.
# This script provides the exact Stripe CLI commands or Dashboard instructions.
#
# Usage:
#   chmod +x scripts/create-ph-promo-code.sh
#   ./scripts/create-ph-promo-code.sh
###############################################################################

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  PRODUCT HUNT PROMO CODE SETUP${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# ───────────────────────────────────────────────────────────
# Configuration
# ───────────────────────────────────────────────────────────

PROMO_CODE="PRODUCTHUNT"
DISCOUNT_PERCENT=100
DURATION_MONTHS=1
MAX_REDEMPTIONS=500
LAUNCH_DATE="2026-03-25" # Update to your actual launch date
EXPIRY_DAYS=7

echo "Promo Code Configuration:"
echo ""
echo "  Code:             $PROMO_CODE"
echo "  Discount:         $DISCOUNT_PERCENT% off"
echo "  Duration:         First $DURATION_MONTHS month(s)"
echo "  Max Redemptions:  $MAX_REDEMPTIONS"
echo "  Launch Date:      $LAUNCH_DATE"
echo "  Expiry:           $EXPIRY_DAYS days after launch"
echo ""

# Calculate expiry timestamp (7 days from launch)
EXPIRY_DATE=$(date -j -v+${EXPIRY_DAYS}d -f "%Y-%m-%d" "$LAUNCH_DATE" "+%Y-%m-%d" 2>/dev/null || echo "2026-04-01")
EXPIRY_TIMESTAMP=$(date -j -f "%Y-%m-%d" "$EXPIRY_DATE" "+%s" 2>/dev/null || echo "1743465600")

echo -e "${YELLOW}───────────────────────────────────────────────────────────${NC}"
echo ""

# ───────────────────────────────────────────────────────────
# Method 1: Stripe Dashboard (Recommended for Non-Technical)
# ───────────────────────────────────────────────────────────

echo -e "${GREEN}METHOD 1: Stripe Dashboard (Recommended)${NC}"
echo ""
echo "1. Go to: https://dashboard.stripe.com/coupons"
echo ""
echo "2. Click: 'Create coupon' button"
echo ""
echo "3. Fill in the form:"
echo "   ┌───────────────────────────────────────────────────┐"
echo "   │ Name:                PRODUCTHUNT                  │"
echo "   │ Coupon ID:           producthunt (auto-generated) │"
echo "   │ Type:                Percentage discount          │"
echo "   │ Percentage off:      100%                         │"
echo "   │ Duration:            Repeating                    │"
echo "   │ Duration in months:  1                            │"
echo "   │ Max redemptions:     500                          │"
echo "   │ Redeem by:           $EXPIRY_DATE                  │"
echo "   └───────────────────────────────────────────────────┘"
echo ""
echo "4. Click 'Create coupon'"
echo ""
echo "5. Copy the Coupon ID (e.g., 'producthunt') for testing"
echo ""

echo -e "${YELLOW}───────────────────────────────────────────────────────────${NC}"
echo ""

# ───────────────────────────────────────────────────────────
# Method 2: Stripe CLI (For Technical Users)
# ───────────────────────────────────────────────────────────

echo -e "${GREEN}METHOD 2: Stripe CLI (Advanced)${NC}"
echo ""
echo "If you have Stripe CLI installed, run:"
echo ""
echo -e "${BLUE}stripe coupons create \\${NC}"
echo -e "${BLUE}  --percent-off 100 \\${NC}"
echo -e "${BLUE}  --duration repeating \\${NC}"
echo -e "${BLUE}  --duration-in-months 1 \\${NC}"
echo -e "${BLUE}  --max-redemptions 500 \\${NC}"
echo -e "${BLUE}  --redeem-by $EXPIRY_TIMESTAMP \\${NC}"
echo -e "${BLUE}  --name \"PRODUCTHUNT\" \\${NC}"
echo -e "${BLUE}  --id producthunt${NC}"
echo ""
echo "Install Stripe CLI: https://stripe.com/docs/stripe-cli"
echo ""

echo -e "${YELLOW}───────────────────────────────────────────────────────────${NC}"
echo ""

# ───────────────────────────────────────────────────────────
# Verification
# ───────────────────────────────────────────────────────────

echo -e "${GREEN}VERIFICATION STEPS${NC}"
echo ""
echo "After creating the promo code:"
echo ""
echo "1. Test in Stripe Checkout:"
echo "   • Go to: https://dashboard.stripe.com/test/coupons"
echo "   • Click on 'PRODUCTHUNT' coupon"
echo "   • Click 'Test' button"
echo "   • Verify 100% discount applies"
echo ""
echo "2. Test in NEXUS Alert checkout flow:"
echo "   • Visit: https://nexusalert.app/pricing"
echo "   • Click 'Upgrade to Premium'"
echo "   • Enter email"
echo "   • At checkout, enter promo code: PRODUCTHUNT"
echo "   • Verify: 'First month free' shows in summary"
echo "   • Cancel before completing payment"
echo ""
echo "3. Verify backend integration:"
echo "   • Check backend/src/worker.js has 'promoCode' parameter"
echo "   • Check 'allow_promotion_codes: true' in checkout session"
echo "   • Check metadata includes 'promoCode' and 'source'"
echo ""

echo -e "${YELLOW}───────────────────────────────────────────────────────────${NC}"
echo ""

# ───────────────────────────────────────────────────────────
# Important Notes
# ───────────────────────────────────────────────────────────

echo -e "${GREEN}IMPORTANT NOTES${NC}"
echo ""
echo "✓ Create the promo code in LIVE mode (not test mode)"
echo "✓ Use the exact code 'PRODUCTHUNT' (all caps)"
echo "✓ Set expiry to 7 days after launch (not unlimited)"
echo "✓ 500 max redemptions prevents abuse"
echo "✓ 100% off FIRST MONTH only (then regular price)"
echo ""
echo "⚠️  Double-check the 'Repeating for 1 month' duration"
echo "    (NOT 'Once' or 'Forever')"
echo ""

echo -e "${YELLOW}───────────────────────────────────────────────────────────${NC}"
echo ""

# ───────────────────────────────────────────────────────────
# Post-Creation Checklist
# ───────────────────────────────────────────────────────────

echo -e "${GREEN}POST-CREATION CHECKLIST${NC}"
echo ""
echo "After creating the promo code, verify:"
echo ""
echo "  [ ] Promo code visible in Stripe Dashboard"
echo "  [ ] Discount: 100% off"
echo "  [ ] Duration: Repeating for 1 month"
echo "  [ ] Max redemptions: 500"
echo "  [ ] Expiry date: $EXPIRY_DATE"
echo "  [ ] Tested in checkout flow"
echo "  [ ] Backend accepts 'promoCode' parameter"
echo "  [ ] Landing page mentions PRODUCTHUNT code"
echo "  [ ] Email templates include promo code"
echo "  [ ] Social media posts include promo code"
echo ""

echo -e "${YELLOW}───────────────────────────────────────────────────────────${NC}"
echo ""

# ───────────────────────────────────────────────────────────
# Done
# ───────────────────────────────────────────────────────────

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  NEXT STEPS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "1. Create the promo code using Method 1 or Method 2 above"
echo "2. Test the promo code in checkout flow"
echo "3. Update landing page if needed"
echo "4. Run pre-launch verification:"
echo "   ./scripts/ph-pre-launch-verify.sh"
echo ""
echo "Questions? Check Stripe docs: https://stripe.com/docs/billing/subscriptions/coupons"
echo ""
