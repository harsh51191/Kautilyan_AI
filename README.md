# Kautilyan

> **The AI that knows your organisation. Not just the internet.**

Kautilyan is an intelligence and execution layer for mid-sized Indian B2B companies. It sits on your existing systems - SAP, CRM, ERP, email - and deploys governed AI agents that capture every decision, detect what's breaking, and execute with your team's approval at every step.

**Agent proposes. Human approves. Organisation learns.**

---

## What Kautilyan does

Most AI tools give you a better search engine. Kautilyan gives you organisational memory and execution.

| Without Kautilyan | With Kautilyan |
|---|---|
| Decisions buried in WhatsApp, email, memory | Signals detected from connected systems automatically |
| Context lives in people's heads | Evidence pack auto-assembled from history and data |
| Escalation with no options presented | 2–3 options drafted with rationale and precedent |
| Verbal approvals - no record kept | One-click approval with reason captured and stored |
| Manual follow-up and system entry | Tasks routed to right owner, tracked automatically |
| Knowledge walks out when people leave | Decision trace becomes reusable org memory |

### Who it's for

Mid-sized Indian B2B companies - manufacturing, distribution, services - with 200–800 employees running SAP, Oracle, or any combination of CRM and Excel. You have an AI mandate. You have existing systems. You don't have a clear implementation path.

### The problems it solves

- **The Decision Bottleneck** - every non-routine call escalates to the same 3 people. Not a people problem - a systems problem.
- **The Coordination Tax** - 30–40% of your team's time goes to chasing status and validating data. It never appears on any P&L.
- **The Intelligence Gap** - you have SAP, you have CRM, but why decisions were made lives in people's heads and walks out when they do.
- **The Invisible Leakage** - stale forecasts, cooling relationships, decisions nobody can reconstruct. All of it on your bottom line.

### How it works

Three stages, no risk until you've seen the evidence:

| Stage | Description | Cost |
|-------|-------------|------|
| **Stage 0 - Operating Reality Diagnosis** | 45 minutes. Written report on how your business actually runs, your operating taxes, and the recommended first intelligence layer. | Free |
| **Stage 1 - Proof of Value Report** | 72 hours deep in your operating stack (SAP, CRM, ERP, email). You see the problem in your own data before committing to a pilot. | ₹25,000 (credited against Stage 2) |
| **Stage 2 - 45-Day Pilot** | Named success metric agreed in writing. Full refund if we miss Day 45 - no conditions. You bring your own API keys; your data never leaves your perimeter. | ₹75,000 → ₹20–30L/yr |

---

## This repository

This is the marketing and lead-capture website for Kautilyan, hosted at [www.kautilyan.com](https://www.kautilyan.com). It is static HTML/CSS/JavaScript with no build step.

### Files

| File | Purpose |
|------|---------|
| `index.html` | Main landing page - hero, problem, before/after toggle, how it works, pricing, trust, booking form, FAQ |
| `stage0-intake.html` | Stage 0 pre-call intake after Cal booking; five prep questions via `booking.js` |
| `assessment.html` | AI Operating Intelligence Diagnostic (12 questions + report; `js/assessment.js`, `/api/*`) |
| `SETUP.md` | Step-by-step guide: Google Sheets, Apps Script, booking links, deploy |
| `kautilyan_master_note_v11.md` | Internal copy reference (not served to visitors) |

---

## Quick start

1. Clone or download this repo.
2. Open `index.html` in a browser (double-click or use a local server).
3. Edit the `CONFIG` object at the bottom of `index.html` for forms, booking, and optional links.
4. For production, follow [SETUP.md](./SETUP.md) to wire Google Sheets and deploy.

### Local preview

```bash
# Python 3 (includes /blog/:slug → article.html rewrite, same as Vercel)
python3 serve.py

# Plain static server - use article.html?slug= links from blog list only
python3 -m http.server 8080

# or Node.js
npx serve .
```

Then open `http://localhost:8080/index.html`.

---

## Configuration

All runtime settings live in the `CONFIG` block at the bottom of `index.html`:

```javascript
const CONFIG = {
  SITE_URL: 'https://www.kautilyan.com',
  SHOW_PRICING: true,
  SHOW_NAV_PRICING: true,
  CAL_LINK: '',
  ASSESSMENT_URL: '',
  GOOGLE_SCRIPT_URL: '',
  GOOGLE_APPOINTMENT_URL: '',
  FOUNDERS_EMAIL: 'founders@kautilyan.com',
};
```

| Key | Description |
|-----|-------------|
| `SITE_URL` | Canonical public URL (`https://www.kautilyan.com`) - used for SEO and blog links |
| `GOOGLE_SCRIPT_URL` | Apps Script web app URL - required for **Request a call** rows in Google Sheets |
| `ASSESSMENT_URL` | External questionnaire (Google Form, Typeform, etc.) |
| `CAL_LINK` | Optional Cal.com booking button |
| `GOOGLE_APPOINTMENT_URL` | Optional Google Calendar appointment link |
| `SHOW_PRICING` / `SHOW_NAV_PRICING` | Toggle pricing section and nav link visibility |

Full setup (Sheet columns, Apps Script `doPost`, Vercel deploy): **[SETUP.md](./SETUP.md)**.

---

## Deploy

Static hosting only - no npm install or build step required.

**Vercel (recommended)**

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set the project root to this folder (or use `public/` + `vercel.json` as described in SETUP.md).
4. Point your domain (`www.kautilyan.com` and apex `kautilyan.com`) in Vercel DNS settings.
5. Optionally uncomment the Vercel Analytics script in `index.html` after deploy.

**Canonical site:** `https://www.kautilyan.com`. All pages use this in canonical/OG tags; `vercel.json` 301-redirects apex `kautilyan.com` to `www.kautilyan.com`.

---

## Tech stack

- HTML5, CSS (custom properties, responsive grid, no framework)
- Vanilla JavaScript - `CONFIG`, form submission, before/after toggle, scroll animations
- Google Fonts: Bricolage Grotesque, Inter, JetBrains Mono
- Google Apps Script + Google Sheets for lead capture

---

## Security notes

- Do not commit real API keys or private credentials to public repos.
- `GOOGLE_SCRIPT_URL` is a public web app endpoint - restrict what the Apps Script can do and who can redeploy it.
- Review `CONFIG` before pushing if you're using a public fork.

---

## Contact

**founders@kautilyan.com** · [www.kautilyan.com](https://www.kautilyan.com) · Made in Bangalore.

---

## License

Proprietary - © 2026 Kautilyan AI. All rights reserved.
