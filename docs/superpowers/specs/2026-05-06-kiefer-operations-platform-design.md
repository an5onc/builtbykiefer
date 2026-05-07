# Kiefer Operations Platform Design

## Summary

Build a Phase 1 admin-only operations platform for Kiefer Built Contracting. The goal is a polished, secure, sales-ready demo that proves the business can move beyond Buildertrend over time without pretending Phase 1 is already a full Buildertrend replacement.

The platform will use demo/sample data only. It will be branded specifically for Kiefer Built and presented as a premium construction operations console, not a generic CRM template.

## Current Project Context

The existing repository is a Next.js 16 App Router project for `builtbykiefer.com`. It is currently configured as a static export in `next.config.ts`, uses Tailwind CSS 4, Framer Motion, project photography, and a Buildertrend embedded contact iframe.

The existing public site is valuable as the marketing front door, but the requested CRM, secure document storage, time tracking, and invoice generation require a real authenticated application with backend services. The platform should be built as a separate authenticated app surface, likely under `app.builtbykiefer.com`, while the public website remains the polished marketing site.

## Product Positioning

Phase 1 should demonstrate a responsible foundation:

- Real admin authentication for the developer/admin account.
- Real database-backed records.
- Real secure file storage patterns.
- Real branded downloadable PDF invoices.
- Demo data that makes the product feel tailored to Kiefer.

Phase 1 should not promise full Buildertrend parity. It should prove the architecture, brand direction, and core operational workflows that can become a larger replacement platform.

## Users And Access

Phase 1 has one active user type:

- Admin: the developer/admin account only.

Future roles may be represented in the data model for planning, but they are not active product surfaces in Phase 1:

- Customer
- Employee
- Subcontractor

The application should not use a shared admin key as the login mechanism. It should use real authentication from the start so the security model can grow without being rewritten.

## Phase 1 Modules

### Admin Login

The app will provide a branded login experience for the approved admin account. Access to the operations console requires authentication.

### Command Dashboard

The dashboard will show high-level demo metrics and recent activity:

- Active demo projects
- Recent document/photo uploads
- Weekly labor hours
- Draft invoice totals
- Lead follow-up reminders

### Leads And Client CRM

The CRM module will manage demo contacts and prospective projects:

- Lead name
- Contact details
- Project type
- Budget range
- Status
- Next follow-up date
- Notes

This is intentionally light in Phase 1. It should support a sales walkthrough without attempting to become a full sales automation system.

### Project Dashboard

The project module will show demo construction projects with:

- Project name
- Client name
- Location
- Project type
- Current phase
- Progress percentage
- Estimated start and completion dates
- Budget range
- Internal notes

Each project should have a detail page with timeline, files, photos, time logs, and invoice previews.

### Photos And Secure Documents

The platform will include project-scoped uploads for demo files:

- Progress photos
- Customer-visible documents
- Internal-only documents
- Invoice PDFs

Phase 1 uses demo/sample content. Storage structure and permissions should be designed so customer access can be added later without reorganizing files.

### Clock-In And Clock-Out

Phase 1 includes time tracking with demo workers:

- Worker records
- Active shift state
- Clock-in and clock-out events
- Manual corrections
- Weekly totals
- Project association

Employee login is out of scope. Admin can view and manage demo time logs.

### Branded PDF Invoices

Invoice generation must produce real downloadable PDF invoices with Kiefer Built branding.

Phase 1 invoice scope:

- Demo customer and project details
- Kiefer logo/branding
- Line items
- Labor entries
- Materials/allowances
- Subtotal
- Total
- Notes field with demo payment instructions text
- Downloadable PDF file

Out of scope for Phase 1:

- Payment collection
- Accounting software sync
- Tax compliance automation
- Recurring invoices
- E-signatures

## Visual Direction

The admin app should feel like a premium construction operations console:

- Dark charcoal or steel navigation
- Warm jobsite neutrals
- Restrained Kiefer red accents
- Clear operational typography
- Dense but readable dashboards
- Real project photography where it helps context
- The Kiefer mark used in the app chrome, login, and invoices

The supplied promotional ad graphics should be treated as brand reference and marketing material, not dashboard backgrounds. The video belongs on the public website rather than inside the admin console.

## Brand Assets

Use these asset categories:

- Transparent Kiefer logo for the app mark and invoice header.
- Full Kiefer logo for login, empty states, and branded invoice headers when space allows.
- Existing project photography for demo project cards and progress photos.
- Promotional ad graphics only as reference or optional marketing content.
- Existing Kiefer video on the public website, not in the CRM.

## Architecture

### Hosting And Services

Recommended Phase 1 stack:

- Next.js for the web application.
- Railway for app hosting.
- Supabase for authentication, Postgres database, and secure file storage.
- Cloudflare for DNS, domain security, CDN, and WAF.

This keeps the implementation professional without forcing the product into enterprise infrastructure before Kiefer commits to the long-term replacement.

### Application Surfaces

The app should be separated conceptually into:

- Public website: marketing, portfolio, SEO, lead capture.
- Admin operations console: authenticated CRM/platform demo.

The authenticated app can live in the same repository if that is fastest and cleanest for Phase 1, but the architecture should keep public marketing components and admin platform components clearly separated.

### Data Model

The initial database should support:

- Profiles/users
- Leads
- Clients
- Projects
- Project phases
- Project updates
- Files/documents
- Photos
- Workers
- Time entries
- Invoices
- Invoice line items

Include timestamps and ownership/project references on core records. Include future-oriented role fields carefully, but do not expose multi-role routes in Phase 1.

### File Storage

Files should be organized by project and purpose:

- Project photos
- Project documents
- Generated invoices

Records in Postgres should store metadata and references to storage objects rather than treating object paths as the source of truth.

### PDF Generation

PDF invoices should be generated server-side from invoice records and Kiefer branding. The implementation should prioritize predictable layout, readable typography, and repeatable output over visual complexity.

Generated PDFs may be downloaded directly and may also be stored in the project invoice/document area.

## Security

Phase 1 should establish the security foundation even though only one admin account is active:

- Real auth required for the admin console.
- Environment variables for all service secrets.
- No hardcoded API keys or service role keys in client code.
- Server-only access for privileged Supabase operations.
- Storage buckets structured for future customer and employee access.
- Database schema compatible with row-level security when multi-role access is added.

The demo should not contain real private Kiefer documents unless Kiefer explicitly provides them later.

## Demo Data

The platform should seed polished sample data:

- Multiple realistic leads.
- Multiple realistic clients.
- Three active demo projects.
- Project phases and progress.
- Progress photos using approved public/demo assets.
- Sample internal documents.
- Demo workers.
- Time logs.
- Invoice records and downloadable PDFs.

Names, numbers, addresses, and documents should be obviously demo/sample data while still feeling credible.

## Out Of Scope For Phase 1

Phase 1 does not include:

- Customer accounts.
- Employee accounts.
- Subcontractor accounts.
- Customer portal access.
- Real private Kiefer document migration.
- Full Buildertrend parity.
- Native mobile applications.
- Payment processing.
- Accounting integration.
- Advanced scheduling.
- Permits/inspection workflows.
- Automated notifications.
- AI features.

These are future phases after the demo foundation is validated and Kiefer approves continued development.

## Proposal And Retainer Notes

This software build should be separate from the existing $1,050/month Chief Marketing Officer retainer.

Recommended positioning:

- Existing CMO retainer remains for marketing, website content, SEO, social/media, and brand work.
- Software development retainer is a separate line item for platform planning, implementation, testing, deployment, documentation, and monthly demo reviews.
- The family/profile discount should be explicit. Kiefer is receiving below-market custom software work because the builder is family/company-connected and the project helps build the developer's software engineering portfolio.

Suggested framing:

- Family/profile software retainer: about $2,000/month.
- Target pace: about 40-60 software hours/month.
- Market equivalent: approximately $6,000-$12,000+/month depending on agency/team rate and scope.

Do not promise unlimited hours. Use a priority retainer with clear monthly deliverables.

## Success Criteria

Phase 1 is successful when:

- The admin can log in securely.
- The app looks and feels specifically built for Kiefer.
- Demo leads, clients, projects, files, time logs, and invoices are database-backed.
- Project files and photos are organized through secure storage patterns.
- A real Kiefer-branded invoice PDF can be generated and downloaded.
- The demo can be presented as a credible foundation for a larger Buildertrend replacement.
- The implementation is documented well enough to continue into Phase 2.

## Open Implementation Decisions

The following decisions belong in the implementation plan, not this design spec:

- Whether the authenticated app lives in this repository or a separate app repository.
- Exact Supabase table names and migration format.
- Exact PDF generation library.
- Exact Railway deployment workflow.
- Exact demo data seed content.

These should be decided after implementation planning begins.
