"use client";

import { useEffect, useState } from "react";

/* Clock · big white hh:mm, cyan seconds, dim subtitle lines below */

interface ClockProps {
  /** Subtitle lines rendered under the time (mock flavor text) */
  lines?: string[];
}

export function Clock({ lines = ["MISSION DAY 07 · CH.2", "DARKNET TRACE · Lv5"] }: ClockProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return (
    <div className="widget h-full flex flex-col justify-center">
      <div>
        <span className="text-[26px] leading-none text-[var(--edex-fg-bright)]">{hh}:{mm}</span>
        <span className="text-[26px] leading-none text-[var(--edex-acc)]">:{ss}</span>
      </div>
      <div className="mt-1 space-y-0.5 text-[10px] text-[var(--edex-fg-dim)]">
        {lines.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
    </div>
  );
}
