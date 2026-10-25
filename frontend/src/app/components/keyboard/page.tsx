"use client";

import { PageIntro } from "@/components/showcase/PageIntro";
import { DemoCard } from "@/components/showcase/DemoCard";
import { Keyboard } from "@/components/edex/keyboard";

/* Keyboard demo: full-size keyboard with physical-key sync + boot stagger */

export default function KeyboardPage() {
  return (
    <div className="booted p-6 lg:p-10">
      <PageIntro
        title="KEYBOARD"
        description="A full-size keyboard rendered in divs. Every key animates in with a random staggered offset on boot (.booted + .key-in), and typing on your physical keyboard highlights the matching key with a mechanical click sound (Web Audio, no audio files needed for the synth fallback)."
      />

      <DemoCard
        title="FULL KEYBOARD"
        importCode={`import { Keyboard } from "@/components/edex/keyboard";`}
        code={`<Keyboard />\n// tip: wrap the page root with className="booted" to trigger\n// the per-key staggered entrance animation`}
        height={280}
      >
        <Keyboard />
      </DemoCard>
    </div>
  );
}
