# 2026-07-17 Production Marketing Website Completion

## Goal

Complete the approved pivot to a production-ready public marketing website: remove CRM/admin/auth/portal/demo behavior and all residual infrastructure, verify the retained public experience, and deploy it.

## Starting State

- Branch: `main`, tracking `origin/main` at `a4305b4`.
- Relevant dirty files: the worktree already contained the approved large marketing-only cleanup, audit reports, public-route work, and Homeowner Guide integration. These changes were preserved and completed rather than reset.
- Running services: a production server was started temporarily on port 3001 for QA and stopped before handoff. A Docker-owned listener on port 3000 is pre-existing and unrelated.
- Important user constraints: keep only the public marketing website and email-only quote route; remove residual packages/env/middleware/config/scripts/workflows/build settings; remove handoff framing; deploy; do not commit or push without explicit authority.

## Changes Made

- `src/app`, `src/components`, `src/lib`: completed the marketing-only route/component/data graph and removed operations, auth, portals, demos, Supabase, and CRM reachability.
- `src/lib/public-site/routes.ts` and tests: made the 29-page allow-list the sitemap/build source of truth and added reverse route/handler/proxy assertions.
- `src/app/layout.tsx`, `src/components/Footer.tsx`, `src/components/RanchGallery.tsx`, public content: corrected structured data, accessibility semantics, contrast, overflow, Blog destinations, and the broken testimonial CTA.
- `public/guides/kiefer-built-homeowner-guide.pdf`: replaced the phone placeholder with `(970) 515-5059`, preserved the 9-page tagged/searchable document, and optimized it to 907 KiB.
- `public/images/project-2/build-timelapse.mp4`: optimized the 23-second project video from 11 MiB/1080p to 2.0 MiB/720p with visually equivalent web playback.
- `package.json`, `package-lock.json`: reduced dependencies to the public site and pinned patched PostCSS 8.5.19; clean install and audit pass.
- `.env.example`, `.gitignore`, `.vercelignore`: retained only contact-email variables, removed the local obsolete env file, excluded local QA/docs from deployment, and kept secrets/build evidence local.
- `README.md`, `AGENTS.md`, `docs/deployment-production-checklist.md`, `docs/cleanup-plan.md`, `docs/cleanup-summary.md`, `tasks.todo.md`: aligned durable documentation and completed the implementation review.
- Production: linked the correct Vercel project, confirmed no hosted environment variables, created/verified lean previews, and promoted final deployment `dpl_6TLg5qzDM14yv7x2HebaCn47UcMv` to `www.builtbykiefer.com`.
- Release finalization: confirmed cleanup commit `4f80427` on local and remote `main`, verified its Git-triggered production deployment, repeated the complete live browser review, and finalized tag `v1.0-marketing-site`.

## Verification

- Command: `npm run lint`
  - Result: passed.
- Command: `npm run typecheck`
  - Result: passed in strict mode.
- Command: `npm test`
  - Result: 8 test files and 24 tests passed.
- Command: `npm run build`
  - Result: passed; exactly 29 public pages, `/api/quote-request`, `/sitemap.xml`, and framework `/_not-found` emitted.
- Other checks:
  - `npm ci`, `npm ls --depth=0`, and `npm prune --dry-run` passed.
  - `npm audit --audit-level=moderate` reports 0 vulnerabilities.
  - Static asset audit: 66 public files, all referenced or framework-served; no missing/dead asset.
  - Local browser QA: 29 desktop routes, 29 mobile routes, 8 interactions, 30 internal destinations, 9 retired routes; 0 issues.
  - Vercel preview browser QA: same complete matrix; 0 issues.
  - Canonical production browser QA: same complete matrix; 0 issues; no fake form submission.
  - Lighthouse: 97-98 performance and 100 accessibility/best-practices/SEO on three representative pages.
  - Production headers: `www` 200; apex 307 to `www`; guide/video 200 with correct types; retired routes and removed guide PNG 404.
  - Vercel: final deployment `READY`, aliases assigned with no error, Node 24.x, build completed in 29 seconds, no runtime error clusters after QA.
  - Fresh Git-backed production review: 29 desktop routes, 29 mobile routes, 8 interactions, 30 internal destinations, and 9 retired routes passed with zero issues; representative desktop/mobile screenshots were visually reviewed.

## Blocked / Not Run

- Automatic quote-email delivery was not exercised because the Vercel project has no environment variables and fake external submissions were explicitly excluded. The tested UI provides the intended email fallback.
- No hosted Supabase resource was changed; external decommissioning was outside the approved repository scope.

## Current Worktree State

- Branch: `main`, synchronized with `origin/main`.
- The complete marketing-site cleanup is committed and pushed; release tag `v1.0-marketing-site` identifies the verified release state.
- `git diff --check` passes.
- No agent-started local server remains. The unrelated Docker listener on port 3000 remains.
- Vercel production is Git-backed from `main`; the dirty-worktree deployment risk is closed.

## Next Agent Start Here

1. Read `AGENTS.md`.
2. Read this session file and any newer entry in `.sessions/SESSION_INDEX.md`.
3. Run `git status --short --branch`.
4. Continue from the listed next steps.

## Next Steps

- If automatic form delivery is required, configure `RESEND_API_KEY`, verified `CONTACT_EMAIL_FROM`, and optional `CONTACT_EMAIL_TO`, then submit one owner-approved real smoke inquiry.
