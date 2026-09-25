/**
 * Authentication and Session Management with Supabase Integration
 */

function getCurrentSession() {
  return WP_Utils.getStorage(WP_Utils.STORAGE_KEYS.SESSION);
}

function setSession(userData) {
  WP_Utils.setStorage(WP_Utils.STORAGE_KEYS.SESSION, userData);
}

function clearSession() {
  localStorage.removeItem(WP_Utils.STORAGE_KEYS.SESSION);
}

/**
 * Arahkan ke halaman lain dan jangan pernah resolve, sehingga pemanggil yang
 * melakukan `await requireAuth()` berhenti dan tidak merender halaman yang ditinggalkan.
 */
function redirectTo(url) {
  window.location.href = url;
  return new Promise(() => {});
}

async function requireAuth() {
  const isLoginPage = window.location.pathname.endsWith('login.html');
  const localSession = getCurrentSession();
  if (localSession?.authProvider === 'local') {
    if (isLoginPage) return redirectTo('index.html');
    return localSession;
  }
  const client = WP_Supabase.getClient();

  const session = (WP_Supabase.isConfigured() && client)
    ? (await client.auth.getSession()).data.session
    : getCurrentSession();

  if (!session && !isLoginPage) return redirectTo('login.html');
  if (session && isLoginPage) return redirectTo('index.html');
  return session;
}

/**
 * Sync user profile & wedding event data from Supabase / Session
 */
async function syncUserData() {
  const client = WP_Supabase.getClient();

  if (WP_Supabase.isConfigured() && client) {
    const { data: { user } } = await client.auth.getUser();
    if (user) {
      // Data lokal milik user lain (atau sisa Mode Demo) tidak boleh terbawa ke akun ini
      if (WP_Utils.getStorage(WP_Utils.STORAGE_KEYS.OWNER) !== user.id) {
        WP_Utils.clearAppStorage();
        WP_Utils.setStorage(WP_Utils.STORAGE_KEYS.OWNER, user.id);
      }
      const localData = WP_Utils.initWeddingData();

      let coupleName = user.user_metadata?.name || 'Ayu & Angga';
      let brideName = 'Ayu';
      let groomName = 'Angga';

      if (coupleName.includes('&')) {
        const parts = coupleName.split('&').map(s => s.trim());
        brideName = parts[0] || 'Ayu';
        groomName = parts[1] || 'Angga';
      } else if (coupleName.trim().length > 0) {
        brideName = coupleName.trim();
        groomName = 'Pasangan';
      }

      // 1. Fetch from wedding_events table
      let { data: eventData } = await client
        .from('wedding_events')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // 2. If no event exists yet (e.g. trigger didn't run), create one now.
      //    user_id bersifat UNIQUE, jadi bila trigger menang balapan, insert ini diabaikan
      //    lalu baris milik trigger dibaca ulang.
      if (!eventData) {
        const { error: upsertErr } = await client
          .from('wedding_events')
          .upsert({
            user_id: user.id,
            bride_name: brideName,
            groom_name: groomName,
            total_budget: 50000000,
            akad_date: '2027-04-07T08:00:00+07:00'
          }, { onConflict: 'user_id', ignoreDuplicates: true });
        if (upsertErr) console.warn('Auto create event fallback note:', upsertErr);

        const { data: reloaded } = await client
          .from('wedding_events')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        eventData = reloaded;
      }

      // 3. Update local wedding store with Supabase data
      if (eventData) {
        localData.couple.eventType = eventData.event_type || 'wedding';
        localData.couple.bride = eventData.bride_name || brideName;
        localData.couple.groom = eventData.groom_name || groomName;
        localData.couple.akadDate = eventData.akad_date || localData.couple.akadDate;
        localData.couple.akadLocation = eventData.akad_location ?? '';
        localData.couple.resepsiDate = eventData.resepsi_date ?? '';
        localData.couple.resepsiLocation = eventData.resepsi_location ?? '';
        localData.couple.weddingTheme = eventData.wedding_theme ?? '';
        localData.couple.status = eventData.status_text || localData.couple.status;
        localData.budget.totalBudget = Number(eventData.total_budget) || WP_Utils.DEFAULT_TOTAL_BUDGET.wedding;
        localData.budget.engagementTotalBudget = Number(eventData.engagement_total_budget) || WP_Utils.DEFAULT_TOTAL_BUDGET.engagement;
        if (eventData.photo_url) localData.couple.photoUrl = eventData.photo_url;
      } else {
        localData.couple.eventType = 'wedding';
        localData.couple.bride = brideName;
        localData.couple.groom = groomName;
      }

      // 4. Update session
      const sessionObj = {
        id: user.id,
        email: user.email,
        name: `${localData.couple.bride} & ${localData.couple.groom}`,
        eventId: eventData ? eventData.id : null,
        eventType: localData.couple.eventType,
        authProvider: 'supabase'
      };
      setSession(sessionObj);
      WP_Utils.setStorage(WP_Utils.STORAGE_KEYS.WEDDING_DATA, localData);
      return localData;
    }
  }

  // Fallback Local Session Sync
  const localData = WP_Utils.initWeddingData();
  const session = getCurrentSession();
  if (session && session.name) {
    const coupleName = session.name;
    if (coupleName.includes('&')) {
      const parts = coupleName.split('&').map(s => s.trim());
      localData.couple.bride = parts[0] || 'Ayu';
      localData.couple.groom = parts[1] || 'Angga';
    } else {
      localData.couple.bride = coupleName;
      localData.couple.groom = 'Pasangan';
    }
    WP_Utils.setStorage(WP_Utils.STORAGE_KEYS.WEDDING_DATA, localData);
  }

  return localData;
}

/**
 * Handle Login
 */
async function loginUser(email, password) {
  const client = WP_Supabase.getClient();

  if (WP_Supabase.isConfigured() && client) {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Email atau kata sandi tidak sesuai.');
      } else if (error.message.includes('Email not confirmed')) {
        throw new Error('Email belum dikonfirmasi. Periksa kotak masuk/spam email Anda atau matikan konfirmasi email di Supabase.');
      }
      throw error;
    }

    // Sync user data immediately
    await syncUserData();

    return data.user;
  }

  // Fallback Mock Local Login
  if (email && password) {
    const userData = {
      id: 'demo-user-01',
      email: email,
      name: 'Ayu & Angga',
      role: 'owner',
      authProvider: 'local'
    };
    setSession(userData);
    return userData;
  } else {
    throw new Error('Email dan kata sandi wajib diisi');
  }
}

/**
 * Handle Register
 */
async function registerUser(email, password, coupleName) {
  const client = WP_Supabase.getClient();

  // Helper parse names immediately
  let brideName = 'Ayu';
  let groomName = 'Angga';
  const cleanName = (coupleName || '').trim();
  if (cleanName.includes('&')) {
    const parts = cleanName.split('&').map(s => s.trim());
    brideName = parts[0] || 'Ayu';
    groomName = parts[1] || 'Angga';
  } else if (cleanName.length > 0) {
    brideName = cleanName;
    groomName = 'Pasangan';
  }

  // Update local storage right away
  const localData = WP_Utils.initWeddingData();
  localData.couple.bride = brideName;
  localData.couple.groom = groomName;
  WP_Utils.setStorage(WP_Utils.STORAGE_KEYS.WEDDING_DATA, localData);

  if (WP_Supabase.isConfigured() && client) {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: `${brideName} & ${groomName}`
        }
      }
    });

    if (error) {
      if (error.message.includes('User already registered')) {
        throw new Error('Email ini sudah terdaftar. Silakan gunakan menu Masuk.');
      }
      throw error;
    }

    // If email confirmation is required by Supabase
    if (data.user && !data.session) {
      return {
        needsConfirmation: true,
        message: 'Pendaftaran berhasil! Silakan periksa email Anda untuk verifikasi atau langsung login jika konfirmasi dinonaktifkan.'
      };
    }

    // If session is returned directly
    if (data.user) {
      await syncUserData();
    }

    return data.user;
  }

  // Fallback Local Register
  const userData = {
    id: 'user-' + Date.now(),
    email: email,
    name: `${brideName} & ${groomName}`,
    role: 'owner',
    authProvider: 'local'
  };
  setSession(userData);

  return userData;
}

function startDemoSession() {
  const userData = {
    id: 'demo-user-01',
    email: 'demo@wedding-planner.local',
    name: 'Syfa & Ega',
    role: 'owner',
    authProvider: 'local'
  };
  setSession(userData);
  const localData = WP_Utils.initWeddingData();
  localData.couple.bride = 'Syfa';
  localData.couple.groom = 'Ega';
  WP_Utils.setStorage(WP_Utils.STORAGE_KEYS.WEDDING_DATA, localData);
  return userData;
}

/**
 * Handle Logout
 */
async function logout() {
  const client = WP_Supabase.getClient();
  const session = getCurrentSession();
  if (WP_Supabase.isConfigured() && client) {
    await client.auth.signOut();
  }
  if (session?.authProvider === 'supabase') {
    // Data akun cloud tersimpan di server; hapus salinan lokal agar tidak terlihat akun lain
    WP_Utils.clearAppStorage();
  } else {
    // Mode Demo / Lokal: data hanya ada di perangkat, jadi hanya sesi yang dihapus
    clearSession();
  }
  window.location.href = 'login.html';
}

window.WP_Auth = {
  getCurrentSession,
  setSession,
  clearSession,
  requireAuth,
  syncUserData,
  loginUser,
  registerUser,
  startDemoSession,
  logout
};
