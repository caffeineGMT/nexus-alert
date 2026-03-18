#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════
# NEXUS Alert — Production Setup Verification
# ═══════════════════════════════════════════════════════════════════════
# Verifies that Stripe production migration was successful
# ═══════════════════════════════════════════════════════════════════════

BOLD="\033[1m"
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[1;33m"
BLUE="\033[0;34m"
RESET="\033[0m"

PASSED=0
FAILED=0
WARNINGS=0

echo -e "${BOLD}╔════════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║   NEXUS Alert — Production Setup Verification                 ║${RESET}"
echo -e "${BOLD}╚════════════════════════════════════════════════════════════════╝${RESET}"
echo ""

# ─────────────────────────────────────────────────────────────────
# Check 1: Cloudflare Worker Secrets
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}[1/7] Checking Cloudflare Worker Secrets${RESET}"

SECRETS=$(wrangler secret list 2>&1)

check_secret() {
    local secret_name=$1
    local required=$2

    if echo "$SECRETS" | grep -q "$secret_name"; then
        echo -e "${GREEN}  ✓ $secret_name${RESET}"
        ((PASSED++))
    else
        if [ "$required" = "true" ]; then
            echo -e "${RED}  ✗ $secret_name (MISSING - REQUIRED)${RESET}"
            ((FAILED++))
        else
            echo -e "${YELLOW}  ⚠ $secret_name (missing - optional)${RESET}"
            ((WARNINGS++))
        fi
    fi
}

check_secret "STRIPE_SECRET_KEY" "true"
check_secret "STRIPE_MONTHLY_PRICE_ID" "true"
check_secret "STRIPE_ANNUAL_PRICE_ID" "true"
check_secret "STRIPE_WEBHOOK_SECRET" "true"
check_secret "STRIPE_MONTHLY_PRICE_TEST" "false"
check_secret "STRIPE_ANNUAL_PRICE_TEST" "false"
check_secret "STRIPE_PRO_PRICE_ID" "false"

echo ""

# ─────────────────────────────────────────────────────────────────
# Check 2: Worker Deployment Status
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}[2/7] Checking Worker Deployment${RESET}"

WORKER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.nexus-alert.com/api/status 2>/dev/null)

if [ "$WORKER_STATUS" = "200" ]; then
    echo -e "${GREEN}  ✓ Worker is deployed and responding${RESET}"
    ((PASSED++))
else
    echo -e "${RED}  ✗ Worker not accessible (HTTP $WORKER_STATUS)${RESET}"
    ((FAILED++))
fi

echo ""

# ─────────────────────────────────────────────────────────────────
# Check 3: API Endpoints
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}[3/7] Testing API Endpoints${RESET}"

# Test checkout endpoint
CHECKOUT_TEST=$(curl -s -X POST https://api.nexus-alert.com/api/checkout \
    -H "Content-Type: application/json" \
    -d '{"email":"verify@test.com","plan":"monthly"}' 2>/dev/null)

if echo "$CHECKOUT_TEST" | grep -q '"url"'; then
    echo -e "${GREEN}  ✓ /api/checkout endpoint working${RESET}"
    ((PASSED++))
else
    echo -e "${RED}  ✗ /api/checkout endpoint failed${RESET}"
    echo -e "${YELLOW}     Response: $CHECKOUT_TEST${RESET}"
    ((FAILED++))
fi

# Test license endpoint
LICENSE_TEST=$(curl -s "https://api.nexus-alert.com/api/license?email=verify@test.com" 2>/dev/null)

if echo "$LICENSE_TEST" | grep -q '"tier"'; then
    echo -e "${GREEN}  ✓ /api/license endpoint working${RESET}"
    ((PASSED++))
else
    echo -e "${RED}  ✗ /api/license endpoint failed${RESET}"
    ((FAILED++))
fi

echo ""

# ─────────────────────────────────────────────────────────────────
# Check 4: Stripe Live Mode Verification
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}[4/7] Verifying Stripe Configuration${RESET}"

# Extract checkout URL to check if it's using live mode
CHECKOUT_URL=$(echo "$CHECKOUT_TEST" | grep -o '"url":"[^"]*"' | sed 's/"url":"\(.*\)"/\1/')

if echo "$CHECKOUT_URL" | grep -q "checkout.stripe.com"; then
    if echo "$CHECKOUT_URL" | grep -q "cs_test_"; then
        echo -e "${RED}  ✗ Stripe is in TEST MODE (checkout session starts with cs_test_)${RESET}"
        echo -e "${YELLOW}     You may need to update STRIPE_SECRET_KEY to sk_live_...${RESET}"
        ((FAILED++))
    else
        echo -e "${GREEN}  ✓ Stripe is in LIVE MODE (production ready)${RESET}"
        ((PASSED++))
    fi
else
    echo -e "${YELLOW}  ⚠ Could not verify Stripe mode${RESET}"
    ((WARNINGS++))
fi

echo ""

# ─────────────────────────────────────────────────────────────────
# Check 5: DNS & Custom Domain
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}[5/7] Checking DNS & Custom Domain${RESET}"

# Check if api.nexus-alert.com resolves
DNS_CHECK=$(dig +short api.nexus-alert.com 2>/dev/null)

if [ -n "$DNS_CHECK" ]; then
    echo -e "${GREEN}  ✓ DNS configured for api.nexus-alert.com${RESET}"
    echo -e "${YELLOW}     Resolves to: $DNS_CHECK${RESET}"
    ((PASSED++))
else
    echo -e "${YELLOW}  ⚠ DNS not yet propagated for api.nexus-alert.com${RESET}"
    ((WARNINGS++))
fi

echo ""

# ─────────────────────────────────────────────────────────────────
# Check 6: Webhook Configuration
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}[6/7] Webhook Configuration${RESET}"

if echo "$SECRETS" | grep -q "STRIPE_WEBHOOK_SECRET"; then
    echo -e "${GREEN}  ✓ Webhook signing secret configured${RESET}"
    ((PASSED++))
else
    echo -e "${RED}  ✗ Webhook signing secret missing${RESET}"
    echo -e "${YELLOW}     Set with: wrangler secret put STRIPE_WEBHOOK_SECRET${RESET}"
    ((FAILED++))
fi

echo -e "${YELLOW}  ⓘ Manual verification required:${RESET}"
echo -e "${YELLOW}     1. Go to: https://dashboard.stripe.com/webhooks${RESET}"
echo -e "${YELLOW}     2. Verify endpoint: https://api.nexus-alert.com/api/webhook${RESET}"
echo -e "${YELLOW}     3. Check events: checkout.session.completed, customer.subscription.*${RESET}"

echo ""

# ─────────────────────────────────────────────────────────────────
# Check 7: Additional Configuration
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}${BOLD}[7/7] Additional Services${RESET}"

check_secret "RESEND_API_KEY" "false"
check_secret "TWILIO_ACCOUNT_SID" "false"
check_secret "TWILIO_AUTH_TOKEN" "false"
check_secret "CONVERTKIT_API_KEY" "false"
check_secret "WEBHOOK_SECRET" "true"

echo ""

# ─────────────────────────────────────────────────────────────────
# Summary
# ─────────────────────────────────────────────────────────────────

echo -e "${BOLD}════════════════════════════════════════════════════════════════${RESET}"
echo -e "${BOLD}VERIFICATION SUMMARY${RESET}"
echo -e "${BOLD}════════════════════════════════════════════════════════════════${RESET}"
echo ""
echo -e "${GREEN}  Passed:   $PASSED${RESET}"
echo -e "${YELLOW}  Warnings: $WARNINGS${RESET}"
echo -e "${RED}  Failed:   $FAILED${RESET}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}${BOLD}✓ PRODUCTION READY${RESET}"
    echo ""
    echo -e "${BOLD}Next Steps:${RESET}"
    echo "  1. Test end-to-end payment with real card"
    echo "  2. Verify webhook receives events in Stripe Dashboard"
    echo "  3. Monitor first real customer payment closely"
    echo "  4. Update Chrome extension to production mode"
    echo ""
    exit 0
else
    echo -e "${RED}${BOLD}✗ PRODUCTION NOT READY${RESET}"
    echo ""
    echo -e "${BOLD}Action Required:${RESET}"
    echo "  Fix the failed checks above before accepting real payments"
    echo ""
    echo -e "${BOLD}Common Fixes:${RESET}"
    echo "  • Missing secrets: Run ./scripts/stripe-production-migration.sh"
    echo "  • Test mode active: Use sk_live_ key instead of sk_test_"
    echo "  • Worker not deployed: Run 'wrangler deploy'"
    echo ""
    exit 1
fi
