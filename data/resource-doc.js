(function () {
  'use strict';

  if (!document.getElementById('toast')) {
    var toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  var pdfBtn = document.getElementById('doc-save-pdf');
  if (!pdfBtn) return;

  var docTitleEl = document.querySelector('.doc-toolbar-title');
  var docTitle = docTitleEl ? docTitleEl.textContent.trim() : document.title.replace(/\s*-.*$/, '').trim();
  var docSlug = (location.pathname.match(/resource-[^/]+\.html/) || ['resource'])[0];
  var storageKey = 'kautilyan_pdf_gate_' + docSlug;
  var html2pdfPromise;

  var modal;
  var form;
  var emailInput;
  var nameInput;
  var errorEl;
  var submitBtn;

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function hasStoredEmail() {
    try {
      return !!sessionStorage.getItem(storageKey);
    } catch (err) {
      return false;
    }
  }

  function storeEmail(email) {
    try {
      sessionStorage.setItem(storageKey, email);
    } catch (err) { /* ignore */ }
  }

  function slugifyFilename(title) {
    var base = (title || 'kautilyan-guide')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return (base || 'kautilyan-guide') + '.pdf';
  }

  function loadHtml2Pdf() {
    if (window.html2pdf) return Promise.resolve(window.html2pdf);
    if (html2pdfPromise) return html2pdfPromise;

    html2pdfPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js';
      s.crossOrigin = 'anonymous';
      s.onload = function () {
        if (window.html2pdf) resolve(window.html2pdf);
        else reject(new Error('PDF library failed to load'));
      };
      s.onerror = function () {
        reject(new Error('Could not load PDF generator'));
      };
      document.head.appendChild(s);
    });

    return html2pdfPromise;
  }

  function setPdfButtonLoading(loading) {
    if (!pdfBtn) return;
    if (loading) {
      pdfBtn.disabled = true;
      pdfBtn.dataset.prevLabel = pdfBtn.textContent;
      pdfBtn.textContent = 'Generating PDF…';
    } else {
      pdfBtn.disabled = false;
      pdfBtn.textContent = pdfBtn.dataset.prevLabel || 'Download PDF';
    }
  }

  /**
   * Build PDF in-browser (no print dialog) - avoids URL/date browser headers.
   */
  function downloadCleanPdf() {
    var el = document.querySelector('.doc-wrapper');
    if (!el) {
      return Promise.reject(new Error('Document not found'));
    }

    setPdfButtonLoading(true);
    document.body.classList.add('is-pdf-exporting');
    window.scrollTo(0, 0);

    return loadHtml2Pdf()
      .then(function (html2pdf) {
        var opt = {
          margin: [10, 10, 12, 10],
          filename: slugifyFilename(docTitle),
          image: { type: 'jpeg', quality: 0.96 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            scrollY: 0,
            windowWidth: el.scrollWidth,
            backgroundColor: '#ffffff',
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: {
            mode: ['css', 'legacy'],
            avoid: ['.cover', '.pull-quote', '.highlight-box', '.comparison-table'],
          },
        };
        return html2pdf().set(opt).from(el).save();
      })
      .finally(function () {
        document.body.classList.remove('is-pdf-exporting');
        setPdfButtonLoading(false);
      });
  }

  /** Fallback if programmatic PDF fails - user must disable browser headers manually. */
  function openPrintDialogFallback() {
    setError(
      'Automatic PDF failed. In the print dialog, open More settings and turn off "Headers and footers", then choose Save as PDF.'
    );
    window.print();
  }

  function startPdfDownload() {
    return downloadCleanPdf().catch(function () {
      if (modal && modal.classList.contains('is-open')) {
        openPrintDialogFallback();
      } else {
        openModal();
        setError('Could not generate PDF. Try again, or use print with headers turned off.');
      }
    });
  }

  function buildModal() {
    modal = document.createElement('div');
    modal.id = 'pdf-gate-modal';
    modal.className = 'pdf-gate-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'pdf-gate-title');
    modal.innerHTML =
      '<div class="pdf-gate-backdrop" data-pdf-gate-close></div>' +
      '<div class="pdf-gate-panel">' +
        '<button type="button" class="pdf-gate-close" data-pdf-gate-close aria-label="Close">×</button>' +
        '<h2 id="pdf-gate-title">Download PDF</h2>' +
        '<p>Enter your work email to download <strong>' + escapeHtml(docTitle) + '</strong>.</p>' +
        '<form id="pdf-gate-form" class="pdf-gate-form" novalidate>' +
          '<label for="pdf-gate-email">Work email *</label>' +
          '<input type="email" id="pdf-gate-email" name="email" autocomplete="email" required placeholder="you@company.com" />' +
          '<label for="pdf-gate-name">Name (optional)</label>' +
          '<input type="text" id="pdf-gate-name" name="name" autocomplete="name" placeholder="Your name" />' +
          '<p class="pdf-gate-error" id="pdf-gate-error" role="alert"></p>' +
          '<button type="submit" class="pdf-gate-submit" id="pdf-gate-submit">Download PDF →</button>' +
        '</form>' +
      '</div>';
    document.body.appendChild(modal);

    form = document.getElementById('pdf-gate-form');
    emailInput = document.getElementById('pdf-gate-email');
    nameInput = document.getElementById('pdf-gate-name');
    errorEl = document.getElementById('pdf-gate-error');
    submitBtn = document.getElementById('pdf-gate-submit');

    modal.querySelectorAll('[data-pdf-gate-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });

    form.addEventListener('submit', onFormSubmit);
  }

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  function openModal() {
    if (!modal) buildModal();
    errorEl.textContent = '';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      if (emailInput) emailInput.focus();
    }, 80);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function setError(msg) {
    if (errorEl) errorEl.textContent = msg || '';
  }

  function submitLead(email, name) {
    var payload = {
      name: name || '(not provided)',
      email: email,
      company: '',
      phone: '',
      source: 'pdf_download',
      message: 'PDF download: ' + docTitle,
      painPoints: docTitle,
    };

    if (typeof window.submitToSheetsAsync === 'function') {
      return window.submitToSheetsAsync(payload);
    }

    var cfg = window.CONFIG || {};
    var url = (cfg.GOOGLE_SCRIPT_URL || '').trim();
    if (!url) {
      return Promise.reject(new Error('Lead capture is not configured'));
    }

    return fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    }).then(function (res) {
      return res.text().then(function (text) {
        try {
          var parsed = JSON.parse(text);
          if (parsed.status === 'error') {
            throw new Error(parsed.message || 'Could not save email');
          }
        } catch (parseErr) {
          if (parseErr.message && parseErr.message.indexOf('Could not save') === 0) {
            throw parseErr;
          }
        }
        return { status: 'ok' };
      });
    }).catch(function (err) {
      var msg = err && err.message ? err.message : '';
      var isNetwork =
        err instanceof TypeError ||
        /failed to fetch|network|cors|load failed/i.test(msg);
      if (!isNetwork) {
        return Promise.reject(err);
      }
      return fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      }).then(function () {
        return { status: 'ok', fallback: true };
      });
    });
  }

  function onFormSubmit(e) {
    e.preventDefault();
    var email = emailInput ? emailInput.value.trim() : '';
    var name = nameInput ? nameInput.value.trim() : '';

    if (!email || !isValidEmail(email)) {
      setError('Please enter a valid work email.');
      return;
    }

    setError('');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving…';
    }

    submitLead(email, name)
      .then(function () {
        storeEmail(email);
        closeModal();
        if (submitBtn) {
          submitBtn.textContent = 'Generating PDF…';
        }
        return startPdfDownload();
      })
      .catch(function (err) {
        setError((err && err.message) || 'Could not save your email. Please try again.');
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Download PDF →';
        }
      });
  }

  pdfBtn.addEventListener('click', function () {
    if (hasStoredEmail()) {
      startPdfDownload();
      return;
    }
    openModal();
  });
})();
