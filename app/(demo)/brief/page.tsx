import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarClock,
  FileWarning,
  Scale,
} from "lucide-react";
import { questionnaires } from "@/data/questionnaires";
import { controls } from "@/data/controls";
import { evidenceStatusFor } from "@/lib/confidence";
import { computePortfolio, scoreQuestionnaires } from "@/lib/metrics";

export const metadata: Metadata = {
  title: "Executive Brief — TrustDesk",
  description:
    "A narrative monthly summary of customer trust operations: volume, automation, SLA risk, effort saved, concern themes, and decisions needed.",
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function Figure({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <div className="font-display text-3xl font-semibold tabular-nums text-ink">
        {value}
      </div>
      <div className="mt-1 text-sm text-ink-muted">{label}</div>
    </div>
  );
}

export default function BriefPage() {
  const scored = scoreQuestionnaires(questionnaires, controls);
  const m = computePortfolio(scored);

  const escalated = scored.flatMap((sq) =>
    sq.scored
      .filter((s) => s.result.status === "Escalate")
      .map((s) => ({ customer: s.customer, prompt: s.prompt, id: s.questionId, qn: sq.questionnaire.id })),
  );

  const overdue = scored.filter((sq) => sq.sla === "Overdue");
  const atRisk = scored.filter((sq) => sq.sla === "At Risk");

  const staleControls = controls
    .map((c) => ({ control: c, evidence: evidenceStatusFor(c) }))
    .filter((x) => x.evidence !== "Current");

  const topThemes = m.categoryCounts.slice(0, 3).map((c) => c.category);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold-soft">
          <CalendarClock className="h-3.5 w-3.5" />
          Period ending June 2026
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink">
          Executive Brief
        </h1>
        <p className="mt-2 text-ink-muted">
          Customer trust operations summary for security, sales, and executive
          leadership.
        </p>
      </header>

      {/* Narrative */}
      <section className="rounded-xl border border-hairline bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Summary</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-muted">
          <p>
            TrustDesk processed{" "}
            <span className="text-ink">{m.totalQuestions} questions</span> across{" "}
            <span className="text-ink">
              {m.totalQuestionnaires} active customer questionnaires
            </span>
            , supporting{" "}
            <span className="text-ink">
              {currency.format(m.revenueSupported)}
            </span>{" "}
            in deal value. The engine auto-approved{" "}
            <span className="text-ink">{m.automationRatePct}%</span> of answers
            against current, approved evidence, with{" "}
            <span className="text-ink">{m.draftReadyPct}%</span> draft-ready once
            suggested responses are included — an estimated{" "}
            <span className="text-ink">{m.hoursSaved} SME hours</span> saved this
            period.
          </p>
          <p>
            <span className="text-ink">{m.escalations} answers</span> were routed
            to Privacy or Legal for mandatory sign-off, and{" "}
            <span className="text-ink">{m.statusCounts.Escalate}</span> were
            escalated outright because they combined sensitive subject matter with
            expired or missing evidence. Customer concern continues to concentrate
            in {topThemes.join(", ")}.
          </p>
          <p>
            On SLA: <span className="text-ink">{m.sla.Overdue} overdue</span> and{" "}
            <span className="text-ink">{m.sla["At Risk"]} at risk</span>. The most
            material constraint on automation this period is{" "}
            <span className="text-ink">
              {staleControls.length} control{staleControls.length === 1 ? "" : "s"}
            </span>{" "}
            with expiring or expired evidence — refreshing them would lift several
            answers back into the auto-approval band.
          </p>
        </div>
      </section>

      {/* Key figures */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Figure value={m.totalQuestions} label="Questions processed" />
        <Figure value={`${m.automationRatePct}%`} label="Automation rate" />
        <Figure value={m.hoursSaved} label="SME hours saved" />
        <Figure value={currency.format(m.revenueSupported)} label="Revenue supported" />
      </section>

      {/* Customer concern themes */}
      <section className="rounded-xl border border-hairline bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Customer concern themes
        </h2>
        <p className="mb-4 mt-1 text-sm text-ink-faint">
          Where customer due-diligence questions concentrated this period.
        </p>
        <ul className="space-y-2.5">
          {m.categoryCounts.slice(0, 5).map((c) => (
            <li key={c.category} className="flex items-center gap-3 text-sm">
              <span className="w-8 shrink-0 text-right font-display text-base font-semibold tabular-nums text-gold">
                {c.count}
              </span>
              <span className="text-ink-muted">{c.category}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Decisions needed */}
      <section className="rounded-xl border border-hairline bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Decisions needed
        </h2>
        <ul className="mt-4 space-y-4">
          {overdue.length + atRisk.length > 0 && (
            <li className="flex items-start gap-3 text-sm">
              <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-review" />
              <span className="text-ink-muted">
                <span className="text-ink">Prioritize at-risk SLAs.</span>{" "}
                {overdue.map((sq, i) => (
                  <span key={sq.questionnaire.id}>
                    <Link
                      href={`/questionnaires/${sq.questionnaire.id}`}
                      className="text-gold-soft hover:text-gold"
                    >
                      {sq.questionnaire.customer}
                    </Link>
                    {i < overdue.length - 1 ? ", " : ""}
                  </span>
                ))}
                {overdue.length > 0 ? " overdue; " : ""}
                {atRisk.length} other{atRisk.length === 1 ? "" : "s"} approaching
                their due date.
              </span>
            </li>
          )}

          <li className="flex items-start gap-3 text-sm">
            <FileWarning className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
            <span className="text-ink-muted">
              <span className="text-ink">Refresh stale evidence.</span>{" "}
              {staleControls.map((s, i) => (
                <span key={s.control.id}>
                  <Link
                    href={`/controls#${s.control.id}`}
                    className="text-gold-soft hover:text-gold"
                  >
                    {s.control.id}
                  </Link>
                  {i < staleControls.length - 1 ? ", " : ""}
                </span>
              ))}{" "}
              are expiring or expired and are actively capping answer confidence.
            </span>
          </li>

          {escalated.length > 0 && (
            <li className="flex items-start gap-3 text-sm">
              <Scale className="mt-0.5 h-4 w-4 shrink-0 text-review" />
              <span className="text-ink-muted">
                <span className="text-ink">Clear legal/privacy escalations.</span>{" "}
                {escalated.length} question{escalated.length === 1 ? "" : "s"}{" "}
                require a Privacy or Legal decision before they can be answered —
                e.g.{" "}
                <Link
                  href={`/questionnaires/${escalated[0].qn}#${escalated[0].id}`}
                  className="text-gold-soft hover:text-gold"
                >
                  {escalated[0].customer}
                </Link>
                .
              </span>
            </li>
          )}

          <li className="flex items-start gap-3 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span className="text-ink-muted">
              <span className="text-ink">Sustain automation.</span> With current
              evidence refreshed, the deterministic engine keeps{" "}
              {m.automationRatePct}% of answers off the SME&apos;s desk while
              guaranteeing every sensitive answer still gets human sign-off.
            </span>
          </li>
        </ul>
      </section>

      <p className="text-xs text-ink-faint">
        This brief is generated deterministically from the synthetic questionnaire
        set — every figure traces to the confidence engine, not manual entry.
      </p>
    </div>
  );
}
