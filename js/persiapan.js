/**
 * Peta Persiapan & Checklist Administrasi
 */

const DEFAULT_STAGES = [
  {
    id: 'rt_rw',
    name: 'RT / RW',
    subtitle: 'Surat Pengantar',
    status: 'selesai',
    color: 'red',
    icon: '📝',
    mainTitle: 'RT / RW — Surat Pengantar Nikah',
    mainDesc: 'Pengurusan surat pengantar nikah dari RT dan RW domisili calon pengantin.',
    resultText: 'Surat Pengantar RT/RW resmi bermaterai',
    items: [
      { id: 'r1', text: 'Fotokopi KTP calon pengantin (2 lembar)', completed: true },
      { id: 'r2', text: 'Fotokopi Kartu Keluarga (KK)', completed: true },
      { id: 'r3', text: 'Fotokopi KTP Orang Tua / Wali', completed: true },
      { id: 'r4', text: 'Surat Pengantar dari Ketua RT', completed: true },
      { id: 'r5', text: 'Legalisir Surat Pengantar di RW', completed: true }
    ]
  },
  {
    id: 'kelurahan',
    name: 'Kelurahan',
    subtitle: 'N1, N2, N4, N5',
    status: 'selesai',
    color: 'yellow',
    icon: '🏛️',
    mainTitle: 'Kelurahan / Desa — Formulir N1 s/d N5',
    mainDesc: 'Pengurusan berkas resmi formulir pendaftaran pernikahan di kantor kelurahan domisili.',
    resultText: 'Surat Formulir N1, N2, N4, dan N5 yang telah dilegalisir lurah',
    items: [
      { id: 'k1', text: 'Membawa Surat Pengantar RT/RW asli', completed: true },
      { id: 'k2', text: 'Fotokopi KTP dan KK kedua catin & orang tua', completed: true },
      { id: 'k3', text: 'Pengisian Formulir N1 (Surat Keterangan Nikah)', completed: true },
      { id: 'k4', text: 'Pengisian Formulir N2 (Surat Asal-Usul)', completed: true },
      { id: 'k5', text: 'Pengisian Formulir N4 (Surat Keterangan Orang Tua)', completed: true },
      { id: 'k6', text: 'Pengisian Formulir N5 (Surat Izin Orang Tua jika < 21 thn)', completed: true }
    ]
  },
  {
    id: 'puskesmas',
    name: 'Puskesmas',
    subtitle: 'Kesehatan & TT',
    status: 'proses',
    color: 'blue',
    icon: '🩺',
    mainTitle: 'Puskesmas / Klinik — Pemeriksaan Kesehatan Pranikah',
    mainDesc: 'Pemeriksaan kesehatan fisik, skrining darah, dan imunisasi Tetanus Toxoid (TT).',
    resultText: 'Sertifikat Layak Kawin / Surat Keterangan Sehat Pranikah',
    items: [
      { id: 'p1', text: 'Pemeriksaan laboratorium darah & Hb (CPW & CPP)', completed: true },
      { id: 'p2', text: 'Pemberian Imunisasi Suntik TT (Tetanus Toxoid) untuk CPW', completed: true },
      { id: 'p3', text: 'Konseling gizi & reproduksi calon pengantin', completed: false },
      { id: 'p4', text: 'Pengambilan Sertifikat / Surat Bebas Penyakit Menular', completed: false }
    ]
  },
  {
    id: 'kua',
    name: 'KUA',
    subtitle: 'Pendaftaran Nikah',
    status: 'belum',
    color: 'purple',
    icon: '📑',
    mainTitle: 'KUA — Pendaftaran Nikah',
    mainDesc: 'Kelengkapan dokumen yang harus dibawa saat proses pendaftaran nikah di KUA.',
    resultText: 'Jadwal Resmi Akad KUA & Kartu Bimbingan Perkawinan',
    items: [
      { id: 'u1', text: 'Fotocopy KTP kedua catin', completed: false },
      { id: 'u2', text: 'Fotocopy KK kedua catin', completed: false },
      { id: 'u3', text: 'Fotocopy KTP bpk & ibu kedua catin', completed: false },
      { id: 'u4', text: 'Fotocopy KTP wali nikah', completed: false },
      { id: 'u5', text: 'Fotocopy KTP Saksi', completed: false },
      { id: 'u6', text: 'Fotocopy Akta Kelahiran', completed: false },
      { id: 'u7', text: 'Fotocopy Ijazah Terakhir (Opsional)', completed: false },
      { id: 'u8', text: 'Akta kematian orang tua jika ada yg sudah meninggal', completed: false },
      { id: 'u9', text: 'Surat pengantar RT/RW', completed: false },
      { id: 'u10', text: 'Surat N1, N4, N5 dari kelurahan', completed: false },
      { id: 'u11', text: 'Surat Sehat/Sertifikat dari puskesmas', completed: false },
      { id: 'u12', text: 'Foto Latar Biru kedua catin 2x3 (4 Lembar)', completed: false },
      { id: 'u13', text: 'Foto Latar Biru Kedua Catin 4x6 (2 Lembar)', completed: false }
    ]
  },
  {
    id: 'akad',
    name: 'Akad',
    subtitle: 'Persiapan Akad',
    status: 'belum',
    color: 'pink',
    icon: '💍',
    mainTitle: 'Persiapan Hari Akad Nikah',
    mainDesc: 'Kesiapan berkas, mas kawin (mahar), penghulu, saksi, dan tempat ijab kabul.',
    resultText: 'Buku Nikah Resmi & Dokumen Akad Lengkap',
    items: [
      { id: 'a1', text: 'Fisik Mahar & Mas Kawin siap di tempat', completed: false },
      { id: 'a2', text: 'Kotak cincin nikah & penataan', completed: false },
      { id: 'a3', text: 'Konfirmasi kehadiran Penghulu KUA & waktu tiba', completed: false },
      { id: 'a4', text: 'Konfirmasi kehadiran 2 orang saksi nikah resmi', completed: false },
      { id: 'a5', text: 'Pemeriksaan teks ijab kabul & wali nasab/hakim', completed: false }
    ]
  },
  {
    id: 'resepsi',
    name: 'Resepsi',
    subtitle: 'Persiapan Resepsi',
    status: 'belum',
    color: 'indigo',
    icon: '🎉',
    mainTitle: 'Persiapan Resepsi & Jamuan Tamu',
    mainDesc: 'Kesiapan venue, catering, busana pengantin, dekorasi, dan penerimaan tamu.',
    resultText: 'Kelancaran Acara Resepsi & Rekap Buku Tamu',
    items: [
      { id: 're1', text: 'Final checklist catering & menu gubukan', completed: false },
      { id: 're2', text: 'Fitting final baju pengantin & keluarga', completed: false },
      { id: 're3', text: 'Briefing tim WO / panitia keluarga & rundown', completed: false },
      { id: 're4', text: 'Buku tamu, suvenir, dan meja amplop siap', completed: false },
      { id: 're5', text: 'Sound system, multimedia, dan MC rundown check', completed: false }
    ]
  }
];

const DEFAULT_ENGAGEMENT_STAGES = [
  {
    id: 'keluarga',
    name: 'Keluarga',
    subtitle: 'Pertemuan Awal',
    status: 'selesai',
    color: 'red',
    icon: '🤝',
    mainTitle: 'Pertemuan Keluarga — Kesepakatan Lamaran',
    mainDesc: 'Musyawarah keluarga besar untuk menentukan tanggal, lokasi, serta konsep acara lamaran.',
    resultText: 'Kesepakatan Tanggal, Lokasi, dan Konsep Lamaran',
    items: [
      { id: 'eg1', text: 'Diskusi internal keluarga CPP & CPW', completed: true },
      { id: 'eg2', text: 'Penentuan tanggal & waktu resmi acara lamaran', completed: true },
      { id: 'eg3', text: 'Estimasi jumlah tamu keluarga inti yang diundang', completed: true },
      { id: 'eg4', text: 'Penentuan anggaran dasar acara lamaran', completed: true }
    ]
  },
  {
    id: 'lokasi_vendor',
    name: 'Tempat & Vendor',
    subtitle: 'Venue, MUA & Dekor',
    status: 'proses',
    color: 'yellow',
    icon: '🏡',
    mainTitle: 'Tempat & Vendor — Booking Kebutuhan Acara',
    mainDesc: 'Persiapan lokasi acara (rumah/resto/venue), dekorasi, MUA, dan dokumentasi.',
    resultText: 'Konfirmasi Tempat & DP Vendor Utama Lamaran',
    items: [
      { id: 'ev1', text: 'Survei & booking tempat acara (Rumah / Resto / Hall)', completed: true },
      { id: 'ev2', text: 'Booking vendor Dekorasi Backdrop Lamaran', completed: true },
      { id: 'ev3', text: 'Booking MUA & Hairdo / Hijab do CPW', completed: false },
      { id: 'ev4', text: 'Booking Fotografer & Dokumentasi acara', completed: false },
      { id: 'ev5', text: 'Pemesanan Catering / Menu Konsumsi Keluarga', completed: false }
    ]
  },
  {
    id: 'busana_hantaran',
    name: 'Hantaran & Cincin',
    subtitle: 'Busana & Seserahan',
    status: 'belum',
    color: 'blue',
    icon: '🎁',
    mainTitle: 'Hantaran & Cincin — Persiapan Barang Simbolis',
    mainDesc: 'Pembelian dan penataan cincin lamaran serta nampan hantaran seserahan.',
    resultText: 'Cincin Nikah/Lamaran Siap & Hantaran Tertata Rapi',
    items: [
      { id: 'eb1', text: 'Pembelian Cincin Lamaran / Engagement Ring', completed: false },
      { id: 'eb2', text: 'Fitting seragam / busana batik CPP & CPW', completed: false },
      { id: 'eb3', text: 'Daftar item hantaran balasan CPW & CPP', completed: false },
      { id: 'eb4', text: 'Jasa hias & sewa kotak nampan hantaran', completed: false }
    ]
  },
  {
    id: 'panitia_acara',
    name: 'Panitia & Rundown',
    subtitle: 'Susunan Acara',
    status: 'belum',
    color: 'purple',
    icon: '📜',
    mainTitle: 'Panitia & Rundown — Susunan Acara Lamaran',
    mainDesc: 'Penyusunan alur acara, penunjukan juru bicara/utusan keluarga, dan MC.',
    resultText: 'Rundown Resmi & Penunjukan Juru Bicara Keluarga',
    items: [
      { id: 'ep1', text: 'Penunjukan Juru Bicara (Utusan) Keluarga CPP', completed: false },
      { id: 'ep2', text: 'Penunjukan Juru Bicara Penerima Keluarga CPW', completed: false },
      { id: 'ep3', text: 'Penunjukan MC & Pembaca Doa acara lamaran', completed: false },
      { id: 'ep4', text: 'Finalisasi Teks Sambutan & Rundown Acara', completed: false }
    ]
  },
  {
    id: 'hari_h',
    name: 'Hari-H',
    subtitle: 'Acara Lamaran',
    status: 'belum',
    color: 'pink',
    icon: '💍',
    mainTitle: 'Pelaksanaan Hari-H Acara Lamaran',
    mainDesc: 'Kesiapan tempat, penyambutan keluarga, tukar cincin, dan ramah tamah.',
    resultText: 'Kelancaran Acara Lamaran & Kesepakatan Menuju Pernikahan',
    items: [
      { id: 'eh1', text: 'Checklist kebersihan & penataan area acara', completed: false },
      { id: 'eh2', text: 'Serah terima nampan hantaran & cincin', completed: false },
      { id: 'eh3', text: 'Pelaksanaan acara pinangan & tukar cincin', completed: false },
      { id: 'eh4', text: 'Ramah tamah, foto bersama, & santap bersama', completed: false }
    ]
  }
];

let currentStageId = null;
let stagesData = [];

// Warna ikon tahap baru bergiliran dari palet yang tersedia di CSS (.stage-icon-circle.*)
const STAGE_COLORS = ['red', 'yellow', 'blue', 'purple', 'pink', 'indigo'];

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

/** Hanya tautan http(s) yang boleh ditampilkan sebagai tautan pembelian. */
function safePurchaseUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch (_) {
    return '';
  }
}

function getItemMetadata({ price, purchaseLink }) {
  if (price !== null && (!Number.isFinite(price) || price <= 0)) {
    throw new Error('Harga harus lebih dari 0. Kosongkan bila belum ada harga.');
  }
  const cleanLink = safePurchaseUrl(purchaseLink);
  if (purchaseLink && !cleanLink) {
    throw new Error('Link pembelian harus berupa URL http:// atau https:// yang valid.');
  }
  return { price: price ?? null, purchaseLink: cleanLink };
}

function renderItemDetails(item) {
  const hasPrice = Number.isFinite(Number(item.price)) && Number(item.price) > 0;
  const purchaseUrl = safePurchaseUrl(item.purchaseLink);
  if (!hasPrice && !purchaseUrl) return '';

  return `
    <div class="checklist-item-details">
      ${hasPrice ? `<span class="checklist-item-price">${WP_Utils.formatRupiah(Number(item.price))}</span>` : ''}
      ${purchaseUrl ? `<a class="checklist-item-link" href="${escapeHtml(purchaseUrl)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">Lihat link pembelian</a>` : ''}
    </div>
  `;
}

function getDefaultStages() {
  const defaults = WP_Utils.getEventType() === 'engagement' ? DEFAULT_ENGAGEMENT_STAGES : DEFAULT_STAGES;
  return JSON.parse(JSON.stringify(defaults));
}

function getDefaultListTitle() {
  return WP_Utils.getEventType() === 'engagement' ? 'Checklist Persiapan' : 'Dokumen yang Harus Dibawa';
}

function getCurrentStage() {
  return stagesData.find(s => s.id === currentStageId);
}

/**
 * Initialize Peta Persiapan
 */
async function initPersiapan() {
  await WP_Auth.syncUserData();
  WP_Layout.renderHeader();

  const eventType = WP_Utils.getEventType();
  const pageTitleEl = document.querySelector('.page-header-title h2');
  const pageDescEl = document.querySelector('.page-header-title p');
  if (pageTitleEl) {
    pageTitleEl.textContent = eventType === 'engagement' ? 'Peta Persiapan Lamaran' : 'Administrasi & Peta Persiapan';
  }
  if (pageDescEl) {
    pageDescEl.textContent = eventType === 'engagement'
      ? 'Pantau dan selesaikan setiap tahapan persiapan acara lamaranmu.'
      : 'Alur pengurusan dokumen resmi KUA dan tahapan persiapan nikah.';
  }

  await loadStagesData();
  renderAll();
}

/**
 * Load Stages from LocalStorage / Seed
 */
async function loadStagesData() {
  // Key otomatis diberi prefix engagement_ oleh WP_DataStore bila event_type = engagement
  const saved = await WP_DataStore.loadPageState(WP_Utils.STORAGE_KEYS.CHECKLIST_KUA, null);

  if (saved && Array.isArray(saved) && saved.length > 0) {
    stagesData = saved;
  } else {
    stagesData = getDefaultStages();
    saveStagesData();
  }

  if (!stagesData.some(s => s.id === currentStageId)) {
    // Buka tahap pertama yang belum selesai
    const firstPending = stagesData.find(s => s.status !== 'selesai');
    currentStageId = (firstPending || stagesData[0])?.id || null;
  }
}

function saveStagesData() {
  return WP_DataStore.savePageState(WP_Utils.STORAGE_KEYS.CHECKLIST_KUA, stagesData);
}

/** Status tahap mengikuti item: semua selesai = selesai, sebagian = proses */
function recomputeStageStatus(stage) {
  if (stage.items.length === 0) return;
  const done = stage.items.filter(i => i.completed).length;
  stage.status = done === stage.items.length ? 'selesai' : done > 0 ? 'proses' : 'belum';
}

function renderAll() {
  renderStepperCards();
  renderActiveStageChecklist();
}

/**
 * Render Top Stepper Cards
 */
function renderStepperCards() {
  const container = document.getElementById('stage-stepper-container');
  if (!container) return;

  const cardsHtml = stagesData.map(stage => {
    const isActive = stage.id === currentStageId;
    const color = STAGE_COLORS.includes(stage.color) ? stage.color : 'blue';

    return `
      <div class="stage-step-card ${isActive ? 'active' : ''}" onclick="selectStage('${stage.id}')">
        <div class="stage-icon-circle ${color}">
          <span>${escapeHtml(stage.icon)}</span>
        </div>
        <div class="stage-title">${escapeHtml(stage.name)}</div>
        <div class="stage-sub">${escapeHtml(stage.subtitle)}</div>
        <span class="stage-badge ${getStageBadgeClass(stage.status)}">${getStageBadgeLabel(stage.status)}</span>
      </div>
    `;
  }).join('');

  container.innerHTML = cardsHtml + `
    <button type="button" class="stage-step-card add-stage" onclick="WP_Persiapan.openAddStageModal()" title="Tambah tahap baru">
      <span class="stage-add-icon">+</span>
      <span>Tambah Tahap</span>
    </button>
  `;

  // Di HP stepper bisa digeser menyamping: pastikan tahap aktif terlihat di tengah
  const active = container.querySelector('.stage-step-card.active');
  if (active && container.scrollWidth > container.clientWidth) {
    container.scrollLeft = active.offsetLeft - (container.clientWidth - active.offsetWidth) / 2;
  }
}

function getStageBadgeClass(status) {
  switch (status) {
    case 'selesai': return 'badge-green';
    case 'proses': return 'badge-yellow';
    default: return 'badge-gray';
  }
}

function getStageBadgeLabel(status) {
  switch (status) {
    case 'selesai': return 'Selesai';
    case 'proses': return 'Proses';
    default: return 'Belum';
  }
}

/**
 * Switch Active Stage
 */
function selectStage(stageId) {
  currentStageId = stageId;
  renderAll();
}

/**
 * Render Checklist of Active Stage
 */
function renderActiveStageChecklist() {
  const stage = getCurrentStage();
  if (!stage) return;

  // Update Headers
  const mainTitleEl = document.getElementById('stage-main-title');
  const mainDescEl = document.getElementById('stage-main-desc');
  const listTitleEl = document.getElementById('checklist-section-title');
  const resultTextEl = document.getElementById('stage-result-text');
  const btnCompleteEl = document.getElementById('btn-complete-stage');

  if (mainTitleEl) mainTitleEl.textContent = stage.mainTitle || stage.name;
  if (mainDescEl) mainDescEl.textContent = stage.mainDesc || '';
  if (listTitleEl) listTitleEl.textContent = stage.listTitle || getDefaultListTitle();
  if (resultTextEl) resultTextEl.textContent = stage.resultText || '—';

  if (btnCompleteEl) {
    if (stage.status === 'selesai') {
      btnCompleteEl.innerHTML = `<span>✓ Tahap Ini Sudah Selesai</span>`;
      btnCompleteEl.style.backgroundColor = 'var(--accent-green)';
    } else {
      btnCompleteEl.innerHTML = `<span>Tandai Selesai</span>`;
      btnCompleteEl.style.backgroundColor = 'var(--primary)';
    }
  }

  // Render Checkbox Items
  const listEl = document.getElementById('checklist-items-list');
  if (!listEl) return;

  if (stage.items.length === 0) {
    listEl.innerHTML = `<div style="padding: 8px 0; font-size: var(--font-size-xs); color: var(--text-muted);">Belum ada item. Klik <strong>+ Tambah Item</strong> untuk menambahkan.</div>`;
    return;
  }

  listEl.innerHTML = stage.items.map(item => `
    <div class="checklist-row ${item.completed ? 'completed' : ''}" onclick="toggleChecklistItem('${item.id}')">
      <div class="checklist-left">
        <div class="checklist-custom-box">
          ${item.completed ? '✓' : ''}
        </div>
        <div class="checklist-item-content">
          <span class="checklist-text">${escapeHtml(item.text)}</span>
          ${renderItemDetails(item)}
        </div>
      </div>
      <div class="row-actions" onclick="event.stopPropagation()">
        <button type="button" class="btn-icon-action" title="Edit item" onclick="WP_Persiapan.openEditItemModal('${item.id}')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        </button>
        <button type="button" class="btn-icon-action danger" title="Hapus item" onclick="WP_Persiapan.deleteItem('${item.id}')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

/**
 * Toggle Checklist Item
 */
function toggleChecklistItem(itemId) {
  const stage = getCurrentStage();
  if (!stage) return;

  const item = stage.items.find(i => i.id === itemId);
  if (item) {
    item.completed = !item.completed;
    recomputeStageStatus(stage);
    saveStagesData();
    renderAll();
  }
}

/**
 * Mark Current Stage as Completed
 */
function completeCurrentStage() {
  const stage = getCurrentStage();
  if (!stage) return;

  // Mark all items as completed
  stage.items.forEach(i => i.completed = true);
  stage.status = 'selesai';
  saveStagesData();

  WP_UI.showToast(`Tahap ${stage.name} berhasil ditandai selesai! 🎉`, 'success');

  // Find next unfinished stage
  const currentIndex = stagesData.findIndex(s => s.id === currentStageId);
  if (currentIndex < stagesData.length - 1) {
    currentStageId = stagesData[currentIndex + 1].id;
  }

  renderAll();
}

// ─── Edit Item Checklist ─────────────────────────────────────────────────────
function openAddItemModal() {
  const stage = getCurrentStage();
  if (!stage) return;
  WP_UI.openFormModal({
    title: `Tambah Item — ${stage.name}`,
    submitLabel: 'Tambah',
    fields: [
      { name: 'text', label: 'Nama item', type: 'text', required: true, placeholder: 'Contoh: Kebaya akad' },
      { name: 'price', label: 'Harga', type: 'number', placeholder: 'Contoh: 750000', hint: 'Opsional. Isi tanpa titik atau koma.' },
      { name: 'purchaseLink', label: 'Link pembelian', type: 'url', placeholder: 'https://…', hint: 'Opsional. Tautan tampil di bawah nama item.' }
    ],
    onSubmit: ({ text, price, purchaseLink }) => {
      const metadata = getItemMetadata({ price, purchaseLink });
      stage.items.push({
        id: `item-${Date.now()}`,
        text,
        completed: false,
        ...metadata
      });
      recomputeStageStatus(stage);
      saveStagesData();
      renderAll();
      WP_UI.showToast(`Item ditambahkan ke ${stage.name}.`, 'success');
    }
  });
}

function openEditItemModal(itemId) {
  const stage = getCurrentStage();
  const item = stage?.items.find(i => i.id === itemId);
  if (!item) return;
  WP_UI.openFormModal({
    title: 'Edit Item',
    fields: [
      { name: 'text', label: 'Nama item', type: 'text', value: item.text, required: true },
      { name: 'price', label: 'Harga', type: 'number', value: item.price ?? '', placeholder: 'Contoh: 750000', hint: 'Opsional. Isi tanpa titik atau koma.' },
      { name: 'purchaseLink', label: 'Link pembelian', type: 'url', value: item.purchaseLink || '', placeholder: 'https://…', hint: 'Opsional. Tautan tampil di bawah nama item.' }
    ],
    onSubmit: ({ text, price, purchaseLink }) => {
      const metadata = getItemMetadata({ price, purchaseLink });
      item.text = text;
      Object.assign(item, metadata);
      saveStagesData();
      renderAll();
      WP_UI.showToast('Item diperbarui.', 'success');
    },
    onDelete: () => removeItem(stage, itemId),
    deleteConfirm: `Hapus "${item.text}" dari daftar?`
  });
}

function deleteItem(itemId) {
  const stage = getCurrentStage();
  const item = stage?.items.find(i => i.id === itemId);
  if (!item) return;
  if (!confirm(`Hapus "${item.text}" dari daftar?`)) return;
  removeItem(stage, itemId);
}

function removeItem(stage, itemId) {
  stage.items = stage.items.filter(i => i.id !== itemId);
  recomputeStageStatus(stage);
  saveStagesData();
  renderAll();
  WP_UI.showToast('Item dihapus.', 'info');
}

// ─── Edit Tahap ──────────────────────────────────────────────────────────────
function stageFields(stage = {}) {
  return [
    { name: 'name', label: 'Nama tahap (kartu)', type: 'text', value: stage.name, required: true, placeholder: 'Contoh: KUA' },
    { name: 'subtitle', label: 'Keterangan singkat (kartu)', type: 'text', value: stage.subtitle, placeholder: 'Contoh: Pendaftaran Nikah' },
    { name: 'icon', label: 'Ikon (emoji)', type: 'text', value: stage.icon || '📌', placeholder: '📌' },
    { name: 'mainTitle', label: 'Judul lengkap', type: 'text', value: stage.mainTitle, placeholder: 'Contoh: KUA — Pendaftaran Nikah' },
    { name: 'mainDesc', label: 'Deskripsi', type: 'textarea', value: stage.mainDesc },
    { name: 'listTitle', label: 'Judul daftar checklist', type: 'text', value: stage.listTitle || getDefaultListTitle() },
    { name: 'resultText', label: 'Keterangan yang didapatkan', type: 'text', value: stage.resultText, placeholder: 'Contoh: Jadwal resmi akad dari KUA' }
  ];
}

function applyStageValues(stage, values) {
  stage.name = values.name;
  stage.subtitle = values.subtitle;
  stage.icon = values.icon || '📌';
  stage.mainTitle = values.mainTitle || values.name;
  stage.mainDesc = values.mainDesc;
  stage.listTitle = values.listTitle || getDefaultListTitle();
  stage.resultText = values.resultText;
}

function openEditStageModal() {
  const stage = getCurrentStage();
  if (!stage) return;
  WP_UI.openFormModal({
    title: `Edit Tahap — ${stage.name}`,
    fields: stageFields(stage),
    onSubmit: values => {
      applyStageValues(stage, values);
      saveStagesData();
      renderAll();
      WP_UI.showToast('Tahap diperbarui.', 'success');
    },
    onDelete: () => deleteStage(stage.id),
    deleteConfirm: `Hapus tahap "${stage.name}" beserta ${stage.items.length} item checklist-nya?`
  });
}

function openAddStageModal() {
  WP_UI.openFormModal({
    title: 'Tambah Tahap Baru',
    submitLabel: 'Tambah',
    fields: [
      ...stageFields(),
      { name: 'items', label: 'Item checklist', type: 'lines', placeholder: 'Satu item per baris' }
    ],
    onSubmit: values => {
      const stage = {
        id: `stage-${Date.now()}`,
        status: 'belum',
        color: STAGE_COLORS[stagesData.length % STAGE_COLORS.length],
        items: values.items.map((text, i) => ({ id: `item-${Date.now()}-${i}`, text, completed: false }))
      };
      applyStageValues(stage, values);
      stagesData.push(stage);
      currentStageId = stage.id;
      saveStagesData();
      renderAll();
      WP_UI.showToast(`Tahap "${stage.name}" ditambahkan.`, 'success');
    }
  });
}

function deleteStage(stageId) {
  if (stagesData.length <= 1) {
    WP_UI.showToast('Minimal harus ada satu tahap.', 'error');
    return false;
  }
  const index = stagesData.findIndex(s => s.id === stageId);
  const [removed] = stagesData.splice(index, 1);
  currentStageId = (stagesData[index] || stagesData[index - 1]).id;
  saveStagesData();
  renderAll();
  WP_UI.showToast(`Tahap "${removed.name}" dihapus.`, 'info');
}

async function resetToDefault() {
  if (!confirm('Kembalikan semua tahap dan checklist ke daftar bawaan? Semua perubahan & centang di halaman ini akan hilang.')) return;
  stagesData = getDefaultStages();
  currentStageId = (stagesData.find(s => s.status !== 'selesai') || stagesData[0]).id;
  await saveStagesData();
  renderAll();
  WP_UI.showToast('Peta Persiapan dikembalikan ke bawaan.', 'info');
}

/**
 * Data tahapan untuk halaman lain (mis. Prioritas Dashboard): tersimpan atau default,
 * tanpa menyimpan dan tanpa mengubah state halaman Peta Persiapan.
 */
async function getStagesSnapshot() {
  const saved = await WP_DataStore.loadPageState(WP_Utils.STORAGE_KEYS.CHECKLIST_KUA, null);
  if (Array.isArray(saved) && saved.length > 0) return saved;
  return getDefaultStages();
}

window.WP_Persiapan = {
  initPersiapan,
  getStagesSnapshot,
  selectStage,
  toggleChecklistItem,
  completeCurrentStage,
  openAddItemModal,
  openEditItemModal,
  deleteItem,
  openEditStageModal,
  openAddStageModal,
  resetToDefault
};
