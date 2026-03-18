#!/bin/bash
set -e

echo "🚀 Deploying NEXUS Alert SEO Blog Posts..."

# Navigate to web directory
cd web/src/app/blog

# Count completed posts
COMPLETED=$(find . -name "page.tsx" -path "*/*/page.tsx" | wc -l | tr -d ' ')
echo "✅ $COMPLETED blog posts with content"

# Build the project
cd ../../..
echo "📦 Building Next.js application..."
npm run build

echo "✅ Build successful!"
echo "📊 Blog post count: $COMPLETED"
echo "🎯 Ready for deployment to Vercel"

