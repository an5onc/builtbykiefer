import { ArrowUpRight, Bath, DoorOpen, Home, Lamp, UtensilsCrossed, Wine } from "lucide-react";

export type RenovationShowcaseImage = {
  src: string;
  alt: string;
  label: string;
  detail: string;
};

export type RenovationShowcaseCategory = {
  id: "kitchens" | "bathrooms" | "living-spaces" | "speakeasies" | "exteriors" | "custom-elevators";
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
    heroImage: "/images/lakehouse-remodel/DSC05814-HDR.webp",
    icon: UtensilsCrossed,
    proofPoints: ["Cabinet coordination", "Lighting and layout", "Finish sequencing"],
    gallery: [
      {
        src: "/images/lakehouse-remodel/DSC05814-HDR.webp",
        alt: "Lakehouse Remodel kitchen with light wood cabinets and a dark waterfall island by Kiefer Built",
        label: "Lakehouse · Wood and stone",
        detail: "Light wood cabinetry, veined dark stone and three pendants define the remodeled kitchen.",
      },
      {
        src: "/images/lakehouse-remodel/DSC05817-HDR.webp",
        alt: "Lakehouse Remodel island facing wood cabinetry and built-in appliances by Kiefer Built",
        label: "Lakehouse · Island layout",
        detail: "A broad island connects the working kitchen to the home's gathering spaces.",
      },
      {
        src: "/images/lakehouse-remodel/DSC06165-HDR.webp",
        alt: "Lakehouse Remodel beverage nook with wood shelves and a glass-front refrigerator by Kiefer Built",
        label: "Lakehouse · Beverage nook",
        detail: "Open shelves, a dark worktop and an undercounter refrigerator create a dedicated serving area.",
      },
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
    heroImage: "/images/lakehouse-remodel/DSC05960-HDR.webp",
    icon: Bath,
    proofPoints: ["Tile and waterproofing", "Vanity details", "Fixture coordination"],
    gallery: [
      {
        src: "/images/lakehouse-remodel/DSC05960-HDR.webp",
        alt: "Lakehouse Remodel double vanity with arched mirrors beside a glass shower by Kiefer Built",
        label: "Lakehouse · Primary bath",
        detail: "Pale cabinetry and arched mirrors sit against dark floor tile and a glass shower enclosure.",
      },
      {
        src: "/images/lakehouse-remodel/DSC05910-HDR.webp",
        alt: "Lakehouse Remodel glass shower with pale wall tile and black fixtures by Kiefer Built",
        label: "Lakehouse · Shower details",
        detail: "Light wall tile, dark floor tile and black fittings give the shower a restrained contrast.",
      },
      {
        src: "/images/lakehouse-remodel/DSC05887-HDR.webp",
        alt: "Lakehouse Remodel powder room with wood vanity and a heron mural by Kiefer Built",
        label: "Lakehouse · Powder room",
        detail: "A wood vanity and dark counter sit beside a distinctive heron mural.",
      },
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
    heroImage: "/images/lakehouse-remodel/DSC06025-HDR.webp",
    icon: Lamp,
    proofPoints: ["Fireplace features", "Open-plan flow", "Flooring transitions"],
    gallery: [
      {
        src: "/images/lakehouse-remodel/DSC06025-HDR.webp",
        alt: "Lakehouse Remodel vaulted great room with a glazed gable and connected dining area by Kiefer Built",
        label: "Lakehouse · Open gathering space",
        detail: "A vaulted ceiling and broad glass wall connect the kitchen, living and dining areas.",
      },
      {
        src: "/images/lakehouse-remodel/DSC05837-HDR.webp",
        alt: "Lakehouse Remodel dining area with a scenic mural and built-in cabinets by Kiefer Built",
        label: "Lakehouse · Dining details",
        detail: "A landscape mural, built-in storage and a rectangular chandelier frame the dining table.",
      },
      {
        src: "/images/lakehouse-remodel/DSC06205-HDR.webp",
        alt: "Lakehouse Remodel living room with a dark fireplace wall by Kiefer Built",
        label: "Lakehouse · Fireplace wall",
        detail: "A dark horizontal surround gives the living area a clear focal point.",
      },
      {
        src: "/images/project-3/interior-great-room-wide.jpg",
        alt: "Great room with a stacked-stone fireplace wall, wood flooring and sliding glass doors by Kiefer Built Contracting",
        label: "Fireplace feature",
        detail: "A strong focal wall anchors the room without crowding it.",
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
    id: "speakeasies",
    title: "Speakeasies",
    shortLabel: "Speakeasies",
    summary: "Bar cabinetry, intimate seating, layered lighting, and spaces made for gathering.",
    body:
      "A speakeasy brings a different mood to the home. Coordinate bar storage, comfortable seating, lighting, and finishes to create an inviting place to gather. Explore the details in the Timnath speakeasy below.",
    heroImage: "/images/timnath/65-print-IMG_0065-HDR.webp",
    icon: Wine,
    proofPoints: ["Bar cabinetry", "Banquette seating", "Atmospheric lighting"],
    cta: { label: "Explore Timnath", href: "/projects/timnath" },
    gallery: [
      {
        src: "/images/timnath/65-print-IMG_0065-HDR.webp",
        alt: "Timnath speakeasy with dark green walls, upholstered banquette seating and a wood table by Kiefer Built",
        label: "Timnath · Speakeasy seating",
        detail: "Deep green finishes, upholstered seating and wall sconces set an intimate mood.",
      },
      {
        src: "/images/timnath/67-print-IMG_0075-HDR.webp",
        alt: "Timnath speakeasy with a wood table, upholstered bench and dark counter by Kiefer Built",
        label: "Timnath · Seating and counter",
        detail: "A wood table and upholstered banquette sit beside dark bar cabinetry and counters.",
      },
      {
        src: "/images/timnath/68-print-IMG_0080-HDR.webp",
        alt: "Timnath speakeasy illuminated arched bar niche with ribbed backing and glassware by Kiefer Built",
        label: "Timnath · Arched bar niche",
        detail: "An illuminated arch frames bar shelves, glassware and a ribbed backdrop.",
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
    heroImage: "/images/lakehouse-remodel/DSC06277.webp",
    icon: Home,
    proofPoints: ["Entry details", "Exterior durability", "Curb appeal"],
    gallery: [
      {
        src: "/images/lakehouse-remodel/DSC06277.webp",
        alt: "Lakehouse Remodel rear deck with a timber gable and pergolas by Kiefer Built",
        label: "Lakehouse · Deck and timber",
        detail: "Timber framing, pergolas and a broad deck extend the home's gathering spaces outdoors.",
      },
      {
        src: "/images/lakehouse-remodel/DSC06259.webp",
        alt: "Lakehouse Remodel covered front entry with timber posts and dark doors by Kiefer Built",
        label: "Lakehouse · Covered entry",
        detail: "Warm wood posts and dark-framed doors bring contrast to the white exterior.",
      },
      {
        src: "/images/lakehouse-remodel/DSC06274.webp",
        alt: "Lakehouse Remodel deck and exterior stair with dark railings by Kiefer Built",
        label: "Lakehouse · Outdoor connections",
        detail: "An exterior stair connects the upper deck to the lower patio and yard.",
      },
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
