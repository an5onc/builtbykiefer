import type { CSSProperties } from "react";
import ProjectTour from "@/components/ProjectTour";
import { lakehouseHero, lakehousePhotos } from "@/lib/public-site/lakehouse-remodel";
import { createMarketingMetadata } from "@/lib/public-site/metadata";

export const metadata = createMarketingMetadata({
  title: "Lakehouse Remodel | Kiefer Built Contracting",
  description: "Tour the Lakehouse Remodel: warm wood cabinetry, a dark waterfall island, open living spaces, updated baths and a timber-framed deck. Explore 48 project photos.",
  pathname: "/projects/lakehouse-remodel",
  image: lakehouseHero.src,
  imageAlt: lakehouseHero.alt,
});

const theme = {
  "--color-cream-50": "#faf8f3",
  "--color-cream-100": "#f0ece3",
  "--color-cream-300": "#d7cdbb",
  "--color-sage-50": "#efede6",
  "--color-sage-200": "#d4c5ab",
  "--color-sage-400": "#b89360",
  "--color-sage-500": "#9d7b4c",
  "--color-sage-600": "#775a36",
  "--color-sage-700": "#624a30",
  "--color-slate-500": "#70695f",
  "--color-slate-600": "#57534c",
  "--color-slate-700": "#3e403b",
  "--color-slate-800": "#252d29",
} as CSSProperties;

export default function LakehouseRemodelProject() {
  return (
    <ProjectTour
      title="Lakehouse Remodel"
      description="Warm wood, charcoal stone, and wide-open views — a refreshed home with connected gathering spaces and thoughtful details, inside and out."
      hero={lakehouseHero}
      photos={lakehousePhotos}
      ctaTitle="Ready to Reimagine Your Home?"
      ctaDescription="From a kitchen refresh to a broader home renovation, share your ideas with Kiefer Built and start shaping the next version of your home."
      backHref="/projects/renovations-additions"
      moreHref="/projects/renovations-additions"
      galleryCategories={["All", "Exterior", "Kitchen", "Living & Dining", "Baths", "Laundry & Entry"]}
      galleryTitle="Inside the Lakehouse Remodel"
      galleryDescription="48 photographs of the completed renovation, from the waterfall island and gathering spaces to the baths, entries and deck."
      theme={theme}
      surfaceRgb="250,248,243"
      accent="#775a36"
      accentHighlight="#c6a575"
    />
  );
}
