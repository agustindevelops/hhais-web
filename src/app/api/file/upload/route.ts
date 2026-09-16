import { NextResponse } from "next/server";

import {
  isIntakeAuthFailure,
  jsonError,
  requireIntakeToken,
} from "@/lib/intake/require-token";
import {
  FileServiceError,
  signAttachmentUpload,
} from "@/lib/storage/fileService";

export const runtime = "nodejs";

/**
 * Create an Attachment row (status=created) and return a presigned PUT URL.
 * Client uploads bytes directly to storage, then calls /api/file/verify.
 */
export async function POST(request: Request) {
  const auth = await requireIntakeToken(request);
  if (isIntakeAuthFailure(auth)) {
    return auth.response;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  if (!body || typeof body !== "object") {
    return jsonError("Invalid JSON body");
  }

  const record = body as Record<string, unknown>;
  const contentType =
    typeof record.content_type === "string" ? record.content_type : null;
  const fileName =
    typeof record.file_name === "string" ? record.file_name : null;
  const projectId =
    typeof record.project_id === "string" ? record.project_id : null;
  const featureId =
    typeof record.feature_id === "string" ? record.feature_id : null;
  const integrationId =
    typeof record.integration_id === "string" ? record.integration_id : null;
  const byteSizeRaw = record.byte_size;
  const byteSize =
    byteSizeRaw === undefined || byteSizeRaw === null
      ? null
      : typeof byteSizeRaw === "number"
        ? byteSizeRaw
        : Number.NaN;

  if (!contentType) {
    return jsonError("content_type is required");
  }
  if (!fileName) {
    return jsonError("file_name is required");
  }
  if (!projectId) {
    return jsonError("project_id is required");
  }

  try {
    const result = await signAttachmentUpload({
      clientId: auth.access.clientId,
      projectId,
      contentType,
      fileName,
      byteSize,
      featureId,
      integrationId,
    });

    return NextResponse.json({
      attachment_id: result.attachment.id,
      file_name: result.attachment.fileName,
      upload_url: result.uploadUrl,
      storage_path: result.attachment.storagePath,
      expires_in: result.expiresIn,
      bucket: result.bucket,
      content_type: result.attachment.contentType,
      status: result.attachment.status,
      signature_expiration: result.attachment.signatureExpiration,
    });
  } catch (error) {
    if (error instanceof FileServiceError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: error.status },
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to create upload URL";
    const isConfig = message.includes("Storage is not configured");
    return NextResponse.json(
      {
        error: isConfig ? "FILE_CONFIGURATION_ERROR" : "FILE_SIGN_ERROR",
        message,
      },
      { status: isConfig ? 503 : 500 },
    );
  }
}
