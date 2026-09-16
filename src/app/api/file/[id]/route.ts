import { NextResponse } from "next/server";

import {
  isIntakeAuthFailure,
  jsonError,
  requireIntakeToken,
} from "@/lib/intake/require-token";
import {
  deleteOwnedAttachment,
  FileServiceError,
  getOwnedAttachment,
} from "@/lib/storage/fileService";
import { getReadUrl } from "@/lib/storage/s3";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/** Token-scoped signed GET URL for a verified attachment. */
export async function GET(request: Request, context: RouteContext) {
  const auth = await requireIntakeToken(request);
  if (isIntakeAuthFailure(auth)) {
    return auth.response;
  }

  const { id } = await context.params;
  if (!id) {
    return jsonError("file id is required");
  }

  try {
    const attachment = await getOwnedAttachment({
      clientId: auth.access.clientId,
      attachmentId: id,
    });

    if (attachment.status !== "uploaded") {
      return NextResponse.json(
        {
          error: "FILE_NOT_READY",
          message: `File status is '${attachment.status}'. Verify upload first.`,
        },
        { status: 409 },
      );
    }

    const readUrl = await getReadUrl(attachment.storagePath);

    return NextResponse.json({
      attachment: {
        id: attachment.id,
        fileName: attachment.fileName,
        contentType: attachment.contentType,
        byteSize: attachment.byteSize,
        status: attachment.status,
      },
      read_url: readUrl,
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
        error: "FILE_READ_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to resolve file",
      },
      { status: 500 },
    );
  }
}

/** Owner-scoped delete: remove object from storage, then Attachment row. */
export async function DELETE(request: Request, context: RouteContext) {
  const auth = await requireIntakeToken(request);
  if (isIntakeAuthFailure(auth)) {
    return auth.response;
  }

  const { id } = await context.params;
  if (!id) {
    return jsonError("file id is required");
  }

  try {
    const deleted = await deleteOwnedAttachment({
      clientId: auth.access.clientId,
      attachmentId: id,
    });

    return NextResponse.json({
      attachment_id: deleted.id,
      deleted: true,
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
        error: "FILE_DELETE_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to delete file",
      },
      { status: 500 },
    );
  }
}
