#!/usr/bin/env bash
# NEXUS Alert — Production Monitoring Dashboard
# Real-time monitoring of key metrics for the first 48 hours post-launch

set -euo pipefail

# Configuration
API_BASE="${API_BASE:-https://api.nexus-alert.com}"
STRIPE_API_KEY="${STRIPE_API_KEY:-}"
REFRESH_INTERVAL="${REFRESH_INTERVAL:-30}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Check dependencies
check_dependencies() {
    local missing=()

    if ! command -v jq &> /dev/null; then
        missing+=("jq")
    fi

    if ! command -v stripe &> /dev/null; then
        missing+=("stripe-cli")
    fi

    if [ ${#missing[@]} -gt 0 ]; then
        echo -e "${RED}Missing dependencies:${NC} ${missing[*]}"
        echo "Install with:"
        echo "  brew install jq stripe/stripe-cli/stripe"
        exit 1
    fi

    if [ -z "$STRIPE_API_KEY" ]; then
        echo -e "${YELLOW}Warning:${NC} STRIPE_API_KEY not set. Stripe metrics will be unavailable."
        echo "Set it with: export STRIPE_API_KEY=sk_live_xxxxx"
    fi
}

# Fetch worker status
fetch_worker_status() {
    local response=$(curl -s "${API_BASE}/api/status" 2>/dev/null || echo '{}')
    echo "$response"
}

# Fetch Stripe metrics
fetch_stripe_metrics() {
    if [ -z "$STRIPE_API_KEY" ]; then
        echo '{}'
        return
    fi

    # Get customer count
    local customers=$(curl -s https://api.stripe.com/v1/customers \
        -u "$STRIPE_API_KEY:" \
        -G -d limit=1 \
        2>/dev/null || echo '{"data":[]}')

    local customer_count=$(echo "$customers" | jq '.data | length')

    # Get subscription count (active only)
    local subscriptions=$(curl -s https://api.stripe.com/v1/subscriptions \
        -u "$STRIPE_API_KEY:" \
        -G -d limit=100 -d status=active \
        2>/dev/null || echo '{"data":[]}')

    local sub_count=$(echo "$subscriptions" | jq '.data | length')

    # Calculate MRR (Monthly Recurring Revenue)
    local mrr=0
    if [ "$sub_count" -gt 0 ]; then
        mrr=$(echo "$subscriptions" | jq '[.data[].items.data[].price.unit_amount] | add / 100')
    fi

    # Get recent payments (last 10)
    local payments=$(curl -s https://api.stripe.com/v1/charges \
        -u "$STRIPE_API_KEY:" \
        -G -d limit=10 \
        2>/dev/null || echo '{"data":[]}')

    local successful_payments=$(echo "$payments" | jq '[.data[] | select(.paid == true)] | length')
    local failed_payments=$(echo "$payments" | jq '[.data[] | select(.paid == false)] | length')

    echo "{
        \"customers\": $customer_count,
        \"active_subscriptions\": $sub_count,
        \"mrr\": $mrr,
        \"successful_payments\": $successful_payments,
        \"failed_payments\": $failed_payments
    }"
}

# Fetch webhook status
fetch_webhook_status() {
    if [ -z "$STRIPE_API_KEY" ]; then
        echo '{}'
        return
    fi

    # Get webhook endpoints
    local webhooks=$(curl -s https://api.stripe.com/v1/webhook_endpoints \
        -u "$STRIPE_API_KEY:" \
        2>/dev/null || echo '{"data":[]}')

    local webhook_count=$(echo "$webhooks" | jq '.data | length')
    local enabled_count=$(echo "$webhooks" | jq '[.data[] | select(.status == "enabled")] | length')

    echo "{
        \"total\": $webhook_count,
        \"enabled\": $enabled_count
    }"
}

# Display dashboard
display_dashboard() {
    clear

    local worker_status="$1"
    local stripe_metrics="$2"
    local webhook_status="$3"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    echo ""
    echo -e "${BOLD}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}║         NEXUS Alert — Production Monitoring Dashboard        ║${NC}"
    echo -e "${BOLD}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}Last updated:${NC} $timestamp"
    echo -e "${CYAN}Refresh interval:${NC} ${REFRESH_INTERVAL}s (Press Ctrl+C to exit)"
    echo ""

    # Worker Status
    echo -e "${BOLD}━━━ Cloudflare Worker Status ━━━${NC}"
    echo ""

    local status=$(echo "$worker_status" | jq -r '.status // "unknown"')
    local last_run=$(echo "$worker_status" | jq -r '.lastRun // "never"')
    local total_checks=$(echo "$worker_status" | jq -r '.totalChecks // 0')
    local total_notifs=$(echo "$worker_status" | jq -r '.totalNotifications // 0')
    local subscriber_count=$(echo "$worker_status" | jq -r '.subscriberCount // 0')

    if [ "$status" = "running" ]; then
        echo -e "  ${GREEN}●${NC} Status: ${GREEN}Running${NC}"
    else
        echo -e "  ${RED}●${NC} Status: ${RED}$status${NC}"
    fi

    echo -e "  ${CYAN}Last run:${NC} $last_run"
    echo -e "  ${CYAN}Total checks:${NC} $total_checks"
    echo -e "  ${CYAN}Total notifications:${NC} $total_notifs"
    echo -e "  ${CYAN}Subscribers:${NC} $subscriber_count"
    echo ""

    # Stripe Metrics
    echo -e "${BOLD}━━━ Stripe Metrics (Live Mode) ━━━${NC}"
    echo ""

    if [ -z "$STRIPE_API_KEY" ]; then
        echo -e "  ${YELLOW}⚠${NC} Stripe API key not configured"
        echo ""
    else
        local customers=$(echo "$stripe_metrics" | jq -r '.customers // 0')
        local subs=$(echo "$stripe_metrics" | jq -r '.active_subscriptions // 0')
        local mrr=$(echo "$stripe_metrics" | jq -r '.mrr // 0')
        local successful=$(echo "$stripe_metrics" | jq -r '.successful_payments // 0')
        local failed=$(echo "$stripe_metrics" | jq -r '.failed_payments // 0')

        echo -e "  ${CYAN}Customers:${NC} $customers"
        echo -e "  ${CYAN}Active subscriptions:${NC} $subs"
        echo -e "  ${CYAN}MRR:${NC} \$$mrr"
        echo ""

        echo -e "  ${BOLD}Recent Payments (last 10):${NC}"
        echo -e "    ${GREEN}✓${NC} Successful: $successful"

        if [ "$failed" -gt 0 ]; then
            echo -e "    ${RED}✗${NC} Failed: $failed"
        else
            echo -e "    ${GREEN}✗${NC} Failed: 0"
        fi
        echo ""
    fi

    # Webhook Status
    echo -e "${BOLD}━━━ Webhook Status ━━━${NC}"
    echo ""

    if [ -z "$STRIPE_API_KEY" ]; then
        echo -e "  ${YELLOW}⚠${NC} Stripe API key not configured"
        echo ""
    else
        local webhook_total=$(echo "$webhook_status" | jq -r '.total // 0')
        local webhook_enabled=$(echo "$webhook_status" | jq -r '.enabled // 0')

        if [ "$webhook_total" -gt 0 ]; then
            if [ "$webhook_enabled" -eq "$webhook_total" ]; then
                echo -e "  ${GREEN}●${NC} Webhooks: ${GREEN}$webhook_enabled/$webhook_total enabled${NC}"
            else
                echo -e "  ${YELLOW}●${NC} Webhooks: ${YELLOW}$webhook_enabled/$webhook_total enabled${NC}"
            fi
        else
            echo -e "  ${RED}●${NC} Webhooks: ${RED}No webhooks configured${NC}"
        fi
        echo ""
    fi

    # Health Indicators
    echo -e "${BOLD}━━━ Health Indicators ━━━${NC}"
    echo ""

    local health_issues=0

    # Check 1: Worker running
    if [ "$status" != "running" ]; then
        echo -e "  ${RED}✗${NC} Worker not running"
        ((health_issues++))
    fi

    # Check 2: Recent check
    if [ "$last_run" != "never" ]; then
        local last_run_unix=$(date -j -f "%Y-%m-%dT%H:%M:%S" "${last_run%.*}" "+%s" 2>/dev/null || echo 0)
        local now_unix=$(date "+%s")
        local elapsed=$((now_unix - last_run_unix))

        if [ $elapsed -gt 600 ]; then
            echo -e "  ${YELLOW}⚠${NC} Last check was over 10 minutes ago"
            ((health_issues++))
        fi
    fi

    # Check 3: Webhooks enabled
    if [ -n "$STRIPE_API_KEY" ]; then
        local webhook_enabled=$(echo "$webhook_status" | jq -r '.enabled // 0')
        if [ "$webhook_enabled" -eq 0 ]; then
            echo -e "  ${RED}✗${NC} No webhooks enabled"
            ((health_issues++))
        fi
    fi

    if [ $health_issues -eq 0 ]; then
        echo -e "  ${GREEN}✓${NC} All systems healthy"
    fi
    echo ""

    # Quick Actions
    echo -e "${BOLD}━━━ Quick Actions ━━━${NC}"
    echo ""
    echo "  View logs:          npx wrangler tail"
    echo "  Check webhooks:     open https://dashboard.stripe.com/webhooks"
    echo "  View customers:     stripe customers list --limit 10"
    echo "  Test checkout:      ./test-payment-flow.sh"
    echo ""
}

# Main monitoring loop
main() {
    check_dependencies

    echo "Starting monitoring dashboard..."
    sleep 1

    while true; do
        local worker_status=$(fetch_worker_status)
        local stripe_metrics=$(fetch_stripe_metrics)
        local webhook_status=$(fetch_webhook_status)

        display_dashboard "$worker_status" "$stripe_metrics" "$webhook_status"

        sleep "$REFRESH_INTERVAL"
    done
}

# Handle Ctrl+C gracefully
trap 'echo -e "\n${CYAN}Monitoring stopped.${NC}"; exit 0' INT

main "$@"
