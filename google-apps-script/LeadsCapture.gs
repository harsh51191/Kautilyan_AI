/**
 * Kautilyan lead capture — append + update same row by submissionId
 *
 * Sheet row 1 headers (add Submission ID as column N if missing):
 * Timestamp | Name | Email | Phone | Company | Role | Team Size | Revenue | Pain Points | Heard From | Source | Score | Message | Submission ID
 *
 * Deploy as Web app: Execute as Me, Who has access: Anyone
 *
 * Browser: POST with Content-Type text/plain (avoids CORS preflight) and read JSON response.
 */

function doPost(e) {
  try {
    var data = parseRequestBody_(e);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (data.action === 'update') {
      return jsonResponse(updateLeadRow_(sheet, data));
    }

    return jsonResponse(createLeadRow_(sheet, data));
  } catch (err) {
    return jsonResponse({ status: 'error', message: String(err) });
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

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
