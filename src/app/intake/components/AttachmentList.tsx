"use client";

import { ChangeEvent, useState } from "react";

import Button from "@/components/Elements/Button";
import type { IntakeAttachment } from "@/lib/intake/types";

import {
  deleteIntakeFile,
  downloadIntakeFile,
  FILE_INPUT_ACCEPT,
  uploadIntakeFile,
} from "../lib/upload";

type FileListProps = {
  token: string;
  projectId: string;
  attachments: IntakeAttachment[];
  featureId?: string | null;
  integrationId?: string | null;
  onChange: (attachments: IntakeAttachment[]) => void;
};

export default function AttachmentList({
  token,
  projectId,
  attachments,
  featureId,
  integrationId,
  onChange,
}: FileListProps) {
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    setBusy(true);
    setUploading(true);
    setError(null);
    try {
      const uploaded = await uploadIntakeFile({
        token,
        projectId,
        file,
        featureId,
        integrationId,
      });
      onChange([...attachments, uploaded]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Upload failed");
    } finally {
      setUploading(false);
      setBusy(false);
    }
  };

  const onDelete = async (attachmentId: string) => {
    setBusy(true);
    setError(null);
    try {
      await deleteIntakeFile(token, attachmentId);
      onChange(attachments.filter((attachment) => attachment.id !== attachmentId));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete file");
    } finally {
      setBusy(false);
    }
  };

  const onDownload = async (attachment: IntakeAttachment) => {
    setBusy(true);
    setError(null);
    try {
      await downloadIntakeFile(token, attachment.id, attachment.fileName);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not download file");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <ul className="space-y-2">
        {attachments.map((attachment) => (
          <li
            key={attachment.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-default-200 bg-default-50 px-3 py-2 text-sm"
          >
            <span className="min-w-0 flex-1 font-medium text-default-900">
              {attachment.fileName}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onDownload(attachment)}
                disabled={busy}
              >
                Download
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onDelete(attachment.id)}
                disabled={busy}
              >
                Remove
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <label className="inline-flex cursor-pointer items-center">
        <span className="sr-only">Upload file</span>
        <input
          type="file"
          className="block w-full text-sm text-default-700 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-primary-hover"
          accept={FILE_INPUT_ACCEPT}
          disabled={busy}
          onChange={onFileChange}
        />
      </label>
      {uploading ? (
        <p className="text-sm text-default-600">Uploading…</p>
      ) : null}
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
