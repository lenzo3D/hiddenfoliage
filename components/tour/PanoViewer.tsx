"use client";

// The 360 viewer overlay. Pannellum (self-hosted, no CDN) draws each room as
// a cube of image tiles at several resolutions (its "multires" mode): drag to
// look, pinch or scroll to zoom, inertia built in. One viewer lives for the
// whole visit and every room and style is a Pannellum *scene*, so moving
// between rooms is a crossfade rather than a reload, and a link marked
// `walk` (living ↔ dining, drawn from the same open-plan space) plays as a
// step forward: the view glides toward the floor arrow, the next room fades
// in slightly wide, and the lens settles back. The chrome is the site's
// annotation register — room name and credit top-left, Close top-right,
// style tabs and the hint along the bottom, a small plan with your heading
// bottom-right. Escape closes. The page behind is scroll-locked.

import { useCallback, useEffect, useRef, useState } from "react";
import "pannellum/build/pannellum.css";
import { asset } from "../asset";
import { LEVELS, PLAN_BOUNDS } from "../floorPlans";
import { ShapeEl } from "../PlanSvg";
import { roomById, TOUR_ROOMS, type TourLink, type TourRoom, type TourStyle } from "./tourData";

declare global {
  interface Window {
    pannellum: { viewer: (el: HTMLElement, cfg: Record<string, unknown>) => PannellumViewer };
  }
}
type PannellumViewer = {
  destroy: () => void;
  getYaw: () => number;
  getPitch: () => number;
  getHfov: () => number;
  getScene: () => string;
  isLoaded: () => boolean;
  loadScene: (id: string, pitch?: number, yaw?: number, hfov?: number) => void;
  lookAt: (pitch?: number, yaw?: number, hfov?: number, animated?: number | false) => void;
  setHfov: (hfov: number, animated?: number | false) => void;
  setYaw: (yaw: number, animated?: number | false) => void;
  on: (type: string, fn: (...a: unknown[]) => void) => void;
  off: (type: string, fn?: (...a: unknown[]) => void) => void;
};

const label = "font-sans text-[0.6875rem] uppercase tracking-[0.18em] md:text-xs";

// How every room's tile set is cut (scripts in docs/HANDOFF.md): a 14192-wide
// equirectangular strip becomes six 4512 px cube faces, each split into 512 px
// JPEG tiles over five levels (4512 → 2256 → 1128 → 564 → 282). The viewer
// fetches only the tiles in view at the level that matches the screen's own
// pixel density, so a Retina display sees the full resolution and a phone
// never downloads more than it can show. No single texture is ever larger
// than 512 px, which is why the old 4096-wide "phone" copies are gone.
const TILES = { path: "/%l/%s%y_%x", extension: "jpg", tileResolution: 512, maxLevel: 5, cubeResolution: 4512 };

const sceneId = (room: TourRoom, style: TourStyle) => `${room.id}/${style.id}`;
const parseScene = (id: string) => {
  const [roomId, styleId] = id.split("/");
  const room = roomById(roomId)!;
  return { room, style: room.styles.find((s) => s.id === styleId) ?? room.styles[0] };
};
const linksOf = (room: TourRoom, style: TourStyle) => style.links ?? room.links;
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// Plan-space heading. Each room knows the yaw (in its own drawing) of at
// least one neighbour, and the plan knows where both rooms sit, so the
// bearing of that neighbour on the plan pins the drawing's yaw 0 to the plan.
function headingOffset(room: TourRoom, style: TourStyle) {
  const l = linksOf(room, style)[0];
  const t = l && roomById(l.to);
  if (!t) return 0;
  const bearing = (Math.atan2(t.marker.y - room.marker.y, t.marker.x - room.marker.x) * 180) / Math.PI + 90; // SVG y grows downward; 0 = up
  return bearing - l.yaw;
}

export default function PanoViewer({ roomId, onNavigate, onClose }: { roomId: string; onNavigate: (id: string) => void; onClose: () => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PannellumViewer | null>(null);
  const [current, setCurrent] = useState(() => {
    const room = roomById(roomId)!;
    return { room, style: room.styles[0] };
  });
  const [ready, setReady] = useState(false);
  const [walking, setWalking] = useState(false);
  const [touring, setTouring] = useState(false);
  const cancelTour = useRef(false);
  const wedgeRef = useRef<SVGGElement>(null);
  const { room, style } = current;

  const viewOf = useCallback(() => {
    const box = boxRef.current!;
    const portrait = box.clientHeight > box.clientWidth;
    return { portrait, hfov0: portrait ? 46 : 56 };
  }, []);

  // Move to another room (and style). "walk": glide toward the arrow, fade
  // in wide, settle. "jump": plain crossfade. Returns when the move is done.
  const go = useCallback(
    async (to: string, mode: "walk" | "jump", via?: TourLink) => {
      const v = viewerRef.current;
      if (!v) return;
      const target = roomById(to)!;
      const tStyle = target.styles.find((s) => s.id === parseScene(v.getScene()).style.id) ?? target.styles[0];
      const { hfov0 } = viewOf();
      const yaw0 = tStyle.yaw0 ?? target.yaw0;
      if (mode === "walk" && via) {
        setWalking(true);
        v.lookAt(-4, via.yaw, hfov0 - 14, 750);
        await wait(780);
        v.loadScene(sceneId(target, tStyle), -2, yaw0, hfov0 + 10);
        await wait(120);
        v.setHfov(hfov0, 900);
        await wait(900);
        setWalking(false);
      } else {
        v.loadScene(sceneId(target, tStyle), 0, yaw0, hfov0);
      }
      onNavigate(to);
    },
    [onNavigate, viewOf],
  );
  const goRef = useRef(go);
  useEffect(() => {
    goRef.current = go;
  }, [go]);

  // Build the one viewer with every room and style as a scene.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const box = boxRef.current;
      if (!box) return;
      // Pannellum attaches itself to window on import (client only).
      await import("pannellum/build/pannellum.js" as string);
      if (cancelled || !box.isConnected) return;
      const { portrait, hfov0 } = viewOf();
      const first = roomById(roomId)!;
      const scenes: Record<string, unknown> = {};
      for (const r of TOUR_ROOMS)
        for (const s of r.styles)
          scenes[sceneId(r, s)] = {
            type: "multires",
            multiRes: { basePath: asset(s.src), ...TILES },
            yaw: s.yaw0 ?? r.yaw0,
            hotSpots: linksOf(r, s).map((l) => ({
              yaw: l.yaw,
              pitch: l.walk ? -20 : (l.pitch ?? 0),
              cssClass: l.walk ? "tour-walk" : "tour-hotspot",
              createTooltipFunc: (el: HTMLElement) => {
                el.innerHTML = l.walk
                  ? '<span class="tour-walk-disc" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 5 5 13h4.5v6h5v-6H19z" fill="currentColor"/></svg></span><span class="tour-hotspot-label">' +
                    l.label +
                    "</span>"
                  : '<span class="tour-hotspot-ring" aria-hidden="true"></span><span class="tour-hotspot-label">' + l.label + "</span>";
                el.setAttribute("role", "button");
                el.setAttribute("aria-label", (l.walk ? "Walk to " : "Go to ") + l.label);
              },
              clickHandlerFunc: () => goRef.current(l.to, l.walk ? "walk" : "jump", l),
            })),
          };
      // The drawings were cylindrical panoramas, not equirectangular ones:
      // rendered as a sphere every straight line bowed, whatever the field
      // of view. The tile sets are cut from true equirectangular strips
      // (tourData.ts), so the cube is correct and walls, shelving and
      // ceilings stay straight. Open at 56° and zoom 40–68° (46° / up to 56°
      // on portrait phones, which see far more vertically for the same
      // width): the drawings' own curves grow with the field of view, and 56°
      // is where a bowed wall stops reading as bowed on a laptop. Tilt is
      // limited to keep the view on the strip (the source reaches ±57.5°;
      // beyond it the tiles hold the page's dark ground), and the upward tilt
      // a little more, because the drawn ceiling coves still arch slightly.
      const v = window.pannellum.viewer(box, {
        default: {
          firstScene: sceneId(first, first.styles[0]),
          sceneFadeDuration: 900,
          autoLoad: true,
          showControls: false,
          compass: false,
          keyboardZoom: true,
          mouseZoom: true,
          friction: 0.12, // a touch more glide than default
          pitch: 0,
          hfov: hfov0,
          minPitch: portrait ? -15 : -30,
          maxPitch: portrait ? 8 : 14,
          minHfov: 40,
          maxHfov: portrait ? 56 : 68,
          backgroundColor: [7 / 255, 11 / 255, 8 / 255],
        },
        scenes,
      });
      viewerRef.current = v;
      v.on("scenechange", (id) => setCurrent(parseScene(id as string)));
      v.on("load", () => setReady(true));
      // Any hand on the viewer ends the auto-walk.
      for (const ev of ["mousedown", "touchstart"]) v.on(ev, () => (cancelTour.current = true));
    })();
    return () => {
      cancelled = true;
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
    // Mount once; later room changes go through go().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Minimap heading: read the yaw every frame while the overlay is up and
  // turn the wedge directly (no React render per frame).
  useEffect(() => {
    let raf = 0;
    const off = headingOffset(room, style);
    const tick = () => {
      const v = viewerRef.current;
      if (v && wedgeRef.current) wedgeRef.current.setAttribute("transform", `rotate(${v.getYaw() + off})`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [room, style]);

  const setStyle = (s: TourStyle) => {
    const v = viewerRef.current;
    if (!v) return;
    // Hold the view across a style change.
    v.loadScene(sceneId(room, s), v.getPitch(), v.getYaw(), v.getHfov());
  };

  // Auto-walk: pan to the arrow, step through, look around, step back.
  const tour = useCallback(async () => {
    const v = viewerRef.current;
    if (!v || touring) return;
    cancelTour.current = false;
    setTouring(true);
    const stop = () => cancelTour.current;
    const pan = async (yaw: number, ms: number) => {
      v.setYaw(yaw, ms);
      const t0 = Date.now();
      while (Date.now() - t0 < ms + 60) {
        if (stop()) return;
        await wait(50);
      }
    };
    const walkLink = (r: TourRoom, s: TourStyle) => linksOf(r, s).find((l) => l.walk);
    let here = parseScene(v.getScene());
    for (let step = 0; step < 2 && !stop(); step++) {
      const l = walkLink(here.room, here.style);
      if (!l) break;
      await pan(l.yaw, 1800);
      if (stop()) break;
      await goRef.current(l.to, "walk", l);
      if (stop()) break;
      await wait(500);
      here = parseScene(v.getScene());
      await pan(v.getYaw() + 70, 3200);
      await pan(v.getYaw() - 70, 3200);
    }
    setTouring(false);
  }, [touring]);

  // Scroll lock + Escape while the overlay is up.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      cancelTour.current = true;
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const level = LEVELS.find((l) => l.id === room.level)!;
  const rooms = TOUR_ROOMS.filter((r) => r.level === room.level);
  const hasWalk = linksOf(room, style).some((l) => l.walk);
  const bounds = PLAN_BOUNDS;

  return (
    <div className="fixed inset-0 z-50 bg-background" role="dialog" aria-modal="true" aria-label={`${room.name}, 360 view`}>
      <div ref={boxRef} className="absolute inset-0 [&_.pnlm-load-box]:hidden" />

      {/* Room name and credit, top-left — the annotation register. */}
      <div className={`pointer-events-none absolute left-[6vw] top-[4.5vh] transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
        <p className={`${label} text-foreground`}>{room.name}</p>
        <p className={`mt-1 ${label} text-stone/70`}>Artist&rsquo;s impression &middot; 360&deg;</p>
      </div>

      {/* Close, top-right. */}
      <button
        type="button"
        onClick={onClose}
        className={`absolute right-[6vw] top-[4.5vh] flex min-h-11 items-center gap-3 ${label} text-foreground/90 transition-colors hover:text-foreground`}
      >
        Close <span aria-hidden="true" className="text-base leading-none">&times;</span>
      </button>

      {/* Bottom bar: style tabs and the walk button left, the plan right. */}
      <div className="pointer-events-none absolute inset-x-[6vw] bottom-[4.5vh] flex flex-wrap items-end justify-between gap-4">
        <div className="pointer-events-auto flex items-end gap-6">
          {room.styles.length > 1 &&
            room.styles.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStyle(s)}
                aria-pressed={s.id === style.id}
                className={`min-h-11 border-b pb-1 ${label} transition-colors ${
                  s.id === style.id ? "border-foreground/70 text-foreground" : "border-transparent text-stone hover:text-foreground/80"
                }`}
              >
                {s.label}
              </button>
            ))}
          {hasWalk && (
            <button
              type="button"
              onClick={tour}
              disabled={touring || walking}
              className={`min-h-11 border-b border-transparent pb-1 ${label} text-stone transition-colors hover:text-foreground/80 disabled:opacity-50`}
            >
              {touring ? "Walking…" : "Walk through"}
            </button>
          )}
        </div>
        <div className={`pointer-events-none flex items-end gap-5 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
          <p className={`${label} text-stone/60`}>{hasWalk ? "Drag to look · tap an arrow to walk" : "Drag to look around"}</p>
          {/* The plan: this level's outline, every room with a panorama, you and your heading. */}
          <svg
            viewBox={`${bounds.x} ${bounds.y} ${bounds.w} ${bounds.h}`}
            className="h-[92px] w-auto text-foreground opacity-80 md:h-[116px]"
            aria-label={`Plan: you are in the ${room.name.toLowerCase()}`}
          >
            <g opacity="0.55">
              {level.shapes.map((s, i) => (
                <ShapeEl key={i} s={s} />
              ))}
            </g>
            {rooms
              .filter((r) => r.id !== room.id)
              .map((r) => (
                <circle key={r.id} cx={r.marker.x} cy={r.marker.y} r={bounds.w * 0.012} fill="currentColor" opacity="0.45" />
              ))}
            <g transform={`translate(${room.marker.x} ${room.marker.y})`}>
              <g ref={wedgeRef}>
                <path d={`M0 0 L${-bounds.w * 0.07} ${-bounds.w * 0.12} A${bounds.w * 0.14} ${bounds.w * 0.14} 0 0 1 ${bounds.w * 0.07} ${-bounds.w * 0.12} Z`} fill="currentColor" opacity="0.28" />
              </g>
              <circle r={bounds.w * 0.02} fill="currentColor" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

// The rooms referenced by hotspots must exist at build time.
if (process.env.NODE_ENV !== "production") {
  for (const r of TOUR_ROOMS) for (const s of r.styles) for (const l of linksOf(r, s)) if (!roomById(l.to)) throw new Error(`tour link to unknown room: ${l.to}`);
}
