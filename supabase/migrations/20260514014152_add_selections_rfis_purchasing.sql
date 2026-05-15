create type selection_status as enum ('needed', 'submitted', 'approved', 'ordered');
create type rfi_status as enum ('open', 'answered', 'closed');
create type purchase_order_status as enum ('draft', 'sent', 'approved', 'received');
create type bill_status as enum ('draft', 'received', 'paid');

create table project_selections (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  category text not null,
  title text not null,
  allowance_amount numeric(12,2) not null default 0 check (allowance_amount >= 0),
  selected_option text not null default '',
  vendor text not null default '',
  due_date date not null,
  status selection_status not null default 'needed',
  internal_notes text not null default '',
  client_notes text not null default '',
  created_at timestamptz not null default now()
);

create table project_rfis (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  question text not null,
  answer text not null default '',
  requested_by text not null,
  due_date date not null,
  status rfi_status not null default 'open',
  visibility file_visibility not null default 'internal',
  created_at timestamptz not null default now(),
  answered_at timestamptz
);

create table purchase_orders (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  po_number text not null unique,
  title text not null,
  vendor text not null,
  amount numeric(12,2) not null default 0 check (amount >= 0),
  status purchase_order_status not null default 'draft',
  due_date date not null,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table bills (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  bill_number text not null,
  vendor text not null,
  amount numeric(12,2) not null default 0 check (amount >= 0),
  status bill_status not null default 'draft',
  due_date date not null,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create unique index bills_project_bill_number_idx on bills(project_id, bill_number);

create index project_selections_project_id_idx on project_selections(project_id);
create index project_selections_due_date_idx on project_selections(due_date);
create index project_selections_status_idx on project_selections(status);

create index project_rfis_project_id_idx on project_rfis(project_id);
create index project_rfis_due_date_idx on project_rfis(due_date);
create index project_rfis_status_idx on project_rfis(status);
create index project_rfis_visibility_idx on project_rfis(visibility);

create index purchase_orders_project_id_idx on purchase_orders(project_id);
create index purchase_orders_due_date_idx on purchase_orders(due_date);
create index purchase_orders_status_idx on purchase_orders(status);

create index bills_project_id_idx on bills(project_id);
create index bills_due_date_idx on bills(due_date);
create index bills_status_idx on bills(status);

alter table project_selections enable row level security;
alter table project_rfis enable row level security;
alter table purchase_orders enable row level security;
alter table bills enable row level security;

create policy "admins manage project selections"
on project_selections for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage project rfis"
on project_rfis for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage purchase orders"
on purchase_orders for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage bills"
on bills for all
using (public.is_admin())
with check (public.is_admin());

grant usage on type selection_status to authenticated;
grant usage on type rfi_status to authenticated;
grant usage on type purchase_order_status to authenticated;
grant usage on type bill_status to authenticated;
grant select, insert, update, delete on table project_selections to authenticated;
grant select, insert, update, delete on table project_rfis to authenticated;
grant select, insert, update, delete on table purchase_orders to authenticated;
grant select, insert, update, delete on table bills to authenticated;
