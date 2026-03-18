# B2B Outreach Package - Immigration Lawyers
## Complete B2B Sales Toolkit for NEXUS Alert Agency Tier ($99/month)

**Created:** March 18, 2024
**Location:** `/marketing/b2b-tools/`
**Target:** 20 initial prospects → 1-2 paid customers within 30 days

---

## 📦 Package Contents

### 1. Email Templates (`email-templates.md`)
**Complete 7-template email sequence:**
- ✅ Template #1: Initial Cold Outreach - Pain point identification + value prop
- ✅ Template #2: Follow-Up #1 (Day 4) - ROI calculation + math breakdown
- ✅ Template #3: Case Study Follow-Up (Day 8) - Social proof + testimonial
- ✅ Template #4: Breakup Email (Day 15) - Final touchpoint + referral ask
- ✅ Template #5: Referral Request - Ask trial users for introductions
- ✅ Template #6: Reactivation Campaign - Re-engage inactive trial users
- ✅ Template #7: Pre-Trial-Expiration Upsell - Convert trials to paid

**Objection Handling Scripts:**
- "Too expensive" → ROI breakdown (saves $600/mo in labor)
- "We'll just use the free version" → 2-min vs 30-min intervals = 85% vs 10% slot capture
- "Can we just hire a VA?" → $600-800/mo VA vs $99/mo platform
- "We don't handle that many NEXUS cases" → Tiered response based on volume
- "How do I know this works?" → Trial + case studies + testimonials
- "What if your service goes down?" → 99.9% SLA + $10/missed slot credit

---

### 2. LinkedIn Outreach Sequence (`linkedin-outreach.md`)
**Complete LinkedIn playbook:**

**Connection Strategies:**
- ✅ No-note connection request (better acceptance rate)
- ✅ Post-connection icebreaker (immediate follow-up)
- ✅ Value-first connection request (use sparingly)

**4-Message Sequences:**
- **Sequence #1:** Problem-aware prospects (they handle NEXUS)
  - Day 0: Icebreaker + pain point identification
  - Day 3: Value prop + demo offer
  - Day 7: Case study + video walkthrough
  - Day 14: Breakup message

- **Sequence #2:** Problem-unaware prospects (not sure if relevant)
  - Day 0: Qualify their practice area
  - Day 4: Value prop (if qualified)
  - Day 8: Demo video
  - Day 15: Trial link

- **Sequence #3:** Referral requests (after demo/trial)
  - Day 1 post-demo: Ask for 2-3 referrals

**Content Strategy:**
- ✅ 4 content pillars for LinkedIn posts
- ✅ Weekly posting schedule to warm up audience
- ✅ Engagement tactics (comment → like → connect)

**LinkedIn Ads (Optional):**
- ✅ Sponsored content targeting
- ✅ Budget: $10-15/day
- ✅ Expected: 2-3 trials/week

**Sales Navigator Targeting:**
- ✅ Geographic filters (Vancouver, Seattle, Toronto, Buffalo, etc.)
- ✅ Job title filters (Immigration Attorney, Partner, Managing Partner)
- ✅ Company size filters (1-50 employees)
- ✅ Keyword filters (NEXUS, Global Entry, Trusted Traveler)

---

### 3. Target Prospect List (`target-prospects.md`)
**20 hand-picked immigration law firms:**

**VERY HIGH Priority (6 firms):**
1. ⭐ Mamann Sandaluk & Kingwell LLP (Vancouver) - Large multi-office firm
2. ⭐ Sound Immigration (Seattle) - Tahmina Watson, very active on LinkedIn
3. ⭐ Northwest Immigration Law Group (Bellingham) - 10 min from Blaine NEXUS
4. ⭐ Bellissimo Law Group (Toronto) - Largest firm, 20+ attorneys
5. ⭐ Ackah Business Immigration Law (Toronto) - Evelyn Ackah, influencer potential
6. ⭐ Hacking Law Practice (San Diego) - Jacob Sapochnick, large firm near busy NEXUS

**HIGH Priority (10 firms):**
7. Sas & Ing Immigration Law Centre (Vancouver)
8. Larlee Rosenberg (Vancouver)
9. Green & Spiegel LLP (Vancouver)
10. Keller Immigration Law (Seattle)
11. SGM Law Group (Seattle)
12. Capelle Kane Immigration Lawyers (Toronto)
13. Tsioulcas Law Office (Buffalo)
14. Watson Immigration Law (Buffalo)
15. Patel Law Offices (San Diego)
16. Shihab & Associates (Detroit)

**MEDIUM-HIGH Priority (4 firms):**
17. Elgin Grey LLP (Vancouver)
18. Chaudhary Law Office (Toronto)
19. Berger & Green Immigration Law (Buffalo)
20. Vargas Gonzalez Immigration Law (Detroit)

**Each prospect includes:**
- ✅ Firm name + location
- ✅ Decision-maker name + title
- ✅ Email format (to verify via Hunter.io)
- ✅ LinkedIn profile (research notes)
- ✅ Team size estimate
- ✅ Why target (pain point fit)
- ✅ Outreach priority level
- ✅ Strategic notes

---

### 4. Outreach Tracker (`outreach-tracker.csv`)
**CSV database tracking all 20 prospects:**

**Columns:**
- Prospect ID, Firm Name, Contact Name, Title, Location
- Email, LinkedIn URL, Phone, Website
- Priority (VERY HIGH, HIGH, MEDIUM-HIGH)
- Status (Not Contacted → Sent → Engaged → Demo → Trial → Paid)
- Email Sent Date, Email Template Used
- LinkedIn Connected, LinkedIn Message Sent
- Demo Scheduled Date, Trial Started Date, Trial End Date
- Paid Conversion Date
- Notes, Next Action, Next Action Date

**Status Progression:**
- Not Contacted → Sent → Connected → Engaged → Demo Scheduled → Trial Started → Paid
- Also: Not Interested (declined), No Response (completed sequence)

---

### 5. Outreach Manager Script (`outreach-manager.js`)
**Node.js automation tool for email campaigns:**

**Features:**
- ✅ Send email campaigns using Nodemailer (SMTP)
- ✅ Template selector (1-7)
- ✅ Priority filtering (send to VERY HIGH first)
- ✅ Batch limiting (send 5 emails at a time)
- ✅ Dry-run mode (preview before sending)
- ✅ Auto-update CSV tracker after send
- ✅ Rate limiting (2 seconds between emails)
- ✅ Email personalization (firstName, firmName, location)
- ✅ HTML formatting (bold text, line breaks)

**Usage Examples:**
```bash
# Dry run (preview only)
node outreach-manager.js --template 1 --priority "VERY HIGH" --dry-run

# Send first 5 follow-up emails
node outreach-manager.js --template 2 --limit 5

# Send case study to all eligible prospects
node outreach-manager.js --template 3

# Show help
node outreach-manager.js --help
```

**Environment Variables Required:**
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD
- SENDER_NAME, SENDER_EMAIL, SENDER_PHONE

**Campaign Summary Output:**
- Total processed, successful, failed
- Updates CSV tracker with send dates and next actions

---

## 📊 Expected Results (30-Day Campaign)

### Email Campaign Metrics
| Metric | Target | Formula |
|--------|--------|---------|
| Prospects contacted | 20 | All 20 firms |
| Email open rate | 30-40% | 6-8 opens |
| Reply rate | 5-10% | 1-2 replies |
| Engaged conversations | 8-10 | Email + LinkedIn combined |
| Demos scheduled | 4-5 | 50% of engaged |
| Trial signups | 2-3 | 50% of demos |
| Paid conversions (90 days) | 1 | 40-50% of trials |

### LinkedIn Campaign Metrics
| Metric | Target | Formula |
|--------|--------|---------|
| Connection requests sent | 20 | All 20 firms |
| Connections accepted | 8-10 | 40-50% acceptance |
| Messages sent | 10 | Post-connection icebreakers |
| Message responses | 2-4 | 20-30% response |
| Demos from LinkedIn | 1-2 | 10-15% of engaged |

### Combined Results (Email + LinkedIn)
- **Total engaged:** 10-12 prospects
- **Total demos:** 4-5 demos
- **Total trials:** 2-3 trials
- **Paid conversions (30 days):** 1 customer = **$99 MRR**
- **Paid conversions (90 days):** 2-3 customers = **$198-297 MRR**

---

## 🚀 4-Week Outreach Plan

### Week 1: Research & Initial Outreach
**Tasks:**
- ✅ Verify email addresses using Hunter.io (top 10 prospects)
- ✅ Research LinkedIn profiles (recent posts, mutual connections)
- ✅ Send Template #1 to VERY HIGH priority (6 emails)
- ✅ Send 10-15 LinkedIn connection requests (personalized)
- ✅ Engage with LinkedIn posts (like/comment before connecting)

**Goal:** 2-3 engaged conversations

---

### Week 2: Follow-Up Sequence
**Tasks:**
- ✅ Send Template #2 to non-responders (Day 4 follow-up)
- ✅ Send LinkedIn Message #1 to accepted connections
- ✅ Send Template #1 to HIGH priority prospects (10 emails)
- ✅ Respond to any replies within 24 hours
- ✅ Schedule demos with interested prospects

**Goal:** 4-5 engaged conversations, 1-2 demos scheduled

---

### Week 3: Case Studies & Demos
**Tasks:**
- ✅ Send Template #3 (case study) to non-responders (Day 8)
- ✅ Send LinkedIn Message #2 (demo offer) to engaged prospects
- ✅ Conduct demos (10-15 minute screen share)
- ✅ Follow up post-demo with trial links
- ✅ Send Template #1 to MEDIUM-HIGH priority (4 emails)

**Goal:** 2-3 demos completed, 1-2 trial signups

---

### Week 4: Breakup Emails & Conversion
**Tasks:**
- ✅ Send Template #4 (breakup email) to non-responders (Day 15)
- ✅ Send LinkedIn Message #4 (final outreach) to non-responders
- ✅ Follow up with trial users (check in after 7 days)
- ✅ Ask trial users for referrals (Template #5)
- ✅ Update tracker with all final statuses

**Goal:** 1 paid conversion, 2-3 active trials, 4-6 referrals for next batch

---

## 🎯 Success Metrics

### Primary KPIs
- **Outreach completion:** 20/20 prospects contacted ✅
- **Engagement rate:** 40-50% (email opens + LinkedIn accepts)
- **Demo rate:** 10-15% of engaged prospects
- **Trial signup rate:** 50% of demos
- **Trial → Paid conversion:** 40-50% (within 90 days)

### Revenue Target
- **30 days:** $99 MRR (1 customer)
- **90 days:** $198-297 MRR (2-3 customers)
- **12 months (scaled):** $4,950 MRR (50 customers)

### Secondary Metrics
- **Referral rate:** 2-3 referrals per trial user
- **Influencer partnerships:** 1-2 advocates (Tahmina Watson, Evelyn Ackah)
- **Case studies created:** 1-2 customer testimonials
- **Email deliverability:** >97% (< 3% bounce rate)
- **LinkedIn account health:** No restrictions

---

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
cd marketing/b2b-tools
npm install
```

Dependencies already in `package.json`:
- nodemailer (email sending)
- csv-writer (tracker updates)
- dotenv (environment config)
- puppeteer (optional, for scraping)
- googleapis (optional, for Google Sheets integration)

---

### 2. Configure Environment
```bash
cp .env.example .env
nano .env
```

**Required variables:**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
SENDER_NAME=Michael Guo
SENDER_EMAIL=michael@nexus-alert.com
SENDER_PHONE=+1 (555) 123-4567
```

**For Gmail:**
1. Go to https://myaccount.google.com/apppasswords
2. Generate an App-Specific Password (16 characters)
3. Use that instead of your regular password

---

### 3. Verify Email Addresses
**Use Hunter.io (100 free verifications/month):**

Sign up: https://hunter.io
API Key: https://hunter.io/api-keys

Manually verify top 10 prospects:
```bash
# Example verification
curl "https://api.hunter.io/v2/email-verifier?email=tahmina@soundimmigration.com&api_key=YOUR_KEY"
```

Update `outreach-tracker.csv` with verified emails.

---

### 4. Test Email Sending (Dry Run)
```bash
node outreach-manager.js --template 1 --limit 1 --dry-run
```

**Expected output:**
```
🚀 NEXUS Alert B2B Outreach Campaign
=====================================

Template: Initial Cold Outreach
Priority filter: All
Limit: 1
Dry run: Yes (no emails sent)

📊 Found 1 prospects to contact

📧 Processing: Lorne Waldman (Mamann Sandaluk & Kingwell LLP)
   [DRY RUN] Email would be sent

📊 Campaign Summary
===================
Total prospects processed: 1
Successful: 1
Failed: 0

⚠️  This was a DRY RUN - no emails were actually sent
```

---

### 5. Launch First Batch (LIVE)
```bash
# Send to VERY HIGH priority only
node outreach-manager.js --template 1 --priority "VERY HIGH"
```

**Expected output:**
```
✅ Email sent to Lorne Waldman (Mamann Sandaluk & Kingwell LLP)
   Template: Initial Cold Outreach
   Message ID: <abc123@gmail.com>
📝 Updated prospect 1 in tracker

[...5 more emails...]

📊 Campaign Summary
===================
Total prospects processed: 6
Successful: 6
Failed: 0

✅ Campaign complete!
```

---

## 📚 Additional Materials Included

### Email Best Practices
- Subject line A/B testing guidelines
- Send timing optimization (Tuesday-Thursday, 10-11am or 2-3pm)
- Email warmup strategy (start 10-20/day, increase gradually)
- Personalization techniques (firm name, city, recent post)
- CAN-SPAM compliance checklist

### LinkedIn Best Practices
- Daily action limits (15-20 connections, 50 messages, 100 views)
- Engagement tactics (comment → like → connect)
- Profile optimization (headline, about section)
- Automation tool safety (Dripify, Expandi usage limits)
- Account recovery (if restricted)

### Objection Handling Scripts
- 6 common objections with detailed responses
- ROI calculators and cost breakdowns
- Competitive comparisons (VAs, free tier, manual checking)
- Feature justifications (2-min intervals, white-label, API access)

### Case Study Template
- Before/after transformation format
- ROI calculation framework
- Quote collection guidelines
- Video testimonial script

---

## 🎓 Handoff to Sales Team

### For CMO / Sales-Focused Engineer

**Your responsibilities:**
1. **Week 1-2:** Email outreach to 20 prospects (use outreach-manager.js)
2. **Week 1-4:** LinkedIn outreach (15 connections/day, manual)
3. **Week 2-3:** Demo calls (10-15 minutes each, screen share dashboard)
4. **Week 3-4:** Trial onboarding (white-label setup, team training)
5. **Week 4+:** Trial follow-up (7-day check-in, 90-day conversion)

**Daily time commitment:** 15-30 minutes
- Check email replies, respond to interested prospects
- Send 5 LinkedIn connection requests
- Update tracker with latest statuses
- Follow up with engaged prospects

**Weekly review:** 1 hour
- Analyze metrics (open rate, reply rate, demos scheduled)
- A/B test subject lines and email content
- Report progress (trials started, paid conversions, pipeline value)

**Tools you'll use:**
- `outreach-manager.js` - Email sending automation
- `outreach-tracker.csv` - Prospect tracking
- Gmail - Reply handling
- LinkedIn - Connection requests and messaging
- Zoom/Google Meet - Demo calls
- NEXUS Alert dashboard - Demo walkthrough

**Resources:**
- `email-templates.md` - Copy-paste email templates
- `linkedin-outreach.md` - LinkedIn message sequences
- `target-prospects.md` - Research notes on each firm
- `.env.example` - Environment variable setup guide

---

## 📞 Support & Questions

**Technical setup:**
- Email: michael@nexus-alert.com
- Slack: #b2b-sales (if you have internal team channel)

**CRM/automation help:**
- HubSpot integration guide (if needed)
- Zapier workflows (email → CRM sync)
- Sales Navigator setup guide

---

## ✅ Launch Checklist

**Pre-Launch (1 hour):**
- [ ] Install dependencies (`npm install`)
- [ ] Configure `.env` with SMTP credentials
- [ ] Test email sending with `--dry-run`
- [ ] Verify top 10 emails using Hunter.io
- [ ] Update `outreach-tracker.csv` with verified emails
- [ ] Review email templates for accuracy
- [ ] Optimize LinkedIn profile (headline, about section)

**Week 1 (2-3 hours):**
- [ ] Send Template #1 to VERY HIGH priority (6 emails)
- [ ] Send 10-15 LinkedIn connection requests
- [ ] Engage with LinkedIn posts (like/comment)
- [ ] Respond to any replies within 24 hours
- [ ] Update tracker daily

**Week 2 (2-3 hours):**
- [ ] Send Template #2 to non-responders
- [ ] Send LinkedIn Message #1 to accepted connections
- [ ] Send Template #1 to HIGH priority (10 emails)
- [ ] Schedule demos with interested prospects
- [ ] Update tracker daily

**Week 3 (3-4 hours):**
- [ ] Send Template #3 (case study) to non-responders
- [ ] Conduct 2-3 demo calls
- [ ] Send trial links post-demo
- [ ] Send Template #1 to MEDIUM-HIGH priority (4 emails)
- [ ] Update tracker daily

**Week 4 (2 hours):**
- [ ] Send Template #4 (breakup email) to non-responders
- [ ] Follow up with trial users (7-day check-in)
- [ ] Ask trial users for referrals
- [ ] Update tracker with final statuses
- [ ] Report metrics (demos, trials, conversions)

**Target:** 1 paid customer by end of Week 4 🎉

---

## 🚀 Next Steps After First 20 Prospects

### Scale to 100+ Prospects (Month 2-3)

1. **Expand geographic targets:**
   - Add: Portland, Edmonton, Calgary, Montreal, Phoenix, El Paso
   - Research: 20 more firms per region

2. **Automated lead generation:**
   - Google Maps scraper (Apify, $50/month)
   - State Bar directory scrapers
   - LinkedIn Sales Navigator exports

3. **Hire SDR/BDR (optional):**
   - Full-time outreach (100 emails/week)
   - LinkedIn engagement (50 connections/week)
   - Demo calls and trial onboarding

4. **Launch paid ads:**
   - LinkedIn Sponsored Content ($500/month)
   - Google Search Ads ("NEXUS appointment monitoring")
   - Immigration lawyer Facebook groups

5. **Content marketing:**
   - Guest posts on immigration law blogs
   - Webinar: "How to Save 10+ Hours/Week on NEXUS Appointments"
   - Case study videos with early customers

---

**Package created by:** AI Assistant (Claude Sonnet 4.5)
**Date:** March 18, 2024
**Status:** Ready for immediate use
**Files location:** `/Users/michaelguo/nexus-alert/marketing/b2b-tools/`

**Total materials:**
- 3 comprehensive guides (40+ pages)
- 1 prospect database (20 firms)
- 1 tracking system (CSV)
- 1 automation script (Node.js)
- 7 email templates + objection scripts
- 3 LinkedIn message sequences
- Complete setup documentation

🚀 **Ready to launch B2B sales campaign!**
