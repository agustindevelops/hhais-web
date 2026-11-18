import { NextResponse } from "next/server";

import { getSessionUserId } from "@/lib/auth/require-user";
import { googleConfigured, googleConnectUrl } from "@/lib/consultation/google";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    const login = new URL("/auth/login", request.url);
    login.searchParams.set("callbackUrl", "/admin/availability");
    return NextResponse.redirect(login);
  }

  if (!googleConfigured()) {
    const back = new URL("/admin/availability", request.url);
    back.searchParams.set("google", "missing");
    return NextResponse.redirect(back);
  }

  return NextResponse.redirect(googleConnectUrl(new URL(request.url).origin, userId));
}
