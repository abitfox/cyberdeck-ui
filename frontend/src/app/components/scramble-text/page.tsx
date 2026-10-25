"use client";

import { useState } from "react";
import { PageIntro } from "@/components/showcase/PageIntro";
import { DemoCard } from "@/components/showcase/DemoCard";
import { ScrambleText } from "@/components/edex/scramble-text";

/* ScrambleText demos: hero decode, staggered lines, replay, active toggle */

export default function ScrambleTextPage() {
  const [replayKey, setReplayKey] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const [sound, setSound] = useState(false);

  return (
    <div className="p-6 lg:p-10">
      <PageIntro
        title="SCRAMBLETEXT"
        description="The signature effect: characters resolve left-to-right out of a pool of glyphs, each one churning randomly before it settles. Width is stable (monospace placeholders), speed adapts for long text, and typing ticks are optional."
      />

      <div className="mb-6 flex flex-wrap gap-3 text-[11px] tracking-[0.2em]">
        <button
          onClick={() => setReplayKey((k) => k + 1)}
          className="border border-[var(--edex-acc)] px-4 py-1.5 text-[var(--edex-acc)] transition hover:bg-[rgba(127,179,186,0.15)]"
        >
          ▶ REPLAY
        </button>
        <button
          onClick={() => setEnabled((v) => !v)}
          className="border border-[var(--edex-line)] px-4 py-1.5 text-[var(--edex-fg-dim)] transition hover:text-[var(--edex-fg-bright)]"
        >
          ACTIVE = {String(enabled).toUpperCase()}
        </button>
        <button
          onClick={() => {
            setSound((v) => !v);
            setReplayKey((k) => k + 1);
          }}
          className="border border-[var(--edex-line)] px-4 py-1.5 text-[var(--edex-fg-dim)] transition hover:text-[var(--edex-fg-bright)]"
        >
          SOUND = {String(sound).toUpperCase()}
        </button>
      </div>

      <DemoCard
        title="HERO DECODE"
        description="Large text with a wide churn range for a dramatic decode."
        importCode={`import { ScrambleText } from "@/components/edex/scramble-text";`}
        code={`<ScrambleText\n  text="CYBERDECK UI"\n  speed={55}\n  churn={[4, 12]}\n  className="edex-glow text-6xl tracking-[0.35em]"\n/>`}
        height={120}
      >
        <div key={replayKey} className="flex h-full items-center justify-center">
          <ScrambleText
            text="CYBERDECK UI"
            speed={55}
            churn={[4, 12]}
            active={enabled}
            sound={sound}
            className="edex-glow text-3xl font-bold tracking-[0.3em] text-[var(--edex-fg-bright)]"
          />
        </div>
      </DemoCard>

      <DemoCard
        title="STAGGERED LINES"
        description="Multiple lines with increasing delay — the classic terminal report rhythm."
        code={`<ScrambleText text="> UPLINK ESTABLISHED" delay={0}   sound />\n<ScrambleText text="> IDENTITY VERIFIED"   delay={300} sound />\n<ScrambleText text="> MISSION LOADED"       delay={600} sound />`}
        height={150}
      >
        <div key={replayKey} className="flex h-full flex-col justify-center gap-2 text-[13px] text-[var(--edex-acc)]">
          <ScrambleText text="> UPLINK ESTABLISHED" delay={100} active={enabled} sound={sound} />
          <ScrambleText text="> IDENTITY VERIFIED" delay={450} active={enabled} sound={sound} />
          <ScrambleText text="> MISSION PACKAGE LOADED" delay={800} active={enabled} sound={sound} />
        </div>
      </DemoCard>

      <DemoCard
        title="INLINE PARAGRAPH"
        description="Long text decodes faster automatically (duration capped at ~1.6s); beyond 200 chars it renders statically."
        code={`<ScrambleText\n  text="Covert channel established..."\n  delay={400}\n  speed={14}\n/>`}
        height={130}
      >
        <div key={replayKey} className="flex h-full items-center">
          <ScrambleText
            text="Covert channel established. Your deck is running CYBERDECK OS with full telemetry, scanline compositing and encrypted packet routing enabled."
            delay={200}
            speed={14}
            active={enabled}
            sound={sound}
            className="leading-relaxed text-[var(--edex-fg-dim)]"
          />
        </div>
      </DemoCard>
    </div>
  );
}
