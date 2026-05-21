# Kautilyan Landing Page — Setup Guide

## What you have
- `index.html` — main story, pricing, trust, **Request a call** form → Google Sheets (via Apps Script)
- `assessment.html` — questionnaire explainer + link to your external form (`CONFIG.ASSESSMENT_URL`); keep the same URL as in `index.html` CONFIG
- This file — configure `CONFIG`, Sheet columns, and deploy

---

## 1) Google Sheet + Apps Script (call requests & future leads)

### 1a — Create the Sheet and header row

1. [sheets.google.com](https://sheets.google.com) → New spreadsheet → name it e.g. `Kautilyan Leads`.
2. In **row 1**, paste these headers (exact order matches the script):

```
Timestamp | Name | Email | Phone | Company | Role | Team Size | Revenue | Pain Points | Heard From | Source | Score | Message | Submission ID
```

Column **N — Submission ID** links step 1 (contact) and step 2 (five questions) to the **same row**.

### 1b — Apps Script (`doPost`)

1. Sheet → **Extensions → Apps Script**.
2. Copy the code from **`google-apps-script/LeadsCapture.gs`** in this repo (supports `action: create` and `action: update` by `submissionId`).
3. **Save** the project.

The booking flow uses **`submitToSheetsAsync`**, which reads the JSON response (so step 2 only opens after step 1 is confirmed). The browser sends `Content-Type: text/plain` to avoid a CORS preflight block on `script.google.com`.

After any script change: **Deploy → Manage deployments → Edit → New version → Deploy** (same `/exec` URL).

Test the endpoint: open `YOUR_WEB_APP_URL?ping=1` in a browser — you should see `{"status":"ok","ping":true}`.

### 1c — Deploy as Web App

1. **Deploy → New deployment** → type **Web app**.
2. **Execute as:** Me  
3. **Who has access:** Anyone  
4. **Deploy** → authorize → copy the **Web App URL** (ends with `/exec`).

### 1d — Paste URL into `index.html`

In the `CONFIG` block at the bottom of `index.html`:

```javascript
GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
```

### 1e — Verify submissions

The browser uses `fetch(..., { mode: 'no-cors' })`, so the page **cannot** read the HTTP response. After testing **Request a call**, confirm a new row appears in the Sheet.

**What gets written for “Request a call”**

| Column        | Value |
|---------------|--------|
| Timestamp     | Auto |
| Name / Email / Phone / Company / Role / Team Size / Revenue / Heard From | From the form |
| Pain Points   | Text from “What should we know?” (one cell; commas inside text stay as-is) |
| Source        | `call_request` |
| Score         | Empty |
| Message       | Preferred start time from the dropdown (e.g. `Call start 3:00 PM IST (45 min)`) or empty |

Other tools can POST the same JSON shape later (e.g. `source: 'questionnaire'` if you add a bridge); unused fields can be empty strings.

---

## 2) Questionnaire (external)

All `.assessment-external-link` buttons use:

```javascript
ASSESSMENT_URL: 'https://docs.google.com/forms/d/e/.../viewform',
```

If empty, those links fall back to `#assessment` (hero questionnaire row).  
Hook the form to Sheets using **Responses → Link to Sheets** in Google Forms (or Zapier), not this HTML file.

---

## 3) Booking: Cal.com first → prep questions only after schedule

### Flow

1. **Book Stage 0 Call** → form with **name, email, company** + **Pick your time** (no five questions yet).
2. Button saves contact to the sheet, then opens Cal.com in a **new tab** (this page stays open).
3. After booking, Cal.com redirects to **`https://www.kautilyan.com/assessment?scheduled=1`** (set in Cal.com **Booking redirects** → *Redirect to a custom URL*, with **Forward parameters** enabled). Cal also appends `uid`, `email`, `attendeeName`, etc.
4. That page **automatically** shows the five prep questions (no second CTA).
5. Use the **same host** for the whole flow (prefer `www.kautilyan.com` everywhere).

Deploy **`LeadsCapture.gs`** (`action: create` on contact, `action: update` on prep questions).

### Google Calendar (optional)

If you still use an **Appointment schedule**, set:

```javascript
GOOGLE_APPOINTMENT_URL: 'https://calendar.google.com/calendar/appointments/schedules/...',
```

When this URL is set, a line appears under the CTAs: **Pick a slot in Google Calendar** (opens in a new tab). When empty, that line is hidden.

### Cal.com (optional second button)

```javascript
CAL_LINK: 'https://cal.com/your-username/stage-0',
```

When set, **Book via Cal.com** is shown. When empty, that button is hidden.

### Email

`FOUNDERS_EMAIL` stays in `CONFIG` for your reference (e.g. if you add a `mailto:` link elsewhere). The landing page does not use it for the main schedule flow anymore.

---

## 4) Optional: pricing visibility

```javascript
SHOW_PRICING: false,
SHOW_NAV_PRICING: false,
```

---

## 5) Deploy + SEO

- Put `index.html` behind Vercel (or similar); add your domain.
- **Live site (canonical):** `https://www.kautilyan.com` — already set in page `<link rel="canonical">`, Open Graph URLs, `sitemap.xml`, `robots.txt`, `llms.txt`, and `CONFIG.SITE_URL` in `js/site.js` / `index.html`.
- **Redirects:** `vercel.json` sends apex `kautilyan.com` → `https://www.kautilyan.com` (301). All canonical and OG URLs use `www.kautilyan.com`.
- In Google Search Console, verify the **www** property (`https://www.kautilyan.com`).

### Vercel Analytics (optional)

After deploy, enable Analytics in Vercel, then uncomment in `index.html`:

```html
<script defer src="/_vercel/insights/script.js"></script>
```

---

## CONFIG reference (copy shape)

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

---

## Repo layout for Vercel (Git)

```
your-repo/
├── public/
│   └── index.html
└── vercel.json   → { "outputDirectory": "public" }
```

No build step. Static HTML only.
