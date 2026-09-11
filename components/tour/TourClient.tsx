"use client";

// The tour's ground floor: the two levels that have panoramas, drawn with the
// same plan components as /plans, each room with a panorama carrying a small
// ivory marker. Tap a marker and the 360 viewer opens over the page; inside
// it, doorway hotspots move between rooms and Close returns here.

import { useState } from "react";
import { LEVELS, PLAN_BOUNDS } from "../floorPlans";
import { ShapeEl } from "../PlanSvg";
import { label } from "../Editorial";
import PanoViewer from "./PanoViewer";
import { TOUR_ROOMS } from "./tourData";

const pct = (v: number, min: number, span: number) => ((v - min) / span) * 100;

function LevelPlan({ levelId, title, onPick }: { levelId: "first" | "second"; title: string; onPick: (id: string) => void }) {
  const level = LEVELS.find((l) => l.id === levelId)!;
  const rooms = TOUR_ROOMS.filter((r) => r.level === levelId);
  return (
    <div>
      <p className={label}>{title}</p>
      <div className="relative mt-6">
        <svg viewBox={`${PLAN_BOUNDS.x} ${PLAN_BOUNDS.y} ${PLAN_BOUNDS.w} ${PLAN_BOUNDS.h}`} className="w-full" aria-hidden="true">
          {level.shapes.map((s, i) => (
            <ShapeEl key={i} s={s} />
          ))}
        </svg>
        {/* Markers as HTML so the tap target stays finger-sized at any width. */}
        {rooms.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => onPick(r.id)}
            className="group absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ left: `${pct(r.marker.x, PLAN_BOUNDS.x, PLAN_BOUNDS.w)}%`, top: `${pct(r.marker.y, PLAN_BOUNDS.y, PLAN_BOUNDS.h)}%` }}
            aria-label={`View ${r.name} in 360`}
          >
            <span aria-hidden="true" className="tour-marker block h-3 w-3 rounded-full border border-foreground/90 bg-background/60 transition-transform group-hover:scale-125" />
          </button>
        ))}
      </div>
      <p className={`mt-4 ${label} text-stone/70`}>
        {rooms.map((r) => r.name).join(" · ")}
      </p>
    </div>
  );
}

export default function TourClient() {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

  return (
    <>
      <div className="mt-[8vh] space-y-[12vh] md:mt-[10vh] md:space-y-[14vh]">
        <LevelPlan levelId="first" title="First storey" onPick={setActiveRoom} />
        <LevelPlan levelId="second" title="Second storey" onPick={setActiveRoom} />
      </div>
      {activeRoom && <PanoViewer roomId={activeRoom} onNavigate={setActiveRoom} onClose={() => setActiveRoom(null)} />}
    </>
  );
}
