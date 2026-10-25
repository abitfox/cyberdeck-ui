import type { ReactNode } from "react";
import { ScrambleText } from "./scramble-text";

interface PanelFrameProps {
  leftLabel: string;
  rightLabel?: string;
  children: ReactNode;
  className?: string;
  /**
   * 头部标签乱码打字机的启动时刻（ms），与开机序列对齐
   * （覆盖层 stage 4 于 2900ms 开始淡出，标签随之解码显现）。
   * 不传则静态显示。
   */
  labelScrambleAt?: number;
  /**
   * 开机 loading 占位淡出延时（ms，相对根节点加 .booted 的时刻）：
   * 面板外框已显现但内容块尚未出现的空档期，居中闪烁 LOADING 提示，
   * 延时到（≈该面板最后一块内容的 boot-delay 相对偏移）自动淡出。
   * 不传则不渲染占位。
   */
  loaderDelay?: number;
}

/**
 * eDEX 风格面板：边框 + 头部左右标签 + 不顶到角落的细分割线。
 * 移植自 template/edex-ui/components/edex/panel-frame.tsx
 */
export function PanelFrame({
  leftLabel,
  rightLabel,
  children,
  className,
  labelScrambleAt,
  loaderDelay,
}: PanelFrameProps) {
  const renderLabel = (text: string) =>
    labelScrambleAt === undefined ? (
      <span className="edex-panel-label">{text}</span>
    ) : (
      <ScrambleText
        text={text}
        delay={labelScrambleAt}
        speed={40}
        className="edex-panel-label"
      />
    );

  return (
    <section
      className={`relative flex flex-col border border-[var(--edex-line)]  bg-[rgba(7,13,16,0.72)] backdrop-blur-[2px] ${
        className ?? ""
      }`}
    >
      <header className="flex items-center justify-between px-2 pt-1.5">
        {renderLabel(leftLabel)}
        {rightLabel ? renderLabel(rightLabel) : null}
      </header>
      <div className="mx-2 mt-1 h-px bg-[var(--edex-line)]" />
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {children}
        {loaderDelay !== undefined && (
          <div
            className="boot-loader"
            style={
              { "--loader-delay": `${loaderDelay}ms` } as React.CSSProperties
            }
          >
            <span className="edex-panel-label text-[10px] tracking-[0.4em] text-[var(--edex-acc)]">
              ▮ LOADING ▮
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
