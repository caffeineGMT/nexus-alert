#!/bin/bash

# Package NEXUS Alert extension for Chrome Web Store submission
# Creates a clean zip file with only necessary extension files

set -e

# Change to project root
cd "$(dirname "$0")/.."

VERSION="2.0.0"
OUTPUT_DIR="dist"
ZIP_NAME="nexus-alert-v${VERSION}.zip"

echo "📦 Packaging NEXUS Alert Extension v${VERSION}"
echo ""

# Create dist directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Remove old zip if exists
rm -f "$OUTPUT_DIR/$ZIP_NAME"

# Create zip with only extension files (exclude web/, backend/, docs/, etc.)
echo "Creating extension package..."
zip -r "$OUTPUT_DIR/$ZIP_NAME" \
  manifest.json \
  background.js \
  popup.html \
  popup.js \
  onboarding.html \
  onboarding.js \
  offscreen.html \
  offscreen.js \
  icons/ \
  -x "*.DS_Store" "*.git*" "*node_modules/*" "*/.*"

echo ""
echo "✓ Package created: $OUTPUT_DIR/$ZIP_NAME"
echo ""

# Verify contents
echo "Package contents:"
unzip -l "$OUTPUT_DIR/$ZIP_NAME"
echo ""

# Get file size
SIZE=$(du -h "$OUTPUT_DIR/$ZIP_NAME" | cut -f1)
echo "Package size: $SIZE"
echo ""

# Verify manifest version matches
MANIFEST_VERSION=$(grep '"version"' manifest.json | head -1 | sed 's/.*"version": "\(.*\)".*/\1/')
echo "Manifest version: $MANIFEST_VERSION"

if [ "$MANIFEST_VERSION" != "$VERSION" ]; then
  echo "⚠️  Warning: VERSION mismatch! Script: $VERSION, Manifest: $MANIFEST_VERSION"
else
  echo "✓ Version check passed"
fi

echo ""
echo "✓ Extension package ready for Chrome Web Store submission!"
echo ""
echo "Next steps:"
echo "1. Go to https://chrome.google.com/webstore/devconsole"
echo "2. Upload: $OUTPUT_DIR/$ZIP_NAME"
echo "3. Fill in store listing using: store-assets/CHROME-WEB-STORE-LISTING.txt"
echo "4. Upload promotional images and screenshots from: store-assets/"
echo ""
