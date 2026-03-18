#!/usr/bin/env bash
# NEXUS Alert — Health Check Monitoring Script
# Continuously monitors the /health endpoint and alerts on issues

set -euo pipefail

# Configuration
HEALTH_URL="${HEALTH_URL:-https://api.nexus-alert.com/health}"
CHECK_INTERVAL="${CHECK_INTERVAL:-60}" # seconds
ALERT_THRESHOLD="${ALERT_THRESHOLD:-3}" # consecutive failures before alert
SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# State tracking
consecutive_failures=0
last_alert_time=0
ALERT_COOLDOWN=300 # 5 minutes between alerts

# Log with timestamp
log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

# Send Slack alert
send_alert() {
    local severity=$1
    local message=$2

    if [ -z "$SLACK_WEBHOOK_URL" ]; then
        log "${RED}Alert: $message${NC} (Slack not configured)"
        return
    fi

    local current_time=$(date +%s)
    local time_since_last=$((current_time - last_alert_time))

    # Rate limit alerts
    if [ $time_since_last -lt $ALERT_COOLDOWN ]; then
        log "${YELLOW}Alert suppressed (cooldown)${NC}"
        return
    fi

    local icon
    case $severity in
        critical) icon="🚨" ;;
        warning) icon="⚠️" ;;
        info) icon="ℹ️" ;;
        *) icon="❌" ;;
    esac

    curl -X POST "$SLACK_WEBHOOK_URL" \
        -H 'Content-Type: application/json' \
        -d "{
            \"text\": \"$icon NEXUS Alert Health Monitor: $message\",
            \"blocks\": [
                {
                    \"type\": \"header\",
                    \"text\": {
                        \"type\": \"plain_text\",
                        \"text\": \"$icon Health Check Alert\"
                    }
                },
                {
                    \"type\": \"section\",
                    \"text\": {
                        \"type\": \"mrkdwn\",
                        \"text\": \"*Message:* $message\"
                    }
                },
                {
                    \"type\": \"context\",
                    \"elements\": [{
                        \"type\": \"mrkdwn\",
                        \"text\": \"*Time:* $(date -u '+%Y-%m-%d %H:%M:%S UTC')\"
                    }]
                }
            ]
        }" \
        --silent --output /dev/null

    last_alert_time=$current_time
    log "${GREEN}Alert sent to Slack${NC}"
}

# Check health endpoint
check_health() {
    local response
    local http_code
    local health_data

    response=$(curl -s -w "\n%{http_code}" "$HEALTH_URL" 2>&1 || echo -e "\n000")
    http_code=$(echo "$response" | tail -n1)
    health_data=$(echo "$response" | sed '$d')

    if [ "$http_code" -ne 200 ] && [ "$http_code" -ne 503 ]; then
        consecutive_failures=$((consecutive_failures + 1))
        log "${RED}✗ Health check failed (HTTP $http_code)${NC}"

        if [ $consecutive_failures -ge $ALERT_THRESHOLD ]; then
            send_alert "critical" "Health endpoint unreachable ($consecutive_failures consecutive failures, HTTP $http_code)"
        fi
        return 1
    fi

    # Parse health check response
    local status=$(echo "$health_data" | jq -r '.status // "unknown"' 2>/dev/null || echo "unknown")
    local alert_count=$(echo "$health_data" | jq '.alerts | length' 2>/dev/null || echo 0)

    if [ "$status" != "healthy" ]; then
        consecutive_failures=$((consecutive_failures + 1))
        log "${YELLOW}⚠ System status: $status ($alert_count alerts)${NC}"

        if [ "$status" == "unhealthy" ] && [ $consecutive_failures -ge $ALERT_THRESHOLD ]; then
            local alerts=$(echo "$health_data" | jq -r '.alerts[] | "\(.severity): \(.message)"' 2>/dev/null | head -3 | paste -sd '\n' -)
            send_alert "critical" "System unhealthy: $alerts"
        fi

        # Show detailed health check results
        if command -v jq &> /dev/null; then
            echo "$health_data" | jq -C '.' 2>/dev/null || echo "$health_data"
        fi
        return 1
    fi

    # Health check passed
    if [ $consecutive_failures -gt 0 ]; then
        log "${GREEN}✓ System recovered (was failing for $consecutive_failures checks)${NC}"
        if [ $consecutive_failures -ge $ALERT_THRESHOLD ]; then
            send_alert "info" "System recovered after $consecutive_failures failed checks"
        fi
    else
        log "${GREEN}✓ System healthy${NC}"
    fi

    consecutive_failures=0

    # Display key metrics
    if command -v jq &> /dev/null; then
        local subscribers=$(echo "$health_data" | jq -r '.metrics.subscribers // 0' 2>/dev/null)
        local total_checks=$(echo "$health_data" | jq -r '.metrics.total_checks // 0' 2>/dev/null)
        local total_notifs=$(echo "$health_data" | jq -r '.metrics.total_notifications // 0' 2>/dev/null)

        log "${CYAN}  Subscribers: $subscribers | Checks: $total_checks | Notifications: $total_notifs${NC}"
    fi

    return 0
}

# Main monitoring loop
main() {
    log "${BOLD}Starting NEXUS Alert health monitoring...${NC}"
    log "Health URL: $HEALTH_URL"
    log "Check interval: ${CHECK_INTERVAL}s"
    log "Alert threshold: $ALERT_THRESHOLD failures"

    if [ -z "$SLACK_WEBHOOK_URL" ]; then
        log "${YELLOW}Warning: SLACK_WEBHOOK_URL not set. Alerts will only be logged.${NC}"
    fi

    echo ""

    while true; do
        check_health || true
        sleep "$CHECK_INTERVAL"
    done
}

# Handle Ctrl+C gracefully
trap 'log "${CYAN}Health monitoring stopped.${NC}"; exit 0' INT TERM

main "$@"
