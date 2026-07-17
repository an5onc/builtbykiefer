# 2026-07-16 Production Cleanup Analysis

## Goal

Map every repository dependency required by the public marketing website, classify all other features/files, and propose an ordered removal plan without deleting or modifying application behavior.

## Starting State

- Branch: `main` at `a4305b4`, aligned with `origin/main`.
- Relevant dirty files: the prior runtime audit session/index, two runtime audit documents, and 345 runtime screenshots were already modified/untracked.
- Running services: none started for this analysis.
- Important user constraints: perform dependency analysis before deletion; create `docs/cleanup-analysis.md` and `docs/cleanup-plan.md`; do not begin Phase 4 until the plan is approved; do not touch the hosted website or external database.

## Changes Made

- `docs/cleanup-analysis.md`: Added complete tracked-file/source coverage, route and feature classifications, quote-to-CRM dependency trace, asset/package/environment/database ledgers, baseline measurements, and open owner decisions.
- `docs/cleanup-plan.md`: Added the proposed target architecture, exact retained route allow-list, feature removal matrix, ordered Phase 4 checkpoints, validation plan, risk controls, and explicit external-state/approval boundaries.
- `.sessions/SESSION_INDEX.md`: Added this handoff entry without altering the pre-existing runtime-audit entry.

No application code, content, route, package, configuration, schema, or asset was changed or removed.

## Verification

- Command: `npm run lint`
  - Result: Failed because ESLint traversed ignored local `.ds-sync` and `ds-bundle` generated output: 25 errors and 1,352 warnings. This is documented as cleanup evidence.
- Command: `npx eslint src scripts --format stylish`
  - Result: Passed with zero errors and one existing warning in `scripts/compress-images.mjs` (`extname` unused).
- Command: `npm run typecheck`
  - Result: Passed.
- Command: `npm test`
  - Result: Passed: 52 files, 194 tests.
- Command: `npm run build`
  - Result: Passed; current output still includes every public/admin/auth/portal/vendor route and Proxy as expected before cleanup.
- Other checks:
  - Reconciled all 840 baseline tracked files by root area.
  - Reconciled all 286 source files: 56 KEEP/modify, 1 UNSURE (Blog), 229 REMOVE.
  - Verified all 28 target public route files exist.
  - Verified `git diff --check` for tracked changes.

## Blocked / Not Run

- Phase 4 was intentionally not started; explicit plan approval is required.
- Owner decision needed for `/blog`: recommended removal until real article pages or a Houzz publishing workflow exists.
- Owner decision needed for retention/location of the 345 untracked runtime screenshots.
- `public/guides/kiefer-built-homeowner-guide.pdf` is still absent and must be owner-supplied.
- Hosted Supabase/Vercel state was not inspected or changed; decommissioning is outside this repository-only plan.

## Current Worktree State

- Pre-existing: modified `.sessions/SESSION_INDEX.md`; untracked runtime audit session, report, CSV, and screenshot directory.
- This session: untracked `docs/cleanup-analysis.md`, `docs/cleanup-plan.md`, and `.sessions/2026-07-16-production-cleanup-analysis.md`; session index updated.
- No tracked application file is modified.

## Next Agent Start Here

1. Read `AGENTS.md`.
2. Read this session file and any newer entry in `.sessions/SESSION_INDEX.md`.
3. Run `git status --short --branch`.
4. Continue from the listed next steps.

## Next Steps

- Ask the owner to approve `docs/cleanup-plan.md` and decide Blog/audit screenshot retention.
- After approval, replace `tasks.todo.md` with the approved implementation checklist before editing application files.
- Execute quote decoupling first and prove the retained import graph no longer reaches admin/Supabase.
- Continue through the ordered deletion and validation checkpoints; do not touch hosted Supabase without separate authority.

