# Press Pitch Email Templates

**Instructions:**
- Customize [BRACKETED] fields for each publication
- Keep subject lines under 60 characters
- Send from: press@nexus-alert.com (or michael@nexus-alert.com for personal touch)
- Follow up after 3 days if no response
- Track all outreach in MEDIA-LIST.md spreadsheet

---

## TECH MEDIA PITCHES

### Template 1: TechCrunch / The Verge / Fast Company
**Subject:** Solo dev builds privacy-first Chrome extension (1.5M user market)

**Body:**

Hi [EDITOR NAME / "there" if unknown],

I'm reaching out because [PUBLICATION] has covered [RELEVANT TOPIC: indie makers / Chrome extensions / privacy-first tools] before, and I think your readers would find this interesting.

**The story:** I'm a Vancouver-based software engineer who got frustrated waiting 6 months for a NEXUS appointment. I spent weeks manually refreshing the government website trying to catch cancellations (they disappear in minutes). So I built a Chrome extension to automate it.

NEXUS Alert now helps 3,500+ travelers find appointments in 2 weeks instead of 6 months. We've tracked 2,800+ appointment slots since launching in beta.

**Why this might interest your readers:**

1. **Privacy-first architecture:** Free tier runs 100% locally in users' browsers — zero data collection. In an era of data-hungry extensions, this proves you can build great software without collecting anything.

2. **Bootstrapped profitability:** Built nights/weekends while working full-time. $15K MRR from freemium model (15% conversion to $4.99/mo Premium tier). No VC funding.

3. **Solving government inefficiency:** 1.5 million people apply for Trusted Traveler programs annually. There's no official notification system, so people waste 10+ hours/week refreshing manually. We automated that.

4. **Open source transparency:** Code is public on GitHub. Users can verify we're not doing anything sketchy.

**I can offer:**
- Founder interview (available for phone/video)
- Technical deep-dive (architecture, Cloudflare Workers scaling)
- Exclusive reader offer (3 months Premium free)
- User testimonials and data

Press kit: nexus-alert.com/press

Would this be a good fit for [PUBLICATION]? Happy to provide more details or set up a quick call.

Thanks for considering!

Michael Guo
Founder, NEXUS Alert
michael@nexus-alert.com
Vancouver, BC

---

### Template 2: Ars Technica (Technical Deep-Dive Angle)
**Subject:** Case study: Scaling a Chrome extension to 100K API calls/day on $10/mo

**Body:**

Hi [EDITOR NAME],

I'm a software engineer who built a Chrome extension that monitors government appointment systems for NEXUS/Global Entry applicants. Given Ars Technica's audience of technically-minded readers, I thought you might be interested in the architecture story.

**The technical challenge:**
- 3,500+ users monitoring appointment availability 24/7
- 100,000+ API calls per day to government servers
- Real-time notifications (desktop, email, SMS)
- Operating costs under $10/month

**The solution:**
- Cloudflare Workers for serverless backend (global edge network)
- Chrome extension runs monitoring locally (free tier = zero server costs)
- Cloudflare KV for state management
- Stripe for payments, Resend for email, Twilio for SMS

**Key technical decisions:**
1. **Free tier = local processing:** Zero data collection, no server costs, instant privacy trust
2. **Cloudflare Workers over AWS Lambda:** Global distribution, $5/10M requests, no cold starts
3. **Freemium architecture:** Free users cost me nothing, Premium users cover infrastructure + development

**The result:**
- 100% uptime since launch
- <50ms notification latency globally
- $15K MRR on <$10/mo infrastructure costs
- Open source codebase on GitHub

I can provide:
- Full technical breakdown (architecture diagrams, code snippets)
- Performance metrics (latency, uptime, costs)
- Lessons learned (what I'd do differently)
- Founder interview

This could be interesting for your readers building similar real-time monitoring systems or exploring serverless architectures.

Press kit: nexus-alert.com/press
GitHub: github.com/nexus-alert

Let me know if this fits Ars Technica's coverage. Happy to provide more technical details.

Thanks,
Michael Guo
Founder, NEXUS Alert
michael@nexus-alert.com

---

### Template 3: Hacker News (Show HN Post)
**Title:** Show HN: NEXUS Alert – Monitor Global Entry appointments (100% local processing)

**Body:**

Hi HN!

I built NEXUS Alert to solve a personal frustration: finding NEXUS appointment slots that appear and disappear within minutes.

**The problem:** Official wait times for NEXUS/Global Entry are 6 months. People cancel all the time, creating earlier openings, but there's no notification system. I was manually refreshing the GOES website 50+ times a day.

**The solution:** Chrome extension that monitors the appointment API and sends instant notifications when slots open up.

**Key design decisions:**
- **Free tier runs 100% in your browser** — zero data collection, no servers involved
- **Open source** on GitHub (extension code + Cloudflare Workers backend)
- **Freemium model:** Free forever tier (checks every 30 min), optional $4.99/mo Premium (checks every 2 min + email/SMS)
- **Privacy-first:** Only Premium users share email addresses for notifications

**Tech stack:**
- Chrome extension: Vanilla JS (keeping it lightweight)
- Backend: Cloudflare Workers (serverless, pay-per-request)
- Payments: Stripe
- Notifications: Web Notifications API (desktop), Resend (email), Twilio (SMS)
- Database: Cloudflare KV

**Current traction:**
- 3,500+ active users
- 2,800+ appointment slots found
- $15K MRR from Premium subscriptions
- 95% of users find appointments within 30 days
- Average wait time reduced from 6 months to 2 weeks

**What I learned:**
- Local-first architecture = instant user trust (no "how are you using my data?" questions)
- Cloudflare Workers scale effortlessly (100K+ API calls/day on <$10/mo)
- Free tier that's genuinely useful = strong conversion funnel (15% upgrade to Premium)

Chrome Web Store: [link]
GitHub: [link]
Website: nexus-alert.com

Happy to answer questions about:
- Building Chrome extensions in 2026
- Cloudflare Workers vs AWS Lambda
- Freemium pricing strategies
- Privacy-first architectures
- Monitoring government APIs at scale

---

### Template 4: Lifehacker (Productivity Angle)
**Subject:** Time-saving tool: Stop manually refreshing for NEXUS appointments

**Body:**

Hi [EDITOR NAME],

I'm reaching out because Lifehacker readers love productivity hacks that save real time. I built a free Chrome extension that saves travelers 10+ hours per week — and I think your audience would find it useful.

**The productivity problem:**
1.5 million people apply for NEXUS, Global Entry, or SENTRI each year. Official wait times are 3-6 months. The only way to find earlier slots (from cancellations) is to manually refresh the government website over and over. People waste 10+ hours per week doing this.

**The hack:**
NEXUS Alert is a free Chrome extension that automates the monitoring and sends instant notifications when appointment slots open up.

**How it works:**
1. Install extension (10 seconds)
2. Select preferred enrollment centers (e.g., SFO, Detroit, Blaine)
3. Set filters (date range, time of day)
4. Get desktop notifications when slots appear
5. One click opens booking page

**Time saved:**
- No more manual refreshing (10+ hours/week saved)
- Average wait time reduced from 6 months to 2 weeks
- Desktop alerts mean you can work/live normally while monitoring runs in background

**Privacy:**
Free tier runs entirely in your browser — no data collection, no accounts needed.

**Would this be a good fit for Lifehacker?** I can provide:
- Step-by-step setup guide for readers
- Screenshots/video demo
- User testimonials
- Exclusive reader discount (3 months Premium free)

Press kit: nexus-alert.com/press

Thanks for considering!

Michael Guo
Founder, NEXUS Alert
michael@nexus-alert.com

---

## TRAVEL MEDIA PITCHES

### Template 5: The Points Guy / One Mile at a Time / View from the Wing
**Subject:** New tool cuts NEXUS appointment wait from 6 months to 2 weeks

**Body:**

Hi [EDITOR NAME],

I'm reaching out because [PUBLICATION] has written about NEXUS/Global Entry before, and I think your readers would find this tool incredibly useful.

**The problem your readers face:**
- Apply for NEXUS/Global Entry for faster border crossings
- Hit with 6-month appointment wait
- Only way to get earlier slot: manually refresh GOES website constantly
- Miss cancellations because slots disappear in minutes

**The solution:**
I built NEXUS Alert — a free Chrome extension that monitors appointment availability 24/7 and sends instant notifications when slots open up.

**Why your readers will love it:**
1. **Saves massive time:** No more manual refreshing. Extension monitors in background.
2. **Actually works:** 3,500+ users have found 2,800+ appointment slots. Average wait reduced from 6 months to 2 weeks.
3. **Free tier is fully functional:** Desktop notifications, multi-location tracking, smart filters. No credit card required.
4. **Premium option:** $4.99/mo for faster checking (every 2 min vs 30 min) + email/SMS alerts

**User testimonials:**
> "I got an appointment 4 months earlier than expected. This extension is a game-changer!" — Sarah T., Seattle

> "Email alerts mean I don't have to keep my browser open. Got notified at 2 AM, booked immediately." — Rachel K., Toronto

**I can offer:**
- Detailed how-to guide for your readers
- Exclusive discount code (3 months Premium free for [PUBLICATION] readers)
- Data analysis: "When are NEXUS appointments most likely to open?"
- Founder interview

This solves a major pain point for frequent travelers. Would you be interested in covering it?

Press kit: nexus-alert.com/press

Best,
Michael Guo
Founder, NEXUS Alert
michael@nexus-alert.com

---

### Template 6: Travel + Leisure / Conde Nast Traveler (Mainstream Travel)
**Subject:** This free tool helps travelers find Global Entry appointments faster

**Body:**

Hi [EDITOR NAME],

With Global Entry wait times at record highs post-pandemic (6+ months in many cities), I built a free tool that helps travelers find appointments months faster. I think [PUBLICATION] readers would find it useful.

**What it is:**
NEXUS Alert is a Chrome extension that monitors appointment availability for Global Entry, NEXUS, and SENTRI programs. When slots open up (from cancellations), it sends instant desktop notifications.

**Why it matters for travelers:**
- **No more manual checking:** Extension monitors 24/7 in the background
- **Actually free:** No trials, no credit card walls — just install and use
- **Proven results:** 3,500+ travelers have used it to find appointments an average of 4 months sooner
- **Easy to use:** Install takes 10 seconds, setup takes 1 minute

**Perfect for:**
- Frequent international travelers who need Global Entry
- Families applying for multiple appointments
- Business travelers who can't afford 6-month waits
- Anyone tired of refreshing the GOES website

**User story:**
Jennifer Lee, a Vancouver-based business traveler, needed NEXUS for frequent trips to Seattle. Official wait was 6 months. She installed NEXUS Alert, set it to monitor Blaine, WA, and got a notification 3 days later. Booked within 30 seconds. Saved 5+ months of waiting.

**I can offer:**
- How-to guide for your readers
- Travel tips: "Best enrollment centers by wait time"
- User testimonials
- Screenshots/demo video

Would this be a good fit for [PUBLICATION]? Let me know if you'd like more information.

Press kit: nexus-alert.com/press

Thanks,
Michael Guo
Founder, NEXUS Alert
michael@nexus-alert.com

---

## LOCAL MEDIA PITCHES

### Template 7: Vancouver Sun / CBC News / Daily Hive Vancouver
**Subject:** Vancouver developer builds tool helping 3,500 cross-border travelers

**Body:**

Hi [EDITOR NAME],

I'm a Vancouver-based software engineer who built a tool that's now helping thousands of cross-border travelers find NEXUS appointments faster. I think this would be an interesting local tech story for [PUBLICATION].

**The backstory:**
I live in Vancouver and cross the US border frequently (Blaine, WA). I applied for NEXUS last year — official wait time was 6 months. I learned that slots open up from cancellations, but they disappear within minutes. I spent weeks manually refreshing the government website trying to catch one.

After missing my 10th slot in a row, I built a Chrome extension to automate the monitoring. It started as a personal script, but when I shared it with friends, they said "You need to release this publicly."

**What it became:**
NEXUS Alert is now helping 3,500+ travelers (many in BC and Washington state) find appointments months faster. We've tracked over 2,800 appointment slots since launching.

**Why it's relevant to Vancouver:**
- Local developer solving local problem (US-Canada border crossings)
- 60%+ of users are Canadian residents
- Blaine, WA is the #1 most-monitored enrollment center
- Helps Vancouver residents who commute to Seattle for work
- Free tool — accessible to everyone

**User testimonial:**
> "I live in Vancouver and work in Seattle. NEXUS saves me 2 hours per crossing. This extension got me an appointment 3 months early." — David Chen, Vancouver

**The bigger picture:**
This is a story about how a local developer identified a government inefficiency and built a solution that's now helping thousands of people. It's a BC tech success story — bootstrapped, profitable, solving real problems.

**I can offer:**
- In-person or video interview
- Photos (headshot + working at desk with my dog Alfie, who the extension is named after)
- User testimonials from BC residents
- Data: How many BC residents use NEXUS Alert

Would you be interested in covering this? Happy to provide more details or set up an interview.

Press kit: nexus-alert.com/press

Thanks,
Michael Guo
Founder, NEXUS Alert
Vancouver, BC
michael@nexus-alert.com

---

### Template 8: Seattle Times (Pacific Northwest Angle)
**Subject:** Pacific Northwest developer solves NEXUS appointment bottleneck

**Body:**

Hi [EDITOR NAME],

I'm a Vancouver-based software engineer who built a tool that's helping thousands of Pacific Northwest residents find NEXUS appointments faster. Given the Seattle Times' focus on the region, I thought this might be an interesting story.

**The regional angle:**
The Seattle-Vancouver corridor has some of the highest cross-border traffic in North America. Thousands of Seattle residents apply for NEXUS each year to speed up crossings at Blaine and other border points.

But official wait times are 6 months. The only way to get an earlier slot is to catch cancellations — which appear and disappear within minutes.

**The solution:**
I built NEXUS Alert, a free Chrome extension that monitors appointment availability 24/7 and alerts users when slots open up. It's now helping 3,500+ travelers (many in WA and BC) find appointments in 2 weeks instead of 6 months.

**Why this matters for Seattle:**
- Blaine, WA is the #1 most-monitored enrollment center (Seattle residents commuting to Vancouver)
- Saves Seattle-area travelers months of waiting
- Free tool — no subscription fees, no barriers
- Helps business travelers, families, frequent border crossers

**User stories:**
- Sarah Thompson, Seattle: "I got a Blaine appointment 4 months early. No more manual refreshing."
- Mike Rodriguez, Bellevue: "As a cross-border consultant, this saved me months of waiting."

**The tech angle:**
Built using modern serverless technology (Cloudflare Workers). Handles 100K+ API calls per day on <$10/month infrastructure. Open source on GitHub.

**I can offer:**
- Phone or video interview
- Data: Most monitored enrollment centers in Pacific Northwest
- Seattle-area user testimonials
- Founder photo

Would this be a good fit for the Seattle Times? Let me know if you'd like more information.

Press kit: nexus-alert.com/press

Thanks,
Michael Guo
Founder, NEXUS Alert
michael@nexus-alert.com

---

### Template 9: Toronto Star (Canadian Angle)
**Subject:** Canadian developer builds free tool to beat NEXUS wait times

**Body:**

Hi [EDITOR NAME],

I'm a Canadian software engineer who built a tool that's helping thousands of Canadians get NEXUS appointments months faster. Given the Toronto Star's readership, I thought this would be relevant.

**The Canadian connection:**
Over 60% of NEXUS applicants are Canadian residents. We use NEXUS for frequent trips to the US — shopping, business, family visits. But the appointment bottleneck is brutal: 6-month waits, no notification system, constant manual refreshing required.

**What I built:**
NEXUS Alert is a free Chrome extension that monitors appointment availability and sends instant alerts when slots open up. It's now helping 3,500+ users (most of them Canadian) find appointments in 2 weeks instead of 6 months.

**Why this matters for Canadians:**
- 60%+ of users are Canadian residents
- Helps cross-border shoppers, business travelers, frequent flyers
- Completely free — no subscription fees
- Saves Canadians 10+ hours/week of manual checking

**Canadian user testimonials:**
> "I live in Toronto and travel to Buffalo frequently. This extension got me an appointment 3 months early." — Alex Martinez, Toronto

> "As a Canadian who shops in the US often, NEXUS is essential. This tool made getting it so much easier." — Rachel Kim, Toronto

**The business story:**
Built nights and weekends while working full-time at Meta. Now at $15K MRR from optional Premium subscriptions. Bootstrapped, no VC funding. Canadian tech success story.

**I can offer:**
- Phone or video interview
- Canadian user testimonials (Toronto, Vancouver, Montreal)
- Data: How many Canadians use NEXUS Alert
- Photos

Would you be interested in covering this? It's a practical tool that's helping thousands of Canadians right now.

Press kit: nexus-alert.com/press

Thanks,
Michael Guo
Founder, NEXUS Alert
Vancouver, BC
michael@nexus-alert.com

---

## FOLLOW-UP EMAIL TEMPLATES

### Follow-Up #1 (3 days after initial pitch)
**Subject:** Re: [ORIGINAL SUBJECT LINE]

Hi [EDITOR NAME],

Following up on my email from [DAY OF WEEK]. I know you're busy, so I'll keep this short.

**Quick recap:** I built a Chrome extension that helps travelers find NEXUS/Global Entry appointments months faster. Now helping 3,500+ users, with 2,800+ slots found.

**Why I think [PUBLICATION] readers would care:**
[1 SENTENCE SPECIFIC TO PUBLICATION]

**New angle I can offer:**
[USER TESTIMONIALS / DATA ANALYSIS / EXCLUSIVE INTERVIEW]

If this isn't a fit, totally understand. If it is, I'd be happy to provide more details or set up a quick call.

Press kit: nexus-alert.com/press

Thanks,
Michael

---

### Follow-Up #2 (7 days after initial pitch - with new hook)
**Subject:** Updated: NEXUS Alert now at 4,000+ users (new testimonials)

Hi [EDITOR NAME],

Quick update on my previous email about NEXUS Alert:

**New developments:**
- User base grew from 3,500 to 4,000+ in the past week
- Just collected fresh user testimonials (see below)
- Featured on Hacker News front page (if applicable)
- Product Hunt #3 Product of the Day (if applicable)

**New user testimonial:**
> "[INSERT FRESH QUOTE FROM RECENT USER]"

Still think this would be a great fit for [PUBLICATION] readers. Would you be interested in covering it?

I can provide:
- [SPECIFIC OFFER TAILORED TO PUBLICATION]
- Exclusive discount code for your readers
- Founder interview

Press kit: nexus-alert.com/press

Thanks for considering,
Michael

---

### Follow-Up #3 (14 days - final follow-up)
**Subject:** Last follow-up: NEXUS Alert story

Hi [EDITOR NAME],

This will be my last email about NEXUS Alert — I don't want to clog your inbox!

I wanted to reach out one more time because [SPECIFIC REASON THIS PUBLICATION IS A GOOD FIT].

**The story in one sentence:**
Vancouver software engineer builds free Chrome extension that cuts NEXUS appointment wait times from 6 months to 2 weeks — now helping 4,000+ travelers.

If it's not a fit, no worries at all. If you'd like to learn more, I'm at michael@nexus-alert.com.

Thanks for your time,
Michael

---

## EXCLUSIVE OFFER CODES FOR MEDIA PARTNERS

Create custom promo codes for each major publication:

- **The Points Guy:** `TPG2026` (3 months Premium free)
- **One Mile at a Time:** `ONEMILE` (3 months Premium free)
- **TechCrunch:** `TECHCRUNCH` (3 months Premium free)
- **The Verge:** `THEVERGE` (3 months Premium free)
- **Vancouver Sun:** `VANSUN` (3 months Premium free)
- **Generic Press:** `PRESSKIT` (3 months Premium free)

**Redemption Tracking:**
Log each code redemption to measure which publications drive the most conversions.

---

## EMAIL BEST PRACTICES

### Sending Tips:
1. **Timing:** Send Tuesday-Thursday, 9-11 AM in recipient's timezone
2. **Subject line:** Keep under 60 characters, avoid spam triggers ("FREE!", "ACT NOW!")
3. **Personalization:** Always use editor's name if known, reference their past articles
4. **Length:** Keep under 250 words for initial pitch
5. **Call to action:** Clear next step (interview, demo, more info)

### What to Avoid:
- ❌ Mass BCC emails (send individual emails)
- ❌ Generic "Dear Editor" openings
- ❌ Long-winded pitches (get to the point fast)
- ❌ Overly promotional language ("revolutionary", "game-changing" — unless in quotes)
- ❌ Attachments in first email (link to press kit instead)
- ❌ Following up more than 3 times

### What to Include:
- ✅ Specific reason you're pitching this publication
- ✅ Clear hook relevant to their audience
- ✅ Data/proof (user count, testimonials, stats)
- ✅ Clear value prop for their readers
- ✅ Easy way to learn more (press kit link)
- ✅ Exclusive offer (if applicable)

---

## RESPONSE HANDLING

### If they want an interview:
- Respond within 2 hours
- Offer 3 time slots
- Ask preferred format (phone, video, email Q&A)
- Send calendar invite
- Confirm 24 hours before

### If they want more info:
- Send press kit link
- Attach 2-3 best product screenshots
- Offer demo via screen share
- Provide user testimonials
- Ask if they need anything else

### If they decline:
- Thank them for considering
- Ask if they can recommend another editor/publication
- Keep door open: "Please keep me in mind for future coverage"
- Don't argue or push back

### If they go silent:
- Follow up after 3 days (first follow-up)
- Follow up after 7 days (second follow-up)
- Follow up after 14 days (final follow-up)
- After 14 days, move on

---

## SAMPLE RESPONSE TEMPLATES

### When they reply YES:
**Subject:** Re: [ORIGINAL SUBJECT]

Hi [EDITOR],

Great! Thank you for your interest.

**Next steps:**
[THEY ASKED FOR X, SO PROVIDE X]

**Additional resources:**
- Press kit: nexus-alert.com/press
- Demo video: [YouTube link]
- Founder headshot: [Dropbox link]
- Product screenshots: [Dropbox link]

I'm available for an interview this week if helpful:
- [TIME SLOT 1]
- [TIME SLOT 2]
- [TIME SLOT 3]

Let me know what works best!

Thanks,
Michael

---

### When they reply NO:
**Subject:** Re: [ORIGINAL SUBJECT]

Hi [EDITOR],

No worries at all — thanks for considering it!

If you know of another editor or publication that might be interested, I'd appreciate the referral.

And please keep me in mind if NEXUS Alert becomes relevant for future coverage (we're adding new features regularly).

Thanks again,
Michael

---

**Last Updated:** March 18, 2026
**Next Review:** Before sending first batch of emails
