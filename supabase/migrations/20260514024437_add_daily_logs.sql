create table daily_logs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  report_date date not null,
  superintendent text not null,
  weather text not null,
  crew_count integer not null default 0 check (crew_count >= 0),
  work_performed text not null,
  deliveries text not null default '',
  inspections text not null default '',
  delays text not null default '',
  safety_notes text not null default '',
  next_steps text not null default '',
  visibility file_visibility not null default 'internal',
  created_at timestamptz not null default now()
);

create index daily_logs_project_id_idx on daily_logs(project_id);
create index daily_logs_report_date_idx on daily_logs(report_date);
create index daily_logs_visibility_idx on daily_logs(visibility);

alter table daily_logs enable row level security;

create policy "admins manage daily logs"
on daily_logs for all
using (public.is_admin())
with check (public.is_admin());

grant select, insert, update, delete on table daily_logs to authenticated;
