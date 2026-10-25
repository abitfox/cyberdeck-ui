"use client";

import { useMemo } from "react";

/** 地球仪线条色档：idle=待机（终端对话） / alert=挑战进行中 / success=题目成功反馈 */
export type GlobeTone = "idle" | "alert" | "success";

const TONE_COLOR: Record<GlobeTone, string> = {
  idle: "var(--edex-line)",
  alert: "#ff6b6b",
  success: "#8fe3a8",
};

/** 线框点阵地球仪：纬度环 + 旋转经线 + 散点。移植自 template/edex-ui globe.tsx */
export function Globe({
  size = 190,
  endpoint,
  tone = "idle",
}: {
  size?: number;
  endpoint?: { x: number; y: number };
  tone?: GlobeTone;
}) {
  const r = size / 2 - 6;
  const cx = size / 2;
  const cy = size / 2;
  const line = TONE_COLOR[tone];

  const dots = useMemo(() => {
    const pts: { x: number; y: number; o: number }[] = [];
    let s = 42;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    for (let i = 0; i < 260; i++) {
      const u = rand();
      const v = rand();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta);
      if (z < 0) continue;
      pts.push({ x: cx + x * r, y: cy + y * r, o: 0.35 + z * 0.5 });
    }
    return pts;
  }, [cx, cy, r]);

  const latRings = [-0.6, -0.3, 0, 0.3, 0.6];
  const ep = endpoint ?? { x: 0.4, y: -0.3 };
  /* 线条颜色切换平滑过渡 */
  const strokeStyle = { stroke: line, transition: "stroke 0.6s ease" } as const;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        strokeWidth={1}
        style={strokeStyle}
      />
      {latRings.map((lat, i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy + lat * r}
          rx={r * Math.sqrt(1 - lat * lat)}
          ry={r * Math.sqrt(1 - lat * lat) * 0.16}
          fill="none"
          strokeWidth={0.75}
          style={strokeStyle}
        />
      ))}
      <g
        className="edex-spin"
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        {[0.25, 0.55, 0.85].map((f, i) => (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx={r * f}
            ry={r}
            fill="none"
            strokeWidth={0.75}
            style={strokeStyle}
          />
        ))}
      </g>
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={0.9}
          fill="var(--edex-fg)"
          opacity={d.o}
        />
      ))}
      {/* 目标端点标记 */}
      <circle
        cx={cx + r * ep.x}
        cy={cy + r * ep.y}
        r={2.4}
        fill="var(--edex-fg-bright)"
        className="edex-glow"
      />
      <line
        x1={cx + r * ep.x}
        y1={cy + r * ep.y}
        x2={cx + r * (ep.x + 0.65)}
        y2={cy + r * (ep.y - 0.4)}
        stroke="var(--edex-line-strong)"
        strokeWidth={0.75}
      />
    </svg>
  );
}
