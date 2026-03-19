/**
 * Cold Email Sequence for Immigration Lawyers
 * Target: Immigration law firms handling NEXUS, Global Entry, and SENTRI applications
 *
 * Campaign Structure:
 * - 7 emails over 21 days
 * - Focus on pain points: time waste, client satisfaction, revenue impact
 * - Strong CTAs: demo booking, ROI calculator, case studies
 */

export interface EmailTemplate {
  id: string;
  subject: string;
  body: string;
  dayOffset: number; // Days after initial contact
  purpose: string;
}

export const lawyersEmailSequence: EmailTemplate[] = [
  // EMAIL 1: Initial outreach - Problem awareness
  {
    id: 'lawyer-001',
    subject: 'Are your paralegals spending hours refreshing the GOES website?',
    dayOffset: 0,
    purpose: 'Introduce pain point, establish credibility',
    body: `Hi {{firstName}},

I noticed {{firmName}} handles NEXUS and Global Entry applications. Quick question:

How much time does your team spend manually checking for appointment slots for clients?

Most immigration firms we talk to say their paralegals waste 8-10 hours per client on this alone. At $40/hour, that's $320-400 of unbillable labor per client.

We built NEXUS Alert specifically to solve this problem. It monitors appointment slots 24/7 and sends instant alerts when openings appear at your clients' preferred locations.

**The result?**
- 85% faster booking times (2-3 weeks vs. 3-6 months)
- $12K+ saved annually in staff time
- Happier clients who refer more business

50+ immigration law firms (including {{competitorFirm}} and {{competitorFirm2}}) are already using it.

Worth a 15-minute conversation?

Best,
Michael
Founder, NEXUS Alert

P.S. - Here's a 2-minute demo video: [link]`,
  },

  // EMAIL 2: Value proposition - ROI focus
  {
    id: 'lawyer-002',
    subject: 'Re: GOES appointment monitoring - ROI breakdown',
    dayOffset: 3,
    purpose: 'Follow-up with specific ROI data',
    body: `Hi {{firstName}},

Following up on my last email about automating NEXUS appointment monitoring.

I put together a quick ROI breakdown based on typical firms your size:

**Your Current Cost (estimated):**
- {{clientVolume}} NEXUS/GE clients per year
- 8 hours per client (manual checking)
- $40/hour paralegal rate
- **= ${{annualLaborCost}} in labor costs**

**With NEXUS Alert (Business tier):**
- $199/month = $2,388/year
- **Net savings: ${{netSavings}}/year**
- **ROI: {{roi}}%**

Plus the intangibles:
- Clients book 85% faster → higher satisfaction → more referrals
- Your team focuses on billable legal work, not appointment hunting
- Competitive edge: offer "exclusive appointment monitoring technology"

Want to see it in action? I can show you exactly how it works for your practice in 15 minutes.

[Book a demo]

Best,
Michael

P.S. - First 10 firms get 20% off annual plans. Spots going fast.`,
  },

  // EMAIL 3: Social proof - Case study
  {
    id: 'lawyer-003',
    subject: 'How BorderCross Legal saved $36K/year with NEXUS Alert',
    dayOffset: 7,
    purpose: 'Build credibility with case study',
    body: `Hi {{firstName}},

Thought you'd find this interesting.

BorderCross Legal (Seattle) was managing 150+ NEXUS clients annually. Their challenge: two full-time paralegals doing nothing but refreshing the GOES website.

**Their old process:**
- Manual checking 3-4x daily per client
- Average booking time: 4-6 months
- Staff burnout, client complaints, refund requests

**After switching to NEXUS Alert:**
- Automated monitoring (checks every 60 seconds)
- Average booking time: 2-3 weeks
- Freed up 2 FTEs to do actual legal work
- **$36K annual savings in labor costs**

Senior Associate Michael Rodriguez said: *"Client satisfaction is up, refund requests are down. It's a game-changer."*

Full case study here: [link]

Would your firm benefit from similar results? Happy to walk you through how we'd set it up for {{firmName}}.

[Book a 15-minute demo]

Best,
Michael

P.S. - We also offer white-label branding so you can present it as your own proprietary tech.`,
  },

  // EMAIL 4: Differentiation - Feature highlight
  {
    id: 'lawyer-004',
    subject: 'NEXUS Alert vs. manual checking (comparison)',
    dayOffset: 10,
    purpose: 'Educate on product capabilities vs. status quo',
    body: `Hi {{firstName}},

Quick comparison for you:

**Manual Checking:**
❌ Staff refreshes GOES 3-4x daily
❌ Slots missed overnight/weekends
❌ 3-6 month average booking time
❌ $320-400 labor cost per client
❌ Clients frustrated, blame you

**NEXUS Alert (automated):**
✅ Checks every 60 seconds (Business tier)
✅ 24/7 monitoring, never misses slots
✅ 2-3 week average booking time
✅ $2-4 per client (at scale)
✅ Clients delighted, refer friends

**Plus features built FOR law firms:**
• Bulk CSV upload (manage 100+ clients)
• Client portal (reduces "any updates?" emails by 80%)
• Multi-channel alerts (email, SMS, Slack)
• Reporting dashboard (track success rates, ROI)
• White-label option (present as your own tech)

Currently used by 50+ immigration firms across North America.

Want to see how it works for {{firmName}} specifically? I'll show you the exact setup in 15 minutes.

[Book demo here]

Best,
Michael

P.S. - 14-day free trial, no credit card required.`,
  },

  // EMAIL 5: Objection handling - Risk reversal
  {
    id: 'lawyer-005',
    subject: 'Re: NEXUS Alert - Common questions answered',
    dayOffset: 14,
    purpose: 'Address common objections, reduce friction',
    body: `Hi {{firstName}},

Still thinking it over? Here are the questions most firms ask:

**Q: "We already have our own system."**
A: Most firms say this, but their "system" is staff manually checking. Average cost: $38K/year. Our Business tier: $2,388/year. That's a 16x difference.

**Q: "What if it doesn't work for us?"**
A: 14-day free trial (no credit card). Test with real clients before paying anything. Plus 30-day money-back guarantee if it's not working.

**Q: "Is client data secure?"**
A: SOC 2 Type II compliant. AES-256 encryption at rest, TLS 1.3 in transit. BAA available for HIPAA if needed. We never sell or share data.

**Q: "How long does setup take?"**
A: 30 minutes for initial onboarding. Upload a CSV with client preferences, and you're live. We handle all the technical setup.

**Q: "Can we white-label it?"**
A: Yes (Enterprise tier). Custom domain, your logo/colors, no NEXUS Alert branding. Present it as your proprietary technology.

Still have questions? Let's talk. I can address anything specific to {{firmName}} in a quick call.

[Book 15 minutes]

Best,
Michael

P.S. - Serious about trying it? I'll throw in an extra month free if you book a demo this week.`,
  },

  // EMAIL 6: Urgency - Limited offer
  {
    id: 'lawyer-006',
    subject: 'Final spot: 20% lifetime discount (immigration firms only)',
    dayOffset: 17,
    purpose: 'Create urgency with limited-time offer',
    body: `Hi {{firstName}},

Quick heads-up:

We're closing the "early adopter" program for immigration firms this Friday. After that, standard pricing applies.

**Current offer (ends Friday):**
• 20% lifetime discount on annual plans
• Priority onboarding (setup within 48 hours)
• 3 months free on annual Business plan ($597 value)
• Dedicated account manager for first 90 days

**Business tier (normally $2,388/year):**
• Your price: **$1,910/year** (locked in forever)
• Monitor up to 50 clients
• 60-second check frequency
• Client portal, API access, Slack integration

**Professional tier (normally $3,990/year):**
• Your price: **$3,192/year** (locked in forever)
• Monitor up to 200 clients
• 30-second check frequency
• White-label branding option

This offer is specifically for immigration law firms. After Friday, it's gone.

If you're interested, let's schedule a quick demo this week so you can see it in action before committing.

[Book demo - last chance for discount]

Best,
Michael

P.S. - Already have {{competitorCount}} firms locked in at this rate. Don't want you to miss out.`,
  },

  // EMAIL 7: Breakup email - Final attempt
  {
    id: 'lawyer-007',
    subject: 'Should I close your file?',
    dayOffset: 21,
    purpose: 'Last-ditch effort, permission to close',
    body: `Hi {{firstName}},

I've reached out a few times about NEXUS Alert, but haven't heard back.

I'm guessing one of three things:

1. **You're not interested** → Totally fine! Just let me know so I stop bothering you.

2. **Bad timing** → I get it. Want me to follow up in a few months?

3. **You're still evaluating** → Happy to answer any questions or concerns holding you back.

Either way, I'll respect your decision. Just reply with:
- "Not interested" (and I'll leave you alone)
- "Follow up in [month]" (and I'll check back then)
- "Let's talk" (and I'll book a time)

Thanks for your time,
Michael

P.S. - If I don't hear back, I'll assume it's not a fit and close your file. No hard feelings!`,
  },
];

// Email metrics to track
export interface EmailMetrics {
  emailId: string;
  sent: number;
  opened: number;
  clicked: number;
  replied: number;
  booked: number;
  unsubscribed: number;
}

// Expected benchmark metrics (industry averages for B2B cold email)
export const benchmarkMetrics = {
  openRate: 0.25, // 25%
  clickRate: 0.05, // 5%
  replyRate: 0.03, // 3%
  bookingRate: 0.01, // 1%
  unsubscribeRate: 0.005, // 0.5%
};

// Campaign tracking helper
export function calculateCampaignROI(
  totalSent: number,
  demosBooked: number,
  dealsWon: number,
  avgContractValue: number,
  campaignCost: number
): {
  demoBookingRate: number;
  winRate: number;
  revenue: number;
  roi: number;
} {
  const demoBookingRate = demosBooked / totalSent;
  const winRate = dealsWon / demosBooked;
  const revenue = dealsWon * avgContractValue;
  const roi = ((revenue - campaignCost) / campaignCost) * 100;

  return {
    demoBookingRate,
    winRate,
    revenue,
    roi,
  };
}
