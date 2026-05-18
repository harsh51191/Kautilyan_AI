/* Shared SEO helpers — canonical URLs for www.kautilyan.com */
(function (global) {
  'use strict';

  var DEFAULT_SITE_URL = 'https://www.kautilyan.com';

  function siteUrl() {
    var cfg = global.CONFIG || {};
    return String(cfg.SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');
  }

  function pageUrl(path) {
    var base = siteUrl();
    if (!path || path === '/') return base + '/';
    return base + (path.charAt(0) === '/' ? path : '/' + path);
  }

  function blogArticleUrl(slug) {
    return pageUrl('/blog/' + encodeURIComponent(String(slug || '').trim().toLowerCase()));
  }

  function setMeta(attr, key, value) {
    if (!value) return;
    var sel = attr === 'property'
      ? 'meta[property="' + key + '"]'
      : 'meta[name="' + key + '"]';
    var el = document.querySelector(sel);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  }

  function applyArticleMeta(post) {
    if (!post) return;
    var url = blogArticleUrl(post.slug);
    var title = post.title + ' | Kautilyan AI';
    var description = post.meta_description || post.excerpt || '';

    document.title = title;
    setMeta('name', 'description', description);

    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', url);

    setMeta('property', 'og:type', 'article');
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);

    return url;
  }

  global.KautilyanSEO = {
    siteUrl: siteUrl,
    pageUrl: pageUrl,
    blogArticleUrl: blogArticleUrl,
    applyArticleMeta: applyArticleMeta,
  };
})(typeof window !== 'undefined' ? window : this);
