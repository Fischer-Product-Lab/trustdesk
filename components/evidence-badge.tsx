import type { EvidenceStatus } from "@/lib/types";

type Evidence = EvidenceStatus | "No Evidence";

const EVIDENCE_STYLES: Record<Evidence, string> = {
  Current: "border-approved/30 bg-approved/10 text-approved",
  "Expiring Soon": "border-review/30 bg-review/10 text-review",
  Expired: "border-danger/30 bg-danger/10 text-danger",
  "No Evidence": "border-danger/30 bg-danger/10 text-danger",
};

export function EvidenceBadge({
  status,
  className = "",
}: {
  status: Evidence;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${EVIDENCE_STYLES[status]} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
