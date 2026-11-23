import { NextResponse } from "next/server";

import { experienceErrorResponse } from "@/lib/experience/response";
import { listPortfolioExperience } from "@/lib/experience/service";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ username: string }>;
};

const USERNAME = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$/;

/**
 * Public experience cards for one user.
 * Each item matches the portfolio experience card.
 */
export async function GET(_request: Request, context: RouteContext) {
  const username = (await context.params).username.trim().toLowerCase();
  if (!USERNAME.test(username)) {
    return NextResponse.json(
      { error: "PORTFOLIO_NOT_FOUND", message: "Portfolio not found" },
      { status: 404 },
    );
  }

  try {
    const experience = await listPortfolioExperience(username);
    if (!experience) {
      return NextResponse.json(
        { error: "PORTFOLIO_NOT_FOUND", message: "Portfolio not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ experience });
  } catch (error) {
    return experienceErrorResponse(error, "Failed to read portfolio experience");
  }
}
