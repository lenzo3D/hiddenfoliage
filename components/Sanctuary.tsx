"use client";

// 04 — The Sanctuary.
//
// The quietest act. After the technical drawing of Four Levels, this is where
// the visitor stops analysing the house and starts imagining living in it.
// Natural document flow, no pin. Five moments, each a placed editorial
// composition on the same dark field:
//
//   1  entry: 04 / THE SANCTUARY, then A HOME BUILT AROUND PRIVACY.
//   2  the master bedroom — large, offset right, filtered light on timber
//   3  the master bath, a narrow portrait — with the one fact: 5 ensuite bedrooms
//   4  living room to pool and planting — nature at the edge of the rooms
//   5  the dining room at dusk, full width, quietly darkening → into Close
//
// Motion is minimal and scroll-linked: each image is unmasked from the bottom
// with a small vertical settle; statement lines rise through a clip; the last
// image gathers a little darkness as it leaves. Reduced motion: no motion at all,
// everything simply present.

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Sanctuary() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const triggers: ScrollTrigger[] = [];
      const add = (t: gsap.core.Tween) => t.scrollTrigger && triggers.push(t.scrollTrigger);

      // Statement lines rise through their clipping wrappers as they enter.
      root.querySelectorAll<HTMLElement>("[data-line]").forEach((line, i) => {
        add(
          gsap.fromTo(
            line,
            { yPercent: 105 },
            {
              yPercent: 0,
              ease: "sine.out",
              scrollTrigger: { trigger: line.parentElement, start: `top ${88 - i * 4}%`, end: `top ${52 - i * 4}%`, scrub: 0.6 },
            },
          ),
        );
      });

      // Images: unmasked from the bottom edge, with a small settle upward.
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((frame) => {
        const img = frame.querySelector<HTMLElement>("[data-img]");
        add(
          gsap.fromTo(
            frame,
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", ease: "sine.inOut", scrollTrigger: { trigger: frame, start: "top 90%", end: "top 45%", scrub: 0.8 } },
          ),
        );
        if (img) {
          add(
            gsap.fromTo(
              img,
              { y: 36 },
              { y: 0, ease: "sine.out", scrollTrigger: { trigger: frame, start: "top 90%", end: "top 30%", scrub: 0.8 } },
            ),
          );
        }
      });

      // Small annotations and the numeral simply come up.
      root.querySelectorAll<HTMLElement>("[data-fade]").forEach((el) => {
        add(
          gsap.fromTo(
            el,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, ease: "sine.out", scrollTrigger: { trigger: el, start: "top 92%", end: "top 62%", scrub: 0.6 } },
          ),
        );
      });

      // The last image gathers darkness as it leaves — evening settling before Close.
      const dusk = root.querySelector<HTMLElement>("[data-dusk]");
      if (dusk) {
        add(
          gsap.fromTo(
            dusk,
            { opacity: 0 },
            { opacity: 0.55, ease: "none", scrollTrigger: { trigger: dusk.parentElement, start: "top 25%", end: "bottom 60%", scrub: 0.8 } },
          ),
        );
      }

      return () => triggers.forEach((t) => t.kill());
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative bg-background text-foreground">
      {/* ── Moment 1: entry ─────────────────────────────────────────────── */}
      <div className="px-[6vw] pb-[14vh] pt-[22vh] md:pb-[14vh] md:pt-[24vh]">
        <p className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs">
          04 <span aria-hidden="true">/</span> The Sanctuary
        </p>
        <h2 className="mt-[10vh] font-serif text-[clamp(2rem,4.4vw,4.25rem)] uppercase leading-[1.04] tracking-[0.02em] md:ml-[8vw] md:mt-[12vh]">
          <span className="block overflow-hidden">
            <span data-line className="block">
              A home built
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-line className="block">
              around privacy.
            </span>
          </span>
        </h2>
        <p data-fade className="mt-8 max-w-[34ch] font-sans text-sm leading-relaxed text-stone md:ml-[8vw] md:mt-10 md:text-[0.9375rem]">
          Filtered light. Quiet rooms. Greenery at the edge of every view.
        </p>
      </div>

      {/* ── Moment 2: the master bedroom — large, offset right ─────────────── */}
      <figure className="md:ml-[22vw] md:mr-[6vw]">
        <div data-reveal className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[16/9]">
          <div data-img className="absolute inset-0 will-change-transform">
            <Image
              src="/images/bedroom.png"
              alt="Master bedroom: a low bed on a timber floor, the privacy screen's pattern cast across it in sunlight."
              fill
              sizes="(min-width: 768px) 72vw, 100vw"
              quality={85}
              className="object-cover object-[56%_50%] md:object-center"
            />
          </div>
        </div>
        <figcaption data-fade className="mt-4 px-[6vw] font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:mt-5 md:px-0 md:text-xs">
          Master bedroom <span aria-hidden="true">·</span> Second storey
        </figcaption>
      </figure>

      {/* ── Moment 3: the master bath, narrow portrait — and the one fact ─── */}
      <div className="mt-[14vh] px-[6vw] md:mt-[16vh] md:flex md:items-center md:gap-[8vw]">
        <figure className="w-[78vw] md:w-[30vw] md:shrink-0">
          <div data-reveal className="relative aspect-[3/4] w-full overflow-hidden">
            <div data-img className="absolute inset-0 will-change-transform">
              <Image
                src="/images/bathroom.png"
                alt="Master bath: a freestanding tub before the timber screen, lit from behind."
                fill
                sizes="(min-width: 768px) 30vw, 78vw"
                quality={85}
                className="object-cover object-[50%_20%]"
              />
            </div>
          </div>
          <figcaption data-fade className="mt-4 font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:mt-5 md:text-xs">
            Master bath
          </figcaption>
        </figure>
        <div data-fade className="mt-[10vh] md:mt-0">
          <p className="font-serif text-[clamp(6rem,14vw,12.5rem)] leading-[0.85] text-foreground">5</p>
          <p className="mt-4 font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:mt-6 md:text-xs">
            Ensuite bedrooms
          </p>
        </div>
      </div>

      {/* ── Moment 4: living room to pool and planting — nature at the edge ── */}
      <figure className="mt-[14vh] md:mt-[16vh] md:mr-[26vw]">
        <div data-reveal className="relative aspect-[4/3] w-full overflow-hidden md:aspect-[16/9]">
          <div data-img className="absolute inset-0 will-change-transform">
            <Image
              src="/images/pool (day).png"
              alt="The living room open to the lap pool and dense planting beyond."
              fill
              sizes="(min-width: 768px) 74vw, 100vw"
              quality={85}
              className="object-cover object-[35%_50%] md:object-center"
            />
          </div>
        </div>
        <figcaption data-fade className="mt-4 px-[6vw] font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:mt-5 md:text-xs">
          Living room <span aria-hidden="true">·</span> Pool deck
        </figcaption>
      </figure>

      {/* ── Moment 5: dining at dusk — full width, quietly darkening ─────── */}
      <figure className="mt-[14vh] md:mt-[16vh]">
        <div data-reveal className="relative aspect-[3/4] w-full overflow-hidden md:aspect-[21/9]">
          <div data-img className="absolute inset-0 will-change-transform">
            <Image
              src="/images/dining area.png"
              alt="The dining room at dusk, the lap pool running alongside the glass."
              fill
              sizes="100vw"
              quality={85}
              className="object-cover object-[42%_50%] md:object-center"
            />
          </div>
          <div data-dusk aria-hidden="true" className="absolute inset-0 bg-background" style={{ opacity: 0 }} />
        </div>
        <figcaption data-fade className="mt-4 px-[6vw] pb-[14vh] font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:mt-5 md:pb-[18vh] md:text-xs">
          Dining room <span aria-hidden="true">·</span> Dusk
        </figcaption>
      </figure>
    </section>
  );
}
