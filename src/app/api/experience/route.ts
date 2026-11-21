import { NextResponse } from "next/server";

import {
  isUserAuthFailure,
  jsonError,
  requireUser,
} from "@/lib/auth/require-user";
import { readExperienceWriteInput } from "@/lib/experience/input";
import { experienceErrorResponse } from "@/lib/experience/response";
import {
  createOwnedExperience,
  listOwnedExperiences,
  serializeExperience,
} from "@/lib/experience/service";

export const runtime = "nodejs";

const SIGN_IN_MESSAGE = "Sign in to manage experience cards.";

/** List experience cards owned by the signed-in user. */
export async function GET() {
  const authResult = await requireUser(SIGN_IN_MESSAGE);
  if (isUserAuthFailure(authResult)) {
    return authResult.response;
  }

  try {
    const experiences = await listOwnedExperiences(authResult.userId);
    return NextResponse.json({
      experiences: experiences.map(serializeExperience),
    });
  } catch (error) {
    return experienceErrorResponse(error, "Failed to list experience");
  }
}

/** Create an experience card owned by the signed-in user. */
export async function POST(request: Request) {
  const authResult = await requireUser(SIGN_IN_MESSAGE);
  if (isUserAuthFailure(authResult)) {
    return authResult.response;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = readExperienceWriteInput(body);
  if (!parsed.ok) {
    return jsonError(parsed.message);
  }

  const { role, company, url, location, dates } = parsed.input;
  if (!role?.trim() || !company?.trim() || !url?.trim() || !location?.trim() || !dates?.trim()) {
    return jsonError("role, company, url, location, and dates are required");
  }

  try {
    const experience = await createOwnedExperience({
      userId: authResult.userId,
      role,
      company,
      url,
      location,
      dates,
      highlights: parsed.input.highlights,
      sortOrder: parsed.input.sortOrder,
    });

    return NextResponse.json(serializeExperience(experience));
  } catch (error) {
    return experienceErrorResponse(error, "Failed to create experience");
  }
}
