"use client";

import { useEffect, useState } from "react";
import { PanelFrame } from "@/components/edex/panel-frame";
import { LineGraph } from "@/components/edex/line-graph";
import { ScrambleText } from "@/components/edex/scramble-text";

/**
 * 右侧 MISSION 面板 · 严格移植自 HackerEnglish workstation（store 数据改为内置 mock）：
 * AGENT LINK（Q 链路）+ 今日任务链 + 通讯窗口倒计时 + 资产 + 网络流量 + Agent Q 视频面板。
 *
 * 开机序列节奏（与 workstation 页 stage 5 对齐，booted 于 3200ms）：
 * 组件从上到下逐个显现（GAP 间隔），标题乱码打字机与块渐显同步；
 * AGENT Q 视频贴底最后显现；空档期由 PanelFrame 闪烁 LOADING 占位兜底。
 */
const CONTENT_AT = 3200;
const GAP = 200;
/** 本面板最后一块内容的 boot-delay（相对 CONTENT_AT）：max(AGENT Q 480, NETWORK GAP*3) */
const LAST = Math.max(480, GAP * 3);
const seq = (d: number) =>
  ({ "--boot-delay": `${CONTENT_AT + d}ms` } as React.CSSProperties);
const titleAt = (d: number) => CONTENT_AT + d + 140;

type QState = "idle" | "speaking" | "thinking" | "warning" | "satisfied";

function Field({
  label,
  value,
  bright,
  danger,
  className,
}: {
  label: string;
  value: string;
  bright?: boolean;
  danger?: boolean;
  className?: string;
}) {
  return (
    <div className="flex flex-col leading-tight">
      <span className="edex-panel-label">{label}</span>
      <span
        className={`text-sm ${className ?? ""} ${danger ? "text-[#ff6b6b]" : bright ? "text-[var(--edex-fg-bright)]" : "text-[var(--edex-fg)]"}`}
      >
        {value}
      </span>
    </div>
  );
}

const Q_STATE_TEXT: Record<QState, string> = {
  idle: "IDLE · 待命",
  speaking: "SPEAKING · 通讯中",
  thinking: "THINKING · 解析中",
  warning: "WARNING · 异常",
  satisfied: "SATISFIED · 确认",
};

/** AGENT LINK 的 STATE 字段：剧情驱动=● ACTIVE（呼吸闪烁）/ 自由行动=ONLINE（无点、静态）。 */
function AgentLinkState() {
  const [active, setActive] = useState(true);
  return (
    <button
      onClick={() => setActive((v) => !v)}
      title={
        active
          ? "特工已激活 · 点击切换自由行动（/free）"
          : "自由行动中 · 点击激活特工（/activate）"
      }
      className="flex cursor-pointer flex-col items-start leading-tight transition hover:opacity-80"
    >
      <span className="edex-panel-label">STATE</span>
      <span className={`text-sm ${active ? "text-[var(--edex-acc)]" : "text-[#8fe3a8]"}`}>
        {active ? <span className="breathe">● ACTIVE</span> : "ONLINE"}
      </span>
    </button>
  );
}

/** 今日任务链实时状态（打卡进度 + 连锁倍率） */
function ChainBlock() {
  const doneToday = 2;
  const dailyUnits = 5;
  const mult = 1.5;
  const status = "CHAINED · 连锁中";
  const roleEn = "Penetration Tester";

  return (
    <div className="boot-seq" style={seq(60)}>
      <div className="mb-1 flex items-baseline justify-between">
        <ScrambleText text="MISSION CHAIN" delay={titleAt(60)} className="edex-panel-label" />
        <span className="text-[10px] text-[var(--edex-fg-dim)]">{roleEn}</span>
      </div>
      <div className="block w-full border border-[var(--edex-line)] bg-[rgba(170,200,205,0.03)] px-3 py-2 text-left">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] text-[var(--edex-fg-bright)]">{status}</span>
          <span className="text-sm tabular-nums text-[var(--edex-acc)]">{mult.toFixed(1)}x</span>
        </div>
        <div className="mt-1.5 flex items-center gap-1">
          {Array.from({ length: Math.min(10, Math.max(dailyUnits, doneToday + 1)) }, (_, i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: i < doneToday ? "var(--edex-fg)" : "transparent",
                border: "1px solid rgba(170,200,205,0.4)",
              }}
            />
          ))}
          <span className="ml-1 text-[10px] text-[var(--edex-fg-dim)]">
            {`${doneToday} 单元 · 推荐 ${dailyUnits}`}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Agent Q 视觉信号小组件（视频面板）——点击可触发 onIntro（演示中为 hover 提示）。 */
export function AgentQFeed() {
  return (
    <div
      className="boot-seq group mt-auto block w-full text-left transition-opacity hover:opacity-85 active:scale-[0.99]"
      style={seq(480)}
    >
      <div className="mb-1 flex items-baseline justify-between">
        <ScrambleText text="AGENT Q" delay={CONTENT_AT + 540} className="edex-panel-label" />
        <span className="text-[10px] text-[var(--edex-fg-dim)]">
          VISUAL FEED · LIVE
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="edex-panel-label">CHANNEL</span>
        <span className="text-[10px] text-[var(--edex-fg-dim)]">
          HACK-443 · ENCRYPTED
        </span>
      </div>
      <div className="relative mt-1 flex justify-center border border-[var(--edex-line)] bg-[rgba(170,200,205,0.03)] p-1 transition-colors group-hover:border-[var(--edex-acc)]">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src="/agentQ.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="h-40 w-full object-cover opacity-90"
        />
        {/* 中央提示：hover 浮现，覆盖在视频画面上，不占版面空间 */}
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 text-[11px] font-bold tracking-[0.3em] text-[var(--edex-acc)] opacity-0 transition-opacity group-hover:opacity-100">
          ▶ INTRO
        </span>
      </div>
    </div>
  );
}

/** 右侧 MISSION 面板 */
export function MissionPanel() {
  /* 演示倒计时：120s 窗口，状态机 idle→running→warning→critical→expired */
  const [remaining, setRemaining] = useState(74);
  const total = 120;
  useEffect(() => {
    const t = setInterval(() => setRemaining((r) => (r <= 0 ? 0 : r - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const cdState: "idle" | "running" | "warning" | "critical" | "expired" =
    remaining <= 0 ? "expired" : remaining <= 10 ? "critical" : remaining <= 25 ? "warning" : "running";

  /* 演示状态：Q 通讯中；资产数值走原版字段口径 */
  const qState: QState = "speaking";
  const points = 12480;
  const accuracy = 92;
  const assetsMult = 1.5;

  const ratio = total > 0 ? remaining / total : 1;
  const cdColor =
    cdState === "expired" || remaining <= 10
      ? "text-[#ff6b6b]"
      : ratio > 0.5
        ? "text-[var(--edex-fg-bright)]"
        : ratio > 0.2
          ? "text-[#ffcc77]"
          : "text-[#ff6b6b]";

  return (
    <PanelFrame
      leftLabel="PANEL"
      rightLabel="MISSION"
      labelScrambleAt={3000}
      loaderDelay={LAST}
      className="h-full"
    >
      <div className="edex-scroll flex h-full flex-col gap-4 overflow-y-auto p-3">
        {/* AGENT LINK（Q） */}
        <div className="boot-seq" style={seq(0)}>
          <div className="mb-2 flex items-baseline justify-between">
            <ScrambleText text="AGENT LINK" delay={titleAt(0)} className="edex-panel-label" />
            <span className="text-[10px] text-[var(--edex-fg-dim)]">
              ENCRYPTED · HACK-443
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <AgentLinkState />
            <Field label="HANDLER" value="Q" bright />
            <Field label="PING" value="12ms" />
          </div>
          {/* Q 状态行 */}
          <div className="mt-2 flex items-center justify-between border border-[var(--edex-line)] bg-[rgba(170,200,205,0.04)] px-2 py-1.5">
            <span className="text-[11px] text-[var(--edex-fg-bright)] edex-glow">
              {Q_STATE_TEXT[qState]}
            </span>
            <span className="flex items-end gap-[2px]" aria-hidden>
              {[5, 9, 13, 8, 11, 6].map((h, i) => (
                <span
                  key={i}
                  className={`w-[3px] ${qState === "speaking" ? "breathe bg-[var(--edex-fg)]" : "bg-[rgba(170,200,205,0.25)]"}`}
                  style={{
                    height: qState === "speaking" ? h : 3,
                    animationDelay: `${i * 120}ms`,
                  }}
                />
              ))}
            </span>
          </div>
        </div>

        {/* 今日任务链 */}
        <ChainBlock />

        {/* 通讯窗口倒计时 */}
        <div className="boot-seq" style={seq(120)}>
          <div className="mb-1 flex items-baseline justify-between">
            <ScrambleText text="TIME REMAINING" delay={CONTENT_AT + 180} className="edex-panel-label" />
            <span className="text-[10px] text-[var(--edex-fg-dim)]">
              通讯窗口
            </span>
          </div>
          <div className="border border-[var(--edex-line)] bg-[rgba(170,200,205,0.03)] px-3 py-2">
            <div
              className={`text-4xl leading-none tracking-widest tabular-nums ${cdColor} ${
                cdState === "running" || cdState === "warning" || cdState === "critical"
                  ? "edex-glow"
                  : ""
              }`}
            >
              {`${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`}
            </div>
            <div className="mt-2 h-1.5 w-full bg-[rgba(170,200,205,0.14)]">
              <div
                className="h-full bg-[var(--edex-fg)] transition-[width] duration-1000"
                style={{ width: `${Math.max(0, ratio * 100)}%` }}
              />
            </div>
            <div className="mt-1 text-right text-[10px] text-[var(--edex-fg-dim)]">
              {cdState === "expired"
                ? "信号已丢失"
                : `剩余 ${Math.round(ratio * 100)}%`}
            </div>
          </div>
        </div>

        {/* 资产（$HACK / MULT / ACC，与原版字段口径一致） */}
        <div className="boot-seq" style={seq(240)}>
          <div className="mb-2 flex items-baseline justify-between">
            <ScrambleText text="ASSETS" delay={CONTENT_AT + 300} className="edex-panel-label" />
            <span className="text-[10px] text-[var(--edex-fg-dim)]">
              SOULBOUND
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Field label="$HACK" value={points.toLocaleString()} bright />
            <Field label="MULT" value={`${assetsMult.toFixed(1)}x`} />
            <Field label="ACC" value={`${accuracy}%`} />
          </div>
        </div>

        {/* 网络流量（移植自 eDEX NETWORK TRAFFIC，叙事包装为拦截通道流量） */}
        <div className="boot-seq [@media(max-height:899px)]:hidden" style={seq(GAP * 3)}>
          <div className="mb-1 flex items-baseline justify-between">
            <ScrambleText text="NETWORK TRAFFIC" delay={titleAt(GAP * 3)} className="edex-panel-label" />
            <span className="text-[10px] text-[var(--edex-fg-dim)]">
              UP / DOWN, MB/S
            </span>
          </div>
          <div className="mb-2 flex items-center justify-between">
            <span className="edex-panel-label">TOTAL</span>
            <span className="text-[10px] text-[var(--edex-fg-dim)]">
              158 MB OUT, 1.32 GB IN
            </span>
          </div>
          <LineGraph height={70} points={40} seed={0.5} min={0.1} max={0.9} intervalMs={900} />
        </div>

        {/* Agent Q 视觉信号：贴底最后显现 */}
        <AgentQFeed />
      </div>
    </PanelFrame>
  );
}
