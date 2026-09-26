/**
 * Tamu & Hadiah — Full CRUD dengan Supabase + LocalStorage fallback
 * Fitur: Tambah, Edit, Hapus tamu, RSVP status, nominal hadiah, filter, search
 */

const WP_ESC = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

let guestList = [];
let editGuestId = null;
let activeRsvpFilter = 'all';
let searchQuery = '';

// ─── Init ────────────────────────────────────────────────────────────────────
async function initGuests() {
  await WP_Auth.syncUserData();
  WP_Layout.renderHeader();

  const eventType = WP_Utils.getEventType();
  const pageTitleEl = document.querySelector('main.main-content h2');
  const pageDescEl = document.querySelector('main.main-content p');
  if (pageTitleEl) {
    pageTitleEl.textContent = 'Tamu & Hadiah 🎟️';
  }
  if (pageDescEl) {
    pageDescEl.textContent = eventType === 'engagement'
      ? 'Undangan Acara Lamaran — Kelola undangan keluarga inti, RSVP, dan hadiah acara lamaran dalam satu tempat.'
      : 'Undangan Pernikahan — Kelola undangan, RSVP, dan hadiah dari tamu dalam satu tempat.';
  }

  await loadGuests();
  renderAll();
}

// ─── Load ─────────────────────────────────────────────────────────────────────
async function loadGuests() {
  const client = WP_Supabase.getClient();
  const session = WP_Auth.getCurrentSession();

  if (WP_Supabase.isConfigured() && client && session?.eventId) {
    const { data, error } = await client
      .from('guests')
      .select('*')
      .eq('event_id', session.eventId)
      .eq('event_type', WP_Utils.getEventType())
      .order('created_at', { ascending: false });
    if (error) {
      WP_UI.showToast('Gagal memuat data tamu: ' + error.message, 'error');
    } else {
      guestList = data || [];
      return;
    }
  }
  guestList = WP_Utils.getStorage(getLocalGuestsKey()) || [];
}

// ─── Save (local) ─────────────────────────────────────────────────────────────
function getLocalGuestsKey() {
  return WP_Utils.getScopedStorageKey(WP_Utils.STORAGE_KEYS.GUESTS);
}

function saveLocal() {
  WP_Utils.setStorage(getLocalGuestsKey(), guestList);
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function renderStats() {
  const total = guestList.length;
  const hadir = guestList.filter(g => g.rsvp_status === 'hadir').length;
  const belum = guestList.filter(g => g.rsvp_status === 'pending').length;
  const gifts = guestList.reduce((s, g) => s + (Number(g.gift_amount) || 0), 0);

  setEl('stat-total-tamu', total);
  setEl('stat-hadir', hadir);
  setEl('stat-belum-konfirmasi', belum);
  setEl('stat-total-hadiah', WP_Utils.formatRupiah(gifts));
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ─── Filter + Render ──────────────────────────────────────────────────────────
function renderAll() {
  renderStats();
  renderGuestTable();
}

function onFilterChange(val) {
  activeRsvpFilter = val;
  renderGuestTable();
}

function onSearchInput(val) {
  searchQuery = val.toLowerCase();
  renderGuestTable();
}

function getFilteredGuests() {
  return guestList.filter(g => {
    const matchFilter = activeRsvpFilter === 'all' || g.rsvp_status === activeRsvpFilter;
    const matchSearch = !searchQuery ||
      g.name?.toLowerCase().includes(searchQuery) ||
      g.relation?.toLowerCase().includes(searchQuery);
    return matchFilter && matchSearch;
  });
}

function rsvpBadge(status) {
  const map = {
    hadir:       { label: 'Hadir',          cls: 'badge-green' },
    tidak_hadir: { label: 'Tidak Hadir',     cls: 'badge-red'   },
    pending:     { label: 'Belum Konfirmasi', cls: 'badge-gray'  }
  };
  const d = map[status] || map.pending;
  return `<span class="badge ${d.cls}">${d.label}</span>`;
}

function renderGuestTable() {
  const filtered = getFilteredGuests();
  const tbody = document.getElementById('guest-table-body');
  if (!tbody) return;

  if (filtered.length === 0) {
    const msg = guestList.length === 0
      ? 'Belum ada tamu. Klik <strong>+ Tambah Tamu</strong> untuk mulai.'
      : 'Tidak ada tamu yang cocok dengan filter/pencarian.';
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:32px; color:var(--text-muted);">${msg}</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(g => `
    <tr>
      <td class="guest-name-cell">
        <div style="font-weight:600; color:var(--text-heading);">${WP_ESC(g.name)}</div>
        <div style="font-size:var(--font-size-xs); color:var(--text-muted);">${WP_ESC(g.relation || '—')}</div>
      </td>
      <td class="guest-invite-cell">${WP_ESC(g.invitation_type === 'fisik' ? '📄 Fisik' : '📱 Digital')}</td>
      <td class="guest-rsvp-cell">${rsvpBadge(g.rsvp_status)}</td>
      <td class="guest-gift-cell" style="font-weight:600;">${g.gift_amount ? WP_Utils.formatRupiah(g.gift_amount) : '<span style="color:var(--text-light);font-style:italic;">—</span>'}</td>
      <td class="guest-notes-cell ${g.notes ? '' : 'is-empty'}" style="color:var(--text-muted); font-size:var(--font-size-xs);">${WP_ESC(g.notes || '—')}</td>
      <td class="guest-actions-cell">
        <div style="display:flex; gap:6px;">
          <button class="btn-table-action" title="Edit" onclick="WP_Guests.openEditModal('${g.id}')">✏️</button>
          <button class="btn-table-action" title="Hapus" onclick="WP_Guests.removeGuest('${g.id}')">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function openAddModal() {
  editGuestId = null;
  document.getElementById('guest-modal-title').textContent = 'Tambah Tamu';
  document.getElementById('btn-delete-guest').style.display = 'none';
  clearGuestForm();
  document.getElementById('guest-modal').classList.add('open');
}

function openEditModal(id) {
  const guest = guestList.find(g => String(g.id) === String(id));
  if (!guest) return;
  editGuestId = id;
  document.getElementById('guest-modal-title').textContent = 'Edit Tamu';
  document.getElementById('btn-delete-guest').style.display = 'inline-flex';
  document.getElementById('guest-name').value = guest.name || '';
  document.getElementById('guest-relation').value = guest.relation || '';
  document.getElementById('guest-invitation').value = guest.invitation_type || 'digital';
  document.getElementById('guest-rsvp').value = guest.rsvp_status || 'pending';
  document.getElementById('guest-gift').value = guest.gift_amount || '';
  document.getElementById('guest-notes').value = guest.notes || '';
  document.getElementById('guest-modal').classList.add('open');
}

function closeModal() {
  document.getElementById('guest-modal').classList.remove('open');
  editGuestId = null;
}

function clearGuestForm() {
  ['guest-name', 'guest-relation', 'guest-gift', 'guest-notes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const rel = document.getElementById('guest-relation');
  if (rel) rel.value = 'Keluarga';
  document.getElementById('guest-invitation').value = 'digital';
  document.getElementById('guest-rsvp').value = 'pending';
}

// ─── Save Guest ───────────────────────────────────────────────────────────────
async function saveGuest(e) {
  e.preventDefault();

  const payload = {
    name:            document.getElementById('guest-name').value.trim(),
    relation:        document.getElementById('guest-relation').value.trim() || 'Keluarga',
    invitation_type: document.getElementById('guest-invitation').value,
    rsvp_status:     document.getElementById('guest-rsvp').value,
    gift_amount:     Number(document.getElementById('guest-gift').value) || 0,
    notes:           document.getElementById('guest-notes').value.trim()
  };

  const client = WP_Supabase.getClient();
  const session = WP_Auth.getCurrentSession();
  const useSupabase = WP_Supabase.isConfigured() && client && session?.eventId;

  try {
    if (editGuestId) {
      // UPDATE
      if (useSupabase) {
        const { error } = await client.from('guests')
          .update(payload)
          .eq('id', editGuestId);
        if (error) throw error;
      }
      guestList = guestList.map(g =>
        String(g.id) === String(editGuestId) ? { ...g, ...payload } : g
      );
      if (!useSupabase) saveLocal();
      WP_UI.showToast(`"${payload.name}" berhasil diperbarui.`, 'success');
    } else {
      // INSERT
      let newGuest;
      if (useSupabase) {
        const { data, error } = await client.from('guests')
          .insert({ ...payload, event_id: session.eventId, event_type: WP_Utils.getEventType() })
          .select()
          .single();
        if (error) throw error;
        newGuest = data;
      } else {
        newGuest = { id: 'guest-' + Date.now(), ...payload };
        guestList.unshift(newGuest);
        saveLocal();
      }
      if (useSupabase) guestList.unshift(newGuest);
      WP_UI.showToast(`"${payload.name}" berhasil ditambahkan!`, 'success');
    }

    closeModal();
    renderAll();
  } catch (err) {
    WP_UI.showToast('Gagal menyimpan: ' + err.message, 'error');
  }
}

// ─── Delete Guest ─────────────────────────────────────────────────────────────
async function removeGuest(id) {
  if (!confirm('Hapus tamu ini dari daftar?')) return;
  const client = WP_Supabase.getClient();
  const session = WP_Auth.getCurrentSession();
  const useSupabase = WP_Supabase.isConfigured() && client && session?.eventId;

  try {
    if (useSupabase) {
      const { error } = await client.from('guests').delete().eq('id', id);
      if (error) throw error;
    }
    guestList = guestList.filter(g => String(g.id) !== String(id));
    if (!useSupabase) saveLocal();
    WP_UI.showToast('Tamu berhasil dihapus.', 'info');
    closeModal();
    renderAll();
  } catch (err) {
    WP_UI.showToast('Gagal menghapus: ' + err.message, 'error');
  }
}

function deleteFromModal() {
  if (editGuestId) removeGuest(editGuestId);
}

window.WP_Guests = {
  initGuests,
  openAddModal,
  openEditModal,
  closeModal,
  saveGuest,
  removeGuest,
  deleteFromModal,
  onFilterChange,
  onSearchInput
};
