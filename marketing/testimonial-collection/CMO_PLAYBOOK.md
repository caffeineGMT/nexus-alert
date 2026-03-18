# Testimonial Collection Playbook (CMO)

## Mission
Collect **3-5 high-quality user testimonials** within 7 days for:
1. Chrome Web Store listing (required for launch)
2. Product Hunt launch page
3. Landing page social proof
4. Future marketing materials

---

## Quick Start Checklist

### Pre-Launch (Day 0)
- [ ] Identify beta user email list (50-100 emails minimum)
- [ ] Set up email sending tool (Mailchimp, SendGrid, or Gmail)
- [ ] Create UTM-tracked submission link for tracking
- [ ] Set up webhook/Zapier to capture form submissions
- [ ] Prepare reward code generation system

### Day 1-2: Initial Outreach
- [ ] Send Email Template 1 to all beta users
- [ ] Send Email Template 4 to Premium subscribers
- [ ] Monitor submission landing page analytics
- [ ] Set up auto-responder for Template 5 (Thank You email)

### Day 3-5: Follow-Up
- [ ] Send Template 2 to non-responders
- [ ] Review submitted testimonials for quality
- [ ] Request photos from text-only submissions (Template 6)
- [ ] Edit/format testimonials for website use

### Day 6-7: Final Push
- [ ] Send Template 3 (Product Hunt urgency) to remaining non-responders
- [ ] Finalize 3-5 best testimonials
- [ ] Add to Chrome Web Store listing
- [ ] Update website Testimonials component

### Day 8+: Ongoing
- [ ] Set up automated testimonial request in post-purchase email flow
- [ ] Add testimonial prompt to extension settings
- [ ] Create evergreen "Share Your Story" link in app

---

## Resources & Links

### Submission Form
**Live Page:** https://nexus-alert.com/testimonials/submit

**Backend API:** `/api/testimonials/submit`

**Tracking Sheet:** `marketing/testimonial-collection/TRACKING.csv`

### Email Templates
**Full Library:** `marketing/testimonial-collection/EMAIL_TEMPLATES.md`

**Quick Copy:**
- Template 1: Initial outreach (beta users)
- Template 2: 5-day follow-up
- Template 3: Product Hunt urgency
- Template 4: Premium users
- Template 5: Thank you + reward code
- Template 6: Photo request
- Template 7: Final nudge (14 days)

### Existing Testimonials Component
**File:** `web/src/app/components/Testimonials.tsx`

**Current Status:** Has 3 placeholder testimonials (Sarah Chen, Michael Rodriguez, Emily Thompson)

**Action Required:** Replace placeholders with real testimonials once collected

---

## Beta User Email Sources

### Where to Find Beta User Emails:

1. **Premium Subscriber Database**
   - Location: Stripe customer export
   - Emails: All paying users
   - Priority: HIGH (already paying, most likely to provide positive testimonials)

2. **Email Capture Form Submissions**
   - Location: Landing page form database
   - Component: `web/src/app/components/EmailCaptureForm.tsx`
   - Action: Export all submitted emails

3. **Support Ticket Emails**
   - Location: Crisp chat / help@nexus-alert.com
   - Filter for: Positive feedback, feature requests, success stories
   - Priority: MEDIUM (engaged users)

4. **Reddit Community Engagement**
   - Location: Comment replies on launch posts
   - Subreddits: r/Nexus, r/GlobalEntry, r/TravelHacking
   - Action: Manually reach out to users who commented positively

5. **Extension Onboarding (Future)**
   - Add optional email capture during first-time setup
   - Incentive: "Get notified of new features + Premium discounts"

---

## Email Campaign Setup

### Option 1: Mailchimp (Recommended for Beginners)
1. Create new audience with beta user emails
2. Design email using Template 1
3. Add UTM tracking to submission link: `?utm_source=email&utm_campaign=testimonial_collection`
4. Schedule sends in batches (50 emails/day to avoid spam filters)
5. Set up auto-responder for Template 5

### Option 2: SendGrid (Recommended for Developers)
1. Import contacts via CSV
2. Create email template in SendGrid UI
3. Use dynamic fields: `{{first_name}}`, `{{user_type}}`
4. Set up webhook to trigger Template 5 on form submission
5. Track opens/clicks in SendGrid dashboard

### Option 3: Manual Gmail (Low Volume)
1. Use mail merge Chrome extension (Yet Another Mail Merge)
2. Personalize each email with user's first name
3. Send in batches of 20-30/day
4. Manually track responses in TRACKING.csv

---

## Submission Form Analytics

### What to Track:
- **Page views:** How many people clicked the link
- **Form starts:** How many began filling it out
- **Form submissions:** How many completed it
- **Conversion rate:** Submissions / Page views

### Tools:
- **Google Analytics:** Track page views and form submissions
- **Vercel Analytics:** Real-time traffic monitoring
- **Webhook:** Forward submissions to Google Sheets or Airtable

### Setup:
Add to `.env.local`:
```
TESTIMONIAL_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/[YOUR_ZAPIER_WEBHOOK]
```

Or use Make.com, Google Sheets API, or Airtable webhook.

---

## Testimonial Quality Criteria

### What Makes a GREAT Testimonial:

✅ **Specific Results**
- "Found a slot in 3 days" (not "it was helpful")
- "Moved my appointment from 6 months to 2 weeks" (quantifiable)

✅ **Emotional Context**
- "I was so frustrated refreshing daily..."
- "Literally saved me hours of manual checking"

✅ **Relatable Persona**
- Name + Location (Sarah from Vancouver)
- Program type (NEXUS, Global Entry, SENTRI)
- Free vs Premium user

✅ **Authenticity Signals**
- Not overly promotional
- Mentions a minor caveat (builds trust)
- Uses casual language ("This literally saved me...")

### Red Flags (Reject These):
❌ Generic: "Great product, highly recommend"
❌ Too promotional: "Best app ever made in human history"
❌ Unverifiable: No name, location, or specific details
❌ Suspicious timing: Submitted immediately after install

---

## Reward Code System

### How It Works:
1. User submits testimonial
2. API generates unique code: `THANKS-{random 6 chars}`
3. Email Template 5 sent automatically with code
4. User redeems code in extension → 3 months Premium free

### Implementation Options:

**Option A: Stripe Coupon Codes (Automated)**
- Create 100% off coupon in Stripe Dashboard
- Set duration: 3 months
- Limit: 1 redemption per customer
- Generate unique codes: `THANKS-ABC123`, `THANKS-XYZ789`

**Option B: Manual Fulfillment (MVP)**
- Track codes in spreadsheet
- Manually apply credits in Stripe when user emails
- Lower effort, slower response time

**Option C: Custom License Key System**
- Store codes in Cloudflare KV or D1
- Extension validates code on redemption
- Requires backend integration

**Recommended for Week 1:** Option B (manual)
**Recommended for Scale:** Option A (Stripe)

---

## Testimonial Formatting for Website

### Convert Submission to Website Format:

**Submission:**
```
Name: Sarah Chen
Location: Vancouver, BC
Program: NEXUS
Original Wait: 4 months
Found Slot In: 3 days
Testimonial: "I was checking the GOES website manually for weeks with no luck. Installed NEXUS Alert on a Friday, got notified of a slot Sunday morning, and booked my appointment for the next week. This literally saved me months of waiting."
```

**Website Format (web/src/app/components/Testimonials.tsx):**
```typescript
{
  name: 'Sarah Chen',
  location: 'Vancouver, BC',
  rating: 5,
  date: '2026-03-18',
  text: 'I was checking the GOES website manually for weeks with no luck. Installed NEXUS Alert on a Friday, got notified of a slot Sunday morning, and booked my appointment for the next week. This literally saved me months of waiting.',
  avatar: 'SC',
}
```

### Steps to Update:
1. Open `web/src/app/components/Testimonials.tsx`
2. Replace the `testimonials` array with real data
3. Update `avatar` to user's initials
4. Keep `rating: 5` (only feature 5-star reviews)
5. Set `date` to submission date
6. Commit and push to trigger Vercel deployment

---

## Chrome Web Store Listing Format

### CWS Testimonial Requirements:
- **Character limit:** 500 chars per review
- **Format:** "Quote" - Name, Location
- **Quantity:** 2-3 testimonials maximum (due to space constraints)

### Example CWS Testimonial Block:

```
⭐⭐⭐⭐⭐ "Found my NEXUS appointment in 3 days after weeks of manual checking. The instant notifications are a game-changer!" - Sarah C., Vancouver

⭐⭐⭐⭐⭐ "Premium tier is absolutely worth it. Got a slot within hours of upgrading to 2-minute checks." - Michael R., Seattle

⭐⭐⭐⭐⭐ "Super simple setup and the alerts are instant. Booked a slot 4 months earlier than expected!" - Emily T., Buffalo
```

**Where to Add:**
Chrome Web Store → Developer Dashboard → Store Listing → Description field

---

## Product Hunt Launch Format

### PH Testimonial Display:

Product Hunt allows embedding testimonials in:
1. **Gallery images** (screenshot with quote overlay)
2. **Description text** (formatted quotes)
3. **First comment** (user story compilation)

### Recommended PH Format:

**Gallery Image:**
- Background: NEXUS Alert branded template
- Quote: Largest testimonial text
- Attribution: Name + Location
- 5-star rating visual

**Description Text:**
```markdown
## What Users Are Saying

> "I was checking the GOES website manually for weeks with no luck. Installed NEXUS Alert on a Friday, got notified of a slot Sunday morning, and booked my appointment for the next week."
> **Sarah C., Vancouver**

> "The Premium tier is absolutely worth it. I upgraded and got a slot notification within 3 days. The 2-minute check interval makes a huge difference."
> **Michael R., Seattle**
```

---

## FAQ: Common Issues

### "What if I don't have beta user emails?"

**Solution 1: Reddit Outreach**
- Post in r/Nexus, r/GlobalEntry: "If NEXUS Alert helped you, I'd love to feature your story"
- Collect responses in comments
- Direct message interested users

**Solution 2: In-App Prompt**
- Add banner to extension: "Share your success story → Get 3 months Premium free"
- Link to testimonials/submit page
- Capture emails this way

**Solution 3: Support Tickets**
- Review help@nexus-alert.com for positive feedback
- Reach out to users who sent thank-you emails

### "What if testimonials are too generic?"

**Follow-Up Email:**
```
Hey [Name],

Thanks for submitting! Your story is great, but would you mind adding a bit more detail?

Specifically:
- How long did you wait before finding a slot?
- What was the original wait time?
- How quickly did you find it after installing?

The more specific, the better! Just reply to this email with those details.

Thanks!
```

### "What if users want anonymity?"

**Compromise Options:**
- Use first name only: "Sarah from Vancouver"
- Use initials: "S.C. from Vancouver"
- Create pseudonym: "A NEXUS user in Canada"

Note: Real names convert better, but respect user privacy preferences.

### "What if we get negative testimonials?"

**Action Plan:**
1. Don't feature negative testimonials publicly
2. Reply personally to understand their issue
3. Offer refund/solution to resolve problem
4. If resolved, ask if they'd update their testimonial
5. Track negative feedback for product improvements

---

## Success Metrics & Reporting

### Week 1 Goal: 3-5 Testimonials

**Report Format:**
```
Testimonial Collection - Week 1 Results

Emails Sent: 87
Open Rate: 43%
Click Rate: 12%
Form Submissions: 5 (5.7% conversion)

Testimonials Collected:
- Sarah Chen (Vancouver, BC) - NEXUS - Photo: No
- Michael Rodriguez (Seattle, WA) - Global Entry - Photo: Yes
- Emily Thompson (Buffalo, NY) - SENTRI - Photo: No
- David Kim (Toronto, ON) - NEXUS - Photo: No
- Jessica Martinez (San Diego, CA) - Global Entry - Photo: Yes

Status:
✅ Minimum goal met (3 testimonials)
✅ Exceeded goal (5 collected)
✅ 2 with photos (40%)
✅ Premium user testimonial secured

Next Steps:
- Add to website (deployed today)
- Add to Chrome Web Store listing
- Create Product Hunt gallery images
- Set up ongoing testimonial collection automation
```

### Weekly Monitoring:
- Track new submissions via webhook
- Respond to submissions within 24 hours
- Send reward codes immediately
- Update website monthly with new testimonials

---

## Long-Term Automation

### Post-Launch: Evergreen Testimonial Collection

**1. In-App Prompt (High Priority)**
- After user books an appointment, show success popup
- Prompt: "Did NEXUS Alert help you find this slot?"
- Button: "Share My Story" → Opens testimonials/submit page

**2. Post-Purchase Email Flow**
- Day 7 after Premium signup: "How's Premium working for you?"
- Day 14: Testimonial request email
- Day 30: Photo testimonial request

**3. Extension Settings Link**
- Add "Share Your Story" link in extension settings
- Always visible, always accessible
- Ties to Premium reward incentive

**4. Reddit Monitoring**
- Set up Google Alert for "NEXUS Alert helped me"
- Monitor r/Nexus, r/GlobalEntry for organic mentions
- Reach out to users for permission to feature testimonials

---

## Contact & Questions

**Campaign Owner:** CMO / Marketing Lead

**Technical Support:** hello@nexus-alert.com

**Submission Form Issues:** Check `/api/testimonials/submit` logs

**Analytics Dashboard:** Vercel Analytics → nexus-alert.com/testimonials/submit

---

## Timeline Summary

| Day | Action | Template | Target |
|-----|--------|----------|--------|
| 1 | Initial outreach to beta users | Template 1 | 50-100 emails |
| 1 | Premium user outreach | Template 4 | 10-20 emails |
| 3 | Monitor submissions | - | 1-2 submissions |
| 5 | Follow-up non-responders | Template 2 | Remaining 80% |
| 6 | Photo requests | Template 6 | All text submissions |
| 7 | Final push before CWS launch | Template 3 | All non-responders |
| 8 | Update website with real testimonials | - | Deploy to production |
| 9+ | Ongoing collection automation | In-app prompts | Continuous |

**Deadline:** 7 days from today (March 25, 2026)

**Success Criteria:** 3-5 testimonials with real names, locations, specific results

**Reward Budget:** 15 reward codes (3 months Premium each) = $75 in deferred revenue

---

## Appendix: Example Outreach Email

**From:** hello@nexus-alert.com
**To:** sarah.chen@example.com
**Subject:** Did NEXUS Alert help you find your appointment? 🎯

Hi Sarah,

I hope this email finds you well! I'm reaching out because you're one of the early users of NEXUS Alert.

I'm curious — did the extension help you find your NEXUS/Global Entry/SENTRI appointment?

We're collecting success stories from our beta users for:
- Chrome Web Store listing (going live this week!)
- Product Hunt launch
- Social proof on our website

**If you found your slot using NEXUS Alert, I'd love to feature your story.**

In return, I'll give you:
✅ 3 months of Premium free ($14.97 value)
✅ Early access to new features
✅ A shoutout on our website

It takes just 2 minutes to share your experience:
👉 https://nexus-alert.com/testimonials/submit?utm_source=email&utm_campaign=testimonial_beta

No pressure at all — only if you had a positive experience and feel comfortable sharing!

Thanks for being an early supporter,
[Your Name]
Founder, NEXUS Alert

P.S. Even if you're not comfortable with a public testimonial, I'd still love to hear your feedback. Just reply to this email!
