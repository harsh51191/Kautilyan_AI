# Kautilyan: AI Operating Intelligence Diagnostic
## Cursor Implementation Spec - Revised for Actual File Structure

---

## CRITICAL: READ THIS FIRST

The original spec assumed React + Vite + TypeScript. That is WRONG.

The actual Kautilyan_Website is:
- **Vanilla HTML / CSS / JS** - one .html + one .css + one .js per page
- **Vercel** for hosting (vercel.json exists)
- **Supabase** for backend storage (supabase/migrations/ folder exists)
- **Google Apps Script** for leads/blog automation (google-apps-script/ folder)
- **No build step, no npm, no JSX, no TypeScript**

Confirmed layout (two different “assessment” flows - do not conflate):
```
Kautilyan_Website/
  assessment.html          ← AI Operating Intelligence Diagnostic (12 Q + report)
  css/assessment.css       ← styles for assessment.html
  js/assessment.js         ← diagnostic client controller
  stage0-intake.html       ← Stage 0 pre-call intake (5 prep Q after Cal booking)
  css/stage0-intake.css    ← styles for stage0-intake.html
  js/booking.js            ← intake flow (follow for patterns)
  api/
    submit-assessment.js   ← POST: Supabase + Gemini report + GAS email
    get-report.js          ← GET: poll report readiness
  supabase/migrations/
    20260526120000_assessment_tables.sql
  google-apps-script/LeadsCapture.gs  ← leads + type: assessment_email
  index.html, pricing.html, how-it-works.html, js/nav.js, sitemap.xml  ← CTAs to /assessment.html
  vercel.json              ← /api routes, env refs, /assessment → assessment.html
```

---

## HOW TO USE THIS FILE IN CURSOR

1. Save this file in your Kautilyan_Website project root as `ASSESSMENT_SPEC.md`
2. Open Cursor Agent (Cmd+Shift+I)
3. Reference it with `@ASSESSMENT_SPEC.md` in each prompt
4. Run the 8 prompts IN ORDER - each builds on the previous

---

## ARCHITECTURE OVERVIEW

The assessment is a **single-page experience** inside `assessment.html`.
It has 4 views controlled by JavaScript show/hide - no page navigation:

```
View 1: LANDING     → hero, promise, "Start diagnostic" button
View 2: QUESTIONS   → 12 questions, one at a time, progress bar
View 3: LEAD FORM   → 8 fields, submitted after questions
View 4: RESULTS     → full report rendered on screen
```

State travels through the page using `sessionStorage`:
```
sessionStorage["kautilyan_answers"]    = JSON of {q1..q12}
sessionStorage["kautilyan_lead"]       = JSON of lead form data
sessionStorage["kautilyan_score"]      = JSON of computed scoring result
sessionStorage["kautilyan_report_id"]  = UUID from Supabase after submit
```

Backend uses two Vercel serverless functions:
```
POST /api/submit-assessment   → Supabase insert, Gemini narrative (background), GAS email
GET  /api/get-report?id=…     → poll until report_generated; returns report JSON
```

---

## REFERENCE: COMPLETE QUESTION DATA (plain JS)

This goes inside `js/assessment.js`. Do NOT use TypeScript syntax.

```javascript
const QUESTIONS = [
  // SECTION 1: Knowledge & Context (Q1–Q4)
  {
    id: 'q1', section: 'knowledge', sectionLabel: 'Knowledge & Context', sectionNum: 1,
    question: 'When a key person leaves or is unavailable, what happens to their knowledge?',
    options: [
      { value: 1, label: 'A', text: 'Work stops or slows significantly until they return' },
      { value: 2, label: 'B', text: 'Others manage, but important context is lost' },
      { value: 3, label: 'C', text: 'Some documentation exists, but it is incomplete or not always current' },
      { value: 4, label: 'D', text: 'Their decisions, context, customer history, and working knowledge are captured in systems others can use' },
    ],
  },
  {
    id: 'q2', section: 'knowledge', sectionLabel: 'Knowledge & Context', sectionNum: 1,
    question: 'When a new hire joins, how easily can they understand past decisions, customer context, and current priorities?',
    options: [
      { value: 1, label: 'A', text: 'It takes months and depends heavily on shadowing people' },
      { value: 2, label: 'B', text: 'Some documents exist, but they still need repeated explanations' },
      { value: 3, label: 'C', text: 'They can access some shared context, but it is incomplete' },
      { value: 4, label: 'D', text: 'They inherit structured context, decisions, priorities, and workflow history from day one' },
    ],
  },
  {
    id: 'q3', section: 'knowledge', sectionLabel: 'Knowledge & Context', sectionNum: 1,
    question: 'How does leadership get visibility into what is really happening across the business?',
    options: [
      { value: 1, label: 'A', text: 'Mostly through meetings, calls, and asking people directly' },
      { value: 2, label: 'B', text: 'Through manually prepared reports and updates' },
      { value: 3, label: 'C', text: 'Through some dashboards or reports, but interpretation is still manual' },
      { value: 4, label: 'D', text: 'Through automated intelligence briefs that combine system signals, team updates, and recent decisions' },
    ],
  },
  {
    id: 'q4', section: 'knowledge', sectionLabel: 'Knowledge & Context', sectionNum: 1,
    question: 'Where are important decisions and their reasoning captured?',
    options: [
      { value: 1, label: 'A', text: 'Verbally, in meetings, or on WhatsApp - rarely documented' },
      { value: 2, label: 'B', text: 'In email threads or chats that are hard to retrieve later' },
      { value: 3, label: 'C', text: 'In shared documents or tools, but inconsistently' },
      { value: 4, label: 'D', text: 'In systems that capture the decision, reasoning, owner, context, and follow-up action' },
    ],
  },
  // SECTION 2: Process & Execution (Q5–Q8)
  {
    id: 'q5', section: 'process', sectionLabel: 'Process & Execution', sectionNum: 2,
    question: 'How do teams handle recurring workflows like reports, approvals, follow-ups, or status updates?',
    options: [
      { value: 1, label: 'A', text: 'Manually every time' },
      { value: 2, label: 'B', text: 'With templates, but still requiring significant manual effort' },
      { value: 3, label: 'C', text: 'Partially automated, but still requiring coordination' },
      { value: 4, label: 'D', text: 'Largely automated, with humans reviewing key decisions or exceptions' },
    ],
  },
  {
    id: 'q6', section: 'process', sectionLabel: 'Process & Execution', sectionNum: 2,
    question: 'When an exception or problem occurs, how does it get resolved?',
    options: [
      { value: 1, label: 'A', text: 'Whoever is senior and available handles it personally' },
      { value: 2, label: 'B', text: 'There is an informal process, but it depends on the right person being around' },
      { value: 3, label: 'C', text: 'There is a documented process, but it is not always followed' },
      { value: 4, label: 'D', text: 'The system flags the issue, assembles context, and routes it to the right person' },
    ],
  },
  {
    id: 'q7', section: 'process', sectionLabel: 'Process & Execution', sectionNum: 2,
    question: 'When approvals happen, can you later see who approved, why, with what context, and what happened next?',
    options: [
      { value: 1, label: 'A', text: 'No - approvals are mostly verbal or informal' },
      { value: 2, label: 'B', text: 'Partially - approvals are traceable but reasoning is usually missing' },
      { value: 3, label: 'C', text: 'Mostly - approvals are logged, but context and outcomes are incomplete' },
      { value: 4, label: 'D', text: 'Yes - approvals are governed, contextual, auditable, and linked to outcomes' },
    ],
  },
  {
    id: 'q8', section: 'process', sectionLabel: 'Process & Execution', sectionNum: 2,
    question: 'When important business signals change - customer risk, delivery delay, revenue leakage, SLA breach - how does the organisation respond?',
    options: [
      { value: 1, label: 'A', text: 'Someone notices manually and escalates' },
      { value: 2, label: 'B', text: 'Dashboards exist, but people must interpret and act' },
      { value: 3, label: 'C', text: 'Some alerts exist, but coverage is incomplete' },
      { value: 4, label: 'D', text: 'The system surfaces the issue, recommends action, and routes it into a workflow' },
    ],
  },
  // SECTION 3: Technology, AI & Agent Readiness (Q9–Q12)
  {
    id: 'q9', section: 'technology', sectionLabel: 'Technology, AI & Agent Readiness', sectionNum: 3,
    question: 'How is AI currently being used in your organisation?',
    options: [
      { value: 1, label: 'A', text: 'Not at all, or only informally by a few individuals' },
      { value: 2, label: 'B', text: 'Individuals use free or personal AI tools, but nothing is shared or governed' },
      { value: 3, label: 'C', text: 'Approved AI tools exist, but usage is mostly individual' },
      { value: 4, label: 'D', text: 'AI is embedded into shared workflows across teams' },
    ],
  },
  {
    id: 'q10', section: 'technology', sectionLabel: 'Technology, AI & Agent Readiness', sectionNum: 3,
    question: 'What happens to AI-generated outputs after they are created?',
    options: [
      { value: 1, label: 'A', text: "They stay inside an individual's device, account, or chat" },
      { value: 2, label: 'B', text: 'They are sometimes shared informally' },
      { value: 3, label: 'C', text: 'They are saved in shared folders or tools, but not connected to workflows' },
      { value: 4, label: 'D', text: 'They are captured, reused, and improved across the team or organisation' },
    ],
  },
  {
    id: 'q11', section: 'technology', sectionLabel: 'Technology, AI & Agent Readiness', sectionNum: 3,
    question: 'When work moves across CRM, ERP, email, documents, project tools, or chat, does context move with it?',
    options: [
      { value: 1, label: 'A', text: 'No - systems operate independently' },
      { value: 2, label: 'B', text: 'Some manual export/import or copy-paste is required' },
      { value: 3, label: 'C', text: 'Some integrations exist, but context does not flow reliably' },
      { value: 4, label: 'D', text: 'Systems are connected and context flows with minimal manual effort' },
    ],
  },
  {
    id: 'q12', section: 'technology', sectionLabel: 'Technology, AI & Agent Readiness', sectionNum: 3,
    question: 'When AI is used, what level of responsibility can it safely take today?',
    options: [
      { value: 1, label: 'A', text: 'It only helps individuals generate content or answer questions' },
      { value: 2, label: 'B', text: 'It helps with analysis, drafts, or summaries, but humans manually move work forward' },
      { value: 3, label: 'C', text: 'It supports repeatable workflows, but humans still coordinate most actions' },
      { value: 4, label: 'D', text: 'It can trigger or recommend actions across systems with human approval and audit trails' },
    ],
  },
];

const ROLE_OPTIONS = [
  'Founder / CEO / Managing Director',
  'COO / Chief of Staff',
  'CTO / CIO / Digital Transformation Head',
  'Business Operations Head',
  'AI / Automation Lead',
  'Other',
];

const EMPLOYEE_OPTIONS = ['1–10','11–30','31–100','101–300','301–500','500+'];

const CHALLENGE_OPTIONS = [
  'Too much founder/senior dependency',
  'Slow approvals and decision-making',
  'Poor visibility across teams',
  'Knowledge loss when people leave',
  'Too many manual follow-ups',
  'AI tools being used without clear ROI',
  'Disconnected systems',
  'Customer/account escalations',
  'Delivery or operations inconsistency',
  'Other',
];
```

---

## REFERENCE: COMPLETE SCORING ENGINE (plain JS)

This also goes in `js/assessment.js`, after the data above.

```javascript
// ── Dimension scores ─────────────────────────────────────────────────────────
function getDimensionScores(a) {
  return {
    knowledge:  a.q1 + a.q2 + a.q3 + a.q4,
    process:    a.q5 + a.q6 + a.q7 + a.q8,
    technology: a.q9 + a.q10 + a.q11 + a.q12,
  };
}

// ── Agent readiness ──────────────────────────────────────────────────────────
function getAgentReadiness(a) {
  const score = a.q5 + a.q6 + a.q7 + a.q10 + a.q11 + a.q12;
  if (score >= 21) return { score, level: 'High',     label: 'Agent-Ready',      recommendation: 'Ready to explore governed multi-system agents with approvals, audit trails, and institutional memory.',   startWith: ['Governed multi-system agents','Approval-routing agents','Cross-system context agents'],   avoid: ['Uncontrolled agent autonomy','Agents without audit trails'] };
  if (score >= 17) return { score, level: 'Medium',   label: 'Workflow-Ready',   recommendation: 'Start with human-in-the-loop agents for one recurring workflow.',                                            startWith: ['Human-in-the-loop workflow agents','Leadership intelligence brief','Exception triage agent'], avoid: ['Fully autonomous agents','Multi-system execution without approvals'] };
  if (score >= 11) return { score, level: 'Emerging', label: 'Copilot-Ready',    recommendation: 'Start with copilots and structured briefs. Avoid autonomous execution.',                                    startWith: ['AI copilots','Structured briefing tools','Draft-and-review workflows'],                       avoid: ['Autonomous agents','Agents that update records without human review'] };
  return             { score, level: 'Low',      label: 'Foundation-First', recommendation: 'Do not start with agents. Start with process visibility, decision capture, and AI usage governance.',          startWith: ['Process documentation','Decision logging','AI governance baseline'],                          avoid: ['Any agent deployment','Shared AI tools without governance'] };
}

// ── Maturity level with gating ───────────────────────────────────────────────
function getMaturityLevel(a, d, total) {
  const LEVELS = {
    1: { label: 'Manual Operating Reality',  description: 'Work depends heavily on people, meetings, memory, and manual coordination.' },
    2: { label: 'Shadow AI Usage',           description: 'AI may exist individually, but value is not captured organisationally.' },
    3: { label: 'Governed Tool Adoption',    description: 'Approved tools and some systems exist, but AI is still mostly individual productivity.' },
    4: { label: 'Workflow Intelligence',     description: 'AI and automation support recurring workflows, approvals, and visibility.' },
    5: { label: 'Agentic Operating Layer',   description: 'Governed agents, context flow, decision memory, and institutional learning are emerging.' },
  };
  let raw = total <= 18 ? 1 : total <= 25 ? 2 : total <= 33 ? 3 : total <= 41 ? 4 : 5;
  // Level 4 gate
  if (raw >= 4 && !(d.process >= 11 && a.q7 >= 3 && a.q10 >= 3 && a.q11 >= 3)) raw = 3;
  // Level 5 gate
  if (raw >= 5 && !(d.knowledge >= 13 && d.process >= 13 && d.technology >= 13 && a.q4 === 4 && a.q7 === 4 && a.q11 >= 3 && a.q12 >= 3)) raw = 4;
  return { level: raw, ...LEVELS[raw] };
}

// ── Pattern detection ────────────────────────────────────────────────────────
const PATTERN_RULES = [
  { id: 'shadow_ai',                  label: 'Shadow AI',                      description: 'People use AI individually, but outputs are not captured or reused by the organisation.',                             detect: (a,d) => a.q9 >= 2 && a.q10 <= 2 },
  { id: 'tool_heavy_process_light',   label: 'Tool-heavy, Process-light',      description: 'Strong tool adoption, but recurring workflows, approvals, and decisions are still manual.',                            detect: (a,d) => d.technology >= 11 && d.process <= 9 },
  { id: 'dashboard_rich_decision_poor',label:'Dashboard-rich, Decision-poor',  description: 'Visibility exists across systems, but decision reasoning is not captured for future use.',                            detect: (a,d) => a.q3 >= 3 && a.q4 <= 2 },
  { id: 'founder_dependent',          label: 'Founder-dependent',              description: 'Execution depends too heavily on senior people - creating a single point of failure.',                                  detect: (a,d) => a.q1 <= 2 && a.q3 <= 2 && a.q6 <= 2 },
  { id: 'approval_risk',              label: 'Approval-risk',                  description: 'Approvals lack context, reasoning, or auditability - creating compliance and quality risk.',                          detect: (a,d) => a.q7 <= 2 },
  { id: 'system_fragmented',          label: 'System-fragmented',              description: 'Context breaks as work moves across tools - creating repeated reconstruction effort.',                                  detect: (a,d) => a.q11 <= 2 },
  { id: 'ai_value_leakage',           label: 'AI Value Leakage',               description: 'AI creates individual value, but that value is not captured or reused at an organisational level.',                    detect: (a,d) => a.q9 >= 3 && a.q10 <= 2 },
  { id: 'agent_ready',                label: 'Agent-ready',                    description: 'Strong candidate for governed agent workflows across recurring processes.',                                             detect: (a,d) => a.q5 >= 3 && a.q7 >= 3 && a.q11 >= 3 && a.q12 >= 3 },
  { id: 'agent_fragile',              label: 'Agent-fragile',                  description: 'AI ambition is present, but governance or system integration is too weak for safe agent deployment.',                  detect: (a,d) => a.q9 >= 3 && (a.q7 <= 2 || a.q11 <= 2) },
];

function getPatterns(a, d) {
  return PATTERN_RULES.filter(p => p.detect(a, d)).map(({id,label,description}) => ({id,label,description}));
}

// ── CTA by level ─────────────────────────────────────────────────────────────
function getRecommendedCTA(level) {
  const ctas = {
    1: { headline: 'Book a free AI Operating Awareness Session',          body: 'Identify where AI can reduce manual coordination, knowledge dependency, and repeated follow-ups.',                                          buttonText: 'Book Free Awareness Session' },
    2: { headline: 'Book a free Shadow AI Risk & Opportunity Review',     body: 'Understand where AI is already being used, where value is leaking, and what should be governed first.',                                      buttonText: 'Book Free Shadow AI Review'  },
    3: { headline: 'Book a free 45-minute Operating Reality Diagnosis',   body: 'Map where your tools, teams, and workflows are losing context - and identify the highest-leverage first workflow.',                          buttonText: 'Book Free Diagnosis'         },
    4: { headline: 'Start Stage 1: Operating Reality Blueprint',          body: 'We map your workflows, decision points, systems, and first 90-day implementation path.',                                                     buttonText: 'Request Blueprint Scope'     },
    5: { headline: 'Book a Kautilyan Strategy Call',                      body: 'Explore how to scale governed agents, institutional memory, and operating intelligence across your teams.',                                   buttonText: 'Book Strategy Call'          },
  };
  return ctas[level] || ctas[3];
}

// ── Primary constraint ───────────────────────────────────────────────────────
function getPrimaryConstraint(d) {
  const min = Math.min(d.knowledge, d.process, d.technology);
  if (d.knowledge === min) return 'Knowledge capture and context retention';
  if (d.process === min)   return 'Process structure and decision memory';
  return 'System connectivity and AI governance';
}

// ── Master scorer (call this once all 12 answers are in) ─────────────────────
function scoreAssessment(answers) {
  const total = Object.values(answers).reduce((s, v) => s + v, 0);
  const dimensions = getDimensionScores(answers);
  const agentReadiness = getAgentReadiness(answers);
  const maturityLevel = getMaturityLevel(answers, dimensions, total);
  const patterns = getPatterns(answers, dimensions);
  const primaryPattern = patterns.find(p => p.id !== 'agent_ready') || patterns[0] || null;
  const primaryConstraint = getPrimaryConstraint(dimensions);
  const cta = getRecommendedCTA(maturityLevel.level);
  const dimEntries = [['knowledge',dimensions.knowledge],['process',dimensions.process],['technology',dimensions.technology]].sort((a,b)=>b[1]-a[1]);
  return {
    totalScore: total,
    dimensions,
    maturityLevel,
    patterns,
    primaryPattern,
    primaryConstraint,
    agentReadiness,
    recommendedCTA: cta,
    strongestDimension: dimEntries[0][0],
    weakestDimension:   dimEntries[2][0],
  };
}
```

---

## REFERENCE: SUPABASE MIGRATION

Create this file: `supabase/migrations/[timestamp]_assessment_tables.sql`
Name it with today's timestamp, e.g. `20260526120000_assessment_tables.sql`

```sql
CREATE TABLE IF NOT EXISTS assessment_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  q1 INT NOT NULL, q2 INT NOT NULL, q3 INT NOT NULL, q4 INT NOT NULL,
  q5 INT NOT NULL, q6 INT NOT NULL, q7 INT NOT NULL, q8 INT NOT NULL,
  q9 INT NOT NULL, q10 INT NOT NULL, q11 INT NOT NULL, q12 INT NOT NULL,
  total_score INT, knowledge_score INT, process_score INT, technology_score INT,
  maturity_level INT, maturity_label TEXT, agent_readiness_level TEXT,
  agent_readiness_score INT, primary_pattern TEXT, patterns JSONB,
  name TEXT NOT NULL, work_email TEXT NOT NULL, company_name TEXT NOT NULL,
  company_website TEXT, role TEXT NOT NULL, employee_count TEXT,
  industry TEXT, biggest_challenge TEXT,
  report_id UUID, report_generated BOOLEAN DEFAULT FALSE,
  report_emailed BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS assessment_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  response_id UUID REFERENCES assessment_responses(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  executive_summary TEXT, where_you_are TEXT, cost_analysis TEXT,
  agent_readiness_narrative TEXT, level_up_narrative TEXT,
  roadmap_month1 TEXT, roadmap_month2 TEXT, roadmap_month3 TEXT,
  kautilyan_section TEXT, next_step_narrative TEXT,
  company_research TEXT, full_report_json JSONB
);

ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_insert_responses" ON assessment_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_reports"     ON assessment_reports FOR SELECT USING (true);
CREATE POLICY "service_all_responses"   ON assessment_responses USING (true) WITH CHECK (true);
CREATE POLICY "service_insert_reports"  ON assessment_reports FOR INSERT WITH CHECK (true);
```

---

## REFERENCE: ENVIRONMENT VARIABLES

Create `.env` in project root (add to .gitignore if not already there):

```
SUPABASE_URL=https://[your-project].supabase.co
SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
GEMINI_API_KEY=[your-google-ai-studio-key]
GAS_EMAIL_WEBHOOK_URL=[your-apps-script-web-app-url]
SITE_URL=https://www.kautilyan.com
```

---

## CURSOR PROMPT 1 - Create js/assessment.js

```
I'm building the AI Operating Intelligence Diagnostic for the Kautilyan website.

The site is VANILLA HTML/CSS/JS hosted on Vercel with Supabase for storage.
There is no React, no TypeScript, no build step.
The existing pattern is: one .html file + one css/page.css + one js/page.js per page.

Create the file js/assessment.js. This file controls the entire assessment experience.

The file must contain these sections in order:

1. CONSTANTS - paste the QUESTIONS array, ROLE_OPTIONS, EMPLOYEE_OPTIONS, and CHALLENGE_OPTIONS exactly from the ASSESSMENT_SPEC.md reference section.

2. SCORING ENGINE - paste the complete scoring engine functions (getDimensionScores, getAgentReadiness, getMaturityLevel, getPatterns, getRecommendedCTA, getPrimaryConstraint, scoreAssessment) exactly from the ASSESSMENT_SPEC.md reference section.

3. STATE - a simple state object:
   const state = {
     answers: {},           // {q1: 2, q2: 3, ...}
     currentQuestion: 0,    // 0-indexed
     leadData: {},
     scoringResult: null,
     reportId: null,
   };
   On page load: restore state.answers from sessionStorage['kautilyan_answers'] if present.

4. VIEW CONTROLLER - functions to show/hide the four views:
   - showView(viewId) - hides all views (landing, questions, lead-form, results), shows the one with id viewId
   - Views are div elements with ids: view-landing, view-questions, view-lead-form, view-results

5. QUESTION RENDERER - function renderQuestion(index):
   - Updates DOM: question number, section label, section progress dots, question text, 4 option buttons
   - Updates progress bar: percentage = ((index + 1) / 12) * 100
   - On option button click: setAnswer(questionId, value) → wait 400ms → advance
   - Last question (index 11): advance to showView('view-lead-form')

6. KEYBOARD HANDLER - document keydown listener:
   - Keys 'a'/'A' → select option 0
   - Keys 'b'/'B' → select option 1
   - Keys 'c'/'C' → select option 2
   - Keys 'd'/'D' → select option 3
   - Backspace/ArrowLeft → go to previous question (if index > 0)
   - Only active when view-questions is visible

7. SECTION TRANSITION - when moving from Q4→Q5 and Q8→Q9:
   - Show a full-screen section intro overlay for 1.5 seconds
   - The overlay shows the new section name and a brief description
   - Then auto-hide and render the next question

8. LEAD FORM HANDLER - function setupLeadForm():
   - Dynamically populates the role, employee count, and challenge dropdowns from the constants
   - On form submit: validate all required fields
   - On validation pass: collect form data into state.leadData
   - Call submitAssessment() - see below

9. SUBMIT FUNCTION - async function submitAssessment():
   - Compute: state.scoringResult = scoreAssessment(state.answers)
   - Save to sessionStorage
   - Show loading state on the submit button ("Generating your report...")
   - POST to /api/submit-assessment with body: JSON.stringify({ answers: state.answers, leadData: state.leadData, scoringResult: state.scoringResult })
   - On success: state.reportId = response.responseId → showView('view-results') → renderResults()
   - On error: show inline error message, restore button text

10. RESULTS RENDERER - function renderResults():
    - Uses state.scoringResult and state.reportId
    - Renders the score card, dimension bars, patterns, agent readiness meter
    - Immediately renders static scoring data (does not wait for LLM report)
    - Then polls GET /api/get-report?id={reportId} every 4 seconds up to 15 times
    - When report narrative arrives: insert the text sections into the DOM
    - If poll times out: show "Your full report has been emailed to you."
    - Renders the recommended CTA block at the bottom

11. INIT - DOMContentLoaded listener:
    - Call setupLeadForm()
    - Attach "Start Diagnostic" button click → showView('view-questions') → renderQuestion(0)
    - Attach "Retake" button click → clear sessionStorage, reset state, showView('view-landing')
    - Check sessionStorage on load: if answers exist and count > 0, show a "Resume" banner on the landing view

All DOM manipulation uses vanilla JS (querySelector, innerHTML, addEventListener). No jQuery.
Do not use ES modules (no import/export) - this file is loaded with a plain script tag.
```

---

## CURSOR PROMPT 2 - Replace assessment.html

```
Replace the entire content of assessment.html with a complete implementation.

The page must follow the same structure as other pages on the Kautilyan site:
- Load css/site.css and css/assessment.css in the head
- Load js/nav.js, js/footer.js, js/site.js, js/analytics.js, js/assessment.js in the body (same order as other pages)
- Include the nav via the same pattern as index.html (look at index.html for the exact nav include pattern)
- Include the footer via the same pattern as other pages

The page has a special layout: the nav is hidden during the question flow (class toggle), 
shown on landing and results views.

The four view divs (all inside a main container, only one visible at a time):

── VIEW 1: id="view-landing" ──
- Tag line: "Free · 7 minutes · Instant report"
- H1: "Is your company using AI - or building operating intelligence?"
- Subheadline: "Take the free AI Operating Intelligence Diagnostic to see where your organisation stands across knowledge capture, execution, governance, and agent readiness."
- Three pain cards in a row (no emojis, just clean text cards):
  Card 1: "Why does everything still need me?" / Founders & CEOs
  Card 2: "Why do teams keep losing context?" / COOs & Ops Leaders  
  Card 3: "Why are we using AI tools but still not moving faster?" / Digital & AI Leads
- "What you will discover" - 4 numbered items
- Button id="btn-start": "Start the diagnostic →"
- Supporting line: "Built for founders, CEOs, COOs, and business leaders."

── VIEW 2: id="view-questions" ──
- Top bar: progress bar (id="progress-bar-fill"), section label (id="section-label"), question counter (id="question-counter")
- Three section dots: spans with ids section-dot-1, section-dot-2, section-dot-3
- Question card:
  - id="question-number" (e.g. "Question 4 of 12")
  - id="question-text"
  - Four option buttons with ids option-A, option-B, option-C, option-D
    Each button has: a letter badge span + a text span (id="option-A-text" etc.)
  - Back button id="btn-back" (hidden on Q1)
- Section transition overlay div id="section-transition" (hidden by default):
  - id="transition-section-name"
  - id="transition-section-desc"

── VIEW 3: id="view-lead-form" ──
- Heading: "Your report is almost ready."
- Subheading: "Tell us where to send it and we will personalise it to your company."
- Form id="lead-form" with fields:
  - name="respondent_name" (text, required, label "Your name")
  - name="work_email" (email, required, label "Work email")
  - name="company_name" (text, required, label "Company name")
  - name="company_website" (url, optional, label "Company website", placeholder "https://")
  - name="role" (select, required, label "Your role") - options populated by JS
  - name="employee_count" (select, required, label "Team size") - options populated by JS
  - name="industry" (text, required, label "Industry")
  - name="biggest_challenge" (select, required, label "Biggest operating challenge") - options populated by JS
- Each field has an error span below it (class="field-error", hidden by default)
- Submit button id="btn-submit": "Get my free report →"
- Privacy line: "Your answers are used only to personalise your report."

── VIEW 4: id="view-results" ──
Section A - Score card (always shown immediately):
- id="result-company-name"
- id="result-respondent"  
- id="result-date"
- Large score: id="result-total-score" (e.g. "29 / 48")
- Level badge: id="result-level-badge" (e.g. "Level 3 - Governed Tool Adoption")
- Three dimension bars: each has a label, score fraction, and a fill bar
  ids: dim-knowledge-score, dim-knowledge-bar, dim-process-score, dim-process-bar, dim-technology-score, dim-technology-bar
- Patterns: id="result-patterns-container" (badges rendered by JS)
- Agent readiness meter: id="agent-readiness-meter" (4-step: Low / Emerging / Medium / High)
- Primary constraint line: id="result-primary-constraint"
- CTA block: id="result-cta-block" (populated by JS based on level)

Section B - Narrative (shown after LLM report loads, or shows loading state):
- id="report-loading" - "Building your full report..." (shown while polling)
- id="section-where-you-are" with id="content-where-you-are"
- id="section-cost-analysis" with four cost cards:
  ids: cost-knowledge-drain, cost-coordination-tax, cost-decision-latency, cost-ai-value-leakage
- id="section-agent-readiness" with:
  id="agent-readiness-level-label"
  id="agent-start-with" (list)
  id="agent-avoid" (list)
  id="content-agent-narrative"
- id="section-level-up" with id="content-level-up"
- id="section-roadmap" with ids: content-roadmap-m1, content-roadmap-m2, content-roadmap-m3
- id="section-kautilyan" with id="content-kautilyan"
- Final CTA (duplicate of top CTA): id="result-final-cta"
- Share row: copy link button (id="btn-copy-link"), retake link (id="btn-retake")

Meta tags for this page:
- title: Free AI Readiness Assessment for Business Leaders | Kautilyan AI
- description: Assess your organisation's AI maturity, operating intelligence, governance, and agent readiness. Get a personalised report with a 90-day AI roadmap.
- canonical: https://www.kautilyan.com/assessment.html
```

---

## CURSOR PROMPT 3 - Replace css/assessment.css

```
Replace the entire content of css/assessment.css.

The page uses the same design tokens as the rest of the Kautilyan site 
(defined in css/site.css): dark ink background (#0F0F13), gold accent (#C9A84C), 
clean Inter typography, consistent border radius and spacing.

Write complete CSS for:

VIEWS:
- .assessment-view { display: none; }
- .assessment-view.active { display: block; }

LANDING VIEW:
- Full-width hero section, dark background, centered content max-width 680px
- Pain cards: 3-column grid, each card with border, rounded corners, no emojis
- "What you will discover" numbered list with left-aligned items
- Start button: gold background, dark text, full-width on mobile

QUESTION VIEW:
- Hide the site nav when questions view is active (class .assessment-questions-active on body)
- Minimal top bar: progress bar fills left to right in gold
- Section label: small uppercase text in gold
- Question counter: muted text top right
- Three section dots: small circles, inactive=grey, active=gold, complete=gold filled
- Question card: centered, max-width 680px, the question text is large (22px+)
- Option buttons: full-width, stacked, each with a letter badge on the left
  Default: white border on dark bg
  Hover: gold border
  Selected: gold border + gold background at 10% opacity + left border 3px solid gold
  Min height 60px for touch targets
- Back button: muted, small, top left
- Section transition overlay: full-screen dark overlay with section name in large text, centered

LEAD FORM VIEW:
- Centered card, max-width 520px
- Each field: label above, input below, error message below that (red, small)
- Input fields: consistent with site design (dark border, dark bg, white text)
- Submit button: full-width, gold background

RESULTS VIEW:
- Score card: prominent box at top, dark background, gold score number (large, 48px+)
- Level badge: inline badge with appropriate colour per level:
  Level 1: muted grey, Level 2: amber, Level 3: gold, Level 4: teal, Level 5: purple
- Dimension bars: label left, score fraction right, bar fills in gold
- Pattern badges: inline chips, each with a coloured left border
- Agent readiness meter: 4 horizontal steps, active step highlighted in gold
- Report sections: clear dividers between sections, H3 section headings
- Cost cards: 2x2 grid, each card has a title and body text
- Roadmap: 3 month blocks stacked vertically, each with a month label in gold
- CTA block: dark background box, gold button, centred

LOADING STATE:
- Pulsing dots animation for the "Building your report..." state
- Skeleton shimmer for narrative sections while loading

MOBILE (max-width 640px):
- Pain cards: single column
- Cost cards: single column
- Option buttons: full width, larger tap targets (min 56px height)
- Score card: stacked layout

No emojis in CSS content properties.
```

---

## CURSOR PROMPT 4 - Create api/submit-assessment.js (Vercel serverless)

```
Create api/submit-assessment.js - a Vercel serverless function (Node.js, CommonJS).

It handles POST /api/submit-assessment.

We are using:
- Supabase (@supabase/supabase-js) for storage
- Gemini API (native fetch, no SDK) for report generation
- Google Apps Script webhook (native fetch) for email delivery
No Resend. No Anthropic/Claude.

Logic:
1. Parse request body: { answers, leadData, scoringResult }
2. Validate: all 12 answers present (q1–q12), leadData.name and leadData.work_email present
3. Write to Supabase assessment_responses using SUPABASE_SERVICE_ROLE_KEY:
   - Insert all 12 answer fields, all scoring fields, all lead fields
   - Get back the inserted row id
4. Respond immediately to client: { success: true, responseId: id }
5. Fire-and-forget (no await): generateAndStoreReport(id, answers, leadData, scoringResult)

generateAndStoreReport async function:
  a. Fetch company research (wrap in try/catch, 5s timeout):
     If leadData.company_website provided: fetch it, strip HTML tags (<[^>]+>), take first 1500 chars
     Build: "Company: [name]. Industry: [industry]. [extracted text]"

  b. Call Gemini API using callGeminiForReport(scoringResult, leadData, companyResearch):

     const apiKey = process.env.GEMINI_API_KEY;
     const model  = 'gemini-2.0-flash';
     const url    = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

     POST to that URL with:
     {
       system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
       contents: [{ role: 'user', parts: [{ text: USER_PROMPT }] }],
       generationConfig: {
         temperature: 0.4,
         maxOutputTokens: 2000,
         responseMimeType: 'application/json'
       }
     }

     SYSTEM PROMPT (exact string):
     "You are an expert AI operating strategy analyst writing a personalised diagnostic report
     for a business leader. Write in a professional, direct tone. No jargon, no filler phrases.
     Use British English (organisation, recognised, colour). Do not use: transformative,
     cutting-edge, leverage as a verb, synergy, journey. Write about the organisation in second
     person. Return ONLY a valid JSON object with exactly these keys: executive_summary,
     where_you_are, cost_analysis, agent_readiness_narrative, level_up_narrative, roadmap_month1,
     roadmap_month2, roadmap_month3, kautilyan_section, next_step_narrative. Each value must be
     a string of 80-200 words. For cost_analysis format as four sections separated by |||:
     Knowledge drain|||Coordination tax|||Decision latency|||AI value leakage.
     Return no text outside the JSON object."

     USER PROMPT: build a string containing:
     - Company name, respondent name and role, industry, team size, biggest challenge
     - Total score /48, three dimension scores /16 each
     - Maturity level number and label
     - Primary pattern label, all pattern labels, primary constraint
     - Agent readiness level and label
     - Q4, Q7, Q10, Q11 individual values
     - Company research text

     Parse response: data.candidates[0].content.parts[0].text → strip any ``` fences → JSON.parse
     If parse fails: call getFallbackNarrative(maturityLevel, companyName) and use that instead

     getFallbackNarrative returns a valid report JSON object with generic but level-appropriate
     text for all 10 keys. The fallback should acknowledge the report will be emailed.

  c. Insert into assessment_reports:
     { response_id, executive_summary, where_you_are, cost_analysis,
       agent_readiness_narrative, level_up_narrative, roadmap_month1,
       roadmap_month2, roadmap_month3, kautilyan_section,
       next_step_narrative, company_research, full_report_json }

  d. Update assessment_responses: report_generated=true, report_id=[new id]

  e. Fire-and-forget: sendReportEmailViaGAS(leadData, scoringResult, responseId)
     (this function will be added in Prompt 6)

Error handling:
- Supabase write failure → return 500 { error: 'Storage error' }
- Gemini failure → use fallback narrative, still write to DB and send email
- Never let report generation failure prevent the 200 response to the client

CORS headers on all responses:
  Access-Control-Allow-Origin: process.env.SITE_URL
  Access-Control-Allow-Methods: POST, OPTIONS
  Content-Type: application/json
```

---

## CURSOR PROMPT 5 - Create api/get-report.js (Vercel serverless)

```
Create api/get-report.js - a Vercel serverless GET endpoint.

Handles GET /api/get-report?id={responseId}

Logic:
1. Read id from query params
2. Query Supabase: SELECT report_generated, report_id FROM assessment_responses WHERE id = {id}
3. If report_generated is false: return { ready: false }
4. Query assessment_reports WHERE response_id = {id}
5. Return { ready: true, report: { executive_summary, where_you_are, cost_analysis, agent_readiness_narrative, level_up_narrative, roadmap_month1, roadmap_month2, roadmap_month3, kautilyan_section, next_step_narrative } }

CORS headers same as submit endpoint.
Use CommonJS module.exports.
```

---

## CURSOR PROMPT 6 - Email delivery via Google Apps Script

```
Add email delivery inside api/submit-assessment.js.

We are NOT using Resend. Email is sent via Google Apps Script (GmailApp) using the
existing GAS web app already in the project (google-apps-script/LeadsCapture.gs).

PART A - Add sendReportEmailViaGAS to api/submit-assessment.js

Add this function at the bottom of api/submit-assessment.js:

async function sendReportEmailViaGAS(leadData, scoringResult, responseId) {
  const webhookUrl = process.env.GAS_EMAIL_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('GAS_EMAIL_WEBHOOK_URL not set - email skipped');
    return;
  }

  const reportUrl = `${process.env.SITE_URL}/assessment.html?report=${responseId}`;

  const payload = {
    type: 'assessment_email',
    data: {
      toEmail:             leadData.work_email,
      name:                leadData.name,
      companyName:         leadData.company_name,
      totalScore:          scoringResult.totalScore,
      maturityLabel:       `Level ${scoringResult.maturityLevel.level} - ${scoringResult.maturityLevel.label}`,
      primaryPattern:      scoringResult.primaryPattern ? scoringResult.primaryPattern.label : null,
      level:               scoringResult.maturityLevel.level,
      agentReadinessLevel: scoringResult.agentReadiness.level,
      ctaHeadline:         scoringResult.recommendedCTA.headline,
      reportUrl,
      siteUrl:             process.env.SITE_URL,
    },
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!result.success) console.error('GAS email failed:', result.error);
  } catch (err) {
    console.error('Email webhook error:', err.message);
    // Never fail the submission over an email error
  }
}

Then inside generateAndStoreReport, after updating report_generated=true, add:
  sendReportEmailViaGAS(leadData, scoringResult, responseId); // fire-and-forget, no await


PART B - Update google-apps-script/LeadsCapture.gs

Open LeadsCapture.gs. It already has a doPost function. Merge assessment email routing into it.

Replace (or update) the existing doPost to route by payload type:

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    if (payload.type === 'assessment_email') {
      sendAssessmentReportEmail(payload.data);
      return ContentService
        .createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Keep all existing lead capture logic below this line (do not remove it)
    // [existing doPost code continues unchanged...]

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

Then add this new function anywhere in LeadsCapture.gs (below the existing code):

function sendAssessmentReportEmail(data) {
  const {
    toEmail, name, companyName, totalScore, maturityLabel,
    primaryPattern, level, ctaHeadline, reportUrl, siteUrl
  } = data;

  const levelInsights = {
    1: 'The most important first step is not tooling - it is making operating context visible.',
    2: 'AI value is being created individually, but it is not yet captured organisationally.',
    3: 'Your tools are ahead of your processes. The primary constraint is decision memory, not more software.',
    4: 'You have the foundation. The next step is embedding context and approval capture into recurring workflows.',
    5: 'You are positioned to deploy governed agents. Ensure governance keeps pace with capability.',
  };
  const insight = levelInsights[level] || levelInsights[3];
  const subject = 'Your AI Operating Intelligence Report - ' + companyName;

  const htmlBody =
    '<!DOCTYPE html><html><body style="margin:0;padding:0;background:#F7F7FA;font-family:Arial,sans-serif;">' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F7FA;padding:32px 16px;"><tr><td>' +
    '<table width="100%" style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden;">' +

    // Header
    '<tr><td style="background:#0F0F13;padding:24px 32px;">' +
    '<span style="font-size:14px;font-weight:700;color:#C9A84C;letter-spacing:.06em;text-transform:uppercase;">KAUTILYAN AI</span>' +
    '</td></tr>' +

    // Body
    '<tr><td style="padding:32px;">' +
    '<p style="font-size:16px;color:#0F0F13;margin:0 0 8px;">Hi ' + name + ',</p>' +
    '<p style="font-size:15px;color:#3A3A4A;margin:0 0 24px;line-height:1.6;">Your AI Operating Intelligence Diagnostic is ready.</p>' +

    // Score box
    '<table width="100%" cellpadding="0" cellspacing="0" style="background:#0F0F13;border-radius:10px;margin-bottom:24px;">' +
    '<tr><td style="padding:24px 28px;">' +
    '<p style="margin:0 0 4px;font-size:13px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.06em;">Overall Score</p>' +
    '<p style="margin:0 0 8px;font-size:36px;font-weight:700;color:#C9A84C;">' + totalScore + ' <span style="font-size:18px;color:rgba(255,255,255,0.4);">/ 48</span></p>' +
    '<p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#FFFFFF;">' + maturityLabel + '</p>' +
    (primaryPattern ? '<p style="margin:0;font-size:13px;color:rgba(255,255,255,0.5);">Pattern: ' + primaryPattern + '</p>' : '') +
    '</td></tr></table>' +

    // Insight
    '<p style="font-size:14px;color:#3A3A4A;line-height:1.65;margin:0 0 24px;padding:16px;background:#FBF5E6;border-left:3px solid #C9A84C;border-radius:0 8px 8px 0;">' + insight + '</p>' +

    // CTA button
    '<table cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr>' +
    '<td style="background:#C9A84C;border-radius:8px;">' +
    '<a href="' + reportUrl + '" style="display:inline-block;padding:13px 26px;font-size:14px;font-weight:700;color:#0F0F13;text-decoration:none;">View your full report →</a>' +
    '</td></tr></table>' +

    '<p style="font-size:13px;color:#6B6B80;margin:0 0 24px;">' + ctaHeadline + '</p>' +
    '<hr style="border:none;border-top:1px solid #E2E2EB;margin:24px 0;">' +
    '<p style="font-size:12px;color:#6B6B80;margin:0;">Team Kautilyan &nbsp;·&nbsp; founders@kautilyan.com &nbsp;·&nbsp; ' + siteUrl + '</p>' +
    '</td></tr></table></td></tr></table></body></html>';

  GmailApp.sendEmail(toEmail, subject, '', { htmlBody: htmlBody, name: 'Kautilyan AI' });
}


PART C - Redeploy the Apps Script web app

After saving LeadsCapture.gs:
1. In Google Apps Script: Deploy → Manage deployments
2. Click the edit (pencil) icon on the existing web app deployment
3. Change version to "New version"
4. Click Deploy
5. Copy the web app URL (it stays the same if you're editing an existing deployment)
6. Set GAS_EMAIL_WEBHOOK_URL in Vercel environment variables to that URL

The GAS web app must be deployed with:
- Execute as: Me
- Who has access: Anyone
```

---

## CURSOR PROMPT 7 - Update vercel.json for /api routes

```
Update vercel.json to ensure the /api serverless functions work correctly.

Current vercel.json content is unknown - look at the existing file first.

Add or merge these settings:
- rewrites or routes: ensure /api/* routes go to the serverless functions
- functions: set maxDuration to 30 for api/submit-assessment.js (needs time for Gemini call)
- env: confirm GEMINI_API_KEY, GAS_EMAIL_WEBHOOK_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY, SITE_URL are listed under env references

Standard Vercel config for a static HTML site with /api functions:
{
  "functions": {
    "api/submit-assessment.js": { "maxDuration": 30 },
    "api/get-report.js":        { "maxDuration": 10 }
  }
}

Do not break existing static file serving.
```

---

## CURSOR PROMPT 8 - Add CTAs to existing pages

```
Add "Take Assessment" CTAs to the following existing pages. 
Make minimal edits - add only the CTA elements, do not change anything else.

1. index.html - hero section
Find the primary hero CTA button (the "Book Free Diagnosis" button or equivalent).
Add below it, as a secondary action:
<a href="/assessment.html" class="assessment-cta-link">
  Or take the free 7-minute AI Operating Intelligence Diagnostic →
</a>

Add this style to the inline styles or ask me to add it to css/site.css:
.assessment-cta-link {
  display: block;
  text-align: center;
  margin-top: 14px;
  font-size: 14px;
  color: rgba(255,255,255,0.55);
  text-decoration: none;
  letter-spacing: 0.01em;
}
.assessment-cta-link:hover { color: #C9A84C; }

2. pricing.html - below each stage card
After the Stage 0 "Book Free Diagnosis" description, add:
<p style="margin-top:12px; font-size:13px;">
  Not sure which stage you are ready for? 
  <a href="/assessment.html" style="color:#C9A84C; text-decoration:none;">Take the free 7-minute diagnostic →</a>
</p>

3. how-it-works.html - after the SLOPE section
Add a banner before the final CTA section:
<div class="assessment-banner">
  <p>See where your organisation stands across all five SLOPE dimensions.</p>
  <a href="/assessment.html" class="btn-assessment">Take the free AI Diagnostic →</a>
</div>

Add to css/how-it-works.css (or inline):
.assessment-banner { background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.2); border-radius:10px; padding:24px; text-align:center; margin:32px 0; }
.assessment-banner p { color: rgba(255,255,255,0.7); margin-bottom:14px; }
.btn-assessment { display:inline-block; background:#C9A84C; color:#0F0F13; font-weight:600; padding:11px 24px; border-radius:8px; text-decoration:none; font-size:14px; }

4. Update sitemap.xml
Add this entry:
<url>
  <loc>https://www.kautilyan.com/assessment.html</loc>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>

5. Update nav.js
Add "Free Diagnostic" as a nav item linking to /assessment.html.
Place it between the existing Resources and About items.
Label: "Free Diagnostic" with a subtle indicator (a small dot or asterisk) to signal it is a free offer.
```

---

## TESTING CHECKLIST

Run through this after all prompts complete:

- [ ] assessment.html loads cleanly - nav and footer match other pages
- [ ] "Start Diagnostic" button shows View 2
- [ ] All 12 questions render with correct text (spot-check Q1, Q7, Q12)
- [ ] Option A/B/C/D keyboard shortcuts work
- [ ] Progress bar advances correctly (8.3% per question)
- [ ] Section transition overlay appears at Q5 and Q9
- [ ] Auto-advance fires after 400ms on click
- [ ] Back button works, previous answer remains selected
- [ ] After Q12, View 3 (lead form) appears
- [ ] Form validation: submit with empty fields shows per-field errors
- [ ] Form validation: invalid email format caught
- [ ] On valid submit: loading state shows on button
- [ ] POST to /api/submit-assessment succeeds (check Vercel function logs)
- [ ] Row appears in Supabase assessment_responses table
- [ ] View 4 (results) renders score card immediately
- [ ] Dimension bars show correct scores (knowledge/process/technology)
- [ ] Correct maturity level label shown
- [ ] Correct patterns displayed as badges
- [ ] Agent readiness meter shows correct step
- [ ] Polling for report narrative starts (check Network tab for GET /api/get-report)
- [ ] When report_generated becomes true: narrative sections populate
- [ ] Email received at test address within 3 minutes
- [ ] "Copy link" button copies the URL
- [ ] "Retake" clears state and shows View 1
- [ ] Resume banner appears if returning to assessment.html mid-completion
- [ ] Mobile layout at 375px: single-column pain cards, full-width option buttons
- [ ] index.html CTA link visible and routes to assessment.html
- [ ] pricing.html diagnostic link visible
- [ ] how-it-works.html assessment banner visible

---

## SCORING SELF-TEST (verify scoring engine before building UI)

Open browser console on assessment.html and run:

```javascript
// Test 1: All A = Level 1
console.log(scoreAssessment({q1:1,q2:1,q3:1,q4:1,q5:1,q6:1,q7:1,q8:1,q9:1,q10:1,q11:1,q12:1}));
// Expected: totalScore=12, maturityLevel.level=1

// Test 2: All D = Level 5
console.log(scoreAssessment({q1:4,q2:4,q3:4,q4:4,q5:4,q6:4,q7:4,q8:4,q9:4,q10:4,q11:4,q12:4}));
// Expected: totalScore=48, maturityLevel.level=5

// Test 3: Level 4 gate failure (score 38 but q7=2, q10=2, q11=2)
console.log(scoreAssessment({q1:4,q2:4,q3:4,q4:4,q5:4,q6:4,q7:2,q8:4,q9:4,q10:2,q11:2,q12:4}));
// Expected: totalScore=38 BUT maturityLevel.level=3 (gated down)

// Test 4: Shadow AI pattern
console.log(scoreAssessment({q1:2,q2:2,q3:2,q4:2,q5:2,q6:2,q7:2,q8:2,q9:2,q10:1,q11:2,q12:2}));
// Expected: patterns includes shadow_ai
```
