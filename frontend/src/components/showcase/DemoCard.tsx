"use client";

import { useState, type ReactNode } from "react";

/* DemoCard · showcase building block: title, description, live demo area,
 * and a toggleable source snippet. */

interface DemoCardProps {
  title: string;
  description?: string;
  /** JSX import snippet, e.g. `import { Clock } from "cyberdeck-ui"` */
  importCode?: string;
  /** JSX usage snippet shown in the "code" tab */
  code?: string;
  /** Fixed height (px) for the demo area; omit for auto */
  height?: number;
  children: ReactNode;
}

export function DemoCard({
  title,
  description,
  importCode,
  code,
  height = 180,
  children,
}: DemoCardProps) {
  const [tab, setTab] = useState<"demo" | "code">("demo");

  return (
    <section className="boot-seq mb-10">
      <div className="mb-1 flex flex-wrap items-baseline gap-x-3">
        <h2 className="edex-glow text-[15px] tracking-[0.2em] text-[var(--edex-fg-bright)]">
          {title}
        </h2>
        {code && (
          <div className="flex text-[10px] tracking-[0.2em]">
            {(["demo", "code"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`border border-[var(--edex-line)] px-2 py-0.5 transition ${
                  t === "demo" ? "rounded-l-sm" : "rounded-r-sm border-l-0"
                } ${
                  tab === t
                    ? "bg-[rgba(127,179,186,0.18)] text-[var(--edex-acc)]"
                    : "text-[var(--edex-fg-dim)] hover:text-[var(--edex-fg-bright)]"
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
      {description && (
        <p className="mb-3 max-w-3xl text-[11.5px] leading-relaxed text-[var(--edex-fg-dim)]">
          {description}
        </p>
      )}
      {tab === "demo" ? (
        <div
          className="widget !p-3"
          style={height !== undefined ? { height } : undefined}
        >
          {children}
        </div>
      ) : (
        <pre className="widget !p-3 overflow-x-auto text-[11px] leading-relaxed text-[var(--edex-fg)]">
          {importCode && (
            <>
              <span className="text-[var(--edex-fg-dim)]">{importCode}</span>
              {"\n\n"}
            </>
          )}
          {code}
        </pre>
      )}
    </section>
  );
}
