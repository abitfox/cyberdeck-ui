"use client";

import { useEffect, useRef } from "react";

/* Audio wave · equalizer-style canvas bars that react to the mode */

export type AudioWaveMode = "idle" | "speaking" | "thinking" | "satisfied" | "warning";

interface AudioWaveProps {
  mode?: AudioWaveMode;
  label?: string;
}

export function AudioWave({ mode = "idle", label = "AUDIO CHANNEL" }: AudioWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const speaking = mode === "speaking";
    const thinking = mode === "thinking";
    const satisfied = mode === "satisfied";
    const warning = mode === "warning";

    let raf = 0;
    const bars = 40;
    const values = new Array(bars).fill(0);

    /* Canvas can't resolve CSS variables — read the accent color once up front */
    const accent =
      getComputedStyle(canvas).getPropertyValue("--edex-acc").trim() || "#7fb3ba";

    const draw = () => {
      const color = warning ? "#ff6b6b" : satisfied ? "#ffd700" : accent;
      ctx.clearRect(0, 0, W, H);
      const barW = W / bars;

      for (let i = 0; i < bars; i++) {
        const target = speaking
          ? (Math.random() * 0.7 + 0.3) * H
          : thinking
          ? H * 0.12
          : satisfied
          ? (Math.sin(Date.now() / 300 + i) * 0.15 + 0.2) * H
          : H * 0.06;
        values[i] += (target - values[i]) * 0.25;

        const h = Math.max(2, values[i]);
        const x = i * barW;
        const y = (H - h) / 2;
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(x + 1, y, barW - 2, h);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(raf);
  }, [mode]);

  return (
    <div className="widget h-full">
      <div className="widget-title">{label}</div>
      <canvas ref={canvasRef} className="h-[calc(100%-18px)] w-full" />
    </div>
  );
}
