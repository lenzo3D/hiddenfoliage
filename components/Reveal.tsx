"use client";

// A small reusable reveal for the inner pages: the child is unmasked from its
// bottom edge with a slight settle as it scrolls into view. Scroll-linked and
// reversible; does nothing under reduced motion.

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const inner = el.firstElementChild as HTMLElement | null;
      const a = gsap.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "sine.inOut", scrollTrigger: { trigger: el, start: "top 90%", end: "top 45%", scrub: 0.8 } });
      const b = inner ? gsap.fromTo(inner, { y: 30 }, { y: 0, ease: "sine.out", scrollTrigger: { trigger: el, start: "top 90%", end: "top 30%", scrub: 0.8 } }) : null;
      return () => {
        a.scrollTrigger?.kill();
        b?.scrollTrigger?.kill();
      };
    });
    return () => mm.revert();
  }, []);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
