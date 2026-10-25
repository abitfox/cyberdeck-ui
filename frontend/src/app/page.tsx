"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BootOverlay } from "@/components/edex/boot-overlay";
import { ScrambleText } from "@/components/edex/scramble-text";

/* Boot sequence stage machine (drives BootOverlay):
 * 0 standby → 1 rect fade-in → 2 loading text + progress → 3 expand →
 * 4 overlay fade-out → 5 booted (content appears) → 6 unmount overlay */
const BOOT_AT = [400, 900, 2100, 2850, 3400, 4200] as const;

const seq = (d: number) => ({ "--boot-delay": `${d}ms` }) as React.CSSProperties;

const HIGHLIGHTS: Array<{ href: string; title: string; desc: string }> = [
  {
    href: "/workstation",
    title: "WORKSTATION",
    desc: "A full hacker-desktop assembled from the kit — boot it and look around.",
  },
  {
    href: "/components/theme",
    title: "THEME SYSTEM",
    desc: "Every color, scanline and glow driven by CSS variables.",
  },
  {
    href: "/components/scramble-text",
    title: "SIGNATURE EFFECTS",
    desc: "Scramble decode, boot sequences, CRT overlays, glitch modals.",
  },
];

export default function Home() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = BOOT_AT.map((ms, i) =>
      window.setTimeout(() => setStage(i + 1), ms),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`relative z-10 h-dvh-safe ${stage >= 5 ? "booted" : ""}`}>
      <BootOverlay stage={stage} />

      <main className="h-full overflow-y-auto edex-scroll">
        {/* ============ Hero ============ */}
        <section className="flex min-h-[86vh] flex-col items-center justify-center px-6 text-center">
          <div className="boot-seq mb-4" style={seq(100)}>
            <ScrambleText
              text="CYBERDECK UI"
              speed={55}
              churn={[4, 12]}
              className="edex-glow text-4xl font-bold tracking-[0.35em] text-[var(--edex-fg-bright)] sm:text-6xl"
            />
          </div>

          <div className="boot-seq mt-5 max-w-2xl" style={seq(600)}>
            <ScrambleText
              text="A cyberpunk / hacker-workstation React UI kit — CRT scanlines, boot sequences, scramble decoding and live telemetry widgets."
              delay={400}
              speed={14}
              className="text-[13px] leading-relaxed text-[var(--edex-fg-dim)]"
            />
          </div>

          <div className="boot-seq mt-10 flex flex-wrap items-center justify-center gap-4" style={seq(1400)}>
            <Link
              href="/workstation"
              className="border border-[var(--edex-acc)] bg-[rgba(127,179,186,0.12)] px-6 py-2.5 text-[12px] tracking-[0.3em] text-[var(--edex-acc)] transition hover:bg-[rgba(127,179,186,0.25)]"
            >
              ▶ ENTER WORKSTATION
            </Link>
            <Link
              href="/components/theme"
              className="border border-[var(--edex-line)] px-6 py-2.5 text-[12px] tracking-[0.3em] text-[var(--edex-fg-dim)] transition hover:border-[var(--edex-acc)] hover:text-[var(--edex-acc)]"
            >
              BROWSE COMPONENTS
            </Link>
            <a
              href="https://github.com/abitfox/cyberdeck-ui"
              target="_blank"
              className="border border-[var(--edex-line)] px-6 py-2.5 text-[12px] tracking-[0.3em] text-[var(--edex-fg-dim)] transition hover:border-[var(--edex-acc)] hover:text-[var(--edex-acc)]"
            >
              ★ GITHUB
            </a>
          </div>

          <div className="boot-seq mt-8 flex items-center gap-2 text-[10px] tracking-[0.3em] text-[var(--text-faint)]" style={seq(2000)}>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#8fe3a8] breathe" />
            SYSTEM ONLINE · MIT LICENSED · REACT 18 + TAILWIND
          </div>
        </section>

        {/* ============ Highlights ============ */}
        <section className="mx-auto grid max-w-5xl gap-2.5 px-4 pb-16 text-left md:grid-cols-3">
          {HIGHLIGHTS.map((h, i) => (
            <Link
              key={h.href}
              href={h.href}
              className="boot-seq widget group transition-colors hover:border-[var(--edex-acc)]"
              style={seq(2600 + i * 200)}
            >
              <div className="edex-glow mb-1.5 text-[12px] tracking-[0.3em] text-[var(--edex-fg-bright)] group-hover:text-[var(--edex-acc)]">
                {h.title}
              </div>
              <div className="text-[11px] leading-relaxed text-[var(--edex-fg-dim)]">
                {h.desc}
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
