import type { IntakeSnapshot } from "@/lib/intake/types";
import type { ContractExhibit } from "@/lib/contract/types";

export const APPENDIX_A_TITLE = "Appendix A — Client-Provided Documentation";

export const APPENDIX_A_INTRO = [
  "The following documents were submitted by the Client through the project intake form and are incorporated into this Agreement by reference.",
  "These documents represent the information, specifications, requirements, examples, and other materials provided by the Client for the purposes of defining and completing the Project.",
] as const;

export function appendixAClosing(providerName: string): string[] {
  return [
    `By signing this Agreement, the Client confirms that the documents listed above are the documentation they intend ${providerName} to rely upon when determining the Project requirements, scope, design, functionality, and deliverables.`,
    `${providerName} will perform the Services based on the information contained in this Agreement, the agreed Scope of Work, and the referenced documentation above.`,
    "Any request that materially differs from or adds to the requirements contained in these documents may be treated as a change in scope and may require additional fees, timeline adjustments, or a written amendment to this Agreement.",
    "If there is a conflict between the referenced documentation and the main terms of this Agreement, the main Agreement and approved Scope of Work will control unless otherwise stated in writing.",
  ];
}

function appendixReference(index: number): string {
  return `A.${index + 1}`;
}

/**
 * Build Appendix A from uploaded intake attachments.
 * Order: general project files, then features (by sort), then integrations.
 */
export function buildExhibits(snapshot: IntakeSnapshot): ContractExhibit[] {
  const exhibits: Omit<ContractExhibit, "reference">[] = [];

  for (const attachment of snapshot.generalAttachments) {
    exhibits.push({
      attachmentId: attachment.id,
      fileName: attachment.fileName,
      contentType: attachment.contentType,
      scope: "project",
      scopeName: snapshot.project.name || "Project",
    });
  }

  for (const feature of snapshot.features) {
    for (const attachment of feature.attachments) {
      exhibits.push({
        attachmentId: attachment.id,
        fileName: attachment.fileName,
        contentType: attachment.contentType,
        scope: "feature",
        scopeName: feature.name || "Untitled feature",
      });
    }
  }

  for (const integration of snapshot.integrations) {
    for (const attachment of integration.attachments) {
      exhibits.push({
        attachmentId: attachment.id,
        fileName: attachment.fileName,
        contentType: attachment.contentType,
        scope: "integration",
        scopeName: integration.name || "Untitled integration",
      });
    }
  }

  return exhibits.map((exhibit, index) => ({
    ...exhibit,
    reference: appendixReference(index),
  }));
}

export function exhibitsForAttachmentIds(
  exhibits: ContractExhibit[],
  attachmentIds: string[],
): ContractExhibit[] {
  const byId = new Map(exhibits.map((exhibit) => [exhibit.attachmentId, exhibit]));
  return attachmentIds
    .map((id) => byId.get(id))
    .filter((exhibit): exhibit is ContractExhibit => exhibit != null);
}

export function formatDocumentRefs(exhibits: ContractExhibit[]): string {
  const labels = exhibits.map(
    (exhibit) => `${exhibit.reference} (${exhibit.fileName})`,
  );
  if (labels.length === 0) {
    return "";
  }
  if (labels.length === 1) {
    return labels[0];
  }
  if (labels.length === 2) {
    return `${labels[0]} and ${labels[1]}`;
  }
  const head = labels.slice(0, -1).join(", ");
  return `${head}, and ${labels[labels.length - 1]}`;
}

export function exhibitScopeLabel(exhibit: ContractExhibit): string {
  if (exhibit.scope === "project") {
    return "Project document";
  }
  if (exhibit.scope === "feature") {
    return `Feature: ${exhibit.scopeName}`;
  }
  return `Integration: ${exhibit.scopeName}`;
}
