# Built by Kiefer

Portfolio website for **Kiefer Built Contracting** — custom home building, renovations, and commercial construction in Northern Colorado.

**Live site:** [builtbykiefer.com](https://builtbykiefer.com)

## Tech Stack

- **Framework:** Next.js 16 (App Router, static export)
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Contact Form:** Buildertrend embedded iframe
- **Deployment:** Vercel (auto-deploy from `main`)

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

Static export outputs to the `out/` directory.

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
