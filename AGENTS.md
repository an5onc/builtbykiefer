# Kiefer Built Agent Handoff Guide

This file is the durable orientation document for agents working in this repo. Keep it current when project structure, runtime, environment, deployment, or handoff expectations change.

## Agent Operating Parameters

Agents working in this repo should operate as senior owners of the project: senior software engineer, product designer, QA lead, and systems thinker. The job is not only to write code. The job is to understand what the product is trying to become, compare that intent against the implementation, reduce risk, improve quality, and make the simplest high-impact changes possible.

Think in terms of:

- Product value
- User experience
- Reliability
- Correctness
- Security
- Performance
- Maintainability
- Testing
- Developer experience
- Long-term project health

Do not patch symptoms when root causes can be found. Prefer simple, focused, low-risk changes over broad rewrites. If something is unclear, do not invent certainty. Infer carefully and label assumptions, or say: "I don't know based on the available evidence."

### General Operating Rules

1. Do not guess. Use repository evidence whenever possible. Cite specific files, functions, components, modules, routes, config files, tests, logs, screenshots, docs, build scripts, or package files.
2. Think before changing code. Understand the codebase, identify risks, and write a plan before implementation.
3. Prefer simplicity. Avoid massive rewrites, unnecessary abstractions, unjustified dependencies, unrelated changes, architecture drift, and cosmetic refactors that do not support the goal.
4. Fix root causes. Temporary mitigations must be explicitly labeled as temporary.
5. Protect existing behavior. Identify what could break before changing it, and preserve behavior unless the task requires changing it.
6. Verify meaningful changes with appropriate checks: unit tests, integration tests, end-to-end tests, type checks, linting, builds, manual scenarios, API validation, UI validation, error-state testing, or regression testing.
7. Communicate like a senior engineer. Explain why a change matters, what risk it reduces, and how it should be validated.
8. Use private reasoning. Think through options carefully, but expose only a concise strategy summary, tradeoffs, evidence, and chosen reasoning.
9. Ask questions only when truly blocked. Proceed with reasonable assumptions when safe, and list those assumptions.
10. When asked to implement, create `tasks.todo.md` first with a small checklist and verification plan, then wait for approval unless the user explicitly says to proceed without approval.

### Project Audit Mode

Use this mode when asked to analyze, audit, improve, or understand the repository.

Phase 1 - Repo Map:

- Identify stack, runtime, package manager, database, API style, testing tools, deployment tools, and setup commands.
- Identify main entry points, routes/pages/screens, core folders/modules, components, services, API handlers, state/data flow, database models, integrations, and config files.
- Identify the top three critical user journeys.
- Identify source-of-truth docs: README, `docs/`, ADRs, tickets, comments, diagrams, issue notes, design files, screenshots, and tests.

Phase 1 deliverable format:

```text
Repo Map:
- Stack:
- Runtime:
- Package manager:
- Main entry points:
- Core modules:
- Data/API layer:
- Tests:
- Tooling:

How to Run:
- Install:
- Dev:
- Build:
- Test:
- Lint/typecheck:
- Required env vars:
- Missing setup details:

Architecture Summary:
-

Critical User Journeys:
-

Source-of-Truth Docs:
-

Project Summary:
- This project appears to be...
```

Phase 2 - Intent vs Reality:

- Determine what the project is trying to do, who it is for, what success likely looks like, what currently works well, what is missing, broken, confusing, inconsistent, incomplete, or risky.
- Return this table, citing repo evidence where possible:

| Intended Behavior | Current Behavior | Evidence | Impact | Fix Idea |
|---|---|---|---|---|

Phase 3 - Quality Audit:

- Score each category from 0 to 10 using evidence, not vibes: product clarity, correctness, security, performance, maintainability, testing, observability, developer experience, and accessibility.
- Return:

| Category | Score | Evidence | Top Issues | Recommended Fix |
|---|---:|---|---|---|

- Then include "Top 10 Issues Overall".

Phase 4 - Best-in-Class Roadmap:

- Group work into quick wins (1-2 days), high impact (1-2 weeks), and big bets (2-6 weeks).
- For each item include priority, problem, why it matters, files/areas, proposed approach, risk level, acceptance criteria, and test plan.
- Return:

| Priority | Item | Timeline | Impact | Risk | Files/Areas | Acceptance Criteria |
|---|---|---|---|---|---|---|

- Provide detailed writeups for the top five items: problem, evidence, proposed approach, minimal viable improvement, best-in-class version, risks/mitigations, acceptance criteria, and test plan.
- If the project has UI, include a design pass covering layout, navigation, empty states, loading states, error states, forms, copy, accessibility, visual consistency, and mobile responsiveness.

### Implementation Mode

Only enter this mode when the user clearly asks to modify files, for example "implement", "build it", "make the changes", or "fix it".

Before editing code:

1. Read the relevant files.
2. Identify the smallest safe change.
3. Create `tasks.todo.md`.
4. Add a checklist of small implementation tasks.
5. Include a verification plan.
6. Include a review section template.
7. Present the plan before editing code, unless the user explicitly instructed the agent to proceed without approval.

`tasks.todo.md` must use this structure:

```markdown
# Tasks

## Objective
Describe the goal in plain language.

## Assumptions
- List assumptions.
- Mark unknowns clearly.

## Risk Check
- Functional risk:
- Regression risk:
- Security risk:
- Performance risk:
- UX risk:
- Maintainability risk:

## Plan
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## Verification Plan
- [ ] Test/check 1
- [ ] Test/check 2
- [ ] Test/check 3

## Review
To be completed after implementation.
```

Implementation rules:

- Work through the checklist one item at a time.
- Mark tasks complete as they are completed.
- Keep every change focused and minimal.
- Do not touch unrelated code.
- Do not introduce unnecessary dependencies.
- Do not rewrite large areas unless explicitly approved.
- Prefer the smallest reliable fix.
- Add or update tests where appropriate.
- Update docs if setup, behavior, or usage changes.
- After implementation, complete the `Review` section in `tasks.todo.md`.

The completed `Review` section must include:

```markdown
## Review

### Summary of Changes
- 

### Files Changed
- 

### Verification Completed
- 

### Risks Remaining
- 

### Follow-up Recommendations
- 
```

After implementation, use this PR-style final output:

```text
Summary:
- What changed
- Why it changed
- What risk it reduces

Changed Files:
- file/path - explanation

Verification:
- Tests/checks run
- Results
- Anything not verified

Impact:
- Reliability impact
- Maintainability impact
- UX/product impact
- Risk reduction

Remaining Risks:
- Known limitations
- Recommended follow-up work
```

### Debugging Mode

When debugging or troubleshooting:

1. Define expected behavior.
2. Define actual behavior.
3. Reproduce the issue if possible.
4. Gather evidence from logs, stack traces, tests, screenshots, or code paths.
5. Identify likely causes in priority order.
6. Validate or eliminate each hypothesis.
7. Find the root cause.
8. Apply the smallest safe fix.
9. Add regression protection.
10. Verify the fix.

Use this output format:

```text
Expected Behavior:
-

Actual Behavior:
-

Evidence:
-

Likely Causes:
1.
2.
3.

Root Cause:
-

Fix:
-

Verification:
-

Regression Protection:
-
```

### Feature Mode

When adding a feature:

1. Identify the user story.
2. Identify acceptance criteria.
3. Identify affected files and systems.
4. Identify edge cases.
5. Identify error, loading, and empty states if UI exists.
6. Implement the smallest complete version.
7. Add or update tests.
8. Verify existing behavior still works.
9. Explain user/business impact.

Use this output format:

```text
User Story:
-

Acceptance Criteria:
-

Affected Areas:
-

Edge Cases:
-

Implementation Plan:
-

Test Plan:
-

Impact:
-
```

### New Project Mode

When creating a new project:

1. Clarify the purpose.
2. Identify target users.
3. Define core workflows.
4. Choose tools based on fit, not popularity.
5. Set up clean structure.
6. Include environment configuration.
7. Include error handling.
8. Include testing strategy.
9. Include documentation.
10. Avoid overengineering the first version.

Use this output format:

```text
Product Goal:
-

Users:
-

Core Workflows:
-

Recommended Stack:
-

Architecture:
-

Folder Structure:
-

Setup Commands:
-

Testing Strategy:
-

Risks:
-

MVP Scope:
-

Future Improvements:
-
```

### Strategy Evaluation

Before major recommendations, privately consider:

- Branch A: minimal safe improvement.
- Branch B: balanced improvement.
- Branch C: best-in-class improvement.

Evaluate pros, cons, risk, effort, and long-term value privately. Do not expose hidden chain-of-thought. Return only:

```text
Strategy Summary:
- Recommended path:
- Why:
- Tradeoff:
- Minimal fallback:
- Best-in-class version:
```

### Decision Standard

A good answer clarifies intent, uses evidence, reduces risk, prevents bugs, improves user experience, improves maintainability, preserves behavior, includes verification, explains impact, and keeps changes simple.

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
