# Feature Requirements Matrix - B2B Pro Tier

**Purpose:** Track which features are must-haves vs nice-to-haves based on immigration lawyer feedback.

**Status Legend:**
- ✅ **Shipped** - Already built and live
- 🚧 **In Progress** - Currently building
- 📋 **Planned** - On roadmap, not started
- 💡 **Requested** - Came from interviews, needs validation
- ❌ **Rejected** - Won't build (explain why)

---

## Core Features (Existing Product)

| Feature | Status | Interview 1 | Interview 2 | Interview 3 | Priority | Notes |
|---------|--------|-------------|-------------|-------------|----------|-------|
| **Automated slot checking** | ✅ Shipped | | | | P0 | Every 30min (free) / 2min (premium) |
| **Email notifications** | ✅ Shipped | | | | P0 | When slots found |
| **Multi-location monitoring** | ✅ Shipped | | | | P0 | User can select multiple enrollment centers |
| **Desktop notifications** | ✅ Shipped | | | | P1 | Browser push notifications |
| **Chrome extension** | ✅ Shipped | | | | P0 | Core product delivery |
| **Stripe payment integration** | ✅ Shipped | | | | P0 | $4.99/mo premium |

**Validation Questions for Interviews:**
- ✅ Is 2-minute checking fast enough for your use case?
- ✅ Are email notifications sufficient, or do you need SMS/phone?
- ✅ Does multi-location monitoring meet your needs?

---

## B2B Pro Features (Hypothesis)

| Feature | Status | Interview 1 | Interview 2 | Interview 3 | Priority | Build Effort | Notes |
|---------|--------|-------------|-------------|-------------|----------|--------------|-------|
| **Multi-client dashboard** | 📋 Planned | | | | P0 | 3 days | View all clients in one place |
| **Client management (add/remove)** | 📋 Planned | | | | P0 | 2 days | CRUD operations for clients |
| **White-label email notifications** | 📋 Planned | | | | P1 | 2 days | Send from law firm domain |
| **API access** | 📋 Planned | | | | P2 | 3 days | For integrations |
| **20-client limit** | 📋 Planned | | | | P0 | 1 day | Enforce limit in backend |
| **$99/mo Pro tier pricing** | 📋 Planned | | | | P0 | 1 day | Stripe price ID + checkout |

**Validation Questions:**
- 🔍 How do you currently track which clients need appointment help?
- 🔍 Is white-labeling critical, or can emails come from "NEXUS Alert on behalf of [Firm]"?
- 🔍 Do you use case management software that we should integrate with?
- 🔍 Is 20 clients the right limit, or do you typically manage more?

---

## Requested Features (Interview Findings)

### Interview 1: [Lawyer Name, Firm]

| Feature Requested | Exact Quote | Priority Stated | Dealbreaker? | Status | Notes |
|-------------------|-------------|-----------------|--------------|--------|-------|
| [Feature name] | "[Quote from interview]" | Critical / Nice / Don't care | Yes / No | 💡 New | [Assessment] |
| | | | | | |

### Interview 2: [Lawyer Name, Firm]

| Feature Requested | Exact Quote | Priority Stated | Dealbreaker? | Status | Notes |
|-------------------|-------------|-----------------|--------------|--------|-------|
| | | | | | |

### Interview 3: [Lawyer Name, Firm]

| Feature Requested | Exact Quote | Priority Stated | Dealbreaker? | Status | Notes |
|-------------------|-------------|-----------------|--------------|--------|-------|
| | | | | | |

---

## Feature Categories to Explore

### 1. Client Management

**Hypothesis:** Lawyers need bulk operations and client metadata.

| Feature | Description | Validation Question | Interview 1 | Interview 2 | Interview 3 |
|---------|-------------|---------------------|-------------|-------------|-------------|
| **Bulk client upload** | CSV import of clients | "Do you have a list of clients you'd want to upload all at once?" | | | |
| **Client notes/tags** | Custom fields per client | "Do you need to track notes like 'Priority client' or 'Expires on X date'?" | | | |
| **Client search/filter** | Find clients quickly | "With 20 clients, how would you find a specific one?" | | | |
| **Client status tracking** | Active/Paused/Archived | "Do clients sometimes pause their search?" | | | |

### 2. Notification & Communication

| Feature | Description | Validation Question | Interview 1 | Interview 2 | Interview 3 |
|---------|-------------|---------------------|-------------|-------------|-------------|
| **SMS notifications** | Text alerts when slots found | "Would you want SMS in addition to email?" | | | |
| **Phone call alerts** | Automated voice call | "For urgent clients, would you want phone calls?" | | | |
| **Slack integration** | Post to firm's Slack channel | "Does your firm use Slack or Teams?" | | | |
| **Email templates** | Customize notification wording | "Do you want to customize the email your clients receive?" | | | |
| **CC firm email** | Copy lawyer on all notifications | "Should you be CC'd on every notification?" | | | |

### 3. Integrations

| Feature | Description | Validation Question | Interview 1 | Interview 2 | Interview 3 |
|---------|-------------|---------------------|-------------|-------------|-------------|
| **Clio integration** | Sync with Clio case management | "Do you use Clio?" | | | |
| **MyCase integration** | Sync with MyCase | "Do you use MyCase?" | | | |
| **PracticePanther integration** | Sync with PracticePanther | "Do you use PracticePanther?" | | | |
| **Zapier integration** | Connect to 1000+ apps | "Would Zapier integration be useful?" | | | |
| **API webhooks** | Push notifications to your system | "Do you have developers who could use webhooks?" | | | |

### 4. Reporting & Analytics

| Feature | Description | Validation Question | Interview 1 | Interview 2 | Interview 3 |
|---------|-------------|---------------------|-------------|-------------|-------------|
| **Slots found report** | Weekly summary of appointments | "Would you want a weekly report of slots found?" | | | |
| **Client activity log** | When slots were checked/found | "Do you need an audit trail?" | | | |
| **Success metrics** | % of clients who found slots | "Do you track success rates for this service?" | | | |
| **Time saved calculator** | Hours saved estimate | "Would ROI reporting be useful for your records?" | | | |

### 5. White-Label & Branding

| Feature | Description | Validation Question | Interview 1 | Interview 2 | Interview 3 |
|---------|-------------|---------------------|-------------|-------------|-------------|
| **Custom sender domain** | emails@yourfirm.com | "Do you want emails from your domain?" | | | |
| **Custom logo in emails** | Firm logo instead of NEXUS Alert | "Should emails have your logo?" | | | |
| **Custom branded portal** | yourfirm.com/appointments | "Would your clients log in to your branded site?" | | | |
| **No "Powered by" branding** | Remove NEXUS Alert footer | "Is it important that clients don't see our branding?" | | | |

### 6. Advanced Monitoring

| Feature | Description | Validation Question | Interview 1 | Interview 2 | Interview 3 |
|---------|-------------|---------------------|-------------|-------------|-------------|
| **Priority locations** | Check certain locations first | "Do some enrollment centers matter more?" | | | |
| **Date range filters** | Only want appointments in Q2 | "Do clients have date constraints?" | | | |
| **Waitlist alerts** | Notify when spot in queue opens | "Do you track the GOES waitlist?" | | | |
| **Faster checking (1min)** | Upgrade from 2min to 1min | "Is 2 minutes fast enough, or need faster?" | | | |

### 7. Support & Training

| Feature | Description | Validation Question | Interview 1 | Interview 2 | Interview 3 |
|---------|-------------|---------------------|-------------|-------------|-------------|
| **Dedicated account manager** | 1-on-1 support contact | "Would you pay more for dedicated support?" | | | |
| **Onboarding call** | 30-min setup assistance | "Would you want help setting this up?" | | | |
| **Training materials** | How-to videos for staff | "Do you need to train paralegals to use this?" | | | |
| **Priority support** | <4hr response time | "How fast do you need support responses?" | | | |

---

## Post-Interview Analysis

**After each interview, update this section:**

### Must-Have Features (Mentioned by 2+ lawyers)

| Feature | Mentioned By | Reasoning | Build Effort | ROI |
|---------|--------------|-----------|--------------|-----|
| [Feature] | Interview 1, 2 | "[Why they need it]" | [Days] | [High/Med/Low] |

### Nice-to-Have Features (Mentioned by 1 lawyer)

| Feature | Mentioned By | Reasoning | Build Effort | ROI |
|---------|--------------|-----------|--------------|-----|
| [Feature] | Interview 1 | "[Why they need it]" | [Days] | [High/Med/Low] |

### Rejected Features (Won't Build)

| Feature | Reason for Rejection | Alternative Solution |
|---------|----------------------|----------------------|
| [Feature] | [Why it doesn't make sense] | [What they should do instead] |

---

## Feature Prioritization Framework

**Score each feature:**

| Criteria | Weight | Scale |
|----------|--------|-------|
| **Customer Demand** | 30% | # of interviews that requested it |
| **Competitive Differentiation** | 25% | Does this set us apart? (1-5) |
| **Build Effort** | 20% | Inverse of days required (1-5) |
| **Revenue Impact** | 25% | Will this increase conversions/retention? (1-5) |

**Formula:**
```
Priority Score = (Demand × 0.3) + (Differentiation × 0.25) + (Ease × 0.2) + (Revenue × 0.25)
```

**Build Roadmap:**
1. Score > 4.0 → Build immediately (before launch)
2. Score 3.0-4.0 → Build in first 30 days
3. Score 2.0-3.0 → Build in first 90 days
4. Score < 2.0 → Backlog (revisit after 50 customers)

---

## Competitive Feature Comparison

| Feature | NEXUS Alert Pro | Competitor 1 | Competitor 2 | Virtual Assistant |
|---------|-----------------|--------------|--------------|-------------------|
| Multi-client dashboard | ✅ Planned | ❌ | ? | ❌ |
| 2-minute checking | ✅ Shipped | ? | ? | ❌ (Manual) |
| White-label emails | ✅ Planned | ? | ? | ✅ |
| API access | ✅ Planned | ? | ? | ❌ |
| Price | $99/mo | ? | ? | $600-800/mo |

**Differentiation Opportunities:**
- [Feature gap we can exploit]
- [Feature gap we can exploit]

---

## Feature Validation Success Criteria

**Strong Validation (✅ Build it):**
- 2+ of 3 lawyers mention it unprompted
- At least 1 says it's a dealbreaker without it
- Clear competitive advantage
- Build effort < 5 days

**Weak Validation (⚠️ Investigate more):**
- 1 of 3 lawyers mentions it
- "Nice to have" but not critical
- Competitors already have it
- Build effort > 5 days

**No Validation (❌ Don't build):**
- 0 of 3 lawyers care about it
- Too niche (only helps 1 specific use case)
- Too complex (would confuse other users)
- Build effort > 10 days with uncertain ROI

---

## Interview Prep Checklist

Before each interview, review:

- [ ] Print this feature matrix
- [ ] Prepare to demo existing features
- [ ] Prepare mockups/wireframes of planned features
- [ ] List 3-5 features to specifically validate
- [ ] Have pricing tiers ready to show feature differences

During interview:

- [ ] Show feature, then ask "Is this useful?"
- [ ] Listen for unprompted feature requests
- [ ] Ask "What's missing?" after demo
- [ ] Validate priority: Critical / Nice / Don't care

After interview:

- [ ] Update this matrix within 1 hour
- [ ] Synthesize findings across all interviews
- [ ] Prioritize roadmap based on scores
- [ ] Share with team for build planning
