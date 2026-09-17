import "server-only";

import type { CurrentProject } from "@/lib/intake/bootstrap";
import { getPrimaryContact, type BootstrappedBusiness } from "@/lib/intake/bootstrap";
import {
  ACCOUNT_STATUSES,
  formatFee,
  normalizeProjectPriorities,
  type AccountStatus,
  type IntakeAttachment,
  type IntakePaymentPlan,
  type IntakeSnapshot,
} from "@/lib/intake/types";

function asAccountStatus(value: string): AccountStatus {
  return ACCOUNT_STATUSES.includes(value as AccountStatus)
    ? (value as AccountStatus)
    : "unknown";
}

function toAttachment(attachment: {
  id: string;
  fileName: string;
  contentType: string;
  byteSize: number | null;
  featureId: string | null;
  integrationId: string | null;
}): IntakeAttachment {
  return {
    id: attachment.id,
    fileName: attachment.fileName,
    contentType: attachment.contentType,
    byteSize: attachment.byteSize,
    featureId: attachment.featureId,
    integrationId: attachment.integrationId,
  };
}

export function toIntakeSnapshot(input: {
  token: string;
  business: BootstrappedBusiness;
  project: CurrentProject;
  paymentPlans: IntakePaymentPlan[];
}): IntakeSnapshot {
  const { token, business, project, paymentPlans } = input;
  const contact = getPrimaryContact(business);

  const generalAttachments = project.attachments
    .filter((attachment) => !attachment.featureId && !attachment.integrationId)
    .map(toAttachment);

  return {
    token,
    business: {
      id: business.id,
      name: business.name,
      legalName: business.legalName ?? "",
      domain: business.domain ?? "",
      website: business.website ?? "",
    },
    contact: {
      id: contact?.id ?? "",
      name: contact?.name ?? "",
      email: contact?.email ?? "",
      phone: contact?.phone ?? "",
      role: contact?.role ?? "",
    },
    project: {
      id: project.id,
      name: project.name,
      descriptionMarkdown: project.descriptionMarkdown,
      additionalNotesMarkdown: project.additionalNotesMarkdown ?? "",
      fee:
        project.fee == null ? "" : formatFee(Number(project.fee.toString())),
      priorities: normalizeProjectPriorities(project.priorities),
      paymentPlanId: project.paymentPlanId ?? "",
      submittedAt: project.submittedAt?.toISOString() ?? null,
    },
    paymentPlans,
    features: project.features.map((feature) => ({
      id: feature.id,
      name: feature.name,
      descriptionMarkdown: feature.descriptionMarkdown,
      sortOrder: feature.sortOrder,
      integrationIds: feature.featureIntegrations.map(
        (link) => link.integrationId,
      ),
      attachments: feature.attachments.map(toAttachment),
    })),
    integrations: project.integrations.map((integration) => ({
      id: integration.id,
      name: integration.name,
      descriptionMarkdown: integration.descriptionMarkdown,
      accountStatus: asAccountStatus(integration.accountStatus),
      accountEmail: integration.accountEmail ?? "",
      featureIds: integration.featureIntegrations.map((link) => link.featureId),
      attachments: integration.attachments.map(toAttachment),
    })),
    generalAttachments,
  };
}
