create table project_comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  author_name text not null,
  body text not null,
  visibility file_visibility not null default 'internal',
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index project_comments_project_id_idx on project_comments(project_id);
create index project_comments_created_at_idx on project_comments(created_at);
create index project_comments_visibility_idx on project_comments(visibility);

alter table project_comments enable row level security;

create policy "admins manage project comments"
on project_comments for all
using (public.is_admin())
with check (public.is_admin());

grant select, insert, update, delete on table project_comments to authenticated;
