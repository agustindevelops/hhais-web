export type CivilDate = {
  year: number;
  month: number;
  day: number;
};

const WEEKDAY_INDEX: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

export function civilDateInZone(date: Date, timeZone: string): CivilDate {
  const parts = dateParts(date, timeZone);
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
  };
}

export function addCivilDays(date: CivilDate, days: number): CivilDate {
  const shifted = new Date(Date.UTC(date.year, date.month - 1, date.day + days));
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

export function weekdayIndex(date: CivilDate, timeZone: string) {
  const noon = zonedDateTimeToUtc(date, 12, 0, timeZone);
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
  }).format(noon);
  return WEEKDAY_INDEX[name] ?? 0;
}

export function zonedDateTimeToUtc(
  date: CivilDate,
  hour: number,
  minute: number,
  timeZone: string,
) {
  const guess = new Date(Date.UTC(date.year, date.month - 1, date.day, hour, minute, 0));
  const corrected = new Date(guess.getTime() - zoneOffsetMs(guess, timeZone));
  return new Date(guess.getTime() - zoneOffsetMs(corrected, timeZone));
}

export function formatInZone(
  date: Date,
  timeZone: string,
  options: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat("en-US", { timeZone, ...options }).format(date);
}

export function isValidTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

function zoneOffsetMs(date: Date, timeZone: string) {
  const parts = dateParts(date, timeZone);
  let hour = Number(parts.hour);
  if (hour === 24) {
    hour = 0;
  }
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    hour,
    Number(parts.minute),
    Number(parts.second),
  );
  return asUtc - date.getTime();
}

function dateParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);

  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}
