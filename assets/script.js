// Theme toggle with localStorage
(function(){
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');

  function applyTheme(theme){
    if(theme === 'light') {
      root.classList.add('light');
      toggle.textContent = 'Light';
    } else {
      root.classList.remove('light');
      toggle.textContent = 'Dark';
    }
  }

  const saved = localStorage.getItem('site-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  applyTheme(saved);

  toggle.addEventListener('click', () => {
    const current = root.classList.contains('light') ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    localStorage.setItem('site-theme', next);
    applyTheme(next);
  });

  // Simple contact form dummy behaviour
  const sendBtn = document.getElementById('sendBtn');
  const formResult = document.getElementById('formResult');
  sendBtn.addEventListener('click', () => {
    const name = document.getElementById('cname').value || 'Anonymous';
    formResult.style.display = 'block';
    formResult.textContent = `Thanks ${name}! This is a dummy contact form. Replace with a real backend or EmailJS.`;
    setTimeout(()=> formResult.style.display='none', 5000);
  });
})();