import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  Clock,
  FolderKanban,
  Home,
  LogOut,
  ReceiptText,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { signOut } from "@/app/login/actions";

const navItems = [
  { href: "/admin", label: "Command Center", icon: Home },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/time", label: "Time", icon: Clock },
  { href: "/admin/invoices", label: "Invoices", icon: ReceiptText },
  { href: "/", label: "Public Site", icon: BarChart3 },
];

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
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-black/10 bg-[#151515] px-5 py-6 text-white lg:block">
        <Link href="/admin" className="mb-10 flex items-center gap-3">
          <Image
            src="/images/kiefer-k-logo.png"
            alt="Kiefer Built Contracting"
            width={48}
            height={48}
            className="rounded-md"
          />
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em]">
              Kiefer Built
            </p>
            <p className="text-xs text-white/55">Operations Console</p>
          </div>
        </Link>
        <nav className="space-y-1" aria-label="Admin navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/72 transition hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <form action={signOut} className="absolute inset-x-5 bottom-6">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-white/72 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </form>
      </aside>
      <div className="lg:pl-72">
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
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-md bg-white px-3 py-2 text-xs font-semibold text-[#171717] ring-1 ring-black/10"
              >
                {item.label}
              </Link>
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
    </div>
  );
}
