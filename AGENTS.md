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

This repo powers the public Kiefer Built Contracting marketing website.

- Public pages educate prospective clients, present services and project work, build trust, and generate qualified inquiries.
- The Why Kiefer Built series uses source-backed education content and a downloadable owner-provided Homeowner Guide.
- The public quote request at `/#contact` posts to `/api/quote-request` and sends email through the Resend HTTP API.
- There is no admin dashboard, CRM, authentication, client portal, vendor portal, database integration, or internal operations platform in this repository.

## Current Stack / Runtime Truth

Source of truth: `package.json`, `tsconfig.json`, `vitest.config.ts`, and `eslint.config.mjs`.

- Node package manager: npm with `package-lock.json`.
- Framework: Next.js 16 App Router.
- React: React 19.
- TypeScript: strict mode, `@/*` alias to `src/*`.
- Styling: Tailwind CSS 4 through global CSS/theme tokens.
- UI/animation libraries: Framer Motion, Lucide React, `yet-another-react-lightbox`.
- Validation: Zod.
- Tests: Vitest.
- Lint: ESLint 9 with Next core web vitals and TypeScript config.
- Browser QA: use available browser automation tooling; no browser package is checked into the app solely for agent QA.

This is not configured as a static export because the quote-request Route Handler runs server-side. All page content is otherwise public and database-free.

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
- `src/lib/public-site/routes.ts` - retained public route manifest and sitemap source.
- `src/lib/public-site/sources.ts` - education citations and source classifications.
- `src/components/Contact.tsx` - public quote/contact form.
- `src/app/api/quote-request/route.ts` - quote request API.
- `src/lib/contact/quote-request.ts` and `src/lib/contact/quote-email.ts` - quote parsing and email content.
- `public/images/` - public photography and brand assets.
- `public/guides/kiefer-built-homeowner-guide.pdf` - downloadable owner-provided guide.

## Environment Variables

Active source truth is `.env.example` and `src/app/api/quote-request/route.ts`. The site renders without environment variables; these are required only for quote email delivery:

```env
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL_FROM="Kiefer Built <quotes@builtbykiefer.com>"
CONTACT_EMAIL_TO=info@kbuiltco.com
```

Notes:

- `CONTACT_EMAIL_TO` defaults to `info@kbuiltco.com` when unset.
- `CONTACT_EMAIL_FROM` must use a sender domain verified by the email provider.
- Missing or failed delivery produces an explicit email fallback in the public form.

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

## Deployment Notes

- Public production domains are documented in `README.md` and `docs/deployment-production-checklist.md`.
- Verify the active Vercel Git integration and production branch before relying on automatic deployment.
- Production/preview email variables must be configured before relying on quote-request delivery.
- The downloadable Homeowner Guide and all public images ship from `public/`.
- Run the deployment checklist smoke tests after any production or client-review deploy.

## Working Rules For Future Agents

- Work from the current branch unless the user explicitly asks for a separate branch. Recent cosmetic work has intentionally happened directly on `main`.
- Always inspect `git status --short --branch` before editing. The worktree may contain user changes; never revert or overwrite unrelated changes.
- Treat `package.json`, current source files, and the public route manifest as stronger truth than older prose docs.
- Keep cosmetic edits small and easy to review locally.
- Prefer existing patterns: shared public content through `PublicPage`/`publicPages`, routes through the App Router, and email-only quote handling through `src/lib/contact/`.
- Use `rg`/`rg --files` for code searches.
- Use `apply_patch` for manual text/code edits.
- Do not commit, push, merge, or deploy unless the user explicitly asks.
- For frontend visual changes, use browser automation and screenshots when possible and verify desktop/mobile crops/layouts before presenting the change.
- Keep public pages visually aligned with the current Kiefer direction: real photography, dark charcoal, warm cream, restrained red accents, and clear construction-specific content.
- Preserve citation IDs, independent-versus-industry labels, and factual-integrity constraints when editing education content.
- Do not reintroduce admin, CRM, authentication, portals, database code, demo tools, or internal operations features without an explicit product-scope decision.

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



<claude-mem-context>
# Memory Context

# [builtbykiefer] recent context, 2026-07-17 11:45am MDT

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision 🚨security_alert 🔐security_note
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 50 obs (22,332t read) | 607,335t work | 96% savings

### Jul 7, 2026
S192 Bring the design system bundle up on local dev for review and skimming (Jul 7 at 3:46 PM)
S193 Update design-sync documentation and verify bundle rebuild with corrected preview provider explanation and floor-card component count (Jul 7 at 3:54 PM)
S255 Pivot project from full-stack CRM to website-only marketing site; plan educational content structure to teach prospects about build quality, efficiency, and SIPs (Jul 7 at 4:16 PM)
### Jul 15, 2026
S256 Pivot project from full-stack CRM to website-only marketing site; create architectural design for education content series and backend cleanup (Jul 15 at 12:29 PM)
S257 Build marketing website plan and implementation: pivot Built by Kiefer from CRM-backend project to pure marketing/education site (Jul 15 at 12:32 PM)
S258 Open the dev server for the builtbykiefer Next.js application and verify it runs correctly (Jul 15 at 1:20 PM)
3269 2:13p 🔵 Next.js dev server started on port 3001 (port 3000 in use)
3270 2:14p 🔵 Dev server smoke test: all routes returning 200 OK
3271 " 🔵 Why Kiefer Built hub page renders with complete content structure
S263 Review entire Supabase project against current codebase for production readiness; identify missing tables, migrations, RLS policies, indexes, authentication issues, and mismatches. Produce a report with Critical/High/Medium/Low findings. No changes to be made. (Jul 15 at 2:14 PM)
3272 2:32p 🔵 Claude Design import MCP tools available
3273 2:33p 🔵 Successfully retrieved Claude Design project metadata
3274 " 🔵 Enumerated Claude Design project file structure and available assets
3275 " 🔵 Retrieved comprehensive research documentation and content strategy for Kiefer Built Homeowner Guide
3276 " 🔵 Retrieved complete 19-page Kiefer Built Homeowner Guide interactive design document
3277 2:34p 🔵 Extracted complete prose content from Kiefer Built Homeowner Guide (19 pages, all sections)
3278 2:35p 🔵 Mapped current education page content model and render capabilities for Kiefer Built website
3279 2:36p 🔵 Completed education page content exploration – Five education pages with current unsourced claims and architectural gap confirmed
3280 2:46p ⚖️ Project Scope Pivot: CRM Platform to Marketing Website
3281 " ⚖️ Education Pages: Citation System & Guide Integration Architecture
3282 2:50p ⚖️ Planned citation-driven architecture for education pages + 2 new topic pages
3283 2:58p 🔵 Network sandbox constraints require escalated permissions for remote documentation access
3284 " 🔵 Codex CLI version 0.144.4 installed with self-update capability
3331 4:07p 🔵 Built by Kiefer Project Architecture Inventory
3370 5:47p 🔵 Storage Buckets Configuration in Supabase Migrations
3371 " 🔵 Dynamic Storage Bucket Access Pattern in Application Code
3372 " 🔵 Environment Variable Configuration and Secrets Management
S264 Draft the remediation migrations for H1–M3: performance (RLS), security (passwords, error handling), and typesafety. (Jul 15 at 5:48 PM)
3373 5:53p 🔵 Baseline RLS Policy Audit for H1–M3 Remediation
3374 5:55p 🔵 33 Tables with Public-Role Admin Policies Identified
3375 " 🔵 H1–M3 Remediation Baseline: Auth Config and Migration Context
3376 " 🔵 HaveIBeenPwned Leaked Password Protection Available in Supabase Pro Plan
3377 5:56p 🟣 Drafted Three H1–M3 Remediation Migrations: RLS Perf + Foreign-Key Indexes
3378 5:59p ✅ Implemented H1 Password Hardening + H2 Error Observability in config.toml and supabase-fallback.ts
3379 " ✅ Remediation H3: Generated Supabase Database Schema TypeScript Types
3380 6:00p 🔵 H2 Impact Analysis: logSupabaseFallback Call Sites (39 total, all safe for throw)
3381 " 🔵 H2 Test Coverage Found: Tests Will Need Updates for logSupabaseFallback Throw Behavior
3382 " 🔵 H2 Impact: emptyOnLiveReadFailure Wrapper Pattern Will Break with logSupabaseFallback Throw
3383 " ✅ Updated supabase-fallback.test.ts for H2 Throw Behavior
3384 6:01p 🔵 Affected Tests Pass: H2 Implementation Verified (supabase-fallback + land-leads queries)
S266 Wire Database type (H3) into all three Supabase clients; run full test suite to verify no breakage; produce final diff summary before committing or applying database changes. (Jul 15 at 6:01 PM)
3394 6:10p ✅ Wire Database type definitions into Supabase clients
3395 " 🔵 TypeScript type checking reveals 3 type mismatches after Database type wiring
3396 " 🔴 Resolved TypeScript type mismatches for file_type and JSON columns after Database type wiring
3441 9:13p 🔵 Requested PR "codex" does not exist in repository
3442 " 🔵 Repository has only main branch; "codex" branch and PR do not exist
3443 " 🔵 Identified substantial recent work across land-leads, public-site, and design system
3444 9:14p 🟣 Implemented education sources registry with independent/industry distinction
3445 " 🟣 Implemented citations and sources rendering throughout PublicPage component
3446 9:15p 🟣 Added two new educational pages: Indoor Air Quality and Built for Colorado
3447 " 🔵 Verified: All content claims use citations; no forbidden figures found
3448 " 🔵 Test suite updated for six education pages; guide PDFs not yet provided
3449 9:16p 🔵 Sources integrity test suite validates citation completeness and forbidden figures
3451 " 🔵 Live end-to-end verification: all pages render with citations, tables, and sources
3453 9:17p 🔵 Review identified one defect: sources disclaimer uses wrong numbering scheme
### Jul 17, 2026
3454 10:39a ✅ Supabase integration removed from codebase
3455 " 🔵 Sources disclaimer defect still present: local numbering vs global disclaimer text
3456 10:40a 🔴 Fixed sources disclaimer defect: removed hardcoded global numbering, made number-agnostic
3457 " 🔵 Sources disclaimer fix verified: tests pass, no lingering global-number references
S270 Continue work from prior session that ran out of tokens; complete the sources disclaimer defect fix flagged in code review (Jul 17 at 10:40 AM)
**Investigated**: Retrieved prior session observations documenting a sources citation system defect: the SOURCES_DISCLAIMER hardcoded global source numbers (1, 2, 6–13 independent / 3–5 industry) while PublicPage renumbered sources locally per-page (1, 2, 3...), creating a mismatch between visible superscripts and disclaimer text. Examined sources.ts, sources.test.ts, and PublicPage.tsx to confirm the defect and understand the rendering logic.

**Learned**: Sources are intentionally renumbered locally on each page (via buildCitationContext and SourcesSection) to avoid repetition, but the disclaimer text was locked to the guide's global numbering scheme. The "Industry testing data" badge is already rendered for non-independent sources (3, 4, 5), providing a visual distinction independent of page-specific numbering that the disclaimer can reference instead.

**Completed**: Fixed sources disclaimer numbering mismatch: rewrote SOURCES_DISCLAIMER in src/lib/public-site/sources.ts to be number-agnostic, keying off the visual "Industry testing data" badge instead of hardcoded global IDs. Updated src/lib/public-site/sources.test.ts to validate the new number-agnostic wording and explicitly forbid citation numbers in the disclaimer text. Verified: sources.test.ts 4/4 tests pass, grep finds zero lingering references to old global-number wording, full public-site test suite 16/16 tests pass.

**Next Steps**: Unknown — the working tree contains ~46k lines of staged-but-uncommitted deletions (supabase/ directory, src/lib/supabase/, .design-sync/, .agents/skills/, src/proxy.ts, and src/types/slider.ts). This represents removal of Supabase backend integration and related infrastructure, which is a large architectural change separate from the sources fix. Awaiting clarification on whether this removal is intentional or accidental before proceeding.


Access 607k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>