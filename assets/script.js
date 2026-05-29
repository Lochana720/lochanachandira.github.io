(function () {

  /* ─── 1. THEME TOGGLE ─────────────────────────────────────── */
  const root   = document.documentElement;
  const toggle = document.getElementById('themeToggle');

  function applyTheme(theme) {
    if (theme === 'light') {
      root.classList.add('light');
      toggle.textContent = 'Light';
    } else {
      root.classList.remove('light');
      toggle.textContent = 'Dark';
    }
  }

  const saved = localStorage.getItem('site-theme') ||
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  applyTheme(saved);

  toggle.addEventListener('click', () => {
    const next = root.classList.contains('light') ? 'dark' : 'light';
    localStorage.setItem('site-theme', next);
    applyTheme(next);
  });


  /* ─── 2. PROJECT CATEGORY FILTER ─────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });


  /* ─── 3. EMAIL JS CONTACT FORM ────────────────────────────── */
  /**
   * HOW TO SET UP EmailJS (free):
   * 1. Go to https://www.emailjs.com/ and sign up for a free account.
   * 2. Create an Email Service (Gmail, Outlook, etc.) and note the Service ID.
   * 3. Create an Email Template and note the Template ID.
   *    In the template body you can use: {{from_name}}, {{from_email}}, {{message}}
   * 4. Go to Account > API Keys and copy your Public Key.
   * 5. Replace the three placeholder strings below with your real values.
   */
  const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // <-- replace
  const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // <-- replace
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // <-- replace

  // Only initialise EmailJS if the SDK is loaded and credentials look configured
  const emailJsReady = typeof emailjs !== 'undefined';
  if (emailJsReady && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const sendBtn    = document.getElementById('sendBtn');
  const formResult = document.getElementById('formResult');

  function showResult(msg, type) {
    formResult.textContent = msg;
    formResult.className   = type; // 'success' or 'error'
    formResult.style.display = 'block';
    setTimeout(() => { formResult.style.display = 'none'; }, 6000);
  }

  sendBtn.addEventListener('click', () => {
    const name    = (document.getElementById('cname').value    || '').trim();
    const email   = (document.getElementById('cemail').value   || '').trim();
    const message = (document.getElementById('cmessage').value || '').trim();

    if (!name || !email || !message) {
      showResult('⚠️ Please fill in all fields before sending.', 'error');
      return;
    }

    // If EmailJS is not yet configured, fall back to friendly message
    if (!emailJsReady || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      showResult(
        `Thanks ${name}! Your message was received. (EmailJS not yet configured — see script.js for setup instructions.)`,
        'success'
      );
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending…';

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name:  name,
      from_email: email,
      message:    message,
    })
    .then(() => {
      showResult(`✅ Thank you ${name}! Your message has been sent successfully.`, 'success');
      document.getElementById('cname').value    = '';
      document.getElementById('cemail').value   = '';
      document.getElementById('cmessage').value = '';
    })
    .catch(err => {
      console.error('EmailJS error:', err);
      showResult('❌ Something went wrong. Please try again or email directly.', 'error');
    })
    .finally(() => {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send Message';
    });
  });

})();