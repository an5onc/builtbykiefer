-- Remediation: add missing foreign-key covering indexes — finding M3 (unindexed_foreign_keys)
-- DRAFTED, NOT YET APPLIED. Review, then apply with `supabase db push`.
--
-- These 5 FK columns have no covering index, so a delete/update on the parent (or a join/filter
-- on the FK) does a sequential scan. Harmless today (all tables are empty) but will degrade once
-- real rows land.
--
-- Tables are currently empty, so a plain CREATE INDEX is instant and safe inside this transaction.
-- If any of these tables holds significant data by the time you apply this, run the matching
-- statement OUT OF BAND with `CREATE INDEX CONCURRENTLY` (outside a transaction) instead, to avoid
-- taking a write lock.

create index if not exists idx_projects_client_id
  on public.projects (client_id);

create index if not exists idx_invoices_client_id
  on public.invoices (client_id);

create index if not exists idx_project_comments_created_by
  on public.project_comments (created_by);

create index if not exists idx_project_updates_created_by
  on public.project_updates (created_by);

create index if not exists idx_project_finance_snapshots_created_by
  on public.project_finance_snapshots (created_by);
