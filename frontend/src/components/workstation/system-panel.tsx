"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PanelFrame } from "@/components/edex/panel-frame";
import { LineGraph } from "@/components/edex/line-graph";
import { Globe, type GlobeTone } from "@/components/edex/globe";
import { ScrambleText } from "@/components/edex/scramble-text";

/**
 * 左侧 SYSTEM 面板 · 严格移植自 HackerEnglish workstation（store 数据改为内置 mock）：
 * 大时钟 + 日期/在线/系统/电量 + 特工状态 + CPU + 内存网格 + TOP PROCESSES
 * + 音频监控 + WORLD VIEW 地球仪。
 *
 * 开机序列节奏（与 workstation 页 stage 5 对齐，booted 于 3200ms）：
 * 组件从上到下逐个显现（GAP 间隔），标题乱码打字机与块渐显同步；
 * WORLD VIEW 作为重型组件延后 LATE 错峰；空档期由 PanelFrame 的闪烁
 * LOADING 占位兜底（loaderDelay = 最后一块显现时刻）。
 */
const CONTENT_AT = 3200;
const GAP = 200;
const LATE = 550;
/** 本面板最后一块内容的 boot-delay（相对 CONTENT_AT） */
const LAST = GAP * 5 + GAP + LATE;
const seq = (d: number) =>
  ({ "--boot-delay": `${CONTENT_AT + d}ms` }) as React.CSSProperties;
const titleAt = (d: number) => CONTENT_AT + d + 140;

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col leading-tight">
      <span className="edex-panel-label">{label}</span>
      <span className="text-sm text-[var(--edex-fg-bright)]">{value}</span>
      {sub ? (
        <span className="text-[10px] text-[var(--edex-fg-dim)]">{sub}</span>
      ) : null}
    </div>
  );
}

/** 确定性伪随机点阵（eDEX 内存网格） */
function MemoryGrid() {
  const cells = useMemo(() => {
    const arr: boolean[] = [];
    let s = 7;
    for (let i = 0; i < 30 * 5; i++) {
      s = (s * 9301 + 49297) % 233280;
      arr.push(s / 233280 < 0.46);
    }
    return arr;
  }, []);
  return (
    <div
      className="grid gap-[2px] opacity-60"
      style={{ gridTemplateColumns: "repeat(30, minmax(0, 1fr))" }}
    >
      {cells.map((on, i) => (
        <span
          key={i}
          className="aspect-square"
          style={{
            background: on
              ? "var(--edex-fg)"
              : "rgba(170,200,205,0.14)",
          }}
        />
      ))}
    </div>
  );
}

/** AUDIO 电平条：确定性伪随机参数的装饰性动态波形（非真实频谱） */
function AudioBars({ live }: { live: boolean }) {
  const bars = useMemo(() => {
    const arr: { dur: number; delay: number; opacity: number }[] = [];
    let s = 13;
    for (let i = 0; i < 48; i++) {
      s = (s * 9301 + 49297) % 233280;
      const r = s / 233280;
      arr.push({
        dur: 0.55 + r * 0.75,
        delay: -r * 1.3,
        opacity: 0.45 + r * 0.55,
      });
    }
    return arr;
  }, []);
  return (
    <div className="flex h-6 items-end gap-[3px] overflow-hidden ">
      {bars.map((b, i) => (
        <span
          key={i}
          className={`w-full rounded-[1px] ${live ? "eq-bar" : ""}`}
          style={{
            height: "100%",
            background: "var(--edex-fg)",
            opacity: live ? b.opacity * 0.2 : 0.01,
            transform: live ? undefined : "scaleY(0.14)",
            transformOrigin: "bottom",
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * TOP PROCESSES 进程模拟（与原版一致）：
 * - jitter tick（2.5~4s 随机间隔）：每个进程 cpu 围绕基线随机游走并缓慢回归基线；
 * - burst（30~60s 随机间隔）：随机挑 1~2 个非榜首进程 CPU 突增登顶 → 触发排序变化；
 * - 排序按 cpu 降序实时计算，行用 framer-motion layout 做上下滑动换位；
 * - 数值用 RollingNumber 做 600ms ease-out 滚动补间。
 */
const PROC_DEFS = [
  { pid: 5636, name: "通讯拦截", run: 62.3, idle: 0.2 },
  { pid: 2404, name: "信号解析", run: 41.4, idle: 0.1 },
  { pid: 1137, name: "AI 评分", run: 12.1, idle: 0.0 },
  { pid: 2316, name: "链上同步", run: 2.0, idle: 2.0 },
  { pid: 5627, name: "hacker-core", run: 1.8, idle: 1.8 },
] as const;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

/** 数值滚动补间：value 变化时从当前显示值平滑数到新值（600ms ease-out，1 位小数） */
function RollingNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const displayRef = useRef(value);
  useEffect(() => {
    const from = displayRef.current;
    if (from === value) return;
    const start = performance.now();
    const dur = 600;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = from + (value - from) * eased;
      displayRef.current = v;
      setDisplay(v);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span className="tabular-nums text-[var(--edex-fg-dim)]">{display.toFixed(1)}%</span>;
}

/** 进程 CPU 模拟：targets 为每个进程的目标 CPU 值（渲染时降序排序） */
function useProcessSim(running: boolean) {
  const [targets, setTargets] = useState<number[]>(() => PROC_DEFS.map((d) => d.idle));
  const targetsRef = useRef(targets);
  const set = (next: number[]) => {
    targetsRef.current = next;
    setTargets(next);
  };

  useEffect(() => {
    set(PROC_DEFS.map((d) => (running ? d.run : d.idle)));
  }, [running]);

  // jitter tick：围绕基线随机游走 + 缓慢回归（间隔 2.5~4s 随机）
  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (alive && !document.hidden) {
        const next = targetsRef.current.map((t, i) => {
          const base = running ? PROC_DEFS[i].run : PROC_DEFS[i].idle;
          const pulled = t + (base - t) * 0.35;
          const noise = (Math.random() - 0.5) * Math.max(base * 0.6, 0.12);
          return clamp(pulled + noise, base * 0.2, base * 2.2);
        });
        set(next);
      }
      timer = setTimeout(tick, rand(2500, 4000));
    };
    timer = setTimeout(tick, rand(2500, 4000));
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [running]);

  // burst：随机挑 1~2 个非榜首进程突增登顶，触发排序变化（间隔 30~60s 随机）
  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const burst = () => {
      if (alive && !document.hidden) {
        const topIdx = targetsRef.current.indexOf(Math.max(...targetsRef.current));
        const candidates = PROC_DEFS.map((_, i) => i).filter((i) => i !== topIdx);
        const count = Math.random() < 0.6 ? 1 : 2;
        const picked = candidates.sort(() => Math.random() - 0.5).slice(0, count);
        const top = Math.max(...targetsRef.current);
        const next = [...targetsRef.current];
        for (const i of picked) {
          const base = running ? PROC_DEFS[i].run : PROC_DEFS[i].idle;
          next[i] = Math.max(top * rand(1.05, 1.3), base * rand(2, 4), 0.5);
        }
        set(next);
      }
      timer = setTimeout(burst, rand(30000, 60000));
    };
    timer = setTimeout(burst, rand(30000, 60000));
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [running]);

  return PROC_DEFS.map((d, i) => ({ ...d, cpu: targets[i] })).sort((a, b) => b.cpu - a.cpu);
}

/** AUDIO 监控块：播放状态 + 电平条 + 播放/暂停（演示中为纯视觉开关，不发声） */
function AudioBlock({ delay }: { delay: number }) {
  const [live, setLive] = useState(false);
  return (
    <div
      className="boot-seq border-t border-[var(--edex-line)] py-2"
      style={{ "--boot-delay": `${CONTENT_AT + delay}ms` } as React.CSSProperties}
    >
      <div className="mb-1 flex items-baseline justify-between ">
        <ScrambleText
          text="AUDIO MONITOR"
          delay={CONTENT_AT + delay + 140}
          className="edex-panel-label"
        />
        <button
          onClick={() => setLive((v) => !v)}
          title="演示开关：驱动电平条起伏"
          className="text-[10px] tracking-widest text-[var(--edex-acc)] transition hover:text-[var(--edex-fg-bright)]"
        >
          {live ? "▮▮ OFF" : "▶ ON"}
        </button>
      </div>
      <AudioBars live={live} />
    </div>
  );
}

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/** 会话 UPTIME：以挂载时刻为起点持续计时。
 * 不依赖 now（时钟每秒刷新会令 effect 重跑、起点被重置，导致读数永远停在 0:00:00/01） */
function useUptime() {
  const [uptime, setUptime] = useState("0:00:00");
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const s = Math.floor((Date.now() - start) / 1000);
      setUptime(
        `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`,
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return uptime;
}

/** 左侧 SYSTEM 面板 */
export function SystemPanel() {
  const now = useClock();
  const time = now
    ? now.toLocaleTimeString("en-GB", { hour12: false })
    : "--:--:--";
  const dateStr = now
    ? now
        .toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
        .toUpperCase()
    : "--- --";
  const uptime = useUptime();

  /* 演示默认处于"任务运行中"，进程基线走 run 档 */
  const running = true;
  const procs = useProcessSim(running);

  const globeTone: GlobeTone = "idle";

  return (
    <PanelFrame
      leftLabel="PANEL"
      rightLabel="SYSTEM"
      labelScrambleAt={3000}
      loaderDelay={LAST}
      className="h-full"
    >
      <div className="edex-scroll flex h-full flex-col gap-3 overflow-y-auto p-3">
        {/* 时钟 */}
        <div className="boot-seq edex-glow text-5xl leading-none tracking-widest text-[var(--edex-fg-bright)] tabular-nums" style={seq(0)}>
          {time}
        </div>

        {/* 日期 / 在线 / 系统 / 电量 */}
        <div className="boot-seq grid grid-cols-4 gap-2 border-y border-[var(--edex-line)] py-2" style={seq(GAP)}>
          <Stat label="DATE" value={dateStr} />
          <Stat label="UPTIME" value={uptime} />
          <Stat label="TYPE" value="deck-os" />
          <Stat label="POWER" value="CHARGE" />
        </div>

        {/* 特工状态 */}
        <div
          className="boot-seq grid w-full grid-cols-3 gap-2 text-left"
          style={seq(GAP * 2)}
        >
          <Stat label="AGENT" value="Lv.7" sub="渗透测试员" />
          <Stat label="STREAK" value="12d" sub="潜伏天数" />
          <Stat label="CHASSIS" value="Command" sub="指挥中心" />
        </div>

        {/* CPU 折线（垂直空间不足时隐藏，为 WORLD VIEW 让位） */}
        <div className="boot-seq [@media(max-height:899px)]:hidden" style={seq(GAP * 3)}>
          <div className="mb-1 flex items-baseline justify-between">
            <ScrambleText text="CPU USAGE" delay={titleAt(GAP * 3)} className="edex-panel-label" />
            <span className="text-[10px] text-[var(--edex-fg-dim)]">
              信号处理单元
            </span>
          </div>
          <div className="mb-1 flex items-center justify-between text-[10px]">
            <span className="text-[var(--edex-fg-bright)]">#1-4</span>
            <span className="text-[var(--edex-fg-dim)]">
              Avg. {running ? "67%" : "17%"}
            </span>
          </div>
          <LineGraph
            seed={running ? 0.65 : 0.18}
            min={running ? 0.45 : 0.06}
            max={running ? 0.9 : 0.28}
            intervalMs={1100}
          />
        </div>

        {/* 内存网格 */}
        <div className="boot-seq" style={seq(GAP * 4)}>
          <div className="mb-1 flex items-baseline justify-between">
            <ScrambleText text="MEMORY" delay={titleAt(GAP * 4)} className="edex-panel-label" />
            <span className="text-[10px] text-[var(--edex-fg-dim)]">
              任务缓冲区
            </span>
          </div>
          <MemoryGrid />
        </div>

        {/* 任务进程（CPU 模拟：随机游走 + burst 重排 + 滚动数值 + layout 换位动画） */}
        <div className="boot-seq" style={seq(GAP * 5)}>
          <div className="mb-1 flex items-baseline justify-between">
            <ScrambleText text="TOP PROCESSES" delay={titleAt(GAP * 5)} className="edex-panel-label" />
            <span className="text-[10px] text-[var(--edex-fg-dim)]">
              PID | NAME | CPU
            </span>
          </div>
          <ul className="flex flex-col gap-1 text-xs">
            {procs.map((p) => (
              <motion.li
                key={p.pid}
                layout="position"
                transition={{ layout: { duration: 0.45, ease: "easeOut" } }}
                className="flex items-center justify-between"
              >
                <span className="flex gap-2">
                  <span className="tabular-nums text-[var(--edex-fg-dim)]">{p.pid}</span>
                  <span className="text-[var(--edex-fg-bright)]">{p.name}</span>
                </span>
                <RollingNumber value={p.cpu} />
              </motion.li>
            ))}
          </ul>
        </div>

        {/* 音频监控：播放状态 + 装饰性电平条 */}
        <AudioBlock delay={GAP * 6} />

        {/* 世界视图（目标城市，贴底；错峰延后显现） */}
        <div className="boot-seq mt-auto" style={seq(GAP * 5 + GAP + LATE)}>
          <div className="mb-1 flex items-baseline justify-between">
            <ScrambleText text="WORLD VIEW" delay={titleAt(GAP * 6 + LATE)} className="edex-panel-label" />
            <span className="text-[10px] text-[var(--edex-fg-dim)]">
              TARGET: LONDON
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="edex-panel-label">ENDPOINT LAT/LON</span>
            <span className="text-[10px] text-[var(--edex-fg-dim)]">
              51.5074, -0.1278
            </span>
          </div>
          <div className="flex justify-center py-1">
            <Globe size={150} endpoint={{ x: -0.15, y: -0.35 }} tone={globeTone} />
          </div>
        </div>
      </div>
    </PanelFrame>
  );
}
