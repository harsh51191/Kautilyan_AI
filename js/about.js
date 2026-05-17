(function () {
  'use strict';

  var cfg = window.ABOUT_CONFIG || {};
  var links = cfg.linkedin || {};

  function applyLink(id, url) {
    var el = document.getElementById(id);
    if (!el) return;
    var u = (url || '').trim();
    if (u) {
      el.href = u;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    } else {
      el.href = 'https://www.linkedin.com/company/kautilyan-ai';
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    }
  }

  applyLink('founder-link-harsha', links.harsha);
  applyLink('founder-link-soumya', links.soumya);
})();
