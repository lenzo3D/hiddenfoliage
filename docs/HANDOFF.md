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
- `/location`: intro ("Secluded by nature. Connected to Singapore.") → `LocationStory.tsx`, five
  chapters (`locationChapters.ts`: 01 A private world · 02 Exceptional education · 03 The Gardens,
  on foot · 04 The city within reach · 05 Effortlessly connected). Desktop + motion: pinned
  h-[640vh] stage — plate left (56vw), copy right (28vw), counter + five ticks bottom-left, photo
  credit under the plate; one scrubbed timeline crossfades plates (incoming on top, outgoing
  dropped once covered), drifts each plate 1.08→1, rises copy in/out, draws the diagram plates
  (`LocationDiagrams.tsx`: schools within 2 km; routes to PIE/town/MRT) line-by-line. Phones and
  reduced motion: the same chapters stacked (useReveals). Photos are CC BY-SA from Wikimedia
  Commons (`public/images/location/`), credited + linked — see CONTENT-NEEDED for what to
  replace. Then the overview: schematic map (`LocationMap.tsx`, `MapFrame.tsx`), Google Maps /
  Directions links (`components/site.ts`, "23 Berrima Road, Singapore"), verified distances only
  (no drive times anywhere until verified), schools list.
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
- All four source MP4s were 1280×720/24fps, ONE keyframe per clip, with a generator sparkle
  watermark at ~x1135–1185/y575–625. Current site files: watermark removed (per-pixel
  un-blend + ring cleanup), re-encoded GOP 6, no audio, CRF 27. Originals untouched in
  `C:\Users\m\Downloads` (video1-hero.mp4, video2- veil.mp4, video3- inside out.mp4,
  video4- close.mp4) and in git history.
- Media is the main quality limit (720p enlarged 1.25–3.5×). Real-ESRGAN test = FAIL
  (herringbone screen redrawn/shimmering). Plan: client regenerates all four at ≥1080p, same
  shots (hero must open on the same frame as `hero image.png`), then a single media-swap pass
  (prep pipeline exists: watermark check → un-blend → GOP-6 encode → harness).
- Veil act uses only 1.2s→2.6s of video2 (louvres closed→half-open); file trimmed to 4s.

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
