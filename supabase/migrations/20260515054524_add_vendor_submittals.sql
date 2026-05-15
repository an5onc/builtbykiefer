create type vendor_submittal_category as enum ('insurance', 'w9', 'submittal', 'closeout', 'warranty', 'other');
create type vendor_submittal_status as enum ('submitted', 'reviewed');

create table vendor_submittals (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  vendor_id uuid not null references vendors(id) on delete cascade,
  assignment_id uuid not null references project_vendor_assignments(id) on delete cascade,
  title text not null,
  category vendor_submittal_category not null default 'submittal',
  status vendor_submittal_status not null default 'submitted',
  storage_bucket text not null default 'project-documents',
  storage_path text not null,
  mime_type text not null,
  size_label text not null default '',
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  constraint vendor_submittals_title_not_blank check (length(btrim(title)) > 0),
  constraint vendor_submittals_storage_path_unique unique (storage_bucket, storage_path)
);

create index vendor_submittals_project_id_idx on vendor_submittals(project_id);
create index vendor_submittals_vendor_id_idx on vendor_submittals(vendor_id);
create index vendor_submittals_assignment_id_idx on vendor_submittals(assignment_id);
create index vendor_submittals_submitted_at_idx on vendor_submittals(submitted_at);

alter table vendor_submittals enable row level security;

grant usage on type vendor_submittal_category to authenticated;
grant usage on type vendor_submittal_status to authenticated;
grant select, insert, update, delete on table vendor_submittals to authenticated;

create policy "admins manage vendor submittals"
on vendor_submittals for all
using (public.is_admin())
with check (public.is_admin());

create policy "authenticated vendors view own submittals"
on vendor_submittals for select
to authenticated
using (
  exists (
    select 1
    from project_vendor_assignments
    join vendors on vendors.id = project_vendor_assignments.vendor_id
    where project_vendor_assignments.id = vendor_submittals.assignment_id
      and project_vendor_assignments.project_id = vendor_submittals.project_id
      and project_vendor_assignments.vendor_id = vendor_submittals.vendor_id
      and project_vendor_assignments.visibility = 'customer'
      and vendors.status = 'active'
      and vendors.portal_access = true
      and lower(coalesce(nullif(vendors.auth_email, ''), vendors.email)) = lower((select auth.email()))
  )
);

create policy "authenticated vendors submit own submittals"
on vendor_submittals for insert
to authenticated
with check (
  exists (
    select 1
    from project_vendor_assignments
    join vendors on vendors.id = project_vendor_assignments.vendor_id
    where project_vendor_assignments.id = vendor_submittals.assignment_id
      and project_vendor_assignments.project_id = vendor_submittals.project_id
      and project_vendor_assignments.vendor_id = vendor_submittals.vendor_id
      and project_vendor_assignments.visibility = 'customer'
      and vendors.status = 'active'
      and vendors.portal_access = true
      and lower(coalesce(nullif(vendors.auth_email, ''), vendors.email)) = lower((select auth.email()))
  )
);

create policy "authenticated vendors upload own submittal files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'project-documents'
  and (storage.foldername(name))[2] = 'vendor-submittals'
  and exists (
    select 1
    from project_vendor_assignments
    join vendors on vendors.id = project_vendor_assignments.vendor_id
    where project_vendor_assignments.project_id::text = (storage.foldername(name))[1]
      and project_vendor_assignments.vendor_id::text = (storage.foldername(name))[3]
      and project_vendor_assignments.visibility = 'customer'
      and vendors.status = 'active'
      and vendors.portal_access = true
      and lower(coalesce(nullif(vendors.auth_email, ''), vendors.email)) = lower((select auth.email()))
  )
);

create policy "authenticated vendors view own submittal files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'project-documents'
  and (storage.foldername(name))[2] = 'vendor-submittals'
  and exists (
    select 1
    from project_vendor_assignments
    join vendors on vendors.id = project_vendor_assignments.vendor_id
    where project_vendor_assignments.project_id::text = (storage.foldername(name))[1]
      and project_vendor_assignments.vendor_id::text = (storage.foldername(name))[3]
      and project_vendor_assignments.visibility = 'customer'
      and vendors.status = 'active'
      and vendors.portal_access = true
      and lower(coalesce(nullif(vendors.auth_email, ''), vendors.email)) = lower((select auth.email()))
  )
);
