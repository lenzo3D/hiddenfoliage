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

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LEVELS, PLAN_BOUNDS, type Level } from "./floorPlans";
import { ShapeEl } from "./PlanSvg";

// Tabs are listed bottom-to-top, as you would climb the house.
const ORDER: Level["id"][] = ["basement", "first", "second", "attic"];
const ZOOMS = [1, 1.5, 2, 3];

const B = PLAN_BOUNDS;
const M = 40;
const VIEW_LANDSCAPE = `${B.x - M} ${B.y - M} ${B.w + 2 * M} ${B.h + 2 * M}`;
// Rotated by -90°: (x, y) → (y, -x). Site runs top-to-bottom, plan "north" to the left.
const VIEW_PORTRAIT = `${B.y - M} ${-(B.x + B.w) - M} ${B.h + 2 * M} ${B.w + 2 * M}`;

// The site boundary (plot line + wall) lives in the first-storey data; every
// level shows it faintly so the footprint reads against the plot.
const SITE = LEVELS.find((l) => l.id === "first")!.shapes.slice(0, 2).map((s) => ({ ...s, weight: "hair" as const, draw: undefined, dashed: true }));

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

function Drawing({ active, portrait }: { active: Level["id"]; portrait: boolean }) {
  const g = portrait ? "rotate(-90)" : undefined;
  const label = portrait ? "rotate(90)" : undefined;
  return (
    <svg viewBox={portrait ? VIEW_PORTRAIT : VIEW_LANDSCAPE} className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g transform={g}>
        <g className="site" opacity={0.6}>
          {SITE.map((s, i) => (
            <ShapeEl key={i} s={s} labelTransform={label} />
          ))}
        </g>
        <NorthArrow labelTransform={label} />
        {LEVELS.map((level) => (
          <g key={level.id} className="transition-opacity duration-500 ease-out motion-reduce:transition-none" style={{ opacity: level.id === active ? 1 : 0 }} aria-hidden={level.id !== active}>
            {level.shapes.map((s, i) => (
              <ShapeEl key={i} s={s} labelTransform={label} />
            ))}
          </g>
        ))}
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
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
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

  // Drag to pan (only meaningful when zoomed).
  const onPointerDown = (e: React.PointerEvent) => {
    if (zoom === 1) return;
    drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setPan(clampPan({ x: drag.current.px + (e.clientX - drag.current.x), y: drag.current.py + (e.clientY - drag.current.y) }, zoom));
  };
  const onPointerUp = () => {
    drag.current = null;
    setDragging(false);
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

  const tabClass = (id: Level["id"]) =>
    `font-sans text-[0.6875rem] uppercase tracking-[0.18em] transition-colors md:text-xs ${
      id === active ? "text-foreground" : "text-stone hover:text-foreground"
    }`;
  const ctrl = "font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone hover:text-foreground disabled:opacity-40 disabled:hover:text-stone md:text-xs";

  return (
    <div>
      {/* Level tabs */}
      <div role="tablist" aria-label="Levels" className="flex flex-wrap items-baseline gap-x-7 gap-y-3 md:gap-x-10">
        {ORDER.map((id) => {
          const l = LEVELS.find((x) => x.id === id)!;
          return (
            <button key={id} role="tab" aria-selected={id === active} onClick={() => setActive(id)} className={tabClass(id)}>
              {l.name}
              <span aria-hidden="true" className={`mt-1 block h-px w-full ${id === active ? "bg-foreground/70" : "bg-transparent"}`} />
            </button>
          );
        })}
      </div>

      {/* Desktop stage: fixed height, zoom + pan + fullscreen */}
      <div className={`mt-8 hidden md:block ${fs ? "bg-background p-[4vh]" : ""}`}>
        <div className="flex items-baseline justify-between">
          <p className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs">
            {level.name}
            <span aria-hidden="true"> · </span>
            <span className="text-foreground/80">{level.caption}</span>
          </p>
          <div className="flex items-baseline gap-6">
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
          className={`relative mt-4 w-full select-none overflow-hidden border-y border-stone/15 touch-none ${fs ? "h-[80vh]" : "h-[62vh]"} ${zoom > 1 ? "cursor-grab active:cursor-grabbing" : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={() => setZoom(zoom === 1 ? 2 : 0)}
        >
          <div className="h-full w-full will-change-transform" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transition: dragging ? "none" : "transform 0.35s ease-out" }}>
            <Drawing active={active} portrait={false} />
          </div>
        </div>
        <p className="mt-3 font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone/70">
          Double-click to zoom · drag to pan · north point as drawn · plans are diagrammatic, not to scale
        </p>
      </div>

      {/* Phone: rotated sheet, tall in the page flow */}
      <div className="mt-8 md:hidden">
        <p className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone">
          {level.name}
          <span aria-hidden="true"> · </span>
          <span className="text-foreground/80">{level.caption}</span>
        </p>
        <div className="mt-4 w-full border-y border-stone/15 py-4">
          <div className="mx-auto aspect-[510/1490] w-full">
            <Drawing active={active} portrait />
          </div>
        </div>
        <p className="mt-3 font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone/70">North point as drawn · not to scale</p>
      </div>

      {/* Rooms on this level */}
      <p className="mt-6 max-w-[80ch] font-sans text-sm leading-relaxed text-stone md:text-[0.9375rem]">
        {roomsOf(level).join(" · ")}
        {level.note ? ` · ${level.note}` : ""}
      </p>
    </div>
  );
}
