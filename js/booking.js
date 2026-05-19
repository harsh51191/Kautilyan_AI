/**
 * Stage 0 booking flow
 * 1) Modal / assessment (not yet scheduled): name, email, company + Cal.com button — NO five questions
 * 2) After Cal.com redirect (?scheduled=1): five prep questions only (same sheet row)
 */
(function () {
  'use strict';

  var FORM_ID = 'diagnosis-intake-form';
  var LEAD_KEY = 'kautilyan_stage0_lead';
  var SCHEDULED_KEY = 'kautilyan_stage0_scheduled';

  var MODAL_TITLE = 'Book your Stage 0 call';
  var BOOKING_SUB =
    'Share your details, then pick a time on Cal.com. After you confirm your slot, you’ll answer five short prep questions.';
  var QUESTIONS_SUB =
    'You’re booked. These five questions help us prepare your diagnosis — not a generic AI demo.';

  var pendingIntent = '';
  var pendingPrefill = '';

  function cfg() {
    return window.CONFIG || {};
  }

  function calUrl() {
    return (cfg().CAL_LINK || 'https://cal.com/kautilyan/stage-0-diagnosis').trim();
  }

  function intakePageUrl() {
    var base = (cfg().SITE_URL || window.location.origin || '').replace(/\/$/, '');
    var path = (cfg().INTAKE_PATH || 'assessment.html').replace(/^\//, '');
    return base + '/' + path;
  }

  function postBookingRedirectUrl(intent, prefill) {
    var params = new URLSearchParams();
    params.set('scheduled', '1');
    if (intent) params.set('intent', intent);
    if (prefill) params.set('workflow', String(prefill).slice(0, 500));
    return intakePageUrl() + '?' + params.toString();
  }

  function calUrlWithRedirect(intent, prefill) {
    var cal = calUrl();
    if (!cal) return '';
    var redirect = postBookingRedirectUrl(intent, prefill);
    var sep = cal.indexOf('?') >= 0 ? '&' : '?';
    return cal + sep + 'redirect=' + encodeURIComponent(redirect);
  }

  function newSubmissionId() {
    return 'ks-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  function saveLead(lead) {
    try {
      sessionStorage.setItem(LEAD_KEY, JSON.stringify(lead));
    } catch (err) { /* ignore */ }
  }

  function loadLead() {
    try {
      var raw = sessionStorage.getItem(LEAD_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  function markScheduled() {
    try {
      sessionStorage.setItem(SCHEDULED_KEY, '1');
    } catch (err) { /* ignore */ }
  }

  function hasScheduledFromUrl() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('scheduled') === '1' || params.get('booked') === '1') {
      markScheduled();
      return true;
    }
    try {
      return sessionStorage.getItem(SCHEDULED_KEY) === '1';
    } catch (err) {
      return false;
    }
  }

  function readContactFromForm(form) {
    return {
      name: (form.querySelector('[name="name"]') || {}).value.trim(),
      email: (form.querySelector('[name="email"]') || {}).value.trim(),
      company: (form.querySelector('[name="company"]') || {}).value.trim(),
    };
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function sheetsConfigured() {
    return !!(cfg().GOOGLE_SCRIPT_URL || '').trim();
  }

  function postToSheetsAsync(payload) {
    if (typeof window.submitToSheetsAsync === 'function') {
      return window.submitToSheetsAsync(payload);
    }
    return Promise.reject(new Error('Lead capture is not available'));
  }

  function showToast(msg, type) {
    if (typeof window.showToast === 'function') window.showToast(msg, type);
  }

  function getFormErrorEl(root) {
    if (!root) return null;
    var el = root.querySelector('.booking-form-error');
    if (!el) {
      el = document.createElement('p');
      el.className = 'booking-form-error';
      el.setAttribute('role', 'alert');
      var actions = root.querySelector('.booking-cal-actions');
      if (actions) {
        actions.insertBefore(el, actions.firstChild);
      } else {
        var anchor = root.querySelector('.js-open-cal') || root.querySelector('.cr-submit');
        if (anchor) root.insertBefore(el, anchor);
        else root.appendChild(el);
      }
    }
    return el;
  }

  function showFormError(root, msg) {
    var el = getFormErrorEl(root);
    if (!el) return;
    if (msg) {
      el.textContent = msg;
      el.hidden = false;
    } else {
      el.hidden = true;
      el.textContent = '';
    }
  }

  function showCalLinkFallback(root, url) {
    var el = getFormErrorEl(root);
    if (!el) return;
    el.hidden = false;
    el.textContent = '';
    el.appendChild(document.createTextNode('Your browser blocked the Cal.com popup. '));
    var a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = 'Open Cal.com in a new tab →';
    el.appendChild(a);
  }

  function markFieldInvalid(form, name, invalid) {
    var input = form && form.querySelector('[name="' + name + '"]');
    if (!input) return;
    if (invalid) input.classList.add('is-invalid');
    else input.classList.remove('is-invalid');
  }

  function setBtnBusy(btn, busy, label) {
    if (!btn) return;
    btn.disabled = !!busy;
    btn.setAttribute('aria-busy', busy ? 'true' : 'false');
    if (busy) {
      if (!btn.dataset.origText) btn.dataset.origText = btn.textContent;
      btn.textContent = label || 'Saving…';
    } else if (btn.dataset.origText) {
      btn.textContent = btn.dataset.origText;
      delete btn.dataset.origText;
    }
  }

  function sheetErrorMessage(err) {
    var msg = err && err.message ? err.message : 'Could not save.';
    if (/failed to fetch|network/i.test(msg)) {
      return 'Network error — check your connection and try again.';
    }
    return msg + ' If this keeps happening, email founders@kautilyan.com.';
  }

  /* ——— HTML blocks ——— */

  function contactFieldsHTML() {
    return (
      '<div class="cr-row">' +
        '<div class="cr-group"><label class="cr-label" for="di-name">Full name *</label>' +
        '<input id="di-name" name="name" class="cr-input" required autocomplete="name" /></div>' +
        '<div class="cr-group"><label class="cr-label" for="di-email">Work email *</label>' +
        '<input id="di-email" name="email" class="cr-input" type="email" required autocomplete="email" /></div>' +
      '</div>' +
      '<div class="cr-group"><label class="cr-label" for="di-company">Company</label>' +
      '<input id="di-company" name="company" class="cr-input" autocomplete="organization" /></div>'
    );
  }

  function calButtonHTML() {
    return (
      '<button type="button" class="cr-submit js-open-cal">Pick your time on Cal.com →</button>' +
      '<p class="cr-hint">About 2 minutes. After you confirm, you’ll answer five prep questions on the next screen.</p>' +
      '<p class="cr-foot">By continuing, you agree to our <a href="privacy.html">Privacy Policy</a>.</p>'
    );
  }

  /** Before schedule: contact fields + Cal button (no five questions) */
  function bookingStartHTML() {
    return (
      '<form id="' + FORM_ID + '" class="call-request-form diagnosis-intake-form diagnosis-intake-form--start" novalidate>' +
        contactFieldsHTML() +
      '</form>' +
      '<div class="booking-cal-actions">' + calButtonHTML() + '</div>'
    );
  }

  function questionsFieldsHTML() {
    return (
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
      '<input id="di-upload" name="upload" class="cr-input cr-file" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.csv,.txt" />' +
      '<p class="cr-hint">Files over 5 MB: email to <a href="mailto:founders@kautilyan.com">founders@kautilyan.com</a>.</p></div>' +
      '<button type="submit" class="cr-submit">Submit prep answers →</button>'
    );
  }

  /* ——— Payloads ——— */

  function buildContactCreatePayload(lead) {
    return {
      action: 'create',
      submissionId: lead.submissionId,
      name: lead.name,
      email: lead.email,
      company: lead.company || '',
      phone: '',
      role: '',
      teamSize: '',
      revenue: '',
      painPoints: lead.intent ? ['Intent: ' + lead.intent] : [],
      heardFrom: '',
      source: 'stage0_booking_contact',
      score: '',
      message: 'Contact saved — awaiting Cal.com booking',
    };
  }

  function buildQuestionsUpdatePayload(lead, form) {
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
    if (lead.intent) answers.push('Intent: ' + lead.intent);
    answers.push(
      'Q1 — Why now: ' + q('[name="q1"]'),
      'Q2 — Role & outcome: ' + q('[name="q2"]'),
      'Q3 — Painful workflow: ' + q('[name="q3"]'),
      'Q4 — Value from call: ' + q('[name="q4"]'),
      'Q5 — Systems/tools: ' + q('[name="q5"]')
    );
    if (uploadNote) answers.push(uploadNote);

    return {
      action: 'update',
      submissionId: lead.submissionId,
      name: lead.name,
      email: lead.email,
      company: lead.company || '',
      role: q('[name="q2"]').slice(0, 200),
      painPoints: answers,
      source: 'stage0_post_booking_intake',
      message: 'Cal.com booked — prep questions submitted',
    };
  }

  function validateContact(form, root) {
    var c = readContactFromForm(form);
    showFormError(root, '');
    markFieldInvalid(form, 'name', false);
    markFieldInvalid(form, 'email', false);

    if (!c.name) {
      markFieldInvalid(form, 'name', true);
      showFormError(root, 'Please enter your full name.');
      showToast('Please enter your name.', 'error');
      var nameEl = form.querySelector('[name="name"]');
      if (nameEl) nameEl.focus();
      return null;
    }
    if (!isValidEmail(c.email)) {
      markFieldInvalid(form, 'email', true);
      showFormError(
        root,
        'Please enter a complete email address (e.g. name@company.com). Your email looks incomplete.'
      );
      showToast('Please enter a complete work email (e.g. name@company.com).', 'error');
      var emailEl = form.querySelector('[name="email"]');
      if (emailEl) emailEl.focus();
      return null;
    }
    return c;
  }

  /* ——— Cal.com: open scheduler in click handler, save contact in background ——— */

  function proceedToCal(root, intent, prefill, closeModal) {
    var form = root.querySelector('form') || root;
    var calBtn = root.querySelector('.js-open-cal');
    showFormError(root, '');

    var contact = validateContact(form, root);
    if (!contact) return;

    var lead = loadLead();
    if (!lead || !lead.submissionId) {
      lead = {
        submissionId: newSubmissionId(),
        name: contact.name,
        email: contact.email,
        company: contact.company,
        intent: intent || '',
        prefill: prefill || '',
      };
    } else {
      lead.name = contact.name;
      lead.email = contact.email;
      lead.company = contact.company;
      lead.intent = intent || lead.intent || '';
      lead.prefill = prefill || lead.prefill || '';
    }

    var url = calUrlWithRedirect(lead.intent, lead.prefill || prefill);
    if (!url) {
      showFormError(root, 'Cal.com link is not configured. Email founders@kautilyan.com to book.');
      showToast('Cal.com link is not configured.', 'error');
      return;
    }

    /* Must open during the click — async fetch breaks the user-gesture and popups get blocked */
    var calWin = window.open(url, '_blank', 'noopener,noreferrer');
    if (!calWin) {
      showCalLinkFallback(root, url);
      showToast('Allow popups for this site, or use the Cal.com link above the button.', 'error');
    }

    saveLead(lead);

    if (!sheetsConfigured()) {
      showFormError(
        root,
        'Cal.com is open. Lead capture is not configured on this site — email founders@kautilyan.com after booking.'
      );
      if (closeModal && typeof window.closeBookingModal === 'function') {
        window.closeBookingModal();
      }
      return;
    }

    setBtnBusy(calBtn, true, 'Saving…');
    postToSheetsAsync(buildContactCreatePayload(lead))
      .then(function (res) {
        setBtnBusy(calBtn, false);
        if (res && res.submissionId) lead.submissionId = res.submissionId;
        saveLead(lead);
        if (closeModal && typeof window.closeBookingModal === 'function') {
          window.closeBookingModal();
        }
        if (calWin) {
          showToast('After you confirm on Cal.com, complete the five prep questions.', 'success');
        }
      })
      .catch(function (err) {
        setBtnBusy(calBtn, false);
        var errMsg = sheetErrorMessage(err);
        showFormError(
          root,
          errMsg + ' Cal.com should still be open — complete your booking, then email founders@kautilyan.com if needed.'
        );
        showToast(errMsg, 'error');
      });
  }

  function bindBookingStart(root, intent, prefill, closeModalOnCal) {
    if (!root || root.dataset.startBound === '1') return;
    root.dataset.startBound = '1';

    var calBtn = root.querySelector('.js-open-cal');
    if (calBtn) {
      calBtn.addEventListener('click', function () {
        proceedToCal(root, intent, prefill, closeModalOnCal);
      });
    }

    var form = root.querySelector('form');
    if (form) {
      form.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          proceedToCal(root, intent, prefill, closeModalOnCal);
        }
      });
    }

    var existing = loadLead();
    if (existing) {
      var nameEl = form && form.querySelector('[name="name"]');
      var emailEl = form && form.querySelector('[name="email"]');
      var companyEl = form && form.querySelector('[name="company"]');
      if (nameEl && existing.name) nameEl.value = existing.name;
      if (emailEl && existing.email) emailEl.value = existing.email;
      if (companyEl && existing.company) companyEl.value = existing.company;
    }
  }

  function bindQuestionsForm(form) {
    if (!form || form.dataset.bound === '1') return;
    form.dataset.bound = '1';

    var lead = loadLead();
    var urlParams = new URLSearchParams(window.location.search);
    var workflow = (lead && lead.prefill) || urlParams.get('workflow') || pendingPrefill;
    if (workflow) {
      var q3 = form.querySelector('[name="q3"]');
      if (q3 && !q3.value.trim()) q3.value = workflow;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      lead = loadLead();
      if (!lead || !lead.submissionId) {
        showToast('Please book via Cal.com from the previous step first.', 'error');
        return;
      }

      var required = ['[name="q1"]', '[name="q2"]', '[name="q3"]', '[name="q4"]', '[name="q5"]'];
      for (var i = 0; i < required.length; i++) {
        if (!form.querySelector(required[i]).value.trim()) {
          showToast('Please answer all five questions.', 'error');
          return;
        }
      }

      if (!sheetsConfigured()) {
        showToast('Lead capture is not configured.', 'error');
        return;
      }

      var submitBtn = form.querySelector('.cr-submit');
      showFormError(form, '');
      setBtnBusy(submitBtn, true, 'Saving…');

      postToSheetsAsync(buildQuestionsUpdatePayload(lead, form))
        .then(function () {
          setBtnBusy(submitBtn, false);
          if (window.KautilyanAnalytics) {
            KautilyanAnalytics.diagnosisBooked({
              source: 'stage0_post_booking_intake',
              intent: lead.intent || '',
            });
            KautilyanAnalytics.assessmentStarted({ page: 'assessment_post_booking' });
          }
          showToast('Thank you — we have your prep answers. See you on the call.', 'success');
        })
        .catch(function (err) {
          setBtnBusy(submitBtn, false);
          var errMsg = sheetErrorMessage(err);
          showFormError(form, errMsg);
          showToast(errMsg, 'error');
        });
    });
  }

  /* ——— Modal ——— */

  function renderModalBookingStart(intent, prefill) {
    var modal = document.getElementById('booking-modal');
    if (!modal) return;
    var panel = modal.querySelector('.booking-modal-panel');
    var body = modal.querySelector('#booking-modal-body');
    var title = modal.querySelector('#modal-title');
    var sub = modal.querySelector('.modal-sub');
    if (title) title.textContent = MODAL_TITLE;
    if (sub) sub.textContent = BOOKING_SUB;
    if (panel) panel.classList.remove('booking-modal-panel--wide');
    if (body) {
      body.innerHTML = bookingStartHTML();
      body.removeAttribute('data-start-bound');
      bindBookingStart(body, intent, prefill, true);
    }
  }

  function modalHTML() {
    return (
      '<div id="booking-modal" class="booking-modal" aria-hidden="true" role="dialog" aria-labelledby="modal-title" aria-modal="true">' +
        '<div class="booking-modal-backdrop js-close-modal"></div>' +
        '<div class="booking-modal-panel">' +
          '<button type="button" class="booking-modal-close js-close-modal" aria-label="Close">×</button>' +
          '<h2 id="modal-title">' + MODAL_TITLE + '</h2>' +
          '<p class="modal-sub">' + BOOKING_SUB + '</p>' +
          '<div id="booking-modal-body"></div>' +
        '</div>' +
      '</div>'
    );
  }

  function ensureModal() {
    var modal = document.getElementById('booking-modal');
    if (!modal) {
      document.body.insertAdjacentHTML('beforeend', modalHTML());
      modal = document.getElementById('booking-modal');
    }
    return modal;
  }

  function openModal(intent, prefill) {
    pendingIntent = intent || '';
    pendingPrefill = prefill || '';
    ensureModal();
    renderModalBookingStart(intent, prefill);
    var modal = document.getElementById('booking-modal');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var first = modal.querySelector('[name="name"]');
    if (first) setTimeout(function () { first.focus(); }, 80);
  }

  /* ——— Assessment page ——— */

  function mountBookingStartPage(mount, intent, prefill) {
    mount.innerHTML =
      '<div class="intake-page-header">' +
        '<span class="label">Stage 0 — book your call</span>' +
        '<h1>Book your 45-minute diagnosis</h1>' +
        '<p class="intake-lede">' + BOOKING_SUB + '</p>' +
      '</div>' +
      '<div class="booking-start-wrap">' + bookingStartHTML() + '</div>';
    var wrap = mount.querySelector('.booking-start-wrap');
    bindBookingStart(wrap, intent, prefill, false);
  }

  function mountQuestionsPage(mount) {
    var lead = loadLead();
    if (!lead || !lead.submissionId) {
      mountBookingStartPage(mount, pendingIntent, pendingPrefill);
      showToast('Enter your details and book on Cal.com first. Prep questions unlock after you schedule.', 'error');
      return;
    }

    mount.innerHTML =
      '<div class="intake-page-header">' +
        '<span class="label">Stage 0 — after booking</span>' +
        '<h1>Help us prepare for your call</h1>' +
        '<p class="intake-lede">' + QUESTIONS_SUB + '</p>' +
        '<p class="cr-hint">Booking for: <strong>' + (lead.name || '') + '</strong> · ' + (lead.email || '') + '</p>' +
      '</div>' +
      '<form id="' + FORM_ID + '-page" class="call-request-form diagnosis-intake-form diagnosis-intake-form--questions" novalidate>' +
        questionsFieldsHTML() +
      '</form>';
    bindQuestionsForm(document.getElementById(FORM_ID + '-page'));
  }

  function mountAssessmentPage() {
    var mount = document.getElementById('diagnosis-intake-mount');
    if (!mount) return;
    var params = new URLSearchParams(window.location.search);
    pendingIntent = params.get('intent') || '';
    pendingPrefill = params.get('workflow') || '';

    if (hasScheduledFromUrl()) {
      mountQuestionsPage(mount);
    } else {
      mountBookingStartPage(mount, pendingIntent, pendingPrefill);
    }
  }

  function init() {
    var mount = document.getElementById('diagnosis-intake-mount');
    if (mount) {
      mountAssessmentPage();
    } else {
      ensureModal();
    }

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
