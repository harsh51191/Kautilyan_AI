/**
 * Assessment report email — deploy as Web app (Execute as Me, Anyone).
 * Set Script property ASSESSMENT_FROM_EMAIL or use session active user.
 *
 * POST JSON: { action: "send_assessment_report", responseId, reportUrl, leadData, scoringResult }
 */

function doPost(e) {
  try {
    var data = parseBody_(e);
    if (data.action !== 'send_assessment_report') {
      return json_({ status: 'error', message: 'Unknown action' });
    }
    sendAssessmentReportEmail_(data);
    return json_({ status: 'ok' });
  } catch (err) {
    return json_({ status: 'error', message: String(err) });
  }
}

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Empty body');
  }
  return JSON.parse(e.postData.contents);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function sendAssessmentReportEmail_(data) {
  var lead = data.leadData || {};
  var score = data.scoringResult || {};
  var to = String(lead.work_email || '').trim();
  if (!to) throw new Error('Missing work_email');

  var name = String(lead.name || 'there');
  var company = String(lead.company_name || 'your organisation');
  var total = score.totalScore != null ? score.totalScore : '—';
  var maturityLabel = score.maturityLabel || '';
  var pattern = score.primaryPattern || '—';
  var insight = score.levelInsight || '';
  var ctaHeadline = (score.recommendedCTA && score.recommendedCTA.headline) || 'Book your next step with Kautilyan';
  var reportUrl = data.reportUrl || 'https://www.kautilyan.com/assessment.html';

  var subject = 'Your AI Operating Intelligence Report — ' + company;

  var html =
    '<div style="font-family:Inter,Arial,sans-serif;background:#0F0F13;color:#E8E8F0;padding:32px;max-width:560px;">' +
    '<div style="color:#C9A84C;font-size:22px;font-weight:700;margin-bottom:24px;">Kautilyan AI</div>' +
    '<p style="font-size:16px;line-height:1.6;">Hi ' +
    escapeHtml_(name) +
    ',</p>' +
    '<div style="background:rgba(201,168,76,0.12);border:1px solid rgba(201,168,76,0.35);border-radius:10px;padding:20px;margin:24px 0;">' +
    '<p style="margin:0;font-size:18px;font-weight:600;">Your organisation scored ' +
    total +
    '/48 — ' +
    escapeHtml_(maturityLabel) +
    '</p>' +
    '<p style="margin:12px 0 0;font-size:14px;color:rgba(255,255,255,0.75);">Primary pattern: ' +
    escapeHtml_(pattern) +
    '</p></div>' +
    '<p style="font-size:15px;line-height:1.65;color:rgba(255,255,255,0.85);">' +
    escapeHtml_(insight) +
    '</p>' +
    '<p style="margin:28px 0;"><a href="' +
    escapeHtml_(reportUrl) +
    '" style="display:inline-block;background:#C9A84C;color:#0F0F13;font-weight:600;text-decoration:none;padding:14px 24px;border-radius:8px;">View your full report →</a></p>' +
    '<p style="font-size:14px;color:rgba(255,255,255,0.65);">' +
    escapeHtml_(ctaHeadline) +
    '</p>' +
    '<p style="margin-top:32px;font-size:12px;color:rgba(255,255,255,0.45);">Team Kautilyan · founders@kautilyan.com · kautilyan.com</p></div>';

  MailApp.sendEmail({
    to: to,
    subject: subject,
    htmlBody: html,
    name: 'Kautilyan AI',
  });
}

function escapeHtml_(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
