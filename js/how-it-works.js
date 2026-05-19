/* How It Works — SLOPE auto-cycle (desktop); full cards on mobile */
(function () {
  var bar = document.getElementById('slope-bar');
  if (!bar) return;

  var cells = Array.prototype.slice.call(bar.querySelectorAll('.slope-cell'));
  if (!cells.length) return;

  var INTERVAL_MS = 7000;
  var index = 0;
  var timer = null;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobileMq = window.matchMedia('(max-width: 768px)');

  function isMobile() {
    return mobileMq.matches;
  }

  function setActive(i) {
    index = i;
    cells.forEach(function (cell, j) {
      cell.classList.toggle('is-active', j === i);
    });
  }

  function next() {
    setActive((index + 1) % cells.length);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function start() {
    stop();
    if (reducedMotion || isMobile()) return;
    timer = setInterval(next, INTERVAL_MS);
  }

  function bindDesktop() {
    cells.forEach(function (cell) {
      cell.addEventListener('mouseenter', function () {
        stop();
        setActive(cells.indexOf(cell));
      });
      cell.addEventListener('focusin', function () {
        stop();
        setActive(cells.indexOf(cell));
      });
    });

    bar.addEventListener('mouseleave', function () {
      if (!reducedMotion && !isMobile()) start();
    });
  }

  function init() {
    if (isMobile()) {
      stop();
      cells.forEach(function (cell) {
        cell.classList.add('is-active');
      });
      return;
    }

    if (reducedMotion) {
      setActive(0);
      return;
    }

    setActive(0);
    bindDesktop();
    start();
  }

  init();

  if (mobileMq.addEventListener) {
    mobileMq.addEventListener('change', init);
  } else if (mobileMq.addListener) {
    mobileMq.addListener(init);
  }
})();
