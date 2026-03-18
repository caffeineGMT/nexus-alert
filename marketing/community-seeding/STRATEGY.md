# Reddit & Community Seeding Strategy

## Objective
Drive first 300 installs from Reddit and travel communities in 30 days with <$2 CAC through authentic, helpful engagement.

## Target Communities

### Primary (High Priority)
1. **r/Nexus** (12K members)
   - Focus: NEXUS-specific appointment hunting
   - Post frequency: 1 post per week max
   - Comment on every "can't find appointment" thread

2. **r/GlobalEntry** (8K members)
   - Focus: Global Entry appointment frustrations
   - Post frequency: 1 post per week max
   - Engage with appointment-related posts daily

3. **r/TravelHacking** (300K members)
   - Focus: Efficiency tools for frequent travelers
   - Post frequency: 1 post every 2 weeks
   - Comment on Trusted Traveler threads

### Secondary (Medium Priority)
4. **FlyerTalk Trusted Traveler Forum**
   - Post introduction thread
   - Respond to appointment availability threads
   - Build reputation before promoting

5. **r/travel** (20M members)
   - Only engage when highly relevant
   - Focus on Trusted Traveler program threads

## Content Strategy

### Post Types

#### 1. Success Story Format (Primary)
"I built a free tool that checks for NEXUS appointments every 30min and alerts you — saved me 6 weeks of manual checking"

**Why it works:**
- Shares personal experience
- Offers solution to pain point
- Free tool = no sales pressure
- Specific outcome (6 weeks saved)

#### 2. How-To Guide Format
"How I got a NEXUS appointment 8 weeks earlier using automated slot monitoring"

**Why it works:**
- Educational value first
- Tool is part of solution, not the pitch
- Builds trust through teaching

#### 3. Update/AMA Format
"I made a Chrome extension for NEXUS slot alerts — now adding Global Entry support"

**Why it works:**
- Shows active development
- Invites feedback/questions
- Community feels involved

### Comment Reply Strategy

**When someone posts "Can't find any appointments":**

Template response:
```
I had the same frustration last month. Slots appear when people cancel, but they vanish in minutes.

A few things that helped me:
1. Check early morning (6-8am EST) when cancellations get processed
2. Weekdays have more turnover than weekends
3. I built a Chrome extension that monitors slots automatically and alerts me - saved me from refreshing 50x/day. Happy to share the link if helpful.

[Wait for them to ask, then share Chrome Web Store link]
```

**Key principles:**
- Give value FIRST (actionable tips)
- Mention tool last, casually
- Only share link when asked
- Never say "my product" or "check out my extension"

## UTM Tracking

### UTM Structure
All Reddit links use this format:
```
https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID?utm_source=reddit&utm_medium=organic&utm_campaign=community_seeding&utm_content=[subreddit_name]
```

### Tracking Codes by Platform
- **r/Nexus**: `utm_content=r_nexus`
- **r/GlobalEntry**: `utm_content=r_globalentry`
- **r/TravelHacking**: `utm_content=r_travelhacking`
- **r/travel**: `utm_content=r_travel`
- **FlyerTalk**: `utm_content=flyertalk`

### Install Attribution
Track in spreadsheet (see TRACKING.csv):
- Date posted
- Platform
- Post type
- Link with UTM
- Upvotes/comments
- Install count (check CWS analytics weekly)
- Conversion rate

## Posting Schedule

### Week 1
- **Mon**: Post to r/Nexus (Success Story format)
- **Wed**: Post to r/GlobalEntry (Success Story format)
- **Fri**: Daily comment monitoring starts
- **Sat**: Post to FlyerTalk introduction

### Week 2
- **Mon-Fri**: Comment on 2-3 relevant threads per day
- **Thu**: Post to r/TravelHacking (How-To Guide format)

### Week 3
- **Mon-Fri**: Comment on 2-3 relevant threads per day
- **Wed**: Post to r/Nexus (Update/AMA format)

### Week 4
- **Mon-Fri**: Comment on 2-3 relevant threads per day
- **Mon**: Post to r/GlobalEntry (How-To Guide format)
- **Thu**: Analyze results, adjust strategy

## Rules & Guardrails

### DO:
✅ Share personal experience authentically
✅ Give actionable advice before mentioning the tool
✅ Respond to every comment/question within 24 hours
✅ Disclose that you built the tool when asked
✅ Engage with other posts (upvote, comment on non-related topics)
✅ Build karma in each subreddit before posting

### DON'T:
❌ Spam multiple subreddits in one day
❌ Lead with "Check out my extension"
❌ Post without reading subreddit rules
❌ Ignore negative feedback
❌ Delete posts if they get downvoted
❌ Use multiple accounts to upvote
❌ Cross-post exact same content

## Success Metrics

### Target: 300 installs in 30 days

**Week 1 Goal**: 30 installs
- Focus on r/Nexus (small, targeted)
- Test messaging

**Week 2 Goal**: 75 installs
- Scale to r/GlobalEntry
- Refine based on Week 1 learnings

**Week 3 Goal**: 100 installs
- Hit r/TravelHacking (largest audience)
- Leverage social proof from earlier installs

**Week 4 Goal**: 95 installs
- Optimize based on best-performing content
- Double down on what works

### KPIs to Track Weekly
- Posts published: 2-3/week
- Comments posted: 10-15/week
- Total upvotes received
- Click-through rate (CTR) on CWS links
- Install conversion rate
- Negative feedback incidents (target: 0)

## Crisis Management

**If accused of spam:**
1. Acknowledge feedback immediately
2. Offer to delete post if inappropriate
3. Explain you're a solo dev trying to solve real problem
4. Ask how to better share helpful tools in future
5. Follow their guidance

**If post gets removed:**
1. Message mods politely asking for guidance
2. Don't repost immediately
3. Review subreddit rules again
4. Adjust approach

**If negative comments:**
1. Respond professionally
2. Fix legitimate concerns
3. Thank them for feedback
4. Don't argue or defend aggressively

## Content Calendar

See `CONTENT_CALENDAR.md` for detailed posting schedule with prepared content.

## Next Steps

1. Build karma in target subreddits (2-3 days of genuine engagement)
2. Prepare all post templates with UTM links
3. Set up tracking spreadsheet
4. Launch Week 1 posts
5. Monitor daily, engage authentically
6. Measure and iterate weekly
