// RESIDENCE — the factual page. For the visitor who says "just give me the
// details": the schedule of facts, a short architectural narrative, and a
// handful of the strongest stills. Same dark field, same annotation register.

import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "The Residence — Hidden Foliage",
  description:
    "Freehold detached house on Berrima Road, Dunearn Estate, District 11. 4,821 sq ft land, 9,462 sq ft built-up, 5+1 bedrooms, 7 bathrooms, pool, lift, basement and attic.",
};

const FACTS: [string, string][] = [
  ["Guide price", "S$23,810,000"],
  ["Tenure", "Freehold"],
  ["Land", "4,821 sq ft"],
  ["Built-up", "9,462 sq ft"],
  ["Bedrooms", "5 + 1"],
  ["Bathrooms", "7"],
  ["Levels", "Basement · First · Second · Attic"],
  ["Pool", "18 m × 2 m lap pool"],
  ["Lift", "Home lift, basement to attic"],
  ["Car porch", "4 cars, EV-charging provision"],
  ["Type", "Detached, brand new"],
  ["District", "11 · Dunearn Estate"],
];

const Cap = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-4 font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs">{children}</p>
);

export default function ResidencePage() {
  return (
    <main className="bg-background text-foreground">
      {/* Header */}
      <section className="px-[6vw] pb-[10vh] pt-[22vh] md:pt-[26vh]">
        <p className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs">The Residence</p>
        <h1 className="mt-8 max-w-[18ch] font-serif text-[clamp(2rem,4.4vw,4.25rem)] uppercase leading-[1.04] tracking-[0.02em] md:mt-10">
          A freehold house behind a screen of leaves.
        </h1>
        <p className="mt-8 max-w-[52ch] font-sans text-sm leading-relaxed text-stone md:text-[0.9375rem]">
          Berrima Road, Dunearn Estate. Four levels of living organised around a lift and stair core, an
          18-metre pool along the living floor, and a patterned timber screen that gives every room privacy
          without sealing it away.
        </p>
      </section>

      {/* First still: the house */}
      <Reveal className="md:ml-[22vw]">
        <div className="relative aspect-[4/5] w-full md:aspect-[16/9]">
          <Image src="/images/hero image.png" alt="Hidden Foliage from the road: the timber-screened house behind its planting." fill priority sizes="(min-width: 768px) 78vw, 100vw" quality={85} className="object-cover object-[30%_50%] md:object-center" />
        </div>
      </Reveal>

      {/* Schedule of facts */}
      <section className="px-[6vw] pt-[14vh] md:pt-[18vh]">
        <p className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs">Schedule</p>
        <dl className="mt-8 grid grid-cols-1 md:mt-10 md:grid-cols-2 md:gap-x-[6vw]">
          {FACTS.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-6 border-b border-stone/15 py-4 md:py-5">
              <dt className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs">{k}</dt>
              <dd className="text-right font-sans text-sm text-foreground md:text-[0.9375rem]">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Narrative */}
      <section className="px-[6vw] pt-[16vh] md:grid md:grid-cols-12 md:gap-[4vw] md:pt-[20vh]">
        <p className="font-serif text-[clamp(1.5rem,2.4vw,2.25rem)] italic leading-snug text-foreground/95 md:col-span-5">
          Architecture, concealed by nature.
        </p>
        <div className="mt-8 space-y-6 font-sans text-sm leading-relaxed text-stone md:col-span-6 md:col-start-7 md:mt-0 md:text-[0.9375rem]">
          <p>
            The house sits behind a continuous timber screen whose leaf pattern filters the light of the day and
            glows at night. It is the residence&rsquo;s defining element: a veil that admits air and view while
            keeping the interior private from the street.
          </p>
          <p>
            The first storey is the entertaining floor — living, dining, dry and wet kitchens opening onto decks and
            the length of the lap pool. Above, the second storey holds the master suite with its own bath, wardrobe
            and deck, two further ensuite bedrooms and a family study; the attic adds two more ensuite bedrooms and
            a roof deck. A basement contains the household shelter and the base of the lift and stair core.
          </p>
          <p>
            Materials are few and warm — timber, stone, pale plaster — set against dense planting on every side.
            Solar-ready roof infrastructure and EV-charging provision are built in.
          </p>
        </div>
      </section>

      {/* Stills */}
      <section className="pt-[16vh] md:pt-[20vh]">
        <div className="md:grid md:grid-cols-12 md:gap-[3vw] md:px-[6vw]">
          <figure className="md:col-span-7">
            <Reveal>
              <div className="relative aspect-[4/3] w-full">
                <Image src="/images/living area.png" alt="The living room, open to the garden." fill sizes="(min-width: 768px) 52vw, 100vw" quality={85} className="object-cover" />
              </div>
            </Reveal>
            <figcaption className="px-[6vw] md:px-0">
              <Cap>Living room</Cap>
            </figcaption>
          </figure>
          <figure className="mt-[10vh] md:col-span-4 md:col-start-9 md:mt-[18vh]">
            <Reveal>
              <div className="relative aspect-[4/5] w-full">
                <Image src="/images/bedroom.png" alt="The master bedroom, the screen's pattern cast across the floor." fill sizes="(min-width: 768px) 30vw, 100vw" quality={85} className="object-cover object-[56%_50%]" />
              </div>
            </Reveal>
            <figcaption className="px-[6vw] md:px-0">
              <Cap>Master bedroom</Cap>
            </figcaption>
          </figure>
        </div>
        <figure className="mt-[10vh] md:mt-[14vh] md:mr-[22vw]">
          <Reveal>
            <div className="relative aspect-[3/4] w-full md:aspect-[16/9]">
              <Image src="/images/pool (day).png" alt="The lap pool alongside the living room." fill sizes="(min-width: 768px) 78vw, 100vw" quality={85} className="object-cover object-[35%_50%] md:object-center" />
            </div>
          </Reveal>
          <figcaption className="px-[6vw]">
            <Cap>Pool deck</Cap>
          </figcaption>
        </figure>
        <figure className="mt-[10vh] md:mt-[14vh]">
          <Reveal>
            <div className="relative aspect-[3/4] w-full md:aspect-[21/9]">
              <Image src="/images/exterior (night).png" alt="The house at night, the screen lit from within." fill sizes="100vw" quality={85} className="object-cover object-[42%_50%] md:object-center" />
            </div>
          </Reveal>
          <figcaption className="px-[6vw] pb-[12vh] md:pb-[16vh]">
            <Cap>Berrima Road, evening</Cap>
          </figcaption>
        </figure>
      </section>

      <SiteFooter />
    </main>
  );
}
