# TrustDesk — Highlights

A concise tour of what TrustDesk is, the decisions behind it, and what it demonstrates.
Part of **Fischer Product Lab** — secure AI systems for trust, risk, and enterprise execution.

---

## Overview

TrustDesk is a **customer security questionnaire automation platform**. It ingests the
trust and due-diligence questions enterprises field on every deal, maps each to approved
control evidence, drafts a governed response, scores its confidence with a deterministic
engine, and routes anything sensitive or stale-backed to a human — while giving leadership
SLA, effort-saved, and revenue visibility.

## The problem it solves

Every enterprise deal arrives with a security questionnaire — encryption, access control,
incident response, privacy, AI usage, business continuity. Security, Sales, Legal, and
Privacy answer the same questions over and over, by hand, under deal pressure. Answers
drift, stale evidence slips through, privacy questions get answered without legal sign-off,
and leadership has no view of how much revenue is waiting on the security queue. TrustDesk
turns that ad-hoc email workflow into one governed, measurable, executive-ready system.

## What it does

- **Executive dashboard** — open questionnaires, automation rate, SME hours saved, revenue
  supported, legal/privacy escalations, SLA risk, and the top recurring control categories.
- **Questionnaire workspace** — every in-flight question with its drafted answer, confidence,
  mapped evidence, reviewer, and status; searchable and filterable.
- **Question detail** — the drafted response, the five confidence factors, mapped evidence
  with live freshness, the reviewer routing, and the stated reasons for the verdict.
- **Control & evidence library** — approved response language with framework mappings,
  evidence owners, and freshness (Current / Expiring Soon / Expired), stale items first.
- **Executive brief** — a narrative monthly memo: volume, automation, SLA, effort saved,
  customer concern themes, and the decisions that need a human.

## The confidence engine (the centerpiece)

Confidence is a **pure, deterministic function** — explainable and auditable, not a black box:

1. Five weighted factors (0–4 each) normalized to a 0–100 score — including **Evidence
   Freshness, derived live from the mapped controls** so it can never be faked.
2. Mapped to a band: Auto-Approved / Suggested / Needs Review / Escalate.
3. **Hard governance gates** a high score can never override:
   - Expired or missing evidence caps the answer at Needs Review.
   - Privacy- and AI-governance questions always require human sign-off, routed to Privacy/Legal.
   - A sensitive question on stale evidence is forced to Escalate.

The product thesis in one line: **automation must never outrun the evidence or the
governance behind it.** Verdicts are always computed, never stored, so every status is a
reproducible function of the signals plus live evidence freshness.

## Engineering & security highlights

- **Secure by design:** synthetic data only, read-only (no write/send paths or admin
  surface), zero client-side secrets, and no environment variables required in V1.
- **Documented governance:** a [PRD](./trustdesk-prd.md), a [STRIDE threat model](./threat-model.md),
  and a [security policy](../SECURITY.md).
- **Tested logic:** the engine and every governance gate are covered by `lib/confidence.test.ts`,
  which locks the verdict for all 35 synthetic questions.
- **Hardened supply chain:** Dependabot, secret scanning, CodeQL, pinned dependency
  overrides, and a branch-protected pull-request workflow on `main`.
- **Modern stack:** Next.js 16 (App Router) + React 19, TypeScript in strict mode,
  Tailwind v4, Recharts, Zod, deployed on Vercel with static generation.

## What it demonstrates

Security-to-business translation, product strategy, and risk governance — the ability to
turn a messy, high-stakes enterprise workflow into a governed, measurable, executive-ready
product, with deterministic and explainable decision-making at its core.

## Roadmap

- **V1.1 — controlled interactivity:** richer workspace filters (customer, category,
  reviewer) and a "what-if" confidence inspector that recomputes live.
- **V2 — Hermes layer:** server-side, deterministic-policy-first AI assist for question
  classification, control matching, and answer drafting — bounded, audited, human-in-the-loop.
- **V3 — persistence:** synthetic data backed by Postgres with row-level security.
