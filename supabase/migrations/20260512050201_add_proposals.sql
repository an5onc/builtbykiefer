create type proposal_status as enum ('draft', 'sent', 'approved', 'declined');

create table proposals (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  proposal_number text not null unique,
  title text not null,
  status proposal_status not null default 'draft',
  client_name text not null,
  client_email text not null,
  scope_summary text not null default '',
  internal_notes text not null default '',
  valid_until date not null,
  created_at timestamptz not null default now()
);

create table proposal_line_items (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  section text not null,
  description text not null,
  quantity numeric(10, 2) not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  is_optional boolean not null default false,
  sort_order integer not null default 0
);

create index proposals_lead_id_idx on proposals(lead_id);
create index proposals_status_idx on proposals(status);
create index proposal_line_items_proposal_id_idx on proposal_line_items(proposal_id);

alter table proposals enable row level security;
alter table proposal_line_items enable row level security;

create policy "admins manage proposals"
on proposals for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage proposal line items"
on proposal_line_items for all
using (public.is_admin())
with check (public.is_admin());
