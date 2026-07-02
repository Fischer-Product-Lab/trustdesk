function barColor(value: number): string {
  if (value <= 1) return "bg-danger";
  if (value === 2) return "bg-review";
  if (value === 3) return "bg-gold";
  return "bg-approved";
}

export interface FactorRow {
  label: string;
  weight: number;
  value: number; // 0–4
}

/** Confidence factors as a labeled bar breakdown — mirrors AgentOps RubricBreakdown. */
export function FactorBreakdown({ factors }: { factors: FactorRow[] }) {
  return (
    <ul className="space-y-3.5">
      {factors.map((factor) => (
        <li key={factor.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-ink-muted">{factor.label}</span>
            <span className="shrink-0 tabular-nums text-ink-faint">
              {factor.value}/4
              <span className="ml-2 text-ink-faint/70">
                weight &times;{factor.weight.toFixed(1)}
              </span>
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
            <div
              className={`h-full rounded-full ${barColor(factor.value)}`}
              style={{ width: `${(factor.value / 4) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
