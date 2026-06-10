# Tasks

## Objective
Add the new `public/images/project-4` build photos to the public website as an additional project/service proof point, and market Kiefer Built's new custom elevator capability to designers and customers.

## Assumptions
- The `project-4` images are approved for public website use.
- The circular glass elevator/lift shown in `DSC05496.jpg`, `DSC05499.jpg`, `DSC05502.jpg`, and `DSC05505.jpg` is the custom elevator work to market.
- The same build also includes bathroom and kitchen finish photos, so the project can be represented as a renovation/custom improvement rather than only an elevator installation.
- The three `.mov` files will not be added in this pass unless needed, because the existing public project/gallery patterns use images.
- No new standalone route is required unless the user wants a dedicated custom-elevators page later.

## Risk Check
- Functional risk: Low; this should be content/component updates in existing public pages.
- Regression risk: Low to moderate; homepage and shared public content render many marketing pages, so edits must preserve existing layouts.
- Security risk: Low; no auth, data, or API behavior should change.
- Performance risk: Moderate; the new images are high-resolution, so they should be used through `next/image` and limited to necessary placements.
- UX risk: Moderate; the new elevator section must feel like a real service offering, not a tacked-on card.
- Maintainability risk: Low if changes stay in existing content/data structures and a small reusable section if needed.

## Plan
- [x] Identify the smallest set of website files that need updates.
- [x] Add `project-4` imagery into the project/gallery and renovation/service content.
- [x] Add a homepage custom elevator marketing section using the new elevator photos and existing visual language.
- [x] Update copy so custom elevators are clearly positioned for homeowners, designers, and accessibility-focused remodels.
- [x] Check responsive layout and avoid changing unrelated admin/portal behavior.

## Verification Plan
- [x] Run `npm run lint`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run build`.
- [x] Start the dev server and visually inspect the homepage plus affected project/service pages on desktop and mobile.

## Review
### Summary of Changes
- Added custom elevator marketing to the homepage using the new `project-4` photos.
- Added custom elevator cards to the services, project gallery, and renovations/additions public content.
- Added an anchored custom elevator section on the renovations/additions page.
- Added a content regression test for the new elevator marketing content and hash target.

### Files Changed
- `src/app/page.tsx` - Added the homepage custom elevator section and included elevator work in the moving project gallery.
- `src/components/public-site/PublicPage.tsx` - Added optional section IDs and scroll offset support for anchored public sections.
- `src/lib/public-site/content.ts` - Added project/service copy and `project-4` imagery for custom elevators.
- `src/lib/public-site/content.test.ts` - Added regression coverage for the custom elevator content.
- `tasks.todo.md` - Tracked implementation and verification.

### Verification Completed
- `npm test -- src/lib/public-site/content.test.ts` - passed.
- `npm run lint` - passed.
- `npm run typecheck` - passed.
- `npm run build` - passed.
- Browser check at `http://localhost:3000/` - custom elevator homepage section renders with `project-4` images and no horizontal overflow.
- Browser mobile check at 390px width - custom elevator section renders with no horizontal overflow.
- Browser check at `/services`, `/projects`, and `/projects/renovations-additions#custom-elevators` - new cards/content render and the hash target lands near the custom elevator section.

### Risks Remaining
- The `.mov` files in `public/images/project-4` were not used; this pass kept to the existing image-based gallery patterns.
- The new project is represented through existing gallery/service pages rather than a dedicated standalone project route.
- Image selection is based on visual review of the provided files, not client-supplied captions.

### Follow-up Recommendations
- Consider a dedicated custom elevator service page if Kiefer Built wants SEO content around elevator types, code constraints, design coordination, and accessibility planning.
- Consider optimizing or resizing the large `project-4` originals if production image processing costs become a concern.
