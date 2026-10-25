"use client";

/* Agent Q · a breathing SVG robot face with five states.
 * Purely presentational: state and dialogue line come in as props. */

export type AgentQState = "idle" | "speaking" | "thinking" | "warning" | "satisfied";

const STATE_META: Record<AgentQState, { label: string; color: string; breathe: string }> = {
  idle: { label: "STANDBY", color: "var(--edex-acc)", breathe: "breathe" },
  speaking: { label: "SPEAKING", color: "var(--edex-acc)", breathe: "breathe" },
  thinking: { label: "PROCESSING", color: "#ffcc77", breathe: "" },
  warning: { label: "WARNING", color: "#ff6b6b", breathe: "" },
  satisfied: { label: "SUCCESS", color: "#ffd700", breathe: "breathe" },
};

function Face({ state }: { state: AgentQState }) {
  const s = STATE_META[state];
  const eyes =
    state === "thinking"
      ? [{ cy: 42, r: 2.5 }, { cy: 42, r: 2.5 }]
      : [{ cy: 44, r: 3 }, { cy: 44, r: 3 }];
  const mouthOpen =
    state === "speaking" ? 10 : state === "satisfied" ? 8 : state === "warning" ? 4 : 2;

  return (
    <svg viewBox="0 0 80 80" className="h-full w-full">
      <circle cx="40" cy="40" r="34" fill="none" stroke={s.color} strokeOpacity="0.25" />
      <circle cx="40" cy="40" r="30" fill="#0d1117" stroke={s.color} strokeOpacity="0.5" />
      {eyes.map((e, i) => (
        <circle key={i} cx={i === 0 ? 32 : 48} cy={e.cy} r={e.r} fill={s.color} />
      ))}
      <path
        d={`M ${40 - mouthOpen / 2} 56 Q 40 ${56 + mouthOpen} ${40 + mouthOpen / 2} 56`}
        fill="none"
        stroke={s.color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <animateTransform
        attributeName="transform"
        type="scale"
        values="1;1.02;1"
        dur="3s"
        repeatCount="indefinite"
      />
    </svg>
  );
}

interface AgentQProps {
  state?: AgentQState;
  line?: string;
  /** Optional action chip in the top-right corner (e.g. "▶ INTRO") */
  actionLabel?: string;
  onAction?: () => void;
}

export function AgentQ({
  state = "idle",
  line = "Welcome back, operative. The deck is warmed up and the channel is secure.",
  actionLabel = "▶ INTRO",
  onAction,
}: AgentQProps) {
  const meta = STATE_META[state];

  return (
    <div
      onClick={onAction}
      title={onAction ? actionLabel : undefined}
      className={`widget h-full flex w-full items-center gap-3 text-left transition-opacity ${
        onAction ? "cursor-pointer hover:opacity-85 active:scale-[0.99]" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className="h-full max-w-[70px] flex-1 min-h-0"
        style={{ background: "radial-gradient(circle at 50% 40%, rgba(150,220,225,0.12), transparent 70%)" }}
      >
        <Face state={state} />
      </div>
      {/* Info */}
      <div className="flex-1 min-h-0 text-[10.5px] leading-snug">
        <div className="flex items-center gap-2">
          <span className="text-[var(--edex-fg-bright)] font-bold">Q</span>
          <span className="text-[10px]" style={{ color: meta.color }}>
            ● {meta.label}
          </span>
          {onAction && (
            <span className="ml-auto text-[9px] tracking-widest text-[var(--edex-fg-dim)] opacity-70">
              {actionLabel}
            </span>
          )}
        </div>
        <div className="mt-1.5 text-[var(--edex-acc)] line-clamp-4 whitespace-pre-wrap break-words">
          “{line}”
        </div>
      </div>
    </div>
  );
}
