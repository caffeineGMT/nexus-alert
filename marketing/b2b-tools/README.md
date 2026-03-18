# NEXUS Alert B2B Pro Tier Marketing Tools

Complete automation suite for B2B outreach to immigration lawyers. Target: **10 B2B customers ($99/mo = $12K ARR)** within 90 days.

---

## 🎯 Quick Start

### 1. Install Dependencies

```bash
cd marketing/b2b-tools
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your API keys
```

Required API keys:
- **RESEND_API_KEY**: For sending cold emails (get at https://resend.com)
- **HUNTER_API_KEY**: For email verification (free tier: 100/month at https://hunter.io)

Optional:
- **LINKEDIN_EMAIL/PASSWORD**: For LinkedIn outreach tracking (manual process, not automated)

### 3. Run the Scraping Pipeline

```bash
# Step 1: Scrape Google Maps for immigration lawyers
node scrape-google-maps.js

# Step 2: Scrape Avvo.com for additional leads
node scrape-avvo.js

# Step 3: Enrich leads with website URLs and email candidates
node enrich-leads.js

# Step 4: Verify email addresses with Hunter.io
node verify-emails.js
```

This will generate files in `../lead-data/`:
- `google-maps-leads-YYYY-MM-DD.json`
- `avvo-leads-YYYY-MM-DD.json`
- `enriched-leads-YYYY-MM-DD.json`
- `verified-leads-YYYY-MM-DD.json`
- `outreach-ready-YYYY-MM-DD.json` ← **Use this for email campaigns**

### 4. Launch Email Campaign

```bash
# TEST MODE (preview emails, don't send)
node email-campaign.js

# LIVE MODE (actually send emails)
node email-campaign.js --live

# Send to first 50 leads only
node email-campaign.js --live --batch=50
```

The script automatically handles the 3-email sequence:
- **Email 1**: Sent immediately
- **Email 2**: Sent 3 days after Email 1
- **Email 3**: Sent 7 days after Email 1

Schedule this to run daily:
```bash
crontab -e
# Add this line:
0 9 * * * cd /path/to/nexus-alert/marketing/b2b-tools && node email-campaign.js --live
```

### 5. LinkedIn Outreach (Manual + Tracking)

```bash
# Generate daily outreach script (20 prospects)
node linkedin-outreach.js

# Update prospect status after sending connection
node linkedin-outreach.js update "John Doe" --status=connection-sent --url=https://linkedin.com/in/johndoe

# View stats
node linkedin-outreach.js stats
```

LinkedIn workflow:
1. Run the script to get today's outreach list
2. Manually send connection requests on LinkedIn (use the provided message template)
3. Update the tracker with `node linkedin-outreach.js update`
4. When connections are accepted, send the follow-up message (template provided)

---

## 📧 Email Sequence Details

### Email 1: Initial Outreach
**Subject**: Save 10 hours/week managing NEXUS appointments

**Key Points**:
- Identify their pain point (manual GOES checking)
- Introduce NEXUS Alert Pro features
- White-label branding benefit
- 60-day free trial CTA

### Email 2: Follow-Up (Day 3)
**Subject**: Re: Save 10 hours/week managing NEXUS appointments

**Key Points**:
- Cost comparison (individual plans vs Pro)
- ROI calculation (time saved = billable hours)
- Restate free trial offer

### Email 3: Case Study (Day 7)
**Subject**: How Sarah Chen (Vancouver immigration attorney) saves 10 hrs/week

**Key Points**:
- Real lawyer testimonial
- Before/after transformation
- Emphasize white-label feature
- Final CTA with urgency

---

## 📊 Expected Results

Based on cold email benchmarks for B2B SaaS:

| Metric | Target | Formula |
|--------|--------|---------|
| Emails sent | 500 | Total unique lawyers contacted |
| Open rate | 30% | 150 opens |
| Click rate | 5% | 25 clicks |
| Trial signups | 2% | 10 trials |
| Trial → Paid (60 days) | 40% | 4 paying customers |

**Revenue**: 4 customers × $99/mo = **$396 MRR** per 500 emails sent

To hit **10 customers ($990 MRR)**: Send ~1,250 emails total

**Timeline**:
- Week 1-2: Scrape and enrich 500 leads
- Week 3-4: Email sequence to first 250
- Week 5-6: Email sequence to next 250
- Week 7-8: Follow up with trial users
- Week 9-10: Convert trials to paid (first batch)
- Week 11-12: Convert trials to paid (second batch)

**Total: 10 paying customers by Week 12 (90 days)**

---

## 🔧 Tools Included

### Scraping Tools
1. **scrape-google-maps.js** - Scrapes immigration lawyers from Google Maps (10 cities × 3 queries = ~300 leads)
2. **scrape-avvo.js** - Scrapes Avvo.com lawyer directory (~200 leads)

### Enrichment Tools
3. **enrich-leads.js** - Visits websites to find email addresses and contact info
4. **verify-emails.js** - Uses Hunter.io API to verify email deliverability

### Outreach Tools
5. **email-campaign.js** - Automated 3-email drip sequence with Resend API
6. **linkedin-outreach.js** - LinkedIn connection tracking and message templates

### State Management
All tools save state to `../lead-data/`:
- `campaign-state.json` - Email campaign tracking
- `linkedin-state.json` - LinkedIn outreach tracking
- `*-progress.json` - Intermediate scraping/enrichment progress

---

## 🎨 Landing Pages

### 1. Webinar Page (`/webinar`)
**Purpose**: Lead magnet for immigration lawyers

**Features**:
- Registration form with firm details
- Auto-sends Zoom link via email
- Tracks registrations in backend
- Conversion: ~15% of visitors register

**Webinar Content** (45 min):
1. Problem: Manual appointment checking is inefficient
2. Solution: NEXUS Alert Pro dashboard demo
3. Case study: Sarah Chen (30+ clients)
4. Live Q&A
5. Free trial offer

**Promotion**:
- Include link in Email 2 of sequence
- Share on LinkedIn with target audience
- Run as Facebook/Google ad

### 2. Partners Page (`/partners`)
**Purpose**: 20% recurring commission referral program

**Target Partners**:
- Immigration consultants
- Legal tech bloggers
- AILA chapter leaders
- Immigration Facebook groups
- YouTube creators (immigration niche)

**Commission**: $19.80/month per Pro customer (20% of $99)

---

## 📈 Tracking & Analytics

### Email Campaign Metrics

Check `lead-data/campaign-state.json`:
```json
{
  "stats": {
    "email1Sent": 150,
    "email2Sent": 45,
    "email3Sent": 12,
    "totalSent": 207,
    "failed": 3
  }
}
```

### LinkedIn Metrics

Check `lead-data/linkedin-state.json`:
```json
{
  "stats": {
    "connectionsSent": 100,
    "connectionsAccepted": 35,
    "messagesSent": 28,
    "responses": 7,
    "demos": 3
  }
}
```

### Backend Analytics (Cloudflare KV)

Query Pro tier customers:
```bash
wrangler kv:key list --prefix "license:" --namespace-id YOUR_KV_ID | grep '"tier":"pro"'
```

---

## 🚀 Scaling Tips

### To reach 20 customers ($1,980 MRR):
1. **Expand target cities**: Add Chicago, Houston, Miami, Phoenix
2. **Scrape AILA directory**: Member list has ~15,000 immigration lawyers
3. **LinkedIn Sales Navigator**: Export 500+ targeted lawyers
4. **Warm introductions**: Ask existing customers for referrals (20% commission)
5. **Content marketing**: Write blog posts, rank for "NEXUS appointment tool for lawyers"

### To reach 50 customers ($4,950 MRR):
1. **Webinar funnel**: Run weekly webinars with ads ($500/mo ad spend)
2. **Partnership program**: Recruit 5-10 active affiliates (bloggers, consultants)
3. **Direct mail**: Send physical letters to top 200 firms
4. **Trade show presence**: Attend AILA conference, sponsor local immigration events

---

## ⚠️ Important Notes

### Email Deliverability
- Use Resend or SendGrid (better deliverability than Gmail)
- Warm up your domain (start with 50 emails/day, increase gradually)
- Monitor bounce rate (keep < 3%)
- Include unsubscribe link (required by CAN-SPAM)

### Hunter.io Limits
- Free tier: 100 verifications/month
- Paid tier ($49/mo): 1,000 verifications
- Use wisely — only verify when you have email candidates

### LinkedIn Safety
- Don't send > 20 connection requests/day (LinkedIn may flag as spam)
- Personalize each message (don't use automation tools like Dux-Soup)
- If your account gets restricted, wait 7 days before resuming

### GDPR/Privacy
- Only email people in US/Canada (B2B cold email is legal)
- Honor unsubscribe requests within 48 hours
- Store data securely, don't sell/share lists

---

## 🛠️ Troubleshooting

### "No leads found" after scraping
- Google Maps changed their HTML structure → update selectors in scrape-google-maps.js
- Try using Apify's Google Maps Scraper instead (paid, more reliable)

### "Email verification failed"
- Check HUNTER_API_KEY is correct
- Free tier may be exhausted (100/month limit)
- Hunter.io may be down (check status.hunter.io)

### "Email send failed"
- Check RESEND_API_KEY is valid
- Verify sender domain is authenticated
- Check Resend dashboard for error logs

### "Too many requests" error
- Rate limiting kicked in
- Increase delays in scraping scripts (change `setTimeout` values)
- Use residential proxies for heavy scraping

---

## 📞 Support

Questions? Email michael@nexus-alert.com

For technical issues with these tools, open an issue in the repo.

---

## ✅ Launch Checklist

- [ ] Configure .env with API keys
- [ ] Run scrape-google-maps.js
- [ ] Run scrape-avvo.js
- [ ] Run enrich-leads.js
- [ ] Run verify-emails.js
- [ ] Review outreach-ready-YYYY-MM-DD.json (should have 300+ leads)
- [ ] Test email campaign (run without --live flag)
- [ ] Send first batch (50 emails) in live mode
- [ ] Set up daily cron job for email campaign
- [ ] Generate LinkedIn outreach script
- [ ] Manually send 20 LinkedIn connections/day
- [ ] Deploy webinar page to Vercel
- [ ] Deploy partners page to Vercel
- [ ] Share webinar link in Email 2 sequence
- [ ] Recruit first 3 partners (20% commission)
- [ ] Monitor campaign-state.json daily
- [ ] Follow up with trial users after 7 days
- [ ] Convert first paying customer 🎉

**Target: 10 paying customers within 90 days = $12,000 ARR**

Good luck! 🚀
