import type { SlaStatus } from "@/lib/types";

const SLA_STYLES: Record<SlaStatus, string> = {
  "On Track": "border-approved/30 bg-approved/10 text-approved",
  "At Risk": "border-review/30 bg-review/10 text-review",
  Overdue: "border-danger/30 bg-danger/10 text-danger",
};

export function SlaBadge({
  status,
  className = "",
}: {
  status: SlaStatus;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${SLA_STYLES[status]} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
