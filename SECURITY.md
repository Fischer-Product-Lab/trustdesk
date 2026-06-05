# Security Policy

TrustDesk is a **public, read-only portfolio demonstration**. The security posture below is intentional and is part of what the project is meant to demonstrate: mature, secure-by-design judgment rather than a feature-complete production system.

## Data handling

This project uses **synthetic data only**. No production, customer, deal, employer, or personal data is stored in this repository or the demo environment. Every customer, questionnaire, question, drafted answer, control, and evidence date is invented for demonstration.

## Security controls

- **Read-only public demo** — no forms that mutate data, no sending, no approvals, no public write endpoints, no admin surface. (Workspace search/filter is purely client-side display state.)
- **Synthetic data only** — no real customer, deal, employer, or personal data; no PII.
- **No client-side secrets** — no API keys or sensitive values in browser-delivered code.
- **No AI calls in V1** — the confidence score and routing are deterministic (rules and math), which keeps them explainable and auditable.
- **Governance gates** — answers built on expired/missing evidence are capped, and privacy/AI-governance questions always require human sign-off; nothing auto-sends.
- **No file uploads** and **no uncontrolled public AI prompt box.**
- **Environment-variable-based secret management** — should secrets ever be introduced, they are kept server-side and never prefixed `NEXT_PUBLIC_`. V1 requires no environment variables.
- **TypeScript strict mode** and **Zod** available for input validation.
- **Dependency scanning** (Dependabot), **secret scanning**, and **static analysis** (CodeQL) enabled on the repository.
- **Documented threat model** — see [`docs/threat-model.md`](./docs/threat-model.md).

## Reporting a vulnerability

Because this is a synthetic, read-only demo, the security risk surface is minimal. If you do notice a security concern (for example, accidentally committed secrets or a dependency advisory), please open a private security advisory via the repository's **Security** tab, or open an issue describing the concern without including any sensitive details. There is no SLA; this is a personal portfolio project.
