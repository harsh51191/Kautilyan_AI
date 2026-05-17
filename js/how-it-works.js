(function () {
  'use strict';

  var phaseWrap = document.getElementById('phase-tabs');
  if (!phaseWrap) return;

  var railFill = document.getElementById('phase-rail-fill');
  var stepBtns = Array.from(phaseWrap.querySelectorAll('.phase-step-btn'));
  var panels = Array.from(phaseWrap.querySelectorAll('.phase-panel'));

  function activatePhase(id) {
    var idx = stepBtns.findIndex(function (b) { return b.getAttribute('data-tab') === id; });
    stepBtns.forEach(function (btn, i) {
      var active = btn.getAttribute('data-tab') === id;
      btn.classList.toggle('is-active', active);
      btn.classList.toggle('is-done', i < idx);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panels.forEach(function (p) {
      p.classList.toggle('is-active', p.getAttribute('data-panel') === id);
    });
    if (railFill && stepBtns.length > 1) {
      var pct = idx <= 0 ? 0 : (idx / (stepBtns.length - 1)) * 84;
      railFill.style.width = pct + '%';
    }
  }

  stepBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activatePhase(btn.getAttribute('data-tab'));
    });
  });

  activatePhase('phase-1');

  /* Slope cards expand on click */
  document.querySelectorAll('.slope-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('.slope-detail a')) return;
      var open = card.classList.toggle('is-open');
      var btn = card.querySelector('.acc-trigger');
      if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
})();
