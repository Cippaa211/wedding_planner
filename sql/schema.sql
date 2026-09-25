-- ==============================================================================
-- SKEMA DATABASE WEDDING PLANNER (SUPABASE POSTGRESQL)
-- Salin dan jalankan seluruh query ini di Supabase: Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PROFILES (Calon Pengantin / Pengguna)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL WEDDING EVENTS (Data Acara Pernikahan)
CREATE TABLE IF NOT EXISTS public.wedding_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'wedding', -- 'wedding' atau 'engagement'
  bride_name TEXT NOT NULL DEFAULT 'Ayu',
  groom_name TEXT NOT NULL DEFAULT 'Angga',
  full_name_bride TEXT,
  full_name_groom TEXT,
  hashtag TEXT DEFAULT '#AyuAnggaForever',
  status_text TEXT DEFAULT 'Menuju hari bahagia',
  akad_date TIMESTAMPTZ DEFAULT '2027-04-07 08:00:00+07',
  akad_location TEXT DEFAULT 'Masjid Agung Al-Barkah, Bekasi',
  resepsi_date TIMESTAMPTZ DEFAULT '2027-04-07 11:00:00+07',
  resepsi_location TEXT DEFAULT 'Grand Ballroom Hotel Santika',
  total_budget NUMERIC(15, 2) DEFAULT 50000000,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL TASKS & CHECKLIST (Persiapan KUA & Acara)
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.wedding_events(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL DEFAULT 'kua', -- 'kua', 'mua', 'venue', 'dokumentasi', etc.
  title TEXT NOT NULL,
  applies_to TEXT DEFAULT 'keduanya', -- 'cpp', 'cpw', 'keduanya', 'wali', 'saksi'
  status TEXT DEFAULT 'belum', -- 'belum', 'proses', 'selesai'
  due_date DATE,
  pic TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL BUDGET ITEMS (Pengeluaran & Anggaran)
CREATE TABLE IF NOT EXISTS public.budget_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.wedding_events(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Lain-lain', -- 'Venue', 'Akad', 'MUA', 'Dokumentasi', 'Seserahan', dll.
  planned_amount NUMERIC(15, 2) DEFAULT 0,
  actual_amount NUMERIC(15, 2) DEFAULT 0,
  payment_status TEXT DEFAULT 'Lunas', -- 'Belum bayar', 'DP', 'Lunas'
  expense_date DATE DEFAULT CURRENT_DATE,
  vendor_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL SESERAHAN ITEMS
CREATE TABLE IF NOT EXISTS public.seserahan_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.wedding_events(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL, -- 'Alat Ibadah', 'Make Up', 'Skincare', 'Bodycare', etc.
  item_name TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  purchase_link TEXT,
  price NUMERIC(15, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABEL GUESTS (Daftar Tamu & Hadiah)
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.wedding_events(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  relation TEXT DEFAULT 'Teman',
  phone TEXT,
  invitation_type TEXT DEFAULT 'digital',
  status TEXT DEFAULT 'belum_kirim',
  total_pax INT DEFAULT 1,
  rsvp_status TEXT DEFAULT 'pending',
  gift_amount NUMERIC(15, 2) DEFAULT 0,
  gift_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. STATE HALAMAN (untuk checklist dan data terstruktur yang belum memerlukan tabel khusus)
CREATE TABLE IF NOT EXISTS public.event_settings (
  event_id UUID REFERENCES public.wedding_events(id) ON DELETE CASCADE NOT NULL,
  setting_key TEXT NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (event_id, setting_key)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) - KEAMANAN DATA PENGGUNA
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seserahan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;

-- Policy Profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy Wedding Events
CREATE POLICY "Users can CRUD own wedding event" ON public.wedding_events
  FOR ALL USING (auth.uid() = user_id);

-- Policy Tasks
CREATE POLICY "Users can CRUD own tasks" ON public.tasks
  FOR ALL USING (
    event_id IN (SELECT id FROM public.wedding_events WHERE user_id = auth.uid())
  );

-- Policy Budget Items
CREATE POLICY "Users can CRUD own budget items" ON public.budget_items
  FOR ALL USING (
    event_id IN (SELECT id FROM public.wedding_events WHERE user_id = auth.uid())
  );

-- Policy Seserahan Items
CREATE POLICY "Users can CRUD own seserahan items" ON public.seserahan_items
  FOR ALL USING (
    event_id IN (SELECT id FROM public.wedding_events WHERE user_id = auth.uid())
  );

-- Policy Guests
CREATE POLICY "Users can CRUD own guests" ON public.guests
  FOR ALL USING (
    event_id IN (SELECT id FROM public.wedding_events WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can CRUD own event settings" ON public.event_settings
  FOR ALL TO authenticated USING (
    event_id IN (SELECT id FROM public.wedding_events WHERE user_id = auth.uid())
  ) WITH CHECK (
    event_id IN (SELECT id FROM public.wedding_events WHERE user_id = auth.uid())
  );

-- Data API saat ini dapat membutuhkan grant eksplisit untuk tabel public.
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles, public.wedding_events,
  public.tasks, public.budget_items, public.seserahan_items, public.guests,
  public.event_settings TO authenticated;

-- ==============================================================================
-- AUTOMATIC TRIGGER: Inisialisasi Profil & Data Acara saat User Baru Mendaftar
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_couple_name TEXT;
  v_bride TEXT := 'Ayu';
  v_groom TEXT := 'Angga';
  v_event_id UUID;
BEGIN
  -- Ambil nama dari metadata pendaftaran jika ada
  v_couple_name := COALESCE(new.raw_user_meta_data->>'name', 'Ayu & Angga');
  
  -- Insert ke profiles
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (new.id, v_couple_name, 'assets/images/avatar-placeholder.jpg');

  -- Parse nama pasangan sederhana
  IF position('&' IN v_couple_name) > 0 THEN
    v_bride := trim(split_part(v_couple_name, '&', 1));
    v_groom := trim(split_part(v_couple_name, '&', 2));
  END IF;

  -- Insert default wedding event
  INSERT INTO public.wedding_events (user_id, bride_name, groom_name, total_budget, akad_date)
  VALUES (new.id, v_bride, v_groom, 50000000, '2027-04-07 08:00:00+07')
  RETURNING id INTO v_event_id;

  -- Insert contoh awal pengeluaran (sesuai demo)
  INSERT INTO public.budget_items (event_id, name, category, planned_amount, actual_amount, payment_status, expense_date) VALUES
    (v_event_id, 'Prewedding', 'Dokumentasi', 850000, 850000, 'Lunas', '2026-09-16'),
    (v_event_id, 'DP Venue', 'Venue', 6000000, 6000000, 'DP', '2026-09-16'),
    (v_event_id, 'DP Makeup', 'Akad', 2000000, 2000000, 'DP', '2026-09-16'),
    (v_event_id, 'Sajadah', 'Seserahan', 88000, 88000, 'Lunas', '2026-09-16'),
    (v_event_id, 'Mukena', 'Seserahan', 185000, 185000, 'Lunas', '2026-09-16');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Pasang Trigger ke auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
