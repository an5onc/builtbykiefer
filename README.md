# Built by Kiefer

Portfolio website for **Kiefer Built Contracting** — custom home building, renovations, and commercial construction in Northern Colorado.

**Live site:** [builtbykiefer.com](https://builtbykiefer.com)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Contact Form:** Kiefer Built quote request form with server-side email delivery
- **Deployment:** Vercel (auto-deploy from `main`)

## Phase 1 Operations Platform

The public website remains the marketing front door. The operations platform adds authenticated server-side functionality under `/admin`, so this project no longer uses `output: "export"`.

Server-side functionality is required for:

- Admin authentication
- Secure file/document workflows
- Supabase access
- Branded invoice PDF generation
- Railway deployment

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Build

```bash
npm run build
```

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

## Supabase Backend Setup

This repo is wired for Supabase Auth, Postgres, and private Storage, while keeping demo data available when Supabase is not configured.

1. Create a Supabase project.
2. Apply `supabase/migrations/0001_phase_1_schema.sql` in the Supabase SQL editor or with the Supabase CLI.
3. Apply `supabase/seed.sql` if you want the hosted database to mirror the demo records.
4. Create the first admin user in Supabase Auth.
5. Promote that user after signup:

```sql
update profiles
set role = 'admin'
where email = 'owner@example.com';
```

6. Set local/hosting env vars:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_DEMO_MODE=false
ADMIN_EMAIL=owner@example.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

The migration creates private `project-documents`, `project-photos`, and `invoice-pdfs` buckets. Admin users can manage these objects through RLS; customer and employee policies should be added only when those portals exist.

## Quote Request Email Setup

The public contact form posts to `/api/quote-request` and sends a formatted quote request to `info@kbuiltco.com`.

Set these in local and hosted environments before relying on email delivery:

```env
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL_FROM=Kiefer Built <quotes@builtbykiefer.com>
CONTACT_EMAIL_TO=info@kbuiltco.com
```

`CONTACT_EMAIL_FROM` must use a sender domain verified with the email provider. Without these values, the form still renders but shows a fallback email link instead of silently dropping the request.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with metadata/SEO
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles & Tailwind
├── components/
│   ├── Header.tsx       # Fixed header with mobile menu
│   ├── Hero.tsx         # Full-screen hero with parallax
│   ├── ProjectGallery.tsx # Scrapbook-style image gallery
│   ├── Process.tsx      # 4-step build process section
│   ├── Contact.tsx      # Contact info + Kiefer quote request form
│   └── Footer.tsx       # Site footer with social links
public/
└── images/              # Project photography
```
