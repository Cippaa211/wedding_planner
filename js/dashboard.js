/**
 * Dashboard Logic & Dynamic Data Handlers
 */

let countdownInterval = null;

async function initDashboard() {
  // 1. Sync data from Supabase / Session
  const data = await WP_Auth.syncUserData();
  
  // 2. Re-render Header with updated names
  WP_Layout.renderHeader();

  // 3. Data per event_type: mulai dari data lokal, lalu ditimpa data Supabase bila tersedia
  const eventType = WP_Utils.getEventType(data);
  const view = {
    eventType,
    totalBudget: WP_Utils.getTotalBudget(data, eventType),
    expenses: getLocalExpenses(data, eventType),
    guests: WP_Utils.getStorage(WP_Utils.getScopedStorageKey(WP_Utils.STORAGE_KEYS.GUESTS, eventType)) || [],
    stages: await WP_Persiapan.getStagesSnapshot()
  };

  loadCoupleProfile(data.couple);
  startCountdown(data.couple.akadDate);
  renderDataSections(view);

  // 4. Fetch live budget & guests from Supabase if connected
  if (await fetchLiveSupabaseData(view)) renderDataSections(view);
}

function renderDataSections(view) {
  renderBudgetSummary({ totalBudget: view.totalBudget, expenses: view.expenses });
  renderGiftsSummary(summarizeGifts(view.guests));
  renderPriorities(buildPriorities(view));
}

function getLocalExpenses(data, eventType) {
  const saved = WP_Utils.getStorage(WP_Utils.getScopedStorageKey(WP_Utils.STORAGE_KEYS.EXPENSES, eventType));
  if (Array.isArray(saved)) return saved;
  // Contoh pengeluaran bawaan hanya untuk Wedding
  return eventType === 'wedding' ? (data.budget.expenses || []) : [];
}

/**
 * Fetch live data from Supabase if available. Mengembalikan true bila view diperbarui.
 */
async function fetchLiveSupabaseData(view) {
  const client = WP_Supabase.getClient();
  if (!WP_Supabase.isConfigured() || !client) return false;

  const session = WP_Auth.getCurrentSession();
  if (!session || !session.eventId) return false;

  let updated = false;
  try {
    const [{ data: expenses }, { data: guests }] = await Promise.all([
      client
        .from('budget_items')
        .select('*')
        .eq('event_id', session.eventId)
        .eq('event_type', view.eventType),
      client
        .from('guests')
        .select('gift_amount, rsvp_status')
        .eq('event_id', session.eventId)
        .eq('event_type', view.eventType)
    ]);

    if (expenses) {
      view.expenses = expenses.map(e => ({
        id: e.id,
        name: e.name,
        category: e.category,
        amount: Number(e.actual_amount) || Number(e.planned_amount) || 0,
        status: e.payment_status,
        date: e.expense_date
      }));
      updated = true;
    }
    if (guests) {
      view.guests = guests;
      updated = true;
    }
  } catch (err) {
    console.warn('Live fetch note:', err);
  }
  return updated;
}

function summarizeGifts(guests) {
  return {
    totalAmount: guests.reduce((sum, g) => sum + (Number(g.gift_amount) || 0), 0),
    totalGuests: guests.filter(g => Number(g.gift_amount) > 0).length
  };
}

/**
 * 1. Load Couple Profile Banner
 */
function loadCoupleProfile(couple) {
  const eventType = WP_Utils.getEventType({ couple });
  const coupleNamesEl = document.getElementById('couple-names');
  const coupleStatusEl = document.getElementById('couple-status');
  const coupleAkadDateEl = document.getElementById('couple-akad-date');
  const coupleResepsiDateEl = document.getElementById('couple-resepsi-date');
  const couplePhotoEl = document.getElementById('couple-photo');

  if (coupleNamesEl) coupleNamesEl.textContent = `${couple.bride} & ${couple.groom}`;
  
  if (coupleStatusEl) {
    if (eventType === 'engagement') {
      coupleStatusEl.textContent = couple.status === 'Menuju hari bahagia' ? '💐 Persiapan Acara Lamaran' : (couple.status || 'Persiapan Acara Lamaran');
    } else {
      coupleStatusEl.textContent = couple.status || '❤️ Menuju hari bahagia';
    }
  }

  if (coupleAkadDateEl) {
    const parentNode = coupleAkadDateEl.parentElement;
    if (parentNode && parentNode.childNodes[0]) {
      parentNode.childNodes[0].textContent = eventType === 'engagement' ? 'Acara Lamaran: ' : 'Akad: ';
    }
    coupleAkadDateEl.textContent = WP_Utils.formatShortDate(couple.akadDate);
  }

  if (coupleResepsiDateEl) {
    const parentNode = coupleResepsiDateEl.parentElement;
    if (parentNode) {
      if (eventType === 'engagement') {
        parentNode.style.display = 'none';
      } else {
        parentNode.style.display = 'block';
        if (parentNode.childNodes[0]) parentNode.childNodes[0].textContent = 'Resepsi: ';
      }
    }
    coupleResepsiDateEl.textContent = couple.resepsiDate ? WP_Utils.formatShortDate(couple.resepsiDate) : '-';
  }
  
  if (couplePhotoEl && couple.photoUrl) {
    couplePhotoEl.src = couple.photoUrl;
  }
}

/**
 * 2. Real-time Live Countdown
 */
function startCountdown(targetDate) {
  if (countdownInterval) clearInterval(countdownInterval);

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');
  const targetDateEl = document.getElementById('cd-target-date');

  const eventType = WP_Utils.getEventType();
  const cdSubtitleEl = document.querySelector('.countdown-subtitle');
  if (cdSubtitleEl) {
    cdSubtitleEl.textContent = eventType === 'engagement' ? 'Acara Lamaran / Engagement kami' : 'Hari bahagia pernikahan kami';
  }

  if (targetDateEl) {
    targetDateEl.textContent = WP_Utils.formatShortDate(targetDate);
  }

  function update() {
    const cd = WP_Utils.calculateCountdown(targetDate);
    if (daysEl) daysEl.textContent = cd.days;
    if (hoursEl) hoursEl.textContent = cd.hours;
    if (minsEl) minsEl.textContent = cd.minutes;
    if (secsEl) secsEl.textContent = cd.seconds;
  }

  update();
  countdownInterval = setInterval(update, 1000);
}

/**
 * 3. Render Budget Summary & SVG Donut Chart
 */
function renderBudgetSummary(budget) {
  const totalBudget = budget.totalBudget || 50000000;
  
  // Calculate total spent from expenses
  const totalSpent = (budget.expenses || []).reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const remainingBudget = Math.max(0, totalBudget - totalSpent);
  const spentPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const remainingPercent = Math.max(0, 100 - spentPercent);

  // Update center donut texts
  const donutCenterLabel = document.getElementById('donut-center-label');
  const donutCenterAmount = document.getElementById('donut-center-amount');
  const donutCenterTotal = document.getElementById('donut-center-total');

  if (donutCenterLabel) donutCenterLabel.textContent = 'Sisa Budget';
  if (donutCenterAmount) donutCenterAmount.textContent = WP_Utils.formatRupiah(remainingBudget);
  if (donutCenterTotal) donutCenterTotal.textContent = `TOTAL ${WP_Utils.formatRupiah(totalBudget)}`;

  // Update legend items
  const spentAmountEl = document.getElementById('budget-spent-amount');
  const remainingAmountEl = document.getElementById('budget-remaining-amount');

  if (spentAmountEl) {
    spentAmountEl.innerHTML = `${WP_Utils.formatRupiah(totalSpent)} <span class="legend-percent">(${spentPercent}%)</span>`;
  }
  if (remainingAmountEl) {
    remainingAmountEl.innerHTML = `${WP_Utils.formatRupiah(remainingBudget)} <span class="legend-percent">(${remainingPercent}%)</span>`;
  }

  // Update SVG Circle stroke-dasharray
  // Radius r = 60 => Circumference C = 2 * PI * 60 ~= 376.99
  const circleValue = document.getElementById('donut-circle-value');
  if (circleValue) {
    const circumference = 2 * Math.PI * 60;
    const spentStroke = (spentPercent / 100) * circumference;
    circleValue.style.strokeDasharray = `${spentStroke} ${circumference}`;
  }
}

/**
 * 4. Render Gifts Summary
 */
function renderGiftsSummary(gifts) {
  const totalGiftsEl = document.getElementById('gift-total-amount');
  const totalGuestsEl = document.getElementById('gift-total-guests');

  if (totalGiftsEl) {
    totalGiftsEl.textContent = WP_Utils.formatRupiah(gifts.totalAmount || 0);
  }
  if (totalGuestsEl) {
    totalGuestsEl.textContent = `${gifts.totalGuests || 0} Orang`;
  }
}

/**
 * 5. Prioritas Mendesak — disusun dari data nyata:
 *    - Checklist Peta Persiapan yang belum selesai (tahap aktif = urgent, tahap berikutnya = warning)
 *    - Pengeluaran berstatus "Belum bayar" / "DP" (warning)
 *    - Tamu yang belum konfirmasi RSVP (info)
 */
const MAX_PRIORITIES = 5;
const PRIORITY_RANK = { urgent: 0, warning: 1, info: 2 };

function buildPriorities({ stages, expenses, guests }) {
  // Checklist: dua tahap pertama yang belum selesai
  const pendingStages = (stages || []).filter(s => s.status !== 'selesai').slice(0, 2);
  const checklist = pendingStages.flatMap((stage, idx) =>
    stage.items
      .filter(item => !item.completed)
      .map(item => ({
        title: item.text,
        sub: `Peta Persiapan • ${stage.name}`,
        status: idx === 0 ? 'urgent' : 'warning'
      }))
  );

  // Budget: yang belum dibayar sama sekali didahulukan dari DP
  const unpaid = (expenses || [])
    .filter(e => e.status === 'Belum bayar' || e.status === 'DP')
    .sort((a, b) => (a.status === 'Belum bayar' ? 0 : 1) - (b.status === 'Belum bayar' ? 0 : 1))
    .map(e => ({
      title: `${e.status === 'DP' ? 'Pelunasan' : 'Pembayaran'} ${e.name}`,
      sub: `Budget • ${e.category || 'Lain-lain'} • ${WP_Utils.formatRupiah(e.amount)} (${e.status})`,
      status: 'warning'
    }));

  const pendingRsvp = (guests || []).filter(g => (g.rsvp_status || 'pending') === 'pending').length;
  const rsvp = pendingRsvp > 0
    ? [{ title: `${pendingRsvp} tamu belum konfirmasi kehadiran`, sub: 'Tamu & Hadiah • RSVP', status: 'info' }]
    : [];

  // Setiap sumber mendapat tempat (RSVP 1, budget maks 2), checklist mengisi sisa slot,
  // lalu slot yang masih kosong diisi sisa pembayaran
  const rsvpSlots = rsvp.slice(0, 1);
  const paymentSlots = unpaid.slice(0, 2);
  const checklistSlots = checklist.slice(0, MAX_PRIORITIES - rsvpSlots.length - paymentSlots.length);
  const picked = [...checklistSlots, ...paymentSlots, ...rsvpSlots];
  const extraPayments = unpaid.slice(2, 2 + (MAX_PRIORITIES - picked.length));

  return [...picked, ...extraPayments]
    .sort((a, b) => PRIORITY_RANK[a.status] - PRIORITY_RANK[b.status]);
}

function renderPriorities(priorities) {
  const prioritiesContainer = document.getElementById('priorities-list');
  if (!prioritiesContainer) return;

  const listToRender = priorities.length > 0
    ? priorities
    : [{ title: 'Semua tugas & pembayaran sudah beres 🎉', sub: 'Tidak ada yang perlu segera ditindaklanjuti', status: 'done' }];

  prioritiesContainer.innerHTML = listToRender.map(item => `
    <div class="priority-item">
      <div>
        <div class="priority-title">${escapeHtml(item.title)}</div>
        <div class="priority-sub">${escapeHtml(item.sub)}</div>
      </div>
      <span class="badge ${getBadgeClass(item.status)}">${getBadgeText(item.status)}</span>
    </div>
  `).join('');
}

function getBadgeClass(status) {
  switch (status) {
    case 'urgent': return 'badge-red';
    case 'warning': return 'badge-yellow';
    case 'info': return 'badge-gray';
    case 'done': return 'badge-green';
    default: return 'badge-gray';
  }
}

function getBadgeText(status) {
  switch (status) {
    case 'urgent': return 'Mendesak';
    case 'warning': return 'Perhatian';
    case 'info': return 'Tercatat';
    case 'done': return 'Selesai';
    default: return 'Pending';
  }
}

// Attach to window
window.WP_Dashboard = {
  initDashboard,
  loadCoupleProfile,
  startCountdown,
  renderBudgetSummary,
  renderGiftsSummary,
  buildPriorities,
  renderPriorities
};
