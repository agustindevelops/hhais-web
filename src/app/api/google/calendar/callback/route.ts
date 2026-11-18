import { NextResponse } from "next/server";

import {
  exchangeGoogleCode,
  GoogleCalendarError,
  readGoogleState,
} from "@/lib/consultation/google";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const back = new URL("/admin/availability", url.origin);
  const error = url.searchParams.get("error");
  if (error) {
    back.searchParams.set("google", "denied");
    return NextResponse.redirect(back);
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const userId = state ? readGoogleState(state) : null;
  if (!code || !userId) {
    back.searchParams.set("google", "invalid");
    return NextResponse.redirect(back);
  }

  try {
    const token = await exchangeGoogleCode(url.origin, code);
    if (!token.refreshToken) {
      back.searchParams.set("google", "missing-refresh");
      return NextResponse.redirect(back);
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        googleRefreshToken: token.refreshToken,
        googleEmail: token.email,
      },
    });
    back.searchParams.set("google", "connected");
    return NextResponse.redirect(back);
  } catch (caught) {
    back.searchParams.set(
      "google",
      caught instanceof GoogleCalendarError ? "error" : "error",
    );
    return NextResponse.redirect(back);
  }
}
