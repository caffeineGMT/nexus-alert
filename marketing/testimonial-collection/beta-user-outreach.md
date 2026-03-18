# Beta User Testimonial Outreach - Action Plan

## Target Audience Identification

### Segment 1: Recent Success Stories (HIGHEST PRIORITY)
**Criteria:**
- Users who received 3+ notifications in past 30 days
- Premium users active for 7+ days
- Users from high-traffic enrollment centers (YYZ, SEA, BUF, JFK, LAX)

**Outreach:**
- Email Template 1 (Success Follow-up)
- Send within 24 hours of suspected booking
- Personalize with specific enrollment center + date

**Expected Response Rate:** 25-30%

---

### Segment 2: Premium Subscribers (HIGH VALUE)
**Criteria:**
- Active Premium subscription
- 14+ days since upgrade
- Used notifications feature (email/SMS enabled)

**Outreach:**
- Email Template 3 (Premium Success Story)
- Offer video testimonial option (6 months free)
- Highlight ROI angle ($4.99 vs. months of manual searching)

**Expected Response Rate:** 20-25%

---

### Segment 3: Power Referrers (ADVOCATES)
**Criteria:**
- Referred 2+ friends
- Active in community/Discord (if exists)
- Shared on social media

**Outreach:**
- Email Template 4 (Referral + Case Study)
- Offer 12 months free for full case study
- Feature their story + referral link

**Expected Response Rate:** 40-50% (already advocates)

---

### Segment 4: Freemium Engaged Users
**Criteria:**
- Free tier, active 14+ days
- 5+ slot checks performed
- Opened 2+ notification emails

**Outreach:**
- Email Template 2 (Experience Question)
- Focus on product feedback + testimonial
- Offer 3 months Premium

**Expected Response Rate:** 10-15%

---

## Timeline & Execution

### Week 1: Low-Hanging Fruit

**Monday - Wednesday:**
- Identify top 20 Premium users (Segment 2)
- Send personalized outreach emails
- Goal: 5-7 responses

**Thursday - Friday:**
- Identify recent success stories (Segment 1)
- Send follow-up emails to notification recipients
- Goal: 3-5 responses

**Weekend:**
- Process incoming testimonials
- Schedule interviews for Week 2
- Draft reward codes

---

### Week 2: Volume + Follow-ups

**Monday - Wednesday:**
- Send to 50 freemium users (Segment 4)
- Follow up with Week 1 non-responders
- Goal: 8-10 total responses

**Thursday - Friday:**
- Conduct 5-7 user interviews
- Record video testimonials (if available)
- Process written submissions

**Weekend:**
- Edit video clips
- Draft testimonial copy
- Get user approval on drafts

---

### Week 3: Publish & Promote

**Monday - Wednesday:**
- Publish top 5-7 testimonials to website
- Update Chrome Web Store description
- Create social media graphics

**Thursday - Friday:**
- Submit testimonials with CWS listing
- Prepare Product Hunt launch assets
- Create email newsletter feature

---

## Email Database & Segmentation

### Required Data Points
- Email address
- Signup date
- Subscription tier (Free/Premium)
- Last active date
- Notifications received (count)
- Notifications clicked (count)
- Enrollment centers monitored
- Program type (NEXUS/Global Entry/SENTRI)
- Geographic location (city/state)
- Referral count

### Export Query (SQL)
```sql
SELECT
  email,
  name,
  tier,
  signup_date,
  notification_count,
  notification_clicks,
  enrollment_centers,
  program_type,
  location,
  referral_count,
  last_active_date
FROM users
WHERE
  (tier = 'premium' AND DATEDIFF(NOW(), last_active_date) <= 14)
  OR (notification_count >= 3 AND DATEDIFF(NOW(), last_active_date) <= 30)
  OR (referral_count >= 2)
ORDER BY
  CASE
    WHEN tier = 'premium' THEN 1
    WHEN referral_count >= 2 THEN 2
    WHEN notification_count >= 5 THEN 3
    ELSE 4
  END,
  notification_count DESC
LIMIT 200;
```

---

## Outreach Tools

### Email Platform
- **Primary:** Mailchimp / ConvertKit / SendGrid
- **Personalization:** Merge tags for name, location, program
- **Tracking:** Open rates, click rates, response rates
- **Automation:** 7-day follow-up drip

### Scheduling
- **Tool:** Calendly
- **Event Types:**
  - 15-min Quick Testimonial
  - 30-min Deep Dive Interview
  - 45-min Case Study Session
- **Integrations:** Google Calendar, Zoom auto-link

### CRM Tracking
- **Tool:** Airtable / Notion / Google Sheets
- **Fields:**
  - Contact info
  - Segment
  - Outreach status (sent/opened/responded/completed)
  - Testimonial type (written/video/case study)
  - Reward code issued
  - Published (yes/no/pending approval)
  - Quality rating (1-5 stars)

---

## Reward Code Generation

### System
- Format: `THANKS-[6-char-alphanumeric]`
- Example: `THANKS-A9K2X7`
- Duration: 3/6/12 months based on testimonial type
- Delivery: Automated email via backend API

### Tracking
- Code → User mapping in database
- Expiration date
- Redemption status
- Testimonial association

---

## Sample Beta User List (Hypothetical)

| Email | Name | Tier | Notifications | Referrals | Priority |
|-------|------|------|---------------|-----------|----------|
| sarah.m@example.com | Sarah M. | Premium | 12 | 1 | High |
| david.l@example.com | David L. | Premium | 8 | 0 | High |
| kevin.p@example.com | Kevin P. | Free | 15 | 3 | High (advocate) |
| maria.s@example.com | Maria S. | Premium | 6 | 0 | Medium |
| priya.r@example.com | Priya R. | Free | 4 | 1 | Medium |

---

## Personalization Template Examples

### Template Variables
```
{first_name}
{last_name}
{enrollment_center}
{program_type}
{days_since_signup}
{notification_count}
{referral_count}
{tier}
```

### Personalized Email Sample
**Subject:** Sarah, congrats on your YYZ appointment!

Hi Sarah,

I'm Michael, founder of NEXUS Alert. I noticed you successfully found a NEXUS appointment at Toronto (YYZ) after receiving 12 notifications - congrats!

I'm reaching out to ask if you'd be willing to share your experience. Your story would help other travelers who are stuck manually refreshing the GOES site.

**What you get:**
- 3 months of Premium free (you're already Premium, so this extends your subscription)
- Featured on our website
- 5 minutes of your time

[Share your story here](https://nexus-alert.com/testimonials/submit)

Thanks for being an early supporter!
Michael

---

## Quality Control Checklist

### Before Publishing Testimonial
- [ ] User gave explicit permission
- [ ] Name format approved (full name vs. initials)
- [ ] Location accurate
- [ ] Program type correct
- [ ] Quote is grammatically correct
- [ ] No personally identifiable info (email, phone)
- [ ] Reward code sent and tracked
- [ ] User approved final version

### Video Testimonials
- [ ] Audio quality acceptable
- [ ] Lighting adequate
- [ ] Background appropriate
- [ ] User gave video consent
- [ ] Captions added
- [ ] User approved final edit
- [ ] Multiple formats exported (16:9, 1:1, 9:16)

---

## Success Metrics (Target)

| Metric | Target | Stretch Goal |
|--------|--------|--------------|
| Emails sent | 150-200 | 300+ |
| Response rate | 15% | 20% |
| Usable testimonials | 20-25 | 30+ |
| Video testimonials | 3-5 | 8-10 |
| Website-ready quotes | 10-12 | 15+ |
| CWS-ready testimonials | 5-7 | 10+ |
| PH launch quotes | 3-5 | 7+ |
| Average quality rating | 4.0/5 | 4.5/5 |

---

## Legal & Compliance

### Required Permissions
- [ ] Permission to use name
- [ ] Permission to use location (city/state)
- [ ] Permission to publish on website
- [ ] Permission to use in marketing materials
- [ ] Permission to submit to Chrome Web Store
- [ ] Permission to use in paid ads (optional)
- [ ] Video recording consent (for video testimonials)

### Privacy Protection
- **DO publish:** First name + last initial, city/state, program type, experience
- **DON'T publish:** Email, phone, full address, passport info, travel dates
- **Storage:** Testimonials stored securely, email list encrypted
- **Deletion:** User can request removal at any time

### Testimonial Disclaimer
> "Results may vary. NEXUS Alert monitors for appointment availability but does not guarantee bookings. Appointment availability depends on CBP/DHS scheduling and cancellations."

---

## Backup Plan (If Response Rate Low)

### Tactic 1: Increase Incentive
- Upgrade from 3 months → 6 months free
- Add cash incentive ($25 Amazon gift card)
- Offer lifetime Premium for video testimonials

### Tactic 2: Manual Outreach
- Personal LinkedIn messages
- Direct phone calls to Premium users
- Community Discord announcements

### Tactic 3: Synthetic Testimonials (Last Resort)
- Based on real Reddit user posts (with permission)
- Based on support ticket success stories (anonymized)
- Based on user interview summaries (with consent)
- ALWAYS disclose if testimonial is representative/composite

### Tactic 4: Partnerships
- Reach out to immigration lawyers/consultants
- Ask travel bloggers who used the tool
- Contact NEXUS/Global Entry Facebook group admins
