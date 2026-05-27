/**
 * Kautilyan lead capture — append + update same row by submissionId
 *
 * Sheet row 1 headers (add Submission ID as column N if missing):
 * Timestamp | Name | Email | Phone | Company | Role | Team Size | Revenue | Pain Points | Heard From | Source | Score | Message | Submission ID
 *
 * Deploy as Web app: Execute as Me, Who has access: Anyone
 *
 * Browser: POST with Content-Type text/plain (avoids CORS preflight) and read JSON response.
 *
 * Assessment (from Vercel api/submit-assessment.js):
 *   { type: 'assessment_email', data: { toEmail, name, companyName, totalScore, totalScoreMax, ... } }
 *   { type: 'assessment_lead', data: { ... } }  — optional sheet log (wire in API when needed)
 */

function doPost(e) {
  try {
    var data = parseRequestBody_(e);

    if (data.type === 'assessment_email') {
      sendAssessmentReportEmail_(data.data);
      return jsonResponse({ success: true, status: 'ok', action: 'assessment_email' });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (data.type === 'assessment_lead') {
      return jsonResponse(createAssessmentLeadRow_(sheet, data.data));
    }

    if (data.action === 'update') {
      return jsonResponse(updateLeadRow_(sheet, data));
    }

    return jsonResponse(createLeadRow_(sheet, data));
  } catch (err) {
    return jsonResponse({ success: false, status: 'error', message: String(err) });
  }
}

function doGet(e) {
  if (e && e.parameter && e.parameter.ping === '1') {
    return jsonResponse({ status: 'ok', ping: true });
  }
  return jsonResponse({ status: 'ok', message: 'Kautilyan LeadsCapture endpoint' });
}

function parseRequestBody_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Empty request body');
  }
  return JSON.parse(e.postData.contents);
}

function createLeadRow_(sheet, data) {
  var submissionId = String(data.submissionId || '').trim();
  if (!submissionId) {
    submissionId = Utilities.getUuid();
  }

  var pain = formatPainPoints_(data.painPoints);
  sheet.appendRow([
    new Date(),
    data.name || '',
    data.email || '',
    data.phone || '',
    data.company || '',
    data.role || '',
    data.teamSize || '',
    data.revenue || '',
    pain,
    data.heardFrom || '',
    data.source || 'stage0_booking',
    data.score || '',
    data.message || 'Contact submitted — clarification pending',
    submissionId,
  ]);

  return {
    status: 'ok',
    action: 'create',
    rowId: sheet.getLastRow(),
    submissionId: submissionId,
  };
}

function updateLeadRow_(sheet, data) {
  var submissionId = String(data.submissionId || '').trim();
  if (!submissionId) {
    throw new Error('submissionId required for update');
  }

  var rowIndex = findRowBySubmissionId_(sheet, submissionId);
  if (rowIndex < 2) {
    throw new Error('No row found for submissionId: ' + submissionId);
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var col = function (name, fallback) {
    var i = headers.indexOf(name);
    return i >= 0 ? i + 1 : fallback;
  };

  var painCol = col('Pain Points', 9);
  var roleCol = col('Role', 6);
  var messageCol = col('Message', 13);
  var sourceCol = col('Source', 11);

  var pain = formatPainPoints_(data.painPoints);
  if (pain) sheet.getRange(rowIndex, painCol).setValue(pain);
  if (data.role) sheet.getRange(rowIndex, roleCol).setValue(data.role);
  if (data.message) sheet.getRange(rowIndex, messageCol).setValue(data.message);
  if (data.source) sheet.getRange(rowIndex, sourceCol).setValue(data.source);

  return {
    status: 'ok',
    action: 'update',
    rowId: rowIndex,
    submissionId: submissionId,
  };
}

function findRowBySubmissionId_(sheet, submissionId) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var idCol = headers.indexOf('Submission ID');
  if (idCol < 0) {
    idCol = lastCol >= 14 ? 13 : lastCol - 1;
  } else {
    idCol = idCol + 1;
  }

  var ids = sheet.getRange(2, idCol, lastRow, idCol).getValues();
  for (var i = ids.length - 1; i >= 0; i--) {
    if (String(ids[i][0]).trim() === submissionId) {
      return i + 2;
    }
  }
  return -1;
}

function formatPainPoints_(pain) {
  if (pain == null) return '';
  if (Array.isArray(pain)) return pain.join('\n');
  return String(pain);
}

function escapeHtml_(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * Assessment diagnostic report email (triggered from Vercel submit-assessment.js).
 */
function sendAssessmentReportEmail_(emailData) {
  emailData = emailData || {};

  var toEmail = String(emailData.toEmail || '').trim();
  if (!toEmail) {
    throw new Error('sendAssessmentReportEmail_: toEmail is required');
  }

  var name = escapeHtml_(emailData.name || 'there');
  var companyName = escapeHtml_(emailData.companyName || 'your organisation');
  var totalScore = emailData.totalScore != null ? emailData.totalScore : '—';
  var totalScoreMax = emailData.totalScoreMax != null ? emailData.totalScoreMax : 50;
  var maturityLabel = escapeHtml_(emailData.maturityLabel || '');
  var primaryPattern = emailData.primaryPattern ? escapeHtml_(emailData.primaryPattern) : '';
  var level = Number(emailData.level) || 3;
  var ctaHeadline = escapeHtml_(emailData.ctaHeadline || '');
  var reportUrl = String(emailData.reportUrl || 'https://www.kautilyan.com/assessment.html');
  var siteUrl = String(emailData.siteUrl || 'https://www.kautilyan.com');

  var levelInsights = {
    1: 'The most important first step is not tooling — it is making operating context visible.',
    2: 'AI value is being created individually, but it is not yet captured organisationally.',
    3: 'Your tools are ahead of your processes. The primary constraint is decision memory, not more software.',
    4: 'You have the foundation. The next step is embedding context and approval capture into recurring workflows.',
    5: 'You are positioned to deploy governed agents. Ensure governance keeps pace with capability.',
  };
  var insight = levelInsights[level] || levelInsights[3];

  var subject = 'Your AI Operating Intelligence Report — ' + (emailData.companyName || 'your organisation');

  var patternLine = primaryPattern
    ? '<p style="margin:0;font-size:13px;color:rgba(255,255,255,0.5);">Pattern: ' + primaryPattern + '</p>'
    : '';

  var htmlBody =
    '<!DOCTYPE html><html><body style="margin:0;padding:0;background:#F7F7FA;font-family:Arial,sans-serif;">' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F7FA;padding:32px 16px;"><tr><td>' +
    '<table width="100%" style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">' +
    '<tr><td style="background:#0F0F13;padding:24px 32px;">' +
    '<span style="font-size:14px;font-weight:700;color:#F0A030;letter-spacing:.06em;text-transform:uppercase;">KAUTILYAN AI</span>' +
    '</td></tr>' +
    '<tr><td style="padding:32px;">' +
    '<p style="font-size:16px;color:#0F0F13;margin:0 0 8px;">Hi ' + name + ',</p>' +
    '<p style="font-size:15px;color:#3A3A4A;line-height:1.6;margin:0 0 24px;">Your AI Operating Intelligence Diagnostic is ready.</p>' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="background:#0F0F13;border-radius:10px;margin-bottom:24px;"><tr>' +
    '<td style="padding:24px 28px;">' +
    '<p style="margin:0 0 4px;font-size:13px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.06em;">Overall Score</p>' +
    '<p style="margin:0 0 8px;font-size:36px;font-weight:700;color:#F0A030;">' +
    totalScore +
    ' <span style="font-size:18px;color:rgba(255,255,255,0.4);">/ ' +
    totalScoreMax +
    '</span></p>' +
    '<p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#FFFFFF;">' +
    maturityLabel +
    '</p>' +
    patternLine +
    '</td></tr></table>' +
    '<p style="font-size:14px;color:#3A3A4A;line-height:1.65;margin:0 0 24px;padding:16px;background:#FBF5E6;border-left:3px solid #E05545;border-radius:0 8px 8px 0;">' +
    insight +
    '</p>' +
    '<table cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr>' +
    '<td style="background:linear-gradient(120deg,#F0A030,#E05545,#8B5CF6);border-radius:8px;">' +
    '<a href="' +
    reportUrl +
    '" style="display:inline-block;padding:13px 26px;font-size:14px;font-weight:700;color:#FFFFFF;text-decoration:none;">View your full report &rarr;</a>' +
    '</td></tr></table>' +
    (ctaHeadline
      ? '<p style="font-size:13px;color:#6B6B80;margin:0 0 24px;">' + ctaHeadline + '</p>'
      : '') +
    '<hr style="border:none;border-top:1px solid #E2E2EB;margin:24px 0;">' +
    '<p style="font-size:12px;color:#6B6B80;margin:0;">' +
    'Team Kautilyan &nbsp;&middot;&nbsp; ' +
    '<a href="mailto:founders@kautilyan.com" style="color:#6B6B80;text-decoration:none;">founders@kautilyan.com</a>' +
    ' &nbsp;&middot;&nbsp; ' +
    '<a href="' +
    siteUrl +
    '" style="color:#6B6B80;text-decoration:none;">kautilyan.com</a>' +
    '</p>' +
    '</td></tr>' +
    '</table></td></tr></table>' +
    '</body></html>';

  GmailApp.sendEmail(toEmail, subject, '', {
    htmlBody: htmlBody,
    name: 'Kautilyan AI',
  });
}

/**
 * Appends an assessment submission as a new row in the leads sheet.
 * Source is tagged 'assessment' so you can filter it separately.
 *
 * Called when API posts { type: 'assessment_lead', data: { ... } }
 */
function createAssessmentLeadRow_(sheet, leadData) {
  leadData = leadData || {};
  var submissionId = String(leadData.submissionId || Utilities.getUuid()).trim();

  var painSummary = [
    'Biggest challenge: ' + (leadData.biggestChallenge || ''),
    'Industry: ' + (leadData.industry || ''),
    'Team size: ' + (leadData.teamSize || ''),
    'Maturity: ' + (leadData.maturityLabel || ''),
    'Agent readiness: ' + (leadData.agentReadinessLevel || ''),
    'Pattern: ' + (leadData.primaryPattern || ''),
  ].join(' | ');

  sheet.appendRow([
    new Date(),
    leadData.name || '',
    leadData.email || '',
    '',
    leadData.company || '',
    leadData.role || '',
    leadData.teamSize || '',
    '',
    painSummary,
    '',
    'assessment',
    leadData.totalScore != null ? leadData.totalScore : '',
    '',
    submissionId,
  ]);

  return {
    success: true,
    status: 'ok',
    action: 'assessment_lead_create',
    rowId: sheet.getLastRow(),
    submissionId: submissionId,
  };
}
