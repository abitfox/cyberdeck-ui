"use client";

import { useEffect, useState } from "react";

/* Data stream · fake terminal log feed, newest at the bottom, keeps last 50 lines */

const LOG_TEMPLATES = [
  "COMMS INTERCEPT success",
  "SIGNAL ANALYSIS running...",
  "PACKET encrypted",
  "HQ acknowledged",
  "AGENT Q online",
  "TARGET LONDON 51.5074°N",
  "CIPHER AES-256",
  "LINK stable",
  "HEARTBEAT nominal",
  "KEY ROTATION complete",
];

function randomHex(prefix: string) {
  let s = "";
  for (let i = 0; i < 6; i++) s += "0123456789abcdef"[Math.floor(Math.random() * 16)];
  return prefix + s;
}

const COLORS = ["var(--edex-acc)", "#00ff00", "#888888"];

interface DataStreamProps {
  /** Milliseconds between generated log lines */
  intervalMs?: number;
}

export function DataStream({ intervalMs = 200 }: DataStreamProps) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const gen = () => {
      const tpl = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
      setLogs((prev) => [...prev.slice(-49), `${randomHex("0x")} ${tpl}`]);
    };
    for (let i = 0; i < 20; i++) gen();
    const t = setInterval(gen, intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);

  return (
    <div className="widget h-full">
      <div className="widget-title">DATA STREAM</div>
      <div className="h-[calc(100%-18px)] overflow-hidden flex flex-col justify-end">
        {logs.map((l, i) => (
          <div
            key={i}
            className="text-[9.5px] leading-tight truncate"
            style={{ color: COLORS[i % 3] }}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}
