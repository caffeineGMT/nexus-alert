# 🚀 START HERE - Collect 5 Testimonials in 24 Hours

**Created:** March 18, 2026
**Your Mission:** Get 5 user testimonials before Product Hunt launch

---

## ⚡ QUICK START (Do This Now - 30 Minutes)

### Step 1: Copy Your Reddit DM Template (2 min)

Open `REDDIT_DM_TEMPLATES.txt` and copy **Template 1**.

### Step 2: Find 5 Users to Message (5 min)

You have **15 warm Reddit leads** in `leads.json`. Target these 5 posts first:

1. **Colombian citizenship post** (HIGH engagement)
   - https://reddit.com/r/GlobalEntry/comments/1rhltzt/

2. **Tool builder discussion** (Direct NEXUS Alert mentions)
   - https://reddit.com/r/GlobalEntry/comments/1o7j8oz/

3. **Approval celebration** (Positive vibes)
   - https://reddit.com/r/GlobalEntry/comments/1pvp1a4/

4. **Kids NEXUS** (Family angle)
   - https://reddit.com/r/GlobalEntry/comments/1r0f24k/

5. **YYZ wait times** (Frustrated users)
   - https://reddit.com/r/GlobalEntry/comments/1rdq6jx/

### Step 3: Send 5 Reddit DMs (20 min)

For each post above:

1. Click the Reddit link
2. Read the comments
3. Find 1 user who engaged positively
4. Click their username → **"Send Message"**
5. Paste Template 1 (replace `[Username]` with their actual username)
6. Send!

### Step 4: Track Your Outreach (3 min)

Update `testimonial-tracking.json` after each DM:
- Add actual username
- Set `contacted_date` to today
- Change `status` to `"contacted"`

---

## 📊 Expected Timeline

| Day | Action | Expected Result |
|-----|--------|-----------------|
| **Day 1** (Today) | Send 5 Reddit DMs | 1-2 responses |
| **Day 2** | Follow up + send 5 more | 3-4 total responses |
| **Day 3** | Review submissions | 2-3 testimonials submitted |
| **Day 4** | Approve testimonials | 3-4 approved |
| **Day 5** | Send 3 more DMs | 5+ total submissions |
| **Day 6** | Final approvals | ✅ 5 testimonials ready |
| **Day 7** | Add to website | 🎉 Launch ready! |

---

## 🎯 What Happens After You Send DMs

### Scenario 1: User Replies "Yes!"
**Your response:**
```
Awesome! Thanks so much.

Just fill out this quick form (takes 2 min):
👉 https://nexus-alert.com/testimonials/submit

Once you submit, I'll send you your Premium code within 24 hours.

Let me know if you have any questions!
```

### Scenario 2: User Asks Questions
Common questions & answers:

**Q: "What do I need to include?"**
```
Just 2-3 sentences about:
- Which program (NEXUS/Global Entry/SENTRI)
- How long you waited before using NEXUS Alert
- How quickly you found a slot after installing
- What the experience was like

Example: "I refreshed manually for 3 weeks with no luck. After installing NEXUS Alert,
I got notified within 2 days and booked immediately. Saved me months of waiting!"
```

**Q: "Will you use my full name?"**
```
Nope! We only use first name + last initial (e.g., "Sarah C.") and your city/state.
Your email is never shared publicly.
```

**Q: "How do I get the Premium code?"**
```
Once you submit the testimonial, I'll review it within 24 hours and email you the
Premium code. It's good for 6 months of unlimited 2-min checks, email alerts, and SMS.
```

### Scenario 3: User Doesn't Respond
Wait 3 days, then send **Template 3** (short follow-up).

---

## 🔍 Check Submissions Daily

### Morning Routine (5 min):
1. Go to: https://nexus-alert.com/admin/testimonials
2. Check for new submissions
3. Review pending testimonials
4. Approve good ones (click "Approve (6 months)")
5. Users automatically get Premium code email

### What Makes a Good Testimonial:
✅ Specific numbers (days/weeks)
✅ Clear before/after story
✅ Emotional language ("lifesaver", "game-changer")
✅ Real outcome ("booked appointment")

❌ Generic ("it's great")
❌ No details
❌ Too short (1 sentence)

---

## 📧 BONUS: Email Outreach (Optional)

If you have user emails from:
- ConvertKit email list
- Chrome Web Store reviews
- GitHub stars
- Direct emails to hello@nexus-alert.com

**Send email requests:**

1. Set up Resend API key:
   ```bash
   export RESEND_API_KEY=re_your_key_here
   ```

2. Create `scripts/recipients.json` with format:
   ```json
   {
     "recipients": [
       { "email": "user@example.com", "name": "John Doe" }
     ]
   }
   ```

3. Send emails:
   ```bash
   node scripts/send-testimonial-requests.js --batch scripts/recipients.json
   ```

---

## ✅ Daily Checklist

### Today (Day 1):
- [ ] Send 5 Reddit DMs using Template 1
- [ ] Update tracking file with usernames
- [ ] Post on Twitter/X (optional)
- [ ] Check for responses (evening)

### Tomorrow (Day 2):
- [ ] Reply to any responses
- [ ] Send 5 more Reddit DMs
- [ ] Check admin panel for submissions

### Day 3:
- [ ] Approve submitted testimonials
- [ ] Thank users personally
- [ ] Send 3 more DMs if needed

### Day 4-7:
- [ ] Continue outreach until 5 approved
- [ ] Add testimonials to website
- [ ] Prepare for Product Hunt launch

---

## 📁 All Files You Need

| File | Purpose |
|------|---------|
| `REDDIT_DM_TEMPLATES.txt` | Copy/paste DM templates |
| `testimonial-tracking.json` | Track who you contacted |
| `leads.json` | 15 warm Reddit leads |
| `TESTIMONIAL_ACTION_PLAN.md` | Complete strategy guide |
| `docs/TESTIMONIAL_COLLECTION_GUIDE.md` | Full documentation |

---

## 🎁 Premium Code Details

**What users get:**
- 6 months Premium free (worth $30)
- 2-minute appointment checks
- Email alerts
- SMS notifications
- Priority support

**How it works:**
1. User submits testimonial
2. You approve in admin panel
3. Backend auto-generates Premium code: `PREMIUM-TESTIMONIAL-[INITIALS]-[RANDOM]`
4. User receives email with code + redemption instructions

**Example code:** `PREMIUM-TESTIMONIAL-SC-A7X9K`

---

## 🚨 Troubleshooting

**Problem: No responses to Reddit DMs**
- Solution: Send more DMs (15-20 total), try Template 2

**Problem: Testimonials are too generic**
- Solution: Reply asking for specifics ("How many days did it take?")

**Problem: Admin panel not loading**
- Solution: Check Cloudflare Worker is deployed, verify admin token

**Problem: Premium codes not sending**
- Solution: Check RESEND_API_KEY is set in Cloudflare secrets

---

## 🎯 Success Metrics

**Target:** 5 testimonials
**Stretch:** 10 testimonials
**Dream:** 15+ with photos

**Where they'll be used:**
1. ✅ Website homepage
2. ✅ Chrome Web Store listing
3. ✅ Product Hunt launch
4. ✅ Email campaigns
5. ✅ Social proof ads

---

## 💪 YOU GOT THIS!

**Remember:**
- 5 testimonials = 15 DMs (realistic)
- Each DM takes 2 minutes
- Total time: 30 minutes of work
- Result: Massive credibility boost

**Start now:** Open `REDDIT_DM_TEMPLATES.txt` → Copy Template 1 → Send 5 DMs

Questions? Check `TESTIMONIAL_ACTION_PLAN.md` for full details.

---

## 🚀 NEXT STEPS

1. **RIGHT NOW:** Send your first Reddit DM (it gets easier after the first one!)
2. **Tonight:** Check for responses
3. **Tomorrow:** Follow up + send 5 more
4. **This week:** Collect all 5 testimonials
5. **Next week:** Launch on Product Hunt with social proof! 🎉

**GO! The faster you start, the faster you launch.** 🔥
