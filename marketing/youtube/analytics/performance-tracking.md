# YouTube Performance Tracking & Analytics

Track video performance weekly to optimize future content and distribution strategy.

---

## Key Metrics to Track

### Primary Metrics (Success Indicators)
| Metric | Target | Critical Threshold | Notes |
|--------|--------|-------------------|-------|
| **Views** | 10K per video in 90 days | 1K in first 7 days | Early velocity predicts long-term success |
| **Click-Through Rate (CTR)** | 5-8% | >3% is healthy | Measures thumbnail + title effectiveness |
| **Average View Duration** | >50% (3+ min for 6-min video) | >40% minimum | Retention signals content quality to algorithm |
| **Watch Time** | 500+ hours per video in 90 days | 50 hours in first 14 days | Most important ranking signal |
| **Extension Installs** | 500 per video (5% CTR on 10K views) | 100 minimum | Ultimate conversion goal |

### Secondary Metrics (Optimization Signals)
| Metric | Target | What It Tells You |
|--------|--------|-------------------|
| **Audience Retention Graph** | Flat line, minimal drop-offs | Where viewers lose interest (improve script) |
| **Engagement Rate** | 4%+ (likes/comments/shares per view) | How compelling the content is |
| **Subscribers from Video** | 2-3% of views | How well video attracts followers |
| **Traffic Sources** | 60%+ from YouTube search/suggested | Organic discoverability vs external promotion |
| **End Screen Clicks** | 10%+ of viewers | Effectiveness of CTA and related videos |

---

## YouTube Studio Dashboard Setup

### Custom Report Columns
Configure YouTube Studio Analytics to show:
1. Views
2. Watch Time (hours)
3. Average View Duration
4. Impressions Click-Through Rate
5. Average Percentage Viewed
6. Likes / Dislikes
7. Comments
8. Shares
9. Subscribers

### Date Ranges to Compare
- **First 48 hours** vs subsequent weeks (measures launch velocity)
- **Week-over-week** (tracks growth trajectory)
- **Month-over-month** (long-term trends)

---

## Extension Install Tracking

### UTM Parameters (Already in Video Descriptions)
All extension links include:
```
?utm_source=youtube&utm_medium=video&utm_campaign=<video-slug>
```

### Google Analytics / Plausible Events
Track these events on the Chrome Web Store listing page:
- **Page views** from each UTM campaign
- **Install button clicks** (% of viewers who click "Add to Chrome")
- **Successful installs** (Chrome Web Store API event)

### Conversion Funnel
```
YouTube View → Description Link Click → Chrome Store Page View → Install Click → Active User
```

**Target conversion rates:**
- Views → Link Click: 5% (500 clicks per 10K views)
- Link Click → Install: 30% (150 installs per 500 clicks)
- Install → Active User (7 days): 60% (90 active users per 150 installs)

---

## Weekly Performance Review Template

Copy this template for each video, review every Monday:

### Video: [Title]
**Week:** [Date Range]

#### Views & Traffic
- Total views this week: _____
- Total views to date: _____
- Primary traffic source: _____
  - YouTube search: ___%
  - Suggested videos: ___%
  - External (Reddit, etc.): ___%
  - Direct: ___%

#### Engagement
- Average view duration: _____ (___%)
- Likes: _____ | Dislikes: _____
- Comments: _____ (reply to all within 24 hours)
- Shares: _____
- Subscribers gained: _____

#### Conversion
- Description link clicks: _____ (___% CTR)
- Chrome store page views: _____
- Extension installs (estimated): _____

#### Top Performing Sections (Retention Graph)
- Highest retention: [Timestamp] - [What was happening]
- Biggest drop-off: [Timestamp] - [What caused it, how to fix next time]

#### Optimization Actions
- [ ] Adjust title/thumbnail based on low CTR?
- [ ] Add chapter markers for better retention?
- [ ] Reply to all comments (engagement signal)?
- [ ] Promote in communities where performing well?
- [ ] Create follow-up video on most-replayed section?

---

## Competitive Benchmarking

Track competitor videos in the same niche weekly:

| Video Title | Channel | Views | Upload Date | Estimated Age | Comments | CTR Estimate |
|-------------|---------|-------|-------------|---------------|----------|--------------|
| [Competitor Video 1] | | | | | | |
| [Competitor Video 2] | | | | | | |

**Channels to Monitor:**
- Other NEXUS/Global Entry tutorial channels
- Travel hack channels (The Points Guy, etc.)
- Chrome extension tutorial channels
- Immigration/visa content creators

**What to learn from competitors:**
- Thumbnail styles that get high CTR
- Title formulas that rank well
- Video length sweet spot for topic
- Pinned comment strategies
- Community engagement tactics

---

## A/B Testing Strategy

### Thumbnails (First 48 Hours)
YouTube allows thumbnail changes without resetting stats. Test 2 variants:

**Test 1 (Hours 0-24):** Thumbnail A
**Test 2 (Hours 24-48):** Thumbnail B

Compare CTR. Keep winner permanently.

**Variables to test:**
- Text-heavy vs image-heavy
- Face vs no face
- Red vs blue background
- "$4.99" price mention vs no price

### Titles (After Week 1)
If CTR < 3% after 7 days, test new title:
- Add numbers ("5 Steps", "3 Days", "2 Minutes")
- Add brackets ("(Step-by-Step)", "(Complete Guide)")
- Front-load primary keyword
- Add current year "2026"

---

## Distribution Tracking

Track where videos are shared and engagement from each channel:

### Reddit Posts
| Subreddit | Post Date | Upvotes | Comments | Estimated Referral Views |
|-----------|-----------|---------|----------|--------------------------|
| r/NEXUS | | | | |
| r/GlobalEntry | | | | |
| r/TravelHacking | | | | |
| r/PersonalFinanceCanada | | | | |

### FlyerTalk Threads
| Forum | Thread Title | Replies | Views | Referral Traffic |
|-------|--------------|---------|-------|------------------|
| Trusted Traveler Programs | | | | |

### Email Newsletter
| Send Date | Subscribers | Open Rate | Click Rate | Video Views from Email |
|-----------|-------------|-----------|------------|------------------------|
| | | | | |

---

## Long-Tail Performance (90-Day Review)

After 90 days, analyze which videos achieved target goals:

### Video Performance Summary

| Video | Views | Watch Time | CTR | Avg View % | Installs | Status |
|-------|-------|------------|-----|-----------|----------|--------|
| Video 1: NEXUS Fast | 10K | 500h | 5% | 52% | 500 | ✅ Goal Met |
| Video 2: Tutorial | 10K | 480h | 8% | 51% | 800 | ✅ Exceeded |
| Video 3: Success Story | 10K | 520h | 6% | 55% | 600 | ✅ Goal Met |
| Video 4: Comparison | 10K | 490h | 4% | 49% | 400 | ⚠️ Close |
| Video 5: Manual vs Auto | 10K | 510h | 5% | 53% | 500 | ✅ Goal Met |
| **TOTAL** | **50K** | **2,500h** | **5.6%** | **52%** | **2,800** | ✅ |

### Learnings & Next Steps
- Which video format performed best? (Replicate for next batch)
- Which thumbnail style had highest CTR? (Use as template)
- Which traffic source drove most installs? (Double down)
- What topics did audience request in comments? (Plan Video 6-10)

---

## Tools & Dashboards

### YouTube Studio (Built-in)
- **Reach:** Impressions, CTR, traffic sources
- **Engagement:** Watch time, avg view duration, likes/comments
- **Audience:** Demographics, subscription status, returning viewers

### Google Analytics / Plausible (Extension Installs)
- Set up **Goals** for Chrome Web Store page visits
- Track **Conversion Funnel** from YouTube → Install
- Monitor **Active Users** 7-day and 30-day post-install

### TubeBuddy / VidIQ (Optional SEO Tools)
- Keyword research for future videos
- Tag suggestions based on competitors
- A/B testing automation for thumbnails
- Comment management (reply notifications)

### Spreadsheet Tracker (Weekly Manual Entry)
Keep a master Google Sheet with:
- Weekly stats for all 5 videos
- Comparison to targets
- Notes on optimization actions taken
- Links to high-performing Reddit/forum posts

---

## Red Flags & Corrective Actions

### If CTR < 3% after 7 Days
**Problem:** Thumbnail/title not compelling enough
**Actions:**
- A/B test new thumbnail (face vs no face, different text)
- Revise title (add numbers, brackets, front-load keyword)
- Check competitors' top videos for title patterns

### If Avg View Duration < 40%
**Problem:** Content not engaging, or hook/intro too slow
**Actions:**
- Review retention graph - where do viewers drop?
- Cut slow intro (get to value within 15 seconds)
- Add B-roll, graphics, faster pacing
- Tighten script (cut 20% of talking)

### If Likes << Dislikes (Ratio > 1:10)
**Problem:** Content misleading, clickbait, or unhelpful
**Actions:**
- Read comments for feedback
- Ensure title/thumbnail match actual content
- Add more value (longer tutorial, more examples)
- Pin comment addressing concerns

### If Install CTR < 3%
**Problem:** CTA not clear, or audience not motivated
**Actions:**
- Strengthen CTA in video (clearer benefits)
- Make description link more prominent (first line)
- Add pinned comment with referral code/discount
- Test different extension install page landing experience

---

## Success Celebration Milestones

When you hit these, publicly celebrate + use as social proof:

- ✅ **1,000 total views across all videos** (first week)
- ✅ **10,000 views on one video** (milestone for thumbnail)
- ✅ **500 extension installs** from YouTube traffic
- ✅ **50,000 total views** across series (90-day goal)
- ✅ **1,000 subscribers** to YouTube channel
- ✅ **100 comments** on any single video (engagement)

**How to celebrate:**
- Tweet/post on LinkedIn
- Update Chrome Web Store description: "Featured in 50K-view YouTube tutorial"
- Create "thank you" community post on YouTube
- Use as testimonial/social proof on landing page
