import { NextResponse } from "next/server";

import { experienceErrorResponse } from "@/lib/experience/response";
import { getAgustinPortfolio } from "@/lib/experience/service";

export const runtime = "nodejs";

/** Public portfolio for Agustin. Currently the experience cards. */
export async function GET() {
  try {
    const portfolio = await getAgustinPortfolio();
    if (!portfolio) {
      return NextResponse.json(
        { error: "PORTFOLIO_NOT_FOUND", message: "Portfolio not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(portfolio);
  } catch (error) {
    return experienceErrorResponse(error, "Failed to read Agustin portfolio");
  }
}
