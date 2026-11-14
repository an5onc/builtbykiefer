import anchors from "./anchors.json";
import { buildRibbon, type Point, type RibbonSpec } from "./airflow";
import type { WallMode } from "./content";

// Coordinates are pixels in the 1600 x 1000 renders. Gap positions come from
// anchors.json (computed in Blender from the camera), so the air leaves the house
// exactly where the drawing shows joints.
export const RENDER_SIZE = { width: anchors.size.width, height: anchors.size.height };

const px = (point: { x: number; y: number }): Point => [
  Math.round(point.x * RENDER_SIZE.width),
  Math.round(point.y * RENDER_SIZE.height),
];
const leak = anchors.leaks;
const shift = ([x, y]: Point, dx: number, dy: number): Point => [x + dx, y + dy];

// Stick frame: warm air escapes high through framing joints; cold air seeps in low.
const stickRibbons: RibbonSpec[] = [
  {
    id: "stick-left-top",
    kind: "warm",
    points: [shift(px(leak.leftTopPlate), 10, 40), px(leak.leftTopPlate), [330, 300], [170, 220], [20, 190]],
    widths: [10, 14, 46, 74, 96],
  },
  {
    id: "stick-left-window",
    kind: "warm",
    points: [shift(px(leak.leftWindowHead), 40, 40), px(leak.leftWindowHead), [350, 430], [190, 390], [20, 410]],
    widths: [8, 10, 34, 62, 84],
  },
  {
    id: "stick-ridge",
    kind: "warm",
    points: [[730, 340], [752, 238], px(leak.ridgeFront), [880, 70], [1060, 18]],
    widths: [12, 18, 30, 66, 96],
  },
  {
    id: "stick-right-top",
    kind: "warm",
    points: [shift(px(leak.rightTopPlate), -80, 20), px(leak.rightTopPlate), [1290, 392], [1440, 352], [1590, 326]],
    widths: [10, 14, 44, 72, 94],
  },
  {
    id: "stick-right-window",
    kind: "warm",
    points: [shift(px(leak.rightWindowHead), -70, 60), shift(px(leak.rightWindowHead), 0, 40), [1300, 500], [1460, 472], [1590, 470]],
    widths: [8, 12, 38, 62, 82],
  },
  {
    id: "stick-left-sill",
    kind: "cold",
    points: [[10, 770], [200, 708], [390, 646], shift(px(leak.leftSill), -20, 20), [660, 600]],
    widths: [84, 62, 30, 14, 22],
  },
  {
    id: "stick-left-low",
    kind: "cold",
    points: [[10, 572], [200, 552], [380, 530], [470, 532], [570, 552]],
    widths: [70, 50, 24, 10, 16],
  },
  {
    id: "stick-right-sill",
    kind: "cold",
    points: [[1590, 826], [1420, 796], [1250, 764], px(leak.rightSill), [1040, 706]],
    widths: [84, 62, 30, 12, 20],
  },
];

// SIP: the envelope sends outside air around the house; one faint seam leak.
const sipRibbons: RibbonSpec[] = [
  {
    id: "sip-over-roof",
    kind: "cold",
    points: [[10, 520], [220, 418], [450, 250], [760, 108], [1100, 136], [1350, 296], [1590, 380]],
    widths: [62, 52, 42, 36, 42, 52, 62],
  },
  {
    id: "sip-right-deflect",
    kind: "cold",
    points: [[1590, 622], [1390, 604], [1268, 532], [1248, 404], [1306, 262], [1490, 182], [1590, 162]],
    widths: [62, 50, 40, 36, 40, 50, 60],
  },
  {
    id: "sip-ground",
    kind: "cold",
    points: [[10, 868], [300, 910], [700, 952], [1100, 962], [1590, 902]],
    widths: [52, 52, 50, 50, 52],
  },
  {
    id: "sip-seam",
    kind: "warm",
    points: [shift(px(leak.sipSeam), 26, 26), px(leak.sipSeam), [474, 292], [420, 236]],
    widths: [5, 7, 16, 28],
    strands: 6,
    opacity: 0.5,
  },
];

export const ribbons: Record<WallMode, ReturnType<typeof buildRibbon>[]> = {
  stick: stickRibbons.map(buildRibbon),
  sip: sipRibbons.map(buildRibbon),
};

export const markerPositions = {
  air: anchors.markers.air,
  heat: anchors.markers.heat,
};
