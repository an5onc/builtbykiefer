import type { CSSProperties } from "react";
import ProjectTour from "@/components/ProjectTour";
import { timnathPhotos } from "@/lib/public-site/timnath";
import { createMarketingMetadata } from "@/lib/public-site/metadata";

export const metadata = createMarketingMetadata({
  title: "Timnath | Kiefer Built Contracting",
  description:
    "Tour the Timnath home: deep green cabinetry, natural wood, stone accents, a light-filled bathroom suite, and an intimate speakeasy. Explore all 26 interior photos.",
  pathname: "/projects/timnath",
  image: "/images/timnath/47-print-IMG_0130-HDR.webp",
  imageAlt: "Timnath kitchen with deep green cabinetry, natural wood and a large island",
});

// Colors echo the supplied photos; overrides remain inside this tour.
const theme = {
  "--color-cream-50": "#f8f6ef",
  "--color-cream-100": "#f0ede3",
  "--color-cream-300": "#dcd6c7",
  "--color-sage-50": "#edf0e7",
  "--color-sage-200": "#c9d0bc",
  "--color-sage-400": "#89936d",
  "--color-sage-500": "#687552",
  "--color-sage-600": "#43533b",
  "--color-sage-700": "#374532",
  "--color-slate-500": "#6c6a5d",
  "--color-slate-600": "#57594d",
  "--color-slate-700": "#3e4337",
  "--color-slate-800": "#292f25",
} as CSSProperties;

export default function TimnathProject() {
  return (
    <ProjectTour
      title="Timnath"
      description="Deep green, natural wood, and warm stone — inviting gathering spaces, a serene bathroom suite, and a speakeasy with a mood all its own."
      hero={{ src: "/images/timnath/47-print-IMG_0130-HDR.webp", alt: "Timnath kitchen with deep green and natural wood cabinetry, a large island and pendant lighting" }}
      photos={timnathPhotos}
      backHref="/projects/new-builds"
      moreHref="/projects/new-builds"
      galleryCategories={["All", "Kitchen", "Interior", "Baths", "Speakeasy"]}
      galleryTitle="Inside Timnath"
      galleryDescription="26 photos across the kitchen, living spaces, baths, and speakeasy."
      theme={theme}
      surfaceRgb="248,246,239"
      accent="#43533b"
      accentHighlight="#c3a46b"
    />
  );
}
