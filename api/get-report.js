/**
 * GET /api/get-report?id={responseId}
 * Returns { ready: false } until a report exists, then { ready: true, report: {...} }.
 */
const { createClient } = require('@supabase/supabase-js');

function setCors(res) {
  const origin = (process.env.SITE_URL || 'https://www.kautilyan.com').replace(/\/$/, '');
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
}

function json(res, status, body) {
  setCors(res);
  res.status(status).end(JSON.stringify(body));
}

function getSupabase() {
  const url = (process.env.SUPABASE_URL || '').trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (!url || !key) throw new Error('Supabase is not configured');
  return createClient(url, key);
}

module.exports = async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const id = String((req.query && req.query.id) || '').trim();
  if (!id) {
    json(res, 400, { error: 'Missing id' });
    return;
  }

  let supabase;
  try {
    supabase = getSupabase();
  } catch (err) {
    console.error('[get-report] supabase config:', err);
    json(res, 500, { error: 'Storage error' });
    return;
  }

  const { data: responseRow, error: responseErr } = await supabase
    .from('assessment_responses')
    .select('report_generated, report_id')
    .eq('id', id)
    .single();

  if (responseErr) {
    console.error('[get-report] response lookup failed:', responseErr);
    json(res, 500, { error: 'Storage error' });
    return;
  }

  if (!responseRow || !responseRow.report_generated) {
    json(res, 200, { ready: false });
    return;
  }

  const { data: reportRow, error: reportErr } = await supabase
    .from('assessment_reports')
    .select(
      'executive_summary, where_you_are, cost_analysis, agent_readiness_narrative, level_up_narrative, roadmap_month1, roadmap_month2, roadmap_month3, kautilyan_section, next_step_narrative, full_report_json'
    )
    .eq('response_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (reportErr) {
    console.error('[get-report] report lookup failed:', reportErr);
    json(res, 500, { error: 'Storage error' });
    return;
  }

  if (!reportRow) {
    // Response says generated but report not readable yet (eventual consistency / race).
    json(res, 200, { ready: false });
    return;
  }

  const fullJson = reportRow.full_report_json;
  const reportMeta =
    fullJson && typeof fullJson === 'object' && fullJson._meta ? fullJson._meta : null;
  const {
    full_report_json: _omit,
    ...reportFields
  } = reportRow;

  json(res, 200, { ready: true, report: reportFields, reportMeta });
};

module.exports.config = {
  maxDuration: 10,
};

