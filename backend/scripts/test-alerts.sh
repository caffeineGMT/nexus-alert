#!/usr/bin/env bash
# NEXUS Alert — Test Slack Alerts
# Sends test alerts to verify Slack integration

set -euo pipefail

SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"

if [ -z "$SLACK_WEBHOOK_URL" ]; then
    echo "Error: SLACK_WEBHOOK_URL not set"
    echo "Usage: SLACK_WEBHOOK_URL=https://hooks.slack.com/... $0"
    exit 1
fi

echo "Testing NEXUS Alert Slack integration..."
echo "Webhook: ${SLACK_WEBHOOK_URL:0:30}..."
echo ""

# Test 1: Simple text alert
echo "1. Sending simple text alert..."
curl -X POST "$SLACK_WEBHOOK_URL" \
    -H 'Content-Type: application/json' \
    -d '{
        "text": "🧪 Test Alert: Simple text format"
    }' \
    --silent --output /dev/null
echo "   ✓ Sent"

sleep 2

# Test 2: Info alert with blocks
echo "2. Sending INFO alert with rich formatting..."
curl -X POST "$SLACK_WEBHOOK_URL" \
    -H 'Content-Type: application/json' \
    -d '{
        "text": "ℹ️ NEXUS Alert - INFO",
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "ℹ️ NEXUS Alert - INFO"
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*Message:* Test info alert with metadata"
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*Environment:* test\n*Status:* healthy\n*Requests:* 1,234"
                }
            },
            {
                "type": "context",
                "elements": [{
                    "type": "mrkdwn",
                    "text": "*Time:* '"$(date -u '+%Y-%m-%d %H:%M:%S UTC')"'"
                }]
            }
        ],
        "attachments": [{
            "color": "#3B82F6",
            "footer": "NEXUS Alert Monitoring",
            "ts": '"$(date +%s)"'
        }]
    }' \
    --silent --output /dev/null
echo "   ✓ Sent"

sleep 2

# Test 3: Warning alert
echo "3. Sending WARNING alert..."
curl -X POST "$SLACK_WEBHOOK_URL" \
    -H 'Content-Type: application/json' \
    -d '{
        "text": "⚠️ NEXUS Alert - WARNING",
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "⚠️ NEXUS Alert - WARNING"
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*Message:* High error rate detected"
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*Error Count:* 15\n*Error Rate:* 3.2%\n*Threshold:* 1%"
                }
            },
            {
                "type": "context",
                "elements": [{
                    "type": "mrkdwn",
                    "text": "*Time:* '"$(date -u '+%Y-%m-%d %H:%M:%S UTC')"'"
                }]
            }
        ],
        "attachments": [{
            "color": "#FFA500",
            "footer": "NEXUS Alert Monitoring",
            "ts": '"$(date +%s)"'
        }]
    }' \
    --silent --output /dev/null
echo "   ✓ Sent"

sleep 2

# Test 4: Critical alert with action buttons
echo "4. Sending CRITICAL alert with action buttons..."
curl -X POST "$SLACK_WEBHOOK_URL" \
    -H 'Content-Type: application/json' \
    -d '{
        "text": "🚨 NEXUS Alert - CRITICAL",
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "🚨 NEXUS Alert - CRITICAL"
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*Message:* Cron has not run for 15 minutes"
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*Last Run:* 15 minutes ago\n*Expected Interval:* 2 minutes\n*Status:* UNHEALTHY"
                }
            },
            {
                "type": "context",
                "elements": [{
                    "type": "mrkdwn",
                    "text": "*Time:* '"$(date -u '+%Y-%m-%d %H:%M:%S UTC')"'"
                }]
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "View Dashboard"
                        },
                        "url": "https://dash.cloudflare.com",
                        "style": "danger"
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "View Logs"
                        },
                        "url": "https://dash.cloudflare.com"
                    }
                ]
            }
        ],
        "attachments": [{
            "color": "#FF0000",
            "footer": "NEXUS Alert Monitoring",
            "ts": '"$(date +%s)"'
        }]
    }' \
    --silent --output /dev/null
echo "   ✓ Sent"

sleep 2

# Test 5: Recovery notification
echo "5. Sending recovery notification..."
curl -X POST "$SLACK_WEBHOOK_URL" \
    -H 'Content-Type: application/json' \
    -d '{
        "text": "✅ NEXUS Alert - RECOVERED",
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "✅ System Recovered"
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*Message:* System health restored"
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*Downtime:* 8 minutes\n*Status:* HEALTHY\n*All checks:* PASSING"
                }
            },
            {
                "type": "context",
                "elements": [{
                    "type": "mrkdwn",
                    "text": "*Time:* '"$(date -u '+%Y-%m-%d %H:%M:%S UTC')"'"
                }]
            }
        ],
        "attachments": [{
            "color": "#22C55E",
            "footer": "NEXUS Alert Monitoring",
            "ts": '"$(date +%s)"'
        }]
    }' \
    --silent --output /dev/null
echo "   ✓ Sent"

echo ""
echo "✅ All test alerts sent successfully!"
echo "Check your Slack channel for 5 messages."
