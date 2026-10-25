"use client";

import { useEffect, useState } from "react";

/* System status · uptime counter, fake OS / battery readout */

interface SystemStatusProps {
  os?: string;
}

export function SystemStatus({ os = "Linux 6.9.0-deck" }: SystemStatusProps) {
  const [now, setNow] = useState(() => new Date());
  const [battery, setBattery] = useState(87);
  const [charging, setCharging] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setBattery((b) => Math.min(100, Math.max(80, b + (Math.random() - 0.5) * 4)));
      setCharging((c) => (Math.random() < 0.1 ? !c : c));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const fmt = (d: Date) => d.toISOString().slice(0, 19).replace("T", " ");

  const [uptime, setUptime] = useState("02:34:17");
  useEffect(() => {
    let sec = 2 * 3600 + 34 * 60 + 17;
    const t = setInterval(() => {
      sec++;
      const h = String(Math.floor(sec / 3600)).padStart(2, "0");
      const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
      const s = String(sec % 60).padStart(2, "0");
      setUptime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="widget h-full">
      <div className="widget-title">SYSTEM</div>
      <div className="text-[11px] leading-relaxed">
        <div>
          <span className="text-[var(--edex-fg-dim)]">UPTIME </span>
          <span className="text-[var(--edex-fg-bright)]">{uptime}</span>
        </div>
        <div>
          <span className="text-[var(--edex-fg-dim)]">OS </span>
          <span className="text-[var(--edex-fg-bright)]">{os}</span>
        </div>
        <div>
          <span className="text-[var(--edex-fg-dim)]">POWER </span>
          <span className={charging ? "text-[#8fe3a8]" : "text-[#ffcc77]"}>
            {charging ? "⚡ Charging" : "Discharging"} {Math.round(battery)}%
          </span>
        </div>
        <div className="text-[var(--edex-fg-dim)]">{fmt(now)}</div>
      </div>
    </div>
  );
}
