export type PublicCard = {
  title: string;
  description: string;
  href?: string;
  image?: string;
  imagePosition?: string;
  meta?: string;
};

export type PublicSection = {
  id?: string;
  title: string;
  body: string;
  image?: string;
  points?: string[];
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
  }>;
  intro?: {
    title: string;
    body: string;
  };
  cards?: PublicCard[];
  sections?: PublicSection[];
  testimonials?: TestimonialSummary[];
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
        points: ["Owner involvement", "Transparent communication", "Organized decisions"],
      },
      {
        title: "Modern tools, traditional accountability.",
        body:
          "The company blends time-tested craftsmanship with project visibility, photo documentation, and client communication tools that keep homeowners and business owners informed.",
        image: "/images/project-1/kitchen-8.jpg",
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
        imagePosition: "center 28%",
      },
      {
        title: "Mindy Kiefer",
        meta: "CFO",
        description:
          "Mindy supports the financial and operational discipline that keeps projects organized, accountable, and grounded in real numbers.",
        image: "/images/team/mindy-kiefer.jpg",
        imagePosition: "center 30%",
      },
      {
        title: "Miles Kiefer",
        meta: "Estimator & Project Manager",
        description:
          "Miles helps translate early project ideas into scope, pricing, schedules, and day-to-day coordination that clients can follow.",
        image: "/images/team/miles-kiefer-tight.jpg",
        imagePosition: "center 24%",
      },
      {
        title: "Marlys Kiefer",
        meta: "COO",
        description:
          "Marlys supports the operational systems, team coordination, and follow-through that keep Kiefer Built projects moving with clarity.",
        image: "/images/team/marlys-kiefer.jpg",
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
        title: "2025 SIPA Building Excellence Award",
        meta: "Single Family Homes under 3,000 sq. ft.",
        description:
          "Kiefer Built's Red Feather Lakes project was recognized for its use of structural insulated panels, energy performance, durability, and sustainable construction.",
        image: "/images/project-2/exterior-front-balcony.jpg",
      },
      {
        title: "Best of Houzz Service",
        meta: "Client service recognition",
        description:
          "The award reflects the company's reputation for communication, follow-through, and detail-oriented project delivery.",
        image: "/images/project-1/interior-8.jpg",
      },
      {
        title: "Built to Perform",
        meta: "SIPs and efficient construction",
        description:
          "Kiefer Built uses modern building systems where they make sense, pairing energy performance with a comfortable finished home.",
        image: "/images/project-2/exterior-winter-wide.jpg",
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
        meta: "April 21, 2025 · Mark Kiefer",
        description:
          "A builder's look at how structural insulated panels support energy efficiency, comfort, and long-term performance.",
        image: "/images/project-2/exterior-winter-detail.jpg",
      },
      {
        title: "Building Smarter With SIPs",
        meta: "April 14, 2025 · Mark Kiefer",
        description:
          "How Kiefer Built uses structural insulated panels to improve strength, reduce waste, and create more efficient homes.",
        image: "/images/project-2/exterior-solar-shed.jpg",
      },
      {
        title: "Efficiency and Comfort in a Modern Home",
        meta: "March 19, 2025 · Mark Kiefer",
        description:
          "A practical view of how planning, insulation, window placement, and finish decisions shape the way a home lives.",
        image: "/images/project-3/interior-great-room-fireplace.jpg",
      },
      {
        title: "Award-Winning Energy-Efficient Home",
        meta: "March 19, 2025 · Mark Kiefer",
        description:
          "A Red Feather Lakes project shows how modern building methods can support both mountain durability and daily comfort.",
        image: "/images/project-2/exterior-front-facade.jpg",
      },
    ],
  },
  services: {
    title: "Your One Stop Shop",
    description:
      "Kiefer Built supports new homes, renovations, additions, custom elevators, and commercial construction with one accountable team.",
    heroImage: "/images/project-3/kitchen-island-living-view.jpg",
    heroAlt: "Custom kitchen and great room by Kiefer Built",
    primaryCta: cta,
    cardsLayout: "fourColumn",
    cards: [
      {
        title: "New Builds",
        description:
          "Custom homes, cabins, modern retreats, and energy-efficient builds planned around the way the owner wants to live.",
        href: "/services/home-building",
        image: "/images/project-3/exterior-twilight-front.jpg",
      },
      {
        title: "Renovations & Additions",
        description:
          "Kitchens, bathrooms, living spaces, exteriors, and additions coordinated with clear scope and clean execution.",
        href: "/projects/renovations-additions",
        image: "/images/project-1/kitchen-8.jpg",
      },
      {
        title: "Commercial Construction",
        description:
          "Commercial remodels, tenant improvements, and business spaces built around operations, durability, and schedule.",
        href: "/projects/commercial",
        image: "/images/kiefer-commercial-agfinity.jpg",
      },
      {
        title: "Custom Elevators",
        description:
          "Residential elevator builds and installations coordinated with framing, finishes, access, and designer-selected details.",
        href: "/services/custom-elevators",
        image: "/images/project-4/DSC05496.jpg",
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
      },
      {
        title: "Espresso",
        description:
          "A dark stained option that supports modern contrast, clean lines, and warm interior palettes.",
        image: "/images/project-3/kitchen-island-front.jpg",
      },
      {
        title: "Pebble Grey",
        description:
          "A softer painted finish for kitchens, baths, and utility spaces that need light without feeling plain.",
        image: "/images/project-1/kitchen-6.jpg",
      },
      {
        title: "Polar White",
        description:
          "A bright cabinet finish that pairs well with stone, tile, and clean modern trim packages.",
        image: "/images/project-1/kitchen-10.jpg",
      },
    ],
  },
  process: {
    title: "A Design-Build Approach",
    description:
      "A practical process from consultation to construction, client portal communication, final walkthrough, and warranty support.",
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
        title: "04 · Portal Communication",
        description:
          "Keep project information organized with schedules, photos, requests, expenses, and messages in one place.",
      },
      {
        title: "05 · Final Walkthrough",
        description:
          "Review the finished work, document final items, explain warranty expectations, and close the project properly.",
      },
    ],
  },
  homeBuilding: {
    title: "Custom Homes Built With Cutting-Edge Design and Technology",
    description:
      "Single-family homes, cabins, multifamily projects, and modern retreats built around client goals, efficient systems, and long-term comfort.",
    heroImage: "/images/project-2/exterior-front-facade.jpg",
    heroAlt: "Modern mountain home by Kiefer Built Contracting",
    primaryCta: cta,
    secondaryCta: { label: "View New Builds", href: "/projects/new-builds" },
    sections: [
      {
        title: "A home should reflect the way you actually live.",
        body:
          "Kiefer Built guides custom home clients from early ideas through plans, materials, budget decisions, and construction details so the finished home feels personal and durable.",
        image: "/images/project-3/interior-open-plan.jpg",
        points: ["Custom home design-build", "Cabins and retreats", "Modern family homes"],
      },
      {
        title: "EPS and SIP systems support performance.",
        body:
          "Structural insulated panels can improve energy efficiency, strength, and comfort. Kiefer Built uses these systems where they fit the project and client priorities.",
        image: "/images/project-2/exterior-winter-snow.jpg",
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
    cardsLayout: "fourColumn",
    cards: [
      {
        title: "New Builds",
        description: "Space efficient homes, modern homes, barns, garages, and new construction projects.",
        href: "/projects/new-builds",
        image: "/images/project-3/exterior-front-daytime.jpg",
      },
      {
        title: "Commercial",
        description: "Business spaces, tenant improvements, remodels, and functional commercial interiors.",
        href: "/projects/commercial",
        image: "/images/kiefer-commercial-agfinity.jpg",
      },
      {
        title: "Renovations & Additions",
        description: "Kitchens, bathrooms, living spaces, exteriors, additions, and custom improvements.",
        href: "/projects/renovations-additions",
        image: "/images/project-1/kitchen-8.jpg",
      },
      {
        title: "Custom Elevator Renovation",
        description: "A specialty home improvement combining custom elevator access, bathroom upgrades, and refined finish work.",
        href: "/services/custom-elevators",
        image: "/images/project-4/DSC05502.jpg",
      },
    ],
  },
  newBuilds: {
    title: "New Builds",
    description:
      "New homes, modern builds, space efficient homes, barns, garages, and owner-led construction from first scope to final walkthrough.",
    heroImage: "/images/project-3/exterior-garage-twilight.jpg",
    heroAlt: "New custom home and garage by Kiefer Built",
    primaryCta: cta,
    cards: [
      {
        title: "Space Efficient Homes",
        description:
          "Smart layouts, durable envelopes, and finish decisions that make the most of every square foot.",
        image: "/images/project-3/interior-open-plan.jpg",
      },
      {
        title: "Modern Homes",
        description:
          "Clean lines, natural light, efficient systems, and practical details built for Northern Colorado living.",
        image: "/images/project-2/exterior-front-balcony.jpg",
      },
      {
        title: "Barns and Garages",
        description:
          "Useful structures planned around storage, property needs, and long-term durability.",
        image: "/images/project-2/exterior-solar-shed.jpg",
      },
    ],
  },
  commercialProjects: {
    title: "Commercial Work",
    description:
      "Commercial spaces built around function, durability, schedule, and the way a business needs to operate.",
    heroImage: "/images/kiefer-commercial-agfinity.jpg",
    heroAlt: "Commercial interior project by Kiefer Built Contracting",
    primaryCta: cta,
    sections: [
      {
        title: "Business spaces need clear coordination.",
        body:
          "Kiefer Built supports commercial remodels, tenant improvements, office buildouts, and specialized spaces with practical scopes, schedule awareness, and trade coordination.",
        image: "/images/kiefer-commercial-agfinity.jpg",
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
      },
      {
        title: "Bathrooms",
        description: "Tile, vanities, fixtures, storage, and durable daily-use details.",
        image: "/images/project-3/interior-primary-bath.jpg",
      },
      {
        title: "Living Spaces",
        description: "Open rooms, fireplaces, flooring, lighting, and better flow between spaces.",
        image: "/images/project-3/interior-great-room-fireplace.jpg",
      },
      {
        title: "Exteriors",
        description: "Siding, entries, outdoor spaces, garage elevations, and curb appeal.",
        image: "/images/project-3/exterior-entry-close.jpg",
      },
      {
        title: "Custom Elevators",
        description: "Residential elevator planning, finish coordination, and installation for homes that need better long-term access.",
        image: "/images/project-4/DSC05499.jpg",
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
    secondaryCta: { label: "Leave A Review", href: "https://www.houzz.com/professionals/general-contractors/kiefer-built-contracting-pfvwus-pf~1042242452" },
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
      label: "Email Your Resume",
      href: "mailto:info@kbuiltco.com?subject=Careers at Kiefer Built Contracting",
    },
    secondaryCta: {
      label: "Contact The Team",
      href: "/contact",
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
      },
      {
        title: "Carpenter",
        meta: "Craft and field execution",
        description:
          "Support framing, finish work, repairs, remodels, and field details with clean work habits and pride in the finished product.",
        image: "/images/project-3/interior-great-room-fireplace.jpg",
      },
      {
        title: "Trade Partners",
        meta: "Reliable specialists",
        description:
          "Kiefer Built values skilled trade partners who communicate, show up prepared, and protect the quality standard on each project.",
        image: "/images/kiefer-commercial-agfinity.jpg",
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
    subtitle: "Kitchens, baths, living spaces, and additions.",
    image: "/images/project-1/kitchen-8.jpg",
  },
  {
    title: "Finish Work",
    subtitle: "Details that make the structure feel complete.",
    image: "/images/project-3/interior-primary-bath.jpg",
  },
];
