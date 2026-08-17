// PLANS — the dedicated floor-plan experience. Four Levels on Home is the teaser;
// this is where you inspect the house.

import type { Metadata } from "next";
import PlanViewer from "@/components/PlanViewer";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Plans",
  description: "Basement, first storey, second storey and attic plans of Hidden Foliage, Berrima Road — inspect each level, zoom and pan.",
};

export default function PlansPage() {
  return (
    <main id="content" className="bg-background text-foreground">
      <section className="px-[6vw] pb-[10vh] pt-[22vh] md:pt-[26vh]">
        <p className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs">Plans</p>
        <h1 className="mt-8 max-w-[18ch] font-serif text-[clamp(2rem,4.4vw,4.25rem)] uppercase leading-[1.04] tracking-[0.02em] md:mt-10">
          Four levels, one core.
        </h1>
        <p className="mt-8 max-w-[52ch] font-sans text-sm leading-relaxed text-stone md:text-[0.9375rem]">
          Every level is organised around the stair and lift. The first storey stretches the full plot — car porch,
          living, dining, kitchens and the 18-metre pool; the private floors sit above, and the basement holds the
          household shelter. North lies towards the road as drawn, so the car porch faces it and the pool runs
          along the western edge. Choose a level to inspect it, switch the suggested furniture on or off, and
          measure between any two points.
        </p>
        {/* The verified sizes — the only dimensions we print. */}
        <p className="mt-8 font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs">
          Land 4,821 sq ft <span className="normal-case tracking-normal">(448 m²)</span> <span aria-hidden="true">·</span> Built-up 9,462 sq ft{" "}
          <span className="normal-case tracking-normal">(879 m²)</span> <span aria-hidden="true">·</span> Pool 18 m × 2 m
        </p>
      </section>

      <section className="px-[6vw] pb-[14vh] md:pb-[18vh]">
        <PlanViewer />
      </section>

      <SiteFooter />
    </main>
  );
}
