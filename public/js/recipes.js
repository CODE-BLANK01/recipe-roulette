import {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleFavorite,
} from './api.js';

// ── DOM refs ──────────────────────────────────────────────
const grid = document.getElementById('recipe-grid');
const searchEl = document.getElementById('search');
const diffEl = document.getElementById('filter-difficulty');
const prepEl = document.getElementById('filter-prep');
const favEl = document.getElementById('filter-favorites');

const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const recipeForm = document.getElementById('recipe-form');
const recipeIdEl = document.getElementById('recipe-id');
const inputTitle = document.getElementById('input-title');
const inputIngredients = document.getElementById('input-ingredients');
const inputInstructions = document.getElementById('input-instructions');
const inputPrep = document.getElementById('input-prep');
const inputDifficulty = document.getElementById('input-difficulty');

const detailOverlay = document.getElementById('detail-overlay');
const detailTitle = document.getElementById('detail-title');
const detailBody = document.getElementById('detail-body');

// ── Render helpers ────────────────────────────────────────
function difficultyBadge(d) {
  const map = { Easy: 'badge-easy', Medium: 'badge-medium', Hard: 'badge-hard' };
  return `<span class="badge ${map[d] || ''}">${d}</span>`;
}

function renderGrid(recipes) {
  if (!recipes.length) {
    grid.innerHTML = '<p class="empty-text">No recipes found.</p>';
    return;
  }
  grid.innerHTML = recipes
    .map(
      (r) => `
    <article class="recipe-card" data-id="${r._id}">
      <div class="card-header">
        <h3 class="card-title">${r.title}</h3>
        <button class="btn-icon btn-fav ${r.favorite ? 'active' : ''}"
          data-action="favorite" data-id="${r._id}"
          aria-label="Toggle favorite">⭐</button>
      </div>
      <div class="card-meta">
        ${difficultyBadge(r.difficulty)}
        <span class="prep-time">⏱ ${r.prepTime} min</span>
      </div>
      <p class="card-ingredients">${r.ingredients.slice(0, 4).join(', ')}${r.ingredients.length > 4 ? '…' : ''}</p>
      <div class="card-actions">
        <button class="btn btn-secondary btn-sm" data-action="view" data-id="${r._id}">View</button>
        <button class="btn btn-secondary btn-sm" data-action="edit" data-id="${r._id}">Edit</button>
        <button class="btn btn-danger btn-sm" data-action="delete" data-id="${r._id}">Delete</button>
      </div>
    </article>`
    )
    .join('');
}

// ── Load & filter ─────────────────────────────────────────
async function loadRecipes() {
  grid.innerHTML = '<p class="loading-text">Loading recipes…</p>';
  try {
    const params = {};
    if (searchEl.value) params.search = searchEl.value;
    if (diffEl.value) params.difficulty = diffEl.value;
    if (prepEl.value) params.maxPrep = prepEl.value;
    if (favEl.checked) params.favorite = 'true';
    const recipes = await getRecipes(params);
    renderGrid(recipes);
  } catch (err) {
    grid.innerHTML = `<p class="error-text">Failed to load recipes: ${err.message}</p>`;
  }
}

// ── Modal helpers ─────────────────────────────────────────
function openModal(recipe = null) {
  recipeForm.reset();
  if (recipe) {
    modalTitle.textContent = 'Edit Recipe';
    recipeIdEl.value = recipe._id;
    inputTitle.value = recipe.title;
    inputIngredients.value = recipe.ingredients.join('\n');
    inputInstructions.value = recipe.instructions;
    inputPrep.value = recipe.prepTime;
    inputDifficulty.value = recipe.difficulty;
  } else {
    modalTitle.textContent = 'Add Recipe';
    recipeIdEl.value = '';
  }
  modalOverlay.classList.remove('hidden');
}

function closeModal() {
  modalOverlay.classList.add('hidden');
}

function openDetail(recipe) {
  detailTitle.textContent = recipe.title;
  detailBody.innerHTML = `
    <div class="detail-meta">
      ${difficultyBadge(recipe.difficulty)}
      <span class="prep-time">⏱ ${recipe.prepTime} min</span>
      ${recipe.favorite ? '<span class="badge badge-fav">⭐ Favorite</span>' : ''}
    </div>
    <h4>Ingredients</h4>
    <ul class="detail-list">
      ${recipe.ingredients.map((i) => `<li>${i}</li>`).join('')}
    </ul>
    <h4>Instructions</h4>
    <p class="detail-instructions">${recipe.instructions}</p>
  `;
  detailOverlay.classList.remove('hidden');
}

// ── Form submit ───────────────────────────────────────────
recipeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    title: inputTitle.value.trim(),
    ingredients: inputIngredients.value
      .split('\n')
      .map((i) => i.trim())
      .filter(Boolean),
    instructions: inputInstructions.value.trim(),
    prepTime: Number(inputPrep.value),
    difficulty: inputDifficulty.value,
  };

  try {
    const id = recipeIdEl.value;
    if (id) {
      await updateRecipe(id, data);
    } else {
      await createRecipe(data);
    }
    closeModal();
    loadRecipes();
  } catch (err) {
    alert(`Error saving recipe: ${err.message}`);
  }
});

// ── Grid event delegation ─────────────────────────────────
grid.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { action, id } = btn.dataset;

  if (action === 'favorite') {
    try {
      await toggleFavorite(id);
      loadRecipes();
    } catch (err) {
      alert(`Error toggling favorite: ${err.message}`);
    }
  }

  if (action === 'delete') {
    if (!confirm('Delete this recipe?')) return;
    try {
      await deleteRecipe(id);
      loadRecipes();
    } catch (err) {
      alert(`Error deleting recipe: ${err.message}`);
    }
  }

  if (action === 'view') {
    try {
      const recipe = await getRecipe(id);
      openDetail(recipe);
    } catch (err) {
      alert(`Error loading recipe: ${err.message}`);
    }
  }

  if (action === 'edit') {
    try {
      const recipe = await getRecipe(id);
      openModal(recipe);
    } catch (err) {
      alert(`Error loading recipe: ${err.message}`);
    }
  }
});

// ── Event listeners ───────────────────────────────────────
document.getElementById('btn-open-add').addEventListener('click', () => openModal());
document.getElementById('btn-close-modal').addEventListener('click', closeModal);
document.getElementById('btn-cancel').addEventListener('click', closeModal);
document.getElementById('btn-close-detail').addEventListener('click', () =>
  detailOverlay.classList.add('hidden')
);

let debounceTimer;
searchEl.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(loadRecipes, 300);
});
diffEl.addEventListener('change', loadRecipes);
prepEl.addEventListener('change', loadRecipes);
favEl.addEventListener('change', loadRecipes);
document.getElementById('btn-clear-filters').addEventListener('click', () => {
  searchEl.value = '';
  diffEl.value = '';
  prepEl.value = '';
  favEl.checked = false;
  loadRecipes();
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
detailOverlay.addEventListener('click', (e) => {
  if (e.target === detailOverlay) detailOverlay.classList.add('hidden');
});

// ── Init ──────────────────────────────────────────────────
loadRecipes();