"use client";

// LOCATION — five chapters, told like the film rather than listed like a page:
//
//   01 A private world · 02 Exceptional education · 03 The Gardens, on foot ·
//   04 The city within reach · 05 Effortlessly connected
//
// Desktop (motion allowed): the stage is pinned for about five and a half
// screens of scroll (h-[640vh]), just over a screen per chapter.
// A large plate on the left carries the chapter's photograph or diagram; the
// copy sits in a narrow column on the right; a counter and five hairlines mark
// the place in the sequence. As you scroll, the next plate fades in over the
// last, the copy rises in and leaves, the diagram lines draw on, the counter
// turns 01 → 05. Each plate drifts very slowly (a scrubbed scale) while it is
// up. Transform and opacity only.
//
// Phones, and anyone preferring reduced motion: the same five chapters
// stacked in the page — plate, then number, headline, copy and the verified
// line — with the site's gentle reveals (none under reduced motion).

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTERS, type Visual } from "./locationChapters";
import { SchoolsDiagram, RoutesDiagram } from "./LocationDiagrams";
import { useReveals } from "./useReveals";

const N = CHAPTERS.length;
const S = 1 / N; // each chapter's share of the pinned scroll
const X = 0.03; // half-width of a plate crossfade, in scroll fraction

const label = "font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs";
const creditCls = "font-sans text-[0.625rem] uppercase tracking-[0.16em] text-stone/60";
const pad = (i: number) => String(i + 1).padStart(2, "0");

function PlateVisual({ v, compact, sizes, priority }: { v: Visual; compact: boolean; sizes: string; priority?: boolean }) {
  if (v.kind === "diagram") return v.diagram === "schools" ? <SchoolsDiagram compact={compact} /> : <RoutesDiagram compact={compact} />;
  return (
    <>
      <Image src={v.src} alt={v.alt} fill sizes={sizes} quality={85} priority={priority} className="object-cover" style={{ objectPosition: v.position ?? "50% 50%" }} />
      {/* A light veil so photographs sit in the site's dark field. */}
      <div aria-hidden="true" className="absolute inset-0 bg-background/20" />
    </>
  );
}

function CreditLine({ v, className = "" }: { v: Visual; className?: string }) {
  if (v.kind !== "photo") return <span className={className}>Diagram · not to scale</span>;
  return (
    <a href={v.creditUrl} target="_blank" rel="noopener noreferrer" className={`${className} transition-colors hover:text-stone`}>
      Photograph <span aria-hidden="true">·</span> {v.credit}
    </a>
  );
}

export default function LocationStory() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  useReveals(rootRef); // the stacked variant only

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const plates = gsap.utils.toArray<HTMLElement>("[data-plate]", pin);
      const imgs = gsap.utils.toArray<HTMLElement>("[data-plate-img]", pin);
      const copies = gsap.utils.toArray<HTMLElement>("[data-copy]", pin);
      const credits = gsap.utils.toArray<HTMLElement>("[data-credit]", pin);
      const ticks = gsap.utils.toArray<HTMLElement>("[data-tick]", pin);
      const counter = pin.querySelector<HTMLElement>("[data-counter]");

      gsap.set(plates, { opacity: (i: number) => (i === 0 ? 1 : 0) });
      gsap.set(copies, { opacity: 0, y: 24 });
      gsap.set(credits, { opacity: 0 });
      gsap.set(ticks, { opacity: 0.3 });
      gsap.set(ticks[0], { opacity: 1 });
      // Diagram lines start hidden behind their own length.
      const draws = gsap.utils.toArray<SVGGeometryElement>("[data-draw]", pin);
      draws.forEach((el) => {
        const len = el.getTotalLength();
        gsap.set(el, { attr: { "stroke-dasharray": len, "stroke-dashoffset": len } });
      });
      const pops = gsap.utils.toArray<Element>("[data-pop]", pin);
      gsap.set(pops, { opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const k = Math.min(N - 1, Math.max(0, Math.floor((self.progress + X) * N)));
            if (counter && counter.textContent !== pad(k)) counter.textContent = pad(k);
          },
        },
      });

      for (let k = 0; k < N; k++) {
        const b = k * S; // this chapter begins
        const e = b + S; // and ends
        if (k > 0) {
          // The next plate fades in over the last; the last is dropped once covered.
          tl.fromTo(plates[k], { opacity: 0 }, { opacity: 1, duration: 2 * X, ease: "sine.inOut" }, b - X);
          tl.set(plates[k - 1], { opacity: 0 }, b + X);
          tl.fromTo(ticks[k], { opacity: 0.3 }, { opacity: 1, duration: 0.02 }, b);
          tl.fromTo(ticks[k - 1], { opacity: 1 }, { opacity: 0.3, duration: 0.02, immediateRender: false }, b);
        }
        // A slow drift while the plate is up.
        tl.fromTo(imgs[k], { scale: 1.08 }, { scale: 1, duration: S + 2 * X }, Math.max(0, b - X));
        // Copy rises in soon after the plate, stays for most of the chapter, and
        // leaves just before the next plate arrives.
        tl.fromTo(copies[k], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.045, ease: "sine.out" }, b + (k ? 0.01 : 0));
        tl.fromTo(credits[k], { opacity: 0 }, { opacity: 1, duration: 0.04 }, b + (k ? 0.015 : 0));
        if (k < N - 1) {
          tl.fromTo(copies[k], { opacity: 1, y: 0 }, { opacity: 0, y: -16, duration: 0.035, ease: "sine.in", immediateRender: false }, e - 0.05);
          tl.fromTo(credits[k], { opacity: 1 }, { opacity: 0, duration: 0.03, immediateRender: false }, e - 0.045);
        }
        // Diagram plates draw themselves as their chapter arrives: lines first,
        // then the names.
        const d = gsap.utils.toArray<SVGGeometryElement>("[data-draw]", plates[k]);
        const p = gsap.utils.toArray<Element>("[data-pop]", plates[k]);
        if (d.length) tl.to(d, { attr: { "stroke-dashoffset": 0 }, duration: 0.08, ease: "sine.out", stagger: { each: 0.004 } }, b + (k ? 0.01 : 0));
        if (p.length) tl.to(p, { opacity: 1, duration: 0.025, stagger: { each: 0.003 } }, b + (k ? 0.045 : 0.03));
      }
      tl.to({}, { duration: 1 }, 0); // exactly 1.0 long

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} aria-label="The location, in five chapters" className="relative bg-background text-foreground">
      {/* ── Desktop, motion allowed: the pinned sequence ───────────────────── */}
      <div ref={pinRef} className="relative hidden h-[640vh] md:motion-safe:block">
        <div className="sticky top-0 h-dvh overflow-hidden">
          {/* The plate */}
          <div className="absolute bottom-[11vh] left-[6vw] top-[11vh] w-[56vw] overflow-hidden">
            {CHAPTERS.map((c, i) => (
              <div key={c.id} data-plate className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }} aria-hidden={i !== 0}>
                <div data-plate-img className="absolute inset-0 will-change-transform">
                  <PlateVisual v={c.visual} compact={false} sizes="56vw" priority={i === 0} />
                </div>
              </div>
            ))}
          </div>

          {/* The copy column */}
          <div className="absolute bottom-0 right-[6vw] top-0 w-[28vw]">
            {CHAPTERS.map((c) => (
              <div key={c.id} data-copy className="absolute inset-x-0 top-1/2" style={{ opacity: 0 }}>
                <div className="-translate-y-1/2">
                  <p className={label}>
                    {c.n} <span aria-hidden="true">/</span> {c.kicker}
                  </p>
                  <h2 className="mt-6 font-serif text-[clamp(1.5rem,2.3vw,2.25rem)] uppercase leading-[1.08] tracking-[0.02em] text-foreground">{c.title}</h2>
                  <p className="mt-6 font-sans text-sm leading-relaxed text-stone md:text-[0.9375rem]">{c.body}</p>
                  <p className={`mt-8 leading-loose ${label} text-stone/80`}>{c.fact}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Counter and progress, bottom-left; the photograph's credit under the plate's right end */}
          <div className="absolute bottom-[4.5vh] left-[6vw] flex items-end gap-6">
            <p className={label}>
              <span data-counter className="text-foreground">01</span> <span aria-hidden="true">/</span> {pad(N - 1)}
            </p>
            <div className="mb-1 flex gap-2" aria-hidden="true">
              {CHAPTERS.map((c) => (
                <span key={c.id} data-tick className="block h-px w-8 bg-foreground" style={{ opacity: 0.3 }} />
              ))}
            </div>
          </div>
          <div className="absolute bottom-[4.5vh] left-[6vw] h-4 w-[56vw]">
            {CHAPTERS.map((c) => (
              <p key={c.id} data-credit className="absolute bottom-0 right-0" style={{ opacity: 0 }}>
                <CreditLine v={c.visual} className={creditCls} />
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* ── Phones, and reduced motion: the chapters stacked ───────────────── */}
      <div className="md:motion-safe:hidden">
        {CHAPTERS.map((c, i) => (
          <article key={c.id} className={i ? "mt-[16vh]" : ""}>
            <figure>
              <div data-reveal className={`relative w-full overflow-hidden md:aspect-[16/10] ${c.visual.kind === "diagram" ? "aspect-square" : "aspect-[4/5]"}`}>
                <div data-img className="absolute inset-0 will-change-transform">
                  <PlateVisual v={c.visual} compact sizes="100vw" />
                </div>
              </div>
              <figcaption className="mt-3 px-[6vw]">
                <CreditLine v={c.visual} className={creditCls} />
              </figcaption>
            </figure>
            <div className="mt-8 px-[6vw] md:max-w-[52ch]">
              <p data-fade className={label}>
                {c.n} <span aria-hidden="true">/</span> {c.kicker}
              </p>
              <h2 data-fade className="mt-5 font-serif text-[clamp(1.5rem,2.3vw,2.25rem)] uppercase leading-[1.08] tracking-[0.02em] text-foreground">
                {c.title}
              </h2>
              <p data-fade className="mt-5 font-sans text-sm leading-relaxed text-stone md:text-[0.9375rem]">
                {c.body}
              </p>
              <p data-fade className={`mt-6 leading-loose ${label} text-stone/80`}>
                {c.fact}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
