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

  renderAlurTimeline();
}

function renderAlurTimeline() {
  const container = document.getElementById('alur-timeline-container');
  if (!container) return;

  const data = WP_Utils.initWeddingData();
  const eventType = WP_Utils.getEventType(data);
  const brideName = data.couple.bride || 'Ayu';
  const groomName = data.couple.groom || 'Angga';

  const sourceData = eventType === 'engagement' ? ALUR_ENGAGEMENT_DATA : ALUR_DATA;
  const safeGroom = escapeHtml(groomName);
  const safeBride = escapeHtml(brideName);
  const groomTitle = eventType === 'engagement' ? `Persiapan Pihak Laki-laki (${safeGroom})` : `Dari Calon Pengantin Laki-laki (${safeGroom})`;
  const brideTitle = eventType === 'engagement' ? `Persiapan Pihak Perempuan (${safeBride})` : `Dari Calon Pengantin Perempuan (${safeBride})`;

  const groomSectionHtml = `
    <div class="alur-section-wrapper">
      <div class="alur-section-indicator groom">1</div>
      <div class="alur-section-card groom">
        <div class="alur-section-header">
          <div class="alur-header-left">
            <div class="alur-avatar-badge groom">${sourceData.groom.avatar}</div>
            <div class="alur-section-title">${groomTitle}</div>
          </div>
          <div class="alur-header-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
        </div>

        <div class="alur-steps-grid">
          ${sourceData.groom.steps.map(step => `
            <div class="alur-step-item">
              <div class="alur-step-top">
                <div class="alur-step-number groom">${step.number}</div>
                <div class="alur-step-heading">${step.title}</div>
              </div>
              <div class="alur-step-desc">${step.desc}</div>
              <div class="alur-step-subbox">
                <div class="alur-subbox-title groom">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                  ${step.boxTitle}
                </div>
                <ul class="alur-doc-list">
                  ${step.docs.map(doc => `<li>${doc}</li>`).join('')}
                </ul>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  const brideSectionHtml = `
    <div class="alur-section-wrapper">
      <div class="alur-section-indicator bride">2</div>
      <div class="alur-section-card bride">
        <div class="alur-section-header">
          <div class="alur-header-left">
            <div class="alur-avatar-badge bride">${sourceData.bride.avatar}</div>
            <div class="alur-section-title">${brideTitle}</div>
          </div>
          <div class="alur-header-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
        </div>

        <div class="alur-steps-grid">
          ${sourceData.bride.steps.map(step => `
            <div class="alur-step-item">
              <div class="alur-step-top">
                <div class="alur-step-number bride">${step.number}</div>
                <div class="alur-step-heading">${step.title}</div>
              </div>
              <div class="alur-step-desc">${step.desc}</div>
              <div class="alur-step-subbox">
                <div class="alur-subbox-title bride">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                  ${step.boxTitle}
                </div>
                <ul class="alur-doc-list">
                  ${step.docs.map(doc => `<li>${doc}</li>`).join('')}
                </ul>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  container.innerHTML = `
    <div class="alur-timeline-line"></div>
    ${groomSectionHtml}
    ${brideSectionHtml}
  `;
}

window.WP_Alur = {
  initAlurPernikahan,
  renderAlurTimeline
};

