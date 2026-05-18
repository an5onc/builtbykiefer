alter table vendors
  add column if not exists auth_email text not null default '';

update vendors
set auth_email = lower(email)
where btrim(auth_email) = '';

create index if not exists vendors_auth_email_idx on vendors(lower(auth_email));

grant select on table vendors to authenticated;
grant select on table project_vendor_assignments to authenticated;
grant select on table project_files to authenticated;
grant select on table project_rfis to authenticated;
grant select, insert on table vendor_rfi_responses to authenticated;

revoke insert on table vendor_rfi_responses from anon;
revoke select on table vendor_rfi_responses from anon;

drop policy if exists "trade partners view shared rfi responses" on vendor_rfi_responses;
drop policy if exists "trade partners submit shared rfi responses" on vendor_rfi_responses;

create policy "authenticated vendors view own profile"
on vendors for select
to authenticated
using (
  status = 'active'
  and portal_access = true
  and lower(coalesce(nullif(auth_email, ''), email)) = lower((select auth.email()))
);

create policy "authenticated vendors view own assignments"
on project_vendor_assignments for select
to authenticated
using (
  visibility = 'customer'
  and exists (
    select 1
    from vendors
    where vendors.id = project_vendor_assignments.vendor_id
      and vendors.status = 'active'
      and vendors.portal_access = true
      and lower(coalesce(nullif(vendors.auth_email, ''), vendors.email)) = lower((select auth.email()))
  )
);

create policy "authenticated vendors view shared project files"
on project_files for select
to authenticated
using (
  visibility = 'customer'
  and exists (
    select 1
    from project_vendor_assignments
    join vendors on vendors.id = project_vendor_assignments.vendor_id
    where project_vendor_assignments.project_id = project_files.project_id
      and project_vendor_assignments.visibility = 'customer'
      and vendors.status = 'active'
      and vendors.portal_access = true
      and lower(coalesce(nullif(vendors.auth_email, ''), vendors.email)) = lower((select auth.email()))
  )
);

create policy "authenticated vendors view shared project rfis"
on project_rfis for select
to authenticated
using (
  visibility = 'customer'
  and exists (
    select 1
    from project_vendor_assignments
    join vendors on vendors.id = project_vendor_assignments.vendor_id
    where project_vendor_assignments.project_id = project_rfis.project_id
      and project_vendor_assignments.visibility = 'customer'
      and vendors.status = 'active'
      and vendors.portal_access = true
      and lower(coalesce(nullif(vendors.auth_email, ''), vendors.email)) = lower((select auth.email()))
  )
);

create policy "authenticated vendors view own rfi responses"
on vendor_rfi_responses for select
to authenticated
using (
  exists (
    select 1
    from project_rfis
    where project_rfis.id = vendor_rfi_responses.rfi_id
      and project_rfis.project_id = vendor_rfi_responses.project_id
      and project_rfis.visibility = 'customer'
  )
  and exists (
    select 1
    from project_vendor_assignments
    join vendors on vendors.id = project_vendor_assignments.vendor_id
    where project_vendor_assignments.id = vendor_rfi_responses.assignment_id
      and project_vendor_assignments.project_id = vendor_rfi_responses.project_id
      and project_vendor_assignments.vendor_id = vendor_rfi_responses.vendor_id
      and project_vendor_assignments.visibility = 'customer'
      and vendors.status = 'active'
      and vendors.portal_access = true
      and lower(coalesce(nullif(vendors.auth_email, ''), vendors.email)) = lower((select auth.email()))
  )
);

create policy "authenticated vendors submit own rfi responses"
on vendor_rfi_responses for insert
to authenticated
with check (
  exists (
    select 1
    from project_rfis
    where project_rfis.id = vendor_rfi_responses.rfi_id
      and project_rfis.project_id = vendor_rfi_responses.project_id
      and project_rfis.visibility = 'customer'
      and project_rfis.status = 'open'
  )
  and exists (
    select 1
    from project_vendor_assignments
    join vendors on vendors.id = project_vendor_assignments.vendor_id
    where project_vendor_assignments.id = vendor_rfi_responses.assignment_id
      and project_vendor_assignments.project_id = vendor_rfi_responses.project_id
      and project_vendor_assignments.vendor_id = vendor_rfi_responses.vendor_id
      and project_vendor_assignments.visibility = 'customer'
      and vendors.status = 'active'
      and vendors.portal_access = true
      and lower(coalesce(nullif(vendors.auth_email, ''), vendors.email)) = lower((select auth.email()))
  )
);
