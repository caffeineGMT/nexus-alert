#!/bin/bash

# Hacker News Show HN Submission Script
# Usage: ./submission-script.sh
# Prerequisites: You must have an HN account with some karma

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Hacker News Show HN Submission${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Configuration
TITLE="Show HN: I built a tool to find NEXUS appointments 10x faster"
URL="https://nexus-alert.com/blog/how-to-get-nexus-appointment-fast"
SUBMISSION_URL="https://news.ycombinator.com/submit"

# Check if it's Saturday 9am PT
CURRENT_DAY=$(date +%A)
CURRENT_HOUR=$(TZ="America/Los_Angeles" date +%H)

echo -e "${YELLOW}Pre-flight Checklist:${NC}"
echo
echo "✓ Current day: $CURRENT_DAY"
echo "✓ Current time (PT): $(TZ='America/Los_Angeles' date +'%I:%M %p')"
echo

if [ "$CURRENT_DAY" != "Saturday" ] || [ "$CURRENT_HOUR" -ne 9 ]; then
    echo -e "${YELLOW}⚠️  WARNING: Optimal submission time is Saturday 9:00 AM PT${NC}"
    echo -e "${YELLOW}   Current time is $CURRENT_DAY $(TZ='America/Los_Angeles' date +'%I:%M %p')${NC}"
    echo
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Submission cancelled. Run this script on Saturday at 9am PT."
        exit 1
    fi
fi

echo -e "${GREEN}Pre-Submission Checklist:${NC}"
echo
echo "□ Blog post is live and loads fast"
echo "□ Chrome extension is published and working"
echo "□ You're logged into HN with an account that has karma"
echo "□ You have the first comment ready to post"
echo "□ You're prepared to monitor for 2-4 hours"
echo "□ Google Analytics is tracking properly"
echo
read -p "All items checked? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please complete checklist before submitting."
    exit 1
fi

echo
echo -e "${BLUE}Submission Details:${NC}"
echo "Title: $TITLE"
echo "URL: $URL"
echo
echo -e "${YELLOW}IMPORTANT: Manual steps required${NC}"
echo
echo "1. Open this URL in your browser:"
echo "   $SUBMISSION_URL"
echo
echo "2. Fill in the form:"
echo "   - title: $TITLE"
echo "   - url: $URL"
echo
echo "3. Submit the post"
echo
echo "4. IMMEDIATELY post the first comment (see show-hn-post.md)"
echo
echo "5. Monitor for 2-4 hours and respond to every comment"
echo
echo -e "${GREEN}Press ENTER to open the submission page...${NC}"
read

# Open submission page
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "$SUBMISSION_URL"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "$SUBMISSION_URL"
else
    echo "Please open manually: $SUBMISSION_URL"
fi

echo
echo -e "${GREEN}Submission page opened in browser${NC}"
echo
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Submit the post manually on HN"
echo "2. Copy first comment from show-hn-post.md"
echo "3. Post the comment immediately"
echo "4. Run the monitoring script:"
echo "   ./monitor-engagement.sh"
echo
echo -e "${YELLOW}Good luck! 🚀${NC}"
echo

# Create a timestamp for tracking
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "$TIMESTAMP,Show HN Submitted,$TITLE" >> ../tracking/campaign-log.csv

# Open the first comment template
echo -e "${BLUE}Opening first comment template...${NC}"
if command -v code &> /dev/null; then
    code show-hn-post.md
elif command -v vim &> /dev/null; then
    vim show-hn-post.md
else
    cat show-hn-post.md
fi
