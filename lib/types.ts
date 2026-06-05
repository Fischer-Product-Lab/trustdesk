// Core domain types for TrustDesk — customer security questionnaire automation.
// This module is type-only: it produces no runtime output.

/**
 * The category a customer trust/security question falls into. Categories drive
 * control mapping and reviewer routing (some are inherently sensitive).
 */
export type QuestionCategory =
  | "Encryption & Data Protection"
  | "Access Control & Identity"
  | "Incident Response"
  | "Vulnerability Management"
  | "Privacy & Data Retention"
  | "Cloud & Infrastructure Security"
  | "AI & Model Governance"
  | "Business Continuity & Resilience"
  | "Vendor & Third-Party Risk"
  | "Compliance & Certifications";

/** Compliance frameworks an approved control can map to. */
export type Framework =
  | "SOC 2"
  | "ISO 27001"
  | "NIST CSF"
  | "NIST AI RMF"
  | "GDPR"
  | "HIPAA"
  | "PCI DSS"
  | "CSA CAIQ";

/**
 * Where a drafted answer is routed for sign-off. "Auto-Approved" means the
 * deterministic engine cleared it against current, approved evidence with no
 * human required (the demo still records it for audit).
 */
export type Reviewer =
  | "Auto-Approved"
  | "Security Enablement"
  | "Privacy / Data Protection"
  | "Legal"
  | "Security SME";

/**
 * Automation verdict for a single question, produced by the confidence engine.
 * Ordered worst → best is encoded in the engine, not here.
 */
export type AnswerStatus =
  | "Auto-Approved"
  | "Suggested"
  | "Needs Review"
  | "Escalate";

/** Freshness of a control's evidence, derived from its review/expiry dates. */
export type EvidenceStatus = "Current" | "Expiring Soon" | "Expired";

/** SLA posture of a questionnaire, derived from its due date. */
export type SlaStatus = "On Track" | "At Risk" | "Overdue";

/**
 * A reusable, pre-approved control + evidence entry in the library. Approved
 * language is the vetted text TrustDesk drafts customer answers from.
 */
export interface Control {
  id: string; // e.g. "SEC-ENC-001"
  title: string;
  category: QuestionCategory;
  frameworks: Framework[];
  approvedLanguage: string; // vetted response text answers are drafted from
  evidenceOwner: string; // accountable person
  ownerTeam: string;
  lastReviewed: string; // ISO date
  expiresOn: string; // ISO date — drives EvidenceStatus
}

/**
 * Per-question confidence signals, each scored 0–4. These are the *stored*
 * inputs. Evidence freshness is NOT stored here — the engine derives it live
 * from the mapped controls, so a confident answer can never rest on stale
 * evidence by accident.
 */
export interface QuestionSignals {
  controlMatch: number; // 0–4 — how directly approved controls answer the ask
  answerReuse: number; // 0–4 — consistency with prior approved responses
  languageApproved: number; // 0–4 — availability of pre-approved language
  categoryClarity: number; // 0–4 — how standard / bounded the question is
}

/** A single question inside a customer questionnaire. */
export interface Question {
  id: string; // e.g. "q-001"
  prompt: string; // the customer's question, verbatim
  category: QuestionCategory;
  mappedControlIds: string[]; // controls the answer is grounded in
  suggestedAnswer: string; // synthetic drafted response
  signals: QuestionSignals;
}

/**
 * A customer security/trust due-diligence request. One questionnaire bundles
 * many questions and carries the deal context that makes SLA + revenue matter.
 */
export interface Questionnaire {
  id: string; // e.g. "qn-001"
  customer: string;
  industry: string;
  dealValueUsd: number; // revenue supported by clearing this request
  dealStage: string; // e.g. "New Logo", "Renewal", "Expansion"
  receivedDate: string; // ISO date
  dueDate: string; // ISO date — drives SlaStatus
  owner: string; // internal owner driving the response
  questions: Question[];
}
