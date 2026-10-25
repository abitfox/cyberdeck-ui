"use client";

import { PageIntro } from "@/components/showcase/PageIntro";
import { DemoCard } from "@/components/showcase/DemoCard";
import { DataStreamPanel } from "@/components/edex/datastream-panel";

/* DataStreamPanel demo: organic-rhythm intercept log */

export default function DataStreamPanelPage() {
  return (
    <div className="p-6 lg:p-10">
      <PageIntro
        title="DATASTREAMPANEL"
        description="An intercept-log panel with organic rhythm: each line decodes in via ScrambleText, then the next appears after a random 1–5s breathing gap — deliberately avoiding the mechanical fixed-frequency feel. Lines auto-scroll and are capped at 50."
      />

      <DemoCard
        title="STANDALONE"
        importCode={`import { DataStreamPanel } from "@/components/edex/datastream-panel";`}
        code={`<DataStreamPanel />`}
        height={420}
      >
        <DataStreamPanel />
      </DemoCard>
    </div>
  );
}
