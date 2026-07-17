# Kiefer Built Marketing Website Deployment Checklist

Use this checklist for preview and production releases of the public Kiefer Built website.

## Before Deployment

- Confirm the intended branch and review `git status --short --branch`.
- Run `npm install` using the committed lockfile.
- Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
- Review dependency audit output; do not use forced or breaking audit fixes without a separate review.
- Confirm `public/guides/kiefer-built-homeowner-guide.pdf` exists and remains reasonably sized.
- Confirm no admin, auth, portal, CRM, database, demo, or retired utility routes are present in the build output.
- Confirm the runtime-audit screenshots remain local and are not included in the deployment.

## Environment Variables

Configure these for Preview and Production when quote-request email should work:

```env
RESEND_API_KEY=<production email API key>
CONTACT_EMAIL_FROM="Kiefer Built <quotes@builtbykiefer.com>"
CONTACT_EMAIL_TO=info@kbuiltco.com
```

The sender domain must be verified with the email provider. No database, authentication, Supabase, demo-mode, or application-URL variables are required.

## Vercel and Domain Checks

- Verify the Vercel project is connected to the intended Git repository and production branch.
- Verify `www.builtbykiefer.com` is the canonical production origin.
- Confirm the apex domain redirects to the preferred origin if that is the active domain policy.
- Confirm Preview and Production use the intended environment-variable values.
- Do not add a database, authentication provider, or operations subdomain for this marketing-only application.

## Preview Review

- Open the homepage at desktop and mobile widths.
- Open every header dropdown and the mobile menu.
- Visit every route listed in `src/lib/public-site/routes.ts`.
- Confirm the two detailed project tours are linked from `/projects`.
- Confirm `/service-areas` is linked from the homepage.
- Confirm the Blog remains visibly usable as a card landing page without implying that article cards open.
- Verify citations and source anchors on every Why Kiefer Built page.
- Download and open the Homeowner Guide from `/why-kiefer-built` and `/why-kiefer-built/cost-of-ownership`.
- Check `/sitemap.xml` and `/robots.txt`.
- Check browser console and network panels for errors, missing images, and failed assets.

## Quote Request Verification

Only submit a real test request when the owner has authorized it and the recipient expects the message.

- Confirm required fields, email validation, minimum project-detail length, loading state, and disabled submit state.
- Confirm configured delivery produces a success message stating that the request was sent.
- Confirm unconfigured or failed delivery exposes the prepared email fallback.
- Confirm the API response and logs contain no CRM, database, or portal behavior.

## Production Smoke Test

- Homepage, About, Services, Projects, Why Kiefer Built, Process, Products, Testimonials, Careers, Contact, Vendors, and Blog load.
- Detailed project, renovation, service-area, custom-elevator, and education routes load.
- Header, mobile navigation, footer, floating quote CTA, and internal cross-links work.
- Images, project video, gallery controls, citation anchors, and the guide download work.
- Page titles, descriptions, canonicals, Open Graph tags, and Twitter metadata match the current route.
- `/sitemap.xml` contains the retained public pages and no retired application routes.
- Retired `/admin`, `/login`, `/portal`, `/vendor`, `/demo-slider`, `/estimate`, and `/project-timelines` paths return 404.
- No console errors, broken images, or unresolved internal links appear.

Record the deployment URL, commit SHA, checks performed, and any exceptions in the current session record.
