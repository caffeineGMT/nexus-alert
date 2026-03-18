# B2B Pro Tier Cold Outreach - Complete Execution Playbook

**Mission:** Generate 1+ paying B2B customer at $99/mo within 60 days
**Target:** 200 emails sent, 40%+ open rate, 3+ demo calls booked
**Revenue Goal:** $1,188+ ARR from first customer

---

## Phase 1: Lead Generation (Days 1-7)

### Day 1-2: Scrape Immigration Lawyers

**Goal:** Collect 300+ raw leads from 3 sources

#### Source 1: AILA Directory
```bash
cd marketing/b2b-tools
node scrape-aila.js
```
**Expected Output:** 100-150 leads
**Target Cities:** Vancouver, Seattle, Toronto, Buffalo, Detroit, San Diego

#### Source 2: Google Maps
```bash
node scrape-google-maps.js
```
**Expected Output:** 100-150 leads
**Queries:**
- "immigration lawyer [city]"
- "immigration attorney [city]"
- "NEXUS lawyer [city]"

#### Source 3: Avvo.com
```bash
node scrape-avvo.js
```
**Expected Output:** 50-100 leads
**Filters:** Immigration law practice area, near NEXUS centers

**Checkpoint:** You should have 250-400 raw leads after scraping.

---

### Day 3-4: Enrich & Verify Leads

**Goal:** Convert raw leads to verified, outreach-ready contacts

#### Step 1: Enrich with Email Addresses
```bash
node enrich-leads.js
```
**What it does:**
- Visits firm websites
- Extracts contact email patterns
- Finds attorney names
- Prioritizes larger firms

**Expected Output:** 200-300 enriched leads with email candidates

#### Step 2: Verify Emails with Hunter.io
```bash
# Set up Hunter.io API key first
echo "HUNTER_API_KEY=your_key_here" >> .env

node verify-emails.js
```
**What it does:**
- Validates email deliverability
- Removes catch-all domains
- Flags risky addresses
- Generates confidence scores

**Expected Output:** 200+ verified, outreach-ready leads

**Checkpoint:** Review `lead-data/outreach-ready-[DATE].json` - should have 200+ leads with verified emails.

---

## Phase 2: Email Campaign Launch (Days 8-21)

### Day 8: Pre-Flight Checklist

**Email Service Setup:**
- [ ] Create Resend account (https://resend.com)
- [ ] Verify sender domain (hello@nexus-alert.com)
- [ ] Set up SPF/DKIM/DMARC records
- [ ] Add RESEND_API_KEY to `.env`

**Email Warmup (Critical!):**
- [ ] Use Warmbox or Mailreach for 7 days
- [ ] Start with 10 emails/day, increase to 50/day
- [ ] DO NOT skip warmup or you'll land in spam

**Tracking Setup:**
- [ ] Set up UTM parameters for all links
- [ ] Create Calendly for demo bookings
- [ ] Prepare reply templates for objections

---

### Day 9: Test Campaign

**Send to 10 test leads:**
```bash
node campaign-manager.js start --batch=10 --live
```

**Monitor for 24 hours:**
- Check open rates (target: 35%+)
- Check spam score (use mail-tester.com)
- Check reply quality

**If open rate < 30%:**
- Update subject lines
- Check sender reputation
- Verify email formatting

---

### Day 10-14: Full Launch

**Send Email 1 to remaining 190 leads:**
```bash
# Send in batches of 50/day
node campaign-manager.js start --batch=50 --live
```

**Daily routine:**
1. Send 50 emails in morning (10am local time)
2. Monitor opens/clicks in Resend dashboard
3. Respond to replies within 2 hours
4. Update outreach-tracker.csv with status changes

**Expected timeline:**
- Day 10: 50 emails sent (total: 60)
- Day 11: 50 emails sent (total: 110)
- Day 12: 50 emails sent (total: 160)
- Day 13: 50 emails sent (total: 210) ✅

---

### Day 13-21: Follow-Up Sequence

**Email 2 (Day 3 after Email 1):**
```bash
# Run daily to check for leads due for Email 2
node campaign-manager.js follow-up
```

**Email 3 (Day 7 after Email 1):**
```bash
# Same command - handles both Email 2 and Email 3
node campaign-manager.js follow-up
```

**Set up cron job for automation:**
```bash
crontab -e
# Add:
0 9 * * * cd /path/to/nexus-alert/marketing/b2b-tools && node campaign-manager.js follow-up --live
```

---

## Phase 3: LinkedIn Outreach (Days 8-28)

**Goal:** Connect with 50 lawyers, send personalized messages

### Daily LinkedIn Routine (20 connections/day)

**Morning (30 minutes):**
1. Run LinkedIn outreach script:
   ```bash
   node linkedin-outreach.js daily
   ```
2. Copy the 20 names provided
3. Send connection requests manually (with personalized note)

**Connection Request Template:**
```
Hi [First Name],

I noticed you specialize in immigration law in [City]. I'd love to connect — we built a tool that's helping immigration attorneys like Sarah Chen in Vancouver save 12+ hours/week managing NEXUS appointments.

Would you be open to connecting?

Best,
Michael
```

**After Connection Accepted (24-48 hours later):**
```
Thanks for connecting, [First Name]!

Quick question: How many NEXUS or Global Entry cases does [Firm Name] handle monthly?

We built NEXUS Alert Pro specifically for firms with 15+ clients — it monitors appointments 24/7 and sends white-label notifications.

Most firms save 10+ hours/week and catch 10x more slots. Would a quick demo be helpful?

Best,
Michael
```

**Update tracker after each interaction:**
```bash
node linkedin-outreach.js update "[First Name] [Last Name]" --status=connected
node linkedin-outreach.js update "[First Name] [Last Name]" --status=message-sent
```

---

## Phase 4: Demo Calls & Trials (Days 15-45)

### Demo Call Script (15 minutes)

**Intro (2 min):**
- "Thanks for taking the time. How many NEXUS clients are you managing right now?"
- [Listen for pain points]

**Problem Validation (3 min):**
- "How are you currently tracking appointments for them?"
- "How much time per week does that take?"
- "What's the average wait time for your clients?"

**Solution Demo (5 min):**
- Screen share: Show dashboard
- Add a test client
- Show notification example
- Show white-label settings

**ROI Breakdown (3 min):**
- "If you're spending 10 hours/week on this, that's $1,000+/month in staff time"
- "Pro tier is $99/month — 10x ROI"
- "Plus faster appointments = happier clients = more referrals"

**Trial Offer (2 min):**
- "60-day free trial, no credit card"
- "I'll set up white-labeling with your firm logo today"
- "If it doesn't save you 10 hours in the first month, just cancel"

**Send trial link immediately after call.**

---

### Trial Follow-Up Sequence

**Day 7 of trial:**
```
Subject: [First Name] - how's the NEXUS Alert trial going?

Hi [First Name],

Quick check-in on your NEXUS Alert Pro trial. You've been using it for a week now.

How many appointment notifications have you received? Are you seeing time savings yet?

Let me know if you need any help with setup or have questions.

Best,
Michael
```

**Day 30 of trial:**
```
Subject: Halfway through your trial - any feedback?

Hi [First Name],

You're halfway through the 60-day trial. Wanted to check in:

1. Are you seeing the time savings we discussed?
2. Have your clients noticed faster appointments?
3. Any features you'd like to see added?

Let me know how it's going.

Best,
Michael
```

**Day 55 of trial:**
```
Subject: Your trial expires in 5 days

Hi [First Name],

Your 60-day trial expires on [DATE].

To keep monitoring your clients uninterrupted, activate your subscription:
→ https://nexus-alert.com/pro/subscribe

If you'd like an extension to evaluate further, just reply and I'll add 30 days.

Thanks for trying NEXUS Alert Pro!

Best,
Michael
```

---

## Phase 5: Conversion & Optimization (Days 45-60)

### Conversion Tactics

**For leads on the fence:**
- Offer 3-month discount: $79/mo for first 3 months
- Emphasize competitor advantage
- Share case studies from similar firms

**For price objections:**
- Break down ROI calculation
- Compare to VA costs ($600-800/mo)
- Offer annual plan: $990/year (save $198)

**For "we'll think about it":**
- Set a follow-up date: "Can I check back next Tuesday?"
- Send testimonials from similar firms
- Offer to extend trial by 30 days

---

## Success Metrics Tracking

**Daily Monitoring:**
```bash
# Check campaign stats
node campaign-manager.js stats

# Export to CSV for analysis
node campaign-manager.js export
```

**Key Metrics Dashboard:**

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Emails sent | 200 | [X] | ⏳/✅ |
| Open rate | 40%+ | [X]% | ⏳/✅ |
| Click rate | 10%+ | [X]% | ⏳/✅ |
| Reply rate | 5%+ | [X]% | ⏳/✅ |
| Demo calls booked | 3+ | [X] | ⏳/✅ |
| Trials started | 6+ | [X] | ⏳/✅ |
| Paying customers | 1+ | [X] | ⏳/✅ |

**Weekly Review:**
1. Review open rates by subject line (A/B test)
2. Analyze reply patterns (objections, questions)
3. Optimize messaging based on feedback
4. Update email templates if needed

---

## Troubleshooting

### Low Open Rate (< 30%)

**Possible causes:**
- Landing in spam folder
- Subject line not compelling
- Sender reputation low
- Wrong time of day

**Fixes:**
- Check spam score at mail-tester.com
- A/B test subject lines
- Warm up domain for longer
- Send at 10am-11am local time

---

### Low Reply Rate (< 3%)

**Possible causes:**
- Email too long
- CTA not clear
- Wrong target audience
- Value prop not compelling

**Fixes:**
- Shorten emails to 150 words max
- Bold the CTA
- Filter leads by firm size (20+ clients)
- Lead with ROI numbers upfront

---

### Demos Not Converting to Trials

**Possible causes:**
- Setup seems too complex
- Price objections
- Not seeing immediate value
- Competitor already in place

**Fixes:**
- Offer to do setup for them (10-min screen share)
- Emphasize $0 risk (no credit card required)
- Send case study email after demo
- Address competitor comparison directly

---

## Tools & Resources

### Required Tools
- [Resend](https://resend.com) - Email delivery ($20/mo)
- [Hunter.io](https://hunter.io) - Email verification (free tier)
- [Calendly](https://calendly.com) - Demo bookings (free)
- [Warmbox](https://warmbox.ai) - Email warmup ($15/mo)

### Optional Tools
- [Lemlist](https://lemlist.com) - Advanced sequencing ($59/mo)
- [Clay](https://clay.com) - Data enrichment ($149/mo)
- [Instantly.ai](https://instantly.ai) - Deliverability boost ($37/mo)

### Templates
- All email templates: `email-sequence-v2.md`
- LinkedIn templates: `linkedin-outreach.md`
- Objection handling: `email-templates.md`
- Demo script: This playbook (Phase 4)

---

## Final Checklist

**Before Launch:**
- [ ] .env configured with all API keys
- [ ] Email domain verified and warmed up
- [ ] 200+ leads scraped and verified
- [ ] Calendly demo link created
- [ ] Reply templates prepared
- [ ] Test emails sent and verified

**During Campaign:**
- [ ] Send 50 emails/day for 4 days
- [ ] Monitor open/click rates daily
- [ ] Respond to replies within 2 hours
- [ ] Book demo calls immediately
- [ ] Send LinkedIn connections (20/day)
- [ ] Update tracker.csv daily

**Post-Campaign:**
- [ ] Follow up with all demo attendees
- [ ] Nurture trial users weekly
- [ ] Convert 1+ to paid customer
- [ ] Ask for testimonials
- [ ] Request referrals from happy customers

---

## Timeline Summary

**Week 1 (Days 1-7):** Scraping & enrichment
**Week 2 (Days 8-14):** Email campaign launch
**Week 3 (Days 15-21):** Follow-up sequence + LinkedIn
**Week 4 (Days 22-28):** Demo calls + trial onboarding
**Weeks 5-8 (Days 29-60):** Trial nurturing + conversions

**Expected Outcome:**
- 200 emails sent ✅
- 40%+ open rate ✅
- 3+ demo calls booked ✅
- 1+ paying customer ($99/mo = $1,188 ARR) ✅

**Total Time Investment:** 40-50 hours over 60 days
**Expected ROI:** 10x+ (first customer covers all costs, scales from there)

---

## Next Steps After First Customer

**Scale to 10 customers ($12K ARR):**
1. Expand to 20 more cities
2. Scrape additional 500 leads
3. Hire VA to send LinkedIn connections
4. Run webinar funnel (1x/month)
5. Launch partner/referral program (20% commission)

**Revenue Projection:**
- 10 customers × $99/mo = $990 MRR = **$11,880 ARR**
- Churn rate: 10%/month
- CAC: ~$50/customer (time + tools)
- LTV: ~$600 (6-month average retention)
- **LTV/CAC ratio: 12x** 🚀

Good luck! 🎯
