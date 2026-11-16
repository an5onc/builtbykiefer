import type { CSSProperties } from "react";
import ProjectTour from "@/components/ProjectTour";
import { redFeatherLakesPhotos } from "@/lib/public-site/red-feather-lakes";
import { createMarketingMetadata } from "@/lib/public-site/metadata";

export const metadata = createMarketingMetadata({
  title: "Red Feather Lakes | Kiefer Built Contracting",
  description:
    "Explore a Red Feather Lakes mountain home with timber details, an open great room, a view deck, and hillside surroundings. Tour all 71 project photos.",
  pathname: "/projects/red-feather-lakes",
  image: "/images/red-feather-lakes/DSC00111.webp",
  imageAlt: "Red Feather Lakes hillside home with gray siding, a timber porch and pine trees",
});

// Cool siding and stone tones, warm timber, and the surrounding landscape.
const theme = {
  "--color-cream-50": "#f5f7f7",
  "--color-cream-100": "#edf0f1",
  "--color-cream-300": "#cfd7da",
  "--color-sage-50": "#eaf0f2",
  "--color-sage-200": "#c5d2d8",
  "--color-sage-400": "#9c794e",
  "--color-sage-500": "#627e8b",
  "--color-sage-600": "#4f6672",
  "--color-sage-700": "#3d535e",
  "--color-slate-500": "#65747b",
  "--color-slate-600": "#52636c",
  "--color-slate-700": "#3b4e58",
  "--color-slate-800": "#293740",
} as CSSProperties;

export default function RedFeatherLakesProject() {
  return (
    <ProjectTour
      title="Red Feather Lakes"
      description="A hillside retreat among the pines — warm timber details, an open great room, and a deck that looks out toward the Colorado mountains."
      hero={{ src: "/images/red-feather-lakes/DSC00111.webp", alt: "Red Feather Lakes mountain home with gray siding, a sloped roof and a covered timber entry among the pines" }}
      photos={redFeatherLakesPhotos}
      backHref="/projects/new-builds"
      moreHref="/projects/new-builds"
      galleryCategories={["All", "Exterior", "Aerial", "Kitchen", "Interior", "Baths", "Systems"]}
      galleryDescription="71 photos across the exterior, aerial views, kitchen, interiors, baths, and mechanical details."
      theme={theme}
      surfaceRgb="245,247,247"
      accent="#4f6672"
      accentHighlight="#c29462"
    />
  );
}
