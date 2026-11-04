import { NextResponse } from "next/server";
import NextAuth from "next-auth";

import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

function withRobotsHeader(response: NextResponse) {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const isAdmin = pathname.startsWith("/admin");
  const isAuth = pathname.startsWith("/auth");

  if (isAdmin && !request.auth) {
    const loginUrl = new URL("/auth/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return withRobotsHeader(NextResponse.redirect(loginUrl));
  }

  if (isAdmin || isAuth) {
    return withRobotsHeader(NextResponse.next());
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin", "/admin/:path*", "/auth/:path*"],
};
