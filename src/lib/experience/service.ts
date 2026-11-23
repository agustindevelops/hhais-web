import "server-only";

import { type Experience } from "../../../generated/prisma/client";

import { prisma } from "@/lib/prisma";

const MAX_ROLE_LENGTH = 160;
const MAX_COMPANY_LENGTH = 200;
const MAX_URL_LENGTH = 500;
const MAX_LOCATION_LENGTH = 120;
const MAX_DATES_LENGTH = 80;
const MAX_HIGHLIGHTS = 24;
const MAX_HIGHLIGHT_LENGTH = 600;
const MAX_SORT_ORDER = 10_000;

/** Card fields the portfolio can render without mapping. */
export type PortfolioExperience = {
  role: string;
  company: string;
  url: string;
  location: string;
  dates: string;
  highlights: string[];
};

export class ExperienceServiceError extends Error {
  status: number;
  code: string;

  constructor(code: string, message: string, status = 400) {
    super(message);
    this.name = "ExperienceServiceError";
    this.code = code;
    this.status = status;
  }
}

export function serializePortfolioExperience(
  experience: Experience,
): PortfolioExperience {
  return {
    role: experience.role,
    company: experience.company,
    url: experience.url,
    location: experience.location,
    dates: experience.dates,
    highlights: experience.highlights,
  };
}

export function serializeExperience(experience: Experience) {
  return {
    id: experience.id,
    ...serializePortfolioExperience(experience),
    sort_order: experience.sortOrder,
  };
}

function parseRequiredText(
  value: string,
  field: string,
  maxLength: number,
) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new ExperienceServiceError(
      "INVALID_EXPERIENCE",
      `${field} is required`,
    );
  }
  if (trimmed.length > maxLength) {
    throw new ExperienceServiceError(
      "INVALID_EXPERIENCE",
      `${field} must be ${maxLength} characters or fewer`,
    );
  }
  return trimmed;
}

function parseUrl(value: string) {
  const trimmed = parseRequiredText(value, "url", MAX_URL_LENGTH);
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new ExperienceServiceError(
      "INVALID_URL",
      "url must be an http or https link",
    );
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new ExperienceServiceError(
      "INVALID_URL",
      "url must be an http or https link",
    );
  }
  return trimmed;
}

function parseHighlights(highlights: string[]) {
  const value = highlights.map((highlight) => highlight.trim()).filter(Boolean);
  if (value.length > MAX_HIGHLIGHTS) {
    throw new ExperienceServiceError(
      "INVALID_HIGHLIGHTS",
      `highlights must include ${MAX_HIGHLIGHTS} items or fewer`,
    );
  }
  const tooLong = value.find((highlight) => highlight.length > MAX_HIGHLIGHT_LENGTH);
  if (tooLong) {
    throw new ExperienceServiceError(
      "INVALID_HIGHLIGHTS",
      `each highlight must be ${MAX_HIGHLIGHT_LENGTH} characters or fewer`,
    );
  }
  return value;
}

function parseSortOrder(sortOrder: number) {
  if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > MAX_SORT_ORDER) {
    throw new ExperienceServiceError(
      "INVALID_SORT_ORDER",
      `sort_order must be an integer from 0 to ${MAX_SORT_ORDER}`,
    );
  }
  return sortOrder;
}

async function nextSortOrder(userId: number) {
  const latest = await prisma.experience.aggregate({
    where: { userId },
    _max: { sortOrder: true },
  });
  return (latest._max.sortOrder ?? -1) + 1;
}

const experienceOrder = [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }];

export async function listOwnedExperiences(userId: number) {
  return prisma.experience.findMany({
    where: { userId },
    orderBy: experienceOrder,
  });
}

async function listExperienceCards(userId: number) {
  const experiences = await prisma.experience.findMany({
    where: { userId },
    orderBy: experienceOrder,
  });
  return experiences.map(serializePortfolioExperience);
}

export async function listPortfolioExperience(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (!user) {
    return null;
  }

  return listExperienceCards(user.id);
}

const AGUSTIN_USERNAME = "agustin";

/** Portfolio sections for Agustin. More sections join this object later. */
export async function getAgustinPortfolio() {
  const experience = await listPortfolioExperience(AGUSTIN_USERNAME);
  if (!experience) {
    return null;
  }

  return { experience };
}

export async function getOwnedExperience(input: { userId: number; id: string }) {
  const experience = await prisma.experience.findFirst({
    where: { id: input.id, userId: input.userId },
  });

  if (!experience) {
    throw new ExperienceServiceError(
      "EXPERIENCE_NOT_FOUND",
      "Experience not found",
      404,
    );
  }

  return experience;
}

export async function createOwnedExperience(input: {
  userId: number;
  role: string;
  company: string;
  url: string;
  location: string;
  dates: string;
  highlights?: string[];
  sortOrder?: number;
}) {
  const role = parseRequiredText(input.role, "role", MAX_ROLE_LENGTH);
  const company = parseRequiredText(input.company, "company", MAX_COMPANY_LENGTH);
  const url = parseUrl(input.url);
  const location = parseRequiredText(input.location, "location", MAX_LOCATION_LENGTH);
  const dates = parseRequiredText(input.dates, "dates", MAX_DATES_LENGTH);
  const highlights = parseHighlights(input.highlights ?? []);
  const sortOrder =
    input.sortOrder === undefined
      ? await nextSortOrder(input.userId)
      : parseSortOrder(input.sortOrder);

  return prisma.experience.create({
    data: {
      userId: input.userId,
      role,
      company,
      url,
      location,
      dates,
      highlights,
      sortOrder,
    },
  });
}

export async function updateOwnedExperience(input: {
  userId: number;
  id: string;
  role?: string;
  company?: string;
  url?: string;
  location?: string;
  dates?: string;
  highlights?: string[];
  sortOrder?: number;
}) {
  const existing = await getOwnedExperience({
    userId: input.userId,
    id: input.id,
  });

  return prisma.experience.update({
    where: { id: existing.id },
    data: {
      role:
        input.role === undefined
          ? existing.role
          : parseRequiredText(input.role, "role", MAX_ROLE_LENGTH),
      company:
        input.company === undefined
          ? existing.company
          : parseRequiredText(input.company, "company", MAX_COMPANY_LENGTH),
      url: input.url === undefined ? existing.url : parseUrl(input.url),
      location:
        input.location === undefined
          ? existing.location
          : parseRequiredText(input.location, "location", MAX_LOCATION_LENGTH),
      dates:
        input.dates === undefined
          ? existing.dates
          : parseRequiredText(input.dates, "dates", MAX_DATES_LENGTH),
      highlights:
        input.highlights === undefined
          ? existing.highlights
          : parseHighlights(input.highlights),
      sortOrder:
        input.sortOrder === undefined
          ? existing.sortOrder
          : parseSortOrder(input.sortOrder),
    },
  });
}

export async function deleteOwnedExperience(input: { userId: number; id: string }) {
  const existing = await getOwnedExperience({
    userId: input.userId,
    id: input.id,
  });
  await prisma.experience.delete({ where: { id: existing.id } });
  return existing;
}
