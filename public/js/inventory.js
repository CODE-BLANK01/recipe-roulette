import {
  getInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from './api.js';

// ── DOM refs ──────────────────────────────────────────────
const listEl = document.getElementById('inventory-list');
const categoryEl = document.getElementById('filter-category');
const expiryEl = document.getElementById('filter-expiry');

const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const inventoryForm = document.getElementById('inventory-form');
const itemIdEl = document.getElementById('item-id');
const inputName = document.getElementById('input-name');
const inputQuantity = document.getElementById('input-quantity');
const inputUnit = document.getElementById('input-unit');
const inputCategory = document.getElementById('input-category');
const inputExpiry = document.getElementById('input-expiry');

// ── Expiry badge ──────────────────────────────────────────
function expiryBadge(status, daysLeft) {
  if (status === 'none') return '';
  const map = {
    expired: `<span class="badge badge-expired">Expired</span>`,
    critical: `<span class="badge badge-critical">🔴 ${daysLeft}d left</span>`,
    warning: `<span class="badge badge-warning">🟡 ${daysLeft}d left</span>`,
    fresh: `<span class="badge badge-fresh">🟢 ${daysLeft}d left</span>`,
  };
  return map[status] || '';
}

// ── Render ────────────────────────────────────────────────
function renderList(items) {
  if (!items.length) {
    listEl.innerHTML = '<p class="empty-text">No ingredients found.</p>';
    return;
  }

  // Group by category
  const groups = {};
  for (const item of items) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }

  listEl.innerHTML = Object.entries(groups)
    .map(
      ([cat, catItems]) => `
    <div class="category-group">
      <h3 class="category-title">${cat}</h3>
      <table class="inventory-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Expiry</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${catItems
            .map(
              (item) => `
          <tr class="row-${item.expiryStatus || 'none'}">
            <td>${item.name}</td>
            <td>${item.quantity} ${item.unit}</td>
            <td>${expiryBadge(item.expiryStatus, item.daysLeft)}</td>
            <td class="row-actions">
              <button class="btn btn-secondary btn-sm"
                data-action="edit" data-id="${item._id}">Edit</button>
              <button class="btn btn-danger btn-sm"
                data-action="delete" data-id="${item._id}">Delete</button>
            </td>
          </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>`
    )
    .join('');
}

// ── Load ──────────────────────────────────────────────────
async function loadInventory() {
  listEl.innerHTML = '<p class="loading-text">Loading inventory…</p>';
  try {
    const params = {};
    if (categoryEl.value) params.category = categoryEl.value;
    if (expiryEl.checked) params.sortByExpiry = 'true';
    const items = await getInventory(params);
    renderList(items);
  } catch (err) {
    listEl.innerHTML = `<p class="error-text">Failed to load inventory: ${err.message}</p>`;
  }
}

// ── Modal helpers ─────────────────────────────────────────
function openModal(item = null) {
  inventoryForm.reset();
  if (item) {
    modalTitle.textContent = 'Edit Ingredient';
    itemIdEl.value = item._id;
    inputName.value = item.name;
    inputQuantity.value = item.quantity;
    inputUnit.value = item.unit;
    inputCategory.value = item.category;
    if (item.expirationDate) {
      inputExpiry.value = new Date(item.expirationDate)
        .toISOString()
        .split('T')[0];
    }
  } else {
    modalTitle.textContent = 'Add Ingredient';
    itemIdEl.value = '';
  }
  modalOverlay.classList.remove('hidden');
}

function closeModal() {
  modalOverlay.classList.add('hidden');
}

// ── Form submit ───────────────────────────────────────────
inventoryForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    name: inputName.value.trim(),
    quantity: Number(inputQuantity.value),
    unit: inputUnit.value,
    category: inputCategory.value,
    expirationDate: inputExpiry.value || null,
  };

  try {
    const id = itemIdEl.value;
    if (id) {
      await updateInventoryItem(id, data);
    } else {
      await createInventoryItem(data);
    }
    closeModal();
    loadInventory();
  } catch (err) {
    alert(`Error saving ingredient: ${err.message}`);
  }
});

// ── Table event delegation ────────────────────────────────
listEl.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { action, id } = btn.dataset;

  if (action === 'delete') {
    if (!confirm('Remove this ingredient from inventory?')) return;
    try {
      await deleteInventoryItem(id);
      loadInventory();
    } catch (err) {
      alert(`Error deleting item: ${err.message}`);
    }
  }

  if (action === 'edit') {
    // Fetch full item to pre-fill form
    try {
      const items = await getInventory();
      const item = items.find((i) => i._id === id);
      if (item) openModal(item);
    } catch (err) {
      alert(`Error loading item: ${err.message}`);
    }
  }
});

// ── Event listeners ───────────────────────────────────────
document.getElementById('btn-open-add').addEventListener('click', () => openModal());
document.getElementById('btn-close-modal').addEventListener('click', closeModal);
document.getElementById('btn-cancel').addEventListener('click', closeModal);
categoryEl.addEventListener('change', loadInventory);
expiryEl.addEventListener('change', loadInventory);
document.getElementById('btn-clear-filters').addEventListener('click', () => {
  categoryEl.value = '';
  expiryEl.checked = false;
  loadInventory();
});
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// ── Init ──────────────────────────────────────────────────
loadInventory();