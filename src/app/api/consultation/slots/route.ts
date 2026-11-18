import { NextResponse } from "next/server";

import { listOpenSlots, loadConsultant } from "@/lib/consultation/schedule";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const consultant = await loadConsultant();
  if (!consultant) {
    return NextResponse.json({
      open: false,
      message: "Online booking is not open yet.",
    });
  }

  const slots = await listOpenSlots(consultant);
  return NextResponse.json(slots);
}
