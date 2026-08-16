// A quiet, consistent ending for the inner pages: wordmark, address, the
// marketing agencies (with their CEA licence numbers, as Singapore requires),
// and the artist's-impression note.

import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-stone/15 px-[6vw] py-[8vh]">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-serif text-lg uppercase tracking-[0.12em] text-foreground">Hidden Foliage</p>
          <p className="mt-2 font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs">
            Berrima Road <span aria-hidden="true">·</span> Dunearn Estate <span aria-hidden="true">·</span> Singapore
          </p>
        </div>
        <nav aria-label="Pages" className="flex gap-6">
          {[
            ["/", "Home"],
            ["/residence", "Residence"],
            ["/plans", "Plans"],
            ["/location", "Location"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone hover:text-foreground md:text-xs">
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="mt-10 max-w-[70ch] font-sans text-[0.6875rem] leading-relaxed text-stone/80">
        Marketed by SRI Pte Ltd (CEA licence L3010738A) and ERA Realty Network Pte Ltd (CEA licence L3002382K).
        Images are artist&rsquo;s impressions. Plans are diagrammatic and not to scale.
      </p>
    </footer>
  );
}
