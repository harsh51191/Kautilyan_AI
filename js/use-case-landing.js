(function () {
  'use strict';

  var params = new URLSearchParams(window.location.search);
  var slug = (params.get('slug') || '').trim().toLowerCase();
  var root = document.getElementById('uc-landing-root');

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  function slugFromPath() {
    var path = window.location.pathname || '';
    var m = path.match(/\/use-cases\/([^/]+)\/?$/i);
    return m ? decodeURIComponent(m[1]).trim().toLowerCase() : '';
  }

  if (!slug) slug = slugFromPath();
  if (!slug || !root) {
    if (!slug) window.location.replace('use-cases.html');
    return;
  }

  fetch('/data/use-cases-landing.json', { cache: 'default' })
    .then(function (r) {
      if (!r.ok) throw new Error('load failed');
      return r.json();
    })
    .then(function (data) {
      var uc = data[slug];
      if (!uc) {
        root.innerHTML = '<p class="blog-error">Use case not found. <a href="use-cases.html">Back to use cases</a></p>';
        return;
      }
      render(uc, slug);
    })
    .catch(function () {
      root.innerHTML = '<p class="blog-error">Could not load this page. <a href="use-cases.html">Back to use cases</a></p>';
    });

  function render(uc, slugKey) {
    document.title = uc.title + ' | Kautilyan AI';
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', uc.metaDescription);
    var canonical = document.querySelector('link[rel="canonical"]');
    var pageUrl = (window.KautilyanSEO ? KautilyanSEO.pageUrl('/use-cases/' + slugKey) : 'https://www.kautilyan.com/use-cases/' + slugKey);
    if (canonical) canonical.setAttribute('href', pageUrl);

    var schemaEl = document.getElementById('uc-service-schema');
    if (schemaEl) {
      schemaEl.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: uc.title,
        description: uc.metaDescription,
        provider: { '@type': 'Organization', name: 'Kautilyan AI', url: 'https://www.kautilyan.com/' },
        areaServed: 'IN',
        url: pageUrl,
      });
    }

    var doesList = uc.does.map(function (item) {
      return '<li>' + esc(item) + '</li>';
    }).join('');

    var caseBlock = '';
    if (uc.caseStudySlug) {
      caseBlock =
        '<p class="uc-landing-case"><a href="case-studies/' + esc(uc.caseStudySlug) + '.html">Read the anonymised outcome story →</a></p>';
    }

    root.innerHTML =
      '<section class="hero page-hero page-hero--uc-landing">' +
        '<div class="hero-container">' +
          '<div class="hero-badge fade-up">Use case</div>' +
          '<h1 class="hero-headline hero-title fade-up">' + esc(uc.headline) + '</h1>' +
          '<p class="hero-lead fade-up">' + esc(uc.lede) + '</p>' +
          '<div class="hero-cta-row fade-up">' +
            '<button type="button" class="btn-hero-primary js-open-modal" data-booking-intent="' + esc(uc.bookingIntent) + '" data-booking-prefill="' + esc('I want to diagnose my ' + uc.bookingIntent + ' workflow') + '">Book Stage 0 Call →</button>' +
            '<a href="use-cases.html" class="btn-hero-secondary">All use cases</a>' +
          '</div>' +
        '</div>' +
      '</section>' +
      '<section class="content-section">' +
        '<div class="container uc-landing-body">' +
          '<h2 class="section-headline">The situation</h2>' +
          '<p class="section-intro">' + esc(uc.situation) + '</p>' +
          '<h2 class="section-headline">What Kautilyan does</h2>' +
          '<ul class="uc-landing-list">' + doesList + '</ul>' +
          '<div class="uc-landing-metric"><span class="label">Possible proof metric</span><p>' + esc(uc.proofMetric) + '</p></div>' +
          '<p class="section-intro"><strong>Who this is for:</strong> ' + esc(uc.forWho) + '</p>' +
          caseBlock +
          '<div class="uc-landing-cta">' +
            '<button type="button" class="btn btn-primary btn-xl js-open-modal" data-booking-intent="' + esc(uc.bookingIntent) + '" data-booking-prefill="' + esc('I want to diagnose my ' + uc.bookingIntent + ' workflow') + '">Diagnose this workflow →</button>' +
          '</div>' +
        '</div>' +
      '</section>';

    document.body.classList.add('uc-landing-page');
    root.classList.add('visible');
  }
})();
