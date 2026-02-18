const BASE = '/api';

function getToken() {
  return localStorage.getItem('rr_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    // Token expired or invalid — clear and redirect to login
    if (res.status === 401) {
      localStorage.removeItem('rr_token');
      localStorage.removeItem('rr_user');
      window.location.href = '/login.html';
    }
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────
export const register = (data) =>
  request('/auth/register', { method: 'POST', body: JSON.stringify(data) });

export const login = (data) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify(data) });

export function saveSession(token, user) {
  localStorage.setItem('rr_token', token);
  localStorage.setItem('rr_user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('rr_token');
  localStorage.removeItem('rr_user');
}

export function getCurrentUser() {
  const u = localStorage.getItem('rr_user');
  return u ? JSON.parse(u) : null;
}

export function isLoggedIn() {
  return !!getToken();
}

// ── Recipes ──────────────────────────────────────────────
export const getRecipes = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return request(`/recipes${q ? '?' + q : ''}`);
};

export const getRecipe = (id) => request(`/recipes/${id}`);

export const createRecipe = (data) =>
  request('/recipes', { method: 'POST', body: JSON.stringify(data) });

export const updateRecipe = (id, data) =>
  request(`/recipes/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteRecipe = (id) =>
  request(`/recipes/${id}`, { method: 'DELETE' });

export const toggleFavorite = (id) =>
  request(`/recipes/favorite/${id}`, { method: 'PUT' });

// ── Inventory ─────────────────────────────────────────────
export const getInventory = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return request(`/inventory${q ? '?' + q : ''}`);
};

export const createInventoryItem = (data) =>
  request('/inventory', { method: 'POST', body: JSON.stringify(data) });

export const updateInventoryItem = (id, data) =>
  request(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteInventoryItem = (id) =>
  request(`/inventory/${id}`, { method: 'DELETE' });

// ── Roulette ──────────────────────────────────────────────
export const getMatch = () => request('/recipes/match');
export const getShoppingList = () => request('/recipes/shopping-list');