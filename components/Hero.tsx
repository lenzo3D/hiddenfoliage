"use client";

// Act 01 — The Reveal.
//
// A full-screen visual, driven by scroll. The section is tall (several screens),
// and the visual stays pinned (CSS position: sticky) while the visitor scrolls
// through it. GSAP's ScrollTrigger turns "how far through the section am I"
// into a 0 → 1 number, and that number drives the sequence.
//
// The visual stack, bottom to top:
//   • the high-resolution still  — gives the opening its photographic sharpness
//   • the film                   — same framing; it takes over and supplies the motion
//   • the veil                   — a dark forest overlay that slowly recedes
//   • the typography
//
// Only three things happen for the visitor: darkness recedes, the title
// disappears, the statement appears. The still→film hand-off is invisible: the
// film's first frame is the still, so it is held on that frame while it fades in,
// and only starts moving once it is fully in front.
//
// Note on the footage: scroll-scrubbing seeks the video constantly, so the file
// must have frequent keyframes (this one has one every 6 frames).

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const HERO_STILL = "/images/hero image.png"; // 1672×941, the film's opening frame
const HERO_VIDEO = "/videos/video1-hero.mp4";

// Veil opacity at the very top of the page (1 = solid). 0.86 keeps the house
// faintly perceptible — shadowed, not black. Ends at VEIL_END so the final
// frame stays slightly moody rather than a bright listing photo.
const VEIL_START = 0.86;
const VEIL_END = 0.14;

// Where the film starts moving (as a fraction of the hero's scroll). Before this
// it sits on its first frame while it fades in over the still.
const FILM_STARTS_MOVING = 0.2;

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

    // ── Full experience: scroll drives the sequence ────────────────────────
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let tl: gsap.core.Timeline | null = null;

      const build = () => {
        // The film's real length, read from the file — never hard-coded.
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
        tl
          // Still → film hand-off: 8% → 22%. The film is on its first frame
          // (identical to the still), so this reads as nothing more than the
          // image quietly gaining life.
          .fromTo(video, { opacity: 0 }, { opacity: 1, duration: 0.14, ease: "sine.inOut" }, 0.08)

          // The film's playhead: held on frame 0, then plays to the end.
          .fromTo(
            video,
            { currentTime: 0 },
            { currentTime: duration, duration: 1 - FILM_STARTS_MOVING, immediateRender: false },
            FILM_STARTS_MOVING,
          )

          // 1. Darkness recedes — in three tempos, then it rests.
          //    0–15%  deeply shadowed, barely changing
          //    15–45% the slow reveal: form, screening and foliage gain definition
          //    45–70% fully legible, settling into its final (still slightly moody) level
          .fromTo(veil, { opacity: VEIL_START }, { opacity: 0.8, duration: 0.15 }, 0)
          .fromTo(veil, { opacity: 0.8 }, { opacity: 0.4, duration: 0.3, immediateRender: false }, 0.15)
          .fromTo(
            veil,
            { opacity: 0.4 },
            { opacity: VEIL_END, duration: 0.25, ease: "sine.out", immediateRender: false },
            0.45,
          )

          // 2. Title dissolves out: 18% → 42%
          .fromTo(
            title,
            { opacity: 1, y: 0 },
            { opacity: 0, y: -6, duration: 0.24, ease: "sine.inOut" },
            0.18,
          )

          // 3. Statement arrives once the house has revealed itself: 72% → 84%,
          //    then leaves quietly: 90% → 96%. (Nothing essential sits in the last
          //    few percent, which some phone browsers cannot quite reach.)
          .fromTo(
            statement,
            { opacity: 0, y: 6 },
            { opacity: 1, y: 0, duration: 0.12, ease: "sine.out" },
            0.72,
          )
          .fromTo(
            statement,
            { opacity: 1 },
            { opacity: 0, duration: 0.06, ease: "sine.in", immediateRender: false },
            0.9,
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

    // ── Reduced motion: no scrubbing. The still, a light veil, all the text. ──
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(video, { opacity: 0 });
      gsap.set(veil, { opacity: 0.3 });
      gsap.set(title, { opacity: 1, y: 0 });
      gsap.set(statement, { opacity: 1, y: 0 });
    });

    return () => mm.revert();
  }, []);

  // The still and the film share this crop so the hand-off has no composition
  // jump. On phones the landscape image is cropped to a tall slice; 30% keeps the
  // near corner of the timber volume and a strip of sky in view.
  const mediaCrop = "object-cover object-[30%_50%] md:object-center";

  return (
    <section
      ref={sectionRef}
      // Total scroll distance. The visual is pinned for all but the first screen,
      // so the sequence plays over ~200vh on desktop and ~150vh on phones.
      // With reduced motion there is nothing to play, so the hero is one screen.
      className="relative h-[300vh] bg-background max-md:h-[250vh] motion-reduce:h-dvh motion-reduce:max-md:h-dvh"
    >
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        {/* Media boxes use the *large* viewport height (h-lvh) so their scale never
            changes when a phone's address bar slides away — the wrapper clips them. */}
        <div className="absolute inset-x-0 top-0 h-lvh w-full">
          <Image
            src={HERO_STILL}
            alt=""
            fill
            priority
            quality={85}
            sizes="100vw"
            className={mediaCrop}
          />
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
            className={`absolute inset-0 h-full w-full ${mediaCrop}`}
            style={{ opacity: 0 }}
          />
        </div>

        {/* The veil: darkness that recedes as you scroll. Starts dark via inline
            style so the very first paint (before JavaScript) is already dark. */}
        <div
          ref={veilRef}
          aria-hidden="true"
          className="absolute inset-0 bg-background"
          style={{ opacity: VEIL_START }}
        />

        {/* Typography. Title lower-left over the planting, never over the house.
            The location line sits as a small caption in the opposite corner on
            desktop (an annotation, not a subtitle) and under the title on phones.
            The title block and the statement share the same corner (one grid
            cell) because they are never visible together; with reduced motion
            both show, so the grid becomes a plain vertical stack. Phones sit the
            block higher so it stays on the dark planting, clear of the road. */}
        <div className="hero-copy absolute inset-x-0 bottom-0 grid px-[6vw] pb-[8vh] max-md:pb-[13vh] motion-reduce:block">
          <div ref={titleRef} className="[grid-area:1/1] self-end">
            <h1 className="font-serif text-[clamp(2.75rem,5.5vw,5.5rem)] uppercase leading-[0.94] tracking-[0.02em] text-foreground">
              Hidden
              <br />
              Foliage
            </h1>
            <p className="mt-4 font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:absolute md:right-[6vw] md:bottom-[8vh] md:mt-0">
              Berrima Road <span aria-hidden="true">·</span> Singapore
            </p>
          </div>

          <p
            ref={statementRef}
            className="[grid-area:1/1] max-w-[26ch] self-end font-serif text-[clamp(1.25rem,1.7vw,1.625rem)] italic leading-snug text-foreground/95 motion-reduce:mt-8"
            style={{ opacity: 0 }}
          >
            Architecture, concealed by nature.
          </p>
        </div>
      </div>
    </section>
  );
}
