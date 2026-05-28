/* How It Works - SLOPE cards: equal size by default, expand on hover or click */
(function () {
  var bar = document.getElementById('slope-bar');
  if (!bar) return;

  var cells = Array.prototype.slice.call(bar.querySelectorAll('.slope-cell'));
  if (!cells.length) return;

  function pinCell(cell) {
    cells.forEach(function (c) {
      c.classList.remove('is-pinned');
      c.setAttribute('aria-expanded', 'false');
    });
    cell.classList.add('is-pinned');
    cell.setAttribute('aria-expanded', 'true');
  }

  function unpinAll() {
    cells.forEach(function (c) {
      c.classList.remove('is-pinned');
      c.setAttribute('aria-expanded', 'false');
    });
  }

  cells.forEach(function (cell) {
    cell.addEventListener('click', function () {
      if (cell.classList.contains('is-pinned')) {
        unpinAll();
      } else {
        pinCell(cell);
      }
    });

    cell.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      if (cell.classList.contains('is-pinned')) {
        unpinAll();
      } else {
        pinCell(cell);
      }
    });
  });
})();
