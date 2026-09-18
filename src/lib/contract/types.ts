import type { IntakeSnapshot } from "@/lib/intake/types";

export type ContractSignerRole = "client" | "hhais";

export type ContractExhibitScope = "project" | "feature" | "integration";

export type ContractExhibit = {
  /** Appendix item label, e.g. "A.1" */
  reference: string;
  attachmentId: string;
  fileName: string;
  contentType: string;
  scope: ContractExhibitScope;
  scopeName: string;
};

export type ContractSignatureView = {
  signedAt: string | null;
  signerName: string | null;
  signatureDataUrl: string | null;
};

export type ContractRecordView = {
  id: string;
  client: ContractSignatureView;
  hhais: ContractSignatureView;
  finalPdfPath: string | null;
  lockedAt: string | null;
};

export type ContractPageData = {
  snapshot: IntakeSnapshot;
  contract: ContractRecordView | null;
  exhibits: ContractExhibit[];
  isAdmin: boolean;
};

export type SignContractPayload = {
  token: string;
  admin: boolean;
  signerName: string;
  /** PNG data URL from the signature canvas */
  signatureDataUrl: string;
};

export type SignContractResult =
  | { ok: true; page: ContractPageData }
  | { ok: false; error: string };
