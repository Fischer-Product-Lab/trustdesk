import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computeConfidence,
  evidenceStatusFor,
  AS_OF_DATE,
} from "./confidence.ts";
import { controls } from "../data/controls.ts";
import { questionnaires, allQuestions } from "../data/questionnaires.ts";
import type { Control, Question } from "./types.ts";

/**
 * Expected automation status for each of the synthetic questions.
 *
 * Every status is *computed* by the deterministic engine — never stored. This
 * map locks in the intended verdicts so a change to the engine or the synthetic
 * signals can't silently shift the demo's behavior.
 */
const EXPECTED: Record<string, string> = {
  "q-001": "Auto-Approved",
  "q-002": "Suggested",
  "q-003": "Auto-Approved",
  "q-004": "Needs Review", // strong score, but mapped evidence is expired → capped
  "q-005": "Auto-Approved",
  "q-006": "Auto-Approved",
  "q-007": "Suggested",
  "q-008": "Needs Review", // privacy category always needs human sign-off
  "q-009": "Escalate", // privacy + expired evidence → escalate
  "q-010": "Auto-Approved",
  "q-011": "Auto-Approved",
  "q-012": "Needs Review", // expired patch evidence caps an otherwise-Suggested draft
  "q-013": "Auto-Approved",
  "q-014": "Needs Review", // AI category → human sign-off
  "q-015": "Auto-Approved",
  "q-016": "Suggested",
  "q-017": "Auto-Approved",
  "q-018": "Auto-Approved",
  "q-019": "Suggested",
  "q-020": "Needs Review", // expired evidence cap
  "q-021": "Needs Review", // privacy cap
  "q-022": "Auto-Approved",
  "q-023": "Auto-Approved",
  "q-024": "Auto-Approved",
  "q-025": "Suggested",
  "q-026": "Auto-Approved",
  "q-027": "Needs Review", // AI cap
  "q-028": "Needs Review", // AI cap (lands in band already)
  "q-029": "Needs Review", // privacy cap
  "q-030": "Escalate", // privacy + expired evidence
  "q-031": "Auto-Approved",
  "q-032": "Auto-Approved",
  "q-033": "Auto-Approved",
  "q-034": "Auto-Approved",
  "q-035": "Suggested",
};

test("the portfolio contains 7 questionnaires and 35 questions", () => {
  assert.equal(questionnaires.length, 7);
  assert.equal(allQuestions().length, 35);
});

test("every question id is unique", () => {
  const ids = allQuestions().map(({ question }) => question.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("every mapped control id resolves to a real control", () => {
  for (const { question } of allQuestions()) {
    for (const id of question.mappedControlIds) {
      assert.ok(
        controls.some((c) => c.id === id),
        `${question.id} references unknown control ${id}`,
      );
    }
  }
});

test("each question resolves to its expected automation status", () => {
  for (const { question } of allQuestions()) {
    const expected = EXPECTED[question.id];
    assert.ok(expected, `no expectation defined for ${question.id}`);
    const result = computeConfidence(question, controls);
    assert.equal(
      result.status,
      expected,
      `${question.id} ("${question.prompt}") status`,
    );
  }
});

test("evidence freshness is computed from dates against the reference date", () => {
  const expired = controls.find((c) => c.id === "SEC-VM-031")!;
  const expiringSoon = controls.find((c) => c.id === "SEC-KMS-004")!;
  const current = controls.find((c) => c.id === "SEC-ENC-001")!;
  assert.equal(evidenceStatusFor(expired), "Expired");
  assert.equal(evidenceStatusFor(expiringSoon), "Expiring Soon");
  assert.equal(evidenceStatusFor(current), "Current");
});

// --- Gate edge cases (synthetic fixtures, independent of the demo data) ---

const currentControl: Control = {
  id: "TST-CUR-001",
  title: "Current evidence",
  category: "Encryption & Data Protection",
  frameworks: ["SOC 2"],
  approvedLanguage: "Synthetic.",
  evidenceOwner: "Test Owner",
  ownerTeam: "Test",
  lastReviewed: "2026-01-01",
  expiresOn: "2030-01-01",
};

const expiredControl: Control = {
  ...currentControl,
  id: "TST-EXP-001",
  expiresOn: "2020-01-01",
};

function makeQuestion(over: Partial<Question>): Question {
  return {
    id: "q-test",
    prompt: "Synthetic test question.",
    category: "Encryption & Data Protection",
    mappedControlIds: ["TST-CUR-001"],
    suggestedAnswer: "Synthetic.",
    signals: { controlMatch: 4, answerReuse: 4, languageApproved: 4, categoryClarity: 4 },
    ...over,
  };
}

test("a perfect, fresh, non-sensitive answer auto-approves", () => {
  const q = makeQuestion({});
  const result = computeConfidence(q, [currentControl], AS_OF_DATE);
  assert.equal(result.score, 100);
  assert.equal(result.status, "Auto-Approved");
  assert.equal(result.reviewer, "Auto-Approved");
});

test("expired evidence caps an otherwise auto-approvable answer at Needs Review", () => {
  const q = makeQuestion({ mappedControlIds: ["TST-EXP-001"] });
  const result = computeConfidence(q, [expiredControl], AS_OF_DATE);
  assert.equal(result.bandStatus, "Suggested"); // freshness 0 drops it from auto, score still high
  assert.equal(result.status, "Needs Review"); // gate caps it
});

test("a sensitive category always requires human sign-off, even at 100", () => {
  const q = makeQuestion({
    category: "Privacy & Data Retention",
    mappedControlIds: ["TST-CUR-001"],
  });
  const result = computeConfidence(q, [currentControl], AS_OF_DATE);
  assert.equal(result.status, "Needs Review");
  assert.equal(result.reviewer, "Privacy / Data Protection");
});

test("a sensitive category on expired evidence escalates", () => {
  const q = makeQuestion({
    category: "AI & Model Governance",
    mappedControlIds: ["TST-EXP-001"],
  });
  const result = computeConfidence(q, [expiredControl], AS_OF_DATE);
  assert.equal(result.status, "Escalate");
  assert.equal(result.reviewer, "Legal");
});

test("missing evidence escalates a sensitive question and caps a normal one", () => {
  const sensitive = computeConfidence(
    makeQuestion({ category: "Privacy & Data Retention", mappedControlIds: [] }),
    [],
    AS_OF_DATE,
  );
  assert.equal(sensitive.status, "Escalate");

  const normal = computeConfidence(
    makeQuestion({ mappedControlIds: [] }),
    [],
    AS_OF_DATE,
  );
  assert.equal(normal.status, "Needs Review");
});
