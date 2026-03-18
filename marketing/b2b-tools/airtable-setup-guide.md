# Airtable Setup Guide - Immigration Lawyer Lead Database

Complete guide to set up Airtable as your CRM for the 500-lawyer lead database.

---

## Step 1: Create Airtable Account

1. Go to https://airtable.com/signup
2. Sign up with your email (free tier is fine for <1,200 records)
3. Verify your email

---

## Step 2: Create a New Base

1. Click "Add a base" → "Start from scratch"
2. Name it: **"NEXUS Alert - Immigration Lawyer Leads"**
3. You'll get a Base ID from the URL: `https://airtable.com/app...` (the `app...` part)
4. Copy this Base ID - you'll need it later

---

## Step 3: Set Up the Leads Table

Rename the default table from "Table 1" to **"Leads"**

### Add These Fields (Columns):

| Field Name | Type | Options |
|------------|------|---------|
| Name | Single line text | - |
| Email | Email | - |
| Firm | Single line text | - |
| Firm Size | Single select | Solo (1), Small (2-10), Large (10+), UNKNOWN |
| City | Single line text | - |
| State | Single line text | - |
| Phone | Phone number | - |
| Website | URL | - |
| Priority | Single select | VERY HIGH, HIGH, MEDIUM, LOW |
| Firm Size Priority | Single select | HIGH, MEDIUM, LOW |
| Source | Single select | Google Maps (Apify), AILA, LinkedIn Sales Navigator, Manual |
| Email Status | Single select | Pending, Valid, Invalid, Accept All, Unknown |
| Email Score | Number | 0-100 |
| Outreach Status | Single select | Not Contacted, Email Sent, Replied, Demo Scheduled, Trial Started, Paid, Not Interested, No Response |
| Google Maps URL | URL | - |
| Rating | Number | Decimal, 0-5 |
| Review Count | Number | Integer |
| Notes | Long text | - |
| Email Sent Date | Date | - |
| Last Contact Date | Date | - |
| Next Action | Single line text | - |
| Next Action Date | Date | - |
| Owner | Single line text | (Your name or team member) |

---

## Step 4: Create Views

### View 1: "All Leads"
- Show all records
- Sort by: Priority (VERY HIGH → LOW), then Firm Size Priority (HIGH → LOW)

### View 2: "Ready to Contact"
- Filter: Outreach Status = "Not Contacted"
- Filter: Email Status = "Valid" OR "Accept All" OR "Pending"
- Sort by: Priority (VERY HIGH → LOW)

### View 3: "Solo Practitioners (High Priority)"
- Filter: Firm Size = "Solo (1)"
- Filter: Outreach Status = "Not Contacted"
- Sort by: Priority

### View 4: "Email Sent - Awaiting Response"
- Filter: Outreach Status = "Email Sent"
- Sort by: Email Sent Date (oldest first)

### View 5: "Hot Leads (Replied)"
- Filter: Outreach Status = "Replied"
- Sort by: Last Contact Date (most recent first)

### View 6: "Demos & Trials"
- Filter: Outreach Status = "Demo Scheduled" OR "Trial Started"
- Sort by: Next Action Date

### View 7: "By City"
- Group by: City
- Sort by: Priority

---

## Step 5: Get Your API Key

1. Go to https://airtable.com/create/tokens
2. Click "Create new token"
3. Name it: "NEXUS Alert Lead Pipeline"
4. Add scopes:
   - `data.records:read`
   - `data.records:write`
5. Add access: Select your "NEXUS Alert - Immigration Lawyer Leads" base
6. Click "Create token"
7. **Copy the token immediately** (you can't see it again!)

---

## Step 6: Configure Environment Variables

Add to your `/marketing/b2b-tools/.env` file:

```bash
# Airtable
AIRTABLE_API_KEY=pat1234567890abcdef
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

Replace:
- `pat1234567890abcdef` with your actual API token
- `appXXXXXXXXXXXXXX` with your actual Base ID from Step 2

---

## Step 7: Test Upload

Run a test upload with a small batch:

```bash
cd /Users/michaelguo/nexus-alert/marketing/b2b-tools
node lead-gen-pipeline.js
```

The script will:
1. Scrape Google Maps via Apify
2. Extract emails from websites
3. Verify with Hunter.io
4. Segment by firm size
5. Upload to Airtable

Check your Airtable base - you should see records appear!

---

## Step 8: Set Up Automations (Optional)

### Auto-Update Last Contact Date
1. Click "Automations" → "Create automation"
2. Trigger: "When record matches conditions"
3. Condition: Outreach Status = "Email Sent" AND Email Sent Date is not empty
4. Action: "Update record" → Set "Last Contact Date" to TODAY()

### Auto-Set Next Action Date
1. Trigger: "When record matches conditions"
2. Condition: Outreach Status = "Email Sent"
3. Action: "Update record" → Set "Next Action Date" to 4 days from Email Sent Date

### Notify on Hot Leads
1. Trigger: "When record matches conditions"
2. Condition: Outreach Status changes to "Replied"
3. Action: "Send email" to your email address

---

## Step 9: Mobile App Setup (Optional)

1. Download Airtable app on iOS/Android
2. Log in with your account
3. Access your base on the go
4. Great for updating notes after demo calls!

---

## Usage Tips

### Bulk Updates
- Select multiple records → Right-click → "Update field"
- Useful for batch email sends

### CSV Export
- Click "..." → "Download CSV"
- Export for offline analysis or backups

### Collaboration
- Click "Share" → Add team members
- Assign "Owner" field to track who's handling each lead

### Integrations
- Zapier: Auto-sync email replies → Update Outreach Status
- Gmail: Auto-create records from forwarded emails
- Slack: Get notified on hot leads

---

## Sample Record

Here's what a fully populated record looks like:

```
Name: Sarah Chen
Email: sarah@chenimmigrationlaw.com
Firm: Chen Immigration Law Office
Firm Size: Solo (1)
City: Seattle
State: WA
Phone: (206) 555-1234
Website: https://chenimmigrationlaw.com
Priority: VERY HIGH
Firm Size Priority: HIGH
Source: Google Maps (Apify)
Email Status: Valid
Email Score: 95
Outreach Status: Email Sent
Google Maps URL: https://maps.google.com/...
Rating: 4.8
Review Count: 47
Notes: Specializes in H-1B and NEXUS. Very active on LinkedIn.
Email Sent Date: 2026-03-18
Last Contact Date: 2026-03-18
Next Action: Follow-up email #2
Next Action Date: 2026-03-22
Owner: Michael Guo
```

---

## Troubleshooting

### Error: "Invalid API key"
- Regenerate API token at https://airtable.com/create/tokens
- Make sure you added `data.records:read` and `data.records:write` scopes
- Check that you granted access to the specific base

### Error: "Base not found"
- Double-check Base ID in your `.env` file
- Make sure the API token has access to this base

### Records not appearing
- Check the "All Leads" view (filters might be hiding them)
- Verify field names match exactly (case-sensitive!)

### Slow uploads
- Airtable rate limit is 5 requests/second
- The script automatically handles this with 250ms delays

---

## Next Steps

Once your Airtable base is set up:

1. ✅ Run full lead generation pipeline
2. ✅ Review and clean data in Airtable
3. ✅ Start email outreach campaign
4. ✅ Track responses and update statuses
5. ✅ Schedule demos with interested prospects
6. ✅ Convert trials to paid customers

**Target:** 500 verified emails → 50 paid customers @ $99/mo = **$4,950 MRR** 🚀
