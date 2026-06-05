import type { Questionnaire } from "@/lib/types";

/**
 * Synthetic customer questionnaires for TrustDesk V1.
 *
 * SYNTHETIC DATA ONLY — every customer, deal value, owner, question, and
 * drafted answer below is invented for demonstration. No real customer,
 * employer, or deal data is present.
 *
 * Per-question confidence signals are fixed inputs. Each answer's confidence
 * score, automation status (Auto-Approved / Suggested / Needs Review /
 * Escalate), and reviewer routing are *computed* by lib/confidence.ts — never
 * stored — so every verdict is a pure, auditable function of the signals plus
 * the live freshness of the mapped evidence.
 *
 * Dates are set relative to the engine's reference date (2026-06-01) to produce
 * a realistic mix of SLA postures and to exercise the governance gates.
 */
export const questionnaires: Questionnaire[] = [
  {
    id: "qn-001",
    customer: "Northwind Capital",
    industry: "Financial Services",
    dealValueUsd: 480000,
    dealStage: "Renewal",
    receivedDate: "2026-05-19",
    dueDate: "2026-06-08", // At Risk
    owner: "Security Enablement",
    questions: [
      {
        id: "q-001",
        prompt: "Describe how customer data is encrypted at rest and in transit.",
        category: "Encryption & Data Protection",
        mappedControlIds: ["SEC-ENC-001", "SEC-ENC-002"],
        suggestedAnswer:
          "Customer data is encrypted at rest using AES-256 across all production data stores and backups, and in transit using TLS 1.2 or higher with legacy protocols disabled.",
        signals: { controlMatch: 4, answerReuse: 4, languageApproved: 4, categoryClarity: 4 },
      },
      {
        id: "q-002",
        prompt: "How are encryption keys managed and rotated?",
        category: "Encryption & Data Protection",
        mappedControlIds: ["SEC-KMS-004"],
        suggestedAnswer:
          "Keys are managed in a dedicated, hardware-backed KMS, rotated at least annually and on personnel change, with access restricted by least privilege.",
        signals: { controlMatch: 4, answerReuse: 3, languageApproved: 4, categoryClarity: 4 },
      },
      {
        id: "q-003",
        prompt: "Is multi-factor authentication enforced for administrative access?",
        category: "Access Control & Identity",
        mappedControlIds: ["SEC-IAM-011"],
        suggestedAnswer:
          "Yes. MFA is enforced for all employee and administrative access, with phishing-resistant factors required for privileged roles via federated SSO.",
        signals: { controlMatch: 4, answerReuse: 4, languageApproved: 4, categoryClarity: 4 },
      },
      {
        id: "q-004",
        prompt: "What is your patch management SLA for critical vulnerabilities?",
        category: "Vulnerability Management",
        mappedControlIds: ["SEC-VM-031"],
        suggestedAnswer:
          "Security patches are prioritized by severity; critical vulnerabilities are remediated within defined SLA windows and tracked to closure.",
        signals: { controlMatch: 4, answerReuse: 4, languageApproved: 4, categoryClarity: 4 },
      },
      {
        id: "q-005",
        prompt: "Do you maintain a SOC 2 Type II report and ISO 27001 certification?",
        category: "Compliance & Certifications",
        mappedControlIds: ["CMP-CERT-090"],
        suggestedAnswer:
          "Yes. We maintain a SOC 2 Type II report and ISO/IEC 27001 certification, available to customers under NDA through the trust portal.",
        signals: { controlMatch: 4, answerReuse: 4, languageApproved: 4, categoryClarity: 4 },
      },
    ],
  },
  {
    id: "qn-002",
    customer: "Meridian Health",
    industry: "Healthcare",
    dealValueUsd: 1200000,
    dealStage: "New Logo",
    receivedDate: "2026-05-26",
    dueDate: "2026-06-30", // On Track
    owner: "Security Enablement",
    questions: [
      {
        id: "q-006",
        prompt: "How is PHI encrypted at rest and how is access to it controlled?",
        category: "Encryption & Data Protection",
        mappedControlIds: ["SEC-ENC-001", "SEC-IAM-010"],
        suggestedAnswer:
          "Sensitive data is encrypted at rest with AES-256, and access follows role-based access control and least privilege with quarterly reviews.",
        signals: { controlMatch: 4, answerReuse: 4, languageApproved: 4, categoryClarity: 3 },
      },
      {
        id: "q-007",
        prompt: "Describe your incident response and breach notification process.",
        category: "Incident Response",
        mappedControlIds: ["SEC-IR-020", "SEC-IR-021"],
        suggestedAnswer:
          "A documented IR plan defines severity tiers and escalation, tested annually. Customers are notified of confirmed breaches without undue delay per the agreement and regulation.",
        signals: { controlMatch: 4, answerReuse: 3, languageApproved: 4, categoryClarity: 4 },
      },
      {
        id: "q-008",
        prompt: "What is your data retention and deletion policy upon contract termination?",
        category: "Privacy & Data Retention",
        mappedControlIds: ["PRIV-DR-040"],
        suggestedAnswer:
          "Customer data is retained only as long as necessary; on termination it is deleted or returned within the period defined in the data processing agreement.",
        signals: { controlMatch: 4, answerReuse: 4, languageApproved: 4, categoryClarity: 4 },
      },
      {
        id: "q-009",
        prompt: "Are subprocessors disclosed and bound by data protection agreements?",
        category: "Privacy & Data Retention",
        mappedControlIds: ["PRIV-PII-041"],
        suggestedAnswer:
          "A current subprocessor list is maintained and published; subprocessors are bound by data protection agreements and customers are notified of material changes.",
        signals: { controlMatch: 3, answerReuse: 3, languageApproved: 3, categoryClarity: 3 },
      },
      {
        id: "q-010",
        prompt: "Is business continuity and disaster recovery tested regularly?",
        category: "Business Continuity & Resilience",
        mappedControlIds: ["BC-DR-070"],
        suggestedAnswer:
          "Yes. BC/DR plans define RTO and RPO targets, are tested at least annually, and rely on geographically redundant infrastructure with validated backups.",
        signals: { controlMatch: 4, answerReuse: 3, languageApproved: 3, categoryClarity: 4 },
      },
    ],
  },
  {
    id: "qn-003",
    customer: "Sterling Government Solutions",
    industry: "Public Sector",
    dealValueUsd: 2100000,
    dealStage: "New Logo",
    receivedDate: "2026-05-04",
    dueDate: "2026-05-28", // Overdue
    owner: "Security Enablement",
    questions: [
      {
        id: "q-011",
        prompt: "Provide details on your vulnerability management and penetration testing cadence.",
        category: "Vulnerability Management",
        mappedControlIds: ["SEC-VM-030"],
        suggestedAnswer:
          "Continuous scanning runs across production and build pipelines, with independent third-party penetration tests at least annually; an executive summary is available under NDA.",
        signals: { controlMatch: 4, answerReuse: 3, languageApproved: 4, categoryClarity: 4 },
      },
      {
        id: "q-012",
        prompt: "What are your patch remediation SLAs and how are they tracked?",
        category: "Vulnerability Management",
        mappedControlIds: ["SEC-VM-031"],
        suggestedAnswer:
          "Patches are prioritized by severity; critical issues are remediated within defined SLA windows, tracked to closure, and reported to security leadership.",
        signals: { controlMatch: 4, answerReuse: 3, languageApproved: 4, categoryClarity: 4 },
      },
      {
        id: "q-013",
        prompt: "Describe access provisioning, review, and deprovisioning controls.",
        category: "Access Control & Identity",
        mappedControlIds: ["SEC-IAM-010"],
        suggestedAnswer:
          "Access is provisioned through approved requests under least privilege, reviewed quarterly, and revoked promptly on role change or offboarding.",
        signals: { controlMatch: 4, answerReuse: 4, languageApproved: 4, categoryClarity: 4 },
      },
      {
        id: "q-014",
        prompt: "How does your AI functionality use customer data, and is it used for model training?",
        category: "AI & Model Governance",
        mappedControlIds: ["AI-GOV-060"],
        suggestedAnswer:
          "AI features operate under a documented governance program with human oversight; customer data is not used to train shared or third-party foundation models without explicit consent.",
        signals: { controlMatch: 4, answerReuse: 3, languageApproved: 3, categoryClarity: 4 },
      },
      {
        id: "q-015",
        prompt: "Confirm SOC 2 Type II and ISO 27001 certifications and availability of reports.",
        category: "Compliance & Certifications",
        mappedControlIds: ["CMP-CERT-090"],
        suggestedAnswer:
          "We maintain a SOC 2 Type II report and ISO/IEC 27001 certification; reports and certificates are available under NDA via the trust portal.",
        signals: { controlMatch: 4, answerReuse: 4, languageApproved: 4, categoryClarity: 4 },
      },
      {
        id: "q-016",
        prompt: "What are your contractual breach notification timelines?",
        category: "Incident Response",
        mappedControlIds: ["SEC-IR-021"],
        suggestedAnswer:
          "Customers are notified of confirmed breaches affecting their data without undue delay and within the timelines defined in the applicable agreement and regulation.",
        signals: { controlMatch: 4, answerReuse: 3, languageApproved: 3, categoryClarity: 3 },
      },
    ],
  },
  {
    id: "qn-004",
    customer: "Bluepeak Retail",
    industry: "Retail & E-commerce",
    dealValueUsd: 150000,
    dealStage: "Expansion",
    receivedDate: "2026-05-22",
    dueDate: "2026-06-25", // On Track
    owner: "Security Enablement",
    questions: [
      {
        id: "q-017",
        prompt: "How is cardholder data encrypted and segmented per PCI DSS?",
        category: "Encryption & Data Protection",
        mappedControlIds: ["SEC-ENC-001", "CLD-INF-050"],
        suggestedAnswer:
          "Cardholder data is encrypted at rest with AES-256 and processed in a logically segregated environment with network controls isolating production workloads.",
        signals: { controlMatch: 4, answerReuse: 4, languageApproved: 4, categoryClarity: 4 },
      },
      {
        id: "q-018",
        prompt: "Describe your cloud hosting architecture and tenant isolation.",
        category: "Cloud & Infrastructure Security",
        mappedControlIds: ["CLD-INF-050"],
        suggestedAnswer:
          "The platform runs on a major cloud provider in a logically segregated, multi-tenant architecture with security groups and private subnets isolating production.",
        signals: { controlMatch: 4, answerReuse: 3, languageApproved: 4, categoryClarity: 4 },
      },
      {
        id: "q-019",
        prompt: "What is your vendor and third-party risk management process?",
        category: "Vendor & Third-Party Risk",
        mappedControlIds: ["VR-TPR-080"],
        suggestedAnswer:
          "Vendors are risk-assessed before onboarding and reassessed periodically by data sensitivity and criticality, with security and privacy requirements flowed down contractually.",
        signals: { controlMatch: 3, answerReuse: 3, languageApproved: 3, categoryClarity: 3 },
      },
      {
        id: "q-020",
        prompt: "How quickly are critical patches applied to internet-facing systems?",
        category: "Vulnerability Management",
        mappedControlIds: ["SEC-VM-031"],
        suggestedAnswer:
          "Critical patches to internet-facing systems are prioritized and remediated within defined SLA windows and tracked to closure.",
        signals: { controlMatch: 4, answerReuse: 4, languageApproved: 4, categoryClarity: 3 },
      },
      {
        id: "q-021",
        prompt: "Do you support customer-managed data deletion requests?",
        category: "Privacy & Data Retention",
        mappedControlIds: ["PRIV-DR-040"],
        suggestedAnswer:
          "Yes. Data is retained only as long as necessary, and deletion or return is supported within the period defined in the data processing agreement.",
        signals: { controlMatch: 3, answerReuse: 3, languageApproved: 3, categoryClarity: 4 },
      },
    ],
  },
  {
    id: "qn-005",
    customer: "Helios Energy",
    industry: "Energy & Utilities",
    dealValueUsd: 640000,
    dealStage: "New Logo",
    receivedDate: "2026-05-21",
    dueDate: "2026-06-10", // At Risk
    owner: "Security Enablement",
    questions: [
      {
        id: "q-022",
        prompt: "Describe encryption in transit for all external integrations.",
        category: "Encryption & Data Protection",
        mappedControlIds: ["SEC-ENC-002"],
        suggestedAnswer:
          "All data in transit is protected using TLS 1.2 or higher, with legacy protocols disabled and HSTS enforced on public endpoints.",
        signals: { controlMatch: 4, answerReuse: 4, languageApproved: 4, categoryClarity: 4 },
      },
      {
        id: "q-023",
        prompt: "What identity federation and MFA standards do you enforce?",
        category: "Access Control & Identity",
        mappedControlIds: ["SEC-IAM-011"],
        suggestedAnswer:
          "Workforce access is federated through SSO with MFA enforced for all access and phishing-resistant factors required for privileged roles.",
        signals: { controlMatch: 4, answerReuse: 3, languageApproved: 4, categoryClarity: 4 },
      },
      {
        id: "q-024",
        prompt: "Describe your incident response plan and testing cadence.",
        category: "Incident Response",
        mappedControlIds: ["SEC-IR-020"],
        suggestedAnswer:
          "A documented IR plan defines roles, severity tiers, and escalation paths, and is tested at least annually through tabletop exercises with post-incident reviews.",
        signals: { controlMatch: 4, answerReuse: 3, languageApproved: 3, categoryClarity: 4 },
      },
      {
        id: "q-025",
        prompt: "How are encryption keys rotated and who has access to them?",
        category: "Encryption & Data Protection",
        mappedControlIds: ["SEC-KMS-004"],
        suggestedAnswer:
          "Keys are managed in a hardware-backed KMS, rotated at least annually and on personnel change, with access restricted by least privilege.",
        signals: { controlMatch: 4, answerReuse: 4, languageApproved: 4, categoryClarity: 3 },
      },
      {
        id: "q-026",
        prompt: "Is there a documented business continuity plan with RTO/RPO targets?",
        category: "Business Continuity & Resilience",
        mappedControlIds: ["BC-DR-070"],
        suggestedAnswer:
          "Yes. BC/DR plans define RTO and RPO targets, are tested at least annually, and use geographically redundant infrastructure with validated backups.",
        signals: { controlMatch: 4, answerReuse: 4, languageApproved: 4, categoryClarity: 4 },
      },
    ],
  },
  {
    id: "qn-006",
    customer: "Lumen Analytics",
    industry: "Data & Analytics",
    dealValueUsd: 320000,
    dealStage: "New Logo",
    receivedDate: "2026-05-28",
    dueDate: "2026-07-05", // On Track
    owner: "Security Enablement",
    questions: [
      {
        id: "q-027",
        prompt: "How does your platform use AI, and is customer data used to train models?",
        category: "AI & Model Governance",
        mappedControlIds: ["AI-GOV-060"],
        suggestedAnswer:
          "AI features run under a documented governance program covering approved use cases and human oversight; customer data is not used to train shared or third-party foundation models without explicit consent.",
        signals: { controlMatch: 4, answerReuse: 3, languageApproved: 4, categoryClarity: 4 },
      },
      {
        id: "q-028",
        prompt: "What human oversight exists for AI-generated outputs?",
        category: "AI & Model Governance",
        mappedControlIds: ["AI-GOV-060"],
        suggestedAnswer:
          "AI-generated outputs are subject to documented human oversight and evaluation as defined in the AI governance program.",
        signals: { controlMatch: 3, answerReuse: 2, languageApproved: 3, categoryClarity: 3 },
      },
      {
        id: "q-029",
        prompt: "Describe data retention for AI training datasets.",
        category: "Privacy & Data Retention",
        mappedControlIds: ["PRIV-DR-040"],
        suggestedAnswer:
          "Data used by AI features is retained only as long as necessary to provide the service or meet legal obligations, consistent with the data retention policy.",
        signals: { controlMatch: 3, answerReuse: 3, languageApproved: 3, categoryClarity: 3 },
      },
      {
        id: "q-030",
        prompt: "Are AI vendors and subprocessors disclosed?",
        category: "Privacy & Data Retention",
        mappedControlIds: ["PRIV-PII-041"],
        suggestedAnswer:
          "A current subprocessor list, including AI vendors, is maintained and published; subprocessors are bound by data protection agreements.",
        signals: { controlMatch: 3, answerReuse: 2, languageApproved: 2, categoryClarity: 3 },
      },
      {
        id: "q-031",
        prompt: "What encryption protects data processed by AI features?",
        category: "Encryption & Data Protection",
        mappedControlIds: ["SEC-ENC-001"],
        suggestedAnswer:
          "Data processed by AI features is encrypted at rest using AES-256 across production data stores, consistent with the platform's encryption standards.",
        signals: { controlMatch: 4, answerReuse: 4, languageApproved: 4, categoryClarity: 4 },
      },
    ],
  },
  {
    id: "qn-007",
    customer: "Orbit Media",
    industry: "Media & SaaS",
    dealValueUsd: 90000,
    dealStage: "Renewal",
    receivedDate: "2026-05-24",
    dueDate: "2026-06-28", // On Track
    owner: "Security Enablement",
    questions: [
      {
        id: "q-032",
        prompt: "Confirm the TLS standards used for data in transit.",
        category: "Encryption & Data Protection",
        mappedControlIds: ["SEC-ENC-002"],
        suggestedAnswer:
          "Data in transit is protected using TLS 1.2 or higher; SSL and TLS 1.0/1.1 are disabled and HSTS is enforced on public endpoints.",
        signals: { controlMatch: 4, answerReuse: 4, languageApproved: 4, categoryClarity: 4 },
      },
      {
        id: "q-033",
        prompt: "Is access reviewed periodically and revoked on offboarding?",
        category: "Access Control & Identity",
        mappedControlIds: ["SEC-IAM-010"],
        suggestedAnswer:
          "Access is reviewed quarterly and revoked promptly on role change or offboarding, following least-privilege provisioning.",
        signals: { controlMatch: 4, answerReuse: 4, languageApproved: 4, categoryClarity: 4 },
      },
      {
        id: "q-034",
        prompt: "Do you hold current SOC 2 and ISO 27001 certifications?",
        category: "Compliance & Certifications",
        mappedControlIds: ["CMP-CERT-090"],
        suggestedAnswer:
          "Yes. We maintain a SOC 2 Type II report and ISO/IEC 27001 certification, available under NDA through the trust portal.",
        signals: { controlMatch: 4, answerReuse: 4, languageApproved: 4, categoryClarity: 3 },
      },
      {
        id: "q-035",
        prompt: "Describe vendor risk management for your subprocessors.",
        category: "Vendor & Third-Party Risk",
        mappedControlIds: ["VR-TPR-080"],
        suggestedAnswer:
          "Subprocessors are risk-assessed before onboarding and reassessed periodically by data sensitivity, with requirements flowed down through contractual terms.",
        signals: { controlMatch: 3, answerReuse: 3, languageApproved: 3, categoryClarity: 4 },
      },
    ],
  },
];

export function getQuestionnaireById(id: string): Questionnaire | undefined {
  return questionnaires.find((q) => q.id === id);
}

/** Flattened view of every question with its parent questionnaire context. */
export function allQuestions() {
  return questionnaires.flatMap((qn) =>
    qn.questions.map((question) => ({ questionnaire: qn, question })),
  );
}
