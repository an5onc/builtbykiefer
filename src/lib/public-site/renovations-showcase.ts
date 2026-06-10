import { ArrowUpRight, Bath, DoorOpen, Home, Lamp, UtensilsCrossed } from "lucide-react";

export type RenovationShowcaseImage = {
  src: string;
  alt: string;
  label: string;
  detail: string;
};

export type RenovationShowcaseCategory = {
  id: "kitchens" | "bathrooms" | "living-spaces" | "exteriors" | "custom-elevators";
  title: string;
  shortLabel: string;
  summary: string;
  body: string;
  heroImage: string;
  icon: typeof UtensilsCrossed;
  proofPoints: string[];
  gallery: RenovationShowcaseImage[];
  cta?: {
    label: string;
    href: string;
  };
};

export const renovationShowcaseCategories: RenovationShowcaseCategory[] = [
  {
    id: "kitchens",
    title: "Kitchens",
    shortLabel: "Kitchens",
    summary: "Cabinetry, counters, lighting, appliance walls, and open-plan flow.",
    body:
      "Kiefer Built kitchen renovations bring layout, cabinetry, lighting, counters, and daily workflow into one coordinated plan. The goal is a room that photographs well, works hard, and still feels calm after move-in.",
    heroImage: "/images/project-1/kitchen-8.jpg",
    icon: UtensilsCrossed,
    proofPoints: ["Cabinet coordination", "Lighting and layout", "Finish sequencing"],
    gallery: [
      {
        src: "/images/project-1/kitchen-8.jpg",
        alt: "Kitchen renovation with island and cabinetry by Kiefer Built Contracting",
        label: "Island-centered remodel",
        detail: "Cabinetry, counters, and traffic flow resolved around daily use.",
      },
      {
        src: "/images/project-1/kitchen-4.jpg",
        alt: "Bright kitchen renovation with custom cabinetry by Kiefer Built Contracting",
        label: "Bright work zones",
        detail: "Storage, prep space, and finish details planned together.",
      },
      {
        src: "/images/project-3/kitchen-overview.jpg",
        alt: "Open kitchen with large island and designer finishes by Kiefer Built Contracting",
        label: "Open-plan kitchen",
        detail: "Kitchen, dining, and living transitions kept visually connected.",
      },
      {
        src: "/images/project-3/kitchen-appliance-wall.jpg",
        alt: "Kitchen appliance wall and cabinetry by Kiefer Built Contracting",
        label: "Appliance wall",
        detail: "Tall storage, appliances, backsplash, and lighting aligned.",
      },
    ],
  },
  {
    id: "bathrooms",
    title: "Bathrooms",
    shortLabel: "Bathrooms",
    summary: "Tile, showers, vanities, fixtures, waterproofing, and daily-use storage.",
    body:
      "Bathrooms reward disciplined planning. Kiefer Built coordinates tile, glass, plumbing, vanities, mirrors, lighting, and waterproofing so the finished room feels polished and holds up to daily use.",
    heroImage: "/images/project-3/interior-primary-bath.jpg",
    icon: Bath,
    proofPoints: ["Tile and waterproofing", "Vanity details", "Fixture coordination"],
    gallery: [
      {
        src: "/images/project-3/interior-primary-bath.jpg",
        alt: "Primary bathroom renovation with vanity and tile by Kiefer Built Contracting",
        label: "Primary bath finish",
        detail: "Vanity, tile, mirrors, and lighting composed as one room.",
      },
      {
        src: "/images/project-3/interior-primary-bath-vanity.jpg",
        alt: "Bathroom vanity detail with warm cabinetry by Kiefer Built Contracting",
        label: "Vanity detail",
        detail: "Cabinet finish, hardware, counters, and wall lighting aligned.",
      },
      {
        src: "/images/project-4/DSC05532.jpg",
        alt: "Bathroom with blue soaking tub and shower by Kiefer Built Contracting",
        label: "Tub and shower suite",
        detail: "Wet-room decisions coordinated with a strong color moment.",
      },
      {
        src: "/images/project-4/DSC05547.jpg",
        alt: "Bathroom soaking tub and blue cabinetry by Kiefer Built Contracting",
        label: "Color-forward bath",
        detail: "Cabinetry, tub, window placement, and tile kept balanced.",
      },
    ],
  },
  {
    id: "living-spaces",
    title: "Living Spaces",
    shortLabel: "Living",
    summary: "Open rooms, fireplaces, flooring, lighting, trim, and better movement.",
    body:
      "Living-space renovations are about connection: the way rooms open, where people gather, how light moves, and how finish details carry from one space into the next.",
    heroImage: "/images/project-3/interior-great-room-fireplace.jpg",
    icon: Lamp,
    proofPoints: ["Fireplace features", "Open-plan flow", "Flooring transitions"],
    gallery: [
      {
        src: "/images/project-3/interior-great-room-fireplace.jpg",
        alt: "Great room fireplace feature wall by Kiefer Built Contracting",
        label: "Fireplace feature",
        detail: "A strong focal wall anchors the room without crowding it.",
      },
      {
        src: "/images/project-3/interior-great-room-wide.jpg",
        alt: "Open great room renovation by Kiefer Built Contracting",
        label: "Open great room",
        detail: "Volume, light, and circulation shaped for family use.",
      },
      {
        src: "/images/project-3/interior-living-to-entry.jpg",
        alt: "Living space connected to entry by Kiefer Built Contracting",
        label: "Entry connection",
        detail: "Sightlines between entry, living, and gathering areas refined.",
      },
      {
        src: "/images/project-3/interior-open-plan.jpg",
        alt: "Open-plan interior with kitchen and living spaces by Kiefer Built Contracting",
        label: "Whole-room flow",
        detail: "Kitchen, living, and circulation details brought into sync.",
      },
    ],
  },
  {
    id: "exteriors",
    title: "Exteriors",
    shortLabel: "Exteriors",
    summary: "Siding, entries, curb appeal, outdoor transitions, and durable envelope work.",
    body:
      "Exterior work has to look right and protect the structure. Kiefer Built coordinates entries, siding, trim, outdoor transitions, and site details with Northern Colorado weather in mind.",
    heroImage: "/images/project-3/exterior-entry-close.jpg",
    icon: Home,
    proofPoints: ["Entry details", "Exterior durability", "Curb appeal"],
    gallery: [
      {
        src: "/images/project-3/exterior-entry-close.jpg",
        alt: "Custom exterior entry detail by Kiefer Built Contracting",
        label: "Entry detail",
        detail: "Door, lighting, ceiling, and exterior materials resolved together.",
      },
      {
        src: "/images/project-3/exterior-front-daytime.jpg",
        alt: "Custom home exterior renovation details by Kiefer Built Contracting",
        label: "Front elevation",
        detail: "Materials, approach, and massing tuned for the first impression.",
      },
      {
        src: "/images/project-1/exterior-3.jpg",
        alt: "Exterior renovation work by Kiefer Built Contracting",
        label: "Exterior refresh",
        detail: "Existing homes upgraded with cleaner lines and stronger finish logic.",
      },
      {
        src: "/images/project-3/exterior-entry-portico.jpg",
        alt: "Covered exterior entry portico by Kiefer Built Contracting",
        label: "Covered approach",
        detail: "A more intentional transition from site to home.",
      },
    ],
  },
  {
    id: "custom-elevators",
    title: "Custom Elevators",
    shortLabel: "Elevators",
    summary: "Residential elevator access integrated with structure, finishes, and adjacent rooms.",
    body:
      "Custom elevators are specialty renovations with structural, access, and finish implications. Kiefer Built coordinates the field work around the elevator so it feels built into the home, not added after the fact.",
    heroImage: "/images/project-4/DSC05502.jpg",
    icon: DoorOpen,
    proofPoints: ["Access planning", "Finish integration", "Designer coordination"],
    cta: {
      label: "View Elevator Service",
      href: "/services/custom-elevators",
    },
    gallery: [
      {
        src: "/images/project-4/DSC05502.jpg",
        alt: "Custom glass residential elevator by Kiefer Built Contracting",
        label: "Glass elevator",
        detail: "A residential lift coordinated with adjacent finished rooms.",
      },
      {
        src: "/images/project-4/DSC05496.jpg",
        alt: "Custom elevator integrated near laundry and living spaces by Kiefer Built Contracting",
        label: "Integrated access",
        detail: "Doorway, flooring, and room transitions planned around the lift.",
      },
      {
        src: "/images/project-4/DSC05499.jpg",
        alt: "Custom elevator beside finished utility room by Kiefer Built Contracting",
        label: "Utility transition",
        detail: "Functional rooms and specialty access details built together.",
      },
      {
        src: "/images/project-4/DSC05505.jpg",
        alt: "Custom elevator doorway and wall finish by Kiefer Built Contracting",
        label: "Finish alignment",
        detail: "Wall treatment, door location, and access path kept intentional.",
      },
    ],
  },
];

export const renovationShowcaseCta = {
  label: "Start A Renovation",
  href: "/#contact",
};

export const renovationShowcaseExternalIcon = ArrowUpRight;
