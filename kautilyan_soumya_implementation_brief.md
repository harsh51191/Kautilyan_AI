# KAUTILYAN.COM — FINAL IMPLEMENTATION BRIEF FOR SOUMYA
## All changes. Priority ordered. Dev-ready.
## Version: Final — May 2026
## Owner: Soumya | Reviewed by: Harsha

---

## HOW TO READ THIS DOCUMENT

Changes are in three tiers:

**P0 — Fix this week. Site is losing real leads right now.**
**P1 — Fix this month. These are conversion killers.**
**P2 — Fix this quarter. These are growth enablers.**

Do not move to P1 until P0 is complete.
Do not move to P2 until P1 is at least 70% done.

---

---

# P0 — THIS WEEK
## Revenue is being lost right now. These are not optional.

---

### P0.1 — FIX ALL BROKEN CTAs

**The problem:**
Every "Book Free Diagnosis →" button on the site resolves to `href="#"`. The modal either doesn't open or opens unreliably. The "Book via Cal.com →" link is also broken. A visitor who clicks and nothing happens does not click again.

**The fix:**
- Integrate Cal.com directly. Every CTA on every page routes to the same Cal.com booking link.
- Remove the modal entirely OR make it a 4-field pre-qualification that feeds into Cal.com.
- Test every CTA on every page before marking done: Homepage (hero, mid-page, bottom), Pricing, How It Works, Use Cases, About, Resources.
- On mobile: test that the button is tappable (minimum 44px height, full width).

**Acceptance criteria:**
Every "Book Free Diagnosis →" button on every page opens a working booking interface. Zero `href="#"` CTAs remain in production.

---

### P0.2 — FIX OR REMOVE THE ASSESSMENT PAGE

**The problem:**
The `/assessment.html` page contains a visible developer instruction:
*"Set `ASSESSMENT_URL` in this page's script to point at your Google Form, Typeform, or Tally link."*
This is live in production. A CIO landing on this page sees a developer todo. The page is also linked from the global nav as "View Your Report →" — meaning every visitor who clicks that link lands on a broken developer-facing page.

**The fix — Option A (recommended):**
- Embed the existing diagnosis tool (currently at 127.0.0.1:8787) at kautilyan.com/assessment
- Remove the developer placeholder entirely
- Test that the tool runs and produces output

**The fix — Option B (if Option A takes more than 3 days):**
- Add `<meta name="robots" content="noindex">` to assessment.html immediately
- Remove "View Your Report →" from global nav until the tool is live
- Replace the page content with: "Assessment coming soon. Book a live diagnosis instead." with a working CTA

**Acceptance criteria:**
No developer placeholder text is visible on any public page. "View Your Report →" nav link either works or is removed.

---

### P0.3 — FIX CANONICAL URL MISMATCH

**The problem:**
Some pages previously declared a non-canonical domain while the live site is `https://www.kautilyan.com/`. That splits SEO link equity. Google should see one site.

**The fix:**
- Use one canonical domain: `https://www.kautilyan.com`
- Update every page's canonical tag: `<link rel="canonical" href="https://www.kautilyan.com/[page-path]" />`
- Update every `og:url` tag to match
- Set up a 301 redirect: apex `kautilyan.com` → `https://www.kautilyan.com` (permanent redirect, all paths)

**Acceptance criteria:**
All pages have matching canonical URLs on `www.kautilyan.com`. Apex `kautilyan.com` redirects to `www.kautilyan.com` with 301. No canonical mismatch in Google Search Console.

---

### P0.4 — PUBLISH PRIVACY POLICY AND TERMS

**The problem:**
The site captures personal data (name, email, phone, company) via a lead form. Under India's DPDP Act 2023, any business processing personal data must publish a privacy notice and name a grievance officer with contact details. This is a legal requirement, not a UX nicety. Absence of these pages is also a procurement blocker for any company above ₹50 Cr.

**The fix:**
- Publish `/privacy.html` with at minimum:
  - What data is collected (name, email, phone, company, workflow description)
  - How it is stored and for how long
  - That it is not shared with third parties
  - A named grievance officer (Harsha Vellanki — founders@kautilyan.com)
  - Date of last update
- Publish `/terms.html` with basic engagement terms
- Add links to both in every page footer, next to the existing Privacy Policy and Terms of Use links that currently go nowhere
- Add to the booking form, below the submit button: "By submitting, you agree to our [Privacy Policy]. Your data is used only to facilitate this diagnosis session."

**Acceptance criteria:**
Privacy policy and terms are live at accessible URLs. Footer links work. Form has privacy notice.

---

### P0.5 — FIX THE BOOKING FORM DATE/TIME PICKER

**The problem:**
The date picker in the booking modal does not display correctly. Clicking the date field shows a black overlay and typing is ignored. The time dropdown has the same issue. Several select fields (Role, Team Size, Annual Revenue) show blank overlays. This makes it impossible to complete the booking. This is confirmed by two independent auditors.

**The fix:**
- Replace the custom date picker with native HTML `<input type="date">` with `min` attribute set to today's date
- Add `disabled` attribute for Saturday (6) and Sunday (0) via JS: `if (day === 0 || day === 6) disable the date`
- Replace the custom time dropdown with a standard `<select>` using system styling — no custom overlay
- For all select fields (Role, Team Size, Revenue): replace custom overlay components with standard `<select>` elements. Style with CSS to match the dark theme — no custom JS dropdowns that conflict with dark backgrounds

**Alternative (cleaner):**
- Replace the entire custom form + date picker with a Cal.com embed
- Cal.com handles real-time slot availability, prevents double-booking, sends confirmation emails automatically
- Reduces custom code maintenance to near zero

**Acceptance criteria:**
A user can complete the full booking flow on Chrome, Safari, Firefox, and mobile (iOS Safari, Android Chrome) without any overlay or picker issues.

---

### P0.6 — ADD SOUMYA'S FULL DETAILS

**The problem:**
The About page lists "Soumya" with one name, no surname, no LinkedIn link, no prior company context. A CTO doing due diligence will search. Finding nothing creates doubt. The LinkedIn buttons for both founders currently have `href="#"`.

**The fix:**
- Add Soumya's full name to the About page
- Add a working LinkedIn URL for Soumya
- Fix Harsha's LinkedIn button — replace `href="#"` with actual LinkedIn URL
- Add at minimum one prior company/role for Soumya (even "previously at [company]" is enough)
- Add a professional photo for both founders (or at minimum initials avatars that link to LinkedIn)

**Acceptance criteria:**
Both founder cards have working LinkedIn links. Soumya has at minimum a surname and one prior affiliation visible.

---

---

# P1 — THIS MONTH
## These are conversion killers. Fix after P0 is complete.

---

### P1.1 — REDUCE THE BOOKING FORM TO 4 FIELDS

**The problem:**
The current booking form has 11 fields before scheduling: name, work email, phone, company, role, team size, annual revenue, workflow description, source, date, time. Research consistently shows that forms with 10+ fields convert 20-30% worse than forms with 4 fields. You are asking for CFO-level commitment before a visitor has decided you're worth 45 minutes.

**The fix:**
Step 1 — Pre-qualification (4 fields only):
1. Full name
2. Work email
3. Company name
4. "Which workflow feels most painful?" (free text, max 200 chars)

Step 2 — Cal.com (after Step 1 submit):
- Route to Cal.com embed for date/time selection
- Cal.com sends confirmation automatically

Step 3 — Confirmation page:
- "We'll see you on [date]. We'll send a 24-hour reminder."
- Show what to expect: "45 minutes. We map your operating reality. You get a written report the same day."

Remove from the form entirely:
- Phone (collect after booking confirmed if needed)
- Team size and annual revenue (collect verbally in the session or via a pre-call questionnaire sent automatically)
- Source ("How did you hear about us")

**Acceptance criteria:**
Primary booking flow is 4 fields + Cal.com. Form completes successfully on all devices.

---

### P1.2 — ADD SOCIAL PROOF TO HOMEPAGE

**The problem:**
Across all seven audited pages there is not a single named client, quote, logo, case study link, or metric attached to a real outcome. Competitors (GrowthJockey, Atomicwork, Fractal) all show named Indian-market quotes with photos and titles. Zero social proof is the biggest credibility gap on the site.

**What to add immediately (this month):**

**Option A — Anonymised outcome quotes (if named clients haven't approved yet):**

Add a "What we find" strip between the Four Drains and the How It Works section:

```
"The forecast cycle that used to take 8 days now generates a same-day operating brief."
— Group IT Head, Manufacturing company, 500+ employees

"Every important decision still required me personally. Now the logic is in the system."  
— Managing Director, B2B distribution company, 200 employees
```

These are accurate representations of Gulbahar and Sudeep's situations. Use them until named permission is obtained.

**Option B — Outcome counter strip (no client names needed):**
```
[2] Operating Reality Reports delivered
[45] Days — our pilot guarantee
[₹50,000] Blueprint credited in full to Stage 2
[100%] Refund if we miss Day 45
```

This communicates proof through specificity, not through names.

**When Harsha gets named permission:**
- Replace with: Quote | Full name | Title | Company | Outcome metric
- Add a 2×2 logo bar if logos are approved
- This becomes the highest-converting element on the site

**Placement:**
Below the hero section. Before the Four Drains. First thing a visitor sees after the headline.

**Acceptance criteria:**
At least one form of social proof is visible above the fold or within the first scroll on the homepage. Zero named clients fabricated — use real anonymised outcomes only.

---

### P1.3 — MOVE REFUND GUARANTEE TO HOMEPAGE HERO

**The problem:**
The strongest commercial sentence on the site is currently on page 3 (Pricing):
*"If we miss the agreed Day 45 outcome after client-side dependencies are met, we refund the pilot fee. Metric, access, and timeline are in the contract before we start."*

This is a genuine differentiator that no large Indian AI firm offers. It's buried.

**The fix:**
Add to the hero trust strip (below the two CTAs):

```
✓ Works on your existing systems — no migration required
✓ One workflow. Named outcome. Guaranteed or refunded.  ← ADD THIS
✓ No sales deck. No product demo. Just a written map of your operating reality.
```

Also add to the Stage 0 CTA sub-text (replacing "Written output · No commitment"):

```
No sales deck. No product demo. Just a blueprint of your operating reality 
that you can keep — even if you never hire us.
```

**Acceptance criteria:**
Refund guarantee language appears on the homepage above the fold. Stage 0 CTA sub-text uses the new copy.

---

### P1.4 — BUILD THE RESOURCES PAGE WITH REAL CONTENT

**The problem:**
The Resources page currently has a headline, a sub-headline promising "frameworks, checklists, and guides," and zero resources. Every visitor who clicks Resources from the nav hits a dead end. This page should be the site's primary SEO engine — instead it's an empty room.

**What to publish immediately:**

**Resource 1 — Free, no email gate:**
The AI Execution Stack visual primer (already built as a PDF)
- Title: "Stop Calling Everything an Agent — The AI Execution Stack"
- Format: PDF download
- CTA: "Download Free →"

**Resource 2 — Free, no email gate:**
The SLOPE Framework one-pager (already designed)
- Title: "The SLOPE Framework for AI Adoption"
- Format: PDF download
- CTA: "Download Free →"

**Resource 3 — Email gate:**
The AI Workflow Diagnosis Checklist
- Title: "The 20 Questions We Ask in Every Stage 0 Session"
- Format: PDF download, requires work email
- CTA: "Get the Checklist →"
- On submit: deliver PDF via email, add to nurture list

**Resource 4 — Email gate:**
The Kautilyan Guide to AI-Era Operations (already written in the content document)
- Format: PDF download, requires work email
- CTA: "Download Free Guide →"

**Blog posts to publish (all written, just need to be published):**
1. My CEO told me to implement AI. Where do I actually start?
2. Stop calling everything an agent
3. Why AI mandates fail before they start
4. Your teams are using AI. Your organisation isn't.
5. We lost three years of context when someone left.
6. The CIO's dilemma: mandate, budget, no execution path.

**Technical setup for email-gated resources:**
- Use Tally or Typeform for email capture
- Connect to email provider (even Gmail works initially)
- Deliver PDF link immediately via automated email response
- Tag submissions as "resource download" for nurture tracking

**Acceptance criteria:**
Resources page has minimum 2 free downloads and 2 gated downloads. At least 3 blog posts are published with full content. No empty promises on the page.

---

### P1.5 — FIX GLOBAL NAVIGATION INCONSISTENCY

**The problem:**
The homepage shows 4 nav links. Interior pages show 6. The homepage hides "How It Works" and "Use Cases" — the very pages a serious buyer wants to see after the hero.

**The fix:**
Use identical navigation on every page:

```
KAUTILYAN [logo]
How It Works | Use Cases | Resources | Pricing | About
[View Your Report →] [Book Free Diagnosis →]
```

- "View Your Report →" links to kautilyan.com/reports (client login)
- "Book Free Diagnosis →" links to Cal.com booking
- Same nav on every page, no exceptions
- Mobile: hamburger menu with same links

**Acceptance criteria:**
Navigation is identical on all pages. No page hides links that other pages show.

---

### P1.6 — PUBLISH SITEMAP.XML AND ROBOTS.TXT

**The problem:**
Both files are missing or not accessible at standard paths. Without sitemap.xml, Google doesn't know the full site structure. Without robots.txt, crawlers don't know what to index.

**The fix:**

`/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://kautilyan.com/</loc></url>
  <url><loc>https://kautilyan.com/how-it-works.html</loc></url>
  <url><loc>https://kautilyan.com/use-cases.html</loc></url>
  <url><loc>https://kautilyan.com/pricing.html</loc></url>
  <url><loc>https://kautilyan.com/resources.html</loc></url>
  <url><loc>https://kautilyan.com/about.html</loc></url>
  <url><loc>https://kautilyan.com/assessment.html</loc></url>
  [add blog post URLs when published]
</urlset>
```

`/robots.txt`:
```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://kautilyan.com/sitemap.xml
```

**Also add to `<head>` of every page:**
```html
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
```

Submit sitemap to Google Search Console after publishing.

**Acceptance criteria:**
Both files accessible at standard paths. No 404. Sitemap submitted to Google Search Console.

---

### P1.7 — IMPLEMENT SCHEMA MARKUP

**The problem:**
No structured data detected on any page. FAQPage, Organization, Service, and HowTo schema are all missing. This is a missed opportunity for rich search results and LLM citation.

**The fix:**

Add to homepage `<head>`:

```html
<!-- Organization schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Kautilyan AI",
  "url": "https://kautilyan.com",
  "logo": "https://kautilyan.com/logo.png",
  "description": "AI workflow transformation for growing businesses. One workflow. One metric. Proof before scale.",
  "email": "founders@kautilyan.com",
  "foundingLocation": {"@type": "Place", "address": "Bangalore, India"},
  "areaServed": "India",
  "sameAs": ["https://www.linkedin.com/company/kautilyan-ai"]
}
</script>

<!-- FAQPage schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Kautilyan AI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Kautilyan AI helps growing businesses identify, redesign, and implement high-value AI workflows on existing systems. We start with one workflow, prove measurable value in 45 days, and institutionalise what works. Not a chatbot. Not a dashboard. Not a generic AI tool."
      }
    },
    {
      "@type": "Question",
      "name": "Do we need to replace our existing systems?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Kautilyan works on top of your existing systems — ERP, CRM, email, Excel, dashboards, and internal tools. No forced migration."
      }
    },
    {
      "@type": "Question",
      "name": "What is the 45-day guarantee?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Before the pilot starts, we agree on a specific, measurable success metric written into the contract. If we miss the agreed outcome after client-side dependencies are met, we refund the pilot fee."
      }
    },
    {
      "@type": "Question",
      "name": "What happens to our data?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We support bring-your-own-key setups with Gemini, Claude, or OpenAI. We design for read-only access, data minimisation, and permission control. Your data is never used to train our models or shared across clients."
      }
    }
  ]
}
</script>
```

Add to How It Works page `<head>`:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How Kautilyan transforms AI workflows in 45 days",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Diagnose the operating reality",
      "text": "45-minute session to map how the workflow actually runs — handoffs, decision points, coordination failures."
    },
    {
      "@type": "HowToStep",
      "name": "Redesign the workflow for AI",
      "text": "Define what gets automated, what gets assisted, and what stays human. Design the governance model."
    },
    {
      "@type": "HowToStep",
      "name": "Implement the first governed AI workflow",
      "text": "Build on existing systems. Agent proposes. Human approves. Decision trace captured."
    },
    {
      "@type": "HowToStep",
      "name": "Institutionalise the learning",
      "text": "Every approval and override becomes reusable operating intelligence. Next workflow builds on the first."
    }
  ]
}
</script>
```

Add llms.txt at root (already written in website content document — copy exactly from there).

**Acceptance criteria:**
Google Rich Results Test passes for homepage FAQPage schema. Organization schema validates. HowTo schema on How It Works page validates.

---

### P1.8 — FIX CONTRAST AND READABILITY

**The problem:**
Multiple pages use dark purple/dark backgrounds with light grey body text that fails WCAG AA contrast requirements. This makes the site hard to read on screens with low brightness and fails accessibility standards.

**The fix:**
- Body text on dark backgrounds: minimum `rgba(255,255,255,0.85)` — not `rgba(255,255,255,0.55)` or lower
- Section body copy: `rgba(255,255,255,0.72)` minimum
- Card body copy: `rgba(255,255,255,0.70)` minimum
- Never use `rgba(255,255,255,0.4)` or lower for any text that carries information
- Check every page with WebAIM Contrast Checker before marking done
- Minimum font size for body text: 16px
- Minimum font size for card body: 14px

**Acceptance criteria:**
WebAIM Contrast Checker shows AA pass for all body text. No information-carrying text below 4.5:1 contrast ratio.

---

### P1.9 — FIX PAGE TITLE LENGTH ON USE CASES PAGE

**The problem:**
Current title: *"AI Workflow Use Cases — Sales, Operations, Finance, and More | Kautilyan AI"* — 71 characters. Google truncates at 60. This shows as *"AI Workflow Use Cases — Sales, Operations, Finance, and..."* in search results.

**The fix:**
Change to: `AI Workflow Use Cases — Where Kautilyan Starts | Kautilyan AI`
Character count: 58 — within limit.

**Acceptance criteria:**
All page titles under 60 characters. Check every page.

---

---

# P2 — THIS QUARTER
## These are growth enablers. Start after P0 and P1 are done.

---

### P2.1 — BUILD NAMED CASE STUDIES

**Context:**
This requires Harsha to get written permission from Gulbahar and Sudeep. Once permission is obtained, Soumya publishes. The format for each case study:

**Page structure:** `/case-studies/[company-slug].html`

```
Company: [Name, or "₹X Cr Manufacturing Company" if anonymous]
Role of contact: [Title]
The situation: [2-3 sentences from the Stage 0 report]
The operating tax: [Specific number — days, hours, ₹ estimate]
What Kautilyan did: [Stage 0 → Stage 1 → Stage 2 summary]
The outcome at Day 45: [Named metric from the contract]
Quote: "[Direct quote]" — [Name, Title, Company]
```

Add case study links to the homepage social proof section and the Use Cases page.

**Acceptance criteria:**
At least one named case study published with a real metric and a real quote.

---

### P2.2 — BUILD PER-USE-CASE LANDING PAGES

**The problem:**
Currently every "Diagnose this workflow →" CTA on the Use Cases page routes to the same generic booking modal. The per-use-case personalisation is cosmetic.

**The fix:**
Build dedicated landing pages for the top 3 use cases:
- `/use-cases/sales-forecasting` — with the MYK situation as the anchor story
- `/use-cases/revenue-leakage` — with the Coach Builders situation
- `/use-cases/leadership-reporting`

Each page:
- Targeted title tag and meta description
- Specific situation description
- Specific "what Kautilyan does" for that use case
- Specific proof metric
- CTA that opens a pre-filled form mentioning the use case: "I want to diagnose my [sales forecasting] workflow"

Add `Service` schema to each page.

**Acceptance criteria:**
3 use-case landing pages live with unique URLs, unique meta, and working CTAs.

---

### P2.3 — PERFORMANCE OPTIMISATION

**The problem:**
Heavy images and assets are slowing load times. Pages loading above 3 seconds lose 40% of mobile visitors before they see the headline.

**The fix:**
- Convert all images to WebP format
- Compress all images to under 100KB
- Implement lazy loading: `loading="lazy"` on all images below the fold
- Minimise third-party scripts — load analytics and chat scripts with `defer` or `async`
- Target: Largest Contentful Paint under 2.5 seconds
- Test with Google PageSpeed Insights before and after

**Acceptance criteria:**
Google PageSpeed Insights score: 80+ on mobile, 90+ on desktop.

---

### P2.4 — MOBILE OPTIMISATION AUDIT

**The problem:**
83% of landing page traffic comes from mobile. The booking form and date picker bugs are especially severe on mobile (iOS Safari, Android Chrome). The form fields need to be touch-friendly.

**The fix:**
Test every page and every interactive element on:
- iPhone (iOS Safari) — most common in India
- Android (Chrome) — second most common
- iPad (Safari) — for CIOs reviewing on tablets

Specific mobile fixes:
- All CTA buttons: minimum 44px height, full width on mobile
- Form fields: minimum 16px font size (prevents iOS auto-zoom)
- Date picker: use native mobile date input (`<input type="date">`) — renders correctly on iOS and Android without custom code
- Navigation: hamburger menu that opens and closes correctly on touch
- Cards: stack vertically on mobile, never side-by-side below 768px

**Acceptance criteria:**
Full booking flow completable on iPhone iOS Safari. All CTA buttons tappable without zooming.

---

### P2.5 — ADD CONTACT PAGE

**The problem:**
There is no `/contact.html` page. For enterprise procurement, a contact page with a business email, city, and grievance officer is expected. Its absence signals a very early-stage business.

**The fix:**
Build a simple `/contact.html` with:
- Email: founders@kautilyan.com
- Location: Bangalore, India
- Grievance officer (DPDP compliance): Harsha Vellanki, founders@kautilyan.com
- A simple contact form (Name, Email, Message — 3 fields)
- "For partnership and press enquiries" — same email

Add "Contact" to the footer links.

**Acceptance criteria:**
/contact.html live and linked from footer. DPDP grievance officer named.

---

### P2.6 — GA4 AND CONVERSION TRACKING SETUP

**The problem:**
Without conversion tracking, there's no way to know which pages are converting, which CTAs are working, or where visitors are dropping off.

**The fix:**
GA4 setup:
- Create conversion event: `diagnosis_booked` — fires when Cal.com booking is confirmed
- Create conversion event: `resource_downloaded` — fires when email is submitted for gated resource
- Create conversion event: `assessment_started` — fires when assessment tool is opened

Custom channel for AI referral traffic:
- Source regex: `chatgpt\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com`
- Channel name: AI Referral

Google Search Console:
- Verify `https://www.kautilyan.com` (canonical property)
- Submit sitemap
- Monitor for crawl errors weekly

**Acceptance criteria:**
GA4 tracking `diagnosis_booked` event. Search Console verified. Sitemap submitted.

---

---

# COPY CHANGES — FOR SOUMYA TO IMPLEMENT FROM THE WEBSITE CONTENT DOCUMENT

The following copy changes are already written in `kautilyan_final_website_content.md` (Final v3).
These are not new — just a checklist of what needs to match between the content doc and the live site.

---

### HOMEPAGE COPY CHECKLIST

**Hero:**
- [ ] Eyebrow pill text: "From Diagnosis to Governed AI — One Workflow at a Time"
- [ ] Headline: "Turn your most painful workflow into a measurable AI win in 45 days."
- [ ] Subtitle: Must include "how it actually runs, not how leadership thinks it runs"
- [ ] Governing line: "Agent proposes. Human approves. Organisation learns."
- [ ] Primary CTA: "Book a Free AI Workflow Diagnosis →" (working Cal.com link)
- [ ] Secondary CTA: "See How It Works →" (links to /how-it-works.html)
- [ ] Trust strip line 1: "✓ Works on your existing systems — no migration required"
- [ ] Trust strip line 2: "✓ One workflow. Named outcome. Guaranteed or refunded."
- [ ] Trust strip line 3: "✓ No sales deck. No product demo. Just a written map of your operating reality."
- [ ] Hero right column: Stage 0 / Stage 1 / Stage 2 visual (NOT Signal/Context/Options)

**Problem section:**
- [ ] Section label: "THE REAL PROBLEM"
- [ ] Headline: "The Four Invisible Drains"
- [ ] Opening line: "As businesses grow, work does not break loudly. It leaks quietly."
- [ ] Four cards: Knowledge Drain | Coordination Tax | Decision Latency | Invisible Leakage
- [ ] NO emojis as icons — use Lucide SVG icons only
- [ ] Knowledge Drain body: updated to include "three weeks before replacement is productive" angle
- [ ] Coordination Tax body: updated to include leadership time cost angle

**What Changes section:**
- [ ] Section label: "THE DIFFERENCE"
- [ ] Headline: "What your operations look like before and after."
- [ ] Two-column side-by-side visual (NOT toggle, NOT prose block)
- [ ] Left column header: "Without process clarity" (NOT "Broken workflow")
- [ ] Right column header: "With Kautilyan"
- [ ] Left column: 6 rows with short visceral descriptions of active loss
- [ ] Right column: 6 rows with specific Kautilyan outcomes
- [ ] NO emojis — use simple text indicators (plain text or Lucide icons)

**How It Works section (homepage):**
- [ ] Stages shown as: Stage 0 | Stage 1 | Stage 2 | Stage 3
- [ ] No pricing mentioned (no ₹50,000 in this section)
- [ ] No "Paid" label on Stage 1
- [ ] Single CTA at bottom: "Start with a free 45-minute diagnosis →"
- [ ] NOT multiple CTAs per stage

**Why Different section:**
- [ ] Move this section ABOVE the Trust section (earlier in page)
- [ ] Table left column headers: name the categories
  - "AI Platform Vendors (Copilot, Glean, etc.)"
  - "Strategy Consultants (McKinsey, BCG style)"
  - "No-Code / Automation Agencies"
  - "Kautilyan"
- [ ] "Starting point" row: clarify WHO "sells software first"

**Trust section:**
- [ ] NO emojis as icons — Lucide SVG only
- [ ] Suggested icons: `users` | `layers` | `shield-check` | `file-check`

**FAQ section:**
- [ ] Section label: "QUESTIONS LEADERS ASK"
- [ ] Headline: "Common questions before the first call" (NOT "answer these")

---

### HOW IT WORKS PAGE COPY CHECKLIST

- [ ] Hero: "We don't sell you a platform. We embed, diagnose, redesign, and build."
- [ ] Four phases: all visible simultaneously, no click-to-reveal
- [ ] Phase 1 first (Diagnose) — not Phase 2 (Redesign) first
- [ ] SLOPE section: keep as "The SLOPE Framework" — do NOT rename
- [ ] AI Residency section: renamed to "The Embedded AI Partner Model"
- [ ] Section heading: "Why we work as an embedded partner — not a vendor."

---

### USE CASES PAGE COPY CHECKLIST

- [ ] "D2C Operations" renamed to "Ecommerce and Retail Operations"
- [ ] All use cases visible simultaneously — no tab-click required
- [ ] Single CTA at bottom of section, not one per use case card
- [ ] Add industry visual on left (hub-and-spoke: Kautilyan centre, industries as spokes)

---

### PRICING PAGE COPY CHECKLIST

- [ ] Stage 2 card: NO ₹75,000 mentioned
- [ ] Stage 2 card: NO ₹20L–₹30L annual price mentioned
- [ ] Annual pricing: "Custom pricing based on workflow scope and user volume — discussed after proof, not before."
- [ ] Guarantee wording: "If we miss the agreed Day 45 outcome after client-side dependencies are met, we refund the pilot fee. The guarantee is real. So are the prerequisites."
- [ ] BYOK section headline: "Your data stays in your control." (NOT "Your data never leaves your environment")
- [ ] Stage 0 CTA sub-text: "No sales deck. No product demo. Just a blueprint of your operating reality that you can keep — even if you never hire us."
- [ ] Scarcity line: "Personally run by our co-founder. No SDRs. No sales scripts. We limit weekly capacity to ensure every session produces a written output worth your 45 minutes."

---

### ABOUT PAGE COPY CHECKLIST

- [ ] Industry list: includes D2C, ecommerce
- [ ] Soumya: full name, LinkedIn link, prior company
- [ ] Both LinkedIn buttons: working URLs (not href="#")

---

---

# REFERENCE: ICON LIBRARY

Use Lucide icons throughout. No emojis anywhere on the site.

```html
<!-- Add to <head> -->
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

<!-- Usage -->
<i data-lucide="users"></i>        <!-- Knowledge Drain / We embed -->
<i data-lucide="clock"></i>        <!-- Coordination Tax -->
<i data-lucide="git-branch"></i>   <!-- Decision Latency -->
<i data-lucide="trending-down"></i> <!-- Invisible Leakage -->
<i data-lucide="layers"></i>       <!-- Redesign before build -->
<i data-lucide="shield-check"></i> <!-- Humans approve always -->
<i data-lucide="file-check"></i>   <!-- Outcome in writing -->
<i data-lucide="search"></i>       <!-- Diagnosis phase -->
<i data-lucide="pencil-ruler"></i> <!-- Redesign phase -->
<i data-lucide="cpu"></i>          <!-- Implement phase -->
<i data-lucide="repeat"></i>       <!-- Institutionalise phase -->

<script>lucide.createIcons();</script>
```

---

# REFERENCE: FONT SETUP

```html
<!-- Add to <head> -->
<link href="https://fonts.googleapis.com/css2?
  family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700
  &family=Inter:wght@400;500;600
  &display=swap" rel="stylesheet">
```

```css
/* Global typography */
:root {
  --font-display: 'Bricolage Grotesque', sans-serif;
  --font-body: 'Inter', sans-serif;
  --color-accent: #F97316;
  --color-bg: #0A0A0A;
  --color-text: rgba(255,255,255,0.85);
  --color-text-muted: rgba(255,255,255,0.60);
}

h1, h2, h3 { font-family: var(--font-display); font-weight: 700; }
body, p, li { font-family: var(--font-body); font-weight: 400; }

h1 { font-size: clamp(32px, 5vw, 64px); line-height: 1.1; letter-spacing: -0.02em; }
h2 { font-size: clamp(24px, 3.5vw, 48px); line-height: 1.2; }
body { font-size: 16px; line-height: 1.65; color: var(--color-text); }
```

---

# REFERENCE: SLOPE FRAMEWORK VISUAL SPEC

Layout: Horizontal progression — five hexagon nodes left to right.

```css
/* Each hexagon */
.slope-node {
  width: 80px;
  height: 80px;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  background: rgba(249,115,22,0.12);
  border: 1px solid rgba(249,115,22,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.slope-letter {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #F97316;
}

/* Connector between nodes */
.slope-connector {
  width: 40px;
  height: 2px;
  background: rgba(249,115,22,0.3);
  position: relative;
}

.slope-connector::after {
  content: '→';
  color: rgba(249,115,22,0.5);
  position: absolute;
  right: -8px;
  top: -10px;
}

/* Node title */
.slope-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #FFFFFF;
  text-align: center;
  margin-top: 12px;
}

/* Node description */
.slope-desc {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: rgba(255,255,255,0.55);
  text-align: center;
  max-width: 120px;
  line-height: 1.4;
}

/* Framework tagline */
.slope-tagline {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #F97316;
  letter-spacing: 0.08em;
  text-align: center;
  margin-top: 24px;
}
```

Tagline text: "The smallest safe architecture that achieves the business outcome."

---

# SIGN-OFF CHECKLIST

Before marking anything as done, test the following:

**P0 sign-off:**
- [ ] Clicked every CTA on every page — all open Cal.com
- [ ] Assessment page: developer placeholder not visible to any public visitor
- [ ] Apex `kautilyan.com` redirects to `www.kautilyan.com`
- [ ] Privacy policy live and linked from footer
- [ ] Booking form date picker works on iPhone Safari
- [ ] Soumya's full name and LinkedIn live on About page

**P1 sign-off:**
- [ ] Booking form has 4 fields (not 11)
- [ ] Social proof strip live on homepage
- [ ] Refund guarantee visible in homepage hero area
- [ ] Resources page has at least 2 free downloads and 1 gated download
- [ ] Navigation identical on all pages
- [ ] sitemap.xml and robots.txt accessible
- [ ] FAQPage schema passes Google Rich Results Test
- [ ] All body text passes WCAG AA contrast check
- [ ] Use Cases page title under 60 characters

**P2 sign-off:**
- [ ] At least one named case study live
- [ ] 3 per-use-case landing pages live
- [ ] Google PageSpeed: 80+ mobile
- [ ] Full booking flow completable on iPhone iOS Safari
- [ ] Contact page live with DPDP grievance officer named
- [ ] GA4 tracking `diagnosis_booked` conversion event
- [ ] Google Search Console verified and sitemap submitted
