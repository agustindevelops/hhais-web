import "server-only";

import {
  bootstrapIntake,
  getCurrentProject,
  getPrimaryContact,
} from "@/lib/intake/bootstrap";
import { toIntakeSnapshot } from "@/lib/intake/snapshot";
import {
  ACCOUNT_STATUSES,
  type IntakeActionResult,
  type IntakeSavePayload,
  type IntakeSnapshot,
} from "@/lib/intake/types";
import { validateAccessToken } from "@/lib/client-access";
import { prisma } from "@/lib/prisma";

function isTempId(id: string) {
  return id.startsWith("temp_");
}

function optionalText(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function isNonEmptyMarkdown(value: string) {
  return value.replace(/[#>*_`\-\s]/g, "").length > 0;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateSubmit(payload: IntakeSavePayload): string | null {
  if (!payload.business.name.trim()) {
    return "Business Name is required.";
  }
  if (!payload.contact.name.trim()) {
    return "Primary Contact Name is required.";
  }
  if (!payload.contact.email.trim()) {
    return "Primary Contact Email is required.";
  }
  if (!EMAIL_PATTERN.test(payload.contact.email.trim())) {
    return "Primary Contact Email must be a valid email address.";
  }
  if (!payload.project.name.trim()) {
    return "Project Name is required.";
  }
  if (!isNonEmptyMarkdown(payload.project.descriptionMarkdown)) {
    return "Project Description is required.";
  }
  if (payload.features.length === 0) {
    return "Add at least one Feature.";
  }
  return null;
}

export async function loadIntakeSnapshot(
  token: string | undefined,
): Promise<IntakeSnapshot | null> {
  const access = await validateAccessToken(token);
  if (!access || !token) {
    return null;
  }

  const { business } = await bootstrapIntake(access.client);
  const project = getCurrentProject(business);
  if (!project || !getPrimaryContact(business)) {
    return null;
  }

  return toIntakeSnapshot({ token, business, project });
}

export async function persistIntake(
  payload: IntakeSavePayload,
  options: { submit: boolean },
): Promise<IntakeActionResult> {
  const access = await validateAccessToken(payload.token);
  if (!access) {
    return {
      ok: false,
      error: "This intake link is invalid or has expired.",
    };
  }

  if (options.submit) {
    const submitError = validateSubmit(payload);
    if (submitError) {
      return { ok: false, error: submitError };
    }
  }

  const { business } = await bootstrapIntake(access.client);
  const project = getCurrentProject(business);
  if (!project) {
    return { ok: false, error: "Project could not be loaded." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.business.update({
        where: { id: business.id },
        data: {
          name: payload.business.name.trim(),
          legalName: optionalText(payload.business.legalName),
          domain: optionalText(payload.business.domain),
          website: optionalText(payload.business.website),
        },
      });

      const primary = await tx.contact.findFirst({
        where: { businessId: business.id, isPrimary: true },
      });

      const contactData = {
        name: payload.contact.name.trim(),
        email: payload.contact.email.trim(),
        phone: optionalText(payload.contact.phone),
        role: optionalText(payload.contact.role),
        isPrimary: true,
      };

      if (primary) {
        await tx.contact.update({
          where: { id: primary.id },
          data: contactData,
        });
      } else {
        await tx.contact.create({
          data: {
            businessId: business.id,
            ...contactData,
          },
        });
      }

      await tx.project.update({
        where: { id: project.id },
        data: {
          name: payload.project.name.trim(),
          descriptionMarkdown: payload.project.descriptionMarkdown,
          additionalNotesMarkdown: optionalText(
            payload.project.additionalNotesMarkdown,
          ),
          ...(options.submit && !project.submittedAt
            ? { submittedAt: new Date() }
            : {}),
        },
      });

      const keptFeatureIds = payload.features
        .map((feature) => feature.id)
        .filter((id) => !isTempId(id));

      await tx.feature.deleteMany({
        where: {
          projectId: project.id,
          ...(keptFeatureIds.length > 0
            ? { id: { notIn: keptFeatureIds } }
            : {}),
        },
      });

      const keptIntegrationIds = payload.integrations
        .map((integration) => integration.id)
        .filter((id) => !isTempId(id));

      await tx.integration.deleteMany({
        where: {
          projectId: project.id,
          ...(keptIntegrationIds.length > 0
            ? { id: { notIn: keptIntegrationIds } }
            : {}),
        },
      });

      const featureIdMap = new Map<string, string>();

      for (const [index, feature] of payload.features.entries()) {
        if (isTempId(feature.id)) {
          const created = await tx.feature.create({
            data: {
              projectId: project.id,
              name: feature.name.trim(),
              descriptionMarkdown: feature.descriptionMarkdown,
              sortOrder: index,
            },
          });
          featureIdMap.set(feature.id, created.id);
        } else {
          const updated = await tx.feature.updateMany({
            where: { id: feature.id, projectId: project.id },
            data: {
              name: feature.name.trim(),
              descriptionMarkdown: feature.descriptionMarkdown,
              sortOrder: index,
            },
          });
          if (updated.count === 0) {
            throw new Error("Feature not found for this project.");
          }
          featureIdMap.set(feature.id, feature.id);
        }
      }

      const integrationIdMap = new Map<string, string>();

      for (const integration of payload.integrations) {
        const accountStatus = ACCOUNT_STATUSES.includes(integration.accountStatus)
          ? integration.accountStatus
          : "unknown";

        if (isTempId(integration.id)) {
          const created = await tx.integration.create({
            data: {
              projectId: project.id,
              name: integration.name.trim(),
              descriptionMarkdown: integration.descriptionMarkdown,
              accountStatus,
              accountEmail: optionalText(integration.accountEmail),
            },
          });
          integrationIdMap.set(integration.id, created.id);
        } else {
          const updated = await tx.integration.updateMany({
            where: { id: integration.id, projectId: project.id },
            data: {
              name: integration.name.trim(),
              descriptionMarkdown: integration.descriptionMarkdown,
              accountStatus,
              accountEmail: optionalText(integration.accountEmail),
            },
          });
          if (updated.count === 0) {
            throw new Error("Integration not found for this project.");
          }
          integrationIdMap.set(integration.id, integration.id);
        }
      }

      const realFeatureIds = [...featureIdMap.values()];
      if (realFeatureIds.length > 0) {
        await tx.featureIntegration.deleteMany({
          where: { featureId: { in: realFeatureIds } },
        });
      }

      for (const integration of payload.integrations) {
        const realIntegrationId = integrationIdMap.get(integration.id);
        if (!realIntegrationId) {
          continue;
        }

        const uniqueFeatureIds = [...new Set(integration.featureIds)];
        for (const featureId of uniqueFeatureIds) {
          const realFeatureId = featureIdMap.get(featureId);
          if (!realFeatureId) {
            continue;
          }
          await tx.featureIntegration.create({
            data: {
              featureId: realFeatureId,
              integrationId: realIntegrationId,
            },
          });
        }
      }

      const claimed = new Set<string>();

      for (const feature of payload.features) {
        const realFeatureId = featureIdMap.get(feature.id);
        if (!realFeatureId) {
          continue;
        }
        for (const attachmentId of feature.attachmentIds) {
          claimed.add(attachmentId);
          await tx.attachment.updateMany({
            where: { id: attachmentId, projectId: project.id },
            data: { featureId: realFeatureId, integrationId: null },
          });
        }
      }

      for (const integration of payload.integrations) {
        const realIntegrationId = integrationIdMap.get(integration.id);
        if (!realIntegrationId) {
          continue;
        }
        for (const attachmentId of integration.attachmentIds) {
          claimed.add(attachmentId);
          await tx.attachment.updateMany({
            where: { id: attachmentId, projectId: project.id },
            data: { featureId: null, integrationId: realIntegrationId },
          });
        }
      }

      for (const attachmentId of payload.generalAttachmentIds) {
        claimed.add(attachmentId);
        await tx.attachment.updateMany({
          where: { id: attachmentId, projectId: project.id },
          data: { featureId: null, integrationId: null },
        });
      }

      await tx.attachment.updateMany({
        where: {
          projectId: project.id,
          status: "uploaded",
          ...(claimed.size > 0 ? { id: { notIn: [...claimed] } } : {}),
        },
        data: { featureId: null, integrationId: null },
      });
    });
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Failed to save intake.",
    };
  }

  const snapshot = await loadIntakeSnapshot(payload.token);
  if (!snapshot) {
    return { ok: false, error: "Saved, but the intake could not be reloaded." };
  }

  return { ok: true, snapshot };
}
