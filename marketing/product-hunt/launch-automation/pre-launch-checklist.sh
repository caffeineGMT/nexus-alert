#!/bin/bash

# Product Hunt Pre-Launch Automated Checklist
# Run this script 24 hours before launch

set -e

EXTENSION_ID="${EXTENSION_ID:-PLACEHOLDER}"
LAUNCH_DATE="${LAUNCH_DATE:-2026-03-25}" # Tuesday
PROJECT_ROOT="/Users/michaelguo/nexus-alert"

echo "🚀 NEXUS Alert Product Hunt Pre-Launch Checklist"
echo "================================================"
echo ""
echo "Launch Date: $LAUNCH_DATE at 12:01 AM PT"
echo "Extension ID: $EXTENSION_ID"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Checklist status
declare -A checklist

# 1. Check Chrome Web Store Status
echo "1. Checking Chrome Web Store Status..."
echo "   → Open: https://chrome.google.com/webstore/devconsole"
read -p "   Is Chrome Web Store status APPROVED? (y/n): " chrome_approved
if [ "$chrome_approved" = "y" ]; then
    echo -e "   ${GREEN}✓ Chrome Web Store APPROVED${NC}"
    checklist[chrome_approved]=1
else
    echo -e "   ${RED}✗ Chrome Web Store NOT APPROVED - STOP LAUNCH${NC}"
    exit 1
fi

# 2. Get Extension ID
echo ""
echo "2. Extension ID Configuration..."
read -p "   Enter Chrome Extension ID (32 characters): " extension_id_input
if [ ${#extension_id_input} -eq 32 ]; then
    EXTENSION_ID=$extension_id_input
    echo -e "   ${GREEN}✓ Extension ID saved: $EXTENSION_ID${NC}"
    checklist[extension_id]=1
else
    echo -e "   ${RED}✗ Invalid Extension ID length${NC}"
    exit 1
fi

# 3. Create Stripe Promo Code
echo ""
echo "3. Creating Stripe Promo Code 'PRODUCTHUNT'..."
read -p "   Create Stripe promo code? (y/n): " create_promo
if [ "$create_promo" = "y" ]; then
    echo "   Opening Stripe Dashboard..."
    open "https://dashboard.stripe.com/coupons"
    echo ""
    echo "   Create coupon with these settings:"
    echo "   - Name: Product Hunt Launch Special"
    echo "   - Code: PRODUCTHUNT"
    echo "   - Type: Percentage discount"
    echo "   - Percentage: 100% off"
    echo "   - Duration: Repeating"
    echo "   - Duration in months: 1"
    echo "   - Max redemptions: 200"
    echo "   - Expiration: 7 days from $LAUNCH_DATE"
    echo ""
    read -p "   Press Enter when promo code is created..."
    echo -e "   ${GREEN}✓ Promo code created${NC}"
    checklist[promo_code]=1
fi

# 4. Update Landing Pages with Extension ID
echo ""
echo "4. Updating landing pages with Extension ID..."
echo "   Files to update:"
echo "   - web/src/app/page.tsx"
echo "   - web/src/app/ph/page.tsx"
echo "   - marketing/product-hunt/PH_FOUNDER_COMMENT.md"
echo ""
read -p "   Update files now? (y/n): " update_files
if [ "$update_files" = "y" ]; then
    # Update founder comment
    sed -i.bak "s/\[EXTENSION_ID\]/$EXTENSION_ID/g" "$PROJECT_ROOT/marketing/product-hunt/PH_FOUNDER_COMMENT.md"
    echo -e "   ${GREEN}✓ Updated PH_FOUNDER_COMMENT.md${NC}"

    # Search for EXTENSION_ID placeholders
    echo ""
    echo "   Searching for EXTENSION_ID placeholders..."
    grep -r "EXTENSION_ID" "$PROJECT_ROOT/web/" "$PROJECT_ROOT/marketing/" 2>/dev/null || echo "   No placeholders found"

    checklist[update_files]=1
fi

# 5. Verify Product Hunt Assets
echo ""
echo "5. Verifying Product Hunt Assets..."
assets_ok=true

# Check gallery images
for i in 01 02 03; do
    if [ -f "$PROJECT_ROOT/store-assets/ph-gallery-$i.png" ]; then
        echo -e "   ${GREEN}✓ ph-gallery-$i.png${NC}"
    else
        echo -e "   ${RED}✗ ph-gallery-$i.png MISSING${NC}"
        assets_ok=false
    fi
done

# Check thumbnail
if [ -f "$PROJECT_ROOT/store-assets/ph-thumbnail.png" ]; then
    echo -e "   ${GREEN}✓ ph-thumbnail.png${NC}"
else
    echo -e "   ${RED}✗ ph-thumbnail.png MISSING${NC}"
    assets_ok=false
fi

if [ "$assets_ok" = true ]; then
    checklist[assets]=1
fi

# 6. Build Email List of 20 Hunters
echo ""
echo "6. Email List for Launch Support (20 hunters)..."
echo "   Target: Meta coworkers, friends, immigration communities"
echo ""
read -p "   Open hunter list builder? (y/n): " build_list
if [ "$build_list" = "y" ]; then
    if [ -f "$PROJECT_ROOT/marketing/product-hunt/launch-automation/hunter-list-builder.sh" ]; then
        bash "$PROJECT_ROOT/marketing/product-hunt/launch-automation/hunter-list-builder.sh"
        checklist[hunter_list]=1
    else
        echo -e "   ${YELLOW}⚠ hunter-list-builder.sh not found${NC}"
    fi
fi

# 7. Schedule Teaser Tweets
echo ""
echo "7. Teaser Tweets (5 tweets, day before launch)..."
echo "   Schedule for: $(date -v-1d -jf "%Y-%m-%d" "$LAUNCH_DATE" "+%Y-%m-%d") (Monday)"
echo ""
read -p "   Open tweet scheduler? (y/n): " schedule_tweets
if [ "$schedule_tweets" = "y" ]; then
    if [ -f "$PROJECT_ROOT/marketing/product-hunt/launch-automation/tweet-scheduler.sh" ]; then
        bash "$PROJECT_ROOT/marketing/product-hunt/launch-automation/tweet-scheduler.sh"
        checklist[tweets]=1
    else
        echo -e "   ${YELLOW}⚠ tweet-scheduler.sh not found${NC}"
    fi
fi

# 8. Prepare ConvertKit Email
echo ""
echo "8. ConvertKit Email Broadcast..."
echo "   Schedule for: $LAUNCH_DATE at 8:00 AM PT"
echo ""
read -p "   Open ConvertKit? (y/n): " open_convertkit
if [ "$open_convertkit" = "y" ]; then
    open "https://app.convertkit.com/broadcasts/new"
    echo ""
    echo "   Email Configuration:"
    echo "   - Subject: 🚀 NEXUS Alert is live - Never miss an appointment slot again"
    echo "   - Preview: Install free in 30 seconds. Start monitoring today."
    echo "   - Schedule: $LAUNCH_DATE 8:00 AM PT"
    echo "   - Extension Link: https://chromewebstore.google.com/detail/nexus-alert/$EXTENSION_ID"
    echo ""
    read -p "   Press Enter when email is scheduled..."
    checklist[email]=1
fi

# 9. Prepare Reddit Posts
echo ""
echo "9. Reddit Posts (3 subreddits)..."
echo "   - r/Nexus (12K members)"
echo "   - r/GlobalEntry (8K members)"
echo "   - r/PersonalFinanceCanada (900K members)"
echo ""
echo "   Posts are ready in: marketing/community-seeding/REDDIT_POSTS_READY_TO_USE.md"
echo -e "   ${YELLOW}⚠ Remember to replace [EXTENSION_ID] with: $EXTENSION_ID${NC}"
echo ""
read -p "   Posts reviewed? (y/n): " reddit_ready
if [ "$reddit_ready" = "y" ]; then
    checklist[reddit]=1
fi

# 10. Final Verification
echo ""
echo "10. Final Links Verification..."
echo "    Testing all URLs..."
echo ""

urls=(
    "https://nexusalert.app"
    "https://nexusalert.app/ph"
    "https://chromewebstore.google.com/detail/nexus-alert/$EXTENSION_ID"
)

for url in "${urls[@]}"; do
    echo "    Testing: $url"
    # Check if URL returns 200 OK (for deployed sites)
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|301\|302"; then
        echo -e "    ${GREEN}✓ OK${NC}"
    else
        echo -e "    ${YELLOW}⚠ Check manually${NC}"
    fi
done

# Summary
echo ""
echo "================================================"
echo "Pre-Launch Checklist Summary"
echo "================================================"
echo ""

total_checks=10
completed_checks=${#checklist[@]}

echo "Completed: $completed_checks / $total_checks"
echo ""

if [ $completed_checks -eq $total_checks ]; then
    echo -e "${GREEN}✓ ALL CHECKS PASSED - READY FOR LAUNCH${NC}"
    echo ""
    echo "Next Steps:"
    echo "1. Set alarm for $LAUNCH_DATE 12:01 AM PT"
    echo "2. Prepare Product Hunt submission draft"
    echo "3. Have founder comment ready to paste"
    echo "4. Block calendar for engagement (12-10 PM)"
    echo ""
    echo "Good luck! 🚀"
else
    echo -e "${RED}✗ INCOMPLETE - Complete all checks before launch${NC}"
    exit 1
fi

# Save configuration
cat > "$PROJECT_ROOT/marketing/product-hunt/launch-config.env" << EOF
EXTENSION_ID=$EXTENSION_ID
LAUNCH_DATE=$LAUNCH_DATE
CHECKLIST_COMPLETED=$(date +%Y-%m-%d)
EOF

echo ""
echo "Configuration saved to: marketing/product-hunt/launch-config.env"
