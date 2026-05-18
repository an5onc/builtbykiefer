create table vendor_rfi_responses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  rfi_id uuid not null references project_rfis(id) on delete cascade,
  vendor_id uuid not null references vendors(id) on delete cascade,
  assignment_id uuid not null references project_vendor_assignments(id) on delete cascade,
  responder_name text not null,
  response_body text not null,
  created_at timestamptz not null default now(),
  constraint vendor_rfi_responses_body_not_blank check (length(btrim(response_body)) > 0),
  constraint vendor_rfi_responses_responder_not_blank check (length(btrim(responder_name)) > 0)
);

grant usage on type rfi_status to anon;
grant select on table project_rfis to anon;

create policy "clients and trade partners view shared project rfis"
on project_rfis for select
to anon
using (visibility = 'customer');

create index vendor_rfi_responses_project_id_idx on vendor_rfi_responses(project_id);
create index vendor_rfi_responses_rfi_id_idx on vendor_rfi_responses(rfi_id);
create index vendor_rfi_responses_vendor_id_idx on vendor_rfi_responses(vendor_id);
create index vendor_rfi_responses_assignment_id_idx on vendor_rfi_responses(assignment_id);
create index vendor_rfi_responses_created_at_idx on vendor_rfi_responses(created_at);

alter table vendor_rfi_responses enable row level security;

create policy "admins manage vendor rfi responses"
on vendor_rfi_responses for all
using (public.is_admin())
with check (public.is_admin());

create policy "trade partners view shared rfi responses"
on vendor_rfi_responses for select
to anon
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
  )
);

create policy "trade partners submit shared rfi responses"
on vendor_rfi_responses for insert
to anon
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
  )
);

grant select, insert, update, delete on table vendor_rfi_responses to authenticated;
grant select, insert on table vendor_rfi_responses to anon;
