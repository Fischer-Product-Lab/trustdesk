import type { Control } from "@/lib/types";

/**
 * Synthetic control & evidence library for TrustDesk V1.
 *
 * SYNTHETIC DATA ONLY — every control, owner, date, and approved-language
 * snippet below is invented for demonstration. No real employer, customer, or
 * security posture is described here.
 *
 * Evidence freshness (Current / Expiring Soon / Expired) is *computed* from
 * `expiresOn` relative to the engine's fixed reference date (2026-06-01) by
 * lib/confidence.ts — never stored. A few entries are intentionally expired or
 * expiring soon to exercise the governance gates.
 */
export const controls: Control[] = [
  {
    id: "SEC-ENC-001",
    title: "Encryption at Rest",
    category: "Encryption & Data Protection",
    frameworks: ["SOC 2", "ISO 27001", "PCI DSS"],
    approvedLanguage:
      "All customer data is encrypted at rest using AES-256. Encryption is enabled at the storage layer across all production data stores, including backups and snapshots.",
    evidenceOwner: "Dana Whitfield",
    ownerTeam: "Security Engineering",
    lastReviewed: "2026-02-10",
    expiresOn: "2027-02-10",
  },
  {
    id: "SEC-ENC-002",
    title: "Encryption in Transit",
    category: "Encryption & Data Protection",
    frameworks: ["SOC 2", "ISO 27001"],
    approvedLanguage:
      "All data in transit is protected using TLS 1.2 or higher. Legacy protocols (SSL, TLS 1.0/1.1) are disabled, and HSTS is enforced on all public endpoints.",
    evidenceOwner: "Dana Whitfield",
    ownerTeam: "Security Engineering",
    lastReviewed: "2026-03-01",
    expiresOn: "2027-03-01",
  },
  {
    id: "SEC-KMS-004",
    title: "Key Management & Rotation",
    category: "Encryption & Data Protection",
    frameworks: ["SOC 2", "ISO 27001"],
    approvedLanguage:
      "Encryption keys are managed in a dedicated KMS with hardware-backed protection. Keys are rotated at least annually and on personnel change, with access restricted by least privilege.",
    evidenceOwner: "Raj Patel",
    ownerTeam: "Platform Security",
    lastReviewed: "2025-07-15",
    expiresOn: "2026-07-15", // expiring soon (within 60 days of 2026-06-01)
  },
  {
    id: "SEC-IAM-010",
    title: "Access Control & RBAC",
    category: "Access Control & Identity",
    frameworks: ["SOC 2", "ISO 27001", "NIST CSF"],
    approvedLanguage:
      "Access to production systems follows role-based access control and least privilege. Access is provisioned through approved requests, reviewed quarterly, and revoked promptly on role change or offboarding.",
    evidenceOwner: "Mara Lindgren",
    ownerTeam: "Identity & Access",
    lastReviewed: "2026-01-20",
    expiresOn: "2027-01-20",
  },
  {
    id: "SEC-IAM-011",
    title: "MFA & Single Sign-On",
    category: "Access Control & Identity",
    frameworks: ["SOC 2", "NIST CSF"],
    approvedLanguage:
      "Multi-factor authentication is enforced for all employee and administrative access. Workforce access is federated through SSO with phishing-resistant factors required for privileged roles.",
    evidenceOwner: "Mara Lindgren",
    ownerTeam: "Identity & Access",
    lastReviewed: "2026-02-28",
    expiresOn: "2027-02-28",
  },
  {
    id: "SEC-IR-020",
    title: "Incident Response Plan",
    category: "Incident Response",
    frameworks: ["SOC 2", "ISO 27001", "NIST CSF"],
    approvedLanguage:
      "A documented incident response plan defines roles, severity tiers, and escalation paths. The plan is tested at least annually through tabletop exercises, and post-incident reviews are conducted for all major incidents.",
    evidenceOwner: "Tomas Reyes",
    ownerTeam: "Security Operations",
    lastReviewed: "2026-04-05",
    expiresOn: "2027-04-05",
  },
  {
    id: "SEC-IR-021",
    title: "Breach Notification Commitments",
    category: "Incident Response",
    frameworks: ["GDPR", "SOC 2"],
    approvedLanguage:
      "Customers are notified of confirmed breaches affecting their data without undue delay and within the timelines defined in the applicable agreement and regulation. Regulatory notifications follow documented runbooks.",
    evidenceOwner: "Tomas Reyes",
    ownerTeam: "Security Operations",
    lastReviewed: "2025-06-20",
    expiresOn: "2026-06-20", // expiring soon
  },
  {
    id: "SEC-VM-030",
    title: "Vulnerability Management & Penetration Testing",
    category: "Vulnerability Management",
    frameworks: ["SOC 2", "ISO 27001"],
    approvedLanguage:
      "Continuous vulnerability scanning runs across production and build pipelines. Independent third-party penetration tests are performed at least annually, and an executive summary is available under NDA.",
    evidenceOwner: "Sofia Marchetti",
    ownerTeam: "Security Operations",
    lastReviewed: "2026-03-18",
    expiresOn: "2027-03-18",
  },
  {
    id: "SEC-VM-031",
    title: "Patch Management SLA",
    category: "Vulnerability Management",
    frameworks: ["SOC 2"],
    approvedLanguage:
      "Security patches are prioritized by severity. Critical vulnerabilities are remediated within defined SLA windows, tracked to closure, and reported to security leadership.",
    evidenceOwner: "Sofia Marchetti",
    ownerTeam: "Security Operations",
    lastReviewed: "2025-03-30",
    expiresOn: "2026-03-30", // expired
  },
  {
    id: "PRIV-DR-040",
    title: "Data Retention & Deletion",
    category: "Privacy & Data Retention",
    frameworks: ["GDPR", "ISO 27001"],
    approvedLanguage:
      "Customer data is retained only as long as necessary to provide the service or meet legal obligations. On contract termination, customer data is deleted or returned within the period defined in the data processing agreement.",
    evidenceOwner: "Helena Brooks",
    ownerTeam: "Privacy",
    lastReviewed: "2026-01-12",
    expiresOn: "2027-01-12",
  },
  {
    id: "PRIV-PII-041",
    title: "Subprocessors & PII Handling",
    category: "Privacy & Data Retention",
    frameworks: ["GDPR"],
    approvedLanguage:
      "A current list of subprocessors is maintained and published. Subprocessors are bound by data protection agreements, and customers are notified of material changes with the opportunity to object.",
    evidenceOwner: "Helena Brooks",
    ownerTeam: "Privacy",
    lastReviewed: "2025-04-22",
    expiresOn: "2026-04-22", // expired
  },
  {
    id: "CLD-INF-050",
    title: "Cloud Hosting & Tenant Segregation",
    category: "Cloud & Infrastructure Security",
    frameworks: ["SOC 2", "ISO 27001"],
    approvedLanguage:
      "The platform is hosted on a major cloud provider in a logically segregated, multi-tenant architecture. Network controls, security groups, and private subnets isolate production workloads from other environments.",
    evidenceOwner: "Raj Patel",
    ownerTeam: "Platform Security",
    lastReviewed: "2026-02-14",
    expiresOn: "2027-02-14",
  },
  {
    id: "AI-GOV-060",
    title: "AI & Model Governance",
    category: "AI & Model Governance",
    frameworks: ["NIST AI RMF", "ISO 27001"],
    approvedLanguage:
      "AI features operate under a documented governance program covering approved use cases, data handling, human oversight, and evaluation. Customer data is not used to train shared or third-party foundation models without explicit consent.",
    evidenceOwner: "Helena Brooks",
    ownerTeam: "AI Governance",
    lastReviewed: "2025-09-30",
    expiresOn: "2026-07-30", // expiring soon
  },
  {
    id: "BC-DR-070",
    title: "Business Continuity & Disaster Recovery",
    category: "Business Continuity & Resilience",
    frameworks: ["SOC 2", "ISO 27001"],
    approvedLanguage:
      "Business continuity and disaster recovery plans define RTO and RPO targets, are tested at least annually, and rely on geographically redundant infrastructure with automated, regularly validated backups.",
    evidenceOwner: "Tomas Reyes",
    ownerTeam: "Security Operations",
    lastReviewed: "2026-03-22",
    expiresOn: "2027-03-22",
  },
  {
    id: "VR-TPR-080",
    title: "Vendor & Third-Party Risk Management",
    category: "Vendor & Third-Party Risk",
    frameworks: ["SOC 2", "ISO 27001"],
    approvedLanguage:
      "Vendors are risk-assessed before onboarding and reassessed periodically based on data sensitivity and criticality. Security and privacy requirements are flowed down through contractual terms.",
    evidenceOwner: "Mara Lindgren",
    ownerTeam: "Governance, Risk & Compliance",
    lastReviewed: "2026-04-10",
    expiresOn: "2027-04-10",
  },
  {
    id: "CMP-CERT-090",
    title: "Compliance Certifications",
    category: "Compliance & Certifications",
    frameworks: ["SOC 2", "ISO 27001", "CSA CAIQ"],
    approvedLanguage:
      "The company maintains a SOC 2 Type II report and ISO/IEC 27001 certification. Reports and certificates are available to customers and prospects under NDA through the trust portal.",
    evidenceOwner: "Sofia Marchetti",
    ownerTeam: "Governance, Risk & Compliance",
    lastReviewed: "2026-05-01",
    expiresOn: "2027-05-01",
  },
];

export function getControlById(id: string): Control | undefined {
  return controls.find((c) => c.id === id);
}
