create table project_financial_targets (
  project_id uuid primary key references projects(id) on delete cascade,
  contract_value numeric(12, 2) not null default 0 check (contract_value >= 0),
  budgeted_cost numeric(12, 2) not null default 0 check (budgeted_cost >= 0),
  target_margin_percent numeric(5, 2) not null default 0 check (target_margin_percent >= 0 and target_margin_percent <= 100),
  contingency_percent numeric(5, 2) not null default 0 check (contingency_percent >= 0 and contingency_percent <= 100),
  updated_at timestamptz not null default now()
);

alter table project_financial_targets enable row level security;

create policy "admins manage project financial targets"
on project_financial_targets for all
using (public.is_admin())
with check (public.is_admin());

grant select, insert, update, delete on table project_financial_targets to authenticated;
