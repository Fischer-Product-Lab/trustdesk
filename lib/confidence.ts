import type {
  AnswerStatus,
  Control,
  EvidenceStatus,
  Question,
  Reviewer,
} from "./types.ts";

/**
 * Fixed "as of" date for the demo so every verdict is deterministic and
 * reproducible — evidence freshness and SLA posture never drift with the
 * wall clock. Pass an explicit date to override (used in tests).
 */
export const AS_OF_DATE = new Date("2026-06-01T00:00:00Z");

/** Evidence within this window of expiry is flagged "Expiring Soon". */
const EXPIRING_SOON_DAYS = 60;

/**
 * Categories that carry legal/privacy exposure regardless of how confident the
 * draft is. The product thesis: a confident answer to a privacy or AI question
 * is still a privacy or AI question — it gets human sign-off.
 */
const SENSITIVE_CATEGORIES: ReadonlyArray<Question["category"]> = [
  "Privacy & Data Retention",
  "AI & Model Governance",
];

export interface ConfidenceResult {
  score: number; // 0–100
  bandStatus: AnswerStatus; // verdict from the score alone, before gates
  status: AnswerStatus; // verdict after gates — this is the one you display
  reviewer: Reviewer; // where the answer routes for sign-off
  evidence: EvidenceStatus | "No Evidence"; // worst freshness across mapped controls
  reasons: string[]; // human-readable explanation of the verdict
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** Freshness of a single control relative to the reference date. */
export function evidenceStatusFor(
  control: Control,
  asOf: Date = AS_OF_DATE,
): EvidenceStatus {
  const expiry = new Date(control.expiresOn).getTime();
  const daysToExpiry = (expiry - asOf.getTime()) / MS_PER_DAY;
  if (daysToExpiry < 0) return "Expired";
  if (daysToExpiry <= EXPIRING_SOON_DAYS) return "Expiring Soon";
  return "Current";
}

/** Resolve a question's mapped control IDs to full Control records. */
export function controlsForQuestion(
  question: Question,
  controls: Control[],
): Control[] {
  return question.mappedControlIds
    .map((id) => controls.find((c) => c.id === id))
    .filter((c): c is Control => Boolean(c));
}

/** Worst-case freshness across a question's mapped controls. */
function worstEvidence(
  mapped: Control[],
  asOf: Date,
): EvidenceStatus | "No Evidence" {
  if (mapped.length === 0) return "No Evidence";
  const statuses = mapped.map((c) => evidenceStatusFor(c, asOf));
  if (statuses.includes("Expired")) return "Expired";
  if (statuses.includes("Expiring Soon")) return "Expiring Soon";
  return "Current";
}

/** Map an evidence freshness verdict to a 0–4 confidence factor value. */
function freshnessValue(evidence: EvidenceStatus | "No Evidence"): number {
  switch (evidence) {
    case "Current":
      return 4;
    case "Expiring Soon":
      return 2;
    case "Expired":
    case "No Evidence":
      return 0;
  }
}

/**
 * The confidence factors — the single source of truth for labels, weights, and
 * how each factor's 0–4 value is obtained. Four factors are stored signals;
 * "Evidence Freshness" is *derived* live from the mapped controls so it can
 * never be faked. Weights sum to 8, so the maximum raw score is 8 × 4 = 32.
 */
export const CONFIDENCE_FACTORS: {
  key: string;
  label: string;
  weight: number;
  description: string;
  valueFor: (q: Question, mapped: Control[], asOf: Date) => number;
}[] = [
  {
    key: "controlMatch",
    label: "Control Match",
    weight: 2.0,
    description: "How directly approved controls answer the question.",
    valueFor: (q) => q.signals.controlMatch,
  },
  {
    key: "evidenceFreshness",
    label: "Evidence Freshness",
    weight: 2.0,
    description: "Currency of the mapped evidence (derived from review dates).",
    valueFor: (_q, mapped, asOf) => freshnessValue(worstEvidence(mapped, asOf)),
  },
  {
    key: "languageApproved",
    label: "Approved Language",
    weight: 1.5,
    description: "Availability of vetted, pre-approved response language.",
    valueFor: (q) => q.signals.languageApproved,
  },
  {
    key: "answerReuse",
    label: "Answer Reuse",
    weight: 1.5,
    description: "Consistency with prior approved responses to the same ask.",
    valueFor: (q) => q.signals.answerReuse,
  },
  {
    key: "categoryClarity",
    label: "Category Clarity",
    weight: 1.0,
    description: "How standard and well-bounded the question is.",
    valueFor: (q) => q.signals.categoryClarity,
  },
];

export const MAX_RAW_SCORE = CONFIDENCE_FACTORS.reduce(
  (sum, f) => sum + f.weight * 4,
  0,
); // = 32

// Ordered worst → best so statuses can be compared and capped.
const STATUS_ORDER: AnswerStatus[] = [
  "Escalate",
  "Needs Review",
  "Suggested",
  "Auto-Approved",
];

function rank(status: AnswerStatus): number {
  return STATUS_ORDER.indexOf(status);
}

/** Step 2 — map a 0–100 confidence score to a band. */
function bandForScore(score: number): AnswerStatus {
  if (score >= 85) return "Auto-Approved";
  if (score >= 65) return "Suggested";
  if (score >= 45) return "Needs Review";
  return "Escalate";
}

/** Route a question to the right reviewer given its verdict and category. */
function reviewerFor(
  status: AnswerStatus,
  category: Question["category"],
): Reviewer {
  if (status === "Auto-Approved") return "Auto-Approved";
  if (category === "Privacy & Data Retention") return "Privacy / Data Protection";
  if (category === "AI & Model Governance" || category === "Compliance & Certifications") {
    return "Legal";
  }
  if (status === "Suggested") return "Security Enablement";
  return "Security SME";
}

/**
 * Deterministic answer-confidence calculation. Same inputs always produce the
 * same output — no AI involved. This is the centerpiece of TrustDesk.
 *
 * Step 1: weighted confidence score (normalized to 0–100), where evidence
 *         freshness is derived live from the mapped controls.
 * Step 2: band the score into an automation verdict.
 * Step 3: hard governance gates a high score can never override:
 *         - expired or missing evidence caps the verdict at Needs Review;
 *         - sensitive (privacy / AI) categories always require human sign-off;
 *         - expired/missing evidence on a sensitive category forces Escalate.
 * Step 4: route to the appropriate reviewer.
 */
export function computeConfidence(
  question: Question,
  controls: Control[],
  asOf: Date = AS_OF_DATE,
): ConfidenceResult {
  const mapped = controlsForQuestion(question, controls);
  const evidence = worstEvidence(mapped, asOf);

  // Step 1 — weighted, normalized score.
  const raw = CONFIDENCE_FACTORS.reduce(
    (sum, f) => sum + f.valueFor(question, mapped, asOf) * f.weight,
    0,
  );
  // Multiply before dividing so a true .5 rounds up consistently and we avoid
  // float artifacts like 84.4999 → 84.
  const score = Math.round((raw * 100) / MAX_RAW_SCORE);

  // Step 2 — band.
  const bandStatus = bandForScore(score);

  // Step 3 — hard governance gates.
  const evidenceStale = evidence === "Expired" || evidence === "No Evidence";
  const sensitive = SENSITIVE_CATEGORIES.includes(question.category);

  let status = bandStatus;
  const reasons: string[] = [];

  if (evidenceStale && sensitive) {
    if (rank(status) > rank("Escalate")) {
      status = "Escalate";
      reasons.push(
        `Escalated: a sensitive ${question.category} question is grounded in ${evidence === "No Evidence" ? "no mapped" : "expired"} evidence — it cannot be answered from the library as-is.`,
      );
    }
  } else if (evidenceStale) {
    if (rank(status) > rank("Needs Review")) {
      status = "Needs Review";
      reasons.push(
        `Capped at Needs Review: mapped evidence is ${evidence === "No Evidence" ? "missing" : "expired"}, overriding a numeric score of ${score}. A confident answer on stale evidence is still a stale answer.`,
      );
    }
  } else if (sensitive) {
    if (rank(status) > rank("Needs Review")) {
      status = "Needs Review";
      reasons.push(
        `Capped at Needs Review: ${question.category} carries legal/privacy exposure and always requires human sign-off, regardless of the ${score} confidence score.`,
      );
    }
  }

  // Contextual reasons — surface the most heavily-weighted weak factors (≤ 2)
  // so a reviewer can see *why* an answer fell short of auto-approval.
  const weakFactors = CONFIDENCE_FACTORS.map((f) => ({
    factor: f,
    value: f.valueFor(question, mapped, asOf),
  }))
    .filter((x) => x.value <= 2)
    .sort((a, b) => b.factor.weight - a.factor.weight)
    .slice(0, 3);

  for (const { factor, value } of weakFactors) {
    // Avoid duplicating an evidence reason already covered by a gate.
    if (factor.key === "evidenceFreshness" && evidenceStale) continue;
    reasons.push(
      `${factor.label} is ${value <= 1 ? "critically low" : "below target"} (${value}/4).`,
    );
  }

  if (reasons.length === 0) {
    reasons.push(
      status === "Auto-Approved"
        ? "Strong control match on current, approved evidence with no sensitivity flags — cleared to auto-approve."
        : `Confidence score of ${score}/100 lands in the ${status} band — a solid draft that benefits from a light review before sending.`,
    );
  }

  const reviewer = reviewerFor(status, question.category);

  return { score, bandStatus, status, reviewer, evidence, reasons };
}
