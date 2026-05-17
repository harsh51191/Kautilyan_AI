/* Assemble markdown + rich blocks (inline fences + blocks_json anchors) */
(function (global) {
  'use strict';

  var FENCE_RE = /:::(\w+)\s*\n([\s\S]*?):::/g;

  function splitBodyWithFences(body) {
    var text = String(body || '');
    var parts = [];
    var last = 0;
    var m;
    FENCE_RE.lastIndex = 0;
    while ((m = FENCE_RE.exec(text)) !== null) {
      if (m.index > last) {
        parts.push({ kind: 'md', text: text.slice(last, m.index) });
      }
      var type = m[1].toLowerCase();
      if (global.BlogBlocks && BlogBlocks.BLOCK_TYPES[type]) {
        parts.push({ kind: 'block', block: BlogBlocks.fenceToBlock(type, m[2]) });
      } else {
        parts.push({ kind: 'md', text: m[0] });
      }
      last = m.index + m[0].length;
    }
    if (last < text.length) parts.push({ kind: 'md', text: text.slice(last) });
    if (!parts.length) parts.push({ kind: 'md', text: text });
    return parts;
  }

  function findAnchorIndex(parts, anchor) {
    if (!anchor) return -1;
    var needle = String(anchor).trim().toLowerCase();
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].kind === 'md' && parts[i].text.toLowerCase().indexOf(needle) >= 0) {
        return i;
      }
    }
    return -1;
  }

  function insertAnchoredBlocks(parts, blocks) {
    blocks = (blocks || []).slice().sort(function (a, b) {
      var ia = findAnchorIndex(parts, a.anchor);
      var ib = findAnchorIndex(parts, b.anchor);
      return ib - ia;
    });
    blocks.forEach(function (block) {
      if (!block.anchor) return;
      var idx = findAnchorIndex(parts, block.anchor);
      if (idx < 0) {
        parts.push({ kind: 'block', block: block });
        return;
      }
      parts.splice(idx + 1, 0, { kind: 'block', block: block });
    });
    return parts;
  }

  function renderParts(parts) {
    var mdFn = global.markdownToHtml;
    var blocks = global.BlogBlocks;
    return parts
      .map(function (part) {
        if (part.kind === 'block') {
          return blocks ? blocks.renderBlock(part.block) : '';
        }
        return mdFn ? mdFn(part.text) : '<p>' + part.text + '</p>';
      })
      .join('\n');
  }

  function renderPostBody(post) {
    var parts = splitBodyWithFences(post.body || '');
    var jsonBlocks = global.BlogBlocks ? BlogBlocks.parseBlocksJson(post.blocks_json) : [];
    insertAnchoredBlocks(parts, jsonBlocks);
    return renderParts(parts);
  }

  function enhanceArticleDom(root) {
    if (!root) return;
    if (global.BlogBlocks && BlogBlocks.enhanceArticle) {
      BlogBlocks.enhanceArticle(root);
    }
  }

  global.BlogRender = {
    splitBodyWithFences: splitBodyWithFences,
    renderPostBody: renderPostBody,
    enhanceArticleDom: enhanceArticleDom,
  };
})(typeof window !== 'undefined' ? window : this);
