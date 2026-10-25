"use client";

import { useState } from "react";
import { PageIntro } from "@/components/showcase/PageIntro";
import { DemoCard } from "@/components/showcase/DemoCard";

/* HairlineInput demo: the .hairline CSS pattern with semantic tones */

type Tone = "" | "ok" | "warn" | "err";

export default function HairlineInputPage() {
  const [value, setValue] = useState("agent-007");

  return (
    <div className="p-6 lg:p-10">
      <PageIntro
        title="HAIRLINE INPUT"
        description="A pure-CSS input pattern: a 0.5px visual underline (exactly 1 physical pixel on HiDPI — fixes the thick-border look under Windows scaling) that brightens on focus and accepts semantic tones via data-tone."
      />

      <DemoCard
        title="TONES"
        importCode={`// no component — compose it yourself with two classes`}
        code={`<div className="hairline" data-tone="ok">\n  <input className="w-full bg-transparent pb-1.5 outline-none" />\n</div>\n\n/* tones: (none) default → accent on focus\n   ok → accent always · warn → #ffcc77 · err → #ff6b6b */`}
        height={260}
      >
        <div className="grid h-full content-center gap-8 sm:grid-cols-2">
          {(["", "ok", "warn", "err"] as const).map((tone) => (
            <label key={tone || "default"} className="block">
              <span className="edex-panel-label">{tone ? `DATA-TONE = ${tone}` : "DEFAULT (FOCUS TO ACTIVATE)"}</span>
              <div className="hairline mt-2" data-tone={tone || undefined}>
                <input
                  value={tone === "" ? value : undefined}
                  onChange={tone === "" ? (e) => setValue(e.target.value) : undefined}
                  className="w-full bg-transparent pb-1.5 text-[12px] text-[var(--edex-fg-bright)] outline-none"
                  placeholder={tone === "" ? "" : "type something..."}
                />
              </div>
            </label>
          ))}
        </div>
      </DemoCard>
    </div>
  );
}
