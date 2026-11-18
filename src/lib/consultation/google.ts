import "server-only";

import { createHmac, timingSafeEqual } from "crypto";

const STATE_TTL_MS = 15 * 60 * 1000;
const GOOGLE_SCOPES = [
  "openid",
  "email",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.freebusy",
].join(" ");

type TokenCache = {
  accessToken: string;
  expiresAt: number;
};

const accessTokens = new Map<number, TokenCache>();

export class GoogleCalendarError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GoogleCalendarError";
  }
}

export function googleRedirectUri(origin: string) {
  return `${origin}/api/google/calendar/callback`;
}

export function googleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function signGoogleState(userId: number) {
  const payload = Buffer.from(
    JSON.stringify({ userId, exp: Date.now() + STATE_TTL_MS }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readGoogleState(state: string) {
  const [payload, signature] = state.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      userId?: number;
      exp?: number;
    };
    if (typeof data.userId !== "number" || typeof data.exp !== "number") {
      return null;
    }
    if (data.exp < Date.now()) {
      return null;
    }
    return data.userId;
  } catch {
    return null;
  }
}

export function googleConnectUrl(origin: string, userId: number) {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", requiredEnv("GOOGLE_CLIENT_ID"));
  url.searchParams.set("redirect_uri", googleRedirectUri(origin));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", GOOGLE_SCOPES);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("state", signGoogleState(userId));
  return url;
}

export async function exchangeGoogleCode(origin: string, code: string) {
  const body = new URLSearchParams({
    code,
    client_id: requiredEnv("GOOGLE_CLIENT_ID"),
    client_secret: requiredEnv("GOOGLE_CLIENT_SECRET"),
    redirect_uri: googleRedirectUri(origin),
    grant_type: "authorization_code",
  });
  const token = await requestToken(body);
  const email = await googleEmail(token.access_token);
  return { refreshToken: token.refresh_token, email };
}

export async function getGoogleAccessToken(userId: number, refreshToken: string) {
  const cached = accessTokens.get(userId);
  if (cached && cached.expiresAt > Date.now() + 30_000) {
    return cached.accessToken;
  }

  const body = new URLSearchParams({
    client_id: requiredEnv("GOOGLE_CLIENT_ID"),
    client_secret: requiredEnv("GOOGLE_CLIENT_SECRET"),
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });
  const token = await requestToken(body);
  accessTokens.set(userId, {
    accessToken: token.access_token,
    expiresAt: Date.now() + token.expires_in * 1000,
  });
  return token.access_token;
}

export function clearGoogleAccessToken(userId: number) {
  accessTokens.delete(userId);
}

export async function googleBusy(
  accessToken: string,
  timeMin: Date,
  timeMax: Date,
) {
  const response = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      items: [{ id: "primary" }],
    }),
  });
  const payload = (await response.json()) as {
    calendars?: { primary?: { busy?: { start: string; end: string }[] } };
    error?: { message?: string };
  };
  if (!response.ok) {
    throw new GoogleCalendarError(
      payload.error?.message || "Google Calendar could not be read.",
    );
  }
  return payload.calendars?.primary?.busy ?? [];
}

export async function createGoogleEvent(input: {
  accessToken: string;
  requestId: string;
  name: string;
  email: string;
  note: string;
  startsAt: Date;
  endsAt: Date;
  timeZone: string;
}) {
  const event = {
    summary: `Free consultation with ${input.name}`,
    description: [`Email: ${input.email}`, input.note.trim()]
      .filter(Boolean)
      .join("\n\n"),
    start: { dateTime: input.startsAt.toISOString(), timeZone: input.timeZone },
    end: { dateTime: input.endsAt.toISOString(), timeZone: input.timeZone },
    attendees: [{ email: input.email }],
  };

  const withMeet = await insertEvent(input.accessToken, input.requestId, event, true);
  if (withMeet.ok) {
    return { id: withMeet.id, meetUrl: withMeet.meetUrl };
  }

  const created = await insertEvent(input.accessToken, input.requestId, event, false);
  if (!created.ok) {
    throw new GoogleCalendarError(
      "The consultation could not be added to Google Calendar.",
    );
  }
  return { id: created.id, meetUrl: created.meetUrl };
}

async function insertEvent(
  accessToken: string,
  requestId: string,
  event: {
    summary: string;
    description: string;
    start: { dateTime: string; timeZone: string };
    end: { dateTime: string; timeZone: string };
    attendees: { email: string }[];
  },
  includeMeet: boolean,
) {
  const url = new URL(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
  );
  url.searchParams.set("sendUpdates", "all");
  if (includeMeet) {
    url.searchParams.set("conferenceDataVersion", "1");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      includeMeet
        ? {
            ...event,
            conferenceData: {
              createRequest: {
                requestId,
                conferenceSolutionKey: { type: "hangoutsMeet" },
              },
            },
          }
        : event,
    ),
  });
  const payload = (await response.json()) as {
    id?: string;
    hangoutLink?: string;
    error?: { message?: string };
  };
  if (!response.ok || !payload.id) {
    if (includeMeet) {
      return { ok: false as const };
    }
    throw new GoogleCalendarError(
      payload.error?.message || "The consultation could not be added to Google Calendar.",
    );
  }
  return { ok: true as const, id: payload.id, meetUrl: payload.hangoutLink ?? null };
}

async function googleEmail(accessToken: string) {
  const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    return null;
  }
  const payload = (await response.json()) as { email?: string };
  return payload.email ?? null;
}

async function requestToken(body: URLSearchParams) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const payload = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
    refresh_token?: string;
    error_description?: string;
  };
  if (!response.ok || !payload.access_token || !payload.expires_in) {
    throw new GoogleCalendarError(
      payload.error_description || "Google did not return a calendar token.",
    );
  }
  return {
    access_token: payload.access_token,
    expires_in: payload.expires_in,
    refresh_token: payload.refresh_token,
  };
}

function requiredEnv(name: "GOOGLE_CLIENT_ID" | "GOOGLE_CLIENT_SECRET") {
  const value = process.env[name];
  if (!value) {
    throw new GoogleCalendarError(`${name} is not set.`);
  }
  return value;
}

function sign(payload: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new GoogleCalendarError("AUTH_SECRET is not set.");
  }
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}
