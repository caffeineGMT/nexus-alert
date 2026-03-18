# B2B Lead Generation Guide - 500 Immigration Lawyers

Complete guide to building a database of 500 qualified immigration lawyer leads, segmented by firm size, with verified emails, ready for outreach.

---

## 🎯 Objective

**Build a list of 500 qualified leads:**
- ✅ Immigration lawyers in US-Canada border states + major cities
- ✅ Verified email addresses (Hunter.io validation)
- ✅ Segmented by firm size (Solo, Small 2-10, Large 10+)
- ✅ Stored in Airtable with columns: Name, Firm, Email, Phone, City, State, Firm Size, Outreach Status
- ✅ Prioritized: Solo practitioners (easiest to close) > Small firms > Large firms

---

## 📦 Lead Sources

### 1. Google Maps Scraping (Apify) - **Primary Source**
- **Target:** 300-400 leads
- **Method:** Apify's Google Maps Scraper actor
- **Coverage:** 22 target cities near NEXUS enrollment centers
- **Cost:** $50/month for 100,000 results
- **Data:** Name, phone, website, address, rating, reviews

### 2. AILA Directory - **Supplemental**
- **Target:** 100-150 leads
- **Method:** Google search for AILA members (directory requires membership)
- **Coverage:** Same 22 target cities
- **Cost:** Free
- **Data:** Name, firm, location, snippet with contact info

### 3. LinkedIn Sales Navigator - **Manual Export**
- **Target:** 100-200 leads
- **Method:** Manual CSV export from Sales Navigator searches
- **Coverage:** Greater Seattle, Vancouver, Toronto, Buffalo, Detroit areas
- **Cost:** $99/month (or use free trial)
- **Data:** Name, title, firm, LinkedIn URL, email (if available)

### 4. Avvo Directory - **Optional**
- **Target:** 50-100 leads
- **Method:** Puppeteer scraping of public profiles
- **Coverage:** US cities only
- **Cost:** Free
- **Data:** Name, firm, location, rating, website

---

## 🛠️ Tech Stack

| Tool | Purpose | Cost | API Key Required |
|------|---------|------|------------------|
| **Apify** | Google Maps scraping | $50/mo | Yes |
| **Hunter.io** | Email verification | $49/mo (or 100 free/month) | Yes |
| **Airtable** | Lead database/CRM | Free (<1,200 records) | Yes |
| **Puppeteer** | Website scraping | Free | No |
| **Node.js** | Automation scripts | Free | No |

---

## 🚀 Quick Start (5 Steps)

### Step 1: Install Dependencies

```bash
cd /Users/michaelguo/nexus-alert/marketing/b2b-tools
npm install
```

This installs:
- `airtable` - Airtable API client
- `puppeteer` - Headless browser for scraping
- `cheerio` - HTML parsing
- `node-fetch` - HTTP requests
- `dotenv` - Environment variables

---

### Step 2: Configure API Keys

Copy the example environment file:

```bash
cp .env.example .env
nano .env
```

Add your API keys:

```bash
# Hunter.io (email verification)
# Sign up: https://hunter.io
# Free tier: 100 verifications/month
HUNTER_API_KEY=abc123...

# Apify (Google Maps scraping)
# Sign up: https://apify.com
# Free tier: $5 credit (good for ~50 results)
# Recommended: $50/mo plan
APIFY_API_KEY=apify_api_xyz...

# Airtable (lead database)
# Sign up: https://airtable.com
# Create a token: https://airtable.com/create/tokens
# Get Base ID from your base URL
AIRTABLE_API_KEY=pat_abc123...
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

**Detailed setup guides:**
- Hunter.io: See section "Hunter.io Setup" below
- Apify: See section "Apify Setup" below
- Airtable: See `airtable-setup-guide.md`

---

### Step 3: Set Up Airtable Base

Follow the complete guide: **[airtable-setup-guide.md](./airtable-setup-guide.md)**

**Quick version:**
1. Create new base: "NEXUS Alert - Immigration Lawyer Leads"
2. Create table: "Leads"
3. Add 20 fields (Name, Email, Firm, Firm Size, etc.)
4. Create API token with `data.records:read` and `data.records:write` scopes
5. Copy Base ID from URL
6. Add to `.env` file

---

### Step 4: Run Lead Generation Pipeline

Run the full automated pipeline:

```bash
node lead-gen-pipeline.js
```

**What it does:**
1. 🗺️  Scrapes Google Maps via Apify (22 cities, ~30 lawyers each = 600+ results)
2. 📧 Extracts emails from law firm websites
3. ✅ Verifies emails with Hunter.io (100/day limit)
4. 📊 Segments by firm size (Solo, Small, Large)
5. 📤 Uploads to Airtable

**Runtime:** ~45-60 minutes for full pipeline

**Output:**
- JSON file: `/marketing/lead-data/gmaps-leads-YYYY-MM-DD.json`
- Airtable: All leads uploaded with full metadata
- CSV fallback: If Airtable credentials not set

---

### Step 5: Import LinkedIn Leads (Optional)

**Export from LinkedIn Sales Navigator:**

1. Go to https://www.linkedin.com/sales/
2. Search: "Immigration Lawyer" OR "Immigration Attorney"
3. Location filters: Vancouver, Seattle, Toronto, Buffalo, Detroit
4. Click "Save search" → "Export" → Download CSV
5. Import with:

```bash
node linkedin-import.js path/to/linkedin-export.csv
```

Then re-run the pipeline to merge:

```bash
node lead-gen-pipeline.js
```

The script auto-merges all lead sources from `/marketing/lead-data/*.json`

---

## 📊 Expected Results

### Lead Count by Source

| Source | Expected Leads | With Email | Verified |
|--------|---------------|------------|----------|
| Google Maps (Apify) | 400-500 | 60-70% | 50-60% |
| AILA Directory | 100-150 | 30-40% | 25-35% |
| LinkedIn Sales Navigator | 100-200 | 20-30% | 15-25% |
| Avvo (optional) | 50-100 | 50-60% | 40-50% |
| **TOTAL** | **650-950** | **450-600** | **350-500** |

### Firm Size Distribution (Target)

| Firm Size | Count | Priority | Conversion Rate |
|-----------|-------|----------|-----------------|
| Solo (1) | 250-300 | HIGH | 3-5% (7-15 customers) |
| Small (2-10) | 200-250 | MEDIUM | 2-3% (4-7 customers) |
| Large (10+) | 100-150 | LOW | 1-2% (1-3 customers) |
| **TOTAL** | **550-700** | - | **12-25 customers** |

**Revenue target:** 20 customers × $99/mo = **$1,980 MRR**

---

## 🔧 Detailed Setup Guides

### Hunter.io Setup

1. **Sign up:** https://hunter.io/users/sign_up
2. **Get API key:**
   - Go to https://hunter.io/api-keys
   - Click "Create API key"
   - Name: "NEXUS Alert Lead Verification"
   - Copy the key (starts with a long hex string)
3. **Add to .env:** `HUNTER_API_KEY=your_key_here`
4. **Check limits:**
   - Free: 100 verifications/month
   - Starter ($49/mo): 1,000 verifications/month
   - Growth ($99/mo): 5,000 verifications/month

**Tip:** Start with free tier. Run pipeline in batches:
- Day 1: 100 verifications
- Day 2: 100 verifications
- Etc.

---

### Apify Setup

1. **Sign up:** https://apify.com/sign-up
2. **Get API key:**
   - Go to https://console.apify.com/account/integrations
   - Copy "API token" (starts with `apify_api_`)
3. **Add to .env:** `APIFY_API_KEY=apify_api_...`
4. **Choose plan:**
   - Free: $5 credit (~50 Google Maps results)
   - Starter: $49/mo (unlimited results, 20 concurrent actors)
   - **Recommended for 500 leads:** Starter plan

**Actor we use:** `nwua9/google-maps-scraper`
- Cost: ~$0.10 per 100 results
- For 600 results: ~$0.60
- Well within $49/mo budget

**Alternative (cheaper):**
Run `scrape-google-maps.js` (free Puppeteer scraping)
- Slower (5-10 minutes per city)
- Higher risk of IP blocks
- But $0 cost

---

### Airtable Setup

See **[airtable-setup-guide.md](./airtable-setup-guide.md)** for complete instructions.

**Quick checklist:**
- [ ] Create base: "NEXUS Alert - Immigration Lawyer Leads"
- [ ] Create table: "Leads" with 20 fields
- [ ] Create API token with read/write scopes
- [ ] Copy Base ID from URL
- [ ] Add both to `.env`
- [ ] Test with: `node lead-gen-pipeline.js`

---

## 📁 Project Structure

```
marketing/b2b-tools/
├── lead-gen-pipeline.js         # 🚀 Master pipeline (use this!)
├── scrape-google-maps.js        # Fallback: Puppeteer Google Maps scraper
├── scrape-aila.js               # AILA directory scraper
├── scrape-avvo.js               # Avvo directory scraper
├── linkedin-import.js           # Import LinkedIn Sales Navigator CSV
├── enrich-leads.js              # Extract emails from websites
├── verify-emails.js             # Standalone Hunter.io verification
├── airtable-setup-guide.md      # Airtable setup instructions
├── LEAD_GENERATION_GUIDE.md     # This file!
├── .env.example                 # Environment variable template
├── .env                         # Your actual credentials (gitignored)
└── package.json                 # Dependencies

marketing/lead-data/              # Generated data files
├── gmaps-leads-YYYY-MM-DD.json  # Google Maps results
├── linkedin-leads-YYYY-MM-DD.json
├── aila-leads-YYYY-MM-DD.json
└── immigration-lawyers-YYYY-MM-DD.csv  # Fallback CSV
```

---

## 🎬 Execution Plan (5 Days to 500 Leads)

### Day 1: Setup
- [ ] Install dependencies (`npm install`)
- [ ] Configure `.env` with API keys
- [ ] Set up Airtable base
- [ ] Test with dry run: `node lead-gen-pipeline.js`

### Day 2: Google Maps Scraping
- [ ] Run full pipeline: `node lead-gen-pipeline.js`
- [ ] Expected: 400-500 leads with 60-70% email coverage
- [ ] Hunter.io: Verify 100 emails (free tier)

### Day 3: AILA + LinkedIn
- [ ] Run AILA scraper: `node scrape-aila.js`
- [ ] Export LinkedIn Sales Navigator CSV
- [ ] Import LinkedIn: `node linkedin-import.js path/to/csv`
- [ ] Re-run pipeline to merge and upload

### Day 4: Email Verification
- [ ] Verify next 100 emails with Hunter.io
- [ ] Manual cleanup in Airtable (remove duplicates, invalid entries)
- [ ] Enrich missing data (visit websites, add notes)

### Day 5: Finalize & Segment
- [ ] Verify final 100 emails
- [ ] Segment by firm size in Airtable
- [ ] Create outreach views (Ready to Contact, By Priority, etc.)
- [ ] Export CSV for backup
- [ ] **Ready for outreach! 🚀**

**Total leads:** 500-600
**Verified emails:** 350-500
**Ready to contact:** 350+ (solo practitioners prioritized)

---

## 🚨 Common Issues & Solutions

### Issue: "APIFY_API_KEY not set"
**Solution:** Add Apify API key to `.env` file. Or use fallback: `node scrape-google-maps.js`

### Issue: "Hunter.io daily limit exceeded"
**Solution:** Run in batches. The pipeline auto-limits to 100/day. Run again tomorrow.

### Issue: "Airtable upload failed"
**Solution:**
1. Check API token has `data.records:write` scope
2. Verify Base ID is correct
3. Check that table name is exactly "Leads" (case-sensitive)

### Issue: "No emails found"
**Solution:**
1. Many law firms hide emails behind contact forms
2. Generate email candidates (the script does this automatically)
3. Use Hunter.io "Email Finder" API (separate feature)

### Issue: "Too many duplicates"
**Solution:**
1. Airtable: Use "Find duplicates" feature
2. Or dedupe in script before upload (coming soon)

---

## 📈 Success Metrics

### Quality Thresholds

| Metric | Target | Acceptable | Poor |
|--------|--------|------------|------|
| Total leads | 500+ | 400-499 | <400 |
| Email coverage | 70%+ | 60-69% | <60% |
| Verified emails | 500+ | 350-499 | <350 |
| Solo practitioners | 250+ | 200-249 | <200 |
| Deliverability rate | 95%+ | 90-94% | <90% |

### Lead Scoring

**High-value lead:**
- ✅ Solo practitioner or small firm (2-5 lawyers)
- ✅ Located in Vancouver, Seattle, Toronto, Buffalo, or San Diego
- ✅ Verified email (Hunter.io score 90+)
- ✅ Active website with recent blog posts
- ✅ 4+ star rating with 20+ reviews

**Medium-value lead:**
- ⚠️ Small firm (5-10 lawyers)
- ⚠️ Located in secondary cities
- ⚠️ Email candidate (not verified)
- ⚠️ Basic website (no blog)
- ⚠️ 3+ star rating with 10+ reviews

**Low-value lead:**
- ❌ Large firm (10+ lawyers)
- ❌ Located outside target areas
- ❌ No email found
- ❌ No website or outdated site
- ❌ <3 stars or <5 reviews

---

## 🔄 Ongoing Maintenance

### Weekly Tasks
- [ ] Run pipeline to refresh data (lawyers change firms)
- [ ] Verify new email addresses (Hunter.io)
- [ ] Update Airtable with outreach results
- [ ] Clean duplicates and invalid entries

### Monthly Tasks
- [ ] Expand to new cities (if needed)
- [ ] Re-verify old email addresses (bounces change)
- [ ] Export CSV backup
- [ ] Review conversion rates by segment

---

## 🎯 Next Steps After 500 Leads

Once your database is ready:

### 1. Start Email Outreach
```bash
node outreach-manager.js --template 1 --priority "VERY HIGH" --limit 10
```

See: **[email-templates.md](./email-templates.md)** for full sequence

### 2. LinkedIn Outreach
```bash
node linkedin-outreach.js
```

See: **[linkedin-outreach.md](./linkedin-outreach.md)** for playbook

### 3. Track in Airtable
- Update "Outreach Status" as you send emails
- Log demo calls and trial signups
- Track conversions to paid

### 4. A/B Testing
- Test subject lines (open rate)
- Test CTAs (reply rate)
- Test timing (best day/time)

### 5. Scale to 1,000+ Leads
- Add more cities (Portland, Calgary, Montreal, Phoenix)
- Scrape state bar directories
- Partner with immigration lawyer associations

---

## 📞 Support

**Issues with the scripts?**
- Check `/marketing/b2b-tools/README.md`
- Review error messages in console
- Test with dry run flag: `--dry-run`

**Questions about the B2B strategy?**
- See: **[B2B_OUTREACH_PACKAGE_SUMMARY.md](./B2B_OUTREACH_PACKAGE_SUMMARY.md)**
- Email templates: `email-templates.md`
- Target prospects: `target-prospects.md`

**API rate limits?**
- Hunter.io: 100/day (free) or 1,000/mo (paid)
- Apify: Unlimited with paid plan
- Airtable: 5 requests/second (auto-handled)

---

## ✅ Final Checklist

**Before running pipeline:**
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` configured with 3 API keys (Apify, Hunter, Airtable)
- [ ] Airtable base created with "Leads" table
- [ ] Test run successful

**After pipeline completes:**
- [ ] 500+ leads in Airtable
- [ ] 350+ verified emails
- [ ] Leads segmented by firm size
- [ ] Views created (Ready to Contact, Solo Practitioners, etc.)
- [ ] CSV backup exported

**Ready for outreach when:**
- [ ] Email templates reviewed and personalized
- [ ] SMTP or Resend configured for sending
- [ ] First batch identified (10-20 solo practitioners)
- [ ] Tracking system ready (Airtable outreach statuses)

---

## 🚀 Launch!

**You're ready to:**
1. ✅ Contact 500 qualified immigration lawyers
2. ✅ Demo NEXUS Alert Pro tier ($99/mo white-label monitoring)
3. ✅ Convert 20-50 customers = **$2K-5K MRR**
4. ✅ Scale to 100+ customers = **$10K+ MRR**

**Target ARR:** $60K-120K from immigration lawyer B2B tier alone! 🎉

---

**Questions?** See the other guides in this directory:
- `airtable-setup-guide.md` - Airtable CRM setup
- `email-templates.md` - Cold email sequences
- `linkedin-outreach.md` - LinkedIn playbook
- `target-prospects.md` - Hand-picked top 20 firms
- `EXECUTION_PLAYBOOK.md` - 4-week outreach plan
