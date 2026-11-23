import { NextResponse } from "next/server";

import { portfolioUsername } from "@/lib/auth/username";
import { experienceErrorResponse } from "@/lib/experience/response";
import { getPortfolio } from "@/lib/experience/service";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ username: string }>;
};

/** Public portfolio for one user. Currently the experience cards. */
export async function GET(_request: Request, context: RouteContext) {
  const username = portfolioUsername((await context.params).username);
  if (!username) {
    return NextResponse.json(
      { error: "PORTFOLIO_NOT_FOUND", message: "Portfolio not found" },
      { status: 404 },
    );
  }

  try {
    const portfolio = await getPortfolio(username);
    if (!portfolio) {
      return NextResponse.json(
        { error: "PORTFOLIO_NOT_FOUND", message: "Portfolio not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(portfolio);
  } catch (error) {
    return experienceErrorResponse(error, "Failed to read portfolio");
  }
}
