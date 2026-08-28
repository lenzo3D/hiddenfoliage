// HOME — first impression, identity, and a concise overview. Seven sections,
// one grammar (see components/Editorial.tsx, and /location for the benchmark):
//
//   hero → project idea → living → private quarters → the residence in
//   numbers → evening image → enquiry (Signature)
//
// The detail lives on the inner pages: /residence (schedule, materials),
// /plans (the drawings), /location (the neighbourhood).

import Hero from "@/components/Hero";
import Signature from "@/components/Signature";
import { Fig, SectionIntro, factCls, label } from "@/components/Editorial";
import Link from "next/link";

// The residence in numbers — the verified figures only (see /residence for
// the full schedule). Value, then label.
const NUMBERS: [string, string][] = [
  ["4,821 sq ft", "Land"],
  ["9,462 sq ft", "Built-up"],
  ["5 + 1", "Bedrooms"],
  ["7", "Bathrooms"],
  ["4", "Levels"],
  ["18 m", "Pool"],
  ["Private lift", "Basement to attic"],
  ["4 cars", "EV-ready"],
];

export default function Home() {
  return (
    <main id="content" className="bg-background text-foreground">
      <Hero />

      {/* Project idea */}
      <section className="pt-[16vh] md:pt-[22vh]">
        <SectionIntro
          eyebrow="The Residence"
          title="Privacy, without compromise."
          body="A screened façade and layered landscape create privacy while preserving light, openness and views throughout the house."
          fact="Freehold · 4,821 sq ft land · District 11"
        />
        <Fig
          className="mt-[8vh] md:mt-[10vh]"
          src="/images/veil-still.jpg"
          alt="The façade from the road: operable timber louvres in a leaf pattern, planting above and below."
          caption="The screen"
          offset="left"
          aspect="aspect-[4/5] md:aspect-[21/9]"
        />
      </section>

      {/* Living */}
      <section className="pt-[16vh] md:pt-[22vh]">
        <SectionIntro
          eyebrow="01 / Living"
          title="A house drawn towards the garden."
          body="Living, dining and kitchen spaces open along the length of the pool, with the garden held close to the interior."
          fact="18 m pool · First storey"
        />
        <Fig
          className="mt-[8vh] md:mt-[10vh]"
          src="/images/2x/pool-day.jpg"
          alt="The living room open to the lap pool and dense planting beyond."
          caption="Pool deck"
          offset="right"
          aspect="aspect-[4/3] md:aspect-[16/9]"
          position="35% 50%"
        />
        <Fig
          className="mt-[8vh] w-[78vw] md:mt-[10vh] md:w-[44vw]"
          src="/images/2x/living.jpg"
          alt="The living room, open to the garden."
          caption="Living room"
          offset="none"
          aspect="aspect-[4/3]"
          sizes="(min-width: 768px) 44vw, 78vw"
        />
      </section>

      {/* Private quarters */}
      <section className="pt-[16vh] md:pt-[22vh]">
        <SectionIntro
          eyebrow="02 / Private Quarters"
          title="Quietly set above."
          body="Five ensuite bedrooms occupy the upper floors, screened from the street and separated from the social spaces below."
          fact="5 ensuite bedrooms · Second storey + attic"
        />
        <Fig
          className="mt-[8vh] md:mt-[10vh]"
          src="/images/2x/bedroom.jpg"
          alt="The principal bedroom, the screen's pattern cast across the floor."
          caption="Principal bedroom"
          offset="left"
          aspect="aspect-[4/5] md:aspect-[16/9]"
          position="56% 50%"
        />
        <Fig
          className="ml-auto mt-[8vh] w-[78vw] md:mt-[10vh] md:mr-[6vw] md:w-[34vw]"
          src="/images/2x/bath.jpg"
          alt="The principal bathroom: a freestanding tub before the timber screen, lit from behind."
          caption="Principal bathroom"
          offset="none"
          aspect="aspect-[3/4]"
          sizes="(min-width: 768px) 48vw, 100vw"
          imgClassName="origin-[98%_15%] scale-[1.52] object-[100%_50%]"
        />
      </section>

      {/* The residence, in numbers */}
      <section className="px-[6vw] pt-[16vh] md:pt-[22vh]">
        <p className={label}>03 / The Residence</p>
        <h2 className="mt-6 max-w-[24ch] font-serif text-[clamp(1.75rem,3vw,3rem)] uppercase leading-[1.06] tracking-[0.02em] text-foreground md:mt-8">
          Substantial. Discreet. Freehold.
        </h2>
        <dl className="mt-[8vh] grid grid-cols-2 gap-x-[4vw] gap-y-[6vh] md:mt-[10vh] md:grid-cols-4">
          {NUMBERS.map(([value, name]) => (
            <div key={name}>
              <dd className="font-serif text-[clamp(1.375rem,2.4vw,2.375rem)] leading-none tracking-[0.01em] text-foreground">{value}</dd>
              <dt className={`mt-3 ${factCls}`}>{name}</dt>
            </div>
          ))}
        </dl>
        <div className="mt-[10vh] md:mt-[12vh]">
          <div aria-hidden="true" className="h-px w-12 bg-stone/40" />
          <p className={`mt-6 ${label}`}>Guide price</p>
          <p className="mt-3 font-serif text-[clamp(1.75rem,3.2vw,3.25rem)] leading-none tracking-[0.01em] text-foreground">S$23.81M</p>
          <p className="mt-10 md:mt-12">
            <Link
              href="/residence"
              className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-foreground/90 transition-colors hover:text-foreground md:text-xs"
            >
              Explore the residence <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>

      {/* Evening — a visual pause before the enquiry */}
      <Fig
        className="mt-[16vh] md:mt-[22vh]"
        src="/images/2x/exterior-night.jpg"
        alt="The house at night, the screen lit from within."
        caption="Berrima Road · Evening"
        offset="full"
        aspect="aspect-[3/4] md:aspect-[21/9]"
        sizes="100vw"
        position="42% 50%"
      />

      {/* Enquiry */}
      <Signature />
    </main>
  );
}
