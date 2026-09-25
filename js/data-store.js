/**
 * Data store helper for page state persistence
 * Key dipisah per event_type agar state Wedding dan Engagement tidak saling menimpa.
 */

function getScopedKey(key) {
  return WP_Utils.getScopedStorageKey(key);
}

async function loadPageState(key, fallback) {
  const scopedKey = getScopedKey(key);
  const client = WP_Supabase.getClient();
  const session = WP_Auth.getCurrentSession();
  if (WP_Supabase.isConfigured() && client && session?.eventId) {
    const { data, error } = await client
      .from('event_settings')
      .select('value')
      .eq('event_id', session.eventId)
      .eq('setting_key', scopedKey)
      .maybeSingle();
    if (error) {
      WP_UI.showToast(`Data belum dapat dimuat dari server: ${error.message}`, 'error');
      return WP_Utils.getStorage(scopedKey, fallback);
    }
    return data?.value ?? WP_Utils.getStorage(scopedKey, fallback);
  }
  return WP_Utils.getStorage(scopedKey, fallback);
}

async function savePageState(key, value) {
  const scopedKey = getScopedKey(key);
  WP_Utils.setStorage(scopedKey, value);
  const client = WP_Supabase.getClient();
  const session = WP_Auth.getCurrentSession();
  if (!(WP_Supabase.isConfigured() && client && session?.eventId)) return true;
  const { error } = await client
    .from('event_settings')
    .upsert({ event_id: session.eventId, setting_key: scopedKey, value }, { onConflict: 'event_id,setting_key' });
  if (error) {
    WP_UI.showToast(`Perubahan belum tersinkron: ${error.message}`, 'error');
    return false;
  }
  return true;
}

window.WP_DataStore = { loadPageState, savePageState, getScopedKey };
