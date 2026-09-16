import "server-only";

import { NextResponse } from "next/server";

import { validateAccessToken, type ValidClientAccess } from "@/lib/client-access";

export type IntakeAuthSuccess = {
  ok: true;
  access: ValidClientAccess;
  token: string;
};

export type IntakeAuthFailure = {
  ok: false;
  response: NextResponse;
};

export type IntakeAuthResult = IntakeAuthSuccess | IntakeAuthFailure;

export function isIntakeAuthFailure(
  result: IntakeAuthResult,
): result is IntakeAuthFailure {
  return !result.ok;
}

export async function requireIntakeToken(
  request: Request,
): Promise<IntakeAuthResult> {
  const token = new URL(request.url).searchParams.get("token") ?? undefined;
  const access = await validateAccessToken(token);

  if (!access || !token) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "Unauthorized",
          message: "This intake link is invalid or has expired.",
        },
        { status: 401 },
      ),
    };
  }

  return { ok: true, access, token };
}

export function jsonError(message: string, status = 400, code = "Bad Request") {
  return NextResponse.json({ error: code, message }, { status });
}
