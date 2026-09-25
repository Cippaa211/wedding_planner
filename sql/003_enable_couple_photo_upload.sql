-- Jalankan setelah schema.sql. Bucket ini public agar Dashboard dapat memakai URL foto langsung.
begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('wedding-assets', 'wedding-assets', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Wedding asset upload by owner" on storage.objects;
create policy "Wedding asset upload by owner"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'wedding-assets'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Wedding asset update by owner" on storage.objects;
create policy "Wedding asset update by owner"
on storage.objects for update to authenticated
using (
  bucket_id = 'wedding-assets'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'wedding-assets'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Wedding asset delete by owner" on storage.objects;
create policy "Wedding asset delete by owner"
on storage.objects for delete to authenticated
using (
  bucket_id = 'wedding-assets'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

commit;
