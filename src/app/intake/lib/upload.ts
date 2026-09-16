import {
  contentTypeFromFile,
  FILE_INPUT_ACCEPT,
  MAX_FILE_SIZE_BYTES,
} from "@/lib/storage/allowed";
import type { IntakeAttachment } from "@/lib/intake/types";

export { FILE_INPUT_ACCEPT };

export function withIntakeToken(path: string, token: string) {
  const url = new URL(path, window.location.origin);
  url.searchParams.set("token", token);
  return `${url.pathname}${url.search}`;
}

export async function uploadIntakeFile(input: {
  token: string;
  projectId: string;
  file: File;
  featureId?: string | null;
  integrationId?: string | null;
}): Promise<IntakeAttachment> {
  const contentType = contentTypeFromFile(input.file);
  if (!contentType) {
    throw new Error(
      "That file type is not allowed. Upload a PDF, Office document, image, text file, or ZIP.",
    );
  }

  if (input.file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File is larger than the 15 MB limit.");
  }

  const featureId =
    input.featureId && !input.featureId.startsWith("temp_")
      ? input.featureId
      : null;
  const integrationId =
    input.integrationId && !input.integrationId.startsWith("temp_")
      ? input.integrationId
      : null;

  const signRes = await fetch(withIntakeToken("/api/file/upload", input.token), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content_type: contentType,
      byte_size: input.file.size,
      file_name: input.file.name,
      project_id: input.projectId,
      ...(featureId ? { feature_id: featureId } : {}),
      ...(integrationId ? { integration_id: integrationId } : {}),
    }),
  });
  const signJson = await signRes.json();
  if (!signRes.ok) {
    throw new Error(signJson.message ?? "Could not start file upload");
  }

  const putRes = await fetch(signJson.upload_url as string, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: input.file,
  });
  if (!putRes.ok) {
    throw new Error(`Direct upload failed (${putRes.status})`);
  }

  const verifyRes = await fetch(
    withIntakeToken("/api/file/verify", input.token),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attachment_id: signJson.attachment_id }),
    },
  );
  const verifyJson = await verifyRes.json();
  if (!verifyRes.ok) {
    throw new Error(verifyJson.message ?? "File verification failed");
  }

  const attachment = verifyJson.attachment as {
    id: string;
    fileName: string;
    contentType: string;
    byteSize: number | null;
    featureId: string | null;
    integrationId: string | null;
  };

  return {
    id: attachment.id,
    fileName: attachment.fileName,
    contentType: attachment.contentType,
    byteSize: attachment.byteSize,
    featureId: attachment.featureId,
    integrationId: attachment.integrationId,
  };
}

export async function deleteIntakeFile(token: string, attachmentId: string) {
  const res = await fetch(
    withIntakeToken(`/api/file/${attachmentId}`, token),
    { method: "DELETE" },
  );
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof json.message === "string" ? json.message : "Failed to delete file",
    );
  }
}

export async function openIntakeFile(token: string, attachmentId: string) {
  const res = await fetch(withIntakeToken(`/api/file/${attachmentId}`, token));
  const json = await res.json();
  if (!res.ok || typeof json.read_url !== "string") {
    throw new Error(
      typeof json.message === "string" ? json.message : "Failed to open file",
    );
  }
  window.open(json.read_url, "_blank", "noopener,noreferrer");
}
