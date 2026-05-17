/* Markdown → HTML for blog prose (rich blocks handled by blog-render.js) */
(function (global) {
  'use strict';

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function inlineFormat(s) {
    return escapeHtml(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="article-inline-code">$1</code>');
  }

  function markdownToHtml(md) {
    if (!md) return '';
    var lines = String(md).replace(/\r\n/g, '\n').split('\n');
    var html = [];
    var inUl = false;
    var inOl = false;

    function closeLists() {
      if (inUl) { html.push('</ul>'); inUl = false; }
      if (inOl) { html.push('</ol>'); inOl = false; }
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var trimmed = line.trim();

      if (!trimmed) {
        closeLists();
        continue;
      }

      if (trimmed === '---') {
        closeLists();
        html.push('<hr class="article-hr" />');
        continue;
      }

      if (/^##\s+/.test(trimmed)) {
        closeLists();
        html.push('<h2 class="article-h2">' + inlineFormat(trimmed.replace(/^##\s+/, '')) + '</h2>');
        continue;
      }

      if (/^\*\*.+\*\*$/.test(trimmed) && trimmed.indexOf('**', 2) === trimmed.length - 2) {
        closeLists();
        html.push('<h3 class="article-h3" data-anchor="' + escapeHtml(trimmed.slice(2, -2).toLowerCase()) + '">' + inlineFormat(trimmed.slice(2, -2)) + '</h3>');
        continue;
      }

      var ulMatch = /^[-*]\s+(.+)$/.exec(trimmed);
      if (ulMatch) {
        if (inOl) { html.push('</ol>'); inOl = false; }
        if (!inUl) { html.push('<ul class="article-ul">'); inUl = true; }
        html.push('<li>' + inlineFormat(ulMatch[1]) + '</li>');
        continue;
      }

      var olMatch = /^(\d+)\.\s+(.+)$/.exec(trimmed);
      if (olMatch) {
        if (inUl) { html.push('</ul>'); inUl = false; }
        if (!inOl) { html.push('<ol class="article-ol">'); inOl = true; }
        html.push('<li>' + inlineFormat(olMatch[2]) + '</li>');
        continue;
      }

      closeLists();
      html.push('<p class="article-p">' + inlineFormat(trimmed) + '</p>');
    }

    closeLists();
    return html.join('\n');
  }

  global.markdownToHtml = markdownToHtml;
})(typeof window !== 'undefined' ? window : this);
