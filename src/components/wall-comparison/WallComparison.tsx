"use client";

import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { educationSources, type EducationSource } from "@/lib/public-site/sources";
import anchors from "./anchors.json";
import WallCloseup from "./WallCloseup";
import WallIllustration from "./WallIllustration";
import { useHydrated } from "./useHydrated";
import {
  closeupTitles,
  illustrationTitles,
  modeLabels,
  viewCaptions,
  wallContent,
  wallModes,
  zoomLabels,
  type MechanismId,
  type SourcedText,
  type VariantContent,
  type WallMode,
  type WallVariant,
  type WallView,
} from "./content";

// The zoom heads for the middle of the back wall; the button sits on the floor.
const ZOOM_ORIGIN = `${anchors.view.zoomTarget.x * 100}% ${anchors.view.zoomTarget.y * 100}%`;
const FLOOR_BUTTON = { left: `${anchors.view.floorButton.x * 100}%`, top: `${anchors.view.floorButton.y * 100}%` };
const ease = [0.65, 0, 0.35, 1] as const;
// A soft ping invites the first click; it stops for visitors who prefer reduced motion.
const ZOOM_CSS = `
.kb-zoom-ping { animation: kb-zoom-ping 2.4s cubic-bezier(0, 0, 0.2, 1) infinite; }
@keyframes kb-zoom-ping { 0% { transform: scale(1); opacity: 0.55; } 70%, 100% { transform: scale(1.9); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .kb-zoom-ping { animation: none; opacity: 0; } }`;

const sourceById = new Map(educationSources.map((source) => [source.id, source]));

type WallComparisonProps = {
  variant: WallVariant;
  defaultMode?: WallMode;
  defaultView?: WallView;
  /** Page-local citation numbers (source ID to the number shown), as the site's PublicPage computes them. */
  localSourceNumbers?: ReadonlyMap<number, number>;
  tone?: "light" | "dark";
};

export default function WallComparison({
  variant,
  defaultMode = "stick",
  defaultView = "house",
  localSourceNumbers,
  tone = "light",
}: WallComparisonProps) {
  const content = wallContent[variant];
  const [mode, setMode] = useState<WallMode>(defaultMode);
  const [view, setView] = useState<WallView>(defaultView);
  const [highlight, setHighlight] = useState<MechanismId | null>(null);
  // The switch stays disabled until hydration so it never disagrees with the wall.
  const hydrated = useHydrated();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const reduce = hydrated && prefersReducedMotion;
  const zoomed = view === "wall";
  const markers = content.mechanisms.map((mechanism) => mechanism.id);

  // After a zoom, move focus to the button that undoes it, but never on first render.
  const zoomInRef = useRef<HTMLButtonElement>(null);
  const zoomOutRef = useRef<HTMLButtonElement>(null);
  const userZoomed = useRef(false);
  useEffect(() => {
    if (!userZoomed.current) return;
    (zoomed ? zoomOutRef : zoomInRef).current?.focus({ preventScroll: true });
  }, [zoomed]);
  const zoomTo = (next: WallView) => {
    userZoomed.current = true;
    setView(next);
  };
  const timed = (transition: Transition): Transition => (reduce ? { duration: 0 } : transition);
  const groupName = useId();
  const dark = tone === "dark";
  const compact = variant === "compact";
  const Heading = compact ? "h2" : "h3";

  const figure = (
    <figure className="min-w-0">
      <div
        data-view={view}
        className={`relative aspect-[8/5] overflow-hidden rounded-md ${
          dark
            ? "bg-[radial-gradient(ellipse_at_50%_45%,#3a3a3a_0%,#262626_60%,#1b1b1b_100%)]"
            : "bg-[radial-gradient(ellipse_at_50%_45%,#ffffff_0%,#f6f2ec_55%,#e8e1d6_100%)] ring-1 ring-black/5"
        }`}
      >
        <style>{ZOOM_CSS}</style>
        {/* The house pushes in toward the back wall and fades as the close-up arrives. */}
        <motion.div
          className="absolute inset-0"
          aria-hidden={zoomed || undefined}
          style={{ transformOrigin: ZOOM_ORIGIN }}
          initial={false}
          animate={zoomed ? { scale: 3.4, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={timed(
            zoomed
              ? { scale: { duration: 1.1, ease }, opacity: { duration: 0.35, delay: 0.7 } }
              : { scale: { duration: 0.9, ease }, opacity: { duration: 0.3 } },
          )}
        >
          <WallIllustration mode={mode} markers={markers} highlight={zoomed ? null : highlight} title={illustrationTitles[mode]} />
        </motion.div>

        <AnimatePresence initial={false}>
          {zoomed ? (
            <motion.div
              key="closeup"
              className="absolute inset-0"
              style={{ transformOrigin: ZOOM_ORIGIN }}
              initial={{ opacity: 0, scale: 0.55 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.55, transition: timed({ duration: 0.35, ease }) }}
              transition={timed({ duration: 0.55, delay: 0.6, ease })}
            >
              <WallCloseup mode={mode} markers={markers} highlight={highlight} title={closeupTitles[mode]} />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {zoomed ? (
          <button
            ref={zoomOutRef}
            type="button"
            onClick={() => zoomTo("house")}
            aria-label={zoomLabels.wall}
            className="absolute left-2 top-2 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#171717]/80 px-4 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_4px_14px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-colors hover:bg-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9281c] md:left-4 md:top-4"
          >
            <span aria-hidden="true">←</span>
            <span aria-hidden="true" className="sm:hidden">Back</span>
            <span aria-hidden="true" className="hidden sm:inline">{zoomLabels.wall}</span>
          </button>
        ) : (
          <button
            ref={zoomInRef}
            type="button"
            disabled={!hydrated}
            onClick={() => zoomTo("wall")}
            aria-label={zoomLabels.house}
            style={FLOOR_BUTTON}
            className="group absolute inline-flex min-h-11 -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white/90 p-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#171717] shadow-[0_6px_20px_rgba(0,0,0,0.25)] ring-1 ring-black/5 backdrop-blur-sm transition-[color,background-color,transform] hover:bg-white hover:text-[#a91f16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9281c] disabled:cursor-default disabled:opacity-0 active:scale-95"
          >
            <span aria-hidden="true" className="relative flex size-8 items-center justify-center rounded-full bg-[#c9281c] text-white transition-colors group-hover:bg-[#a91f16]">
              <span className="kb-zoom-ping absolute inset-0 rounded-full bg-[#c9281c]" />
              <svg viewBox="0 0 20 20" className="relative size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="8.5" cy="8.5" r="5.5" />
                <path d="M12.6 12.6 L17 17" />
                <path d="M8.5 6 V11 M6 8.5 H11" />
              </svg>
            </span>
            <span aria-hidden="true" className="hidden pr-2.5 sm:inline">{zoomLabels.house}</span>
          </button>
        )}
      </div>
      <figcaption className={`mt-3 text-xs font-bold uppercase tracking-[0.14em] ${dark ? "text-white/60" : "text-[#7a6e60]"}`}>
        {viewCaptions[view]}
      </figcaption>
      <fieldset className="mt-4">
        <legend className="sr-only">Wall type</legend>
        <div className={`grid grid-cols-2 gap-1 rounded-full p-1 ${dark ? "bg-white/10" : "bg-[#f0ebe0]"}`}>
          {wallModes.map((option) => (
            <label key={option} className="relative">
              <input
                type="radio"
                name={groupName}
                value={option}
                checked={mode === option}
                disabled={!hydrated}
                onChange={() => setMode(option)}
                className="peer sr-only"
              />
              <span
                className={`flex min-h-11 cursor-pointer items-center justify-center rounded-full px-4 text-center text-sm font-bold uppercase tracking-[0.12em] transition-[color,background-color] peer-checked:bg-[#c9281c] peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-disabled:cursor-default ${
                  // The checked-hover color outranks plain hover, so the selected option stays red.
                  dark
                    ? "text-white/80 hover:bg-white/10 peer-checked:hover:bg-[#a91f16] peer-focus-visible:outline-[#ff6b5c]"
                    : "text-[#514a43] hover:bg-white/70 peer-checked:hover:bg-[#a91f16] peer-focus-visible:outline-[#c9281c]"
                }`}
              >
                {modeLabels[option]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </figure>
  );

  const captions = (
    <ol aria-live="polite" className="space-y-6">
      {content.mechanisms.map((mechanism) => (
        <li
          key={mechanism.id}
          className="flex gap-4"
          onMouseEnter={() => setHighlight(mechanism.id)}
          onMouseLeave={() => setHighlight(null)}
          onFocus={() => setHighlight(mechanism.id)}
          onBlur={() => setHighlight(null)}
        >
          <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#c9281c] text-sm font-bold text-white">
            {mechanism.marker}
          </span>
          <div className="min-w-0">
            <p className={`text-xs font-bold uppercase tracking-[0.16em] ${dark ? "text-[#ff6b5c]" : "text-[#a91f16]"}`}>
              {mechanism.title}
            </p>
            <p className={`mt-2 text-lg leading-8 ${dark ? "text-white/85" : "text-[#3d3630]"}`}>
              {mechanism.states[mode].text}
              <Citations
                sourced={mechanism.states[mode]}
                content={content}
                localSourceNumbers={localSourceNumbers}
                dark={dark}
              />
            </p>
          </div>
        </li>
      ))}
    </ol>
  );

  return (
    <div data-variant={variant} data-mode={mode}>
      <Heading className={`font-bold leading-tight ${compact ? "text-3xl md:text-5xl" : "text-2xl md:text-4xl"} ${dark ? "text-white" : "text-[#171717]"}`}>
        {content.heading}
      </Heading>
      {content.intro ? (
        <p className={`mt-4 max-w-3xl text-lg leading-8 ${dark ? "text-white/72" : "text-[#655c52]"}`}>{content.intro}</p>
      ) : null}

      {compact ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center">
          {figure}
          <div className="min-w-0">
            {captions}
            <p className={`mt-6 text-sm leading-6 ${dark ? "text-white/60" : "text-[#7a6e60]"}`}>{content.finePrint}</p>
            {content.learnMore ? (
              <Link
                href={content.learnMore.href}
                className={`mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] underline-offset-4 hover:underline ${
                  dark ? "text-[#ff6b5c]" : "text-[#c9281c]"
                }`}
              >
                {content.learnMore.label}
                <span aria-hidden="true">→</span>
              </Link>
            ) : null}
          </div>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center">
            {figure}
            {captions}
          </div>
          <p className={`mt-6 max-w-3xl text-sm leading-6 ${dark ? "text-white/60" : "text-[#7a6e60]"}`}>{content.finePrint}</p>
        </>
      )}
    </div>
  );
}

function Citations({
  sourced,
  content,
  localSourceNumbers,
  dark,
}: {
  sourced: SourcedText;
  content: VariantContent;
  localSourceNumbers?: ReadonlyMap<number, number>;
  dark: boolean;
}) {
  const sources = [...new Set(sourced.sourceIds ?? [])].flatMap((sourceId) => {
    const source = sourceById.get(sourceId);
    return source ? [source] : [];
  });
  if (sources.length === 0) {
    return null;
  }

  // On a page with a sources list, match the site's numbered markers.
  if (localSourceNumbers) {
    const markers = sources.flatMap((source) => {
      const localNumber = localSourceNumbers.get(source.id);
      return localNumber === undefined ? [] : [{ sourceId: source.id, localNumber }];
    });
    if (markers.length === 0) {
      return null;
    }
    return (
      <sup className={`ml-1 inline-flex gap-0.5 align-super text-[0.65em] font-bold leading-none ${dark ? "text-[#ff7167]" : "text-[#c9281c]"}`}>
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

  // Without a sources list (the homepage), link straight to each report.
  return (
    <>
      {sources.map((source) => (
        <SourceLink key={source.id} source={source} label={sourceLabel(source, content)} dark={dark} />
      ))}
    </>
  );
}

function sourceLabel(source: EducationSource, content: VariantContent) {
  return content.sourceLink?.sourceId === source.id ? content.sourceLink.label : "Source";
}

function SourceLink({ source, label, dark }: { source: EducationSource; label: string; dark: boolean }) {
  const link = source.links[0];
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`ml-2 whitespace-nowrap text-sm font-bold underline decoration-current/60 underline-offset-4 ${
        dark ? "text-[#ff6b5c] hover:text-white" : "text-[#a91f16] hover:text-[#8f1c14]"
      }`}
    >
      {label}
    </a>
  );
}
