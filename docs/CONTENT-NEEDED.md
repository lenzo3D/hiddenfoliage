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
- **Exact address for the Google Maps links** — `NEXT_PUBLIC_MAPS_QUERY`
  (e.g. "12 Berrima Road, Singapore 299xxx"); until set, the links search for
  "Berrima Road, Singapore".

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
- Verify the approximate drive times (Orchard, CBD, Changi) — labelled
  "approx." on the page.
- Any *specific* private intelligence worth adding (clubs, schools' admission
  notes, the enclave's character) — only if verifiable.

## Later features (roadmap, from docs/HANDOFF.md)
By-invitation links + viewing report, presentation mode, generated PDF
"Residence Book", Mandarin toggle, analytics events, hooks for Matterport /
photography.
