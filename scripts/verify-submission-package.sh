#!/bin/bash

# Verify Chrome Web Store submission package is complete
# Checks all required files and validates dimensions

# Change to project root
cd "$(dirname "$0")/.."

echo "🔍 Verifying Chrome Web Store Submission Package"
echo "=================================================="
echo ""

ERRORS=0
WARNINGS=0

# Check extension package
echo "📦 Extension Package"
echo "-------------------"
if [ -f "dist/nexus-alert-v2.0.0.zip" ]; then
  SIZE=$(du -h dist/nexus-alert-v2.0.0.zip | cut -f1)
  echo "✓ Extension package exists: $SIZE"

  # Check file count
  FILE_COUNT=$(unzip -l dist/nexus-alert-v2.0.0.zip | grep -c "adding:" || echo "0")
  if [ "$FILE_COUNT" -gt "0" ]; then
    echo "✓ Package contains files"
  fi
else
  echo "✗ Extension package missing: dist/nexus-alert-v2.0.0.zip"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# Check promotional images
echo "🖼️  Promotional Images"
echo "---------------------"

if [ -f "store-assets/marquee-1400x560.png" ]; then
  DIMS=$(file store-assets/marquee-1400x560.png | grep -o "[0-9]* x [0-9]*")
  if [ "$DIMS" = "1400 x 560" ]; then
    echo "✓ Marquee: $DIMS (correct)"
  else
    echo "✗ Marquee: $DIMS (expected 1400 x 560)"
    ERRORS=$((ERRORS + 1))
  fi
else
  echo "✗ Marquee missing: store-assets/marquee-1400x560.png"
  ERRORS=$((ERRORS + 1))
fi

if [ -f "store-assets/small-tile-440x280.png" ]; then
  DIMS=$(file store-assets/small-tile-440x280.png | grep -o "[0-9]* x [0-9]*")
  if [ "$DIMS" = "440 x 280" ]; then
    echo "✓ Small tile: $DIMS (correct)"
  else
    echo "✗ Small tile: $DIMS (expected 440 x 280)"
    ERRORS=$((ERRORS + 1))
  fi
else
  echo "✗ Small tile missing: store-assets/small-tile-440x280.png"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# Check screenshots
echo "📸 Screenshots"
echo "--------------"

SCREENSHOTS=(
  "1-monitor-locations.png"
  "2-slots-found.png"
  "3-settings-premium.png"
  "4-onboarding-step2.png"
  "5-notification.png"
)

for screenshot in "${SCREENSHOTS[@]}"; do
  if [ -f "store-assets/$screenshot" ]; then
    DIMS=$(file "store-assets/$screenshot" | grep -o "[0-9]* x [0-9]*")
    if [ "$DIMS" = "1280 x 800" ]; then
      echo "✓ $screenshot: $DIMS (correct)"
    else
      echo "⚠ $screenshot: $DIMS (expected 1280 x 800)"
      WARNINGS=$((WARNINGS + 1))
    fi
  else
    echo "✗ Screenshot missing: store-assets/$screenshot"
    ERRORS=$((ERRORS + 1))
  fi
done
echo ""

# Check documentation
echo "📄 Documentation"
echo "----------------"

if [ -f "store-assets/CHROME-WEB-STORE-LISTING.txt" ]; then
  echo "✓ Store listing text exists"
else
  echo "✗ Store listing text missing"
  ERRORS=$((ERRORS + 1))
fi

if [ -f "CHROME_WEB_STORE_SUBMISSION_GUIDE.md" ]; then
  echo "✓ Submission guide exists"
else
  echo "✗ Submission guide missing"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# Check online resources
echo "🌐 Online Resources"
echo "-------------------"

# Check privacy policy
PRIVACY_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://nexus-alert.com/privacy)
if [ "$PRIVACY_STATUS" = "200" ]; then
  echo "✓ Privacy policy accessible: https://nexus-alert.com/privacy"
else
  echo "⚠ Privacy policy status: HTTP $PRIVACY_STATUS"
  WARNINGS=$((WARNINGS + 1))
fi

# Check landing page
LANDING_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://nexus-alert.com)
if [ "$LANDING_STATUS" = "200" ]; then
  echo "✓ Landing page accessible: https://nexus-alert.com"
else
  echo "⚠ Landing page status: HTTP $LANDING_STATUS"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Summary
echo "=================================================="
echo "📊 Summary"
echo "=================================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo "✅ ALL CHECKS PASSED"
  echo ""
  echo "Your submission package is complete and ready!"
  echo "Next step: Submit to Chrome Web Store"
  echo ""
  echo "Go to: https://chrome.google.com/webstore/devconsole"
  echo "Guide: CHROME_WEB_STORE_SUBMISSION_GUIDE.md"
  echo ""
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo "⚠️  PASSED WITH WARNINGS: $WARNINGS warning(s)"
  echo ""
  echo "Non-critical issues detected. Review warnings above."
  echo "You can still submit, but verify online resources first."
  echo ""
  exit 0
else
  echo "❌ FAILED: $ERRORS error(s), $WARNINGS warning(s)"
  echo ""
  echo "Critical issues detected. Fix errors before submitting."
  echo ""
  exit 1
fi
