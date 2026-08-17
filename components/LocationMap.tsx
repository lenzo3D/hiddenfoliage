// A schematic map of Berrima Road and its context, drawn in the site's own line
// language. It is a diagram: relative positions and the named distances are
// right; it is not a survey. North is up. Scale ≈ 300 units per kilometre.
// The house marker is a link that opens the real map (Google Maps).

import { MAPS_URL } from "./site";

const IVORY = "#ebe9e2";
const STONE = "#b8b2a4";

type Pt = [number, number];
const HOUSE: Pt = [555, 345];

const ROADS: { d: string; name?: string; at?: Pt; rot?: number; weight?: number }[] = [
  // Dunearn Road and Bukit Timah Road run WNW–ESE, the estate just north of them
  { d: "M 20 300 L 1180 560", name: "Dunearn Road", at: [250, 340], rot: 12.6, weight: 0.9 },
  { d: "M 20 345 L 1180 605", name: "Bukit Timah Road", at: [120, 388], rot: 12.6, weight: 0.9 },
  // Whitley Road / PIE to the north
  { d: "M 20 150 L 1180 130", name: "Pan Island Expressway", at: [960, 128], rot: -1, weight: 0.7 },
  // Adam Road (west) and Stevens Road (east), north–south
  { d: "M 430 130 L 400 620", name: "Adam Road", at: [392, 560], rot: -86.5, weight: 0.7 },
  { d: "M 720 140 L 690 620", name: "Stevens Road", at: [688, 560], rot: -86.5, weight: 0.7 },
  // Berrima Road itself, a short loop off Dunearn Road
  { d: "M 470 400 L 500 335 L 590 335 L 615 400", weight: 0.7 },
  // Newton Circus and Orchard Road, to the south-east
  { d: "M 1000 545 L 1000 700", weight: 0.6 },
  { d: "M 780 700 L 1180 640", name: "Orchard Road", at: [990, 668], rot: -8.5, weight: 0.7 },
];

const MRT: { at: Pt; name: string; lines: string; note: string; anchor?: "start" | "end" }[] = [
  { at: [703, 470], name: "Stevens", lines: "DT10 · TE11", note: "0.5 km · 7 min walk", anchor: "start" },
  { at: [268, 428], name: "Botanic Gardens", lines: "CC19 · DT9", note: "1 km · 12 min walk", anchor: "end" },
  { at: [1000, 545], name: "Newton", lines: "NS21 · DT11", note: "1.5 km", anchor: "start" },
];

const PLACES: { at: Pt; name: string; note?: string; anchor?: "start" | "end" | "middle" }[] = [
  { at: [880, 300], name: "ACS (Primary)", note: "Barker Road", anchor: "start" },
  { at: [800, 395], name: "SCGS", note: "Dunearn Road", anchor: "start" },
  { at: [60, 590], name: "Nanyang Primary", note: "King's Road", anchor: "start" },
  { at: [215, 240], name: "Raffles Girls' Primary", note: "Hillcrest Road", anchor: "end" },
];

const T = ({ x, y, children, size = 15, fill = STONE, anchor = "start", rot, op = 1 }: { x: number; y: number; children: React.ReactNode; size?: number; fill?: string; anchor?: "start" | "middle" | "end"; rot?: number; op?: number }) => (
  <text x={x} y={y} fontSize={size} fill={fill} fillOpacity={op} textAnchor={anchor} transform={rot ? `rotate(${rot} ${x} ${y})` : undefined} style={{ letterSpacing: size <= 12 ? "0.14em" : undefined }}>
    {children}
  </text>
);

export default function LocationMap() {
  return (
    <svg viewBox="0 0 1200 760" className="h-auto w-full" role="img" aria-label="Schematic map: Hidden Foliage on Berrima Road, north of Dunearn Road, between Adam Road and Stevens Road; Stevens MRT half a kilometre east, Botanic Gardens MRT one kilometre west; the Singapore Botanic Gardens to the south-west; Orchard Road to the south-east." preserveAspectRatio="xMidYMid meet">
      <g fontFamily="var(--font-sans), system-ui, sans-serif">
        {/* Botanic Gardens — a dashed field south of Bukit Timah Road */}
        <path d="M 210 480 L 480 540 L 455 720 L 180 705 Z" fill={STONE} fillOpacity={0.05} stroke={STONE} strokeOpacity={0.45} strokeWidth={0.7} strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />
        <T x={250} y={610} size={14} fill={IVORY} op={0.8}>Singapore Botanic Gardens</T>
        <T x={250} y={632} size={11}>UNESCO WORLD HERITAGE · 15 MIN WALK</T>

        {/* Roads */}
        {ROADS.map((r, i) => (
          <g key={i}>
            <path d={r.d} fill="none" stroke={STONE} strokeOpacity={0.55} strokeWidth={r.weight ?? 0.7} vectorEffect="non-scaling-stroke" strokeLinecap="square" />
            {r.name && r.at && (
              <T x={r.at[0]} y={r.at[1]} size={11} rot={r.rot} op={0.8}>{r.name.toUpperCase()}</T>
            )}
          </g>
        ))}

        {/* Direction annotations at the edges (no drive times: none verified yet) */}
        <T x={1180} y={470} size={11} anchor="end" op={0.7}>NEWTON · CBD →</T>
        <T x={1180} y={112} size={11} anchor="end" op={0.7}>CHANGI AIRPORT · PIE →</T>
        <T x={20} y={280} size={11} op={0.7}>← BUKIT TIMAH</T>
        <T x={840} y={730} size={11} op={0.7}>ORCHARD ROAD →</T>

        {/* MRT stations */}
        {MRT.map((m) => {
          const dx = m.anchor === "end" ? -14 : 14;
          return (
            <g key={m.name}>
              <circle cx={m.at[0]} cy={m.at[1]} r={5} fill="#070b08" stroke={IVORY} strokeOpacity={0.9} strokeWidth={1} vectorEffect="non-scaling-stroke" />
              <circle cx={m.at[0]} cy={m.at[1]} r={1.6} fill={IVORY} />
              <T x={m.at[0] + dx} y={m.at[1] - 4} size={14} fill={IVORY} anchor={m.anchor} op={0.9}>{m.name} MRT</T>
              <T x={m.at[0] + dx} y={m.at[1] + 14} size={11} anchor={m.anchor}>{m.lines.toUpperCase()} · {m.note.toUpperCase()}</T>
            </g>
          );
        })}

        {/* Schools */}
        {PLACES.map((p) => {
          const dx = p.anchor === "end" ? -10 : 10;
          return (
            <g key={p.name}>
              <rect x={p.at[0] - 3} y={p.at[1] - 3} width={6} height={6} fill="none" stroke={STONE} strokeOpacity={0.8} strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
              <T x={p.at[0] + dx} y={p.at[1] + 4} size={13} fill={IVORY} anchor={p.anchor} op={0.85}>{p.name}</T>
              {p.note && <T x={p.at[0] + dx} y={p.at[1] + 20} size={11} anchor={p.anchor}>{p.note.toUpperCase()}</T>}
            </g>
          );
        })}

        {/* The house — a link to the real map */}
        <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" aria-label="Open Berrima Road in Google Maps (opens in a new tab)" className="group cursor-pointer">
          <circle cx={HOUSE[0]} cy={HOUSE[1]} r={22} fill="none" stroke={IVORY} strokeOpacity={0.35} strokeWidth={0.7} vectorEffect="non-scaling-stroke" strokeDasharray="3 4" className="transition-opacity group-hover:[stroke-opacity:0.8] group-focus-visible:[stroke-opacity:0.8]" />
          <circle cx={HOUSE[0]} cy={HOUSE[1]} r={4} fill={IVORY} />
          <T x={HOUSE[0]} y={HOUSE[1] - 40} size={16} fill={IVORY} anchor="middle">Hidden Foliage</T>
          <T x={HOUSE[0]} y={HOUSE[1] - 20} size={11} anchor="middle">BERRIMA ROAD · DUNEARN ESTATE · D11</T>
          <T x={HOUSE[0]} y={HOUSE[1] + 44} size={11} anchor="middle" op={0.75}>OPEN IN GOOGLE MAPS →</T>
        </a>

        {/* Scale and north */}
        <g>
          <path d="M 40 720 L 340 720" stroke={STONE} strokeOpacity={0.7} strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
          <path d="M 40 714 L 40 726 M 340 714 L 340 726" stroke={STONE} strokeOpacity={0.7} strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
          <T x={40} y={745} size={11}>1 KM · DIAGRAMMATIC, NOT TO SCALE</T>
          <path d="M 1150 40 L 1150 78 M 1150 40 L 1143 52 M 1150 40 L 1157 52" stroke={STONE} strokeOpacity={0.8} strokeWidth={0.8} fill="none" vectorEffect="non-scaling-stroke" />
          <T x={1150} y={96} size={11} anchor="middle">N</T>
        </g>
      </g>
    </svg>
  );
}
