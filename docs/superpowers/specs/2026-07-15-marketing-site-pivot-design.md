# Built by Kiefer — Marketing Site Pivot

**Date:** 2026-07-15
**Status:** Approved (design), pending spec review

## Context

The project has changed direction. The owner no longer wants a CRM or any backend —
just a marketing/brochure website that educates the public on why to choose Kiefer
Built: better build quality, better energy efficiency (SIPs construction), and family
craftsmanship. The existing repo carries a full admin CRM, client portal, vendor
portal, Supabase auth, and land-leads tooling. That work is **kept dormant**, not
deleted: it stays in the repo and git history but is made unreachable from the public
site.

## Goals

1. Present a clear "why choose us" education story as a dedicated multi-page series.
2. Make the backend/CRM invisible and unreachable to public visitors (no deletion).
3. Keep a working contact path with **no database** — email only.
4. Reuse the existing visual identity and components (evolve, don't redesign).

## Non-Goals

- Deleting admin/portal/vendor/auth/land-leads code or uninstalling Supabase.
- Redesigning the brand or building new component systems from scratch.
- Any authenticated or database-backed public feature.

## Architecture

Next.js App Router static-marketing site, unchanged framework. Backend routes remain
on disk but are unlinked from all public navigation, footers, and in-page links, so a
visitor has no path to reach them. No routes deleted; no Supabase dependency removed.

## Education Series (Approach A: hub + child pages)

New parent route `/why-kiefer-built` serving as an overview that links to four deep
child pages:

| Route | Purpose | Key content |
|-------|---------|-------------|
| `/why-kiefer-built` | Overview / front door | Summary of the four pillars, links into each |
| `/why-kiefer-built/sips` | SIPs 101 | What SIPs are, SIPs vs stick-frame, 2025 SIPA Building Excellence Award as proof |
| `/why-kiefer-built/energy-efficiency` | Efficiency & comfort | Utility savings, air-tightness/comfort, Colorado climate performance |
| `/why-kiefer-built/quality` | Craftsmanship | Materials, detail-first construction, family accountability |
| `/why-kiefer-built/cost-of-ownership` | Value over time | Build cost vs lifetime cost, durability, resale |

**Content location.** All page copy lives in `src/lib/public-site/` data files following
the existing `content.ts` pattern (structured objects, not JSX), so copy edits never
touch component code. Each child page is a thin page component that reads its data
object and composes existing presentational components.

**Component reuse.** Pages compose existing components where they fit:
`MaterialsShowcase`, `ExplodedHero`, `BeforeAfterSlider`, `WeatherImpactTracker`,
plus standard section/CTA primitives. No new component systems.

**Teasers.** Homepage, `/services`, and project pages gain small teaser sections that
link into the hub, so the education story is discoverable from the main funnel.

## Navigation

- **Header:** Add a "Why Kiefer Built" dropdown listing the five pages. Remove
  "Client Portal" and "Vendors" entries from the public nav.
- **Footer:** Keep only public and social links (EPS, Facebook, Instagram, kbuiltco,
  agency credit). Add "Why Kiefer Built" links. Remove any CRM/portal/login references.

## Contact (no database)

The existing `POST /api/quote-request` route uses Resend for email **but currently
hard-fails with a 502 when the Supabase `createLead` write fails** — a database
dependency incompatible with a no-backend site.

**Change:** Decouple email from the CRM. The route sends the inquiry email via Resend
to `info@kbuiltco.com` (env: `RESEND_API_KEY`, `CONTACT_EMAIL_FROM`, `CONTACT_EMAIL_TO`)
and does **not** require a successful CRM write to return success. The `createLead`
call is either removed from the public path or made best-effort (failure logged, never
surfaced to the visitor, never blocks the email). Both the contact form and the
estimate form submit through this email-only path. Honeypot (`company` field) behavior
is preserved.

## Cleanup Audit

Sweep every public page and shared component (`Header`, `Footer`, `GlobalFloatingAction`,
`FloatingCTA`, homepage, services, projects, about, careers, contact, estimate) for:

- Links to `/admin`, `/portal`, `/vendor`, `/login`, `/auth`, land-leads
- Copy referencing CRM features, "client login", "vendor login", or portal access
- Any component that renders a database-backed value on a public page

Anything found is unlinked or removed from the public surface (backend code stays).

## Testing / Verification

- Manual pass through the public site confirming no reachable link leads to
  admin/portal/vendor/auth.
- Submit the contact and estimate forms with Resend configured and with the CRM write
  forced to fail — confirm the email still sends and the visitor sees success.
- Each new education page renders with real copy (no placeholders), correct metadata,
  and working internal links to/from the hub.
- `next build` succeeds.

## Risks

- The dormant backend still imports Supabase; leaving env vars unset must not break the
  public build. Verify `next build` passes with backend routes present but unreferenced.
- Decoupling `createLead` must not silently drop the honeypot/spam protection.
