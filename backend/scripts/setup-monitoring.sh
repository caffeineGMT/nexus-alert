#!/usr/bin/env bash
# NEXUS Alert — Monitoring Setup Script
# Interactive setup for production monitoring

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

echo ""
echo -e "${BOLD}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║       NEXUS Alert — Monitoring Setup                         ║${NC}"
echo -e "${BOLD}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Slack Webhook
echo -e "${CYAN}Step 1: Slack Webhook Configuration${NC}"
echo ""
echo "You need a Slack incoming webhook URL to receive alerts."
echo "Create one at: https://api.slack.com/messaging/webhooks"
echo ""
read -p "Do you have a Slack webhook URL? (y/n): " has_webhook

if [ "$has_webhook" = "y" ] || [ "$has_webhook" = "Y" ]; then
    read -p "Enter Slack webhook URL: " slack_webhook

    # Test webhook
    echo -e "${YELLOW}Testing webhook...${NC}"
    response=$(curl -X POST "$slack_webhook" \
        -H 'Content-Type: application/json' \
        -d '{"text":"✅ NEXUS Alert monitoring setup test"}' \
        --silent --write-out "%{http_code}" --output /dev/null)

    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✓ Webhook test successful!${NC}"

        # Set secret in Cloudflare
        echo ""
        read -p "Set this webhook in Cloudflare Worker secrets? (y/n): " set_secret
        if [ "$set_secret" = "y" ] || [ "$set_secret" = "Y" ]; then
            echo "$slack_webhook" | wrangler secret put SLACK_WEBHOOK_URL --env production
            echo -e "${GREEN}✓ Secret set in Cloudflare${NC}"
        fi
    else
        echo -e "${RED}✗ Webhook test failed (HTTP $response)${NC}"
        echo "Please check your webhook URL"
    fi
else
    echo -e "${YELLOW}Skipping Slack setup. You can configure it later.${NC}"
fi

echo ""
echo "───────────────────────────────────────────────────────────────"
echo ""

# Step 2: Cloudflare API Token
echo -e "${CYAN}Step 2: Cloudflare Analytics Setup${NC}"
echo ""
echo "To enable the analytics dashboard, you need:"
echo "  1. Cloudflare API Token (with Analytics:Read permission)"
echo "  2. Cloudflare Account ID"
echo ""
echo "Get these from:"
echo "  - API Token: https://dash.cloudflare.com/profile/api-tokens"
echo "  - Account ID: Run 'wrangler whoami'"
echo ""
read -p "Do you want to set up analytics now? (y/n): " setup_analytics

if [ "$setup_analytics" = "y" ] || [ "$setup_analytics" = "Y" ]; then
    read -p "Enter Cloudflare API Token: " cf_token
    read -p "Enter Cloudflare Account ID: " cf_account

    # Save to .env file
    cat > .env.monitoring <<EOF
# NEXUS Alert Monitoring Configuration
# Generated: $(date)

# Slack Alerts
SLACK_WEBHOOK_URL="${slack_webhook:-}"

# Cloudflare Analytics
CLOUDFLARE_API_TOKEN="$cf_token"
CLOUDFLARE_ACCOUNT_ID="$cf_account"
WORKER_NAME="nexus-alert-backend"

# Health Monitoring
HEALTH_URL="https://api.nexus-alert.com/health"
CHECK_INTERVAL=60
ALERT_THRESHOLD=3

# Analytics Dashboard
REFRESH_INTERVAL=30
EOF

    echo -e "${GREEN}✓ Configuration saved to .env.monitoring${NC}"
    echo ""
    echo "To use this configuration:"
    echo "  source .env.monitoring"
else
    echo -e "${YELLOW}Skipping analytics setup.${NC}"
fi

echo ""
echo "───────────────────────────────────────────────────────────────"
echo ""

# Step 3: Test Health Endpoint
echo -e "${CYAN}Step 3: Testing Health Endpoint${NC}"
echo ""

if command -v curl &> /dev/null && command -v jq &> /dev/null; then
    echo "Testing https://api.nexus-alert.com/health ..."
    health_response=$(curl -s -w "\n%{http_code}" https://api.nexus-alert.com/health 2>/dev/null || echo -e "\n000")
    http_code=$(echo "$health_response" | tail -n1)
    health_data=$(echo "$health_response" | sed '$d')

    if [ "$http_code" = "200" ] || [ "$http_code" = "503" ]; then
        echo -e "${GREEN}✓ Health endpoint responding (HTTP $http_code)${NC}"
        echo ""
        echo "$health_data" | jq -C '.' 2>/dev/null || echo "$health_data"
    else
        echo -e "${RED}✗ Health endpoint not responding (HTTP $http_code)${NC}"
        echo "Make sure the worker is deployed: cd .. && wrangler deploy --env production"
    fi
else
    echo -e "${YELLOW}⚠ curl or jq not installed, skipping health check test${NC}"
    echo "Install with: brew install curl jq"
fi

echo ""
echo "───────────────────────────────────────────────────────────────"
echo ""

# Step 4: Next Steps
echo -e "${BOLD}Setup Complete!${NC}"
echo ""
echo -e "${GREEN}✓${NC} Monitoring configured"
if [ -f ".env.monitoring" ]; then
    echo -e "${GREEN}✓${NC} Configuration saved to .env.monitoring"
fi
echo ""
echo -e "${BOLD}Next Steps:${NC}"
echo ""
echo "1. Run health monitor:"
echo "   ${CYAN}source .env.monitoring && ./scripts/monitor-health.sh${NC}"
echo ""
echo "2. Run analytics dashboard:"
echo "   ${CYAN}source .env.monitoring && ./scripts/analytics-dashboard.js${NC}"
echo ""
echo "3. Test Slack alerts:"
echo "   ${CYAN}source .env.monitoring && ./scripts/test-alerts.sh${NC}"
echo ""
echo "4. View comprehensive guide:"
echo "   ${CYAN}cat MONITORING_GUIDE.md${NC}"
echo ""
echo "For production deployment (systemd/Docker), see MONITORING_GUIDE.md"
echo ""
