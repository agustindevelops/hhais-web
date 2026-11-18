import { NextResponse } from "next/server";

import { createGoogleEvent, getGoogleAccessToken } from "@/lib/consultation/google";
import { findSlot, listOpenSlots, loadConsultant } from "@/lib/consultation/schedule";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    start?: string;
    name?: string;
    email?: string;
    note?: string;
  } | null;

  const start = body?.start?.trim() ?? "";
  const name = body?.name?.trim() ?? "";
  const email = body?.email?.trim().toLowerCase() ?? "";
  const note = body?.note?.trim() ?? "";

  if (!start || !name || name.length > 80) {
    return NextResponse.json({ message: "Name is required." }, { status: 400 });
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 160) {
    return NextResponse.json(
      { message: "A valid email is required." },
      { status: 400 },
    );
  }
  if (note.length > 1000) {
    return NextResponse.json(
      { message: "Keep the note under 1000 characters." },
      { status: 400 },
    );
  }

  const consultant = await loadConsultant();
  if (!consultant?.googleRefreshToken) {
    return NextResponse.json(
      { message: "Online booking is not open yet." },
      { status: 503 },
    );
  }

  const slots = await listOpenSlots(consultant);
  if (!slots.open) {
    return NextResponse.json({ message: slots.message }, { status: 503 });
  }
  const slot = findSlot(slots.days, start);
  if (!slot) {
    return NextResponse.json(
      { message: "That time is no longer open. Pick another one." },
      { status: 409 },
    );
  }

  const startsAt = new Date(slot.start);
  const endsAt = new Date(slot.end);
  const booking = await prisma.consultation.create({
    data: {
      userId: consultant.id,
      name,
      email,
      note,
      startsAt,
      endsAt,
    },
  });

  try {
    const accessToken = await getGoogleAccessToken(
      consultant.id,
      consultant.googleRefreshToken,
    );
    const event = await createGoogleEvent({
      accessToken,
      requestId: booking.id,
      name,
      email,
      note,
      startsAt,
      endsAt,
      timeZone: consultant.timeZone,
    });
    await prisma.consultation.update({
      where: { id: booking.id },
      data: { googleEventId: event.id },
    });

    return NextResponse.json({
      ok: true,
      label: slot.label,
      meetUrl: event.meetUrl,
    });
  } catch {
    await prisma.consultation.delete({ where: { id: booking.id } });
    return NextResponse.json(
      { message: "That time could not be booked. Pick another one." },
      { status: 503 },
    );
  }
}
