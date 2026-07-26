# How this website is hosted, served, and managed

Reference for the live infrastructure behind **builtbykiefer.com**: where the
code lives, what serves it, who controls the domain, and how email is delivered.

Every value here was verified against the live services on **2026-07-26**. For
the pre-deploy procedure see [deployment-production-checklist.md](./deployment-production-checklist.md);
this document describes the system itself rather than the steps.

## At a glance

| Layer | Provider | Detail |
| --- | --- | --- |
| Source code | GitHub | `an5onc/builtbykiefer`, production branch `main` |
| Hosting / CDN | Vercel | project `builtbykiefer`, auto-deploys on push to `main` |
| Framework | Next.js 16 (App Router) | React 19, TypeScript, Tailwind |
| Domain registrar | GoDaddy | `builtbykiefer.com` |
| Authoritative DNS | GoDaddy | `ns77.domaincontrol.com`, `ns78.domaincontrol.com` |
| Outbound email | Resend | domain verified, region us-east-1 |
| Quote inbox | Google Workspace | `info@kbuiltco.com` (separate domain) |

There is no database, no authentication, and no backend service. The site is a
statically-rendered marketing site plus one API route for the quote form.

## Source and deployment

The GitHub repository is the source of truth. Vercel watches it and deploys
automatically:

- **Push to `main`** → production build → **www.builtbykiefer.com**
- **Any other branch or PR** → a preview deployment on a temporary URL

There is no manual deploy step and no build server to maintain. Rolling back is
done from the Vercel dashboard by promoting a previous deployment; it does not
require a git revert.

The local `.vercel/` directory links this checkout to the Vercel project. It is
git-ignored, and holds the project and org ids if you ever need them.

Local development:

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build, catches what dev does not
npm run typecheck
npm test
```

## Domain and DNS

`builtbykiefer.com` is registered at GoDaddy, and GoDaddy also serves its DNS.
Changing nameservers away from GoDaddy would move DNS control and break every
record below, so avoid it unless you are deliberately migrating.

### Records that make the site load

| Type | Name | Value | Purpose |
| --- | --- | --- | --- |
| A | `@` | `216.198.79.1` | Apex points at Vercel |
| CNAME | `www` | `builtbykiefer.com` | www resolves through the apex |

**The apex redirects to www.** Requesting `https://builtbykiefer.com` returns a
`307` to `https://www.builtbykiefer.com/`, which is the canonical origin. SEO
metadata and structured data should always reference the `www` form.

### Records that make email work

All four were issued by Resend and are live:

| Type | Name | Value | Purpose |
| --- | --- | --- | --- |
| TXT | `@` | `resend-domain-verification=036d2f94…ff79ebb18775f` | Proves domain ownership |
| TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3…` | DKIM signing key |
| MX | `send` | `10 feedback-smtp.us-east-1.amazonses.com` | Bounce and complaint feedback |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | SPF authorization |

Do not delete these. Removing the DKIM or SPF record silently drops deliverability;
removing the verification TXT un-verifies the domain and all sending stops.

### The domain cannot receive mail

`builtbykiefer.com` has **no MX record at the root**, which is deliberate: it is
a send-only domain. Anything addressed to `quotes@builtbykiefer.com` or
`leads@builtbykiefer.com` will bounce. Those addresses exist only as *From*
headers, which Resend permits on a verified domain without a real mailbox.

Actual mail is received on separate domains:

- `info@kbuiltco.com` — Google Workspace, where quote requests are delivered
- `anson@nexgenstudio.io` — Google, where land lead alerts are delivered

If you ever want a real inbox at `@builtbykiefer.com`, that needs MX records
added for a mail provider, and it must not disturb the `send` subdomain records.

## Email

One Resend account sends all mail, using a single `RESEND_API_KEY`.

**Resend account:** the `nexgenstudio.io` team. `builtbykiefer.com` was
transferred to this team on 2026-07-26 and verified. An earlier Resend account
(owned by a `bears.unco.edu` address) previously held the domain; it no longer
does, and any API key issued by that older account cannot send from this domain.

Two flows use it:

### 1. Website quote requests

`src/app/api/quote-request/route.ts` posts to the Resend API.

```
customer submits form
  → POST /api/quote-request
  → Resend  from CONTACT_EMAIL_FROM  to CONTACT_EMAIL_TO
  → info@kbuiltco.com
```

`reply_to` is set to the customer's address, so replying from the inbox reaches
them directly. If Resend rejects the send, the route returns **502** and the
customer sees an error — the submission is not silently swallowed, but it is
also not stored anywhere, so a failed send is a lost lead.

### 2. Land purchase lead alerts

A local script, not part of the deployed site. It emails a daily summary of new
land buyers. See [scripts/land-leads/README.md](../scripts/land-leads/README.md).

## Environment variables

Variables live in **two independent places**. Setting one does not affect the
other, and this is the most common source of "it works locally but not in
production".

| Where | What it powers | How to set |
| --- | --- | --- |
| `.env` in this repo | local dev, the land lead script | edit the file; it is git-ignored |
| Vercel project settings | the live website | Vercel → Settings → Environment Variables |

`.env.example` documents every variable. Copy it to `.env` and fill it in:

```bash
cp .env.example .env
```

Website variables (must exist in **Vercel** for production):

| Variable | Value |
| --- | --- |
| `RESEND_API_KEY` | key from the nexgenstudio.io Resend account |
| `CONTACT_EMAIL_FROM` | `Kiefer Built <quotes@builtbykiefer.com>` |
| `CONTACT_EMAIL_TO` | `info@kbuiltco.com` |

**Vercel does not apply environment changes to existing deployments.** After
changing a variable you must redeploy for it to take effect.

Never commit `.env`. It is covered by `.gitignore`, and the repository is public.

## Runbook

**Ship a change**

```bash
git push origin main
```

Vercel builds and deploys. Watch it in the Vercel dashboard; a failed build
leaves the previous deployment serving, so the site does not go down.

**Roll back** — Vercel dashboard → Deployments → pick a known-good one →
Promote to Production. Faster and safer than a git revert.

**Rotate the Resend key** — create a new key in Resend, update it in both
`.env` and Vercel, redeploy, then delete the old key.

**Check whether email is actually working**

```bash
npm run leads -- --test-email     # exercises the Resend key end to end
```

For the website path specifically, submit the real quote form on the live site
and confirm arrival at `info@kbuiltco.com`.

**Verify DNS from the command line**

```bash
dig +short A builtbykiefer.com
dig +short TXT builtbykiefer.com                       # Resend verification
dig +short TXT resend._domainkey.builtbykiefer.com     # DKIM
dig +short TXT send.builtbykiefer.com                  # SPF
```

Query `@ns77.domaincontrol.com` instead to read GoDaddy's authoritative answer
and bypass resolver caching.

## Known constraints

- **A failed quote send is an unrecoverable lead.** Nothing persists the
  submission, so if Resend is misconfigured the enquiry is gone. Worth testing
  the form after any email or DNS change, and especially before any campaign
  that drives traffic to it.
- **Mail to `@builtbykiefer.com` bounces.** There is no inbox on the domain.
- **Two Resend accounts existed.** Only the `nexgenstudio.io` team owns the
  domain now. A key from the old account will fail with a 403 that reads like a
  domain problem rather than an account problem.
- **The apex is a redirect, not the origin.** Always link to the `www` form.
