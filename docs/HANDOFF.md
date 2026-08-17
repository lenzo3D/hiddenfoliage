# Hidden Foliage — Handoff (as of commit e98cdf8)

Premium cinematic property website for a S$20M+ freehold detached house on Berrima Road,
Dunearn Estate, District 11, Singapore. Built for a first-time coder client (Richard) who
reviews visually in the browser; explain as you go, keep layouts simple, be honest about
what's verified vs assumed.

## Stack & workflow
- Next.js 16.3 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4, GSAP 3.15.
  No other runtime deps. No Three.js/WebGL/shaders/UI libraries — deliberate.
- Repo: `C:\Users\m\hidden-foliage` (git, main). Commit after each approved pass.
- Dev server: `npm run dev -- -p 3001` (port 3000 is often held by a stale `next start`).
  Preview config lives in `C:\Users\m\.claude\.claude\launch.json` ("hidden-foliage-dev-3001").
- Checks before every commit: `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Verification harness (puppeteer-core + local Chrome, ffmpeg-static) lives in the session
  scratchpad `…\scratchpad\harness\` (hero-test/veil-test/act3-test/act4-test/levels-test/
  sanct-test/pages-test/frames-test/scrub-audit .mjs). It drives http://localhost:3001,
  reads GSAP state, and screenshots desktop 1440×900 / mobile 390×844 / reduced-motion.
  If the scratchpad is gone, recreate: `npm i puppeteer-core ffmpeg-static` in a temp dir.
- The in-app Browser pane cannot render GSAP (hidden tab, rAF never fires) — use the harness.

## Design system (do not drift)
- Colours: `--background #070b08` (near-black forest), `--foreground #ebe9e2` (warm ivory),
  `--stone #b8b2a4`. No gold, gradients, glow, cards, glass, rounded boxes, icons.
- Type: Bodoni Moda (variable, opsz) for statements; Instrument Sans for labels/annotations
  (11–12px uppercase, tracking 0.18em). Section labels: `01 / THE VEIL` etc.
- Concept: REVEAL / CONCEAL. Restraint over effects. Motion is scroll-linked and reversible.
- Reduced motion always handled (static still + text, no pin).

## Pages
- `/` (Home): Hero (Reveal) → Veil (01) → InsideOut (02) → FourLevels (03) → Sanctuary (04)
  → Close (label still reads `03 / Close`; should become `05` — awaiting Richard's OK).
- `/residence`: verified facts schedule + narrative + stills.
- `/plans`: PlanViewer (tabs, true plan view, zoom/pan/fullscreen desktop; rotated sheet on
  phones) — same data as Four Levels (`components/floorPlans.ts`, renderer `PlanSvg.tsx`).
- `/location`: schematic SVG map (`LocationMap.tsx`, `MapFrame.tsx` for phone sideways scroll).
- `components/Nav.tsx` (fixed 4-tab, hides on scroll-down), `SiteFooter.tsx`, `Reveal.tsx`.

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

## Verified facts (from the agency listing; use these, don't invent)
Freehold · land 4,821 sq ft · built-up 9,462 sq ft · 5+1 bedrooms · 7 bathrooms · guide price
S$23,810,000 · four levels (basement w/ household shelter, 1st, 2nd, attic) · 18 m × 2 m pool ·
home lift · 4-car porch, EV provision · solar-ready · D11 Dunearn Estate · Stevens MRT 0.48 km
/ 7 min walk · Botanic Gardens MRT ~1 km / 12 min · schools within 2 km: ACS (Primary), SCGS,
Nanyang Primary, RGPS · agencies SRI (L3010738A), ERA (L3002382K). Drive times on Location are
labelled "approx." — unverified.

## Open items / next steps (agreed roadmap)
1. Signature/ending after Close: wordmark, address, "Private viewings by appointment" enquiry
   (WhatsApp deep link + email API route, PDPA line). Relabel Close to 05.
2. Optional: "Inspect the plans →" line under Four Levels on Home; facts panel on Home.
3. Premium tier ideas (approved in principle): by-invitation personal links + viewing report,
   presentation mode (iPad/TV), generated PDF brochure, Mandarin toggle, OG share cards,
   analytics events, hooks for Matterport/photography.
4. Media regeneration swap; real-iPhone Safari test; performance/LCP pass; favicon/metadata/OG.
5. Bathroom still shows the WC in any portrait crop (flagged); Close label; drive-time verify.
