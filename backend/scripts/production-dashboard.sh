#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════
# NEXUS Alert — Production Revenue & Health Dashboard
# ═══════════════════════════════════════════════════════════════════════
# Real-time monitoring dashboard for Stripe production metrics
# ═══════════════════════════════════════════════════════════════════════

set -e

BOLD="\033[1m"
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[1;33m"
BLUE="\033[0;34m"
CYAN="\033[0;36m"
RESET="\033[0m"

API_BASE="${API_BASE:-https://api.nexus-alert.com}"

# Clear screen for dashboard
clear

echo -e "${BOLD}╔════════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║   NEXUS Alert — Production Health Dashboard                   ║${RESET}"
echo -e "${BOLD}╚════════════════════════════════════════════════════════════════╝${RESET}"
echo ""
echo -e "${CYAN}Last updated: $(date '+%Y-%m-%d %H:%M:%S')${RESET}"
echo ""

# ─────────────────────────────────────────────────────────────────
# 1. API Health Check
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}═══ API Health ═══${RESET}"
echo ""

HEALTH_START=$(date +%s%3N)
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_BASE/health" 2>/dev/null)
HEALTH_END=$(date +%s%3N)
HEALTH_TIME=$((HEALTH_END - HEALTH_START))

HEALTH_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
HEALTH_BODY=$(echo "$HEALTH_RESPONSE" | head -n-1)

if [ "$HEALTH_CODE" = "200" ]; then
    echo -e "${GREEN}✓ API Operational${RESET}"
    echo -e "  Response time: ${HEALTH_TIME}ms"
else
    echo -e "${RED}✗ API Down (HTTP $HEALTH_CODE)${RESET}"
fi

echo ""

# ─────────────────────────────────────────────────────────────────
# 2. Cloudflare Worker Status
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}═══ Cloudflare Worker ═══${RESET}"
echo ""

# Check worker deployment
WORKER_STATUS=$(npx wrangler deployments list 2>&1 | head -10)

if echo "$WORKER_STATUS" | grep -q "error"; then
    echo -e "${YELLOW}⚠ Cannot check worker status (auth required)${RESET}"
    echo -e "  Run: ${CYAN}npx wrangler deployments list${RESET}"
else
    echo -e "${GREEN}✓ Worker deployed${RESET}"
    echo "$WORKER_STATUS" | head -5
fi

echo ""

# ─────────────────────────────────────────────────────────────────
# 3. Stripe Configuration Check
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}═══ Stripe Configuration ═══${RESET}"
echo ""

# Test checkout endpoint to verify Stripe mode
TEST_CHECKOUT=$(curl -s -X POST "$API_BASE/api/checkout" \
  -H "Content-Type: application/json" \
  -d '{"email":"health-check@test.com","plan":"monthly"}')

CHECKOUT_URL=$(echo "$TEST_CHECKOUT" | grep -o '"url":"[^"]*"' | sed 's/"url":"\(.*\)"/\1/')

if echo "$CHECKOUT_URL" | grep -q "cs_live_"; then
    echo -e "${GREEN}✓ Live Mode Active${RESET}"
    echo -e "  Stripe session: $(echo $CHECKOUT_URL | grep -o 'cs_live_[^/]*')"
elif echo "$CHECKOUT_URL" | grep -q "cs_test_"; then
    echo -e "${RED}✗ WARNING: Test Mode Active${RESET}"
    echo -e "  ${YELLOW}Production revenue is NOT being collected${RESET}"
    echo -e "  ${YELLOW}Update STRIPE_SECRET_KEY to sk_live_...${RESET}"
else
    echo -e "${YELLOW}⚠ Cannot determine Stripe mode${RESET}"
    echo -e "  Response: $TEST_CHECKOUT"
fi

echo ""

# ─────────────────────────────────────────────────────────────────
# 4. Webhook Configuration
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}═══ Webhook Health ═══${RESET}"
echo ""

# Check if webhook secret is configured
SECRETS=$(npx wrangler secret list 2>&1)

if echo "$SECRETS" | grep -q "STRIPE_WEBHOOK_SECRET"; then
    echo -e "${GREEN}✓ Webhook Secret Configured${RESET}"
else
    echo -e "${RED}✗ Webhook Secret Missing${RESET}"
    echo -e "  ${YELLOW}Run: npx wrangler secret put STRIPE_WEBHOOK_SECRET${RESET}"
fi

echo ""
echo -e "${CYAN}Webhook endpoint:${RESET} $API_BASE/api/webhook"
echo ""
echo -e "${YELLOW}Manual checks required:${RESET}"
echo "  1. Visit: https://dashboard.stripe.com/webhooks"
echo "  2. Verify endpoint exists: $API_BASE/api/webhook"
echo "  3. Check success rate (should be 100%)"
echo "  4. Review recent deliveries (all should be 200 OK)"

echo ""

# ─────────────────────────────────────────────────────────────────
# 5. Recent API Activity
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}═══ API Endpoints ═══${RESET}"
echo ""

test_endpoint() {
    local name=$1
    local url=$2
    local method=${3:-GET}

    START=$(date +%s%3N)
    if [ "$method" = "POST" ]; then
        STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$url" \
            -H "Content-Type: application/json" -d '{}' 2>/dev/null)
    else
        STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    fi
    END=$(date +%s%3N)
    TIME=$((END - START))

    if [ "$STATUS" = "200" ] || [ "$STATUS" = "400" ]; then
        echo -e "${GREEN}✓${RESET} $name (${TIME}ms)"
    else
        echo -e "${RED}✗${RESET} $name (HTTP $STATUS)"
    fi
}

test_endpoint "Health Check" "$API_BASE/health"
test_endpoint "License Lookup" "$API_BASE/api/license?email=test@example.com"
test_endpoint "Checkout (Monthly)" "$API_BASE/api/checkout" "POST"
test_endpoint "Checkout (Annual)" "$API_BASE/api/checkout" "POST"

echo ""

# ─────────────────────────────────────────────────────────────────
# 6. Secrets Configuration
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}═══ Required Secrets ═══${RESET}"
echo ""

check_secret() {
    local secret_name=$1
    local required=$2

    if echo "$SECRETS" | grep -q "$secret_name"; then
        echo -e "${GREEN}✓${RESET} $secret_name"
    else
        if [ "$required" = "true" ]; then
            echo -e "${RED}✗${RESET} $secret_name ${RED}(REQUIRED)${RESET}"
        else
            echo -e "${YELLOW}⚠${RESET} $secret_name ${YELLOW}(optional)${RESET}"
        fi
    fi
}

check_secret "STRIPE_SECRET_KEY" "true"
check_secret "STRIPE_MONTHLY_PRICE_ID" "true"
check_secret "STRIPE_ANNUAL_PRICE_ID" "true"
check_secret "STRIPE_WEBHOOK_SECRET" "true"
check_secret "WEBHOOK_SECRET" "true"
check_secret "RESEND_API_KEY" "false"
check_secret "CONVERTKIT_API_KEY" "false"
check_secret "TWILIO_ACCOUNT_SID" "false"

echo ""

# ─────────────────────────────────────────────────────────────────
# 7. DNS & Domain Configuration
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}═══ DNS & Domain ═══${RESET}"
echo ""

DNS_RESULT=$(dig +short api.nexus-alert.com 2>/dev/null)

if [ -n "$DNS_RESULT" ]; then
    echo -e "${GREEN}✓ DNS Configured${RESET}"
    echo -e "  api.nexus-alert.com → $DNS_RESULT"
else
    echo -e "${RED}✗ DNS Not Configured${RESET}"
    echo -e "  ${YELLOW}Set up custom domain in Cloudflare Workers${RESET}"
fi

echo ""

# ─────────────────────────────────────────────────────────────────
# 8. System Recommendations
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}═══ Recommendations ═══${RESET}"
echo ""

RECOMMENDATIONS=()

# Check if in test mode
if echo "$CHECKOUT_URL" | grep -q "cs_test_"; then
    RECOMMENDATIONS+=("${RED}CRITICAL:${RESET} Switch to Stripe Live Mode")
fi

# Check for missing required secrets
if ! echo "$SECRETS" | grep -q "STRIPE_SECRET_KEY"; then
    RECOMMENDATIONS+=("${RED}CRITICAL:${RESET} Set STRIPE_SECRET_KEY")
fi

if ! echo "$SECRETS" | grep -q "STRIPE_WEBHOOK_SECRET"; then
    RECOMMENDATIONS+=("${YELLOW}HIGH:${RESET} Set STRIPE_WEBHOOK_SECRET")
fi

if [ ${#RECOMMENDATIONS[@]} -eq 0 ]; then
    echo -e "${GREEN}✓ No critical issues${RESET}"
    echo ""
    echo -e "${BOLD}Optional improvements:${RESET}"
    echo "  • Set up Sentry error tracking (SENTRY_DSN)"
    echo "  • Configure email automation (RESEND_API_KEY)"
    echo "  • Enable SMS notifications (TWILIO_*)"
else
    for rec in "${RECOMMENDATIONS[@]}"; do
        echo -e "  • $rec"
    done
fi

echo ""

# ─────────────────────────────────────────────────────────────────
# 9. Quick Actions
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}═══ Quick Actions ═══${RESET}"
echo ""

echo -e "${CYAN}Run E2E test:${RESET}"
echo "  ./scripts/test-subscription-flow.sh"
echo ""

echo -e "${CYAN}View live logs:${RESET}"
echo "  npx wrangler tail"
echo ""

echo -e "${CYAN}Deploy latest changes:${RESET}"
echo "  npx wrangler deploy"
echo ""

echo -e "${CYAN}Verify production setup:${RESET}"
echo "  ./scripts/verify-production-setup.sh"
echo ""

echo -e "${CYAN}Check Stripe Dashboard:${RESET}"
echo "  Payments:  https://dashboard.stripe.com/payments"
echo "  Webhooks:  https://dashboard.stripe.com/webhooks"
echo "  Customers: https://dashboard.stripe.com/customers"
echo ""

# ─────────────────────────────────────────────────────────────────
# 10. Summary Status
# ─────────────────────────────────────────────────────────────────

echo -e "${BOLD}════════════════════════════════════════════════════════════════${RESET}"

if [ ${#RECOMMENDATIONS[@]} -eq 0 ] && echo "$CHECKOUT_URL" | grep -q "cs_live_"; then
    echo -e "${GREEN}${BOLD}✓ PRODUCTION READY — ACCEPTING PAYMENTS${RESET}"
    echo ""
    echo -e "  ${GREEN}Revenue system operational${RESET}"
    echo -e "  ${GREEN}All critical systems healthy${RESET}"
    echo ""
    echo -e "  Next: Monitor Stripe Dashboard for first payment"
elif echo "$CHECKOUT_URL" | grep -q "cs_test_"; then
    echo -e "${YELLOW}${BOLD}⚠ TEST MODE — NOT ACCEPTING REAL PAYMENTS${RESET}"
    echo ""
    echo -e "  ${YELLOW}Switch to Live Mode to start earning revenue${RESET}"
    echo -e "  ${YELLOW}Run: ./scripts/stripe-production-migration.sh${RESET}"
else
    echo -e "${RED}${BOLD}✗ CONFIGURATION INCOMPLETE${RESET}"
    echo ""
    echo -e "  ${RED}Fix issues above before accepting payments${RESET}"
fi

echo -e "${BOLD}════════════════════════════════════════════════════════════════${RESET}"
echo ""
