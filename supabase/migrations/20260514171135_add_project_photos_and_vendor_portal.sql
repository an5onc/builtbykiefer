create type project_photo_category as enum ('progress', 'selections', 'issue', 'before', 'after', 'closeout');
create type vendor_company_type as enum ('subcontractor', 'vendor');
create type vendor_status as enum ('active', 'inactive');
create type project_vendor_assignment_status as enum ('invited', 'scheduled', 'active', 'complete');

create table project_photos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  photo_date date not null,
  category project_photo_category not null default 'progress',
  visibility file_visibility not null default 'internal',
  image_url text not null,
  caption text not null default '',
  uploaded_at timestamptz not null default now()
);

create table vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company_type vendor_company_type not null default 'subcontractor',
  trade text not null,
  email text not null,
  phone text not null default '',
  status vendor_status not null default 'active',
  portal_access boolean not null default false,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table project_vendor_assignments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  vendor_id uuid not null references vendors(id) on delete cascade,
  scope text not null,
  start_date date not null,
  end_date date,
  status project_vendor_assignment_status not null default 'scheduled',
  visibility file_visibility not null default 'internal',
  created_at timestamptz not null default now()
);

create index project_photos_project_id_idx on project_photos(project_id);
create index project_photos_photo_date_idx on project_photos(photo_date);
create index project_photos_category_idx on project_photos(category);
create index project_photos_visibility_idx on project_photos(visibility);

create index vendors_status_idx on vendors(status);
create index vendors_company_type_idx on vendors(company_type);
create index vendors_portal_access_idx on vendors(portal_access);

create index project_vendor_assignments_project_id_idx on project_vendor_assignments(project_id);
create index project_vendor_assignments_vendor_id_idx on project_vendor_assignments(vendor_id);
create index project_vendor_assignments_status_idx on project_vendor_assignments(status);
create index project_vendor_assignments_visibility_idx on project_vendor_assignments(visibility);

alter table project_photos enable row level security;
alter table vendors enable row level security;
alter table project_vendor_assignments enable row level security;

create policy "admins manage project photos"
on project_photos for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage vendors"
on vendors for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage project vendor assignments"
on project_vendor_assignments for all
using (public.is_admin())
with check (public.is_admin());

create policy "clients view shared project photos"
on project_photos for select
to anon
using (visibility = 'customer');

create policy "trade partners view portal vendors"
on vendors for select
to anon
using (status = 'active' and portal_access = true);

create policy "trade partners view shared assignments"
on project_vendor_assignments for select
to anon
using (
  visibility = 'customer'
  and exists (
    select 1
    from vendors
    where vendors.id = project_vendor_assignments.vendor_id
      and vendors.status = 'active'
      and vendors.portal_access = true
  )
);

grant usage on type project_photo_category to authenticated, anon;
grant usage on type vendor_company_type to authenticated, anon;
grant usage on type vendor_status to authenticated, anon;
grant usage on type project_vendor_assignment_status to authenticated, anon;

grant select, insert, update, delete on table project_photos to authenticated;
grant select, insert, update, delete on table vendors to authenticated;
grant select, insert, update, delete on table project_vendor_assignments to authenticated;

grant select on table project_photos to anon;
grant select on table vendors to anon;
grant select on table project_vendor_assignments to anon;
