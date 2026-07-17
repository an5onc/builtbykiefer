# Tasks

## Objective
Deliver a production-ready public marketing website.

## Assumptions
- The finished application contains only public marketing pages and the email-only quote-request endpoint.
- CRM, admin, portals, authentication, accounts, Supabase business logic, operations features, demo pages, and demo data are out of scope.
- Existing public content, project media, education citations, the Homeowner Guide, analytics, and quote-email behavior must be preserved.
- Production deployment and post-deployment smoke testing are part of project completion.
- No hosted database changes or fake external form submissions are required.

## Risk Check
- Functional risk: High; the cleanup removes large, interconnected feature groups.
- Regression risk: Medium; public navigation, forms, galleries, downloads, metadata, and media must remain intact.
- Security risk: Positive overall; removing authentication, portals, demo access, and dormant business systems reduces exposed surface area.
- Performance risk: Positive overall; unused JavaScript, dependencies, routes, and media are removed.
- UX risk: Medium; every retained desktop and mobile journey must be checked after cleanup.
- Maintainability risk: Positive overall; one public route manifest and a smaller marketing-only codebase become the source of truth.

## Plan
- [x] Remove CRM.
- [x] Remove admin functionality.
- [x] Remove client and vendor portals.
- [x] Remove authentication and user accounts.
- [x] Remove demo pages, demo data, and developer-only surfaces.
- [x] Remove all residual infrastructure from the deleted systems: npm packages and lockfile entries, environment variables, middleware/proxy code, scripts, GitHub Actions/workflows, and framework, build, deployment, and hosting configuration.
- [x] Keep only public marketing pages and the email-only quote-request endpoint.
- [x] Verify every retained page, link, form, gallery, download, and media asset works.
- [x] Verify titles, descriptions, canonicals, structured data, sitemap, robots rules, and social metadata.
- [x] Verify responsive behavior, accessibility, and production performance.
- [x] Deploy the verified application and complete production smoke testing.

## Verification Plan
- [x] Run lint, typecheck, tests, and the production build.
- [x] Confirm the repository contains only functionality that directly supports the approved public marketing website. Any remaining code, dependency, route, asset, or configuration must have a documented purpose or be removed.
- [x] Confirm build output exactly matches the approved public route manifest plus the quote-request endpoint.
- [x] Confirm no CRM, admin, portal, authentication, Supabase, operations, or demo code remains reachable.
- [x] Confirm there are no broken imports, dead source files, unresolved internal links, or missing public assets.
- [x] Confirm every retained dependency and npm script is used, a clean install succeeds, and no package or lockfile entry exists solely for a removed system.
- [x] Confirm environment-variable inventories, middleware, repository scripts, GitHub workflows, and local/hosted build settings contain no removed-system references, commands, paths, or secrets.
- [x] Verify all retained routes at desktop and mobile widths with no console errors.
- [x] Verify SEO metadata, sitemap, robots rules, structured data, analytics, accessibility, and performance.
- [x] Verify the production deployment without submitting fake external forms.

## Review

### Summary of Changes
- Removed the CRM, admin, client/vendor portals, authentication, Supabase/database code, operations features, demo routes, legacy tooling, dead assets, and every supporting dependency/configuration item from the deployable application.
- Retained and hardened 29 public marketing pages, one email-only quote-request endpoint, the source-backed education series, project media, sitemap/robots metadata, and the Homeowner Guide.
- Corrected accessibility, SEO, content links, PDF contact information, dependency security, and production asset weight before deployment.
- Deployed the verified site to `https://www.builtbykiefer.com` through Vercel deployment `dpl_6TLg5qzDM14yv7x2HebaCn47UcMv`.

### Files Changed
- `src/app`, `src/components`, `src/lib` - marketing-only route/component/data surface and quote-email flow.
- `public` - retained active media, optimized project video, and corrected/optimized Homeowner Guide.
- `package.json`, `package-lock.json`, `.env.example`, `.gitignore`, `.vercelignore` - minimal dependencies and deployment/environment configuration.
- `README.md`, `AGENTS.md`, `docs`, `.sessions` - production scope, deployment guidance, completion evidence, and handoff records.
- Removed the former operations, Supabase, design-sync, demo, legacy asset, and internal collateral trees.

### Verification Completed
- `npm ci`, `npm ls --depth=0`, `npm prune --dry-run`, and `npm audit --audit-level=moderate` passed; audit reports zero vulnerabilities.
- `npm run lint`, `npm run typecheck`, `npm test` (8 files, 24 tests), and `npm run build` passed.
- Build output contains exactly 29 public pages, `/api/quote-request`, `/sitemap.xml`, and the framework not-found route.
- Local, Vercel preview, and canonical production browser QA covered all routes at desktop/mobile widths, 8 interactions, 30 internal destinations, media/API/SEO endpoints, and 9 retired routes with zero final issues.
- Lighthouse samples scored 97-98 performance and 100 accessibility, best practices, and SEO.
- Vercel production is `READY`; aliases, apex redirect, guide/video responses, and runtime-error telemetry passed.

### Risks Remaining
- The Vercel project has no environment variables. Quote requests intentionally fall back to a prepared email until `RESEND_API_KEY` and a verified `CONTACT_EMAIL_FROM` are configured.
- The deployed state is a dirty working-tree deployment based on commit `a4305b4`; it has not been committed or pushed because that authority was not provided. A later Git-triggered deployment from the current remote `main` could restore the old application.

### Follow-up Recommendations
- Authorize and perform a reviewed commit/push of this exact verified state before the next Git-triggered deployment.
- Configure and verify the three documented contact-email variables if automatic form delivery is required.
