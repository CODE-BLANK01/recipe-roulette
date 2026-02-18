import { getMatch, getShoppingList } from './api.js';

import { requireLogin, initNav } from './nav.js';
requireLogin(); // redirects to /login.html if no token
initNav(); 

// ── DOM refs ──────────────────────────────────────────────
const btnSpin = document.getElementById('btn-spin');
const cookableGrid = document.getElementById('cookable-grid');
const almostGrid = document.getElementById('almost-grid');
const shoppingListEl = document.getElementById('shopping-list');
const countCookable = document.getElementById('count-cookable');
const countAlmost = document.getElementById('count-almost');
const btnCopy = document.getElementById('btn-copy-list');

// ── Render helpers ────────────────────────────────────────
function difficultyBadge(d) {
  const map = { Easy: 'badge-easy', Medium: 'badge-medium', Hard: 'badge-hard' };
  return `<span class="badge ${map[d] || ''}">${d}</span>`;
}

function renderCookable(recipes) {
  countCookable.textContent = recipes.length;

  if (!recipes.length) {
    cookableGrid.innerHTML =
      '<p class="empty-text">No fully cookable recipes found. Try adding more ingredients to your inventory!</p>';
    return;
  }

  cookableGrid.innerHTML = recipes
    .map(
      (r) => `
    <article class="recipe-card">
      <h3>${r.title}</h3>
      <div class="card-meta">
        ${difficultyBadge(r.difficulty)}
        <span class="prep-time">⏱ ${r.prepTime} min</span>
      </div>
      <p style="font-size:0.85rem;color:var(--clr-text-muted);">
        ${r.ingredients.slice(0, 4).join(', ')}${r.ingredients.length > 4 ? '…' : ''}
      </p>
    </article>`
    )
    .join('');
}

function renderAlmost(entries) {
  countAlmost.textContent = entries.length;

  if (!entries.length) {
    almostGrid.innerHTML =
      '<p class="empty-text">No almost-cookable recipes. Your pantry might need a restock!</p>';
    return;
  }

  // entries from /match route: { _id, title, difficulty, prepTime, ingredients, missingIngredients, missingCount }
  almostGrid.innerHTML = entries
    .map(
      (r) => `
    <article class="recipe-card">
      <h3>${r.title}</h3>
      <div class="card-meta">
        ${difficultyBadge(r.difficulty)}
        <span class="prep-time">⏱ ${r.prepTime} min</span>
      </div>
      <div class="missing-list">
        <p>Missing ${r.missingCount} ingredient${r.missingCount > 1 ? 's' : ''}:</p>
        ${r.missingIngredients
          .map((ing) => `<span class="missing-pill">+ ${ing}</span>`)
          .join('')}
      </div>
    </article>`
    )
    .join('');
}

function renderShoppingList(items) {
  if (!items.length) {
    shoppingListEl.innerHTML =
      '<li class="empty-text">No items needed — your pantry is well stocked!</li>';
    return;
  }

  shoppingListEl.innerHTML = items
    .map(
      (item) => `
    <li>
      <span>${item}</span>
    </li>`
    )
    .join('');
}

// ── Spin ──────────────────────────────────────────────────
async function spin() {
  // Loading state
  btnSpin.disabled = true;
  btnSpin.classList.add('spinning');
  btnSpin.textContent = 'Spinning…';

  cookableGrid.innerHTML = '<p class="loading-text">Finding recipes…</p>';
  almostGrid.innerHTML = '<p class="loading-text">Finding recipes…</p>';
  shoppingListEl.innerHTML = '<li class="loading-text">Building list…</li>';
  countCookable.textContent = '';
  countAlmost.textContent = '';

  try {
    const [matchData, shoppingData] = await Promise.all([
      getMatch(),
      getShoppingList(),
    ]);

    // /api/recipes/match returns all recipes with missingCount
    // split into cookable (0 missing) and almost (1-2 missing)
    const cookable = matchData.filter((r) => r.missingCount === 0);
    const almost = matchData.filter(
      (r) => r.missingCount > 0 && r.missingCount <= 2
    );

    renderCookable(cookable);
    renderAlmost(almost);
    renderShoppingList(shoppingData);
  } catch (err) {
    cookableGrid.innerHTML = `<p class="error-text">Error: ${err.message}</p>`;
    almostGrid.innerHTML = '';
    shoppingListEl.innerHTML = '<li class="error-text">Failed to load.</li>';
  } finally {
    btnSpin.disabled = false;
    btnSpin.classList.remove('spinning');
    btnSpin.textContent = 'Spin Again 🎲';
  }
}

// ── Copy shopping list ────────────────────────────────────
function copyShoppingList() {
  const items = [...shoppingListEl.querySelectorAll('li span')].map(
    (el) => `• ${el.textContent.trim()}`
  );

  if (!items.length) return;

  navigator.clipboard
    .writeText(items.join('\n'))
    .then(() => {
      btnCopy.textContent = '✅ Copied!';
      setTimeout(() => (btnCopy.textContent = 'Copy List'), 2000);
    })
    .catch(() => {
      btnCopy.textContent = '❌ Failed';
      setTimeout(() => (btnCopy.textContent = 'Copy List'), 2000);
    });
}

// ── Event listeners ───────────────────────────────────────
btnSpin.addEventListener('click', spin);
btnCopy.addEventListener('click', copyShoppingList);