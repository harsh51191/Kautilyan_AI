/**
 * POST /api/submit-assessment
 * Stores assessment response in Supabase, generates narrative via Gemini, emails via GAS.
 */
const { createClient } = require('@supabase/supabase-js');

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const QUESTION_IDS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12'];
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
  };
}

const SYSTEM_PROMPT = `You are an expert AI operating strategy analyst writing a personalised diagnostic report for a business leader.

Write in a professional, direct tone. No jargon, no filler phrases. Use British English (organisation, recognised, colour).
Do not use: "transformative", "cutting-edge", "leverage" as a verb, "synergy", "journey".
Write about the organisation in second person (e.g. "Your organisation has...").

Return ONLY a valid JSON object with exactly these keys:
executive_summary, where_you_are, cost_analysis, agent_readiness_narrative, level_up_narrative, roadmap_month1, roadmap_month2, roadmap_month3, kautilyan_section, next_step_narrative

Each value must be a string of 120-250 words (substantive paragraphs, not bullet fragments).
Reference the organisation's scores, maturity level, weakest/strongest dimensions, detected patterns, and agent readiness where relevant.
For cost_analysis: format as four sections separated by the string "|||" in this order:
Knowledge drain|||Coordination tax|||Decision latency|||AI value leakage
Each cost section should be 2-4 sentences tied to their likely situation.

Return no text outside the JSON object. No markdown code fences.`;

function setCors(res) {
  const origin = (process.env.SITE_URL || 'https://www.kautilyan.com').replace(/\/$/, '');
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
}

function json(res, status, body) {
  setCors(res);
  res.status(status).end(JSON.stringify(body));
}

/** Keep audit text bounded for DB / logs */
function truncateAudit(str, maxLen) {
  const s = String(str || '').trim();
  if (!s) return '';
  const n = typeof maxLen === 'number' ? maxLen : 2000;
  if (s.length <= n) return s;
  return s.slice(0, Math.max(0, n - 3)) + '...';
}

function leadName(leadData) {
  return String(leadData?.respondent_name || leadData?.name || '').trim();
}

function leadEmail(leadData) {
  return String(leadData?.work_email || leadData?.email || '').trim();
}

function validatePayload(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid request body' };
  }

  const { answers, leadData, scoringResult } = body;
  if (!answers || typeof answers !== 'object') {
    return { ok: false, error: 'Missing answers' };
  }

  for (let i = 0; i < QUESTION_IDS.length; i++) {
    const id = QUESTION_IDS[i];
    const val = Number(answers[id]);
    if (!Number.isInteger(val) || val < 1 || val > 4) {
      return { ok: false, error: 'Invalid or missing answer: ' + id };
    }
  }

  if (!leadData || typeof leadData !== 'object') {
    return { ok: false, error: 'Missing leadData' };
  }

  const name = leadName(leadData);
  const email = leadEmail(leadData);
  if (!name) return { ok: false, error: 'Missing respondent name' };
  if (!email || email.indexOf('@') < 1) return { ok: false, error: 'Missing valid work email' };

  if (!scoringResult || typeof scoringResult !== 'object') {
    return { ok: false, error: 'Missing scoringResult' };
  }

  return { ok: true, answers, leadData, scoringResult, name, email };
}

function getSupabase() {
  const url = (process.env.SUPABASE_URL || '').trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (!url || !key) {
    throw new Error('Supabase is not configured');
  }
  return createClient(url, key);
}

function primaryPatternString(scoringResult) {
  const p = scoringResult?.primaryPattern;
  if (!p) return '';
  if (typeof p === 'string') return p;
  return p.label || p.id || '';
}

function buildResponseRow(answers, leadData, scoringResult) {
  const dims = scoringResult.dimensions || {};
  const ml = scoringResult.maturityLevel || {};
  const ar = scoringResult.agentReadiness || {};

  return {
    q1: answers.q1,
    q2: answers.q2,
    q3: answers.q3,
    q4: answers.q4,
    q5: answers.q5,
    q6: answers.q6,
    q7: answers.q7,
    q8: answers.q8,
    q9: answers.q9,
    q10: answers.q10,
    q11: answers.q11,
    q12: answers.q12,
    total_score: scoringResult.totalScore,
    knowledge_score: dims.knowledge,
    process_score: dims.process,
    technology_score: dims.technology,
    maturity_level: ml.level,
    maturity_label: ml.label,
    agent_readiness_level: ar.level,
    agent_readiness_score: ar.score,
    primary_pattern: primaryPatternString(scoringResult),
    patterns: scoringResult.patterns || [],
    name: leadName(leadData),
    work_email: leadEmail(leadData),
    company_name: String(leadData.company_name || '').trim(),
    company_website: String(leadData.company_website || '').trim(),
    role: String(leadData.role || 'Not specified').trim(),
    employee_count: String(leadData.employee_count || '').trim(),
    industry: String(leadData.industry || '').trim(),
    biggest_challenge: String(leadData.biggest_challenge || '').trim(),
    report_generated: false,
    report_emailed: false,
  };
}

function stripHtml(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchCompanyResearch(leadData) {
  const name = String(leadData.company_name || '').trim();
  const industry = String(leadData.industry || '').trim();
  let extracted = '';

  const website = String(leadData.company_website || '').trim();
  if (website) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(function () {
        controller.abort();
      }, 5000);

      let url = website;
      if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'KautilyanAssessmentBot/1.0 (+https://www.kautilyan.com)',
          Accept: 'text/html,text/plain',
        },
        redirect: 'follow',
      });
      clearTimeout(timer);

      if (res.ok) {
        const html = await res.text();
        extracted = stripHtml(html).slice(0, 1500);
      }
    } catch (err) {
      console.warn('[submit-assessment] Company website fetch failed:', err.message || err);
    }
  }

  let research = 'Company: ' + (name || 'Unknown') + '. Industry: ' + (industry || 'Not specified') + '.';
  if (extracted) research += ' ' + extracted;
  return research;
}

function buildUserPrompt(answers, leadData, scoringResult, companyResearch) {
  const patterns = (scoringResult.patterns || [])
    .map(function (p) {
      return p.label || p.id;
    })
    .join(', ');

  return (
    'Assessment data:\n' +
    'Company: ' +
    (leadData.company_name || '') +
    '\nRespondent: ' +
    leadName(leadData) +
    ', ' +
    (leadData.role || '') +
    '\nIndustry: ' +
    (leadData.industry || '') +
    '\nTeam size: ' +
    (leadData.employee_count || '') +
    '\nBiggest challenge: ' +
    (leadData.biggest_challenge || '') +
    '\n\nScores:\n' +
    'Total: ' +
    scaleToDisplay(scoringResult.totalScore, SCORE_RAW_MAX, SCORE_DISPLAY_MAX) +
    '/' +
    SCORE_DISPLAY_MAX +
    '\n' +
    'Knowledge & Context: ' +
    scaleToDisplay(scoringResult.dimensions?.knowledge, DIM_RAW_MAX, DIM_DISPLAY_MAX.knowledge) +
    '/' +
    DIM_DISPLAY_MAX.knowledge +
    '\n' +
    'Process & Execution: ' +
    scaleToDisplay(scoringResult.dimensions?.process, DIM_RAW_MAX, DIM_DISPLAY_MAX.process) +
    '/' +
    DIM_DISPLAY_MAX.process +
    '\n' +
    'Technology & AI: ' +
    scaleToDisplay(scoringResult.dimensions?.technology, DIM_RAW_MAX, DIM_DISPLAY_MAX.technology) +
    '/' +
    DIM_DISPLAY_MAX.technology +
    '\n' +
    'Maturity Level: ' +
    (scoringResult.maturityLevel?.level ?? '') +
    ' - ' +
    (scoringResult.maturityLevel?.label ?? '') +
    '\nPrimary Pattern: ' +
    primaryPatternString(scoringResult) +
    '\nAll Patterns: ' +
    patterns +
    '\nPrimary Constraint: ' +
    (scoringResult.primaryConstraint || '') +
    '\nAgent Readiness: ' +
    (scoringResult.agentReadiness?.level ?? '') +
    ' - ' +
    (scoringResult.agentReadiness?.label ?? '') +
    '\n\nKey answer signals:\n' +
    'Q4 decision capture: ' +
    answers.q4 +
    '/4\n' +
    'Q7 approval governance: ' +
    answers.q7 +
    '/4\n' +
    'Q10 AI output reuse: ' +
    answers.q10 +
    '/4\n' +
    'Q11 system context flow: ' +
    answers.q11 +
    '/4\n\nCompany research:\n' +
    companyResearch +
    '\n\nWrite the diagnostic report for this organisation.'
  );
}

function parseJsonFromText(raw) {
  let text = String(raw || '').trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) text = fence[1].trim();
  return JSON.parse(text);
}

const DIM_LABELS = {
  knowledge: 'Knowledge & Context',
  process: 'Process & Execution',
  technology: 'Technology & AI',
};

function getFallbackNarrative(scoringResult, leadData) {
  const level = scoringResult?.maturityLevel?.level || 3;
  const ml = scoringResult?.maturityLevel || {};
  const insights = {
    1: 'The most important first step is not tooling - it is making operating context visible.',
    2: 'AI value is being created individually, but it is not yet captured organisationally.',
    3: 'Your tools are ahead of your processes. The primary constraint is decision memory, not more software.',
    4: 'You have the foundation. The next step is embedding context and approval capture into recurring workflows.',
    5: 'You are positioned to deploy governed agents. Ensure governance keeps pace with capability.',
  };
  const insight = insights[level] || insights[3];
  const company = leadData?.company_name || 'your organisation';
  const label = ml.label || 'Governed Tool Adoption';
  const display = buildDisplayScores(scoringResult);
  const total = display.total ?? '-';
  const dims = scoringResult?.dimensions || {};
  const weakest = DIM_LABELS[scoringResult?.weakestDimension] || 'Process & Execution';
  const strongest = DIM_LABELS[scoringResult?.strongestDimension] || 'Technology & AI';
  const patterns = (scoringResult?.patterns || [])
    .map(function (p) { return p.label; })
    .join(', ');
  const ar = scoringResult?.agentReadiness || {};
  const constraint = scoringResult?.primaryConstraint || 'operating constraints';

  return {
    executive_summary:
      company +
      ' scored ' +
      total +
      '/' +
      SCORE_DISPLAY_MAX +
      ' on the AI Operating Intelligence Diagnostic - Level ' +
      level +
      ' (' +
      label +
      '). ' +
      'Knowledge & Context: ' +
      display.knowledge +
      '/17, Process & Execution: ' +
      display.process +
      '/16, Technology & AI: ' +
      display.technology +
      '/17. ' +
      (patterns ? 'Detected patterns: ' + patterns + '. ' : '') +
      insight,
    where_you_are:
      'Based on your twelve responses, ' +
      company +
      ' shows the clearest strength in ' +
      strongest +
      ' and the largest gap in ' +
      weakest +
      '. ' +
      ml.description +
      ' ' +
      insight +
      ' Your primary constraint today is ' +
      constraint +
      '.',
    cost_analysis: [
      'When key people are unavailable, work in ' +
        company +
        ' may slow because knowledge and customer context are not consistently captured in systems others can use (Knowledge & Context: ' +
        display.knowledge +
        '/17).',
      'Teams likely spend significant time coordinating across tools, senior people, and manual follow-ups - especially where process score is ' +
        display.process +
        '/16.',
      'Approvals and decisions may be delayed when reasoning and context are not logged in an auditable way - a common signal at Level ' +
        level +
        '.',
      'AI may be creating individual productivity gains that are not captured organisationally. Agent readiness is "' +
        (ar.label || 'Copilot-Ready') +
        '" - ' +
        (ar.recommendation || 'start with governed copilots before autonomous agents.'),
    ].join('|||'),
    agent_readiness_narrative:
      'Your agent readiness rating is ' +
      (ar.level || 'Emerging') +
      ' ("' +
      (ar.label || 'Copilot-Ready') +
      '"). ' +
      (ar.recommendation || '') +
      ' Start with: ' +
      ((ar.startWith || []).join('; ') || 'copilots and structured briefs') +
      '. Avoid for now: ' +
      ((ar.avoid || []).join('; ') || 'autonomous agents without review.'),
    level_up_narrative:
      'To move beyond Level ' +
      level +
      ' (' +
      label +
      '), focus on ' +
      weakest +
      ' first - not additional tools. ' +
      insight +
      ' Practical next steps: document one high-friction workflow end-to-end; capture decisions with owner, reasoning, and follow-up; introduce human-in-the-loop AI only where approvals and context already exist.',
    roadmap_month1:
      'Map your highest-friction recurring workflow in ' +
      weakest +
      ' and list every point where context, approvals, or knowledge are lost.',
    roadmap_month2:
      'Introduce governed capture for decisions, exceptions, and AI outputs in that workflow - with named owners and retrieval paths.',
    roadmap_month3:
      'Pilot a human-in-the-loop agent or leadership intelligence brief on that workflow, with audit trails aligned to your ' +
      (ar.label || 'current') +
      ' readiness level.',
    kautilyan_section:
      'Kautilyan helps growing businesses map operating reality, embed context into workflows, and deploy governed AI with measurable outcomes - typically proving value on one workflow in 45 days. For Level ' +
      level +
      ' organisations, we start with an Operating Reality Diagnosis before any agent deployment.',
    next_step_narrative:
      scoringResult?.recommendedCTA?.body ||
      'Book a free operating reality diagnosis to identify your first high-leverage workflow.',
  };
}

/**
 * Call Gemini API and return parsed narrative JSON.
 */
function isGeminiConfigured() {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) return false;
  if (/^\[your[-\s]?|placeholder|xxx|changeme/i.test(apiKey)) return false;
  return true;
}

async function callGeminiForReport(userPrompt) {
  if (!isGeminiConfigured()) {
    throw new Error('GEMINI_API_KEY is not set or is a placeholder');
  }
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();

  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/' +
    encodeURIComponent(GEMINI_MODEL) +
    ':generateContent?key=' +
    encodeURIComponent(apiKey);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: 'application/json',
        maxOutputTokens: 8192,
      },
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error('Gemini HTTP ' + res.status + ': ' + text.slice(0, 400));
  }

  const data = JSON.parse(text);
  const parts =
    data.candidates &&
    data.candidates[0] &&
    data.candidates[0].content &&
    data.candidates[0].content.parts;
  if (!parts || !parts.length || !parts[0].text) {
    throw new Error('Empty Gemini response');
  }

  return parseJsonFromText(parts[0].text);
}

/**
 * Send report email via Google Apps Script (GmailApp) - see LeadsCapture.gs.
 */
/**
 * @returns {{ ok: boolean, error: string|null }}
 */
async function sendReportEmailViaGAS(leadData, scoringResult, responseId) {
  const webhookUrl = (
    process.env.GAS_EMAIL_WEBHOOK_URL ||
    process.env.GOOGLE_SCRIPT_URL ||
    ''
  ).trim();

  if (!webhookUrl) {
    const err = 'GAS_EMAIL_WEBHOOK_URL / GOOGLE_SCRIPT_URL not set - email skipped.';
    console.warn('[submit-assessment]', err);
    return { ok: false, error: err };
  }

  const toEmail = leadEmail(leadData);
  if (!toEmail) {
    const err = 'Missing recipient work_email.';
    console.error('[submit-assessment] Cannot send email -', err);
    return { ok: false, error: err };
  }

  const siteUrl = (process.env.SITE_URL || 'https://www.kautilyan.com').replace(/\/$/, '');
  const reportUrl = `${siteUrl}/assessment.html?report=${encodeURIComponent(responseId)}`;
  const ml = scoringResult.maturityLevel || {};
  const ar = scoringResult.agentReadiness || {};
  const cta = scoringResult.recommendedCTA || {};
  const pp = scoringResult.primaryPattern;
  const display = buildDisplayScores(scoringResult);

  const payload = {
    type: 'assessment_email',
    data: {
      toEmail: toEmail,
      name: leadData.respondent_name || leadData.name,
      companyName: leadData.company_name,
      totalScore: display.total,
      totalScoreMax: display.maxTotal,
      maturityLabel: `Level ${ml.level} - ${ml.label}`,
      primaryPattern: pp ? (pp.label || null) : null,
      level: ml.level,
      agentReadinessLevel: ar.level,
      ctaHeadline: cta.headline,
      ctaButtonText: cta.buttonText,
      reportUrl,
      siteUrl,
    },
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    const body = await res.text();
    let result = {};
    try {
      result = JSON.parse(body);
    } catch (parseErr) {
      if (res.ok && /"success"\s*:\s*true/i.test(body)) {
        result = { success: true };
      }
    }

    const ok =
      res.ok &&
      result.success !== false &&
      result.status !== 'error' &&
      (result.success === true || result.status === 'ok');

    if (!ok) {
      const detail = truncateAudit(
        result.message || result.error || body.slice(0, 1200),
        1800
      );
      const msg = `GAS email failed HTTP ${res.status}${detail ? ': ' + detail : ''}`;
      console.error('[submit-assessment]', msg);
      return { ok: false, error: msg };
    }

    console.log('[submit-assessment] Report email sent to', toEmail);
    return { ok: true, error: null };
  } catch (err) {
    const msg = truncateAudit('Email webhook error: ' + (err.message || String(err)), 2000);
    console.error('[submit-assessment]', msg);
    return { ok: false, error: msg };
  }
}

/**
 * Optional: mirror assessment lead data to Apps Script sheet
 * so sales/admin can track submissions outside Supabase.
 */
async function sendAssessmentLeadToGAS(leadData, scoringResult, responseId) {
  const webhookUrl = (
    process.env.GAS_EMAIL_WEBHOOK_URL ||
    process.env.GOOGLE_SCRIPT_URL ||
    ''
  ).trim();

  if (!webhookUrl) {
    return false;
  }

  const pp = scoringResult.primaryPattern;
  const ml = scoringResult.maturityLevel || {};
  const ar = scoringResult.agentReadiness || {};
  const display = buildDisplayScores(scoringResult);

  const payload = {
    type: 'assessment_lead',
    data: {
      submissionId: responseId,
      name: leadData.respondent_name || leadData.name || '',
      email: leadEmail(leadData),
      company: leadData.company_name || '',
      role: leadData.role || '',
      teamSize: leadData.employee_count || '',
      industry: leadData.industry || '',
      biggestChallenge: leadData.biggest_challenge || '',
      maturityLabel: `Level ${ml.level || 3} - ${ml.label || 'Governed Tool Adoption'}`,
      agentReadinessLevel: ar.level || '',
      primaryPattern: pp ? (pp.label || pp.id || '') : '',
      totalScore: display.total,
    },
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });
    const body = await res.text();
    let result = {};
    try {
      result = JSON.parse(body);
    } catch (e) {
      result = {};
    }
    const ok =
      res.ok &&
      result.status !== 'error' &&
      (result.success === true || result.status === 'ok' || result.action === 'assessment_lead_create');
    if (!ok) {
      console.error(
        '[submit-assessment] GAS lead mirror failed:',
        res.status,
        result.error || result.message || body.slice(0, 400)
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error('[submit-assessment] GAS lead mirror error:', err.message || err);
    return false;
  }
}

async function generateAndStoreReport(responseId, answers, leadData, scoringResult) {
  const supabase = getSupabase();
  let companyResearch = '';
  let narrative;

  try {
    companyResearch = await fetchCompanyResearch(leadData);
  } catch (err) {
    console.warn('[generateAndStoreReport] research error:', err.message || err);
    companyResearch =
      'Company: ' +
      (leadData.company_name || '') +
      '. Industry: ' +
      (leadData.industry || '') +
      '.';
  }

  const userPrompt = buildUserPrompt(answers, leadData, scoringResult, companyResearch);

  let usedGemini = true;
  try {
    narrative = await callGeminiForReport(userPrompt);
  } catch (err) {
    usedGemini = false;
    console.error('[generateAndStoreReport] Gemini failed, using fallback:', err.message || err);
    narrative = getFallbackNarrative(scoringResult, leadData);
  }

  const reportRow = {
    response_id: responseId,
    executive_summary: narrative.executive_summary || '',
    where_you_are: narrative.where_you_are || '',
    cost_analysis: narrative.cost_analysis || '',
    agent_readiness_narrative: narrative.agent_readiness_narrative || '',
    level_up_narrative: narrative.level_up_narrative || '',
    roadmap_month1: narrative.roadmap_month1 || '',
    roadmap_month2: narrative.roadmap_month2 || '',
    roadmap_month3: narrative.roadmap_month3 || '',
    kautilyan_section: narrative.kautilyan_section || '',
    next_step_narrative: narrative.next_step_narrative || '',
    company_research: companyResearch,
    full_report_json: Object.assign({}, narrative, {
      _meta: {
        generated_by: usedGemini ? 'gemini' : 'fallback',
        gemini_model: GEMINI_MODEL,
        generated_at: new Date().toISOString(),
      },
    }),
  };

  const { data: inserted, error: insertErr } = await supabase
    .from('assessment_reports')
    .insert(reportRow)
    .select('id')
    .single();

  if (insertErr) {
    console.error('[generateAndStoreReport] report insert failed:', insertErr);
    throw insertErr;
  }

  const reportId = inserted.id;

  const { error: updateErr } = await supabase
    .from('assessment_responses')
    .update({
      report_generated: true,
      report_id: reportId,
    })
    .eq('id', responseId);

  if (updateErr) {
    console.error('[generateAndStoreReport] response update failed:', updateErr);
  }

  // Best-effort sheet mirror for lead operations (does not block report flow).
  await sendAssessmentLeadToGAS(leadData, scoringResult, responseId);

  const emailResult = await sendReportEmailViaGAS(leadData, scoringResult, responseId);
  const emailedAt = new Date().toISOString();
  const emailPatch = {
    report_emailed: emailResult.ok,
    report_emailed_at: emailedAt,
    report_email_error: emailResult.ok ? null : truncateAudit(emailResult.error, 2000),
  };
  const { error: emailAuditErr } = await supabase
    .from('assessment_responses')
    .update(emailPatch)
    .eq('id', responseId);
  if (emailAuditErr) {
    console.error('[generateAndStoreReport] report email audit update failed:', emailAuditErr);
  }
}

module.exports = async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (e) {
    json(res, 400, { error: 'Invalid JSON body' });
    return;
  }

  const validation = validatePayload(body);
  if (!validation.ok) {
    json(res, 400, { error: validation.error });
    return;
  }

  let supabase;
  try {
    supabase = getSupabase();
  } catch (e) {
    console.error('[submit-assessment]', e);
    json(res, 500, { error: 'Storage error' });
    return;
  }

  const row = buildResponseRow(validation.answers, validation.leadData, validation.scoringResult);

  const { data, error } = await supabase.from('assessment_responses').insert(row).select('id').single();

  if (error || !data?.id) {
    console.error('[submit-assessment] Supabase insert failed:', error);
    json(res, 500, { error: 'Storage error' });
    return;
  }

  const responseId = data.id;

  generateAndStoreReport(responseId, validation.answers, validation.leadData, validation.scoringResult).catch(
    function (err) {
      console.error('[submit-assessment] generateAndStoreReport:', err);
    }
  );

  json(res, 200, { success: true, responseId: responseId });
};

module.exports.config = {
  maxDuration: 30,
};
