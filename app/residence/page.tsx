// RESIDENCE — the factual page. For the visitor who says "just give me the
// details": the schedule of facts, a short architectural narrative, the one
// material that defines the house, a handful of the strongest stills, and the
// making of it (what is known about status, specification and team — and an
// honest "on request" for what is not yet). Same dark field, same annotation
// register as the film.

import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import Credit from "@/components/Credit";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "The Residence",
  description:
    "Freehold detached house on Berrima Road, Dunearn Estate, District 11. 4,821 sq ft land, 9,462 sq ft built-up, 5+1 bedrooms, 7 bathrooms, 18 m pool, home lift, basement and attic. Brand new; private viewings by appointment.",
};

// Verified facts from the agency listing. Do not add anything unverified here.
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
  ["Roof", "Solar-ready"],
  ["Type", "Detached, brand new"],
  ["District", "11 · Dunearn Estate"],
];

// The making. Fill these in as they are confirmed (see docs/CONTENT-NEEDED.md).
// Anything still null is folded into one "available on request" line beneath
// the schedule, so the page never invents a name or a date.
const MAKING: [string, string | null][] = [
  ["Status", "Under construction"],
  ["Completion", null],
  ["Architect", null],
  ["Interior design", null],
  ["Landscape", null],
  ["Builder", null],
];

// Material details: enlargements of existing renders (object-position picks the
// cover crop; scale/origin pick the window within it), named by material and
// room only — no species or supplier is claimed. Replace with macro photography
// when it exists (docs/CONTENT-NEEDED.md).
const DETAILS: { src: string; alt: string; caption: string; crop: string }[] = [
  {
    src: "/images/2x/porch.jpg",
    alt: "Vertical timber slats of the porch wall beneath the timber soffit, beside the front door.",
    caption: "Timber slats · Car porch",
    crop: "object-[0%_50%] origin-[28%_24%] scale-[2]",
  },
  {
    src: "/images/2x/bath.jpg",
    alt: "The stone column and basin of the master bath, the lit screen beyond.",
    caption: "Stone · Master bath",
    crop: "object-[50%_0%] origin-[100%_65%] scale-[1.72]",
  },
];

const label = "font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs";
const Cap = ({ children }: { children: React.ReactNode }) => <p className={`mt-4 ${label}`}>{children}</p>;

export default function ResidencePage() {
  const known = MAKING.filter((r): r is [string, string] => r[1] !== null);
  const pending = MAKING.filter(([, v]) => v === null).map(([k]) => k.toLowerCase());
  const pendingLine = pending.length ? pending.slice(0, -1).join(", ") + (pending.length > 1 ? " and " : "") + pending[pending.length - 1] : "";

  return (
    <main id="content" className="bg-background text-foreground">
      {/* Header */}
      <section className="px-[6vw] pb-[10vh] pt-[22vh] md:pt-[26vh]">
        <p className={label}>The Residence</p>
        <h1 className="mt-8 max-w-[18ch] font-serif text-[clamp(2rem,4.4vw,4.25rem)] uppercase leading-[1.04] tracking-[0.02em] md:mt-10">
          A freehold house behind a screen of leaves.
        </h1>
        <p className="mt-8 max-w-[52ch] font-sans text-sm leading-relaxed text-stone md:text-[0.9375rem]">
          Four levels organised around a lift and stair core, an 18-metre pool along the living floor, and a
          patterned timber screen that keeps every room private from the street without shutting out the air.
        </p>
      </section>

      {/* First still: the house */}
      <figure className="md:ml-[22vw]">
        <Reveal>
          <div className="relative aspect-[4/5] w-full md:aspect-[16/9]">
            <Image src="/images/hero-still.jpg" alt="Hidden Foliage from the road: the timber-screened house behind its planting." fill priority sizes="(min-width: 768px) 78vw, 100vw" quality={85} className="object-cover object-[30%_50%] md:object-center" />
          </div>
        </Reveal>
        <figcaption className="px-[6vw] md:px-0">
          <Cap>From Berrima Road</Cap>
          <Credit className="mt-1" />
        </figcaption>
      </figure>

      {/* Schedule of facts */}
      <section className="px-[6vw] pt-[14vh] md:pt-[18vh]">
        <p className={label}>Schedule</p>
        <dl className="mt-8 grid grid-cols-1 md:mt-10 md:grid-cols-2 md:gap-x-[6vw]">
          {FACTS.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-6 border-b border-stone/15 py-4 md:py-5">
              <dt className={label}>{k}</dt>
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
            A continuous timber screen wraps the upper floors. Its leaf pattern filters the daylight and glows
            after dark, and it is what keeps the rooms private from the street while the windows stay open.
          </p>
          <p>
            The first storey is the entertaining floor — living, dining, dry and wet kitchens opening onto decks and
            the length of the lap pool. Above, the second storey holds the master suite with its own bath, wardrobe
            and deck, two further ensuite bedrooms and a family study; the attic adds two more ensuite bedrooms and
            a roof deck. A basement contains the household shelter and the base of the lift and stair core.
          </p>
          <p>
            The palette is small and warm: timber, stone and pale plaster, with dense planting on every side.
            Solar-ready roof infrastructure and EV-charging provision are built in.
          </p>
        </div>
      </section>

      {/* The screen — the material that defines the house, seen close */}
      <section className="px-[6vw] pt-[16vh] md:grid md:grid-cols-12 md:items-center md:gap-[4vw] md:pt-[20vh]">
        <figure className="md:col-span-5">
          <Reveal>
            <div className="relative aspect-square w-full overflow-hidden">
              {/* Enlarged within the frame: the middle band of the closed screen and
                  the planting along the roof above it. */}
              <Image
                src="/images/2x/screen-closed.jpg"
                alt="The screen, closed: timber louvres in a leaf pattern, with the roof-garden planting above."
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                quality={85}
                className="origin-center scale-[2] object-cover object-center"
              />
            </div>
          </Reveal>
          <figcaption>
            <Cap>
              The screen <span aria-hidden="true">·</span> Closed
            </Cap>
            <Credit className="mt-1" />
          </figcaption>
        </figure>
        <div className="mt-[10vh] md:col-span-6 md:col-start-7 md:mt-0">
          <p className={label}>Materials</p>
          <p className="mt-6 max-w-[20ch] font-serif text-[clamp(1.5rem,2.4vw,2.25rem)] italic leading-snug text-foreground/95 md:mt-8">
            A veil of timber, drawn or open.
          </p>
          <div className="mt-8 space-y-6 font-sans text-sm leading-relaxed text-stone md:text-[0.9375rem]">
            <p>
              Timber louvres, set in a leaf pattern and hung around the upper floors. They close for privacy and
              open for the view; by day they filter the light into the rooms, and after dark the house glows
              through them.
            </p>
            <p>
              Inside, the same three materials carry every room, so the planting outside supplies the colour.
            </p>
          </div>
          <p className="mt-8 max-w-[44ch] font-sans text-[0.6875rem] leading-relaxed text-stone/80">
            Full material and fittings specification available on request.
          </p>
        </div>
      </section>

      {/* Two details, seen close: the materials a hand meets every day. Each is
          an enlargement of an existing render — named by material and room only. */}
      <section className="px-[6vw] pt-[12vh] md:pt-[14vh]">
        <ul className="grid grid-cols-1 gap-y-[8vh] md:grid-cols-2 md:gap-x-[3vw]">
          {DETAILS.map((d) => (
            <li key={d.caption} className="w-[64vw] md:w-auto">
              <Reveal>
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image src={d.src} alt={d.alt} fill sizes="(min-width: 768px) 42vw, 64vw" quality={85} className={`object-cover ${d.crop}`} />
                </div>
              </Reveal>
              <Cap>{d.caption}</Cap>
              <Credit className="mt-1" />
            </li>
          ))}
        </ul>
      </section>

      {/* Stills */}
      <section className="pt-[16vh] md:pt-[20vh]">
        <div className="md:grid md:grid-cols-12 md:gap-[3vw] md:px-[6vw]">
          <figure className="md:col-span-7">
            <Reveal>
              <div className="relative aspect-[4/3] w-full">
                <Image src="/images/2x/living.jpg" alt="The living room, open to the garden." fill sizes="(min-width: 768px) 52vw, 100vw" quality={85} className="object-cover" />
              </div>
            </Reveal>
            <figcaption className="px-[6vw] md:px-0">
              <Cap>Living room</Cap>
              <Credit className="mt-1" />
            </figcaption>
          </figure>
          <figure className="mt-[10vh] md:col-span-4 md:col-start-9 md:mt-[18vh]">
            <Reveal>
              <div className="relative aspect-[4/5] w-full">
                <Image src="/images/2x/bedroom.jpg" alt="The master bedroom, the screen's pattern cast across the floor." fill sizes="(min-width: 768px) 30vw, 100vw" quality={85} className="object-cover object-[56%_50%]" />
              </div>
            </Reveal>
            <figcaption className="px-[6vw] md:px-0">
              <Cap>Master bedroom</Cap>
              <Credit className="mt-1" />
            </figcaption>
          </figure>
        </div>
        <figure className="mt-[10vh] md:mt-[14vh] md:mr-[22vw]">
          <Reveal>
            <div className="relative aspect-[3/4] w-full md:aspect-[16/9]">
              <Image src="/images/2x/pool-day.jpg" alt="The lap pool alongside the living room." fill sizes="(min-width: 768px) 78vw, 100vw" quality={85} className="object-cover object-[35%_50%] md:object-center" />
            </div>
          </Reveal>
          <figcaption className="px-[6vw]">
            <Cap>Pool deck</Cap>
            <Credit className="mt-1" />
          </figcaption>
        </figure>
        <figure className="mt-[10vh] md:mt-[14vh]">
          <Reveal>
            <div className="relative aspect-[3/4] w-full md:aspect-[21/9]">
              <Image src="/images/2x/exterior-night.jpg" alt="The house at night, the screen lit from within." fill sizes="100vw" quality={85} className="object-cover object-[42%_50%] md:object-center" />
            </div>
          </Reveal>
          <figcaption className="px-[6vw]">
            <Cap>Berrima Road, evening</Cap>
            <Credit className="mt-1" />
          </figcaption>
        </figure>
      </section>

      {/* The making — status, specification, team; nothing invented */}
      <section className="px-[6vw] pb-[14vh] pt-[16vh] md:grid md:grid-cols-12 md:gap-[4vw] md:pb-[18vh] md:pt-[20vh]">
        <div className="md:col-span-5">
          <p className={label}>The making</p>
          <p className="mt-6 max-w-[18ch] font-serif text-[clamp(1.5rem,2.4vw,2.25rem)] italic leading-snug text-foreground/95 md:mt-8">
            New, freehold, and under construction.
          </p>
        </div>
        <div className="mt-8 md:col-span-6 md:col-start-7 md:mt-0">
          <div className="space-y-6 font-sans text-sm leading-relaxed text-stone md:text-[0.9375rem]">
            <p>
              Hidden Foliage is a new detached house on freehold land in Dunearn Estate, offered ahead of
              completion. A home lift serves all four levels. The basement holds the household shelter, the roof is
              solar-ready, and there is EV-charging provision under the porch.
            </p>
            <p>
              Every image on this site is an artist&rsquo;s impression of the finished house, and the plans are
              the architect&rsquo;s drawings redrawn as diagrams. Nothing here is a photograph of the house as it
              stands today.
            </p>
          </div>
          <dl className="mt-10">
            {known.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-6 border-b border-stone/15 py-4">
                <dt className={label}>{k}</dt>
                <dd className="text-right font-sans text-sm text-foreground md:text-[0.9375rem]">{v}</dd>
              </div>
            ))}
          </dl>
          {pending.length > 0 && (
            <p className="mt-6 max-w-[52ch] font-sans text-[0.6875rem] leading-relaxed text-stone/80">
              {pendingLine.charAt(0).toUpperCase() + pendingLine.slice(1)}: available on request — ask when you enquire.
            </p>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
