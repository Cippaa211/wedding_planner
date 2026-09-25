-- Jalankan sekali di Supabase SQL Editor untuk menyinkronkan fitur yang sebelumnya lokal.
-- Aman dijalankan ulang.
begin;

create table if not exists public.event_settings (
  event_id uuid not null references public.wedding_events(id) on delete cascade,
  setting_key text not null check (char_length(setting_key) between 1 and 100),
  value jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (event_id, setting_key)
);

create index if not exists event_settings_event_id_idx on public.event_settings(event_id);

alter table public.event_settings enable row level security;
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles, public.wedding_events,
  public.tasks, public.budget_items, public.seserahan_items, public.guests
  to authenticated;
revoke all on public.event_settings from anon;
grant select, insert, update, delete on public.event_settings to authenticated;

drop policy if exists "Users can CRUD own event settings" on public.event_settings;
create policy "Users can CRUD own event settings"
on public.event_settings
for all
to authenticated
using (
  event_id in (
    select id from public.wedding_events where user_id = (select auth.uid())
  )
)
with check (
  event_id in (
    select id from public.wedding_events where user_id = (select auth.uid())
  )
);

commit;
