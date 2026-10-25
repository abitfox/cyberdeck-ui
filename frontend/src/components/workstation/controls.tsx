"use client";

import { useFx, requestFx } from "@/lib/fx";
import { useFullscreenToggle } from "@/lib/fullscreen";
import { playUiClick } from "@/lib/sfx";

/* Control row under the keyboard: FX (shader background) + full screen.
 * Recreates the original workstation-controls with the business toggles
 * (music / language) removed. */

function FxToggle() {
  const on = useFx();
  return (
    <button
      onClick={() => {
        playUiClick();
        requestFx(!on);
      }}
      className={`text-[10px] tracking-[0.25em] transition ${
        on
          ? "text-[var(--edex-acc)]"
          : "text-[var(--edex-fg-dim)] hover:text-[var(--edex-acc)]"
      }`}
    >
      <span className="opacity-80">◈</span> FX {on ? "ON" : "OFF"}
    </button>
  );
}

function FullscreenToggle() {
  const { fs, toggle } = useFullscreenToggle();
  return (
    <button
      onClick={() => {
        playUiClick();
        void toggle();
      }}
      className={`text-[10px] tracking-[0.25em] transition ${
        fs
          ? "text-[var(--edex-acc)]"
          : "text-[var(--edex-fg-dim)] hover:text-[var(--edex-acc)]"
      }`}
    >
      <span className="opacity-80">⛶</span> {fs ? "EXIT FULL SCREEN" : "FULL SCREEN"}
    </button>
  );
}

export function WorkstationControls() {
  return (
    <div className="boot-seq w-full pb-0.5 pt-1">
      <div className="flex items-center justify-center gap-5">
        <FxToggle />
        <FullscreenToggle />
      </div>
    </div>
  );
}
