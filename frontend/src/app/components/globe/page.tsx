"use client";

import { useState } from "react";
import { PageIntro } from "@/components/showcase/PageIntro";
import { DemoCard } from "@/components/showcase/DemoCard";
import { Globe, type GlobeTone } from "@/components/edex/globe";
import { PanelFrame } from "@/components/edex/panel-frame";

/* Globe demo: tone switching + endpoint targeting */

export default function GlobePage() {
  const [tone, setTone] = useState<GlobeTone>("idle");
  const [endpoint, setEndpoint] = useState<{ x: number; y: number }>({ x: 0.4, y: -0.3 });

  const retarget = () => {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.3 + Math.random() * 0.55;
    setEndpoint({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
  };

  const TONES: Array<[GlobeTone, string]> = [
    ["idle", "var(--edex-line)"],
    ["alert", "#ff6b6b"],
    ["success", "#8fe3a8"],
  ];

  return (
    <div className="p-6 lg:p-10">
      <PageIntro
        title="GLOBE"
        description="A wireframe dot-matrix globe drawn in pure SVG — latitude rings, rotating longitude lines and deterministic scattered dots. No three.js, no WebGL. The line color transitions smoothly across three semantic tones, and an endpoint marker draws a target line off the sphere."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3 text-[11px] tracking-[0.2em]">
        {TONES.map(([t, color]) => (
          <button
            key={t}
            onClick={() => setTone(t)}
            className="border px-4 py-1.5 transition"
            style={{
              borderColor: tone === t ? color : "var(--edex-line)",
              color: tone === t ? color : "var(--edex-fg-dim)",
            }}
          >
            TONE = {t.toUpperCase()}
          </button>
        ))}
        <button
          onClick={retarget}
          className="border border-[var(--gold)] px-4 py-1.5 text-[var(--gold)] transition hover:bg-[rgba(255,215,0,0.1)]"
        >
          ↯ RETARGET
        </button>
      </div>

      <DemoCard
        title="IN A PANEL"
        importCode={`import { Globe } from "@/components/edex/globe";`}
        code={`<Globe size={190} tone="idle" endpoint={{ x: 0.4, y: -0.3 }} />`}
        height={320}
      >
        <PanelFrame leftLabel="WORLD VIEW" rightLabel={tone.toUpperCase()} className="h-full">
          <div className="flex h-full items-center justify-center">
            <Globe size={230} tone={tone} endpoint={endpoint} />
          </div>
        </PanelFrame>
      </DemoCard>
    </div>
  );
}
