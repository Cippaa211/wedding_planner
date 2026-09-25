/**
 * Utility functions for Wedding Planner
 */

const STORAGE_KEYS = {
  SESSION: 'wp_session',
  WEDDING_DATA: 'wp_wedding_data',
  EXPENSES: 'wp_expenses',
  SESERAHAN: 'wp_seserahan',
  CHECKLIST_KUA: 'wp_checklist_kua',
  GUESTS: 'wp_guests'
};

// Default seed data matching visual mockups
const DEFAULT_WEDDING_DATA = {
  couple: {
    eventType: 'wedding', // 'wedding' | 'engagement'
    groom: 'Angga',
    bride: 'Ayu',
    fullNameGroom: 'Angga Pratama',
    fullNameBride: 'Ayu Lestari',
    hashtag: '#AyuAnggaForever',
    status: 'Menuju hari bahagia',
    akadDate: '2027-04-07T08:00:00',
    akadLocation: 'Masjid Agung Al-Barkah, Bekasi',
    resepsiDate: '2027-04-07T11:00:00',
    resepsiLocation: 'Grand Ballroom Hotel Santika',
    photoUrl: 'assets/images/couple_kita.jpeg',
    avatarUrl: 'assets/images/avatar-placeholder.jpg'
  },
  budget: {
    totalBudget: 50000000,
    totalExpenses: 8850000, // Matching slide 1 / 4
    expenses: [
      { id: '1', date: '2026-09-16', name: 'Prewedding', category: 'Dokumentasi', amount: 850000, status: 'Lunas' },
      { id: '2', date: '2026-09-16', name: 'DP Venue', category: 'Venue', amount: 6000000, status: 'DP' },
      { id: '3', date: '2026-09-16', name: 'DP Makeup', category: 'Akad', amount: 2000000, status: 'DP' },
      { id: '4', date: '2026-09-16', name: 'Sajadah', category: 'Seserahan', amount: 88000, status: 'Lunas' },
      { id: '5', date: '2026-09-16', name: 'Mukena', category: 'Seserahan', amount: 185000, status: 'Lunas' }
    ]
  },
  gifts: {
    totalAmount: 0,
    totalGuests: 0,
    items: []
  },
  priorities: [
    { id: '1', title: 'Lengkapi Berkas Surat N1 - N5 Kelurahan', sub: 'Administrasi KUA • Tenggat 14 hari', status: 'urgent' },
    { id: '2', title: 'Pemeriksaan Kesehatan & Suntik TT di Puskesmas', sub: 'Calon Pengantin Perempuan', status: 'urgent' },
    { id: '3', title: 'Pelunasan DP Vendor Fotografi & Dokumentasi', sub: 'Budget • Jatuh tempo 30 Sept 2026', status: 'warning' },
    { id: '4', title: 'Finalisasi Daftar Belanja Seserahan Alat Ibadah', sub: 'Seserahan • 2 item belum ditentukan harga', status: 'info' },
    { id: '5', title: 'Penyusunan Draft Daftar Tamu Keluarga CPP & CPW', sub: 'Tamu & Hadiah • Target 300 Undangan', status: 'info' }
  ]
};

const DEFAULT_ENGAGEMENT_PRIORITIES = [
  { id: '1', title: 'Konfirmasi Tanggal & Tempat Acara Lamaran', sub: 'Persiapan Lamaran • Tenggat 7 hari', status: 'urgent' },
  { id: '2', title: 'Finalisasi Daftar Belanja Hantaran & Cincin Lamaran', sub: 'Hantaran / Seserahan • Tenggat 14 hari', status: 'urgent' },
  { id: '3', title: 'Booking Vendor Dekorasi & MUA Acara Lamaran', sub: 'Budget • Jatuh tempo 25 Sept 2026', status: 'warning' },
  { id: '4', title: 'Penyusunan Susunan Acara & Utusan Jur Bicara', sub: 'Acara Lamaran • Koordinasi keluarga', status: 'info' },
  { id: '5', title: 'Konfirmasi Undangan Tamu Keluarga Inti', sub: 'Tamu & Hadiah • Target 50 Undangan', status: 'info' }
];

const BUDGET_CATEGORIES = {
  wedding: ['Venue', 'Akad', 'Resepsi', 'Catering', 'MUA', 'Dokumentasi', 'Seserahan', 'Lain-lain'],
  engagement: ['Venue/Lokasi', 'MUA & Busana', 'Dekorasi', 'Catering', 'Hantaran/Seserahan', 'Dokumentasi', 'Ring/Cincin', 'Lain-lain']
};

/**
 * Format number to Indonesian Rupiah (e.g. Rp 50.000.000)
 */
function formatRupiah(number) {
  if (number === null || number === undefined || isNaN(number)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
}

/**
 * Format raw number string with dots (e.g. 50.000.000)
 */
function formatNumber(number) {
  if (!number && number !== 0) return '0';
  return new Intl.NumberFormat('id-ID').format(number);
}

/**
 * Format date to full Indonesian representation (e.g. Rabu, 16 September 2026)
 */
function formatDateIndo(dateInput) {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '-';
  
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}, ${day} ${monthName} ${year}`;
}

/**
 * Short date format (e.g. 7 Apr 2027)
 */
function formatShortDate(dateInput) {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '-';

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Calculate countdown remaining time until target date
 */
function calculateCountdown(targetDateInput) {
  const targetDate = new Date(targetDateInput).getTime();
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    isPassed: false
  };
}

/**
 * Storage Helpers
 */
function getStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Error reading localStorage ${key}:`, e);
    return defaultValue;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing localStorage ${key}:`, e);
  }
}

/**
 * Initialize Default Data
 */
function initWeddingData() {
  let data = getStorage(STORAGE_KEYS.WEDDING_DATA);
  if (!data) {
    data = JSON.parse(JSON.stringify(DEFAULT_WEDDING_DATA));
    setStorage(STORAGE_KEYS.WEDDING_DATA, data);
  } else {
    if (!data.couple.eventType) {
      data.couple.eventType = 'wedding';
      setStorage(STORAGE_KEYS.WEDDING_DATA, data);
    }
    if (data.couple?.photoUrl === 'assets/images/couple-placeholder.jpg') {
      data.couple.photoUrl = 'assets/images/couple_kita.jpeg';
      setStorage(STORAGE_KEYS.WEDDING_DATA, data);
    }
  }
  return data;
}

function getEventType(data) {
  const currentData = data || initWeddingData();
  return currentData.couple?.eventType || 'wedding';
}

function getEventTypeName(type) {
  return type === 'engagement' ? 'Lamaran / Engagement' : 'Pernikahan (Wedding)';
}

window.WP_Utils = {
  STORAGE_KEYS,
  DEFAULT_WEDDING_DATA,
  DEFAULT_ENGAGEMENT_PRIORITIES,
  BUDGET_CATEGORIES,
  formatRupiah,
  formatNumber,
  formatDateIndo,
  formatShortDate,
  calculateCountdown,
  getStorage,
  setStorage,
  initWeddingData,
  getEventType,
  getEventTypeName
  initWeddingData
};
