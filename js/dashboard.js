/**
 * Dashboard Logic & Dynamic Data Handlers
 */

let countdownInterval = null;

async function initDashboard() {
  // 1. Sync data from Supabase / Session
  const data = await WP_Auth.syncUserData();
  
  // 2. Re-render Header with updated names
  WP_Layout.renderHeader();

  // 3. Render Dashboard sections
  loadCoupleProfile(data.couple);
  startCountdown(data.couple.akadDate);
  renderBudgetSummary(data.budget);
  renderGiftsSummary(data.gifts);
  renderPriorities(data.priorities);

  // 4. Fetch live budget & gifts from Supabase if connected
  await fetchLiveSupabaseData(data);
}

/**
 * Fetch live data from Supabase if available
 */
async function fetchLiveSupabaseData(localData) {
  const client = WP_Supabase.getClient();
  if (!WP_Supabase.isConfigured() || !client) return;

  const session = WP_Auth.getCurrentSession();
  if (!session || !session.eventId) return;

  try {
    // 1. Fetch live budget items
    const { data: expenses } = await client
      .from('budget_items')
      .select('*')
      .eq('event_id', session.eventId);

    if (expenses && expenses.length > 0) {
      localData.budget.expenses = expenses.map(e => ({
        id: e.id,
        name: e.name,
        category: e.category,
        amount: Number(e.actual_amount) || Number(e.planned_amount) || 0,
        status: e.payment_status,
        date: e.expense_date
      }));
      renderBudgetSummary(localData.budget);
    }

    // 2. Fetch live gifts
    const { data: guests } = await client
      .from('guests')
      .select('gift_amount')
      .eq('event_id', session.eventId);

    if (guests && guests.length > 0) {
      const totalAmount = guests.reduce((sum, g) => sum + (Number(g.gift_amount) || 0), 0);
      const giftGuestsCount = guests.filter(g => Number(g.gift_amount) > 0).length;
      localData.gifts.totalAmount = totalAmount;
      localData.gifts.totalGuests = giftGuestsCount;
      renderGiftsSummary(localData.gifts);
    }
  } catch (err) {
    console.warn('Live fetch note:', err);
  }
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
    coupleStatusEl.textContent = couple.status || '❤️ Menuju hari bahagia';
  }
  
  if (coupleAkadDateEl) {
    const parentNode = coupleAkadDateEl.parentElement;
    if (parentNode) {
      const labelText = eventType === 'engagement' ? 'Acara Lamaran: ' : 'Akad: ';
      if (parentNode.childNodes[0]) parentNode.childNodes[0].textContent = labelText;
    if (parentNode && parentNode.childNodes[0]) {
      parentNode.childNodes[0].textContent = 'Akad: ';
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
      parentNode.style.display = 'block';
      if (parentNode.childNodes[0]) parentNode.childNodes[0].textContent = 'Resepsi: ';
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
    cdSubtitleEl.textContent = 'Hari bahagia pernikahan kami';
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
  let totalSpent = 0;
  if (budget.expenses && budget.expenses.length > 0) {
    totalSpent = budget.expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  } else {
    totalSpent = budget.totalExpenses || 8850000;
  }

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
 * 5. Render Priorities List
 */
function renderPriorities(priorities) {
  const prioritiesContainer = document.getElementById('priorities-list');
  if (!prioritiesContainer) return;

  const eventType = WP_Utils.getEventType();
  const listToRender = (eventType === 'engagement') 
    ? (WP_Utils.DEFAULT_ENGAGEMENT_PRIORITIES || priorities)
    : (priorities || WP_Utils.DEFAULT_WEDDING_DATA.priorities);
  const listToRender = priorities || WP_Utils.DEFAULT_WEDDING_DATA.priorities;

  prioritiesContainer.innerHTML = listToRender.map(item => `
    <div class="priority-item">
      <div>
        <div class="priority-title">${item.title}</div>
        <div class="priority-sub">${item.sub}</div>
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
  renderPriorities
};
