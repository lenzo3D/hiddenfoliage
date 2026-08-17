# Hidden Foliage — Handoff (as of the "digital sales gallery" pass)

Premium cinematic property website — the digital sales gallery — for a S$23.8M
brand-new freehold detached house (under construction) on Berrima Road, Dunearn
Estate, District 11, Singapore. Built for a first-time coder client (Richard) who
reviews visually in the browser; explain as you go, keep layouts simple, be honest
about what's verified vs assumed. Never invent a property fact — see
`docs/CONTENT-NEEDED.md` for what is still to be supplied.

## Stack & workflow
- Next.js 16.3 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4, GSAP 3.15.
  No other runtime deps. No Three.js/WebGL/shaders/UI libraries — deliberate. Email is
  sent with a plain `fetch` to Resend's HTTP API (no SDK).
- Repo: `C:\Users\m\hidden-foliage` (git, main). Commit after each approved pass.
- Dev server: `npm run dev -- -p 3001` (port 3000 is often held by a stale `next start`).
  Preview config lives in `C:\Users\m\.claude\.claude\launch.json` ("hidden-foliage-dev-3001").
- Env: copy `.env.example` → `.env.local` (git-ignored). Locally `.env.local` holds a
  PLACEHOLDER WhatsApp number (6500000000) so the link can be reviewed; email is
  unconfigured on purpose, so `/api/enquire` prints each enquiry to the dev-server
  console (`[enquiry] …`) and the form still shows its thank-you.
- Checks before every commit: `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Verification harness (puppeteer-core + local Chrome; ffmpeg from an older scratchpad
  for contact sheets) lives in the session scratchpad `…\scratchpad\harness\`
  (signature-test / audit-shots / home-check / verify-all / details-check .mjs).
  It drives http://localhost:3001, reads GSAP state, and screenshots desktop 1440×900,
  tablet 768×1024, phone 390×844 (and 360), plus reduced-motion. If the scratchpad is
  gone: `npm i puppeteer-core` in a temp dir and re-create from this description.
- The in-app Browser pane cannot render GSAP (hidden tab, rAF never fires) — use the harness.

## Design system (do not drift)
- Colours: `--background #070b08` (near-black forest), `--foreground #ebe9e2` (warm ivory),
  `--stone #b8b2a4`. No gold, gradients, glow, cards, glass, rounded boxes, icons.
- Type: Bodoni Moda (variable, opsz) for statements; Instrument Sans for labels/annotations
  (11–12px uppercase, tracking 0.18em). Section labels: `01 / THE VEIL` etc.
- Concept: REVEAL / CONCEAL. Restraint over effects. Motion is scroll-linked and reversible.
- Reduced motion always handled (static still + text, no pin).
- Every render carries a quiet credit (`components/Credit.tsx`: "Artist's impression").
- Keyboard: skip link ("Skip to content" → `#content` on every page), ivory
  `:focus-visible` rule in `globals.css`.

## Pages
- `/` (Home) — the film: Reveal (Hero) → 01 The Veil → 02 Arrival (car porch, "The porch
  is the first room.") → 03 Inside Out → 04 Four Levels of Living (+ "Inspect the plans →")
  → 05 The Sanctuary (moments of a day: Morning / Retreat / Afternoon / Evening + hosting
  line) → 06 Close → Signature (`#enquire`: wordmark, address, schedule line, enquiry).
- `/residence`: header, schedule (13 verified rows), narrative, Materials (the closed
  screen close-up + three material details: timber slats / joinery / stone — all crops of
  existing renders), stills, The Making (status, built-in spec, the honest "all images
  are impressions" note; team/completion fold into one "available on request" line via
  the `MAKING` array until supplied), footer.
- `/plans`: PlanViewer (tabs, true plan view, zoom/pan/fullscreen desktop; rotated sheet on
  phones) — same data as Four Levels (`components/floorPlans.ts`, renderer `PlanSvg.tsx`).
  Furnished / Bare switch (`FURNITURE` in floorPlans.ts — the sales plans' suggested layout,
  hairline symbols; never shown on Home), a 5 m scale bar, and a Measure tool (tap two points →
  "≈ x.x m", calibrated on the 18 m pool: `METRES_PER_UNIT = 18/575`; screen→plan via
  `getScreenCTM`, works through zoom/pan/rotation). Only verified sizes are printed (land,
  built-up, pool). North point drawn as on the architect's sheets: north = plan LEFT (towards
  the road); on phones it points down. **Confirm north with the agent** (docs/CONTENT-NEEDED.md).
- `/location`: intro ("Secluded by nature. Connected to Singapore.") then `LocationStory.tsx`,
  five chapters (`locationChapters.ts`): 01 The Estate / The luxury of quiet · 02 Education /
  Among Singapore's most established schools · 03 Singapore Botanic Gardens / A world heritage
  garden, close to home · 04 Orchard Road / Orchard Road, minutes away · 05 Connectivity /
  Perfectly placed for the city. **This wording is the client's, approved and verbatim - do not
  rewrite it** (a note at the top of the file says so). Desktop + motion: pinned h-[640vh] stage,
  plate left (56vw), copy right (28vw), counter + five ticks bottom-left, credit under the plate;
  one scrubbed timeline crossfades plates (incoming on top, outgoing dropped once covered),
  drifts each plate 1.08 to 1, and rises the copy in and out. Phones and reduced motion: the same
  chapters stacked (useReveals). Photographs in `public/images/location/`: estate-road, sji and
  expressway-dusk were supplied by the client (upscaled 2x; the SJI file is padded onto the dark
  ground so the crest and lettering never crop), gardens and orchard-ion are CC BY-SA from
  Wikimedia Commons and keep their attribution links. The `credit` field is optional per chapter.
  There is NO schematic map: reliable map data could not be fetched, so the page ends with the
  verified distances, the schools, and Google Maps / Directions links for 23 Berrima Road
  (`components/site.ts`). No drive times anywhere until verified.
- `components/Nav.tsx` (fixed 5 tabs incl. Enquire → `/#enquire`; on phones the HF wordmark
  stands in for Home), `SiteFooter.tsx` (inner pages: "Private viewings by appointment ·
  Enquire →", wordmark, links, `Colophon.tsx`), `Reveal.tsx` (inner-page image reveal),
  `useReveals.ts` (data-line / data-reveal+data-img / data-fade / data-tail / data-dusk —
  shared by Arrival, Sanctuary, Signature).
- `app/api/enquire/route.ts`: validates, honeypot, per-address rate limit (5/10 min),
  Resend HTTP API; dev without keys → console log + ok; prod without keys → 503 (form
  then points to WhatsApp). Accepts an optional `ref` (reserved for by-invitation links).
- Metadata: `app/layout.tsx` (title template, description, OG/Twitter, `metadataBase` from
  `NEXT_PUBLIC_SITE_URL`), `app/opengraph-image.jpg` (1200×630 hero crop),
  `app/icon.png` + `app/apple-icon.png` (Bodoni "H" on the dark field).

## Video model (important)
- Films are NOT scrubbed by scroll (24fps source stepped badly). Each act plays its film once
  at natural speed when its portion becomes active, pauses off-screen, holds last frame,
  rewinds only when hidden. Overlays/typography remain scroll-scrubbed.
- **Hero (done):** the client re-rendered the opening shot at 3840x2160 / 24fps / 4.9s
  (`Downloads/video1-hero (1).mp4`, 31 MB, no watermark, no audio). The site serves
  `public/videos/video1-hero-1080.mp4` - 1920x1080, CRF 24, preset veryslow, GOP 24, no audio,
  +faststart, 6.7 MB - compared crop-by-crop against the 4K master and visually transparent.
  `public/images/hero-still.jpg` (2560x1440) is frame 0 of that master, so the still-to-film
  hand-off is pixel-identical; Residence's opening image uses it too. The old 1280x720 hero
  file was deleted (it remains in git history). NOTE the new clip is 4.9s where the old was
  10s - the same camera move at roughly twice the speed - so the reveal completes earlier in
  the scroll and then holds. Ask Richard if he wants it slowed (retiming needs frame
  interpolation, which risks artefacts on the herringbone screen).
- **Act 03 Inside Out (done):** the client supplied a 2560x1440 upscale of the same shot at the
  same 10s length (`Berrima Road (Dunearn Estate)/upscaled-video.mp4`, no watermark, no audio),
  so the act's pacing is unchanged. The site serves `public/videos/video3-inside-out-1080.mp4`
  - 1920x1080, CRF 24, preset veryslow, GOP 24, +faststart, 4.4 MB - and
  `public/images/inside-out-still.jpg` (2560x1440) is frame 0 of that upscale, used for the
  reduced-motion view. The old 1280x720 file was deleted (it stays in git history).
- **Act 01 The Veil (done):** the client supplied a 2560x1440 upscale of the same 4s trimmed
  clip (`Berrima Road (Dunearn Estate)/upscaled-video (1).mp4`, no watermark, no audio),
  frame-aligned with the old file - checked at 0s (closed), 1.2s, 2.6s (half-open) and 3.9s -
  so FILM_FROM 1.2 and FILM_TO 2.6 are unchanged. The site serves
  `public/videos/video2-veil-1080.mp4` (1920x1080, CRF 24, preset veryslow, GOP 24,
  +faststart, 3.0 MB) and `public/images/veil-still.jpg` is that film's own 2.6s half-open
  frame, used for reduced motion in place of the separate `exterior blinds open.png`. The old
  1280x720 file was deleted (it stays in git history).
- **Only 06 Close is still 1280x720:** same treatment awaits its re-render - watermark check,
  1080p CRF 24 encode, still from frame 0, harness. Its original was 1280x720/24fps with ONE
  keyframe and a generator sparkle watermark at ~x1135-1185/y575-625; the current site file has
  it removed (per-pixel un-blend + ring cleanup), re-encoded GOP 6, no audio, CRF 27. Originals
  untouched in the Downloads folder.
- Veil act uses only 1.2s to 2.6s of video2 (louvres closed to half-open); file trimmed to 4s.
- A phone-weight hero encode (720p, ~3 MB, via a second <source media=...>) is an easy future
  saving; today every device downloads the 6.7 MB file.

## Stills at 2× (`public/images/2x/`)
- The renders are 1672 px wide; anywhere the site enlarges them (Arrival full-bleed, the Sanctuary
  and Residence figures, the three material details, the closed-screen square, Close's
  reduced-motion still) now uses a 2× JPEG made with Real-ESRGAN (realesrgan-x4plus at 4×,
  downscaled to 2×; binary in the old scratchpad `…/8791c3b1…/scratchpad/esrgan/bin`). Checked
  crop by crop: crisper edges/grain, no invented structure — on STILLS. (The earlier FAIL was the
  video: temporal shimmer on the herringbone.) NOT applied to the Home hero still (it must match
  the 720p film's first frame), nor to the Veil / Inside Out reduced-motion stills. Originals
  untouched. Redo from source when the client re-exports renders at 4K.

## Verified facts (from the agency listing; use these, don't invent)
Freehold · land 4,821 sq ft · built-up 9,462 sq ft · 5+1 bedrooms · 7 bathrooms · guide price
S$23,810,000 · four levels (basement w/ household shelter, 1st, 2nd, attic) · 18 m × 2 m pool ·
home lift · 4-car porch, EV provision · solar-ready · detached, brand new (under construction,
per client) · D11 Dunearn Estate · Stevens MRT 0.48 km / 7 min walk · Botanic Gardens MRT
~1 km / 12 min · schools within 2 km: ACS (Primary), SCGS, Nanyang Primary, RGPS · agencies
SRI (L3010738A), ERA (L3002382K). Drive times on Location are labelled "approx." — unverified.
North point: from the plan sheets (north = plan left) — to be confirmed.

## Open items / next steps
1. Richard to review the sales-gallery pass (this handoff's commit) and supply the items in
   `docs/CONTENT-NEEDED.md` (WhatsApp number, email keys, site URL; team/completion; north).
2. Premium tier (approved in principle, one at a time): by-invitation personal links + viewing
   report (the API already accepts `ref`), presentation mode (iPad/TV), generated PDF
   "Residence Book", Mandarin toggle, analytics events, hooks for Matterport/photography.
3. Media regeneration swap; real-iPhone Safari test; Lighthouse/LCP pass.
4. Optional polish: an "Arrival" crop nudge (door vs car balance), Location "private
   intelligence" once verifiable facts exist.
