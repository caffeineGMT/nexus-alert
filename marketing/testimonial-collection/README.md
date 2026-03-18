# Testimonial Collection Campaign

## Overview
Comprehensive system for collecting 3-5 high-quality user testimonials within 7 days for Chrome Web Store listing, Product Hunt launch, and landing page social proof.

## 🚀 Quick Start (CMO)

### Your Mission
Collect **3-5 testimonials** by **March 25, 2026** for:
1. Chrome Web Store listing (REQUIRED for launch)
2. Product Hunt launch page
3. Website social proof

### Get Started in 3 Steps

**Step 1: Get Beta User Emails (30 min)**
- Export Premium subscribers from Stripe
- Export email capture form submissions
- Check support tickets for engaged users
- Target: 50-100 emails minimum

**Step 2: Send Initial Outreach (1 hour)**
- Use Email Template 1 for beta users
- Use Email Template 4 for Premium users
- Include UTM-tracked submission link
- Set up auto-responder for reward codes

**Step 3: Monitor & Follow Up (Daily)**
- Check submission form for new testimonials
- Send follow-up emails to non-responders (Day 5)
- Request photos from text-only submissions
- Update website with real testimonials

## 📁 Files in This Directory

| File | Purpose |
|------|---------|
| `README.md` | This file — overview and quick start |
| `CMO_PLAYBOOK.md` | Complete step-by-step guide for CMO |
| `EMAIL_TEMPLATES.md` | 7 copy-paste email templates |
| `TRACKING.csv` | Spreadsheet for tracking outreach |
| `METRICS_DASHBOARD.md` | Analytics and reporting |

## 🔗 Key Links

**Submission Form:** https://nexus-alert.com/testimonials/submit

**Backend API:** `/api/testimonials/submit`

**Testimonials Component:** `web/src/app/components/Testimonials.tsx`

**Email Templates:** [EMAIL_TEMPLATES.md](./EMAIL_TEMPLATES.md)

**Full Playbook:** [CMO_PLAYBOOK.md](./CMO_PLAYBOOK.md)

## 📊 Success Metrics

### Goal: 3-5 Testimonials by March 25

**Minimum Acceptable:**
- ✅ 3 testimonials with real names + locations
- ✅ 1 Premium user testimonial
- ✅ Specific results mentioned ("found slot in 3 days")

**Ideal Outcome:**
- ⭐ 5 testimonials across NEXUS, Global Entry, SENTRI
- ⭐ 2 with photos
- ⭐ Mix of free and Premium users

## 📅 Timeline

| Day | Action | Expected Result |
|-----|--------|-----------------|
| 1 | Send initial emails | 50-100 emails sent |
| 3 | Check submissions | 1-2 testimonials |
| 5 | Follow-up non-responders | 2-3 more testimonials |
| 7 | Final push + photo requests | 3-5 total (GOAL MET) |
| 8 | Update website | Deploy to production |

## 🎁 Reward System

**Incentive:** 3 months Premium free ($14.97 value)

**How It Works:**
1. User submits testimonial
2. Auto-generate reward code: `THANKS-{random}`
3. Email code immediately (Template 5)
4. User redeems in extension → Premium activated

**Budget:** 15 codes max = ~$75 deferred revenue

## 🛠️ Technical Setup

### Submission Form
- **Live at:** `/testimonials/submit`
- **API endpoint:** `/api/testimonials/submit`
- **Storage:** Console logs (TODO: add database)

### Email Campaign
- **Tool:** Mailchimp / SendGrid / Gmail
- **Batch size:** 50 emails/day (avoid spam filters)
- **UTM tracking:** `?utm_source=email&utm_campaign=testimonial_beta`

### Webhook Integration (Optional)
Set environment variable to auto-forward submissions:
```bash
TESTIMONIAL_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK
```

Forwards to: Google Sheets, Airtable, Notion, or email.

## 📧 Email Templates Summary

| Template | Purpose | When to Send |
|----------|---------|--------------|
| 1 | Initial outreach (beta users) | Day 1 |
| 2 | 5-day follow-up | Day 5 |
| 3 | Product Hunt urgency | Day 7 |
| 4 | Premium user request | Day 1 |
| 5 | Thank you + reward code | Immediate after submission |
| 6 | Photo request | Day 6 (for text submissions) |
| 7 | Final nudge (14 days) | Day 14 |

**Full templates:** [EMAIL_TEMPLATES.md](./EMAIL_TEMPLATES.md)

## 🎯 Testimonial Quality Criteria

### What to Look For:
✅ **Specific results** ("found slot in 3 days", not "it was helpful")
✅ **Emotional context** ("I was so frustrated...")
✅ **Relatable persona** (Name + Location)
✅ **Authenticity** (casual language, not overly promotional)

### Red Flags:
❌ Generic: "Great product!"
❌ Unverifiable: No name/location
❌ Suspicious: Submitted immediately after install

## 🔄 How to Update Website

### Step 1: Collect Testimonial Data
```
Name: Sarah Chen
Location: Vancouver, BC
Testimonial: "I was checking the GOES website manually for weeks..."
```

### Step 2: Format for Website
Open `web/src/app/components/Testimonials.tsx` and update:
```typescript
{
  name: 'Sarah Chen',
  location: 'Vancouver, BC',
  rating: 5,
  date: '2026-03-18',
  text: 'I was checking the GOES website manually for weeks...',
  avatar: 'SC', // initials
}
```

### Step 3: Deploy
```bash
git add web/src/app/components/Testimonials.tsx
git commit -m "Update testimonials with real user stories"
git push origin main
npx vercel --prod --yes
```

## 📈 Tracking & Reporting

### What to Track:
- Emails sent
- Open rate
- Click-through rate
- Form submissions
- Photos collected
- Reward codes sent

**Tracking Sheet:** [TRACKING.csv](./TRACKING.csv)

### Weekly Report Format:
```
Week 1 Results:
- Emails sent: 87
- Open rate: 43%
- Testimonials collected: 5
- Photos: 2
- Status: ✅ Goal exceeded
```

## 🆘 Troubleshooting

**"I don't have beta user emails"**
→ Use Reddit outreach or in-app prompts (see CMO_PLAYBOOK.md)

**"Testimonials are too generic"**
→ Follow up asking for specific details (template in playbook)

**"Users want anonymity"**
→ Offer first name only or initials (e.g., "Sarah from Vancouver")

**"Form submissions not working"**
→ Check `/api/testimonials/submit` logs or email hello@nexus-alert.com

## 🚦 Next Steps

### This Week (Urgent)
- [ ] Export beta user email list
- [ ] Set up email campaign in Mailchimp/SendGrid
- [ ] Send Template 1 to all beta users
- [ ] Send Template 4 to Premium users
- [ ] Monitor submissions daily

### Next Week
- [ ] Follow up non-responders
- [ ] Request photos from text submissions
- [ ] Update website with real testimonials
- [ ] Add to Chrome Web Store listing
- [ ] Create Product Hunt gallery images

### Long-Term
- [ ] Set up in-app testimonial prompts
- [ ] Automate post-purchase email flow
- [ ] Monitor Reddit for organic mentions
- [ ] Build evergreen collection system

## 📞 Support

**Questions?** Email: hello@nexus-alert.com

**Technical Issues?** Check: `/api/testimonials/submit` logs

**Campaign Owner:** CMO / Marketing Lead

**Deadline:** March 25, 2026 (7 days)

---

## 📚 Additional Resources

- **Full CMO Playbook:** [CMO_PLAYBOOK.md](./CMO_PLAYBOOK.md)
- **Email Templates:** [EMAIL_TEMPLATES.md](./EMAIL_TEMPLATES.md)
- **Community Seeding Strategy:** `../community-seeding/STRATEGY.md`
- **Chrome Web Store Assets:** `../../store-assets/`
- **Product Hunt Assets:** `../product-hunt/`

---

**Last Updated:** March 18, 2026
**Status:** Ready to launch
**Owner:** CMO
