"use client";

import { ScrambleText } from "./scramble-text";

/**
 * 工作站开机序列覆盖层，由 page.tsx 的 stage 状态机驱动：
 * stage 0: 待命（全黑）
 * stage 1: 矩形框渐显
 * stage 2: Loading 乱码文字 + 进度条
 * stage 3: Loading 渐隐，矩形扩张为全屏
 * stage 4: 覆盖层整体淡出，露出面板外框
 * stage 5+: 页面内容 .boot-seq 逐个显现（page.tsx 加 booted 类）
 * stage 6: 卸载本组件
 */
export function BootOverlay({ stage }: { stage: number }) {
  if (stage >= 6) return null;

  const rectVisible = stage >= 1;
  const loadingVisible = stage >= 2 && stage < 3;
  const expanded = stage >= 3;

  return (
    <div
      className={`absolute inset-0 z-40 bg-[var(--edex-bg)] transition-opacity duration-700 ease-out ${
        stage >= 4 ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* 中央矩形框 → 扩张为全屏 */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-[var(--edex-line-strong)] bg-[var(--edex-bg-2)] shadow-[0_0_24px_rgba(127,179,186,0.08)] transition-all duration-700 ease-out"
        style={{
          width: expanded ? "100%" : "min(560px, 82vw)",
          height: expanded ? "100%" : "min(320px, 62vh)",
          opacity: rectVisible ? 1 : 0,
          transitionProperty: "width, height, opacity, border-color",
          borderColor: stage >= 4 ? "transparent" : undefined,
        }}
      >
        {/* 四角装饰 */}
        {(["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"] as const).map(
          (pos) => (
            <span
              key={pos}
              className={`absolute h-4 w-4 border-[var(--edex-acc)] ${pos}`}
              style={{ opacity: rectVisible ? 1 : 0, transition: "opacity .4s" }}
            />
          ),
        )}

        {/* Loading 信息 */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-4 transition-opacity duration-300 ${
            loadingVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <ScrambleText
            text="CYBERDECK OS v1.0"
            delay={200}
            speed={34}
            sound
            active={stage >= 2}
            className="text-[10px] tracking-[0.4em] text-[var(--edex-fg-dim)]"
          />
          <ScrambleText
            text="INITIALIZING SECURE WORKSTATION"
            delay={420}
            speed={26}
            sound
            active={stage >= 2}
            className="edex-glow text-sm tracking-[0.3em] text-[var(--edex-fg-bright)]"
          />
          <div className="mt-1 h-px w-52 bg-[rgba(170,200,205,0.14)]">
            <div
              className="h-full bg-[var(--edex-fg)] transition-[width] duration-[1300ms] ease-linear"
              style={{ width: stage >= 2 ? "100%" : "0%" }}
            />
          </div>
          <ScrambleText
            text="DECRYPTING SYSTEM DATA ..."
            delay={1200}
            speed={30}
            sound
            active={stage >= 2}
            className="text-[10px] tracking-[0.25em] text-[var(--edex-fg-dim)]"
          />
        </div>
      </div>
    </div>
  );
}
