import { FileText, ShieldCheck, UserCheck } from "lucide-react";
import { questionnaires } from "@/data/questionnaires";
import { controls } from "@/data/controls";
import {
  computeConfidence,
  controlsForQuestion,
  evidenceStatusFor,
} from "@/lib/confidence";
import { slaStatusFor } from "@/lib/metrics";
import { StatusBadge } from "@/components/status-badge";
import { EvidenceBadge } from "@/components/evidence-badge";
import { SlaBadge } from "@/components/sla-badge";
import { ConfidenceRing } from "@/components/question/confidence-ring";

const QUESTIONNAIRE_ID = "qn-001";
const QUESTION_ID = "q-001";

/**
 * Faithful in-page chrome of the Northwind questionnaire detail —
 * the real engine, the real evidence, the real verdict. Not a generic dashboard.
 */
export function ProductWindow() {
  const questionnaire = questionnaires.find((q) => q.id === QUESTIONNAIRE_ID);
  const question = questionnaire?.questions.find((q) => q.id === QUESTION_ID);
  if (!questionnaire || !question) return null;

  const result = computeConfidence(question, controls);
  const mapped = controlsForQuestion(question, controls);
  const sla = slaStatusFor(questionnaire);

  return (
    <div className="product-window overflow-hidden rounded-xl bg-canvas">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-hairline bg-surface px-3 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-ivory/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ivory/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ivory/15" />
        </div>
        <div className="mx-auto flex h-7 max-w-md flex-1 items-center justify-center rounded-md border border-hairline bg-canvas px-3 font-mono text-[11px] tracking-normal text-ink-faint">
          trustdesk · questionnaires / {questionnaire.id}
        </div>
      </div>

      <div className="flex min-h-[28rem] bg-canvas">
        {/* Mini sidebar — same rail as the live demo */}
        <aside className="hidden w-44 shrink-0 border-r border-hairline bg-surface/40 p-3 sm:block">
          <div className="flex items-center gap-2 px-1 py-1">
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-gold/40 bg-gold/10 text-gold">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-display text-sm font-semibold text-ink">
                TrustDesk
              </span>
              <span className="text-[9px] uppercase tracking-[0.16em] text-ink-faint">
                FPL
              </span>
            </span>
          </div>
          <div className="mt-4 px-1 text-[9px] font-medium uppercase tracking-[0.16em] text-ink-faint">
            Trust Operations
          </div>
          <ul className="mt-2 space-y-0.5 text-[12px]">
            {["Dashboard", "Questionnaires", "Control Library", "Executive Brief"].map(
              (label, i) => (
                <li
                  key={label}
                  className={`relative rounded-md px-2.5 py-1.5 ${
                    i === 1
                      ? "bg-surface-2 text-ink"
                      : "text-ink-muted"
                  }`}
                >
                  {i === 1 && (
                    <span className="absolute left-0 top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded-full bg-gold" />
                  )}
                  {label}
                </li>
              ),
            )}
          </ul>
        </aside>

        {/* Question detail — mirrors /questionnaires/qn-001 */}
        <div className="min-w-0 flex-1 space-y-4 p-4 sm:p-5">
          <header className="rounded-xl border border-hairline bg-surface p-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                {questionnaire.customer}
              </h3>
              <SlaBadge status={sla} />
            </div>
            <p className="mt-1 text-[12px] text-ink-faint">
              {questionnaire.id} · {questionnaire.industry}
            </p>
          </header>

          <article className="rounded-xl border border-hairline bg-surface p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <span className="text-[11px] uppercase tracking-wider text-ink-faint">
                  {question.category} · {question.id}
                </span>
                <h4 className="mt-1 font-display text-base font-semibold text-ink">
                  {question.prompt}
                </h4>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <ConfidenceRing
                  score={result.score}
                  status={result.status}
                  size={80}
                  stroke={8}
                />
                <StatusBadge status={result.status} />
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-hairline bg-surface-2/40 p-3">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-ink-faint">
                <FileText className="h-3.5 w-3.5" />
                Drafted response
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                {question.suggestedAnswer}
              </p>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <h5 className="mb-2 text-[13px] font-medium text-ink">
                  Mapped evidence
                </h5>
                <ul className="space-y-2">
                  {mapped.map((control) => (
                    <li
                      key={control.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-hairline bg-surface-2/30 px-3 py-2"
                    >
                      <span className="min-w-0">
                        <span className="block font-mono text-[11px] text-gold-soft">
                          {control.id}
                        </span>
                        <span className="block truncate text-[13px] text-ink-muted">
                          {control.title}
                        </span>
                      </span>
                      <EvidenceBadge status={evidenceStatusFor(control)} />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2.5 rounded-lg border border-hairline bg-surface-2/30 px-3 py-2.5 text-[13px]">
                  <UserCheck className="h-4 w-4 shrink-0 text-gold" />
                  <span className="text-ink-faint">Routed to</span>
                  <span className="font-medium text-ink">{result.reviewer}</span>
                </div>
                <p className="text-[13px] leading-relaxed text-ink-muted">
                  {result.reasons[0]}
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
