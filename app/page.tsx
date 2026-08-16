// The homepage. Acts are stacked in order; each one is its own component.

import Hero from "@/components/Hero";
import Veil from "@/components/Veil";
import InsideOut from "@/components/InsideOut";

export default function Home() {
  return (
    <main>
      <Hero />
      <Veil />
      <InsideOut />
    </main>
  );
}
