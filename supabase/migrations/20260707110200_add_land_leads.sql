-- Land Lead Finder: vacant-land direct-mail leads sourced from public
-- Larimer County and Weld County property records.

create type land_lead_county as enum ('larimer', 'weld');

create type land_lead_status as enum (
  'new',
  'reviewed',
  'contacted',
  'not_a_fit',
  'do_not_contact'
);

create table land_leads (
  id uuid primary key default gen_random_uuid(),
  county land_lead_county not null,

  -- identity
  parcel_number text not null default '',
  account_number text not null default '',
  -- Dedupe on county + parcel, falling back to county + account when the
  -- parcel number is missing. Stored generated column so PostgREST upsert
  -- can target the unique constraint directly (expression indexes cannot).
  dedupe_key text generated always as (
    coalesce(nullif(parcel_number, ''), 'acct:' || account_number)
  ) stored,

  -- owner
  owner_name text not null default '',
  owner_name_secondary text not null default '',

  -- mailing address
  mailing_address1 text not null default '',
  mailing_address2 text not null default '',
  mailing_city text not null default '',
  mailing_state text not null default '',
  mailing_zip text not null default '',

  -- situs (property) address
  situs_address text not null default '',
  situs_city text not null default '',
  situs_state text not null default 'CO',
  situs_zip text not null default '',

  -- land characteristics
  acreage numeric(10, 3),
  property_class text not null default '',
  land_use text not null default '',
  zoning text not null default '',

  -- sale
  sale_date date,
  sale_price numeric(12, 2),
  deed_type text not null default '',

  -- assessed / actual values
  land_actual_value numeric(12, 2),
  improvement_actual_value numeric(12, 2),
  total_actual_value numeric(12, 2),

  -- derived signals
  is_likely_vacant boolean not null default false,
  is_entity_owner boolean not null default false,
  mailing_differs_from_situs boolean not null default false,
  in_target_market boolean not null default false,

  -- scoring
  lead_score smallint not null default 0 check (lead_score between -100 and 100),
  lead_reason text not null default '',

  -- provenance / refresh tracking
  source_dataset text not null default '',
  source_row_hash text not null default '',
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  last_refreshed_at timestamptz not null default now(),

  -- admin workflow (preserved across refresh)
  status land_lead_status not null default 'new',
  notes text not null default '',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint land_leads_identity check (
    nullif(parcel_number, '') is not null or nullif(account_number, '') is not null
  ),
  constraint land_leads_county_dedupe_key unique (county, dedupe_key)
);

create index land_leads_score_idx on land_leads (lead_score desc);
create index land_leads_sale_date_idx on land_leads (sale_date desc nulls last);
create index land_leads_status_idx on land_leads (status);
create index land_leads_county_idx on land_leads (county);

alter table land_leads enable row level security;

create policy "admins manage land leads"
on land_leads for all
using (public.is_admin())
with check (public.is_admin());

grant select, insert, update, delete on table land_leads to authenticated;
