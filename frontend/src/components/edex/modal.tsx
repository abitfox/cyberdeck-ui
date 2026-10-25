"use client";

import { useEffect, type ReactNode } from "react";

/* Modal · hacker-style dialog shell.
 * Backdrop fades in, panel zoom-floats in (`.popup-bg` / `.popup-panel`),
 * or use variant="intro" for the loud "encrypted package popping open"
 * entrance (`.intro-bg` / `.intro-panel`). */

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  /** Default panel width (px) */
  width?: number;
  /** "popup" = subtle zoom-float-in, "intro" = big decompression entrance */
  variant?: "popup" | "intro";
  /** Lock page scroll while open (default true) */
  lockScroll?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  width = 420,
  variant = "popup",
  lockScroll = true,
}: ModalProps) {
  useEffect(() => {
    if (!open || !lockScroll) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, lockScroll]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const bgCls = variant === "intro" ? "intro-bg" : "popup-bg";
  const panelCls = variant === "intro" ? "intro-panel" : "popup-panel";

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 ${bgCls}`}
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={() => onClose?.()}
    >
      <div
        className={`${panelCls} relative max-h-[86vh] overflow-y-auto edex-scroll border border-[var(--edex-line-strong)] bg-[var(--edex-bg-2)] shadow-[0_0_40px_rgba(0,0,0,0.6)]`}
        style={{ width: "min(100%, " + width + "px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {title !== undefined && (
          <header className="flex items-center justify-between border-b border-[var(--edex-line)] px-4 py-2.5">
            <span className="edex-panel-label">{title}</span>
            {onClose && (
              <button
                onClick={onClose}
                title="Close"
                className="px-1 text-[13px] leading-none text-[var(--edex-fg-dim)] transition hover:text-[var(--edex-acc)]"
              >
                ✕
              </button>
            )}
          </header>
        )}
        <div className="p-4 text-[12px] leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
