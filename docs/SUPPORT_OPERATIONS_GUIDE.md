# Customer Support Operations Guide - NEXUS Alert

**Last Updated:** March 18, 2026
**Status:** Pre-Launch Operational Readiness

This guide walks you through making the customer support infrastructure operational before Chrome Web Store launch.

---

## 🎯 Pre-Launch Checklist (Complete Before CWS Submission)

### Phase 1: Email Setup (Day 1)

- [ ] **Register domain email: help@nexus-alert.com**
  - **Recommended provider:** Google Workspace ($6/user/mo) or Zoho Mail (free tier)
  - **Alternative:** Forward to personal email initially, upgrade later

#### Google Workspace Setup:
1. Go to https://workspace.google.com and sign up
2. Domain: nexus-alert.com
3. Create user: help@nexus-alert.com
4. Verify domain ownership via DNS TXT record
5. Configure MX records (Google provides specific records)
6. Set up SPF: `v=spf1 include:_spf.google.com ~all`
7. Enable DKIM signing in Google Admin
8. Set up DMARC: `v=DMARC1; p=quarantine; rua=mailto:help@nexus-alert.com`

#### Email Inbox Configuration:
1. **Create labels/folders:**
   - Installation Issues
   - Billing/Payments
   - Bug Reports
   - Feature Requests
   - Premium Support (priority)
   - Refund Requests

2. **Set up filters:**
   - Auto-label based on keywords ("install", "payment", "bug", "refund")
   - Star/flag emails from Premium users (check Stripe customer portal)
   - Auto-archive spam

3. **Create signature:**
   ```
   Best regards,
   NEXUS Alert Support Team

   Get instant alerts when NEXUS, Global Entry, or SENTRI appointment slots open.
   Visit our Help Center: https://nexus-alert.com/help
   ```

4. **Set up autoresponder (after-hours):**
   ```
   Subject: We received your message

   Hi there,

   Thanks for contacting NEXUS Alert support! We've received your message and will get back to you within 24-48 hours (Premium users: within 24 hours).

   In the meantime, check our Help Center for instant answers:
   https://nexus-alert.com/help

   Common topics:
   - Installation issues: https://nexus-alert.com/help/how-to-install
   - Not receiving notifications: https://nexus-alert.com/help/why-no-notifications
   - Upgrading to Premium: https://nexus-alert.com/help/upgrade-to-premium

   Best regards,
   NEXUS Alert Support Team
   ```

---

### Phase 2: Crisp Live Chat Setup (Day 1)

- [ ] **Create Crisp account**
- [ ] **Get Website ID**
- [ ] **Configure environment variables**
- [ ] **Deploy to production**
- [ ] **Test widget functionality**

#### Step-by-Step:

1. **Sign up for Crisp:**
   - Go to https://crisp.chat
   - Create account (use help@nexus-alert.com email)
   - Free plan supports 2 operators (upgrade to $25/mo for team if needed)

2. **Create website/project:**
   - Name: NEXUS Alert
   - URL: https://nexus-alert.com
   - Industry: Browser Extension / SaaS

3. **Get Website ID:**
   - Dashboard → Settings → Setup instructions
   - Copy CRISP_WEBSITE_ID (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

4. **Configure environment:**
   ```bash
   # In web/.env.local (production)
   NEXT_PUBLIC_CRISP_WEBSITE_ID=your-actual-website-id-here
   ```

5. **Deploy to Vercel:**
   ```bash
   cd web
   vercel env add NEXT_PUBLIC_CRISP_WEBSITE_ID production
   # Paste your Website ID when prompted
   vercel --prod
   ```

6. **Verify deployment:**
   - Visit https://nexus-alert.com
   - Check bottom-right for Crisp chat widget
   - Send test message
   - Confirm widget is hidden on https://nexus-alert.com/help

---

### Phase 3: Crisp Customization (Day 2)

- [ ] **Brand widget colors**
- [ ] **Set greeting messages**
- [ ] **Create canned responses**
- [ ] **Configure team availability**
- [ ] **Set up mobile app**

#### Customization Steps:

**1. Widget Appearance:**
- Dashboard → Settings → Website → Customize
- Color: `#3b82f6` (brand blue)
- Position: Bottom-right
- Show badge with "Need help?" text

**2. Greeting Message:**
```
👋 Need help with NEXUS Alert?

We're here to answer questions about:
• Installation & setup
• Notifications & alerts
• Premium features
• Billing & refunds

Ask us anything!
```

**3. Offline Message:**
```
We're currently offline, but we'll get back to you within 24 hours.

For instant answers, check our Help Center:
https://nexus-alert.com/help
```

**4. Operating Hours:**
- Dashboard → Settings → Availability
- Set your timezone (Pacific Time recommended)
- Business hours: 9 AM - 6 PM PT, Monday-Friday
- Auto-responder outside hours

**5. Canned Responses (Shortcuts):**
See "Canned Responses" section below for full templates.

**6. Mobile App (optional but recommended):**
- Download Crisp app for iOS/Android
- Log in with help@nexus-alert.com
- Enable push notifications
- Get alerted on new chats even when away from desk

---

### Phase 4: Support Team Training (Day 3)

- [ ] **Read all FAQ articles**
- [ ] **Test the extension (Free + Premium)**
- [ ] **Practice common workflows**
- [ ] **Access Stripe Customer Portal**
- [ ] **Review escalation procedures**

#### Training Checklist:

**Knowledge Base:**
1. Read all 24 FAQ articles at https://nexus-alert.com/help
2. Install the extension yourself and test all features
3. Create a Premium account (use test mode Stripe)
4. Trigger notifications, configure settings, monitor locations

**Tools Access:**
1. **Email:** help@nexus-alert.com credentials
2. **Crisp:** Login to https://app.crisp.chat
3. **Stripe:** Customer Portal access for subscription management
4. **Vercel:** Read-only access to deployment logs (optional)

**Common Scenarios Practice:**
- User can't install extension → Troubleshoot browser compatibility
- User not getting notifications → Check permissions, monitoring enabled
- User wants to upgrade → Explain Premium benefits, provide payment link
- User requests refund → Follow 30-day guarantee policy

**Escalation Paths:**
- **Technical bugs:** Log in GitHub Issues or forward to dev team
- **Payment failures:** Check Stripe Dashboard for failed payment reasons
- **Abusive users:** Block in Crisp, report to admin
- **Legal/privacy requests:** Escalate to legal contact

---

### Phase 5: Analytics & Monitoring (Day 4)

- [ ] **Add Google Analytics to Help Center**
- [ ] **Set up Crisp reporting**
- [ ] **Create support metrics dashboard**
- [ ] **Configure alert notifications**

#### Google Analytics Setup:

**1. Create GA4 property:**
- Go to https://analytics.google.com
- Create property for nexus-alert.com
- Get Measurement ID (format: `G-XXXXXXXXXX`)

**2. Add to Next.js site:**
```typescript
// In web/src/app/layout.tsx, add:
{process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
  <>
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`} />
    <Script id="google-analytics">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
      `}
    </Script>
  </>
)}
```

**3. Track help center metrics:**
- Most-viewed articles
- Search queries (custom event tracking)
- Bounce rate on help pages
- CTA clicks ("Email Support", "Live Chat")

#### Crisp Analytics:

**Dashboard → Analytics:**
- Chat volume (daily/weekly)
- Average response time
- Customer satisfaction (CSAT)
- Operator performance
- Busiest hours

**Set up alerts:**
- Email when chat queue > 5 messages
- Slack notification for new high-priority chats (Premium users)
- Weekly summary report

---

## 📧 Email Response Templates

### Template 1: Installation Issue

**Subject:** Re: Installation Issue - NEXUS Alert

```
Hi [Name],

Thanks for reaching out! I'm sorry you're having trouble installing NEXUS Alert.

Here's how to install the extension:

1. Visit the Chrome Web Store: https://chrome.google.com/webstore (search "NEXUS Alert")
2. Click "Add to Chrome"
3. Confirm by clicking "Add extension"
4. Pin the extension by clicking the puzzle icon in your toolbar

If you're still having issues, can you tell me:
- Which browser and version you're using? (Go to Settings → About Chrome)
- Do you see any error messages?
- Is the extension showing up in chrome://extensions?

Our full installation guide is here: https://nexus-alert.com/help/how-to-install

I'm here to help!

Best regards,
[Your Name]
NEXUS Alert Support
```

---

### Template 2: No Notifications

**Subject:** Re: Not Receiving Notifications

```
Hi [Name],

Let's get those notifications working! Here are the most common fixes:

**1. Check browser permissions:**
- Go to chrome://settings/content/notifications
- Make sure nexus-alert.com is set to "Allow"

**2. Verify monitoring is enabled:**
- Click the NEXUS Alert icon in your toolbar
- Make sure "Monitoring Enabled" toggle is ON

**3. Check notification settings:**
- Click the extension icon → Settings
- Ensure "Desktop Notifications" is enabled

**For Premium users:**
- Verify your email/phone number is correctly entered in Settings
- Check spam folder for email notifications

**Free tier users:** Slots are checked every 30 minutes. If a slot appears and disappears quickly, you might miss it. Consider upgrading to Premium (checks every 2 minutes): https://nexus-alert.com/pro

Full troubleshooting guide: https://nexus-alert.com/help/why-no-notifications

Let me know if this helps!

Best regards,
[Your Name]
```

---

### Template 3: Premium Upgrade

**Subject:** Re: Upgrading to Premium

```
Hi [Name],

Great choice! Premium gives you:

✅ Slot checks every 2 minutes (15x faster than Free)
✅ Email notifications
✅ SMS text alerts (optional)
✅ Priority support

**How to upgrade:**
1. Click the NEXUS Alert icon in Chrome
2. Click "Upgrade to Premium" at the top
3. Choose Monthly ($4.99/mo) or Annual ($49.99/yr - save 17%)
4. Complete checkout via Stripe

**Or upgrade directly here:** https://nexus-alert.com/pro

Your Premium features activate instantly after payment. You'll be able to configure email/SMS in Settings.

Questions? Just reply to this email!

Best regards,
[Your Name]
```

---

### Template 4: Refund Request (30-Day Guarantee)

**Subject:** Re: Refund Request

```
Hi [Name],

I'm sorry NEXUS Alert didn't meet your expectations. We offer a 30-day money-back guarantee, so I'm happy to process your refund.

Before we proceed, I'd love to understand what went wrong. Was it:
- Technical issues (not receiving notifications, errors)?
- Didn't find appointment slots in your area?
- Something else?

Your feedback helps us improve!

**To process your refund:**
I'll need to verify your purchase. Can you provide:
- Email address used for payment
- Approximate purchase date

I'll process the refund within 24 hours. It typically appears in your account within 5-10 business days.

Thank you for trying NEXUS Alert!

Best regards,
[Your Name]
```

---

### Template 5: Cancellation

**Subject:** Re: Cancellation Request

```
Hi [Name],

I've confirmed your subscription cancellation. Here's what happens next:

✅ You'll continue to have Premium access until [end of billing period]
✅ No further charges after [date]
✅ After [date], you'll automatically downgrade to Free tier (30-minute checks, browser notifications only)

**Manage your subscription:** You can also manage your subscription directly via the Stripe Customer Portal: [Stripe portal link]

**Reactivating:** If you change your mind, you can re-subscribe anytime at https://nexus-alert.com/pro

Sorry to see you go! If there's anything we could have done better, I'd love to hear your feedback.

Best regards,
[Your Name]
```

---

## 💬 Crisp Canned Responses (Shortcuts)

Configure these in Crisp Dashboard → Settings → Canned Responses.

### `/install` - Installation Help

```
Here's how to install NEXUS Alert:

1️⃣ Visit Chrome Web Store: https://chrome.google.com/webstore (search "NEXUS Alert")
2️⃣ Click "Add to Chrome"
3️⃣ Pin the extension (puzzle icon in toolbar)

Full guide: https://nexus-alert.com/help/how-to-install

Having issues? Let me know your browser and version!
```

---

### `/notifications` - Notification Troubleshooting

```
Let's fix those notifications! 🔔

Quick checks:
✅ Go to chrome://settings/content/notifications → Allow nexus-alert.com
✅ Click extension icon → verify "Monitoring Enabled" is ON
✅ Settings → ensure "Desktop Notifications" is enabled

Free users: Checks happen every 30 min
Premium users: Every 2 min + email/SMS

Details: https://nexus-alert.com/help/why-no-notifications
```

---

### `/premium` - Premium Benefits

```
Premium gives you:

⚡ Checks every 2 minutes (15x faster)
📧 Email notifications
📱 SMS text alerts
🎯 Priority support

$4.99/mo or $49.99/yr (save 17%)

Upgrade here: https://nexus-alert.com/pro
```

---

### `/refund` - Refund Policy

```
We offer a 30-day money-back guarantee! 💯

To process your refund, I'll need:
• Email used for payment
• Purchase date (approximate)

Refunds typically appear in 5-10 business days.

Before we proceed, is there anything we can help troubleshoot?
```

---

### `/freevspremium` - Free vs Premium Comparison

```
**Free Tier:**
• Checks every 30 minutes
• Desktop notifications
• Unlimited locations

**Premium ($4.99/mo):**
• Checks every 2 minutes ⚡
• Email + SMS alerts
• Priority support

Most users find Premium worth it for competitive appointment markets!

Compare: https://nexus-alert.com/help/free-vs-premium
```

---

### `/cancel` - Cancellation

```
To cancel your subscription:

1️⃣ Visit the Stripe Customer Portal (link in your billing emails)
2️⃣ Click "Cancel subscription"

✅ You keep Premium until your billing period ends
✅ Auto-downgrade to Free tier after
✅ Can re-subscribe anytime

Need help? I can walk you through it!
```

---

### `/hours` - Support Hours

```
Our support hours:
🕐 9 AM - 6 PM Pacific Time, Monday-Friday

Outside those hours, we typically respond within 24 hours.

Premium users get priority support! 🎯

For instant answers, check our Help Center: https://nexus-alert.com/help
```

---

## 🚨 Escalation Procedures

### When to Escalate:

**1. Technical Bugs (Immediate Escalation):**
- Extension crashes or stops working
- Notifications not firing despite correct settings
- Data loss or corruption
- Security vulnerabilities reported

**Action:**
1. Thank user and acknowledge the bug
2. Gather details: browser version, extension version, steps to reproduce
3. Create GitHub issue or notify dev team immediately
4. Follow up with user within 24 hours with status

---

**2. Payment/Billing Issues (Same-Day Resolution):**
- Payment failed but customer has valid card
- Charged incorrectly
- Subscription not activating after payment

**Action:**
1. Check Stripe Dashboard for payment status
2. Verify customer email matches Stripe customer email
3. If legitimate issue, process manual refund or reactivate subscription
4. Escalate to finance/admin if fraud suspected

---

**3. Abuse/Spam (Immediate Action):**
- Repeated refund requests (abuse)
- Offensive language or harassment
- Spamming support channels

**Action:**
1. Block user in Crisp
2. Document the abuse
3. Report to admin/legal if severe
4. Do NOT engage further

---

**4. Legal/Privacy Requests (24-Hour Escalation):**
- GDPR data deletion requests
- Law enforcement subpoenas
- Copyright/trademark complaints

**Action:**
1. Acknowledge receipt
2. Forward to legal contact immediately
3. Do NOT attempt to handle yourself
4. Follow up within 24 hours confirming escalation

---

## 📊 Support Metrics & KPIs

Track these weekly/monthly:

### Response Time:
- **Free users:** < 48 hours
- **Premium users:** < 24 hours
- **Critical bugs:** < 4 hours

### Resolution Rate:
- **First contact resolution:** > 60%
- **Overall resolution:** > 90%

### Customer Satisfaction (CSAT):
- **Target:** > 4.5/5 stars (90%)
- **Measure:** Crisp post-chat surveys

### Volume Metrics:
- **Chat volume:** Track daily/weekly trends
- **Email volume:** Compare to chat (goal: 70% chat, 30% email)
- **Help center views:** Track most-viewed articles

### Common Issue Categories:
Rank top 5 issues monthly to identify FAQ gaps.

---

## 🎓 Support Team Best Practices

### 1. Response Tone:
- **Friendly but professional**
- **Avoid jargon** (explain technical terms)
- **Empathize with frustration** ("I understand that's frustrating...")
- **End with action** ("Let me know if this helps!")

### 2. Response Structure:
1. **Greet & acknowledge** issue
2. **Provide solution** (step-by-step if needed)
3. **Link to help article** for details
4. **Offer follow-up** ("Questions? Just reply!")

### 3. Time Management:
- **Simple issues (< 5 min):** Respond immediately
- **Complex issues (> 15 min):** Acknowledge quickly, research, follow up within 4 hours
- **Requires dev:** Escalate, update customer every 24 hours until resolved

### 4. Premium User Priority:
- **Identify Premium users:** Check Stripe Customer Portal
- **Flag emails/chats** with "Premium" label
- **Respond faster:** Aim for < 12 hours
- **Go the extra mile:** Offer phone call for complex issues

---

## ✅ Launch Day Readiness Checklist

**One Week Before CWS Launch:**
- [ ] help@nexus-alert.com email fully operational
- [ ] Crisp widget live on nexus-alert.com
- [ ] All canned responses configured
- [ ] Support team trained and has access to all tools
- [ ] Email templates loaded and tested
- [ ] Autoresponder configured
- [ ] Google Analytics tracking help center
- [ ] Mobile app installed for on-the-go support
- [ ] Escalation procedures documented and understood
- [ ] Test all workflows (install, upgrade, refund, cancel)

**Launch Day:**
- [ ] Monitor Crisp/email closely (expect 10-50x spike)
- [ ] Have all hands on deck (multiple operators in Crisp)
- [ ] Log all bugs/issues in real-time
- [ ] Update FAQ based on common questions
- [ ] Respond to App Store reviews

**First Week Post-Launch:**
- [ ] Daily metrics review
- [ ] Update canned responses based on real queries
- [ ] Add new FAQ articles for common issues
- [ ] Refine response templates
- [ ] Celebrate first 100 happy customers! 🎉

---

**Questions about this guide?**
Contact: [dev team or project lead]

---

**Document Version:** 1.0
**Prepared by:** Development Team
**Next Review:** After CWS Launch + 1 Week
