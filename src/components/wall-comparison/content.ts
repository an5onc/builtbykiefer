// Every visitor-facing claim in the wall comparison lives here. A sentence that
// contains a numeral must carry the source IDs that support it (see content.test.ts).

export type WallMode = "stick" | "sip";
export type WallVariant = "full" | "compact";
export type MechanismId = "air" | "heat";

export type SourcedText = {
  text: string;
  sourceIds?: number[];
};

export type Mechanism = {
  id: MechanismId;
  marker: string;
  title: string;
  states: Record<WallMode, SourcedText>;
};

export type VariantContent = {
  heading: string;
  intro?: string;
  mechanisms: Mechanism[];
  finePrint: string;
  /** Compact placements have no sources list, so they link straight to the report. */
  sourceLink?: { sourceId: number; label: string };
  learnMore?: { label: string; href: string };
};

export const wallModes: WallMode[] = ["stick", "sip"];

export const modeLabels: Record<WallMode, string> = {
  stick: "Stick frame",
  sip: "SIP panel",
};

export const illustrationTitles: Record<WallMode, string> = {
  stick:
    "Rendered cutaway of a small stick-framed house with the front wall removed, showing wood studs, roof trusses and pink insulation. Warm air streams escape through joints high in the walls and roof while cold air seeps in low, and the framing glows to show heat traveling through the wood.",
  sip:
    "Rendered cutaway of the same house built with structural insulated panels, foam-core walls and roof faced with OSB. Outside air flows around the house instead of through it, with one faint warm stream at a panel seam.",
};

export type WallView = "house" | "wall";

/** Screen-reader descriptions of the close-up reached from the floor button. */
export const closeupTitles: Record<WallMode, string> = {
  stick:
    "Close-up illustration of a stick-framed wall seen from inside the house with the drywall cut away. Warm air escapes through joints at the plates, around the window and at an outlet, and heat travels outward through the wood framing.",
  sip:
    "Close-up illustration of a structural insulated panel wall seen from inside the house with the drywall cut away. A continuous foam core replaces the studs, leakage is reduced to one faint stream at a panel seam, and the wall looks even across its face.",
};

export const viewCaptions: Record<WallView, string> = {
  house: "Rendered cutaway, front wall removed.",
  wall: "Inside the wall, drywall cut away.",
};

export const zoomLabels: Record<WallView, string> = {
  house: "Look inside the wall",
  wall: "Back to the house",
};

/** The homepage preview: the house alone, linking to the full comparison on the SIPs page. */
export const previewContent = {
  label: "See how SIPs work",
  href: "/why-kiefer-built/sips#wall-comparison",
};

export const wallContent: Record<WallVariant, VariantContent> = {
  full: {
    heading: "See where a wall loses heat",
    intro:
      "Switch between a framed wall and a structural insulated panel to see the two ways heat escapes: air slipping through gaps, and heat traveling through the framing.",
    mechanisms: [
      {
        id: "air",
        marker: "1",
        title: "Air leakage",
        states: {
          stick: { text: "Joints, outlets and openings in a framed wall can let air slip through." },
          sip: {
            text: "Large panels mean fewer joints to seal. In ORNL's 2002 tests, the best-sealed SIP room leaked about 15× less air than the wood-framed room.",
            sourceIds: [9],
          },
        },
      },
      {
        id: "heat",
        marker: "2",
        title: "Heat through framing",
        states: {
          stick: {
            text: "Wood studs and plates interrupt the insulation, giving heat a path around it.",
            sourceIds: [3],
          },
          sip: {
            text: "A continuous foam core reduces those breaks. Whole-wall performance still depends on panel thickness and connections.",
            sourceIds: [3],
          },
        },
      },
    ],
    finePrint:
      "Illustration, not to scale. Real performance depends on the design, the air sealing and the home's own blower-door test.",
  },
  compact: {
    heading: "Built better, from the envelope in.",
    mechanisms: [
      {
        id: "air",
        marker: "1",
        title: "Air leakage",
        states: {
          stick: { text: "Framed walls have many joints for air and heat to escape." },
          sip: {
            text: "SIP walls have fewer. ORNL measured about 15× lower leakage in its best-sealed SIP test room.",
            sourceIds: [9],
          },
        },
      },
    ],
    finePrint: "Illustration, not to scale.",
    sourceLink: { sourceId: 9, label: "Source: ORNL, 2002" },
    learnMore: { label: "See how SIPs work", href: "/why-kiefer-built/sips" },
  },
};
