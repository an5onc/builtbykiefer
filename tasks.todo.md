# Tasks

## Objective
Prevent a Git-based deployment from advertising the unfinished `/admin/land-leads` route in admin navigation.

## Assumptions
- The untracked Land Lead Finder route, support files, and migration are intentionally outside this focused review fix.
- Deferring the menu entry means removing it entirely until the feature is committed; a disabled teaser would still expose unfinished product surface.
- All unrelated dirty and untracked files must remain unchanged.

## Risk Check
- Functional risk: Low; this removes one navigation path whose deployed target does not exist.
- Regression risk: Low; other Sales menu items and admin routes must remain unchanged.
- Security risk: None introduced; no auth, data, or route implementation changes are in scope.
- Performance risk: None; this only changes static navigation data and a unit test.
- UX risk: Positive; deployed users no longer encounter a 404 from an advertised module.
- Maintainability risk: Low; regression coverage records that unshipped routes must not appear in live navigation.

## Plan
- [x] Add focused regression coverage that live admin navigation excludes `/admin/land-leads` while its implementation is untracked.
- [x] Remove the Land Lead Finder item from the Sales menu without touching its untracked implementation.
- [x] Review the tracked diff for accidental scope expansion.

## Verification Plan
- [x] Run the focused admin navigation test.
- [x] Run scoped ESLint and TypeScript checking.
- [x] Run the full test suite and production build.
- [x] Confirm tracked source no longer references `/admin/land-leads` and inspect final worktree status.

## Review

### Summary of Changes
- Removed the Land Lead Finder item from the tracked Sales navigation so a Git-based deployment no longer advertises an untracked route.
- Added a focused regression test covering both the generated live href list and visible menu labels.
- Left the untracked Land Lead Finder route, support code, and migration unchanged.

### Files Changed
- `src/lib/admin/navigation.ts`
- `src/lib/admin/navigation.test.ts`
- `tasks.todo.md`

### Verification Completed
- Focused admin navigation test passed: 1 file, 3 tests.
- Scoped ESLint passed for both changed TypeScript files.
- `npm run typecheck` passed.
- Full `npm test` passed: 52 files, 194 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Tracked-tree audit confirmed the Land Lead Finder implementation is not tracked and no tracked live source outside the regression test references `/admin/land-leads`.

### Risks Remaining
- The local production build still discovers `/admin/land-leads` because its implementation remains untracked in this working directory; those files will not exist in a deployment sourced from the current Git contents.
- When the complete feature and migration are intentionally committed, the menu item and its regression expectation must be updated in the same change.

### Follow-up Recommendations
- Ship the Land Lead Finder route, supporting implementation, migration, navigation entry, and deployment verification together when the feature is ready.
