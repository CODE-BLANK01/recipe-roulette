const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
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