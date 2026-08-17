// LOCATION — five chapters, in one arc: privacy · education · nature · city ·
// connectivity. The copy sells the life the address makes possible; the facts
// stay in the annotation line beneath, and every figure there is verified (the
// agency listing, or a public transit fact). Nothing is estimated.
//
// Photographs: `supplied: true` means the client provided the file, so no
// external credit is shown, only the subject where naming it helps. The two
// Creative Commons photographs keep their attribution and licence link.
// Swap any picture by replacing the file and pointing `src` at it.

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
    title: "A road that keeps to itself.",
    body:
      "Hedges lean in from both sides and the city goes quiet. Cars slow here without being asked, and the houses give nothing away.",
    fact: "Freehold · Berrima Road · Dunearn Estate, District 11",
    src: "/images/location/estate-road.jpg",
    alt: "A quiet road in the estate beneath a canopy of mature trees, contemporary houses set back behind hedges.",
    position: "50% 50%",
    credit: "Dunearn Estate",
  },
  {
    id: "schools",
    n: "02",
    kicker: "Education",
    title: "Old crests, short mornings.",
    body:
      "Uniforms cross the road before eight and are home again by mid-afternoon. Families here hand their schools down.",
    fact: "St Joseph's Institution nearby · Four more schools within 2 km",
    src: "/images/location/sji.jpg",
    alt: "The crest and lettering of St Joseph's Institution on the white curve of its façade.",
    position: "50% 50%",
    credit: "St Joseph's Institution",
  },
  {
    id: "gardens",
    n: "03",
    kicker: "Singapore Botanic Gardens",
    title: "The garden continues.",
    body:
      "Walk out after breakfast and the old trees take over where your own garden ends. By evening the Bandstand holds the last of the light.",
    fact: "15 min walk · UNESCO World Heritage Site",
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
    title: "Town when you want it.",
    body:
      "The glass canopies of Orchard are a short ride from the gate. You go in for dinner, and the crowds do not follow you home.",
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
    title: "Nothing is far from here.",
    body:
      "At dusk the city sits lit at the end of the road. Dinners downtown and weekends on the coast begin in the same driveway.",
    fact: "Stevens MRT 0.48 km · Downtown and Thomson–East Coast lines",
    src: "/images/location/expressway-dusk.jpg",
    alt: "An expressway at dusk, light trails curving away towards the lit towers of the city.",
    position: "50% 55%",
    credit: "Towards the city, at dusk",
  },
];
