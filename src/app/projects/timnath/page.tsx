import type { CSSProperties } from "react";
import ProjectTour from "@/components/ProjectTour";
import { timnathPhotos, timnathHero } from "@/lib/public-site/timnath";
import { createMarketingMetadata } from "@/lib/public-site/metadata";

export const metadata = createMarketingMetadata({
  title: "Timnath | Kiefer Built Contracting",
  description:
    `Explore ${timnathPhotos.length} photos of the Timnath home: twilight exteriors, wood cabinetry, open living spaces, bathrooms, a speakeasy and the finished basement.`,
  pathname: "/projects/timnath",
  image: timnathHero.src,
  imageAlt: timnathHero.alt,
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
      description="Warm wood, stone and open views — a custom home with connected living spaces, carefully finished bathrooms, a speakeasy and a generous basement."
      hero={timnathHero}
      photos={timnathPhotos}
      backHref="/projects/new-builds"
      moreHref="/projects/new-builds"
      galleryCategories={["All", "Exterior", "Kitchen", "Interior", "Baths", "Speakeasy", "Basement"]}
      galleryTitle="Inside Timnath"
      galleryDescription={`${timnathPhotos.length} photographs across the exterior, kitchen, living spaces, bathrooms, speakeasy and finished basement.`}
      theme={theme}
      surfaceRgb="248,246,239"
      accent="#43533b"
      accentHighlight="#c3a46b"
    />
  );
}
