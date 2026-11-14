"use client";

import { useState, useEffect, useRef, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { navLinks } from "@/lib/public-site/nav";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobilePath, setMobilePath] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const mobileOpen = mobilePath === pathname;
  const headerRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtons = useRef<Record<string, HTMLButtonElement | null>>({});
  const id = useId();
  const anchorPrefix = pathname === "/" ? "" : "/";
  const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);
  const resolveHref = (href: string) => href.startsWith("#") ? `${anchorPrefix}${href}` : href;
  const closeNavigation = () => { setMobilePath(null); setOpenMenu(null); };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const desktop = window.matchMedia("(min-width: 1280px)");
    const onResize = () => { setMobilePath(null); setOpenMenu(null); };
    desktop.addEventListener("change", onResize);
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      desktop.removeEventListener("change", onResize);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!mobileOpen || !dialog) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = overflow;
    };
  }, [mobileOpen]);

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-[#c9281c] focus:text-white focus:px-4 focus:py-2 focus:rounded">
        Skip to main content
      </a>
      <header ref={headerRef} className={`fixed top-0 left-0 right-0 z-50 bg-[#151515]/95 backdrop-blur-md transition-shadow ${scrolled ? "shadow-lg" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-4" onClick={closeNavigation}>
            <span className="relative flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center">
              <Image src="/images/kiefer-k-logo.png" alt="" fill priority sizes="(max-width: 640px) 40px, 56px" className="object-contain" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-sm sm:text-lg xl:text-xl font-bold leading-5 tracking-wider text-white">KIEFER BUILT CONTRACTING</span>
              <span className="text-[9px] sm:text-[10px] leading-4 tracking-[0.18em] sm:tracking-[0.3em] uppercase text-white/75">Custom Homes &middot; Northern Colorado</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-4 xl:flex" aria-label="Main navigation">
            {navLinks.map((link, index) => (
              <div
                key={link.label}
                className="relative"
                onMouseLeave={(event) => {
                  if (link.children && !event.currentTarget.contains(document.activeElement)) setOpenMenu(null);
                }}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setOpenMenu(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape" && openMenu === link.label) {
                    event.preventDefault();
                    setOpenMenu(null);
                    menuButtons.current[link.label]?.focus();
                  }
                }}
              >
                {link.children ? (
                  <button
                    ref={(button) => { menuButtons.current[link.label] = button; }}
                    type="button"
                    onClick={() => setOpenMenu((current) => current === link.label ? null : link.label)}
                    className="flex items-center gap-1 py-3 text-xs font-medium uppercase tracking-[0.12em] text-white/90 transition-colors hover:text-[#ff6b5c]"
                    aria-expanded={openMenu === link.label}
                    aria-controls={`${id}-submenu-${index}`}
                  >
                    {link.label}<ChevronDown aria-hidden="true" className={`size-3.5 transition-transform ${openMenu === link.label ? "rotate-180" : ""}`} />
                  </button>
                ) : (
                  <a href={resolveHref(link.href)} target={isExternal(link.href) ? "_blank" : undefined} rel={isExternal(link.href) ? "noopener noreferrer" : undefined} onClick={closeNavigation} className="flex items-center gap-1 py-3 text-xs font-medium uppercase tracking-[0.12em] text-white/90 hover:text-[#ff6b5c]">
                    {link.label}
                  </a>
                )}
                {link.children ? (
                  <div id={`${id}-submenu-${index}`} hidden={openMenu !== link.label} className="absolute left-1/2 top-full min-w-56 -translate-x-1/2 border border-black/10 bg-white py-2 shadow-xl">
                    {link.children.map((item) => (
                      <a key={item.label} href={resolveHref(item.href)} target={isExternal(item.href) ? "_blank" : undefined} rel={isExternal(item.href) ? "noopener noreferrer" : undefined} onClick={closeNavigation} className="block border-b border-black/10 px-5 py-3 text-center text-sm font-medium uppercase tracking-[0.08em] text-[#171717] last:border-b-0 hover:bg-[#f4efe7] hover:text-[#c9281c]">
                        {item.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>
          <button type="button" className="xl:hidden shrink-0 text-white p-2" onClick={() => { setOpenMenu(null); setMobilePath(pathname); }} aria-label="Open menu" aria-haspopup="dialog" aria-controls={`${id}-mobile`} aria-expanded={mobileOpen}>
            <Menu className="size-6" aria-hidden="true" />
          </button>
        </div>
      </header>
      <dialog
        ref={dialogRef}
        id={`${id}-mobile`}
        aria-label="Site navigation"
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-[#151515] p-0 text-white backdrop:bg-black/60"
        onCancel={() => setMobilePath(null)}
        onClose={() => setMobilePath(null)}
        onClick={(event) => { if (event.target === event.currentTarget) setMobilePath(null); }}
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/20 px-6 py-4">
          <p className="font-bold tracking-wider">KIEFER BUILT CONTRACTING</p>
          <button type="button" onClick={() => setMobilePath(null)} aria-label="Close menu" className="shrink-0 rounded p-3 text-white"><X aria-hidden="true" className="size-6" /></button>
        </div>
        <nav aria-label="Mobile navigation" className="space-y-6 px-8 py-6">
          {navLinks.map((link) => (
            <div key={link.label}>
              <a href={resolveHref(link.href)} target={isExternal(link.href) ? "_blank" : undefined} rel={isExternal(link.href) ? "noopener noreferrer" : undefined} onClick={closeNavigation} className="inline-block py-2 text-xl uppercase tracking-wider hover:text-[#ff6b5c]">{link.label}</a>
              {link.children ? (
                <div className="mt-1 flex flex-col">
                  {link.children.map((item) => (
                    <a key={item.label} href={resolveHref(item.href)} target={isExternal(item.href) ? "_blank" : undefined} rel={isExternal(item.href) ? "noopener noreferrer" : undefined} onClick={closeNavigation} className="py-2 text-sm uppercase tracking-[0.12em] text-white/80 hover:text-[#ff6b5c]">{item.label}</a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
      </dialog>
      <noscript>
        <nav aria-label="Navigation without JavaScript" className="bg-[#151515] px-6 pb-6 pt-28 text-white">
          <details><summary className="cursor-pointer py-3 font-bold">Browse website</summary>
            {navLinks.map((link) => (
              <div key={link.label} className="py-2">
                <a href={resolveHref(link.href)} className="underline">{link.label}</a>
                {link.children?.map((item) => <a key={item.label} href={resolveHref(item.href)} className="ml-4 inline-block py-2 underline">{item.label}</a>)}
              </div>
            ))}
          </details>
        </nav>
      </noscript>
    </>
  );
}
