create type change_order_status as enum ('draft', 'sent', 'approved', 'declined');

create table change_orders (
  id uuid primary key default gen_random_uuid(),
  change_order_number text not null unique,
  project_id uuid not null references projects(id) on delete cascade,
  client_id uuid not null references clients(id) on delete restrict,
  title text not null,
  status change_order_status not null default 'draft',
  reason text not null default '',
  schedule_impact_days integer not null default 0 check (schedule_impact_days >= 0),
  client_message text not null default '',
  internal_notes text not null default '',
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create table change_order_line_items (
  id uuid primary key default gen_random_uuid(),
  change_order_id uuid not null references change_orders(id) on delete cascade,
  description text not null,
  quantity numeric(10, 2) not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  sort_order integer not null default 0
);

create index change_orders_project_id_idx on change_orders(project_id);
create index change_orders_client_id_idx on change_orders(client_id);
create index change_orders_status_idx on change_orders(status);
create index change_order_line_items_change_order_id_idx on change_order_line_items(change_order_id);

alter table change_orders enable row level security;
alter table change_order_line_items enable row level security;

create policy "admins manage change orders"
on change_orders for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage change order line items"
on change_order_line_items for all
using (public.is_admin())
with check (public.is_admin());
