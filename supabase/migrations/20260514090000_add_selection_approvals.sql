alter table project_selections
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by_name text not null default '';

create index if not exists project_selections_approved_at_idx
on project_selections(approved_at);

grant usage on type selection_status to anon;
grant select on table project_selections to anon;
grant update (status, approved_at, approved_by_name) on table project_selections to anon;

create policy "clients view shared project selections"
on project_selections for select
to anon
using (status in ('submitted', 'approved', 'ordered'));

create policy "clients approve submitted project selections"
on project_selections for update
to anon
using (status = 'submitted')
with check (
  status = 'approved'
  and approved_at is not null
  and length(btrim(approved_by_name)) > 0
);
