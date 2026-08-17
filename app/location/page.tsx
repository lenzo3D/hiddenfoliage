// LOCATION — told in five chapters, like the film: a private world · the
// schools · the Gardens · Orchard Road · the routes out. A restrained intro,
// the cinematic sequence (LocationStory), then the geographic overview: the
// schematic map, the verified distances, the schools, and Google Maps for the
// real thing. Only figures that can be verified are printed.

import type { Metadata } from "next";
import LocationStory from "@/components/LocationStory";
import LocationMap from "@/components/LocationMap";
import MapFrame from "@/components/MapFrame";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import { DIRECTIONS_URL, MAPS_URL } from "@/components/site";

export const metadata: Metadata = {
  title: "Location",
  description:
    "Berrima Road, Dunearn Estate, District 11: a quiet landed enclave north of Dunearn Road — Stevens MRT a seven-minute walk, the Botanic Gardens fifteen, four of Singapore's most respected schools within two kilometres, Orchard Road and the Pan Island Expressway close at hand.",
};

// Verified — the agency listing and public transit facts. No drive times: none
// have been verified yet (docs/CONTENT-NEEDED.md).
const NEAR: [string, string, string][] = [
  ["Stevens MRT", "Downtown · Thomson–East Coast lines", "0.5 km · 7 min walk"],
  ["Botanic Gardens MRT", "Circle · Downtown lines", "1 km · 12 min walk"],
  ["Singapore Botanic Gardens", "UNESCO World Heritage Site", "15 min walk"],
  ["Orchard Road", "Thomson–East Coast line from Stevens", "3 stops"],
  ["Pan Island Expressway", "via Adam Road", "west to Jurong · east to Changi"],
];

const SCHOOLS = ["Anglo-Chinese School (Primary)", "Singapore Chinese Girls' Primary School", "Nanyang Primary School", "Raffles Girls' Primary School"];

const label = "font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs";

export default function LocationPage() {
  return (
    <main id="content" className="bg-background text-foreground">
      {/* Intro — restrained */}
      <section className="px-[6vw] pb-[12vh] pt-[22vh] md:pb-[14vh] md:pt-[26vh]">
        <p className={label}>Location</p>
        <h1 className="mt-8 max-w-[16ch] font-serif text-[clamp(2rem,4.4vw,4.25rem)] uppercase leading-[1.04] tracking-[0.02em] md:mt-10">
          Secluded by nature. Connected to Singapore.
        </h1>
        <p className="mt-8 max-w-[52ch] font-sans text-sm leading-relaxed text-stone md:text-[0.9375rem]">
          A rare balance of privacy, greenery and proximity to the places that define everyday life in the city.
          Private when you want it; connected when you need it.
        </p>
        <p className={`mt-8 ${label}`}>
          Berrima Road <span aria-hidden="true">·</span> Dunearn Estate <span aria-hidden="true">·</span> District 11
        </p>
      </section>

      {/* The five chapters */}
      <LocationStory />

      {/* Overview — the map, the verified distances, the real map */}
      <section className="px-[6vw] pb-[8vh] pt-[16vh] md:pt-[22vh]">
        <p className={label}>Overview</p>
        <p className="mt-6 max-w-[22ch] font-serif text-[clamp(1.5rem,2.4vw,2.25rem)] italic leading-snug text-foreground/95 md:mt-8">
          Between Adam Road and Stevens Road, north of Dunearn Road.
        </p>
      </section>
      <section className="px-[3vw] md:px-[6vw]">
        <Reveal>
          <MapFrame>
            <LocationMap />
          </MapFrame>
        </Reveal>
        {/* The real map, one tap away — the schematic is for understanding, this is for going. */}
        <p className="mt-6 flex flex-wrap gap-x-8 gap-y-3 px-[3vw] md:mt-8 md:px-0">
          {[
            [MAPS_URL, "Open in Google Maps"],
            [DIRECTIONS_URL, "Directions to Berrima Road"],
          ].map(([href, text]) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-foreground/90 transition-colors hover:text-foreground md:text-xs"
            >
              {text} <span aria-hidden="true">→</span>
            </a>
          ))}
        </p>
      </section>

      <section className="px-[6vw] pt-[12vh] md:grid md:grid-cols-12 md:gap-[4vw] md:pt-[16vh]">
        <div className="md:col-span-7">
          <p className={label}>Nearby</p>
          <dl className="mt-6">
            {NEAR.map(([name, sub, dist]) => (
              <div key={name} className="flex items-baseline justify-between gap-6 border-b border-stone/15 py-4">
                <dt>
                  <span className="font-sans text-sm text-foreground md:text-[0.9375rem]">{name}</span>
                  {sub && <span className="ml-3 hidden font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:inline">{sub}</span>}
                </dt>
                <dd className="whitespace-nowrap text-right font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs">{dist}</dd>
              </div>
            ))}
          </dl>
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
          <p className="mt-10 max-w-[36ch] font-sans text-[0.6875rem] leading-relaxed text-stone/80">
            Distances and walking times as given in the agency listing. The map and diagrams are schematic, not
            surveys. Drive times are not quoted until verified.
          </p>
        </div>
      </section>

      <div className="pb-[12vh] md:pb-[16vh]" />
      <SiteFooter />
    </main>
  );
}
