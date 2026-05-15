create type task_status as enum ('open', 'in-progress', 'done');
create type task_priority as enum ('low', 'normal', 'high', 'urgent');

create table project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  assigned_worker_id uuid references workers(id) on delete set null,
  title text not null,
  notes text not null default '',
  status task_status not null default 'open',
  priority task_priority not null default 'normal',
  due_date date not null,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  check (
    (status = 'done' and completed_at is not null)
    or (status <> 'done' and completed_at is null)
  )
);

create index project_tasks_project_id_idx on project_tasks(project_id);
create index project_tasks_assigned_worker_id_idx on project_tasks(assigned_worker_id);
create index project_tasks_due_date_idx on project_tasks(due_date);
create index project_tasks_status_idx on project_tasks(status);

alter table project_tasks enable row level security;

create policy "admins manage project tasks"
on project_tasks for all
using (public.is_admin())
with check (public.is_admin());

grant usage on type task_status to authenticated;
grant usage on type task_priority to authenticated;
grant select, insert, update, delete on table project_tasks to authenticated;
