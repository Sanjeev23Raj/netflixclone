document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro');
  if (!intro) return;
  // If element has [hidden], it's on browse page; we only show the intro once per browser session
  const seen = sessionStorage.getItem('intro_seen');
  if (seen) { intro.remove(); return; }
  intro.hidden = false;
  setTimeout(() => {
    intro.classList.add('hide');
    setTimeout(() => intro.remove(), 650);
    sessionStorage.setItem('intro_seen', '1');
  }, 2000);
});

