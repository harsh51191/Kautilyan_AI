/**
 * Kautilyan Blog - Gemini enhancement on publish
 *
 * Setup:
 * 1. Add this file alongside BlogFeed.gs in the same Apps Script project
 * 2. Project Settings → Script properties → GEMINI_API_KEY = your key
 * 3. Run setupBlogTriggers() once (or use menu)
 * 4. When status = published, blocks_json is generated if empty
 *
 * Menu: Kautilyan Blog → Enhance selected row / Enhance all published
 */

var GEMINI_MODEL = 'gemini-2.0-flash';
var BLOCKS_COL = 'blocks_json';

var BLOCK_SCHEMA_PROMPT =
  'You are a content systems assistant for Kautilyan AI blog articles.\n' +
  'Given the article title and body (markdown-like prose), output ONLY valid JSON (no markdown fences) with this shape:\n' +
  '{"version":1,"blocks":[...]}\n\n' +
  'Each block must use ONLY these types: image, video, figure, table, chart, callout, quote, comparison.\n' +
  'Each block needs: id (unique string), type, anchor (exact substring from body to insert after that section).\n\n' +
  'Rules:\n' +
  '- Suggest 1-3 blocks that genuinely help the reader (charts for data/comparisons, callouts for key warnings, tables for structured lists).\n' +
  '- chart: chartType bar|line|doughnut, title, labels[], datasets[{label, values[]}]. Use realistic illustrative numbers from the article themes only.\n' +
  '- callout: variant info|tip|warning, title, body.\n' +
  '- comparison: leftTitle, leftBody, rightTitle, rightBody.\n' +
  '- table: title, headers[], rows[[cell,...]].\n' +
  '- image/video: only if media URLs are provided in the user message; include src, alt, caption.\n' +
  '- Do not invent external image URLs.\n' +
  '- anchor must match text that appears in the body (heading or distinctive phrase).\n';

function getGeminiKey_() {
  var key = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!key) throw new Error('Set Script property GEMINI_API_KEY');
  return key;
}

function colIndex_(headerRow, name) {
  var idx = headerRow.indexOf(String(name).toLowerCase());
  return idx >= 0 ? idx : -1;
}

function enhanceRowWithGemini_(sheet, rowIndex, force) {
  var values = sheet.getDataRange().getValues();
  var headerRow = values[0].map(function (h) {
    return String(h).trim().toLowerCase();
  });
  var row = values[rowIndex - 1];
  if (!row) return;

  var title = cell_(row, colIndex_(headerRow, 'title'));
  var body = cell_(row, colIndex_(headerRow, 'body'));
  var slug = cell_(row, colIndex_(headerRow, 'slug'));
  var status = cell_(row, colIndex_(headerRow, 'status'));
  if (status.toLowerCase() !== 'published') return;
  if (!body) return;

  var blocksIdx = colIndex_(headerRow, BLOCKS_COL);
  if (blocksIdx < 0) {
    sheet.getRange(1, headerRow.length + 1).setValue(BLOCKS_COL);
    blocksIdx = headerRow.length;
    headerRow.push(BLOCKS_COL);
  }

  var existing = cell_(row, blocksIdx);
  if (existing && !force) return;

  var mediaNote = cell_(row, colIndex_(headerRow, 'media_urls')) || '';
  var prompt =
    BLOCK_SCHEMA_PROMPT +
    '\nArticle slug: ' +
    slug +
    '\nTitle: ' +
    title +
    '\nOptional media URLs (use only these for image/video blocks):\n' +
    (mediaNote || '(none)') +
    '\n\nBody:\n' +
    body;

  var json = callGeminiJson_(prompt);
  var out = JSON.stringify(json);
  sheet.getRange(rowIndex, blocksIdx + 1).setValue(out);
}

function callGeminiJson_(prompt) {
  var key = getGeminiKey_();
  var url =
    'https://generativelanguage.googleapis.com/v1beta/models/' +
    GEMINI_MODEL +
    ':generateContent?key=' +
    encodeURIComponent(key);

  var payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.35,
      responseMimeType: 'application/json',
    },
  };

  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  var code = res.getResponseCode();
  var text = res.getContentText();
  if (code < 200 || code >= 300) {
    throw new Error('Gemini HTTP ' + code + ': ' + text.slice(0, 300));
  }

  var data = JSON.parse(text);
  var parts = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
  if (!parts || !parts.length) throw new Error('Empty Gemini response');

  var raw = parts[0].text || '';
  var parsed = JSON.parse(raw);
  if (!parsed.blocks) parsed = { version: 1, blocks: parsed };
  return parsed;
}

function cell_(row, index) {
  if (index < 0 || index >= row.length) return '';
  var v = row[index];
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function onBlogSheetEdit(e) {
  try {
    if (!e || !e.range) return;
    var sheet = e.range.getSheet();
    if (sheet.getName() !== SHEET_NAME) return;
    if (e.range.getRow() < 2) return;

    var headerRow = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0]
      .map(function (h) {
        return String(h).trim().toLowerCase();
      });
    var statusCol = colIndex_(headerRow, 'status');
    if (statusCol < 0) return;

    var row = e.range.getRow();
    var status = String(sheet.getRange(row, statusCol + 1).getValue()).trim().toLowerCase();
    if (status !== 'published') return;

    enhanceRowWithGemini_(sheet, row);
  } catch (err) {
    console.error('Blog enhance failed: ' + err);
  }
}

function setupBlogTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function (t) {
    if (t.getHandlerFunction() === 'onBlogSheetEdit') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('onBlogSheetEdit').forSpreadsheet(SPREADSHEET_ID).onEdit().create();
}

function menuEnhanceSelectedRow() {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  var row = sheet.getActiveCell().getRow();
  if (row < 2) return;
  enhanceRowWithGemini_(sheet, row, true);
  SpreadsheetApp.getUi().alert('Enhancement complete for row ' + row);
}

function menuEnhanceAllPublished() {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  var last = sheet.getLastRow();
  for (var r = 2; r <= last; r++) {
    try {
      enhanceRowWithGemini_(sheet, r);
    } catch (e) {
      console.warn('Row ' + r + ': ' + e);
    }
  }
  SpreadsheetApp.getUi().alert('Enhancement pass finished.');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Kautilyan Blog')
    .addItem('Enhance selected row (Gemini)', 'menuEnhanceSelectedRow')
    .addItem('Enhance all published rows', 'menuEnhanceAllPublished')
    .addItem('Setup publish triggers', 'setupBlogTriggers')
    .addToUi();
}
