# Kiefer Built CRM Deployment Checklist

Use this checklist when moving the local CRM from `localhost:3000` to a hosted Kiefer review or production environment.

## Current Hosting Facts

- `builtbykiefer.com` and `www.builtbykiefer.com` are served by Vercel.
- The public production site currently returns `404` for `/admin` and `/vendor/login`, so the CRM routes have not been deployed to production yet.
- `admin.builtbykiefer.com` does not currently resolve in DNS.
- The repo README says Vercel auto-deploys from `main`, but the active CRM work is on `codex/protected-backend-foundation` with local uncommitted changes.

## Required Vercel Environment Variables

Set these in Vercel before deploying the CRM routes:

```env
NEXT_PUBLIC_SUPABASE_URL=https://yediihmkophbyknshmqw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<production anon key>
NEXT_PUBLIC_DEMO_MODE=false
ADMIN_EMAIL=<approved admin email>
NEXT_PUBLIC_APP_URL=https://www.builtbykiefer.com
```

Do not expose Supabase service-role keys in `NEXT_PUBLIC_` variables.

## Required Supabase Auth URLs

In Supabase Auth URL settings, allow:

- `https://www.builtbykiefer.com/auth/callback`
- `https://builtbykiefer.com/auth/callback`
- Any Vercel preview URL used for client review.

If using a separate admin subdomain later, also add:

- `https://admin.builtbykiefer.com/auth/callback`

## Database State

The linked Supabase project has the latest CRM migrations applied through:

- `20260515054716_tighten_vendor_submittal_anon_grants`

Before deployment, confirm with:

```bash
supabase migration list --linked
npm run build
```

## Deployment Options

Recommended path for review:

1. Commit the current CRM work on `codex/protected-backend-foundation`.
2. Push the branch to GitHub.
3. Let Vercel create a preview deployment for review.
4. Add the preview callback URL in Supabase Auth.
5. Test `/login`, `/admin`, `/portal`, `/vendor/login`, and `/admin/finance-tools` on the preview URL.

Recommended path for production:

1. Merge the reviewed CRM branch into `main`.
2. Confirm Vercel production environment variables are set.
3. Deploy `main`.
4. Test `https://www.builtbykiefer.com/admin`.
5. Only add `admin.builtbykiefer.com` if Kiefer wants a separate operations subdomain.

## Post-Deploy Smoke Test

- Public site loads.
- `/login` renders the admin login.
- Approved admin can sign in.
- `/admin` command center renders without Supabase fallback errors.
- `/admin/finance-tools` renders all Kiefer Built calculators.
- `/vendor/login` renders vendor login.
- Unauthenticated `/vendor` redirects to `/vendor/login?next=%2Fvendor`.
- Signed-in vendor sees only their own assignments.
- Vendor RFI response submission saves.
- Vendor submittal upload saves metadata and file.
- Admin project page shows the vendor submittal and download link.
