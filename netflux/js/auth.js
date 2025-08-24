import { upsertUser, verifyUser, setSession, getSession } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (getSession()) {
    // Already logged in
    window.location.href = '/workspace/netflux/profiles.html';
    return;
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = new FormData(loginForm);
      const email = form.get('email').trim();
      const password = form.get('password').trim();
      try {
        const user = verifyUser(email, password);
        setSession({ userId: user.id, email: user.email });
        window.location.href = '/workspace/netflux/profiles.html';
      } catch (err) {
        document.getElementById('loginError').textContent = err.message;
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = new FormData(signupForm);
      const email = form.get('email').trim();
      const password = form.get('password').trim();
      try {
        const user = upsertUser(email, password);
        setSession({ userId: user.id, email: user.email });
        window.location.href = '/workspace/netflux/profiles.html';
      } catch (err) {
        document.getElementById('signupError').textContent = err.message;
      }
    });
  }
});

