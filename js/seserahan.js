/**
 * Seserahan - Manajemen Belanja & Progres Item Seserahan
 */

const DEFAULT_SESERAHAN_CATEGORIES = [
  {
    id: 'alat-ibadah',
    name: 'Alat Ibadah',
    icon: '🕌',
    isOpen: true,
    items: [
      { id: 'ai1', name: 'Sajadah', done: true, price: 88000, link: '' },
      { id: 'ai2', name: 'Mukena', done: true, price: 185000, link: '' },
      { id: 'ai3', name: 'Al-Qur\'an', done: false, price: null, link: '' },
      { id: 'ai4', name: 'Tasbih', done: false, price: null, link: '' }
    ]
  },
  {
    id: 'make-up',
    name: 'Make Up',
    icon: '💄',
    isOpen: false,
    items: [
      { id: 'mu1', name: 'Primer & Foundation', done: false, price: null, link: '' },
      { id: 'mu2', name: 'Cushion & Powder', done: false, price: null, link: '' },
      { id: 'mu3', name: 'Eyeshadow Palette', done: false, price: null, link: '' },
      { id: 'mu4', name: 'Blush On & Highlighter', done: false, price: null, link: '' },
      { id: 'mu5', name: 'Lip Matte & Setting Spray', done: false, price: null, link: '' },
      { id: 'mu6', name: 'Mascara & Eyeliner', done: false, price: null, link: '' },
      { id: 'mu7', name: 'Makeup Remover', done: false, price: null, link: '' }
    ]
  },
  {
    id: 'bodycare',
    name: 'Bodycare',
    icon: '🧴',
    isOpen: false,
    items: [
      { id: 'bc1', name: 'Bodycare Set (Lotion, Body Scrub)', done: false, price: null, link: '' },
      { id: 'bc2', name: 'Parfum / Eau de Parfum', done: false, price: null, link: '' },
      { id: 'bc3', name: 'Deodoran', done: false, price: null, link: '' },
      { id: 'bc4', name: 'Hair Tonic & Hair Serum', done: false, price: null, link: '' },
      { id: 'bc5', name: 'Sampo & Conditioner', done: false, price: null, link: '' }
    ]
  },
  {
    id: 'skincare',
    name: 'Skincare',
    icon: '✨',
    isOpen: false,
    items: [
      { id: 'sk1', name: 'Facial Wash', done: false, price: null, link: '' },
      { id: 'sk2', name: 'Toner & Essence', done: false, price: null, link: '' },
      { id: 'sk3', name: 'Serum', done: false, price: null, link: '' },
      { id: 'sk4', name: 'Moisturizer & Sunscreen', done: false, price: null, link: '' },
      { id: 'sk5', name: 'Night Cream', done: false, price: null, link: '' }
    ]
  },
  {
    id: 'pakaian',
    name: 'Pakaian',
    icon: '👗',
    isOpen: false,
    items: [
      { id: 'pk1', name: 'Dress / Gamis', done: false, price: null, link: '' },
      { id: 'pk2', name: 'Jilbab / Kerudung Segi Empat', done: false, price: null, link: '' },
      { id: 'pk3', name: 'Tas Tangan', done: false, price: null, link: '' },
      { id: 'pk4', name: 'Alas Kaki / Sandal', done: false, price: null, link: '' },
      { id: 'pk5', name: 'Kain Batik', done: false, price: null, link: '' }
    ]
  },
  {
    id: 'pakaian-dalam',
    name: 'Pakaian Dalam',
    icon: '🎀',
    isOpen: false,
    items: [
      { id: 'pd1', name: 'Piyama Set', done: false, price: null, link: '' },
      { id: 'pd2', name: 'Lingerie', done: false, price: null, link: '' },
      { id: 'pd3', name: 'Celana Dalam (set)', done: false, price: null, link: '' },
      { id: 'pd4', name: 'Bra (set)', done: false, price: null, link: '' }
    ]
  },
  {
    id: 'aksesoris',
    name: 'Aksesoris',
    icon: '💎',
    isOpen: false,
    items: [
      { id: 'ak1', name: 'Jam Tangan', done: false, price: null, link: '' },
      { id: 'ak2', name: 'Dompet', done: false, price: null, link: '' },
      { id: 'ak3', name: 'Kerudung Bergo / Pashmina', done: false, price: null, link: '' }
    ]
  },
  {
    id: 'set-perhiasan',
    name: 'Set Perhiasan',
    icon: '💍',
    isOpen: false,
    items: [
      { id: 'ph1', name: 'Cincin Emas', done: false, price: null, link: '' },
      { id: 'ph2', name: 'Gelang Emas', done: false, price: null, link: '' },
      { id: 'ph3', name: 'Kalung Emas', done: false, price: null, link: '' }
    ]
  }
];

const DEFAULT_HANTARAN_CATEGORIES = [
  {
    id: 'cincin',
    name: 'Cincin & Perhiasan',
    icon: '💍',
    isOpen: true,
    items: [
      { id: 'hc1', name: 'Cincin Lamaran / Engagement Ring', done: false, price: null, link: '' },
      { id: 'hc2', name: 'Kotak Cincin Hias', done: false, price: null, link: '' }
    ]
  },
  {
    id: 'hantaran-pria',
    name: 'Hantaran dari Pihak Pria',
    icon: '🎁',
    isOpen: false,
    items: [
      { id: 'hp1', name: 'Kain / Bahan Kebaya', done: false, price: null, link: '' },
      { id: 'hp2', name: 'Tas & Sepatu', done: false, price: null, link: '' },
      { id: 'hp3', name: 'Set Skincare / Kosmetik', done: false, price: null, link: '' },
      { id: 'hp4', name: 'Parfum', done: false, price: null, link: '' }
    ]
  },
  {
    id: 'kue-buah',
    name: 'Kue & Buah',
    icon: '🍰',
    isOpen: false,
    items: [
      { id: 'kb1', name: 'Kue Tradisional Khas Daerah', done: false, price: null, link: '' },
      { id: 'kb2', name: 'Parsel Buah', done: false, price: null, link: '' },
      { id: 'kb3', name: 'Cake / Bolu', done: false, price: null, link: '' }
    ]
  },
  {
    id: 'hantaran-balasan',
    name: 'Hantaran Balasan Pihak Wanita',
    icon: '🎀',
    isOpen: false,
    items: [
      { id: 'hb1', name: 'Kemeja / Batik', done: false, price: null, link: '' },
      { id: 'hb2', name: 'Sarung / Peci', done: false, price: null, link: '' },
      { id: 'hb3', name: 'Kue Balasan', done: false, price: null, link: '' }
    ]
  },
  {
    id: 'perlengkapan',
    name: 'Nampan & Dekorasi Hantaran',
    icon: '🧺',
    isOpen: false,
    items: [
      { id: 'np1', name: 'Sewa Nampan / Kotak Hantaran', done: false, price: null, link: '' },
      { id: 'np2', name: 'Jasa Hias Hantaran', done: false, price: null, link: '' }
    ]
  }
];

let seserahanData = [];
let activeFilter = 'all';
let editItemContext = { catId: null, itemId: null };

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

function safeExternalUrl(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch (_) { return ''; }
}

// ─── Init ────────────────────────────────────────────────────────────────────
async function initSeserahan() {
  await WP_Auth.syncUserData();
  WP_Layout.renderHeader();

  const eventType = WP_Utils.getEventType();
  const pageTitleEl = document.querySelector('.page-header-title h2') || document.querySelector('main.main-content h2');
  const pageDescEl = document.querySelector('.page-header-title p') || document.querySelector('main.main-content p');
  if (pageTitleEl) {
    pageTitleEl.textContent = 'Seserahan';
  }
  if (pageDescEl) {
    pageDescEl.textContent = eventType === 'engagement'
      ? 'Hantaran / Seserahan Lamaran — Kelola daftar item hantaran lamaran, harga, dan progres pembelanjaannya.'
      : 'Seserahan Pernikahan — Kelola daftar item seserahan nikah, estimasi harga, dan progres pembelanjaan per kategori.';
  }

  await loadSeserahanData();
  buildFilterOptions();
  renderAll();
}

// ─── Load / Save ─────────────────────────────────────────────────────────────
async function loadSeserahanData() {
  const saved = await WP_DataStore.loadPageState(WP_Utils.STORAGE_KEYS.SESERAHAN, null);
  if (saved && Array.isArray(saved) && saved.length > 0) {
    seserahanData = saved;
  } else {
    const defaults = WP_Utils.getEventType() === 'engagement'
      ? DEFAULT_HANTARAN_CATEGORIES
      : DEFAULT_SESERAHAN_CATEGORIES;
    seserahanData = JSON.parse(JSON.stringify(defaults));
    saveSeserahanData();
  }
}

function saveSeserahanData() {
  return WP_DataStore.savePageState(WP_Utils.STORAGE_KEYS.SESERAHAN, seserahanData);
}

// ─── Filter ──────────────────────────────────────────────────────────────────
function buildFilterOptions() {
  const select = document.getElementById('seserahan-filter-select');
  if (!select) return;
  const opts = seserahanData.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  select.innerHTML = `<option value="all">Semua Kategori</option>${opts}`;
}

function onFilterChange(val) {
  activeFilter = val;
  renderCategoryList();
}

// ─── Summary ─────────────────────────────────────────────────────────────────
function renderSummary() {
  const allItems = seserahanData.flatMap(c => c.items);
  const doneItems = allItems.filter(i => i.done);
  const totalBudget = allItems.reduce((s, i) => s + (i.price || 0), 0);
  const doneSpent = doneItems.reduce((s, i) => s + (i.price || 0), 0);

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  setEl('ses-count-done', `${doneItems.length} / ${allItems.length} Item`);
  setEl('ses-total-items', `${allItems.length} Item`);
  setEl('ses-total-budget', WP_Utils.formatRupiah(totalBudget));
  setEl('ses-total-spent', WP_Utils.formatRupiah(doneSpent));
}

// ─── Render All ───────────────────────────────────────────────────────────────
function renderAll() {
  renderSummary();
  renderCategoryList();
}

// ─── Category List ───────────────────────────────────────────────────────────
function renderCategoryList() {
  const container = document.getElementById('seserahan-categories-container');
  if (!container) return;

  const filtered = activeFilter === 'all'
    ? seserahanData
    : seserahanData.filter(c => c.id === activeFilter);

  container.innerHTML = filtered.map(cat => renderCategoryCard(cat)).join('');
}

function renderCategoryCard(cat) {
  const doneCount = cat.items.filter(i => i.done).length;
  const total = cat.items.length;
  const isOpen = cat.isOpen;

  const itemsHtml = cat.items.map(item => renderItemRow(cat.id, item)).join('');

  return `
    <div class="seserahan-category-group" id="cat-group-${cat.id}">
      <div class="seserahan-category-header" onclick="toggleCategory('${cat.id}')">
        <div class="seserahan-cat-left">
          <div class="seserahan-cat-icon">${cat.icon}</div>
          <div>
            <div class="seserahan-cat-name">${cat.name}</div>
            <div class="seserahan-cat-count">${doneCount}/${total} item selesai</div>
          </div>
        </div>
        <div class="seserahan-cat-right">
          <button type="button" class="btn-cat-add" onclick="event.stopPropagation(); openAddItemModal('${cat.id}')" title="Tambah Item">+</button>
          <button type="button" class="btn-cat-toggle ${isOpen ? 'open' : ''}" title="Expand/Collapse">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>
      </div>
      <div class="seserahan-items-list ${isOpen ? 'open' : ''}" id="items-list-${cat.id}">
        ${total === 0 ? `<div style="padding: 8px 0; font-size: var(--font-size-xs); color: var(--text-muted);">Belum ada item. Klik <strong>+</strong> untuk menambahkan.</div>` : itemsHtml}
      </div>
    </div>
  `;
}

function renderItemRow(catId, item) {
  const priceEl = item.price !== null && item.price !== undefined
    ? `<span class="seserahan-item-price">${WP_Utils.formatRupiah(item.price)}</span>`
    : `<span class="seserahan-item-price empty">Harga belum diisi</span>`;

  const url = safeExternalUrl(item.link);
  const linkEl = url
    ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="seserahan-item-link" onclick="event.stopPropagation()">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        Link pembelian
      </a>`
    : `<span class="seserahan-item-link" style="color: var(--text-light);">→ Link pembelian</span>`;

  return `
    <div class="seserahan-item-row ${item.done ? 'done' : ''}" id="item-row-${item.id}">
      <div class="seserahan-item-left">
        <div class="seserahan-checkbox" onclick="toggleItem('${catId}', '${item.id}')">
          ${item.done ? '✓' : ''}
        </div>
        <div class="seserahan-item-info">
          <div class="seserahan-item-name">${escapeHtml(item.name)}</div>
          ${linkEl}
        </div>
      </div>
      <div class="seserahan-item-right">
        ${priceEl}
        <button type="button" class="btn-item-menu" onclick="openEditItemModal('${catId}', '${item.id}')" title="Edit Item">⋮</button>
      </div>
    </div>
  `;
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function toggleCategory(catId) {
  const cat = seserahanData.find(c => c.id === catId);
  if (cat) {
    cat.isOpen = !cat.isOpen;
    saveSeserahanData();
    renderCategoryList();
  }
}

function toggleItem(catId, itemId) {
  const cat = seserahanData.find(c => c.id === catId);
  if (!cat) return;
  const item = cat.items.find(i => i.id === itemId);
  if (!item) return;
  item.done = !item.done;
  saveSeserahanData();
  renderAll();
}

// ─── Add Item Modal ───────────────────────────────────────────────────────────
function openAddItemModal(catId) {
  // Kategori bisa berbeda per event_type; pakai kategori pertama bila tidak ditemukan
  const cat = seserahanData.find(c => c.id === catId) || seserahanData[0];
  if (!cat) return;
  catId = cat.id;
  editItemContext = { catId, itemId: null };

  document.getElementById('modal-item-title').textContent = `Tambah Item — ${cat.name}`;
  document.getElementById('item-modal-name').value = '';
  document.getElementById('item-modal-price').value = '';
  document.getElementById('item-modal-link').value = '';
  document.getElementById('item-modal-cat').value = catId;
  document.getElementById('modal-add-item').classList.add('open');
}

function openEditItemModal(catId, itemId) {
  const cat = seserahanData.find(c => c.id === catId);
  if (!cat) return;
  const item = cat.items.find(i => i.id === itemId);
  if (!item) return;

  editItemContext = { catId, itemId };
  document.getElementById('modal-item-title').textContent = `Edit Item — ${cat.name}`;
  document.getElementById('item-modal-name').value = item.name;
  document.getElementById('item-modal-price').value = item.price !== null ? item.price : '';
  document.getElementById('item-modal-link').value = item.link || '';
  document.getElementById('item-modal-cat').value = catId;
  document.getElementById('modal-add-item').classList.add('open');
}

function closeItemModal() {
  document.getElementById('modal-add-item').classList.remove('open');
  editItemContext = { catId: null, itemId: null };
}

function handleItemModalSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('item-modal-name').value.trim();
  const price = document.getElementById('item-modal-price').value !== ''
    ? Number(document.getElementById('item-modal-price').value)
    : null;
  const link = document.getElementById('item-modal-link').value.trim();
  const catId = document.getElementById('item-modal-cat').value;

  const cat = seserahanData.find(c => c.id === catId);
  if (!cat) return;

  if (editItemContext.itemId) {
    // Edit mode
    const item = cat.items.find(i => i.id === editItemContext.itemId);
    if (item) {
      item.name = name;
      item.price = price;
      item.link = link;
    }
    WP_UI.showToast(`Item "${name}" berhasil diperbarui.`, 'success');
  } else {
    // Add mode
    const newItem = {
      id: `item-${Date.now()}`,
      name,
      done: false,
      price,
      link
    };
    cat.items.push(newItem);
    cat.isOpen = true;
    WP_UI.showToast(`Item "${name}" berhasil ditambahkan ke ${cat.name}!`, 'success');
  }

  saveSeserahanData();
  closeItemModal();
  renderAll();
}

function handleDeleteItem() {
  const { catId, itemId } = editItemContext;
  if (!catId || !itemId) return;
  if (!confirm('Hapus item ini dari daftar seserahan?')) return;

  const cat = seserahanData.find(c => c.id === catId);
  if (cat) {
    const item = cat.items.find(i => i.id === itemId);
    const name = item ? item.name : 'Item';
    cat.items = cat.items.filter(i => i.id !== itemId);
    saveSeserahanData();
    closeItemModal();
    renderAll();
    WP_UI.showToast(`"${name}" telah dihapus.`, 'info');
  }
}

window.WP_Seserahan = {
  initSeserahan,
  onFilterChange,
  toggleCategory,
  toggleItem,
  openAddItemModal,
  openEditItemModal,
  closeItemModal,
  handleItemModalSubmit,
  handleDeleteItem
};
