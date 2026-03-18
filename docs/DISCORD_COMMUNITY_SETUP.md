# NEXUS Alert Insiders - Discord Community Setup

## Overview

**NEXUS Alert Insiders** is an exclusive Discord community for premium users. It serves as a customer retention tool, feedback channel, testimonial source, and referral engine.

**Target:** 200 active members within 60 days, 50% refer at least 1 friend.

---

## Part 1: Discord Server Setup

### 1.1 Create Server

1. Open Discord → Click "+" → "Create My Own" → "For a club or community"
2. Server Name: **NEXUS Alert Insiders**
3. Upload Server Icon: Use `/store-assets/icon-128.png`

### 1.2 Create Channels

**Text Channels:**
- `#welcome` - Auto-message with community rules and benefits
- `#announcements` - Feature updates, maintenance notices (admin-only posting)
- `#appointment-wins` - Members share screenshots of booked appointments
- `#tips-and-tricks` - Best practices for using NEXUS Alert
- `#feature-requests` - Direct feedback pipeline to founder
- `#general` - Open discussion
- `#support` - Technical help (monitored by founder)

**Voice Channels:**
- `Community Hangout` - Optional casual chat

### 1.3 Server Settings

**Verification Level:** Medium (verified email required)
**Explicit Content Filter:** Scan all messages
**Default Notification:** Only @mentions

**Roles:**
- `@Insider` - All premium members (auto-assigned via bot)
- `@Founding 100` - First 100 members (manual assignment, lifetime 20% discount)
- `@Moderator` - Community moderators
- `@Team` - Founder/staff

**Permissions:**
- Only `@Team` and `@Moderator` can post in `#announcements`
- Everyone can post in other channels
- `@Founding 100` gets special color and badge

### 1.4 Welcome Message Template

Create auto-welcome message in `#welcome`:

```
Welcome to NEXUS Alert Insiders, @username! 🎉

You're now part of an exclusive community of premium users who are serious about securing their Trusted Traveler appointments.

**Your Benefits:**
✅ First access to new features (beta testing)
✅ Direct line to the founder for feedback
✅ Appointment tips from fellow travelers
✅ Celebrate wins - share your appointment confirmations!

**Quick Start:**
1. Introduce yourself in #general
2. Share your NEXUS/Global Entry journey
3. Post your first appointment win in #appointment-wins when you book!

**Need Help?**
- Technical issues → #support
- Feature ideas → #feature-requests
- General questions → #general

Let's help each other get those appointments! 🚀
```

---

## Part 2: Discord Bot Integration

### 2.1 Create Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" → Name: "NEXUS Alert Bot"
3. Go to "Bot" tab → Click "Add Bot" → Confirm
4. **Save Bot Token** (keep secure, needed for backend integration)
5. Enable "SERVER MEMBERS INTENT" and "MESSAGE CONTENT INTENT"

### 2.2 Invite Bot to Server

1. Go to OAuth2 → URL Generator
2. Select Scopes: `bot`
3. Select Bot Permissions:
   - Send Messages
   - Embed Links
   - Attach Files
   - Read Message History
   - Manage Roles
4. Copy generated URL → Open in browser → Select server → Authorize

### 2.3 Bot Functionality (Backend Integration)

The bot will:
- **Auto-assign `@Insider` role** when premium user joins (via backend webhook)
- **Post welcome message** in #general when new member joins
- **Track referrals** (via custom slash command `/referral-stats`)
- **Send weekly tips** (automated cron job posts in #tips-and-tricks)

Bot code location: `/backend/src/discord-bot/`

---

## Part 3: Discord Webhook for Notifications

### 3.1 Create Webhook for #announcements

1. Right-click `#announcements` → Edit Channel → Integrations → Webhooks
2. Click "New Webhook" → Name: "NEXUS Alert Updates"
3. **Copy Webhook URL** (save to environment variable `DISCORD_WEBHOOK_URL`)

### 3.2 Webhook Use Cases

- New feature releases
- Premium plan updates
- Maintenance notifications
- Community milestones (e.g., "200 members reached!")

---

## Part 4: Gamification - Founding 100 Members

### 4.1 Lifetime 20% Discount

**Offer:** First 100 premium subscribers get **20% off for life**

**Implementation:**
1. Track member count in Stripe metadata: `discord_member_number`
2. Members 1-100 get coupon code `FOUNDING100` applied automatically
3. Stripe subscription includes `discount: { coupon: 'FOUNDING100' }`
4. Display "Founding 100" badge in Discord (custom role with color)

**Pricing:**
- Monthly: $4.99 → **$3.99/mo** (Founding 100)
- Annual: $49.99 → **$39.99/year** (Founding 100)

### 4.2 Member Number Assignment

When user upgrades to premium:
1. Backend queries Stripe for total premium customer count
2. If count ≤ 100, assign `discord_member_number` in Stripe metadata
3. Send Discord invite link with `?member=XX` parameter
4. Bot reads parameter and assigns `@Founding 100` role

---

## Part 5: Referral Tracking System

### 5.1 Referral Flow

1. **Member gets unique referral code** (e.g., `JOHN-XY12`)
2. **Share link:** `https://nexusalert.app/?ref=JOHN-XY12`
3. **Friend installs extension** → referral code saved in localStorage
4. **Friend upgrades to premium** → referral credited to member
5. **Reward:** Referrer gets **1 month free** per successful referral

### 5.2 Referral Leaderboard

Post monthly leaderboard in #announcements:

```
🏆 **Top Referrers This Month**

1. @john_doe - 12 referrals → 1 year free!
2. @jane_smith - 8 referrals → 8 months free
3. @mike_wilson - 5 referrals → 5 months free

Keep sharing! Every premium referral = 1 month free for you. 🚀
```

### 5.3 Implementation

Referral tracking stored in:
- `backend/src/referrals.ts` - Referral code generation and validation
- Stripe metadata: `referred_by` field on Customer object
- Backend DB table: `referrals` (referrer_email, referee_email, status, created_at)

---

## Part 6: Weekly Content Calendar

### 6.1 Posting Schedule

**Monday (Weekly Tip):**
- Best times to check for appointments
- Enrollment center recommendations
- Extension settings optimization

**Wednesday (Community Spotlight):**
- Feature user success stories
- Interview long-time members
- Share appointment win screenshots

**Friday (Feature Preview):**
- Upcoming features (screenshots/demos)
- Beta testing opportunities
- Feedback requests

**Template for Weekly Tip:**
```
💡 **Weekly NEXUS Tip - Week of [Date]**

**This Week's Topic:** Best Times to Check for Appointments

Based on data from 10,000+ monitored slots, here's when appointments appear most often:

📅 **Days:** Tuesday & Thursday (3x more likely than weekends)
⏰ **Times:** 9-11 AM EST, 2-4 PM EST (office hours = cancellations)
📍 **Locations:** Blaine, WA and Champlain, NY see most activity

**Pro Tip:** Set your NEXUS Alert to check every 2 minutes during these windows for best results.

Have you noticed patterns? Share in #general!
```

### 6.2 Content Sources

1. **Data from backend analytics** (appointment patterns)
2. **User testimonials** (from #appointment-wins)
3. **Support tickets** (common questions → tips)
4. **Feature announcements** (product roadmap)

---

## Part 7: Moderation Guidelines

### 7.1 Community Rules

Post in #welcome:

**Community Rules:**
1. ✅ Be respectful and helpful
2. ✅ Share wins and tips openly
3. ✅ Provide constructive feedback
4. ❌ No spam or self-promotion
5. ❌ No sharing of illegal appointment booking methods
6. ❌ No personal attacks or harassment

**Violations:** Warning → Temp ban → Permanent ban

### 7.2 Daily Moderation Tasks (15 min/day)

- [ ] Check #support for urgent issues → respond or escalate
- [ ] Review #feature-requests → tag promising ideas
- [ ] Celebrate #appointment-wins → react with 🎉
- [ ] Scan #general for spam/violations
- [ ] Post in at least one channel daily (stay visible)

### 7.3 Founder Presence

- **Daily check-ins:** Respond to @mentions within 24 hours
- **Weekly posts:** At least 3 posts/week across channels
- **Office hours:** Optional weekly voice chat (30 min)

---

## Part 8: Cross-Promotion

### 8.1 Extension Integration

**Location:** Settings page in popup.html

Add banner:
```
🎉 Join NEXUS Alert Insiders
Get early access to features, tips from the community, and direct support.
[Join Discord Community →]
```

### 8.2 Landing Page Integration

**Location:** Below pricing section

Add section:
```html
<section class="community-section">
  <h2>Join 200+ Insiders</h2>
  <p>Premium members get access to our exclusive Discord community</p>
  <ul>
    <li>First access to new features</li>
    <li>Appointment tips from fellow travelers</li>
    <li>Direct line to the founder</li>
    <li>Celebrate wins together</li>
  </ul>
  <button>Upgrade to Premium → Join Community</button>
</section>
```

### 8.3 Email Drip Campaign

**Email 3 (Day 7 after signup):**
Subject: "You're invited to NEXUS Alert Insiders"

Body:
```
Hi {name},

You're now part of an exclusive group: premium NEXUS Alert users.

I'd love to invite you to our Discord community - NEXUS Alert Insiders. It's where our most engaged users:
- Get early access to new features
- Share appointment tips and wins
- Give direct feedback to shape the product

[Join Discord Community]

P.S. - The first 100 members get a special "Founding 100" role and lifetime 20% discount. Spots are filling up fast!

- Michael
Founder, NEXUS Alert
```

---

## Part 9: Testimonial Collection

### 9.1 Win Screenshot Channel

Encourage users to post in #appointment-wins:

**Prompt:**
```
🎯 Booked your appointment? Share your win!

Post a screenshot (blur personal info) and tell us:
- How long were you waiting?
- How fast did NEXUS Alert notify you?
- Which enrollment center?

Best stories get featured on our website!
```

### 9.2 Testimonial Request Flow

1. User posts in #appointment-wins
2. Founder reacts with 🎉 and replies: "Amazing! Can we feature this on our website?"
3. If yes, DM user for:
   - Full name (or "Anonymous")
   - Photo (optional)
   - Detailed quote
4. Add to `/web/src/app/components/Testimonials.tsx`

---

## Part 10: Success Metrics & KPIs

### 10.1 Track Weekly

- **Member count:** Goal = 200 in 60 days (3-4 new members/day)
- **Active members:** Weekly message count, unique posters
- **Referral rate:** % of members who refer at least 1 friend
- **Retention:** Premium churn rate (Discord vs. non-Discord users)
- **Testimonials:** New testimonials collected per week

### 10.2 Dashboard

Create Notion/Airtable dashboard tracking:

| Metric | Current | Goal | Status |
|--------|---------|------|--------|
| Total Members | 0 | 200 | 🔴 |
| Founding 100 Filled | 0 | 100 | 🔴 |
| Referral Rate | 0% | 50% | 🔴 |
| Weekly Active | 0 | 50 | 🔴 |
| Testimonials Collected | 0 | 20 | 🔴 |

---

## Part 11: Launch Checklist

**Week 1: Setup**
- [ ] Create Discord server
- [ ] Set up channels and roles
- [ ] Create welcome message
- [ ] Build Discord bot (basic version)
- [ ] Set up webhook for announcements

**Week 2: Integration**
- [ ] Add "Join Community" button to extension popup
- [ ] Add community section to landing page
- [ ] Integrate referral tracking in backend
- [ ] Create Stripe coupon: `FOUNDING100` (20% off forever)
- [ ] Test full flow: signup → payment → Discord invite

**Week 3: Content**
- [ ] Write first 4 weeks of weekly tips
- [ ] Create moderation guidelines document
- [ ] Prepare launch announcement (email + blog post)
- [ ] Seed with 20 beta users from email list

**Week 4: Launch**
- [ ] Send launch email to all premium users
- [ ] Post announcement on Product Hunt / Reddit
- [ ] Monitor daily, respond to all messages
- [ ] Post first weekly tip

---

## Environment Variables

Add to backend `.env`:

```bash
# Discord Integration
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_GUILD_ID=your_server_id_here
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
DISCORD_INVITE_URL=https://discord.gg/your_invite_code

# Stripe Founding 100 Coupon
STRIPE_FOUNDING_100_COUPON_ID=FOUNDING100
```

---

## Support Resources

- **Discord Developer Portal:** https://discord.com/developers/applications
- **Discord.js Documentation:** https://discord.js.org/
- **Stripe Coupons API:** https://stripe.com/docs/api/coupons
- **Discord Community Best Practices:** https://discord.com/community

---

**Questions?** Ping @michaelguo or open issue in GitHub repo.
