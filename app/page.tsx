// The homepage — the film. Acts are stacked in order; each one is its own
// component:
//   Reveal → 01 The Veil → 02 Arrival → 03 Inside Out → 04 Four Levels of
//   Living → 05 The Sanctuary → 06 Close → Signature (wordmark, enquiry).

import Hero from "@/components/Hero";
import Veil from "@/components/Veil";
import Arrival from "@/components/Arrival";
import InsideOut from "@/components/InsideOut";
import FourLevels from "@/components/FourLevels";
import Sanctuary from "@/components/Sanctuary";
import Close from "@/components/Close";
import Signature from "@/components/Signature";

export default function Home() {
  return (
    <main id="content">
      <Hero />
      <Veil />
      <Arrival />
      <InsideOut />
      <FourLevels />
      <Sanctuary />
      <Close />
      <Signature />
    </main>
  );
}
