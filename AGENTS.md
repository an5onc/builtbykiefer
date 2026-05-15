# Built By Kiefer CRM Session Memory

This repo is the Kiefer Built Contracting website plus a custom construction CRM intended to replace and improve on Buildertrend while keeping Kiefer's branding and ownership front and center.

## Current Direction

- Build one practical CRM feature at a time.
- Keep the admin UX familiar to Buildertrend so Kiefer employees can switch with minimal training.
- Keep the visual identity clearly Kiefer Built, not third-party software.
- Treat `/admin` as the manager operations system and `/portal` as the client-facing owner experience.
- Keep a feature inventory for the eventual sales proposal to Kiefer Built.

## Important Files

- Feature inventory / sales proposal source: `docs/kiefer-built-crm-feature-inventory.md`
- Admin queries and Supabase persistence: `src/lib/admin/queries.ts`
- Admin domain types: `src/lib/admin/types.ts`
- Demo CRM data: `src/lib/admin/demo-data.ts`
- Client-safe portal projection: `src/lib/admin/client-portal.ts`
- Admin project hub: `src/app/admin/projects/[projectId]/page.tsx`
- Client portal project page: `src/app/portal/projects/[projectId]/page.tsx`
- Supabase migrations: `supabase/migrations/`

## Completed CRM Capabilities

- Supabase-backed admin login with approved-admin access.
- Password visibility toggle on login.
- Buildertrend-style horizontal module navigation with dropdowns.
- Admin command center with linked metric cards.
- Leads and proposal workflow.
- Projects as the central job hub.
- Schedule, tasks, comments, field reports/daily logs, selections, RFIs, files, invoices, change orders, purchase orders, bills, warranty, and punch-list items.
- Client portal dashboard at `/portal`.
- Project client portal at `/portal/projects/[projectId]`.
- Project photo gallery at `/admin/photos` and per-project photo creation at `/admin/projects/[projectId]/photos/new`.
- Subcontractor/vendor directory at `/admin/vendors`, project assignment flow at `/admin/projects/[projectId]/vendors/new`, and vendor workboard at `/vendor`.
- Reporting dashboard at `/admin/reports`.
- Route-aware floating action cleanup so admin/login routes do not show public marketing widgets.
- Feature inventory doc for later pricing/proposal/demo discussion.

## Most Recent Feature

Kiefer Built finance tools were added.

- `/admin/finance-tools` provides Kiefer Built-branded accounting utilities.
- Built first tools: Kiefer Built Payment Planner and Kiefer Built Rate Check.
- `src/lib/admin/finance-tools.ts` contains tested standard finance calculations.
- Navigation now links Finance Tools under Financial and Reports.
- Keep positioning as Kiefer Built planning checks that package standard formulas in Kiefer workflows.
- Next finance tools: draw/retainage planner, NPV/IRR decision helper, and change impact checker.

Verification completed after this feature:

- `npm test` passed.
- `npm run typecheck` passed.
- `npm run lint` passed with existing unrelated warnings only.
- `npm run build` passed.
- Latest verification should include `/admin/finance-tools`.

## Supabase Notes

- Use the local Supabase skill/workflow for Supabase tasks.
- New schema changes should be migrations under `supabase/migrations/`.
- The current portal is effectively public-by-project URL. Public portal write actions should be narrowly scoped with RLS until a proper client login system is added.
- The latest approval migrations grant anon select/update narrowly for shared selection/change-order approval behavior.

## Known Repo State

- The worktree is intentionally dirty with many CRM features added but not committed.
- Do not revert unrelated files. Several files are untracked because they are new CRM modules.
- Existing lint warnings are in unrelated marketing files/components and were present outside the latest CRM approval feature.

## Next Good Features

Strong next candidates:

- Vendor-facing document/RFI exchange once proper vendor authentication exists.
- Finance tools: draw/retainage planner, NPV/IRR decision helper, and change impact checker.
- Proposal/deck generation from the feature inventory.

Best next step if continuing immediately: add draw/retainage and NPV/IRR calculators to `/admin/finance-tools`, or build a polished sales proposal/deck using the feature inventory.


<claude-mem-context>
# Memory Context

# claude-mem status

This project has no memory yet. The current session will seed it; subsequent sessions will receive auto-injected context for relevant past work.

Memory injection starts on your second session in a project.

`/learn-codebase` is available if the user wants to front-load the entire repo into memory in a single pass (~5 minutes on a typical repo, optional). Otherwise memory builds passively as work happens.

Live activity: http://localhost:37701
How it works: `/how-it-works`

This message disappears once the first observation lands.
</claude-mem-context>
