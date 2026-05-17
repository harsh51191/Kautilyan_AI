/* Shared site JS — CONFIG, modal, nav, tabs, fade-up */
(function () {
  'use strict';

  window.CONFIG = window.CONFIG || {
    SHOW_PRICING: false,
    SHOW_NAV_PRICING: true,
    CAL_LINK: '',
    ASSESSMENT_URL: '',
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxr380yBL72cXD8ZiDQqAJFVtLAd7_de67q9qvqs5hvh9-VrqD1bayuJmaMJRLGysBd0g/exec',
    BLOG_FEED_URL: 'https://script.google.com/macros/s/AKfycbwr3r44sIUeaFCbHH4Qw8Ldx_VQH08vof4SsgMR6M05Cqu7dPvTwa9WZgWzZ4dQhvXe/exec',
    GOOGLE_APPOINTMENT_URL: '',
    FOUNDERS_EMAIL: 'founders@kautilyan.com',
  };

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function assessmentUrl() {
    return (CONFIG.ASSESSMENT_URL || '').trim();
  }

  window.submitToSheets = function (data) {
    var u = (CONFIG.GOOGLE_SCRIPT_URL || '').trim();
    if (!u) {
      console.warn('[Kautilyan] GOOGLE_SCRIPT_URL is not set — row not sent:', data);
      return false;
    }
    fetch(u, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(function (err) {
      console.warn('[Kautilyan] Sheet submission fetch error:', err);
    });
    return true;
  };

  var toastTimer;
  window.showToast = function (msg, type) {
    type = type || 'success';
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.className = 'toast toast-' + type + ' show';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 4500);
  };

  function applyExternalLinks() {
    document.querySelectorAll('.assessment-external-link').forEach(function (el) {
      var url = assessmentUrl();
      if (url) {
        el.href = url;
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
      } else {
        el.href = 'assessment.html';
        el.removeAttribute('target');
        el.removeAttribute('rel');
      }
    });
  }

  function applyPricingVisibility() {
    if (!CONFIG.SHOW_PRICING) {
      var pricingSection = document.getElementById('pricing');
      if (pricingSection) pricingSection.style.display = 'none';
    }
    if (CONFIG.SHOW_NAV_PRICING === false) {
      qsa('#nav-pricing-link, #footer-pricing-link').forEach(function (el) {
        if (!el) return;
        var li = el.closest('li');
        if (li) li.style.display = 'none';
        else el.style.display = 'none';
      });
    }
  }

  /* Modal */
  var modal = document.getElementById('booking-modal');
  var modalForm = document.getElementById('modal-call-form');

  function openModal() {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var first = modal.querySelector('input, select, textarea, button');
    if (first) setTimeout(function () { first.focus(); }, 80);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('.js-open-modal')) {
      e.preventDefault();
      openModal();
    }
  });
  window.openBookingModal = openModal;

  qsa('.js-close-modal').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      closeModal();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) closeModal();
  });

  if (modalForm) {
    modalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var payload = {
        name: qs('#mf-name', modalForm).value.trim(),
        email: qs('#mf-email', modalForm).value.trim(),
        company: qs('#mf-company', modalForm).value.trim(),
        role: qs('#mf-role', modalForm).value,
        painPoints: qs('#mf-workflow', modalForm).value.trim(),
        source: 'modal_diagnosis',
        message: qs('#mf-slot', modalForm).value.trim(),
      };
      submitToSheets(payload);
      showToast('Request sent. We will reach out shortly.', 'success');
      modalForm.reset();
      closeModal();
    });
  }

  /* Sticky CTA */
  var stickyDesktop = document.getElementById('sticky-cta');
  var stickyMobile = document.getElementById('sticky-bar');
  var hero = document.querySelector('.hero, .page-hero');

  function updateSticky() {
    if (!hero) return;
    var past = window.scrollY > hero.offsetHeight * 0.7;
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

  /* Tabs */
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
      });
    });
  });

  /* Accordion */
  qsa('.acc-card').forEach(function (card) {
    var btn = qs('.acc-trigger', card);
    if (!btn) return;
    btn.addEventListener('click', function () {
      var open = card.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* Nav */
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  var hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', function () {
      var nav = document.getElementById('navbar');
      var open = nav.classList.toggle('mobile-open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  qsa('#nav-menu a').forEach(function (link) {
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

  /* Fade-up */
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (el) {
        if (el.isIntersecting) {
          el.target.classList.add('visible');
          observer.unobserve(el.target);
        }
      });
    }, { threshold: 0.1 });
    qsa('.fade-up').forEach(function (el) { observer.observe(el); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyExternalLinks();
    applyPricingVisibility();
  });
})();
