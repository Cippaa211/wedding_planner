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
function setMobileSidebar(open) {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (!sidebar || !overlay) return;

  sidebar.classList.toggle('open', open);
  overlay.classList.toggle('open', open);
  document.querySelector('.btn-mobile-menu')?.setAttribute('aria-expanded', String(open));
}

function toggleMobileSidebar() {
  setMobileSidebar(!document.querySelector('.sidebar')?.classList.contains('open'));
}

function closeMobileSidebar() {
  setMobileSidebar(false);
}

/**
 * Perilaku global untuk semua modal (.modal-overlay) dan drawer menu:
 * - Esc menutup drawer / modal teratas
 * - Tap di area gelap di luar dialog menutup modal
 */
function closeOverlay(overlay) {
  if (overlay.id === 'wp-form-modal') {
    closeFormModal();
  } else {
    overlay.classList.remove('open');
  }
}

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (document.querySelector('.sidebar.open')) {
    closeMobileSidebar();
    return;
  }
  const openModals = document.querySelectorAll('.modal-overlay.open');
  if (openModals.length) closeOverlay(openModals[openModals.length - 1]);
});

document.addEventListener('click', e => {
  if (e.target.classList?.contains('modal-overlay') && e.target.classList.contains('open')) {
    closeOverlay(e.target);
  }
});

/**
 * Modal form generik yang dipakai semua halaman untuk tambah / edit / hapus.
 *
 * WP_UI.openFormModal({
 *   title, submitLabel,
 *   fields: [{ name, label, type, value, required, placeholder, hint, options }],
 *   onSubmit: async (values) => { ... return false untuk membiarkan modal tetap terbuka },
 *   onDelete: async () => { ... },            // opsional: menampilkan tombol Hapus
 *   deleteConfirm: 'Hapus item ini?'           // opsional
 * })
 *
 * type: 'text' | 'textarea' | 'number' | 'date' | 'time' | 'url' | 'select'
 *       'lines' = textarea satu item per baris, dikembalikan sebagai array
 * Semua isi dibuat lewat DOM (textContent/value), sehingga aman dari HTML injection.
 */
let formModalState = null;

function ensureFormModal() {
  let overlay = document.getElementById('wp-form-modal');
  if (overlay) return overlay;

  overlay = document.createElement('div');
  overlay.id = 'wp-form-modal';
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="wp-form-modal-title">
      <div class="modal-header">
        <h3 class="modal-title" id="wp-form-modal-title"></h3>
        <button type="button" class="btn-table-action" data-action="close" aria-label="Tutup">✕</button>
      </div>
      <form novalidate>
        <div class="modal-body"></div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline btn-danger-outline" data-action="delete">Hapus</button>
          <div style="flex: 1;"></div>
          <button type="button" class="btn btn-outline" data-action="close">Batal</button>
          <button type="submit" class="btn btn-primary" data-action="submit">Simpan</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(overlay);

  // Klik backdrop & tombol Esc ditangani listener global (closeOverlay)
  overlay.addEventListener('click', e => {
    if (e.target.closest('[data-action="close"]')) closeFormModal();
    if (e.target.closest('[data-action="delete"]')) handleFormModalDelete();
  });
  overlay.querySelector('form').addEventListener('submit', handleFormModalSubmit);
  return overlay;
}

function buildFormField(field, index) {
  const group = document.createElement('div');
  group.className = 'form-group';
  group.style.marginBottom = '0';

  const inputId = `wp-form-field-${index}`;
  const label = document.createElement('label');
  label.className = 'form-label';
  label.htmlFor = inputId;
  label.textContent = field.label;
  if (field.required) {
    const star = document.createElement('span');
    star.style.color = 'var(--primary)';
    star.textContent = ' *';
    label.appendChild(star);
  }
  group.appendChild(label);

  let input;
  if (field.type === 'select') {
    input = document.createElement('select');
    (field.options || []).forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label;
      input.appendChild(option);
    });
  } else if (field.type === 'textarea' || field.type === 'lines') {
    input = document.createElement('textarea');
    input.rows = field.type === 'lines' ? 6 : 3;
  } else {
    input = document.createElement('input');
    input.type = field.type || 'text';
    if (field.type === 'number') input.min = '0';
  }

  input.id = inputId;
  input.name = field.name;
  input.className = 'form-control';
  if (field.placeholder) input.placeholder = field.placeholder;
  if (field.required) input.required = true;

  const value = field.value ?? '';
  input.value = field.type === 'lines' && Array.isArray(value) ? value.join('\n') : value;
  group.appendChild(input);

  const hintText = field.hint || (field.type === 'lines' ? 'Satu item per baris. Baris kosong diabaikan.' : '');
  if (hintText) {
    const hint = document.createElement('p');
    hint.className = 'form-hint';
    hint.textContent = hintText;
    group.appendChild(hint);
  }
  return group;
}

function openFormModal(options) {
  const overlay = ensureFormModal();
  formModalState = options;

  overlay.querySelector('#wp-form-modal-title').textContent = options.title || 'Edit';
  overlay.querySelector('[data-action="submit"]').textContent = options.submitLabel || 'Simpan';
  overlay.querySelector('[data-action="delete"]').style.display = options.onDelete ? 'inline-flex' : 'none';

  const body = overlay.querySelector('.modal-body');
  body.replaceChildren(...options.fields.map(buildFormField));

  overlay.classList.add('open');
  const firstInput = body.querySelector('input, textarea, select');
  if (firstInput) setTimeout(() => firstInput.focus(), 50);
}

function closeFormModal() {
  const overlay = document.getElementById('wp-form-modal');
  if (overlay) overlay.classList.remove('open');
  formModalState = null;
}

function readFormModalValues() {
  const overlay = document.getElementById('wp-form-modal');
  const values = {};
  formModalState.fields.forEach(field => {
    const el = overlay.querySelector(`[name="${field.name}"]`);
    let value = el ? el.value : '';
    if (field.type === 'lines') {
      value = value.split('\n').map(s => s.trim()).filter(Boolean);
    } else if (field.type === 'number') {
      value = value === '' ? null : Number(value);
    } else if (typeof value === 'string') {
      value = value.trim();
    }
    values[field.name] = value;
  });
  return values;
}

async function handleFormModalSubmit(e) {
  e.preventDefault();
  if (!formModalState) return;

  // Validasi field wajib (termasuk yang hanya berisi spasi)
  const values = readFormModalValues();
  const missing = formModalState.fields.find(f => {
    if (!f.required) return false;
    const v = values[f.name];
    return v === null || v === '' || (Array.isArray(v) && v.length === 0);
  });
  if (missing) {
    showToast(`${missing.label} wajib diisi.`, 'error');
    document.querySelector(`#wp-form-modal [name="${missing.name}"]`)?.focus();
    return;
  }

  const submitBtn = document.querySelector('#wp-form-modal [data-action="submit"]');
  submitBtn.disabled = true;
  try {
    const result = await formModalState.onSubmit(values);
    if (result !== false) closeFormModal();
  } catch (err) {
    showToast('Gagal menyimpan: ' + err.message, 'error');
  } finally {
    submitBtn.disabled = false;
  }
}

async function handleFormModalDelete() {
  if (!formModalState?.onDelete) return;
  if (!confirm(formModalState.deleteConfirm || 'Hapus data ini?')) return;
  try {
    const result = await formModalState.onDelete();
    if (result !== false) closeFormModal();
  } catch (err) {
    showToast('Gagal menghapus: ' + err.message, 'error');
  }
}

window.WP_UI = {
  showToast,
  toggleMobileSidebar,
  closeMobileSidebar,
  openFormModal,
  closeFormModal
};
