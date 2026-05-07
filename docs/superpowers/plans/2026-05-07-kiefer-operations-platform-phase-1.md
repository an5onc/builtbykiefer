# Kiefer Operations Platform Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the admin-only Kiefer operations demo platform with real auth-ready architecture, demo CRM/project/time data, secure-file-ready metadata, and branded downloadable PDF invoices.

**Architecture:** Keep the public marketing site in the existing Next.js app, add a separate authenticated admin surface under `/admin`, and move the project from static export to server-capable Next.js. Phase 1 uses demo seed data committed in code while defining Supabase-ready types, server boundaries, and storage metadata so real Supabase integration can be switched on cleanly once credentials are available.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS 4, TypeScript, Supabase Auth/Postgres/Storage planned, Railway hosting planned, Cloudflare DNS/security planned, `@react-pdf/renderer` for server-side invoice PDFs, `lucide-react` for admin icons.

---

## Scope Check

This plan implements Phase 1 as a sales-ready admin demo, not the full Buildertrend replacement. Customer login, employee login, subcontractor login, payment processing, accounting sync, advanced scheduling, automated notifications, and AI features remain later-phase work.

## File Structure

Create:

- `src/app/admin/layout.tsx`: Admin route layout and metadata boundary.
- `src/app/admin/page.tsx`: Command dashboard.
- `src/app/admin/leads/page.tsx`: Leads/CRM list.
- `src/app/admin/projects/page.tsx`: Project list.
- `src/app/admin/projects/[projectId]/page.tsx`: Project detail with timeline, files, time logs, and invoices.
- `src/app/admin/time/page.tsx`: Clock-in/out and time log demo.
- `src/app/admin/invoices/page.tsx`: Invoice list and PDF download links.
- `src/app/admin/invoices/[invoiceId]/download/route.ts`: Server PDF download route.
- `src/app/login/page.tsx`: Branded login screen and future Supabase entry point.
- `src/components/admin/AdminShell.tsx`: Shared admin navigation shell.
- `src/components/admin/MetricCard.tsx`: Reusable dashboard metric card.
- `src/components/admin/StatusBadge.tsx`: Shared status badge.
- `src/components/admin/ProjectProgress.tsx`: Shared project progress UI.
- `src/components/admin/InvoiceDownloadButton.tsx`: Download link/button.
- `src/lib/admin/demo-data.ts`: Demo leads, clients, projects, files, workers, time entries, invoices.
- `src/lib/admin/types.ts`: Domain types.
- `src/lib/admin/formatters.ts`: Currency, date, hours, and status formatting.
- `src/lib/admin/queries.ts`: Demo data selectors that later become Supabase-backed queries.
- `src/lib/admin/invoice-pdf.tsx`: Branded PDF document component.
- `src/lib/admin/auth.ts`: Admin auth boundary and future Supabase auth hook points.
- `src/lib/supabase/server.ts`: Server Supabase client factory, initially guarded by env vars.
- `src/lib/supabase/client.ts`: Browser Supabase client factory, initially guarded by env vars.
- `src/lib/supabase/env.ts`: Typed Supabase environment parsing.
- `src/middleware.ts`: Admin route protection guard, initially demo-mode permissive with a clear toggle.
- `supabase/migrations/0001_phase_1_schema.sql`: Supabase schema for future real database.
- `supabase/seed.sql`: Demo seed rows matching the app data model.
- `.env.example`: Required local environment variables.

Modify:

- `package.json`: Add scripts and dependencies.
- `package-lock.json`: Updated by `npm install`.
- `next.config.ts`: Remove static export and image unoptimization requirements needed only for static export.
- `src/components/Header.tsx`: Add a restrained admin link only if needed for local/demo navigation.
- `README.md`: Add Phase 1 local setup notes.

Test:

- `npm run build`: production compile.
- `npm run lint`: after fixing the existing `eslint-config-next` mismatch.
- Manual browser check: public homepage, `/login`, `/admin`, `/admin/projects/[projectId]`, and invoice PDF download.

---

### Task 1: Convert Next From Static Export To Server-Capable App

**Files:**
- Modify: `next.config.ts`
- Modify: `README.md`

- [ ] **Step 1: Update Next config**

Replace `next.config.ts` with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

- [ ] **Step 2: Document why static export was removed**

Add this section to `README.md` below the Tech Stack:

```md
## Phase 1 Operations Platform

The public website remains the marketing front door. The operations platform adds authenticated server-side functionality under `/admin`, so this project no longer uses `output: "export"`.

Server-side functionality is required for:

- Admin authentication
- Secure file/document workflows
- Supabase access
- Branded invoice PDF generation
- Railway deployment
```

- [ ] **Step 3: Run build to verify public site still compiles**

Run:

```bash
npm run build
```

Expected: PASS. Routes should include the existing public routes. The app should no longer be described as a static export.

- [ ] **Step 4: Commit**

```bash
git add next.config.ts README.md
git commit -m "chore: enable server-rendered operations app"
```

---

### Task 2: Add Runtime Dependencies And Environment Template

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `.env.example`

- [ ] **Step 1: Install dependencies**

Run:

```bash
npm install @supabase/ssr @supabase/supabase-js @react-pdf/renderer zod clsx
```

Expected: `package.json` and `package-lock.json` update successfully.

- [ ] **Step 2: Add environment template**

Create `.env.example`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Admin demo/auth behavior
NEXT_PUBLIC_DEMO_MODE=true
ADMIN_EMAIL=

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- [ ] **Step 3: Add a typecheck script**

In `package.json`, update `scripts` to include:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "typecheck": "tsc --noEmit"
}
```

- [ ] **Step 4: Run typecheck**

Run:

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .env.example
git commit -m "chore: add operations platform dependencies"
```

---

### Task 3: Add Domain Types And Demo Data

**Files:**
- Create: `src/lib/admin/types.ts`
- Create: `src/lib/admin/demo-data.ts`
- Create: `src/lib/admin/formatters.ts`
- Create: `src/lib/admin/queries.ts`

- [ ] **Step 1: Create domain types**

Create `src/lib/admin/types.ts`:

```ts
export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
export type ProjectStatus = "planning" | "active" | "paused" | "completed";
export type ProjectPhaseStatus = "completed" | "in-progress" | "upcoming";
export type FileVisibility = "internal" | "customer";
export type InvoiceStatus = "draft" | "sent" | "paid";
export type WorkerStatus = "active" | "inactive";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budgetRange: string;
  status: LeadStatus;
  nextFollowUp: string;
  notes: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ProjectPhase {
  id: string;
  title: string;
  description: string;
  status: ProjectPhaseStatus;
  dateLabel: string;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  type: "photo" | "document" | "invoice";
  visibility: FileVisibility;
  uploadedAt: string;
  sizeLabel: string;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  location: string;
  type: string;
  status: ProjectStatus;
  currentPhase: string;
  progress: number;
  budgetRange: string;
  startDate: string;
  estimatedCompletion: string;
  notes: string;
  heroImage: string;
  phases: ProjectPhase[];
}

export interface Worker {
  id: string;
  name: string;
  role: string;
  status: WorkerStatus;
}

export interface TimeEntry {
  id: string;
  workerId: string;
  projectId: string;
  clockIn: string;
  clockOut: string | null;
  notes: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  projectId: string;
  clientId: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  notes: string;
  lineItems: InvoiceLineItem[];
}
```

- [ ] **Step 2: Create demo data**

Create `src/lib/admin/demo-data.ts` with three demo projects, five leads, three clients, four workers, time logs, files, and invoices. Use existing public project photography:

```ts
import type { Client, Invoice, Lead, Project, ProjectFile, TimeEntry, Worker } from "./types";

export const clients: Client[] = [
  { id: "client-1", name: "Avery Thompson", email: "avery@example.com", phone: "(970) 555-0181" },
  { id: "client-2", name: "Morgan Ridge", email: "morgan@example.com", phone: "(970) 555-0194" },
  { id: "client-3", name: "Summit Creek Holdings", email: "projects@summitcreek.example", phone: "(970) 555-0167" },
];

export const leads: Lead[] = [
  {
    id: "lead-1",
    name: "Danielle Porter",
    email: "danielle@example.com",
    phone: "(970) 555-0142",
    projectType: "Custom Home",
    budgetRange: "$900k-$1.2M",
    status: "qualified",
    nextFollowUp: "2026-05-12",
    notes: "Interested in a modern ranch layout near Windsor.",
  },
  {
    id: "lead-2",
    name: "Chris Valdez",
    email: "chris@example.com",
    phone: "(970) 555-0178",
    projectType: "Kitchen Remodel",
    budgetRange: "$120k-$180k",
    status: "contacted",
    nextFollowUp: "2026-05-10",
    notes: "Wants premium finishes and a tighter construction window.",
  },
  {
    id: "lead-3",
    name: "Harper Stone",
    email: "harper@example.com",
    phone: "(970) 555-0126",
    projectType: "Addition",
    budgetRange: "$250k-$350k",
    status: "proposal",
    nextFollowUp: "2026-05-15",
    notes: "Needs garage and guest suite pricing separated.",
  },
  {
    id: "lead-4",
    name: "Northline Dental",
    email: "buildout@northline.example",
    phone: "(970) 555-0118",
    projectType: "Commercial Buildout",
    budgetRange: "$450k-$650k",
    status: "new",
    nextFollowUp: "2026-05-09",
    notes: "Commercial tenant improvement inquiry.",
  },
  {
    id: "lead-5",
    name: "Elena Morris",
    email: "elena@example.com",
    phone: "(970) 555-0155",
    projectType: "Whole Home Remodel",
    budgetRange: "$500k-$750k",
    status: "won",
    nextFollowUp: "2026-05-20",
    notes: "Approved design discovery retainer.",
  },
];

export const projects: Project[] = [
  {
    id: "project-1",
    clientId: "client-1",
    name: "Highland Ridge Custom Home",
    location: "Windsor, CO",
    type: "Custom Home",
    status: "active",
    currentPhase: "Interior rough-in",
    progress: 58,
    budgetRange: "$950k-$1.15M",
    startDate: "2026-02-03",
    estimatedCompletion: "2026-09-18",
    notes: "Demo project showing owner-ready progress updates and internal controls.",
    heroImage: "/images/project-3/exterior-twilight-front.jpg",
    phases: [
      { id: "phase-1", title: "Preconstruction", description: "Selections, budget alignment, and schedule lock.", status: "completed", dateLabel: "Feb 2026" },
      { id: "phase-2", title: "Foundation & Framing", description: "Foundation, framing, and dried-in milestone.", status: "completed", dateLabel: "Mar 2026" },
      { id: "phase-3", title: "Interior Rough-In", description: "MEP rough-in, inspections, and coordination notes.", status: "in-progress", dateLabel: "May 2026" },
      { id: "phase-4", title: "Finishes", description: "Cabinetry, flooring, tile, and fixture installation.", status: "upcoming", dateLabel: "Summer 2026" },
    ],
  },
  {
    id: "project-2",
    clientId: "client-2",
    name: "Poudre Canyon Mountain Modern",
    location: "Bellvue, CO",
    type: "Mountain Custom Home",
    status: "active",
    currentPhase: "Exterior completion",
    progress: 76,
    budgetRange: "$780k-$940k",
    startDate: "2025-11-10",
    estimatedCompletion: "2026-07-22",
    notes: "Demo project focused on remote-site progress photos and document tracking.",
    heroImage: "/images/project-2/exterior-front-facade.jpg",
    phases: [
      { id: "phase-1", title: "Site Prep", description: "Drive, utilities, and site staging.", status: "completed", dateLabel: "Nov 2025" },
      { id: "phase-2", title: "Shell", description: "Framing, siding, roofing, and windows.", status: "completed", dateLabel: "Feb 2026" },
      { id: "phase-3", title: "Exterior Completion", description: "Exterior punch and weatherproofing details.", status: "in-progress", dateLabel: "May 2026" },
      { id: "phase-4", title: "Final Walkthrough", description: "Owner walkthrough and warranty packet.", status: "upcoming", dateLabel: "Jul 2026" },
    ],
  },
  {
    id: "project-3",
    clientId: "client-3",
    name: "Timnath Commercial Buildout",
    location: "Timnath, CO",
    type: "Commercial",
    status: "planning",
    currentPhase: "Preconstruction",
    progress: 18,
    budgetRange: "$420k-$560k",
    startDate: "2026-06-01",
    estimatedCompletion: "2026-11-15",
    notes: "Demo commercial workflow for documents, budget line items, and follow-ups.",
    heroImage: "/images/project-1/exterior-1.jpg",
    phases: [
      { id: "phase-1", title: "Preconstruction", description: "Scope, bids, and submittals.", status: "in-progress", dateLabel: "May 2026" },
      { id: "phase-2", title: "Permits", description: "Permit and inspection workflow.", status: "upcoming", dateLabel: "Jun 2026" },
      { id: "phase-3", title: "Buildout", description: "Framing, MEP, finishes, and turnover.", status: "upcoming", dateLabel: "Summer 2026" },
    ],
  },
];

export const projectFiles: ProjectFile[] = [
  { id: "file-1", projectId: "project-1", name: "Rough-in inspection packet.pdf", type: "document", visibility: "internal", uploadedAt: "2026-05-04", sizeLabel: "1.8 MB" },
  { id: "file-2", projectId: "project-1", name: "Kitchen progress photo set", type: "photo", visibility: "customer", uploadedAt: "2026-05-05", sizeLabel: "12 photos" },
  { id: "file-3", projectId: "project-2", name: "Exterior punch notes.pdf", type: "document", visibility: "internal", uploadedAt: "2026-05-02", sizeLabel: "420 KB" },
  { id: "file-4", projectId: "project-3", name: "Preconstruction estimate.pdf", type: "document", visibility: "customer", uploadedAt: "2026-04-28", sizeLabel: "936 KB" },
];

export const workers: Worker[] = [
  { id: "worker-1", name: "Caleb Jensen", role: "Lead Carpenter", status: "active" },
  { id: "worker-2", name: "Maya Torres", role: "Project Coordinator", status: "active" },
  { id: "worker-3", name: "Eli Brooks", role: "Finish Carpenter", status: "active" },
  { id: "worker-4", name: "Noah Reed", role: "Field Support", status: "inactive" },
];

export const timeEntries: TimeEntry[] = [
  { id: "time-1", workerId: "worker-1", projectId: "project-1", clockIn: "2026-05-06T07:12:00-06:00", clockOut: "2026-05-06T15:48:00-06:00", notes: "Interior blocking and coordination." },
  { id: "time-2", workerId: "worker-2", projectId: "project-1", clockIn: "2026-05-06T08:00:00-06:00", clockOut: "2026-05-06T12:30:00-06:00", notes: "Updated selections and owner notes." },
  { id: "time-3", workerId: "worker-3", projectId: "project-2", clockIn: "2026-05-06T06:45:00-06:00", clockOut: null, notes: "Active shift demo." },
  { id: "time-4", workerId: "worker-1", projectId: "project-3", clockIn: "2026-05-05T09:00:00-06:00", clockOut: "2026-05-05T13:15:00-06:00", notes: "Preconstruction walkthrough." },
];

export const invoices: Invoice[] = [
  {
    id: "invoice-1",
    invoiceNumber: "KBC-2026-001",
    projectId: "project-1",
    clientId: "client-1",
    status: "draft",
    issueDate: "2026-05-07",
    dueDate: "2026-05-22",
    notes: "Demo invoice for platform walkthrough. Payment instructions will be finalized before production use.",
    lineItems: [
      { id: "line-1", description: "Interior rough-in labor", quantity: 42.5, unitPrice: 86 },
      { id: "line-2", description: "MEP coordination allowance", quantity: 1, unitPrice: 2800 },
      { id: "line-3", description: "Site protection materials", quantity: 1, unitPrice: 740 },
    ],
  },
  {
    id: "invoice-2",
    invoiceNumber: "KBC-2026-002",
    projectId: "project-2",
    clientId: "client-2",
    status: "sent",
    issueDate: "2026-05-01",
    dueDate: "2026-05-16",
    notes: "Demo exterior milestone invoice.",
    lineItems: [
      { id: "line-1", description: "Exterior punch labor", quantity: 31, unitPrice: 82 },
      { id: "line-2", description: "Metal siding closeout materials", quantity: 1, unitPrice: 1900 },
    ],
  },
];
```

- [ ] **Step 3: Add formatting helpers**

Create `src/lib/admin/formatters.ts`:

```ts
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function invoiceTotal(lineItems: { quantity: number; unitPrice: number }[]): number {
  return lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export function timeEntryHours(clockIn: string, clockOut: string | null): number {
  const end = clockOut ? new Date(clockOut) : new Date();
  const start = new Date(clockIn);
  return Math.max(0, (end.getTime() - start.getTime()) / 1000 / 60 / 60);
}

export function formatHours(hours: number): string {
  return `${hours.toFixed(1)} hrs`;
}
```

- [ ] **Step 4: Add query selectors**

Create `src/lib/admin/queries.ts`:

```ts
import { clients, invoices, leads, projectFiles, projects, timeEntries, workers } from "./demo-data";
import { invoiceTotal, timeEntryHours } from "./formatters";

export function getDashboardMetrics() {
  const weeklyHours = timeEntries.reduce((sum, entry) => sum + timeEntryHours(entry.clockIn, entry.clockOut), 0);
  const draftInvoiceTotal = invoices
    .filter((invoice) => invoice.status === "draft")
    .reduce((sum, invoice) => sum + invoiceTotal(invoice.lineItems), 0);

  return {
    activeProjects: projects.filter((project) => project.status === "active").length,
    recentUploads: projectFiles.length,
    weeklyHours,
    draftInvoiceTotal,
    openLeads: leads.filter((lead) => lead.status !== "won" && lead.status !== "lost").length,
  };
}

export function getLeads() {
  return leads;
}

export function getProjects() {
  return projects;
}

export function getProject(projectId: string) {
  return projects.find((project) => project.id === projectId) ?? null;
}

export function getProjectFiles(projectId: string) {
  return projectFiles.filter((file) => file.projectId === projectId);
}

export function getProjectTimeEntries(projectId: string) {
  return timeEntries.filter((entry) => entry.projectId === projectId);
}

export function getProjectInvoices(projectId: string) {
  return invoices.filter((invoice) => invoice.projectId === projectId);
}

export function getWorkers() {
  return workers;
}

export function getTimeEntries() {
  return timeEntries;
}

export function getInvoices() {
  return invoices;
}

export function getInvoice(invoiceId: string) {
  return invoices.find((invoice) => invoice.id === invoiceId) ?? null;
}

export function getClient(clientId: string) {
  return clients.find((client) => client.id === clientId) ?? null;
}

export function getWorker(workerId: string) {
  return workers.find((worker) => worker.id === workerId) ?? null;
}
```

- [ ] **Step 5: Run typecheck**

Run:

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/admin
git commit -m "feat: add operations demo domain data"
```

---

### Task 4: Add Supabase Environment And Schema Foundation

**Files:**
- Create: `src/lib/supabase/env.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/client.ts`
- Create: `supabase/migrations/0001_phase_1_schema.sql`
- Create: `supabase/seed.sql`

- [ ] **Step 1: Add typed env parsing**

Create `src/lib/supabase/env.ts`:

```ts
import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_DEMO_MODE: z.string().optional(),
});

export function getPublicEnv() {
  const parsed = publicEnvSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
  });

  return {
    supabaseUrl: parsed.NEXT_PUBLIC_SUPABASE_URL || null,
    supabaseAnonKey: parsed.NEXT_PUBLIC_SUPABASE_ANON_KEY || null,
    demoMode: parsed.NEXT_PUBLIC_DEMO_MODE !== "false",
  };
}

export function hasSupabasePublicEnv() {
  const env = getPublicEnv();
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}
```

- [ ] **Step 2: Add Supabase client factory**

Create `src/lib/supabase/client.ts`:

```ts
import { createBrowserClient } from "@supabase/ssr";
import { getPublicEnv } from "./env";

export function createClient() {
  const env = getPublicEnv();

  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}
```

- [ ] **Step 3: Add server factory**

Create `src/lib/supabase/server.ts`:

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicEnv } from "./env";

export async function createClient() {
  const env = getPublicEnv();

  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies. Middleware handles refresh.
        }
      },
    },
  });
}
```

- [ ] **Step 4: Add migration**

Create `supabase/migrations/0001_phase_1_schema.sql`:

```sql
create type app_role as enum ('admin', 'customer', 'employee', 'subcontractor');
create type lead_status as enum ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost');
create type project_status as enum ('planning', 'active', 'paused', 'completed');
create type phase_status as enum ('completed', 'in-progress', 'upcoming');
create type file_visibility as enum ('internal', 'customer');
create type invoice_status as enum ('draft', 'sent', 'paid');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role app_role not null default 'admin',
  full_name text,
  created_at timestamptz not null default now()
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  project_type text not null,
  budget_range text not null,
  status lead_status not null default 'new',
  next_follow_up date,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete restrict,
  name text not null,
  location text not null,
  type text not null,
  status project_status not null default 'planning',
  current_phase text not null,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  budget_range text not null,
  start_date date not null,
  estimated_completion date not null,
  notes text not null default '',
  hero_image text not null default '',
  created_at timestamptz not null default now()
);

create table project_phases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  description text not null,
  status phase_status not null default 'upcoming',
  date_label text not null,
  sort_order integer not null default 0
);

create table project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  name text not null,
  file_type text not null check (file_type in ('photo', 'document', 'invoice')),
  visibility file_visibility not null default 'internal',
  storage_bucket text not null,
  storage_path text not null,
  size_label text not null default '',
  uploaded_at timestamptz not null default now()
);

create table workers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table time_entries (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references workers(id) on delete restrict,
  project_id uuid not null references projects(id) on delete cascade,
  clock_in timestamptz not null,
  clock_out timestamptz,
  notes text not null default '',
  created_at timestamptz not null default now(),
  check (clock_out is null or clock_out > clock_in)
);

create table invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  project_id uuid not null references projects(id) on delete restrict,
  client_id uuid not null references clients(id) on delete restrict,
  status invoice_status not null default 'draft',
  issue_date date not null,
  due_date date not null,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table invoice_line_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  description text not null,
  quantity numeric(10, 2) not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  sort_order integer not null default 0
);

alter table profiles enable row level security;
alter table clients enable row level security;
alter table leads enable row level security;
alter table projects enable row level security;
alter table project_phases enable row level security;
alter table project_files enable row level security;
alter table workers enable row level security;
alter table time_entries enable row level security;
alter table invoices enable row level security;
alter table invoice_line_items enable row level security;

create policy "admins can read profiles" on profiles for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "admins manage clients" on clients for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
) with check (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
```

- [ ] **Step 5: Add seed note**

Create `supabase/seed.sql`:

```sql
-- Phase 1 seed data is represented in src/lib/admin/demo-data.ts for the sales demo.
-- Once Supabase credentials are connected, mirror those records here with stable UUIDs.
```

- [ ] **Step 6: Run typecheck**

Run:

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib/supabase supabase
git commit -m "feat: add Supabase foundation schema"
```

---

### Task 5: Build Admin Shell And Shared Components

**Files:**
- Create: `src/components/admin/AdminShell.tsx`
- Create: `src/components/admin/MetricCard.tsx`
- Create: `src/components/admin/StatusBadge.tsx`
- Create: `src/components/admin/ProjectProgress.tsx`
- Create: `src/components/admin/InvoiceDownloadButton.tsx`

- [ ] **Step 1: Create admin shell**

Create `src/components/admin/AdminShell.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import { BarChart3, Clock, FileText, FolderKanban, Home, ReceiptText, Users } from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { href: "/admin", label: "Command Center", icon: Home },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/time", label: "Time", icon: Clock },
  { href: "/admin/invoices", label: "Invoices", icon: ReceiptText },
  { href: "/", label: "Public Site", icon: BarChart3 },
];

export default function AdminShell({ children, title, eyebrow }: { children: ReactNode; title: string; eyebrow?: string }) {
  return (
    <div className="min-h-screen bg-[#f4efe7] text-[#171717]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-black/10 bg-[#151515] px-5 py-6 text-white lg:block">
        <Link href="/admin" className="mb-10 flex items-center gap-3">
          <Image src="/images/kiefer-k-logo.png" alt="Kiefer Built Contracting" width={48} height={48} className="rounded-md" />
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em]">Kiefer Built</p>
            <p className="text-xs text-white/55">Operations Console</p>
          </div>
        </Link>
        <nav className="space-y-1" aria-label="Admin navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/72 transition hover:bg-white/10 hover:text-white">
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="border-b border-black/10 bg-[#f9f6f0]/90 px-5 py-5 backdrop-blur lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b92516]">{eyebrow ?? "Admin Demo"}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#171717] md:text-3xl">{title}</h1>
        </header>
        <main className="px-5 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create metric card**

Create `src/components/admin/MetricCard.tsx`:

```tsx
import type { LucideIcon } from "lucide-react";

export default function MetricCard({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: LucideIcon }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8176]">{label}</p>
          <p className="mt-3 text-3xl font-bold text-[#171717]">{value}</p>
          <p className="mt-2 text-sm text-[#655c52]">{detail}</p>
        </div>
        <div className="rounded-md bg-[#b92516]/10 p-2 text-[#b92516]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create status badge**

Create `src/components/admin/StatusBadge.tsx`:

```tsx
const styles: Record<string, string> = {
  active: "bg-green-50 text-green-700 ring-green-200",
  planning: "bg-amber-50 text-amber-700 ring-amber-200",
  completed: "bg-neutral-100 text-neutral-700 ring-neutral-200",
  draft: "bg-amber-50 text-amber-700 ring-amber-200",
  sent: "bg-blue-50 text-blue-700 ring-blue-200",
  paid: "bg-green-50 text-green-700 ring-green-200",
  qualified: "bg-blue-50 text-blue-700 ring-blue-200",
  proposal: "bg-purple-50 text-purple-700 ring-purple-200",
  contacted: "bg-neutral-100 text-neutral-700 ring-neutral-200",
  new: "bg-[#b92516]/10 text-[#b92516] ring-[#b92516]/20",
  won: "bg-green-50 text-green-700 ring-green-200",
  lost: "bg-neutral-100 text-neutral-500 ring-neutral-200",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${styles[status] ?? styles.completed}`}>
      {status.replace("-", " ")}
    </span>
  );
}
```

- [ ] **Step 4: Create project progress**

Create `src/components/admin/ProjectProgress.tsx`:

```tsx
export default function ProjectProgress({ progress }: { progress: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-[#655c52]">Progress</span>
        <span className="font-semibold text-[#171717]">{progress}%</span>
      </div>
      <div className="h-2 rounded-full bg-black/10">
        <div className="h-full rounded-full bg-[#b92516]" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create invoice download button**

Create `src/components/admin/InvoiceDownloadButton.tsx`:

```tsx
import Link from "next/link";
import { Download } from "lucide-react";

export default function InvoiceDownloadButton({ invoiceId }: { invoiceId: string }) {
  return (
    <Link href={`/admin/invoices/${invoiceId}/download`} className="inline-flex items-center gap-2 rounded-md bg-[#b92516] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#951e13]">
      <Download className="h-4 w-4" />
      Download PDF
    </Link>
  );
}
```

- [ ] **Step 6: Run typecheck**

Run:

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/admin
git commit -m "feat: add admin console shell"
```

---

### Task 6: Build Admin Dashboard And Module Pages

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/leads/page.tsx`
- Create: `src/app/admin/projects/page.tsx`
- Create: `src/app/admin/projects/[projectId]/page.tsx`
- Create: `src/app/admin/time/page.tsx`
- Create: `src/app/admin/invoices/page.tsx`

- [ ] **Step 1: Create admin layout**

Create `src/app/admin/layout.tsx`:

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Kiefer Built Operations",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
```

- [ ] **Step 2: Create dashboard page**

Create `src/app/admin/page.tsx`:

```tsx
import { Clock, FileText, FolderKanban, ReceiptText, Users } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import MetricCard from "@/components/admin/MetricCard";
import ProjectProgress from "@/components/admin/ProjectProgress";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatCurrency, formatHours } from "@/lib/admin/formatters";
import { getDashboardMetrics, getLeads, getProjects } from "@/lib/admin/queries";

export default function AdminDashboardPage() {
  const metrics = getDashboardMetrics();
  const projects = getProjects();
  const leads = getLeads().slice(0, 4);

  return (
    <AdminShell title="Command Center" eyebrow="Kiefer Built Operations">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Active Projects" value={String(metrics.activeProjects)} detail="Demo construction workload" icon={FolderKanban} />
        <MetricCard label="Open Leads" value={String(metrics.openLeads)} detail="CRM follow-up queue" icon={Users} />
        <MetricCard label="Recent Uploads" value={String(metrics.recentUploads)} detail="Photos and documents" icon={FileText} />
        <MetricCard label="Weekly Hours" value={formatHours(metrics.weeklyHours)} detail="Demo labor tracking" icon={Clock} />
        <MetricCard label="Draft Invoices" value={formatCurrency(metrics.draftInvoiceTotal)} detail="Ready for review" icon={ReceiptText} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold">Project Snapshot</h2>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8176]">Demo Data</span>
          </div>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="rounded-md border border-black/10 p-4">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-sm text-[#655c52]">{project.location} · {project.currentPhase}</p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                <ProjectProgress progress={project.progress} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-lg font-bold">Lead Follow-Ups</h2>
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="border-b border-black/10 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{lead.name}</p>
                  <StatusBadge status={lead.status} />
                </div>
                <p className="mt-1 text-sm text-[#655c52]">{lead.projectType} · {lead.budgetRange}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#b92516]">Follow up {lead.nextFollowUp}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
```

- [ ] **Step 3: Create leads page**

Create `src/app/admin/leads/page.tsx`:

```tsx
import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import { getLeads } from "@/lib/admin/queries";

export default function LeadsPage() {
  const leads = getLeads();

  return (
    <AdminShell title="Lead + Client CRM" eyebrow="Sales Pipeline">
      <div className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_1fr] gap-4 border-b border-black/10 bg-[#151515] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
          <span>Lead</span>
          <span>Project</span>
          <span>Budget</span>
          <span>Status</span>
          <span>Next Step</span>
        </div>
        {leads.map((lead) => (
          <div key={lead.id} className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_1fr] gap-4 border-b border-black/10 px-4 py-4 last:border-0">
            <div>
              <p className="font-semibold">{lead.name}</p>
              <p className="text-sm text-[#655c52]">{lead.email}</p>
              <p className="text-sm text-[#655c52]">{lead.phone}</p>
            </div>
            <p>{lead.projectType}</p>
            <p>{lead.budgetRange}</p>
            <StatusBadge status={lead.status} />
            <div>
              <p className="font-medium">{lead.nextFollowUp}</p>
              <p className="mt-1 text-sm text-[#655c52]">{lead.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
```

- [ ] **Step 4: Create projects page**

Create `src/app/admin/projects/page.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import ProjectProgress from "@/components/admin/ProjectProgress";
import StatusBadge from "@/components/admin/StatusBadge";
import { getClient, getProjects } from "@/lib/admin/queries";

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <AdminShell title="Projects" eyebrow="Active Work">
      <div className="grid gap-5 lg:grid-cols-3">
        {projects.map((project) => {
          const client = getClient(project.clientId);
          return (
            <Link key={project.id} href={`/admin/projects/${project.id}`} className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="relative h-44">
                <Image src={project.heroImage} alt={project.name} fill className="object-cover" />
              </div>
              <div className="p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold">{project.name}</h2>
                    <p className="text-sm text-[#655c52]">{client?.name} · {project.location}</p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                <p className="mb-4 text-sm text-[#655c52]">{project.notes}</p>
                <ProjectProgress progress={project.progress} />
              </div>
            </Link>
          );
        })}
      </div>
    </AdminShell>
  );
}
```

- [ ] **Step 5: Create project detail page**

Create `src/app/admin/projects/[projectId]/page.tsx`:

```tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import InvoiceDownloadButton from "@/components/admin/InvoiceDownloadButton";
import ProjectProgress from "@/components/admin/ProjectProgress";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatCurrency, formatDateTime, formatHours, invoiceTotal, timeEntryHours } from "@/lib/admin/formatters";
import { getClient, getProject, getProjectFiles, getProjectInvoices, getProjectTimeEntries, getWorker } from "@/lib/admin/queries";

export default async function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = getProject(projectId);
  if (!project) notFound();

  const client = getClient(project.clientId);
  const files = getProjectFiles(project.id);
  const timeEntries = getProjectTimeEntries(project.id);
  const invoices = getProjectInvoices(project.id);

  return (
    <AdminShell title={project.name} eyebrow={`${project.location} · ${project.type}`}>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
          <div className="relative h-72">
            <Image src={project.heroImage} alt={project.name} fill className="object-cover" />
          </div>
          <div className="p-5">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-[#655c52]">Client: {client?.name}</p>
                <h2 className="mt-1 text-xl font-bold">{project.currentPhase}</h2>
              </div>
              <StatusBadge status={project.status} />
            </div>
            <ProjectProgress progress={project.progress} />
            <p className="mt-5 text-[#655c52]">{project.notes}</p>
          </div>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Invoices</h2>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="rounded-md border border-black/10 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-[#655c52]">{formatCurrency(invoiceTotal(invoice.lineItems))}</p>
                  </div>
                  <StatusBadge status={invoice.status} />
                </div>
                <InvoiceDownloadButton invoiceId={invoice.id} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Timeline</h2>
          <div className="space-y-4">
            {project.phases.map((phase) => (
              <div key={phase.id} className="border-l-2 border-[#b92516] pl-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{phase.title}</p>
                  <StatusBadge status={phase.status} />
                </div>
                <p className="mt-1 text-sm text-[#655c52]">{phase.description}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#8a8176]">{phase.dateLabel}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Files</h2>
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="rounded-md border border-black/10 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{file.name}</p>
                  <StatusBadge status={file.visibility} />
                </div>
                <p className="mt-1 text-sm text-[#655c52]">{file.type} · {file.sizeLabel}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Time Logs</h2>
          <div className="space-y-3">
            {timeEntries.map((entry) => {
              const worker = getWorker(entry.workerId);
              return (
                <div key={entry.id} className="rounded-md border border-black/10 p-3">
                  <p className="font-medium">{worker?.name}</p>
                  <p className="text-sm text-[#655c52]">{formatDateTime(entry.clockIn)} · {formatHours(timeEntryHours(entry.clockIn, entry.clockOut))}</p>
                  <p className="mt-1 text-sm text-[#655c52]">{entry.notes}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
```

- [ ] **Step 6: Create time page**

Create `src/app/admin/time/page.tsx`:

```tsx
import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatDateTime, formatHours, timeEntryHours } from "@/lib/admin/formatters";
import { getProject, getTimeEntries, getWorker, getWorkers } from "@/lib/admin/queries";

export default function TimePage() {
  const workers = getWorkers();
  const entries = getTimeEntries();

  return (
    <AdminShell title="Clock-In / Clock-Out" eyebrow="Labor Tracking Demo">
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Workers</h2>
          <div className="space-y-3">
            {workers.map((worker) => (
              <div key={worker.id} className="rounded-md border border-black/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{worker.name}</p>
                    <p className="text-sm text-[#655c52]">{worker.role}</p>
                  </div>
                  <StatusBadge status={worker.status} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Time Entries</h2>
          <div className="space-y-3">
            {entries.map((entry) => {
              const worker = getWorker(entry.workerId);
              const project = getProject(entry.projectId);
              return (
                <div key={entry.id} className="rounded-md border border-black/10 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{worker?.name}</p>
                      <p className="text-sm text-[#655c52]">{project?.name}</p>
                    </div>
                    <StatusBadge status={entry.clockOut ? "completed" : "active"} />
                  </div>
                  <p className="mt-3 text-sm text-[#655c52]">{formatDateTime(entry.clockIn)} · {formatHours(timeEntryHours(entry.clockIn, entry.clockOut))}</p>
                  <p className="mt-1 text-sm text-[#655c52]">{entry.notes}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
```

- [ ] **Step 7: Create invoices page**

Create `src/app/admin/invoices/page.tsx`:

```tsx
import AdminShell from "@/components/admin/AdminShell";
import InvoiceDownloadButton from "@/components/admin/InvoiceDownloadButton";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatCurrency, formatDate, invoiceTotal } from "@/lib/admin/formatters";
import { getClient, getInvoices, getProject } from "@/lib/admin/queries";

export default function InvoicesPage() {
  const invoices = getInvoices();

  return (
    <AdminShell title="Invoices" eyebrow="Branded PDF Generation">
      <div className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="grid grid-cols-[1fr_1fr_0.9fr_0.7fr_0.8fr] gap-4 border-b border-black/10 bg-[#151515] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
          <span>Invoice</span>
          <span>Project</span>
          <span>Total</span>
          <span>Status</span>
          <span>Download</span>
        </div>
        {invoices.map((invoice) => {
          const project = getProject(invoice.projectId);
          const client = getClient(invoice.clientId);
          return (
            <div key={invoice.id} className="grid grid-cols-[1fr_1fr_0.9fr_0.7fr_0.8fr] gap-4 border-b border-black/10 px-4 py-4 last:border-0">
              <div>
                <p className="font-semibold">{invoice.invoiceNumber}</p>
                <p className="text-sm text-[#655c52]">Due {formatDate(invoice.dueDate)}</p>
              </div>
              <div>
                <p className="font-medium">{project?.name}</p>
                <p className="text-sm text-[#655c52]">{client?.name}</p>
              </div>
              <p className="font-semibold">{formatCurrency(invoiceTotal(invoice.lineItems))}</p>
              <StatusBadge status={invoice.status} />
              <InvoiceDownloadButton invoiceId={invoice.id} />
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
```

- [ ] **Step 8: Run typecheck and build**

Run:

```bash
npm run typecheck
npm run build
```

Expected: both PASS.

- [ ] **Step 9: Commit**

```bash
git add src/app/admin
git commit -m "feat: build operations admin pages"
```

---

### Task 7: Add Branded Invoice PDF Route

**Files:**
- Create: `src/lib/admin/invoice-pdf.tsx`
- Create: `src/app/admin/invoices/[invoiceId]/download/route.ts`

- [ ] **Step 1: Create invoice PDF component**

Create `src/lib/admin/invoice-pdf.tsx`:

```tsx
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Client, Invoice, Project } from "./types";
import { invoiceTotal } from "./formatters";

const styles = StyleSheet.create({
  page: { padding: 42, fontSize: 10, color: "#171717", fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 2, borderBottomColor: "#b92516", paddingBottom: 18, marginBottom: 28 },
  logo: { width: 86, height: 86, objectFit: "contain" },
  title: { fontSize: 28, fontWeight: 700, textAlign: "right" },
  muted: { color: "#6b6258" },
  section: { marginBottom: 22 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 20 },
  h2: { fontSize: 12, fontWeight: 700, textTransform: "uppercase", marginBottom: 8, color: "#b92516" },
  tableHeader: { flexDirection: "row", backgroundColor: "#151515", color: "#ffffff", paddingVertical: 8, paddingHorizontal: 10 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#ded6cc", paddingVertical: 8, paddingHorizontal: 10 },
  desc: { flex: 1.8 },
  qty: { flex: 0.5, textAlign: "right" },
  price: { flex: 0.8, textAlign: "right" },
  total: { flex: 0.8, textAlign: "right" },
  grandTotal: { marginTop: 16, alignSelf: "flex-end", width: 190, borderTopWidth: 2, borderTopColor: "#151515", paddingTop: 10 },
  grandTotalText: { fontSize: 16, fontWeight: 700, textAlign: "right" },
  notes: { backgroundColor: "#f4efe7", padding: 12, lineHeight: 1.5 },
});

function currency(value: number) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function InvoicePdf({ invoice, client, project, logoSrc }: { invoice: Invoice; client: Client; project: Project; logoSrc: string }) {
  const total = invoiceTotal(invoice.lineItems);

  return (
    <Document title={`${invoice.invoiceNumber} - Kiefer Built Contracting`}>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Image src={logoSrc} style={styles.logo} />
            <Text>Kiefer Built Contracting</Text>
            <Text style={styles.muted}>Windsor, Colorado</Text>
            <Text style={styles.muted}>info@kbuiltco.com · (970) 515-5059</Text>
          </View>
          <View>
            <Text style={styles.title}>Invoice</Text>
            <Text style={styles.muted}>{invoice.invoiceNumber}</Text>
            <Text style={styles.muted}>Issued {invoice.issueDate}</Text>
            <Text style={styles.muted}>Due {invoice.dueDate}</Text>
          </View>
        </View>

        <View style={[styles.section, styles.row]}>
          <View>
            <Text style={styles.h2}>Bill To</Text>
            <Text>{client.name}</Text>
            <Text style={styles.muted}>{client.email}</Text>
            <Text style={styles.muted}>{client.phone}</Text>
          </View>
          <View>
            <Text style={styles.h2}>Project</Text>
            <Text>{project.name}</Text>
            <Text style={styles.muted}>{project.location}</Text>
            <Text style={styles.muted}>{project.type}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={styles.desc}>Description</Text>
            <Text style={styles.qty}>Qty</Text>
            <Text style={styles.price}>Unit</Text>
            <Text style={styles.total}>Total</Text>
          </View>
          {invoice.lineItems.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.qty}>{item.quantity}</Text>
              <Text style={styles.price}>{currency(item.unitPrice)}</Text>
              <Text style={styles.total}>{currency(item.quantity * item.unitPrice)}</Text>
            </View>
          ))}
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalText}>Total {currency(total)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Notes</Text>
          <Text style={styles.notes}>{invoice.notes}</Text>
        </View>
      </Page>
    </Document>
  );
}
```

- [ ] **Step 2: Create PDF route**

Create `src/app/admin/invoices/[invoiceId]/download/route.ts`:

```ts
import { pdf } from "@react-pdf/renderer";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { InvoicePdf } from "@/lib/admin/invoice-pdf";
import { getClient, getInvoice, getProject } from "@/lib/admin/queries";

export async function GET(_request: Request, { params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = await params;
  const invoice = getInvoice(invoiceId);

  if (!invoice) {
    return new Response("Invoice not found", { status: 404 });
  }

  const client = getClient(invoice.clientId);
  const project = getProject(invoice.projectId);

  if (!client || !project) {
    return new Response("Invoice relations not found", { status: 404 });
  }

  const logoPath = join(process.cwd(), "public", "images", "kiefer-k-logo.png");
  const logoBuffer = await readFile(logoPath);
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;
  const blob = await pdf(<InvoicePdf invoice={invoice} client={client} project={project} logoSrc={logoSrc} />).toBlob();

  return new Response(blob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.invoiceNumber}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
```

- [ ] **Step 3: Run typecheck**

Run:

```bash
npm run typecheck
```

Expected: PASS. If TypeScript rejects JSX in `route.ts`, rename the route file to `route.tsx` and rerun.

- [ ] **Step 4: Run build**

Run:

```bash
npm run build
```

Expected: PASS.

- [ ] **Step 5: Manually verify PDF download**

Run dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000/admin/invoices/invoice-1/download
```

Expected: Browser downloads or displays `KBC-2026-001.pdf` with Kiefer branding, invoice line items, and total.

- [ ] **Step 6: Commit**

```bash
git add src/lib/admin/invoice-pdf.tsx src/app/admin/invoices/[invoiceId]/download/route.ts
git commit -m "feat: generate branded invoice PDFs"
```

---

### Task 8: Add Login Page And Demo Auth Boundary

**Files:**
- Create: `src/app/login/page.tsx`
- Create: `src/lib/admin/auth.ts`
- Create: `src/middleware.ts`

- [ ] **Step 1: Create auth helper**

Create `src/lib/admin/auth.ts`:

```ts
import { getPublicEnv } from "@/lib/supabase/env";

export function isDemoMode() {
  return getPublicEnv().demoMode;
}

export function getAllowedAdminEmail() {
  return process.env.ADMIN_EMAIL || "demo-admin@kbuiltco.com";
}
```

- [ ] **Step 2: Add login page**

Create `src/app/login/page.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import { getAllowedAdminEmail, isDemoMode } from "@/lib/admin/auth";

export default function LoginPage() {
  const demoMode = isDemoMode();
  const adminEmail = getAllowedAdminEmail();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#151515] px-6 text-white">
      <section className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl">
        <Image src="/images/kiefer-k-logo.png" alt="Kiefer Built Contracting" width={92} height={92} className="mx-auto rounded-md" />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#e04a36]">Operations Console</p>
        <h1 className="mt-2 text-3xl font-bold">Admin Access</h1>
        <p className="mt-4 text-sm leading-6 text-white/65">
          Phase 1 uses real auth-ready structure with demo mode enabled until Supabase credentials are connected.
        </p>
        <div className="mt-6 rounded-md bg-black/25 p-4 text-left text-sm text-white/70">
          <p className="font-semibold text-white">Allowed admin</p>
          <p>{adminEmail}</p>
          <p className="mt-3">Demo mode: {demoMode ? "enabled" : "disabled"}</p>
        </div>
        <Link href="/admin" className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-[#b92516] px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#951e13]">
          Enter Demo Console
        </Link>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Add middleware demo-mode guard**

Create `src/middleware.ts`:

```ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

  if (request.nextUrl.pathname.startsWith("/admin") && !demoMode) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

- [ ] **Step 4: Run checks**

Run:

```bash
npm run typecheck
npm run build
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/login src/lib/admin/auth.ts src/middleware.ts
git commit -m "feat: add admin login demo boundary"
```

---

### Task 9: Fix ESLint Configuration Before Treating Lint As Required

**Files:**
- Modify: `package.json`
- Modify: `eslint.config.mjs`
- Modify: `package-lock.json`

- [ ] **Step 1: Inspect current ESLint config**

Run:

```bash
sed -n '1,220p' eslint.config.mjs
```

Expected: It imports `eslint-config-next/core-web-vitals`, which is currently unresolved with installed package versions.

- [ ] **Step 2: Install official matching Next ESLint config**

Run:

```bash
npm install -D eslint-config-next@latest
```

Expected: `eslint-config-next` updates to a package that provides the imported config path.

- [ ] **Step 3: Run lint**

Run:

```bash
npm run lint
```

Expected: PASS, or real source lint findings. If real findings appear, fix only files touched by this plan.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json eslint.config.mjs
git commit -m "chore: restore eslint checks"
```

---

### Task 10: Add Setup Documentation And Final Verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add operations setup docs**

Append to `README.md`:

````md
## Local Operations Demo

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

For the Phase 1 demo, keep:

```env
NEXT_PUBLIC_DEMO_MODE=true
```

Run locally:

```bash
npm run dev
```

Open:

- Public site: http://localhost:3000
- Admin login: http://localhost:3000/login
- Admin console: http://localhost:3000/admin
- Invoice PDF demo: http://localhost:3000/admin/invoices/invoice-1/download
````

- [ ] **Step 2: Run full verification**

Run:

```bash
npm run typecheck
npm run lint
npm run build
```

Expected: all PASS.

- [ ] **Step 3: Browser smoke test**

Start:

```bash
npm run dev
```

Open and inspect:

```text
http://localhost:3000/
http://localhost:3000/login
http://localhost:3000/admin
http://localhost:3000/admin/leads
http://localhost:3000/admin/projects
http://localhost:3000/admin/projects/project-1
http://localhost:3000/admin/time
http://localhost:3000/admin/invoices
http://localhost:3000/admin/invoices/invoice-1/download
```

Expected:

- Public website still renders.
- Admin console uses Kiefer branding.
- Demo data appears in each module.
- Project detail pages work.
- Invoice PDF downloads.
- No obvious text overlap at desktop width.

- [ ] **Step 4: Commit docs**

```bash
git add README.md
git commit -m "docs: add operations demo setup"
```

---

## Self-Review Checklist

- Phase 1 design coverage: admin login, dashboard, leads, projects, files metadata, time tracking, invoice PDF, demo data, and secure foundation are covered.
- Out-of-scope coverage: customer accounts, employee login, subcontractors, payments, accounting, AI, and Buildertrend parity are intentionally excluded.
- Static export risk is handled by Task 1.
- Supabase is represented as schema/client foundation but does not block the demo while credentials are unavailable.
- Invoice PDF is real and downloadable.
- Verification includes typecheck, lint, build, and manual browser smoke tests.
