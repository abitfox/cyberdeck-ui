"use client";

/* 背景特效开关 —— 控制全局 WebGL ShaderBackground（网格闪烁/涟漪/粒子）。
 *
 * 设计要点：
 * - 极简发布订阅（与 bgm.ts 同模式），跨组件同步
 * - 持久化 localStorage（he.fx）：关一次全站生效，刷新后保持（与 Bgm 不持久化的会话口径不同，
 *   特效是性能取舍，用户关掉通常是设备带不动，不该每次重开）
 * - 默认值分平台：桌面开启；移动端默认关闭（静态帧定格，省 GPU/电量——2026-09-28 定案）。
 *   用户手动切换后按 localStorage 记忆，不再受平台默认影响
 * - localStorage 异常（隐私模式等）静默降级为仅会话内生效
 */

import { useSyncExternalStore } from "react";
import { isMobileLike } from "@/lib/platform";

const KEY = "he.fx";

let on = true;
let hydrated = false;
const listeners = new Set<() => void>();

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(KEY);
  } catch {
    /* 隐私模式等：按平台默认 */
  }
  if (stored !== null) {
    on = stored !== "0";
  } else {
    // 无历史选择：移动端默认关（静态帧省电），桌面默认开
    on = !isMobileLike();
  }
}

function notify() {
  for (const l of Array.from(listeners)) l();
}

export function subscribeFx(l: () => void): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function isFxOn(): boolean {
  ensureHydrated();
  return on;
}

/** 用户操作入口：切换背景特效并持久化 */
export function requestFx(v: boolean) {
  ensureHydrated();
  if (on === v) return;
  on = v;
  try {
    localStorage.setItem(KEY, v ? "1" : "0");
  } catch {
    /* 仅会话内生效 */
  }
  notify();
}

/** React hook：当前特效是否开启（跨组件同步） */
export function useFx(): boolean {
  return useSyncExternalStore(subscribeFx, isFxOn, () => true);
}
