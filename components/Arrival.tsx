"use client";

// 02 — Arrival.
//
// Between the study of the screen (01) and the living floor opening to the
// pool (03): the moment of getting here. One image — the car porch, a timber
// ceiling over four cars, the front door at the end of it — placed full width,
// with the statement and the one fact beside it. Natural flow, no pin; the
// same quiet reveals as The Sanctuary (see useReveals).

import { useRef } from "react";
import Image from "next/image";
import { useReveals } from "./useReveals";
import Credit from "./Credit";

const caption = "font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs";

export default function Arrival() {
  const rootRef = useRef<HTMLElement>(null);
  useReveals(rootRef);

  return (
    <section ref={rootRef} className="relative bg-background text-foreground">
      <div className="px-[6vw] pt-[16vh] md:pt-[18vh]">
        <p className={caption}>
          02 <span aria-hidden="true">/</span> Arrival
        </p>
      </div>

      <figure className="mt-[8vh] md:mt-[10vh]">
        <div data-reveal className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[21/9]">
          <div data-img className="absolute inset-0 will-change-transform">
            <Image
              src="/images/2x/porch.jpg"
              alt="The car porch: a timber-lined ceiling over the drive, slatted timber walls and the front door beneath it."
              fill
              sizes="100vw"
              quality={85}
              className="object-cover object-[75%_50%] md:object-[40%_50%]"
            />
          </div>
        </div>
        <figcaption className="px-[6vw] pb-[14vh] md:grid md:grid-cols-12 md:gap-[4vw] md:pb-[18vh]">
          <div data-fade className={`mt-4 md:col-span-5 md:mt-5 ${caption}`}>
            Car porch
            <Credit className="mt-1" />
          </div>
          <div className="mt-10 md:col-span-6 md:col-start-7 md:mt-5">
            <p className="max-w-[22ch] font-serif text-[clamp(1.5rem,2.4vw,2.25rem)] italic leading-snug text-foreground/95">
              <span className="block overflow-hidden">
                <span data-line className="block">
                  A quiet threshold between street and home.
                </span>
              </span>
            </p>
          </div>
        </figcaption>
      </figure>
    </section>
  );
}
