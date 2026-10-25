"use client";

/* Agent ID card · dynamic SVG badge, brighter color per level, gold frame when graduated */

const LVL_COLORS = ["#808080", "#808080", "var(--edex-acc)", "var(--edex-acc)", "#8a2be2", "#8a2be2", "#8a2be2", "#ffd700", "#ffd700", "#ffd700"];

interface NFTCardProps {
  level?: number;
  accuracy?: number;
  name?: string;
  address?: string;
  graduated?: boolean;
}

export function NFTCard({
  level = 5,
  accuracy = 92,
  name = "PENETRATION TESTER",
  address = "0x1234...5678",
  graduated = false,
}: NFTCardProps) {
  const color = LVL_COLORS[Math.min(level, 10) - 1] ?? "var(--edex-acc)";

  return (
    <div className="widget h-full flex items-center gap-3">
      {/* SVG badge */}
      <div className="h-full aspect-square max-w-[58px] min-h-0 flex-none">
        <svg viewBox="0 0 60 60" className="h-full w-full">
          <rect
            x="1" y="1" width="58" height="58" rx="8"
            fill="#0d1117"
            stroke={graduated ? "#ffd700" : color}
            strokeWidth={graduated ? 2.5 : 1.5}
          />
          <circle cx="30" cy="26" r="12" fill="none" stroke={color} strokeWidth="2.5" />
          <path d="M22 40 L26 33 L30 37 L34 33 L38 40" fill="none" stroke={color} strokeWidth="2" />
          <text x="30" y="16" textAnchor="middle" fontSize="7" fill="#fff">AGENT</text>
          <text x="30" y="54" textAnchor="middle" fontSize="9" fontWeight="bold" fill={color}>
            Lv.{level}
          </text>
        </svg>
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0 text-[10.5px] leading-relaxed">
        <div className="text-[var(--edex-fg-bright)] font-bold truncate">{name}</div>
        <div>
          <span className="text-[var(--edex-fg-dim)]">Lv. </span>
          <span className="text-[var(--edex-fg-bright)]">{level}</span>
        </div>
        <div>
          <span className="text-[var(--edex-fg-dim)]">ACCURACY </span>
          <span className="text-[#8fe3a8]">{accuracy}%</span>
        </div>
        <div className="text-[var(--edex-acc)]">STATUS: ACTIVE</div>
        <div className="text-[var(--edex-fg-dim)] text-[9.5px] truncate">{address}</div>
      </div>
    </div>
  );
}
