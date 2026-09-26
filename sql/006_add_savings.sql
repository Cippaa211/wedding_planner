-- ==============================================================================
-- MIGRASI 006: TABUNGAN (savings_entries)
-- Jalankan setelah 005. Aman dijalankan ulang.
--
-- Satu baris per catatan tabungan CPP / CPW. Sengaja tabel sendiri (bukan
-- JSON di event_settings) agar CPP & CPW yang mencatat dari perangkat berbeda
-- pada saat bersamaan tidak saling menimpa catatan.
-- ==============================================================================

begin;

create table if not exists public.savings_entries (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.wedding_events(id) on delete cascade,
  event_type text not null default 'wedding'
    constraint savings_entries_event_type_check check (event_type in ('wedding', 'engagement')),
  contributor text not null
    constraint savings_entries_contributor_check check (contributor in ('cpp', 'cpw')),
  amount numeric(15, 2) not null
    constraint savings_entries_amount_check check (amount > 0),
  saved_at date not null default current_date,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists savings_entries_event_id_type_idx
  on public.savings_entries(event_id, event_type, saved_at desc);

alter table public.savings_entries enable row level security;

revoke all on public.savings_entries from anon;
grant select, insert, update, delete on public.savings_entries to authenticated;

drop policy if exists "Users can CRUD own savings entries" on public.savings_entries;
create policy "Users can CRUD own savings entries"
on public.savings_entries
for all
to authenticated
using (
  event_id in (select id from public.wedding_events where user_id = (select auth.uid()))
)
with check (
  event_id in (select id from public.wedding_events where user_id = (select auth.uid()))
);

commit;
