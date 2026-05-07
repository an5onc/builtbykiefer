import Image from "next/image";
import Link from "next/link";
import { getAllowedAdminEmail, isDemoMode } from "@/lib/admin/auth";

export default function LoginPage() {
  const demoMode = isDemoMode();
  const adminEmail = getAllowedAdminEmail();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#151515] px-6 text-white">
      <section className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl">
        <Image
          src="/images/kiefer-k-logo.png"
          alt="Kiefer Built Contracting"
          width={92}
          height={92}
          className="mx-auto rounded-md"
        />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#e04a36]">
          Operations Console
        </p>
        <h1 className="mt-2 text-3xl font-bold">Admin Access</h1>
        <p className="mt-4 text-sm leading-6 text-white/65">
          Phase 1 uses real auth-ready structure with demo mode enabled until
          Supabase credentials are connected.
        </p>
        <div className="mt-6 rounded-md bg-black/25 p-4 text-left text-sm text-white/70">
          <p className="font-semibold text-white">Allowed admin</p>
          <p>{adminEmail}</p>
          <p className="mt-3">Demo mode: {demoMode ? "enabled" : "disabled"}</p>
        </div>
        <Link
          href="/admin"
          className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-[#b92516] px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#951e13]"
        >
          Enter Demo Console
        </Link>
      </section>
    </main>
  );
}
