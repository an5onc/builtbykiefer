"use client";

import { useEffect, useId, useState, type ReactNode } from "react";

export default function ProjectMarquee({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const id = useId();
  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="mt-10">
      <div hidden={!ready} className="mx-auto mb-4 max-w-7xl px-6 motion-reduce:hidden">
        <button type="button" aria-controls={id} aria-pressed={paused} onClick={() => setPaused((value) => !value)} className="rounded border border-black/20 px-4 py-2 text-sm font-semibold text-charcoal-800 hover:bg-sand-50">
          {paused ? "Play project gallery" : "Pause project gallery"}
        </button>
      </div>
      <div
        id={id}
        role="region"
        aria-label="Featured project photos"
        tabIndex={0}
        data-playing={ready && !paused}
        className="kiefer-marquee-viewport"
        onFocusCapture={(event) => {
          // Keyboard focus uses the static originals so each link stays in view.
          // Pointer focus must not reset the moving track before its click lands.
          const target = event.target;
          if (target.matches(":focus-visible")) {
            setPaused(true);
            // Native focus may accept a partially visible card. Wait for the
            // static layout, then show the complete focused link, without motion.
            requestAnimationFrame(() => {
              if (target.isConnected && document.activeElement === target) {
                target.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
              }
            });
          }
        }}
        onMouseDownCapture={(event) => {
          // Decorative copies remain clickable, but must never take hidden focus.
          if (event.target instanceof Element && event.target.closest('article[aria-hidden="true"] a')) event.preventDefault();
        }}
      >
        {children}
      </div>
    </div>
  );
}
