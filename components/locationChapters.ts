// LOCATION — the five chapters. Copy is restrained and every figure quoted is
// verified (the agency listing, or a public fact); anything unverified is left
// out rather than estimated. Photographs are CC-licensed (Wikimedia Commons)
// and credited beneath the plate — replace with commissioned photography when
// it exists (docs/CONTENT-NEEDED.md). Where no photograph good enough for this
// site could be sourced, the chapter uses a diagram drawn in the site's own
// line language instead of weak filler.

export type Visual =
  | { kind: "photo"; src: string; alt: string; position?: string; credit: string; creditUrl: string }
  | { kind: "diagram"; diagram: "schools" | "routes"; alt: string };

export type Chapter = {
  id: string;
  n: string; // "01"
  kicker: string; // the amenity, as an annotation
  title: string; // the headline
  body: string;
  fact: string; // verified annotation line
  visual: Visual;
};

export const CHAPTERS: Chapter[] = [
  {
    id: "estate",
    n: "01",
    kicker: "Tranquil, exclusive estate",
    title: "A private world.",
    body:
      "A rare residential enclave north of Dunearn Road: mature trees over quiet loops of road, low-rise houses set back in their gardens, and the sense — a few minutes from town — of having left it.",
    fact: "Berrima Road · Dunearn Estate · District 11",
    visual: {
      kind: "photo",
      src: "/images/location/estate.jpg",
      alt: "A quiet, tree-lined residential road in Bukit Timah, houses set back behind their gardens.",
      position: "50% 55%",
      credit: "Coronation Road West, Bukit Timah — Wzhkevin · CC BY-SA 4.0",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Looking_northward_down_Coronation_Road_West_towards_Bukit_Timah_Hill_in_Singapore.jpg",
    },
  },
  {
    id: "schools",
    n: "02",
    kicker: "Elite schools",
    title: "Exceptional education, close to home.",
    body:
      "Some of Singapore's most respected schools lie within two kilometres, so that schooling folds naturally into the day rather than governing it.",
    fact: "Within 2 km · Anglo-Chinese School (Primary) · Singapore Chinese Girls' School · Nanyang Primary · Raffles Girls' Primary",
    visual: {
      kind: "diagram",
      diagram: "schools",
      alt: "Diagram: the four schools within two kilometres of the house — Anglo-Chinese School (Primary), Singapore Chinese Girls' School, Nanyang Primary and Raffles Girls' Primary.",
    },
  },
  {
    id: "gardens",
    n: "03",
    kicker: "Singapore Botanic Gardens",
    title: "The Gardens, on foot.",
    body:
      "A UNESCO World Heritage Site fifteen minutes' walk away: early runs beneath heritage trees, quiet afternoons by the lakes, evenings on the lawns — a landscape that becomes part of the week.",
    fact: "Singapore Botanic Gardens · UNESCO World Heritage · 15 min walk · Botanic Gardens MRT 1 km",
    visual: {
      kind: "photo",
      src: "/images/location/gardens.jpg",
      alt: "The bandstand at the Singapore Botanic Gardens in low evening light, beneath mature trees.",
      position: "50% 45%",
      credit: "Singapore Botanic Gardens — Mokkie · CC BY-SA 4.0",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Bandstand_at_Singapore_Botanic_Gardens.jpg",
    },
  },
  {
    id: "orchard",
    n: "04",
    kicker: "Orchard Road",
    title: "The city within reach.",
    body:
      "Singapore's shopping, dining and hotel district lies to the south-east — down Bukit Timah Road by car, or three stops from Stevens MRT on the Thomson–East Coast Line. The estate's quiet, a short journey from the city's most cosmopolitan street.",
    fact: "Stevens MRT · 0.5 km · 7 min walk · Downtown & Thomson–East Coast lines",
    visual: {
      kind: "photo",
      src: "/images/location/orchard.jpg",
      alt: "A glass façade and shopfronts on Orchard Road, lit at blue hour.",
      position: "50% 55%",
      credit: "Orchard Road at blue hour — Basile Morin · CC BY-SA 4.0",
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:Glass_facade_of_an_illuminated_shopping_mall_at_blue_hour_with_vertical_symmetry_impression,_Orchard_Road,_Singapore.jpg",
    },
  },
  {
    id: "connect",
    n: "05",
    kicker: "Expressway connectivity",
    title: "Effortlessly connected.",
    body:
      "Adam Road leads to the Pan Island Expressway; Bukit Timah and Dunearn Roads run straight into town. The island opens in every direction, and Berrima Road stays what it is — a quiet loop off the main road.",
    fact: "Pan Island Expressway via Adam Road · Bukit Timah Road · Dunearn Road · Stevens MRT",
    visual: {
      kind: "diagram",
      diagram: "routes",
      alt: "Diagram: routes from Berrima Road — Adam Road to the Pan Island Expressway, Dunearn and Bukit Timah Roads towards Newton, Orchard Road and the city; Stevens MRT nearby.",
    },
  },
];
