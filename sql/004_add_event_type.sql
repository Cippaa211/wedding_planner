-- ==============================================================================
-- MIGRASI 004: TAMBAH DUKUNGAN EVENT TYPE (WEDDING & ENGAGEMENT)
-- Salin dan jalankan di Supabase SQL Editor
-- ==============================================================================

-- 1. Tambah kolom event_type pada tabel wedding_events (bila belum ada)
ALTER TABLE public.wedding_events 
ADD COLUMN IF NOT EXISTS event_type TEXT NOT NULL DEFAULT 'wedding';

-- 2. Pastikan nilai default terkonsolidasi
UPDATE public.wedding_events 
SET event_type = 'wedding' 
WHERE event_type IS NULL OR event_type = '';

-- 3. Pastikan RLS policy mengizinkan UPDATE oleh pemilik event (user_id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'wedding_events' AND policyname = 'Users can CRUD own wedding event'
  ) THEN
    CREATE POLICY "Users can CRUD own wedding event" ON public.wedding_events
      FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 4. Pastikan izin GRANT UPDATE diberikan ke authenticated role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wedding_events TO authenticated;
