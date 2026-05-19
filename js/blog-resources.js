(function () {
  'use strict';

  if (!window.BlogFeed) return;

  var blogGrid = document.getElementById('resources-blog-grid');

  BlogFeed.loadPosts().then(function (posts) {
    renderBlogCards(posts);
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

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }
})();
