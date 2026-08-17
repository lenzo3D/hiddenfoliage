"use client";

// 05 — Close.
//
// The last shot of the film: the house at night, the privacy screen lit from
// within — what conceals by day glows after dark. This act is the quietest and
// mirrors the opening: the Reveal let darkness recede; here darkness returns,
// slowly, until only the lantern is left. No panels, no doors. One
// transformation. The Signature (wordmark, address, enquiry) follows it.
//
//   tint      0.35 → 0.12 over 0–20% (the night house comes through), rests,
//             then 0.12 → 0.72 over 60% → 95% (night gathers), rests
//   film      plays once from 5%; holds its last frame; rewound off screen
//   statement in 28% → 40%, out 78% → 88% (before the dark closes in)
//   label     present throughout

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FILM = "/videos/video4- close.mp4";
const STILL = "/images/exterior (night).png"; // reduced-motion fallback, same framing

const TINT_START = 0.35;
const TINT_OPEN = 0.12;
const TINT_END = 0.72;
const FILM_STARTS_AT = 0.05;

export default function Close() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const tint = tintRef.current;
    const statement = statementRef.current;
    if (!section || !video || !tint || !statement) return;

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
        // The night house comes through, then rests.
        .fromTo(tint, { opacity: TINT_START }, { opacity: TINT_OPEN, duration: 0.2, ease: "sine.out" }, 0)

        // The statement, while the lantern is brightest.
        .fromTo(statement, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.12, ease: "sine.out" }, 0.28)
        .fromTo(
          statement,
          { opacity: 1 },
          { opacity: 0, duration: 0.1, ease: "sine.in", immediateRender: false },
          0.78,
        )

        // Night gathers: 60% → 95%. Slow and even; the lit screen is the last thing to go.
        .fromTo(
          tint,
          { opacity: TINT_OPEN },
          { opacity: TINT_END, duration: 0.35, ease: "sine.inOut", immediateRender: false },
          0.6,
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

    // ── Reduced motion: the night still, a light tint, text visible ───────
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(tint, { opacity: 0.25 });
      gsap.set(statement, { opacity: 1, y: 0 });
    });

    return () => mm.revert();
  }, []);

  // The house sits left of centre; on phones the tall crop is biased that way.
  const mediaCrop = "object-cover object-[42%_50%] md:object-center";

  return (
    <section
      ref={sectionRef}
      className="relative h-[240vh] bg-background max-md:h-[220vh] motion-reduce:h-dvh motion-reduce:max-md:h-dvh"
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

        {/* Text lower-left over the dark planting — the same corner the site opened in. */}
        <div className="absolute inset-x-0 bottom-0 px-[6vw] pb-[8vh] max-md:pb-[13vh]">
          <p
            ref={statementRef}
            className="mb-6 max-w-[40ch] font-serif text-[clamp(1.25rem,1.7vw,1.625rem)] italic leading-snug text-foreground/95 md:mb-8"
            style={{ opacity: 0 }}
          >
            What conceals by day, glows by&nbsp;night.
          </p>
          <p className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs">
            05 <span aria-hidden="true">/</span> Close
          </p>
        </div>
      </div>
    </section>
  );
}
