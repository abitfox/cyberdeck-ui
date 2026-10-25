"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { PanelFrame } from "@/components/edex/panel-frame";
import { playTerminalPrint } from "@/lib/sfx";

/* Mock terminal panel · recreates the original workstation's center column:
 * tab bar (TERM / DECODE / DRILL), a scrolling output feed and an input
 * line that understands a few canned commands. */

interface Line {
  id: number;
  text: string;
  tone: "cmd" | "out" | "ok" | "err";
}

const TONE_CLS: Record<Line["tone"], string> = {
  cmd: "text-[var(--edex-fg-bright)]",
  out: "text-[var(--edex-fg)]",
  ok: "text-[#8fe3a8]",
  err: "text-[#ff6b6b]",
};

const BOOT_SCRIPT: Array<[string, Line["tone"], number]> = [
  ["cyberdeck-os 1.0 — secure shell established", "out", 0],
  ["channel encrypted · AES-256-GCM", "out", 300],
  ["3 nodes online · 0 threats detected", "ok", 700],
  ["type `help` for available commands", "out", 1100],
];

const HELP_LINES: Array<[string, Line["tone"]]> = [
  ["available commands:", "out"],
  ["  help     — this list", "out"],
  ["  status   — workstation status", "out"],
  ["  scan     — scan the local mesh", "out"],
  ["  clear    — wipe the terminal", "out"],
];

function ScanResult() {
  const nodes = 2 + Math.floor(Math.random() * 5);
  return [
    [`scanning local mesh ...`, "out"],
    [`${nodes} nodes found · all signatures clean`, "ok"],
  ] as Array<[string, Line["tone"]]>;
}

export function TerminalPanel() {
  const [tab, setTab] = useState<"TERM" | "DECODE" | "DRILL">("TERM");
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const push = (text: string, tone: Line["tone"] = "out") => {
    setLines((prev) => [
      ...prev.slice(-80),
      { id: idRef.current++, text, tone },
    ]);
  };

  useEffect(() => {
    const timers = BOOT_SCRIPT.map(([text, tone, delay]) =>
      window.setTimeout(() => {
        playTerminalPrint();
        push(text, tone);
      }, 1200 + delay),
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const submit = () => {
    const cmd = value.trim();
    if (!cmd) return;
    setValue("");
    push(`> ${cmd}`, "cmd");
    const lower = cmd.toLowerCase();
    if (lower === "clear") {
      setLines([]);
    } else if (lower === "help") {
      HELP_LINES.forEach(([t, tone]) => push(t, tone));
    } else if (lower === "status") {
      push("deck: NOMINAL · link: STABLE · threat level: LOW", "ok");
    } else if (lower === "scan") {
      ScanResult().forEach(([t, tone]) => push(t, tone));
    } else {
      push(`unknown command: ${cmd}`, "err");
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  const TABS = ["TERM", "DECODE", "DRILL"] as const;

  return (
    <PanelFrame leftLabel="TERMINAL" rightLabel="CYBERDECK OS" className="h-full">
      <div className="flex h-full min-h-0 flex-col">
        {/* Tab bar */}
        <nav className="flex shrink-0 gap-1 px-2 pt-1.5">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`border px-2.5 py-1 text-[9px] tracking-[0.25em] transition ${
                tab === t
                  ? "border-[var(--edex-acc)] bg-[rgba(170,200,205,0.1)] text-[var(--edex-acc)]"
                  : "border-[var(--edex-line)] text-[var(--edex-fg-dim)] hover:text-[var(--edex-fg)]"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>

        {tab === "TERM" ? (
          <>
            {/* Output */}
            <div
              ref={scrollRef}
              className="edex-scroll min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-2 text-[11px] leading-relaxed [overflow-anchor:none]"
            >
              {lines.map((l) => (
                <div key={l.id} className={`whitespace-pre-wrap ${TONE_CLS[l.tone]}`}>
                  {l.text}
                </div>
              ))}
            </div>
            {/* Input line */}
            <div className="hairline mx-3 mb-2.5 flex shrink-0 items-center gap-2" data-tone="ok">
              <span className="text-[12px] text-[var(--edex-acc)]">❯</span>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                className="type-caret w-full bg-transparent py-1.5 text-[12px] text-[var(--edex-fg-bright)] outline-none"
                placeholder="enter command..."
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </>
        ) : (
          <div className="flex min-h-0 flex-1 items-center justify-center px-4 text-center">
            <p className="edex-panel-label">
              {tab === "DECODE"
                ? "// DECODE TAB — hook up your own puzzle engine here"
                : "// DRILL TAB — hook up your own training drills here"}
            </p>
          </div>
        )}
      </div>
    </PanelFrame>
  );
}
