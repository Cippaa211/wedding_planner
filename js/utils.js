/**
 * Utility functions for Wedding Planner
 */

const STORAGE_KEYS = {
  SESSION: 'wp_session',
  WEDDING_DATA: 'wp_wedding_data',
  EXPENSES: 'wp_expenses',
  SESERAHAN: 'wp_seserahan',
  CHECKLIST_KUA: 'wp_checklist_kua',
  GUESTS: 'wp_guests',
  SAVINGS: 'wp_savings', // mode Lokal/Demo; mode Cloud memakai tabel savings_entries
  OWNER: 'wp_owner' // id user pemilik data lokal (cache) saat ini
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
    photoUrl: 'assets/images/couple_kita.jpeg'
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
  }
};

// Total budget awal per event_type (kolom wedding_events.total_budget / engagement_total_budget)
const DEFAULT_TOTAL_BUDGET = {
  wedding: 50000000,
  engagement: 15000000
};

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
 * ISO / timestamptz -> nilai <input type="datetime-local"> dalam zona waktu perangkat
 * (mis. "2027-04-07T01:00:00+00:00" -> "2027-04-07T08:00" di WIB)
 */
function toDateTimeLocalValue(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Nilai <input type="datetime-local"> (waktu lokal tanpa zona) -> ISO UTC,
 * agar kolom timestamptz tidak menganggapnya sebagai UTC.
 */
function fromDateTimeLocalValue(value) {
  if (!value) return '';
  const date = new Date(value);
  return isNaN(date.getTime()) ? '' : date.toISOString();
}

/**
 * Tanggal hari ini (YYYY-MM-DD) menurut zona waktu perangkat.
 * toISOString() memakai UTC, sehingga sebelum 07.00 WIB tanggalnya masih kemarin.
 */
function todayLocalDate() {
  return toDateTimeLocalValue(new Date()).slice(0, 10);
}

/** 'YYYY-MM-DD' -> Date lokal (new Date('YYYY-MM-DD') dibaca sebagai UTC) */
function parseLocalDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : new Date(value);
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
 * Hapus seluruh data aplikasi di localStorage (key wp_* dan engagement_wp_*),
 * agar data satu akun tidak terbawa ke akun lain di perangkat yang sama.
 */
function clearAppStorage() {
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith('wp_') || key.startsWith('engagement_wp_'))
      .forEach(key => localStorage.removeItem(key));
  } catch (e) {
    console.warn('Error clearing localStorage:', e);
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

/**
 * Key localStorage yang dipisah per event_type agar data Wedding dan Engagement
 * tidak saling menimpa. Wedding memakai key asli (kompatibel dengan data lama).
 */
function getScopedStorageKey(key, eventType) {
  const type = eventType || getEventType();
  if (type === 'engagement' && !key.startsWith('engagement_')) {
    return `engagement_${key}`;
  }
  return key;
}

/**
 * Total budget dipisah per event_type.
 * Wedding: data.budget.totalBudget  <-> kolom total_budget
 * Engagement: data.budget.engagementTotalBudget <-> kolom engagement_total_budget
 */
function getTotalBudgetField(eventType) {
  return eventType === 'engagement'
    ? { local: 'engagementTotalBudget', column: 'engagement_total_budget' }
    : { local: 'totalBudget', column: 'total_budget' };
}

function getTotalBudget(data, eventType) {
  const type = eventType || getEventType(data);
  const value = Number(data.budget?.[getTotalBudgetField(type).local]);
  return value > 0 ? value : DEFAULT_TOTAL_BUDGET[type] || DEFAULT_TOTAL_BUDGET.wedding;
}

function setTotalBudget(data, amount, eventType) {
  const type = eventType || getEventType(data);
  data.budget[getTotalBudgetField(type).local] = amount;
}

function getEventTypeName(type) {
  return type === 'engagement' ? 'Lamaran / Engagement' : 'Pernikahan (Wedding)';
}

window.WP_Utils = {
  STORAGE_KEYS,
  DEFAULT_WEDDING_DATA,
  BUDGET_CATEGORIES,
  formatRupiah,
  formatNumber,
  formatDateIndo,
  formatShortDate,
  calculateCountdown,
  toDateTimeLocalValue,
  fromDateTimeLocalValue,
  todayLocalDate,
  parseLocalDate,
  getStorage,
  setStorage,
  clearAppStorage,
  initWeddingData,
  getEventType,
  getScopedStorageKey,
  DEFAULT_TOTAL_BUDGET,
  getTotalBudgetField,
  getTotalBudget,
  setTotalBudget,
  getEventTypeName
};
