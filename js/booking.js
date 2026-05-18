/* Unified Stage 0 intake: Google Sheets → Cal.com (all pages) */
(function () {
  'use strict';

  var FORM_ID = 'diagnosis-intake-form';
  var MODAL_TITLE = 'Book your Stage 0 call';
  var INTAKE_SUB =
    'Answer these five questions so we can prepare your diagnosis around your actual operating reality, not give you a generic AI demo. Then pick your time on Cal.com.';

  function cfg() {
    return window.CONFIG || {};
  }

  function calUrl() {
    return (cfg().CAL_LINK || 'https://cal.com/kautilyan/stage-0-diagnosis').trim();
  }

  function formFieldsHTML() {
    return (
      '<div class="cr-row">' +
        '<div class="cr-group"><label class="cr-label" for="di-name">Full name *</label>' +
        '<input id="di-name" name="name" class="cr-input" required autocomplete="name" /></div>' +
        '<div class="cr-group"><label class="cr-label" for="di-email">Work email *</label>' +
        '<input id="di-email" name="email" class="cr-input" type="email" required autocomplete="email" /></div>' +
      '</div>' +
      '<div class="cr-group"><label class="cr-label" for="di-company">Company</label>' +
      '<input id="di-company" name="company" class="cr-input" autocomplete="organization" /></div>' +
      '<div class="cr-group full"><label class="cr-label" for="di-q1">1. What made you explore Kautilyan / AI workflow transformation now?</label>' +
      '<textarea id="di-q1" name="q1" class="cr-textarea" rows="2" required></textarea></div>' +
      '<div class="cr-group full"><label class="cr-label" for="di-q2">2. What is your role, and what business outcome are you personally responsible for this quarter or year?</label>' +
      '<textarea id="di-q2" name="q2" class="cr-textarea" rows="2" required></textarea></div>' +
      '<div class="cr-group full"><label class="cr-label" for="di-q3">3. Which workflow feels most painful, slow, manual, risky, or dependent on a few people today?</label>' +
      '<textarea id="di-q3" name="q3" class="cr-textarea" rows="2" required></textarea></div>' +
      '<div class="cr-group full"><label class="cr-label" for="di-q4">4. What would make the 45-minute diagnosis call genuinely valuable for you?</label>' +
      '<textarea id="di-q4" name="q4" class="cr-textarea" rows="2" required></textarea></div>' +
      '<div class="cr-group full"><label class="cr-label" for="di-q5">5. What systems or tools are involved today?</label>' +
      '<p class="cr-hint">Examples: ERP, CRM, Excel/Sheets, WhatsApp, email, BI dashboards, custom software, ticketing tools.</p>' +
      '<textarea id="di-q5" name="q5" class="cr-textarea" rows="2" required></textarea></div>' +
      '<div class="cr-group full"><label class="cr-label" for="di-upload">Optional: upload anything useful before the call</label>' +
      '<p class="cr-hint">SOP, tracker, report, process note, sample artifact, dashboard screenshot, deck, or workflow document.</p>' +
      '<input id="di-upload" name="upload" class="cr-input cr-file" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.csv,.txt" />' +
      '<p class="cr-hint">Files over 5 MB: email to <a href="mailto:founders@kautilyan.com">founders@kautilyan.com</a> after booking.</p></div>' +
      '<button type="submit" class="cr-submit">Submit &amp; pick your time on Cal.com →</button>' +
      '<p class="cr-foot">By submitting, you agree to our <a href="privacy.html">Privacy Policy</a>. Your answers are saved so we can prepare your diagnosis — not a generic AI demo.</p>'
    );
  }


  function isPageForm(form) {
    return form && form.id === FORM_ID + '-page';
  }

  function modalHTML() {
    return (
      '<div id="booking-modal" class="booking-modal" aria-hidden="true" role="dialog" aria-labelledby="modal-title" aria-modal="true">' +
        '<div class="booking-modal-backdrop js-close-modal"></div>' +
        '<div class="booking-modal-panel booking-modal-panel--wide">' +
          '<button type="button" class="booking-modal-close js-close-modal" aria-label="Close">×</button>' +
          '<h2 id="modal-title">' + MODAL_TITLE + '</h2>' +
          '<p class="modal-sub">' + INTAKE_SUB + '</p>' +
          '<form id="' + FORM_ID + '" class="call-request-form diagnosis-intake-form" novalidate>' +
            formFieldsHTML() +
          '</form>' +
        '</div>' +
      '</div>'
    );
  }

  function syncModalChrome(modal) {
    if (!modal) return;
    var panel = modal.querySelector('.booking-modal-panel');
    if (panel) panel.classList.add('booking-modal-panel--wide');
    var title = modal.querySelector('#modal-title');
    var sub = modal.querySelector('.modal-sub');
    if (title) title.textContent = MODAL_TITLE;
    if (sub) sub.textContent = INTAKE_SUB;
  }

  function ensureModal() {
    var existing = document.getElementById('booking-modal');
    if (existing) {
      var form = existing.querySelector('form');
      if (form) {
        form.id = FORM_ID;
        form.className = 'call-request-form diagnosis-intake-form';
        form.innerHTML = formFieldsHTML();
        form.removeAttribute('data-bound');
      }
      syncModalChrome(existing);
      return existing;
    }
    document.body.insertAdjacentHTML('beforeend', modalHTML());
    var modal = document.getElementById('booking-modal');
    syncModalChrome(modal);
    return modal;
  }

  function mountPageForm() {
    var mount = document.getElementById('diagnosis-intake-mount');
    if (!mount) return;
    mount.innerHTML =
      '<div class="intake-page-header">' +
        '<span class="label">Stage 0 — pre-call intake</span>' +
        '<h1>Prepare your 45-minute diagnosis</h1>' +
        '<p class="intake-lede">' + INTAKE_SUB + '</p>' +
      '</div>' +
      '<form id="' + FORM_ID + '-page" class="call-request-form diagnosis-intake-form diagnosis-intake-form--page" novalidate>' +
        formFieldsHTML() +
      '</form>';
    bindForm(document.getElementById(FORM_ID + '-page'));
  }

  function buildPayload(form) {
    var q = function (sel) {
      var el = form.querySelector(sel);
      return el ? el.value.trim() : '';
    };
    var upload = form.querySelector('[name="upload"]');
    var uploadNote = '';
    if (upload && upload.files && upload.files[0]) {
      var f = upload.files[0];
      uploadNote = 'Upload: ' + f.name + ' (' + Math.round(f.size / 1024) + ' KB)';
    }
    var answers = [];
    var intent = form.getAttribute('data-booking-intent') || '';
    if (intent) answers.push('Intent: ' + intent);

    answers.push(
      'Q1 — Why now: ' + q('[name="q1"]'),
      'Q2 — Role & outcome: ' + q('[name="q2"]'),
      'Q3 — Painful workflow: ' + q('[name="q3"]'),
      'Q4 — Value from call: ' + q('[name="q4"]'),
      'Q5 — Systems/tools: ' + q('[name="q5"]')
    );
    if (uploadNote) answers.push(uploadNote);

    return {
      name: q('[name="name"]'),
      email: q('[name="email"]'),
      company: q('[name="company"]'),
      phone: '',
      role: q('[name="q2"]').slice(0, 200),
      teamSize: '',
      revenue: '',
      painPoints: answers,
      heardFrom: '',
      source: isPageForm(form) ? 'stage0_intake_full' : 'stage0_intake',
      score: '',
      message: 'Cal.com scheduling after intake',
    };
  }

  function validateForm(form) {
    if (!form.querySelector('[name="name"]').value.trim()) {
      showToast('Please enter your name.', 'error');
      return false;
    }
    if (!form.querySelector('[name="email"]').value.trim() || form.querySelector('[name="email"]').value.indexOf('@') < 1) {
      showToast('Please enter a valid work email.', 'error');
      return false;
    }
    var required = ['[name="q1"]', '[name="q2"]', '[name="q3"]', '[name="q4"]', '[name="q5"]'];
    for (var i = 0; i < required.length; i++) {
      if (!form.querySelector(required[i]).value.trim()) {
        showToast('Please answer all five questions before continuing.', 'error');
        return false;
      }
    }
    return true;
  }

  function showToast(msg, type) {
    if (typeof window.showToast === 'function') window.showToast(msg, type);
  }

  function bindForm(form) {
    if (!form || form.dataset.bound === '1') return;
    form.dataset.bound = '1';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(form)) return;
      var payload = buildPayload(form);
      if (!(cfg().GOOGLE_SCRIPT_URL || '').trim()) {
        showToast('Lead capture is not configured. Email founders@kautilyan.com to book.', 'error');
        return;
      }
      if (typeof window.submitToSheets === 'function') submitToSheets(payload);
      if (window.KautilyanAnalytics) {
        KautilyanAnalytics.diagnosisBooked({
          source: payload.source,
          intent: form.getAttribute('data-booking-intent') || '',
        });
      }
      form.reset();
      if (typeof window.closeBookingModal === 'function') window.closeBookingModal();
      showToast('Answers saved. Choose your 45-minute slot on Cal.com.', 'success');
      var cal = calUrl();
      if (cal) window.open(cal, '_blank', 'noopener,noreferrer');
    });
  }

  function openModal(intent, prefill) {
    ensureModal();
    var form = document.getElementById(FORM_ID);
    if (form) {
      if (intent) form.setAttribute('data-booking-intent', intent);
      else form.removeAttribute('data-booking-intent');
      bindForm(form);
      if (prefill) {
        var q3 = form.querySelector('[name="q3"]');
        if (q3 && !q3.value.trim()) q3.value = String(prefill).slice(0, 500);
      }
    }
    var modal = document.getElementById('booking-modal');
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var nav = document.getElementById('navbar');
    var btn = document.getElementById('hamburger');
    if (nav) nav.classList.remove('mobile-open');
    if (btn) {
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open menu');
    }
    if (form) {
      var first = form.querySelector('input, textarea, select, button');
      if (first) setTimeout(function () { first.focus(); }, 80);
    }
  }

  function init() {
    if (!document.getElementById('diagnosis-intake-mount')) {
      ensureModal();
      bindForm(document.getElementById(FORM_ID));
    }
    mountPageForm();
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('.js-open-modal, .js-scroll-to-form');
      if (!trigger) return;
      e.preventDefault();
      openModal(
        trigger.getAttribute('data-booking-intent') || '',
        trigger.getAttribute('data-booking-prefill') || ''
      );
    });
  }

  window.KautilyanBooking = { open: openModal, ensureModal: ensureModal };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
