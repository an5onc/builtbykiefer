import type { TestimonialSummary } from "./content";

export type ServiceProjectPhoto = {
  src: string;
  alt: string;
  caption: string;
  project: { name: string; href: string; context: "Completed remodel" | "Custom home" };
};

export type RemodelingService = {
  slug: string;
  title: string;
  projectType: string;
  headline: string;
  description: string;
  intro: string;
  hero: ServiceProjectPhoto;
  proofTitle: string;
  proofDescription: string;
  projectLink: string;
  projectLabel: string;
  photos: ServiceProjectPhoto[];
  testimonial: TestimonialSummary;
  scope: { title: string; body: string }[];
  fit: string;
  qualification: string;
  question: string;
};

const projects = {
  lakehouse: { name: "Lakehouse Remodel", href: "/projects/lakehouse-remodel", context: "Completed remodel" },
  timnath: { name: "Timnath", href: "/projects/timnath", context: "Custom home" },
  redFeather: { name: "Red Feather Lakes", href: "/projects/red-feather-lakes", context: "Custom home" },
  greeley: { name: "Greeley", href: "/projects/greeley", context: "Custom home" },
} as const;

function projectPhoto(project: keyof typeof projects, src: string, caption: string, alt: string): ServiceProjectPhoto {
  return { project: projects[project], src, caption, alt };
}

const kitchenPhotos = [
  projectPhoto("lakehouse", "/images/lakehouse-remodel/DSC05814-HDR.webp", "Warm wood cabinetry and a dark waterfall island", "Lakehouse Remodel kitchen with wood cabinetry, a dark waterfall island and pendant lighting"),
  projectPhoto("timnath", "/images/timnath/updated-20261117/13-web-or-mls-IMG_9680.webp", "Natural wood and dark cabinetry around a generous island", "Timnath kitchen with natural wood and dark cabinetry, a pale stone island, woven stools and pendant lights"),
  projectPhoto("redFeather", "/images/red-feather-lakes/DSC09816.webp", "Two-tone cabinetry beneath exposed timber beams", "Red Feather Lakes kitchen with dark wood cabinets, pale upper cabinets and a white-topped island"),
  projectPhoto("greeley", "/images/greeley/02-IMG_3801.webp", "Wood cabinetry, a contrasting island and open sightlines", "Greeley kitchen with wood perimeter cabinets, a dark island and recessed lighting"),
  projectPhoto("lakehouse", "/images/lakehouse-remodel/DSC06165-HDR.webp", "A dedicated beverage nook with shelving and cold storage", "Lakehouse Remodel beverage nook with wood shelves and an undercounter refrigerator"),
  projectPhoto("timnath", "/images/timnath/updated-20261117/16-web-or-mls-IMG_9710.webp", "Island prep space connected to the great room", "Timnath kitchen island with a sink and dark faucet facing the stone dining wall and open great room"),
];

const bathroomPhotos = [
  projectPhoto("timnath", "/images/timnath/updated-20261117/25-web-or-mls-IMG_9835.webp", "Natural wood vanity and a freestanding tub", "Timnath primary bathroom with a long wood double vanity, tall mirrors and a freestanding tub beyond"),
  projectPhoto("lakehouse", "/images/lakehouse-remodel/DSC05960-HDR.webp", "Arched mirrors, pale cabinetry and a glass shower", "Lakehouse Remodel bathroom with a double vanity, arched mirrors and glass shower"),
  projectPhoto("redFeather", "/images/red-feather-lakes/DSC09927.webp", "Dark wood storage and copper-toned vessel sinks", "Red Feather Lakes double vanity with dark wood cabinets, copper-toned vessel sinks and framed mirrors"),
  projectPhoto("greeley", "/images/greeley/03-IMG_3735.webp", "Warm wood vanities against a dark accent wall", "Greeley primary bathroom with wood vanities, oval mirrors and a dark tile accent wall"),
  projectPhoto("timnath", "/images/timnath/updated-20261117/28-web-or-mls-IMG_9885.webp", "Glass, pale tile and coordinated shower finishes", "Timnath glass shower with pale wall tile, a built-in bench, recessed shelves and coordinated fittings"),
  projectPhoto("lakehouse", "/images/lakehouse-remodel/DSC05887-HDR.webp", "A wood vanity paired with a distinctive mural", "Lakehouse Remodel powder room with a wood vanity and heron mural"),
];

const cabinetPhotos = [
  projectPhoto("greeley", "/images/greeley/21-IMG_3708.webp", "Perimeter storage, an integrated hood and open shelving", "Greeley kitchen with warm wood cabinetry, an integrated hood and open display shelves"),
  projectPhoto("lakehouse", "/images/lakehouse-remodel/DSC05793-HDR.webp", "Full-height storage and appliance integration", "Lakehouse Remodel full-height wood cabinets with integrated wall appliances"),
  projectPhoto("timnath", "/images/timnath/updated-20261117/13-web-or-mls-IMG_9680.webp", "Wood cabinetry and a contrasting island", "Timnath kitchen with natural wood and dark cabinetry, a pale stone island, woven stools and pendant lights"),
  projectPhoto("redFeather", "/images/red-feather-lakes/DSC09828.webp", "Tall appliance cabinetry and contrasting worktops", "Red Feather Lakes dark wood appliance cabinetry beside the kitchen island"),
  projectPhoto("timnath", "/images/timnath/updated-20261117/26-web-or-mls-IMG_9850.webp", "Bathroom storage with pale counters and warm wood", "Timnath bathroom vanity with pale counters, wood storage and a freestanding tub beneath an arched niche"),
  projectPhoto("redFeather", "/images/red-feather-lakes/DSC09945.webp", "Beverage storage beneath a patterned backsplash", "Red Feather Lakes beverage refrigerator integrated into dark wood cabinetry below patterned tile"),
];

const basementPhotos = [
  projectPhoto("timnath", "/images/timnath/basement-open-living-space.webp", "Open basement with wood-tone flooring and a dark slatted feature wall", "Timnath basement with wood-tone flooring, a dark slatted feature wall, exposed dark beams and stairs"),
  projectPhoto("greeley", "/images/project-3/basement-recreation-room.webp", "Carpeted recreation space with recessed lighting and a wood support post", "Greeley basement with pale carpet, recessed lighting, white walls and a wood support post"),
  projectPhoto("timnath", "/images/timnath/updated-20261117/38-web-or-mls-IMG_0048.webp", "Speakeasy bar, seating and a game table", "Timnath speakeasy with a round game table, blue upholstered seating and a bar with illuminated shelves"),
  projectPhoto("redFeather", "/images/red-feather-lakes/DSC00030.webp", "Media room with storage and flexible seating", "Red Feather Lakes media room with a sofa, television, long media cabinet and upright piano"),
  projectPhoto("timnath", "/images/timnath/updated-20261117/40-web-or-mls-IMG_0063.webp", "Speakeasy pool table and gathering space", "Timnath speakeasy with a pool table, wood-pattern flooring, dark walls and upholstered seating"),
];

export const remodelingServices: RemodelingService[] = [
  {
    slug: "kitchen-remodeling", title: "Kitchen Remodeling", projectType: "Kitchen remodel",
    headline: "A kitchen built around the way you live.",
    description: "Kitchen remodeling in Windsor and Northern Colorado. Explore Kiefer Built kitchens across completed projects and discuss cabinetry, layout, counters, lighting and a coordinated renovation.",
    intro: "Bring storage, prep space and gathering into one considered plan. Kiefer Built coordinates kitchen renovations from the existing layout through cabinetry, surfaces and the final details.",
    hero: kitchenPhotos[0],
    proofTitle: "Kitchens with different styles, built by Kiefer",
    proofDescription: "Compare the completed Lakehouse renovation with kitchen design and finish examples from Timnath, Red Feather Lakes and Greeley. Each photograph links to its own project tour. Custom-home examples are labeled separately from remodel work.",
    projectLink: "/projects/lakehouse-remodel", projectLabel: "Explore the Lakehouse Remodel",
    photos: kitchenPhotos,
    testimonial: { name: "Al Baker", project: "Major remodel", summary: "Al valued the clear explanations, punctuality, subcontractor coordination, and the way issues were resolved quickly." },
    scope: [
      { title: "Layout and everyday flow", body: "Discuss prep zones, appliance placement, storage and connections to dining and living areas. Structural changes are evaluated for the specific home." },
      { title: "Cabinetry and surfaces", body: "Coordinate cabinet replacement, islands, counters, backsplash and finish details around the agreed renovation scope." },
      { title: "Trades and finishing", body: "Plan lighting, plumbing and electrical changes with the work sequence, followed by flooring, trim and a final walkthrough." },
    ],
    fit: "A good fit for homeowners planning a coordinated kitchen renovation, including cabinetry and related finish or layout changes.",
    qualification: "For a cabinet-only installation project, explore our cabinet replacement service. Share whether you want to keep the existing kitchen layout or rework the room.",
    question: "What would you change about your kitchen? Tell us about the layout, cabinetry, appliances and any timing or budget you have in mind.",
  },
  {
    slug: "bathroom-remodeling", title: "Bathroom Remodeling", projectType: "Bathroom remodel",
    headline: "Make the whole bathroom work better.",
    description: "Bathroom remodeling and complete renovations in Windsor and Northern Colorado. Explore completed Kiefer Built bathrooms and request a project consultation.",
    intro: "Plan the shower, vanity, tile, lighting and storage together. Kiefer Built brings the construction details into one coordinated bathroom renovation, with attention to daily use and lasting finishes.",
    hero: bathroomPhotos[0],
    proofTitle: "Bathroom ideas from four completed projects",
    proofDescription: "Explore the Lakehouse renovation alongside custom-home bathrooms from Timnath, Red Feather Lakes and Greeley: pale and dark cabinetry, wood vanities, vessel sinks and coordinated shower finishes. Each image identifies its source project.",
    projectLink: "/projects/lakehouse-remodel", projectLabel: "See the completed Lakehouse Remodel",
    photos: bathroomPhotos,
    testimonial: { name: "Stephanie Smith", project: "Remodel and finish work", summary: "Stephanie emphasized integrity, courtesy, jobsite cleanliness, communication, and quality throughout the project." },
    scope: [
      { title: "Complete room planning", body: "Review the existing bathroom, the desired layout, storage and daily-use needs before defining the renovation scope." },
      { title: "Wet areas and systems", body: "Coordinate shower or tub work, tile, waterproofing, ventilation and any required plumbing or electrical changes." },
      { title: "Vanities and finishing", body: "Bring cabinetry, counters, mirrors, lighting, glass and hardware together with the surrounding finishes." },
    ],
    fit: "A good fit for complete bathroom renovations, primary bath updates and coordinated shower, vanity and tile projects.",
    qualification: "This is a construction and renovation service. For fixture shopping, replacement parts or a small repair, a retail supplier or repair specialist may be a better starting point.",
    question: "Which bathroom are you renovating? Describe the shower or tub, vanity, layout changes and any timing or budget you have in mind.",
  },
  {
    slug: "cabinet-replacement", title: "Cabinet Replacement", projectType: "Cabinet replacement",
    headline: "New cabinetry. A better use of your space.",
    description: "Professional cabinet replacement and installation in Northern Colorado. Discuss removal, cabinet layout, installation and related finishes with Kiefer Built.",
    intro: "Replace worn or impractical cabinetry with storage that fits the room. Kiefer Built coordinates cabinet replacement and installation with the counters, appliances and finishes the project touches.",
    hero: cabinetPhotos[0],
    proofTitle: "Cabinetry in a range of styles and spaces",
    proofDescription: "See cabinetry from the Lakehouse Remodel and three completed custom homes: Greeley, Timnath and Red Feather Lakes. These examples show storage and finish possibilities; custom-home photos are not presented as cabinet replacement jobs.",
    projectLink: "/projects/lakehouse-remodel", projectLabel: "View the Lakehouse cabinetry in context",
    photos: cabinetPhotos,
    testimonial: { name: "Jeff T", project: "Flooring, tile, and cabinetry", summary: "Jeff described Mark as experienced, accountable, and willing to correct details so the finished work was done right." },
    scope: [
      { title: "Replacement scope", body: "Review which cabinets are coming out, what storage you need and whether the existing footprint will stay." },
      { title: "Installation coordination", body: "Discuss cabinet selection, measurements, removal and installation. Confirm purchasing responsibilities and material requirements during planning." },
      { title: "Connected finishes", body: "Account for counters, backsplash, trim, hardware and appliance or utility adjustments affected by the installation." },
    ],
    fit: "A good fit for homeowners seeking professional removal and installation of replacement cabinetry, with a defined room and construction scope.",
    qualification: "We provide a project-based installation service, rather than retail cabinet sales. Tell us whether you already have cabinets, need help coordinating a selection, or are considering a full kitchen remodel. Product-only, single-hardware and cabinet repair inquiries may be better served by a supplier or repair specialist.",
    question: "Which room and how many cabinets are involved? Are cabinets already purchased? Describe removal, installation and any counter or layout changes, plus timing or budget if known.",
  },
  {
    slug: "basement-remodeling", title: "Basement Remodeling", projectType: "Basement finish",
    headline: "Bring more of your home into everyday life.",
    description: "Basement finishing and remodeling in Windsor and Northern Colorado. Discuss gathering spaces, bathrooms, storage and project fit with Kiefer Built.",
    intro: "Turn an unfinished or outdated lower level into useful living space. Start with the rooms you need, then work through the existing conditions, construction requirements and finish plan.",
    hero: basementPhotos[0],
    proofTitle: "Basement spaces with room to gather",
    proofDescription: "Explore the open basement at Timnath, the carpeted recreation room at Greeley, Timnath’s speakeasy gathering spaces and the Red Feather Lakes media room. Each photograph links to its source project. These examples are finished spaces in custom homes; the scope for remodeling an existing basement is reviewed during consultation.",
    projectLink: "/projects/timnath", projectLabel: "Explore the Timnath project",
    photos: basementPhotos,
    testimonial: { name: "Lindy Frieler", project: "Basement finish", summary: "Lindy highlighted a knowledgeable, respectful team and a finished basement that was ready for a growing family." },
    scope: [
      { title: "Existing conditions first", body: "Review the lower level’s current finish, moisture concerns, headroom and access. Scope depends on the home and local requirements." },
      { title: "Rooms with a purpose", body: "Discuss gathering rooms, storage, a bar or bathroom, and any proposed bedroom. Egress and other code requirements must be evaluated before confirming a layout." },
      { title: "A coordinated finish", body: "Plan framing, insulation, mechanical and electrical work alongside lighting, flooring, cabinetry and trim as the agreed scope requires." },
    ],
    fit: "A good fit for unfinished basement build-outs and substantial lower-level renovations with a coordinated construction scope.",
    qualification: "Share approximate square footage, whether the space is already finished and the rooms you want. Active water intrusion or structural concerns should be identified before finish work is planned.",
    question: "Is the basement finished or unfinished? Share approximate square footage, rooms you want, existing plumbing and any moisture concerns, timing or budget.",
  },
];

export function remodelingService(slug: string): RemodelingService {
  const service = remodelingServices.find((entry) => entry.slug === slug);
  if (!service) throw new Error(`Unknown remodeling service: ${slug}`);
  return service;
}
