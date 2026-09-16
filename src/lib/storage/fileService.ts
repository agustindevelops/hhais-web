import "server-only";

import type { Attachment } from "../../../generated/prisma/client";

import { prisma } from "@/lib/prisma";
import {
  ALLOWED_CONTENT_TYPES,
  buildIntakeS3Key,
  isAllowedContentType,
  MAX_FILE_SIZE_BYTES,
  UPLOAD_URL_EXPIRES_IN,
} from "@/lib/storage/config";
import {
  deleteObject,
  getObjectHeadBytes,
  getUploadUrl,
  headObject,
} from "@/lib/storage/s3";

export class FileServiceError extends Error {
  status: number;
  code: string;

  constructor(code: string, message: string, status = 400) {
    super(message);
    this.name = "FileServiceError";
    this.code = code;
    this.status = status;
  }
}

export type SignAttachmentResult = {
  attachment: Attachment;
  uploadUrl: string;
  expiresIn: number;
  bucket: string;
};

export type VerifyAttachmentResult = {
  attachment: Attachment;
  verifiedContentType: string;
  verifiedSizeBytes: number;
};

const ownedInclude = {
  project: {
    include: {
      business: {
        select: { clientId: true },
      },
    },
  },
} as const;

type OwnedAttachment = Attachment & {
  project: { business: { clientId: string } };
};

async function getOwnedProject(input: {
  clientId: string;
  projectId: string;
}) {
  const project = await prisma.project.findFirst({
    where: {
      id: input.projectId,
      business: { clientId: input.clientId },
    },
    select: { id: true },
  });

  if (!project) {
    throw new FileServiceError("PROJECT_NOT_FOUND", "Project not found", 404);
  }

  return project;
}

export async function signAttachmentUpload(input: {
  clientId: string;
  projectId: string;
  contentType: string;
  fileName: string;
  byteSize?: number | null;
  featureId?: string | null;
  integrationId?: string | null;
}): Promise<SignAttachmentResult> {
  if (!isAllowedContentType(input.contentType)) {
    throw new FileServiceError(
      "INVALID_CONTENT_TYPE",
      `content_type must be one of: ${ALLOWED_CONTENT_TYPES.join(", ")}`,
    );
  }

  const fileName = input.fileName.trim();
  if (!fileName) {
    throw new FileServiceError("INVALID_FILE_NAME", "file_name is required");
  }

  if (
    input.byteSize != null &&
    (!Number.isFinite(input.byteSize) ||
      input.byteSize <= 0 ||
      input.byteSize > MAX_FILE_SIZE_BYTES)
  ) {
    throw new FileServiceError(
      "INVALID_BYTE_SIZE",
      `byte_size must be between 1 and ${MAX_FILE_SIZE_BYTES}`,
    );
  }

  if (input.featureId && input.integrationId) {
    throw new FileServiceError(
      "INVALID_ATTACHMENT_TARGET",
      "An attachment cannot belong to both a feature and an integration",
    );
  }

  await getOwnedProject({
    clientId: input.clientId,
    projectId: input.projectId,
  });

  if (input.featureId) {
    const feature = await prisma.feature.findFirst({
      where: { id: input.featureId, projectId: input.projectId },
      select: { id: true },
    });
    if (!feature) {
      throw new FileServiceError("FEATURE_NOT_FOUND", "Feature not found", 404);
    }
  }

  if (input.integrationId) {
    const integration = await prisma.integration.findFirst({
      where: { id: input.integrationId, projectId: input.projectId },
      select: { id: true },
    });
    if (!integration) {
      throw new FileServiceError(
        "INTEGRATION_NOT_FOUND",
        "Integration not found",
        404,
      );
    }
  }

  const signatureExpiration = new Date(Date.now() + UPLOAD_URL_EXPIRES_IN * 1000);

  const attachment = await prisma.$transaction(async (tx) => {
    const created = await tx.attachment.create({
      data: {
        projectId: input.projectId,
        featureId: input.featureId ?? null,
        integrationId: input.integrationId ?? null,
        fileName,
        storagePath: "pending",
        contentType: input.contentType,
        byteSize: input.byteSize ?? null,
        status: "created",
        signatureExpiration,
      },
    });

    const storagePath = buildIntakeS3Key(input.clientId, created.id);
    return tx.attachment.update({
      where: { id: created.id },
      data: { storagePath },
    });
  });

  try {
    const upload = await getUploadUrl({
      s3Key: attachment.storagePath,
      contentType: input.contentType,
    });

    return {
      attachment,
      uploadUrl: upload.uploadUrl,
      expiresIn: upload.expiresIn,
      bucket: upload.bucket,
    };
  } catch (error) {
    await prisma.attachment
      .delete({ where: { id: attachment.id } })
      .catch(() => undefined);
    throw error;
  }
}

export async function verifyAttachmentUpload(input: {
  clientId: string;
  attachmentId: string;
}): Promise<VerifyAttachmentResult> {
  const attachment = await getOwnedAttachment(input);

  if (attachment.status === "uploaded") {
    return {
      attachment,
      verifiedContentType: attachment.contentType,
      verifiedSizeBytes: attachment.byteSize ?? 0,
    };
  }

  let metadata: Awaited<ReturnType<typeof headObject>>;
  try {
    metadata = await headObject(attachment.storagePath);
  } catch (error) {
    await destroyFailedUpload(attachment);
    throw new FileServiceError(
      "FILE_VERIFICATION_ERROR",
      `Failed to verify file: ${error instanceof Error ? error.message : String(error)}`,
      500,
    );
  }

  if (!metadata) {
    await destroyFailedUpload(attachment);
    throw new FileServiceError(
      "FILE_NOT_FOUND",
      "File not found in storage. Upload may have failed or expired.",
      404,
    );
  }

  const actualContentType = metadata.contentType ?? "";
  const claimedContentType = attachment.contentType;

  if (!isAllowedContentType(actualContentType)) {
    await destroyFailedUpload(attachment);
    throw new FileServiceError(
      "FILE_VERIFICATION_ERROR",
      `Invalid Content-Type: '${actualContentType}'.`,
    );
  }

  if (actualContentType !== claimedContentType) {
    await destroyFailedUpload(attachment);
    throw new FileServiceError(
      "FILE_VERIFICATION_ERROR",
      `Content-Type mismatch. Expected '${claimedContentType}', got '${actualContentType}'.`,
    );
  }

  const actualSize = metadata.contentLength ?? 0;
  if (actualSize > MAX_FILE_SIZE_BYTES) {
    await destroyFailedUpload(attachment);
    throw new FileServiceError(
      "FILE_VERIFICATION_ERROR",
      `File size ${actualSize} bytes exceeds maximum allowed size of ${MAX_FILE_SIZE_BYTES} bytes`,
    );
  }

  if (attachment.byteSize && actualSize > attachment.byteSize * 1.1) {
    await destroyFailedUpload(attachment);
    throw new FileServiceError(
      "FILE_VERIFICATION_ERROR",
      `File size ${actualSize} significantly exceeds claimed size ${attachment.byteSize}`,
    );
  }

  const header = await getObjectHeadBytes(attachment.storagePath);
  if (header && !matchesMagic(header, actualContentType)) {
    await destroyFailedUpload(attachment);
    throw new FileServiceError(
      "FILE_VERIFICATION_ERROR",
      `File signature does not match Content-Type '${actualContentType}'`,
    );
  }

  const updated = await prisma.attachment.update({
    where: { id: attachment.id },
    data: {
      status: "uploaded",
      contentType: actualContentType,
      byteSize: actualSize,
    },
  });

  return {
    attachment: updated,
    verifiedContentType: actualContentType,
    verifiedSizeBytes: actualSize,
  };
}

export async function getOwnedAttachment(input: {
  clientId: string;
  attachmentId: string;
}): Promise<OwnedAttachment> {
  const attachment = await prisma.attachment.findFirst({
    where: {
      id: input.attachmentId,
      project: { business: { clientId: input.clientId } },
    },
    include: ownedInclude,
  });

  if (!attachment) {
    throw new FileServiceError("FILE_NOT_FOUND", "File not found", 404);
  }

  return attachment;
}

export async function deleteOwnedAttachment(input: {
  clientId: string;
  attachmentId: string;
}): Promise<Attachment> {
  const attachment = await getOwnedAttachment(input);
  await deleteObject(attachment.storagePath);
  await prisma.attachment.delete({ where: { id: attachment.id } });
  return attachment;
}

async function destroyFailedUpload(attachment: Attachment): Promise<void> {
  await deleteObject(attachment.storagePath);
  await prisma.attachment
    .delete({ where: { id: attachment.id } })
    .catch(() => undefined);
}

function matchesMagic(header: Uint8Array, contentType: string): boolean {
  if (contentType === "text/plain" || contentType === "text/csv") {
    return true;
  }

  if (contentType === "application/pdf") {
    return (
      header[0] === 0x25 &&
      header[1] === 0x50 &&
      header[2] === 0x44 &&
      header[3] === 0x46
    );
  }

  if (contentType === "image/jpeg") {
    return header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  }

  if (contentType === "image/png") {
    return (
      header[0] === 0x89 &&
      header[1] === 0x50 &&
      header[2] === 0x4e &&
      header[3] === 0x47 &&
      header[4] === 0x0d &&
      header[5] === 0x0a &&
      header[6] === 0x1a &&
      header[7] === 0x0a
    );
  }

  if (contentType === "image/webp") {
    const asText = String.fromCharCode(...header.slice(0, 12));
    return asText.startsWith("RIFF") && asText.includes("WEBP");
  }

  if (contentType === "image/gif") {
    const asText = String.fromCharCode(...header.slice(0, 6));
    return asText.startsWith("GIF87a") || asText.startsWith("GIF89a");
  }

  if (
    contentType === "application/zip" ||
    contentType === "application/x-zip-compressed" ||
    contentType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    contentType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    contentType ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    return header[0] === 0x50 && header[1] === 0x4b;
  }

  if (
    contentType === "application/msword" ||
    contentType === "application/vnd.ms-excel" ||
    contentType === "application/vnd.ms-powerpoint"
  ) {
    return (
      header[0] === 0xd0 &&
      header[1] === 0xcf &&
      header[2] === 0x11 &&
      header[3] === 0xe0
    );
  }

  return false;
}
