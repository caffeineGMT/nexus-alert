# Discord Community Deployment Guide

## Quick Start Checklist

- [ ] Create Discord server (see [DISCORD_COMMUNITY_SETUP.md](./DISCORD_COMMUNITY_SETUP.md))
- [ ] Create Discord bot and get bot token
- [ ] Create webhook for announcements
- [ ] Set up environment variables
- [ ] Create Stripe Founding 100 coupon
- [ ] Deploy backend with Discord integration
- [ ] Test full flow: signup → Discord invite → role assignment
- [ ] Seed with 20 beta users
- [ ] Launch announcement

---

## Part 1: Discord Server Setup

### 1.1 Create Server

1. Open Discord → Click "+" → "Create My Own" → "For a club or community"
2. Server Name: **NEXUS Alert Insiders**
3. Upload icon from `/store-assets/icon-128.png`

### 1.2 Create Channels

**Text Channels:**
- `#welcome` - Welcome message and rules
- `#announcements` - Feature updates (admin-only posting)
- `#appointment-wins` - Members share booking screenshots
- `#tips-and-tricks` - Best practices
- `#feature-requests` - Feedback pipeline
- `#general` - Open discussion
- `#support` - Technical help

**Voice Channels:**
- `Community Hangout` - Optional casual chat

### 1.3 Create Roles

1. Right-click server → Server Settings → Roles
2. Create roles:
   - `@Insider` (color: #3b82f6) - All premium members
   - `@Founding 100` (color: #eab308) - First 100 members
   - `@Moderator` (color: #22c55e) - Community moderators
   - `@Team` (color: #ef4444) - Founder/staff

3. Set permissions:
   - Only `@Team` and `@Moderator` can post in `#announcements`
   - All roles can post in other channels
   - `@Founding 100` gets hoisted (shows separately in member list)

### 1.4 Create Server Invite

1. Right-click `#welcome` → Invite People → Edit Invite Link
2. Set expiration: Never
3. Set max uses: Unlimited
4. Copy invite link: `https://discord.gg/YOUR_INVITE_CODE`
5. Save to `.env` as `DISCORD_INVITE_URL`

---

## Part 2: Discord Bot Setup

### 2.1 Create Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" → Name: "NEXUS Alert Bot"
3. Go to "Bot" tab → Click "Add Bot" → Confirm
4. **Copy Bot Token** → Save to `.env` as `DISCORD_BOT_TOKEN`
5. Enable Intents:
   - ✅ SERVER MEMBERS INTENT
   - ✅ MESSAGE CONTENT INTENT
6. Save changes

### 2.2 Invite Bot to Server

1. Go to OAuth2 → URL Generator
2. Select Scopes: `bot`
3. Select Bot Permissions:
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Attach Files
   - ✅ Read Message History
   - ✅ Manage Roles
   - ✅ Kick Members (for subscription cancellations)
4. Copy generated URL → Open in browser → Select your server → Authorize

### 2.3 Get Role IDs and Channel IDs

1. Enable Developer Mode: Discord Settings → Advanced → Developer Mode
2. Right-click `@Insider` role → Copy ID → Save as `DISCORD_INSIDER_ROLE_ID`
3. Right-click `@Founding 100` role → Copy ID → Save as `DISCORD_FOUNDING100_ROLE_ID`
4. Right-click `#general` channel → Copy ID → Save as `DISCORD_GENERAL_CHANNEL_ID`
5. Right-click `#announcements` channel → Copy ID → Save as `DISCORD_ANNOUNCEMENTS_CHANNEL_ID`
6. Right-click server icon → Copy ID → Save as `DISCORD_GUILD_ID`

---

## Part 3: Discord Webhook Setup

### 3.1 Create Webhook

1. Right-click `#announcements` → Edit Channel → Integrations
2. Click "Webhooks" → "New Webhook"
3. Name: "NEXUS Alert Announcements"
4. Copy Webhook URL → Save to `.env` as `DISCORD_WEBHOOK_URL`

### 3.2 Test Webhook

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "embeds": [{
      "title": "Test Notification",
      "description": "Discord webhook is working!",
      "color": 3447003
    }]
  }'
```

You should see a message appear in `#announcements`.

---

## Part 4: Stripe Founding 100 Coupon

### 4.1 Create Coupon

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/coupons)
2. Click "Create coupon"
3. Settings:
   - **ID:** `FOUNDING100`
   - **Type:** Percentage discount
   - **Amount:** 20% off
   - **Duration:** Forever
   - **Max redemptions:** 100
4. Click "Create coupon"

### 4.2 Verify Coupon

```bash
curl https://api.stripe.com/v1/coupons/FOUNDING100 \
  -u "sk_test_YOUR_SECRET_KEY:"
```

---

## Part 5: Environment Variables

Add to `/backend/.dev.vars` (local) and Cloudflare Workers secrets (production):

```bash
# Discord Configuration
DISCORD_BOT_TOKEN=MTIzNDU2Nzg5MDEyMzQ1Njc4.GaBcDe.FgHiJkLmNoPqRsTuVwXyZ
DISCORD_GUILD_ID=1234567890123456789
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/1234567890/AbCdEfGhIjKlMnOpQrStUvWxYz
DISCORD_INVITE_URL=https://discord.gg/nexus-alert-insiders
DISCORD_INSIDER_ROLE_ID=1234567890123456789
DISCORD_FOUNDING100_ROLE_ID=1234567890123456789
DISCORD_GENERAL_CHANNEL_ID=1234567890123456789
DISCORD_ANNOUNCEMENTS_CHANNEL_ID=1234567890123456789

# Stripe Founding 100
STRIPE_FOUNDING100_COUPON_ID=FOUNDING100

# Existing Stripe vars
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

To set Cloudflare Workers secrets:

```bash
cd backend
npx wrangler secret put DISCORD_BOT_TOKEN
npx wrangler secret put DISCORD_WEBHOOK_URL
npx wrangler secret put DISCORD_INVITE_URL
```

---

## Part 6: Deploy Backend

### 6.1 Update wrangler.toml

Add to `/backend/wrangler.toml`:

```toml
[env.production]
name = "nexus-alert-api"
compatibility_date = "2024-01-01"

[[env.production.kv_namespaces]]
binding = "KV"
id = "your_kv_namespace_id"

[env.production.vars]
DISCORD_GUILD_ID = "1234567890123456789"
DISCORD_INSIDER_ROLE_ID = "1234567890123456789"
DISCORD_FOUNDING100_ROLE_ID = "1234567890123456789"
DISCORD_GENERAL_CHANNEL_ID = "1234567890123456789"
```

### 6.2 Deploy

```bash
cd backend
npm install
npx wrangler deploy
```

---

## Part 7: Test End-to-End Flow

### 7.1 Test Premium Signup

1. Go to `https://nexus-alert.com`
2. Click "Upgrade to Premium"
3. Enter test email: `test+founding1@example.com`
4. Complete Stripe checkout (use test card: `4242 4242 4242 4242`)
5. Check:
   - ✅ Email received with Discord invite link
   - ✅ Discord webhook posted in `#announcements`
   - ✅ User count incremented in KV

### 7.2 Test Discord Invite

1. Click Discord invite link from email
2. Join server
3. Check:
   - ✅ Bot assigns `@Insider` role
   - ✅ Bot assigns `@Founding 100` role (if count ≤ 100)
   - ✅ Welcome message posted in `#general`

### 7.3 Test Referral Flow

1. Premium user gets referral link: `https://nexus-alert.com?ref=ABCD1234`
2. Friend clicks link → localStorage stores `ref=ABCD1234`
3. Friend upgrades to premium
4. Check:
   - ✅ Referrer's conversion count incremented
   - ✅ Discord webhook posted: "Referral converted!"
   - ✅ Referrer's subscription credited 1 free month

---

## Part 8: Seed with Beta Users

### 8.1 Prepare Beta List

Create `/backend/beta-users.json`:

```json
[
  { "email": "user1@example.com", "name": "John Doe" },
  { "email": "user2@example.com", "name": "Jane Smith" },
  ...
]
```

### 8.2 Send Invites

```bash
cd backend
node scripts/send-beta-invites.js
```

This script:
1. Creates Stripe customer for each user
2. Applies Founding 100 coupon
3. Sends email with Discord invite
4. Posts announcement in Discord

---

## Part 9: Launch Announcement

### 9.1 Email Existing Premium Users

Subject: "You're Invited: NEXUS Alert Insiders Community"

```
Hi {name},

Big news! We just launched the NEXUS Alert Insiders Discord community.

As a premium member, you're automatically invited. This is where we:
- Share appointment tips and tricks
- Celebrate wins together
- Give early access to new features
- Provide direct support

Join now: {discord_invite_url}

P.S. - First 100 members get a special Founding 100 badge and lifetime 20% discount. Don't miss out!

- Michael
Founder, NEXUS Alert
```

### 9.2 Post on Landing Page

Update `/web/src/app/page.tsx` to highlight the community (already done).

### 9.3 Post on Social Media

**Twitter:**
```
🎉 Introducing NEXUS Alert Insiders — an exclusive Discord community for premium users!

✅ Early access to features
✅ Appointment tips from travelers
✅ Direct founder support
✅ Celebrate wins together

First 100 members get lifetime 20% off. Join now: [link]
```

**Reddit (r/NEXUS, r/GlobalEntry):**
```
I built NEXUS Alert (Chrome extension for appointment monitoring) and just launched a Discord community for premium users. If you're interested in appointment hunting tips, feature previews, and connecting with other travelers, check it out: [link]

First 100 members get 20% off forever.
```

---

## Part 10: Weekly Maintenance

### 10.1 Daily Tasks (15 min)

- [ ] Check `#support` for urgent issues → respond within 24 hours
- [ ] Review `#feature-requests` → tag promising ideas
- [ ] Celebrate `#appointment-wins` → react with 🎉
- [ ] Scan `#general` for spam/violations
- [ ] Post in at least one channel (stay visible)

### 10.2 Weekly Tasks (30 min)

- [ ] Post weekly tip (Monday morning)
- [ ] Update leaderboard (Friday afternoon)
- [ ] Review referral stats
- [ ] Check for milestone notifications (50, 100, 200 members)
- [ ] Collect 1-2 testimonials from `#appointment-wins`

### 10.3 Monthly Tasks (1 hour)

- [ ] Review moderation logs
- [ ] Update FAQ based on common questions in `#support`
- [ ] Post monthly recap (members joined, features shipped, wins celebrated)
- [ ] Plan next month's content calendar
- [ ] Send survey to measure community health (NPS)

---

## Troubleshooting

### Bot Not Assigning Roles

1. Check bot has "Manage Roles" permission
2. Verify bot's role is higher than `@Insider` in role hierarchy
3. Check `DISCORD_INSIDER_ROLE_ID` is correct
4. View logs: `npx wrangler tail`

### Webhook Not Posting

1. Verify webhook URL is correct: `echo $DISCORD_WEBHOOK_URL`
2. Check webhook hasn't been deleted in Discord
3. Test webhook manually with curl (see Part 3.2)
4. Check Cloudflare Workers logs for errors

### Founding 100 Coupon Not Applied

1. Check coupon exists: Stripe Dashboard → Coupons
2. Verify coupon ID matches `.env`: `STRIPE_FOUNDING100_COUPON_ID`
3. Check max redemptions hasn't been reached (100)
4. Review checkout session in Stripe Dashboard → Payments

### User Count Desync

If KV count doesn't match actual premium users:

```bash
# Reset count to match Stripe
npx wrangler kv:key put --binding=KV premium_user_count "X"
```

---

## Success Metrics

Track these metrics weekly in a dashboard (Notion/Airtable):

| Metric | Week 1 | Week 2 | Week 4 | Week 8 | Goal (60 days) |
|--------|--------|--------|--------|--------|----------------|
| Total Members | | | | | 200 |
| Weekly Active | | | | | 50 |
| Referral Rate | | | | | 50% |
| Testimonials | | | | | 20 |
| Churn (Discord vs Non-Discord) | | | | | <5% |

**Key Insight:** Track premium churn rate for Discord members vs. non-members. If Discord members have <50% churn, community is working.

---

## Next Steps

- [ ] Set up scheduled cron job for weekly tips (Cloudflare Workers cron trigger)
- [ ] Build Discord bot commands (`/stats`, `/referrals`, `/wins`)
- [ ] Create monthly leaderboard automation
- [ ] Build testimonial collection form (Google Form → Discord webhook)
- [ ] Add Discord member count to landing page (live counter)

---

**Questions?** Open an issue in the repo or ping @michaelguo.
