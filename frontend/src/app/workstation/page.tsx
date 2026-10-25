"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SystemPanel } from "@/components/workstation/system-panel";
import { TerminalPanel } from "@/components/workstation/terminal-panel";
import { MissionPanel } from "@/components/workstation/mission-panel";
import { WorkstationControls } from "@/components/workstation/controls";
import { DataStreamPanel } from "@/components/edex/datastream-panel";
import { Keyboard } from "@/components/edex/keyboard";
import { BootOverlay } from "@/components/edex/boot-overlay";
import {
  unlockBootAudio,
  playBootBlip,
  playBootSweep,
  playBootEngage,
} from "@/lib/sfx";

/* Workstation demo · recreates the original HackerEnglish workstation layout:
 *   top row    — SYSTEM | TERMINAL | MISSION   (flex 1 : 2.2 : 1)
 *   bottom row — DATASTREAM | KEYBOARD+controls (flex 1 : 1.35)
 * driven through the same boot-sequence stage machine:
 *   0 standby → 1 rect → 2 loading → 3 expand → 4 overlay fade →
 *   5 booted (content appears) → 6 unmount overlay */

function useIsDesktop() {  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return isDesktop;
}

export default function WorkstationPage() {
  const [stage, setStage] = useState(0);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    // Audio unlock as early as possible; retry on first gesture (direct load case)
    unlockBootAudio();
    const unlock = () => unlockBootAudio();
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);

    // Skip the performance if the boot sequence already ran this session
    if (sessionStorage.getItem("cd.booted") === "1") {
      setStage(6);
      return () => {
        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("keydown", unlock);
      };
    }

    const timers = [
      window.setTimeout(() => {
        setStage(1);
        playBootBlip();
      }, 80),
      // stage 2 的解码声由覆盖层乱码文字的打字 tick 音承担（与解码逐帧同步）
      window.setTimeout(() => setStage(2), 500),
      window.setTimeout(() => {
        setStage(3);
        playBootSweep();
      }, 2200),
      window.setTimeout(() => {
        setStage(4);
        playBootEngage();
      }, 2900),
      // 内容开始显现即视为已开机：面板组件的 boot-delay 均以 3200ms 为基准
      window.setTimeout(() => {
        setStage(5);
        sessionStorage.setItem("cd.booted", "1");
      }, 3200),
      window.setTimeout(() => setStage(6), 5600),
    ];
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return (
    <main
      className={`edex relative h-dvh-safe w-screen overflow-hidden p-2 ${
        stage >= 5 ? "booted" : ""
      }`}
    >
      <div className="mx-auto flex h-fill-safe max-w-[1920px] flex-col gap-2">
        {isDesktop ? (
          <>
            {/* Top row: system | terminal | mission */}
            <div className="grid min-h-0 flex-[3] grid-cols-1 grid-rows-[minmax(0,1fr)] gap-2 lg:grid-cols-[minmax(280px,1fr)_minmax(0,2.2fr)_minmax(280px,1fr)] lg:grid-rows-1">
              <SystemPanel />
              <TerminalPanel />
              <MissionPanel />
            </div>

            {/* Bottom row: datastream | keyboard + controls */}
            <div className="grid min-h-0 flex-[1.15] grid-cols-1 grid-rows-[minmax(0,1fr)] gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:grid-rows-1">
              <DataStreamPanel />
              <div className="flex min-h-0 flex-col">
                <div className="min-h-0 flex-1">
                  <Keyboard />
                </div>
                <WorkstationControls />
              </div>
            </div>
          </>
        ) : (
          /* Mobile: single scrolling column */
          <div className="edex-scroll flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto [overflow-anchor:none]">
            <div className="h-[420px] shrink-0">
              <TerminalPanel />
            </div>
            <div className="min-h-[380px] shrink-0">
              <MissionPanel />
            </div>
            <div className="min-h-[420px] shrink-0">
              <SystemPanel />
            </div>
            <div className="h-[300px] shrink-0">
              <DataStreamPanel />
            </div>
            <div className="h-[240px] shrink-0">
              <Keyboard />
            </div>
            <div className="flex shrink-0 justify-center pb-2">
              <Link
                href="/"
                className="border border-[var(--edex-line)] px-4 py-2 text-[10px] tracking-[0.25em] text-[var(--edex-fg-dim)] transition hover:border-[var(--edex-acc)] hover:text-[var(--edex-acc)]"
              >
                ← BACK HOME
              </Link>
            </div>
          </div>
        )}

        {/* Home link (desktop, subtle chip, clear of panel headers) */}
        {isDesktop && (
          <Link
            href="/"
            className="boot-seq absolute bottom-3 right-3 z-30 border border-[var(--edex-line)] bg-[rgba(5,9,11,0.8)] px-3 py-1.5 text-[9px] tracking-[0.3em] text-[var(--edex-fg-dim)] backdrop-blur transition hover:border-[var(--edex-acc)] hover:text-[var(--edex-acc)]"
            style={({ "--boot-delay": "4600ms" } as React.CSSProperties)}
          >
            ← EXIT DECK
          </Link>
        )}
      </div>
      <BootOverlay stage={stage} />
    </main>
  );
}
