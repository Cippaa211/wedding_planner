/**
 * Akad & Resepsi — Checklist Operasional Hari-H + Rundown Acara
 * Fitur: Checklist per sesi (Pra-Akad, Akad, Resepsi, Pasca), Tambah/Hapus tugas,
 *        Edit tugas, PIC, waktu, sinkronisasi Supabase (event_settings) + LocalStorage fallback
 */

// Key otomatis diberi prefix engagement_ oleh WP_DataStore bila event_type = engagement
const EVENT_KEY = 'wp_event_tasks';

const DEFAULT_TASKS = [
  // Pra-Akad
  { id: 'pre-1', session: 'pra',     title: 'Konfirmasi venue, listrik, dan parkir',             pic: 'Panitia',   time: '06:00', done: false },
  { id: 'pre-2', session: 'pra',     title: 'Pastikan semua dekorasi sudah terpasang',            pic: 'Dekorator', time: '06:30', done: false },
  { id: 'pre-3', session: 'pra',     title: 'Cek sound system dan pencahayaan',                  pic: 'Sound',     time: '07:00', done: false },
  { id: 'pre-4', session: 'pra',     title: 'Rias dan busana CPW sudah siap',                    pic: 'MUA',       time: '07:30', done: false },
  { id: 'pre-5', session: 'pra',     title: 'Dokumen nikah siap di tangan penghulu',             pic: 'CPP',       time: '08:00', done: false },
  // Akad
  { id: 'akad-1', session: 'akad',   title: 'Penghulu tiba dan brifing',                        pic: 'WO',        time: '08:30', done: false },
  { id: 'akad-2', session: 'akad',   title: 'Prosesi ijab kabul',                               pic: 'Keluarga',  time: '09:00', done: false },
  { id: 'akad-3', session: 'akad',   title: 'Sesi foto akad resmi',                             pic: 'WCC',       time: '09:30', done: false },
  { id: 'akad-4', session: 'akad',   title: 'Penyerahan mahar dan seserahan',                   pic: 'Panitia',   time: '09:45', done: false },
  // Resepsi
  { id: 'res-1',  session: 'resepsi','title': 'Tamu mulai memasuki area resepsi',                pic: 'MC',        time: '10:30', done: false },
  { id: 'res-2',  session: 'resepsi','title': 'Pengantin memasuki pelaminan',                    pic: 'WO',        time: '11:00', done: false },
  { id: 'res-3',  session: 'resepsi','title': 'Sambutan keluarga',                               pic: 'Keluarga',  time: '11:15', done: false },
  { id: 'res-4',  session: 'resepsi','title': 'Sesi foto bersama tamu VIP',                     pic: 'WCC',       time: '11:30', done: false },
  { id: 'res-5',  session: 'resepsi','title': 'Makan siang dan hiburan',                        pic: 'Catering',  time: '12:00', done: false },
  // Pasca
  { id: 'post-1', session: 'pasca',  title: 'Pemberesan dekorasi dan barang',                   pic: 'Panitia',   time: '14:00', done: false },
  { id: 'post-2', session: 'pasca',  title: 'Pengembalian peralatan sewa',                      pic: 'Panitia',   time: '15:00', done: false },
  { id: 'post-3', session: 'pasca',  title: 'Dokumentasi foto selesai diterima',                pic: 'WCC',       time: '16:00', done: false },
];

const DEFAULT_ENGAGEMENT_TASKS = [
  // Pra-Acara
  { id: 'pre-1', session: 'pra', title: 'Pembersihan & penataan area penyambutan', pic: 'Panitia Keluarga', time: '08:00', done: false },
  { id: 'pre-2', session: 'pra', title: 'Pemasangan Backdrop & Dekorasi Foto Lamaran', pic: 'Dekorator', time: '08:30', done: false },
  { id: 'pre-3', session: 'pra', title: 'Rias & Fitting Kebaya CPW', pic: 'MUA', time: '09:00', done: false },
  // Acara Lamaran
  { id: 'akad-1', session: 'akad', title: 'Penyambutan Rombongan Keluarga Pria', pic: 'Penerima Tamu', time: '10:00', done: false },
  { id: 'akad-2', session: 'akad', title: 'Penyerahan Hantaran Awal dari Pria', pic: 'Keluarga Pria', time: '10:15', done: false },
  { id: 'akad-3', session: 'akad', title: 'Sambutan & Pengutarakan Niat oleh Utusan Pria', pic: 'Juru Bicara Pria', time: '10:30', done: false },
  { id: 'akad-4', session: 'akad', title: 'Jawaban & Penerimaan oleh Utusan Wanita', pic: 'Juru Bicara Wanita', time: '10:45', done: false },
  { id: 'akad-5', session: 'akad', title: 'Prosesi Tukar Cincin Lamaran', pic: 'Pasangan & Ibu', time: '11:00', done: false },
  { id: 'akad-6', session: 'akad', title: 'Penyerahan Hantaran Balasan dari Wanita', pic: 'Keluarga Wanita', time: '11:15', done: false },
  // Ramah Tamah
  { id: 'res-1', session: 'resepsi', title: 'Doa Bersama & Ucapan Selamat', pic: 'Pembaca Doa', time: '11:30', done: false },
  { id: 'res-2', session: 'resepsi', title: 'Santap Siang Prasmanan Bersama Keluarga', pic: 'Catering', time: '11:45', done: false },
  { id: 'res-3', session: 'resepsi', title: 'Sesi Foto Bersama Keluarga Besar', pic: 'Fotografer', time: '12:30', done: false },
  // Pasca
  { id: 'post-1', session: 'pasca', title: 'Pemberesan nampan hantaran & souvenir', pic: 'Panitia Keluarga', time: '13:30', done: false },
  { id: 'post-2', session: 'pasca', title: 'Pengembalian peralatan sewa & foto keluarga', pic: 'Panitia Keluarga', time: '14:00', done: false }
];

const SESSIONS = [
  { id: 'pra', label: '🌅 Pra-Akad', color: '#7C3AED' },
  { id: 'akad', label: '💍 Akad Nikah', color: '#2563EB' },
  { id: 'resepsi', label: '🎉 Resepsi', color: '#D97706' },
  { id: 'pasca', label: '✅ Pasca Acara', color: '#16A34A' }
];

const ENGAGEMENT_SESSIONS = [
  { id: 'pra', label: '🌅 Pra-Acara Lamaran', color: '#7C3AED' },
  { id: 'akad', label: '💐 Prosesi Lamaran', color: '#2563EB' },
  { id: 'resepsi', label: '🍽️ Ramah Tamah & Foto', color: '#D97706' },
  { id: 'pasca', label: '✅ Pasca Acara', color: '#16A34A' }
];

let eventTasks = [];
let editTaskId = null;

function getActiveSessions() {
  const eventType = WP_Utils.getEventType();
  return eventType === 'engagement' ? ENGAGEMENT_SESSIONS : SESSIONS;
}

// ─── Init ─────────────────────────────────────────────────────────────────────
async function initEvent() {
  await WP_Auth.syncUserData();
  WP_Layout.renderHeader();

  const eventType = WP_Utils.getEventType();
  const pageTitleEl = document.querySelector('.page-header-title h2');
  const pageDescEl = document.querySelector('.page-header-title p');
  if (pageTitleEl) {
    pageTitleEl.textContent = eventType === 'engagement' ? 'Acara Lamaran 💐' : 'Akad & Resepsi 💍';
  }
  if (pageDescEl) {
    pageDescEl.textContent = eventType === 'engagement'
      ? 'Checklist operasional & rundown hari-H acara lamaran. Centang setiap tugas yang sudah selesai.'
      : 'Checklist operasional & rundown hari-H akad nikah dan resepsi. Centang setiap tugas yang sudah selesai.';
  }

  populateSessionOptions();
  await loadTasks();
  renderAll();
}

function populateSessionOptions() {
  const select = document.getElementById('task-session');
  if (!select) return;
  select.innerHTML = getActiveSessions()
    .map(sess => `<option value="${sess.id}">${WP_ESC2(sess.label)}</option>`)
    .join('');
}

// ─── Load/Save ────────────────────────────────────────────────────────────────
async function loadTasks() {
  const eventType = WP_Utils.getEventType();
  const saved = await WP_DataStore.loadPageState(EVENT_KEY, null);
  if (Array.isArray(saved) && saved.length > 0) {
    eventTasks = saved;
  } else {
    const defaultList = eventType === 'engagement' ? DEFAULT_ENGAGEMENT_TASKS : DEFAULT_TASKS;
    eventTasks = JSON.parse(JSON.stringify(defaultList));
    saveTasks();
  }
}

function saveTasks() {
  return WP_DataStore.savePageState(EVENT_KEY, eventTasks);
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function renderStats() {
  const total = eventTasks.length;
  const done = eventTasks.filter(t => t.done).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  setEl('ev-stat-total', total + ' Tugas');
  setEl('ev-stat-done', done + ' Selesai');
  setEl('ev-stat-remaining', (total - done) + ' Belum');
  setEl('ev-stat-pct', pct + '%');

  // Progress bar
  const bar = document.getElementById('ev-progress-bar');
  if (bar) bar.style.width = pct + '%';
  const barLabel = document.getElementById('ev-progress-label');
  if (barLabel) barLabel.textContent = `${done} dari ${total} tugas selesai (${pct}%)`;
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ─── Render ───────────────────────────────────────────────────────────────────
function renderAll() {
  renderStats();
  renderSessionCards();
}

function renderSessionCards() {
  const container = document.getElementById('event-sessions-container');
  if (!container) return;

  const activeSessions = getActiveSessions();
  container.innerHTML = activeSessions.map(sess => {
    const tasks = eventTasks.filter(t => t.session === sess.id);
    const doneCount = tasks.filter(t => t.done).length;

    const taskRows = tasks.length === 0
      ? `<div style="padding:12px 0; font-size:var(--font-size-xs); color:var(--text-muted);">Tidak ada tugas. Klik + untuk menambah.</div>`
      : tasks.map(t => `
          <div class="event-task-row ${t.done ? 'done' : ''}" id="etask-${t.id}">
            <div class="event-task-left">
              <div class="event-task-check" onclick="WP_Event.toggleTask('${t.id}')">
                ${t.done ? '✓' : ''}
              </div>
              <div class="event-task-info">
                <div class="event-task-title">${WP_ESC2(t.title)}</div>
                <div class="event-task-meta">
                  ${t.time ? `<span>🕐 ${t.time}</span>` : ''}
                  ${t.pic  ? `<span>👤 ${WP_ESC2(t.pic)}</span>` : ''}
                </div>
              </div>
            </div>
            <div class="event-task-right">
              <button class="btn-item-menu" onclick="WP_Event.openEditModal('${t.id}')" title="Edit">⋮</button>
            </div>
          </div>
        `).join('');

    return `
      <div class="event-session-card">
        <div class="event-session-header" style="--sess-color: ${sess.color};">
          <div class="event-session-left">
            <span class="event-session-label">${sess.label}</span>
            <span class="event-session-count">${doneCount}/${tasks.length} selesai</span>
          </div>
          <button class="btn-cat-add" onclick="WP_Event.openAddModal('${sess.id}')" title="Tambah Tugas">+</button>
        </div>
        <div class="event-task-list">
          ${taskRows}
        </div>
      </div>
    `;
  }).join('');
}

const WP_ESC2 = v => String(v ?? '').replace(/[&<>"']/g, c =>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// ─── Toggle ───────────────────────────────────────────────────────────────────
function toggleTask(id) {
  eventTasks = eventTasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  saveTasks();
  renderAll();
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function openAddModal(sessionId) {
  editTaskId = null;
  document.getElementById('task-modal-title').textContent = 'Tambah Tugas';
  document.getElementById('task-form').reset();
  document.getElementById('task-session').value = sessionId || 'pra';
  document.getElementById('btn-delete-task').style.display = 'none';
  document.getElementById('task-modal').classList.add('open');
}

function openEditModal(id) {
  const task = eventTasks.find(t => t.id === id);
  if (!task) return;
  editTaskId = id;
  document.getElementById('task-modal-title').textContent = 'Edit Tugas';
  document.getElementById('task-title').value = task.title;
  document.getElementById('task-session').value = task.session;
  document.getElementById('task-time').value = task.time || '';
  document.getElementById('task-pic').value = task.pic || '';
  document.getElementById('btn-delete-task').style.display = 'inline-flex';
  document.getElementById('task-modal').classList.add('open');
}

function closeTaskModal() {
  document.getElementById('task-modal').classList.remove('open');
  editTaskId = null;
}

// ─── Save Task ────────────────────────────────────────────────────────────────
function saveTask(e) {
  e.preventDefault();
  const title   = document.getElementById('task-title').value.trim();
  const session = document.getElementById('task-session').value;
  const time    = document.getElementById('task-time').value;
  const pic     = document.getElementById('task-pic').value.trim();

  if (!title) return;

  if (editTaskId) {
    eventTasks = eventTasks.map(t =>
      t.id === editTaskId ? { ...t, title, session, time, pic } : t
    );
    WP_UI.showToast('Tugas diperbarui.', 'success');
  } else {
    eventTasks.push({ id: 'task-' + Date.now(), title, session, time, pic, done: false });
    WP_UI.showToast(`"${title}" ditambahkan.`, 'success');
  }

  saveTasks();
  closeTaskModal();
  renderAll();
}

// ─── Delete Task ──────────────────────────────────────────────────────────────
function deleteTask() {
  if (!editTaskId) return;
  if (!confirm('Hapus tugas ini?')) return;
  const task = eventTasks.find(t => t.id === editTaskId);
  eventTasks = eventTasks.filter(t => t.id !== editTaskId);
  saveTasks();
  closeTaskModal();
  renderAll();
  WP_UI.showToast(`"${task?.title || 'Tugas'}" dihapus.`, 'info');
}

window.WP_Event = {
  initEvent,
  toggleTask,
  openAddModal,
  openEditModal,
  closeTaskModal,
  saveTask,
  deleteTask
};
