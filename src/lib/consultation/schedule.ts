import "server-only";

import type { User } from "../../../generated/prisma/client";

import { prisma } from "@/lib/prisma";

import { parseAvailability, windowsOnDay } from "./availability";
import { GoogleCalendarError, getGoogleAccessToken, googleBusy } from "./google";
import {
  addCivilDays,
  civilDateInZone,
  formatInZone,
  weekdayIndex,
  zonedDateTimeToUtc,
} from "./time";

export type OpenSlot = {
  start: string;
  end: string;
  label: string;
};

export type OpenDay = {
  date: string;
  label: string;
  slots: OpenSlot[];
};

const CLOSED = "Online booking is not open yet.";

export async function loadConsultant() {
  return prisma.user.findFirst({
    where: { availability: { not: "" } },
    orderBy: { id: "asc" },
  });
}

export async function listOpenSlots(user: User, now = new Date()): Promise<
  | { open: false; message: string }
  | { open: true; timeZone: string; slotMinutes: number; days: OpenDay[] }
> {
  const parsed = parseAvailability(user.availability);
  if (!parsed.ok || parsed.windows.length === 0 || !user.googleRefreshToken) {
    return { open: false, message: CLOSED };
  }

  const timeZone = user.timeZone || "America/Chicago";
  const slotMinutes = user.slotMinutes;
  const earliest = new Date(now.getTime() + user.minNoticeHours * 60 * 60 * 1000);
  const firstDay = civilDateInZone(earliest, timeZone);
  const lastDay = addCivilDays(firstDay, user.horizonDays);
  const rangeStart = zonedDateTimeToUtc(firstDay, 0, 0, timeZone);
  const rangeEnd = zonedDateTimeToUtc(lastDay, 0, 0, timeZone);

  let busy: { start: string; end: string }[];
  try {
    const accessToken = await getGoogleAccessToken(user.id, user.googleRefreshToken);
    busy = await googleBusy(accessToken, rangeStart, rangeEnd);
  } catch (error) {
    if (error instanceof GoogleCalendarError) {
      return { open: false, message: CLOSED };
    }
    throw error;
  }

  const bookings = await prisma.consultation.findMany({
    where: {
      userId: user.id,
      startsAt: { lt: rangeEnd },
      endsAt: { gt: rangeStart },
    },
    select: { startsAt: true, endsAt: true },
  });
  const blocked = [
    ...busy.map((interval) => ({
      start: new Date(interval.start).getTime(),
      end: new Date(interval.end).getTime(),
    })),
    ...bookings.map((booking) => ({
      start: booking.startsAt.getTime(),
      end: booking.endsAt.getTime(),
    })),
  ];

  const stepMs = slotMinutes * 60 * 1000;
  const days: OpenDay[] = [];

  for (let offset = 0; offset < user.horizonDays; offset += 1) {
    const date = addCivilDays(firstDay, offset);
    const dayWindows = windowsOnDay(parsed.windows, weekdayIndex(date, timeZone));
    const slots: OpenSlot[] = [];

    for (const window of dayWindows) {
      let cursor = zonedDateTimeToUtc(
        date,
        Math.floor(window.startMinute / 60),
        window.startMinute % 60,
        timeZone,
      );
      const windowEnd =
        window.endMinute >= 24 * 60
          ? zonedDateTimeToUtc(addCivilDays(date, 1), 0, 0, timeZone)
          : zonedDateTimeToUtc(
              date,
              Math.floor(window.endMinute / 60),
              window.endMinute % 60,
              timeZone,
            );
      if (cursor < earliest) {
        const steps = Math.ceil((earliest.getTime() - cursor.getTime()) / stepMs);
        cursor = new Date(cursor.getTime() + steps * stepMs);
      }

      while (cursor.getTime() + stepMs <= windowEnd.getTime()) {
        const end = new Date(cursor.getTime() + stepMs);
        const overlaps = blocked.some(
          (interval) => cursor.getTime() < interval.end && end.getTime() > interval.start,
        );
        if (!overlaps) {
          slots.push({
            start: cursor.toISOString(),
            end: end.toISOString(),
            label: formatInZone(cursor, timeZone, {
              hour: "numeric",
              minute: "2-digit",
            }),
          });
        }
        cursor = end;
      }
    }

    if (slots.length > 0) {
      const noon = zonedDateTimeToUtc(date, 12, 0, timeZone);
      days.push({
        date: `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`,
        label: formatInZone(noon, timeZone, {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        slots: dedupeSlots(slots),
      });
    }
  }

  return { open: true, timeZone, slotMinutes, days };
}

export function findSlot(days: OpenDay[], start: string) {
  for (const day of days) {
    const slot = day.slots.find((item) => item.start === start);
    if (slot) {
      return slot;
    }
  }
  return null;
}

function dedupeSlots(slots: OpenSlot[]) {
  const seen = new Set<string>();
  return slots.filter((slot) => {
    if (seen.has(slot.start)) {
      return false;
    }
    seen.add(slot.start);
    return true;
  });
}
