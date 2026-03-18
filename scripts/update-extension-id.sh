#!/bin/bash

# update-extension-id.sh
# Propagates Chrome Extension ID throughout the codebase after Chrome Web Store approval
# Usage: ./scripts/update-extension-id.sh YOUR_EXTENSION_ID_HERE

set -e  # Exit on error

EXTENSION_ID="$1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "Chrome Extension ID Propagation Script"
echo "========================================"
echo ""

# Validate extension ID format
if [ -z "$EXTENSION_ID" ]; then
    echo -e "${RED}ERROR: Extension ID is required${NC}"
    echo ""
    echo "Usage: ./scripts/update-extension-id.sh YOUR_EXTENSION_ID"
    echo ""
    echo "Example:"
    echo "  ./scripts/update-extension-id.sh abcdefghijklmnopqrstuvwxyz123456"
    echo ""
    echo "Get your Extension ID from:"
    echo "  https://chrome.google.com/webstore/devconsole"
    exit 1
fi

# Validate format (32 alphanumeric characters)
if ! [[ "$EXTENSION_ID" =~ ^[a-z]{32}$ ]]; then
    echo -e "${YELLOW}WARNING: Extension ID format looks unusual${NC}"
    echo "Expected: 32 lowercase letters (a-z)"
    echo "Received: $EXTENSION_ID"
    echo ""
    read -p "Continue anyway? (y/N): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 1
    fi
fi

echo -e "${GREEN}Extension ID: $EXTENSION_ID${NC}"
echo ""

# Save extension ID for future reference
echo "EXTENSION_ID=$EXTENSION_ID" > .extension-id
echo -e "${GREEN}✓${NC} Saved to .extension-id"

# Count replacements
count=0

# Function to replace in file
replace_in_file() {
    local file="$1"
    if [ -f "$file" ]; then
        # Check if file contains the placeholder
        if grep -q "EXTENSION_ID" "$file"; then
            # macOS sed requires explicit backup extension, use '' for no backup
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s|detail/nexus-alert/EXTENSION_ID|detail/$EXTENSION_ID|g" "$file"
            else
                sed -i "s|detail/nexus-alert/EXTENSION_ID|detail/$EXTENSION_ID|g" "$file"
            fi
            count=$((count + 1))
            echo -e "${GREEN}✓${NC} Updated: $file"
        fi
    fi
}

echo ""
echo "Updating files..."
echo ""

# Update README.md
echo "--- README.md ---"
replace_in_file "README.md"

# Update all web app pages
echo ""
echo "--- Web App Pages ---"
find web/src/app -type f -name "*.tsx" | while read file; do
    replace_in_file "$file"
done

find web/src/app -type f -name "*.ts" | while read file; do
    replace_in_file "$file"
done

# Update components
echo ""
echo "--- Web Components ---"
if [ -d "web/src/app/components" ]; then
    find web/src/app/components -type f \( -name "*.tsx" -o -name "*.ts" \) | while read file; do
        replace_in_file "$file"
    done
fi

# Update any markdown documentation
echo ""
echo "--- Documentation ---"
find . -maxdepth 1 -type f -name "*.md" | while read file; do
    replace_in_file "$file"
done

echo ""
echo "========================================"
echo -e "${GREEN}Extension ID Propagation Complete!${NC}"
echo "========================================"
echo ""
echo "Summary:"
echo "  Extension ID: $EXTENSION_ID"
echo "  Files updated: $count"
echo ""

# Verify critical files were updated
echo "Verifying critical files..."
echo ""

ERRORS=0

check_file() {
    local file="$1"
    local description="$2"

    if [ ! -f "$file" ]; then
        echo -e "${RED}✗${NC} $description - FILE NOT FOUND: $file"
        ERRORS=$((ERRORS + 1))
        return
    fi

    if grep -q "EXTENSION_ID" "$file"; then
        echo -e "${RED}✗${NC} $description - Still contains placeholder"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✓${NC} $description"
    fi
}

check_file "README.md" "README install link"
check_file "web/src/app/page.tsx" "Main landing page"
check_file "web/src/app/ph/page.tsx" "Product Hunt landing page"
check_file "web/src/app/nexus/page.tsx" "NEXUS program page"
check_file "web/src/app/global-entry/page.tsx" "Global Entry program page"
check_file "web/src/app/sentri/page.tsx" "SENTRI program page"

echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}All critical files verified successfully!${NC}"
else
    echo -e "${RED}$ERRORS verification errors found${NC}"
    echo "Please review the files listed above."
    exit 1
fi

echo ""
echo "========================================"
echo "Next Steps:"
echo "========================================"
echo ""
echo "1. Review changes:"
echo "   git diff"
echo ""
echo "2. Test locally:"
echo "   cd web && npm run dev"
echo "   # Verify install links work"
echo ""
echo "3. Deploy to production:"
echo "   cd web && npm run build && vercel --prod"
echo ""
echo "4. Commit and push:"
echo "   git add -A"
echo "   git commit -m 'Update Chrome Extension ID after Web Store approval'"
echo "   git push origin main"
echo ""
echo "5. Verify live site:"
echo "   # Visit https://nexus-alert.com"
echo "   # Click install button → should redirect to Chrome Web Store"
echo ""
echo -e "${GREEN}Extension ID propagation complete!${NC}"
