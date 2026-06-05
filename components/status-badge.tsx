import type { AnswerStatus } from "@/lib/types";

const STATUS_STYLES: Record<AnswerStatus, string> = {
  "Auto-Approved": "border-approved/30 bg-approved/10 text-approved",
  Suggested: "border-suggested/30 bg-suggested/10 text-suggested",
  "Needs Review": "border-review/30 bg-review/10 text-review",
  Escalate: "border-danger/30 bg-danger/10 text-danger",
};

/** Hex values for charts (Recharts can't read Tailwind classes). */
export const STATUS_HEX: Record<AnswerStatus, string> = {
  "Auto-Approved": "#5fd6a0",
  Suggested: "#9cc9ff",
  "Needs Review": "#e6a560",
  Escalate: "#e8736f",
};

export function StatusBadge({
  status,
  className = "",
}: {
  status: AnswerStatus;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${STATUS_STYLES[status]} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
