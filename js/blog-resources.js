(function () {
  'use strict';

  if (!window.BlogFeed) return;

  var blogGrid = document.getElementById('resources-blog-grid');
  if (!blogGrid) return;

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  function renderBlogCards(posts) {
    if (!posts.length) {
      blogGrid.innerHTML = '<p class="blog-error">No articles yet. Check back soon.</p>';
      blogGrid.setAttribute('aria-busy', 'false');
      return;
    }

    blogGrid.innerHTML = posts.map(function (post) {
      var date = BlogFeed.formatDate(post.published_date);
      return (
        '<a href="' + BlogFeed.articleUrl(post.slug) + '" class="blog-list-card">' +
        '<span class="blog-list-meta">' + esc(date || 'Article') + ' · ' + esc(post.author || 'Team Kautilyan') + '</span>' +
        '<h2 class="blog-list-card-title">' + esc(post.title) + '</h2>' +
        '<p>' + esc(post.excerpt || post.meta_description) + '</p>' +
        '<span class="blog-list-more">Read article →</span>' +
        '</a>'
      );
    }).join('');
    blogGrid.setAttribute('aria-busy', 'false');
  }

  var cached = BlogFeed.readCache ? BlogFeed.readCache() : null;
  if (cached && cached.length) {
    renderBlogCards(cached);
  }

  var loadListing = BlogFeed.loadPostsListing || BlogFeed.loadPosts;
  loadListing({ refresh: true }).then(function (posts) {
    renderBlogCards(posts);
  }).catch(function () {
    if (!cached || !cached.length) {
      blogGrid.innerHTML = '<p class="blog-error">Could not load articles. Please refresh the page.</p>';
      blogGrid.setAttribute('aria-busy', 'false');
    }
  });
})();
