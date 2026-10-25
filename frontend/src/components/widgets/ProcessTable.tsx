"use client";

/* Process table · rows with per-process status indicators */

export type ProcessStatus = "running" | "waiting" | "standby";

export interface Process {
  name: string;
  status: ProcessStatus;
}

const STATUS_META: Record<ProcessStatus, { dot: string; dotColor: string; label: string }> = {
  running: { dot: "●", dotColor: "text-[#8fe3a8]", label: "RUN" },
  waiting: { dot: "◐", dotColor: "text-[#ffcc77]", label: "WAIT" },
  standby: { dot: "○", dotColor: "text-[var(--edex-fg-dim)]", label: "IDLE" },
};

interface ProcessTableProps {
  processes?: Process[];
}

export function ProcessTable({
  processes = [
    { name: "COMMS INTERCEPT", status: "running" },
    { name: "SIGNAL DECODE", status: "running" },
    { name: "AI GRADER", status: "waiting" },
    { name: "CHAIN SYNC", status: "standby" },
  ],
}: ProcessTableProps) {
  return (
    <div className="widget h-full">
      <div className="widget-title">PROCESSES</div>
      <div className="space-y-1 text-[10.5px]">
        {processes.map((p, i) => {
          const meta = STATUS_META[p.status];
          return (
            <div key={i} className="flex items-center gap-1.5">
              <span className={meta.dotColor}>{meta.dot}</span>
              <span className="text-[var(--edex-fg-bright)]">[{i + 1}] {p.name}</span>
              <span className="ml-auto">{meta.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
