"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  renovationShowcaseCategories,
  renovationShowcaseCta,
  renovationShowcaseExternalIcon,
  type RenovationShowcaseCategory,
} from "@/lib/public-site/renovations-showcase";

const ExternalIcon = renovationShowcaseExternalIcon;

function scrollGallery(id: string, direction: "previous" | "next") {
  const gallery = document.getElementById(`${id}-gallery`);

  if (!gallery) {
    return;
  }

  const distance = Math.max(gallery.clientWidth * 0.72, 280);
  gallery.scrollBy({
    left: direction === "next" ? distance : -distance,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  });
}

function CategoryRail({
  activeId,
  categories,
}: {
  activeId: RenovationShowcaseCategory["id"];
  categories: RenovationShowcaseCategory[];
}) {
  return (
    <nav className="sticky top-20 z-30 border-y border-black/10 bg-[#f9f6f0]/92 px-4 py-3 backdrop-blur-md" aria-label="Renovation categories">
      <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeId === category.id;

          return (
            <a
              key={category.id}
              href={`#${category.id}`}
              className={`flex min-w-[190px] items-center gap-3 rounded-md border px-4 py-3 text-left transition ${
                isActive
                  ? "border-[#c9281c] bg-white text-[#171717] shadow-sm"
                  : "border-black/10 bg-white/70 text-[#655c52] hover:border-[#c9281c]/40 hover:text-[#171717]"
              }`}
            >
              <Icon className={`size-5 shrink-0 ${isActive ? "text-[#c9281c]" : "text-[#8a8178]"}`} />
              <span>
                <span className="block text-sm font-bold uppercase tracking-[0.12em]">{category.shortLabel}</span>
                <span className="mt-1 block text-xs leading-4">{category.gallery.length} project views</span>
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

function CategoryCards({ categories }: { categories: RenovationShowcaseCategory[] }) {
  return (
    <section className="bg-[#f9f6f0] px-6 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="group flex min-h-[360px] flex-col overflow-hidden rounded-md border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#151515]">
                  <Image
                    src={category.heroImage}
                    alt={`${category.title} by Kiefer Built Contracting`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 20vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 flex size-10 items-center justify-center rounded-md bg-white/92 text-[#c9281c]">
                    <Icon className="size-5" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-2xl font-bold leading-tight text-[#171717]">{category.title}</h2>
                  <p className="mt-3 text-base leading-7 text-[#655c52]">{category.summary}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold uppercase tracking-[0.12em] text-[#c9281c]">
                    Explore
                    <ExternalIcon className="size-4" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ShowcaseSection({ category, index }: { category: RenovationShowcaseCategory; index: number }) {
  const Icon = category.icon;
  const isDark = index % 2 === 1;

  return (
    <section
      id={category.id}
      className={`scroll-mt-36 overflow-hidden px-6 py-20 md:py-24 ${isDark ? "bg-[#232323] text-white" : "bg-white text-[#171717]"}`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <div className={`flex size-12 items-center justify-center rounded-md ${isDark ? "bg-white/10 text-[#ff6b5c]" : "bg-[#f9f6f0] text-[#c9281c]"}`}>
              <Icon className="size-6" />
            </div>
            <p className={`mt-6 text-sm font-bold uppercase tracking-[0.18em] ${isDark ? "text-[#ff6b5c]" : "text-[#c9281c]"}`}>
              {String(index + 1).padStart(2, "0")} / Renovations
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">{category.title}</h2>
            <p className={`mt-5 max-w-2xl text-lg leading-8 ${isDark ? "text-white/72" : "text-[#655c52]"}`}>
              {category.body}
            </p>
            <div className="mt-7 grid gap-3">
              {category.proofPoints.map((point) => (
                <p
                  key={point}
                  className={`border-l-2 border-[#c9281c] pl-4 text-sm font-bold uppercase tracking-[0.12em] ${
                    isDark ? "text-white/82" : "text-[#171717]"
                  }`}
                >
                  {point}
                </p>
              ))}
            </div>
            {category.cta ? (
              <Link
                href={category.cta.href}
                className={`mt-8 inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] transition ${
                  isDark ? "bg-white text-[#171717] hover:bg-white/86" : "bg-[#171717] text-white hover:bg-[#333]"
                }`}
              >
                {category.cta.label}
                <ExternalIcon className="size-4" />
              </Link>
            ) : null}
          </div>

          <div className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className={`text-sm font-semibold ${isDark ? "text-white/62" : "text-[#655c52]"}`}>
                Swipe or use the controls to browse project views.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => scrollGallery(category.id, "previous")}
                  className={`flex size-10 items-center justify-center rounded-full border transition ${
                    isDark ? "border-white/20 text-white hover:bg-white/10" : "border-black/10 text-[#171717] hover:bg-[#f9f6f0]"
                  }`}
                  aria-label={`Previous ${category.title} image`}
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollGallery(category.id, "next")}
                  className={`flex size-10 items-center justify-center rounded-full border transition ${
                    isDark ? "border-white/20 text-white hover:bg-white/10" : "border-black/10 text-[#171717] hover:bg-[#f9f6f0]"
                  }`}
                  aria-label={`Next ${category.title} image`}
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>
            <div
              id={`${category.id}-gallery`}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {category.gallery.map((item, imageIndex) => (
                <article
                  key={item.src}
                  className={`group relative min-h-[460px] w-[82vw] max-w-[620px] shrink-0 snap-start overflow-hidden rounded-md bg-[#151515] shadow-sm ring-1 ${
                    isDark ? "ring-white/12" : "ring-black/10"
                  } md:w-[54vw] lg:w-[34vw]`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 82vw, (max-width: 1024px) 54vw, 34vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                    priority={index === 0 && imageIndex === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/16 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/58">
                      {String(imageIndex + 1).padStart(2, "0")} / {String(category.gallery.length).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 text-2xl font-bold">{item.label}</h3>
                    <p className="mt-2 max-w-md text-sm leading-6 text-white/76">{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function RenovationsShowcasePage() {
  const categories = useMemo(() => renovationShowcaseCategories, []);
  const [activeId, setActiveId] = useState<RenovationShowcaseCategory["id"]>(categories[0].id);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveId(visibleEntry.target.id as RenovationShowcaseCategory["id"]);
        }
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: [0.18, 0.32, 0.5] },
    );

    for (const category of categories) {
      const section = document.getElementById(category.id);
      if (section) {
        observerRef.current.observe(section);
      }
    }

    return () => observerRef.current?.disconnect();
  }, [categories]);

  return (
    <div className="bg-white text-[#171717]">
      <Header />
      <main id="main-content">
        <section className="relative min-h-[82vh] overflow-hidden bg-[#151515] text-white">
          <Image
            src="/images/project-1/kitchen-8.jpg"
            alt="Renovated kitchen by Kiefer Built Contracting"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/62 to-black/18" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#151515] to-transparent" />
          <div className="relative z-10 mx-auto flex min-h-[82vh] max-w-7xl flex-col justify-end px-6 pb-12 pt-28">
            <div className="max-w-4xl">
              <h1 className="text-5xl font-bold leading-[0.96] md:text-7xl">Renovations and Additions</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
                Explore kitchens, bathrooms, living spaces, exteriors, and specialty upgrades through real Kiefer Built project photography. Each category below opens into a focused showcase with details from work built over the years.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={renovationShowcaseCta.href}
                  className="inline-flex items-center gap-2 rounded-md bg-[#c9281c] px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#a91f16]"
                >
                  {renovationShowcaseCta.label}
                  <ExternalIcon className="size-4" />
                </Link>
                <a
                  href="#kitchens"
                  className="inline-flex items-center justify-center rounded-md border border-white/30 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:border-white hover:bg-white/10"
                >
                  Explore Categories
                </a>
              </div>
            </div>
          </div>
        </section>

        <CategoryCards categories={categories} />
        <CategoryRail activeId={activeId} categories={categories} />

        {categories.map((category, index) => (
          <ShowcaseSection key={category.id} category={category} index={index} />
        ))}

        <section className="bg-[#151515] px-6 py-16 text-white md:py-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Ready to shape the next version of your home?</h2>
              <p className="mt-3 max-w-2xl text-white/66">
                Share the room, scope, timeline, and finish level you have in mind. Kiefer Built can help identify the right path before planning gets too far ahead.
              </p>
            </div>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-md bg-[#c9281c] px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#a91f16]"
            >
              Start A Project
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
