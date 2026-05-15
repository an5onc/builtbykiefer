# Kiefer Built CRM Feature Inventory

This is the living inventory of features built into the Kiefer Built operations platform. Use it later as source material for the sales proposal, meeting deck, demo script, and pricing justification.

## Positioning Summary

Kiefer Built is not just getting a website or a basic CRM. The product is becoming a branded construction operations platform that replaces Buildertrend-style workflows with a Kiefer-owned experience for managers, field teams, and clients.

Core value points:

- Kiefer Built branding throughout the operations experience.
- Manager-facing command center for daily project control.
- Client-facing portal for polished owner updates.
- Supabase-backed data model with admin access control.
- Buildertrend-familiar navigation patterns to reduce employee training friction.
- Construction-specific workflows, not generic CRM screens.

## Feature Groups

### Admin Access And Security

**Admin login**
- Route: `/login`
- Supports approved Supabase admin sign-in.
- Password visibility toggle added for fewer mistyped password issues.
- Redirects protected admin routes to login when not authenticated.

**Admin-only operations area**
- Route family: `/admin`
- Protected command center and management workflows.
- Demo mode awareness so the app can fall back safely when data is unavailable.

Sales proposal angle:
- Kiefer controls the operations platform instead of sending employees into a third-party-branded product.

### Command Center

**Operations dashboard**
- Route: `/admin`
- Displays top-level operational metrics.
- Metric cards link into the relevant detail areas.
- Includes project snapshots, lead follow-ups, agenda-style work, and recent activity.

Sales proposal angle:
- Managers get an at-a-glance view of the business without hunting through disconnected screens.

### Buildertrend-Style Navigation

**Horizontal module navigation**
- Routes grouped under Sales, Jobs, Project Management, Files, Messaging, Financial, and Reports.
- Dropdown-style menus modeled after familiar Buildertrend patterns.
- Only one dropdown stays active at a time.
- Kiefer brand mark stays prominent without duplicate text clutter.

Sales proposal angle:
- Familiar structure lowers the switching cost from Buildertrend while keeping Kiefer branding in control.

### Sales CRM

**Lead management**
- Route: `/admin/leads`
- Tracks lead status, follow-up dates, project type, budget range, and notes.
- Lead detail pages support updating follow-up and status.

**Proposal workflow**
- Route: `/admin/proposals`
- Create proposals from leads.
- Proposal line items and optional items.
- Proposal download/PDF route.

Sales proposal angle:
- Keeps new business, follow-ups, and estimates in the same operating system as active jobs.

### Project Management

**Projects / job list**
- Route: `/admin/projects`
- Active project cards and project detail links.
- Project detail pages centralize files, invoices, updates, tasks, comments, selections, RFIs, purchasing, change orders, and field reports.

**Schedule**
- Route: `/admin/schedule`
- Combines task due dates, lead follow-ups, and project milestones into an agenda.
- Groups items by overdue, today, next seven days, and upcoming.

**Tasks**
- Route: `/admin/tasks`
- Per-project task creation.
- Assigned worker, priority, due date, notes, status.
- Status update form from the task list.

**Kiefer Built Field Reports / Daily Logs**
- Routes: `/admin/daily-logs`, `/admin/projects/[projectId]/daily-logs/new`
- Captures report date, superintendent, weather, crew count, work performed, deliveries, inspections, delays, safety notes, next steps, and visibility.
- Appears on project detail pages.
- Customer-visible reports appear in the client portal.

Sales proposal angle:
- This is a core daily operations feature. It makes the product feel like a construction platform managers use every day, not just a CRM.

### Client Communication

**Project updates**
- Per-project update creation.
- Internal/customer visibility.
- Customer-visible updates appear in the client portal.

**Comments**
- Route: `/admin/comments`
- Per-project internal or client-visible comments.
- Customer-visible comments appear in the client portal.

**RFIs**
- Routes: `/admin/rfis`, `/admin/projects/[projectId]/rfis/new`
- Tracks title, question, answer, requested by, due date, status, and visibility.
- Customer-visible RFIs appear in the client portal.

Sales proposal angle:
- Keeps project communication tied to the job record instead of scattered across text messages, email, and verbal updates.

### Scope And Change Control

**Change orders**
- Route: `/admin/change-orders`
- Per-project change order creation.
- Line items support partial row completion so managers do not need to fill every pricing row.
- Tracks schedule impact, client message, internal notes, status, and totals.
- Change order download/PDF route.
- Change order metrics and links from the command center.
- Sent change orders appear in the client portal for approval.
- Clients can approve change orders from the portal with their name captured as approval metadata.
- Admin change order views show client approval state.

Sales proposal angle:
- Helps Kiefer document scope changes, protect margin, and communicate cost/schedule impacts professionally.
- Turns scope changes into a professional client sign-off workflow instead of relying on scattered email or text approvals.

### Warranty And Punch List

**Closeout tracker**
- Routes: `/admin/warranty`, `/admin/projects/[projectId]/warranty/new`
- Tracks warranty and punch-list items by project.
- Fields include item type, title, description, location, requested by, due date, status, priority, visibility, and resolution date.
- Customer-visible items appear in the client portal and on the client dashboard counts.
- Admin project pages include a Warranty & Punch List section.

Sales proposal angle:
- Extends the platform beyond construction into closeout and post-project service, helping Kiefer look organized after handoff and keeping small follow-up items from getting lost.

### Selections

**Owner selections tracker**
- Routes: `/admin/selections`, `/admin/projects/[projectId]/selections/new`
- Tracks category, title, allowance amount, selected option, vendor, due date, status, internal notes, and client notes.
- Submitted, approved, and ordered selections appear in the client portal.
- Clients can approve submitted selections from the portal with their name captured as approval metadata.
- Admin selection views show who approved a selection and when approval happened.

Sales proposal angle:
- Gives managers a structured way to keep owner decisions from delaying the job.
- Creates a client-facing sign-off workflow that keeps Kiefer decisions documented in the platform instead of scattered across email or text.

### Files And Client Visibility

**Project files**
- Per-project file records.
- Tracks file type, visibility, storage bucket/path, upload date, and size label.
- Customer-visible files appear in the client portal.

**Project photo gallery**
- Routes: `/admin/photos`, `/admin/projects/[projectId]/photos/new`
- Tracks project photos by title, date, category, visibility, image URL, caption, and upload date.
- New project photos upload real image files to Supabase Storage instead of requiring managers to paste image URLs.
- The `project-photos` bucket is configured for public delivery so uploaded images can render in admin and portal galleries.
- Project detail pages show a visual gallery for each job.
- Customer-visible photos appear on the client dashboard counts and on project portal pages.
- Internal photos stay out of the client portal.

Sales proposal angle:
- Separates internal job documents from client-facing files without creating a second system.
- Gives Kiefer a branded visual job record that can support progress updates, closeout proof, and client confidence.

### Subcontractor And Vendor Portal

**Trade partner directory**
- Routes: `/admin/vendors`, `/admin/vendors/new`
- Tracks subcontractors and vendors by company type, trade/service, email, phone, status, portal access, notes, and assignment count.
- Project pages include a Trade Partners section so managers can see who is assigned to each job.

**Project vendor assignments**
- Route: `/admin/projects/[projectId]/vendors/new`
- Assigns vendors/subcontractors to a project with scope, start date, optional end date, status, and visibility.
- Supports internal assignments and customer-visible assignments.

**Vendor portal workboard**
- Route: `/vendor`
- Shows portal-enabled active vendors and their project assignments.
- Presents job, location, current phase, scope, schedule window, and assignment status.

Sales proposal angle:
- Moves subcontractor coordination into the Kiefer-owned system instead of relying only on email/text threads.
- Creates a future path for vendors to receive assignments, updates, documents, and payment context in one branded portal.

### Financial Operations

**Invoices**
- Route: `/admin/invoices`
- Invoice list and per-invoice download/PDF route.
- Draft/sent/paid statuses.
- Invoice totals roll into the command center.

**Purchase orders**
- Routes: `/admin/purchase-orders`, `/admin/projects/[projectId]/purchase-orders/new`
- Tracks vendor commitments before they become received materials or bills.
- Fields include generated PO number, title, vendor, amount, due date, status, and notes.

**Bills**
- Routes: `/admin/bills`, `/admin/projects/[projectId]/bills/new`
- Tracks vendor bills, due dates, amounts, notes, and paid status.

**Project financial targets**
- Route: `/admin/projects/[projectId]/financials/edit`
- Stores contract value, budgeted cost, target margin percentage, and contingency percentage by project.
- Project detail pages show contract value, budgeted cost, committed cost, projected margin, projected margin percentage, and margin status.

Sales proposal angle:
- Kiefer can start connecting field operations to job financials without forcing managers into accounting software for every jobsite decision.
- Gives managers a fast answer to whether each job is tracking toward expected margin.

### Labor And Time

**Time logs**
- Route: `/admin/time`
- Tracks worker, project, clock-in/out, and notes.
- Weekly hours roll into the command center.

Sales proposal angle:
- Supports better labor awareness and future job-cost reporting.

### Reporting Dashboards

**Manager reporting dashboard**
- Route: `/admin/reports`
- Rolls up active jobs, needs-attention counts, pending change order dollars, unpaid bills, open purchase orders, open RFIs, pending selections, open warranty items, client-visible photos, and portal-enabled trade partners.
- Rolls up contract value, budgeted cost, committed cost, actual cost, projected revenue, projected cost, projected margin, and average projected margin percentage.
- Includes a job cost snapshot by project with pending change orders, open purchase orders, unpaid bills, progress, and status.
- Includes a margin forecast table showing target margin, projected margin, and at-risk status by project.
- Includes an exception report for overdue bills, warranty/punch-list items, selections, RFIs, tasks, and sent change orders.
- Includes workflow counts by job for tasks, RFIs, selections, warranty, photos, and trade partners.
- Includes vendor commitment reporting for portal-enabled subcontractors/vendors.

Sales proposal angle:
- Turns the CRM from a set of job screens into a management intelligence layer.
- Gives Kiefer managers a way to spot overdue work, cost exposure, and vendor commitments quickly before they become client or margin problems.
- Helps Kiefer answer whether a job is still on track to make money.

### Accounting Toolkit Ideas

Source reviewed: [BAFN 302 Toolkit](https://bafn302unco.com/)

**Kiefer Built finance tools**
- Route: `/admin/finance-tools`
- Includes Draw & Retainage Planner for contract value, percent complete, retainage held, paid-to-date, current draw due, remaining contract value, and remaining cash to collect.
- Includes NPV / IRR Decision Check for equipment, truck, or major tool purchases using initial investment, hurdle rate, expected annual cash benefits, net present value, internal rate of return, payback period, and pass/review signal.
- Includes Change Order Margin Impact Checker for proposed client price, labor/material/sub/vendor/other costs, target margin, schedule days, recommended billing amount, margin gap, gross margin, markup, and approval readiness.
- Includes Kiefer Built Payment Planner for equipment, truck, or short-term financing checks.
- Includes Kiefer Built Rate Check for monthly periodic rate and effective annual rate review.
- Uses construction/accounting examples instead of generic classroom calculator language.
- Frames outputs as Kiefer Built planning checks while keeping the formulas standard and credible.

Useful finance tools from that toolkit concept that could fit this CRM:

- Loan/payment calculator for equipment, vehicle, or short-term project financing decisions. Built first.
- Rate conversion helper for APR, monthly rate, and effective annual rate checks. Built first.
- Cash-flow calculator for retainage, draw schedules, delayed payments, or owner financing scenarios. Draw and retainage planner built first.
- NPV/IRR decision helper for major equipment purchases or investment-like project choices. Built first.
- Change order impact checker for margin and schedule decisions before client approval. Built first.

Best fit for Kiefer:
- Keep `/admin/finance-tools` separate from job records so accountants can run quick calculations without affecting live project data.
- Next practical calculator should be the job cost variance tool because it compares budget, committed cost, actual cost, and projected cost by job.

### Client Portal

**Client portal dashboard**
- Route: `/portal`
- Branded Kiefer Built owner dashboard.
- Shows active project cards, progress, current phase, latest client-visible field report, open selections, open RFIs, open change orders, invoice balance, and shared file count.
- Links each project into its full project portal.
- Uses client-safe projection logic so internal-only files, RFIs, field reports, and notes do not leak into the owner experience.

Sales proposal angle:
- Gives Kiefer a polished client-facing home base, not just one-off project pages. This supports the pitch that Kiefer owns the entire customer experience from sales through closeout.

**Project client portal**
- Route: `/portal/projects/[projectId]`
- Branded Kiefer Built client view.
- Shows current phase, progress, client-visible updates, comments, field reports, approved selections, shared RFIs, timeline, shared files, invoices, and change orders.
- Hides internal notes, internal files, internal RFIs, and internal field reports.

Sales proposal angle:
- Clients get a polished Kiefer-owned experience instead of a third-party portal. This is a major differentiation point.

### Floating Action Cleanup

**Route-aware floating actions**
- Public marketing pages show the quote CTA after scroll.
- Client portal pages show project updates only.
- Admin and login pages show no floating public-site widgets.

Sales proposal angle:
- Removes unprofessional UI overlap and keeps each route focused on its audience.

## Supabase / Data Infrastructure

Migrations added for:

- Project tasks.
- Project comments.
- Selections.
- Selection client approvals.
- RFIs.
- Purchase orders.
- Bills.
- Daily logs / field reports.
- Change order client approvals.
- Warranty and punch-list items.
- Project photos.
- Vendors and project vendor assignments.
- Project photo storage bucket public-delivery configuration.
- Project financial targets.
- Finance tools.

Data model principles:

- Admin-managed tables use row level security.
- Authenticated admin grants are explicit.
- Client portal views filter visibility before rendering client-facing data.
- Demo data exists for sales/demo walkthroughs.

## Demo Script Notes

Recommended demo order for Kiefer Built:

1. Start on the public site to show the brand.
2. Open `/admin` and show the Command Center.
3. Open a project detail page and show the project as the operating hub.
4. Create or show a Field Report.
5. Show selections and RFIs as owner-decision controls.
6. Show change orders and purchasing as margin-protection workflows.
7. Show warranty and punch-list tracking for closeout control.
8. Show project photos as the visual job record.
9. Show the trade partner directory and `/vendor` workboard.
10. Open `/admin/reports` to show job cost exposure, margin forecasting, needs-attention items, and vendor commitments.
11. Open `/admin/finance-tools` to show Kiefer Built finance utilities.
12. Open `/portal` to show the client dashboard.
13. Open a project portal and show client approvals plus client-visible closeout items.
14. Close by explaining that Kiefer owns the experience and branding.

## Open Proposal Talking Points

- Reduce Buildertrend dependency.
- Lower employee transition friction by keeping familiar module groupings.
- Improve client experience with a branded portal.
- Centralize daily logs, selections, RFIs, files, photos, invoices, purchasing, trade partners, reports, change orders, warranty, and punch-list items.
- Add accounting-facing calculators inspired by the finance toolkit as practical daily-use helpers.
- Build toward deeper customization because Kiefer controls the product roadmap.

## Next Features To Track

- Vendor-facing document/RFI exchange after vendor authentication exists.
- Finance tools: job cost variance tool.
