# Blog content — Google Sheet setup

The site loads blog posts from a **Google Sheet** via Apps Script. Rich visuals (images, videos, charts, tables, callouts) use a **Blog Rich Blocks** catalog (A2UI-inspired, allowlisted components).

Until you connect the sheet, posts load from **`data/blog-posts.json`** with interactive blocks from **`data/blog-blocks-seed.json`**.

---

## Recommended authoring workflow

| Step | What you do |
|------|-------------|
| 1 | Write the article in **`body`** (markdown-style prose — same as today). |
| 2 | Add **`media_urls`** (optional) — one URL per line: Google Drive images, YouTube links. |
| 3 | Embed known media inline with **`:::image`** / **`:::video`** fences (see below) when you want exact placement. |
| 4 | Set **`status`** to **`published`**. |
| 5 | **Gemini runs automatically** (Apps Script) and fills **`blocks_json`** with charts, callouts, tables, etc. based on content. |
| 6 | Review **`blocks_json`** in the sheet; edit JSON or re-run **Kautilyan Blog → Enhance selected row**. |

**Best for your 6 existing posts:** Import `data/blog-posts-seed.csv`, publish all rows, run **Enhance all published rows** once. The site already ships fallback blocks in `data/blog-blocks-seed.json` until Gemini runs.

---

## Step 1 — Create the Google Sheet

1. Create a new Google Sheet (e.g. **Kautilyan Website Content**).
2. Rename the first tab to **`Blogs`** (exact name).
3. Import **`data/blog-posts-seed.csv`** (File → Import → Upload).

### Column headers (row 1)

| Column | Required | Description |
|--------|----------|-------------|
| `slug` | Yes | URL id → `article.html?slug=...` |
| `status` | Yes | `published` or `draft` |
| `title` | Yes | Headline |
| `meta_description` | Yes | SEO ~150 chars |
| `excerpt` | Yes | Card summary |
| `body` | Yes | Article prose (markdown-style) |
| `blocks_json` | No | **Auto-filled by Gemini** on publish (JSON). Leave empty initially. |
| `media_urls` | No | Drive / YouTube URLs (one per line) for Gemini + your reference |
| `published_date` | Yes | `YYYY-MM-DD` |
| `author` | No | Default `Team Kautilyan` |
| `seo_keywords` | No | Pipe-separated |
| `thought_starter_key` | No | Resources page link |
| `sort_order` | No | `1`, `2`, `3`… |

---

## Step 2 — Write `body` (prose)

Same rules as before:

- Blank line = paragraph  
- `---` = divider  
- `**Heading**` on its own line = subheading (also used as **anchor** targets for blocks)  
- `- item` = bullets  
- `1. item` = numbered list  

---

## Step 3 — Inline rich blocks (optional)

Place these **inside `body`** when you want exact control (no Gemini needed for these blocks):

### Image (Google Drive)

```
:::image
src: https://drive.google.com/file/d/YOUR_FILE_ID/view
alt: AI execution stack diagram
caption: Three layers: context, tools, governance
:::
```

### Video (YouTube or Drive)

```
:::video
src: https://www.youtube.com/watch?v=VIDEO_ID
caption: 2-minute walkthrough
:::
```

Drive videos use the same `src:` with a Drive file link (embedded as preview).

### Table

```
:::table
title: Vendor questions
headers: Question | Why it matters
rows: What outcome do you commit to? | Effort vs results
What happens if you miss? | Risk transfer
:::
```

### Chart (interactive — Chart.js on site)

```
:::chart
type: bar
title: Months to first proof
labels: Tool-first, SI-led, Scoped pilot
values: 9, 12, 1.5
label: Months
:::
```

### Callout

```
:::callout
variant: tip
title: Start here
body: Pick one broken workflow and define success in 45 days.
:::
```

### Comparison

```
:::comparison
left_title: Individual AI tools
left_body: People work faster; org doesn't change.
right_title: Org AI capability
right_body: Decisions, memory, and workflows compound.
:::
```

**Allowed types:** `image`, `video`, `figure`, `table`, `chart`, `callout`, `quote`, `comparison`

---

## Step 4 — `blocks_json` (Gemini output)

Leave **empty** when publishing; Apps Script fills it. Shape:

```json
{
  "version": 1,
  "blocks": [
    {
      "id": "mandate-chart",
      "type": "chart",
      "anchor": "The three paths",
      "chartType": "bar",
      "title": "Time to first proof",
      "labels": ["A", "B", "C"],
      "datasets": [{ "label": "Months", "values": [9, 12, 1.5] }]
    }
  ]
}
```

- **`anchor`**: exact phrase from `body` (usually a `**heading**` line). Block renders **after** that section.  
- To **re-generate**: clear `blocks_json`, set `published`, or use menu **Enhance selected row**.

---

## Step 5 — Google Drive & YouTube links

**Images (Drive):** Share file as **Anyone with the link → Viewer**. Paste the share URL in `src:` or `media_urls`.

**Videos:** Prefer YouTube watch URLs. Drive video files work as `/preview` embeds if shared publicly.

The site normalizes Drive URLs to `uc?export=view` for images. Broken media shows a friendly fallback (no page crash).

---

## Step 6 — Deploy Apps Script

1. **Extensions → Apps Script**
2. Paste **`google-apps-script/BlogFeed.gs`** and **`google-apps-script/BlogEnhance.gs`**
3. Set `SPREADSHEET_ID` in `BlogFeed.gs`
4. **Project Settings → Script properties** → add `GEMINI_API_KEY`
5. **Deploy → Web app** (Anyone) → copy `/exec` URL
6. In **`js/site.js`**: `BLOG_FEED_URL: 'https://script.google.com/macros/s/.../exec'`
7. Open the sheet → menu **Kautilyan Blog → Setup publish triggers**
8. **Enhance all published rows** (one-time for existing posts)

---

## Gemini behaviour (on publish)

When a row becomes **`published`** and `blocks_json` is empty:

1. Sends title + body + `media_urls` to Gemini  
2. Returns 1–3 blocks (charts, callouts, tables, comparisons) anchored to your headings  
3. Writes JSON into **`blocks_json`**  
4. Does **not** invent image URLs unless you listed them in `media_urls`

API key stays in **Apps Script only** — never in the website.

---

## Files reference

| File | Purpose |
|------|---------|
| `data/blog-posts.json` | Article fallback |
| `data/blog-blocks-seed.json` | Rich blocks fallback per slug |
| `data/blog-posts-seed.csv` | Sheet import |
| `google-apps-script/BlogFeed.gs` | Sheet → JSON API |
| `google-apps-script/BlogEnhance.gs` | Gemini on publish |
| `js/blog-media.js` | Drive / YouTube URL normalization |
| `js/blog-blocks.js` | Block catalog + Chart.js init |
| `js/blog-render.js` | Merge body + blocks_json |
| `js/blog-markdown.js` | Prose markdown |
| `article.html` | Loads Chart.js + block scripts |

---

## Local preview

```bash
python3 -m http.server 8765
```

Open `http://localhost:8765/article.html?slug=ai-execution-stack` — charts and blocks should render.
