/**
 * UI Utilities and Components for Wedding Planner
 */

function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let icon = 'ℹ️';
  let borderColor = 'var(--primary)';
  
  if (type === 'success') {
    icon = '✅';
    borderColor = 'var(--accent-green)';
  } else if (type === 'error') {
    icon = '⚠️';
    borderColor = 'var(--status-red-text)';
  }

  toast.style.borderLeftColor = borderColor;
  const iconEl = document.createElement('span');
  const messageEl = document.createElement('span');
  iconEl.textContent = icon;
  messageEl.textContent = message;
  toast.append(iconEl, messageEl);

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

/**
 * Toggle Mobile Sidebar Drawer
 */
function toggleMobileSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  
  if (sidebar && overlay) {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
  }
}

function closeMobileSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  
  if (sidebar && overlay) {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  }
}

window.WP_UI = {
  showToast,
  toggleMobileSidebar,
  closeMobileSidebar
};
