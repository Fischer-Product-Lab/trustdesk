import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { questionnaires } from "@/data/questionnaires";
import { controls } from "@/data/controls";
import { scoreQuestionnaires } from "@/lib/metrics";
import { SlaBadge } from "@/components/sla-badge";
import {
  WorkspaceTable,
  type WorkspaceRow,
} from "@/components/questionnaire/workspace-table";

export const metadata: Metadata = {
  title: "Questionnaire Workspace — TrustDesk",
  description:
    "Every in-flight customer trust question with its drafted answer, confidence, mapped evidence, and reviewer routing.",
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function QuestionnairesPage() {
  const scored = scoreQuestionnaires(questionnaires, controls);

  const rows: WorkspaceRow[] = scored.flatMap((sq) =>
    sq.scored.map((s) => {
      const question = sq.questionnaire.questions.find(
        (q) => q.id === s.questionId,
      )!;
      return {
        questionnaireId: sq.questionnaire.id,
        questionId: s.questionId,
        customer: s.customer,
        prompt: s.prompt,
        category: s.category,
        score: s.result.score,
        status: s.result.status,
        reviewer: s.result.reviewer,
        evidence: s.result.evidence,
        mappedCount: question.mappedControlIds.length,
      };
    }),
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Questionnaire Workspace
        </h1>
        <p className="mt-2 text-ink-muted">
          {rows.length} questions across {scored.length} customer questionnaires.
          Each answer&apos;s confidence, status, and reviewer is computed from the
          mapped evidence — search, filter, and open any row to see why.
        </p>
      </header>

      {/* Questionnaire entry points */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scored.map((sq) => {
          const open =
            sq.statusCounts["Needs Review"] + sq.statusCounts.Escalate;
          return (
            <Link
              key={sq.questionnaire.id}
              href={`/questionnaires/${sq.questionnaire.id}`}
              className="group rounded-xl border border-hairline bg-surface p-5 transition-colors hover:border-gold/40 hover:bg-surface-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-medium text-ink group-hover:text-gold">
                    {sq.questionnaire.customer}
                  </h2>
                  <p className="text-xs text-ink-faint">
                    {sq.questionnaire.industry} · {sq.questionnaire.dealStage}
                  </p>
                </div>
                <SlaBadge status={sq.sla} />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-ink-muted">
                  {sq.questionnaire.questions.length} questions
                </span>
                <span className="tabular-nums text-ink-muted">
                  {currency.format(sq.questionnaire.dealValueUsd)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-ink-faint">
                <span>
                  {open > 0
                    ? `${open} awaiting a reviewer`
                    : "All answers automated"}
                </span>
                <span className="inline-flex items-center gap-1 group-hover:text-gold">
                  Open <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      <WorkspaceTable rows={rows} />
    </div>
  );
}
