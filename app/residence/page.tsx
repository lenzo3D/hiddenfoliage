// RESIDENCE — what the house is, what distinguishes it, and the full
// schedule. Same grammar as Home (components/Editorial.tsx):
//
//   hero → architecture → garden level → private levels → materials →
//   schedule → availability
//
// Every figure carries its own artist's-impression credit, and the colophon
// carries the licence line, so the prose never has to defend the renders.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Credit from "@/components/Credit";
import SiteFooter from "@/components/SiteFooter";
import { Fig, SectionIntro, bodyCls, factCls, label } from "@/components/Editorial";

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

// Material details: enlargements of existing renders (object-position picks
// the cover crop; scale/origin pick the window within it), named by room only.
const DETAILS: { src: string; alt: string; caption: string; crop: string }[] = [
  {
    src: "/images/2x/porch.jpg",
    alt: "Vertical timber slats of the porch wall beneath the timber soffit, beside the front door.",
    caption: "Car porch",
    crop: "object-[0%_50%] origin-[28%_24%] scale-[2]",
  },
  {
    src: "/images/2x/bath.jpg",
    alt: "The stone column and basin of the principal bathroom, the lit screen beyond.",
    caption: "Principal bathroom",
    crop: "object-[50%_0%] origin-[100%_65%] scale-[1.72]",
  },
];

export default function ResidencePage() {
  return (
    <main id="content" className="bg-background text-foreground">
      {/* Hero */}
      <section className="px-[6vw] pt-[22vh] md:pt-[26vh]">
        <p className={label}>The Residence</p>
        <h1 className="mt-8 max-w-[18ch] font-serif text-[clamp(2rem,4.4vw,4.25rem)] uppercase leading-[1.04] tracking-[0.02em] md:mt-10">
          An address of uncommon privacy.
        </h1>
        <p className={`mt-8 max-w-[52ch] ${bodyCls}`}>A new freehold residence on Berrima Road.</p>
      </section>
      <Fig
        className="mt-[10vh] md:mt-[12vh]"
        src="/images/hero-still.jpg"
        alt="Hidden Foliage from the road: the timber-screened house behind its planting."
        caption="Berrima Road"
        offset="right"
        aspect="aspect-[4/5] md:aspect-[16/9]"
        position="30% 50%"
        priority
      />

      {/* Architecture */}
      <section className="pt-[16vh] md:pt-[22vh]">
        <SectionIntro
          eyebrow="01 / Architecture"
          title="Defined by discretion."
          body="A screened façade. Generous openings. Landscape drawn close."
          fact="Operable screen · Natural ventilation"
        />
        <Fig
          className="mt-[8vh] md:mt-[10vh]"
          src="/images/2x/screen-facade.jpg"
          alt="The façade from the road: operable timber louvres in a leaf pattern, closed, planting above and below."
          caption="The screen"
          offset="left"
          aspect="aspect-[4/5] md:aspect-[21/9]"
        />
      </section>

      {/* Garden level */}
      <section className="pt-[16vh] md:pt-[22vh]">
        <SectionIntro
          eyebrow="02 / Garden Level"
          title="Living at the edge of water."
          body="The principal living spaces run alongside the garden and 18-metre pool."
          fact="Living · Dining · Dry + wet kitchens"
        />
        <Fig
          className="mt-[8vh] md:mt-[10vh]"
          src="/images/2x/living.jpg"
          alt="The living room, open to the garden."
          caption="Living room"
          offset="right"
          aspect="aspect-[4/3] md:aspect-[16/9]"
        />
        <Fig
          className="mt-[8vh] w-[78vw] md:mt-[10vh] md:w-[44vw]"
          src="/images/2x/pool-day.jpg"
          alt="The lap pool alongside the living room."
          caption="Pool deck"
          offset="none"
          aspect="aspect-[4/3]"
          sizes="(min-width: 768px) 44vw, 110vw"
          position="35% 50%"
        />
      </section>

      {/* Private levels */}
      <section className="pt-[16vh] md:pt-[22vh]">
        <SectionIntro
          eyebrow="03 / Private Levels"
          title="A quieter world above."
          body="The principal suite, family study and four additional ensuite bedrooms occupy the upper two levels."
          fact="5 ensuite bedrooms · Family / study"
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
          sizes="(min-width: 768px) 34vw, 175vw"
          imgClassName="origin-[98%_15%] scale-[1.52] object-[100%_50%]"
        />
      </section>

      {/* Materials — two detail studies */}
      <section className="pt-[16vh] md:pt-[22vh]">
        <SectionIntro
          eyebrow="04 / Materials"
          title="Quietly considered."
          body="Natural stone. Timber. A restrained palette throughout."
          fact="Full specification available on request"
        />
        <ul className="mt-[8vh] grid grid-cols-1 gap-y-[8vh] px-[6vw] md:mt-[10vh] md:grid-cols-2 md:gap-x-[3vw]">
          {DETAILS.map((d) => (
            <li key={d.caption} className="w-[64vw] md:w-auto">
              <Reveal>
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image src={d.src} alt={d.alt} fill sizes="(min-width: 768px) 42vw, 115vw" quality={85} className={`object-cover ${d.crop}`} />
                </div>
              </Reveal>
              <p className={`mt-4 ${label}`}>{d.caption}</p>
              <Credit className="mt-1" />
            </li>
          ))}
        </ul>
      </section>

      {/* Schedule */}
      <section className="px-[6vw] pt-[16vh] md:pt-[22vh]">
        <p className={label}>05 / The Residence</p>
        <h2 className="mt-6 max-w-[24ch] font-serif text-[clamp(1.75rem,3vw,3rem)] uppercase leading-[1.06] tracking-[0.02em] text-foreground md:mt-8">
          Substantial. Yet discreet.
        </h2>
        <dl className="mt-[8vh] grid grid-cols-1 md:mt-[10vh] md:grid-cols-2 md:gap-x-[6vw]">
          {FACTS.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-6 border-b border-stone/15 py-4 md:py-5">
              <dt className={label}>{k}</dt>
              <dd className="text-right font-sans text-sm text-foreground md:text-[0.9375rem]">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Evening, then availability */}
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
      <section className="px-[6vw] pb-[14vh] pt-[16vh] md:pb-[18vh] md:pt-[22vh]">
        <p className={label}>06 / Availability</p>
        <h2 className="mt-6 max-w-[24ch] font-serif text-[clamp(1.75rem,3vw,3rem)] uppercase leading-[1.06] tracking-[0.02em] text-foreground md:mt-8">
          Currently under construction.
        </h2>
        <p className={`mt-6 max-w-[46ch] ${bodyCls}`}>
          Detailed specifications, project information and private presentations are available on request.
        </p>
        <p className={`mt-8 ${factCls}`}>Private viewings by appointment</p>
        <p className="mt-10 md:mt-12">
          <Link
            href="/#enquire"
            className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-foreground/90 transition-colors hover:text-foreground md:text-xs"
          >
            Enquire <span aria-hidden="true">→</span>
          </Link>
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
