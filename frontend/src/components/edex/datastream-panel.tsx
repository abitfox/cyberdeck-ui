"use client";

import { useEffect, useRef, useState } from "react";
import { PanelFrame } from "./panel-frame";
import { ScrambleText } from "./scramble-text";

/** 数据流日志模板（就地双语，makeLog 运行时按当前语言取值） */
const TEMPLATES: string[] = [
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
  "NODE MESH route updated",
  "INTEL DB index rebuilt",
];

function makeLog() {
  const addr = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .padStart(4, "0");
  const tpl = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
  const status = Math.random() > 0.5 ? "0x00" : "OK";
  return `0x7f${addr}...  ${tpl}  ${status}`;
}

interface LogLine {
  id: number;
  text: string;
  /** 行配色档位：0 亮 / 1 中 / 2 暗 */
  tone: 0 | 1 | 2;
}

/** 开机后数据流压轴启动（晚于键盘与左右侧组件），首行前再留呼吸空隙 */
const STREAM_START_AT = 4600;
const GAP_MIN = 1000;
const GAP_MAX = 5000;
const MAX_LINES = 50;

/**
 * 底部左侧数据流面板（对应设计文档 3.11，eDEX FILESYSTEM 位）。
 * 有机节奏：每行先以乱码打字机解码浮现，随后随机 1~5 秒的
 * 呼吸间隔，下一行再同样浮现——拒绝固定频率的机械感。
 */
export function DataStreamPanel() {
  const [lines, setLines] = useState<LogLine[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    let timer: number;
    let cancelled = false;

    const push = () => {
      if (cancelled) return;
      const r = Math.random();
      setLines((prev) => [
        ...prev.slice(-(MAX_LINES - 1)),
        {
          id: idRef.current++,
          text: makeLog(),
          tone: r < 0.14 ? 0 : r < 0.45 ? 1 : 2,
        },
      ]);
      timer = window.setTimeout(
        push,
        GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN),
      );
    };

    timer = window.setTimeout(push, STREAM_START_AT);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const toneColor = (tone: 0 | 1 | 2) =>
    tone === 0
      ? "var(--edex-fg-bright)"
      : tone === 1
        ? "var(--edex-fg)"
        : "var(--edex-fg-dim)";

  return (
    <PanelFrame
      leftLabel="DATASTREAM"
      rightLabel="INTERCEPT LOG"
      labelScrambleAt={3000}
      loaderDelay={200}
      className="h-full"
    >
      <div
        ref={scrollRef}
        className="edex-scroll boot-seq h-full min-h-0 overflow-y-auto p-3 text-[11px] leading-relaxed [overflow-anchor:none]"
        style={{ "--boot-delay": "3400ms" } as React.CSSProperties}
      >
        {lines.map((l) => (
          <div key={l.id} className="whitespace-nowrap" style={{ color: toneColor(l.tone) }}>
            <ScrambleText text={l.text} speed={16} />
          </div>
        ))}
        <span className="edex-cursor inline-block h-3.5 w-2 translate-y-[3px] bg-[var(--edex-fg-bright)]" />
      </div>
    </PanelFrame>
  );
}
