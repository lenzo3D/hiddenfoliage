// PLANS — the dedicated floor-plan experience. Four Levels on Home is the teaser;
// this is where you inspect the house.

import type { Metadata } from "next";
import PlanViewer from "@/components/PlanViewer";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Plans — Hidden Foliage",
  description: "Basement, first storey, second storey and attic plans of Hidden Foliage, Berrima Road.",
};

export default function PlansPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="px-[6vw] pb-[10vh] pt-[22vh] md:pt-[26vh]">
        <p className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs">Plans</p>
        <h1 className="mt-8 max-w-[18ch] font-serif text-[clamp(2rem,4.4vw,4.25rem)] uppercase leading-[1.04] tracking-[0.02em] md:mt-10">
          Four levels, one core.
        </h1>
        <p className="mt-8 max-w-[52ch] font-sans text-sm leading-relaxed text-stone md:text-[0.9375rem]">
          Every level is organised around the stair and lift. The first storey stretches the full plot — car porch,
          living, dining, kitchens and the 18-metre pool; the private floors sit above, and the basement holds the
          household shelter. Choose a level to inspect it.
        </p>
      </section>

      <section className="px-[6vw] pb-[14vh] md:pb-[18vh]">
        <PlanViewer />
      </section>

      <SiteFooter />
    </main>
  );
}
