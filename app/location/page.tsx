// LOCATION — told in five chapters, like the film: privacy · education ·
// nature · the city · connectivity. A short intro, the sequence
// (LocationStory), then the practical part: the verified distances and Google
// Maps itself. No schematic map: a drawn map of the district could not be made
// accurately here, and a real map does the job better.

import type { Metadata } from "next";
import LocationStory from "@/components/LocationStory";
import SiteFooter from "@/components/SiteFooter";
import { DIRECTIONS_URL, MAPS_URL } from "@/components/site";

export const metadata: Metadata = {
  title: "Location",
  description:
    "Berrima Road, Dunearn Estate, District 11. Stevens MRT is a seven-minute walk, the Botanic Gardens fifteen, and four of Singapore's most respected schools are within two kilometres.",
};

// Distances and walking times: from the agency listing.
// Driving times: routed on the real road network (OSRM) from 23 Berrima Road and
// rounded up to allow for junctions, so they read as off-peak estimates rather
// than best cases. Distances behind them: Orchard 3.3 km, the PIE at Adam Road
// 2.5 km, Raffles Place 7.8 km, Changi Terminal 3 22.8 km. Confirm against
// Google Maps before publication and adjust here (docs/CONTENT-NEEDED.md).
const BY_CAR: [string, string][] = [
  ["Orchard Road", "Approx. 10 min"],
  ["Pan Island Expressway (PIE)", "Approx. 5 min"],
  ["Marina Bay / CBD", "Approx. 15 min"],
  ["Changi Airport", "Approx. 25 min"],
];

const ON_FOOT: [string, string, string][] = [
  ["Stevens MRT", "Downtown · Thomson–East Coast lines", "0.5 km · 7 min walk"],
  ["Botanic Gardens MRT", "Circle · Downtown lines", "1 km · 12 min walk"],
  ["Singapore Botanic Gardens", "UNESCO World Heritage Site", "15 min walk"],
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

      {/* The practical part: how the address is used, then the map */}
      <section className="px-[6vw] pt-[16vh] md:grid md:grid-cols-12 md:gap-[4vw] md:pt-[22vh]">
        <div className="md:col-span-7">
          <p className={label}>Minutes from the city</p>

          {/* By car */}
          <p className={`mt-10 text-foreground/80 md:mt-12 ${label}`}>By car</p>
          <dl className="mt-6">
            {BY_CAR.map(([name, mins]) => (
              <div key={name} className="flex items-baseline justify-between gap-6 border-b border-stone/15 py-4">
                <dt className="font-sans text-sm text-foreground md:text-[0.9375rem]">{name}</dt>
                <dd className={`whitespace-nowrap text-right ${label}`}>{mins}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 font-sans text-[0.6875rem] leading-relaxed text-stone/80">
            Driving times are approximate and vary with traffic conditions.
          </p>

          {/* On foot */}
          <p className={`mt-14 text-foreground/80 md:mt-16 ${label}`}>On foot</p>
          <dl className="mt-6">
            {ON_FOOT.map(([name, sub, dist]) => (
              <div key={name} className="flex items-baseline justify-between gap-6 border-b border-stone/15 py-4">
                <dt>
                  <span className="font-sans text-sm text-foreground md:text-[0.9375rem]">{name}</span>
                  {sub && <span className={`ml-3 hidden md:inline ${label}`}>{sub}</span>}
                </dt>
                <dd className={`whitespace-nowrap text-right ${label}`}>{dist}</dd>
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

          {/* The residence on the map */}
          <p className={`mt-14 md:mt-16 ${label}`}>On the map</p>
          <p className="mt-6 font-sans text-sm leading-relaxed text-foreground/90 md:text-[0.9375rem]">
            23 Berrima Road
            <br />
            Singapore 299919
          </p>
          <p className="mt-6 flex flex-col gap-3">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className={linkCls}>
              View on Google Maps <span aria-hidden="true">↗</span>
            </a>
            <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className={linkCls}>
              Get directions <span aria-hidden="true">↗</span>
            </a>
          </p>

          <p className="mt-12 max-w-[36ch] font-sans text-[0.6875rem] leading-relaxed text-stone/80">
            Distances and walking times as given in the agency listing. Photographs of the surrounding area show the
            places named beneath them, not the residence.
          </p>
        </div>
      </section>

      <div className="pb-[12vh] md:pb-[16vh]" />
      <SiteFooter />
    </main>
  );
}
