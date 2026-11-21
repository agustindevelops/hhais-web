export type ExperienceWriteInput = {
  role?: string;
  company?: string;
  url?: string;
  location?: string;
  dates?: string;
  highlights?: string[];
  sortOrder?: number;
};

export type ExperienceInputResult =
  | { ok: true; input: ExperienceWriteInput }
  | { ok: false; message: string };

function readOptionalString(
  record: Record<string, unknown>,
  key: string,
): { ok: true; present: boolean; value?: string } | { ok: false; message: string } {
  if (!(key in record)) {
    return { ok: true, present: false };
  }
  if (typeof record[key] !== "string") {
    return { ok: false, message: `${key} must be a string` };
  }
  return { ok: true, present: true, value: record[key] };
}

function readHighlights(
  record: Record<string, unknown>,
): { ok: true; present: boolean; value?: string[] } | { ok: false; message: string } {
  if (!("highlights" in record)) {
    return { ok: true, present: false };
  }
  const value = record.highlights;
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    return { ok: false, message: "highlights must be an array of strings" };
  }
  return { ok: true, present: true, value };
}

function readSortOrder(
  record: Record<string, unknown>,
): { ok: true; present: boolean; value?: number } | { ok: false; message: string } {
  if (!("sort_order" in record)) {
    return { ok: true, present: false };
  }
  const value = record.sort_order;
  if (typeof value !== "number" || !Number.isInteger(value)) {
    return { ok: false, message: "sort_order must be an integer" };
  }
  return { ok: true, present: true, value };
}

export function readExperienceWriteInput(body: unknown): ExperienceInputResult {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Invalid JSON body" };
  }

  const record = body as Record<string, unknown>;
  const input: ExperienceWriteInput = {};

  for (const key of ["role", "company", "url", "location", "dates"] as const) {
    const field = readOptionalString(record, key);
    if (!field.ok) return field;
    if (field.present) input[key] = field.value;
  }

  const highlights = readHighlights(record);
  if (!highlights.ok) return highlights;
  if (highlights.present) input.highlights = highlights.value;

  const sortOrder = readSortOrder(record);
  if (!sortOrder.ok) return sortOrder;
  if (sortOrder.present) input.sortOrder = sortOrder.value;

  return { ok: true, input };
}

export function hasExperienceWriteFields(input: ExperienceWriteInput) {
  return (
    input.role !== undefined ||
    input.company !== undefined ||
    input.url !== undefined ||
    input.location !== undefined ||
    input.dates !== undefined ||
    input.highlights !== undefined ||
    input.sortOrder !== undefined
  );
}
