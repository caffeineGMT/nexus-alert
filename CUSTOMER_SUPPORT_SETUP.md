# Customer Support Infrastructure - NEXUS Alert

This document outlines the customer support infrastructure for NEXUS Alert, including help email, live chat, and FAQ resources.

## 📧 Support Email

**Primary Support Email:** help@nexus-alert.com

### Setup Steps:
1. **Register the domain email** via your email hosting provider (Google Workspace, Zoho, etc.)
2. **Configure DNS records** (MX, SPF, DKIM) for deliverability
3. **Set up autoresponder** for after-hours inquiries
4. **Create support inbox rules** to categorize and prioritize tickets

### Email Configuration:
- Environment variable: `NEXT_PUBLIC_SUPPORT_EMAIL` (set in `.env.local`)
- Default fallback: `help@nexus-alert.com`
- Used throughout the app for "Contact Support" links

### Support Tiers:
- **Free users:** 24-48 hour response time
- **Premium users:** Priority support within 24 hours
- **Critical issues:** Escalated to immediate attention

---

## 💬 Crisp Live Chat Widget

**Service:** [Crisp.chat](https://crisp.chat)
**Pricing:** Free for up to 2 operators, $25/mo for unlimited team members

### Setup Steps:

1. **Create a Crisp account:**
   - Go to https://crisp.chat and sign up
   - Create a new website/project for NEXUS Alert

2. **Get your Website ID:**
   - In Crisp dashboard, go to Settings → Setup instructions
   - Copy your CRISP_WEBSITE_ID (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

3. **Configure environment variable:**
   ```bash
   # In web/.env.local
   NEXT_PUBLIC_CRISP_WEBSITE_ID=your-actual-crisp-website-id
   ```

4. **Deploy the changes:**
   - The Crisp widget is already integrated in `web/src/app/layout.tsx`
   - It automatically hides on `/help` routes to reduce clutter
   - Widget appears on all other pages after setting the environment variable

### Crisp Features Enabled:
- **Real-time chat** with visitors
- **Offline messages** when support team is unavailable
- **Chat history** and conversation transcripts
- **Mobile app** for on-the-go support
- **Email notifications** when new messages arrive
- **Canned responses** for common questions

### Customization:
In Crisp dashboard, customize:
- Chat widget color (recommend: `#3b82f6` to match brand)
- Greeting message: "Need help? Ask us anything about NEXUS Alert!"
- Offline message: "We're away right now. Leave a message and we'll get back to you within 24 hours."
- Position: Bottom-right (default)

---

## 📚 Help Center & FAQ

**Location:** `/help` route
**Total Articles:** 24 articles across 7 categories

### FAQ Categories:

#### 1. **Installation** (4 articles)
- How to install the extension
- Which browsers are supported?
- Extension icon not appearing in toolbar
- How to uninstall or reinstall the extension

#### 2. **Notifications** (5 articles)
- Why am I not getting notifications?
- How to change notification preferences
- How to enable or disable notification sounds
- Setting up email and SMS alerts (Premium)
- I missed a notification - can I see past alerts?

#### 3. **Billing** (4 articles)
- How to upgrade to Premium
- How to cancel subscription
- Billing and payment methods
- Refund and money-back guarantee

#### 4. **Troubleshooting** (4 articles)
- Extension stopped working or checking
- Understanding error messages
- Extension says 'no slots' but I see available appointments
- Extension is slow or using too much memory

#### 5. **Privacy** (3 articles)
- What data does NEXUS Alert collect?
- How is my data secured?
- How to delete my data

#### 6. **Features** (3 articles)
- How often are slots checked?
- Can I monitor multiple locations?
- What's the difference between Free and Premium?

#### 7. **Setup** (1 article)
- How to select enrollment centers

### Search Functionality:
- **Component:** `HelpSearchBar.tsx` (client-side search)
- **Sticky search bar** at top of help page
- **Real-time filtering** as user types
- **Highlight matching text** in results
- **Search scope:** Article titles, descriptions, and categories

### Features:
- **Accordion-style FAQ** grouped by category
- **Individual article pages** with detailed content at `/help/[slug]`
- **Breadcrumb navigation** for easy browsing
- **Related articles** shown at bottom of each page
- **"Still Need Help?" CTA** on every page linking to email + live chat

---

## 🛠️ Maintenance & Updates

### Adding New FAQ Articles:

1. **Add article to main list** in `web/src/app/help/page.tsx`:
   ```typescript
   {
     slug: 'new-article-slug',
     title: 'Article Title',
     description: 'Short description for preview',
     category: 'Category Name',
   }
   ```

2. **Add article content** in `web/src/app/help/[slug]/page.tsx`:
   ```typescript
   'new-article-slug': {
     slug: 'new-article-slug',
     title: 'Article Title',
     category: 'Category Name',
     content: {
       intro: 'Intro paragraph',
       sections: [
         { heading: 'Section 1', content: 'Content...' },
         { heading: 'Section 2', content: 'Content...' },
       ],
     },
   }
   ```

3. **Rebuild and deploy** the site

### Monitoring Support Metrics:
- **Crisp dashboard:** Track chat volume, response times, satisfaction scores
- **Email inbox:** Monitor ticket volume and average resolution time
- **Help center analytics:** Use Google Analytics to track most-viewed articles
- **User feedback:** Add feedback buttons to help articles (future enhancement)

### Common Support Workflows:

**Workflow 1: Free User Needs Help**
1. User clicks "Email Support" on help page
2. Email sent to help@nexus-alert.com
3. Support team responds within 24-48 hours
4. If complex issue, escalate to developer

**Workflow 2: Premium User Urgent Issue**
1. User opens Crisp chat widget
2. Real-time conversation with support agent
3. Agent has access to user's subscription via Stripe Customer Portal
4. Issue resolved in chat or escalated to email

**Workflow 3: User Can't Find Answer**
1. User searches help center
2. No relevant articles found
3. User clicks "Still Need Help?" CTA
4. Chooses email or live chat
5. Support team assists and documents issue for future FAQ

---

## 📊 Analytics & Reporting

### Metrics to Track:
- **Support ticket volume** (daily/weekly/monthly)
- **Average response time** (free vs premium)
- **Chat-to-ticket ratio** (how many chats vs emails)
- **Most common issues** (to identify FAQ gaps)
- **Customer satisfaction score** (CSAT via Crisp)

### Tools:
- **Crisp Analytics:** Built-in chat analytics
- **Email tracking:** Use Helpscout, Zendesk, or Google Workspace
- **Google Analytics:** Track help center page views and search queries

---

## 🚀 Next Steps

### Immediate:
1. ✅ Set up help@nexus-alert.com email address
2. ✅ Create Crisp account and get Website ID
3. ✅ Update `.env.local` with CRISP_WEBSITE_ID
4. ✅ Deploy updated help center to production

### Short-term (Week 1-2):
- Train support team on common issues
- Create canned responses in Crisp for FAQs
- Set up email autoresponder
- Add support hours to footer/help page

### Medium-term (Month 1):
- Monitor support metrics and identify patterns
- Expand FAQ based on most common questions
- Implement feedback widget on help articles
- Create video tutorials for complex topics

### Long-term (Quarter 1):
- Integrate support ticketing system (Zendesk/Intercom)
- Add AI chatbot for instant FAQ responses
- Create knowledge base versioning for Chrome extension updates
- Implement in-app help widget inside extension popup

---

## 📋 Checklist for Launch

- [x] Help email configured (help@nexus-alert.com)
- [x] Crisp widget integrated in layout.tsx
- [x] Environment variables set up (.env.local, .env.example)
- [x] 24 FAQ articles written and categorized
- [x] Search functionality implemented
- [x] Individual article pages created
- [x] "Still Need Help?" CTA on all help pages
- [x] Crisp widget hidden on /help routes
- [ ] Domain email registered and DNS configured
- [ ] Crisp account created and Website ID set
- [ ] Support team trained on workflows
- [ ] Canned responses created in Crisp
- [ ] Google Analytics tracking added to help center

---

## 🔗 Useful Links

- **Crisp Dashboard:** https://app.crisp.chat
- **Crisp Documentation:** https://docs.crisp.chat
- **Help Center:** https://nexus-alert.com/help
- **Support Email:** help@nexus-alert.com

---

**Last Updated:** March 18, 2026
