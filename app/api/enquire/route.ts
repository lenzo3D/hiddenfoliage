// POST /api/enquire — receives the "Private viewings by appointment" form from
// the Signature at the end of the film, checks it, and forwards it by email.
//
// No email library. The message is handed to Resend (https://resend.com) with a
// single HTTPS request, configured entirely by environment variables:
//
//   RESEND_API_KEY   the API key from the Resend dashboard            (server only)
//   ENQUIRY_TO       where enquiries are delivered; comma-separate for several
//   ENQUIRY_FROM     optional sender, e.g. "Hidden Foliage <viewings@yourdomain.sg>"
//                    (must be a domain verified in Resend; the default below is
//                    Resend's test sender, which only delivers to the account owner)
//
// Without RESEND_API_KEY / ENQUIRY_TO:
//   • in development the enquiry is printed to the server console and the form
//     still shows its thank-you, so the whole flow can be reviewed locally;
//   • in production the route answers 503 and the form tells the visitor to use
//     WhatsApp instead — an enquiry is never silently dropped.
//
// Anti-spam, deliberately simple: a hidden "website" field that people never
// fill in (bots do), and a small per-address rate limit kept in memory.

const LIMITS = { name: 120, email: 200, phone: 40, message: 2000, ref: 64 } as const;
const RATE = { max: 5, windowMs: 10 * 60 * 1000 }; // 5 enquiries per 10 minutes per address
const RESEND_URL = "https://api.resend.com/emails";
const DEFAULT_FROM = "Hidden Foliage <onboarding@resend.dev>";

type Body = Record<string, unknown>;

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const looksLikeEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
const digitsIn = (s: string) => (s.match(/\d/g) ?? []).length;

// ── Rate limit (best effort; per running instance) ─────────────────────────
const recent = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const stamps = (recent.get(ip) ?? []).filter((t) => now - t < RATE.windowMs);
  stamps.push(now);
  recent.set(ip, stamps);
  if (recent.size > 2000) {
    // Keep the map small: forget addresses with no activity inside the window.
    for (const [key, list] of recent) if (list.every((t) => now - t >= RATE.windowMs)) recent.delete(key);
  }
  return stamps.length > RATE.max;
}

const json = (data: Record<string, unknown>, status = 200) => Response.json(data, { status });

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return json({ ok: false, error: "invalid" }, 400);
  }

  // Honeypot: real visitors never see this field. Pretend it worked.
  if (text(body.website, 200)) return json({ ok: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) return json({ ok: false, error: "rate_limited" }, 429);

  const name = text(body.name, LIMITS.name);
  const email = text(body.email, LIMITS.email);
  const phone = text(body.phone, LIMITS.phone);
  const message = text(body.message, LIMITS.message);
  const ref = text(body.ref, LIMITS.ref); // reserved for by-invitation links

  const fields: Record<string, string> = {};
  if (name.length < 2) fields.name = "Please tell us your name.";
  if (!looksLikeEmail(email)) fields.email = "Please check the email address.";
  if (phone && digitsIn(phone) < 6) fields.phone = "Please check the telephone number.";
  if (Object.keys(fields).length) return json({ ok: false, error: "invalid", fields }, 400);

  const when = new Date().toLocaleString("en-SG", { timeZone: "Asia/Singapore", dateStyle: "long", timeStyle: "short" });
  const lines = [
    `Private viewing enquiry — Hidden Foliage, Berrima Road`,
    ``,
    `Name:       ${name}`,
    `Email:      ${email}`,
    `Telephone:  ${phone || "—"}`,
    ``,
    `Message:`,
    message || "—",
    ``,
    `Received:   ${when} (Singapore)`,
    ref ? `Reference:  ${ref}` : null,
    ``,
    `Consent: the visitor submitted this form beneath the notice that their details`,
    `will be used only to arrange a viewing of this residence (PDPA).`,
  ].filter((l): l is string => l !== null);
  const plain = lines.join("\n");

  const key = process.env.RESEND_API_KEY;
  const to = (process.env.ENQUIRY_TO ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!key || to.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      console.log("\n[enquiry] Email is not configured (RESEND_API_KEY / ENQUIRY_TO). Logged only:\n" + plain + "\n");
      return json({ ok: true, delivered: false });
    }
    return json({ ok: false, error: "unavailable" }, 503);
  }

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM || DEFAULT_FROM,
        to,
        reply_to: email,
        subject: `Viewing enquiry — ${name}`,
        text: plain,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("[enquiry] Resend refused the message:", res.status, await res.text().catch(() => ""));
      return json({ ok: false, error: "failed" }, 502);
    }
    return json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[enquiry] Could not reach Resend:", err);
    return json({ ok: false, error: "failed" }, 502);
  }
}
