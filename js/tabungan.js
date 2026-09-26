/**
 * Tabungan — catatan uang terkumpul dari CPP & CPW (bebas harian/mingguan/bulanan),
 * terintegrasi dengan Budget: target = Total Budget, terpakai = pengeluaran Lunas/DP.
 */

const MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

let savingsEntries = [];
let fundingExpenses = [];
let savingsTotalBudget = 0;
let savingsFilter = 'all';

function escapeSavings(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

function getCoupleNames() {
  const couple = WP_Utils.initWeddingData().couple;
  return { cpp: couple.groom || 'CPP', cpw: couple.bride || 'CPW' };
}

function contributorLabel(contributor) {
  const names = getCoupleNames();
  return contributor === 'cpp' ? `CPP — ${names.cpp}` : `CPW — ${names.cpw}`;
}

// ─── Init ─────────────────────────────────────────────────────────────────────
async function initTabungan() {
  const data = await WP_Auth.syncUserData();
  WP_Layout.renderHeader();

  const eventType = WP_Utils.getEventType(data);
  const pageTitleEl = document.querySelector('.page-header-title h2');
  const pageDescEl = document.querySelector('.page-header-title p');
  if (pageTitleEl) pageTitleEl.textContent = eventType === 'engagement' ? 'Tabungan Lamaran 🐷' : 'Tabungan 🐷';
  if (pageDescEl) {
    pageDescEl.textContent = eventType === 'engagement'
      ? 'Catat uang yang terkumpul dari CPP & CPW untuk acara lamaran — kapan saja, harian, mingguan, atau bulanan.'
      : 'Catat uang yang terkumpul dari CPP & CPW untuk pernikahan — kapan saja, harian, mingguan, atau bulanan.';
  }

  const names = getCoupleNames();
  setText('sav-label-cpp', `Tabungan CPP (${names.cpp})`);
  setText('sav-label-cpw', `Tabungan CPW (${names.cpw})`);
  const filterSelect = document.getElementById('sav-filter');
  if (filterSelect) {
    filterSelect.options[1].textContent = `CPP — ${names.cpp}`;
    filterSelect.options[2].textContent = `CPW — ${names.cpw}`;
  }

  savingsTotalBudget = WP_Utils.getTotalBudget(data, eventType);
  await loadData();
  renderAll();
}

async function loadData() {
  const [savingsResult, expenses] = await Promise.all([
    WP_Savings.loadEntries(),
    WP_Savings.loadExpensesForFunding()
  ]);
  if (savingsResult.error) WP_UI.showToast(`Tabungan belum dapat dimuat: ${savingsResult.error}`, 'error');
  savingsEntries = savingsResult.entries;
  fundingExpenses = expenses;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ─── Render ───────────────────────────────────────────────────────────────────
function renderAll() {
  const summary = WP_Savings.summarize(savingsEntries);
  const funding = WP_Savings.computeFunding({
    savingsTotal: summary.total,
    totalBudget: savingsTotalBudget,
    expenses: fundingExpenses
  });
  renderStats(summary, funding);
  renderFunding(summary, funding);
  renderHistory();
}

function renderStats(summary, funding) {
  const fmt = WP_Utils.formatRupiah;
  const countOf = c => savingsEntries.filter(e => e.contributor === c).length;

  setText('sav-cpp-amount', fmt(summary.cpp));
  setText('sav-cpp-count', `${countOf('cpp')} kali menabung`);
  setText('sav-cpw-amount', fmt(summary.cpw));
  setText('sav-cpw-count', `${countOf('cpw')} kali menabung`);
  setText('sav-total-amount', fmt(summary.total));
  setText('sav-total-desc', `${funding.progress}% dari Total Budget`);

  const availableEl = document.getElementById('sav-available-amount');
  if (availableEl) {
    availableEl.textContent = fmt(funding.available);
    availableEl.classList.toggle('negative', funding.available < 0);
  }
  setText('sav-available-desc', funding.available < 0
    ? `Pengeluaran melebihi tabungan ${fmt(Math.abs(funding.available))}`
    : 'Tabungan dikurangi pengeluaran yang sudah dibayar');
}

function renderFunding(summary, funding) {
  const fmt = WP_Utils.formatRupiah;

  const bar = document.getElementById('sav-progress-bar');
  if (bar) bar.style.width = `${funding.progress}%`;
  setText('sav-progress-label', `${fmt(summary.total)} dari ${fmt(funding.totalBudget)} (${funding.progress}%)`);
  setText('sav-progress-hint', funding.shortfall > 0
    ? `Kurang ${fmt(funding.shortfall)} lagi untuk mencapai Total Budget.`
    : 'Target tercapai! Tabungan sudah menutup seluruh Total Budget 🎉');

  // Kontribusi CPP vs CPW
  const cppPct = summary.total > 0 ? Math.round((summary.cpp / summary.total) * 100) : 50;
  const splitCpp = document.getElementById('sav-split-cpp');
  const splitCpw = document.getElementById('sav-split-cpw');
  if (splitCpp) splitCpp.style.width = `${summary.total > 0 ? cppPct : 50}%`;
  if (splitCpw) splitCpw.style.width = `${summary.total > 0 ? 100 - cppPct : 50}%`;
  const names = getCoupleNames();
  setText('sav-split-cpp-label', `${names.cpp} ${summary.total > 0 ? cppPct : 0}%`);
  setText('sav-split-cpw-label', `${names.cpw} ${summary.total > 0 ? 100 - cppPct : 0}%`);

  setText('sav-fund-budget', fmt(funding.totalBudget));
  setText('sav-fund-paid', fmt(funding.paid));
  setText('sav-fund-unpaid', fmt(funding.unpaid));
  setText('sav-fund-shortfall', fmt(funding.shortfall));
}

function monthKey(date) {
  return String(date || '').slice(0, 7); // YYYY-MM
}

function monthLabel(key) {
  const [year, month] = key.split('-').map(Number);
  return month ? `${MONTH_NAMES[month - 1]} ${year}` : 'Tanpa tanggal';
}

function renderHistory() {
  const container = document.getElementById('sav-history');
  if (!container) return;

  const filtered = savingsFilter === 'all'
    ? savingsEntries
    : savingsEntries.filter(e => e.contributor === savingsFilter);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="sav-empty">
        ${savingsEntries.length === 0
          ? 'Belum ada catatan tabungan. Klik <strong>+ Catat Tabungan</strong> untuk mulai mencatat.'
          : 'Tidak ada catatan untuk penabung ini.'}
      </div>`;
    return;
  }

  // Kelompokkan per bulan (data sudah terurut terbaru di atas)
  const groups = [];
  filtered.forEach(entry => {
    const key = monthKey(entry.date);
    let group = groups[groups.length - 1];
    if (!group || group.key !== key) {
      group = { key, entries: [] };
      groups.push(group);
    }
    group.entries.push(entry);
  });

  const fmt = WP_Utils.formatRupiah;
  container.innerHTML = groups.map(group => {
    const subtotal = group.entries.reduce((sum, e) => sum + e.amount, 0);
    const rows = group.entries.map(entry => `
      <div class="sav-row">
        <div class="sav-row-date">${escapeSavings(WP_Utils.formatShortDate(WP_Utils.parseLocalDate(entry.date)))}</div>
        <div class="sav-row-main">
          <span class="sav-badge ${entry.contributor}">${escapeSavings(contributorLabel(entry.contributor))}</span>
          ${entry.note ? `<span class="sav-row-note">${escapeSavings(entry.note)}</span>` : ''}
        </div>
        <div class="sav-row-amount">+ ${fmt(entry.amount)}</div>
        <div class="row-actions">
          <button type="button" class="btn-icon-action" title="Edit catatan" onclick="WP_Tabungan.openEditModal('${escapeSavings(entry.id)}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </button>
          <button type="button" class="btn-icon-action danger" title="Hapus catatan" onclick="WP_Tabungan.confirmDeleteEntry('${escapeSavings(entry.id)}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `).join('');

    return `
      <div class="sav-month-group">
        <div class="sav-month-header">
          <span>${escapeSavings(monthLabel(group.key))}</span>
          <span class="sav-month-total">${group.entries.length} catatan • ${fmt(subtotal)}</span>
        </div>
        ${rows}
      </div>
    `;
  }).join('');
}

function onFilterChange(value) {
  savingsFilter = value;
  renderHistory();
}

// ─── Tambah / Edit / Hapus ────────────────────────────────────────────────────
function entryFields(entry = {}) {
  return [
    { name: 'contributor', label: 'Penabung', type: 'select', value: entry.contributor || 'cpp',
      options: [
        { value: 'cpp', label: contributorLabel('cpp') },
        { value: 'cpw', label: contributorLabel('cpw') }
      ] },
    { name: 'amount', label: 'Nominal (Rp)', type: 'number', value: entry.amount, required: true, placeholder: 'Contoh: 500000' },
    { name: 'date', label: 'Tanggal menabung', type: 'date', value: entry.date || WP_Utils.todayLocalDate(), required: true },
    { name: 'note', label: 'Catatan', type: 'text', value: entry.note, placeholder: 'Opsional, contoh: Gaji September, bonus, sisa THR' }
  ];
}

function toEntry(values) {
  if (!(Number(values.amount) > 0)) throw new Error('Nominal harus lebih dari 0.');
  return {
    contributor: values.contributor,
    amount: Number(values.amount),
    date: values.date,
    note: values.note
  };
}

function sortSavings() {
  savingsEntries.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

function openAddModal(contributor) {
  WP_UI.openFormModal({
    title: 'Catat Tabungan',
    submitLabel: 'Simpan',
    fields: entryFields({ contributor }),
    onSubmit: async values => {
      const created = await WP_Savings.addEntry(toEntry(values));
      savingsEntries.unshift(created);
      sortSavings();
      renderAll();
      WP_UI.showToast(`Tabungan ${WP_Utils.formatRupiah(created.amount)} dari ${contributorLabel(created.contributor)} tercatat.`, 'success');
    }
  });
}

function openEditModal(id) {
  const entry = savingsEntries.find(e => String(e.id) === String(id));
  if (!entry) return;
  WP_UI.openFormModal({
    title: 'Edit Catatan Tabungan',
    fields: entryFields(entry),
    onSubmit: async values => {
      const updated = await WP_Savings.updateEntry(entry.id, toEntry(values));
      Object.assign(entry, updated);
      sortSavings();
      renderAll();
      WP_UI.showToast('Catatan tabungan diperbarui.', 'success');
    },
    onDelete: () => removeEntry(entry),
    deleteConfirm: `Hapus catatan tabungan ${WP_Utils.formatRupiah(entry.amount)} (${contributorLabel(entry.contributor)})?`
  });
}

async function confirmDeleteEntry(id) {
  const entry = savingsEntries.find(e => String(e.id) === String(id));
  if (!entry) return;
  if (!confirm(`Hapus catatan tabungan ${WP_Utils.formatRupiah(entry.amount)} (${contributorLabel(entry.contributor)})?`)) return;
  try {
    await removeEntry(entry);
  } catch (err) {
    WP_UI.showToast('Gagal menghapus: ' + err.message, 'error');
  }
}

async function removeEntry(entry) {
  await WP_Savings.deleteEntry(entry.id);
  savingsEntries = savingsEntries.filter(e => e !== entry);
  renderAll();
  WP_UI.showToast('Catatan tabungan dihapus.', 'info');
}

window.WP_Tabungan = {
  initTabungan,
  onFilterChange,
  openAddModal,
  openEditModal,
  confirmDeleteEntry
};
