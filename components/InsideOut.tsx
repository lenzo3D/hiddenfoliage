"use client";

// 03 — Inside Out.
//
// The living room and the lap pool are one continuous space; the glass is just
// a line in the middle of the frame. One interaction: two dark panels — the
// sliding doors — part from a narrow central opening to the full frame as you
// scroll. The film (dusk, warm room, cool water) plays at its own pace beneath.
//
// Same mechanics as the earlier acts. As fractions of scroll:
//
//   tint      0.55 → 0.18 over 0–55%, then rests
//   doors     part from a central slot over 15% → 75%
//   film      plays once from the start when the doors begin to move; holds its
//             last frame; rewound only when the section is fully off screen
//   statement in 62% → 74%, out 90% → 96%
//   label     present throughout

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// The film: 1920×1080, 8.5 s, no audio — encoded from the client’s 2560×1440
// upscale (`upscaled-video.mp4`) and trimmed there: the source drifts in its
// final half-second (the glazing mullions double and the geometry smears), so
// the last 1.5 s is cut and the act holds a clean frame. The still is frame 0
// of the same upscale, so the reduced-motion view matches the opening frame.
const FILM = "/videos/video3-inside-out-1080.mp4";
const STILL = "/images/inside-out-still.jpg"; // reduced-motion fallback, same framing

const TINT_START = 0.55;
const TINT_END = 0.18;
const FILM_STARTS_AT = 0.15;

export default function InsideOut() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const tint = tintRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const statement = statementRef.current;
    if (!section || !video || !tint || !left || !right || !statement) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // ── Film playback lifecycle (not scrubbed) ──────────────────────────
      let active = false;
      let onScreen = false;
      const play = () => {
        if (!video.paused || video.ended) return;
        const p = video.play();
        if (p) p.catch(() => {});
      };
      const pause = () => {
        if (!video.paused) video.pause();
      };
      const rewind = () => {
        video.currentTime = 0;
      };

      const visibility = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => {
          onScreen = true;
        },
        onEnterBack: () => {
          onScreen = true;
          if (active) play();
        },
        onLeave: () => {
          onScreen = false;
          pause();
        },
        onLeaveBack: () => {
          onScreen = false;
          pause();
          rewind();
        },
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          onUpdate: (self) => {
            if (self.progress >= FILM_STARTS_AT && !active) {
              active = true;
              if (onScreen) play();
            } else if (self.progress < FILM_STARTS_AT && active) {
              active = false;
              pause();
            }
          },
        },
      });

      tl
        // Settle in dark, then let the room come through and rest.
        .fromTo(tint, { opacity: TINT_START }, { opacity: 0.35, duration: 0.15 }, 0)
        .fromTo(
          tint,
          { opacity: 0.35 },
          { opacity: TINT_END, duration: 0.4, ease: "sine.out", immediateRender: false },
          0.15,
        )

        // The doors part: 15% → 75%. Even, slow, no overshoot.
        .fromTo(left, { xPercent: 0 }, { xPercent: -100, duration: 0.6, ease: "power1.inOut" }, 0.15)
        .fromTo(right, { xPercent: 0 }, { xPercent: 100, duration: 0.6, ease: "power1.inOut" }, 0.15)

        // The statement, once the room is open: 62% → 74%, out 90% → 96%.
        .fromTo(statement, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.12, ease: "sine.out" }, 0.62)
        .fromTo(
          statement,
          { opacity: 1 },
          { opacity: 0, duration: 0.06, ease: "sine.in", immediateRender: false },
          0.9,
        )

        // Keeps the timeline exactly 1.0 long.
        .to({}, { duration: 1 }, 0);

      // Load the film in full only when the section is one screen away.
      const approach = ScrollTrigger.create({
        trigger: section,
        start: "top bottom+=100%",
        once: true,
        onEnter: () => {
          video.preload = "auto";
          video.load();
        },
      });

      return () => {
        pause();
        approach.kill();
        visibility.kill();
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    // ── Reduced motion: still, doors parked half open, text visible ───────
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(tint, { opacity: 0.25 });
      gsap.set(left, { xPercent: -55 });
      gsap.set(right, { xPercent: 55 });
      gsap.set(statement, { opacity: 1, y: 0 });
    });

    return () => mm.revert();
  }, []);

  // On phones the tall crop is centred on the glass line (≈45% across the frame)
  // so the slot shows interior, threshold and water together.
  const mediaCrop = "object-cover object-[45%_50%] md:object-center";
  // Each door covers 36% of the stage on desktop (28% opening). Phones get
  // narrower doors — 25% each, a 50% opening — because on a narrow screen the
  // old 36% slot read as a letterbox rather than a threshold.
  const door = "absolute inset-y-0 w-[36%] bg-background max-md:w-[25%]";

  return (
    <section
      ref={sectionRef}
      className="relative h-[260vh] bg-background max-md:h-[230vh] motion-reduce:h-dvh motion-reduce:max-md:h-dvh"
    >
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-lvh w-full">
          <video
            ref={videoRef}
            src={FILM}
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
            src={STILL}
            alt=""
            fill
            sizes="(orientation: portrait) 178vh, 100vw"
            quality={85}
            className={`hidden motion-reduce:block ${mediaCrop}`}
          />
        </div>

        <div
          ref={tintRef}
          aria-hidden="true"
          className="absolute inset-0 bg-background"
          style={{ opacity: TINT_START }}
        />

        {/* The doors: two near-black panels with hairline stone inner edges. */}
        <div ref={leftRef} aria-hidden="true" className={`${door} left-0 border-r border-stone/25`} />
        <div ref={rightRef} aria-hidden="true" className={`${door} right-0 border-l border-stone/25`} />

        {/* Statement, once the room has opened. Top-right on desktop (over the tree
            canopy — the floor below is too pale for ivory text); under the
            annotation on phones. */}
        <p
          ref={statementRef}
          className="absolute left-[6vw] top-[13vh] max-w-[24ch] font-serif text-[clamp(1.25rem,1.7vw,1.625rem)] italic leading-snug text-foreground/95 md:left-auto md:right-[6vw] md:top-[8vh] md:text-right"
          style={{ opacity: 0 }}
        >
          Rooms that end in water.
        </p>

        {/* Annotation, top-left — over the dark ceiling timber once the doors open. */}
        <p className="absolute left-[6vw] top-[8vh] font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs">
          03 <span aria-hidden="true">/</span> Inside Out
        </p>
      </div>
    </section>
  );
}
