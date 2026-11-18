import { NextResponse } from "next/server";

import {
  isUserAuthFailure,
  jsonError,
  requireUser,
} from "@/lib/auth/require-user";
import { parseAvailability } from "@/lib/consultation/availability";
import { clearGoogleAccessToken } from "@/lib/consultation/google";
import { isValidTimeZone } from "@/lib/consultation/time";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const SLOT_MINUTES = new Set([15, 30, 45, 60]);
const TIME_ZONES = [
  "America/Chicago",
  "America/New_York",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
];

export async function POST(request: Request) {
  const authResult = await requireUser();
  if (isUserAuthFailure(authResult)) {
    return authResult.response;
  }

  const body = (await request.json().catch(() => null)) as {
    availability?: string;
    timeZone?: string;
    slotMinutes?: number;
    horizonDays?: number;
    minNoticeHours?: number;
    disconnectGoogle?: boolean;
  } | null;

  if (!body) {
    return jsonError("Availability could not be read.");
  }

  if (body.disconnectGoogle) {
    clearGoogleAccessToken(authResult.userId);
    await prisma.user.update({
      where: { id: authResult.userId },
      data: { googleRefreshToken: null, googleEmail: null },
    });
    return NextResponse.json({ ok: true });
  }

  const availability = body.availability?.trim() ?? "";
  if (availability.length > 2000) {
    return jsonError("Availability is too long.");
  }
  const parsed = parseAvailability(availability);
  if (!parsed.ok) {
    return jsonError(parsed.error);
  }

  const timeZone = body.timeZone?.trim() || "America/Chicago";
  if (!TIME_ZONES.includes(timeZone) || !isValidTimeZone(timeZone)) {
    return jsonError("Choose a supported time zone.");
  }

  const slotMinutes = Number(body.slotMinutes);
  const horizonDays = Number(body.horizonDays);
  const minNoticeHours = Number(body.minNoticeHours);
  if (!SLOT_MINUTES.has(slotMinutes)) {
    return jsonError("Choose a 15, 30, 45, or 60 minute slot.");
  }
  if (!Number.isInteger(horizonDays) || horizonDays < 1 || horizonDays > 60) {
    return jsonError("Show between 1 and 60 days ahead.");
  }
  if (!Number.isInteger(minNoticeHours) || minNoticeHours < 0 || minNoticeHours > 168) {
    return jsonError("Notice has to be between 0 and 168 hours.");
  }

  await prisma.user.update({
    where: { id: authResult.userId },
    data: { availability, timeZone, slotMinutes, horizonDays, minNoticeHours },
  });

  return NextResponse.json({ ok: true });
}
