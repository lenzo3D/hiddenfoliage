// LOCATION — five chapters, in one arc: privacy · education · nature · city ·
// connectivity. The copy below is the client's approved wording, used verbatim:
// do not rewrite it. Images, crops, credits and the animation are unchanged.
//
// Photographs: `credit` without `creditUrl` names the subject only — used for the
// files the client supplied. The two Creative Commons photographs keep their
// attribution and licence link. Swap a picture by replacing the file and
// pointing `src` at it.

export type Chapter = {
  id: string;
  n: string;
  kicker: string; // the short category label
  title: string; // the editorial headline
  body: string; // one or two short sentences
  fact?: string; // optional understated factual line
  src: string;
  alt: string;
  position?: string; // object-position for the plate crop
  credit?: string; // subject, and photographer where attribution is required
  creditUrl?: string;
};

export const CHAPTERS: Chapter[] = [
  {
    id: "estate",
    n: "01",
    kicker: "The Estate",
    title: "THE LUXURY OF QUIET.",
    body:
      "A discreet landed enclave shaped by mature greenery, generous plots and quiet residential streets — a rare sense of calm within the city.",
    fact: "BERRIMA ROAD · DUNEARN ESTATE · DISTRICT 11",
    src: "/images/location/estate-road.jpg",
    alt: "A quiet road in the estate beneath a canopy of mature trees, contemporary houses set back behind hedges.",
    position: "50% 50%",
    credit: "Dunearn Estate",
  },
  {
    id: "schools",
    n: "02",
    kicker: "Education",
    title: "AMONG SINGAPORE’S MOST ESTABLISHED SCHOOLS.",
    body:
      "A distinguished collection of schools lies within the immediate neighbourhood, placing some of the country’s most sought-after education close to home.",
    fact: "WITHIN 2 KM · ACS (PRIMARY) · SCGS · NANYANG PRIMARY · RAFFLES GIRLS’ PRIMARY",
    src: "/images/location/sji.jpg",
    alt: "The crest and lettering of St Joseph's Institution on the white curve of its façade.",
    position: "50% 50%",
    credit: "St Joseph's Institution",
  },
  {
    id: "gardens",
    n: "03",
    kicker: "Singapore Botanic Gardens",
    title: "A WORLD HERITAGE GARDEN, CLOSE TO HOME.",
    body:
      "The Singapore Botanic Gardens brings 82 hectares of heritage landscape, tropical greenery and open space within easy reach of the residence.",
    fact: "15 MIN WALK · UNESCO WORLD HERITAGE SITE",
    src: "/images/location/gardens.jpg",
    alt: "The bandstand at the Singapore Botanic Gardens in low evening light, beneath mature trees.",
    position: "50% 45%",
    credit: "Singapore Botanic Gardens — Mokkie · CC BY-SA 4.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Bandstand_at_Singapore_Botanic_Gardens.jpg",
  },
  {
    id: "orchard",
    n: "04",
    kicker: "Orchard Road",
    title: "ORCHARD ROAD, MINUTES AWAY.",
    body:
      "Singapore’s premier destination for luxury retail, dining and hospitality sits just beyond the neighbourhood — close enough for convenience, removed enough for privacy.",
    fact: "ION ORCHARD · PARAGON · TAKASHIMAYA · ORCHARD ROAD",
    src: "/images/location/orchard-ion.jpg",
    alt: "The glass and steel canopy of ION Orchard above its luxury shopfronts on Orchard Road.",
    position: "50% 55%",
    credit: "ION Orchard — Diego Delso · CC BY-SA 4.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Ion_Orchard_Link,_Singapur,_2023-08-18,_DD_06.jpg",
  },
  {
    id: "connect",
    n: "05",
    kicker: "Connectivity",
    title: "PERFECTLY PLACED FOR THE CITY.",
    body:
      "With Bukit Timah Road, Dunearn Road, the PIE and Stevens MRT close by, the address enjoys direct connections to the city and across Singapore.",
    fact: "PIE · BUKIT TIMAH ROAD · DUNEARN ROAD · STEVENS MRT",
    src: "/images/location/expressway-dusk.jpg",
    alt: "An expressway at dusk, light trails curving away towards the lit towers of the city.",
    position: "50% 55%",
    credit: "Towards the city, at dusk",
  },
];
