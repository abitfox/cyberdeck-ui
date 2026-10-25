"use client";

import { PageIntro } from "@/components/showcase/PageIntro";
import { DemoCard } from "@/components/showcase/DemoCard";
import { VirtualKeyboard } from "@/components/widgets";

/* VirtualKeyboard demo */

export default function VirtualKeyboardPage() {
  return (
    <div className="p-6 lg:p-10">
      <PageIntro
        title="VIRTUALKEYBOARD"
        description="A compact QWERTY widget that lights up when you type on your physical keyboard, or when clicking keys with the mouse. A cheaper, panel-friendly alternative to the full Keyboard."
      />

      <DemoCard
        title="INPUT CHANNEL WIDGET"
        importCode={`import { VirtualKeyboard } from "@/components/widgets";`}
        code={`<VirtualKeyboard />`}
        height={220}
      >
        <VirtualKeyboard />
      </DemoCard>
    </div>
  );
}
