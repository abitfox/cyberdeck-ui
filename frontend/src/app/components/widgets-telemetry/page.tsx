"use client";

import { useEffect, useState } from "react";
import { PageIntro } from "@/components/showcase/PageIntro";
import { DemoCard } from "@/components/showcase/DemoCard";
import { AudioWave, CPUWave, DataStream, TaskCountdown } from "@/components/widgets";

/* Telemetry widgets: canvas-driven CPU/Audio waves, log stream, countdown state machine */

function DemoCountdown() {
  const [state, setState] = useState<"running" | "warning" | "critical" | "expired">("running");
  const [remaining, setRemaining] = useState(74);

  useEffect(() => {
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setState("expired");
          return 0;
        }
        const next = r - 1;
        if (next <= 10) setState("critical");
        else if (next <= 25) setState("warning");
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <div className="h-32 w-40">
        <TaskCountdown state={state} remaining={remaining} total={120} />
      </div>
      <button
        onClick={() => {
          setRemaining(74);
          setState("running");
        }}
        className="text-[10px] tracking-[0.25em] text-[var(--edex-fg-dim)] transition hover:text-[var(--edex-acc)]"
      >
        ↻ RESTART
      </button>
    </div>
  );
}

export default function WidgetsTelemetryPage() {
  return (
    <div className="p-6 lg:p-10">
      <PageIntro
        title="TELEMETRY WIDGETS"
        description="Canvas-driven live widgets: CPU wave, audio equalizer, a log stream and a full countdown state machine whose color and blink rate escalate as time runs out. Everything is props-driven and loops forever on requestAnimationFrame."
      />

      <DemoCard
        title="CPU WAVE"
        importCode={`import { CPUWave } from "@/components/widgets";`}
        code={`<CPUWave status="running" />\n<CPUWave status="idle" />\n<CPUWave status="error" />`}
        height={170}
      >
        <div className="grid h-full grid-cols-3 gap-3">
          <CPUWave status="running" />
          <CPUWave status="idle" label="CPU LOAD · IDLE" />
          <CPUWave status="error" label="CPU LOAD · ERR" />
        </div>
      </DemoCard>

      <DemoCard
        title="AUDIO WAVE"
        importCode={`import { AudioWave } from "@/components/widgets";`}
        code={`<AudioWave mode="speaking" />\n<AudioWave mode="thinking" />\n<AudioWave mode="satisfied" />`}
        height={170}
      >
        <div className="grid h-full grid-cols-3 gap-3">
          <AudioWave mode="speaking" label="AUDIO · SPEAKING" />
          <AudioWave mode="thinking" label="AUDIO · THINKING" />
          <AudioWave mode="satisfied" label="AUDIO · DONE" />
        </div>
      </DemoCard>

      <DemoCard
        title="DATA STREAM"
        importCode={`import { DataStream } from "@/components/widgets";`}
        code={`<DataStream intervalMs={200} />`}
        height={200}
      >
        <DataStream />
      </DemoCard>

      <DemoCard
        title="TASK COUNTDOWN"
        description="States: idle → armed → running → warning → critical → expired. Color steps down from green to red and the blink rate accelerates near expiry."
        importCode={`import { TaskCountdown } from "@/components/widgets";`}
        code={`<TaskCountdown state="running" remaining={74} total={120} />`}
        height={230}
      >
        <DemoCountdown />
      </DemoCard>
    </div>
  );
}
