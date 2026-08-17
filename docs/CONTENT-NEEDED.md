# Content and assets still needed

The site never invents a fact. Where something a serious buyer would want is
not yet available, the design carries the *place* for it and says "available
on request". This is the list of what would fill those places — in rough order
of how much each would strengthen the site.

## Configuration (needed before going live)
- **WhatsApp number** for the enquiry link — `NEXT_PUBLIC_WHATSAPP_NUMBER` in
  `.env.local` / the host's environment (currently a placeholder locally).
- **Email delivery** for the enquiry form — `RESEND_API_KEY`, `ENQUIRY_TO`
  (and optionally `ENQUIRY_FROM` on a verified domain). See `.env.example`.
- **Public site URL** — `NEXT_PUBLIC_SITE_URL` (used for share-card links).
- **Google Maps links** now target "23 Berrima Road, Singapore" (per Richard);
  `NEXT_PUBLIC_MAPS_QUERY` can refine it with the postal code.

## Construction confidence (Residence → "The making")
Rows appear automatically once filled in `app/residence/page.tsx` (`MAKING`);
until then they are folded into one "available on request" line.
- Anticipated **completion** (month/quarter) and current **construction stage**
- **Architect**, **interior designer**, **landscape designer**, **builder**
- Any significant **custom elements** / specification highlights worth naming
- **Progress photography** — even three honest site photographs would let the
  site show "today" beside "the finished house" (renders). The Credit line
  already distinguishes artist's impressions; progress images would carry a
  "Site, <month year>" caption instead.

## Orientation (Plans)
- The north point is drawn from the architect's plan sheets (north = plan left,
  towards the road, so the pool runs along the western edge). **Please confirm**
  with the agent/architect; the arrow, the Plans intro sentence and the phone
  note all depend on it.

## Sizes (Plans)
- The sales plans give no room dimensions, only the pool (18 m × 2 m). The
  Plans page therefore prints only the verified areas and offers a Measure tool
  calibrated on the pool (approximate). **Room dimensions / a dimensioned plan**
  from the architect would let us print sizes on the drawing.
- Furniture shown is the sales plans' suggested layout, redrawn schematically.

## Materials (Residence → "Materials")
- **Material specification**: timber species, stone, joinery, glazing, screen
  louvre mechanism (fixed/operable), pool finish, lift model, solar capacity.
- **Macro photography or material samples** (timber, stone, screen detail) —
  the section currently uses a crop of the closed-screen render.

## Media quality (already planned)
- All four films are 720p; regenerate at ≥1080p, same shots (hero must open on
  the same frame as `hero image.png`), then the single media-swap pass.
- A native portrait crop of the master bath (the render is 4:5 with the WC at
  bottom-left; the site enlarges within the frame to keep it out).

## Location
The five chapters are photographs, in one arc: privacy, education, nature, city,
connectivity. Copy and credits live in `components/locationChapters.ts`; files in
`public/images/location/`.
- `estate-road.jpg`, `sji.jpg`, `expressway-dusk.jpg` — **supplied by the client**
  (from the `Berrima Road (Dunearn Estate)` folder), upscaled 2x with Real-ESRGAN.
  The SJI file is padded onto the site's dark ground so the crest and lettering are
  never cropped by the plate. Rights for these three sit with the client; only the
  subject is captioned and no photographer is claimed.
- `gardens.jpg` (Mokkie) and `orchard-ion.jpg` (Diego Delso) are CC BY-SA from
  Wikimedia Commons and keep their attribution and licence link.
- **The district map was removed.** Reliable map data could not be fetched (all
  Overpass mirrors were down), so the page links Google Maps for 23 Berrima Road
  rather than drawing an approximation.
- **Drive times** are still not printed anywhere. To add them, take typical
  off-peak times from Google Maps for 23 Berrima Road and they will be added with
  the source and date.

## Sizes (Plans)
- The sales plans give no room dimensions, only the pool (18 m × 2 m). The
  Plans page therefore prints only the verified areas and offers a Measure tool
  calibrated on the pool (approximate). **Room dimensions / a dimensioned plan**
  from the architect would let us print sizes on the drawing.
- Furniture shown is the sales plans' suggested layout, redrawn schematically.

## Materials (Residence → "Materials")
- **Material specification**: timber species, stone, joinery, glazing, screen
  louvre mechanism (fixed/operable), pool finish, lift model, solar capacity.
- **Macro photography or material samples** (timber, stone, screen detail) —
  the section currently uses a crop of the closed-screen render.

## Media quality (already planned)
- All four films are 720p; regenerate at ≥1080p, same shots (hero must open on
  the same frame as `hero image.png`), then the single media-swap pass.
- A native portrait crop of the master bath (the render is 4:5 with the WC at
  bottom-left; the site enlarges within the frame to keep it out).

## Location
All five chapters now carry real photographs (no diagrams). Files live in
`public/images/location/`; captions and credits are in
`components/locationChapters.ts`. To swap any picture: drop a file in, point the
chapter's `src` at it, and correct the credit line.
- `estate-dalvey.jpg` — Dalvey Hill, Tanglin (Wzhkevin). **Wanted:** Berrima Road
  or Dunearn Estate itself, ideally with the canopy over the road.
- `schools.jpg` — St Joseph's Institution (Independent), Thomson Road. **Wanted:**
  ACS Barker Road (the clock tower) or SJI Malcolm Road at ≥ 2000 px.
- `gardens.jpg` — the Botanic Gardens bandstand (Mokkie). Good.
- `orchard-ion.jpg` — ION Orchard (Diego Delso). Good.
- `expressway.jpg` — the Pan Island Expressway (LN9267), daylight. **Wanted:** the
  dusk light-trail expressway photograph Richard picked; save it as
  `public/images/location/expressway.jpg` and it is used immediately.
- **The district map was removed.** Reliable map data could not be fetched
  (all Overpass mirrors were down), so rather than draw an approximate district
  map the page links Google Maps for 23 Berrima Road. If an accurate reconstruction
  is wanted later, the inputs are: OSM road geometry for the Dunearn/Bukit Timah
  area, or a licensed static-map tile.
- **Drive times** are still not printed anywhere. To add them, take typical
  off-peak times from Google Maps for 23 Berrima Road → Orchard Road, Raffles
  Place and Changi Airport, and they will be added with the source and date.

## Later features (roadmap, from docs/HANDOFF.md)
By-invitation links + viewing report, presentation mode, generated PDF
"Residence Book", Mandarin toggle, analytics events, hooks for Matterport /
photography.
