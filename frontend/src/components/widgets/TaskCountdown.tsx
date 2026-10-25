"use client";

import { useEffect, useState } from "react";

/* Task countdown · full state machine; color and blink rate follow remaining time.
 * Controlled component: state / remaining / total all come from props. */

export type CountdownState = "idle" | "armed" | "running" | "warning" | "critical" | "expired";

function getColor(state: CountdownState, ratio: number): string {
  if (state === "expired" || (state === "running" && ratio <= 0.1)) return "#ff6b6b";
  if (state === "critical") return "#ff6b6b";
  if (state === "warning") return "#ffcc77";
  if (ratio > 0.5) return "#00ff00";
  if (ratio > 0.2) return "#88ff00";
  return "#ffcc77";
}

function getFreq(state: CountdownState, ratio: number, remaining: number): number {
  if (state === "idle" || state === "expired") return 0;
  if (ratio > 0.8) return 2000;
  if (ratio > 0.5) return 1000;
  if (ratio > 0.2) return 500;
  if (remaining > 10) return 250;
  return 125;
}

const STATE_LABEL: Record<CountdownState, string> = {
  idle: "NOT ARMED",
  armed: "ARMED",
  running: "INTERCEPTING",
  warning: "INTERCEPTING",
  critical: "INTERCEPTING",
  expired: "SIGNAL LOST",
};

interface TaskCountdownProps {
  state?: CountdownState;
  remaining?: number;
  total?: number;
}

export function TaskCountdown({ state = "idle", remaining = 0, total = 120 }: TaskCountdownProps) {
  const [blink, setBlink] = useState(true);

  const ratio = total > 0 ? remaining / total : 1;
  const color = getColor(state, ratio);
  const freq = getFreq(state, ratio, remaining);

  useEffect(() => {
    if (freq === 0) {
      setBlink(true);
      return;
    }
    const t = setInterval(() => setBlink((b) => !b), freq);
    return () => clearInterval(t);
  }, [freq]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="widget h-full flex flex-col justify-center">
      <div className="widget-title">TIME REMAINING</div>
      <div
        className="text-[30px] leading-none font-bold text-center"
        style={{ color, opacity: freq === 0 ? 1 : blink ? 1 : 0.3 }}
      >
        {state === "idle" ? "--:--" : fmt(remaining)}
      </div>
      {/* Progress bar */}
      <div className="mt-2 h-1.5 w-full bg-[#111] rounded-sm overflow-hidden">
        <div
          className="h-full transition-[width] duration-1000"
          style={{
            width: `${state === "idle" ? 0 : ratio * 100}%`,
            background: color,
          }}
        />
      </div>
      <div className="mt-1 text-center text-[10px] text-[var(--edex-fg-dim)]">
        {STATE_LABEL[state]}
      </div>
    </div>
  );
}
