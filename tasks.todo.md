# Tasks

## Objective
Address the post-fix Land Lead Finder audit follow-ups, prioritizing the two MAJOR failure-reporting defects and low-risk adjacent cleanup.

## Assumptions
- Continue working directly on `main`; do not create a branch.
- No commit, push, deploy, or scratch Supabase run unless explicitly requested.
- The highest-value fixes are local error handling and guardrail correctness; live Supabase integration remains future verification.

## Risk Check
- Functional risk: Import flow should abort on pre-import read failures instead of proceeding with bad counts.
- Regression risk: Existing demo-mode behavior must continue to render demo leads and reject persistence.
- Security risk: Real-mode failures should not leak demo data or hide RLS/grant problems.
- Performance risk: Raising the Server Action body limit to 30 MB increases request ceiling modestly but keeps app-level file cap at 25 MB.
- UX risk: Oversize-file feedback should become more reliable and ideally immediate client-side.
- Maintainability risk: Keep query error behavior explicit without broad architectural refactors.

## Plan
- [x] Add failing tests for `getExistingLeadHashes` read failure and import abort behavior.
- [x] Add failing tests/coverage for mutation error logging and detail read failure behavior.
- [x] Raise the Server Action body limit above the app-level 25 MB file limit.
- [x] Make `getExistingLeadHashes` return failure explicitly and abort CSV import with a banner error.
- [x] Log mutation errors before returning generic user-facing messages.
- [x] Clean up dead/noisy code identified by the audit where directly adjacent.
- [x] Update review/handoff notes.

## Verification Plan
- [x] Run targeted red tests before production code changes.
- [x] Run targeted green tests after fixes.
- [x] Run `npm run typecheck`.
- [x] Run `npm run lint`.
- [x] Run `npm test`.
- [x] Run demo-mode Playwright smoke for list/filter/detail/export.

## Review
### Summary of Changes
- Raised the Next Server Action multipart body limit to 30 MB while keeping the application CSV file limit at 25 MB.
- Added shared upload-limit constants and client-side file-size validation on the import button.
- Changed existing-lead hash lookup failures to return `null` so imports abort before diff/upsert counts can lie.
- Added upload action handling for hash lookup failure with a clear `?error=` banner.
- Logged live mutation/upsert/touch errors before returning generic user-facing failure text.
- Removed the dead agricultural-class vacancy clause and the pass-through address helper.

### Files Changed
- `next.config.ts`
- `src/lib/land-leads/constants.ts`
- `src/components/admin/LandLeadUploadButton.tsx`
- `src/app/admin/land-leads/actions.ts`
- `src/app/admin/land-leads/page.tsx`
- `src/lib/land-leads/queries.ts`
- `src/lib/land-leads/queries.test.ts`
- `src/lib/land-leads/vacancy.ts`
- `src/lib/land-leads/signals.ts`
- `tasks.todo.md`

### Verification Completed
- Targeted red run failed on the expected hash-failure and mutation-logging assertions.
- Targeted green run passed: `src/lib/land-leads/queries.test.ts`, 3 tests.
- Land-lead suite passed: 10 files, 44 tests.
- `npm run typecheck` passed.
- `npm run lint` passed with one existing unrelated warning in `scripts/compress-images.mjs`.
- `npm test` passed: 48 files, 177 tests.
- Demo Playwright smoke passed for list, filtered query, detail page, and export route with no console messages.

### Risks Remaining
- Real Supabase migration/import/upsert/RLS behavior still has not been proven against a scratch project.
- Larimer aliases still need confirmation against a real assessor export.
- Live read failures still render empty list/export responses rather than explicit 500/error sentinel; this was a reviewed MINOR, not addressed in this pass.

### Follow-up Recommendations
- Run one scratch-Supabase authenticated import/edit/re-import cycle before real campaign use.
- Confirm Larimer export headers and add fixture tests.
- Consider a broader query-result error sentinel so live list/export failures are distinguishable from truly empty results.
