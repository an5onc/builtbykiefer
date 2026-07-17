# Built by Kiefer

Public marketing website for Kiefer Built Contracting, a Northern Colorado builder focused on custom homes, renovations, commercial work, custom elevators, and high-performance construction education.

Production site: [www.builtbykiefer.com](https://www.builtbykiefer.com)

## Scope

This repository contains only the customer-facing website:

- Company, team, accolades, careers, testimonials, and vendor information
- Services, process, products, service areas, project galleries, and detailed project tours
- The Why Kiefer Built education series with source-backed citations
- The downloadable Kiefer Built Homeowner Guide
- A public quote-request form with server-side email delivery
- SEO metadata, structured data, sitemap, robots rules, analytics, responsive layouts, and accessible navigation

There is no admin dashboard, CRM, authentication system, client portal, vendor portal, project-management system, or database integration in this repository.

## Stack

- Next.js 16 App Router and React 19
- TypeScript in strict mode
- Tailwind CSS 4
- Framer Motion, Lucide React, and Yet Another React Lightbox
- Zod validation for quote requests
- Resend HTTP API for quote-request email delivery
- Vitest, ESLint, and TypeScript checks
- Google Analytics through `@next/third-parties`

## Local Setup

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

The website renders without environment variables. Quote-request email delivery requires:

```env
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL_FROM="Kiefer Built <quotes@builtbykiefer.com>"
CONTACT_EMAIL_TO=info@kbuiltco.com
```

`CONTACT_EMAIL_FROM` must use a sender domain verified with the email provider. When delivery is not configured or fails, the form presents a prepared email fallback instead of reporting a false success.

## Quality Commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Source of Truth

- `src/app/` - App Router pages, root metadata, sitemap, and quote API
- `src/lib/public-site/routes.ts` - retained public route manifest
- `src/lib/public-site/nav.ts` - desktop and mobile navigation
- `src/lib/public-site/content.ts` - shared marketing-page content
- `src/lib/public-site/sources.ts` - education citations and independent/industry labeling
- `src/components/public-site/PublicPage.tsx` - shared marketing-page renderer
- `src/components/Contact.tsx` - public quote form
- `src/lib/contact/` - validation, email formatting, and delivery orchestration
- `public/images/` - active project photography and brand assets
- `public/guides/kiefer-built-homeowner-guide.pdf` - owner-provided downloadable guide
- `docs/deployment-production-checklist.md` - production deployment and smoke tests

## Content Maintenance

Most standard marketing pages are content-driven through `src/lib/public-site/content.ts`. Detailed galleries and interactive pages live in their route or dedicated component files. When updating content, preserve route paths, citations, metadata, image alternative text, and quote-form fallback behavior.

The Blog is a curated landing page whose cards lead to the site's existing education and project pages. Add dedicated article routes only when complete article content is ready to publish.

Ongoing content work:

- Add completed projects and project photography.
- Refresh portfolio descriptions and featured work as the company evolves.

## Deployment

The application is designed for Vercel and includes one server route at `POST /api/quote-request`; it is not configured as a static export. Verify the active Vercel Git integration and environment-variable scopes before relying on automatic deployment.

Do not commit `.env.local`, local archives, generated build output, or the runtime-audit screenshot corpus.
