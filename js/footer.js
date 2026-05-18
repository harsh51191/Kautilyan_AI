/* Shared site footer — injected into #site-footer on every page */
(function () {
  'use strict';

  var el = document.getElementById('site-footer');
  if (!el) return;

  el.className = 'site-footer';
  el.innerHTML =
    '<div class="container">' +
      '<div class="footer-top">' +
        '<div class="footer-brand">' +
          '<a href="index.html" class="footer-logo">' +
            '<span class="footer-logo-icon" aria-hidden="true">⚡</span>' +
            'Kautilyan AI' +
          '</a>' +
          '<p class="footer-tagline">AI workflow transformation for growing businesses.</p>' +
          '<p class="footer-desc">We help companies identify, redesign, and implement high-value AI workflows on existing systems.</p>' +
        '</div>' +
        '<div class="footer-nav" role="navigation" aria-label="Footer navigation">' +
          '<div class="footer-col">' +
            '<h3 class="footer-col-title">Explore</h3>' +
            '<ul>' +
              '<li><a href="how-it-works.html">How It Works</a></li>' +
              '<li><a href="use-cases.html">Use Cases</a></li>' +
              '<li><a href="pricing.html" id="footer-pricing-link">Pricing</a></li>' +
              '<li><a href="resources.html">Resources</a></li>' +
              '<li><a href="blog.html">Blog</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h3 class="footer-col-title">Company</h3>' +
            '<ul>' +
              '<li><a href="about.html">About</a></li>' +
              '<li><a href="contact.html">Contact</a></li>' +
              '<li><a href="assessment.html">Pre-call intake</a></li>' +
              '<li><button type="button" class="footer-text-btn js-open-modal">Book Stage 0 call</button></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="footer-aside">' +
          '<p class="footer-aside-label">Get in touch</p>' +
          '<a href="mailto:founders@kautilyan.com" class="footer-email">founders@kautilyan.com</a>' +
          '<button type="button" class="footer-cta-btn js-open-modal">Book Stage 0 Call →</button>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<p class="footer-legal">' +
          '<a href="privacy.html">Privacy Policy</a>' +
          ' · ' +
          '<a href="terms.html">Terms of Use</a>' +
        '</p>' +
        '<p class="footer-copy">© 2026 Kautilyan AI. All rights reserved.</p>' +
        '<p class="footer-meta">Built in Bangalore · Designed for Indian businesses and beyond</p>' +
      '</div>' +
    '</div>';
})();
