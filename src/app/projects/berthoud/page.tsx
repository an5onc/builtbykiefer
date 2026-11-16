import type { CSSProperties } from "react";
import ProjectTour from "@/components/ProjectTour";
import { berthoudPhotos } from "@/lib/public-site/berthoud";
import { createMarketingMetadata } from "@/lib/public-site/metadata";

export const metadata = createMarketingMetadata({
  title: "Berthoud | Kiefer Built Contracting",
  description:
    "Explore the Berthoud home: warm wood cabinetry, bright open living spaces, contrasting kitchen details, and light-filled baths. View the complete photo tour.",
  pathname: "/projects/berthoud",
  image: "/images/berthoud/DSC03016.webp",
  imageAlt: "Berthoud home with light siding, dark trim and wood-tone garage doors",
});

// Local overrides keep the shared Ranch layout while reflecting this home's
// warm white walls, natural wood, bronze lighting and charcoal hardware.
const theme = {
  "--color-cream-50": "#faf8f4",
  "--color-cream-100": "#f3eee6",
  "--color-cream-300": "#ded3c4",
  "--color-sage-50": "#f1ebe2",
  "--color-sage-200": "#d8c6af",
  "--color-sage-400": "#a97b4f",
  "--color-sage-500": "#94683f",
  "--color-sage-600": "#795331",
  "--color-sage-700": "#67462c",
  "--color-slate-500": "#70665c",
  "--color-slate-600": "#5d544a",
  "--color-slate-700": "#443d36",
  "--color-slate-800": "#2e2a26",
} as CSSProperties;

export default function BerthoudProject() {
  return (
    <ProjectTour
      title="Berthoud"
      description="Warm wood, bright interiors, and charcoal accents — a Northern Colorado home with room to gather and details to appreciate."
      hero={{ src: "/images/berthoud/DSC03016.webp", alt: "Berthoud home with light siding, dark trim, covered entry and wood-tone garage doors" }}
      photos={berthoudPhotos}
      backHref="/projects/new-builds"
      moreHref="/projects/new-builds"
      galleryCategories={["All", "Exterior", "Kitchen", "Baths", "Interior"]}
      galleryDescription="41 images across exterior, kitchen, baths, and interior. Includes one landscaped exterior visualization."
      theme={theme}
      surfaceRgb="250,248,244"
      accent="#795331"
      accentHighlight="#c19462"
    />
  );
}
