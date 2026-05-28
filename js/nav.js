/* P1.5 - consistent global navigation on every page */
(function () {
  'use strict';

  var NAV_LINKS = [
    { href: 'how-it-works.html', label: 'How It Works', key: 'how-it-works' },
    { href: 'use-cases.html', label: 'Use Cases', key: 'use-cases' },
    { href: 'pricing.html', label: 'Pricing', key: 'pricing', id: 'nav-pricing-link' },
    { href: 'resources.html', label: 'Resources', key: 'resources' },
    { href: 'assessment.html', label: 'Free Diagnostic', key: 'assessment' },
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

  function navLinks(activeKey) {
    var links = NAV_LINKS;
    if (window.CONFIG && window.CONFIG.SHOW_NAV_PRICING === false) {
      links = links.filter(function (item) { return item.key !== 'pricing'; });
    }
    if (activeKey === 'assessment') {
      links = links.filter(function (item) { return item.key !== 'assessment'; });
    }
    return links;
  }

  function buildNavMenu() {
    var active = currentKey();
    var html = '';
    navLinks(active).forEach(function (item) {
      var cls = item.key === active ? ' class="is-current"' : '';
      var id = item.id ? ' id="' + item.id + '"' : '';
      html += '<li><a href="' + item.href + '"' + id + cls + '>' + item.label + '</a></li>';
    });
    if (active !== 'stage0-intake') {
      html +=
        '<li class="nav-mobile-only"><button type="button" class="btn btn-primary nav-book-solid js-open-modal">Book Stage 0 Call →</button></li>';
    }
    return html;
  }

  function applyNav() {
    var menu = document.getElementById('nav-menu');
    if (!menu) return;
    var active = currentKey();
    menu.innerHTML = buildNavMenu();
    var cta = document.querySelector('.nav-cta');
    if (!cta) return;
    if (active === 'stage0-intake') {
      return;
    }
    cta.innerHTML =
      '<button type="button" class="btn btn-primary nav-book-solid js-open-modal">Book Stage 0 Call →</button>';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyNav);
  } else {
    applyNav();
  }
})();
