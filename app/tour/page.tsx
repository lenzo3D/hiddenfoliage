// VIRTUAL TOUR — a functional page, like /plans: choose a room on the floor
// plan, stand inside its 360 render. The viewer itself (components/tour) opens
// over the page and returns here on Close.

import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import TourClient from "@/components/tour/TourClient";
import { bodyCls, factCls, label } from "@/components/Editorial";

export const metadata: Metadata = {
  title: "Virtual Tour",
  description:
    "Stand inside Hidden Foliage before it is built: 360-degree views of the living area, dining area, car porch, master bedroom and master bathroom, reached from the floor plans.",
};

export default function TourPage() {
  return (
    <main id="content" className="bg-background text-foreground">
      <section className="px-[6vw] pb-[10vh] pt-[22vh] md:pt-[26vh]">
        <p className={label}>Virtual Tour</p>
        <h1 className="mt-8 max-w-[22ch] font-serif text-[clamp(2rem,4.4vw,4.25rem)] uppercase leading-[1.04] tracking-[0.02em] md:mt-10">
          Inside the residence.
        </h1>
        <p className={`mt-8 max-w-[52ch] ${bodyCls}`}>
          Choose a room on the plan. Drag to look around; tap a doorway marker to move through.
        </p>
        <p className={`mt-8 ${factCls}`}>
          360&deg; views &middot; Artist&rsquo;s impressions &middot; Alternate schemes where available
        </p>
      </section>

      <section className="px-[6vw] pb-[14vh] md:pb-[18vh]">
        <TourClient />
      </section>

      <SiteFooter />
    </main>
  );
}
