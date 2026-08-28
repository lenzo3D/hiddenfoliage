"use client";

// 05 — The Sanctuary.
//
// The quietest act. After the technical drawing of Four Levels, this is where
// the visitor stops analysing the house and starts imagining a day in it.
// Natural document flow, no pin. Five moments, each a placed editorial
// composition on the same dark field — framed as moments of a day, with the
// room as the annotation, not the headline:
//
//   1  entry: 05 / THE SANCTUARY, then A HOME BUILT AROUND PRIVACY.
//   2  Morning — the master bedroom, filtered light on timber (large, offset right)
//   3  Retreat — the master bath, a narrow portrait; and the one fact: 5 ensuites
//   4  Afternoon — living room to pool and planting; nature at the edge of the rooms
//   5  Evening — the dining room at dusk, full width, quietly darkening → into Close;
//      the hosting line: the whole first storey opens for guests
//
// Motion is minimal and scroll-linked (see useReveals). Every image is an
// artist's impression of the finished house and is credited as such.

import { useRef } from "react";
import Image from "next/image";
import { useReveals } from "./useReveals";
import Credit from "./Credit";

const caption = "font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs";

export default function Sanctuary() {
  const rootRef = useRef<HTMLElement>(null);
  useReveals(rootRef);

  return (
    <section ref={rootRef} className="relative bg-background text-foreground">
      {/* ── Moment 1: entry ─────────────────────────────────────────────── */}
      <div className="px-[6vw] pb-[14vh] pt-[22vh] md:pb-[14vh] md:pt-[24vh]">
        <p className={caption}>
          05 <span aria-hidden="true">/</span> Materials
        </p>
        <h2 className="mt-[10vh] font-serif text-[clamp(2rem,4.4vw,4.25rem)] uppercase leading-[1.04] tracking-[0.02em] md:ml-[8vw] md:mt-[12vh]">
          <span className="block overflow-hidden">
            <span data-line className="block">
              Considered
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-line className="block">
              throughout.
            </span>
          </span>
        </h2>
        <p data-fade className="mt-8 max-w-[34ch] font-sans text-sm leading-relaxed text-stone md:ml-[8vw] md:mt-10 md:text-[0.9375rem]">
          Natural stone. Timber. Soft light. Greenery held close.
        </p>
      </div>

      {/* ── Moment 2: Morning — the master bedroom, large, offset right ───── */}
      <figure className="md:ml-[22vw] md:mr-[6vw]">
        <div data-reveal className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[16/9]">
          <div data-img className="absolute inset-0 will-change-transform">
            <Image
              src="/images/2x/bedroom.jpg"
              alt="Principal bedroom: a low bed on a timber floor, the privacy screen's pattern cast across it in morning sunlight."
              fill
              sizes="(min-width: 768px) 72vw, 100vw"
              quality={85}
              className="object-cover object-[56%_50%] md:object-center"
            />
          </div>
        </div>
        <figcaption data-fade className={`mt-4 px-[6vw] md:mt-5 md:px-0 ${caption}`}>
          Principal bedroom
          <Credit className="mt-1" />
        </figcaption>
      </figure>

      {/* ── Moment 3: Retreat — the master bath, narrow portrait; the one fact ── */}
      <div className="mt-[14vh] px-[6vw] md:mt-[16vh] md:flex md:items-center md:gap-[8vw]">
        <figure className="w-[78vw] md:w-[30vw] md:shrink-0">
          <div data-reveal className="relative aspect-[3/4] w-full overflow-hidden">
            <div data-img className="absolute inset-0 will-change-transform">
              {/* Enlarged within its frame so the tub, the lit screen behind it, the
                  rain shower and the vanity carry the picture (the WC, bottom-left
                  of the render, stays outside the frame). */}
              <Image
                src="/images/2x/bath.jpg"
                alt="Principal bathroom: a freestanding tub before the timber screen, lit from behind."
                fill
                sizes="(min-width: 768px) 48vw, 125vw"
                quality={85}
                className="origin-[98%_15%] scale-[1.52] object-cover object-[100%_50%]"
              />
            </div>
          </div>
          <figcaption data-fade className={`mt-4 md:mt-5 ${caption}`}>
            Principal bathroom
            <Credit className="mt-1" />
          </figcaption>
        </figure>
      </div>

      {/* ── Moment 4: Afternoon — living room to pool and planting ─────────── */}
      <figure className="mt-[14vh] md:mt-[16vh] md:mr-[26vw]">
        <div data-reveal className="relative aspect-[4/3] w-full overflow-hidden md:aspect-[16/9]">
          <div data-img className="absolute inset-0 will-change-transform">
            <Image
              src="/images/2x/pool-day.jpg"
              alt="The living room open to the lap pool and dense planting beyond."
              fill
              sizes="(min-width: 768px) 74vw, 100vw"
              quality={85}
              className="object-cover object-[35%_50%] md:object-center"
            />
          </div>
        </div>
        <figcaption data-fade className={`mt-4 px-[6vw] md:mt-5 ${caption}`}>
          Pool deck
          <Credit className="mt-1" />
        </figcaption>
      </figure>

      {/* ── Moment 5: Evening — dining at dusk, full width, quietly darkening ── */}
      <figure className="mt-[14vh] md:mt-[16vh]">
        <div data-reveal className="relative aspect-[3/4] w-full overflow-hidden md:aspect-[21/9]">
          <div data-img className="absolute inset-0 will-change-transform">
            <Image
              src="/images/2x/dining.jpg"
              alt="The dining room at dusk, a long table set beside the glass, the lap pool running alongside."
              fill
              sizes="100vw"
              quality={85}
              className="object-cover object-[42%_50%] md:object-center"
            />
          </div>
          <div data-dusk aria-hidden="true" className="absolute inset-0 bg-background" style={{ opacity: 0 }} />
        </div>
        <figcaption className="px-[6vw] pb-[14vh] md:grid md:grid-cols-12 md:gap-[4vw] md:pb-[18vh]">
          <div data-fade className={`mt-4 md:col-span-5 md:mt-5 ${caption}`}>
            Dining room
            <Credit className="mt-1" />
          </div>
        </figcaption>
      </figure>
    </section>
  );
}
