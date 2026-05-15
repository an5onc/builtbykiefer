create type warranty_item_type as enum ('warranty', 'punch-list');
create type warranty_item_status as enum ('open', 'scheduled', 'resolved', 'closed');
create type warranty_item_priority as enum ('low', 'normal', 'high');

alter table change_orders
  add column if not exists approved_by_name text not null default '';

create table warranty_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  item_type warranty_item_type not null default 'punch-list',
  title text not null,
  description text not null,
  location text not null default '',
  requested_by text not null,
  status warranty_item_status not null default 'open',
  priority warranty_item_priority not null default 'normal',
  due_date date not null,
  visibility file_visibility not null default 'internal',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index warranty_items_project_id_idx on warranty_items(project_id);
create index warranty_items_due_date_idx on warranty_items(due_date);
create index warranty_items_status_idx on warranty_items(status);
create index warranty_items_visibility_idx on warranty_items(visibility);

alter table warranty_items enable row level security;

create policy "admins manage warranty items"
on warranty_items for all
using (public.is_admin())
with check (public.is_admin());

create policy "clients view shared warranty items"
on warranty_items for select
to anon
using (visibility = 'customer');

grant usage on type warranty_item_type to authenticated, anon;
grant usage on type warranty_item_status to authenticated, anon;
grant usage on type warranty_item_priority to authenticated, anon;
grant select, insert, update, delete on table warranty_items to authenticated;
grant select on table warranty_items to anon;

grant select on table change_orders to anon;
grant select on table change_order_line_items to anon;
grant update (status, approved_at, approved_by_name) on table change_orders to anon;

create policy "clients view sent change orders"
on change_orders for select
to anon
using (status in ('sent', 'approved'));

create policy "clients view sent change order line items"
on change_order_line_items for select
to anon
using (
  exists (
    select 1
    from change_orders
    where change_orders.id = change_order_line_items.change_order_id
      and change_orders.status in ('sent', 'approved')
  )
);

create policy "clients approve sent change orders"
on change_orders for update
to anon
using (status = 'sent')
with check (
  status = 'approved'
  and approved_at is not null
  and length(btrim(approved_by_name)) > 0
);
