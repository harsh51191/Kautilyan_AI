/* Shared site JS — CONFIG, modal, nav, tabs, fade-up */
(function () {
  'use strict';

  window.CONFIG = window.CONFIG || {
    SITE_URL: 'https://www.kautilyan.com',
    SHOW_PRICING: false,
    SHOW_NAV_PRICING: false,
    CAL_LINK: 'https://cal.com/kautilyan/stage-0-diagnosis',
    INTAKE_PATH: 'stage0-intake',
    ASSESSMENT_URL: '',
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxr380yBL72cXD8ZiDQqAJFVtLAd7_de67q9qvqs5hvh9-VrqD1bayuJmaMJRLGysBd0g/exec',
    BLOG_FEED_URL: 'https://script.google.com/macros/s/AKfycbwr3r44sIUeaFCbHH4Qw8Ldx_VQH08vof4SsgMR6M05Cqu7dPvTwa9WZgWzZ4dQhvXe/exec',
    GOOGLE_APPOINTMENT_URL: '',
    FOUNDERS_EMAIL: 'founders@kautilyan.com',
    GA4_MEASUREMENT_ID: '',
  };

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function assessmentUrl() {
    return (CONFIG.ASSESSMENT_URL || '').trim();
  }

  /**
   * POST to Apps Script and return parsed JSON (booking flow).
   * Uses text/plain to avoid CORS preflight on script.google.com web apps.
   */
  function postLeadCapture(u, data, useCors) {
    return fetch(u, {
      method: 'POST',
      mode: useCors ? 'cors' : 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data),
    });
  }

  window.submitToSheetsAsync = function (data) {
    var u = (CONFIG.GOOGLE_SCRIPT_URL || '').trim();
    if (!u) {
      return Promise.reject(new Error('GOOGLE_SCRIPT_URL is not set'));
    }

    return postLeadCapture(u, data, true).then(function (res) {
      return res.text().then(function (text) {
        var parsed;
        try {
          parsed = JSON.parse(text);
        } catch (parseErr) {
          throw new Error('Could not read server response. Redeploy LeadsCapture.gs as a new web app version.');
        }
        if (parsed.status === 'error') {
          throw new Error(parsed.message || 'Sheet save failed');
        }
        if (!parsed.status) {
          throw new Error('Unexpected response from lead capture script');
        }
        return parsed;
      });
    }).catch(function (err) {
      var msg = err && err.message ? err.message : '';
      var isNetwork =
        err instanceof TypeError ||
        /failed to fetch|network|cors|load failed/i.test(msg);
      if (!isNetwork) {
        return Promise.reject(err);
      }
      return postLeadCapture(u, data, false).then(function () {
        return {
          status: 'ok',
          action: data.action || 'create',
          submissionId: data.submissionId,
          fallback: true,
        };
      });
    });
  };

  /** Fire-and-forget (contact form, resource downloads). */
  window.submitToSheets = function (data) {
    if (!(CONFIG.GOOGLE_SCRIPT_URL || '').trim()) {
      console.warn('[Kautilyan] GOOGLE_SCRIPT_URL is not set — row not sent:', data);
      return false;
    }
    window.submitToSheetsAsync(data).catch(function (err) {
      console.warn('[Kautilyan] Sheet submission error:', err);
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
        el.href = 'stage0-intake.html';
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

  function getBookingModal() {
    return document.getElementById('booking-modal');
  }

  function openModal() {
    var modal = getBookingModal();
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var first = modal.querySelector('input, select, textarea, button');
    if (first) setTimeout(function () { first.focus(); }, 80);
  }

  function closeModal() {
    var modal = getBookingModal();
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  window.openBookingModal = openModal;
  window.closeBookingModal = closeModal;

  document.addEventListener('click', function (e) {
    if (e.target.closest('.js-close-modal')) {
      e.preventDefault();
      closeModal();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var modal = getBookingModal();
      if (modal && modal.classList.contains('is-open')) closeModal();
    }
  });

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
