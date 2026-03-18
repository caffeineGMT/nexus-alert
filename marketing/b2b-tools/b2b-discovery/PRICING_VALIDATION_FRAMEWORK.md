# Pricing Validation Framework - B2B Pro Tier

**Objective:** Validate that $99/mo is the optimal price point for the Pro tier targeting immigration law firms.

**Hypothesis:** Immigration lawyers will pay $99/mo for a tool that saves 5+ hours/week managing NEXUS appointments for 15-20 clients.

---

## Pricing Scenarios to Test

### Scenario A: Volume-Based Tiers

| Tier | Price | Client Limit | Features |
|------|-------|--------------|----------|
| **Starter** | $49/mo | Up to 10 clients | 5-min checks, email notifications |
| **Pro** | $99/mo | Up to 20 clients | 2-min checks, white-label emails, API |
| **Agency** | $199/mo | Unlimited clients | 1-min checks, dedicated support, integrations |

**Testing Questions:**
- Which tier would you choose for your firm today?
- At what client volume would you upgrade from Starter to Pro?
- What would justify the $199/mo Agency tier?

---

### Scenario B: Per-Client Pricing

| Model | Price | Notes |
|-------|-------|-------|
| **Per-Client** | $10/client/month | Scales with usage, passed to clients |
| **Flat Fee** | $99/mo (up to 20) | Predictable cost, unlimited margin |

**Testing Questions:**
- Do you typically bill clients separately for appointment monitoring services?
- Would you prefer to pass the $10/client cost directly to clients?
- Or absorb $99/mo flat fee and charge clients separately for "concierge service"?

---

### Scenario C: Annual Discount

| Plan | Monthly | Annual (save) |
|------|---------|---------------|
| **Pro Monthly** | $99/mo | — |
| **Pro Annual** | $79/mo | $948/year (save $240) |

**Testing Questions:**
- Would you commit to an annual plan for 20% discount?
- What discount % would make annual a no-brainer? (10%, 20%, 30%?)

---

## Value-Based Pricing Calculator

**Inputs (gather during interview):**

1. **Time Savings:**
   - Current hours/week on appointment monitoring: [X hours]
   - Hourly billing rate (or loaded cost): [$Y/hour]
   - Weekly time cost: [X × Y = $Z/week]
   - Monthly time cost: [Z × 4 = $W/month]

2. **Client Volume:**
   - NEXUS/GE/SENTRI clients per month: [N clients]
   - Average fee per client: [$F]
   - Monthly revenue from this practice area: [N × F = $R/month]

3. **Opportunity Cost:**
   - Hours freed up per week: [X hours]
   - Billable work that could be done instead: [X × $Y/hour = $O/week]

**Value Calculation:**
```
Monthly Value = Time Savings + Opportunity Cost
              = ($W/month) + ($O/week × 4)

Price as % of Value = $99 / Monthly Value = [X%]

Target: Price should be <10% of monthly value created
```

**Example:**
```
Lawyer spends 5 hours/week on appointments
Billing rate: $200/hour
Time cost: 5 × $200 = $1,000/week = $4,000/month

NEXUS Alert price: $99/month
Value capture: $99 / $4,000 = 2.5% of value created

ROI: 40x ($4,000 saved for $99 spent)
```

---

## Willingness to Pay (WTP) Testing

**Van Westendorp Price Sensitivity Meter**

Ask 4 questions during interview:

1. **"Too Cheap"** (Quality concern)
   - "At what price would you feel this is too cheap to be reliable?"
   - Answer: $[X]

2. **"Bargain"** (Great value)
   - "At what price would you consider this a bargain - a great buy?"
   - Answer: $[Y]

3. **"Expensive"** (Getting pricey)
   - "At what price would you consider this expensive, but still worth considering?"
   - Answer: $[Z]

4. **"Too Expensive"** (Dealbreaker)
   - "At what price would you say this is too expensive - you would not consider it?"
   - Answer: $[W]

**Analysis:**
- Plot responses on a graph
- Optimal Price Point (OPP) = intersection of "Too Cheap" and "Too Expensive"
- Acceptable Range = between "Bargain" and "Expensive"

**Expected Ranges:**
- Too cheap: $20-40/mo
- Bargain: $50-80/mo
- Expensive: $120-150/mo
- Too expensive: $200-300/mo

**Target Validation:**
- If $99 falls within "Bargain" to "Expensive" range → ✅ Price validated
- If $99 is at or beyond "Too Expensive" → ❌ Lower price or add value

---

## Competitive Pricing Benchmark

| Competitor | Price | Features | Gaps |
|------------|-------|----------|------|
| **Manual checking** | $0 (time cost: $4K/mo) | Free, unreliable | Huge time sink |
| **Virtual Assistant** | $600-800/mo (part-time) | Human, flexible | Expensive, not 24/7 |
| **Case Management Add-on** | $50-100/mo per user | Integrated, not specialized | Generic, slow checks |
| **NEXUS Alert Pro** | $99/mo | Specialized, fast, reliable | [Position here] |

**Competitive Position:**
- Premium vs manual (free)
- Fraction of VA cost
- Better than generic case management

**Pricing Strategy:**
→ **Value-based premium**: $99/mo positions as professional tool, not commodity

---

## Price Objection Handling Matrix

| Objection | Response | Reframe |
|-----------|----------|---------|
| "That's expensive" | "How much time do you spend weekly?" | Show ROI: $99 vs $4K time cost |
| "We can do this manually" | "How's that working for you?" | Highlight opportunity cost |
| "Clients should pay" | "Most firms bundle this into service" | Premium positioning |
| "Not in our budget" | "What's your legal tech budget?" | Find budget, or per-client model |
| "Need approval from partner" | "What would convince them?" | Offer trial + ROI report |
| "Let me think about it" | "What's holding you back?" | Uncover real objection |

---

## Pricing Validation Success Metrics

**Strong Validation (✅ Proceed with $99/mo):**
- 2+ of 3 lawyers say they'd pay $99/mo today
- Average WTP "Too Expensive" threshold > $120/mo
- ROI > 10x (value created > $1,000/mo)
- No sticker shock or long pauses when price mentioned
- Objections are about features, not price

**Weak Validation (⚠️ Consider $79/mo or different model):**
- Only 1 of 3 lawyers would pay $99/mo
- Average WTP "Too Expensive" threshold < $100/mo
- ROI < 5x
- Frequent "that's expensive" reactions
- Requests for cheaper tier or per-client pricing

**Failed Validation (❌ Pivot pricing model):**
- 0 of 3 lawyers would pay $99/mo
- Average WTP "Too Expensive" threshold < $80/mo
- ROI < 3x
- Immediate rejection of price
- Suggestions that it should be $20-40/mo

---

## Alternative Pricing Models (If $99 Fails)

### Option 1: Per-Client Pass-Through
- **Price:** $8-12 per client per month
- **Positioning:** "White-label appointment service for your clients"
- **Pros:** Aligns with their billing model, scales with usage
- **Cons:** Harder to predict revenue, requires client consent

### Option 2: Freemium + Upsell
- **Free:** Up to 5 clients, 15-min checks
- **Pro:** $49/mo for 10-20 clients, 2-min checks
- **Pros:** Lower barrier to entry, land-and-expand
- **Cons:** Leaves money on table from high-volume firms

### Option 3: Revenue Share
- **Price:** 10-20% of appointment fees charged to clients
- **Positioning:** "Pay only when you succeed"
- **Pros:** Zero upfront cost, fully aligned incentives
- **Cons:** Complex tracking, requires trust/transparency

### Option 4: Setup Fee + Monthly
- **Price:** $299 one-time setup + $69/mo
- **Positioning:** "Professional onboarding + ongoing monitoring"
- **Pros:** Higher initial revenue, covers onboarding cost
- **Cons:** Higher barrier to trial

---

## Pricing Recommendation Template

**After 3 interviews, complete this:**

**Recommended Price:** $[X]/mo

**Supporting Data:**
- Average willingness to pay: $[Y]/mo
- Average value created: $[Z]/mo
- ROI at recommended price: [R]x
- Competitive positioning: [Premium / Mid-tier / Value]

**Validation Evidence:**
- [X] of 3 lawyers said they'd buy at this price
- Average "bargain" price: $[A]
- Average "too expensive" price: $[B]
- Our price falls in acceptable range: [Yes/No]

**Confidence Level:** [High / Medium / Low]

**Next Steps:**
- [ ] Launch at $[X]/mo for first 10 B2B customers
- [ ] Run A/B test: $79 vs $99 on landing page
- [ ] Offer annual plan at $[X × 10]/year
- [ ] Review pricing after 50 B2B customers based on churn data

**Contingency:**
If <2 of first 10 customers convert, test:
- Lower price: $[X - 20]/mo
- Different model: [Per-client / Freemium / Revenue share]
- Add value: [Feature that justifies premium]

---

## Interview Pricing Questions Checklist

During each interview, ensure you cover:

- [ ] Current time spent on appointment monitoring (hours/week)
- [ ] Hourly billing rate or loaded labor cost
- [ ] Number of NEXUS clients per month
- [ ] Current tools/services used and their cost
- [ ] Van Westendorp 4 questions (too cheap, bargain, expensive, too expensive)
- [ ] Reaction to $99/mo price point
- [ ] Preference: flat fee vs per-client pricing
- [ ] Willingness to commit to annual plan
- [ ] Budget approval process and timeline
- [ ] Would you buy this today at $99/mo? (Yes/No)
