// The small print that must appear wherever the residence is marketed: the two
// agencies with their CEA licence numbers (Singapore requires this), and the
// artist's-impression note. Used by the inner-page footer and by the Signature
// at the end of the film, so the wording lives in one place.

export default function Colophon({ className = "" }: { className?: string }) {
  return (
    <p className={`max-w-[70ch] font-sans text-[0.6875rem] leading-relaxed text-stone/80 ${className}`}>
      Marketed by SRI Pte Ltd (CEA licence L3010738A) and ERA Realty Network Pte Ltd (CEA licence L3002382K).
      Images of the residence are artist&rsquo;s impressions. Plans are diagrammatic and not to scale.
    </p>
  );
}
