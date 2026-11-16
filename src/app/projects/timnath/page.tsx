import type { CSSProperties } from "react";
import ProjectTour from "@/components/ProjectTour";
import { timnathPhotos } from "@/lib/public-site/timnath";
import { createMarketingMetadata } from "@/lib/public-site/metadata";

export const metadata = createMarketingMetadata({
  title: "Timnath | Kiefer Built Contracting",
  description:
    "Tour the Timnath home: deep green cabinetry, natural wood, stone accents, a light-filled bathroom suite, and an intimate lounge. Explore all 26 interior photos.",
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

const specs = [
  { label: "Location", value: "Timnath, Colorado" },
  { label: "Type", value: "New Home Build" },
  { label: "Palette", value: "Deep Green, Natural Wood, Warm Ivory" },
  { label: "Kitchen", value: "Two-Tone Cabinetry, Island Seating, Veined Backsplash" },
  { label: "Dining", value: "Stone Accent Wall, Large Windows" },
  { label: "Living Spaces", value: "Open Layout, Curved Seating, Natural Light" },
  { label: "Bathroom Suite", value: "Wood Double Vanity, Freestanding Tub, Glass Shower" },
  { label: "Finish Details", value: "Brass-Tone Fixtures, Arched Niches, Wood Accents" },
  { label: "Bedroom", value: "Vaulted Ceiling, Exposed Beam, Black-Framed Windows" },
  { label: "Lounge", value: "Dark Cabinetry, Banquette Seating, Illuminated Bar Niche" },
];

// General building process; no project dates or construction history inferred.
const phases = [
  { name: "Planning", desc: "Set the layout, room connections and overall finish direction." },
  { name: "Foundation", desc: "Prepare the site and establish the base for the home." },
  { name: "Framing", desc: "Give the rooms, ceiling lines and gathering spaces their shape." },
  { name: "Windows & Doors", desc: "Plan daylight, views and connections between indoor and outdoor spaces." },
  { name: "Cabinetry & Surfaces", desc: "Bring natural wood, contrasting cabinetry and pale surfaces together." },
  { name: "Interior Finish", desc: "Layer lighting, tile, hardware and the details that tie each room together." },
  { name: "Final Walkthrough", desc: "Review the finished spaces and details before the home is handed over." },
];

export default function TimnathProject() {
  return (
    <ProjectTour
      title="Timnath"
      description="Deep green, natural wood, and warm stone — inviting gathering spaces, a serene bathroom suite, and a lounge with a mood all its own."
      hero={{ src: "/images/timnath/47-print-IMG_0130-HDR.webp", alt: "Timnath kitchen with deep green and natural wood cabinetry, a large island and pendant lighting" }}
      photos={timnathPhotos}
      specs={specs}
      phases={phases}
      processDescription="A look at the building process, from the first plans to the finishing details."
      specsDescription="Explore the spaces, colors, and finish details shown in the photo tour."
      backHref="/projects/new-builds"
      moreHref="/projects/new-builds"
      galleryCategories={["All", "Kitchen", "Interior", "Baths", "Lounge"]}
      galleryTitle="Inside Timnath"
      galleryDescription="26 photos across the kitchen, living spaces, baths, and lounge."
      theme={theme}
      surfaceRgb="248,246,239"
      accent="#43533b"
      accentHighlight="#c3a46b"
    />
  );
}
