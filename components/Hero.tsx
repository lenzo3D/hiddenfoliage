"use client";

// HOME hero — one viewport. The film plays once on arrival and holds its
// last frame; a dark veil lifts as it begins, and the title fades up once.
// No pin, no scrubbing: the page scrolls straight past into the next section.
// Reduced motion: the still, the veil at rest, all text visible.

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

// The film: 2560×1440, 4.9 s, no audio — from the client's 4K master
// (`video1-hero (1).mp4`). The still is frame 0 of the same master, so the
// hand-off from still to film is invisible while the film loads.
const HERO_STILL = "/images/hero-still.jpg";
const HERO_VIDEO = "/videos/video1-hero-1440.mp4";
// Portrait crop straight from the 4K master (1000x2160, the 30% window a
// phone actually shows) — near-1:1 on a 3x screen instead of a 1.76x stretch.
const HERO_VIDEO_PHONE = "/videos/video1-hero-phone.mp4";

// Where the veil rests once the film is playing — dark enough to hold the
// title, light enough to let the architecture carry the frame.
const TINT_REST = 0.24;

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const veil = veilRef.current;
    const copy = copyRef.current;
    if (!video || !veil || !copy) return;

    if (window.matchMedia("(max-width: 767px)").matches) {
      video.src = HERO_VIDEO_PHONE; // pre-cropped: plays centred
      video.className = "absolute inset-0 h-full w-full object-cover object-center motion-reduce:hidden";
      video.load();
    }

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline();
      tl.fromTo(veil, { opacity: 1 }, { opacity: TINT_REST, duration: 1.8, ease: "power2.out", delay: 0.2 });
      tl.fromTo(copy, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.1, ease: "sine.out" }, 0.7);
      const p = video.play(); // plays once; no loop — the last frame holds
      if (p) p.catch(() => {}); // autoplay refused → the still carries the frame
      return () => {
        tl.kill();
        if (!video.paused) video.pause();
      };
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(veil, { opacity: TINT_REST });
      gsap.set(copy, { opacity: 1, y: 0 });
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="relative h-dvh bg-background">
      <div className="absolute inset-0 overflow-hidden">
        {/* Media sized to the large viewport so a phone's address bar never rescales it. */}
        <div className="absolute inset-x-0 top-0 h-lvh w-full">
          <Image
            src={HERO_STILL}
            alt="Hidden Foliage from Berrima Road: the timber-screened house behind its planting."
            fill
            priority
            quality={85}
            sizes="(orientation: portrait) 178vh, 100vw"
            className="object-cover object-[30%_50%] md:object-center"
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
            className="absolute inset-0 h-full w-full object-cover object-[30%_50%] motion-reduce:hidden md:object-center"
          />
        </div>

        {/* The veil: dark on first paint (inline style, before JavaScript), lifting once. */}
        <div ref={veilRef} aria-hidden="true" className="absolute inset-0 bg-background" style={{ opacity: 1 }} />

        {/* Title lower-left over the planting. Name, one line, two facts — nothing else. */}
        <div ref={copyRef} className="absolute inset-x-0 bottom-0 px-[6vw] pb-[8vh] max-md:pb-[12vh]" style={{ opacity: 0 }}>
          <h1 className="font-serif text-[clamp(2.75rem,5.5vw,5.5rem)] uppercase leading-[0.94] tracking-[0.02em] text-foreground">
            Hidden
            <br />
            Foliage
          </h1>
          <p className="mt-5 font-serif text-[clamp(1.125rem,1.5vw,1.5rem)] italic leading-snug text-foreground/95">
            A private expression of tropical living.
          </p>
          <p className="mt-6 font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs">
            Berrima Road <span aria-hidden="true">·</span> Dunearn Estate
          </p>
          <p className="mt-2 font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone/80 md:text-xs">
            Freehold detached residence
          </p>
        </div>
      </div>
    </section>
  );
}
