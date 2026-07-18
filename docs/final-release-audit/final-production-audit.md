# Final Production Release Audit — www.builtbykiefer.com

**Audit date:** 2026-07-18
**Auditor:** Automated release audit (live-browser session + full headless-Chrome crawl of production)
**Scope:** The deployed production website at `https://www.builtbykiefer.com` as a customer experiences it today. Historical implementations and deleted systems were not inspected — only their absence was verified.

---

## 1. Executive Summary

**Verdict: READY FOR PRODUCTION.**

The deployed site is a pure public marketing and education website. Every page found in production maps to an approved category (marketing, education, services, projects/galleries, testimonials, team, about, process, products, careers, contact, vendor information, homeowner guide, email quote request, SEO, analytics). **78 probes against former operational surfaces (admin, portals, auth, CRM, estimator, dashboards, reports, scheduling, time tracking, lead management, land leads, legacy API endpoints) all returned HTTP 404 with no redirects to working pages.** The only API route in production is `POST /api/quote-request`, which relays the quote form to email via Resend and stores nothing. No Supabase or any other application-backend traffic exists anywhere on the site; the only third-party calls are Google Analytics.

Navigation, dropdowns, footer links, CTAs, forms, galleries, the lookbook, the build-timelapse video, and the Homeowner Guide PDF were all exercised and work. SEO metadata is complete and unique on all 29 routes, the sitemap matches production exactly, and structured data (HomeBuilder + WebSite JSON-LD) is present sitewide. Zero broken links, zero broken images, zero missing alt attributes, zero console errors on public pages, CLS of 0 on every page, and no horizontal overflow on desktop or mobile.

Four minor, non-blocking polish items are listed in §12.

---

## 2. Production Sitemap

29 HTML routes + 1 public document, verified live (all 200 OK) and identical to `sitemap.xml`:

```
/
├── about/                      Our Story
│   ├── team                    Our Team
│   └── accolades               Awards, Press, Recognition
├── why-kiefer-built/           Education hub + Homeowner Guide + Sources
│   ├── sips                    SIPs 101
│   ├── energy-efficiency       Energy Efficiency
│   ├── indoor-air-quality      Indoor Air Quality
│   ├── built-for-colorado      Built for Colorado
│   ├── quality                 Quality & Craftsmanship
│   └── cost-of-ownership       Cost of Ownership
├── services/                   Services overview
│   ├── home-building           Custom Home Building
│   └── custom-elevators        Custom Residential Elevators
├── products                    Products & Finish Partners
├── process                     Design-Build Process
├── projects/                   Project Gallery hub
│   ├── new-builds              New Builds
│   ├── commercial              Commercial Work
│   ├── renovations-additions   Renovations & Additions
│   ├── contemporary-ranch      Case study
│   └── mountain-modern         Case study (with timelapse video)
├── flipbook                    Project Lookbook
├── testimonials                Testimonials
├── service-areas               Northern Colorado Service Areas
├── blog                        Kiefer Built Journal
├── careers                     Careers
├── vendors                     Vendor & Supplier Interest
├── contact                     Request a Quote
└── guides/kiefer-built-homeowner-guide.pdf   (907 KB, application/pdf)
```

Support surfaces: `robots.txt` (200), `sitemap.xml` (200, 29 URLs), branded 404 page, `POST /api/quote-request` (email relay; `GET` → 405).

---

## 3. Navigation

Header (sticky, dark) with five dropdown menus + one direct link, verified open/closed in a live session:

| Menu | Items |
|---|---|
| **About** | Our Story `/about` · Our Team `/about/team` · Accolades `/about/accolades` · Blog `/blog` |
| **Why Kiefer Built** | Overview + SIPs 101, Energy Efficiency, Indoor Air Quality, Built for Colorado, Quality & Craftsmanship, Cost of Ownership |
| **Service** | Our Services `/services` · Our Products `/products` · Our Process `/process` · Home Builds `/services/home-building` · Custom Elevators `/services/custom-elevators` · EPS Homes (external) |
| **Our Work** | Gallery `/projects` · Flipbook `/flipbook` · New Builds · Commercial · Renovations & Additions · Testimonials |
| **Careers** | direct link `/careers` |
| **Contact Us** | Contact `/contact` |

Header also carries a skip-to-content link, `tel:+19705155059`, and `mailto:info@kbuiltco.com`. A floating **“Get a Free Quote”** action (→ `/#contact`) appears after scrolling on interior pages. Footer: EPS Buildings partnership strip, Facebook, Instagram, kbuiltco.com, Nexgen Studio credit, copyright. All five external links verified 200. Every dropdown item routes to a live page; no dead ends.

Routes not in the header (`/vendors`, `/service-areas`, case-study pages) are reached contextually (Products → Vendor Interest; homepage → Explore Service Areas; Gallery → case studies). Crawl cross-check found **no orphaned pages**: every route has at least one inbound link.

---

## 4. Visitor Journeys

1. **Homeowner prospect (primary):** Home hero → Start a Project → embedded quote form → email lands via Resend. Alternate: Our Work → category/case study → “Ready to Build?” → `/contact`. Verified end-to-end (form render + field validation; submission intentionally not fired to avoid sending live email).
2. **Researcher / education-seeker:** Why Kiefer Built hub → six cited topic pages (superscript citations + “Sources & Citations” sections render; industry-data badging present) → Homeowner Guide PDF download → Start a Project. Verified.
3. **Portfolio browser:** Our Work → Gallery / Flipbook → carousels & lookbook pages → case studies with build phases, specs, timelapse. Verified (carousel arrows advance and lazy slides load on demand).
4. **Vendor / supplier:** Products or direct → `/vendors` → interest form composes a `mailto:` to marlys@kbuiltco.com (cc info@). No portal, no backend. Verified.
5. **Job seeker:** Careers → “Email your resume” `mailto:` with Careers subject. Verified.

---

## 5. Public Route Inventory

Every route answers *why it exists / who it serves / what business goal it supports*. Full detail per route (purpose, audience, CTA, SEO, counts) is in **`final-public-routes.csv`**. No page failed the justification test; no removals recommended. Summary of goals:

- **Convert:** `/`, `/contact` (+ embedded form), floating quote CTA — lead generation via email.
- **Persuade:** projects (hub, 3 categories, 2 case studies), flipbook, testimonials, accolades, team, about, process, products.
- **Educate (differentiation):** why-kiefer-built hub + 6 cited topic pages, blog, homeowner guide PDF.
- **Local reach / SEO:** service-areas, HomeBuilder structured data, per-page metadata.
- **Recruit & supply chain:** careers, vendors — both pure email flows.

---

## 6. Content Inventory (condensed per page)

Format: **Hero / Primary message → Supporting → CTA → Trust & educational elements → Media**. All pages share header/footer trust elements (partnership strip, socials, contact details) and correct SEO metadata (§7).

- **/** — H1 “Custom Homes Built With Precision in Northern Colorado.” Stats band (25+ yrs, 200+ projects, NoCO). Sections: trust story, project marquee, custom elevators, “Built better, from the envelope in” (→ education), 4-step process, commercial, service areas, quote form. CTAs: Start a Project, View Projects. Media: 25 images. Trust: stats, EPS partnership.
- **/about** — “Relentless Pursuit of Perfection”; family-run values, expectations, accountability → contact CTA. 5 images.
- **/about/team** — leadership bios (7 images); decisions-close-to-the-work message.
- **/about/accolades** — awards/press/performance recognition; validation content.
- **/blog** — “Kiefer Built Journal”; dated, authored educational posts rendered inline (April 21 2025 · Mark Kiefer, etc.).
- **/careers** — recruiting pitch + “why work here” + email-resume CTA.
- **/contact** — “Tell Kiefer Built what you want to build.” Phone/email/location + 9-field quote form (name, email, phone, location, project type, budget, timeline, details) → Send Quote Request. Educational microcopy explains what to include.
- **/flipbook** — “Kiefer Built Project Lookbook”; paged lookbook (Custom Homes, Efficient Builds, Commercial…), contents card.
- **/process** — “A Design-Build Approach”; consultation → scope → build coordination → walkthrough/warranty.
- **/products** — finish/cabinetry partners “with a builder’s filter”; cross-CTA to vendors.
- **/projects** (hub) — gallery entry to all categories and case studies (9 images).
- **/projects/new-builds · /commercial · /renovations-additions** — category showcases; renovations uses section chips (Kitchens/Bathrooms/Living/Exteriors/Elevators) with 4-view carousels each.
- **/projects/contemporary-ranch · /mountain-modern** — immersive case studies: build phases, project specifications, finished-home galleries; mountain-modern adds the 0:23 build-timelapse video (click-to-play, controls; 2.0 MB mp4, HTTP 200) and page-level Project JSON-LD.
- **/service-areas** — Windsor base + Fort Collins, Loveland, Greeley, Timnath, Northern Colorado.
- **/services · /services/home-building · /services/custom-elevators** — offering pages; home-building highlights EPS/SIP systems; elevators page targets homeowners/designers/accessibility with dedicated photography.
- **/testimonials** — client-relationship proof points.
- **/vendors** — “Become a Vendor or Supplier”; scope note (goods/services, no jobsite labor) + mailto interest form.
- **/why-kiefer-built** + 6 topic pages — research-backed education. Verified on-page: citation superscripts (e.g. 8 on SIPs 101), cited stat bands (~15× airtightness¹, ≈R-14², 140+ mph³), “Sources & Citations” sections with number-agnostic disclaimer and industry-data badges, Homeowner Guide download.
- **/guides/kiefer-built-homeowner-guide.pdf** — 907 KB, application/pdf, downloads correctly.

---

## 7. SEO Audit

Verified on all 29 HTML routes (rendered DOM, JavaScript executed):

| Check | Result |
|---|---|
| Unique `<title>` | ✅ 29/29 unique, descriptive |
| Unique meta description | ✅ 29/29 unique |
| Canonical | ✅ present and self-referencing on every route; homepage canonical not reused anywhere |
| Open Graph (title/desc/image/type) | ✅ present sitewide |
| Twitter card | ✅ present sitewide |
| Structured data | ✅ `HomeBuilder` + `WebSite` JSON-LD in the root layout on every page; `/projects/mountain-modern` adds a Project schema |
| Single H1 | ✅ exactly one H1 on all 29 routes |
| H2 hierarchy | ✅ logical section H2s under the H1 on every page |
| `robots.txt` | ✅ 200; allows all, disallows `/api/`, points to sitemap |
| `sitemap.xml` | ✅ 200; exactly the 29 public routes — no missing, no extras, no dead URLs |
| Indexability | ✅ no stray `noindex`; `lang="en"` set |
| Analytics | ✅ Google Analytics via googletagmanager/google-analytics (only third-party present) |

Minor polish (non-blocking): a handful of titles omit the brand suffix (e.g. “Request a Quote”, “Project Lookbook”, “Contemporary Ranch”) while most use “… | Kiefer Built”; and there is no `/favicon.ico` fallback (PNG icons are declared and served, but user agents requesting the bare `.ico` — e.g. when viewing the PDF directly — get a 404).

---

## 8. Accessibility

- **Keyboard:** Skip-to-content link is first in tab order; all menus/links reachable; dropdown buttons focusable; Escape closes menus. Verified live.
- **Focus indicators:** clearly visible outline on focused nav items and controls (screenshot-verified).
- **Alt text:** 0 rendered images missing `alt` across the entire site.
- **Landmarks:** header/nav/main/footer present on 28/29 pages; `/projects/mountain-modern` (custom layout) lacks a `<main>` landmark — minor.
- **Language:** `html lang="en"`.
- **Observation:** on the two scroll-animated pages (home, mountain-modern), jumping with PageDown can land on sections before their entrance animation fires, briefly showing an empty band until further scroll input. Cosmetic; content is reachable and renders. Consider reduced-motion handling / earlier animation triggers.

---

## 9. Performance & Quality

- **Console:** no JavaScript errors or page errors on any public page (live session + crawl).
- **Network:** no failed requests on any HTML page. Only cross-origin traffic is Google Analytics. **No `*.supabase.co` or any application-backend requests anywhere.**
- **Layout stability:** CLS = 0 on all 29 routes.
- **Fonts:** all loaded (`document.fonts.status === "loaded"` everywhere); no font 404s.
- **Overflow:** no horizontal overflow on desktop (1440px) or mobile (390px, 6 representative pages tested).
- **Responsive:** mobile hamburger (“Open menu”) opens correctly; mobile layouts verified for home, services, projects, why-kiefer-built, contact, vendors.
- **Load:** full network-idle page loads 3.1–5.7 s in the crawl (image-heavy pages at the top of that range); no page exceeded 10 s.
- **Images:** every image asset returns HTTP 200. Gallery/marquee slides and partner logos use lazy loading — offscreen carousel slides intentionally defer until swiped (verified loading on interaction). Note: carousel slides request `w=3840` optimizer variants; on slow connections newly-revealed slides take noticeable time (see §12).

---

## 10. Screenshot Inventory

Stored in `docs/final-release-audit/screenshots/` (desktop full-page unless noted). No deleted-system or historical screenshots exist — none were capturable, since all such routes 404.

| Required item | File(s) |
|---|---|
| Homepage | `home.jpg` |
| Navigation (menu open) | `navigation-open.jpg` |
| About / Team / Accolades | `about.jpg`, `about-team.jpg`, `about-accolades.jpg` |
| Services (+ subpages) | `services.jpg`, `services-home-building.jpg`, `services-custom-elevators.jpg` |
| Projects hub | `projects.jpg` |
| Every project category | `projects-new-builds.jpg`, `projects-commercial.jpg`, `projects-renovations-additions.jpg`, `projects-contemporary-ranch.jpg`, `projects-mountain-modern.jpg` |
| Testimonials | `testimonials.jpg` |
| Why Kiefer Built + educational pages | `why-kiefer-built.jpg` + `why-kiefer-built-{sips,energy-efficiency,indoor-air-quality,built-for-colorado,quality,cost-of-ownership}.jpg` |
| Products / Process | `products.jpg`, `process.jpg` |
| Contact | `contact.jpg` |
| Vendor page | `vendors.jpg` |
| Careers | `careers.jpg` |
| Footer (with quote form) | `footer.jpg` |
| 404 page | `404.jpg` |
| Extras | `blog.jpg`, `flipbook.jpg`, `service-areas.jpg`, `guides-kiefer-built-homeowner-guide.pdf.jpg` (PDF renders), mobile set `mobile-{home,services,projects,why-kiefer-built,contact,vendors}.jpg`, `mobile-nav-open.jpg` |

---

## 11. Release Readiness — Removed Systems Verification

78 URLs across every former operational category were probed with redirect-following disabled, then re-verified rendered. **All returned HTTP 404 (Next.js not-found), with no redirects to working pages.** A random unknown URL also returns a branded 404 page (status 404, “404” heading). Categories covered:

| Category | Example probes | Result |
|---|---|---|
| Admin | `/admin`, `/admin/dashboard`, `/admin/land-leads`, `/admin/leads`, `/admin/projects`, `/admin/clients`, `/admin/settings`, `/admin/login` | 404 all |
| Client/vendor portals | `/portal`, `/portal/login`, `/portal/dashboard`, `/client-portal`, `/clients`, `/vendor`, `/vendor/login`, `/vendor-portal` | 404 all |
| Authentication | `/login`, `/logout`, `/signin`, `/sign-in`, `/signup`, `/sign-up`, `/register`, `/forgot-password`, `/reset-password`, `/auth`, `/auth/login`, `/auth/callback`, `/auth/signin`, `/auth/signout` | 404 all |
| Estimator | `/estimate`, `/estimates`, `/estimator`, `/quote-tool` | 404 all (quote intake is the email form) |
| CRM / PM / dashboards | `/dashboard`, `/crm`, `/crm/leads`, `/crm/contacts`, `/project-management`, `/projects/manage`, `/pm`, `/internal`, `/ops` | 404 all |
| Demo | `/demo`, `/demos`, `/sandbox` | 404 all |
| Reports / financial | `/reports`, `/reporting`, `/finance`, `/financials`, `/invoices`, `/billing`, `/payments` | 404 all |
| Scheduling / time | `/scheduling`, `/schedule`, `/calendar`, `/time-tracking`, `/timesheets`, `/timeclock` | 404 all |
| Leads / land leads | `/leads`, `/lead-management`, `/land-leads`, `/land-lead-finder`, `/land` | 404 all |
| Legacy APIs / Supabase surface | `/api/leads`, `/api/land-leads`, `/api/auth`, `/api/auth/login`, `/api/admin`, `/api/estimate`, `/api/projects`, `/api/crm`, `/api/clients`, `/api/reports`, `/api/time-tracking`, `/api/supabase`, `/api/webhooks`, `/api/health` | 404 all |

**Remaining API surface:** exactly one route, `/api/quote-request`. `GET` → 405; `POST` relays the quote form to email via the Resend API (`CONTACT_EMAIL_FROM/TO`), with a client-side mailto fallback. No persistence, no session, no cookies, no auth. Runtime network monitoring across the full crawl confirmed **zero Supabase or other backend requests** — the only third-party host contacted is Google Analytics. No blockers found; no blocker screenshots exist because nothing survived to capture.

---

## 12. Remaining Issues (all minor, non-blocking)

1. **Missing `<main>` landmark on `/projects/mountain-modern`** (custom case-study layout) — accessibility consistency.
2. **No `/favicon.ico` fallback** — PNG icons are configured and served, but direct `.ico` requests 404 (visible when viewing the PDF guide directly).
3. **Scroll-animation blank states on fast keyboard paging** (home, mountain-modern): sections that animate on scroll can appear briefly empty when jumped into via PageDown/End. Cosmetic.
4. **Heavy carousel image variants:** lazy slides request `w=3840&q=75` renditions (multi-MB); newly-revealed slides can take seconds on slower connections. Constrain `sizes` so carousels fetch ≤1080–1920 px variants.
5. *(Polish)* Inconsistent title-suffix branding on a few pages (e.g. “Request a Quote” lacks “| Kiefer Built”).

---

## 13. Recommended Future Improvements

- Add `sizes`-appropriate image renditions for carousels/marquees (biggest perceived-performance win).
- Add a real `favicon.ico` and a `<main>` wrapper to the mountain-modern layout.
- Add `prefers-reduced-motion` handling and earlier `whileInView` trigger margins to remove blank-band flashes.
- Consider a `poster` on the build-timelapse video for an instant first frame.
- Normalize title suffixes; consider per-page OG images for the education series (currently sitewide image).
- Optionally add `FAQPage`/`Article` structured data to the education pages to build on the existing HomeBuilder/WebSite schema.

---

## 14. Final Approval Checklist

- ✅ Every public page visited (29/29 routes + PDF, rendered in a real browser with JS, lazy loading allowed, fully scrolled)
- ✅ Every navigation link clicked; ✅ every dropdown opened (5 menus enumerated + mobile hamburger)
- ✅ Every internal link followed (full BFS crawl + menu-only routes; 0 broken; all anchor fragments resolve; 0 orphans)
- ✅ Every image loaded (all assets HTTP 200; 0 broken; 0 missing alt; lazy carousel behavior verified on interaction)
- ✅ Every gallery works (carousel chips/arrows, category showcases, lookbook, case-study galleries)
- ✅ Every video works (build-timelapse: player renders with controls/duration; file 200, video/mp4, 2.0 MB)
- ✅ Every CTA works (Start a Project → form; floating quote; careers & vendor mailtos; tel/email; external partner links 200)
- ✅ Every form renders correctly (contact 9-field form + submit, homepage embedded form, vendor mailto form — not submitted, to avoid sending live email)
- ✅ Every SEO field validated (titles, descriptions, canonicals, OG, Twitter, JSON-LD, H1s, robots.txt, sitemap.xml)
- ✅ Every deleted system confirmed absent (78 probes → 404, no redirects)
- ✅ No admin routes · ✅ No portals · ✅ No authentication · ✅ No CRM · ✅ No operational dashboards · ✅ No demo features
- ✅ No hidden production pages (crawl ∪ sitemap ∪ nav = the same 29 routes; only additive public asset is the Homeowner Guide PDF)
- ✅ Production reflects only the approved public marketing website

## 15. Release Approval

**READY FOR PRODUCTION.** The production website contains exclusively the approved public marketing surface — marketing pages, cited educational content, services, projects and galleries, testimonials, team, about, process, products, careers, contact with email-based quote requests, vendor information, the homeowner guide, complete SEO, and analytics — and nothing else. Every former operational system is verifiably gone from the deployed surface, the single remaining API endpoint is the stateless email relay that the approved quote form requires, and site quality (navigation, content, accessibility, stability, metadata) meets release standard with only cosmetic follow-ups remaining.

> This audit verifies the completed production website after the CRM and operational platform were removed. It reflects the final public deliverable rather than any historical implementation.
