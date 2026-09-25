/**
 * Layout Manager: Sidebar Navigation, Header, and Responsive Drawer
 */

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid', href: 'index.html' },
  { id: 'persiapan', label: 'Peta Persiapan', icon: 'map-pin', href: 'persiapan.html' },
  { id: 'alur', label: 'Alur Acara', icon: 'git-branch', href: 'alur-pernikahan.html' },
  { id: 'alur', label: 'Alur Pernikahan', icon: 'git-branch', href: 'alur-pernikahan.html' },
  { id: 'budget', label: 'Budget', icon: 'wallet', href: 'budget.html' },
  { id: 'tamu', label: 'Tamu & Hadiah', icon: 'users', href: 'tamu-hadiah.html' },
  { id: 'akad', label: 'Acara', icon: 'gem', href: 'akad-resepsi.html' },
  { id: 'akad', label: 'Akad & Resepsi', icon: 'gem', href: 'akad-resepsi.html' },
  { id: 'seserahan', label: 'Seserahan', icon: 'gift', href: 'seserahan.html' },
  { id: 'akun', label: 'Akun', icon: 'user', href: 'akun.html' }
];

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

function getNavSvg(iconName) {
  switch (iconName) {
    case 'grid':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`;
    case 'map-pin':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
    case 'git-branch':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`;
    case 'wallet':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>`;
    case 'users':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
    case 'gem':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>`;
    case 'gift':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>`;
    case 'user':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    default:
      return '';
  }
}

function renderSidebar(activeId) {
  const sidebarEl = document.getElementById('sidebar-container');
  if (!sidebarEl) return;

  const navHtml = NAV_ITEMS.map(item => {
    const isActive = item.id === activeId;
    return `
      <a href="${item.href}" class="nav-item ${isActive ? 'active' : ''}">
        <span class="nav-icon">${getNavSvg(item.icon)}</span>
        <span>${item.label}</span>
      </a>
    `;
  }).join('');

  sidebarEl.innerHTML = `
    <aside class="sidebar">
      <a href="index.html" class="brand-logo">
        <div class="brand-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </div>
        <span class="brand-name">Wedding Planner</span>
      </a>
      <nav class="sidebar-nav">
        ${navHtml}
      </nav>
      <div class="sidebar-footer">
        <button type="button" class="btn-sidebar-logout" onclick="WP_Layout.confirmLogout()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Keluar</span>
        </button>
      </div>
    </aside>
    <div class="sidebar-overlay" onclick="WP_UI.closeMobileSidebar()"></div>
  `;
}

function renderHeader() {
  const headerEl = document.getElementById('header-container');
  if (!headerEl) return;

  const data = WP_Utils.initWeddingData();
  const eventType = WP_Utils.getEventType(data);
  const bride = data.couple.bride || 'Ayu';
  const groom = data.couple.groom || 'Angga';
  const todayStr = WP_Utils.formatDateIndo(new Date());

  const eventBadgeHtml = eventType === 'engagement'
    ? `<button class="btn-event-switcher" onclick="WP_Layout.switchEventType('wedding')" title="Klik untuk beralih ke Wedding Planner">
        <span>💐 Engagement</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
       </button>`
    : `<button class="btn-event-switcher" onclick="WP_Layout.switchEventType('engagement')" title="Klik untuk beralih ke Engagement Planner">
        <span>💍 Wedding</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
       </button>`;

  headerEl.innerHTML = `
    <header class="top-header">
      <div class="flex items-center gap-3">
        <button class="btn-mobile-menu" onclick="WP_UI.toggleMobileSidebar()" aria-label="Toggle Menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
        <div class="header-greeting">
          <div class="flex items-center gap-2">
            <h1>Halo, ${escapeHtml(bride)} & ${escapeHtml(groom)} 👋</h1>
            ${eventBadgeHtml}
          </div>
          <h1>Halo, ${escapeHtml(bride)} & ${escapeHtml(groom)} 👋</h1>
          <p>Semoga hari bahagiamu berjalan lancar • ${todayStr}</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn-notification" onclick="WP_UI.showToast('Tidak ada notifikasi baru', 'info')" title="Notifikasi">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          <span class="badge-dot"></span>
        </button>
        <div class="header-user-menu" id="header-user-menu">
          <div class="user-avatar" onclick="WP_Layout.toggleUserMenu(event)" title="Akun & Profil">
            <img src="${data.couple.avatarUrl}" alt="Avatar" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'%23E11D48\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'><circle cx=\\'12\\' cy=\\'8\\' r=\\'5\\'/>  <path d=\\'M20 21a8 8 0 0 0-16 0\\'/></svg>';">
          </div>
          <div class="user-dropdown" id="user-dropdown">
            <div class="user-dropdown-info">
              <div class="user-dropdown-name">${escapeHtml(bride)} &amp; ${escapeHtml(groom)}</div>
              <div class="user-dropdown-role">Pasangan (${WP_Utils.getEventTypeName(eventType)})</div>
              <div class="user-dropdown-role">Calon Pengantin</div>
            </div>
            <hr class="user-dropdown-divider">
            <a href="akun.html" class="user-dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
              Akun &amp; Profil
            </a>
            <button type="button" class="user-dropdown-item logout" onclick="WP_Layout.confirmLogout()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Keluar dari Akun
            </button>
          </div>
        </div>
      </div>
    </header>
  `;
}

async function switchEventType(newType) {
  const allowedTypes = ['wedding', 'engagement'];
  if (!allowedTypes.includes(newType)) {
    if (window.WP_UI?.showToast) WP_UI.showToast('Jenis acara tidak valid.', 'error');
    return;
  }

  const client = WP_Supabase.getClient();
  const session = WP_Auth.getCurrentSession();
  const isCloud = WP_Supabase.isConfigured() && client && session?.authProvider === 'supabase';

  try {
    if (isCloud) {
      if (!session?.eventId) {
        throw new Error('Event aktif tidak ditemukan. Silakan sinkronkan ulang data acara.');
      }

      const { data: updatedRows, error } = await client
        .from('wedding_events')
        .update({ event_type: newType })
        .eq('id', session.eventId)
        .select();

      if (error) {
        throw error;
      }
      if (!updatedRows || updatedRows.length === 0) {
        throw new Error('Acara tidak ditemukan di server atau Anda tidak memiliki izin untuk memperbarui.');
      }
    }

    // Perbarui LocalStorage & Session HANYA setelah Supabase berhasil (atau dalam mode Lokal)
    const data = WP_Utils.initWeddingData();
    data.couple.eventType = newType;
    WP_Utils.setStorage(WP_Utils.STORAGE_KEYS.WEDDING_DATA, data);

    if (session) {
      session.eventType = newType;
      WP_Auth.setSession(session);
    }

    if (window.WP_UI?.showToast) {
      WP_UI.showToast(`Jenis acara berhasil diubah ke ${WP_Utils.getEventTypeName(newType)}!`, 'success');
    }

    setTimeout(() => window.location.reload(), 400);
  } catch (err) {
    console.error('Gagal mengubah event type:', err);
    if (window.WP_UI?.showToast) {
      WP_UI.showToast(`Gagal mengubah jenis acara: ${err.message}`, 'error');
    }
  }
}

function toggleUserMenu(e) {
  e.stopPropagation();
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown) dropdown.classList.toggle('open');
}

function closeUserMenu() {
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown) dropdown.classList.remove('open');
}

function confirmLogout() {
  closeUserMenu();
  if (confirm('Apakah Anda yakin ingin keluar dari akun?')) {
    WP_Auth.logout();
  }
}

// Close dropdown when clicking outside
document.addEventListener('click', () => { closeUserMenu(); });

window.WP_Layout = {
  renderSidebar,
  renderHeader,
  switchEventType,
  toggleUserMenu,
  closeUserMenu,
  confirmLogout
};
