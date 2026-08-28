// PLANS — the dedicated floor-plan experience. Four Levels on Home is the teaser;
// this is where you inspect the house.

import type { Metadata } from "next";
import PlanViewer from "@/components/PlanViewer";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Floor Plans",
  description: "Basement, first storey, second storey and attic plans of Hidden Foliage, Berrima Road — inspect each level, zoom and pan.",
};

export default function PlansPage() {
  return (
    <main id="content" className="bg-background text-foreground">
      <section className="px-[6vw] pb-[10vh] pt-[22vh] md:pt-[26vh]">
        <p className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs">Floor Plans</p>
        <h1 className="mt-8 max-w-[22ch] font-serif text-[clamp(2rem,4.4vw,4.25rem)] uppercase leading-[1.04] tracking-[0.02em] md:mt-10">
          Generous space, considered across four levels.
        </h1>
        <p className="mt-8 max-w-[52ch] font-sans text-sm leading-relaxed text-stone md:text-[0.9375rem]">
          A central lift and stair connect the residence from basement to attic.
        </p>
        {/* The verified sizes — the only dimensions we print. */}
        <p className="mt-8 font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone/80 md:text-xs">
          4,821 sq ft land <span aria-hidden="true">·</span> 9,462 sq ft built-up <span aria-hidden="true">·</span> 18 m pool
        </p>
        <p className="mt-3 font-sans text-[0.6875rem] leading-relaxed text-stone/80">
          North lies towards the road as drawn.
        </p>
      </section>

      <section className="px-[6vw] pb-[14vh] md:pb-[18vh]">
        <PlanViewer />
      </section>

      <SiteFooter />
    </main>
  );
}
