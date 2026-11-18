"use client";

import { useEffect, useState } from "react";

import { TextAreaField, TextField } from "@/components/fields";

type Slot = {
  start: string;
  label: string;
};

type Day = {
  date: string;
  label: string;
  slots: Slot[];
};

type SlotsResponse =
  | { open: false; message: string }
  | { open: true; timeZone: string; slotMinutes: number; days: Day[] };

export default function Scheduler() {
  const [slots, setSlots] = useState<SlotsResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [booked, setBooked] = useState<{ label: string; meetUrl: string | null } | null>(
    null,
  );

  const load = async () => {
    setLoadError(null);
    const response = await fetch("/api/consultation/slots");
    if (!response.ok) {
      setLoadError("Open times could not be loaded.");
      return;
    }
    const body = (await response.json()) as SlotsResponse;
    setSlots(body);
    if (body.open) {
      setSelectedDay((current) => current && body.days.some((day) => day.date === current)
        ? current
        : body.days[0]?.date ?? null);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/consultation/slots")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Open times could not be loaded.");
        }
        return (await response.json()) as SlotsResponse;
      })
      .then((body) => {
        if (!active) {
          return;
        }
        setSlots(body);
        if (body.open) {
          setSelectedDay(body.days[0]?.date ?? null);
        }
      })
      .catch(() => {
        if (active) {
          setLoadError("Open times could not be loaded.");
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const day = slots?.open ? slots.days.find((item) => item.date === selectedDay) : null;

  const book = async () => {
    if (!selectedSlot) {
      return;
    }
    setBusy(true);
    setFormError(null);
    const response = await fetch("/api/consultation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start: selectedSlot.start,
        name,
        email,
        note,
      }),
    });
    const body = (await response.json().catch(() => null)) as {
      message?: string;
      label?: string;
      meetUrl?: string | null;
    } | null;
    setBusy(false);
    if (!response.ok) {
      setFormError(body?.message || "That time could not be booked.");
      await load();
      setSelectedSlot(null);
      return;
    }
    setBooked({
      label: body?.label || selectedSlot.label,
      meetUrl: body?.meetUrl ?? null,
    });
  };

  if (booked) {
    return (
      <div className="rounded-2xl border border-white/10 bg-default-950/40 p-6 text-white">
        <h2 className="text-2xl font-semibold">You&apos;re booked</h2>
        <p className="mt-3 text-default-200">
          Your free consultation is set for {booked.label}. A calendar invite is on
          its way.
        </p>
        {booked.meetUrl ? (
          <a
            href={booked.meetUrl}
            className="mt-4 inline-flex text-primary hover:underline"
          >
            Open the meeting link
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {loadError ? <p className="text-sm text-red-300">{loadError}</p> : null}
      {!slots && !loadError ? (
        <p className="text-sm text-default-300">Loading open times…</p>
      ) : null}
      {slots && !slots.open ? (
        <p className="rounded-2xl border border-white/10 bg-default-950/40 p-6 text-default-200">
          {slots.message}
        </p>
      ) : null}
      {slots?.open ? (
        <>
          <p className="text-sm text-default-300">
            {slots.slotMinutes} minutes. Times shown in {slots.timeZone}.
          </p>
          {slots.days.length === 0 ? (
            <p className="text-default-200">No open times in the current window.</p>
          ) : (
            <>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {slots.days.map((item) => (
                  <button
                    key={item.date}
                    type="button"
                    onClick={() => {
                      setSelectedDay(item.date);
                      setSelectedSlot(null);
                    }}
                    className={
                      item.date === selectedDay
                        ? "shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
                        : "shrink-0 rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:border-primary"
                    }
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {day?.slots.map((slot) => (
                  <button
                    key={slot.start}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={
                      selectedSlot?.start === slot.start
                        ? "rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white"
                        : "rounded-lg border border-white/10 px-3 py-2 text-sm text-white hover:border-primary"
                    }
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </>
          )}
          {selectedSlot ? (
            <form
              className="space-y-4 rounded-2xl border border-white/10 bg-default-950/40 p-5"
              onSubmit={(event) => {
                event.preventDefault();
                void book();
              }}
            >
              <h2 className="text-lg font-semibold text-white">
                Book {day?.label} at {selectedSlot.label}
              </h2>
              <TextField
                id="consult-name"
                label="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={80}
              />
              <TextField
                id="consult-email"
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                maxLength={160}
              />
              <TextAreaField
                id="consult-note"
                label="What do you want to talk about?"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={4}
                maxLength={1000}
              />
              {formError ? <p className="text-sm text-red-300">{formError}</p> : null}
              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
              >
                {busy ? "Booking…" : "Confirm consultation"}
              </button>
            </form>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
