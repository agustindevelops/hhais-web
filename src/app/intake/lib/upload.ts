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
  if (!input.token) {
    throw new Error("Missing intake token.");
  }

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

  let putRes: Response;
  try {
    putRes = await fetch(signJson.upload_url as string, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: input.file,
    });
  } catch {
    throw new Error(
      "Could not reach file storage. If this keeps happening, the storage CORS policy may be blocking the upload.",
    );
  }
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

export async function downloadIntakeFile(
  token: string,
  attachmentId: string,
  fileName: string,
) {
  const res = await fetch(withIntakeToken(`/api/file/${attachmentId}`, token));
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(
      typeof json.message === "string" ? json.message : "Failed to download file",
    );
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
