export const ACCOUNT_STATUSES = [
  "existing",
  "needs_creation",
  "unknown",
] as const;

export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

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
