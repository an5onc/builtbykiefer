create extension if not exists pgcrypto;

create type app_role as enum ('admin', 'customer', 'employee', 'subcontractor');
create type lead_status as enum ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost');
create type project_status as enum ('planning', 'active', 'paused', 'completed');
create type phase_status as enum ('completed', 'in-progress', 'upcoming');
create type file_visibility as enum ('internal', 'customer');
create type invoice_status as enum ('draft', 'sent', 'paid');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role app_role not null default 'customer',
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

create table project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  body text not null,
  visibility file_visibility not null default 'customer',
  update_date date not null default current_date,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
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

create index project_phases_project_id_idx on project_phases(project_id);
create index project_updates_project_id_idx on project_updates(project_id);
create index project_files_project_id_idx on project_files(project_id);
create index time_entries_project_id_idx on time_entries(project_id);
create index time_entries_worker_id_idx on time_entries(worker_id);
create index invoices_project_id_idx on invoices(project_id);
create index invoice_line_items_invoice_id_idx on invoice_line_items(invoice_id);

alter table profiles enable row level security;
alter table clients enable row level security;
alter table leads enable row level security;
alter table projects enable row level security;
alter table project_phases enable row level security;
alter table project_updates enable row level security;
alter table project_files enable row level security;
alter table workers enable row level security;
alter table time_entries enable row level security;
alter table invoices enable row level security;
alter table invoice_line_items enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do update
    set email = excluded.email;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create policy "users can read own profile"
on profiles for select
using (id = auth.uid());

create policy "admins can read profiles"
on profiles for select
using (public.is_admin());

create policy "admins can update profiles"
on profiles for update
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage clients"
on clients for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage leads"
on leads for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage projects"
on projects for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage project phases"
on project_phases for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage project updates"
on project_updates for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage project files"
on project_files for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage workers"
on workers for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage time entries"
on time_entries for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage invoices"
on invoices for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage invoice line items"
on invoice_line_items for all
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('project-documents', 'project-documents', false, 52428800, array['application/pdf', 'image/png', 'image/jpeg']),
  ('project-photos', 'project-photos', false, 52428800, array['image/png', 'image/jpeg', 'image/webp']),
  ('invoice-pdfs', 'invoice-pdfs', false, 10485760, array['application/pdf'])
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "admins manage private project storage"
on storage.objects for all
using (
  bucket_id in ('project-documents', 'project-photos', 'invoice-pdfs')
  and public.is_admin()
)
with check (
  bucket_id in ('project-documents', 'project-photos', 'invoice-pdfs')
  and public.is_admin()
);
