(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = (form.querySelector('[name="name"]') || {}).value || '';
    var email = (form.querySelector('[name="email"]') || {}).value || '';
    var message = (form.querySelector('[name="message"]') || {}).value || '';
    name = name.trim();
    email = email.trim();
    message = message.trim();

    if (!name || !email || email.indexOf('@') < 1 || !message) {
      if (typeof showToast === 'function') showToast('Please fill in name, email, and message.', 'error');
      return;
    }

    if (typeof submitToSheets === 'function') {
      submitToSheets({
        name: name,
        email: email,
        company: '',
        phone: '',
        source: 'contact_form',
        message: message,
        painPoints: [],
      });
    }

    form.reset();
    if (typeof showToast === 'function') {
      showToast('Message sent. We will reply from founders@kautilyan.com.', 'success');
    }
  });
})();
