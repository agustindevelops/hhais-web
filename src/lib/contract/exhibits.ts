import type { IntakeSnapshot } from "@/lib/intake/types";
import type { ContractExhibit } from "@/lib/contract/types";

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
