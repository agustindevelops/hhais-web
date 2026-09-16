import { NextResponse } from "next/server";

import {
  isIntakeAuthFailure,
  jsonError,
  requireIntakeToken,
} from "@/lib/intake/require-token";
import {
  FileServiceError,
  verifyAttachmentUpload,
} from "@/lib/storage/fileService";

export const runtime = "nodejs";

/**
 * HEAD + content-type/size/magic checks. Success → status=uploaded.
 * Failure → delete object + row.
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

  const attachmentId =
    body &&
    typeof body === "object" &&
    "attachment_id" in body &&
    typeof body.attachment_id === "string"
      ? body.attachment_id
      : null;

  if (!attachmentId) {
    return jsonError("attachment_id is required");
  }

  try {
    const result = await verifyAttachmentUpload({
      clientId: auth.access.clientId,
      attachmentId,
    });

    return NextResponse.json({
      attachment: {
        id: result.attachment.id,
        projectId: result.attachment.projectId,
        featureId: result.attachment.featureId,
        integrationId: result.attachment.integrationId,
        fileName: result.attachment.fileName,
        storagePath: result.attachment.storagePath,
        contentType: result.attachment.contentType,
        byteSize: result.attachment.byteSize,
        status: result.attachment.status,
        createdAt: result.attachment.createdAt,
        updatedAt: result.attachment.updatedAt,
      },
      verified_content_type: result.verifiedContentType,
      verified_size_bytes: result.verifiedSizeBytes,
    });
  } catch (error) {
    if (error instanceof FileServiceError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      {
        error: "FILE_VERIFICATION_ERROR",
        message:
          error instanceof Error ? error.message : "File verification failed",
      },
      { status: 500 },
    );
  }
}
