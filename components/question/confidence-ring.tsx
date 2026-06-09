import type { AnswerStatus } from "@/lib/types";
import { STATUS_HEX } from "@/components/status-badge";

/** Pure SVG confidence ring — no client JS needed. */
export function ConfidenceRing({
  score,
  status,
  size = 152,
  stroke = 12,
}: {
  score: number;
  status: AnswerStatus;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const color = STATUS_HEX[status];

  // Scale the inner text with the ring so it always fits inside the stroke —
  // a fixed label gets letter-spaced wider than a small ring's inner diameter.
  const scoreFontSize = Math.round(size * 0.3);
  const labelFontSize = Math.max(8, Math.round(size * 0.082));

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-surface-2"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span
          className="font-display font-semibold leading-none tabular-nums text-ink"
          style={{ fontSize: scoreFontSize }}
        >
          {score}
        </span>
        <span
          className="uppercase leading-none text-ink-faint"
          style={{ fontSize: labelFontSize, letterSpacing: "0.12em" }}
        >
          confidence
        </span>
      </div>
    </div>
  );
}
