/**
 * Data Tabungan (CPP & CPW) — dipakai halaman Tabungan dan Budget.
 * Mode Cloud: tabel savings_entries (satu baris per catatan, dipisah per event_type).
 * Mode Lokal/Demo: localStorage dengan key per event_type.
 */

const CONTRIBUTORS = ['cpp', 'cpw'];

function getSavingsContext() {
  const client = WP_Supabase.getClient();
  const session = WP_Auth.getCurrentSession();
  const useCloud = Boolean(WP_Supabase.isConfigured() && client && session?.eventId);
  return { client, session, useCloud, eventType: WP_Utils.getEventType() };
}

function getLocalSavingsKey(eventType) {
  return WP_Utils.getScopedStorageKey(WP_Utils.STORAGE_KEYS.SAVINGS, eventType);
}

function fromRow(row) {
  return {
    id: row.id,
    contributor: row.contributor,
    amount: Number(row.amount) || 0,
    date: row.saved_at,
    note: row.note || ''
  };
}

/** Pesan yang lebih jelas bila tabel belum dibuat (migrasi 006 belum dijalankan) */
function describeError(error) {
  const msg = error?.message || String(error);
  if (/savings_entries/.test(msg) && /(does not exist|Could not find)/i.test(msg)) {
    return 'Tabel tabungan belum ada di database. Jalankan migrasi sql/006_add_savings.sql di Supabase.';
  }
  return msg;
}

/** Terbaru di atas: tanggal menurun, lalu yang dicatat terakhir */
function sortEntries(entries) {
  return entries.sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.id).localeCompare(String(a.id)));
}

async function loadEntries() {
  const { client, session, useCloud, eventType } = getSavingsContext();
  if (useCloud) {
    const { data, error } = await client
      .from('savings_entries')
      .select('*')
      .eq('event_id', session.eventId)
      .eq('event_type', eventType)
      .order('saved_at', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) return { entries: [], error: describeError(error) };
    return { entries: data.map(fromRow) };
  }
  return { entries: sortEntries(WP_Utils.getStorage(getLocalSavingsKey(eventType)) || []) };
}

function validateEntry(entry) {
  if (!CONTRIBUTORS.includes(entry.contributor)) throw new Error('Penabung tidak valid.');
  if (!(Number(entry.amount) > 0)) throw new Error('Nominal harus lebih dari 0.');
  if (!entry.date) throw new Error('Tanggal wajib diisi.');
}

async function addEntry(entry) {
  validateEntry(entry);
  const { client, session, useCloud, eventType } = getSavingsContext();
  if (useCloud) {
    const { data, error } = await client
      .from('savings_entries')
      .insert({
        event_id: session.eventId,
        event_type: eventType,
        contributor: entry.contributor,
        amount: Number(entry.amount),
        saved_at: entry.date,
        note: entry.note || null
      })
      .select()
      .single();
    if (error) throw new Error(describeError(error));
    return fromRow(data);
  }
  const key = getLocalSavingsKey(eventType);
  const list = WP_Utils.getStorage(key) || [];
  const created = { id: `sav-${Date.now()}`, ...entry, amount: Number(entry.amount) };
  list.push(created);
  WP_Utils.setStorage(key, list);
  return created;
}

async function updateEntry(id, entry) {
  validateEntry(entry);
  const { client, useCloud, eventType } = getSavingsContext();
  if (useCloud) {
    const { data, error } = await client
      .from('savings_entries')
      .update({
        contributor: entry.contributor,
        amount: Number(entry.amount),
        saved_at: entry.date,
        note: entry.note || null
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(describeError(error));
    return fromRow(data);
  }
  const key = getLocalSavingsKey(eventType);
  const list = WP_Utils.getStorage(key) || [];
  const index = list.findIndex(e => e.id === id);
  if (index === -1) throw new Error('Catatan tabungan tidak ditemukan.');
  list[index] = { ...list[index], ...entry, amount: Number(entry.amount) };
  WP_Utils.setStorage(key, list);
  return list[index];
}

async function deleteEntry(id) {
  const { client, useCloud, eventType } = getSavingsContext();
  if (useCloud) {
    const { error } = await client.from('savings_entries').delete().eq('id', id);
    if (error) throw new Error(describeError(error));
    return;
  }
  const key = getLocalSavingsKey(eventType);
  WP_Utils.setStorage(key, (WP_Utils.getStorage(key) || []).filter(e => e.id !== id));
}

function summarize(entries) {
  const totals = { cpp: 0, cpw: 0 };
  entries.forEach(e => { if (e.contributor in totals) totals[e.contributor] += Number(e.amount) || 0; });
  return { cpp: totals.cpp, cpw: totals.cpw, total: totals.cpp + totals.cpw, count: entries.length };
}

/**
 * Integrasi dengan Budget: dana yang sudah keluar dihitung dari pengeluaran
 * berstatus Lunas / DP (yang "Belum bayar" belum mengurangi tabungan).
 */
function isPaidExpense(expense) {
  return (expense.status || 'Lunas') !== 'Belum bayar';
}

function computeFunding({ savingsTotal, totalBudget, expenses }) {
  const paid = expenses.filter(isPaidExpense).reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const unpaid = expenses.filter(e => !isPaidExpense(e)).reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  return {
    savingsTotal,
    totalBudget,
    paid,
    unpaid,
    available: savingsTotal - paid,                     // bisa minus bila pengeluaran melebihi tabungan
    shortfall: Math.max(0, totalBudget - savingsTotal), // kekurangan untuk mencapai target
    progress: totalBudget > 0 ? Math.min(100, Math.round((savingsTotal / totalBudget) * 100)) : 0
  };
}

/** Pengeluaran event aktif untuk halaman selain Budget (Cloud atau lokal) */
async function loadExpensesForFunding() {
  const { client, session, useCloud, eventType } = getSavingsContext();
  if (useCloud) {
    const { data, error } = await client
      .from('budget_items')
      .select('actual_amount, planned_amount, payment_status')
      .eq('event_id', session.eventId)
      .eq('event_type', eventType);
    if (!error && data) {
      return data.map(e => ({
        amount: Number(e.actual_amount) || Number(e.planned_amount) || 0,
        status: e.payment_status
      }));
    }
  }
  const saved = WP_Utils.getStorage(WP_Utils.getScopedStorageKey(WP_Utils.STORAGE_KEYS.EXPENSES, eventType));
  if (Array.isArray(saved)) return saved;
  // Contoh pengeluaran bawaan hanya untuk Wedding (sama seperti Dashboard)
  return eventType === 'wedding' ? (WP_Utils.initWeddingData().budget.expenses || []) : [];
}

window.WP_Savings = {
  loadEntries,
  addEntry,
  updateEntry,
  deleteEntry,
  summarize,
  computeFunding,
  loadExpensesForFunding
};
