"use client";

/* Funds · balance / income / multiplier readout */

interface FundsProps {
  /** Token balance, rendered as $HACK */
  points?: number;
  /** Static ETH balance line */
  eth?: number;
  /** Today's income (signed automatically) */
  income?: number;
  multiplier?: number;
}

export function Funds({ points = 12480, eth = 0.045, income = 320, multiplier = 2.5 }: FundsProps) {
  return (
    <div className="widget h-full">
      <div className="widget-title">FUNDS</div>
      <div className="text-[11px] leading-relaxed">
        <div className="flex justify-between">
          <span className="text-[var(--edex-fg-dim)]">$HACK</span>
          <span className="text-[var(--edex-acc)]">{points.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--edex-fg-dim)]">ETH</span>
          <span className="text-[var(--edex-fg-bright)]">{eth.toFixed(3)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--edex-fg-dim)]">TODAY</span>
          <span className="text-[#8fe3a8]">
            {income >= 0 ? "+" : ""}
            {income}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--edex-fg-dim)]">MULTIPLIER</span>
          <span className="text-[#ffd700]">{multiplier.toFixed(1)}x</span>
        </div>
      </div>
    </div>
  );
}
