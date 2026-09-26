/**
 * Alur Pernikahan Logic & Data Flow
 */

const ALUR_DATA = {
  groom: {
    id: 'groom',
    title: 'Dari Calon Pengantin Laki-laki',
    avatar: '👨‍💼',
    steps: [
      {
        number: '1',
        title: 'RT/RW — Kelurahan/Desa Domisili Laki-laki',
        desc: 'Minta Surat Pengantar Nikah (Formulir N1, N2, N4, N5).',
        boxTitle: 'Bawa dokumen:',
        docs: [
          'Fotokopi KTP',
          'Fotokopi KK',
          'Fotokopi Akta Lahir'
        ]
      },
      {
        number: '2',
        title: 'KUA Asal Laki-laki',
        desc: 'Urus Surat Rekomendasi / Numpang Nikah (karena akad biasanya di tempat perempuan).',
        boxTitle: 'Lengkapi:',
        docs: [
          'Surat pengantar (N1-N5)',
          'Fotokopi KTP, KK, Akta Lahir',
          'Pasfoto 2x3 latar biru (4 lembar)',
          'Surat keterangan sehat dari Puskesmas'
        ]
      },
      {
        number: '3',
        title: 'Serahkan ke Calon Istri',
        desc: 'Berikan Surat Rekomendasi / Numpang Nikah ke calon istri untuk dibawa ke KUA domisili perempuan.',
        boxTitle: 'Dokumen serah terima:',
        docs: [
          'Surat Rekomendasi Nikah resmi KUA asal',
          'Seluruh berkas persyaratan N1-N5 fisik'
        ]
      }
    ]
  },
  bride: {
    id: 'bride',
    title: 'Dari Calon Pengantin Perempuan',
    avatar: '👰‍♀️',
    steps: [
      {
        number: '1',
        title: 'RT/RW — Kelurahan/Desa Domisili Perempuan',
        desc: 'Minta Surat Pengantar Nikah (Formulir N1, N2, N4, N5).',
        boxTitle: 'Bawa dokumen:',
        docs: [
          'Fotokopi KTP',
          'Fotokopi KK',
          'Fotokopi Akta Lahir'
        ]
      },
      {
        number: '2',
        title: 'Puskesmas / Klinik',
        desc: 'Pemeriksaan kesehatan pranikah & imunisasi TT.',
        boxTitle: 'Yang dilakukan:',
        docs: [
          'Pemeriksaan umum (tensi, berat badan, darah sederhana)',
          'Dapat Surat Keterangan Sehat',
          'Suntik TT (Tetanus Toxoid) - dapat kartu imunisasi TT'
        ]
      },
      {
        number: '3',
        title: 'Lengkapi Dokumen Perempuan',
        desc: 'Dokumen yang harus dibawa dan didaftarkan ke KUA.',
        boxTitle: 'Dokumen wajib:',
        docs: [
          'Fotokopi KTP, KK, Akta Lahir',
          'Pasfoto 2x3 latar biru (4-5 lembar)',
          'Surat keterangan sehat & kartu TT',
          'Materai Rp10.000 (1-2 lembar)',
          'Surat Rekomendasi Nikah dari calon suami'
        ]
      }
    ]
  }
};

const ALUR_ENGAGEMENT_DATA = {
  groom: {
    id: 'groom',
    title: 'Persiapan Pihak Laki-laki',
    avatar: '👨‍💼',
    steps: [
      {
        number: '1',
        title: 'Hantaran & Cincin Lamaran',
        desc: 'Menyiapkan barang-barang hantaran utama dan perhiasan/cincin pinangan.',
        boxTitle: 'Bawa & Siapkan:',
        docs: [
          'Kotak Cincin Nikah / Engagement Ring',
          'Nampan Hantaran Pakaian / Peralatan',
          'Kue-kue tradisional khas daerah'
        ]
      },
      {
        number: '2',
        title: 'Keluarga & Utusan Juru Bicara',
        desc: 'Menentukan siapa yang bertindak sebagai juru bicara pengutarakan niat lamaran.',
        boxTitle: 'Koordinasi:',
        docs: [
          'Penunjukan Juru Bicara resmi',
          'Konfirmasi jumlah rombongan keluarga',
          'Koordinasi armada transportasi rombongan'
        ]
      },
      {
        number: '3',
        title: 'Kedatangan ke Tempat Acara',
        desc: 'Rombongan keluarga pria hadir tepat waktu sesuai kesepakatan susunan acara.',
        boxTitle: 'Yang dibawa saat hadir:',
        docs: [
          'Seluruh barang hantaran awal',
          'Teks penyampaian maksud & tujuan'
        ]
      }
    ]
  },
  bride: {
    id: 'bride',
    title: 'Persiapan Pihak Perempuan',
    avatar: '👰‍♀️',
    steps: [
      {
        number: '1',
        title: 'Tempat & Dekorasi Acara',
        desc: 'Menyiapkan lokasi penyambutan tamu di rumah, restoran, atau venue hall.',
        boxTitle: 'Yang disiapkan:',
        docs: [
          'Penataan tempat duduk keluarga besar',
          'Backdrop & dekorasi foto lamaran',
          'Sound system & mic sederhana'
        ]
      },
      {
        number: '2',
        title: 'MUA, Busana & Hantaran Balasan',
        desc: 'Penataan rias calon wanita serta penyediaan barang seserahan angsul-angsul (balasan).',
        boxTitle: 'Persiapan khusus:',
        docs: [
          'Makeup & kebaya/busana CPW',
          'Nampan hantaran balasan untuk pria',
          'Suvenir pengingat acara (jika ada)'
        ]
      },
      {
        number: '3',
        title: 'Penerimaan & Jamuan Tamu',
        desc: 'Penyambutan rombongan keluarga pria serta jamuan santap bersama.',
        boxTitle: 'Pelaksanaan:',
        docs: [
          'Juru Bicara penerima sambutan',
          'Hidangan utama catering / prasmanan',
          'Sesi foto bersama kedua keluarga'
        ]
      }
    ]
  }
};

// Key otomatis diberi prefix engagement_ oleh WP_DataStore bila event_type = engagement
const ALUR_STORAGE_KEY = 'wp_alur';

let alurData = null;

function escapeAlur(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

function getDefaultAlur() {
  const source = WP_Utils.getEventType() === 'engagement' ? ALUR_ENGAGEMENT_DATA : ALUR_DATA;
  return JSON.parse(JSON.stringify(source));
}

/** Pastikan setiap langkah punya id unik (data bawaan tidak punya id) */
function normalizeAlur(data) {
  ['groom', 'bride'].forEach(side => {
    data[side].steps = (data[side].steps || []).map((step, i) => ({
      id: step.id || `${side}-${i + 1}`,
      title: step.title || '',
      desc: step.desc || '',
      boxTitle: step.boxTitle || '',
      docs: Array.isArray(step.docs) ? step.docs : []
    }));
  });
  return data;
}

async function loadAlurData() {
  const saved = await WP_DataStore.loadPageState(ALUR_STORAGE_KEY, null);
  alurData = normalizeAlur(saved?.groom && saved?.bride ? saved : getDefaultAlur());
}

function saveAlurData() {
  return WP_DataStore.savePageState(ALUR_STORAGE_KEY, alurData);
}

async function initAlurPernikahan() {
  await WP_Auth.syncUserData();
  WP_Layout.renderHeader();

  const eventType = WP_Utils.getEventType();
  const pageTitleEl = document.querySelector('.page-header-title h2');
  const pageDescEl = document.querySelector('.page-header-title p');
  if (pageTitleEl) {
    pageTitleEl.textContent = eventType === 'engagement' ? 'Alur Acara Lamaran 📖' : 'Alur Pernikahan 📖';
  }
  if (pageDescEl) {
    pageDescEl.textContent = eventType === 'engagement'
      ? 'Panduan alur persiapan pihak laki-laki dan perempuan untuk acara lamaran.'
      : 'Petunjuk alur pengurusan surat nikah N1-N5 untuk CPP & CPW secara terpisah dan bertahap.';
  }

  await loadAlurData();
  renderAlurTimeline();
}

const EDIT_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;

function renderStepsHtml(side) {
  const steps = alurData[side].steps;
  const stepsHtml = steps.map((step, index) => `
    <div class="alur-step-item">
      <div class="alur-step-top">
        <div class="alur-step-number ${side}">${index + 1}</div>
        <div class="alur-step-heading">${escapeAlur(step.title)}</div>
        <div class="row-actions">
          <button type="button" class="btn-icon-action" title="Edit langkah" onclick="WP_Alur.openEditStepModal('${side}', '${step.id}')">${EDIT_ICON}</button>
        </div>
      </div>
      ${step.desc ? `<div class="alur-step-desc">${escapeAlur(step.desc)}</div>` : ''}
      ${step.docs.length > 0 ? `
      <div class="alur-step-subbox">
        <div class="alur-subbox-title ${side}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          ${escapeAlur(step.boxTitle || 'Dokumen:')}
        </div>
        <ul class="alur-doc-list">
          ${step.docs.map(doc => `<li>${escapeAlur(doc)}</li>`).join('')}
        </ul>
      </div>` : ''}
    </div>
  `).join('');

  return `
    <div class="alur-steps-grid">
      ${stepsHtml}
    </div>
    <button type="button" class="btn-add-dashed" onclick="WP_Alur.openAddStepModal('${side}')">+ Tambah Langkah</button>
  `;
}

function renderSectionHtml(side, number, title, headerIcon) {
  return `
    <div class="alur-section-wrapper">
      <div class="alur-section-indicator ${side}">${number}</div>
      <div class="alur-section-card ${side}">
        <div class="alur-section-header">
          <div class="alur-header-left">
            <div class="alur-avatar-badge ${side}">${escapeAlur(alurData[side].avatar)}</div>
            <div class="alur-section-title">${title}</div>
          </div>
          <div class="alur-header-icon">${headerIcon}</div>
        </div>
        ${renderStepsHtml(side)}
      </div>
    </div>
  `;
}

function renderAlurTimeline() {
  const container = document.getElementById('alur-timeline-container');
  if (!container || !alurData) return;

  const data = WP_Utils.initWeddingData();
  const eventType = WP_Utils.getEventType(data);
  const safeGroom = escapeAlur(data.couple.groom || 'Angga');
  const safeBride = escapeAlur(data.couple.bride || 'Ayu');
  const groomTitle = eventType === 'engagement' ? `Persiapan Pihak Laki-laki (${safeGroom})` : `Dari Calon Pengantin Laki-laki (${safeGroom})`;
  const brideTitle = eventType === 'engagement' ? `Persiapan Pihak Perempuan (${safeBride})` : `Dari Calon Pengantin Perempuan (${safeBride})`;

  const groomIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
  const brideIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;

  container.innerHTML = `
    <div class="alur-timeline-line"></div>
    ${renderSectionHtml('groom', 1, groomTitle, groomIcon)}
    ${renderSectionHtml('bride', 2, brideTitle, brideIcon)}
  `;
}

// ─── Edit Langkah ────────────────────────────────────────────────────────────
function stepFields(step = {}) {
  return [
    { name: 'title', label: 'Judul langkah', type: 'text', value: step.title, required: true, placeholder: 'Contoh: RT/RW — Kelurahan' },
    { name: 'desc', label: 'Keterangan', type: 'textarea', value: step.desc },
    { name: 'boxTitle', label: 'Judul daftar', type: 'text', value: step.boxTitle || 'Bawa dokumen:', placeholder: 'Contoh: Bawa dokumen:' },
    { name: 'docs', label: 'Daftar dokumen / kebutuhan', type: 'lines', value: step.docs || [] }
  ];
}

function getSideLabel(side) {
  const isEngagement = WP_Utils.getEventType() === 'engagement';
  if (side === 'groom') return isEngagement ? 'Pihak Laki-laki' : 'Calon Pengantin Laki-laki';
  return isEngagement ? 'Pihak Perempuan' : 'Calon Pengantin Perempuan';
}

function openAddStepModal(side) {
  WP_UI.openFormModal({
    title: `Tambah Langkah — ${getSideLabel(side)}`,
    submitLabel: 'Tambah',
    fields: stepFields(),
    onSubmit: values => {
      alurData[side].steps.push({ id: `${side}-${Date.now()}`, ...values });
      saveAlurData();
      renderAlurTimeline();
      WP_UI.showToast(`Langkah "${values.title}" ditambahkan.`, 'success');
    }
  });
}

function openEditStepModal(side, stepId) {
  const step = alurData[side].steps.find(s => s.id === stepId);
  if (!step) return;
  WP_UI.openFormModal({
    title: `Edit Langkah — ${getSideLabel(side)}`,
    fields: stepFields(step),
    onSubmit: values => {
      Object.assign(step, values);
      saveAlurData();
      renderAlurTimeline();
      WP_UI.showToast('Langkah diperbarui.', 'success');
    },
    onDelete: () => {
      alurData[side].steps = alurData[side].steps.filter(s => s.id !== stepId);
      saveAlurData();
      renderAlurTimeline();
      WP_UI.showToast(`Langkah "${step.title}" dihapus.`, 'info');
    },
    deleteConfirm: `Hapus langkah "${step.title}"?`
  });
}

async function resetToDefault() {
  if (!confirm('Kembalikan semua langkah alur ke bawaan? Semua perubahan di halaman ini akan hilang.')) return;
  alurData = normalizeAlur(getDefaultAlur());
  await saveAlurData();
  renderAlurTimeline();
  WP_UI.showToast('Alur dikembalikan ke bawaan.', 'info');
}

window.WP_Alur = {
  initAlurPernikahan,
  renderAlurTimeline,
  openAddStepModal,
  openEditStepModal,
  resetToDefault
};
