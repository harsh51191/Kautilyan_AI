(function () {
  'use strict';

  if (!window.BlogFeed) return;

  var STARTERS = [
    { key: 'ceo-mandate', label: 'My CEO has an AI mandate. Where do I actually start?' },
    { key: 'tools-unchanged', label: "We've bought AI tools. Nothing has fundamentally changed." },
    { key: 'escalations', label: 'Every important decision still escalates to the same people.' },
    { key: 'knowledge-loss', label: 'We lose years of context every time someone leaves.' },
    { key: 'coordination', label: "We're spending days on coordination that should take hours." },
  ];

  var blogGrid = document.getElementById('resources-blog-grid');
  var starterGrid = document.querySelector('.starter-grid');

  BlogFeed.loadPosts().then(function (posts) {
    renderBlogCards(posts);
    wireStarters(posts);
  });

  function renderBlogCards(posts) {
    if (!blogGrid) return;
    blogGrid.innerHTML = posts.map(function (post, i) {
      return (
        '<a href="' + BlogFeed.articleUrl(post.slug) + '" class="blog-card">' +
        '<span class="blog-num">' + (i + 1) + '</span>' +
        '<h4>' + esc(post.title) + '</h4>' +
        '<span class="blog-card-arrow" aria-hidden="true">→</span>' +
        '</a>'
      );
    }).join('');
  }

  function wireStarters(posts) {
    if (!starterGrid) return;
    var byKey = {};
    posts.forEach(function (p) {
      if (p.thought_starter_key) byKey[p.thought_starter_key] = p;
    });

    starterGrid.innerHTML = STARTERS.map(function (s) {
      return (
        '<button type="button" class="starter-card" data-thought-key="' + escAttr(s.key) + '" role="listitem">' +
        '<span class="starter-card-arrow">→</span> ' + esc(s.label) +
        '</button>'
      );
    }).join('');

    var slugOverrides = {
      coordination: 'ai-implementation-where-to-start',
    };

    starterGrid.querySelectorAll('.starter-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-thought-key');
        if (slugOverrides[key]) {
          window.location.href = BlogFeed.articleUrl(slugOverrides[key]);
          return;
        }
        var post = byKey[key];
        if (post) {
          window.location.href = BlogFeed.articleUrl(post.slug);
          return;
        }
        var target = document.getElementById('blog');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function escAttr(s) {
    return String(s).replace(/"/g, '&quot;');
  }
})();
