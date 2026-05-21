(function () {
  'use strict';

  var RESOURCES = window.RESOURCE_URLS || {
    free: {
      'ai-agent': 'data/resource-1-what-is-an-ai-agent.html',
      slope: 'data/resource-2-slope-framework.html',
      roadmap: 'data/resource-3-implementation-roadmap.html',
    },
    gated: {},
  };

  var gateModal = document.getElementById('gate-modal');
  var gateForm = document.getElementById('gate-form');
  var gateResourceInput = document.getElementById('gate-resource-id');
  var gateTitle = document.getElementById('gate-modal-title');
  var pendingResourceId = null;

  var resourceTitles = {
    'ai-agent': 'What is an AI Agent?',
    slope: 'The SLOPE Framework',
    roadmap: 'AI Implementation Roadmap',
    guide: 'AI-Era Operations Guide',
    checklist: 'Workflow Diagnosis Checklist',
    rfp: 'AI Implementation RFP Template',
  };

  function openGateModal(resourceId) {
    pendingResourceId = resourceId;
    if (gateResourceInput) gateResourceInput.value = resourceId;
    if (gateTitle) {
      gateTitle.textContent = 'Download: ' + (resourceTitles[resourceId] || 'Resource');
    }
    if (!gateModal) return;
    gateModal.classList.add('is-open');
    gateModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var email = document.getElementById('gate-email');
    if (email) setTimeout(function () { email.focus(); }, 80);
  }

  function closeGateModal() {
    if (!gateModal) return;
    gateModal.classList.remove('is-open');
    gateModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    pendingResourceId = null;
  }

  function resolveReadinessUrl() {
    var u = (RESOURCES.free.readiness || '').trim();
    if (u) return u;
    if (window.CONFIG && (CONFIG.ASSESSMENT_URL || '').trim()) {
      return CONFIG.ASSESSMENT_URL.trim();
    }
    return 'assessment.html';
  }

  function openResourceGuide(url) {
    if (!url) {
      if (typeof showToast === 'function') {
        showToast('Guide link not configured yet. Email founders@kautilyan.com.', 'error');
      }
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function trackResourceRead(id) {
    if (window.KautilyanAnalytics) {
      KautilyanAnalytics.resourceDownloaded({
        resource_id: id,
        resource_title: resourceTitles[id] || id,
        action: 'read',
      });
    }
  }

  document.querySelectorAll('[data-read-resource]').forEach(function (link) {
    link.addEventListener('click', function () {
      trackResourceRead(link.getAttribute('data-read-resource'));
    });
  });

  document.querySelectorAll('[data-free-resource]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var id = btn.getAttribute('data-free-resource');
      if (id === 'readiness') {
        window.location.href = resolveReadinessUrl();
        return;
      }
      var url = (RESOURCES.free[id] || '').trim();
      trackResourceRead(id);
      openResourceGuide(url);
    });
  });

  document.querySelectorAll('[data-gated-resource]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openGateModal(btn.getAttribute('data-gated-resource'));
    });
  });

  document.querySelectorAll('.js-close-gate').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      closeGateModal();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && gateModal && gateModal.classList.contains('is-open')) {
      closeGateModal();
    }
  });

  if (gateForm) {
    gateForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailEl = document.getElementById('gate-email');
      var nameEl = document.getElementById('gate-name');
      var email = emailEl ? emailEl.value.trim() : '';
      var name = nameEl ? nameEl.value.trim() : '';
      var resourceId = gateResourceInput ? gateResourceInput.value : pendingResourceId;

      if (!email || email.indexOf('@') < 1) {
        if (typeof showToast === 'function') showToast('Please enter a valid work email.', 'error');
        return;
      }

      if (typeof submitToSheets === 'function') {
        submitToSheets({
          name: name || '(not provided)',
          email: email,
          source: 'resource_download',
          message: 'Resource: ' + (resourceId || 'unknown'),
          painPoints: resourceTitles[resourceId] || resourceId,
        });
      }
      if (window.KautilyanAnalytics) {
        KautilyanAnalytics.resourceDownloaded({ resource_id: resourceId || 'unknown' });
      }

      var url = (RESOURCES.gated[resourceId] || '').trim();
      closeGateModal();
      gateForm.reset();

      if (typeof showToast === 'function') {
        showToast(url ? 'Download starting…' : 'Thanks — we will send your download shortly.', 'success');
      }
      if (url) setTimeout(function () { openResourceGuide(url); }, 400);
    });
  }

})();
