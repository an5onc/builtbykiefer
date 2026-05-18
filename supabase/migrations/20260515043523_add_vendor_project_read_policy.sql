revoke select on table vendors from anon;
revoke select on table project_vendor_assignments from anon;

drop policy if exists "trade partners view portal vendors" on vendors;
drop policy if exists "trade partners view shared assignments" on project_vendor_assignments;

grant select on table projects to authenticated;
grant select on table project_phases to authenticated;

create policy "authenticated vendors view assigned projects"
on projects for select
to authenticated
using (
  exists (
    select 1
    from project_vendor_assignments
    join vendors on vendors.id = project_vendor_assignments.vendor_id
    where project_vendor_assignments.project_id = projects.id
      and project_vendor_assignments.visibility = 'customer'
      and vendors.status = 'active'
      and vendors.portal_access = true
      and lower(coalesce(nullif(vendors.auth_email, ''), vendors.email)) = lower((select auth.email()))
  )
);

create policy "authenticated vendors view assigned project phases"
on project_phases for select
to authenticated
using (
  exists (
    select 1
    from project_vendor_assignments
    join vendors on vendors.id = project_vendor_assignments.vendor_id
    where project_vendor_assignments.project_id = project_phases.project_id
      and project_vendor_assignments.visibility = 'customer'
      and vendors.status = 'active'
      and vendors.portal_access = true
      and lower(coalesce(nullif(vendors.auth_email, ''), vendors.email)) = lower((select auth.email()))
  )
);
