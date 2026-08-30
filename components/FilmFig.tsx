"use client";

// A Fig that carries a short film instead of a still — same composition,
// caption and credit as Editorial's Fig, same behaviour as the site's other
// film (the hero): the clip plays once when it comes into view and holds its
// last frame. It pauses while off screen and never loops or scrubs.
// Reduced motion: the matching still, nothing plays.

import { useEffect, useRef } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import Credit from "./Credit";
import { label } from "./Editorial";

export default function FilmFig({
  src,
  phoneSrc,
  still,
  alt,
  caption,
  offset = "right",
  aspect = "aspect-[4/3] md:aspect-[16/9]",
  crop = "object-center",
  className = "",
}: {
  src: string;
  /** Portrait crop of the same film, pre-cut to the phone's visible window so
      a narrow screen decodes full resolution instead of cropping a wide frame. */
  phoneSrc?: string;
  still: string;
  alt: string;
  caption: string;
  offset?: "right" | "left" | "full";
  aspect?: string;
  crop?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (phoneSrc && window.matchMedia("(max-width: 767px)").matches) {
      // The pre-cropped file bakes the framing in, so it plays centred.
      video.src = phoneSrc;
      video.classList.remove(...video.classList);
      video.className = "absolute inset-0 h-full w-full object-cover object-center motion-reduce:hidden";
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Load in full when one screen away; play once at a third visible; pause
    // while entirely off screen. Once ended, the last frame simply holds.
    const near = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          video.preload = "auto";
          video.load();
          near.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    const view = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.35 && !video.ended) {
          const p = video.play();
          if (p) p.catch(() => {}); // autoplay refused → the poster holds the frame
        } else if (!e.isIntersecting && !video.paused) {
          video.pause();
        }
      },
      { threshold: [0, 0.35] },
    );
    near.observe(video);
    view.observe(video);
    return () => {
      near.disconnect();
      view.disconnect();
      if (!video.paused) video.pause();
    };
  }, [phoneSrc]);

  const off = offset === "right" ? "md:ml-[22vw]" : offset === "left" ? "md:mr-[22vw]" : "";
  const capPad = offset === "right" ? "px-[6vw] md:px-0" : "px-[6vw]";

  return (
    <figure className={`${off} ${className}`}>
      <Reveal>
        <div className={`relative w-full overflow-hidden ${aspect}`}>
          <video
            ref={videoRef}
            src={src}
            poster={still}
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
            className={`absolute inset-0 h-full w-full object-cover motion-reduce:hidden ${crop}`}
          />
          <Image src={still} alt={alt} fill sizes="(min-width: 768px) 78vw, 100vw" quality={85} className={`hidden object-cover motion-reduce:block ${crop}`} />
        </div>
      </Reveal>
      <figcaption className={`mt-4 ${capPad}`}>
        <span className={label}>{caption}</span>
        <Credit className="mt-1" />
      </figcaption>
    </figure>
  );
}
