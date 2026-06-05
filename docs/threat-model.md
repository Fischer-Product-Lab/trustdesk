# TrustDesk V1 — Threat Model

A lightweight STRIDE analysis for the TrustDesk V1 demo. The system is a **public, read-only, statically-rendered web application backed entirely by synthetic data**. That posture eliminates most of the attack surface by design; this document records that reasoning explicitly.

## System summary

- **Trust boundary:** the public internet → a static Next.js site (no authenticated users, no roles).
- **Data:** synthetic, compiled into the build. No database, no user input persisted, no PII, no real customer/deal data.
- **Compute:** server components render at build time (SSG); there are no public mutating API routes in V1.
- **Secrets:** none. V1 requires no environment variables and ships no client-side keys.

## STRIDE analysis

| Threat | Example for this system | Likelihood | Mitigation in V1 |
| --- | --- | --- | --- |
| **Spoofing** | An attacker impersonates a user or admin to reach privileged functionality. | Low | No authentication or accounts exist; there is no privileged functionality and no admin surface to reach. |
| **Tampering** | A user modifies a questionnaire, answer, confidence score, or approval state. | Low | The demo is read-only. Data is compiled into the static build; there are no write endpoints, forms, sending actions, or mutations. The lightweight workspace search/filter is purely client-side display state. |
| **Repudiation** | An answer is approved or sent with no record of who did it. | Low | No state-changing actions exist. Reviewer routing and "why this verdict" reasons illustrate the _auditable pattern_ a production system would record. |
| **Information Disclosure** | Sensitive customer, deal, employer, or personal data leaks. | Low | Synthetic data only — there is no sensitive data to disclose. The approved-language and evidence library is invented. No secrets are present in client code. |
| **Denial of Service** | An endpoint is flooded or abused to exhaust resources. | Low | Statically-rendered pages served via CDN; no expensive or unbounded server endpoints, no public AI calls, no file uploads. |
| **Elevation of Privilege** | A user gains access to admin-only or write-capable behavior. | Low | No roles, no admin mode, and no mutating endpoints exist to elevate into. |

## AI / automation-specific risks

TrustDesk's domain (drafting answers about a company's security posture) carries risks beyond generic web threats. V1 addresses them by design:

- **Over-committing on security posture.** A drafted answer could overstate controls. *Mitigation:* answers are drafted only from vetted, approved control language; nothing auto-sends; the confidence score and reviewer routing make the human checkpoint explicit.
- **Answering on stale evidence.** An expired certification or policy could be cited as current. *Mitigation:* evidence freshness is derived live from each control's expiry date and gates the verdict — expired or missing evidence caps the answer at Needs Review (or Escalate).
- **Skipping legal/privacy review.** A confident draft to a privacy or AI-governance question could ship without sign-off. *Mitigation:* sensitive categories always route to Privacy/Legal regardless of score.
- **Unexplainable verdicts.** *Mitigation:* the engine is deterministic; every status traces to its inputs, gates, and stated reasons, and is covered by tests.

## Residual risk & future considerations

As the product evolves beyond V1, these controls become relevant:

- **AI integration (Hermes layer):** any future model calls must run **server-side only**, with bounded inputs, no sensitive-prompt logging, and human review for higher-risk answers. The deterministic engine remains the policy gate in front of any model.
- **Persistence (e.g. Supabase):** enable Row-Level Security and a read-only public policy before any public database access.
- **Authentication:** introduce a role model (reviewer vs. viewer) and branch-protected deploys before exposing any write, approve, or send capability.
- **Supply chain:** Dependabot alerts/updates, secret scanning, and CodeQL static analysis are enabled to manage dependency and code risk over time.
