(function () {
  'use strict';

  /* Highlight active tab in scroll nav on mobile - optional enhancement */
  var wrap = document.getElementById('usecase-tabs');
  if (!wrap) return;

  var tabs = wrap.querySelectorAll('[data-tab]');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var panelId = tab.getAttribute('data-tab');
      var panel = wrap.querySelector('[data-panel="' + panelId + '"]');
      if (panel) {
        setTimeout(function () {
          panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 80);
      }
    });
  });
})();
