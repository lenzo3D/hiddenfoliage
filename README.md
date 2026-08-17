# Hidden Foliage

A cinematic digital sales gallery for a brand-new freehold detached house at
23 Berrima Road, Dunearn Estate, District 11, Singapore.

The homepage is a film in seven parts — Reveal, 01 The Veil, 02 Arrival,
03 Inside Out, 04 Four Levels of Living, 05 The Sanctuary, 06 Close, and the
Signature that carries the enquiry. Three further pages hold the detail:
`/residence` (schedule, materials, the making), `/plans` (an interactive plan
viewer) and `/location` (five chapters, then the practical distances).

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 ·
GSAP 3 with ScrollTrigger. No other runtime dependencies: no UI library, no
WebGL, no email SDK. Type is Bodoni Moda and Instrument Sans, self-hosted by
Next.js.

## Running it

```bash
npm install
npm run dev -- -p 3001
```

Then open http://localhost:3001. Port 3001 is used because 3000 is often held by
a stale `next start`.

Before committing:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Configuration

Copy `.env.example` to `.env.local` (git-ignored) and fill in what you have:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public origin, used for share-card links |
| `NEXT_PUBLIC_MAPS_QUERY` | Address the Google Maps links resolve to |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Agent's WhatsApp number for the enquiry link |
| `RESEND_API_KEY`, `ENQUIRY_TO`, `ENQUIRY_FROM` | Email delivery for `/api/enquire` |

Without the Resend variables the enquiry form still works in development: each
submission is printed to the dev-server console and the form shows its
thank-you. In production the route answers 503 and the form points the visitor
to WhatsApp, so an enquiry is never silently dropped.

## How the films work

The four films are not scrubbed by scroll — 24 fps footage dragged through wheel
notches looks stepped. Scroll drives the interface (veils, panels, typography);
each film simply plays once at natural speed when its act becomes active, holds
its last frame, and rewinds only once it is hidden. Every act has a still for
`prefers-reduced-motion`, taken from the film's own opening frame so the two
match exactly.

## Honesty rules for content

The house is under construction, so every interior and exterior image is an
artist's impression and is captioned as one. Plans are diagrammatic redraws of
the architect's sheets, not surveys. Nothing unverified is printed: where a fact
is not yet known the design carries a place for it and says "available on
request". See `docs/CONTENT-NEEDED.md` for what is still outstanding, and
`docs/HANDOFF.md` for the full state of the build, the design rules and the
media pipeline.

## Rights

Renders, films and plan drawings belong to the owner and the appointed marketing
agencies (SRI, ERA). Two photographs on the Location page are Creative Commons
(CC BY-SA) from Wikimedia Commons and are credited in place, with links, inside
`components/locationChapters.ts`. This repository is private and not licensed
for reuse.
