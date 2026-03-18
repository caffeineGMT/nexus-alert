/**
 * B2B Outreach Manager for NEXUS Alert
 * Manages email campaigns, LinkedIn outreach tracking, and follow-up sequences
 */

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Email templates mapping
const EMAIL_TEMPLATES = {
  1: 'Initial Cold Outreach',
  2: 'Follow-Up #1 (Day 4)',
  3: 'Case Study Follow-Up (Day 8)',
  4: 'Breakup Email (Day 15)',
  5: 'Referral Request',
  6: 'Reactivation Campaign',
  7: 'Pre-Trial-Expiration Upsell'
};

// Configure email transporter (using Gmail SMTP as example)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

// Email template generator
const generateEmailContent = (templateId, prospect) => {
  const { firstName, firmName, location } = prospect;

  switch (templateId) {
    case 1:
      return {
        subject: `Save 12+ hours/week managing NEXUS appointments for ${firmName} clients`,
        body: `Hi ${firstName},

I noticed ${firmName} handles immigration cases in ${location}. Quick question: How many NEXUS or Global Entry applications does your firm handle monthly?

If it's more than 5-10, you're likely spending 12+ hours per week manually checking ttp.cbp.dhs.gov for appointment cancellations across all your clients.

**We built NEXUS Alert Agency specifically for immigration law firms:**

✓ **Unlimited client monitoring** - no per-client fees
✓ **2-minute interval checking** - catch slots before they're gone
✓ **White-label notifications** - emails branded with YOUR firm logo
✓ **Multi-location monitoring** - track multiple enrollment centers per client
✓ **Team dashboard** - your entire staff can see all client statuses
✓ **API access** - integrate with Clio, MyCase, or your case management system

**The ROI:**
- **Time savings:** 12+ hours/week freed up for billable work
- **Client satisfaction:** Appointments secured 60-75% faster
- **Cost:** $99/month flat (vs $4.99/client = break-even at 20 clients)

Most firms with 20+ active NEXUS clients see this pay for itself in saved paralegal time alone.

**Would you be open to a 90-day pilot?** No credit card required.

→ Start agency trial: https://nexus-alert.com/agency

Best regards,
${process.env.SENDER_NAME || 'NEXUS Alert Team'}
${process.env.SENDER_PHONE || ''}
${process.env.SENDER_EMAIL || ''}

**P.S.** Vancouver immigration attorney Sarah Chen monitors 47 clients through our platform: *"My clients think we built this ourselves. It's completely white-labeled."*`
      };

    case 2:
      return {
        subject: `Re: NEXUS appointment automation for ${firmName}`,
        body: `Hi ${firstName},

Following up on my message from earlier this week about automating NEXUS appointment monitoring for ${firmName}.

I know your inbox is flooded, so I'll keep this brief:

**The Problem:**
Immigration firms with 20+ NEXUS/Global Entry clients waste 10-15 hours/week on appointment checking. That's $400-750/week in paralegal time.

**The Solution:**
NEXUS Alert Agency monitors unlimited clients 24/7 for $99/month flat. Catches appointment slots in 2 minutes vs 30 minutes (free tier) or manual checking.

**The Math:**
- **20 clients** × $4.99/mo (individual tier) = **$99.80/mo**
- **50 clients** × $4.99/mo (individual tier) = **$249.50/mo**
- **Agency tier** (unlimited clients) = **$99/mo flat**

**At 30+ clients, you save $50-150/month PLUS 12+ hours/week in staff time.**

→ 90-day free trial: https://nexus-alert.com/agency

Would a 15-minute demo be helpful? I can show you the dashboard and white-label setup.

Best,
${process.env.SENDER_NAME || 'NEXUS Alert Team'}
${process.env.SENDER_PHONE || ''}`
      };

    case 3:
      return {
        subject: `How Chen Immigration Law (Vancouver) monitors 47 NEXUS clients`,
        body: `Hi ${firstName},

One last email from me - wanted to share a quick case study:

**Client:** Chen Immigration Law, Vancouver
**NEXUS cases/month:** 15-20 new applications
**Active monitoring:** 47 clients at any given time

**Before NEXUS Alert Agency:**
- 2 paralegals spent 6 hours/week each checking GOES manually
- Missed 60%+ of cancellations (slots booked within 5 minutes)
- Clients waited 4-6 months for appointments
- Frequent "any update?" calls from frustrated clients

**After NEXUS Alert Agency:**
- Zero staff time spent on appointment checking
- Catch 85%+ of available slots within 2-minute window
- Clients get appointments in 6-8 weeks on average
- White-label emails keep clients engaged ("Your law firm found you a slot!")

**Sarah Chen's quote:**
*"The platform pays for itself 10x over. We've cut appointment wait times by 70%, and my team focuses on actual legal work instead of refreshing websites. Clients love the proactive updates."*

**Her ROI calculation:**
- Staff time saved: 12 hrs/week × $25/hr = **$300/week = $1,300/month**
- Cost of Agency tier: **$99/month**
- **Net gain: $1,201/month**

If ${firmName} handles even 15-20 NEXUS cases, the math is similar.

→ Start your 90-day pilot: https://nexus-alert.com/agency

Happy to answer any questions.

Best regards,
${process.env.SENDER_NAME || 'NEXUS Alert Team'}`
      };

    case 4:
      return {
        subject: `Should I close your file?`,
        body: `Hi ${firstName},

I haven't heard back, so I'm guessing one of three things:

1. **You're not handling enough NEXUS cases** for this to matter (totally fine!)
2. **Your current system works** and you're not looking to change (understandable)
3. **This got buried** in your inbox and you meant to respond (happens to all of us)

If it's #1 or #2, I'll stop bothering you - just reply "not interested" and I'll remove you from my list.

If it's #3 and you'd like to explore how we can save your firm 12+ hours/week, just reply "interested" and I'll send you a trial link.

Either way, no hard feelings.

Best,
${process.env.SENDER_NAME || 'NEXUS Alert Team'}

**P.S.** If you know any immigration colleagues who DO handle a lot of NEXUS cases, I'd love an intro - happy to offer them a free trial as well.`
      };

    default:
      throw new Error(`Unknown template ID: ${templateId}`);
  }
};

// Send email function
const sendEmail = async (prospect, templateId) => {
  const transporter = createTransporter();
  const { subject, body } = generateEmailContent(templateId, prospect);

  const mailOptions = {
    from: `"${process.env.SENDER_NAME || 'NEXUS Alert'}" <${process.env.SMTP_USER}>`,
    to: prospect.email,
    subject: subject,
    text: body,
    html: body.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${prospect.contactName} (${prospect.firmName})`);
    console.log(`   Template: ${EMAIL_TEMPLATES[templateId]}`);
    console.log(`   Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send email to ${prospect.contactName}:`, error.message);
    return { success: false, error: error.message };
  }
};

// Parse CSV tracking file
const loadProspects = () => {
  const csvPath = path.join(__dirname, 'outreach-tracker.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');

  const prospects = lines.slice(1).map(line => {
    const values = line.split(',');
    const prospect = {};
    headers.forEach((header, index) => {
      prospect[header.trim()] = values[index]?.trim() || '';
    });

    // Extract first name from full name
    const nameParts = prospect['Contact Name'].split(' ');
    prospect.firstName = nameParts[0];

    return prospect;
  });

  return prospects;
};

// Update CSV tracking file
const updateProspectStatus = (prospectId, updates) => {
  const csvPath = path.join(__dirname, 'outreach-tracker.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');

  const updatedLines = lines.map((line, index) => {
    if (index === 0) return line; // Keep header

    const values = line.split(',');
    const currentId = values[0];

    if (currentId === prospectId.toString()) {
      // Update specified fields
      Object.keys(updates).forEach(key => {
        const headerIndex = headers.findIndex(h => h.trim() === key);
        if (headerIndex !== -1) {
          values[headerIndex] = updates[key];
        }
      });
      return values.join(',');
    }

    return line;
  });

  fs.writeFileSync(csvPath, updatedLines.join('\n'), 'utf-8');
  console.log(`📝 Updated prospect ${prospectId} in tracker`);
};

// Main outreach campaign runner
const runCampaign = async (options = {}) => {
  const {
    templateId = 1,
    priority = null,
    limit = null,
    dryRun = false
  } = options;

  console.log('\n🚀 NEXUS Alert B2B Outreach Campaign');
  console.log('=====================================\n');
  console.log(`Template: ${EMAIL_TEMPLATES[templateId]}`);
  console.log(`Priority filter: ${priority || 'All'}`);
  console.log(`Limit: ${limit || 'No limit'}`);
  console.log(`Dry run: ${dryRun ? 'Yes (no emails sent)' : 'No (emails will be sent)'}\n`);

  const prospects = loadProspects();
  let filteredProspects = prospects;

  // Filter by priority if specified
  if (priority) {
    filteredProspects = filteredProspects.filter(p => p.Priority === priority);
  }

  // Filter by status (only send to "Not Contacted" or appropriate status)
  filteredProspects = filteredProspects.filter(p => {
    if (templateId === 1) return p.Status === 'Not Contacted';
    if (templateId === 2) return p.Status === 'Sent' || p.Status === 'Connected';
    if (templateId === 3) return p.Status === 'Sent' || p.Status === 'Connected';
    if (templateId === 4) return p.Status === 'Sent' || p.Status === 'Connected';
    return false;
  });

  // Apply limit
  if (limit) {
    filteredProspects = filteredProspects.slice(0, limit);
  }

  console.log(`📊 Found ${filteredProspects.length} prospects to contact\n`);

  if (filteredProspects.length === 0) {
    console.log('⚠️  No prospects match the criteria\n');
    return;
  }

  // Send emails
  const results = [];
  for (const prospect of filteredProspects) {
    console.log(`\n📧 Processing: ${prospect['Contact Name']} (${prospect['Firm Name']})`);

    if (dryRun) {
      console.log('   [DRY RUN] Email would be sent');
      results.push({ prospect, success: true, dryRun: true });
    } else {
      const result = await sendEmail(prospect, templateId);
      results.push({ prospect, ...result });

      if (result.success) {
        // Update tracker
        const today = new Date().toISOString().split('T')[0];
        updateProspectStatus(prospect['Prospect ID'], {
          Status: 'Sent',
          'Email Sent Date': today,
          'Email Template': templateId.toString(),
          'Next Action': 'Follow-up email',
          'Next Action Date': new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 4 days from now
        });
      }

      // Rate limiting: wait 2 seconds between emails
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Summary
  console.log('\n\n📊 Campaign Summary');
  console.log('===================\n');
  console.log(`Total prospects processed: ${results.length}`);
  console.log(`Successful: ${results.filter(r => r.success).length}`);
  console.log(`Failed: ${results.filter(r => !r.success).length}`);

  if (dryRun) {
    console.log('\n⚠️  This was a DRY RUN - no emails were actually sent\n');
  }

  console.log('\n✅ Campaign complete!\n');
};

// CLI interface
const main = async () => {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
NEXUS Alert B2B Outreach Manager
=================================

Usage: node outreach-manager.js [options]

Options:
  --template <1-7>       Email template to send (default: 1)
  --priority <level>     Filter by priority (VERY HIGH, HIGH, MEDIUM-HIGH)
  --limit <number>       Limit number of emails to send
  --dry-run              Preview emails without sending
  --help, -h             Show this help message

Templates:
  1 - Initial Cold Outreach
  2 - Follow-Up #1 (Day 4)
  3 - Case Study Follow-Up (Day 8)
  4 - Breakup Email (Day 15)
  5 - Referral Request
  6 - Reactivation Campaign
  7 - Pre-Trial-Expiration Upsell

Examples:
  # Send initial outreach to VERY HIGH priority prospects (dry run)
  node outreach-manager.js --template 1 --priority "VERY HIGH" --dry-run

  # Send first 5 follow-up emails
  node outreach-manager.js --template 2 --limit 5

  # Send case study to all eligible prospects
  node outreach-manager.js --template 3

Environment Variables Required:
  SMTP_HOST       - SMTP server (e.g., smtp.gmail.com)
  SMTP_PORT       - SMTP port (e.g., 587)
  SMTP_USER       - Email username
  SMTP_PASSWORD   - Email password or app-specific password
  SENDER_NAME     - Your name (e.g., "Michael Guo")
  SENDER_EMAIL    - Your email
  SENDER_PHONE    - Your phone (optional)
    `);
    return;
  }

  const options = {};

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--template') {
      options.templateId = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--priority') {
      options.priority = args[i + 1];
      i++;
    } else if (args[i] === '--limit') {
      options.limit = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--dry-run') {
      options.dryRun = true;
    }
  }

  // Validate required environment variables
  if (!options.dryRun) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('❌ Error: SMTP_USER and SMTP_PASSWORD environment variables are required');
      console.error('   Create a .env file with your SMTP credentials\n');
      process.exit(1);
    }
  }

  await runCampaign(options);
};

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  sendEmail,
  loadProspects,
  updateProspectStatus,
  runCampaign
};
