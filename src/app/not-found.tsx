import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: { absolute: "Page not found | Kiefer Built Contracting" },
  description: "The page you’re looking for may have moved or is no longer available. Find Kiefer Built projects, services or contact information.",
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

const recoveryLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/#contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <div className="bg-[#f9f6f0] text-[#171717]">
      <Header />
      <main id="main-content">
        <section className="min-h-[65svh] px-6 pb-20 pt-36 md:pb-28 md:pt-44">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#c9281c]">404 · Kiefer Built Contracting</p>
            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">Page not found</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#655c52]">
              The page you’re looking for may have moved or is no longer available.
            </p>
            <nav aria-label="Find your next page" className="mt-8 flex flex-wrap gap-3">
              {recoveryLinks.map(({ href, label }, index) => (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9281c] ${
                    index === 0
                      ? "bg-[#c9281c] text-white hover:bg-[#a91f16]"
                      : "border border-[#655c52]/40 text-[#171717] hover:bg-[#171717] hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
