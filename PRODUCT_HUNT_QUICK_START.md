# Product Hunt Launch - Quick Start Guide

**TL;DR**: Complete checklist to launch on Product Hunt and hit #1 Product of the Day.

---

## 🎯 One-Page Summary

**Goal**: #1 Product of the Day, 500+ upvotes, 200+ Chrome installs, $500+ MRR from PH traffic

**Timeline**: 7 days prep + 1 day launch + 7 days follow-up

**Team Needed**: 3 people (maker, developer, marketer) online launch day 8 AM - 8 PM PT

**Budget**: $0 (organic launch) + time investment

---

## 📅 7-Day Countdown

### Day 7 (Tuesday before launch): Research & Plan
- [ ] Read `PRODUCT_HUNT_LAUNCH_PLAN.md` (comprehensive strategy)
- [ ] Research 5-10 potential hunters using `HUNTER_OUTREACH_TRACKER.md`
- [ ] Decide: Use hunter or self-hunt?
- [ ] Confirm team availability for launch day (next Tuesday)

**Time**: 2-3 hours

---

### Day 6 (Wednesday): Content Creation
- [ ] Create 5 gallery images (1200x1200px) using `PROMO_MATERIALS_GUIDE.md`
  - Hero shot, notification demo, filters, history, pricing
- [ ] Record and edit promo video (30-60 seconds)
- [ ] Design thumbnail (240x240px)
- [ ] Write first comment (founder story) - see template in launch plan

**Time**: 4-6 hours (or hire designer on Fiverr for ~$100)

---

### Day 5 (Thursday): Hunter Outreach
- [ ] Send DMs to top 3 target hunters (templates in `HUNTER_OUTREACH_TRACKER.md`)
- [ ] Log outreach in tracker spreadsheet
- [ ] Set reminder to follow up in 48 hours

**Time**: 1 hour

---

### Day 4 (Friday): Tech Setup
- [ ] Deploy Product Hunt landing page (`/ph` route is ready in codebase)
- [ ] Update Chrome Web Store extension ID in landing page
- [ ] Set up UTM tracking (follow `ANALYTICS_TRACKING_SETUP.md`)
- [ ] Create Stripe promo code PRODUCTHUNT (100% off first month)
- [ ] Test full funnel: PH page → Chrome install → Premium checkout

**Time**: 2-3 hours

---

### Day 3 (Saturday): Follow-Up & Review
- [ ] Follow up with hunters who didn't respond (only once)
- [ ] Finalize hunter or commit to self-hunt
- [ ] Review all gallery images and video
- [ ] Get beta user feedback on promo materials
- [ ] Prepare social posts (Twitter, LinkedIn)

**Time**: 2 hours

---

### Day 2 (Sunday): Final Prep
- [ ] Upload all assets to Product Hunt (schedule for Tuesday 12:01 AM)
- [ ] Test Product Hunt submission (use preview mode)
- [ ] Finalize first comment (copy to clipboard)
- [ ] Brief team on launch day roles (use `LAUNCH_DAY_CHECKLIST.md`)
- [ ] Set up real-time tracking dashboard (Google Sheets)
- [ ] Sleep early! (Need energy for launch day)

**Time**: 2-3 hours

---

### Day 1 (Monday): Rest & Review
- [ ] Triple-check Product Hunt post is scheduled
- [ ] Verify Chrome Web Store listing is live
- [ ] Test extension one final time
- [ ] Review response templates (see launch day checklist)
- [ ] Prep coffee/snacks for launch day
- [ ] Relax and get ready!

**Time**: 1 hour

---

### Launch Day (Tuesday): Go Time! 🚀
- [ ] **12:01 AM**: Post goes live, immediately post first comment
- [ ] **8:00 AM**: Team online, amplify on social (Twitter, LinkedIn, HN)
- [ ] **All Day**: Respond to ALL comments in <30 minutes
- [ ] **8:00 PM**: Day end wrap-up, collect metrics, thank supporters

**Time**: Full day (8 AM - 8 PM PT, all hands on deck)

**Use**: `LAUNCH_DAY_CHECKLIST.md` for hour-by-hour playbook

---

## 📂 File Guide

### Core Documents (Read These)
1. **PRODUCT_HUNT_LAUNCH_PLAN.md** (30 min read)
   - Comprehensive strategy, tagline, first comment, response templates
   - Most important document — read fully

2. **LAUNCH_DAY_CHECKLIST.md** (15 min read)
   - Hour-by-hour playbook for launch day
   - Print and keep next to you on launch day

3. **PRODUCT_HUNT_QUICK_START.md** (this file)
   - Quick reference, 7-day countdown
   - Start here, then dive into other docs

### Supporting Documents (Reference as Needed)
4. **PROMO_MATERIALS_GUIDE.md**
   - Specs for gallery images and promo video
   - Use when creating assets (Day 6)

5. **HUNTER_OUTREACH_TRACKER.md**
   - Hunter research and DM templates
   - Use when contacting hunters (Day 5)

6. **ANALYTICS_TRACKING_SETUP.md**
   - GA4, Stripe, UTM tracking setup
   - Use when implementing tracking (Day 4)

### Landing Page
7. **web/src/app/ph/page.tsx**
   - Product Hunt-specific landing page
   - Already created with special offer banner
   - Just need to deploy and update extension ID

---

## ✅ Pre-Launch Checklist (Complete Before Scheduling)

### Product Ready
- [ ] Chrome extension is fully functional
- [ ] Chrome Web Store listing is approved and live
- [ ] Extension ID is updated in all landing page links
- [ ] Free tier works (30-min checks, desktop notifications)
- [ ] Premium tier works (2-min checks, email notifications)
- [ ] Stripe integration tested (test payment goes through)

### Content Ready
- [ ] Gallery images created (5 images, 1200x1200px)
- [ ] Promo video created (30-60 sec, under 20MB)
- [ ] Thumbnail created (240x240px)
- [ ] Tagline finalized: "Never miss a NEXUS appointment slot"
- [ ] First comment written (founder story)
- [ ] Response templates ready

### Tech Ready
- [ ] Landing page /ph deployed and live
- [ ] UTM tracking set up (GA4 configured)
- [ ] Stripe promo code PRODUCTHUNT created (100% off 1 month)
- [ ] All links tested (Chrome Store, website, GitHub)
- [ ] Analytics dashboard ready (Google Sheets or Notion)

### Team Ready
- [ ] 3 team members committed to launch day
- [ ] Roles assigned (maker, developer, marketer)
- [ ] Shared response doc created (FAQ answers)
- [ ] Calendar blocked (8 AM - 8 PM PT on Tuesday)
- [ ] Communication channel ready (Slack/Discord)

### Hunter Ready
- [ ] Hunter confirmed (or committed to self-hunt)
- [ ] Hunter briefed on launch plan
- [ ] Early access provided to hunter (if using hunter)
- [ ] Launch time confirmed (Tuesday 12:01 AM PT)

---

## 🚀 Launch Day - Hourly Snapshot

**12:01 AM**: 🌙 Launch goes live
- Post first comment immediately
- Share in team chat

**8:00 AM**: ☀️ Social amplification
- Twitter thread, LinkedIn post
- Share in communities (r/NEXUS, travel Slacks)
- Team online and responding

**12:00 PM**: 🍽️ Midday check-in
- Target: 300+ upvotes, top 5 ranking
- Respond to all comments
- Fix any issues

**6:00 PM**: 🌆 Final push
- Target: 450+ upvotes, #1-3 ranking
- Last social push
- Thank supporters

**8:00 PM**: 🌙 Wrap-up
- Collect metrics (screenshot everything)
- Thank everyone on Twitter
- Team debrief

---

## 📊 Success Metrics (End of Day 1)

### Must Hit (Minimum Success)
- ✅ 200+ upvotes
- ✅ Top 10 ranking
- ✅ 100+ Chrome installs
- ✅ 10+ premium signups
- ✅ Zero major technical issues

### Target (Good Launch)
- ✅ 500+ upvotes
- ✅ Top 3 ranking
- ✅ 200+ Chrome installs
- ✅ 20+ premium signups
- ✅ 100+ email signups

### Stretch (Exceptional Launch)
- ✅ 1,000+ upvotes
- ✅ #1 Product of the Day
- ✅ 500+ Chrome installs
- ✅ 50+ premium signups
- ✅ Featured in PH newsletter

---

## 🎯 Top 5 Success Factors

1. **Timing**: Tuesday at 12:01 AM PT (highest traffic day)
2. **First Comment**: Post founder story immediately (sets the tone)
3. **Responsiveness**: Reply to ALL comments in <30 minutes (shows you care)
4. **Social Proof**: Beta user testimonials, stats (500+ users, 4.9★)
5. **Clear Value**: Solve real problem (8-month wait → 3-day appointment)

---

## ⚠️ Common Mistakes to Avoid

❌ **Launching on Friday** (low traffic, weekend kills momentum)
❌ **No hunter** without self-hunt strategy (product won't appear)
❌ **Asking for upvotes** (against PH rules, looks desperate)
❌ **Slow responses** (>1 hour = death, community moves on)
❌ **Bad first comment** (generic, salesy = turn-off)
❌ **Not testing** (broken links, crashed extension = disaster)
❌ **Giving up early** (momentum builds throughout day)

---

## 💡 Pro Tips

✅ **Post first comment in <5 min** (shows you're engaged, sets narrative)
✅ **Use real data** (15 slots found, 500 beta users, 4.9★ rating)
✅ **Show, don't tell** (promo video > long description)
✅ **Engage with other products** (builds karma, visibility)
✅ **Thank everyone** (individually, genuinely)
✅ **Celebrate small wins** ("We're #5!" = momentum builder)
✅ **Stay calm** (issues happen, transparency > panic)

---

## 🆘 Emergency Contacts

**If something breaks on launch day:**

1. **Extension crashes**: Post transparent update in PH comments, fix ASAP
2. **Chrome Store link broken**: Update landing page immediately, post correction
3. **Stripe checkout fails**: Check logs, post workaround
4. **Negative viral comment**: Respond calmly with facts (see templates)
5. **Competitor launches same day**: Stay positive, focus on differentiation

**Team Lead**: [Your contact info]

---

## 📚 Additional Resources

**Product Hunt Guides**:
- Official Launch Guide: https://www.producthunt.com/launch
- Media Specs: https://help.producthunt.com/en/articles/2911750

**Similar Launches (Study These)**:
- Search PH for "appointment" or "notification" products
- Analyze top comments, taglines, gallery images
- See what worked (and what didn't)

**Communities**:
- r/ProductHunt (Reddit)
- Indie Hackers (Product Hunt forum)
- Maker communities on Twitter

---

## 🎉 Post-Launch (Week 1)

### Immediate (Day 2-3)
- [ ] Respond to any remaining comments
- [ ] Thank supporters individually
- [ ] Fix any reported bugs
- [ ] Write launch retrospective blog post

### Week 1
- [ ] Analyze metrics (use `ANALYTICS_TRACKING_SETUP.md`)
- [ ] Collect user feedback
- [ ] Ship quick wins (small features requested)
- [ ] Share results on Twitter (case study)
- [ ] Submit retrospective to Hacker News, r/SideProject

### Week 2+
- [ ] Reach out to press (if strong results)
- [ ] Plan next feature release
- [ ] Build on momentum (SEO, content, communities)
- [ ] Hit $1K MRR milestone

---

## ✨ Final Pep Talk

**You've got this!**

Launching on Product Hunt is intense but incredibly rewarding. You'll:
- Get real users in 24 hours
- Receive invaluable feedback
- Build your personal brand
- Generate revenue (with PRODUCTHUNT code)
- Create a case study for future marketing

**The key**: Be genuine, helpful, and responsive. Product Hunt rewards makers who care about their community.

**Remember**: The goal isn't just #1 Product of the Day (though that's nice). It's building relationships with early users who will become your advocates.

**See you on the homepage!** 🚀

---

**Questions?**
- Open issue: github.com/caffeineGMT/nexus-alert/issues
- Email: support@nexusalert.com

**Good luck!**
