import type { Metadata } from "next";
import { controls } from "@/data/controls";
import { evidenceStatusFor } from "@/lib/confidence";
import { EvidenceBadge } from "@/components/evidence-badge";
import type { EvidenceStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Control & Evidence Library — TrustDesk",
  description:
    "Approved control responses with framework mappings, evidence owners, and freshness — the source TrustDesk drafts answers from.",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

export default function ControlsPage() {
  const scored = controls.map((control) => ({
    control,
    evidence: evidenceStatusFor(control),
  }));

  const counts = scored.reduce<Record<EvidenceStatus, number>>(
    (acc, s) => {
      acc[s.evidence] += 1;
      return acc;
    },
    { Current: 0, "Expiring Soon": 0, Expired: 0 },
  );

  // Surface stale evidence first — it's the actionable risk.
  const order: Record<EvidenceStatus, number> = {
    Expired: 0,
    "Expiring Soon": 1,
    Current: 2,
  };
  const sorted = [...scored].sort(
    (a, b) =>
      order[a.evidence] - order[b.evidence] ||
      a.control.id.localeCompare(b.control.id),
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Control &amp; Evidence Library
        </h1>
        <p className="mt-2 text-ink-muted">
          {controls.length} approved controls TrustDesk drafts answers from.
          Freshness is computed from each control&apos;s review and expiry dates —
          stale evidence is surfaced first because it gates automation.
        </p>
      </header>

      {/* Freshness summary */}
      <section className="grid gap-4 sm:grid-cols-3">
        {(["Current", "Expiring Soon", "Expired"] as EvidenceStatus[]).map(
          (status) => (
            <div
              key={status}
              className="flex items-center justify-between rounded-xl border border-hairline bg-surface p-5"
            >
              <div>
                <div className="font-display text-3xl font-semibold tabular-nums text-ink">
                  {counts[status]}
                </div>
                <div className="mt-1 text-sm text-ink-muted">{status}</div>
              </div>
              <EvidenceBadge status={status} />
            </div>
          ),
        )}
      </section>

      {/* Controls */}
      <section className="space-y-4">
        {sorted.map(({ control, evidence }) => (
          <article
            key={control.id}
            id={control.id}
            className="scroll-mt-20 rounded-xl border border-hairline bg-surface p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="font-mono text-xs text-gold-soft">
                  {control.id}
                </span>
                <h2 className="font-display text-lg font-semibold text-ink">
                  {control.title}
                </h2>
                <p className="text-xs text-ink-faint">{control.category}</p>
              </div>
              <EvidenceBadge status={evidence} />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {control.frameworks.map((fw) => (
                <span
                  key={fw}
                  className="rounded-full border border-hairline bg-surface-2/50 px-2.5 py-0.5 text-xs text-ink-muted"
                >
                  {fw}
                </span>
              ))}
            </div>

            <p className="mt-4 rounded-lg border border-hairline bg-surface-2/40 p-4 text-sm leading-relaxed text-ink-muted">
              {control.approvedLanguage}
            </p>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-ink-faint">
                  Evidence owner
                </dt>
                <dd className="mt-0.5 text-ink">{control.evidenceOwner}</dd>
                <dd className="text-xs text-ink-faint">{control.ownerTeam}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-ink-faint">
                  Last reviewed
                </dt>
                <dd className="mt-0.5 tabular-nums text-ink">
                  {dateFormatter.format(new Date(control.lastReviewed))}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-ink-faint">
                  Expires
                </dt>
                <dd className="mt-0.5 tabular-nums text-ink">
                  {dateFormatter.format(new Date(control.expiresOn))}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </div>
  );
}
