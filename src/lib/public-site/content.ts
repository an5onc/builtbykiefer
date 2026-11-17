import { businessContact } from "./business";
import { remodelingServices } from "./remodeling-services";

export type PublicCard = {
  title: string;
  description: string;
  href?: string;
  image?: string;
  imageAlt?: string;
  /** Override the slot hint when a landscape image is cropped into a tall card. */
  imageSizes?: string;
  imagePosition?: string;
  meta?: string;
};

export type PublicSection = {
  id?: string;
  title: string;
  /** Omitted when an interactive feature carries the section's explanation. */
  body?: string;
  /** Interactive feature rendered under the title in place of the image, body and points. */
  feature?: "wall-comparison";
  image?: string;
  imageAlt?: string;
  points?: string[];
  sourceIds?: number[];
  comparison?: {
    columns: [string, string];
    rows: Array<{
      label: string;
      standard: string;
      kiefer: string;
      sourceId?: number;
    }>;
  };
  dark?: boolean;
};

export type TestimonialSummary = {
  name: string;
  summary: string;
  project?: string;
};

export type PublicPageContent = {
  title: string;
  description: string;
  heroImage: string;
  heroAlt: string;
  cardsLayout?: "default" | "fourColumn";
  projectShowcase?: boolean;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  proof?: Array<{
    value: string;
    label: string;
    sourceId?: number;
  }>;
  intro?: {
    title: string;
    body: string;
  };
  cards?: PublicCard[];
  sections?: PublicSection[];
  testimonials?: TestimonialSummary[];
  closingCta?: { title: string; body: string; label: string; href: string };
  guideDownload?: {
    label: string;
    href: string;
    note?: string;
  };
};

const cta = {
  label: "Start A Project",
  href: "/#contact",
};

export const publicPages: Record<string, PublicPageContent> = {
  about: {
    title: "Relentless Pursuit of Perfection",
    description:
      "Kiefer Built Contracting is a family-run Northern Colorado builder focused on trust, communication, craftsmanship, and spaces that work as well as they look.",
    heroImage: "/images/project-3/exterior-twilight-front.jpg",
    heroAlt: "Kiefer Built custom home exterior at twilight",
    primaryCta: cta,
    secondaryCta: { label: "Meet The Team", href: "/about/team" },
    proof: [
      { value: "Family", label: "Owner-led approach" },
      { value: "NoCO", label: "Northern Colorado focus" },
      { value: "Craft", label: "Detail-first construction" },
    ],
    intro: {
      title: "A family builder with a practical eye for the details.",
      body:
        "Mark and Mindy Kiefer built the company around direct communication, durable work, and a straightforward client experience. With Miles involved in estimating and project management, Kiefer Built stays close to the decisions that matter from the first conversation through closeout.",
    },
    sections: [
      {
        title: "Trust starts with clear expectations.",
        body:
          "Kiefer Built treats every project as a relationship, not a transaction. Scope, budget, schedule, and finish decisions are discussed early so clients understand what is happening and why.",
        image: "/images/project-3/interior-great-room-wide.jpg",
        imageAlt: "Great room with a stone fireplace, wood flooring and sliding glass doors",
        points: ["Owner involvement", "Transparent communication", "Organized decisions"],
      },
      {
        title: "Modern tools, traditional accountability.",
        body:
          "The company blends time-tested craftsmanship with project visibility, photo documentation, and client communication tools that keep homeowners and business owners informed.",
        image: "/images/project-1/kitchen-8.jpg",
        imageAlt: "Kitchen with a dark island, wood cabinets and black pendant lights",
        points: ["Project visibility", "Finish coordination", "Long-term value"],
        dark: true,
      },
    ],
  },
  team: {
    title: "The Kiefer Built Team",
    description:
      "Meet the family leadership behind Kiefer Built Contracting: Mark Kiefer, Mindy Kiefer, Miles Kiefer, and Marlys Kiefer.",
    heroImage: "/images/project-3/interior-open-plan.jpg",
    heroAlt: "Open custom home interior by Kiefer Built Contracting",
    primaryCta: cta,
    cardsLayout: "fourColumn",
    cards: [
      {
        title: "Mark Kiefer",
        meta: "Owner",
        description:
          "Mark leads the build side with hands-on construction experience, practical problem solving, and a standard of work that puts quality ahead of shortcuts.",
        image: "/images/team/mark-kiefer.jpg",
        imageAlt: "Mark Kiefer wearing a Kiefer Built shirt outdoors",
        imagePosition: "center 28%",
      },
      {
        title: "Mindy Kiefer",
        meta: "CFO",
        description:
          "Mindy supports the financial and operational discipline that keeps projects organized, accountable, and grounded in real numbers.",
        image: "/images/team/mindy-kiefer.jpg",
        imageAlt: "Mindy Kiefer wearing a Kiefer Built shirt beside a doorway",
        imagePosition: "center 30%",
      },
      {
        title: "Miles Kiefer",
        meta: "Estimator & Project Manager",
        description:
          "Miles helps translate early project ideas into scope, pricing, schedules, and day-to-day coordination that clients can follow.",
        image: "/images/team/miles-kiefer-tight.jpg",
        imageAlt: "Miles Kiefer wearing a Kiefer Built shirt and cap outdoors",
        imagePosition: "center 24%",
      },
      {
        title: "Marlys Kiefer",
        meta: "COO",
        description:
          "Marlys supports the operational systems, team coordination, and follow-through that keep Kiefer Built projects moving with clarity.",
        image: "/images/team/marlys-kiefer.jpg",
        imageAlt: "Marlys Kiefer wearing a Kiefer Built shirt outdoors",
        imagePosition: "center 34%",
      },
    ],
    sections: [
      {
        title: "A small leadership team keeps decisions close to the work.",
        body:
          "Clients are not handed off to a faceless process. Kiefer Built keeps leadership close enough to answer questions, solve issues, and protect the standards clients expect.",
        points: ["Direct accountability", "Practical estimates", "Consistent communication"],
      },
    ],
  },
  accolades: {
    title: "Awards, Press, and Performance Recognition",
    description:
      "Recognition for energy-efficient building, customer service, and construction quality in Northern Colorado.",
    heroImage: "/images/project-2/exterior-wide-property.jpg",
    heroAlt: "Energy-efficient mountain modern project by Kiefer Built",
    primaryCta: cta,
    cards: [
      {
        title: "2025 SIPA Building Excellence Recognition",
        meta: "Single Family Homes under 3,000 sq. ft.",
        description:
          "SIPA recognized Kiefer Built's Red Feather Lakes project in its 2025 Building Excellence Awards. See the issuer's announcement for the project and category details.",
        href: "https://www.sips.org/sipa-2025-building-excellence-award-winners",
        image: "/images/project-2/exterior-front-balcony.jpg",
        imageAlt: "Dark-sided two-story home beside an open yard and wooded hillside",
      },
      {
        title: "Client Service",
        meta: "Communication and follow-through",
        description:
          "Kiefer Built emphasizes communication, follow-through, and detail-oriented project delivery.",
        image: "/images/project-1/interior-8.jpg",
        imageAlt: "Bathroom with a double vanity, patterned tile and a window beside the toilet",
      },
      {
        title: "Built to Perform",
        meta: "SIPs and efficient construction",
        description:
          "Kiefer Built uses modern building systems where they make sense, pairing energy performance with a comfortable finished home.",
        image: "/images/project-2/exterior-winter-wide.jpg",
        imageAlt: "Foundation construction with framed walls and lifting equipment in an open landscape",
      },
    ],
  },
  blog: {
    title: "Kiefer Built Journal",
    description:
      "Practical notes on energy-efficient construction, SIPs, modern homes, and projects built for Northern Colorado conditions.",
    heroImage: "/images/project-2/exterior-panoramic.jpg",
    heroAlt: "Northern Colorado mountain property by Kiefer Built Contracting",
    primaryCta: cta,
    cards: [
      {
        title: "How SIPs Support a Greener Tomorrow",
        meta: "Building resource · SIPs",
        description:
          "A builder's look at how structural insulated panels support energy efficiency, comfort, and long-term performance.",
        href: "/why-kiefer-built/sips",
        image: "/images/project-2/exterior-winter-detail.jpg",
        imageAlt: "Exposed floor framing above a partially built foundation with equipment nearby",
      },
      {
        title: "Building Smarter With SIPs",
        meta: "Building resource · Energy efficiency",
        description:
          "How Kiefer Built uses structural insulated panels to improve strength, reduce waste, and create more efficient homes.",
        href: "/why-kiefer-built/energy-efficiency",
        image: "/images/project-2/exterior-front-facade.jpg",
        imageAlt: "Finished dark-sided mountain home with a balcony and pine trees",
      },
      {
        title: "Efficiency and Comfort in a Modern Home",
        meta: "Building resource · Indoor air quality",
        description:
          "A practical view of how planning, insulation, window placement, and finish decisions shape the way a home lives.",
        href: "/why-kiefer-built/indoor-air-quality",
        image: "/images/project-3/interior-great-room-fireplace.jpg",
        imageAlt: "Greeley home exterior at twilight with an arched entry and stone columns",
      },
      {
        title: "SIPA-Recognized Energy-Efficient Home",
        meta: "Project overview · Red Feather Lakes",
        description:
          "A Red Feather Lakes project shows how modern building methods can support both mountain durability and daily comfort.",
        href: "/projects/mountain-modern",
        image: "/images/project-2/exterior-front-facade.jpg",
        imageAlt: "Two-story home with a gabled roof, large upper windows and a covered porch",
      },
    ],
  },
  services: {
    title: "Construction Services in Northern Colorado",
    description:
      "Explore kitchen remodeling, bathroom remodeling, cabinet replacement, basement finishing, custom homes, elevators and commercial construction in Northern Colorado.",
    heroImage: "/images/project-3/kitchen-island-living-view.jpg",
    heroAlt: "Custom kitchen and great room by Kiefer Built",
    primaryCta: cta,
    cardsLayout: "fourColumn",
    cards: [
      ...remodelingServices.map((service) => ({ title: service.title, description: service.intro, href: `/services/${service.slug}`, image: service.hero.src, imageAlt: service.hero.alt })),
      {
        title: "New Builds",
        description:
          "Custom homes, cabins, modern retreats, and energy-efficient builds planned around the way the owner wants to live.",
        href: "/services/home-building",
        image: "/images/project-3/exterior-twilight-front.jpg",
        imageSizes: "(max-width: 767px) 188vw, (max-width: 1279px) 94vw, 47vw",
        imageAlt: "Greeley home exterior with a stone entry, wood siding and a driveway at twilight",
      },
      {
        title: "Commercial Construction",
        description:
          "Commercial remodels, tenant improvements, and business spaces built around operations, durability, and schedule.",
        href: "/projects/commercial",
        image: "/images/kiefer-commercial-agfinity.jpg",
        imageSizes: "(max-width: 767px) 188vw, (max-width: 1279px) 94vw, 47vw",
        imageAlt: "Wood-finished stairs and upper-level railings inside a commercial space",
      },
      {
        title: "Custom Elevators",
        description:
          "Residential elevator builds and installations coordinated with framing, finishes, access, and designer-selected details.",
        href: "/services/custom-elevators",
        image: "/images/project-4/DSC05496.jpg",
        imageSizes: "(max-width: 767px) 188vw, (max-width: 1279px) 94vw, 47vw",
        imageAlt: "Glass elevator enclosure beside a doorway into a laundry room",
      },
    ],
  },
  products: {
    title: "Products and Finish Partners",
    description:
      "Selected products, cabinetry, and supplier relationships that help Kiefer Built deliver practical finish options with confidence.",
    heroImage: "/images/project-3/kitchen-perimeter.jpg",
    heroAlt: "Custom cabinetry and kitchen finishes by Kiefer Built",
    primaryCta: cta,
    secondaryCta: { label: "Vendor Interest", href: "/vendors" },
    intro: {
      title: "Cabinetry and materials with a builder's filter.",
      body:
        "Kiefer Built partners with suppliers that support reliable schedules, durable products, and finish options clients can understand before construction gets too far ahead.",
    },
    cards: [
      {
        title: "NorthPoint Cabinetry",
        meta: "Cabinet partner",
        description:
          "High-quality, accessible cabinet lines with solid wood construction, soft-close hardware, and practical finish options.",
        image: "/images/project-3/kitchen-overview.jpg",
        imageAlt: "Kitchen with a dark island, wood cabinets and recessed lighting",
      },
      {
        title: "Espresso",
        description:
          "A dark stained option that supports modern contrast, clean lines, and warm interior palettes.",
        image: "/images/project-3/kitchen-island-front.jpg",
        imageAlt: "Kitchen island beneath a wood-trimmed range hood with dark and wood cabinetry",
      },
      {
        title: "Pebble Grey",
        description:
          "A softer painted finish for kitchens, baths, and utility spaces that need light without feeling plain.",
        image: "/images/project-1/kitchen-6.jpg",
        imageAlt: "Kitchen range and stacked ovens with wood cabinets and a black hood",
      },
      {
        title: "Polar White",
        description:
          "A bright cabinet finish that pairs well with stone, tile, and clean modern trim packages.",
        image: "/images/project-1/kitchen-10.jpg",
        imageAlt: "Kitchen island with dark pendant lights, wood cabinets and large windows",
      },
    ],
  },
  process: {
    title: "A Design-Build Approach",
    description:
      "A practical process from consultation to construction, clear project communication, final walkthrough, and warranty support.",
    heroImage: "/images/project-3/interior-living-to-entry.jpg",
    heroAlt: "Finished custom home interior by Kiefer Built",
    primaryCta: cta,
    cards: [
      {
        title: "01 · Consultation",
        description:
          "Meet in person, review goals, site conditions, budget range, inspiration, floorplans, and fit.",
      },
      {
        title: "02 · Proposal and Planning",
        description:
          "Define scope, selections direction, schedule expectations, and the information needed before work begins.",
      },
      {
        title: "03 · Construction Begins",
        description:
          "Coordinate trades, materials, inspections, photos, schedule updates, and field decisions.",
      },
      {
        title: "04 · Project Communication",
        description:
          "Keep schedules, photos, field decisions, requests, and messages organized throughout construction.",
      },
      {
        title: "05 · Final Walkthrough",
        description:
          "Review the finished work, document final items, explain warranty expectations, and close the project properly.",
      },
    ],
  },
  homeBuilding: {
    title: "Custom Home Builder in Windsor, CO",
    description:
      "Kiefer Built Contracting builds custom homes, cabins, and modern retreats in Windsor and Northern Colorado, with planning, efficient systems, and long-term comfort in mind.",
    heroImage: "/images/project-2/exterior-front-facade.jpg",
    heroAlt: "Modern mountain home by Kiefer Built Contracting",
    primaryCta: cta,
    secondaryCta: { label: "View New Builds", href: "/projects/new-builds" },
    intro: {
      title: "Start with your property, priorities, and plans.",
      body: "Whether you are planning a full-time home or a mountain retreat, share your location, ideas, and project goals. Discuss the layout, materials, budget priorities, and construction approach with Kiefer Built before deciding the next steps. Explore completed homes and our construction process to see how those decisions come together.",
    },
    cards: [
      { title: "Explore Completed Custom Homes", description: "See the layouts, materials, and settings of Kiefer Built homes.", href: "/projects/new-builds" },
      { title: "Understand the Building Process", description: "Review the path from an initial conversation through construction and the final walkthrough.", href: "/process" },
      { title: "Check Our Service Areas", description: "Explore the Northern Colorado communities where we welcome project inquiries.", href: "/service-areas" },
    ],
    sections: [
      {
        title: "A home should reflect the way you actually live.",
        body:
          "Kiefer Built guides custom home clients from early ideas through plans, materials, budget decisions, and construction details so the finished home feels personal and durable.",
        image: "/images/project-3/interior-open-plan.jpg",
        imageAlt: "Open kitchen and living area with a dark island and wood flooring",
        points: ["Custom home design-build", "Cabins and retreats", "Modern family homes"],
      },
      {
        title: "EPS and SIP systems support performance.",
        body:
          "Structural insulated panels can improve energy efficiency, strength, and comfort. Kiefer Built uses these systems where they fit the project and client priorities.",
        image: "/images/project-2/exterior-winter-snow.jpg",
        imageAlt: "Foundation and wall framing at a construction site with hills in the distance",
        points: ["Energy efficiency", "Structural strength", "Flexible finishes"],
        dark: true,
      },
    ],
  },
  projects: {
    title: "Project Gallery",
    description:
      "Explore Kiefer Built work across new builds, commercial spaces, renovations, custom elevators, additions, kitchens, baths, and exterior improvements.",
    heroImage: "/images/project-3/aerial-front-twilight.jpg",
    heroAlt: "Aerial view of a Kiefer Built custom home",
    primaryCta: cta,
    cards: [
      {
        title: "Lakehouse Remodel",
        description: "Tour a completed renovation with warm wood cabinetry, connected gathering spaces, refreshed baths and a timber-framed deck.",
        href: "/projects/lakehouse-remodel",
        image: "/images/lakehouse-remodel/DSC06277.webp",
        imageAlt: "Lakehouse Remodel with a timber gable, broad deck and pergolas",
      },
      {
        title: "New Builds",
        description: "Space efficient homes, modern homes, barns, garages, and new construction projects.",
        href: "/projects/new-builds",
        image: "/images/project-3/exterior-front-daytime.jpg",
        imageAlt: "Greeley home front elevation with stone columns and an arched entry at twilight",
      },
      {
        title: "Commercial",
        description: "Business spaces, tenant improvements, remodels, and functional commercial interiors.",
        href: "/projects/commercial",
        image: "/images/kiefer-commercial-agfinity.jpg",
        imageAlt: "Wood-finished stairs and upper-level railings inside a commercial space",
      },
      {
        title: "Renovations & Additions",
        description: "Kitchens, bathrooms, living spaces, speakeasies, exteriors, additions, and custom improvements.",
        href: "/projects/renovations-additions",
        image: "/images/project-1/kitchen-8.jpg",
        imageAlt: "Kitchen with a dark island, wood cabinets and black pendant lights",
      },
      {
        title: "Custom Elevator Renovation",
        description: "A specialty home improvement combining custom elevator access, bathroom upgrades, and refined finish work.",
        href: "/services/custom-elevators",
        image: "/images/project-4/DSC05502.jpg",
        imageAlt: "Round glass elevator enclosure set into a finished room",
      },
      {
        title: "Greeley",
        description:
          "Tour the Greeley home in Northern Colorado, from its twilight exterior and open great room to custom cabinetry and primary-suite details.",
        href: "/projects/greeley",
        image: "/images/greeley/01-IMG_3586.webp",
        imageAlt: "Greeley home at twilight with a stone entry, dark siding and landscaped approach",
      },
      {
        title: "Mountain Modern",
        description:
          "Follow a Colorado mountain home through excavation, structure, exterior systems, solar, and the completed property.",
        href: "/projects/mountain-modern",
        image: "/images/project-2/exterior-panoramic.jpg",
        imageAlt: "Side of a dark-sided mountain home with a sloping metal roof and large boulders",
      },
    ],
  },
  newBuilds: {
    title: "New Builds",
    description:
      "New homes, modern builds, space efficient homes, barns, garages, and owner-led construction from first scope to final walkthrough.",
    heroImage: "/images/timnath/updated-20261117/133-web-or-mls-IMG_0153-TW2.webp",
    heroAlt: "Timnath home at twilight with dark siding, stone entry columns, warm exterior lighting and a landscaped front lawn",
    primaryCta: cta,
    secondaryCta: { label: "Explore The Homes ↓", href: "#project-tours" },
    projectShowcase: true,
    cards: [
      {
        title: "Greeley",
        description: "A stone entry, warm wood cabinetry, open living spaces and a finished basement. Explore the complete Greeley home tour.",
        image: "/images/greeley/01-IMG_3586.webp",
        imageAlt: "Greeley home at twilight with stone entry columns, dark siding and a broad driveway",
        href: "/projects/greeley",
        meta: "Home tour: Greeley",
      },
      {
        title: "Vetters",
        description:
          "Natural wood cabinetry, warm metal lighting, bright living spaces, and light-filled baths. Explore the complete home tour.",
        image: "/images/vetters/DSC03731.webp",
        imageAlt: "Vetters home with pale siding, a dark roof and a covered front porch",
        href: "/projects/vetters",
        meta: "Home tour: Vetters",
      },
      {
        title: "Red Feather Lakes",
        description:
          "A hillside mountain home with timber details, a light-filled great room, and a view deck among the pines.",
        image: "/images/red-feather-lakes/DSC00111.webp",
        imageAlt: "Gray Red Feather Lakes mountain home with a covered timber porch and pine trees",
        href: "/projects/red-feather-lakes",
        meta: "Home tour: Red Feather Lakes",
      },
      {
        title: "Timnath",
        description:
          "Warm wood, stone accents, open living spaces, a finished basement and a speakeasy. Tour the home inside and out.",
        image: "/images/timnath/updated-20261117/133-web-or-mls-IMG_0153-TW2.webp",
        imageAlt: "Timnath home at twilight with dark siding, stone entry columns and a landscaped front lawn",
        href: "/projects/timnath",
        meta: "Home tour: Timnath",
      },
      {
        title: "Berthoud",
        description:
          "Warm wood cabinetry, light-filled living spaces, and charcoal accents. Explore the complete home, inside and out.",
        image: "/images/berthoud/DSC03016.webp",
        imageAlt: "Berthoud home with light vertical siding, dark trim and wood-tone garage doors",
        href: "/projects/berthoud",
        meta: "Home tour: Berthoud",
      },
    ],
  },
  commercialProjects: {
    title: "Commercial Construction in Northern Colorado",
    description:
      "Commercial remodels, tenant improvements, and office buildouts in Windsor and Northern Colorado, coordinated by Kiefer Built Contracting around how your business operates.",
    heroImage: "/images/kiefer-commercial-agfinity.jpg",
    heroAlt: "Commercial interior project by Kiefer Built Contracting",
    primaryCta: cta,
    intro: {
      title: "Plan the space around the work it needs to support.",
      body: "A commercial remodel or tenant improvement starts with the intended use of the space. Share the property location, existing conditions, scope, and timing priorities with Kiefer Built. Discuss trade coordination, finishes, and how construction relates to business operations before agreeing on the next steps. The commercial interior shown here offers a look at our work; contact the team to discuss the requirements of your own project.",
    },
    cards: [
      { title: "Our Construction Process", description: "See how planning, communication, field decisions, and the final walkthrough fit together.", href: "/process" },
      { title: "Northern Colorado Service Areas", description: "Find our named communities and discuss whether your location and commercial scope are a fit.", href: "/service-areas" },
    ],
    sections: [
      {
        title: "Business spaces need clear coordination.",
        body:
          "Kiefer Built supports commercial remodels, tenant improvements, office buildouts, and specialized spaces with practical scopes, schedule awareness, and trade coordination.",
        image: "/images/kiefer-commercial-agfinity.jpg",
        imageAlt: "Wood-finished stairs and upper-level railings inside a commercial space",
        points: ["Tenant improvements", "Office buildouts", "Business remodels"],
      },
    ],
  },
  renovations: {
    title: "Renovations and Additions",
    description:
      "Existing homes upgraded with thoughtful planning, clean trade coordination, and finish work that belongs in the original structure.",
    heroImage: "/images/project-1/kitchen-8.jpg",
    heroAlt: "Kitchen renovation by Kiefer Built Contracting",
    primaryCta: cta,
    cards: [
      {
        title: "Kitchens",
        description: "Cabinetry, counters, lighting, layout changes, and finish coordination.",
        image: "/images/project-1/kitchen-4.jpg",
        imageAlt: "Kitchen range beneath a black hood with wood cabinetry and a tile backsplash",
      },
      {
        title: "Bathrooms",
        description: "Tile, vanities, fixtures, storage, and durable daily-use details.",
        image: "/images/project-3/interior-primary-bath.jpg",
        imageAlt: "Bathroom with wood vanity cabinets, round mirrors and a glass shower",
      },
      {
        title: "Living Spaces",
        description: "Open rooms, fireplaces, flooring, lighting, and better flow between spaces.",
        image: "/images/project-3/interior-great-room-wide.jpg",
        imageAlt: "Great room with a stone fireplace, wood flooring and sliding glass doors",
      },
      {
        title: "Speakeasies",
        description: "Intimate gathering spaces with bar cabinetry, game tables, comfortable seating and atmospheric lighting.",
        image: "/images/timnath/updated-20261117/38-web-or-mls-IMG_0048.webp",
        imageAlt: "Timnath speakeasy with bar seating, a round game table and illuminated shelving",
        href: "/projects/renovations-additions#speakeasies",
      },
      {
        title: "Exteriors",
        description: "Siding, entries, outdoor spaces, garage elevations, and curb appeal.",
        image: "/images/project-3/exterior-entry-close.jpg",
        imageAlt: "Dark front doors recessed inside a wood-clad entry",
      },
      {
        title: "Custom Elevators",
        description: "Residential elevator planning, finish coordination, and installation for homes that need better long-term access.",
        image: "/images/project-4/DSC05499.jpg",
        imageAlt: "Laundry room with white cabinets and a glass elevator enclosure at the side",
      },
    ],
  },
  testimonials: {
    title: "Establishing and Maintaining Good Relationships",
    description:
      "Clients consistently point to communication, craftsmanship, responsiveness, and trust as reasons they recommend Kiefer Built.",
    heroImage: "/images/project-3/interior-great-room-kitchen.jpg",
    heroAlt: "Finished Kiefer Built great room and kitchen",
    primaryCta: cta,
    testimonials: [
      {
        name: "Jeff T",
        project: "Flooring, tile, and cabinetry",
        summary:
          "Jeff described Mark as experienced, accountable, and willing to correct details so the finished work was done right.",
      },
      {
        name: "Al Baker",
        project: "Major remodel",
        summary:
          "Al valued the clear explanations, punctuality, subcontractor coordination, and the way issues were resolved quickly.",
      },
      {
        name: "Lindy Frieler",
        project: "Basement finish",
        summary:
          "Lindy highlighted a knowledgeable, respectful team and a finished basement that was ready for a growing family.",
      },
      {
        name: "Lori Johnstone",
        project: "Remodel planning",
        summary:
          "Lori pointed to communication, follow-through, options, and trust as the reasons she recommends Kiefer Built.",
      },
      {
        name: "Stephanie Smith",
        project: "Remodel and finish work",
        summary:
          "Stephanie emphasized integrity, courtesy, jobsite cleanliness, communication, and quality throughout the project.",
      },
    ],
  },
  careers: {
    title: "Build Your Future With Kiefer Built Contracting",
    description:
      "Join a Northern Colorado builder that values craftsmanship, steady communication, and people who take pride in doing the work right.",
    heroImage: "/images/project-3/exterior-entry-portico.jpg",
    heroAlt: "Kiefer Built custom home entry detail",
    primaryCta: {
      label: "Apply Now",
      href: "/careers#apply",
    },
    secondaryCta: {
      label: "Call With Questions",
      href: businessContact.telHref,
    },
    closingCta: {
      title: "Ready to build with us?",
      body: "Introduce yourself and share your résumé using the application above.",
      label: "Apply Now",
      href: "/careers#apply",
    },
    intro: {
      title: "A construction career with real projects and accountable standards.",
      body:
        "Kiefer Built works across custom homes, remodels, commercial projects, and performance-focused builds. The right team members are practical, respectful, detail-oriented, and comfortable communicating clearly with clients, trades, and managers.",
    },
    cards: [
      {
        title: "Project Manager",
        meta: "Leadership and coordination",
        description:
          "Lead schedules, trades, client communication, change requests, and jobsite details with the discipline needed to keep projects moving.",
        image: "/images/project-2/exterior-wide-property.jpg",
        imageAlt: "Mountain home across an open yard with a wooded hillside behind it",
      },
      {
        title: "Carpenter",
        meta: "Craft and field execution",
        description:
          "Support framing, finish work, repairs, remodels, and field details with clean work habits and pride in the finished product.",
        image: "/images/project-3/interior-great-room-fireplace.jpg",
        imageAlt: "Greeley home exterior at twilight with an arched entry and stone columns",
      },
      {
        title: "Trade Partners",
        meta: "Reliable specialists",
        description:
          "Kiefer Built values skilled trade partners who communicate, show up prepared, and protect the quality standard on each project.",
        image: "/images/kiefer-commercial-agfinity.jpg",
        imageAlt: "Wood-finished stairs and upper-level railings inside a commercial space",
      },
    ],
    sections: [
      {
        title: "Why work with Kiefer Built?",
        body:
          "Team members get to work on meaningful projects with a company that expects professionalism and supports better systems for communication, documentation, and follow-through.",
        points: ["Local projects", "Organized jobsites", "Room to grow"],
        dark: true,
      },
    ],
  },
  whyKieferBuilt: {
    title: "Why How You Build Matters",
    description:
      "A practical, research-backed guide to the envelope, air, energy, materials, and Colorado-specific details that shape a home's next forty years.",
    heroImage: "/images/project-2/exterior-wide-property.jpg",
    heroAlt: "High-performance mountain modern home built by Kiefer Built Contracting",
    primaryCta: cta,
    secondaryCta: { label: "See The Work", href: "/projects" },
    proof: [
      { value: "2–5×", label: "Some indoor pollutants versus outdoors", sourceId: 1 },
      { value: "40–50%", label: "DOE certified-home program, not a project guarantee", sourceId: 7 },
      { value: "Hail", label: "Colorado insurance planning", sourceId: 11 },
    ],
    intro: {
      title: "The finishes matter. The parts behind them matter longer.",
      body:
        "A forever home is experienced for decades after the final walkthrough. Kiefer Built starts with the questions that shape those years: how the shell controls air and moisture, what the mechanical system must overcome, and how the structure responds to Colorado weather. We educate first so buyers can decide where better performance is worth the up-front investment.",
    },
    cards: [
      {
        title: "SIPs 101",
        meta: "The envelope",
        description:
          "See how structural insulated panels change airtightness, whole-wall insulation, and tested structural performance.",
        href: "/why-kiefer-built/sips",
        image: "/images/project-2/exterior-front-facade.jpg",
        imageAlt: "Finished dark-sided mountain home with a balcony and pine trees",
      },
      {
        title: "Energy Efficiency",
        meta: "Measured performance",
        description:
          "Move beyond projections to a full year of Oak Ridge data, national DOE results, and a Colorado homeowner case study.",
        href: "/why-kiefer-built/energy-efficiency",
        image: "/images/project-2/exterior-winter-wide.jpg",
        imageAlt: "Foundation construction with framed walls and lifting equipment in an open landscape",
      },
      {
        title: "Indoor Air Quality",
        meta: "Health & comfort",
        description:
          "Learn why a leaky home and an airtight home without planned ventilation both miss half of the indoor-air problem.",
        href: "/why-kiefer-built/indoor-air-quality",
        image: "/images/project-3/interior-open-plan.jpg",
        imageAlt: "Open kitchen and living area with a dark island and wood flooring",
      },
      {
        title: "Built for Colorado",
        meta: "Hail, wildfire, snow & wind",
        description:
          "Connect material and structural decisions to the weather risks Northern Colorado homes actually face.",
        href: "/why-kiefer-built/built-for-colorado",
        image: "/images/project-2/exterior-winter-snow.jpg",
        imageAlt: "Foundation and wall framing at a construction site with hills in the distance",
      },
      {
        title: "Quality & Craftsmanship",
        meta: "The details",
        description:
          "See how owner accountability and moisture-aware material coordination protect the work long after move-in.",
        href: "/why-kiefer-built/quality",
        image: "/images/project-3/interior-great-room-wide.jpg",
        imageAlt: "Great room with a stone fireplace, wood flooring and sliding glass doors",
      },
      {
        title: "Cost Of Ownership",
        meta: "The long view",
        description:
          "Compare the lowest construction price with the energy, weather exposure, and repair costs that continue after closing.",
        href: "/why-kiefer-built/cost-of-ownership",
        image: "/images/project-2/exterior-panoramic.jpg",
        imageAlt: "Side of a dark-sided mountain home with a sloping metal roof and large boulders",
      },
    ],
    guideDownload: {
      label: "Download The Guide",
      href: "/guides/kiefer-built-homeowner-guide-2026.pdf",
      note: "2026 homeowner guide with practical project questions, sources and their limits.",
    },
  },
  sips: {
    title: "SIPs 101: The Shell Changes Everything",
    description:
      "Structural insulated panels combine structure and insulation in one engineered assembly, reducing the gaps and thermal bridges that limit conventional framing.",
    heroImage: "/images/project-2/exterior-front-facade.jpg",
    heroAlt: "Finished dark-sided mountain home with a balcony and pine trees",
    primaryCta: cta,
    secondaryCta: { label: "See Energy Efficiency", href: "/why-kiefer-built/energy-efficiency" },
    proof: [
      { value: "~15×", label: "Lower leakage in ORNL's best-sealed SIP test room", sourceId: 9 },
      { value: "Whole-wall", label: "Specify the complete assembly", sourceId: 3 },
      { value: "Tested", label: "Assembly-specific impact evidence", sourceId: 4 },
    ],
    intro: {
      title: "A wall performs as a whole wall, not a row of insulation cavities.",
      body:
        "A structural insulated panel bonds a rigid foam core between structural skins. Using that assembly for the shell can replace many separate framing and insulation steps with a continuous plane whose airtightness and whole-wall performance can be tested directly.",
    },
    sections: [
      {
        id: "wall-comparison",
        title: "Compare the assembly, not the insulation label.",
        feature: "wall-comparison",
        // The wall comparison cites ORNL (9) and SIPA (3); listing them keeps them in the page's sources.
        sourceIds: [9, 3],
        comparison: {
          columns: ["Wood-Framed Example", "SIP Example"],
          rows: [
            {
              label: "ORNL test rooms at 50 pascals",
              standard: "Comparison test room",
              kiefer: "~15× lower leakage with best sealing",
              sourceId: 9,
            },
            {
              label: "Whole-wall insulation value",
              standard: "Depends on framing and insulation",
              kiefer: "Depends on panel thickness and connections",
              sourceId: 3,
            },
            {
              label: "Structural and impact evidence",
              standard: "Verify specified assembly and site loads",
              kiefer: "SIPA reports a specific 6.5-inch panel impact test",
              sourceId: 4,
            },
          ],
        },
      },
      {
        title: "Use the system where it fits the project.",
        body:
          "SIPs are not a finish upgrade; they are an early structural and envelope decision. The useful question is whether their airtightness, continuous insulation, erection sequence, and tested wind performance match the site, design, budget, and long-term goals of a particular home.",
        image: "/images/project-2/exterior-winter-detail.jpg",
        imageAlt: "Exposed floor framing above a partially built foundation with equipment nearby",
        points: ["Project-specific engineering", "Envelope-first planning", "Documented tradeoffs"],
        sourceIds: [4, 9],
        dark: true,
      },
    ],
  },
  energyEfficiency: {
    title: "Energy Efficiency Measured, Not Promised",
    description:
      "Federal research and homeowner data show what happens when an airtight, well-insulated envelope works with right-sized mechanical systems.",
    heroImage: "/images/project-2/exterior-winter-wide.jpg",
    heroAlt: "Kiefer Built mountain home foundation and floor framing beside construction equipment",
    primaryCta: cta,
    secondaryCta: { label: "Understand Cost Of Ownership", href: "/why-kiefer-built/cost-of-ownership" },
    proof: [
      { value: "53%", label: "ORNL ZEH5 modeled comparison, excluding PV", sourceId: 6 },
      { value: "40–50%", label: "Typical DOE certified-home program improvement", sourceId: 7 },
      { value: "HERS 21", label: "Other builder's Durango case, including PV", sourceId: 8 },
    ],
    intro: {
      title: "Start with measured homes, not a manufacturer projection.",
      body:
        "Energy performance comes from the house working as one system: shell, air barrier, insulation, ventilation, and mechanical equipment. The strongest evidence tracks the energy that system actually used after people moved in.",
    },
    sections: [
      {
        title: "One full year under Oak Ridge instrumentation.",
        body:
          "ORNL monitored ZEH5 in Tennessee during November 2008–October 2009. Its report separates measured consumption from a calibrated-model comparison, which estimated 53% less energy than the modeled Building America benchmark without solar PV. SIPs, geothermal equipment and solar water heating worked together; that comparison does not measure the savings from SIPs alone or predict a Kiefer Built utility bill.",
        image: "/images/project-2/exterior-winter-snow.jpg",
        imageAlt: "Foundation and wall framing at a construction site with hills in the distance",
        points: ["Occupied-year measurements", "Modeled benchmark comparison", "Whole-home system"],
        sourceIds: [6],
      },
      {
        title: "Certification and Colorado case studies give useful context.",
        body:
          "DOE describes its certified Efficient New Homes, formerly Zero Energy Ready Homes, as typically 40–50% more efficient than typical new homes. Its 2015 Durango case describes Mantell-Hecathorn Builders' advanced wood-framed home: HERS 50 without solar PV and 21 with PV. This is another builder's whole-home rating, not a Kiefer Built certification or a measured bill forecast.",
        image: "/images/project-2/exterior-front-facade.jpg",
        imageAlt: "Finished dark-sided mountain home with a balcony and pine trees",
        points: ["Third-party certification", "Named Colorado case study", "Ratings and bills differ"],
        sourceIds: [7, 8],
        dark: true,
      },
      {
        title: "Airtightness reduces the load before equipment meets it.",
        body:
          "ORNL's best-sealed SIP test room had about fifteen times lower leakage than its wood-framed counterpart. Actual homes need their own blower-door results, ventilation plan and heating/cooling load calculations. Reducing uncontrolled leakage can help reduce conditioning loads; equipment sizing must still follow the specific home.",
        image: "/images/project-3/interior-great-room-fireplace.jpg",
        imageAlt: "Greeley home exterior at twilight with an arched entry and stone columns",
        points: ["Less uncontrolled leakage", "Steadier temperatures", "Right-sized systems"],
        sourceIds: [9, 6],
      },
    ],
  },
  quality: {
    title: "Quality Is the Detail That Still Works Later",
    description:
      "Owner accountability, careful coordination, and moisture-aware assemblies matter most after the finishes stop looking new.",
    heroImage: "/images/project-3/interior-great-room-wide.jpg",
    heroAlt: "Finished great room showing Kiefer Built craftsmanship and detail",
    primaryCta: cta,
    secondaryCta: { label: "Meet The Team", href: "/about/team" },
    proof: [
      { value: "Owner-led", label: "Family close to the decisions" },
      { value: "Layered", label: "Envelope, mechanicals, and finishes coordinated" },
      { value: "Verified", label: "Performance details can be documented" },
    ],
    intro: {
      title: "The details decide how a home ages.",
      body:
        "Finishes photograph well on day one. Craftsmanship shows up in year ten — in the trim that still lines up, the doors that still close true, and the systems that still perform. Kiefer Built builds for the long version of the story.",
    },
    sections: [
      {
        title: "A family standard.",
        body:
          "Mark and Mindy Kiefer built the company around direct communication and durable work, with Miles involved in estimating and project management. Decisions stay close to the people who own the outcome, so quality is not delegated away.",
        image: "/images/project-3/interior-open-plan.jpg",
        imageAlt: "Open kitchen and living area with a dark island and wood flooring",
        points: ["Owner involvement", "Clear communication", "Long-term durability"],
      },
      {
        title: "Durability begins behind the finish.",
        body:
          "EPA Indoor airPLUS requirements show what disciplined material coordination looks like: manage moisture, address combustion safety, plan ventilation, and select low-emission materials as connected parts of one system. Kiefer Built can use those principles to guide project-specific assemblies and selections without claiming every home carries that certification.",
        image: "/images/project-1/kitchen-8.jpg",
        imageAlt: "Kitchen with a dark island, wood cabinets and black pendant lights",
        points: ["Moisture control", "Ventilation planning", "Low-emission options"],
        sourceIds: [10],
        dark: true,
      },
    ],
  },
  costOfOwnership: {
    title: "Cheaper to Build Is Not Always Cheaper to Own",
    description:
      "The construction price is paid once. Energy use, weather exposure, maintenance, and repairs continue through every year you live in the home.",
    heroImage: "/images/project-2/exterior-panoramic.jpg",
    heroAlt: "Kiefer Built custom home on a Northern Colorado property",
    primaryCta: cta,
    secondaryCta: { label: "Start With SIPs 101", href: "/why-kiefer-built/sips" },
    proof: [
      { value: "40–50%", label: "DOE certified-home program, not bill savings", sourceId: 7 },
      { value: "HERS 21", label: "Other builder's Durango case with solar PV", sourceId: 8 },
      { value: "Hail", label: "Plan for coverage and replacement costs", sourceId: 11 },
    ],
    intro: {
      title: "A bid is a snapshot. Ownership is the full film.",
      body:
        "The right up-front decision is not automatically the most expensive one, and a high-performance feature is not automatically a good investment. The honest comparison asks what each choice changes over the years you expect to live there, then makes that tradeoff visible before construction.",
    },
    sections: [
      {
        title: "Energy costs repeat every month.",
        body:
          "DOE's typical 40–50% certified-home efficiency improvement is not a promise of the same percentage reduction in bills. Its 2015 Mantell-Hecathorn Durango case reports HERS 50 without solar PV and 21 with PV for an advanced wood-framed home. These ratings describe that project; actual costs depend on design, climate, energy prices and occupancy.",
        image: "/images/project-2/exterior-winter-wide.jpg",
        imageAlt: "Foundation construction with framed walls and lifting equipment in an open landscape",
        points: ["Recurring savings", "Case-specific results", "Transparent assumptions"],
        sourceIds: [7, 8],
      },
      {
        title: "Colorado weather belongs in the ownership budget.",
        body:
          "Colorado's Division of Insurance includes hail in its disaster-readiness guidance. Impact-rated roofing and durable exterior assemblies are options worth discussing alongside replacement costs, coverage terms and site exposure. Check the actual policy and insurer's requirements before assuming a premium discount or coverage benefit.",
        image: "/images/project-3/aerial-front-twilight.jpg",
        imageAlt: "Greeley home entrance and driveway viewed from above at twilight",
        points: ["Hail exposure", "Replacement cycles", "Insurance conversation"],
        sourceIds: [11],
        dark: true,
      },
      {
        title: "The most useful partner makes tradeoffs visible.",
        body:
          "Kiefer Built's role is to explain what a proposed assembly costs, what evidence supports it, and what risk or operating expense it may reduce. That is the long view behind a forever home: not the most features, but the clearest decisions for the next forty years of living there.",
        image: "/images/project-3/interior-open-plan.jpg",
        imageAlt: "Open kitchen and living area with a dark island and wood flooring",
        points: ["Open tradeoffs", "Evidence before upgrades", "Long-term fit"],
      },
    ],
    guideDownload: {
      label: "Download The Guide",
      href: "/guides/kiefer-built-homeowner-guide-2026.pdf",
      note: "2026 homeowner guide with practical project questions, sources and their limits.",
    },
  },
  indoorAirQuality: {
    title: "Indoor Air Quality Is a Building Decision",
    description:
      "A healthy-air strategy needs both halves: an airtight shell that stops random infiltration and planned ventilation that manages fresh air on purpose.",
    heroImage: "/images/project-3/interior-open-plan.jpg",
    heroAlt: "Bright Kiefer Built interior designed for comfort and indoor air quality",
    primaryCta: cta,
    secondaryCta: { label: "See Quality Details", href: "/why-kiefer-built/quality" },
    proof: [
      { value: "2–5×", label: "Some pollutant concentrations indoors versus out", sourceId: 1 },
      { value: "~90%", label: "Average time Americans spend indoors", sourceId: 1 },
      { value: "Both", label: "Airtightness and planned ventilation", sourceId: 1 },
    ],
    intro: {
      title: "The air inside behaves like its own weather system.",
      body:
        "Dust, moisture, combustion byproducts, and compounds released by materials are shaped by the shell and mechanical systems around them. Because people spend most of their time indoors, air management belongs in the design conversation—not as an accessory added after the plans are finished.",
    },
    sections: [
      {
        title: "A leaky home is not a naturally ventilated home.",
        body:
          "Cracks and gaps admit air from wherever pressure finds a path, along with pollen, smoke, garage contaminants, and moisture. EPA research reports some indoor pollutant concentrations at two to five times typical outdoor levels and explicitly warns that tighter construction without sufficient ventilation can also make the problem worse by trapping pollutants.",
        image: "/images/project-3/interior-great-room-wide.jpg",
        imageAlt: "Great room with a stone fireplace, wood flooring and sliding glass doors",
        points: ["Uncontrolled infiltration", "Trapped pollutants", "Moisture risk"],
        sourceIds: [1],
      },
      {
        title: "Airtight and ventilated—not one or the other.",
        body:
          "Plan fresh-air exchange alongside air sealing. A 2017 Austrian field study compared 123 modern homes with mechanical or natural ventilation. Residents reported better perceived air quality and climate with mechanical ventilation, while overall health did not differ significantly. This is not evidence that a particular Kiefer Built home prevents illness. A project can evaluate balanced, filtered ventilation for its specific design.",
        image: "/images/project-3/interior-great-room-fireplace.jpg",
        imageAlt: "Greeley home exterior at twilight with an arched entry and stone columns",
        points: ["Controlled fresh air", "Filtered intake", "Balanced system design"],
        sourceIds: [1, 2],
        dark: true,
      },
      {
        title: "Use a recognized standard to define the details.",
        body:
          "DOE Zero Energy Ready Home certification requires EPA Indoor airPLUS measures covering moisture control, combustion safety, ventilation, and low-emission material selection. Even when a project is not pursuing certification, those requirements provide a useful, specific framework for deciding what belongs in scope and how it will be verified.",
        image: "/images/project-3/interior-primary-bath.jpg",
        imageAlt: "Bathroom with wood vanity cabinets, round mirrors and a glass shower",
        points: ["Moisture management", "Combustion safety", "Low-emission choices"],
        sourceIds: [10, 7],
      },
    ],
  },
  builtForColorado: {
    title: "Built for the Colorado That Actually Shows Up",
    description:
      "Hail, fast-moving wildfire, local snow loads, and site-specific wind exposure turn resilience from a talking point into a design input.",
    heroImage: "/images/project-2/exterior-winter-snow.jpg",
    heroAlt: "ICF foundation walls and exposed floor framing at a Kiefer Built mountain site",
    primaryCta: cta,
    secondaryCta: { label: "Understand SIPs", href: "/why-kiefer-built/sips" },
    proof: [
      { value: "Hail", label: "Review roof options and insurance coverage", sourceId: 11 },
      { value: "1,084", label: "Homes destroyed in the Marshall Fire", sourceId: 12 },
      { value: "Local", label: "Snow and wind loads vary by site", sourceId: 13 },
    ],
    intro: {
      title: "Code establishes a floor. The site establishes the problem.",
      body:
        "Northern Colorado does not present one uniform hazard profile. The useful resilience conversation starts with the jurisdiction, elevation, exposure, insurance market, and owner priorities, then chooses assemblies that address the risks supported by that evidence.",
    },
    sections: [
      {
        title: "Hail is Colorado's recurring insurance event.",
        body:
          "Colorado's Division of Insurance identifies hail among the state's disaster risks and offers insurance guidance after storms. Compare impact-rated roofing and exterior options with site exposure, replacement cost and the actual coverage terms. A material rating is not a promise that a roof will survive every storm or qualify for an insurance discount.",
        image: "/images/project-2/exterior-front-facade.jpg",
        imageAlt: "Two-story home with a gabled roof, large upper windows and a covered porch",
        points: ["Hail exposure", "Impact-rated options", "Insurance coordination"],
        sourceIds: [11],
      },
      {
        title: "The Marshall Fire changed the wildfire map.",
        body:
          "The December 30, 2021 Marshall Fire destroyed 1,084 homes, according to Boulder County. CU Boulder researchers documented gusts exceeding 100 mph and compound fire hazards. It is a reminder to discuss site-specific fire exposure, exterior materials, vents, roofing and the area around the home with the project's qualified professionals.",
        image: "/images/project-2/exterior-panoramic.jpg",
        imageAlt: "Side of a dark-sided mountain home with a sloping metal roof and large boulders",
        points: ["Grass-driven fire", "Windborne embers", "Site-specific detailing"],
        sourceIds: [12],
        dark: true,
      },
      {
        title: "Snow and wind are local engineering numbers.",
        body:
          "Larimer County provides site-specific wind and snow resources. Ground snow load, roof snow load and ultimate wind speed are different inputs; verify the adopted requirements with the jurisdiction and engineer. Separately labeled SIP industry tests and storm anecdotes describe particular assemblies, not a universal wind rating or substitute for project engineering.",
        image: "/images/project-2/exterior-winter-wide.jpg",
        imageAlt: "Foundation construction with framed walls and lifting equipment in an open landscape",
        points: ["County-set loads", "Site exposure", "Engineer-led decisions"],
        sourceIds: [13],
        comparison: {
          columns: ["Generic Assumption", "Colorado-Ready Approach"],
          rows: [
            {
              label: "Snow-load basis",
              standard: "One default number",
              kiefer: "County and site-specific design",
              sourceId: 13,
            },
            {
              label: "Wind design",
              standard: "Jurisdictional minimum",
              kiefer: "Verify site-specific ultimate wind speed",
              sourceId: 13,
            },
            {
              label: "SIP wall testing",
              standard: "Code-required assembly",
              kiefer: "Specific 6.5-inch SIP debris-impact test reported by SIPA",
              sourceId: 4,
            },
            {
              label: "Severe-storm field report",
              standard: "Assembly performance varies",
              kiefer: "SIPA reports minimal Irma damage to a Ramrod Key MgO SIP home; different builder and system",
              sourceId: 5,
            },
          ],
        },
        dark: true,
      },
    ],
  },
};

export const flipbookPages = [
  {
    title: "Custom Homes",
    subtitle: "Ground-up homes with disciplined planning.",
    image: "/images/project-3/exterior-twilight-front.jpg",
  },
  {
    title: "Efficient Builds",
    subtitle: "SIP/EPS-ready projects built for performance.",
    image: "/images/project-2/exterior-front-facade.jpg",
  },
  {
    title: "Commercial Spaces",
    subtitle: "Functional business spaces with clear coordination.",
    image: "/images/kiefer-commercial-agfinity.jpg",
  },
  {
    title: "Renovations",
    subtitle: "Kitchens, baths, living spaces, speakeasies, and additions.",
    image: "/images/project-1/kitchen-8.jpg",
  },
  {
    title: "Finish Work",
    subtitle: "Details that make the structure feel complete.",
    image: "/images/project-3/interior-primary-bath.jpg",
  },
];
