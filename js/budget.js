/**
 * Budget & Expense Management Logic
 */

let expensesList = [];
let totalBudgetAmount = 50000000;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

// Warna donut & kelas badge untuk kategori Wedding dan Engagement (WP_Utils.BUDGET_CATEGORIES)
const CATEGORY_STYLES = {
  'Venue':              { color: '#F59E0B', badge: 'badge-cat-venue' },
  'Venue/Lokasi':       { color: '#F59E0B', badge: 'badge-cat-venue' },
  'Akad':               { color: '#8B5CF6', badge: 'badge-cat-akad' },
  'Resepsi':            { color: '#0EA5E9', badge: 'badge-cat-resepsi' },
  'Dokumentasi':        { color: '#E11D48', badge: 'badge-cat-dokumentasi' },
  'Seserahan':          { color: '#EC4899', badge: 'badge-cat-seserahan' },
  'Hantaran/Seserahan': { color: '#EC4899', badge: 'badge-cat-seserahan' },
  'MUA':                { color: '#6366F1', badge: 'badge-cat-mua' },
  'MUA & Busana':       { color: '#6366F1', badge: 'badge-cat-mua' },
  'Catering':           { color: '#10B981', badge: 'badge-cat-catering' },
  'Dekorasi':           { color: '#14B8A6', badge: 'badge-cat-dekorasi' },
  'Ring/Cincin':        { color: '#EAB308', badge: 'badge-cat-cincin' },
  'Lain-lain':          { color: '#64748B', badge: 'badge-cat-default' }
};

const DEFAULT_WEDDING_EXPENSES = [
  { id: '1', date: '2026-09-16', name: 'Prewedding', category: 'Dokumentasi', amount: 850000, status: 'Lunas' },
  { id: '2', date: '2026-09-16', name: 'DP Venue', category: 'Venue', amount: 6000000, status: 'DP' },
  { id: '3', date: '2026-09-16', name: 'DP Makeup', category: 'Akad', amount: 2000000, status: 'DP' },
  { id: '4', date: '2026-09-16', name: 'Sajadah', category: 'Seserahan', amount: 88000, status: 'Lunas' },
  { id: '5', date: '2026-09-16', name: 'Mukena', category: 'Seserahan', amount: 185000, status: 'Lunas' }
];

function getCategoryColor(category) {
  return CATEGORY_STYLES[category]?.color || '#64748B';
}

async function initBudgetPage() {
  await WP_Auth.syncUserData();
  WP_Layout.renderHeader();

  const eventType = WP_Utils.getEventType();
  const pageTitleEl = document.querySelector('.page-header-title h2');
  const pageDescEl = document.querySelector('.page-header-title p');
  if (pageTitleEl) {
    pageTitleEl.textContent = 'Budget';
  }
  if (pageDescEl) {
    pageDescEl.textContent = eventType === 'engagement'
      ? 'Budget Lamaran — Kelola anggaran, catat pengeluaran, dan kontrol alokasi dana untuk acara lamaran.'
      : 'Budget Pernikahan — Kelola anggaran, catat pengeluaran, dan kontrol alokasi dana persiapan pernikahan.';
  }

  await loadBudgetData();
  populateCategoryDropdown();
  renderBudgetStats();
  renderExpenseTable();
  renderCategoryBreakdown();
}

function populateCategoryDropdown() {
  const select = document.getElementById('exp-category');
  if (!select) return;
  const eventType = WP_Utils.getEventType();
  const categories = WP_Utils.BUDGET_CATEGORIES[eventType] || WP_Utils.BUDGET_CATEGORIES.wedding;
  select.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

/**
 * Load Budget Data from Supabase / Local Storage
 */
async function loadBudgetData() {
  const data = WP_Utils.initWeddingData();
  const eventType = WP_Utils.getEventType(data);
  totalBudgetAmount = WP_Utils.getTotalBudget(data, eventType);

  const client = WP_Supabase.getClient();
  const session = WP_Auth.getCurrentSession();

  if (WP_Supabase.isConfigured() && client && session?.eventId) {
    try {
      const { data: dbExpenses, error } = await client
        .from('budget_items')
        .select('*')
        .eq('event_id', session.eventId)
        .eq('event_type', eventType)
        .order('expense_date', { ascending: false });

      if (!error && dbExpenses) {
        expensesList = dbExpenses.map(item => ({
          id: item.id,
          date: item.expense_date || '2026-09-16',
          name: item.name,
          category: item.category || 'Lain-lain',
          amount: Number(item.actual_amount) || Number(item.planned_amount) || 0,
          status: item.payment_status || 'Lunas',
          vendor: item.vendor_name || '-'
        }));
        return;
      }
      WP_UI.showToast(`Pengeluaran tidak dapat dimuat dari server: ${error.message}. Menampilkan data di perangkat.`, 'error');
    } catch (err) {
      console.warn('Budget fetch error, using local fallback:', err);
    }
  }

  // Fallback Local Storage (dipisah per event_type)
  expensesList = loadLocalExpenses(data, eventType);
}

/**
 * Pengeluaran lokal per event_type. Data lama (versi sebelumnya disimpan di
 * wp_wedding_data.budget.expenses) otomatis dipakai sebagai data Wedding.
 */
function loadLocalExpenses(data, eventType) {
  const key = WP_Utils.getScopedStorageKey(WP_Utils.STORAGE_KEYS.EXPENSES, eventType);
  const saved = WP_Utils.getStorage(key);
  if (Array.isArray(saved)) return saved;

  let initial = [];
  if (eventType === 'wedding') {
    initial = (data.budget.expenses && data.budget.expenses.length > 0)
      ? data.budget.expenses
      : JSON.parse(JSON.stringify(DEFAULT_WEDDING_EXPENSES));
  }
  WP_Utils.setStorage(key, initial);
  return initial;
}

/**
 * Save Budget Data
 */
function saveBudgetData() {
  const data = WP_Utils.initWeddingData();
  WP_Utils.setTotalBudget(data, totalBudgetAmount);
  WP_Utils.setStorage(WP_Utils.STORAGE_KEYS.WEDDING_DATA, data);
  WP_Utils.setStorage(WP_Utils.getScopedStorageKey(WP_Utils.STORAGE_KEYS.EXPENSES), expensesList);
}

/**
 * Render 3 Top Summary Cards
 */
function renderBudgetStats() {
  const totalSpent = expensesList.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const remaining = Math.max(0, totalBudgetAmount - totalSpent);

  const totalBudgetEl = document.getElementById('stat-total-budget');
  const totalSpentEl = document.getElementById('stat-total-spent');
  const remainingBudgetEl = document.getElementById('stat-remaining-budget');

  if (totalBudgetEl) totalBudgetEl.textContent = WP_Utils.formatRupiah(totalBudgetAmount);
  if (totalSpentEl) totalSpentEl.textContent = WP_Utils.formatRupiah(totalSpent);
  if (remainingBudgetEl) remainingBudgetEl.textContent = WP_Utils.formatRupiah(remaining);
}

/**
 * Render Expense Table
 */
function renderExpenseTable() {
  const tbody = document.getElementById('expense-table-body');
  if (!tbody) return;

  if (expensesList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 32px;">
          Belum ada pengeluaran yang dicatat. Klik <strong>+ Tambah Pengeluaran</strong> untuk mulai mencatat.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = expensesList.map((item, index) => `
    <tr>
      <td class="expense-date">${escapeHtml(item.date)}</td>
      <td class="expense-name">${escapeHtml(item.name)}</td>
      <td>
        <span class="badge-category ${getCategoryBadgeClass(item.category)}">${escapeHtml(item.category)}</span>
      </td>
      <td class="expense-amount">${WP_Utils.formatRupiah(item.amount)}</td>
      <td>
        <button type="button" class="btn-table-action" onclick="deleteExpense('${item.id || index}')" title="Hapus Pengeluaran">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </td>
    </tr>
  `).join('');
}

function getCategoryBadgeClass(category) {
  return CATEGORY_STYLES[category]?.badge || 'badge-cat-default';
}

/**
 * Render Category Breakdown Donut Chart
 */
function renderCategoryBreakdown() {
  const totalSpent = expensesList.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  
  // Group by category
  const catTotals = {};
  expensesList.forEach(item => {
    const cat = item.category || 'Lain-lain';
    catTotals[cat] = (catTotals[cat] || 0) + (Number(item.amount) || 0);
  });

  const categories = Object.keys(catTotals).sort((a, b) => catTotals[b] - catTotals[a]);

  // Legend List
  const legendList = document.getElementById('category-legend-list');
  if (legendList) {
    if (categories.length === 0) {
      legendList.innerHTML = `<div style="color: var(--text-muted); font-size: 0.8rem;">Belum ada data pengeluaran.</div>`;
    } else {
      legendList.innerHTML = categories.map(cat => {
        const amount = catTotals[cat];
        const percent = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
        const color = getCategoryColor(cat);

        return `
          <div class="budget-legend-item">
            <div class="legend-label-group">
              <span class="legend-dot" style="background-color: ${color};"></span>
              <span class="legend-label">${escapeHtml(cat)}</span>
            </div>
            <div>
              <span class="legend-amount">${WP_Utils.formatRupiah(amount)}</span>
              <span class="legend-percent">(${percent}%)</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Multi-segment SVG Donut
  const svgContainer = document.getElementById('category-donut-svg');
  if (svgContainer) {
    const radius = 60;
    const circumference = 2 * Math.PI * radius; // ~376.99
    let accumulatedOffset = 0;

    if (totalSpent === 0 || categories.length === 0) {
      svgContainer.innerHTML = `
        <circle cx="80" cy="80" r="60" fill="none" stroke="#E2E8F0" stroke-width="14"></circle>
      `;
    } else {
      const segmentsHtml = categories.map(cat => {
        const amount = catTotals[cat];
        const percent = amount / totalSpent;
        const strokeLength = percent * circumference;
        const strokeDasharray = `${strokeLength} ${circumference - strokeLength}`;
        const strokeDashoffset = -accumulatedOffset;
        accumulatedOffset += strokeLength;

        const color = getCategoryColor(cat);

        return `
          <circle
            cx="80" cy="80" r="60"
            fill="none"
            stroke="${color}"
            stroke-width="14"
            stroke-dasharray="${strokeDasharray}"
            stroke-dashoffset="${strokeDashoffset}"
          ></circle>
        `;
      }).join('');

      svgContainer.innerHTML = segmentsHtml;
    }
  }

  // Update center info
  const centerAmount = document.getElementById('cat-donut-center-amount');
  const centerTotal = document.getElementById('cat-donut-center-total');
  if (centerAmount) centerAmount.textContent = WP_Utils.formatRupiah(totalSpent);
  if (centerTotal) centerTotal.textContent = `TOTAL TERPAKAI`;
}

/**
 * Modal Operations
 */
function openAddExpenseModal() {
  const modal = document.getElementById('modal-add-expense');
  const dateInput = document.getElementById('exp-date');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
  if (modal) modal.classList.add('open');
}

function closeAddExpenseModal() {
  const modal = document.getElementById('modal-add-expense');
  if (modal) modal.classList.remove('open');
}

function openEditBudgetModal() {
  const modal = document.getElementById('modal-edit-budget');
  const budgetInput = document.getElementById('edit-total-budget-input');
  if (budgetInput) {
    budgetInput.value = totalBudgetAmount;
  }
  if (modal) modal.classList.add('open');
}

function closeEditBudgetModal() {
  const modal = document.getElementById('modal-edit-budget');
  if (modal) modal.classList.remove('open');
}

/**
 * Save New Expense
 */
async function handleAddExpenseSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('exp-name').value;
  const category = document.getElementById('exp-category').value;
  const amount = Number(document.getElementById('exp-amount').value) || 0;
  const date = document.getElementById('exp-date').value || new Date().toISOString().split('T')[0];
  const status = document.getElementById('exp-status').value || 'Lunas';
  const vendor = document.getElementById('exp-vendor').value || '';

  const client = WP_Supabase.getClient();
  const session = WP_Auth.getCurrentSession();
  let newId = 'exp-' + Date.now();

  if (WP_Supabase.isConfigured() && client && session?.eventId) {
    try {
      const { data, error } = await client
        .from('budget_items')
        .insert({
          event_id: session.eventId,
          event_type: WP_Utils.getEventType(),
          name: name,
          category: category,
          actual_amount: amount,
          planned_amount: amount,
          payment_status: status,
          expense_date: date,
          vendor_name: vendor
        })
        .select()
        .single();

      if (error || !data) {
        WP_UI.showToast(`Pengeluaran tidak tersimpan: ${error?.message || 'respons tidak valid'}`, 'error');
        return;
      }
      newId = data.id;
    } catch (err) {
      console.warn('Supabase insert note:', err);
    }
  }

  const newExpense = {
    id: newId,
    date,
    name,
    category,
    amount,
    status,
    vendor
  };

  expensesList.unshift(newExpense);
  saveBudgetData();

  renderBudgetStats();
  renderExpenseTable();
  renderCategoryBreakdown();

  closeAddExpenseModal();
  WP_UI.showToast(`Pengeluaran "${name}" berhasil ditambahkan!`, 'success');
  e.target.reset();
}

/**
 * Save Updated Total Budget
 */
async function handleEditBudgetSubmit(e) {
  e.preventDefault();
  const eventType = WP_Utils.getEventType();
  const newBudget = Number(document.getElementById('edit-total-budget-input').value) || WP_Utils.DEFAULT_TOTAL_BUDGET[eventType];

  const client = WP_Supabase.getClient();
  const session = WP_Auth.getCurrentSession();

  if (WP_Supabase.isConfigured() && client && session?.eventId) {
    try {
      const { error } = await client
        .from('wedding_events')
        .update({ [WP_Utils.getTotalBudgetField(eventType).column]: newBudget })
        .eq('id', session.eventId);
      if (error) {
        WP_UI.showToast(`Budget tidak tersimpan: ${error.message}`, 'error');
        return;
      }
    } catch (err) {
      console.warn('Supabase budget update note:', err);
    }
  }

  // Ubah nilai di memori hanya setelah server menerima (atau mode lokal)
  totalBudgetAmount = newBudget;
  saveBudgetData();
  renderBudgetStats();
  closeEditBudgetModal();
  WP_UI.showToast('Total budget berhasil diperbarui!', 'success');
}

/**
 * Delete Expense
 */
async function deleteExpense(itemId) {
  if (!confirm('Apakah Anda yakin ingin menghapus pengeluaran ini?')) return;

  const client = WP_Supabase.getClient();
  const session = WP_Auth.getCurrentSession();
  if (WP_Supabase.isConfigured() && client && session?.eventId) {
    try {
      const { error } = await client
        .from('budget_items')
        .delete()
        .eq('id', itemId);
      if (error) {
        WP_UI.showToast(`Pengeluaran tidak dapat dihapus: ${error.message}`, 'error');
        return;
      }
    } catch (err) {
      console.warn('Supabase delete error note:', err);
    }
  }

  expensesList = expensesList.filter((item, index) => item.id !== itemId && String(index) !== itemId);
  saveBudgetData();

  renderBudgetStats();
  renderExpenseTable();
  renderCategoryBreakdown();

  WP_UI.showToast('Pengeluaran berhasil dihapus.', 'info');
}

window.WP_Budget = {
  initBudgetPage,
  openAddExpenseModal,
  closeAddExpenseModal,
  openEditBudgetModal,
  closeEditBudgetModal,
  handleAddExpenseSubmit,
  handleEditBudgetSubmit,
  deleteExpense
};
