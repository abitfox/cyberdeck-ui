"use client";

import { PageIntro } from "@/components/showcase/PageIntro";
import { DemoCard } from "@/components/showcase/DemoCard";
import { Clock, Funds, NetworkStatus, NFTCard, ProcessTable, SystemStatus } from "@/components/widgets";

/* Status widgets: Clock, NetworkStatus, SystemStatus, Funds, ProcessTable, NFTCard */

export default function WidgetsStatusPage() {
  return (
    <div className="p-6 lg:p-10">
      <PageIntro
        title="STATUS WIDGETS"
        description="Small dashboard widgets built on the .widget shell. All data is either mock-generated or passed in as props — nothing is wired to a backend. Drop them into a PanelFrame or use standalone."
      />

      <DemoCard
        title="CLOCK"
        importCode={`import { Clock } from "@/components/widgets";`}
        code={`<Clock />\n<Clock lines={["MISSION DAY 12 · CH.4", "GHOST PROTOCOL · Lv9"]} />`}
        height={120}
      >
        <div className="grid h-full grid-cols-2 gap-3">
          <Clock />
          <Clock lines={["MISSION DAY 12 · CH.4", "GHOST PROTOCOL · Lv9"]} />
        </div>
      </DemoCard>

      <DemoCard
        title="NETWORK + SYSTEM"
        importCode={`import { NetworkStatus, SystemStatus } from "@/components/widgets";`}
        code={`<NetworkStatus basePing={12} ip="10.0.7.42" protocol="HACK-443" />\n<SystemStatus os="Linux 6.9.0-deck" />`}
        height={150}
      >
        <div className="grid h-full grid-cols-2 gap-3">
          <NetworkStatus />
          <SystemStatus />
        </div>
      </DemoCard>

      <DemoCard
        title="FUNDS + PROCESS TABLE"
        importCode={`import { Funds, ProcessTable } from "@/components/widgets";`}
        code={`<Funds points={12480} multiplier={2.5} />\n<ProcessTable processes={[\n  { name: "COMMS INTERCEPT", status: "running" },\n  { name: "AI GRADER", status: "waiting" },\n]} />`}
        height={150}
      >
        <div className="grid h-full grid-cols-2 gap-3">
          <Funds />
          <ProcessTable />
        </div>
      </DemoCard>

      <DemoCard
        title="NFT CARD"
        description="Dynamic SVG agent badge — badge color follows level, frame turns gold when graduated."
        importCode={`import { NFTCard } from "@/components/widgets";`}
        code={`<NFTCard level={7} accuracy={94} name="NETWORK GHOST" />\n<NFTCard level={10} graduated name="LEGEND" />`}
        height={120}
      >
        <div className="grid h-full grid-cols-2 gap-3">
          <NFTCard level={7} accuracy={94} name="NETWORK GHOST" />
          <NFTCard level={10} accuracy={99} name="LEGEND" graduated />
        </div>
      </DemoCard>
    </div>
  );
}
