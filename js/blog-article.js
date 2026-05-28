(function () {
  'use strict';

  function slugFromLocation() {
    var params = new URLSearchParams(window.location.search);
    var fromQuery = params.get('slug');
    if (fromQuery) return String(fromQuery).trim().toLowerCase();
    var path = window.location.pathname || '';
    var match = path.match(/\/blog\/([^/]+)\/?$/i);
    if (match) return decodeURIComponent(match[1]).trim().toLowerCase();
    return '';
  }

  function el(tag, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  function textEl(tag, className, text) {
    var node = el(tag, className);
    node.textContent = text || '';
    return node;
  }

  var slug = slugFromLocation();
  var root = document.getElementById('article-root');
  var loading = document.getElementById('article-loading');

  if (!slug) {
    window.location.replace(
      window.BlogFeed && BlogFeed.articlesIndexUrl
        ? BlogFeed.articlesIndexUrl()
        : 'resources.html#blog'
    );
    return;
  }

  function applyStaticArticleLinks() {
    if (!window.BlogFeed) return;
    var back = document.querySelector('.article-back');
    if (back) back.href = BlogFeed.articlesIndexUrl();
    document.querySelectorAll('[data-page-href]').forEach(function (el) {
      var page = el.getAttribute('data-page-href');
      if (page) el.href = BlogFeed.pageUrl(page);
    });
  }
  applyStaticArticleLinks();

  if (!root || !window.BlogFeed) return;

  BlogFeed.loadPosts().then(function (posts) {
    var post = BlogFeed.getPostBySlug(posts, slug);
    if (loading) loading.remove();

    if (!post) {
      root.textContent = '';
      var err = document.createElement('p');
      err.className = 'blog-error';
      var backHref = BlogFeed.articlesIndexUrl ? BlogFeed.articlesIndexUrl() : 'resources.html#blog';
      err.innerHTML = 'Article not found. <a href="' + backHref + '">Back to articles</a>';
      root.appendChild(err);
      return;
    }

    var pageUrl = window.KautilyanSEO
      ? KautilyanSEO.applyArticleMeta(post)
      : (function () {
          document.title = post.title + ' | Kautilyan AI';
          var meta = document.querySelector('meta[name="description"]');
          if (meta) meta.setAttribute('content', post.meta_description || post.excerpt);
          return BlogFeed.absoluteArticleUrl
            ? BlogFeed.absoluteArticleUrl(post.slug)
            : window.location.href;
        })();

    BlogFeed.renderArticleSchema(post, pageUrl);

    var bodyHtml = BlogFeed.renderPostBody
      ? BlogFeed.renderPostBody(post)
      : (BlogFeed.markdownToHtml ? BlogFeed.markdownToHtml(post.body) : '<p>' + esc(post.body) + '</p>');

    document.body.classList.add('article-page');
    renderArticle(post, posts, bodyHtml);

    var bodyEl = root.querySelector('.article-body');
    if (bodyEl && BlogFeed.enhanceArticle) BlogFeed.enhanceArticle(bodyEl);

    root.classList.add('fade-up');
    root.classList.add('visible');
  }).catch(function () {
    if (loading) loading.textContent = 'Could not load article.';
  });

  function renderArticle(post, posts, bodyHtml) {
    root.textContent = '';

    var layout = el('div', 'article-layout');
    var main = el('div', 'article-main');
    var shell = el('div', 'article-shell');

    var header = el('header', 'article-header');
    header.appendChild(textEl('span', 'article-label', 'From the team'));
    header.appendChild(textEl('h1', 'article-title', post.title));
    if (post.excerpt) header.appendChild(textEl('p', 'article-lede', post.excerpt));
    var metaParts = [BlogFeed.formatDate(post.published_date), post.author].filter(Boolean);
    header.appendChild(textEl('p', 'article-meta', metaParts.join(' · ')));

    var body = el('div', 'article-body');
    body.innerHTML = bodyHtml;

    shell.appendChild(header);
    shell.appendChild(body);

    var cta = el('div', 'article-cta');
    cta.appendChild(textEl('h2', 'article-cta-title', 'Ready to map your first workflow?'));
    var ctaP = textEl('p', '', 'Book a free 45-minute diagnosis - a written operating map of where AI can create measurable value. No pitch. No commitment.');
    cta.appendChild(ctaP);
    var ctaBtn = el('button', 'btn-hero-primary js-open-modal');
    ctaBtn.type = 'button';
    ctaBtn.textContent = 'Book a free diagnosis →';
    cta.appendChild(ctaBtn);

    main.appendChild(shell);
    main.appendChild(cta);

    layout.appendChild(main);
    layout.appendChild(buildSidebar(post, posts));

    root.appendChild(layout);
  }

  function buildSidebar(post, posts) {
    var aside = el('aside', 'article-sidebar');
    aside.setAttribute('aria-label', 'Related reading');

    aside.appendChild(buildRelatedBlock(post, posts));
    aside.appendChild(buildGuidesBlock());
    aside.appendChild(buildSidebarCta());

    return aside;
  }

  function buildRelatedBlock(post, posts) {
    var block = el('div', 'article-sidebar-block');
    block.appendChild(textEl('h2', 'article-sidebar-heading', 'Related articles'));

    var list = el('ul', 'article-sidebar-list article-sidebar-list--related');
    posts
      .filter(function (p) { return p.slug !== post.slug; })
      .slice(0, 3)
      .forEach(function (p) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = BlogFeed.articleUrl(p.slug);
        a.textContent = p.title;
        li.appendChild(a);
        list.appendChild(li);
      });

    block.appendChild(list);
    return block;
  }

  function buildGuidesBlock() {
    var block = el('div', 'article-sidebar-block');
    block.appendChild(textEl('h2', 'article-sidebar-heading', 'Free guides'));

    var list = el('ul', 'article-sidebar-list article-sidebar-list--guides');
    getGuideItems().forEach(function (item) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = item.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.appendChild(textEl('span', 'article-sidebar-link-title', item.title));
      a.appendChild(textEl('span', 'article-sidebar-link-desc', item.desc));
      li.appendChild(a);
      list.appendChild(li);
    });

    block.appendChild(list);
    return block;
  }

  function buildSidebarCta() {
    var block = el('div', 'article-sidebar-block article-sidebar-block--cta');
    block.appendChild(textEl('p', 'article-sidebar-cta-text', 'Want this applied to your operating reality?'));
    var btn = el('button', 'btn btn-primary js-open-modal');
    btn.type = 'button';
    btn.textContent = 'Book Stage 0 Call →';
    block.appendChild(btn);
    return block;
  }

  function resourceGuideHref(filename) {
    var path = window.location.pathname || '';
    if (path.indexOf('/data/') !== -1) {
      return filename;
    }
    return 'data/' + filename;
  }

  function getGuideItems() {
    return [
      {
        title: 'What is an AI Agent?',
        desc: "Beginner's guide · 8 min - read online",
        href: resourceGuideHref('resource-1-what-is-an-ai-agent.html'),
      },
      {
        title: 'The SLOPE Framework',
        desc: 'Strategic framework · 10 min - read online',
        href: resourceGuideHref('resource-2-slope-framework.html'),
      },
      {
        title: 'AI Implementation Roadmap',
        desc: 'Implementation playbook · 12 min - read online',
        href: resourceGuideHref('resource-3-implementation-roadmap.html'),
      },
    ];
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }
})();
