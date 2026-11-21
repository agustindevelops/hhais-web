import { NextResponse } from "next/server";

import { ExperienceServiceError } from "@/lib/experience/service";

export function experienceErrorResponse(error: unknown, fallback: string) {
  if (error instanceof ExperienceServiceError) {
    return NextResponse.json(
      { error: error.code, message: error.message },
      { status: error.status },
    );
  }

  return NextResponse.json(
    {
      error: "EXPERIENCE_ERROR",
      message: error instanceof Error ? error.message : fallback,
    },
    { status: 500 },
  );
}
