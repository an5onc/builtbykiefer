alter type vendor_submittal_status add value if not exists 'approved';
alter type vendor_submittal_status add value if not exists 'rejected';

alter table vendor_submittals
  add column if not exists review_comment text not null default '',
  add column if not exists reviewed_by uuid references profiles(id) on delete set null;

create index if not exists vendor_submittals_reviewed_by_idx on vendor_submittals(reviewed_by);

create table if not exists project_finance_snapshots (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  notes text not null default '',
  inputs jsonb not null,
  outputs jsonb not null,
  created_by uuid references profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  constraint project_finance_snapshots_title_not_blank check (length(btrim(title)) > 0)
);

create index if not exists project_finance_snapshots_project_id_idx
  on project_finance_snapshots(project_id);

create index if not exists project_finance_snapshots_created_at_idx
  on project_finance_snapshots(created_at desc);

alter table project_finance_snapshots enable row level security;

grant select, insert, update, delete on table project_finance_snapshots to authenticated;

create policy "admins manage project finance snapshots"
on project_finance_snapshots for all
using (public.is_admin())
with check (public.is_admin());
