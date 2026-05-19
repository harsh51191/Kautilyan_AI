/* P1.5 — consistent global navigation on every page */
(function () {
  'use strict';

  var NAV_LINKS = [
    { href: 'how-it-works.html', label: 'How It Works', key: 'how-it-works' },
    { href: 'use-cases.html', label: 'Use Cases', key: 'use-cases' },
    { href: 'resources.html', label: 'Resources', key: 'resources' },
    { href: 'pricing.html', label: 'Pricing', key: 'pricing', id: 'nav-pricing-link' },
    { href: 'about.html', label: 'About', key: 'about' },
  ];

  function currentKey() {
    var path = (window.location.pathname || '').toLowerCase();
    if (path.indexOf('/blog/') !== -1 || path === '/article' || path.indexOf('/article') === 0) {
      return 'resources';
    }
    var page = path.split('/').pop() || 'index.html';
    if (page === '' || page === 'index.html') return 'home';
    if (page === 'article.html') return 'resources';
    return page.replace('.html', '');
  }

  function navLinks() {
    if (window.CONFIG && window.CONFIG.SHOW_NAV_PRICING === false) {
      return NAV_LINKS.filter(function (item) { return item.key !== 'pricing'; });
    }
    return NAV_LINKS;
  }

  function buildNavMenu() {
    var active = currentKey();
    var html = '';
    navLinks().forEach(function (item) {
      var cls = item.key === active ? ' class="is-current"' : '';
      var id = item.id ? ' id="' + item.id + '"' : '';
      html += '<li><a href="' + item.href + '"' + id + cls + '>' + item.label + '</a></li>';
    });
    if (active !== 'assessment') {
      html +=
        '<li class="nav-mobile-only"><button type="button" class="btn btn-primary nav-book-solid js-open-modal">Book Stage 0 Call →</button></li>';
    }
    return html;
  }

  function applyNav() {
    var menu = document.getElementById('nav-menu');
    if (!menu) return;
    menu.innerHTML = buildNavMenu();
    var cta = document.querySelector('.nav-cta');
    if (cta && currentKey() !== 'assessment') {
      if (!cta.querySelector('.js-open-modal')) {
        cta.innerHTML =
          '<button type="button" class="btn btn-primary nav-book-solid js-open-modal">Book Stage 0 Call →</button>';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyNav);
  } else {
    applyNav();
  }
})();
