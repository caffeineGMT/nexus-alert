# User Research: Conversion Funnel Analysis

> **Objective:** Understand why users who install the extension don't convert to premium, and identify specific features/messaging that would increase conversion rate to >10%.

---

## Research Timeline

### Milestone: 1K Installs Reached
- **Date Triggered:** _[Auto-filled when totalInstalls >= 1000]_
- **Target Completion:** 7 days after milestone
- **Compensation Budget:** $500 ($25 × 20 interviews)

---

## Participant Criteria

### Target Segment: High-Intent Non-Converters
Prioritize users who:
1. **Installed** the extension (engaged enough to try)
2. **Did NOT upgrade** to premium within 7+ days
3. **Actively use** the extension (checked slots ≥3 times in past week)

### Selection Process
1. Query backend metrics for users matching criteria
2. Filter out users who:
   - Uninstalled the extension
   - Never opened the popup after initial install
   - Subscribed to free slot monitoring but disabled it
3. Randomly select 30 users (aim for 20 completions, accounting for 33% no-show rate)

### Recruitment Email Template

**Subject:** Quick feedback on NEXUS Alert — earn a $25 Amazon gift card

**Body:**
```
Hi [Name],

I'm Michael, the creator of NEXUS Alert. I noticed you installed our extension but haven't upgraded to Premium yet.

I'd love to understand your experience and what would make NEXUS Alert more valuable for you. Your feedback will directly shape what we build next.

**In exchange for 15 minutes on Zoom:**
→ You'll receive a $25 Amazon gift card (no strings attached)
→ Early access to new features we build based on your input

**Book your slot here:** [Calendly link with auto-scheduler]

Thanks for trying NEXUS Alert! Whether we chat or not, I hope it helps you snag an appointment soon.

Best,
Michael
Founder, NEXUS Alert

P.S. - If you're not interested, just reply "no thanks" and I won't reach out again.
```

---

## Interview Protocol

### Pre-Interview Checklist
- [ ] Confirm participant still has extension installed
- [ ] Send Zoom link 1 hour before call
- [ ] Prepare screen share setup (have popup.html open)
- [ ] Have Amazon gift card code ready to send immediately after call

### Interview Structure (15 minutes)

#### 1. Introduction (2 min)
- Thank them for their time
- Explain: "I'm not selling you anything — I genuinely want to understand your experience"
- Confirm they're okay with being recorded (for notes only, not public)

#### 2. Usage Context (3 min)
**Questions:**
- When did you install NEXUS Alert? What prompted you to download it?
- Are you currently waiting for an appointment, or is this for future planning?
- How often do you check the extension? (daily, weekly, just once?)
- Have you found any slots since installing?

**Listen for:**
- Urgency level (need appointment next week vs. next year)
- Competing solutions (manual checking, other tools, forums)
- Whether they actually use the extension regularly

#### 3. Value Perception (4 min)
**Questions:**
- What's the main value you get from NEXUS Alert right now (as a free user)?
- If NEXUS Alert didn't exist, what would you do instead?
- How much time do you think the extension saves you per week?
- Have you recommended it to anyone?

**Listen for:**
- Whether they perceive real value (or just "nice to have")
- Comparison points (manual checking = X hours saved)
- Willingness to advocate (strong signal of value)

#### 4. The Critical Question (4 min)
**THE MONEY QUESTION:**
> "You saw our Premium tier at $4.99/month, but didn't upgrade. What would need to be different for you to pay for this?"

**Follow-ups (ask until you understand the blocker):**
- Is it the price? (If yes: "What's a fair price?")
- Is it the features? (If yes: "What specific feature would make it worth paying for?")
- Is it trust/credibility? (If yes: "What would make you feel confident this is legit?")
- Is it urgency? (If yes: "Would you pay if you needed an appointment next week?")
- Is it just... not that valuable? (If yes: "What would make this genuinely useful for you?")

**Listen for:**
- Specific feature requests (SMS alerts, faster checking, multi-location)
- Pricing objections ("I'd pay $2/month but not $5")
- Trust barriers ("I don't know if slots are real", "Chrome Web Store reviews are fake")
- Value misalignment ("I only need this for 2 weeks, not a subscription")

#### 5. Feature Validation (2 min)
**Show them the popup (screen share) and ask:**
- "Which of these features did you know existed?" (gauge feature discoverability)
- "If we added [insert feature they mentioned], would you actually use it?"
- "What's confusing or frustrating about using this?"

**Listen for:**
- Hidden features they didn't discover
- UX friction points (slow, confusing, buggy)
- "Jobs to be done" framing (what task are they trying to accomplish?)

#### 6. Wrap-Up (<1 min)
- Ask: "Anything else that would make you a paying customer?"
- Thank them profusely
- **Immediately send $25 Amazon gift card code via email**
- Note their email for "early access" list (follow up when we ship features they requested)

---

## Data Collection Template

For each interview, document:

### Participant Profile
- **Email:** [redacted in final report]
- **Install Date:** YYYY-MM-DD
- **Days Since Install:** X days
- **Usage Frequency:** [daily / 3-5x week / weekly / barely]
- **Found Slots:** Yes/No
- **Urgency:** [Need appt in <1 month / 1-3 months / 3+ months / just exploring]

### Key Insights
- **Primary Blocker:** [price / features / trust / urgency / value]
- **Willingness to Pay:** $X/month or [No, even free is questionable]
- **Most Requested Feature:** [specific feature]
- **Quote (verbatim):** "_[Their most revealing quote]_"

### Action Items
- [ ] Feature request logged in roadmap
- [ ] Added to early access list for [specific feature]
- [ ] Gift card sent (confirmation #:\_\_\_)

---

## Analysis Framework

After completing 20 interviews, synthesize findings:

### 1. Conversion Blockers (Ranked by Frequency)
Example template:
```
🔴 Price Sensitivity (12/20 users)
   → "I'd pay $2/month but $5 feels expensive for a notification tool"
   → Suggested fix: Introduce $2.99/month tier OR emphasize time saved ($5 << hourly wage)

🟠 Feature Gap (8/20 users)
   → "I need SMS alerts, not just Chrome notifications"
   → Suggested fix: Add Twilio SMS integration for Premium users

🟡 Trust Deficit (5/20 users)
   → "How do I know this actually works? Chrome Web Store has no reviews"
   → Suggested fix: Collect testimonials, publish success stories, add trust badges
```

### 2. Opportunity Score Matrix

For each insight, calculate:
- **Impact:** How many users mentioned this? (1-10)
- **Effort:** Engineering cost to build (1-10, inverse)
- **Confidence:** Do users SAY they'd pay, or just "yeah maybe"? (1-10)

**Priority Score = Impact × Confidence / Effort**

Example:
```
SMS Alerts: (Impact: 8) × (Confidence: 7) / (Effort: 6) = Score: 9.3 → BUILD IT
Faster checking: (Impact: 4) × (Confidence: 5) / (Effort: 8) = Score: 2.5 → DEPRIORITIZE
```

### 3. Messaging Fixes

Identify where users had **perception gaps**:
- "I didn't know it checked every 2 minutes" → Highlight frequency on homepage
- "I thought free tier was enough" → Emphasize Premium benefits in post-install flow
- "I didn't realize how much time manual checking takes" → Add time-saved calculator

### 4. Revised Conversion Strategy

Based on findings, update:
1. **Pricing:** Should we test $2.99/month? Annual-only? One-time purchase?
2. **Features:** What's the *one* killer feature that justifies Premium?
3. **Positioning:** Are we selling "appointment finder" or "time saver" or "peace of mind"?
4. **Urgency:** How do we target high-urgency users who NEED an appointment now?

---

## Deliverables

### After 5 Interviews (Quick Pulse Check)
- [ ] Slack update to team: Early themes emerging
- [ ] Decide if we need to pivot interview questions

### After 20 Interviews (Final Report)
- [ ] **Executive Summary** (1-page: Top 3 blockers + Top 3 fixes)
- [ ] **Detailed Findings** (Full analysis with quotes)
- [ ] **Roadmap Impact** (Which features to build next, in priority order)
- [ ] **A/B Test Plan** (Test pricing, messaging, or feature visibility)

### Immediate Actions (Post-Research Sprint)
Based on findings, ship within 2 weeks:
1. **Quick Win #1:** [e.g., Testimonials widget on landing page]
2. **Quick Win #2:** [e.g., Better Premium value prop in popup]
3. **Quick Win #3:** [e.g., Pricing experiment: $2.99/month vs. $4.99/month]

Then measure impact on conversion rate for next 30 days.

---

## Success Criteria

**Research is successful if:**
✅ We identify **≥3 specific, actionable blockers** (not vague feedback like "make it better")
✅ We ship **≥2 fixes** within 2 weeks of completing research
✅ Conversion rate improves by **≥2 percentage points** within 30 days of shipping fixes

**Example:**
- Before research: 8.5% conversion rate
- After fixes: 10.5%+ conversion rate
- Goal achieved: ✅ $1K → $10K MRR becomes achievable

---

## Tools & Setup

### Required Tools
- **Calendly:** Auto-scheduler for booking interviews
- **Zoom:** Video call platform (record with permission)
- **Dovetail or Notion:** Centralize interview notes
- **Amazon:** Bulk purchase $25 gift card codes
- **Plausible:** Track which features are actually used (heatmaps of popup clicks)

### Email Sequences
1. **Initial outreach:** Sent to 30 users
2. **Reminder (2 days later):** "Last chance for $25 gift card + early access"
3. **Thank you + gift card:** Sent immediately after interview
4. **Feature launch notification:** When we ship their requested feature

---

## Notes & Observations

_[Use this section during interviews to capture raw insights]_

### Common Patterns
- [ ] Users don't understand Premium benefits
- [ ] Users want one-time purchase, not subscription
- [ ] Users need appointment THIS WEEK (high urgency)
- [ ] Users found slots with free tier, don't see value in Premium
- [ ] Users don't trust the extension (needs social proof)

### Unexpected Findings
_[Document surprises — these often lead to breakthrough insights]_

---

## Next Steps After Research

1. **Synthesize findings** into executive summary
2. **Present to team** (if applicable) or make solo decision
3. **Prioritize fixes** using Impact/Effort/Confidence matrix
4. **Ship quick wins** within 2 weeks
5. **Run A/B tests** on messaging/pricing changes
6. **Measure impact** on conversion rate (30-day window)
7. **Iterate** — if conversion doesn't improve, run another research round

---

**Remember:** The goal isn't to make users happy — it's to **identify what makes them pay**. If 20 users say "I love this but would never pay for it," that's valuable (and concerning) data. Use it to pivot strategy or double down on acquisition.
