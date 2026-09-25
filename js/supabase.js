/**
 * Supabase Client Initialization & Configuration
 * 
 * PETUNJUK:
 * Masukkan URL Proyek dan Anon Key dari dashboard Supabase Anda:
 * Supabase Dashboard -> Project Settings -> API -> Project URL & Project API Keys (anon public)
 */

const SUPABASE_CONFIG = {
  URL: 'https://blkppgtfghyrvuptyumt.supabase.co', // Ganti dengan Project URL Supabase Anda
  ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa3BwZ3RmZ2h5cnZ1cHR5dW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3OTMxNTMsImV4cCI6MjEwNTM2OTE1M30.vYI-ebVRfL4E45uY1kfVkrjiD6YRqcnzN9wpnYxHiJw'                // Ganti dengan Anon Key Supabase Anda
};

let supabaseClient = null;

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  if (window.supabase && SUPABASE_CONFIG.URL !== 'https://your-project.supabase.co') {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);
      return supabaseClient;
    } catch (err) {
      console.warn('Gagal menginisialisasi Supabase client:', err);
      return null;
    }
  }
  return null;
}

window.WP_Supabase = {
  config: SUPABASE_CONFIG,
  getClient: getSupabaseClient,
  isConfigured: () => {
    return (
      typeof window.supabase !== 'undefined' &&
      SUPABASE_CONFIG.URL &&
      !SUPABASE_CONFIG.URL.includes('your-project.supabase.co') &&
      SUPABASE_CONFIG.ANON_KEY &&
      !SUPABASE_CONFIG.ANON_KEY.includes('your-anon-key')
    );
  }
};
