"use client";

import { useEffect, useRef, useState } from "react";

/* CPU wave · rolling area chart with a live percentage readout */

export type CpuStatus = "idle" | "running" | "error";

interface CPUWaveProps {
  status?: CpuStatus;
  label?: string;
}

export function CPUWave({ status = "running", label = "CPU LOAD" }: CPUWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [value, setValue] = useState(0);

  const running = status !== "idle" && status !== "error";
  const error = status === "error";

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

    let raf = 0;
    const points: number[] = new Array(60).fill(error ? 95 : 15);

    /* Canvas can't resolve CSS variables — read the accent color once up front */
    const accent =
      getComputedStyle(canvas).getPropertyValue("--edex-acc").trim() || "#7fb3ba";

    const draw = () => {
      const base = running ? (error ? 95 : 55) : 15;
      const v = Math.max(5, Math.min(99, base + Math.sin(Date.now() / 800) * 8 + Math.random() * 5));
      points.shift();
      points.push(v);
      setValue(Math.round(v));

      ctx.clearRect(0, 0, W, H);
      const color = error ? "#ff6b6b" : accent;

      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, error ? "rgba(255,68,68,0.2)" : "rgba(150,220,225,0.18)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.moveTo(0, H);
      points.forEach((p, i) => {
        const x = (i / (points.length - 1)) * W;
        const y = H - (p / 100) * H;
        ctx.lineTo(x, y);
      });
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      points.forEach((p, i) => {
        const x = (i / (points.length - 1)) * W;
        const y = H - (p / 100) * H;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(raf);
  }, [running, error]);

  return (
    <div className="widget h-full">
      <div className="flex items-center justify-between">
        <span className="widget-title">{label}</span>
        <span className="text-[11px]" style={{ color: error ? "#ff6b6b" : "var(--edex-acc)" }}>
          {value}%
        </span>
      </div>
      <canvas ref={canvasRef} className="mt-1 h-[calc(100%-20px)] w-full" />
    </div>
  );
}
