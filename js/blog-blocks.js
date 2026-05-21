/* Blog Rich Blocks — A2UI-inspired allowlisted component catalog */
(function (global) {
  'use strict';

  var BLOCK_TYPES = {
    image: true,
    video: true,
    figure: true,
    table: true,
    chart: true,
    callout: true,
    quote: true,
    comparison: true,
  };

  var CHART_COLORS = ['#F0A030', '#E05545', '#8B5CF6', '#38BDF8', '#34D399', '#F472B6', '#FB7185', '#A78BFA', '#FBBF24'];

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  function blockWrap(type, id, inner, extraClass) {
    var cls = 'blog-block blog-block--' + type + (extraClass ? ' ' + extraClass : '');
    return (
      '<div class="' + cls + '" data-block-type="' + esc(type) + '" data-block-id="' + esc(id) + '">' +
      '<div class="blog-block-glow" aria-hidden="true"></div>' +
      inner +
      '</div>'
    );
  }

  function encodeChartPayload(obj) {
    try {
      return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
    } catch (e) {
      return '';
    }
  }

  function decodeChartPayload(b64) {
    return JSON.parse(decodeURIComponent(escape(atob(b64))));
  }

  function parseKeyValues(text) {
    var obj = {};
    String(text || '')
      .split('\n')
      .forEach(function (line) {
        var m = /^([a-zA-Z0-9_-]+)\s*:\s*(.*)$/.exec(line.trim());
        if (m) obj[m[1].toLowerCase()] = m[2].trim();
      });
    return obj;
  }

  function fenceToBlock(type, body) {
    var kv = parseKeyValues(body);
    var block = { type: type, id: kv.id || 'fence-' + type };
    if (type === 'image' || type === 'figure') {
      block.src = kv.src || kv.url || '';
      block.alt = kv.alt || '';
      block.caption = kv.caption || '';
    } else if (type === 'video') {
      block.src = kv.src || kv.url || kv.youtube || '';
      block.caption = kv.caption || '';
    } else if (type === 'table') {
      block.headers = (kv.headers || '').split('|').map(function (s) { return s.trim(); }).filter(Boolean);
      block.rows = String(kv.rows || '')
        .split('\n')
        .map(function (row) {
          return row.split('|').map(function (c) { return c.trim(); });
        })
        .filter(function (r) { return r.length && r.some(Boolean); });
    } else if (type === 'chart') {
      block.chartType = (kv.type || kv.charttype || 'bar').toLowerCase();
      block.title = kv.title || '';
      block.labels = (kv.labels || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      block.values = (kv.values || '').split(',').map(function (s) { return parseFloat(s.trim()) || 0; });
      block.label = kv.label || kv.dataset || 'Value';
    } else if (type === 'callout') {
      block.variant = (kv.variant || 'info').toLowerCase();
      block.title = kv.title || '';
      block.body = kv.body || kv.text || '';
    } else if (type === 'quote') {
      block.text = kv.text || kv.quote || '';
      block.attribution = kv.attribution || kv.author || '';
    } else if (type === 'comparison') {
      block.leftTitle = kv.left_title || kv.lefttitle || '';
      block.leftBody = kv.left_body || kv.leftbody || '';
      block.rightTitle = kv.right_title || kv.righttitle || '';
      block.rightBody = kv.right_body || kv.rightbody || '';
    }
    return block;
  }

  function normalizeBlock(raw) {
    if (!raw || !raw.type) return null;
    var type = String(raw.type).toLowerCase();
    if (!BLOCK_TYPES[type]) return null;
    var b = Object.assign({ id: raw.id || 'block-' + type + '-' + Math.random().toString(36).slice(2, 8) }, raw);
    b.type = type;
    if (type === 'chart') {
      b.chartType = (b.chartType || b.chart_type || 'bar').toLowerCase();
      if (!b.datasets && b.labels && b.values) {
        b.datasets = [{ label: b.label || b.datasetLabel || 'Value', values: b.values }];
      }
      if (typeof b.labels === 'string') {
        b.labels = b.labels.split(',').map(function (s) { return s.trim(); });
      }
    }
    if (type === 'table' && b.rows && typeof b.rows === 'string') {
      b.rows = b.rows.split('\n').map(function (row) {
        return row.split('|').map(function (c) { return c.trim(); });
      });
    }
    return b;
  }

  function parseBlocksJson(input) {
    if (!input) return [];
    try {
      var data = typeof input === 'string' ? JSON.parse(input) : input;
      var list = Array.isArray(data) ? data : data.blocks || [];
      return list.map(normalizeBlock).filter(Boolean);
    } catch (e) {
      console.warn('[BlogBlocks] Invalid blocks_json', e);
      return [];
    }
  }

  function renderImageBlock(block, media) {
    var src = media.normalizeImageUrl(block.src || block.url || '');
    if (!src) {
      return blockWrap('fallback', block.id, '<p>Image could not be loaded.</p>');
    }
    var cap = block.caption ? '<figcaption class="blog-figcaption">' + esc(block.caption) + '</figcaption>' : '';
    var inner =
      '<p class="blog-block-title"><span class="blog-block-badge">Image</span></p>' +
      '<div class="blog-media-wrap">' +
      '<img class="blog-img" src="' + esc(src) + '" alt="' + esc(block.alt || block.caption || 'Blog illustration') + '" loading="lazy" decoding="async" />' +
      '</div>' + cap;
    return blockWrap('image', block.id, inner);
  }

  function renderVideoBlock(block, media) {
    var src = block.src || block.url || block.youtube || '';
    var info = media.normalizeVideoEmbed(src);
    if (!info.embed) {
      return blockWrap(
        'fallback',
        block.id,
        '<p>Video could not be embedded. Check the Drive or YouTube link.</p>' +
        (src ? '<p><a href="' + esc(src) + '" target="_blank" rel="noopener noreferrer">Open video link</a></p>' : '')
      );
    }
    var cap = block.caption ? '<figcaption class="blog-figcaption">' + esc(block.caption) + '</figcaption>' : '';
    var title = esc(block.caption || 'Video');
    var wrapInner;
    if (info.kind === 'drive' && info.thumbnail) {
      wrapInner =
        '<div class="blog-video-wrap blog-video-wrap--drive">' +
        '<button type="button" class="blog-video-poster" aria-label="Play video: ' + title + '">' +
        '<img src="' + esc(info.thumbnail) + '" alt="" loading="lazy" decoding="async" />' +
        '<span class="blog-video-play-icon" aria-hidden="true"></span>' +
        '</button>' +
        '<div class="blog-video-player" hidden>' +
        '<iframe data-src="' + esc(info.embed) + '" title="' + title + '" referrerpolicy="no-referrer-when-downgrade" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen></iframe>' +
        '</div>' +
        '</div>';
    } else {
      wrapInner =
        '<div class="blog-video-wrap blog-video-wrap--embed">' +
        '<iframe src="' + esc(info.embed) + '" title="' + title + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen></iframe>' +
        '</div>';
    }
    var inner =
      '<p class="blog-block-title"><span class="blog-block-badge">Video</span></p>' +
      wrapInner +
      cap;
    return blockWrap('video', block.id, inner);
  }

  function renderTableBlock(block) {
    var headers = block.headers || [];
    var rows = block.rows || [];
    if (!headers.length && !rows.length) return '';
    var tableHtml = '<div class="blog-table-scroll"><table class="blog-table"><thead><tr>';
    headers.forEach(function (h) { tableHtml += '<th>' + esc(h) + '</th>'; });
    tableHtml += '</tr></thead><tbody>';
    rows.forEach(function (row) {
      tableHtml += '<tr>';
      row.forEach(function (cell) { tableHtml += '<td>' + esc(cell) + '</td>'; });
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table></div>';
    var inner =
      '<p class="blog-block-title"><span class="blog-block-badge">Table</span>' + esc(block.title || '') + '</p>' +
      tableHtml;
    return blockWrap('table', block.id, inner);
  }

  function renderChartBlock(block) {
    var chartType = block.chartType || 'bar';
    var payload = {
      type: chartType,
      title: block.title || '',
      labels: block.labels || [],
      datasets: block.datasets || [{ label: 'Value', values: block.values || [] }],
    };
    var inner =
      '<p class="blog-block-title"><span class="blog-block-badge">Chart</span>' + esc(block.title || 'Visual') + '</p>' +
      '<div class="blog-chart-wrap">' +
      '<canvas class="blog-chart-canvas" role="img" aria-label="' + esc(block.title || 'Chart') + '" data-chart-b64="' + encodeChartPayload(payload) + '"></canvas>' +
      '</div>';
    return blockWrap('chart', block.id, inner);
  }

  function renderCallout(block) {
    var v = block.variant || 'info';
    var badge = v === 'warning' ? 'Warning' : v === 'tip' ? 'Tip' : 'Insight';
    var inner =
      '<p class="blog-callout-title"><span class="blog-block-badge">' + esc(badge) + '</span>' + esc(block.title || '') + '</p>' +
      '<p class="blog-callout-body">' + esc(block.body || block.text || '') + '</p>';
    return blockWrap('callout', block.id, inner, 'blog-callout--' + v);
  }

  function renderQuote(block) {
    var inner =
      '<p class="blog-quote-mark" aria-hidden="true">"</p>' +
      '<p class="blog-quote-text">' + esc(block.text || block.quote || '') + '</p>' +
      (block.attribution ? '<cite>' + esc(block.attribution) + '</cite>' : '');
    return blockWrap('quote', block.id, inner);
  }

  function renderComparison(block) {
    var inner =
      '<p class="blog-block-title"><span class="blog-block-badge">Compare</span></p>' +
      '<div class="blog-compare-grid">' +
      '<div class="blog-compare-col"><h4>' + esc(block.leftTitle || 'Before') + '</h4><p>' + esc(block.leftBody || '') + '</p></div>' +
      '<div class="blog-compare-col blog-compare-col--right"><h4>' + esc(block.rightTitle || 'After') + '</h4><p>' + esc(block.rightBody || '') + '</p></div>' +
      '</div>';
    return blockWrap('comparison', block.id, inner);
  }

  function renderBlock(block, media) {
    block = normalizeBlock(block);
    if (!block) return '';
    media = media || global.BlogMedia;
    switch (block.type) {
      case 'image':
      case 'figure':
        return renderImageBlock(block, media);
      case 'video':
        return renderVideoBlock(block, media);
      case 'table':
        return renderTableBlock(block);
      case 'chart':
        return renderChartBlock(block);
      case 'callout':
        return renderCallout(block);
      case 'quote':
        return renderQuote(block);
      case 'comparison':
        return renderComparison(block);
      default:
        return '';
    }
  }

  function readChartSpec(canvas) {
    var b64 = canvas.getAttribute('data-chart-b64');
    if (b64) return decodeChartPayload(b64);
    var raw = canvas.getAttribute('data-chart');
    if (raw) return JSON.parse(raw);
    return null;
  }

  function buildChart(canvas, spec) {
    var labels = spec.labels || [];
    var ds = (spec.datasets || [])[0] || { label: 'Value', values: [] };
    var n = Math.max(labels.length, (ds.values || []).length, 1);
    var colors = CHART_COLORS.slice(0, n);
    while (colors.length < n) colors.push(CHART_COLORS[colors.length % CHART_COLORS.length]);

    canvas.dataset.chartReady = '1';
    return new Chart(canvas, {
      type: spec.type === 'doughnut' || spec.type === 'pie' ? spec.type : spec.type || 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: ds.label || 'Value',
          data: ds.values || [],
          backgroundColor: colors.map(function (c) { return c + 'b3'; }),
          borderColor: colors,
          borderWidth: 2,
          tension: 0.35,
          fill: spec.type === 'line',
          pointRadius: spec.type === 'line' ? 4 : 0,
          pointHoverRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: 'rgba(232,232,240,0.88)', font: { family: 'Inter, sans-serif', size: 11 }, boxWidth: 12 },
          },
          title: {
            display: false,
          },
        },
        scales:
          spec.type === 'pie' || spec.type === 'doughnut'
            ? {}
            : {
                x: {
                  ticks: { color: 'rgba(122,122,154,0.95)', font: { size: 10 } },
                  grid: { color: 'rgba(255,255,255,0.05)' },
                },
                y: {
                  ticks: { color: 'rgba(122,122,154,0.95)', font: { size: 10 } },
                  grid: { color: 'rgba(255,255,255,0.06)' },
                  beginAtZero: true,
                },
              },
      },
    });
  }

  function initCharts(root) {
    var scope = root || document;
    var canvases = scope.querySelectorAll('.blog-chart-canvas[data-chart-b64], .blog-chart-canvas[data-chart]');

    if (!global.Chart) {
      scope.querySelectorAll('.blog-chart-wrap').forEach(function (wrap) {
        if (wrap.dataset.chartPending === '1') return;
        wrap.dataset.chartPending = '1';
        wrap.classList.add('blog-chart-wrap--loading');
      });
      return false;
    }

    canvases.forEach(function (canvas) {
      if (canvas.dataset.chartReady === '1') return;
      var spec;
      try {
        spec = readChartSpec(canvas);
      } catch (e) {
        console.warn('[BlogBlocks] Chart parse failed', e);
        return;
      }
      if (!spec) return;
      var wrap = canvas.closest('.blog-chart-wrap');
      if (wrap) wrap.classList.remove('blog-chart-wrap--loading');
      buildChart(canvas, spec);
    });
    return true;
  }

  function initChartsWhenReady(root, attempts) {
    attempts = attempts || 0;
    if (initCharts(root)) return;
    if (attempts < 40) {
      setTimeout(function () { initChartsWhenReady(root, attempts + 1); }, 100);
    }
  }

  function wireMediaFallbacks(root) {
    var scope = root || document;
    scope.querySelectorAll('.blog-img').forEach(function (img) {
      img.addEventListener('error', function () {
        var wrap = img.closest('.blog-media-wrap');
        if (!wrap || wrap.dataset.failed) return;
        wrap.dataset.failed = '1';
        wrap.innerHTML = '<p class="blog-media-fallback">Image unavailable. Check that the Google Drive file is shared as &ldquo;Anyone with the link can view&rdquo;.</p>';
      });
    });
  }

  function wireDriveVideoPosters(root) {
    if (!root) return;
    root.querySelectorAll('.blog-video-wrap--drive').forEach(function (wrap) {
      if (wrap.dataset.wired === '1') return;
      wrap.dataset.wired = '1';
      var poster = wrap.querySelector('.blog-video-poster');
      var player = wrap.querySelector('.blog-video-player');
      var iframe = wrap.querySelector('iframe');
      if (!poster || !player || !iframe) return;
      poster.addEventListener('click', function () {
        var src = iframe.getAttribute('data-src');
        if (src && !iframe.src) iframe.src = src;
        poster.hidden = true;
        player.hidden = false;
        wrap.classList.add('is-playing');
      });
    });
  }

  function stripVideoOpenLinks(root) {
    if (!root) return;
    root.querySelectorAll('.blog-video-open').forEach(function (el) {
      el.remove();
    });
    root.querySelectorAll('.blog-block--video a[href*="drive.google.com"]').forEach(function (a) {
      var label = (a.textContent || '').toLowerCase();
      if (label.indexOf('google drive') >= 0 || label.indexOf('open in') >= 0 || label.indexOf('player does not load') >= 0) {
        var parent = a.closest('p') || a;
        parent.remove();
      }
    });
  }

  function enhanceArticle(root) {
    stripVideoOpenLinks(root);
    wireDriveVideoPosters(root);
    wireMediaFallbacks(root);
    initChartsWhenReady(root, 0);
  }

  global.BlogBlocks = {
    BLOCK_TYPES: BLOCK_TYPES,
    parseKeyValues: parseKeyValues,
    fenceToBlock: fenceToBlock,
    parseBlocksJson: parseBlocksJson,
    normalizeBlock: normalizeBlock,
    renderBlock: renderBlock,
    initCharts: initCharts,
    initChartsWhenReady: initChartsWhenReady,
    enhanceArticle: enhanceArticle,
    wireMediaFallbacks: wireMediaFallbacks,
  };
})(typeof window !== 'undefined' ? window : this);
