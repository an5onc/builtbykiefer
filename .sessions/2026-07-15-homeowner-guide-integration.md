# 2026-07-15 Homeowner Guide Integration

## Goal

Fold the vetted Kiefer Built Homeowner Guide research into the public education funnel with transparent citations, two missing topics, comparison tables, and safe support for the owner-provided PDF.

## Starting State

- Branch: `main`, eight commits ahead of `origin/main` at session start.
- Relevant dirty files: Pre-existing unrelated work included `AGENTS.md`, `.design-sync/`, the Land Lead Finder files/migration, and `.sessions/2026-07-07-land-leads-audit.md`.
- Running services: A pre-existing Next.js dev server was available at `http://127.0.0.1:3001`; an unrelated Uvicorn service occupied port 3000.
- Important user constraints: Preserve the guide's 13-source numbering in data, derive page-local numbers at render time, label sources 3–5 as industry data, omit unverified figures, soften unconfirmed operational promises, and hide the download band until the PDF exists.

## Changes Made

- `src/lib/public-site/sources.ts`: Added the guide's 13 published citations, source classification, and standing disclaimer.
- `src/lib/public-site/content.ts`: Extended the content model and rewrote the education hub plus SIPs, energy, quality, and cost pages; added Indoor Air Quality and Built for Colorado content.
- `src/components/public-site/PublicPage.tsx`: Added derived local citation numbering, accessible anchors, responsive comparison tables, industry tags, source lists, and a file-existence-guarded download band.
- `src/app/why-kiefer-built/indoor-air-quality/page.tsx`: Added the Indoor Air Quality route and metadata.
- `src/app/why-kiefer-built/built-for-colorado/page.tsx`: Added the Built for Colorado route and metadata.
- `src/lib/public-site/nav.ts`: Added the two new routes in hub-card order.
- `src/lib/public-site/education.test.ts`, `src/lib/public-site/nav.test.ts`, `src/lib/public-site/sources.test.ts`: Added content, navigation, classification, citation-integrity, and forbidden-figure coverage.
- `tasks.todo.md`: Recorded the approved implementation plan, completed verification, and remaining risks.

## Verification

- Command: `npm run lint`
  - Result: Blocked by 25 pre-existing errors in generated/untracked design-sync bundles; no feature file errors were reported.
- Command: scoped ESLint across every feature file
  - Result: Passed with zero errors or warnings.
- Command: `npm run typecheck`
  - Result: Passed.
- Command: `npm test`
  - Result: Passed, 52 test files and 193 tests.
- Command: `npm run build`
  - Result: Passed; all seven `/why-kiefer-built` routes were statically prerendered.
- Other checks:
  - Focused education/navigation/source tests passed: 3 files, 11 tests.
  - `git diff --check` passed.
  - Forbidden-figure scan found no `$ / kWh`, `20.6%`, or `10 dB` claims.
  - Production Playwright QA passed 14 desktop/mobile page states with zero failures: sequential markers, working citation jumps, correct source counts, industry tags, responsive tables, no broken images, no overlays/console errors, no document overflow, and no broken PDF link.
  - Representative desktop/mobile screenshots were visually inspected, including light/dark tables and the source-list treatment.

## Blocked / Not Run

- The owner-provided `public/guides/kiefer-built-homeowner-guide.pdf` is absent. Download metadata and UI are ready, but the band remains hidden by design until the file exists.
- Repository-wide lint cannot pass while the unrelated generated design-sync bundles reference a missing ESLint rule/plugin; scoped lint for this feature passes.

## Current Worktree State

- Feature changes are limited to the public education renderer/content/tests/nav, two new routes, `tasks.todo.md`, and this handoff/index.
- Pre-existing unrelated dirty items remain: `AGENTS.md`, `.design-sync/`, `.sessions/2026-07-07-land-leads-audit.md`, Land Lead Finder source files, and its Supabase migration.
- No commits, pushes, merges, or deployments were performed.

## Next Agent Start Here

1. Read `AGENTS.md`.
2. Read this session file and any newer entry in `.sessions/SESSION_INDEX.md`.
3. Run `git status --short --branch`.
4. Continue from the listed next steps.

## Next Steps

- Obtain the exported guide PDF, place it at `public/guides/kiefer-built-homeowner-guide.pdf`, keep it near or below 15 MB, rebuild, and smoke-test the download.
- Ask the owner to confirm which operational standards are universal before strengthening capability language into promises.
- Confirm approval to publish sources 3–5 as explicitly labeled industry data.
