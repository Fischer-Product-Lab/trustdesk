import type {
  AnswerStatus,
  Control,
  Questionnaire,
  QuestionCategory,
  SlaStatus,
} from "./types.ts";
import { AS_OF_DATE, computeConfidence, type ConfidenceResult } from "./confidence.ts";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** A questionnaire is "At Risk" when this close to (or past) its due date. */
export const SLA_AT_RISK_DAYS = 7;

/**
 * Illustrative SME effort saved per answer, by automation status. Auto-approved
 * answers save the most SME time; suggested drafts still save most of it; items
 * sent to a human save little net time. Used for the dashboard "hours saved"
 * metric — derived, never stored.
 */
export const HOURS_SAVED_PER_STATUS: Record<AnswerStatus, number> = {
  "Auto-Approved": 0.75,
  Suggested: 0.4,
  "Needs Review": 0.1,
  Escalate: 0,
};

export const ANSWER_STATUS_ORDER: AnswerStatus[] = [
  "Auto-Approved",
  "Suggested",
  "Needs Review",
  "Escalate",
];

export function daysUntilDue(
  questionnaire: Questionnaire,
  asOf: Date = AS_OF_DATE,
): number {
  const due = new Date(questionnaire.dueDate).getTime();
  return Math.round((due - asOf.getTime()) / MS_PER_DAY);
}

export function slaStatusFor(
  questionnaire: Questionnaire,
  asOf: Date = AS_OF_DATE,
): SlaStatus {
  const days = daysUntilDue(questionnaire, asOf);
  if (days < 0) return "Overdue";
  if (days <= SLA_AT_RISK_DAYS) return "At Risk";
  return "On Track";
}

export interface ScoredQuestion {
  questionnaireId: string;
  customer: string;
  questionId: string;
  prompt: string;
  category: QuestionCategory;
  result: ConfidenceResult;
}

export interface ScoredQuestionnaire {
  questionnaire: Questionnaire;
  sla: SlaStatus;
  daysUntilDue: number;
  scored: ScoredQuestion[];
  statusCounts: Record<AnswerStatus, number>;
}

function emptyStatusCounts(): Record<AnswerStatus, number> {
  return { "Auto-Approved": 0, Suggested: 0, "Needs Review": 0, Escalate: 0 };
}

/** Score every questionnaire + question once, with SLA context attached. */
export function scoreQuestionnaires(
  questionnaires: Questionnaire[],
  controls: Control[],
  asOf: Date = AS_OF_DATE,
): ScoredQuestionnaire[] {
  return questionnaires.map((questionnaire) => {
    const statusCounts = emptyStatusCounts();
    const scored: ScoredQuestion[] = questionnaire.questions.map((question) => {
      const result = computeConfidence(question, controls, asOf);
      statusCounts[result.status] += 1;
      return {
        questionnaireId: questionnaire.id,
        customer: questionnaire.customer,
        questionId: question.id,
        prompt: question.prompt,
        category: question.category,
        result,
      };
    });
    return {
      questionnaire,
      sla: slaStatusFor(questionnaire, asOf),
      daysUntilDue: daysUntilDue(questionnaire, asOf),
      scored,
      statusCounts,
    };
  });
}

export interface PortfolioMetrics {
  totalQuestionnaires: number;
  totalQuestions: number;
  statusCounts: Record<AnswerStatus, number>;
  automationRatePct: number; // Auto-Approved share
  draftReadyPct: number; // Auto-Approved + Suggested share
  hoursSaved: number;
  revenueSupported: number;
  escalations: number; // questions routed to Privacy/Legal (legal/privacy escalations)
  sla: Record<SlaStatus, number>;
  categoryCounts: { category: QuestionCategory; count: number }[];
}

/** Roll the scored questionnaires up into the executive-level metrics. */
export function computePortfolio(
  scoredQuestionnaires: ScoredQuestionnaire[],
): PortfolioMetrics {
  const statusCounts = emptyStatusCounts();
  const sla: Record<SlaStatus, number> = {
    "On Track": 0,
    "At Risk": 0,
    Overdue: 0,
  };
  const categoryMap = new Map<QuestionCategory, number>();

  let totalQuestions = 0;
  let hoursSaved = 0;
  let revenueSupported = 0;
  let escalations = 0;

  for (const sq of scoredQuestionnaires) {
    sla[sq.sla] += 1;
    revenueSupported += sq.questionnaire.dealValueUsd;
    for (const s of sq.scored) {
      totalQuestions += 1;
      statusCounts[s.result.status] += 1;
      hoursSaved += HOURS_SAVED_PER_STATUS[s.result.status];
      if (
        s.result.reviewer === "Privacy / Data Protection" ||
        s.result.reviewer === "Legal"
      ) {
        escalations += 1;
      }
      categoryMap.set(s.category, (categoryMap.get(s.category) ?? 0) + 1);
    }
  }

  const automated = statusCounts["Auto-Approved"];
  const draftReady = statusCounts["Auto-Approved"] + statusCounts.Suggested;

  const categoryCounts = [...categoryMap.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalQuestionnaires: scoredQuestionnaires.length,
    totalQuestions,
    statusCounts,
    automationRatePct: totalQuestions
      ? Math.round((automated / totalQuestions) * 100)
      : 0,
    draftReadyPct: totalQuestions
      ? Math.round((draftReady / totalQuestions) * 100)
      : 0,
    hoursSaved: Math.round(hoursSaved * 10) / 10,
    revenueSupported,
    escalations,
    sla,
    categoryCounts,
  };
}
