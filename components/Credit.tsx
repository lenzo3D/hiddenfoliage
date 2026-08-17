// The small credit beneath every render: the honest note that this is the
// house as it will be, not a photograph of it as it is. Same annotation
// register as the captions, a step quieter.

export default function Credit({ className = "" }: { className?: string }) {
  return (
    <span className={`block font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone/70 ${className}`}>
      Artist&rsquo;s impression
    </span>
  );
}
