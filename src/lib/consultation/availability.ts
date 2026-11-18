const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const DAY_INDEX: Record<string, number> = {
  m: 0,
  mon: 0,
  monday: 0,
  t: 1,
  tu: 1,
  tue: 1,
  tuesday: 1,
  w: 2,
  wed: 2,
  wednesday: 2,
  th: 3,
  thu: 3,
  thursday: 3,
  f: 4,
  fri: 4,
  friday: 4,
  sa: 5,
  sat: 5,
  saturday: 5,
  su: 6,
  sun: 6,
  sunday: 6,
};

export type AvailabilityWindow = {
  days: number[];
  startMinute: number;
  endMinute: number;
};

export type AvailabilityParseResult =
  | { ok: true; windows: AvailabilityWindow[] }
  | { ok: false; error: string };

export function parseAvailability(value: string): AvailabilityParseResult {
  const lines = value
    .split(/[;\n]/)
    .map((line) => line.trim())
    .filter(Boolean);

  const windows: AvailabilityWindow[] = [];

  for (const line of lines) {
    const compact = line.replace(/\s+/g, "").toLowerCase();
    const splitAt = compact.indexOf(":");
    if (splitAt <= 0 || splitAt === compact.length - 1) {
      return {
        ok: false,
        error: `"${line}" needs days and hours, like m-f:12:3.`,
      };
    }

    const days = parseDays(compact.slice(0, splitAt));
    if (typeof days === "string") {
      return { ok: false, error: days };
    }

    const ranges = compact.slice(splitAt + 1).split(",").filter(Boolean);
    if (ranges.length === 0) {
      return { ok: false, error: `"${line}" is missing hours.` };
    }

    for (const range of ranges) {
      const parsed = parseRange(range);
      if (typeof parsed === "string") {
        return { ok: false, error: `${parsed} Check "${line}".` };
      }
      windows.push({ days, ...parsed });
    }
  }

  return { ok: true, windows };
}

export function windowsOnDay(windows: AvailabilityWindow[], day: number) {
  return windows.filter((window) => window.days.includes(day));
}

export function formatAvailability(value: string) {
  const parsed = parseAvailability(value);
  if (!parsed.ok) {
    return parsed;
  }
  if (parsed.windows.length === 0) {
    return { ok: true as const, lines: [] as string[] };
  }

  return {
    ok: true as const,
    lines: parsed.windows.map(
      (window) =>
        `${formatDays(window.days)} · ${formatClock(window.startMinute)} – ${formatClock(window.endMinute)}`,
    ),
  };
}

function parseDays(value: string): number[] | string {
  const pieces = value.split(",").filter(Boolean);
  if (pieces.length === 0) {
    return "Add at least one day, such as m-f.";
  }

  const days = new Set<number>();
  for (const piece of pieces) {
    const [startToken, endToken, extra] = piece.split("-");
    if (!startToken || extra !== undefined) {
      return `"${piece}" is not a day range.`;
    }
    const start = DAY_INDEX[startToken];
    if (start === undefined) {
      return `Unknown day "${startToken}". Use m, t, w, th, f, sa, or su.`;
    }
    if (!endToken) {
      days.add(start);
      continue;
    }
    const end = DAY_INDEX[endToken];
    if (end === undefined) {
      return `Unknown day "${endToken}". Use m, t, w, th, f, sa, or su.`;
    }
    let cursor = start;
    for (let count = 0; count < 7; count += 1) {
      days.add(cursor);
      if (cursor === end) {
        break;
      }
      cursor = (cursor + 1) % 7;
    }
  }

  return [...days].sort((left, right) => left - right);
}

function parseRange(value: string): { startMinute: number; endMinute: number } | string {
  if (value.includes("-")) {
    const [startToken, endToken, extra] = value.split("-");
    if (!startToken || !endToken || extra !== undefined) {
      return "Use one hyphen in a time range, like 9:30-5.";
    }
    const start = parseClock(startToken);
    const end = parseClock(endToken);
    if (start === null || end === null) {
      return "Use hours like 12:3, or minutes like 9:30-5.";
    }
    return normalizeRange(start, end);
  }

  const [startToken, endToken, extra] = value.split(":");
  if (!startToken || !endToken || extra !== undefined) {
    return "Use hours like 12:3, or minutes like 9:30-5.";
  }
  if (endToken.length === 2 && Number(endToken) <= 59 && (Number(endToken) <= 12 || Number(endToken) > 23)) {
    return "Add the end time with a hyphen, like 9:30-5.";
  }
  const startHour = parseHour(startToken);
  const endHour = parseHour(endToken);
  if (startHour === null || endHour === null) {
    return "Hours need to be between 0 and 23.";
  }
  return normalizeRange(startHour * 60, endHour * 60);
}

function parseClock(value: string) {
  const [hourToken, minuteToken, extra] = value.split(":");
  if (!hourToken || extra !== undefined) {
    return null;
  }
  const hour = parseHour(hourToken);
  if (hour === null) {
    return null;
  }
  if (minuteToken === undefined) {
    return hour * 60;
  }
  if (!/^\d{2}$/.test(minuteToken)) {
    return null;
  }
  const minute = Number(minuteToken);
  if (minute > 59) {
    return null;
  }
  return hour * 60 + minute;
}

function parseHour(value: string) {
  if (!/^\d{1,2}$/.test(value)) {
    return null;
  }
  const hour = Number(value);
  if (hour > 23) {
    return null;
  }
  return hour;
}

function normalizeRange(start: number, end: number) {
  let startMinute = start;
  let endMinute = end;
  const startHour = Math.floor(startMinute / 60);
  const endHour = Math.floor(endMinute / 60);

  if (startHour <= 7 && endHour <= 7 && endMinute > startMinute) {
    startMinute += 12 * 60;
    endMinute += 12 * 60;
  } else if (endMinute <= startMinute && endHour <= 12) {
    endMinute += 12 * 60;
  }

  if (endMinute <= startMinute || endMinute > 24 * 60) {
    return "That window ends before it starts.";
  }

  return { startMinute, endMinute };
}

function formatDays(days: number[]) {
  const sorted = [...new Set(days)].sort((left, right) => left - right);
  const parts: string[] = [];
  let index = 0;

  while (index < sorted.length) {
    let end = index;
    while (end + 1 < sorted.length && sorted[end + 1] === sorted[end] + 1) {
      end += 1;
    }
    parts.push(
      end === index
        ? DAY_NAMES[sorted[index]]
        : `${DAY_NAMES[sorted[index]]}–${DAY_NAMES[sorted[end]]}`,
    );
    index = end + 1;
  }

  return parts.join(", ");
}

function formatClock(minute: number) {
  const date = new Date(Date.UTC(2026, 0, 1, Math.floor(minute / 60), minute % 60));
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);
}
