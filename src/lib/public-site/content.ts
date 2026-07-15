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
      {
        title: "Why Build With Kiefer Built",
        meta: "The difference",
        description:
          "SIPs construction, real energy efficiency, and family craftsmanship — see exactly why a Kiefer Built home is built better.",
        href: "/why-kiefer-built",
        image: "/images/project-2/exterior-wide-property.jpg",
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
      { value: "40–50%", label: "DOE ZERH efficiency versus a typical new home", sourceId: 7 },
      { value: "#2", label: "Colorado's national hail-claim rank", sourceId: 11 },
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
        image: "/images/project-2/exterior-solar-shed.jpg",
      },
      {
        title: "Energy Efficiency",
        meta: "Measured performance",
        description:
          "Move beyond projections to a full year of Oak Ridge data, national DOE results, and a Colorado homeowner case study.",
        href: "/why-kiefer-built/energy-efficiency",
        image: "/images/project-2/exterior-winter-wide.jpg",
      },
      {
        title: "Indoor Air Quality",
        meta: "Health & comfort",
        description:
          "Learn why a leaky home and an airtight home without planned ventilation both miss half of the indoor-air problem.",
        href: "/why-kiefer-built/indoor-air-quality",
        image: "/images/project-3/interior-open-plan.jpg",
      },
      {
        title: "Built for Colorado",
        meta: "Hail, wildfire, snow & wind",
        description:
          "Connect material and structural decisions to the weather risks Northern Colorado homes actually face.",
        href: "/why-kiefer-built/built-for-colorado",
        image: "/images/project-2/exterior-winter-snow.jpg",
      },
      {
        title: "Quality & Craftsmanship",
        meta: "The details",
        description:
          "See how owner accountability and moisture-aware material coordination protect the work long after move-in.",
        href: "/why-kiefer-built/quality",
        image: "/images/project-3/interior-great-room-wide.jpg",
      },
      {
        title: "Cost Of Ownership",
        meta: "The long view",
        description:
          "Compare the lowest construction price with the energy, weather exposure, and repair costs that continue after closing.",
        href: "/why-kiefer-built/cost-of-ownership",
        image: "/images/project-2/exterior-panoramic.jpg",
      },
    ],
    guideDownload: {
      label: "Download The Guide",
      href: "/guides/kiefer-built-homeowner-guide.pdf",
      note: "Read the complete 19-page case for healthier, more efficient, Colorado-ready homebuilding.",
    },
  },
  sips: {
    title: "SIPs 101: The Shell Changes Everything",
    description:
      "Structural insulated panels combine structure and insulation in one engineered assembly, reducing the gaps and thermal bridges that limit conventional framing.",
    heroImage: "/images/project-2/exterior-solar-shed.jpg",
    heroAlt: "Kiefer Built home under construction using structural insulated panels",
    primaryCta: cta,
    secondaryCta: { label: "See Energy Efficiency", href: "/why-kiefer-built/energy-efficiency" },
    proof: [
      { value: "~15×", label: "Tighter in Oak Ridge blower-door testing", sourceId: 9 },
      { value: "≈ R-14", label: "Reported SIP whole-wall performance", sourceId: 3 },
      { value: "140+ mph", label: "Simulated wind-load testing", sourceId: 4 },
    ],
    intro: {
      title: "A wall performs as a whole wall, not a row of insulation cavities.",
      body:
        "A structural insulated panel bonds a rigid foam core between structural skins. Using that assembly for the shell can replace many separate framing and insulation steps with a continuous plane whose airtightness and whole-wall performance can be tested directly.",
    },
    sections: [
      {
        title: "Compare the assembly, not the insulation label.",
        body:
          "Oak Ridge blower-door testing found approximately 90% less leakage in a SIP test room than in an equivalent stick-framed room with fiberglass insulation. Industry technical data, informed by whole-wall research, reports roughly R-14 for a SIP wall versus R-9.5 for standard 2×4 framing after the framing itself is accounted for.",
        image: "/images/project-2/exterior-front-facade.jpg",
        points: ["Continuous insulation", "Fewer leakage paths", "Whole-wall performance"],
        sourceIds: [9, 3],
        comparison: {
          columns: ["Standard Stick-Frame", "Kiefer Built SIP"],
          rows: [
            {
              label: "Air leakage, blower-door tested",
              standard: "Baseline",
              kiefer: "~15× tighter",
              sourceId: 9,
            },
            {
              label: "Whole-wall insulation value",
              standard: "≈ R-9.5",
              kiefer: "≈ R-14",
              sourceId: 3,
            },
            {
              label: "Tested wind resistance",
              standard: "Code-required assembly",
              kiefer: "140+ mph simulated loads",
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
    heroAlt: "High-performance Kiefer Built home in a Colorado winter",
    primaryCta: cta,
    secondaryCta: { label: "Understand Cost Of Ownership", href: "/why-kiefer-built/cost-of-ownership" },
    proof: [
      { value: "50%", label: "Less energy in ORNL's metered ZEH5 study", sourceId: 6 },
      { value: "40–50%", label: "Typical DOE ZERH efficiency improvement", sourceId: 7 },
      { value: "~$350", label: "Propane across a Durango heating season", sourceId: 8 },
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
          "Oak Ridge National Laboratory and the U.S. Department of Energy monitored ZEH5, a 2,632-square-foot SIP demonstration home, for a full year. With an airtight envelope, mechanical ventilation, and extensive moisture controls, it used 50% less energy than the DOE Building America benchmark.",
        image: "/images/project-2/exterior-winter-snow.jpg",
        points: ["Federally monitored", "Full-year data", "1.65 ACH50 envelope"],
        sourceIds: [6],
      },
      {
        title: "The result also appears at national and Colorado scale.",
        body:
          "More than 12,000 DOE Zero Energy Ready Homes are typically 40–50% more efficient than a typical new home. In one DOE Tour of Zero case study, the owner of a 3,800-square-foot Durango home reported near-zero electric costs and about $350 in propane from July through May. That is a case study, not a promise for every home, but it makes the long-term opportunity concrete.",
        image: "/images/project-2/exterior-solar-shed.jpg",
        points: ["12,000+ certified homes", "Colorado case study", "Results, not guarantees"],
        sourceIds: [7, 8],
        dark: true,
      },
      {
        title: "Airtightness reduces the load before equipment meets it.",
        body:
          "Oak Ridge testing found a SIP test room roughly fifteen times tighter than its stick-framed counterpart. Less uncontrolled leakage means the mechanical system is not constantly replacing conditioned air lost through cracks; related Building America SIP research reported reaching the same comfort target with substantially smaller HVAC equipment.",
        image: "/images/project-3/interior-great-room-fireplace.jpg",
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
        points: ["Owner involvement", "Clear communication", "Long-term durability"],
      },
      {
        title: "Durability begins behind the finish.",
        body:
          "EPA Indoor airPLUS requirements show what disciplined material coordination looks like: manage moisture, address combustion safety, plan ventilation, and select low-emission materials as connected parts of one system. Kiefer Built can use those principles to guide project-specific assemblies and selections without claiming every home carries that certification.",
        image: "/images/project-1/kitchen-8.jpg",
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
      { value: "40–50%", label: "Typical DOE ZERH efficiency improvement", sourceId: 7 },
      { value: "~$350", label: "Durango case-study propane cost", sourceId: 8 },
      { value: "#2", label: "Colorado's national hail-claim rank", sourceId: 11 },
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
          "DOE-certified Zero Energy Ready Homes are typically 40–50% more efficient than typical new homes. A Durango case study makes the scale tangible: one owner reported near-zero electric costs and about $350 in propane over a ten-month heating season in a 3,800-square-foot home. Actual savings depend on design, climate, fuel prices, and occupant behavior.",
        image: "/images/project-2/exterior-winter-wide.jpg",
        points: ["Recurring savings", "Case-specific results", "Transparent assumptions"],
        sourceIds: [7, 8],
      },
      {
        title: "Colorado weather belongs in the ownership budget.",
        body:
          "Colorado ranks second nationally for hail insurance claims, and hail led the state's insured losses in eight of eleven reported years. Impact-rated roofing and durable exterior assemblies are therefore not just finish choices; they are options worth pricing against replacement cycles, insurance terms, and site exposure.",
        image: "/images/project-3/aerial-front-twilight.jpg",
        points: ["Hail exposure", "Replacement cycles", "Insurance conversation"],
        sourceIds: [11],
        dark: true,
      },
      {
        title: "The most useful partner makes tradeoffs visible.",
        body:
          "Kiefer Built's role is to explain what a proposed assembly costs, what evidence supports it, and what risk or operating expense it may reduce. That is the long view behind a forever home: not the most features, but the clearest decisions for the next forty years of living there.",
        image: "/images/project-3/interior-open-plan.jpg",
        points: ["Open tradeoffs", "Evidence before upgrades", "Long-term fit"],
      },
    ],
    guideDownload: {
      label: "Download The Guide",
      href: "/guides/kiefer-built-homeowner-guide.pdf",
      note: "Use the full 19-page guide to compare health, energy, resilience, and long-term value before you build.",
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
        points: ["Uncontrolled infiltration", "Trapped pollutants", "Moisture risk"],
        sourceIds: [1],
      },
      {
        title: "Airtight and ventilated—not one or the other.",
        body:
          "The building-science answer is to reduce uncontrolled leakage and then engineer fresh-air exchange deliberately. Peer-reviewed field research found occupants of highly efficient, mechanically ventilated homes rated indoor air quality and comfort significantly higher than a standard-construction control group. A Kiefer Built project can evaluate balanced, filtered ventilation as part of its complete envelope and mechanical design.",
        image: "/images/project-3/interior-great-room-fireplace.jpg",
        points: ["Controlled fresh air", "Filtered intake", "Balanced system design"],
        sourceIds: [1, 2],
        dark: true,
      },
      {
        title: "Use a recognized standard to define the details.",
        body:
          "DOE Zero Energy Ready Home certification requires EPA Indoor airPLUS measures covering moisture control, combustion safety, ventilation, and low-emission material selection. Even when a project is not pursuing certification, those requirements provide a useful, specific framework for deciding what belongs in scope and how it will be verified.",
        image: "/images/project-3/interior-primary-bath.jpg",
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
    heroAlt: "Kiefer Built mountain home designed for Northern Colorado weather",
    primaryCta: cta,
    secondaryCta: { label: "Understand SIPs", href: "/why-kiefer-built/sips" },
    proof: [
      { value: "#2", label: "Colorado's national hail-claim rank", sourceId: 11 },
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
          "The Front Range sits in Hail Alley, Colorado ranks second nationally in hail claims, and hail drove the state's insured losses in eight of eleven reported years. The May 2017 Denver-metro storm alone caused an estimated $2.3 billion in damage. Class 4 impact-resistant roofing and durable exterior choices are options to evaluate against site exposure, insurer requirements, and replacement cost—not automatic promises about every project.",
        image: "/images/project-2/exterior-front-facade.jpg",
        points: ["Hail Alley exposure", "Impact-rated options", "Insurance coordination"],
        sourceIds: [11],
      },
      {
        title: "The Marshall Fire changed the wildfire map.",
        body:
          "Wind gusts above 100 mph drove the December 2021 Marshall Fire through Boulder County grass and subdivisions, destroying 1,084 homes in roughly six hours. More than half of Coloradans live in the wildland-urban interface. Depending on the site, the design conversation can include ignition-resistant materials, protected vents, Class A roofing, and noncombustible zones at grade.",
        image: "/images/project-2/exterior-panoramic.jpg",
        points: ["Grass-driven fire", "Windborne embers", "Site-specific detailing"],
        sourceIds: [12],
        dark: true,
      },
      {
        title: "Snow and wind are local engineering numbers.",
        body:
          "Colorado snow loads are set locally and change sharply with elevation. Larimer County references Structural Engineers Association of Colorado data and applies site-dependent roof and wind requirements; current county guidance includes a minimum uniform roof snow load of 35 psf and basic wind speeds from 115 to 225 mph depending on location. SIP industry tests and storm case reporting add useful—but separately labeled—evidence about panel performance.",
        image: "/images/project-2/exterior-winter-wide.jpg",
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
              label: "Basic wind speed",
              standard: "Jurisdictional minimum",
              kiefer: "115–225 mph in Larimer County, site dependent",
              sourceId: 13,
            },
            {
              label: "SIP wall testing",
              standard: "Code-required assembly",
              kiefer: "140+ mph simulated loads",
              sourceId: 4,
            },
            {
              label: "Severe-storm field report",
              standard: "Assembly performance varies",
              kiefer: "Ramrod Key SIP home remained structurally intact",
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
    subtitle: "Kitchens, baths, living spaces, and additions.",
    image: "/images/project-1/kitchen-8.jpg",
  },
  {
    title: "Finish Work",
    subtitle: "Details that make the structure feel complete.",
    image: "/images/project-3/interior-primary-bath.jpg",
  },
];
