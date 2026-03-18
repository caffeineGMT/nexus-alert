# Discord Community Launch Checklist

## Pre-Launch (Week Before)

### Discord Server Setup
- [ ] Create Discord server "NEXUS Alert Insiders"
- [ ] Upload server icon from `/store-assets/icon-128.png`
- [ ] Create channels:
  - [ ] #welcome
  - [ ] #announcements
  - [ ] #appointment-wins
  - [ ] #tips-and-tricks
  - [ ] #feature-requests
  - [ ] #general
  - [ ] #support
- [ ] Create roles:
  - [ ] @Insider (color: #3b82f6)
  - [ ] @Founding 100 (color: #eab308)
  - [ ] @Moderator (color: #22c55e)
  - [ ] @Team (color: #ef4444)
- [ ] Set permissions (only @Team/@Moderator can post in #announcements)
- [ ] Create server invite link (never expires, unlimited uses)
- [ ] Write welcome message in #welcome

### Discord Bot
- [ ] Create Discord application at https://discord.com/developers
- [ ] Add bot to application
- [ ] Copy bot token → save as `DISCORD_BOT_TOKEN`
- [ ] Enable SERVER MEMBERS INTENT
- [ ] Enable MESSAGE CONTENT INTENT
- [ ] Generate OAuth2 URL with bot scope + permissions
- [ ] Invite bot to server
- [ ] Get role IDs (right-click → Copy ID):
  - [ ] @Insider role ID → `DISCORD_INSIDER_ROLE_ID`
  - [ ] @Founding 100 role ID → `DISCORD_FOUNDING100_ROLE_ID`
- [ ] Get channel IDs:
  - [ ] #general → `DISCORD_GENERAL_CHANNEL_ID`
  - [ ] #announcements → `DISCORD_ANNOUNCEMENTS_CHANNEL_ID`
- [ ] Get guild ID → `DISCORD_GUILD_ID`

### Webhook
- [ ] Right-click #announcements → Edit Channel → Integrations → Webhooks
- [ ] Create webhook "NEXUS Alert Announcements"
- [ ] Copy webhook URL → save as `DISCORD_WEBHOOK_URL`
- [ ] Test webhook with curl

### Stripe
- [ ] Create coupon "FOUNDING100" (20% off forever, max 100 redemptions)
- [ ] Verify coupon ID matches `STRIPE_FOUNDING100_COUPON_ID`

### Backend Deployment
- [ ] Add Discord env vars to `/backend/.dev.vars`
- [ ] Set Cloudflare Workers secrets:
  ```bash
  cd backend
  npx wrangler secret put DISCORD_BOT_TOKEN
  npx wrangler secret put DISCORD_WEBHOOK_URL
  npx wrangler secret put DISCORD_INVITE_URL
  ```
- [ ] Update `wrangler.toml` with Discord config
- [ ] Deploy backend: `npx wrangler deploy`

### Testing
- [ ] Test premium signup → Discord webhook posts
- [ ] Test Discord invite link → bot assigns @Insider role
- [ ] Test Founding 100: first 100 users get coupon + @Founding 100 role
- [ ] Test referral flow: click → signup → conversion → free month
- [ ] Test weekly tip posting (manual trigger)

---

## Launch Day

### Morning (9 AM PT)
- [ ] Send email to all existing premium users:
  - Subject: "You're Invited: NEXUS Alert Insiders Community"
  - Include Discord invite link
  - Mention Founding 100 (first 100 get lifetime 20% off)
- [ ] Post announcement in #announcements:
  - "Welcome to NEXUS Alert Insiders! 🎉"
  - Explain community benefits
  - Tag @everyone

### Afternoon (2 PM PT)
- [ ] Post on Twitter:
  ```
  🎉 Introducing NEXUS Alert Insiders — exclusive Discord for premium users!

  ✅ Early access to features
  ✅ Tips from travelers
  ✅ Direct founder support
  ✅ Celebrate wins together

  First 100 members get lifetime 20% off. Join: [link]
  ```
- [ ] Post on Reddit (r/NEXUS, r/GlobalEntry):
  - Share community benefits
  - Include Discord invite link
  - Mention Founding 100 gamification

### Evening (6 PM PT)
- [ ] Check #support for questions → respond within 1 hour
- [ ] Celebrate first 10 members in #general
- [ ] Post first weekly tip in #tips-and-tricks

---

## Week 1: Seeding

### Daily Tasks
- [ ] Respond to all #support messages within 24 hours
- [ ] React 🎉 to all posts in #appointment-wins
- [ ] Post in #general at least once per day (stay visible)
- [ ] Welcome new members personally

### Weekly Tasks
- [ ] **Monday:** Post weekly tip (Week 1: Best Times to Check)
- [ ] **Wednesday:** Community spotlight (interview 1-2 members)
- [ ] **Friday:** Feature preview (upcoming features)
- [ ] **Weekend:** Check referral leaderboard, send congrats to top 3

### Milestones
- [ ] 10 members → Post celebration in #announcements
- [ ] 25 members → Thank you message + milestone graphic
- [ ] 50 members → Discord webhook notification + @everyone
- [ ] 100 members → Founding 100 CLOSED, celebrate 🏆

---

## Week 2-4: Growth

### Content Schedule

**Week 2:**
- [ ] Monday: Weekly Tip #2 (Enrollment Center Selection)
- [ ] Wednesday: Member spotlight (share appointment win screenshot)
- [ ] Friday: Feature preview (show upcoming feature screenshot)

**Week 3:**
- [ ] Monday: Weekly Tip #3 (What to Do When Slot Appears)
- [ ] Wednesday: Referral leaderboard (top 5 referrers)
- [ ] Friday: Product roadmap update

**Week 4:**
- [ ] Monday: Weekly Tip #4 (Date Range Filters)
- [ ] Wednesday: Testimonial spotlight (post user quote)
- [ ] Friday: Feature release announcement

### Engagement Tactics
- [ ] Ask questions in #general to spark conversation
- [ ] Run polls (favorite enrollment center, appointment tips)
- [ ] Host optional voice chat "office hours" (30 min Friday)
- [ ] Share data insights (most common appointment times)

### Referral Push
- [ ] Email reminder: "Invite a friend → Get 1 month free"
- [ ] Post leaderboard in Discord every Friday
- [ ] DM top referrers: "You're in the top 3! Keep sharing!"

---

## Week 5-8: Scale to 200 Members

### Automation
- [ ] Set up cron job for weekly tips (Monday 9 AM PT)
- [ ] Automate monthly leaderboard posting (last Friday)
- [ ] Create Discord bot slash commands:
  - [ ] `/stats` - Show your referral stats
  - [ ] `/leaderboard` - Show top 10 referrers
  - [ ] `/wins` - Count of appointment wins this month

### Testimonial Collection
- [ ] Ask members in #appointment-wins for testimonials
- [ ] Create Google Form for testimonial submissions
- [ ] Add 5 new testimonials to landing page

### Retention
- [ ] Track weekly active members (goal: 50)
- [ ] DM inactive members: "Haven't seen you in #general, everything OK?"
- [ ] Recognize top contributors (most helpful in #support)

### Metrics Review (End of Week 8)
- [ ] Total members: ____ / 200 goal
- [ ] Weekly active: ____ / 50 goal
- [ ] Referral rate: ____ / 50% goal
- [ ] Testimonials collected: ____ / 20 goal
- [ ] Premium churn (Discord vs non-Discord): ____

---

## Emergency Scenarios

### Bot Goes Down
1. Check Cloudflare Workers logs: `npx wrangler tail`
2. Verify bot token is correct: `echo $DISCORD_BOT_TOKEN`
3. Test bot manually with curl
4. Restart worker: `npx wrangler deploy`

### Webhook Stops Posting
1. Check webhook URL: `echo $DISCORD_WEBHOOK_URL`
2. Test with curl (see deployment guide)
3. Recreate webhook in Discord if deleted
4. Update env var and redeploy

### Spam Attack
1. Enable slow mode in #general (30 seconds between messages)
2. Ban spammer (right-click → Ban → Delete 7 days of messages)
3. Temporarily restrict @everyone from posting
4. Review moderation logs

### Negative Feedback in #support
1. Respond publicly within 1 hour
2. Acknowledge issue, apologize if needed
3. Move to DM for resolution
4. Follow up in #support when resolved

---

## Success Criteria

At the end of 60 days, we should have:
- ✅ 200+ total members
- ✅ 50+ weekly active members
- ✅ 50% of members have referred at least 1 friend
- ✅ 20+ testimonials collected
- ✅ <5% premium churn for Discord members (vs. 10% non-Discord)

**If all criteria met:** Community is a success! Keep scaling.

**If criteria not met:** Review what went wrong:
- Low total members → Increase referral incentives
- Low weekly active → Post more engaging content
- Low referral rate → Make referral link more prominent
- Low testimonials → Ask more directly in #appointment-wins
- High churn → Improve community experience (more support, faster responses)

---

## Resources

- **Setup Guide:** `/docs/DISCORD_COMMUNITY_SETUP.md`
- **Deployment Guide:** `/docs/COMMUNITY_DEPLOYMENT_GUIDE.md`
- **Build Summary:** `/COMMUNITY_BUILD_SUMMARY.md`
- **Discord Developer Portal:** https://discord.com/developers
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Cloudflare Workers:** https://dash.cloudflare.com

---

**Launch Date:** _________
**Founding 100 Closes:** _________ (when 100 premium members join Discord)
**60-Day Review Date:** _________

Good luck! 🚀
