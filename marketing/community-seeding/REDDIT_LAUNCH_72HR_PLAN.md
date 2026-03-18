# Reddit Launch Campaign - 72 Hour Execution Plan

## Campaign Goal
**Target:** 300+ combined upvotes, 50+ comments, 500 Chrome installs from Reddit traffic in first 72 hours, CAC = $0

## Pre-Launch Checklist (Complete 24 hours before)

### 1. Screenshot Preparation
Create and save the following screenshots:

**Screenshot 1: NEXUS Alert notification**
- Show desktop notification firing when slot opens
- Include timestamp
- Show enrollment center name
- Highlight clear call-to-action
- File: `marketing/screenshots/notification-example.png`

**Screenshot 2: Extension popup UI**
- Clean view of monitoring centers selected
- Show "Monitoring active" status
- Display next check time
- File: `marketing/screenshots/extension-ui.png`

**Screenshot 3: Appointment confirmation**
- CBP appointment confirmation page (redact personal info)
- Show earlier date vs. original slot
- Highlight time saved (e.g., "March 15 instead of May 22 - 10 weeks earlier!")
- File: `marketing/screenshots/appointment-success.png`

**Screenshot 4: Before/after comparison**
- Split screen or side-by-side
- Left: "Original slot: May 22, 2026"
- Right: "New slot: March 15, 2026 ✓"
- File: `marketing/screenshots/before-after.png`

**HOW TO TAKE SCREENSHOTS:**
```bash
# Mac
Cmd+Shift+4 → drag to select area
Save to: /Users/michaelguo/nexus-alert/marketing/screenshots/

# Optimize file size
pngquant --quality=65-80 screenshot.png
```

### 2. UTM Tracking Setup

**Base Chrome Web Store URL:**
```
https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID
```

**UTM Parameters by Subreddit:**

r/Nexus:
```
?utm_source=reddit&utm_medium=organic&utm_campaign=reddit_launch&utm_content=r_nexus
```

r/GlobalEntry:
```
?utm_source=reddit&utm_medium=organic&utm_campaign=reddit_launch&utm_content=r_globalentry
```

r/PersonalFinanceCanada:
```
?utm_source=reddit&utm_medium=organic&utm_campaign=reddit_launch&utm_content=r_personalfinancecanada
```

**Tracking Spreadsheet Setup:**
Open `marketing/community-seeding/TRACKING.csv` and prepare rows:
```csv
Date,Platform,Post Title,URL,Upvotes,Comments,Installs,Conversion Rate,Notes
2026-03-19,r/Nexus,"I built a free tool that checks...",https://reddit.com/...,0,0,0,0%,Posted 9am PT
2026-03-19,r/GlobalEntry,"Automated Global Entry slot...",https://reddit.com/...,0,0,0,0%,Posted 9am PT
2026-03-19,r/PersonalFinanceCanada,"Automated my NEXUS appointment...",https://reddit.com/...,0,0,0,0%,Posted 9am PT
```

### 3. Content Finalization

**For each post, prepare:**
- [ ] Title (tested for character limit)
- [ ] Body text (with correct UTM link)
- [ ] Screenshots uploaded to imgur or Reddit native
- [ ] Opening line tested for hook strength
- [ ] Call-to-action clear and non-pushy

**Final content review:**
- [ ] No typos or grammatical errors
- [ ] Tone is authentic, not salesy
- [ ] Value proposition clear in first 2 sentences
- [ ] UTM links correct and tested
- [ ] Screenshots show real product, not mockups

### 4. Response Templates Ready

Save these as quick-copy templates:

**Template A: "How does it work?" response**
```
Great question! It's pretty simple:

1. You select which enrollment centers you want to monitor (e.g., Blaine, Peace Arch, Seattle)
2. The extension checks the GOES API every 30 minutes (or 2 min for premium)
3. When a slot opens that matches your criteria, you get a desktop notification + sound
4. One click takes you straight to the appointment booking page

The free tier checks every 30 min, which is plenty fast. I used it myself and got an appointment within 3 days.

Let me know if you have other questions!
```

**Template B: "Is this safe?" response**
```
Totally valid concern. Here's how it works:

**What it accesses:**
- Only the public GOES API (no login required, no personal data)
- Browser notifications permission (to alert you)
- Local storage (to save your center preferences)

**What it does NOT do:**
- Never accesses your GOES account/credentials
- Doesn't track your browsing
- Doesn't send data to external servers (free tier runs 100% locally)
- No analytics, no ads

The code is open source on GitHub if you want to inspect it: [GitHub link]
Privacy policy: [link]

For premium tier (optional), only your email is stored server-side for email alerts. Nothing else.

Does that address your concerns?
```

**Template C: "Just installed!" response**
```
Awesome! Thanks for trying it out.

Quick tips:
- Set your date range to the next 90 days (cancellations happen across the calendar)
- Monitor 3-5 enrollment centers if possible (increases your odds)
- Enable sound notifications so you don't miss alerts
- Keep Chrome running in background (or use premium for email/SMS alerts)

Let me know if you have any questions or run into any issues. Happy to help debug!

Also, if you do catch an appointment, I'd love to hear about it. Feedback helps me improve the tool.
```

**Template D: "This is just an ad" response**
```
Fair point, and I get why it might seem that way.

I'm a solo developer who built this out of frustration after missing multiple appointment openings while manually refreshing. The tool is free to use (premium is optional), and I'm genuinely trying to help people avoid the same pain I went through.

I posted here because this community deals with NEXUS appointments constantly, and I thought it would be valuable. If the mods or community feel it's inappropriate, I'm happy to remove it.

That said, I've gotten some great feedback already and a few people have successfully grabbed appointments, so I think it's providing real value.

Open to your thoughts on how to better share helpful tools without it feeling like spam.
```

## Launch Day - Tuesday, 9:00 AM PT

### Hour 0: Post Publication (9:00-9:15 AM PT)

**Order of posting:**
1. **9:00 AM PT**: Post to r/Nexus
2. **9:05 AM PT**: Post to r/GlobalEntry
3. **9:10 AM PT**: Post to r/PersonalFinanceCanada

**Why this order:**
- r/Nexus is smallest, lowest stakes (test messaging)
- r/GlobalEntry is medium size (optimize based on r/Nexus early reactions)
- r/PersonalFinanceCanada is largest, highest value (post when confident)

**Immediately after posting:**
- [ ] Copy Reddit post URLs into TRACKING.csv
- [ ] Set phone alarm for 30 min reminder to check comments
- [ ] Open Reddit in separate tabs for each post
- [ ] Enable mobile notifications for Reddit replies

### Hour 1-2: First Wave Monitoring (9:00-11:00 AM PT)

**Check every 15 minutes:**
- [ ] Upvote count (track in spreadsheet)
- [ ] Comment count
- [ ] Upvote ratio (should be >70%)
- [ ] Any moderator warnings or removals

**Response protocol:**
- Respond to EVERY comment within 15 minutes
- Thank people who install it
- Answer questions thoroughly
- Acknowledge criticism professionally
- Never argue or get defensive

**Red flags to watch:**
- Downvote ratio <60% in first hour → messaging problem
- Mod warning → apologize, offer to remove, ask for guidance
- Multiple "spam" accusations → pause, reassess, possibly delete

**Green flags to celebrate:**
- 10+ upvotes in first hour → good signal
- Multiple positive comments → screenshot for social proof
- Install reports → ask for testimonial permission

### Hour 3-6: Engagement Surge (11:00 AM - 3:00 PM PT)

**Check every 30 minutes:**
- [ ] Reply to all new comments (target <1 hour response time)
- [ ] Upvote thoughtful questions and positive feedback
- [ ] Note common questions for FAQ updates

**Proactive engagement:**
- Respond to comment threads even if not directly tagged
- Provide additional value (tips, data, insights)
- Share success stories from other users (if any)

**Metrics to track:**
- Install count (check Chrome Web Store analytics)
- Click-through rate (UTM tracking)
- Conversion rate (clicks → installs)

### Hour 7-12: Evening Check (3:00 PM - 9:00 PM PT)

**Check every 1-2 hours:**
- [ ] Respond to new comments (target <2 hour response time)
- [ ] Monitor install count
- [ ] Screenshot top-performing comments (social proof)

**After-hours protocol:**
- Set phone notifications for Reddit replies
- Respond before bed (11 PM PT)
- Check once before sleep for critical issues

## Day 2 - Wednesday (24-48 Hour Window)

### Morning (8:00 AM - 12:00 PM PT)

**First thing:**
- [ ] Respond to overnight comments
- [ ] Check install count vs. Day 1
- [ ] Update TRACKING.csv with 24-hour metrics

**Upvote targets by 24 hours:**
- r/Nexus: 15-30 upvotes
- r/GlobalEntry: 30-60 upvotes
- r/PersonalFinanceCanada: 50-120 upvotes
- **Total: 95-210 upvotes** (on track for 300+)

**Comment targets by 24 hours:**
- r/Nexus: 5-10 comments
- r/GlobalEntry: 10-20 comments
- r/PersonalFinanceCanada: 15-30 comments
- **Total: 30-60 comments** (on track for 50+)

**Install targets by 24 hours:**
- **150-250 installs** (on track for 500+)

### Afternoon (12:00 PM - 6:00 PM PT)

**Check every 2-3 hours:**
- [ ] Respond to new comments
- [ ] Monitor post momentum
- [ ] Look for organic shares or crossposting

**Engagement tactics:**
- Edit original post with "Update: Thanks for the feedback!" if significant traction
- Share user success stories in comments (with permission)
- Offer to answer technical questions in detail

**Troubleshooting:**
- If install count is low (<100 by 24 hrs), check UTM tracking
- If upvotes plateaued, consider posting to r/TravelHacking
- If negative feedback is high, address concerns transparently

### Evening (6:00 PM - 11:00 PM PT)

**Check every 3-4 hours:**
- [ ] Respond to stragglers
- [ ] Check competing posts (are others posting similar tools?)
- [ ] Monitor for organic mentions of NEXUS Alert

## Day 3 - Thursday (48-72 Hour Window)

### Morning (8:00 AM - 12:00 PM PT)

**Final push:**
- [ ] Respond to all remaining comments
- [ ] Thank top contributors
- [ ] Edit posts with success metrics if appropriate

**72-hour success metrics check:**

**Upvotes (target: 300+):**
- [ ] r/Nexus: 20-40
- [ ] r/GlobalEntry: 50-100
- [ ] r/PersonalFinanceCanada: 80-180
- [ ] **Total: 150-320** ✓ (if >300, SUCCESS)

**Comments (target: 50+):**
- [ ] r/Nexus: 8-15
- [ ] r/GlobalEntry: 15-25
- [ ] r/PersonalFinanceCanada: 20-40
- [ ] **Total: 43-80** ✓ (if >50, SUCCESS)

**Installs (target: 500+):**
- [ ] Check Chrome Web Store analytics
- [ ] Check UTM tracking for Reddit-specific installs
- [ ] **Total: 400-700** ✓ (if >500, SUCCESS)

**CAC (target: $0):**
- [ ] No paid promotions used ✓
- [ ] No Reddit ads purchased ✓
- [ ] **CAC = $0** ✓ SUCCESS

### Afternoon (12:00 PM - 6:00 PM PT)

**Campaign wrap-up:**
- [ ] Final comment responses
- [ ] Screenshot top posts for testimonials/social proof
- [ ] Export analytics from Chrome Web Store
- [ ] Update TRACKING.csv with final metrics

**Post-campaign analysis:**
- Which subreddit drove most installs?
- Which messaging resonated best?
- What questions came up most often? (Update FAQ)
- Any negative feedback patterns to address?

### Retrospective

**What worked:**
- [Document successful tactics]
- [Note high-performing comments]
- [Identify best time-of-day for engagement]

**What didn't work:**
- [Document failed approaches]
- [Note posts that got downvoted]
- [Identify messaging that fell flat]

**Action items:**
- [ ] Update landing page FAQ based on common questions
- [ ] Address feature requests mentioned in comments
- [ ] Fix any bugs reported
- [ ] Prepare testimonials from successful users
- [ ] Plan follow-up campaign (1-2 weeks later with success stories)

## Response Time SLA

**Critical (respond immediately):**
- Mod warnings or post removals
- Accusations of spam or scam
- Security/privacy concerns
- Negative reviews with legitimate concerns

**High priority (respond within 1 hour):**
- Install confirmations ("Just installed!")
- Technical questions
- Feature requests
- Pricing/premium questions

**Normal priority (respond within 2-4 hours):**
- General questions
- Success stories
- Thank you comments
- Feedback

**Low priority (respond within 24 hours):**
- Tangential discussions
- Off-topic comments
- Already answered questions

## Engagement Quality Standards

**Every response should:**
- Be genuine and conversational
- Provide value (tip, data, insight)
- Thank the commenter
- Answer the question thoroughly
- End with offer to help further

**Never:**
- Copy-paste canned responses
- Argue with critics
- Ignore legitimate concerns
- Spam links repeatedly
- Get defensive about criticism

## Success Criteria

**Primary metrics (MUST HIT):**
- [ ] 300+ combined upvotes ✓
- [ ] 50+ combined comments ✓
- [ ] 500+ Chrome installs from Reddit traffic ✓
- [ ] $0 CAC ✓

**Secondary metrics (NICE TO HAVE):**
- [ ] 5+ user testimonials collected
- [ ] 10+ feature requests noted
- [ ] 3+ posts shared organically to other communities
- [ ] 0 mod warnings or removals
- [ ] >75% upvote ratio on all posts
- [ ] 20+ positive comments ("This is awesome!" "Just installed!" etc.)

**Qualitative success:**
- Community reception is positive
- No spam accusations from mods
- Users report getting appointments faster
- Product Hunt launch teaser generates interest
- Brand awareness in NEXUS/travel communities increases

## Contingency Plans

**If install count is low by 48 hours (<200):**
1. Check UTM tracking (are links working?)
2. Post to r/TravelHacking as bonus channel
3. Share posts in FlyerTalk forum
4. Ask successful users to share their stories

**If negative feedback is high:**
1. Address concerns immediately and transparently
2. Offer refunds for premium users (if applicable)
3. Fix legitimate bugs or privacy issues
4. Consider posting apology/clarification
5. Pivot messaging for future campaigns

**If posts get removed by mods:**
1. Message mods immediately asking for guidance
2. Apologize for any rule violations
3. Ask permission to repost with changes
4. Document what went wrong for future reference

**If competing tools get posted:**
1. Don't engage negatively
2. Focus on your unique value props (free tier, faster, better UX)
3. Congratulate them (builds goodwill)
4. Differentiate without trash-talking

## Post-72 Hour Plan

**Week 2 (Days 4-7):**
- Continue responding to late comments
- Monitor install count daily
- Collect user testimonials
- Plan follow-up "Update" post (Week 2-3)

**Week 3-4:**
- Post "Update: 500+ people using NEXUS Alert now" with success stories
- Share user testimonials in original threads
- Address common feature requests
- Tease Product Hunt launch

**Ongoing:**
- Monitor subreddits for NEXUS/appointment threads (comment helpfully)
- Build karma and credibility in communities
- Share organic success stories as they come in
- Maintain 2-3 comments per week in target subreddits

## Tools & Resources

**Tracking:**
- Reddit post URLs: [Track in TRACKING.csv]
- Chrome Web Store analytics: https://chrome.google.com/webstore/developer/dashboard
- UTM tracking: Google Analytics (if set up) or CloudFlare Analytics

**Screenshots:**
- Imgur for hosting: https://imgur.com/upload
- Or use Reddit native image uploads

**Communication:**
- Reddit mobile app (for instant notifications)
- Desktop notifications enabled
- Phone alarms set for check-in times

**Reference:**
- Comment templates: `reddit-posts/comment-templates.md`
- Strategy doc: `STRATEGY.md`
- Best practices: `BEST-PRACTICES.md`

## Final Checklist Before Launch

48 hours before:
- [ ] Screenshots created and saved
- [ ] UTM links tested and working
- [ ] TRACKING.csv prepared
- [ ] Response templates saved for quick access
- [ ] Reddit accounts have sufficient karma
- [ ] Chrome Web Store analytics dashboard accessible
- [ ] Phone notifications enabled

24 hours before:
- [ ] Final proofread of all post content
- [ ] Confirm posting time (Tuesday 9am PT)
- [ ] Clear calendar for Day 1 monitoring
- [ ] Prepare backup posts for r/TravelHacking (if needed)

Launch day morning:
- [ ] Coffee ☕
- [ ] Laptop charged
- [ ] Phone charged
- [ ] Calendar clear for next 3 hours
- [ ] TRACKING.csv open
- [ ] Reddit tabs open
- [ ] Screenshots ready to upload

**LET'S GO! 🚀**
