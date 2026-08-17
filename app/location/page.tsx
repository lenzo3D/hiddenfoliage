// LOCATION — told in five chapters, like the film: privacy · education ·
// nature · the city · connectivity. A short intro, the sequence
// (LocationStory), then the practical part: the verified distances and Google
// Maps itself. No schematic map: a drawn map of the district could not be made
// accurately here, and a real map does the job better.

import type { Metadata } from "next";
import LocationStory from "@/components/LocationStory";
import SiteFooter from "@/components/SiteFooter";
import { DIRECTIONS_URL, MAPS_QUERY, MAPS_URL } from "@/components/site";

export const metadata: Metadata = {
  title: "Location",
  description:
    "Berrima Road, Dunearn Estate, District 11. Stevens MRT is a seven-minute walk, the Botanic Gardens fifteen, and four of Singapore's most respected schools are within two kilometres.",
};

// Verified: the agency listing, and public transit facts. No drive times are
// quoted, because none have been verified (see docs/CONTENT-NEEDED.md).
const NEAR: [string, string, string][] = [
  ["Stevens MRT", "Downtown · Thomson–East Coast lines", "0.5 km · 7 min walk"],
  ["Botanic Gardens MRT", "Circle · Downtown lines", "1 km · 12 min walk"],
  ["Singapore Botanic Gardens", "UNESCO World Heritage Site", "15 min walk"],
  ["Orchard Road", "Thomson–East Coast line from Stevens", "3 stops"],
  ["Pan Island Expressway", "via Adam Road", "west to Jurong · east to Changi"],
];

const SCHOOLS = ["Anglo-Chinese School (Primary)", "Singapore Chinese Girls' Primary School", "Nanyang Primary School", "Raffles Girls' Primary School"];

const label = "font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs";
const linkCls = "font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-foreground/90 transition-colors hover:text-foreground md:text-xs";

export default function LocationPage() {
  return (
    <main id="content" className="bg-background text-foreground">
      {/* Intro */}
      <section className="px-[6vw] pb-[12vh] pt-[22vh] md:pb-[14vh] md:pt-[26vh]">
        <p className={label}>Location</p>
        <h1 className="mt-8 max-w-[16ch] font-serif text-[clamp(2rem,4.4vw,4.25rem)] uppercase leading-[1.04] tracking-[0.02em] md:mt-10">
          Secluded by nature. Connected to Singapore.
        </h1>
        <p className="mt-8 max-w-[52ch] font-sans text-sm leading-relaxed text-stone md:text-[0.9375rem]">
          A short road of large houses in Dunearn Estate. The Botanic Gardens are a walk away, the schools that
          families here have used for generations are close, and town is a few minutes when you want it.
        </p>
        <p className={`mt-8 ${label}`}>
          23 Berrima Road <span aria-hidden="true">·</span> Dunearn Estate <span aria-hidden="true">·</span> District 11
        </p>
      </section>

      {/* The five chapters */}
      <LocationStory />

      {/* The practical part: distances, then the real map */}
      <section className="px-[6vw] pt-[16vh] md:grid md:grid-cols-12 md:gap-[4vw] md:pt-[22vh]">
        <div className="md:col-span-7">
          <p className={label}>Nearby</p>
          <dl className="mt-6">
            {NEAR.map(([name, sub, dist]) => (
              <div key={name} className="flex items-baseline justify-between gap-6 border-b border-stone/15 py-4">
                <dt>
                  <span className="font-sans text-sm text-foreground md:text-[0.9375rem]">{name}</span>
                  {sub && <span className={`ml-3 hidden md:inline ${label}`}>{sub}</span>}
                </dt>
                <dd className={`whitespace-nowrap text-right ${label}`}>{dist}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 max-w-[52ch] font-sans text-[0.6875rem] leading-relaxed text-stone/80">
            Distances and walking times as given in the agency listing. Drive times are not quoted until they have been
            checked. Photographs on this page are of the places named beneath them, not of the residence.
          </p>
        </div>

        <div className="mt-[10vh] md:col-span-4 md:col-start-9 md:mt-0">
          <p className={label}>Schools within 2 km</p>
          <ul className="mt-6 space-y-3">
            {SCHOOLS.map((s) => (
              <li key={s} className="font-sans text-sm text-foreground/90 md:text-[0.9375rem]">
                {s}
              </li>
            ))}
          </ul>

          <p className={`mt-12 ${label}`}>On the map</p>
          <p className="mt-6 font-sans text-sm leading-relaxed text-stone md:text-[0.9375rem]">
            {MAPS_QUERY}
          </p>
          <p className="mt-6 flex flex-col gap-3">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className={linkCls}>
              Open in Google Maps <span aria-hidden="true">→</span>
            </a>
            <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className={linkCls}>
              Directions <span aria-hidden="true">→</span>
            </a>
          </p>
        </div>
      </section>

      <div className="pb-[12vh] md:pb-[16vh]" />
      <SiteFooter />
    </main>
  );
}
