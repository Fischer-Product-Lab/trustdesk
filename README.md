# TrustDesk

**Customer security questionnaire automation — classify, map to evidence, draft, and govern.**

**▶ Live demo: [trustdesk-two.vercel.app](https://trustdesk-two.vercel.app/)** · **Highlights & decisions: [docs/highlights.md](./docs/highlights.md)**

Every enterprise deal arrives with a security questionnaire — encryption, access control, incident response, privacy, AI usage — and Security, Sales, Legal, and Privacy answer the same questions over and over, by hand, under deal pressure. TrustDesk ingests each question, maps it to approved control evidence, drafts a response, scores its confidence, and routes anything sensitive or stale-backed to a human — with SLA, effort-saved, and revenue visibility for leadership.

> Part of **Fischer Product Lab** — secure AI systems for trust, risk, and enterprise execution.

---

## Security & data posture (read this first)

This is a **public, read-only demonstration** built entirely on **synthetic data**.

- **Synthetic data only.** Every customer, questionnaire, question, drafted answer, control, and evidence date is invented. No real customer, deal, employer, or personal data is present anywhere in this repository or the deployed demo.
- **Read-only.** There are no forms that mutate data, no sending, no approvals, no public write endpoints, and no admin surface. The demo only displays.
- **No AI calls.** The confidence score and reviewer routing are **deterministic** — plain rules and math — which is what makes them explainable and auditable.
- **No secrets in the browser.** No API keys or sensitive values exist in client-side code; V1 requires no environment variables at all.

See [`SECURITY.md`](./SECURITY.md) for the full posture and [`docs/threat-model.md`](./docs/threat-model.md) for the STRIDE analysis.

---

## What's inside

Five screens:

| Route | Screen | Purpose |
| --- | --- | --- |
| `/` | **Executive Dashboard** | Open questionnaires, automation rate, hours saved, revenue supported, legal/privacy escalations, SLA risk, and top control categories. |
| `/questionnaires` | **Questionnaire Workspace** | Every in-flight question with confidence, status, mapped evidence, and reviewer — searchable and filterable. |
| `/questionnaires/[id]` | **Questionnaire Detail** | One customer's request in full: each drafted answer, its five confidence factors, mapped evidence with live freshness, routing, and reasons. |
| `/controls` | **Control & Evidence Library** | Approved response language with framework mappings, owners, and freshness — stale evidence surfaced first. |
| `/brief` | **Executive Brief** | A narrative monthly memo of volume, automation, SLA, effort saved, concern themes, and decisions needed. |

### The confidence engine (the centerpiece)

`lib/confidence.ts` is a pure, deterministic function. Given a question's signals and its mapped controls, it:

1. Computes a **weighted confidence score** (0–100) from five factors — including **Evidence Freshness, derived live** from the mapped controls' expiry dates so it can't be faked.
2. Maps it to a **band** (85+ Auto-Approved, 65–84 Suggested, 45–64 Needs Review, &lt;45 Escalate).
3. Applies **hard governance gates** — a high score can _never_ override them:
   - Expired **or** missing evidence caps the verdict at **Needs Review**.
   - Privacy- or AI-governance questions always require human sign-off (routed to Privacy/Legal).
   - A sensitive question on stale/missing evidence is forced to **Escalate**.

Verdicts are always _computed_, never stored, so every status is a reproducible, auditable function. The logic and every gate are covered by tests in `lib/confidence.test.ts`.

---

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/) in **strict** mode
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Recharts](https://recharts.org/) for data visuals
- [Zod](https://zod.dev/) for schema validation
- [Lucide](https://lucide.dev/) icons
- Node's built-in test runner (`node --test`)

---

## Getting started

**Prerequisites:** [Node.js](https://nodejs.org/) LTS and [pnpm](https://pnpm.io/).

```bash
# Install dependencies
pnpm install

# Run the dev server (http://localhost:3000)
pnpm dev

# Type-check + production build
pnpm build

# Run the confidence engine tests
pnpm test
```

---

## Project structure

```
trustdesk/
├── app/
│   ├── page.tsx                     # Executive dashboard (/)
│   ├── questionnaires/
│   │   ├── page.tsx                 # Questionnaire workspace
│   │   └── [id]/page.tsx            # Questionnaire detail
│   ├── controls/page.tsx            # Control & evidence library
│   ├── brief/page.tsx               # Executive brief
│   ├── about/page.tsx               # About this demo
│   ├── layout.tsx                   # Root layout + app shell
│   └── globals.css                  # Design system (Tailwind v4 theme)
├── components/
│   ├── layout/                      # Sidebar, top bar, app shell
│   ├── dashboard/                   # Status donut, category bar
│   ├── question/                    # Confidence ring, factor breakdown
│   ├── questionnaire/               # Workspace table
│   ├── status-badge.tsx             # Answer-status badge + status colors
│   ├── evidence-badge.tsx           # Evidence freshness badge
│   └── sla-badge.tsx                # SLA posture badge
├── data/
│   ├── controls.ts                  # 16 synthetic controls (typed)
│   └── questionnaires.ts            # 7 questionnaires / 35 questions (typed)
├── lib/
│   ├── types.ts                     # Domain types
│   ├── confidence.ts                # Deterministic confidence + routing engine
│   ├── confidence.test.ts           # Tests for the engine + governance gates
│   └── metrics.ts                   # SLA + portfolio aggregation
└── docs/
    ├── trustdesk-prd.md             # Product requirements
    ├── highlights.md                # Project highlights
    ├── threat-model.md              # STRIDE analysis
    └── BUILD_LOG.md                 # Build narrative & key decisions
```

---

## License

This project is a portfolio demonstration. © Trevor Fischer / Fischer Product Lab.
