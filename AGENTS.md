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

# [builtbykiefer] recent context, 2026-07-23 10:02pm MDT

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision 🚨security_alert 🔐security_note
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 50 obs (20,686t read) | 978,293t work | 98% savings

### Jul 15, 2026
S264 Draft the remediation migrations for H1–M3: performance (RLS), security (passwords, error handling), and typesafety. (Jul 15 at 5:48 PM)
S266 Wire Database type (H3) into all three Supabase clients; run full test suite to verify no breakage; produce final diff summary before committing or applying database changes. (Jul 15 at 6:01 PM)
S270 Continue work from prior session that ran out of tokens; complete the sources disclaimer defect fix flagged in code review (Jul 15 at 6:12 PM)
3442 9:13p 🔵 Repository has only main branch; "codex" branch and PR do not exist
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
S272 Final Production Release Audit — verify that deployed www.builtbykiefer.com contains only approved public marketing content (29 routes) after removal of CRM, admin, portals, auth, demo, and operational systems; confirm deletion via 78 probes against former operational surfaces; produce audit report with screenshots, route inventory, and release-readiness verdict. (Jul 17 at 10:40 AM)
### Jul 18, 2026
3458 3:00p 🔵 Production website route structure discovered via src/app directory scan
3459 " 🔵 Complete production route inventory and SEO configuration discovered
3460 3:04p 🟣 Comprehensive production website audit harness built with puppeteer-core
3461 3:05p 🔵 Production website homepage verified live and rendering current code
3462 " 🔵 Production homepage interactive structure fully verified end-to-end
3465 3:09p 🟣 Production audit script for comprehensive website validation
3466 " 🔵 Browser automation successfully navigates production website navigation
3467 3:11p 🔵 Audit summarization script executed but output buffered/backgrounded
3468 3:12p 🔵 Browser audit systematically navigates project category pages
3474 3:18p 🔵 Production Website Crawl Analysis: 32 Public Routes Identified
3475 3:19p 🔵 Quote Request Forms Use Resend Email API; All Pages Alt-Text Compliant
3476 3:20p 🔵 Quote Request and Vendor Forms Use Different Submission Paths
3477 " 🔵 Homepage Renders Successfully; No Video or Floating CTA Elements
3478 3:22p 🔵 Broken Image Assets Found on Mountain Modern Project Page
3479 " 🔵 Video Element Fails to Load on Mountain Modern Project Page
3480 3:27p ✅ Final Production Release Audit Completed
S273 Verify and document that Kiefer_Website_Architecture_Package.pptx is the accurate visual design for the 2026-07-18 final release audit (Jul 18 at 3:28 PM)
### Jul 19, 2026
3481 12:44a ⚖️ Architecture Package PPTX established as authoritative visual design reference
S274 Move architecture PPTX from Downloads into versioned audit deliverables and update documentation (Jul 19 at 12:45 AM)
3482 12:46a ✅ Architecture Package PPTX moved into versioned audit deliverables
S275 Audit polish sprint — implement five post-release optimizations identified in the final architectural audit (Kiefer_Website_Architecture_Package.pptx) (Jul 19 at 12:46 AM)
3483 12:48a 🔵 Code-path inspection confirms audit findings and identifies specific files for recommended improvements
3484 12:50a 🔵 Audit follow-up investigation locates specific code paths for 4 non-blocking polish items
3485 7:28a 🔵 Production v1.0 Release and Final Audit Documentation
3486 " 🟣 Next.js Image Optimization and Accessibility MotionProvider Added
3487 7:32a 🟣 Multi-size Favicon ICO File Generated
3488 " 🔄 Generalized Container Ref Type from HTMLDivElement to HTMLElement
S276 Check if local main branch is behind remote and identify missing upstream commits (Jul 19 at 7:34 AM)
3492 12:22p 🔵 Email delivery configuration blocking production quote requests
### Jul 20, 2026
3493 1:43p 🔵 Local main branch is 3 commits behind remote
3494 " 🔵 Upstream commits focus on SEO and social sharing image fixes
S277 Sync local main branch with remote; verify upstream SEO and social image improvements integrated cleanly (Jul 20 at 1:43 PM)
3495 1:44p 🔵 Working directory is clean with no uncommitted changes
3496 " 🔵 Repository contains v1.0 production release with stashed frontend work
3497 " ✅ Successfully merged upstream SEO and social image improvements
3498 " 🔵 SEO metadata extraction preserved icon configuration
3499 " 🔵 All tests pass and TypeScript compilation succeeds after merge
S278 User requested `claude doctor` diagnostic (Jul 20 at 2:25 PM)
3500 3:23p 🔵 Resend API integration provisioning incomplete — invalid API key in production
3501 3:38p 🔵 Larimer County Assessor Public Data Center provides free accessible property transaction and owner data via CSV exports
3502 4:34p 🔵 Weld County assessor data download access blocked by CDN
3503 5:24p 🔵 Sales.csv data structure and quality analysis

Access 978k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>