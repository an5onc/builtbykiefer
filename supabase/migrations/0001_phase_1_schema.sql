create type app_role as enum ('admin', 'customer', 'employee', 'subcontractor');
create type lead_status as enum ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost');
create type project_status as enum ('planning', 'active', 'paused', 'completed');
create type phase_status as enum ('completed', 'in-progress', 'upcoming');
create type file_visibility as enum ('internal', 'customer');
create type invoice_status as enum ('draft', 'sent', 'paid');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role app_role not null default 'admin',
  full_name text,
  created_at timestamptz not null default now()
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  project_type text not null,
  budget_range text not null,
  status lead_status not null default 'new',
  next_follow_up date,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete restrict,
  name text not null,
  location text not null,
  type text not null,
  status project_status not null default 'planning',
  current_phase text not null,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  budget_range text not null,
  start_date date not null,
  estimated_completion date not null,
  notes text not null default '',
  hero_image text not null default '',
  created_at timestamptz not null default now()
);

create table project_phases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  description text not null,
  status phase_status not null default 'upcoming',
  date_label text not null,
  sort_order integer not null default 0
);

create table project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  name text not null,
  file_type text not null check (file_type in ('photo', 'document', 'invoice')),
  visibility file_visibility not null default 'internal',
  storage_bucket text not null,
  storage_path text not null,
  size_label text not null default '',
  uploaded_at timestamptz not null default now()
);

create table workers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table time_entries (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references workers(id) on delete restrict,
  project_id uuid not null references projects(id) on delete cascade,
  clock_in timestamptz not null,
  clock_out timestamptz,
  notes text not null default '',
  created_at timestamptz not null default now(),
  check (clock_out is null or clock_out > clock_in)
);

create table invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  project_id uuid not null references projects(id) on delete restrict,
  client_id uuid not null references clients(id) on delete restrict,
  status invoice_status not null default 'draft',
  issue_date date not null,
  due_date date not null,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table invoice_line_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  description text not null,
  quantity numeric(10, 2) not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  sort_order integer not null default 0
);

alter table profiles enable row level security;
alter table clients enable row level security;
alter table leads enable row level security;
alter table projects enable row level security;
alter table project_phases enable row level security;
alter table project_files enable row level security;
alter table workers enable row level security;
alter table time_entries enable row level security;
alter table invoices enable row level security;
alter table invoice_line_items enable row level security;

create policy "admins can read profiles" on profiles for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "admins manage clients" on clients for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
) with check (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
