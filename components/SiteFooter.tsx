// A quiet, consistent ending for the inner pages: wordmark, address, page links,
// and the small print (see Colophon). The homepage ends with the Signature
// instead, which carries the same small print.

import Link from "next/link";
import Colophon from "./Colophon";

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
      <Colophon className="mt-10" />
    </footer>
  );
}
