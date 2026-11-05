import "server-only";

import { NextResponse } from "next/server";

import { auth } from "@/auth";

export type UserAuthSuccess = {
  ok: true;
  userId: number;
};

export type UserAuthFailure = {
  ok: false;
  response: NextResponse;
};

export type UserAuthResult = UserAuthSuccess | UserAuthFailure;

export function isUserAuthFailure(
  result: UserAuthResult,
): result is UserAuthFailure {
  return !result.ok;
}

export function jsonError(message: string, status = 400, code = "Bad Request") {
  return NextResponse.json({ error: code, message }, { status });
}

export async function getSessionUserId() {
  const session = await auth();
  const id = Number(session?.user?.id);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  return id;
}

export async function requireUser(): Promise<UserAuthResult> {
  const userId = await getSessionUserId();
  if (!userId) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "Unauthorized",
          message: "Sign in to manage blog posts.",
        },
        { status: 401 },
      ),
    };
  }

  return { ok: true, userId };
}
