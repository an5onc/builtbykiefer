alter table clients
  add column if not exists auth_user_id uuid references auth.users(id) on delete set null;

create unique index if not exists clients_auth_user_id_unique_idx
on clients(auth_user_id)
where auth_user_id is not null;

create index if not exists clients_email_lower_idx
on clients(lower(email));

create or replace function public.is_project_client(project_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.projects
    join public.clients on clients.id = projects.client_id
    where projects.id = project_uuid
      and (
        auth.uid() is not null
        or coalesce(auth.jwt() ->> 'email', '') <> ''
      )
      and (
        clients.auth_user_id = auth.uid()
        or lower(clients.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  );
$$;

do $$
begin
  if to_regclass('public.project_photos') is not null then
    execute 'drop policy if exists "clients view shared project photos" on project_photos';
    execute 'revoke select on table project_photos from anon';
  end if;

  if to_regclass('public.project_selections') is not null then
    execute 'drop policy if exists "clients view shared project selections" on project_selections';
    execute 'drop policy if exists "clients approve submitted project selections" on project_selections';
    execute 'revoke select on table project_selections from anon';
    execute 'revoke update (status, approved_at, approved_by_name) on table project_selections from anon';
  end if;

  if to_regclass('public.change_orders') is not null then
    execute 'drop policy if exists "clients view sent change orders" on change_orders';
    execute 'drop policy if exists "clients approve sent change orders" on change_orders';
    execute 'revoke select on table change_orders from anon';
    execute 'revoke update (status, approved_at, approved_by_name) on table change_orders from anon';
  end if;

  if to_regclass('public.change_order_line_items') is not null then
    execute 'drop policy if exists "clients view sent change order line items" on change_order_line_items';
    execute 'revoke select on table change_order_line_items from anon';
  end if;

  if to_regclass('public.warranty_items') is not null then
    execute 'drop policy if exists "clients view shared warranty items" on warranty_items';
    execute 'revoke select on table warranty_items from anon';
  end if;
end $$;

create policy "clients view own client profile"
on clients for select
to authenticated
using (
  auth_user_id = auth.uid()
  or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

create policy "clients view own projects"
on projects for select
to authenticated
using (public.is_project_client(id));

create policy "clients view own project phases"
on project_phases for select
to authenticated
using (public.is_project_client(project_id));

create policy "clients view own project updates"
on project_updates for select
to authenticated
using (visibility = 'customer' and public.is_project_client(project_id));

create policy "clients view own project files"
on project_files for select
to authenticated
using (visibility = 'customer' and public.is_project_client(project_id));

create policy "clients view own invoices"
on invoices for select
to authenticated
using (public.is_project_client(project_id));

create policy "clients view own invoice line items"
on invoice_line_items for select
to authenticated
using (
  exists (
    select 1
    from invoices
    where invoices.id = invoice_line_items.invoice_id
      and public.is_project_client(invoices.project_id)
  )
);

do $$
begin
  if to_regclass('public.project_comments') is not null then
    execute $policy$
      create policy "clients view own project comments"
      on project_comments for select
      to authenticated
      using (visibility = 'customer' and public.is_project_client(project_id))
    $policy$;
  end if;

  if to_regclass('public.project_daily_logs') is not null then
    execute $policy$
      create policy "clients view own project daily logs"
      on project_daily_logs for select
      to authenticated
      using (visibility = 'customer' and public.is_project_client(project_id))
    $policy$;
  end if;

  if to_regclass('public.project_photos') is not null then
    execute $policy$
      create policy "clients view own project photos"
      on project_photos for select
      to authenticated
      using (visibility = 'customer' and public.is_project_client(project_id))
    $policy$;
  end if;

  if to_regclass('public.project_selections') is not null then
    execute $policy$
      create policy "clients view own project selections"
      on project_selections for select
      to authenticated
      using (
        public.is_project_client(project_id)
        and status in ('submitted', 'approved', 'ordered')
      )
    $policy$;

    execute $policy$
      create policy "clients approve own submitted selections"
      on project_selections for update
      to authenticated
      using (
        public.is_project_client(project_id)
        and status = 'submitted'
      )
      with check (
        public.is_project_client(project_id)
        and status = 'approved'
        and approved_at is not null
        and length(btrim(approved_by_name)) > 0
      )
    $policy$;
  end if;

  if to_regclass('public.project_rfis') is not null then
    execute $policy$
      create policy "clients view own project rfis"
      on project_rfis for select
      to authenticated
      using (visibility = 'customer' and public.is_project_client(project_id))
    $policy$;
  end if;

  if to_regclass('public.change_orders') is not null then
    execute $policy$
      create policy "clients view own sent change orders"
      on change_orders for select
      to authenticated
      using (
        public.is_project_client(project_id)
        and status in ('sent', 'approved')
      )
    $policy$;

    execute $policy$
      create policy "clients approve own sent change orders"
      on change_orders for update
      to authenticated
      using (
        public.is_project_client(project_id)
        and status = 'sent'
      )
      with check (
        public.is_project_client(project_id)
        and status = 'approved'
        and approved_at is not null
        and length(btrim(approved_by_name)) > 0
      )
    $policy$;
  end if;

  if to_regclass('public.change_order_line_items') is not null then
    execute $policy$
      create policy "clients view own change order line items"
      on change_order_line_items for select
      to authenticated
      using (
        exists (
          select 1
          from change_orders
          where change_orders.id = change_order_line_items.change_order_id
            and public.is_project_client(change_orders.project_id)
            and change_orders.status in ('sent', 'approved')
        )
      )
    $policy$;
  end if;

  if to_regclass('public.warranty_items') is not null then
    execute $policy$
      create policy "clients view own warranty items"
      on warranty_items for select
      to authenticated
      using (visibility = 'customer' and public.is_project_client(project_id))
    $policy$;
  end if;
end $$;

grant select on table clients to authenticated;
grant select on table projects to authenticated;
grant select on table project_phases to authenticated;
grant select on table project_updates to authenticated;
grant select on table project_files to authenticated;
grant select on table invoices to authenticated;
grant select on table invoice_line_items to authenticated;

do $$
begin
  if to_regclass('public.project_comments') is not null then
    execute 'grant select on table project_comments to authenticated';
  end if;

  if to_regclass('public.project_daily_logs') is not null then
    execute 'grant select on table project_daily_logs to authenticated';
  end if;

  if to_regclass('public.project_photos') is not null then
    execute 'grant select on table project_photos to authenticated';
  end if;

  if to_regclass('public.project_selections') is not null then
    execute 'grant select on table project_selections to authenticated';
    execute 'grant update (status, approved_at, approved_by_name) on table project_selections to authenticated';
  end if;

  if to_regclass('public.project_rfis') is not null then
    execute 'grant select on table project_rfis to authenticated';
  end if;

  if to_regclass('public.change_orders') is not null then
    execute 'grant select on table change_orders to authenticated';
    execute 'grant update (status, approved_at, approved_by_name) on table change_orders to authenticated';
  end if;

  if to_regclass('public.change_order_line_items') is not null then
    execute 'grant select on table change_order_line_items to authenticated';
  end if;

  if to_regclass('public.warranty_items') is not null then
    execute 'grant select on table warranty_items to authenticated';
  end if;
end $$;
