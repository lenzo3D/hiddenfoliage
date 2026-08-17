"use client";

// Editorial, scroll-linked reveals for the flow sections (Arrival, The
// Sanctuary, the Signature). One hook, driven by data attributes:
//
//   data-line    a line of text that rises through its overflow-hidden parent
//   data-reveal  an image frame unmasked from its bottom edge; an optional
//                data-img child inside it settles upward as it does
//   data-fade    a block that simply comes up gently as it enters
//   data-tail    the last block of the page — timed to its own bottom edge,
//                since "top 66%" may never arrive at the foot of a page
//   data-dusk    an overlay that gathers darkness as its parent leaves
//
// Everything is scrubbed (reversible) and finishes well before the very bottom
// of the page. Reduced motion: no motion at all; everything is simply present.

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useReveals(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const triggers: ScrollTrigger[] = [];
      const add = (t: gsap.core.Tween) => t.scrollTrigger && triggers.push(t.scrollTrigger);

      el.querySelectorAll<HTMLElement>("[data-line]").forEach((line, i) => {
        add(
          gsap.fromTo(
            line,
            { yPercent: 105 },
            {
              yPercent: 0,
              ease: "sine.out",
              scrollTrigger: { trigger: line.parentElement, start: `top ${88 - i * 4}%`, end: `top ${54 - i * 4}%`, scrub: 0.6 },
            },
          ),
        );
      });

      el.querySelectorAll<HTMLElement>("[data-reveal]").forEach((frame) => {
        add(
          gsap.fromTo(
            frame,
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", ease: "sine.inOut", scrollTrigger: { trigger: frame, start: "top 90%", end: "top 45%", scrub: 0.8 } },
          ),
        );
        const img = frame.querySelector<HTMLElement>("[data-img]");
        if (img) {
          add(
            gsap.fromTo(
              img,
              { y: 36 },
              { y: 0, ease: "sine.out", scrollTrigger: { trigger: frame, start: "top 90%", end: "top 30%", scrub: 0.8 } },
            ),
          );
        }
      });

      el.querySelectorAll<HTMLElement>("[data-fade]").forEach((block) => {
        add(
          gsap.fromTo(
            block,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, ease: "sine.out", scrollTrigger: { trigger: block, start: "top 92%", end: "top 66%", scrub: 0.6 } },
          ),
        );
      });

      el.querySelectorAll<HTMLElement>("[data-tail]").forEach((tail) => {
        add(
          gsap.fromTo(
            tail,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, ease: "sine.out", scrollTrigger: { trigger: tail, start: "top bottom", end: "bottom bottom", scrub: 0.6 } },
          ),
        );
      });

      el.querySelectorAll<HTMLElement>("[data-dusk]").forEach((dusk) => {
        add(
          gsap.fromTo(
            dusk,
            { opacity: 0 },
            { opacity: 0.55, ease: "none", scrollTrigger: { trigger: dusk.parentElement, start: "top 25%", end: "bottom 60%", scrub: 0.8 } },
          ),
        );
      });

      return () => triggers.forEach((t) => t.kill());
    });

    return () => mm.revert();
  }, [root]);
}
