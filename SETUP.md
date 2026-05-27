# Kautilyan Landing Page — Setup Guide

## What you have
- `index.html` — main story, pricing, trust, **Request a call** form → Google Sheets (via Apps Script)
- `stage0-intake.html` — Stage 0 pre-call intake after booking (`CONFIG.INTAKE_PATH`); keep in sync with `index.html` CONFIG
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

## 2) AI Operating Intelligence Diagnostic (`assessment.html`)

The **12-question diagnostic** lives at `/assessment.html` (client: `js/assessment.js`, styles: `css/assessment.css`). It is separate from **Stage 0 intake** (`stage0-intake.html`).

### Supabase

1. Create a Supabase project.
2. Run the migration in `supabase/migrations/20260526120000_assessment_tables.sql` (SQL editor or CLI).
3. Copy project URL and keys into Vercel env vars (see below).

### Vercel serverless + env

API routes: `POST /api/submit-assessment`, `GET /api/get-report?id=…`

Set in Vercel (and optionally `.env` for `vercel dev`):

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server writes (never expose in browser) |
| `SUPABASE_ANON_KEY` | Listed in `vercel.json` if needed later |
| `GEMINI_API_KEY` | Narrative report generation |
| `GAS_EMAIL_WEBHOOK_URL` | Same Apps Script `/exec` URL as leads (`LeadsCapture.gs`) |
| `SITE_URL` | `https://www.kautilyan.com` (CORS + report links) |

Copy `.env.example` → `.env` locally; do not commit `.env`.

### Gemini vs template report

- Set a real `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/apikey) (not `[your-google-ai-studio-key]`).
- After submit, the report page shows a badge: **personalised with Google Gemini** or **standard template**.
- In Supabase `assessment_reports.full_report_json`, check `_meta.generated_by`: `gemini` or `fallback`.
- Server logs: `[generateAndStoreReport] Gemini failed, using fallback:` when the key is missing or invalid.
- Restart `python3 serve.py` after updating `.env`, then submit a **new** assessment (old reports keep their original narrative).

### Report email (Apps Script)

`LeadsCapture.gs` handles `POST` payloads with `type: 'assessment_email'` and sends via `GmailApp.sendEmail`.

After each submission, check delivery in Supabase `assessment_responses`:

| Column | Meaning |
|--------|---------|
| `report_emailed` | `true` if Gmail send succeeded |
| `report_email_error` | Full failure reason when `report_emailed` is `false` (NULL on success) |
| `report_emailed_at` | Timestamp of the last send attempt |

Run migration `supabase/migrations/20260527180500_assessment_report_email_audit.sql` in the Supabase SQL editor if those columns are missing.

1. Paste the latest `google-apps-script/LeadsCapture.gs` into your Apps Script project.
2. **Deploy → Manage deployments → Edit → New version → Deploy** (same `/exec` URL).
3. On first run, authorize **Gmail** when prompted (required for report emails).
4. Set `GAS_EMAIL_WEBHOOK_URL` in `.env` / Vercel to that `/exec` URL (can match `GOOGLE_SCRIPT_URL`).
5. Restart `python3 serve.py` after changing `.env`.
6. After a test submit, check the terminal for `[submit-assessment] Report email sent to …` or a GAS error line.

If email still fails: open the Apps Script **Executions** log for the deployment and confirm `sendAssessmentReportEmail` ran without permission errors.

### Local API testing

`python3 serve.py` serves static files **and** forwards `/api/submit-assessment` and `/api/get-report` to Node (`scripts/invoke-api.js`). Requirements:

1. `npm install` in the project root (once)
2. Node.js installed
3. `.env` with real `SUPABASE_SERVICE_ROLE_KEY` (and other keys)
4. Restart `serve.py` after changing `.env`

Alternative: `npx vercel dev` (matches production Vercel routing exactly).

### Legacy external form

`CONFIG.ASSESSMENT_URL` in `index.html` is optional. If set, old `.assessment-external-link` buttons can still point at an external Google Form; site CTAs now use `/assessment.html`.

---

## 3) Booking: Cal.com first → prep questions only after schedule

### Flow

1. **Book Stage 0 Call** → form with **name, email, company** + **Pick your time**.
2. **Pick your time** opens Cal.com in a **new tab** immediately, then saves a sheet row (timestamp + submission ID).
3. When the sheet save succeeds, the **five prep questions** appear on the Kautilyan page (modal or `/stage0-intake`) — no second click.
4. Optional: Cal.com **Booking redirects** to `https://www.kautilyan.com/stage0-intake?scheduled=1` if you want the scheduler tab to land on the same questions page after booking.

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
