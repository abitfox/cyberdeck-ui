import { PageIntro } from "@/components/showcase/PageIntro";

/* Theme & color system page (static, no client JS needed) */

const CORE_VARS: Array<[string, string, string]> = [
  ["--bg", "#05090b", "page background"],
  ["--primary", "#7fb3ba", "primary accent"],
  ["--success", "#00ff00", "success state"],
  ["--warning", "#ffaa00", "warning state"],
  ["--error", "#ff4444", "error state"],
  ["--gold", "#ffd700", "highlight / reward"],
];

const EDEX_VARS: Array<[string, string, string]> = [
  ["--edex-bg", "#05090b", "deep background"],
  ["--edex-bg-2", "#070d10", "widget background"],
  ["--edex-line", "rgba(170,200,205,.22)", "hairline border"],
  ["--edex-line-strong", "rgba(170,200,205,.4)", "strong border"],
  ["--edex-fg", "#a9c6ca", "body text"],
  ["--edex-fg-bright", "#d7ecee", "emphasized text"],
  ["--edex-fg-dim", "#5c757a", "secondary text"],
  ["--edex-acc", "#7fb3ba", "accent / focus"],
];

const UTILITIES: Array<[string, string]> = [
  [".hacker-bg", "fixed 32px grid backdrop (use on <html> or a wrapper)"],
  [".edex-scanlines", "fixed CRT scanline overlay (use on a root element)"],
  [".edex-glow", "neon text glow"],
  [".widget / .widget-title", "standard panel shell + label"],
  [".edex-panel-label", "small uppercase spaced label"],
  [".hairline", "0.5px input underline with focus + data-tone=ok|warn|err"],
  [".boot-seq / .booted", "staggered reveal, driven by --boot-delay"],
  [".enter-seq", "mount-time staggered entrance"],
  [".popup-bg / .popup-panel", "modal backdrop + panel entrance"],
  [".intro-bg / .intro-panel", "loud “decompression” modal entrance"],
  [".type-caret", "blinking typewriter caret"],
  [".blink / .breathe / .eq-bar", "blink / breathing glow / equalizer bar"],
  [".edex-cursor / .edex-spin / .edex-scroll", "terminal cursor / 60s spin / themed scrollbar"],
];

function VarTable({ title, vars }: { title: string; vars: Array<[string, string, string]> }) {
  return (
    <section className="boot-seq mb-10">
      <h2 className="edex-panel-label mb-3">{title}</h2>
      <div className="grid gap-1.5 sm:grid-cols-2">
        {vars.map(([name, value, usage]) => (
          <div key={name} className="widget flex items-center gap-3 !py-2">
            <span
              className="h-6 w-6 flex-none border border-[var(--edex-line)]"
              style={{ background: value }}
            />
            <div className="min-w-0 text-[11px] leading-tight">
              <div className="text-[var(--edex-fg-bright)]">{name}</div>
              <div className="text-[var(--edex-fg-dim)]">
                {value} — {usage}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ThemePage() {
  return (
    <div className="p-6 lg:p-10">
      <PageIntro
        title="THEME & COLORS"
        description="The whole design system is driven by CSS variables — override them on :root to re-tint every component at once. Below: the core palette, the eDEX panel palette, and the utility classes that make up the aesthetic."
      />

      <VarTable title="// CORE PALETTE (:root)" vars={CORE_VARS} />
      <VarTable title="// EDEX PANEL PALETTE (:root)" vars={EDEX_VARS} />

      <section className="boot-seq mb-10">
        <h2 className="edex-panel-label mb-3">{"// UTILITY CLASSES"}</h2>
        <div className="widget space-y-1.5 text-[11.5px]">
          {UTILITIES.map(([cls, usage]) => (
            <div key={cls} className="flex flex-wrap gap-x-3">
              <code className="text-[var(--edex-acc)]">{cls}</code>
              <span className="text-[var(--edex-fg-dim)]">{usage}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="boot-seq mb-10">
        <h2 className="edex-panel-label mb-3">{"// TYPE SAMPLE"}</h2>
        <div className="widget space-y-2 text-[12px]">
          <div className="edex-glow text-[var(--edex-fg-bright)]">BRIGHT — Connection established. Welcome back, operative.</div>
          <div className="text-[var(--edex-fg)]">BODY — Twelve packets decoded in the last minute.</div>
          <div className="text-[var(--edex-fg-dim)]">DIM — Signal decays in 00:44. Move fast.</div>
          <div className="text-[var(--text-faint)]">FAINT — faint metadata text</div>
        </div>
      </section>

      <section className="boot-seq">
        <h2 className="edex-panel-label mb-3">{"// HAIRLINE INPUT TONES"}</h2>
        <div className="widget grid gap-6 sm:grid-cols-2">
          {(["", "ok", "warn", "err"] as const).map((tone) => (
            <label key={tone || "default"} className="block">
              <span className="edex-panel-label">{tone ? `TONE = ${tone}` : "DEFAULT"}</span>
              <div className="hairline mt-1" data-tone={tone || undefined}>
                <input
                  className="w-full bg-transparent pb-1.5 text-[12px] text-[var(--edex-fg-bright)] outline-none"
                  placeholder="type something..."
                />
              </div>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
