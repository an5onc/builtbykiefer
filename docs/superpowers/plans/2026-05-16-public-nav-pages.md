# Public Nav Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved About, Service, Our Work, Careers, Contact, Vendors, and Client Portal public pages so the new Kiefer Built navigation routes to real branded destinations instead of homepage anchors.

**Architecture:** Add a shared public marketing content layer and a reusable page renderer so most routes stay small and consistent. Special pages such as the flipbook can use the same tokens and media inventory while having a custom composition.

**Tech Stack:** Next.js App Router, React server components, Tailwind CSS, existing `Header`, `Footer`, `Image`, and local project photos under `public/images`.

---

### Task 1: Shared Public Site Content

**Files:**
- Create: `src/lib/public-site/content.ts`

- [ ] Define reusable project images, service cards, team members, accolades, blog summaries, testimonials, and route-specific page content.
- [ ] Keep copy polished and original while preserving the familiar Kiefer information architecture from the approved source URLs.
- [ ] Use existing local images only, including the AgFinity commercial image already copied from Kiefer's commercial gallery.

### Task 2: Shared Public Page Renderer

**Files:**
- Create: `src/components/public-site/PublicPage.tsx`
- Create: `src/components/public-site/FlipbookPage.tsx`
- Create: `src/components/public-site/VendorInterestPage.tsx`

- [ ] Build a `PublicPage` component that renders `Header`, a dark image-led hero, intro/proof sections, cards, split image sections, optional testimonial cards, and a CTA band.
- [ ] Build a `FlipbookPage` component that presents a professional digital lookbook with page-style panels for custom homes, commercial work, renovations, process, and contact.
- [ ] Build a `VendorInterestPage` component with the vendor/supplier definition, public inquiry fields, and email fallback to Kiefer Built's vendor contact.
- [ ] Keep visual styling aligned to the current homepage: black, white, Kiefer red, restrained borders, real imagery, and compact professional spacing.

### Task 3: Route Pages

**Files:**
- Create: `src/app/about/page.tsx`
- Create: `src/app/about/team/page.tsx`
- Create: `src/app/about/accolades/page.tsx`
- Create: `src/app/blog/page.tsx`
- Create: `src/app/services/page.tsx`
- Create: `src/app/products/page.tsx`
- Modify: `src/app/process/page.tsx`
- Create: `src/app/services/home-building/page.tsx`
- Create: `src/app/projects/page.tsx`
- Create: `src/app/flipbook/page.tsx`
- Create: `src/app/projects/new-builds/page.tsx`
- Create: `src/app/projects/commercial/page.tsx`
- Create: `src/app/projects/renovations-additions/page.tsx`
- Create: `src/app/testimonials/page.tsx`
- Create: `src/app/careers/page.tsx`
- Create: `src/app/contact/page.tsx`
- Create: `src/app/vendors/page.tsx`

- [ ] Each normal page imports the matching content object and renders `PublicPage`.
- [ ] The process route is replaced with the approved Kiefer process content.
- [ ] The flipbook route renders `FlipbookPage`.
- [ ] The contact route renders the existing branded quote form as a dedicated page.
- [ ] The vendors route renders the vendor/supplier inquiry page, not the authenticated vendor login.

### Task 4: Navigation Wiring

**Files:**
- Modify: `src/components/Header.tsx`

- [ ] Update About dropdown to route to `/about`, `/about/team`, `/about/accolades`, and `/blog`.
- [ ] Update Service dropdown to route to `/services`, `/products`, `/process`, `/services/home-building`, and external `https://epsbuildings.com/`.
- [ ] Update Our Work dropdown to route to `/projects`, `/flipbook`, `/projects/new-builds`, `/projects/commercial`, `/projects/renovations-additions`, and `/testimonials`.
- [ ] Update Careers to route to `/careers`.
- [ ] Update Contact dropdown to route to `/contact` and `/vendors`.
- [ ] Keep Client Portal routed to the Kiefer-owned `/portal` experience instead of the old Buildertrend URL.
- [ ] Preserve mobile nav behavior and external link handling.

### Task 5: Verification

**Commands:**
- `npm run typecheck`
- `npm run lint`
- `npm run build`

- [ ] Browser smoke test at least `/about`, `/services`, `/projects`, and `/flipbook`.
- [ ] Browser smoke test `/careers`, `/contact`, `/vendors`, and `/portal`.
- [ ] Verify nav dropdowns expose the new routes and no framework overlay appears.
