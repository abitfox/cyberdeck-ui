"use client";

import { useEffect, useState } from "react";

interface LineGraphProps {
  width?: number;
  height?: number;
  points?: number;
  min?: number;
  max?: number;
  seed?: number;
  intervalMs?: number;
  className?: string;
}

/** 实时滚动的火花折线图。移植自 template/edex-ui/components/edex/line-graph.tsx */
export function LineGraph({
  width = 120,
  height = 38,
  points = 32,
  min = 0.2,
  max = 0.8,
  seed = 0.5,
  intervalMs = 1200,
  className,
}: LineGraphProps) {
  const [data, setData] = useState<number[]>(() =>
    Array.from({ length: points }, () => min + (max - min) * seed),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => {
        const next = prev.slice(1);
        const last = prev[prev.length - 1];
        let v = last + (Math.random() - 0.5) * (max - min) * 0.6;
        v = Math.max(min, Math.min(max, v));
        next.push(v);
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [min, max, intervalMs]);

  const path = data
    .map((v, i) => {
      const x = (i / (points - 1)) * width;
      const y = height - v * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d={path}
        fill="none"
        stroke="var(--edex-fg)"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
