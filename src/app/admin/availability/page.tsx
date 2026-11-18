import type { Metadata } from "next";
import { headers } from "next/headers";

import { getSessionUserId } from "@/lib/auth/require-user";
import { googleConfigured } from "@/lib/consultation/google";
import { prisma } from "@/lib/prisma";

import AdminShell from "../AdminShell";
import AvailabilityForm from "./AvailabilityForm";

export const metadata: Metadata = {
  title: "Availability",
};

const GOOGLE_NOTICES: Record<string, string> = {
  connected: "Google Calendar is connected.",
  missing: "Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, then connect again.",
  denied: "Google Calendar was not connected.",
  invalid: "The Google connection link expired. Try again.",
  "missing-refresh":
    "Google did not grant offline calendar access. Connect again and allow access.",
  error: "Google Calendar could not be connected.",
};

export default async function AvailabilityPage({
  searchParams,
}: {
  searchParams: Promise<{ google?: string }>;
}) {
  const userId = await getSessionUserId();
  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: {
          availability: true,
          timeZone: true,
          slotMinutes: true,
          horizonDays: true,
          minNoticeHours: true,
          googleEmail: true,
        },
      })
    : null;
  const { google } = await searchParams;
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") ?? "http";

  return (
    <AdminShell title="Availability" backHref="/admin">
      {user ? (
        <AvailabilityForm
          availability={user.availability}
          timeZone={user.timeZone}
          slotMinutes={user.slotMinutes}
          horizonDays={user.horizonDays}
          minNoticeHours={user.minNoticeHours}
          googleEmail={user.googleEmail}
          googleConfigured={googleConfigured()}
          redirectUri={host ? `${proto}://${host}/api/google/calendar/callback` : ""}
          notice={google ? GOOGLE_NOTICES[google] ?? null : null}
        />
      ) : (
        <p className="text-sm text-default-300">Sign in to edit availability.</p>
      )}
    </AdminShell>
  );
}
