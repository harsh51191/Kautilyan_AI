/**
 * Stage 0 booking flow
 * 1) Contact form → save row to Google Sheet (submissionId + timestamp)
 * 2) Open Cal.com in a new tab + show five prep questions on this page (same sheet row on submit)
 */
(function () {
  'use strict';

  var FORM_ID = 'diagnosis-intake-form';
  var LEAD_KEY = 'kautilyan_stage0_lead';
  var LEAD_KEY_LS = 'kautilyan_stage0_lead_v1';
  var SCHEDULED_KEY = 'kautilyan_stage0_scheduled';
  var SCHEDULED_KEY_LS = 'kautilyan_stage0_scheduled_v1';
  var COMPLETE_KEY = 'kautilyan_stage0_complete';
  var COMPLETE_KEY_LS = 'kautilyan_stage0_complete_v1';

  var MODAL_TITLE = 'Book your Stage 0 call';
  var THANK_YOU_MSG =
    'Thank you — we have your booking details and prep answers. See you on the call.';
  var BOOKING_SUB = 'Share your details, then pick a time.';
  var QUESTIONS_SUB =
    'These five questions help us prepare your diagnosis. Pick your time in the scheduler tab if you have not already.';

  var pendingIntent = '';
  var pendingPrefill = '';

  function cfg() {
    return window.CONFIG || {};
  }

  function calUrl() {
    return (cfg().CAL_LINK || 'https://cal.com/kautilyan/stage-0-diagnosis').trim();
  }

  function isLocalDevHost() {
    var host = (window.location.hostname || '').toLowerCase();
    return host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '::1';
  }

  function intakePath() {
    var configured = (cfg().INTAKE_PATH || '').trim().replace(/^\//, '');
    if (configured) return configured.replace(/\.html$/i, '');
    return isLocalDevHost() ? 'stage0-intake.html' : 'stage0-intake';
  }

  function intakePageUrl() {
    var path = intakePath();
    var host = (window.location.hostname || '').toLowerCase();
    var origin = (window.location.origin || '').replace(/\/$/, '');
    /* Keep redirect on the same host the user booked from (www vs apex shares storage). */
    if (isLocalDevHost() || /(^|\.)kautilyan\.com$/i.test(host)) {
      return origin + '/' + path;
    }
    var base = (cfg().SITE_URL || origin || '').replace(/\/$/, '');
    return base + '/' + path;
  }

  function urlSearchParams() {
    return new URLSearchParams(window.location.search);
  }

  function isScheduledQuery(params) {
    params = params || urlSearchParams();
    return (
      params.get('scheduled') === '1' ||
      params.get('booked') === '1' ||
      params.get('booking') === 'confirmed'
    );
  }

  function calBookingUid(params) {
    params = params || urlSearchParams();
    return (params.get('uid') || '').trim();
  }

  function isCalReturn(params) {
    return !!calBookingUid(params);
  }

  function attendeeNameFromParams(params) {
    params = params || urlSearchParams();
    var name = params.get('attendeeName') || params.get('name') || '';
    if (!name) {
      var first = params.get('attendeeFirstName') || '';
      var last = params.get('attendeeLastName') || '';
      name = (first + ' ' + last).trim();
    }
    return name.trim();
  }

  function postBookingRedirectUrl(lead) {
    lead = lead || {};
    var params = new URLSearchParams();
    params.set('scheduled', '1');
    if (lead.submissionId) params.set('sid', lead.submissionId);
    if (lead.intent) params.set('intent', lead.intent);
    if (lead.prefill) params.set('workflow', String(lead.prefill).slice(0, 500));
    if (lead.name) params.set('name', lead.name);
    if (lead.email) params.set('email', lead.email);
    return intakePageUrl() + '?' + params.toString();
  }

  function calUrlWithRedirect(lead) {
    var cal = calUrl();
    if (!cal) return '';
    var redirect = postBookingRedirectUrl(lead);
    var sep = cal.indexOf('?') >= 0 ? '&' : '?';
    return cal + sep + 'redirect=' + encodeURIComponent(redirect);
  }

  function newSubmissionId() {
    return 'ks-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  function saveLead(lead) {
    var raw = JSON.stringify(lead);
    try {
      sessionStorage.setItem(LEAD_KEY, raw);
    } catch (err) { /* ignore */ }
    try {
      localStorage.setItem(LEAD_KEY_LS, raw);
    } catch (err) { /* ignore */ }
  }

  function loadLead() {
    try {
      var raw = sessionStorage.getItem(LEAD_KEY) || localStorage.getItem(LEAD_KEY_LS);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  function markScheduled() {
    try {
      sessionStorage.setItem(SCHEDULED_KEY, '1');
    } catch (err) { /* ignore */ }
    try {
      localStorage.setItem(SCHEDULED_KEY_LS, '1');
    } catch (err) { /* ignore */ }
  }

  function isScheduledFlagSet() {
    try {
      if (sessionStorage.getItem(SCHEDULED_KEY) === '1') return true;
      if (localStorage.getItem(SCHEDULED_KEY_LS) === '1') return true;
    } catch (err) { /* ignore */ }
    return false;
  }

  function markIntakeComplete(lead) {
    if (lead) {
      lead.prepCompleted = true;
      lead.prepCompletedAt = new Date().toISOString();
      saveLead(lead);
    }
    try {
      sessionStorage.setItem(COMPLETE_KEY, '1');
    } catch (err) { /* ignore */ }
    try {
      localStorage.setItem(COMPLETE_KEY_LS, '1');
    } catch (err) { /* ignore */ }
  }

  function isIntakeComplete() {
    var lead = loadLead();
    if (lead && lead.prepCompleted) return true;
    try {
      if (sessionStorage.getItem(COMPLETE_KEY) === '1') return true;
      if (localStorage.getItem(COMPLETE_KEY_LS) === '1') return true;
    } catch (err) { /* ignore */ }
    return false;
  }

  function clearIntakeQueryFromUrl() {
    if (!window.history || !window.history.replaceState) return;
    var path = window.location.pathname || '';
    if (path.indexOf('stage0-intake') < 0) return;
    history.replaceState({}, document.title, path);
  }

  function closeBookingModalIfOpen() {
    if (typeof window.closeBookingModal === 'function') {
      window.closeBookingModal();
    }
  }

  function closeCalBookingTabIfAny() {
    var w = window.__kautilyanCalWin;
    if (w && !w.closed) {
      try {
        w.close();
      } catch (err) { /* ignore */ }
    }
    window.__kautilyanCalWin = null;
  }

  function isCalPopupReturn() {
    var params = urlSearchParams();
    return (isScheduledQuery(params) || isCalReturn(params)) && !!window.opener;
  }

  function tryCloseSelfAsCalTab() {
    setTimeout(function () {
      try {
        window.close();
      } catch (err) { /* ignore */ }
    }, 350);
  }

  function watchCalTabForRedirectClose(calWin) {
    if (!calWin) return;
    window.__kautilyanCalWin = calWin;
    var started = Date.now();
    var timer = setInterval(function () {
      if (calWin.closed) {
        clearInterval(timer);
        if (window.__kautilyanCalWin === calWin) window.__kautilyanCalWin = null;
        return;
      }
      if (Date.now() - started > 45 * 60 * 1000) {
        clearInterval(timer);
        return;
      }
      var href = '';
      try {
        href = calWin.location.href || '';
      } catch (err) {
        return;
      }
      var onIntake =
        /stage0-intake/i.test(href) ||
        (isLocalDevHost() && /stage0-intake\.html/i.test(href));
      if (onIntake || /kautilyan\.com/i.test(href)) {
        try {
          calWin.close();
        } catch (err) { /* ignore */ }
        clearInterval(timer);
        if (window.__kautilyanCalWin === calWin) window.__kautilyanCalWin = null;
      }
    }, 500);
  }

  function restoreLeadFromUrl() {
    var params = urlSearchParams();
    var scheduled = isScheduledQuery(params);
    var calUid = calBookingUid(params);
    if (!scheduled && !calUid) return loadLead();

    markScheduled();
    var lead = loadLead() || {};
    var sid = (params.get('sid') || '').trim();
    if (sid) lead.submissionId = sid;
    else if (!lead.submissionId && calUid) lead.submissionId = 'cal-' + calUid;

    var urlName = attendeeNameFromParams(params);
    var urlEmail = (params.get('email') || '').trim();
    if (urlName) lead.name = urlName;
    if (urlEmail) lead.email = urlEmail;
    if (params.get('intent')) lead.intent = params.get('intent');
    if (params.get('workflow')) lead.prefill = params.get('workflow');

    if (!lead.submissionId && (scheduled || calUid)) {
      lead.submissionId = newSubmissionId();
    }

    if (lead.submissionId) {
      lead.contactSaved = true;
      saveLead(lead);
    }
    return lead.submissionId ? lead : null;
  }

  function hasScheduledFromUrl() {
    var params = urlSearchParams();
    if (isScheduledQuery(params) || isCalReturn(params)) {
      var fromUrl = restoreLeadFromUrl();
      return !!(fromUrl && fromUrl.submissionId);
    }
    if (isScheduledFlagSet()) {
      var lead = loadLead();
      return !!(lead && lead.submissionId);
    }
    return false;
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
    el.appendChild(document.createTextNode('Your browser blocked the scheduling window. '));
    var a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = 'Open scheduler in a new tab →';
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

  function privacyHref() {
    return (/\/data\//.test(location.pathname) ? '../' : '') + 'privacy.html';
  }

  function calButtonHTML() {
    return (
      '<button type="button" class="cr-submit js-open-cal">Pick your time →</button>' +
      '<p class="cr-foot">By continuing, you agree to our <a href="' + privacyHref() + '">Privacy Policy</a>.</p>'
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

  function leadReadyForQuestions(lead) {
    return !!(lead && lead.submissionId && lead.contactSaved);
  }

  function shouldShowPrepQuestions() {
    if (isIntakeComplete()) return false;
    var lead = loadLead();
    if (leadReadyForQuestions(lead)) return true;
    if (hasScheduledFromUrl()) return true;
    if (isScheduledFlagSet() && lead && lead.submissionId) return true;
    return false;
  }

  function finishIntakeSuccess(lead) {
    markIntakeComplete(lead);
    clearIntakeQueryFromUrl();
    closeCalBookingTabIfAny();
    closeBookingModalIfOpen();

    var mount = document.getElementById('diagnosis-intake-mount');
    if (mount) mountThankYouPage(mount);

    showToast(THANK_YOU_MSG, 'success');
  }

  function showPrepQuestionsUI(lead) {
    if (isIntakeComplete()) return false;
    if (!lead || !lead.submissionId) return false;

    var mount = document.getElementById('diagnosis-intake-mount');
    if (mount) {
      if (!mount.querySelector('.diagnosis-intake-form--questions')) {
        mountQuestionsPage(mount);
      }
      return true;
    }

    var modal = document.getElementById('booking-modal');
    if (modal) {
      if (!modal.classList.contains('is-open')) {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
      if (!modal.querySelector('.diagnosis-intake-form--questions')) {
        renderModalQuestions(lead);
      }
      return true;
    }

    return false;
  }

  function onContactSavedToSheet(lead) {
    lead.contactSaved = true;
    lead.savedAt = lead.savedAt || new Date().toISOString();
    saveLead(lead);
    markScheduled();
    showPrepQuestionsUI(lead);
  }

  /** Open Cal in a new tab during the click (before any async work). */
  function openCalScheduler(url) {
    if (!url) return null;
    var calWin = window.open(url, 'kautilyan_cal_booking');
    if (calWin) {
      watchCalTabForRedirectClose(calWin);
      return calWin;
    }
    var link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
    return null;
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
      message:
        'Contact saved — awaiting call booking · ' +
        (lead.savedAt || new Date().toISOString()) +
        ' · session ' +
        lead.submissionId,
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
      message: 'Call booked — prep questions submitted',
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

  function proceedToCal(root, intent, prefill) {
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

    lead.savedAt = new Date().toISOString();

    var url = calUrlWithRedirect(lead);
    if (!url) {
      showFormError(root, 'Scheduling link is not configured. Email founders@kautilyan.com to book.');
      showToast('Scheduling link is not configured.', 'error');
      return;
    }

    saveLead(lead);

    /* New tab must open synchronously in this click — before sheet fetch */
    var calWin = openCalScheduler(url);
    if (!calWin) {
      showCalLinkFallback(root, url);
      showToast('Allow popups for this site, or use the scheduler link above the button.', 'error');
    }

    if (!sheetsConfigured()) {
      showFormError(
        root,
        'Lead capture is not configured on this site — email founders@kautilyan.com after booking.'
      );
      return;
    }

    setBtnBusy(calBtn, true, 'Saving…');
    postToSheetsAsync(buildContactCreatePayload(lead))
      .then(function (res) {
        if (res && res.submissionId) lead.submissionId = res.submissionId;
        onContactSavedToSheet(lead);
      })
      .catch(function (err) {
        var errMsg = sheetErrorMessage(err);
        showFormError(root, errMsg);
        showToast(errMsg, 'error');
      })
      .finally(function () {
        setBtnBusy(calBtn, false);
      });
  }

  function bindBookingStart(root, intent, prefill) {
    if (!root || root.dataset.startBound === '1') return;
    root.dataset.startBound = '1';

    var calBtn = root.querySelector('.js-open-cal');
    if (calBtn) {
      calBtn.addEventListener('click', function () {
        proceedToCal(root, intent, prefill);
      });
    }

    var form = root.querySelector('form');
    if (form) {
      form.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          proceedToCal(root, intent, prefill);
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
        showToast('Please pick a time first, then answer the prep questions.', 'error');
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
          finishIntakeSuccess(lead);
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
      bindBookingStart(body, intent, prefill);
    }
  }

  function renderModalQuestions(lead) {
    var modal = document.getElementById('booking-modal');
    if (!modal) return;
    var panel = modal.querySelector('.booking-modal-panel');
    var body = modal.querySelector('#booking-modal-body');
    var title = modal.querySelector('#modal-title');
    var sub = modal.querySelector('.modal-sub');
    if (title) title.textContent = 'Help us prepare for your call';
    if (sub) sub.textContent = QUESTIONS_SUB;
    if (panel) panel.classList.add('booking-modal-panel--wide');
    if (body) {
      body.innerHTML =
        '<p class="cr-hint">Booking for: <strong>' + (lead.name || '') + '</strong> · ' + (lead.email || '') + '</p>' +
        '<form id="' + FORM_ID + '-modal" class="call-request-form diagnosis-intake-form diagnosis-intake-form--questions" novalidate>' +
          questionsFieldsHTML() +
        '</form>';
      body.removeAttribute('data-start-bound');
      bindQuestionsForm(document.getElementById(FORM_ID + '-modal'));
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
    if (isIntakeComplete()) {
      showToast(THANK_YOU_MSG, 'success');
      return;
    }
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
    var lead = loadLead();
    mount.innerHTML =
      '<div class="intake-page-header">' +
        '<span class="label">Stage 0 — book your call</span>' +
        '<h1>Book your 45-minute diagnosis</h1>' +
        '<p class="intake-lede">' + BOOKING_SUB + '</p>' +
      '</div>' +
      '<div class="booking-start-wrap">' + bookingStartHTML() + '</div>';
    var wrap = mount.querySelector('.booking-start-wrap');
    bindBookingStart(wrap, intent, prefill);
  }

  function mountThankYouPage(mount) {
    mount.innerHTML =
      '<div class="intake-page-header intake-page-header--complete">' +
        '<span class="label">Stage 0 — complete</span>' +
        '<h1>You’re all set</h1>' +
        '<p class="intake-lede">' + THANK_YOU_MSG + '</p>' +
        '<p class="intake-lede intake-lede--secondary"><a href="index.html">Back to homepage</a></p>' +
      '</div>';
  }

  function mountQuestionsPage(mount) {
    if (isIntakeComplete()) {
      mountThankYouPage(mount);
      return;
    }
    var lead = restoreLeadFromUrl() || loadLead();
    if (!lead || !lead.submissionId) {
      mountBookingStartPage(mount, pendingIntent, pendingPrefill);
      return;
    }

    var calLink = calUrlWithRedirect(lead);
    mount.innerHTML =
      '<div class="intake-page-header">' +
        '<span class="label">Stage 0 — prep for your call</span>' +
        '<h1>Help us prepare for your call</h1>' +
        '<p class="intake-lede">' + QUESTIONS_SUB + '</p>' +
        '<p class="cr-hint">Session <strong>' + lead.submissionId + '</strong> · ' +
        (lead.name || '') + ' · ' + (lead.email || '') +
        (calLink
          ? ' · <a href="' + calLink + '" target="_blank" rel="noopener noreferrer">Open scheduler</a>'
          : '') +
        '</p>' +
      '</div>' +
      '<form id="' + FORM_ID + '-page" class="call-request-form diagnosis-intake-form diagnosis-intake-form--questions" novalidate>' +
        questionsFieldsHTML() +
      '</form>';
    bindQuestionsForm(document.getElementById(FORM_ID + '-page'));
  }

  function mountAssessmentPage() {
    var mount = document.getElementById('diagnosis-intake-mount');
    if (!mount) return;

    if (isCalPopupReturn()) {
      tryCloseSelfAsCalTab();
      return;
    }

    var params = urlSearchParams();
    pendingIntent = params.get('intent') || '';
    pendingPrefill = params.get('workflow') || '';

    if (isIntakeComplete()) {
      clearIntakeQueryFromUrl();
      mountThankYouPage(mount);
      return;
    }

    restoreLeadFromUrl();

    if (shouldShowPrepQuestions()) {
      mountQuestionsPage(mount);
    } else {
      mountBookingStartPage(mount, pendingIntent, pendingPrefill);
    }
  }

  function init() {
    var mount = document.getElementById('diagnosis-intake-mount');
    if (isCalPopupReturn()) {
      tryCloseSelfAsCalTab();
      if (mount) return;
    }

    if (mount) {
      mountAssessmentPage();
    } else {
      ensureModal();
      if (!isIntakeComplete()) {
        var lead = loadLead();
        if (leadReadyForQuestions(lead)) {
          var modal = document.getElementById('booking-modal');
          if (modal) {
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
          }
          showPrepQuestionsUI(lead);
        }
      }
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
