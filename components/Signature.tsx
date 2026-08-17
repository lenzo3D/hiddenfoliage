"use client";

// The Signature — the ending, after 05 / Close.
//
// The film has cut to black. What remains is the maker's mark: the wordmark
// (large, as the site opened), the address, and the one practical thing a
// visitor might want to do next — ask to see the house. Then the small print.
//
//   1  wordmark: HIDDEN / FOLIAGE, then BERRIMA ROAD · SINGAPORE
//   2  enquiry: ENQUIRE — "Private viewings by appointment." — WhatsApp link,
//      and a short form (name, email, telephone, message) that posts to
//      /api/enquire and is forwarded by email; a PDPA notice beneath it
//   3  page links and the agencies' small print (Colophon)
//
// Motion is minimal and scroll-linked, as in The Sanctuary: the wordmark lines
// rise through a clip, the blocks come up gently. Everything is reachable
// before the very bottom of the page. Reduced motion: no motion, all present.

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Colophon from "./Colophon";

// The agent's WhatsApp number (digits only, e.g. 6591234567). NEXT_PUBLIC_
// values are baked into the page at build time — see .env.example.
const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
const WHATSAPP_TEXT = "Hello, I would like to arrange a private viewing of Hidden Foliage, Berrima Road.";
const WHATSAPP_HREF = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}` : null;

type FieldErrors = Partial<Record<"name" | "email" | "phone", string>>;
type Status = { state: "idle" } | { state: "sending" } | { state: "sent" } | { state: "error"; message: string };

const label = "font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone md:text-xs";
// Inputs are 16px on phones on purpose: iOS Safari zooms into anything smaller.
const input =
  "mt-2 block w-full border-b border-stone/30 bg-transparent py-2 font-sans text-base text-foreground outline-none transition-colors placeholder:text-stone/40 focus:border-foreground/70 md:text-[0.9375rem]";
const textLink = "font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-foreground/90 transition-colors hover:text-foreground md:text-xs";

export default function Signature() {
  const rootRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [errors, setErrors] = useState<FieldErrors>({});

  // ── Scroll-linked reveals ─────────────────────────────────────────────────
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const triggers: ScrollTrigger[] = [];
      const add = (t: gsap.core.Tween) => t.scrollTrigger && triggers.push(t.scrollTrigger);

      // Wordmark lines rise through their clipping wrappers.
      root.querySelectorAll<HTMLElement>("[data-line]").forEach((line, i) => {
        add(
          gsap.fromTo(
            line,
            { yPercent: 105 },
            {
              yPercent: 0,
              ease: "sine.out",
              scrollTrigger: { trigger: line.parentElement, start: `top ${88 - i * 4}%`, end: `top ${55 - i * 4}%`, scrub: 0.6 },
            },
          ),
        );
      });

      // Blocks come up gently as they enter.
      root.querySelectorAll<HTMLElement>("[data-fade]").forEach((el) => {
        add(
          gsap.fromTo(
            el,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, ease: "sine.out", scrollTrigger: { trigger: el, start: "top 92%", end: "top 66%", scrub: 0.6 } },
          ),
        );
      });

      // The tail (links + small print) sits at the very end of the page, where
      // "top 66%" might never arrive; it is timed to its own bottom edge instead,
      // which meets the viewport bottom a little before the page's last pixel.
      const tail = root.querySelector<HTMLElement>("[data-tail]");
      if (tail) {
        add(
          gsap.fromTo(
            tail,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, ease: "sine.out", scrollTrigger: { trigger: tail, start: "top bottom", end: "bottom bottom", scrub: 0.6 } },
          ),
        );
      }

      return () => triggers.forEach((t) => t.kill());
    });

    return () => mm.revert();
  }, []);

  // ── The form ──────────────────────────────────────────────────────────────
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.state === "sending") return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    // The same checks the route makes, so most slips are caught before sending.
    const next: FieldErrors = {};
    if ((data.name ?? "").trim().length < 2) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((data.email ?? "").trim())) next.email = "Please check the email address.";
    if ((data.phone ?? "").trim() && ((data.phone ?? "").match(/\d/g) ?? []).length < 6) next.phone = "Please check the telephone number.";
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const out = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: FieldErrors };
      if (res.ok && out.ok) {
        setStatus({ state: "sent" });
        return;
      }
      if (out.error === "invalid" && out.fields) {
        setErrors(out.fields);
        setStatus({ state: "idle" });
        return;
      }
      setStatus({
        state: "error",
        message:
          out.error === "rate_limited"
            ? "Please wait a few minutes before sending another enquiry."
            : out.error === "unavailable"
              ? "Email enquiries are not available at the moment."
              : "Something went wrong and the enquiry was not sent.",
      });
    } catch {
      setStatus({ state: "error", message: "Something went wrong and the enquiry was not sent." });
    }
  }

  const err = (id: keyof FieldErrors) =>
    errors[id] ? (
      <p id={`${id}-error`} className="mt-2 font-sans text-[0.6875rem] leading-relaxed text-foreground/80">
        {errors[id]}
      </p>
    ) : null;

  return (
    <section ref={rootRef} aria-labelledby="signature-wordmark" className="relative bg-background text-foreground">
      {/* ── 1  Wordmark and address ─────────────────────────────────────── */}
      <div className="px-[6vw] pt-[24vh] md:pt-[28vh]">
        <h2
          id="signature-wordmark"
          className="font-serif text-[clamp(2.75rem,5.5vw,5.5rem)] uppercase leading-[0.96] tracking-[0.02em] text-foreground"
        >
          <span className="block overflow-hidden">
            <span data-line className="block">
              Hidden
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-line className="block">
              Foliage
            </span>
          </span>
        </h2>
        <p data-fade className={`mt-6 ${label}`}>
          Berrima Road <span aria-hidden="true">·</span> Singapore
        </p>
      </div>

      {/* ── 2  Enquiry ─────────────────────────────────────────────────── */}
      <div className="px-[6vw] pt-[16vh] md:grid md:grid-cols-12 md:gap-[4vw] md:pt-[18vh]">
        <div data-fade className="md:col-span-5">
          <p className={label}>Enquire</p>
          <p className="mt-6 max-w-[22ch] font-serif text-[clamp(1.5rem,2.4vw,2.25rem)] italic leading-snug text-foreground/95 md:mt-8">
            Private viewings by appointment.
          </p>
          {WHATSAPP_HREF && (
            <p className="mt-8 md:mt-10">
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={textLink}>
                Message on WhatsApp <span aria-hidden="true">→</span>
              </a>
            </p>
          )}
        </div>

        <div data-fade className="mt-14 md:col-span-6 md:col-start-7 md:mt-0">
          {status.state === "sent" ? (
            <div role="status" aria-live="polite">
              <p className="max-w-[26ch] font-serif text-[clamp(1.25rem,1.7vw,1.625rem)] italic leading-snug text-foreground/95">
                Thank you. We will be in touch shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="relative [color-scheme:dark]" aria-label="Enquiry">
              {/* Never shown to people; a bot that fills it is quietly ignored. */}
              <div className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden" aria-hidden="true">
                <label>
                  Website
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-[3vw]">
                <div>
                  <label htmlFor="enq-name" className={label}>
                    Name
                  </label>
                  <input
                    id="enq-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={input}
                  />
                  {err("name")}
                </div>
                <div>
                  <label htmlFor="enq-email" className={label}>
                    Email
                  </label>
                  <input
                    id="enq-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={input}
                  />
                  {err("email")}
                </div>
                <div>
                  <label htmlFor="enq-phone" className={label}>
                    Telephone <span className="normal-case tracking-normal text-stone/70">(optional)</span>
                  </label>
                  <input
                    id="enq-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    aria-invalid={errors.phone ? true : undefined}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    className={input}
                  />
                  {err("phone")}
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="enq-message" className={label}>
                    Message <span className="normal-case tracking-normal text-stone/70">(optional)</span>
                  </label>
                  <textarea
                    id="enq-message"
                    name="message"
                    rows={2}
                    placeholder="Preferred dates, or anything we should know."
                    className={`${input} resize-none field-sizing-content`}
                  />
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-4">
                <button
                  type="submit"
                  disabled={status.state === "sending"}
                  className="group font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-foreground disabled:text-stone md:text-xs"
                >
                  {status.state === "sending" ? "Sending…" : "Send enquiry"} <span aria-hidden="true">→</span>
                  <span
                    aria-hidden="true"
                    className="mt-1 block h-px w-full bg-foreground/50 transition-colors group-hover:bg-foreground group-disabled:bg-stone/40"
                  />
                </button>
                <p role="status" aria-live="polite" className="font-sans text-[0.6875rem] leading-relaxed text-foreground/80">
                  {status.state === "error" && (
                    <>
                      {status.message}
                      {WHATSAPP_HREF && (
                        <>
                          {" "}
                          Please try again, or{" "}
                          <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="underline decoration-stone/50 underline-offset-4 hover:decoration-foreground">
                            message us on WhatsApp
                          </a>
                          .
                        </>
                      )}
                    </>
                  )}
                </p>
              </div>

              {/* PDPA notice: what the details are for, and that they go no further. */}
              <p className="mt-8 max-w-[56ch] font-sans text-[0.6875rem] leading-relaxed text-stone/80">
                By sending this enquiry you agree to be contacted by the appointed salespersons about this residence.
                Your details are used for that purpose only and are held in accordance with Singapore&rsquo;s Personal
                Data Protection Act.
              </p>
            </form>
          )}
        </div>
      </div>

      {/* ── 3  Links and small print ────────────────────────────────────── */}
      <footer data-tail className="px-[6vw] pb-[8vh] pt-[18vh] md:pt-[22vh]">
        <nav aria-label="Pages" className="flex flex-wrap gap-6 md:gap-8">
          {[
            ["/residence", "Residence"],
            ["/plans", "Plans"],
            ["/location", "Location"],
          ].map(([href, text]) => (
            <Link key={href} href={href} className={`${label} transition-colors hover:text-foreground`}>
              {text}
            </Link>
          ))}
        </nav>
        <Colophon className="mt-8" />
      </footer>
    </section>
  );
}
