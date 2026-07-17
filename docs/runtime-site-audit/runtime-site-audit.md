# Runtime Website Architecture Audit

Production site: https://www.builtbykiefer.com  
Audit window: 2026-07-15–16 UTC timestamps  
Audit mode: rendered-browser inspection only

## Executive Summary

This audit found 120 browser-rendered production routes: 116 returned HTTP 200, two returned 404, and two returned 500. The live surface consists of 32 customer-facing marketing, education, planning, project, and demo pages; three login pages; 80 admin-path pages; four client-portal pages beyond the login screen; and one vendor-workboard page beyond its login screen. Four additional admin PDF endpoints downloaded successfully. The standard robots and sitemap resources were also inspected.

The public marketing experience is visually strong. It uses high-quality real project photography, a consistent charcoal/cream/red system, clear project-start CTAs, and an unusually substantial cited education library. All 25 internal destinations exposed by the desktop header were clicked successfully. The mobile menu rendered the same destination set, and a mobile link click to /about/team succeeded. The repeated “Start a Project” CTA worked both on the homepage and from a child page, landing on the homepage quote form.

The highest-risk runtime fact is not visual: production is running with Demo Admin and Client Portal data publicly accessible. /login explicitly says “Demo mode: enabled” and links directly to /admin. /admin renders realistic leads, phone numbers, project finances, schedules, and operations records without an authentication challenge. /portal likewise exposes a named demo client, project progress, attention items, and a $7,195 balance without a login challenge.

Confirmed broken runtime destinations are:

- /vendor — HTTP 500 and a “This page couldn’t load” error boundary.
- /admin/vendor-submittals/vendor-submittal-1/download — HTTP 500; linked from admin project/vendor surfaces.
- /portal/projects/project-2 — HTTP 404.
- /portal/projects/project-3 — HTTP 404.

No broken rendered images were found after full-page scrolling and lazy-load settling. The Mountain Modern MP4 initially appeared as an aborted navigation request during the recursive crawl, but a focused browser test proved it is healthy: it returned HTTP 200 as video/mp4 and advanced playback time.

SEO signals are materially incomplete. Of 35 marketing/login pages, 25 reuse the homepage title and description, 33 canonicalize to the homepage instead of themselves, all render index, follow, and the sitemap contains only the homepage. /contact has no H1. Login and development/demo pages inherit marketing structured data and indexability signals.

Key evidence:

- [Homepage full page](./screenshots/home--full.png)
- [Desktop Why Kiefer Built menu](./screenshots/navigation--desktop--why-kiefer-built.png)
- [Expanded mobile menu](./screenshots/navigation--mobile--runtime-expanded.png)
- [Demo Admin command center](./screenshots/admin--full.png)
- [Public demo client portal](./screenshots/portal--full.png)
- [Vendor 500 error](./screenshots/vendor--full.png)
- [Portal 404](./screenshots/portal--projects--project--2--full.png)

The route-level evidence, link destinations, page copy, interactions, screenshots, and issues are in [runtime-page-inventory.csv](./runtime-page-inventory.csv).

## Audit Method and Scope

The audit used Playwright Chromium with JavaScript enabled at a 1440×1000 desktop viewport and a 390×844 mobile viewport for navigation. Each route was opened in a real browser, allowed to render, scrolled to the bottom in steps to trigger lazy content, returned to the top, and captured as a full-page and above-the-fold screenshot. Menus were opened; internal links were recursively followed; redirects, console messages, failed requests, metadata, structured data, images, forms, tables, video, and fixed elements were recorded.

The crawl began at the homepage. Direct-URL candidates from the existing repository comparison inventory were also opened in the browser so that runtime pages absent from navigation could be distinguished from routes that do not deploy. This report makes no claims from source code: a route is included only if production returned and rendered it.

Focused human-style interaction checks covered:

- All 23 desktop dropdown destinations plus the logo and Careers link: 25/25 passed.
- Expanded mobile navigation and a mobile click to /about/team.
- Homepage and child-page Start a Project CTAs.
- Project cost planner calculation.
- All five project-timeline selectors.
- Before/after drag interaction.
- Renovation gallery controls.
- Education citation anchors.
- Mountain Modern video playback.
- Four visible admin PDF downloads.
- Fresh retests of every 404/500 route.

No quote, vendor, login, or mutating admin form was submitted. No external domain was crawled. Facebook, Instagram, Houzz, EPS Buildings, kbuiltco.com, Nexgen Studio, mailto, and telephone links were recorded only.

## Complete Sitemap

### Customer-facing marketing and content pages — 32

| Area | Runtime routes | Status |
|---|---|---|
| Home | / | 200 |
| About | /about, /about/team, /about/accolades, /blog, /careers | 200 |
| Contact and planning | /contact, /estimate, /project-timelines | 200 |
| Services | /services, /services/home-building, /services/custom-elevators, /products, /process, /service-areas, /vendors | 200 |
| Work | /projects, /projects/new-builds, /projects/commercial, /projects/renovations-additions, /projects/contemporary-ranch, /projects/mountain-modern, /flipbook, /testimonials | 200 |
| Education | /why-kiefer-built, /why-kiefer-built/sips, /why-kiefer-built/energy-efficiency, /why-kiefer-built/indoor-air-quality, /why-kiefer-built/built-for-colorado, /why-kiefer-built/quality, /why-kiefer-built/cost-of-ownership | 200 |
| Exposed development/demo | /demo-slider | 200 |

### Login, portal, and vendor boundaries

| Route | Runtime result | Reachability |
|---|---|---|
| /login | 200; “Demo mode: enabled”; one-click Enter Demo Console | Direct URL only |
| /portal/login | 200; client password and email-link forms | Direct URL only |
| /vendor/login | 200; vendor password and email-link forms | Direct URL only |
| /portal | 200; demo client dashboard, no auth challenge | Direct URL/runtime boundary probe |
| /portal/projects/project-1 | 200; demo client project | Linked from /portal |
| /portal/projects/project-2 | 404 | Broken portal project destination |
| /portal/projects/project-3 | 404 | Broken portal project destination |
| /vendor | 500 | Direct URL/runtime boundary probe |

### Admin runtime — 80 rendered routes

All of these were reachable in production without an authentication challenge. Seventy-nine returned 200; the vendor-submittal download route returned 500.

Top-level command center and modules:

~~~text
/admin
/admin/bills
/admin/change-orders
/admin/comments
/admin/daily-logs
/admin/finance-tools
/admin/invoices
/admin/leads
/admin/photos
/admin/projects
/admin/proposals
/admin/purchase-orders
/admin/reports
/admin/rfis
/admin/schedule
/admin/selections
/admin/tasks
/admin/time
/admin/vendors
/admin/warranty
~~~

Lead records and actions:

~~~text
/admin/leads/new
/admin/leads/lead-1
/admin/leads/lead-2
/admin/leads/lead-3
/admin/leads/lead-4
/admin/leads/lead-5
/admin/leads/lead-1/proposals/new
/admin/leads/lead-2/proposals/new
/admin/leads/lead-3/proposals/new
/admin/leads/lead-4/proposals/new
/admin/leads/lead-5/proposals/new
~~~

Project records and actions: the following 14 child routes rendered for each actual runtime ID project-1, project-2, and project-3, in addition to the three project detail pages.

~~~text
/admin/projects/project-1
/admin/projects/project-2
/admin/projects/project-3

/admin/projects/{project-1|project-2|project-3}/bills/new
/admin/projects/{project-1|project-2|project-3}/change-orders/new
/admin/projects/{project-1|project-2|project-3}/comments/new
/admin/projects/{project-1|project-2|project-3}/daily-logs/new
/admin/projects/{project-1|project-2|project-3}/files/new
/admin/projects/{project-1|project-2|project-3}/financials/edit
/admin/projects/{project-1|project-2|project-3}/photos/new
/admin/projects/{project-1|project-2|project-3}/purchase-orders/new
/admin/projects/{project-1|project-2|project-3}/rfis/new
/admin/projects/{project-1|project-2|project-3}/selections/new
/admin/projects/{project-1|project-2|project-3}/tasks/new
/admin/projects/{project-1|project-2|project-3}/updates/new
/admin/projects/{project-1|project-2|project-3}/vendors/new
/admin/projects/{project-1|project-2|project-3}/warranty/new
~~~

Other details and error:

~~~text
/admin/proposals/proposal-1
/admin/change-orders/change-order-1
/admin/vendors/new
/admin/vendor-submittals/vendor-submittal-1/download   [500]
~~~

### Working browser-download endpoints

These are non-HTML endpoints and are not included in the 120 rendered-page count.

| Endpoint | Browser result |
|---|---|
| /admin/proposals/proposal-1/download | Downloaded as KBP-2026-001.pdf |
| /admin/invoices/invoice-1/download | Downloaded as KBC-2026-001.pdf |
| /admin/invoices/invoice-2/download | Downloaded as KBC-2026-002.pdf |
| /admin/change-orders/change-order-1/download | Downloaded as KBCO-2026-001.pdf |

### Technical resources

- /robots.txt — 200 text/plain; User-agent: *, Allow: /, and a sitemap reference.
- /sitemap.xml — 200 application/xml; contains only https://www.builtbykiefer.com/ plus five homepage images.
- No redirect was observed among the 120 page requests. Anchor changes such as /#contact are client navigation, not redirects.

## Navigation Tree

The desktop header is fixed. Dropdowns open on hover and all 25 internal destinations tested successfully.

~~~text
Kiefer Built logo -> /
├── About
│   ├── Our Story -> /about
│   ├── Our Team -> /about/team
│   ├── Accolades -> /about/accolades
│   └── Blog -> /blog
├── Why Kiefer Built
│   ├── Overview -> /why-kiefer-built
│   ├── SIPs 101 -> /why-kiefer-built/sips
│   ├── Energy Efficiency -> /why-kiefer-built/energy-efficiency
│   ├── Indoor Air Quality -> /why-kiefer-built/indoor-air-quality
│   ├── Built for Colorado -> /why-kiefer-built/built-for-colorado
│   ├── Quality & Craftsmanship -> /why-kiefer-built/quality
│   └── Cost of Ownership -> /why-kiefer-built/cost-of-ownership
├── Service
│   ├── Our Services -> /services
│   ├── Our Products -> /products
│   ├── Our Process -> /process
│   ├── Home Builds -> /services/home-building
│   ├── Custom Elevators -> /services/custom-elevators
│   └── EPS Homes -> https://epsbuildings.com/ [recorded, not crawled]
├── Our Work
│   ├── Gallery -> /projects
│   ├── Flipbook -> /flipbook
│   ├── New Builds -> /projects/new-builds
│   ├── Commercial -> /projects/commercial
│   ├── Renovations & Additions -> /projects/renovations-additions
│   └── Testimonials -> /testimonials
├── Careers -> /careers
└── Contact Us
    └── Contact -> /contact
~~~

Mobile navigation is a full-screen dark overlay. It renders the same categories and children as a single long expanded list rather than separate accordion controls. The mobile overlay also includes Careers and Contact. A click from that overlay to /about/team succeeded.

The global footer does not provide an internal sitemap. It records only external destinations:

- EPS Buildings.
- Facebook.
- Instagram.
- kbuiltco.com.
- Nexgen Studio.

Additional navigation:

- Homepage anchors: #projects and #contact.
- Estimate anchor: #planner.
- Renovations anchor: #kitchens.
- Education citation anchors: #source-1 through the locally numbered source list.
- Contemporary Ranch and Mountain Modern use “Back to Portfolio” links that lead to /, not /projects.
- No public breadcrumb component was observed.
- /portal/login and /portal display a floating notification/bell control; the vendor and marketing login screens do not.
- Admin uses fixed dropdown categories: Sales, Jobs, Project Management, Files, Messaging, Financial, and Reports.

### Routes absent from global navigation

Six customer-facing pages require a direct URL:

- /demo-slider
- /estimate
- /project-timelines
- /projects/contemporary-ranch
- /projects/mountain-modern
- /service-areas

Three login pages are also direct-URL-only: /login, /portal/login, and /vendor/login. /vendors is not global-navigation content but is reachable from the Vendor Interest CTA on /products.

The two detailed project showcases are genuinely orphaned from the runtime project hub. /projects links to category pages, not /projects/contemporary-ranch or /projects/mountain-modern.

## Visitor Journeys

### Primary custom-home conversion

~~~text
Visitor
  -> Homepage
  -> Home Building or Why Kiefer Built
  -> New Builds / education detail
  -> Start a Project
  -> Homepage #contact
  -> Quote form
~~~

The Start a Project behavior was tested from both / and /about. It lands on a real #contact target and scrolls to the quote form.

### Homeowner education path

~~~text
Homepage
  -> Why Kiefer Built
  -> SIPs / Energy / Indoor Air / Colorado / Quality / Cost
  -> Cross-topic secondary CTA
  -> Sources & Citations
  -> Start a Project
  -> Quote form
~~~

This is the strongest information architecture on the site. The hub distributes to six focused pages; secondary CTAs create a useful loop among SIPs, energy, ownership, air quality, quality, and Colorado resilience.

### Project discovery path

~~~text
Homepage #projects or Our Work
  -> /projects
  -> New Builds / Commercial / Renovations / Custom Elevators
  -> Start a Project
  -> Quote form
~~~

The path does not reach the two highest-detail showcases. Contemporary Ranch and Mountain Modern require a manual URL and return to / rather than the gallery.

### Renovation path

~~~text
Services
  -> Renovations & Additions
  -> Kitchen / Bath / Living / Exterior / Elevator carousels
  -> Start a Renovation
  -> Quote form
~~~

### Estimate path

~~~text
Manual URL /estimate
  -> Select project type
  -> Enter approximate size
  -> Select finish level
  -> Calculate planning range
  -> Request Free Quote
  -> Homepage #contact
~~~

The calculator worked. An 80-square-foot Premium bathroom test produced a $18,360–$24,840 early planning range and displayed an explicit non-quote disclaimer. No contact form was submitted.

### Timeline path

~~~text
Manual URL /project-timelines
  -> Select one of five project types
  -> Review phases and quick-comparison table
  -> Get Free Consultation
  -> /contact
~~~

All five selectors worked. The page is not linked from the public marketing shell.

### Vendor path

~~~text
Service -> Products
  -> Vendor Interest
  -> /vendors
  -> Supplier form
  -> Prepared mailto workflow
~~~

The form was inspected but not submitted. The authenticated trade-partner path is separate: /vendor/login exists, while /vendor fails with HTTP 500.

### Career path

~~~text
Header Careers
  -> /careers
  -> Email Your Resume [mailto]
     or Contact the Team -> /contact
~~~

### Customer trust path

~~~text
About / Team / Accolades / Testimonials
  -> owner-led narrative, named leadership, awards, customer summaries
  -> Start a Project
  -> Quote form
~~~

### Client and admin paths as production actually behaves

~~~text
Manual /login -> Enter Demo Console -> /admin [no auth challenge]
Manual /portal -> Demo client dashboard [no auth challenge] -> project-1 [200], project-2 [404], project-3 [404]
Manual /vendor/login -> sign-in forms [not submitted]
Manual /vendor -> 500
~~~

## Information Architecture

The marketing site uses five visible top-level categories: About, Why Kiefer Built, Service, Our Work, and Contact, with Careers as a direct header item. Conversion is centralized around one homepage contact section, which gives most pages a consistent outcome.

Hierarchy strengths:

- Education is cleanly hub-and-spoke and reinforced by cross-topic CTAs.
- Service and work categories use clear nouns and real photography.
- The quote path is stable and consistently labeled.
- The global marketing shell is recognizable across most pages.

Hierarchy gaps:

- The footer provides no internal recovery navigation.
- Detailed project stories are disconnected from the gallery.
- Planning tools and service-area content exist outside navigation.
- The “Blog” is a card collection without article destinations.
- Auth/admin/portal/vendor surfaces are entirely outside the marketing hierarchy but are publicly addressable.
- /demo-slider is developer documentation, not customer information architecture.
- /project-timelines is visually and structurally detached from the rest of the site.

Content categories:

| Category | Runtime content |
|---|---|
| Core company | Family-run builder, owner involvement, Northern Colorado, clear communication, detail-first execution |
| Services | Custom homes, renovations/additions, commercial, elevators, products, process, service area |
| Education | SIPs, measured energy, air quality, Colorado hazards, quality, lifetime ownership |
| Project proof | Category gallery, renovation carousels, two detailed showcase pages, lookbook, video |
| Trust | Team, accolades, testimonials, project photos, cited sources, EPS partnership |
| Conversion | Start a Project, Request a Quote, calculator, phone/email, vendor form, career mailto |
| Operations | Demo Admin, client portal, vendor login/workboard |
| Temporary/development | Before/After Slider Demo; isolated Project Timelines template |

### Audience map

| Audience | Primary runtime pages |
|---|---|
| Prospective custom-home owners | /, /services/home-building, /projects/new-builds, /why-kiefer-built and its six children |
| Remodel/addition prospects | /projects/renovations-additions, /estimate, /project-timelines, /contact |
| Commercial clients | /projects/commercial, /services |
| Elevator/accessibility clients and designers | /services/custom-elevators, elevator section of /projects/renovations-additions |
| Project-research visitors | /projects, /flipbook, Contemporary Ranch, Mountain Modern, Testimonials |
| Trust/reputation researchers | /about, /about/team, /about/accolades, /testimonials |
| Job candidates and trades | /careers |
| Suppliers | /products, /vendors |
| Existing clients | /portal/login and the currently public demo /portal |
| Trade partners | /vendor/login and the failing /vendor workboard |
| Internal Kiefer staff | /login and the currently public Demo Admin route family |

## Visual Hierarchy

Across the standard marketing template, attention generally falls in this order: large project photograph and H1, red primary CTA, then proof points or the first content section. The strongest visual asset is the photography. The strongest repeated action is the red Start a Project button.

| Route | Attention order and strongest element | Weakest or confusing element | Consistency assessment |
|---|---|---|---|
| / | Hero home + H1; CTAs; 25+/200+/NoCO proof | Long page and repeated moving-gallery content can delay the form | Strongest expression of global system |
| /about | Hero + owner-led message; proof labels; alternating story sections | Similar hero/template rhythm to other pages reduces distinction | Consistent and professional |
| /about/team | Team H1; four portrait cards; leadership message | Bios are visually brief | Strong global shell and human trust |
| /about/accolades | Mountain hero; three recognition cards; CTA | Only three cards and little provenance detail | Clean but thin |
| /blog | Hero; four article-style cards; CTA | Cards look actionable but have no links | Visually polished, functionally incomplete |
| /careers | Hero; Email Resume CTA; role cards | No current-opening detail or application workflow | Consistent marketing template |
| /contact | Form dominates; contact details; submit button | Missing H1; little visual transition before footer | Strong conversion layout |
| /estimate | Hero; planner form; result/quote sidebar | Direct-only and cost figures require ongoing owner review | Strong global shell; bespoke tool works |
| /project-timelines | Title; project selectors; timeline panel/table | Emojis, generic “Our Guarantee,” and no global shell | Clear utility but redesign-inconsistent |
| /demo-slider | Before/after image; drag handle; code guide | Public implementation instructions dominate after demo | Development artifact |
| /services | Hero; service-card grid; CTA | Fifth card sits alone, leaving a sparse second row | Template-consistent but imbalanced |
| /services/home-building | Dark home hero; alternating image/text sections; CTA | Copy is comparatively brief | Strong, balanced template use |
| /services/custom-elevators | Custom collage hero; coordination steps; project gallery | Denser than other services but not confusing | Bespoke and highly persuasive |
| /products | Kitchen hero; partner cards; vendor CTA | Fourth finish card sits alone; thin product depth | Consistent but imbalanced |
| /process | Hero; five numbered steps; CTA | Sparse 3+2 card layout and little proof | Clear but visually thin |
| /service-areas | Service-area heading; six city cards; county/distance panels | Very dark, small text; no real interactive map; direct-only | Custom dark template, less legible |
| /projects | Project hero; four category cards; CTA | No links to detailed showcase projects | Consistent gallery hub |
| /projects/new-builds | Hero; three project-type cards; CTA | Thin evidence and generic category summaries | Consistent but sparse |
| /projects/commercial | Hero; one image/text section; CTA | Very little project proof | Consistent but thinnest work page |
| /projects/renovations-additions | Hero; five category cards; alternating carousels | Long page and small carousel guidance text | Strong bespoke work showcase |
| /projects/contemporary-ranch | Hero; phases/specs; 29-photo mosaic; green CTA | No global header; “Back to Portfolio” goes home | Polished but separate visual system |
| /projects/mountain-modern | Hero; build video; phases/specs; gallery | No global header; direct-only | Excellent custom story, visually disconnected |
| /flipbook | Oversized title; horizontal cards; CTA pair | Rightmost card is visibly clipped without an obvious control | On-brand dark shell, ambiguous interaction |
| /testimonials | Hero; five customer cards; review CTA | Text is paraphrased rather than presented as sourced quotation | Consistent and readable |
| /vendors | Large heading; supplier form; contact card | Mailto workflow is not apparent until copy is read | Consistent and task-focused |
| /why-kiefer-built | Evidence hero; six education cards; sources | Dense citation text is visually small | Strong and credible |
| /why-kiefer-built/sips | Proof-stat hero; comparison table; sources | Long technical text at small size | Strong education template |
| /why-kiefer-built/energy-efficiency | Measured-stat hero; three evidence sections; sources | Dense numbers demand careful reading | Strong education template |
| /why-kiefer-built/indoor-air-quality | Health-stat hero; alternating evidence sections; sources | Long source list and small type | Strong education template |
| /why-kiefer-built/built-for-colorado | Hazard-stat hero; three risks; comparison table; sources | Longest/most information-dense page | Strong education template |
| /why-kiefer-built/quality | Owner-led hero; family/material sections; one source | Lighter evidence depth than sibling pages | Strong template, intentionally narrative |
| /why-kiefer-built/cost-of-ownership | Ownership-stat hero; energy/weather/tradeoff sections | Long copy and data density | Strong education template |
| /login | Centered Demo Admin card and red entry CTA | Production demo access is the dominant action | Auth shell is coherent, runtime exposure is risky |
| /portal/login | Centered client login; password and email-link forms | Floating bell appears on login; marketing metadata is unrelated | Coherent auth shell |
| /vendor/login | Centered vendor login; password and email-link forms | No recovery/help link; workboard later fails | Coherent auth shell |
| /admin and child routes | Dense black top nav; cream operational cards/tables/forms | Public exposure and realistic data overshadow UI quality | Internally consistent operations system |
| /portal and project-1 | Client status/balance first; project card second | Demo financial/person data is public; two linked project IDs fail | Coherent portal system |
| /vendor | Error icon; failure message; Reload | Entire page is unusable | Standard framework error boundary |

No horizontal viewport overflow was observed at 1440 pixels. Desktop headers, typography, cream surfaces, charcoal sections, red buttons, and card borders are consistent on standard marketing pages. The bespoke showcase, development, timeline, auth, admin, portal, and error shells form distinct visual systems.

## CTA Inventory

| CTA label | Destination | Where it appears | Runtime result |
|---|---|---|---|
| Start a Project | /#contact, or #contact on / | Most marketing and education pages | Verified from home and /about; correct target exists and page scrolls to form |
| View Projects | /#projects on home | Homepage hero | Valid anchor |
| See the Work | /projects | Why Kiefer Built hub | 200 |
| View Gallery | /projects | Flipbook | 200 |
| View New Builds | /projects/new-builds | Home Building | 200 |
| Discuss/View Elevator | /#contact or /services/custom-elevators | Home, services, renovations | All destinations 200/valid anchor |
| Start a Renovation | /#contact | Renovations & Additions | Valid target |
| Explore Categories | #kitchens | Renovations & Additions | Valid anchor |
| Start Planning | #planner | Estimate | Valid anchor |
| Request a Quote / Request Free Quote | /#contact | Estimate | Valid target |
| Education secondary CTAs | Other /why-kiefer-built pages | All six education details | All destination pages 200 |
| Meet the Team | /about/team | About and Quality | 200 |
| Contact the Team | /contact | Careers | 200 |
| Email Your Resume | mailto:info@kbuiltco.com | Careers | Recorded only |
| Vendor Interest | /vendors | Products | 200 |
| Send Vendor Information | Prepared mailto workflow | Vendors form | Not submitted |
| Leave a Review | Houzz external URL | Testimonials | Recorded only |
| Call (970) 515-5059 | tel links | Home/contact/estimate/service areas/timelines | Recorded only |
| Enter Demo Console | /admin | /login | 200 with no auth challenge |
| Open Project | /portal/projects/project-1 | /portal | 200 |
| Admin PDF downloads | Four /admin/.../download endpoints | Proposal, invoice, change-order UI | All four downloaded successfully |

The public runtime has no homeowner-guide PDF link or download band. No form-success destination was tested because the audit did not submit forms.

## Content Inventory

### Recurring messaging

- Craftsmanship: “precision,” “detail-first,” “premium craftsmanship,” work that “still works later,” and finish coordination.
- Trust and communication: owner accountability, clear expectations, builder-led process, responsiveness, trade coordination, and transparency.
- Long-term value: envelope performance, recurring energy costs, weather exposure, maintenance, and ownership tradeoffs.
- Energy efficiency: SIP airtightness, DOE Zero Energy Ready Home performance, Oak Ridge monitoring, and right-sized systems.
- Colorado-specific building: hail, wildfire, snow, wind, WUI exposure, local loads, and Northern Colorado service territory.
- Indoor air quality: pollutant concentration, time indoors, planned ventilation, moisture, combustion safety, and low-emission choices.
- Customization: owner goals, design decisions, finish choices, custom elevators, new builds, renovations, and commercial scope.
- Family/owner involvement: Mark, Mindy, Miles, and Marlys Kiefer; decisions kept close to the work.
- Education: six-topic education hub with local citation numbering and source lists.
- Project proof: real photography, detailed renovation carousels, two bespoke project stories, and one build video.
- Partnerships: EPS Buildings appears in the header service menu and most standard footers.
- Conversion: one shared quote form, phone/email, estimator, vendor mailto form, and career email.
- Operations: realistic admin, client, and vendor workflows presented as a separate Kiefer-branded platform.

### Trust statements and promises that merit owner/legal verification

The audit does not determine factual truth. The following visible claims should have retained evidence or owner approval:

- “25+ years” and “200+ homes and projects completed.”
- 2025 SIPA Building Excellence Award and Best of Houzz Service.
- “NoCO Northern Colorado focus” and six-community service coverage.
- “Our Guarantee” language on /project-timelines, including weekly updates, clear delay communication, on-time completion commitment, and realistic estimates.
- Specific project duration and calculator range assumptions.
- Awards, client-review paraphrases, project specifications, and partnership statements.
- Education facts and operational capability language; the citation mechanism is strong, but the claims should continue to match their listed sources and actual Kiefer practices.

### Placeholder, incomplete, or development-oriented content

- /demo-slider contains source import examples, example image paths, component usage code, and a documentation filename. It is a development demo.
- /blog has four complete-looking cards but no article links.
- /project-timelines looks like a standalone component demo and uses emoji labels.
- /projects/contemporary-ranch and /projects/mountain-modern are rich but unlinked.
- /services, /products, /process, /projects/new-builds, and especially /projects/commercial are comparatively thin.
- Login screens and operations data explicitly identify Demo Mode.
- Example domains and 555 telephone numbers appear inside the public Demo Admin records. They read as demo data, but are still exposed operational content.
- No lorem ipsum was found.
- No inconsistent company name was found among Kiefer Built Contracting, Kiefer Built, and Built by Kiefer; these appear to be intentional short/brand forms. The external footer label kbuiltco.com may nevertheless confuse users on builtbykiefer.com.

## Page Summaries

The table preserves exact H1 and major H2 language while summarizing long copy. Exact route-level metadata, links, counts, and screenshots are in the CSV.

| Route | Runtime title / H1 | Major sections and copy purpose |
|---|---|---|
| / | Built by Kiefer… / “Custom Homes Built With Precision in Northern Colorado” | “Built around trust, not shortcuts”; moving project work; custom elevators; “Built better, from the envelope in”; process; commercial; service area; quote form |
| /about | Generic site title / “Relentless Pursuit of Perfection” | Family builder; clear expectations; modern tools/traditional accountability; project CTA |
| /about/team | Generic / “The Kiefer Built Team” | Mark, Mindy, Miles, Marlys; small leadership team; owner proximity |
| /about/accolades | Generic / “Awards, Press, and Performance Recognition” | SIPA, Houzz, performance cards; project CTA |
| /blog | Generic / “Kiefer Built Journal” | Four static teasers: greener SIPs, smarter SIPs, efficiency/comfort, award-winning efficient home |
| /careers | Generic / “Build Your Future With Kiefer Built Contracting” | Career standards; Project Manager, Carpenter, Trade Partners; why work here; email/contact CTAs |
| /contact | Generic / no H1 | H2 “Tell Kiefer Built what you want to build”; phone/email/location; project, budget, timing, detail fields |
| /estimate | Generic / “Plan Your Project With A Contractor's Lens” | Project type; approximate size; finish level; calculated early range; quote disclaimer and CTA |
| /project-timelines | Generic / “Project Timelines” | Five selectable project types; phase cards; quick-comparison table; variables and “Our Guarantee” |
| /demo-slider | Generic / “Before/After Slider Demo” | Three draggable comparisons; “See The Difference”; public implementation and quick-start guide |
| /services | Generic / “Your One Stop Shop” | New builds; renovations; commercial; elevators; Why Kiefer Built |
| /services/home-building | Generic / “Custom Homes Built With Cutting-Edge Design and Technology” | How owners live; EPS/SIP systems; New Builds CTA |
| /services/custom-elevators | Specific elevator title / “Custom Residential Elevators” | Long-term access; designer-led remodels; opening/build/detail/finish coordination; focused gallery |
| /products | Generic / “Products and Finish Partners” | Builder-filtered cabinetry/materials; NorthPoint; Espresso, Pebble Grey, Polar White; vendor interest |
| /process | Generic / “A Design-Build Approach” | Consultation; proposal/planning; construction; portal communication; final walkthrough |
| /service-areas | Generic / “We Build Across Northern Colorado” | Windsor, Fort Collins, Loveland, Greeley, Johnstown, Wellington; counties; distance guide; services |
| /projects | Generic / “Project Gallery” | New Builds; Commercial; Renovations & Additions; Custom Elevator Renovation |
| /projects/new-builds | Generic / “New Builds” | Space Efficient Homes; Modern Homes; Barns and Garages |
| /projects/commercial | Generic / “Commercial Work” | “Business spaces need clear coordination”; tenant improvements, office buildouts, remodels |
| /projects/renovations-additions | Specific / “Renovations and Additions” | Exact categories Kitchens, Bathrooms, Living Spaces, Exteriors, Custom Elevators; five project carousels |
| /projects/contemporary-ranch | Generic / “Contemporary Ranch” | Build Phases; Project Specifications; Inside & Out; Ready to Build; 29-photo gallery |
| /projects/mountain-modern | Specific / “Mountain Modern” | From the Ground Up video; Build Phases; Project Specifications; The Finished Home; dream-home CTA |
| /flipbook | Generic / “Kiefer Built Project Lookbook” | Custom Homes; Efficient Builds; Commercial Spaces; Renovations; Finish Work; conversation CTA |
| /testimonials | Generic / “Establishing and Maintaining Good Relationships” | “Client trust is earned in the details”; five named review-summary cards; Houzz review CTA |
| /vendors | Generic / “Become a Vendor or Supplier” | “Tell Kiefer Built what your company provides”; company/contact/address/description form |
| /why-kiefer-built | Specific / “Why How You Build Matters” | Long-term framing; six topic cards; Sources & Citations; 2–5×, 40–50%, #2 proof |
| /why-kiefer-built/sips | Specific / “SIPs 101: The Shell Changes Everything” | Whole-wall framing; assembly comparison; project fit; comparison table; sources |
| /why-kiefer-built/energy-efficiency | Specific / “Energy Efficiency Measured, Not Promised” | Oak Ridge full-year study; national/Colorado evidence; airtightness and system load; sources |
| /why-kiefer-built/indoor-air-quality | Specific / “Indoor Air Quality Is a Building Decision” | Leaky homes; airtight + ventilated; recognized standards; sources |
| /why-kiefer-built/built-for-colorado | Specific / “Built for the Colorado That Actually Shows Up” | Hail; Marshall Fire; local snow/wind; comparison table; sources |
| /why-kiefer-built/quality | Specific / “Quality Is the Detail That Still Works Later” | Family standard; durability behind finishes; moisture/ventilation/material coordination; sources |
| /why-kiefer-built/cost-of-ownership | Specific / “Cheaper to Build Is Not Always Cheaper to Own” | Bid vs ownership; recurring energy; weather budget; visible tradeoffs; sources |
| /login | Generic marketing title / “Admin Access” | Demo Mode, allowed admin address, Enter Demo Console |
| /portal/login | Generic marketing title / “Client Access” | Password sign-in and email-link sign-in |
| /vendor/login | Generic marketing title / “Vendor Access” | Password sign-in and email-link sign-in |

### Admin and portal page families

| Family | Runtime H1 examples | Purpose and content |
|---|---|---|
| /admin | “Command Center” | Selected job, progress, contacts, time, action cards, agenda, finance summaries, recent activity |
| Admin top-level modules | Jobs; Lead + Client CRM; Proposals; Invoices; Schedule; Daily Logs; Tasks; Change Orders; Selections; Warranty & Punch List; Trade Partners; Clock-In / Clock-Out; Project Photos; Comments; RFIs; Purchase Orders; Bills; Reports; Kiefer Built Finance Tools | Dense operational list/table/card views with filters, actions, and demo records |
| Project details | Highland Ridge Custom Home; Poudre Canyon Mountain Modern; Timnath Commercial Buildout | Job summary, progress, budget, documents, client updates, field data, and record actions |
| Project child forms | “Bill for…”, “Change Order for…”, “Comment for…”, “Field Report for…”, “Upload for…”, “Financial Targets for…”, “Photo for…”, “Purchase Order for…”, “RFI for…”, “Selection for…”, “Task for…”, “Update for…”, “Assign Partner to…”, “Closeout item for…” | Repeated demo data-entry templates for each of the three jobs |
| Lead details | Danielle Porter; Chris Valdez; Harper Stone; Northline Dental; Elena Morris | Contact, budget, status, notes, follow-up, and proposal action |
| Proposal/change-order detail | Garage and Guest Suite Addition; Covered Patio Expansion | Scope, cost, status, and working PDF download |
| /portal | “Project Dashboard” | Named client, attention counts, $7,195 balance, one rendered project card |
| /portal/projects/project-1 | “Highland Ridge Custom Home” | Client-facing project detail; forms/controls present in demo |
| /portal/projects/project-2 and project-3 | “404” | Broken destinations |
| /vendor | “This page couldn’t load” | Server error boundary |

## Interactive Components

| Component | Routes | Browser result |
|---|---|---|
| Desktop dropdown menus | Standard marketing shell | Every internal destination clicked successfully |
| Mobile full-screen menu | Homepage at 390×844 | Full destination set rendered; /about/team click succeeded |
| Auto-moving project showcase | / | Rendered after animations/lazy load |
| Quote form | / and /contact | Fields and submit controls rendered; not submitted |
| Cost planner | /estimate | Project/size/finish interactions worked; result changed |
| Project timeline selector | /project-timelines | All five buttons changed the selected project content |
| Before/after sliders | /demo-slider | Drag interaction moved the divider; screenshot captured at approximately 78% |
| Renovation image carousels | /projects/renovations-additions | Ten previous/next controls rendered; Next Kitchens accepted interaction |
| Gallery/filter grid | /projects/contemporary-ranch | 29-photo categorized image mosaic rendered |
| HTML5 build video | /projects/mountain-modern | Played; currentTime advanced; direct asset HTTP 200 video/mp4 |
| Citation anchors | Seven education pages | Click changed hash and landed on matching source ID |
| Comparison tables | /project-timelines, /why-kiefer-built/sips, /why-kiefer-built/built-for-colorado | Rendered and captured |
| Vendor form | /vendors | Generates prepared email according to visible copy; not submitted |
| Client/vendor auth forms | /portal/login, /vendor/login | Password and email-link controls rendered; not submitted |
| Admin forms/actions | Most /admin routes | Rendered and captured; no mutation or sign-out action tested |
| PDF downloads | Four admin endpoints | All four generated browser downloads |
| Error Reload button | /vendor | Rendered; not repeatedly exercised |

No map iframe, video iframe, public accordion/details component, or public tab widget was found beyond the custom timeline selector. The service-area “map” is a styled territory panel, not an interactive geographic map.

## Trust Elements

- Real project photography is the dominant trust signal. The largest galleries are Contemporary Ranch (30 rendered images including logo), Renovations & Additions (28), and the homepage (25).
- The team page names and photographs four family leaders.
- Accolades presents three recognition cards.
- Testimonials presents five named customer summaries.
- Education pages include numbered in-page source links, local source lists, industry-testing tags where applicable, and a standing independent-versus-industry disclaimer.
- The SIPs and Colorado pages provide comparison tables.
- Mountain Modern adds build phases, specifications, an actual build video, and Kiefer/EPS partnership branding.
- EPS partnership branding is repeated in standard footers and on Mountain Modern.
- Phone, email, Windsor location, and a structured quote form reduce conversion ambiguity.
- Demo operations pages contain realistic records, but this is an exposure rather than an appropriate public trust signal.

No public warranty document, license number, insurance credential, privacy policy, terms page, accessibility statement, or explicit legal disclaimer route was found in runtime navigation.

## Visual Consistency

### Consistent system

- Fixed transparent/dark marketing header on standard pages.
- White uppercase navigation and wide letter spacing.
- Charcoal/near-black sections, warm cream backgrounds, red primary buttons.
- Large bold sans-serif headings and restrained red accent rules.
- Rounded white cards with thin neutral borders.
- High-resolution construction photography with dark hero overlays.
- Repeated “Ready to talk through a project?” closing banner.
- Repeated EPS partnership footer.

### Divergent systems

- Contemporary Ranch: cream/white/green visual language, no global header, custom gallery/footer.
- Mountain Modern: black/dark-green visual language, no global header, custom partnership/footer.
- Project Timelines: white generic application page with emojis and no marketing shell.
- Before/After Slider Demo: documentation/demo page with code blocks and no marketing shell.
- Login pages: centered dark authentication cards.
- Admin: dense black/cream Buildertrend-like operations UI.
- Portal: client-focused cream cards and red controls.
- Vendor error: framework error boundary.

### Reuse and repetition

The standard PublicPage-like template is visibly reused across About, simple service/work pages, and the full education series. This creates strong consistency but also produces repeated hero/intro/alternating section/CTA rhythms. Services and Products expose grid imbalance on desktop because the final card wraps alone. Education pages benefit from reuse most because the stable template makes dense cited material predictable.

## SEO Runtime Inspection

### Aggregate findings

- 35 pages were evaluated as marketing or login surfaces.
- 25 reuse the exact homepage title: “Built by Kiefer | Custom Home Builder in Windsor & Northern Colorado.”
- The same 25 reuse the exact homepage meta description.
- Only / and /projects/mountain-modern have self-referencing canonicals.
- The other 33 point canonical and OpenGraph URL signals to the homepage.
- Every one of the 35 renders meta robots “index, follow.”
- robots.txt allows all paths.
- sitemap.xml lists only the homepage.
- /contact is the only customer/login page with no H1.
- No duplicate H1 was found on the other public pages.
- Global JSON-LD types HomeBuilder, WebSite, and FAQPage render on every marketing and login page, including /login, /portal/login, /vendor/login, /demo-slider, and /project-timelines.
- /projects/mountain-modern additionally renders CreativeWork JSON-LD.
- Twitter summary-large-image metadata renders globally, but most routes inherit homepage copy/image.
- No X-Robots-Tag override was observed.

These are runtime signals only; the audit did not query a search engine to determine actual index status.

### Pages with route-specific title and description

- /projects/mountain-modern
- /projects/renovations-additions
- /services/custom-elevators
- /why-kiefer-built
- /why-kiefer-built/sips
- /why-kiefer-built/energy-efficiency
- /why-kiefer-built/indoor-air-quality
- /why-kiefer-built/built-for-colorado
- /why-kiefer-built/quality
- /why-kiefer-built/cost-of-ownership

Except for Mountain Modern, these still canonicalize to the homepage.

## Broken Links

| Source/relationship | Broken destination | Result |
|---|---|---|
| Demo portal project data | /portal/projects/project-2 | 404 |
| Demo portal project data | /portal/projects/project-3 | 404 |
| Admin vendor/project surfaces | /admin/vendor-submittals/vendor-submittal-1/download | 500 |
| Direct vendor workboard boundary | /vendor | 500 |

The crawler also observed aborted Google Analytics and Next.js RSC/prefetch requests while navigating rapidly. Those were navigation-abort artifacts and are not classified as site failures.

No desktop header destination failed. No public CTA destination failed. The public project video did not fail after focused retesting.

## Broken Assets

- Broken rendered images: none detected.
- Images with zero natural dimensions after full lazy-load scrolling: none detected.
- Mountain Modern MP4: healthy, HTTP 200, video/mp4, playback advanced.
- Public PDFs: none exposed.
- Four admin PDFs: healthy browser downloads.
- Vendor-submittal download: HTTP 500.
- External social, Houzz, EPS, kbuiltco.com, Nexgen Studio, mailto, and telephone targets were deliberately not crawled.

### Console and browser errors

- /vendor logged a failed document request with status 500 and a production Server Components render error. The visible error digest was 2176351566.
- /admin/vendor-submittals/vendor-submittal-1/download logged a failed document request with status 500.
- /portal/projects/project-2 and /portal/projects/project-3 each logged failed document requests with status 404.
- No other page produced a retained JavaScript page error after navigation-related Google Analytics and Next.js RSC aborts were filtered out.

## Runtime-only Findings

These findings depend on what production actually rendered and should not be inferred from route files alone:

1. Demo Admin is live and public. /login exposes an allowed demo-admin address and one-click access; /admin does not challenge authentication.
2. The Client Portal is live and public in demo mode. /portal exposes a named user, progress, counts, and a dollar balance.
3. The Vendor Workboard is deployed but fails at runtime with a server-component error boundary.
4. Two portal project IDs are advertised but not implemented.
5. Four operational PDFs generate correctly; a vendor-submittal download does not.
6. Six customer-facing routes deploy successfully but are absent from global navigation.
7. Two high-quality detailed project pages are not linked from /projects or any crawled content page.
8. The public development slider demo and code guide are deployed and indexable by visible signals.
9. The public timeline tool works but has a separate visual system and indexable homepage metadata.
10. The education citation anchors, tables, local numbering, and industry labels work in the browser.
11. The public site has no visible homeowner-guide PDF download despite the education content being present.
12. No runtime redirect occurred for /admin, /portal, or /vendor; they rendered directly.

## Comparison Notes for Repository Audit

Use these runtime facts when reconciling the source audit:

- Treat 120 rendered routes as the deployed surface, not as proof that every source route deploys.
- Direct-URL pages should be compared separately from navigable pages.
- The project gallery does not expose Contemporary Ranch or Mountain Modern even though both render.
- The source audit should explain why production Demo Mode bypasses admin/client auth and why /vendor fails.
- Compare any intended portal project list with the actual project-1-only detail implementation.
- Compare vendor-submittal link generation with the 500 download endpoint.
- Compare metadata generation with the observed 25 duplicate title/description pages and 33 homepage canonicals.
- Compare sitemap generation with the single-URL runtime XML.
- Compare intended public guide/PDF functionality with the absence of a runtime download.
- Confirm whether /demo-slider and /project-timelines belong in production or should be hidden/noindexed.
- Preserve the runtime education headings and cited proof as owner-approved candidate messaging for old-site comparison.
- Compare old-site testimonials and accolades to recover direct quotations, dates, source links, and award provenance.
- Compare old-site service-area language, contact details, custom-elevator positioning, and project names against the current generic pages.
- Use the CSV’s Navigation Source column to distinguish “exists in production” from “reachable by a visitor.”

## Recommendations

### P0 — production exposure and broken runtime

1. Disable Demo Admin and Demo Client Portal behavior in production, require the intended authentication boundary, and remove realistic demo operational/contact/financial records from anonymous access.
2. Fix /vendor or prevent navigation/access until the workboard can render safely.
3. Fix or remove the vendor-submittal download link returning 500.
4. Remove project-2/project-3 portal links or implement valid detail destinations.

### P1 — navigation and SEO

5. Link Contemporary Ranch and Mountain Modern from the project gallery and make their back links return to /projects.
6. Decide whether Estimate, Project Timelines, and Service Areas belong in navigation; label them intentionally if they do.
7. Remove /demo-slider from the public production surface or mark it non-indexable and development-only.
8. Generate route-specific titles, descriptions, canonicals, OpenGraph URLs, and relevant structured data.
9. Mark auth/admin/portal/vendor/development surfaces noindex where appropriate.
10. Add every intended public page to sitemap.xml and keep operational/auth routes out.
11. Add an H1 to /contact.
12. Add useful internal footer navigation for recovery and crawlability.

### P2 — content and conversion quality

13. Either publish real journal articles and link the cards or relabel the Blog as “Coming soon.”
14. Restore direct customer quotations/source links where approved; retain testimonial provenance.
15. Attach award dates/source links and owner evidence to accolades.
16. Add real commercial case proof and deepen thin service/category pages.
17. Rebalance five-card/four-card desktop grids on Services and Products.
18. Clarify that the vendor form opens email before submission.
19. Add legal/privacy guidance around quote and vendor data collection.
20. Review calculator rates, project durations, “Our Guarantee,” stats, and operational capability claims on a recurring owner-approved schedule.

## Mermaid Diagrams

### Complete website architecture

~~~mermaid
flowchart TD
  Home["/ — Home"]

  subgraph AboutArea["About"]
    About["/about"]
    Team["/about/team"]
    Acc["/about/accolades"]
    Blog["/blog"]
    Careers["/careers"]
  end

  subgraph Education["Why Kiefer Built"]
    Why["/why-kiefer-built"]
    SIP["/why-kiefer-built/sips"]
    Energy["/why-kiefer-built/energy-efficiency"]
    Air["/why-kiefer-built/indoor-air-quality"]
    CO["/why-kiefer-built/built-for-colorado"]
    Quality["/why-kiefer-built/quality"]
    Cost["/why-kiefer-built/cost-of-ownership"]
  end

  subgraph ServiceArea["Services"]
    Services["/services"]
    HomeBuild["/services/home-building"]
    Elevator["/services/custom-elevators"]
    Products["/products"]
    Process["/process"]
    Areas["/service-areas — direct only"]
    Vendors["/vendors"]
  end

  subgraph Work["Our Work"]
    Projects["/projects"]
    New["/projects/new-builds"]
    Commercial["/projects/commercial"]
    Renov["/projects/renovations-additions"]
    Ranch["/projects/contemporary-ranch — orphan"]
    Mountain["/projects/mountain-modern — orphan"]
    Flip["/flipbook"]
    Testimonials["/testimonials"]
  end

  subgraph Utility["Contact, planning, demo"]
    Contact["/contact"]
    Estimate["/estimate — direct only"]
    Timelines["/project-timelines — direct only"]
    Slider["/demo-slider — direct only"]
  end

  subgraph Access["Auth and portals"]
    AdminLogin["/login"]
    Admin["/admin + 79 child routes"]
    ClientLogin["/portal/login"]
    Portal["/portal"]
    P1["/portal/projects/project-1"]
    P2["/portal/projects/project-2 — 404"]
    P3["/portal/projects/project-3 — 404"]
    VendorLogin["/vendor/login"]
    Vendor["/vendor — 500"]
  end

  Home --> About
  About --> Team
  About --> Acc
  About --> Blog
  Home --> Careers
  Home --> Why
  Why --> SIP
  Why --> Energy
  Why --> Air
  Why --> CO
  Why --> Quality
  Why --> Cost
  Home --> Services
  Services --> HomeBuild
  Services --> Elevator
  Services --> Products
  Services --> Process
  Products --> Vendors
  Home --> Projects
  Projects --> New
  Projects --> Commercial
  Projects --> Renov
  Home --> Flip
  Home --> Testimonials
  Home --> Contact
  Estimate --> Contact
  Areas --> Contact
  Ranch --> Home
  Mountain --> Home
  AdminLogin -->|public demo entry| Admin
  Portal --> P1
  Portal -. broken .-> P2
  Portal -. broken .-> P3
  ClientLogin -. intended auth boundary .-> Portal
  VendorLogin -. intended auth boundary .-> Vendor

  classDef broken fill:#7f1d1d,color:#fff,stroke:#ef4444
  classDef orphan fill:#78350f,color:#fff,stroke:#f59e0b
  class P2,P3,Vendor broken
  class Ranch,Mountain,Areas,Estimate,Timelines,Slider orphan
~~~

### Header navigation flow

~~~mermaid
flowchart LR
  H["Fixed Header"]
  H --> A["About"]
  H --> W["Why Kiefer Built"]
  H --> S["Service"]
  H --> O["Our Work"]
  H --> C["Careers"]
  H --> X["Contact Us"]

  A --> A1["Story"]
  A --> A2["Team"]
  A --> A3["Accolades"]
  A --> A4["Blog"]

  W --> W1["Overview"]
  W --> W2["SIPs"]
  W --> W3["Energy"]
  W --> W4["Indoor Air"]
  W --> W5["Colorado"]
  W --> W6["Quality"]
  W --> W7["Cost"]

  S --> S1["Services"]
  S --> S2["Products"]
  S --> S3["Process"]
  S --> S4["Home Builds"]
  S --> S5["Elevators"]
  S --> S6["EPS external"]

  O --> O1["Gallery"]
  O --> O2["Flipbook"]
  O --> O3["New Builds"]
  O --> O4["Commercial"]
  O --> O5["Renovations"]
  O --> O6["Testimonials"]

  X --> X1["Contact"]
~~~

### Main visitor journey

~~~mermaid
flowchart LR
  V["Prospective homeowner"] --> H["Homepage"]
  H --> Choose{"Primary interest"}
  Choose --> S["Services"]
  Choose --> E["Education"]
  Choose --> P["Projects"]
  S --> Proof["Relevant scope and proof"]
  E --> Proof
  P --> Proof
  Proof --> CTA["Start a Project"]
  CTA --> Form["Homepage quote form"]
  Form --> Follow["Kiefer follow-up — not tested"]
~~~

### Content hierarchy

~~~mermaid
flowchart TD
  Brand["Kiefer Built core message"]
  Brand --> Trust["Family, accountability, communication"]
  Brand --> Craft["Craftsmanship and durable details"]
  Brand --> Performance["Envelope, energy, air quality"]
  Brand --> Colorado["Hail, wildfire, snow, wind"]
  Brand --> Scope["Homes, renovations, commercial, elevators"]
  Brand --> Proof["Photos, projects, awards, testimonials, citations"]
  Trust --> Conversion["Start a Project"]
  Craft --> Conversion
  Performance --> Conversion
  Colorado --> Conversion
  Scope --> Conversion
  Proof --> Conversion
~~~

### Conversion funnel

~~~mermaid
flowchart TD
  Awareness["Hero photography, nav, search landing"] --> Education["Service / education / project page"]
  Education --> Validation["Team, photos, citations, awards, testimonials"]
  Validation --> Intent{"Intent path"}
  Intent --> Quote["Start a Project -> #contact"]
  Intent --> Estimate["Planning calculator"]
  Intent --> Phone["Call / email"]
  Intent --> Vendor["Vendor mailto form"]
  Intent --> Career["Resume mailto"]
  Estimate --> Quote
  Quote --> Submit["Quote submission — deliberately not tested"]
~~~

## Screenshot Inventory

There are 345 screenshots in [screenshots/](./screenshots/), totaling approximately 117 MB. Every rendered route has a full-page capture and an above-the-fold capture; routes with visible forms or tables also have focused component captures. Navigation and interaction captures are additional.

Representative files:

- Marketing: [home](./screenshots/home--full.png), [about](./screenshots/about--full.png), [services](./screenshots/services--full.png), [projects](./screenshots/projects--full.png).
- Education: [hub](./screenshots/why--kiefer--built--full.png), [SIPs table page](./screenshots/why--kiefer--built--sips--full.png), [Colorado](./screenshots/why--kiefer--built--built--for--colorado--full.png).
- Projects: [renovations](./screenshots/projects--renovations--additions--full.png), [Contemporary Ranch](./screenshots/projects--contemporary--ranch--full.png), [Mountain Modern](./screenshots/projects--mountain--modern--full.png).
- Forms/tools: [contact](./screenshots/contact--full.png), [calculated estimate](./screenshots/estimate--calculated-range.png), [timeline interaction](./screenshots/project--timelines--interactive.png), [dragged comparison](./screenshots/demo--slider--interacted.png).
- Access/error: [admin login](./screenshots/login--full.png), [admin](./screenshots/admin--full.png), [portal](./screenshots/portal--full.png), [vendor 500](./screenshots/vendor--full.png).

The CSV maps each route to its specific screenshot filenames.

## Validation

- Every desktop header link was visited from the rendered menu: 25/25 passed.
- Every desktop dropdown was opened.
- Mobile navigation was opened at 390×844; its destination list was recorded; a mobile link was clicked successfully.
- Every footer link was recorded. External footer targets were not crawled by rule.
- Every recursively discovered internal page was visited.
- Direct-URL candidates were separately opened to identify deployed orphan/hidden routes.
- Every internal destination was de-duplicated before crawl; no crawl loop occurred.
- JavaScript, animations, and lazy-loaded sections were allowed to render; every page was scrolled fully.
- Public forms, login forms, and mutating admin controls were not submitted.
- Redirect chains were recorded; no page redirect occurred.
- 404 and 500 routes were retested in fresh browser navigation.
- Broken-image checks ran after full-page scrolling.
- Public video and download behavior received focused browser tests.
- Runtime titles, descriptions, canonicals, OpenGraph, Twitter, robots, H1s, and JSON-LD were recorded per page.
- robots.txt and sitemap.xml were opened directly.
- The report avoids asserting form delivery, external-link availability, backend persistence, authentication policy intent, or search-engine index status where runtime evidence cannot prove them.

## Limitations and Unverified Assumptions

- The audit is anonymous. It did not sign in, brute-force, or test a real authenticated role.
- Demo Admin and Client Portal visibility is described as observed behavior; whether it is intentional cannot be determined from runtime alone.
- Forms were not submitted, so API delivery, validation errors after submission, email delivery, CRM persistence, and success states remain unverified.
- External websites and mail/phone handlers were recorded but not opened.
- Browser automation used Chromium; Safari/Firefox differences were not tested.
- Mobile navigation was tested, but every page was not independently re-captured at mobile width.
- Visual assessments are based on rendered screenshots and interaction, not owner intent.
- Awards, testimonials, construction facts, pricing, timelines, and company practice claims were not independently fact-checked in this runtime audit.
- A 200 response does not by itself prove a page should be publicly indexed or belong in the customer sitemap.

This report reflects the runtime behavior of the production website rather than the repository source.
