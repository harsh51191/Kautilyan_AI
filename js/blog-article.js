(function () {
  'use strict';

  var params = new URLSearchParams(window.location.search);
  var slug = params.get('slug');
  var root = document.getElementById('article-root');
  var loading = document.getElementById('article-loading');

  if (!slug) {
    window.location.replace('blog.html');
    return;
  }

  if (!root || !window.BlogFeed) return;

  BlogFeed.loadPosts().then(function (posts) {
    var post = BlogFeed.getPostBySlug(posts, slug);
    if (loading) loading.remove();

    if (!post) {
      root.innerHTML = '<p class="blog-error">Article not found. <a href="blog.html">Back to blog</a></p>';
      return;
    }

    document.title = post.title + ' | Kautilyan AI';
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', post.meta_description || post.excerpt);

    var canonical = document.querySelector('link[rel="canonical"]');
    var pageUrl = window.location.origin + window.location.pathname + '?slug=' + encodeURIComponent(post.slug);
    if (canonical) canonical.setAttribute('href', pageUrl);

    BlogFeed.renderArticleSchema(post, pageUrl);

    var bodyHtml = BlogFeed.renderPostBody
      ? BlogFeed.renderPostBody(post)
      : (BlogFeed.markdownToHtml ? BlogFeed.markdownToHtml(post.body) : '<p>' + esc(post.body) + '</p>');

    document.body.classList.add('article-page');

    root.innerHTML =
      '<div class="article-shell">' +
      '<header class="article-header">' +
      '<span class="article-label">From the team</span>' +
      '<h1 class="article-title">' + esc(post.title) + '</h1>' +
      (post.excerpt ? '<p class="article-lede">' + esc(post.excerpt) + '</p>' : '') +
      '<p class="article-meta">' + esc(BlogFeed.formatDate(post.published_date)) +
      (post.author ? ' · ' + esc(post.author) : '') + '</p>' +
      '</header>' +
      '<div class="article-body">' + bodyHtml + '</div>' +
      '</div>' +
      '<div class="article-cta">' +
      '<p>Want this applied to your operating reality?</p>' +
      '<button type="button" class="btn-hero-primary js-open-modal">Book Free Diagnosis →</button>' +
      '</div>' +
      '</div>';

    var bodyEl = root.querySelector('.article-body');
    if (bodyEl && BlogFeed.enhanceArticle) BlogFeed.enhanceArticle(bodyEl);

    root.classList.add('fade-up');
    root.classList.add('visible');
  }).catch(function () {
    if (loading) loading.textContent = 'Could not load article.';
  });

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }
})();
