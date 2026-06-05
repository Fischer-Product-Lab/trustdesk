# TrustDesk — Build Log

A running narrative of how TrustDesk V1 was built, the decisions made, and the notable
fixes along the way. Companion to the [PRD](./trustdesk-prd.md) and [highlights](./highlights.md).

---

## Context

TrustDesk is the second product in **Fischer Product Lab**, built to the same playbook as
[AgentOps](https://github.com/Fischer-Product-Lab/agentops): a polished, read-only,
synthetic-data demo with a deterministic decision engine at its core and security
documented from day one.

## Toolchain & environment

- **OS:** Windows + PowerShell — commands chained with `;`, never `&&`.
- **Package manager:** pnpm. Projects live outside OneDrive (in `C:\Users\t_fis\dev`);
  GitHub is the backup.
- **Stack:** Next.js 16 (App Router, Turbopack) + React 19, TypeScript strict, Tailwind v4
  (`@theme` in `globals.css`, no separate config), Recharts, Zod, Lucide. Mirrors AgentOps
  exact versions for consistency across the suite.
- **Tests:** Node's built-in runner over the TypeScript engine (`node --test lib/confidence.test.ts`),
  relying on Node 22's native type stripping.

## Build order

The product was built **engine-first**, then data, then UI — so the screens render real
computed verdicts rather than hand-entered statuses.

1. **Domain types** (`lib/types.ts`) — questionnaires, questions, controls, signals, statuses.
2. **Confidence engine** (`lib/confidence.ts`) — the centerpiece (see below).
3. **Synthetic data** (`data/controls.ts`, `data/questionnaires.ts`) — 16 controls, 7
   questionnaires, 35 questions, with signals tuned to produce a realistic verdict spread
   and to exercise every governance gate.
4. **Engine tests** (`lib/confidence.test.ts`) — a per-question expectation map + gate edge
   cases; run green before any UI work.
5. **PRD + data review checkpoint** — confirmed direction before building screens.
6. **App shell + design system** — sidebar/topbar/app-shell, Tailwind v4 theme.
7. **Screens** — dashboard, workspace (+ detail), control library, executive brief, about.
8. **Docs + hardening** — threat model, SECURITY.md, README, highlights, GitHub hardening.

## Key architectural decisions

- **Deterministic, explainable engine — no AI in V1.** Confidence is a pure function of five
  weighted factors. Same inputs → same output, every time. This is what makes the verdict
  defensible in an interview and auditable in principle.
- **Evidence freshness is derived, never stored.** The engine computes each control's
  freshness from its expiry date against a fixed reference date (`2026-06-01`) so the demo is
  deterministic and a "confident" answer can never silently rest on expired evidence.
- **Governance gates over averages.** Expired/missing evidence caps the verdict; sensitive
  (privacy / AI) categories always require human sign-off. The thesis: *automation must never
  outrun the evidence or the governance behind it.*
- **Computed, never stored verdicts.** Pages compute confidence at render time; nothing is
  persisted, so every status traces back to its inputs.
- **SSG-first.** All routes are statically generated (including the 7 questionnaire detail
  pages via `generateStaticParams`); client components are limited to charts and the
  workspace table.
- **Shared metrics module.** `lib/metrics.ts` scores the portfolio once so the dashboard and
  the executive brief always agree on automation rate, hours saved, escalations, and SLA.

## Notable fixes

- **Recharts during static generation.** Chart components gate rendering behind a client
  mount flag (returning a fixed-height placeholder during SSG so there's layout to measure).
  The mount flag is set inside a `requestAnimationFrame` callback to satisfy the React
  `set-state-in-effect` lint rule rather than calling `setState` synchronously in the effect.
- **Type-only imports keep tests runnable.** Data files import their types with `import type`,
  which Node's type stripper removes — so `node --test` runs the engine against the data
  without a path-alias resolver.

## Verification

- `pnpm test` — 10 tests, all passing (35-question verdict map + gate edge cases).
- `pnpm lint` — clean.
- `pnpm build` — 14 routes, all static/SSG.

## GitHub hardening

Mirrors AgentOps: Dependabot (npm + github-actions), secret scanning, CodeQL static
analysis, and branch protection on `main` with a PR-based workflow (squash-merge), even
solo. Public docs are kept professional; personal pitch material (demo script, resume
bullets, positioning) lives in a git-ignored `notes/` folder.
