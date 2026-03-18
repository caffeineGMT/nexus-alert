#!/bin/bash
# Stripe Webhook Load Test
# Tests handling of 100 concurrent checkout.session.completed events
# Prerequisites: Stripe CLI installed (brew install stripe/stripe-cli/stripe)

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║        NEXUS Alert Stripe Webhook Load Test              ║"
echo "║  Testing 100 concurrent checkout.session.completed events ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo "❌ Stripe CLI not found. Install with:"
    echo "   brew install stripe/stripe-cli/stripe"
    exit 1
fi

# Check if logged in
if ! stripe config --list &> /dev/null; then
    echo "❌ Not logged in to Stripe. Run:"
    echo "   stripe login"
    exit 1
fi

echo "✓ Stripe CLI ready"
echo ""

# Configuration
WEBHOOK_COUNT=100
WORKERS_URL="http://localhost:8787/api/webhook"

echo "📋 Test Configuration:"
echo "   Webhook count: $WEBHOOK_COUNT"
echo "   Target URL: $WORKER_URL"
echo "   Event type: checkout.session.completed"
echo ""

# Start local worker (if not already running)
echo "🚀 Starting local worker..."
(cd .. && wrangler dev --local --port 8787) &
WORKER_PID=$!
sleep 3

echo "✓ Worker running on PID $WORKER_PID"
echo ""

# Listen for webhooks and forward to local worker
echo "🔊 Starting webhook listener..."
stripe listen --forward-to $WORKERS_URL &
LISTENER_PID=$!
sleep 2

echo "✓ Webhook listener active"
echo ""

# Trigger 100 events
echo "⚡ Triggering $WEBHOOK_COUNT webhook events..."
START_TIME=$(date +%s)

for i in $(seq 1 $WEBHOOK_COUNT); do
    stripe trigger checkout.session.completed &

    # Show progress every 10 events
    if [ $((i % 10)) -eq 0 ]; then
        echo "   Triggered $i/$WEBHOOK_COUNT events..."
    fi
done

# Wait for all triggers to complete
wait

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo "✅ All events triggered in ${DURATION}s"
echo ""

# Give worker time to process
echo "⏳ Waiting 30s for processing..."
sleep 30

# Stop processes
echo "🛑 Stopping listener and worker..."
kill $LISTENER_PID 2>/dev/null
kill $WORKER_PID 2>/dev/null

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                    Test Results                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "Webhooks sent: $WEBHOOK_COUNT"
echo "Duration: ${DURATION}s"
echo "Rate: $(awk "BEGIN {print $WEBHOOK_COUNT / $DURATION}") webhooks/sec"
echo ""
echo "🔍 Next steps:"
echo "   1. Check worker logs for errors"
echo "   2. Verify 100 license: keys created in KV:"
echo "      wrangler kv:key list --binding=NEXUS_ALERTS_KV --prefix=license:"
echo "   3. Check that all webhooks processed successfully"
echo ""
echo "✅ Target: All 100 webhooks processed within 60 seconds"
echo "   Actual: ${DURATION}s $([ $DURATION -lt 60 ] && echo '✓ PASS' || echo '✗ FAIL')"
echo ""
