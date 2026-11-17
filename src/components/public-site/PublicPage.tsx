import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import ProjectReveal from "@/components/public-site/ProjectReveal";
import Footer from "@/components/Footer";
import WallComparison from "@/components/wall-comparison/WallComparison";
import type { PublicCard, PublicPageContent, PublicSection, TestimonialSummary } from "@/lib/public-site/content";
import {
  educationSources,
  SOURCES_DISCLAIMER,
  type EducationSource,
} from "@/lib/public-site/sources";

const educationSourceById = new Map(educationSources.map((source) => [source.id, source]));

type CitationContext = {
  localNumbers: Map<number, number>;
  sources: EducationSource[];
};

function buildCitationContext(content: PublicPageContent): CitationContext {
  const citedIds: number[] = [];
  const seen = new Set<number>();
  const addSource = (sourceId?: number) => {
    if (sourceId === undefined || seen.has(sourceId) || !educationSourceById.has(sourceId)) {
      return;
    }

    seen.add(sourceId);
    citedIds.push(sourceId);
  };

  content.proof?.forEach((proof) => addSource(proof.sourceId));
  content.sections?.forEach((section) => {
    section.sourceIds?.forEach(addSource);
    section.comparison?.rows.forEach((row) => addSource(row.sourceId));
  });

  const sources = citedIds.map((sourceId) => educationSourceById.get(sourceId) as EducationSource);
  const localNumbers = new Map(sources.map((source, index) => [source.id, index + 1]));

  return { localNumbers, sources };
}

function CitationMarkers({
  sourceIds,
  localNumbers,
  dark = false,
}: {
  sourceIds: number[];
  localNumbers: Map<number, number>;
  dark?: boolean;
}) {
  const markers = [...new Set(sourceIds)].flatMap((sourceId) => {
    const localNumber = localNumbers.get(sourceId);
    return localNumber === undefined ? [] : [{ sourceId, localNumber }];
  });

  if (markers.length === 0) {
    return null;
  }

  return (
    <sup
      className={`ml-1 inline-flex gap-0.5 align-super text-[0.65em] font-bold leading-none ${
        dark ? "text-[#ff7167]" : "text-[#c9281c]"
      }`}
    >
      {markers.map(({ sourceId, localNumber }, index) => (
        <span key={sourceId}>
          {index > 0 ? <span aria-hidden="true">,</span> : null}
          <a
            href={`#source-${localNumber}`}
            aria-label={`Source ${localNumber}`}
            className="underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
          >
            {localNumber}
          </a>
        </span>
      ))}
    </sup>
  );
}

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
  imageSizes = "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
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
            alt={card.imageAlt ?? ""}
            fill
            sizes={card.imageSizes ?? imageSizes}
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

  const linkLabel = card.meta ? `${card.title} — ${card.meta}` : card.title;

  if (isExternal(card.href)) {
    return (
      <a href={card.href} aria-label={linkLabel} target="_blank" rel="noopener noreferrer" className="block h-full">
        {body}
      </a>
    );
  }

  return (
    <Link href={card.href} aria-label={linkLabel} className="block h-full">
      {body}
    </Link>
  );
}

function ComparisonTable({
  comparison,
  localNumbers,
  dark,
}: {
  comparison: NonNullable<PublicSection["comparison"]>;
  localNumbers: Map<number, number>;
  dark: boolean;
}) {
  return (
    <div className="mt-9">
      <p className={`mb-3 text-xs font-bold uppercase tracking-[0.14em] md:hidden ${dark ? "text-white/62" : "text-[#655c52]"}`}>
        Swipe to compare <span aria-hidden="true">→</span>
      </p>
      <div
        role="region"
        aria-label="Scrollable construction comparison"
        tabIndex={0}
        className={`w-full max-w-full overflow-x-auto rounded-md border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9281c] ${
          dark ? "border-white/15" : "border-black/10"
        }`}
      >
        <table className="w-full min-w-[680px] border-collapse text-left">
          <caption className="sr-only">{comparison.columns[0]} compared with {comparison.columns[1]}</caption>
          <thead>
            <tr className={dark ? "bg-white/8" : "bg-[#eee8df]"}>
              <th scope="col" className="px-5 py-4 text-xs font-bold uppercase tracking-[0.14em]">
                Measure
              </th>
              <th scope="col" className="px-5 py-4 text-xs font-bold uppercase tracking-[0.14em]">
                {comparison.columns[0]}
              </th>
              <th
                scope="col"
                className="bg-[#c9281c] px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white"
              >
                {comparison.columns[1]}
              </th>
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row) => (
              <tr key={row.label} className={dark ? "border-t border-white/12" : "border-t border-black/10"}>
                <th scope="row" className="px-5 py-4 text-sm font-bold">
                  {row.label}
                </th>
                <td className={`px-5 py-4 text-sm ${dark ? "text-white/68" : "text-[#655c52]"}`}>
                  {row.standard}
                </td>
                <td
                  className={`px-5 py-4 text-sm font-bold ${
                    dark ? "bg-[#c9281c]/15 text-white" : "bg-[#f8e9e6] text-[#8f1c14]"
                  }`}
                >
                  {row.kiefer}
                  {row.sourceId ? (
                    <CitationMarkers sourceIds={[row.sourceId]} localNumbers={localNumbers} dark={dark} />
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SplitSection({
  section,
  localNumbers,
}: {
  section: PublicSection;
  localNumbers: Map<number, number>;
}) {
  const dark = section.dark ?? false;

  if (section.feature === "wall-comparison") {
    return (
      <section
        id={section.id}
        className={`scroll-mt-24 px-6 py-20 md:py-24 ${dark ? "bg-[#232323] text-white" : "bg-white text-[#171717]"}`}
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold leading-tight md:text-5xl">{section.title}</h2>
          <div className="mt-10">
            <WallComparison variant="full" localSourceNumbers={localNumbers} tone={dark ? "dark" : "light"} />
          </div>
          {section.comparison ? (
            <div className="mt-12 min-w-0">
              <ComparisonTable comparison={section.comparison} localNumbers={localNumbers} dark={dark} />
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section
      id={section.id}
      className={`scroll-mt-24 px-6 py-20 md:py-24 ${dark ? "bg-[#232323] text-white" : "bg-white text-[#171717]"}`}
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        {section.image ? (
          <div className="relative min-h-[360px] overflow-hidden rounded-md bg-[#151515]">
            <Image
              src={section.image}
              alt={section.imageAlt ?? ""}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className={section.image ? "min-w-0" : "min-w-0 lg:col-span-2"}>
          <h2 className="text-3xl font-bold leading-tight md:text-5xl">{section.title}</h2>
          {section.body ? (
            <p className={`mt-5 max-w-3xl text-lg leading-8 ${dark ? "text-white/72" : "text-[#655c52]"}`}>
              {section.body}
              {section.sourceIds ? (
                <CitationMarkers sourceIds={section.sourceIds} localNumbers={localNumbers} dark={dark} />
              ) : null}
            </p>
          ) : null}
          {section.points ? (
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {section.points.map((point) => (
                <p
                  key={point}
                  className={`border-l-2 border-[#c9281c] pl-4 text-sm font-bold uppercase tracking-[0.12em] ${
                    dark ? "text-white/82" : "text-[#171717]"
                  }`}
                >
                  {point}
                </p>
              ))}
            </div>
          ) : null}
        </div>
        {section.comparison ? (
          <div className="min-w-0 lg:col-span-2">
            <ComparisonTable comparison={section.comparison} localNumbers={localNumbers} dark={dark} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function GuideDownloadBand({ download }: { download: NonNullable<PublicPageContent["guideDownload"]> }) {
  return (
    <section className="border-y border-black/10 bg-[#e9e1d5] px-6 py-12 text-[#171717] md:py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a91f16]">Free homeowner resource</p>
          <h2 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">The Kiefer Built Homeowner Guide</h2>
          {download.note ? <p className="mt-3 max-w-3xl text-base leading-7 text-[#655c52]">{download.note}</p> : null}
        </div>
        <a
          href={download.href}
          download
          className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#c9281c] px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#a91f16]"
        >
          {download.label}
        </a>
      </div>
    </section>
  );
}

function SourcesSection({ sources }: { sources: EducationSource[] }) {
  return (
    <section className="bg-[#f9f6f0] px-6 py-20 text-[#171717] md:py-24" aria-labelledby="sources-heading">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c9281c]">Research behind the page</p>
        <h2 id="sources-heading" className="mt-3 text-3xl font-bold leading-tight md:text-5xl">
          Sources &amp; Citations
        </h2>
        <ol className="mt-10 list-decimal space-y-6 pl-6 marker:font-bold marker:text-[#c9281c]">
          {sources.map((source, index) => {
            const localNumber = index + 1;
            return (
              <li id={`source-${localNumber}`} key={source.id} className="scroll-mt-28 pl-2 text-base leading-7 text-[#514a43]">
                {!source.independent ? (
                  <span className="mb-2 mr-3 inline-flex rounded-full bg-[#f0d6d2] px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#8f1c14]">
                    Industry testing data
                  </span>
                ) : null}
                <cite className="not-italic">{source.citation}</cite>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                  {source.links.map((link) => (
                    <a key={link.url} href={link.url} className="underline decoration-current/60 underline-offset-4 hover:text-[#8f1c14]">
                      {link.label}
                    </a>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-10 border-t border-black/10 pt-6 text-sm italic leading-6 text-[#655c52]">
          {SOURCES_DISCLAIMER}
        </p>
      </div>
    </section>
  );
}

function hasGuideDownloadAsset(href: string) {
  if (!href.startsWith("/guides/") || !href.endsWith(".pdf")) {
    return false;
  }

  return existsSync(join(process.cwd(), "public", href.slice(1)));
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

export default function PublicPage({ content, children }: { content: PublicPageContent; children?: ReactNode }) {
  const citationContext = buildCitationContext(content);
  const usesFourColumnCards = content.cardsLayout === "fourColumn";
  const cardGridClass =
    usesFourColumnCards ? "grid gap-5 md:grid-cols-2 xl:grid-cols-4" : "grid gap-5 md:grid-cols-2 lg:grid-cols-3";
  const cardImageAspect = usesFourColumnCards ? "aspect-[4/5]" : undefined;
  const cardImageSizes = usesFourColumnCards ? "(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw" : undefined;

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
            sizes="(max-width: 767px) max(100vw, 150vh), 100vw"
            className="object-cover"
          />
          {content.projectShowcase ? (
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06)_20%,rgba(0,0,0,0.12)_48%,rgba(0,0,0,0.84)_100%)]" />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-black/84 via-black/56 to-black/18" />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#151515] to-transparent" />
            </>
          )}
          <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-end px-6 pb-12 pt-28">
            <div className="max-w-4xl">
              <h1 className="text-5xl font-bold leading-[0.96] text-white md:text-7xl">{content.title}</h1>
              <p className={`mt-6 max-w-3xl text-lg leading-8 ${content.projectShowcase ? "text-white/95 [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]" : "text-white/80"}`}>{content.description}</p>
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
                    <p className="text-3xl font-bold">
                      {point.value}
                      {point.sourceId ? (
                        <CitationMarkers
                          sourceIds={[point.sourceId]}
                          localNumbers={citationContext.localNumbers}
                          dark
                        />
                      ) : null}
                    </p>
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
          <section
            id={content.projectShowcase ? "project-tours" : undefined}
            aria-labelledby={content.projectShowcase ? "project-tours-heading" : undefined}
            className={content.projectShowcase ? "relative z-10 -mt-5 scroll-mt-24 rounded-t-[1.75rem] bg-[#f9f6f0] px-6 pb-20 pt-14 md:-mt-7 md:rounded-t-[2.5rem] md:pb-24 md:pt-20" : "bg-[#f9f6f0] px-6 py-20 md:py-24"}
          >
            <ProjectReveal enabled={Boolean(content.projectShowcase)}>
              {content.projectShowcase ? (
                <div data-project-reveal className="mb-10 border-b border-black/15 pb-8 md:mb-12 md:flex md:items-end md:justify-between md:gap-8">
                  <div>
                    <div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#a91f16]">
                      <span aria-hidden="true" className="h-px w-10 bg-[#c9281c]" />
                      Built in Northern Colorado
                    </div>
                    <h2 id="project-tours-heading" className="text-4xl font-bold tracking-tight md:text-5xl">Explore our homes.</h2>
                    <p className="mt-4 max-w-xl text-base leading-7 text-[#655c52]">Step inside each project. See the spaces, finishes and details that make every home its own.</p>
                  </div>
                  <p className="mt-6 shrink-0 text-xs font-bold uppercase tracking-[0.18em] text-[#655c52] md:mt-0">{String(content.cards.length).padStart(2, "0")} home tours</p>
                </div>
              ) : null}
              <div className={cardGridClass}>
                {content.cards.map((card) => content.projectShowcase ? (
                  <div key={card.title} data-project-reveal className="h-full">
                    <Card card={card} imageAspect={cardImageAspect} imageSizes={cardImageSizes} />
                  </div>
                ) : (
                  <Card key={card.title} card={card} imageAspect={cardImageAspect} imageSizes={cardImageSizes} />
                ))}
              </div>
            </ProjectReveal>
          </section>
        ) : null}

        {content.sections?.map((section) => (
          <SplitSection key={section.title} section={section} localNumbers={citationContext.localNumbers} />
        ))}

        {content.testimonials ? <Testimonials testimonials={content.testimonials} /> : null}

        {content.guideDownload && hasGuideDownloadAsset(content.guideDownload.href) ? (
          <GuideDownloadBand download={content.guideDownload} />
        ) : null}

        {citationContext.sources.length > 0 ? <SourcesSection sources={citationContext.sources} /> : null}

        {children}

        <section className="bg-[#151515] px-6 py-16 text-white md:py-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">{content.closingCta?.title ?? "Ready to talk through a project?"}</h2>
              <p className="mt-3 max-w-2xl text-white/66">
                {content.closingCta?.body ?? "Share the project type, location, timeline, and finish level you have in mind. Kiefer Built can help determine fit before planning gets too far ahead."}
              </p>
            </div>
            <ActionLink href={content.closingCta?.href ?? "/#contact"}>{content.closingCta?.label ?? "Start A Project"}</ActionLink>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
