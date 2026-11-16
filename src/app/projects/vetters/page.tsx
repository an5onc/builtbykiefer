import type { CSSProperties } from "react";
import ProjectTour from "@/components/ProjectTour";
import { vettersPhotos } from "@/lib/public-site/vetters";
import { createMarketingMetadata } from "@/lib/public-site/metadata";

export const metadata = createMarketingMetadata({
  title: "Vetters | Kiefer Built Contracting",
  description:
    "Explore the Vetters home: natural wood cabinetry, bright open living spaces, warm metal lighting, and light-filled baths. View the complete 32-image tour.",
  pathname: "/projects/vetters",
  image: "/images/vetters/DSC03731.webp",
  imageAlt: "Vetters home with pale siding, a covered front porch and attached garage",
});

const theme = {
  "--color-cream-50": "#fbf9f4",
  "--color-cream-100": "#f4efe5",
  "--color-cream-300": "#ded2bd",
  "--color-sage-50": "#f2ecdf",
  "--color-sage-200": "#dbc9a9",
  "--color-sage-400": "#b88a41",
  "--color-sage-500": "#a17838",
  "--color-sage-600": "#80602f",
  "--color-sage-700": "#6a4e29",
  "--color-slate-500": "#756a59",
  "--color-slate-600": "#5e5548",
  "--color-slate-700": "#494135",
  "--color-slate-800": "#302b24",
} as CSSProperties;

export default function VettersProject() {
  return (
    <ProjectTour
      title="Vetters"
      description="Natural wood, warm white, and brass-toned lighting — bright gathering spaces and considered details, from the kitchen to the baths."
      hero={{ src: "/images/vetters/DSC03731.webp", alt: "Vetters home with pale vertical siding, a dark roof, covered front porch and attached garage" }}
      photos={vettersPhotos}
      backHref="/projects/new-builds"
      moreHref="/projects/new-builds"
      galleryCategories={["All", "Exterior", "Kitchen", "Baths", "Interior"]}
      galleryDescription="32 images across the exterior, kitchen, baths, and interiors. Includes one landscaped exterior visualization."
      theme={theme}
      surfaceRgb="251,249,244"
      accent="#80602f"
      accentHighlight="#c5a66b"
    />
  );
}
