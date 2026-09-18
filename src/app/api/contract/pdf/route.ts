import { NextResponse } from "next/server";

import { getExecutedPdfForToken } from "@/lib/contract/persist";
import { attachmentContentDisposition } from "@/lib/storage/s3";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? undefined;

  try {
    const pdf = await getExecutedPdfForToken(token);
    if (!pdf) {
      return NextResponse.json(
        {
          error: "PDF_NOT_FOUND",
          message:
            "Executed agreement is not available yet, or this link is invalid.",
        },
        { status: 404 },
      );
    }

    return new NextResponse(Buffer.from(pdf.bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": attachmentContentDisposition(pdf.fileName),
        "Cache-Control": "private, no-store",
        "Content-Length": String(pdf.bytes.byteLength),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "PDF_READ_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to download executed agreement",
      },
      { status: 500 },
    );
  }
}
