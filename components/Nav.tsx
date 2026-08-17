"use client";

// Site navigation: four quiet tabs in the annotation register, the way to the
// enquiry, plus the wordmark. Fixed to the top; hides while scrolling down and
// returns on the first upward scroll, so it never sits on the film for long.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TABS = [
  { href: "/", label: "Home" },
  { href: "/residence", label: "Residence" },
  { href: "/plans", label: "Plans" },
  { href: "/location", label: "Location" },
  { href: "/#enquire", label: "Enquire" }, // the Signature at the end of the film
];

export default function Nav() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const goingDown = y > lastY.current + 4;
        const goingUp = y < lastY.current - 4;
        if (y < 80) setHidden(false);
        else if (goingDown) setHidden(true);
        else if (goingUp) setHidden(false);
        lastY.current = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-[6vw] py-5 transition-transform duration-500 ease-out motion-reduce:transition-none ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <Link href="/" className="font-serif text-[0.9375rem] uppercase tracking-[0.12em] text-foreground/90 hover:text-foreground">
        <span className="hidden sm:inline">Hidden Foliage</span>
        <span className="sm:hidden">HF</span>
      </Link>
      <nav aria-label="Site">
        {/* On phones the wordmark stands in for Home, and the labels are a
            step smaller so all five fit on one line. */}
        <ul className="flex items-center gap-4 sm:gap-5 md:gap-8">
          {TABS.map((t) => {
            const active = pathname === t.href;
            return (
              <li key={t.href} className={t.href === "/" ? "max-sm:hidden" : undefined}>
                <Link
                  href={t.href}
                  aria-current={active ? "page" : undefined}
                  className={`font-sans text-[0.625rem] uppercase tracking-[0.16em] transition-colors sm:text-[0.6875rem] sm:tracking-[0.18em] md:text-xs ${
                    active ? "text-foreground" : "text-stone hover:text-foreground"
                  }`}
                >
                  {t.label}
                  <span aria-hidden="true" className={`mt-1 block h-px w-full ${active ? "bg-foreground/70" : "bg-transparent"}`} />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
