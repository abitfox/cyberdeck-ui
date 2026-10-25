"use client";

/**
 * 平台/视口判定收口：全站所有「自动聚焦终端输入框」的逻辑必须经由此处，
 * 移动端（<1024px 或触屏）一律不自动聚焦——只有用户手指直接点输入框才激活键盘。
 * 桌面端维持原有抢焦点的终端体验。
 */

export function isDesktopViewport(): boolean {
  if (typeof window === "undefined") return true; // SSR 默认按桌面（不聚焦，无副作用）
  return window.matchMedia("(min-width: 1024px)").matches;
}

export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

/** 移动端 = 触屏或窄视口（任一命中即按移动端对待） */
export function isMobileLike(): boolean {
  if (typeof window === "undefined") return false;
  return !isDesktopViewport() || isTouchDevice();
}
