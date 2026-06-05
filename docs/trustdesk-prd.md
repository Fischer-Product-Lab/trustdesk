# TrustDesk — Product Requirements Document (V1)

**Product:** TrustDesk — customer security questionnaire automation
**Author:** Trevor Fischer · Fischer Product Lab
**Status:** V1 shipped (read-only, synthetic demo) · [Live](https://trustdesk-two.vercel.app/)
**Last updated:** 2026-06

---

## 1. Problem

Every enterprise deal of any size now comes with a security questionnaire — encryption,
access control, incident response, privacy, AI usage, business continuity. Security,
Sales, Legal, and Privacy answer the **same questions over and over**, by hand, under deal
pressure. The result is a predictable tax on revenue:

- Deals stall while a security SME re-writes answers that already exist somewhere.
- Answers drift — different reps send different language for the same control.
- **Stale evidence slips through:** an answer cites a certification or policy that expired.
- Privacy- and AI-sensitive questions get answered without the legal sign-off they need.
- Leadership has no view of how much revenue is waiting on the security queue, or where.

The core failure is that **customer trust is run as ad-hoc email, not as a governed,
measurable workflow.** TrustDesk turns it into one.

## 2. Users

| User | What they need from TrustDesk |
| --- | --- |
| **Security Enablement / TPRM** | Reuse approved answers at scale without re-litigating every control; a queue, not an inbox. |
| **Security SME** | Only see the questions that genuinely need expertise — not the 18th encryption question this month. |
| **Legal / Privacy** | A guarantee that privacy- and AI-sensitive answers are routed for sign-off, every time. |
| **Sales / Deal owner** | Visibility into which deals are blocked on security and when they'll clear. |
| **CISO / executives** | One view of volume, automation rate, SLA risk, effort saved, and revenue supported. |

## 3. Goals

- Ingest customer questions, classify them, and **map each to approved control evidence.**
- Draft a response from vetted language and assign a **deterministic, explainable** confidence score.
- **Gate** the workflow so answers built on expired evidence or carrying legal/privacy
  exposure can never auto-send — regardless of how confident the draft is.
- Route every answer to the right reviewer (auto-approve, enablement, SME, privacy, legal).
- Give leadership SLA, effort-saved, and revenue-supported visibility at a glance.
- Demonstrate mature security posture: synthetic data, read-only, documented threat model.

## 4. Non-goals (V1)

- No live AI/model calls (confidence is pure rules + math — by design).
- No write actions, sending, approvals, or admin surface — the demo only displays.
- No authentication, multi-tenancy, file uploads, or real data integrations.
- No real customer, employer, deal, or personal data anywhere.

## 5. User stories

- *As a Security Enablement lead,* I can open one workspace and see every in-flight question
  with its drafted answer, confidence, mapped controls, and where it routes — so I work a
  queue instead of an inbox.
- *As a Security SME,* I only get pulled in on the questions the engine flags, with the
  **reasons** stated, so the ask is defensible and bounded.
- *As Legal/Privacy,* I can trust that any privacy- or AI-governance question is routed to
  me automatically, even when the draft scores 100.
- *As a CISO,* I can open the dashboard and answer "how much revenue is waiting on security,
  how much are we automating, and what's at SLA risk?" in under a minute.
- *As anyone,* I can open the evidence library and see exactly which controls are current,
  expiring, or expired — because stale evidence is a live risk, not a footnote.

## 6. Functional requirements

1. **Executive Dashboard (`/`)** — open questionnaires, questions in flight, automation
   rate, SLA risk, SME hours saved, revenue supported, legal/privacy escalations, and the
   top recurring control categories.
2. **Questionnaire Workspace (`/questionnaires`, `/questionnaires/[id]`)** — every question
   with customer, category, suggested answer, confidence score, mapped controls, required
   reviewer, and status. Risk-elevated rows (expired evidence, escalations) are flagged.
3. **Control & Evidence Library (`/controls`)** — control ID, framework mappings, approved
   response language, evidence owner, last-reviewed date, expiration date, and a computed
   freshness flag (Current / Expiring Soon / Expired).
4. **Executive Brief (`/brief`)** — a narrative monthly summary: volume processed,
   automation rate, SLA posture, SME effort saved, recurring customer concern themes, and
   the decisions that need a human.
5. **Confidence engine (`lib/confidence.ts`)** — pure function: weighted score → band →
   hard governance gates → reviewer routing → human-readable reasons. Verdicts are
   **computed, never stored.**

## 7. The confidence engine (the centerpiece)

Each question is scored 0–100 from five weighted factors, four stored and one **derived
live from the mapped evidence** so it can never be faked:

`Control Match (2.0) · Evidence Freshness (2.0, derived) · Approved Language (1.5) · Answer Reuse (1.5) · Category Clarity (1.0)`

- **Bands:** 85+ Auto-Approved · 65–84 Suggested · 45–64 Needs Review · <45 Escalate.
- **Hard governance gates (cannot be averaged away):**
  - **Expired or missing evidence** → capped at **Needs Review**. *A confident answer on
    stale evidence is still a stale answer.*
  - **Sensitive category** (Privacy & Data Retention, AI & Model Governance) → always at
    least **Needs Review**, routed to Privacy/Legal. *A confident answer to a privacy
    question is still a privacy question.*
  - **Sensitive category on expired/missing evidence** → forced to **Escalate.**
- **Routing:** Auto-Approved (no human) · Security Enablement · Security SME ·
  Privacy / Data Protection · Legal.

This is the product thesis: **automation must never outrun the evidence or the governance
behind it.** The gates encode that judgment so the score can't be gamed by a high average.
The logic is covered by tests in `lib/confidence.test.ts`.

## 8. Risk requirements (security by design)

| Risk | Control |
| --- | --- |
| Sensitive customer/security data exposure | Synthetic data only; no real data in repo or demo. |
| Unauthorized mutation | Read-only; no send, write endpoints, forms, or admin surface. |
| Over-committing on security posture | Deterministic confidence + reviewer routing; no answer auto-sends. |
| Answering on stale evidence | Evidence freshness derived live; expired evidence gates the verdict. |
| Skipping legal/privacy review | Sensitive categories always routed to a human, regardless of score. |
| Unexplainable verdicts | Every status traces to its inputs, gates, and stated reasons. |
| Secret leakage | No client-side secrets; zero env vars required in V1. |
| Supply-chain risk | Dependabot, Secret Scanning, CodeQL, pinned dependency overrides. |

A full STRIDE threat model (`docs/threat-model.md`) and security policy (`SECURITY.md`)
ship with the repository.

## 9. Success metrics

- **Product (demonstrated in-app):** automation rate (% Auto-Approved / draft-ready),
  questions cleared, SME hours saved, revenue supported, # legal/privacy escalations, SLA
  posture (on track / at risk / overdue).
- **Portfolio (for the job search):** a recruiter grasps the value in <60s on the
  dashboard; the confidence logic and its safety gates survive a "how does this score, and
  why can't a high score auto-send a privacy answer?" interview question.

*Current synthetic dataset:* 7 questionnaires · 35 questions · ~$4.98M revenue supported ·
51% auto-approved, 69% draft-ready · 8 legal/privacy escalations · 1 overdue, 2 at-risk.

## 10. Launch plan

- **V1 (done):** read-only synthetic demo on Vercel ([live](https://trustdesk-two.vercel.app/)),
  auto-deploy from `main`, hardened repo (Dependabot, secret scanning, CodeQL, branch
  protection + PR workflow).

## 11. Roadmap

- **V1.1 — controlled interactivity:** filter/search the workspace by customer, category,
  status, and reviewer; a "what-if" confidence inspector that recomputes live (no persistence).
- **V2 — Hermes layer:** server-side, deterministic-policy-first AI assist for question
  classification, control matching, and answer drafting — bounded inputs, no sensitive-prompt
  logging, fully audited, human-in-the-loop.
- **V3 — persistence:** move synthetic data to Supabase with RLS and read-only policies.
