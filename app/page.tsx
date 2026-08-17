// The homepage. Acts are stacked in order; each one is its own component.

import Hero from "@/components/Hero";
import Veil from "@/components/Veil";
import InsideOut from "@/components/InsideOut";
import FourLevels from "@/components/FourLevels";
import Sanctuary from "@/components/Sanctuary";
import Close from "@/components/Close";
import Signature from "@/components/Signature";

export default function Home() {
  return (
    <main>
      <Hero />
      <Veil />
      <InsideOut />
      <FourLevels />
      <Sanctuary />
      <Close />
      <Signature />
    </main>
  );
}
