"use client";

// 04 / Four Levels of Living.
//
// No film, no photograph: the plans themselves are the event. Four levels drawn
// as thin linework on the dark field, presented in a shallow oblique projection.
//
//   0–8%     the principal lines resolve out of the dark (stroke draw-on),
//            the finer lines fade in; the four levels sit almost collapsed
//            into one dense drawing, aligned on the stair/lift core
//   10–45%   the house separates vertically into its four levels
//            (attic · second · first · basement) — slow, even, no overshoot
//   46–87%   each level in turn comes to full ivory while the others recede
//            (still readable); a small caption for the active level
//   87–100%  all four equal; the exploded house holds
//
// One ScrollTrigger timeline; everything reverses. Reduced motion shows the
// exploded drawing statically with all four captions.

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LEVELS, PLAN_BOUNDS, type Level } from "./floorPlans";
import { ShapeEl } from "./PlanSvg";

// Oblique projection: x' = x + C·y, y' = D·y. Phones use a flatter, taller plate.
const PROJ = {
  desktop: { c: 0.3, d: 0.55, sep: 250 },
  mobile: { c: 0.12, d: 0.9, sep: 430 }, // near plan-view, taller plates
};
// Small resting offsets in the collapsed state, so depth is sensed but walls
// don't turn into spaghetti (top → bottom).
const COLLAPSED = [-9, -3, 3, 9];
const INACTIVE = 0.42; // resting opacity of the levels not in focus: quiet, still readable
const EXPLODED = [-1.5, -0.5, 0.5, 1.5]; // × sep

function projection(c: number, d: number, sep: number, mobile = false) {
  const b = PLAN_BOUNDS;
  const xs = [b.x + c * b.y, b.x + b.w + c * (b.y + b.h), b.x + c * (b.y + b.h), b.x + b.w + c * b.y];
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const yMin = d * b.y - 1.5 * sep, yMax = d * (b.y + b.h) + 1.5 * sep;
  const m = mobile ? 14 : 30;
  // Room on the left for the level names — only desktop puts them beside the
  // plate; on phones they sit above it, so that margin is dead space and the
  // drawing can be scaled up by dropping it (the viewBox width is what limits
  // the plate size on a narrow screen). On phones the names need headroom
  // instead: the topmost one sits above the attic plate and would be clipped.
  const ml = mobile ? 16 : 130;
  const mt = mobile ? 95 : m;
  return { matrix: `matrix(1 0 ${c} ${d} 0 0)`, inverse: `matrix(1 0 ${-c / d} ${1 / d} 0 0)`, viewBox: `${xMin - ml} ${yMin - mt} ${xMax - xMin + ml + m} ${yMax - yMin + mt + m}` };
}

function levelExtentX(level: Level) {
  let min = Infinity;
  for (const s of level.shapes) {
    if (s.kind === "rect") min = Math.min(min, s.x);
    if (s.kind === "poly") for (const [x] of s.pts) min = Math.min(min, x);
  }
  return min;
}


export default function FourLevels() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const captionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const svg = svgRef.current;
    const captions = captionsRef.current;
    if (!section || !svg || !captions) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(
      {
        // Portrait tablets take the phone drawing: the oblique desktop projection
        // is too small in a narrow upright frame. (globals.css gives them the
        // phone layout for the same reason.)
        desktop: "(min-width: 1024px), ((min-width: 768px) and (orientation: landscape))",
        mobile: "(max-width: 767px), ((min-width: 768px) and (max-width: 1023px) and (orientation: portrait))",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { mobile, reduce } = ctx.conditions as { mobile: boolean; reduce: boolean };
        const P = mobile ? PROJ.mobile : PROJ.desktop;
        const proj = projection(P.c, P.d, P.sep, mobile);

        // Geometry for this breakpoint.
        svg.setAttribute("viewBox", proj.viewBox);
        svg.querySelectorAll(".proj").forEach((el) => el.setAttribute("transform", proj.matrix));
        svg.querySelectorAll(".plan-label").forEach((el) => el.setAttribute("transform", el.getAttribute("data-rotate") ? `${proj.inverse} rotate(-90)` : proj.inverse));
        // Level names: left of each plate on desktop; above the plate's left corner on
        // phones (no room to the left there), and larger, since they carry the story.
        svg.querySelectorAll<SVGGElement>(".lvl-name").forEach((g) => {
          const x0 = Number(g.getAttribute("data-x0"));
          const t = g.querySelector("text")!;
          if (mobile) {
            g.setAttribute("transform", `translate(${x0 + 4} ${PLAN_BOUNDS.y - 30})`);
            t.setAttribute("text-anchor", "start");
            t.setAttribute("font-size", "38");
          } else {
            g.setAttribute("transform", `translate(${x0 - 30} ${PLAN_BOUNDS.y + PLAN_BOUNDS.h * 0.55})`);
            t.setAttribute("text-anchor", "end");
            t.setAttribute("font-size", "20");
          }
        });

        const levels = LEVELS.map((l) => svg.querySelector<SVGGElement>(`.level-${l.id}`)!);
        const lines = levels.map((g) => g.querySelector<SVGGElement>(".lines")!);
        const names = levels.map((g) => g.querySelector<SVGGElement>(".lvl-name")!);
        const draws = svg.querySelectorAll<SVGGeometryElement>(".draw");
        const roomLabels = svg.querySelectorAll<SVGGElement>(".plan-room-label");
        const caps = LEVELS.map((l) => captions.querySelector<HTMLElement>(`.cap-${l.id}`)!);

        // ── Reduced motion: the exploded drawing, all captions, no pin ─────
        if (reduce) {
          levels.forEach((g, i) => gsap.set(g, { y: EXPLODED[i] * P.sep, opacity: 1 }));
          gsap.set(lines, { opacity: 1 });
          gsap.set(names, { opacity: 1 });
          gsap.set(roomLabels, { opacity: 1 });
          gsap.set(caps, { opacity: 1 });
          return;
        }

        // Prepare draw-on: each principal outline hidden behind its own length.
        draws.forEach((el) => {
          const len = el.getTotalLength();
          gsap.set(el, { attr: { "stroke-dasharray": len, "stroke-dashoffset": len } });
        });
        gsap.set(lines, { opacity: 0 });
        gsap.set(names, { opacity: 0 });
        gsap.set(roomLabels, { opacity: 0 }); // room names only once the levels have parted
        gsap.set(caps, { opacity: 0 });
        levels.forEach((g, i) => gsap.set(g, { y: COLLAPSED[i], opacity: 1 }));

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        // 0–8%: linework resolves.
        tl.to(draws, { attr: { "stroke-dashoffset": 0 }, duration: 0.08, ease: "sine.out" }, 0)
          .to(lines, { opacity: 1, duration: 0.07, ease: "sine.inOut" }, 0.015);

        // 10–45%: the house separates into four levels.
        levels.forEach((g, i) => tl.to(g, { y: EXPLODED[i] * P.sep, duration: 0.35, ease: "power1.inOut" }, 0.1));
        tl.to(names, { opacity: 1, duration: 0.08, ease: "sine.inOut" }, 0.36)
          .to(roomLabels, { opacity: 1, duration: 0.1, ease: "sine.inOut" }, 0.33);

        // 46–87%: focus sequence (order: basement, first, second, attic — the
        // arrays run top→bottom, so indexes 3, 2, 1, 0). First storey dwells longest.
        // The active level: full opacity and its name turns ivory; the others
        // recede to INACTIVE but stay readable.
        const nameTexts = names.map((g) => g.querySelector("text")!);
        const windows: [number, number, number][] = [
          [3, 0.46, 0.55],
          [2, 0.55, 0.69],
          [1, 0.69, 0.79],
          [0, 0.79, 0.87],
        ];
        windows.forEach(([idx, from, to]) => {
          levels.forEach((g, i) => tl.to(g, { opacity: i === idx ? 1 : INACTIVE, duration: 0.03, ease: "sine.inOut" }, from));
          nameTexts.forEach((t, i) => tl.to(t, { attr: { fill: i === idx ? "#ebe9e2" : "#b8b2a4" }, duration: 0.03 }, from));
          tl.to(caps[idx], { opacity: 1, duration: 0.03, ease: "sine.out" }, from + 0.005)
            .to(caps[idx], { opacity: 0, duration: 0.02, ease: "sine.in" }, to - 0.02);
        });

        // 87–90%: everything back to equal; then hold to 100%.
        levels.forEach((g) => tl.to(g, { opacity: 1, duration: 0.03, ease: "sine.inOut" }, 0.87));
        nameTexts.forEach((t) => tl.to(t, { attr: { fill: "#b8b2a4" }, duration: 0.03 }, 0.87));
        tl.to({}, { duration: 1 }, 0);

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="four-levels relative h-[300vh] bg-background max-md:h-[260vh]"
    >
      <div className="fl-stage sticky top-0 h-dvh w-full overflow-hidden">
        {/* The drawing */}
        <div className="fl-drawing absolute inset-x-0 top-[6vh] bottom-[44vh] md:inset-x-auto md:left-[2vw] md:top-[6vh] md:bottom-[6vh] md:w-[84vw]">
          <svg ref={svgRef} className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            {LEVELS.map((level) => (
              <g key={level.id} className={`level level-${level.id}`}>
                <g className="proj">
                  <g className="lines">
                    {level.shapes.map((s, i) => (
                      <ShapeEl key={i} s={s} />
                    ))}
                  </g>
                  {/* Level name, upright, just left of the plate. */}
                  <g className="lvl-name" data-x0={levelExtentX(level)} transform={`translate(${levelExtentX(level) - 30} ${PLAN_BOUNDS.y + PLAN_BOUNDS.h * 0.55})`}>
                    <text className="plan-label" textAnchor="end" fontSize={20} fill="#b8b2a4" letterSpacing="3">
                      {level.name.toUpperCase()}
                    </text>
                  </g>
                </g>
              </g>
            ))}
          </svg>
        </div>

        {/* Captions — an architectural caption for the active level. Right of the
            drawing on desktop, beneath it on phones. No containers. */}
        <div
          ref={captionsRef}
          className="fl-captions absolute inset-x-[6vw] top-[57vh] md:inset-x-auto md:right-[6vw] md:top-auto md:bottom-[13vh] md:w-[22vw]"
        >
          {LEVELS.map((level) => (
            <div key={level.id} className={`fl-cap cap-${level.id} absolute inset-x-0 top-0 md:top-auto md:bottom-0`} style={{ opacity: 0 }}>
              <p className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-foreground/90 md:text-[0.8125rem]">{level.name}</p>
              <div className="my-3 h-px w-10 bg-stone/50" />
              <p className="font-sans text-sm leading-relaxed text-foreground/90 md:text-[0.9375rem]">{level.caption}</p>
              {level.note && (
                <p className="mt-2 font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone/80">{level.note}</p>
              )}
            </div>
          ))}
        </div>

        {/* Section notation, and the way to the full plans */}
        <div className="fl-label absolute bottom-[8vh] left-[6vw]">
          <p className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs">
            04 <span aria-hidden="true">/</span> Private Quarters
          </p>
          <p className="mt-3 max-w-[30ch] font-sans text-sm leading-relaxed text-stone md:text-[0.9375rem]">
            Five ensuite bedrooms, held above the living spaces in greater privacy.
          </p>
          <Link
            href="/plans"
            className="mt-4 inline-block font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-foreground/90 transition-colors hover:text-foreground md:text-xs"
          >
            Inspect the plans <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
