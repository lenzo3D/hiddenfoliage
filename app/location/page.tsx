// LOCATION — Berrima Road and its Singapore context. One refined map, the
// address and area in a few lines, and only the destinations that matter.

import type { Metadata } from "next";
import LocationMap from "@/components/LocationMap";
import MapFrame from "@/components/MapFrame";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import { DIRECTIONS_URL, MAPS_URL } from "@/components/site";

export const metadata: Metadata = {
  title: "Location",
  description:
    "Berrima Road, Dunearn Estate, District 11: a landed enclave north of Dunearn Road, a seven-minute walk from Stevens MRT and twelve from the Botanic Gardens.",
};

const NEAR: [string, string, string][] = [
  ["Stevens MRT", "Downtown · Thomson–East Coast lines", "0.5 km · 7 min walk"],
  ["Botanic Gardens MRT", "Circle · Downtown lines", "1 km · 12 min walk"],
  ["Singapore Botanic Gardens", "UNESCO World Heritage Site", "15 min walk"],
  ["Orchard Road", "", "approx. 8 min drive"],
  ["Central Business District", "Marina Bay", "approx. 15 min drive"],
  ["Changi Airport", "via the PIE", "approx. 20 min drive"],
];

const SCHOOLS = ["Anglo-Chinese School (Primary)", "Singapore Chinese Girls' Primary School", "Nanyang Primary School", "Raffles Girls' Primary School"];

export default function LocationPage() {
  return (
    <main id="content" className="bg-background text-foreground">
      <section className="px-[6vw] pb-[10vh] pt-[22vh] md:pt-[26vh]">
        <p className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs">Location</p>
        <h1 className="mt-8 max-w-[18ch] font-serif text-[clamp(2rem,4.4vw,4.25rem)] uppercase leading-[1.04] tracking-[0.02em] md:mt-10">
          Dunearn Estate, District 11.
        </h1>
        <p className="mt-8 max-w-[52ch] font-sans text-sm leading-relaxed text-stone md:text-[0.9375rem]">
          Berrima Road is a short, quiet loop of landed houses just north of Dunearn Road, between Adam Road and
          Stevens Road — one of the city&rsquo;s most established residential enclaves, with the Botanic Gardens
          a walk away and Orchard Road a few minutes by car.
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
          <p className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs">Nearby</p>
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
          <p className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs">Schools within 2 km</p>
          <ul className="mt-6 space-y-3">
            {SCHOOLS.map((s) => (
              <li key={s} className="font-sans text-sm text-foreground/90 md:text-[0.9375rem]">
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-[36ch] font-sans text-[0.6875rem] leading-relaxed text-stone/80">
            Walking times measured from Berrima Road; drive times are typical off-peak estimates. The map is a
            diagram, not a survey.
          </p>
        </div>
      </section>

      <div className="pb-[12vh] md:pb-[16vh]" />
      <SiteFooter />
    </main>
  );
}
