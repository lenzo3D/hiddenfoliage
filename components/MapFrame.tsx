"use client";

// Holds the schematic map. On desktop it simply fills the width. On phones the
// sheet is drawn wider than the screen and scrolls sideways, opened centred on
// the house — a drawing you can move across, rather than a shrunken thumbnail.

import { useEffect, useRef, type ReactNode } from "react";

export default function MapFrame({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // The house sits at ~46% of the sheet width; centre it in the viewport.
    el.scrollLeft = Math.max(0, el.scrollWidth * 0.46 - el.clientWidth / 2);
  }, []);
  return (
    <div>
      <div ref={ref} className="w-full overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="w-[230vw] md:w-full">{children}</div>
      </div>
      <p className="mt-3 px-[3vw] font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone/70 md:hidden">Drag sideways to move across the map</p>
    </div>
  );
}
