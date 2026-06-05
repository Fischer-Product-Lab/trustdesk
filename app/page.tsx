import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  Clock,
  DollarSign,
  Scale,
  Sparkles,
  Zap,
} from "lucide-react";
import { questionnaires } from "@/data/questionnaires";
import { controls } from "@/data/controls";
import { computePortfolio, scoreQuestionnaires } from "@/lib/metrics";
import { StatusBadge } from "@/components/status-badge";
import { SlaBadge } from "@/components/sla-badge";
import { StatusDonut } from "@/components/dashboard/status-donut";
import { CategoryBar } from "@/components/dashboard/category-bar";
import { ANSWER_STATUS_ORDER } from "@/lib/metrics";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

function KpiCard({
  label,
  value,
  icon: Icon,
  accent = "gold",
  hint,
}: {
  label: string;
  value: string | number;
  icon: typeof ClipboardList;
  accent?: "gold" | "approved" | "review" | "data";
  hint?: string;
}) {
  const accentClass =
    accent === "approved"
      ? "border-approved/30 bg-approved/10 text-approved"
      : accent === "review"
        ? "border-review/30 bg-review/10 text-review"
        : accent === "data"
          ? "border-data/30 bg-data/10 text-data"
          : "border-gold/30 bg-gold/10 text-gold";
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg border ${accentClass}`}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <div className="mt-4 font-display text-3xl font-semibold tabular-nums text-ink">
        {value}
      </div>
      <div className="mt-1 text-sm text-ink-muted">{label}</div>
      {hint && <div className="mt-0.5 text-xs text-ink-faint">{hint}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const scored = scoreQuestionnaires(questionnaires, controls);
  const m = computePortfolio(scored);

  const statusCounts = ANSWER_STATUS_ORDER.map((status) => ({
    status,
    count: m.statusCounts[status],
  }));

  const topCategories = m.categoryCounts.slice(0, 8);

  const slaRank: Record<string, number> = { Overdue: 0, "At Risk": 1 };
  const needsAttention = scored
    .filter((sq) => sq.sla === "Overdue" || sq.sla === "At Risk")
    .sort((a, b) => slaRank[a.sla] - slaRank[b.sla] || a.daysUntilDue - b.daysUntilDue);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Executive Dashboard
        </h1>
        <p className="mt-2 text-ink-muted">
          Customer trust at a glance: what&apos;s in flight, how much we&apos;re
          automating, what&apos;s at SLA risk, and the revenue it supports.
        </p>
      </header>

      {/* KPIs */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          label="Open questionnaires"
          value={m.totalQuestionnaires}
          icon={ClipboardList}
          hint={`${m.totalQuestions} questions in flight`}
        />
        <KpiCard
          label="Automation rate"
          value={`${m.automationRatePct}%`}
          icon={Zap}
          accent="approved"
          hint={`${m.draftReadyPct}% draft-ready (incl. suggested)`}
        />
        <KpiCard
          label="SME hours saved"
          value={m.hoursSaved.toLocaleString("en-US")}
          icon={Clock}
          accent="data"
          hint="Estimated across the open queue"
        />
        <KpiCard
          label="Revenue supported"
          value={currency.format(m.revenueSupported)}
          icon={DollarSign}
          hint="Deal value tied to open requests"
        />
        <KpiCard
          label="Legal / privacy escalations"
          value={m.escalations}
          icon={Scale}
          accent="review"
          hint="Routed to Privacy or Legal for sign-off"
        />
        <KpiCard
          label="SLA risk"
          value={m.sla.Overdue + m.sla["At Risk"]}
          icon={AlertTriangle}
          accent="review"
          hint={`${m.sla.Overdue} overdue · ${m.sla["At Risk"]} at risk`}
        />
      </section>

      {/* Charts */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-hairline bg-surface p-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Answers by automation status
          </h2>
          <div className="mt-2 grid items-center gap-4 sm:grid-cols-2">
            <StatusDonut data={statusCounts} total={m.totalQuestions} />
            <ul className="space-y-2">
              {statusCounts.map(({ status, count }) => (
                <li
                  key={status}
                  className="flex items-center justify-between gap-3"
                >
                  <StatusBadge status={status} />
                  <span className="tabular-nums text-ink-muted">{count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-hairline bg-surface p-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Top recurring control categories
          </h2>
          <p className="mb-2 mt-1 text-sm text-ink-faint">
            Where customer due-diligence questions concentrate.
          </p>
          <CategoryBar data={topCategories} />
        </div>
      </section>

      {/* SLA attention */}
      <section className="rounded-xl border border-hairline bg-surface p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-ink">
            Needs attention
          </h2>
          <Link
            href="/questionnaires"
            className="inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-gold"
          >
            View all questionnaires
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {needsAttention.length === 0 ? (
          <p className="text-sm text-ink-muted">
            No questionnaires are at SLA risk.
          </p>
        ) : (
          <ul className="divide-y divide-hairline/60">
            {needsAttention.map((sq) => {
              const open =
                sq.statusCounts["Needs Review"] + sq.statusCounts.Escalate;
              return (
                <li key={sq.questionnaire.id}>
                  <Link
                    href={`/questionnaires/${sq.questionnaire.id}`}
                    className="group flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4"
                  >
                    <div className="flex items-center gap-3 sm:w-64 sm:shrink-0">
                      <SlaBadge status={sq.sla} />
                      <span className="font-medium text-ink group-hover:text-gold">
                        {sq.questionnaire.customer}
                      </span>
                    </div>
                    <span className="text-sm text-ink-muted">
                      {sq.daysUntilDue < 0
                        ? `${Math.abs(sq.daysUntilDue)} days overdue`
                        : `due in ${sq.daysUntilDue} days`}
                      {" · "}
                      {open} item{open === 1 ? "" : "s"} awaiting a reviewer
                      {" · "}
                      {currency.format(sq.questionnaire.dealValueUsd)} deal
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Footer note */}
      <p className="flex items-center gap-2 text-xs text-ink-faint">
        <Sparkles className="h-3.5 w-3.5 text-gold/70" />
        Every metric above is computed from the synthetic questionnaire set by
        the deterministic confidence engine — no figures are hand-entered.
      </p>
    </div>
  );
}
