# Kiefer Built Agent Handoff Guide

This file is the durable orientation document for agents working in this repo. Keep it current when project structure, runtime, environment, deployment, or handoff expectations change.

## What This Project Is

This repo powers the Kiefer Built Contracting public website plus a custom construction operations platform.

- Public marketing site: brand/front-door pages for custom homes, renovations, commercial work, service areas, process, projects, team, careers, testimonials, vendors, and contact/quote intake.
- Admin operations system: `/admin` and `/login`, with Buildertrend-familiar modules for leads, proposals, projects, schedule, tasks, comments, daily logs, selections, RFIs, files/photos, invoices, change orders, purchasing, warranty, vendors, reports, and finance tools.
- Client portal: `/portal` and `/portal/login`, authenticated owner-facing project dashboard and project detail views.
- Vendor portal: `/vendor` and `/vendor/login`, authenticated trade partner workboard for assignments, RFIs, shared documents, and submittals.
- Public quote request: `/#contact` posts to `/api/quote-request`, creates CRM leads, and optionally sends Resend email notifications.

## Current Stack / Runtime Truth

Source of truth: `package.json`, `next.config.ts`, `tsconfig.json`, `vitest.config.ts`, and `eslint.config.mjs`.

- Node package manager: npm with `package-lock.json`.
- Framework: Next.js 16 App Router.
- React: React 19.
- TypeScript: strict mode, `@/*` alias to `src/*`.
- Styling: Tailwind CSS 4 through global CSS/theme tokens.
- UI/animation libraries: Framer Motion, Lucide React, `yet-another-react-lightbox`.
- Backend/data: Supabase Auth, Postgres, Storage, and RLS migrations under `supabase/migrations`.
- Auth integration: `@supabase/ssr` server/browser clients.
- Validation: Zod.
- PDFs: `@react-pdf/renderer`.
- Tests: Vitest.
- Lint: ESLint 9 with Next core web vitals and TypeScript config.
- Browser QA: Playwright is installed as a dev dependency for local screenshot/regression checks.

This is not a static export app. Server-side routes, auth, Supabase access, and PDF/download routes are part of the current app.

## Important Source-of-Truth Files

Project setup and handoff:

- `AGENTS.md` - this file.
- `.sessions/SESSION_INDEX.md` - newest-first handoff index.
- `.sessions/TEMPLATE.md` - template for future session handoffs.
- `README.md` - project overview and local setup.
- `docs/deployment-production-checklist.md` - deployment checklist and smoke tests.

Public site:

- `src/app/page.tsx` - homepage.
- `src/components/Header.tsx` and `src/components/Footer.tsx` - shared public shell.
- `src/components/public-site/PublicPage.tsx` - shared renderer for many marketing pages.
- `src/lib/public-site/content.ts` - central content for public marketing pages.
- `src/components/Contact.tsx` - public quote/contact form.
- `src/app/api/quote-request/route.ts` - quote request API.
- `src/lib/contact/quote-request.ts` and `src/lib/contact/quote-email.ts` - quote parsing, CRM lead mapping, and email content.
- `public/images/` - public photography and brand assets.

Operations platform:

- `src/components/admin/AdminShell.tsx` - admin shell.
- `src/components/admin/AdminModuleNav.tsx` - Buildertrend-style module navigation.
- `src/lib/admin/navigation.ts` - admin navigation taxonomy.
- `src/app/admin/page.tsx` - command center.
- `src/app/admin/**` - admin module routes.
- `src/lib/admin/queries.ts` - Supabase persistence with demo fallback.
- `src/lib/admin/types.ts` - admin domain types.
- `src/lib/admin/demo-data.ts` - demo/fallback records.
- `src/lib/admin/supabase-mappers.ts` - Supabase row mapping.

Auth and portals:

- `src/proxy.ts` - route protection/middleware behavior.
- `src/app/login/**` - admin login.
- `src/app/auth/callback/route.ts` - shared auth callback.
- `src/lib/admin/auth.ts` - admin session checks.
- `src/lib/admin/client-auth.ts` - client portal session checks.
- `src/lib/admin/vendor-auth.ts` - vendor portal session checks.
- `src/app/portal/**` - client portal.
- `src/app/vendor/**` - vendor portal.

Supabase:

- `src/lib/supabase/env.ts` - parsed public Supabase/demo env.
- `src/lib/supabase/server.ts` and `src/lib/supabase/client.ts` - SSR/browser clients.
- `supabase/migrations/` - ordered database/RLS/storage migrations.
- `supabase/seed.sql` - local seed data.
- `supabase/config.toml` - local Supabase CLI config.

CRM/sales narrative:

- `docs/kiefer-built-crm-feature-inventory.md` - current product inventory for sales/demo/proposal work.
- `docs/kiefer-built-vs-buildertrend-comparison.md` - comparison/proposal material.

## Environment Variables

Active source truth is `src/lib/supabase/env.ts`, auth helpers, and `src/app/api/quote-request/route.ts`.

Required for a real Supabase-backed environment:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAIL=owner@example.com
```

Optional but recommended for quote notification email:

```env
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL_FROM=Kiefer Built <quotes@builtbykiefer.com>
CONTACT_EMAIL_TO=info@kbuiltco.com
```

Demo/local fallback:

```env
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Notes:

- `NEXT_PUBLIC_DEMO_MODE` defaults to demo mode unless set exactly to `false`.
- The app currently reads Supabase URL and anon key, not a Supabase service-role key.
- `ADMIN_EMAIL` narrows admin access when set. If omitted, any authenticated Supabase user with `profiles.role = 'admin'` can pass the allow-list check.
- `NEXT_PUBLIC_APP_URL` is used to build login/callback URLs and defaults to `http://localhost:3000` in several helpers.
- `CONTACT_EMAIL_TO` defaults to `info@kbuiltco.com` when unset.
- `CONTACT_EMAIL_FROM` must use a sender domain verified by the email provider.

## Common Commands

Install:

```bash
npm install
```

Develop:

```bash
npm run dev
```

Default local URL:

```text
http://localhost:3000
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Supabase local workflows, when needed:

```bash
supabase start
supabase db reset
supabase migration list --linked
supabase db push --dry-run
```

Only run linked Supabase commands when the CLI is installed and authenticated for the intended project.

## Deployment Notes

- Public production domains are documented in `README.md` and `docs/deployment-production-checklist.md`.
- README currently states Vercel auto-deploys from `main`; verify Vercel project settings before relying on this.
- Production/preview environment variables must be configured before relying on admin, portal, vendor, Supabase, and email flows.
- Supabase Auth redirect URLs must include the deployed origin plus `/auth/callback`.
- Run the deployment checklist smoke tests after any production or client-review deploy.

## Working Rules For Future Agents

- Work from the current branch unless the user explicitly asks for a separate branch. Recent cosmetic work has intentionally happened directly on `main`.
- Always inspect `git status --short --branch` before editing. The worktree may contain user changes; never revert or overwrite unrelated changes.
- Treat `package.json`, current source files, and Supabase migrations as stronger truth than older prose docs.
- Keep cosmetic edits small and easy to review locally.
- Prefer existing patterns: shared public content through `PublicPage`/`publicPages`, admin UI through `AdminShell`, data through `src/lib/admin/queries.ts`, and migrations for schema/RLS changes.
- Use `rg`/`rg --files` for code searches.
- Use `apply_patch` for manual text/code edits.
- Do not commit, push, merge, or deploy unless the user explicitly asks.
- If adding/changing Supabase behavior, use migrations and update tests/docs around auth/RLS implications.
- For frontend visual changes, use Playwright/browser screenshots when possible and verify desktop/mobile crops/layouts before presenting the change.
- Keep public pages visually aligned with the current Kiefer direction: real photography, dark charcoal, warm cream, restrained red accents, and clear construction-specific content.
- Keep admin/portal UI dense, practical, and task-oriented rather than marketing-like.

## End-of-Session Handoff Protocol

At the end of any meaningful session:

1. Run `git status --short --branch`.
2. Record what changed, why, and exact files touched.
3. Record verification commands run and their results. If blocked, record exact blocker and what would unblock it.
4. Record any running local services, ports, or background sessions.
5. Record known dirty worktree items and whether they were pre-existing, user-made, or agent-made when known.
6. Add a dated `.sessions/YYYY-MM-DD-short-slug.md` entry using `.sessions/TEMPLATE.md`.
7. Add the new file to the top of `.sessions/SESSION_INDEX.md`.
8. Do not claim completion without fresh verification evidence from the current session.

