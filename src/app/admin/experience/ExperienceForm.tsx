"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { TextAreaField, TextField } from "@/components/fields";

export type ExperienceFormValues = {
  id: string;
  role: string;
  company: string;
  url: string;
  location: string;
  dates: string;
  highlights: string;
  sortOrder: string;
};

type ExperienceFormProps = {
  mode: "create" | "edit";
  experience?: ExperienceFormValues;
};

function highlightsFromText(value: string) {
  return value
    .split("\n")
    .map((highlight) => highlight.trim())
    .filter(Boolean);
}

export default function ExperienceForm({ mode, experience }: ExperienceFormProps) {
  const router = useRouter();
  const [role, setRole] = useState(experience?.role ?? "");
  const [company, setCompany] = useState(experience?.company ?? "");
  const [url, setUrl] = useState(experience?.url ?? "");
  const [location, setLocation] = useState(experience?.location ?? "");
  const [dates, setDates] = useState(experience?.dates ?? "");
  const [highlights, setHighlights] = useState(experience?.highlights ?? "");
  const [sortOrder, setSortOrder] = useState(experience?.sortOrder ?? "");
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState<"save" | "delete" | null>(null);

  const save = async () => {
    setBusy("save");
    setError(null);
    setStatusMessage(null);

    const trimmedOrder = sortOrder.trim();
    let sortOrderValue: number | undefined;
    if (trimmedOrder) {
      sortOrderValue = Number(trimmedOrder);
      if (!Number.isInteger(sortOrderValue) || sortOrderValue < 0) {
        setError("Order must be a whole number, starting at 0.");
        setBusy(null);
        return;
      }
    }

    const payload = {
      role,
      company,
      url,
      location,
      dates,
      highlights: highlightsFromText(highlights),
      ...(sortOrderValue === undefined ? {} : { sort_order: sortOrderValue }),
    };

    try {
      const response = await fetch(
        mode === "create" ? "/api/experience" : `/api/experience/${experience?.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const body = (await response.json().catch(() => null)) as
        | { id?: string; message?: string; sort_order?: number }
        | null;

      if (!response.ok || !body?.id) {
        setError(body?.message || "Could not save this experience.");
        return;
      }

      if (mode === "create") {
        router.push(`/admin/experience/${body.id}`);
        router.refresh();
        return;
      }

      if (typeof body.sort_order === "number") {
        setSortOrder(String(body.sort_order));
      }
      setStatusMessage("Saved.");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save this experience.",
      );
    } finally {
      setBusy(null);
    }
  };

  const remove = async () => {
    if (!experience?.id) {
      return;
    }
    if (!window.confirm("Delete this experience? This cannot be undone.")) {
      return;
    }

    setBusy("delete");
    setError(null);
    setStatusMessage(null);

    try {
      const response = await fetch(`/api/experience/${experience.id}`, {
        method: "DELETE",
      });
      const body = (await response.json().catch(() => null)) as
        | { deleted?: boolean; message?: string }
        | null;

      if (!response.ok || !body?.deleted) {
        setError(body?.message || "Could not delete this experience.");
        return;
      }

      router.push("/admin/experience");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not delete this experience.",
      );
    } finally {
      setBusy(null);
    }
  };

  return (
    <form
      className="max-w-3xl space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!busy) {
          void save();
        }
      }}
    >
      <TextField
        id="experience-role"
        label="Role"
        value={role}
        onChange={(event) => setRole(event.target.value)}
        required
        maxLength={160}
        placeholder="Full Stack Senior Software Developer"
      />

      <TextField
        id="experience-company"
        label="Company"
        value={company}
        onChange={(event) => setCompany(event.target.value)}
        required
        maxLength={200}
        placeholder="Company name"
      />

      <TextField
        id="experience-url"
        label="Company URL"
        type="url"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        required
        maxLength={500}
        placeholder="https://example.com/"
      />

      <TextField
        id="experience-location"
        label="Location"
        value={location}
        onChange={(event) => setLocation(event.target.value)}
        required
        maxLength={120}
        placeholder="Cincinnati, OH"
      />

      <TextField
        id="experience-dates"
        label="Dates"
        value={dates}
        onChange={(event) => setDates(event.target.value)}
        required
        maxLength={80}
        placeholder="May 2022 – May 2026"
        hint="Shown on the card exactly as written."
      />

      <TextAreaField
        id="experience-highlights"
        label="Highlights"
        value={highlights}
        onChange={(event) => setHighlights(event.target.value)}
        rows={8}
        placeholder="One bullet per line"
        hint="Each line is one bullet on the experience card."
      />

      <TextField
        id="experience-order"
        label="Order"
        inputMode="numeric"
        value={sortOrder}
        onChange={(event) => setSortOrder(event.target.value)}
        maxLength={5}
        placeholder="Added at the end when left blank"
        hint="Lower numbers appear first. Leave blank when creating to add this card at the end."
      />

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {statusMessage ? (
        <p className="text-sm text-default-300">{statusMessage}</p>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        {mode === "edit" ? (
          <button
            type="button"
            onClick={() => void remove()}
            disabled={busy !== null}
            className="rounded-lg border border-red-400/40 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50"
          >
            {busy === "delete" ? "Deleting…" : "Delete"}
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={busy !== null}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {busy === "save"
            ? "Saving…"
            : mode === "create"
              ? "Create experience"
              : "Save changes"}
        </button>
      </div>
    </form>
  );
}
