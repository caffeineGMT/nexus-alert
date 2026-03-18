# Testimonial Collection Execution Checklist

**Deadline:** March 25, 2026
**Goal:** 3-5 authentic user testimonials
**Owner:** CMO / Founder

---

## Pre-Flight Checklist

### Technical Setup
- [ ] Deploy testimonial submission form to production
  - [ ] Update API URL in `/submit-testimonial/page.tsx`
  - [ ] Test form submission locally
  - [ ] Deploy to Vercel: `vercel --prod`

- [ ] Set up backend endpoints
  - [ ] Import testimonials.js handlers in worker.js
  - [ ] Add public `/api/testimonials` endpoint
  - [ ] Add admin endpoints (GET, approve, reject)
  - [ ] Create TESTIMONIALS KV namespace
  - [ ] Deploy worker: `cd backend && npm run deploy`

- [ ] Test admin panel
  - [ ] Access https://nexus-alert.com/admin/testimonials
  - [ ] Login with admin token
  - [ ] Verify can view/approve/reject

- [ ] Verify email notifications
  - [ ] Submit test testimonial
  - [ ] Confirm admin notification received
  - [ ] Approve test testimonial
  - [ ] Confirm Premium code email sent

---

## Week 1: Outreach Campaign

### Day 1 (Tuesday): Identify & Contact HIGH Priority

**Morning (9-11am):**
- [ ] Review beta tester list, email analytics, Reddit posts
- [ ] Identify 10-15 potential testimonial sources
- [ ] Add all contacts to TRACKING.csv with notes
- [ ] Prioritize: HIGH (confirmed success) > MEDIUM (likely success) > LOW (possible success)

**Afternoon (2-4pm):**
- [ ] Select 5-7 HIGH priority contacts
- [ ] Personalize email template 01, 02, or 03 for each
- [ ] Send emails (Gmail/Outlook, not marketing platform)
- [ ] BCC yourself for tracking
- [ ] Update TRACKING.csv (Contacted date, Status: "Awaiting Response")

**Email Quality Check:**
- [ ] Each email includes recipient's first name
- [ ] Each email references specific context
- [ ] Form link included: https://nexus-alert.com/submit-testimonial
- [ ] Incentive mentioned (3 months Premium)
- [ ] Reply option provided (form OR email response)

### Day 2 (Wednesday): Second Batch

**Morning:**
- [ ] Send 3-5 more emails to MEDIUM priority contacts
- [ ] Update TRACKING.csv
- [ ] Monitor first batch for responses

**If responses coming in:**
- [ ] Review submissions in admin panel
- [ ] Approve if quality is good
- [ ] Premium codes sent automatically
- [ ] Update TRACKING.csv status to "Received"

### Day 3 (Thursday): Monitor & Respond

- [ ] Check admin panel for new submissions
- [ ] Send personal thank you notes (optional, in addition to auto email)
- [ ] Update TRACKING.csv
- [ ] Note which contacts haven't responded yet

### Day 4 (Friday): Follow-Up Round

**Morning:**
- [ ] Identify contacts from Day 1 who haven't responded (3 days later)
- [ ] Send follow-up emails (template 04)
- [ ] Keep it short and casual
- [ ] Update TRACKING.csv

**Expected Results by End of Week 1:**
- [ ] 10-15 emails sent total
- [ ] 3-6 responses received (30-50% response rate)
- [ ] 2-4 testimonials approved and ready

---

## Week 2: Polish & Integration

### Day 5-7 (Weekend/Monday): Final Submissions

- [ ] Review any weekend submissions
- [ ] Approve quality testimonials
- [ ] Send Premium codes

**If you have 3+ testimonials → PROCEED TO INTEGRATION**

**If you have <3 testimonials:**
- [ ] Send 5-10 more emails to MEDIUM/LOW priority
- [ ] Consider offering 6 months Premium (higher incentive)
- [ ] Post in Reddit/communities asking for success stories
- [ ] Reach out to email list subscribers

### Day 8 (Tuesday): Website Integration

**Update Testimonials Component:**
- [ ] Open `web/src/app/components/Testimonials.tsx`
- [ ] Copy formatted testimonials from admin panel
- [ ] Replace placeholder testimonials (lines 5-30)
- [ ] Verify avatar initials match names
- [ ] Check dates are formatted correctly (YYYY-MM-DD)

**Test Locally:**
```bash
cd web
npm run dev
# Open http://localhost:3000
# Scroll to testimonials section
# Verify all display correctly
```

**Deploy:**
```bash
npm run build
vercel --prod
```

**Verify Production:**
- [ ] Visit https://nexus-alert.com
- [ ] Scroll to testimonials section
- [ ] Check all testimonials render correctly
- [ ] View page source → verify JSON-LD structured data
- [ ] Test on mobile
- [ ] Check "Share your story" CTA link works

### Day 9 (Wednesday): Chrome Web Store Update

**Update Store Listing:**
- [ ] Go to Chrome Web Store Developer Dashboard
- [ ] Edit NEXUS Alert listing
- [ ] Add testimonials to "Description" section:
  ```
  ⭐ LOVED BY APPOINTMENT SEEKERS

  "Quote 1" — Name, Location
  "Quote 2" — Name, Location
  "Quote 3" — Name, Location
  ```
- [ ] Consider adding testimonial screenshot to image carousel
- [ ] Save changes
- [ ] Submit for review (if needed)

### Day 10 (Thursday): Product Hunt Assets

**Create PH Testimonials Document:**
- [ ] Open `store-assets/product-hunt-testimonials.md`
- [ ] Format top 3-5 testimonials for PH description
- [ ] Create maker comment with success stories
- [ ] Prepare quote graphics (optional, use Canva)

**PH Launch Checklist:**
- [ ] Add testimonials to product description
- [ ] Include in first maker comment
- [ ] Prepare for "Maker's Story" section
- [ ] Have quotes ready for social media posts

### Day 11 (Friday): Final QA & Documentation

**Quality Assurance:**
- [ ] All approved testimonials on website → ✅
- [ ] All Premium codes sent → ✅
- [ ] Chrome Web Store updated → ✅
- [ ] Product Hunt assets prepared → ✅
- [ ] TRACKING.csv fully updated → ✅

**Documentation:**
- [ ] Move collected testimonials to `collected-testimonials.json`
- [ ] Archive email correspondence
- [ ] Update README with what worked / didn't work
- [ ] Note response rates for future campaigns

---

## Success Criteria

### Minimum Viable (Must Have)
- [ ] 3 testimonials with specific results
- [ ] Permission granted for all
- [ ] Published on website
- [ ] Added to Chrome Web Store listing

### Ideal Target (Nice to Have)
- [ ] 5 testimonials total
- [ ] Mix of programs (NEXUS, Global Entry, SENTRI)
- [ ] Mix of tiers (free + Premium)
- [ ] Geographic diversity
- [ ] Range of success timelines (2 days - 1 week)

### Quality Metrics (Per Testimonial)
- [ ] Specific timeline included ("3 days", "within a week")
- [ ] Emotional impact expressed ("saved me months", "peace of mind")
- [ ] Location/context provided (city, enrollment center)
- [ ] Natural, authentic voice (not marketing copy)
- [ ] Before/after story (what they tried before, how this helped)

---

## Contingency Plans

### If Response Rate is Low (<20%)

**Week 1 Adjustments:**
- [ ] Make emails even more personal (mention specific details)
- [ ] Increase incentive to 6 months Premium
- [ ] Add personal note: "This is a solo founder project, your help means a lot"
- [ ] Try phone calls/texts for friends/family

**Week 2 Options:**
- [ ] Expand to LOW priority contacts
- [ ] Post in Reddit communities offering Premium in exchange for testimonials
- [ ] Email list blast with testimonial request
- [ ] Use placeholder testimonials temporarily (mark as "coming soon")

### If Testimonials are Generic

**Request More Details:**
```
Hey [Name], thanks for sharing! Quick follow-up questions:
1. How long after installing did you find a slot?
2. Which enrollment center?
3. What did you try before this?

Just helps make the story more helpful for others!
```

**Provide Examples:**
Show them `collected-testimonials.json` as reference for what good looks like.

### If Technical Issues

**Form Not Working:**
- [ ] Check API endpoint URL in page.tsx
- [ ] Verify CORS headers in worker
- [ ] Test with curl/Postman
- [ ] Check browser console for errors
- [ ] Fallback: Collect via email responses

**Admin Panel Issues:**
- [ ] Verify admin token
- [ ] Check KV namespace binding
- [ ] Review worker logs
- [ ] Test endpoints with curl

**Email Not Sending:**
- [ ] Verify Resend API key
- [ ] Check email quota
- [ ] Review Resend dashboard for errors
- [ ] Fallback: Manual email sends

---

## Post-Launch Review

### After Campaign Completes

**Metrics to Track:**
- Total emails sent: _____
- Total responses: _____
- Response rate: _____%
- Testimonials approved: _____
- Testimonials rejected: _____
- Premium codes redeemed: _____

**What Worked:**
- [ ] Which email templates got best response
- [ ] Which subject lines performed best
- [ ] Which incentives were most effective
- [ ] Which contact sources were most reliable

**What Didn't Work:**
- [ ] Low-performing templates
- [ ] Timing issues
- [ ] Technical blockers

**Lessons Learned:**
- [ ] Document for future testimonial campaigns
- [ ] Update templates based on learnings
- [ ] Note which contacts to prioritize next time

---

## Quick Reference

**Form URL:** https://nexus-alert.com/submit-testimonial
**Admin Panel:** https://nexus-alert.com/admin/testimonials
**Email Templates:** `/marketing/testimonials/email-templates/`
**Tracking:** `/marketing/testimonials/TRACKING.csv`
**Examples:** `/marketing/testimonials/collected-testimonials.json`

**Support:**
- Technical issues → Review `worker-integration.md`
- Email template help → Review `email-templates/` folder
- Process questions → Review `QUICK-START-GUIDE.md`

---

## Status: Ready to Execute ✅

All infrastructure is in place. Just need to:
1. Deploy form & backend
2. Identify contacts
3. Send emails
4. Approve submissions
5. Integrate into website/store

**Estimated Time:** 3-4 hours over 10 days

Let's go! 🚀
