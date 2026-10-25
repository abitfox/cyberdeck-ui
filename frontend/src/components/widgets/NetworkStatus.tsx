"use client";

import { useEffect, useState } from "react";

/* Network status · mock ping jitter + fake connection details */

interface NetworkStatusProps {
  /** Base ping in ms; the widget jitters ±20ms around it */
  basePing?: number;
  ip?: string;
  protocol?: string;
}

export function NetworkStatus({ basePing = 12, ip = "10.0.7.42", protocol = "HACK-443" }: NetworkStatusProps) {
  const [ping, setPing] = useState(basePing);

  useEffect(() => {
    const t = setInterval(
      () => setPing(basePing + Math.floor(Math.random() * 41)),
      1500,
    );
    return () => clearInterval(t);
  }, [basePing]);

  return (
    <div className="widget h-full">
      <div className="widget-title">NETWORK</div>
      <div className="text-[11px] leading-relaxed">
        <div>
          <span className="text-[var(--edex-fg-dim)]">STATUS </span>
          <span className="text-[#8fe3a8]">● ONLINE</span>
        </div>
        <div>
          <span className="text-[var(--edex-fg-dim)]">IP </span>
          <span className="text-[var(--edex-fg-bright)]">{ip}</span>
        </div>
        <div>
          <span className="text-[var(--edex-fg-dim)]">PING </span>
          <span className="text-[var(--edex-acc)]">{ping}ms</span>
        </div>
        <div>
          <span className="text-[var(--edex-fg-dim)]">PROTOCOL </span>
          <span className="text-[var(--edex-fg-bright)]">{protocol}</span>
        </div>
      </div>
    </div>
  );
}
