#!/bin/bash

# ConvertKit Setup Script for NEXUS Alert
# This script helps you configure ConvertKit API credentials for email marketing automation

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  NEXUS Alert — ConvertKit Email Marketing Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This script will help you configure ConvertKit for automated"
echo "email sequences and lead nurturing."
echo ""
echo "Before running this script, make sure you have:"
echo "  1. Created a ConvertKit account at https://convertkit.com"
echo "  2. Created a form for your email list"
echo "  3. Created tags for segmentation (free, premium, pro, etc.)"
echo "  4. Got your API credentials from Settings → API"
echo ""
read -p "Ready to continue? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Setup cancelled."
    exit 0
fi

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Error: wrangler CLI not found."
    echo "Install it with: npm install -g wrangler"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Step 1: ConvertKit API Credentials"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Go to ConvertKit: Settings → Advanced → API"
echo ""
read -p "Enter your ConvertKit API Key: " CK_API_KEY
read -p "Enter your ConvertKit API Secret: " CK_API_SECRET

if [ -z "$CK_API_KEY" ] || [ -z "$CK_API_SECRET" ]; then
    echo "❌ Error: API Key and Secret are required."
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Step 2: Form ID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Go to ConvertKit: Grow → Landing Pages & Forms"
echo "Click on your form and copy the ID from the URL."
echo "Example: forms/1234567 → Form ID is 1234567"
echo ""
read -p "Enter your ConvertKit Form ID: " CK_FORM_ID

if [ -z "$CK_FORM_ID" ]; then
    echo "❌ Error: Form ID is required."
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Step 3: Tag IDs (Optional but Recommended)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Tags help segment users for targeted campaigns."
echo "Go to ConvertKit: Grow → Tags, click each tag to get its ID."
echo ""
echo "You can skip these (press Enter) and set them later."
echo ""
read -p "Tag ID for 'free' tier users (optional): " CK_TAG_FREE
read -p "Tag ID for 'premium' tier users (optional): " CK_TAG_PREMIUM
read -p "Tag ID for 'pro' tier users (optional): " CK_TAG_PRO
read -p "Tag ID for 'churned' users (optional): " CK_TAG_CHURNED
read -p "Tag ID for 'converted' users (optional): " CK_TAG_CONVERTED

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Step 4: Choose Environment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Which environment do you want to configure?"
echo "  1) Development (default)"
echo "  2) Production"
echo ""
read -p "Enter choice (1 or 2): " ENV_CHOICE

ENV_FLAG=""
if [ "$ENV_CHOICE" = "2" ]; then
    ENV_FLAG="--env production"
    echo "→ Configuring PRODUCTION environment"
else
    echo "→ Configuring DEVELOPMENT environment"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Step 5: Setting Secrets"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Set required secrets
echo "Setting CONVERTKIT_API_KEY..."
echo "$CK_API_KEY" | wrangler secret put CONVERTKIT_API_KEY $ENV_FLAG

echo "Setting CONVERTKIT_API_SECRET..."
echo "$CK_API_SECRET" | wrangler secret put CONVERTKIT_API_SECRET $ENV_FLAG

echo "Setting CONVERTKIT_FORM_ID..."
echo "$CK_FORM_ID" | wrangler secret put CONVERTKIT_FORM_ID $ENV_FLAG

# Set optional tag secrets
if [ ! -z "$CK_TAG_FREE" ]; then
    echo "Setting CONVERTKIT_TAG_FREE..."
    echo "$CK_TAG_FREE" | wrangler secret put CONVERTKIT_TAG_FREE $ENV_FLAG
fi

if [ ! -z "$CK_TAG_PREMIUM" ]; then
    echo "Setting CONVERTKIT_TAG_PREMIUM..."
    echo "$CK_TAG_PREMIUM" | wrangler secret put CONVERTKIT_TAG_PREMIUM $ENV_FLAG
fi

if [ ! -z "$CK_TAG_PRO" ]; then
    echo "Setting CONVERTKIT_TAG_PRO..."
    echo "$CK_TAG_PRO" | wrangler secret put CONVERTKIT_TAG_PRO $ENV_FLAG
fi

if [ ! -z "$CK_TAG_CHURNED" ]; then
    echo "Setting CONVERTKIT_TAG_CHURNED..."
    echo "$CK_TAG_CHURNED" | wrangler secret put CONVERTKIT_TAG_CHURNED $ENV_FLAG
fi

if [ ! -z "$CK_TAG_CONVERTED" ]; then
    echo "Setting CONVERTKIT_TAG_CONVERTED..."
    echo "$CK_TAG_CONVERTED" | wrangler secret put CONVERTKIT_TAG_CONVERTED $ENV_FLAG
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ ConvertKit Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "  1. Deploy your worker: npm run deploy"
echo "  2. Test email signup on your landing page"
echo "  3. Check ConvertKit dashboard for new subscribers"
echo "  4. Set up automation sequences in ConvertKit"
echo ""
echo "For detailed setup instructions, see:"
echo "  docs/EMAIL_MARKETING_SETUP.md"
echo ""
