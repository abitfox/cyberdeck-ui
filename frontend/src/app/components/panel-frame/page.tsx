"use client";

import { PageIntro } from "@/components/showcase/PageIntro";
import { DemoCard } from "@/components/showcase/DemoCard";
import { PanelFrame } from "@/components/edex/panel-frame";
import { ScrambleText } from "@/components/edex/scramble-text";
import { CPUWave, ProcessTable } from "@/components/widgets";

/* PanelFrame demos: static labels, scramble labels, loader placeholder */

export default function PanelFramePage() {
  return (
    <div className="p-6 lg:p-10">
      <PageIntro
        title="PANELFRAME"
        description="The structural backbone: bordered section with header labels and a divider line. Labels can decode via ScrambleText on boot, and a blinking LOADING placeholder can cover the gap before content appears. All dashboard widgets sit inside one of these."
      />

      <DemoCard
        title="BASIC"
        importCode={`import { PanelFrame } from "@/components/edex/panel-frame";`}
        code={`<PanelFrame leftLabel="TELEMETRY" rightLabel="LIVE">\n  <CpuStatus ... />\n</PanelFrame>`}
        height={220}
      >
        <PanelFrame leftLabel="TELEMETRY" rightLabel="LIVE" className="h-full">
          <div className="p-2">
            <CPUWave status="running" />
          </div>
        </PanelFrame>
      </DemoCard>

      <DemoCard
        title="BOOT CHOREOGRAPHY"
        description="labelScrambleAt delays label decoding; loaderDelay fades the blinking LOADING placeholder once content appears. Pair with the .booted class on a root element."
        code={`<PanelFrame\n  leftLabel="PROCESSES"\n  labelScrambleAt={3000}\n  loaderDelay={2200}\n>\n  <ProcessTable />\n</PanelFrame>`}
        height={220}
      >
        <PanelFrame
          leftLabel="PROCESSES"
          rightLabel="SYS"
          labelScrambleAt={800}
          loaderDelay={1600}
          className="h-full"
        >
          <div className="p-2 boot-seq" style={{ "--boot-delay": "1500ms" } as React.CSSProperties}>
            <ProcessTable />
          </div>
        </PanelFrame>
      </DemoCard>
    </div>
  );
}
