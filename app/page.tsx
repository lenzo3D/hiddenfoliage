// The homepage. Acts are stacked in order; each one is its own component.

import Hero from "@/components/Hero";
import Veil from "@/components/Veil";

export default function Home() {
  return (
    <main>
      <Hero />
      <Veil />
    </main>
  );
}
