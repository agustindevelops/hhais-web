"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { SelectField, TextAreaField, TextField } from "@/components/fields";
import { formatAvailability } from "@/lib/consultation/availability";

type AvailabilityFormProps = {
  availability: string;
  timeZone: string;
  slotMinutes: number;
  horizonDays: number;
  minNoticeHours: number;
  googleEmail: string | null;
  googleConfigured: boolean;
  redirectUri: string;
  notice: string | null;
};

const TIME_ZONES = [
  "America/Chicago",
  "America/New_York",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
];

export default function AvailabilityForm({
  availability,
  timeZone,
  slotMinutes,
  horizonDays,
  minNoticeHours,
  googleEmail,
  googleConfigured,
  redirectUri,
  notice,
}: AvailabilityFormProps) {
  const router = useRouter();
  const [hours, setHours] = useState(availability);
  const [zone, setZone] = useState(timeZone);
  const [slot, setSlot] = useState(String(slotMinutes));
  const [horizon, setHorizon] = useState(String(horizonDays));
  const [noticeHours, setNoticeHours] = useState(String(minNoticeHours));
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(notice);
  const [busy, setBusy] = useState<"save" | "disconnect" | null>(null);

  const preview = formatAvailability(hours);

  const save = async () => {
    setBusy("save");
    setError(null);
    setSaved(null);
    const response = await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        availability: hours,
        timeZone: zone,
        slotMinutes: Number(slot),
        horizonDays: Number(horizon),
        minNoticeHours: Number(noticeHours),
      }),
    });
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    setBusy(null);
    if (!response.ok) {
      setError(body?.message || "Availability could not be saved.");
      return;
    }
    setSaved("Availability saved.");
    router.refresh();
  };

  const disconnect = async () => {
    setBusy("disconnect");
    setError(null);
    const response = await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disconnectGoogle: true }),
    });
    setBusy(null);
    if (!response.ok) {
      setError("Google Calendar could not be disconnected.");
      return;
    }
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {saved ? <p className="text-sm text-primary">{saved}</p> : null}
      <TextAreaField
        id="availability"
        label="Weekly hours"
        value={hours}
        onChange={(event) => setHours(event.target.value)}
        rows={5}
        placeholder={"m-f:12:3\nsa:10:1"}
        hint="One rule per line. m-f:12:3 is Monday–Friday, noon to 3pm. 9:5 is 9am to 5pm. 1:4 is 1pm to 4pm. Minutes use a hyphen: 9:30-5."
        error={preview.ok ? undefined : preview.error}
      />
      {preview.ok && preview.lines.length > 0 ? (
        <ul className="space-y-1 text-sm text-default-200">
          {preview.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField
          id="slot-minutes"
          label="Slot length"
          value={slot}
          onChange={(event) => setSlot(event.target.value)}
        >
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
          <option value="60">60 minutes</option>
        </SelectField>
        <TextField
          id="horizon-days"
          label="Days ahead"
          type="number"
          min={1}
          max={60}
          value={horizon}
          onChange={(event) => setHorizon(event.target.value)}
        />
        <TextField
          id="notice-hours"
          label="Minimum notice (hours)"
          type="number"
          min={0}
          max={168}
          value={noticeHours}
          onChange={(event) => setNoticeHours(event.target.value)}
        />
      </div>

      <SelectField
        id="time-zone"
        label="Time zone"
        value={zone}
        onChange={(event) => setZone(event.target.value)}
      >
        {TIME_ZONES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </SelectField>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <button
        type="button"
        onClick={save}
        disabled={busy !== null}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
      >
        {busy === "save" ? "Saving…" : "Save availability"}
      </button>

      <section className="rounded-2xl border border-white/10 bg-default-950/40 p-5">
        <h2 className="text-sm font-medium uppercase tracking-wide text-default-400">
          Google Calendar
        </h2>
        <p className="mt-3 text-sm text-default-200">
          {googleEmail
            ? `Connected as ${googleEmail}. Busy times on that calendar are removed from the hours above.`
            : "Connect Google Calendar so booked events block consultation times."}
        </p>
        {redirectUri ? (
          <p className="mt-3 text-sm text-default-400">
            Authorized redirect URI:{" "}
            <span className="break-all text-default-200">{redirectUri}</span>
          </p>
        ) : null}
        {!googleConfigured ? (
          <p className="mt-3 text-sm text-default-400">
            Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET before connecting.
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="/api/google/calendar/connect"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            {googleEmail ? "Reconnect Google Calendar" : "Connect Google Calendar"}
          </a>
          {googleEmail ? (
            <button
              type="button"
              onClick={disconnect}
              disabled={busy !== null}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:border-primary disabled:opacity-60"
            >
              {busy === "disconnect" ? "Disconnecting…" : "Disconnect"}
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
