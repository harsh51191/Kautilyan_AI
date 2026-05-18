(function () {
  'use strict';

  var cfg = window.ABOUT_CONFIG || {};
  var links = cfg.linkedin || {};
  var PLACEHOLDER = '#';

  function applyFounderLinkedIn(el) {
    if (!el) return;
    var u = (links.soumya || '').trim();
    if (u && u !== PLACEHOLDER) {
      el.href = u;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    } else {
      el.href = PLACEHOLDER;
      el.removeAttribute('target');
      el.removeAttribute('rel');
      el.addEventListener('click', function (e) {
        e.preventDefault();
      });
    }
  }

  document.querySelectorAll('#founder-link-soumya, [data-founder-linkedin="soumya"]').forEach(applyFounderLinkedIn);

  var companyUrl = (links.company || '').trim();
  document.querySelectorAll('[data-founder-linkedin="company"]').forEach(function (el) {
    if (companyUrl && companyUrl !== PLACEHOLDER) {
      el.href = companyUrl;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    }
  });
})();
