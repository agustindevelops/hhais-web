import { NextResponse } from "next/server";

import { BlogServiceError } from "@/lib/blog/service";

export function blogErrorResponse(error: unknown, fallback: string) {
  if (error instanceof BlogServiceError) {
    return NextResponse.json(
      { error: error.code, message: error.message },
      { status: error.status },
    );
  }

  return NextResponse.json(
    {
      error: "BLOG_ERROR",
      message: error instanceof Error ? error.message : fallback,
    },
    { status: 500 },
  );
}
