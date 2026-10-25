"use client";

import { useState } from "react";
import { PageIntro } from "@/components/showcase/PageIntro";
import { DemoCard } from "@/components/showcase/DemoCard";
import { Modal } from "@/components/edex/modal";

/* Modal demos: standard popup + intro variant */

export default function ModalPage() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);

  return (
    <div className="p-6 lg:p-10">
      <PageIntro
        title="MODAL"
        description="Dialog shell with two entrance flavors. The backdrop fades in while the panel zoom-floats; the intro variant plays the loud brightness-overshoot entrance — like an encrypted package suddenly popping open. Escape and backdrop-click close it."
      />

      <div className="flex flex-wrap gap-4 text-[11px] tracking-[0.25em]">
        <button
          onClick={() => setPopupOpen(true)}
          className="border border-[var(--edex-acc)] px-5 py-2 text-[var(--edex-acc)] transition hover:bg-[rgba(127,179,186,0.15)]"
        >
          ▶ OPEN POPUP MODAL
        </button>
        <button
          onClick={() => setIntroOpen(true)}
          className="border border-[var(--gold)] px-5 py-2 text-[var(--gold)] transition hover:bg-[rgba(255,215,0,0.1)]"
        >
          ▶ OPEN INTRO MODAL
        </button>
      </div>

      <DemoCard
        title="SOURCE"
        importCode={`import { Modal } from "@/components/edex/modal";`}
        code={`<Modal\n  open={open}\n  onClose={() => setOpen(false)}\n  title="INCOMING TRANSMISSION"\n  variant="popup" | "intro"\n  width={420}\n>\n  <p>Panel content...</p>\n</Modal>`}
        height={120}
      >
        <div className="flex h-full items-center text-[11px] text-[var(--edex-fg-dim)]">
          Click a button above to launch the live modal.
        </div>
      </DemoCard>

      <Modal
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        title="INCOMING TRANSMISSION"
      >
        <p className="text-[var(--edex-fg)]">
          Operative, we intercepted a courier on the darknet. The package is
          sealed with AES-256 and the passphrase rotates every 90 seconds.
        </p>
        <p className="mt-3 text-[var(--edex-fg-dim)]">
          Decode window opens in 00:44. Don&apos;t be late.
        </p>
        <div className="mt-5 flex justify-end gap-3 text-[11px] tracking-[0.2em]">
          <button
            onClick={() => setPopupOpen(false)}
            className="border border-[var(--edex-line)] px-4 py-1.5 text-[var(--edex-fg-dim)] transition hover:text-[var(--edex-fg-bright)]"
          >
            DISMISS
          </button>
          <button
            onClick={() => setPopupOpen(false)}
            className="border border-[var(--edex-acc)] px-4 py-1.5 text-[var(--edex-acc)] transition hover:bg-[rgba(127,179,186,0.15)]"
          >
            ACKNOWLEDGE
          </button>
        </div>
      </Modal>

      <Modal
        open={introOpen}
        onClose={() => setIntroOpen(false)}
        title="PRIORITY BRIEFING"
        variant="intro"
        width={480}
      >
        <p className="edex-glow text-[14px] tracking-[0.15em] text-[var(--edex-fg-bright)]">
          WELCOME TO THE DECK
        </p>
        <p className="mt-3 text-[var(--edex-fg)]">
          This entrance uses the <code className="text-[var(--edex-acc)]">intro</code> variant:
          a large scale-up, brightness overshoot flash and a backdrop blur sweep —
          reserved for the moments that matter.
        </p>
        <div className="mt-5 flex justify-end">
          <button
            onClick={() => setIntroOpen(false)}
            className="border border-[var(--gold)] px-4 py-1.5 text-[11px] tracking-[0.2em] text-[var(--gold)] transition hover:bg-[rgba(255,215,0,0.1)]"
          >
            LET&apos;S GO
          </button>
        </div>
      </Modal>
    </div>
  );
}
