"use client";

import { useEffect, useState } from "react";
import { PageIntro } from "@/components/showcase/PageIntro";
import { DemoCard } from "@/components/showcase/DemoCard";
import { BootOverlay } from "@/components/edex/boot-overlay";
import { ScrambleText } from "@/components/edex/scramble-text";

/* BootOverlay demo: replay the full boot sequence inside a framed stage */

/* Stage machine (same as the homepage):
 * 0 standby → 1 rect → 2 loading → 3 expand → 4 fade → 5 booted → 6 unmount */
const BOOT_AT = [300, 700, 1800, 2500, 3100, 3800] as const;

export default function BootOverlayPage() {
  const [stage, setStage] = useState(6);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (runId === 0) return;
    setStage(0);
    const timers = BOOT_AT.map((ms, i) =>
      window.setTimeout(() => setStage(i + 1), ms),
    );
    return () => timers.forEach(clearTimeout);
  }, [runId]);

  const booted = stage >= 5;

  return (
    <div className={`p-6 lg:p-10 ${booted ? "booted" : ""}`}>
      <PageIntro
        title="BOOTOVERLAY"
        description="The full-screen boot sequence: a rectangle fades in, loading text decodes while a progress bar fills, the rectangle expands to fill the screen, then the whole overlay dissolves to reveal your app. Drive it with a simple stage counter."
      />

      <DemoCard
        title="LIVE REPLAY"
        importCode={`import { BootOverlay } from "@/components/edex/boot-overlay";`}
        code={`const [stage, setStage] = useState(0);\n// advance 0→6 on a timer, add .booted to the root at stage 5\n<BootOverlay stage={stage} />`}
        height={420}
      >
        <div className="relative h-full overflow-hidden border border-[var(--edex-line)] bg-[var(--edex-bg)]">
          <div className={`absolute inset-0 flex items-center justify-center ${booted ? "booted" : ""}`}>
            <ScrambleText
              text="SYSTEM READY"
              delay={200}
              speed={40}
              active={booted}
              className="edex-glow text-sm tracking-[0.4em] text-[var(--edex-acc)]"
            />
          </div>
          <BootOverlay stage={stage} />
          {stage >= 6 && (
            <button
              onClick={() => setRunId((n) => n + 1)}
              className="absolute bottom-3 right-3 border border-[var(--edex-line)] px-4 py-1.5 text-[10px] tracking-[0.25em] text-[var(--edex-fg-dim)] transition hover:border-[var(--edex-acc)] hover:text-[var(--edex-acc)]"
            >
              ↻ REPLAY BOOT
            </button>
          )}
        </div>
      </DemoCard>
    </div>
  );
}
