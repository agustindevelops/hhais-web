import "server-only";

export {
  ALLOWED_CONTENT_TYPES,
  EXT_TO_CONTENT_TYPE,
  MAX_FILE_SIZE_BYTES,
  UPLOAD_URL_EXPIRES_IN,
  isAllowedContentType,
  type AllowedContentType,
} from "@/lib/storage/allowed";

export type StorageConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  endpoint: string;
  region: string;
};

/**
 * Parse S3_API_URL like:
 * https://<accountId>.r2.cloudflarestorage.com/<bucket>
 */
function parseS3ApiUrl(raw: string): { endpoint: string; bucket: string } | null {
  try {
    const url = new URL(raw.trim());
    const bucket = url.pathname.replace(/^\/+|\/+$/g, "").split("/")[0] ?? "";
    if (!url.origin || !bucket) {
      return null;
    }
    return {
      endpoint: url.origin,
      bucket,
    };
  } catch {
    return null;
  }
}

/**
 * Cloudflare R2 config from the three required env vars:
 *   S3_API_URL
 *   CLOUDFLARE_ACCESS_KEY_ID
 *   CLOUDFLARE_ACCESS_KEY
 */
export function getStorageConfig(): StorageConfig {
  const parsed = parseS3ApiUrl(process.env.S3_API_URL ?? "");
  const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID?.trim() ?? "";
  const secretAccessKey = process.env.CLOUDFLARE_ACCESS_KEY?.trim() ?? "";

  if (!parsed || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Storage is not configured. Set S3_API_URL, CLOUDFLARE_ACCESS_KEY_ID, and CLOUDFLARE_ACCESS_KEY.",
    );
  }

  return {
    accessKeyId,
    secretAccessKey,
    bucket: parsed.bucket,
    endpoint: parsed.endpoint,
    region: "auto",
  };
}

export function buildIntakeS3Key(clientId: string, attachmentId: string): string {
  return `${clientId}/intake/${attachmentId}`;
}

export function buildContractS3Key(
  clientId: string,
  contractId: string,
  fileName: "client-signature.png" | "hhais-signature.png" | "executed.pdf",
): string {
  return `${clientId}/contracts/${contractId}/${fileName}`;
}
