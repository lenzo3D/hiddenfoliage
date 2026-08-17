// A quiet, consistent ending for the inner pages: the invitation to enquire,
// wordmark, address, page links, and the small print (see Colophon). The
// homepage ends with the Signature instead, which carries the enquiry itself.

import Link from "next/link";
import Colophon from "./Colophon";

const label = "font-sans text-[0.6875rem] uppercase tracking-[0.18em] md:text-xs";

export default function SiteFooter() {
  return (
    <footer className="border-t border-stone/15 px-[6vw] py-[8vh]">
      {/* The invitation, before the small print. */}
      <div className="mb-[8vh] flex flex-col gap-6 md:flex-row md:items-baseline md:justify-between">
        <p className="max-w-[22ch] font-serif text-[clamp(1.25rem,1.7vw,1.625rem)] italic leading-snug text-foreground/95">
          Private viewings by appointment.
        </p>
        <Link href="/#enquire" className={`${label} text-foreground/90 transition-colors hover:text-foreground`}>
          Enquire <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-serif text-lg uppercase tracking-[0.12em] text-foreground">Hidden Foliage</p>
          <p className={`mt-2 text-stone ${label}`}>
            Berrima Road <span aria-hidden="true">·</span> Dunearn Estate <span aria-hidden="true">·</span> Singapore
          </p>
        </div>
        <nav aria-label="Pages" className="flex flex-wrap gap-6">
          {[
            ["/", "Home"],
            ["/residence", "Residence"],
            ["/plans", "Plans"],
            ["/location", "Location"],
          ].map(([href, text]) => (
            <Link key={href} href={href} className={`${label} text-stone transition-colors hover:text-foreground`}>
              {text}
            </Link>
          ))}
        </nav>
      </div>
      <Colophon className="mt-10" />
    </footer>
  );
}
