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

// The owner's project name is used without inferring a location or address.
const specs = [
  { label: "Project", value: "Vetters" },
  { label: "Type", value: "New Home Build" },
  { label: "Palette", value: "Natural Wood, Warm White, Brass Tones" },
  { label: "Exterior", value: "Pale Vertical Siding, Dark Roof, Covered Porch" },
  { label: "Kitchen", value: "Wood Cabinetry, Island Seating, White Counters" },
  { label: "Lighting", value: "Warm Metal Pendants, Recessed Lighting" },
  { label: "Living Spaces", value: "Vaulted Ceilings, Large Windows, Open Layout" },
  { label: "Baths", value: "Wood Vanities, Black Fixtures, Light Tile" },
  { label: "Bath Details", value: "Freestanding Tub, Glass Shower, Double Vanity" },
  { label: "Storage", value: "Walk-In Closet, Built-In Cabinetry" },
];

// General process overview, rather than an inferred project timeline.
const phases = [
  { name: "Planning", desc: "Set the layout, room connections and overall finish direction." },
  { name: "Foundation", desc: "Prepare the site and establish the base for the home." },
  { name: "Framing", desc: "Give the rooms, vaulted ceilings and gathering spaces their shape." },
  { name: "Exterior", desc: "Coordinate the roof, siding, porch and exterior finish details." },
  { name: "Windows & Doors", desc: "Connect the interior to daylight, the entry and outdoor spaces." },
  { name: "Interior Finish", desc: "Bring wood cabinetry, light surfaces, tile and lighting together." },
  { name: "Final Walkthrough", desc: "Review the finished spaces and the details before handover." },
];

export default function VettersProject() {
  return (
    <ProjectTour
      title="Vetters"
      description="Natural wood, warm white, and brass-toned lighting — bright gathering spaces and considered details, from the kitchen to the baths."
      hero={{ src: "/images/vetters/DSC03731.webp", alt: "Vetters home with pale vertical siding, a dark roof, covered front porch and attached garage" }}
      photos={vettersPhotos}
      specs={specs}
      phases={phases}
      processDescription="A look at the building process, from the first plans to the finishing details."
      specsDescription="Explore the spaces, colors, and visible finishes shown in the photo tour."
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
