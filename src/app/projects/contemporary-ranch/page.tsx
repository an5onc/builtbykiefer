import ProjectTour from "@/components/ProjectTour";

/* ── Types ─────────────────────────────────────────────────────── */
type Photo = { src: string; alt: string; caption: string; category: string };

/* ── Photo data ────────────────────────────────────────────────── */
const photos: Photo[] = [
  // Exterior
  { src: "/images/project-3/exterior-twilight-front.jpg", alt: "Contemporary ranch front elevation at twilight — stacked ledgestone columns, dark horizontal wood siding, arched entry portico with warm soffit lighting", caption: "Front elevation at twilight", category: "Exterior" },
  { src: "/images/project-3/exterior-front-daytime.jpg", alt: "Front elevation daytime — barrel-vault portico, mixed ledgestone and wood siding, circular concrete driveway", caption: "Front elevation — daytime", category: "Exterior" },
  { src: "/images/project-3/exterior-front-angled.jpg", alt: "Angled front elevation — arched entry portico and layered roofline at twilight", caption: "Front elevation — angled view", category: "Exterior" },
  { src: "/images/project-3/exterior-garage-daytime.jpg", alt: "Garage wing with dark wood-tone flush-panel doors, stucco and ledgestone accents, concrete motor court", caption: "Garage wing — daytime", category: "Exterior" },
  { src: "/images/project-3/exterior-garage-twilight.jpg", alt: "Garage elevation at twilight with modern wall sconces, cantilevered overhangs, and dark garage doors", caption: "Garage elevation — twilight", category: "Exterior" },
  { src: "/images/project-3/exterior-entry-portico.jpg", alt: "Front entry portico — barrel-vault arch with tongue-and-groove wood ceiling, reeded glass front door, ledgestone columns", caption: "Entry portico detail", category: "Exterior" },
  { src: "/images/project-3/exterior-entry-close.jpg", alt: "Barrel-vault entry vestibule with warm wood plank ceiling, reeded glass front door, and smart lock", caption: "Entry vestibule — close-up", category: "Exterior" },
  // Aerial
  { src: "/images/project-3/aerial-front-twilight.jpg", alt: "Aerial drone view at twilight — full ranch footprint, circular driveway, attached garage wing", caption: "Aerial — full property at twilight", category: "Aerial" },
  { src: "/images/project-3/aerial-front-angle.jpg", alt: "Aerial angled view showing roof geometry and neighborhood setting", caption: "Aerial — front angle", category: "Aerial" },
  { src: "/images/project-3/aerial-rear-twilight.jpg", alt: "Rear aerial at twilight — backyard landscaping, covered patio, and fall foliage surrounding the property", caption: "Aerial — rear at twilight", category: "Aerial" },
  // Kitchen
  { src: "/images/project-3/kitchen-overview.jpg", alt: "Open-concept kitchen with dark charcoal island, walnut perimeter cabinetry, white quartz counters, tray ceiling with cove lighting", caption: "Kitchen — full overview", category: "Kitchen" },
  { src: "/images/project-3/kitchen-island-front.jpg", alt: "Kitchen island — dark charcoal cabinetry, white quartz countertop, matte black faucet, calacatta quartz backsplash", caption: "Island front view", category: "Kitchen" },
  { src: "/images/project-3/kitchen-island-sink.jpg", alt: "Island sink detail — white quartz waterfall countertop, matte black faucet, integrated pop-up electrical outlets", caption: "Island sink and countertop detail", category: "Kitchen" },
  { src: "/images/project-3/kitchen-appliance-wall.jpg", alt: "Appliance wall — walnut flat-panel cabinetry, floating wood shelves, double wall ovens, full-height calacatta backsplash", caption: "Appliance and perimeter wall", category: "Kitchen" },
  { src: "/images/project-3/kitchen-perimeter.jpg", alt: "Perimeter cabinetry — walnut cabinets, quartz countertop, built-in ventilation hood, floating shelves with LED lighting", caption: "Perimeter cabinetry detail", category: "Kitchen" },
  { src: "/images/project-3/kitchen-island-living-view.jpg", alt: "View from kitchen island into the great room — stacked stone fireplace, vaulted ceilings, sliding glass doors", caption: "Kitchen to great room view", category: "Kitchen" },
  { src: "/images/project-3/kitchen-dining-view.jpg", alt: "Kitchen and adjacent dining with walnut cabinetry, white quartz island, and linear chandelier", caption: "Kitchen and dining area", category: "Kitchen" },
  // Interior
  // Original filename is misleading: this preserved photo shows the exterior.
  { src: "/images/project-3/interior-great-room-fireplace.jpg", alt: "Ranch front elevation at dusk with stone columns, wood siding and an arched entry", caption: "Front elevation at dusk — wide view", category: "Exterior" },
  { src: "/images/project-3/interior-great-room-wide.jpg", alt: "Great room wide view — open-concept layout, vaulted ceilings, stacked stone fireplace, kitchen beyond", caption: "Great room — wide view", category: "Interior" },
  { src: "/images/project-3/interior-great-room-kitchen.jpg", alt: "Great room to kitchen — vaulted ceiling, open floor plan, sliding glass doors, kitchen island visible", caption: "Great room to kitchen", category: "Interior" },
  { src: "/images/project-3/interior-open-plan.jpg", alt: "Full open-concept main floor — kitchen, great room, groin vault foyer, and cable railing staircase all visible", caption: "Full open-plan overview", category: "Interior" },
  { src: "/images/project-3/interior-living-to-entry.jpg", alt: "Living area toward front entry — barrel-vault foyer, black-framed double glass doors, stacked stone fireplace at right", caption: "Living area to entry foyer", category: "Interior" },
  // Keep the original dining/laundry paths; describe the visible rooms accurately.
  { src: "/images/project-3/interior-dining.jpg", alt: "Great room toward the hall with a stone fireplace, sliding glass doors and a black barn door", caption: "Great room toward the hall", category: "Interior" },
  { src: "/images/project-3/interior-primary-bedroom.jpg", alt: "Primary bedroom — vaulted cathedral ceiling, wall of windows, sliding glass patio door to backyard, neutral plush carpet", caption: "Primary bedroom", category: "Interior" },
  { src: "/images/project-3/interior-primary-bedroom-closets.jpg", alt: "Primary bedroom toward ensuite and walk-in closet — black-framed doors, vaulted ceiling", caption: "Primary bedroom — ensuite access", category: "Interior" },
  { src: "/images/project-3/interior-primary-bath.jpg", alt: "Primary bathroom — dual walnut vanity, white quartz countertops, dark slate tile accent wall, oval black-framed mirrors", caption: "Primary bathroom", category: "Interior" },
  { src: "/images/project-3/interior-primary-bath-vanity.jpg", alt: "Primary bath vanity detail — warm wood cabinetry, matte black hardware, oval mirrors, brass cylindrical wall sconces", caption: "Primary bath — vanity detail", category: "Interior" },
  { src: "/images/project-3/interior-master-suite.jpg", alt: "Master suite — integrated laundry nook, freestanding soaking tub, and frameless glass walk-in shower", caption: "Master suite — bath and laundry", category: "Interior" },
  { src: "/images/project-3/interior-laundry.jpg", alt: "Dining area with a terracotta accent wall, linear chandelier and large windows", caption: "Dining area", category: "Interior" },
];

export default function ContemporaryRanchProject() {
  return (
    <ProjectTour
      title="Contemporary Ranch"
      description="A Northern Colorado spec home built with premium craftsmanship — stacked stone, warm wood, and open-concept living from the ground up."
      hero={{ src: "/images/project-3/exterior-twilight-front.jpg", alt: "Contemporary ranch front elevation at twilight" }}
      photos={photos}
    />
  );
}
