# Built by Kiefer

Portfolio website for **Kiefer Built Contracting** — custom home building, renovations, and commercial construction in Northern Colorado.

**Live site:** [builtbykiefer.com](https://builtbykiefer.com)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Contact Form:** Buildertrend embedded iframe
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
│   ├── Contact.tsx      # Contact info + Buildertrend form
│   └── Footer.tsx       # Site footer with social links
public/
└── images/              # Project photography
```
