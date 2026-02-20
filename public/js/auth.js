import { login, register, saveSession, isLoggedIn } from './api.js';

// Redirect if already logged in
if (isLoggedIn()) window.location.href = '/index.html';

// ── DOM refs ──────────────────────────────────────────────
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');

// ── Tab switching ─────────────────────────────────────────
tabLogin.addEventListener('click', () => {
  tabLogin.classList.add('active');
  tabRegister.classList.remove('active');
  loginForm.classList.add('active');
  registerForm.classList.remove('active');
  loginError.textContent = '';
});

tabRegister.addEventListener('click', () => {
  tabRegister.classList.add('active');
  tabLogin.classList.remove('active');
  registerForm.classList.add('active');
  loginForm.classList.remove('active');
  registerError.textContent = '';
});

// ── Login ─────────────────────────────────────────────────
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  try {
    const data = await login({ email, password });
    saveSession(data.token, data.user);
    window.location.href = '/index.html';
  } catch (err) {
    loginError.textContent = err.message;
  }
});

// ── Register ──────────────────────────────────────────────
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  registerError.textContent = '';

  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const confirm = document.getElementById('register-confirm').value;

  if (password !== confirm) {
    registerError.textContent = 'Passwords do not match';
    return;
  }

  try {
    const data = await register({ name, email, password });
    saveSession(data.token, data.user);
    window.location.href = '/index.html';
  } catch (err) {
    registerError.textContent = err.message;
  }
});