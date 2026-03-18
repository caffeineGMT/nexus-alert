# Monthly to Annual Conversion Email Campaign

**Objective:** Convert existing monthly subscribers ($4.99/mo) to annual plan ($49.99/year) with scarcity messaging and value proposition.

**Target:** All active monthly Premium subscribers

**Timeline:** Send within 14 days of annual plan launch

---

## Email Sequence

### Email 1: Launch Announcement (Day 1)
**Subject:** 🎁 New Annual Plan: Save $10/year on NEXUS Alert Premium

**Body:**

```
Hi there,

Great news! We just launched an annual billing option for NEXUS Alert Premium.

**Switch to annual and save $10/year:**
- Monthly: $4.99/mo ($59.88/year)
- Annual: $49.99/year ($4.16/mo)
- **You save: $9.89/year**

As an existing monthly subscriber, switching is easy:
1. Click the link below
2. Complete the quick checkout
3. We'll automatically cancel your monthly subscription
4. You're all set for a full year!

[Switch to Annual Plan →]

**Limited time offer:** Lock in the $49.99 annual rate before it increases to $59.99 on April 1.

This is our way of saying thank you for being an early supporter. Annual subscribers get priority support and early access to new features like SMS alerts.

Questions? Just hit reply.

Thanks for using NEXUS Alert!

Michael
Founder, NEXUS Alert

P.S. Current monthly subscribers who switch by March 31 get a prorated credit applied to their first annual payment.
```

---

### Email 2: Value Reminder (Day 7)
**Subject:** You could be saving $10/year (annual plan reminder)

**Body:**

```
Hi again,

Quick reminder: our annual plan saves you $10/year compared to monthly billing.

Here's the math:
- 12 months × $4.99 = **$59.88/year**
- Annual plan = **$49.99/year**
- **Your savings: $9.89**

Plus, you'll never have to worry about:
- Monthly renewals
- Payment interruptions
- Price increases

**Lock in $49.99/year before the price goes up to $59.99 on April 1.**

[Switch to Annual →]

Still love monthly? No problem! We just wanted to make sure you didn't miss this opportunity to save.

Best,
Michael
```

---

### Email 3: Final Scarcity Push (Day 14)
**Subject:** ⏰ Last chance: Annual plan price increases in 48 hours

**Body:**

```
Hi,

This is your last chance to lock in the NEXUS Alert annual plan at the launch price.

**Price change in 48 hours:**
- Current: $49.99/year
- After March 31: $59.99/year

If you switch now, you'll save:
- $10/year vs. staying on monthly
- An extra $10/year vs. the new annual price
- **Total savings: $20/year**

This is the lowest price the annual plan will ever be.

[Lock in $49.99/year →]

Questions? Hit reply.

Thanks,
Michael

P.S. You can cancel anytime and get a prorated refund. No risk.
```

---

## Technical Implementation

### ConvertKit Automation

1. **Segment:** `premium_monthly_active`
   - Filter: `subscription_status = active`
   - Filter: `billing_cycle = monthly`
   - Filter: `created_at > [launch_date - 90 days]` (recent subscribers only)

2. **Exclusions:**
   - Already on annual plan
   - Cancelled within last 30 days
   - Marked as "do not contact"

3. **Trigger:**
   - Send Email 1 immediately upon segmentation
   - Send Email 2 after 7 days (if not converted)
   - Send Email 3 after 14 days (if not converted)

4. **Exit Conditions:**
   - User switches to annual plan (tag: `converted_to_annual`)
   - User unsubscribes
   - User cancels subscription

### Tracking

**UTM Parameters:**
```
utm_source=email
utm_medium=convertkit
utm_campaign=monthly_to_annual
utm_content=[email_1|email_2|email_3]
```

**Conversion Events:**
- Track `monthly_to_annual_email_open` (Email 1, 2, 3)
- Track `monthly_to_annual_link_click` (CTA clicks)
- Track `monthly_to_annual_conversion` (Successful switch)

### Backend API Endpoint

Create `/api/switch-to-annual` endpoint:

```javascript
// POST /api/switch-to-annual
{
  email: "user@example.com",
  utm_source: "email",
  utm_campaign: "monthly_to_annual"
}

// Response:
// 1. Verify user has active monthly subscription
// 2. Create annual Stripe checkout session
// 3. Set metadata: switching_from_monthly=true
// 4. Calculate prorated credit
// 5. Return checkout URL
```

### Stripe Webhook Handler

When annual subscription created:
1. Check for `switching_from_monthly=true` metadata
2. Cancel existing monthly subscription
3. Apply prorated credit (if applicable)
4. Send confirmation email
5. Tag user in ConvertKit: `converted_to_annual`

---

## Copy Variations (A/B Test)

### Subject Line Tests
- Control: "🎁 New Annual Plan: Save $10/year on NEXUS Alert Premium"
- Variant A: "You're paying too much for NEXUS Alert (here's why)"
- Variant B: "⏰ Lock in $49.99/year before price increases"

### CTA Button Text
- Control: "Switch to Annual Plan"
- Variant A: "Save $10/year →"
- Variant B: "Lock in $49.99/year"

---

## Success Metrics

**Target:** 30% conversion rate from monthly to annual within 14 days

**Track:**
- Email open rates (target: 40%+)
- Link click rates (target: 15%+)
- Conversion rate (target: 30%+)
- Revenue impact (target: +$1,200 MRR → ARR)

**Optimization:**
- If Email 1 conversion < 10%, test subject line variants
- If Email 2 conversion < 5%, increase urgency messaging
- If Email 3 conversion < 3%, extend deadline by 7 days

---

## Customer Support Scripts

### FAQ: "Why should I switch to annual?"

**Answer:**
"The annual plan saves you $10/year compared to monthly billing ($49.99/year vs. $59.88/year). Plus, you lock in the current rate and avoid future price increases. Annual subscribers also get priority support and early access to new features."

### FAQ: "What happens to my current subscription?"

**Answer:**
"When you switch to annual, we'll automatically cancel your monthly subscription and apply any prorated credit to your annual payment. There's no interruption in service — you'll continue to get 2-minute checks immediately."

### FAQ: "Can I get a refund if I cancel?"

**Answer:**
"Yes! If you cancel within 30 days, we'll give you a full refund. After 30 days, we'll prorate your refund based on the remaining months. No questions asked."

---

## Rollout Checklist

- [ ] Create ConvertKit email sequences (3 emails)
- [ ] Set up UTM tracking parameters
- [ ] Build `/api/switch-to-annual` endpoint
- [ ] Update Stripe webhook handler for prorated cancellations
- [ ] Create landing page: `/switch-to-annual` with FAQ
- [ ] Test email rendering (Gmail, Outlook, Apple Mail)
- [ ] Segment monthly subscribers in ConvertKit
- [ ] Schedule Email 1 send date
- [ ] Set up Plausible goal tracking for conversions
- [ ] Prepare customer support team with FAQ scripts

---

## Post-Campaign Analysis

After 14 days:
1. Calculate conversion rate (target: 30%)
2. Analyze by cohort (install date, usage frequency, location)
3. Identify best-performing email variant
4. Document learnings for future campaigns
5. Plan follow-up campaign for non-converters (60-day nurture)
