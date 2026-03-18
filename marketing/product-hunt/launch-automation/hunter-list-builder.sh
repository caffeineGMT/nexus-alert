#!/bin/bash

# Product Hunt Hunter List Builder
# Build email list of 20 supporters to upvote at launch

PROJECT_ROOT="/Users/michaelguo/nexus-alert"
HUNTER_LIST="$PROJECT_ROOT/marketing/product-hunt/hunter-list.csv"

echo "🎯 Product Hunt Hunter List Builder"
echo "===================================="
echo ""
echo "Goal: 20 supporters to upvote at 12:01 AM PT launch"
echo ""

# Create CSV header if file doesn't exist
if [ ! -f "$HUNTER_LIST" ]; then
    echo "name,email,category,notes,contacted,confirmed" > "$HUNTER_LIST"
fi

# Hunter categories
echo "Target Categories:"
echo "1. Meta Coworkers (InfraX team, bootcamp cohort, prev teams)"
echo "2. Personal Friends (Harvard, UT Austin, LA startup)"
echo "3. Immigration Communities (FlyerTalk, Reddit power users)"
echo "4. NEXUS Users (from beta testing, email list)"
echo ""

# Interactive hunter addition
echo "Add Hunters Interactively"
echo "========================="
echo ""

add_more="y"
hunter_count=$(wc -l < "$HUNTER_LIST")
hunter_count=$((hunter_count - 1)) # Subtract header

while [ "$add_more" = "y" ] && [ $hunter_count -lt 20 ]; do
    echo "Hunter #$((hunter_count + 1))"
    echo "-------------"

    read -p "Name: " name
    read -p "Email: " email
    echo "Category:"
    echo "  1. Meta Coworker"
    echo "  2. Personal Friend"
    echo "  3. Immigration Community"
    echo "  4. NEXUS Beta User"
    read -p "Select (1-4): " category_num

    case $category_num in
        1) category="Meta Coworker" ;;
        2) category="Personal Friend" ;;
        3) category="Immigration Community" ;;
        4) category="NEXUS Beta User" ;;
        *) category="Other" ;;
    esac

    read -p "Notes (optional): " notes

    # Add to CSV
    echo "$name,$email,$category,$notes,false,false" >> "$HUNTER_LIST"

    hunter_count=$((hunter_count + 1))
    echo ""
    echo "✓ Added $name ($hunter_count/20)"
    echo ""

    if [ $hunter_count -lt 20 ]; then
        read -p "Add another? (y/n): " add_more
        echo ""
    else
        echo "✓ Target reached: 20 hunters!"
        add_more="n"
    fi
done

# Display current list
echo ""
echo "Current Hunter List ($hunter_count hunters):"
echo "========================================="
column -t -s',' "$HUNTER_LIST"

echo ""
echo "Suggested Hunters (Meta Coworkers):"
echo "==================================="
echo "1. Brian Hsu (Manager) - brianhsu@meta.com"
echo "2. Barbara Malta Gomes (InfraX) - barbaragomes@meta.com"
echo "3. Liya Guo (InfraX) - liyaguo@meta.com"
echo "4. Bob Toney (InfraX) - bobtoney@meta.com"
echo "5. Ernest Tien (InfraX) - ernesttien@meta.com"
echo "6. Bootcamp cohort members (Oct 2021)"
echo "7. Live Shopping team members"
echo "8. Reels Monetization team members"
echo ""

# Generate email template
echo "Email Template for Hunters:"
echo "==========================="
echo ""

cat > "$PROJECT_ROOT/marketing/product-hunt/hunter-email-template.txt" << 'EOF'
Subject: Quick favor - upvote my Product Hunt launch Tuesday?

Hey [Name],

I'm launching my side project NEXUS Alert on Product Hunt this Tuesday at 12:01 AM PT, and I'd love your support!

**What is it?**
Chrome extension that monitors NEXUS/Global Entry appointment slots 24/7 and sends instant alerts when cancellations appear. Saves weeks of manual checking.

**The ask:**
Could you upvote it on Product Hunt? Takes 30 seconds:
1. Go to: [PRODUCT_HUNT_LINK] at 12:01 AM PT Tuesday (or within first 8 hours)
2. Click the upvote button
3. Optional: Leave a comment if you like it

**Why Product Hunt?**
Top 5 ranking = 1000+ new users = validates product-market fit = potential revenue

**What's in it for you?**
- Free Premium access (normally $4.99/mo) for life
- Early access to new features
- My eternal gratitude 🙏

**When:** Tuesday, March 25, 12:01 AM PT
**Link:** [I'll send the Product Hunt link Tuesday morning]

Let me know if you can help!

Thanks,
Michael

P.S. If you know anyone who travels to the US frequently or needs NEXUS/Global Entry, feel free to share!
EOF

echo ""
cat "$PROJECT_ROOT/marketing/product-hunt/hunter-email-template.txt"
echo ""
echo "✓ Email template saved to: marketing/product-hunt/hunter-email-template.txt"
echo ""

# Generate reminder script
cat > "$PROJECT_ROOT/marketing/product-hunt/launch-automation/send-hunter-reminders.sh" << 'EOF'
#!/bin/bash

# Send launch reminders to hunters 24 hours before launch

PROJECT_ROOT="/Users/michaelguo/nexus-alert"
HUNTER_LIST="$PROJECT_ROOT/marketing/product-hunt/hunter-list.csv"
PRODUCT_HUNT_LINK="${PRODUCT_HUNT_LINK:-https://www.producthunt.com/posts/nexus-alert}"

echo "📧 Sending Hunter Reminders"
echo "==========================="
echo ""
echo "Product Hunt Link: $PRODUCT_HUNT_LINK"
echo ""

# Read hunter list (skip header)
tail -n +2 "$HUNTER_LIST" | while IFS=',' read -r name email category notes contacted confirmed; do
    if [ "$contacted" != "true" ]; then
        echo "Send reminder to: $name ($email)"
        echo "Category: $category"
        echo ""

        # Generate personalized email
        cat << EMAIL

To: $email
Subject: NEXUS Alert launching on Product Hunt tomorrow - quick upvote?

Hey $name,

Quick reminder - NEXUS Alert launches on Product Hunt TOMORROW (Tuesday) at 12:01 AM PT!

**The link:** $PRODUCT_HUNT_LINK

**Your help:**
Please upvote within the first 8 hours (ideally right at launch or Tuesday morning). Early upvotes = higher ranking = more visibility.

**Premium access code:** EARLYBIRD-$name

Thanks for supporting the launch! 🚀

Michael

EMAIL

        read -p "Mark as contacted? (y/n): " mark
        if [ "$mark" = "y" ]; then
            # Update CSV (contacted = true)
            sed -i.bak "s/^$name,$email,$category,$notes,false/$name,$email,$category,$notes,true/" "$HUNTER_LIST"
            echo "✓ Marked $name as contacted"
        fi
        echo ""
        echo "---"
        echo ""
    fi
done

echo "✓ All reminders sent!"
EOF

chmod +x "$PROJECT_ROOT/marketing/product-hunt/launch-automation/send-hunter-reminders.sh"

echo "✓ Reminder script created: launch-automation/send-hunter-reminders.sh"
echo ""

# Next steps
echo "Next Steps:"
echo "==========="
echo "1. Add 20 hunters to the list"
echo "2. Send initial email 7 days before launch"
echo "3. Send reminder email 24 hours before launch"
echo "4. Send Product Hunt link at 12:01 AM PT"
echo "5. Track upvotes and thank supporters"
echo ""
echo "Hunter list saved to: $HUNTER_LIST"
echo "Edit manually or run this script again to add more."
