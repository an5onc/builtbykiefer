insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-photos',
  'project-photos',
  true,
  52428800,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update
set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
