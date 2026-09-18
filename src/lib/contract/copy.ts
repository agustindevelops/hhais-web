import type { ContractExhibit } from "@/lib/contract/types";
import { exhibitScopeLabel } from "@/lib/contract/exhibits";
import type { AccountStatus } from "@/lib/intake/types";

export const PROVIDER_NAME = "Helping Hand AI Solutions";
export const PROVIDER_SHORT = "HHAIS";
export const PROVIDER_SIGNATORY_TITLE = "Founder";

export const DOCUMENT_KIND = "Statement of Work";
export const DOCUMENT_TITLE = "Project Agreement";

export const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string> = {
  existing: "Existing account",
  needs_creation: "Needs to be created",
  unknown: "To be confirmed",
};

export const FALLBACK = {
  client: "the Client",
  empty: "—",
  untitledFeature: "Untitled feature",
  untitledIntegration: "Untitled integration",
} as const;

export const SECTION_TITLE = {
  parties: "Parties",
  project: "Project",
  scope: "Scope of work",
  integrations: "Integrations and third-party services",
  fee: "Fee and payment",
  priorities: "Delivery priorities",
  notes: "Additional notes and exclusions",
  exhibits: "Appendix A — Client-Provided Documentation",
  terms: "Terms",
  signatures: "Signatures",
} as const;

export const APPENDIX_A_TITLE = SECTION_TITLE.exhibits;

export const APPENDIX_A_INTRO = [
  "The following documents were submitted by the Client through the project intake form and are incorporated into this Agreement by reference.",
  "These documents represent the information, specifications, requirements, examples, and other materials provided by the Client for the purposes of defining and completing the Project.",
] as const;

export const REFERENCED_DOCUMENTS_HEADING = "Referenced Documents";

export type ContractSectionNumbers = {
  parties: number;
  project: number;
  scope: number;
  integrations: number;
  fee: number;
  priorities: number;
  notes: number;
  exhibits: number;
  terms: number;
  signatures: number;
};

export function numberedSections(
  hasIntegrations: boolean,
  hasNotes: boolean,
  hasExhibits: boolean,
): ContractSectionNumbers {
  let next = 1;
  const take = () => next++;

  return {
    parties: take(),
    project: take(),
    scope: take(),
    integrations: hasIntegrations ? take() : 0,
    fee: take(),
    priorities: take(),
    notes: hasNotes ? take() : 0,
    exhibits: hasExhibits ? take() : 0,
    terms: take(),
    signatures: take(),
  };
}

export function sectionHeading(number: number, title: string): string {
  return `${number}. ${title}`;
}

export function displayValue(value: string, fallback: string = FALLBACK.empty): string {
  const trimmed = value.trim();
  return trimmed || fallback;
}

export function formatLongDate(value: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(typeof value === "string" ? new Date(value) : value);
}

export function contractLede(clientName: string): string {
  return `This agreement sets out the work ${PROVIDER_SHORT} will deliver for ${clientName}. The features below are the contracted deliverables and the basis for acceptance.`;
}

export function scopeIntro(): string {
  return `${PROVIDER_SHORT} will design, build, and deliver the following features. Work not listed is out of scope unless agreed in writing.`;
}

export function noFeaturesRecorded(): string {
  return "No features have been recorded yet. Complete intake before using this agreement.";
}

export function noProjectDescription(): string {
  return "No project description has been recorded yet.";
}

export function noDescriptionProvided(): string {
  return "No description provided.";
}

export function relatedIntegrationsLine(names: string[]): string {
  if (names.length === 0) {
    return "";
  }
  return `Related integrations: ${names.join(", ")}`;
}

export function supportsLine(names: string[]): string {
  if (names.length === 0) {
    return "";
  }
  return `Supports: ${names.join(", ")}`;
}

export function referencedDocumentationLine(refs: string): string {
  if (!refs) {
    return "";
  }
  return `Referenced documentation: ${refs}`;
}

export function accountStatusLine(status: AccountStatus, email: string): string {
  const label = ACCOUNT_STATUS_LABELS[status];
  const trimmedEmail = email.trim();
  return trimmedEmail
    ? `Account status: ${label} · ${trimmedEmail}`
    : `Account status: ${label}`;
}

export function integrationsIntro(): string {
  return "These services are required to deliver the features above. Unless stated otherwise, the Client owns the accounts; third-party fees are not included in the project fee.";
}

export function feeToBeDetermined(): string {
  return "To be determined";
}

export function noPaymentPlanSelected(): string {
  return "No payment plan selected";
}

export function noPaymentPlanYet(): string {
  return "A payment plan has not been selected yet.";
}

export function feeCommencement(): string {
  return "Work begins after signing and receipt of any amount due upon signing. Custom deliverables transfer to the Client upon payment in full.";
}

export function prioritiesIntro(): string {
  return `If trade-offs are required, ${PROVIDER_SHORT} will follow this ranking (1 = highest):`;
}

export function appendixAClosing(): string[] {
  return [
    `By signing this Agreement, the Client confirms that the documents listed above are the documentation they intend ${PROVIDER_NAME} to rely upon when determining the Project requirements, scope, design, functionality, and deliverables.`,
    `${PROVIDER_NAME} will perform the Services based on the information contained in this Agreement, the agreed Scope of Work, and the referenced documentation above.`,
    "Any request that materially differs from or adds to the requirements contained in these documents may be treated as a change in scope and may require additional fees, timeline adjustments, or a written amendment to this Agreement.",
    "If there is a conflict between the referenced documentation and the main terms of this Agreement, the main Agreement and approved Scope of Work will control unless otherwise stated in writing.",
  ];
}

export function exhibitListLine(exhibit: ContractExhibit): string {
  return `${exhibit.reference}: ${exhibit.fileName} (${exhibitScopeLabel(exhibit)})`;
}

export function contractTerms(input: {
  scopeSection: number;
  appendixSection: number | null;
}): string[] {
  const appendixPhrase = input.appendixSection
    ? ` listed in ${APPENDIX_A_TITLE} (Section ${input.appendixSection})`
    : " submitted through the project intake form";

  return [
    `The features in Section ${input.scopeSection} are the complete initial scope. Material changes may affect fee or timeline and require written agreement.`,
    "The Client will provide branding, content, account access, approvals, and timely feedback needed to complete the listed features.",
    "Third-party products, licenses, domains, and usage fees are the Client's responsibility unless expressly included.",
    `${PROVIDER_SHORT} will deliver the described features in a professional manner. Acceptance is based on the feature descriptions herein, not on unlisted discussions.`,
    `Before final send-off, the Client will have an opportunity to review the delivered project and list any requested adjustments. ${PROVIDER_SHORT} will address listed items that fall within the agreed Scope of Work. Requests that materially differ from or add to that scope may be treated as a change in scope.`,
    `${PROVIDER_SHORT} will perform the Services based on this Agreement, the agreed Scope of Work, and the Client-provided documentation${appendixPhrase}. Requests that materially differ from or add to those materials may be treated as a change in scope.`,
    `Upon payment in full, the Client owns the custom code and deliverables produced for this project. ${PROVIDER_SHORT} may reuse general methods, libraries, and know-how that are not unique to the Client.`,
    "Either party may pause or end the engagement for material breach after written notice and a reasonable opportunity to cure. Amounts owed for work already performed remain due.",
  ];
}

export function signaturesIntro(): string {
  return `By signing, the parties agree that ${PROVIDER_SHORT} will deliver the features above for the stated fee, and that those features define the customer's expectations.`;
}

export function clauseTitle(
  sectionNumber: number,
  index: number,
  name: string,
): string {
  return `${sectionNumber}.${index + 1} ${displayValue(name, FALLBACK.untitledFeature)}`;
}
