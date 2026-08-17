// LOCATION — the five chapters. Every figure quoted is verified (the agency
// listing, or a public transit fact); nothing is estimated. Each chapter carries
// a real photograph, credited beneath the plate with the exact subject — the
// captions never imply a photograph is of the house or of Berrima Road itself.
// Replace any file in public/images/location/ (same name) to swap a picture.

export type Chapter = {
  id: string;
  n: string;
  kicker: string; // annotation: the place
  title: string; // the headline
  body: string;
  fact: string; // verified annotation line
  src: string;
  alt: string;
  position?: string; // object-position for the plate crop
  credit: string; // exactly what the photograph shows, and by whom
  creditUrl: string;
};

export const CHAPTERS: Chapter[] = [
  {
    id: "estate",
    n: "01",
    kicker: "Dunearn Estate",
    title: "Off the main road.",
    body:
      "The estate lies north of Dunearn Road. Large houses stand well back under mature trees, the roads are short loops rather than through-routes, and the traffic stays on Dunearn.",
    fact: "Berrima Road · Dunearn Estate · District 11",
    src: "/images/location/estate-dalvey.jpg",
    alt: "A colonnaded house on a rise above a lawn, mature trees on either side, in Singapore's Tanglin district.",
    position: "50% 40%",
    credit: "Dalvey Hill, Tanglin — Wzhkevin · CC BY-SA 4.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Dalvey_Hill_1_-_2022-11-19.jpg",
  },
  {
    id: "schools",
    n: "02",
    kicker: "The schools",
    title: "Within two kilometres.",
    body:
      "Anglo-Chinese School (Primary), Singapore Chinese Girls' School, Nanyang Primary and Raffles Girls' Primary are all within two kilometres of the house. St Joseph's Institution is a short drive north.",
    fact: "Within 2 km · ACS (Primary) · SCGS · Nanyang Primary · Raffles Girls' Primary",
    src: "/images/location/schools.jpg",
    alt: "The white campus buildings of St Joseph's Institution across a playing field.",
    position: "50% 45%",
    credit: "St Joseph's Institution (Independent), Thomson Road — Desaccointier · CC BY-SA 4.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:SJI_Independent_Campus.jpg",
  },
  {
    id: "gardens",
    n: "03",
    kicker: "Singapore Botanic Gardens",
    title: "The Gardens, on foot.",
    body:
      "The Botanic Gardens are a fifteen-minute walk from the door: near enough for a run before breakfast, or an hour under the heritage trees at the end of the day.",
    fact: "UNESCO World Heritage Site · 15 min walk · Botanic Gardens MRT 1 km",
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
    title: "Three stops away.",
    body:
      "Orchard Road is three stops from Stevens MRT on the Thomson–East Coast Line, or a drive down Bukit Timah Road. ION Orchard, Paragon and Takashimaya are all on it, with the hotels between them.",
    fact: "Stevens MRT · 0.5 km · 7 min walk · Downtown & Thomson–East Coast lines",
    src: "/images/location/orchard-ion.jpg",
    alt: "The glass and steel canopy of ION Orchard above its luxury shopfronts on Orchard Road.",
    position: "50% 55%",
    credit: "ION Orchard — Diego Delso · CC BY-SA 4.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Ion_Orchard_Link,_Singapur,_2023-08-18,_DD_06.jpg",
  },
  {
    id: "connect",
    n: "05",
    kicker: "The routes out",
    title: "Adam Road to the PIE.",
    body:
      "Adam Road leads to the Pan Island Expressway, which runs west towards Jurong and east towards Changi. Bukit Timah and Dunearn Roads run into town.",
    fact: "Pan Island Expressway via Adam Road · Bukit Timah Road · Dunearn Road",
    src: "/images/location/expressway.jpg",
    alt: "The Pan Island Expressway, several lanes wide and lined with trees.",
    position: "50% 55%",
    credit: "Pan Island Expressway — LN9267 · CC BY-SA 4.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Pan_Island_Expressway_05-12-2024(20).jpg",
  },
];
