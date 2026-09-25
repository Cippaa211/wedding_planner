-- ==============================================================================
-- MIGRASI 005: SELARASKAN SKEMA DENGAN KODE APLIKASI
-- Jalankan setelah schema.sql, 002, 003, dan 004. Aman dijalankan ulang.
--
-- - wedding_events.wedding_theme  : dipakai form Akun (Tema Pernikahan)
-- - wedding_events.engagement_total_budget : total budget terpisah untuk Engagement
-- - guests.notes                  : catatan umum tamu (kursi roda, vegetarian, dsb.)
-- - UNIQUE (wedding_events.user_id): satu event per user; mencegah baris ganda
--   akibat trigger pendaftaran + insert cadangan dari aplikasi berjalan bersamaan
-- - CHECK event_type              : hanya 'wedding' atau 'engagement'
-- - budget_items.event_type & guests.event_type:
--   setiap user hanya punya satu baris wedding_events dan event_type hanya
--   berpindah nilai, sehingga pengeluaran & tamu Wedding dan Engagement perlu
--   ditandai sendiri agar tidak tercampur. Data lama dianggap 'wedding'.
-- ==============================================================================

begin;

-- 1. Kolom yang ditulis aplikasi namun belum ada
alter table public.wedding_events add column if not exists wedding_theme text;
-- Total budget terpisah untuk Engagement (Wedding tetap memakai total_budget)
alter table public.wedding_events add column if not exists engagement_total_budget numeric(15, 2) default 15000000;
alter table public.guests add column if not exists notes text;

-- 2. Satu event per user.
--    Bila sudah ada user dengan lebih dari satu event, migrasi dibatalkan agar
--    tidak ada data yang terhapus diam-diam. Bersihkan manual terlebih dahulu:
--      select user_id, array_agg(id order by created_at) from public.wedding_events
--      group by user_id having count(*) > 1;
do $$
begin
  if exists (
    select 1 from public.wedding_events group by user_id having count(*) > 1
  ) then
    raise exception 'Ada user dengan lebih dari satu wedding_events. Hapus baris duplikat terlebih dahulu (lihat komentar di atas).';
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'wedding_events_user_id_key'
  ) then
    alter table public.wedding_events
      add constraint wedding_events_user_id_key unique (user_id);
  end if;
end $$;

-- 3. Batasi nilai event_type
update public.wedding_events
set event_type = 'wedding'
where event_type is null or event_type not in ('wedding', 'engagement');

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'wedding_events_event_type_check'
  ) then
    alter table public.wedding_events
      add constraint wedding_events_event_type_check
      check (event_type in ('wedding', 'engagement'));
  end if;
end $$;

-- 4. Pisahkan pengeluaran & tamu per jenis acara
alter table public.budget_items add column if not exists event_type text not null default 'wedding';
alter table public.guests add column if not exists event_type text not null default 'wedding';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'budget_items_event_type_check') then
    alter table public.budget_items
      add constraint budget_items_event_type_check check (event_type in ('wedding', 'engagement'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'guests_event_type_check') then
    alter table public.guests
      add constraint guests_event_type_check check (event_type in ('wedding', 'engagement'));
  end if;
end $$;

create index if not exists budget_items_event_id_type_idx on public.budget_items(event_id, event_type);
create index if not exists guests_event_id_type_idx on public.guests(event_id, event_type);

-- 5. Trigger pendaftaran: jangan gagal bila event sudah dibuat oleh aplikasi
create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_couple_name text;
  v_bride text := 'Ayu';
  v_groom text := 'Angga';
  v_event_id uuid;
begin
  v_couple_name := coalesce(new.raw_user_meta_data->>'name', 'Ayu & Angga');

  insert into public.profiles (id, name, avatar_url)
  values (new.id, v_couple_name, 'assets/images/avatar-placeholder.jpg')
  on conflict (id) do nothing;

  if position('&' in v_couple_name) > 0 then
    v_bride := trim(split_part(v_couple_name, '&', 1));
    v_groom := trim(split_part(v_couple_name, '&', 2));
  end if;

  insert into public.wedding_events (user_id, bride_name, groom_name, total_budget, akad_date)
  values (new.id, v_bride, v_groom, 50000000, '2027-04-07 08:00:00+07')
  on conflict (user_id) do nothing
  returning id into v_event_id;

  -- Contoh awal pengeluaran hanya bila event benar-benar baru dibuat di sini
  if v_event_id is not null then
    insert into public.budget_items (event_id, name, category, planned_amount, actual_amount, payment_status, expense_date) values
      (v_event_id, 'Prewedding', 'Dokumentasi', 850000, 850000, 'Lunas', '2026-09-16'),
      (v_event_id, 'DP Venue', 'Venue', 6000000, 6000000, 'DP', '2026-09-16'),
      (v_event_id, 'DP Makeup', 'Akad', 2000000, 2000000, 'DP', '2026-09-16'),
      (v_event_id, 'Sajadah', 'Seserahan', 88000, 88000, 'Lunas', '2026-09-16'),
      (v_event_id, 'Mukena', 'Seserahan', 185000, 185000, 'Lunas', '2026-09-16');
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

commit;
