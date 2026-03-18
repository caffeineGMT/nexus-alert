#!/bin/bash

# Helper script to open promotional image HTML files in Chrome
# for manual screenshot capture using DevTools

set -e

STORE_ASSETS_DIR="$(cd "$(dirname "$0")/../store-assets" && pwd)"

echo "🎨 NEXUS Alert - Chrome Web Store Image Generation Helper"
echo "========================================================="
echo ""
echo "This script will open each promotional image HTML file in Chrome."
echo "Use Chrome DevTools to capture screenshots at exact dimensions."
echo ""

# Function to open file and show instructions
open_for_capture() {
  local filename=$1
  local width=$2
  local height=$3
  local output=$4

  echo "📸 Opening: $filename"
  echo ""
  echo "INSTRUCTIONS:"
  echo "1. Press Cmd+Option+I to open DevTools"
  echo "2. Press Cmd+Shift+M to toggle device toolbar"
  echo "3. Set dimensions: $width x $height"
  echo "4. Set DPR (Device Pixel Ratio): 2"
  echo "5. Click ⋮ menu → 'Capture screenshot'"
  echo "6. Rename downloaded file to: $output"
  echo "7. Move to: $STORE_ASSETS_DIR/"
  echo ""

  # Open in Chrome
  open -a "Google Chrome" "$STORE_ASSETS_DIR/$filename"

  echo "Press ENTER when you've captured the screenshot..."
  read
}

# Check if Chrome is installed
if ! command -v "Google Chrome" &> /dev/null; then
  if ! open -Ra "Google Chrome" &> /dev/null; then
    echo "❌ Error: Google Chrome not found"
    echo "Please install Chrome: https://www.google.com/chrome/"
    exit 1
  fi
fi

# Generate marquee
echo ""
echo "=== 1/2: MARQUEE IMAGE (1400x560) ==="
echo ""
open_for_capture "marquee-1400x560.html" "1400" "560" "marquee-1400x560.png"

# Generate small tile
echo ""
echo "=== 2/2: SMALL TILE IMAGE (440x280) ==="
echo ""
open_for_capture "small-tile-440x280.html" "440" "280" "small-tile-440x280.png"

# Verify images exist
echo ""
echo "🔍 Verifying generated images..."
echo ""

MISSING=0

if [ -f "$STORE_ASSETS_DIR/marquee-1400x560.png" ]; then
  echo "✅ marquee-1400x560.png found"

  # Check dimensions if imagemagick is installed
  if command -v identify &> /dev/null; then
    DIMS=$(identify -format "%wx%h" "$STORE_ASSETS_DIR/marquee-1400x560.png")
    echo "   Dimensions: $DIMS"
    if [ "$DIMS" != "1400x560" ]; then
      echo "   ⚠️  Warning: Expected 1400x560, got $DIMS"
    fi
  fi
else
  echo "❌ marquee-1400x560.png NOT found"
  echo "   Expected location: $STORE_ASSETS_DIR/marquee-1400x560.png"
  MISSING=$((MISSING + 1))
fi

if [ -f "$STORE_ASSETS_DIR/small-tile-440x280.png" ]; then
  echo "✅ small-tile-440x280.png found"

  if command -v identify &> /dev/null; then
    DIMS=$(identify -format "%wx%h" "$STORE_ASSETS_DIR/small-tile-440x280.png")
    echo "   Dimensions: $DIMS"
    if [ "$DIMS" != "440x280" ]; then
      echo "   ⚠️  Warning: Expected 440x280, got $DIMS"
    fi
  fi
else
  echo "❌ small-tile-440x280.png NOT found"
  echo "   Expected location: $STORE_ASSETS_DIR/small-tile-440x280.png"
  MISSING=$((MISSING + 1))
fi

echo ""

if [ $MISSING -eq 0 ]; then
  echo "🎉 All promotional images generated successfully!"
  echo ""
  echo "Next steps:"
  echo "1. Generate 5 extension screenshots (see SCREENSHOT-INSTRUCTIONS.md)"
  echo "2. Complete submission checklist (see SUBMISSION-CHECKLIST.md)"
  echo "3. Submit to Chrome Web Store"
else
  echo "⚠️  $MISSING image(s) missing. Please ensure you:"
  echo "   1. Captured the screenshots in DevTools"
  echo "   2. Renamed them correctly"
  echo "   3. Moved them to: $STORE_ASSETS_DIR/"
  echo ""
  echo "You can re-run this script to try again."
  exit 1
fi

# Optimize images if imagemagick is available
if command -v convert &> /dev/null; then
  echo ""
  echo "🗜️  Optimizing images..."

  convert "$STORE_ASSETS_DIR/marquee-1400x560.png" -quality 85 "$STORE_ASSETS_DIR/marquee-1400x560.png"
  convert "$STORE_ASSETS_DIR/small-tile-440x280.png" -quality 85 "$STORE_ASSETS_DIR/small-tile-440x280.png"

  echo "✅ Images optimized (quality 85%)"
fi

echo ""
echo "📁 Images location: $STORE_ASSETS_DIR/"
echo ""
