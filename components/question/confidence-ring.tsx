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
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-semibold tabular-nums text-ink">
          {score}
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          confidence
        </span>
      </div>
    </div>
  );
}
