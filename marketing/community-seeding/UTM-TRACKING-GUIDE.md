# UTM Tracking Guide for NEXUS Alert Community Seeding

## Overview
This guide explains how to create, track, and analyze UTM parameters for all community seeding efforts.

## UTM Parameter Structure

### Base URL
```
https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID
```

### Full URL Format
```
https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID?utm_source=[SOURCE]&utm_medium=[MEDIUM]&utm_campaign=[CAMPAIGN]&utm_content=[CONTENT]
```

---

## UTM Parameters Defined

### utm_source (Required)
Where the traffic originates

**Values:**
- `reddit` - Any Reddit post or comment
- `flyertalk` - FlyerTalk forum
- `twitter` - Twitter/X posts
- `hackernews` - Hacker News
- `producthunt` - Product Hunt

### utm_medium (Required)
Marketing medium/channel type

**Values:**
- `organic` - Unpaid posts/comments
- `forum` - Forum discussions
- `social` - Social media

### utm_campaign (Required)
Specific campaign name

**Values:**
- `community_seeding` - All organic community efforts
- `launch_week` - Product launch promotions
- `feature_announcement` - New feature announcements

### utm_content (Recommended)
Specific content piece or location

**Values:**
- `r_nexus` - r/Nexus subreddit
- `r_globalentry` - r/GlobalEntry subreddit
- `r_travelhacking` - r/TravelHacking subreddit
- `r_travel` - r/travel subreddit
- `flyertalk_intro` - FlyerTalk introduction thread
- `comment_[date]` - Specific comment (e.g., comment_2024_03_15)

---

## Pre-Built UTM Links

### Reddit Posts

**r/Nexus Success Story:**
```
https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID?utm_source=reddit&utm_medium=organic&utm_campaign=community_seeding&utm_content=r_nexus_success
```

**r/GlobalEntry Success Story:**
```
https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID?utm_source=reddit&utm_medium=organic&utm_campaign=community_seeding&utm_content=r_globalentry_success
```

**r/TravelHacking How-To:**
```
https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID?utm_source=reddit&utm_medium=organic&utm_campaign=community_seeding&utm_content=r_travelhacking_howto
```

**r/Nexus AMA:**
```
https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID?utm_source=reddit&utm_medium=organic&utm_campaign=community_seeding&utm_content=r_nexus_ama
```

### FlyerTalk

**Introduction Thread:**
```
https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID?utm_source=flyertalk&utm_medium=forum&utm_campaign=community_seeding&utm_content=introduction
```

**Comment Reply:**
```
https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID?utm_source=flyertalk&utm_medium=forum&utm_campaign=community_seeding&utm_content=comment_[YYYYMMDD]
```

### Reddit Comments

**General Comment Template:**
```
https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID?utm_source=reddit&utm_medium=organic&utm_campaign=community_seeding&utm_content=[subreddit]_comment_[YYYYMMDD]
```

**Example:**
```
https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID?utm_source=reddit&utm_medium=organic&utm_campaign=community_seeding&utm_content=r_nexus_comment_20240318
```

---

## Creating New UTM Links

### Tool: Google Campaign URL Builder
https://ga-dev-tools.google/campaign-url-builder/

### Manual Process:

1. **Start with base URL:**
   ```
   https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID
   ```

2. **Add first parameter with `?`:**
   ```
   ?utm_source=reddit
   ```

3. **Add additional parameters with `&`:**
   ```
   &utm_medium=organic&utm_campaign=community_seeding&utm_content=r_nexus
   ```

4. **Final URL:**
   ```
   https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID?utm_source=reddit&utm_medium=organic&utm_campaign=community_seeding&utm_content=r_nexus
   ```

5. **Test the link** before posting (should redirect correctly)

---

## Tracking & Analytics

### Chrome Web Store Analytics

**Where to check:**
1. Log in to Chrome Web Store Developer Dashboard
2. Navigate to NEXUS Alert listing
3. Click "Stats" tab
4. View "User acquisition" section

**Metrics available:**
- Total installs
- Install sources (if UTM tracking works on CWS)
- Geographic data
- Retention

**Limitations:**
- Chrome Web Store may not fully support UTM tracking
- Install attribution might be limited
- May need Google Analytics on landing page for detailed tracking

### Tracking in Spreadsheet

**Manual tracking required** (see TRACKING.csv):
- Date posted
- Platform (Reddit, FlyerTalk, etc.)
- Link used (with UTM)
- Post/comment URL
- Engagement (upvotes, replies)
- Estimated installs

### Google Analytics (Web Landing Page)

If you add GA to your landing page (`web/`):

**Setup:**
1. Add Google Analytics to Next.js app
2. Create goal: "Click Chrome Web Store button"
3. Track UTM parameters in GA

**Reports to monitor:**
- Acquisition > Campaigns > All Campaigns
- Filter by campaign: `community_seeding`
- See traffic by source/medium/content
- Track conversion to "Install" goal

---

## Weekly Reporting Template

### Week of [Date]

**Posts Published:**
| Platform | Content Type | UTM Link | Date |
|----------|--------------|----------|------|
| r/Nexus | Success Story | [UTM link] | Mar 18 |
| r/GlobalEntry | Comment | [UTM link] | Mar 19 |

**Engagement:**
| Post | Upvotes | Comments | Replies |
|------|---------|----------|---------|
| r/Nexus Success Story | 42 | 18 | 15 |

**Estimated Installs by Source:**
| Source | Installs (estimated) | Notes |
|--------|---------------------|-------|
| r/Nexus | 25 | Strong engagement |
| r/GlobalEntry comments | 8 | Need more comments |
| FlyerTalk | 12 | Building traction |

**Top Performing Content:**
1. r/TravelHacking How-To (80 installs estimated)
2. r/Nexus Success Story (25 installs)
3. FlyerTalk Introduction (12 installs)

**Adjustments for Next Week:**
- Double down on r/TravelHacking (largest ROI)
- Test new comment templates on r/GlobalEntry
- Post update thread on r/Nexus

---

## Best Practices

### DO:
✅ Use consistent UTM structure
✅ Keep utm_content descriptive (easy to identify later)
✅ Test every UTM link before posting
✅ Track every link in TRACKING.csv immediately
✅ Review analytics weekly
✅ Use short, readable content IDs

### DON'T:
❌ Reuse the same utm_content for different posts
❌ Use spaces or special characters in UTM values
❌ Forget to url-encode if using special characters
❌ Mix up source/medium values
❌ Post a link without tracking it

---

## Attribution Challenges

**Chrome Web Store Limitations:**
- CWS may not preserve UTM parameters
- Install attribution might be incomplete
- Can't track individual user journeys

**Workarounds:**
1. **Landing page first:** Link to `nexus-alert.com` with UTMs, then CTA to Chrome Web Store
2. **Ask in onboarding:** Extension popup asks "How did you find us?"
3. **Correlation analysis:** Compare post dates with install spikes
4. **Survey users:** Periodic survey asking discovery source

**Recommended Approach:**
- Short-term: Use UTMs + manual tracking in spreadsheet
- Long-term: Build landing page with GA, funnel traffic through there

---

## Quick Reference: Common UTM Values

**utm_source:**
- reddit
- flyertalk
- hackernews
- producthunt
- twitter

**utm_medium:**
- organic
- forum
- social

**utm_campaign:**
- community_seeding
- launch_week
- feature_announcement

**utm_content examples:**
- r_nexus_success
- r_globalentry_comment_20240318
- flyertalk_intro
- r_travelhacking_howto
- r_nexus_ama

---

## Tools & Resources

**URL Builders:**
- [Google Campaign URL Builder](https://ga-dev-tools.google/campaign-url-builder/)
- [UTM.io](https://utm.io/) - Link management
- [Bitly](https://bitly.com/) - Link shortening (preserves UTM)

**Tracking Spreadsheets:**
- See `TRACKING.csv` template
- Google Sheets for real-time collaboration

**Analytics:**
- Chrome Web Store Developer Dashboard
- Google Analytics (if landing page implemented)
- Manual spreadsheet tracking

---

## Appendix: UTM Parameter Rules

**Valid characters:**
- Letters: a-z, A-Z
- Numbers: 0-9
- Symbols: - (hyphen), _ (underscore)

**Invalid characters:**
- Spaces (use _ or - instead)
- Special: &, ?, =, #, /

**Capitalization:**
- UTMs are case-sensitive
- Use lowercase for consistency
- Exception: utm_content can use mixed case if needed

**Length limits:**
- No hard limit, but keep under 50 characters per value
- Entire URL should be under 2000 characters
- Shorter is better for readability
