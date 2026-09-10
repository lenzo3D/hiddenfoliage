"use client";

// The 360 viewer overlay. Pannellum (self-hosted, no CDN) draws each room as
// a cube of image tiles at several resolutions (its "multires" mode): drag to
// look, pinch or scroll to zoom, inertia built in. The chrome is the site's
// annotation register — room name and credit top-left, Close top-right, style
// tabs and the room links along the bottom. Escape closes. The page behind is
// scroll-locked.

import { useCallback, useEffect, useRef, useState } from "react";
import "pannellum/build/pannellum.css";
import { asset } from "../asset";
import { roomById, TOUR_ROOMS } from "./tourData";

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

export default function PanoViewer({ roomId, onNavigate, onClose }: { roomId: string; onNavigate: (id: string) => void; onClose: () => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PannellumViewer | null>(null);
  // The overlay is keyed by room (TourClient), so a new room mounts fresh:
  // its own opening style and view, with no effect resetting state.
  const [styleIdx, setStyleIdx] = useState(0);
  const [ready, setReady] = useState(false);
  const room = roomById(roomId)!;
  const style = room.styles[Math.min(styleIdx, room.styles.length - 1)];

  const spawn = useCallback(
    async (keepView: boolean) => {
      const box = boxRef.current;
      if (!box) return;
      // Pannellum attaches itself to window on import (client only).
      await import("pannellum/build/pannellum.js" as string);
      const prev = viewerRef.current;
      // The drawings were cylindrical panoramas, not equirectangular ones:
      // rendered as a sphere every straight line bowed, whatever the field
      // of view. The tile sets are cut from true equirectangular strips
      // (tourData.ts), so the cube is correct and walls, shelving and
      // ceilings stay straight. Open at 56° and zoom 40–68° (46° / up to 56° on
      // portrait phones, which see far more vertically for the same width):
      // the drawings' own curves grow with the field of view, and 56° is
      // where a bowed wall stops reading as bowed on a laptop. Tilt is limited to keep the view on the strip
      // (the source reaches ±57.5°; beyond it the tiles hold the page's dark
      // ground), and the upward tilt a little more, because the drawn
      // ceiling coves still arch slightly.
      const portrait = box.clientHeight > box.clientWidth;
      const hfov0 = portrait ? 46 : 56;
      const view = keepView && prev ? { yaw: prev.getYaw(), pitch: prev.getPitch(), hfov: prev.getHfov() } : { yaw: style.yaw0 ?? room.yaw0, pitch: 0, hfov: hfov0 };
      prev?.destroy();
      setReady(false);
      viewerRef.current = window.pannellum.viewer(box, {
        type: "multires",
        multiRes: { basePath: asset(style.src), ...TILES },
        autoLoad: true,
        showControls: false,
        compass: false,
        keyboardZoom: true,
        mouseZoom: true,
        friction: 0.12, // a touch more glide than default
        minPitch: portrait ? -15 : -30,
        maxPitch: portrait ? 8 : 14,
        minHfov: 40,
        maxHfov: portrait ? 56 : 68,
        ...view,
        backgroundColor: [7 / 255, 11 / 255, 8 / 255],
        hotSpots: (style.links ?? room.links).map((l) => ({
          yaw: l.yaw,
          pitch: l.pitch ?? 0,
          cssClass: "tour-hotspot",
          createTooltipFunc: (el: HTMLElement) => {
            el.innerHTML =
              '<span class="tour-hotspot-ring" aria-hidden="true"></span><span class="tour-hotspot-label">' + l.label + "</span>";
            el.setAttribute("role", "button");
            el.setAttribute("aria-label", "Go to " + l.label);
          },
          clickHandlerFunc: () => onNavigate(l.to),
        })),
      });
      // Pannellum has no simple loaded callback in this config path; the
      // scene fades itself in, so reveal the chrome on the next frame.
      requestAnimationFrame(() => setReady(true));
    },
    [room, style, onNavigate],
  );

  // Room change: fresh view. Style change: hold the current view.
  const last = useRef({ roomId: "", styleId: "" });
  useEffect(() => {
    const sameRoom = last.current.roomId === roomId;
    last.current = { roomId, styleId: style.id };
    spawn(sameRoom);
    return () => {
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, [roomId, style.id, spawn]);

  // Scroll lock + Escape while the overlay is up.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

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

      {/* Bottom bar: style tabs left, the hint right. */}
      <div className="pointer-events-none absolute inset-x-[6vw] bottom-[4.5vh] flex flex-wrap items-end justify-between gap-4">
        {room.styles.length > 1 ? (
          <div className="pointer-events-auto flex gap-6">
            {room.styles.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStyleIdx(i)}
                aria-pressed={i === styleIdx}
                className={`min-h-11 border-b pb-1 ${label} transition-colors ${
                  i === styleIdx ? "border-foreground/70 text-foreground" : "border-transparent text-stone hover:text-foreground/80"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        <p className={`${label} text-stone/60`}>Drag to look around</p>
      </div>
    </div>
  );
}

// The rooms referenced by hotspots must exist at build time.
if (process.env.NODE_ENV !== "production") {
  for (const r of TOUR_ROOMS) for (const l of r.links) if (!roomById(l.to)) throw new Error(`tour link to unknown room: ${l.to}`);
}
