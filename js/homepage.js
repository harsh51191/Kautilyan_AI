(function () {
  'use strict';

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('#nav-menu .js-open-modal').forEach(function (link) {
      link.addEventListener('click', function () {
        var nav = document.getElementById('navbar');
        var btn = document.getElementById('hamburger');
        if (nav) nav.classList.remove('mobile-open');
        if (btn) {
          btn.setAttribute('aria-expanded', 'false');
          btn.setAttribute('aria-label', 'Open menu');
        }
      });
    });

    /* ——— Sticky CTA ——— */
    var stickyDesktop = document.getElementById('sticky-cta');
    var stickyMobile = document.getElementById('sticky-bar');
    var hero = document.querySelector('.hero');

    function updateSticky() {
      if (!hero) return;
      var past = window.scrollY > hero.offsetHeight * 0.85;
      if (stickyDesktop) stickyDesktop.classList.toggle('is-visible', past);
      if (stickyMobile) stickyMobile.classList.toggle('is-visible', past);
    }
    window.addEventListener('scroll', updateSticky, { passive: true });
    updateSticky();

    var siteFooter = document.querySelector('.site-footer');
    if (siteFooter && stickyDesktop && 'IntersectionObserver' in window) {
      var footerCtaObserver = new IntersectionObserver(
        function (entries) {
          stickyDesktop.classList.toggle('is-hidden-footer', entries[0].isIntersecting);
        },
        { rootMargin: '0px 0px -80px 0px', threshold: 0.05 }
      );
      footerCtaObserver.observe(siteFooter);
    }

    /* ——— Hero path strip — one stage highlighted at a time ——— */
    var heroPathMini = document.getElementById('hero-path-mini');
    var pathSteps = heroPathMini ? qsa('.hero-path-step', heroPathMini) : [];
    var pathArrows = heroPathMini ? qsa('.hero-path-arrow', heroPathMini) : [];
    var pathOneliner = document.getElementById('hero-path-oneliner');
    var pathProgressFill = document.getElementById('hero-path-progress-fill');
    var pathLines = [
      'No sales deck. No product demo. Just a blueprint you can keep — even if you never hire us.',
      'Proof of value on your data in 72 hours — before you commit to a pilot.',
      '45-day pilot with a guaranteed outcome or full refund.',
    ];
    var pathProgress = [0, 50, 100];
    var heroPathTimer = null;

    function setHeroPathStage(idx) {
      pathSteps.forEach(function (s, i) {
        s.classList.toggle('is-active', i === idx);
      });
      pathArrows.forEach(function (a, i) {
        a.classList.remove('is-active', 'is-lit');
        a.classList.toggle('is-active', i === idx - 1);
      });
      if (pathProgressFill) pathProgressFill.style.width = pathProgress[idx] + '%';
      if (pathOneliner && pathLines[idx]) {
        pathOneliner.classList.add('is-changing');
        setTimeout(function () {
          pathOneliner.textContent = pathLines[idx];
          pathOneliner.classList.remove('is-changing');
        }, 220);
      }
    }

    function startHeroPathLoop() {
      if (!pathSteps.length || (heroPathMini && heroPathMini.dataset.spotlightInit)) return;
      if (heroPathMini) heroPathMini.dataset.spotlightInit = '1';
      setHeroPathStage(0);
      if (prefersReducedMotion) return;
      if (heroPathTimer) clearInterval(heroPathTimer);
      var pathIdx = 0;
      heroPathTimer = setInterval(function () {
        pathIdx = (pathIdx + 1) % pathSteps.length;
        setHeroPathStage(pathIdx);
      }, 3200);
    }

    startHeroPathLoop();

    /* ——— Drain cards expand ——— */
    qsa('.drain-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var open = card.classList.toggle('is-open');
        card.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });

    /* ——— Generic tabs ——— */
    qsa('[data-tabs]').forEach(function (wrap) {
      var tabs = qsa('[data-tab]', wrap);
      var panels = qsa('[data-panel]', wrap);
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          var id = tab.getAttribute('data-tab');
          tabs.forEach(function (t) {
            var active = t === tab;
            t.classList.toggle('is-active', active);
            t.setAttribute('aria-selected', active ? 'true' : 'false');
          });
          panels.forEach(function (p) {
            p.classList.toggle('is-active', p.getAttribute('data-panel') === id);
          });
          tab.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
        });
      });
    });

    /* ——— Decision flow — progressive reveal ——— */
    var decisionFlow = document.getElementById('decision-flow');
    if (decisionFlow && 'IntersectionObserver' in window) {
      var flowSteps = qsa('.decision-flow-step', decisionFlow);
      var progressFill = qs('.decision-flow-progress-fill', decisionFlow);
      var animated = false;

      function setFlowProgress(activeIndex) {
        var pct = flowSteps.length <= 1 ? 0 : (activeIndex / (flowSteps.length - 1)) * 100;
        decisionFlow.style.setProperty('--flow-progress', pct + '%');
        if (progressFill) progressFill.style.width = pct + '%';
        flowSteps.forEach(function (step, i) {
          step.classList.toggle('is-done', i < activeIndex);
          step.classList.toggle('is-active', i === activeIndex);
        });
      }

      var flowIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting || animated) return;
            animated = true;
            decisionFlow.classList.add('is-animated');
            var idx = 0;
            setFlowProgress(0);
            var timer = setInterval(function () {
              idx++;
              if (idx >= flowSteps.length) {
                clearInterval(timer);
                flowSteps.forEach(function (s) {
                  s.classList.add('is-done');
                  s.classList.remove('is-active');
                });
                flowSteps[flowSteps.length - 1].classList.add('is-active');
                setFlowProgress(flowSteps.length - 1);
                return;
              }
              setFlowProgress(idx);
            }, 700);
          });
        },
        { threshold: 0.35 }
      );
      flowIo.observe(decisionFlow);
    }

    /* ——— FAQ accordion ——— */
    var faqMoreBtn = document.getElementById('faq-show-more');
    var faqExtra = document.getElementById('faq-extra');
    if (faqMoreBtn && faqExtra) {
      faqMoreBtn.addEventListener('click', function () {
        var show = faqExtra.hidden;
        faqExtra.hidden = !show;
        faqMoreBtn.textContent = show ? 'Show fewer questions' : 'View more questions';
        faqMoreBtn.setAttribute('aria-expanded', show ? 'true' : 'false');
      });
    }

    qsa('.faq-card--accordion').forEach(function (card) {
      var btn = qs('.faq-accordion-trigger', card);
      if (!btn) return;
      btn.addEventListener('click', function () {
        var open = card.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });

    /* ——— Diagnosis map steps ——— */
    if ('IntersectionObserver' in window) {
      var mapSteps = qsa('.diag-step');
      if (mapSteps.length) {
        var mapIo = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) entry.target.classList.add('is-lit');
            });
          },
          { threshold: 0.5, rootMargin: '0px 0px -10% 0px' }
        );
        mapSteps.forEach(function (s) { mapIo.observe(s); });
      }
    }

    /* ——— Hash: open modal on load ——— */
    if (window.location.hash === '#request-call' || window.location.hash === '#book-call') {
      setTimeout(function () {
        if (window.KautilyanBooking) KautilyanBooking.open();
        else openBookingModal();
      }, 300);
    }
  });
})();
