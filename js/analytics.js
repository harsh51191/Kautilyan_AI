/* P2.6 — GA4 conversion events (set CONFIG.GA4_MEASUREMENT_ID to enable) */
(function () {
  'use strict';

  var cfg = window.CONFIG || {};
  var MEASUREMENT_ID = (cfg.GA4_MEASUREMENT_ID || '').trim();

  function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  function initGA() {
    if (!MEASUREMENT_ID || window.__kautilyanGAInit) return;
    window.__kautilyanGAInit = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(s);
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', MEASUREMENT_ID, { send_page_view: true });
  }

  window.KautilyanAnalytics = {
    track: function (eventName, params) {
      if (!MEASUREMENT_ID || typeof window.gtag !== 'function') {
        if (cfg.DEBUG_ANALYTICS) console.log('[analytics]', eventName, params || {});
        return;
      }
      gtag('event', eventName, params || {});
    },
    diagnosisBooked: function (detail) {
      this.track('diagnosis_booked', detail || {});
    },
    resourceDownloaded: function (detail) {
      this.track('resource_downloaded', detail || {});
    },
    assessmentStarted: function (detail) {
      this.track('assessment_started', detail || {});
    },
  };

  initGA();

  if (document.getElementById('diagnosis-intake-mount') && window.KautilyanAnalytics) {
    KautilyanAnalytics.assessmentStarted({ page: 'assessment' });
  }
})();
