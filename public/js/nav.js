import { getCurrentUser, clearSession, isLoggedIn } from './api.js';

// Redirect to login if not authenticated (call on protected pages)
export function requireLogin() {
  if (!isLoggedIn()) window.location.href = '/login.html';
}

// Render user info + logout button in navbar
export function initNav() {
  const navUser = document.getElementById('nav-user');
  if (!navUser) return;

  const user = getCurrentUser();
  if (user) {
    navUser.innerHTML = `
      <span class="nav-username">👤 ${user.name}</span>
      <button class="btn btn-secondary btn-sm" id="btn-logout">Logout</button>
    `;
    document.getElementById('btn-logout').addEventListener('click', () => {
      clearSession();
      window.location.href = '/login.html';
    });
  } else {
    navUser.innerHTML = `
      <a href="/login.html" class="btn btn-primary btn-sm">Sign In</a>
    `;
  }
}