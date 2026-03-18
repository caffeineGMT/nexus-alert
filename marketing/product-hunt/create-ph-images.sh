#!/bin/bash

# Create Product Hunt Gallery Images and Thumbnail
# Uses ImageMagick or sips (macOS built-in)

PROJECT_ROOT="/Users/michaelguo/nexus-alert"
ASSETS_DIR="$PROJECT_ROOT/store-assets"

echo "🖼️  Product Hunt Image Generator"
echo "================================"
echo ""

# Check if ImageMagick is available
if command -v magick &> /dev/null || command -v convert &> /dev/null; then
    HAS_IMAGEMAGICK=true
    echo "✓ ImageMagick detected"
else
    HAS_IMAGEMAGICK=false
    echo "⚠️  ImageMagick not found, using macOS sips (basic resize only)"
fi

echo ""

# Product Hunt image specifications
PH_GALLERY_WIDTH=1270
PH_GALLERY_HEIGHT=760
PH_THUMBNAIL_SIZE=240

echo "Creating Product Hunt images..."
echo ""

# Gallery Image 1: Main monitoring interface
echo "1. Creating ph-gallery-01.png (Main Interface)..."
if [ "$HAS_IMAGEMAGICK" = true ]; then
    magick "$ASSETS_DIR/1-monitor-locations.png" \
        -resize "${PH_GALLERY_WIDTH}x${PH_GALLERY_HEIGHT}^" \
        -gravity center \
        -extent "${PH_GALLERY_WIDTH}x${PH_GALLERY_HEIGHT}" \
        "$ASSETS_DIR/ph-gallery-01.png"
else
    # Use sips for basic resize (macOS built-in)
    sips -z $PH_GALLERY_HEIGHT $PH_GALLERY_WIDTH \
        "$ASSETS_DIR/1-monitor-locations.png" \
        --out "$ASSETS_DIR/ph-gallery-01.png" &>/dev/null
fi
echo "   ✓ ph-gallery-01.png created"

# Gallery Image 2: Notification alert
echo "2. Creating ph-gallery-02.png (Notification)..."
if [ "$HAS_IMAGEMAGICK" = true ]; then
    magick "$ASSETS_DIR/2-slots-found.png" \
        -resize "${PH_GALLERY_WIDTH}x${PH_GALLERY_HEIGHT}^" \
        -gravity center \
        -extent "${PH_GALLERY_WIDTH}x${PH_GALLERY_HEIGHT}" \
        "$ASSETS_DIR/ph-gallery-02.png"
else
    sips -z $PH_GALLERY_HEIGHT $PH_GALLERY_WIDTH \
        "$ASSETS_DIR/2-slots-found.png" \
        --out "$ASSETS_DIR/ph-gallery-02.png" &>/dev/null
fi
echo "   ✓ ph-gallery-02.png created"

# Gallery Image 3: Premium settings
echo "3. Creating ph-gallery-03.png (Premium Features)..."
if [ "$HAS_IMAGEMAGICK" = true ]; then
    magick "$ASSETS_DIR/3-settings-premium.png" \
        -resize "${PH_GALLERY_WIDTH}x${PH_GALLERY_HEIGHT}^" \
        -gravity center \
        -extent "${PH_GALLERY_WIDTH}x${PH_GALLERY_HEIGHT}" \
        "$ASSETS_DIR/ph-gallery-03.png"
else
    sips -z $PH_GALLERY_HEIGHT $PH_GALLERY_WIDTH \
        "$ASSETS_DIR/3-settings-premium.png" \
        --out "$ASSETS_DIR/ph-gallery-03.png" &>/dev/null
fi
echo "   ✓ ph-gallery-03.png created"

# Thumbnail: Square crop of logo or main interface
echo "4. Creating ph-thumbnail.png (240x240)..."
if [ -f "$ASSETS_DIR/icon-512.png" ]; then
    # Use icon if available
    if [ "$HAS_IMAGEMAGICK" = true ]; then
        magick "$ASSETS_DIR/icon-512.png" \
            -resize "${PH_THUMBNAIL_SIZE}x${PH_THUMBNAIL_SIZE}" \
            "$ASSETS_DIR/ph-thumbnail.png"
    else
        sips -z $PH_THUMBNAIL_SIZE $PH_THUMBNAIL_SIZE \
            "$ASSETS_DIR/icon-512.png" \
            --out "$ASSETS_DIR/ph-thumbnail.png" &>/dev/null
    fi
else
    # Use cropped version of first screenshot
    if [ "$HAS_IMAGEMAGICK" = true ]; then
        magick "$ASSETS_DIR/1-monitor-locations.png" \
            -resize "${PH_THUMBNAIL_SIZE}x${PH_THUMBNAIL_SIZE}^" \
            -gravity center \
            -extent "${PH_THUMBNAIL_SIZE}x${PH_THUMBNAIL_SIZE}" \
            "$ASSETS_DIR/ph-thumbnail.png"
    else
        sips -z $PH_THUMBNAIL_SIZE $PH_THUMBNAIL_SIZE \
            "$ASSETS_DIR/1-monitor-locations.png" \
            --out "$ASSETS_DIR/ph-thumbnail.png" &>/dev/null
    fi
fi
echo "   ✓ ph-thumbnail.png created"

echo ""
echo "✓ All Product Hunt images created!"
echo ""

# Verify file sizes
echo "Verifying images..."
echo ""

for img in ph-gallery-01.png ph-gallery-02.png ph-gallery-03.png ph-thumbnail.png; do
    if [ -f "$ASSETS_DIR/$img" ]; then
        size=$(ls -lh "$ASSETS_DIR/$img" | awk '{print $5}')
        dims=$(sips -g pixelWidth -g pixelHeight "$ASSETS_DIR/$img" 2>/dev/null | grep -E "pixelWidth|pixelHeight" | awk '{print $2}' | paste -sd 'x' -)
        echo "✓ $img - $dims - $size"
    else
        echo "✗ $img - MISSING"
    fi
done

echo ""
echo "Images saved to: $ASSETS_DIR/"
echo ""

# Create a simple HTML preview
cat > "$ASSETS_DIR/ph-preview.html" << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Product Hunt Images Preview</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            max-width: 1400px;
            margin: 0 auto;
            padding: 40px 20px;
            background: #f5f5f5;
        }
        h1 {
            color: #333;
            margin-bottom: 40px;
        }
        .section {
            background: white;
            padding: 30px;
            margin-bottom: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .section h2 {
            margin-top: 0;
            color: #2563EB;
        }
        .gallery {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
        }
        .gallery img {
            width: 100%;
            height: auto;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .thumbnail {
            text-align: center;
        }
        .thumbnail img {
            width: 240px;
            height: 240px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .specs {
            background: #f9fafb;
            padding: 15px;
            border-radius: 4px;
            margin-top: 10px;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <h1>🚀 Product Hunt Images Preview</h1>

    <div class="section">
        <h2>Gallery Images (1270 × 760)</h2>
        <div class="gallery">
            <div>
                <h3>Gallery 1: Main Interface</h3>
                <img src="ph-gallery-01.png" alt="Gallery 1">
                <div class="specs">Main monitoring interface showing enrollment center selection</div>
            </div>
            <div>
                <h3>Gallery 2: Notification Alert</h3>
                <img src="ph-gallery-02.png" alt="Gallery 2">
                <div class="specs">Appointment slots found notification</div>
            </div>
            <div>
                <h3>Gallery 3: Premium Features</h3>
                <img src="ph-gallery-03.png" alt="Gallery 3">
                <div class="specs">Premium settings and features overview</div>
            </div>
        </div>
    </div>

    <div class="section thumbnail">
        <h2>Thumbnail (240 × 240)</h2>
        <img src="ph-thumbnail.png" alt="Thumbnail">
        <div class="specs">Square thumbnail for Product Hunt listing</div>
    </div>

    <div class="section">
        <h2>Product Hunt Specs</h2>
        <ul>
            <li><strong>Gallery Images:</strong> 1270 × 760 pixels (exactly)</li>
            <li><strong>Thumbnail:</strong> 240 × 240 pixels (exactly)</li>
            <li><strong>File Format:</strong> PNG or JPG</li>
            <li><strong>Max File Size:</strong> 5MB per image</li>
            <li><strong>Gallery Limit:</strong> Up to 5 images (we're using 3)</li>
        </ul>
    </div>

    <div class="section">
        <h2>Next Steps</h2>
        <ol>
            <li>Review images above</li>
            <li>If satisfied, these are ready for Product Hunt submission</li>
            <li>If changes needed, edit source screenshots and re-run create-ph-images.sh</li>
            <li>Upload to Product Hunt at submission time</li>
        </ol>
    </div>
</body>
</html>
EOF

echo "✓ Preview HTML created: $ASSETS_DIR/ph-preview.html"
echo ""
echo "Open preview in browser:"
echo "  open $ASSETS_DIR/ph-preview.html"
echo ""

# Optional: Open preview automatically
read -p "Open preview in browser now? (y/n): " open_preview
if [ "$open_preview" = "y" ]; then
    open "$ASSETS_DIR/ph-preview.html"
fi

echo ""
echo "Installation tips:"
echo "  To install ImageMagick for better image processing:"
echo "  → brew install imagemagick"
echo ""
