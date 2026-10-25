"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { playKeyClick } from "@/lib/sfx";

interface KeyDef {
  main: ReactNode;
  top?: string;
  grow?: number;
}

/** 按键开机动画参数：随机延迟 + 随机错位偏移 */
interface KeyFx {
  delay: number;
  dx: string;
  dy: string;
}

/** 确定性伪随机（避免 SSR/CSR 水合不一致），生成全部按键的错位参数 */
function makeKeyboardFx(count: number): KeyFx[] {
  let s = 20260915;
  const rnd = () => {
    s = (s * 48271) % 2147483647;
    return s / 2147483647;
  };
  return Array.from({ length: count }, () => ({
    delay: Math.round(150 + rnd() * 900),
    dx: `${((rnd() * 2 - 1) * 20).toFixed(1)}px`,
    dy: `${((rnd() * 2 - 1) * 20).toFixed(1)}px`,
  }));
}

/**
 * 单个按键。注意：必须定义在模块层——若定义在 Keyboard 函数体内，
 * 每次敲键（active 状态更新）都会让函数标识变化，导致 React 整树
 * 重挂、key-in 开机动画被错误重放。
 */
function Key({
  k,
  fx,
  active,
}: {
  k: KeyDef;
  fx: KeyFx;
  active: string | null;
}) {
  const label = typeof k.main === "string" ? k.main.toUpperCase() : k.main;
  const isActive = active !== null && label === active && label !== "";
  return (
    <div
      className={`key-in flex h-11 min-w-0 flex-1 items-center justify-center rounded-[3px] border px-1 transition-colors ${
        isActive
          ? "border-[var(--edex-line-strong)] bg-[rgba(170,200,205,0.22)] text-[var(--edex-fg-bright)] edex-glow"
          : "border-[var(--edex-line)] bg-[rgba(170,200,205,0.03)] text-[var(--edex-fg)] hover:border-[var(--edex-line-strong)] hover:bg-[rgba(170,200,205,0.1)] hover:text-[var(--edex-fg-bright)] hover:edex-glow"
      }`}
      style={
        {
          flexGrow: k.grow ?? 1,
          "--key-delay": `${fx.delay}ms`,
          "--key-dx": fx.dx,
          "--key-dy": fx.dy,
        } as React.CSSProperties
      }
    >
      <div className="flex flex-col items-center leading-none">
        {k.top ? (
          <span className="text-[9px] text-[var(--edex-fg-dim)]">{k.top}</span>
        ) : null}
        <span className="text-xs">{k.main}</span>
      </div>
    </div>
  );
}

const ROWS: KeyDef[][] = [
  [
    { main: "ESC", grow: 1.4 },
    { main: "`", top: "~" },
    { main: "1", top: "!" },
    { main: "2", top: "@" },
    { main: "3", top: "#" },
    { main: "4", top: "$" },
    { main: "5", top: "%" },
    { main: "6", top: "^" },
    { main: "7", top: "&" },
    { main: "8", top: "*" },
    { main: "9", top: "(" },
    { main: "0", top: ")" },
    { main: "-", top: "_" },
    { main: "=", top: "+" },
    { main: "BACK", grow: 1.6 },
  ],
  [
    { main: "TAB", grow: 1.6 },
    { main: "Q" },
    { main: "W" },
    { main: "E" },
    { main: "R" },
    { main: "T" },
    { main: "Y" },
    { main: "U" },
    { main: "I" },
    { main: "O" },
    { main: "P" },
    { main: "[", top: "{" },
    { main: "]", top: "}" },
    { main: "\\", top: "|", grow: 1.4 },
  ],
  [
    { main: "CAPS", grow: 1.9 },
    { main: "A" },
    { main: "S" },
    { main: "D" },
    { main: "F" },
    { main: "G" },
    { main: "H" },
    { main: "J" },
    { main: "K" },
    { main: "L" },
    { main: ";", top: ":" },
    { main: "'", top: '"' },
    { main: "ENTER", grow: 2.3 },
  ],
  [
    { main: "SHIFT", grow: 2.4 },
    { main: "Z", top: ">" },
    { main: "X" },
    { main: "C" },
    { main: "V" },
    { main: "B" },
    { main: "N" },
    { main: "M" },
    { main: ",", top: "<" },
    { main: ".", top: ">" },
    { main: "/", top: "?" },
    { main: "SHIFT", grow: 2 },
    { main: "↑" },
  ],
  [
    { main: "CTRL", grow: 1.6 },
    { main: "FN", grow: 1.2 },
    { main: "", grow: 8 },
    { main: "ALT GR", grow: 1.6 },
    { main: "CTRL", grow: 1.6 },
    { main: "←" },
    { main: "↓" },
    { main: "→" },
  ],
];

/** 每行在扁平按键列表中的起始下标（错位参数按扁平顺序分配） */
const ROW_OFFSETS = (() => {
  const offsets: number[] = [];
  let acc = 0;
  for (const row of ROWS) {
    offsets.push(acc);
    acc += row.length;
  }
  return offsets;
})();

const FX_LIST = makeKeyboardFx(ROWS.flat().length);

/** 全尺寸键盘，移植自 template/edex-ui keyboard.tsx，增加物理键盘同步高亮。 */
export function Keyboard() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // 长按自动重复不重复出声；每次真实敲击播放机械轴音效
      if (!e.repeat) playKeyClick();
      // e.key 在部分输入法合成/合成事件下可能为 undefined，兜底空串
      setActive(e.key ? e.key.toUpperCase() : "");
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
    <section
      className="flex h-full min-h-0 flex-col justify-center gap-1.5 overflow-hidden px-1"
      aria-hidden="true"
    >
      {ROWS.map((row, i) => (
        <div key={i} className="flex gap-1.5">
          {row.map((k, j) => (
            <Key
              key={j}
              k={k}
              fx={FX_LIST[ROW_OFFSETS[i] + j]}
              active={active}
            />
          ))}
        </div>
      ))}
    </section>
  );
}
