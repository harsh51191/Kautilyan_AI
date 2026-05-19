(function () {
  'use strict';

  var wrap = document.getElementById('usecase-tabs');
  if (!wrap) return;

  var tabs = Array.prototype.slice.call(wrap.querySelectorAll('[data-tab]'));
  var panels = Array.prototype.slice.call(wrap.querySelectorAll('[data-panel]'));
  if (!tabs.length) return;

  var INTERVAL_MS = 6000;
  var timer = null;
  var currentIndex = 0;
  var paused = false;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  wrap.classList.add('is-auto-tabs');

  function activateTab(tabEl) {
    var id = tabEl.getAttribute('data-tab');
    tabs.forEach(function (t) {
      var active = t === tabEl;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panels.forEach(function (p) {
      var active = p.getAttribute('data-panel') === id;
      p.classList.toggle('is-active', active);
      p.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
    currentIndex = tabs.indexOf(tabEl);
    if (currentIndex < 0) currentIndex = 0;
    tabEl.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'nearest'
    });
  }

  function nextTab() {
    activateTab(tabs[(currentIndex + 1) % tabs.length]);
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function startTimer() {
    if (reducedMotion || paused || document.hidden) return;
    stopTimer();
    timer = setInterval(nextTab, INTERVAL_MS);
  }

  function resetTimer() {
    stopTimer();
    startTimer();
  }

  tabs.forEach(function (t, i) {
    if (t.classList.contains('is-active')) currentIndex = i;
  });

  panels.forEach(function (p) {
    if (!p.classList.contains('is-active')) p.setAttribute('aria-hidden', 'true');
  });

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      activateTab(tab);
      resetTimer();
    });
  });

  wrap.addEventListener('mouseenter', function () {
    paused = true;
    stopTimer();
  });

  wrap.addEventListener('mouseleave', function () {
    paused = false;
    startTimer();
  });

  wrap.addEventListener('focusin', function () {
    paused = true;
    stopTimer();
  });

  wrap.addEventListener('focusout', function (e) {
    if (!wrap.contains(e.relatedTarget)) {
      paused = false;
      startTimer();
    }
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopTimer();
    else startTimer();
  });

  if (!reducedMotion) startTimer();
})();
