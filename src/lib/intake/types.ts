export const ACCOUNT_STATUSES = [
  "existing",
  "needs_creation",
  "unknown",
] as const;

export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export const PROJECT_PRIORITIES = ["time", "quality", "budget"] as const;

export type ProjectPriority = (typeof PROJECT_PRIORITIES)[number];

export const PROJECT_PRIORITY_LABELS: Record<ProjectPriority, string> = {
  time: "Time",
  quality: "Quality",
  budget: "Budget",
};

export function isProjectPriority(value: string): value is ProjectPriority {
  return (PROJECT_PRIORITIES as readonly string[]).includes(value);
}

export function normalizeProjectPriorities(
  values: readonly string[] | null | undefined,
): ProjectPriority[] {
  const seen = new Set<ProjectPriority>();
  const ordered: ProjectPriority[] = [];

  for (const value of values ?? []) {
    if (isProjectPriority(value) && !seen.has(value)) {
      seen.add(value);
      ordered.push(value);
    }
  }

  for (const value of PROJECT_PRIORITIES) {
    if (!seen.has(value)) {
      ordered.push(value);
    }
  }

  return ordered;
}

export function parseFee(value: string): number | null {
  const trimmed = value.trim().replace(/[$,]/g, "");
  if (!trimmed) {
    return null;
  }

  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return null;
  }

  const amount = Number(trimmed);
  if (!Number.isFinite(amount) || amount < 0) {
    return null;
  }

  return Math.round(amount * 100) / 100;
}

export function formatFee(value: number): string {
  return value.toFixed(2);
}

export type IntakeAttachment = {
  id: string;
  fileName: string;
  contentType: string;
  byteSize: number | null;
  featureId: string | null;
  integrationId: string | null;
};

export type IntakeFeature = {
  id: string;
  name: string;
  descriptionMarkdown: string;
  sortOrder: number;
  integrationIds: string[];
  attachments: IntakeAttachment[];
};

export type IntakeIntegration = {
  id: string;
  name: string;
  descriptionMarkdown: string;
  accountStatus: AccountStatus;
  accountEmail: string;
  featureIds: string[];
  attachments: IntakeAttachment[];
};

export type IntakeSnapshot = {
  token: string;
  business: {
    id: string;
    name: string;
    legalName: string;
    domain: string;
    website: string;
  };
  contact: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  project: {
    id: string;
    name: string;
    descriptionMarkdown: string;
    additionalNotesMarkdown: string;
    fee: string;
    priorities: ProjectPriority[];
    submittedAt: string | null;
  };
  features: IntakeFeature[];
  integrations: IntakeIntegration[];
  generalAttachments: IntakeAttachment[];
};

export type IntakeSavePayload = {
  token: string;
  business: {
    name: string;
    legalName: string;
    domain: string;
    website: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  project: {
    name: string;
    descriptionMarkdown: string;
    additionalNotesMarkdown: string;
    fee: string;
    priorities: ProjectPriority[];
  };
  features: Array<{
    id: string;
    name: string;
    descriptionMarkdown: string;
    sortOrder: number;
    attachmentIds: string[];
  }>;
  integrations: Array<{
    id: string;
    name: string;
    descriptionMarkdown: string;
    accountStatus: AccountStatus;
    accountEmail: string;
    featureIds: string[];
    attachmentIds: string[];
  }>;
  generalAttachmentIds: string[];
};

export type IntakeActionResult =
  | { ok: true; snapshot: IntakeSnapshot }
  | { ok: false; error: string };
