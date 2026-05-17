(function () {
  'use strict';

  /* FAQ accordion (pricing page) */
  document.querySelectorAll('.faq-card--accordion').forEach(function (card) {
    var btn = card.querySelector('.faq-accordion-trigger');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isOpen = card.classList.contains('is-open');
      document.querySelectorAll('.pricing-faq-list .faq-card--accordion').forEach(function (c) {
        c.classList.remove('is-open');
        var t = c.querySelector('.faq-accordion-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        card.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* Optional: pre-fill modal for blueprint / pilot CTAs */
  document.querySelectorAll('[data-booking-intent]').forEach(function (el) {
    el.addEventListener('click', function () {
      var intent = el.getAttribute('data-booking-intent');
      var workflow = document.getElementById('mf-workflow');
      if (!workflow || !intent) return;
      var hints = {
        blueprint: 'Interested in Proof of Value Blueprint (Stage 1)',
        pilot: 'Interested in 45-day Proof of Value Pilot (Stage 2)',
      };
      if (hints[intent] && !workflow.value.trim()) {
        workflow.placeholder = hints[intent];
      }
    });
  });
})();
