import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import {
  getQuestionnaireById,
  questionnaires,
} from "@/data/questionnaires";
import { controls } from "@/data/controls";
import {
  AS_OF_DATE,
  CONFIDENCE_FACTORS,
  computeConfidence,
  controlsForQuestion,
  evidenceStatusFor,
} from "@/lib/confidence";
import { slaStatusFor, daysUntilDue } from "@/lib/metrics";
import { StatusBadge } from "@/components/status-badge";
import { EvidenceBadge } from "@/components/evidence-badge";
import { SlaBadge } from "@/components/sla-badge";
import { ConfidenceRing } from "@/components/question/confidence-ring";
import {
  FactorBreakdown,
  type FactorRow,
} from "@/components/question/factor-breakdown";

export function generateStaticParams() {
  return questionnaires.map((q) => ({ id: q.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const questionnaire = getQuestionnaireById(id);
  if (!questionnaire) return { title: "Questionnaire not found — TrustDesk" };
  return {
    title: `${questionnaire.customer} — TrustDesk`,
    description: `Customer security questionnaire from ${questionnaire.customer} (${questionnaire.industry}).`,
  };
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-ink-faint">
        {label}
      </dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  );
}

export default async function QuestionnaireDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const questionnaire = getQuestionnaireById(id);
  if (!questionnaire) notFound();

  const sla = slaStatusFor(questionnaire);
  const days = daysUntilDue(questionnaire);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link
        href="/questionnaires"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to workspace
      </Link>

      {/* Header */}
      <header className="rounded-xl border border-hairline bg-surface p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            {questionnaire.customer}
          </h1>
          <SlaBadge status={sla} />
        </div>
        <p className="mt-1 text-sm text-ink-faint">
          {questionnaire.id} · {questionnaire.industry}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 text-sm sm:grid-cols-3 lg:grid-cols-5">
          <Meta label="Deal stage" value={questionnaire.dealStage} />
          <Meta label="Deal value" value={currency.format(questionnaire.dealValueUsd)} />
          <Meta label="Questions" value={String(questionnaire.questions.length)} />
          <Meta label="Received" value={dateFormatter.format(new Date(questionnaire.receivedDate))} />
          <Meta
            label="Due"
            value={`${dateFormatter.format(new Date(questionnaire.dueDate))} (${
              days < 0 ? `${Math.abs(days)}d overdue` : `${days}d`
            })`}
          />
        </dl>
      </header>

      {/* Questions */}
      <section className="space-y-6">
        {questionnaire.questions.map((question) => {
          const result = computeConfidence(question, controls);
          const mapped = controlsForQuestion(question, controls);
          const cleared = result.status === "Auto-Approved";

          const factors: FactorRow[] = CONFIDENCE_FACTORS.map((f) => ({
            label: f.label,
            weight: f.weight,
            value: f.valueFor(question, mapped, AS_OF_DATE),
          }));

          return (
            <article
              key={question.id}
              id={question.id}
              className="scroll-mt-20 space-y-6"
            >
              {/* Question prompt */}
              <div>
                <span className="text-[11px] uppercase tracking-wider text-ink-faint">
                  {question.category} · {question.id}
                </span>
                <h2 className="mt-1 font-display text-lg font-semibold text-ink">
                  {question.prompt}
                </h2>
              </div>

              {/* Drafted answer */}
              <div className="rounded-xl border border-hairline bg-surface p-4">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-ink-faint">
                  <FileText className="h-3.5 w-3.5" />
                  Drafted response
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {question.suggestedAnswer}
                </p>
              </div>

              {/* Confidence scorecard — mirrors AgentOps launch-readiness layout */}
              <section className="grid gap-6 lg:grid-cols-3">
                <div className="flex flex-col items-center gap-4 rounded-xl border border-hairline bg-surface p-6">
                  <h3 className="self-start font-display text-lg font-semibold text-ink">
                    Answer confidence
                  </h3>
                  <ConfidenceRing score={result.score} status={result.status} />
                  <StatusBadge status={result.status} />
                  <div className="flex w-full items-center gap-2.5 rounded-lg border border-hairline bg-surface-2/30 px-3 py-2.5 text-sm">
                    <UserCheck className="h-4 w-4 shrink-0 text-gold" />
                    <span className="text-ink-faint">Routed to</span>
                    <span className="font-medium text-ink">{result.reviewer}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-hairline bg-surface p-6 lg:col-span-2">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    Confidence factors
                  </h3>
                  <p className="mb-4 mt-1 text-sm text-ink-faint">
                    Five weighted factors scored 0–4. Evidence Freshness is
                    derived live from mapped control expiry dates.
                  </p>
                  <FactorBreakdown factors={factors} />
                </div>
              </section>

              {/* Mapped evidence */}
              <section className="rounded-xl border border-hairline bg-surface p-6">
                <h3 className="font-display text-lg font-semibold text-ink">
                  Mapped evidence
                </h3>
                {mapped.length === 0 ? (
                  <p className="mt-3 text-sm text-ink-faint">
                    No control mapped — cannot be answered from the library.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-2">
                    {mapped.map((control) => (
                      <li
                        key={control.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-hairline bg-surface-2/30 px-3 py-2"
                      >
                        <Link href={`/controls#${control.id}`} className="min-w-0">
                          <span className="block font-mono text-xs text-gold-soft">
                            {control.id}
                          </span>
                          <span className="block truncate text-sm text-ink-muted">
                            {control.title}
                          </span>
                        </Link>
                        <EvidenceBadge status={evidenceStatusFor(control)} />
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Why this verdict */}
              <section className="rounded-xl border border-hairline bg-surface p-6">
                <h3 className="font-display text-lg font-semibold text-ink">
                  Why this verdict
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {result.reasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      {cleared ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-approved" />
                      ) : (
                        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-review" />
                      )}
                      <span className="text-ink-muted">{reason}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </article>
          );
        })}
      </section>
    </div>
  );
}
