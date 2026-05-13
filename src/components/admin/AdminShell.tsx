import Image from "next/image";
import Link from "next/link";
import { Bell, LogOut, Plus, Search } from "lucide-react";
import type { ReactNode } from "react";
import { signOut } from "@/app/login/actions";
import AdminModuleNav from "@/components/admin/AdminModuleNav";
import { adminModuleMenus } from "@/lib/admin/navigation";

export default function AdminShell({
  children,
  title,
  eyebrow,
}: {
  children: ReactNode;
  title: string;
  eyebrow?: string;
}) {
  return (
    <div className="min-h-screen bg-[#f4efe7] text-[#171717]">
      <header className="sticky top-0 z-30 hidden border-b border-black/15 bg-[#151515] text-white shadow-sm lg:block">
        <div className="flex h-[58px] items-center gap-4 px-5">
          <Link href="/admin" className="flex items-center pr-2" aria-label="Kiefer Built Command Center">
            <Image
              src="/images/kiefer-k-logo.png"
              alt="Kiefer Built Contracting"
              width={46}
              height={46}
              className="rounded"
            />
          </Link>
          <AdminModuleNav />
          <div className="ml-auto flex items-center gap-3">
            <label className="flex h-9 w-72 items-center gap-2 rounded-md bg-white px-3 text-[#171717] shadow-sm">
              <Search className="size-4 text-[#655c52]" />
              <input
                type="search"
                placeholder="Search jobs, clients, files"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#8a8176]"
              />
            </label>
            <Link
              href="/admin/projects"
              aria-label="Create or open a job"
              className="flex size-9 items-center justify-center rounded-md text-white/78 transition hover:bg-white/10 hover:text-white"
            >
              <Plus className="size-5" />
            </Link>
            <button
              type="button"
              aria-label="Notifications"
              className="flex size-9 items-center justify-center rounded-md text-white/78 transition hover:bg-white/10 hover:text-white"
            >
              <Bell className="size-5" />
            </button>
            <form action={signOut}>
              <button
                type="submit"
                className="flex size-9 items-center justify-center rounded-full bg-[#d52b1e] text-xs font-bold text-white"
                aria-label="Sign out"
              >
                AC
              </button>
            </form>
          </div>
        </div>
      </header>

      <header className="border-b border-black/10 bg-[#f9f6f0]/90 px-5 py-5 backdrop-blur lg:px-8">
        <div className="mb-4 flex items-center gap-3 lg:hidden">
          <Image
            src="/images/kiefer-k-logo.png"
            alt="Kiefer Built Contracting"
            width={40}
            height={40}
            className="rounded-md"
          />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#171717]">
            Kiefer Built Operations
          </span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b92516]">
          {eyebrow ?? "Admin Demo"}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#171717] md:text-3xl">
          {title}
        </h1>
        <nav
          className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden"
          aria-label="Mobile admin navigation"
        >
          {adminModuleMenus.map((menu) => (
            <details key={menu.label} className="shrink-0">
              <summary className="list-none rounded-md bg-white px-3 py-2 text-xs font-semibold text-[#171717] ring-1 ring-black/10 [&::-webkit-details-marker]:hidden">
                {menu.label}
              </summary>
              <div className="mt-2 grid gap-1 rounded-md bg-white p-2 shadow-sm ring-1 ring-black/10">
                {menu.items.map((item) =>
                  item.disabled || !item.href ? (
                    <span
                      key={item.label}
                      className="px-2 py-1.5 text-xs font-semibold text-[#8a8176] opacity-60"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="px-2 py-1.5 text-xs font-semibold"
                    >
                      {item.label}
                    </Link>
                  ),
                )}
              </div>
            </details>
          ))}
          <form action={signOut}>
            <button
              type="submit"
              className="flex h-full shrink-0 items-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-semibold text-[#171717] ring-1 ring-black/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </form>
        </nav>
      </header>
      <main className="px-5 py-6 lg:px-8">{children}</main>
    </div>
  );
}
