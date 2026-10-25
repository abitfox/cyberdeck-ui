"use client";

import { useEffect, useState } from "react";

/* Virtual keyboard · keys light up on click or physical key press */

const ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

export function VirtualKeyboard() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase();
      if (k.length === 1 && "QWERTYUIOPASDFGHJKLZXCVBNM".includes(k)) setActive(k);
    };
    const up = () => setActive(null);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  return (
    <div className="widget h-full">
      <div className="widget-title">INPUT CHANNEL</div>
      <div className="flex h-[calc(100%-18px)] flex-col items-center justify-center gap-2">
        {ROWS.map((row, r) => (
          <div key={r} className="flex gap-1.5">
            {row.split("").map((k) => (
              <button
                key={k}
                className="flex h-9 w-8 items-center justify-center rounded border text-[12px] transition-colors duration-100"
                style={{
                  background: active === k ? "var(--edex-acc)" : "rgba(0,0,0,0.45)",
                  borderColor: active === k ? "var(--edex-acc)" : "rgba(150,220,225,0.35)",
                  color: active === k ? "#fff" : "#eee",
                }}
                onMouseDown={() => setActive(k)}
                onMouseUp={() => setActive(null)}
              >
                {k}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
