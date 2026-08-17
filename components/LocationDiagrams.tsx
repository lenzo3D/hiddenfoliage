// Two diagram plates for the Location chapters, in the site's own line language
// (the same register as the schematic map): the schools within two kilometres,
// and the routes out — Adam Road to the PIE, Dunearn and Bukit Timah Roads into
// town, Stevens MRT on foot. Positions follow the schematic map (≈280 units per
// kilometre here); they are diagrams, not surveys, and say so.
//
// Elements marked data-draw are stroked on by the chapter timeline (stroke
// dash-offset); data-pop elements fade in after them. Without the timeline
// (phones, reduced motion) everything is simply present.

const IVORY = "#ebe9e2";
const STONE = "#b8b2a4";
const HOUSE: [number, number] = [655, 596];

// Text helper. `k` scales type up for the phone plates, where the drawing is small.
const T = ({ x, y, k = 1, size = 15, fill = STONE, anchor = "start", rot, op = 1, children, pop = true }: { x: number; y: number; k?: number; size?: number; fill?: string; anchor?: "start" | "middle" | "end"; rot?: number; op?: number; children: React.ReactNode; pop?: boolean }) => (
  <text data-pop={pop ? "" : undefined} x={x} y={y} fontSize={size * k} fill={fill} fillOpacity={op} textAnchor={anchor} transform={rot ? `rotate(${rot} ${x} ${y})` : undefined} style={{ letterSpacing: size <= 16 ? "0.14em" : undefined }}>
    {children}
  </text>
);
const line = { fill: "none", stroke: STONE, strokeOpacity: 0.55, strokeWidth: 0.7, vectorEffect: "non-scaling-stroke" as const, strokeLinecap: "square" as const };
const route = { fill: "none", stroke: IVORY, strokeOpacity: 0.85, strokeWidth: 1.1, vectorEffect: "non-scaling-stroke" as const, strokeLinecap: "square" as const, strokeLinejoin: "miter" as const };

// Dunearn Road and Bukit Timah Road run WNW–ESE just south of the house.
const DUNEARN = "M 0 484 L 1300 775";
const BUKIT_TIMAH = "M 0 526 L 1300 817";
// Berrima Road: a short loop off Dunearn Road.
const BERRIMA = "M 600 618 L 618 568 L 692 568 L 710 643";

function House({ k = 1 }: { k?: number }) {
  return (
    <g>
      <circle data-draw="" cx={HOUSE[0]} cy={HOUSE[1]} r={26} fill="none" stroke={IVORY} strokeOpacity={0.35} strokeWidth={0.7} vectorEffect="non-scaling-stroke" strokeDasharray="3 4" />
      <circle data-pop="" cx={HOUSE[0]} cy={HOUSE[1]} r={4.5} fill={IVORY} />
      <T x={HOUSE[0]} y={HOUSE[1] - 46} k={k} size={17} fill={IVORY} anchor="middle">Hidden Foliage</T>
      <T x={HOUSE[0]} y={HOUSE[1] - 26} k={k} size={12} anchor="middle" op={0.9}>BERRIMA ROAD</T>
    </g>
  );
}

function North() {
  return (
    <g data-pop="">
      <path d="M 1240 40 L 1240 78 M 1240 40 L 1233 52 M 1240 40 L 1247 52" stroke={STONE} strokeOpacity={0.8} strokeWidth={0.8} fill="none" vectorEffect="non-scaling-stroke" />
      <T x={1240} y={96} size={12} anchor="middle" pop={false}>N</T>
    </g>
  );
}

// ── 02  The schools within two kilometres ────────────────────────────────────
export function SchoolsDiagram({ compact = false }: { compact?: boolean }) {
  const k = compact ? 1.45 : 1;
  // Full names on the large plate; short forms on phones, where the plate is
  // narrow (the chapter's fact line carries the full names).
  const schools: { at: [number, number]; name: string; short: string; road: string; anchor: "start" | "end" }[] = [
    { at: [953, 505], name: "Anglo-Chinese School (Primary)", short: "ACS (Primary)", road: "Barker Road", anchor: "end" },
    { at: [879, 640], name: "Singapore Chinese Girls' School", short: "Singapore Chinese Girls'", road: "Dunearn Road", anchor: "end" },
    { at: [188, 789], name: "Nanyang Primary School", short: "Nanyang Primary", road: "King's Road", anchor: "start" },
    { at: [333, 452], name: "Raffles Girls' Primary School", short: "Raffles Girls' Primary", road: "Hillcrest Road", anchor: "start" },
  ];
  return (
    <svg viewBox="0 0 1300 1100" preserveAspectRatio="xMidYMid meet" className="h-full w-full" role="img" aria-label="Diagram: the four schools within two kilometres of Berrima Road" fontFamily="var(--font-sans), system-ui, sans-serif">
      {/* rings: 1 km and 2 km */}
      <circle data-draw="" cx={HOUSE[0]} cy={HOUSE[1]} r={280} {...line} strokeDasharray="4 5" strokeOpacity={0.4} />
      <circle data-draw="" cx={HOUSE[0]} cy={HOUSE[1]} r={560} {...line} strokeDasharray="4 5" strokeOpacity={0.65} strokeWidth={0.9} />
      <T x={440} y={352} k={k} size={12} anchor="end" op={0.8}>1 KM</T>
      <T x={240} y={982} k={k} size={12} anchor="end" op={0.8}>2 KM</T>
      {/* the two roads, for bearings */}
      <path data-draw="" d={DUNEARN} {...line} />
      <path data-draw="" d={BUKIT_TIMAH} {...line} />
      {!compact && <T x={80} y={492} size={12} rot={12.6} op={0.75}>DUNEARN ROAD</T>}
      {!compact && <T x={80} y={560} size={12} rot={12.6} op={0.75}>BUKIT TIMAH ROAD</T>}
      <path data-draw="" d={BERRIMA} {...line} />
      <House k={k} />
      {schools.map((s) => {
        const dx = s.anchor === "end" ? -14 : 14;
        return (
          <g key={s.name} data-pop="">
            <rect x={s.at[0] - 4} y={s.at[1] - 4} width={8} height={8} fill="none" stroke={STONE} strokeOpacity={0.9} strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
            <T x={s.at[0] + dx} y={s.at[1] + 6} k={k} size={23} fill={IVORY} anchor={s.anchor} op={0.92} pop={false}>{compact ? s.short : s.name}</T>
            <T x={s.at[0] + dx} y={s.at[1] + 6 + 24 * k} k={k} size={13} anchor={s.anchor} pop={false}>{s.road.toUpperCase()}</T>
          </g>
        );
      })}
      <T x={30} y={1070} k={k} size={12} op={0.65}>WITHIN 2 KM · DIAGRAMMATIC, NOT TO SCALE</T>
      <North />
    </svg>
  );
}

// ── 05  The routes out ───────────────────────────────────────────────────────
export function RoutesDiagram({ compact = false }: { compact?: boolean }) {
  const k = compact ? 1.55 : 1;
  return (
    <svg viewBox="0 0 1300 1100" preserveAspectRatio="xMidYMid meet" className="h-full w-full" role="img" aria-label="Diagram: routes from Berrima Road to the Pan Island Expressway, Newton, Orchard Road and the city; Stevens MRT nearby" fontFamily="var(--font-sans), system-ui, sans-serif">
      {/* base roads */}
      <path data-draw="" d="M 0 300 L 1300 262" {...line} strokeWidth={0.9} />
      <path data-draw="" d={DUNEARN} {...line} />
      <path data-draw="" d={BUKIT_TIMAH} {...line} />
      <path data-draw="" d="M 535 40 L 505 1040" {...line} />
      <path data-draw="" d="M 800 662 L 770 1040" {...line} />
      <path data-draw="" d="M 1065 723 L 1040 860" {...line} />
      <path data-draw="" d="M 860 891 L 1300 835" {...line} />
      <path data-draw="" d={BERRIMA} {...line} />
      {/* routes: to the PIE via Adam Road; into town via Dunearn / Bukit Timah; a walk to the MRT */}
      <path data-draw="" d="M 600 618 L 520 600 L 529 292" {...route} />
      <path data-draw="" d="M 710 643 L 1065 723 L 1040 860" {...route} />
      <path data-draw="" d="M 1065 723 L 1300 776" {...route} strokeOpacity={0.55} />
      <path data-draw="" d="M 710 643 L 788 690" {...route} strokeDasharray="3 4" strokeOpacity={0.7} />
      {/* places */}
      <House k={k} />
      <g data-pop="">
        <circle cx={788} cy={690} r={5} fill="#070b08" stroke={IVORY} strokeOpacity={0.9} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        <circle cx={788} cy={690} r={1.6} fill={IVORY} />
        <T x={806} y={686} k={k} size={17} fill={IVORY} op={0.9} pop={false}>Stevens MRT</T>
        <T x={806} y={686 + 20 * k} k={k} size={12} pop={false}>DT10 · TE11 · 7 MIN WALK</T>
        <T x={806} y={686 + 38 * k} k={k} size={12} pop={false}>3 STOPS TO ORCHARD</T>
      </g>
      <g data-pop="">
        <circle cx={1065} cy={723} r={3.5} fill={IVORY} fillOpacity={0.9} />
        <T x={1084} y={752} k={k} size={13} op={0.85} pop={false}>NEWTON</T>
      </g>
      {/* labels */}
      <T x={470} y={252} k={k} size={13} rot={-1.7} op={0.85}>PAN ISLAND EXPRESSWAY · PIE</T>
      <T x={22} y={332} k={k} size={12} op={0.7}>← TUAS · JURONG</T>
      <T x={1280} y={296} k={k} size={12} anchor="end" op={0.7}>CHANGI AIRPORT →</T>
      {!compact && <T x={512} y={480} size={12} rot={-88} op={0.75}>ADAM ROAD</T>}
      {!compact && <T x={80} y={492} size={12} rot={12.6} op={0.75}>DUNEARN ROAD</T>}
      {!compact && <T x={80} y={560} size={12} rot={12.6} op={0.75}>BUKIT TIMAH ROAD</T>}
      {!compact && <T x={784} y={900} size={12} rot={-88} op={0.75}>STEVENS ROAD</T>}
      <T x={960} y={930} k={k} size={13} rot={-7.2} op={0.85}>ORCHARD ROAD</T>
      <T x={1280} y={806} k={k} size={12} anchor="end" op={0.7}>CBD · MARINA BAY →</T>
      <T x={30} y={1070} k={k} size={12} op={0.65}>ROUTES · DIAGRAMMATIC, NOT TO SCALE</T>
      <North />
    </svg>
  );
}
