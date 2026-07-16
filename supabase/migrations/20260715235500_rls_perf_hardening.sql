-- Remediation: RLS performance hardening — findings M1 (auth_rls_initplan) + M2 (multiple_permissive_policies)
-- DRAFTED, NOT YET APPLIED. Review, then apply with `supabase db push`.
--
-- ── M2: multiple_permissive_policies ────────────────────────────────────────────
-- Every "admins manage <x>" policy is `FOR ALL TO public`, so it stacks a second permissive
-- policy onto every anon/authenticated cohort policy on the same table+command. is_admin() is
-- ALWAYS false for the `anon` role, so scoping these policies `TO authenticated` is functionally
-- a no-op that removes them from anon policy evaluation entirely. This clears every anon-side
-- overlap (notably leads/INSERT and project_rfis/SELECT) and trims anon's per-query policy list
-- across all 30 tables.
--
--   NOTE: authenticated-side overlaps (an admin catch-all + a client/vendor cohort policy on the
--   same command, e.g. change_orders, project_selections, vendor_submittals, and the ~13 tables
--   with a single client-SELECT policy) are INHERENT to the multi-cohort RLS design and are left
--   in place ON PURPOSE. Collapsing them means merging is_admin() into each cohort policy's USING
--   clause (`is_admin() OR <cohort predicate>`), which trades policy clarity for a per-row gain
--   that is immaterial at current (zero) row counts. Revisit only if a table grows large AND is
--   hot on the authenticated path.
--
-- ── M1: auth_rls_initplan ────────────────────────────────────────────────────────
-- Wrap auth.*()/is_admin() calls in a scalar sub-select so the planner evaluates them once per
-- query (InitPlan) instead of once per row. Applied to the profiles + clients policies the
-- advisor flagged.

begin;

-- ── M2: scope admin catch-all policies to `authenticated` ────────────────────────
alter policy "admins manage bills"                        on public.bills                         to authenticated;
alter policy "admins manage change order line items"      on public.change_order_line_items       to authenticated;
alter policy "admins manage change orders"                on public.change_orders                 to authenticated;
alter policy "admins manage clients"                      on public.clients                       to authenticated;
alter policy "admins manage daily logs"                   on public.daily_logs                    to authenticated;
alter policy "admins manage invoice line items"           on public.invoice_line_items            to authenticated;
alter policy "admins manage invoices"                     on public.invoices                      to authenticated;
alter policy "admins manage land leads"                   on public.land_leads                    to authenticated;
alter policy "admins manage leads"                        on public.leads                         to authenticated;
alter policy "admins manage project comments"             on public.project_comments              to authenticated;
alter policy "admins manage project files"                on public.project_files                 to authenticated;
alter policy "admins manage project finance snapshots"    on public.project_finance_snapshots     to authenticated;
alter policy "admins manage project financial targets"    on public.project_financial_targets     to authenticated;
alter policy "admins manage project phases"               on public.project_phases                to authenticated;
alter policy "admins manage project photos"               on public.project_photos                to authenticated;
alter policy "admins manage project rfis"                 on public.project_rfis                  to authenticated;
alter policy "admins manage project selections"           on public.project_selections            to authenticated;
alter policy "admins manage project tasks"                on public.project_tasks                 to authenticated;
alter policy "admins manage project updates"              on public.project_updates               to authenticated;
alter policy "admins manage project vendor assignments"   on public.project_vendor_assignments    to authenticated;
alter policy "admins manage projects"                     on public.projects                      to authenticated;
alter policy "admins manage proposal line items"          on public.proposal_line_items           to authenticated;
alter policy "admins manage proposals"                    on public.proposals                     to authenticated;
alter policy "admins manage purchase orders"              on public.purchase_orders               to authenticated;
alter policy "admins manage time entries"                 on public.time_entries                  to authenticated;
alter policy "admins manage vendor rfi responses"         on public.vendor_rfi_responses          to authenticated;
alter policy "admins manage vendor submittals"            on public.vendor_submittals             to authenticated;
alter policy "admins manage vendors"                      on public.vendors                       to authenticated;
alter policy "admins manage warranty items"               on public.warranty_items                to authenticated;
alter policy "admins manage workers"                      on public.workers                       to authenticated;

-- ── M1 + M2: profiles — merge the two permissive SELECT policies into one, scoped to authenticated
-- Before: "admins can read profiles" (is_admin()) + "users can read own profile" (id = auth.uid())
--         both FOR SELECT TO public  → 2 permissive SELECT policies for every role.
-- After:  one policy for authenticated, auth.uid()/is_admin() wrapped for InitPlan.
drop policy if exists "admins can read profiles"  on public.profiles;
drop policy if exists "users can read own profile" on public.profiles;
create policy "profiles readable by owner or admin" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id or (select public.is_admin()));

-- profiles UPDATE: keep as-is, just scope to authenticated + InitPlan-wrap is_admin().
alter policy "admins can update profiles" on public.profiles
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- ── M1: clients — InitPlan-wrap the client self-read policy (already TO authenticated) ──
alter policy "clients view own client profile" on public.clients
  using (
    (auth_user_id = (select auth.uid()))
    or (lower(email) = lower(coalesce(((select auth.jwt()) ->> 'email'), '')))
  );

commit;
