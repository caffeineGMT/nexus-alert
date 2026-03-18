#!/bin/bash

# NEXUS Alert - Launch Readiness Verification
# Checks all critical systems before launch

set -e

echo "================================================"
echo "  NEXUS Alert - Launch Readiness Check"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to check URL
check_url() {
    local url=$1
    local name=$2

    echo -n "Checking $name... "

    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✓ LIVE${NC}"
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((ERRORS++))
    fi
}

# Function to check file exists
check_file() {
    local file=$1
    local name=$2

    echo -n "Checking $name... "

    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ EXISTS${NC}"
    else
        echo -e "${RED}✗ MISSING${NC}"
        ((ERRORS++))
    fi
}

echo "1. Extension Package"
echo "===================="
check_file "dist/nexus-alert-v2.0.0.zip" "Extension package"
if [ -f "dist/nexus-alert-v2.0.0.zip" ]; then
    SIZE=$(du -h dist/nexus-alert-v2.0.0.zip | cut -f1)
    echo "   Size: $SIZE"
fi
echo ""

echo "2. Store Assets (Images)"
echo "======================="
check_file "store-assets/marquee-1400x560.png" "Marquee (1400x560)"
check_file "store-assets/small-tile-440x280.png" "Small Tile (440x280)"
check_file "store-assets/1-monitor-locations.png" "Screenshot 1"
check_file "store-assets/2-slots-found.png" "Screenshot 2"
check_file "store-assets/3-settings-premium.png" "Screenshot 3"
check_file "store-assets/4-onboarding-step2.png" "Screenshot 4"
check_file "store-assets/5-notification.png" "Screenshot 5"
echo ""

echo "3. Documentation"
echo "==============="
check_file "CHROME_WEB_STORE_SUBMISSION_GUIDE.md" "Submission guide"
check_file "store-assets/CHROME-WEB-STORE-LISTING.txt" "Listing copy"
check_file "marketing/community-seeding/REDDIT_POSTS_READY_TO_USE.md" "Reddit posts"
check_file "PH_LAUNCH_EXECUTION_GUIDE.md" "Product Hunt guide"
echo ""

echo "4. Online Resources"
echo "=================="
check_url "https://nexus-alert.com" "Landing page"
check_url "https://nexus-alert.com/privacy" "Privacy policy"
check_url "https://api.nexus-alert.com/api/status" "Backend API"
echo ""

echo "5. Chrome Web Store Status"
echo "========================="
echo -e "${YELLOW}⚠ MANUAL CHECK REQUIRED${NC}"
echo "Visit: https://chrome.google.com/webstore/devconsole"
echo ""
echo "Check if extension is:"
echo "  [ ] Not submitted → Submit now using CHROME_WEB_STORE_SUBMISSION_GUIDE.md"
echo "  [ ] Pending review → Wait or send follow-up email to cws-editors@google.com"
echo "  [ ] Approved → LAUNCH IMMEDIATELY (execute LAUNCH_DAY_EXECUTION_STATUS.md)"
echo "  [ ] Rejected → Address issues and resubmit"
echo ""

echo "6. Marketing Materials Status"
echo "============================"
echo -e "${YELLOW}⚠ REQUIRES EXTENSION ID${NC}"
echo ""
echo "After Chrome Web Store approval, replace [EXTENSION_ID] in:"
echo "  - README.md (line 184)"
echo "  - web/src/app/ph/page.tsx"
echo "  - marketing/community-seeding/REDDIT_POSTS_READY_TO_USE.md"
echo ""

echo "7. Stripe Configuration"
echo "======================"
echo -e "${YELLOW}⚠ MANUAL CHECK REQUIRED${NC}"
echo ""
echo "Verify in Stripe dashboard:"
echo "  [ ] Production mode enabled"
echo "  [ ] PRODUCTHUNT promo code created (100% off, 1 month, 500 redemptions)"
echo "  [ ] Price IDs set in backend/src/worker.js"
echo ""

echo "================================================"
echo "  Summary"
echo "================================================"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All automated checks passed!${NC}"
    echo ""
    echo "Next Steps:"
    echo "1. Complete manual checks above (Chrome Web Store, Stripe)"
    echo "2. If extension is APPROVED, execute LAUNCH_DAY_EXECUTION_STATUS.md"
    echo "3. Replace [EXTENSION_ID] in all marketing materials"
    echo "4. Launch on Reddit (9:00 AM PT Tuesday)"
    echo "5. Launch on Product Hunt (12:01 AM PT Tuesday)"
    echo ""
else
    echo -e "${RED}✗ $ERRORS errors found${NC}"
    echo ""
    echo "Fix the errors above before launching."
fi

echo "================================================"
echo ""
