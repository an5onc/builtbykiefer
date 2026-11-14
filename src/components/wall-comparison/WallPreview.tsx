"use client";

import Link from "next/link";
import anchors from "./anchors.json";
import WallIllustration from "./WallIllustration";
import { illustrationTitles, previewContent, viewCaptions } from "./content";

// The button sits on the house floor, where the full version's zoom button is.
const FLOOR_BUTTON = { left: `${anchors.view.floorButton.x * 100}%`, top: `${anchors.view.floorButton.y * 100}%` };
// A soft ping invites the click; it stops for visitors who prefer reduced motion.
const PING_CSS = `
.kb-preview-ping { animation: kb-preview-ping 2.4s cubic-bezier(0, 0, 0.2, 1) infinite; }
@keyframes kb-preview-ping { 0% { transform: scale(1); opacity: 0.55; } 70%, 100% { transform: scale(1.9); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .kb-preview-ping { animation: none; opacity: 0; } }`;

/** The stick-frame house and its air flow alone, linking to the full comparison on the SIPs page. */
export default function WallPreview() {
  return (
    <figure className="min-w-0" data-wall-preview="">
      <div className="relative aspect-[8/5] overflow-hidden rounded-md bg-[radial-gradient(ellipse_at_50%_45%,#ffffff_0%,#f6f2ec_55%,#e8e1d6_100%)] ring-1 ring-black/5">
        <style>{PING_CSS}</style>
        <WallIllustration mode="stick" markers={[]} title={illustrationTitles.stick} switchable={false} />
        <Link
          href={previewContent.href}
          style={FLOOR_BUTTON}
          className="group absolute inline-flex min-h-11 -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white/90 p-1.5 pr-4 text-xs font-bold uppercase tracking-[0.12em] text-[#171717] shadow-[0_6px_20px_rgba(0,0,0,0.25)] ring-1 ring-black/5 backdrop-blur-sm transition-colors hover:bg-white hover:text-[#a91f16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9281c]"
        >
          <span aria-hidden="true" className="relative flex size-8 items-center justify-center rounded-full bg-[#c9281c] text-white transition-colors group-hover:bg-[#a91f16]">
            <span className="kb-preview-ping absolute inset-0 rounded-full bg-[#c9281c]" />
            <svg viewBox="0 0 20 20" className="relative size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 10 H15 M11 6 L15 10 L11 14" />
            </svg>
          </span>
          {previewContent.label}
        </Link>
      </div>
      <figcaption className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-[#7a6e60]">{viewCaptions.house}</figcaption>
    </figure>
  );
}
