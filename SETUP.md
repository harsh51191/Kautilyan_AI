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
Timestamp | Name | Email | Phone | Company | Role | Team Size | Revenue | Pain Points | Heard From | Source | Score | Message
```

### 1b — Apps Script (`doPost`)

1. Sheet → **Extensions → Apps Script**.
2. Replace the default code with:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    data.name || '',
    data.email || '',
    data.phone || '',
    data.company || '',
    data.role || '',
    data.teamSize || '',
    data.revenue || '',
    (data.painPoints || []).join(', '),
    data.heardFrom || '',
    data.source || '',
    data.score || '',
    data.message || '',
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. **Save** the project.

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

## 3) Booking: form first, then optional Google / Cal.com

### Primary path — “Schedule a call”

The main Stage 0 CTA scrolls to **Request a call** (`#request-call`). Founders pick a **preferred 45-minute window (IST, 9:00–17:00)** from a dropdown; the choice is stored in the Sheet **Message** column (same JSON field: `message`).

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
- **Redirects:** `vercel.json` sends `kautilyan.com`, `kautilyan.ai`, and `www.kautilyan.ai` → `https://www.kautilyan.com` (301). Keep those rules if you own alternate domains so traffic consolidates on www.
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
