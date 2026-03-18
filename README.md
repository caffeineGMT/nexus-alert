# NEXUS Alert

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/michaelguo/nexus-alert)
[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Production%20Ready-green.svg)](#)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**NEXUS Alert** is a Chrome Extension that monitors the CBP Trusted Traveler Programs portal (ttp.cbp.dhs.gov) for open appointment slots for **NEXUS**, **Global Entry**, and **SENTRI** enrollment interviews — and notifies you the moment one appears.

Never manually refresh the GOES website again. NEXUS Alert checks for slots automatically and sends you desktop, sound, and email notifications so you can book before slots disappear.

---

## 🚀 Production Deployment (Ready to Launch!)

**Status:** Production-ready | Accepting paying customers | Revenue Goal: $1M ARR

Choose your deployment path:

- **⚡ Quick Start (30 min):** [`backend/PRODUCTION_SETUP.md`](backend/PRODUCTION_SETUP.md)
- **📚 Detailed Guide:** [`PRODUCTION_DEPLOYMENT.md`](PRODUCTION_DEPLOYMENT.md)
- **✅ Step-by-Step Checklist:** [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md)

**Testing & Monitoring:**
```bash
# Test payment flow end-to-end
cd backend && ./test-payment-flow.sh

# Monitor production metrics
export STRIPE_API_KEY=sk_live_XXXXX
cd backend && ./monitoring-dashboard.sh
```

![NEXUS Alert Extension](icons/icon128.png)

---

## Architecture

```
┌──────────────────────────────┐
│      Chrome Extension        │
│  background.js (MV3 SW)      │
│  ┌─────────────────────────┐ │
│  │ Alarm every N minutes   │ │
│  └────────────┬────────────┘ │
└───────────────┼──────────────┘
                │ Direct fetch (no CORS)
                ▼
  https://ttp.cbp.dhs.gov/schedulerapi
  (CBP public API — no auth required)

┌──────────────────────────────┐
│   Cloudflare Worker          │       ┌───────────┐
│   nexus-alert-backend        │──────▶│  Resend   │ (email alerts)
│   Cron: */2 * * * *          │       └───────────┘
│   KV: NEXUS_ALERTS_KV        │
│   ┌─────────────────────────┐│
│   │  /api/subscribe         ││
│   │  /api/unsubscribe       ││
│   │  /api/subscribers       ││
│   │  /api/status            ││
│   └─────────────────────────┘│
└──────────────────────────────┘

┌──────────────────────────────┐
│   Next.js Landing Page       │
│   Deployed on GitHub Pages   │
│   /web — static export       │
└──────────────────────────────┘
```

**How it works:**

- The **Chrome Extension** runs a background service worker (MV3) that polls the CBP API on a configurable interval. When a slot opens at your chosen enrollment center, it fires a desktop notification immediately.
- The **Cloudflare Worker** handles server-side monitoring for users who want email alerts even when the browser is closed. It runs on a cron schedule, checks all subscriber locations, and sends email via [Resend](https://resend.com).
- The **Next.js landing page** lives in `/web` and is deployed as a static site.

---

## Local Dev Setup

### Extension

1. Clone this repo.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked**.
5. Select the **repository root** (`nexus-alert/`) as the extension directory.
6. The extension icon appears in your Chrome toolbar. Click it to open the popup.

To reload after changes: click the **refresh** (↺) icon next to the extension on `chrome://extensions`, or use the Extensions shortcut.

### Backend (Cloudflare Worker)

**Prerequisites:** Node.js 18+, a [Cloudflare account](https://dash.cloudflare.com), `wrangler` CLI.

```bash
cd backend
npm install
wrangler login          # authenticates wrangler with your Cloudflare account
npm run dev             # starts local dev server via Miniflare at http://localhost:8787
```

Run the integration test suite (no network calls, uses in-memory KV):

```bash
npm test
```

### Web (Next.js Landing Page)

```bash
cd web
npm install
npm run dev             # starts dev server at http://localhost:3000
```

---

## Environment Variables

All secrets are injected into the Cloudflare Worker at runtime. **Never commit secrets to this repo.**

| Variable | Where Set | Description | Required |
|---|---|---|---|
| `WEBHOOK_SECRET` | Cloudflare Worker secret | Bearer token for internal API authentication | Yes |
| `RESEND_API_KEY` | Cloudflare Worker secret | Resend.com API key for email delivery | Yes |
| `TWILIO_ACCOUNT_SID` | Cloudflare Worker secret | Twilio Account SID (SMS — premium tier only) | No |
| `TWILIO_AUTH_TOKEN` | Cloudflare Worker secret | Twilio auth token | No |
| `TWILIO_FROM_NUMBER` | `wrangler.toml` `[vars]` | Your Twilio number in E.164 format (e.g. `+12015551234`) | No |

Set secrets via the Wrangler CLI:

```bash
wrangler secret put WEBHOOK_SECRET
wrangler secret put RESEND_API_KEY
```

---

## Loading the Chrome Extension (Step-by-Step)

1. Open **Google Chrome**.
2. In the address bar, type `chrome://extensions` and press **Enter**.
3. In the top-right corner, toggle **Developer mode** to **On**.
4. Click the **Load unpacked** button (top-left).
5. In the file picker dialog, navigate to and select the **root of this repository** (the folder containing `manifest.json`).
6. Click **Select** (macOS) or **Open** (Windows).
7. NEXUS Alert now appears in your extensions list. Click the puzzle-piece icon (🧩) in the Chrome toolbar, then pin NEXUS Alert for easy access.

To apply code changes, return to `chrome://extensions` and click the **↺ refresh** icon on the NEXUS Alert card.

---

## Deployment Checklist

Complete these steps in order when deploying to production:

- [ ] Log in to Cloudflare: `wrangler login`
- [ ] Create a KV namespace: `wrangler kv namespace create NEXUS_ALERTS_KV`
  Copy the returned `id` into `wrangler.toml` under `[[kv_namespaces]]`.
- [ ] Deploy the Worker: `cd backend && npm run deploy`
- [ ] Set required secrets:
  ```bash
  wrangler secret put WEBHOOK_SECRET
  wrangler secret put RESEND_API_KEY
  ```
- [ ] (Optional) Set Twilio secrets for SMS alerts:
  ```bash
  wrangler secret put TWILIO_ACCOUNT_SID
  wrangler secret put TWILIO_AUTH_TOKEN
  ```
- [ ] Verify the Worker is live: `curl https://<your-worker>.workers.dev/api/status -H "Authorization: Bearer <WEBHOOK_SECRET>"`
- [ ] Verify KV namespace ID in `wrangler.toml` matches the Cloudflare dashboard.
- [ ] Build and deploy the landing page: `cd web && npm run build && npm run deploy` (or push to the `gh-pages` branch via GitHub Actions).
- [ ] Package extension: zip the repo root (excluding `backend/`, `web/`, `.git/`, `node_modules/`) and submit to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/).

---

## Stripe Integration (Planned)

> **Status:** Stripe integration is not yet implemented in the backend. This section describes the intended architecture.

**Intended flow:**

1. User clicks **Upgrade to Premium** in the extension popup or on the landing page.
2. The extension (or web page) creates a Stripe Checkout session via the Worker's `/api/create-checkout` route.
3. User completes payment on Stripe's hosted checkout page.
4. Stripe sends a `checkout.session.completed` webhook to the Worker at `/api/webhook`.
5. The Worker verifies the Stripe signature (`STRIPE_WEBHOOK_SECRET`), reads the subscriber's email from the session metadata, and updates their record in `NEXUS_ALERTS_KV` to `tier: "premium"`.
6. The extension validates tier on startup by calling `/api/status` — premium users get 2-minute polling and SMS alerts.

For the full product specification including pricing and tier feature matrix, see [`spec.html`](spec.html) in this repo.

**Secrets needed when implemented:**

```bash
wrangler secret put STRIPE_SECRET_KEY       # starts with sk_live_ or sk_test_
wrangler secret put STRIPE_WEBHOOK_SECRET   # starts with whsec_
```

---

## Project Structure

```
nexus-alert/
├── manifest.json          # Chrome Extension manifest (MV3)
├── background.js          # Service worker — slot polling + alarm management
├── popup.html / popup.js  # Extension popup UI
├── offscreen.html/.js     # Offscreen document for audio notifications
├── icons/                 # Extension icons (16, 48, 128px + SVG)
├── backend/               # Cloudflare Worker
│   ├── src/worker.js      # Worker handler + cron logic
│   ├── wrangler.toml      # Wrangler config (KV bindings, cron triggers)
│   ├── vitest.config.js   # Test configuration (Miniflare-backed)
│   └── tests/
│       └── api.test.js    # Integration tests (16 tests, no live network)
├── web/                   # Next.js landing page
│   └── src/app/           # App Router pages
└── spec.html              # Full product specification
```

---

## License

MIT
