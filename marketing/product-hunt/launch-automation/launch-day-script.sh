#!/bin/bash

# Product Hunt Launch Day Execution Script
# Run at 12:01 AM PT on launch day (Tuesday)

set -e

PROJECT_ROOT="/Users/michaelguo/nexus-alert"
CONFIG_FILE="$PROJECT_ROOT/marketing/product-hunt/launch-config.env"

# Load configuration
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
else
    echo "Error: launch-config.env not found. Run pre-launch-checklist.sh first."
    exit 1
fi

echo "🚀 NEXUS Alert - Product Hunt Launch Day Script"
echo "==============================================="
echo ""
echo "Extension ID: $EXTENSION_ID"
echo "Launch Time: $(date)"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to wait for user confirmation
confirm() {
    local message=$1
    echo -e "${BLUE}→ $message${NC}"
    read -p "  Press Enter when done..."
    echo -e "${GREEN}✓ Done${NC}"
    echo ""
}

# Function to show countdown
countdown() {
    local minutes=$1
    echo ""
    echo "⏱️  Next task in $minutes minutes..."
    echo ""
}

# =====================
# PHASE 1: 12:01 AM PT
# Product Hunt Launch
# =====================

echo "================================================"
echo "PHASE 1: Product Hunt Submission (12:01 AM PT)"
echo "================================================"
echo ""

# Open Product Hunt
echo "Opening Product Hunt submission page..."
open "https://www.producthunt.com/posts/new"
echo ""

# Display submission details
echo "Product Hunt Submission Details:"
echo "-------------------------------"
echo "Name: NEXUS Alert"
echo "Tagline: $(cat $PROJECT_ROOT/marketing/product-hunt/PH_TAGLINE.txt)"
echo "Website: https://nexusalert.app/ph"
echo "Topics: Productivity, Travel, Chrome Extensions, Notifications, SaaS"
echo ""

echo "Description:"
cat << 'EOF'
24/7 monitoring for NEXUS, Global Entry, and SENTRI appointment openings.
Get instant desktop + sound alerts when slots appear at your enrollment centers.
Free tier checks every 30 minutes. Premium tier ($4.99/mo) adds 2-minute checks + SMS/email alerts.
EOF
echo ""

echo "Gallery Images:"
echo "  1. $PROJECT_ROOT/store-assets/ph-gallery-01.png"
echo "  2. $PROJECT_ROOT/store-assets/ph-gallery-02.png"
echo "  3. $PROJECT_ROOT/store-assets/ph-gallery-03.png"
echo ""
echo "Thumbnail: $PROJECT_ROOT/store-assets/ph-thumbnail.png"
echo ""

confirm "Submit to Product Hunt and copy the Product Hunt URL"

# Get Product Hunt URL
read -p "Enter Product Hunt URL: " PH_URL
echo "Product Hunt URL: $PH_URL" >> "$CONFIG_FILE"
echo ""

# =====================
# Post Founder Comment
# =====================

echo "================================================"
echo "POST FOUNDER COMMENT (within 1 minute)"
echo "================================================"
echo ""

# Display founder comment
cat "$PROJECT_ROOT/marketing/product-hunt/PH_FOUNDER_COMMENT.md"
echo ""

confirm "Copy founder comment above and post as FIRST COMMENT on Product Hunt"

# =====================
# Tweet Launch
# =====================

echo "================================================"
echo "TWEET LAUNCH ANNOUNCEMENT"
echo "================================================"
echo ""

cat << EOF
🚀 NEXUS Alert is LIVE on Product Hunt!

Never miss a NEXUS, Global Entry, or SENTRI appointment slot again.

Free Chrome extension. Instant notifications. Works 24/7.

First month of Premium FREE with code PRODUCTHUNT.

👉 $PH_URL

Help us get to #1! 🙏
EOF
echo ""

confirm "Post launch tweet on Twitter/X"

# =====================
# Set Hourly Reminders
# =====================

echo "================================================"
echo "SET ENGAGEMENT REMINDERS"
echo "================================================"
echo ""

echo "Set phone alarms for:"
echo "  1:00 AM - Check comments and reply"
echo "  2:00 AM - Check comments and reply"
echo "  3:00 AM - Check comments and reply"
echo "  8:00 AM - Email blast to waitlist"
echo "  9:00 AM - Reddit posts (3 subreddits)"
echo "  10:00 AM - Check all metrics"
echo ""

confirm "Set all phone alarms"

# =====================
# PHASE 2: 8:00 AM PT
# Email Waitlist
# =====================

echo "================================================"
echo "SCHEDULE: 8:00 AM PT - Email Waitlist"
echo "================================================"
echo ""

echo "ConvertKit Broadcast:"
echo "  Subject: 🚀 NEXUS Alert is live - Never miss an appointment slot again"
echo "  Preview: Install free in 30 seconds. Start monitoring today."
echo "  Link: https://chromewebstore.google.com/detail/nexus-alert/$EXTENSION_ID"
echo "  PH Link: $PH_URL"
echo ""
echo "Open ConvertKit at 8:00 AM: https://app.convertkit.com/broadcasts"
echo ""

# =====================
# PHASE 3: 9:00 AM PT
# Reddit Launch
# =====================

echo "================================================"
echo "SCHEDULE: 9:00 AM PT - Reddit Launch Posts"
echo "================================================"
echo ""

echo "Reddit UTM Links:"
echo "  r/Nexus: https://chromewebstore.google.com/detail/nexus-alert/$EXTENSION_ID?utm_source=reddit&utm_campaign=nexus_launch&utm_content=r_nexus"
echo "  r/GlobalEntry: https://chromewebstore.google.com/detail/nexus-alert/$EXTENSION_ID?utm_source=reddit&utm_campaign=nexus_launch&utm_content=r_globalentry"
echo "  r/PersonalFinanceCanada: https://chromewebstore.google.com/detail/nexus-alert/$EXTENSION_ID?utm_source=reddit&utm_campaign=nexus_launch&utm_content=r_pfc"
echo ""

echo "Reddit posts are ready in:"
echo "  $PROJECT_ROOT/marketing/community-seeding/REDDIT_POSTS_READY_TO_USE.md"
echo ""

echo "Post schedule:"
echo "  9:00 AM - r/Nexus"
echo "  9:10 AM - r/GlobalEntry"
echo "  9:20 AM - r/PersonalFinanceCanada"
echo ""

echo "CRITICAL: Respond to EVERY comment within 15 minutes (first 2 hours)"
echo ""

# =====================
# Monitoring Dashboard
# =====================

echo "================================================"
echo "MONITORING DASHBOARD"
echo "================================================"
echo ""

echo "Open these tabs and monitor throughout the day:"
echo ""

echo "Product Hunt:"
echo "  → $PH_URL"
echo ""

echo "Chrome Web Store:"
echo "  → https://chromewebstore.google.com/detail/nexus-alert/$EXTENSION_ID"
echo "  → Developer Console: https://chrome.google.com/webstore/devconsole"
echo ""

echo "Analytics:"
echo "  → Google Analytics: https://analytics.google.com"
echo "  → Stripe Dashboard: https://dashboard.stripe.com"
echo "  → Plausible: https://plausible.io"
echo ""

echo "Social:"
echo "  → Twitter/X Analytics"
echo "  → Reddit (r/Nexus, r/GlobalEntry, r/PersonalFinanceCanada)"
echo ""

confirm "Open all monitoring tabs"

# =====================
# Success Metrics
# =====================

echo "================================================"
echo "SUCCESS METRICS - Track Throughout Day"
echo "================================================"
echo ""

cat << 'EOF'
| Metric                     | Minimum | Target  | Stretch  |
|----------------------------|---------|---------|----------|
| Chrome Installs            | 200+    | 500+    | 1,000+   |
| Premium Signups            | 20+     | 50+     | 100+     |
| Product Hunt Upvotes       | 200+    | 500+    | 1,000+   |
| Product Hunt Ranking       | Top 10  | #3-5    | #1       |
| Reddit Combined Upvotes    | 100+    | 300+    | 500+     |
| Email Open Rate            | 30%+    | 40%+    | 50%+     |
| PRODUCTHUNT Code Uses      | 50+     | 100+    | 200 max  |
EOF
echo ""

# Create metrics tracking file
cat > "$PROJECT_ROOT/marketing/product-hunt/launch-metrics.csv" << 'EOF'
time,ph_upvotes,ph_ranking,chrome_installs,premium_signups,reddit_upvotes,email_opens,promo_uses,notes
12:00 AM,0,0,0,0,0,0,0,Launch
1:00 AM,,,,,,,,
2:00 AM,,,,,,,,
3:00 AM,,,,,,,,
8:00 AM,,,,,,,,Email sent
9:00 AM,,,,,,,,Reddit posted
10:00 AM,,,,,,,,
12:00 PM,,,,,,,,
2:00 PM,,,,,,,,
4:00 PM,,,,,,,,
6:00 PM,,,,,,,,
8:00 PM,,,,,,,,
11:59 PM,,,,,,,,End of day
EOF

echo "✓ Metrics tracking file created: marketing/product-hunt/launch-metrics.csv"
echo ""

# =====================
# Emergency Contacts
# =====================

echo "================================================"
echo "EMERGENCY PROTOCOLS"
echo "================================================"
echo ""

echo "If things go wrong:"
echo ""
echo "1. Promo code not working:"
echo "   → Check Stripe: https://dashboard.stripe.com/coupons"
echo "   → Post apology on PH + manually issue credits"
echo ""
echo "2. Extension crashes:"
echo "   → Check Chrome Console: https://chrome.google.com/webstore/devconsole"
echo "   → Push hotfix if critical"
echo ""
echo "3. Website down:"
echo "   → Check Vercel: https://vercel.com/dashboard"
echo "   → Roll back deployment if needed"
echo ""

# =====================
# Final Checklist
# =====================

echo "================================================"
echo "FINAL PRE-LAUNCH CHECKLIST"
echo "================================================"
echo ""

declare -a final_checks=(
    "Product Hunt submitted ✓"
    "Founder comment posted ✓"
    "Launch tweet posted ✓"
    "Hourly alarms set ✓"
    "Monitoring tabs open ✓"
    "Phone fully charged 🔋"
    "Notifications ON 🔔"
)

for check in "${final_checks[@]}"; do
    echo "✓ $check"
done

echo ""
echo "================================================"
echo "🚀 LAUNCH IS LIVE!"
echo "================================================"
echo ""
echo "Engagement Plan:"
echo "  → Reply to EVERY Product Hunt comment within 10 min"
echo "  → Reply to EVERY Reddit comment within 15 min (9-11 AM critical)"
echo "  → Monitor metrics hourly"
echo "  → Celebrate milestones on Twitter"
echo "  → Stay positive and helpful"
echo ""
echo "Remember: This is a marathon, not a sprint."
echo "Engage authentically. Help people. Build trust."
echo ""
echo "You've got this! 💪"
echo ""

# Save launch timestamp
echo "LAUNCH_TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$CONFIG_FILE"
echo "PRODUCT_HUNT_URL=$PH_URL" >> "$CONFIG_FILE"
