"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type NavLink = {
  label: string;
  href: string;
  items?: Array<{
    label: string;
    href: string;
  }>;
};

const navLinks: NavLink[] = [
  {
    label: "About",
    href: "/about",
    items: [
      { label: "Our Story", href: "/about" },
      { label: "Our Team", href: "/about/team" },
      { label: "Accolades", href: "/about/accolades" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    label: "Service",
    href: "/services",
    items: [
      { label: "Our Services", href: "/services" },
      { label: "Our Products", href: "/products" },
      { label: "Our Process", href: "/process" },
      { label: "Home Builds", href: "/services/home-building" },
      { label: "EPS Homes", href: "https://epsbuildings.com/" },
    ],
  },
  {
    label: "Our Work",
    href: "/projects",
    items: [
      { label: "Gallery", href: "/projects" },
      { label: "Flipbook", href: "/flipbook" },
      { label: "New Builds", href: "/projects/new-builds" },
      { label: "Commercial", href: "/projects/commercial" },
      { label: "Renovations & Additions", href: "/projects/renovations-additions" },
      { label: "Testimonials", href: "/testimonials" },
    ],
  },
  { label: "Careers", href: "/careers" },
  {
    label: "Contact Us",
    href: "/contact",
    items: [
      { label: "Contact", href: "/contact" },
      { label: "Vendors", href: "/vendors" },
    ],
  },
  { label: "Client Portal", href: "/portal" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const anchorPrefix = pathname === "/" ? "" : "/";
  const isExternal = (href: string) => href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
  const resolveHref = (href: string) => {
    if (href.startsWith("#")) {
      return `${anchorPrefix}${href}`;
    }

    return href;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:bg-[#c9281c] focus:text-white focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#151515]/96 shadow-lg backdrop-blur-md"
            : "bg-black/20 backdrop-blur-[2px]"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4">
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
              <Image
                src="/images/kiefer-k-logo.png"
                alt="Kiefer Built Contracting"
                fill
                priority
                sizes="56px"
                className="object-contain"
              />
            </span>
            <span className="flex flex-col">
              <span
                className={`text-xl font-bold tracking-wider transition-colors ${
                  scrolled ? "text-white" : "text-white"
                }`}
              >
                KIEFER BUILT CONTRACTING
              </span>
              <span
                className={`text-[10px] tracking-[0.3em] uppercase transition-colors ${
                  scrolled ? "text-white/55" : "text-white/70"
                }`}
              >
                Custom Homes &middot; Northern Colorado
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-4 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.items && setOpenMenu(link.label)}
                onMouseLeave={() => link.items && setOpenMenu(null)}
              >
                {link.items ? (
                  <button
                    type="button"
                    onClick={() => setOpenMenu((current) => (current === link.label ? null : link.label))}
                    className={`flex items-center gap-1 py-3 text-xs font-medium uppercase tracking-[0.12em] transition-colors hover:text-[#c9281c] ${
                      scrolled ? "text-white/80" : "text-white/90"
                    }`}
                    aria-expanded={openMenu === link.label}
                  >
                    {link.label}
                    <ChevronDown className={`size-3.5 transition-transform ${openMenu === link.label ? "rotate-180" : ""}`} />
                  </button>
                ) : (
                  <a
                    href={resolveHref(link.href)}
                    target={isExternal(link.href) ? "_blank" : undefined}
                    rel={isExternal(link.href) ? "noopener noreferrer" : undefined}
                    className={`flex items-center gap-1 py-3 text-xs font-medium uppercase tracking-[0.12em] transition-colors hover:text-[#c9281c] ${
                      scrolled ? "text-white/80" : "text-white/90"
                    }`}
                  >
                    {link.label}
                  </a>
                )}
                {link.items && openMenu === link.label ? (
                  <div className="absolute left-1/2 top-full min-w-56 -translate-x-1/2 border border-black/10 bg-white py-2 opacity-100 shadow-xl transition">
                    {link.items.map((item) => (
                      <a
                        key={item.label}
                        href={resolveHref(item.href)}
                        target={isExternal(item.href) ? "_blank" : undefined}
                        rel={isExternal(item.href) ? "noopener noreferrer" : undefined}
                        onClick={() => setOpenMenu(null)}
                        className="block border-b border-black/10 px-5 py-3 text-center text-sm font-medium uppercase tracking-[0.08em] text-[#171717] transition last:border-b-0 hover:bg-[#f4efe7] hover:text-[#c9281c]"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span
                className={`block h-0.5 bg-current transition-all ${
                  mobileOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-current transition-all ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-current transition-all ${
                  mobileOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-[#151515]/98"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex max-h-[72vh] w-full max-w-sm flex-col gap-5 overflow-y-auto px-8">
              {navLinks.map((link) => (
                <div key={link.label} className="text-center">
                  <a
                    href={resolveHref(link.href)}
                    target={isExternal(link.href) ? "_blank" : undefined}
                    rel={isExternal(link.href) ? "noopener noreferrer" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className="text-2xl uppercase tracking-wider text-white transition-colors hover:text-[#c9281c]"
                  >
                    {link.label}
                  </a>
                  {link.items ? (
                    <div className="mt-3 flex flex-col gap-2">
                      {link.items.map((item) => (
                        <a
                          key={item.label}
                          href={resolveHref(item.href)}
                          target={isExternal(item.href) ? "_blank" : undefined}
                          rel={isExternal(item.href) ? "noopener noreferrer" : undefined}
                          onClick={() => setMobileOpen(false)}
                          className="text-sm uppercase tracking-[0.16em] text-white/55 transition-colors hover:text-[#c9281c]"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
