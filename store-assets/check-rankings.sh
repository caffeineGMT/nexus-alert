#!/bin/bash
# Chrome Web Store Keyword Ranking Checker
# Run this script weekly to check rankings for target keywords

echo "================================================"
echo "Chrome Web Store Keyword Ranking Checker"
echo "================================================"
echo ""
echo "Opening Chrome Web Store search pages for each keyword..."
echo ""

# Primary keyword: nexus appointment (880 searches/mo)
echo "1. Opening: 'nexus appointment'"
open "https://chrome.google.com/webstore/search/nexus%20appointment"
sleep 3

# Secondary keyword: global entry appointment finder (720 searches/mo)
echo "2. Opening: 'global entry appointment finder'"
open "https://chrome.google.com/webstore/search/global%20entry%20appointment%20finder"
sleep 3

# Tertiary keyword: sentri appointment alert (320 searches/mo)
echo "3. Opening: 'sentri appointment alert'"
open "https://chrome.google.com/webstore/search/sentri%20appointment%20alert"
sleep 3

echo ""
echo "================================================"
echo "Manual Ranking Check Instructions:"
echo "================================================"
echo ""
echo "For each opened search page:"
echo "  1. Find 'NEXUS Alert' in the search results"
echo "  2. Note the position (1-20, or 'Not Ranked' if not on page 1)"
echo "  3. Record the ranking in keyword-rankings.csv"
echo ""
echo "CSV Format:"
echo "  Date,nexus_appointment_rank,global_entry_appointment_finder_rank,sentri_appointment_alert_rank,total_reviews,avg_rating,weekly_installs,notes"
echo ""
echo "Example:"
echo "  2025-03-25,8,12,5,12,4.9,145,First week post-launch"
echo ""
echo "Also record from Chrome Web Store Developer Dashboard:"
echo "  - Total reviews"
echo "  - Average star rating"
echo "  - Weekly installs"
echo ""
echo "Dashboard URL: https://chrome.google.com/webstore/devconsole"
echo ""
echo "================================================"
echo "Target Rankings by Week 4:"
echo "================================================"
echo "  nexus appointment: #1"
echo "  global entry appointment finder: #1-3"
echo "  sentri appointment alert: #1-2"
echo "================================================"
