"use client";

// Act 02 — The Veil.
//
// One idea: the patterned privacy screen gives privacy without sealing the
// house away. One interaction: a dark architectural panel (the veil) covers most
// of the façade and slowly retracts sideways as you scroll, uncovering the
// screen — while the screen's own louvres rotate open in the footage.
//
// Same mechanics as Act 01: a tall section, a sticky full-screen stage, and one
// GSAP timeline scrubbed by ScrollTrigger. What moves, as fractions of scroll:
//
//   tint      0.7 → 0.45 (0–15%)  → 0.2 (→55%)   settles in dark, then rests
//   veil      retracts left over 15% → 80%
//   film      held closed; louvres open over 25% → 60%; then held half-open
//   statement in 25% → 45%, out 48% → 58% (gone before the edge reaches it)
//   label     present throughout
//
// The film file: 4 s excerpt of video2, re-encoded with frequent keyframes so it
// can be scrubbed (like Act 01). Only 1.2 s → 2.5 s is used: closed → half-open.

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const VEIL_VIDEO = "/videos/video2- veil.mp4";
const VEIL_STILL = "/images/exterior blinds open.png"; // reduced-motion fallback

// Which part of the film we scrub: louvres closed → half-open (pattern still legible).
const FILM_FROM = 1.2;
const FILM_TO = 2.5;

const TINT_START = 0.7;
const TINT_END = 0.2;

export default function Veil() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const tint = tintRef.current;
    const veil = veilRef.current;
    const statement = statementRef.current;
    if (!section || !video || !tint || !veil || !statement) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    // ── Full experience ────────────────────────────────────────────────────
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let tl: gsap.core.Timeline | null = null;

      const build = () => {
        if (tl) return; // never build twice
        const duration = video.duration;
        if (!Number.isFinite(duration) || duration <= 0) return;
        const to = Math.min(FILM_TO, duration);

        tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8, // a touch more smoothing than the hero: this movement is slower
          },
        });

        tl
          // Settle into darkness, then let the façade come through and rest.
          .fromTo(tint, { opacity: TINT_START }, { opacity: 0.45, duration: 0.15 }, 0)
          .fromTo(
            tint,
            { opacity: 0.45 },
            { opacity: TINT_END, duration: 0.4, ease: "sine.out", immediateRender: false },
            0.15,
          )

          // The veil retracts: 15% → 80%. Slow, even, no overshoot.
          .fromTo(veil, { xPercent: 0 }, { xPercent: -100, duration: 0.65, ease: "power1.inOut" }, 0.15)

          // The louvres open: 25% → 60%, then hold half-open.
          .fromTo(
            video,
            { currentTime: FILM_FROM },
            { currentTime: to, duration: 0.35 },
            0.25,
          )

          // The statement: composed as one block. In 25% → 45%, out 48% → 58%,
          //    so the words have gone before the veil edge passes over them.
          .fromTo(
            statement,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.2, ease: "sine.out" },
            0.25,
          )
          .fromTo(
            statement,
            { opacity: 1 },
            { opacity: 0, duration: 0.1, ease: "sine.in", immediateRender: false },
            0.48,
          )

          // The hold: 80% → 100% nothing changes. This empty tween matters — a
          // scrubbed timeline is stretched to fit the scroll range, so without it
          // every stage above would be stretched by a third.
          .to({}, { duration: 0.2 }, 0.8);
      };

      // Sensible loading: the film only starts downloading in full when the
      // section is one screen away, then the timeline is built once its length
      // is known. (preload="metadata" until then.)
      const approach = ScrollTrigger.create({
        trigger: section,
        start: "top bottom+=100%",
        once: true,
        onEnter: () => {
          video.preload = "auto";
          video.load();
        },
      });
      video.addEventListener("loadedmetadata", build);

      return () => {
        video.removeEventListener("loadedmetadata", build);
        approach.kill();
        tl?.scrollTrigger?.kill();
        tl?.kill();
      };
    });

    // ── Reduced motion: still image, veil parked, all text visible ────────
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(tint, { opacity: 0.25 });
      gsap.set(veil, { xPercent: -45 }); // covers the left third — text sits on it
      gsap.set(statement, { opacity: 1, y: 0 });
    });

    return () => mm.revert();
  }, []);

  // Still and film share this crop so the reduced-motion fallback matches.
  const mediaCrop = "object-cover object-center";

  return (
    <section
      ref={sectionRef}
      className="relative h-[270vh] bg-background max-md:h-[240vh] motion-reduce:h-dvh motion-reduce:max-md:h-dvh"
    >
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        {/* Media, sized to the large viewport so phones don't rescale it. */}
        <div className="absolute inset-x-0 top-0 h-lvh w-full">
          <video
            ref={videoRef}
            src={VEIL_VIDEO}
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
            className={`absolute inset-0 h-full w-full motion-reduce:hidden ${mediaCrop}`}
          />
          <Image
            src={VEIL_STILL}
            alt=""
            fill
            sizes="100vw"
            quality={85}
            className={`hidden motion-reduce:block ${mediaCrop}`}
          />
        </div>

        {/* Overall tint: settles dark, then rests slightly moody. */}
        <div
          ref={tintRef}
          aria-hidden="true"
          className="absolute inset-0 bg-background"
          style={{ opacity: TINT_START }}
        />

        {/* The veil: a near-black architectural panel with a hairline stone edge.
            Covers the left 60% on desktop, 76% on phones; retracts to the left. */}
        <div
          ref={veilRef}
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[60%] border-r border-stone/25 bg-background max-md:w-[76%]"
        />

        {/* Statement: left, vertically centred on the veil (desktop). On phones it
            sits lower, over the dark ground storey, so it never crosses the screen. */}
        <h2
          ref={statementRef}
          className="absolute left-[6vw] top-1/2 -translate-y-1/2 max-md:top-auto max-md:bottom-[15vh] max-md:translate-y-0 font-serif text-[clamp(2rem,3.9vw,3.75rem)] uppercase leading-[1.02] tracking-[0.02em] text-foreground"
          style={{ opacity: 0 }}
        >
          Privacy
          <br />
          Without
          <br />
          Separation
        </h2>

        {/* Annotation, bottom-left, like a drawing notation. */}
        <p className="absolute bottom-[8vh] left-[6vw] font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs">
          01 <span aria-hidden="true">/</span> The Veil
        </p>
      </div>
    </section>
  );
}
