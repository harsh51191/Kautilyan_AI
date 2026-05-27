(function () {
  'use strict';

  // ── 1. CONSTANTS ─────────────────────────────────────────────────────────────

  /** Client-facing scale (internal scoring still uses raw 12–48). */
  const SCORE_RAW_MAX = 48;
  const SCORE_DISPLAY_MAX = 50;
  const DIM_RAW_MAX = 16;
  const DIM_DISPLAY_MAX = { knowledge: 17, process: 16, technology: 17 };

  function scaleToDisplay(raw, rawMax, displayMax) {
    const n = Number(raw);
    if (!Number.isFinite(n) || !rawMax) return 0;
    return Math.min(displayMax, Math.round((n / rawMax) * displayMax));
  }

  function buildDisplayScores(scoringResult) {
    const dims = scoringResult.dimensions || {};
    return {
      total: scaleToDisplay(scoringResult.totalScore, SCORE_RAW_MAX, SCORE_DISPLAY_MAX),
      maxTotal: SCORE_DISPLAY_MAX,
      knowledge: scaleToDisplay(dims.knowledge, DIM_RAW_MAX, DIM_DISPLAY_MAX.knowledge),
      process: scaleToDisplay(dims.process, DIM_RAW_MAX, DIM_DISPLAY_MAX.process),
      technology: scaleToDisplay(dims.technology, DIM_RAW_MAX, DIM_DISPLAY_MAX.technology),
      dimMax: DIM_DISPLAY_MAX,
    };
  }

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
        { value: 1, label: 'A', text: 'Verbally, in meetings, or on WhatsApp — rarely documented' },
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
        { value: 1, label: 'A', text: 'No — approvals are mostly verbal or informal' },
        { value: 2, label: 'B', text: 'Partially — approvals are traceable but reasoning is usually missing' },
        { value: 3, label: 'C', text: 'Mostly — approvals are logged, but context and outcomes are incomplete' },
        { value: 4, label: 'D', text: 'Yes — approvals are governed, contextual, auditable, and linked to outcomes' },
      ],
    },
    {
      id: 'q8', section: 'process', sectionLabel: 'Process & Execution', sectionNum: 2,
      question: 'When important business signals change — customer risk, delivery delay, revenue leakage, SLA breach — how does the organisation respond?',
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
        { value: 1, label: 'A', text: 'No — systems operate independently' },
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

  const EMPLOYEE_OPTIONS = ['1–10', '11–30', '31–100', '101–300', '301–500', '500+'];

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

  const SECTION_INTROS = {
    2: {
      name: 'Process & Execution',
      description: 'How work moves — recurring workflows, exceptions, approvals, and how your organisation responds to signals.',
    },
    3: {
      name: 'Technology, AI & Agent Readiness',
      description: 'How AI is used today, whether context flows across systems, and what level of responsibility AI can safely take.',
    },
  };

  const DIMENSION_LABELS = {
    knowledge: 'Knowledge & Context',
    process: 'Process & Execution',
    technology: 'Technology & AI',
  };

  const DIMENSION_INFO = {
    knowledge: {
      max: 17,
      questions: 'Questions 1–4',
      topics: 'knowledge retention, onboarding context, leadership visibility, and decision capture',
    },
    process: {
      max: 16,
      questions: 'Questions 5–8',
      topics: 'recurring workflows, exception handling, approval traceability, and signal response',
    },
    technology: {
      max: 17,
      questions: 'Questions 9–12',
      topics: 'AI usage, output reuse, system connectivity, and safe AI responsibility',
    },
  };

  const MATURITY_PLAIN = {
    1: 'Most work still depends on people, meetings, and memory. AI and automation should wait until operating context is visible and documented.',
    2: 'Individuals may be using AI, but the organisation is not capturing or reusing that value. Governance and shared workflows come before scaling agents.',
    3: 'You have approved tools and some structure, but processes and decision memory have not caught up. Focus on governed workflows and capture — not more software.',
    4: 'Recurring workflows, approvals, and visibility are strengthening. The next step is embedding context and audit trails into daily operations.',
    5: 'You have strong foundations for governed agents. Scale carefully so governance, ownership, and institutional memory keep pace with capability.',
  };

  const AGENT_TAGLINES = {
    Low: 'Build visibility and governance before any agent deployment.',
    Emerging: 'Copilots and structured briefs — avoid autonomous execution for now.',
    Medium: 'Human-in-the-loop agents on one recurring workflow.',
    High: 'Governed multi-system agents with approvals and audit trails.',
  };

  const AGENT_STEPS = ['Low', 'Emerging', 'Medium', 'High'];

  const VIEW_IDS = ['view-landing', 'view-questions', 'view-lead-form', 'view-results'];

  const STORAGE_KEYS = {
    answers: 'kautilyan_answers',
    lead: 'kautilyan_lead',
    score: 'kautilyan_score',
    reportId: 'kautilyan_report_id',
  };

  // ── 2. SCORING ENGINE ────────────────────────────────────────────────────────

  function getDimensionScores(a) {
    return {
      knowledge: a.q1 + a.q2 + a.q3 + a.q4,
      process: a.q5 + a.q6 + a.q7 + a.q8,
      technology: a.q9 + a.q10 + a.q11 + a.q12,
    };
  }

  function getAgentReadiness(a) {
    const score = a.q5 + a.q6 + a.q7 + a.q10 + a.q11 + a.q12;
    if (score >= 21) return { score, level: 'High', label: 'Agent-Ready', recommendation: 'Ready to explore governed multi-system agents with approvals, audit trails, and institutional memory.', startWith: ['Governed multi-system agents', 'Approval-routing agents', 'Cross-system context agents'], avoid: ['Uncontrolled agent autonomy', 'Agents without audit trails'] };
    if (score >= 17) return { score, level: 'Medium', label: 'Workflow-Ready', recommendation: 'Start with human-in-the-loop agents for one recurring workflow.', startWith: ['Human-in-the-loop workflow agents', 'Leadership intelligence brief', 'Exception triage agent'], avoid: ['Fully autonomous agents', 'Multi-system execution without approvals'] };
    if (score >= 11) return { score, level: 'Emerging', label: 'Copilot-Ready', recommendation: 'Start with copilots and structured briefs. Avoid autonomous execution.', startWith: ['AI copilots', 'Structured briefing tools', 'Draft-and-review workflows'], avoid: ['Autonomous agents', 'Agents that update records without human review'] };
    return { score, level: 'Low', label: 'Foundation-First', recommendation: 'Do not start with agents. Start with process visibility, decision capture, and AI usage governance.', startWith: ['Process documentation', 'Decision logging', 'AI governance baseline'], avoid: ['Any agent deployment', 'Shared AI tools without governance'] };
  }

  function getMaturityLevel(a, d, total) {
    const LEVELS = {
      1: { label: 'Manual Operating Reality', description: 'Work depends heavily on people, meetings, memory, and manual coordination.' },
      2: { label: 'Shadow AI Usage', description: 'AI may exist individually, but value is not captured organisationally.' },
      3: { label: 'Governed Tool Adoption', description: 'Approved tools and some systems exist, but AI is still mostly individual productivity.' },
      4: { label: 'Workflow Intelligence', description: 'AI and automation support recurring workflows, approvals, and visibility.' },
      5: { label: 'Agentic Operating Layer', description: 'Governed agents, context flow, decision memory, and institutional learning are emerging.' },
    };
    let raw = total <= 18 ? 1 : total <= 25 ? 2 : total <= 33 ? 3 : total <= 41 ? 4 : 5;
    if (raw >= 4 && !(d.process >= 11 && a.q7 >= 3 && a.q10 >= 3 && a.q11 >= 3)) raw = 3;
    if (raw >= 5 && !(d.knowledge >= 13 && d.process >= 13 && d.technology >= 13 && a.q4 === 4 && a.q7 === 4 && a.q11 >= 3 && a.q12 >= 3)) raw = 4;
    return { level: raw, ...LEVELS[raw] };
  }

  const PATTERN_RULES = [
    { id: 'shadow_ai', label: 'Shadow AI', description: 'People use AI individually, but outputs are not captured or reused by the organisation.', detect: function (a, d) { return a.q9 >= 2 && a.q10 <= 2; } },
    { id: 'tool_heavy_process_light', label: 'Tool-heavy, Process-light', description: 'Strong tool adoption, but recurring workflows, approvals, and decisions are still manual.', detect: function (a, d) { return d.technology >= 11 && d.process <= 9; } },
    { id: 'dashboard_rich_decision_poor', label: 'Dashboard-rich, Decision-poor', description: 'Visibility exists across systems, but decision reasoning is not captured for future use.', detect: function (a, d) { return a.q3 >= 3 && a.q4 <= 2; } },
    { id: 'founder_dependent', label: 'Founder-dependent', description: 'Execution depends too heavily on senior people — creating a single point of failure.', detect: function (a, d) { return a.q1 <= 2 && a.q3 <= 2 && a.q6 <= 2; } },
    { id: 'approval_risk', label: 'Approval-risk', description: 'Approvals lack context, reasoning, or auditability — creating compliance and quality risk.', detect: function (a, d) { return a.q7 <= 2; } },
    { id: 'system_fragmented', label: 'System-fragmented', description: 'Context breaks as work moves across tools — creating repeated reconstruction effort.', detect: function (a, d) { return a.q11 <= 2; } },
    { id: 'ai_value_leakage', label: 'AI Value Leakage', description: 'AI creates individual value, but that value is not captured or reused at an organisational level.', detect: function (a, d) { return a.q9 >= 3 && a.q10 <= 2; } },
    { id: 'agent_ready', label: 'Agent-ready', description: 'Strong candidate for governed agent workflows across recurring processes.', detect: function (a, d) { return a.q5 >= 3 && a.q7 >= 3 && a.q11 >= 3 && a.q12 >= 3; } },
    { id: 'agent_fragile', label: 'Agent-fragile', description: 'AI ambition is present, but governance or system integration is too weak for safe agent deployment.', detect: function (a, d) { return a.q9 >= 3 && (a.q7 <= 2 || a.q11 <= 2); } },
  ];

  function getPatterns(a, d) {
    return PATTERN_RULES.filter(function (p) { return p.detect(a, d); }).map(function (p) {
      return { id: p.id, label: p.label, description: p.description };
    });
  }

  function getRecommendedCTA(level) {
    const ctas = {
      1: { headline: 'Book a free AI Operating Awareness Session', body: 'Identify where AI can reduce manual coordination, knowledge dependency, and repeated follow-ups.', buttonText: 'Book Free Awareness Session' },
      2: { headline: 'Book a free Shadow AI Risk & Opportunity Review', body: 'Understand where AI is already being used, where value is leaking, and what should be governed first.', buttonText: 'Book Free Shadow AI Review' },
      3: { headline: 'Book a free 45-minute Operating Reality Diagnosis', body: 'Map where your tools, teams, and workflows are losing context — and identify the highest-leverage first workflow.', buttonText: 'Book Free Diagnosis' },
      4: { headline: 'Start Stage 1: Operating Reality Blueprint', body: 'We map your workflows, decision points, systems, and first 90-day implementation path.', buttonText: 'Request Blueprint Scope' },
      5: { headline: 'Book a Kautilyan Strategy Call', body: 'Explore how to scale governed agents, institutional memory, and operating intelligence across your teams.', buttonText: 'Book Strategy Call' },
    };
    return ctas[level] || ctas[3];
  }

  function getPrimaryConstraint(d) {
    const min = Math.min(d.knowledge, d.process, d.technology);
    if (d.knowledge === min) return 'Knowledge capture and context retention';
    if (d.process === min) return 'Process structure and decision memory';
    return 'System connectivity and AI governance';
  }

  function scoreAssessment(answers) {
    const total = Object.values(answers).reduce(function (s, v) { return s + v; }, 0);
    const dimensions = getDimensionScores(answers);
    const agentReadiness = getAgentReadiness(answers);
    const maturityLevel = getMaturityLevel(answers, dimensions, total);
    const patterns = getPatterns(answers, dimensions);
    const primaryPattern = patterns.find(function (p) { return p.id !== 'agent_ready'; }) || patterns[0] || null;
    const primaryConstraint = getPrimaryConstraint(dimensions);
    const cta = getRecommendedCTA(maturityLevel.level);
    const dimEntries = [['knowledge', dimensions.knowledge], ['process', dimensions.process], ['technology', dimensions.technology]].sort(function (a, b) { return b[1] - a[1]; });
    const scoring = {
      totalScore: total,
      dimensions: dimensions,
      maturityLevel: maturityLevel,
      patterns: patterns,
      primaryPattern: primaryPattern,
      primaryConstraint: primaryConstraint,
      agentReadiness: agentReadiness,
      recommendedCTA: cta,
      strongestDimension: dimEntries[0][0],
      weakestDimension: dimEntries[2][0],
    };
    scoring.displayScores = buildDisplayScores(scoring);
    return scoring;
  }

  // ── 3. STATE ─────────────────────────────────────────────────────────────────

  const state = {
    answers: {},
    currentQuestion: 0,
    leadData: {},
    scoringResult: null,
    reportId: null,
  };

  let advancing = false;
  let sectionTransitionActive = false;
  let pollTimer = null;

  (function restoreAnswers() {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEYS.answers);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') state.answers = parsed;
      }
    } catch (e) { /* ignore */ }
  })();

  // ── Helpers ───────────────────────────────────────────────────────────────────

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatDate(d) {
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function countAnswers() {
    return Object.keys(state.answers).length;
  }

  function getResumeIndex() {
    for (let i = 0; i < QUESTIONS.length; i++) {
      if (state.answers[QUESTIONS[i].id] == null) return i;
    }
    return QUESTIONS.length - 1;
  }

  function saveAnswers() {
    sessionStorage.setItem(STORAGE_KEYS.answers, JSON.stringify(state.answers));
  }

  function saveSession() {
    sessionStorage.setItem(STORAGE_KEYS.answers, JSON.stringify(state.answers));
    sessionStorage.setItem(STORAGE_KEYS.lead, JSON.stringify(state.leadData));
    if (state.scoringResult) sessionStorage.setItem(STORAGE_KEYS.score, JSON.stringify(state.scoringResult));
    if (state.reportId) sessionStorage.setItem(STORAGE_KEYS.reportId, state.reportId);
  }

  function clearSession() {
    Object.keys(STORAGE_KEYS).forEach(function (key) {
      sessionStorage.removeItem(STORAGE_KEYS[key]);
    });
  }

  function resetState() {
    state.answers = {};
    state.currentQuestion = 0;
    state.leadData = {};
    state.scoringResult = null;
    state.reportId = null;
    advancing = false;
    sectionTransitionActive = false;
    if (pollTimer) {
      clearTimeout(pollTimer);
      pollTimer = null;
    }
  }

  function isQuestionsViewActive() {
    const view = $('view-questions');
    return view && view.classList.contains('active');
  }

  // ── 4. VIEW CONTROLLER ───────────────────────────────────────────────────────

  function showView(viewId) {
    VIEW_IDS.forEach(function (id) {
      const el = $(id);
      if (el) el.classList.toggle('active', id === viewId);
    });
    document.body.classList.toggle('assessment-questions-active', viewId === 'view-questions');
  }

  // ── 7. SECTION TRANSITION ───────────────────────────────────────────────────

  function showSectionTransition(sectionNum, onComplete) {
    const intro = SECTION_INTROS[sectionNum];
    const overlay = $('section-transition');
    if (!intro || !overlay) {
      if (onComplete) onComplete();
      return;
    }
    const nameEl = $('transition-section-name');
    const descEl = $('transition-section-desc');
    if (nameEl) nameEl.textContent = intro.name;
    if (descEl) descEl.textContent = intro.description;
    overlay.classList.add('is-visible');
    overlay.setAttribute('aria-hidden', 'false');
    sectionTransitionActive = true;
    setTimeout(function () {
      overlay.classList.remove('is-visible');
      overlay.setAttribute('aria-hidden', 'true');
      sectionTransitionActive = false;
      if (onComplete) onComplete();
    }, 1500);
  }

  // ── 5. QUESTION RENDERER ─────────────────────────────────────────────────────

  function updateSectionDots(sectionNum) {
    for (let n = 1; n <= 3; n++) {
      const dot = $('section-dot-' + n);
      if (!dot) continue;
      dot.classList.remove('active', 'complete');
      if (n < sectionNum) dot.classList.add('complete');
      else if (n === sectionNum) dot.classList.add('active');
    }
  }

  function highlightOption(questionId, value) {
    const q = QUESTIONS[state.currentQuestion];
    if (!q || q.id !== questionId) return;
    const letters = ['A', 'B', 'C', 'D'];
    letters.forEach(function (letter, idx) {
      const btn = $('option-' + letter);
      if (!btn) return;
      const opt = q.options[idx];
      btn.classList.toggle('selected', opt && opt.value === value);
      btn.disabled = advancing;
    });
  }

  function renderQuestion(index) {
    const q = QUESTIONS[index];
    if (!q) return;

    state.currentQuestion = index;
    advancing = false;

    const numEl = $('question-number');
    const textEl = $('question-text');
    const sectionEl = $('section-label');
    const counterEl = $('question-counter');
    const progressEl = $('progress-bar-fill');
    const backBtn = $('btn-back');

    if (numEl) numEl.textContent = 'Question ' + (index + 1) + ' of 12';
    if (textEl) textEl.textContent = q.question;
    if (sectionEl) sectionEl.textContent = q.sectionLabel;
    if (counterEl) counterEl.textContent = (index + 1) + ' / 12';
    if (progressEl) progressEl.style.width = (((index + 1) / 12) * 100) + '%';
    if (backBtn) backBtn.style.display = index > 0 ? '' : 'none';

    updateSectionDots(q.sectionNum);

    const letters = ['A', 'B', 'C', 'D'];
    const currentAnswer = state.answers[q.id];

    letters.forEach(function (letter, idx) {
      const btn = $('option-' + letter);
      const textSpan = $('option-' + letter + '-text');
      const opt = q.options[idx];
      if (textSpan && opt) textSpan.textContent = opt.text;
      if (btn) {
        btn.classList.toggle('selected', currentAnswer === opt.value);
        btn.disabled = false;
        btn.onclick = function () {
          if (advancing || sectionTransitionActive) return;
          setAnswer(q.id, opt.value);
        };
      }
    });
  }

  function setAnswer(questionId, value) {
    if (advancing || sectionTransitionActive) return;
    advancing = true;
    state.answers[questionId] = value;
    saveAnswers();
    highlightOption(questionId, value);

    const letters = ['A', 'B', 'C', 'D'];
    letters.forEach(function (letter) {
      const btn = $('option-' + letter);
      if (btn) btn.disabled = true;
    });

    setTimeout(advanceQuestion, 400);
  }

  function advanceQuestion() {
    const current = state.currentQuestion;

    if (current >= 11) {
      advancing = false;
      showView('view-lead-form');
      return;
    }

    const next = current + 1;

    function goNext() {
      state.currentQuestion = next;
      advancing = false;
      renderQuestion(next);
    }

    if (current === 3 || current === 7) {
      const sectionNum = QUESTIONS[next].sectionNum;
      showSectionTransition(sectionNum, goNext);
    } else {
      goNext();
    }
  }

  function goToPreviousQuestion() {
    if (state.currentQuestion <= 0 || advancing || sectionTransitionActive) return;
    state.currentQuestion -= 1;
    renderQuestion(state.currentQuestion);
  }

  function selectOption(optionIndex) {
    if (!isQuestionsViewActive() || advancing || sectionTransitionActive) return;
    const q = QUESTIONS[state.currentQuestion];
    if (!q) return;
    const opt = q.options[optionIndex];
    if (opt) setAnswer(q.id, opt.value);
  }

  // ── 6. KEYBOARD HANDLER ──────────────────────────────────────────────────────

  document.addEventListener('keydown', function (e) {
    if (!isQuestionsViewActive() || sectionTransitionActive) return;

    const key = e.key;
    if (key === 'a' || key === 'A') { e.preventDefault(); selectOption(0); }
    else if (key === 'b' || key === 'B') { e.preventDefault(); selectOption(1); }
    else if (key === 'c' || key === 'C') { e.preventDefault(); selectOption(2); }
    else if (key === 'd' || key === 'D') { e.preventDefault(); selectOption(3); }
    else if (key === 'Backspace' || key === 'ArrowLeft') {
      e.preventDefault();
      goToPreviousQuestion();
    }
  });

  // ── 8. LEAD FORM HANDLER ─────────────────────────────────────────────────────

  function populateSelect(name, options, placeholder) {
    const select = document.querySelector('#lead-form [name="' + name + '"]');
    if (!select) return;
    select.innerHTML = '';
    const empty = document.createElement('option');
    empty.value = '';
    empty.textContent = placeholder || 'Select…';
    select.appendChild(empty);
    options.forEach(function (opt) {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      select.appendChild(option);
    });
  }

  function showFieldError(name, message) {
    const field = document.querySelector('#lead-form [name="' + name + '"]');
    const err = field && field.closest('.form-field, .field-group, .cr-field, p, div')
      ? field.parentElement.querySelector('.field-error')
      : null;
    const errorEl = err || document.querySelector('.field-error[data-for="' + name + '"]');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = !message;
      errorEl.style.display = message ? '' : 'none';
    }
    if (field) field.classList.toggle('has-error', !!message);
  }

  function clearFieldErrors() {
    document.querySelectorAll('#lead-form .field-error').forEach(function (el) {
      el.textContent = '';
      el.hidden = true;
      el.style.display = 'none';
    });
    document.querySelectorAll('#lead-form .has-error').forEach(function (el) {
      el.classList.remove('has-error');
    });
  }

  function validateLeadForm() {
    clearFieldErrors();
    let valid = true;
    const form = $('lead-form');
    if (!form) return false;

    const name = (form.querySelector('[name="respondent_name"]') || {}).value || '';
    const email = (form.querySelector('[name="work_email"]') || {}).value || '';
    const company = (form.querySelector('[name="company_name"]') || {}).value || '';
    const role = (form.querySelector('[name="role"]') || {}).value || '';
    const employees = (form.querySelector('[name="employee_count"]') || {}).value || '';
    const industry = (form.querySelector('[name="industry"]') || {}).value || '';
    const challenge = (form.querySelector('[name="biggest_challenge"]') || {}).value || '';

    if (!name.trim()) { showFieldError('respondent_name', 'Please enter your name.'); valid = false; }
    if (!email.trim() || email.indexOf('@') < 1) { showFieldError('work_email', 'Please enter a valid work email.'); valid = false; }
    if (!company.trim()) { showFieldError('company_name', 'Please enter your company name.'); valid = false; }
    if (!role) { showFieldError('role', 'Please select your role.'); valid = false; }
    if (!employees) { showFieldError('employee_count', 'Please select team size.'); valid = false; }
    if (!industry.trim()) { showFieldError('industry', 'Please enter your industry.'); valid = false; }
    if (!challenge) { showFieldError('biggest_challenge', 'Please select your biggest challenge.'); valid = false; }

    return valid;
  }

  function collectLeadData() {
    const form = $('lead-form');
    if (!form) return {};
    const website = (form.querySelector('[name="company_website"]') || {}).value || '';
    return {
      respondent_name: (form.querySelector('[name="respondent_name"]') || {}).value.trim(),
      work_email: (form.querySelector('[name="work_email"]') || {}).value.trim(),
      company_name: (form.querySelector('[name="company_name"]') || {}).value.trim(),
      company_website: website.trim(),
      role: (form.querySelector('[name="role"]') || {}).value,
      employee_count: (form.querySelector('[name="employee_count"]') || {}).value,
      industry: (form.querySelector('[name="industry"]') || {}).value.trim(),
      biggest_challenge: (form.querySelector('[name="biggest_challenge"]') || {}).value,
    };
  }

  function setupLeadForm() {
    populateSelect('role', ROLE_OPTIONS, 'Your role');
    populateSelect('employee_count', EMPLOYEE_OPTIONS, 'Team size');
    populateSelect('biggest_challenge', CHALLENGE_OPTIONS, 'Biggest operating challenge');

    const form = $('lead-form');
    if (!form || form.dataset.bound === 'true') return;
    form.dataset.bound = 'true';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateLeadForm()) return;
      state.leadData = collectLeadData();
      submitAssessment();
    });
  }

  // ── 9. SUBMIT FUNCTION ───────────────────────────────────────────────────────

  async function submitAssessment() {
    const btn = $('btn-submit');
    const formError = $('lead-form-error');
    const defaultBtnText = btn ? btn.textContent : '';

    state.scoringResult = scoreAssessment(state.answers);
    saveSession();

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Generating your report...';
    }
    if (formError) {
      formError.hidden = true;
      formError.textContent = '';
    }

    try {
      const res = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: state.answers,
          leadData: state.leadData,
          scoringResult: state.scoringResult,
        }),
      });

      const data = await res.json().catch(function () { return {}; });

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || 'Submission failed. Please try again.');
      }

      state.reportId = data.responseId;
      saveSession();
      showView('view-results');
      renderResults();
    } catch (err) {
      if (formError) {
        formError.textContent = err.message || 'Something went wrong. Please try again.';
        formError.hidden = false;
      } else if (typeof showToast === 'function') {
        showToast(err.message || 'Submission failed.', 'error');
      }
      if (btn) {
        btn.disabled = false;
        btn.textContent = defaultBtnText;
      }
    }
  }

  // ── 10. RESULTS RENDERER ─────────────────────────────────────────────────────

  function formatNarrativeHtml(text) {
    if (!text) return '';
    const parts = String(text)
      .split(/\n{2,}/)
      .map(function (p) { return p.trim(); })
      .filter(Boolean);
    if (parts.length <= 1) {
      return '<p>' + escapeHtml(String(text).trim()) + '</p>';
    }
    return parts.map(function (p) {
      return '<p>' + escapeHtml(p) + '</p>';
    }).join('');
  }

  function renderMaturityExplainer(ml) {
    const el = $('result-maturity-explainer');
    if (!el || !ml) return;
    const plain = MATURITY_PLAIN[ml.level] || MATURITY_PLAIN[3];
    el.hidden = false;
    el.innerHTML =
      '<h3 class="maturity-explainer-title">Your maturity level</h3>' +
      '<p class="maturity-explainer-level"><span class="text-gradient-accent">Level ' + ml.level + '</span> — ' + escapeHtml(ml.label) + '</p>' +
      '<p class="maturity-explainer-official">' + escapeHtml(ml.description) + '</p>' +
      '<p class="maturity-explainer-plain"><strong>In plain terms:</strong> ' + escapeHtml(plain) + '</p>';
  }

  function renderDimensionsExplainerList(display) {
    const list = $('dimensions-explainer-list');
    if (!list || !display) return;
    list.innerHTML = ['knowledge', 'process', 'technology'].map(function (key) {
      const info = DIMENSION_INFO[key];
      const score = display[key];
      const max = display.dimMax[key];
      return (
        '<li class="dimensions-explainer-item">' +
        '<span class="dimensions-explainer-dim">' + escapeHtml(DIMENSION_LABELS[key]) + '</span>' +
        '<span class="dimensions-explainer-score">' + score + ' / ' + max + '</span>' +
        '<span class="dimensions-explainer-detail">' + escapeHtml(info.questions) + ' — ' + escapeHtml(info.topics) + '.</span>' +
        '</li>'
      );
    }).join('');
  }

  function buildLevelUpShell(result) {
    const ml = result.maturityLevel;
    const plain = MATURITY_PLAIN[ml.level] || MATURITY_PLAIN[3];
    const weakest = DIMENSION_LABELS[result.weakestDimension] || 'Process & Execution';
    const strongest = DIMENSION_LABELS[result.strongestDimension] || 'Knowledge & Context';
    return (
      '<div class="level-up-static">' +
      '<div class="level-up-level-card">' +
      '<p class="level-up-level-heading"><span class="text-gradient-accent">Level ' + ml.level + '</span> — ' + escapeHtml(ml.label) + '</p>' +
      '<p class="level-up-level-official">' + escapeHtml(ml.description) + '</p>' +
      '<p class="level-up-plain"><strong>What this means:</strong> ' + escapeHtml(plain) + '</p>' +
      '</div>' +
      '<ul class="level-up-signals">' +
      '<li><strong>Strongest area:</strong> ' + escapeHtml(strongest) + '</li>' +
      '<li><strong>Biggest gap:</strong> ' + escapeHtml(weakest) + ' — improving here unlocks the next level.</li>' +
      '<li><strong>Primary constraint:</strong> ' + escapeHtml(result.primaryConstraint) + '</li>' +
      '</ul>' +
      '<div class="level-up-narrative-slot" id="level-up-narrative-slot"></div>' +
      '</div>'
    );
  }

  function renderDimensionBar(key, score, max) {
    const scoreEl = $('dim-' + key + '-score');
    const barEl = $('dim-' + key + '-bar');
    if (scoreEl) scoreEl.textContent = score + ' / ' + max;
    if (barEl) barEl.style.width = Math.round((score / max) * 100) + '%';
  }

  function renderPatterns(patterns) {
    const container = $('result-patterns-container');
    if (!container) return;
    if (!patterns.length) {
      container.innerHTML = '<span class="pattern-badge pattern-none">No dominant patterns detected</span>';
      return;
    }
    container.innerHTML = patterns.map(function (p) {
      return '<span class="pattern-badge pattern-' + escapeHtml(p.id) + '" title="' + escapeHtml(p.description) + '">' + escapeHtml(p.label) + '</span>';
    }).join('');
  }

  function renderAgentMeter(agentReadiness) {
    const meter = $('agent-readiness-meter');
    if (!meter) return;
    const activeIdx = AGENT_STEPS.indexOf(agentReadiness.level);
    meter.innerHTML = AGENT_STEPS.map(function (step, idx) {
      const cls = idx === activeIdx ? 'agent-step active' : idx < activeIdx ? 'agent-step complete' : 'agent-step';
      return '<div class="' + cls + '"><span class="agent-step-label">' + escapeHtml(step) + '</span></div>';
    }).join('');

    const labelEl = $('agent-readiness-level-label');
    if (labelEl) {
      const tagline = AGENT_TAGLINES[agentReadiness.level] || agentReadiness.recommendation;
      labelEl.innerHTML =
        '<span class="text-gradient-accent agent-readiness-label">' + escapeHtml(agentReadiness.label) + '</span>' +
        '<span class="agent-readiness-tagline">' + escapeHtml(tagline) + '</span>';
    }

    const startEl = $('agent-start-with');
    if (startEl) {
      startEl.innerHTML = (agentReadiness.startWith || []).map(function (item) {
        return '<li>' + escapeHtml(item) + '</li>';
      }).join('');
    }

    const avoidEl = $('agent-avoid');
    if (avoidEl) {
      avoidEl.innerHTML = (agentReadiness.avoid || []).map(function (item) {
        return '<li>' + escapeHtml(item) + '</li>';
      }).join('');
    }
  }

  function renderCtaBlock(cta, containerId) {
    const el = $(containerId);
    if (!el || !cta) return;
    const calLink =
      (window.CONFIG && (window.CONFIG.CAL_LINK || '').trim()) ||
      'https://cal.com/kautilyan/stage-0-diagnosis';
    el.innerHTML =
      '<h3 class="cta-headline">' + escapeHtml(cta.headline) + '</h3>' +
      '<p class="cta-body">' + escapeHtml(cta.body) + '</p>' +
      '<a href="' + escapeHtml(calLink) + '" class="btn btn-primary cta-button" target="_blank" rel="noopener">' + escapeHtml(cta.buttonText) + ' →</a>';
  }

  function renderStaticResults() {
    const result = state.scoringResult;
    const lead = state.leadData;
    if (!result) return;

    const ml = result.maturityLevel;
    const dims = result.dimensions;
    const ar = result.agentReadiness;

    const companyEl = $('result-company-name');
    const respondentEl = $('result-respondent');
    const dateEl = $('result-date');
    const scoreEl = $('result-total-score');
    const badgeEl = $('result-level-badge');
    const constraintEl = $('result-primary-constraint');

    if (companyEl) companyEl.textContent = lead.company_name || 'Your organisation';
    if (respondentEl) respondentEl.textContent = lead.respondent_name ? 'Prepared for ' + lead.respondent_name : '';
    if (dateEl) dateEl.textContent = formatDate(new Date());
    const display = result.displayScores || buildDisplayScores(result);
    if (scoreEl) scoreEl.textContent = display.total + ' / ' + display.maxTotal;
    if (badgeEl) {
      badgeEl.textContent = 'Level ' + ml.level + ' — ' + ml.label;
      badgeEl.className = 'result-level-badge level-' + ml.level;
      badgeEl.title = ml.description;
    }
    if (constraintEl) {
      constraintEl.innerHTML =
        '<strong>Primary constraint:</strong> ' + escapeHtml(result.primaryConstraint) +
        '<span class="constraint-hint"> — your lowest-scoring area drives this.</span>';
    }

    renderMaturityExplainer(ml);
    renderDimensionsExplainerList(display);

    renderDimensionBar('knowledge', display.knowledge, display.dimMax.knowledge);
    renderDimensionBar('process', display.process, display.dimMax.process);
    renderDimensionBar('technology', display.technology, display.dimMax.technology);

    const dimLabels = document.querySelectorAll('[data-dim-label]');
    dimLabels.forEach(function (el) {
      const key = el.getAttribute('data-dim-label');
      if (key && DIMENSION_LABELS[key]) el.textContent = DIMENSION_LABELS[key];
    });

    renderPatterns(result.patterns);
    renderAgentMeter(ar);
    renderCtaBlock(result.recommendedCTA, 'result-cta-block');
    renderCtaBlock(result.recommendedCTA, 'result-final-cta');

    const levelUpEl = $('content-level-up');
    if (levelUpEl) levelUpEl.innerHTML = buildLevelUpShell(result);

    const narrativeSections = [
      'section-executive-summary',
      'section-where-you-are',
      'section-cost-analysis',
      'section-agent-readiness',
      'section-level-up',
      'section-roadmap',
      'section-kautilyan',
    ];
    narrativeSections.forEach(function (id) {
      const el = $(id);
      if (el) el.hidden = true;
    });

    const loadingEl = $('report-loading');
    if (loadingEl) {
      loadingEl.hidden = false;
      loadingEl.textContent = 'Building your full report...';
    }
  }

  function setNarrativeHtml(id, text) {
    const el = $(id);
    if (el && text) el.innerHTML = formatNarrativeHtml(text);
  }

  function renderNarrative(report) {
    const loadingEl = $('report-loading');
    if (loadingEl) loadingEl.hidden = true;

    if (report.executive_summary) {
      setNarrativeHtml('content-executive-summary', report.executive_summary);
    }
    setNarrativeHtml('content-where-you-are', report.where_you_are);
    setNarrativeHtml('content-agent-narrative', report.agent_readiness_narrative);

    const levelSlot = $('level-up-narrative-slot');
    if (levelSlot && report.level_up_narrative) {
      levelSlot.innerHTML = '<h4 class="level-up-narrative-heading">Personalised guidance</h4>' + formatNarrativeHtml(report.level_up_narrative);
    } else if ($('content-level-up') && report.level_up_narrative) {
      setNarrativeHtml('content-level-up', report.level_up_narrative);
    }

    ['content-roadmap-m1', 'content-roadmap-m2', 'content-roadmap-m3'].forEach(function (id, idx) {
      const el = $(id);
      const key = ['roadmap_month1', 'roadmap_month2', 'roadmap_month3'][idx];
      if (el && report[key]) el.textContent = report[key];
    });
    setNarrativeHtml('content-kautilyan', report.kautilyan_section);

    if (report.cost_analysis) {
      const parts = report.cost_analysis.split('|||');
      const costIds = ['cost-knowledge-drain', 'cost-coordination-tax', 'cost-decision-latency', 'cost-ai-value-leakage'];
      costIds.forEach(function (id, idx) {
        const card = $(id);
        if (card && parts[idx]) {
          const body = card.querySelector('.cost-card-body') || card;
          if (body.classList && body.classList.contains('cost-card-body')) {
            body.textContent = parts[idx].trim();
          } else {
            card.textContent = parts[idx].trim();
          }
        }
      });
    }

    const sectionsToShow = ['section-where-you-are', 'section-cost-analysis', 'section-agent-readiness', 'section-level-up', 'section-roadmap', 'section-kautilyan'];
    if (report.executive_summary) sectionsToShow.unshift('section-executive-summary');
    sectionsToShow.forEach(function (id) {
      const el = $(id);
      if (el) el.hidden = false;
    });
  }

  function showReportTimeoutMessage() {
    const loadingEl = $('report-loading');
    if (loadingEl) {
      loadingEl.hidden = false;
      loadingEl.textContent = 'Your full report has been emailed to you.';
    }
  }

  function pollForReport(attempt) {
    if (!state.reportId) return;

    fetch('/api/get-report?id=' + encodeURIComponent(state.reportId))
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.ready && data.report) {
          renderNarrative(data.report);
          return;
        }
        if (attempt < 15) {
          pollTimer = setTimeout(function () { pollForReport(attempt + 1); }, 4000);
        } else {
          showReportTimeoutMessage();
        }
      })
      .catch(function () {
        if (attempt < 15) {
          pollTimer = setTimeout(function () { pollForReport(attempt + 1); }, 4000);
        } else {
          showReportTimeoutMessage();
        }
      });
  }

  function renderResults() {
    if (pollTimer) {
      clearTimeout(pollTimer);
      pollTimer = null;
    }
    renderStaticResults();
    pollForReport(0);
  }

  function setupResumeBanner() {
    const landing = $('view-landing');
    if (!landing || countAnswers() === 0) return;

    let banner = $('resume-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'resume-banner';
      banner.className = 'resume-banner';
      banner.innerHTML =
        '<p>You have a diagnostic in progress (' + countAnswers() + ' of 12 answered).</p>' +
        '<button type="button" id="btn-resume" class="btn btn-secondary">Resume where you left off →</button>';
      const startBtn = $('btn-start');
      if (startBtn && startBtn.parentNode) {
        startBtn.parentNode.insertBefore(banner, startBtn);
      } else {
        landing.appendChild(banner);
      }
    } else {
      banner.querySelector('p').textContent = 'You have a diagnostic in progress (' + countAnswers() + ' of 12 answered).';
      banner.hidden = false;
    }

    const resumeBtn = $('btn-resume');
    if (resumeBtn && !resumeBtn.dataset.bound) {
      resumeBtn.dataset.bound = 'true';
      resumeBtn.addEventListener('click', function () {
        const idx = getResumeIndex();
        if (countAnswers() >= 12) {
          showView('view-lead-form');
        } else {
          showView('view-questions');
          renderQuestion(idx);
        }
      });
    }
  }

  // ── 11. INIT ─────────────────────────────────────────────────────────────────

  function init() {
    setupLeadForm();
    setupResumeBanner();

    const startBtn = $('btn-start');
    if (startBtn) {
      startBtn.addEventListener('click', function () {
        showView('view-questions');
        renderQuestion(0);
      });
    }

    const backBtn = $('btn-back');
    if (backBtn) {
      backBtn.addEventListener('click', function (e) {
        e.preventDefault();
        goToPreviousQuestion();
      });
    }

    const retakeBtn = $('btn-retake');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        clearSession();
        resetState();
        const form = $('lead-form');
        if (form) form.reset();
        const banner = $('resume-banner');
        if (banner) banner.remove();
        showView('view-landing');
      });
    }

    const copyBtn = $('btn-copy-link');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        const url = state.reportId
          ? window.location.origin + window.location.pathname + '?report=' + state.reportId
          : window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function () {
            if (typeof showToast === 'function') showToast('Link copied.', 'success');
          });
        }
      });
    }

    const params = new URLSearchParams(window.location.search);
    const reportParam = params.get('report');
    if (reportParam) {
      state.reportId = reportParam;
      try {
        const storedScore = sessionStorage.getItem(STORAGE_KEYS.score);
        const storedLead = sessionStorage.getItem(STORAGE_KEYS.lead);
        const storedAnswers = sessionStorage.getItem(STORAGE_KEYS.answers);
        if (storedScore) state.scoringResult = JSON.parse(storedScore);
        if (storedLead) state.leadData = JSON.parse(storedLead);
        if (storedAnswers) state.answers = JSON.parse(storedAnswers);
      } catch (e) { /* ignore */ }
      if (state.scoringResult) {
        showView('view-results');
        renderResults();
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
