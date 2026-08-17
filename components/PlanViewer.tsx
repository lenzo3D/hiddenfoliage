"use client";

// PLANS — the place to actually inspect the house. True plan view of each level
// drawn from the same data as the Four Levels act, at a size you can read.
//
// Desktop: level tabs, one large drawing (all levels rendered, the chosen one
// shown; the site boundary always faintly present for context), zoom 1–3× with
// drag-to-pan, and fullscreen. Phones: the drawing is rotated so the long site
// runs down the screen at a readable size; labels are counter-rotated upright.
// The north point is drawn as on the architect's sheets (north = plan left,
// towards the road), so on phones it points down the screen.
//
// Two ways to read size, both honest about their limits:
//   • Furnished / Bare — the sales plans' suggested furniture, redrawn as
//     hairline symbols (beds, seating, the dining table for ten, the island,
//     cars, deck seats), so rooms read at human scale;
//   • Measure — tap two points and the distance is read off the diagram,
//     calibrated on the only written dimension (the 18 m pool), shown as
//     "≈ 6.4 m". A 5 m scale bar sits in the margin. No room dimensions are
//     printed, because none are given on the sheets.

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import { FURNITURE, LEVELS, METRES_PER_UNIT, PLAN_BOUNDS, type Level } from "./floorPlans";
import { ShapeEl } from "./PlanSvg";

// Tabs are listed bottom-to-top, as you would climb the house.
const ORDER: Level["id"][] = ["basement", "first", "second", "attic"];
const ZOOMS = [1, 1.5, 2, 3];

const B = PLAN_BOUNDS;
const M = 40;
const VIEW_LANDSCAPE = `${B.x - M} ${B.y - M} ${B.w + 2 * M} ${B.h + 2 * M}`;
// Rotated by -90°: (x, y) → (y, -x). Site runs top-to-bottom; plan left (north) points down.
const VIEW_PORTRAIT = `${B.y - M} ${-(B.x + B.w) - M} ${B.h + 2 * M} ${B.w + 2 * M}`;

// The site boundary (plot line + wall) lives in the first-storey data; every
// level shows it faintly so the footprint reads against the plot.
const SITE = LEVELS.find((l) => l.id === "first")!.shapes.slice(0, 2).map((s) => ({ ...s, weight: "hair" as const, draw: undefined, dashed: true }));

type Pt = { x: number; y: number };
const metres = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y) * METRES_PER_UNIT;

// Control styling: the annotation register, ivory when active, stone otherwise.
const tabClass = (on: boolean) =>
  `font-sans text-[0.6875rem] uppercase tracking-[0.18em] transition-colors md:text-xs ${on ? "text-foreground" : "text-stone hover:text-foreground"}`;
const ctrl = "font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone transition-colors hover:text-foreground disabled:opacity-40 disabled:hover:text-stone md:text-xs";
const Underline = ({ on }: { on: boolean }) => <span aria-hidden="true" className={`mt-1 block h-px w-full ${on ? "bg-foreground/70" : "bg-transparent"}`} />;

function roomsOf(level: Level) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of level.shapes) {
    if (s.kind !== "label") continue;
    const t = s.text.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

// The north point, as drawn on the architect's sheets: north lies to the plan's
// left, towards Berrima Road (the car-porch side). Drawn in the margin above
// the plot's north-west corner; the letter stays upright when the sheet is
// rotated on phones, where the arrow then points down the screen.
function NorthArrow({ labelTransform }: { labelTransform?: string }) {
  return (
    <g transform={`translate(${B.x + 40} ${B.y - 8})`}>
      <line x1={0} y1={0} x2={-46} y2={0} stroke="#b8b2a4" strokeWidth={0.8} strokeOpacity={0.8} vectorEffect="non-scaling-stroke" />
      <path d="M-46 0 l9 -4.5 v9 z" fill="#b8b2a4" fillOpacity={0.8} />
      <g transform="translate(-60 0)">
        <text className="plan-label" transform={labelTransform} textAnchor="middle" dominantBaseline="middle" fontSize={21} fill="#b8b2a4" fillOpacity={0.85}>
          N
        </text>
      </g>
    </g>
  );
}

// A 5 m bar in the margin below the plot's south-west corner. On phones the
// sheet is rotated, so the bar stands upright and the label sits past its
// lower end, reading down the screen.
function ScaleBar({ portrait }: { portrait: boolean }) {
  const len = 5 / METRES_PER_UNIT;
  const x = B.x + 50;
  const y = B.y + B.h + 22;
  const labelX = portrait ? x - 16 : x + len + 16;
  return (
    <g stroke="#b8b2a4" strokeOpacity={0.8} strokeWidth={0.8} vectorEffect="non-scaling-stroke">
      <line x1={x} y1={y} x2={x + len} y2={y} />
      <line x1={x} y1={y - 5} x2={x} y2={y + 5} />
      <line x1={x + len / 2} y1={y - 3} x2={x + len / 2} y2={y + 3} />
      <line x1={x + len} y1={y - 5} x2={x + len} y2={y + 5} />
      <g transform={`translate(${labelX} ${y})`} stroke="none">
        <text className="plan-label" transform={portrait ? "rotate(90)" : undefined} dominantBaseline="middle" fontSize={18} fill="#b8b2a4" fillOpacity={0.85} letterSpacing="2">
          5 M
        </text>
      </g>
    </g>
  );
}

// The measurement: one point, or two joined by a line with the length beside it.
function Measurement({ pts, labelTransform }: { pts: Pt[]; labelTransform?: string }) {
  if (!pts.length) return null;
  const [a, b] = pts;
  const mid = b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : null;
  return (
    <g className="measure">
      {b && <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#ebe9e2" strokeWidth={1} vectorEffect="non-scaling-stroke" strokeDasharray="4 3" />}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={7} fill="none" stroke="#ebe9e2" strokeWidth={0.9} vectorEffect="non-scaling-stroke" />
          <circle cx={p.x} cy={p.y} r={1.6} fill="#ebe9e2" />
        </g>
      ))}
      {mid && b && (
        <g transform={`translate(${mid.x} ${mid.y - 12})`}>
          <text className="plan-label" transform={labelTransform} textAnchor="middle" fontSize={22} fill="#ebe9e2">
            {`≈ ${metres(a, b).toFixed(1)} m`}
          </text>
        </g>
      )}
    </g>
  );
}

function Drawing({
  active,
  portrait,
  furnished,
  measure,
  planRef,
}: {
  active: Level["id"];
  portrait: boolean;
  furnished: boolean;
  measure: Pt[];
  planRef: RefObject<SVGGElement | null>;
}) {
  const g = portrait ? "rotate(-90)" : undefined;
  const label = portrait ? "rotate(90)" : undefined;
  return (
    <svg viewBox={portrait ? VIEW_PORTRAIT : VIEW_LANDSCAPE} className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g ref={planRef} transform={g}>
        <g className="site" opacity={0.6}>
          {SITE.map((s, i) => (
            <ShapeEl key={i} s={s} labelTransform={label} />
          ))}
        </g>
        <NorthArrow labelTransform={label} />
        <ScaleBar portrait={portrait} />
        {LEVELS.map((level) => (
          <g key={level.id} className="transition-opacity duration-500 ease-out motion-reduce:transition-none" style={{ opacity: level.id === active ? 1 : 0 }} aria-hidden={level.id !== active}>
            {level.shapes.map((s, i) => (
              <ShapeEl key={i} s={s} labelTransform={label} />
            ))}
            <g className="furniture transition-opacity duration-500 ease-out motion-reduce:transition-none" style={{ opacity: furnished ? 1 : 0 }}>
              {FURNITURE[level.id].map((s, i) => (
                <ShapeEl key={i} s={s} labelTransform={label} />
              ))}
            </g>
          </g>
        ))}
        <Measurement pts={measure} labelTransform={label} />
      </g>
    </svg>
  );
}

export default function PlanViewer() {
  const [active, setActive] = useState<Level["id"]>("first");
  const [zoomIdx, setZoomIdx] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [fs, setFs] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [furnished, setFurnished] = useState(true);
  const [measuring, setMeasuring] = useState(false);
  const [measure, setMeasure] = useState<Pt[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const deskPlanRef = useRef<SVGGElement>(null);
  const phonePlanRef = useRef<SVGGElement>(null);
  const drag = useRef<{ x: number; y: number; px: number; py: number; moved: boolean } | null>(null);
  const zoom = ZOOMS[zoomIdx];
  const level = useMemo(() => LEVELS.find((l) => l.id === active)!, [active]);

  const clampPan = useCallback(
    (p: { x: number; y: number }, z: number) => {
      const el = stageRef.current;
      if (!el) return p;
      const maxX = ((z - 1) * el.clientWidth) / 2;
      const maxY = ((z - 1) * el.clientHeight) / 2;
      return { x: Math.max(-maxX, Math.min(maxX, p.x)), y: Math.max(-maxY, Math.min(maxY, p.y)) };
    },
    [],
  );

  const setZoom = (i: number) => {
    const z = ZOOMS[Math.max(0, Math.min(ZOOMS.length - 1, i))];
    setZoomIdx(ZOOMS.indexOf(z));
    setPan((p) => (z === 1 ? { x: 0, y: 0 } : clampPan(p, z)));
  };

  // A screen point → plan coordinates, through whatever rotation, zoom and pan
  // the drawing currently has (getScreenCTM includes all of it).
  const toPlan = (ref: RefObject<SVGGElement | null>, clientX: number, clientY: number): Pt | null => {
    const m = ref.current?.getScreenCTM();
    if (!m) return null;
    const p = new DOMPoint(clientX, clientY).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };
  const addPoint = (p: Pt | null) => {
    if (!p) return;
    setMeasure((prev) => {
      if (prev.length >= 2) return [p];
      if (prev.length === 1 && Math.hypot(prev[0].x - p.x, prev[0].y - p.y) < 3) return prev; // a double tap is not a second point
      return [...prev, p];
    });
  };
  const toggleMeasuring = () => {
    setMeasuring((m) => !m);
    setMeasure([]);
  };

  // Desktop stage: drag to pan (when zoomed); a still click measures (when measuring).
  const onPointerDown = (e: ReactPointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y, moved: false };
    if (zoom > 1) {
      setDragging(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    if (Math.hypot(dx, dy) > 5) drag.current.moved = true;
    if (zoom > 1 && drag.current.moved) setPan(clampPan({ x: drag.current.px + dx, y: drag.current.py + dy }, zoom));
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    const d = drag.current;
    drag.current = null;
    setDragging(false);
    if (d && !d.moved && measuring) addPoint(toPlan(deskPlanRef, e.clientX, e.clientY));
  };

  // Fullscreen (desktop). Escape is handled by the browser; we mirror the state.
  useEffect(() => {
    const onChange = () => setFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  const toggleFs = async () => {
    const el = stageRef.current?.parentElement;
    if (!el) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await el.requestFullscreen();
    } catch {
      /* unsupported: ignore quietly */
    }
  };

  // Furnished / Bare and Measure / Clear — shared by the desktop and phone controls.
  const readingControls = (
    <>
      <span role="group" aria-label="Furniture" className="flex items-baseline gap-4">
        {(["Furnished", "Bare"] as const).map((t) => {
          const on = (t === "Furnished") === furnished;
          return (
            <button key={t} type="button" aria-pressed={on} onClick={() => setFurnished(t === "Furnished")} className={tabClass(on)}>
              {t}
              <Underline on={on} />
            </button>
          );
        })}
      </span>
      <button type="button" aria-pressed={measuring} onClick={toggleMeasuring} className={tabClass(measuring)}>
        Measure
        <Underline on={measuring} />
      </button>
      {measure.length > 0 && (
        <button type="button" onClick={() => setMeasure([])} className={ctrl}>
          Clear
        </button>
      )}
    </>
  );

  return (
    <div>
      {/* Level tabs */}
      <div role="tablist" aria-label="Levels" className="flex flex-wrap items-baseline gap-x-7 gap-y-3 md:gap-x-10">
        {ORDER.map((id) => {
          const l = LEVELS.find((x) => x.id === id)!;
          return (
            <button key={id} role="tab" aria-selected={id === active} onClick={() => setActive(id)} className={tabClass(id === active)}>
              {l.name}
              <Underline on={id === active} />
            </button>
          );
        })}
      </div>

      {/* Desktop stage: fixed height, zoom + pan + fullscreen, furniture, measure */}
      <div className={`mt-8 hidden md:block ${fs ? "bg-background p-[4vh]" : ""}`}>
        <div className="flex flex-wrap items-baseline justify-between gap-y-3">
          <p className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs">
            {level.name}
            <span aria-hidden="true"> · </span>
            <span className="text-foreground/80">{level.caption}</span>
          </p>
          <div className="flex flex-wrap items-baseline gap-6">
            {readingControls}
            <span aria-hidden="true" className="h-3 w-px self-center bg-stone/30" />
            <button className={ctrl} onClick={() => setZoom(zoomIdx - 1)} disabled={zoomIdx === 0} aria-label="Zoom out">
              −
            </button>
            <span className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs" aria-live="polite">
              {zoom}×
            </span>
            <button className={ctrl} onClick={() => setZoom(zoomIdx + 1)} disabled={zoomIdx === ZOOMS.length - 1} aria-label="Zoom in">
              +
            </button>
            <button className={ctrl} onClick={toggleFs}>
              {fs ? "Exit fullscreen" : "Fullscreen"}
            </button>
          </div>
        </div>
        <div
          ref={stageRef}
          className={`relative mt-4 w-full select-none overflow-hidden border-y border-stone/15 touch-none ${fs ? "h-[80vh]" : "h-[62vh]"} ${
            measuring ? "cursor-crosshair" : zoom > 1 ? "cursor-grab active:cursor-grabbing" : ""
          }`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={() => !measuring && setZoom(zoom === 1 ? 2 : 0)}
        >
          <div className="h-full w-full will-change-transform" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transition: dragging ? "none" : "transform 0.35s ease-out" }}>
            <Drawing active={active} portrait={false} furnished={furnished} measure={measure} planRef={deskPlanRef} />
          </div>
        </div>
        <p className="mt-3 font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone/70" aria-live="polite">
          {measuring
            ? measure.length < 2
              ? "Measure · click two points on the drawing"
              : `Measure · ≈ ${metres(measure[0], measure[1]).toFixed(1)} m · click again to start another`
            : "Double-click to zoom · drag to pan · north point as drawn · plans are diagrammatic, not to scale"}
        </p>
      </div>

      {/* Phone: rotated sheet, tall in the page flow; tap to measure */}
      <div className="mt-8 md:hidden">
        <p className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone">
          {level.name}
          <span aria-hidden="true"> · </span>
          <span className="text-foreground/80">{level.caption}</span>
        </p>
        <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-3">{readingControls}</div>
        <div className={`mt-4 w-full border-y border-stone/15 py-4 ${measuring ? "cursor-crosshair" : ""}`}>
          <div
            className="mx-auto aspect-[510/1490] w-full"
            onClick={(e) => measuring && addPoint(toPlan(phonePlanRef, e.clientX, e.clientY))}
          >
            <Drawing active={active} portrait furnished={furnished} measure={measure} planRef={phonePlanRef} />
          </div>
        </div>
        <p className="mt-3 font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone/70" aria-live="polite">
          {measuring
            ? measure.length < 2
              ? "Measure · tap two points on the drawing"
              : `Measure · ≈ ${metres(measure[0], measure[1]).toFixed(1)} m · tap again to start another`
            : "North point as drawn · not to scale"}
        </p>
      </div>

      {/* Rooms on this level */}
      <p className="mt-6 max-w-[80ch] font-sans text-sm leading-relaxed text-stone md:text-[0.9375rem]">
        {roomsOf(level).join(" · ")}
        {level.note ? ` · ${level.note}` : ""}
      </p>
      <p className="mt-4 max-w-[70ch] font-sans text-[0.6875rem] leading-relaxed text-stone/80">
        Furniture is the sales plans&rsquo; suggested layout, indicative only. Measured lengths are read off the diagram,
        calibrated on the 18-metre pool, and are approximate (within a few percent) — please verify on site or with the
        agent.
      </p>
    </div>
  );
}
