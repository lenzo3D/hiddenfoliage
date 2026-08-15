"use client";

// Act 01 — The Reveal.
//
// A full-screen film, driven by scroll. The section is tall (several screens),
// and the visual stays pinned (CSS position: sticky) while the visitor scrolls
// through it. GSAP's ScrollTrigger turns "how far through the section am I"
// into a 0 → 1 number, and that number drives exactly three things:
//
//   1. the video's playhead (currentTime)      — the film scrubs with scroll
//   2. the veil (a dark overlay) fading away    — the house emerges from shadow
//   3. the text: title dissolves out, statement dissolves in
//
// Nothing else animates. The camera movement is already inside the footage.
//
// Note on the footage: scroll-scrubbing seeks the video constantly, so the file
// must have frequent keyframes (this one has one every 6 frames). A normal
// web encode with one keyframe every few seconds will freeze while scrolling.

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const HERO_VIDEO = "/videos/video1-hero.mp4";

// How dark the veil is at the very top of the page (1 = solid black).
// 0.86 keeps the house faintly perceptible rather than a black screen.
const VEIL_START_OPACITY = 0.86;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const veil = veilRef.current;
    const title = titleRef.current;
    const statement = statementRef.current;
    if (!section || !video || !veil || !title || !statement) return;

    gsap.registerPlugin(ScrollTrigger);
    // Phone browsers resize the viewport when the address bar hides/shows.
    // Ignoring those keeps the scrub from jumping mid-scroll.
    ScrollTrigger.config({ ignoreMobileResize: true });

    // matchMedia lets us give reduced-motion visitors a different, static setup,
    // and it re-evaluates automatically if the preference changes.
    const mm = gsap.matchMedia();

    // ── Full experience: scroll drives the film ────────────────────────────
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let tl: gsap.core.Timeline | null = null;

      const build = () => {
        // The video's real length, read from the file — never hard-coded.
        const duration = video.duration;
        if (!Number.isFinite(duration) || duration <= 0) return;

        tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top", // when the top of the hero reaches the top of the screen
            end: "bottom bottom", // until the bottom of the hero reaches the bottom of the screen
            scrub: 0.6, // small lag (seconds) that smooths wheel steps into motion
          },
        });

        // Positions below are fractions of the hero's scroll distance (0 → 1).
        // Every tween declares its own start and end value, so nothing depends
        // on what happened to be on screen when the tween was first rendered.
        tl.fromTo(video, { currentTime: 0 }, { currentTime: duration, duration: 1 }, 0)

          // 1. Darkness recedes: 0% → 55%
          .fromTo(
            veil,
            { opacity: VEIL_START_OPACITY },
            { opacity: 0, duration: 0.55, ease: "sine.inOut" },
            0,
          )

          // 2. Title dissolves out: 20% → 45%  (opacity only — like a film dissolve)
          .fromTo(title, { opacity: 1 }, { opacity: 0, duration: 0.25, ease: "sine.inOut" }, 0.2)

          // 3. Statement dissolves in: 65% → 78%, then leaves quietly: 86% → 94%.
          //    (Nothing essential sits in the last few percent, which some phone
          //    browsers cannot quite reach while their address bar is showing.)
          .fromTo(
            statement,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.13, ease: "sine.out" },
            0.65,
          )
          .fromTo(
            statement,
            { opacity: 1 },
            { opacity: 0, duration: 0.08, ease: "sine.in", immediateRender: false },
            0.86,
          );
      };

      // The duration is only known once the browser has read the file's header.
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) build();
      else video.addEventListener("loadedmetadata", build, { once: true });

      // Cleanup: runs when the component unmounts or the media query stops matching.
      return () => {
        video.removeEventListener("loadedmetadata", build);
        tl?.scrollTrigger?.kill();
        tl?.kill();
      };
    });

    // ── Reduced motion: no scrubbing, one strong still frame ───────────────
    mm.add("(prefers-reduced-motion: reduce)", () => {
      const showFrame = () => {
        if (Number.isFinite(video.duration)) video.currentTime = video.duration * 0.6;
      };
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) showFrame();
      else video.addEventListener("loadedmetadata", showFrame, { once: true });

      gsap.set(veil, { opacity: 0.3 });
      gsap.set(title, { opacity: 1 });
      gsap.set(statement, { opacity: 1, y: 0 });

      return () => video.removeEventListener("loadedmetadata", showFrame);
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      // Total scroll distance. The visual is pinned for all but the first screen,
      // so the sequence plays over ~200vh on desktop and ~150vh on phones.
      // With reduced motion there is nothing to play, so the hero is one screen.
      className="relative h-[300vh] bg-background max-md:h-[250vh] motion-reduce:h-dvh motion-reduce:max-md:h-dvh"
    >
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        <video
          ref={videoRef}
          src={HERO_VIDEO}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
          tabIndex={-1}
          // object-cover fills the screen without distortion. The film's box is
          // the *large* viewport height (h-lvh) so its scale never changes when a
          // phone's address bar slides away — the wrapper above simply clips it.
          // On phones the landscape film is cropped to a tall slice; 30% keeps
          // the near corner of the timber volume and a strip of sky in view.
          className="absolute inset-x-0 top-0 h-lvh w-full object-cover object-[30%_50%] md:object-center"
        />

        {/* The veil: darkness that recedes as you scroll. Starts dark via inline
            style so the very first paint (before JavaScript) is already dark. */}
        <div
          ref={veilRef}
          aria-hidden="true"
          className="absolute inset-0 bg-background"
          style={{ opacity: VEIL_START_OPACITY }}
        />

        {/* Text lives lower-left, over the hedge, never over the house. The title
            block and the statement share the same corner (a single grid cell)
            because they are never visible at the same time. For reduced-motion
            visitors both are visible, so the grid becomes a simple vertical stack.
            Phones sit the block higher: in the tall crop the road edge is closer
            to the bottom, and the text should stay on the dark planting. */}
        <div className="hero-copy absolute inset-x-0 bottom-0 grid px-[6vw] pb-[8vh] max-md:pb-[13vh] motion-reduce:block">
          <div ref={titleRef} className="[grid-area:1/1] self-end">
            <h1 className="font-serif text-[clamp(2.75rem,7vw,6.75rem)] uppercase leading-[0.92] tracking-[0.04em] text-foreground [text-shadow:0_1px_2px_rgba(0,0,0,0.25)]">
              Hidden
              <br />
              Foliage
            </h1>
            <p className="mt-5 font-sans text-[0.6875rem] uppercase tracking-[0.3em] text-stone [text-shadow:0_1px_2px_rgba(0,0,0,0.4)] md:mt-7 md:text-xs">
              Berrima Road <span aria-hidden="true">·</span> Singapore
            </p>
          </div>

          <p
            ref={statementRef}
            className="[grid-area:1/1] max-w-[26ch] self-end font-serif text-[clamp(1.25rem,1.9vw,1.75rem)] italic leading-snug text-foreground/95 [text-shadow:0_1px_2px_rgba(0,0,0,0.4)] motion-reduce:mt-10"
            style={{ opacity: 0 }}
          >
            Architecture, concealed by nature.
          </p>
        </div>
      </div>
    </section>
  );
}
