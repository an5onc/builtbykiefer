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
- Public quote request API: `src/app/api/quote-request/route.ts`
- Public quote request parsing/email/lead mapping: `src/lib/contact/quote-request.ts`, `src/lib/contact/quote-email.ts`
- Admin domain types: `src/lib/admin/types.ts`
- Demo CRM data: `src/lib/admin/demo-data.ts`
- Client-safe portal projection: `src/lib/admin/client-portal.ts`
- Client portal auth helpers: `src/lib/admin/client-auth.ts`
- Client portal login: `src/app/portal/login/page.tsx`
- Admin project hub: `src/app/admin/projects/[projectId]/page.tsx`
- Client portal project page: `src/app/portal/projects/[projectId]/page.tsx`
- Supabase migrations: `supabase/migrations/`

## Completed CRM Capabilities

- Supabase-backed admin login with approved-admin access.
- Password visibility toggle on login.
- Buildertrend-style horizontal module navigation with dropdowns.
- Admin command center with linked metric cards.
- Leads and proposal workflow.
- Public website quote form saves completed requests into `/admin/leads` as `Website Quote Request` leads; email notification remains optional.
- Projects as the central job hub.
- Schedule, tasks, comments, field reports/daily logs, selections, RFIs, files, invoices, change orders, purchase orders, bills, warranty, and punch-list items.
- Authenticated client portal login at `/portal/login`.
- Authenticated client portal dashboard at `/portal`, filtered to the signed-in client.
- Authenticated project client portal at `/portal/projects/[projectId]`, with project ownership checks.
- Client needs-attention summary for selections, RFIs, change orders, warranty/punch-list items, and invoice balance.
- Client approval actions for selections and change orders are guarded by signed-in client project access.
- Project photo gallery at `/admin/photos` and per-project photo creation at `/admin/projects/[projectId]/photos/new`.
- Subcontractor/vendor directory at `/admin/vendors`, project assignment flow at `/admin/projects/[projectId]/vendors/new`, and vendor workboard at `/vendor`.
- Reporting dashboard at `/admin/reports`.
- Route-aware floating action cleanup so admin/login routes do not show public marketing widgets.
- Feature inventory doc for later pricing/proposal/demo discussion.

## Most Recent Feature

Website quote request CRM lead capture was added on 2026-05-17.

- The public contact form at `/#contact` now posts to `/api/quote-request` and creates a CRM lead before attempting any email notification.
- `src/lib/contact/quote-request.ts` maps validated quote payloads into `LeadCreateInput` with status `new`, next-day follow-up, and notes marked `Website Quote Request`.
- `/api/quote-request` now returns success when the lead is saved, even if Resend/email delivery is not configured.
- `supabase/migrations/20260517225648_allow_public_quote_lead_capture.sql` grants narrow anonymous insert access to `leads` with an RLS check, without public read/update/delete access.
- Feature inventory was updated with website-to-CRM intake selling points.

Verification completed after this feature:

- `npm run typecheck` passed.
- `npm test` passed: 36 test files, 131 tests.
- `npm run lint` passed with one existing unrelated Google Tag Manager warning in `src/app/layout.tsx`.
- `npm run build` passed.
- `supabase db push --dry-run` showed two pending remote migrations: `20260516183123_secure_client_portal_auth.sql` and `20260517225648_allow_public_quote_lead_capture.sql`.

## Supabase Notes

- Use the local Supabase skill/workflow for Supabase tasks.
- New schema changes should be migrations under `supabase/migrations/`.
- Client portal is now designed around authenticated Supabase client sessions, not public project URLs.
- Apply `supabase/migrations/20260516183123_secure_client_portal_auth.sql` before relying on production RLS behavior.
- Apply `supabase/migrations/20260517225648_allow_public_quote_lead_capture.sql` before relying on the public website form to create live Supabase leads.
- Client records should either have `clients.auth_user_id` linked to the Supabase Auth user id or have an email that matches the client's login email.
- The latest client portal migration revokes older anonymous client approval grants for selections, change orders, warranty items, and client-visible project photos.
- The quote-lead migration allows insert-only anonymous access to `leads` for validated website quote requests; do not add public select/update/delete access.

## Known Repo State

- The worktree is intentionally dirty with many CRM features added but not committed.
- Do not revert unrelated files. Several files are untracked because they are new CRM modules.
- Existing lint warnings are in unrelated marketing files/components and were present outside the latest CRM approval feature.

## Next Good Features

Strong next candidates:

- Vendor-facing document/RFI exchange once proper vendor authentication exists.
- Finance tools: draw/retainage planner, NPV/IRR decision helper, and change impact checker.
- Proposal/deck generation from the feature inventory.
- Admin UI for linking client records to Supabase Auth users, so Kiefer can manage portal access without touching SQL.

Best next step if continuing immediately: decide whether to push pending Supabase migrations to the linked project, then smoke test a real quote form submission and confirm it appears in `/admin/leads`.


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
