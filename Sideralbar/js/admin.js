/* =========================================================
   SIDERAL BAR — Admin Panel Script
   ========================================================= */

const ADMIN_PASSWORD = 'sideral2024';
let menuData = null;
let currentPage = 'dashboard';
let editingDishId = null;
let editingCatId = null;
let expandedCats = new Set();

// ── AUTH ────────────────────────────────────────────────────
function checkAuth() {
  return sessionStorage.getItem('sideral_admin') === 'ok';
}

function login(pass) {
  if (pass === ADMIN_PASSWORD) {
    sessionStorage.setItem('sideral_admin', 'ok');
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem('sideral_admin');
  location.reload();
}

// ── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  menuData = getMenuData();

  if (checkAuth()) {
    showApp();
  } else {
    document.getElementById('login-screen').style.display = 'flex';
  }

  // Login form
  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    const pass = document.getElementById('admin-password').value;
    if (login(pass)) {
      showApp();
    } else {
      const err = document.getElementById('login-error');
      err.style.display = 'block';
      err.textContent = 'Contraseña incorrecta. Inténtalo de nuevo.';
    }
  });

  // Logout
  document.getElementById('btn-logout').addEventListener('click', () => {
    if (confirm('¿Cerrar sesión?')) logout();
  });

  // Nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      if (page) navigateTo(page);
    });
  });

  // Modal close
  document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  // Close modal on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeAllModals();
    });
  });

  // New category btn
  document.getElementById('btn-new-category').addEventListener('click', openNewCategoryModal);
  document.getElementById('btn-save-category').addEventListener('click', saveCategory);

  // New dish btn (on menu page)
  document.getElementById('btn-new-dish').addEventListener('click', () => openDishModal(null, null));
  document.getElementById('btn-save-dish').addEventListener('click', saveDish);

  // Image upload preview
  setupImageUploads();

  // Badge chips
  setupBadgeChips();

  // Settings
  document.getElementById('btn-reset-data').addEventListener('click', () => {
    if (confirm('⚠️ ¿Resetear toda la carta a los datos originales? Esta acción no se puede deshacer.')) {
      resetMenuData();
      menuData = getMenuData();
      renderCurrentPage();
      toast('Carta reseteada a los datos originales', 'info');
    }
  });
});

function showApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('admin-app').classList.add('visible');
  navigateTo('dashboard');
}

// ── NAVIGATION ──────────────────────────────────────────────
function navigateTo(page) {
  currentPage = page;

  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  document.querySelectorAll('.admin-page').forEach(p => {
    p.classList.toggle('active', p.id === `page-${page}`);
  });

  const titles = {
    dashboard: 'Dashboard',
    menu: 'Gestión de la Carta',
    settings: 'Ajustes'
  };

  document.getElementById('topbar-title').textContent = titles[page] || page;
  renderCurrentPage();
}

function renderCurrentPage() {
  if (currentPage === 'dashboard') renderDashboard();
  if (currentPage === 'menu') renderMenuPage();
}

// ── DASHBOARD ───────────────────────────────────────────────
function renderDashboard() {
  const data = menuData;
  let totalDishes = 0;
  let activeDishes = 0;

  data.categorias.forEach(cat => {
    totalDishes += cat.platos.length;
    activeDishes += cat.platos.filter(p => p.disponible).length;
  });

  document.getElementById('stat-categories').textContent = data.categorias.length;
  document.getElementById('stat-dishes').textContent = totalDishes;
  document.getElementById('stat-active').textContent = activeDishes;
  document.getElementById('stat-inactive').textContent = totalDishes - activeDishes;

  // Recent changes summary
  const recent = document.getElementById('recent-list');
  if (recent) {
    const items = [];
    data.categorias.forEach(cat => {
      cat.platos.slice(0, 2).forEach(p => {
        items.push(`<div class="recent-item">
          <span class="recent-name">${p.nombre}</span>
          <span class="recent-cat">${cat.nombre}</span>
          <span class="dish-status ${p.disponible ? 'active' : 'inactive'}">${p.disponible ? 'Activo' : 'Oculto'}</span>
        </div>`);
      });
    });
    recent.innerHTML = items.slice(0, 5).join('');
  }
}

// ── MENU PAGE ───────────────────────────────────────────────
function renderMenuPage() {
  const container = document.getElementById('categories-list');
  if (!container) return;

  container.innerHTML = menuData.categorias.map(cat => `
    <div class="category-item ${expandedCats.has(cat.id) ? 'expanded' : ''}" id="cat-item-${cat.id}">
      <div style="flex:1;min-width:0">
        <div class="cat-info" onclick="toggleCategory('${cat.id}')" style="cursor:pointer">
          <span class="cat-emoji">${cat.emoji}</span>
          <div>
            <div class="cat-name">${cat.nombre}</div>
            <div class="cat-count">${cat.platos.length} platos · ${cat.platos.filter(p=>p.disponible).length} activos</div>
          </div>
          <span style="margin-left:auto;color:var(--cream-muted);font-size:0.8rem;padding:0 1rem">
            ${expandedCats.has(cat.id) ? '▲' : '▼'}
          </span>
        </div>

        <div class="dishes-list ${expandedCats.has(cat.id) ? 'open' : ''}" id="dishes-${cat.id}">
          ${cat.platos.map(p => `
            <div class="dish-item">
              ${p.imagen
                ? `<img class="dish-thumb" src="${p.imagen}" alt="${p.nombre}" onerror="this.style.display='none'">`
                : `<div class="dish-thumb-placeholder">🍽️</div>`
              }
              <div class="dish-info">
                <div class="dish-name">${p.nombre}</div>
                <div class="dish-price">${p.precio}€ <small style="color:var(--cream-muted);font-size:0.75rem">${p.unidad}</small></div>
              </div>
              <span class="dish-status ${p.disponible ? 'active' : 'inactive'}">
                ${p.disponible ? '✓ Activo' : '✗ Oculto'}
              </span>
              <div class="dish-actions">
                <button class="btn btn-outline btn-sm btn-icon" onclick="openDishModal('${cat.id}','${p.id}')" title="Editar">✏️</button>
                <button class="btn btn-sm btn-icon" style="border:1px solid var(--border-input);background:transparent;color:var(--cream-muted)"
                  onclick="toggleDishAvailability('${cat.id}','${p.id}')" title="${p.disponible ? 'Ocultar' : 'Mostrar'}">
                  ${p.disponible ? '👁' : '🙈'}
                </button>
                <button class="btn btn-danger btn-sm btn-icon" onclick="deleteDish('${cat.id}','${p.id}')" title="Eliminar">🗑</button>
              </div>
            </div>
          `).join('')}

          <button class="btn btn-outline btn-sm" style="margin-top:0.5rem;align-self:flex-start"
            onclick="openDishModal('${cat.id}', null)">
            + Añadir plato a ${cat.nombre}
          </button>
        </div>
      </div>

      <div class="cat-actions" style="margin-left:1rem;flex-shrink:0;align-self:flex-start;margin-top:0.2rem">
        <button class="btn btn-outline btn-sm" onclick="openEditCategoryModal('${cat.id}')">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="deleteCategory('${cat.id}')">🗑</button>
      </div>
    </div>
  `).join('');
}

function toggleCategory(id) {
  if (expandedCats.has(id)) {
    expandedCats.delete(id);
  } else {
    expandedCats.add(id);
  }
  renderMenuPage();
}

// ── CATEGORY CRUD ───────────────────────────────────────────
function openNewCategoryModal() {
  editingCatId = null;
  document.getElementById('modal-cat-title').textContent = 'Nueva Categoría';
  document.getElementById('cat-nombre').value = '';
  document.getElementById('cat-emoji').value = '✦';
  document.getElementById('cat-descripcion').value = '';
  openModal('modal-category');
}

function openEditCategoryModal(catId) {
  const cat = menuData.categorias.find(c => c.id === catId);
  if (!cat) return;
  editingCatId = catId;
  document.getElementById('modal-cat-title').textContent = 'Editar Categoría';
  document.getElementById('cat-nombre').value = cat.nombre;
  document.getElementById('cat-emoji').value = cat.emoji;
  document.getElementById('cat-descripcion').value = cat.descripcion;
  openModal('modal-category');
}

function saveCategory() {
  const nombre = document.getElementById('cat-nombre').value.trim();
  const emoji = document.getElementById('cat-emoji').value.trim() || '✦';
  const descripcion = document.getElementById('cat-descripcion').value.trim();

  if (!nombre) { toast('El nombre es obligatorio', 'error'); return; }

  if (editingCatId) {
    const cat = menuData.categorias.find(c => c.id === editingCatId);
    if (cat) {
      cat.nombre = nombre;
      cat.emoji = emoji;
      cat.descripcion = descripcion;
    }
    toast(`Categoría "${nombre}" actualizada`, 'success');
  } else {
    const id = nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    menuData.categorias.push({
      id: id + '-' + Date.now(),
      nombre, emoji, descripcion,
      platos: []
    });
    toast(`Categoría "${nombre}" creada`, 'success');
  }

  saveAndRefresh();
  closeAllModals();
}

function deleteCategory(catId) {
  const cat = menuData.categorias.find(c => c.id === catId);
  if (!cat) return;
  if (!confirm(`¿Eliminar la categoría "${cat.nombre}" y todos sus platos? Esta acción no se puede deshacer.`)) return;
  menuData.categorias = menuData.categorias.filter(c => c.id !== catId);
  saveAndRefresh();
  toast(`Categoría eliminada`, 'info');
}

// ── DISH CRUD ────────────────────────────────────────────────
function openDishModal(catId, dishId) {
  editingDishId = dishId;
  editingCatId = catId;

  const catSelect = document.getElementById('dish-categoria');
  catSelect.innerHTML = menuData.categorias.map(c =>
    `<option value="${c.id}" ${c.id === catId ? 'selected' : ''}>${c.nombre}</option>`
  ).join('');

  const preview = document.getElementById('dish-img-preview');
  preview.classList.remove('show');

  // Reset badge chips
  document.querySelectorAll('.badge-chip').forEach(c => c.classList.remove('selected'));

  if (dishId) {
    const cat = menuData.categorias.find(c => c.id === catId);
    const dish = cat?.platos.find(p => p.id === dishId);
    if (!dish) return;

    document.getElementById('modal-dish-title').textContent = 'Editar Plato';
    document.getElementById('dish-nombre').value = dish.nombre;
    document.getElementById('dish-descripcion').value = dish.descripcion;
    document.getElementById('dish-precio').value = dish.precio;
    document.getElementById('dish-unidad').value = dish.unidad;
    document.getElementById('dish-imagen-url').value = dish.imagen || '';
    document.getElementById('dish-disponible').checked = dish.disponible;
    document.getElementById('dish-rating').value = dish.rating;

    if (dish.imagen) {
      preview.src = dish.imagen;
      preview.classList.add('show');
    }

    if (dish.badge) {
      document.querySelectorAll('.badge-chip').forEach(c => {
        if (c.dataset.badge === dish.badge) c.classList.add('selected');
      });
    }
  } else {
    document.getElementById('modal-dish-title').textContent = 'Nuevo Plato';
    document.getElementById('dish-nombre').value = '';
    document.getElementById('dish-descripcion').value = '';
    document.getElementById('dish-precio').value = '';
    document.getElementById('dish-unidad').value = 'plato';
    document.getElementById('dish-imagen-url').value = '';
    document.getElementById('dish-disponible').checked = true;
    document.getElementById('dish-rating').value = '4.5';
  }

  openModal('modal-dish');
}

function saveDish() {
  const nombre = document.getElementById('dish-nombre').value.trim();
  const descripcion = document.getElementById('dish-descripcion').value.trim();
  const precio = document.getElementById('dish-precio').value.trim();
  const unidad = document.getElementById('dish-unidad').value.trim();
  const catId = document.getElementById('dish-categoria').value;
  const imagenUrl = document.getElementById('dish-imagen-url').value.trim();
  const disponible = document.getElementById('dish-disponible').checked;
  const rating = parseFloat(document.getElementById('dish-rating').value) || 4.5;
  const selectedBadge = document.querySelector('.badge-chip.selected');
  const badge = selectedBadge ? selectedBadge.dataset.badge : null;

  if (!nombre) { toast('El nombre del plato es obligatorio', 'error'); return; }
  if (!precio) { toast('El precio es obligatorio', 'error'); return; }

  const dish = {
    nombre, descripcion, precio, unidad,
    imagen: imagenUrl,
    disponible, rating,
    numResenas: 0,
    badge,
  };

  if (editingDishId) {
    // Edit existing
    const oldCat = menuData.categorias.find(c => c.id === editingCatId);
    const dishIdx = oldCat?.platos.findIndex(p => p.id === editingDishId);

    if (dishIdx !== undefined && dishIdx > -1) {
      if (catId !== editingCatId) {
        // Move to different category
        const oldDish = oldCat.platos[dishIdx];
        oldCat.platos.splice(dishIdx, 1);
        const newCat = menuData.categorias.find(c => c.id === catId);
        newCat?.platos.push({ ...oldDish, ...dish });
      } else {
        oldCat.platos[dishIdx] = { ...oldCat.platos[dishIdx], ...dish };
      }
    }
    toast(`"${nombre}" actualizado`, 'success');
  } else {
    // New dish
    const cat = menuData.categorias.find(c => c.id === catId);
    if (!cat) { toast('Categoría no encontrada', 'error'); return; }
    dish.id = 'dish-' + Date.now();
    dish.numResenas = 0;
    cat.platos.push(dish);
    expandedCats.add(catId);
    toast(`"${nombre}" añadido a ${cat.nombre}`, 'success');
  }

  saveAndRefresh();
  closeAllModals();
}

function deleteDish(catId, dishId) {
  const cat = menuData.categorias.find(c => c.id === catId);
  const dish = cat?.platos.find(p => p.id === dishId);
  if (!dish) return;
  if (!confirm(`¿Eliminar "${dish.nombre}"? Esta acción no se puede deshacer.`)) return;
  cat.platos = cat.platos.filter(p => p.id !== dishId);
  saveAndRefresh();
  toast(`"${dish.nombre}" eliminado`, 'info');
}

function toggleDishAvailability(catId, dishId) {
  const cat = menuData.categorias.find(c => c.id === catId);
  const dish = cat?.platos.find(p => p.id === dishId);
  if (!dish) return;
  dish.disponible = !dish.disponible;
  saveAndRefresh();
  toast(`"${dish.nombre}" ${dish.disponible ? 'activado' : 'ocultado'}`, 'info');
}

// ── HELPERS ─────────────────────────────────────────────────
function saveAndRefresh() {
  saveMenuData(menuData);
  renderCurrentPage();
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  document.body.style.overflow = '';
}

function setupImageUploads() {
  // URL input preview
  const urlInput = document.getElementById('dish-imagen-url');
  const preview = document.getElementById('dish-img-preview');

  if (urlInput && preview) {
    urlInput.addEventListener('input', () => {
      const url = urlInput.value.trim();
      if (url) {
        preview.src = url;
        preview.classList.add('show');
        preview.onerror = () => preview.classList.remove('show');
      } else {
        preview.classList.remove('show');
      }
    });
  }

  // File upload
  const fileInput = document.getElementById('dish-image-file');
  if (fileInput && preview) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        preview.src = e.target.result;
        preview.classList.add('show');
        if (urlInput) urlInput.value = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
}

function setupBadgeChips() {
  document.querySelectorAll('.badge-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const wasSelected = chip.classList.contains('selected');
      document.querySelectorAll('.badge-chip').forEach(c => c.classList.remove('selected'));
      if (!wasSelected) chip.classList.add('selected');
    });
  });
}

// ── TOAST ────────────────────────────────────────────────────
function toast(msg, type = 'info') {
  const icons = { success: '✅', error: '❌', info: '✦' };
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-msg">${msg}</span>`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}
