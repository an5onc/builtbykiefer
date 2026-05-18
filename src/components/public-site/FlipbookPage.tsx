import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { flipbookPages } from "@/lib/public-site/content";

export default function FlipbookPage() {
  return (
    <div className="bg-[#111] text-white">
      <Header />
      <main id="main-content">
        <section className="px-6 pb-14 pt-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <h1 className="text-5xl font-bold leading-[0.96] md:text-7xl">
                  Kiefer Built Project Lookbook
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
                  A professional digital flipbook for clients who want to understand the range of Kiefer Built work before starting a conversation.
                </p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-6">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ff5b4e]">Inside the lookbook</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {["Custom homes", "SIP/EPS builds", "Commercial spaces", "Renovations", "Finish details", "Process"].map((item) => (
                    <p key={item} className="border-l border-[#c9281c] pl-3 text-sm text-white/76">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden px-6 pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex gap-5 overflow-x-auto pb-6 [scroll-snap-type:x_mandatory]">
              {flipbookPages.map((page, index) => (
                <article
                  key={page.title}
                  className="relative min-h-[560px] w-[82vw] shrink-0 overflow-hidden rounded-md border border-white/10 bg-[#1b1b1b] shadow-2xl [scroll-snap-align:start] md:w-[520px]"
                >
                  <Image
                    src={page.image}
                    alt={`${page.title} by Kiefer Built Contracting`}
                    fill
                    sizes="(max-width: 768px) 82vw, 520px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/34 to-black/8" />
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ff5b4e]">
                      Page {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2 className="mt-3 text-4xl font-bold leading-tight">{page.title}</h2>
                    <p className="mt-3 text-base leading-7 text-white/74">{page.subtitle}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#151515] px-6 py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Use the lookbook to start a better project conversation.</h2>
              <p className="mt-3 max-w-2xl text-white/66">
                Share what looks closest to your goals, then Kiefer Built can help translate the idea into scope, budget, and next steps.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-md border border-white/25 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:border-white hover:bg-white/10"
              >
                View Gallery
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-md bg-[#c9281c] px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#a91f16]"
              >
                Start A Project
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
