# Privacy Policy — NEXUS Alert

**Last updated:** March 18, 2026

**Effective Date:** March 18, 2026

---

## Overview

NEXUS Alert is a Chrome extension that monitors appointment availability on the CBP Trusted Traveler Programs website (ttp.cbp.dhs.gov). Your privacy is important to us. This policy explains what data we collect, how we use it, and your choices.

---

## What Data We Collect

### Free Tier (No Account Required)

**We collect ZERO personal data.** All data stays in your browser.

The extension stores the following data **locally in your browser** (chrome.storage.local):

- **User preferences:** Selected program (NEXUS/Global Entry/SENTRI), enrollment centers, date/time filters, polling interval, notification settings
- **Slot history:** A log of appointment slots discovered during monitoring, used for statistics and to avoid duplicate notifications
- **Cached location data:** Enrollment center names and addresses fetched from the CBP public API

**This data never leaves your browser** and is automatically deleted when you uninstall the extension.

### Premium Tier (Optional Paid Upgrade)

If you upgrade to the Premium tier ($4.99/month), we collect:

- **Email address:** Used to send email notifications when appointment slots are found
- **Payment information:** Processed securely by Stripe (we do not store credit card details)
- **License key:** A unique identifier to verify your premium subscription

**How we use this data:**
- Email address: Send appointment slot notifications via Resend.com (transactional email provider)
- License key: Validate your premium subscription status

**We do NOT:**
- Sell your email address
- Share your data with third parties (except Stripe for payment processing and Resend for email delivery)
- Use your data for marketing purposes without your consent
- Track your browsing activity

---

## External Services

### Free Tier

The extension makes requests only to:

- **ttp.cbp.dhs.gov** — The official CBP Trusted Traveler Programs website, to check for available appointment slots and fetch enrollment center information. This is a public API that does not require authentication.

### Premium Tier

The extension additionally contacts:

- **api.nexus-alert.com** — Our backend server (Cloudflare Worker) to verify your license and send email notifications
- **Stripe** — Payment processing (PCI-compliant, we never see your credit card)
- **Resend.com** — Transactional email delivery (GDPR-compliant)

No analytics, tracking, or advertising services are used.

---

## Data Retention

### Free Tier
- Local data is stored indefinitely until you uninstall the extension or clear browser data

### Premium Tier
- Email address: Stored until you cancel your subscription
- License keys: Stored as long as your account is active
- Payment history: Retained by Stripe per their policies
- You can request data deletion at any time by emailing support@nexus-alert.com

---

## Permissions

The extension requests the following Chrome permissions:

| Permission | Purpose |
|------------|---------|
| `alarms` | Schedule periodic slot checks in the background |
| `notifications` | Show desktop notifications when slots are found |
| `storage` | Save your preferences and slot history locally |
| `offscreen` | Play sound alerts when new slots appear (Manifest V3 requirement) |
| `tabs` | Open the booking page when you click a notification |
| `https://ttp.cbp.dhs.gov/*` | Access the CBP scheduler API to check for available slots |
| `https://api.nexus-alert.com/*` | Premium tier: Verify license and send email notifications |

---

## Your Rights (GDPR, CCPA, etc.)

If you are a Premium user, you have the right to:

- **Access** your data — Email us to request a copy of your stored data
- **Deletion** — Request deletion of your email and license key
- **Portability** — Receive your data in a machine-readable format
- **Correction** — Update your email address
- **Opt-out** — Cancel your subscription and stop email notifications

To exercise these rights, email: **support@nexus-alert.com**

---

## Data Security

- All data transmitted to our backend is encrypted via HTTPS (TLS 1.2+)
- Premium user data is stored in Cloudflare KV (encrypted at rest)
- Payment processing is handled by Stripe (PCI DSS Level 1 compliant)
- Email delivery via Resend (SOC 2 Type II certified)

---

## Children's Privacy

NEXUS Alert is not intended for users under 13 years of age. We do not knowingly collect data from children.

---

## International Users

If you are outside the United States:

- Your data may be transferred to and processed in the United States
- We comply with GDPR (EU), PIPEDA (Canada), and CCPA (California)
- You have the same rights as outlined above

---

## Third-Party Services

We use the following third-party services:

| Service | Purpose | Privacy Policy |
|---------|---------|----------------|
| **Stripe** | Payment processing | https://stripe.com/privacy |
| **Resend** | Email notifications | https://resend.com/legal/privacy-policy |
| **Cloudflare** | Backend infrastructure | https://www.cloudflare.com/privacypolicy/ |

---

## Open Source

The complete source code is available at: **https://github.com/[your-username]/nexus-alert**

You can verify exactly what data is collected and how it's used.

---

## Cookies

We do not use cookies in the extension or on our backend.

---

## Changes to This Policy

We may update this privacy policy from time to time. Changes will be posted at this URL with an updated "Last updated" date. Continued use after changes constitutes acceptance.

---

## Not Affiliated with CBP or DHS

NEXUS Alert is an independent tool. We are not affiliated with, endorsed by, or sponsored by U.S. Customs and Border Protection (CBP), the Department of Homeland Security (DHS), or any government agency.

---

## Contact

For privacy questions or data requests, email: **support@nexus-alert.com**

Or open an issue on GitHub: **https://github.com/[your-username]/nexus-alert/issues**

---

**Summary:**
- Free tier: Zero data collection, everything stays in your browser
- Premium tier: We collect your email (for notifications) and process payments via Stripe
- No tracking, no ads, no data selling
- Open source and transparent
