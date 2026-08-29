// The site's one editorial module, used by Home and Residence (Location set
// the grammar): eyebrow → headline → one supporting line → one fact line →
// large visual. Not every section uses every element; the order never changes.
//
// Three compositions only:
//   <SectionIntro>              text-led introduction, left aligned
//   <Fig offset="right|left">   large image, offset into the page
//   <Fig offset="full">         full-bleed image with a restrained caption
// Anything else (the schedule, the data grid) is plain typography in the page.

import Image from "next/image";
import Reveal from "./Reveal";
import Credit from "./Credit";

export const label = "font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs";
export const factCls = "font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone/80 md:text-xs";
export const bodyCls = "font-sans text-sm leading-relaxed text-stone md:text-[0.9375rem]";
export const h2Cls = "font-serif text-[clamp(1.75rem,3vw,3rem)] uppercase leading-[1.06] tracking-[0.02em] text-foreground";

export function SectionIntro({
  eyebrow,
  title,
  body,
  fact,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  fact?: string;
}) {
  return (
    <div className="px-[6vw]">
      <p className={label}>{eyebrow}</p>
      <h2 className={`mt-6 max-w-[24ch] md:mt-8 ${h2Cls}`}>{title}</h2>
      {body && <p className={`mt-6 max-w-[46ch] ${bodyCls}`}>{body}</p>}
      {fact && <p className={`mt-8 ${factCls}`}>{fact}</p>}
    </div>
  );
}

export function Fig({
  src,
  alt,
  caption,
  offset = "right",
  aspect = "aspect-[4/5] md:aspect-[16/9]",
  // Cover-crop aware: on phones the box is taller than the image, so the
  // drawn width is ~1.75x the viewport; 175vw makes the optimizer serve the
  // 2048w variant on a 3x screen instead of a soft 1200w one.
  sizes = "(min-width: 768px) 78vw, 175vw",
  position,
  imgClassName = "",
  priority,
  className = "",
}: {
  src: string;
  alt: string;
  caption: string;
  offset?: "right" | "left" | "full" | "none";
  aspect?: string;
  sizes?: string;
  position?: string;
  imgClassName?: string;
  priority?: boolean;
  className?: string;
}) {
  const off = offset === "right" ? "md:ml-[22vw]" : offset === "left" ? "md:mr-[22vw]" : "";
  // Captions sit on the image's leading edge: page padding on phones, the
  // image edge itself when the figure is offset from the left.
  const capPad = offset === "right" ? "px-[6vw] md:px-0" : "px-[6vw]";
  return (
    <figure className={`${off} ${className}`}>
      <Reveal>
        <div className={`relative w-full overflow-hidden ${aspect}`}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            quality={85}
            priority={priority}
            className={`object-cover ${imgClassName}`}
            style={position ? { objectPosition: position } : undefined}
          />
        </div>
      </Reveal>
      <figcaption className={`mt-4 ${capPad}`}>
        <span className={label}>{caption}</span>
        <Credit className="mt-1" />
      </figcaption>
    </figure>
  );
}
