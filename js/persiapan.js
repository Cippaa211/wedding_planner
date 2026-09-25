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

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
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
  renderStepperCards();
  renderActiveStageChecklist();
}

/**
 * Load Stages from LocalStorage / Seed
 */
async function loadStagesData() {
  const eventType = WP_Utils.getEventType();
  // Key otomatis diberi prefix engagement_ oleh WP_DataStore bila event_type = engagement
  const saved = await WP_DataStore.loadPageState(WP_Utils.STORAGE_KEYS.CHECKLIST_KUA, null);

  if (saved && Array.isArray(saved) && saved.length > 0) {
    stagesData = saved;
  } else {
    const defaults = eventType === 'engagement' ? DEFAULT_ENGAGEMENT_STAGES : DEFAULT_STAGES;
    stagesData = JSON.parse(JSON.stringify(defaults));
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

/**
 * Render Top Stepper Cards
 */
function renderStepperCards() {
  const container = document.getElementById('stage-stepper-container');
  if (!container) return;

  container.innerHTML = stagesData.map(stage => {
    const isActive = stage.id === currentStageId;
    const badgeClass = getStageBadgeClass(stage.status);
    const badgeLabel = getStageBadgeLabel(stage.status);

    return `
      <div class="stage-step-card ${isActive ? 'active' : ''}" onclick="selectStage('${stage.id}')">
        <div class="stage-icon-circle ${stage.color}">
          <span>${stage.icon}</span>
        </div>
        <div class="stage-title">${stage.name}</div>
        <div class="stage-sub">${stage.subtitle}</div>
        <span class="stage-badge ${badgeClass}">${badgeLabel}</span>
      </div>
    `;
  }).join('');
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
  renderStepperCards();
  renderActiveStageChecklist();
}

/**
 * Render Checklist of Active Stage
 */
function renderActiveStageChecklist() {
  const stage = stagesData.find(s => s.id === currentStageId);
  if (!stage) return;

  // Update Headers
  const mainTitleEl = document.getElementById('stage-main-title');
  const mainDescEl = document.getElementById('stage-main-desc');
  const resultTextEl = document.getElementById('stage-result-text');
  const btnCompleteEl = document.getElementById('btn-complete-stage');

  if (mainTitleEl) mainTitleEl.textContent = stage.mainTitle;
  if (mainDescEl) mainDescEl.textContent = stage.mainDesc;
  if (resultTextEl) resultTextEl.textContent = stage.resultText;

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

  listEl.innerHTML = stage.items.map((item, idx) => `
    <div class="checklist-row ${item.completed ? 'completed' : ''}" onclick="toggleChecklistItem('${item.id}')">
      <div class="checklist-left">
        <div class="checklist-custom-box">
          ${item.completed ? '✓' : ''}
        </div>
        <span class="checklist-text">${escapeHtml(item.text)}</span>
      </div>
    </div>
  `).join('');
}

/**
 * Toggle Checklist Item
 */
function toggleChecklistItem(itemId) {
  const stage = stagesData.find(s => s.id === currentStageId);
  if (!stage) return;

  const item = stage.items.find(i => i.id === itemId);
  if (item) {
    item.completed = !item.completed;

    // Check if all items completed
    const allCompleted = stage.items.every(i => i.completed);
    const anyCompleted = stage.items.some(i => i.completed);

    if (allCompleted) {
      stage.status = 'selesai';
    } else if (anyCompleted) {
      stage.status = 'proses';
    } else {
      stage.status = 'belum';
    }

    saveStagesData();
    renderStepperCards();
    renderActiveStageChecklist();
  }
}

/**
 * Mark Current Stage as Completed
 */
function completeCurrentStage() {
  const stage = stagesData.find(s => s.id === currentStageId);
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

  renderStepperCards();
  renderActiveStageChecklist();
}

/**
 * Data tahapan untuk halaman lain (mis. Prioritas Dashboard): tersimpan atau default,
 * tanpa menyimpan dan tanpa mengubah state halaman Peta Persiapan.
 */
async function getStagesSnapshot() {
  const saved = await WP_DataStore.loadPageState(WP_Utils.STORAGE_KEYS.CHECKLIST_KUA, null);
  if (Array.isArray(saved) && saved.length > 0) return saved;
  const defaults = WP_Utils.getEventType() === 'engagement' ? DEFAULT_ENGAGEMENT_STAGES : DEFAULT_STAGES;
  return JSON.parse(JSON.stringify(defaults));
}

window.WP_Persiapan = {
  initPersiapan,
  getStagesSnapshot,
  selectStage,
  toggleChecklistItem,
  completeCurrentStage
};
