import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { PublicCard, PublicPageContent, PublicSection, TestimonialSummary } from "@/lib/public-site/content";

function isExternal(href: string) {
  return href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
}

function ActionLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  const className =
    variant === "primary"
      ? "inline-flex items-center justify-center rounded-md bg-[#c9281c] px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#a91f16]"
      : "inline-flex items-center justify-center rounded-md border border-white/30 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:border-white hover:bg-white/10";

  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function Card({
  card,
  imageAspect = "aspect-[4/3]",
  imageSizes = "(max-width: 768px) 100vw, 33vw",
}: {
  card: PublicCard;
  imageAspect?: string;
  imageSizes?: string;
}) {
  const body = (
    <article className="group h-full overflow-hidden rounded-md border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {card.image ? (
        <div className={`relative ${imageAspect} overflow-hidden bg-[#151515]`}>
          <Image
            src={card.image}
            alt={`${card.title} by Kiefer Built Contracting`}
            fill
            sizes={imageSizes}
            className="object-cover transition duration-700 group-hover:scale-105"
            style={card.imagePosition ? { objectPosition: card.imagePosition } : undefined}
          />
        </div>
      ) : null}
      <div className="p-6">
        {card.meta ? (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#c9281c]">{card.meta}</p>
        ) : null}
        <h3 className="text-2xl font-bold leading-tight text-[#171717]">{card.title}</h3>
        <p className="mt-3 text-base leading-7 text-[#655c52]">{card.description}</p>
      </div>
    </article>
  );

  if (!card.href) {
    return body;
  }

  if (isExternal(card.href)) {
    return (
      <a href={card.href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {body}
      </a>
    );
  }

  return (
    <Link href={card.href} className="block h-full">
      {body}
    </Link>
  );
}

function SplitSection({ section }: { section: PublicSection }) {
  return (
    <section className={`px-6 py-20 md:py-24 ${section.dark ? "bg-[#232323] text-white" : "bg-white text-[#171717]"}`}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        {section.image ? (
          <div className="relative min-h-[360px] overflow-hidden rounded-md bg-[#151515]">
            <Image
              src={section.image}
              alt={`${section.title} by Kiefer Built Contracting`}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className={section.image ? "" : "lg:col-span-2"}>
          <h2 className="text-3xl font-bold leading-tight md:text-5xl">{section.title}</h2>
          <p className={`mt-5 max-w-3xl text-lg leading-8 ${section.dark ? "text-white/72" : "text-[#655c52]"}`}>
            {section.body}
          </p>
          {section.points ? (
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {section.points.map((point) => (
                <p
                  key={point}
                  className={`border-l-2 border-[#c9281c] pl-4 text-sm font-bold uppercase tracking-[0.12em] ${
                    section.dark ? "text-white/82" : "text-[#171717]"
                  }`}
                >
                  {point}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ testimonials }: { testimonials: TestimonialSummary[] }) {
  return (
    <section className="bg-white px-6 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="max-w-3xl text-3xl font-bold leading-tight text-[#171717] md:text-5xl">
          Client trust is earned in the details.
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="rounded-md border border-black/10 bg-[#f9f6f0] p-6">
              <p className="text-base leading-7 text-[#4d463f]">{testimonial.summary}</p>
              <div className="mt-6 border-t border-black/10 pt-4">
                <p className="font-bold text-[#171717]">{testimonial.name}</p>
                {testimonial.project ? <p className="text-sm text-[#655c52]">{testimonial.project}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PublicPage({ content }: { content: PublicPageContent }) {
  const usesFourColumnCards = content.cardsLayout === "fourColumn";
  const cardGridClass =
    usesFourColumnCards ? "grid gap-5 md:grid-cols-2 xl:grid-cols-4" : "grid gap-5 md:grid-cols-2 lg:grid-cols-3";
  const cardImageAspect = usesFourColumnCards ? "aspect-[4/5]" : undefined;
  const cardImageSizes = usesFourColumnCards ? "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw" : undefined;

  return (
    <div className="bg-white text-[#171717]">
      <Header />
      <main id="main-content">
        <section className="relative min-h-[72vh] overflow-hidden bg-[#151515] text-white">
          <Image
            src={content.heroImage}
            alt={content.heroAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/84 via-black/56 to-black/18" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#151515] to-transparent" />
          <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-end px-6 pb-12 pt-28">
            <div className="max-w-4xl">
              <h1 className="text-5xl font-bold leading-[0.96] text-white md:text-7xl">{content.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">{content.description}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                {content.primaryCta ? <ActionLink href={content.primaryCta.href}>{content.primaryCta.label}</ActionLink> : null}
                {content.secondaryCta ? (
                  <ActionLink href={content.secondaryCta.href} variant="secondary">
                    {content.secondaryCta.label}
                  </ActionLink>
                ) : null}
              </div>
            </div>
            {content.proof ? (
              <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
                {content.proof.map((point) => (
                  <div key={point.label} className="border-l border-white/25 pl-4">
                    <p className="text-3xl font-bold">{point.value}</p>
                    <p className="mt-1 text-sm leading-5 text-white/68">{point.label}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {content.intro ? (
          <section className="bg-[#151515] px-6 pb-20 pt-8 text-white md:pb-24 md:pt-12">
            <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
              <h2 className="text-3xl font-bold leading-tight md:text-5xl">{content.intro.title}</h2>
              <p className="text-lg leading-8 text-white/72">{content.intro.body}</p>
            </div>
          </section>
        ) : null}

        {content.cards ? (
          <section className="bg-[#f9f6f0] px-6 py-20 md:py-24">
            <div className="mx-auto max-w-7xl">
              <div className={cardGridClass}>
                {content.cards.map((card) => (
                  <Card key={card.title} card={card} imageAspect={cardImageAspect} imageSizes={cardImageSizes} />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {content.sections?.map((section) => (
          <SplitSection key={section.title} section={section} />
        ))}

        {content.testimonials ? <Testimonials testimonials={content.testimonials} /> : null}

        <section className="bg-[#151515] px-6 py-16 text-white md:py-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Ready to talk through a project?</h2>
              <p className="mt-3 max-w-2xl text-white/66">
                Share the project type, location, timeline, and finish level you have in mind. Kiefer Built can help determine fit before planning gets too far ahead.
              </p>
            </div>
            <ActionLink href="/#contact">Start A Project</ActionLink>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
