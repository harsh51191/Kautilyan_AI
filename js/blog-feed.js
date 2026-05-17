/* Blog feed: Google Sheet (via Apps Script) + local fallback */
(function (global) {
  'use strict';

  var CACHE_KEY = 'kautilyan_blog_posts_v5';
  var CACHE_TTL_MS = 5 * 60 * 1000;

  function getConfig() {
    return global.CONFIG || {};
  }

  function feedUrl() {
    return (getConfig().BLOG_FEED_URL || '').trim();
  }

  var blocksSeedBySlug = null;
  var videoOverridesBySlug = null;

  function loadVideoOverrides() {
    if (videoOverridesBySlug) return Promise.resolve(videoOverridesBySlug);
    return fetch('data/blog-video-overrides.json', { cache: 'default' })
      .then(function (r) {
        if (!r.ok) return {};
        return r.json();
      })
      .catch(function () { return {}; })
      .then(function (data) {
        videoOverridesBySlug = data || {};
        return videoOverridesBySlug;
      });
  }

  function buildVideoFence(cfg) {
    return ':::video\nsrc: ' + String(cfg.src || '').trim() + '\ncaption: ' + String(cfg.caption || '').trim() + '\n:::';
  }

  function applyVideoOverrides(posts) {
    if (!videoOverridesBySlug) return posts;
    return posts.map(function (p) {
      var cfg = videoOverridesBySlug[p.slug];
      if (!cfg || !cfg.src) return p;
      if (p.body && p.body.indexOf(':::video') >= 0) return p;
      var fence = buildVideoFence(cfg);
      var insertAfter = String(cfg.insertAfter || '').trim();
      if (insertAfter && p.body && p.body.indexOf(insertAfter) >= 0) {
        p.body = p.body.replace(insertAfter, insertAfter + '\n\n' + fence);
      } else {
        p.body = fence + '\n\n' + (p.body || '');
      }
      return p;
    });
  }

  function finishPosts(posts) {
    posts = mergeBlocksSeed(posts);
    posts = applyVideoOverrides(posts);
    return posts;
  }

  function loadBlocksSeed() {
    if (blocksSeedBySlug) return Promise.resolve(blocksSeedBySlug);
    return fetch('data/blog-blocks-seed.json', { cache: 'default' })
      .then(function (r) {
        if (!r.ok) return {};
        return r.json();
      })
      .catch(function () { return {}; })
      .then(function (data) {
        blocksSeedBySlug = data || {};
        return blocksSeedBySlug;
      });
  }

  function postHasBlocks(p) {
    if (!p.blocks_json) return false;
    try {
      var data = typeof p.blocks_json === 'string' ? JSON.parse(p.blocks_json) : p.blocks_json;
      var list = Array.isArray(data) ? data : (data && data.blocks) || [];
      return list.length > 0;
    } catch (e) {
      return false;
    }
  }

  function mergeBlocksSeed(posts) {
    if (!blocksSeedBySlug) return posts;
    return posts.map(function (p) {
      if (postHasBlocks(p)) return p;
      var seed = blocksSeedBySlug[p.slug];
      if (seed) p.blocks_json = seed;
      return p;
    });
  }

  function normalizePost(row) {
    return {
      slug: String(row.slug || '').trim().toLowerCase(),
      status: String(row.status || 'published').trim().toLowerCase(),
      title: String(row.title || '').trim(),
      meta_description: String(row.meta_description || row.metaDescription || '').trim(),
      excerpt: String(row.excerpt || '').trim(),
      body: String(row.body || '').trim(),
      blocks_json: row.blocks_json || row.blocksJson || '',
      published_date: String(row.published_date || row.publishedDate || '').trim(),
      author: String(row.author || 'Team Kautilyan').trim(),
      seo_keywords: String(row.seo_keywords || row.seoKeywords || '').trim(),
      thought_starter_key: String(row.thought_starter_key || row.thoughtStarterKey || '').trim(),
      sort_order: parseInt(row.sort_order || row.sortOrder || 999, 10) || 999,
    };
  }

  function publishedOnly(posts) {
    return posts
      .map(normalizePost)
      .filter(function (p) {
        return p.slug && p.title && p.status === 'published';
      })
      .sort(function (a, b) {
        return a.sort_order - b.sort_order;
      });
  }

  function readCache() {
    try {
      var raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (Date.now() - data.ts > CACHE_TTL_MS) return null;
      return data.posts;
    } catch (e) {
      return null;
    }
  }

  function writeCache(posts) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), posts: posts }));
    } catch (e) { /* ignore */ }
  }

  function fetchFallback() {
    return fetch('data/blog-posts.json', { cache: 'default' })
      .then(function (r) {
        if (!r.ok) throw new Error('fallback json missing');
        return r.json();
      })
      .then(function (data) {
        return publishedOnly(data.posts || []);
      });
  }

  function fetchSheet() {
    var url = feedUrl();
    if (!url) return Promise.reject(new Error('no feed url'));
    return fetch(url, { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('feed http ' + r.status);
        return r.json();
      })
      .then(function (data) {
        var posts = data.posts || data;
        if (!Array.isArray(posts)) throw new Error('invalid feed shape');
        return publishedOnly(posts);
      });
  }

  function loadPosts() {
    var cached = readCache();
    var assetsPromise = Promise.all([loadBlocksSeed(), loadVideoOverrides()]);

    if (cached && cached.length) {
      return assetsPromise.then(function () {
        return finishPosts(cached);
      });
    }

    var sheetPromise = feedUrl()
      ? fetchSheet().catch(function () { return null; })
      : Promise.resolve(null);

    return assetsPromise.then(function () {
      return sheetPromise.then(function (fromSheet) {
        if (fromSheet && fromSheet.length) {
          fromSheet = finishPosts(fromSheet);
          writeCache(fromSheet);
          return fromSheet;
        }
        return fetchFallback().then(function (posts) {
          posts = finishPosts(posts);
          writeCache(posts);
          return posts;
        });
      });
    });
  }

  function renderPostBody(post) {
    if (global.BlogRender && BlogRender.renderPostBody) {
      return BlogRender.renderPostBody(post);
    }
    return global.markdownToHtml ? markdownToHtml(post.body) : post.body;
  }

  function enhanceArticle(root) {
    if (global.BlogRender && BlogRender.enhanceArticleDom) {
      BlogRender.enhanceArticleDom(root);
    }
  }

  function getPostBySlug(posts, slug) {
    slug = String(slug || '').trim().toLowerCase();
    return posts.filter(function (p) { return p.slug === slug; })[0] || null;
  }

  function formatDate(iso) {
    if (!iso) return '';
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return iso;
    }
  }

  function articleUrl(slug) {
    return 'article.html?slug=' + encodeURIComponent(slug);
  }

  function renderArticleSchema(post, url) {
    var script = document.getElementById('article-schema');
    if (!script) return;
    var schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.meta_description || post.excerpt,
      author: { '@type': 'Organization', name: post.author || 'Kautilyan AI' },
      publisher: {
        '@type': 'Organization',
        name: 'Kautilyan AI',
        logo: { '@type': 'ImageObject', url: 'https://kautilyan.ai/favicon.ico' },
      },
      datePublished: post.published_date || undefined,
      mainEntityOfPage: url,
    };
    script.textContent = JSON.stringify(schema);
  }

  global.BlogFeed = {
    loadPosts: loadPosts,
    getPostBySlug: getPostBySlug,
    formatDate: formatDate,
    articleUrl: articleUrl,
    renderArticleSchema: renderArticleSchema,
    renderPostBody: renderPostBody,
    enhanceArticle: enhanceArticle,
    markdownToHtml: global.markdownToHtml,
  };
})(typeof window !== 'undefined' ? window : this);
