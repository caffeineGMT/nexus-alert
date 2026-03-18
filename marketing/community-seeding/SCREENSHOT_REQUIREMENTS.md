# Screenshot Requirements for Reddit Launch Campaign

## Overview
Screenshots are CRITICAL for social proof and building trust. You need 2-3 high-quality, authentic screenshots to include in Reddit posts and respond to "proof?" comments.

---

## Screenshot 1: Desktop Notification (REQUIRED)

### What to Show
✅ **Chrome browser notification popup**
- Clear "NEXUS Alert" branding
- "Appointment available at [Enrollment Center Name]"
- Date and time of available appointment
- "Click to book now" or similar CTA
- Timestamp visible (proves it's real-time)

### Technical Details
- **Dimensions:** 400-600px wide (native notification size)
- **Format:** PNG (transparency preserved)
- **Quality:** High-res, no compression artifacts
- **Context:** Include part of Chrome browser UI (proves it's a Chrome extension)

### How to Capture
1. **Option A (Real notification):**
   - Wait for actual appointment to trigger notification
   - Use screenshot tool immediately (macOS: Cmd+Shift+4, Windows: Win+Shift+S)
   - Capture notification + part of browser UI

2. **Option B (Demo mode):**
   - Add "demo mode" to extension settings
   - Trigger fake notification with realistic data
   - Screenshot immediately
   - **Mark as "demo" in post** if using this method

3. **Option C (Mock in Figma/Photoshop):**
   - Recreate macOS/Windows notification style
   - Must look authentic (use native OS fonts, colors)
   - **HIGH RISK** - can look fake if not perfect

### Example Text on Notification
```
NEXUS Alert

Appointment available at Blaine, WA
📅 March 15, 2026 at 9:30 AM

Click to book now →
```

### What to Blur/Redact
- Nothing (notification is generic, no personal info)
- If demo mode shows test data, that's fine

---

## Screenshot 2: Appointment Confirmation (REQUIRED)

### What to Show
✅ **ttp.cbp.dhs.gov confirmation page OR email**
- Appointment confirmed header
- Enrollment center name
- Date and time
- Confirmation number (partial)
- CBP/DHS branding visible

### Technical Details
- **Dimensions:** Full-width browser screenshot or email client
- **Format:** PNG
- **Quality:** Text must be readable
- **Context:** URL bar visible (proves it's official ttp.cbp.dhs.gov)

### How to Capture
1. **Option A (Web confirmation page):**
   - After booking appointment on ttp.cbp.dhs.gov
   - Screenshot full page (scroll if needed, stitch together)
   - Include URL bar showing ttp.cbp.dhs.gov

2. **Option B (Confirmation email):**
   - Email from noreply@cbp.dhs.gov
   - Subject: "GOES Appointment Confirmation" or similar
   - Screenshot email client with visible sender

### What to Blur/Redact
⚠️ **MUST REDACT:**
- Full name (blur or black out)
- Full address
- Passport/Known Traveler Number
- Email address (if visible)
- Phone number
- Date of birth

✅ **KEEP VISIBLE:**
- Appointment date/time
- Enrollment center name
- Confirmation number (partial - last 4 digits OK)
- CBP/DHS logo and branding
- General appointment details

### Redaction Method
- Use macOS Preview → Tools → Annotate → Rectangle (filled black)
- Or Photoshop/GIMP → Selection → Fill black
- **Don't use blur** (can be reversed) - use solid black rectangles

### Example (text only, for reference)
```
[BLACK RECTANGLE - Name redacted]
Confirmation Number: ****6789

Appointment Details:
Date: March 15, 2026
Time: 9:30 AM
Location: Blaine NEXUS Enrollment Center
         9901 Pacific Highway, Blaine, WA 98230

[BLACK RECTANGLE - Address redacted]
```

---

## Screenshot 3: Extension Settings Panel (OPTIONAL)

### What to Show
✅ **Extension popup or settings page**
- Clean, professional UI
- Selected enrollment centers (multiple)
- Check frequency selector (30 min / 2 min)
- Date range filter
- Notification settings toggle
- "Premium" vs "Free" tier indicator

### Technical Details
- **Dimensions:** 600-800px wide (popup size or settings page)
- **Format:** PNG
- **Quality:** High-res, professional-looking
- **Context:** Chrome extension UI visible

### Why Include This
- Shows users what they'll see
- Demonstrates polished, legitimate product
- Builds trust (not a sketchy tool)
- Highlights features visually

### How to Capture
1. Open extension popup (click extension icon)
2. Screenshot the popup window
3. OR navigate to extension settings page (chrome-extension://...)
4. Full-page screenshot

### What to Blur/Redact
- Email address (if visible in premium tier settings)
- Nothing else (settings are generic)

---

## Screenshot 4: Success Story Update (COLLECT LATER)

### What to Show
✅ **Reddit comment thread**
- User comment: "I tried it and got an appointment! Thank you!"
- Your response
- Upvotes visible
- Timestamp

### Why Collect This
- Social proof for future marketing
- Testimonials for landing page
- Build credibility for Product Hunt launch

### How to Capture
1. When user comments with success story
2. Screenshot the comment thread
3. Include context (subreddit, upvotes, time)

### Storage
- Save to `/marketing/testimonials/reddit/`
- Name file: `reddit_testimonial_[username]_[date].png`

---

## Posting Screenshots to Reddit

### Best Practices

#### Method 1: Inline Images (RECOMMENDED)
1. Use Reddit's native image upload
2. Upload 2-3 images as gallery
3. Images appear directly in post body
4. **Pros:** Native, high engagement, can't be blocked
5. **Cons:** Max 20 images per post

#### Method 2: Imgur Album
1. Upload to Imgur as private album
2. Link in post body: `[Proof screenshots](https://imgur.com/a/...)`
3. **Pros:** More images, can update later
4. **Cons:** Users have to click link (lower engagement)

#### Method 3: Inline Markdown
1. Upload to Imgur
2. Use markdown: `![Screenshot](https://i.imgur.com/...png)`
3. **Pros:** Images render inline
4. **Cons:** Some subreddits block external images

### Recommended for Launch Posts
**Use Method 1 (Reddit native gallery)** with 2 images:
1. Screenshot 1: Desktop notification
2. Screenshot 2: Appointment confirmation (redacted)

Then reply to comments asking for more with Screenshot 3 (settings panel).

---

## Image Optimization

### File Size
- Target: <500KB per image
- Use PNG compression (TinyPNG, ImageOptim)
- Reddit max: 20MB but smaller is better

### Dimensions
- Max width: 1200px (Reddit scales down larger)
- Height: Variable (depends on content)
- **Don't post tiny images** (<400px wide looks unprofessional)

### Quality Checklist
- [ ] Text is readable at 100% zoom
- [ ] No compression artifacts or blurriness
- [ ] Colors look natural (not oversaturated)
- [ ] Personal info properly redacted (solid black, not blur)
- [ ] Branding visible (NEXUS Alert, CBP/DHS)
- [ ] Context clear (what is this showing?)

---

## Alt Text / Captions (for accessibility)

### Screenshot 1 Caption
```
Desktop notification from NEXUS Alert showing appointment available at Blaine, WA on March 15, 2026
```

### Screenshot 2 Caption
```
Appointment confirmation from ttp.cbp.dhs.gov (personal information redacted for privacy)
```

### Screenshot 3 Caption
```
NEXUS Alert extension settings panel showing enrollment center selection and notification preferences
```

---

## Common Reddit Questions About Screenshots

### Q: "These look fake / Photoshopped"
**A:**
```
I can provide additional proof if needed:
- Original confirmation email (with more info redacted)
- Video walkthrough of the extension in action
- Link to Chrome Web Store listing (verified by Google)

What would help convince you it's legitimate?
```

### Q: "Why is personal info redacted?"
**A:**
```
Privacy reasons - I don't want my full name, passport number, and address on Reddit.

I kept visible:
- Appointment date/time
- Enrollment center location
- Partial confirmation number

This is standard practice when sharing government confirmation screenshots online.
```

### Q: "Can you show a video instead?"
**A:**
```
Sure, I can record a quick screen recording showing:
1. Extension checking ttp.cbp.dhs.gov
2. Notification appearing when slot found
3. Clicking through to book

Let me put that together and post it. Give me a few hours.
```

---

## Video Alternative (OPTIONAL)

If screenshots aren't convincing enough, record a 30-60 second demo video:

### What to Show
1. Chrome browser with extension installed
2. Click extension icon → settings panel
3. Select enrollment centers
4. Show "Check Now" button (manual check)
5. Notification appears (if using demo mode)
6. Click notification → redirects to ttp.cbp.dhs.gov

### Tools
- **macOS:** QuickTime Screen Recording
- **Windows:** Xbox Game Bar (Win+G)
- **Cross-platform:** OBS Studio, Loom

### Upload
- YouTube (unlisted)
- Streamable (no account needed)
- Reddit native video upload

### Length
- 30-60 seconds max
- No audio needed (use text overlays)
- 1080p quality

---

## Screenshot Preparation Checklist (Pre-Launch)

**Monday Night Before Launch:**
- [ ] Screenshot 1: Desktop notification captured
- [ ] Screenshot 2: Appointment confirmation captured and redacted
- [ ] Screenshot 3: Extension settings panel captured (optional)
- [ ] All images optimized (PNG, <500KB each)
- [ ] Personal info double-checked for redaction
- [ ] Images uploaded to Reddit as drafts (test posting)
- [ ] Alt text / captions written
- [ ] Backup copies saved locally (`/marketing/screenshots/`)

**If Screenshots Don't Exist Yet:**
- [ ] Use extension demo mode to generate Screenshot 1
- [ ] Use test account confirmation for Screenshot 2 (if available)
- [ ] Create mockups in Figma (last resort)
- [ ] **MARK AS "DEMO" IN POST** if not using real data

---

## Legal / Privacy Notes

### What's Safe to Share
✅ Generic confirmation screenshots (redacted)
✅ Extension UI screenshots
✅ Desktop notifications (no personal info)
✅ ttp.cbp.dhs.gov URL visible

### What's NOT Safe to Share
❌ Full name, address, passport number
❌ Known Traveler Number (KTN)
❌ Email address
❌ Phone number
❌ Date of birth
❌ Other people's information

### Why This Matters
- Reddit posts are PUBLIC and permanent
- Search engines index Reddit
- Identity theft risk
- Privacy best practices

---

## Storage & Organization

### File Naming Convention
```
screenshot_[type]_[date]_[version].png

Examples:
screenshot_notification_2026-03-20_v1.png
screenshot_confirmation_2026-03-20_redacted.png
screenshot_settings_2026-03-20_final.png
```

### Folder Structure
```
/marketing/screenshots/
  /reddit-launch/
    notification_v1.png
    notification_v2.png
    confirmation_redacted.png
    settings_panel.png
  /testimonials/
    reddit_user1_success.png
    reddit_user2_success.png
  /demos/
    video_demo_60sec.mp4
```

---

## Final Pre-Post Check

Before posting to Reddit, verify:
- [ ] **Personal info redacted** (names, addresses, IDs)
- [ ] **Images look professional** (high quality, no artifacts)
- [ ] **Proof is convincing** (shows real appointment confirmation)
- [ ] **Branding visible** (NEXUS Alert + official CBP/DHS logos)
- [ ] **File size optimized** (<500KB per image)
- [ ] **Captions written** (accessibility)
- [ ] **Backup saved** (local storage + cloud)

---

## If You Don't Have Real Screenshots Yet

### Option A: Wait Until You Have Real Data
- **Pro:** Most authentic, builds maximum trust
- **Con:** Delays launch

### Option B: Use Demo Mode
- **Pro:** Can launch immediately
- **Con:** Must disclose "demo mode" in post

### Option C: Use Stock/Mock Screenshots
- **Pro:** Launch immediately
- **Con:** HIGH RISK - can look fake, damage credibility

### Recommendation
**Use Option B (demo mode) but be transparent:**
```
[Screenshot: Demo notification - showing what you'll see when an appointment opens]
[Screenshot: Sample confirmation page - my actual confirmation with personal info redacted]
```

Being honest about demo screenshots is better than being caught with fake ones.

---

## Questions?

If you need help with:
- Screenshot capture techniques
- Redaction tools
- Image optimization
- Video recording

Post in campaign Slack channel or DM the growth lead.

---

**Remember:** Screenshots are your PROOF. Without them, Reddit will dismiss your post as spam. With good screenshots, you build instant credibility and trust.
