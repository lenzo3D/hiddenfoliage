// Renders one plan Shape (from floorPlans.ts) as SVG, in the site's line
// language: ivory principal lines, stone secondary and hairline lines, all
// non-scaling so they stay ~1px at any size. Shared by the Four Levels act
// (oblique, on Home) and the Plans page (true plan view).

import type { Shape } from "./floorPlans";

export const STROKE = {
  principal: { color: "#ebe9e2", width: 1.25, opacity: 1 },
  secondary: { color: "#b8b2a4", width: 0.8, opacity: 0.8 },
  hair: { color: "#b8b2a4", width: 0.6, opacity: 0.5 },
};

export function ShapeEl({ s, labelTransform }: { s: Shape; labelTransform?: string }) {
  const w = "weight" in s && s.weight ? STROKE[s.weight] : STROKE.secondary;
  const common = { fill: "none", stroke: w.color, strokeWidth: w.width, strokeOpacity: w.opacity, vectorEffect: "non-scaling-stroke" as const, strokeLinejoin: "miter" as const, strokeLinecap: "square" as const };
  const dashed = "dashed" in s && s.dashed ? { strokeDasharray: "5 4" } : {};
  switch (s.kind) {
    case "rect":
      return <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} {...common} {...dashed} className={s.draw ? "draw" : undefined} />;
    case "circle":
      return <circle cx={s.cx} cy={s.cy} r={s.r} {...common} />;
    case "poly": {
      const d = s.pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ") + (s.close === false ? "" : " Z");
      return <path d={d} {...common} {...dashed} className={s.draw ? "draw" : undefined} />;
    }
    case "line":
      return <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} {...common} {...dashed} />;
    case "stair": {
      const n = s.treads ?? 8;
      const lines = [];
      for (let i = 1; i < n; i++) {
        const t = i / n;
        lines.push(s.dir === "v"
          ? <line key={i} x1={s.x} y1={s.y + s.h * t} x2={s.x + s.w} y2={s.y + s.h * t} />
          : <line key={i} x1={s.x + s.w * t} y1={s.y} x2={s.x + s.w * t} y2={s.y + s.h} />);
      }
      return (
        <g {...common} strokeWidth={STROKE.secondary.width} stroke={STROKE.secondary.color} strokeOpacity={STROKE.secondary.opacity}>
          <rect x={s.x} y={s.y} width={s.w} height={s.h} />
          <g strokeOpacity={STROKE.hair.opacity} strokeWidth={STROKE.hair.width}>{lines}</g>
        </g>
      );
    }
    case "lift":
      return (
        <g {...common} stroke={STROKE.secondary.color} strokeWidth={STROKE.secondary.width} strokeOpacity={STROKE.secondary.opacity}>
          <rect x={s.x} y={s.y} width={s.w} height={s.h} />
          <rect x={s.x + s.w * 0.22} y={s.y + s.h * 0.2} width={s.w * 0.56} height={s.h * 0.44} strokeOpacity={STROKE.hair.opacity} strokeWidth={STROKE.hair.width} />
          <path d={`M${s.x + s.w * 0.22} ${s.y + s.h * 0.2} l${s.w * 0.56} ${s.h * 0.44} M${s.x + s.w * 0.78} ${s.y + s.h * 0.2} l${-s.w * 0.56} ${s.h * 0.44}`} strokeOpacity={STROKE.hair.opacity} strokeWidth={STROKE.hair.width} />
        </g>
      );
    case "cross":
      return <path d={`M${s.x} ${s.y} L${s.x + s.w} ${s.y + s.h} M${s.x + s.w} ${s.y} L${s.x} ${s.y + s.h}`} {...common} stroke={STROKE.hair.color} strokeWidth={STROKE.hair.width} strokeOpacity={STROKE.hair.opacity} strokeDasharray="5 4" />;
    case "label":
      // Positioned in plan space; the glyphs are counter-skewed (see .plan-label
      // transform set at runtime) so type stays upright and unsquashed.
      return (
        <g transform={`translate(${s.x} ${s.y})`} className="plan-room-label">
          <text className="plan-label" data-rotate={s.rotate ? "1" : undefined} transform={labelTransform && !s.along ? (s.rotate ? `${labelTransform} rotate(-90)` : labelTransform) : s.rotate ? "rotate(-90)" : undefined} textAnchor={s.anchor ?? "middle"} fontSize={s.size === "m" ? 25 : 21} fill="#b8b2a4" fillOpacity={0.85}>
            {s.text.split("\n").map((line, i) => (
              <tspan key={i} x={0} dy={i ? "1.15em" : 0}>
                {line}
              </tspan>
            ))}
          </text>
        </g>
      );
  }
}
