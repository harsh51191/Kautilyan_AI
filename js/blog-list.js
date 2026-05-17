(function () {
  'use strict';

  var grid = document.getElementById('blog-list-grid');
  var loading = document.getElementById('blog-loading');
  if (!grid || !window.BlogFeed) return;

  BlogFeed.loadPosts().then(function (posts) {
    if (loading) loading.remove();
    if (!posts.length) {
      grid.innerHTML = '<p class="blog-error">No posts yet. Check back soon.</p>';
      return;
    }
    grid.innerHTML = posts.map(function (post) {
      var date = BlogFeed.formatDate(post.published_date);
      return (
        '<a class="blog-list-card fade-up" href="' + BlogFeed.articleUrl(post.slug) + '">' +
        '<span class="blog-list-meta">' + (date || 'Article') + ' · ' + (post.author || 'Kautilyan') + '</span>' +
        '<h3>' + escapeHtml(post.title) + '</h3>' +
        '<p>' + escapeHtml(post.excerpt || post.meta_description) + '</p>' +
        '<span class="blog-list-more">Read article →</span>' +
        '</a>'
      );
    }).join('');
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.08 });
      grid.querySelectorAll('.fade-up').forEach(function (el) { obs.observe(el); });
    }
  }).catch(function () {
    if (loading) loading.textContent = 'Could not load posts. Please refresh.';
  });

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }
})();
