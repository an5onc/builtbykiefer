# Design-sync notes — Built by Kiefer public site

Project: **Built by Kiefer — Public Site** (`4a240b55-00e7-405a-8517-c727a7601a0e`).
Scope: the 26 public marketing-site components in `src/components/*.tsx` (admin
components and `public-site/*` full-page compositions are excluded via
`componentSrcMap: null`).

## Build shape (important — this is a Next.js app, not a packaged DS)
- **No dist build.** The bundle is produced from an explicit entry
  `.design-sync/ds-entry.tsx` that re-exports every component as a NAMED export
  (they are `export default` in source; `export *` would miss them). Pass
  `--entry .design-sync/ds-entry.tsx` to the converter/driver.
- **`next/*` shims.** Components import `next/image`, `next/link`,
  `next/navigation`. `.design-sync/tsconfig.ds.json` (referenced by
  `cfg.tsconfig`) aliases those to plain shims in `.design-sync/shims/` so they
  render outside the Next runtime. When adding a component that imports a new
  `next/*` module, add a shim + a path entry. The DS tsconfig also carries the
  `@/*` alias inline (the paths plugin does NOT follow `extends`).
- **CSS/fonts.** `cfg.buildCmd` compiles `.design-sync/tailwind-entry.css`
  (Tailwind v4 theme from `src/app/globals.css` + Geist fonts via a Google Fonts
  `@import`) into `.design-sync/.cache/tailwind.css`, which is `cfg.cssEntry`.
  The `@source` globs in the entry make Tailwind scan `src/components` — without
  them auto-detection bases on the entry's own dir and emits no utilities.
  Geist is served remotely (`[FONT_REMOTE]`, expected — no local font files).

## whileInView is handled by a preview provider — DO NOT remove it
- Most sections reveal with framer-motion `whileInView` /
  `initial={{opacity:0}}`, which needs a scroll/intersection event a static
  preview card never fires — so they'd render blank. `.design-sync/preview-provider.tsx`
  (wired via `cfg.extraEntries` + `cfg.provider.component = "DsPreviewProvider"`)
  patches `IntersectionObserver` at bundle load to always report "intersecting",
  so every reveal animation settles to its final state on mount. This is what
  makes the scroll-reveal sections (and `RanchGallery`, `WeatherImpactTracker`)
  render in cards. Removing it makes ~most cards blank again.
  - Side effect: the patch lives in the importable bundle, so designs built with
    these components also get always-visible reveal state (no scroll-gated
    animation). Desirable for static design previews; note it if a consumer
    wants live scroll animations.
  - Grading quirk: `package-capture.mjs`'s isolated `?story=` sheet renders
    `RanchGallery` / `WeatherImpactTracker` blank even though the real card
    renders fully — grade those two from the full-viewport
    `_screenshots/<group>__<Name>.png`, not the `_screenshots/review/` sheet.
- **Floor-card components (4):** `Header` (fixed/absolute, transparent until
  scrolled), `FloatingCTA` and `GlobalFloatingAction` (appear past a scrollY
  threshold — scroll-position state, not `whileInView`, so the IO stub doesn't
  reveal them), `ProjectUpdateNotification` (timer toast). All import cleanly;
  only their static preview is a floor card.
- **Marketing images 404 in isolation.** Page sections hard-code `/images/*`
  public-dir paths (not props), so isolated previews show placeholder boxes.
  This is inherent — the host app serves `/public`. The design agent uses these
  as structural scaffolding and supplies its own imagery.

## Authored previews (3, all graded good)
- `BeforeAfterSlider` — draggable before/after with picsum images.
- `RanchGallery` — 6-photo bento gallery with category filters (picsum images).
- `WeatherImpactTracker` — weather-impact calendar with a 10-day sample month.
All use picsum placeholder images, not brand photography — swap if desired.

## Re-sync risks / watch-list
- `cfg.dtsPropsFor` for `BeforeAfterSlider`, `RanchGallery`, `WeatherImpactTracker`
  is hand-mirrored from source (`@/types/slider`, inline `GalleryPhoto`,
  `WeatherImpactProps`). If those source types change, update the config bodies.
- The Larimer/admin work is a separate concern; this sync is public-site only.
- Preview images are picsum placeholders, not brand photography — swap if the
  team wants real project photos in the card.

## Known render warns (triaged as legitimate)
- `[FONT_REMOTE]` Geist / Geist Mono / Cambria — served via remote @import, expected.
