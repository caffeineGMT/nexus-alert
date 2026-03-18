# B2B Discovery Interview Guide - Immigration Lawyer Validation

**Objective:** Validate $99/mo Pro tier pricing, identify must-have features, and extract sales messaging from real pain points.

**Target:** 3 immigration lawyers with 10+ NEXUS/Global Entry/SENTRI clients per month

**Duration:** 30 minutes per interview

---

## Pre-Interview Setup

**Scheduling email template:**
```
Subject: Quick 15-min call about NEXUS appointment challenges?

Hi [First Name],

I'm building a tool to help immigration lawyers manage NEXUS/Global Entry appointments for their clients more efficiently.

Would you have 15 minutes this week for a quick call? I'd love to learn about how you currently handle appointment monitoring and what would make your life easier.

As a thank you, I'll give you early access to the Pro tier (normally $99/mo) free for 6 months.

Are you available:
- Tuesday 2pm PT
- Wednesday 10am PT
- Thursday 3pm PT

Best,
Michael
NEXUS Alert
```

**Materials to prepare:**
- [ ] Zoom link (record with consent)
- [ ] Google Doc for live note-taking
- [ ] Screen ready to demo current product
- [ ] Pricing scenarios printed ($49/mo, $99/mo, $199/mo)

---

## Interview Structure

### Part 1: Context & Current State (7 minutes)

**Firm Overview:**
- How many NEXUS/Global Entry/SENTRI applications does your firm handle per month?
- What percentage of your clients need these programs? Is it growing?
- Who on your team handles appointment coordination? (Partner, paralegal, VA, client self-service?)

**Current Workflow:**
- Walk me through what happens after a client's application is conditionally approved.
- How do you currently monitor appointment availability?
  - Manual checking on ttp.cbp.dhs.gov?
  - Any tools or services?
  - How often do you check?
- How do you notify clients when slots open?

**Pain Points Validation:**
- On a scale of 1-10, how much of a pain point is appointment monitoring?
  - If < 7: "What makes it manageable for you?" (Disqualify if not a pain)
  - If ≥ 7: "Tell me about a recent time this caused problems."
- How much time per week does your firm spend on this? (Hours × hourly rate = $ cost)
- Have you ever lost a client or gotten negative feedback due to appointment delays?

### Part 2: Solution Validation & Feature Discovery (10 minutes)

**Demo Setup:**
"I'm going to show you what we've built. Please interrupt me when you see something you like or don't understand."

*[Screen share: Show Pro dashboard mockup or existing consumer product]*

**Feature Validation (Show → Ask):**

1. **Multi-client management dashboard**
   - Show: Table with 20 clients, their locations, last check time, slots found
   - Ask: "Would this be useful? What's missing?"
   - Listen for: Bulk actions, client notes, priority flags, integration with case management

2. **Automated checking every 2 minutes**
   - Show: Real-time checking status
   - Ask: "Is 2 minutes fast enough, or do you need faster?"
   - Listen for: Speed requirements, reliability concerns

3. **White-label email notifications**
   - Show: Sample email with their firm branding
   - Ask: "How important is it that clients see your firm name, not 'NEXUS Alert'?"
   - Scale: Critical / Nice to have / Don't care
   - Listen for: SMS preferences, phone call preferences, client portal integration

4. **Multi-location monitoring per client**
   - Show: Client monitoring 5 locations simultaneously
   - Ask: "Do your clients typically want multiple location options?"
   - Listen for: Location prioritization, "acceptable" locations logic

5. **API access for integrations**
   - Ask: "Do you use case management software? (Clio, MyCase, PracticePanther)"
   - Listen for: Integration needs, data export requirements

**Open-ended feature discovery:**
- "If you could wave a magic wand, what would the perfect NEXUS appointment tool do?"
- "What would make this a no-brainer purchase for your firm?"
- "What would be a dealbreaker?"

### Part 3: Pricing Validation (8 minutes)

**Setup:**
"I want to understand what's fair pricing for this. I'll show you 3 options and get your honest reaction."

**Pricing Scenarios:**

**Option A: $49/mo (up to 10 clients)**
- Ask: "What's your reaction?"
- Listen for: "Too cheap?" "Seems right" "Still expensive"
- Follow-up: "Would you buy this today?"

**Option B: $99/mo (up to 20 clients)**
- Ask: "What about this price?"
- Listen for: Value perception, ROI calculation
- Probe: "Let's say you spend 5 hours/week on appointments at $200/hr billing rate. That's $4,000/mo in time. Does $99/mo feel like a good deal?"

**Option C: $199/mo (unlimited clients + priority support)**
- Ask: "And this tier?"
- Listen for: What would justify the higher price?

**Anchoring question:**
"If you were paying for this out of your own pocket today, which tier would you choose?"

**Per-client pricing alternative:**
"Some lawyers prefer to pass the cost to clients. Would $10/client/month work better than a flat fee?"
- Listen for: Billing model preferences, client willingness to pay

### Part 4: Competitive Landscape (3 minutes)

**Current alternatives:**
- "Are you aware of any other tools that do this?"
  - If yes: "What do you like/dislike about them?"
  - If no: "How would you solve this if our tool didn't exist?"

**Switching costs:**
- "If you're using something now, what would it take to switch?"

**Budget & Decision-making:**
- "Who makes purchasing decisions for tools like this at your firm?"
- "Do you have a budget for legal tech/software?"
- "Typical approval timeline?" (Same day, week, month, quarterly planning)

### Part 5: Sales Messaging & Objection Handling (2 minutes)

**Messaging validation:**
"I want to test a few headlines on you. Which resonates most?"

1. "Monitor NEXUS appointments 24/7 for your clients - save 10 hours/week"
2. "The only NEXUS appointment tool built for immigration law firms"
3. "Turn appointment delays into competitive advantage - book clients 10x faster"

**Objection preview:**
- "What would make you say no to this?"
- Listen for: Price, time to set up, trust/reliability, feature gaps

---

## Closing (Final minute)

**Next steps:**
- "This was incredibly helpful. Can I follow up in a week with a prototype based on your feedback?"
- "Would you be willing to be a design partner? Free access for 6 months in exchange for monthly feedback calls."
- "Can I quote you in our marketing? 'Before NEXUS Alert, we spent X hours/week...'"

**Referrals:**
- "Do you know 2-3 other immigration lawyers who'd benefit from this? I'd love to interview them too."

---

## Post-Interview Checklist

Within 1 hour:
- [ ] Fill out Findings Template (see INTERVIEW_FINDINGS_TEMPLATE.md)
- [ ] Extract 3-5 direct quotes for testimonials/messaging
- [ ] Update Feature Requirements Matrix
- [ ] Send thank-you email with 6-month free Pro access code
- [ ] Add to CRM/prospect tracker with follow-up date

Within 24 hours:
- [ ] Synthesize findings across all interviews
- [ ] Update pricing recommendation
- [ ] Prioritize feature roadmap based on feedback
- [ ] Draft sales messaging using their language

---

## Interview Success Metrics

**Good interview:**
- ✅ Pain point score ≥ 7/10
- ✅ Currently spending 5+ hours/week on appointments
- ✅ Handles 15+ clients/month
- ✅ Willing to pay $99/mo (or validates pricing)
- ✅ Provides 3+ specific feature requests
- ✅ Agrees to design partner program

**Red flags (may not be ideal customer):**
- ❌ Pain point score < 5/10
- ❌ Only handles 1-2 NEXUS cases/month
- ❌ "Clients should handle this themselves"
- ❌ Budget constraints ("We can't afford any software")
- ❌ Already using competitor happily

---

## Recording & Consent

**At start of call:**
"Do I have your permission to record this call? It's just for my notes and won't be shared publicly."

**If they ask why:**
"I want to capture your exact words so I can build what you need, not what I think you need."

**Backup if they decline recording:**
Take extensive notes in Google Doc (shared with them afterwards for accuracy)
