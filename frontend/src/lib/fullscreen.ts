"use client";

/** 全屏切换共享逻辑（门禁页右上角按钮 / 工作站键盘区下方控制行共用）。
 *  requestFullscreen 需用户手势——点击按钮调用即符合；
 *  移动端进入全屏后锁竖屏（2026-09-28 定案），桌面锁横屏；
 *  iOS Safari 不支持网页全屏 API → 置 hint 降级提示，不抛错。 */
import { useEffect, useState } from "react";

export function useFullscreenToggle() {
  const [fs, setFs] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(window.matchMedia("(hover: none) and (pointer: coarse)").matches);
    const h = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  async function toggle() {
    const orientation = screen.orientation as
      | (ScreenOrientation & { lock?: (o: string) => Promise<void>; unlock?: () => void })
      | undefined;
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        try {
          await orientation?.lock?.(mobile ? "portrait" : "landscape");
        } catch {
          /* 锁屏方向不支持（iOS 等）：用户手动竖置即可 */
        }
      } else {
        try {
          orientation?.unlock?.();
        } catch {
          /* 忽略 */
        }
        await document.exitFullscreen();
      }
      setHint(null);
    } catch {
      /* iPhone Safari 等不支持网页全屏 */
      setHint("此浏览器不支持全屏，请手动横置手机");
      window.setTimeout(() => setHint(null), 2600);
    }
  }

  return { fs, hint, mobile, toggle };
}
