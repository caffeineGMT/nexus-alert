#!/bin/bash

# NEXUS Alert - BetterUptime Monitor Setup Script
# Automates creation of uptime monitors via BetterUptime API
# Requires: BETTERUPTIME_API_KEY environment variable

set -e

API_KEY="${BETTERUPTIME_API_KEY:-}"
if [ -z "$API_KEY" ]; then
  echo "❌ Error: BETTERUPTIME_API_KEY environment variable not set"
  echo "Get your API key from: https://betteruptime.com/team/api-tokens"
  exit 1
fi

BASE_URL="https://betteruptime.com/api/v2"
HEADERS="Authorization: Bearer $API_KEY"

echo "🚀 Creating BetterUptime monitors for NEXUS Alert..."

# Monitor 1: Cloudflare Worker Health Check
echo "📊 Creating Worker Health Check monitor..."
curl -X POST "$BASE_URL/monitors" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "monitor_type": "status",
    "url": "https://api.nexus-alert.com/health",
    "check_frequency": 60,
    "request_timeout": 10,
    "recovery_period": 0,
    "expected_status_codes": [200],
    "call": true,
    "sms": false,
    "email": true,
    "push": true,
    "team_wait": 0,
    "paused": false,
    "port": null,
    "regions": ["us", "eu", "as"],
    "policy_id": null,
    "http_method": "GET",
    "request_body": "",
    "request_headers": [],
    "pronounceable_name": "Worker Health Check",
    "monitor_group_id": null
  }'

echo ""

# Monitor 2: Landing Page Availability
echo "🌐 Creating Landing Page monitor..."
curl -X POST "$BASE_URL/monitors" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "monitor_type": "keyword",
    "url": "https://nexus-alert.com",
    "check_frequency": 120,
    "request_timeout": 15,
    "recovery_period": 0,
    "expected_status_codes": [200],
    "required_keyword": "NEXUS Alert",
    "call": true,
    "sms": false,
    "email": true,
    "push": true,
    "pronounceable_name": "Landing Page",
    "regions": ["us", "eu"]
  }'

echo ""

# Monitor 3: Stripe Webhook Endpoint
echo "💳 Creating Stripe Webhook monitor..."
curl -X POST "$BASE_URL/monitors" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "monitor_type": "status",
    "url": "https://api.nexus-alert.com/api/webhook",
    "check_frequency": 300,
    "request_timeout": 10,
    "recovery_period": 0,
    "expected_status_codes": [400, 401],
    "http_method": "POST",
    "request_headers": [
      {"name": "Content-Type", "value": "application/json"}
    ],
    "call": true,
    "email": true,
    "pronounceable_name": "Stripe Webhook Endpoint"
  }'

echo ""

# Monitor 4: Chrome Web Store Listing
echo "🧩 Creating Chrome Web Store monitor..."
EXTENSION_ID="YOUR_EXTENSION_ID_HERE"
curl -X POST "$BASE_URL/monitors" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"monitor_type\": \"status\",
    \"url\": \"https://chromewebstore.google.com/detail/nexus-alert/$EXTENSION_ID\",
    \"check_frequency\": 3600,
    \"request_timeout\": 15,
    \"recovery_period\": 0,
    \"expected_status_codes\": [200],
    \"call\": true,
    \"email\": true,
    \"pronounceable_name\": \"Chrome Web Store Listing\"
  }"

echo ""
echo "✅ Monitor setup complete!"
echo ""
echo "Next steps:"
echo "1. Visit https://betteruptime.com/monitors to verify monitors"
echo "2. Create status page at https://betteruptime.com/status-pages"
echo "3. Configure Slack integration: https://betteruptime.com/integrations"
echo "4. Set on-call schedule: https://betteruptime.com/on-call"
