import Image from "next/image";
import Link from "next/link";
import PasswordField from "@/app/login/PasswordField";
import { sendClientMagicLink, signInClient } from "./actions";

export default async function ClientPortalLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string; notice?: string }>;
}) {
  const { error, next = "/portal", notice } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#151515] px-6 text-white">
      <section className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl">
        <Link href="/" className="inline-block">
          <Image
            src="/images/kiefer-k-logo.png"
            alt="Kiefer Built Contracting"
            width={92}
            height={92}
            className="mx-auto rounded-md"
          />
        </Link>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#e04a36]">
          Kiefer Built Client Portal
        </p>
        <h1 className="mt-2 text-3xl font-bold">Client Access</h1>
        <p className="mt-4 text-sm leading-6 text-white/65">
          Sign in to view project progress, photos, daily logs, selections, change orders, invoices, and items needing attention.
        </p>
        {error ? (
          <p className="mt-4 rounded-md border border-[#e04a36]/40 bg-[#e04a36]/10 px-4 py-3 text-left text-sm text-[#ffb4a8]">
            {error}
          </p>
        ) : null}
        {notice ? (
          <p className="mt-4 rounded-md border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-left text-sm text-emerald-100">
            {notice}
          </p>
        ) : null}
        <div className="mt-6 space-y-4 text-left">
          <form action={signInClient} className="space-y-4">
            <input type="hidden" name="next" value={next} />
            <label className="block text-sm font-semibold text-white/80">
              Email
              <input
                name="email"
                type="email"
                autoComplete="email"
                className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-3 text-white outline-none transition focus:border-[#e04a36]"
                required
              />
            </label>
            <PasswordField />
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-md bg-[#b92516] px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#951e13]"
            >
              Sign In
            </button>
          </form>
          <form action={sendClientMagicLink} className="space-y-3">
            <label className="block text-sm font-semibold text-white/80">
              Email link
              <input
                name="email"
                type="email"
                autoComplete="email"
                className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-3 text-white outline-none transition focus:border-[#e04a36]"
                required
              />
            </label>
            <input type="hidden" name="next" value={next} />
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-md border border-white/15 px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              Email Me a Client Sign-In Link
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
