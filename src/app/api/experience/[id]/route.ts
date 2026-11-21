import { NextResponse } from "next/server";

import {
  isUserAuthFailure,
  jsonError,
  requireUser,
} from "@/lib/auth/require-user";
import {
  hasExperienceWriteFields,
  readExperienceWriteInput,
} from "@/lib/experience/input";
import { experienceErrorResponse } from "@/lib/experience/response";
import {
  deleteOwnedExperience,
  getOwnedExperience,
  serializeExperience,
  updateOwnedExperience,
} from "@/lib/experience/service";

export const runtime = "nodejs";

const SIGN_IN_MESSAGE = "Sign in to manage experience cards.";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/** Read one experience card owned by the signed-in user. */
export async function GET(_request: Request, context: RouteContext) {
  const authResult = await requireUser(SIGN_IN_MESSAGE);
  if (isUserAuthFailure(authResult)) {
    return authResult.response;
  }

  const { id } = await context.params;
  if (!id) {
    return jsonError("experience id is required");
  }

  try {
    const experience = await getOwnedExperience({
      userId: authResult.userId,
      id,
    });
    return NextResponse.json(serializeExperience(experience));
  } catch (error) {
    return experienceErrorResponse(error, "Failed to read experience");
  }
}

/** Update one experience card owned by the signed-in user. */
export async function PATCH(request: Request, context: RouteContext) {
  const authResult = await requireUser(SIGN_IN_MESSAGE);
  if (isUserAuthFailure(authResult)) {
    return authResult.response;
  }

  const { id } = await context.params;
  if (!id) {
    return jsonError("experience id is required");
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
  if (!hasExperienceWriteFields(parsed.input)) {
    return jsonError("No fields to update");
  }

  try {
    const experience = await updateOwnedExperience({
      userId: authResult.userId,
      id,
      role: parsed.input.role,
      company: parsed.input.company,
      url: parsed.input.url,
      location: parsed.input.location,
      dates: parsed.input.dates,
      highlights: parsed.input.highlights,
      sortOrder: parsed.input.sortOrder,
    });

    return NextResponse.json(serializeExperience(experience));
  } catch (error) {
    return experienceErrorResponse(error, "Failed to update experience");
  }
}

/** Delete one experience card owned by the signed-in user. */
export async function DELETE(_request: Request, context: RouteContext) {
  const authResult = await requireUser(SIGN_IN_MESSAGE);
  if (isUserAuthFailure(authResult)) {
    return authResult.response;
  }

  const { id } = await context.params;
  if (!id) {
    return jsonError("experience id is required");
  }

  try {
    const deleted = await deleteOwnedExperience({
      userId: authResult.userId,
      id,
    });

    return NextResponse.json({
      id: deleted.id,
      deleted: true,
    });
  } catch (error) {
    return experienceErrorResponse(error, "Failed to delete experience");
  }
}
