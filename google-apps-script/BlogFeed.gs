/**
 * Kautilyan Blog Feed - Google Apps Script
 *
 * 1. Create a Google Sheet with tab "Blogs" (see BLOG_SHEET_SETUP.md)
 * 2. Paste this script in Extensions → Apps Script
 * 3. Set SPREADSHEET_ID below
 * 4. Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone
 * 5. Copy the Web App URL into js/site.js → CONFIG.BLOG_FEED_URL
 */

var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
var SHEET_NAME = 'Blogs';

var HEADERS = [
  'slug',
  'status',
  'title',
  'meta_description',
  'excerpt',
  'body',
  'blocks_json',
  'media_urls',
  'published_date',
  'author',
  'seo_keywords',
  'thought_starter_key',
  'sort_order',
];

function doGet(e) {
  try {
    var posts = getPublishedPosts();
    return jsonResponse({ ok: true, posts: posts, updated: new Date().toISOString() });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err), posts: [] });
  }
}

function getPublishedPosts() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet "' + SHEET_NAME + '" not found');

  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  var headerRow = values[0].map(function (h) {
    return String(h).trim().toLowerCase();
  });

  var col = {};
  HEADERS.forEach(function (name) {
    var idx = headerRow.indexOf(name);
    col[name] = idx >= 0 ? idx : -1;
  });

  var posts = [];
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    if (!row || !row.length) continue;

    var slug = cell(row, col.slug);
    if (!slug) continue;

    var status = cell(row, col.status) || 'draft';
    if (status.toLowerCase() !== 'published') continue;

    posts.push({
      slug: slug,
      status: 'published',
      title: cell(row, col.title),
      meta_description: cell(row, col.meta_description),
      excerpt: cell(row, col.excerpt),
      body: cell(row, col.body),
      blocks_json: cell(row, col.blocks_json),
      media_urls: cell(row, col.media_urls),
      published_date: formatDate(cell(row, col.published_date)),
      author: cell(row, col.author) || 'Team Kautilyan',
      seo_keywords: cell(row, col.seo_keywords),
      thought_starter_key: cell(row, col.thought_starter_key),
      sort_order: parseInt(cell(row, col.sort_order), 10) || 999,
    });
  }

  posts.sort(function (a, b) {
    return a.sort_order - b.sort_order;
  });

  return posts;
}

function cell(row, index) {
  if (index < 0 || index >= row.length) return '';
  var v = row[index];
  if (v === null || v === undefined) return '';
  if (Object.prototype.toString.call(v) === '[object Date]') {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(v).trim();
}

function formatDate(val) {
  if (!val) return '';
  if (Object.prototype.toString.call(val) === '[object Date]') {
    return Utilities.formatDate(val, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(val).trim();
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
