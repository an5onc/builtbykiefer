# Tasks

## Objective
Transform `/projects/renovations-additions` from a static card grid into an Apple-inspired interactive showcase where each renovation category is clickable and expands into a premium, image-led section with horizontal project galleries.

## Assumptions
- The page should stay at `/projects/renovations-additions`; no separate pages are needed for Kitchens, Bathrooms, Living Spaces, Exteriors, or Custom Elevators.
- The current five category cards should become interactive navigation controls.
- Each category should have its own section on the same page with a horizontal, touch-friendly gallery using existing project photography.
- Custom Elevators should link visually into the dedicated `/services/custom-elevators` page as the deeper service destination, but still have a short showcase section on this renovations page.
- The implementation should feel premium and modern, inspired by Apple-style product pages: large photography, strong spacing, sticky/active category navigation, smooth scroll, and restrained motion.
- Use existing local images only; no generated or stock imagery.

## Risk Check
- Functional risk: Moderate; replacing the generic `PublicPage` route with a custom interactive page changes page structure.
- Regression risk: Moderate; public content links and SEO copy should remain coherent.
- Security risk: Low; no auth, API, database, or form behavior changes.
- Performance risk: Moderate; horizontal galleries must use `next/image`, stable sizes, and avoid excessive above-the-fold loading.
- UX risk: Moderate; interactions must be obvious and work on desktop, mobile, keyboard, and touch.
- Maintainability risk: Moderate; category data should live in the page or a small local data structure rather than scattered markup.

## Plan
- [x] Add a focused content/data test for the renovations showcase categories and gallery image coverage.
- [x] Replace `/projects/renovations-additions` with a custom client-capable page instead of the generic `PublicPage` wrapper.
- [x] Build an interactive category rail from the five cards with smooth-scroll links and active-section state.
- [x] Add five category sections, each with concise service copy, proof details, and a horizontal scroll-snap gallery.
- [x] Add polished controls: previous/next buttons, keyboard-friendly anchors, active category indication, and reduced-motion-safe behavior.
- [x] Preserve public shell, contact CTA, and visual direction: real photography, charcoal, warm cream, restrained red accents.
- [x] Verify desktop and mobile rendering, no horizontal page overflow, working category jumps, and no broken image paths.

## Verification Plan
- [x] Run the targeted renovations showcase test.
- [x] Run `npm run lint`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run build`.
- [x] Browser-check `/projects/renovations-additions` on desktop and mobile, including category clicks and gallery controls.

## Review
### Summary of Changes
- Rebuilt `/projects/renovations-additions` as an Apple-inspired interactive showcase instead of a static generic card page.
- Added five clickable categories: Kitchens, Bathrooms, Living Spaces, Exteriors, and Custom Elevators.
- Added a sticky active category rail, smooth same-page category jumps, and horizontal scroll-snap galleries with previous/next controls.
- Added a tested renovations showcase data module with real local project images and category proof points.
- Preserved the public header/footer, project CTA, Kiefer visual language, and mobile swipe behavior.

### Files Changed
- `src/app/projects/renovations-additions/page.tsx` - Swapped the route to the custom renovations showcase page and added metadata.
- `src/components/public-site/RenovationsShowcasePage.tsx` - New interactive page component with hero, category cards, sticky rail, gallery sections, and CTA.
- `src/lib/public-site/renovations-showcase.ts` - New typed showcase data for categories, proof points, CTAs, and galleries.
- `src/lib/public-site/renovations-showcase.test.ts` - New regression test for category coverage and image existence.
- `tasks.todo.md` - Updated plan, verification, and review.

### Verification Completed
- `npm test -- src/lib/public-site/renovations-showcase.test.ts src/lib/public-site/content.test.ts` - passed.
- `npm run lint` - passed with one unrelated existing warning in `scripts/compress-images.mjs`.
- `npm run typecheck` - passed.
- `npm run build` - passed.
- Playwright desktop check verified five category anchors, five sections, no horizontal page overflow, active category jump to Bathrooms, and gallery next control moving from `scrollLeft: 0` to `510`.
- Playwright mobile check at 390px verified no horizontal page overflow and category rail/cards present.
- Visual screenshots reviewed at `/tmp/renovations-showcase-desktop-hero.png`, `/tmp/renovations-showcase-desktop-section.png`, `/tmp/renovations-showcase-section-final.png`, and `/tmp/renovations-showcase-mobile.png`.

### Risks Remaining
- Gallery image grouping is curated from existing file names, not client-provided project captions.
- The `.mov` files in `public/images/project-4` are still unused.
- The unrelated lint warning in `scripts/compress-images.mjs` remains.

### Follow-up Recommendations
- Add before/after pairs if older pre-renovation photos are available.
- Add video or motion reels later for a higher-end case-study feel if the client wants more editorial polish.
