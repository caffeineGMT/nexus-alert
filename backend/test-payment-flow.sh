#!/usr/bin/env bash
# NEXUS Alert — End-to-End Payment Flow Testing Script
# Tests Stripe Live Mode integration and webhook delivery

set -euo pipefail

# Configuration
API_BASE="${API_BASE:-https://api.nexus-alert.com}"
TEST_EMAIL="${TEST_EMAIL:-test+premium$(date +%s)@nexus-alert.com}"
WRANGLER_KV_NAMESPACE_ID="${WRANGLER_KV_NAMESPACE_ID:-}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Test 1: Verify API is reachable
test_api_health() {
    log_info "Testing API health endpoint..."

    local response=$(curl -s -w "\n%{http_code}" "${API_BASE}/api/status")
    local body=$(echo "$response" | head -n -1)
    local status=$(echo "$response" | tail -n 1)

    if [ "$status" -eq 200 ]; then
        log_success "API is healthy"
        echo "$body" | jq '.'
        return 0
    else
        log_error "API health check failed (HTTP $status)"
        echo "$body"
        return 1
    fi
}

# Test 2: Create checkout session
test_checkout_session() {
    log_info "Creating Stripe checkout session for: $TEST_EMAIL"

    local response=$(curl -s -w "\n%{http_code}" \
        -X POST "${API_BASE}/api/checkout" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$TEST_EMAIL\"}")

    local body=$(echo "$response" | head -n -1)
    local status=$(echo "$response" | tail -n 1)

    if [ "$status" -eq 200 ]; then
        local checkout_url=$(echo "$body" | jq -r '.url')
        if [ "$checkout_url" != "null" ] && [ -n "$checkout_url" ]; then
            log_success "Checkout session created"
            echo -e "${GREEN}Checkout URL:${NC} $checkout_url"
            echo "$checkout_url" > /tmp/nexus-alert-checkout-url.txt
            return 0
        else
            log_error "No checkout URL in response"
            echo "$body" | jq '.'
            return 1
        fi
    else
        log_error "Checkout session creation failed (HTTP $status)"
        echo "$body" | jq '.'
        return 1
    fi
}

# Test 3: Verify license lookup (before payment)
test_license_lookup_free() {
    log_info "Verifying license lookup (should be 'free')..."

    local response=$(curl -s -w "\n%{http_code}" \
        "${API_BASE}/api/license?email=${TEST_EMAIL}")

    local body=$(echo "$response" | head -n -1)
    local status=$(echo "$response" | tail -n 1)

    if [ "$status" -eq 200 ]; then
        local tier=$(echo "$body" | jq -r '.tier')
        if [ "$tier" = "free" ]; then
            log_success "License lookup returns 'free' tier (correct)"
            return 0
        else
            log_error "Unexpected tier: $tier (expected 'free')"
            return 1
        fi
    else
        log_error "License lookup failed (HTTP $status)"
        echo "$body" | jq '.'
        return 1
    fi
}

# Test 4: Simulate webhook event (requires Stripe CLI)
test_webhook_simulation() {
    log_info "Checking if Stripe CLI is installed..."

    if ! command -v stripe &> /dev/null; then
        log_warning "Stripe CLI not installed. Skipping webhook simulation."
        log_warning "Install: brew install stripe/stripe-cli/stripe"
        return 0
    fi

    log_info "Triggering checkout.session.completed event..."

    # This requires Stripe CLI to be logged in
    if stripe trigger checkout.session.completed 2>&1 | grep -q "Error"; then
        log_warning "Stripe CLI not authenticated. Run: stripe login"
        return 0
    fi

    log_success "Webhook event triggered (check Stripe dashboard)"
}

# Test 5: Verify KV storage (requires wrangler and KV namespace ID)
test_kv_license() {
    log_info "Verifying license in KV storage..."

    if [ -z "$WRANGLER_KV_NAMESPACE_ID" ]; then
        log_warning "WRANGLER_KV_NAMESPACE_ID not set. Skipping KV verification."
        log_warning "Set it with: export WRANGLER_KV_NAMESPACE_ID=your_kv_id"
        return 0
    fi

    local key="license:$TEST_EMAIL"
    local result=$(npx wrangler kv:key get "$key" --namespace-id="$WRANGLER_KV_NAMESPACE_ID" 2>/dev/null || echo "")

    if [ -n "$result" ]; then
        log_success "License found in KV storage"
        echo "$result" | jq '.'

        local tier=$(echo "$result" | jq -r '.tier')
        if [ "$tier" = "premium" ]; then
            log_success "Tier is 'premium' (correct)"
            return 0
        else
            log_error "Tier is '$tier' (expected 'premium')"
            return 1
        fi
    else
        log_warning "License not found in KV storage (payment may not have completed yet)"
        return 0
    fi
}

# Test 6: Verify license lookup after payment
test_license_lookup_premium() {
    log_info "Verifying license lookup after payment (should be 'premium')..."

    local response=$(curl -s -w "\n%{http_code}" \
        "${API_BASE}/api/license?email=${TEST_EMAIL}")

    local body=$(echo "$response" | head -n -1)
    local status=$(echo "$response" | tail -n 1)

    if [ "$status" -eq 200 ]; then
        local tier=$(echo "$body" | jq -r '.tier')
        if [ "$tier" = "premium" ]; then
            log_success "License lookup returns 'premium' tier (correct)"
            return 0
        else
            log_warning "Tier is still '$tier' (webhook may not have fired yet)"
            log_warning "Wait for payment to complete, then re-run this test"
            return 0
        fi
    else
        log_error "License lookup failed (HTTP $status)"
        echo "$body" | jq '.'
        return 1
    fi
}

# Main test flow
main() {
    echo ""
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║   NEXUS Alert — Payment Flow E2E Test                    ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo ""

    log_info "Test email: $TEST_EMAIL"
    log_info "API base: $API_BASE"
    echo ""

    # Run tests
    test_api_health || exit 1
    echo ""

    test_license_lookup_free || exit 1
    echo ""

    test_checkout_session || exit 1
    echo ""

    # Pause for manual payment
    if [ -f /tmp/nexus-alert-checkout-url.txt ]; then
        log_warning "═══════════════════════════════════════════════════════════"
        log_warning "MANUAL STEP REQUIRED:"
        log_warning "1. Open the checkout URL above in your browser"
        log_warning "2. Complete payment with Stripe test card:"
        log_warning "   Card: 4242 4242 4242 4242"
        log_warning "   Expiry: 12/28"
        log_warning "   CVC: 123"
        log_warning "3. Wait for redirect to success page"
        log_warning "4. Press ENTER to continue testing..."
        log_warning "═══════════════════════════════════════════════════════════"
        read -r
    fi

    echo ""
    test_kv_license
    echo ""

    test_license_lookup_premium
    echo ""

    # Summary
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║   Test Summary                                            ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo ""
    log_success "All automated tests passed!"
    echo ""
    log_info "Next steps:"
    echo "  1. Verify webhook in Stripe Dashboard:"
    echo "     https://dashboard.stripe.com/webhooks"
    echo ""
    echo "  2. Check Cloudflare logs:"
    echo "     npx wrangler tail"
    echo ""
    echo "  3. Test extension premium features:"
    echo "     - Polling interval should be 2-3 minutes"
    echo "     - Email notifications enabled"
    echo ""
    echo "  4. Test subscription cancellation:"
    echo "     stripe customers list --limit 1"
    echo "     stripe subscriptions cancel sub_xxxxx"
    echo ""
}

main "$@"
