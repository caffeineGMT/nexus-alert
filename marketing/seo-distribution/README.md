# SEO Content Distribution & Backlink Building Campaign

**Campaign Goal:** Acquire 3+ high-quality backlinks, 2K organic blog visits/month within 60 days, increase Domain Authority

**Campaign Period:** March 18 - May 18, 2026

## Campaign Overview

This directory contains all scripts, templates, and tracking for the NEXUS Alert SEO distribution campaign.

### Distribution Channels

1. **Hacker News** - Show HN post (Saturday 9am PT launch)
2. **Medium** - Cross-post with canonical links
3. **Dev.to** - Cross-post with canonical links
4. **LinkedIn** - Cross-post with canonical links
5. **Travel Blogger Outreach** - Guest post pitches to 10 high-authority sites
6. **Reddit** - Value-first organic posting (r/travel, r/churning)
7. **Quora** - 20 helpful answers with links

### Success Metrics

- ✅ 3+ high-quality backlinks (DA 40+)
- ✅ 2,000 organic blog visits/month within 60 days
- ✅ Domain Authority increase
- ✅ 10+ referring domains
- ✅ Featured on 1+ major travel blog

## Directory Structure

```
seo-distribution/
├── README.md (this file)
├── hacker-news/
│   ├── show-hn-post.md
│   ├── submission-script.sh
│   └── engagement-strategy.md
├── cross-posting/
│   ├── medium-posts/
│   ├── devto-posts/
│   ├── linkedin-posts/
│   └── canonical-setup.md
├── blogger-outreach/
│   ├── target-list.md
│   ├── email-templates/
│   └── guest-post-pitch.md
├── reddit/
│   ├── subreddit-strategy.md
│   ├── r-travel-posts.md
│   └── r-churning-posts.md
├── quora/
│   ├── target-questions.md
│   ├── answer-templates.md
│   └── posting-schedule.md
├── tracking/
│   ├── backlinks.csv
│   ├── traffic-metrics.csv
│   └── campaign-dashboard.md
└── automation/
    ├── distribute-all.sh
    └── analytics-pull.sh
```

## Quick Start

### Week 1: Setup & Hacker News Launch

```bash
# 1. Review and customize all templates
cd /Users/michaelguo/nexus-alert/marketing/seo-distribution

# 2. Submit to Hacker News (Saturday 9am PT)
cd hacker-news
./submission-script.sh

# 3. Cross-post to Medium/Dev.to/LinkedIn (same day)
cd ../cross-posting
./publish-all.sh
```

### Week 2-4: Blogger Outreach

```bash
# Send personalized pitches to 10 travel bloggers
cd blogger-outreach
./send-outreach.sh
```

### Week 3-6: Reddit & Quora

```bash
# Post organic content to Reddit (spread across 4 weeks)
cd reddit
./post-schedule.sh

# Answer Quora questions (5 per week for 4 weeks)
cd quora
./answer-schedule.sh
```

## Content Inventory

### Available Blog Posts for Distribution

1. **How to Get a NEXUS Appointment Fast (7 Proven Strategies)** ⭐ PRIMARY
   - Best for: Hacker News, Medium, Dev.to, LinkedIn
   - SEO Keywords: nexus appointment, nexus slot checker
   - URL: https://nexus-alert.com/blog/how-to-get-nexus-appointment-fast

2. **Global Entry vs NEXUS vs SENTRI: Complete Comparison**
   - Best for: Travel blogs, Reddit r/travel
   - SEO Keywords: global entry vs nexus, trusted traveler comparison
   - URL: https://nexus-alert.com/blog/global-entry-vs-nexus-vs-sentri

3. **Success Story: Sarah Got Her NEXUS Appointment in 3 Days**
   - Best for: Reddit, Quora, social proof
   - URL: https://nexus-alert.com/blog/success-story-sarah-nexus-3-days

### Guest Post Pitch

**"The Secret to Finding Global Entry Appointments"** (2,000 words)
- Target: The Points Guy, One Mile at a Time, Travel Codex, Thrifty Traveler
- Angle: Data-driven analysis of appointment availability patterns
- Includes: Original research, charts, actionable tips

## Tracking & Reporting

### Weekly KPIs

- Backlinks acquired (track in `tracking/backlinks.csv`)
- Referring domains
- Organic traffic to blog
- Keyword rankings (NEXUS appointment, Global Entry appointment)
- Social shares

### Tools

- **Ahrefs** - Backlink monitoring, Domain Authority
- **Google Analytics** - Traffic, conversions
- **Google Search Console** - Keyword rankings, impressions
- **BuzzSumo** - Social shares, influencer identification

## Distribution Schedule

| Week | Activity | Channel | Target |
|------|----------|---------|--------|
| 1 | Show HN Launch | Hacker News | 500+ upvotes, front page |
| 1 | Cross-post primary article | Medium, Dev.to, LinkedIn | 3 canonical backlinks |
| 2 | Blogger outreach batch 1 | Email | 5 pitches sent |
| 3 | Blogger outreach batch 2 | Email | 5 pitches sent |
| 3-6 | Reddit organic posts | r/travel, r/churning | 8 posts total |
| 3-6 | Quora answers | Quora | 20 answers |
| 8 | Campaign review | Analytics | Evaluate results |

## Notes

- All templates are pre-written and ready to customize
- Automation scripts included where possible
- Focus on VALUE-FIRST content (no spam)
- Track all metrics in `tracking/` directory
