// Simplified architectural plan data for "03 / Four Levels of Living".
//
// Every level is described in ONE shared plan coordinate space (the first-storey
// sheet's pixel space, roughly 1 unit ≈ 3 cm). The upper floors were measured on
// a second sheet drawn at a slightly different scale, so their numbers pass
// through the small mapping functions below, calibrated on the stair/lift core
// and the site boundary — that is what keeps the four levels stacking correctly.
//
// This is a diagrammatic redraw, not a survey: exterior footprint, principal
// walls, major partitions, stair/lift core, pool, decks, car porch, void and
// room relationships are preserved; furniture, fittings, cars, trees, fills and
// branding are deliberately left out.

export type Weight = "principal" | "secondary" | "hair";

export type Shape =
  | { kind: "rect"; x: number; y: number; w: number; h: number; weight?: Weight; dashed?: boolean; draw?: boolean; rx?: number }
  | { kind: "poly"; pts: [number, number][]; close?: boolean; weight?: Weight; dashed?: boolean; draw?: boolean }
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number; weight?: Weight; dashed?: boolean }
  | { kind: "circle"; cx: number; cy: number; r: number; weight?: Weight }
  | { kind: "stair"; x: number; y: number; w: number; h: number; treads?: number; dir?: "h" | "v" }
  | { kind: "lift"; x: number; y: number; w: number; h: number }
  | { kind: "cross"; x: number; y: number; w: number; h: number } // void / shaft marker
  | { kind: "label"; x: number; y: number; text: string; size?: "s" | "m"; anchor?: "start" | "middle" | "end"; rotate?: -90; along?: boolean };

export interface Level {
  id: "attic" | "second" | "first" | "basement";
  name: string;
  caption: string;
  note?: string;
  shapes: Shape[];
}

// ── Sheet 2 → sheet 1 mapping (measured; keep as-is) ──────────────────────
const X2 = (x: number) => (x - 875) * 1.146 + 990;
const Y2 = (y: number) => (y - 170) * 1.12 + 592;
const YA = (y: number) => Y2(y - 480); // attic drawing sits 480 units lower on sheet 2

const R = (x: number, y: number, w: number, h: number, weight: Weight = "secondary", extra: Partial<Extract<Shape, { kind: "rect" }>> = {}): Shape =>
  ({ kind: "rect", x, y, w, h, weight, ...extra });
const R2 = (x1: number, y1: number, x2: number, y2: number, weight: Weight = "secondary", extra: Partial<Extract<Shape, { kind: "rect" }>> = {}): Shape =>
  R(X2(x1), Y2(y1), X2(x2) - X2(x1), Y2(y2) - Y2(y1), weight, extra);
const RA = (x1: number, y1: number, x2: number, y2: number, weight: Weight = "secondary", extra: Partial<Extract<Shape, { kind: "rect" }>> = {}): Shape =>
  R(X2(x1), YA(y1), X2(x2) - X2(x1), YA(y2) - YA(y1), weight, extra);
const L = (x: number, y: number, text: string, size: "s" | "m" = "s", anchor: "start" | "middle" | "end" = "middle"): Shape =>
  ({ kind: "label", x, y, text, size, anchor });

// ── First storey (sheet 1 coordinates) ─────────────────────────────────────
// Site: plot line (dashed hairline) and the boundary wall (thin). The plot is a
// trapezium — its west and east edges slant; the drawing keeps that.
const first: Level = {
  id: "first",
  name: "First Storey",
  caption: "Living · Dining · Dry kitchen · Wet kitchen · Garden · Pool · Car porch",
  note: "18 m swimming pool",
  shapes: [
    { kind: "poly", pts: [[282, 517], [1500, 517], [1428, 909], [170, 912]], close: true, weight: "hair", dashed: true }, // plot line
    { kind: "poly", pts: [[282, 517], [1485, 517], [1415, 907], [215, 907]], close: true, weight: "principal", draw: true }, // boundary wall
    R(267, 560, 55, 37, "secondary"), // entrance structure by the gate
    // car porch: four bays as hairline rectangles
    R(470, 562, 155, 63, "hair", { dashed: true }),
    R(470, 642, 155, 63, "hair", { dashed: true }),
    R(470, 725, 155, 62, "hair", { dashed: true }),
    R(470, 807, 155, 63, "hair", { dashed: true }),
    L(400, 700, "Car porch"),
    // outdoor decks: north strip, west strip, east
    R(637, 545, 763, 47, "secondary"),
    { kind: "label", x: 1020, y: 574, text: "Outdoor deck", size: "s", anchor: "middle", along: true },
    R(637, 592, 35, 313, "secondary"),
    L(655, 750, "Deck", "s"),
    R(1275, 687, 125, 218, "secondary"),
    L(1338, 800, "Outdoor\ndeck"),
    // house block
    R(672, 592, 663, 240, "principal", { draw: true }), // outer walls of the enclosed floor
    { kind: "line", x1: 672, y1: 687, x2: 1335, y2: 687, weight: "principal", }, // wall between service row and open living
    R(672, 592, 78, 95, "secondary"), // powder
    L(711, 645, "Powder"),
    R(750, 592, 70, 95, "secondary"), // bath
    L(785, 645, "Bath"),
    { kind: "stair", x: 820, y: 592, w: 130, h: 95, treads: 9, dir: "h" },
    R(950, 592, 40, 95, "hair"), // lobby
    { kind: "lift", x: 990, y: 592, w: 70, h: 95 },
    R(1060, 592, 40, 95, "hair"), // wc
    R(1100, 592, 80, 95, "secondary"), // maid
    L(1140, 645, "Maid"),
    R(1180, 592, 155, 95, "secondary"), // wet kitchen
    L(1258, 645, "Wet kitchen"),
    L(770, 775, "Living", "m"),
    L(1000, 720, "Dry kitchen"),
    L(1180, 760, "Dining", "m"),
    // pool
    R(675, 840, 575, 65, "principal", { draw: true }),
    { kind: "label", x: 962, y: 878, text: "Swimming pool · 18 m × 2 m", size: "s", anchor: "middle", along: true },
    R(1250, 840, 25, 65, "hair"), // step
  ],
};

// ── Basement — the core only: stair, lobby, lift, household shelter ─────────
const basement: Level = {
  id: "basement",
  name: "Basement",
  caption: "Household shelter · Lift · Stair core",
  shapes: [
    { kind: "poly", pts: [[820, 592], [1060, 592], [1060, 770], [950, 770], [950, 687], [820, 687]], close: true, weight: "principal", draw: true },
    { kind: "stair", x: 820, y: 592, w: 130, h: 95, treads: 9, dir: "h" },
    R(950, 592, 40, 178, "hair"),
    { kind: "lift", x: 990, y: 592, w: 70, h: 95 },
    R(990, 687, 70, 83, "secondary"),
    L(1025, 733, "HS"),
  ],
};

// ── Second storey (sheet 2 coordinates via X2/Y2) ──────────────────────────
const second: Level = {
  id: "second",
  name: "Second Storey",
  caption: "Principal suite · Bedrooms 1–2 · Family / Study",
  note: "Green roof",
  shapes: [
    R2(405, 157, 1207, 427, "hair"), // roof / eave outline
    R2(437, 170, 465, 400, "secondary"), // green roof
    L(X2(451), Y2(290), "Green\nroof", "s"),
    R2(465, 170, 587, 400, "secondary"), // outdoor deck
    L(X2(526), Y2(290), "Outdoor\ndeck"),
    R2(587, 170, 1130, 400, "principal", { draw: true }), // enclosed floor
    R2(587, 170, 715, 255, "secondary"), // master bath
    L(X2(651), Y2(215), "Principal bath"),
    R2(587, 255, 765, 400, "secondary"), // master bedroom
    L(X2(676), Y2(350), "Principal\nbedroom", "m"),
    R2(760, 300, 795, 400, "hair"), // wardrobe
    { kind: "label", x: X2(777), y: Y2(350), text: "Wardrobe", size: "s", anchor: "middle", rotate: -90 },
    { kind: "stair", x: X2(750), y: Y2(170), w: X2(837) - X2(750), h: Y2(255) - Y2(170), treads: 9, dir: "h" },
    { kind: "lift", x: X2(875), y: Y2(170), w: X2(932) - X2(875), h: Y2(255) - Y2(170) },
    R2(795, 300, 932, 400, "secondary"), // family / study
    L(X2(863), Y2(345), "Family /\nstudy"),
    R2(937, 170, 1017, 245, "secondary"), // bath 1
    L(X2(977), Y2(212), "Bath"),
    R2(1017, 170, 1130, 292, "secondary"), // bedroom 1
    L(X2(1073), Y2(268), "Bedroom 1"),
    R2(1017, 292, 1130, 400, "secondary"), // bedroom 2
    L(X2(1073), Y2(322), "Bedroom 2"),
    R2(937, 340, 1017, 400, "secondary"), // bath 2
    L(X2(977), Y2(375), "Bath"),
  ],
};

// ── Attic (sheet 2 coordinates via X2/YA) ──────────────────────────────────
const attic: Level = {
  id: "attic",
  name: "Attic",
  caption: "Bedrooms 3–4 · Outdoor deck",
  shapes: [
    RA(495, 627, 1152, 900, "hair"), // roof outline
    RA(500, 627, 567, 900, "secondary"), // void
    { kind: "cross", x: X2(500), y: YA(627), w: X2(567) - X2(500), h: YA(900) - YA(627) },
    L(X2(533), YA(770), "Void"),
    RA(595, 650, 1130, 872, "principal", { draw: true }), // enclosed floor + deck
    RA(595, 650, 822, 872, "secondary"), // outdoor deck (outer)
    RA(615, 670, 802, 852, "hair"), // planter border
    L(X2(708), YA(760), "Outdoor\ndeck"),
    { kind: "stair", x: X2(730), y: YA(650), w: X2(845) - X2(730), h: YA(730) - YA(650), treads: 8, dir: "h" },
    { kind: "lift", x: X2(875), y: YA(650), w: X2(932) - X2(875), h: YA(717) - YA(650) },
    RA(822, 777, 932, 872, "secondary"), // M&E
    L(X2(877), YA(830), "M&E"),
    RA(937, 650, 1017, 717, "secondary"), // bath 3
    L(X2(977), YA(688), "Bath"),
    RA(1017, 650, 1130, 765, "secondary"), // bedroom 3
    L(X2(1073), YA(745), "Bedroom 3"),
    RA(1017, 765, 1130, 872, "secondary"), // bedroom 4
    L(X2(1073), YA(790), "Bedroom 4"),
    RA(937, 805, 1017, 872, "secondary"), // bath 4
    L(X2(977), YA(842), "Bath"),
  ],
};

// Top to bottom, as the house is built.
export const LEVELS: Level[] = [attic, second, first, basement];

// The shared plan space (sheet-1 units) all four levels are drawn in.
export const PLAN_BOUNDS = { x: 150, y: 500, w: 1410, h: 430 };

// ── Scale ──────────────────────────────────────────────────────────────────
// The only dimension written on the sales plans is the pool: 18 m × 2 m. It is
// drawn 575 units long, so 1 unit ≈ 3.13 cm (its 65-unit width comes out at
// 2.03 m, which agrees). Everything measured on the diagram is therefore
// approximate — a few percent either way — and is labelled as such.
export const METRES_PER_UNIT = 18 / 575;

// ── Suggested furniture (the sales plans' indicative layout, redrawn) ───────
// Hairline symbols only — beds, seating, tables, the island, cars, deck seats —
// placed as the plan sheets place them. Shown on the Plans page behind a
// "Furnished / Bare" switch; never on the Four Levels act, which stays bare.
const H = (s: Omit<Extract<Shape, { kind: "rect" }>, "kind" | "weight">): Shape => ({ kind: "rect", weight: "hair", ...s });
const H2 = (x1: number, y1: number, x2: number, y2: number, rx?: number): Shape => ({ kind: "rect", weight: "hair", x: X2(x1), y: Y2(y1), w: X2(x2) - X2(x1), h: Y2(y2) - Y2(y1), rx });
const HA = (x1: number, y1: number, x2: number, y2: number, rx?: number): Shape => ({ kind: "rect", weight: "hair", x: X2(x1), y: YA(y1), w: X2(x2) - X2(x1), h: YA(y2) - YA(y1), rx });
const C = (cx: number, cy: number, r: number): Shape => ({ kind: "circle", weight: "hair", cx, cy, r });
const C2 = (cx: number, cy: number, r: number): Shape => C(X2(cx), Y2(cy), r);
const CA = (cx: number, cy: number, r: number): Shape => C(X2(cx), YA(cy), r);
const bed2 = (x: number, y: number, w: number, h: number, headAtTop: boolean): Shape[] => [
  H2(x, y, x + w, y + h, 3),
  { kind: "line", weight: "hair", x1: X2(x + 4), y1: Y2(headAtTop ? y + 12 : y + h - 12), x2: X2(x + w - 4), y2: Y2(headAtTop ? y + 12 : y + h - 12) }, // pillow line
];
const bedA = (x: number, y: number, w: number, h: number, headAtTop: boolean): Shape[] => [
  HA(x, y, x + w, y + h, 3),
  { kind: "line", weight: "hair", x1: X2(x + 4), y1: YA(headAtTop ? y + 12 : y + h - 12), x2: X2(x + w - 4), y2: YA(headAtTop ? y + 12 : y + h - 12) },
];

export const FURNITURE: Record<Level["id"], Shape[]> = {
  first: [
    // Living: an L-shaped sofa facing the pool, two armchairs, a low table
    H({ x: 690, y: 727, w: 150, h: 27, rx: 3 }),
    H({ x: 812, y: 754, w: 28, h: 58, rx: 3 }),
    H({ x: 695, y: 785, w: 27, h: 27, rx: 3 }),
    H({ x: 735, y: 785, w: 27, h: 27, rx: 3 }),
    H({ x: 768, y: 780, w: 36, h: 22 }),
    // Dry kitchen: the island with four stools
    H({ x: 968, y: 738, w: 110, h: 25 }),
    ...[985, 1010, 1035, 1060].map((x) => C(x, 774, 5)),
    // Dining: a long table for ten
    H({ x: 1118, y: 752, w: 134, h: 32 }),
    ...[1126, 1153, 1180, 1207, 1234].flatMap((x) => [H({ x, y: 736, w: 14, h: 9, rx: 2 }), H({ x, y: 791, w: 14, h: 9, rx: 2 })]),
    // Wet kitchen: counters along the outer wall; the maid's room bed
    H({ x: 1186, y: 596, w: 144, h: 18 }),
    H({ x: 1312, y: 614, w: 18, h: 68 }),
    H({ x: 1106, y: 622, w: 29, h: 61, rx: 3 }),
    // Car porch: four cars in four bays
    ...[562, 642, 725, 807].map((y0) => H({ x: 478, y: y0 + 4.5, w: 140, h: 54, rx: 9 })),
    // East deck: a round table for four
    C(1338, 760, 20),
    ...[[1306, 760], [1370, 760], [1338, 728], [1338, 792]].map(([cx, cy]) => C(cx, cy, 6)),
  ],
  second: [
    // Master bath: the tub and the vanity
    H2(598, 180, 622, 246, 6),
    H2(700, 178, 712, 246),
    // Master bedroom: the bed, head to the bath wall, bedside tables
    ...bed2(640, 258, 56, 57, true),
    H2(624, 258, 636, 270),
    H2(700, 258, 712, 270),
    // Wardrobe: two rails
    { kind: "line", weight: "hair", x1: X2(772), y1: Y2(305), x2: X2(772), y2: Y2(395) },
    { kind: "line", weight: "hair", x1: X2(785), y1: Y2(305), x2: X2(785), y2: Y2(395) },
    // Family / study: a desk and chair
    H2(850, 372, 905, 392),
    C2(877, 362, 6),
    // Bedrooms 1 and 2
    ...bed2(1052, 175, 42, 57, true),
    H2(1040, 175, 1050, 185),
    H2(1096, 175, 1106, 185),
    ...bed2(1052, 338, 42, 57, false),
    H2(1040, 385, 1050, 395),
    H2(1096, 385, 1106, 395),
    // Outdoor deck: two loungers and a small table
    H2(500, 220, 518, 268, 3),
    H2(530, 220, 548, 268, 3),
    C2(524, 285, 8),
  ],
  attic: [
    // Bedrooms 3 and 4
    ...bedA(1052, 655, 42, 57, true),
    ...bedA(1052, 810, 42, 57, false),
    // Roof deck: two loungers and a table, below the label
    HA(650, 780, 668, 828, 3),
    HA(680, 780, 698, 828, 3),
    CA(735, 804, 9),
  ],
  basement: [],
};
