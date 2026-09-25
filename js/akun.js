/**
 * Akun & Profil — Read dan simpan data pasangan dari/ke Supabase + LocalStorage
 * Fitur: Edit nama, tanggal, lokasi akad & resepsi, tema, foto upload, info login
 */

let selectedPhotoFile = null;
let previewObjectUrl = null;
const PHOTO_BUCKET = 'wedding-assets';
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;        // 5 MB
const MAX_LOCAL_PHOTO_SIZE = 1500 * 1024;        // 1.5 MB
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// ─── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  const data = await WP_Auth.syncUserData();
  WP_Layout.renderHeader();

  // Isi form dari data yang sudah di-sync
  setField('event-type',         data.couple.eventType || 'wedding');
  setField('bride',              data.couple.bride || '');
  setField('groom',              data.couple.groom || '');
  setField('akad',               WP_Utils.toDateTimeLocalValue(data.couple.akadDate));
  setField('location',           data.couple.akadLocation || '');
  setField('reception-date',     WP_Utils.toDateTimeLocalValue(data.couple.resepsiDate));
  setField('reception-location', data.couple.resepsiLocation || '');
  setField('wedding-theme',      data.couple.weddingTheme || '');

  // Foto preview
  setPhotoPreview(data.couple.photoUrl || 'assets/images/couple_kita.jpeg');

  // Info login
  const session = WP_Auth.getCurrentSession();
  setEl('akun-email',     session?.email || '—');
  setEl('akun-auth-mode', session?.authProvider === 'supabase' ? '☁️ Supabase (Cloud)' : '💻 Lokal (Perangkat)');

  // Preview card
  updatePreviewCard(data);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function setField(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}
function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
function setPhotoPreview(url) {
  const el = document.getElementById('account-photo-preview');
  if (el) el.src = url;
}

function updatePreviewCard(data) {
  const bride = document.getElementById('bride')?.value || data.couple.bride || '—';
  const groom = document.getElementById('groom')?.value || data.couple.groom || '—';
  const akadVal = document.getElementById('akad')?.value;
  const locVal  = document.getElementById('location')?.value;

  setEl('preview-couple-name', `${bride} & ${groom}`);
  setEl('preview-akad-date',  akadVal  ? WP_Utils.formatDateIndo(new Date(akadVal))  : 'Tanggal belum diset');
  setEl('preview-location',   locVal   || 'Lokasi belum diset');
}

// ─── Live Preview Update ──────────────────────────────────────────────────────
function watchPreview() {
  ['bride','groom','akad','location'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => updatePreviewCard({}));
  });
}

// ─── Photo Preview ────────────────────────────────────────────────────────────
function previewPhoto(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!ALLOWED_PHOTO_TYPES.includes(file.type) || file.size > MAX_PHOTO_SIZE) {
    event.target.value = '';
    WP_UI.showToast('Gunakan foto JPG, PNG, atau WebP dengan ukuran maksimum 5 MB.', 'error');
    return;
  }
  const session = WP_Auth.getCurrentSession();
  const canCloud = WP_Supabase.isConfigured() && session?.eventId && session?.authProvider === 'supabase';
  if (!canCloud && file.size > MAX_LOCAL_PHOTO_SIZE) {
    event.target.value = '';
    WP_UI.showToast('Tanpa Supabase, ukuran foto maksimum 1,5 MB agar dapat disimpan di browser.', 'error');
    return;
  }
  selectedPhotoFile = file;
  if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
  previewObjectUrl = URL.createObjectURL(file);
  setPhotoPreview(previewObjectUrl);
}

function readPhotoAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Foto tidak dapat dibaca.'));
    reader.readAsDataURL(file);
  });
}

async function uploadPhotoToSupabase(file, client, session) {
  const ext  = file.name.split('.').pop().toLowerCase();
  const path = `${session.id}/${session.eventId}/couple-${Date.now()}.${ext}`;
  const { error } = await client.storage.from(PHOTO_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });
  if (error) throw error;
  const { data } = client.storage.from(PHOTO_BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error('URL foto tidak tersedia setelah upload.');
  return data.publicUrl;
}

// ─── Save Photo Only ──────────────────────────────────────────────────────────
async function savePhoto() {
  if (!selectedPhotoFile) {
    WP_UI.showToast('Pilih foto terlebih dahulu.', 'info');
    return;
  }
  await _persistPhoto();
  selectedPhotoFile = null;
}

async function _persistPhoto() {
  const data    = WP_Utils.initWeddingData();
  const session = WP_Auth.getCurrentSession();
  const client  = WP_Supabase.getClient();
  const canCloud = WP_Supabase.isConfigured() && client && session?.eventId && session?.id && session.authProvider === 'supabase';

  try {
    if (selectedPhotoFile) {
      if (canCloud) {
        data.couple.photoUrl = await uploadPhotoToSupabase(selectedPhotoFile, client, session);
      } else {
        data.couple.photoUrl = await readPhotoAsDataUrl(selectedPhotoFile);
        WP_UI.showToast('Foto disimpan di perangkat ini. Login Supabase untuk menyinkronkan.', 'info');
      }
      if (canCloud) {
        const { error } = await client.from('wedding_events')
          .update({ photo_url: data.couple.photoUrl })
          .eq('id', session.eventId);
        if (error) throw error;
      }
      WP_Utils.setStorage(WP_Utils.STORAGE_KEYS.WEDDING_DATA, data);
      setPhotoPreview(data.couple.photoUrl);
      WP_Layout.renderHeader();
      WP_UI.showToast('Foto pasangan berhasil diperbarui! 📸', 'success');
    }
  } catch (err) {
    WP_UI.showToast('Gagal menyimpan foto: ' + err.message, 'error');
  }
}

// ─── Save Profile ─────────────────────────────────────────────────────────────
async function save(event) {
  event.preventDefault();
  const button = document.getElementById('account-save-button');
  const data   = WP_Utils.initWeddingData();
  const session = WP_Auth.getCurrentSession();
  const client  = WP_Supabase.getClient();
  const canCloud = WP_Supabase.isConfigured() && client && session?.eventId && session.authProvider === 'supabase';

  button.disabled = true;
  button.textContent = 'Menyimpan...';

  try {
    // Baca semua field
    const newEventType            = document.getElementById('event-type')?.value               || data.couple.eventType || 'wedding';
    const eventTypeChanged        = data.couple.eventType !== newEventType;
    data.couple.eventType         = newEventType;
    data.couple.bride             = document.getElementById('bride')?.value.trim()             || data.couple.bride;
    data.couple.groom             = document.getElementById('groom')?.value.trim()             || data.couple.groom;
    data.couple.akadDate          = WP_Utils.fromDateTimeLocalValue(document.getElementById('akad')?.value) || data.couple.akadDate;
    data.couple.akadLocation      = document.getElementById('location')?.value.trim()          || '';
    data.couple.resepsiDate       = WP_Utils.fromDateTimeLocalValue(document.getElementById('reception-date')?.value);
    data.couple.resepsiLocation   = document.getElementById('reception-location')?.value.trim()|| '';
    data.couple.weddingTheme      = document.getElementById('wedding-theme')?.value.trim()     || '';

    if (canCloud) {
      const { data: updatedRows, error } = await client.from('wedding_events').update({
        event_type:       data.couple.eventType,
        bride_name:       data.couple.bride,
        groom_name:       data.couple.groom,
        akad_date:        data.couple.akadDate        || null,
        akad_location:    data.couple.akadLocation    || null,
        resepsi_date:     data.couple.resepsiDate     || null,
        resepsi_location: data.couple.resepsiLocation || null,
        wedding_theme:    data.couple.weddingTheme    || null,
      }).eq('id', session.eventId).select();

      if (error) throw error;
      if (!updatedRows || updatedRows.length === 0) {
        throw new Error('Acara tidak ditemukan di server atau Anda tidak memiliki izin untuk memperbarui.');
      }

      session.eventType = data.couple.eventType;
      WP_Auth.setSession(session);
    }

    WP_Utils.setStorage(WP_Utils.STORAGE_KEYS.WEDDING_DATA, data);
    WP_Layout.renderHeader();
    WP_Layout.renderSidebar();
    updatePreviewCard(data);
    WP_UI.showToast('Profil acara berhasil disimpan! ✅', 'success');

    if (eventTypeChanged) {
      setTimeout(() => window.location.reload(), 500);
    }
  } catch (err) {
    WP_UI.showToast('Gagal menyimpan: ' + err.message, 'error');
  } finally {
    button.disabled = false;
    button.textContent = 'Simpan Perubahan';
  }
}

// ─── Init on DOM ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  watchPreview();
});

window.WP_Account = {
  init,
  previewPhoto,
  savePhoto,
  save,
  logout: () => WP_Auth.logout()
};
