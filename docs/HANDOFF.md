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
- Repo: `~/Desktop/hidden-foliage` on Richard's MacBook (Apple M5 Pro) since Sept 2026; the
  old Windows copy at `C:\Users\m\hidden-foliage` is retired. GitHub: lenzo3D/hiddenfoliage
  (`main`; the live site is the static export on the `gh-pages` branch; Vercel builds a
  preview per branch/PR). Commit after each approved pass; push through `gh` (signed in).
- Toolchain via Homebrew (`/opt/homebrew/bin`): Node 26, ffmpeg 9, gh, python@3.12. That
  path is not on the launcher's PATH, so `.claude/launch.json` calls `/opt/homebrew/bin/npm`.
- Dev server: `npm run dev` (port 3000) — the "hidden-foliage-dev" preview. `scripts/
  serve-static.py` serves the last `PAGES=1` export from `out/` at
  http://localhost:3001/hiddenfoliage/ without Node (the "hidden-foliage-static" preview).
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

## Virtual tour (`/tour`, `components/tour/`)
- Pannellum maps each room's panorama inside a sphere; markers on the floor plans open it,
  doorway hotspots move between rooms (`tourData.ts`).
- **The client's 360 drawings are cylindrical panoramas, not equirectangular.** Vertical
  position is R·tan(latitude) with R = W/2π (matched horizontal/vertical scale), so a 2:1
  image reaches ±57.5°. Rendered on a sphere as if equirectangular (even with `vaov` 110)
  every straight line bowed — the "round house". Found 2026-09-10 by re-projecting the
  living room under both models: cylindrical straightens the shelving, ceiling cove,
  glazing and the garden wall at every field of view (scratchpad `tour/projection-test.jpg`).
  Fix: convert each drawing to a true equirectangular strip (`sr/cyl2equi.py`: rows linear
  in latitude, covering exactly the cylinder's ±57.5°), declare `vaov: 115`, and the viewer's
  sphere is correct from 45° to 85° across. Straightness of a cylindrical source does not
  depend on R (any R renders lines straight; R only sets the vertical scale), so R = W/2π is
  used as drawn. What remains curved is drawn that way (the ceiling coves arch slightly when
  tilting far up), hence the tilt caps.
- **Wrap seam.** None of the drawings joins at its left/right edge (the client's
  `seam-fix/* ROLLED.png` are the originals rolled 180°, not fixed — measured: the
  discontinuity just moves from the edge to the centre). Each is now inpainted across the
  join with LaMa (`simple-lama-inpainting`, big-lama, band 88 px for the two living views
  where the garden wall needed rebuilding, 56 px elsewhere) in the rolled orientation, then
  rolled back 180° to the site's yaw frame.
- **Site files are Pannellum multires tile sets** (`public/images/360/<room>-v4/`, Sept 2026):
  six 4512 px cube faces cut into 512 px JPEG (q90) tiles over five levels (4512 → 2256 →
  1128 → 564 → 282), from a 14192×4535 equirectangular strip; 720 tiles and 16–21 MB per room
  (110 MB for the six), of which an opening view fetches about 3 MB. The viewer loads only the
  tiles in view, at the level that matches the canvas's device pixels (`checkZoom` in
  libpannellum uses `drawingBufferWidth`, so Retina screens get the top level), and no
  texture is ever larger than 512 px — the old `-phone` copies and the MAX_TEXTURE_SIZE
  check are gone. Why 14192 wide: on a Retina MacBook the 68° opening view is 3024 device
  pixels across, i.e. a 16k panorama for 1:1; the old 7096 single file was being stretched
  2.3× by the GPU's bilinear filter. Face orientation (f b u d l r, up/down faces touching
  the front face) was proven against `libpannellum.js` `createCube()` with a labelled
  synthetic panorama screenshotted in headless Chrome before any room was cut.
- **Recipe** (`scripts/tour/`, run on the M5 Pro GPU; ~2 min per room for the 4x pass,
  ~3 min for the 2x pass — if it crawls, look for something else holding memory: a stray
  14 GB diffusion job made the same passes take 8–15 min): seam-fixed source (1774×887, site yaw frame) → `sr.py` 4x with
  **4xNomos8kDAT** (chosen on crops over RealPLKSR, RealPLKSR-dysample, Nomos2 ATD/DAT2/
  MoSR, HAT-L sharp, RealWebPhoto DAT2 and BHI multiblur: the crispest vase edges, shelf
  lines, glassware and foliage without halos; the "real-degradation" models smear this clean
  source, ATD/HAT come out softer) → `sr.py` 2x with **2xBHI_small_realplksr_large_pretrain**
  (a fidelity model: at Retina scale it gives cleaner edges than the browser's bilinear
  stretch of the 4x output without adding texture; the sharper "real" 2x models add
  crunch) → `cyl2equi.py` (cylindrical → true equirectangular, the cylinder's own ±57.5°)
  → `equi2tiles.py` (cube faces + pyramid + tiles, pure OpenCV, no nona/Hugin). Both SR
  passes are `--wrap` padded so the 360 join stays continuous. `pipeline.sh` chains it;
  the seam-fixed sources are the LaMa outputs described above (recreate from the client's
  files if the scratchpad is gone). Weights: Phhofm/models releases on GitHub.
- Viewer (`PanoViewer.tsx`): opens at 68° (50° portrait), zoom 45–85° (60° portrait), tilt
  −30…+14° (−15…+8° portrait). Pannellum applies min/maxPitch to the *edges* of the view
  (`config.minPitch + vfov/2`), so the strip's ±57.5° limit is never reached on any screen
  shape; outside the strip the tiles hold the page's dark ground anyway.
- Checked against the floor plan (Sept 2026) by re-projecting each room in every direction:
  porch opens on the drive with the front door behind (link on the door); living faces its
  shelving wall with dry kitchen and dining to the right (+100), the pool behind and along
  the right, the screened glazing on the road/porch side to the left — the porch link sits
  on the opening between the timber wall and the pillar at yaw −80; dining's link points
  back at the living shelving through the dry kitchen (−145); the bedroom's dressing
  corridor runs out the back where the plan has the master bath (−173). One known mismatch
  that only a re-render fixes: the bathroom drawing's only door is behind the viewer (−169)
  while the plan puts the bedroom to the left of the tub wall.
- The honest ceiling: sources are 1774×887 drawings, so a 68° view still rests on ~335
  source pixels across the screen; the 8x pass makes edges clean at Retina scale, it does
  not add information. True 360 renders from the 3D model (equirectangular, ≥8192×4096, eye
  height) remain the real fix: run them through `equi2tiles.py --vaov 180` and lift the tilt
  caps, nothing else changes.

## Films — current pipeline (Sept 2026, on the Mac)
- The hero is the only film with a genuine master (the client's 3840×2160 render); it
  stays as encoded. Pool / dusk / screen were AI-generated at 1280×720 and can only be
  upscaled. The Sept 2026 pass re-renders each one frame by frame through
  4xNomosWebPhoto_RealPLKSR (chosen over Real-ESRGAN x4plus / general-x4v3 / 4xNomos8kSC
  on crops: crispest marble, herringbone and foliage without invented texture) on the
  M5 Pro GPU (PyTorch MPS via spandrel), downscaled to 2560×1440, and encoded with
  libx264 CRF 17 preset slower, GOP 24, +faststart, no audio — roughly double the old
  bitrate, so the upscaled detail survives motion. Portrait phone companions are cut from
  the same frames at the measured offsets (pool x=790 w=1080, dusk x=534 w=1080, screen
  x=704 w=1152). Every replaced asset gets a `-v2` filename so no cache serves the old one.
- Sources (the only ones on the Mac): the 720p originals live in git history at
  `df5a16c:public/videos/`; the client's 2560×1440 upscales of the pool and veil shots
  are in `~/Desktop/Berrima Road (Dunearn Estate)/`. The screen film has no original on
  disk — its re-render used the previous 1440 site file as input.
- Pool (`video3-inside-out-*-v2`): original frames 0–131 (5.5 s), 9.7 MB / 4.3 MB phone.
  Flicker check (mean frame-to-frame luma change, 720p): source 3.75, old encode 3.80,
  new 3.42 — no shimmer introduced.
- Dusk (`video4-close-*-v2`): all 240 frames of the 720p original. CRF 17 gave 39 MB
  (PSNR 44.6 dB against the rendered frames); CRF 20 gives 24.5 MB at 42.7 dB, visually
  transparent, so dusk (and anything long) ships at CRF 20: 24.5 MB wide, 13.6 MB phone.
  Flicker: source 2.67, old encode 2.48, new 2.78 — the source's own motion.
- Screen (`video5-screen-*-v2`): no original on disk, so the previous 1440 site file
  (one Real-ESRGAN pass from the Gemini clip) is the input; RealPLKSR at 4x, back to
  2560×1440, CRF 17: 7.1 MB wide, 2.8 MB phone (x=704, w=1152). Flicker: old 0.80,
  new 0.76. Louvre edges and the planter foliage resolve a touch more; this one is the
  smallest gain of the three because its input was already processed once.
- Tooling lives in the session scratchpad (`sr/upscale.py`, `sr/film.sh`, `sr/flicker.py`,
  a uv venv with torch/spandrel, model weights from the Real-ESRGAN and Phhofm GitHub
  releases). If the scratchpad is gone, recreate from this description; a frame takes
  ~3 s (720p in) to ~11 s (1440p in) on the GPU.
- The honest ceiling: these are 720p AI clips. Regenerating them at ≥1080p from the
  generator (docs/CONTENT-NEEDED.md) remains the only step that adds real detail.

## Video model (older notes, pre-Sept 2026)
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
